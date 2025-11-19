// 🔒 DESIGN LOCKED — OS HORIZON V2.5 NARRATIVE ARCHITECTURE
// Last Updated: 2025-01-20 | Vireon OS Horizon Full Certification
// Policy Drawer: Unified Glass Header — Apple-Grade Continuity
// See: DESIGN_LOCKED_COMPONENTS.md

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Briefcase, BarChart3, Globe, Zap, Target, TrendingUp, Eye, ChevronLeft, ChevronRight, FileText, Building2, Users, DollarSign, TrendingDown, Factory, ArrowUp, ArrowDown, ArrowRight, Activity, Waves } from 'lucide-react';

const MOTION = {
  CURVES: {
    silk: [0.25, 0.1, 0.25, 1.0],
    horizonIn: [0.22, 0.61, 0.36, 1],
    easeOutQuint: [0.22, 1, 0.36, 1],
  },
  DURATIONS: {
    fast: 0.13,
    base: 0.18,
    drawerOpen: 0.36,
    tldrPop: 0.09,
    stagger: 0.06
  }
};

const DirectionIcons = { '+': ArrowUp, '-': ArrowDown, '=': ArrowRight };

const getTheme = (name) => {
  switch (name) {
    case 'Policy': return { Icon: Shield, color: '#70A8E8', borderColor: 'rgba(112, 168, 232, 0.25)', glowColor: 'rgba(112, 168, 232, 0.30)', ambient: 'rgba(112, 168, 232, 0.08)' };
    case 'Credit': return { Icon: Briefcase, color: '#B88AED', borderColor: 'rgba(184, 138, 237, 0.25)', glowColor: 'rgba(184, 138, 237, 0.30)', ambient: 'rgba(184, 138, 237, 0.08)' };
    case 'Equities': return { Icon: BarChart3, color: '#32C288', borderColor: 'rgba(50, 194, 136, 0.25)', glowColor: 'rgba(50, 194, 136, 0.30)', ambient: 'rgba(50, 194, 136, 0.08)' };
    case 'Global': return { Icon: Globe, color: '#EDB859', borderColor: 'rgba(255, 176, 32, 0.25)', glowColor: 'rgba(255, 176, 32, 0.30)', ambient: 'rgba(237, 184, 89, 0.08)' };
    default: return { Icon: Zap, color: '#AAB1B8', borderColor: 'rgba(170, 177, 184, 0.25)', glowColor: 'rgba(170, 177, 184, 0.30)', ambient: 'rgba(170, 177, 184, 0.08)' };
  }
};

