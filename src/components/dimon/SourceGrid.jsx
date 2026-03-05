import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

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

const SectionLabel = ({ children }) => (
  <p className="text-[10px] font-semibold uppercase tracking-widest px-1" style={{ color: 'rgba(255,255,255,0.32)', letterSpacing: '0.08em' }}>
    {children}
  </p>
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
    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold rounded-full flex-shrink-0"
      style={{ background: bg, border: `1px solid ${border}`, color }}>
      {isCautionary ? '⚠' : '●'} {label}
    </span>
  );
};

// ─── Micro chip (info pills in pulse card) ────────────────────────────────────
const MicroChip = ({ label }) => (
  <span className="inline-flex items-center px-2.5 py-0.5 text-[10px] font-medium rounded-full"
    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.50)' }}>
    {label}
  </span>
);

// ─── Improved animated fill bar with tick marks ───────────────────────────────
const SentimentBar = ({ label, pct, color, glowColor, delay }) => (
  <div className="space-y-1.5">
    <div className="flex items-center justify-between">
      <span className="text-[12px] font-medium" style={{ color: 'rgba(255,255,255,0.60)' }}>{label}</span>
    </div>
    <div className="relative h-2.5 rounded-full overflow-visible" style={{ background: 'rgba(255,255,255,0.06)' }}>
      {/* Tick marks at 25 / 50 / 75 */}
      {[25, 50, 75].map(tick => (
        <div key={tick} style={{
          position: 'absolute', top: '-2px', bottom: '-2px',
          left: `${tick}%`, width: '1px',
          background: 'rgba(255,255,255,0.06)',
          pointerEvents: 'none', zIndex: 1
        }} />
      ))}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1.2, delay, ease: HORIZON_EASE }}
        className="h-full rounded-full relative z-10 overflow-hidden"
        style={{
          background: `linear-gradient(90deg, ${color.replace('0.90', '0.55')} 0%, ${color} 100%)`,
          boxShadow: `0 0 10px ${glowColor}`
        }}
      />
      {/* % label at end of bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.9, duration: 0.3 }}
        style={{
          position: 'absolute', top: '50%', transform: 'translateY(-50%)',
          left: `calc(${pct}% + 6px)`, pointerEvents: 'none', zIndex: 10
        }}
      >
        <span className="text-[11px] font-bold" style={{ color }}>{pct}%</span>
      </motion.div>
    </div>
  </div>
);

// ─── Signal chip (upgraded driver chip) ──────────────────────────────────────
const SignalChip = ({ label, index, isHighlighted, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const active = hovered || isHighlighted;
  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index, duration: 0.35, ease: HORIZON_EASE }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      className="inline-flex items-center px-3.5 py-2 text-[12px] font-medium rounded-xl cursor-pointer select-none"
      style={{
        background: active ? 'rgba(110,180,255,0.12)' : 'rgba(255,255,255,0.055)',
        border: `1px solid ${active ? 'rgba(110,180,255,0.24)' : 'rgba(255,255,255,0.10)'}`,
        color: active ? 'rgba(180,215,255,0.95)' : 'rgba(255,255,255,0.68)',
        boxShadow: active ? '0 4px 20px rgba(110,180,255,0.14), inset 0 1px 0 rgba(255,255,255,0.10)' : 'inset 0 1px 0 rgba(255,255,255,0.06)',
        transform: active ? 'translateY(-1px)' : 'translateY(0)',
        transition: 'all 0.18s ease',
      }}
    >
      {label}
    </motion.button>
  );
};

// ─── Static watch pill ────────────────────────────────────────────────────────
const WatchPill = ({ label }) => (
  <span className="inline-flex items-center px-2.5 py-1 text-[10px] font-semibold rounded-full flex-shrink-0"
    style={{ background: 'rgba(94,167,255,0.08)', border: '1px solid rgba(94,167,255,0.16)', color: 'rgba(94,167,255,0.75)' }}>
    {label}
  </span>
);

// ─── Momentum pill ────────────────────────────────────────────────────────────
const MomentumPill = ({ sentiment }) => {
  const isCautious = sentiment.toLowerCase().includes('cautious');
  const isPositive = sentiment.toLowerCase().includes('positive') || sentiment.toLowerCase().includes('constructive');
  const label = isCautious ? 'Accelerating' : isPositive ? 'Building' : 'Stable';
  const color = isCautious ? 'rgba(251,146,60,0.85)' : isPositive ? 'rgba(88,227,164,0.85)' : 'rgba(148,163,184,0.80)';
  const bg = isCautious ? 'rgba(251,146,60,0.10)' : isPositive ? 'rgba(88,227,164,0.10)' : 'rgba(148,163,184,0.08)';
  return (
    <span className="inline-flex items-center px-2.5 py-1 text-[10px] font-bold rounded-full flex-shrink-0"
      style={{ background: bg, border: `1px solid ${color.replace('0.85', '0.20')}`, color }}>
      {label}
    </span>
  );
};

// ─── What-this-tilts pills ────────────────────────────────────────────────────
const TiltPills = ({ isCautionary }) => {
  const pills = isCautionary ? ['Risk', 'Rates', 'Credit'] : ['Balance', 'Wait & See'];
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {pills.map(p => (
        <span key={p} className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded-full"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.45)' }}>
          {p}
        </span>
      ))}
    </div>
  );
};

// ─── Market effects rows ──────────────────────────────────────────────────────
const WATCH_LABELS = ['Watch Spreads', 'Watch Growth', 'Watch Policy'];
const EFFECT_LINES = [
  'Rising credit premiums may weigh on risk appetite.',
  'Slowing growth signals could shift allocation toward defensives.',
  'Policy uncertainty is keeping institutional positioning cautious.',
];

const MarketEffectsSection = ({ drivers, summary }) => {
  const rows = drivers.slice(0, 3).map((driver, i) => ({
    driver,
    effect: EFFECT_LINES[i] || summary,
    watch: WATCH_LABELS[i] || 'Watch Markets',
  }));

  return (
    <div className="space-y-3">
      <SectionLabel>Potential Market Effects</SectionLabel>
      <div className="relative rounded-[18px] overflow-hidden p-4 space-y-3" style={GLASS_CARD}>
        <SpecularLine />
        {rows.length > 0 ? rows.map((row, i) => (
          <motion.div
            key={row.driver}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.06 * i + 0.2, duration: 0.35, ease: HORIZON_EASE }}
            className="flex items-center gap-3 min-w-0"
            style={{ borderTop: i > 0 ? '1px solid rgba(255,255,255,0.04)' : 'none', paddingTop: i > 0 ? '10px' : 0 }}
          >
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.70)' }}>
              {row.driver}
            </span>
            <span className="text-[12px] flex-1 min-w-0 truncate" style={{ color: 'rgba(255,255,255,0.55)' }}>
              {row.effect}
            </span>
            <WatchPill label={row.watch} />
          </motion.div>
        )) : (
          <p className="text-[12px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Impact mapping will appear as narrative clusters strengthen.
          </p>
        )}
      </div>
    </div>
  );
};

// ─── Narrative velocity section ───────────────────────────────────────────────
const NarrativeVelocitySection = ({ drivers, sentiment }) => {
  const top3 = drivers.slice(0, 3);
  return (
    <div className="space-y-3">
      <SectionLabel>Narrative Velocity</SectionLabel>
      <div className="relative rounded-[18px] overflow-hidden p-4 space-y-3" style={GLASS_CARD}>
        <SpecularLine />
        {top3.length > 0 ? top3.map((driver, i) => (
          <motion.div
            key={driver}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.06 * i + 0.2, duration: 0.35, ease: HORIZON_EASE }}
            className="flex items-center justify-between gap-3 min-w-0"
            style={{ borderTop: i > 0 ? '1px solid rgba(255,255,255,0.04)' : 'none', paddingTop: i > 0 ? '10px' : 0 }}
          >
            <span className="text-[13px] font-medium truncate flex-1" style={{ color: 'rgba(255,255,255,0.82)' }}>
              {driver}
            </span>
            <MomentumPill sentiment={sentiment} />
          </motion.div>
        )) : (
          <p className="text-[12px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
            This layer will populate as narrative clusters strengthen.
          </p>
        )}
      </div>
    </div>
  );
};

// ─── Source row (upgraded) ────────────────────────────────────────────────────
const SourceRow = ({ source, onClick, isOpen }) => {
  const [hovered, setHovered] = useState(false);
  const logo = SOURCE_LOGOS[source.source] || { abbr: source.source?.slice(0,3).toUpperCase(), bg: '#374151', label: source.name };
  const isCautionary = getSentiment(source) === 'cautionary';
  const sentColor = isCautionary ? 'rgba(251,146,60,0.88)' : 'rgba(148,163,184,0.75)';
  const sentBg = isCautionary ? 'rgba(251,146,60,0.10)' : 'rgba(148,163,184,0.07)';
  const sentBorder = isCautionary ? 'rgba(251,146,60,0.20)' : 'rgba(148,163,184,0.12)';
  const primaryTheme = source.topline || null;

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-center gap-3 px-3 py-3 rounded-[14px] w-full text-left min-w-0"
      style={{
        background: isOpen ? 'rgba(110,180,255,0.07)' : hovered ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.025)',
        border: `1px solid ${isOpen ? 'rgba(110,180,255,0.16)' : hovered ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.05)'}`,
        boxShadow: hovered ? '0 4px 20px rgba(0,0,0,0.15)' : 'none',
        transform: hovered ? 'translateY(-1px)' : 'translateY(0)',
        transition: 'all 0.18s ease',
      }}
      whileTap={{ scale: 0.99 }}
    >
      {/* Logo badge */}
      <div className="w-8 h-8 rounded-[10px] flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
        style={{ background: logo.bg, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18)' }}>
        {logo.abbr}
      </div>
      {/* Name + primary theme */}
      <div className="flex-1 min-w-0">
        <span className="text-[13px] font-medium block truncate" style={{ color: 'rgba(255,255,255,0.85)' }}>
          {logo.label}
        </span>
        {primaryTheme && (
          <span className="text-[11px] block truncate" style={{ color: 'rgba(255,255,255,0.38)' }}>
            {primaryTheme}
          </span>
        )}
      </div>
      {/* Sentiment pill */}
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full flex-shrink-0"
        style={{ background: sentBg, border: `1px solid ${sentBorder}`, color: sentColor }}>
        {isCautionary ? '⚠' : '●'} {isCautionary ? 'Cautionary' : 'Neutral'}
      </span>
      {/* Chevron */}
      <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2, ease: 'easeOut' }}>
        <ChevronDown className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.28)' }} />
      </motion.div>
    </motion.button>
  );
};

