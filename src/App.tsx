import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, RefreshCw } from "lucide-react";

import { AppState, DailyMission, Achievement, CityItem, CarbonLogItem, UserStats } from "./types";
import LandingPage from "./components/LandingPage";
import Onboarding from "./components/Onboarding";
import Dashboard from "./components/Dashboard";
import CityBuilder from "./components/CityBuilder";
import Analytics from "./components/Analytics";
import Leaderboard from "./components/Leaderboard";
import AchievementsTab from "./components/AchievementsTab";
import AICoach from "./components/AICoach";
import ShareCard from "./components/ShareCard";
import RewardsShop from "./components/RewardsShop";
import AdminPanel from "./components/AdminPanel";
import Footer from "./components/Footer";
import { processXpGain } from "./utils/CarbonCalculator";

// Standard pre-configured state to start with, representing Saami Abbas Khan level 12!
const DEFAULT_MISSIONS: DailyMission[] = [
  { id: "mission-reusable", title: "Refill Reusable Flask", description: "Avoid buying single-use bottled water", category: "waste", type: "standard", progress: 0, target: 1, unit: "refill", rewardXp: 30, rewardCoins: 8, completed: false, claimed: false, icon: "💧" },
  { id: "mission-steps", title: "Sprint 2000 steps", description: "Ditch car for a short walking commute", category: "transportation", type: "standard", progress: 850, target: 2000, unit: "steps", rewardXp: 50, rewardCoins: 15, completed: false, claimed: false, icon: "👟" },
  { id: "mission-led", title: "Turn off Sleep Lights", description: "Power down idling screen systems", category: "energy", type: "standard", progress: 0, target: 1, unit: "action", rewardXp: 20, rewardCoins: 5, completed: false, claimed: false, icon: "🔌" },
  { id: "mission-metro", title: "Log Public Transit route", description: "Ride the public metro line to university or job", category: "transportation", type: "standard", progress: 0, target: 1, unit: "ride", rewardXp: 40, rewardCoins: 12, completed: false, claimed: false, icon: "🚊" },
];

const BOSS_MISSION: DailyMission = {
  id: "boss-plastic",
  title: "Defeat structural smog boss",
  description: "Ditch single-use plastic accessories and ride bicycles for 5 trips total this week.",
  category: "lifestyle",
  type: "boss",
  progress: 3,
  target: 5,
  unit: "trips",
  rewardXp: 250,
  rewardCoins: 50,
  completed: false,
  claimed: false,
  icon: "👹"
};

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: "ach-1", title: "First Action", description: "Log your very first eco-friendly action", tier: "Bronze", badgeName: "First Step", progress: 1, target: 1, completed: true, unlockedIcon: "🎯" },
  { id: "ach-2", title: "Weekly Warrior", description: "Maintain a daily habit streak for 7 days", tier: "Silver", badgeName: "7-Day Warrior", progress: 7, target: 7, completed: true, unlockedIcon: "🔥" },
  { id: "ach-3", title: "Bottle Slayer", description: "Ditch 50 single-use plastic bottles", tier: "Gold", badgeName: "Plastic Slayer", progress: 34, target: 50, completed: false, unlockedIcon: "🔱" },
  { id: "ach-4", title: "Eco Champion", description: "Accumulate a net 10,000 XP points", tier: "Platinum", badgeName: "Eco Champion", progress: 3450, target: 10000, completed: false, unlockedIcon: "🛡️" },
  { id: "ach-5", title: "Ultimate Guardian", description: "Reach Level 100 on the Carbon Clash board", tier: "Mythic", badgeName: "Planet Guardian", progress: 12, target: 100, completed: false, unlockedIcon: "🌍" },
];

const DEFAULT_CITY_ITEMS: CityItem[] = [
  { id: "item-t1", type: "tree", x: 1, y: 1, level: 2, name: "Sprout Maple" },
  { id: "item-s1", type: "solar_panel", x: 2, y: 2, level: 1, name: "High-Lux PV Panel" },
  { id: "item-g1", type: "garden", x: 4, y: 3, level: 1, name: "Community Patch" },
];

