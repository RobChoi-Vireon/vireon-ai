// 🔒 DESIGN LOCKED — OS HORIZON V2 SEGMENT ANALYSIS FULL REBUILD
// Last Updated: 2025-01-20 | OS Horizon V2 Policy Drawer Complete Upgrade
// Policy Drawer: OS HORIZON V2 — Full Clarity + Depth + Emotional Calm Rebuild
// See: DESIGN_LOCKED_COMPONENTS.md

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Briefcase, BarChart3, Globe, Zap, Target, TrendingUp, Eye, ChevronLeft, ChevronRight, Sparkles, FileText, Building2, Users, Gavel, DollarSign, TrendingDown, Factory, ArrowUp, ArrowDown, ArrowRight, Activity } from 'lucide-react';

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
    drawerOpen: 0.36,
    tldrPop: 0.14,
    stagger: 0.02
  }
};

// Directional Icons for Impact
const DirectionIcons = {
  '+': ArrowUp,
  '-': ArrowDown,
  '=': ArrowRight
};

const getTheme = (name) => {
  switch (name) {
    case 'Policy': return { Icon: Shield, color: '#70A8E8', borderColor: 'rgba(112, 168, 232, 0.25)', glowColor: 'rgba(112, 168, 232, 0.30)', ambient: 'rgba(112, 168, 232, 0.08)' };
    case 'Credit': return { Icon: Briefcase, color: '#B88AED', borderColor: 'rgba(184, 138, 237, 0.25)', glowColor: 'rgba(184, 138, 237, 0.30)', ambient: 'rgba(184, 138, 237, 0.08)' };
    case 'Equities': return { Icon: BarChart3, color: '#32C288', borderColor: 'rgba(50, 194, 136, 0.25)', glowColor: 'rgba(50, 194, 136, 0.30)', ambient: 'rgba(50, 194, 136, 0.08)' };
    case 'Global': return { Icon: Globe, color: '#EDB859', borderColor: 'rgba(255, 176, 32, 0.25)', glowColor: 'rgba(255, 176, 32, 0.30)', ambient: 'rgba(237, 184, 89, 0.08)' };
    default: return { Icon: Zap, color: '#AAB1B8', borderColor: 'rgba(170, 177, 184, 0.25)', glowColor: 'rgba(170, 177, 184, 0.30)', ambient: 'rgba(170, 177, 184, 0.08)' };
  }
};

