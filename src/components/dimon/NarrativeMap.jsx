import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, GitCommit, Globe, TrendingUp, TrendingDown, Minus, Zap, Info, Clock } from 'lucide-react';
import NarrativePulseCard from './NarrativePulseCard';
import NarrativeStateCard from './NarrativeStateCard';

const HORIZON_EASE = [0.26, 0.11, 0.26, 1.0];
const SPRING = { type: 'spring', stiffness: 340, damping: 38, mass: 0.9 };
const SMOOTH = { duration: 0.28, ease: [0.22, 0.61, 0.36, 1] };

// ─── Shared design tokens ────────────────────────────────────────────────────

// macOS Tahoe liquid-glass card surface — multi-layer refraction
const GLASS_CARD = {
  background: 'linear-gradient(160deg, rgba(255,255,255,0.072) 0%, rgba(255,255,255,0.034) 55%, rgba(255,255,255,0.048) 100%)',
  backdropFilter: 'blur(56px) saturate(180%) brightness(1.06)',
  WebkitBackdropFilter: 'blur(56px) saturate(180%) brightness(1.06)',
  border: '1px solid rgba(255,255,255,0.12)',
  boxShadow: [
    'inset 0 1.5px 0 rgba(255,255,255,0.14)',      // top specular
    'inset 0 -1px 0 rgba(0,0,0,0.12)',              // bottom absorption
    'inset 1px 0 0 rgba(255,255,255,0.06)',          // left edge catch
    '0 1px 0 rgba(255,255,255,0.04)',               // outer base-lift
    '0 10px 40px rgba(0,0,0,0.22)',                 // depth shadow
    '0 2px 8px rgba(0,0,0,0.14)',                   // near shadow
  ].join(', ')
};

