// 🔒 DESIGN LOCKED — OS HORIZON NARRATIVE CANVAS V9.0
// Last Updated: 2025-01-20
// macOS Tahoe Intelligence Layer • Hero-Driven Narrative • Zero Dashboard Energy
// Guided Understanding Flow: What → Why → So What → Outlook
// See: DESIGN_LOCKED_COMPONENTS.md

import React, { useEffect, useMemo, useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { X, Activity, Shield, Briefcase, BarChart3, Globe, Target, Eye, TrendingUp, Gavel, FileText, Users, Building2, DollarSign, Factory, Zap, ArrowUp, ArrowDown, ArrowRight } from 'lucide-react';

// Tahoe Motion DNA
const MOTION = {
  CURVES: {
    liquid: [0.25, 0.1, 0, 1.0],
    silk: [0.22, 0.61, 0.36, 1],
    breathe: [0.33, 0, 0.4, 1]
  },
  DURATIONS: {
    drawer: 0.21,
    hero: 0.24,
    card: 0.19,
    cascade: 0.06
  }
};

const Icons = {
  Policy: Shield,
  Credit: Briefcase,
  Equities: BarChart3,
  Global: Globe
};

const DirectionIcons = { '+': ArrowUp, '-': ArrowDown, '=': ArrowRight };

// Segment Data (15% Reduced Saturation)
const SEGMENTS = {
  Policy: { 
    color: '#5E91D4', 
    tint: 'rgba(94, 145, 212, 0.022)',
    glow: 'rgba(94, 145, 212, 0.26)',
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
    impact: {
      Equities: [{ detail: "Tech sector multiples compress", direction: "-" }],
      Rates: [{ detail: "Treasury demand increases (flight to quality)", direction: "+" }],
      FX: [{ detail: "USD strengthens on risk-off sentiment", direction: "+" }],
      Credit: [{ detail: "Investment-grade spreads neutral", direction: "=" }]
    },
    outlook: "Q4 congressional AI hearings likely → stricter oversight framework → rotation away from high-growth tech toward defensive sectors as compliance uncertainty weighs on forward guidance."
  },
  Credit: { 
    color: '#A278D6', 
    tint: 'rgba(162, 120, 214, 0.022)',
    glow: 'rgba(162, 120, 214, 0.26)',
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
    impact: {
      Credit: [{ detail: "HY spreads widen further", direction: "-" }],
      Equities: [{ detail: "Industrial sector underperforms", direction: "-" }],
      FX: [{ detail: "USD bid strengthens", direction: "+" }],
      Rates: [{ detail: "Flight to quality supports Treasuries", direction: "+" }]
    },
    outlook: "CDX HY index above 400 bps signals broader risk-off environment → continued debt issuance freeze through month-end would confirm significant credit cycle turn requiring defensive portfolio positioning."
  },
  Equities: { 
    color: '#2BB578', 
    tint: 'rgba(43, 181, 120, 0.022)',
    glow: 'rgba(43, 181, 120, 0.26)',
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
    impact: {
      Equities: [
        { detail: "Growth stocks underperform", direction: "-" },
        { detail: "Value/defensive sectors attract flows", direction: "+" }
      ],
      Rates: [{ detail: "Neutral impact on rates", direction: "=" }],
      FX: [{ detail: "Mixed currency effects", direction: "=" }]
    },
    outlook: "Advance-decline ratio below 1.0 for 5+ consecutive days → mega-cap leadership breakdown could trigger 5-10% broad market correction within 2-3 weeks as breadth deterioration accelerates."
  },
  Global: { 
    color: '#D9A851', 
    tint: 'rgba(217, 168, 81, 0.022)',
    glow: 'rgba(217, 168, 81, 0.26)',
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
    impact: {
      Equities: [{ detail: "Emerging markets underperform", direction: "-" }],
      Commodities: [{ detail: "Metals and oil weaken", direction: "-" }],
      FX: [{ detail: "USD strength continues", direction: "+" }],
      Rates: [{ detail: "Neutral Treasury impact", direction: "=" }]
    },
    outlook: "Chinese PMI below 50 for 3+ months → global trade volume decline accelerates → commodity correction deepens 10-15% through Q2 as demand destruction spreads to industrial metals and energy."
  }
};

// ============================================================================
// TAHOE ALIGNMENT ORB
// ============================================================================
const TahoeOrb = ({ score }) => {
  const [phase, setPhase] = useState(0);
  const [shouldReduce, setShouldReduce] = useState(false);

  const color = score < 40 ? '#E86565' : score < 70 ? '#5E91D4' : '#2BB578';

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldReduce(mq.matches);
    return () => {};
  }, []);

  useEffect(() => {
    if (shouldReduce) return;
    let raf, t = Date.now();
    const loop = () => {
      setPhase((Date.now() - t) / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => raf && cancelAnimationFrame(raf);
  }, [shouldReduce]);

  const pulse = 1 + Math.sin(phase * (2 * Math.PI / 3.6)) * 0.016;
  const luminance = 1 + Math.sin(phase * (2 * Math.PI / 3.6)) * 0.012;

  return (
    <motion.div 
      className="relative flex items-center justify-center mx-auto mb-8"
      style={{ width: '240px', height: '240px' }}
      initial={{ scale: 0.80, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.80, ease: MOTION.CURVES.liquid }}
    >
      <motion.div style={{
        position: 'absolute',
        width: '640px',
        height: '200px',
        top: '-25%',
        left: '50%',
        transform: 'translateX(-50%)',
        borderRadius: '50%',
        background: `radial-gradient(ellipse, ${color}04 0%, transparent 84%)`,
        filter: 'blur(76px)',
        pointerEvents: 'none'
      }} />

      <motion.div style={{
        position: 'absolute',
        width: '360px',
        height: '360px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color}07 0%, transparent 88%)`,
        filter: 'blur(52px)',
        pointerEvents: 'none'
      }}
      animate={{ scale: pulse * 1.24, opacity: 0.026 }}
      transition={{ duration: 3.6, ease: MOTION.CURVES.breathe }} />

      <motion.div style={{
        position: 'absolute',
        width: '235px',
        height: '235px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color}0E 0%, transparent 90%)`,
        filter: 'blur(38px)',
        pointerEvents: 'none'
      }}
      animate={{ scale: pulse * 1.10, opacity: 0.036 }}
      transition={{ duration: 3.6, ease: MOTION.CURVES.breathe }} />

      <div style={{
        position: 'absolute',
        width: '185px',
        height: '10px',
        top: '195px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(0,0,0,0.16)',
        filter: 'blur(9px)',
        pointerEvents: 'none'
      }} />

      <motion.div style={{
        position: 'absolute',
        width: '185px',
        height: '185px',
        borderRadius: '50%',
        background: 'linear-gradient(145deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.05) 100%)',
        backdropFilter: 'blur(44px) saturate(168%)',
        WebkitBackdropFilter: 'blur(44px) saturate(168%)',
        border: '1px solid rgba(255,255,255,0.22)',
        boxShadow: `
          inset 0 3.5px 24px rgba(255,255,255,0.18),
          inset 0 -3.5px 20px rgba(0,0,0,0.28),
          0 0 76px ${color}26,
          0 0 0 1px rgba(255,255,255,0.11)
        `
      }}
      animate={{ scale: pulse, filter: `brightness(${luminance})` }}
      transition={{ duration: 3.6, ease: MOTION.CURVES.breathe }}>
        <motion.div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: `radial-gradient(circle at ${52 + Math.sin(phase * 0.15) * 12}% ${44 + Math.cos(phase * 0.15) * 9}%, ${color}18 0%, transparent 74%)`,
          pointerEvents: 'none'
        }} />

        <div style={{
          position: 'absolute',
          top: '13px',
          left: '13px',
          width: '84px',
          height: '84px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 36% 36%, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.22) 52%, transparent 78%)',
          filter: 'blur(21px)',
          pointerEvents: 'none'
        }} />

        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          boxShadow: 'inset 0 0 2px 1px rgba(255,255,255,0.18)',
          pointerEvents: 'none'
        }} />
      </motion.div>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-[9px] font-medium uppercase tracking-widest mb-4"
          style={{ color: 'rgba(255,255,255,0.76)', letterSpacing: '0.24em' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.42, duration: 0.48 }}
        >
          Alignment
        </motion.span>
        
        <motion.span
          className="text-[64px] mb-3"
          style={{ 
            color,
            textShadow: `0 0 42px ${color}54, 0 5px 20px rgba(0,0,0,0.38), 0 1px 3px rgba(255,255,255,0.22)`,
            filter: 'brightness(1.20) contrast(1.16)',
            letterSpacing: '-0.058em',
            fontWeight: 580
          }}
          initial={{ opacity: 0, scale: 0.78 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.54, duration: 0.64, ease: MOTION.CURVES.liquid }}
        >
          {score}
        </motion.span>
        
        <motion.div
          className="text-[10px] font-medium"
          style={{ color: 'rgba(255,255,255,0.70)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.80, duration: 0.42 }}
        >
          Medium Weight
        </motion.div>
      </div>
    </motion.div>
  );
};

