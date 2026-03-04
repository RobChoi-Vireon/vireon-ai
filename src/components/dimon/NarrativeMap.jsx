import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, GitCommit, Globe, TrendingUp, TrendingDown, Minus, Zap, Info, Clock } from 'lucide-react';

const HORIZON_EASE = [0.26, 0.11, 0.26, 1.0];
const SMOOTH = { duration: 0.32, ease: [0.22, 0.61, 0.36, 1] };

// ─── Shared primitives ───────────────────────────────────────────────────────

const GLASS = {
  background: 'linear-gradient(180deg, rgba(255,255,255,0.048) 0%, rgba(255,255,255,0.028) 100%)',
  backdropFilter: 'blur(40px) saturate(168%)',
  WebkitBackdropFilter: 'blur(40px) saturate(168%)',
  border: '1px solid rgba(255,255,255,0.09)',
  boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.08), 0 6px 28px rgba(0,0,0,0.14)',
};

const SpecularLine = ({ opacity = 0.13 }) => (
  <div style={{
    position: 'absolute', top: 0, left: '12%', right: '12%', height: '1.5px',
    background: `linear-gradient(90deg, transparent, rgba(255,255,255,${opacity}), transparent)`,
    pointerEvents: 'none', zIndex: 1
  }} />
);

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