// ============================================================================
// POLICY DRAWER — OS HORIZON V2 FULL REBUILD
// ============================================================================
const PolicyDrawerContent = ({ segment, delay }) => {
  const theme = getTheme(segment.name);
  const weight = (segment?.weight || 0) * 100;

  const InfoSection = ({ icon: Icon, label, content, delay }) => (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0 } }}
      transition={{ delay, duration: 0.18, ease: MOTION.CURVES.easeOutQuint }}
      className="relative group"
    >
      {/* Hover Glow */}
      <motion.div
        className="absolute inset-0 rounded-[18px]"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${theme.ambient} 0%, transparent 100%)`,
          opacity: 0,
          pointerEvents: 'none'
        }}
        whileHover={{ opacity: 0.005 }}
        transition={{ duration: 0.2 }}
      />

      <div className="flex items-start gap-3 mb-3 relative">
        <div 
          className="w-8 h-8 rounded-[11px] flex items-center justify-center flex-shrink-0"
          style={{
            background: `${theme.color}12`,
            border: `1px solid ${theme.color}24`,
            boxShadow: `inset 0 0.5px 0 rgba(255,255,255,0.08)`
          }}
        >
          <Icon className="w-4 h-4" style={{ color: theme.color, filter: 'brightness(1.12)' }} strokeWidth={2.2} />
        </div>
        <div className="flex-1">
          <h3 
            className="text-[11px] uppercase mb-2.5" 
            style={{ 
              color: 'rgba(255,255,255,0.68)',
              letterSpacing: '0.08em',
              fontWeight: 500
            }}
          >
            {label}
          </h3>
          <p 
            className="text-[14.5px]" 
            style={{ 
              color: 'rgba(255,255,255,0.88)',
              lineHeight: '1.54',
              maxWidth: '650px'
            }}
          >
            {content}
          </p>
        </div>
      </div>
      
      {/* Micro Separator */}
      <div 
        className="h-px mt-6"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.025), transparent)' }}
      />
    </motion.div>
  );

  return (
    <motion.div
      className="relative w-full"
      style={{ 
        minHeight: '85vh',
        padding: '52px 48px 64px 48px'
      }}
      variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0, transition: { staggerChildren: MOTION.DURATIONS.stagger, delayChildren: 0.14 } } }}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.12, ease: MOTION.CURVES.easeOutQuint }}
    >
      {/* Cinematic Hero Lightfield */}
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

      {/* Subtle Reading-Column Gradient */}
      <div style={{
        position: 'absolute',
        zIndex: -1,
        inset: 0,
        background: 'linear-gradient(180deg, rgba(255,255,255,0.028) 0%, transparent 100%)',
        pointerEvents: 'none'
      }} />

      {/* Micro Vignette */}
      <div style={{
        position: 'absolute',
        zIndex: -1,
        inset: 0,
        background: 'radial-gradient(ellipse at 50% 50%, transparent 0%, rgba(0,0,0,0.12) 100%)',
        pointerEvents: 'none'
      }} />

      {/* Hero Header Block - Enhanced */}
      <motion.div
        variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
        transition={{ duration: MOTION.DURATIONS.base, ease: MOTION.CURVES.easeOutQuint }}
        style={{ marginBottom: '48px', paddingBottom: '4px' }}
      >
        <h1 
          style={{
            fontSize: '23px',
            fontWeight: 600,
            color: 'rgba(255,255,255,0.94)',
            letterSpacing: '0.012em',
            marginBottom: '8px'
          }}
        >
          Policy Analysis
        </h1>
        <p 
          style={{
            fontSize: '15.5px',
            fontWeight: 400,
            color: 'rgba(255,255,255,0.68)',
            lineHeight: '1.52',
            letterSpacing: '0.004em'
          }}
        >
          Market Pressure Lens — What's Driving Street Alignment
        </p>
      </motion.div>

      {/* TL;DR Block */}
      <motion.div
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
        style={{ marginBottom: '38px', marginTop: '20px' }}
      >
        <motion.div
          variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: MOTION.DURATIONS.tldrPop, ease: MOTION.CURVES.easeOutCubic }}
          style={{ marginBottom: '24px' }}
        >
          <div 
            className="inline-block rounded-full"
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: 'rgba(255,255,255,0.82)',
              padding: '7px 14px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '24px'
            }}
          >
            TL;DR
          </div>
        </motion.div>

        <motion.h2
          variants={{ hidden: { opacity: 0, y: 7 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.18, ease: MOTION.CURVES.easeOutQuint }}
          style={{
            fontSize: '18.5px',
            fontWeight: 600,
            color: 'rgba(255,255,255,0.90)',
            maxWidth: '680px',
            lineHeight: '1.48',
            letterSpacing: '-0.005em'
          }}
        >
          Regulatory hardening raises compliance costs → downside for Big Tech multiples; hawkish Fed bias reinforced.
        </motion.h2>
      </motion.div>

      {/* Micro-Insight Grid - Rebuilt */}
      <motion.div
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
        style={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: '36px',
          marginTop: '42px',
          marginBottom: '44px'
        }}
      >
        <InfoSection 
          icon={Target} 
          label="Key Driver"
          content="Regulatory oversight expanding across content, privacy, and platform audits."
          delay={0.06}
        />

        <InfoSection 
          icon={Activity} 
          label="Pressure Direction"
          content="Tightening — medium-term environment trending more restrictive."
          delay={0.08}
        />

        <InfoSection 
          icon={BarChart3} 
          label="Market Impact Level"
          content="Moderate impact with pockets of friction emerging in affected sectors."
          delay={0.10}
        />
      </motion.div>

      {/* What This Means — Enlightenment Block */}
      <motion.div
        variants={{ hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0 } }}
        transition={{ duration: MOTION.DURATIONS.tldrPop, ease: MOTION.CURVES.easeOutQuint }}
        style={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          marginTop: '38px',
          marginBottom: '48px'
        }}
      >
        <div 
          style={{
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '0.08em',
            color: 'rgba(255,255,255,0.70)',
            textTransform: 'uppercase',
            marginBottom: '8px'
          }}
        >
          What This Means
        </div>
        <p 
          style={{
            fontSize: '16px',
            fontWeight: 500,
            color: 'rgba(255,255,255,0.90)',
            lineHeight: '1.52',
            maxWidth: '680px',
            letterSpacing: '-0.005em'
          }}
        >
          Net effect: Policy tightening is elevating medium-term pressure on Street Alignment, reinforcing upward momentum with growing consistency.
        </p>
      </motion.div>

      {/* Status + Contribution Bar */}
      <motion.div
        variants={{ hidden: { opacity: 0, y: 3 }, visible: { opacity: 1, y: 0 } }}
        transition={{ duration: 0.16, ease: MOTION.CURVES.easeOutQuint }}
        style={{ marginTop: '32px' }}
      >
        {/* Status Chip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
          <div
            className="inline-block rounded-full"
            style={{
              fontSize: '12px',
              fontWeight: 500,
              color: '#7BB1FF',
              background: 'rgba(80, 140, 255, 0.14)',
              padding: '6px 13px',
              borderRadius: '22px',
              border: '1px solid rgba(80, 140, 255, 0.22)'
            }}
          >
            Rising
          </div>
        </div>

        {/* Contribution Bar with Halo */}
        <div className="relative" style={{ marginBottom: '10px' }}>
          {/* Bar Halo */}
          <div 
            className="absolute inset-0 rounded-[14px]"
            style={{
              background: `radial-gradient(ellipse, ${theme.glowColor} 0%, transparent 70%)`,
              filter: 'blur(16px)',
              opacity: 0.15,
              pointerEvents: 'none'
            }}
          />

          <div 
            className="w-full rounded-full overflow-hidden relative"
            style={{ 
              height: '8px',
              background: 'rgba(255,255,255,0.06)',
              borderRadius: '14px'
            }}
          >
            <motion.div
              className="h-full rounded-full relative"
              style={{ 
                background: 'linear-gradient(90deg, #79C2FF 0%, #4F8EF8 100%)',
                boxShadow: 'inset 0 0 4px rgba(255,255,255,0.28)',
                borderRadius: '14px'
              }}
              initial={{ width: '0%' }}
              animate={{ 
                width: `${weight}%`,
                boxShadow: [
                  'inset 0 0 4px rgba(255,255,255,0.28)',
                  'inset 0 0 6px rgba(255,255,255,0.35), 0 0 14px rgba(121, 194, 255, 0.32)',
                  'inset 0 0 4px rgba(255,255,255,0.28)'
                ]
              }}
              transition={{ 
                width: { duration: 0.38, delay: 0.6, ease: MOTION.CURVES.easeOutQuint },
                boxShadow: { duration: 2.2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }
              }}
            />
          </div>
        </div>

        {/* Contribution Label - Brightened */}
        <div 
          style={{ 
            fontSize: '13px', 
            fontWeight: 500,
            color: 'rgba(255,255,255,0.68)',
            paddingBottom: '8px'
          }}
        >
          Contribution: {Math.round(weight)}%
        </div>
      </motion.div>
    </motion.div>
  );
};

// ============================================================================
// STANDARD DRAWER CONTENT (Credit, Equities, Global)
// ============================================================================
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
        <Icon className="w-4 h-4 relative z-10" style={{ color: iconColor, filter: 'brightness(1.12)' }} strokeWidth={2.5} />
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
              <DirectionIcon className="w-3.5 h-3.5 flex-shrink-0" style={{ color }} strokeWidth={2.5} />
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
        <span className="text-[13px]" style={{ color: 'rgba(255,255,255,0.90)', lineHeight: '1.62', paddingLeft: '4px' }}>
          {item.text}
        </span>
      </motion.li>
    );
  };

  return (
    <motion.div
      className="space-y-4"
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.02, delayChildren: 0.08 } } }}
      initial="hidden"
      animate="visible"
    >
      {/* Subtle Reading-Column Gradient */}
      <div style={{
        position: 'absolute',
        zIndex: -1,
        inset: 0,
        background: 'linear-gradient(180deg, rgba(255,255,255,0.025) 0%, transparent 100%)',
        pointerEvents: 'none'
      }} />

      {/* TL;DR Block */}
      <div style={{ marginTop: '14px', marginBottom: '24px' }}>
        <div 
          className="inline-block px-3 py-1.5 rounded-lg text-[10px] font-semibold mb-4"
          style={{
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: 'rgba(255,255,255,0.78)',
            letterSpacing: '0.04em'
          }}
        >
          TL;DR
        </div>
      </div>

      <p className="text-[13px] mb-6" style={{ color: 'rgba(255,255,255,0.90)', lineHeight: '1.52', maxWidth: '680px' }}>
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
                    lineHeight: '1.72'
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
          <p className="text-[14px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.90)', lineHeight: '1.52', maxWidth: '680px' }}>
            {details.outlook.line1}
          </p>
          {details.outlook.line2 && (
            <p className="text-[14px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.80)', lineHeight: '1.52', maxWidth: '680px' }}>
              {details.outlook.line2}
            </p>
          )}
        </div>
      </LuxurySection>

      {/* Ending Cluster: Status + Contribution */}
      <div style={{ marginTop: '24px' }}>
        <div className="flex items-center gap-3.5 mb-2">
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

        <div className="relative" style={{ marginTop: '8px', marginBottom: '6px' }}>
          <div 
            className="w-full h-[3px] rounded-full overflow-hidden" 
            style={{ background: 'rgba(255,255,255,0.06)' }}
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
          className="relative w-full max-w-4xl max-h-[92vh] overflow-hidden border shadow-2xl"
          style={{
            borderRadius: isPolicyDrawer ? '26px' : '32px',
            background: isPolicyDrawer 
              ? `
                linear-gradient(180deg, 
                  rgba(255, 255, 255, 0.07) 0%,
                  rgba(4, 9, 15, 0.84) 4%,
                  rgba(4, 9, 15, 0.84) 100%
                )
              `
              : `
                linear-gradient(180deg, 
                  rgba(18, 20, 28, 0.90) 0%,
                  rgba(16, 18, 26, 0.94) 100%
                )
              `,
            backdropFilter: isPolicyDrawer ? 'blur(43px) saturate(210%)' : 'blur(62px) saturate(195%)',
            WebkitBackdropFilter: isPolicyDrawer ? 'blur(43px) saturate(210%)' : 'blur(62px) saturate(195%)',
            borderColor: theme.borderColor,
            boxShadow: isPolicyDrawer
              ? `
                0px 5px 58px rgba(0, 0, 0, 0.22),
                0 0 78px ${theme.glowColor}, 
                inset 0 0 0 1px rgba(140, 180, 255, 0.015)
              `
              : `
                0 36px 72px -16px rgba(0, 0, 0, 0.84), 
                0 0 58px ${theme.glowColor}, 
                inset 0 1px 0 rgba(255, 255, 255, 0.13),
                inset 0 0 0 1px rgba(255,255,255,0.04)
              `
          }}
          initial={{ opacity: 0.9, scale: 0.99, y: 12 }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            y: 0 
          }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          transition={{ 
            duration: 0.12, 
            ease: MOTION.CURVES.easeOutQuint
          }}
        >
          {/* Policy: Subsurface Scatter */}
          {isPolicyDrawer && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at 50% 18%, rgba(255, 255, 255, 0.03) 0%, transparent 70%)',
              pointerEvents: 'none',
              borderRadius: '26px'
            }} />
          )}

          {/* Policy: Inner Bevel */}
          {isPolicyDrawer && (
            <div style={{
              position: 'absolute',
              inset: '1px',
              borderRadius: '25px',
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

          {/* Header - Enhanced */}
          <motion.div 
            className="relative p-6 border-b" 
            style={{ 
              borderColor: 'rgba(255,255,255,0.10)',
              background: isPolicyDrawer ? 'rgba(255, 255, 255, 0.024)' : 'rgba(255, 255, 255, 0.015)',
              paddingTop: isPolicyDrawer ? '24px' : '20px',
              paddingBottom: isPolicyDrawer ? '24px' : '20px'
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
                  {/* Icon Halo - OS Horizon Style */}
                  <div style={{
                    position: 'absolute',
                    inset: '-6px',
                    background: `radial-gradient(circle, ${theme.glowColor} 0%, transparent 70%)`,
                    filter: 'blur(8px)',
                    opacity: 0.12,
                    pointerEvents: 'none'
                  }} />

                  <Icon className="w-6 h-6 relative z-10" style={{ color: theme.color, filter: 'brightness(1.15)' }} strokeWidth={2} />
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
                  whileHover={{ 
                    scale: 1.05, 
                    background: 'rgba(255,255,255,0.08)', 
                    opacity: 1,
                    boxShadow: `0 0 12px ${theme.glowColor}`
                  }}
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
                  whileHover={{ 
                    scale: 1.05, 
                    background: 'rgba(255,255,255,0.08)', 
                    opacity: 1,
                    boxShadow: `0 0 12px ${theme.glowColor}`
                  }}
                  whileTap={{ scale: 0.96 }}
                >
                  <X className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.74)' }} />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Body - Smooth Scroll */}
          <motion.div 
            key={`${segment.name}-content`}
            className="overflow-y-auto max-h-[calc(92vh-140px)]" 
            variants={containerVariants} 
            initial="hidden" 
            animate="visible"
            style={{ 
              scrollBehavior: 'smooth',
              padding: isPolicyDrawer ? '0' : '32px 48px',
              paddingLeft: isPolicyDrawer ? '48px' : '48px',
              paddingRight: isPolicyDrawer ? '48px' : '48px',
              paddingBottom: isPolicyDrawer ? '48px' : '48px'
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