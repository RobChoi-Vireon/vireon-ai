import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, GitCommit, Globe, TrendingUp, TrendingDown, Minus, Zap, Info, Clock } from 'lucide-react';

const HORIZON_EASE = [0.26, 0.11, 0.26, 1.0];
const SPRING = { type: 'spring', stiffness: 340, damping: 38, mass: 0.9 };
const SMOOTH = { duration: 0.28, ease: [0.22, 0.61, 0.36, 1] };

// ─── Shared design tokens ────────────────────────────────────────────────────

// Screenshot-matched: deep navy/slate card — clean, minimal, premium
const GLASS_CARD = {
  background: 'linear-gradient(160deg, rgba(18,22,38,0.92) 0%, rgba(13,16,28,0.96) 60%, rgba(16,19,34,0.94) 100%)',
  backdropFilter: 'blur(32px) saturate(140%)',
  WebkitBackdropFilter: 'blur(32px) saturate(140%)',
  border: '1px solid rgba(255,255,255,0.07)',
  boxShadow: [
    'inset 0 1px 0 rgba(255,255,255,0.07)',
    '0 4px 24px rgba(0,0,0,0.32)',
    '0 1px 4px rgba(0,0,0,0.20)',
  ].join(', ')
};

// Specular highlight — very subtle on dark cards
const SpecularLine = ({ opacity = 0.07 }) => (
  <div style={{
    position: 'absolute', top: 0, left: '8%', right: '8%', height: '1px',
    background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,${opacity}) 40%, rgba(255,255,255,${opacity}) 60%, transparent 100%)`,
    pointerEvents: 'none', zIndex: 2
  }} />
);

// Minimal subsurface — barely visible accent tint
const SubsurfaceGlow = ({ color = 'rgba(255,255,255,0.015)' }) => (
  <div style={{
    position: 'absolute', inset: 0,
    background: `radial-gradient(ellipse at 50% 0%, ${color} 0%, transparent 60%)`,
    pointerEvents: 'none', zIndex: 0, borderRadius: 'inherit'
  }} />
);

// ─── Liquid Glass StrengthBar ────────────────────────────────────────────────

const StrengthBar = ({ pct, color, delay = 0 }) => (
  <div style={{
    height: '7px', borderRadius: '5px',
    background: 'linear-gradient(180deg, rgba(0,0,0,0.22) 0%, rgba(255,255,255,0.05) 100%)',
    overflow: 'hidden', width: '100%',
    boxShadow: 'inset 0 1.5px 3px rgba(0,0,0,0.28), inset 0 -0.5px 0 rgba(255,255,255,0.06)',
    position: 'relative'
  }}>
    <motion.div
      initial={{ width: 0, opacity: 0.6 }}
      animate={{ width: `${pct}%`, opacity: 1 }}
      transition={{ duration: 0.95, delay, ease: HORIZON_EASE }}
      style={{
        height: '100%', borderRadius: '5px',
        background: `linear-gradient(90deg, ${color.replace(/[\d.]+\)$/, '0.55)')} 0%, ${color} 60%, ${color.replace(/[\d.]+\)$/, '0.72)')} 100%)`,
        boxShadow: `0 0 12px ${color.replace(/[\d.]+\)$/, '0.50)')}, 0 0 4px ${color.replace(/[\d.]+\)$/, '0.30)')}`,
        position: 'relative', overflow: 'hidden'
      }}
    >
      {/* Liquid-glass gloss — top half catch-light */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '45%', background: 'linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 100%)', borderRadius: '5px 5px 0 0' }} />
      {/* Slow shimmer sweep */}
      <motion.div
        animate={{ x: ['-120%', '220%'] }}
        transition={{ duration: 2.4, delay: delay + 1.0, repeat: Infinity, repeatDelay: 6, ease: 'easeInOut' }}
        style={{
          position: 'absolute', top: 0, bottom: 0, width: '35%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)',
          borderRadius: '5px'
        }}
      />
    </motion.div>
  </div>
);

// ─── MiniSparkline (unchanged logic, same rendering) ────────────────────────

const MiniSparkline = ({ data = [60, 58, 62, 61, 65, 67, 66], color, delay = 0 }) => {
  const max = Math.max(...data), min = Math.min(...data), range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 44},${12 - ((v - min) / range) * 12}`).join(' ');
  const [lx, ly] = pts.split(' ').pop().split(',').map(Number);
  return (
    <svg width="44" height="14" style={{ overflow: 'visible', flexShrink: 0 }}>
      <defs>
        <filter id={`sg-${delay}`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="1.2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <motion.polyline points={pts} fill="none" stroke={color} strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round"
        filter={`url(#sg-${delay})`}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.85 }}
        transition={{ duration: 1.1, delay, ease: HORIZON_EASE }}
      />
      <motion.circle cx={lx} cy={ly} r="2" fill={color}
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: delay + 0.8 }}
        style={{ filter: `drop-shadow(0 0 3px ${color})` }}
      />
    </svg>
  );
};

