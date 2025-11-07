
import React, { useEffect, useState } from "react";
import { motion, animate, AnimatePresence } from "framer-motion";

// --- MOCK STORE (Inlined for prototype) ---
const ranksData = [
  { key:"cipher", name:"Cipher", xp_min:0, color_primary:"#2E2E2E" },
  { key:"acolyte", name:"Acolyte", xp_min:500, color_primary:"#A0B4FF" },
  { key:"sentinel", name:"Sentinel", xp_min:2000, color_primary:"#00A0C8" },
  { key:"luminary", name:"Luminary", xp_min:6000, color_primary:"#E8B923" },
  { key:"ascendant", name:"Ascendant", xp_min:15000, color_primary:"#F3F5F8" },
  { key:"oracle", name:"Oracle", xp_min:40000, color_primary:"holographic" }
];
let user = {
  id:"u_dev", display_name:"Vireon Tester", avatar_url:null, rank_key:"sentinel", xp_total:2450,
  streak_current:12, streak_best:27, nextRank:{ key:"luminary", name:"Luminary", xp_min:6000, streak_required:0 },
  xpToNext:3550, certificates:[], achievements:[], groups:[]
};
function rankFor(xp, rs = ranksData){ const sorted = [...rs].sort((a,b)=>a.xp_min-b.xp_min); let cur = sorted[0]; for (const r of sorted) if (xp >= r.xp_min) cur = r; return cur; }
function recomputeNext(xp, rs = ranksData){ const cur = rankFor(xp, rs); const idx = rs.findIndex(r=>r.key===cur.key); const next = rs[idx+1] || rs[idx]; return { cur, next }; }
function addXpLocal(amount=50){
  const newXp = user.xp_total + amount; const { cur, next } = recomputeNext(newXp);
  const prevRank = user.rank_key; user.xp_total = newXp; user.rank_key = cur.key;
  user.nextRank = { key: next.key, name: next.name, xp_min: next.xp_min, streak_required:0 };
  user.xpToNext = Math.max(0, next.xp_min - newXp); const rankChanged = prevRank !== cur.key;
  return { rankChanged, newRank: ranksData.find(r=>r.key===user.rank_key) };
}
function tickStreak(days=1){ user.streak_current += days; if (user.streak_current > user.streak_best) user.streak_best = user.streak_current; }
function resetUser(){
  user.rank_key = "sentinel"; user.xp_total = 2450; user.streak_current = 12; user.streak_best = 27;
  user.nextRank = { key:"luminary", name:"Luminary", xp_min:6000, streak_required:0 }; user.xpToNext = 3550;
}
function snapshot(){ const profile = JSON.parse(JSON.stringify(user)); profile.nextRank = recomputeNext(profile.xp_total).next; profile.xpToNext = Math.max(0, profile.nextRank.xp_min - profile.xp_total); profile.rank_key = rankFor(profile.xp_total).key; return { profile, ranks: JSON.parse(JSON.stringify(ranksData)) }; }


// --- COMPONENTS (Inlined) ---
function RankBadge({ rankKey, ranks=[], size="md", withTitle=false }){
  const meta = ranks.find(r=>r.key===rankKey) || { key:rankKey, name:rankKey, color_primary:"#9CA3AF" };
  const px = size==="lg"?72:size==="sm"?24:40;
  const bg = meta.color_primary==="holographic" ? "linear-gradient(135deg,#8ec5fc,#e0c3fc)" : `${meta.color_primary}26`;
  return (
    <div className="inline-flex items-center gap-2" aria-label={`Rank: ${meta.name}`}>
      <div className="rounded-full shadow-inner relative" style={{ width:px, height:px, background:bg }}>
        <div className="absolute inset-[18%] rounded-full bg-white/70 mix-blend-overlay" />
      </div>
      {withTitle && <div className="text-lg font-semibold text-white">{meta.name}</div>}
    </div>
  );
}
function ResonanceMeter({ value, max, label, hue="#9CA3AF" }){
  const pct = Math.max(0, Math.min(100, (value/Math.max(1,max))*100));
  const fill = hue === "holographic" ? "linear-gradient(90deg,#8ec5fc,#e0c3fc,#f9f871)" : hue;
  return (
    <div className="w-full max-w-sm mx-auto" role="progressbar" aria-valuemin={0} aria-valuemax={max} aria-valuenow={value}>
      <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
        <motion.div className="h-full rounded-full" style={{ background:fill }} initial={{width:0}} animate={{width:`${pct}%`}} transition={{duration:0.3,ease:"easeInOut"}} />
      </div>
      {label && <div className="text-xs text-white/60 text-center mt-2">{label}</div>}
    </div>
  );
}
function StreakHalo({ days, best, children }){
  const clamped = Math.max(0.2, Math.min(0.65, 0.15 + days * 0.03));
  return (
    <div className="relative inline-flex items-center justify-center">
      <motion.div className="absolute inset-[-6px] rounded-full" style={{border:"1px solid rgba(255,255,255,0.08)"}} animate={{boxShadow: [`0 0 16px rgba(0, 212, 255, ${clamped})`, `0 0 24px rgba(0, 212, 255, ${clamped * 0.7})`, `0 0 16px rgba(0, 212, 255, ${clamped})`]}} transition={{duration:5,repeat:Infinity,ease:"easeInOut"}} />
      <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">{children}</div>
      <div className="absolute -bottom-4 text-xs text-white/60">{`Day ${days} / Best ${best}`}</div>
    </div>
  );
}

