// 🔒 DESIGN LOCKED — OS HORIZON V3.0 "SIGNAL CASCADE" ARCHITECTURE
// Last Updated: 2025-01-28 | Full Structural Redesign
// Liquid Glass + macOS Tahoe/VisionOS Compliance
// See: DESIGN_LOCKED_COMPONENTS.md

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { X, Shield, Briefcase, BarChart3, Globe, Zap, Target, ChevronLeft, ChevronRight, Waves, ArrowUp, ArrowDown, ArrowRight } from 'lucide-react';

// ============================================================================
// SIGNAL CASCADE — MOTION DNA
// ============================================================================
const MOTION = {
  CURVES: {
    silk: [0.25, 0.1, 0.25, 1.0],
    cascade: [0.22, 0.68, 0.35, 1],
    breathe: [0.4, 0.0, 0.2, 1]
  },
  DURATIONS: {
    fast: 0.12,
    base: 0.18,
    slow: 0.28,
    cascade: 0.34
  }
};

// ============================================================================
// SIGNAL CASCADE — UNIFIED GLASS SYSTEM
// ============================================================================
const CASCADE_TOKENS = {
  // Tier 1: Hero Block (strongest presence)
  hero: {
    radius: '32px',
    blur: 'blur(26px) saturate(168%)',
    bg: 'linear-gradient(180deg, rgba(255, 255, 255, 0.038) 0%, rgba(255, 255, 255, 0.018) 100%)',
    border: 'rgba(255,255,255,0.08)',
    glow: (color) => `0 0 80px ${color}08, 0 0 40px ${color}05`
  },
  // Tier 2: TL;DR Capsule (focal point)
  capsule: {
    radius: '999px',
    blur: 'blur(28px) saturate(172%)',
    bg: 'linear-gradient(180deg, rgba(255, 255, 255, 0.055) 0%, rgba(255, 255, 255, 0.032) 100%)',
    border: 'rgba(255,255,255,0.12)',
    glow: (color) => `0 0 32px ${color}12, 0 0 16px ${color}08, inset 0 1px 1px rgba(255,255,255,0.08)`
  },
  // Tier 0.5: Insight Modules (lightweight, minimal)
  module: {
    separatorOpacity: 0.10,
    iconGlow: (color) => `0 0 12px ${color}15`
  },
  // Tier 3: Narrative Block (emotional crescendo)
  narrative: {
    radius: '32px',
    blur: 'blur(24px) saturate(165%)',
    bg: 'linear-gradient(180deg, rgba(255, 255, 255, 0.042) 0%, rgba(255, 255, 255, 0.022) 100%)',
    border: 'rgba(255,255,255,0.09)',
    glow: (color) => `0 0 48px ${color}08, inset 0 1px 0 rgba(255,255,255,0.06)`
  },
  // Cascade Rhythm (vertical spacing)
  rhythm: {
    heroToTldr: 56,
    tldrToModules: 48,
    betweenModules: 32,
    modulesToNarrative: 64,
    bottomPadding: 72
  }
};