// ─── ConfidenceBadge + MomentumTag (unchanged) ───────────────────────────────

const ConfidenceBadge = ({ level }) => {
  const map = {
    High: { bg: 'rgba(88,227,164,0.12)', border: 'rgba(88,227,164,0.22)', color: 'rgba(88,227,164,0.88)' },
    Medium: { bg: 'rgba(255,200,80,0.10)', border: 'rgba(255,200,80,0.20)', color: 'rgba(255,200,80,0.85)' },
    Low: { bg: 'rgba(255,106,122,0.10)', border: 'rgba(255,106,122,0.20)', color: 'rgba(255,106,122,0.85)' },
  };
  const s = map[level] || map.Medium;
  return (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}>
      {level}
    </span>
  );
};

const MomentumTag = ({ pts }) => {
  const n = typeof pts === 'number' ? pts : (parseFloat(pts) || 0);
  const up = n >= 0;
  const color = up ? 'rgba(88,227,164,0.88)' : 'rgba(255,106,122,0.88)';
  const bg = up ? 'rgba(88,227,164,0.10)' : 'rgba(255,106,122,0.10)';
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: bg, color }}>
      <Icon className="w-3 h-3" strokeWidth={2.5} />
      {up ? '+' : ''}{n} pts
    </span>
  );
};

// ─── Tab definition ───────────────────────────────────────────────────────────

const TABS = [
  { id: 'consensus',   label: 'Consensus',    sub: 'Where the Street agrees',      Icon: CheckCircle, color: 'rgba(88,227,164,0.85)',  glow: 'rgba(88,227,164,0.20)'  },
  { id: 'divergences', label: 'Divergences',  sub: 'Where narratives fracture',    Icon: GitCommit,   color: 'rgba(180,120,255,0.85)', glow: 'rgba(180,120,255,0.18)' },
  { id: 'us_global',   label: 'US vs Global', sub: 'Regional interpretation',      Icon: Globe,       color: 'rgba(94,167,255,0.85)',  glow: 'rgba(94,167,255,0.18)'  },
  { id: 'changing',    label: 'Changing',     sub: 'Narratives changing this week',Icon: Zap,         color: 'rgba(255,190,80,0.85)',  glow: 'rgba(255,190,80,0.18)'  },
];

// ─── Liquid-glass hoverable card wrapper ─────────────────────────────────────

const HoverCard = ({ children, glowColor = 'rgba(255,255,255,0.04)', subsurface = 'rgba(255,255,255,0.015)', style = {}, className = '' }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      animate={{
        y: hovered ? -2 : 0,
        boxShadow: hovered
          ? [
              'inset 0 1px 0 rgba(255,255,255,0.10)',
              '0 8px 32px rgba(0,0,0,0.40)',
              '0 2px 8px rgba(0,0,0,0.24)',
              `0 0 24px ${glowColor}`,
            ].join(', ')
          : GLASS_CARD.boxShadow
      }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className={`relative ${className}`}
      style={{ ...GLASS_CARD, ...style, overflow: 'hidden' }}
    >
      <SpecularLine />
      <SubsurfaceGlow color={hovered ? glowColor.replace(/[\d.]+\)$/, '0.04)') : subsurface} />
      {children}
    </motion.div>
  );
};

// ─── ConsensusCard ────────────────────────────────────────────────────────────