// ─── Source drawer (upgraded 2-col layout) ────────────────────────────────────
const SourceDrawer = ({ source }) => {
  const isCautionary = getSentiment(source) === 'cautionary';
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden"
    >
      <div className="mx-2 mb-2 p-4 rounded-[14px]"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        {/* 2-column desktop grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left: Primary Topic + Coverage Context */}
          <div className="space-y-2">
            {source.topline && (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide mb-1" style={{ color: 'rgba(255,255,255,0.30)' }}>Primary Topic</p>
                <p className="text-[13px] font-bold" style={{ color: 'rgba(255,255,255,0.90)' }}>{source.topline}</p>
              </div>
            )}
            {source.policy && (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide mb-1" style={{ color: 'rgba(255,255,255,0.30)' }}>Coverage Context</p>
                <p className="text-[12px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.58)' }}>{source.policy}</p>
              </div>
            )}
          </div>
          {/* Right: Sentiment + Latest Headline */}
          <div className="space-y-2">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'rgba(255,255,255,0.30)' }}>Sentiment</p>
              <SentimentChip label={isCautionary ? 'Cautionary' : 'Neutral'} isCautionary={isCautionary} />
            </div>
            {source.market_macro && (
              <div className="pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <p className="text-[10px] font-semibold uppercase tracking-wide mb-1" style={{ color: 'rgba(255,255,255,0.28)' }}>Latest Headline</p>
                <p className="text-[12px] italic" style={{ color: 'rgba(255,255,255,0.55)', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  "{source.market_macro}"
                </p>
              </div>
            )}
          </div>
        </div>
        {/* What this tilts */}
        <div className="mt-3 pt-3 flex items-center gap-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.28)' }}>What this tilts</span>
          <TiltPills isCautionary={isCautionary} />
        </div>
      </div>
    </motion.div>
  );
};

