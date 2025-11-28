// 🔒 DESIGN LOCKED — OS HORIZON V3.5 "SIGNAL CASCADE V2" ARCHITECTURE
// Last Updated: 2025-01-28 | VisionOS Depth Layers + Liquid Glass Realism
// Full Kinetic Parallax + Feather Card System
// See: DESIGN_LOCKED_COMPONENTS.md

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { X, Shield, Briefcase, BarChart3, Globe, Zap, Target, ChevronLeft, ChevronRight, Waves, TrendingUp, TrendingDown, Clock } from 'lucide-react';

// ============================================================================
// SIGNAL CASCADE V2 — MOTION DNA
// ============================================================================
const MOTION = {
  CURVES: {
    silk: [0.25, 0.1, 0.25, 1.0],
    cascade: [0.22, 0.68, 0.35, 1],
    breathe: [0.4, 0.0, 0.2, 1],
    bounce: [0.34, 1.56, 0.64, 1]
  },
  DURATIONS: {
    fast: 0.12,
    base: 0.18,
    slow: 0.28,
    cascade: 0.38
  },
  // Kinetic Parallax Rates
  PARALLAX: {
    title: -1.5,
    tldr: -1.0,
    insights: -0.5,
    narrative: -0.25
  }
};

// ============================================================================
// SIGNAL CASCADE V2 — GLASS PLATE SYSTEM
// ============================================================================
const CASCADE_TOKENS = {
  // Level 1: Title Frame
  titleFrame: {
    radius: '28px',
    blur: 'blur(28px) saturate(170%)',
    bg: 'linear-gradient(180deg, rgba(255, 255, 255, 0.042) 0%, rgba(255, 255, 255, 0.018) 100%)',
    border: 'rgba(255,255,255,0.08)'
  },
  // Level 2: TL;DR Signal Orb
  signalOrb: {
    radius: '36px',
    blur: 'blur(32px) saturate(175%)',
    bg: (color) => `linear-gradient(135deg, ${color}08 0%, rgba(255, 255, 255, 0.045) 50%, rgba(255, 255, 255, 0.025) 100%)`,
    border: 'rgba(255,255,255,0.14)'
  },
  // Feather Cards
  featherCard: {
    radius: '24px',
    blur: 'blur(20px) saturate(155%)',
    bg: 'linear-gradient(180deg, rgba(255, 255, 255, 0.032) 0%, rgba(255, 255, 255, 0.012) 100%)',
    border: 'rgba(255,255,255,0.12)',
    borderWidth: '0.5px',
    hoverLift: 2
  },
  // Level 3: Intelligence Panel
  intelligencePanel: {
    radius: '36px',
    blur: 'blur(26px) saturate(168%)',
    bg: 'linear-gradient(180deg, rgba(255, 255, 255, 0.038) 0%, rgba(255, 255, 255, 0.016) 100%)',
    border: 'rgba(255,255,255,0.10)',
    glowOpacity: 0.35
  },
  // Spacing Rhythm
  rhythm: {
    titleToTldr: 48,
    tldrToInsights: 44,
    betweenCards: 20,
    insightsToNarrative: 56,
    bottomPadding: 64
  }
};

// ============================================================================
// SEGMENT THEMING — ATMOSPHERIC COLORS
// ============================================================================
const getTheme = (name) => {
  const themes = {
    Policy: { 
      Icon: Shield, 
      color: '#5A9BE8',
      colorRgb: '90, 155, 232',
      accentLight: 'rgba(90, 155, 232, 0.14)',
      atmospheric: 'rgba(90, 155, 232, 0.06)',
      gradient: 'linear-gradient(135deg, rgba(90, 155, 232, 0.12) 0%, transparent 100%)'
    },
    Credit: { 
      Icon: Briefcase, 
      color: '#9B7ADB',
      colorRgb: '155, 122, 219',
      accentLight: 'rgba(155, 122, 219, 0.14)',
      atmospheric: 'rgba(155, 122, 219, 0.06)',
      gradient: 'linear-gradient(135deg, rgba(155, 122, 219, 0.12) 0%, transparent 100%)'
    },
    Equities: { 
      Icon: BarChart3, 
      color: '#2DB87D',
      colorRgb: '45, 184, 125',
      accentLight: 'rgba(45, 184, 125, 0.14)',
      atmospheric: 'rgba(45, 184, 125, 0.06)',
      gradient: 'linear-gradient(135deg, rgba(45, 184, 125, 0.12) 0%, transparent 100%)'
    },
    Global: { 
      Icon: Globe, 
      color: '#D4A24A',
      colorRgb: '212, 162, 74',
      accentLight: 'rgba(212, 162, 74, 0.14)',
      atmospheric: 'rgba(212, 162, 74, 0.06)',
      gradient: 'linear-gradient(135deg, rgba(212, 162, 74, 0.12) 0%, transparent 100%)'
    }
  };
  return themes[name] || themes.Policy;
};

