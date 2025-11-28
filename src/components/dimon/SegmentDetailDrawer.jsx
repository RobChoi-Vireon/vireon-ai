// 🔒 DESIGN LOCKED — OS HORIZON "SIGNAL CASCADE V3" ARCHITECTURE
// Last Updated: 2025-01-28 | Apple-Grade Liquid Glass + VisionOS Depth
// 4-Tier Narrative Hierarchy | Kinetic Parallax System
// See: DESIGN_LOCKED_COMPONENTS.md

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { X, Shield, Briefcase, BarChart3, Globe, Zap, Target, ChevronLeft, ChevronRight, Waves, TrendingUp, TrendingDown, Clock } from 'lucide-react';

// ============================================================================
// SIGNAL CASCADE V3 — MOTION DNA
// ============================================================================
const MOTION = {
  CURVES: {
    easeOut: [0.25, 0.1, 0.25, 1.0],
    cascade: [0.22, 0.58, 0.35, 1],
    mount: [0.20, 0.60, 0.40, 1]
  },
  DURATIONS: {
    fast: 0.16,
    base: 0.20,
    mount: 0.18,
    fadeUp: 0.15
  },
  // Kinetic Parallax Rates (V3 Spec)
  PARALLAX: {
    heroPlate: -1.5,
    signalOrb: -1.0,
    insightModules: -0.5,
    narrativePanel: -0.25
  }
};

// ============================================================================
// SIGNAL CASCADE V3 — 4-TIER GLASS SYSTEM
// ============================================================================
const GLASS = {
  // TIER 1: Hero Title Plate (highest brightness + strongest sheen)
  heroPlate: {
    radius: '30px',
    blur: 'blur(30px) saturate(175%)',
    bg: 'linear-gradient(180deg, rgba(255, 255, 255, 0.048) 0%, rgba(255, 255, 255, 0.018) 100%)',
    border: 'rgba(255,255,255,0.09)',
    sheen: 'linear-gradient(180deg, rgba(255,255,255,0.022) 0%, transparent 45%)'
  },
  // TIER 2: TL;DR Signal Orb (mid-high blur + gradient + pill curvature)
  signalOrb: {
    radius: '36px',
    blur: 'blur(34px) saturate(178%)',
    bgGradient: (colorRgb) => `linear-gradient(135deg, rgba(${colorRgb}, 0.10) 0%, rgba(255, 255, 255, 0.048) 45%, rgba(255, 255, 255, 0.022) 100%)`,
    border: 'rgba(255,255,255,0.14)',
    hoverLift: 3
  },
  // TIER 3: Feather Glass Cards (minimal glow, feather-thin border)
  featherCard: {
    radius: '24px',
    blur: 'blur(18px) saturate(150%)',
    bg: 'linear-gradient(180deg, rgba(255, 255, 255, 0.028) 0%, rgba(255, 255, 255, 0.010) 100%)',
    border: 'rgba(255,255,255,0.11)',
    borderWidth: '0.5px',
    hoverLift: 2
  },
  // TIER 4: Narrative Intelligence Panel (warm inner-glow + soft contours)
  narrativePanel: {
    radius: '34px',
    blur: 'blur(28px) saturate(168%)',
    bg: 'linear-gradient(180deg, rgba(255, 255, 255, 0.042) 0%, rgba(255, 255, 255, 0.016) 100%)',
    border: 'rgba(255,255,255,0.10)',
    glowOpacity: 0.12,
    hoverLift: 1
  }
};

// ============================================================================
// SPACING RHYTHM
// ============================================================================
const SPACING = {
  heroToOrb: 52,
  orbToModules: 48,
  betweenModules: 24,
  modulesToDivider: 40,
  dividerToNarrative: 40,
  bottomPadding: 56
};

