const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.WGEMINI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

async function generateWeatherAlertAI(weather) {
  const prompt = `
You are an expert gardening assistant.

Weather data:
- City: ${weather.city}
- Temperature: ${weather.temperature}°C
- Humidity: ${weather.humidity}%
- Condition: ${weather.condition}

Generate a short gardening alert with:
- What gardeners should do today
- Any precautions
- Watering advice

Return plain text only.
`;

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}

module.exports = { generateWeatherAlertAI };