// ============================================================================
// SEGMENT DATA
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
// LEVEL 1: TITLE FRAME — 2-Layer Parallax Drift
// ============================================================================
const TitleFrame = ({ segment, theme, scrollY }) => {
  const parallaxY = useTransform(scrollY, [0, 300], [0, 300 * MOTION.PARALLAX.title * 0.01]);
  const parallaxY2 = useTransform(scrollY, [0, 300], [0, 300 * MOTION.PARALLAX.title * 0.015]);
  
  return (
    <motion.div
      className="relative"
      style={{ 
        y: parallaxY,
        marginBottom: `${CASCADE_TOKENS.rhythm.titleToTldr}px`
      }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: MOTION.DURATIONS.cascade, ease: MOTION.CURVES.cascade }}
    >
      {/* Layer 1: Atmospheric Bloom */}
      <motion.div 
        className="absolute -inset-16 pointer-events-none"
        style={{
          y: parallaxY2,
          background: `radial-gradient(ellipse at 50% 40%, ${theme.atmospheric} 0%, transparent 65%)`,
          filter: 'blur(50px)'
        }}
      />
      
      {/* Layer 2: Edge Glow */}
      <div 
        className="absolute -inset-1 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, rgba(${theme.colorRgb}, 0.08) 0%, transparent 60%)`,
          borderRadius: CASCADE_TOKENS.titleFrame.radius,
          filter: 'blur(20px)'
        }}
      />
      
      {/* Title Frame Glass */}
      <div
        className="relative overflow-hidden"
        style={{
          padding: '32px 40px',
          background: CASCADE_TOKENS.titleFrame.bg,
          backdropFilter: CASCADE_TOKENS.titleFrame.blur,
          WebkitBackdropFilter: CASCADE_TOKENS.titleFrame.blur,
          borderRadius: CASCADE_TOKENS.titleFrame.radius,
          border: `1px solid ${CASCADE_TOKENS.titleFrame.border}`
        }}
      >
        {/* Inner Sheen */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.015) 0%, transparent 50%)',
            borderRadius: CASCADE_TOKENS.titleFrame.radius
          }}
        />
        
        {/* Segment Color Accent Line */}
        <div 
          className="absolute top-0 left-[20%] right-[20%] h-px pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent, rgba(${theme.colorRgb}, 0.25), transparent)`
          }}
        />
        
        <h1 
          className="relative"
          style={{
            fontSize: '24px',
            fontWeight: 600,
            color: 'rgba(255,255,255,0.96)',
            letterSpacing: '-0.01em',
            marginBottom: '10px',
            lineHeight: 1.25
          }}
        >
          {segment.name} Analysis
        </h1>
        
        <p 
          className="relative"
          style={{
            fontSize: '16px',
            fontWeight: 450,
            color: 'rgba(255,255,255,0.68)',
            lineHeight: 1.5
          }}
        >
          Market Pressure Lens — <span style={{ color: theme.color, opacity: 0.9 }}>What's Driving Street Alignment</span>
        </p>
      </div>
    </motion.div>
  );
};

