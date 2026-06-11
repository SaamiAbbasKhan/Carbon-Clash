import { useState, useEffect, useRef, Dispatch, SetStateAction } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Lock, 
  Plus, 
  Sparkles, 
  Coins, 
  Building2, 
  TrendingUp, 
  Compass, 
  Trash
} from "lucide-react";
import { CityItem, UserStats } from "../types";

interface CityBuilderProps {
  stats: UserStats;
  cityItems: CityItem[];
  cityStage: number;
  accumulatedCoins: number;
  setAccumulatedCoins: Dispatch<SetStateAction<number>>;
  onUpdateCity: (newItems: CityItem[], newStage: number, coinCost?: number, coinEarned?: number, xpEarned?: number) => void;
}

interface PurchaseableStructure {
  type: CityItem["type"];
  name: string;
  cost: number;
  ecoBonus: number;
  passiveCoinsRate: number; // Coins earned per second
  minLevel: number;
  description: string;
  symbol: string;
}

const MARKET_ITEMS: PurchaseableStructure[] = [
  { type: "tree", name: "Sprout Maple", cost: 20, ecoBonus: 5, passiveCoinsRate: 1, minLevel: 1, description: "A beautiful native tree. Cleans CO₂.", symbol: "🌳" },
  { type: "garden", name: "Community Patch", cost: 45, ecoBonus: 12, passiveCoinsRate: 3, minLevel: 2, description: "Urban organic garden providing local food.", symbol: "🥕" },
  { type: "solar_panel", name: "High-Lux PV Panel", cost: 80, ecoBonus: 22, passiveCoinsRate: 6, minLevel: 4, description: "Generates clean electricity from pure sunlight.", symbol: "☀️" },
  { type: "wind_turbine", name: "Aeolus Turbo", cost: 150, ecoBonus: 40, passiveCoinsRate: 12, minLevel: 6, description: "Kinetic wind generator. Heavy visual spinning.", symbol: "🌀" },
  { type: "ev_station", name: "VoltCharge Dock", cost: 250, ecoBonus: 75, passiveCoinsRate: 20, minLevel: 8, description: "Unlocks rapid EV recharging for neighborhoods.", symbol: "🔌" },
  { type: "smog_scrubber", name: "Apex Carbon Scrubber", cost: 500, ecoBonus: 150, passiveCoinsRate: 45, minLevel: 10, description: "Absorbs raw heavy gas and outputs fresh oxygen.", symbol: "🔬" },
];

const STAGE_NAMES = [
  "Polluted Town (Smog & Heavy Ash)",
  "Clean Neighborhood (Trash Cleared)",
  "Eco-Green District (Renewables Integrated)",
  "Smart Sustainable City (Hyperconnected)",
  "Future Green Civilization (Sci-Fi Utopia)"
];

