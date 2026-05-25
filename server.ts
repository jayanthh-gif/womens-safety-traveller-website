import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 3000;

// Lazy initialiser for Gemini to avoid crashing on start if API key is not present initially
let aiInstance: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined. Please add it in Settings > Secrets.");
    }
    aiInstance = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiInstance;
}

// ----------------------------------------
// API ENDPOINTS
// ----------------------------------------

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Generate Solo Female Safety Report & Safety-first Itinerary
app.post("/api/safety-report", async (req, res) => {
  const { city, month, style } = req.body;

  if (!city) {
    res.status(400).json({ error: "City parameter is required." });
    return;
  }

  const travelMonth = month || "any month";
  const travelStyle = style || "general traveler";

  try {
    const ai = getGeminiClient();

    const prompt = `
      You are an expert specialist in international travel security and a veteran solo female traveler advocate. 
      Generate a comprehensive solo travel safety analysis and a highly practical 3-day safety-first itinerary for a solo female traveler visiting the city of ${city} during the month of ${travelMonth}.
      We are focusing on travel style: ${travelStyle}.

      Your analysis MUST have strict emphasis on gender-specific and solo-specific safety guidance:
      1. Overall Score out of 10 representing solo female traveler friendliness and comfort.
      2. Safety Metrics (out of 10) for: Night Walking Solo, Solo Public/Shared Transport, Access to Assistance (helpfulness of police/hospital/bystanders), and scam/harassment risk.
      3. Practical local guidelines on clothing/cultural expectations to avoid negative attention.
      4. Targeted list of safe, well-lit neighborhoods for accommodation or night walking, and specific high-risk neighborhoods or metro stations to strictly avoid.
      5. Practical 3-day itinerary focusing purely on safety. Daily themes must group activities close together geographically. 
         - Transit times are carefully timed so the traveler can easily get back to their accommodation before dark (usually by 6-7 PM).
         - Include actionable, location-specific safety tips for every single activity (e.g., how to secure purse, taxi protocols, or exits to use).
    `;

    // Strict schema to map to SafetyReport interface
    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        city: { type: Type.STRING, description: "The name of the analyzed city" },
        overallScore: { type: Type.NUMBER, description: "Overall women solo traveler safety rating from 1 to 10" },
        safetyMetrics: {
          type: Type.OBJECT,
          description: "Granular safety metric scores out of 10",
          properties: {
            nightWalking: { type: Type.NUMBER, description: "Safety of walking alone at night (1-10)" },
            soloTransport: { type: Type.NUMBER, description: "Public and private transport safety & ease for a solo female (1-10)" },
            assistance: { type: Type.NUMBER, description: "Ease of getting support from police or locals in case of harassment or emergency (1-10)" },
            scamRisk: { type: Type.NUMBER, description: "Prevalence of targeted street scams, pickpocketing, and catcalls (1-10, where 10 is low risk/very secure, and 1 is high risk)" }
          },
          required: ["nightWalking", "soloTransport", "assistance", "scamRisk"]
        },
        keyAdvice: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "The top 4 most critical safety takeaways for this specific city"
        },
        localNorms: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Cultural and local dress/behavior standards to minimize unwarranted attention"
        },
        scamsToAvoid: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Specific targeted tricks, catcalls, or scams to watch for in this city"
        },
        safeNeighborhoods: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "High-trust, well-lit, or female-friendly areas recommended for lodging/strolls"
        },
        neighborhoodsToAvoid: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Districts, streets, or transit lines carrying higher risks at night or during light crowds"
        },
        itinerary: {
          type: Type.ARRAY,
          description: "A structured, safety-optimized 3-day travel itinerary",
          items: {
            type: Type.OBJECT,
            properties: {
              day: { type: Type.INTEGER, description: "Day number (1, 2, or 3)" },
              theme: { type: Type.STRING, description: "A safe, focused travel theme for the day" },
              activities: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    time: { type: Type.STRING, description: "Subdivided time of day, e.g., '09:00 AM - 11:30 AM'" },
                    title: { type: Type.STRING, description: "Name of the attraction, walk, or meal" },
                    location: { type: Type.STRING, description: "Specific monument, venue, neighborhood, or dining spot" },
                    description: { type: Type.STRING, description: "Description of what to experience" },
                    safetyTip: { type: Type.STRING, description: "Actionable, customized tip to stay highly secure during this particular activity" }
                  },
                  required: ["time", "title", "location", "description", "safetyTip"]
                }
              }
            },
            required: ["day", "theme", "activities"]
          }
        }
      },
      required: [
        "city",
        "overallScore",
        "safetyMetrics",
        "keyAdvice",
        "localNorms",
        "scamsToAvoid",
        "safeNeighborhoods",
        "neighborhoodsToAvoid",
        "itinerary"
      ]
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    const reportText = response.text;
    res.setHeader("Content-Type", "application/json");
    res.send(reportText);

  } catch (error: any) {
    console.error("Gemini safety report generation error:", error);
    res.status(500).json({
      error: "Could not generate safety report.",
      message: error.message || String(error)
    });
  }
});

// ----------------------------------------
// VITE OR STATIC SERVING MIDDLEWARE
// ----------------------------------------
async function setupViteOrStatic() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Mounted Vite development middleware");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Mounted static production assets from /dist");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server successfully booted on port ${PORT}`);
  });
}

setupViteOrStatic();
