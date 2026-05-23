const { GoogleGenerativeAI } = require("@google/generative-ai");
const { cleanAIJSON } = require("./aiUtils");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

async function generateWeatherAlertAI(weather, language = "en") {
  const prompt = `
You are an expert gardening assistant.
Respond in ${language === "bn" ? "Bengali" : "English"}.

Weather data:
- City: ${weather.city}
- Temperature: ${weather.temperature}°C
- Humidity: ${weather.humidity}%
- Condition: ${weather.condition}

Generate a short gardening alert in ${language === "bn" ? "Bengali" : "English"} with:
- What gardeners should do today
- Any precautions
- Watering advice

Return plain text only.
`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("Weather Alert AI failed:", error);
    throw error;
  }
}

async function generateAdjustedCareAI(plantName, lifeStage, generalWater, generalFert, weather, language = "en") {
  const prompt = `
You are an expert botanist. Adjust the care for the plant "${plantName}" which is in the "${lifeStage}" stage, based on TODAY's weather, keep it within 20 words or concise.
Respond in ${language === "bn" ? "Bengali" : "English"}.

General Rules for this stage:
- Water: ${generalWater || "Standard"}
- Fertilizer: ${generalFert || "Standard"}

Today's Weather in ${weather.city}:
- Temp: ${weather.temperature}°C
- Humidity: ${weather.humidity}%
- Condition: ${weather.condition}
- Wind: ${weather.windSpeed} m/s

Output a JSON object ONLY:
{
  "waterAdvice": "Specific instruction for today in ${language === "bn" ? "Bengali" : "English"}",
  "fertilizerAdvice": "Specific instruction for today in ${language === "bn" ? "Bengali" : "English"}",
  "reasoning": "Brief explanation in ${language === "bn" ? "Bengali" : "English"} (concise, mention plant and weather)"
}
`;

  try {
    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    return JSON.parse(cleanAIJSON(text));
  } catch (error) {
    console.error("AI Care Adjustment failed:", error);
    throw error;
  }
}

module.exports = { generateWeatherAlertAI, generateAdjustedCareAI };
