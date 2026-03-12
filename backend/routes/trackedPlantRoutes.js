const express = require("express");
const dayjs = require("dayjs");
const TrackedPlant = require("../models/TrackedPlant");

const router = express.Router();

// GET all tracked plants for a specific user
router.get("/:userId", async (req, res) => {
  try {
    const plants = await TrackedPlant.find({ userId: req.params.userId });
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
        species: plant.species,
        status: plant.status,
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
  const { userId, name, species, status, plantingDate, harvestingDate } = req.body;
  if (!userId || !name || !plantingDate || !harvestingDate) {
    return res.status(400).json({ message: "userId, name, plantingDate, and harvestingDate are required" });
  }

  try {
    const plant = new TrackedPlant({
      userId,
      name,
      species: species || 'Unknown',
      status: status || 'Vegetative',
      plantingDate: new Date(plantingDate),
      harvestingDate: new Date(harvestingDate),
    });
    await plant.save();
    res.status(201).json(plant);
  } catch (err) {
    res.status(500).json({ message: "Error saving plant", error: err.message });
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
