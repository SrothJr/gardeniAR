// backend/services/soilAnalysisService.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

const key = process.env.SOIL_GEMINI_KEY || process.env.GEMINI_API_KEY;

let model = null;
try {
  const genAI = new GoogleGenerativeAI(key);
  model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
} catch (err) {
  console.warn("⚠ Gemini init failed, returning mock soil results.", err.message);
}

module.exports = {
  async analyzeSoil(imageBuffer, mimeType = "image/jpeg") {
    // If no Gemini key, return mock result for testing
    if (!model) {
      return {
        soilType: "loamy",
        ph: 6.5,
        fertility: "medium",
        description: "Mock result because Gemini key is missing.",
      };
    }

    try {
      const prompt = `
        Analyze this image and classify soil properties.
        Return STRICT JSON:
        {
          "soilType": "loamy | sandy | clay | silt | peat | chalk",
          "ph": number,
          "fertility": "low | medium | high",
          "description": "Short explanation"
        }
      `;

      const imagePart = {
        inlineData: {
          data: imageBuffer.toString("base64"),
          mimeType,
        },
      };

      const result = await model.generateContent([prompt, imagePart]);
      const response = result.response;
      const text = response.text();

      const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();

      return JSON.parse(cleaned);
    } catch (err) {
      console.error("Gemini Soil Error:", err);
      throw new Error("Failed to analyze soil with AI.");
    }
  },
};
