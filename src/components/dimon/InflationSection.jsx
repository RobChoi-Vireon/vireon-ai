// 🔒 OS HORIZON INFLATION SECTION — Apple-Grade Hierarchy Rebuild
// Layout: Hero + MetricStrip + Explain (Segmented) + Impact (Pills + Drawer)
// Compliance: CEP, VisionOS depth, macOS Tahoe, 120–240ms motion

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, TrendingUp, DollarSign, Home, ChevronDown, X, AlertCircle, Clock, Target } from 'lucide-react';

// ============================================================================
// MOTION & GLASS TOKENS
// ============================================================================
const MOTION = {
  ease: [0.16, 1, 0.3, 1],
  easeSoft: [0.22, 0.61, 0.36, 1],
  lift: { duration: 0.16, ease: [0.22, 0.61, 0.36, 1] },
  press: { duration: 0.09, ease: [0.26, 0.11, 0.26, 1.0] }
};

const GLASS = {
  hero: {
    bg: 'linear-gradient(160deg, rgba(255, 200, 100, 0.07) 0%, rgba(35, 40, 48, 0.68) 35%, rgba(22, 26, 33, 0.82) 100%)',
    blur: 'blur(38px) saturate(162%)',
    border: '1px solid rgba(255,255,255,0.09)',
    shadow: 'inset 0 1.5px 0 rgba(255,255,255,0.07), 0 16px 48px -12px rgba(0,0,0,0.40)',
    radius: '22px'
  },
  card: {
    bg: 'linear-gradient(180deg, rgba(255, 255, 255, 0.042) 0%, rgba(255, 255, 255, 0.026) 100%)',
    blur: 'blur(30px) saturate(165%)',
    border: '1px solid rgba(255,255,255,0.07)',
    shadow: 'inset 0 0.5px 0 rgba(255,255,255,0.06), 0 3px 14px rgba(0,0,0,0.07)',
    radius: '22px'
  }
};

