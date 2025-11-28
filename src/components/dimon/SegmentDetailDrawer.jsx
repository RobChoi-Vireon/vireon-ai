// 🔒 DESIGN LOCKED — STEVE JOBS DRAWER LAYOUT V1
// Minimal, editorial, subsurface glass. No outer glow.
// Last Updated: 2025-01-28

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Briefcase, BarChart3, Globe, Target, Waves, ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Clock, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

// ============================================================================
// MOTION SYSTEM
// ============================================================================
const MOTION = {
  ease: [0.25, 0.1, 0.25, 1.0],
  duration: 0.22,
  stagger: 0.04
};

// ============================================================================
// GLASS SYSTEM (Subsurface only, no outer glow)
// ============================================================================
const GLASS = {
  surface: {
    bg: 'rgba(255, 255, 255, 0.032)',
    blur: 'blur(14px)',
    border: 'rgba(255, 255, 255, 0.06)',
    radius: '26px'
  },
  divider: 'rgba(255, 255, 255, 0.10)',
  ghost: {
    bg: 'rgba(255, 255, 255, 0.05)',
    border: 'rgba(255, 255, 255, 0.08)'
  }
};

// ============================================================================
// TYPOGRAPHY
// ============================================================================
const TYPE = {
  title: { size: '22px', weight: 600, color: 'rgba(255,255,255,0.94)' },
  subtitle: { size: '14px', weight: 450, color: 'rgba(255,255,255,0.52)' },
  body: { size: '15px', weight: 420, color: 'rgba(255,255,255,0.88)' },
  label: { size: '11px', weight: 550, color: 'rgba(255,255,255,0.50)' },
  micro: { size: '10px', weight: 520, color: 'rgba(255,255,255,0.55)' }
};

// ============================================================================
// SEGMENT THEMES
// ============================================================================
const getTheme = (name) => {
  const themes = {
    Policy: { Icon: Shield, color: '#5A9BE8', colorRgb: '90, 155, 232' },
    Credit: { Icon: Briefcase, color: '#9B7ADB', colorRgb: '155, 122, 219' },
    Equities: { Icon: BarChart3, color: '#2DB87D', colorRgb: '45, 184, 125' },
    Global: { Icon: Globe, color: '#D4A24A', colorRgb: '212, 162, 74' }
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
      drivers: [
        { icon: Target, label: 'Key Driver', text: "Regulators are getting tougher across content, privacy, and platform practices." },
        { icon: Waves, label: 'Pressure Direction', text: "Rules are becoming stricter, making the environment harder for companies." },
        { icon: BarChart3, label: 'Market Impact', text: "Moderate impact, with some industries beginning to feel more pressure." }
      ],
      impactGrid: [
        { name: 'Technology', direction: 'down' },
        { name: 'Healthcare', direction: 'neutral' },
        { name: 'Financials', direction: 'down' },
        { name: 'Utilities', direction: 'up' }
      ],
      whatThisMeans: "Stricter regulation is creating steady pressure on the market. Big tech companies may face higher costs and slower stock price growth as oversight increases."
    },
    Credit: {
      tldr: "Borrowing is getting more expensive and harder to access, especially for weaker borrowers.",
      status: "Moderate",
      trend: "up",
      certainty: 68,
      horizon: "Medium-term",
      drivers: [
        { icon: Target, label: 'Key Driver', text: "Lenders are getting more cautious after early signs of stress in riskier debt." },
        { icon: Waves, label: 'Pressure Direction', text: "Credit is tightening, making it tougher for companies and households to refinance." },
        { icon: BarChart3, label: 'Market Impact', text: "Moderate impact, with highly indebted companies and lower-quality borrowers feeling it first." }
      ],
      impactGrid: [
        { name: 'High Yield', direction: 'down' },
        { name: 'IG Credit', direction: 'neutral' },
        { name: 'Real Estate', direction: 'down' },
        { name: 'Banks', direction: 'neutral' }
      ],
      whatThisMeans: "Tighter credit conditions can slow growth and increase default risk. Companies that rely heavily on cheap borrowing may face higher costs and less flexibility."
    },
    Equities: {
      tldr: "Most stock gains are coming from a small group of big companies, not the whole market.",
      status: "Narrow",
      trend: "neutral",
      certainty: 75,
      horizon: "Near-term",
      drivers: [
        { icon: Target, label: 'Key Driver', text: "Investors are crowding into large, well-known names while smaller stocks lag behind." },
        { icon: Waves, label: 'Pressure Direction', text: "Support for the market is narrowing, making it more vulnerable if leaders stumble." },
        { icon: BarChart3, label: 'Market Impact', text: "Moderate impact, with the index looking strong on the surface but more fragile underneath." }
      ],
      impactGrid: [
        { name: 'Large Cap', direction: 'up' },
        { name: 'Small Cap', direction: 'down' },
        { name: 'Growth', direction: 'up' },
        { name: 'Value', direction: 'neutral' }
      ],
      whatThisMeans: "A narrow group of winners can keep the market up, but it also raises concentration risk. If leadership cracks, the pullback can be sharper."
    },
    Global: {
      tldr: "Slower growth in key regions, especially China, is starting to weigh on the global outlook.",
      status: "Softening",
      trend: "down",
      certainty: 70,
      horizon: "Medium-term",
      drivers: [
        { icon: Target, label: 'Key Driver', text: "Weaker demand from China and softer data in other major economies are cooling trade." },
        { icon: Waves, label: 'Pressure Direction', text: "Growth momentum is cooling instead of accelerating." },
        { icon: BarChart3, label: 'Market Impact', text: "Moderate impact, with export-driven and commodity-linked areas feeling the slowdown more." }
      ],
      impactGrid: [
        { name: 'EM Equities', direction: 'down' },
        { name: 'Commodities', direction: 'down' },
        { name: 'DM Equities', direction: 'neutral' },
        { name: 'USD', direction: 'up' }
      ],
      whatThisMeans: "A cooling global economy can pressure earnings expectations. If the slowdown deepens, markets may price in weaker profits and fewer growth opportunities."
    }
  };
  
  return data[segment.name] || data.Policy;
};

