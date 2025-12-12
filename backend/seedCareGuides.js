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
      // Specifics
      water("Seedling", "Spring", "50ml (Mist)", "Daily", "Keep soil surface consistently moist."),
      water("Vegetative", "Summer", "300ml", "Daily", "Basil loves water in heat."),
      // Fallbacks
      water("General", "All Year", "Moderate", "Every 3 days", "Standard basil care: keep moist but draining.")
    ],
    fertilizerConfig: [
      fert("Vegetative", "Summer", "Balanced Liquid", "5ml/L", "Every 2 weeks", "Promotes lush leaves."),
      fert("General", "All Year", "Standard Balanced", "Half Strength", "Monthly", "Regular feeding.")
    ]
  },
  // 2. Rosemary
  {
    name: "Rosemary",
    scientificName: "Salvia rosmarinus",
    image: "https://i.imgur.com/ORifXCb.png",
    waterConfig: [
      water("Seedling", "Spring", "Mist", "Daily", "Keep moist until established."),
      water("General", "Winter", "100ml", "Every 2 weeks", "Very susceptible to root rot."),
      water("General", "All Year", "Low", "Weekly", "Allow soil to dry out completely.")
    ],
    fertilizerConfig: [
      fert("General", "All Year", "Fish Emulsion", "Half Strength", "Monthly", "Light feeder.")
    ]
  },
  // 3. Mint
  {
    name: "Mint",
    scientificName: "Mentha",
    image: "https://i.imgur.com/LUAMciq.png",
    waterConfig: [
      water("General", "Summer", "Keep Moist", "Daily", "Mint loves wet feet."),
      water("General", "All Year", "Moderate", "Every 3 days", "Never let dry out fully.")
    ],
    fertilizerConfig: [
      fert("General", "All Year", "All Purpose", "Standard", "Monthly", "Fuels rapid spread.")
    ]
  },
  // 4. Lavender
  {
    name: "Lavender",
    scientificName: "Lavandula angustifolia",
    image: "https://i.imgur.com/GwF2iDd.png",
    waterConfig: [
      water("General", "Summer", "Deep Soak", "Every 10 days", "Drought tolerant."),
      water("General", "All Year", "Sparingly", "Bi-weekly", "Prefers dry roots.")
    ],
    fertilizerConfig: [
      fert("General", "All Year", "Compost", "Top Dress", "Yearly", "Lavender prefers poor soil.")
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
      fert("General", "All Year", "None", "N/A", "N/A", "Usually does not require fertilizer.")
    ]
  },
  // 6. Cilantro
  {
    name: "Cilantro",
    scientificName: "Coriandrum sativum",
    image: "https://i.imgur.com/lCdXLAf.png",
    waterConfig: [
      water("Seedling", "Spring", "Mist", "Daily", "Taproot is sensitive."),
      water("General", "All Year", "Moderate", "Every 2-3 days", "Keep cool and moist.")
    ],
    fertilizerConfig: [
      fert("General", "All Year", "Nitrogen Rich", "Standard", "Once", "Apply when 2 inches tall.")
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
      fert("General", "All Year", "Balanced 10-10-10", "Standard", "Monthly", "Supports leafy growth.")
    ]
  },
  // 8. Aloe Vera
  {
    name: "Aloe Vera",
    scientificName: "Aloe barbadensis miller",
    image: "https://i.imgur.com/Rs6PVde.png",
    waterConfig: [
      water("General", "Winter", "None/Light", "Monthly", "Dormant in winter."),
      water("General", "All Year", "Deep", "Every 3 weeks", "Soak and dry method.")
    ],
    fertilizerConfig: [
      fert("General", "All Year", "Cactus Food", "Half Strength", "Yearly", "Fertilize once in spring.")
    ]
  },
  // 9. Snake Plant
  {
    name: "Snake Plant",
    scientificName: "Sansevieria trifasciata",
    image: "https://i.imgur.com/wLpp40s.png",
    waterConfig: [
      water("General", "All Year", "Light", "Monthly", "Let soil dry completely.")
    ],
    fertilizerConfig: [
      fert("General", "All Year", "General Purpose", "Standard", "Twice a year", "Feed in spring/summer.")
    ]
  },
  // 10. Spider Plant
  {
    name: "Spider Plant",
    scientificName: "Chlorophytum comosum",
    image: "https://i.imgur.com/3VIEgLI.png",
    waterConfig: [
      water("General", "All Year", "Moderate", "Weekly", "Keep lightly moist.")
    ],
    fertilizerConfig: [
      fert("General", "All Year", "Liquid Houseplant", "Standard", "Monthly", "Avoid brown tips.")
    ]
  },
  // 11. Tomato
  {
    name: "Tomato",
    scientificName: "Solanum lycopersicum",
    image: "https://i.imgur.com/tT736tO.png",
    waterConfig: [
      water("Seedling", "Spring", "Gentle", "Daily", "Keep moist."),
      water("Flowering", "Summer", "Consistent", "Daily", "Critical for fruit set."),
      water("General", "All Year", "Consistent", "Every 2 days", "Tomatoes need water.")
    ],
    fertilizerConfig: [
      fert("Flowering", "Summer", "Tomato Food", "Label", "Every 2 weeks", "Boosts fruit."),
      fert("General", "All Year", "Balanced", "Standard", "Monthly", "Standard feeding.")
    ]
  },
  // 12. Spinach
  {
    name: "Spinach",
    scientificName: "Spinacia oleracea",
    image: "https://i.imgur.com/HyV4oQP.png",
    waterConfig: [
      water("General", "All Year", "Consistent", "Every 2 days", "Dryness causes bitterness.")
    ],
    fertilizerConfig: [
      fert("General", "All Year", "Nitrogen High", "Standard", "At planting", "Needs nitrogen.")
    ]
  },
  // 13. Lemon Balm
  {
    name: "Lemon Balm",
    scientificName: "Melissa officinalis",
    image: "https://i.imgur.com/mUgISVJ.png",
    waterConfig: [
      water("General", "All Year", "Moderate", "Every 3 days", "Will wilt if too dry.")
    ],
    fertilizerConfig: [
      fert("General", "All Year", "Balanced", "Standard", "Monthly", "Vigorous grower.")
    ]
  },
  // 14. Rose
  {
    name: "Rose",
    scientificName: "Rosa",
    image: "https://i.imgur.com/ORifXCb.png",
    waterConfig: [
      water("Seedling", "All Year", "Mist", "Daily", "Keep moist."),
      water("Flowering", "Summer", "1 Liter", "Every 2 days", "Thirsty when blooming."),
      water("Flowering", "Winter", "500ml", "Weekly", "Reduce in winter."),
      water("General", "All Year", "Moderate", "Weekly", "Standard rose care.")
    ],
    fertilizerConfig: [
      fert("Flowering", "Summer", "Bloom Booster", "Label", "Every 2 weeks", "High P."),
      fert("General", "All Year", "Balanced Rose Food", "Standard", "Monthly", "Regular feeding.")
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
    console.log(`Seeded ${res.length} guides with Full Data.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();