// ============================================================================
// LEVEL 2: TL;DR SIGNAL ORB — Ripple + Hover Physics
// ============================================================================
const SignalOrb = ({ details, theme, weight, scrollY }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [rippleKey, setRippleKey] = useState(0);
  const parallaxY = useTransform(scrollY, [0, 300], [0, 300 * MOTION.PARALLAX.tldr * 0.01]);
  
  const handleHover = () => {
    setIsHovered(true);
    setRippleKey(prev => prev + 1);
  };
  
  return (
    <motion.div
      className="flex justify-center"
      style={{ 
        y: parallaxY,
        marginBottom: `${CASCADE_TOKENS.rhythm.tldrToInsights}px` 
      }}
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.08, duration: MOTION.DURATIONS.slow, ease: MOTION.CURVES.silk }}
    >
      <motion.div
        className="relative overflow-hidden cursor-default"
        style={{
          width: '88%',
          maxWidth: '720px',
          padding: '24px 32px',
          background: CASCADE_TOKENS.signalOrb.bg(theme.color),
          backdropFilter: CASCADE_TOKENS.signalOrb.blur,
          WebkitBackdropFilter: CASCADE_TOKENS.signalOrb.blur,
          borderRadius: CASCADE_TOKENS.signalOrb.radius,
          border: `1px solid ${CASCADE_TOKENS.signalOrb.border}`
        }}
        animate={{
          y: isHovered ? -3 : 0,
          boxShadow: isHovered 
            ? `0 12px 40px rgba(0,0,0,0.15), 0 0 30px rgba(${theme.colorRgb}, 0.12)`
            : `0 6px 24px rgba(0,0,0,0.10), 0 0 20px rgba(${theme.colorRgb}, 0.06)`
        }}
        transition={{ duration: 0.2, ease: MOTION.CURVES.silk }}
        onHoverStart={handleHover}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Micro-Ripple Animation */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              key={rippleKey}
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(circle at 50% 50%, rgba(${theme.colorRgb}, 0.08) 0%, transparent 70%)`,
                borderRadius: CASCADE_TOKENS.signalOrb.radius
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.2, opacity: [0, 0.5, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          )}
        </AnimatePresence>
        
        {/* Gradient Overlay */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: theme.gradient,
            borderRadius: CASCADE_TOKENS.signalOrb.radius,
            opacity: 0.5
          }}
        />
        
        {/* Inner Glass Sheen */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.025) 0%, transparent 40%)',
            borderRadius: CASCADE_TOKENS.signalOrb.radius
          }}
        />
        
        <div className="flex items-center justify-between gap-6 relative">
          {/* TL;DR Tag */}
          <div 
            className="flex-shrink-0 px-3.5 py-2 rounded-full"
            style={{
              fontSize: '10.5px',
              fontWeight: 600,
              color: 'rgba(255,255,255,0.85)',
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.16)',
              letterSpacing: '0.05em'
            }}
          >
            TL;DR
          </div>
          
          {/* Centered Insight Text */}
          <p 
            className="flex-1 text-center"
            style={{
              fontSize: '20px',
              fontWeight: 480,
              color: 'rgba(255,255,255,0.95)',
              lineHeight: 1.45,
              letterSpacing: '-0.01em'
            }}
          >
            {details.tldr}
          </p>
          
          {/* Sentiment Pill with Micro-Lift */}
          <motion.div 
            className="flex items-center gap-2.5 flex-shrink-0"
            animate={{ y: isHovered ? -2 : 0 }}
            transition={{ duration: 0.15 }}
          >
            <motion.div
              className="px-4 py-2 rounded-full"
              style={{
                fontSize: '12px',
                fontWeight: 550,
                color: theme.color,
                background: theme.accentLight,
                border: `1px solid rgba(${theme.colorRgb}, 0.25)`,
                boxShadow: isHovered ? `0 0 16px rgba(${theme.colorRgb}, 0.25)` : `0 0 8px rgba(${theme.colorRgb}, 0.12)`
              }}
              transition={{ duration: 0.2 }}
            >
              {details.status}
            </motion.div>
            
            <span 
              style={{ 
                fontSize: '12px', 
                fontWeight: 500,
                color: 'rgba(255,255,255,0.65)'
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
// FEATHER CARDS — VisionOS Style Insight Modules
// ============================================================================
const FeatherCard = ({ icon: Icon, label, content, theme, delay, scrollY, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const parallaxY = useTransform(scrollY, [0, 300], [0, 300 * MOTION.PARALLAX.insights * 0.01]);
  
  return (
    <motion.div
      className="relative"
      style={{ 
        y: parallaxY,
        marginBottom: `${CASCADE_TOKENS.rhythm.betweenCards}px`
      }}
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: MOTION.DURATIONS.base, ease: MOTION.CURVES.silk }}
    >
      <motion.div
        className="relative overflow-hidden"
        style={{
          padding: '22px 26px',
          background: CASCADE_TOKENS.featherCard.bg,
          backdropFilter: CASCADE_TOKENS.featherCard.blur,
          WebkitBackdropFilter: CASCADE_TOKENS.featherCard.blur,
          borderRadius: CASCADE_TOKENS.featherCard.radius,
          border: `${CASCADE_TOKENS.featherCard.borderWidth} solid rgba(255,255,255,${isHovered ? 0.16 : 0.12})`
        }}
        animate={{
          y: isHovered ? -CASCADE_TOKENS.featherCard.hoverLift : 0,
          boxShadow: isHovered 
            ? `0 8px 24px rgba(0,0,0,0.12), 0 0 1px rgba(${theme.colorRgb}, 0.15)`
            : '0 4px 12px rgba(0,0,0,0.06)'
        }}
        transition={{ duration: 0.16, ease: MOTION.CURVES.silk }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Subtle Color Highlight on Border */}
        <div 
          className="absolute top-0 left-[25%] right-[25%] h-px pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent, rgba(${theme.colorRgb}, ${isHovered ? 0.22 : 0.12}), transparent)`,
            transition: 'all 0.2s ease'
          }}
        />
        
        <div className="flex items-start gap-4 relative">
          {/* VisionOS Style Icon - Brighter Embossing */}
          <div 
            className="w-10 h-10 rounded-[14px] flex items-center justify-center flex-shrink-0"
            style={{
              background: `linear-gradient(135deg, ${theme.accentLight} 0%, rgba(${theme.colorRgb}, 0.08) 100%)`,
              boxShadow: `0 0 14px rgba(${theme.colorRgb}, 0.18), inset 0 1px 1px rgba(255,255,255,0.12)`
            }}
          >
            <Icon 
              className="w-[18px] h-[18px]" 
              style={{ 
                color: theme.color,
                filter: 'brightness(1.15)'
              }} 
              strokeWidth={2.2} 
            />
          </div>
          
          {/* Text Content */}
          <div className="flex-1 pt-0.5">
            <h4 
              style={{
                fontSize: '14px',
                fontWeight: 500,
                color: 'rgba(255,255,255,0.62)',
                marginBottom: '8px',
                letterSpacing: '0.01em'
              }}
            >
              {label}
            </h4>
            
            <p 
              style={{
                fontSize: '15.5px',
                fontWeight: 400,
                color: 'rgba(255,255,255,0.92)',
                lineHeight: 1.58,
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

const InsightStack = ({ details, theme, scrollY }) => {
  const modules = [
    { icon: Target, label: 'Key Driver', content: details.keyDriver },
    { icon: Waves, label: 'Pressure Direction', content: details.pressureDirection },
    { icon: BarChart3, label: 'Market Impact Level', content: details.marketImpact }
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.15, duration: MOTION.DURATIONS.base }}
    >
      {modules.map((module, idx) => (
        <FeatherCard
          key={module.label}
          icon={module.icon}
          label={module.label}
          content={module.content}
          theme={theme}
          delay={0.18 + (idx * 0.07)}
          scrollY={scrollY}
          index={idx}
        />
      ))}
    </motion.div>
  );
};

