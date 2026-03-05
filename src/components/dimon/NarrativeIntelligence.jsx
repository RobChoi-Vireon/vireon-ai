import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';

// ─── OS HORIZON NARRATIVE INTELLIGENCE DESIGN TOKENS ────────────────────────
const TOKENS = {
  color: {
    bg_base: '#0B0F17',
    text_primary: '#D5DCE5',
    text_secondary: '#9AA6B2',
    hairline: 'rgba(255,255,255,0.06)',
    glass_primary: 'rgba(20,25,35,0.45)',
    glass_secondary: 'rgba(20,25,35,0.30)',
    deep_glass: 'rgba(10,15,25,0.55)',
    accent_caution: '#FFB066',
    accent_positive: '#5FD1A3',
    accent_neutral: '#A0AEC0',
  },
  blur: '18px',
  radius_panel: '18px',
  radius_row: '12px',
  radius_chip: '999px',
  shadow: '0 10px 30px rgba(0,0,0,0.35)',
  motion: '160ms',
};

// ─── HERO PANEL — NARRATIVE PULSE ─────────────────────────────────────────
const HeroPanel = ({ sentiment, outlets, window, confidence }) => {
  const cautious = sentiment?.cautious || 71;
  const neutral = sentiment?.neutral || 29;
  const cautious_pct = cautious;
  const neutral_pct = neutral;

  const getStatusBadgeStyle = (pct) => {
    if (pct >= 70) {
      return {
        bg: 'rgba(255,176,102,0.14)',
        border: 'rgba(255,176,102,0.22)',
        text: '#FFB066',
        label: 'Mildly Cautious'
      };
    }
    if (pct >= 50) {
      return {
        bg: 'rgba(170,172,180,0.14)',
        border: 'rgba(170,172,180,0.22)',
        text: '#A0AEC0',
        label: 'Mixed View'
      };
    }
    return {
      bg: 'rgba(95,209,163,0.14)',
      border: 'rgba(95,209,163,0.22)',
      text: '#5FD1A3',
      label: 'Optimistic'
    };
  };

  const statusBadge = getStatusBadgeStyle(cautious_pct);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
      className="rounded-[18px] overflow-hidden relative"
      style={{
        background: TOKENS.color.glass_primary,
        backdropFilter: `blur(${TOKENS.blur}) saturate(150%)`,
        WebkitBackdropFilter: `blur(${TOKENS.blur}) saturate(150%)`,
        border: `1px ${TOKENS.color.hairline}`,
        boxShadow: TOKENS.shadow,
        padding: '28px'
      }}
    >
      {/* Top specular edge */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '15%',
          right: '15%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
          pointerEvents: 'none'
        }}
      />

      {/* ── Row 1: Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.48)', textTransform: 'uppercase' }}>
          Narrative Pulse
        </h3>
        <div
          style={{
            padding: '6px 12px',
            borderRadius: '10px',
            background: statusBadge.bg,
            border: `1px ${statusBadge.border}`,
            color: statusBadge.text,
            fontSize: '12px',
            fontWeight: 500,
            transition: `all ${TOKENS.motion} ease`
          }}
        >
          {statusBadge.label}
        </div>
      </div>

      {/* ── Row 2: Headline + Subcopy ── */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 600, letterSpacing: '-0.01em', color: TOKENS.color.text_primary, marginBottom: '8px', lineHeight: 1.3 }}>
          Markets are playing it safe — mixed signals on borrowing, policy costs.
        </h2>
        <p style={{ fontSize: '14px', color: 'rgba(213,220,229,0.75)', lineHeight: 1.6, maxWidth: '760px' }}>
          New government rules are creating costs for companies. Borrowing is getting harder and more expensive, especially for companies in emerging markets. China's slowdown is making investors cautious.
        </p>
      </div>

      {/* ── Row 3: Sentiment Mix Bar ── */}
      <div style={{ marginBottom: '18px' }}>
        <div
          style={{
            height: '8px',
            borderRadius: '6px',
            background: 'rgba(255,255,255,0.08)',
            overflow: 'hidden',
            display: 'flex',
            width: '100%'
          }}
        >
          {/* Cautious segment */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${cautious_pct}%` }}
            transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
            style={{
              background: `linear-gradient(90deg, #F7A44C, #FF6B3D)`,
              transition: `width 0.8s ease`
            }}
          />
          {/* Neutral segment */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${neutral_pct}%` }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
            style={{
              background: `linear-gradient(90deg, #6B7A90, #A0AEC0)`,
              transition: `width 0.8s ease`
            }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', fontSize: '12px', color: TOKENS.color.text_secondary }}>
          <div />
          <span>Cautious {cautious_pct}% / Neutral {neutral_pct}%</span>
        </div>
      </div>

      {/* ── Meta Pills ── */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {[
          { label: 'Outlets', value: outlets || '7' },
          { label: 'Window', value: window || '24h' },
          { label: 'Confidence', value: confidence || 'Moderate' }
        ].map((pill, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.05 }}
            style={{
              padding: '6px 10px',
              borderRadius: TOKENS.radius_chip,
              background: 'rgba(255,255,255,0.04)',
              border: `1px ${TOKENS.color.hairline}`,
              fontSize: '12px',
              color: TOKENS.color.text_secondary,
              whiteSpace: 'nowrap'
            }}
          >
            <span style={{ fontWeight: 500, color: 'rgba(255,255,255,0.65)' }}>{pill.label}</span>
            <span style={{ marginLeft: '4px', color: TOKENS.color.text_secondary }}>{pill.value}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// ─── DRIVERS — FLOATING NARRATIVE CHIPS ────────────────────────────────────
const DriversSection = ({ drivers = [] }) => {
  const defaultDrivers = [
    'Policy tightening driving compliance costs',
    'Credit stress in emerging markets',
    'Sector divergence (energy vs industrial)',
    'China slowdown moderating global growth'
  ];

  const driverList = drivers.length > 0 ? drivers : defaultDrivers;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div style={{ marginBottom: '14px' }}>
        <h3 style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.48)', textTransform: 'uppercase' }}>
          Narrative Drivers
        </h3>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {driverList.map((driver, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 + i * 0.04 }}
            className="group"
            style={{
              padding: '10px 14px',
              borderRadius: TOKENS.radius_chip,
              background: 'rgba(255,255,255,0.04)',
              border: `1px ${TOKENS.color.hairline}`,
              backdropFilter: `blur(8px)`,
              WebkitBackdropFilter: `blur(8px)`,
              fontSize: '13px',
              color: TOKENS.color.text_secondary,
              cursor: 'default',
              transition: `all ${TOKENS.motion} ease`,
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              maxWidth: '280px'
            }}
            whileHover={{
              background: 'rgba(255,255,255,0.08)',
              y: -1,
              boxShadow: '0 6px 16px rgba(0,0,0,0.35)',
              transition: { duration: 0.16 }
            }}
            title={driver}
          >
            {driver}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// ─── IMPACT INTELLIGENCE — 2×2 GRID ───────────────────────────────────────
const ImpactIntelligence = ({ implications = [] }) => {
  const defaultImplications = [
    {
      label: 'WATCH Tech Compliance',
      title: 'Rising costs eat into profits',
      description: 'New regulations will increase company spending on compliance by 40-60%. Watch for earnings guidance cuts.'
    },
    {
      label: 'WATCH Credit Conditions',
      title: 'Refinancing challenges ahead',
      description: 'Emerging market companies face higher borrowing costs. M&A activity likely to slow in Q1.'
    },
    {
      label: 'OPPORTUNITY Supply Chain',
      title: 'Lower material costs',
      description: 'China slowdown reducing input costs for U.S. manufacturers. Industrial stocks may benefit.'
    },
    {
      label: 'WATCH Policy Risk',
      title: 'Fiscal package uncertainty',
      description: 'Congressional gridlock could delay infrastructure and defense spending. Political risk increasing.'
    }
  ];

  const implList = implications.length > 0 ? implications : defaultImplications;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div style={{ marginBottom: '14px' }}>
        <h3 style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.48)', textTransform: 'uppercase' }}>
          Impact Intelligence
        </h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
        {implList.slice(0, 4).map((impl, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 + i * 0.06 }}
            className="group"
            style={{
              background: TOKENS.color.glass_secondary,
              backdropFilter: `blur(16px)`,
              WebkitBackdropFilter: `blur(16px)`,
              border: `1px ${TOKENS.color.hairline}`,
              borderRadius: TOKENS.radius_panel,
              padding: '20px',
              transition: `all ${TOKENS.motion} ease`,
              cursor: 'default'
            }}
            whileHover={{
              y: -2,
              boxShadow: '0 10px 24px rgba(0,0,0,0.45)',
              transition: { duration: 0.16 }
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.48)', textTransform: 'uppercase', marginBottom: '8px' }}>
              {impl.label || 'SIGNAL'}
            </div>
            <h4 style={{ fontSize: '15px', fontWeight: 600, color: TOKENS.color.text_primary, marginBottom: '6px', lineHeight: 1.3 }}>
              {impl.title || 'Untitled'}
            </h4>
            <p style={{ fontSize: '13px', color: TOKENS.color.text_secondary, lineHeight: 1.5 }}>
              {impl.description || 'No description'}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// ─── SOURCES — GLASS INTELLIGENCE LIST ─────────────────────────────────────
const SourceItem = ({ source, index, onExpand, isExpanded }) => {
  const getSentimentColor = (topline) => {
    const lower = (topline || '').toLowerCase();
    if (lower.includes('risk') || lower.includes('concern') || lower.includes('stress')) {
      return { bg: 'rgba(255,120,80,0.14)', border: 'rgba(255,120,80,0.22)', text: '#FF8C6B', label: 'Cautious' };
    }
    if (lower.includes('positive') || lower.includes('opportunity') || lower.includes('growth')) {
      return { bg: 'rgba(80,200,150,0.14)', border: 'rgba(80,200,150,0.22)', text: '#5FD1A3', label: 'Positive' };
    }
    return { bg: 'rgba(120,140,170,0.12)', border: 'rgba(120,140,170,0.20)', text: '#9BA7BA', label: 'Neutral' };
  };

  const sentiment = getSentimentColor(source?.topline);
  const label = source?.name || `Source ${index + 1}`;
  const context = source?.specialty || 'General';

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.4 + index * 0.04 }}
      style={{ marginBottom: '10px' }}
    >
      {/* Main Row */}
      <motion.div
        onClick={() => onExpand(index)}
        style={{
          padding: '14px',
          borderRadius: TOKENS.radius_row,
          background: 'rgba(255,255,255,0.03)',
          border: `1px rgba(255,255,255,0.04)`,
          transition: `all ${TOKENS.motion} ease`,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}
        whileHover={{
          background: 'rgba(255,255,255,0.06)',
          x: 2,
          transition: { duration: 0.12 }
        }}
      >
        {/* Left cluster */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1, minWidth: 0 }}>
          {/* Icon puck */}
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: getSourceColor(label).bg,
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              fontSize: '13px',
              fontWeight: 700,
              color: getSourceColor(label).text,
              boxShadow: '0 4px 12px rgba(0,0,0,0.24)'
            }}
          >
            {getSourceAbbrev(label)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '15px', fontWeight: 600, color: TOKENS.color.text_primary, marginBottom: '3px' }}>
              {label}
            </div>
            <div style={{ fontSize: '12px', color: TOKENS.color.text_secondary, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {context}
            </div>
          </div>
        </div>

        {/* Right cluster */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <div
            style={{
              padding: '6px 12px',
              borderRadius: '10px',
              background: sentiment.bg,
              border: `1px ${sentiment.border}`,
              color: sentiment.text,
              fontSize: '11px',
              fontWeight: 500,
              whiteSpace: 'nowrap'
            }}
          >
            {sentiment.label}
          </div>
          <ChevronRight
            className="w-4 h-4"
            style={{
              color: 'rgba(255,255,255,0.35)',
              transition: `transform ${TOKENS.motion} ease`,
              transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)'
            }}
          />
        </div>
      </motion.div>

      {/* Expandable drawer */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              overflow: 'hidden',
              marginTop: '10px'
            }}
          >
            <div
              style={{
                background: TOKENS.color.deep_glass,
                backdropFilter: `blur(20px)`,
                WebkitBackdropFilter: `blur(20px)`,
                border: `1px rgba(255,255,255,0.04)`,
                borderRadius: TOKENS.radius_row,
                padding: '18px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '24px'
              }}
            >
              {/* Left column */}
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Primary Topic
                </div>
                <p style={{ fontSize: '13px', color: TOKENS.color.text_secondary, lineHeight: 1.5, marginBottom: '14px' }}>
                  {source?.topline || 'No topic'}
                </p>

                <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Coverage Context
                </div>
                <p style={{ fontSize: '13px', color: TOKENS.color.text_secondary, lineHeight: 1.5 }}>
                  {source?.market_macro || 'General market focus'}
                </p>
              </div>

              {/* Right column */}
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Sentiment
                </div>
                <div
                  style={{
                    padding: '8px 12px',
                    borderRadius: '10px',
                    background: sentiment.bg,
                    border: `1px ${sentiment.border}`,
                    color: sentiment.text,
                    fontSize: '12px',
                    fontWeight: 600,
                    marginBottom: '14px',
                    display: 'inline-block'
                  }}
                >
                  {sentiment.label}
                </div>

                <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Latest Headline
                </div>
                <p style={{ fontSize: '13px', color: TOKENS.color.text_secondary, lineHeight: 1.5, fontStyle: 'italic' }}>
                  {source?.policy || 'No recent headline'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const getSourceColor = (sourceName) => {
  const colorMap = {
    'Washington Post': { bg: '#3B5FD9', text: '#FFFFFF' },
    'New York Times': { bg: '#1E3A5F', text: '#FFFFFF' },
    'Wall Street Journal': { bg: '#FF6B35', text: '#FFFFFF' },
    'Financial Times': { bg: '#D946A6', text: '#FFFFFF' },
    'The Economist': { bg: '#F59E0B', text: '#FFFFFF' },
    'Axios': { bg: '#6B7280', text: '#FFFFFF' },
    'Politico': { bg: '#8B5CF6', text: '#FFFFFF' }
  };
  return colorMap[sourceName] || { bg: 'rgba(255,255,255,0.08)', text: '#FFFFFF' };
};

const getSourceAbbrev = (sourceName) => {
  const abbrevMap = {
    'Washington Post': 'WP',
    'New York Times': 'NYT',
    'Wall Street Journal': 'WSJ',
    'Financial Times': 'FT',
    'The Economist': 'TE',
    'Axios': 'AX',
    'Politico': 'PO'
  };
  return abbrevMap[sourceName] || sourceName.charAt(0);
};

const SourcesSummaryBar = ({ sources, isExpanded, onToggle }) => {
  const defaultSources = [
    { name: 'Washington Post', specialty: 'Policy', topline: 'Tech oversight increasing', policy: 'Congressional committees signaling more enforcement ahead' },
    { name: 'New York Times', specialty: 'Domestic', topline: 'Clean energy gaining', market_macro: 'Consumer spending showing mixed results' },
    { name: 'Wall Street Journal', specialty: 'Markets', topline: 'M&A activity declining', policy: 'Company executives expect interest rates to stay high' },
    { name: 'Financial Times', specialty: 'Global', topline: 'China slowdown', market_macro: 'Export patterns changing' },
    { name: 'The Economist', specialty: 'Analysis', topline: 'Structural headwinds', policy: 'Central banks face credibility test' },
    { name: 'Axios', specialty: 'DC', topline: 'AI executive action', policy: 'Bipartisan support forming around data privacy' },
    { name: 'Politico', specialty: 'Politics', topline: 'Fiscal gridlock', market_macro: 'Defense and infrastructure spending at risk' }
  ];

  const sourceList = sources.length > 0 ? sources : defaultSources;
  const visibleCount = 6;
  const hasOverflow = sourceList.length > visibleCount;
  const displaySources = sourceList.slice(0, visibleCount);

  // Sentiment mix: map to dots (simplified: assume balanced mix)
  const sentimentDots = [
    { color: 'rgba(255,176,102,0.85)', label: 'Cautious' },
    { color: 'rgba(160,174,192,0.80)', label: 'Neutral' },
    { color: 'rgba(95,209,163,0.85)', label: 'Positive' },
    { color: 'rgba(255,176,102,0.85)', label: 'Cautious' },
    { color: 'rgba(160,174,192,0.80)', label: 'Neutral' },
    { color: 'rgba(255,176,102,0.85)', label: 'Cautious' },
    { color: 'rgba(160,174,192,0.80)', label: 'Neutral' }
  ];

  return (
    <motion.div
      onClick={onToggle}
      style={{
        height: '56px',
        background: 'rgba(30,40,60,0.28)',
        backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))',
        backdropFilter: 'blur(22px)',
        WebkitBackdropFilter: 'blur(22px)',
        border: `1px solid rgba(255,255,255,0.08)`,
        borderRadius: '18px',
        padding: '12px 14px',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.02) inset, 0 12px 40px rgba(0,0,0,0.35)',
        transition: `all 180ms ease`,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px'
      }}
      whileHover={{
        background: 'rgba(30,40,60,0.36)',
        border: `1px solid rgba(255,255,255,0.10)`,
        y: -1,
        transition: { duration: 0.18 }
      }}
    >
      {/* Left: Label + Helper */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '3px' }}>
        <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.70)', textTransform: 'uppercase' }}>
          Intelligence Sources ({sourceList.length})
        </div>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.60)', lineHeight: 1 }}>
          Tap to view coverage
        </div>
      </div>

      {/* Middle: Outlet Pills + Overflow */}
      <div style={{ display: isExpanded ? 'none' : 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        {displaySources.map((source, i) => {
          const color = getSourceColor(source.name);
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: i * 0.02 }}
              title={source.name}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: isExpanded ? 'rgba(255,255,255,0.10)' : color.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 700,
                color: isExpanded ? 'rgba(255,255,255,0.35)' : color.text,
                flexShrink: 0,
                cursor: 'default',
                boxShadow: isExpanded ? 'none' : '0 4px 12px rgba(0,0,0,0.24)',
                filter: isExpanded ? 'saturate(0.8)' : 'saturate(1)',
                transition: 'all 180ms ease'
              }}
            >
              {getSourceAbbrev(source.name)}
            </motion.div>
          );
        })}
        {hasOverflow && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: visibleCount * 0.02 }}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: isExpanded ? 'rgba(255,255,255,0.10)' : '#8B5CF6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 700,
              color: isExpanded ? 'rgba(255,255,255,0.35)' : '#FFFFFF',
              flexShrink: 0,
              boxShadow: isExpanded ? 'none' : '0 4px 12px rgba(0,0,0,0.24)',
              cursor: 'default',
              filter: isExpanded ? 'saturate(0.8)' : 'saturate(1)',
              transition: 'all 180ms ease'
            }}
            title="Politico"
          >
            PO
          </motion.div>
        )}
      </div>

      {/* Right: Sentiment Dots + Chevron */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        {/* Sentiment dots */}
        <div style={{ display: 'flex', gap: '5px' }}>
          {sentimentDots.map((dot, i) => (
            <motion.div
              key={i}
              title={dot.label}
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'easeInOut'
              }}
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#FFFFFF',
                flexShrink: 0,
                boxShadow: '0 0 6px rgba(255,255,255,0.5)'
              }}
            />
          ))}
        </div>

        {/* Chevron */}
        <ChevronDown
          className="w-4 h-4"
          style={{
            color: 'rgba(255,255,255,0.40)',
            transition: `transform ${TOKENS.motion} ease`,
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            flexShrink: 0
          }}
        />
      </div>
    </motion.div>
  );
};

