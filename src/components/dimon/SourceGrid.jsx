import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const EASE = [0.26, 0.11, 0.26, 1.0];

// ─── Glass tokens ─────────────────────────────────────────────────────────────
const GLASS_OUTER = {
  background: 'linear-gradient(160deg, rgba(18,22,36,0.70) 0%, rgba(10,13,22,0.78) 100%)',
  backdropFilter: 'blur(60px) saturate(175%)',
  WebkitBackdropFilter: 'blur(60px) saturate(175%)',
  border: '1px solid rgba(255,255,255,0.09)',
  boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.10), inset 0 -1px 0 rgba(0,0,0,0.14), 0 16px 56px rgba(0,0,0,0.30)',
};

const GLASS_INNER = {
  background: 'linear-gradient(160deg, rgba(255,255,255,0.062) 0%, rgba(255,255,255,0.028) 100%)',
  backdropFilter: 'blur(40px) saturate(160%)',
  WebkitBackdropFilter: 'blur(40px) saturate(160%)',
  border: '1px solid rgba(255,255,255,0.08)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10), 0 6px 24px rgba(0,0,0,0.18)',
};

const Specular = () => (
  <div style={{
    position: 'absolute', top: 0, left: '8%', right: '8%', height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.13), transparent)',
    pointerEvents: 'none', zIndex: 2,
  }} />
);

// ─── Source config ────────────────────────────────────────────────────────────
const SOURCE_LOGOS = {
  wapo:      { abbr: 'WP',  bg: '#1a4fa3', label: 'Washington Post' },
  nyt:       { abbr: 'NYT', bg: '#1a1a1a', label: 'New York Times' },
  wsj:       { abbr: 'WSJ', bg: '#c94a00', label: 'Wall Street Journal' },
  ft:        { abbr: 'FT',  bg: '#c6017d', label: 'Financial Times' },
  economist: { abbr: 'ECN', bg: '#b01c1c', label: 'The Economist' },
  axios:     { abbr: 'AXS', bg: '#6d28d9', label: 'Axios' },
  politico:  { abbr: 'POL', bg: '#374151', label: 'Politico' },
};
const ORDERED = ['wapo', 'nyt', 'wsj', 'ft', 'economist', 'axios', 'politico'];

const getSentiment = (s) => {
  const t = s.tones || [];
  return (t.includes('cautionary') || t.includes('alarmist')) ? 'cautionary' : 'neutral';
};

const DRIVERS = ['Credit Risk', 'China Slowdown', 'Industrial M&A', 'Clean Energy Growth', 'AI Regulation', 'Fiscal Gridlock'];
const WATCH_LABELS = ['Watch Spreads', 'Watch Growth', 'Watch Policy', 'Watch Sentiment', 'Watch Flows', 'Watch Yields'];
const EFFECT_LINES = [
  'Rising credit premiums may weigh on risk appetite.',
  'Slowing growth signals could shift allocation toward defensives.',
  'Policy uncertainty keeps institutional positioning cautious.',
];

const getSummary = (sources) => {
  const cautCount = sources.filter(s => getSentiment(s) === 'cautionary').length;
  const total = sources.length;
  const cautPct = total > 0 ? Math.round((cautCount / total) * 100) : 0;
  return {
    cautPct,
    neutralPct: 100 - cautPct,
    headline: cautPct >= 50 ? 'Global media coverage is turning slightly cautious.' : 'Coverage remains broadly neutral across major outlets.',
    summary: 'Coverage across major financial publications suggests increasing attention to credit risks and slowing Chinese growth, while industrial M&A and clean energy momentum remain neutral-to-positive themes.',
    sentiment: cautPct >= 50 ? 'Mildly Cautious' : 'Broadly Neutral',
    isCautious: cautPct >= 50,
  };
};

// ─── Micro atoms ──────────────────────────────────────────────────────────────
const SentimentPill = ({ label, isCautious }) => (
  <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold rounded-full flex-shrink-0"
    style={{
      background: isCautious ? 'rgba(251,146,60,0.10)' : 'rgba(148,163,184,0.08)',
      border: `1px solid ${isCautious ? 'rgba(251,146,60,0.22)' : 'rgba(148,163,184,0.15)'}`,
      color: isCautious ? 'rgba(251,146,60,0.90)' : 'rgba(148,163,184,0.85)',
    }}>
    {isCautious ? '⚠' : '●'} {label}
  </span>
);

const MicroChip = ({ label }) => (
  <span className="inline-flex items-center px-2.5 py-0.5 text-[10px] font-medium rounded-full"
    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.46)' }}>
    {label}
  </span>
);

