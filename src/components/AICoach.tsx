import { useState } from "react";
import { 
  Bot, 
  Send, 
  Sparkles, 
  ChevronRight,
  Flame,
  Zap
} from "lucide-react";
import { UserStats, SurveyAnswer, CarbonLogItem, DailyMission } from "../types";
import { sanitizeInput } from "../utils/CarbonCalculator";

interface AICoachProps {
  stats: UserStats;
  survey: SurveyAnswer | null;
  logs: CarbonLogItem[];
  onAddCustomMission: (mission: Omit<DailyMission, "id" | "progress" | "completed" | "claimed" | "icon">) => void;
}

interface CoachMessage {
  sender: "chip" | "user";
  text: string;
  time: string;
  missions?: { title: string; xpReward: number; coinsReward: number }[];
}

const cleanMessageText = (text: string): string => {
  if (!text) return "";
  let clean = text;
  clean = clean.replace(/\*\*\[coach chip\]:\*\*/gi, "");
  clean = clean.replace(/\[coach chip\]:/gi, "");
  clean = clean.replace(/\*\*coach chip:\*\*/gi, "");
  clean = clean.replace(/coach chip:/gi, "");
  clean = clean.replace(/\[chip\]:/gi, "");
  clean = clean.replace(/🤖\s*coach\s+chip:/gi, "");
  clean = clean.replace(/🤖\s*\[chip\]:/gi, "");
  return clean.trim();
};

