const mongoose = require("mongoose");

const GrowthSchema = new mongoose.Schema({
  plantName: {
    type: String,
    required: true
  },
  growthRate: {
    type: String
  },
  spread: {
    type: String
  },
  stages: [
    {
      stage: String,
      month: Number,
      height: Number
    }
  ]
});

module.exports = mongoose.model("Growth", GrowthSchema, "growth");