const SmallCapsLabel = ({ children }) => (
  <p style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.10em', color: 'rgba(255,255,255,0.28)' }}>
    {children}
  </p>
);

// ─── 1. Narrative Pulse Hero ──────────────────────────────────────────────────
const NarrativePulse = ({ headline, summary, sentiment, isCautious, cautPct, neutralPct, totalOutlets }) => (
  <motion.div
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.38, ease: EASE }}
    className="relative rounded-[18px] overflow-hidden p-5"
    style={GLASS_INNER}
  >
    <Specular />
    <div className="relative z-10 space-y-3">
      {/* Top row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0 space-y-1">
          <SmallCapsLabel>Narrative Pulse</SmallCapsLabel>
          <h3 className="text-[16px] font-bold leading-snug"
            style={{ color: 'rgba(255,255,255,0.95)', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {headline}
          </h3>
          <p className="text-[12px] truncate" style={{ color: 'rgba(255,255,255,0.52)' }}>
            {summary}
          </p>
        </div>
        <SentimentPill label={sentiment} isCautious={isCautious} />
      </div>

      {/* Inline mix bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between mb-1">
          <SmallCapsLabel>Sentiment Mix</SmallCapsLabel>
          <div className="flex items-center gap-3">
            <span style={{ fontSize: '10px', color: 'rgba(251,146,60,0.75)' }}>Cautious {cautPct}%</span>
            <span style={{ fontSize: '10px', color: 'rgba(148,163,184,0.65)' }}>Neutral {neutralPct}%</span>
          </div>
        </div>
        <div className="flex h-1.5 rounded-full overflow-hidden gap-px" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${cautPct}%` }}
            transition={{ duration: 1.0, delay: 0.3, ease: EASE }}
            style={{ background: 'rgba(251,146,60,0.65)', borderRadius: '3px 0 0 3px' }}
          />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${neutralPct}%` }}
            transition={{ duration: 1.0, delay: 0.5, ease: EASE }}
            style={{ background: 'rgba(148,163,184,0.45)', borderRadius: '0 3px 3px 0' }}
          />
        </div>
      </div>

      {/* Micro chips */}
      <div className="flex items-center gap-2 pt-1" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <MicroChip label={`Outlets: ${totalOutlets}`} />
        <MicroChip label="Window: Latest" />
        <MicroChip label="Confidence: —" />
      </div>
    </div>
  </motion.div>
);

// ─── 2. Signal Strip ──────────────────────────────────────────────────────────
const SignalStrip = ({ drivers, selected, onSelect, onClear }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between px-0.5">
      <SmallCapsLabel>Signal Strip</SmallCapsLabel>
      <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.26)' }}>Swipe to scan drivers</span>
    </div>
    <div className="relative">
      <div className="flex items-center gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {drivers.map((d, i) => {
          const isSelected = selected === d;
          return (
            <motion.button
              key={d}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.04 * i, duration: 0.26, ease: EASE }}
              onClick={() => onSelect(d)}
              className="inline-flex items-center px-3.5 py-2 text-[12px] font-medium rounded-xl flex-shrink-0"
              style={{
                background: isSelected ? 'rgba(110,180,255,0.14)' : 'rgba(255,255,255,0.055)',
                border: `1px solid ${isSelected ? 'rgba(110,180,255,0.28)' : 'rgba(255,255,255,0.09)'}`,
                color: isSelected ? 'rgba(180,215,255,0.96)' : 'rgba(255,255,255,0.66)',
                boxShadow: isSelected ? '0 0 18px rgba(110,180,255,0.16), inset 0 1px 0 rgba(255,255,255,0.10)' : 'inset 0 1px 0 rgba(255,255,255,0.05)',
                transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                transition: 'all 0.16s ease',
                whiteSpace: 'nowrap',
              }}
              title={d}
            >
              {d}
            </motion.button>
          );
        })}
        {selected && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={onClear}
            className="inline-flex items-center gap-1 px-2.5 py-2 text-[11px] font-medium rounded-xl flex-shrink-0"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.10)',
              color: 'rgba(255,255,255,0.45)',
              transition: 'all 0.16s ease',
            }}
          >
            <X className="w-3 h-3" /> Clear
          </motion.button>
        )}
      </div>
    </div>
  </div>
);

