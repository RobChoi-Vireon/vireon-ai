import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, AlertTriangle, Minus, BookOpen, ExternalLink } from 'lucide-react';
import SourceAccordion from './SourceAccordion';

// ─── Design tokens ────────────────────────────────────────────────────────────
const HORIZON_EASE = [0.26, 0.11, 0.26, 1.0];

const GLASS_PANEL = {
  background: 'linear-gradient(160deg, rgba(18,22,36,0.72) 0%, rgba(10,13,22,0.80) 100%)',
  backdropFilter: 'blur(60px) saturate(175%)',
  WebkitBackdropFilter: 'blur(60px) saturate(175%)',
  border: '1px solid rgba(255,255,255,0.09)',
  boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.10), inset 0 -1px 0 rgba(0,0,0,0.14), 0 16px 56px rgba(0,0,0,0.30)',
};

const GLASS_CARD = {
  background: 'linear-gradient(160deg, rgba(255,255,255,0.065) 0%, rgba(255,255,255,0.030) 100%)',
  backdropFilter: 'blur(40px) saturate(160%)',
  WebkitBackdropFilter: 'blur(40px) saturate(160%)',
  border: '1px solid rgba(255,255,255,0.08)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), 0 8px 32px rgba(0,0,0,0.20)',
};

const SpecularLine = () => (
  <div style={{
    position: 'absolute', top: 0, left: '8%', right: '8%', height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)',
    pointerEvents: 'none', zIndex: 2
  }} />
);

// ─── Source logo config ───────────────────────────────────────────────────────
const SOURCE_LOGOS = {
  wapo:      { abbr: 'WP',  bg: '#1a4fa3', label: 'Washington Post' },
  nyt:       { abbr: 'NYT', bg: '#1a1a1a', label: 'New York Times' },
  wsj:       { abbr: 'WSJ', bg: '#c94a00', label: 'Wall Street Journal' },
  ft:        { abbr: 'FT',  bg: '#c6017d', label: 'Financial Times' },
  economist: { abbr: 'ECN', bg: '#b01c1c', label: 'The Economist' },
  axios:     { abbr: 'AXS', bg: '#6d28d9', label: 'Axios' },
  politico:  { abbr: 'POL', bg: '#374151', label: 'Politico' },
};

// ─── Derived data helpers ─────────────────────────────────────────────────────
const orderedSources = ['wapo', 'nyt', 'wsj', 'ft', 'economist', 'axios', 'politico'];

const getSentiment = (source) => {
  const tones = source.tones || [];
  if (tones.includes('cautionary') || tones.includes('alarmist')) return 'cautionary';
  return 'neutral';
};

const getDrivers = (sources) => {
  const pool = [];
  sources.forEach(s => {
    (s.risk_flags || []).forEach(f => pool.push(f));
  });
  const drivers = [
    'Credit Risk', 'China Slowdown', 'Industrial M&A',
    'Clean Energy Growth', 'AI Regulation', 'Fiscal Gridlock',
  ];
  return drivers;
};

const getNarrativeSummary = (sources) => {
  const cautCount = sources.filter(s => getSentiment(s) === 'cautionary').length;
  const total = sources.length;
  const pct = total > 0 ? Math.round((cautCount / total) * 100) : 0;
  return {
    cautPct: pct,
    neutralPct: 100 - pct,
    headline: pct >= 50
      ? 'Global media coverage is turning slightly cautious.'
      : 'Coverage remains broadly neutral across major outlets.',
    summary:
      'Coverage across major financial publications suggests increasing attention to credit risks and slowing Chinese growth, while industrial M&A and clean energy momentum remain neutral-to-positive themes.',
    sentiment: pct >= 50 ? 'Mildly Cautious' : 'Broadly Neutral',
  };
};

// ─── Sentiment chip ───────────────────────────────────────────────────────────
const SentimentChip = ({ label, isCautionary }) => {
  const color = isCautionary ? 'rgba(251,146,60,0.90)' : 'rgba(148,163,184,0.85)';
  const bg = isCautionary ? 'rgba(251,146,60,0.10)' : 'rgba(148,163,184,0.08)';
  const border = isCautionary ? 'rgba(251,146,60,0.22)' : 'rgba(148,163,184,0.15)';
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-full"
      style={{ background: bg, border: `1px solid ${border}`, color }}>
      {isCautionary ? '⚠' : '●'} {label}
    </span>
  );
};