const ConsensusCard = ({ item, index }) => {
  const pct = Math.round((item.confidence || 0) * 100);
  const momentum = item.momentum_pts ?? item.momentum ?? 0;
  const drivers = item.drivers || [];
  const breakConditions = item.break_conditions || item.break_triggers || [];
  const sources = item.sources_count ?? item.sources ?? 0;
  const confidence_level = item.confidence_level || (pct >= 70 ? 'High' : pct >= 45 ? 'Medium' : 'Low');
  const sparkData = item.sparkline || [pct - 8, pct - 5, pct - 6, pct - 3, pct - 2, pct, pct];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.06 * index, duration: 0.38, ease: HORIZON_EASE }}
    >
      <HoverCard glowColor="rgba(88,227,164,0.10)" subsurface="rgba(88,227,164,0.018)" style={{ borderRadius: '16px', padding: '20px 22px' }}>
        <div className="relative z-10 space-y-3.5">
          <div className="flex items-start justify-between gap-3">
            <p className="text-[14px] font-semibold leading-snug flex-1" style={{ color: 'rgba(255,255,255,0.94)', letterSpacing: '-0.015em' }}>
              {item.claim}
            </p>
            <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
              <span className="text-[24px] font-bold" style={{ color: 'rgba(88,227,164,0.92)', letterSpacing: '-0.035em', lineHeight: 1 }}>{pct}%</span>
              <ConfidenceBadge level={confidence_level} />
            </div>
          </div>
          <StrengthBar pct={pct} color="rgba(88,227,164,0.75)" delay={0.1 + 0.06 * index} />
          {drivers.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.32)', letterSpacing: '0.07em' }}>Drivers</p>
              <ul className="space-y-1.5">
                {drivers.slice(0, 3).map((d, i) => (
                  <li key={i} className="flex items-start gap-2 text-[12px]" style={{ color: 'rgba(255,255,255,0.68)' }}>
                    <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'rgba(88,227,164,0.60)' }} />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {breakConditions.length > 0 && (
            <div className="pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,106,122,0.50)', letterSpacing: '0.07em' }}>What could break this</p>
              <ul className="space-y-1.5">
                {breakConditions.slice(0, 2).map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-[12px]" style={{ color: 'rgba(255,255,255,0.58)' }}>
                    <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'rgba(255,106,122,0.50)' }} />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-3">
              <MiniSparkline data={sparkData} color="rgba(88,227,164,0.80)" delay={0.5 + 0.06 * index} />
              <MomentumTag pts={momentum} />
            </div>
            <div className="flex items-center gap-2">
              {sources > 0 && (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.40)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  {sources} sources
                </span>
              )}
              <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.26)' }}>7d trend</span>
            </div>
          </div>
        </div>
      </HoverCard>
    </motion.div>
  );
};

// ─── DivergenceCard ───────────────────────────────────────────────────────────

