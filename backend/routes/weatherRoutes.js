const express = require("express");
const { generateWeatherAlertAI, generateAdjustedCareAI } = require("../services/weatherAIService");

const router = express.Router();

const WEATHER_KEY = process.env.WEATHER_API_KEY;

router.get("/alert", async (req, res) => {
  try {
    const city = req.query.city || "Dhaka";

    // 1️⃣ Fetch weather
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_KEY}&units=metric`
    );

    if (!weatherRes.ok) {
      throw new Error("Weather API failed");
    }

    const weatherData = await weatherRes.json();
    
    // Simplify for AI
    const simpleWeather = {
      city: weatherData.name,
      temperature: weatherData.main.temp,
      humidity: weatherData.main.humidity,
      condition: weatherData.weather[0].description,
      windSpeed: weatherData.wind.speed
    };

    // 2️⃣ Generate alert (AI)
    const alert = await generateWeatherAlertAI(simpleWeather);

    // 3️⃣ Send response
    res.json({ alert, weather: simpleWeather });

  } catch (err) {
    console.error("Weather route error:", err);
    res.status(500).json({ error: "Weather alert failed" });
  }
});

// POST /api/weather/care-adjustment
router.post("/care-adjustment", async (req, res) => {
  try {
    const { lat, lon, plantName, lifeStage, generalWater, generalFert } = req.body;

    if (!lat || !lon || !plantName) {
      return res.status(400).json({ error: "Missing location or plant info" });
    }

    // 1. Fetch Weather
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_KEY}&units=metric`
    );

    if (!weatherRes.ok) {
        // Fallback or error
        console.error("Weather API error", await weatherRes.text());
        return res.status(502).json({ error: "Could not fetch local weather" });
    }

    const weatherData = await weatherRes.json();
    const simpleWeather = {
      city: weatherData.name,
      temperature: weatherData.main.temp,
      humidity: weatherData.main.humidity,
      condition: weatherData.weather[0].description,
      windSpeed: weatherData.wind.speed
    };

    // 2. Call AI with lifeStage
    const adjustment = await generateAdjustedCareAI(plantName, lifeStage || "General", generalWater, generalFert, simpleWeather);

    res.json({ adjustment, weather: simpleWeather });

  } catch (err) {
    console.error("Care adjustment error:", err);
    res.status(500).json({ error: "Failed to adjust care" });
  }
});

module.exports = router;
