// 🔒 DESIGN LOCKED — OS HORIZON TAHOE V5.1 SEGMENT ANALYSIS REFINEMENT
// Last Updated: 2025-01-20
// Policy Drawer: OS HORIZON PATCH V3 — LIQUID GLASS 4.0 + KINETIC V3
// Credit, Equities, Global: Standard format (to be upgraded next)
// See: DESIGN_LOCKED_COMPONENTS.md

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Briefcase, BarChart3, Globe, Zap, Target, TrendingUp, Eye, ChevronLeft, ChevronRight, Sparkles, FileText, Building2, Users, Gavel, DollarSign, TrendingDown, Factory, ArrowUp, ArrowDown, ArrowRight } from 'lucide-react';

// OS Horizon Motion Tokens
const MOTION = {
  CURVES: {
    silk: [0.25, 0.1, 0, 1.0],
    horizonIn: [0.22, 0.61, 0.36, 1],
    horizonOut: [0.4, 0.0, 0.2, 1],
    easeOutQuint: [0.22, 1, 0.36, 1],
    easeOutCubic: [0.33, 1, 0.68, 1]
  },
  DURATIONS: {
    fast: 0.13,
    base: 0.18,
    slow: 0.24,
    drawerOpen: 0.34,
    tldrPop: 0.11
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
    <div className="flex items-center space-x-2.5">
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
        <Icon className="w-4 h-4 relative z-10" style={{ color: iconColor, filter: 'brightness(1.12)' }} strokeWidth={2.5} />
      </motion.div>
      
      <div>
        <h3 className="text-[15px] font-semibold" style={{ color: 'rgba(255,255,255,0.94)', letterSpacing: '-0.012em' }}>
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
              <DirectionIcon className="w-3.5 h-3.5 flex-shrink-0" style={{ color }} strokeWidth={2.5} />
              <span style={{ color: 'rgba(255,255,255,0.88)' }}>{item.detail}</span>
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

// ============================================================================
// POLICY DRAWER CONTENT (OS HORIZON PATCH V3 — LIQUID GLASS 4.0 + KINETIC V3)
// ============================================================================
const PolicyDrawerContent = ({ segment, delay }) => {
  const theme = getTheme(segment.name);
  const weight = (segment?.weight || 0) * 100;

  return (
    <motion.div
      className="relative"
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.12 } } }}
      initial="hidden"
      animate="visible"
    >
      {/* Atmospheric Lightfield (Behind Header) */}
      <div style={{
        position: 'absolute',
        top: '-12%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '720px',
        height: '720px',
        background: 'radial-gradient(ellipse at 50% 50%, rgba(207, 232, 255, 0.026) 0%, transparent 70%)',
        pointerEvents: 'none',
        borderRadius: '50%',
        filter: 'blur(110px)'
      }} />

      {/* Subsurface Warm Light Bloom */}
      <div style={{
        position: 'absolute',
        top: '5%',
        left: '25%',
        right: '25%',
        height: '280px',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(255, 248, 235, 0.032) 0%, transparent 68%)',
        filter: 'blur(70px)',
        pointerEvents: 'none'
      }} />

      {/* Emotional Purpose Header */}
      <motion.div
        variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
        transition={{ delay: delay, duration: 0.24, ease: MOTION.CURVES.easeOutQuint }}
        style={{ marginTop: '33px', marginBottom: '26px' }}
      >
        <h3 
          className="text-[14px] font-medium"
          style={{ 
            color: 'rgba(255,255,255,0.64)',
            letterSpacing: '0.018em',
            lineHeight: '1.5'
          }}
        >
          Policy Pressure Lens — The Forces Shaping Street Alignment
        </h3>
      </motion.div>

      {/* TL;DR Capsule */}
      <motion.div
        variants={{ hidden: { opacity: 0, y: 10, scale: 0.97 }, visible: { opacity: 1, y: 0, scale: 1 } }}
        transition={{ delay: delay + 0.12, duration: MOTION.DURATIONS.tldrPop, ease: MOTION.CURVES.easeOutCubic }}
        style={{ marginBottom: '16px' }}
      >
        <div 
          className="inline-block rounded-full"
          style={{
            background: 'rgba(255,255,255,0.10)',
            border: '1px solid rgba(255,255,255,0.15)',
            padding: '6px 12px',
            fontSize: '12px',
            fontWeight: 600,
            color: 'rgba(255,255,255,0.76)',
            letterSpacing: '0.028em'
          }}
        >
          TL;DR
        </div>
      </motion.div>

      {/* TL;DR Headline (Emotional Summary) */}
      <motion.h4
        variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
        transition={{ delay: delay + 0.21, duration: 0.20, ease: MOTION.CURVES.easeOutQuint }}
        style={{
          fontSize: '18.5px',
          fontWeight: 600,
          color: 'rgba(255,255,255,0.96)',
          letterSpacing: '-0.014em',
          lineHeight: '1.44',
          filter: 'brightness(1.06)',
          marginBottom: '28px',
          maxWidth: '90%'
        }}
      >
        Regulatory hardening raises compliance costs → downside for Big Tech multiples; hawkish Fed bias reinforced.
      </motion.h4>

      {/* Insight Blocks Container */}
      <motion.div
        className="space-y-[18px]"
        variants={{ hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0 } }}
        transition={{ delay: delay + 0.28, duration: 0.18, ease: MOTION.CURVES.easeOutQuint }}
        style={{ marginBottom: '34px' }}
      >
        {/* Key Driver */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0 } }}
          transition={{ delay: delay + 0.33, duration: 0.16 }}
        >
          <div 
            className="text-[12px] font-medium uppercase mb-2.5"
            style={{ 
              color: 'rgba(255,255,255,0.56)',
              letterSpacing: '0.08em'
            }}
          >
            Key Driver
          </div>
          <p 
            className="text-[15px]"
            style={{ 
              color: 'rgba(255,255,255,0.66)',
              lineHeight: '1.60',
              maxWidth: '90%'
            }}
          >
            Regulatory oversight expanding across content, privacy, and platform audits.
          </p>
        </motion.div>

        {/* Pressure Direction */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0 } }}
          transition={{ delay: delay + 0.38, duration: 0.16 }}
        >
          <div 
            className="text-[12px] font-medium uppercase mb-2.5"
            style={{ 
              color: 'rgba(255,255,255,0.56)',
              letterSpacing: '0.08em'
            }}
          >
            Pressure Direction
          </div>
          <p 
            className="text-[15px]"
            style={{ 
              color: 'rgba(255,255,255,0.66)',
              lineHeight: '1.60',
              maxWidth: '90%'
            }}
          >
            Tightening — medium-term environment trending more restrictive.
          </p>
        </motion.div>

        {/* Market Impact Level */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0 } }}
          transition={{ delay: delay + 0.43, duration: 0.16 }}
        >
          <div 
            className="text-[12px] font-medium uppercase mb-2.5"
            style={{ 
              color: 'rgba(255,255,255,0.56)',
              letterSpacing: '0.08em'
            }}
          >
            Market Impact Level
          </div>
          <p 
            className="text-[15px]"
            style={{ 
              color: 'rgba(255,255,255,0.66)',
              lineHeight: '1.60',
              maxWidth: '90%'
            }}
          >
            Moderate impact with pockets of friction emerging in affected sectors.
          </p>
        </motion.div>
      </motion.div>

      {/* What This Means (Enlightenment Moment) */}
      <motion.div
        variants={{ hidden: { opacity: 0, y: 4 }, visible: { opacity: 1, y: 0 } }}
        transition={{ delay: delay + 0.48, duration: 0.18, ease: MOTION.CURVES.easeOutQuint }}
        style={{ 
          marginTop: '34px',
          marginBottom: '38px'
        }}
      >
        <div 
          className="text-[12px] font-medium uppercase mb-3"
          style={{ 
            color: 'rgba(255,255,255,0.58)',
            letterSpacing: '0.08em'
          }}
        >
          What This Means
        </div>
        <p 
          className="text-[15.5px] font-medium"
          style={{ 
            color: 'rgba(255,255,255,0.88)',
            lineHeight: '1.58',
            maxWidth: '90%',
            filter: 'brightness(1.04)'
          }}
        >
          Net effect: Policy tightening is elevating medium-term pressure on Street Alignment, reinforcing upward momentum with growing consistency.
        </p>
      </motion.div>

      {/* Status + Contribution */}
      <motion.div
        variants={{ hidden: { opacity: 0, y: 3 }, visible: { opacity: 1, y: 0 } }}
        transition={{ delay: delay + 0.54, duration: 0.16, ease: MOTION.CURVES.easeOutQuint }}
        style={{ marginTop: '38px' }}
      >
        <div className="flex items-center gap-3.5 mb-6">
          <div
            className="px-3 py-1.5 rounded-lg text-[10px] font-semibold"
            style={{
              background: `${theme.color}09`,
              border: `1px solid ${theme.color}18`,
              color: theme.color,
              boxShadow: `inset 0 1px 0 rgba(255,255,255,0.06)`
            }}
          >
            Rising
          </div>
          <span 
            className="text-[13px] font-medium" 
            style={{ 
              color: 'rgba(255,255,255,0.54)',
              filter: 'brightness(0.94)'
            }}
          >
            Contribution: {Math.round(weight)}%
          </span>
        </div>

        {/* Liquid Radiance 2.0 Contribution Bar */}
        <div className="relative">
          <div 
            className="w-full h-[6px] rounded-full overflow-hidden relative" 
            style={{ 
              background: 'rgba(0,0,0,0.26)',
              transform: 'translateY(1px)'
            }}
          >
            {/* Subsurface glow */}
            <div style={{
              position: 'absolute',
              bottom: '-6px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '106%',
              height: '16px',
              background: `radial-gradient(ellipse, rgba(121, 194, 255, 0.16) 0%, transparent 78%)`,
              filter: 'blur(8px)',
              pointerEvents: 'none'
            }} />
            
            <motion.div
              className="h-full rounded-full relative overflow-hidden group"
              style={{ 
                background: `linear-gradient(90deg, #79C2FF 0%, #4F8EF8 100%)`,
                boxShadow: `
                  0 0 16px rgba(121, 194, 255, 0.40), 
                  inset 0 1px 0.5px rgba(255,255,255,0.24),
                  inset 0 -1px 1.5px rgba(0,30,80,0.20)
                `
              }}
              initial={{ width: '0%' }}
              animate={{ width: `${weight}%` }}
              transition={{ 
                duration: 0.36, 
                delay: delay + 0.60, 
                ease: MOTION.CURVES.easeOutQuint
              }}
              whileHover={{
                filter: 'brightness(1.12)',
                boxShadow: `
                  0 0 20px rgba(121, 194, 255, 0.52), 
                  inset 0 1px 0.5px rgba(255,255,255,0.30),
                  inset 0 -1px 1.5px rgba(0,30,80,0.20)
                `,
                transition: { duration: 0.2 }
              }}
            >
              {/* Micro gloss layer (top edge) */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: '20%',
                right: '20%',
                height: '1.5px',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.48), transparent)',
                filter: 'blur(0.7px)'
              }} />
              
              {/* Directional lighting (north-west) */}
              <div style={{
                position: 'absolute',
                top: '-18%',
                left: '-10%',
                width: '48%',
                height: '140%',
                background: 'radial-gradient(ellipse at 32% 28%, rgba(255,255,255,0.18) 0%, transparent 66%)',
                pointerEvents: 'none'
              }} />

              {/* Value Bubble */}
              <motion.div 
                className="absolute right-[-3px] top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-md"
                style={{
                  background: 'rgba(255,255,255,0.20)',
                  backdropFilter: 'blur(10px)',
                  fontSize: '9.5px',
                  fontWeight: 700,
                  color: '#0D1825',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
                  border: '0.5px solid rgba(255,255,255,0.25)'
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: delay + 0.75, duration: 0.15 }}
              >
                {Math.round(weight)}%
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ============================================================================
// STANDARD DRAWER CONTENT (Credit, Equities, Global - To Be Upgraded)
// ============================================================================
const StandardDrawerContent = ({ segment, delay }) => {
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
      case 'Credit':
        return {
          morning_takeaway: "EM HY spreads decompress rapidly → tightening financial conditions signal M&A slowdown and refinancing stress.",
          drivers: [
            {icon: TrendingUp, text: "Widening high-yield (HY) and emerging market (EM) spreads", bold: "Widening high-yield spreads", weight: "high"},
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
            {icon: TrendingDown, text: "Sector rotation from growth to value accelerating", bold: "Sector rotation accelerating", weight: "medium"},
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
            {icon: DollarSign, text: "Strength of the US Dollar (DXY) pressuring EM", bold: "Strength of the US Dollar", weight: "medium"}
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

  const theme = getTheme(segment.name);
  const details = getSegmentDetails(segment);
  const weight = (segment?.weight || 0) * 100;

  const DriverItem = ({ item, delay }) => {
    const weightConfig = {
      high: { color: '#F26A6A', dot: 'bg-red-500', label: 'HIGH' },
      medium: { color: '#FFB020', dot: 'bg-amber-500', label: 'MED' },
      low: { color: '#2ECF8D', dot: 'bg-green-500', label: 'LOW' }
    };
    
    const config = weightConfig[item.weight];
    
    return (
      <motion.li 
        className="flex items-start p-4 rounded-[16px] border relative" 
        style={{
          background: 'rgba(255,255,255,0.036)',
          backdropFilter: 'blur(22px) saturate(140%)',
          WebkitBackdropFilter: 'blur(22px) saturate(140%)',
          borderColor: 'rgba(255,255,255,0.10)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 3px 10px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(255,255,255,0.04)'
        }}
        variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 }}} 
        transition={{ delay: 0.1 + delay * 0.06, duration: MOTION.DURATIONS.base }}
        whileHover={{ 
          y: -1,
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.11), 0 5px 14px rgba(0,0,0,0.10), 0 0 0 0.5px rgba(255,255,255,0.04)`,
          transition: { duration: 0.15 }
        }}
      >
        {delay > 0 && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: '12%',
            right: '12%',
            height: '1px',
            background: 'rgba(255,255,255,0.045)',
            pointerEvents: 'none'
          }} />
        )}

        <div className="flex items-center gap-2.5 mr-4 mt-0.5 min-w-[46px]">
          <motion.div 
            className={`w-1.5 h-1.5 rounded-full ${config.dot}`}
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.25, 1] }}
            transition={{ delay: 0.14 + delay * 0.06, duration: 0.13 }}
          />
          <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: config.color }}>
            {config.label}
          </span>
        </div>
        <item.icon className="w-4 h-4 mr-2.5 mt-0.5 flex-shrink-0" style={{ color: '#5EA7FF' }} strokeWidth={2} />
        <span className="text-[13px]" style={{ color: 'rgba(255,255,255,0.90)', lineHeight: '1.58', paddingLeft: '4px' }}>
          {item.text}
        </span>
      </motion.li>
    );
  };

  return (
    <motion.div
      className="space-y-4"
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.08 } } }}
      initial="hidden"
      animate="visible"
    >
      <div 
        className="inline-block px-3 py-1.5 rounded-lg text-[10px] font-semibold mb-3.5"
        style={{
          background: 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(255,255,255,0.12)',
          color: 'rgba(255,255,255,0.74)',
          letterSpacing: '0.04em'
        }}
      >
        TL;DR
      </div>

      <p className="text-[13px] mb-4" style={{ color: 'rgba(255,255,255,0.90)', lineHeight: '1.58', maxWidth: '92%' }}>
        <strong style={{ fontWeight: 600, color: 'rgba(255,255,255,0.98)' }}>
          {details.morning_takeaway.split('.')[0]}.
        </strong>
        {details.morning_takeaway.substring(details.morning_takeaway.indexOf('.') + 1)}
      </p>

      <LuxurySection icon={Target} title="Key Drivers" iconColor={theme.color} delay={0.1}>
        <ul className="space-y-2.5">
          {details.drivers.map((driver, i) => (
            <DriverItem key={i} item={driver} delay={i} />
          ))}
        </ul>
      </LuxurySection>

      <LuxurySection icon={Target} title="Impact Overview" iconColor="#C4B5FD" delay={0.2}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-7 rounded-[20px] relative" style={{ 
          background: `linear-gradient(135deg, rgba(255,255,255,0.040) 0%, rgba(255,255,255,0.032) 100%)`,
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          border: '1px solid rgba(255,255,255,0.10)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.09)'
        }}>
          <div className="hidden md:block absolute top-6 bottom-6 left-1/2 w-px" style={{ background: 'rgba(255,255,255,0.10)' }} />

          {Object.entries(details.impact_groups).map(([group, items], i) => (
            <AssetGroupImpact key={group} group={group} items={items} delay={i * 0.06} />
          ))}
        </div>
      </LuxurySection>

      <LuxurySection icon={Eye} title="Sentiment Rationale" iconColor="#FBCFE8" delay={0.3}>
        <div className="p-7 rounded-[20px] space-y-4" style={{
          background: 'rgba(255,255,255,0.038)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          border: '1px solid rgba(255,255,255,0.10)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)'
        }}>
          {details.sentiment_rationale.map((point, i) => {
            const words = point.split(' ');
            const firstFourWords = words.slice(0, 4).join(' ');
            const restOfText = words.slice(4).join(' ');

            return (
              <motion.div
                key={i}
                className="flex items-start"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.38 + i * 0.07, duration: MOTION.DURATIONS.base }}
              >
                <div 
                  className="w-1.5 h-1.5 rounded-full mr-3 mt-1.5 flex-shrink-0"
                  style={{ background: theme.color, boxShadow: `0 0 8px ${theme.color}48` }}
                />
                <span 
                  className="text-[13px] leading-relaxed"
                  style={{ 
                    color: 'rgba(255,255,255,0.90)',
                    lineHeight: '1.68'
                  }}
                >
                  <strong style={{ fontWeight: 600, color: 'rgba(255,255,255,0.98)' }}>
                    {firstFourWords}
                  </strong>
                  {' '}{restOfText}
                </span>
              </motion.div>
            );
          })}
        </div>
      </LuxurySection>
      
      <LuxurySection icon={TrendingUp} title="Forward Outlook" iconColor="#A7F3D0" delay={0.4}>
        <div 
          className="inline-block px-3.5 py-1.5 rounded-lg text-[11px] font-semibold mb-3"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: 'rgba(255,255,255,0.74)',
            letterSpacing: '0.025em'
          }}
        >
          Next 1–3 Months
        </div>

        <div 
          className="h-px mb-4"
          style={{
            background: `linear-gradient(90deg, transparent, ${theme.color}42, transparent)`,
            boxShadow: `0 0 14px ${theme.glowColor}`
          }}
        />
        
        <div className="p-7 rounded-[20px] space-y-4" style={{
          background: 'rgba(255,255,255,0.042)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.11), inset 0 0 26px ${theme.color}05, 0 4px 16px rgba(0,0,0,0.10)`
        }}>
          <p className="text-[14px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.90)', lineHeight: '1.68' }}>
            {details.outlook.line1}
          </p>
          {details.outlook.line2 && (
            <p className="text-[14px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.80)', lineHeight: '1.68' }}>
              {details.outlook.line2}
            </p>
          )}
        </div>
      </LuxurySection>

      <div className="flex items-center gap-3.5 mb-4">
        <div
          className="px-3 py-1.5 rounded-lg text-[10px] font-semibold"
          style={{
            background: `${theme.color}09`,
            border: `1px solid ${theme.color}18`,
            color: theme.color,
            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.06)`
          }}
        >
          {segment.name === 'Credit' ? 'Moderate' : segment.name === 'Equities' ? 'Moderate' : 'Softening'}
        </div>
        <span className="text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.62)' }}>
          Contribution: {Math.round(weight)}%
        </span>
      </div>

      <div className="relative">
        <div 
          className="w-full h-[3px] rounded-full overflow-hidden" 
          style={{ background: 'rgba(0,0,0,0.22)' }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ 
              background: `linear-gradient(90deg, ${theme.color}94, ${theme.color}f4)`,
              boxShadow: `0 0 10px ${theme.color}30, inset 0 1px 0 rgba(255,255,255,0.10)`
            }}
            initial={{ width: '0%' }}
            animate={{ width: `${weight}%` }}
            transition={{ duration: 0.32, ease: MOTION.CURVES.silk }}
          />
        </div>
      </div>
    </motion.div>
  );
};

// ============================================================================
// MAIN DRAWER COMPONENT
// ============================================================================
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
    visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.12 } }
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
          className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden border shadow-2xl"
          style={{
            borderRadius: isPolicyDrawer ? '24px' : '32px',
            background: isPolicyDrawer 
              ? `
                linear-gradient(180deg, 
                  rgba(255, 255, 255, 0.09) 0%,
                  rgba(4, 9, 15, 0.82) 5%,
                  rgba(4, 9, 15, 0.86) 100%
                )
              `
              : `
                linear-gradient(180deg, 
                  rgba(18, 20, 28, 0.90) 0%,
                  rgba(16, 18, 26, 0.94) 100%
                )
              `,
            backdropFilter: isPolicyDrawer ? 'blur(39px) saturate(205%)' : 'blur(62px) saturate(195%)',
            WebkitBackdropFilter: isPolicyDrawer ? 'blur(39px) saturate(205%)' : 'blur(62px) saturate(195%)',
            borderColor: theme.borderColor,
            boxShadow: isPolicyDrawer
              ? `
                0 50px 88px -22px rgba(0, 0, 0, 0.90), 
                0 0 74px ${theme.glowColor}, 
                inset 0 1.5px 0 rgba(255, 255, 255, 0.16),
                inset 0 0 0 0.8px rgba(255,255,255,0.012)
              `
              : `
                0 36px 72px -16px rgba(0, 0, 0, 0.84), 
                0 0 58px ${theme.glowColor}, 
                inset 0 1px 0 rgba(255, 255, 255, 0.13),
                inset 0 0 0 1px rgba(255,255,255,0.04)
              `
          }}
          initial={{ opacity: 0.88, scale: 0.94, y: 26 }}
          animate={{ 
            opacity: 1, 
            scale: isAnimatingIn ? [0.96, 1.015, 1.0] : 1, 
            y: 0 
          }}
          exit={{ opacity: 0, scale: 0.97, y: 18 }}
          transition={{ 
            duration: isPolicyDrawer ? MOTION.DURATIONS.drawerOpen : 0.30, 
            ease: isPolicyDrawer ? MOTION.CURVES.easeOutQuint : MOTION.CURVES.silk,
            scale: isPolicyDrawer ? { times: [0, 0.27, 1], duration: 0.34 } : {}
          }}
        >
          {/* Policy: Edge Bloom (Blue-White Radiance) */}
          {isPolicyDrawer && (
            <div style={{
              position: 'absolute',
              inset: '-1px',
              borderRadius: '24px',
              background: 'radial-gradient(ellipse at 50% 0%, rgba(175, 215, 255, 0.010) 0%, transparent 70%)',
              pointerEvents: 'none'
            }} />
          )}

          {/* Policy: Internal Glow Layer */}
          {isPolicyDrawer && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at 50% 22%, rgba(255, 255, 255, 0.022) 0%, transparent 72%)',
              pointerEvents: 'none',
              borderRadius: '24px'
            }} />
          )}

          {/* Policy: Micro Inner Bevel */}
          {isPolicyDrawer && (
            <div style={{
              position: 'absolute',
              inset: '1px',
              borderRadius: '23px',
              boxShadow: 'inset 0 0 1px rgba(255,255,255,0.09)',
              pointerEvents: 'none'
            }} />
          )}

          {/* Segment-Colored Ambient Glow (Non-Policy) */}
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
              borderRadius: '32px'
            }} />
          )}

          {/* Top Rim Light */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: isPolicyDrawer ? '18%' : '12%',
            right: isPolicyDrawer ? '18%' : '12%',
            height: '1.5px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)',
            filter: 'blur(1.2px)',
            pointerEvents: 'none'
          }} />

          {/* Header */}
          <motion.div 
            className="relative p-6 border-b" 
            style={{ 
              borderColor: 'rgba(255,255,255,0.10)',
              background: isPolicyDrawer ? 'rgba(255, 255, 255, 0.020)' : 'rgba(255, 255, 255, 0.015)'
            }}
            variants={{ hidden: { opacity: 0, y: -10 }, visible: { opacity: 1, y: 0 }}}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <motion.div 
                  className="relative p-3 rounded-[14px] border overflow-hidden"
                  style={{ 
                    background: `${theme.color}16`,
                    borderColor: `${theme.color}34`,
                    backdropFilter: 'blur(14px)',
                    boxShadow: `inset 0 1px 2px rgba(255,255,255,0.12), 0 4px 14px ${theme.glowColor}`
                  }}
                  whileHover={{ scale: 1.04 }}
                  transition={{ duration: MOTION.DURATIONS.fast, ease: MOTION.CURVES.horizonIn }}
                >
                  <Icon className="w-6 h-6 relative z-10" style={{ color: theme.color, filter: 'brightness(1.12)' }} strokeWidth={2} />
                </motion.div>
                <div>
                  <h2 
                    className="font-bold tracking-tight" 
                    style={{ 
                      fontSize: isPolicyDrawer ? '21px' : '20px',
                      color: isPolicyDrawer ? 'rgba(255,255,255,0.94)' : 'rgba(255,255,255,0.98)', 
                      letterSpacing: isPolicyDrawer ? '-0.016em' : '-0.022em'
                    }}
                  >
                    {segment.name} Analysis
                  </h2>
                  <p 
                    className="font-normal" 
                    style={{ 
                      fontSize: isPolicyDrawer ? '14.5px' : '13px',
                      color: isPolicyDrawer ? 'rgba(255,255,255,0.58)' : 'rgba(255,255,255,0.76)', 
                      marginTop: '3px',
                      lineHeight: isPolicyDrawer ? '1.54' : '1.5'
                    }}
                  >
                    Detailed Segment Breakdown
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <motion.button
                  onClick={() => onNavigate('prev')}
                  className="relative p-2.5 rounded-[14px] border backdrop-blur-sm"
                  style={{
                    background: 'rgba(255,255,255,0.042)',
                    borderColor: 'rgba(255,255,255,0.09)',
                    opacity: 0.88
                  }}
                  whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.08)', opacity: 1 }}
                  whileTap={{ scale: 0.96 }}
                  aria-label="Previous Segment"
                >
                  <ChevronLeft className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.74)' }} strokeWidth={2} />
                </motion.button>
                <motion.button
                  onClick={() => onNavigate('next')}
                  className="relative p-2.5 rounded-[14px] border backdrop-blur-sm"
                  style={{
                    background: 'rgba(255,255,255,0.042)',
                    borderColor: 'rgba(255,255,255,0.09)',
                    opacity: 0.88
                  }}
                  whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.08)', opacity: 1 }}
                  whileTap={{ scale: 0.96 }}
                  aria-label="Next Segment"
                >
                  <ChevronRight className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.74)' }} strokeWidth={2} />
                </motion.button>
                <motion.button 
                  onClick={onClose} 
                  className="relative p-2.5 rounded-[14px] border"
                  style={{
                    background: 'rgba(255,255,255,0.042)',
                    borderColor: 'rgba(255,255,255,0.09)',
                    opacity: 0.88
                  }}
                  whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.08)', opacity: 1 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <X className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.74)' }} />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Body */}
          <motion.div 
            key={`${segment.name}-content`}
            className="overflow-y-auto max-h-[calc(90vh-140px)]" 
            variants={containerVariants} 
            initial="hidden" 
            animate="visible"
            style={{ 
              scrollBehavior: 'smooth',
              padding: '32px',
              paddingBottom: isPolicyDrawer ? '60px' : '32px'
            }}
          >
            {isPolicyDrawer ? (
              <PolicyDrawerContent segment={segment} delay={0.05} />
            ) : (
              <StandardDrawerContent segment={segment} delay={0.05} />
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}