// ============================================================================
// SEGMENT COLOR ATMOSPHERES
// ============================================================================
const getTheme = (name) => {
  const themes = {
    Policy: { 
      Icon: Shield, 
      color: '#5A9BE8',
      colorRgb: '90, 155, 232',
      accentLight: 'rgba(90, 155, 232, 0.15)',
      atmospheric: 'rgba(90, 155, 232, 0.05)'
    },
    Credit: { 
      Icon: Briefcase, 
      color: '#9B7ADB',
      colorRgb: '155, 122, 219',
      accentLight: 'rgba(155, 122, 219, 0.15)',
      atmospheric: 'rgba(155, 122, 219, 0.05)'
    },
    Equities: { 
      Icon: BarChart3, 
      color: '#2DB87D',
      colorRgb: '45, 184, 125',
      accentLight: 'rgba(45, 184, 125, 0.15)',
      atmospheric: 'rgba(45, 184, 125, 0.05)'
    },
    Global: { 
      Icon: Globe, 
      color: '#D4A24A',
      colorRgb: '212, 162, 74',
      accentLight: 'rgba(212, 162, 74, 0.15)',
      atmospheric: 'rgba(212, 162, 74, 0.05)'
    }
  };
  return themes[name] || themes.Policy;
};

// ============================================================================
// SEGMENT DATA (TEXT UNCHANGED)
// ============================================================================
const getSegmentDetails = (segment) => {
  if (!segment) return null;
  
  const data = {
    Policy: {
      tldr: "Stricter rules are raising costs and putting pressure on big tech companies.",
      status: "Rising",
      trend: "up",
      certainty: 72,
      horizon: "Near-term",
      keyDriver: "Regulators are getting tougher across content, privacy, and platform practices.",
      pressureDirection: "Rules are becoming stricter, making the environment harder for companies.",
      marketImpact: "Moderate impact, with some industries beginning to feel more pressure.",
      whatThisMeans: "Stricter regulation is creating steady pressure on the market. Big tech companies may face higher costs and slower stock price growth as oversight increases."
    },
    Credit: {
      tldr: "Borrowing is getting more expensive and harder to access, especially for weaker borrowers.",
      status: "Moderate",
      trend: "up",
      certainty: 68,
      horizon: "Medium-term",
      keyDriver: "Lenders are getting more cautious after early signs of stress in riskier debt.",
      pressureDirection: "Credit is tightening, making it tougher for companies and households to refinance.",
      marketImpact: "Moderate impact, with highly indebted companies and lower-quality borrowers feeling it first.",
      whatThisMeans: "Tighter credit conditions can slow growth and increase default risk. Companies that rely heavily on cheap borrowing may face higher costs and less flexibility."
    },
    Equities: {
      tldr: "Most stock gains are coming from a small group of big companies, not the whole market.",
      status: "Narrow",
      trend: "neutral",
      certainty: 75,
      horizon: "Near-term",
      keyDriver: "Investors are crowding into large, well-known names while smaller stocks lag behind.",
      pressureDirection: "Support for the market is narrowing, making it more vulnerable if leaders stumble.",
      marketImpact: "Moderate impact, with the index looking strong on the surface but more fragile underneath.",
      whatThisMeans: "A narrow group of winners can keep the market up, but it also raises concentration risk. If leadership cracks, the pullback can be sharper."
    },
    Global: {
      tldr: "Slower growth in key regions, especially China, is starting to weigh on the global outlook.",
      status: "Softening",
      trend: "down",
      certainty: 70,
      horizon: "Medium-term",
      keyDriver: "Weaker demand from China and softer data in other major economies are cooling trade.",
      pressureDirection: "Growth momentum is cooling instead of accelerating.",
      marketImpact: "Moderate impact, with export-driven and commodity-linked areas feeling the slowdown more.",
      whatThisMeans: "A cooling global economy can pressure earnings expectations. If the slowdown deepens, markets may price in weaker profits and fewer growth opportunities."
    }
  };
  
  return data[segment.name] || data.Policy;
};

