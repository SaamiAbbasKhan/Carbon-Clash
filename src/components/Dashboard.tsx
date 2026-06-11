import { useState } from "react";
import { 
  Flame, 
  Zap, 
  Coins, 
  CheckCircle2, 
  Sparkles, 
  Activity, 
  Clock,
  Shuffle
} from "lucide-react";
import { DailyMission, UserStats } from "../types";

interface DashboardProps {
  stats: UserStats;
  missions: DailyMission[];
  bossMission: DailyMission;
  onLogQuickAction: (actionName: string, xp: number, coins: number, carbonSaved: number, category: string) => void;
  onCompleteMission: (missionId: string) => void;
  onClaimReward: (missionId: string, xp: number, coins: number) => void;
  onClaimBossReward: (xp: number, coins: number) => void;
}

export default function Dashboard({ 
  stats, 
  missions, 
  bossMission, 
  onLogQuickAction, 
  onCompleteMission, 
  onClaimReward,
  onClaimBossReward
}: DashboardProps) {

  const [bossClaiming, setBossClaiming] = useState(false);

  const quickActions = [
    { name: "Pedaled 2km transit", icon: "🚲", xp: 30, coins: 10, co2: 0.8, category: "transportation", segment: "transport" },
    { name: "Took public metro line", icon: "🚊", xp: 15, coins: 5, co2: 0.5, category: "transportation", segment: "transport" },
    { name: "Plant-based lunch option", icon: "🥗", xp: 20, coins: 8, co2: 0.4, category: "diet", segment: "diet" },
    { name: "Shut down sleeping electronics", icon: "🔌", xp: 10, coins: 3, co2: 0.2, category: "energy", segment: "all" },
    { name: "Refilled reusable coffee flask", icon: "☕", xp: 12, coins: 4, co2: 0.3, category: "waste", segment: "all" },
  ];

  // XP Progress percentages math
  const expPercent = Math.min(100, Math.floor((stats.xp / stats.xpNeeded) * 100));

  return (
    <div id="dashboard-tab-root" className="space-y-6">
      
      {/* HUD Player level card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-500/20 via-indigo-500/10 to-transparent border border-slate-800 backdrop-blur-md relative overflow-hidden">
        
        {/* Glow dots decorations */}
        <div className="absolute top-[-10%] right-[-10%] w-32 h-32 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-32 h-32 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div className="flex items-center gap-4">
            
            {/* Visual avatar box */}
            <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center font-bold text-2xl relative shadow-lg shadow-emerald-500/5">
              <span>👤</span>
              <span className="absolute -bottom-1 -right-1 text-[10px] font-black bg-emerald-500 text-slate-950 px-1.5 py-0.2 rounded font-mono border border-slate-950">
                L{stats.level}
              </span>
            </div>

            <div>
              <div className="text-[10px] font-mono text-slate-500 leading-none uppercase">GOOD MORNING, CLASH FIGHTER</div>
              <h2 className="text-xl font-extrabold text-white mt-1.5 flex items-center gap-1.5 tracking-tight">
                {stats.name}{" "}
                <span className="text-xs bg-indigo-500/20 text-indigo-300 font-mono font-bold px-2 py-0.5 rounded border border-indigo-500/30">
                  Level {stats.level} Climate Warrior
                </span>
              </h2>
              
              {/* Level XP bar */}
              <div className="flex items-center gap-2 mt-2 w-full max-w-xs">
                <div className="flex-1 bg-slate-950 h-2.5 rounded-full border border-slate-950 overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-indigo-500 h-full rounded-full transition-all duration-300" style={{ width: `${expPercent}%` }} />
                </div>
                <span className="text-[10px] font-mono font-black text-slate-400">{stats.xp}/{stats.xpNeeded} XP</span>
              </div>
            </div>
          </div>

          {/* Quick currencies multipliers */}
          <div className="flex gap-3 w-full md:w-auto">
            
            {/* Streak Counter */}
            <div className="flex-1 md:flex-initial bg-slate-950/80 border border-slate-900 rounded-2xl p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 font-bold font-mono">
                <Flame className="w-5 h-5 text-orange-500 animate-pulse fill-orange-500/20" />
              </div>
              <div>
                <span className="text-[9px] font-mono text-slate-500 uppercase block leading-none">MULTIPLIER STREAK</span>
                <span className="text-sm font-mono font-black text-white flex items-center gap-1">
                  {stats.streak} Days {stats.streakFreezes > 0 && <span className="text-[9px] text-cyan-400 font-bold" title="Streak Freeze equipped">(❄️ Shield equipped)</span>}
                </span>
              </div>
            </div>

            {/* Coins balance HUD */}
            <div className="flex-1 md:flex-initial bg-slate-950/80 border border-slate-900 rounded-2xl p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 font-bold font-mono">
                <Coins className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <span className="text-[9px] font-mono text-slate-500 uppercase block leading-none">ECO COINS</span>
                <span className="text-sm font-mono font-black text-amber-400">{stats.greenCoins} Coins</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Quick Action Logger Dashboard Sector */}
      <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-sm font-mono text-indigo-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-indigo-400" /> Log Instant Action
            </h3>
            <p className="text-xs text-slate-400">Perform an direct eco-friendly action to immediately log XP, coins & reduce your profile footprint.</p>
          </div>
        </div>

        {/* Action triggers lists */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 mt-4">
          {quickActions.map((act, idx) => (
            <button
              key={idx}
              onClick={() => onLogQuickAction(act.name, act.xp, act.coins, act.co2, act.category)}
              className="p-3 bg-slate-950 hover:bg-slate-950/80 hover:border-emerald-500/20 rounded-xl text-left border border-slate-900/85 hover:scale-102 transition-all flex flex-col justify-between h-[105px] group cursor-pointer"
            >
              <div className="flex justify-between items-start w-full">
                <span className="text-xl p-1 bg-slate-900 rounded-lg">{act.icon}</span>
                <span className="text-[9px] font-mono text-emerald-400 group-hover:underline">-{act.co2}kg Co2</span>
              </div>

              <div className="mt-2 text-[10px] font-black text-slate-200 line-clamp-1">{act.name}</div>
              
              <div className="flex items-center gap-2 mt-1 text-[9px] font-mono leading-none text-slate-500">
                <span className="text-indigo-400 font-bold flex items-center gap-0.5"><Zap className="w-3 h-3 text-indigo-400" /> +{act.xp} XP</span>
                <span className="text-amber-500 font-bold flex items-center gap-0.5"><Coins className="w-3 h-3 text-amber-500" /> +{act.coins} C</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Core Daily missions card-based board */}
        <div className="col-span-1 lg:col-span-8 p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800/60 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400 animate-spin-slow" /> Active Daily Quests
              </h3>
              <p className="text-xs text-slate-400">Resets every 24 hours. Click items to advance indicators.</p>
            </div>
            <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1 uppercase">
              <Shuffle className="w-3 h-3 text-slate-500" /> Weekly Boss included
            </span>
          </div>

          {/* Missions items list container */}
          <div className="space-y-2.5">
            {missions.map((m) => {
              const isFinishedAndPendingClaim = m.progress >= m.target && !m.claimed;
              
              return (
                <div
                  key={m.id}
                  className={`p-4 rounded-2xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all relative overflow-hidden ${
                    m.claimed 
                      ? "bg-slate-950/40 border-slate-950 opacity-40 cursor-default" 
                      : isFinishedAndPendingClaim
                        ? "bg-gradient-to-r from-emerald-500/10 to-transparent border-emerald-500/30"
                        : "bg-slate-950/80 border-slate-850/80 hover:border-slate-800"
                  }`}
                >
                  
                  {/* Title and details */}
                  <div className="flex items-start gap-3.5 flex-1 select-none">
                    <span className="text-2xl p-2 bg-slate-900 border border-slate-800/80 rounded-xl leading-none">{m.icon}</span>
                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 leading-tight">
                        {m.title}
                        {m.claimed && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      </h4>
                      <p className="text-[10px] text-slate-400 leading-normal mt-0.5">{m.description}</p>
                      
                      {/* Active numeric tracker element */}
                      {!m.claimed && (
                        <div className="flex items-center gap-2 mt-2 w-full max-w-xs">
                          <button
                            id={`tick-quest-${m.id}`}
                            onClick={() => {
                              if (isFinishedAndPendingClaim) {
                                onClaimReward(m.id, m.rewardXp, m.rewardCoins);
                              } else if (!m.completed) {
                                onCompleteMission(m.id);
                              }
                            }}
                            className={`px-2 py-1 text-[9px] font-mono font-black uppercase rounded transition-colors cursor-pointer ${
                              isFinishedAndPendingClaim 
                                ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950 animate-pulse" 
                                : m.completed 
                                  ? "bg-slate-900 text-emerald-500 cursor-default" 
                                  : "bg-indigo-500/25 hover:bg-indigo-500 text-indigo-300 hover:text-slate-950"
                            }`}
                          >
                            {isFinishedAndPendingClaim ? "CLAIM NOW ⭐" : m.completed ? "TICKED ✓" : "ADVANCE MEASURE"}
                          </button>
                          <span className="text-[9px] font-mono text-slate-500 font-semibold">{m.progress}/{m.target} {m.unit}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Claim action container */}
                  <div className="flex items-center gap-4 self-stretch sm:self-center justify-between border-t border-slate-900 sm:border-none pt-2.5 sm:pt-0">
                    <div className="flex items-center gap-3 text-[10px] font-mono leading-none">
                      <span className="text-indigo-400 font-bold flex items-center gap-0.5"><Zap className="w-3.5 h-3.5" /> +{m.rewardXp} XP</span>
                      <span className="text-amber-500 font-bold flex items-center gap-0.5"><Coins className="w-3.5 h-3.5" /> +{m.rewardCoins} C</span>
                    </div>

                    {isFinishedAndPendingClaim ? (
                      <button
                        id={`claim-quest-${m.id}`}
                        onClick={() => {
                          onClaimReward(m.id, m.rewardXp, m.rewardCoins);
                        }}
                        className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[10px] rounded-xl flex items-center gap-1 shadow-md shadow-emerald-500/10 active:scale-95 transition-all outline-none cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-slate-950 animate-bounce" />
                        <span>CLAIM</span>
                      </button>
                    ) : m.claimed ? (
                      <span className="text-[10px] font-mono font-extrabold text-slate-550 mr-2">CLAIMED</span>
                    ) : (
                      <span className="text-[10px] font-mono text-slate-500 mr-2">ACTIVE</span>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Weekly Boss Missions Panel */}
        <div className="col-span-1 lg:col-span-4 flex flex-col justify-between">
          <div className="p-6 rounded-3xl bg-gradient-to-tr from-rose-950/20 via-slate-900 to-rose-950/10 border border-rose-500/20 flex flex-col h-full justify-between gap-4 relative overflow-hidden">
            
            {/* Shimmer overlay wrapper */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rotate-45 blur-2xl pointer-events-none" />

            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-[9px] font-mono text-rose-450 font-black uppercase tracking-widest bg-rose-950 border border-rose-500/30 px-2 py-0.5 rounded leading-none">
                  WEEKLY BOSS RAID
                </span>
                <span className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 animate-pulse" /> 4d left
                </span>
              </div>

              <span className="text-4xl block mb-3 leading-none">{bossMission.icon}</span>
              <h4 className="text-base font-extrabold text-white tracking-tight">{bossMission.title}</h4>
              <p className="text-xs text-slate-450 mt-1 leading-relaxed">{bossMission.description}</p>

              {/* Progress visual gauge representing Boss health */}
              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between text-[10px] font-mono font-extrabold">
                  <span className="text-rose-400">BOSS SHIELD HP</span>
                  <span className="text-slate-300">{bossMission.progress}/{bossMission.target} Completed</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-900">
                  <div 
                    className="bg-gradient-to-r from-rose-500 to-indigo-500 h-full rounded-full transition-all duration-300" 
                    style={{ width: `${Math.min(100, (bossMission.progress / bossMission.target) * 100)}%` }} 
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-900 pt-4 mt-2">
              <div className="flex flex-col text-[10px] font-mono font-bold leading-normal">
                <span className="text-indigo-400 flex items-center gap-0.5"><Zap className="w-3 h-3" /> +{bossMission.rewardXp} XP</span>
                <span className="text-amber-500 flex items-center gap-0.5"><Coins className="w-3 h-3" /> +{bossMission.rewardCoins} Coins</span>
                <span className="text-emerald-450 flex items-center gap-0.5"><Sparkles className="w-3.5 h-3.5" /> +Rare Wind Turbine</span>
              </div>

              {bossMission.progress >= bossMission.target && !bossMission.claimed && !bossClaiming ? (
                <button
                  id="claim-boss-mission"
                  onClick={() => {
                    setBossClaiming(true);
                    onClaimBossReward(bossMission.rewardXp, bossMission.rewardCoins);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-400 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl active:scale-95 transition-all outline-none cursor-pointer"
                >
                  DEFEAT BOSS
                </button>
              ) : bossMission.claimed || bossClaiming ? (
                <span className="text-[10px] font-mono font-black text-rose-500 leading-none bg-rose-950/20 border border-rose-500/20 px-2.5 py-1 rounded">SLAYED ✓</span>
              ) : bossMission.progress >= bossMission.target ? (
                <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-950/20 px-2.5 py-1 rounded">READY TO SLAY ✓</span>
              ) : (
                <button
                  id="increment-boss-quest-btn"
                  onClick={() => onCompleteMission(bossMission.id)}
                  className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-slate-950 font-bold text-[10px] rounded-lg border border-rose-500/20 active:scale-95 cursor-pointer"
                >
                  LOG ADVANCE
                </button>
              )}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
