// backend/seedCareGuides.js
require('dotenv').config();
const mongoose = require('mongoose');
const CareGuide = require('./models/careGuide');

// Helper to create consistent configs
const water = (stage, season, amount, freq, desc) => ({
  lifeStage: stage,
  season: season,
  amount: amount,
  frequency: freq,
  description: desc
});

const fert = (stage, season, name, dosage, freq, desc) => ({
  name: name,
  lifeStage: stage,
  season: season,
  dosage: dosage,
  frequency: freq,
  description: desc
});

const guides = [
  // 1. Basil
  {
    name: "Basil",
    scientificName: "Ocimum basilicum",
    image: "https://i.imgur.com/qZo4evT.png",
    waterConfig: [
      water("Seedling", "Spring", "50ml (Mist)", "Daily", "Keep soil surface consistently moist."),
      water("Vegetative", "Summer", "300ml", "Daily", "Basil loves water in heat; do not let wilt."),
      water("General", "Winter", "150ml", "Every 3 days", "Reduce watering as growth slows.")
    ],
    fertilizerConfig: [
      fert("Vegetative", "Summer", "Balanced Liquid Feed", "5ml/L", "Every 2 weeks", "Promotes lush green leaves.")
    ]
  },
  // 2. Rosemary
  {
    name: "Rosemary",
    scientificName: "Salvia rosmarinus",
    image: "https://i.imgur.com/ORifXCb.png",
    waterConfig: [
      water("Seedling", "Spring", "Mist", "Daily", "Keep moist until established."),
      water("General", "Summer", "200ml", "Weekly", "Allow soil to dry out completely between waterings."),
      water("General", "Winter", "100ml", "Every 2 weeks", "Very susceptible to root rot in winter.")
    ],
    fertilizerConfig: [
      fert("Vegetative", "Spring", "Fish Emulsion", "Half Strength", "Monthly", "Light feeder; do not over-fertilize.")
    ]
  },
  // 3. Mint
  {
    name: "Mint",
    scientificName: "Mentha",
    image: "https://i.imgur.com/LUAMciq.png",
    waterConfig: [
      water("General", "Summer", "Keep Moist", "Daily", "Mint loves wet feet; never let dry out."),
      water("General", "Winter", "Moderate", "Weekly", "Maintain slight moisture.")
    ],
    fertilizerConfig: [
      fert("Vegetative", "Spring", "All Purpose", "Standard", "Monthly", "Fuels rapid spread.")
    ]
  },
  // 4. Lavender
  {
    name: "Lavender",
    scientificName: "Lavandula angustifolia",
    image: "https://i.imgur.com/GwF2iDd.png",
    waterConfig: [
      water("General", "Summer", "Deep Soak", "Every 10 days", "Drought tolerant once established."),
      water("General", "Winter", "Sparingly", "Monthly", "Keep dry to prevent rot.")
    ],
    fertilizerConfig: [
      fert("General", "Spring", "Compost", "Top Dress", "Once per season", "Lavender prefers poor soil; barely needs food.")
    ]
  },
  // 5. Thyme
  {
    name: "Thyme",
    scientificName: "Thymus vulgaris",
    image: "https://i.imgur.com/8lsdr6w.png",
    waterConfig: [
      water("General", "All Year", "Light", "Bi-weekly", "Prefers dry conditions.")
    ],
    fertilizerConfig: [
      fert("General", "Spring", "None", "N/A", "N/A", "Usually does not require fertilizer.")
    ]
  },
  // 6. Cilantro
  {
    name: "Cilantro",
    scientificName: "Coriandrum sativum",
    image: "https://i.imgur.com/lCdXLAf.png",
    waterConfig: [
      water("Seedling", "Spring", "Mist", "Daily", "Taproot is sensitive; keep moist."),
      water("Vegetative", "Spring", "Moderate", "Every 2-3 days", "Heat causes bolting; keep roots cool and moist.")
    ],
    fertilizerConfig: [
      fert("Vegetative", "Spring", "Nitrogen Rich", "Standard", "Once", "Apply once when plants are 2 inches tall.")
    ]
  },
  // 7. Parsley
  {
    name: "Parsley",
    scientificName: "Petroselinum crispum",
    image: "https://i.imgur.com/p0XPFGx.png",
    waterConfig: [
      water("General", "All Year", "Consistent", "Every 3 days", "Do not let dry out completely.")
    ],
    fertilizerConfig: [
      fert("Vegetative", "Summer", "Balanced 10-10-10", "Standard", "Monthly", "Supports leafy growth.")
    ]
  },
  // 8. Aloe Vera
  {
    name: "Aloe Vera",
    scientificName: "Aloe barbadensis miller",
    image: "https://i.imgur.com/Rs6PVde.png",
    waterConfig: [
      water("General", "Summer", "Deep", "Every 3 weeks", "Soak and dry method."),
      water("General", "Winter", "None/Light", "Monthly", "Dormant in winter; barely water.")
    ],
    fertilizerConfig: [
      fert("General", "Spring", "Cactus Food", "Half Strength", "Yearly", "Fertilize once in spring.")
    ]
  },
  // 9. Snake Plant
  {
    name: "Snake Plant",
    scientificName: "Sansevieria trifasciata",
    image: "https://i.imgur.com/wLpp40s.png",
    waterConfig: [
      water("General", "All Year", "Light", "Monthly", "Let soil dry completely. Indestructible except by overwatering.")
    ],
    fertilizerConfig: [
      fert("General", "Summer", "General Purpose", "Standard", "Twice a year", "Feed in spring and summer only.")
    ]
  },
  // 10. Spider Plant
  {
    name: "Spider Plant",
    scientificName: "Chlorophytum comosum",
    image: "https://i.imgur.com/3VIEgLI.png",
    waterConfig: [
      water("General", "Summer", "Moderate", "Weekly", "Keep lightly moist."),
      water("General", "Winter", "Low", "Bi-weekly", "Allow top inch to dry.")
    ],
    fertilizerConfig: [
      fert("General", "Spring", "Liquid Houseplant", "Standard", "Monthly", "Avoid brown tips by flushing salts.")
    ]
  },
  // 11. Tomato
  {
    name: "Tomato",
    scientificName: "Solanum lycopersicum",
    image: "https://i.imgur.com/tT736tO.png",
    waterConfig: [
      water("Seedling", "Spring", "Gentle", "Daily", "Keep moist."),
      water("Vegetative", "Summer", "Deep/Heavy", "Daily", "Inconsistent watering causes blossom end rot."),
      water("Flowering", "Summer", "Consistent", "Daily", "Critical for fruit set.")
    ],
    fertilizerConfig: [
      fert("Vegetative", "Spring", "Balanced", "Standard", "At planting", "Starter fertilizer."),
      fert("Flowering", "Summer", "Tomato Food (Low N, High P)", "Label", "Every 2 weeks", "Boosts fruit production.")
    ]
  },
  // 12. Spinach
  {
    name: "Spinach",
    scientificName: "Spinacia oleracea",
    image: "https://i.imgur.com/HyV4oQP.png",
    waterConfig: [
      water("General", "Spring", "Consistent", "Every 2 days", "Dryness causes bitter taste.")
    ],
    fertilizerConfig: [
      fert("Vegetative", "Spring", "Nitrogen High", "Standard", "At planting", "Spinach needs nitrogen for green leaves.")
    ]
  },
  // 13. Lemon Balm
  {
    name: "Lemon Balm",
    scientificName: "Melissa officinalis",
    image: "https://i.imgur.com/mUgISVJ.png",
    waterConfig: [
      water("General", "Summer", "Moderate", "Every 3 days", "Will wilt if too dry.")
    ],
    fertilizerConfig: [
      fert("General", "Spring", "Balanced", "Standard", "Monthly", "Vigorous grower.")
    ]
  }
];

async function seed() {
  try {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI missing");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to Mongo...");

    await CareGuide.deleteMany({});
    console.log("Cleared old guides.");

    const res = await CareGuide.insertMany(guides);
    console.log(`Seeded ${res.length} guides.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