// ─── 3. Market Implications Grid ──────────────────────────────────────────────
const ImplicationCard = ({ watch, effect, index }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.06 * index, duration: 0.30, ease: EASE }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-[14px] overflow-hidden p-4 space-y-2"
      style={{
        background: hovered ? 'rgba(255,255,255,0.055)' : 'rgba(255,255,255,0.032)',
        border: `1px solid ${hovered ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.06)'}`,
        boxShadow: hovered ? 'inset 0 1px 0 rgba(255,255,255,0.08), 0 8px 24px rgba(0,0,0,0.16)' : 'none',
        transform: hovered ? 'translateY(-1px)' : 'translateY(0)',
        transition: 'all 0.18s ease',
      }}
    >
      <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(94,167,255,0.65)' }}>
        {watch}
      </p>
      <p className="text-[12px] leading-snug truncate" style={{ color: 'rgba(255,255,255,0.68)' }}>
        {effect || 'Implications will clarify as coverage clusters strengthen.'}
      </p>
      <span className="inline-flex items-center px-2 py-0.5 text-[9px] font-semibold rounded-full"
        style={{ background: 'rgba(94,167,255,0.08)', border: '1px solid rgba(94,167,255,0.14)', color: 'rgba(94,167,255,0.62)' }}>
        Signal
      </span>
    </motion.div>
  );
};

const MarketImplications = ({ drivers }) => (
  <div className="space-y-2">
    <div className="flex items-end justify-between px-0.5">
      <SmallCapsLabel>Market Implications</SmallCapsLabel>
      <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.26)' }}>What this narrative tilt could affect next</span>
    </div>
    <div className="grid grid-cols-3 gap-2.5">
      {drivers.slice(0, 3).map((d, i) => (
        <ImplicationCard key={d} watch={WATCH_LABELS[i] || 'Watch'} effect={EFFECT_LINES[i]} index={i} />
      ))}
    </div>
  </div>
);

// ─── 4. Sources Drawer ────────────────────────────────────────────────────────
const TiltPills = ({ isCautionary }) => {
  const pills = isCautionary ? ['Risk', 'Rates', 'Credit'] : ['Balance', 'Wait & See'];
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {pills.map(p => (
        <span key={p} className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded-full"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.40)' }}>
          {p}
        </span>
      ))}
    </div>
  );
};

