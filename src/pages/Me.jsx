
import React, { createContext, useContext, useMemo, useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, animate } from "framer-motion";
import { Search, Flame, Globe, MessageSquare, Sparkles, Activity, BookOpen, Users, PlusCircle, ListChecks } from 'lucide-react';
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

// --- MOCK STORE (Inlined for prototype stability) ---
const ranksData = [
  { key:"cipher", name:"Cipher", xp_min:0, color_primary:"#3B4A6B", perks: ["Access to Core Signals", "Basic Analytics Suite", "Community Forum Access"] },
  { key:"acolyte", name:"Acolyte", xp_min:500, color_primary:"#A0B4FF", perks: ["All Cipher Perks", "Personalized Watchlist Insights", "Early Access to New Features"] },
  { key:"sentinel", name:"Sentinel", xp_min:2000, color_primary:"#00A0C8", perks: ["All Acolyte Perks", "Real-Time Sentiment Tracking", "Advanced Charting Tools"] },
  { key:"luminary", name:"Luminary", xp_min:6000, color_primary:"#E8B923", perks: ["All Sentinel Perks", "Alpha Generation Ideas", "Direct Analyst Q&A Sessions"] },
  { key:"ascendant", name:"Ascendant", xp_min:15000, color_primary:"#F3F5F8", perks: ["All Luminary Perks", "Institutional-Grade Data Flow", "API Access"] },
  { key:"oracle", name:"Oracle", xp_min:40000, color_primary:"holographic", perks: ["All Ascendant Perks", "Bespoke Research On-Demand", "Seat on the Advisory Council"] }
];
const rankLoreData = [
  { key: "cipher", title: "Cipher", color: "#3B4A6B", aura: "linear-gradient(135deg,#3B4A6B,#2A3A5B)", description: "The starting point of every mind. Ciphers begin decoding signals, learning to see through the noise." },
  { key: "acolyte", title: "Acolyte", color: "#A0B4FF", aura: "linear-gradient(135deg,#A0B4FF,#738EFF)", description: "Those who have unlocked their first insights. Acolytes follow data with intention and pattern recognition." },
  { key: "sentinel", title: "Sentinel", color: "#00A0C8", aura: "linear-gradient(135deg,#00A0C8,#007A9A)", description: "Guardians of clarity. Sentinels defend truth in markets, detecting macro shifts before they unfold." },
  { key: "luminary", title: "Luminary", color: "#E8B923", aura: "linear-gradient(135deg,#E8B923,#FFD773)", description: "Visionaries whose foresight illuminates others. Luminaries connect signals into unified insight." },
  { key: "ascendant", title: "Ascendant", color: "#F3F5F8", aura: "linear-gradient(135deg,#CBD5E1,#F3F5F8)", description: "Masters of equilibrium. Ascendants have internalized Vireon's flow, operating at peak intuition and precision." },
  { key: "oracle", title: "Oracle", color: "#C0A0FF", aura: "linear-gradient(135deg,#8ec5fc,#e0c3fc,#f9f871)", description: "The apex. Oracles see beyond data — they read the undercurrent of cause, consequence, and signal truth." },
];

const lbMock = {
  weekly: [
    { id:"u1", name:"Ava Q.", rank:"Luminary", xpDelta: 1840, avatar:"", hidden:false },
    { id:"u2", name:"Noah L.", rank:"Ascendant", xpDelta: 1730, avatar:"", hidden:false },
    { id:"me", name:"Robert Choi", rank:"Sentinel", xpDelta: 640, avatar:"", hidden:false },
    { id:"u4", name:"Liam B.", rank:"Sentinel", xpDelta: 590, avatar:"", hidden:false },
  ],
  alltime: [
    { id:"u9", name:"Maya K.", rank:"Oracle", xp: 48210 },
    { id:"u7", name:"Leo P.", rank:"Ascendant", xp: 31240 },
    { id:"u8", name:"Chloe F.", rank:"Ascendant", xp: 25770 },
    { id:"me", name:"Robert Choi", rank:"Sentinel", xp: 2450 },
  ],
  streaks: [
    { id:"u3", name:"Iris T.", rank:"Luminary", days: 66 },
    { id:"u5", name:"Zoe G.", rank:"Sentinel", days: 41 },
    { id:"me", name:"Robert Choi", rank:"Sentinel", days: 27 },
    { id:"u6", name:"Sam C.", rank:"Acolyte", days: 21 },
  ],
};

const nextDailyReset = () => {
  const d = new Date();
  d.setUTCHours(24,0,0,0); // midnight UTC
  return d.toISOString();
};

const nextWeeklyReset = () => {
  const d = new Date();
  const day = d.getUTCDay(); // 0 sun
  const add = (7 - day) % 7 || 7; // next Sunday
  d.setUTCDate(d.getUTCDate() + add);
  d.setUTCHours(0,0,0,0);
  return d.toISOString();
};

const challengeMock = [
  { id:"D1", scope:"daily", title:"Open Macro Signals", desc:"Review today’s macro board.", xp:25, goal:1, progress:0, resetAt: nextDailyReset() },
  { id:"D2", scope:"daily", title:"Decode 3 Signals", desc:"Read 3 signal summaries.", xp:50, goal:3, progress:1, resetAt: nextDailyReset() },
  { id:"D3", scope:"daily", title:"Keep the Streak", desc:"Log one qualifying action.", xp:40, goal:1, progress:0, resetAt: nextDailyReset() },
  { id:"W1", scope:"weekly", title:"Post 5 Insights", desc:"Share thoughts or frameworks.", xp:150, goal:5, progress:2, resetAt: nextWeeklyReset() },
  { id:"W2", scope:"weekly", title:"Consistency 5/7", desc:"Stay active five days this week.", xp:120, goal:5, progress:3, resetAt: nextWeeklyReset() },
  { id:"W3", scope:"weekly", title:"Invite a Friend", desc:"One accepted invite.", xp:200, goal:1, progress:0, resetAt: nextWeeklyReset() },
];

