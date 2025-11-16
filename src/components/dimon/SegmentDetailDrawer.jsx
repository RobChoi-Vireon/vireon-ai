// 🔒 DESIGN LOCKED — OS HORIZON LIQUID GLASS V8.0 SEGMENT ANALYSIS
// Last Updated: 2025-01-20
// Full Tahoe Compliance • Unified Glass Profile • Cognitive Clarity
// What → Why → Impact → So What → Outlook
// See: DESIGN_LOCKED_COMPONENTS.md

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Briefcase, BarChart3, Globe, Target, Eye, TrendingUp, ChevronLeft, ChevronRight, Sparkles, FileText, Building2, Users, Gavel, DollarSign, Factory, Zap, ArrowUp, ArrowDown, ArrowRight } from 'lucide-react';

// Tahoe Motion DNA
const MOTION = {
  CURVES: {
    liquid: [0.25, 0.1, 0, 1.0],
    silk: [0.22, 0.61, 0.36, 1],
    breathe: [0.33, 0, 0.4, 1]
  },
  DURATIONS: {
    drawer: 0.20,
    card: 0.18,
    cascade: 0.05
  }
};

const DirectionIcons = { '+': ArrowUp, '-': ArrowDown, '=': ArrowRight };

// Unified Glass Card Component (Consistent Profile)
const LiquidGlassCard = ({ children, delay = 0, hoverScale = 1.012 }) => (
  <motion.div
    className="relative rounded-[20px] overflow-hidden"
    style={{
      padding: '24px',
      background: 'rgba(255,255,255,0.036)',
      backdropFilter: 'blur(34px) saturate(148%)',
      WebkitBackdropFilter: 'blur(34px) saturate(148%)',
      boxShadow: `
        0 0 0 4px rgba(142, 187, 255, 0.04),
        inset 0 1.5px 0 rgba(255,255,255,0.14),
        inset 0 0 24px rgba(255,255,255,0.012),
        0 6px 18px rgba(0,0,0,0.10),
        0 0 0 0.5px rgba(255,255,255,0.09)
      `
    }}
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: MOTION.DURATIONS.card, ease: MOTION.CURVES.liquid }}
    whileHover={{ 
      scale: hoverScale,
      y: -1.5,
      boxShadow: `
        0 0 0 6px rgba(142, 187, 255, 0.06),
        inset 0 1.5px 0 rgba(255,255,255,0.16),
        inset 0 0 28px rgba(255,255,255,0.016),
        0 8px 24px rgba(0,0,0,0.14),
        0 0 0 0.5px rgba(255,255,255,0.09)
      `
    }}
  >
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(180deg, rgba(255,255,255,0.022) 0%, rgba(0,0,0,0.018) 100%)',
      borderRadius: '20px',
      pointerEvents: 'none'
    }} />
    
    <div style={{
      position: 'absolute',
      inset: 0,
      borderRadius: '20px',
      boxShadow: 'inset 0 0 1px 1px rgba(255,255,255,0.10)',
      pointerEvents: 'none'
    }} />

    {children}
  </motion.div>
);

const SectionHeader = ({ icon: Icon, title, iconColor, subtitle }) => (
  <div className="mb-5">
    <div className="flex items-center space-x-2.5 mb-2">
      <div 
        className="p-2.5 rounded-[14px] relative"
        style={{ 
          background: `${iconColor}14`,
          boxShadow: `0 0 0 0.5px ${iconColor}18, inset 0 1px 0 rgba(255,255,255,0.10)`
        }}
      >
        <div style={{
          position: 'absolute',
          inset: -5,
          borderRadius: '16px',
          background: `radial-gradient(circle, ${iconColor}18 0%, transparent 76%)`,
          filter: 'blur(9px)',
          pointerEvents: 'none'
        }} />
        <Icon className="w-4 h-4 relative z-10" style={{ color: iconColor, filter: 'brightness(1.16)' }} strokeWidth={2.5} />
      </div>
      <h3 className="text-[15px] font-semibold" style={{ color: 'rgba(255,255,255,0.96)', letterSpacing: '-0.014em' }}>
        {title}
      </h3>
    </div>
    {subtitle && (
      <p className="text-[11px] font-medium pl-11" style={{ color: 'rgba(255,255,255,0.68)' }}>
        {subtitle}
      </p>
    )}
    
    {/* Top-Light Reflection Line */}
    <div style={{
      marginTop: '10px',
      height: '1px',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)',
      filter: 'blur(0.5px)'
    }} />
  </div>
);

