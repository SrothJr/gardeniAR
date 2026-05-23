const GardenTask = require('../models/gardenTaskModel');
const geminiService = require('../services/geminiService');

// Get tasks for a specific user
exports.getTasks = async (req, res) => {
  try {
    const { userId } = req.params;
    const tasks = await GardenTask.find({ user: userId }).sort({ dueDate: 1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, userId } = req.body;
    const newTask = new GardenTask({
      title,
      description,
      dueDate,
      user: userId
    });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Toggle task completion
exports.toggleTaskStatus = async (req, res) => {
  try {
    const task = await GardenTask.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.isCompleted = !task.isCompleted;
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    await GardenTask.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Smart Add Task using Gemini
exports.smartAddTask = async (req, res) => {
  try {
    const { userInput, userId, localDate, lang } = req.body;
    if (!userInput) return res.status(400).json({ message: 'User input is required' });

    // 1. Send the natural language string to Gemini
    const aiParsedData = await geminiService.parseSmartTask(userInput, localDate, lang || "en");

    // 2. Create the new task using the structured data
    const newTask = new GardenTask({
      title: aiParsedData.title,
      description: aiParsedData.description || '',
      dueDate: new Date(aiParsedData.dueDate),
      taskType: aiParsedData.taskType || 'custom',
      aiGenerated: true,
      aiReasoning: aiParsedData.aiReasoning,
      user: userId,
      language: lang || 'en'
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Smart Add Task Error:", error);
    res.status(500).json({ message: 'Failed to process smart task. Please try again.' });
  }
};

// Optimize Overdue Tasks using Gemini
exports.optimizeTasks = async (req, res) => {
  try {
    const { allActiveTasks, localDate, lang } = req.body;
    if (!allActiveTasks || !Array.isArray(allActiveTasks) || allActiveTasks.length === 0) {
      return res.status(400).json({ message: 'Active tasks are required for optimization.' });
    }

    // 1. Separate the tasks into overdue vs. future
    const todayStr = localDate || new Date().toISOString().split('T')[0];
    const todayTime = new Date(todayStr).getTime();

    const overdueTasks = [];
    const futureTasks = [];

    allActiveTasks.forEach(task => {
      if (!task.dueDate) {
        futureTasks.push(task);
        return;
      }
      
      const taskDateStr = new Date(task.dueDate).toISOString().split('T')[0];
      const taskTime = new Date(taskDateStr).getTime();

      if (taskTime < todayTime) {
        overdueTasks.push(task);
      } else {
        futureTasks.push(task);
      }
    });

    if (overdueTasks.length === 0) {
      return res.status(400).json({ message: 'No overdue tasks to optimize.' });
    }

    // 2. Send both groups to Gemini so it has full context
    const rescheduledData = await geminiService.rescheduleTasks(overdueTasks, futureTasks, localDate, lang || "en");

    // 3. Update only the tasks that were rescheduled
    const updatePromises = rescheduledData.map(async (aiUpdate) => {
      return GardenTask.findByIdAndUpdate(aiUpdate.id, {
        dueDate: new Date(aiUpdate.newDueDate),
        aiReasoning: aiUpdate.aiReasoning,
        aiGenerated: true
      });
    });

    await Promise.all(updatePromises);
    
    res.json({ message: 'Tasks successfully optimized!' });
  } catch (error) {
    console.error("Optimize Tasks Error:", error);
    res.status(500).json({ message: 'Failed to optimize tasks. Please try again.' });
  }
};

// Generate Weekly Routine using Gemini
exports.generateRoutine = async (req, res) => {
  try {
    const { userId, localDate, lang } = req.body;
    if (!userId) return res.status(400).json({ message: 'User ID is required.' });

    // 1. Fetch user's tracked plants
    const TrackedPlant = require('../models/TrackedPlant');
    const userPlants = await TrackedPlant.find({ userId });

    if (!userPlants || userPlants.length === 0) {
      return res.status(400).json({ message: 'Please add some plants to your Plant Tracker first!' });
    }

    // 2. Fetch existing tasks for the upcoming week to prevent duplicates
    const todayStr = localDate || new Date().toISOString().split('T')[0];
    const todayStart = new Date(todayStr);
    
    // 3. Delete future AI tasks to prevent duplicates when regenerating (e.g. after language switch)
    await GardenTask.deleteMany({
      user: userId,
      dueDate: { $gte: todayStart },
      aiGenerated: true,
      isCompleted: false
    });

    // 4. Fetch existing tasks for the upcoming week to prevent duplicates (manual tasks)
    const existingTasks = await GardenTask.find({ 
      user: userId, 
      dueDate: { $gte: todayStart },
      isCompleted: false
    });

    // 5. Ask Gemini to generate tasks, passing both plants and existing tasks
    const generatedTasks = await geminiService.generateWeeklyRoutine(userPlants, existingTasks, localDate, lang || "en");

    // 6. If AI determines no new tasks are needed based on the current profile
    if (!generatedTasks || generatedTasks.length === 0) {
      return res.status(200).json({ 
        message: 'Your routine is already fully up to date for your current plants!', 
        tasksAdded: 0 
      });
    }

    // 7. Save the new tasks to the database
    const validTypes = ['water', 'fertilize', 'prune', 'harvest', 'pest-control', 'custom'];
    
    const tasksToInsert = generatedTasks.map(task => {
      let type = (task.taskType || 'custom').toLowerCase();
      if (type === 'watering') type = 'water';
      if (type === 'fertilizing') type = 'fertilize';
      if (!validTypes.includes(type)) type = 'custom';

      return {
        title: task.title,
        description: task.description || '',
        dueDate: new Date(task.dueDate),
        taskType: type,
        aiGenerated: true,
        aiReasoning: task.aiReasoning,
        user: userId,
        language: lang || 'en'
      };
    });

    const savedTasks = await GardenTask.insertMany(tasksToInsert);

    res.status(201).json({ 
      message: `Successfully generated ${savedTasks.length} new tasks for your routine!`, 
      tasksAdded: savedTasks.length 
    });
  } catch (error) {
    console.error("Generate Routine Error:", error);
    res.status(500).json({ message: 'Failed to generate routine. Please try again.' });
  }
};