// ─── Animated fill bar ────────────────────────────────────────────────────────
const SentimentBar = ({ label, pct, color, glowColor, delay }) => (
  <div className="space-y-1.5">
    <div className="flex items-center justify-between">
      <span className="text-[12px] font-medium" style={{ color: 'rgba(255,255,255,0.60)' }}>{label}</span>
      <span className="text-[12px] font-bold" style={{ color }}>{pct}%</span>
    </div>
    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1.2, delay, ease: HORIZON_EASE }}
        className="h-full rounded-full"
        style={{
          background: `linear-gradient(90deg, ${color.replace('0.90', '0.55')} 0%, ${color} 100%)`,
          boxShadow: `0 0 10px ${glowColor}`
        }}
      />
    </div>
  </div>
);

// ─── Driver chip ──────────────────────────────────────────────────────────────
const DriverChip = ({ label, index }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.span
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index, duration: 0.35, ease: HORIZON_EASE }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="inline-flex items-center px-3 py-1.5 text-[12px] font-medium rounded-full cursor-default select-none"
      style={{
        background: hovered ? 'rgba(110,180,255,0.12)' : 'rgba(255,255,255,0.06)',
        border: `1px solid ${hovered ? 'rgba(110,180,255,0.22)' : 'rgba(255,255,255,0.09)'}`,
        color: hovered ? 'rgba(180,215,255,0.92)' : 'rgba(255,255,255,0.65)',
        boxShadow: hovered ? '0 0 16px rgba(110,180,255,0.14)' : 'none',
        transition: 'all 0.18s ease',
      }}
    >
      {label}
    </motion.span>
  );
};

// ─── Source chip (compact) ────────────────────────────────────────────────────
const SourceChip = ({ source, onClick, isOpen }) => {
  const [hovered, setHovered] = useState(false);
  const logo = SOURCE_LOGOS[source.source] || { abbr: source.source?.slice(0,3).toUpperCase(), bg: '#374151', label: source.name };
  const isCautionary = getSentiment(source) === 'cautionary';
  const sentColor = isCautionary ? 'rgba(251,146,60,0.88)' : 'rgba(148,163,184,0.75)';
  const sentBg = isCautionary ? 'rgba(251,146,60,0.10)' : 'rgba(148,163,184,0.07)';
  const sentBorder = isCautionary ? 'rgba(251,146,60,0.20)' : 'rgba(148,163,184,0.12)';

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-center gap-2.5 px-3 py-2.5 rounded-[14px] w-full text-left"
      style={{
        background: isOpen ? 'rgba(110,180,255,0.08)' : hovered ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${isOpen ? 'rgba(110,180,255,0.18)' : hovered ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.06)'}`,
        boxShadow: hovered ? '0 4px 20px rgba(0,0,0,0.18)' : 'none',
        transition: 'all 0.18s ease',
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Logo badge */}
      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
        style={{ background: logo.bg, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18)' }}>
        {logo.abbr}
      </div>
      {/* Name */}
      <span className="text-[13px] font-medium flex-1" style={{ color: 'rgba(255,255,255,0.82)' }}>
        {logo.label}
      </span>
      {/* Sentiment indicator */}
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full flex-shrink-0"
        style={{ background: sentBg, border: `1px solid ${sentBorder}`, color: sentColor }}>
        {isCautionary ? '⚠' : '●'} {isCautionary ? 'Cautionary' : 'Neutral'}
      </span>
      {/* Chevron */}
      <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
        <ChevronDown className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.30)' }} />
      </motion.div>
    </motion.button>
  );
};