const InsightPanel = ({ icon: Icon, title, content, delay, iconColor, tintColor }) => (
  <motion.div
    variants={{ hidden: { opacity: 0, y: 4 }, visible: { opacity: 1, y: 0 } }}
    transition={{ delay, duration: 0.06, ease: MOTION.CURVES.silk }}
    className="relative rounded-[23px]"
    style={{
      padding: '32px 30px',
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.054) 0%, rgba(255, 255, 255, 0.034) 100%)',
      backdropFilter: 'blur(20px) saturate(152%)',
      WebkitBackdropFilter: 'blur(20px) saturate(152%)',
      border: '1px solid rgba(255,255,255,0.12)',
      boxShadow: `
        inset 0 1px 2px rgba(255,255,255,0.10),
        inset 0 -2px 4px rgba(0,0,0,0.12),
        0 8px 24px rgba(0,0,0,0.12),
        0 0 18px ${iconColor}08
      `
    }}
  >
    <div style={{
      position: 'absolute',
      top: 0,
      left: '18%',
      right: '18%',
      height: '1px',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)',
      pointerEvents: 'none'
    }} />

    <div style={{
      position: 'absolute',
      inset: 0,
      background: `radial-gradient(ellipse at 50% 30%, ${iconColor}06 0%, transparent 100%)`,
      borderRadius: '23px',
      pointerEvents: 'none'
    }} />

    <div className="flex items-start gap-5 relative">
      <div 
        className="w-10 h-10 rounded-[13px] flex items-center justify-center flex-shrink-0 relative"
        style={{
          background: `${iconColor}14`,
          border: `1px solid ${iconColor}28`,
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.12), 0 0 14px ${iconColor}18`
        }}
      >
        <div style={{
          position: 'absolute',
          inset: '-8px',
          background: `radial-gradient(circle, ${iconColor}06 0%, transparent 70%)`,
          filter: 'blur(12px)',
          pointerEvents: 'none'
        }} />
        <Icon className="w-5 h-5 relative z-10" style={{ color: iconColor, filter: 'brightness(1.18)' }} strokeWidth={2.2} />
      </div>

      <div className="flex-1">
        <h3 
          className="text-[14px] font-medium mb-3 relative" 
          style={{ 
            color: 'rgba(255,255,255,0.72)',
            letterSpacing: '0.025em'
          }}
        >
          {tintColor && (
            <div style={{
              position: 'absolute',
              inset: '-4px -8px',
              background: `linear-gradient(90deg, ${tintColor}03, transparent)`,
              borderRadius: '6px',
              pointerEvents: 'none'
            }} />
          )}
          <span className="relative z-10">{title}</span>
        </h3>
        
        <p 
          className="text-[13px]" 
          style={{ 
            color: 'rgba(255,255,255,0.88)',
            lineHeight: '1.50',
            letterSpacing: '-0.002em'
          }}
        >
          {content}
        </p>
      </div>
    </div>
  </motion.div>
);

const PolicyDrawerContent = ({ segment, delay }) => {
  const theme = getTheme(segment.name);
  const weight = (segment?.weight || 0) * 100;
  const [haloPulse, setHaloPulse] = useState(0.03);

  useEffect(() => {
    const timer = setTimeout(() => setHaloPulse(0), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      className="relative w-full"
      style={{ 
        minHeight: '85vh',
        padding: '32px 48px 64px 48px'
      }}
      variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.02, delayChildren: 0.10 } } }}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.12, ease: MOTION.CURVES.easeOutQuint }}
    >
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

      <div style={{
        position: 'absolute',
        zIndex: -1,
        inset: 0,
        background: 'linear-gradient(180deg, rgba(255,255,255,0.028) 0%, transparent 100%)',
        pointerEvents: 'none'
      }} />

      <div style={{
        position: 'absolute',
        zIndex: -1,
        inset: 0,
        background: 'radial-gradient(ellipse at 50% 50%, transparent 0%, rgba(0,0,0,0.12) 100%)',
        pointerEvents: 'none'
      }} />

      <motion.div
        variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
        transition={{ duration: MOTION.DURATIONS.base, ease: MOTION.CURVES.easeOutQuint }}
        style={{ marginBottom: '28px', paddingBottom: '4px' }}
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

      <motion.div
        variants={{ hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0 } }}
        transition={{ delay: 0.02, duration: 0.09, ease: MOTION.CURVES.silk }}
        className="relative rounded-[26px] mb-12"
        style={{
          marginTop: '24px',
          padding: '30px 32px',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.075) 0%, rgba(255, 255, 255, 0.042) 100%)',
          backdropFilter: 'blur(24px) saturate(165%)',
          WebkitBackdropFilter: 'blur(24px) saturate(165%)',
          border: '1px solid rgba(255,255,255,0.16)',
          boxShadow: `
            inset 0 2px 3px rgba(255,255,255,0.14),
            inset 0 0 28px ${theme.glowColor},
            0 10px 32px rgba(0,0,0,0.18),
            0 0 42px ${theme.glowColor}
          `
        }}
      >
        <div style={{
          position: 'absolute',
          top: 0,
          left: '12%',
          right: '12%',
          height: '1.5px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)',
          filter: 'blur(1px)',
          pointerEvents: 'none'
        }} />

        <motion.div 
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse at 50% 40%, ${theme.ambient} 0%, transparent 100%)`,
            borderRadius: '26px',
            pointerEvents: 'none',
            opacity: 0.68
          }}
          animate={{
            opacity: [0.68 + haloPulse, 0.68]
          }}
          transition={{
            duration: 0.8,
            ease: 'easeOut'
          }}
        />

        <div className="flex items-center justify-between gap-8 relative">
          <div 
            className="inline-block rounded-full flex-shrink-0"
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: 'rgba(255,255,255,0.84)',
              padding: '7px 14px',
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.18)',
              borderRadius: '24px',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10)'
            }}
          >
            TL;DR
          </div>

          <p 
            className="flex-1 text-center"
            style={{
              fontSize: '16px',
              fontWeight: 600,
              color: 'rgba(255,255,255,0.96)',
              lineHeight: '1.48',
              letterSpacing: '-0.004em'
            }}
          >
            Regulatory hardening raises compliance costs, downside for Big Tech multiples
          </p>

          <div className="flex items-center gap-4 flex-shrink-0">
            <div
              className="inline-block rounded-full"
              style={{
                fontSize: '12px',
                fontWeight: 500,
                color: '#7BB1FF',
                background: 'rgba(80, 140, 255, 0.18)',
                padding: '7px 15px',
                borderRadius: '24px',
                border: '1px solid rgba(80, 140, 255, 0.32)',
                boxShadow: `0 0 16px ${theme.glowColor}, inset 0 1px 0 rgba(255,255,255,0.10)`,
                filter: 'brightness(1.03)'
              }}
            >
              Rising
            </div>

            <div style={{ textAlign: 'right' }}>
              <div 
                style={{ 
                  fontSize: '12px', 
                  fontWeight: 500,
                  color: 'rgba(255,255,255,0.76)',
                  letterSpacing: '0.005em',
                  filter: 'brightness(1.03)'
                }}
              >
                {Math.round(weight)}%
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
        style={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          marginBottom: '40px'
        }}
      >
        <InsightPanel 
          icon={Target} 
          title="Key Driver"
          content="Regulatory oversight expanding across content, privacy, and platform audits"
          delay={0.06}
          iconColor={theme.color}
          tintColor="#6FB5FF"
        />

        <InsightPanel 
          icon={Waves} 
          title="Pressure Direction"
          content="Tightening — medium-term environment trending more restrictive"
          delay={0.12}
          iconColor={theme.color}
          tintColor="#7BC8FF"
        />

        <InsightPanel 
          icon={BarChart3} 
          title="Market Impact Level"
          content="Moderate impact with pockets of friction emerging in affected sectors"
          delay={0.18}
          iconColor={theme.color}
          tintColor="#8FD6FF"
        />
      </motion.div>

      <motion.div
        variants={{ hidden: { opacity: 0, y: 4 }, visible: { opacity: 1, y: 0 } }}
        transition={{ delay: 0.24, duration: 0.24, ease: MOTION.CURVES.silk }}
        className="relative rounded-[30px] mx-auto"
        style={{
          maxWidth: '88%',
          padding: '32px 36px',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.069) 0%, rgba(255, 255, 255, 0.039) 100%)',
          backdropFilter: 'blur(22px) saturate(158%)',
          WebkitBackdropFilter: 'blur(22px) saturate(158%)',
          border: '1px solid rgba(255,255,255,0.14)',
          boxShadow: `
            inset 0 2px 2px rgba(255,255,255,0.12),
            inset 0 -2px 4px rgba(0,0,0,0.10),
            inset 0 0 24px rgba(142, 187, 255, 0.06),
            0 12px 36px rgba(0,0,0,0.16),
            0 0 45px rgba(142, 187, 255, 0.08)
          `
        }}
      >
        <div style={{
          position: 'absolute',
          top: 0,
          left: '15%',
          right: '15%',
          height: '1.5px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.24), transparent)',
          filter: 'blur(1.2px)',
          pointerEvents: 'none'
        }} />

        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '320px',
          height: '180px',
          background: 'radial-gradient(ellipse, rgba(142, 187, 255, 0.08) 0%, transparent 68%)',
          filter: 'blur(48px)',
          pointerEvents: 'none'
        }} />

        <div className="relative text-center">
          <h3 
            className="text-[14px] font-medium mb-4 uppercase" 
            style={{ 
              color: 'rgba(255,255,255,0.68)',
              letterSpacing: '0.09em'
            }}
          >
            What This Means
          </h3>
          
          <p 
            className="text-[14px]" 
            style={{ 
              color: 'rgba(255,255,255,0.92)',
              lineHeight: '1.42',
              letterSpacing: '-0.003em',
              maxWidth: '620px',
              margin: '0 auto'
            }}
          >
            Net effect: Policy tightening is elevating medium-term pressure on Street Alignment, reinforcing upward momentum with growing consistency. Expect continued regulatory scrutiny to weigh on tech valuations in the near term.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
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
        <Icon className="w-4 h-4 relative z-10" style={{ color: iconColor, filter: 'brightness(1.12)' }} strokeWidth={2.2} />
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
              <DirectionIcon className="w-3.5 h-3.5 flex-shrink-0" style={{ color }} strokeWidth={2.2} />
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
        <item.icon className="w-4 h-4 mr-2.5 mt-0.5 flex-shrink-0" style={{ color: '#5EA7FF' }} strokeWidth={2.2} />
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
      <div style={{
        position: 'absolute',
        zIndex: -1,
        inset: 0,
        background: 'linear-gradient(180deg, rgba(255,255,255,0.025) 0%, transparent 100%)',
        pointerEvents: 'none'
      }} />

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
          className="relative w-full max-w-4xl max-h-[92vh] overflow-hidden border shadow-2xl flex flex-col"
          style={{
            borderRadius: isPolicyDrawer ? '26px' : '32px',
            background: isPolicyDrawer 
              ? `linear-gradient(180deg, rgba(4, 9, 15, 0.84) 0%, rgba(4, 9, 15, 0.84) 100%)`
              : `linear-gradient(180deg, rgba(18, 20, 28, 0.90) 0%, rgba(16, 18, 26, 0.94) 100%)`,
            backdropFilter: isPolicyDrawer ? 'blur(43px) saturate(210%)' : 'blur(62px) saturate(195%)',
            WebkitBackdropFilter: isPolicyDrawer ? 'blur(43px) saturate(210%)' : 'blur(62px) saturate(195%)',
            borderColor: theme.borderColor,
            boxShadow: isPolicyDrawer
              ? `0px 5px 58px rgba(0, 0, 0, 0.22), 0 0 78px ${theme.glowColor}, inset 0 0 0 1px rgba(140, 180, 255, 0.015)`
              : `0 36px 72px -16px rgba(0, 0, 0, 0.84), 0 0 58px ${theme.glowColor}, inset 0 1px 0 rgba(255, 255, 255, 0.13), inset 0 0 0 1px rgba(255,255,255,0.04)`
          }}
          initial={{ opacity: 0.9, scale: 0.99, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          transition={{ duration: 0.12, ease: MOTION.CURVES.easeOutQuint }}
        >
          {isPolicyDrawer && (
            <>
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(ellipse at 50% 18%, rgba(255, 255, 255, 0.03) 0%, transparent 70%)',
                pointerEvents: 'none',
                borderRadius: '26px',
                zIndex: 1
              }} />
              <div style={{
                position: 'absolute',
                inset: '1px',
                borderRadius: '25px',
                boxShadow: 'inset 0 0 1px rgba(255,255,255,0.09)',
                pointerEvents: 'none',
                zIndex: 1
              }} />
            </>
          )}

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
              borderRadius: '32px',
              zIndex: 1
            }} />
          )}

          <div style={{
            position: 'absolute',
            top: 0,
            left: isPolicyDrawer ? '18%' : '12%',
            right: isPolicyDrawer ? '18%' : '12%',
            height: '1.5px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)',
            filter: 'blur(1.2px)',
            pointerEvents: 'none',
            borderRadius: isPolicyDrawer ? '26px 26px 0 0' : '32px 32px 0 0',
            zIndex: 2
          }} />

          <motion.div 
            className="relative p-6 flex-shrink-0" 
            style={{ 
              background: 'transparent',
              paddingTop: '28px',
              paddingBottom: '20px',
              boxShadow: '0 1px 0 rgba(0,0,0,0.02), inset 0 -1px 0 rgba(255,255,255,0.03)',
              zIndex: 3
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
                  <div style={{
                    position: 'absolute',
                    inset: '-6px',
                    background: `radial-gradient(circle, ${theme.glowColor} 0%, transparent 70%)`,
                    filter: 'blur(8px)',
                    opacity: 0.12,
                    pointerEvents: 'none'
                  }} />
                  <Icon className="w-6 h-6 relative z-10" style={{ color: theme.color, filter: 'brightness(1.15)' }} strokeWidth={2.2} />
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
                  className="relative p-2 rounded-[14px] border backdrop-blur-sm"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    borderColor: 'rgba(255,255,255,0.06)',
                    color: 'rgba(255,255,255,0.68)'
                  }}
                  whileHover={{ 
                    y: -1,
                    background: 'rgba(255,255,255,0.08)', 
                    color: 'rgba(255,255,255,0.88)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    transition: { duration: 0.12 }
                  }}
                  whileTap={{ 
                    scale: 0.97, 
                    y: 0.5,
                    transition: { duration: 0.08 }
                  }}
                  aria-label="Previous Segment"
                >
                  <ChevronLeft className="w-5 h-5" strokeWidth={2.2} />
                </motion.button>
                <motion.button
                  onClick={() => onNavigate('next')}
                  className="relative p-2 rounded-[14px] border backdrop-blur-sm"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    borderColor: 'rgba(255,255,255,0.06)',
                    color: 'rgba(255,255,255,0.68)'
                  }}
                  whileHover={{ 
                    y: -1,
                    background: 'rgba(255,255,255,0.08)', 
                    color: 'rgba(255,255,255,0.88)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    transition: { duration: 0.12 }
                  }}
                  whileTap={{ 
                    scale: 0.97, 
                    y: 0.5,
                    transition: { duration: 0.08 }
                  }}
                  aria-label="Next Segment"
                >
                  <ChevronRight className="w-5 h-5" strokeWidth={2.2} />
                </motion.button>
                <motion.button 
                  onClick={onClose} 
                  className="relative p-2 rounded-[14px] border"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    borderColor: 'rgba(255,255,255,0.06)',
                    color: 'rgba(255,255,255,0.68)'
                  }}
                  whileHover={{ 
                    y: -1,
                    background: 'rgba(255,255,255,0.08)', 
                    color: 'rgba(255,255,255,0.88)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    transition: { duration: 0.12 }
                  }}
                  whileTap={{ 
                    scale: 0.97, 
                    y: 0.5,
                    transition: { duration: 0.08 }
                  }}
                >
                  <X className="w-5 h-5" strokeWidth={2.2} />
                </motion.button>
              </div>
            </div>
          </motion.div>

          <motion.div 
            key={`${segment.name}-content`}
            className="overflow-y-auto flex-1" 
            variants={containerVariants} 
            initial="hidden" 
            animate="visible"
            style={{ 
              scrollBehavior: 'smooth',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'thin',
              padding: isPolicyDrawer ? '0 48px 52px 48px' : '0 48px 48px 48px',
              willChange: 'transform',
              zIndex: 2
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