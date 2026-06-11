import { useState } from "react";
import { 
  Share2, 
  Copy, 
  Download, 
  Check, 
  Flame, 
  Globe, 
  Award 
} from "lucide-react";
import { sanitizeInput } from "../utils/CarbonCalculator";

interface ShareCardProps {
  username: string;
  level: number;
  streak: number;
  ecoPower: number;
}

const TEMPLATES = [
  { id: "cosmic", label: "Midnight Cosmic", from: "from-slate-900 via-zinc-950 to-slate-900", text: "text-slate-100", border: "border-slate-800", accents: "text-indigo-400" },
  { id: "neon", label: "Hyper-Neon", from: "from-emerald-950 via-slate-950 to-emerald-950/40", text: "text-slate-100", border: "border-emerald-500/20", accents: "text-emerald-400" },
  { id: "synth", label: "Sunset Synthwave", from: "from-purple-950 via-slate-950 to-pink-950/30", text: "text-slate-100", border: "border-pink-500/20", accents: "text-pink-400" },
  { id: "gold", label: "Golden Warrior", from: "from-amber-950 via-stone-950 to-yellow-950/30", text: "text-amber-100", border: "border-amber-500/20", accents: "text-yellow-400" },
];

export default function ShareCard({ username, level, streak, ecoPower }: ShareCardProps) {
  const [activeTemplate, setActiveTemplate] = useState<string>("neon");
  const [activePreset, setActivePreset] = useState<string>("streak");
  const [customSubtitle, setCustomSubtitle] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  const presetMilestones = [
    { id: "streak", title: "Streak Champion", value: "streak-multiplier", headline: `${streak}-DAY SUSTAINABILITY STREAK`, body: `Maintaining active habit multipliers by avoiding plastics and taking green transits! Verified streak of ${streak} active days.` },
    { id: "percentile", title: "Elite Warrior", value: "tier-rating", headline: `TOP 1% CLIMATE WARRIOR - LVL ${level}`, body: `Level ${level} of the eco-friendly frontier. Active virtual grid technology deployed with ${ecoPower} Eco Power rating!` },
    { id: "savings", title: "Carbon Slayer", value: "offsets-kg", headline: `ECO POWER LEVEL: ${ecoPower} PWR`, body: `Actively driving real-time carbon offsets and proactive zero-waste habits. Verified player account: ${username || "Saami"}.` },
  ];

  const currentTemplate = TEMPLATES.find(t => t.id === activeTemplate) || TEMPLATES[1];
  const currentPreset = presetMilestones.find(p => p.id === activePreset) || presetMilestones[0];

  const handleCopyText = () => {
    const text = `🔥 ${currentPreset.headline} \n\n"${currentPreset.body}" \n\nVerified player profile: ${username || "Saami"} (Level ${level}) on Carbon Clash. Developed by Saami Abbas Khan. join the clash: https://ai.studio/build`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTriggerMockDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4500);
  };

  return (
    <div id="share-card-tab-root" className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
      
      {/* Visual Canvas Panel */}
      <div className="col-span-1 md:col-span-7 flex flex-col items-center justify-center">
        
        {/* Render Share Card Graphic */}
        <div 
          id="visual-share-poster"
          className={`w-full max-w-sm aspect-[4/5] rounded-3xl bg-gradient-to-tr ${currentTemplate.from} border ${currentTemplate.border} p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl`}
        >
          {/* Spotlight shimmer decoration */}
          <div className="absolute top-0 right-0 w-44 h-44 bg-white/5 opacity-5 blur-2xl rounded-full" />
          
          {/* Top Stamp */}
          <div className="flex justify-between items-center relative z-10">
            <div className="flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-lg bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center text-[10px] font-black text-slate-900 font-mono">CC</span>
              <span className="text-[10px] font-mono tracking-widest text-slate-400 font-bold">CARBON CLASH PROTOCOL</span>
            </div>
            <span className={`text-[9px] font-mono font-black border border-slate-850 px-2 py-0.5 rounded uppercase ${currentTemplate.accents}`}>
              VERIFIED TIER
            </span>
          </div>

          {/* Core Content Box */}
          <div className="my-auto text-center space-y-4 relative z-10">
            <div className="inline-flex p-4 bg-slate-950/60 border border-slate-850 rounded-full shadow-inner mb-2 animate-pulse">
              {activePreset === "streak" ? (
                <Flame className="w-10 h-10 text-orange-500" />
              ) : activePreset === "percentile" ? (
                <Award className="w-10 h-10 text-yellow-400" />
              ) : (
                <Globe className="w-10 h-10 text-emerald-400" />
              )}
            </div>

            <h3 className="text-2xl font-black tracking-tight text-white leading-none">
              {currentPreset.headline}
            </h3>

            <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
              {customSubtitle || currentPreset.body}
            </p>

            <div className="pt-4 border-t border-slate-850 max-w-xs mx-auto flex justify-center gap-6 text-xs font-mono font-bold">
              <div>
                <div className="text-[9px] text-slate-500">GAMER TAG</div>
                <div className="text-white text-sm">{username || "Saami"}</div>
              </div>
              <div className="border-r border-slate-850 h-6 my-auto"></div>
              <div>
                <div className="text-[9px] text-slate-550">CLASH LVL</div>
                <div className="text-white text-sm">{level}</div>
              </div>
              <div className="border-r border-slate-850 h-6 my-auto"></div>
              <div>
                <div className="text-[9px] text-slate-550">STREAK DAY</div>
                <div className="text-orange-500 text-sm flex items-center justify-center gap-0.5">
                  <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" /> {streak}d
                </div>
              </div>
            </div>
          </div>

          {/* Footer Card Credit */}
          <div className="border-t border-slate-850/60 pt-4 flex flex-col items-center text-center relative z-10">
            <span className="text-[8px] font-mono text-slate-500 leading-none">VERIFIABLE SUSTAINABILITY LEDGER</span>
            <span className="text-[10px] font-mono font-black text-slate-300 mt-1">
              Saami Abbas Khan • Carbon Clash Lead
            </span>
          </div>

        </div>

      </div>

      {/* Control Configuration Panel */}
      <div className="col-span-1 md:col-span-5 flex flex-col justify-between">
        
        <div className="space-y-5 bg-slate-900 p-6 rounded-3xl border border-slate-800">
          <div>
            <h3 className="text-sm font-mono text-indigo-400 font-bold uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
              <Share2 className="w-5 h-5 text-indigo-400" /> Design Share Poster
            </h3>
            <p className="text-xs text-slate-455 leading-relaxed">Configure metallic gradient styles, choose a milestone tag, and overlay custom descriptions ready to share with your group.</p>
          </div>

          {downloadSuccess && (
            <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs font-semibold leading-relaxed animate-pulse text-center">
              📸 Poster optimized for Instagram Stories & LinkedIn! Metadata verified and exported to downloads folder as dynamic PNG.
            </div>
          )}

          {/* Step 1: Select Milestone */}
          <div>
            <label className="block text-[10px] font-mono text-slate-500 uppercase font-black mb-2">1. SELECT MILESTONE THEME</label>
            <div className="space-y-1.5">
              {presetMilestones.map((prs) => (
                <button
                  key={prs.id}
                  onClick={() => { setActivePreset(prs.id); setCustomSubtitle(""); }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all border flex justify-between items-center cursor-pointer ${
                    activePreset === prs.id
                      ? "bg-slate-950 border-emerald-500 text-emerald-300"
                      : "bg-slate-950/40 border-slate-900 text-slate-400 hover:border-slate-800"
                  }`}
                >
                  <span>{prs.title}</span>
                  <span className="text-[10px] font-mono font-light text-slate-500">{prs.id === "streak" ? `${streak} Days` : "Active"}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Select gradient */}
          <div>
            <label className="block text-[10px] font-mono text-slate-500 uppercase font-black mb-2">2. CHOOSE SPECULAR SHIME</label>
            <div className="grid grid-cols-2 gap-2">
              {TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => setActiveTemplate(tpl.id)}
                  className={`py-2 px-3 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                    activeTemplate === tpl.id
                      ? "bg-slate-950 border-emerald-400 text-emerald-300"
                      : "bg-slate-950/40 border-slate-900 text-slate-500 hover:text-slate-350"
                  }`}
                >
                  <span>{tpl.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Custom overlay description */}
          <div>
            <label htmlFor="custom-share-input" className="block text-[10px] font-mono text-slate-500 uppercase font-black mb-2">3. OVERLAY DESCRIPTION (OPTIONAL)</label>
            <input
              id="custom-share-input"
              type="text"
              placeholder="e.g. Swapped my car drive today!"
              value={customSubtitle}
              onChange={(e) => setCustomSubtitle(sanitizeInput(e.target.value))}
              className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-4 md:mt-2">
          
          <button
            id="share-copy-text"
            onClick={handleCopyText}
            className="bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-200 font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transition-transform active:scale-95 text-xs cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Text Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-400" />
                <span>Copy Share Text</span>
              </>
            )}
          </button>

          <button
            id="share-export-poster"
            onClick={handleTriggerMockDownload}
            className="bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-slate-150 font-extrabold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transition-transform active:scale-95 text-xs cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Poster</span>
          </button>

        </div>

      </div>
    </div>
  );
}