// ============================================================================
// SEGMENT THEMING (10-15% reduced saturation)
// ============================================================================
const getTheme = (name) => {
  const themes = {
    Policy: { 
      Icon: Shield, 
      color: '#6A9FDE', // reduced saturation
      accentLight: 'rgba(106, 159, 222, 0.12)',
      atmospheric: 'rgba(106, 159, 222, 0.04)'
    },
    Credit: { 
      Icon: Briefcase, 
      color: '#A980E0', // reduced saturation
      accentLight: 'rgba(169, 128, 224, 0.12)',
      atmospheric: 'rgba(169, 128, 224, 0.04)'
    },
    Equities: { 
      Icon: BarChart3, 
      color: '#2DB87D', // reduced saturation
      accentLight: 'rgba(45, 184, 125, 0.12)',
      atmospheric: 'rgba(45, 184, 125, 0.04)'
    },
    Global: { 
      Icon: Globe, 
      color: '#D9A84F', // reduced saturation
      accentLight: 'rgba(217, 168, 79, 0.12)',
      atmospheric: 'rgba(217, 168, 79, 0.04)'
    }
  };
  return themes[name] || { Icon: Zap, color: '#9AA1A8', accentLight: 'rgba(154, 161, 168, 0.12)', atmospheric: 'rgba(154, 161, 168, 0.04)' };
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
      keyDriver: "Regulators are getting tougher across content, privacy, and platform practices.",
      pressureDirection: "Rules are becoming stricter, making the environment harder for companies.",
      marketImpact: "Moderate impact, with some industries beginning to feel more pressure.",
      whatThisMeans: "Stricter regulation is creating steady pressure on the market. Big tech companies may face higher costs and slower stock price growth as oversight increases."
    },
    Credit: {
      tldr: "Borrowing is getting more expensive and harder to access, especially for weaker borrowers.",
      status: "Moderate",
      keyDriver: "Lenders are getting more cautious after early signs of stress in riskier debt.",
      pressureDirection: "Credit is tightening, making it tougher for companies and households to refinance or take on new loans.",
      marketImpact: "Moderate impact, with highly indebted companies and lower-quality borrowers feeling it first.",
      whatThisMeans: "Tighter credit conditions can slow growth and increase default risk at the edges of the market. Companies that rely heavily on cheap borrowing may face higher costs and less flexibility."
    },
    Equities: {
      tldr: "Most stock gains are coming from a small group of big companies, not the whole market.",
      status: "Narrow",
      keyDriver: "Investors are crowding into large, well-known names while many smaller and mid-size stocks lag behind.",
      pressureDirection: "Support for the market is narrowing, making it more vulnerable if these leaders stumble.",
      marketImpact: "Moderate impact, with the index looking strong on the surface but more fragile underneath.",
      whatThisMeans: "A narrow group of winners can keep the headline market up, but it also raises concentration risk. If leadership cracks, the pullback can be sharper because fewer areas are holding the market up."
    },
    Global: {
      tldr: "Slower growth in key regions, especially China, is starting to weigh on the global outlook.",
      status: "Softening",
      keyDriver: "Weaker demand from China and softer data in other major economies are cooling trade and production.",
      pressureDirection: "Growth momentum is cooling instead of accelerating.",
      marketImpact: "Moderate impact, with export-driven and commodity-linked areas feeling the slowdown more.",
      whatThisMeans: "A cooling global economy can pressure earnings expectations and risk appetite. If the slowdown deepens, markets may start to price in weaker profits and fewer growth opportunities."
    }
  };
  
  return data[segment.name] || data.Policy;
};

// ============================================================================
// TIER 1: HERO TITLE BLOCK
// ============================================================================
const HeroTitleBlock = ({ segment, theme, scrollY }) => {
  // Subtle parallax (1-2px on scroll)
  const parallaxY = useTransform(scrollY, [0, 200], [0, -2]);
  
  return (
    <motion.div
      className="relative"
      style={{ 
        y: parallaxY,
        marginBottom: `${CASCADE_TOKENS.rhythm.heroToTldr}px`
      }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: MOTION.DURATIONS.cascade, ease: MOTION.CURVES.cascade }}
    >
      {/* Atmospheric Behind-Glow */}
      <div 
        className="absolute -inset-12 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 30%, ${theme.atmospheric} 0%, transparent 70%)`,
          filter: 'blur(40px)'
        }}
      />
      
      {/* Hero Glass Panel */}
      <div
        className="relative overflow-hidden"
        style={{
          padding: '36px 44px',
          background: CASCADE_TOKENS.hero.bg,
          backdropFilter: CASCADE_TOKENS.hero.blur,
          WebkitBackdropFilter: CASCADE_TOKENS.hero.blur,
          borderRadius: CASCADE_TOKENS.hero.radius,
          border: `1px solid ${CASCADE_TOKENS.hero.border}`,
          boxShadow: CASCADE_TOKENS.hero.glow(theme.color)
        }}
      >
        {/* Inner Depth Layer */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.012) 0%, rgba(0,0,0,0.008) 100%)',
            borderRadius: CASCADE_TOKENS.hero.radius
          }}
        />
        
        {/* Top Edge Highlight */}
        <div 
          className="absolute top-0 left-[15%] right-[15%] h-px pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)'
          }}
        />
        
        <h1 
          className="relative"
          style={{
            fontSize: '29px',
            fontWeight: 600,
            color: 'rgba(255,255,255,0.96)',
            letterSpacing: '-0.01em',
            marginBottom: '12px',
            lineHeight: 1.2
          }}
        >
          {segment.name} Analysis
        </h1>
        
        <p 
          className="relative"
          style={{
            fontSize: '16.5px',
            fontWeight: 450,
            color: 'rgba(255,255,255,0.70)',
            lineHeight: 1.5,
            letterSpacing: '0.003em'
          }}
        >
          Market Pressure Lens — What's Driving Street Alignment
        </p>
      </div>
    </motion.div>
  );
};