// ============================================================================
// TIER 1: HERO TITLE PLATE
// ============================================================================
const HeroTitlePlate = ({ segment, theme, scrollY }) => {
  const parallaxY = useTransform(scrollY, [0, 400], [0, 400 * MOTION.PARALLAX.heroPlate * 0.01]);
  
  return (
    <motion.div
      className="relative"
      style={{ 
        y: parallaxY,
        marginBottom: `${SPACING.heroToOrb}px`
      }}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: MOTION.DURATIONS.base, ease: MOTION.CURVES.cascade }}
    >
      {/* Atmospheric Color Bloom */}
      <div 
        className="absolute -inset-20 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 35%, ${theme.atmospheric} 0%, transparent 60%)`,
          filter: 'blur(45px)'
        }}
      />
      
      {/* Hero Glass Plate */}
      <div
        className="relative overflow-hidden"
        style={{
          padding: '34px 42px',
          background: GLASS.heroPlate.bg,
          backdropFilter: GLASS.heroPlate.blur,
          WebkitBackdropFilter: GLASS.heroPlate.blur,
          borderRadius: GLASS.heroPlate.radius,
          border: `1px solid ${GLASS.heroPlate.border}`
        }}
      >
        {/* VisionOS Inner Sheen */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: GLASS.heroPlate.sheen,
            borderRadius: GLASS.heroPlate.radius
          }}
        />
        
        {/* Segment Color Top Edge */}
        <div 
          className="absolute top-0 left-[18%] right-[18%] h-px pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent, rgba(${theme.colorRgb}, 0.28), transparent)`
          }}
        />
        
        {/* Title: 24px semibold */}
        <h1 
          className="relative"
          style={{
            fontSize: '24px',
            fontWeight: 600,
            color: 'rgba(255,255,255,0.97)',
            letterSpacing: '-0.012em',
            marginBottom: '10px',
            lineHeight: 1.25
          }}
        >
          {segment.name} Analysis
        </h1>
        
        {/* Subtitle: 16px medium, 65-70% opacity */}
        <p 
          className="relative"
          style={{
            fontSize: '16px',
            fontWeight: 500,
            color: 'rgba(255,255,255,0.68)',
            lineHeight: 1.5
          }}
        >
          Market Pressure Lens — What's Driving Street Alignment
        </p>
      </div>
    </motion.div>
  );
};

