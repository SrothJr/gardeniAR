const express = require("express");
const router = express.Router();
const Growth = require("../models/Growth");

// GET all plants
router.get("/", async (req, res) => {
  try {
    const plants = await Growth.find();
    res.json(plants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single plant by name
router.get("/:name", async (req, res) => {
  try {
    const plant = await Growth.findOne({
      plantName: req.params.name
    });

    if (!plant) {
      return res.status(404).json({ message: "Plant not found" });
    }

    res.json(plant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
