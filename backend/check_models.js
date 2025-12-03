const dotenv = require('dotenv');
dotenv.config();

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey || apiKey.includes("YOUR_GEMINI")) {
    console.error("❌ Error: API Key is missing in .env");
    return;
  }

  // We will query the API directly to see what it offers YOU.
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

  try {
    console.log("📡 Connecting to Google Gemini API...");
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      console.error("❌ API Error:", data.error.message);
      return;
    }

    if (!data.models) {
      console.log("⚠️ No models returned.");
      return;
    }

    console.log("\n✅ AVAILABLE MODELS FOR THIS KEY:");
    const viableModels = data.models.filter(m => 
      m.supportedGenerationMethods.includes("generateContent")
    );

    viableModels.forEach(model => {
      console.log(`- ${model.name.replace('models/', '')}`);
    });

  } catch (error) {
    console.error("Network Error:", error.message);
  }
}

listModels();