let user = {
  id:"u_dev", display_name:"Robert Choi", title: "Founder & CEO of Vireon", avatar_url:null, rank_key:"sentinel", xp_total:2450,
  streak_current:12, streak_best:27, nextRank:{ key:"luminary", name:"Luminary", xp_min:6000, streak_required:0 },
  xpToNext:3550, certificates:[{ id:"c1", rank_key:"cipher", pdf_url:"#", verify_url:"#", issued_at:"2025-05-12T00:00:00Z" },{ id:"c2", rank_key:"acolyte", pdf_url:"#", verify_url:"#", issued_at:"2025-06-22T00:00:00Z" }],
  achievements:[
    { id:"FIRST_SIGNAL_DECODED", name:"First Signal Decoded", desc:"View your first three signal summaries.", icon: <Search className="w-5 h-5 text-white/70" />, xp: 25, state:"done", progress: 3, goal: 3, unlocked_at: "2025-05-12" },
    { id:"CONSISTENCY_10", name:"10-Day Consistency", desc:"Maintain your signal streak for 10 days.", icon: <Flame className="w-5 h-5 text-white/70" />, xp: 100, state:"done", progress: 10, goal: 10, unlocked_at: "2025-05-21" },
    { id:"MACRO_OBSERVER", name:"Macro Observer", desc:"Open Macro Signals on 7 unique days.", icon: <Globe className="w-5 h-5 text-white/70" />, xp: 50, state:"progress", progress: 4, goal: 7 },
    { id:"COMMUNITY_PILLAR", name:"Community Pillar", desc:"Post 25 meaningful comments.", icon: <MessageSquare className="w-5 h-5 text-white/70" />, xp: 200, state:"locked", progress: 0, goal: 25 },
  ],
  groups:[{ id:"g1", name:"Macro Masters", slug:"macro-masters", emblem:"/images/groups/macro.svg", xp_total:8900, member_count:43, role:"member" },{ id:"g2", name:"Alpha Builders", slug:"alpha-builders", emblem:"/images/groups/alpha.svg", xp_total:15400, member_count:21, role:"moderator" }],
};
function rankFor(xp, rs = ranksData){ const sorted = [...rs].sort((a,b)=>a.xp_min-b.xp_min); let cur = sorted[0]; for (const r of sorted) if (xp >= r.xp_min) cur = r; return cur; }
function recomputeNext(xp, rs = ranksData){ const cur = rankFor(xp, rs); const idx = rs.findIndex(r=>r.key===cur.key); const next = rs[idx+1] || rs[idx]; return { cur, next }; }
function addXpLocal(amount=50){ const newXp = user.xp_total + amount; const { cur, next } = recomputeNext(newXp); const prevRank = user.rank_key; user.xp_total = newXp; user.rank_key = cur.key; user.nextRank = { key: next.key, name: next.name, xp_min: next.xp_min, streak_required:0 }; user.xpToNext = Math.max(0, next.xp_min - newXp); const rankChanged = prevRank !== cur.key; if (rankChanged){ user.certificates.unshift({ id:`cert_${cur.key}_${Date.now()}`, rank_key: cur.key, pdf_url: "#", verify_url: "#", issued_at: new Date().toISOString() }); } return { rankChanged, newRank: ranksData.find(r=>r.key===user.rank_key) }; }
function tickStreak(days=1){ user.streak_current += days; if (user.streak_current > user.streak_best) user.streak_best = user.streak_current; }
function resetUser(){ user.xp_total = 2450; user.streak_current = 12; user.rank_key = rankFor(2450).key; user.certificates = [{ id:"c1", rank_key:"cipher", pdf_url:"#", verify_url:"#", issued_at:"2025-05-12T00:00:00Z" },{ id:"c2", rank_key:"acolyte", pdf_url:"#", verify_url:"#", issued_at:"2025-06-22T00:00:00Z" }]; recomputeNext(user.xp_total); }
function snapshot() {
  const profile = JSON.parse(JSON.stringify(user));
  // Re-attach non-serializable icon components after cloning
  profile.achievements = user.achievements;
  profile.nextRank = recomputeNext(profile.xp_total).next;
  profile.xpToNext = Math.max(0, profile.nextRank.xp_min - profile.xp_total);
  profile.rank_key = rankFor(profile.xp_total).key;
  return { profile, ranks: JSON.parse(JSON.stringify(ranksData)) };
}


// --- RANK THEME PROVIDER (Inlined & Refined) ---
const RankThemeContext = createContext({ accent: "#9CA3AF", bg: "#0B0E13", aura: "#9CA3AF", label: "Cipher" });
function useRankTheme() { return useContext(RankThemeContext); }
function RankThemeProvider({ rank, children }) {
  const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const palette = useMemo(() => {
    switch (rank?.key) {
      case "cipher": return { label:"Cipher", accent:"#3B4A6B", aura:"#3B4A6B", bg:"#0B0E13" };
      case "acolyte": return { label:"Acolyte", accent:"#A0B4FF", aura:"#A0B4FF", bg:"#0B0E13" };
      case "sentinel": return { label:"Sentinel", accent:"#00A0C8", aura:"#00A0C8", bg:"#0B0E13" };
      case "luminary": return { label:"Luminary", accent:"#E8B923", aura:"#E8B923", bg:"#0B0E13" };
      case "ascendant": return { label:"Ascendant", accent:"#F3F5F8", aura:"#F3F5F8", bg:"#090D12" };
      case "oracle": return { label:"Oracle", accent:"holographic", aura:"holographic", bg:"#05070A" };
      default: return { label:"Cipher", accent:"#9CA3AF", aura:"#9CA3AF", bg:"#0B0E13" };
    }
  }, [rank?.key]);

  const auraStyle = palette.aura === "holographic"
    ? "conic-gradient(from 0deg at 50% 50%, #8ec5fc, #e0c3fc, #f9f871, #8ec5fc)"
    : `radial-gradient(circle at 50% 20%, ${palette.aura}40 0%, transparent 70%)`;

  return (
    <RankThemeContext.Provider value={palette}>
      <motion.div
        className="fixed inset-0 -z-10 blur-3xl"
        style={{ background: auraStyle }}
        animate={reduceMotion ? { opacity: 0.3 } : { opacity:[0.25,0.4,0.25] }}
        transition={{ duration: 8, repeat: Infinity, ease:"easeInOut" }}
      />
      <motion.div
        className="min-h-screen transition-colors duration-700"
        style={{ backgroundColor: palette.bg }}
        animate={{ backgroundColor: palette.bg }}
        transition={{ duration: 0.7 }}
      >
        {children}
      </motion.div>
    </RankThemeContext.Provider>
  );
}


// --- NEW MICRO-MOTION FX COMPONENTS (Inlined) ---

