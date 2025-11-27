// 🔒 DESIGN LOCKED — OS HORIZON V2.5 NARRATIVE ARCHITECTURE
// Last Updated: 2025-01-20 | Vireon OS Horizon Full Certification
// Policy Drawer: Unified Glass Header — Apple-Grade Continuity
// See: DESIGN_LOCKED_COMPONENTS.md

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Briefcase, BarChart3, Globe, Zap, Target, TrendingUp, Eye, ChevronLeft, ChevronRight, FileText, Building2, Users, DollarSign, TrendingDown, Factory, ArrowUp, ArrowDown, ArrowRight, Activity, Waves } from 'lucide-react';

const MOTION = {
  CURVES: {
    silk: [0.25, 0.1, 0.25, 1.0],
    horizonIn: [0.22, 0.61, 0.36, 1],
    easeOutQuint: [0.22, 1, 0.36, 1],
  },
  DURATIONS: {
    fast: 0.13,
    base: 0.18,
    drawerOpen: 0.36,
    tldrPop: 0.09,
    stagger: 0.06
  }
};

const DirectionIcons = { '+': ArrowUp, '-': ArrowDown, '=': ArrowRight };

// Unified glass token for all cards - OS Horizon 3-Layer Depth Model
const GLASS_TOKENS = {
  // Layer 1: Base blurred glass panel
  cardBg: 'linear-gradient(180deg, rgba(255, 255, 255, 0.048) 0%, rgba(255, 255, 255, 0.024) 100%)',
  cardBorder: 'rgba(255,255,255,0.10)',
  cardBlur: 'blur(26px) saturate(162%)',
  cardRadius: '26px',
  cardPadding: '24px 28px',
  // Layer 2 + 3: Soft inner shadow + gentle bloom edge
  cardShadow: (glowColor) => `
    inset 0 1px 1px rgba(255,255,255,0.06),
    inset 0 0 16px ${glowColor},
    0 5px 18px rgba(0,0,0,0.10),
    0 0 20px ${glowColor}
  `,
  cardHoverShadow: (glowColor) => `
    inset 0 1px 1.5px rgba(255,255,255,0.08),
    inset 0 0 18px ${glowColor},
    0 8px 24px rgba(0,0,0,0.12),
    0 0 24px ${glowColor}
  `,
  // Header-specific tokens (5-8% reduced opacity)
  headerBg: 'linear-gradient(180deg, rgba(255, 255, 255, 0.036) 0%, rgba(255, 255, 255, 0.020) 100%)',
  headerBlur: 'blur(28px) saturate(165%)'
};

const getTheme = (name) => {
  switch (name) {
    case 'Policy': return { Icon: Shield, color: '#70A8E8', borderColor: 'rgba(112, 168, 232, 0.20)', glowColor: 'rgba(200, 220, 255, 0.16)', ambient: 'rgba(112, 168, 232, 0.06)' };
    case 'Credit': return { Icon: Briefcase, color: '#B88AED', borderColor: 'rgba(184, 138, 237, 0.20)', glowColor: 'rgba(220, 200, 255, 0.16)', ambient: 'rgba(184, 138, 237, 0.06)' };
    case 'Equities': return { Icon: BarChart3, color: '#32C288', borderColor: 'rgba(50, 194, 136, 0.20)', glowColor: 'rgba(180, 255, 220, 0.16)', ambient: 'rgba(50, 194, 136, 0.06)' };
    case 'Global': return { Icon: Globe, color: '#EDB859', borderColor: 'rgba(255, 176, 32, 0.20)', glowColor: 'rgba(255, 235, 200, 0.16)', ambient: 'rgba(237, 184, 89, 0.06)' };
    default: return { Icon: Zap, color: '#AAB1B8', borderColor: 'rgba(170, 177, 184, 0.20)', glowColor: 'rgba(220, 220, 230, 0.16)', ambient: 'rgba(170, 177, 184, 0.06)' };
  }
};

