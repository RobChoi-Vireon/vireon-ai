// 🔒 DESIGN LOCKED — OS HORIZON "SIGNAL CASCADE V3" (FINAL PRODUCTION)
// Last Updated: 2025-01-28 | 4-Phase Cascade Layout + Horizon Waterfall Motion
// 16-Pillar Ironclad Audit Compliant
// See: DESIGN_LOCKED_COMPONENTS.md

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { X, Shield, Briefcase, BarChart3, Globe, Zap, Target, ChevronLeft, ChevronRight, Waves, TrendingUp, TrendingDown, Clock } from 'lucide-react';

// ============================================================================
// SIGNAL CASCADE V3 — MOTION DNA
// ============================================================================
const MOTION = {
  CURVES: {
    cascade: [0.25, 0.1, 0.25, 1.0],
    hover: [0.22, 0.58, 0.35, 1],
    press: [0.35, 0.1, 0.25, 1]
  },
  DURATIONS: {
    hover: 0.17,
    press: 0.09,
    mount: 0.22,
    stagger: 0.045 // 35-55ms per card
  },
  HOVER: {
    scale: 1.008,
    lift: 3,
    glowIncrease: 0.15
  }
};

// ============================================================================
// CASCADE SPACING MODEL (V3 Production)
// ============================================================================
const SPACING = {
  drawerPadding: 44,
  topIntro: 56,
  betweenPhases: 44,
  insidePhase: 26,
  bottomSafety: 64,
  breathingDivider: 52,     // 40-60px vertical spacer
  metaTagsSpacing: 30,      // 24-36px above meta row
  // Tri-insight stagger offsets (6-12px)
  staggerOffsets: [0, 8, 14],
  // Staggered widths for insight blocks
  staggerWidths: ['88%', '92%', '86%']
};

// ============================================================================
// 4-PHASE GLASS HIERARCHY (V3 Production Materials)
// ============================================================================
const GLASS = {
  // HEADER: Floating Glass Island (High-Clarity, low blur 18-22px)
  header: {
    radius: '24px',
    blur: 'blur(20px) saturate(160%)',
    bg: 'linear-gradient(180deg, rgba(255, 255, 255, 0.055) 0%, rgba(255, 255, 255, 0.028) 100%)',
    border: 'rgba(255,255,255,0.10)',
    glow: '0 4px 24px rgba(0, 0, 0, 0.12), 0 0 8px rgba(255, 255, 255, 0.015)'
  },
  // TL;DR: Liquid Metal Glass (denser, darker, higher contrast)
  tldr: {
    radius: '36px',
    blur: 'blur(38px) saturate(185%)',
    bg: (tintRgb) => `linear-gradient(180deg, rgba(${tintRgb}, 0.12) 0%, rgba(18, 20, 28, 0.75) 35%, rgba(12, 14, 22, 0.85) 100%)`,
    border: 'rgba(255,255,255,0.14)',
    glow: (tintRgb) => `0 0 55px rgba(${tintRgb}, 0.06), 0 8px 32px rgba(0, 0, 0, 0.22)`,
    glowHover: (tintRgb) => `0 0 65px rgba(${tintRgb}, 0.09), 0 10px 40px rgba(0, 0, 0, 0.26)`
  },
  // INSIGHT: Staggered Cards with varying glow (±10%)
  insight: {
    radius: '26px',
    blur: 'blur(22px) saturate(162%)',
    opacities: [0.07, 0.085, 0.065],
    glowIntensities: [0.055, 0.065, 0.05], // ±10% variance
    elevations: [1, 1.5, 1],
    bg: (tintRgb, opacity) => `linear-gradient(180deg, rgba(${tintRgb}, ${opacity * 1.1}) 0%, rgba(255, 255, 255, ${opacity * 0.55}) 50%, rgba(255, 255, 255, ${opacity * 0.25}) 100%)`,
    border: 'rgba(255,255,255,0.09)',
    glow: (tintRgb, intensity) => `0 0 ${35 + intensity * 200}px rgba(${tintRgb}, ${intensity}), 0 ${4 + intensity * 20}px ${16 + intensity * 40}px rgba(0, 0, 0, 0.10)`,
    glowHover: (tintRgb, intensity) => `0 0 ${45 + intensity * 200}px rgba(${tintRgb}, ${intensity + 0.025}), 0 ${6 + intensity * 20}px ${20 + intensity * 40}px rgba(0, 0, 0, 0.14)`
  },
  // CONCLUSION: Revelation Material (Subsurface Frosted Glass Light, elevation +4)
  revelation: {
    radius: '44px',
    blur: 'blur(30px) saturate(172%)',
    bg: (tintRgb) => `linear-gradient(180deg, rgba(255, 255, 255, 0.048) 0%, rgba(${tintRgb}, 0.035) 40%, rgba(255, 255, 255, 0.018) 100%)`,
    border: 'rgba(255,255,255,0.11)',
    glow: (tintRgb) => `0 0 90px rgba(${tintRgb}, 0.14), 0 16px 56px rgba(0, 0, 0, 0.18)`,
    glowHover: (tintRgb) => `0 0 100px rgba(${tintRgb}, 0.18), 0 20px 64px rgba(0, 0, 0, 0.22)`
  },
  // META: Reduced chips (20-25% smaller, 55-65% opacity)
  meta: {
    radius: '8px',
    bg: 'rgba(255,255,255,0.045)',
    border: 'rgba(255,255,255,0.08)',
    opacity: 0.60
  }
};

