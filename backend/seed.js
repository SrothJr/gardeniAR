// // backend/seed.js
// require('dotenv').config();
// const mongoose = require('mongoose');
// const Plant = require('./models/plants');

// const samplePlants = [
//   {
//     name: "Basil",
//     scientificName: "Ocimum basilicum",
//     image: "https://i.imgur.com/qZo4evT.png",
//     type: "Herb",
//     sunlight: "Full",
//     water: "Medium",
//     soil: "Loamy, well-drained",
//     season: "Summer",
//     careTips: [
//       "Keep soil moist; water every 2–3 days.",
//       "Provide 6+ hours of direct sun.",
//       "Pinch leaves to encourage bushier growth."
//     ]
//   },
//   {
//     name: "Rosemary",
//     scientificName: "Salvia rosmarinus",
//     image: "https://i.imgur.com/ORifXCb.png",
//     type: "Herb",
//     sunlight: "Full",
//     water: "Low",
//     soil: "Sandy, well-drained",
//     season: "Summer",
//     careTips: [
//       "Drought tolerant; water sparingly.",
//       "Give plenty of direct sun."
//     ]
//   },
//   {
//     name: "Mint",
//     scientificName: "Mentha",
//     image: "https://i.imgur.com/LUAMciq.png",
//     type: "Herb",
//     sunlight: "Partial",
//     water: "Medium",
//     soil: "Moist, rich",
//     season: "Spring-Summer",
//     careTips: [
//       "Keep soil consistently moist.",
//       "Contain roots — grows aggressively."
//     ]
//   },
//   {
//     name: "Lavender",
//     scientificName: "Lavandula angustifolia",
//     image: "https://i.imgur.com/GwF2iDd.png",
//     type: "Herb",
//     sunlight: "Full",
//     water: "Low",
//     soil: "Sandy, well-drained",
//     season: "Summer",
//     careTips: [
//       "Avoid overwatering.",
//       "Provide full sunlight.",
//       "Prune yearly to encourage growth."
//     ]
//   },
//   {
//     name: "Thyme",
//     scientificName: "Thymus vulgaris",
//     image: "https://i.imgur.com/8lsdr6w.png",
//     type: "Herb",
//     sunlight: "Full",
//     water: "Low",
//     soil: "Dry, rocky soil",
//     season: "Summer",
//     careTips: [
//       "Water sparingly; prefers dryness.",
//       "Harvest regularly to encourage new growth.",
//       "Plant in full sun."
//     ]
//   },
//   {
//     name: "Cilantro",
//     scientificName: "Coriandrum sativum",
//     type: "Herb",
//     sunlight: "Partial",
//     water: "Medium",
//     season: "Spring",
//     soil: "Moist, well-drained",
//     image: "https://i.imgur.com/lCdXLAf.png",
//     careTips: [
//       "Needs cool temperatures to thrive.",
//       "Trim regularly to prevent bolting.",
//       "Avoid hot afternoon sun."
//     ]
//   },
//   {
//     name: "Parsley",
//     scientificName: "Petroselinum crispum",
//     type: "Herb",
//     sunlight: "Partial",
//     water: "Medium",
//     season: "Spring",
//     soil: "Moist, rich soil",
//     image: "https://i.imgur.com/p0XPFGx.png",
//     careTips: [
//       "Keep soil moist but not soggy.",
//       "Harvest from outer stems first.",
//       "Apply compost monthly."
//     ]
//   },
//   {
//     name: "Aloe Vera",
//     scientificName: "Aloe barbadensis miller",
//     type: "Succulent",
//     sunlight: "Full",
//     water: "Low",
//     season: "Summer",
//     soil: "Well-draining cactus mix",
//     image: "https://i.imgur.com/Rs6PVde.png",
//     careTips: [
//       "Water only when soil is dry.",
//       "Provide bright indirect sunlight.",
//       "Avoid freezing temperatures."
//     ]
//   },
//   {
//     name: "Snake Plant",
//     scientificName: "Sansevieria trifasciata",
//     type: "Houseplant",
//     sunlight: "Low",
//     water: "Low",
//     season: "All Year",
//     soil: "Well-draining potting mix",
//     image: "https://i.imgur.com/wLpp40s.png",
//     careTips: [
//       "Very tolerant of low light.",
//       "Let soil dry completely before watering.",
//       "Avoid cold drafts."
//     ]
//   },
//   {
//     name: "Spider Plant",
//     scientificName: "Chlorophytum comosum",
//     type: "Houseplant",
//     sunlight: "Indirect",
//     water: "Medium",
//     season: "All Year",
//     soil: "Rich, well-draining soil",
//     image: "https://i.imgur.com/3VIEgLI.png",
//     careTips: [
//       "Mist occasionally to increase humidity.",
//       "Avoid direct sunlight to prevent leaf burn.",
//       "Repot when roots crowd."
//     ]
//   },
//   {
//     name: "Tomato",
//     scientificName: "Solanum lycopersicum",
//     type: "Vegetable",
//     sunlight: "Full",
//     water: "High",
//     season: "Summer",
//     soil: "Rich, well-drained, compost added",
//     image: "https://i.imgur.com/tT736tO.png",
//     careTips: [
//       "Provide support with stakes.",
//       "Water deeply and consistently.",
//       "Full sunlight 6+ hours daily."
//     ]
//   },
//   {
//     name: "Spinach",
//     scientificName: "Spinacia oleracea",
//     type: "Vegetable",
//     sunlight: "Partial",
//     water: "Medium",
//     season: "Spring-Fall",
//     soil: "Moist, nutrient-rich",
//     image: "https://i.imgur.com/HyV4oQP.png",
//     careTips: [
//       "Prefers cooler weather.",
//       "Keep soil evenly moist.",
//       "Harvest outer leaves first."
//     ]
//   },
//   {
//     name: "Lemon Balm",
//     scientificName: "Melissa officinalis",
//     type: "Herb",
//     sunlight: "Partial",
//     water: "Medium",
//     season: "Spring-Summer",
//     soil: "Moist but well-draining",
//     image: "https://i.imgur.com/mUgISVJ.png",
//     careTips: [
//       "Spreads aggressively; consider containers.",
//       "Trim frequently to avoid flowering.",
//       "Prefers morning sun."
//     ]
//   }
// ];