export default function AICoach({ stats, survey, logs, onAddCustomMission }: AICoachProps) {
  const [messages, setMessages] = useState<CoachMessage[]>([
    {
      sender: "chip",
      text: "Yo! Master Climate Warrior detected! 🔋\n\nI am your server-side Gemini-powered action guide. I've scanned your profile. Ready to cut carbon emissions and level up your Virtual City? Send me a message or trigger any profile assessment shortcut below!",
      time: "14:11"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [questInjectedNotice, setQuestInjectedNotice] = useState<string | null>(null);

  const handleShortcutClick = (promptText: string) => {
    const sanitizedPrompt = sanitizeInput(promptText);
    setInput(sanitizedPrompt);
    sendMessage(sanitizedPrompt);
  };

  const sendMessage = async (customText?: string) => {
    const textToSend = sanitizeInput(customText || input);
    if (!textToSend.trim() || loading) return;

    // Append User Message
    const userMsg: CoachMessage = {
      sender: "user",
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stats: stats,
          survey: survey,
          recentLogs: logs.slice(-3), // slice last 3 items
          userMessage: textToSend
        })
      });

      if (!response.ok) {
        throw new Error("API call failed");
      }

      const data = await response.json();
      
      const chipMsg: CoachMessage = {
        sender: "chip",
        text: data.coachAdvice || "Engine is rebooting, stay tuned!",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        missions: data.suggestedMissions
      };

      setMessages(prev => [...prev, chipMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: CoachMessage = {
        sender: "chip",
        text: "Whoops! My server-side circuits had a minor collision. But remember: swapping one short car drive for a bike sprints today yields **+45 XP** and saves **0.8 kg CO₂**! Level up that city!",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        missions: [
          { title: "Walk or ride bike for 1.5km tonight", xpReward: 50, coinsReward: 15 },
          { title: "Sip liquid from reusable flask today", xpReward: 30, coinsReward: 8 }
        ]
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleInjectMission = (missionTitle: string, xp: number, coins: number) => {
    onAddCustomMission({
      title: sanitizeInput(missionTitle),
      description: "Forged by AI Coach Chip",
      category: "lifestyle",
      type: "custom_ai",
      target: 1,
      unit: "action",
      rewardXp: xp,
      rewardCoins: coins
    });
    setQuestInjectedNotice(`⚡ Custom Quest successfully added: "${missionTitle}" - view in Main Dashboard!`);
    setTimeout(() => setQuestInjectedNotice(null), 5000);
  };

  return (
    <div id="ai-coach-tab-root" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      
      {/* Sidebar Shortcuts / Coach Bio */}
      <div className="col-span-1 lg:col-span-4 flex flex-col justify-between gap-4">
        
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 relative overflow-hidden">
          {/* Neon Spotlight */}
          <div className="absolute top-[-30%] left-[-30%] w-60 h-60 rounded-full bg-emerald-500/15 blur-[60px] pointer-events-none" />
          
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center font-bold text-slate-950 shadow-lg shadow-emerald-500/10">
              <Bot className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-mono text-emerald-400 font-bold uppercase tracking-widest leading-none">AI SYSTEM</h3>
              <h4 className="text-base font-extrabold text-white mt-1 leading-tight">Advisor CHIP</h4>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed relative z-10">
            Coach Chip analyzes your diet, carbon logs, and daily game streak dynamically, suggesting unique hyper-targeted challenges to bolster your multipliers.
          </p>

          <div className="mt-4 border-t border-slate-800/80 pt-4 space-y-3 relative z-10">
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
              <span>COGNITIVE CORE</span>
              <span className="text-emerald-400 font-bold uppercase animate-pulse">GEMINI 3.5 FLASH</span>
            </div>
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
              <span>LATENCY RATING</span>
              <span className="text-indigo-400">OPTIMIZED REALTIME</span>
            </div>
          </div>
        </div>

        {/* Dynamic assessment suggestions shortcuts */}
        <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
          <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold px-2 mb-2">QUICK SHORTCUTS</h4>
          
          {[
            "Formulate a customized Weekly Boss Challenge representing my dietary profile",
            "Evaluate transportation carbon log and give me feedback",
            "Give me a sassy, punchy motivation speech to keep my streak alive!",
          ].map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleShortcutClick(prompt)}
              className="w-full text-left bg-slate-950 hover:bg-slate-950/80 hover:text-emerald-300 transition-colors p-3 rounded-xl text-xs font-semibold border border-slate-900 line-clamp-1 flex items-center justify-between cursor-pointer"
            >
              <span>{prompt}</span>
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </button>
          ))}
        </div>

      </div>

      {/* Primary Message Board Terminal */}
      <div className="col-span-1 lg:col-span-8 p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between h-[480px]">
        
        {questInjectedNotice && (
          <div className="p-3 mb-3 bg-emerald-500/15 border border-emerald-500/35 text-emerald-400 rounded-xl text-xs font-semibold leading-relaxed animate-pulse text-center">
            {questInjectedNotice}
          </div>
        )}

        {/* Messages list timeline */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4 flex flex-col">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col ${msg.sender === "chip" ? "items-start self-start" : "items-end self-end"} max-w-[85%]`}
            >
              <span className="text-[10px] font-mono mb-1 font-bold tracking-wide text-indigo-400">
                {msg.sender === "chip" ? "Coach Chip" : "Climate Warrior"}
              </span>
              <div
                className={`w-full rounded-2xl p-4 text-xs leading-relaxed border ${
                  msg.sender === "chip"
                    ? "bg-slate-950/70 border-slate-850/60 text-slate-200"
                    : "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                }`}
              >
                <div className="whitespace-pre-line font-medium">{cleanMessageText(msg.text)}</div>

                {/* Render dynamic missions forged by Chip if available! */}
                {msg.missions && msg.missions.length > 0 && (
                  <div className="mt-4 border-t border-slate-800 pt-3 space-y-2">
                    <div className="text-[9px] font-mono text-slate-550 uppercase tracking-widest font-black leading-none mb-2">
                      ⚡ CHIP'S GENERATED CUSTOM QUESTS (TAP TO LAUNCH)
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {msg.missions.map((m, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleInjectMission(m.title, m.xpReward, m.coinsReward)}
                          className="bg-slate-950 border border-slate-800 hover:border-emerald-500/40 p-3 rounded-xl cursor-pointer transition-all hover:scale-101 flex flex-col justify-between"
                        >
                          <h5 className="font-bold text-white leading-normal line-clamp-2">{m.title}</h5>
                          <div className="flex items-center gap-3 mt-2 text-[10px] font-mono font-bold">
                            <span className="text-indigo-400 flex items-center gap-0.5"><Zap className="w-3.5 h-3.5 text-indigo-400" /> +{m.xpReward} XP</span>
                            <span className="text-amber-400 flex items-center gap-0.5"><Flame className="w-3.5 h-3.5 text-amber-500" /> +{m.coinsReward} Coins</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-[9px] text-slate-500 text-right mt-1.5 font-mono">{msg.time}</div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="self-start bg-slate-950/40 border border-slate-900 rounded-2xl p-4 flex items-center gap-3 text-xs font-mono text-slate-500 animate-pulse">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
              <span>CHIP IS CONTEXT_SYNCHING VIA SERVER...</span>
            </div>
          )}
        </div>

        {/* Console send controls */}
        <div className="flex gap-2 bg-slate-950 p-2 rounded-2xl border border-slate-850">
          <input
            id="chat-console-input"
            type="text"
            placeholder="Ask Chip anything or consult diet profile..."
            value={input}
            aria-label="Ask Chip anything or consult diet profile"
            onChange={(e) => setInput(sanitizeInput(e.target.value))}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 bg-transparent border-none text-xs text-slate-200 outline-none px-3 py-2 font-mono"
          />
          <button
            id="chat-send-btn"
            onClick={() => sendMessage()}
            aria-label="Send message"
            className="p-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl transition-all cursor-pointer flex items-center justify-center active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
