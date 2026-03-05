import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';

// ─── OS HORIZON NARRATIVE INTELLIGENCE DESIGN TOKENS ────────────────────────
const TOKENS = {
  font: {
    family: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", sans-serif'
  },
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
const HeroPanel = ({ narrativePulse, timestamp }) => {
  const headline = narrativePulse?.headline;
  const summary = narrativePulse?.summary;
  const badge = narrativePulse?.badge;
  const primaryLabel = narrativePulse?.sentiment?.primary?.label;
  const primaryPct = narrativePulse?.sentiment?.primary?.percentage ?? 0;
  const secondaryLabel = narrativePulse?.sentiment?.secondary?.label;
  const secondaryPct = narrativePulse?.sentiment?.secondary?.percentage ?? 0;
  const confidenceLabel = narrativePulse?.confidence_label;
  const outlets = narrativePulse?.outlets_count;
  const window = narrativePulse?.time_window;

  const getStatusBadgeStyle = (badgeText) => {
    if (!badgeText) return { bg: 'rgba(170,172,180,0.14)', border: 'rgba(170,172,180,0.22)', text: '#A0AEC0', label: 'Unknown' };
    const lower = badgeText.toLowerCase();
    if (lower.includes('strongly bullish')) return { bg: 'rgba(95,209,163,0.14)', border: 'rgba(95,209,163,0.22)', text: '#5FD1A3', label: badgeText };
    if (lower.includes('mildly bullish')) return { bg: 'rgba(132,229,190,0.14)', border: 'rgba(132,229,190,0.22)', text: '#84E5BE', label: badgeText };
    if (lower.includes('neutral')) return { bg: 'rgba(170,172,180,0.14)', border: 'rgba(170,172,180,0.22)', text: '#A0AEC0', label: badgeText };
    if (lower.includes('mildly cautious')) return { bg: 'rgba(255,200,124,0.14)', border: 'rgba(255,200,124,0.22)', text: '#FFC87C', label: badgeText };
    if (lower.includes('strongly cautious')) return { bg: 'rgba(255,176,102,0.14)', border: 'rgba(255,176,102,0.22)', text: '#FFB066', label: badgeText };
    return { bg: 'rgba(170,172,180,0.14)', border: 'rgba(170,172,180,0.22)', text: '#A0AEC0', label: badgeText };
  };

  const statusBadge = getStatusBadgeStyle(badge);
  
  if (!headline) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
      className="rounded-[22px] overflow-hidden relative"
      style={{
        background: 'rgba(30,40,60,0.20)',
        backgroundImage: 'radial-gradient(120% 90% at 20% 0%, rgba(255,255,255,0.06), rgba(255,255,255,0.01) 45%, rgba(255,255,255,0.00) 70%)',
        backdropFilter: `blur(24px)`,
        WebkitBackdropFilter: `blur(24px)`,
        border: `1px solid rgba(255,255,255,0.10)`,
        boxShadow: `0 0 0 1px rgba(255,255,255,0.03) inset, 0 18px 44px rgba(0,0,0,0.35)`,
        padding: '32px'
      }}
    >
      {/* Top specular edge */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '12%',
          right: '12%',
          height: '1.5px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent)',
          pointerEvents: 'none'
        }}
      />

      {/* ── Row 1: Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', position: 'relative', zIndex: 1 }}>
        <h3 style={{ fontFamily: TOKENS.font.family, fontSize: '12px', fontWeight: 600, letterSpacing: '0.10em', color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase' }}>
          Narrative Pulse
        </h3>
        <motion.div
          style={{
            fontFamily: TOKENS.font.family,
            padding: '7px 14px',
            borderRadius: '12px',
            background: statusBadge.bg,
            border: `1px ${statusBadge.border}`,
            color: statusBadge.text,
            fontSize: '12px',
            fontWeight: 500,
            backdropFilter: 'blur(12px)',
            boxShadow: `0 0 12px ${statusBadge.text}20, inset 0 1px 0 rgba(255,255,255,0.08)`,
            transition: `all ${TOKENS.motion} ease`
          }}
          whileHover={{
            scale: 1.05,
            boxShadow: `0 0 16px ${statusBadge.text}30, inset 0 1px 0 rgba(255,255,255,0.12)`,
            transition: { duration: 0.16 }
          }}
        >
          {statusBadge.label}
        </motion.div>
      </div>

      {/* ── Row 2: Headline + Subcopy ── */}
      <div style={{ marginBottom: '28px', position: 'relative', zIndex: 1 }}>
        <h2 style={{ fontFamily: TOKENS.font.family, fontSize: '26px', fontWeight: 600, letterSpacing: '-0.015em', color: TOKENS.color.text_primary, marginBottom: '12px', lineHeight: 1.15 }}>
          {headline}
        </h2>
        {summary && (
          <p style={{ fontFamily: TOKENS.font.family, fontSize: '14px', fontWeight: 400, color: 'rgba(213,220,229,0.78)', lineHeight: 1.45, maxWidth: '680px' }}>
            {summary}
          </p>
        )}
      </div>

      {/* ── Row 3: Sentiment Mix Bar ── */}
      {(primaryLabel || secondaryLabel) && (
        <div style={{ marginBottom: '22px', position: 'relative', zIndex: 1 }}>
          <div
            style={{
              height: '6px',
              borderRadius: '999px',
              background: 'rgba(255,255,255,0.12)',
              overflow: 'hidden',
              display: 'flex',
              width: '100%'
            }}
          >
            {/* Primary segment */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${primaryPct}%` }}
              transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
              style={{
                background: `linear-gradient(90deg, #ffb15c, #ff7b4d)`,
                boxShadow: '0 0 12px rgba(255,140,80,0.25)',
                borderRadius: '999px',
                transition: `width 0.8s ease`
              }}
            />
            {/* Secondary segment */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${secondaryPct}%` }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
              style={{
                background: `linear-gradient(90deg, #687A8C, #9BA8BC)`,
                boxShadow: '0 0 8px rgba(155,168,188,0.20)',
                borderRadius: '999px',
                transition: `width 0.8s ease`
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', fontSize: '12px', fontFamily: TOKENS.font.family, fontWeight: 500, color: 'rgba(213,220,229,0.65)' }}>
            <div />
            <span>{primaryLabel} {primaryPct}% / {secondaryLabel} {secondaryPct}%</span>
          </div>
        </div>
      )}

      {/* ── Meta Pills ── */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
        {[
          ...(outlets ? [{ label: 'Outlets', value: outlets }] : []),
          ...(window ? [{ label: 'Window', value: window }] : []),
          ...(confidenceLabel ? [{ label: 'Confidence', value: confidenceLabel }] : [])
        ].map((pill, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.05 }}
            style={{
              fontFamily: TOKENS.font.family,
              padding: '8px 12px',
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.05)',
              border: `1px solid rgba(255,255,255,0.08)`,
              backdropFilter: 'blur(12px)',
              fontSize: '13px',
              fontWeight: 500,
              color: 'rgba(213,220,229,0.75)',
              whiteSpace: 'nowrap',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
              transition: `all ${TOKENS.motion} ease`
            }}
            whileHover={{
              background: 'rgba(255,255,255,0.08)',
              border: `1px solid rgba(255,255,255,0.12)`,
              y: -1,
              transition: { duration: 0.16 }
            }}
          >
            <span style={{ fontWeight: 500, color: 'rgba(255,255,255,0.70)' }}>{pill.label}</span>
            <span style={{ marginLeft: '6px', color: 'rgba(213,220,229,0.75)', fontWeight: 500 }}>{pill.value}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// ─── DRIVERS — FLOATING NARRATIVE CHIPS ────────────────────────────────────
const DriversSection = ({ drivers = [] }) => {
  // Extract driver labels from driver objects (rank + label)
  const driverList = drivers
    .map(driver => {
      if (typeof driver === 'string') return driver;
      if (driver?.label) return driver.label;
      return null;
    })
    .filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div style={{ marginBottom: '14px' }}>
        <h3 style={{ fontFamily: TOKENS.font.family, fontSize: '12px', fontWeight: 600, letterSpacing: '0.10em', color: 'rgba(255,255,255,0.60)', textTransform: 'uppercase' }}>
          Narrative Drivers
        </h3>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
        {driverList.map((driver, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 + i * 0.04 }}
            className="group"
            style={{
              fontFamily: TOKENS.font.family,
              padding: '10px 14px',
              borderRadius: '999px',
              background: 'rgba(30,40,60,0.22)',
              backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.01))',
              border: `1px solid rgba(255,255,255,0.10)`,
              backdropFilter: `blur(20px)`,
              WebkitBackdropFilter: `blur(20px)`,
              fontSize: '13px',
              fontWeight: 500,
              color: 'rgba(213,220,229,0.85)',
              cursor: 'default',
              transition: `all 200ms ease`,
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              maxWidth: '280px',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.03) inset, 0 10px 28px rgba(0,0,0,0.25)'
            }}
            whileHover={{
              background: 'rgba(30,40,60,0.30)',
              border: `1px solid rgba(255,255,255,0.14)`,
              y: -1,
              boxShadow: '0 0 0 1px rgba(255,255,255,0.03) inset, 0 14px 34px rgba(0,0,0,0.28)',
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
  const fallbackMap = {
    0: {
      title: 'Credit Spreads',
      description: 'Rising borrowing costs could pressure leveraged companies and widen high-yield spreads.',
      icon: '◈'
    },
    1: {
      title: 'Growth Allocation',
      description: 'Slowing global growth expectations may shift capital toward defensive sectors.',
      icon: '↗'
    },
    2: {
      title: 'Policy Risk',
      description: 'Tighter regulation and fiscal gridlock may increase volatility in regulated industries.',
      icon: '⌁'
    },
    3: {
      title: 'Growth Allocation',
      description: 'Slowing global growth expectations may shift capital toward defensive sectors.',
      icon: '↗'
    }
  };

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
  
  // Helper: resolve title with fallback
  const getTitle = (impl, index) => {
    if (impl.title && impl.title.trim()) return impl.title;
    return fallbackMap[index]?.title || 'Market Signal';
  };
  
  // Helper: resolve description with fallback
  const getDescription = (impl, index) => {
    if (impl.description && impl.description.trim()) return impl.description;
    return fallbackMap[index]?.description || 'Monitor this signal for trading implications.';
  };
  
  // Helper: get icon for card
  const getIcon = (index) => {
    return fallbackMap[index]?.icon || '◈';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div style={{ marginBottom: '14px' }}>
         <h3 style={{ fontFamily: TOKENS.font.family, fontSize: '12px', fontWeight: 600, letterSpacing: '0.10em', color: 'rgba(255,255,255,0.60)', textTransform: 'uppercase' }}>
           Impact Intelligence
         </h3>
       </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
        {implList.slice(0, 4).map((impl, i) => {
          const title = getTitle(impl, i);
          const description = getDescription(impl, i);
          const icon = getIcon(i);
          
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35 + i * 0.06 }}
              className="group"
              style={{
                background: 'rgba(30,40,60,0.20)',
                backgroundImage: 'radial-gradient(120% 90% at 15% 10%, rgba(255,255,255,0.08), rgba(255,255,255,0.02) 45%, rgba(255,255,255,0.00) 70%), linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))',
                backdropFilter: `blur(24px)`,
                WebkitBackdropFilter: `blur(24px)`,
                border: `1px solid rgba(255,255,255,0.10)`,
                borderRadius: '18px',
                padding: '22px',
                transition: `all 180ms ease`,
                cursor: 'default',
                boxShadow: '0 0 0 1px rgba(255,255,255,0.03) inset, 0 16px 44px rgba(0,0,0,0.30)'
              }}
              whileHover={{
                y: -2,
                background: 'rgba(30,40,60,0.26)',
                backgroundImage: 'radial-gradient(120% 90% at 15% 10%, rgba(255,255,255,0.10), rgba(255,255,255,0.02) 45%, rgba(255,255,255,0.00) 70%), linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.01))',
                border: `1px solid rgba(255,255,255,0.14)`,
                boxShadow: '0 0 0 1px rgba(255,255,255,0.04) inset, 0 22px 56px rgba(0,0,0,0.34)',
                transition: { duration: 0.16 }
              }}
            >
              <div style={{ fontFamily: TOKENS.font.family, fontSize: '12px', fontWeight: 600, letterSpacing: '0.10em', color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', marginBottom: '8px' }}>
                {impl.label || 'SIGNAL'}
              </div>

              {/* Title row with leading icon chip */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div style={{
                  fontFamily: TOKENS.font.family,
                  width: '22px',
                  height: '22px',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: '11px',
                  color: 'rgba(213,220,229,0.75)',
                  fontWeight: 500
                }}>
                  {icon}
                </div>
                <h4 style={{ fontFamily: TOKENS.font.family, fontSize: '16px', fontWeight: 600, letterSpacing: '-0.01em', color: TOKENS.color.text_primary, lineHeight: 1.2, margin: 0 }}>
                  {title}
                </h4>
              </div>

              <p style={{ fontFamily: TOKENS.font.family, fontSize: '13.5px', fontWeight: 400, color: 'rgba(213,220,229,0.75)', lineHeight: 1.45 }}>
                {description}
              </p>
            </motion.div>
          );
        })}
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
          borderRadius: '16px',
          background: 'rgba(30,40,60,0.18)',
          border: `1px solid rgba(255,255,255,0.08)`,
          transition: `all 200ms ease`,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)'
        }}
        whileHover={{
          background: 'rgba(30,40,60,0.26)',
          border: `1px solid rgba(255,255,255,0.10)`,
          y: -1,
          transition: { duration: 0.18 }
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
            <div style={{ fontFamily: TOKENS.font.family, fontSize: '15px', fontWeight: 600, color: TOKENS.color.text_primary, marginBottom: '3px', lineHeight: 1.2 }}>
              {label}
            </div>
            <div style={{ fontFamily: TOKENS.font.family, fontSize: '13px', fontWeight: 500, color: 'rgba(213,220,229,0.65)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {context}
            </div>
          </div>
        </div>

        {/* Right cluster */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <div
            style={{
              fontFamily: TOKENS.font.family,
              padding: '6px 12px',
              borderRadius: '10px',
              background: sentiment.bg,
              border: `1px ${sentiment.border}`,
              color: sentiment.text,
              fontSize: '12px',
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
                background: 'rgba(30,40,60,0.18)',
                backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.01))',
                backdropFilter: 'blur(22px)',
                WebkitBackdropFilter: 'blur(22px)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '18px',
                padding: '18px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '24px',
                boxShadow: '0 0 0 1px rgba(255,255,255,0.03) inset, 0 14px 40px rgba(0,0,0,0.30)'
              }}
            >
              {/* Left column */}
              <div>
                <div style={{ fontFamily: TOKENS.font.family, fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.50)', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Primary Topic
                  </div>
                  <p style={{ fontFamily: TOKENS.font.family, fontSize: '13px', fontWeight: 400, color: 'rgba(213,220,229,0.75)', lineHeight: 1.45, marginBottom: '14px' }}>
                    {source?.topline || 'No topic'}
                  </p>

                  <div style={{ fontFamily: TOKENS.font.family, fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.50)', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Coverage Context
                  </div>
                  <p style={{ fontFamily: TOKENS.font.family, fontSize: '13px', fontWeight: 400, color: 'rgba(213,220,229,0.75)', lineHeight: 1.45 }}>
                    {source?.market_macro || 'General market focus'}
                  </p>
              </div>

              {/* Right column */}
              <div>
                <div style={{ fontFamily: TOKENS.font.family, fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.50)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Sentiment
                </div>
                <div
                  style={{
                    fontFamily: TOKENS.font.family,
                    padding: '8px 12px',
                    borderRadius: '10px',
                    background: sentiment.bg,
                    border: `1px ${sentiment.border}`,
                    color: sentiment.text,
                    fontSize: '12px',
                    fontWeight: 500,
                    marginBottom: '14px',
                    display: 'inline-block'
                  }}
                >
                  {sentiment.label}
                </div>

                <div style={{ fontFamily: TOKENS.font.family, fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.50)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Latest Headline
                </div>
                <p style={{ fontFamily: TOKENS.font.family, fontSize: '13px', fontWeight: 400, color: 'rgba(213,220,229,0.75)', lineHeight: 1.45 }}>
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
        minHeight: '72px',
        background: 'rgba(30,40,60,0.20)',
        backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.01))',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: `1px solid rgba(255,255,255,0.10)`,
        borderRadius: '18px',
        padding: '16px 18px',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.03) inset, 0 16px 44px rgba(0,0,0,0.32)',
        transition: `all 200ms ease`,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '18px'
      }}
      whileHover={{
        background: 'rgba(30,40,60,0.28)',
        border: `1px solid rgba(255,255,255,0.12)`,
        y: -2,
        boxShadow: '0 0 0 1px rgba(255,255,255,0.04) inset, 0 20px 52px rgba(0,0,0,0.36)',
        transition: { duration: 0.18 }
      }}
    >
      {/* Left: Label + Helper */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '5px', minWidth: '160px' }}>
        <div style={{ fontFamily: TOKENS.font.family, fontSize: '12px', fontWeight: 600, letterSpacing: '0.10em', color: 'rgba(255,255,255,0.60)', textTransform: 'uppercase' }}>
          Intelligence Sources ({sourceList.length})
        </div>
        <div style={{ fontFamily: TOKENS.font.family, fontSize: '13px', fontWeight: 400, color: 'rgba(255,255,255,0.65)', lineHeight: 1.35 }}>
          Tap to view coverage
        </div>
      </div>

      {/* Middle: Outlet Pills + Overflow */}
      <div style={{ display: isExpanded ? 'none' : 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
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
                fontFamily: TOKENS.font.family,
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: isExpanded ? 'rgba(255,255,255,0.10)' : color.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 600,
                color: isExpanded ? 'rgba(255,255,255,0.35)' : color.text,
                flexShrink: 0,
                cursor: 'default',
                boxShadow: isExpanded ? 'none' : '0 4px 12px rgba(0,0,0,0.24)',
                filter: isExpanded ? 'saturate(0.8)' : 'saturate(1)',
                transition: 'all 200ms ease'
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
              fontFamily: TOKENS.font.family,
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: isExpanded ? 'rgba(255,255,255,0.10)' : '#8B5CF6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 600,
              color: isExpanded ? 'rgba(255,255,255,0.35)' : '#FFFFFF',
              flexShrink: 0,
              boxShadow: isExpanded ? 'none' : '0 4px 12px rgba(0,0,0,0.24)',
              cursor: 'default',
              filter: isExpanded ? 'saturate(0.8)' : 'saturate(1)',
              transition: 'all 200ms ease'
            }}
            title="Politico"
          >
            PO
          </motion.div>
        )}
      </div>

      {/* Right: Sentiment Dots + Chevron */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
        {/* Sentiment dots */}
        <div style={{ display: 'flex', gap: '6px' }}>
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
                width: '7px',
                height: '7px',
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
          className="w-5 h-5"
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
                background: 'rgba(30,40,60,0.18)',
                backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.01))',
                backdropFilter: 'blur(22px)',
                WebkitBackdropFilter: 'blur(22px)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '18px',
                padding: '12px',
                boxShadow: '0 0 0 1px rgba(255,255,255,0.03) inset, 0 12px 36px rgba(0,0,0,0.28)'
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
    <div
      style={{
        marginTop: '32px',
        background: 'radial-gradient(1200px 600px at 15% -10%, rgba(45,80,150,0.10), rgba(0,0,0,0)), radial-gradient(900px 500px at 90% 10%, rgba(30,60,120,0.08), rgba(0,0,0,0))',
        borderRadius: '32px',
        padding: '32px',
        position: 'relative'
      }}
    >
      <div style={{ marginBottom: '24px', paddingLeft: '8px' }}>
        <h2 style={{ fontFamily: TOKENS.font.family, fontSize: '22px', fontWeight: 600, letterSpacing: '-0.01em', color: 'rgba(226,232,240,0.95)', marginBottom: '6px', lineHeight: 1.15 }}>
          Narrative Intelligence
        </h2>
        <p style={{ fontFamily: TOKENS.font.family, fontSize: '13px', fontWeight: 400, color: 'rgba(213,220,229,0.65)', lineHeight: 1.35, maxWidth: '620px' }}>
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