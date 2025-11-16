// 🔒 DESIGN LOCKED — OS HORIZON V5.0 POLICY ANALYSIS REFINEMENT
// Last Updated: 2025-01-20
// Full 16-Pillar Compliance: Typography, Spacing, Motion, Luxury
// See: DESIGN_LOCKED_COMPONENTS.md

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Briefcase, BarChart3, Globe, Zap, Target, TrendingUp, Eye, ChevronLeft, ChevronRight, Sparkles, Minus, Plus, FileText, Building2, Users, Gavel, DollarSign, TrendingDown, Factory, ArrowUp, ArrowDown, ArrowRight } from 'lucide-react';

// OS Horizon Motion Tokens (Refined for Silk Transitions)
const MOTION = {
  CURVES: {
    silk: [0.25, 0.1, 0, 1.0],
    horizonIn: [0.22, 0.61, 0.36, 1],
    horizonOut: [0.4, 0.0, 0.2, 1]
  },
  DURATIONS: {
    fast: 0.12,
    base: 0.18,
    slow: 0.24
  }
};

// Directional Icons for Impact
const DirectionIcons = {
  '+': ArrowUp,
  '-': ArrowDown,
  '=': ArrowRight
};

const LuxurySection = ({ icon: Icon, title, children, iconColor = "#4F46E5", delay = 0 }) => (
  <motion.div 
    className="space-y-3"
    variants={{
      hidden: { opacity: 0, y: 12 },
      visible: { opacity: 1, y: 0 }
    }}
    transition={{ 
      delay,
      duration: MOTION.DURATIONS.base,
      ease: MOTION.CURVES.horizonIn
    }}
  >
    <div className="flex items-center space-x-2.5">
      <motion.div 
        className="relative p-2.5 rounded-xl border overflow-hidden"
        style={{ 
          background: `${iconColor}12`,
          borderColor: `${iconColor}30`,
          backdropFilter: 'blur(10px)',
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.08), 0 2px 8px ${iconColor}14`
        }}
        whileHover={{ scale: 1.03 }}
        transition={{ duration: MOTION.DURATIONS.fast, ease: MOTION.CURVES.horizonIn }}
      >
        <Icon className="w-4 h-4 relative z-10" style={{ color: iconColor }} strokeWidth={2.5} />
      </motion.div>
      
      <div>
        <h3 className="text-base font-semibold" style={{ color: 'rgba(255,255,255,0.92)', letterSpacing: '-0.01em' }}>
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
      {/* Group Title */}
      <div className="relative pb-1">
        <h4 className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.88)' }}>
          {group}:
        </h4>
        <div 
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: 'rgba(255,255,255,0.10)' }}
        />
      </div>
      
      {/* Impact Items with Direction Icons */}
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
              <DirectionIcon className="w-3.5 h-3.5 flex-shrink-0" style={{ color }} strokeWidth={2.5} />
              <span style={{ color: 'rgba(255,255,255,0.85)' }}>{item.detail}</span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

const getTheme = (name) => {
  switch (name) {
    case 'Policy': return { Icon: Shield, color: '#5EA7FF', borderColor: 'rgba(94, 167, 255, 0.25)', glowColor: 'rgba(94, 167, 255, 0.30)' };
    case 'Credit': return { Icon: Briefcase, color: '#C084FC', borderColor: 'rgba(192, 132, 252, 0.25)', glowColor: 'rgba(192, 132, 252, 0.30)' };
    case 'Equities': return { Icon: BarChart3, color: '#2ECF8D', borderColor: 'rgba(46, 207, 141, 0.25)', glowColor: 'rgba(46, 207, 141, 0.30)' };
    case 'Global': return { Icon: Globe, color: '#FFB020', borderColor: 'rgba(255, 176, 32, 0.25)', glowColor: 'rgba(255, 176, 32, 0.30)' };
    default: return { Icon: Zap, color: '#AAB1B8', borderColor: 'rgba(170, 177, 184, 0.25)', glowColor: 'rgba(170, 177, 184, 0.30)' };
  }
};

const getSegmentDetails = (segment) => {
  const baseDetails = {
    morning_takeaway: "General market conditions are the primary influence.",
    drivers: [{icon: Target, text: "No specific drivers identified.", weight: "medium"}],
    sentiment_rationale: ["General market conditions are the primary influence."],
    outlook: {
      line1: "Monitor for new catalysts.",
      line2: ""
    },
    impact_groups: {
      Equities: [{ detail: "Mixed", direction: "=" }],
      Rates: [{ detail: "Neutral", direction: "=" }]
    }
  };

  if (!segment) return baseDetails;

  switch (segment.name) {
    case 'Policy':
      return {
        morning_takeaway: "Regulatory hardening raises compliance costs → downside for Big Tech multiples; hawkish Fed bias reinforced.",
        drivers: [
          {icon: Gavel, text: "Intensified regulatory scrutiny on big tech", bold: "Intensified regulatory scrutiny", weight: "high"}, 
          {icon: FileText, text: "Upcoming legislative proposals on AI content", bold: "Upcoming legislative proposals", weight: "medium"},
          {icon: Globe, text: "Geopolitical factors influencing trade policy", bold: "Geopolitical factors", weight: "low"}
        ],
        sentiment_rationale: [
          "Compliance costs rising 40–60% for large-cap tech platforms.",
          "Margins pressured as capex shifts from innovation to compliance.",
          "Hawkish Fed bias reinforced by regulatory tightening."
        ],
        outlook: {
          line1: "Q4 congressional AI hearings likely → stricter oversight → rotation away from high-growth tech.",
          line2: "Monitor committee scheduling and bipartisan support levels."
        },
        impact_groups: {
          Equities: [{ detail: "Tech", direction: "-" }],
          Rates: [{ detail: "Treasuries", direction: "+" }],
          FX: [{ detail: "USD", direction: "+" }],
          Credit: [{ detail: "Neutral", direction: "=" }]
        }
      };
    case 'Credit':
      return {
        morning_takeaway: "EM HY spreads decompress rapidly → tightening financial conditions signal M&A slowdown and refinancing stress.",
        drivers: [
          {icon: TrendingUp, text: "Widening high-yield (HY) and emerging market (EM) spreads", bold: "Widening high-yield (HY) and emerging market (EM) spreads", weight: "high"},
          {icon: Building2, text: "Freezing issuance in primary debt markets", bold: "Freezing issuance", weight: "high"},
          {icon: Users, text: "Tighter underwriting standards from banks", bold: "Tighter underwriting standards", weight: "medium"}
        ],
        sentiment_rationale: [
          "Rising risk aversion driving rapid spread decompression in EM.",
          "Tightening financial conditions stalling M&A and refinancing globally.",
          "Leading indicator for broader credit market stress ahead."
        ],
        outlook: {
          line1: "CDX HY index above 400 bps signals broader risk-off → continued debt issuance freeze through month-end would confirm significant credit cycle turn.",
          line2: ""
        },
        impact_groups: {
          Credit: [{ detail: "Spreads widen", direction: "-" }],
          Equities: [{ detail: "Industrials", direction: "-" }],
          FX: [{ detail: "USD", direction: "+" }],
          Rates: [{ detail: "Treasuries", direction: "+" }]
        }
      };
    case 'Equities':
      return {
        morning_takeaway: "Market breadth deteriorating → fragile concentration in mega-caps signals vulnerability to rotation shocks.",
        drivers: [
          {icon: TrendingDown, text: "Sector rotation from growth to value accelerating", bold: "Sector rotation", weight: "medium"},
          {icon: BarChart3, text: "Narrowing market breadth with fewer stocks participating", bold: "Narrowing market breadth", weight: "high"},
          {icon: FileText, text: "Earnings season surprises and guidance updates", bold: "Earnings season surprises", weight: "medium"}
        ],
        sentiment_rationale: [
          "Market breadth deteriorating with concentration risk in mega-cap stocks.",
          "Fragile and selective market vulnerable to sentiment shocks.",
          "Headline resilience masking underlying structural weaknesses."
        ],
        outlook: {
          line1: "Advance-decline ratio below 1.0 for 5+ consecutive days → mega-cap leadership breakdown could trigger 5-10% broad market correction within 2-3 weeks.",
          line2: ""
        },
        impact_groups: {
          Equities: [
            { detail: "Growth", direction: "-" },
            { detail: "Value", direction: "+" }
          ],
          Rates: [{ detail: "Neutral", direction: "=" }],
          FX: [{ detail: "Mixed", direction: "=" }]
        }
      };
    case 'Global':
      return {
        morning_takeaway: "China demand weakness suppresses commodities → global growth outlook softens as stimulus efforts underperform.",
        drivers: [
          {icon: Factory, text: "Slowing demand from China post-reopening normalization", bold: "Slowing demand from China", weight: "high"},
          {icon: Zap, text: "European energy price volatility creating uncertainty", bold: "European energy price volatility", weight: "medium"},
          {icon: DollarSign, text: "Strength of the US Dollar (DXY) pressuring EM", bold: "Strength of the US Dollar (DXY)", weight: "medium"}
        ],
        sentiment_rationale: [
          "Structural slowdown in China moving beyond cyclical weakness.",
          "Global commodity demand declining as consumer confidence lags.",
          "Multinational earnings at risk from reduced China exposure."
        ],
        outlook: {
          line1: "Chinese PMI below 50 for 3+ months → global trade volume decline accelerates → commodity correction deepens 10-15% through Q2.",
          line2: ""
        },
        impact_groups: {
          Equities: [{ detail: "EM", direction: "-" }],
          Commodities: [{ detail: "Metals/Oil", direction: "-" }],
          FX: [{ detail: "USD", direction: "+" }],
          Rates: [{ detail: "Neutral", direction: "=" }]
        }
      };
    default:
      return baseDetails;
  }
};

const DriverItem = ({ item, delay }) => {
  const weightConfig = {
    high: { color: '#F26A6A', dot: 'bg-red-500', label: 'HIGH' },
    medium: { color: '#FFB020', dot: 'bg-amber-500', label: 'MED' },
    low: { color: '#2ECF8D', dot: 'bg-green-500', label: 'LOW' }
  };
  
  const config = weightConfig[item.weight];
  
  return (
    <motion.li 
      className="flex items-start p-3.5 rounded-xl border relative" 
      style={{
        background: 'rgba(255,255,255,0.032)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        borderColor: 'rgba(255,255,255,0.09)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)'
      }}
      variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 }}} 
      transition={{ delay: 0.1 + delay * 0.06, duration: MOTION.DURATIONS.base }}
      whileHover={{ 
        y: -1,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.09), 0 4px 12px rgba(0,0,0,0.08)`,
        transition: { duration: 0.14 }
      }}
    >
      {/* Faint Separator (between rows) */}
      {delay > 0 && (
        <div style={{
          position: 'absolute',
          top: '-1px',
          left: '10%',
          right: '10%',
          height: '1px',
          background: 'rgba(255,255,255,0.04)',
          pointerEvents: 'none'
        }} />
      )}

      <div className="flex items-center gap-2.5 mr-3.5 mt-0.5">
        <motion.div 
          className={`w-1.5 h-1.5 rounded-full ${config.dot}`}
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ delay: 0.12 + delay * 0.06, duration: 0.12 }}
        />
        <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: config.color, minWidth: '42px' }}>
          {config.label}
        </span>
      </div>
      <item.icon className="w-4 h-4 mr-2.5 mt-0.5 flex-shrink-0" style={{ color: '#5EA7FF' }} strokeWidth={2} />
      <span className="text-sm" style={{ color: 'rgba(255,255,255,0.88)', lineHeight: '1.55', paddingLeft: '2px' }}>
        {item.text}
      </span>
    </motion.li>
  );
};

