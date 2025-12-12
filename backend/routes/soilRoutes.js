// backend/routes/soilRoutes.js
// const express = require('express');
// const multer = require('multer');
// const soilService = require('../services/soilGeminiService'); // new service

// const router = express.Router();
// const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// // POST /api/soil/analyze-file
// router.post('/analyze-file', upload.single('image'), async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

//     console.log('Received file size:', req.file.size);

//     // send the buffer to the service that calls Gemini
//     // soilService will return an analysis object (or throw)
//     const analysis = await soilService.identifySoil(req.file.buffer, req.file.mimetype);

//     return res.json({ analysis });
//   } catch (err) {
//     console.error('analyze-file error:', err);
//     return res.status(500).json({ error: 'Server error', details: err.message });
//   }
// });

// module.exports = router;
// backend/routes/soilRoutes.js
const express = require("express");
const multer = require("multer");
const soilService = require("../services/soilAnalysisService");

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
});

// POST /api/soil/analyze-file
router.post("/analyze-file", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    console.log("Received soil image:", req.file.size, "bytes");

    const analysis = await soilService.analyzeSoil(
      req.file.buffer,
      req.file.mimetype
    );

    return res.json({ analysis });
  } catch (err) {
    console.error("Soil analysis route error:", err);
    return res.status(500).json({ error: "Soil analysis failed." });
  }
});

module.exports = router;