// async function seed() {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log("Connected to Mongo for seeding");
//     await Plant.deleteMany({});
//     const inserted = await Plant.insertMany(samplePlants);
//     console.log("Inserted plants:", inserted.length);
//     process.exit(0);
//   } catch (err) {
//     console.error("Seed error", err);
//     process.exit(1);
//   }
// }

// seed();


// backend/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const Plant = require('./models/plants');

const samplePlants = [
  {
    name: "Basil",
    scientificName: "Ocimum basilicum",
    image: "https://i.imgur.com/qZo4evT.png",
    type: "Herb",
    category: "herb",
    price: 40,
    sunlight: "Full",
    water: "Medium",
    soil: "Loamy, well-drained",
    season: "Summer",
    careTips: [
      "Keep soil moist; water every 2–3 days.",
      "Provide 6+ hours of direct sun.",
      "Pinch leaves to encourage bushier growth."
    ]
  },
  {
    name: "Rosemary",
    scientificName: "Salvia rosmarinus",
    image: "https://i.imgur.com/ORifXCb.png",
    type: "Herb",
    category: "herb",
    price: 45,
    sunlight: "Full",
    water: "Low",
    soil: "Sandy, well-drained",
    season: "Summer",
    careTips: [
      "Drought tolerant; water sparingly.",
      "Give plenty of direct sun."
    ]
  },
  {
    name: "Mint",
    scientificName: "Mentha",
    image: "https://i.imgur.com/LUAMciq.png",
    type: "Herb",
    category: "herb",
    price: 35,
    sunlight: "Partial",
    water: "Medium",
    soil: "Moist, rich",
    season: "Spring-Summer",
    careTips: [
      "Keep soil consistently moist.",
      "Contain roots — grows aggressively."
    ]
  },
  {
    name: "Lavender",
    scientificName: "Lavandula angustifolia",
    image: "https://i.imgur.com/GwF2iDd.png",
    type: "Herb",
    category: "herb",
    price: 50,
    sunlight: "Full",
    water: "Low",
    soil: "Sandy, well-drained",
    season: "Summer",
    careTips: [
      "Avoid overwatering.",
      "Provide full sunlight.",
      "Prune yearly to encourage growth."
    ]
  },
  {
    name: "Thyme",
    scientificName: "Thymus vulgaris",
    image: "https://i.imgur.com/8lsdr6w.png",
    type: "Herb",
    category: "herb",
    price: 30,
    sunlight: "Full",
    water: "Low",
    soil: "Dry, rocky soil",
    season: "Summer",
    careTips: [
      "Water sparingly; prefers dryness.",
      "Harvest regularly to encourage new growth.",
      "Plant in full sun."
    ]
  },
  {
    name: "Cilantro",
    scientificName: "Coriandrum sativum",
    type: "Herb",
    category: "herb",
    price: 25,
    sunlight: "Partial",
    water: "Medium",
    season: "Spring",
    soil: "Moist, well-drained",
    image: "https://i.imgur.com/lCdXLAf.png",
    careTips: [
      "Needs cool temperatures to thrive.",
      "Trim regularly to prevent bolting.",
      "Avoid hot afternoon sun."
    ]
  },
  {
    name: "Parsley",
    scientificName: "Petroselinum crispum",
    type: "Herb",
    category: "herb",
    price: 28,
    sunlight: "Partial",
    water: "Medium",
    season: "Spring",
    soil: "Moist, rich soil",
    image: "https://i.imgur.com/p0XPFGx.png",
    careTips: [
      "Keep soil moist but not soggy.",
      "Harvest from outer stems first.",
      "Apply compost monthly."
    ]
  },
  {
    name: "Aloe Vera",
    scientificName: "Aloe barbadensis miller",
    type: "Succulent",
    category: "houseplant",
    price: 60,
    sunlight: "Full",
    water: "Low",
    season: "Summer",
    soil: "Well-draining cactus mix",
    image: "https://i.imgur.com/Rs6PVde.png",
    careTips: [
      "Water only when soil is dry.",
      "Provide bright indirect sunlight.",
      "Avoid freezing temperatures."
    ]
  },
  {
    name: "Snake Plant",
    scientificName: "Sansevieria trifasciata",
    type: "Houseplant",
    category: "houseplant",
    price: 80,
    sunlight: "Low",
    water: "Low",
    season: "All Year",
    soil: "Well-draining potting mix",
    image: "https://i.imgur.com/wLpp40s.png",
    careTips: [
      "Very tolerant of low light.",
      "Let soil dry completely before watering.",
      "Avoid cold drafts."
    ]
  },
  {
    name: "Spider Plant",
    scientificName: "Chlorophytum comosum",
    type: "Houseplant",
    category: "houseplant",
    price: 55,
    sunlight: "Indirect",
    water: "Medium",
    season: "All Year",
    soil: "Rich, well-draining soil",
    image: "https://i.imgur.com/3VIEgLI.png",
    careTips: [
      "Mist occasionally to increase humidity.",
      "Avoid direct sunlight to prevent leaf burn.",
      "Repot when roots crowd."
    ]
  },
  {
    name: "Tomato",
    scientificName: "Solanum lycopersicum",
    type: "Vegetable",
    category: "vegetable",
    price: 30,
    sunlight: "Full",
    water: "High",
    season: "Summer",
    soil: "Rich, well-drained, compost added",
    image: "https://i.imgur.com/tT736tO.png",
    careTips: [
      "Provide support with stakes.",
      "Water deeply and consistently.",
      "Full sunlight 6+ hours daily."
    ]
  },
  {
    name: "Spinach",
    scientificName: "Spinacia oleracea",
    type: "Vegetable",
    category: "vegetable",
    price: 25,
    sunlight: "Partial",
    water: "Medium",
    season: "Spring-Fall",
    soil: "Moist, nutrient-rich",
    image: "https://i.imgur.com/HyV4oQP.png",
    careTips: [
      "Prefers cooler weather.",
      "Keep soil evenly moist.",
      "Harvest outer leaves first."
    ]
  },
  {
    name: "Lemon Balm",
    scientificName: "Melissa officinalis",
    type: "Herb",
    category: "herb",
    price: 35,
    sunlight: "Partial",
    water: "Medium",
    season: "Spring-Summer",
    soil: "Moist but well-draining",
    image: "https://i.imgur.com/mUgISVJ.png",
    careTips: [
      "Spreads aggressively; consider containers.",
      "Trim frequently to avoid flowering.",
      "Prefers morning sun."
    ]
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to Mongo for seeding");
    await Plant.deleteMany({});
    const inserted = await Plant.insertMany(samplePlants);
    console.log("Inserted plants:", inserted.length);
    process.exit(0);
  } catch (err) {
    console.error("Seed error", err);
    process.exit(1);
  }
}

seed();
