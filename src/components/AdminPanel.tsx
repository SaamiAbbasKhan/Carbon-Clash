import { useState } from "react";
import { 
  Sliders, 
  Plus, 
  Trash, 
  AlertOctagon,
  Wrench,
  Edit2
} from "lucide-react";
import { DailyMission, UserStats } from "../types";
import { sanitizeInput } from "../utils/CarbonCalculator";

interface AdminPanelProps {
  stats: UserStats;
  onAddXp: (amount: number) => void;
  onAddCoins: (amount: number) => void;
  onTriggerEventState: (event: string) => void;
  onInjectCustomMission: (mission: Omit<DailyMission, "id" | "progress" | "completed" | "claimed" | "icon">) => void;
  onUpdateAppName: (name: string) => void;
  onUpdateFooterText: (text: string) => void;
  onUpdateTrajectoryScale: (scale: number) => void;
  onResetProfile: () => void;
}

export default function AdminPanel({ 
  stats,
  onAddXp, 
  onAddCoins, 
  onTriggerEventState, 
  onInjectCustomMission,
  onUpdateAppName,
  onUpdateFooterText,
  onUpdateTrajectoryScale,
  onResetProfile
}: AdminPanelProps) {
  const [mName, setMName] = useState("");
  const [mXp, setMXp] = useState(50);
  const [mCoins, setMCoins] = useState(15);
  const [mCategory, setMCategory] = useState<"transportation" | "energy" | "waste" | "water" | "lifestyle">("transportation");

  // Local state for branding controls
  const [localAppName, setLocalAppName] = useState(stats.appName || "Carbon Clash");
  const [localFooterText, setLocalFooterText] = useState(stats.footerText || "Carbon Clash Engine v4.0.1");
  const [localTrajectoryScale, setLocalTrajectoryScale] = useState(stats.trajectoryScale || 1.0);

  const handleCreateQuest = () => {
    const cleanedName = sanitizeInput(mName);
    if (!cleanedName.trim()) {
      return;
    }
    onInjectCustomMission({
      title: cleanedName,
      description: "Custom hackathon administrative simulation quest",
      category: mCategory,
      type: "custom_admin",
      target: 1,
      unit: "action",
      rewardXp: mXp,
      rewardCoins: mCoins
    });
    setMName("");
  };

  const handleEvent = (event: string) => {
    onTriggerEventState(event);
  };

  return (
    <div id="admin-panel-root" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      
      {/* Simulation triggers panel */}
      <div className="col-span-1 lg:col-span-5 space-y-4 bg-slate-900 p-6 rounded-3xl border border-slate-800 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-mono text-indigo-400 font-bold uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
            <Wrench className="w-5 h-5" /> Sandbox Hack Console
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed mb-6">
            For judges and creators: Bypass standard timers, trigger instant resources to evaluate higher tier smart-metropolis architectures, or mock severe pollutant events.
          </p>

          <div className="space-y-3">
            <div>
              <label className="block text-[9px] font-mono text-slate-550 uppercase font-black mb-2">RESOURCE SPOOFERS</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  id="sandbox-add-xp"
                  onClick={() => onAddXp(600)}
                  className="py-3 px-4 bg-slate-950 hover:bg-slate-900 border border-slate-850 hover:border-indigo-500/20 rounded-xl text-xs font-mono font-bold text-slate-200 cursor-pointer active:scale-95 transition-all text-center"
                >
                  ⚡ Mock +600 XP (Level Up)
                </button>
                <button
                  id="sandbox-add-coins"
                  onClick={() => onAddCoins(100)}
                  className="py-3 px-4 bg-slate-950 hover:bg-slate-900 border border-slate-850 hover:border-amber-500/20 rounded-xl text-xs font-mono font-bold text-slate-200 cursor-pointer active:scale-95 transition-all text-center"
                >
                  🪙 Mock +100 Coins
                </button>
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-[9px] font-mono text-slate-550 uppercase font-black mb-2">ENVIRONMENT STATE MUTATOR</label>
              <div className="space-y-1.5">
                {[
                  { id: "smog", title: "Heavy Smog Outbreak", desc: "Forces town pollutions index stage back to Gray Smog town (Stage 1)", isAlert: true },
                  { id: "nature", title: "Smart-Metropolis Evolve Boost", desc: "Instantly maximizes Eco ratings, clearing atmosphere to Smart Metropolis (Stage 5)", isAlert: false },
                ].map((ev) => (
                  <button
                    key={ev.id}
                    onClick={() => handleEvent(ev.id)}
                    className={`w-full text-left p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-colors ${
                      ev.isAlert
                        ? "bg-rose-950/20 border-rose-500/10 hover:border-rose-500/30 text-rose-300"
                        : "bg-emerald-950/20 border-emerald-500/10 hover:border-emerald-500/30 text-emerald-300"
                    }`}
                  >
                    <AlertOctagon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-black">{ev.title}</h4>
                      <p className="text-[10px] text-slate-450 mt-0.5 leading-normal">{ev.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="text-[10px] font-mono text-slate-550 border-t border-slate-800/60 pt-4 leading-normal">
          Designed for Saami Abbas Khan • Carbon Clash Lead
        </div>
      </div>

      {/* Quest injector creator */}
      <div className="col-span-1 lg:col-span-7 bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
        <div>
          <h3 className="text-sm font-mono text-indigo-400 font-bold uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
            <Plus className="w-5 h-5 text-indigo-400" /> Spawn Custom Daily Quest
          </h3>
          <p className="text-xs text-slate-400 leading-normal">Forge a custom Daily task. Defining these items pushes them directly onto the user's live quest board with active XP and Coin payouts.</p>
        </div>

        <div className="space-y-3">
          <div>
            <label htmlFor="sandbox-quest-title" className="block text-[9px] font-mono text-slate-555 uppercase font-black mb-1">QUEST TITLE / TASK</label>
            <input
              id="sandbox-quest-title"
              type="text"
              placeholder="e.g. Skip taking elevator (use stairs)"
              value={mName}
              onChange={(e) => setMName(sanitizeInput(e.target.value))}
              className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2.5 text-xs text-slate-200 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="sandbox-quest-xp" className="block text-[9px] font-mono text-slate-555 uppercase font-black mb-1">XP PAYOUT REWARD</label>
              <input
                id="sandbox-quest-xp"
                type="number"
                value={mXp}
                onChange={(e) => setMXp(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2.5 text-xs text-slate-200 outline-none font-mono"
              />
            </div>
            <div>
              <label htmlFor="sandbox-quest-coins" className="block text-[9px] font-mono text-slate-555 uppercase font-black mb-1">COIN PAYOUT REWARD</label>
              <input
                id="sandbox-quest-coins"
                type="number"
                value={mCoins}
                onChange={(e) => setMCoins(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2.5 text-xs text-slate-200 outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[9px] font-mono text-slate-550 uppercase font-black mb-1">SECTOR CLASSIFICATION</label>
            <div className="grid grid-cols-3 gap-2">
              {["transportation", "energy", "waste"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setMCategory(cat as any)}
                  className={`py-2 px-3 rounded-xl border text-[10px] font-bold capitalize transition-all cursor-pointer ${
                    mCategory === cat
                      ? "bg-indigo-500/10 border-indigo-500 text-indigo-300"
                      : "bg-slate-950 border-slate-850 text-slate-500 hover:text-slate-350"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <button
            id="sandbox-spawn-btn"
            onClick={handleCreateQuest}
            className="w-full bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-450 hover:to-indigo-550 py-3 rounded-xl text-xs font-bold text-slate-200 transition-all active:scale-95 outline-none mt-4 cursor-pointer"
          >
            Inject Challenge Into Dashboard
          </button>
        </div>
      </div>

      {/* Sandbox Settings, App Customizer & Controls row */}
      <div className="col-span-1 lg:col-span-12 bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-6">
        <div>
          <h3 className="text-sm font-mono text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
            <Sliders className="w-5 h-5 text-emerald-400" /> Platform Visual Identity Customizer
          </h3>
          <p className="text-xs text-slate-400 leading-normal">
            Modify app branding, tweak active parameters for carbon projection, edit secondary footer copy dynamically, or clear and reset the entire player state database recursively.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Custom App Name */}
          <div className="space-y-1.5">
            <label htmlFor="sandbox-app-name-input" className="block text-[9px] font-mono text-slate-555 uppercase font-black">
              Dynamic App Title
            </label>
            <div className="flex gap-2">
              <input
                id="sandbox-app-name-input"
                type="text"
                value={localAppName}
                onChange={(e) => setLocalAppName(sanitizeInput(e.target.value))}
                placeholder="e.g. Saami Clash"
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none"
              />
              <button
                id="sandbox-apply-appname-btn"
                onClick={() => onUpdateAppName(sanitizeInput(localAppName))}
                className="px-3 bg-indigo-600 hover:bg-indigo-550 text-white rounded-xl text-xs font-bold active:scale-95 cursor-pointer flex items-center justify-center transition-colors"
                title="Apply custom app title"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[9px] text-slate-500">Updates live landing and onboarding headings</p>
          </div>

          {/* Custom Footer Copy */}
          <div className="space-y-1.5">
            <label htmlFor="sandbox-footer-input" className="block text-[9px] font-mono text-slate-555 uppercase font-black">
              Dynamic Footer Subline
            </label>
            <div className="flex gap-2">
              <input
                id="sandbox-footer-input"
                type="text"
                value={localFooterText}
                onChange={(e) => setLocalFooterText(sanitizeInput(e.target.value))}
                placeholder="e.g. Engine Pro v5.1"
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none"
              />
              <button
                id="sandbox-apply-footer-btn"
                onClick={() => onUpdateFooterText(sanitizeInput(localFooterText))}
                className="px-3 bg-indigo-600 hover:bg-indigo-550 text-white rounded-xl text-xs font-bold active:scale-95 cursor-pointer flex items-center justify-center transition-colors"
                title="Apply custom footer text"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[9px] text-slate-500">Appended next to author credits in page footers</p>
          </div>

          {/* Trajectory Scale */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[9px] font-mono font-black uppercase">
              <span className="text-slate-555">Trajectory scale multiplier</span>
              <span className="text-emerald-400">{localTrajectoryScale.toFixed(1)}x</span>
            </div>
            <input
              id="sandbox-trajectory-scale-slider"
              type="range"
              min="0.5"
              max="3.0"
              step="0.1"
              value={localTrajectoryScale}
              aria-label="Trajectory scale multiplier"
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setLocalTrajectoryScale(val);
                onUpdateTrajectoryScale(val);
              }}
              className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <p className="text-[9px] text-slate-500">Multiplies trend-line points on the Analytics chart</p>
          </div>

          {/* Database Wipe Reset */}
          <div className="flex flex-col justify-end">
            {stats.surveyCompleted ? (
              <div className="space-y-1">
                <button
                  id="sandbox-wipe-profile-btn"
                  onClick={() => {
                    onResetProfile();
                  }}
                  className="w-full bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 py-2.5 rounded-xl text-xs font-bold text-rose-400 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Trash className="w-4 h-4" /> Clear & Reset Data
                </button>
                <p className="text-[9px] text-rose-500/60 mt-1.5 text-center font-mono">Irreversible • Deletes cached achievements and virtual items</p>
              </div>
            ) : (
              <div className="p-2.5 bg-slate-950 border border-slate-850 rounded-xl text-[9px] font-mono text-slate-500 text-center">
                Profile reset complete. Refreshing onboarding system...
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