// ============================================================================
// SEGMENT TINT LOGIC (Per-Segment Color Atmospheres)
// ============================================================================
const getTheme = (name) => {
  const themes = {
    Policy: { 
      Icon: Shield, 
      color: '#5A9BE8',
      colorRgb: '90, 155, 232',
      tint: { card: 0.14, glow: 0.08, icon: 0.24 }
    },
    Credit: { 
      Icon: Briefcase, 
      color: '#9B7ADB',
      colorRgb: '155, 122, 219',
      tint: { card: 0.14, glow: 0.08, icon: 0.24 }
    },
    Equities: { 
      Icon: BarChart3, 
      color: '#2DB87D',
      colorRgb: '45, 184, 125',
      tint: { card: 0.12, glow: 0.07, icon: 0.22 }
    },
    Global: { 
      Icon: Globe, 
      color: '#D4A24A',
      colorRgb: '212, 162, 74',
      tint: { card: 0.15, glow: 0.09, icon: 0.25 }
    }
  };
  return themes[name] || themes.Policy;
};

// ============================================================================
// SEGMENT DATA (UNCHANGED TEXT)
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
// TL;DR ANCHOR BAR (Liquid Metal Glass)
// ============================================================================
const TLDRAnchorBar = ({ details, theme, weight, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  
  return (
    <motion.div
      className="relative w-full"
      style={{ marginBottom: `${SPACING.betweenPhases}px` }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: index * MOTION.DURATIONS.stagger, 
        duration: MOTION.DURATIONS.mount, 
        ease: MOTION.CURVES.cascade 
      }}
    >
      <motion.div
        className="relative overflow-hidden"
        style={{
          padding: '30px 40px',
          minHeight: '130px',
          background: GLASS.tldr.bg(theme.colorRgb),
          backdropFilter: GLASS.tldr.blur,
          WebkitBackdropFilter: GLASS.tldr.blur,
          borderRadius: GLASS.tldr.radius,
          border: `1px solid ${GLASS.tldr.border}`
        }}
        animate={{
          scale: isPressed ? 0.997 : (isHovered ? MOTION.HOVER.scale : 1),
          y: isPressed ? 1 : (isHovered ? -MOTION.HOVER.lift : 0),
          boxShadow: isHovered 
            ? GLASS.tldr.glowHover(theme.colorRgb)
            : GLASS.tldr.glow(theme.colorRgb)
        }}
        transition={{ 
          duration: isPressed ? MOTION.DURATIONS.press : MOTION.DURATIONS.hover, 
          ease: isPressed ? MOTION.CURVES.press : MOTION.CURVES.hover 
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onTapStart={() => setIsPressed(true)}
        onTap={() => setIsPressed(false)}
        onTapCancel={() => setIsPressed(false)}
      >
        {/* Liquid Metal Sheen */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.032) 0%, transparent 35%, rgba(0,0,0,0.08) 100%)',
            borderRadius: GLASS.tldr.radius
          }}
        />
        
        {/* Segment Tint Top Edge (5-7% glow) */}
        <div 
          className="absolute top-0 left-[12%] right-[12%] h-px pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent, rgba(${theme.colorRgb}, 0.38), transparent)`
          }}
        />
        
        <div className="flex flex-col items-center text-center relative">
          {/* TL;DR Tag */}
          <div 
            className="inline-block px-4 py-2 rounded-full mb-5"
            style={{
              fontSize: '10px',
              fontWeight: 650,
              color: 'rgba(255,255,255,0.92)',
              background: 'rgba(255,255,255,0.14)',
              border: '1px solid rgba(255,255,255,0.20)',
              letterSpacing: '0.08em'
            }}
          >
            TL;DR
          </div>
          
          {/* Primary Text */}
          <p 
            style={{
              fontSize: '19px',
              fontWeight: 480,
              color: 'rgba(255,255,255,0.97)',
              lineHeight: 1.54,
              letterSpacing: '-0.01em',
              maxWidth: '680px'
            }}
          >
            {details.tldr}
          </p>
          
          {/* Tag + Sentiment + Weight Row (perfectly aligned) */}
          <div className="flex items-center justify-center gap-4 mt-5">
            <motion.div
              className="px-4 py-2 rounded-full"
              style={{
                fontSize: '12px',
                fontWeight: 580,
                color: theme.color,
                background: `rgba(${theme.colorRgb}, ${theme.tint.card})`,
                border: `1px solid rgba(${theme.colorRgb}, 0.32)`,
                boxShadow: `0 0 ${isHovered ? 22 : 14}px rgba(${theme.colorRgb}, ${isHovered ? 0.22 : 0.14})`
              }}
            >
              {details.status}
            </motion.div>
            
            <span style={{ fontSize: '12px', fontWeight: 520, color: 'rgba(255,255,255,0.58)' }}>
              {Math.round(weight)}% weight
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ============================================================================
// INSIGHT STACK (Staggered Widths + Elevations)
// ============================================================================
const InsightCard = ({ icon: Icon, label, content, theme, cardIndex, phaseIndex }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  
  const opacity = GLASS.insight.opacities[cardIndex] || 0.07;
  const glowIntensity = GLASS.insight.glowIntensities[cardIndex] || 0.055;
  const staggerOffset = SPACING.staggerOffsets[cardIndex] || 0;
  const width = SPACING.staggerWidths[cardIndex] || '88%';
  
  return (
    <motion.div
      className="relative flex justify-center"
      style={{ 
        marginBottom: `${SPACING.insidePhase}px`,
        marginTop: `${staggerOffset}px`
      }}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: phaseIndex * MOTION.DURATIONS.stagger, 
        duration: MOTION.DURATIONS.mount, 
        ease: MOTION.CURVES.cascade 
      }}
    >
      <motion.div
        className="relative overflow-hidden"
        style={{
          width: width,
          padding: '24px 30px',
          background: GLASS.insight.bg(theme.colorRgb, opacity),
          backdropFilter: GLASS.insight.blur,
          WebkitBackdropFilter: GLASS.insight.blur,
          borderRadius: GLASS.insight.radius,
          border: `0.5px solid ${GLASS.insight.border}`
        }}
        animate={{
          scale: isPressed ? 0.997 : (isHovered ? MOTION.HOVER.scale : 1),
          y: isPressed ? 1 : (isHovered ? -MOTION.HOVER.lift : 0),
          boxShadow: isHovered 
            ? GLASS.insight.glowHover(theme.colorRgb, glowIntensity)
            : GLASS.insight.glow(theme.colorRgb, glowIntensity)
        }}
        transition={{ 
          duration: isPressed ? MOTION.DURATIONS.press : MOTION.DURATIONS.hover, 
          ease: isPressed ? MOTION.CURVES.press : MOTION.CURVES.hover 
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onTapStart={() => setIsPressed(true)}
        onTap={() => setIsPressed(false)}
        onTapCancel={() => setIsPressed(false)}
      >
        {/* Segment Tint Accent */}
        <div 
          className="absolute top-0 left-[18%] right-[18%] h-px pointer-events-none transition-opacity duration-200"
          style={{
            background: `linear-gradient(90deg, transparent, rgba(${theme.colorRgb}, ${isHovered ? 0.26 : 0.15}), transparent)`
          }}
        />
        
        <div className="flex items-start gap-4 relative">
          {/* VisionOS-Style Icon */}
          <div 
            className="w-10 h-10 rounded-[14px] flex items-center justify-center flex-shrink-0"
            style={{
              background: `linear-gradient(145deg, rgba(${theme.colorRgb}, ${theme.tint.icon}) 0%, rgba(${theme.colorRgb}, 0.08) 100%)`,
              boxShadow: `0 0 14px rgba(${theme.colorRgb}, 0.16), inset 0 1px 1px rgba(255,255,255,0.15)`
            }}
          >
            <Icon 
              className="w-[18px] h-[18px]" 
              style={{ color: theme.color, filter: 'brightness(1.20)' }} 
              strokeWidth={2.2} 
            />
          </div>
          
          <div className="flex-1 pt-0.5">
            <h4 
              style={{
                fontSize: '13px',
                fontWeight: 520,
                color: 'rgba(255,255,255,0.72)',
                marginBottom: '8px',
                letterSpacing: '0.02em'
              }}
            >
              {label}
            </h4>
            
            <p 
              style={{
                fontSize: '15px',
                fontWeight: 420,
                color: 'rgba(255,255,255,0.86)',
                lineHeight: 1.64,
                letterSpacing: '-0.005em'
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

const TriInsightCluster = ({ details, theme, startIndex }) => {
  const modules = [
    { icon: Target, label: 'Key Driver', content: details.keyDriver },
    { icon: Waves, label: 'Pressure Direction', content: details.pressureDirection },
    { icon: BarChart3, label: 'Market Impact Level', content: details.marketImpact }
  ];
  
  return (
    <div style={{ marginBottom: `${SPACING.betweenPhases}px` }}>
      {modules.map((module, idx) => (
        <InsightCard
          key={module.label}
          icon={module.icon}
          label={module.label}
          content={module.content}
          theme={theme}
          cardIndex={idx}
          phaseIndex={startIndex + idx}
        />
      ))}
    </div>
  );
};

// ============================================================================
// BREATHING DIVIDER (40-60px spacer with gradient fade)
// ============================================================================
const BreathingDivider = ({ theme }) => {
  return (
    <motion.div
      className="relative flex justify-center"
      style={{ 
        height: `${SPACING.breathingDivider}px`,
        marginBottom: '0px'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.32, duration: 0.24 }}
    >
      {/* Vertical Gradient Fade (0% → 6% opacity) */}
      <div 
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, transparent 0%, rgba(${theme.colorRgb}, 0.06) 50%, transparent 100%)`
        }}
      />
    </motion.div>
  );
};

// ============================================================================
// CONCLUSION BLOCK (Revelation Material — Elevation +4, "Aha Moment")
// ============================================================================
const RevelationPanel = ({ details, theme, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [scrollOffset, setScrollOffset] = useState(0);
  
  // Micro-parallax on scroll (0.6-1.0px)
  useEffect(() => {
    const handleScroll = (e) => {
      const scrollTop = e.target?.scrollTop || 0;
      setScrollOffset(scrollTop * 0.0008); // 0.8px parallax factor
    };
    
    const scrollContainer = document.querySelector('[data-scroll-container]');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);
  
  return (
    <motion.div
      className="relative flex justify-center"
      style={{ 
        marginBottom: `${SPACING.metaTagsSpacing}px`
      }}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: index * MOTION.DURATIONS.stagger, 
        duration: MOTION.DURATIONS.mount, 
        ease: MOTION.CURVES.cascade 
      }}
    >
      <motion.div
        className="relative overflow-hidden text-center"
        style={{
          width: '86%',
          padding: '48px 52px',
          background: GLASS.revelation.bg(theme.colorRgb),
          backdropFilter: GLASS.revelation.blur,
          WebkitBackdropFilter: GLASS.revelation.blur,
          borderRadius: GLASS.revelation.radius,
          border: `1px solid ${GLASS.revelation.border}`,
          transform: `translateY(${scrollOffset}px)`
        }}
        animate={{
          scale: isPressed ? 0.998 : (isHovered ? 1.005 : 1),
          y: isPressed ? 0.5 : (isHovered ? -2 : scrollOffset),
          boxShadow: isHovered 
            ? GLASS.revelation.glowHover(theme.colorRgb)
            : GLASS.revelation.glow(theme.colorRgb)
        }}
        transition={{ 
          duration: isPressed ? MOTION.DURATIONS.press : MOTION.DURATIONS.hover, 
          ease: isPressed ? MOTION.CURVES.press : MOTION.CURVES.hover 
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onTapStart={() => setIsPressed(true)}
        onTap={() => setIsPressed(false)}
        onTapCancel={() => setIsPressed(false)}
      >
        {/* Subsurface Frosted Glow */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.028) 0%, transparent 30%, rgba(0,0,0,0.04) 100%)',
            borderRadius: GLASS.revelation.radius
          }}
        />
        
        {/* Color-Coded Glow Halo (12-16%) */}
        <div 
          className="absolute inset-[-2px] pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, rgba(${theme.colorRgb}, 0.14) 0%, transparent 55%)`,
            borderRadius: GLASS.revelation.radius,
            filter: 'blur(20px)'
          }}
        />
        
        {/* Top Edge Highlight */}
        <div 
          className="absolute top-0 left-[10%] right-[10%] h-px pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent, rgba(${theme.colorRgb}, 0.28), transparent)`
          }}
        />
        
        {/* Title */}
        <h3 
          className="relative uppercase"
          style={{
            fontSize: '10px',
            fontWeight: 580,
            color: 'rgba(255,255,255,0.50)',
            letterSpacing: '0.18em',
            marginBottom: '20px'
          }}
        >
          What This Means
        </h3>
        
        {/* Revelation Text (larger, increased line-height) */}
        <p 
          className="relative"
          style={{
            fontSize: '18.5px',
            fontWeight: 450,
            color: 'rgba(255,255,255,0.94)',
            lineHeight: 1.68,
            letterSpacing: '-0.01em',
            maxWidth: '540px',
            margin: '0 auto'
          }}
        >
          {details.whatThisMeans}
        </p>
      </motion.div>
    </motion.div>
  );
};

