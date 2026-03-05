import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, TrendingUp, TrendingDown, Minus } from 'lucide-react';

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

// ─── Source logos ─────────────────────────────────────────────────────────────
const SOURCE_LOGOS = {
  wapo:      { abbr: 'WP',  bg: '#1a4fa3', label: 'Washington Post' },
  nyt:       { abbr: 'NYT', bg: '#1a1a1a', label: 'New York Times' },
  wsj:       { abbr: 'WSJ', bg: '#c94a00', label: 'Wall Street Journal' },
  ft:        { abbr: 'FT',  bg: '#c6017d', label: 'Financial Times' },
  economist: { abbr: 'ECN', bg: '#b01c1c', label: 'The Economist' },
  axios:     { abbr: 'AXS', bg: '#6d28d9', label: 'Axios' },
  politico:  { abbr: 'POL', bg: '#374151', label: 'Politico' },
};

const orderedSources = ['wapo', 'nyt', 'wsj', 'ft', 'economist', 'axios', 'politico'];

const getSentiment = (source) => {
  const tones = source.tones || [];
  if (tones.includes('cautionary') || tones.includes('alarmist')) return 'cautionary';
  return 'neutral';
};

const getDrivers = () => [
  'Credit Risk', 'China Slowdown', 'Industrial M&A',
  'Clean Energy Growth', 'AI Regulation', 'Fiscal Gridlock',
];

const WATCH_LABELS = ['Watch Spreads', 'Watch Growth', 'Watch Policy', 'Watch Sentiment', 'Watch Flows', 'Watch Yields'];

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
    summary: 'Coverage across major financial publications suggests increasing attention to credit risks and slowing Chinese growth, while industrial M&A and clean energy momentum remain neutral-to-positive themes.',
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

const MicroChip = ({ label }) => (
  <span className="inline-flex items-center px-2.5 py-0.5 text-[10px] font-medium rounded-full"
    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.50)' }}>
    {label}
  </span>
);

// ─── Narrative Board ──────────────────────────────────────────────────────────

const MOMENTUM_CONFIG = {
  Accelerating: { color: 'rgba(251,146,60,0.90)', bg: 'rgba(251,146,60,0.10)', border: 'rgba(251,146,60,0.20)' },
  Building:     { color: 'rgba(94,167,255,0.90)',  bg: 'rgba(94,167,255,0.10)',  border: 'rgba(94,167,255,0.20)'  },
  Stable:       { color: 'rgba(148,163,184,0.80)', bg: 'rgba(148,163,184,0.08)', border: 'rgba(148,163,184,0.15)' },
};

const getMomentum = (sentiment, index) => {
  if (sentiment.toLowerCase().includes('cautious')) return index < 2 ? 'Accelerating' : 'Stable';
  if (sentiment.toLowerCase().includes('positive') || sentiment.toLowerCase().includes('constructive')) return 'Building';
  return index === 0 ? 'Accelerating' : 'Stable';
};

const getDirection = (sentiment, index) => {
  if (sentiment.toLowerCase().includes('cautious')) return index < 2 ? 'down' : 'flat';
  return index === 0 ? 'up' : 'flat';
};

const DirectionArrow = ({ dir, hovered }) => {
  const config = {
    up:   { Icon: TrendingUp,   color: 'rgba(88,227,164,0.85)',  glow: 'rgba(88,227,164,0.40)'  },
    down: { Icon: TrendingDown, color: 'rgba(251,146,60,0.85)',  glow: 'rgba(251,146,60,0.40)'  },
    flat: { Icon: Minus,        color: 'rgba(148,163,184,0.70)', glow: 'rgba(148,163,184,0.30)' },
  }[dir] || { Icon: Minus, color: 'rgba(148,163,184,0.70)', glow: 'rgba(148,163,184,0.30)' };

  return (
    <motion.div
      animate={{ y: hovered ? (dir === 'up' ? -1 : dir === 'down' ? 1 : 0) : 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <config.Icon
        className="w-4 h-4"
        style={{
          color: config.color,
          filter: hovered ? `drop-shadow(0 0 5px ${config.glow})` : 'none',
          transition: 'filter 0.18s ease',
          strokeWidth: 2
        }}
      />
    </motion.div>
  );
};

const MomentumPill = ({ label }) => {
  const c = MOMENTUM_CONFIG[label] || MOMENTUM_CONFIG.Stable;
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 text-[10px] font-bold rounded-full"
      style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.color }}>
      {label}
    </span>
  );
};

