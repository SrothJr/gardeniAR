const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Using 1.5-flash for stability and speed
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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

async function generateAdjustedCareAI(plantName, lifeStage, generalWater, generalFert, weather) {
  console.log(`Generating AI advice for: ${plantName} (${lifeStage}) in ${weather.city}`);
  
  const prompt = `
You are an expert botanist. Adjust the care for the plant "${plantName}" which is in the "${lifeStage}" stage, based on TODAY's weather, keep it within 50 words or concise.

General Rules for this stage:
- Water: ${generalWater || "Standard"}
- Fertilizer: ${generalFert || "Standard"}

Today's Weather in ${weather.city}:
- Temp: ${weather.temperature}°C
- Humidity: ${weather.humidity}%
- Condition: ${weather.condition}
- Wind: ${weather.windSpeed} m/s

Output a JSON object ONLY (no markdown):
{
  "waterAdvice": "Specific instruction for today (e.g. 'Skip watering due to rain' or 'Water deeply as it is hot' or 'water 20ml today')",
  "fertilizerAdvice": "Specific instruction for today" (e.g. 'Apply half dose due to humidity' or 'No fertilizer needed today')",
  "reasoning": "Brief explanation based on weather variables (must be concise and relevant, within 20 words and mention the plant name and life stage)"
}
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    // Clean markdown if present
    const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("AI Care Adjustment Error Details:", e);
    // Fallback
    return {
      waterAdvice: "Follow standard guide (AI unavailable)",
      fertilizerAdvice: "Follow standard guide (AI unavailable)",
      reasoning: "Service disruption: " + e.message
    };
  }
}

module.exports = { generateWeatherAlertAI, generateAdjustedCareAI };