// ─── Main export ──────────────────────────────────────────────────────────────
export default function SourceGrid({ sources, density }) {
  const [openSourceId, setOpenSourceId] = useState(null);
  const [highlightedDriver, setHighlightedDriver] = useState(null);

  if (!Array.isArray(sources) || sources.length === 0) return null;

  const sorted = [...sources].sort((a, b) => orderedSources.indexOf(a.source) - orderedSources.indexOf(b.source));
  const { cautPct, neutralPct, headline, summary, sentiment } = getNarrativeSummary(sorted);
  const drivers = getDrivers(sorted);
  const isCautious = cautPct >= 50;

  const cautionSources = sorted.filter(s => getSentiment(s) === 'cautionary');
  const neutralSources = sorted.filter(s => getSentiment(s) === 'neutral');

  const toggleSource = (id) => setOpenSourceId(prev => prev === id ? null : id);
  const toggleDriver = (d) => setHighlightedDriver(prev => prev === d ? null : d);

  return (
    <motion.section
      aria-labelledby="narrative-intelligence-heading"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: HORIZON_EASE }}
    >
      {/* Section header */}
      <div className="mb-6 px-1">
        <h2 id="narrative-intelligence-heading" className="text-[22px] font-bold" style={{ color: 'rgba(255,255,255,0.96)' }}>
          Narrative Intelligence
        </h2>
        <p className="text-[13px] mt-1.5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.40)', maxWidth: '520px' }}>
          How major publications are framing risk, growth, and policy — distilled into market-ready narrative signals.
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

        <div className="relative z-10 p-6 space-y-8">

          {/* 1 ─ Narrative Pulse card */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: HORIZON_EASE }}
            className="relative rounded-[20px] overflow-hidden p-5"
            style={GLASS_CARD}
          >
            <SpecularLine />
            <div className="relative z-10">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0 space-y-1.5">
                  <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.32)', letterSpacing: '0.10em' }}>
                    Narrative Pulse
                  </p>
                  <h3 className="text-[17px] font-bold leading-snug" style={{ color: 'rgba(255,255,255,0.95)' }}>
                    {headline}
                  </h3>
                  <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.58)' }}>
                    {summary}
                  </p>
                </div>
                <SentimentChip label={sentiment} isCautionary={isCautious} />
              </div>
              {/* Micro chips */}
              <div className="flex items-center gap-2 flex-wrap mt-4 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <MicroChip label={`Outlets: ${sorted.length}`} />
                <MicroChip label="Window: Latest" />
                <MicroChip label="Confidence: —" />
              </div>
            </div>
          </motion.div>

          {/* 2 ─ Sentiment Mix */}
          <div className="space-y-3">
            <div>
              <SectionLabel>Sentiment Mix</SectionLabel>
              <p className="text-[11px] mt-1 px-1" style={{ color: 'rgba(255,255,255,0.32)' }}>
                Share of coverage tone across tracked outlets.
              </p>
            </div>
            <div className="space-y-4 pr-10">
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

          {/* 3 ─ Narrative Drivers */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <SectionLabel>Narrative Drivers</SectionLabel>
              <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.25)' }}>
                Tap a driver to filter sources
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {drivers.map((d, i) => (
                <SignalChip
                  key={d}
                  label={d}
                  index={i}
                  isHighlighted={highlightedDriver === d}
                  onClick={() => toggleDriver(d)}
                />
              ))}
            </div>
          </div>

          {/* 4 ─ Potential Market Effects */}
          <MarketEffectsSection drivers={drivers} summary={summary} />

          {/* 5 ─ Narrative Velocity */}
          <NarrativeVelocitySection drivers={drivers} sentiment={sentiment} />

          {/* 6 ─ Source Breakdown */}
          <div className="space-y-4">
            <div>
              <SectionLabel>Source Breakdown</SectionLabel>
              <p className="text-[11px] mt-1 px-1" style={{ color: 'rgba(255,255,255,0.30)' }}>
                Open a source to see what it's emphasizing right now.
              </p>
            </div>

            {cautionSources.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-[10px] font-semibold uppercase tracking-wide px-1 mb-2" style={{ color: 'rgba(251,146,60,0.55)', letterSpacing: '0.07em' }}>
                  ⚠ Cautionary
                </p>
                {cautionSources.map(s => (
                  <div key={s.source}>
                    <SourceRow
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
              <div className="space-y-1.5">
                <p className="text-[10px] font-semibold uppercase tracking-wide px-1 mb-2" style={{ color: 'rgba(148,163,184,0.45)', letterSpacing: '0.07em' }}>
                  ● Neutral
                </p>
                {neutralSources.map(s => (
                  <div key={s.source}>
                    <SourceRow
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