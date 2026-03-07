const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const dayjs = require("dayjs");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// --------------------
// MongoDB Atlas Connection
// --------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// --------------------
// Schemas & Models
// --------------------

// 1. User's Tracked Plants
const plantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  plantingDate: { type: Date, required: true },
  harvestingDate: { type: Date, required: true },
});
const Plant = mongoose.model("Plant", plantSchema);

// 2. Monthly Crop Suggestions (Moving from local object to DB)
const suggestionSchema = new mongoose.Schema({
  month: { type: Number, required: true, unique: true },
  crops: [{ type: String }]
});
const Suggestion = mongoose.model("Suggestion", suggestionSchema);

// --------------------
// Routes
// --------------------

// GET all plants with auto-cleanup for expired crops
app.get("/plants", async (req, res) => {
  try {
    const plants = await Plant.find();
    const today = dayjs();
    const response = [];

    for (const plant of plants) {
      const remainingDays = dayjs(plant.harvestingDate).diff(today, "day");

      // Auto-delete expired plants from Atlas
      if (remainingDays <= 0) {
        await Plant.findByIdAndDelete(plant._id);
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

// POST new plant
app.post("/plants", async (req, res) => {
  const { name, plantingDate, harvestingDate } = req.body;
  if (!name || !plantingDate || !harvestingDate) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const plant = new Plant({
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

// GET crop suggestions from MongoDB Atlas
app.get("/crops/:month", async (req, res) => {
  try {
    const monthNum = Number(req.params.month);
    const data = await Suggestion.findOne({ month: monthNum });
    
    if (data) {
      res.json(data.crops);
    } else {
      res.status(404).json({ message: "No suggestions found for this month" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error fetching suggestions" });
  }
});

// DELETE plant
app.delete("/plants/:id", async (req, res) => {
  try {
    await Plant.findByIdAndDelete(req.params.id);
    res.json({ message: "Plant deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting plant" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));