// ============================================================================
// META-SIGNAL STRIP (Reduced chips, 55-65% opacity, visually subordinate)
// ============================================================================
const MetaSignalStrip = ({ details, theme, index }) => {
  const TrendIcon = details.trend === 'up' ? TrendingUp : details.trend === 'down' ? TrendingDown : null;
  
  return (
    <motion.div
      className="flex justify-center gap-2"
      style={{ 
        marginBottom: `${SPACING.bottomSafety}px`,
        opacity: GLASS.meta.opacity
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: GLASS.meta.opacity }}
      transition={{ delay: index * MOTION.DURATIONS.stagger, duration: 0.2 }}
    >
      {TrendIcon && (
        <div 
          className="flex items-center gap-1 px-2.5 py-1"
          style={{
            fontSize: '9px',
            fontWeight: 560,
            color: theme.color,
            background: `rgba(${theme.colorRgb}, 0.10)`,
            border: `1px solid rgba(${theme.colorRgb}, 0.18)`,
            borderRadius: GLASS.meta.radius
          }}
        >
          <TrendIcon className="w-2.5 h-2.5" strokeWidth={2.5} />
          <span>{details.trend === 'up' ? 'Rising' : 'Falling'}</span>
        </div>
      )}
      
      <div 
        className="flex items-center gap-1 px-2.5 py-1"
        style={{
          fontSize: '9px',
          fontWeight: 560,
          color: 'rgba(255,255,255,0.65)',
          background: GLASS.meta.bg,
          border: `1px solid ${GLASS.meta.border}`,
          borderRadius: GLASS.meta.radius
        }}
      >
        <span>{details.certainty}% certain</span>
      </div>
      
      <div 
        className="flex items-center gap-1 px-2.5 py-1"
        style={{
          fontSize: '9px',
          fontWeight: 560,
          color: 'rgba(255,255,255,0.65)',
          background: GLASS.meta.bg,
          border: `1px solid ${GLASS.meta.border}`,
          borderRadius: GLASS.meta.radius
        }}
      >
        <Clock className="w-2.5 h-2.5" strokeWidth={2.5} />
        <span>{details.horizon}</span>
      </div>
    </motion.div>
  );
};

