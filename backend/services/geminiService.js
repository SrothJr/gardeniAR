const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class GeminiService {
  constructor() {
    this.model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });
  }

  async identifyWeed(imageBuffer, mimeType) {
    try {
      const prompt = `
        Analyze this image as an expert botanist and gardener.
        Identify if there is a weed in the image.
        
        Return the response in this strictly valid JSON format:
        {
          "isPlant": boolean,
          "isWeed": boolean,
          "name": "Common Name",
          "scientificName": "Scientific Name",
          "confidence": "High/Medium/Low",
          "description": "Brief description of visual characteristics",
          "removalInstructions": "Step-by-step organic removal instructions",
          "warning": "Any toxicity or safety warnings (e.g., poisonous sap)"
        }
        
        If no plant is detected (e.g., a person, car, empty ground), set isPlant to false and isWeed to false.
        If it is a plant but not a weed, set isPlant to true and isWeed to false.
        Do not use markdown code blocks. Just return the raw JSON string.
      `;

      const imagePart = {
        inlineData: {
          data: imageBuffer.toString("base64"),
          mimeType: mimeType,
        },
      };

      const result = await this.model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text = response.text();

      // Clean up markdown
      const cleanedText = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      return JSON.parse(cleanedText);
    } catch (error) {
      console.error("Gemini AI Error:", error);
      throw new Error("Failed to identify weed with AI.");
    }
  }

  async analyzeDisease(imageBuffer, mimeType = "image/jpeg") {
    try {
      const prompt = `Act as a plant doctor. Identify the plant and disease in this image. Provide 3 organic remedies and 1 chemical remedy. Format with clear headings.`;
      const imagePart = {
        inlineData: {
          data: imageBuffer.toString("base64"),
          mimeType,
        },
      };
      const result = await this.model.generateContent([prompt, imagePart]);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Gemini Disease Analysis Error:", error);
      throw new Error("Failed to analyze plant disease.");
    }
  }

  async parseSmartTask(userInput, localDate) {
    try {
      const today = localDate || new Date().toISOString().split('T')[0];
      const prompt = `
        You are an intelligent gardening assistant. Today's date is ${today}.
        Parse the following user input into a structured garden task.
        User Input: "${userInput}"
        
        Return a strictly valid JSON object with the following keys:
        - "title": A clean, concise title for the task.
        - "description": Any extra details extracted from the input (optional).
        - "dueDate": The date intended by the user in YYYY-MM-DD format. If no date is mentioned or implied, default to today.
        - "taskType": Must be one of: 'water', 'fertilize', 'prune', 'harvest', 'pest-control', or 'custom'.
        - "aiReasoning": A brief friendly note confirming why this was scheduled, e.g., "Scheduled for tomorrow as requested."
        
        Return ONLY valid JSON. No markdown formatting, no code blocks.
      `;

      const result = await this.model.generateContent([prompt]);
      const response = await result.response;
      let text = response.text();
      
      text = text.replace(/```json/g, "").replace(/```/g, "").trim();
      return JSON.parse(text);
    } catch (error) {
      console.error("Gemini Smart Task Error:", error);
      throw new Error("Failed to parse task from natural language.");
    }
  }

  async rescheduleTasks(overdueTasks, futureTasks, localDate) {
    try {
      const today = localDate || new Date().toISOString().split('T')[0];
      const overdueData = overdueTasks.map(t => ({
        id: t._id,
        title: t.title,
        oldDueDate: new Date(t.dueDate).toISOString().split('T')[0]
      }));
      const futureData = futureTasks.map(t => ({
        title: t.title,
        dueDate: new Date(t.dueDate).toISOString().split('T')[0]
      }));

      const prompt = `
        You are an intelligent gardening manager. Today's local date for the user is ${today}.
        
        The user has the following OVERDUE tasks that need to be rescheduled:
        ${JSON.stringify(overdueData, null, 2)}
        
        The user ALREADY HAS the following tasks scheduled for today and the future:
        ${JSON.stringify(futureData, null, 2)}
        
        Your job is to reschedule ONLY the overdue tasks so the user is not overwhelmed. 
        Look at their existing schedule. If today (${today}) already has a lot of tasks (e.g., 3 or more), 
        push the overdue tasks to tomorrow or the day after tomorrow. Do not overload any single day.
        Prioritize watering tasks to happen as soon as possible without overloading.
        
        CRITICAL RULE: You MUST NOT assign any task a "newDueDate" that is before ${today}. ALL new dates must be ${today} or later.
        
        Return a strictly valid JSON array of objects, where each object corresponds ONLY to the overdue tasks you are rescheduling:
        - "id": the original task ID of the overdue task
        - "newDueDate": The new assigned date in YYYY-MM-DD format.
        - "aiReasoning": A short, friendly explanation (e.g., "✨ Rescheduled to tomorrow because today looks busy!")
        
        Return ONLY valid JSON array. No markdown formatting, no code blocks.
      `;

      const result = await this.model.generateContent([prompt]);
      const response = await result.response;
      let text = response.text();
      
      text = text.replace(/```json/g, "").replace(/```/g, "").trim();
      return JSON.parse(text);
    } catch (error) {
      console.error("Gemini Reschedule Error:", error);
      throw new Error("Failed to reschedule tasks using AI.");
    }
  }
}

module.exports = new GeminiService();
