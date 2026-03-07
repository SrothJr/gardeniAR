const express = require("express");
const multer = require("multer");
const geminiService = require("../services/geminiService");

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.post("/analyze", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No image uploaded" });
    const result = await geminiService.analyzeDisease(
      req.file.buffer,
      req.file.mimetype || "image/jpeg"
    );
    return res.json({ result });
  } catch (err) {
    console.error("Disease analysis error:", err);
    return res.status(500).json({ error: "Disease analysis failed." });
  }
});

module.exports = router;