// ============================================================================
// TIER 2: TL;DR SIGNAL ORB (PRIMARY INSIGHT)
// ============================================================================
const SignalOrb = ({ details, theme, weight, scrollY }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [rippleActive, setRippleActive] = useState(false);
  const parallaxY = useTransform(scrollY, [0, 400], [0, 400 * MOTION.PARALLAX.signalOrb * 0.01]);
  
  const handleHoverStart = () => {
    setIsHovered(true);
    setRippleActive(true);
    setTimeout(() => setRippleActive(false), 280);
  };
  
  return (
    <motion.div
      className="flex justify-center"
      style={{ 
        y: parallaxY,
        marginBottom: `${SPACING.orbToModules}px` 
      }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.06, duration: MOTION.DURATIONS.mount, ease: MOTION.CURVES.mount }}
    >
      <motion.div
        className="relative overflow-hidden cursor-default"
        style={{
          width: '90%',
          maxWidth: '740px',
          padding: '26px 36px',
          background: GLASS.signalOrb.bgGradient(theme.colorRgb),
          backdropFilter: GLASS.signalOrb.blur,
          WebkitBackdropFilter: GLASS.signalOrb.blur,
          borderRadius: GLASS.signalOrb.radius,
          border: `1px solid ${GLASS.signalOrb.border}`
        }}
        animate={{
          y: isHovered ? -GLASS.signalOrb.hoverLift : 0,
          boxShadow: isHovered 
            ? `0 14px 44px rgba(0,0,0,0.16), 0 0 28px rgba(${theme.colorRgb}, 0.10)`
            : `0 8px 28px rgba(0,0,0,0.12), 0 0 18px rgba(${theme.colorRgb}, 0.06)`
        }}
        transition={{ duration: MOTION.DURATIONS.base, ease: MOTION.CURVES.easeOut }}
        onHoverStart={handleHoverStart}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Subtle Ripple (200-300ms) */}
        <AnimatePresence>
          {rippleActive && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(circle at 50% 50%, rgba(${theme.colorRgb}, 0.06) 0%, transparent 65%)`,
                borderRadius: GLASS.signalOrb.radius
              }}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1.15, opacity: [0, 0.45, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            />
          )}
        </AnimatePresence>
        
        {/* Inner Sheen */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.028) 0%, transparent 40%)',
            borderRadius: GLASS.signalOrb.radius
          }}
        />
        
        <div className="flex items-center justify-between gap-6 relative">
          {/* TL;DR Tag */}
          <div 
            className="flex-shrink-0 px-4 py-2 rounded-full"
            style={{
              fontSize: '10.5px',
              fontWeight: 600,
              color: 'rgba(255,255,255,0.88)',
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.18)',
              letterSpacing: '0.06em'
            }}
          >
            TL;DR
          </div>
          
          {/* TL;DR Text: ~20px */}
          <p 
            className="flex-1 text-center"
            style={{
              fontSize: '20px',
              fontWeight: 480,
              color: 'rgba(255,255,255,0.96)',
              lineHeight: 1.45,
              letterSpacing: '-0.01em'
            }}
          >
            {details.tldr}
          </p>
          
          {/* Floating Sentiment Pill (hover lift: 3px) */}
          <motion.div 
            className="flex items-center gap-3 flex-shrink-0"
            animate={{ y: isHovered ? -3 : 0 }}
            transition={{ duration: 0.18, ease: MOTION.CURVES.easeOut }}
          >
            <motion.div
              className="px-4 py-2 rounded-full"
              style={{
                fontSize: '12px',
                fontWeight: 560,
                color: theme.color,
                background: theme.accentLight,
                border: `1px solid rgba(${theme.colorRgb}, 0.28)`,
                boxShadow: `0 0 ${isHovered ? 18 : 10}px rgba(${theme.colorRgb}, ${isHovered ? 0.22 : 0.12})`
              }}
            >
              {details.status}
            </motion.div>
            
            <span 
              style={{ 
                fontSize: '12px', 
                fontWeight: 520,
                color: 'rgba(255,255,255,0.62)'
              }}
            >
              {Math.round(weight)}%
            </span>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ============================================================================
// TIER 3: FEATHER GLASS CARDS (INSIGHT MODULES)
// ============================================================================
const FeatherCard = ({ icon: Icon, label, content, theme, delay, scrollY }) => {
  const [isHovered, setIsHovered] = useState(false);
  const parallaxY = useTransform(scrollY, [0, 400], [0, 400 * MOTION.PARALLAX.insightModules * 0.01]);
  
  return (
    <motion.div
      className="relative"
      style={{ 
        y: parallaxY,
        marginBottom: `${SPACING.betweenModules}px`
      }}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: MOTION.DURATIONS.base, ease: MOTION.CURVES.easeOut }}
    >
      <motion.div
        className="relative overflow-hidden"
        style={{
          padding: '22px 28px',
          background: GLASS.featherCard.bg,
          backdropFilter: GLASS.featherCard.blur,
          WebkitBackdropFilter: GLASS.featherCard.blur,
          borderRadius: GLASS.featherCard.radius,
          border: `${GLASS.featherCard.borderWidth} solid ${GLASS.featherCard.border}`
        }}
        animate={{
          y: isHovered ? -GLASS.featherCard.hoverLift : 0,
          boxShadow: isHovered 
            ? `0 8px 22px rgba(0,0,0,0.10)`
            : '0 3px 10px rgba(0,0,0,0.05)'
        }}
        transition={{ duration: MOTION.DURATIONS.fast, ease: MOTION.CURVES.easeOut }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Segment Color Top Highlight (on hover +3-4%) */}
        <div 
          className="absolute top-0 left-[22%] right-[22%] h-px pointer-events-none transition-opacity duration-200"
          style={{
            background: `linear-gradient(90deg, transparent, rgba(${theme.colorRgb}, ${isHovered ? 0.20 : 0.10}), transparent)`
          }}
        />
        
        <div className="flex items-start gap-4 relative">
          {/* VisionOS-Style Embossed Icon */}
          <div 
            className="w-10 h-10 rounded-[14px] flex items-center justify-center flex-shrink-0"
            style={{
              background: `linear-gradient(145deg, ${theme.accentLight} 0%, rgba(${theme.colorRgb}, 0.06) 100%)`,
              boxShadow: `0 0 12px rgba(${theme.colorRgb}, 0.14), inset 0 1px 1px rgba(255,255,255,0.14)`
            }}
          >
            <Icon 
              className="w-[18px] h-[18px]" 
              style={{ 
                color: theme.color,
                filter: 'brightness(1.18)'
              }} 
              strokeWidth={2.2} 
            />
          </div>
          
          {/* Text Content */}
          <div className="flex-1 pt-0.5">
            {/* Insight Labels: 14px medium, ~60% opacity */}
            <h4 
              style={{
                fontSize: '14px',
                fontWeight: 500,
                color: 'rgba(255,255,255,0.60)',
                marginBottom: '8px',
                letterSpacing: '0.008em'
              }}
            >
              {label}
            </h4>
            
            {/* Insight Text: 15-16px regular */}
            <p 
              style={{
                fontSize: '15.5px',
                fontWeight: 400,
                color: 'rgba(255,255,255,0.92)',
                lineHeight: 1.58,
                letterSpacing: '-0.006em'
              }}
            >
              {content}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const InsightModulesStack = ({ details, theme, scrollY }) => {
  const modules = [
    { icon: Target, label: 'Key Driver', content: details.keyDriver },
    { icon: Waves, label: 'Pressure Direction', content: details.pressureDirection },
    { icon: BarChart3, label: 'Market Impact Level', content: details.marketImpact }
  ];
  
  return (
    <div style={{ marginBottom: `${SPACING.modulesToDivider}px` }}>
      {modules.map((module, idx) => (
        <FeatherCard
          key={module.label}
          icon={module.icon}
          label={module.label}
          content={module.content}
          theme={theme}
          delay={0.14 + (idx * 0.06)}
          scrollY={scrollY}
        />
      ))}
    </div>
  );
};

// ============================================================================
// SECTION TRANSITION DIVIDER
// ============================================================================
const TransitionDivider = ({ theme }) => {
  return (
    <motion.div
      className="relative flex items-center justify-center"
      style={{ 
        height: '24px',
        marginBottom: `${SPACING.dividerToNarrative}px`
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.36, duration: 0.22 }}
    >
      {/* Ghost Line: 1px at 4% opacity */}
      <div 
        className="absolute left-0 right-0 h-px"
        style={{ background: 'rgba(255,255,255,0.04)' }}
      />
      
      {/* Center Bloom: 6px radius, segment color */}
      <div 
        className="absolute"
        style={{
          width: '120px',
          height: '1px',
          background: `linear-gradient(90deg, transparent, rgba(${theme.colorRgb}, 0.32), transparent)`
        }}
      />
      
      {/* Glow Falloff: 50px horizontal */}
      <div 
        className="absolute"
        style={{
          width: '100px',
          height: '6px',
          background: `radial-gradient(ellipse at 50% 50%, rgba(${theme.colorRgb}, 0.10) 0%, transparent 100%)`,
          filter: 'blur(3px)'
        }}
      />
    </motion.div>
  );
};

// ============================================================================
// TIER 4: NARRATIVE INTELLIGENCE PANEL ("WHAT THIS MEANS")
// ============================================================================
const NarrativePanel = ({ details, theme, scrollY }) => {
  const [isHovered, setIsHovered] = useState(false);
  const parallaxY = useTransform(scrollY, [0, 400], [0, 400 * MOTION.PARALLAX.narrativePanel * 0.01]);
  
  return (
    <motion.div
      className="relative mx-auto"
      style={{ 
        y: parallaxY,
        maxWidth: '95%',
        marginBottom: '24px'
      }}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.42, duration: MOTION.DURATIONS.fadeUp, ease: MOTION.CURVES.mount }}
    >
      <motion.div
        className="relative overflow-hidden text-center"
        style={{
          padding: '42px 48px',
          background: GLASS.narrativePanel.bg,
          backdropFilter: GLASS.narrativePanel.blur,
          WebkitBackdropFilter: GLASS.narrativePanel.blur,
          borderRadius: GLASS.narrativePanel.radius,
          border: `1px solid ${GLASS.narrativePanel.border}`
        }}
        animate={{
          y: isHovered ? -GLASS.narrativePanel.hoverLift : 0,
          boxShadow: isHovered 
            ? `0 16px 48px rgba(0,0,0,0.14), 0 0 36px rgba(${theme.colorRgb}, ${GLASS.narrativePanel.glowOpacity})`
            : `0 10px 32px rgba(0,0,0,0.10), 0 0 24px rgba(${theme.colorRgb}, ${GLASS.narrativePanel.glowOpacity * 0.7})`
        }}
        transition={{ duration: MOTION.DURATIONS.base, ease: MOTION.CURVES.easeOut }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Warm Inner Glow */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.020) 0%, transparent 35%, rgba(0,0,0,0.008) 100%)',
            borderRadius: GLASS.narrativePanel.radius
          }}
        />
        
        {/* Segment Accent Edge Glow */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 25%, ${theme.atmospheric} 0%, transparent 65%)`,
            borderRadius: GLASS.narrativePanel.radius
          }}
        />
        
        {/* Top Edge Highlight */}
        <div 
          className="absolute top-0 left-[16%] right-[16%] h-px pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)'
          }}
        />
        
        {/* Narrative Label: 11-12px uppercased tracking */}
        <motion.h3 
          className="relative uppercase"
          style={{
            fontSize: '11.5px',
            fontWeight: 540,
            color: 'rgba(255,255,255,0.54)',
            letterSpacing: '0.15em',
            marginBottom: '18px'
          }}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.48, duration: MOTION.DURATIONS.fadeUp }}
        >
          What This Means
        </motion.h3>
        
        {/* Narrative Body: 18-19px regular */}
        <motion.p 
          className="relative"
          style={{
            fontSize: '18.5px',
            fontWeight: 420,
            color: 'rgba(255,255,255,0.94)',
            lineHeight: 1.58,
            letterSpacing: '-0.008em',
            maxWidth: '540px',
            margin: '0 auto'
          }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.52, duration: MOTION.DURATIONS.mount }}
        >
          {details.whatThisMeans}
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

