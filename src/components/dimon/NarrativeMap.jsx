import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, GitCommit, Globe, TrendingUp, TrendingDown, Minus, Zap, Info, Clock } from 'lucide-react';
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

const MiniSparkline = ({ data, color, delay = 0 }) => {
  // Hide if no data, empty, or all zeros
  if (!data || data.length === 0 || data.every(v => v === 0)) return null;
  data = data;
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

// ─── ConfidenceBadge + MomentumTag ─────────────────────────────────────────

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
  if (!n) return null;
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

// ─── Consensus Ring ───────────────────────────────────────────────────────────

const RING_CONFIG = {
  high:       { color: '#4fa67a', gradEnd: '#6ccf9f', label: 'High',       badgeColor: '#5db88a', opacity: 0.90 },
  moderate:   { color: '#d4a24c', gradEnd: '#f0c57a', label: 'Moderate',   badgeColor: '#dba95a', opacity: 0.90 },
  weak:       { color: '#8a94a6', gradEnd: '#a8b0be', label: 'Weak',       badgeColor: '#8a94a6', opacity: 0.90 },
  fragmented: { color: '#c86b6b', gradEnd: '#d98888', label: 'Fragmented', badgeColor: '#c86b6b', opacity: 0.90 },
};

const getRingConfig = (pct) => {
  if (pct >= 80) return RING_CONFIG.high;
  if (pct >= 65) return RING_CONFIG.moderate;
  if (pct >= 50) return RING_CONFIG.weak;
  return RING_CONFIG.fragmented;
};

// Keep legacy helpers for any other code that might reference them
const getRingColor = (pct) => getRingConfig(pct).color;
const getRingBadge = (pct) => ({ label: getRingConfig(pct).label, color: getRingConfig(pct).badgeColor });

const getShortLabel = (item) => {
  const stmt = item.statement || item.claim || item.title || '';
  // Try to extract a short keyword from the statement
  const words = stmt.split(' ');
  if (words.length <= 2) return stmt;
  // Return first meaningful 1-2 words (skip articles)
  const skip = new Set(['the', 'a', 'an', 'is', 'are', 'was', 'were', 'that', 'this', 'for', 'and', 'or']);
  const meaningful = words.filter(w => !skip.has(w.toLowerCase())).slice(0, 2);
  return meaningful.join(' ') || words.slice(0, 2).join(' ');
};

const ConsensusRing = ({ item, index, isSelected, onSelect }) => {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const pct = item.score ?? (typeof item.confidence === 'number' && item.confidence > 0 ? Math.round(item.confidence * 100) : 65);
  const cfg = getRingConfig(pct);
  const SIZE = 132;
  const STROKE = 10;
  const RADIUS = (SIZE - STROKE) / 2;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const shortLabel = getShortLabel(item).slice(0, 16);
  const gradId = `ring-grad-${index}`;

  const bloomOpacity = hovered ? 0.22 : 0.14;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.07 * index, duration: 0.36, ease: HORIZON_EASE }}
      onClick={() => onSelect(index)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      className="flex flex-col items-center select-none"
      style={{ cursor: 'pointer', gap: '0px' }}
    >
      {/* Ring + bloom wrapper */}
      <motion.div
        animate={{ scale: pressed ? 0.985 : hovered ? 1.04 : 1 }}
        transition={{ duration: pressed ? 0.08 : 0.18, ease: 'easeOut' }}
        style={{
          position: 'relative', width: SIZE, height: SIZE,
          // Outer bloom glow
          filter: `drop-shadow(0 0 26px ${cfg.color}${Math.round(bloomOpacity * 255).toString(16).padStart(2,'0')})`,
          transition: 'filter 0.18s ease',
        }}
      >
        <svg width={SIZE} height={SIZE} style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}>
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={cfg.color} />
              <stop offset="100%" stopColor={cfg.gradEnd} />
            </linearGradient>
          </defs>
          {/* Track */}
          <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={STROKE} />
          {/* Animated gradient fill */}
          <motion.circle
            cx={SIZE / 2} cy={SIZE / 2} r={RADIUS}
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            initial={{ strokeDashoffset: CIRCUMFERENCE }}
            animate={{ strokeDashoffset: CIRCUMFERENCE - (pct / 100) * CIRCUMFERENCE }}
            transition={{ duration: 0.8, delay: 0.07 * index, ease: 'easeOut' }}
            opacity={cfg.opacity ?? 0.90}
          />
        </svg>

        {/* Center text */}
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{
            fontSize: '34px', fontWeight: 650, letterSpacing: '-0.02em',
            color: 'rgba(255,255,255,0.92)', lineHeight: 1,
          }}>
            {pct}%
          </span>
          <span style={{
            fontSize: '12px', fontWeight: 500, letterSpacing: '0.02em',
            opacity: 0.62, color: 'rgba(255,255,255,0.85)',
            textAlign: 'center', maxWidth: '88px',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            marginTop: '5px',
          }}>
            {shortLabel}
          </span>
        </div>
      </motion.div>

      {/* Badge — 16px below ring */}
      <div style={{ marginTop: '16px' }}>
        <span style={{
          display: 'inline-block',
          fontSize: '12px', fontWeight: 600, letterSpacing: '0.02em',
          padding: '8px 14px', borderRadius: '999px',
          background: 'rgba(20,24,32,0.55)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          color: cfg.badgeColor + 'CC',
        }}>
          {cfg.label}
        </span>
      </div>
    </motion.div>
  );
};