const InsightPanel = ({ icon: Icon, title, content, delay, iconColor, tintColor, glowColor }) => (
  <motion.div
    variants={{ hidden: { opacity: 0, y: 4 }, visible: { opacity: 1, y: 0 } }}
    transition={{ delay, duration: 0.06, ease: MOTION.CURVES.silk }}
    className="relative"
    style={{
      padding: GLASS_TOKENS.cardPadding,
      background: GLASS_TOKENS.cardBg,
      backdropFilter: GLASS_TOKENS.cardBlur,
      WebkitBackdropFilter: GLASS_TOKENS.cardBlur,
      border: `1px solid ${GLASS_TOKENS.cardBorder}`,
      borderRadius: GLASS_TOKENS.cardRadius,
      boxShadow: GLASS_TOKENS.cardShadow(glowColor || 'rgba(220, 230, 255, 0.08)'),
      transition: 'transform 0.14s ease-out, box-shadow 0.14s ease-out, filter 0.14s ease-out'
    }}
    whileHover={{
      y: -2,
      boxShadow: GLASS_TOKENS.cardHoverShadow(glowColor || 'rgba(220, 230, 255, 0.10)'),
      filter: 'brightness(1.015)',
      transition: { duration: 0.14, ease: 'easeOut' }
    }}
    whileTap={{
      y: 1,
      filter: 'brightness(0.99)',
      transition: { duration: 0.1, ease: 'easeOut' }
    }}
  >
    {/* Layer 2: Soft inner shadow gradient */}
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(180deg, rgba(255,255,255,0.020) 0%, rgba(0,0,0,0.012) 100%)',
      borderRadius: GLASS_TOKENS.cardRadius,
      pointerEvents: 'none'
    }} />

    {/* Layer 3: Gentle bloom edge */}
    <div style={{
      position: 'absolute',
      top: 0,
      left: '12%',
      right: '12%',
      height: '1px',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)',
      filter: 'blur(0.5px)',
      pointerEvents: 'none'
    }} />

    <div style={{
      position: 'absolute',
      inset: 0,
      background: `radial-gradient(ellipse at 50% 40%, ${iconColor}03 0%, transparent 100%)`,
      borderRadius: GLASS_TOKENS.cardRadius,
      pointerEvents: 'none',
      opacity: 0.50
    }} />

    <div className="flex items-start gap-4 relative">
      <div 
        className="w-10 h-10 rounded-[13px] flex items-center justify-center flex-shrink-0 relative"
        style={{
          background: `${iconColor}10`,
          border: `1px solid ${iconColor}20`,
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.08), 0 0 8px ${iconColor}08`
        }}
      >
        <div style={{
          position: 'absolute',
          inset: '-5px',
          background: `radial-gradient(circle, ${iconColor}03 0%, transparent 70%)`,
          filter: 'blur(8px)',
          pointerEvents: 'none'
        }} />
        <Icon className="w-5 h-5 relative z-10" style={{ color: iconColor, filter: 'brightness(1.12)' }} strokeWidth={2.2} />
      </div>

      <div className="flex-1">
        <h3 
          className="text-[13.5px] font-medium mb-2.5 relative" 
          style={{ 
            color: 'rgba(255,255,255,0.68)',
            letterSpacing: '0.022em',
            fontWeight: 500
          }}
        >
          {tintColor && (
            <div style={{
              position: 'absolute',
              inset: '-4px -8px',
              background: `linear-gradient(90deg, ${tintColor}02, transparent)`,
              borderRadius: '6px',
              pointerEvents: 'none'
            }} />
          )}
          <span className="relative z-10">{title}</span>
        </h3>
        
        <p 
          className="text-[16px]" 
          style={{ 
            color: 'rgba(255,255,255,0.90)',
            lineHeight: '1.52',
            letterSpacing: '-0.005em',
            fontWeight: 400
          }}
        >
          {content}
        </p>
      </div>
    </div>
  </motion.div>
);

const PolicyDrawerContent = ({ segment, delay }) => {
  const theme = getTheme(segment.name);
  const weight = (segment?.weight || 0) * 100;
  const [haloPulse, setHaloPulse] = useState(0.03);

  useEffect(() => {
    const timer = setTimeout(() => setHaloPulse(0), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      className="relative w-full"
      style={{ 
        minHeight: '85vh',
        padding: '32px 48px 64px 48px'
      }}
      variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.02, delayChildren: 0.10 } } }}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.12, ease: MOTION.CURVES.easeOutQuint }}
    >
      <div style={{
        position: 'absolute',
        zIndex: -1,
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: '490px',
        background: 'radial-gradient(circle at 50% 20%, rgba(205, 230, 255, 0.06) 0%, rgba(0, 0, 0, 0) 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{
        position: 'absolute',
        zIndex: -1,
        inset: 0,
        background: 'linear-gradient(180deg, rgba(255,255,255,0.028) 0%, transparent 100%)',
        pointerEvents: 'none'
      }} />

      <div style={{
        position: 'absolute',
        zIndex: -1,
        inset: 0,
        background: 'radial-gradient(ellipse at 50% 50%, transparent 0%, rgba(0,0,0,0.12) 100%)',
        pointerEvents: 'none'
      }} />

      {/* Rounded Header Background - OS Horizon 3-Layer Depth */}
      <motion.div
        variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
        transition={{ duration: MOTION.DURATIONS.base, ease: MOTION.CURVES.easeOutQuint }}
        className="relative"
        style={{ 
          marginBottom: '24px',
          padding: GLASS_TOKENS.cardPadding,
          background: GLASS_TOKENS.headerBg,
          backdropFilter: GLASS_TOKENS.headerBlur,
          WebkitBackdropFilter: GLASS_TOKENS.headerBlur,
          borderRadius: GLASS_TOKENS.cardRadius,
          border: `1px solid rgba(255,255,255,0.08)`,
          boxShadow: `inset 0 1px 1px rgba(255,255,255,0.04), inset 0 0 10px ${theme.glowColor}`
        }}
      >
        {/* Layer 2: Soft inner shadow */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.015) 0%, rgba(0,0,0,0.006) 100%)',
          borderRadius: GLASS_TOKENS.cardRadius,
          pointerEvents: 'none'
        }} />
        {/* Layer 3: Gentle bloom edge */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '12%',
          right: '12%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
          pointerEvents: 'none'
        }} />
        <h1 
          className="relative"
          style={{
            fontSize: '24px',
            fontWeight: 600,
            color: 'rgba(255,255,255,0.95)',
            letterSpacing: '0.016em',
            marginBottom: '10px'
          }}
        >
          Policy Analysis
        </h1>
        <p 
          className="relative"
          style={{
            fontSize: '14.5px',
            fontWeight: 400,
            color: 'rgba(255,255,255,0.70)',
            lineHeight: '1.52',
            letterSpacing: '0.005em'
          }}
        >
          Market Pressure Lens — What's Driving Street Alignment
        </p>
      </motion.div>

      {/* TL;DR Band - OS Horizon 3-Layer Depth */}
      <motion.div
        variants={{ hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0 } }}
        transition={{ delay: 0.02, duration: 0.09, ease: MOTION.CURVES.silk }}
        className="relative"
        style={{
          marginTop: '0px',
          marginBottom: '24px',
          padding: GLASS_TOKENS.cardPadding,
          background: GLASS_TOKENS.cardBg,
          backdropFilter: GLASS_TOKENS.cardBlur,
          WebkitBackdropFilter: GLASS_TOKENS.cardBlur,
          borderRadius: GLASS_TOKENS.cardRadius,
          border: `1px solid ${GLASS_TOKENS.cardBorder}`,
          boxShadow: GLASS_TOKENS.cardShadow(theme.glowColor),
          transition: 'transform 0.14s ease-out, box-shadow 0.14s ease-out, filter 0.14s ease-out'
        }}
        whileHover={{
          y: -2,
          boxShadow: GLASS_TOKENS.cardHoverShadow(theme.glowColor),
          filter: 'brightness(1.015)',
          transition: { duration: 0.14, ease: 'easeOut' }
        }}
        whileTap={{
          y: 1,
          filter: 'brightness(0.99)',
          transition: { duration: 0.1, ease: 'easeOut' }
        }}
      >
        {/* Layer 2: Soft inner shadow */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.020) 0%, rgba(0,0,0,0.012) 100%)',
          borderRadius: GLASS_TOKENS.cardRadius,
          pointerEvents: 'none'
        }} />

        {/* Layer 3: Gentle bloom edge */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '12%',
          right: '12%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)',
          pointerEvents: 'none'
        }} />

        <motion.div 
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse at 50% 40%, ${theme.ambient} 0%, transparent 100%)`,
            borderRadius: GLASS_TOKENS.cardRadius,
            pointerEvents: 'none',
            opacity: 0.48
          }}
          animate={{
            opacity: [0.48 + haloPulse, 0.48]
          }}
          transition={{
            duration: 0.8,
            ease: 'easeOut'
          }}
        />

        <div className="flex items-center justify-between gap-5 relative">
          <div 
            className="inline-block rounded-full flex-shrink-0"
            style={{
              fontSize: '10.5px',
              fontWeight: 600,
              color: 'rgba(255,255,255,0.80)',
              padding: '5px 11px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '18px',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)'
            }}
          >
            TL;DR
          </div>

          <p 
            className="flex-1 text-center"
            style={{
              fontSize: '16px',
              fontWeight: 450,
              color: 'rgba(255,255,255,0.92)',
              lineHeight: '1.50',
              letterSpacing: '-0.005em'
            }}
          >
            Stricter rules are raising costs and putting pressure on big tech companies.
          </p>

          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div
              className="inline-block rounded-full"
              style={{
                fontSize: '11px',
                fontWeight: 500,
                color: '#7BB1FF',
                background: 'rgba(80, 140, 255, 0.12)',
                padding: '5px 12px',
                borderRadius: '18px',
                border: '1px solid rgba(80, 140, 255, 0.22)',
                boxShadow: `0 0 10px ${theme.glowColor}, inset 0 1px 0 rgba(255,255,255,0.06)`
              }}
            >
              Rising
            </div>

            <div style={{ textAlign: 'right' }}>
              <div 
                style={{ 
                  fontSize: '11px', 
                  fontWeight: 500,
                  color: 'rgba(255,255,255,0.72)',
                  letterSpacing: '0.004em'
                }}
              >
                {Math.round(weight)}%
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
        style={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          marginBottom: '24px'
        }}
      >
        <InsightPanel 
          icon={Target} 
          title="Key Driver"
          content="Regulators are getting tougher across content, privacy, and platform practices."
          delay={0.06}
          iconColor={theme.color}
          tintColor="#6FB5FF"
          glowColor={theme.glowColor}
        />

        <InsightPanel 
          icon={Waves} 
          title="Pressure Direction"
          content="Rules are becoming stricter, making the environment harder for companies."
          delay={0.12}
          iconColor={theme.color}
          tintColor="#7BC8FF"
          glowColor={theme.glowColor}
        />

        <InsightPanel 
          icon={BarChart3} 
          title="Market Impact Level"
          content="Moderate impact, with some industries beginning to feel more pressure."
          delay={0.18}
          iconColor={theme.color}
          tintColor="#8FD6FF"
          glowColor={theme.glowColor}
        />
      </motion.div>

      {/* What This Means - OS Horizon 3-Layer Depth */}
      <motion.div
        variants={{ hidden: { opacity: 0, y: 4 }, visible: { opacity: 1, y: 0 } }}
        transition={{ delay: 0.24, duration: 0.24, ease: MOTION.CURVES.silk }}
        className="relative mx-auto"
        style={{
          maxWidth: '88%',
          padding: GLASS_TOKENS.cardPadding,
          marginBottom: '24px',
          background: GLASS_TOKENS.cardBg,
          backdropFilter: GLASS_TOKENS.cardBlur,
          WebkitBackdropFilter: GLASS_TOKENS.cardBlur,
          borderRadius: GLASS_TOKENS.cardRadius,
          border: `1px solid ${GLASS_TOKENS.cardBorder}`,
          boxShadow: GLASS_TOKENS.cardShadow(theme.glowColor),
          transition: 'transform 0.14s ease-out, box-shadow 0.14s ease-out, filter 0.14s ease-out'
        }}
        whileHover={{
          y: -2,
          boxShadow: GLASS_TOKENS.cardHoverShadow(theme.glowColor),
          filter: 'brightness(1.015)',
          transition: { duration: 0.14, ease: 'easeOut' }
        }}
        whileTap={{
          y: 1,
          filter: 'brightness(0.99)',
          transition: { duration: 0.1, ease: 'easeOut' }
        }}
      >
        {/* Layer 2: Soft inner shadow */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.020) 0%, rgba(0,0,0,0.012) 100%)',
          borderRadius: GLASS_TOKENS.cardRadius,
          pointerEvents: 'none'
        }} />

        {/* Layer 3: Gentle bloom edge */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '12%',
          right: '12%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)',
          pointerEvents: 'none'
        }} />

        <div style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at 50% 40%, ${theme.ambient} 0%, transparent 100%)`,
          borderRadius: GLASS_TOKENS.cardRadius,
          pointerEvents: 'none',
          opacity: 0.48
        }} />

        <div className="relative text-center">
          <h3 
            className="text-[13.5px] font-medium mb-4 uppercase" 
            style={{ 
              color: 'rgba(255,255,255,0.64)',
              letterSpacing: '0.08em',
              fontWeight: 500
            }}
          >
            What This Means
          </h3>
          
          <p 
            className="text-[16.5px]" 
            style={{ 
              color: 'rgba(255,255,255,0.92)',
              lineHeight: '1.54',
              letterSpacing: '-0.005em',
              fontWeight: 400,
              maxWidth: '620px',
              margin: '0 auto'
            }}
          >
            Stricter regulation is creating steady pressure on the market. Big tech companies may face higher costs and slower stock price growth as oversight increases.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

const LuxurySection = ({ icon: Icon, title, children, iconColor = "#4F46E5", delay = 0 }) => (
  <motion.div 
    className="space-y-2.5"
    variants={{
      hidden: { opacity: 0, y: 10 },
      visible: { opacity: 1, y: 0 }
    }}
    transition={{ 
      delay,
      duration: MOTION.DURATIONS.base,
      ease: MOTION.CURVES.horizonIn
    }}
  >
    <div className="flex items-center space-x-2.5" style={{ marginTop: '30px', marginBottom: '8px' }}>
      <motion.div 
        className="relative p-2.5 rounded-[14px] border overflow-hidden"
        style={{ 
          background: `${iconColor}14`,
          borderColor: `${iconColor}32`,
          backdropFilter: 'blur(14px)',
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.10), 0 3px 10px ${iconColor}16`
        }}
        whileHover={{ scale: 1.04, boxShadow: `inset 0 1px 0 rgba(255,255,255,0.12), 0 5px 14px ${iconColor}22` }}
        transition={{ duration: MOTION.DURATIONS.fast, ease: MOTION.CURVES.horizonIn }}
      >
        <Icon className="w-4 h-4 relative z-10" style={{ color: iconColor, filter: 'brightness(1.12)' }} strokeWidth={2.2} />
      </motion.div>
      
      <div>
        <h3 className="text-[15px] font-semibold" style={{ color: 'rgba(255,255,255,0.68)', letterSpacing: '-0.01em' }}>
          {title}
        </h3>
      </div>
    </div>
    {children}
  </motion.div>
);

