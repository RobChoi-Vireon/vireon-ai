import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, BarChart2, TrendingUp, ChevronDown, CalendarPlus, BellPlus, Zap, ShieldCheck, ExternalLink } from 'lucide-react';
import CompanyLogo from './CompanyLogo';
import { Button } from '@/components/ui/button';

// ============================================================================
// OS HORIZON LIQUID GLASS TAHOE — DESIGN SYSTEM
// ============================================================================
const GLASS = {
  card: {
    bg: 'rgba(22, 28, 42, 0.48)',
    blur: 'blur(36px)',
    radius: '24px',
    border: 'rgba(255, 255, 255, 0.10)',
    borderHover: 'rgba(255, 255, 255, 0.18)',
    innerGlow: 'inset 0 0 30px rgba(255,255,255,0.02)',
    innerShadow: 'inset 0 0 25px rgba(0,0,0,0.18)'
  },
  button: {
    bg: 'rgba(255, 255, 255, 0.08)',
    bgHover: 'rgba(255, 255, 255, 0.14)',
    blur: 'blur(20px)',
    border: 'rgba(255, 255, 255, 0.12)',
    innerShadow: 'inset 0 0 12px rgba(255,255,255,0.05)'
  },
  stat: {
    bg: 'rgba(255, 255, 255, 0.04)',
    border: 'rgba(255, 255, 255, 0.08)',
    innerShadow: 'inset 0 0 14px rgba(255,255,255,0.03)'
  }
};

