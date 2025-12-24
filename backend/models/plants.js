// backend/models/plants.js
const mongoose = require('mongoose');

const PlantSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  scientificName: String,
  image: String,
  type: String,
  sunlight: String,
  water: String,
  soil: String,
  season: String,
  careTips: { type: [String], default: [] },
  description: String
}, { timestamps: true });

module.exports = mongoose.model('Plant', PlantSchema);