// ============================================================================
// HERO SEGMENT CARD (130-150% Scale, Enhanced Depth)
// ============================================================================
const HeroSegmentCard = ({ segment, weight, onClick, delay, orbColor }) => {
  const [isHovered, setIsHovered] = useState(false);
  const info = SEGMENTS[segment.name] || {};
  const Icon = Icons[segment.name] || Globe;

  return (
    <motion.div
      className="relative cursor-pointer"
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: MOTION.DURATIONS.hero, ease: MOTION.CURVES.liquid }}
    >
      <motion.div
        className="relative overflow-hidden rounded-[24px]"
        style={{
          padding: '32px 28px',
          background: `
            radial-gradient(ellipse at 50% -42%, ${info.tint} 0%, transparent 100%),
            rgba(255, 255, 255, 0.038)
          `,
          backdropFilter: 'blur(38px) saturate(152%)',
          WebkitBackdropFilter: 'blur(38px) saturate(152%)',
          boxShadow: `
            0 0 0 5px ${info.color}06,
            0 0 32px ${orbColor}08,
            inset 0 2px 0 rgba(255,255,255,0.15),
            inset 0 0 28px rgba(255,255,255,0.014),
            0 10px 28px rgba(0,0,0,0.16),
            0 0 0 0.5px rgba(255,255,255,0.10)
          `
        }}
        animate={{
          scale: isHovered ? 1.015 : 1,
          y: isHovered ? -2 : 0,
          filter: `brightness(${isHovered ? 1.04 : 1})`,
          boxShadow: isHovered
            ? `
              0 0 0 6px ${info.color}10,
              0 0 42px ${orbColor}14,
              inset 0 2px 0 rgba(255,255,255,0.18),
              inset 0 0 32px rgba(255,255,255,0.018),
              0 14px 36px rgba(0,0,0,0.20),
              0 0 0 0.5px rgba(255,255,255,0.10)
            `
            : `
              0 0 0 5px ${info.color}06,
              0 0 32px ${orbColor}08,
              inset 0 2px 0 rgba(255,255,255,0.15),
              inset 0 0 28px rgba(255,255,255,0.014),
              0 10px 28px rgba(0,0,0,0.16),
              0 0 0 0.5px rgba(255,255,255,0.10)
            `
        }}
        transition={{ duration: 0.20, ease: MOTION.CURVES.silk }}
      >
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.024) 0%, rgba(0,0,0,0.020) 100%)',
          borderRadius: '24px',
          pointerEvents: 'none'
        }} />

        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '24px',
          boxShadow: 'inset 0 0 2px 1.5px rgba(255,255,255,0.11)',
          pointerEvents: 'none'
        }} />

        <div className="relative z-10">
          <motion.div 
            className="inline-block px-3 py-1.5 rounded-lg text-[9px] font-semibold uppercase tracking-wider mb-5"
            style={{
              background: `${info.color}16`,
              color: info.color,
              letterSpacing: '0.10em',
              boxShadow: `0 0 14px ${info.color}14, inset 0 1px 0 rgba(255,255,255,0.10)`
            }}
            animate={{ boxShadow: isHovered ? `0 0 20px ${info.color}20, inset 0 1px 0 rgba(255,255,255,0.12)` : `0 0 14px ${info.color}14, inset 0 1px 0 rgba(255,255,255,0.10)` }}
          >
            Primary Market Force Today
          </motion.div>

          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-[16px] flex items-center justify-center relative"
                style={{
                  background: `${info.color}12`,
                  boxShadow: `0 0 0 0.5px ${info.color}18, inset 0 1px 0 rgba(255,255,255,0.10)`
                }}
              >
                <div style={{
                  position: 'absolute',
                  inset: -8,
                  borderRadius: '18px',
                  background: `radial-gradient(circle, ${info.color}18 0%, transparent 78%)`,
                  filter: 'blur(12px)',
                  pointerEvents: 'none'
                }} />
                <Icon className="w-7 h-7 relative z-10" style={{ color: info.color, filter: 'brightness(1.26)' }} strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-[19px] font-bold mb-1" style={{ color: 'rgba(255,255,255,0.98)', letterSpacing: '-0.018em' }}>
                  {segment.name}
                </h3>
                <p className="text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.74)' }}>
                  Driving {Math.round(weight)}% of consensus
                </p>
              </div>
            </div>
            <span className="text-[22px] font-bold" style={{ color: info.color, filter: 'brightness(1.24) contrast(1.12)' }}>
              {Math.round(weight)}%
            </span>
          </div>

          <p className="text-[14px] mb-6" style={{ color: 'rgba(255,255,255,0.92)', lineHeight: '1.58', letterSpacing: '0.001em' }}>
            {segment.note}
          </p>

          <div className="relative">
            <div style={{
              position: 'absolute',
              bottom: '-7px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '115%',
              height: '18px',
              background: `radial-gradient(ellipse, ${info.color}0C 0%, transparent 90%)`,
              filter: 'blur(9px)',
              pointerEvents: 'none'
            }} />
            
            <div className="w-full h-[5px] rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.28)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ 
                  background: `linear-gradient(90deg, ${info.color}A0, ${info.color}FF)`,
                  boxShadow: `0 0 16px ${info.color}40, inset 0 1px 0 rgba(255,255,255,0.18)`
                }}
                initial={{ width: '0%' }}
                animate={{ width: `${weight}%` }}
                transition={{ duration: 0.40, delay: delay + 0.35, ease: MOTION.CURVES.liquid }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ============================================================================
// SECONDARY SEGMENT CARD (85-90% Scale, Staggered)
// ============================================================================
const SecondaryCard = ({ segment, weight, onClick, delay, offset = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const info = SEGMENTS[segment.name] || {};
  const Icon = Icons[segment.name] || Globe;

  return (
    <motion.div
      className="relative cursor-pointer"
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 10 + offset }}
      animate={{ opacity: 1, y: offset }}
      transition={{ delay, duration: MOTION.DURATIONS.card, ease: MOTION.CURVES.liquid }}
      style={{ marginLeft: `${offset * 2}px` }}
    >
      <motion.div
        className="relative overflow-hidden rounded-[18px]"
        style={{
          padding: '22px 20px',
          background: `
            radial-gradient(ellipse at 50% -40%, ${info.tint} 0%, transparent 100%),
            rgba(255, 255, 255, 0.026)
          `,
          backdropFilter: 'blur(34px) saturate(148%)',
          WebkitBackdropFilter: 'blur(34px) saturate(148%)',
          boxShadow: `
            0 0 0 4px ${info.color}04,
            inset 0 1.5px 0 rgba(255,255,255,0.14),
            inset 0 0 24px rgba(255,255,255,0.012),
            0 6px 18px rgba(0,0,0,0.10),
            0 0 0 0.5px rgba(255,255,255,0.09)
          `,
          transform: 'scale(0.88)'
        }}
        animate={{
          scale: isHovered ? 0.90 : 0.88,
          y: isHovered ? -1.5 : 0,
          filter: `brightness(${isHovered ? 1.03 : 1})`,
          boxShadow: isHovered
            ? `
              0 0 0 6px ${info.color}07,
              inset 0 1.5px 0 rgba(255,255,255,0.16),
              inset 0 0 28px rgba(255,255,255,0.016),
              0 8px 24px rgba(0,0,0,0.14),
              0 0 0 0.5px rgba(255,255,255,0.09)
            `
            : `
              0 0 0 4px ${info.color}04,
              inset 0 1.5px 0 rgba(255,255,255,0.14),
              inset 0 0 24px rgba(255,255,255,0.012),
              0 6px 18px rgba(0,0,0,0.10),
              0 0 0 0.5px rgba(255,255,255,0.09)
            `
        }}
        transition={{ duration: 0.19, ease: MOTION.CURVES.silk }}
      >
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.022) 0%, rgba(0,0,0,0.018) 100%)',
          borderRadius: '18px',
          pointerEvents: 'none'
        }} />

        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '18px',
          boxShadow: 'inset 0 0 1px 1px rgba(255,255,255,0.10)',
          pointerEvents: 'none'
        }} />

        <div className="flex items-center justify-between mb-3.5 relative z-10">
          <div className="flex items-center gap-2.5">
            <div 
              className="w-9 h-9 rounded-[13px] flex items-center justify-center relative"
              style={{
                background: `${info.color}10`,
                boxShadow: `0 0 0 0.5px ${info.color}16`
              }}
            >
              <div style={{
                position: 'absolute',
                inset: -6,
                borderRadius: '15px',
                background: `radial-gradient(circle, ${info.color}16 0%, transparent 78%)`,
                filter: 'blur(10px)',
                pointerEvents: 'none'
              }} />
              <Icon className="w-5 h-5 relative z-10" style={{ color: info.color, filter: 'brightness(1.24)' }} strokeWidth={2} />
            </div>
            <span className="text-[13px] font-semibold" style={{ color: 'rgba(255,255,255,0.98)' }}>
              {segment.name}
            </span>
          </div>
          <span className="text-[16px] font-bold" style={{ color: info.color, filter: 'brightness(1.22) contrast(1.10)' }}>
            {Math.round(weight)}%
          </span>
        </div>

        <p className="text-[12px] mb-4 relative z-10" style={{ color: 'rgba(255,255,255,0.88)', lineHeight: '1.50' }}>
          {segment.note}
        </p>

        <div className="relative">
          <div style={{
            position: 'absolute',
            bottom: '-6px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '112%',
            height: '16px',
            background: `radial-gradient(ellipse, ${info.color}0A 0%, transparent 88%)`,
            filter: 'blur(8px)',
            pointerEvents: 'none'
          }} />
          
          <div className="w-full h-[4px] rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.26)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ 
                background: `linear-gradient(90deg, ${info.color}9E, ${info.color}FE)`,
                boxShadow: `0 0 14px ${info.color}38, inset 0 1px 0 rgba(255,255,255,0.16)`
              }}
              initial={{ width: '0%' }}
              animate={{ width: `${weight}%` }}
              transition={{ duration: 0.36, delay: delay + 0.32, ease: MOTION.CURVES.liquid }}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ============================================================================
