// backend/models/plants.js
const mongoose = require('mongoose');

const PlantSchema = new mongoose.Schema(
  {
    // 🌱 Existing fields (DO NOT TOUCH)
    name: { type: String, required: true, index: true },
    scientificName: String,
    image: String,
    type: String,          // indoor / outdoor / herb etc.
    sunlight: String,
    water: String,
    soil: String,
    season: String,
    careTips: { type: [String], default: [] },
    description: String,

    // 🛒 NEW fields (for shop integration)
    price: { type: Number },          // e.g. 40
    category: { type: String },       // fruit / vegetable / flower
  },
  { timestamps: true }
);

module.exports = mongoose.model('Plant', PlantSchema);
