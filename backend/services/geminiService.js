const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class GeminiService {
  constructor() {
    // Using Experimental Flash model which usually allows free testing
    this.model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
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

      // Clean up markdown if Gemini adds it
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
}

module.exports = new GeminiService();