const AssetGroupImpact = ({ group, items, delay }) => {
  return (
    <motion.div
      className="space-y-2"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: MOTION.DURATIONS.base }}
    >
      <div className="relative pb-1">
        <h4 className="text-[13px] font-semibold" style={{ color: 'rgba(255,255,255,0.90)' }}>
          {group}:
        </h4>
        <div 
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: 'rgba(255,255,255,0.11)' }}
        />
      </div>
      
      <div className="space-y-1.5 pl-2">
        {items.map((item, i) => {
          const isNegative = item.direction === '-';
          const isPositive = item.direction === '+';
          const color = isNegative ? '#F26A6A' : isPositive ? '#2ECF8D' : '#AAB1B8';
          const DirectionIcon = DirectionIcons[item.direction] || ArrowRight;
          
          return (
            <motion.div
              key={i}
              className="flex items-center gap-2 text-sm"
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.05 + (i * 0.03), duration: MOTION.DURATIONS.fast }}
            >
              <DirectionIcon className="w-3.5 h-3.5 flex-shrink-0" style={{ color }} strokeWidth={2.2} />
              <span style={{ color: 'rgba(255,255,255,0.88)' }}>{item.detail}</span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

const StandardDrawerContent = ({ segment, delay }) => {
  const getSegmentDetails = (segment) => {
    const baseDetails = {
      tldr: "General market conditions are the primary influence.",
      keyDriver: "No specific drivers identified.",
      pressureDirection: "Neutral pressure.",
      marketImpact: "Mixed impact across sectors.",
      whatThisMeans: "Monitor for new catalysts."
    };

    if (!segment) return baseDetails;

    switch (segment.name) {
      case 'Credit':
        return {
          tldr: "Borrowing is getting more expensive and harder to access, especially for weaker borrowers.",
          keyDriver: "Lenders are getting more cautious after early signs of stress in riskier debt.",
          pressureDirection: "Credit is tightening, making it tougher for companies and households to refinance or take on new loans.",
          marketImpact: "Moderate impact, with highly indebted companies and lower-quality borrowers feeling it first.",
          whatThisMeans: "Tighter credit conditions can slow growth and increase default risk at the edges of the market. Companies that rely heavily on cheap borrowing may face higher costs and less flexibility.",
          status: "Moderate"
        };
      case 'Equities':
        return {
          tldr: "Most stock gains are coming from a small group of big companies, not the whole market.",
          keyDriver: "Investors are crowding into large, well-known names while many smaller and mid-size stocks lag behind.",
          pressureDirection: "Support for the market is narrowing, making it more vulnerable if these leaders stumble.",
          marketImpact: "Moderate impact, with the index looking strong on the surface but more fragile underneath.",
          whatThisMeans: "A narrow group of winners can keep the headline market up, but it also raises concentration risk. If leadership cracks, the pullback can be sharper because fewer areas are holding the market up.",
          status: "Moderate"
        };
      case 'Global':
        return {
          tldr: "Slower growth in key regions, especially China, is starting to weigh on the global outlook.",
          keyDriver: "Weaker demand from China and softer data in other major economies are cooling trade and production.",
          pressureDirection: "Growth momentum is cooling instead of accelerating.",
          marketImpact: "Moderate impact, with export-driven and commodity-linked areas feeling the slowdown more.",
          whatThisMeans: "A cooling global economy can pressure earnings expectations and risk appetite. If the slowdown deepens, markets may start to price in weaker profits and fewer growth opportunities.",
          status: "Softening"
        };
      default:
        return baseDetails;
    }
  };

  const theme = getTheme(segment.name);
  const details = getSegmentDetails(segment);
  const weight = (segment?.weight || 0) * 100;

  return (
    <motion.div
      className="relative w-full"
      style={{ 
        minHeight: '85vh',
        padding: '32px 48px 64px 48px'
      }}
      variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.02, delayChildren: 0.10 } } }}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.12, ease: MOTION.CURVES.easeOutQuint }}
    >
      <div style={{
        position: 'absolute',
        zIndex: -1,
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: '490px',
        background: 'radial-gradient(circle at 50% 20%, rgba(205, 230, 255, 0.06) 0%, rgba(0, 0, 0, 0) 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{
        position: 'absolute',
        zIndex: -1,
        inset: 0,
        background: 'linear-gradient(180deg, rgba(255,255,255,0.028) 0%, transparent 100%)',
        pointerEvents: 'none'
      }} />

      <div style={{
        position: 'absolute',
        zIndex: -1,
        inset: 0,
        background: 'radial-gradient(ellipse at 50% 50%, transparent 0%, rgba(0,0,0,0.12) 100%)',
        pointerEvents: 'none'
      }} />

      {/* Rounded Header Background - OS Horizon 3-Layer Depth */}
      <motion.div
        variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
        transition={{ duration: MOTION.DURATIONS.base, ease: MOTION.CURVES.easeOutQuint }}
        className="relative"
        style={{ 
          marginBottom: '24px',
          padding: GLASS_TOKENS.cardPadding,
          background: GLASS_TOKENS.headerBg,
          backdropFilter: GLASS_TOKENS.headerBlur,
          WebkitBackdropFilter: GLASS_TOKENS.headerBlur,
          borderRadius: GLASS_TOKENS.cardRadius,
          border: `1px solid rgba(255,255,255,0.08)`,
          boxShadow: `inset 0 1px 1px rgba(255,255,255,0.04), inset 0 0 10px ${theme.glowColor}`
        }}
      >
        {/* Layer 2: Soft inner shadow */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.015) 0%, rgba(0,0,0,0.006) 100%)',
          borderRadius: GLASS_TOKENS.cardRadius,
          pointerEvents: 'none'
        }} />
        {/* Layer 3: Gentle bloom edge */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '12%',
          right: '12%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
          pointerEvents: 'none'
        }} />
        <h1 
          className="relative"
          style={{
            fontSize: '24px',
            fontWeight: 600,
            color: 'rgba(255,255,255,0.95)',
            letterSpacing: '0.016em',
            marginBottom: '10px'
          }}
        >
          {segment.name} Analysis
        </h1>
        <p 
          className="relative"
          style={{
            fontSize: '14.5px',
            fontWeight: 400,
            color: 'rgba(255,255,255,0.70)',
            lineHeight: '1.52',
            letterSpacing: '0.005em'
          }}
        >
          Market Pressure Lens — What's Driving Street Alignment
        </p>
      </motion.div>

      {/* TL;DR Band - OS Horizon 3-Layer Depth */}
      <motion.div
        variants={{ hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0 } }}
        transition={{ delay: 0.02, duration: 0.09, ease: MOTION.CURVES.silk }}
        className="relative"
        style={{
          marginTop: '0px',
          marginBottom: '24px',
          padding: GLASS_TOKENS.cardPadding,
          background: GLASS_TOKENS.cardBg,
          backdropFilter: GLASS_TOKENS.cardBlur,
          WebkitBackdropFilter: GLASS_TOKENS.cardBlur,
          borderRadius: GLASS_TOKENS.cardRadius,
          border: `1px solid ${GLASS_TOKENS.cardBorder}`,
          boxShadow: GLASS_TOKENS.cardShadow(theme.glowColor),
          transition: 'transform 0.14s ease-out, box-shadow 0.14s ease-out, filter 0.14s ease-out'
        }}
        whileHover={{
          y: -2,
          boxShadow: GLASS_TOKENS.cardHoverShadow(theme.glowColor),
          filter: 'brightness(1.015)',
          transition: { duration: 0.14, ease: 'easeOut' }
        }}
        whileTap={{
          y: 1,
          filter: 'brightness(0.99)',
          transition: { duration: 0.1, ease: 'easeOut' }
        }}
      >
        {/* Layer 2: Soft inner shadow */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.020) 0%, rgba(0,0,0,0.012) 100%)',
          borderRadius: GLASS_TOKENS.cardRadius,
          pointerEvents: 'none'
        }} />

        {/* Layer 3: Gentle bloom edge */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '12%',
          right: '12%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)',
          pointerEvents: 'none'
        }} />

        <motion.div 
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse at 50% 40%, ${theme.ambient} 0%, transparent 100%)`,
            borderRadius: GLASS_TOKENS.cardRadius,
            pointerEvents: 'none',
            opacity: 0.48
          }}
        />

        <div className="flex items-center justify-between gap-5 relative">
          <div 
            className="inline-block rounded-full flex-shrink-0"
            style={{
              fontSize: '10.5px',
              fontWeight: 600,
              color: 'rgba(255,255,255,0.80)',
              padding: '5px 11px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '18px',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)'
            }}
          >
            TL;DR
          </div>

          <p 
            className="flex-1 text-center"
            style={{
              fontSize: '16px',
              fontWeight: 450,
              color: 'rgba(255,255,255,0.92)',
              lineHeight: '1.50',
              letterSpacing: '-0.005em'
            }}
          >
            {details.tldr}
          </p>

          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div
              className="inline-block rounded-full"
              style={{
                fontSize: '11px',
                fontWeight: 500,
                color: theme.color,
                background: `${theme.color}10`,
                padding: '5px 12px',
                borderRadius: '18px',
                border: `1px solid ${theme.color}20`,
                boxShadow: `0 0 10px ${theme.glowColor}, inset 0 1px 0 rgba(255,255,255,0.06)`
              }}
            >
              {details.status || 'Active'}
            </div>

            <div style={{ textAlign: 'right' }}>
              <div 
                style={{ 
                  fontSize: '11px', 
                  fontWeight: 500,
                  color: 'rgba(255,255,255,0.72)',
                  letterSpacing: '0.004em'
                }}
              >
                {Math.round(weight)}%
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Insight Panels */}
      <motion.div
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
        style={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          marginBottom: '24px'
        }}
      >
        <InsightPanel 
          icon={Target} 
          title="Key Driver"
          content={details.keyDriver}
          delay={0.06}
          iconColor={theme.color}
          tintColor={theme.color}
          glowColor={theme.glowColor}
        />

        <InsightPanel 
          icon={Waves} 
          title="Pressure Direction"
          content={details.pressureDirection}
          delay={0.12}
          iconColor={theme.color}
          tintColor={theme.color}
          glowColor={theme.glowColor}
        />

        <InsightPanel 
          icon={BarChart3} 
          title="Market Impact Level"
          content={details.marketImpact}
          delay={0.18}
          iconColor={theme.color}
          tintColor={theme.color}
          glowColor={theme.glowColor}
        />
      </motion.div>

      {/* What This Means */}
      <motion.div
        variants={{ hidden: { opacity: 0, y: 4 }, visible: { opacity: 1, y: 0 } }}
        transition={{ delay: 0.24, duration: 0.24, ease: MOTION.CURVES.silk }}
        className="relative rounded-[26px] mx-auto"
        style={{
          maxWidth: '88%',
          padding: '28px 32px',
          marginBottom: '24px',
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.058) 0%, rgba(255, 255, 255, 0.035) 100%)',
          backdropFilter: GLASS_TOKENS.cardBlur,
          WebkitBackdropFilter: GLASS_TOKENS.cardBlur,
          border: `1px solid ${GLASS_TOKENS.cardBorder}`,
          boxShadow: GLASS_TOKENS.cardShadow(theme.glowColor),
          transition: 'transform 0.14s ease-out, box-shadow 0.14s ease-out, filter 0.14s ease-out'
        }}
        whileHover={{
          y: -2,
          boxShadow: GLASS_TOKENS.cardHoverShadow(theme.glowColor),
          filter: 'brightness(1.015)',
          transition: { duration: 0.14, ease: 'easeOut' }
        }}
        whileTap={{
          y: 1,
          filter: 'brightness(0.99)',
          transition: { duration: 0.1, ease: 'easeOut' }
        }}
      >
        {/* Top-to-bottom micro-gradient */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.025) 0%, rgba(0,0,0,0.015) 100%)',
          borderRadius: '26px',
          pointerEvents: 'none'
        }} />

        <div style={{
          position: 'absolute',
          top: 0,
          left: '12%',
          right: '12%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)',
          filter: 'blur(0.5px)',
          pointerEvents: 'none'
        }} />

        <div style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at 50% 40%, ${theme.ambient} 0%, transparent 100%)`,
          borderRadius: '26px',
          pointerEvents: 'none',
          opacity: 0.55
        }} />

        <div className="relative text-center">
          <h3 
            className="text-[14px] font-medium mb-4 uppercase" 
            style={{ 
              color: 'rgba(255,255,255,0.66)',
              letterSpacing: '0.09em'
            }}
          >
            What This Means
          </h3>
          
          <p 
            className="text-[17px]" 
            style={{ 
              color: 'rgba(255,255,255,0.94)',
              lineHeight: '1.52',
              letterSpacing: '-0.006em',
              fontWeight: 420,
              maxWidth: '620px',
              margin: '0 auto'
            }}
          >
            {details.whatThisMeans}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function SegmentDetailDrawer({ isOpen, onClose, segment, onNavigate }) {
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setIsAnimatingIn(true));
      document.body.style.overflow = 'hidden';
      
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose?.();
      };
      document.addEventListener('keydown', handleKeyDown);
      
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleKeyDown);
        setIsAnimatingIn(false);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen || !segment) return null;

  const theme = getTheme(segment.name);
  const { Icon } = theme;
  const isPolicyDrawer = segment.name === 'Policy';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.02, delayChildren: 0.14 } }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        animate={{ opacity: 1, backdropFilter: 'blur(18px)' }}
        exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        transition={{ duration: 0.34, ease: MOTION.CURVES.silk }}
        style={{ paddingTop: '80px' }}
      >
        <motion.div 
          className="absolute left-0 right-0 bottom-0" 
          style={{ 
            top: '80px',
            background: 'rgba(0,0,0,0.72)'
          }}
          onClick={onClose} 
        />
        
        <motion.div
          key={segment.name}
          className="relative w-full max-w-4xl max-h-[92vh] overflow-hidden border shadow-2xl flex flex-col"
          style={{
            borderRadius: isPolicyDrawer ? '26px' : '32px',
            background: isPolicyDrawer 
              ? `linear-gradient(180deg, rgba(4, 9, 15, 0.84) 0%, rgba(4, 9, 15, 0.84) 100%)`
              : `linear-gradient(180deg, rgba(18, 20, 28, 0.90) 0%, rgba(16, 18, 26, 0.94) 100%)`,
            backdropFilter: isPolicyDrawer ? 'blur(43px) saturate(210%)' : 'blur(62px) saturate(195%)',
            WebkitBackdropFilter: isPolicyDrawer ? 'blur(43px) saturate(210%)' : 'blur(62px) saturate(195%)',
            borderColor: theme.borderColor,
            boxShadow: isPolicyDrawer
              ? `0px 5px 58px rgba(0, 0, 0, 0.22), 0 0 78px ${theme.glowColor}, inset 0 0 0 1px rgba(140, 180, 255, 0.015)`
              : `0 36px 72px -16px rgba(0, 0, 0, 0.84), 0 0 58px ${theme.glowColor}, inset 0 1px 0 rgba(255, 255, 255, 0.13), inset 0 0 0 1px rgba(255,255,255,0.04)`
          }}
          initial={{ opacity: 0.9, scale: 0.99, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          transition={{ duration: 0.12, ease: MOTION.CURVES.easeOutQuint }}
        >
          {isPolicyDrawer && (
            <>
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(ellipse at 50% 18%, rgba(255, 255, 255, 0.03) 0%, transparent 70%)',
                pointerEvents: 'none',
                borderRadius: '26px',
                zIndex: 1
              }} />
              <div style={{
                position: 'absolute',
                inset: '1px',
                borderRadius: '25px',
                boxShadow: 'inset 0 0 1px rgba(255,255,255,0.09)',
                pointerEvents: 'none',
                zIndex: 1
              }} />
            </>
          )}

          {!isPolicyDrawer && (
            <div style={{
              position: 'absolute',
              top: '-8%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '82%',
              height: '68%',
              background: `radial-gradient(ellipse at 50% 12%, ${theme.color}04 0%, transparent 88%)`,
              pointerEvents: 'none',
              borderRadius: '32px',
              zIndex: 1
            }} />
          )}

          <div style={{
            position: 'absolute',
            top: 0,
            left: isPolicyDrawer ? '18%' : '12%',
            right: isPolicyDrawer ? '18%' : '12%',
            height: '1.5px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)',
            filter: 'blur(1.2px)',
            pointerEvents: 'none',
            borderRadius: isPolicyDrawer ? '26px 26px 0 0' : '32px 32px 0 0',
            zIndex: 2
          }} />

          <motion.div 
            className="relative p-6 flex-shrink-0" 
            style={{ 
              background: 'transparent',
              paddingTop: '24px',
              paddingBottom: '24px',
              zIndex: 3
            }}
            variants={{ hidden: { opacity: 0, y: -10 }, visible: { opacity: 1, y: 0 }}}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3.5">
                <motion.div 
                  className="relative p-3 rounded-[15px] border overflow-hidden"
                  style={{ 
                    background: `${theme.color}16`,
                    borderColor: `${theme.color}34`,
                    backdropFilter: 'blur(14px)',
                    boxShadow: `inset 0 1px 2px rgba(255,255,255,0.12), 0 4px 14px ${theme.glowColor}`
                  }}
                  whileHover={{ 
                    scale: 1.04,
                    boxShadow: `inset 0 1px 2px rgba(255,255,255,0.14), 0 6px 18px ${theme.glowColor}, 0 0 12px ${theme.glowColor}`
                  }}
                  transition={{ duration: MOTION.DURATIONS.fast, ease: MOTION.CURVES.horizonIn }}
                >
                  <div style={{
                    position: 'absolute',
                    inset: '-6px',
                    background: `radial-gradient(circle, ${theme.glowColor} 0%, transparent 70%)`,
                    filter: 'blur(8px)',
                    opacity: 0.12,
                    pointerEvents: 'none'
                  }} />
                  <Icon className="w-6 h-6 relative z-10" style={{ color: theme.color, filter: 'brightness(1.15)' }} strokeWidth={2.2} />
                </motion.div>
                <div>
                  <h2 
                    className="font-bold tracking-tight" 
                    style={{ 
                      fontSize: isPolicyDrawer ? '22px' : '20px',
                      color: 'rgba(255,255,255,0.95)', 
                      letterSpacing: isPolicyDrawer ? '0.008em' : '-0.018em',
                      marginBottom: '4px'
                    }}
                  >
                    {segment.name} Analysis
                  </h2>
                  <p 
                    className="font-normal" 
                    style={{ 
                      fontSize: isPolicyDrawer ? '14.5px' : '13px',
                      color: 'rgba(255,255,255,0.64)', 
                      marginTop: '2px',
                      lineHeight: '1.54',
                      letterSpacing: '0.004em'
                    }}
                  >
                    Detailed Segment Breakdown
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1.5">
                <motion.button
                  onClick={() => onNavigate('prev')}
                  className="relative p-2.5 rounded-[14px] border backdrop-blur-sm"
                  style={{
                    background: 'rgba(255,255,255,0.042)',
                    borderColor: 'rgba(255,255,255,0.09)',
                    opacity: 0.88
                  }}
                  whileHover={{ 
                    scale: 1.05, 
                    background: 'rgba(255,255,255,0.08)', 
                    opacity: 1,
                    boxShadow: `0 0 12px ${theme.glowColor}`
                  }}
                  whileTap={{ scale: 0.96 }}
                  aria-label="Previous Segment"
                >
                  <ChevronLeft className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.74)' }} strokeWidth={2.2} />
                </motion.button>
                <motion.button
                  onClick={() => onNavigate('next')}
                  className="relative p-2.5 rounded-[14px] border backdrop-blur-sm"
                  style={{
                    background: 'rgba(255,255,255,0.042)',
                    borderColor: 'rgba(255,255,255,0.09)',
                    opacity: 0.88
                  }}
                  whileHover={{ 
                    scale: 1.05, 
                    background: 'rgba(255,255,255,0.08)', 
                    opacity: 1,
                    boxShadow: `0 0 12px ${theme.glowColor}`
                  }}
                  whileTap={{ scale: 0.96 }}
                  aria-label="Next Segment"
                >
                  <ChevronRight className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.74)' }} strokeWidth={2.2} />
                </motion.button>
                <motion.button 
                  onClick={onClose} 
                  className="relative p-2.5 rounded-[14px] border"
                  style={{
                    background: 'rgba(255,255,255,0.042)',
                    borderColor: 'rgba(255,255,255,0.09)',
                    opacity: 0.88
                  }}
                  whileHover={{ 
                    scale: 1.05, 
                    background: 'rgba(255,255,255,0.08)', 
                    opacity: 1,
                    boxShadow: `0 0 12px ${theme.glowColor}`
                  }}
                  whileTap={{ scale: 0.96 }}
                >
                  <X className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.74)' }} strokeWidth={2.2} />
                </motion.button>
              </div>
            </div>
          </motion.div>

          <motion.div 
            key={`${segment.name}-content`}
            className="overflow-y-auto flex-1" 
            variants={containerVariants} 
            initial="hidden" 
            animate="visible"
            style={{ 
              scrollBehavior: 'smooth',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'thin',
              padding: isPolicyDrawer ? '0 48px 52px 48px' : '0 48px 48px 48px',
              willChange: 'transform',
              zIndex: 2
            }}
          >
            {isPolicyDrawer ? (
              <PolicyDrawerContent segment={segment} delay={0.02} />
            ) : (
              <StandardDrawerContent segment={segment} delay={0.02} />
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}