const mongoose = require("mongoose");

const TrackedPlantSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  species: { type: String, default: 'Unknown' },
  status: { 
    type: String, 
    enum: ['Seedling', 'Vegetative', 'Flowering', 'Harvesting'], 
    default: 'Vegetative' 
  },
  plantingDate: { type: Date, required: true },
  harvestingDate: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model("TrackedPlant", TrackedPlantSchema);
