const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(
  process.env.CAM_GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

async function generateCaption(imageBase64) {
  try {
    const prompt = `
Generate a short, friendly caption for a garden photo.
Include emojis.
Keep it under 2 lines.
`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageBase64,
          mimeType: "image/jpeg",
        },
      },
    ]);

    return result.response.text().trim();
  } catch (err) {
    console.warn("⚠ AI failed, using fallback caption");

    // SMART fallback (not dumb hardcode)
    return "🌱 A peaceful moment in my garden. Nature at its best 💚";
  }
}

module.exports = { generateCaption };
