const express = require("express");
const { generateWeatherAlert } = require("../services/weatherAlertService");

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

    const weatherApiResponse = await weatherRes.json();

    // 2️⃣ Generate alert (AI or fallback)
    const alert = await generateWeatherAlert(weatherApiResponse);

    // 3️⃣ Send response
    res.json(alert);

  } catch (err) {
    console.error("Weather route error:", err);
    res.status(500).json({ error: "Weather alert failed" });
  }
});

module.exports = router;
