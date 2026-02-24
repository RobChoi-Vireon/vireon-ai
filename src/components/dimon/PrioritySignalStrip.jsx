// 🔒 DESIGN LOCKED — OS HORIZON V4.0
// Last Updated: 2025-01-20
// Do not modify visual design without explicit assignment
// See: DESIGN_LOCKED_COMPONENTS.md

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Zap, TrendingDown, ExternalLink, ShieldAlert, Waves, Globe, Lock, CalendarClock, Link, Factory, Banknote } from 'lucide-react';

const QuickGlanceBadge = ({ tag, delay }) => {
  const icons = { ShieldAlert, Waves, Globe, Lock, CalendarClock, Link, Factory, Banknote, TrendingDown, Zap };
  const Icon = icons[tag.icon] || Zap;

  return (
    <motion.div
      className={`inline-flex items-center space-x-2 px-2 py-1 rounded-full text-xs font-semibold bg-black/40 border border-white/20 backdrop-blur-sm ${tag.color || 'text-gray-300'}`}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: delay * 0.1 + 0.2, type: "spring", stiffness: 300, damping: 20 }}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{tag.label}</span>
    </motion.div>
  );
};

const PrioritySignal = ({ signal, index, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getUrgencyStyle = (urgency) => {
    switch (urgency) {
      case 'critical':
        return {
          bg: 'bg-gradient-to-br from-red-900/40 via-rose-800/30 to-red-900/40',
          border: 'border-red-500/50',
          glow: 'shadow-[0_0_30px_rgba(239,68,68,0.3)]',
          hoverGlow: 'shadow-[0_0_40px_rgba(239,68,68,0.5)]',
          icon: <AlertTriangle className="w-5 h-5 text-red-300" />,
          pulse: true,
          radialGlow: 'rgba(239,68,68,0.15)',
          innerGlow: 'from-red-500/20 to-transparent'
        };
      case 'high':
        return {
          bg: 'bg-gradient-to-br from-teal-800/40 via-cyan-700/30 to-teal-800/40',
          border: 'border-teal-400/50',
          glow: 'shadow-[0_0_30px_rgba(20,184,166,0.3)]',
          hoverGlow: 'shadow-[0_0_40px_rgba(20,184,166,0.5)]',
          icon: <TrendingDown className="w-5 h-5 text-teal-300" />,
          pulse: false,
          radialGlow: 'rgba(20,184,166,0.15)',
          innerGlow: 'from-teal-500/20 to-transparent'
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-slate-700/40 via-gray-600/30 to-slate-700/40',
          border: 'border-slate-400/50',
          glow: 'shadow-[0_0_30px_rgba(100,116,139,0.3)]',
          hoverGlow: 'shadow-[0_0_40px_rgba(100,116,139,0.5)]',
          icon: <Zap className="w-5 h-5 text-slate-300" />,
          pulse: false,
          radialGlow: 'rgba(100,116,139,0.15)',
          innerGlow: 'from-slate-500/20 to-transparent'
        };
    }
  };

  const style = getUrgencyStyle(signal.urgency);

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onClick(signal)}
      className={`
        hzn-priority-signal relative flex items-center space-x-5 p-6 md:p-7
        border cursor-pointer transition-all duration-500 ease-out overflow-hidden
        ${style.bg} ${style.border}
      `}
      style={{
        background: `rgba(15, 18, 26, 0.58)`,
        backdropFilter: 'blur(16px)',
        borderRadius: '18px',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: isHovered 
          ? '0 10px 24px rgba(0,0,0,0.35), 0 8px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)'
          : '0 10px 24px rgba(0,0,0,0.35), 0 2px 12px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        scale: 1,
      }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 200,
        damping: 20
      }}
      whileHover={{ 
        y: -8,
        scale: 1.02,
        transition: { type: 'spring', stiffness: 400, damping: 15, duration: 0.15 }
      }}
      whileTap={{ 
        scale: 1.02,
        transition: { duration: 0.08, ease: [0.25, 1, 0.5, 1] }
      }}
    >
      {/* Enhanced Layered Glass Overlays */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `
          radial-gradient(120% 120% at 50% 45%, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.00) 65%),
          linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.00) 12%)
        `,
        borderRadius: '18px'
      }} />

      {/* Edge Shading for Depth - Micro-contrast inner shadow */}
      <div 
        className="hzn-edge-shadow absolute inset-0 pointer-events-none" 
        style={{
          borderRadius: '18px',
          boxShadow: 'inset 0 -1px 18px rgba(0, 0, 0, 0.12)',
          maskImage: 'linear-gradient(to top, black 0%, transparent 25%), linear-gradient(to right, black 0%, transparent 15%), linear-gradient(to left, black 0%, transparent 15%)',
          WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 25%), linear-gradient(to right, black 0%, transparent 15%), linear-gradient(to left, black 0%, transparent 15%)',
          maskComposite: 'intersect',
          WebkitMaskComposite: 'source-in'
        }}
        aria-hidden="true"
      />

      {/* Edge Light on Hover */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.20) 0%, transparent 100%)',
            borderRadius: '18px'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 0.2 }}
        />
      )}

      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 rounded-[18px] opacity-30"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${style.radialGlow} 0%, transparent 60%)`
        }}
        animate={{
          background: [
            `radial-gradient(circle at 30% 30%, ${style.radialGlow} 0%, transparent 60%)`,
            `radial-gradient(circle at 70% 70%, ${style.radialGlow} 0%, transparent 60%)`,
            `radial-gradient(circle at 30% 30%, ${style.radialGlow} 0%, transparent 60%)`
          ]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Pulse animation for critical signals */}
      {style.pulse && (
        <>
          <motion.div
            className="absolute -inset-px rounded-[17px] pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at center, rgba(239, 68, 68, 0.5) 0%, transparent 70%)`,
            }}
            animate={{
              scale: [1, 1.15],
              opacity: [0.5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-red-400/80 rounded-full"
              animate={{
                x: [10, 20, 10],
                y: [10, 5, 15],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut"
              }}
              style={{
                left: `${20 + i * 15}%`,
                top: `${20 + i * 10}%`
              }}
            />
          ))}
        </>
      )}

      {/* Inner glow effect */}
      <motion.div
        className={`absolute inset-0 rounded-[18px] bg-gradient-to-br ${style.innerGlow}`}
        animate={{ opacity: isHovered ? 0.6 : 0.2 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Glare/Shimmer effect on hover */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-[18px]"
      >
        <motion.div
          className="absolute w-[400%] h-[400%] pointer-events-none"
          style={{
            background: `
              radial-gradient(
                ellipse at center,
                rgba(255, 255, 255, 0.15) 0%,
                transparent 40%
              )
            `
          }}
          initial={{ x: '-50%', y: '-50%', scale: 0 }}
          animate={{ 
            scale: isHovered ? 1 : 0
          }}
          transition={{
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1]
          }}
        />
      </motion.div>

      {/* Icon with enhanced animations */}
      <motion.div 
        className="flex-shrink-0 z-10 relative"
        animate={{
          rotate: isHovered ? [0, 5, 0] : 0,
          scale: isHovered ? 1.1 : 1
        }}
        transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
      >
        <motion.div
          className="absolute inset-0 rounded-full opacity-20"
          style={{ 
            background: `radial-gradient(circle, ${style.radialGlow} 0%, transparent 70%)`
          }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        {style.icon}
      </motion.div>

      {/* Content with ENHANCED LEGIBILITY */}
      <div className="flex-1 min-w-0 z-10">
        <motion.div 
          className="flex items-center space-x-3 mb-3"
          animate={{ x: isHovered ? 2 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.span 
            className="inline-block px-3 py-1.5 text-sm font-bold rounded-full text-white border backdrop-blur-sm"
            whileHover={{ scale: 1.05 }}
            style={{ 
              background: 'linear-gradient(135deg, rgba(0,0,0,0.55), rgba(40,40,40,0.35))',
              borderColor: 'rgba(255, 255, 255, 0.35)',
              textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)',
            }}
          >
            {signal.tag}
          </motion.span>
          {signal.source && (
            <motion.span 
              className="text-sm uppercase tracking-widest font-semibold"
              animate={{ opacity: isHovered ? 1 : 0.85 }}
              style={{
                color: 'rgba(200, 210, 220, 0.95)',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.6)'
              }}
            >
              {signal.source}
            </motion.span>
          )}
        </motion.div>
        <motion.p 
          className="text-base md:text-lg font-semibold leading-relaxed"
          animate={{ x: isHovered ? 2 : 0 }}
          transition={{ duration: 0.2, delay: 0.05 }}
          style={{ 
            lineHeight: '1.65',
            color: 'rgba(245, 248, 252, 0.96)',
            textShadow: '0 1px 3px rgba(0, 0, 0, 0.7), 0 2px 6px rgba(0, 0, 0, 0.3)',
            letterSpacing: '-0.01em',
            fontWeight: 600
          }}
        >
          {signal.text}
        </motion.p>
        
        {signal.quick_glance_tags && (
          <motion.div 
            className="flex flex-wrap gap-2 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {signal.quick_glance_tags.map((tag, i) => (
              <QuickGlanceBadge key={i} tag={tag} delay={i} />
            ))}
          </motion.div>
        )}
      </div>

      {/* Enhanced external link icon */}
      <motion.div
        className="flex-shrink-0 z-10"
        animate={{ 
          x: isHovered ? 4 : 0,
          opacity: isHovered ? 1 : 0.5,
          rotate: isHovered ? 10 : 0
        }}
        transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
      >
        <motion.div
          className="relative p-2.5 rounded-lg bg-white/10 border border-white/20 backdrop-blur-sm"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ExternalLink className="w-4 h-4 text-gray-300" />
        </motion.div>
      </motion.div>

      {/* Subtle scanning line effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)', x: '-100%' }}
        animate={{ x: isHovered ? '100%' : '-100%' }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
    </motion.div>
  );
};

export default function PrioritySignalStrip({ frontPageSignals = null, signals = [], onOpenDrawer }) {
  // Use frontPageSignals if provided (new binding), otherwise fallback to signals array (legacy)
  const buckets = frontPageSignals ? ['policy', 'credit', 'tech', 'geopolitics'] : null;
  const displaySignals = buckets 
    ? buckets.map(bucket => {
        const data = frontPageSignals[bucket];
        if (!data) return null;
        
        return {
          tag: data.headline || 'No Priority Signal Detected',
          text: data.summary || '',
          urgency: data.urgency || 'medium',
          source: data.top_sources?.[0]?.source || '',
          quick_glance_tags: (data.impact_tags || []).map(tag => ({
            label: tag,
            icon: 'Zap',
            color: 'text-gray-300'
          })),
          bucket: bucket,
          rawData: data
        };
      }).filter(Boolean)
    : signals;

  if (!displaySignals || displaySignals.length === 0) {
    return null;
  }

  return (
    <motion.section
      aria-labelledby="priority-signals-heading"
      className="mb-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <style>{`
        /* ============================================================================
           HORIZON OS — FRONT PAGE SIGNALS: LEGIBILITY ENHANCEMENT v2.0
        ============================================================================ */
        
        /* Glass Blur Tightening - Reduced by 2px for sharper refractions */
        .hzn-priority-signal {
          backdrop-filter: blur(14px) !important;
          -webkit-backdrop-filter: blur(14px) !important;
        }
        
        /* Edge Shading - Curved gradient masking for 3D inset effect */
        .hzn-edge-shadow {
          opacity: 1;
          transition: opacity 300ms ease;
        }
        
        .hzn-priority-signal:hover .hzn-edge-shadow {
          opacity: 0.7;
        }
        
        /* Performance optimization */
        .hzn-priority-signal {
          transform: translateZ(0);
          backface-visibility: hidden;
          will-change: transform, box-shadow;
        }
        
        /* Text Rendering Optimization for Legibility */
        .hzn-priority-signal p,
        .hzn-priority-signal span {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
        }
        
        /* Contrast Enhancement Layer */
        .hzn-priority-signal::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 18px;
          background: linear-gradient(135deg, 
            rgba(0, 0, 0, 0.15) 0%, 
            transparent 40%, 
            rgba(0, 0, 0, 0.08) 100%
          );
          pointer-events: none;
          z-index: 1;
        }
        
        /* Reduced Motion Support */
        @media (prefers-reduced-motion: reduce) {
          .hzn-priority-signal {
            transition: none !important;
          }
          
          .hzn-priority-signal * {
            animation: none !important;
            transition: none !important;
          }
        }
        
        /* High Contrast Mode Support */
        @media (prefers-contrast: high) {
          .hzn-priority-signal p {
            color: #FFFFFF !important;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 1) !important;
          }
          
          .hzn-priority-signal {
            border-color: rgba(255, 255, 255, 0.5) !important;
          }
        }
      `}</style>

      {/* MATCHED HEADER STYLING */}
      <div className="mb-4 pl-2">
        <h2 
          className="font-semibold mb-2"
          style={{ 
            fontSize: '34px',
            lineHeight: '1.2',
            color: 'rgba(255, 255, 255, 0.95)',
            letterSpacing: '-0.02em'
          }}
        >
          U.S. Front Page Priority Signals
        </h2>
        <p 
          className="text-sm"
          style={{ color: 'rgba(255, 255, 255, 0.7)' }}
        >
          The most important stories you need to know right now.
        </p>
      </div>
      
      <div 
        className="flex gap-6 overflow-x-auto pb-2"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255, 255, 255, 0.18) rgba(255, 255, 255, 0.04)',
        }}
      >
        <style>{`
          .flex.overflow-x-auto::-webkit-scrollbar {
            height: 6px;
          }
          .flex.overflow-x-auto::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.04);
            border-radius: 6px;
          }
          .flex.overflow-x-auto::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.18);
            border-radius: 6px;
          }
          .flex.overflow-x-auto::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.25);
          }
        `}</style>
        {displaySignals.slice(0, 4).map((signal, index) => (
          <div key={index} className="flex-shrink-0" style={{ width: 'calc(50% - 12px)' }}>
            <PrioritySignal signal={signal} index={index} onClick={onOpenDrawer} />
          </div>
        ))}
      </div>

      {/* Debug Panel - Validation */}
      {frontPageSignals && process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-3 rounded-lg bg-black/40 border border-yellow-500/30 text-xs font-mono">
          <div className="text-yellow-400 font-bold mb-2">🔍 Binding Validation</div>
          <div className="space-y-1 text-gray-300">
            <div>
              <span className="text-gray-500">front_page_signals.policy.headline:</span>{' '}
              <span className="text-white">{frontPageSignals.policy?.headline || 'null'}</span>
            </div>
            <div>
              <span className="text-gray-500">priority_signals_v1.cards.policy.headline:</span>{' '}
              <span className="text-white">
                {frontPageSignals._priority_signals_v1?.cards?.policy?.headline || 'N/A (not in front_page_signals)'}
              </span>
            </div>
          </div>
        </div>
      )}
    </motion.section>
  );
}