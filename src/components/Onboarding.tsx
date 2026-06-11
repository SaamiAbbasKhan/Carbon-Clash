import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Globe,
  Users,
  Home,
  Zap,
  Car,
  Bike,
  Footprints,
  Bus,
  Utensils,
  ShoppingBag,
  Tv,
  Flame,
  UserPlus,
  Github,
  Compass,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { SurveyAnswer, UserStats } from "../types";
import Footer from "./Footer";
import { calculateInitialScore, sanitizeInput } from "../utils/CarbonCalculator";

interface OnboardingProps {
  onComplete: (stats: UserStats) => void;
  appName?: string;
  footerText?: string;
  startingStreak?: number;
}

export default function Onboarding({ onComplete, appName = "Carbon Clash", footerText, startingStreak }: OnboardingProps) {
  const [step, setStep] = useState<number>(0);
  const [userName, setUserName] = useState<string>("");
  const [validationError, setValidationError] = useState<string>("");
  const [survey, setSurvey] = useState<SurveyAnswer>({
    transportation: "car",
    diet: "mixed",
    energy: "medium",
    shopping: "moderate",
  });

  const slides = [
    {
      title: "Save the planet one quest at a time.",
      desc: "Turn climate action into an adrenaline-filled RPG. No greenwashing. No boring lists. Classic gaming loop style.",
      icon: <Globe className="w-20 h-20 text-emerald-400 animate-spin-slow" />,
      color: "from-emerald-500/20 to-teal-500/10",
    },
    {
      title: "Compete with friends.",
      desc: "Climb leaderboards, join university sustainability battles, and mock your friends who commute in V8 fuel-guzzlers.",
      icon: <Users className="w-20 h-20 text-indigo-400 animate-bounce" />,
      color: "from-indigo-500/20 to-purple-500/10",
    },
    {
      title: "Build your dream eco-city.",
      desc: "Evolve a virtual polluted town into a smart green civilization. Clean up smog, plant trees, and generate coins passively.",
      icon: <Home className="w-20 h-20 text-sky-400 animate-pulse" />,
      color: "from-sky-500/20 to-cyan-500/10",
    },
    {
      title: "Complete missions. Earn XP. Level up.",
      desc: "Unlock rare badges, cosmetic items, and ultimate planetary bragging rights. Track real carbon-offset impact.",
      icon: <Zap className="w-20 h-20 text-amber-400" />,
      color: "from-amber-500/20 to-orange-500/10",
    },
  ];

  const handleNextSlide = () => {
    setStep(step + 1);
  };

  const handleSocialSignup = (provider: string) => {
    const cleaned = sanitizeInput(userName);
    if (!cleaned.trim()) {
      setValidationError("⚠️ Please claim your Gamer Tag first to authenticate!");
      return;
    }
    setValidationError("");
    setStep(5); // Go to survey
  };

  const handleFinishSurvey = () => {
    const score = calculateInitialScore(survey);
    // Directly increase starting XP based on calculated Eco Power rating score! (gives a push to initial XP)
    const xpPush = score * 8;
    const cleanedName = sanitizeInput(userName).trim();
    const initialStats: UserStats = {
      name: cleanedName || "Saami Abbas Khan",
      level: 1,
      xp: 150 + xpPush,
      xpNeeded: 1000,
      streak: startingStreak !== undefined ? startingStreak : 17, // Start with Specified streak, fallback to 17
      greenCoins: 120, // Start with some starter coins to buy things!
      streakFreezes: 1,
      ecoPowerLevel: score,
      surveyCompleted: true,
      surveyData: survey,
    };
    onComplete(initialStats);
  };

  return (
    <div id="onboarding-root" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-6 overflow-hidden relative">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="flex items-center gap-2 z-10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center font-bold text-lg text-slate-900 tracking-wider shadow-lg shadow-emerald-500/10 border border-emerald-400/20">
          CC
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
            {appName} <span className="text-[10px] bg-indigo-500/20 text-indigo-400 font-mono px-1.5 py-0.5 rounded border border-indigo-500/30">MVP</span>
          </h1>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-md w-full mx-auto flex flex-col justify-center my-8 z-10">
        <AnimatePresence mode="wait">
          {/* Tutorial Card */}
          {step < 4 && (
            <motion.div
              key="tutorial"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className={`p-8 rounded-3xl bg-gradient-to-b ${slides[step].color} border border-slate-800/80 backdrop-blur-md shadow-2xl flex flex-col items-center text-center`}
            >
              <div className="p-6 bg-slate-900/60 rounded-full border border-slate-800 mb-8 shadow-inner shadow-slate-950">
                {slides[step].icon}
              </div>

              <h2 className="text-2xl font-extrabold tracking-tight text-white mb-4 leading-tight">
                {slides[step].title}
              </h2>

              <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-xs">
                {slides[step].desc}
              </p>

              <div className="flex gap-2 mb-8">
                {slides.map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 rounded-full transition-all duration-300 ${i === step ? "w-8 bg-emerald-500" : "w-2 bg-slate-800"
                      }`}
                  />
                ))}
              </div>

              <button
                id="next-slide-btn"
                onClick={handleNextSlide}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 group transition-all duration-300 transform active:scale-95 shadow-lg shadow-emerald-500/10 cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}

          {/* Account Creation (Sign Up Profile) */}
          {step === 4 && (
            <motion.div
              key="auth"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md shadow-2xl space-y-4"
            >
              <div className="text-center">
                <div className="inline-flex p-3 bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 rounded-full mb-3 animate-pulse">
                  <UserPlus className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-extrabold text-white tracking-tight">Create Gamer Profile</h2>
                <p className="text-xs text-slate-400 mt-1">Claim your tag to lock in your daily streak multiplier</p>
              </div>

              {validationError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-xl text-xs font-semibold animate-pulse text-center">
                  {validationError}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="gamer-tag-input" className="block text-xs font-mono text-slate-550 uppercase mb-2">Claim Gamer Tag</label>
                  <input
                    id="gamer-tag-input"
                    type="text"
                    required
                    placeholder="Enter Username (e.g. Saami)"
                    value={userName}
                    onChange={(e) => {
                      const sanitized = sanitizeInput(e.target.value);
                      setUserName(sanitized);
                      if (sanitized.trim()) setValidationError("");
                    }}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/40 rounded-xl px-4 py-3.5 text-slate-100 placeholder-slate-700 outline-none transition-all text-sm font-semibold"
                  />
                </div>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-slate-800"></div>
                  <span className="flex-shrink mx-4 text-xs font-mono text-slate-600">CHOOSE CREDENTIAL</span>
                  <div className="flex-grow border-t border-slate-800"></div>
                </div>

                <button
                  id="signup-google"
                  onClick={() => handleSocialSignup("google")}
                  className="w-full bg-slate-950 hover:bg-slate-900 text-slate-200 border border-slate-800 rounded-xl py-3.5 px-4 text-sm font-semibold flex items-center justify-center gap-3 transition-colors active:scale-98 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Authenticate with Google</span>
                </button>

                <button
                  id="signup-github"
                  onClick={() => handleSocialSignup("github")}
                  className="w-full bg-slate-950 hover:bg-slate-900 text-slate-200 border border-slate-800 rounded-xl py-3.5 px-4 text-sm font-semibold flex items-center justify-center gap-3 transition-colors active:scale-98 cursor-pointer"
                >
                  <Github className="w-4 h-4 text-slate-300" />
                  <span>Connect GitHub Client</span>
                </button>

                <button
                  id="signup-email"
                  onClick={() => {
                    if (!userName.trim()) {
                      setValidationError("⚠️ Please claim your Gamer Tag first to begin assessment!");
                      return;
                    }
                    setValidationError("");
                    setStep(5);
                  }}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 rounded-xl py-3.5 px-4 text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/15 active:scale-98 cursor-pointer"
                >
                  <span>Begin Eco Profile Assessment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Onboarding Questionnaire */}
          {step === 5 && (
            <motion.div
              key="survey"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md shadow-xl text-center">
                <div className="inline-flex p-3 bg-indigo-950/40 border border-indigo-500/20 text-indigo-400 rounded-full mb-2">
                  <Compass className="w-6 h-6 animate-spin-slow" />
                </div>
                <h2 className="text-xl font-black text-white tracking-tight">Eco Power Assessment</h2>
                <p className="text-xs text-slate-400">Let's calculate your starting level. Honesty boosts rewards!</p>
              </div>

              {/* Transportation */}
              <div className="p-5 rounded-2xl bg-slate-900/30 border border-slate-800/60">
                <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5 font-semibold">
                  <Car className="w-3.5 h-3.5 text-emerald-400" /> 1. Primary Transit
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "car", label: "Car/SUV", icon: <Car className="w-4 h-4" /> },
                    { id: "public", label: "Metro/Bus", icon: <Bus className="w-4 h-4" /> },
                    { id: "bike", label: "Cycling", icon: <Bike className="w-4 h-4" /> },
                    { id: "walking", label: "Walk/Run", icon: <Footprints className="w-4 h-4" /> },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setSurvey({ ...survey, transportation: opt.id as any })}
                      className={`py-3 px-4 rounded-xl flex items-center gap-2.5 text-xs font-semibold border transition-all cursor-pointer ${survey.transportation === opt.id
                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-300"
                        : "bg-slate-950 border-slate-900 text-slate-400 hover:border-slate-800"
                        }`}
                    >
                      {opt.icon}
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Diet */}
              <div className="p-5 rounded-2xl bg-slate-900/30 border border-slate-800/60">
                <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5 font-semibold">
                  <Utensils className="w-3.5 h-3.5 text-indigo-400" /> 2. Dietary Style
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "mixed", label: "Mixed Diet" },
                    { id: "vegetarian", label: "Vegetarian" },
                    { id: "vegan", label: "Vegan" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setSurvey({ ...survey, diet: opt.id as any })}
                      className={`py-3 px-2 rounded-xl text-center text-xs font-semibold border transition-all cursor-pointer ${survey.diet === opt.id
                        ? "bg-indigo-500/10 border-indigo-500 text-indigo-300"
                        : "bg-slate-950 border-slate-900 text-slate-400 hover:border-slate-800"
                        }`}
                    >
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Energy */}
              <div className="p-5 rounded-2xl bg-slate-900/30 border border-slate-800/60">
                <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5 font-semibold">
                  <Tv className="w-3.5 h-3.5 text-sky-400" /> 3. Home Energy Consumption
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "low", label: "Low (Eco-focused)" },
                    { id: "medium", label: "Medium (Standard)" },
                    { id: "high", label: "High (Always-on)" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setSurvey({ ...survey, energy: opt.id as any })}
                      className={`py-3 px-2 rounded-xl text-center text-xs font-semibold border transition-all cursor-pointer ${survey.energy === opt.id
                        ? "bg-sky-500/10 border-sky-500 text-sky-300"
                        : "bg-slate-950 border-slate-900 text-slate-400 hover:border-slate-800"
                        }`}
                    >
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Shopping */}
              <div className="p-5 rounded-2xl bg-slate-900/30 border border-slate-800/60">
                <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5 font-semibold">
                  <ShoppingBag className="w-3.5 h-3.5 text-amber-400" /> 4. Shopping Multiplier
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "minimal", label: "Minimalist" },
                    { id: "moderate", label: "Moderate" },
                    { id: "frequent", label: "High Hypebeast" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setSurvey({ ...survey, shopping: opt.id as any })}
                      className={`py-3 px-2 rounded-xl text-center text-xs font-semibold border transition-all cursor-pointer ${survey.shopping === opt.id
                        ? "bg-amber-500/10 border-amber-500 text-amber-300"
                        : "bg-slate-950 border-slate-900 text-slate-400 hover:border-slate-800"
                        }`}
                    >
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                id="finish-survey-btn"
                onClick={handleFinishSurvey}
                className="w-full bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-slate-150 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/10 active:scale-95 transition-all outline-none cursor-pointer"
              >
                <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
                <span>Calculate My Eco Power Level</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer footerText={footerText} />
    </div>
  );
}