export default function SegmentDetailDrawer({ isOpen, onClose, segment, onNavigate }) {
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
  const details = getSegmentDetails(segment);
  const { Icon } = theme;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.08 } }
  };

  const backdropVariants = {
    hidden: { opacity: 0, backdropFilter: 'blur(0px)' },
    visible: { opacity: 1, backdropFilter: 'blur(16px)', transition: { duration: 0.32, ease: MOTION.CURVES.silk } }
  };

  const drawerVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 24 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.28, ease: MOTION.CURVES.silk } },
    exit: { opacity: 0, scale: 0.97, y: 16, transition: { duration: 0.22, ease: MOTION.CURVES.horizonOut } }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        variants={backdropVariants}
        initial="hidden" animate="visible" exit="hidden"
        style={{ paddingTop: '80px' }}
      >
        <motion.div 
          className="absolute left-0 right-0 bottom-0" 
          style={{ 
            top: '80px',
            background: 'rgba(0,0,0,0.68)'
          }}
          onClick={onClose} 
        />
        
        <motion.div
          key={segment.name}
          className="relative w-full max-w-4xl max-h-[90vh] rounded-[32px] overflow-hidden border shadow-2xl"
          style={{
            background: `
              linear-gradient(180deg, 
                rgba(18, 20, 28, 0.88) 0%,
                rgba(16, 18, 26, 0.92) 100%
              )
            `,
            backdropFilter: 'blur(56px) saturate(185%)',
            WebkitBackdropFilter: 'blur(56px) saturate(185%)',
            borderColor: theme.borderColor,
            boxShadow: `
              0 32px 64px -14px rgba(0, 0, 0, 0.80), 
              0 0 50px ${theme.glowColor}, 
              inset 0 1px 0 rgba(255, 255, 255, 0.12),
              inset 0 0 0 1px rgba(255,255,255,0.03)
            `
          }}
          variants={drawerVariants} initial="hidden" animate="visible" exit="exit"
        >
          {/* Atmospheric Gradient */}
          <div style={{
            position: 'absolute',
            top: '-10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80%',
            height: '65%',
            background: `radial-gradient(ellipse at 50% 10%, ${theme.color}03 0%, transparent 85%)`,
            pointerEvents: 'none',
            borderRadius: '32px'
          }} />

          {/* Top Rim Light */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '12%',
            right: '12%',
            height: '1.5px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.26), transparent)',
            filter: 'blur(1px)',
            pointerEvents: 'none'
          }} />

          {/* Header (Tighter Spacing, Lighter Nav Pills) */}
          <motion.div 
            className="relative p-6 border-b" 
            style={{ 
              borderColor: 'rgba(255,255,255,0.09)',
              background: 'rgba(255, 255, 255, 0.012)'
            }}
            variants={{ hidden: { opacity: 0, y: -10 }, visible: { opacity: 1, y: 0 }}}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <motion.div 
                  className="relative p-3 rounded-xl border overflow-hidden"
                  style={{ 
                    background: `${theme.color}14`,
                    borderColor: `${theme.color}32`,
                    backdropFilter: 'blur(12px)',
                    boxShadow: `inset 0 1px 2px rgba(255,255,255,0.10), 0 3px 12px ${theme.glowColor}`
                  }}
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: MOTION.DURATIONS.fast, ease: MOTION.CURVES.horizonIn }}
                >
                  <Icon className="w-6 h-6 relative z-10" style={{ color: theme.color, filter: 'brightness(1.10)' }} strokeWidth={2} />
                </motion.div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight" style={{ color: 'rgba(255,255,255,0.98)', letterSpacing: '-0.02em' }}>
                    {segment.name} Analysis
                  </h2>
                  <p className="text-[13px] font-medium" style={{ color: 'rgba(255,255,255,0.74)', marginTop: '2px' }}>
                    Detailed Segment Breakdown
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <motion.button
                  onClick={() => onNavigate('prev')}
                  className="relative p-2.5 rounded-xl border backdrop-blur-sm"
                  style={{
                    background: 'rgba(255,255,255,0.045)',
                    borderColor: 'rgba(255,255,255,0.09)'
                  }}
                  whileHover={{ 
                    scale: 1.04,
                    background: 'rgba(255,255,255,0.08)',
                    transition: { duration: MOTION.DURATIONS.fast }
                  }}
                  whileTap={{ scale: 0.97 }}
                  aria-label="Previous Segment"
                >
                  <ChevronLeft className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.72)' }} strokeWidth={2} />
                </motion.button>
                <motion.button
                  onClick={() => onNavigate('next')}
                  className="relative p-2.5 rounded-xl border backdrop-blur-sm"
                  style={{
                    background: 'rgba(255,255,255,0.045)',
                    borderColor: 'rgba(255,255,255,0.09)'
                  }}
                  whileHover={{ 
                    scale: 1.04,
                    background: 'rgba(255,255,255,0.08)',
                    transition: { duration: MOTION.DURATIONS.fast }
                  }}
                  whileTap={{ scale: 0.97 }}
                  aria-label="Next Segment"
                >
                  <ChevronRight className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.72)' }} strokeWidth={2} />
                </motion.button>
                <motion.button 
                  onClick={onClose} 
                  className="relative p-2.5 rounded-xl border"
                  style={{
                    background: 'rgba(255,255,255,0.045)',
                    borderColor: 'rgba(255,255,255,0.09)'
                  }}
                  whileHover={{ 
                    scale: 1.04,
                    background: 'rgba(255,255,255,0.08)',
                    transition: { duration: MOTION.DURATIONS.fast }
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  <X className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.72)' }} />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Body (Standardized 16px section spacing) */}
          <motion.div 
            key={`${segment.name}-content`}
            className="overflow-y-auto max-h-[calc(90vh-140px)] p-8 space-y-6" 
            variants={containerVariants} 
            initial="hidden" 
            animate="visible"
            style={{ scrollBehavior: 'smooth' }}
          >
            {/* Morning Takeaway (Enhanced TL;DR, Bold First Clause, More Padding) */}
            <LuxurySection icon={Sparkles} title="Morning Takeaway" iconColor="#FBCFE8">
              <motion.div 
                className="p-6 rounded-2xl relative overflow-hidden"
                style={{ 
                  background: 'rgba(255,255,255,0.042)',
                  backdropFilter: 'blur(26px) saturate(140%)',
                  WebkitBackdropFilter: 'blur(26px) saturate(140%)',
                  border: `1px solid rgba(255,255,255,0.10)`,
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.09), 0 3px 14px rgba(0,0,0,0.08)'
                }}
              >
                {/* Top Rim */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: '16%',
                  right: '16%',
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)',
                  pointerEvents: 'none'
                }} />

                <div className="relative z-10">
                  <div className="text-[10px] font-semibold uppercase tracking-wider mb-2.5" style={{ color: 'rgba(255,255,255,0.68)', letterSpacing: '0.08em' }}>
                    TL;DR
                  </div>
                  <p className="text-[15px] font-medium leading-relaxed" style={{ color: 'rgba(255,255,255,0.92)', lineHeight: '1.6', maxWidth: '92%' }}>
                    <strong style={{ fontWeight: 600, color: 'rgba(255,255,255,0.98)' }}>
                      {details.morning_takeaway.split('→')[0]}→
                    </strong>
                    {details.morning_takeaway.substring(details.morning_takeaway.indexOf('→') + 1)}
                  </p>
                </div>
              </motion.div>
            </LuxurySection>

            {/* Key Drivers (Indented text, faint separators, settling pulse) */}
            <LuxurySection icon={Target} title="Key Drivers" iconColor={theme.color}>
              <ul className="space-y-2.5">
                {details.drivers.map((driver, i) => (
                  <DriverItem key={i} item={driver} delay={i} />
                ))}
              </ul>
            </LuxurySection>

            {/* Impact Overview (Reduced spacing, directional icons, vertical separator) */}
            <LuxurySection icon={Target} title="Impact Overview" iconColor="#C4B5FD" delay={0.1}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl relative" style={{ 
                background: 'rgba(255,255,255,0.035)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.09)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.07)'
              }}>
                {/* Vertical Separator (Desktop) */}
                <div className="hidden md:block absolute top-6 bottom-6 left-1/2 w-px" style={{ background: 'rgba(255,255,255,0.08)' }} />

                {Object.entries(details.impact_groups).map(([group, items], i) => (
                  <AssetGroupImpact key={group} group={group} items={items} delay={i * 0.06} />
                ))}
              </div>
            </LuxurySection>

            {/* Sentiment Rationale (Bold first 3-4 words, more line spacing) */}
            <LuxurySection icon={Eye} title="Sentiment Rationale" iconColor="#FBCFE8" delay={0.2}>
              <div className="p-6 rounded-2xl space-y-3.5" style={{
                background: 'rgba(255,255,255,0.035)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.09)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.07)'
              }}>
                {details.sentiment_rationale.map((point, i) => {
                  const words = point.split(' ');
                  const firstThreeWords = words.slice(0, 3).join(' ');
                  const restOfText = words.slice(3).join(' ');

                  return (
                    <motion.div
                      key={i}
                      className="flex items-start"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 + i * 0.06, duration: MOTION.DURATIONS.base }}
                    >
                      <span className="mr-3 mt-0.5" style={{ color: theme.color }}>•</span>
                      <span 
                        className="text-sm leading-relaxed"
                        style={{ 
                          color: 'rgba(255,255,255,0.88)',
                          lineHeight: '1.65'
                        }}
                      >
                        <strong style={{ fontWeight: 600, color: 'rgba(255,255,255,0.98)' }}>
                          {firstThreeWords}
                        </strong>
                        {' '}{restOfText}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </LuxurySection>
            
            {/* Forward Outlook (Info chip, more padding, stronger top glow) */}
            <LuxurySection icon={TrendingUp} title="Forward Outlook" iconColor="#A7F3D0" delay={0.3}>
              {/* Info Chip */}
              <div 
                className="inline-block px-3 py-1.5 rounded-lg text-[11px] font-semibold mb-3"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  color: 'rgba(255,255,255,0.70)',
                  letterSpacing: '0.02em'
                }}
              >
                Next 1–3 Months
              </div>

              {/* Enhanced Top Glow Bar */}
              <div 
                className="h-px mb-4"
                style={{
                  background: `linear-gradient(90deg, transparent, ${theme.color}38, transparent)`,
                  boxShadow: `0 0 12px ${theme.glowColor}`
                }}
              />
              
              <div className="p-6 rounded-2xl space-y-3.5" style={{
                background: 'rgba(255,255,255,0.038)',
                backdropFilter: 'blur(26px)',
                WebkitBackdropFilter: 'blur(26px)',
                border: '1px solid rgba(255,255,255,0.10)',
                boxShadow: `inset 0 1px 0 rgba(255,255,255,0.09), inset 0 0 20px ${theme.color}04`
              }}>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.88)', lineHeight: '1.65' }}>
                  {details.outlook.line1}
                </p>
                {details.outlook.line2 && (
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.78)', lineHeight: '1.65' }}>
                    {details.outlook.line2}
                  </p>
                )}
              </div>
            </LuxurySection>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}