// ============================================================================
// HEADER (No card background, subtle divider)
// ============================================================================
const DrawerHeader = ({ segment, theme, onClose, onNavigate }) => {
  const { Icon } = theme;
  
  return (
    <motion.div 
      className="relative px-10 pt-8 pb-5"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: MOTION.duration, ease: MOTION.ease }}
    >
      {/* Subtle ambient blur behind header */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 100%, rgba(${theme.colorRgb}, 0.03) 0%, transparent 70%)`,
          filter: 'blur(40px)'
        }}
      />
      
      <div className="flex items-start justify-between relative">
        <div className="flex items-center gap-4">
          <div 
            className="w-11 h-11 rounded-2xl flex items-center justify-center"
            style={{
              background: `rgba(${theme.colorRgb}, 0.12)`,
              border: `1px solid rgba(${theme.colorRgb}, 0.18)`
            }}
          >
            <Icon className="w-5 h-5" style={{ color: theme.color }} strokeWidth={2} />
          </div>
          <div>
            <h1 style={{ ...TYPE.title, letterSpacing: '-0.02em', marginBottom: '2px' }}>
              {segment.name}
            </h1>
            <p style={TYPE.subtitle}>
              Market Pressure Analysis
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <motion.button
            onClick={() => onNavigate('prev')}
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: GLASS.ghost.bg, border: `1px solid ${GLASS.ghost.border}` }}
            whileHover={{ background: 'rgba(255,255,255,0.08)' }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.65)' }} />
          </motion.button>
          <motion.button
            onClick={() => onNavigate('next')}
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: GLASS.ghost.bg, border: `1px solid ${GLASS.ghost.border}` }}
            whileHover={{ background: 'rgba(255,255,255,0.08)' }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.65)' }} />
          </motion.button>
          <motion.button
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center ml-1"
            style={{ background: GLASS.ghost.bg, border: `1px solid ${GLASS.ghost.border}` }}
            whileHover={{ background: 'rgba(255,255,255,0.08)' }}
            whileTap={{ scale: 0.95 }}
          >
            <X className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.65)' }} />
          </motion.button>
        </div>
      </div>
      
      {/* Bottom divider */}
      <div 
        className="absolute bottom-0 left-10 right-10 h-px"
        style={{ background: GLASS.divider }}
      />
    </motion.div>
  );
};

// ============================================================================
// INSIGHT HERO BLOCK
// ============================================================================
const InsightHero = ({ details, theme, weight, index }) => {
  return (
    <motion.div
      className="mx-10 mt-8"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * MOTION.stagger, duration: MOTION.duration, ease: MOTION.ease }}
    >
      <div
        className="relative overflow-hidden p-7"
        style={{
          background: GLASS.surface.bg,
          backdropFilter: GLASS.surface.blur,
          WebkitBackdropFilter: GLASS.surface.blur,
          borderRadius: GLASS.surface.radius,
          border: `1px solid ${GLASS.surface.border}`
        }}
      >
        {/* Internal light gradient */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.015) 0%, transparent 50%)',
            borderRadius: GLASS.surface.radius
          }}
        />
        
        <div className="flex flex-col items-center text-center relative">
          {/* TL;DR capsule (ghost style) */}
          <div 
            className="px-3 py-1.5 rounded-full mb-5"
            style={{
              ...TYPE.micro,
              background: GLASS.ghost.bg,
              border: `1px solid ${GLASS.ghost.border}`,
              letterSpacing: '0.08em'
            }}
          >
            TL;DR
          </div>
          
          {/* Main Insight */}
          <p 
            style={{
              fontSize: '17px',
              fontWeight: 460,
              color: 'rgba(255,255,255,0.94)',
              lineHeight: 1.55,
              maxWidth: '580px',
              marginBottom: '20px'
            }}
          >
            {details.tldr}
          </p>
          
          {/* Micro capsules row */}
          <div className="flex items-center gap-3">
            <div 
              className="px-3 py-1.5 rounded-full"
              style={{
                ...TYPE.micro,
                color: theme.color,
                background: `rgba(${theme.colorRgb}, 0.10)`,
                border: `1px solid rgba(${theme.colorRgb}, 0.18)`
              }}
            >
              {details.status}
            </div>
            <div 
              className="px-3 py-1.5 rounded-full"
              style={{
                ...TYPE.micro,
                background: GLASS.ghost.bg,
                border: `1px solid ${GLASS.ghost.border}`
              }}
            >
              {Math.round(weight)}% weight
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ============================================================================
// DRIVER SECTION (Unified Container)
// ============================================================================
const DriverSection = ({ details, theme, index }) => {
  return (
    <motion.div
      className="mx-10 mt-7"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * MOTION.stagger, duration: MOTION.duration, ease: MOTION.ease }}
    >
      <div
        className="relative overflow-hidden"
        style={{
          background: GLASS.surface.bg,
          backdropFilter: GLASS.surface.blur,
          WebkitBackdropFilter: GLASS.surface.blur,
          borderRadius: GLASS.surface.radius,
          border: `1px solid ${GLASS.surface.border}`
        }}
      >
        {/* Title row */}
        <div className="px-6 py-4 border-b" style={{ borderColor: GLASS.divider }}>
          <span style={{ ...TYPE.label, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Key Drivers
          </span>
        </div>
        
        {/* Driver rows */}
        {details.drivers.map((driver, idx) => (
          <div 
            key={driver.label}
            className="px-6 py-4 flex items-start gap-4"
            style={{ 
              borderBottom: idx < details.drivers.length - 1 ? `1px solid ${GLASS.divider}` : 'none'
            }}
          >
            <div 
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{
                background: `rgba(${theme.colorRgb}, 0.08)`,
                border: `1px solid rgba(${theme.colorRgb}, 0.12)`
              }}
            >
              <driver.icon className="w-4 h-4" style={{ color: theme.color }} strokeWidth={2} />
            </div>
            <div className="flex-1">
              <h4 style={{ ...TYPE.label, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {driver.label}
              </h4>
              <p style={TYPE.body}>
                {driver.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// ============================================================================
// MARKET IMPACT GRID
// ============================================================================
const ImpactGrid = ({ details, theme, index }) => {
  const DirectionIcon = ({ direction }) => {
    if (direction === 'up') return <ArrowUpRight className="w-3.5 h-3.5" style={{ color: '#2DB87D' }} strokeWidth={2.5} />;
    if (direction === 'down') return <ArrowDownRight className="w-3.5 h-3.5" style={{ color: '#E86565' }} strokeWidth={2.5} />;
    return <Minus className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.45)' }} strokeWidth={2.5} />;
  };
  
  return (
    <motion.div
      className="mx-10 mt-7"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * MOTION.stagger, duration: MOTION.duration, ease: MOTION.ease }}
    >
      <div
        className="relative overflow-hidden"
        style={{
          background: GLASS.surface.bg,
          backdropFilter: GLASS.surface.blur,
          WebkitBackdropFilter: GLASS.surface.blur,
          borderRadius: GLASS.surface.radius,
          border: `1px solid ${GLASS.surface.border}`
        }}
      >
        {/* Title row */}
        <div className="px-6 py-4 border-b" style={{ borderColor: GLASS.divider }}>
          <span style={{ ...TYPE.label, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Market Impact
          </span>
        </div>
        
        {/* Two-column grid */}
        <div className="grid grid-cols-2 gap-0">
          {details.impactGrid.map((item, idx) => (
            <div 
              key={item.name}
              className="px-5 py-3.5 flex items-center justify-between"
              style={{
                borderRight: idx % 2 === 0 ? `1px solid ${GLASS.divider}` : 'none',
                borderBottom: idx < 2 ? `1px solid ${GLASS.divider}` : 'none'
              }}
            >
              <span style={{ ...TYPE.body, fontSize: '13px' }}>{item.name}</span>
              <DirectionIcon direction={item.direction} />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// ============================================================================
// WHAT THIS MEANS (Hero Summary)
// ============================================================================
const SummaryBlock = ({ details, index }) => {
  return (
    <motion.div
      className="mx-10 mt-7"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * MOTION.stagger, duration: MOTION.duration, ease: MOTION.ease }}
    >
      <div
        className="relative overflow-hidden p-7 text-center"
        style={{
          background: GLASS.surface.bg,
          backdropFilter: GLASS.surface.blur,
          WebkitBackdropFilter: GLASS.surface.blur,
          borderRadius: GLASS.surface.radius,
          border: `1px solid ${GLASS.surface.border}`
        }}
      >
        {/* Internal light gradient (top → bottom) */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.018) 0%, transparent 60%)',
            borderRadius: GLASS.surface.radius
          }}
        />
        
        <h3 
          className="relative uppercase mb-4"
          style={{ ...TYPE.label, letterSpacing: '0.12em' }}
        >
          What This Means
        </h3>
        
        <p 
          className="relative"
          style={{
            fontSize: '16px',
            fontWeight: 440,
            color: 'rgba(255,255,255,0.90)',
            lineHeight: 1.62,
            maxWidth: '480px',
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
// BOTTOM SIGNAL RAIL
// ============================================================================
const SignalRail = ({ details, theme, index }) => {
  const TrendIcon = details.trend === 'up' ? TrendingUp : details.trend === 'down' ? TrendingDown : null;
  
  return (
    <motion.div
      className="flex justify-center gap-2 mx-10 mt-6 mb-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * MOTION.stagger, duration: MOTION.duration }}
    >
      {TrendIcon && (
        <div 
          className="flex items-center gap-1.5 px-2.5 py-1"
          style={{
            ...TYPE.micro,
            fontSize: '9px',
            color: theme.color,
            background: 'transparent',
            border: `1px solid rgba(${theme.colorRgb}, 0.22)`,
            borderRadius: '8px'
          }}
        >
          <TrendIcon className="w-2.5 h-2.5" strokeWidth={2.5} />
          <span>{details.status}</span>
        </div>
      )}
      
      <div 
        className="flex items-center px-2.5 py-1"
        style={{
          ...TYPE.micro,
          fontSize: '9px',
          background: 'transparent',
          border: `1px solid ${GLASS.ghost.border}`,
          borderRadius: '8px'
        }}
      >
        {details.certainty}% certain
      </div>
      
      <div 
        className="flex items-center gap-1 px-2.5 py-1"
        style={{
          ...TYPE.micro,
          fontSize: '9px',
          background: 'transparent',
          border: `1px solid ${GLASS.ghost.border}`,
          borderRadius: '8px'
        }}
      >
        <Clock className="w-2.5 h-2.5" strokeWidth={2.5} />
        <span>{details.horizon}</span>
      </div>
    </motion.div>
  );
};

// ============================================================================
// MAIN DRAWER
// ============================================================================
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
  const weight = (segment?.weight || 0) * 100;

  if (!details) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22, ease: MOTION.ease }}
        style={{ paddingTop: '80px' }}
      >
        {/* Backdrop */}
        <motion.div 
          className="absolute inset-0"
          style={{ 
            top: '80px',
            background: 'rgba(0,0,0,0.80)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)'
          }}
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.24 }}
        />
        
        {/* Drawer Panel */}
        <motion.div
          key={segment.name}
          className="relative w-full max-w-3xl max-h-[88vh] overflow-hidden flex flex-col"
          style={{
            borderRadius: '28px',
            background: 'linear-gradient(180deg, rgba(14, 16, 22, 0.97) 0%, rgba(8, 10, 16, 0.98) 100%)',
            backdropFilter: 'blur(80px) saturate(180%)',
            WebkitBackdropFilter: 'blur(80px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.05)',
            boxShadow: '0 48px 100px -24px rgba(0, 0, 0, 0.85)'
          }}
          initial={{ opacity: 0, scale: 0.97, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 16 }}
          transition={{ duration: 0.28, ease: MOTION.ease }}
        >
          {/* Header */}
          <DrawerHeader 
            segment={segment} 
            theme={theme} 
            onClose={onClose} 
            onNavigate={onNavigate} 
          />

          {/* Scrollable Content */}
          <div 
            className="overflow-y-auto flex-1"
            style={{ scrollBehavior: 'smooth' }}
          >
            <InsightHero details={details} theme={theme} weight={weight} index={1} />
            <DriverSection details={details} theme={theme} index={2} />
            <ImpactGrid details={details} theme={theme} index={3} />
            <SummaryBlock details={details} index={4} />
            <SignalRail details={details} theme={theme} index={5} />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}