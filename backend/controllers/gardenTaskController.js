const GardenTask = require('../models/gardenTaskModel');

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