const DivergenceCard = ({ item, index }) => {
  const domPct = Math.round((item.confidence || 0.62) * 100);
  const ctrPct = 100 - domPct;
  const domMom = item.dominant_momentum ?? item.momentum_pts ?? 0;
  const ctrMom = item.counter_momentum ?? -domMom;
  const interpretation = item.interpretation || item.summary || '';
  const resolution = item.resolution_triggers || item.break_conditions || [];
  const domSpark = item.dominant_sparkline || [domPct - 6, domPct - 4, domPct - 5, domPct - 2, domPct - 1, domPct, domPct];
  const ctrSpark = item.counter_sparkline  || [ctrPct + 6, ctrPct + 4, ctrPct + 5, ctrPct + 2, ctrPct + 1, ctrPct, ctrPct];
  const counterNarrative = item.counter_narrative || item.counter || 'Counter narrative';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.06 * index, duration: 0.38, ease: HORIZON_EASE }}
    >
      <HoverCard
        glowColor="rgba(180,120,255,0.12)"
        subsurface="rgba(160,100,255,0.02)"
        style={{
          borderRadius: '16px',
          background: 'linear-gradient(160deg, rgba(22,16,44,0.96) 0%, rgba(15,12,32,0.98) 60%, rgba(18,14,38,0.96) 100%)',
          border: '1px solid rgba(147,90,230,0.14)',
          padding: '20px 22px'
        }}
      >
        <div className="relative z-10 space-y-4">
          {/* Two-column with glow divider */}
          <div className="grid grid-cols-2 gap-0 relative">
            {/* Vertical glow divider */}
            <div style={{
              position: 'absolute', top: '8px', bottom: '8px', left: '50%', width: '1px',
              background: 'linear-gradient(180deg, transparent, rgba(180,120,255,0.25), rgba(180,120,255,0.15), transparent)',
              transform: 'translateX(-50%)', pointerEvents: 'none'
            }} />

            {/* Dominant */}
            <div className="space-y-2.5 pr-5">
              <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'rgba(180,120,255,0.72)', letterSpacing: '0.06em' }}>Dominant</p>
              <p className="text-[13px] font-bold leading-snug" style={{ color: 'rgba(255,255,255,0.94)', letterSpacing: '-0.01em' }}>{item.topic}</p>
              <span className="text-[20px] font-bold block" style={{ color: 'rgba(180,120,255,0.92)', letterSpacing: '-0.03em', lineHeight: 1 }}>{domPct}%</span>
              <StrengthBar pct={domPct} color="rgba(180,120,255,0.75)" delay={0.1 + 0.06 * index} />
              <div className="flex items-center gap-2 flex-wrap">
                <MiniSparkline data={domSpark} color="rgba(180,120,255,0.80)" delay={0.45 + 0.06 * index} />
                <MomentumTag pts={domMom} />
              </div>
            </div>

            {/* Counter */}
            <div className="space-y-2.5 pl-5">
              <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'rgba(200,160,255,0.55)', letterSpacing: '0.06em' }}>Counter</p>
              <p className="text-[13px] font-semibold leading-snug" style={{ color: 'rgba(255,255,255,0.78)', letterSpacing: '-0.01em' }}>{counterNarrative}</p>
              <span className="text-[20px] font-bold block" style={{ color: 'rgba(200,160,255,0.78)', letterSpacing: '-0.03em', lineHeight: 1 }}>{ctrPct}%</span>
              <StrengthBar pct={ctrPct} color="rgba(200,160,255,0.55)" delay={0.1 + 0.06 * index} />
              <div className="flex items-center gap-2 flex-wrap">
                <MiniSparkline data={ctrSpark} color="rgba(200,160,255,0.68)" delay={0.45 + 0.06 * index} />
                <MomentumTag pts={ctrMom} />
              </div>
            </div>
          </div>

          {interpretation && (
            <div className="p-3.5 rounded-[14px]" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <p className="text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: 'rgba(255,255,255,0.28)', letterSpacing: '0.07em' }}>Interpretation</p>
              <p className="text-[12px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.70)' }}>"{interpretation}"</p>
            </div>
          )}

          {resolution.length > 0 && (
            <div className="pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.28)', letterSpacing: '0.07em' }}>What would resolve this</p>
              <ul className="space-y-1.5">
                {resolution.slice(0, 2).map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-[12px]" style={{ color: 'rgba(255,255,255,0.60)' }}>
                    <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'rgba(200,160,255,0.50)' }} />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </HoverCard>
    </motion.div>
  );
};

// ─── USGlobalCard ─────────────────────────────────────────────────────────────