// ============================================================================
// TIER 2: TL;DR PRIMARY INSIGHT CAPSULE
// ============================================================================
const InsightCapsule = ({ details, theme, weight }) => {
  return (
    <motion.div
      className="flex justify-center"
      style={{ marginBottom: `${CASCADE_TOKENS.rhythm.tldrToModules}px` }}
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.08, duration: MOTION.DURATIONS.slow, ease: MOTION.CURVES.silk }}
    >
      <div
        className="relative flex items-center gap-5 overflow-hidden"
        style={{
          maxWidth: '85%',
          padding: '18px 28px',
          background: CASCADE_TOKENS.capsule.bg,
          backdropFilter: CASCADE_TOKENS.capsule.blur,
          WebkitBackdropFilter: CASCADE_TOKENS.capsule.blur,
          borderRadius: CASCADE_TOKENS.capsule.radius,
          border: `1px solid ${CASCADE_TOKENS.capsule.border}`,
          boxShadow: CASCADE_TOKENS.capsule.glow(theme.color)
        }}
      >
        {/* Subtle Ambient Tint */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 50%, ${theme.accentLight} 0%, transparent 80%)`,
            opacity: 0.35,
            borderRadius: CASCADE_TOKENS.capsule.radius
          }}
        />
        
        {/* TL;DR Tag */}
        <div 
          className="relative flex-shrink-0 px-3 py-1.5 rounded-full"
          style={{
            fontSize: '10px',
            fontWeight: 600,
            color: 'rgba(255,255,255,0.82)',
            background: 'rgba(255,255,255,0.10)',
            border: '1px solid rgba(255,255,255,0.14)',
            letterSpacing: '0.04em'
          }}
        >
          TL;DR
        </div>
        
        {/* Primary Insight Text */}
        <p 
          className="relative flex-1 text-center"
          style={{
            fontSize: '15.5px',
            fontWeight: 450,
            color: 'rgba(255,255,255,0.94)',
            lineHeight: 1.48,
            letterSpacing: '-0.003em'
          }}
        >
          {details.tldr}
        </p>
        
        {/* Pressure Tag + Percentage */}
        <div className="relative flex items-center gap-2.5 flex-shrink-0">
          <div
            className="px-3 py-1.5 rounded-full"
            style={{
              fontSize: '11px',
              fontWeight: 500,
              color: theme.color,
              background: theme.accentLight,
              border: `1px solid ${theme.color}22`
            }}
          >
            {details.status}
          </div>
          
          <span 
            style={{ 
              fontSize: '11px', 
              fontWeight: 500,
              color: 'rgba(255,255,255,0.68)'
            }}
          >
            {Math.round(weight)}%
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// ============================================================================
// TIER 0.5: LIGHTWEIGHT INSIGHT MODULES
// ============================================================================
const InsightModule = ({ icon: Icon, label, content, theme, delay, isLast }) => {
  return (
    <motion.div
      className="relative"
      style={{ 
        paddingBottom: isLast ? 0 : `${CASCADE_TOKENS.rhythm.betweenModules}px`
      }}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: MOTION.DURATIONS.base, ease: MOTION.CURVES.silk }}
    >
      <div className="flex items-start gap-4">
        {/* Icon Container (minimal) */}
        <div 
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: theme.accentLight,
            boxShadow: CASCADE_TOKENS.module.iconGlow(theme.color)
          }}
        >
          <Icon 
            className="w-4.5 h-4.5" 
            style={{ color: theme.color }} 
            strokeWidth={2} 
          />
        </div>
        
        {/* Text Content */}
        <div className="flex-1 pt-0.5">
          <h4 
            style={{
              fontSize: '14px',
              fontWeight: 500,
              color: 'rgba(255,255,255,0.60)',
              marginBottom: '6px',
              letterSpacing: '0.01em'
            }}
          >
            {label}
          </h4>
          
          <p 
            style={{
              fontSize: '15.5px',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.90)',
              lineHeight: 1.52,
              letterSpacing: '-0.003em'
            }}
          >
            {content}
          </p>
        </div>
      </div>
      
      {/* Soft Separator (10-12% opacity) */}
      {!isLast && (
        <div 
          className="absolute bottom-4 left-[52px] right-0 h-px"
          style={{
            background: `linear-gradient(90deg, rgba(255,255,255,${CASCADE_TOKENS.module.separatorOpacity}) 0%, transparent 100%)`
          }}
        />
      )}
    </motion.div>
  );
};

const InsightModulesSection = ({ details, theme }) => {
  const modules = [
    { icon: Target, label: 'Key Driver', content: details.keyDriver },
    { icon: Waves, label: 'Pressure Direction', content: details.pressureDirection },
    { icon: BarChart3, label: 'Market Impact Level', content: details.marketImpact }
  ];
  
  return (
    <motion.div
      className="px-2"
      style={{ marginBottom: `${CASCADE_TOKENS.rhythm.modulesToNarrative}px` }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.15, duration: MOTION.DURATIONS.base }}
    >
      {modules.map((module, idx) => (
        <InsightModule
          key={module.label}
          icon={module.icon}
          label={module.label}
          content={module.content}
          theme={theme}
          delay={0.18 + (idx * 0.06)}
          isLast={idx === modules.length - 1}
        />
      ))}
    </motion.div>
  );
};

// ============================================================================
// TIER 3: NARRATIVE BLOCK (EMOTIONAL CRESCENDO)
// ============================================================================
const NarrativeBlock = ({ details, theme }) => {
  return (
    <motion.div
      className="relative mx-auto"
      style={{ 
        maxWidth: '92%',
        marginBottom: `${CASCADE_TOKENS.rhythm.bottomPadding}px`
      }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.32, duration: MOTION.DURATIONS.slow, ease: MOTION.CURVES.breathe }}
    >
      {/* Narrative Glass Panel */}
      <div
        className="relative overflow-hidden text-center"
        style={{
          padding: '42px 48px',
          background: CASCADE_TOKENS.narrative.bg,
          backdropFilter: CASCADE_TOKENS.narrative.blur,
          WebkitBackdropFilter: CASCADE_TOKENS.narrative.blur,
          borderRadius: CASCADE_TOKENS.narrative.radius,
          border: `1px solid ${CASCADE_TOKENS.narrative.border}`,
          boxShadow: CASCADE_TOKENS.narrative.glow(theme.color)
        }}
      >
        {/* Subtle Ambient Glow */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 40%, ${theme.atmospheric} 0%, transparent 75%)`,
            borderRadius: CASCADE_TOKENS.narrative.radius
          }}
        />
        
        {/* Inner Depth */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.015) 0%, rgba(0,0,0,0.010) 100%)',
            borderRadius: CASCADE_TOKENS.narrative.radius
          }}
        />
        
        {/* Top Edge Highlight */}
        <div 
          className="absolute top-0 left-[18%] right-[18%] h-px pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)'
          }}
        />
        
        {/* Apple-Style Spaced Label */}
        <h3 
          className="relative uppercase"
          style={{
            fontSize: '11.5px',
            fontWeight: 500,
            color: 'rgba(255,255,255,0.58)',
            letterSpacing: '0.12em',
            marginBottom: '20px'
          }}
        >
          What This Means
        </h3>
        
        {/* Narrative Body */}
        <p 
          className="relative"
          style={{
            fontSize: '16.5px',
            fontWeight: 400,
            color: 'rgba(255,255,255,0.92)',
            lineHeight: 1.58,
            letterSpacing: '-0.004em',
            maxWidth: '580px',
            margin: '0 auto'
          }}
        >
          {details.whatThisMeans}
        </p>
      </div>
    </motion.div>
  );
};

