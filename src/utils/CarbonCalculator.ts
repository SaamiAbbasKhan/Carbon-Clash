import { SurveyAnswer } from "../types";

/**
 * Calculates the initial Eco Power score based on user survey answers.
 */
export function calculateInitialScore(answers: SurveyAnswer): number {
  let base = 50;

  // Transport
  if (answers.transportation === "walking") base += 20;
  else if (answers.transportation === "bike") base += 15;
  else if (answers.transportation === "public") base += 10;
  else base -= 10;

  // Diet
  if (answers.diet === "vegan") base += 15;
  else if (answers.diet === "vegetarian") base += 10;
  else base -= 5;

  // Energy
  if (answers.energy === "low") base += 10;
  else if (answers.energy === "medium") base += 0;
  else base -= 10;

  // Shopping
  if (answers.shopping === "minimal") base += 10;
  else if (answers.shopping === "moderate") base += 0;
  else base -= 10;

  return Math.max(10, Math.min(100, base));
}

/**
 * Processes XP gain and returns updated statistics including leveling.
 */
export function processXpGain(
  xp: number,
  level: number,
  xpNeeded: number,
  amount: number
): { xp: number; level: number; xpNeeded: number; leveledUp: boolean } {
  let nextXp = xp + amount;
  let nextLevel = level;
  let nextXpNeeded = xpNeeded;
  let leveledUp = false;

  while (nextXp >= nextXpNeeded) {
    nextXp -= nextXpNeeded;
    nextLevel += 1;
    nextXpNeeded = Math.floor(nextXpNeeded * 1.3);
    leveledUp = true;
  }

  return { xp: nextXp, level: nextLevel, xpNeeded: nextXpNeeded, leveledUp };
}

/**
 * Sanitizes user input text to prevent HTML and script injection attacks.
 */
export function sanitizeInput(value: string): string {
  if (typeof value !== "string") return "";
  // Strip valid HTML tags (starts with alphabet or slash followed by alphabet)
  let cleaned = value.replace(/<\/?[a-zA-Z][^>]*>/gi, "");
  // Remove raw angle brackets
  cleaned = cleaned.replace(/[<>]/g, "");
  // Block common Javascript execution keywords
  cleaned = cleaned.replace(/javascript:/gi, "");
  cleaned = cleaned.replace(/onload=/gi, "");
  cleaned = cleaned.replace(/onerror=/gi, "");
  cleaned = cleaned.replace(/onclick=/gi, "");
  return cleaned.trim();
}