const USGlobalCard = ({ item, index }) => {
  const usPct = Math.round((item.confidence || 0.71) * 100);
  const glbPct = 100 - usPct;
  const usMom = item.us_momentum ?? item.momentum_pts ?? 0;
  const glbMom = item.global_momentum ?? -usMom;
  const usFlip = item.us_flip_trigger || item.flip_trigger || null;
  const glbFlip = item.global_flip_trigger || null;
  const usView = item.us_view_rationale || item.us_view_detail || null;
  const glbView = item.global_view_rationale || item.global_view_detail || null;
  const usSpark = item.us_sparkline || [usPct - 4, usPct - 2, usPct - 3, usPct, usPct - 1, usPct + 1, usPct];
  const glbSpark = item.global_sparkline || [glbPct + 4, glbPct + 2, glbPct + 3, glbPct, glbPct + 1, glbPct - 1, glbPct];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.06 * index, duration: 0.38, ease: HORIZON_EASE }}
      className="relative rounded-[16px] overflow-hidden"
      style={{ ...GLASS_CARD }}
    >
      <SpecularLine />
      {/* Glow divider between panels */}
      <div style={{
        position: 'absolute', top: 0, bottom: 0, left: '50%', width: '1px',
        background: 'linear-gradient(180deg, transparent 5%, rgba(94,167,255,0.14) 30%, rgba(94,167,255,0.10) 70%, transparent 95%)',
        transform: 'translateX(-50%)', pointerEvents: 'none', zIndex: 2
      }} />

      <div className="grid grid-cols-2 relative z-10">
        {/* US — subtle blue tint */}
        <div className="p-5 space-y-3" style={{ background: 'rgba(94,167,255,0.03)' }}>
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" style={{ color: 'rgba(94,167,255,0.82)', filter: 'drop-shadow(0 0 4px rgba(94,167,255,0.40))' }} strokeWidth={2} />
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'rgba(94,167,255,0.76)', letterSpacing: '0.06em' }}>US Tilt</span>
          </div>
          <p className="text-[13px] font-semibold leading-snug" style={{ color: 'rgba(255,255,255,0.90)', letterSpacing: '-0.01em' }}>"{item.us_view}"</p>
          <div className="flex items-center justify-between">
            <span className="text-[22px] font-bold" style={{ color: 'rgba(94,167,255,0.92)', letterSpacing: '-0.03em', lineHeight: 1 }}>{usPct}%</span>
            <MomentumTag pts={usMom} />
          </div>
          <StrengthBar pct={usPct} color="rgba(94,167,255,0.72)" delay={0.1 + 0.06 * index} />
          <MiniSparkline data={usSpark} color="rgba(94,167,255,0.80)" delay={0.4 + 0.06 * index} />
          {usView && <p className="text-[11px] leading-relaxed pt-1" style={{ color: 'rgba(255,255,255,0.55)', fontStyle: 'italic' }}>View: "{usView}"</p>}
          {usFlip && (
            <div className="pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: 'rgba(255,255,255,0.26)', letterSpacing: '0.06em' }}>What flips it</p>
              <div className="flex items-start gap-2 text-[11px]" style={{ color: 'rgba(255,255,255,0.58)' }}>
                <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'rgba(94,167,255,0.55)' }} />
                {usFlip}
              </div>
            </div>
          )}
        </div>

        {/* Global — very subtle cool tint */}
        <div className="p-5 space-y-3" style={{ background: 'rgba(150,190,255,0.025)', borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5" style={{ color: 'rgba(150,190,255,0.75)' }} strokeWidth={2} />
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'rgba(150,190,255,0.65)', letterSpacing: '0.06em' }}>Global Tilt</span>
          </div>
          <p className="text-[13px] font-semibold leading-snug" style={{ color: 'rgba(255,255,255,0.78)', letterSpacing: '-0.01em' }}>"{item.global_view}"</p>
          <div className="flex items-center justify-between">
            <span className="text-[22px] font-bold" style={{ color: 'rgba(150,190,255,0.78)', letterSpacing: '-0.03em', lineHeight: 1 }}>{glbPct}%</span>
            <MomentumTag pts={glbMom} />
          </div>
          <StrengthBar pct={glbPct} color="rgba(150,190,255,0.55)" delay={0.1 + 0.06 * index} />
          <MiniSparkline data={glbSpark} color="rgba(150,190,255,0.72)" delay={0.4 + 0.06 * index} />
          {glbView && <p className="text-[11px] leading-relaxed pt-1" style={{ color: 'rgba(255,255,255,0.48)', fontStyle: 'italic' }}>View: "{glbView}"</p>}
          {glbFlip && (
            <div className="pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: 'rgba(255,255,255,0.26)', letterSpacing: '0.06em' }}>What flips it</p>
              <div className="flex items-start gap-2 text-[11px]" style={{ color: 'rgba(255,255,255,0.55)' }}>
                <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'rgba(150,190,255,0.48)' }} />
                {glbFlip}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ─── ChangingCard ─────────────────────────────────────────────────────────────