const SourcesSection = ({ sources = [] }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [isSourcesExpanded, setIsSourcesExpanded] = useState(false);

  const defaultSources = [
    { name: 'Washington Post', specialty: 'Policy', topline: 'Tech oversight increasing', policy: 'Congressional committees signaling more enforcement ahead' },
    { name: 'New York Times', specialty: 'Domestic', topline: 'Clean energy gaining', market_macro: 'Consumer spending showing mixed results' },
    { name: 'Wall Street Journal', specialty: 'Markets', topline: 'M&A activity declining', policy: 'Company executives expect interest rates to stay high' },
    { name: 'Financial Times', specialty: 'Global', topline: 'China slowdown', market_macro: 'Export patterns changing' },
    { name: 'The Economist', specialty: 'Analysis', topline: 'Structural headwinds', policy: 'Central banks face credibility test' },
    { name: 'Axios', specialty: 'DC', topline: 'AI executive action', policy: 'Bipartisan support forming around data privacy' },
    { name: 'Politico', specialty: 'Politics', topline: 'Fiscal gridlock', market_macro: 'Defense and infrastructure spending at risk' }
  ];

  const sourceList = sources.length > 0 ? sources : defaultSources;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.45 }}
    >
      {/* Summary bar (always visible, acts as toggle) */}
      <SourcesSummaryBar
        sources={sourceList}
        isExpanded={isSourcesExpanded}
        onToggle={() => setIsSourcesExpanded(!isSourcesExpanded)}
      />

      {/* Expanded list */}
      <AnimatePresence>
        {isSourcesExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                background: 'rgba(20,25,35,0.30)',
                backdropFilter: 'blur(18px)',
                WebkitBackdropFilter: 'blur(18px)',
                border: `1px ${TOKENS.color.hairline}`,
                borderRadius: TOKENS.radius_panel,
                padding: '12px'
              }}
            >
              {sourceList.map((source, i) => (
                <SourceItem
                  key={i}
                  source={source}
                  index={i}
                  onExpand={(idx) => setExpandedIndex(expandedIndex === idx ? null : idx)}
                  isExpanded={expandedIndex === i}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────
export default function NarrativeIntelligence({ sources, sentiment, drivers, implications, outlets, window, confidence }) {
  return (
    <div style={{ marginTop: '32px' }}>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '200px',
        background: `linear-gradient(135deg, #0E1420 0%, #101827 50%, #0C1320 100%), radial-gradient(ellipse at 50% 0%, rgba(80,120,160,0.08) 0%, transparent 70%)`,
        pointerEvents: 'none',
        zIndex: 0
      }} />
      <div style={{ marginBottom: '14px', paddingLeft: '8px', position: 'relative', zIndex: 1 }}>
        <h2 style={{ fontSize: '20px', fontWeight: 600, color: TOKENS.color.text_primary, marginBottom: '4px' }}>
          Narrative Intelligence
        </h2>
        <p style={{ fontSize: '13px', color: 'rgba(213,220,229,0.55)', opacity: 0.75, maxWidth: '680px', lineHeight: 1.45 }}>
          Curated synthesis from trusted financial outlets.
        </p>
      </div>

      {/* Hero Panel */}
      <div style={{ marginBottom: '28px' }}>
        <HeroPanel sentiment={sentiment} outlets={outlets} window={window} confidence={confidence} />
      </div>

      {/* Drivers */}
      <div style={{ marginBottom: '28px' }}>
        <DriversSection drivers={drivers} />
      </div>

      {/* Impact Intelligence */}
      <div style={{ marginBottom: '28px' }}>
        <ImpactIntelligence implications={implications} />
      </div>

      {/* Sources */}
      <div>
        <SourcesSection sources={sources} />
      </div>
    </div>
  );
}