const WatchPill = ({ label }) => (
  <span className="inline-flex items-center px-2.5 py-0.5 text-[10px] font-semibold rounded-full flex-shrink-0"
    style={{ background: 'rgba(94,167,255,0.07)', border: '1px solid rgba(94,167,255,0.14)', color: 'rgba(94,167,255,0.72)' }}>
    {label}
  </span>
);

const BoardRow = ({ narrative, direction, momentum, watch, index }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.06 * index, duration: 0.28, ease: HORIZON_EASE }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-center gap-4 px-4"
      style={{
        height: '52px',
        borderRadius: '12px',
        background: hovered ? 'rgba(255,255,255,0.04)' : 'transparent',
        borderTop: index > 0 ? '1px solid rgba(255,255,255,0.04)' : 'none',
        transition: 'background 0.16s ease',
      }}
    >
      {/* Narrative */}
      <span className="flex-1 min-w-0 text-[13px] font-medium truncate" style={{ color: hovered ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.78)', transition: 'color 0.16s ease' }}>
        {narrative}
      </span>
      {/* Direction */}
      <div className="w-8 flex justify-center flex-shrink-0">
        <DirectionArrow dir={direction} hovered={hovered} />
      </div>
      {/* Momentum */}
      <div className="w-28 flex justify-center flex-shrink-0">
        <MomentumPill label={momentum} />
      </div>
      {/* Market Watch */}
      <div className="w-32 flex justify-end flex-shrink-0">
        <WatchPill label={watch} />
      </div>
    </motion.div>
  );
};