// ============================================================================
// SIGNAL CASCADE V3 — COMPLETE DRAWER CONTENT
// ============================================================================
const SignalCascadeContent = ({ segment }) => {
  const theme = getTheme(segment.name);
  const details = getSegmentDetails(segment);
  const weight = (segment?.weight || 0) * 100;
  
  if (!details) return null;
  
  // Cascade index tracking for Horizon Waterfall Motion
  let cascadeIndex = 0;
  
  return (
    <div 
      className="relative"
      data-scroll-container
      style={{ 
        padding: `${SPACING.topIntro}px ${SPACING.drawerPadding}px 0 ${SPACING.drawerPadding}px` 
      }}
    >
      {/* Background Atmospheric Layer */}
      <div 
        className="absolute top-0 left-0 right-0 h-[420px] pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 5%, rgba(${theme.colorRgb}, 0.05) 0%, transparent 55%)`,
          filter: 'blur(50px)'
        }}
      />
      
      {/* TL;DR ANCHOR BAR (Liquid Metal Glass) */}
      <TLDRAnchorBar 
        details={details} 
        theme={theme} 
        weight={weight} 
        index={cascadeIndex++} 
      />
      
      {/* TRI-INSIGHT CLUSTER (Staggered Widths) */}
      <TriInsightCluster 
        details={details} 
        theme={theme} 
        startIndex={cascadeIndex} 
      />
      
      {/* BREATHING DIVIDER */}
      <BreathingDivider theme={theme} />
      
      {/* REVELATION PANEL (Conclusion Block) */}
      <RevelationPanel 
        details={details} 
        theme={theme} 
        index={cascadeIndex + 4} 
      />
      
      {/* META-SIGNAL STRIP (Subordinate Footer) */}
      <MetaSignalStrip 
        details={details} 
        theme={theme} 
        index={cascadeIndex + 5} 
      />
    </div>
  );
};

