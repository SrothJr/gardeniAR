const express = require("express");
const router = express.Router();
const { generateCaption } = require("../services/captionAIService");

router.post("/generate", async (req, res) => {
  try {
    const { imageBase64 } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: "Image missing" });
    }

    const result = await generateCaption(imageBase64);
    if (result?.unavailable) {
      return res.status(503).json({
        error: "Validation unavailable",
        reason: result.reason || "AI unavailable",
        detail: result.detail,
      });
    }
    if (result?.notGarden) {
      return res.status(422).json({
        error: "Not a plant or garden image",
        reason: result.reason || "Classifier rejected the image",
      });
    }
    if (result?.caption) {
      return res.json({ caption: result.caption });
    }
    return res.status(503).json({
      error: "Validation unavailable",
      reason: "Could not validate image (AI unavailable). Please try again later.",
      detail: result?.detail || "Unknown error",
    });
  } catch (err) {
    res.status(500).json({ error: "Caption generation failed" });
  }
});

module.exports = router;