export default function EarningsCard({ event, theme, onAddToCalendar, onShowDetails }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const importanceColors = {
    'Critical': { color: '#FF7A8A', rgb: '255, 122, 138' },
    'High': { color: '#FFBA6A', rgb: '255, 186, 106' },
    'Medium': { color: '#6BA3FF', rgb: '107, 163, 255' },
  };
  
  const consensusColors = {
    'Beat Expected': '#58E3A4',
    'Mixed Views': '#FFBA6A',
    'Miss Expected': '#FF7A8A',
  };

  const importance = importanceColors[event.importance] || importanceColors['Medium'];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
      className="w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div 
        className="relative overflow-hidden cursor-pointer"
        style={{
          padding: '20px 24px',
          background: GLASS.card.bg,
          backdropFilter: GLASS.card.blur,
          WebkitBackdropFilter: GLASS.card.blur,
          borderRadius: GLASS.card.radius,
          border: `1px solid ${isExpanded || isHovered ? GLASS.card.borderHover : GLASS.card.border}`,
          boxShadow: `
            ${GLASS.card.innerGlow},
            ${GLASS.card.innerShadow},
            0 15px 35px -10px rgba(0,0,0,0.30)
          `
        }}
        animate={{
          y: isHovered && !isExpanded ? -2 : 0,
          boxShadow: isHovered || isExpanded
            ? `
              ${GLASS.card.innerGlow},
              ${GLASS.card.innerShadow},
              0 20px 40px -12px rgba(0,0,0,0.40),
              0 0 30px rgba(${importance.rgb}, 0.06)
            `
            : `
              ${GLASS.card.innerGlow},
              ${GLASS.card.innerShadow},
              0 15px 35px -10px rgba(0,0,0,0.30)
            `
        }}
        transition={{ duration: 0.2 }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Top highlight */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '15%',
          right: '15%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
          pointerEvents: 'none'
        }} />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between gap-4">
            {/* Importance Indicator */}
            <div className="flex-shrink-0">
              <motion.div 
                className="w-1.5 h-16 rounded-full"
                style={{ 
                  background: `linear-gradient(180deg, ${importance.color} 0%, rgba(${importance.rgb}, 0.3) 100%)`,
                  boxShadow: `0 0 12px rgba(${importance.rgb}, 0.35)`
                }}
                animate={{ 
                  boxShadow: [
                    `0 0 10px rgba(${importance.rgb}, 0.30)`,
                    `0 0 16px rgba(${importance.rgb}, 0.45)`,
                    `0 0 10px rgba(${importance.rgb}, 0.30)`
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>

            {/* Main Info */}
            <div className="flex items-center gap-3.5 flex-1">
              <CompanyLogo ticker={event.ticker} className="w-11 h-11" />
              <div className="flex-1 min-w-0">
                <p 
                  className="text-lg font-bold tracking-[-0.01em]"
                  style={{ color: 'rgba(255,255,255,0.95)' }}
                >
                  {event.ticker}
                </p>
                <p 
                  className="text-sm truncate"
                  style={{ color: 'rgba(200, 210, 230, 0.60)' }}
                >
                  {event.name}
                </p>
              </div>
            </div>

            {/* Quick Actions & Stats */}
            <div className="flex items-center gap-3">
              {/* Detailed Analysis Button — Glass */}
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onShowDetails?.(event);
                }}
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: 'rgba(130, 100, 220, 0.15)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(130, 100, 220, 0.25)',
                  boxShadow: 'inset 0 0 12px rgba(130, 100, 220, 0.08)'
                }}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                title="Detailed Analysis"
              >
                <ExternalLink className="w-4 h-4" style={{ color: '#B68AE8' }} />
              </motion.button>

              {/* Key Stats */}
              <div className="text-right hidden sm:block">
                <p 
                  className="text-[10px] font-medium uppercase tracking-wide"
                  style={{ color: 'rgba(200, 210, 230, 0.50)' }}
                >
                  EPS Est.
                </p>
                <p 
                  className="text-lg font-bold tracking-tight"
                  style={{ color: 'rgba(255,255,255,0.95)' }}
                >
                  {event.estimate}
                </p>
              </div>
              
              <div className="text-right hidden md:block">
                <p 
                  className="text-[10px] font-medium uppercase tracking-wide"
                  style={{ color: 'rgba(200, 210, 230, 0.50)' }}
                >
                  Mkt Cap
                </p>
                <p 
                  className="text-lg font-bold tracking-tight"
                  style={{ color: 'rgba(255,255,255,0.95)' }}
                >
                  {event.marketCap}
                </p>
              </div>

              {/* Expand Toggle — Glass */}
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.10)'
                }}
              >
                <ChevronDown className="w-4 h-4" style={{ color: 'rgba(200, 210, 230, 0.65)' }} />
              </motion.div>
            </div>
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: '1.25rem' }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
              >
                <div 
                  className="pt-5"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
                >
                  {/* Stats Grid — Glass */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                    <GlassStatPill 
                      icon={Zap} 
                      label="Consensus" 
                      value={event.consensus} 
                      valueColor={consensusColors[event.consensus]} 
                    />
                    <GlassStatPill 
                      icon={TrendingUp} 
                      label="Pre-Mkt" 
                      value={event.preMarketMove} 
                      valueColor={event.preMarketMove.startsWith('+') ? '#58E3A4' : '#FF7A8A'} 
                    />
                    <GlassStatPill 
                      icon={BarChart2} 
                      label="Options Vol" 
                      value={event.optionsVolume} 
                    />
                    <GlassStatPill 
                      icon={ShieldCheck} 
                      label="Rating" 
                      value={event.analystRating} 
                      valueColor="#6BA3FF"
                    />
                  </div>
                  
                  {/* Action Buttons — Glass */}
                  <div className="flex items-center justify-end gap-2.5">
                    <motion.button 
                      onClick={(e) => { e.stopPropagation(); onAddToCalendar(event); }}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
                      style={{
                        background: GLASS.button.bg,
                        backdropFilter: GLASS.button.blur,
                        WebkitBackdropFilter: GLASS.button.blur,
                        border: `1px solid ${GLASS.button.border}`,
                        color: 'rgba(200, 210, 230, 0.85)',
                        boxShadow: GLASS.button.innerShadow
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <CalendarPlus className="w-4 h-4" />
                      <span>Calendar</span>
                    </motion.button>
                    <motion.button 
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
                      style={{
                        background: 'linear-gradient(135deg, rgba(99, 140, 255, 0.45) 0%, rgba(130, 100, 255, 0.38) 100%)',
                        backdropFilter: GLASS.button.blur,
                        WebkitBackdropFilter: GLASS.button.blur,
                        border: '1px solid rgba(140, 170, 255, 0.28)',
                        color: 'rgba(255,255,255,0.98)',
                        boxShadow: `${GLASS.button.innerShadow}, 0 0 20px rgba(99, 140, 255, 0.18)`
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <BellPlus className="w-4 h-4" />
                      <span>Set Alert</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============================================================================
// GLASS STAT PILL
// ============================================================================
const GlassStatPill = ({ icon: Icon, label, value, valueColor = 'rgba(255,255,255,0.95)' }) => (
  <div 
    className="p-3.5 rounded-xl"
    style={{
      background: GLASS.stat.bg,
      border: `1px solid ${GLASS.stat.border}`,
      boxShadow: GLASS.stat.innerShadow
    }}
  >
    <div className="flex items-center gap-2.5">
      <div 
        className="w-7 h-7 rounded-lg flex items-center justify-center"
        style={{ background: 'rgba(255,255,255,0.05)' }}
      >
        <Icon className="w-3.5 h-3.5" style={{ color: 'rgba(200, 210, 230, 0.55)' }} />
      </div>
      <div>
        <p 
          className="text-[10px] font-medium uppercase tracking-wide"
          style={{ color: 'rgba(200, 210, 230, 0.50)' }}
        >
          {label}
        </p>
        <p 
          className="text-sm font-semibold tracking-tight"
          style={{ color: valueColor }}
        >
          {value}
        </p>
      </div>
    </div>
  </div>
);