const ChangingCard = ({ item, index }) => {
  const pts = item.momentum_pts ?? item.momentum ?? 0;
  const rising = (typeof pts === 'number' ? pts : parseFloat(pts) || 0) >= 0;
  const accentColor = rising ? 'rgba(255,190,80,0.88)' : 'rgba(255,106,122,0.88)';
  const bgColor = rising ? 'rgba(255,190,80,0.07)' : 'rgba(255,106,122,0.07)';
  const borderColor = rising ? 'rgba(255,190,80,0.16)' : 'rgba(255,106,122,0.16)';
  const whyChanged = item.why_changed || item.drivers || [];
  const watchNext = item.watch_next || item.what_to_watch || null;
  const sources = item.sources_count ?? item.sources ?? 0;
  const sparkData = item.sparkline || (rising ? [40, 44, 48, 52, 57, 62, 67] : [67, 62, 57, 52, 48, 44, 40]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.06 * index, duration: 0.38, ease: HORIZON_EASE }}
    >
      <HoverCard
        glowColor={rising ? 'rgba(255,190,80,0.10)' : 'rgba(255,106,122,0.10)'}
        subsurface={rising ? 'rgba(255,190,80,0.018)' : 'rgba(255,106,122,0.018)'}
        style={{
          borderRadius: '16px',
          background: 'linear-gradient(160deg, rgba(18,22,38,0.92) 0%, rgba(13,16,28,0.96) 60%, rgba(16,19,34,0.94) 100%)',
          border: `1px solid ${borderColor}`,
          padding: '20px 22px'
        }}
      >
        <div className="relative z-10 space-y-3.5">
          <div className="flex items-start justify-between gap-3">
            <p className="text-[14px] font-semibold leading-snug flex-1" style={{ color: 'rgba(255,255,255,0.94)', letterSpacing: '-0.015em' }}>
              {item.claim || item.title || item.narrative}
            </p>
            <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ background: bgColor, border: `1px solid ${borderColor}`, color: accentColor }}>
                {rising ? '↑ Rising' : '↓ Falling'}
              </span>
              <MomentumTag pts={pts} />
            </div>
          </div>
          <MiniSparkline data={sparkData} color={accentColor} delay={0.3 + 0.06 * index} />
          {whyChanged.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.30)', letterSpacing: '0.07em' }}>Why it changed</p>
              <ul className="space-y-1.5">
                {(Array.isArray(whyChanged) ? whyChanged : [whyChanged]).slice(0, 2).map((w, i) => (
                  <li key={i} className="flex items-start gap-2 text-[12px]" style={{ color: 'rgba(255,255,255,0.68)' }}>
                    <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: accentColor }} />
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {watchNext && (
            <div className="pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.26)', letterSpacing: '0.07em' }}>What to watch next</p>
              <div className="flex items-start gap-2 text-[12px]" style={{ color: 'rgba(255,255,255,0.60)' }}>
                <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'rgba(255,255,255,0.32)' }} />
                {watchNext}
              </div>
            </div>
          )}
          <div className="flex items-center gap-2 pt-1">
            {sources > 0 && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.38)', border: '1px solid rgba(255,255,255,0.07)' }}>
                {sources} sources
              </span>
            )}
            {item.updated && (
              <span className="text-[10px] flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.26)' }}>
                <Clock className="w-3 h-3" />
                {item.updated}
              </span>
            )}
          </div>
        </div>
      </HoverCard>
    </motion.div>
  );
};

// ─── Premium empty state ──────────────────────────────────────────────────────