const getTheme = (name) => {
  switch (name) {
    case 'Policy': return { Icon: Shield, color: '#5E91D4', glow: 'rgba(94, 145, 212, 0.28)' };
    case 'Credit': return { Icon: Briefcase, color: '#A278D6', glow: 'rgba(162, 120, 214, 0.28)' };
    case 'Equities': return { Icon: BarChart3, color: '#2BB578', glow: 'rgba(43, 181, 120, 0.28)' };
    case 'Global': return { Icon: Globe, color: '#D9A851', glow: 'rgba(217, 168, 81, 0.28)' };
    default: return { Icon: Zap, color: '#AAB1B8', glow: 'rgba(170, 177, 184, 0.28)' };
  }
};

const getSegmentDetails = (segment) => {
  if (!segment) return null;

  switch (segment.name) {
    case 'Policy':
      return {
        takeaway: "Regulatory hardening raises compliance costs → downside for Big Tech multiples; hawkish Fed bias reinforced.",
        drivers: [
          {icon: Gavel, text: "Intensified regulatory scrutiny on big tech platforms across content and privacy domains.", weight: "high"}, 
          {icon: FileText, text: "Upcoming legislative proposals on AI content regulation expected Q1 2025.", weight: "medium"},
          {icon: Globe, text: "Geopolitical factors influencing bilateral trade policy and tariff structures.", weight: "low"}
        ],
        rationale: [
          "Compliance costs rising 40–60% for large-cap tech platforms as audit scope expands.",
          "Margins pressured as capital allocation shifts from innovation to regulatory compliance infrastructure.",
          "Hawkish Fed bias reinforced by tightening regulatory environment and reduced risk appetite."
        ],
        outlook: {
          timeframe: "Next 1–3 Months",
          line1: "Q4 congressional AI hearings likely → stricter oversight framework → rotation away from high-growth tech toward defensive sectors as compliance uncertainty weighs on forward guidance.",
          line2: "Monitor committee scheduling and bipartisan support levels for leading indicators."
        },
        impact: {
          Equities: [{ detail: "Tech sector multiples compress", direction: "-" }],
          Rates: [{ detail: "Treasury demand increases (flight to quality)", direction: "+" }],
          FX: [{ detail: "USD strengthens on risk-off sentiment", direction: "+" }],
          Credit: [{ detail: "Investment-grade spreads neutral", direction: "=" }]
        }
      };
    case 'Credit':
      return {
        takeaway: "EM HY spreads decompress rapidly → tightening financial conditions signal M&A slowdown and refinancing stress.",
        drivers: [
          {icon: TrendingUp, text: "Widening high-yield (HY) and emerging market (EM) credit spreads indicating rising risk premium.", weight: "high"},
          {icon: Building2, text: "Freezing issuance in primary debt markets as underwriting standards tighten sharply.", weight: "high"},
          {icon: Users, text: "Tighter underwriting standards from banks reflecting increased credit risk assessment.", weight: "medium"}
        ],
        rationale: [
          "Rising risk aversion driving rapid spread decompression in emerging market debt instruments.",
          "Tightening financial conditions stalling M&A activity and refinancing windows globally across sectors.",
          "Leading indicator for broader credit market stress ahead as liquidity conditions deteriorate."
        ],
        outlook: {
          timeframe: "Next 1–3 Months",
          line1: "CDX HY index above 400 bps signals broader risk-off environment → continued debt issuance freeze through month-end would confirm significant credit cycle turn requiring defensive portfolio positioning.",
          line2: ""
        },
        impact: {
          Credit: [{ detail: "HY spreads widen further", direction: "-" }],
          Equities: [{ detail: "Industrial sector underperforms", direction: "-" }],
          FX: [{ detail: "USD bid strengthens", direction: "+" }],
          Rates: [{ detail: "Flight to quality supports Treasuries", direction: "+" }]
        }
      };
    case 'Equities':
      return {
        takeaway: "Market breadth deteriorating → fragile concentration in mega-caps signals vulnerability to rotation shocks.",
        drivers: [
          {icon: TrendingDown, text: "Sector rotation from growth to value accelerating as rate expectations shift higher.", weight: "medium"},
          {icon: BarChart3, text: "Narrowing market breadth with fewer stocks participating in rally creating fragility.", weight: "high"},
          {icon: FileText, text: "Earnings season surprises and guidance updates revealing margin pressure themes.", weight: "medium"}
        ],
        rationale: [
          "Market breadth deteriorating with concentration risk building in mega-cap technology stocks.",
          "Fragile and selective market environment vulnerable to sentiment shocks or rotation catalysts.",
          "Headline resilience masking underlying structural weaknesses in small and mid-cap performance."
        ],
        outlook: {
          timeframe: "Next 1–3 Months",
          line1: "Advance-decline ratio below 1.0 for 5+ consecutive days → mega-cap leadership breakdown could trigger 5-10% broad market correction within 2-3 weeks as breadth deterioration accelerates.",
          line2: ""
        },
        impact: {
          Equities: [
            { detail: "Growth stocks underperform", direction: "-" },
            { detail: "Value/defensive sectors attract flows", direction: "+" }
          ],
          Rates: [{ detail: "Neutral impact on rates", direction: "=" }],
          FX: [{ detail: "Mixed currency effects", direction: "=" }]
        }
      };
    case 'Global':
      return {
        takeaway: "China demand weakness suppresses commodities → global growth outlook softens as stimulus efforts underperform.",
        drivers: [
          {icon: Factory, text: "Slowing demand from China post-reopening normalization weighing on global trade volumes.", weight: "high"},
          {icon: Zap, text: "European energy price volatility creating uncertainty for industrial production costs.", weight: "medium"},
          {icon: DollarSign, text: "Strength of the US Dollar (DXY) pressuring emerging market economies and debt servicing.", weight: "medium"}
        ],
        rationale: [
          "Structural slowdown in China moving beyond cyclical weakness as consumer confidence remains subdued.",
          "Global commodity demand declining as household spending lags despite targeted government stimulus.",
          "Multinational earnings at risk from reduced China exposure and weakening export demand environment."
        ],
        outlook: {
          timeframe: "Next 1–3 Months",
          line1: "Chinese PMI below 50 for 3+ months → global trade volume decline accelerates → commodity correction deepens 10-15% through Q2 as demand destruction spreads to industrial metals and energy.",
          line2: ""
        },
        impact: {
          Equities: [{ detail: "Emerging markets underperform", direction: "-" }],
          Commodities: [{ detail: "Metals and oil weaken", direction: "-" }],
          FX: [{ detail: "USD strength continues", direction: "+" }],
          Rates: [{ detail: "Neutral Treasury impact", direction: "=" }]
        }
      };
    default:
      return null;
  }
};

