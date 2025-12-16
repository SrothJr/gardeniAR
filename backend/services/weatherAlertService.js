// async function generateWeatherAlert(city) {
//   const apiKey = process.env.WEATHER_API_KEY;
//   const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

//   const res = await fetch(url);

//   // 🔴 IMPORTANT CHECK
//   if (!res.ok) {
//     const errorText = await res.text();
//     console.error("Weather API failed:", res.status, errorText);
//     throw new Error("Weather API request failed");
//   }

//   const weatherData = await res.json();

//   // 🔴 EXTRA SAFETY
//   if (!weatherData.main || typeof weatherData.main.temp !== "number") {
//     console.error("Invalid weather response:", weatherData);
//     throw new Error("Invalid weather data structure");
//   }

//   const temp = weatherData.main.temp;
//   const humidity = weatherData.main.humidity;
//   const condition = weatherData.weather?.[0]?.description || "unknown";

//   return {
//     city,
//     temperature: temp,
//     humidity,
//     condition,
//     alert: temp > 35
//       ? "High temperature! Water plants more frequently."
//       : "Weather conditions are suitable for gardening.",
//   };
// }

// module.exports = { generateWeatherAlert };

const { generateWeatherAlertAI } = require("./weatherAIService");

async function generateWeatherAlert(weatherApiResponse) {

  // 🛑 SAFETY CHECK
  if (!weatherApiResponse || !weatherApiResponse.main) {
    throw new Error("Invalid weather data received");
  }

  // ✅ Normalize once
  const weatherData = {
    city: weatherApiResponse.name,
    temp: weatherApiResponse.main.temp,
    humidity: weatherApiResponse.main.humidity,
    condition: weatherApiResponse.weather?.[0]?.description || "unknown"
  };

  try {
    return await generateWeatherAlertAI(weatherData);

  } catch (err) {
    console.warn("⚠ AI unavailable, using fallback alert");

    const { city, temp, humidity, condition } = weatherData;
    const recommendations = [];

    if (temp >= 35) {
      recommendations.push("High temperature detected. Water plants early morning or evening.");
    } else if (temp <= 10) {
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
      temperature: `${temp}°C`,
      humidity: `${humidity}%`,
      condition,
      alertSummary: "Weather-based gardening advice",
      recommendations
    };
  }
}

module.exports = { generateWeatherAlert };


