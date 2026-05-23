

const { generateWeatherAlertAI } = require("./weatherAIService");

async function generateWeatherAlert(weatherApiResponse) {

  // 🛑 SAFETY CHECK
  if (!weatherApiResponse || !weatherApiResponse.main) {
    throw new Error("Invalid weather data received");
  }

  // ✅ Normalize once
  const weatherData = {
    city: weatherApiResponse.name,
    temperature: weatherApiResponse.main.temp,
    humidity: weatherApiResponse.main.humidity,
    condition: weatherApiResponse.weather?.[0]?.description || "unknown"
  };

  try {
    return await generateWeatherAlertAI(weatherData);

  } catch (err) {
    console.warn("⚠ AI unavailable, using fallback alert");

    const { city, temperature, humidity, condition } = weatherData;
    const recommendations = [];

    if (temperature >= 35) {
      recommendations.push("High temperature detected. Water plants early morning or evening.");
    } else if (temperature <= 10) {
      recommendations.push("Low temperature detected. Protect sensitive plants from cold.");
    } else {
      recommendations.push("Temperature is suitable for gardening.");
    }

    if (humidity >= 80) {
      recommendations.push("High humidity detected. Watch for fungal diseases.");
    } else if (humidity <= 30) {
      recommendations.push("Low humidity detected. Consider misting plants.");
    }

    if (condition.toLowerCase().includes("rain")) {
      recommendations.push("Rain expected. Avoid watering today.");
    }

    return {
      city,
      temperature: `${temperature}°C`,
      humidity: `${humidity}%`,
      condition,
      alertSummary: "Weather-based gardening advice",
      recommendations
    };
  }
}

module.exports = { generateWeatherAlert };