// ============================================================================
// DIVIDER TRANSITION — Segment Color Bloom
// ============================================================================
const DividerTransition = ({ theme }) => {
  return (
    <motion.div
      className="relative flex items-center justify-center"
      style={{ 
        height: '48px',
        marginBottom: `${CASCADE_TOKENS.rhythm.insightsToNarrative - 48}px`
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.3 }}
    >
      {/* Base Line */}
      <div 
        className="absolute left-0 right-0 h-px"
        style={{
          background: 'rgba(255,255,255,0.04)'
        }}
      />
      
      {/* Center Bloom */}
      <div 
        className="absolute h-px"
        style={{
          left: 'calc(50% - 80px)',
          right: 'calc(50% - 80px)',
          background: `linear-gradient(90deg, transparent, rgba(${theme.colorRgb}, 0.25), transparent)`
        }}
      />
      
      {/* Bloom Glow */}
      <div 
        className="absolute"
        style={{
          left: 'calc(50% - 40px)',
          right: 'calc(50% - 40px)',
          height: '8px',
          background: `radial-gradient(ellipse at 50% 50%, rgba(${theme.colorRgb}, 0.12) 0%, transparent 100%)`,
          filter: 'blur(4px)'
        }}
      />
    </motion.div>
  );
};

// ============================================================================
// LEVEL 3: INTELLIGENCE PANEL — "WHAT THIS MEANS"
// ============================================================================
const IntelligencePanel = ({ details, theme, scrollY }) => {
  const [isHovered, setIsHovered] = useState(false);
  const parallaxY = useTransform(scrollY, [0, 300], [0, 300 * MOTION.PARALLAX.narrative * 0.01]);
  
  return (
    <motion.div
      className="relative mx-auto"
      style={{ 
        y: parallaxY,
        maxWidth: '94%',
        marginBottom: '28px'
      }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45, duration: MOTION.DURATIONS.slow, ease: MOTION.CURVES.breathe }}
    >
      <motion.div
        className="relative overflow-hidden text-center"
        style={{
          padding: '38px 44px',
          background: CASCADE_TOKENS.intelligencePanel.bg,
          backdropFilter: CASCADE_TOKENS.intelligencePanel.blur,
          WebkitBackdropFilter: CASCADE_TOKENS.intelligencePanel.blur,
          borderRadius: CASCADE_TOKENS.intelligencePanel.radius,
          border: `1px solid ${CASCADE_TOKENS.intelligencePanel.border}`
        }}
        animate={{
          y: isHovered ? -1 : 0,
          boxShadow: isHovered 
            ? `0 16px 48px rgba(0,0,0,0.14), 0 0 40px rgba(${theme.colorRgb}, ${CASCADE_TOKENS.intelligencePanel.glowOpacity * 0.012})`
            : `0 10px 32px rgba(0,0,0,0.10), 0 0 28px rgba(${theme.colorRgb}, ${CASCADE_TOKENS.intelligencePanel.glowOpacity * 0.008})`
        }}
        transition={{ duration: 0.2, ease: MOTION.CURVES.silk }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Inner Glass Sheen */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.018) 0%, transparent 35%, rgba(0,0,0,0.008) 100%)',
            borderRadius: CASCADE_TOKENS.intelligencePanel.radius
          }}
        />
        
        {/* Atmospheric Tint */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 30%, ${theme.atmospheric} 0%, transparent 70%)`,
            borderRadius: CASCADE_TOKENS.intelligencePanel.radius
          }}
        />
        
        {/* Top Edge Highlight */}
        <div 
          className="absolute top-0 left-[18%] right-[18%] h-px pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)'
          }}
        />
        
        {/* Apple-Style Spaced Label */}
        <motion.h3 
          className="relative uppercase"
          style={{
            fontSize: '11.5px',
            fontWeight: 520,
            color: 'rgba(255,255,255,0.55)',
            letterSpacing: '0.14em',
            marginBottom: '18px'
          }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.25 }}
        >
          What This Means
        </motion.h3>
        
        {/* Narrative Body */}
        <motion.p 
          className="relative"
          style={{
            fontSize: '19px',
            fontWeight: 420,
            color: 'rgba(255,255,255,0.94)',
            lineHeight: 1.58,
            letterSpacing: '-0.008em',
            maxWidth: '560px',
            margin: '0 auto'
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.3 }}
        >
          {details.whatThisMeans}
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

// ============================================================================
// MICRO TAGS — Bottom Right Chips
// ============================================================================
const MicroTags = ({ details, theme }) => {
  const TrendIcon = details.trend === 'up' ? TrendingUp : details.trend === 'down' ? TrendingDown : null;
  
  return (
    <motion.div
      className="flex justify-end gap-2.5 px-4"
      style={{ marginBottom: `${CASCADE_TOKENS.rhythm.bottomPadding}px` }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.25 }}
    >
      {/* Trend Direction */}
      {TrendIcon && (
        <div 
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
          style={{
            fontSize: '10px',
            fontWeight: 550,
            color: theme.color,
            background: theme.accentLight,
            border: `1px solid rgba(${theme.colorRgb}, 0.18)`
          }}
        >
          <TrendIcon className="w-3 h-3" strokeWidth={2.5} />
          <span>{details.trend === 'up' ? 'Rising' : 'Falling'}</span>
        </div>
      )}
      
      {/* Certainty */}
      <div 
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg"
        style={{
          fontSize: '10px',
          fontWeight: 550,
          color: 'rgba(255,255,255,0.75)',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.10)'
        }}
      >
        <span>{details.certainty}% certain</span>
      </div>
      
      {/* Time Horizon */}
      <div 
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg"
        style={{
          fontSize: '10px',
          fontWeight: 550,
          color: 'rgba(255,255,255,0.75)',
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
// SIGNAL CASCADE V2 — COMPLETE DRAWER CONTENT
// ============================================================================
const SignalCascadeContent = ({ segment, scrollY }) => {
  const theme = getTheme(segment.name);
  const details = getSegmentDetails(segment);
  const weight = (segment?.weight || 0) * 100;
  
  if (!details) return null;
  
  return (
    <div 
      className="relative"
      style={{ padding: '32px 44px 0 44px' }}
    >
      {/* Background Atmospheric Layer */}
      <div 
        className="absolute top-0 left-0 right-0 h-[450px] pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 10%, ${theme.atmospheric} 0%, transparent 60%)`,
          filter: 'blur(60px)'
        }}
      />
      
      {/* Cascade Flow */}
      <TitleFrame segment={segment} theme={theme} scrollY={scrollY} />
      <SignalOrb details={details} theme={theme} weight={weight} scrollY={scrollY} />
      <InsightStack details={details} theme={theme} scrollY={scrollY} />
      <DividerTransition theme={theme} />
      <IntelligencePanel details={details} theme={theme} scrollY={scrollY} />
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
        transition={{ duration: 0.28, ease: MOTION.CURVES.silk }}
        style={{ paddingTop: '80px' }}
      >
        {/* Backdrop */}
        <motion.div 
          className="absolute inset-0"
          style={{ 
            top: '80px',
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)'
          }}
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Drawer Panel */}
        <motion.div
          key={segment.name}
          className="relative w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col"
          style={{
            borderRadius: '32px',
            background: 'linear-gradient(180deg, rgba(10, 12, 18, 0.94) 0%, rgba(6, 8, 14, 0.97) 100%)',
            backdropFilter: 'blur(80px) saturate(185%)',
            WebkitBackdropFilter: 'blur(80px) saturate(185%)',
            border: '1px solid rgba(255,255,255,0.07)',
            boxShadow: `
              0 48px 96px -24px rgba(0, 0, 0, 0.88),
              0 0 48px rgba(${theme.colorRgb}, 0.06),
              inset 0 1px 0 rgba(255, 255, 255, 0.06)
            `
          }}
          initial={{ opacity: 0, scale: 0.97, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 16 }}
          transition={{ duration: MOTION.DURATIONS.cascade, ease: MOTION.CURVES.cascade }}
        >
          {/* Top Edge Rim Light */}
          <div 
            className="absolute top-0 left-[10%] right-[10%] h-[1px] pointer-events-none z-10"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)'
            }}
          />
          
          {/* Header Navigation */}
          <motion.div 
            className="relative p-5 flex-shrink-0 z-10"
            style={{ paddingTop: '20px', paddingBottom: '12px' }}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div 
                  className="p-2.5 rounded-xl"
                  style={{ 
                    background: theme.accentLight,
                    boxShadow: `0 0 12px rgba(${theme.colorRgb}, 0.15)`
                  }}
                >
                  <Icon className="w-5 h-5" style={{ color: theme.color, filter: 'brightness(1.1)' }} strokeWidth={2.2} />
                </div>
                <span 
                  style={{ 
                    fontSize: '14px', 
                    fontWeight: 500, 
                    color: 'rgba(255,255,255,0.72)'
                  }}
                >
                  {segment.name} Segment
                </span>
              </div>
              
              <div className="flex items-center space-x-1.5">
                <motion.button
                  onClick={() => onNavigate('prev')}
                  className="p-2.5 rounded-xl"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)'
                  }}
                  whileHover={{ background: 'rgba(255,255,255,0.10)', scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Previous Segment"
                >
                  <ChevronLeft className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.72)' }} strokeWidth={2.2} />
                </motion.button>
                
                <motion.button
                  onClick={() => onNavigate('next')}
                  className="p-2.5 rounded-xl"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)'
                  }}
                  whileHover={{ background: 'rgba(255,255,255,0.10)', scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Next Segment"
                >
                  <ChevronRight className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.72)' }} strokeWidth={2.2} />
                </motion.button>
                
                <motion.button 
                  onClick={onClose} 
                  className="p-2.5 rounded-xl ml-2"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)'
                  }}
                  whileHover={{ background: 'rgba(255,255,255,0.10)', scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Close"
                >
                  <X className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.72)' }} strokeWidth={2.2} />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Scrollable Content */}
          <div 
            ref={scrollRef}
            className="overflow-y-auto flex-1"
            style={{ 
              scrollBehavior: 'smooth',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            <SignalCascadeContent segment={segment} scrollY={scrollY} />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}