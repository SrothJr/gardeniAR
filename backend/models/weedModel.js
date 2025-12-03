const mongoose = require('mongoose');

const weedSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  scientificName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String, // URL to the transparent PNG overlay
    required: true,
  },
  removalInstructions: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Weed', weedSchema);