export default function CityBuilder({ stats, cityItems, cityStage, accumulatedCoins, setAccumulatedCoins, onUpdateCity }: CityBuilderProps) {
  const [selectedCell, setSelectedCell] = useState<{ x: number; y: number } | null>(null);
  const [marketOpen, setMarketOpen] = useState(false);
  const [buildWarning, setBuildWarning] = useState<string | null>(null);
  const [demolishConfirm, setDemolishConfirm] = useState<boolean>(false);
  const [floatingCoinAnim, setFloatingCoinAnim] = useState<boolean>(false);

  const availableMarketItems = [
    ...MARKET_ITEMS,
    ...((stats.unlockedSkins || []).includes("maglev_boost") ? [
      { type: "rail" as const, name: "Maglev HyperExpress", cost: 300, ecoBonus: 100, passiveCoinsRate: 35, minLevel: 1, description: "Futuristic zero-friction hover carriage. Generates rich passive coins.", symbol: "🚄" }
    ] : [])
  ];

  const handleCollectCoins = () => {
    if (accumulatedCoins <= 0) return;
    const coinsInt = Math.floor(accumulatedCoins);
    if (coinsInt > 0) {
      setFloatingCoinAnim(true);
      setTimeout(() => setFloatingCoinAnim(false), 1200);
      onUpdateCity(cityItems, cityStage, 0, coinsInt, 15); // Gives +15 XP for maintaining city!
      setAccumulatedCoins(0);
    }
  };

  const handleSelectGrid = (x: number, y: number) => {
    setSelectedCell({ x, y });
    setBuildWarning(null);
    setDemolishConfirm(false);
    setMarketOpen(true);
  };

  const handleBuildStructure = (structure: PurchaseableStructure) => {
    if (!selectedCell) return;
    if (stats.greenCoins < structure.cost) {
      setBuildWarning(`⚠️ Not enough Green Coins! You need ${structure.cost} coins but you only have ${stats.greenCoins}. Complete daily quests to earn more.`);
      return;
    }
    if (stats.level < structure.minLevel) {
      setBuildWarning(`🔒 Structure locked! Reaching level ${structure.minLevel} is required.`);
      return;
    }

    setBuildWarning(null);
    const newItem: CityItem = {
      id: `${structure.type}-${Date.now()}`,
      type: structure.type,
      x: selectedCell.x,
      y: selectedCell.y,
      level: 1,
      name: structure.name
    };

    // Replace if existing, or insert new
    const filteredItems = cityItems.filter(item => !(item.x === selectedCell.x && item.y === selectedCell.y));
    const finalItems = [...filteredItems, newItem];

    // Recalculate Stage
    let totalEcoPower = stats.ecoPowerLevel + finalItems.length * 5;
    let nextStage = cityStage;
    if (totalEcoPower >= 85) nextStage = 5;
    else if (totalEcoPower >= 65) nextStage = 4;
    else if (totalEcoPower >= 45) nextStage = 3;
    else if (totalEcoPower >= 25) nextStage = 2;
    else nextStage = 1;

    onUpdateCity(finalItems, nextStage, structure.cost, 0, 80); // Give +80 XP for constructing a building!
    setMarketOpen(false);
    setSelectedCell(null);
  };

  const handleDemolish = (x: number, y: number) => {
    const item = cityItems.find(i => i.x === x && i.y === y);
    if (!item) return;

    const finalItems = cityItems.filter(i => !(i.x === x && i.y === y));
    onUpdateCity(finalItems, cityStage, 0, 0, 0);
    setMarketOpen(false);
    setSelectedCell(null);
    setDemolishConfirm(false);
  };

  const handleUpgradeItem = (x: number, y: number) => {
    const item = cityItems.find(i => i.x === x && i.y === y);
    if (!item) return;
    
    const upgradeCost = item.level * 40;
    if (stats.greenCoins < upgradeCost) {
      setBuildWarning(`⚠️ Insufficient funds! Upgrading this unit calls for ${upgradeCost} Green Coins.`);
      return;
    }

    setBuildWarning(null);
    const updatedItems = cityItems.map(i => {
      if (i.x === x && i.y === y) {
        return { ...i, level: i.level + 1, name: `Prime ${i.name.replace("Prime ", "")}` };
      }
      return i;
    });

    onUpdateCity(updatedItems, cityStage, upgradeCost, 0, 100); // Generous +100 XP for major upgrade!
    setMarketOpen(false);
    setSelectedCell(null);
  };

  // Generate 8x8 grid
  const renderGrid = () => {
    const cells = [];
    for (let r = 0; r < 6; r++) { // Keeping it clean 6x6 grid for visual simplicity on viewport!
      for (let c = 0; c < 6; c++) {
        const item = cityItems.find(i => i.x === c && i.y === r);
        const isSelected = selectedCell?.x === c && selectedCell?.y === r;
        const cellLabel = item 
          ? `Coordinate X ${c} Y ${r}: Contains Level ${item.level} ${item.name}`
          : `Coordinate X ${c} Y ${r}: Empty plot. Select to deploy green technology`;
        
        cells.push(
          <div
            key={`${c}-${r}`}
            onClick={() => handleSelectGrid(c, r)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleSelectGrid(c, r);
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={cellLabel}
            aria-pressed={isSelected}
            className={`aspect-square rounded-xl flex flex-col items-center justify-center relative cursor-pointer border transition-all hover:scale-105 duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
              isSelected 
                ? "border-emerald-400 bg-emerald-500/10 shadow-lg shadow-emerald-500/10 ring-2 ring-emerald-500/20" 
                : item 
                  ? "border-slate-800 bg-slate-900/60" 
                  : "border-slate-900 bg-slate-950/20 hover:bg-slate-900/10"
            }`}
          >
            {item ? (
              <div className="flex flex-col items-center justify-center">
                <span className="text-2xl animate-spin-slow">{availableMarketItems.find(m => m.type === item.type)?.symbol || "🗺️"}</span>
                <span className="absolute bottom-1 right-1 text-[8px] font-mono font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-500/20 rounded-md px-1 py-0.2">
                  L{item.level}
                </span>
              </div>
            ) : (
              <span className="text-slate-705/30 text-[10px] uppercase font-mono group-hover:text-slate-500 flex items-center justify-center">
                <Plus className="w-3.5 h-3.5" />
              </span>
            )}
          </div>
        );
      }
    }
    return cells;
  };

  const getStageStyle = () => {
    switch (cityStage) {
      case 1: // Polluted
        return {
          banner: "from-slate-500/20 to-slate-800/10 border-slate-700",
          sky: "bg-gradient-to-b from-slate-900 via-stone-950 to-slate-900",
          badge: "bg-stone-800 text-stone-300 border-stone-700",
          smog: true,
        };
      case 2: // Clear neighborhood
        return {
          banner: "from-teal-900/20 to-emerald-900/10 border-teal-800",
          sky: "bg-gradient-to-b from-teal-950 via-slate-950 to-slate-900",
          badge: "bg-teal-900/30 text-teal-300 border-teal-800/30",
          smog: false,
        };
      case 3: // Eco district
        return {
          banner: "from-sky-950/20 to-emerald-900/10 border-sky-800",
          sky: "bg-gradient-to-b from-sky-950 via-slate-950 to-emerald-950/20",
          badge: "bg-sky-950/40 text-sky-300 border-sky-800/40",
          smog: false,
        };
      case 4: // Smart
        return {
          banner: "from-indigo-950/20 to-emerald-900/10 border-indigo-800",
          sky: "bg-gradient-to-b from-indigo-950 via-slate-950 to-emerald-950/30",
          badge: "bg-indigo-950/40 text-indigo-300 border-indigo-800/40",
          smog: false,
        };
      case 5: // Future green
      default:
        return {
          banner: "from-emerald-950/30 to-violet-950/10 border-emerald-500/20",
          sky: "bg-gradient-to-b from-emerald-950 via-slate-950 to-violet-950/20",
          badge: "bg-emerald-950/40 text-emerald-300 border-emerald-500/30",
          smog: false,
        };
    }
  };

  const style = getStageStyle();

  return (
    <div id="city-builder-section" className="space-y-6">
      {/* City Status HUD */}
      <div className={`p-6 rounded-3xl bg-gradient-to-r ${style.banner} border backdrop-blur-md relative overflow-hidden transition-all duration-500`}>
        {/* Animated Pollution effect */}
        {style.smog && (
          <div className="absolute inset-0 bg-stone-900/40 opacity-40 mix-blend-color-burn pointer-events-none animate-pulse" />
        )}
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider">ECO REALM SYSTEM</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-mono font-bold ${style.badge}`}>
                STAGE {cityStage}/5
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-400" />
              {STAGE_NAMES[cityStage - 1]}
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              <p className="text-xs text-slate-400 max-w-sm">
                Your Virtual Eco-City grows automatically as your overall eco-power level expands and as you purchase tech modules.
              </p>
              <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-md px-2 py-0.5 text-[10px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
                <Coins className="w-3 h-3 text-emerald-400 animate-spin-slow" />
                ACTIVE RATE: {((cityItems.reduce((acc, curr) => acc + (availableMarketItems.find(m => m.type === curr.type)?.passiveCoinsRate || 0) * curr.level, 0)) * (stats.activeBoost ? 1.25 : 1.0)).toFixed(1)} Coins / min
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            {/* Total Balance Badge */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Coins className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="min-w-[80px]">
                <div className="text-[9px] font-mono text-slate-500 uppercase leading-none">TOTAL BALANCE</div>
                <div className="text-sm font-black text-emerald-400 font-mono mt-1">{stats.greenCoins} C</div>
              </div>
            </div>

            {/* Collect Coins Button */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-400/20 flex items-center justify-center">
                  <Coins className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <div className="text-[9px] font-mono text-slate-500 uppercase leading-none">UNCLAIMED COINS</div>
                  <div className="text-sm font-black text-amber-300 font-mono flex items-center gap-1 mt-1">
                    {Math.floor(accumulatedCoins)} <span className="text-emerald-500 text-[10px]" title="Gain rate in minutes">+{((cityItems.reduce((acc, curr) => acc + (availableMarketItems.find(m => m.type === curr.type)?.passiveCoinsRate || 0) * curr.level, 0)) * (stats.activeBoost ? 1.25 : 1.0)).toFixed(1)}/min</span>
                  </div>
                </div>
              </div>
              <button
                id="collect-coins-btn"
                onClick={handleCollectCoins}
                disabled={Math.floor(accumulatedCoins) <= 0}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  Math.floor(accumulatedCoins) > 0
                    ? "bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md shadow-amber-500/10 cursor-pointer"
                    : "bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed"
                }`}
              >
                Collect
              </button>
            </div>
          </div>
        </div>

        {/* Floating Coin overlay animation */}
        <AnimatePresence>
          {floatingCoinAnim && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: -40, scale: 1.2 }}
              exit={{ opacity: 0 }}
              className="absolute right-10 top-10 text-amber-300 font-mono font-black z-50 flex items-center gap-1 shadow-glow"
            >
              <Coins className="w-5 h-5 text-amber-400 animate-bounce" />
              <span>+{Math.floor(accumulatedCoins)} Green Coins!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Virtual City Grid Board */}
        <div className={`col-span-1 lg:col-span-7 p-6 rounded-3xl ${style.sky} border border-slate-800/80 shadow-inner shadow-slate-950 flex flex-col justify-center relative overflow-hidden h-[420px]`}>
          
          {/* Aesthetic Clouds and Grid styling */}
          <div className="absolute top-8 left-10 w-24 h-6 bg-white/5 opacity-10 blur-md rounded-full animate-pulse pointer-events-none" />
          <div className="absolute top-20 right-14 w-32 h-8 bg-white/5 opacity-10 blur-md rounded-full animate-pulse-slow pointer-events-none" />
          
          <div className="grid grid-cols-6 gap-2 w-full max-w-[340px] mx-auto relative z-10">
            {renderGrid()}
          </div>
          
          <div className="text-center mt-4">
            <span className="text-[10px] font-mono text-slate-500 flex items-center justify-center gap-1 uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5 animate-spin" /> Tap empty blocks to deploy green technology
            </span>
          </div>
        </div>

        {/* Cell Market/Construct Panel */}
        <div className="col-span-1 lg:col-span-5 flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {marketOpen && selectedCell ? (
              <motion.div
                key="market"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="p-6 rounded-3xl bg-slate-900 border border-slate-800/80 flex flex-col h-full justify-between gap-4"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-extrabold text-white tracking-tight">Deploy Module</h3>
                      <p className="text-xs text-slate-400 font-mono">GRID COORDINATES: X{selectedCell.x}, Y{selectedCell.y}</p>
                    </div>
                    {cityItems.find(i => i.x === selectedCell.x && i.y === selectedCell.y) && (
                      <div className="flex gap-1.5 items-center">
                        <button
                          id="upgrade-structure-btn"
                          onClick={() => handleUpgradeItem(selectedCell.x, selectedCell.y)}
                          className="px-2.5 py-1.5 bg-indigo-500/20 hover:bg-indigo-500 text-indigo-300 hover:text-slate-950 rounded-xl text-xs font-mono font-bold border border-indigo-500/30 transition-all cursor-pointer"
                        >
                          Upgrade (L{cityItems.find(i => i.x === selectedCell.x && i.y === selectedCell.y)?.level} • Cost {cityItems.find(i => i.x === selectedCell.x && i.y === selectedCell.y)!.level * 40} C)
                        </button>
                        
                        {!demolishConfirm ? (
                          <button
                            id="demolish-structure-btn"
                            onClick={() => setDemolishConfirm(true)}
                            className="p-2 bg-rose-950/40 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl cursor-pointer transition-colors"
                            title="Demolish structure"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        ) : (
                          <div className="flex gap-1 bg-slate-950 p-1 border border-rose-500/30 rounded-xl items-center">
                            <button
                              id="demolish-structure-confirm-btn"
                              onClick={() => handleDemolish(selectedCell.x, selectedCell.y)}
                              className="px-2 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-[10px] font-bold cursor-pointer font-mono"
                            >
                              Yes
                            </button>
                            <button
                              id="demolish-structure-cancel-btn"
                              onClick={() => setDemolishConfirm(false)}
                              className="px-2 py-1 bg-slate-900 text-slate-400 hover:text-slate-200 rounded-lg text-[10px] cursor-pointer font-mono"
                            >
                              No
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {buildWarning && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-350 rounded-xl text-xs font-semibold leading-relaxed mb-4 text-center animate-pulse">
                      {buildWarning}
                    </div>
                  )}

                  {/* Market Items Container */}
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {availableMarketItems.map((item) => {
                      const isLocked = stats.level < item.minLevel;
                      const isAffordable = stats.greenCoins >= item.cost;
                      
                      return (
                        <div
                          key={item.type}
                          onClick={() => !isLocked && handleBuildStructure(item)}
                          className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                            isLocked
                              ? "bg-slate-950/40 border-slate-950 opacity-40 cursor-not-allowed"
                              : "bg-slate-950/80 hover:bg-slate-950 border-slate-800/80 hover:border-emerald-500/30 cursor-pointer"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl p-2 bg-slate-900 rounded-xl border border-slate-800">{item.symbol}</span>
                            <div>
                              <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1">
                                {item.name}
                                {isLocked && <Lock className="w-3 h-3 text-slate-500 mb-0.5" />}
                              </h4>
                              <p className="text-[10px] text-slate-400 line-clamp-1">{item.description}</p>
                              <div className="flex items-center gap-3 mt-1 text-[10px] font-mono">
                                <span className="text-emerald-400 flex items-center gap-0.5">+{item.ecoBonus} Eco</span>
                                <span className="text-amber-400 font-semibold flex items-center gap-0.5">+{item.passiveCoinsRate} Coins/min</span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            {isLocked ? (
                              <span className="text-[9px] font-mono font-bold text-indigo-400">LVL {item.minLevel}</span>
                            ) : (
                              <span className={`text-xs font-mono font-black ${isAffordable ? "text-amber-300" : "text-slate-600"}`}>
                                {item.cost} C
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <button
                  id="close-construct-panel"
                  onClick={() => { setSelectedCell(null); setMarketOpen(false); }}
                  className="w-full bg-slate-950 hover:bg-slate-900 py-3 rounded-xl text-xs font-mono border border-slate-800 text-slate-400 active:scale-95 transition-all outline-none cursor-pointer"
                >
                  Cancel Selection
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="stats_preview"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md flex flex-col justify-between h-full gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-indigo-400 animate-pulse" />
                    <h3 className="text-sm font-mono text-indigo-400 uppercase tracking-widest font-bold">Realm Statistics</h3>
                  </div>
                  <h4 className="text-lg font-extrabold text-white mb-2">Passive Generation Active</h4>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    Every tree and solar array built triggers passive Green Coins income every 30 seconds. Upgrading buildings increases their collection multiplier!
                  </p>

                  {/* Summary items */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-900">
                      <div className="text-[9px] font-mono text-slate-500 uppercase">ACTIVE UNITS</div>
                      <div className="text-xl font-mono font-black text-white mt-1">
                        {cityItems.length}
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-900">
                      <div className="text-[9px] font-mono text-slate-500 uppercase">TIER COEFFICIENT</div>
                      <div className="text-xl font-mono font-black text-rose-500 mt-1">
                        {(cityItems.reduce((acc, curr) => acc + curr.level, 0) * 1.2).toFixed(1)}x
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-400 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 flex-shrink-0 animate-pulse" />
                  <div>
                    <span className="font-bold">Next Stage Goal: </span>
                    Increase your Eco Power level above {(cityStage * 20) + 15} by cutting car travel or shopping frequently.
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
