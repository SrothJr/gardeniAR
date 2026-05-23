// backend/services/soilAnalysisService.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { cleanAIJSON } = require("./aiUtils");
require("dotenv").config();

const key = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(key);
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

module.exports = {
  async analyzeSoil(imageBuffer, mimeType = "image/jpeg", language = "en") {
    if (!key) {
      return {
        soilType: "loamy",
        ph: 6.5,
        fertility: "medium",
        description: language === "bn" ? "Gemini কী অনুপস্থিত থাকায় মক রেজাল্ট।" : "Mock result because Gemini key is missing.",
      };
    }

    const prompt = `
      Analyze this image and classify soil properties.
      Respond in ${language === "bn" ? "Bengali" : "English"}.
      Return STRICT JSON:
      {
        "soilType": "loamy | sandy | clay | silt | peat | chalk",
        "ph": number,
        "fertility": "low | medium | high",
        "description": "Short explanation in ${language === "bn" ? "Bengali" : "English"}"
      }
    `;

    try {
      const result = await model.generateContent([
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
      console.error("Soil analysis error:", error);
      throw error;
    }
  },
};
