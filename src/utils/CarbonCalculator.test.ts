import { describe, it, expect } from "vitest";
import { calculateInitialScore, processXpGain, sanitizeInput } from "./CarbonCalculator";
import { SurveyAnswer } from "../types";

describe("CarbonCalculator utility tests", () => {
  describe("calculateInitialScore", () => {
    it("should calculate correct high eco score for walking and vegan habits", () => {
      const answers: SurveyAnswer = {
        transportation: "walking",
        diet: "vegan",
        energy: "low",
        shopping: "minimal",
      };
      // base 50 + 20 + 15 + 10 + 10 = 105 -> clamped to 100 max
      expect(calculateInitialScore(answers)).toBe(100);
    });

    it("should calculate lower eco score for driving and mixed diet habits", () => {
      const answers: SurveyAnswer = {
        transportation: "car",
        diet: "mixed",
        energy: "high",
        shopping: "frequent",
      };
      // base 50 - 10 - 5 - 10 - 10 = 15
      expect(calculateInitialScore(answers)).toBe(15);
    });

    it("should handle mixed medium habits correctly", () => {
      const answers: SurveyAnswer = {
        transportation: "public",
        diet: "vegetarian",
        energy: "medium",
        shopping: "moderate",
      };
      // base 50 + 10 + 10 + 0 + 0 = 70
      expect(calculateInitialScore(answers)).toBe(70);
    });
  });

  describe("processXpGain", () => {
    it("should accumulate XP without leveling if threshold not met", () => {
      const result = processXpGain(100, 1, 500, 200);
      expect(result.xp).toBe(300);
      expect(result.level).toBe(1);
      expect(result.leveledUp).toBe(false);
    });

    it("should handle single level up correctly", () => {
      const result = processXpGain(400, 1, 500, 200);
      // nextXp = 600. 600 - 500 = 100 remaining. Level increases to 2, nextXpNeeded = Math.floor(500 * 1.3) = 650
      expect(result.xp).toBe(100);
      expect(result.level).toBe(2);
      expect(result.xpNeeded).toBe(650);
      expect(result.leveledUp).toBe(true);
    });

    it("should handle multiple level ups correctly", () => {
      // Starting: xp 100, level 1, needed 100, gain 400
      // step 1: nextXp = 500. 500 >= 100 -> xp=400, level=2, needed=130
      // step 2: 400 >= 130 -> xp=270, level=3, needed=Math.floor(130*1.3)=169
      // step 3: 270 >= 169 -> xp=101, level=4, needed=Math.floor(169*1.3)=219
      // stop since 101 < 219
      const result = processXpGain(100, 1, 100, 400);
      expect(result.level).toBe(4);
      expect(result.xp).toBe(101);
      expect(result.xpNeeded).toBe(219);
      expect(result.leveledUp).toBe(true);
    });
  });

  describe("sanitizeInput", () => {
    it("should strip simple HTML script injections", () => {
      const input = "Hello <script>alert('XSS')</script> world";
      expect(sanitizeInput(input)).toBe("Hello alert('XSS') world");
    });

    it("should remove raw angle brackets", () => {
      const input = "a < b > c";
      expect(sanitizeInput(input)).toBe("a  b  c");
    });

    it("should remove javascript handlers case insensitively", () => {
      const input = "Click here: javascript:alert('hi') or onload=function()";
      expect(sanitizeInput(input)).toBe("Click here: alert('hi') or function()");
    });

    it("should trim trailing spaces", () => {
      expect(sanitizeInput("  clean string   ")).toBe("clean string");
    });
  });
});