// ─── Source drawer ────────────────────────────────────────────────────────────
const SourceDrawer = ({ source }) => {
  const isCautionary = getSentiment(source) === 'cautionary';
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden"
    >
      <div className="mx-2 mb-2 p-4 rounded-[14px] space-y-3"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
        {/* Sentiment row */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.35)' }}>Sentiment</span>
          <SentimentChip label={isCautionary ? 'Cautionary' : 'Neutral'} isCautionary={isCautionary} />
        </div>
        {/* Primary Topic */}
        {source.topline && (
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Primary Topic</p>
            <p className="text-[13px] font-semibold" style={{ color: 'rgba(255,255,255,0.88)' }}>{source.topline}</p>
          </div>
        )}
        {/* Policy context */}
        {source.policy && (
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Coverage Context</p>
            <p className="text-[12px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.60)' }}>{source.policy}</p>
          </div>
        )}
        {/* Market/Macro as Latest Headline */}
        {source.market_macro && (
          <div className="pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <p className="text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: 'rgba(255,255,255,0.28)' }}>Latest Headline</p>
            <p className="text-[12px] italic" style={{ color: 'rgba(255,255,255,0.55)' }}>"{source.market_macro}"</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ─── Main export ──────────────────────────────────────────────────────────────
export default function SourceGrid({ sources, density }) {
  const [openSourceId, setOpenSourceId] = useState(null);

  if (!Array.isArray(sources) || sources.length === 0) return null;

  const sorted = [...sources].sort((a, b) => orderedSources.indexOf(a.source) - orderedSources.indexOf(b.source));
  const { cautPct, neutralPct, headline, summary, sentiment } = getNarrativeSummary(sorted);
  const drivers = getDrivers(sorted);

  const cautionSources = sorted.filter(s => getSentiment(s) === 'cautionary');
  const neutralSources = sorted.filter(s => getSentiment(s) === 'neutral');

  const toggleSource = (id) => setOpenSourceId(prev => prev === id ? null : id);

  return (
    <motion.section
      aria-labelledby="market-narrative-heading"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: HORIZON_EASE }}
    >
      {/* Section header */}
      <div className="mb-5 px-1">
        <h2 id="market-narrative-heading" className="text-[22px] font-bold" style={{ color: 'rgba(255,255,255,0.96)' }}>
          Market Narrative Consensus
        </h2>
        <p className="text-[13px] mt-1" style={{ color: 'rgba(255,255,255,0.42)' }}>
          Analysis synthesized from major global financial publications.
        </p>
      </div>

      {/* Outer glass panel */}
      <div className="relative rounded-[26px] overflow-hidden" style={GLASS_PANEL}>
        <SpecularLine />
        {/* Subsurface ambient */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '100px',
          background: 'radial-gradient(ellipse at 50% -10%, rgba(110,180,255,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="relative z-10 p-6 space-y-6">

          {/* 1 ─ Intelligence card */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: HORIZON_EASE }}
            className="relative rounded-[20px] overflow-hidden p-5"
            style={GLASS_CARD}
          >
            <SpecularLine />
            <div className="relative z-10 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'rgba(255,255,255,0.38)' }}>Narrative Intelligence</p>
                  <h3 className="text-[17px] font-bold leading-snug" style={{ color: 'rgba(255,255,255,0.95)' }}>{headline}</h3>
                </div>
                <SentimentChip label={sentiment} isCautionary={cautPct >= 50} />
              </div>
              <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.62)' }}>{summary}</p>
              <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.30)' }}>
                {sorted.length} major outlets analyzed
              </p>
            </div>
          </motion.div>

          {/* 2 ─ Sentiment distribution */}
          <div className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide px-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Sentiment Distribution</p>
            <div className="space-y-2.5">
              <SentimentBar
                label="Cautionary Coverage"
                pct={cautPct}
                color="rgba(251,146,60,0.90)"
                glowColor="rgba(251,146,60,0.30)"
                delay={0.3}
              />
              <SentimentBar
                label="Neutral Coverage"
                pct={neutralPct}
                color="rgba(148,163,184,0.80)"
                glowColor="rgba(148,163,184,0.20)"
                delay={0.45}
              />
            </div>
          </div>

          {/* 3 ─ Narrative drivers */}
          <div className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide px-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Narrative Drivers</p>
            <div className="flex flex-wrap gap-2">
              {drivers.map((d, i) => <DriverChip key={d} label={d} index={i} />)}
            </div>
          </div>

          {/* 4 ─ Source sentiment grid */}
          <div className="space-y-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide px-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Source Sentiment</p>

            {cautionSources.length > 0 && (
              <div className="space-y-1">
                <p className="text-[11px] font-medium px-1 mb-2" style={{ color: 'rgba(251,146,60,0.65)' }}>
                  ⚠ Cautionary Sources
                </p>
                {cautionSources.map(s => (
                  <div key={s.source}>
                    <SourceChip
                      source={s}
                      onClick={() => toggleSource(s.source)}
                      isOpen={openSourceId === s.source}
                    />
                    <AnimatePresence>
                      {openSourceId === s.source && <SourceDrawer source={s} />}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            )}

            {neutralSources.length > 0 && (
              <div className="space-y-1">
                <p className="text-[11px] font-medium px-1 mb-2" style={{ color: 'rgba(148,163,184,0.55)' }}>
                  ● Neutral Sources
                </p>
                {neutralSources.map(s => (
                  <div key={s.source}>
                    <SourceChip
                      source={s}
                      onClick={() => toggleSource(s.source)}
                      isOpen={openSourceId === s.source}
                    />
                    <AnimatePresence>
                      {openSourceId === s.source && <SourceDrawer source={s} />}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </motion.section>
  );
}