const SourceExpanded = ({ source }) => {
  const isCautionary = getSentiment(source) === 'cautionary';
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden"
    >
      <div className="mx-2 mb-1.5 p-3.5 rounded-[12px]"
        style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-2">
            {source.topline && (
              <div>
                <SmallCapsLabel>Primary Topic</SmallCapsLabel>
                <p className="text-[13px] font-bold mt-0.5" style={{ color: 'rgba(255,255,255,0.88)' }}>{source.topline}</p>
              </div>
            )}
            {source.policy && (
              <div>
                <SmallCapsLabel>Coverage Context</SmallCapsLabel>
                <p className="text-[12px] leading-relaxed mt-0.5" style={{ color: 'rgba(255,255,255,0.52)' }}>{source.policy}</p>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <div>
              <SmallCapsLabel>Sentiment</SmallCapsLabel>
              <div className="mt-1">
                <SentimentPill label={isCautionary ? 'Cautionary' : 'Neutral'} isCautious={isCautionary} />
              </div>
            </div>
            {source.market_macro && (
              <div className="pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <SmallCapsLabel>Latest Headline</SmallCapsLabel>
                <p className="text-[12px] italic mt-0.5 truncate" style={{ color: 'rgba(255,255,255,0.50)' }}>
                  "{source.market_macro}"
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="mt-2.5 pt-2.5 flex items-center gap-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <SmallCapsLabel>What this tilts</SmallCapsLabel>
          <TiltPills isCautionary={isCautionary} />
        </div>
      </div>
    </motion.div>
  );
};

const SourceRow = ({ source, isOpen, isHighlighted, onToggle }) => {
  const [hovered, setHovered] = useState(false);
  const logo = SOURCE_LOGOS[source.source] || { abbr: source.source?.slice(0, 3).toUpperCase(), bg: '#374151', label: source.name };
  const isCautionary = getSentiment(source) === 'cautionary';

  return (
    <div style={{ background: isHighlighted ? 'rgba(110,180,255,0.04)' : 'transparent', borderRadius: '10px', transition: 'background 0.18s ease' }}>
      <motion.button
        onClick={onToggle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] w-full text-left min-w-0"
        style={{
          background: isOpen ? 'rgba(110,180,255,0.06)' : hovered ? 'rgba(255,255,255,0.04)' : 'transparent',
          border: `1px solid ${isOpen ? 'rgba(110,180,255,0.12)' : 'transparent'}`,
          transition: 'all 0.16s ease',
        }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="w-7 h-7 rounded-[8px] flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
          style={{ background: logo.bg }}>
          {logo.abbr}
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[13px] font-medium block truncate" style={{ color: 'rgba(255,255,255,0.82)' }}>{logo.label}</span>
          {source.topline && (
            <span className="text-[10px] block truncate" style={{ color: 'rgba(255,255,255,0.34)' }}>{source.topline}</span>
          )}
        </div>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full flex-shrink-0"
          style={{
            background: isCautionary ? 'rgba(251,146,60,0.10)' : 'rgba(148,163,184,0.07)',
            border: `1px solid ${isCautionary ? 'rgba(251,146,60,0.20)' : 'rgba(148,163,184,0.12)'}`,
            color: isCautionary ? 'rgba(251,146,60,0.88)' : 'rgba(148,163,184,0.75)',
          }}>
          {isCautionary ? '⚠' : '●'} {isCautionary ? 'Cautionary' : 'Neutral'}
        </span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2, ease: 'easeOut' }}>
          <ChevronDown className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.26)' }} />
        </motion.div>
      </motion.button>
      <AnimatePresence>
        {isOpen && <SourceExpanded source={source} />}
      </AnimatePresence>
    </div>
  );
};

const SourcesDrawer = ({ sources, highlightedDriver }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openSourceId, setOpenSourceId] = useState(null);
  const sorted = [...sources].sort((a, b) => ORDERED.indexOf(a.source) - ORDERED.indexOf(b.source));

  return (
    <div>
      <motion.button
        onClick={() => setIsOpen(v => !v)}
        className="flex items-center justify-between w-full px-4 py-3 rounded-[14px]"
        style={{
          ...GLASS_INNER,
          borderRadius: isOpen ? '14px 14px 0 0' : '14px',
          transition: 'border-radius 0.2s ease, background 0.16s ease',
        }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex items-center gap-2.5">
          <span className="text-[13px] font-semibold" style={{ color: 'rgba(255,255,255,0.86)' }}>Sources</span>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.46)' }}>
            {sorted.length}
          </span>
          <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.30)' }}>
            Tap to view coverage
          </span>
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.22, ease: 'easeOut' }}>
          <ChevronDown className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.35)' }} />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
            style={{
              background: 'linear-gradient(160deg, rgba(14,18,30,0.62) 0%, rgba(8,11,20,0.72) 100%)',
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderTop: 'none',
              borderRadius: '0 0 14px 14px',
            }}
          >
            <div className="p-2.5 space-y-0.5">
              {sorted.map(s => (
                <SourceRow
                  key={s.source}
                  source={s}
                  isOpen={openSourceId === s.source}
                  isHighlighted={!!highlightedDriver && (s.topline || '').toLowerCase().includes(highlightedDriver.toLowerCase())}
                  onToggle={() => setOpenSourceId(p => p === s.source ? null : s.source)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Main export ──────────────────────────────────────────────────────────────
export default function SourceGrid({ sources, density }) {
  const [selectedDriver, setSelectedDriver] = useState(null);

  if (!Array.isArray(sources) || sources.length === 0) return null;

  const sorted = [...sources].sort((a, b) => ORDERED.indexOf(a.source) - ORDERED.indexOf(b.source));
  const { cautPct, neutralPct, headline, summary, sentiment, isCautious } = getSummary(sorted);

  return (
    <motion.section
      aria-labelledby="ni-heading"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.50, ease: EASE }}
    >
      {/* Header */}
      <div className="mb-4 px-1">
        <h2 id="ni-heading" className="text-[22px] font-bold" style={{ color: 'rgba(255,255,255,0.96)' }}>
          Narrative Intelligence
        </h2>
        <p className="text-[13px] mt-1" style={{ color: 'rgba(255,255,255,0.38)', maxWidth: '480px' }}>
          A calm read on how major outlets are framing risk, growth, and policy.
        </p>
      </div>

      {/* Outer glass shell */}
      <div className="relative rounded-[24px] overflow-hidden" style={GLASS_OUTER}>
        <Specular />
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '80px',
          background: 'radial-gradient(ellipse at 50% -10%, rgba(110,180,255,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="relative z-10 p-5 space-y-4">
          {/* 1. Hero Pulse */}
          <NarrativePulse
            headline={headline}
            summary={summary}
            sentiment={sentiment}
            isCautious={isCautious}
            cautPct={cautPct}
            neutralPct={neutralPct}
            totalOutlets={sorted.length}
          />

          {/* 2. Signal Strip */}
          <SignalStrip
            drivers={DRIVERS}
            selected={selectedDriver}
            onSelect={(d) => setSelectedDriver(p => p === d ? null : d)}
            onClear={() => setSelectedDriver(null)}
          />

          {/* 3. Market Implications */}
          <MarketImplications drivers={DRIVERS} />

          {/* 4. Sources Drawer */}
          <SourcesDrawer sources={sources} highlightedDriver={selectedDriver} />
        </div>
      </div>
    </motion.section>
  );
}