// NARRATIVE CHAPTER COMPONENTS
// ============================================================================
const ChapterHeader = ({ icon: Icon, title, iconColor }) => (
  <div className="mb-6">
    <div className="flex items-center space-x-2.5 mb-3">
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
      <h3 className="text-[16px] font-semibold" style={{ color: 'rgba(255,255,255,0.96)', letterSpacing: '-0.016em' }}>
        {title}
      </h3>
    </div>
    
    <div style={{
      height: '1px',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)',
      filter: 'blur(0.6px)'
    }} />
  </div>
);

const LiquidGlassChapter = ({ children, delay = 0 }) => (
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
      scale: 1.008,
      y: -1,
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

// ============================================================================
// FLOATING GLASS PILL BAR
// ============================================================================
const FloatingPillBar = ({ segments, activeSegment, onPillClick }) => {
  return (
    <motion.div
      className="absolute bottom-6 left-1/2 z-20"
      style={{
        transform: 'translateX(-50%)',
        padding: '10px 18px',
        background: 'rgba(18, 20, 28, 0.42)',
        backdropFilter: 'blur(68px) saturate(198%)',
        WebkitBackdropFilter: 'blur(68px) saturate(198%)',
        borderRadius: '22px',
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow: '0 10px 28px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.10)'
      }}
      initial={{ y: 32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.4, duration: 0.56, ease: MOTION.CURVES.liquid }}
    >
      <div className="flex items-center gap-3">
        {segments.map((seg) => {
          const info = SEGMENTS[seg.name] || {};
          const isActive = activeSegment === seg.name;

          return (
            <motion.button
              key={seg.name}
              className="px-4 py-2 rounded-full text-[10px] font-semibold relative"
              style={{
                background: isActive ? `${info.color}24` : 'rgba(255,255,255,0.042)',
                color: isActive ? info.color : 'rgba(255,255,255,0.78)',
                opacity: isActive ? 1 : 0.72,
                boxShadow: isActive ? `0 0 22px ${info.color}20, inset 0 1px 0 rgba(255,255,255,0.11)` : 'inset 0 -1px 2px rgba(0,0,0,0.10)'
              }}
              onClick={() => onPillClick(seg.name)}
              animate={{ 
                y: isActive ? -1 : 0,
                filter: `brightness(${isActive ? 1.02 : 1})`
              }}
              whileHover={{ scale: 1.08, opacity: 1, y: -0.5 }}
              whileTap={{ scale: 0.93 }}
              transition={{ duration: 0.17 }}
            >
              {seg.name}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

// ============================================================================
// MAIN DRAWER — TAHOE NARRATIVE CANVAS
// ============================================================================
const SentimentDrawer = ({ isOpen, onClose, score, breakdown, onOpenDetail }) => {
  const [selectedSegment, setSelectedSegment] = useState(null);
  const consensusScore = useMemo(() => (typeof score === 'number' ? score : 0), [score]);
  const segments = useMemo(() => (Array.isArray(breakdown?.segments) ? breakdown.segments : []), [breakdown]);

  const orbColor = consensusScore < 40 ? '#E86565' : consensusScore < 70 ? '#5E91D4' : '#2BB578';

  const sortedSegments = useMemo(() => {
    return [...segments].sort((a, b) => (b.weight || 0) - (a.weight || 0));
  }, [segments]);

  const heroSegment = sortedSegments[0];
  const secondarySegments = sortedSegments.slice(1);

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

  const handleSegmentClick = (seg) => {
    setSelectedSegment(seg.name);
    onOpenDetail?.(seg);
  };

  if (!isOpen) return null;

  const heroInfo = SEGMENTS[heroSegment?.name] || {};

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        style={{ paddingTop: '80px' }}
        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        animate={{ opacity: 1, backdropFilter: 'blur(32px)' }}
        exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        transition={{ duration: 0.40, ease: MOTION.CURVES.liquid }}
      >
        <div
          className="absolute inset-0"
          style={{ background: 'rgba(0,0,0,0.76)' }}
          onClick={onClose}
        />

        <motion.div
          className="relative w-full max-w-4xl rounded-[32px] overflow-hidden flex flex-col"
          style={{
            background: `linear-gradient(180deg, rgba(18, 20, 28, 0.96) 0%, rgba(16, 18, 26, 0.98) 100%)`,
            backdropFilter: 'blur(76px) saturate(228%)',
            WebkitBackdropFilter: 'blur(76px) saturate(228%)',
            boxShadow: `
              0 50px 100px -28px rgba(0, 0, 0, 0.92),
              0 0 76px rgba(142, 187, 255, 0.13),
              inset 0 2.5px 0 rgba(255, 255, 255, 0.17),
              inset 0 0 52px rgba(255,255,255,0.020),
              0 0 0 0.5px rgba(255,255,255,0.08)
            `,
            maxHeight: 'calc(100vh - 100px)',
            height: '90vh'
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
            inset: 0,
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cdefs%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence baseFrequency=\'0.65\' numOctaves=\'2\'/%3E%3C/filter%3E%3C/defs%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
            backgroundSize: '140px 140px',
            opacity: 0.008,
            mixBlendMode: 'soft-light',
            pointerEvents: 'none',
            borderRadius: '32px'
          }} />

          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '32px',
            boxShadow: 'inset 0 0 2.5px 0.5px rgba(255,255,255,0.11)',
            pointerEvents: 'none'
          }} />

          {/* Header */}
          <div 
            className="relative flex-shrink-0" 
            style={{ 
              padding: '22px 30px 18px 30px',
              borderBottom: '1px solid rgba(255,255,255,0.07)'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3.5">
                <div 
                  className="w-11 h-11 rounded-[14px] flex items-center justify-center relative"
                  style={{
                    background: 'rgba(142, 187, 255, 0.13)',
                    boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.16), 0 4px 22px rgba(142, 187, 255, 0.26)'
                  }}
                >
                  <Activity className="w-6 h-6 relative z-10" style={{ color: '#8EBBFF', filter: 'brightness(1.20)' }} strokeWidth={1.6} />
                </div>
                <div>
                  <h2 className="text-[17px] font-bold tracking-tight" style={{ color: 'rgba(255,255,255,0.98)', letterSpacing: '-0.022em' }}>
                    Street Alignment
                  </h2>
                  <p className="text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.80)' }}>
                    Intelligence Narrative
                  </p>
                </div>
              </div>
              <motion.button
                onClick={onClose}
                className="w-9 h-9 rounded-[14px] flex items-center justify-center"
                style={{
                  background: 'rgba(255,255,255,0.13)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.11)'
                }}
                whileHover={{ scale: 1.10, background: 'rgba(255,255,255,0.18)' }}
                whileTap={{ scale: 0.92 }}
                transition={{ duration: 0.16 }}
              >
                <X className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.88)' }} />
              </motion.button>
            </div>
          </div>

          {/* NARRATIVE CANVAS */}
          <div className="flex-1 overflow-y-auto px-12 pt-10 pb-28" style={{ scrollBehavior: 'smooth' }}>
            {/* Alignment Orb */}
            <TahoeOrb score={consensusScore} />
            
            <motion.p
              className="text-[9px] text-center mb-12"
              style={{ color: 'rgba(255,255,255,0.56)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.90, duration: 0.38 }}
            >
              Based on 5 sources • Updated 2m ago
            </motion.p>

            {/* Breathing Space */}
            <div style={{ height: '48px' }} />

            {/* HERO SEGMENT */}
            {heroSegment && (
              <HeroSegmentCard
                segment={heroSegment}
                weight={(heroSegment.weight || 0) * 100}
                onClick={() => handleSegmentClick(heroSegment)}
                delay={1.0}
                orbColor={orbColor}
              />
            )}

            {/* Atmospheric Gap */}
            <div style={{ height: '36px' }} />

            {/* SECONDARY SEGMENTS (Staggered Asymmetry) */}
            <div className="space-y-5">
              {secondarySegments.map((seg, idx) => (
                <SecondaryCard
                  key={seg.name}
                  segment={seg}
                  weight={(seg.weight || 0) * 100}
                  onClick={() => handleSegmentClick(seg)}
                  delay={1.1 + idx * MOTION.DURATIONS.cascade}
                  offset={idx % 2 === 0 ? 0 : 8}
                />
              ))}
            </div>

            {/* Chapter Breathing */}
            <div style={{ height: '52px' }} />

            {/* NARRATIVE CHAPTERS */}
            {selectedSegment && SEGMENTS[selectedSegment] && (
              <>
                {/* Key Drivers */}
                <div className="mb-10">
                  <ChapterHeader icon={Target} title="Key Drivers" iconColor={SEGMENTS[selectedSegment].color} />
                  <LiquidGlassChapter delay={0.12}>
                    <div className="space-y-4 relative z-10">
                      {SEGMENTS[selectedSegment].drivers.map((driver, i) => {
                        const weightConfig = {
                          high: { color: '#E86565', label: 'HIGH' },
                          medium: { color: '#D9A851', label: 'MED' },
                          low: { color: '#2BB578', label: 'LOW' }
                        };
                        const config = weightConfig[driver.weight];

                        return (
                          <motion.div
                            key={i}
                            className="flex items-start p-5 rounded-[16px]"
                            style={{
                              background: 'rgba(255,255,255,0.026)',
                              backdropFilter: 'blur(28px)',
                              WebkitBackdropFilter: 'blur(28px)',
                              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10)'
                            }}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.18 + i * 0.06, duration: 0.18 }}
                          >
                            {i > 0 && (
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
                              <div className="w-1.5 h-1.5 rounded-full" style={{ background: config.color, boxShadow: `0 0 8px ${config.color}42` }} />
                              <span className="text-[9px] font-semibold uppercase" style={{ color: config.color, letterSpacing: '0.08em' }}>
                                {config.label}
                              </span>
                            </div>
                            
                            <driver.icon className="w-4 h-4 mr-3 mt-0.5 flex-shrink-0" style={{ color: SEGMENTS[selectedSegment].color }} strokeWidth={2} />
                            
                            <span className="text-[13px]" style={{ color: 'rgba(255,255,255,0.92)', lineHeight: '1.62' }}>
                              {driver.text}
                            </span>
                          </motion.div>
                        );
                      })}
                    </div>
                  </LiquidGlassChapter>
                </div>

                {/* Cross-Asset Impact */}
                <div className="mb-10">
                  <ChapterHeader icon={Target} title="Cross-Asset Impact" iconColor="#C4B5FD" />
                  <LiquidGlassChapter delay={0.16}>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '60px',
                      background: `linear-gradient(180deg, ${SEGMENTS[selectedSegment].color}03 0%, transparent 100%)`,
                      borderRadius: '20px 20px 0 0',
                      pointerEvents: 'none'
                    }} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                      {Object.entries(SEGMENTS[selectedSegment].impact).map(([group, items], i) => (
                        <React.Fragment key={group}>
                          <motion.div
                            className="space-y-3"
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.22 + i * 0.08, duration: 0.18 }}
                          >
                            <h4 className="text-[13px] font-semibold pb-2" style={{ color: 'rgba(255,255,255,0.92)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                              {group}
                            </h4>
                            
                            <div className="space-y-2 pl-1">
                              {items.map((item, j) => {
                                const color = item.direction === '-' ? '#E86565' : item.direction === '+' ? '#2BB578' : '#AAB1B8';
                                const DirIcon = DirectionIcons[item.direction] || ArrowRight;
                                
                                return (
                                  <div key={j} className="flex items-center gap-2.5 text-sm">
                                    <DirIcon className="w-3.5 h-3.5 flex-shrink-0" style={{ color }} strokeWidth={2.5} />
                                    <span style={{ color: 'rgba(255,255,255,0.90)', lineHeight: '1.58' }}>{item.detail}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </motion.div>
                          {i === 1 && (
                            <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </LiquidGlassChapter>
                </div>

                {/* Sentiment Rationale */}
                <div className="mb-10">
                  <ChapterHeader icon={Eye} title="Sentiment Rationale" iconColor="#FBCFE8" />
                  <LiquidGlassChapter delay={0.20}>
                    <div className="space-y-6 relative z-10">
                      {SEGMENTS[selectedSegment].rationale.map((point, i) => {
                        const words = point.split(' ');
                        const first = words.slice(0, 4).join(' ');
                        const rest = words.slice(4).join(' ');

                        return (
                          <motion.div
                            key={i}
                            className="flex items-start"
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.26 + i * 0.08, duration: 0.18 }}
                          >
                            <div 
                              className="w-1.5 h-1.5 rounded-full mr-3.5 mt-2 flex-shrink-0"
                              style={{ background: SEGMENTS[selectedSegment].color, boxShadow: `0 0 9px ${SEGMENTS[selectedSegment].color}50` }}
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
                  </LiquidGlassChapter>
                </div>

                {/* Forward Outlook */}
                <div>
                  <ChapterHeader icon={TrendingUp} title="Forward Outlook" iconColor="#A7F3D0" />
                  <LiquidGlassChapter delay={0.24}>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '72px',
                      background: `linear-gradient(180deg, ${SEGMENTS[selectedSegment].color}04 0%, transparent 100%)`,
                      borderRadius: '20px 20px 0 0',
                      pointerEvents: 'none'
                    }} />

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
                        className="inline-block px-3.5 py-1.5 rounded-lg text-[10px] font-semibold mb-6"
                        style={{
                          background: `${SEGMENTS[selectedSegment].color}14`,
                          color: SEGMENTS[selectedSegment].color,
                          letterSpacing: '0.04em',
                          boxShadow: `0 0 16px ${SEGMENTS[selectedSegment].color}12, inset 0 1px 0 rgba(255,255,255,0.10)`
                        }}
                      >
                        Next 1–3 Months
                      </div>

                      <p className="text-[14px] leading-relaxed" style={{ 
                        color: 'rgba(255,255,255,0.94)', 
                        lineHeight: '1.72',
                        letterSpacing: '0.002em'
                      }}>
                        {SEGMENTS[selectedSegment].outlook}
                      </p>
                    </div>
                  </LiquidGlassChapter>
                </div>
              </>
            )}
          </div>

          {/* Floating Glass Pill Bar */}
          <FloatingPillBar 
            segments={segments} 
            activeSegment={selectedSegment}
            onPillClick={(name) => {
              setSelectedSegment(name);
              const seg = segments.find(s => s.name === name);
              if (seg) onOpenDetail?.(seg);
            }}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default React.memo(SentimentDrawer);