// ============================================================================
// MINI SPARKLINE — 8 Data Points
// ============================================================================
const MiniSparkline = ({ data, color = 'rgba(110, 180, 255, 0.6)' }) => {
  if (!data || data.length < 2) return null;
  
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * 100;
    const y = 100 - ((val - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        style={{ opacity: 0.9 }}
      />
    </svg>
  );
};

// ============================================================================
// RADIAL ARCS — Interactive Scrubbing Visual
// ============================================================================
const RadialArcs = ({ metrics, scrubIndex, onHover }) => {
  const arcData = [
    { label: 'Everyday', value: metrics.everyday, color: 'rgba(255, 190, 90, 0.75)', max: 6 },
    { label: 'Services', value: metrics.services, color: 'rgba(220, 150, 100, 0.70)', max: 6 },
    { label: 'PCE', value: metrics.pce, color: 'rgba(140, 170, 210, 0.70)', max: 6 },
    { label: 'Core', value: metrics.core, color: 'rgba(110, 180, 255, 0.75)', max: 6 }
  ];

  const centerX = 180;
  const centerY = 180;
  const baseRadius = 60;
  const arcSpacing = 18;

  const createArc = (radius, startAngle, endAngle) => {
    const start = (startAngle - 90) * (Math.PI / 180);
    const end = (endAngle - 90) * (Math.PI / 180);
    const x1 = centerX + radius * Math.cos(start);
    const y1 = centerY + radius * Math.sin(start);
    const x2 = centerX + radius * Math.cos(end);
    const y2 = centerY + radius * Math.sin(end);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`;
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg width="360" height="360" viewBox="0 0 360 360" className="transform rotate-0">
        {arcData.map((arc, idx) => {
          const radius = baseRadius + (idx * arcSpacing);
          const percent = (arc.value / arc.max) * 100;
          const arcLength = (percent / 100) * 270;
          const endAngle = 135 + arcLength;

          return (
            <motion.path
              key={idx}
              d={createArc(radius, 135, endAngle)}
              fill="none"
              stroke={arc.color}
              strokeWidth="12"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.5 + idx * 0.1, ease: MOTION.ease }}
              onMouseEnter={() => onHover && onHover(idx)}
              onMouseLeave={() => onHover && onHover(null)}
              style={{ cursor: 'pointer' }}
            />
          );
        })}
        
        {/* Center label */}
        <text
          x={centerX}
          y={centerY - 10}
          textAnchor="middle"
          fill="rgba(255,255,255,0.46)"
          fontSize="12"
          fontWeight="600"
        >
          {scrubIndex !== null ? `Period ${scrubIndex + 1}` : 'Current'}
        </text>
        <text
          x={centerX}
          y={centerY + 10}
          textAnchor="middle"
          fill="rgba(255,255,255,0.82)"
          fontSize="20"
          fontWeight="700"
        >
          {metrics.everyday.toFixed(1)}%
        </text>
      </svg>
    </div>
  );
};

// ============================================================================
// HERO CARD — Signature Snapshot + Scrub
// ============================================================================
const InflationHero = ({ data, onScrub }) => {
  const [hoveredArc, setHoveredArc] = useState(null);
  const [scrubIndex, setScrubIndex] = useState(null);

  const currentMetrics = {
    everyday: parseFloat(data?.cpi_headline_yoy || 3.4),
    services: 3.9,
    pce: parseFloat(data?.pce_headline_yoy || 2.6),
    core: parseFloat(data?.pce_core_yoy || 2.9)
  };

  return (
    <motion.div
      className="relative overflow-hidden"
      style={{
        padding: '40px 36px',
        background: GLASS.hero.bg,
        backdropFilter: GLASS.hero.blur,
        WebkitBackdropFilter: GLASS.hero.blur,
        border: GLASS.hero.border,
        borderRadius: GLASS.hero.radius,
        boxShadow: GLASS.hero.shadow
      }}
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.2, ease: MOTION.ease }}
      whileHover={{ y: -2, boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.09), 0 18px 54px -12px rgba(0,0,0,0.48)' }}
    >
      {/* Noise */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        opacity: 0.014,
        mixBlendMode: 'overlay',
        borderRadius: GLASS.hero.radius,
        pointerEvents: 'none'
      }} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left: Narrative */}
        <div>
          <motion.div
            className="text-xs font-bold uppercase tracking-wider mb-3"
            style={{ color: 'rgba(255, 190, 90, 0.72)', letterSpacing: '0.18em' }}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Inflation Snapshot
          </motion.div>

          <motion.h3
            className="text-4xl font-bold mb-4"
            style={{ color: 'rgba(255,255,255,0.98)', letterSpacing: '-0.02em' }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            Trend: Cooling, still sticky
          </motion.h3>

          <motion.p
            className="text-base leading-relaxed"
            style={{ color: 'rgba(230, 238, 252, 0.84)', fontWeight: 450 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            Rent + services are the drag.
          </motion.p>
        </div>

        {/* Right: Radial Arcs */}
        <div className="flex justify-center">
          <RadialArcs
            metrics={currentMetrics}
            scrubIndex={scrubIndex}
            onHover={setHoveredArc}
          />
        </div>
      </div>
    </motion.div>
  );
};

// ============================================================================
// METRIC STRIP — 4 Mini Tiles with Deltas + Sparklines
// ============================================================================
const MetricTile = ({ label, value, delta, sparklineData, isFedWatch, delay, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const deltaColor = delta >= 0 ? 'rgba(255, 120, 100, 0.85)' : 'rgba(110, 220, 180, 0.85)';

  return (
    <motion.button
      className="relative overflow-hidden text-left w-full"
      style={{
        padding: '20px 18px',
        background: GLASS.card.bg,
        backdropFilter: GLASS.card.blur,
        WebkitBackdropFilter: GLASS.card.blur,
        border: GLASS.card.border,
        borderRadius: GLASS.card.radius,
        boxShadow: GLASS.card.shadow
      }}
      initial={{ opacity: 0, y: 15, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay, ease: MOTION.ease }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      whileHover={{ y: -2, boxShadow: 'inset 0 0.5px 0 rgba(255,255,255,0.08), 0 4px 18px rgba(0,0,0,0.10)' }}
      whileTap={{ scale: 0.99, transition: MOTION.press }}
    >
      {/* Top Specular */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '12%',
        right: '12%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)',
        pointerEvents: 'none'
      }} />

      {/* Label */}
      <div className="text-xs font-medium mb-2" style={{ color: 'rgba(255,255,255,0.52)' }}>
        {label}
      </div>

      {/* Value + Delta */}
      <div className="flex items-baseline gap-2 mb-3">
        <div className="text-2xl font-bold tabular-nums" style={{ color: 'rgba(255,255,255,0.96)' }}>
          {value}
        </div>
        {delta !== undefined && (
          <div
            className="text-xs font-semibold tabular-nums px-1.5 py-0.5 rounded"
            style={{
              color: deltaColor,
              background: `${deltaColor.replace('0.85', '0.10')}`
            }}
          >
            {delta >= 0 ? '+' : ''}{delta.toFixed(1)}
          </div>
        )}
      </div>

      {/* Sparkline */}
      {sparklineData && (
        <div className="h-8 opacity-70">
          <MiniSparkline data={sparklineData} />
        </div>
      )}

      {/* Fed Watch Chip */}
      {isFedWatch && (
        <div
          className="mt-2 inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full"
          style={{
            background: 'rgba(110, 180, 255, 0.10)',
            border: '1px solid rgba(110, 180, 255, 0.18)',
            color: 'rgba(110, 180, 255, 0.88)'
          }}
        >
          Policy sensitive
        </div>
      )}
    </motion.button>
  );
};

const MetricStrip = ({ data, onTileClick }) => {
  const mockSparkline = [3.2, 3.3, 3.5, 3.6, 3.4, 3.3, 3.4, 3.4];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <MetricTile
        label="Everyday"
        value={`${data?.cpi_headline_yoy || 3.4}%`}
        delta={0.1}
        sparklineData={mockSparkline}
        delay={0.5}
        onClick={() => onTileClick('drivers')}
      />
      <MetricTile
        label="Services"
        value="3.9%"
        delta={-0.1}
        sparklineData={mockSparkline.map(v => v + 0.5)}
        isFedWatch
        delay={0.6}
        onClick={() => onTileClick('drivers')}
      />
      <MetricTile
        label="PCE"
        value={`${data?.pce_headline_yoy || 2.6}%`}
        delta={0.0}
        sparklineData={mockSparkline.map(v => v - 0.8)}
        delay={0.7}
        onClick={() => onTileClick('summary')}
      />
      <MetricTile
        label="Core"
        value={`${data?.pce_core_yoy || 2.9}%`}
        delta={-0.2}
        sparklineData={mockSparkline.map(v => v - 0.5)}
        isFedWatch
        delay={0.8}
        onClick={() => onTileClick('summary')}
      />
    </div>
  );
};

// ============================================================================
// EXPLAIN CARD — Segmented Control + Progressive Disclosure
// ============================================================================
const ExplainCard = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'summary', label: 'Summary' },
    { id: 'drivers', label: 'Drivers' },
    { id: 'feels-high', label: 'Why it feels high' },
    { id: 'watchlist', label: 'Watchlist' }
  ];

  const content = {
    summary: [
      { icon: AlertCircle, text: 'Inflation is easing, but above target.' },
      { icon: Home, text: 'Rent keeps the headline elevated.' },
      { icon: TrendingUp, text: 'Services fall slowly when wages are firm.' }
    ],
    drivers: [
      { icon: Home, text: 'Shelter remains the largest contributor.' },
      { icon: TrendingUp, text: 'Services reflect wage-driven costs.' },
      { icon: ShoppingCart, text: 'Goods are cooler than 2022–23.' }
    ],
    'feels-high': [
      { icon: Home, text: 'Housing is weighted heavily in CPI.' },
      { icon: DollarSign, text: 'PCE tracks what people buy day to day.' },
      { icon: Clock, text: 'Rents reset slowly, keeping pressure.' }
    ],
    watchlist: [
      { icon: AlertCircle, text: 'Rent re-acceleration risk' },
      { icon: TrendingUp, text: 'Wage growth persistence' },
      { icon: Target, text: 'Energy pass-through' }
    ]
  };

  const [expanded, setExpanded] = useState({});

  return (
    <motion.div
      className="relative overflow-hidden"
      style={{
        padding: '28px 32px',
        background: GLASS.card.bg,
        backdropFilter: GLASS.card.blur,
        WebkitBackdropFilter: GLASS.card.blur,
        border: GLASS.card.border,
        borderRadius: GLASS.card.radius,
        boxShadow: GLASS.card.shadow
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.9, ease: MOTION.ease }}
    >
      {/* Top Specular */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '12%',
        right: '12%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)',
        pointerEvents: 'none'
      }} />

      {/* Header */}
      <h3
        className="text-sm font-bold uppercase tracking-wider mb-5"
        style={{ color: 'rgba(255,255,255,0.50)', letterSpacing: '0.16em' }}
      >
        Explain
      </h3>

      {/* Segmented Control */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="relative px-4 py-2 rounded-full text-sm font-medium transition-all"
            style={{
              color: activeTab === tab.id ? 'rgba(255,255,255,0.96)' : 'rgba(255,255,255,0.56)',
              background: activeTab === tab.id
                ? 'rgba(255, 255, 255, 0.10)'
                : 'rgba(255, 255, 255, 0.03)',
              border: activeTab === tab.id
                ? '1px solid rgba(255,255,255,0.16)'
                : '1px solid rgba(255,255,255,0.06)'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          transition={{ duration: 0.3, ease: MOTION.easeSoft }}
          className="space-y-3"
        >
          {content[activeTab].map((item, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <item.icon className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'rgba(180, 200, 230, 0.68)', strokeWidth: 2 }} />
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(230, 238, 252, 0.84)' }}>
                {item.text}
              </p>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

// ============================================================================
// MARKET IMPACT PILLS + DRAWER
// ============================================================================
const ImpactDrawer = ({ impact, onClose }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const drawerContent = {
    rates: {
      why: ['Sticky inflation forces Fed to hold rates high.', 'Policy pivot delayed until clear cooling.'],
      changes: ['Disinflation in services.', 'Wage growth moderating.'],
      sensitive: ['Growth', 'Duration', 'Financials']
    },
    equities: {
      why: ['Higher rates compress valuations.', 'Risk-free yields compete with stocks.'],
      changes: ['Fed rate cuts begin.', 'Earnings growth accelerates.'],
      sensitive: ['Tech', 'Growth', 'Discretionary']
    },
    usd: {
      why: ['High yields attract capital inflows.', 'Safe-haven demand persists.'],
      changes: ['Fed dovish pivot.', 'Global growth rebounds.'],
      sensitive: ['FX', 'EM', 'Commodities']
    }
  };

  const data = drawerContent[impact.id] || drawerContent.rates;

  return (
    <>
      {/* Overlay */}
      <motion.div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        onClick={onClose}
      />

      {/* Drawer */}
      <motion.div
        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md overflow-y-auto"
        style={{
          background: 'linear-gradient(180deg, rgba(20, 24, 32, 0.95) 0%, rgba(16, 20, 28, 0.98) 100%)',
          backdropFilter: 'blur(40px) saturate(165%)',
          WebkitBackdropFilter: 'blur(40px) saturate(165%)',
          borderLeft: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '-20px 0 60px rgba(0,0,0,0.50)'
        }}
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.28, ease: MOTION.ease }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 p-6 border-b border-white/5" style={{
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)'
        }}>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1" style={{ color: 'rgba(255,255,255,0.96)' }}>
                {impact.text}
              </h2>
              <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.48)' }}>
                Market Impact
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-colors hover:bg-white/10"
            >
              <X className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.68)' }} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Why */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: 'rgba(255,255,255,0.50)' }}>
              Why
            </h3>
            <div className="space-y-2">
              {data.why.map((line, idx) => (
                <p key={idx} className="text-sm leading-relaxed" style={{ color: 'rgba(230, 238, 252, 0.84)' }}>
                  {line}
                </p>
              ))}
            </div>
          </div>

          {/* What changes it */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: 'rgba(255,255,255,0.50)' }}>
              What changes it
            </h3>
            <div className="space-y-2">
              {data.changes.map((line, idx) => (
                <p key={idx} className="text-sm leading-relaxed" style={{ color: 'rgba(230, 238, 252, 0.84)' }}>
                  {line}
                </p>
              ))}
            </div>
          </div>

          {/* Sensitive areas */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: 'rgba(255,255,255,0.50)' }}>
              Sensitive areas
            </h3>
            <div className="flex flex-wrap gap-2">
              {data.sensitive.map((area, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{
                    background: 'rgba(110, 180, 255, 0.10)',
                    border: '1px solid rgba(110, 180, 255, 0.20)',
                    color: 'rgba(110, 180, 255, 0.90)'
                  }}
                >
                  {area}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Link */}
        <div className="p-6 border-t border-white/5">
          <button
            className="text-xs font-medium"
            style={{ color: 'rgba(110, 180, 255, 0.80)' }}
          >
            Why this happens →
          </button>
        </div>
      </motion.div>
    </>
  );
};

const MarketImpact = () => {
  const [activeDrawer, setActiveDrawer] = useState(null);

  const impacts = [
    { id: 'rates', text: 'Rates: Higher for longer', severity: 'high', color: 'rgba(255, 120, 100, 0.75)' },
    { id: 'equities', text: 'Equities: Headwind', severity: 'medium', color: 'rgba(240, 170, 90, 0.70)' },
    { id: 'usd', text: 'USD: Supported', severity: 'medium', color: 'rgba(110, 180, 255, 0.68)' }
  ];

  return (
    <>
      <motion.div
        className="relative overflow-hidden"
        style={{
          padding: '28px 32px',
          background: GLASS.card.bg,
          backdropFilter: GLASS.card.blur,
          WebkitBackdropFilter: GLASS.card.blur,
          border: GLASS.card.border,
          borderRadius: GLASS.card.radius,
          boxShadow: GLASS.card.shadow
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.0, ease: MOTION.ease }}
      >
        {/* Top Specular */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '12%',
          right: '12%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)',
          pointerEvents: 'none'
        }} />

        <h3 className="text-sm font-bold uppercase tracking-wider mb-5" style={{ color: 'rgba(255,255,255,0.50)', letterSpacing: '0.16em' }}>
          Market Impact
        </h3>

        <div className="flex flex-wrap gap-3">
          {impacts.map((impact, idx) => (
            <motion.button
              key={impact.id}
              className="px-4 py-2.5 rounded-full text-sm font-medium transition-all"
              style={{
                background: `${impact.color.replace('0.75', '0.08').replace('0.70', '0.08').replace('0.68', '0.08')}`,
                border: `1px solid ${impact.color.replace('0.75', '0.18').replace('0.70', '0.16').replace('0.68', '0.14')}`,
                color: impact.color.replace('0.75', '0.92').replace('0.70', '0.88').replace('0.68', '0.88')
              }}
              onClick={() => setActiveDrawer(impact)}
              whileHover={{ y: -2, scale: 1.02, boxShadow: `0 4px 16px ${impact.color.replace('0.75', '0.20').replace('0.70', '0.18').replace('0.68', '0.16')}` }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.1 + idx * 0.08 }}
            >
              {impact.text}
            </motion.button>
          ))}
        </div>
      </motion.div>

      <AnimatePresence>
        {activeDrawer && (
          <ImpactDrawer impact={activeDrawer} onClose={() => setActiveDrawer(null)} />
        )}
      </AnimatePresence>
    </>
  );
};

// ============================================================================
// MAIN SECTION
// ============================================================================
export default function InflationSection({ data }) {
  const [explainTab, setExplainTab] = useState('summary');

  if (!data) return null;

  const handleTileClick = (tab) => {
    setExplainTab(tab);
    document.querySelector('.explain-card')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  return (
    <div className="space-y-5">
      {/* Section Title */}
      <motion.div
        className="pl-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: MOTION.easeSoft }}
      >
        <h2 className="text-3xl font-bold mb-1" style={{ color: 'rgba(255,255,255,0.96)', letterSpacing: '-0.01em' }}>
          Inflation
        </h2>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.56)' }}>
          CPI · PCE
        </p>
      </motion.div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Hero spans 7 cols on desktop */}
        <div className="lg:col-span-7">
          <InflationHero data={data} />
        </div>

        {/* Metric Strip spans 5 cols on desktop */}
        <div className="lg:col-span-5">
          <MetricStrip data={data} onTileClick={handleTileClick} />
        </div>
      </div>

      {/* Explain Card — Full Width */}
      <div className="explain-card">
        <ExplainCard activeTab={explainTab} setActiveTab={setExplainTab} />
      </div>

      {/* Market Impact — Full Width */}
      <MarketImpact />
    </div>
  );
}