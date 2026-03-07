const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(
  process.env.CAM_GEMINI_API_KEY || process.env.GEMINI_API_KEY
);

let model = null;
(() => {
  const candidates = ["gemini-2.5-flash", "gemini-2.0-flash"];
  for (const name of candidates) {
    try {
      model = genAI.getGenerativeModel({ model: name });
      break;
    } catch (_) {
      model = null;
    }
  }
})();

async function generateWithFallback(contentParts) {
  const order = ["gemini-2.5-flash", "gemini-2.0-flash"];
  let lastError;
  for (const name of order) {
    try {
      const m = genAI.getGenerativeModel({ model: name });
      const res = await m.generateContent(contentParts);
      return res;
    } catch (e) {
      lastError = e;
      const msg = String(e?.message || "");
      if (!(msg.includes("404") && msg.toLowerCase().includes("not found"))) {
        break;
      }
    }
  }
  throw lastError || new Error("Model unavailable");
}

async function detectGardenOrPlant(imageBase64) {
  if (!model) return { unavailable: true, reason: "AI unavailable" };
  try {
    const prompt = [
      {
        text:
          'You are a strict image classifier. Determine if the image shows a real plant or a garden scene. Return STRICT JSON with keys: "isGardenOrPlant" (true|false) and "reason".',
      },
    ];
    const result = await generateWithFallback([
      prompt,
      {
        inlineData: {
          data: imageBase64,
          mimeType: "image/jpeg",
        },
      },
    ]);
    const text = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(text);
    if (typeof parsed?.isGardenOrPlant !== "boolean") {
      return { unavailable: true, reason: "Invalid AI response" };
    }
    return { isGardenOrPlant: parsed.isGardenOrPlant, reason: parsed.reason || "" };
  } catch (e) {
    return { unavailable: true, reason: e?.message || "AI error" };
  }
}

async function generateCaption(imageBase64) {
  try {
    const guard = await detectGardenOrPlant(imageBase64);
    if (guard?.unavailable) {
      return { unavailable: true, reason: guard.reason || "AI unavailable" };
    }
    if (!guard?.isGardenOrPlant) {
      return { notGarden: true, reason: guard?.reason || "Not a plant/garden image" };
    }

    const prompt = [
      { text: "Generate a short, friendly caption for a garden photo. Include emojis. Keep it under 2 lines." },
    ];

    if (!model) throw new Error("AI unavailable");

    const result = await generateWithFallback([
      prompt,
      {
        inlineData: {
          data: imageBase64,
          mimeType: "image/jpeg",
        },
      },
    ]);

    const caption = result.response.text().trim();
    return { caption };
  } catch (err) {
    return { unavailable: true, detail: err?.message };
  }
}

module.exports = { generateCaption, detectGardenOrPlant };