const StrengthBar = ({ pct, color, delay = 0 }) => (
  <div style={{ height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden', width: '100%' }}>
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${pct}%` }}
      transition={{ duration: 0.7, delay, ease: HORIZON_EASE }}
      style={{ height: '100%', borderRadius: '2px', background: `linear-gradient(90deg, ${color}, ${color.replace(/[\d.]+\)$/, '0.55)')})`, boxShadow: `0 0 6px ${color.replace(/[\d.]+\)$/, '0.35)')}` }}
    />
  </div>
);

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

// ─── Tab nav ─────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'consensus',   label: 'Consensus',     sub: 'Where the Street agrees',      Icon: CheckCircle, color: 'rgba(88,227,164,0.85)' },
  { id: 'divergences', label: 'Divergences',   sub: 'Where narratives fracture',     Icon: GitCommit,   color: 'rgba(180,120,255,0.85)' },
  { id: 'us_global',   label: 'US vs Global',  sub: 'Regional interpretation',       Icon: Globe,       color: 'rgba(94,167,255,0.85)'  },
  { id: 'changing',    label: 'Changing',      sub: 'Narratives changing this week', Icon: Zap,         color: 'rgba(255,190,80,0.85)'  },
];

// ─── Consensus Card ──────────────────────────────────────────────────────────

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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.06 * index, duration: 0.35, ease: HORIZON_EASE }}
      className="relative rounded-[18px] p-4"
      style={{ ...GLASS, overflow: 'visible' }}
    >
      <SpecularLine />
      <div className="relative z-10 space-y-3">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <p className="text-[14px] font-semibold leading-snug flex-1" style={{ color: 'rgba(255,255,255,0.94)', letterSpacing: '-0.01em' }}>
            {item.claim}
          </p>
          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            <span className="text-[22px] font-bold" style={{ color: 'rgba(88,227,164,0.92)', letterSpacing: '-0.03em', lineHeight: 1 }}>{pct}%</span>
            <ConfidenceBadge level={confidence_level} />
          </div>
        </div>

        {/* Strength bar */}
        <StrengthBar pct={pct} color="rgba(88,227,164,0.75)" delay={0.1 + 0.06 * index} />

        {/* Drivers */}
        {drivers.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: 'rgba(255,255,255,0.35)', letterSpacing: '0.07em' }}>Drivers</p>
            <ul className="space-y-1">
              {drivers.slice(0, 3).map((d, i) => (
                <li key={i} className="flex items-start gap-1.5 text-[12px]" style={{ color: 'rgba(255,255,255,0.68)' }}>
                  <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'rgba(88,227,164,0.60)' }} />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Break conditions */}
        {breakConditions.length > 0 && (
          <div className="pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: 'rgba(255,106,122,0.55)', letterSpacing: '0.07em' }}>What could break this</p>
            <ul className="space-y-1">
              {breakConditions.slice(0, 2).map((b, i) => (
                <li key={i} className="flex items-start gap-1.5 text-[12px]" style={{ color: 'rgba(255,255,255,0.60)' }}>
                  <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'rgba(255,106,122,0.55)' }} />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex items-center gap-3">
            <MiniSparkline data={sparkData} color="rgba(88,227,164,0.80)" delay={0.5 + 0.06 * index} />
            <MomentumTag pts={momentum} />
          </div>
          <div className="flex items-center gap-2">
            {sources > 0 && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.45)' }}>
                {sources} sources
              </span>
            )}
            <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.30)' }}>7d trend</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Divergence Card ─────────────────────────────────────────────────────────

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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.06 * index, duration: 0.35, ease: HORIZON_EASE }}
      className="relative rounded-[18px] p-4"
      style={{
        background: 'linear-gradient(180deg, rgba(147,51,234,0.06) 0%, rgba(120,40,200,0.08) 100%)',
        backdropFilter: 'blur(40px) saturate(168%)', WebkitBackdropFilter: 'blur(40px) saturate(168%)',
        border: '1px solid rgba(180,120,255,0.13)',
        boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.07), 0 6px 24px rgba(0,0,0,0.14)',
        overflow: 'visible'
      }}
    >
      <SpecularLine opacity={0.10} />
      <div className="relative z-10 space-y-3">
        {/* Two-column header */}
        <div className="grid grid-cols-2 gap-3">
          {/* Dominant */}
          <div className="space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'rgba(180,120,255,0.70)', letterSpacing: '0.06em' }}>Dominant</p>
            <p className="text-[13px] font-semibold leading-snug" style={{ color: 'rgba(255,255,255,0.92)' }}>{item.topic}</p>
            <div className="flex items-center gap-2">
              <span className="text-[18px] font-bold" style={{ color: 'rgba(180,120,255,0.90)', letterSpacing: '-0.02em', lineHeight: 1 }}>{domPct}%</span>
            </div>
            <StrengthBar pct={domPct} color="rgba(180,120,255,0.75)" delay={0.1 + 0.06 * index} />
            <div className="flex items-center gap-2">
              <MiniSparkline data={domSpark} color="rgba(180,120,255,0.80)" delay={0.45 + 0.06 * index} />
              <MomentumTag pts={domMom} />
            </div>
          </div>
          {/* Counter */}
          <div className="space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'rgba(200,160,255,0.60)', letterSpacing: '0.06em' }}>Counter</p>
            <p className="text-[13px] font-semibold leading-snug" style={{ color: 'rgba(255,255,255,0.80)' }}>{counterNarrative}</p>
            <div className="flex items-center gap-2">
              <span className="text-[18px] font-bold" style={{ color: 'rgba(200,160,255,0.80)', letterSpacing: '-0.02em', lineHeight: 1 }}>{ctrPct}%</span>
            </div>
            <StrengthBar pct={ctrPct} color="rgba(200,160,255,0.60)" delay={0.1 + 0.06 * index} />
            <div className="flex items-center gap-2">
              <MiniSparkline data={ctrSpark} color="rgba(200,160,255,0.70)" delay={0.45 + 0.06 * index} />
              <MomentumTag pts={ctrMom} />
            </div>
          </div>
        </div>

        {/* Interpretation */}
        {interpretation && (
          <div className="p-3 rounded-[12px]" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-[11px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: 'rgba(255,255,255,0.32)', letterSpacing: '0.07em' }}>Interpretation</p>
            <p className="text-[12px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>"{interpretation}"</p>
          </div>
        )}

        {/* Resolution triggers */}
        {resolution.length > 0 && (
          <div className="pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: 'rgba(255,255,255,0.30)', letterSpacing: '0.07em' }}>What would resolve this</p>
            <ul className="space-y-1">
              {resolution.slice(0, 2).map((r, i) => (
                <li key={i} className="flex items-start gap-1.5 text-[12px]" style={{ color: 'rgba(255,255,255,0.62)' }}>
                  <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'rgba(200,160,255,0.55)' }} />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ─── US vs Global Card ───────────────────────────────────────────────────────

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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.06 * index, duration: 0.35, ease: HORIZON_EASE }}
      className="relative rounded-[18px] overflow-hidden"
      style={{ ...GLASS }}
    >
      <SpecularLine />
      <div className="grid grid-cols-2 divide-x relative z-10" style={{ divideColor: 'rgba(255,255,255,0.05)' }}>
        {/* US */}
        <div className="p-4 space-y-2.5">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" style={{ color: 'rgba(94,167,255,0.80)' }} strokeWidth={2} />
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'rgba(94,167,255,0.75)', letterSpacing: '0.06em' }}>US Tilt</span>
          </div>
          <p className="text-[13px] font-semibold leading-snug" style={{ color: 'rgba(255,255,255,0.90)' }}>"{item.us_view}"</p>
          <div className="flex items-center justify-between">
            <span className="text-[20px] font-bold" style={{ color: 'rgba(94,167,255,0.90)', letterSpacing: '-0.02em', lineHeight: 1 }}>{usPct}%</span>
            <MomentumTag pts={usMom} />
          </div>
          <StrengthBar pct={usPct} color="rgba(94,167,255,0.75)" delay={0.1 + 0.06 * index} />
          <MiniSparkline data={usSpark} color="rgba(94,167,255,0.80)" delay={0.4 + 0.06 * index} />
          {usView && <p className="text-[11px] leading-relaxed pt-1" style={{ color: 'rgba(255,255,255,0.58)' }}>View: "{usView}"</p>}
          {usFlip && (
            <div className="pt-1" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.28)', letterSpacing: '0.06em' }}>What flips it</p>
              <p className="flex items-start gap-1.5 text-[11px]" style={{ color: 'rgba(255,255,255,0.60)' }}>
                <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'rgba(94,167,255,0.55)' }} />
                {usFlip}
              </p>
            </div>
          )}
        </div>
        {/* Global */}
        <div className="p-4 space-y-2.5" style={{ borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5" style={{ color: 'rgba(150,190,255,0.75)' }} strokeWidth={2} />
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'rgba(150,190,255,0.65)', letterSpacing: '0.06em' }}>Global Tilt</span>
          </div>
          <p className="text-[13px] font-semibold leading-snug" style={{ color: 'rgba(255,255,255,0.80)' }}>"{item.global_view}"</p>
          <div className="flex items-center justify-between">
            <span className="text-[20px] font-bold" style={{ color: 'rgba(150,190,255,0.80)', letterSpacing: '-0.02em', lineHeight: 1 }}>{glbPct}%</span>
            <MomentumTag pts={glbMom} />
          </div>
          <StrengthBar pct={glbPct} color="rgba(150,190,255,0.60)" delay={0.1 + 0.06 * index} />
          <MiniSparkline data={glbSpark} color="rgba(150,190,255,0.75)" delay={0.4 + 0.06 * index} />
          {glbView && <p className="text-[11px] leading-relaxed pt-1" style={{ color: 'rgba(255,255,255,0.50)' }}>View: "{glbView}"</p>}
          {glbFlip && (
            <div className="pt-1" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.28)', letterSpacing: '0.06em' }}>What flips it</p>
              <p className="flex items-start gap-1.5 text-[11px]" style={{ color: 'rgba(255,255,255,0.58)' }}>
                <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'rgba(150,190,255,0.50)' }} />
                {glbFlip}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ─── Changing Narrative Card ─────────────────────────────────────────────────

const ChangingCard = ({ item, index }) => {
  const pts = item.momentum_pts ?? item.momentum ?? 0;
  const rising = (typeof pts === 'number' ? pts : parseFloat(pts) || 0) >= 0;
  const accentColor = rising ? 'rgba(255,190,80,0.88)' : 'rgba(255,106,122,0.88)';
  const bgColor = rising ? 'rgba(255,190,80,0.07)' : 'rgba(255,106,122,0.07)';
  const borderColor = rising ? 'rgba(255,190,80,0.14)' : 'rgba(255,106,122,0.14)';
  const whyChanged = item.why_changed || item.drivers || [];
  const watchNext = item.watch_next || item.what_to_watch || null;
  const sources = item.sources_count ?? item.sources ?? 0;
  const sparkData = item.sparkline || (rising ? [40, 44, 48, 52, 57, 62, 67] : [67, 62, 57, 52, 48, 44, 40]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.06 * index, duration: 0.35, ease: HORIZON_EASE }}
      className="relative rounded-[18px] p-4"
      style={{
        background: `linear-gradient(180deg, ${bgColor} 0%, rgba(255,255,255,0.018) 100%)`,
        backdropFilter: 'blur(40px) saturate(168%)', WebkitBackdropFilter: 'blur(40px) saturate(168%)',
        border: `1px solid ${borderColor}`,
        boxShadow: `inset 0 1.5px 0 rgba(255,255,255,0.07), 0 6px 24px rgba(0,0,0,0.14)`,
        overflow: 'visible'
      }}
    >
      <SpecularLine opacity={0.10} />
      <div className="relative z-10 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <p className="text-[14px] font-semibold leading-snug flex-1" style={{ color: 'rgba(255,255,255,0.94)', letterSpacing: '-0.01em' }}>{item.claim || item.title || item.narrative}</p>
          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ background: bgColor, border: `1px solid ${borderColor}`, color: accentColor }}>
              {rising ? '↑ Rising' : '↓ Falling'}
            </span>
            <MomentumTag pts={pts} />
          </div>
        </div>
        <MiniSparkline data={sparkData} color={accentColor} delay={0.3 + 0.06 * index} />

        {/* Why changed */}
        {whyChanged.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: 'rgba(255,255,255,0.32)', letterSpacing: '0.07em' }}>Why it changed</p>
            <ul className="space-y-1">
              {(Array.isArray(whyChanged) ? whyChanged : [whyChanged]).slice(0, 2).map((w, i) => (
                <li key={i} className="flex items-start gap-1.5 text-[12px]" style={{ color: 'rgba(255,255,255,0.68)' }}>
                  <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: accentColor }} />
                  {w}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* What to watch */}
        {watchNext && (
          <div className="pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: 'rgba(255,255,255,0.28)', letterSpacing: '0.07em' }}>What to watch next</p>
            <p className="flex items-start gap-1.5 text-[12px]" style={{ color: 'rgba(255,255,255,0.62)' }}>
              <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'rgba(255,255,255,0.35)' }} />
              {watchNext}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center gap-2 pt-1">
          {sources > 0 && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.40)' }}>
              {sources} sources
            </span>
          )}
          {item.updated && (
            <span className="text-[10px] flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.28)' }}>
              <Clock className="w-3 h-3" />
              {item.updated}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ─── Empty state ─────────────────────────────────────────────────────────────

const EmptyState = ({ label }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center" style={{ color: 'rgba(255,255,255,0.28)' }}>
    <Info className="w-8 h-8 mb-3" strokeWidth={1.5} />
    <p className="text-sm">No {label} data available yet.</p>
  </div>
);

// ─── Main export ─────────────────────────────────────────────────────────────

export default function NarrativeMap({ synthesis, density }) {
  const [activeTab, setActiveTab] = useState('consensus');

  if (!synthesis) return null;

  const { consensus = [], divergences = [], us_global_split = [] } = synthesis;

  // Build "changing" list from all sections — highest momentum items
  const allItems = [
    ...consensus.map(i => ({ ...i, _src: 'consensus' })),
    ...divergences.map(i => ({ ...i, _src: 'divergences' })),
    ...us_global_split.map(i => ({ ...i, _src: 'us_global' })),
  ];
  const changingItems = allItems
    .filter(i => i.momentum_pts !== undefined || i.momentum !== undefined)
    .sort((a, b) => Math.abs(b.momentum_pts ?? b.momentum ?? 0) - Math.abs(a.momentum_pts ?? a.momentum ?? 0))
    .slice(0, 6);

  const renderContent = () => {
    switch (activeTab) {
      case 'consensus':
        return consensus.length > 0
          ? <div className="space-y-3">{consensus.slice(0, 5).map((item, i) => <ConsensusCard key={i} item={item} index={i} />)}</div>
          : <EmptyState label="consensus" />;
      case 'divergences':
        return divergences.length > 0
          ? <div className="space-y-3">{divergences.slice(0, 4).map((item, i) => <DivergenceCard key={i} item={item} index={i} />)}</div>
          : <EmptyState label="divergence" />;
      case 'us_global':
        return us_global_split.length > 0
          ? <div className="space-y-3">{us_global_split.slice(0, 4).map((item, i) => <USGlobalCard key={i} item={item} index={i} />)}</div>
          : <EmptyState label="US vs Global" />;
      case 'changing':
        return changingItems.length > 0
          ? <div className="space-y-3">{changingItems.map((item, i) => <ChangingCard key={i} item={item} index={i} />)}</div>
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
      {/* Section header */}
      <div className="flex items-start justify-between mb-5 px-1">
        <div>
          <h2 id="narrative-map-heading" className="text-2xl font-bold" style={{ color: 'rgba(255,255,255,0.94)', letterSpacing: '-0.025em' }}>
            Narrative Map
          </h2>
          <p className="text-[12px] mt-1" style={{ color: 'rgba(255,255,255,0.40)' }}>
            Connecting the macro dots.
          </p>
        </div>
        <div className="text-right mt-1 max-w-[200px]">
          <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.30)', fontStyle: 'italic' }}>
            Narratives summarize how markets are being interpreted, not guaranteed predictions.
          </p>
        </div>
      </div>

      {/* Glass container */}
      <div className="relative rounded-[24px] overflow-hidden" style={{
        background: 'linear-gradient(180deg, rgba(14,17,28,0.50) 0%, rgba(10,14,24,0.60) 100%)',
        backdropFilter: 'blur(32px) saturate(165%)',
        WebkitBackdropFilter: 'blur(32px) saturate(165%)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.05), 0 6px 28px rgba(0,0,0,0.20)',
      }}>
        {/* Top light */}
        <div style={{ position: 'absolute', top: 0, left: '15%', right: '15%', height: '1.5px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.09), transparent)', pointerEvents: 'none' }} />

        {/* Tab bar */}
        <div className="flex px-4 pt-4 pb-0 gap-1 overflow-x-auto" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {TABS.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative flex flex-col items-start px-4 pb-3 pt-2 rounded-t-[12px] flex-shrink-0 transition-all duration-200"
                style={{
                  background: isActive ? 'rgba(255,255,255,0.055)' : 'transparent',
                  border: isActive ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
                  borderBottom: isActive ? '1px solid transparent' : '1px solid transparent',
                  minWidth: '80px',
                }}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <tab.Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: isActive ? tab.color : 'rgba(255,255,255,0.35)', strokeWidth: 2 }} />
                  <span className="text-[13px] font-semibold whitespace-nowrap" style={{ color: isActive ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.48)', letterSpacing: '-0.01em' }}>
                    {tab.label}
                  </span>
                </div>
                <span className="text-[10px]" style={{ color: isActive ? 'rgba(255,255,255,0.38)' : 'rgba(255,255,255,0.24)' }}>
                  {tab.sub}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full"
                    style={{ background: tab.color }}
                    transition={{ duration: 0.25, ease: HORIZON_EASE }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Content area */}
        <div className="p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
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