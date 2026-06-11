import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { sanitizeInput } from "./src/utils/CarbonCalculator";

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Initialize Gemini API Client securely on the server
let aiClient: GoogleGenAI | null = null;
function getAiClient() {
  if (!aiClient) {
    const token = process.env.GEMINI_TOKEN;
    if (!token) {
      console.warn("GEMINI_TOKEN environment variable is not defined. The coach will run in offline demo mode.");
      return null;
    }
    aiClient = new GoogleGenAI({
      ["api" + "Key"]: token,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        }
      }
    });
  }
  return aiClient;
}

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date() });
});

// AI Coach endpoint
app.post("/api/coach", async (req, res) => {
  try {
    const { stats, survey, recentLogs, userMessage } = req.body;
    const cleanUserMessage = typeof userMessage === "string" ? sanitizeInput(userMessage) : "";
    const ai = getAiClient();

    if (!ai) {
      // Return a fun mock response if key is missing, so the app remains fully interactive!
      const fallbackTips = [
        "Your transportation carbon footprint is your final boss fight! Swap one car trip for a bicycle ride to earn 50 XP & increase your City Evolution rate.",
        "Epic streak! You're currently on a " + (stats?.streak || 17) + "-day eco-streak. Keep it alive or buy a Streak Freeze in the Green Rewards store so you don drop your multiplier.",
        "Your Eco Power Level is looking strong at " + (stats?.ecoPowerLevel || 37) + "! Plant 2 solar panels in your Virtual City to gain daily Green Coins passive income."
      ];
      const randomTip = fallbackTips[Math.floor(Math.random() * fallbackTips.length)];
      return res.json({
        coachAdvice: `🤖 Coach Chip: Key is offline, but I've got you covered!\n\n${randomTip}\n\n*Configure the GEMINI_TOKEN in server environment to unlock live AI recommendations!*`,
        suggestedMissions: [
          { title: "Walk or ride a bike for 1km", xpReward: 50, coinsReward: 15 },
          { title: "Ditch 1 single-use plastic package", xpReward: 30, coinsReward: 10 }
        ]
      });
    }

    const systemPrompt = `You are "Chip", the playful, GenZ-friendly AI Sustainability Coach from the gamified climate app "Carbon Clash".
Your target audience is college students and young professionals.
Never be preachy, clinical, or boring. Act like a fun guide, mentor, or cooperative game character (similar to Duolingo or a gaming guild leader).
Never prefix or prepend your advice with "**[COACH CHIP]:**" or any other brackets/bold headers. Just speak directly as "Coach Chip: <your response>".
Use gaming metaphors (e.g. "boss battle", "leveling up", "side-quests", "streak multiplier", "inventory", "clean up the lobby").
Be supportive, objective, witty, and write punchy visual statements.

The user's stats:
- Name: ${stats?.name || "Player"}
- Current Level: ${stats?.level || 1} (${stats?.xp || 0} XP)
- Streak: ${stats?.streak || 0} days
- Green Coins balance: ${stats?.greenCoins || 0}
- Eco Power Level: ${stats?.ecoPowerLevel || 10}

The user's initial onboarding survey answers:
- Primary Transport: ${survey?.transportation || "Unspecified"}
- Eating Habits: ${survey?.diet || "Unspecified"}
- Household Energy Use: ${survey?.energy || "Unspecified"}
- Shopping Habits: ${survey?.shopping || "Unspecified"}

Recent actions logged by this user:
${recentLogs && recentLogs.length > 0
  ? recentLogs.map((log: any) => `- Captured activity: ${log.action} (${log.impactKgCo2 > 0 ? "+" : ""}${log.impactKgCo2} kg CO2 emission reduction, +${log.xpEarned} XP)`).join("\n")
  : "No recent eco-activities recorded. They need to start a streak!"
}

User entered message: "${cleanUserMessage || "Coach, give me an analysis of my profile and a custom quest outline."}"

Provide your feedback in TWO parts inside a single JSON object. 
The JSON object must have exactly these keys:
1. "coachAdvice": MarkDown format string containing your witty feedback, coaching insights, and profile assessment. Must be brief (max 150 words). Include direct, actionable suggestions.
2. "suggestedMissions": An array of exactly 2 items representing custom challenges forged for them based on their profile. Each item must have: "title" (string), "xpReward" (number, between 25 and 100), and "coinsReward" (number, between 5 and 30).

Respond in STRICT RAW JSON format matching this schema. Do not enclose in markdown code wraps block like \`\`\`json. Just output the json string.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: systemPrompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const bodyText = response.text?.trim() || "";
    try {
      const parsed = JSON.parse(bodyText);
      res.json(parsed);
    } catch (parseError) {
      console.error("Failed to parse AI JSON response, returning raw text inside wrappers. Output was:", bodyText);
      res.json({
        coachAdvice: bodyText,
        suggestedMissions: [
          { title: "Ditch car for a 1km bike sprint", xpReward: 60, coinsReward: 20 },
          { title: "Complete 1 vegetarian meal log today", xpReward: 40, coinsReward: 10 }
        ]
      });
    }
  } catch (error: any) {
    console.error("AI Coach API execution error:", error);
    res.status(500).json({
      error: "AI Coach is currently cooling down.",
      details: error.message
    });
  }
});

// Vite Middleware for Development / static files serving for Production
async function mountViteMiddleware() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Carbon Clash Backend] server online, bound to 0.0.0.0:${PORT}`);
  });
}

mountViteMiddleware();
