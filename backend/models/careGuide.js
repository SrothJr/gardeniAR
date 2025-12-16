const mongoose = require("mongoose");

const STAGES = ["Seedling", "Vegetative", "Flowering", "General"];
const SEASONS = ["Spring", "Summer", "Autumn", "Winter", "Monsoon", "All Year"];
const CareGuideSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    scientificName: {
      type: String,
      unique: true,
      index: true,
    },
    image: String, //link
    stageImages: {
      seedling: String,
      vegetative: String,
      flowering: String,
    },
    waterConfig: [
      {
        lifeStage: {
          type: String,
          enum: STAGES,
          required: true,
          default: "General",
        },
        amount: {
          type: String,
          default: "Standard",
        },
        frequency: {
          type: String,
          default: "Daily",
        },
        season: {
          type: String,
          enum: SEASONS,
          required: true,
          default: "All Year",
        },
        description: {
          type: String,
          default: "Will be set soon",
        },
      },
    ],

    fertilizerConfig: [
      {
        name: {
          type: String,
          required: true,
        },
        lifeStage: {
          type: String,
          enum: STAGES,
          required: true,
        },
        season: {
          type: String,
          enum: SEASONS,
          required: true,
          default: "All Year",
        },
        dosage: {
          type: String,
          default: "Check label",
        },
        frequency: {
          type: String,
          default: "Monthly",
        },
        description: { type: String, default: "Will be set soon" },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("CareGuide", CareGuideSchema);