// ─── Consensus detail drawer ──────────────────────────────────────────────────

const ConsensusDetailDrawer = ({ item }) => {
  if (!item) return null;
  const pct = item.score ?? (typeof item.confidence === 'number' && item.confidence > 0 ? Math.round(item.confidence * 100) : 65);
  const rawConf = item.confidence;
  const confidence_level = (typeof rawConf === 'string' && ['HIGH','MODERATE','LOW'].includes(rawConf))
    ? rawConf.charAt(0) + rawConf.slice(1).toLowerCase()
    : (item.confidence_level || (pct >= 70 ? 'High' : pct >= 45 ? 'Medium' : 'Low'));
  const cfg = getRingConfig(pct);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden"
    >
      <div style={{
        marginTop: '26px',
        padding: '22px 24px',
        borderRadius: '22px',
        background: 'rgba(14,18,26,0.62)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(22px)',
        WebkitBackdropFilter: 'blur(22px)',
      }}>
        {/* Quote */}
        <p style={{ fontSize: '16px', lineHeight: 1.6, color: 'rgba(255,255,255,0.86)', fontWeight: 500 }}>
          <span style={{ opacity: 0.45, fontWeight: 400 }}>"</span>
          {item.statement || item.claim || '—'}
          <span style={{ opacity: 0.45, fontWeight: 400 }}>"</span>
        </p>

        {/* Street Consensus row */}
        <div className="flex items-center gap-3" style={{ marginTop: '12px' }}>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>Street Consensus</span>
          <span style={{
            display: 'inline-block',
            fontSize: '12px', fontWeight: 600,
            padding: '5px 12px', borderRadius: '999px',
            background: 'rgba(20,24,32,0.55)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            color: cfg.badgeColor + 'CC',
          }}>
            {cfg.label}
          </span>
        </div>

        {/* Key Drivers */}
        {(item.drivers || []).length > 0 && (
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.28)', marginBottom: '8px' }}>Key Drivers</p>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {item.drivers.slice(0, 2).map((d, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: 'rgba(255,255,255,0.62)', lineHeight: 1.5 }}>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: cfg.color + '88', flexShrink: 0, marginTop: '7px' }} />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ─── Consensus Ring Grid ──────────────────────────────────────────────────────

const ConsensusRingGrid = ({ consensus }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const handleSelect = (i) => setSelectedIndex(prev => prev === i ? null : i);
  const selectedItem = selectedIndex !== null ? consensus[selectedIndex] : null;

  return (
    <div>
      {/* Rings Rail — true centered layout */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 'clamp(44px, 5vw, 84px)',
        paddingTop: '44px',
        paddingBottom: '26px',
        paddingLeft: '16px',
        paddingRight: '16px',
      }}>
        {consensus.slice(0, 6).map((item, i) => (
          <ConsensusRing
            key={item.id || i}
            item={item}
            index={i}
            isSelected={selectedIndex === i}
            onSelect={handleSelect}
          />
        ))}
      </div>
      <AnimatePresence mode="wait">
        {selectedItem && <ConsensusDetailDrawer key={selectedIndex} item={selectedItem} />}
      </AnimatePresence>
    </div>
  );
};

// ─── Shared bar primitive ────────────────────────────────────────────────────

const NarrativeBar = ({ pct, color, height = 8, delay = 0 }) => (
  <div style={{
    height, borderRadius: '999px', width: '100%',
    background: 'rgba(255,255,255,0.12)', overflow: 'hidden', position: 'relative'
  }}>
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${pct}%` }}
      transition={{ duration: 0.85, delay, ease: 'easeOut' }}
      style={{ height: '100%', borderRadius: '999px', background: color }}
    />
  </div>
);

// ─── DivergenceCard ───────────────────────────────────────────────────────────

const DivergenceCard = ({ item, index }) => {
  const domPct = item.dominant?.score ?? Math.round((item.confidence || 0.62) * 100);
  const ctrPct = item.counter?.score ?? (100 - domPct);
  const interpretation = item.interpretation || item.summary || '';
  const resolution = item.resolution_triggers || item.break_conditions || [];
  const domStatement = item.dominant?.statement || item.topic || '—';
  const counterNarrative = item.counter?.statement || item.counter_narrative || (typeof item.counter === 'string' ? item.counter : null) || '—';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.06 * index, duration: 0.36, ease: HORIZON_EASE }}
    >
      {/* Dominant */}
      <div style={{ opacity: 1 }}>
        <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: 'rgba(255,255,255,0.30)', marginBottom: '8px' }}>Dominant</p>
        <p style={{ fontSize: '16px', fontWeight: 550, lineHeight: 1.6, color: 'rgba(255,255,255,0.92)', marginBottom: '12px' }}>{domStatement}</p>
        <p style={{ fontSize: '28px', fontWeight: 600, color: 'rgba(255,255,255,0.88)', lineHeight: 1, marginBottom: '10px' }}>{domPct}%</p>
        <NarrativeBar pct={domPct} color="rgba(255,255,255,0.88)" delay={0.08 + 0.06 * index} />
      </div>

      {/* Horizontal divider */}
      <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '28px 0' }} />

      {/* Counter */}
      <div style={{ opacity: 0.80 }}>
        <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: 'rgba(255,255,255,0.25)', marginBottom: '8px' }}>Counter</p>
        <p style={{ fontSize: '16px', fontWeight: 550, lineHeight: 1.6, color: 'rgba(255,255,255,0.72)', marginBottom: '12px' }}>{counterNarrative}</p>
        <p style={{ fontSize: '28px', fontWeight: 600, color: 'rgba(255,255,255,0.62)', lineHeight: 1, marginBottom: '10px' }}>{ctrPct}%</p>
        <NarrativeBar pct={ctrPct} color="rgba(255,255,255,0.42)" delay={0.14 + 0.06 * index} />
      </div>

      {/* Interpretation */}
      {interpretation && (
        <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'rgba(255,255,255,0.42)', marginTop: '16px', fontStyle: 'italic' }}>{interpretation}</p>
      )}

      {/* Resolution trigger */}
      {resolution.length > 0 && (
        <div style={{ marginTop: '12px' }}>
          <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.22)', marginBottom: '5px' }}>Would resolve if</p>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>{resolution[0]}</p>
        </div>
      )}
    </motion.div>
  );
};

// ─── USGlobalCard ─────────────────────────────────────────────────────────────

const USGlobalCard = ({ item, index }) => {
  const usPct = item.us?.score ?? Math.round((item.confidence || 0.71) * 100);
  const glbPct = item.global?.score ?? (100 - usPct);
  const usFlip = item.us_flip_trigger || item.flip_trigger || null;
  const glbFlip = item.global_flip_trigger || null;
  const usViewText = item.us?.statement || item.us_view || '—';
  const glbViewText = item.global?.statement || item.global_view || '—';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.06 * index, duration: 0.36, ease: HORIZON_EASE }}
    >
      {/* US */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
          <TrendingUp className="w-3.5 h-3.5" style={{ color: '#3b82f6', opacity: 0.75 }} strokeWidth={2} />
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: 'rgba(59,130,246,0.60)' }}>US Tilt</span>
        </div>
        <p style={{ fontSize: '16px', fontWeight: 550, lineHeight: 1.6, color: 'rgba(255,255,255,0.90)', marginBottom: '12px' }}>{usViewText}</p>
        <p style={{ fontSize: '28px', fontWeight: 600, color: 'rgba(59,130,246,0.88)', lineHeight: 1, marginBottom: '10px' }}>{usPct}%</p>
        <NarrativeBar pct={usPct} color="rgba(59,130,246,0.75)" delay={0.08 + 0.06 * index} />
        {usFlip && <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.40)', marginTop: '10px', lineHeight: 1.5 }}>{usFlip}</p>}
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '28px 0' }} />

      {/* Global */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
          <Globe className="w-3.5 h-3.5" style={{ color: '#9ca3af', opacity: 0.75 }} strokeWidth={2} />
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: 'rgba(156,163,175,0.52)' }}>Global</span>
        </div>
        <p style={{ fontSize: '16px', fontWeight: 550, lineHeight: 1.6, color: 'rgba(255,255,255,0.75)', marginBottom: '12px' }}>{glbViewText}</p>
        <p style={{ fontSize: '28px', fontWeight: 600, color: 'rgba(156,163,175,0.82)', lineHeight: 1, marginBottom: '10px' }}>{glbPct}%</p>
        <NarrativeBar pct={glbPct} color="rgba(156,163,175,0.60)" delay={0.14 + 0.06 * index} />
        {glbFlip && <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.36)', marginTop: '10px', lineHeight: 1.5 }}>{glbFlip}</p>}
      </div>
    </motion.div>
  );
};

// ─── NarrativeShiftCard ──────────────────────────────────────────────────────

const NarrativeShiftCard = ({ item, index }) => {
  const shift = item.change_7d ?? item.shift_pts ?? item.momentum_pts ?? 0;
  const dir = item.direction || item.momentum || 'Stable';
  const isRising = dir === 'Increasing' || shift > 0;
  const isWeakening = dir === 'Weakening' || shift < 0;
  const momentumColor = isWeakening ? '#c86b6b' : isRising ? '#4fa67a' : '#8a94a6';
  const MomIcon = isWeakening ? TrendingDown : isRising ? TrendingUp : Minus;
  const rawConf = item.confidence || 'Moderate';
  const confidence = rawConf.charAt(0).toUpperCase() + rawConf.slice(1).toLowerCase();
  const interpretation = item.commentary || item.interpretation || '';
  const confidenceColor = { High: 'rgba(79,166,122,0.80)', Moderate: 'rgba(212,162,76,0.80)', Low: 'rgba(200,107,107,0.80)' }[confidence] || 'rgba(212,162,76,0.80)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index, duration: 0.36, ease: HORIZON_EASE }}
    >
      {/* Title */}
      <p style={{ fontSize: '16px', fontWeight: 550, lineHeight: 1.6, color: 'rgba(255,255,255,0.92)', marginBottom: '8px' }}>
        {item.statement || item.title || item.narrative || '—'}
      </p>

      {/* Badge row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: '5px',
          fontSize: '12px', fontWeight: 600,
          padding: '7px 13px', borderRadius: '999px',
          background: 'rgba(20,24,32,0.55)',
          border: '1px solid rgba(255,255,255,0.08)',
          color: momentumColor,
        }}>
          <MomIcon style={{ width: '13px', height: '13px' }} strokeWidth={2.5} />
          {dir}
        </span>
        <span style={{
          fontSize: '12px', fontWeight: 600,
          padding: '7px 13px', borderRadius: '999px',
          background: 'rgba(20,24,32,0.55)',
          border: '1px solid rgba(255,255,255,0.08)',
          color: confidenceColor,
        }}>
          {confidence}
        </span>
      </div>

      {/* Description */}
      {interpretation && (
        <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'rgba(255,255,255,0.48)', marginTop: '12px' }}>
          {interpretation}
        </p>
      )}
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
  const tabIds = TABS.map(t => t.id);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        setActiveTab(prev => {
          const i = tabIds.indexOf(prev);
          return tabIds[(i + 1) % tabIds.length];
        });
      } else if (e.key === 'ArrowLeft') {
        setActiveTab(prev => {
          const i = tabIds.indexOf(prev);
          return tabIds[(i - 1 + tabIds.length) % tabIds.length];
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
          ? <ConsensusRingGrid consensus={consensus} />
          : <EmptyState label="consensus" />;
      case 'divergences':
        return divergences.length > 0
          ? <div>{divergences.slice(0, 4).map((item, i) => (
              <div key={item.id || i}>
                <DivergenceCard item={item} index={i} />
                {i < divergences.slice(0, 4).length - 1 && (
                  <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '28px 0' }} />
                )}
              </div>
            ))}</div>
          : <EmptyState label="divergence" />;
      case 'us_global':
        return us_global_split.length > 0
          ? <div>{us_global_split.slice(0, 4).map((item, i) => (
              <div key={i}>
                <USGlobalCard item={item} index={i} />
                {i < us_global_split.slice(0, 4).length - 1 && (
                  <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '28px 0' }} />
                )}
              </div>
            ))}</div>
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