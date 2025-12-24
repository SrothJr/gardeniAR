const express = require("express");
const router = express.Router();
const { generateCaption } = require("../services/captionAIService");

router.post("/generate", async (req, res) => {
  try {
    const { imageBase64 } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: "Image missing" });
    }

    const caption = await generateCaption(imageBase64);
    res.json({ caption });
  } catch (err) {
    res.status(500).json({ error: "Caption generation failed" });
  }
});

module.exports = router;
