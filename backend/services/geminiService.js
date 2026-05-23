const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const { cleanAIJSON } = require("./aiUtils");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class GeminiService {
  constructor() {
    this.model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
  }

  async identifyWeed(imageBuffer, mimeType, language = "en") {
    try {
      const prompt = `
        Analyze this image as an expert botanist and gardener.
        Identify if there is a weed in the image.
        Respond in ${language === "bn" ? "Bengali" : "English"}.
        
        Return the response in this strictly valid JSON format:
        {
          "isPlant": boolean,
          "isWeed": boolean,
          "name": "Common Name in ${language === "bn" ? "Bengali" : "English"}",
          "scientificName": "Scientific Name",
          "confidence": "High/Medium/Low",
          "description": "Brief description in ${language === "bn" ? "Bengali" : "English"}",
          "removalInstructions": "Organic removal in ${language === "bn" ? "Bengali" : "English"}",
          "warning": "Safety warnings in ${language === "bn" ? "Bengali" : "English"}"
        }
        
        Return ONLY valid JSON.
      `;

      const result = await this.model.generateContent([
        prompt,
        {
          inlineData: {
            data: imageBuffer.toString("base64"),
            mimeType,
          },
        },
      ]);

      const response = await result.response;
      let text = response.text().trim();
      return JSON.parse(cleanAIJSON(text));
    } catch (error) {
      console.error("Gemini identifyWeed error:", error);
      throw error;
    }
  }

  async analyzeDisease(imageBuffer, mimeType = "image/jpeg", language = "en") {
    try {
      const prompt = `Act as a plant doctor. Identify the plant and disease in this image. Provide 3 organic remedies and 1 chemical remedy. Format with clear headings. Respond in ${language === "bn" ? "Bengali" : "English"}.`;
      const result = await this.model.generateContent([
        prompt,
        {
          inlineData: {
            data: imageBuffer.toString("base64"),
            mimeType,
          },
        },
      ]);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Gemini Disease Analysis Error:", error);
      throw error;
    }
  }

  async parseSmartTask(userInput, localDate, language = "en") {
    try {
      const today = localDate || new Date().toISOString().split('T')[0];
      const prompt = `
        You are an intelligent gardening assistant. Today's date is ${today}.
        Parse: "${userInput}"
        Respond in ${language === "bn" ? "Bengali" : "English"}.
        Return JSON: { "title": "...", "description": "...", "dueDate": "YYYY-MM-DD", "taskType": "...", "aiReasoning": "..." }
      `;
      const result = await this.model.generateContent(prompt);
      let text = result.response.text().trim();
      return JSON.parse(cleanAIJSON(text));
    } catch (error) {
      console.error("Gemini parseSmartTask error:", error);
      throw error;
    }
  }

  async rescheduleTasks(overdueTasks, futureTasks, localDate, language = "en") {
    try {
      const today = localDate || new Date().toISOString().split('T')[0];
      const prompt = `
        Today: ${today}. Reschedule these overdue tasks: ${JSON.stringify(overdueTasks)}.
        Respond in ${language === "bn" ? "Bengali" : "English"}.
        Return JSON array of { "id": "...", "newDueDate": "YYYY-MM-DD", "aiReasoning": "..." }
      `;
      const result = await this.model.generateContent(prompt);
      let text = result.response.text().trim();
      return JSON.parse(cleanAIJSON(text));
    } catch (error) {
      console.error("Gemini rescheduleTasks error:", error);
      throw error;
    }
  }

  async generateWeeklyRoutine(plants, existingTasks, localDate, language = "en") {
    try {
      const today = localDate || new Date().toISOString().split('T')[0];
      const prompt = `
        You are an expert gardening assistant. Today's date is ${today}.
        Generate a 7-day routine for these specific plants: ${JSON.stringify(plants)}.
        
        CRITICAL INSTRUCTIONS:
        1. Use the "name" field from each plant object in the task title (e.g., if a plant's name is "Zozo", use "Water Zozo").
        2. START the routine from TODAY (${today}). Ensure at least one task is scheduled for today if any plant needs immediate care.
        3. If a plant's cycle suggests it's late for an action (based on its life stage and the current date), schedule that task for today or even yesterday to mark it as "Overdue" for the user.
        4. Consider the "species", "status" (life stage), and dates to provide accurate care.
        5. Respond in ${language === "bn" ? "Bengali" : "English"}.
        6. Return a JSON array of objects: { "title": "...", "description": "...", "dueDate": "YYYY-MM-DD", "taskType": "...", "aiReasoning": "..." }
        
        "taskType" MUST be one of: 'water', 'fertilize', 'prune', 'harvest', 'pest-control', 'custom'.
      `;
      const result = await this.model.generateContent(prompt);
      let text = result.response.text().trim();
      return JSON.parse(cleanAIJSON(text));
    } catch (error) {
      console.error("Gemini generateWeeklyRoutine error:", error);
      throw error;
    }
  }

  async translateCareTips(careTips, language = "en") {
    if (language === "en") return careTips;
    try {
      const prompt = `
        Translate these gardening care tips into ${language === "bn" ? "Bengali" : "English"}.
        Keep the meaning precise for a gardener.
        Input: ${JSON.stringify(careTips)}
        Return ONLY a JSON array of strings.
      `;
      const result = await this.model.generateContent(prompt);
      let text = result.response.text().trim();
      return JSON.parse(cleanAIJSON(text));
    } catch (error) {
      console.error("Gemini translateCareTips error:", error);
      return careTips; // Fallback to original
    }
  }
}

module.exports = new GeminiService();
