const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Weed = require('./models/weedModel');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/gardeniar')
  .then(() => console.log('MongoDB Connected for Seeding'))
  .catch(err => console.log(err));

const sampleWeeds = [
  {
    name: "Dandelion",
    scientificName: "Taraxacum officinale",
    description: "Distinctive yellow flower heads that turn into white spherical seed heads. Deep taproot.",
    // Relative path to frontend public folder
    imageUrl: "/assets/dandelion.png", 
    removalInstructions: "Pull the entire plant, including the long taproot. If the root breaks, it will grow back."
  },
  {
    name: "Crabgrass",
    scientificName: "Digitaria",
    description: "Low-growing grass that spreads along the ground with branched stems. Thrives in heat.",
    imageUrl: "/assets/crabgrass.png", 
    removalInstructions: "Apply pre-emergent herbicide in spring. Pull young plants by hand before they seed."
  },
  {
    name: "White Clover",
    scientificName: "Trifolium repens",
    description: "Three-lobed leaves with white flower heads. Often attracts bees.",
    imageUrl: "/assets/clover.png",
    removalInstructions: "Nitrogen-rich soil encourages it. Hand pull or use broadleaf herbicide if desired."
  }
];

const seedDB = async () => {
  try {
    await Weed.deleteMany({}); // Clear existing data
    console.log('🧹 Cleared existing weeds...');
    
    await Weed.insertMany(sampleWeeds);
    console.log('✅ Database Seeded with LOCAL paths');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    mongoose.connection.close();
    process.exit();
  }
};

seedDB();