// Crisp single specular highlight band (macOS-style top-light)
const SpecularLine = ({ opacity = 0.16 }) => (
  <div style={{
    position: 'absolute', top: 0, left: '8%', right: '8%', height: '1px',
    background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,${opacity}) 35%, rgba(255,255,255,${(opacity * 1.3).toFixed(2)}) 50%, rgba(255,255,255,${opacity}) 65%, transparent 100%)`,
    pointerEvents: 'none', zIndex: 2
  }} />
);

// Subsurface scatter (inner glow — simulates frosted glass light diffusion)
const SubsurfaceGlow = ({ color = 'rgba(255,255,255,0.03)' }) => (
  <div style={{
    position: 'absolute', inset: 0,
    background: `radial-gradient(ellipse at 50% 0%, ${color} 0%, transparent 65%)`,
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

const FLAT_SPARK = [50, 50, 50, 50, 50, 50, 50];

// ─── ConfidenceBadge + MomentumTag ───────────────────────────────────────────

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
  { id: 'consensus',   label: 'Consensus',    sub: { prefix: 'Where', rest: ' the Street agrees' },      Icon: CheckCircle, color: 'rgba(88,227,164,0.85)',  glow: 'rgba(88,227,164,0.20)'  },
  { id: 'divergences', label: 'Divergences',  sub: { prefix: 'Where', rest: ' narratives fracture' },    Icon: GitCommit,   color: 'rgba(180,120,255,0.85)', glow: 'rgba(180,120,255,0.18)' },
  { id: 'us_global',   label: 'US vs Global', sub: { prefix: 'Regional', rest: ' interpretation' },      Icon: Globe,       color: 'rgba(94,167,255,0.85)',  glow: 'rgba(94,167,255,0.18)'  },
  { id: 'changing',    label: 'Changing',     sub: { prefix: 'Narratives', rest: ' changing this week' },Icon: Zap,         color: 'rgba(255,190,80,0.85)',  glow: 'rgba(255,190,80,0.18)'  },
];

// ─── Liquid-glass hoverable card wrapper ─────────────────────────────────────

const HoverCard = ({ children, glowColor = 'rgba(255,255,255,0.06)', subsurface = 'rgba(255,255,255,0.03)', style = {}, className = '' }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      animate={{
        y: hovered ? -3 : 0,
        scale: hovered ? 1.002 : 1,
        boxShadow: hovered
          ? [
              'inset 0 1.5px 0 rgba(255,255,255,0.18)',
              'inset 0 -1px 0 rgba(0,0,0,0.14)',
              'inset 1px 0 0 rgba(255,255,255,0.08)',
              '0 1px 0 rgba(255,255,255,0.05)',
              '0 18px 52px rgba(0,0,0,0.28)',
              '0 4px 14px rgba(0,0,0,0.18)',
              `0 0 32px ${glowColor}`,
              `0 0 0 1px rgba(255,255,255,0.09)`,
            ].join(', ')
          : GLASS_CARD.boxShadow
      }}
      transition={{ duration: 0.20, ease: 'easeOut' }}
      className={`relative ${className}`}
      style={{ ...GLASS_CARD, ...style, overflow: 'hidden' }}
    >
      <SpecularLine />
      <SubsurfaceGlow color={hovered ? glowColor.replace(/[\d.]+\)$/, '0.06)') : subsurface} />
      {children}
    </motion.div>
  );
};

// ─── ConsensusCard ────────────────────────────────────────────────────────────

const ConsensusCard = ({ item, index }) => {
  // Support both legacy shape and narrative_map_v1 shape
  const pct = item.score ?? Math.round((item.confidence || 0) * 100);
  const momentum = item.change_7d ?? item.momentum_pts ?? item.momentum ?? 0;
  const drivers = item.drivers || [];
  const breakConditions = item.break_conditions || item.break_triggers || [];
  // confidence field: "HIGH"/"MODERATE"/"LOW" or legacy computed
  const rawConf = item.confidence;
  const confidence_level = (typeof rawConf === 'string' && ['HIGH','MODERATE','LOW'].includes(rawConf))
    ? rawConf.charAt(0) + rawConf.slice(1).toLowerCase()
    : (item.confidence_level || (pct >= 70 ? 'High' : pct >= 45 ? 'Medium' : 'Low'));
  const sparkData = FLAT_SPARK;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.06 * index, duration: 0.38, ease: HORIZON_EASE }}
    >
      <HoverCard glowColor="rgba(255,255,255,0.04)" subsurface="rgba(255,255,255,0.015)" style={{ borderRadius: '20px', padding: '18px' }}>
        <div className="relative z-10 space-y-3.5">
          <div className="flex items-start justify-between gap-3">
            <p className="text-[13px] font-semibold leading-[1.5] flex-1" style={{ color: 'rgba(255,255,255,0.95)' }}>
              {item.statement || item.claim || '—'}
            </p>
            <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
              <span className="text-[18px] font-bold" style={{ color: 'rgba(200,215,255,0.92)', lineHeight: 1.2 }}>{pct}%</span>
              <ConfidenceBadge level={confidence_level} />
            </div>
          </div>
          <StrengthBar pct={pct} color="rgba(140,165,220,0.72)" delay={0.1 + 0.06 * index} />
          {drivers.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>Drivers</p>
              <ul className="space-y-1.5">
                {drivers.slice(0, 2).map((d, i) => (
                  <li key={i} className="flex items-start gap-2 text-[12px] leading-[1.5]" style={{ color: 'rgba(255,255,255,0.65)' }}>
                    <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'rgba(155,180,230,0.60)' }} />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {breakConditions.length > 0 && (
            <div className="pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <p className="text-[11px] font-semibold uppercase tracking-wide mb-2" style={{ color: 'rgba(255,255,255,0.28)' }}>Could break</p>
              <ul className="space-y-1.5">
                {breakConditions.slice(0, 1).map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-[12px] leading-[1.5]" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'rgba(255,160,150,0.50)' }} />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex items-center gap-2 pt-2">
            <MiniSparkline data={sparkData} color="rgba(155,180,230,0.78)" delay={0.5 + 0.06 * index} />
            <MomentumTag pts={momentum} />
          </div>
        </div>
      </HoverCard>
    </motion.div>
  );
};

// ─── DivergenceCard ───────────────────────────────────────────────────────────

const DivergenceCard = ({ item, index }) => {
  // Support narrative_map_v1: item.dominant.statement/.score, item.counter.statement/.score
  const domPct = item.dominant?.score ?? Math.round((item.confidence || 0.62) * 100);
  const ctrPct = item.counter?.score ?? (100 - domPct);
  const domMom = item.change_7d ?? item.dominant_momentum ?? item.momentum_pts ?? 0;
  const ctrMom = item.change_7d != null ? -item.change_7d : (item.counter_momentum ?? -domMom);
  const interpretation = item.interpretation || item.summary || '';
  const resolution = item.resolution_triggers || item.break_conditions || [];
  const domSpark = FLAT_SPARK;
  const ctrSpark = FLAT_SPARK;
  // dominant statement
  const domStatement = item.dominant?.statement || item.topic || '—';
  const counterNarrative = item.counter?.statement || item.counter_narrative || (typeof item.counter === 'string' ? item.counter : null) || '—';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.06 * index, duration: 0.38, ease: HORIZON_EASE }}
    >
      <HoverCard
        glowColor="rgba(255,255,255,0.04)"
        subsurface="rgba(255,255,255,0.015)"
        style={{
          borderRadius: '20px',
          padding: '18px'
        }}
      >
        <div className="relative z-10 space-y-4">
          {/* Two-column with glow divider */}
          <div className="grid grid-cols-2 gap-0 relative">
            {/* Vertical glow divider */}
            <div style={{
              position: 'absolute', top: '8px', bottom: '8px', left: '50%', width: '1px',
              background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.08), rgba(255,255,255,0.05), transparent)',
              transform: 'translateX(-50%)', pointerEvents: 'none'
            }} />

            {/* Dominant */}
            <div className="space-y-2.5 pr-4">
             <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'rgba(160,175,210,0.55)' }}>Dominant</p>
             <p className="text-[12px] font-bold leading-[1.5]" style={{ color: 'rgba(255,255,255,0.94)' }}>{domStatement}</p>
              <span className="text-[18px] font-bold block" style={{ color: 'rgba(190,205,235,0.90)', lineHeight: 1.2 }}>{domPct}%</span>
              <StrengthBar pct={domPct} color="rgba(140,165,220,0.68)" delay={0.1 + 0.06 * index} />
              <div className="flex items-center gap-1.5 flex-wrap">
                <MiniSparkline data={domSpark} color="rgba(155,180,230,0.75)" delay={0.45 + 0.06 * index} />
                <MomentumTag pts={domMom} />
              </div>
            </div>

            {/* Counter */}
            <div className="space-y-2.5 pl-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'rgba(160,175,210,0.38)' }}>Counter</p>
              <p className="text-[12px] font-semibold leading-[1.5]" style={{ color: 'rgba(255,255,255,0.68)' }}>{counterNarrative}</p>
              <span className="text-[18px] font-bold block" style={{ color: 'rgba(175,190,225,0.62)', lineHeight: 1.2 }}>{ctrPct}%</span>
              <StrengthBar pct={ctrPct} color="rgba(130,155,195,0.38)" delay={0.1 + 0.06 * index} />
              <div className="flex items-center gap-1.5 flex-wrap">
                <MiniSparkline data={ctrSpark} color="rgba(145,170,210,0.52)" delay={0.45 + 0.06 * index} />
                <MomentumTag pts={ctrMom} />
              </div>
            </div>
          </div>

          {interpretation && (
            <div className="p-3 rounded-[12px]" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <p className="text-[11px] font-semibold uppercase tracking-wide mb-2" style={{ color: 'rgba(255,255,255,0.30)' }}>Interpretation</p>
              <p className="text-[12px] leading-[1.6]" style={{ color: 'rgba(255,255,255,0.65)' }}>"{interpretation}"</p>
            </div>
          )}

          {resolution.length > 0 && (
            <div className="pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <p className="text-[11px] font-semibold uppercase tracking-wide mb-2" style={{ color: 'rgba(255,255,255,0.28)' }}>Would resolve</p>
              <ul className="space-y-1.5">
                {resolution.slice(0, 1).map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-[12px] leading-[1.5]" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'rgba(160,180,220,0.45)' }} />
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
  // Support narrative_map_v1 shape: item.us.statement/.score, item.global.statement/.score
  const usPct = item.us?.score ?? Math.round((item.confidence || 0.71) * 100);
  const glbPct = item.global?.score ?? (100 - usPct);
  const usMom = item.change_7d ?? item.us_momentum ?? item.momentum_pts ?? 0;
  const glbMom = item.change_7d != null ? -item.change_7d : (item.global_momentum ?? -usMom);
  const usFlip = item.us_flip_trigger || item.flip_trigger || null;
  const glbFlip = item.global_flip_trigger || null;
  const usSpark = FLAT_SPARK;
  const glbSpark = FLAT_SPARK;
  // statements
  const usViewText = item.us?.statement || item.us_view || '—';
  const glbViewText = item.global?.statement || item.global_view || '—';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.06 * index, duration: 0.38, ease: HORIZON_EASE }}
      className="relative rounded-[22px] overflow-hidden"
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
        {/* US */}
        <div className="p-4 space-y-2.5">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" style={{ color: 'rgba(140,165,220,0.75)' }} strokeWidth={2} />
            <span className="text-[11px] font-bold uppercase tracking-wide" style={{ color: 'rgba(160,175,210,0.55)' }}>US Tilt</span>
          </div>
          <p className="text-[12px] font-semibold leading-[1.5]" style={{ color: 'rgba(255,255,255,0.90)' }}>"{usViewText}"</p>
          <div className="flex items-center justify-between">
            <span className="text-[18px] font-bold" style={{ color: 'rgba(190,205,235,0.88)', lineHeight: 1.2 }}>{usPct}%</span>
            <MomentumTag pts={usMom} />
          </div>
          <StrengthBar pct={usPct} color="rgba(140,165,220,0.68)" delay={0.1 + 0.06 * index} />
          <MiniSparkline data={usSpark} color="rgba(155,180,230,0.75)" delay={0.4 + 0.06 * index} />
          {usFlip && (
            <div className="pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
              <p className="text-[11px] font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'rgba(255,255,255,0.28)' }}>Flip trigger</p>
              <div className="flex items-start gap-2 text-[12px] leading-[1.5]" style={{ color: 'rgba(255,255,255,0.55)' }}>
                <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'rgba(155,180,230,0.50)' }} />
                {usFlip}
              </div>
            </div>
          )}
        </div>

        {/* Global */}
        <div className="p-4 space-y-2.5" style={{ borderLeft: '1px solid rgba(255,255,255,0.04)' }}>
          <div className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5" style={{ color: 'rgba(130,155,195,0.65)' }} strokeWidth={2} />
            <span className="text-[11px] font-bold uppercase tracking-wide" style={{ color: 'rgba(160,175,210,0.38)' }}>Global</span>
          </div>
          <p className="text-[12px] font-semibold leading-[1.5]" style={{ color: 'rgba(255,255,255,0.78)' }}>"{glbViewText}"</p>
          <div className="flex items-center justify-between">
            <span className="text-[18px] font-bold" style={{ color: 'rgba(170,190,225,0.73)', lineHeight: 1.2 }}>{glbPct}%</span>
            <MomentumTag pts={glbMom} />
          </div>
          <StrengthBar pct={glbPct} color="rgba(130,155,195,0.38)" delay={0.1 + 0.06 * index} />
          <MiniSparkline data={glbSpark} color="rgba(145,170,210,0.52)" delay={0.4 + 0.06 * index} />
          {glbFlip && (
            <div className="pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
              <p className="text-[11px] font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'rgba(255,255,255,0.28)' }}>Flip trigger</p>
              <div className="flex items-start gap-2 text-[12px] leading-[1.5]" style={{ color: 'rgba(255,255,255,0.50)' }}>
                <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'rgba(145,170,210,0.40)' }} />
                {glbFlip}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ─── NarrativeShiftCard (premium OS Horizon for Changing tab) ──────────────────

const NarrativeShiftCard = ({ item, index }) => {
  const shift = item.change_7d ?? item.shift_pts ?? item.momentum_pts ?? 0;
  // Direction: "Increasing" = green, "Weakening" = red, "Stable" = gray
  const dir = item.direction || item.momentum || 'Stable';
  const isRising = dir === 'Increasing' || shift > 0;
  const isWeakening = dir === 'Weakening' || shift < 0;
  const shiftColor = isWeakening ? 'rgba(255,106,122,0.88)' : isRising ? 'rgba(88,227,164,0.88)' : 'rgba(180,190,210,0.75)';
  const shiftBg = isWeakening ? 'rgba(255,106,122,0.10)' : isRising ? 'rgba(88,227,164,0.10)' : 'rgba(180,190,210,0.08)';
  const momentum = dir;
  // Normalize confidence: HIGH → High, MODERATE → Moderate, LOW → Low
  const rawConf = item.confidence || 'Moderate';
  const confidence = rawConf.charAt(0).toUpperCase() + rawConf.slice(1).toLowerCase();
  const interpretation = item.commentary || item.interpretation || '';
  const sparkData = FLAT_SPARK;

  // Confidence color mapping
  const confidenceMap = {
    'High': 'rgba(88,227,164,0.70)',
    'Moderate': 'rgba(255,190,80,0.70)',
    'Low': 'rgba(255,106,122,0.70)'
  };
  const confColor = confidenceMap[confidence] || confidenceMap['Moderate'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index, duration: 0.36, ease: HORIZON_EASE }}
    >
      <HoverCard glowColor="rgba(255,255,255,0.04)" subsurface="rgba(255,255,255,0.015)" style={{ borderRadius: '20px', padding: '18px' }}>
        <div className="relative z-10 space-y-2.5">
          {/* Narrative title + shift pill */}
          <div className="flex items-start justify-between gap-3">
            <p className="text-[13px] font-semibold leading-[1.5] flex-1" style={{ color: 'rgba(255,255,255,0.95)' }}>
              {item.statement || item.title || item.narrative || '—'}
            </p>
            <span className="text-[12px] font-bold px-2.5 py-1.5 rounded-full flex-shrink-0" style={{ background: shiftBg, color: shiftColor }}>
              {isRising ? '+' : ''}{shift} pts
            </span>
          </div>

          {/* Meta chips: Momentum + Confidence */}
          <div className="flex gap-2 flex-wrap">
            <span className="text-[11px] font-medium px-2 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.65)' }}>
              Momentum: <span style={{ color: 'rgba(255,255,255,0.88)' }}>{momentum}</span>
            </span>
            <span className="text-[11px] font-medium px-2 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: confColor }}>
              Confidence: <span style={{ color: confColor }}>{confidence}</span>
            </span>
          </div>

          {/* Trend sparkline */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide mb-2" style={{ color: 'rgba(255,255,255,0.33)' }}>7-day trend</p>
            <MiniSparkline data={sparkData} color={shiftColor} delay={0.25 + 0.05 * index} />
          </div>

          {/* Interpretation */}
          {interpretation && (
            <p className="text-[12px] leading-[1.5]" style={{ color: 'rgba(255,255,255,0.68)' }}>
              {interpretation}
            </p>
          )}
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

const ChangingTabContent = ({ momentumItems = [] }) => (
  <div className="space-y-4">
    {/* Header */}
    <div className="flex items-start justify-between gap-6 mb-6 px-1">
      <div>
        <h3 className="text-[18px] font-semibold" style={{ color: 'rgba(255,255,255,0.96)', letterSpacing: '-0.02em' }}>
          Narrative Momentum
        </h3>
        <p className="text-[12px] mt-1" style={{ color: 'rgba(255,255,255,0.40)' }}>
          Narratives gaining or losing traction this week
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0 mt-1">
        <motion.div
          animate={{ opacity: [0.6, 1, 0.6], scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: 'rgba(88,227,164,0.85)', boxShadow: '0 0 6px rgba(88,227,164,0.50)' }}
        />
        <span className="text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.46)' }}>
          Monitor: Active
        </span>
      </div>
    </div>

    {/* Narrative Shift Cards */}
    {momentumItems.length > 0 ? (
      <div className="space-y-3">
        {momentumItems.map((item, i) => (
          <NarrativeShiftCard key={item.id || i} item={item} index={i} />
        ))}
      </div>
    ) : (
      <div className="relative flex flex-col items-center justify-center py-12 text-center rounded-[20px]" style={{
        background: 'linear-gradient(160deg, rgba(255,255,255,0.040) 0%, rgba(255,255,255,0.018) 55%, rgba(255,255,255,0.028) 100%)',
        backdropFilter: 'blur(40px) saturate(160%)',
        WebkitBackdropFilter: 'blur(40px) saturate(160%)',
        border: '1px solid rgba(255,255,255,0.08)'
      }}>
        <div className="relative mb-4">
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5], scale: [0.9, 1.1, 0.9] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="w-2 h-2 rounded-full mx-auto"
            style={{ background: 'rgba(255,255,255,0.30)' }}
          />
        </div>
        <p className="text-[13px] font-medium" style={{ color: 'rgba(255,255,255,0.50)' }}>Narrative Monitor Active</p>
        <p className="text-[11px] mt-1.5" style={{ color: 'rgba(255,255,255,0.30)' }}>No significant narrative shifts detected this week.</p>
      </div>
    )}
  </div>
);

// ─── Main export ─────────────────────────────────────────────────────────────

export default function NarrativeMap({ synthesis, density, narrativeMap }) {
  const [activeTab, setActiveTab] = useState('consensus');

  // Use live narrativeMap if provided, otherwise fall back to legacy synthesis prop
  const hasLiveData = !!narrativeMap;

  if (!narrativeMap && !synthesis) return null;

  // Resolve data sources — ensure all are arrays
  const consensus = Array.isArray(narrativeMap?.consensus) ? narrativeMap.consensus
    : Array.isArray(synthesis?.consensus) ? synthesis.consensus : [];
  const divergences = Array.isArray(narrativeMap?.divergences) ? narrativeMap.divergences
    : Array.isArray(synthesis?.divergences) ? synthesis.divergences : [];
  // us_vs_global from narrativeMap is a single object, wrap in array for rendering
  const us_global_split = narrativeMap?.us_vs_global
    ? [narrativeMap.us_vs_global]
    : (Array.isArray(synthesis?.us_global_split) ? synthesis.us_global_split : []);
  const momentumItems = Array.isArray(narrativeMap?.momentum) ? narrativeMap.momentum : [];

  const activeTabDef = TABS.find(t => t.id === activeTab);

  const renderContent = () => {
    switch (activeTab) {
      case 'consensus':
        return consensus.length > 0
          ? <div className="space-y-4">{consensus.slice(0, 5).map((item, i) => <ConsensusCard key={item.id || i} item={item} index={i} />)}</div>
          : <EmptyState label="consensus" />;
      case 'divergences':
        return divergences.length > 0
          ? <div className="space-y-4">{divergences.slice(0, 4).map((item, i) => <DivergenceCard key={item.id || i} item={item} index={i} />)}</div>
          : <EmptyState label="divergence" />;
      case 'us_global':
        return us_global_split.length > 0
          ? <div className="space-y-4">{us_global_split.slice(0, 4).map((item, i) => <USGlobalCard key={i} item={item} index={i} />)}</div>
          : <EmptyState label="US vs Global" />;
      case 'changing':
        return <ChangingTabContent momentumItems={momentumItems} />;
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
          <h2 id="narrative-map-heading" className="text-[24px] font-bold leading-[1.3]" style={{ color: 'rgba(255,255,255,0.96)' }}>
            Narrative Map
          </h2>
          <p className="text-[13px] mt-2 leading-[1.5]" style={{ color: 'rgba(255,255,255,0.40)' }}>
            Connecting the macro dots.
          </p>
        </div>
        <div className="text-right mt-1 max-w-[200px]">
          <p className="text-[12px] leading-[1.6]" style={{ color: 'rgba(255,255,255,0.32)' }}>
            Narratives summarize how markets are being interpreted, not guaranteed predictions.
          </p>
        </div>
      </div>

      {/* Narrative State Indicator */}
      <NarrativeStateCard
        narrativeState="debated_regime"
        narrativeStateExplainer={null}
        liveData={narrativeMap?.narrative_state || null}
      />

      {/* Narrative Pulse Summary */}
      <NarrativePulseCard
        summary={null}
        isEmpty={false}
        positioningState="neutral"
        liveData={narrativeMap?.narrative_pulse || null}
      />

      {/* Outer liquid-glass container — macOS Tahoe depth model */}
      <div className="relative rounded-[28px] overflow-hidden" style={{
        // Outer shell: deep frosted panel
        background: 'linear-gradient(160deg, rgba(22,26,40,0.68) 0%, rgba(12,15,24,0.78) 60%, rgba(16,20,34,0.72) 100%)',
        backdropFilter: 'blur(64px) saturate(180%) brightness(1.04)',
        WebkitBackdropFilter: 'blur(64px) saturate(180%) brightness(1.04)',
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow: [
          'inset 0 1.5px 0 rgba(255,255,255,0.10)',           // top specular
          'inset 0 -1px 0 rgba(0,0,0,0.18)',                  // bottom absorption edge
          'inset 1px 0 0 rgba(255,255,255,0.05)',              // left edge
          'inset -1px 0 0 rgba(255,255,255,0.03)',             // right edge
          '0 12px 48px rgba(0,0,0,0.36)',                      // deep drop shadow
          '0 4px 16px rgba(0,0,0,0.22)',                       // near shadow
          `0 0 80px rgba(${activeTabDef?.glow?.match(/[\d.]+/g)?.slice(0,3).join(',') || '255,255,255'},0.06)`, // ambient tab glow
        ].join(', ')
      }}>
        {/* Liquid-glass top specular band — macOS-style catch-light */}
        <div style={{ position: 'absolute', top: 0, left: '8%', right: '8%', height: '1px', background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 30%, rgba(255,255,255,0.16) 50%, rgba(255,255,255,0.12) 70%, transparent 100%)', pointerEvents: 'none', zIndex: 3 }} />
        {/* Subsurface scatter — tab-reactive ambient glow */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '120px', background: `radial-gradient(ellipse at 50% -10%, ${activeTabDef?.glow || 'rgba(255,255,255,0.04)'} 0%, transparent 70%)`, pointerEvents: 'none', zIndex: 0, transition: 'background 0.5s ease' }} />
        {/* Bottom edge absorption */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40px', background: 'linear-gradient(0deg, rgba(0,0,0,0.12) 0%, transparent 100%)', pointerEvents: 'none', zIndex: 0 }} />

        {/* Tab bar — liquid-glass signal mode switcher */}
        <div className="relative flex px-4 pt-4 pb-0 gap-0.5 overflow-x-auto z-10" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          {TABS.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={!isActive ? { background: 'rgba(255,255,255,0.04)' } : {}}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="relative flex flex-col items-start pb-3.5 pt-3 px-4 flex-shrink-0"
                style={{
                  borderRadius: '14px 14px 0 0',
                  background: isActive
                    ? 'linear-gradient(180deg, rgba(255,255,255,0.082) 0%, rgba(255,255,255,0.040) 100%)'
                    : 'transparent',
                  border: isActive ? '1px solid rgba(255,255,255,0.10)' : '1px solid transparent',
                  borderBottom: '1px solid transparent',
                  minWidth: '88px',
                  cursor: 'pointer',
                  boxShadow: isActive
                    ? 'inset 0 1px 0 rgba(255,255,255,0.12), inset 1px 0 0 rgba(255,255,255,0.05), inset -1px 0 0 rgba(255,255,255,0.04)'
                    : 'none',
                }}
              >
                {/* Active: subsurface glow behind label */}
                {isActive && (
                  <div style={{
                    position: 'absolute', inset: 0, borderRadius: '14px 14px 0 0',
                    background: `radial-gradient(ellipse at 50% -20%, ${tab.glow} 0%, transparent 65%)`,
                    pointerEvents: 'none'
                  }} />
                )}
                <div className="flex items-center gap-1.5 mb-0.5 relative z-10">
                  <tab.Icon
                    className="w-3.5 h-3.5 flex-shrink-0"
                    style={{
                      color: isActive ? tab.color : 'rgba(255,255,255,0.30)',
                      filter: isActive ? `drop-shadow(0 0 6px ${tab.glow}) brightness(1.1)` : 'none',
                      strokeWidth: isActive ? 2.2 : 1.8,
                      transition: 'all 0.2s ease'
                    }}
                  />
                  <span className="text-[13px] font-semibold whitespace-nowrap" style={{ color: isActive ? 'rgba(255,255,255,0.96)' : 'rgba(255,255,255,0.42)', transition: 'color 0.2s ease' }}>
                    {tab.label}
                  </span>
                  </div>
                  <span className="text-[11px] relative z-10 leading-[1.3]" style={{ color: isActive ? 'rgba(255,255,255,0.40)' : 'rgba(255,255,255,0.25)', transition: 'color 0.2s ease' }}>
                    <span style={{ fontWeight: 600, color: isActive ? 'rgba(255,255,255,0.52)' : 'rgba(255,255,255,0.35)' }}>{tab.sub.prefix}</span>{tab.sub.rest}
                  </span>
                {/* Glowing underline — liquid light edge */}
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-2 right-2"
                    style={{ height: '2px', borderRadius: '2px 2px 0 0' }}
                    transition={{ type: 'spring', stiffness: 380, damping: 36 }}
                  >
                    <div style={{
                      width: '100%', height: '100%', borderRadius: '2px 2px 0 0',
                      background: `linear-gradient(90deg, transparent 0%, ${tab.color} 30%, ${tab.color} 70%, transparent 100%)`,
                      boxShadow: `0 0 10px ${tab.glow}, 0 0 4px ${tab.color}`
                    }} />
                  </motion.div>
                )}
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