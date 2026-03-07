const mongoose = require("mongoose");

const TrackedPlantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  plantingDate: { type: Date, required: true },
  harvestingDate: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model("TrackedPlant", TrackedPlantSchema);