// ============================================================================
// SIGNAL CASCADE — COMPLETE DRAWER CONTENT
// ============================================================================
const SignalCascadeContent = ({ segment, scrollY }) => {
  const theme = getTheme(segment.name);
  const details = getSegmentDetails(segment);
  const weight = (segment?.weight || 0) * 100;
  
  if (!details) return null;
  
  return (
    <div 
      className="relative"
      style={{ padding: '36px 52px 0 52px' }}
    >
      {/* Background Atmospheric Layer */}
      <div 
        className="absolute top-0 left-0 right-0 h-[500px] pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 15%, ${theme.atmospheric} 0%, transparent 65%)`,
          filter: 'blur(60px)'
        }}
      />
      
      {/* Cascade Flow */}
      <HeroTitleBlock segment={segment} theme={theme} scrollY={scrollY} />
      <InsightCapsule details={details} theme={theme} weight={weight} />
      <InsightModulesSection details={details} theme={theme} />
      <NarrativeBlock details={details} theme={theme} />
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
            background: 'rgba(0,0,0,0.72)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)'
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
            background: 'linear-gradient(180deg, rgba(12, 14, 20, 0.92) 0%, rgba(8, 10, 16, 0.96) 100%)',
            backdropFilter: 'blur(72px) saturate(180%)',
            WebkitBackdropFilter: 'blur(72px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: `
              0 40px 80px -20px rgba(0, 0, 0, 0.85),
              0 0 60px ${theme.accentLight},
              inset 0 1px 0 rgba(255, 255, 255, 0.08)
            `
          }}
          initial={{ opacity: 0, scale: 0.98, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 12 }}
          transition={{ duration: MOTION.DURATIONS.cascade, ease: MOTION.CURVES.cascade }}
        >
          {/* Top Edge Rim Light */}
          <div 
            className="absolute top-0 left-[12%] right-[12%] h-[1.5px] pointer-events-none z-10"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.20), transparent)',
              filter: 'blur(0.5px)'
            }}
          />
          
          {/* Header Navigation */}
          <motion.div 
            className="relative p-6 flex-shrink-0 z-10"
            style={{ paddingTop: '24px', paddingBottom: '16px' }}
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
                    boxShadow: CASCADE_TOKENS.module.iconGlow(theme.color)
                  }}
                >
                  <Icon className="w-5 h-5" style={{ color: theme.color }} strokeWidth={2} />
                </div>
                <span 
                  style={{ 
                    fontSize: '15px', 
                    fontWeight: 500, 
                    color: 'rgba(255,255,255,0.75)',
                    letterSpacing: '0.01em'
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
                  whileHover={{ background: 'rgba(255,255,255,0.08)', scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  aria-label="Previous Segment"
                >
                  <ChevronLeft className="w-4.5 h-4.5" style={{ color: 'rgba(255,255,255,0.70)' }} strokeWidth={2} />
                </motion.button>
                
                <motion.button
                  onClick={() => onNavigate('next')}
                  className="p-2.5 rounded-xl"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)'
                  }}
                  whileHover={{ background: 'rgba(255,255,255,0.08)', scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  aria-label="Next Segment"
                >
                  <ChevronRight className="w-4.5 h-4.5" style={{ color: 'rgba(255,255,255,0.70)' }} strokeWidth={2} />
                </motion.button>
                
                <motion.button 
                  onClick={onClose} 
                  className="p-2.5 rounded-xl ml-2"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)'
                  }}
                  whileHover={{ background: 'rgba(255,255,255,0.08)', scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  aria-label="Close"
                >
                  <X className="w-4.5 h-4.5" style={{ color: 'rgba(255,255,255,0.70)' }} strokeWidth={2} />
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