function HoverRipple({ children }) {
  const theme = useRankTheme();
  return (
    <motion.div
      whileHover={{ boxShadow: `0 0 20px ${theme.accent === 'holographic' ? '#a0b4ff' : theme.accent}40`, scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative rounded-xl"
    >
      {children}
    </motion.div>
  );
}

function ParticleBurst({ trigger, count = 16 }) {
  const theme = useRankTheme();
  const [burst, setBurst] = useState(false);
  const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (trigger) {
      if (!reduceMotion) {
        setBurst(true);
        const timeout = setTimeout(() => setBurst(false), 800);
        return () => clearTimeout(timeout);
      }
    }
  }, [trigger, reduceMotion]);

  if (!burst) return null;
  const pieces = Array.from({ length: count });

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
      {pieces.map((_, i) => (
        <motion.span
          key={i}
          className="absolute w-1 h-2 rounded-sm opacity-80"
          style={{ background: theme.accent === "holographic" ? "linear-gradient(90deg,#8ec5fc,#f9f871)" : theme.accent, left: "50%", top: "50%" }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: Math.cos((i / count) * 2 * Math.PI) * 80,
            y: Math.sin((i / count) * 2 * Math.PI) * 80,
            opacity: 0,
            scale: 0.5
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

function XPChargeGlow({ active }) {
  const theme = useRankTheme();
  const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return null;
  return (
    <motion.div
      className="absolute inset-0 blur-2xl pointer-events-none"
      style={{ background: theme.accent === "holographic" ? "linear-gradient(90deg,#8ec5fc,#e0c3fc,#f9f871)" : theme.accent }}
      animate={{ opacity: active ? [0, 0.5, 0] : 0, scale: active ? [1, 1.2, 1] : 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    />
  );
}


// --- ENHANCED UI COMPONENTS (Inlined) ---

function AnimatedNumber({ value }) {
  const ref = React.useRef(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const controls = animate(Number(node.textContent?.replace(/,/g, '')) || 0, value, { duration: 0.8, ease: "easeOut", onUpdate(v) { node.textContent = Math.round(v).toLocaleString(); } });
    return () => controls.stop();
  }, [value]);
  return <span ref={ref}>{Math.round(value).toLocaleString()}</span>;
}

function RankBadge({ rankKey, ranks=[], size="md", withTitle=false, onClick }) {
  const meta = ranks.find(r => r.key === rankKey) || { key: rankKey, name: rankKey, color_primary: "#9CA3AF" };
  const px = size === "sm" ? 24 : size === "md" ? 40 : 72;
  const bg = meta.color_primary === "holographic" ? "linear-gradient(135deg, #8ec5fc 0%, #e0c3fc 100%)" : `${meta.color_primary}26`;
  const interactiveClass = onClick ? 'cursor-pointer hover:scale-105 transition-transform' : '';
  return (
    <div className={`inline-flex items-center gap-3 ${interactiveClass}`} aria-label={`Rank: ${meta.name}`} onClick={onClick}>
      <motion.div className="rounded-full shadow-inner relative" style={{ width: px, height: px, background: bg }}>
        <div className="absolute inset-[18%] rounded-full bg-white/70 mix-blend-overlay" />
      </motion.div>
      {withTitle && <span className="text-[var(--font-size-lg)] font-semibold text-[color:var(--color-primary-text)] capitalize">{meta.name}</span>}
    </div>
  );
}

function ResonanceMeter({ value, max, label, hue }){
  const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pct = Math.max(0, Math.min(100, (value / Math.max(1, max)) * 100));
  const fill = hue === "holographic" ? "linear-gradient(90deg,#8ec5fc,#e0c3fc,#f9f871)" : hue;
  return (
    <div className="w-full max-w-sm mx-auto space-y-2" role="progressbar" aria-valuemin={0} aria-valuemax={max} aria-valuenow={value}>
      <div className="h-2.5 w-full rounded-full bg-black/20 overflow-hidden shadow-inner border border-white/5">
        <motion.div className="h-full rounded-full" style={{ background: fill }} initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.4, ease: "easeOut" }} />
      </div>
      {label && <div className="text-xs font-semibold tracking-wide text-white/60">{label}</div>}
    </div>
  );
}

function StreakHalo({ days, best, children }){
  const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return (
    <div className="relative inline-flex items-center justify-center">
      <motion.div className="absolute inset-[-8px] rounded-full border border-white/10" style={{ boxShadow: `0 0 28px rgba(0,160,200,0.35)`}} animate={reduceMotion ? {} : { opacity:[0.3,0.6,0.3], scale:[1,1.08,1] }} transition={{ duration: 6, repeat: Infinity, ease:"easeInOut" }} />
      <div className="relative w-24 h-24 rounded-full bg-white/[0.05] backdrop-blur-lg flex items-center justify-center shadow-inner border border-white/5">{children}</div>
    </div>
  );
}

// --- NEW: RANK SIGNAL SWEEP COMPONENT ---
function RankSignalSweep({ items, activeKey }) {
  const [idx, setIdx] = useState(0);
  const [pulseKey, setPulseKey] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    
    const tick = () => {
      setIdx(currentIdx => {
        const next = (currentIdx + 1) % items.length;
        setPulseKey(items[next].key);
        setTimeout(() => setPulseKey(null), 450);
        return next;
      });
    };
    
    const start = setTimeout(() => tick(), 400);
    const id = setInterval(tick, 1100);
    return () => { clearInterval(id); clearTimeout(start); };
  }, [items]);

  return (
    <div className="relative w-full h-16">
      {/* rail line */}
      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-white/10 rounded-full" />

      {/* orbs */}
      <div className="absolute inset-0 flex justify-between items-center">
        {items.map((it, i) => {
          const isActive = it.key === activeKey;
          const energized = pulseKey === it.key;
          return (
            <div key={it.key} className="relative flex flex-col items-center">
              {/* ripple ring when energized */}
              {energized && (
                <motion.span
                  className="absolute w-8 h-8 rounded-full"
                  style={{ border: `1.5px solid ${it.color}55` }}
                  initial={{ opacity: 0.8, scale: 0.6 }}
                  animate={{ opacity: 0, scale: 1.6 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                />
              )}

              {/* orb */}
              <motion.div
                className="w-6 h-6 rounded-full relative"
                style={{
                  background: isActive ? it.color : "#A3ADB533",
                  boxShadow: isActive
                    ? `0 0 18px ${it.color}66, inset 0 0 8px ${it.color}55`
                    : "inset 0 0 6px rgba(255,255,255,0.08)",
                }}
                animate={
                  energized
                    ? { scale: [1, 1.18, 1] }
                    : isActive
                    ? { scale: [1, 1.06, 1] }
                    : { scale: 1 }
                }
                transition={{ duration: energized ? 0.35 : 2.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="absolute -bottom-6 text-xs text-white/60 text-center w-full">{it.label}</div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


function RankProgressionPanel({ ranks, currentKey, xp, nextXp, accent }){
  const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const current = ranks.find(r => r.key === currentKey);
  const nextRank = ranks[ranks.findIndex(r => r.key === currentKey) + 1];
  const progressPct = Math.min(100, (xp / Math.max(1, nextXp)) * 100);
  const strokeColor = accent === 'holographic' ? "url(#holographic-grad)" : accent;
  
  const railItems = ranks.map(r => ({
    key: r.key,
    label: r.name,
    color: r.key === "oracle" ? "#C0A0FF" : (r.color_primary || "#9CA3AF"),
  }));

  return (
    <div className="relative overflow-hidden">
      {!reduceMotion && <motion.div className="absolute inset-0 blur-3xl" style={{ background: accent === 'holographic' ? "linear-gradient(45deg,#8ec5fc,#e0c3fc,#f9f871)" : accent }} animate={{ opacity: [0.15, 0.3, 0.15] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />}
      <div className="relative z-10 flex flex-col items-center space-y-2 mb-6 text-center">
        <RankBadge rankKey={currentKey} ranks={ranks} size="lg" />
        <h2 className="text-[var(--font-size-xl)] font-semibold text-[color:var(--color-primary-text)]">{current?.name}</h2>
        {nextRank && <p className="text-[var(--font-size-sm)] text-[color:var(--color-tertiary-text)]">Your Path to {nextRank.name}</p>}
      </div>
      <div className="relative flex justify-center items-center my-10" aria-label="Rank Progression" role="meter" aria-valuenow={Math.round(progressPct)} aria-valuemin="0" aria-valuemax="100">
        <svg width="200" height="200" viewBox="0 0 200 200" className="-rotate-90">
          <defs><linearGradient id="holographic-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#8ec5fc" /><stop offset="100%" stopColor="#e0c3fc" /></linearGradient></defs>
          <circle cx="100" cy="100" r="85" stroke="rgba(255,255,255,0.08)" strokeWidth="8" fill="none" />
          <motion.circle cx="100" cy="100" r="85" stroke={strokeColor} strokeWidth="8" fill="none" strokeLinecap="round" strokeDasharray="534" initial={{ strokeDashoffset: 534 }} animate={{ strokeDashoffset: 534 - (534 * progressPct) / 100 }} transition={reduceMotion ? { duration: 0 } : { duration: 0.8, ease: "easeOut" }} />
        </svg>
        <div className="absolute text-center"><div className="text-[var(--font-size-3xl)] font-semibold text-[color:var(--color-primary-text)]">{Math.round(progressPct)}%</div><div className="text-[var(--font-size-sm)] font-semibold tracking-wide text-[color:var(--color-tertiary-text)] uppercase">to next rank</div></div>
      </div>
      <div className="relative flex justify-between mt-12 mb-4">
        <RankSignalSweep items={railItems} activeKey={currentKey} />
      </div>
    </div>
  );
}


// --- CINEMATIC COMPONENT ---
function Ribbons({ color }) {
  const strips = Array.from({ length: 5 });
  return (
    <div className="absolute inset-0 overflow-hidden z-[200]">
      {strips.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-[200vw] h-[2px] opacity-40 blur-sm"
          style={{
            top: `${20 + i * 15}%`,
            left: "-50vw",
            background: color
          }}
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{
            duration: 1.2 + i * 0.2,
            repeat: 0,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}

function RankUpCinematic({ open, newRank, onFinish }) {
  const theme = useRankTheme();
  const [active, setActive] = useState(false);
  const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (open) {
      if (reduceMotion) {
        onFinish?.(); // Immediately finish if motion is reduced
        return;
      }
      setActive(true);
      // const audio = new Audio("/sounds/ascend_chime.mp3"); // Removed, handled by useSoundFX
      // audio.volume = 0.3;
      // audio.play().catch(()=>{});
      const t = setTimeout(() => {
        setActive(false);
        onFinish?.();
      }, 2200);
      return () => clearTimeout(t);
    }
  }, [open, reduceMotion, onFinish]);

  if (!active || reduceMotion) return null;

  const isHolo = theme.accent === "holographic";
  const glow = isHolo
    ? "linear-gradient(90deg,#8ec5fc,#e0c3fc,#f9f871)"
    : theme.accent;

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="ascend"
          className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Background fade */}
          <motion.div
            className="absolute inset-0 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          />
          {/* Light ribbons */}
          <Ribbons color={glow} />
          {/* Badge reveal */}
          <motion.div
            className="relative z-[201] text-center"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: [0.4, 1.1, 1], opacity: [0, 1, 1] }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 1.8, ease: "easeOut" }}
          >
            <RankBadge ranks={ranksData} rankKey={newRank?.key} size="lg" withTitle />
            <motion.div
              className="text-[color:var(--color-primary-text)] text-[var(--font-size-2xl)] font-semibold mt-[var(--space-sm)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              aria-live="polite"
            >
              Ascended to {newRank?.name}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// --- NEW: SOUND FX HOOK (Updated to export playTone) ---
function useSoundFX() {
  const theme = useRankTheme();
  const ctxRef = useRef(null);

  function playTone(freq, dur = 0.3, gain = 0.08) {
    if (typeof window === 'undefined' || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    try {
      const ctx = ctxRef.current || new (window.AudioContext || window.webkitAudioContext)();
      if (!ctxRef.current) ctxRef.current = ctx;
      if (ctx.state === 'suspended') ctx.resume().catch(()=>{});

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gainNode.gain.setValueAtTime(gain, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + dur);
      osc.connect(gainNode).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + dur);
    } catch (error) {
      console.warn("AudioContext error:", error);
    }
  }

  function playXP() {
    const base = theme.label === "Oracle" ? 880 : 440;
    playTone(base, 0.2, 0.05);
    setTimeout(() => playTone(base * 1.25, 0.2, 0.05), 50);
  }

  function playAscend() {
    playTone(523, 0.25, 0.08); // C5
    setTimeout(() => playTone(659, 0.25, 0.06), 150); // E5
    setTimeout(() => playTone(880, 0.4, 0.04), 300); // A5
  }
  
  // This ambient play is now handled by SignalResonanceEngine, but we keep the audio context logic.
  useEffect(() => {
    const activateAudio = () => {
      if (!ctxRef.current) {
        try {
          const ctx = new (window.AudioContext || window.webkitAudioContext)();
          ctxRef.current = ctx;
        } catch(e) { console.warn("Could not create AudioContext:", e); }
      }
      if (ctxRef.current && ctxRef.current.state === 'suspended') {
        ctxRef.current.resume().catch(err => console.error("Could not resume AudioContext:", err));
      }
    };
    if (typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)) {
      document.body.addEventListener('click', activateAudio, { once: true });
      document.body.addEventListener('touchstart', activateAudio, { once: true });
    }
    return () => {
      if (typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)) {
        document.body.removeEventListener('click', activateAudio);
        document.body.removeEventListener('touchstart', activateAudio);
      }
    }
  }, []);

  return { playXP, playAscend, playTone };
}

// --- NEW: AMBIENT ENGINE ---
function SignalResonanceEngine({ xp, streak }) {
  const { accent, label } = useRankTheme();
  const { playTone } = useSoundFX();
  const [tick, setTick] = useState(0);
  const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (reduceMotion) return;
    const t = setInterval(() => setTick((n) => n + 1), 12000); // Trigger every 12 seconds
    return () => clearInterval(t);
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion || document.hidden) return;
    if (streak > 5) { // Only play ambient tones for streaks greater than 5
      // Play a tone every third tick, ensuring some randomness or variation
      if (tick % 3 === 0) {
        // Adjust base frequency based on streak, capped for audibility
        const base = 220 + Math.min(streak, 90) * 2;
        playTone(base + (xp % 100), 2.5, 0.015); // Add XP modulation for subtle variation
      }
    }
  }, [tick, streak, xp, reduceMotion, playTone]); // Added playTone to deps

  if (reduceMotion) return null;

  // Calculate glow strength based on streak, capped at 0.5 opacity
  const glowStrength = Math.min(0.5, 0.15 + streak / 150);
  // Create a subtle "wave" effect based on XP for movement
  const wave = (xp % 500) / 500; // Normalize XP progress within a 500 XP cycle

  return (
    <motion.div
      className="fixed inset-0 -z-20 blur-3xl pointer-events-none"
      style={{
        background: `radial-gradient(circle at ${30 + 40 * wave}% ${50 + 10 * Math.sin(tick / 2)}%, ${accent}25 0%, transparent 70%)`,
      }}
      animate={{ opacity: [0.3, glowStrength, 0.3] }}
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}


// --- CINEMATIC & MODAL COMPONENTS ---
function RankPerkModal({ open, onClose, rank }) {
  if (!rank) return null;
  const perks = rank.perks || ["Priority access to features", "Exclusive analytics", "Community badge"];
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="max-w-md w-full bg-[#0B0D11]/90 backdrop-blur-2xl border border-white/10 text-white rounded-2xl shadow-2xl p-6"
          >
            <h3 className="text-lg font-semibold tracking-tight text-white">Perks of {rank.name}</h3>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              {perks.map((p, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// --- NEW: ASCENSION CONTINUUM COMPONENT ---
function AscensionContinuum() {
  const [hoveredRank, setHoveredRank] = useState(null);

  return (
    <section className="relative mt-24 flex flex-col items-center justify-center py-20">
      <motion.h2 
        className="text-3xl font-semibold text-white mb-4 tracking-tight text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        The Ascension Path
      </motion.h2>
      <motion.p 
        className="text-white/60 text-sm mb-24 text-center max-w-md"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        viewport={{ once: true }}
      >
        Every signal decoded, every insight gained, brings you closer to true market clarity. This is your journey.
      </motion.p>

      <div className="relative w-[90%] md:w-[80%] h-[300px]">
        <svg viewBox="0 0 1000 300" className="absolute inset-0 w-full h-full overflow-visible">
          <defs>
            <linearGradient id="ascendGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00A0C8" />
              <stop offset="50%" stopColor="#8A63D2" />
              <stop offset="100%" stopColor="#C0A0FF" />
            </linearGradient>
          </defs>
          <motion.path
            d="M50,250 C300,50 700,50 950,250"
            stroke="url(#ascendGradient)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
            viewport={{ once: true }}
          />
        </svg>

        <div className="absolute inset-0 flex justify-between items-center">
          {rankLoreData.map((rank, i) => {
            // Adjust calculation based on rankLoreData.length for even distribution
            const totalRanks = rankLoreData.length;
            const xPosition = 50 + i * (900 / (totalRanks - 1));
            // Sinusoidal curve for y-position to approximate the path visually
            // Ranges from 0 (start/end) to 1 (middle), then multiplied by -200 (amplitude) and shifted by 250 (baseline)
            const yPosition = Math.sin((i / (totalRanks - 1)) * Math.PI) * -200 + 250;

            return (
              <motion.div
                key={rank.key}
                className="absolute group"
                style={{
                  left: `${xPosition / 10}%`, // Convert SVG x (0-1000) to percentage (0-100)
                  top: `${yPosition / 3}%`,   // Convert SVG y (0-300) to percentage (0-100)
                  transform: 'translate(-50%, -50%)' // Center the element
                }}
                onHoverStart={() => setHoveredRank(rank)}
                onHoverEnd={() => setHoveredRank(null)}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.8 + i * 0.15, ease: "backOut" }}
                viewport={{ once: true }}
              >
                <motion.div
                  className="relative rounded-full w-12 h-12 md:w-16 md:h-16 cursor-pointer"
                  style={{
                    background: rank.aura,
                    boxShadow: `0 0 25px ${rank.color}60, inset 0 0 10px ${rank.color}30`,
                  }}
                  whileHover={{ scale: 1.2 }}
                  animate={{
                    scale: [1, 1.05, 1],
                    filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <p className="mt-4 text-white/80 text-xs md:text-sm font-medium text-center whitespace-nowrap group-hover:text-white transition-colors">
                  {rank.title}
                </p>
                
                <AnimatePresence>
                  {hoveredRank?.key === rank.key && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute bottom-full mb-8 w-64 p-4 rounded-xl border border-white/10 bg-black/50 backdrop-blur-md shadow-2xl z-50 left-1/2 -translate-x-1/2"
                    >
                      <h4 className="font-bold text-white mb-1">{rank.title}</h4>
                      <p className="text-white/70 text-xs leading-snug">{rank.description}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


// --- NEW: LEADERBOARDS PANEL COMPONENT ---
function LeaderboardsPanel({ meId = "me", hidden = false, onToggleHidden }) {
  const [tab, setTab] = useState("weekly");
  const rows = tab==="weekly" ? lbMock.weekly : tab==="alltime" ? lbMock.alltime : lbMock.streaks;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-xl p-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h3 className="text-white/80 text-sm uppercase tracking-[0.15em]">Leaderboards</h3>
        
        {/* -- UPGRADED TOGGLE SWITCH -- */}
        <label className="flex items-center gap-3 cursor-pointer group">
          <div
            onClick={() => onToggleHidden?.(!hidden)}
            className={`relative inline-flex items-center w-10 h-6 rounded-full transition-colors duration-300 ease-in-out ${hidden ? 'bg-cyan-500' : 'bg-white/10'}`}
          >
            <motion.div
              className="absolute w-4 h-4 bg-white rounded-full shadow-md"
              style={{ top: '4px', left: '4px' }}
              layout
              transition={{ type: "spring", stiffness: 700, damping: 30 }}
              animate={{ x: hidden ? 16 : 0 }}
            />
          </div>
          <span className="text-sm text-white/60 group-hover:text-white transition-colors">
            Hide me from public leaderboards
          </span>
          <input
            type="checkbox"
            checked={hidden}
            onChange={e => onToggleHidden?.(e.target.checked)}
            className="sr-only" // Hidden for accessibility, logic handled by divs
          />
        </label>
      </div>

      <div className="flex gap-2 mb-4">
        {[
          {k:"weekly",label:"Weekly"},
          {k:"alltime",label:"All-time"},
          {k:"streaks",label:"Streaks"},
        ].map(t=>(
          <button key={t.k}
            onClick={()=>setTab(t.k)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              tab===t.k ? "bg-white/15 text-white" : "bg-white/5 text-white/70 hover:bg-white/10"
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="divide-y divide-white/5">
        {rows.map((r,i)=>{
          const isMe = r.id===meId;
          if (isMe && hidden) return null;
          return (
            <motion.div
              key={r.id + tab} // Add tab to key to force re-render on tab change
              initial={{opacity:0,y:8}}
              animate={{opacity:1,y:0}}
              transition={{duration:0.25, delay:i*0.03}}
              className="flex items-center justify-between py-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 text-center text-sm text-white/50">{i+1}</div>
                <div className="w-8 h-8 rounded-full bg-white/10" />
                <div className="flex flex-col">
                  <div className={`text-sm font-medium ${isMe?"text-white":"text-white/90"}`}>{r.name}</div>
                  <div className="text-xs text-white/50">{r.rank}</div>
                </div>
              </div>

              {tab==="weekly" && <div className="text-sm font-semibold text-cyan-300">+{r.xpDelta?.toLocaleString()} XP</div>}
              {tab==="alltime" && <div className="text-sm font-medium text-white/70">{r.xp?.toLocaleString()} XP</div>}
              {tab==="streaks" && <div className="text-sm font-semibold text-amber-300">{r.days} days</div>}
            </motion.div>
          )
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/60">
        <span className="px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">Top Oracles</span>
        <span className="px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">Most Consistent</span>
        <span className="px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">Fastest Ascenders</span>
      </div>
    </div>
  );
}

// --- NEW: ACHIEVEMENTS PANEL COMPONENT ---
function AchievementsPanel({ achievements }){
  
  function Badge({state}){
    if (state==="done") return <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-500/20 text-emerald-300 font-medium">Unlocked</span>;
    if (state==="progress") return <span className="px-2 py-0.5 rounded-full text-xs bg-cyan-500/15 text-cyan-300 font-medium">In progress</span>;
    return <span className="px-2 py-0.5 rounded-full text-xs bg-white/10 text-white/50 font-medium">Locked</span>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.6, ease: "easeOut" }} 
      viewport={{ once: true }}
    >
      <SectionHeader>Achievements & Milestones</SectionHeader>
      <div className="p-4 rounded-2xl bg-[#111419]/80 backdrop-blur-md border border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.25)] transition-all">
        <div className="grid md:grid-cols-2 gap-4">
          {achievements.map((m,i)=>(
            <div 
              key={m.id}
              className="relative"
            >
              <motion.div
                initial={{opacity:0,y:10}}
                whileInView={{opacity:1,y:0}}
                transition={{duration:0.35, delay:i*0.04}}
                className="p-4 h-full rounded-xl bg-black/30 border border-white/5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white/10 grid place-items-center flex-shrink-0">{m.icon}</div>
                    <div>
                      <div className="text-white font-medium">{m.name}</div>
                      <div className="text-white/60 text-sm">{m.desc}</div>
                    </div>
                  </div>
                  <Badge state={m.state}/>
                </div>

                <div className="mt-3">
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${m.state==="done"?"bg-emerald-400":"bg-cyan-400"}`}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${Math.min(100, (m.progress/m.goal)*100)}%` }}
                      transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                      viewport={{ once: true }}
                    />
                  </div>
                  <div className="mt-1 text-xs text-white/50">
                    {m.state==="done" ? `+${m.xp} XP • ${new Date(m.unlocked_at).toLocaleDateString()}`
                      : `${m.progress} / ${m.goal} • +${m.xp} XP`}
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
         <div className="mt-5 text-center text-xs text-white/60">
          Milestones contribute to rank certificates. Unlock more to accelerate ascension.
        </div>
      </div>
    </motion.div>
  );
}

// Global SectionHeader component for reuse
const SectionHeader = ({ children }) => (
  <motion.h3
    className="text-white/70 text-sm uppercase tracking-[0.15em] relative pb-2 mb-4"
    whileHover={{ color: "#00A0C8" }}
    initial={{opacity:0,y:10}} whileInView={{opacity:1,y:0}} transition={{duration:0.6,ease:"easeOut"}}
    viewport={{ once: true }}
  >
    {children}
    <motion.span
      className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-cyan-500/70 to-transparent origin-left"
      initial={{ scaleX: 0 }}
      whileHover={{ scaleX: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    />
  </motion.h3>
);


// --- NEW: QUICK ACTIONS COMPONENT (Inlined) ---
function QuickActions({ onPing }) {
  const actions = [
    { id:"macro",    label:"Open Macro Signals", href:createPageUrl("MacroSignals"), icon: Activity, hint:"Satisfies: Open Macro Signals" },
    { id:"insight",  label:"Read an Insight",    href:createPageUrl("Insights"),   icon: BookOpen, hint:"Satisfies: Decode 3 Signals" },
    { id:"post",     label:"Post an Insight",    href:createPageUrl("Insights"),   icon: PlusCircle, hint:"Satisfies: Post 5 Insights" },
    { id:"watch",    label:"Update Watchlist",   href:createPageUrl("Watchlist"),  icon: ListChecks, hint:"Satisfies: Watchlist goal" },
    { id:"invite",   label:"Invite a Friend",    href:"#",                icon: Users, hint:"Satisfies: Invite challenge" },
  ];

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-cyan-300" />
        <div className="text-xs font-semibold text-white/60 tracking-wider">QUICK ACTIONS</div>
      </div>

      <div className="flex flex-wrap gap-3">
        {actions.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{opacity:0, y:6}} animate={{opacity:1, y:0}} transition={{duration:0.25, delay:i*0.03}}
          >
            <Link
              to={a.href}
              onClick={() => onPing?.(a.id)}
              className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-xl
                         bg-white/5 hover:bg-white/10 border border-white/10
                         backdrop-blur-md text-sm text-white/80 transition
                         shadow-[0_4px_20px_rgba(0,0,0,0.25)]"
            >
              <a.icon className="w-4 h-4 text-white/70 group-hover:text-cyan-300 transition-colors" />
              <span>{a.label}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}


// --- CHALLENGES PANEL & HELPERS (Inlined) ---
function ChallengesPanel({ onClaim }){
  const [tab, setTab] = useState("daily");
  const [items, setItems] = useState(()=> {
    const saved = typeof window !== "undefined" ? localStorage.getItem("vireon_claims") : null;
    const claimed = saved? JSON.parse(saved) : {};
    return challengeMock.map(c => ({...c, claimed: claimed[c.id]}));
  });

  useEffect(()=>{
    const id = setInterval(()=> setItems(s=>[...s]), 30_000); // tick timers
    return ()=> clearInterval(id);
  },[]);

  const pool = useMemo(()=> items.filter(i => i.scope===tab), [items, tab]);

  function claim(ch){
    if (ch.claimed) return;
    const done = ch.progress >= ch.goal;
    if (!done) return;
    const next = items.map(i => i.id===ch.id ? {...i, claimed:true} : i);
    setItems(next);
    const map = Object.fromEntries(next.filter(i=>i.claimed).map(i=>[i.id,true]));
    localStorage.setItem("vireon_claims", JSON.stringify(map));
    onClaim?.(ch.xp, ch.id);
  }
  
  function fmtTimeLeft(iso){
    const end = new Date(iso).getTime();
    const now = Date.now();
    const ms = Math.max(0, end - now);
    const h = Math.floor(ms/3.6e6);
    const m = Math.floor((ms%3.6e6)/6e4);
    return h>0 ? `${h}h ${m}m` : `${m}m`;
  }

  function ProgressBar({pct}){
    return (
      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ width:`${pct}%`, background:"linear-gradient(90deg,#22d3ee,#38bdf8)" }}
          initial={{ width:0 }}
          animate={{ width:`${pct}%` }}
          transition={{ duration:0.6, ease:"easeOut" }}
        />
      </div>
    );
  }
  
  function bumpProgressById(id){
    const map = {
      macro:   ["D1","W2"],
      insight: ["D2"],
      post:    ["W1"],
      watch:   [],
      invite:  ["W3"],
    };
    const targets = map[id] || [];
    setItems(prev => prev.map(c => 
      targets.includes(c.id) && c.progress < c.goal
        ? { ...c, progress: Math.min(c.goal, c.progress + 1) }
        : c
    ));
    // onClaim?.(5, `action_${id}`); 
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} viewport={{ once: true }}>
      <SectionHeader>Challenges</SectionHeader>
      <div className="p-4 rounded-2xl bg-[#111419]/80 backdrop-blur-md border border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.25)] hover:shadow-[0_0_20px_rgba(0,160,200,0.15)] transition-all">
        
        <QuickActions onPing={bumpProgressById} />

        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            {(["daily","weekly"]).map(k=>(
              <button key={k}
                onClick={()=>setTab(k)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  tab===k ? "bg-white/15 text-white" : "bg-white/5 text-white/70 hover:bg-white/10"
                }`}
              >
                {k==="daily"?"Daily":"Weekly"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {pool.map((c,i)=>{
            const pct = Math.min(100, Math.round((c.progress/c.goal)*100));
            const done = pct>=100;
            return (
              <motion.div key={c.id}
                initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:0.3, delay:i*0.04}}
                className="p-4 h-full rounded-xl bg-[#111419]/80 border border-white/5 hover:border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.25)]"
              >
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <div className="text-white font-medium">{c.title}</div>
                    <div className="text-white/60 text-sm">{c.desc}</div>
                  </div>
                  <div className="text-xs text-white/50">Resets in {fmtTimeLeft(c.resetAt)}</div>
                </div>

                <div className="mt-3">
                  <ProgressBar pct={pct}/>
                  <div className="mt-1 text-xs text-white/50">{c.progress} / {c.goal} • <span className="text-cyan-300">+{c.xp} XP</span></div>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={()=>claim(c)}
                    disabled={!done || c.claimed}
                    className={`px-3 py-1.5 rounded-md text-sm transition font-medium
                      ${done && !c.claimed ? "bg-cyan-500/20 text-cyan-200 hover:bg-cyan-500/30"
                       : "bg-white/8 text-white/50 cursor-not-allowed"}`}
                  >
                    {c.claimed ? "Claimed" : done ? "Claim Reward" : "In Progress"}
                  </button>
                  {done && !c.claimed && <span className="text-xs text-white/50">Ready to claim</span>}
                </div>
              </motion.div>
            )
          })}
        </div>

        <div className="mt-4 text-center text-xs text-white/50">
          Daily resets at 00:00 UTC. Weekly resets on Sunday 00:00 UTC.
        </div>
      </div>
    </motion.div>
  );
}


// --- MAIN PAGE STRUCTURE ---

function ProfilePageInner({ profile, ranks, setSnap, setRankEvent }) {
  const theme = useRankTheme();
  const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const accent = theme.accent === "holographic" ? "linear-gradient(90deg,#8ec5fc,#e0c3fc,#f9f871)" : theme.accent;
  const [xpPulse, setXpPulse] = useState(false);
  const [showPerks, setShowPerks] = useState(false);
  const [hideMe, setHideMe] = useState(false);
  const sfx = useSoundFX();

  function handleAddXp(amount = 50){
    sfx.playXP();
    const { rankChanged, newRank } = addXpLocal(amount);
    setSnap(snapshot());
    setXpPulse(true);
    setTimeout(() => setXpPulse(false), 1200);
    if (rankChanged){
      setTimeout(() => {
        sfx.playAscend();
        setRankEvent({ show: true, newRank });
      }, 1300);
    }
  }
  function handleAddDay(){ tickStreak(1); setSnap(snapshot()); }
  function handleReset(){ resetUser(); setSnap(snapshot()); }

  const currentRank = ranks.find(r => r.key === profile.rank_key);
  
  return (
    <>
      <motion.main className="max-w-[1100px] mx-auto px-6 py-12 space-y-12 text-white" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={reduceMotion ? { duration: 0 } : { duration: 0.8, ease: "easeOut" }}>
        {/* HEADER */}
        <section className="text-center space-y-4">
            <div className="flex flex-col items-center text-center space-y-2 relative">
                <motion.div
                  className="absolute inset-0 -z-10 blur-3xl pointer-events-none"
                  style={{ background: `radial-gradient(circle at 50% 10%, rgba(0,160,200,0.12), rgba(0,0,0,0) 70%)` }}
                  animate={{ opacity: [0.25, 0.4, 0.25] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="relative">
                    <StreakHalo days={profile.streak_current} best={profile.streak_best}>
                      <motion.img 
                        src={profile.avatar_url || "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68943f7eb0fb9393bf9a8069/7177b07ab_VireonLogoBlack.jpg"} 
                        className="w-full h-full rounded-full object-cover transform scale-125"
                        alt="User avatar"
                      />
                    </StreakHalo>
                </div>
                <div className="text-sm text-white/50 pt-2">Day {profile.streak_current} &bull; Best {profile.streak_best}</div>
                <h1 className="text-3xl font-semibold tracking-tight text-white">{profile.display_name}</h1>
                <p className="text-base text-cyan-400 font-medium">{profile.title}</p>
                <div onClick={() => setShowPerks(true)} className="cursor-pointer !mt-4">
                    <RankBadge rankKey={profile.rank_key} ranks={ranks} size="md" withTitle onClick={() => setShowPerks(true)}/>
                </div>
                <p className="text-white/60 text-sm italic !mt-3">Building your signal legacy.</p>
                <div className="pt-4 w-full">
                    <ResonanceMeter value={profile.xp_total} max={profile.nextRank.xp_min} label={<><AnimatedNumber value={profile.xp_total} /> / {profile.nextRank.xp_min.toLocaleString()} XP</>} hue={accent} />
                </div>
            </div>
        </section>

        {/* RANK PROGRESSION */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} viewport={{ once: true }}>
          <SectionHeader>Your Journey</SectionHeader>
          <div className="p-4 rounded-2xl bg-[#111419]/80 backdrop-blur-md border border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.25)] hover:shadow-[0_0_20px_rgba(0,160,200,0.15)] transition-all">
             <RankProgressionPanel ranks={ranks} currentKey={profile.rank_key} xp={profile.xp_total} nextXp={profile.nextRank.xp_min} accent={accent} />
          </div>
        </motion.div>

        {/* CHALLENGES */}
        <ChallengesPanel onClaim={(xp) => handleAddXp(xp)} />

        {/* ACHIEVEMENTS */}
        <AchievementsPanel achievements={profile.achievements} />

        {/* CERTIFICATES */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} viewport={{ once: true }}>
            <SectionHeader>Certificates</SectionHeader>
            <div className="p-4 rounded-2xl bg-[#111419]/80 backdrop-blur-md border border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.25)] hover:shadow-[0_0_20px_rgba(0,160,200,0.15)] transition-all">
              {profile.certificates?.length ? (<ul className="grid md:grid-cols-2 gap-4">{profile.certificates.map(c => (<li key={c.id} className="card space-y-2"><div className="font-semibold text-white capitalize">{c.rank_key} Certificate</div><div className="text-white/60 text-sm">Issued: {new Date(c.issued_at).toLocaleDateString()}</div><div className="flex gap-3 pt-1"><button className="text-sm hover:underline bg-transparent border-none p-0 active:scale-[0.97] transition-transform" style={{color: accent === 'holographic' ? '#8ec5fc' : accent}}>Download</button><button className="text-sm text-white/60 hover:underline bg-transparent border-none p-0 active:scale-[0.97] transition-transform">Verify</button></div></li>))}</ul>) : <p className="text-white/60 p-4">Earn your first certificate by reaching Acolyte.</p>}
            </div>
        </motion.div>

        {/* SIGNAL CIRCLES */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} viewport={{ once: true }}>
            <SectionHeader>Signal Circles</SectionHeader>
            <div className="p-4 rounded-2xl bg-[#111419]/80 backdrop-blur-md border border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.25)] hover:shadow-[0_0_20px_rgba(0,160,200,0.15)] transition-all">
              {profile.groups?.length ? (<ul className="space-y-3">{profile.groups.map(g => (<li key={g.id} className="card flex justify-between items-center"><span className="font-medium text-white">{g.name}</span><span className="text-white/60 text-sm">{g.member_count} members · <span className="capitalize font-semibold">{g.role}</span></span></li>))}</ul>) : <p className="text-white/60 p-4">Join a Circle to grow and collaborate.</p>}
            </div>
        </motion.div>

        {/* LEADERBOARDS */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} viewport={{ once: true }}>
          <LeaderboardsPanel hidden={hideMe} onToggleHidden={setHideMe} meId="me" />
        </motion.div>

        {/* REPLACED RANK LORE WITH ASCENSION CONTINUUM */}
        <AscensionContinuum />
      </motion.main>
      
      {/* DEV CONTROLS & MODALS */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2 p-3 rounded-2xl backdrop-blur-[16px] bg-white/5 border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.3)]">
        <div className="relative">
            <XPChargeGlow active={xpPulse}/>
            <ParticleBurst trigger={xpPulse}/>
            <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}} className="w-full text-sm text-white/90 px-3 py-1.5 rounded-md hover:bg-white/10 transition-colors" onClick={()=>handleAddXp(50)}>Add +50 XP</motion.button>
        </div>
        <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}} className="text-sm text-white/90 px-3 py-1.5 rounded-md hover:bg-white/10 transition-colors" onClick={handleAddDay}>Add +1 Day</motion.button>
        <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}} className="text-sm text-white/90 px-3 py-1.5 rounded-md hover:bg-white/10 transition-colors" onClick={handleReset}>Reset</motion.button>
      </div>

      <RankPerkModal open={showPerks} onClose={() => setShowPerks(false)} rank={currentRank}/>
    </>
  );
}

export default function ProfilePage() {
  const [data, setData] = useState(snapshot());
  const [rankEvent, setRankEvent] = useState({ show: false, newRank: null });
  const profile = data.profile;
  const ranks = data.ranks;
  const currentRank = ranks.find(r => r.key === profile.rank_key) || ranksData[0];

  return (
    <>
      <RankThemeProvider rank={currentRank}>
        <div style={{'--card-glow': currentRank?.color_primary === 'holographic' ? 'rgba(160, 180, 255, 0.2)' : `${currentRank?.color_primary}33`}}>
          <SignalResonanceEngine xp={profile.xp_total} streak={profile.streak_current} />
          <ProfilePageInner
            profile={profile}
            ranks={ranks}
            setSnap={setData}
            setRankEvent={setRankEvent}
          />
          <RankUpCinematic
            open={rankEvent.show}
            newRank={rankEvent.newRank}
            onFinish={() => setRankEvent({ show: false, newRank: null })}
          />
        </div>
      </RankThemeProvider>
    </>
  );
}
