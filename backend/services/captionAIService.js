const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const candidates = ["gemini-flash-latest", "gemini-2.0-flash", "gemini-pro-latest"];

async function generateCaption(imageBuffer, mimeType) {
  let lastError = null;
  
  for (const modelName of candidates) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent([
        "Generate a very short, engaging gardening-related caption (under 10 words) for this image.",
        {
          inlineData: {
            data: imageBuffer.toString("base64"),
            mimeType,
          },
        },
      ]);

      const text = result.response.text().trim();
      if (text) return text;
    } catch (err) {
      console.warn(`⚠ Caption AI model ${modelName} failed:`, err.message);
      lastError = err;
    }
  }

  console.error("All caption AI models failed:", lastError);
  return "Happy gardening! 🌱"; // Default fallback caption
}

module.exports = { generateCaption };