// ============================================================================
// MICRO TAGS (OPTIONAL BOTTOM ROW)
// ============================================================================
const MicroTags = ({ details, theme }) => {
  const TrendIcon = details.trend === 'up' ? TrendingUp : details.trend === 'down' ? TrendingDown : null;
  
  return (
    <motion.div
      className="flex justify-end gap-2 px-3"
      style={{ marginBottom: `${SPACING.bottomPadding}px` }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.58, duration: 0.22 }}
    >
      {TrendIcon && (
        <div 
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
          style={{
            fontSize: '10px',
            fontWeight: 560,
            color: theme.color,
            background: theme.accentLight,
            border: `1px solid rgba(${theme.colorRgb}, 0.20)`
          }}
        >
          <TrendIcon className="w-3 h-3" strokeWidth={2.5} />
          <span>{details.trend === 'up' ? 'Rising' : 'Falling'}</span>
        </div>
      )}
      
      <div 
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg"
        style={{
          fontSize: '10px',
          fontWeight: 560,
          color: 'rgba(255,255,255,0.72)',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.10)'
        }}
      >
        <span>{details.certainty}% certain</span>
      </div>
      
      <div 
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg"
        style={{
          fontSize: '10px',
          fontWeight: 560,
          color: 'rgba(255,255,255,0.72)',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.10)'
        }}
      >
        <Clock className="w-3 h-3" strokeWidth={2.5} />
        <span>{details.horizon}</span>
      </div>
    </motion.div>
  );
};

