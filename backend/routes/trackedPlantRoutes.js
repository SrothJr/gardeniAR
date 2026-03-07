const express = require("express");
const dayjs = require("dayjs");
const TrackedPlant = require("../models/TrackedPlant");

const router = express.Router();

// GET all tracked plants with remaining days
router.get("/", async (req, res) => {
  try {
    const plants = await TrackedPlant.find();
    const today = dayjs();
    const response = [];

    for (const plant of plants) {
      const remainingDays = dayjs(plant.harvestingDate).diff(today, "day");

      if (remainingDays <= 0) {
        await TrackedPlant.findByIdAndDelete(plant._id);
        continue;
      }

      response.push({
        _id: plant._id,
        name: plant.name,
        plantingDate: dayjs(plant.plantingDate).format("YYYY-MM-DD"),
        harvestingDate: dayjs(plant.harvestingDate).format("YYYY-MM-DD"),
        remainingDays,
        readyToHarvest: remainingDays <= 3,
      });
    }
    res.json(response);
  } catch (err) {
    res.status(500).json({ message: "Error fetching plants", error: err.message });
  }
});

// POST new tracked plant
router.post("/", async (req, res) => {
  const { name, plantingDate, harvestingDate } = req.body;
  if (!name || !plantingDate || !harvestingDate) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const plant = new TrackedPlant({
      name,
      plantingDate: new Date(plantingDate),
      harvestingDate: new Date(harvestingDate),
    });
    await plant.save();
    res.status(201).json(plant);
  } catch (err) {
    res.status(500).json({ message: "Error saving plant" });
  }
});

// DELETE tracked plant
router.delete("/:id", async (req, res) => {
  try {
    await TrackedPlant.findByIdAndDelete(req.params.id);
    res.json({ message: "Plant deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting plant" });
  }
});

module.exports = router;