const NarrativeBoard = ({ drivers, sentiment }) => {
  const rows = drivers.slice(0, 5).map((driver, i) => ({
    narrative: driver,
    direction: getDirection(sentiment, i),
    momentum: getMomentum(sentiment, i),
    watch: WATCH_LABELS[i] || 'Watch Markets',
  }));

  return (
    <div className="space-y-2">
      <div className="flex items-end justify-between px-1">
        <div>
          <p className="text-[15px] font-semibold" style={{ color: 'rgba(255,255,255,0.90)' }}>Narrative Board</p>
          <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.36)' }}>
            Major narratives emerging across financial and policy media.
          </p>
        </div>
      </div>

      <div className="relative rounded-[18px] overflow-hidden" style={GLASS_CARD}>
        <SpecularLine />
        {/* Column headers */}
        <div className="flex items-center gap-4 px-4 py-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="flex-1 text-[9px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.28)', letterSpacing: '0.09em' }}>Narrative</span>
          <span className="w-8 text-center text-[9px] font-bold uppercase tracking-widest flex-shrink-0" style={{ color: 'rgba(255,255,255,0.28)' }}>Dir</span>
          <span className="w-28 text-center text-[9px] font-bold uppercase tracking-widest flex-shrink-0" style={{ color: 'rgba(255,255,255,0.28)' }}>Momentum</span>
          <span className="w-32 text-right text-[9px] font-bold uppercase tracking-widest flex-shrink-0" style={{ color: 'rgba(255,255,255,0.28)' }}>Market Watch</span>
        </div>
        {/* Rows */}
        <div className="py-1 relative z-10">
          {rows.length > 0 ? rows.map((row, i) => (
            <BoardRow key={row.narrative} {...row} index={i} />
          )) : (
            <div className="px-4 py-6 text-center">
              <p className="text-[12px]" style={{ color: 'rgba(255,255,255,0.30)' }}>
                Narrative signals will populate after the next intelligence refresh.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Source Coverage Drawer ───────────────────────────────────────────────────

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

const SourceExpandedView = ({ source }) => {
  const isCautionary = getSentiment(source) === 'cautionary';
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden"
    >
      <div className="mx-2 mb-1.5 p-4 rounded-[12px]"
        style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            {source.topline && (
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.28)' }}>Primary Topic</p>
                <p className="text-[13px] font-bold" style={{ color: 'rgba(255,255,255,0.90)' }}>{source.topline}</p>
              </div>
            )}
            {source.policy && (
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.28)' }}>Coverage Context</p>
                <p className="text-[12px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>{source.policy}</p>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest mb-1.5" style={{ color: 'rgba(255,255,255,0.28)' }}>Sentiment</p>
              <SentimentChip label={isCautionary ? 'Cautionary' : 'Neutral'} isCautionary={isCautionary} />
            </div>
            {source.market_macro && (
              <div className="pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <p className="text-[9px] font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.28)' }}>Latest Headline</p>
                <p className="text-[12px] italic" style={{ color: 'rgba(255,255,255,0.52)', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  "{source.market_macro}"
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="mt-3 pt-3 flex items-center gap-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.25)' }}>What this tilts</span>
          <TiltPills isCautionary={isCautionary} />
        </div>
      </div>
    </motion.div>
  );
};

const SourceItem = ({ source, isOpen, onToggle }) => {
  const [hovered, setHovered] = useState(false);
  const logo = SOURCE_LOGOS[source.source] || { abbr: source.source?.slice(0, 3).toUpperCase(), bg: '#374151', label: source.name };
  const isCautionary = getSentiment(source) === 'cautionary';
  const sentColor = isCautionary ? 'rgba(251,146,60,0.88)' : 'rgba(148,163,184,0.75)';
  const sentBg = isCautionary ? 'rgba(251,146,60,0.10)' : 'rgba(148,163,184,0.07)';
  const sentBorder = isCautionary ? 'rgba(251,146,60,0.20)' : 'rgba(148,163,184,0.12)';

  return (
    <div>
      <motion.button
        onClick={onToggle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="flex items-center gap-3 px-3 py-2.5 rounded-[12px] w-full text-left min-w-0"
        style={{
          background: isOpen ? 'rgba(110,180,255,0.07)' : hovered ? 'rgba(255,255,255,0.04)' : 'transparent',
          border: `1px solid ${isOpen ? 'rgba(110,180,255,0.14)' : 'transparent'}`,
          transition: 'all 0.16s ease',
        }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="w-7 h-7 rounded-[8px] flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
          style={{ background: logo.bg }}>
          {logo.abbr}
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[13px] font-medium block truncate" style={{ color: 'rgba(255,255,255,0.82)' }}>
            {logo.label}
          </span>
          {source.topline && (
            <span className="text-[10px] block truncate" style={{ color: 'rgba(255,255,255,0.36)' }}>
              {source.topline}
            </span>
          )}
        </div>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full flex-shrink-0"
          style={{ background: sentBg, border: `1px solid ${sentBorder}`, color: sentColor }}>
          {isCautionary ? '⚠' : '●'} {isCautionary ? 'Cautionary' : 'Neutral'}
        </span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2, ease: 'easeOut' }}>
          <ChevronDown className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.28)' }} />
        </motion.div>
      </motion.button>
      <AnimatePresence>
        {isOpen && <SourceExpandedView source={source} />}
      </AnimatePresence>
    </div>
  );
};

const SourceCoverageDrawer = ({ sources }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openSourceId, setOpenSourceId] = useState(null);

  const sorted = [...sources].sort((a, b) => orderedSources.indexOf(a.source) - orderedSources.indexOf(b.source));
  const toggleSource = (id) => setOpenSourceId(prev => prev === id ? null : id);

  return (
    <div className="space-y-0">
      {/* Drawer trigger */}
      <motion.button
        onClick={() => setIsOpen(v => !v)}
        className="flex items-center justify-between w-full px-4 py-3.5 rounded-[16px]"
        style={{
          ...GLASS_CARD,
          borderRadius: isOpen ? '16px 16px 0 0' : '16px',
          transition: 'border-radius 0.2s ease',
        }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex items-center gap-3">
          <span className="text-[14px] font-semibold" style={{ color: 'rgba(255,255,255,0.88)' }}>
            Source Coverage
          </span>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.50)' }}>
            {sorted.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
            {isOpen ? 'Collapse' : 'Open to see how each publication is framing the narrative'}
          </span>
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.22, ease: 'easeOut' }}>
            <ChevronDown className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.38)' }} />
          </motion.div>
        </div>
      </motion.button>

      {/* Expanded content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
            style={{
              background: 'linear-gradient(160deg, rgba(18,22,36,0.60) 0%, rgba(10,13,22,0.70) 100%)',
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderTop: 'none',
              borderRadius: '0 0 16px 16px',
            }}
          >
            <div className="p-3 space-y-0.5">
              {sorted.map(s => (
                <SourceItem
                  key={s.source}
                  source={s}
                  isOpen={openSourceId === s.source}
                  onToggle={() => toggleSource(s.source)}
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
  if (!Array.isArray(sources) || sources.length === 0) return null;

  const sorted = [...sources].sort((a, b) => orderedSources.indexOf(a.source) - orderedSources.indexOf(b.source));
  const { cautPct, headline, summary, sentiment } = getNarrativeSummary(sorted);
  const drivers = getDrivers();
  const isCautious = cautPct >= 50;

  return (
    <motion.section
      aria-labelledby="narrative-intelligence-heading"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: HORIZON_EASE }}
    >
      {/* Section header */}
      <div className="mb-5 px-1">
        <h2 id="narrative-intelligence-heading" className="text-[22px] font-bold" style={{ color: 'rgba(255,255,255,0.96)' }}>
          Narrative Intelligence
        </h2>
        <p className="text-[13px] mt-1" style={{ color: 'rgba(255,255,255,0.40)', maxWidth: '500px' }}>
          How major publications are framing risk, growth, and policy — distilled into market-ready narrative signals.
        </p>
      </div>

      {/* Outer glass panel */}
      <div className="relative rounded-[26px] overflow-hidden" style={GLASS_PANEL}>
        <SpecularLine />
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '100px',
          background: 'radial-gradient(ellipse at 50% -10%, rgba(110,180,255,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="relative z-10 p-5 space-y-5">

          {/* 1 — Narrative Pulse */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: HORIZON_EASE }}
            className="relative rounded-[18px] overflow-hidden p-5"
            style={GLASS_CARD}
          >
            <SpecularLine />
            <div className="relative z-10">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0 space-y-1.5">
                  <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.30)', letterSpacing: '0.10em' }}>
                    Narrative Pulse
                  </p>
                  <h3 className="text-[16px] font-bold leading-snug" style={{ color: 'rgba(255,255,255,0.95)' }}>
                    {headline}
                  </h3>
                  <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.56)' }}>
                    {summary}
                  </p>
                </div>
                <SentimentChip label={sentiment} isCautionary={isCautious} />
              </div>
              <div className="flex items-center gap-2 flex-wrap mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <MicroChip label={`Outlets: ${sorted.length}`} />
                <MicroChip label="Window: Latest" />
                <MicroChip label="Confidence: —" />
              </div>
            </div>
          </motion.div>

          {/* 2 — Narrative Board */}
          <NarrativeBoard drivers={drivers} sentiment={sentiment} />

          {/* 3 — Source Coverage Drawer */}
          <SourceCoverageDrawer sources={sources} />

        </div>
      </div>
    </motion.section>
  );
}