const INITIAL_LOGS: CarbonLogItem[] = [
  { id: "log-1", date: "2026-06-07", category: "transportation", action: "Bicycled to college", impactKgCo2: 1.2, xpEarned: 30, coinsEarned: 10 },
  { id: "log-2", date: "2026-06-08", category: "diet", action: "Opted for vegetarian options", impactKgCo2: 0.6, xpEarned: 15, coinsEarned: 5 },
  { id: "log-3", date: "2026-06-09", category: "energy", action: "Swapped low load household lamps", impactKgCo2: 0.8, xpEarned: 20, coinsEarned: 8 },
];

export default function App() {
  const [state, setState] = useState<AppState | null>(null);
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [notifications, setNotifications] = useState<string[]>([]);
  const [showLevelUp, setShowLevelUp] = useState<number | null>(null);
  const [showLandingPage, setShowLandingPage] = useState<boolean>(true);
  const [accumulatedCoins, setAccumulatedCoins] = useState<number>(0);

  // Initialize State
  useEffect(() => {
    const saved = localStorage.getItem("carbon_clash_data");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState(parsed);
        if (parsed?.stats?.accumulatedCoins !== undefined) {
          setAccumulatedCoins(parsed.stats.accumulatedCoins);
        }
      } catch (e) {
        initializeDefaultState();
      }
    } else {
      initializeDefaultState();
    }
  }, []);

  const initializeDefaultState = () => {
    const defaultState: AppState = {
      stats: {
        name: "Saami",
        level: 12,
        xp: 3450,
        xpNeeded: 5000,
        streak: 17,
        greenCoins: 125,
        streakFreezes: 1,
        ecoPowerLevel: 37,
        surveyCompleted: true,
        surveyData: {
          transportation: "car",
          diet: "mixed",
          energy: "medium",
          shopping: "moderate"
        },
        unlockedSkins: [],
        activeTheme: "default",
        activeBoost: false
      },
      missions: DEFAULT_MISSIONS,
      bossMission: BOSS_MISSION,
      achievements: DEFAULT_ACHIEVEMENTS,
      cityItems: DEFAULT_CITY_ITEMS,
      cityStage: 3,
      carbonLogs: INITIAL_LOGS,
      friends: [],
      notifications: []
    };
    setState(defaultState);
    localStorage.setItem("carbon_clash_data", JSON.stringify(defaultState));
  };

  const prevLevelRef = useRef<number | null>(null);

  useEffect(() => {
    if (state?.stats?.level !== undefined) {
      if (prevLevelRef.current !== null && state.stats.level > prevLevelRef.current) {
        const finalLevel = state.stats.level;
        setShowLevelUp(finalLevel);
        addNotification(`🎉 UNBELIEVABLE SKILLS! Leveled up to Climate Ranger Lvl ${finalLevel}!`);
      }
      prevLevelRef.current = state.stats.level;
    }
  }, [state?.stats?.level]);

  // Safe Functional State Synchronizer
  const updateState = (updater: (prev: AppState) => AppState) => {
    setState(prev => {
      if (!prev) return prev;
      const next = updater(prev);
      localStorage.setItem("carbon_clash_data", JSON.stringify(next));
      return next;
    });
  };

  const handleOnboardingComplete = (stats: UserStats) => {
    updateState(prev => {
      const freshStats = {
        ...stats,
        unlockedSkins: stats.unlockedSkins || [],
        activeTheme: stats.activeTheme || "default",
        activeBoost: stats.activeBoost || false
      };
      
      return {
        ...prev,
        stats: freshStats,
        cityItems: [],
        cityStage: 1,
        carbonLogs: [],
        missions: DEFAULT_MISSIONS.map(m => ({ ...m, progress: 0, completed: false, claimed: false })),
        bossMission: { ...BOSS_MISSION, progress: 0, completed: false, claimed: false }
      };
    });
    addNotification("Gamer account initialized! Added starter freeze token ❄️");
  };

  const addNotification = (msg: string) => {
    setNotifications(prev => [...prev, msg].slice(-3));
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n !== msg));
    }, 4000);
  };

  // Global Passive Income Generator
  useEffect(() => {
    if (!state) return;
    const timer = setInterval(() => {
      let incomePerSec = 0;
      state.cityItems.forEach(item => {
        const rates: Record<string, number> = {
          tree: 1,
          garden: 3,
          solar_panel: 6,
          wind_turbine: 12,
          ev_station: 20,
          smog_scrubber: 45,
          rail: 35
        };
        const rate = rates[item.type] || 0;
        incomePerSec += rate * item.level;
      });

      if (state.stats.activeBoost) {
        incomePerSec *= 1.25;
      }

      // Scale rates from per-minute to per-second (divided by 60) to align with UI labels!
      const contribution = incomePerSec / 60;

      if (contribution > 0) {
        setAccumulatedCoins(prev => Math.min(10000, Number((prev + contribution).toFixed(3))));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [state?.cityItems, state?.stats?.activeBoost]);

  // Sync accumulatedCoins state globally without redundant LocalStorage writes
  useEffect(() => {
    if (!state) return;
    setState(prev => {
      if (!prev) return prev;
      if (prev.stats.accumulatedCoins === accumulatedCoins) return prev;
      return {
        ...prev,
        stats: {
          ...prev.stats,
          accumulatedCoins
        }
      };
    });
  }, [accumulatedCoins]);

  // Universal Stats adder subroutines
  const addXpToState = (stateObj: AppState, amount: number): AppState => {
    const updated = processXpGain(
      stateObj.stats.xp,
      stateObj.stats.level,
      stateObj.stats.xpNeeded,
      amount
    );

    return {
      ...stateObj,
      stats: {
        ...stateObj.stats,
        xp: updated.xp,
        level: updated.level,
        xpNeeded: updated.xpNeeded
      }
    };
  };

  const addCoinsToState = (stateObj: AppState, amount: number): AppState => {
    return {
      ...stateObj,
      stats: {
        ...stateObj.stats,
        greenCoins: stateObj.stats.greenCoins + amount
      }
    };
  };

  const handleAddXp = (amount: number) => {
    updateState(prev => addXpToState(prev, amount));
  };

  const handleAddCoins = (amount: number) => {
    updateState(prev => addCoinsToState(prev, amount));
    addNotification(`🪙 Earned +${amount} Green Coins! Spend in shop.`);
  };

  const handleUpdateAppName = (name: string) => {
    updateState(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        appName: name
      }
    }));
    addNotification(`🏷️ App rebranded as: "${name}"!`);
  };

  const handleUpdateFooterText = (text: string) => {
    updateState(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        footerText: text
      }
    }));
    addNotification(`📝 Footer custom subline updated!`);
  };

  const handleUpdateTrajectoryScale = (scale: number) => {
    updateState(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        trajectoryScale: scale
      }
    }));
    addNotification(`📈 Graph projection scale adjusted to: ${scale}x!`);
  };

  const handleResetProfile = () => {
    const clearedState: AppState = {
      stats: {
        name: "", // Reset to empty string so user enters their true name in claim tag!
        level: 1,
        xp: 0,
        xpNeeded: 100,
        greenCoins: 10,
        streakFreezes: 1,
        ecoPowerLevel: 10,
        streak: 1,
        surveyCompleted: false, // Go back to onboarding
        surveyData: null,
        unlockedSkins: [],
        activeTheme: "default",
        activeBoost: false,
        appName: state?.stats?.appName || "Carbon Clash",
        footerText: state?.stats?.footerText || "Carbon Clash Engine v4.0.1",
        trajectoryScale: 1.0,
        accumulatedCoins: 0
      },
      missions: DEFAULT_MISSIONS.map(m => ({ ...m, progress: 0, completed: false, claimed: false })),
      bossMission: {
        ...BOSS_MISSION,
        progress: 0,
        completed: false,
        claimed: false
      },
      achievements: DEFAULT_ACHIEVEMENTS.map(a => ({ ...a, progress: 0, completed: false })),
      cityItems: [],
      cityStage: 1,
      carbonLogs: [],
      friends: [],
      notifications: []
    };

    setState(clearedState);
    setAccumulatedCoins(0);
    setShowLandingPage(true); // Return to pristine landing page on reset!
    localStorage.setItem("carbon_clash_data", JSON.stringify(clearedState));
    addNotification("🧹 All profile achievements, logs, and cities purged to zero!");
  };

  const handleLogQuickAction = (actionName: string, xp: number, coins: number, carbonSaved: number, category: string) => {
    updateState(prev => {
      const newLog: CarbonLogItem = {
        id: `log-${Date.now()}`,
        date: new Date().toISOString().split("T")[0],
        category: category as any,
        action: actionName,
        impactKgCo2: carbonSaved,
        xpEarned: xp,
        coinsEarned: coins
      };

      // Calculate updated Eco power level based on activity
      let ecoPowerMod = prev.stats.ecoPowerLevel + 1;
      if (ecoPowerMod > 100) ecoPowerMod = 100;

      // Advance similar missions
      const updatedMissions = prev.missions.map(m => {
        if (m.category === category && m.progress < m.target) {
          const nextProg = m.progress + 1;
          return {
            ...m,
            progress: nextProg,
            completed: nextProg >= m.target
          };
        }
        return m;
      });

      let nextState = {
        ...prev,
        stats: {
          ...prev.stats,
          ecoPowerLevel: ecoPowerMod,
          // Daily streak DOES NOT increase on mere quick actions log logging!
        },
        carbonLogs: [...prev.carbonLogs, newLog],
        missions: updatedMissions
      };

      nextState = addXpToState(nextState, xp);
      nextState = addCoinsToState(nextState, coins);

      return nextState;
    });
    addNotification(`✅ Logged: "${actionName}" • Offset ${carbonSaved}kg Co2`);
  };

  const handleCompleteMission = (id: string) => {
    if (!state) return;
    const isBoss = id === state.bossMission.id;
    if (isBoss) {
      if (state.bossMission.progress >= state.bossMission.target) {
        return;
      }
      const nextProg = state.bossMission.progress + 1;
      const finalProg = Math.min(nextProg, state.bossMission.target);

      updateState(prev => {
        return {
          ...prev,
          bossMission: {
            ...prev.bossMission,
            progress: finalProg,
            completed: finalProg >= prev.bossMission.target
          }
        };
      });

      if (finalProg >= state.bossMission.target) {
        addNotification("👹 Boss shield destroyed! Defeat Boss button enabled.");
      } else {
        addNotification("👹 Boss shield damaged! Continue working on quest requirements.");
      }
    } else {
      const targetM = state.missions.find(m => m.id === id);
      if (!targetM) return;
      const wasCompleted = targetM.completed;

      updateState(prev => {
        const updatedMissions = prev.missions.map(m => {
          if (m.id === id) {
            return {
              ...m,
              progress: m.target,
              completed: true
            };
          }
          return m;
        });
        return {
          ...prev,
          missions: updatedMissions
        };
      });

      if (!wasCompleted) {
        addNotification("⚡ Quest parameters met! Ready to claim.");
      }
    }
  };

  const handleClaimReward = (id: string, xp: number, coins: number) => {
    if (!state) return;
    const targetM = state.missions.find(m => m.id === id);
    if (!targetM || targetM.claimed) return; // Avoid duplicate rewards

    updateState(prev => {
      const updatedMissions = prev.missions.map(m => {
        if (m.id === id) {
          return { ...m, claimed: true };
        }
        return m;
      });

      let nextState = {
        ...prev,
        missions: updatedMissions
      };

      nextState = addXpToState(nextState, xp);
      nextState = addCoinsToState(nextState, coins);

      return nextState;
    });

    addNotification(`🎁 Rewards gathered: +${xp} XP & +${coins} Coins!`);
  };

  const handleClaimBossReward = (xp: number, coins: number) => {
    if (!state || state.bossMission.claimed) return;

    const vacantCell = state.cityItems.length < 36 ? findFirstVacantCell(state.cityItems) : null;

    updateState(prev => {
      let nextState = {
        ...prev,
        bossMission: {
          ...prev.bossMission,
          claimed: true
        }
      };

      if (vacantCell) {
        const turbineItem: CityItem = {
          id: `wind_turbine-boss-${Date.now()}`,
          type: "wind_turbine",
          x: vacantCell.x,
          y: vacantCell.y,
          level: 1,
          name: "Legendary Aeolus Turbo"
        };
        nextState.cityItems = [...nextState.cityItems, turbineItem];
      }

      nextState = addXpToState(nextState, xp);
      nextState = addCoinsToState(nextState, coins);

      return nextState;
    });

    if (vacantCell) {
      addNotification("🌀 Defeated Boss! Rare Aeolus Wind Turbine deployed on your city grid!");
    }
    addNotification("⚔️ Boss slain! Massive legendary rewards added!");
  };

  const findFirstVacantCell = (items: CityItem[]) => {
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 6; c++) {
        if (!items.some(i => i.x === c && i.y === r)) {
          return { x: c, y: r };
        }
      }
    }
    return null;
  };

  const handleUpdateCity = (newItems: CityItem[], newStage: number, coinCost = 0, coinsEarned = 0, xpEarned = 0) => {
    if (!state || coinCost > state.stats.greenCoins) return;

    updateState(prev => {
      let nextState = {
        ...prev,
        cityItems: newItems,
        cityStage: newStage,
        stats: {
          ...prev.stats,
          greenCoins: prev.stats.greenCoins - coinCost + coinsEarned
        }
      };

      if (xpEarned > 0) {
        nextState = addXpToState(nextState, xpEarned);
      }

      return nextState;
    });

    if (coinCost > 0) addNotification(`🏛️ Construction complete! Invested ${coinCost} coins.`);
    if (coinsEarned > 0) addNotification(`🪙 Collected +${coinsEarned} passively generated coins!`);
  };

  const handlePurchaseFreeze = (cost: number) => {
    if (!state) return;
    if (state.stats.streakFreezes >= 3) {
      addNotification("⚠️ Max limit reached! You can hold at most 3 streak freezes.");
      return;
    }
    if (cost > state.stats.greenCoins) return;

    updateState(prev => {
      return {
        ...prev,
        stats: {
          ...prev.stats,
          greenCoins: prev.stats.greenCoins - cost,
          streakFreezes: prev.stats.streakFreezes + 1
        }
      };
    });

    addNotification("❄️ Streak freeze secured in your gear collection.");
  };

  // Handles custom skin purchase triggers from Eco Shop nicely and saves them in the player's profile!
  const handleBuyCosmetic = (cost: number, itemId: string, itemName: string) => {
    updateState(prev => {
      if (prev.stats.greenCoins < cost) return prev;
      
      const currentUnlocked = prev.stats.unlockedSkins || [];
      const updatedSkins = currentUnlocked.includes(itemId) ? currentUnlocked : [...currentUnlocked, itemId];
      
      return {
        ...prev,
        stats: {
          ...prev.stats,
          greenCoins: prev.stats.greenCoins - cost,
          unlockedSkins: updatedSkins,
          activeTheme: itemId.endsWith("theme") || itemId.endsWith("skin") ? itemId : prev.stats.activeTheme,
          activeBoost: itemId === "carbon_multiplier" ? true : prev.stats.activeBoost
        }
      };
    });
    addNotification(`🎁 Unlocked & Equipped: "${itemName}"!`);
  };

  const handleInjectCustomMission = (mission: Omit<DailyMission, "id" | "progress" | "completed" | "claimed" | "icon">) => {
    updateState(prev => {
      const newM: DailyMission = {
        ...mission,
        id: `custom-m-${Date.now()}`,
        progress: 0,
        completed: false,
        claimed: false,
        icon: mission.category === "transportation" ? "🚲" : mission.category === "energy" ? "🔌" : "📦"
      };

      return {
        ...prev,
        missions: [...prev.missions, newM]
      };
    });

    addNotification("🎯 Custom daily campaign inject successfully!");
  };

  if (showLandingPage) {
    return (
      <LandingPage 
        onEnter={() => setShowLandingPage(false)} 
        savedUsername={state?.stats?.name} 
        savedLevel={state?.stats?.level} 
        appName={state?.stats?.appName}
        footerText={state?.stats?.footerText}
      />
    );
  }

  if (!state) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-400 flex items-center justify-center font-mono">
        <Sparkles className="w-6 h-6 animate-spin text-emerald-400 pr-0.5" />
        <span>RESTARTING SYSTEM CHIPS...</span>
      </div>
    );
  }

  // Not completed Survey -> Onboarding Flow First
  if (!state.stats.surveyCompleted) {
    return (
      <Onboarding 
        onComplete={handleOnboardingComplete} 
        startingStreak={state.stats.streak}
        appName={state.stats.appName}
        footerText={state.stats.footerText}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-400 selection:text-black">
      
      {/* Top Navigation HUD */}
      <nav className="w-full bg-zinc-900/40 border-b border-white/5 sticky top-0 z-30 backdrop-blur-md px-6 py-3.5 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-400 to-lime-500 border border-white/20 shadow-glow flex items-center justify-center text-slate-950 font-black tracking-wider text-sm font-display">
            {state?.stats?.name ? state.stats.name.charAt(0).toUpperCase() : "S"}
          </div>
          <div>
            <h1 className="text-sm font-black tracking-wide text-emerald-400 uppercase leading-none">{state?.stats?.name || "Saami Abbas"}</h1>
            <span className="text-[10px] text-zinc-400 block mt-1">Level {state.stats.level} Climate Warrior</span>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: "dashboard", label: "Dashboard", badge: "Live" },
            { id: "city", label: "Virtual Grid", badge: null },
            { id: "coach", label: "AI Advisor", badge: "GPT" },
            { id: "achievements", label: "Accolades", badge: null },
            { id: "analytics", label: "Trajectory", badge: null },
            { id: "leaderboard", label: "Leaderboard", badge: null },
            { id: "shop", label: "Eco Shop", badge: "Shop" },
            { id: "sandbox", label: "Sandbox", badge: "Sys" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all relative shrink-0 flex items-center gap-1.5 cursor-pointer border ${
                activeTab === tab.id
                  ? "bg-slate-950 border-slate-850 text-emerald-400 font-extrabold"
                  : "border-transparent text-slate-500 hover:text-slate-350"
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="text-[8px] font-mono bg-indigo-500/10 border border-indigo-400/20 text-indigo-400 px-1 py-0.2 rounded font-semibold font-mono animate-pulse">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Action HUD */}
        <div className="flex items-center gap-3">
          <button
            id="app-reset-profile"
            onClick={handleResetProfile}
            aria-label="Reset profile progression"
            className="p-2 hover:bg-slate-850 text-slate-500 hover:text-slate-300 rounded-xl border border-slate-850/40 transition-all flex items-center gap-1.5 text-xs font-mono tracking-wider cursor-pointer"
            title="Reset profile progression"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Reset Game</span>
          </button>
        </div>
      </nav>

      {/* Main viewport Container */}
      <main className="max-w-7xl w-full mx-auto p-4 md:p-6 flex-1">
        
        {/* Render Active View Segment */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
            className="focus:outline-none"
          >
            {activeTab === "dashboard" && (
              <Dashboard
                stats={state.stats}
                missions={state.missions}
                bossMission={state.bossMission}
                onLogQuickAction={handleLogQuickAction}
                onCompleteMission={handleCompleteMission}
                onClaimReward={handleClaimReward}
                onClaimBossReward={handleClaimBossReward}
              />
            )}

            {activeTab === "city" && (
              <CityBuilder
                stats={state.stats}
                cityItems={state.cityItems}
                cityStage={state.cityStage}
                accumulatedCoins={accumulatedCoins}
                setAccumulatedCoins={setAccumulatedCoins}
                onUpdateCity={handleUpdateCity}
              />
            )}

            {activeTab === "coach" && (
              <AICoach
                stats={state.stats}
                survey={state.stats.surveyData}
                logs={state.carbonLogs}
                onAddCustomMission={handleInjectCustomMission}
              />
            )}

            {activeTab === "achievements" && (
              <div className="space-y-6">
                <AchievementsTab achievements={state.achievements} />
                <div className="text-center pt-4">
                  <span className="text-xs font-mono text-slate-500">Want to share achievements? Launch the Posters Generator below</span>
                  <button
                    id="trigger-posters-tab"
                    onClick={() => setActiveTab("posters")}
                    className="mt-3 bg-slate-900 border border-slate-800 hover:border-emerald-500/20 py-2.5 px-4 rounded-xl text-xs font-bold text-slate-350 hover:text-emerald-300 mx-auto block cursor-pointer transition-colors"
                  >
                    Go to Poster Designer
                  </button>
                </div>
              </div>
            )}

            {activeTab === "analytics" && (
              <Analytics stats={state.stats} logs={state.carbonLogs} />
            )}

            {activeTab === "leaderboard" && (
              <Leaderboard 
                currentUsername={state.stats.name} 
                currentLevel={state.stats.level} 
                currentXp={state.stats.xp} 
                currentStreak={state.stats.streak} 
              />
            )}

            {activeTab === "shop" && (
              <RewardsShop
                currentCoins={state.stats.greenCoins}
                streakFreezes={state.stats.streakFreezes}
                unlockedSkins={state.stats.unlockedSkins || []}
                onPurchaseFreeze={handlePurchaseFreeze}
                onBuyCosmetic={handleBuyCosmetic}
              />
            )}

            {activeTab === "posters" && (
              <ShareCard
                username={state.stats.name}
                level={state.stats.level}
                streak={state.stats.streak}
                ecoPower={state.stats.ecoPowerLevel}
              />
            )}

            {activeTab === "sandbox" && (
              <AdminPanel
                stats={state.stats}
                onAddXp={handleAddXp}
                onAddCoins={handleAddCoins}
                onTriggerEventState={(ev) => handleUpdateCity(state.cityItems, ev === "smog" ? 1 : 5)}
                onInjectCustomMission={handleInjectCustomMission}
                onUpdateAppName={handleUpdateAppName}
                onUpdateFooterText={handleUpdateFooterText}
                onUpdateTrajectoryScale={handleUpdateTrajectoryScale}
                onResetProfile={handleResetProfile}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating alert notifications HUD */}
      <div className="fixed bottom-6 right-6 space-y-2 z-55 w-[280px]">
        {notifications.map((not, idx) => (
          <div
            key={idx}
            className="p-3.5 bg-slate-900 border border-emerald-500/30 text-xs font-semibold text-emerald-300 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce flex-wrap"
          >
            <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0 animate-spin" />
            <span>{not}</span>
          </div>
        ))}
      </div>

      {/* Level Increase Celebration Modal */}
      {showLevelUp !== null && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-55">
          <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 text-center max-w-sm w-full animate-pulse">
            <span className="text-6xl block mb-4 animate-bounce">🏆</span>
            <span className="text-[10px] font-mono bg-emerald-500 text-slate-950 font-black uppercase px-2 py-0.5 rounded border border-slate-950">
              LEVEL SURGED!
            </span>
            <h3 className="text-2xl font-black text-white mt-3">Reached Level {showLevelUp}!</h3>
            <p className="text-xs text-slate-400 mt-2 max-w-xs leading-relaxed">
              Incredible skills Ranger! Your passive city currencies multiplier increased to **{(showLevelUp * 0.15 + 1).toFixed(2)}x**! Unlock codes applied.
            </p>
            <button
              id="dismiss-levelup-modal"
              onClick={() => setShowLevelUp(null)}
              className="mt-6 w-full bg-gradient-to-r from-emerald-500 to-indigo-600 text-slate-150 font-bold py-3.5 rounded-2xl active:scale-95 transition-all outline-none cursor-pointer"
            >
              Continue Questing!
            </button>
          </div>
        </div>
      )}

      {/* All layouts must feature the footer containing attribution for Saami */}
      <Footer footerText={state.stats.footerText} />
    </div>
  );
}