// ============================================================================
// MAIN DRAWER EXPORT
// ============================================================================
export default function SegmentDetailDrawer({ isOpen, onClose, segment, onNavigate }) {
  const scrollRef = useRef(null);
  
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
        transition={{ duration: 0.24, ease: MOTION.CURVES.cascade }}
        style={{ paddingTop: '80px' }}
      >
        {/* Backdrop */}
        <motion.div 
          className="absolute inset-0"
          style={{ 
            top: '80px',
            background: 'rgba(0,0,0,0.78)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)'
          }}
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.26 }}
        />
        
        {/* Drawer Panel */}
        <motion.div
          key={segment.name}
          className="relative w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col"
          style={{
            borderRadius: '32px',
            background: 'linear-gradient(180deg, rgba(10, 12, 18, 0.96) 0%, rgba(6, 8, 14, 0.98) 100%)',
            backdropFilter: 'blur(90px) saturate(188%)',
            WebkitBackdropFilter: 'blur(90px) saturate(188%)',
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: `
              0 56px 110px -30px rgba(0, 0, 0, 0.92),
              0 0 40px rgba(${theme.colorRgb}, 0.04),
              inset 0 1px 0 rgba(255, 255, 255, 0.05)
            `
          }}
          initial={{ opacity: 0, scale: 0.97, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 16 }}
          transition={{ duration: 0.30, ease: MOTION.CURVES.cascade }}
        >
          {/* Top Rim Light */}
          <div 
            className="absolute top-0 left-[8%] right-[8%] h-px pointer-events-none z-10"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)' }}
          />
          
          {/* FLOATING GLASS ISLAND HEADER (Elevation +2, 84-88% width) */}
          <motion.div 
            className="relative flex-shrink-0 z-10 flex justify-center"
            style={{ padding: '20px 24px 16px 24px' }}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.03, duration: 0.18 }}
          >
            <div 
              className="relative overflow-hidden"
              style={{
                width: '86%',
                padding: '16px 24px',
                background: GLASS.header.bg,
                backdropFilter: GLASS.header.blur,
                WebkitBackdropFilter: GLASS.header.blur,
                borderRadius: GLASS.header.radius,
                border: `1px solid ${GLASS.header.border}`,
                boxShadow: GLASS.header.glow
              }}
            >
              {/* Top Sheen */}
              <div 
                className="absolute top-0 left-[15%] right-[15%] h-px pointer-events-none"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)' }}
              />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="p-2.5 rounded-xl"
                    style={{ 
                      background: `rgba(${theme.colorRgb}, ${theme.tint.card})`,
                      boxShadow: `0 0 12px rgba(${theme.colorRgb}, 0.12)`
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: theme.color, filter: 'brightness(1.16)' }} strokeWidth={2.2} />
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 540, color: 'rgba(255,255,255,0.72)' }}>
                    {segment.name} Analysis
                  </span>
                </div>
                
                <div className="flex items-center space-x-1.5">
                  <motion.button
                    onClick={() => onNavigate('prev')}
                    className="p-2 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)' }}
                    whileHover={{ background: 'rgba(255,255,255,0.11)', scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Previous Segment"
                  >
                    <ChevronLeft className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.70)' }} strokeWidth={2.2} />
                  </motion.button>
                  
                  <motion.button
                    onClick={() => onNavigate('next')}
                    className="p-2 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)' }}
                    whileHover={{ background: 'rgba(255,255,255,0.11)', scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Next Segment"
                  >
                    <ChevronRight className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.70)' }} strokeWidth={2.2} />
                  </motion.button>
                  
                  <motion.button 
                    onClick={onClose} 
                    className="p-2 rounded-xl ml-1.5"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)' }}
                    whileHover={{ background: 'rgba(255,255,255,0.11)', scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.70)' }} strokeWidth={2.2} />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Scrollable Content */}
          <div 
            ref={scrollRef}
            className="overflow-y-auto flex-1"
            style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
          >
            <SignalCascadeContent segment={segment} />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}