// ============================================================================
// SIGNAL CASCADE V3 — COMPLETE DRAWER CONTENT
// ============================================================================
const SignalCascadeContent = ({ segment, scrollY }) => {
  const theme = getTheme(segment.name);
  const details = getSegmentDetails(segment);
  const weight = (segment?.weight || 0) * 100;
  
  if (!details) return null;
  
  return (
    <div 
      className="relative"
      style={{ padding: '28px 40px 0 40px' }}
    >
      {/* Background Atmospheric Layer */}
      <div 
        className="absolute top-0 left-0 right-0 h-[400px] pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 8%, ${theme.atmospheric} 0%, transparent 55%)`,
          filter: 'blur(50px)'
        }}
      />
      
      {/* 4-Tier Cascade */}
      <HeroTitlePlate segment={segment} theme={theme} scrollY={scrollY} />
      <SignalOrb details={details} theme={theme} weight={weight} scrollY={scrollY} />
      <InsightModulesStack details={details} theme={theme} scrollY={scrollY} />
      <TransitionDivider theme={theme} />
      <NarrativePanel details={details} theme={theme} scrollY={scrollY} />
      <MicroTags details={details} theme={theme} />
    </div>
  );
};

// ============================================================================
// MAIN DRAWER EXPORT
// ============================================================================
export default function SegmentDetailDrawer({ isOpen, onClose, segment, onNavigate }) {
  const scrollRef = useRef(null);
  const { scrollY } = useScroll({ container: scrollRef });
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose?.();
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen || !segment) return null;

  const theme = getTheme(segment.name);
  const { Icon } = theme;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.26, ease: MOTION.CURVES.easeOut }}
        style={{ paddingTop: '80px' }}
      >
        {/* Backdrop */}
        <motion.div 
          className="absolute inset-0"
          style={{ 
            top: '80px',
            background: 'rgba(0,0,0,0.76)',
            backdropFilter: 'blur(22px)',
            WebkitBackdropFilter: 'blur(22px)'
          }}
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.28 }}
        />
        
        {/* Drawer Panel */}
        <motion.div
          key={segment.name}
          className="relative w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col"
          style={{
            borderRadius: '32px',
            background: 'linear-gradient(180deg, rgba(10, 12, 18, 0.95) 0%, rgba(6, 8, 14, 0.98) 100%)',
            backdropFilter: 'blur(85px) saturate(185%)',
            WebkitBackdropFilter: 'blur(85px) saturate(185%)',
            border: '1px solid rgba(255,255,255,0.07)',
            boxShadow: `
              0 52px 100px -28px rgba(0, 0, 0, 0.90),
              0 0 44px rgba(${theme.colorRgb}, 0.05),
              inset 0 1px 0 rgba(255, 255, 255, 0.06)
            `
          }}
          initial={{ opacity: 0, scale: 0.97, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 14 }}
          transition={{ duration: 0.32, ease: MOTION.CURVES.cascade }}
        >
          {/* Top Rim Light */}
          <div 
            className="absolute top-0 left-[10%] right-[10%] h-px pointer-events-none z-10"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent)'
            }}
          />
          
          {/* Header */}
          <motion.div 
            className="relative p-5 flex-shrink-0 z-10"
            style={{ paddingTop: '18px', paddingBottom: '10px' }}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04, duration: 0.18 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div 
                  className="p-2.5 rounded-xl"
                  style={{ 
                    background: theme.accentLight,
                    boxShadow: `0 0 10px rgba(${theme.colorRgb}, 0.12)`
                  }}
                >
                  <Icon className="w-5 h-5" style={{ color: theme.color, filter: 'brightness(1.12)' }} strokeWidth={2.2} />
                </div>
                <span style={{ fontSize: '14px', fontWeight: 500, color: 'rgba(255,255,255,0.70)' }}>
                  {segment.name} Segment
                </span>
              </div>
              
              <div className="flex items-center space-x-1.5">
                <motion.button
                  onClick={() => onNavigate('prev')}
                  className="p-2.5 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                  whileHover={{ background: 'rgba(255,255,255,0.10)', scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Previous Segment"
                >
                  <ChevronLeft className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.70)' }} strokeWidth={2.2} />
                </motion.button>
                
                <motion.button
                  onClick={() => onNavigate('next')}
                  className="p-2.5 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                  whileHover={{ background: 'rgba(255,255,255,0.10)', scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Next Segment"
                >
                  <ChevronRight className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.70)' }} strokeWidth={2.2} />
                </motion.button>
                
                <motion.button 
                  onClick={onClose} 
                  className="p-2.5 rounded-xl ml-2"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                  whileHover={{ background: 'rgba(255,255,255,0.10)', scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Close"
                >
                  <X className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.70)' }} strokeWidth={2.2} />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Scrollable Content */}
          <div 
            ref={scrollRef}
            className="overflow-y-auto flex-1"
            style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
          >
            <SignalCascadeContent segment={segment} scrollY={scrollY} />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}