const EmptyState = ({ label }) => (
  <div className="relative flex flex-col items-center justify-center py-16 text-center rounded-[20px]" style={{
    background: 'linear-gradient(160deg, rgba(255,255,255,0.040) 0%, rgba(255,255,255,0.018) 55%, rgba(255,255,255,0.028) 100%)',
    backdropFilter: 'blur(40px) saturate(160%)',
    WebkitBackdropFilter: 'blur(40px) saturate(160%)',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.10), inset 0 -1px 0 rgba(0,0,0,0.10), 0 6px 24px rgba(0,0,0,0.16)'
  }}>
    <SpecularLine opacity={0.08} />
    {/* Pulsing system-active dot */}
    <div className="relative mb-5">
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5], scale: [0.9, 1.1, 0.9] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="w-2 h-2 rounded-full mx-auto"
        style={{ background: 'rgba(255,255,255,0.30)', boxShadow: '0 0 8px rgba(255,255,255,0.18)' }}
      />
      <motion.div
        animate={{ opacity: [0.15, 0, 0.15], scale: [1, 2.2, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 w-2 h-2 rounded-full mx-auto"
        style={{ background: 'rgba(255,255,255,0.20)' }}
      />
    </div>
    <Info className="w-7 h-7 mb-3 mx-auto" strokeWidth={1.4} style={{ color: 'rgba(255,255,255,0.22)' }} />
    <p className="text-[13px]" style={{ color: 'rgba(255,255,255,0.30)' }}>No {label} data available yet.</p>
  </div>
);

// ─── Main export ─────────────────────────────────────────────────────────────

export default function NarrativeMap({ synthesis, density }) {
  const [activeTab, setActiveTab] = useState('consensus');

  if (!synthesis) return null;

  const { consensus = [], divergences = [], us_global_split = [] } = synthesis;

  const allItems = [
    ...consensus.map(i => ({ ...i, _src: 'consensus' })),
    ...divergences.map(i => ({ ...i, _src: 'divergences' })),
    ...us_global_split.map(i => ({ ...i, _src: 'us_global' })),
  ];
  const changingItems = allItems
    .filter(i => i.momentum_pts !== undefined || i.momentum !== undefined)
    .sort((a, b) => Math.abs(b.momentum_pts ?? b.momentum ?? 0) - Math.abs(a.momentum_pts ?? a.momentum ?? 0))
    .slice(0, 6);

  const activeTabDef = TABS.find(t => t.id === activeTab);

  const renderContent = () => {
    switch (activeTab) {
      case 'consensus':
        return consensus.length > 0
          ? <div className="space-y-4">{consensus.slice(0, 5).map((item, i) => <ConsensusCard key={i} item={item} index={i} />)}</div>
          : <EmptyState label="consensus" />;
      case 'divergences':
        return divergences.length > 0
          ? <div className="space-y-4">{divergences.slice(0, 4).map((item, i) => <DivergenceCard key={i} item={item} index={i} />)}</div>
          : <EmptyState label="divergence" />;
      case 'us_global':
        return us_global_split.length > 0
          ? <div className="space-y-4">{us_global_split.slice(0, 4).map((item, i) => <USGlobalCard key={i} item={item} index={i} />)}</div>
          : <EmptyState label="US vs Global" />;
      case 'changing':
        return changingItems.length > 0
          ? <div className="space-y-4">{changingItems.map((item, i) => <ChangingCard key={i} item={item} index={i} />)}</div>
          : <EmptyState label="changing narrative" />;
      default:
        return null;
    }
  };

  return (
    <motion.section
      aria-labelledby="narrative-map-heading"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: HORIZON_EASE }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6 px-1">
        <div>
          <h2 id="narrative-map-heading" className="text-[26px] font-bold" style={{ color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.028em' }}>
            Narrative Map
          </h2>
          <p className="text-[12px] mt-1.5" style={{ color: 'rgba(255,255,255,0.36)' }}>
            Connecting the macro dots.
          </p>
        </div>
        <div className="text-right mt-1 max-w-[200px]">
          <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.26)', fontStyle: 'italic' }}>
            Narratives summarize how markets are being interpreted, not guaranteed predictions.
          </p>
        </div>
      </div>

      {/* Outer container — deep slate, screenshot-matched */}
      <div className="relative rounded-[20px] overflow-hidden" style={{
        background: 'linear-gradient(160deg, rgba(14,17,30,0.98) 0%, rgba(10,13,22,1) 60%, rgba(12,15,26,0.99) 100%)',
        backdropFilter: 'blur(24px) saturate(120%)',
        WebkitBackdropFilter: 'blur(24px) saturate(120%)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.48), 0 2px 8px rgba(0,0,0,0.32)',
      }}>
        {/* Subtle top edge catch */}
        <div style={{ position: 'absolute', top: 0, left: '8%', right: '8%', height: '1px', background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.08) 60%, transparent 100%)', pointerEvents: 'none', zIndex: 3 }} />

        {/* Tab bar */}
        <div className="relative flex px-4 pt-3 pb-0 gap-1 overflow-x-auto z-10" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {TABS.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.13 }}
                className="relative flex items-center gap-2 pb-3 pt-2.5 px-3.5 flex-shrink-0"
                style={{
                  borderRadius: '0',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: isActive ? `2px solid ${tab.color}` : '2px solid transparent',
                  cursor: 'pointer',
                }}
              >
                <tab.Icon
                  className="w-3.5 h-3.5 flex-shrink-0"
                  style={{
                    color: isActive ? tab.color : 'rgba(255,255,255,0.28)',
                    strokeWidth: 2,
                    transition: 'color 0.15s ease'
                  }}
                />
                <span className="text-[13px] font-semibold whitespace-nowrap" style={{ color: isActive ? 'rgba(255,255,255,0.94)' : 'rgba(255,255,255,0.36)', letterSpacing: '-0.01em', transition: 'color 0.15s ease' }}>
                  {tab.label}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Content area */}
        <div className="p-5 pt-4 relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10, filter: 'blur(2px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -6, filter: 'blur(1px)' }}
              transition={SMOOTH}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
}