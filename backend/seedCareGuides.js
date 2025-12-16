// backend/seedCareGuides.js
require("dotenv").config();
const mongoose = require("mongoose");
const CareGuide = require("./models/careGuide");

// Helper to create consistent configs
const water = (stage, season, amount, freq, desc) => ({
  lifeStage: stage,
  season: season,
  amount: amount,
  frequency: freq,
  description: desc,
});

const fert = (stage, season, name, dosage, freq, desc) => ({
  name: name,
  lifeStage: stage,
  season: season,
  dosage: dosage,
  frequency: freq,
  description: desc,
});

const guides = [
  // 1. Basil
  {
    name: "Basil",
    scientificName: "Ocimum basilicum",
    image: "https://i.imgur.com/qZo4evT.png",
    stageImages: {
      seedling: "https://i.imgur.com/cOM1stS.png",
      vegetative: "https://i.imgur.com/HDG0yRP.jpeg",
      flowering: "https://i.imgur.com/lftYu6C.jpeg",
    },
    waterConfig: [
      // Seedling Stage
      water("Seedling", "Spring", "30ml", "Daily", "Keep soil damp but not soggy to prevent damping off."),
      water("Seedling", "Summer", "50ml", "Twice Daily", "Heat dries small pots fast; check morning and noon."),
      water("Seedling", "Autumn", "30ml", "Daily", "Maintain humidity; avoid cold drafts."),
      water("Seedling", "Winter", "20ml", "Every 2 days", "Use grow lights; water only when surface dries."),

      // Vegetative Stage
      water("Vegetative", "Spring", "200ml", "Every 2-3 days", "Water when top inch is dry; support rapid leaf growth."),
      water("Vegetative", "Summer", "350ml", "Daily", "Full sun requires daily deep watering to prevent wilting."),
      water("Vegetative", "Autumn", "200ml", "Every 3-4 days", "Reduce frequency as days shorten."),
      water("Vegetative", "Winter", "100ml", "Weekly", "Indoor air is dry, but cooler temps mean less evaporation."),

      // Flowering Stage
      water("Flowering", "Spring", "250ml", "Every 2 days", "Consistent moisture helps initial bud formation."),
      water("Flowering", "Summer", "400ml", "Daily", "Crucial for sustaining blooms in heat."),
      water("Flowering", "Autumn", "250ml", "Every 3 days", "Support late blooms before frost."),
      water("Flowering", "Winter", "150ml", "Weekly", "Rare indoors; if blooming, keep lightly moist."),

      // General Fallback
      water("General", "All Year", "200ml", "Every 3 days", "Standard basil care: keep moist but well-drained.")
    ],
    fertilizerConfig: [
      // Seedling Stage
      fert("Seedling", "Spring", "Diluted Liquid 10-10-10", "1/4 Strength", "Weekly", "Start when true leaves appear."),
      fert("Seedling", "Summer", "Diluted Nitrogen", "1/4 Strength", "Weekly", "Support fast initial growth."),
      fert("Seedling", "Autumn", "Balanced Starter", "1/4 Strength", "Every 10 days", "Gentle feeding for off-season starts."),
      fert("Seedling", "Winter", "None", "N/A", "N/A", "Do not fertilize winter seedlings."),

      // Vegetative Stage
      fert("Vegetative", "Spring", "Nitrogen-Rich (Blood Meal)", "Standard", "Every 2 weeks", "Maximizes foliage production."),
      fert("Vegetative", "Summer", "Fish Emulsion", "Standard", "Every 2 weeks", "Strong growth during peak sun."),
      fert("Vegetative", "Autumn", "Balanced 10-10-10", "Half Strength", "Monthly", "Sustain growth without pushing too hard."),
      fert("Vegetative", "Winter", "Liquid Kelp", "1/4 Strength", "Monthly", "Trace minerals only; avoid nitrogen spikes."),

      // Flowering Stage
      fert("Flowering", "Spring", "Balanced", "Standard", "Every 3 weeks", "Support energy shift to buds."),
      fert("Flowering", "Summer", "Bloom Booster 5-10-5", "Standard", "Every 2 weeks", "Higher phosphorus for flowers (if saving seeds)."),
      fert("Flowering", "Autumn", "Low Nitrogen", "Half Strength", "Monthly", "Discourage new leaf growth before cold."),
      fert("Flowering", "Winter", "None", "N/A", "N/A", "Rest period."),
      
      // General Fallback
      fert("General", "All Year", "Standard Balanced", "Half Strength", "Monthly", "Regular feeding.")
    ]
  },
  // 2. Rosemary
  {
    name: "Rosemary",
    scientificName: "Salvia rosmarinus",
    image: "https://i.imgur.com/ORifXCb.png",
    waterConfig: [
      water(
        "Seedling",
        "Spring",
        "Mist",
        "Daily",
        "Keep moist until established."
      ),
      water(
        "General",
        "Winter",
        "100ml",
        "Every 2 weeks",
        "Very susceptible to root rot."
      ),
      water(
        "General",
        "All Year",
        "Low",
        "Weekly",
        "Allow soil to dry out completely."
      ),
    ],
    fertilizerConfig: [
      fert(
        "General",
        "All Year",
        "Fish Emulsion",
        "Half Strength",
        "Monthly",
        "Light feeder."
      ),
    ],
  },
  // 3. Mint
  {
    name: "Mint",
    scientificName: "Mentha",
    image: "https://i.imgur.com/LUAMciq.png",
    stageImages: {
      seedling: "https://i.imgur.com/jpW5cHW.png",
      vegetative: "https://i.imgur.com/1vUP51a.jpeg",
      flowering: "https://i.imgur.com/upPyaGd.jpeg",
    },
    waterConfig: [
      // Seedling Stage
      water("Seedling", "Spring", "40ml", "Daily", "Seeds need light and constant moisture."),
      water("Seedling", "Summer", "60ml", "Twice Daily", "Very sensitive to drying out."),
      water("Seedling", "Autumn", "40ml", "Daily", "Maintain damp soil surface."),
      water("Seedling", "Winter", "25ml", "Every 2 days", "Indoor heat dries soil; check often."),

      // Vegetative Stage
      water("Vegetative", "Spring", "250ml", "Every 2 days", "Fuel rapid spring expansion."),
      water("Vegetative", "Summer", "400ml", "Daily", "Mint loves wet feet; keep soil soggy in heat."),
      water("Vegetative", "Autumn", "250ml", "Every 3 days", "Keep soil moist as temps drop."),
      water("Vegetative", "Winter", "150ml", "Weekly", "Reduce water but never let fully dry."),

      // Flowering Stage
      water("Flowering", "Spring", "300ml", "Every 2 days", "Support early blooms."),
      water("Flowering", "Summer", "500ml", "Daily", "Flowering mint is very thirsty."),
      water("Flowering", "Autumn", "300ml", "Every 3 days", "Sustain late pollinators."),
      water("Flowering", "Winter", "150ml", "Weekly", "Dormancy approaches."),

      // General Fallback
      water("General", "All Year", "200ml", "Every 3 days", "Never let dry out fully.")
    ],
    fertilizerConfig: [
      // Seedling Stage
      fert("Seedling", "Spring", "Diluted Liquid", "1/4 Strength", "Weekly", "Once true leaves appear."),
      fert("Seedling", "Summer", "Diluted Nitrogen", "1/4 Strength", "Weekly", "Fast growth needs fuel."),
      fert("Seedling", "Autumn", "Balanced", "1/8 Strength", "Every 2 weeks", "Gentle start."),
      fert("Seedling", "Winter", "None", "N/A", "N/A", "Wait for spring."),

      // Vegetative Stage
      fert("Vegetative", "Spring", "Nitrogen Heavy 10-5-5", "Standard", "Monthly", "Encourages huge leaves."),
      fert("Vegetative", "Summer", "All Purpose 10-10-10", "Standard", "Every 3 weeks", "Fuels aggressive spread."),
      fert("Vegetative", "Autumn", "Compost Tea", "Diluted", "Monthly", "Prepare for dormancy."),
      fert("Vegetative", "Winter", "None", "N/A", "N/A", "Do not fertilize in winter."),

      // Flowering Stage
      fert("Flowering", "Spring", "Balanced", "Standard", "Monthly", "Support flowers."),
      fert("Flowering", "Summer", "Balanced", "Standard", "Monthly", "Maintain plant health during bloom."),
      fert("Flowering", "Autumn", "Low N", "Half Strength", "Once", "Before frost."),
      fert("Flowering", "Winter", "None", "N/A", "N/A", "Rest."),

      // General Fallback
      fert("General", "All Year", "All Purpose", "Standard", "Monthly", "Fuels rapid spread.")
    ]
  },
  // 4. Lavender
  {
    name: "Lavender",
    scientificName: "Lavandula angustifolia",
    image: "https://i.imgur.com/GwF2iDd.png",
    waterConfig: [
      water(
        "General",
        "Summer",
        "Deep Soak",
        "Every 10 days",
        "Drought tolerant."
      ),
      water(
        "General",
        "All Year",
        "Sparingly",
        "Bi-weekly",
        "Prefers dry roots."
      ),
    ],
    fertilizerConfig: [
      fert(
        "General",
        "All Year",
        "Compost",
        "Top Dress",
        "Yearly",
        "Lavender prefers poor soil."
      ),
    ],
  },
  // 5. Thyme
  {
    name: "Thyme",
    scientificName: "Thymus vulgaris",
    image: "https://i.imgur.com/8lsdr6w.png",
    waterConfig: [
      water(
        "General",
        "All Year",
        "Light",
        "Bi-weekly",
        "Prefers dry conditions."
      ),
    ],
    fertilizerConfig: [
      fert(
        "General",
        "All Year",
        "None",
        "N/A",
        "N/A",
        "Usually does not require fertilizer."
      ),
    ],
  },
  // 6. Cilantro
  {
    name: "Cilantro",
    scientificName: "Coriandrum sativum",
    image: "https://i.imgur.com/lCdXLAf.png",
    waterConfig: [
      water("Seedling", "Spring", "Mist", "Daily", "Taproot is sensitive."),
      water(
        "General",
        "All Year",
        "Moderate",
        "Every 2-3 days",
        "Keep cool and moist."
      ),
    ],
    fertilizerConfig: [
      fert(
        "General",
        "All Year",
        "Nitrogen Rich",
        "Standard",
        "Once",
        "Apply when 2 inches tall."
      ),
    ],
  },
  // 7. Parsley
  {
    name: "Parsley",
    scientificName: "Petroselinum crispum",
    image: "https://i.imgur.com/p0XPFGx.png",
    waterConfig: [
      water(
        "General",
        "All Year",
        "Consistent",
        "Every 3 days",
        "Do not let dry out completely."
      ),
    ],
    fertilizerConfig: [
      fert(
        "General",
        "All Year",
        "Balanced 10-10-10",
        "Standard",
        "Monthly",
        "Supports leafy growth."
      ),
    ],
  },
  // 8. Aloe Vera
  {
    name: "Aloe Vera",
    scientificName: "Aloe barbadensis miller",
    image: "https://i.imgur.com/Rs6PVde.png",
    waterConfig: [
      water("General", "Winter", "None/Light", "Monthly", "Dormant in winter."),
      water(
        "General",
        "All Year",
        "Deep",
        "Every 3 weeks",
        "Soak and dry method."
      ),
    ],
    fertilizerConfig: [
      fert(
        "General",
        "All Year",
        "Cactus Food",
        "Half Strength",
        "Yearly",
        "Fertilize once in spring."
      ),
    ],
  },
  // 9. Snake Plant
  {
    name: "Snake Plant",
    scientificName: "Sansevieria trifasciata",
    image: "https://i.imgur.com/wLpp40s.png",
    waterConfig: [
      water(
        "General",
        "All Year",
        "Light",
        "Monthly",
        "Let soil dry completely."
      ),
    ],
    fertilizerConfig: [
      fert(
        "General",
        "All Year",
        "General Purpose",
        "Standard",
        "Twice a year",
        "Feed in spring/summer."
      ),
    ],
  },
  // 10. Spider Plant
  {
    name: "Spider Plant",
    scientificName: "Chlorophytum comosum",
    image: "https://i.imgur.com/3VIEgLI.png",
    waterConfig: [
      water("General", "All Year", "Moderate", "Weekly", "Keep lightly moist."),
    ],
    fertilizerConfig: [
      fert(
        "General",
        "All Year",
        "Liquid Houseplant",
        "Standard",
        "Monthly",
        "Avoid brown tips."
      ),
    ],
  },
  // 11. Tomato
  {
    name: "Tomato",
    scientificName: "Solanum lycopersicum",
    image: "https://i.imgur.com/tT736tO.png",
    stageImages: {
      seedling: "https://i.imgur.com/9BuvgHV.png",
      vegetative: "https://i.imgur.com/AzSFlHG.jpeg",
      flowering: "https://i.imgur.com/AWWuqFb.png",
    },
    waterConfig: [
      // Seedling Stage
      water("Seedling", "Spring", "40ml", "Daily", "Keep moist; don't displace seeds."),
      water("Seedling", "Summer", "60ml", "Daily", "Prevent fungal issues; thirsty roots."),
      water("Seedling", "Autumn", "40ml", "Daily", "Warmth needed for germination."),
      water("Seedling", "Winter", "30ml", "Every 2 days", "Indoor starts; watch for damping off."),

      // Vegetative Stage
      water("Vegetative", "Spring", "1000ml", "Every 3 days", "Encourage deep root growth."),
      water("Vegetative", "Summer", "2000ml", "Daily", "High transpiration; needs lots of water."),
      water("Vegetative", "Autumn", "1000ml", "Every 2-3 days", "Maintain hydration."),
      water("Vegetative", "Winter", "500ml", "Weekly", "Unusual season; keep alive."),

      // Flowering Stage
      water("Flowering", "Spring", "2000ml", "Every 2 days", "Irregular water causes blossom drop."),
      water("Flowering", "Summer", "3500ml", "Daily", "Critical prevention of blossom end rot."),
      water("Flowering", "Autumn", "2000ml", "Every 3 days", "Sustain final fruit set."),
      water("Flowering", "Winter", "800ml", "Weekly", "Rare; indoor greenhouse only."),

      // General Fallback
      water("General", "All Year", "2000ml", "Every 2 days", "Tomatoes need water.")
    ],
    fertilizerConfig: [
      // Seedling Stage
      fert("Seedling", "Spring", "Diluted Starter", "1/4 Strength", "Weekly", "First true leaves only."),
      fert("Seedling", "Summer", "Diluted Balanced", "1/4 Strength", "Weekly", "Fast growth."),
      fert("Seedling", "Autumn", "Weak Liquid", "1/8 Strength", "Weekly", "Gentle."),
      fert("Seedling", "Winter", "None", "N/A", "N/A", "Too little light."),

      // Vegetative Stage
      fert("Vegetative", "Spring", "Balanced 10-10-10", "Standard", "Every 2 weeks", "Builds the plant structure."),
      fert("Vegetative", "Summer", "Calcium/Magnesium", "Supplement", "Monthly", "Prevent nutrient lockout."),
      fert("Vegetative", "Autumn", "Balanced", "Half Strength", "Monthly", "Late season planting."),
      fert("Vegetative", "Winter", "None", "N/A", "N/A", "N/A"),

      // Flowering Stage
      fert("Flowering", "Spring", "Tomato Food 5-10-10", "Standard", "Every 2 weeks", "Low Nitrogen, High Phos/Potash."),
      fert("Flowering", "Summer", "Organic Tomato Feed", "Standard", "Weekly", "Heavy feeder during fruit set."),
      fert("Flowering", "Autumn", "Low Nitrogen", "Standard", "Every 3 weeks", "Focus on ripening."),
      fert("Flowering", "Winter", "None", "N/A", "N/A", "N/A"),
      
      // General Fallback
      fert("General", "All Year", "Balanced", "Standard", "Monthly", "Standard feeding.")
    ]
  },
  // 12. Spinach
  {
    name: "Spinach",
    scientificName: "Spinacia oleracea",
    image: "https://i.imgur.com/HyV4oQP.png",
    waterConfig: [
      water(
        "General",
        "All Year",
        "Consistent",
        "Every 2 days",
        "Dryness causes bitterness."
      ),
    ],
    fertilizerConfig: [
      fert(
        "General",
        "All Year",
        "Nitrogen High",
        "Standard",
        "At planting",
        "Needs nitrogen."
      ),
    ],
  },
  // 13. Lemon Balm
  {
    name: "Lemon Balm",
    scientificName: "Melissa officinalis",
    image: "https://i.imgur.com/mUgISVJ.png",
    waterConfig: [
      water(
        "General",
        "All Year",
        "Moderate",
        "Every 3 days",
        "Will wilt if too dry."
      ),
    ],
    fertilizerConfig: [
      fert(
        "General",
        "All Year",
        "Balanced",
        "Standard",
        "Monthly",
        "Vigorous grower."
      ),
    ],
  },
  // 14. Rose
  {
    name: "Rose",
    scientificName: "Rosa",
    image: "https://i.imgur.com/ORifXCb.png",
    waterConfig: [
      water("Seedling", "All Year", "Mist", "Daily", "Keep moist."),
      water(
        "Flowering",
        "Summer",
        "1 Liter",
        "Every 2 days",
        "Thirsty when blooming."
      ),
      water("Flowering", "Winter", "500ml", "Weekly", "Reduce in winter."),
      water("General", "All Year", "Moderate", "Weekly", "Standard rose care."),
    ],
    fertilizerConfig: [
      fert(
        "Flowering",
        "Summer",
        "Bloom Booster",
        "Label",
        "Every 2 weeks",
        "High P."
      ),
      fert(
        "General",
        "All Year",
        "Balanced Rose Food",
        "Standard",
        "Monthly",
        "Regular feeding."
      ),
    ],
  },
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
