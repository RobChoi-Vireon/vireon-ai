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
// CASCADE SPACING MODEL
// ============================================================================
const SPACING = {
  drawerPadding: 42,       // 38-44px
  topIntro: 52,            // 48-55px
  betweenPhases: 40,       // 36-44px
  insidePhase: 24,         // 22-26px
  bottomSafety: 62,        // 55-70px
  // Tri-insight stagger offsets
  staggerOffsets: [0, 7, 13] // Card 1 normal, Card 2 +6-8px, Card 3 +12-14px
};

// ============================================================================
// 4-PHASE GLASS HIERARCHY
// ============================================================================
const GLASS = {
  // PHASE 1: Primary Signal Panel (highest luminosity)
  primary: {
    radius: '28px',
    blur: 'blur(32px) saturate(178%)',
    opacity: 0.09, // 8-10%
    bg: (tintRgb) => `linear-gradient(180deg, rgba(${tintRgb}, 0.14) 0%, rgba(255, 255, 255, 0.055) 40%, rgba(255, 255, 255, 0.025) 100%)`,
    border: 'rgba(255,255,255,0.12)',
    glow: (tintRgb) => `0 0 60px rgba(${tintRgb}, 0.10), 0 0 30px rgba(${tintRgb}, 0.06)`,
    glowHover: (tintRgb) => `0 0 70px rgba(${tintRgb}, 0.14), 0 0 35px rgba(${tintRgb}, 0.08)`
  },
  // PHASE 2: Tri-Insight Cards (mid luminosity, alternating)
  insight: {
    radius: '24px',
    blur: 'blur(24px) saturate(165%)',
    opacities: [0.08, 0.10, 0.08], // Alternating contrast
    bg: (tintRgb, opacity) => `linear-gradient(180deg, rgba(${tintRgb}, ${opacity * 1.2}) 0%, rgba(255, 255, 255, ${opacity * 0.6}) 50%, rgba(255, 255, 255, ${opacity * 0.3}) 100%)`,
    border: 'rgba(255,255,255,0.10)',
    glow: (tintRgb) => `0 0 40px rgba(${tintRgb}, 0.06), 0 0 20px rgba(${tintRgb}, 0.04)`,
    glowHover: (tintRgb) => `0 0 50px rgba(${tintRgb}, 0.09), 0 0 25px rgba(${tintRgb}, 0.06)`
  },
  // PHASE 3: Interpretation Panel (lowest luminosity, softest)
  interpretation: {
    radius: '30px',
    blur: 'blur(26px) saturate(160%)',
    opacity: 0.065, // 6-7%
    bg: (tintRgb) => `linear-gradient(180deg, rgba(${tintRgb}, 0.08) 0%, rgba(255, 255, 255, 0.035) 45%, rgba(255, 255, 255, 0.015) 100%)`,
    border: 'rgba(255,255,255,0.08)',
    glow: (tintRgb) => `0 0 80px rgba(${tintRgb}, 0.05), 0 0 40px rgba(${tintRgb}, 0.03)`,
    glowHover: (tintRgb) => `0 0 90px rgba(${tintRgb}, 0.07), 0 0 45px rgba(${tintRgb}, 0.04)`
  },
  // PHASE 4: Meta-Signal Strip (no container, badges only)
  meta: {
    radius: '10px',
    bg: 'rgba(255,255,255,0.06)',
    border: 'rgba(255,255,255,0.10)'
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
// PHASE 1: PRIMARY SIGNAL PANEL (North Star)
// ============================================================================
const PrimarySignalPanel = ({ details, theme, weight, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  
  return (
    <motion.div
      className="relative"
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
          padding: '32px 38px',
          minHeight: '140px', // 20-30% taller
          background: GLASS.primary.bg(theme.colorRgb),
          backdropFilter: GLASS.primary.blur,
          WebkitBackdropFilter: GLASS.primary.blur,
          borderRadius: GLASS.primary.radius,
          border: `1px solid ${GLASS.primary.border}`
        }}
        animate={{
          scale: isPressed ? 0.997 : (isHovered ? MOTION.HOVER.scale : 1),
          y: isPressed ? 1 : (isHovered ? -MOTION.HOVER.lift : 0),
          boxShadow: isHovered 
            ? GLASS.primary.glowHover(theme.colorRgb)
            : GLASS.primary.glow(theme.colorRgb)
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
        {/* Inner Sheen */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.025) 0%, transparent 40%)',
            borderRadius: GLASS.primary.radius
          }}
        />
        
        {/* Segment Tint Top Edge */}
        <div 
          className="absolute top-0 left-[15%] right-[15%] h-px pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent, rgba(${theme.colorRgb}, 0.32), transparent)`
          }}
        />
        
        <div className="flex flex-col items-center text-center relative">
          {/* TL;DR Tag */}
          <div 
            className="inline-block px-4 py-2 rounded-full mb-5"
            style={{
              fontSize: '10px',
              fontWeight: 650,
              color: 'rgba(255,255,255,0.90)',
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.18)',
              letterSpacing: '0.08em'
            }}
          >
            TL;DR
          </div>
          
          {/* Primary Text: Centered, max-width 680-720px */}
          <p 
            style={{
              fontSize: '19px',
              fontWeight: 480,
              color: 'rgba(255,255,255,0.96)',
              lineHeight: 1.52,
              letterSpacing: '-0.01em',
              maxWidth: '700px'
            }}
          >
            {details.tldr}
          </p>
          
          {/* Bias Tag + Certainty */}
          <div className="flex items-center gap-4 mt-5">
            <motion.div
              className="px-4 py-2 rounded-full"
              style={{
                fontSize: '12px',
                fontWeight: 580,
                color: theme.color,
                background: `rgba(${theme.colorRgb}, ${theme.tint.card})`,
                border: `1px solid rgba(${theme.colorRgb}, 0.30)`,
                boxShadow: `0 0 ${isHovered ? 20 : 12}px rgba(${theme.colorRgb}, ${isHovered ? 0.20 : 0.12})`
              }}
            >
              {details.status}
            </motion.div>
            
            <span style={{ fontSize: '12px', fontWeight: 520, color: 'rgba(255,255,255,0.60)' }}>
              {Math.round(weight)}% weight
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ============================================================================
// PHASE 2: TRI-INSIGHT CLUSTER (Staggered Rhythm)
// ============================================================================
const InsightCard = ({ icon: Icon, label, content, theme, cardIndex, phaseIndex }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  
  const opacity = GLASS.insight.opacities[cardIndex] || 0.08;
  const staggerOffset = SPACING.staggerOffsets[cardIndex] || 0;
  
  return (
    <motion.div
      className="relative"
      style={{ 
        marginBottom: `${SPACING.insidePhase}px`,
        marginTop: `${staggerOffset}px` // Staggered vertical rhythm
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
          padding: '22px 28px',
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
            ? GLASS.insight.glowHover(theme.colorRgb)
            : GLASS.insight.glow(theme.colorRgb)
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
          className="absolute top-0 left-[20%] right-[20%] h-px pointer-events-none transition-opacity duration-200"
          style={{
            background: `linear-gradient(90deg, transparent, rgba(${theme.colorRgb}, ${isHovered ? 0.24 : 0.14}), transparent)`
          }}
        />
        
        <div className="flex items-start gap-4 relative">
          {/* VisionOS-Style Icon (20-26% tint intensity) */}
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
            {/* Header: -1 step, +1-2% letter spacing, 70-75% opacity */}
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
            
            {/* Body: +2-4px line height, 84-88% opacity */}
            <p 
              style={{
                fontSize: '15px',
                fontWeight: 420,
                color: 'rgba(255,255,255,0.86)',
                lineHeight: 1.62,
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
// PHASE 3: INTERPRETATION PANEL (What This Means)
// ============================================================================
const InterpretationPanel = ({ details, theme, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  
  return (
    <motion.div
      className="relative"
      style={{ 
        marginTop: `${SPACING.betweenPhases - 8}px`, // 32-36px above
        marginBottom: `${SPACING.insidePhase}px`
      }}
      initial={{ opacity: 0, y: 16 }}
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
          padding: '38px 44px',
          background: GLASS.interpretation.bg(theme.colorRgb),
          backdropFilter: GLASS.interpretation.blur,
          WebkitBackdropFilter: GLASS.interpretation.blur,
          borderRadius: GLASS.interpretation.radius,
          border: `1px solid ${GLASS.interpretation.border}`
        }}
        animate={{
          scale: isPressed ? 0.998 : (isHovered ? 1.004 : 1),
          y: isPressed ? 0.5 : (isHovered ? -1 : 0),
          boxShadow: isHovered 
            ? GLASS.interpretation.glowHover(theme.colorRgb)
            : GLASS.interpretation.glow(theme.colorRgb)
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
        {/* Soft Inner Glow */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.018) 0%, transparent 35%)',
            borderRadius: GLASS.interpretation.radius
          }}
        />
        
        {/* Atmospheric Tint (phase-scaled: lowest for Phase 3) */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 20%, rgba(${theme.colorRgb}, 0.04) 0%, transparent 60%)`,
            borderRadius: GLASS.interpretation.radius
          }}
        />
        
        {/* Top Edge Highlight */}
        <div 
          className="absolute top-0 left-[14%] right-[14%] h-px pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)'
          }}
        />
        
        {/* Title: 1 step smaller */}
        <h3 
          className="relative uppercase"
          style={{
            fontSize: '10.5px',
            fontWeight: 560,
            color: 'rgba(255,255,255,0.52)',
            letterSpacing: '0.16em',
            marginBottom: '16px'
          }}
        >
          What This Means
        </h3>
        
        {/* Paragraph: +1 weight (light → regular) */}
        <p 
          className="relative"
          style={{
            fontSize: '17px',
            fontWeight: 440,
            color: 'rgba(255,255,255,0.92)',
            lineHeight: 1.62,
            letterSpacing: '-0.008em',
            maxWidth: '520px',
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
// PHASE 4: META-SIGNAL STRIP (Bottom Tags)
// ============================================================================
const MetaSignalStrip = ({ details, theme, index }) => {
  const TrendIcon = details.trend === 'up' ? TrendingUp : details.trend === 'down' ? TrendingDown : null;
  
  return (
    <motion.div
      className="flex justify-center gap-2.5"
      style={{ marginBottom: `${SPACING.bottomSafety}px` }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * MOTION.DURATIONS.stagger, duration: 0.2 }}
    >
      {TrendIcon && (
        <div 
          className="flex items-center gap-1.5 px-3 py-1.5"
          style={{
            fontSize: '10px',
            fontWeight: 580,
            color: theme.color,
            background: `rgba(${theme.colorRgb}, 0.12)`,
            border: `1px solid rgba(${theme.colorRgb}, 0.22)`,
            borderRadius: GLASS.meta.radius
          }}
        >
          <TrendIcon className="w-3 h-3" strokeWidth={2.5} />
          <span>{details.trend === 'up' ? 'Rising' : 'Falling'}</span>
        </div>
      )}
      
      <div 
        className="flex items-center gap-1 px-3 py-1.5"
        style={{
          fontSize: '10px',
          fontWeight: 580,
          color: 'rgba(255,255,255,0.70)',
          background: GLASS.meta.bg,
          border: `1px solid ${GLASS.meta.border}`,
          borderRadius: GLASS.meta.radius
        }}
      >
        <span>{details.certainty}% certain</span>
      </div>
      
      <div 
        className="flex items-center gap-1 px-3 py-1.5"
        style={{
          fontSize: '10px',
          fontWeight: 580,
          color: 'rgba(255,255,255,0.70)',
          background: GLASS.meta.bg,
          border: `1px solid ${GLASS.meta.border}`,
          borderRadius: GLASS.meta.radius
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
      style={{ 
        padding: `${SPACING.topIntro}px ${SPACING.drawerPadding}px 0 ${SPACING.drawerPadding}px` 
      }}
    >
      {/* Background Atmospheric Layer */}
      <div 
        className="absolute top-0 left-0 right-0 h-[380px] pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 5%, rgba(${theme.colorRgb}, 0.045) 0%, transparent 50%)`,
          filter: 'blur(45px)'
        }}
      />
      
      {/* PHASE 1: Primary Signal Panel */}
      <PrimarySignalPanel 
        details={details} 
        theme={theme} 
        weight={weight} 
        index={cascadeIndex++} 
      />
      
      {/* PHASE 2: Tri-Insight Cluster */}
      <TriInsightCluster 
        details={details} 
        theme={theme} 
        startIndex={cascadeIndex} 
      />
      {/* Advance index by 3 for the cluster */}
      
      {/* PHASE 3: Interpretation Panel */}
      <InterpretationPanel 
        details={details} 
        theme={theme} 
        index={cascadeIndex + 4} 
      />
      
      {/* PHASE 4: Meta-Signal Strip */}
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
          
          {/* Header */}
          <motion.div 
            className="relative p-5 flex-shrink-0 z-10"
            style={{ paddingTop: '18px', paddingBottom: '10px' }}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.03, duration: 0.16 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div 
                  className="p-2.5 rounded-xl"
                  style={{ 
                    background: `rgba(${theme.colorRgb}, ${theme.tint.card})`,
                    boxShadow: `0 0 10px rgba(${theme.colorRgb}, 0.10)`
                  }}
                >
                  <Icon className="w-5 h-5" style={{ color: theme.color, filter: 'brightness(1.14)' }} strokeWidth={2.2} />
                </div>
                <span style={{ fontSize: '14px', fontWeight: 520, color: 'rgba(255,255,255,0.68)' }}>
                  {segment.name} Analysis
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
                  <ChevronLeft className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.68)' }} strokeWidth={2.2} />
                </motion.button>
                
                <motion.button
                  onClick={() => onNavigate('next')}
                  className="p-2.5 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                  whileHover={{ background: 'rgba(255,255,255,0.10)', scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Next Segment"
                >
                  <ChevronRight className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.68)' }} strokeWidth={2.2} />
                </motion.button>
                
                <motion.button 
                  onClick={onClose} 
                  className="p-2.5 rounded-xl ml-2"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                  whileHover={{ background: 'rgba(255,255,255,0.10)', scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Close"
                >
                  <X className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.68)' }} strokeWidth={2.2} />
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
            <SignalCascadeContent segment={segment} />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}