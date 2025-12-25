require("dotenv").config();
const mongoose = require("mongoose");
const Companion = require("./models/Companions");

const companionSeedData = [
  {
    name: "Tomato",
    companions: ["Basil", "Carrot", "Onion", "Lettuce"],
    avoided: ["Potato", "Cabbage", "Fennel"],
  },
  {
    name: "Basil",
    companions: ["Tomato", "Pepper", "Oregano"],
    avoided: ["Rue"],
  },
  {
    name: "Carrot",
    companions: ["Tomato", "Lettuce", "Pea", "Radish"],
    avoided: ["Dill", "Parsnip"],
  },
  {
    name: "Lettuce",
    companions: ["Carrot", "Radish", "Cucumber", "Strawberry"],
    avoided: ["Cabbage", "Broccoli"],
  },
  {
    name: "Potato",
    companions: ["Cabbage", "Corn", "Beans"],
    avoided: ["Tomato", "Cucumber", "Sunflower"],
  },
  {
    name: "Pepper",
    companions: ["Basil", "Onion", "Carrot"],
    avoided: ["Fennel"],
  },
  {
    name: "Cucumber",
    companions: ["Lettuce", "Radish", "Corn", "Beans"],
    avoided: ["Potato", "Sage"],
  },
];

async function seedCompanions() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    await Companion.deleteMany({});
    console.log("Old companion data removed");

    await Companion.insertMany(companionSeedData);
    console.log("Companion data seeded successfully");

    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seedCompanions();