const DriverRow = ({ item, delay, themeColor }) => {
  const weightConfig = {
    high: { color: '#E86565', label: 'HIGH' },
    medium: { color: '#D9A851', label: 'MED' },
    low: { color: '#2BB578', label: 'LOW' }
  };
  
  const config = weightConfig[item.weight];
  
  return (
    <motion.li 
      className="flex items-start p-5 rounded-[16px] relative group" 
      style={{
        background: 'rgba(255,255,255,0.026)',
        backdropFilter: 'blur(28px) saturate(142%)',
        WebkitBackdropFilter: 'blur(28px) saturate(142%)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10), 0 3px 12px rgba(0,0,0,0.06)'
      }}
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.14 + delay * MOTION.DURATIONS.cascade, duration: MOTION.DURATIONS.card }}
      whileHover={{ 
        y: -1,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.12), 0 5px 16px rgba(0,0,0,0.10), 0 0 0 2px ${themeColor}06`
      }}
    >
      {delay > 0 && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: '10%',
          right: '10%',
          height: '1px',
          background: 'rgba(255,255,255,0.06)',
          pointerEvents: 'none'
        }} />
      )}

      <div className="flex items-center gap-2.5 mr-4 mt-0.5 min-w-[52px]">
        <div 
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: config.color, boxShadow: `0 0 8px ${config.color}42` }}
        />
        <span className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: config.color, letterSpacing: '0.08em' }}>
          {config.label}
        </span>
      </div>
      
      <item.icon 
        className="w-4 h-4 mr-3 mt-0.5 flex-shrink-0 transition-all duration-150" 
        style={{ color: themeColor }} 
        strokeWidth={2} 
      />
      
      <span className="text-[13px] relative z-10" style={{ color: 'rgba(255,255,255,0.92)', lineHeight: '1.62', letterSpacing: '0.001em' }}>
        {item.text}
      </span>
    </motion.li>
  );
};

const AssetImpactGroup = ({ group, items, delay, themeColor }) => (
  <motion.div
    className="space-y-3"
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: MOTION.DURATIONS.card }}
  >
    <h4 className="text-[13px] font-semibold pb-2" style={{ color: 'rgba(255,255,255,0.92)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
      {group}
    </h4>
    
    <div className="space-y-2 pl-1">
      {items.map((item, i) => {
        const isNeg = item.direction === '-';
        const isPos = item.direction === '+';
        const color = isNeg ? '#E86565' : isPos ? '#2BB578' : '#AAB1B8';
        const DirIcon = DirectionIcons[item.direction] || ArrowRight;
        
        return (
          <motion.div
            key={i}
            className="flex items-center gap-2.5 text-sm"
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.06 + (i * 0.04), duration: 0.16 }}
          >
            <DirIcon className="w-3.5 h-3.5 flex-shrink-0" style={{ color }} strokeWidth={2.5} />
            <span style={{ color: 'rgba(255,255,255,0.90)', lineHeight: '1.58' }}>{item.detail}</span>
          </motion.div>
        );
      })}
    </div>
  </motion.div>
);

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
  if (!details) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: MOTION.DURATIONS.cascade, delayChildren: 0.12 } }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        style={{ paddingTop: '80px' }}
        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        animate={{ opacity: 1, backdropFilter: 'blur(32px)' }}
        exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        transition={{ duration: 0.38, ease: MOTION.CURVES.liquid }}
      >
        <div 
          className="absolute inset-0" 
          style={{ background: 'rgba(0,0,0,0.76)' }}
          onClick={onClose} 
        />
        
        <motion.div
          className="relative w-full max-w-4xl max-h-[90vh] rounded-[32px] overflow-hidden"
          style={{
            background: `linear-gradient(180deg, rgba(18, 20, 28, 0.96) 0%, rgba(16, 18, 26, 0.98) 100%)`,
            backdropFilter: 'blur(76px) saturate(228%)',
            WebkitBackdropFilter: 'blur(76px) saturate(228%)',
            boxShadow: `
              0 50px 100px -28px rgba(0, 0, 0, 0.92),
              0 0 76px ${theme.glow},
              inset 0 2.5px 0 rgba(255, 255, 255, 0.17),
              inset 0 0 52px rgba(255,255,255,0.020),
              0 0 0 0.5px rgba(255,255,255,0.08)
            `
          }}
          initial={{ opacity: 0, scale: 0.88, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 28 }}
          transition={{ duration: MOTION.DURATIONS.drawer, ease: MOTION.CURVES.liquid }}
        >
          {/* Tahoe Environmental Layers */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '25%',
            background: 'linear-gradient(180deg, rgba(142, 187, 255, 0.030) 0%, transparent 100%)',
            pointerEvents: 'none',
            borderRadius: '32px 32px 0 0'
          }} />

          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(255,255,255,0.072) 0%, transparent 54%, rgba(0,0,0,0.036) 100%)',
            pointerEvents: 'none',
            borderRadius: '32px'
          }} />

          <div style={{
            position: 'absolute',
            top: '-10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '85%',
            height: '70%',
            background: `radial-gradient(ellipse at 50% 22%, ${theme.color}04 0%, transparent 92%)`,
            pointerEvents: 'none'
          }} />

          {/* Header */}
          <div 
            className="relative p-6 border-b" 
            style={{ 
              borderColor: 'rgba(255,255,255,0.08)',
              background: 'rgba(255, 255, 255, 0.018)'
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div 
                  className="p-3 rounded-[14px] relative"
                  style={{ 
                    background: `${theme.color}18`,
                    boxShadow: `0 0 0 0.5px ${theme.color}20, inset 0 1px 2px rgba(255,255,255,0.14), 0 4px 16px ${theme.glow}`
                  }}
                >
                  <theme.Icon className="w-6 h-6 relative z-10" style={{ color: theme.color, filter: 'brightness(1.14)' }} strokeWidth={2} />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight" style={{ color: 'rgba(255,255,255,0.98)', letterSpacing: '-0.024em' }}>
                    {segment.name} Analysis
                  </h2>
                  <p className="text-[13px] font-medium mt-1" style={{ color: 'rgba(255,255,255,0.78)' }}>
                    Detailed Segment Breakdown
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <motion.button
                  onClick={() => onNavigate('prev')}
                  className="p-2.5 rounded-[14px]"
                  style={{
                    background: 'rgba(255,255,255,0.048)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
                    opacity: 0.86
                  }}
                  whileHover={{ scale: 1.06, background: 'rgba(255,255,255,0.09)', opacity: 1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronLeft className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.76)' }} strokeWidth={2} />
                </motion.button>
                <motion.button
                  onClick={() => onNavigate('next')}
                  className="p-2.5 rounded-[14px]"
                  style={{
                    background: 'rgba(255,255,255,0.048)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
                    opacity: 0.86
                  }}
                  whileHover={{ scale: 1.06, background: 'rgba(255,255,255,0.09)', opacity: 1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronRight className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.76)' }} strokeWidth={2} />
                </motion.button>
                <motion.button 
                  onClick={onClose} 
                  className="p-2.5 rounded-[14px]"
                  style={{
                    background: 'rgba(255,255,255,0.048)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
                    opacity: 0.86
                  }}
                  whileHover={{ scale: 1.06, background: 'rgba(255,255,255,0.09)', opacity: 1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.76)' }} />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Body (Standardized 24px + 20-28px Spacing) */}
          <motion.div 
            className="overflow-y-auto max-h-[calc(90vh-140px)] p-10 space-y-7" 
            variants={containerVariants} 
            initial="hidden" 
            animate="visible"
            style={{ scrollBehavior: 'smooth' }}
          >
            {/* 1. MORNING TAKEAWAY (Secondary Reveal, 25% Reduced Height) */}
            <div>
              <SectionHeader icon={Sparkles} title="Morning Takeaway" iconColor="#FBCFE8" subtitle="What's happening?" />
              
              <LiquidGlassCard delay={0.08} hoverScale={1.008}>
                <div className="relative z-10">
                  <div 
                    className="inline-block px-3 py-1.5 rounded-lg text-[9px] font-semibold mb-3.5"
                    style={{
                      background: 'rgba(255,255,255,0.08)',
                      color: 'rgba(255,255,255,0.78)',
                      letterSpacing: '0.06em',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)'
                    }}
                  >
                    TL;DR
                  </div>

                  <p className="text-[14px] font-medium leading-relaxed" style={{ 
                    color: 'rgba(255,255,255,0.96)', 
                    lineHeight: '1.64',
                    letterSpacing: '0.002em'
                  }}>
                    <strong style={{ fontWeight: 600, color: 'rgba(255,255,255,0.98)' }}>
                      {details.takeaway.split('→')[0]}→
                    </strong>
                    {details.takeaway.substring(details.takeaway.indexOf('→') + 1)}
                  </p>
                </div>
              </LiquidGlassCard>
            </div>

            {/* 2. KEY DRIVERS (Glass Rows, Breathing Space) */}
            <div>
              <SectionHeader icon={Target} title="Key Drivers" iconColor={theme.color} subtitle="Why this matters" />
              
              <ul className="space-y-4">
                {details.drivers.map((driver, i) => (
                  <DriverRow key={i} item={driver} delay={i} themeColor={theme.color} />
                ))}
              </ul>
            </div>

            {/* 3. IMPACT OVERVIEW (2-Column, Generous Padding, Gradient Highlight) */}
            <div>
              <SectionHeader icon={Target} title="Impact Overview" iconColor="#C4B5FD" subtitle="Cross-asset implications" />
              
              <LiquidGlassCard delay={0.12}>
                {/* Gradient Highlight Top */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '60px',
                  background: `linear-gradient(180deg, ${theme.color}03 0%, transparent 100%)`,
                  borderRadius: '20px 20px 0 0',
                  pointerEvents: 'none'
                }} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                  {Object.entries(details.impact).map(([group, items], i) => (
                    <React.Fragment key={group}>
                      <AssetImpactGroup group={group} items={items} delay={i * 0.08} themeColor={theme.color} />
                      {i === 1 && (
                        <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </LiquidGlassCard>
            </div>

            {/* 4. SENTIMENT RATIONALE (20% More Spacing, Lighter) */}
            <div>
              <SectionHeader icon={Eye} title="Sentiment Rationale" iconColor="#FBCFE8" subtitle="So what does this mean?" />
              
              <LiquidGlassCard delay={0.16}>
                <div className="space-y-5 relative z-10">
                  {details.rationale.map((point, i) => {
                    const words = point.split(' ');
                    const first = words.slice(0, 4).join(' ');
                    const rest = words.slice(4).join(' ');

                    return (
                      <motion.div
                        key={i}
                        className="flex items-start"
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.22 + i * 0.08, duration: MOTION.DURATIONS.card }}
                      >
                        <div 
                          className="w-1.5 h-1.5 rounded-full mr-3.5 mt-2 flex-shrink-0"
                          style={{ background: theme.color, boxShadow: `0 0 9px ${theme.color}50` }}
                        />
                        <span 
                          className="text-[13px] leading-relaxed"
                          style={{ 
                            color: 'rgba(255,255,255,0.92)',
                            lineHeight: '1.72',
                            letterSpacing: '0.001em'
                          }}
                        >
                          <strong style={{ fontWeight: 600, color: 'rgba(255,255,255,0.98)' }}>
                            {first}
                          </strong>
                          {' '}{rest}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </LiquidGlassCard>
            </div>
            
            {/* 5. FORWARD OUTLOOK (Liquid Glass Futures Panel) */}
            <div>
              <SectionHeader icon={TrendingUp} title="Forward Outlook" iconColor="#A7F3D0" subtitle="What to watch" />
              
              <LiquidGlassCard delay={0.20}>
                {/* Top Glow Accent */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '72px',
                  background: `linear-gradient(180deg, ${theme.color}04 0%, transparent 100%)`,
                  borderRadius: '20px 20px 0 0',
                  pointerEvents: 'none'
                }} />

                {/* Micro Shadow */}
                <div style={{
                  position: 'absolute',
                  top: '1px',
                  left: '20%',
                  right: '20%',
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)',
                  filter: 'blur(1px)',
                  pointerEvents: 'none'
                }} />

                <div className="relative z-10">
                  <div 
                    className="inline-block px-3.5 py-1.5 rounded-lg text-[10px] font-semibold mb-5"
                    style={{
                      background: `${theme.color}14`,
                      color: theme.color,
                      letterSpacing: '0.04em',
                      boxShadow: `0 0 16px ${theme.color}12, inset 0 1px 0 rgba(255,255,255,0.10)`
                    }}
                  >
                    {details.outlook.timeframe}
                  </div>

                  <div className="space-y-4">
                    <p className="text-[14px] leading-relaxed" style={{ 
                      color: 'rgba(255,255,255,0.94)', 
                      lineHeight: '1.72',
                      letterSpacing: '0.002em'
                    }}>
                      {details.outlook.line1}
                    </p>
                    {details.outlook.line2 && (
                      <p className="text-[14px] leading-relaxed" style={{ 
                        color: 'rgba(255,255,255,0.86)', 
                        lineHeight: '1.72',
                        letterSpacing: '0.002em'
                      }}>
                        {details.outlook.line2}
                      </p>
                    )}
                  </div>
                </div>
              </LiquidGlassCard>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}