// --- NEW CINEMATIC COMPONENT ---
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
  const [active, setActive] = useState(false);
  const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (open) {
      if (reduceMotion) {
        onFinish?.();
        return;
      }
      setActive(true);
      const audio = new Audio("/sounds/ascend_chime.mp3");
      audio.volume = 0.3;
      audio.play().catch(()=>{});
      const t = setTimeout(() => {
        setActive(false);
        onFinish?.();
      }, 2200);
      return () => clearTimeout(t);
    }
  }, [open, reduceMotion, onFinish]);

  if (!active || reduceMotion) return null;

  const glow = newRank?.color_primary === "holographic"
    ? "linear-gradient(90deg,#8ec5fc,#e0c3fc,#f9f871)"
    : newRank?.color_primary;

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="ascend-demo"
          className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
          transition={{ duration: 0.4 }}
        >
          <motion.div className="absolute inset-0 bg-black" initial={{ opacity: 0 }} animate={{ opacity: 0.9 }} exit={{ opacity: 0 }} transition={{ duration: 1.2 }} />
          <Ribbons color={glow} />
          <motion.div
            className="relative z-[201] text-center"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: [0.4, 1.1, 1], opacity: [0, 1, 1] }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 1.8, ease: "easeOut" }}
          >
            <RankBadge ranks={ranksData} rankKey={newRank?.key} size="lg" withTitle />
            <motion.div
              className="text-white/90 text-2xl font-semibold mt-4"
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

// --- MAIN DEMO PAGE ---
export default function AscensionDemo() {
  const [{ profile, ranks }, setSnap] = useState(snapshot());
  const [rankEvent, setRankEvent] = useState({ show: false, newRank: null });

  const currentRank = ranks.find(r => r.key === profile.rank_key) || ranks[0];

  function handleAddXp(amount) {
    const { rankChanged, newRank } = addXpLocal(amount);
    setSnap(snapshot());
    if (rankChanged) {
      setTimeout(() => {
        setRankEvent({ show: true, newRank });
      }, 800); // Delay to allow XP bar to animate
    }
  }
  function handleTickStreak() { tickStreak(1); setSnap(snapshot()); }
  function handleReset() { resetUser(); setSnap(snapshot()); }

  return (
    <div className="bg-[#0B0E13] min-h-screen text-white flex items-center justify-center p-6">
      <main className="w-full max-w-lg mx-auto space-y-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-center">Ascension Demo</h1>

        <section className="text-center space-y-4">
          <div className="flex justify-center">
            <StreakHalo days={profile.streak_current} best={profile.streak_best}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl">
                {profile.avatar_url ? <img src={profile.avatar_url} className="w-16 h-16 rounded-full"/> : "👤"}
              </div>
            </StreakHalo>
          </div>
          <div className="space-y-1">
            <div className="text-xl font-semibold">{profile.display_name}</div>
            <RankBadge rankKey={profile.rank_key} ranks={ranks} withTitle />
          </div>
          <ResonanceMeter
            value={profile.xp_total}
            max={profile.nextRank.xp_min}
            label={`${profile.xp_total.toLocaleString()} / ${profile.nextRank.xp_min.toLocaleString()} XP`}
            hue={currentRank.color_primary}
          />
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-center mb-2">Controls</h2>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => handleAddXp(50)} className="bg-white/10 hover:bg-white/20 p-3 rounded-lg transition-colors">+50 XP</button>
            <button onClick={() => handleAddXp(250)} className="bg-white/10 hover:bg-white/20 p-3 rounded-lg transition-colors">+250 XP</button>
            <button onClick={() => handleAddXp(1000)} className="bg-white/10 hover:bg-white/20 p-3 rounded-lg transition-colors">+1000 XP</button>
            <button onClick={handleTickStreak} className="bg-white/10 hover:bg-white/20 p-3 rounded-lg transition-colors">+1 Streak Day</button>
          </div>
          <button onClick={handleReset} className="w-full bg-red-500/20 hover:bg-red-500/30 p-3 rounded-lg transition-colors">Reset Profile</button>
        </section>
      </main>

      <RankUpCinematic
        open={rankEvent.show}
        newRank={rankEvent.newRank}
        onFinish={() => setRankEvent({ show: false, newRank: null })}
      />
    </div>
  );
}
