// 🔒 DESIGN LOCKED — OS HORIZON V4.0
// Last Updated: 2025-01-20
// Do not modify visual design without explicit assignment
// See: DESIGN_LOCKED_COMPONENTS.md

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitCommit, AlertTriangle, ExternalLink, TrendingUp, TrendingDown, Minus, Database, BarChart2 } from 'lucide-react';

const DivergenceIntensityMeter = ({ divergences = [] }) => {
  const intensity = Math.min(5, Math.max(1, divergences.length));
  const [hoveredOrb, setHoveredOrb] = useState(null);
  
  return (
    <div className="mb-8" style={{ marginTop: '8px' }}>
      <div className="flex items-center gap-4 mb-2.5">
        <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.70)', letterSpacing: '0.02em' }}>
          Fracture Intensity
        </span>
        <div className="flex items-center gap-2.5">
          {[...Array(5)].map((_, level) => {
            const isActive = level < intensity;
            const isHovered = hoveredOrb === level;
            
            return (
              <motion.div 
                key={level} 
                className="relative cursor-pointer"
                onHoverStart={() => setHoveredOrb(level)}
                onHoverEnd={() => setHoveredOrb(null)}
              >
                {/* Liquid Neon Orb */}
                <motion.div
                  className="w-2.5 h-2.5 rounded-full relative"
                  style={{
                    background: isActive 
                      ? 'linear-gradient(135deg, rgba(168, 110, 235, 0.88) 0%, rgba(200, 120, 245, 0.82) 100%)'
                      : 'rgba(255, 255, 255, 0.08)',
                    border: isActive ? '0.5px solid rgba(200, 120, 245, 0.30)' : '0.5px solid rgba(255,255,255,0.06)',
                    boxShadow: isActive 
                      ? '0 0 8px rgba(168, 110, 235, 0.28), inset 0 0.5px 0.5px rgba(255,255,255,0.22)'
                      : 'none'
                  }}
                  animate={isActive ? {
                    opacity: [0.85, 1, 0.85],
                    boxShadow: [
                      '0 0 8px rgba(168, 110, 235, 0.28), inset 0 0.5px 0.5px rgba(255,255,255,0.22)',
                      '0 0 11px rgba(168, 110, 235, 0.36), inset 0 0.5px 0.5px rgba(255,255,255,0.24)',
                      '0 0 8px rgba(168, 110, 235, 0.28), inset 0 0.5px 0.5px rgba(255,255,255,0.22)'
                    ]
                  } : {}}
                  transition={isActive ? {
                    duration: 5.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: level * 0.15
                  } : {}}
                  whileHover={isActive ? {
                    scale: 1.15,
                    boxShadow: '0 0 14px rgba(168, 110, 235, 0.42), inset 0 0.5px 0.5px rgba(255,255,255,0.26)',
                    transition: { duration: 0.22, ease: [0.25, 0.8, 0.25, 1] }
                  } : {}}
                >
                  {/* Orb specular highlight */}
                  {isActive && (
                    <div style={{
                      position: 'absolute',
                      top: '0.5px',
                      left: '0.5px',
                      width: '1px',
                      height: '1px',
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.48)',
                      filter: 'blur(0.3px)',
                      pointerEvents: 'none'
                    }} />
                  )}

                  {/* Soft bloom */}
                  {isActive && (
                    <motion.div
                      style={{
                        position: 'absolute',
                        inset: '-3px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(168, 110, 235, 0.25) 0%, transparent 75%)',
                        filter: 'blur(4px)',
                        pointerEvents: 'none'
                      }}
                      animate={{
                        opacity: [0.5, 0.7, 0.5]
                      }}
                      transition={{
                        duration: 5.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: level * 0.15
                      }}
                    />
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
        <span className="text-xs font-semibold" style={{ color: 'rgba(180, 140, 240, 0.88)' }}>
          {intensity}/5
        </span>
      </div>
      
      {/* Micro descriptor */}
      <p className="text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.68)', letterSpacing: '0.02em', lineHeight: '1.4' }}>
        Degree of narrative disagreement
      </p>
    </div>
  );
};

const DivergenceCapsule = ({ divergence, onClick, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [ripplePos, setRipplePos] = useState({ x: 0, y: 0 });
  const [showRipple, setShowRipple] = useState(false);

  const getContextCue = (divergence) => {
    switch (divergence?.id) {
      case 'em_credit':
        return 'Localized EM credit strain flagged by spreads';
      case 'energy_vs_industrials':
        return 'Energy strength diverges from weak industrial output';
      default:
        return 'Narrative inconsistency detected across sources';
    }
  };

  const getRiskLevel = (divergence) => {
    const confidence = divergence?.confidence || 0.6;
    if (confidence >= 0.7) return { label: 'Elevated', color: '#F26A6A' };
    if (confidence >= 0.5) return { label: 'Moderate', color: '#FFB020' };
    return { label: 'Low', color: '#5EA7FF' };
  };

  const getSourceCount = (divergence) => {
    return (divergence?.present_in || []).length + (divergence?.missing_in || []).length;
  };

  const contextCue = getContextCue(divergence);
  const riskLevel = getRiskLevel(divergence);
  const sourceCount = getSourceCount(divergence);
  const confidence = Math.round((divergence?.confidence || 0.6) * 100);

  const handleClick = (e) => {
    try {
      if (divergence && onClick) {
        const rect = e.currentTarget.getBoundingClientRect();
        setRipplePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
        setShowRipple(true);
        setTimeout(() => setShowRipple(false), 280);
        onClick(divergence);
      }
    } catch (error) {
      console.error('Error handling divergence click:', error);
    }
  };

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.36, ease: [0.22, 0.61, 0.36, 1] }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div
        onClick={handleClick}
        className="relative cursor-pointer group"
        whileHover={{ 
          y: -2,
          scale: 1.01
        }}
        whileTap={{
          y: 2,
          scale: 0.995
        }}
        transition={{ 
          type: "spring", 
          stiffness: 290, 
          damping: 28,
          mass: 1
        }}
      >
        {/* OS Horizon V4 Liquid Silk + Glass Hybrid Micro-Plate */}
        <div
          className="relative rounded-[23px] overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, rgba(115, 90, 200, 0.14) 0%, rgba(70, 55, 140, 0.18) 100%)',
            backdropFilter: 'blur(24px) saturate(165%)',
            WebkitBackdropFilter: 'blur(24px) saturate(165%)',
            border: '1px solid rgba(160, 120, 240, 0.16)',
            boxShadow: `
              inset 0 1.5px 0 rgba(255,255,255,0.06),
              inset 0 -1px 1px rgba(0,0,0,0.08),
              0 4px 16px rgba(0,0,0,0.16)
            `,
            padding: '24px 26px'
          }}
        >
          {/* Subsurface top gradient */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '45%',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%)',
            borderRadius: '23px 23px 0 0',
            pointerEvents: 'none'
          }} />

          {/* Glass highlight intensifies on hover */}
          <motion.div
            className="absolute inset-0 rounded-[23px] pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 50% 10%, rgba(180, 140, 255, 0.08) 0%, transparent 65%)'
            }}
            animate={{ 
              opacity: isHovered ? 0.12 : 0.06
            }}
            transition={{ duration: 0.18, ease: [0.26, 0.11, 0.26, 1.0] }}
          />

          {/* Inner-glass diagonal sheen */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.02) 45%, transparent 100%)',
              borderRadius: '23px'
            }}
            animate={{
              opacity: isHovered ? 0.08 : 0.04
            }}
            transition={{ duration: 0.16 }}
          />

          {/* Soft bloom on edges (Bloom.PurpleSoft +4% on hover) */}
          <motion.div
            className="absolute -inset-1 rounded-[24px] pointer-events-none blur-lg"
            style={{
              background: 'radial-gradient(ellipse at 50% 50%, rgba(160, 110, 235, 0.18) 0%, transparent 70%)'
            }}
            animate={{
              opacity: isHovered ? 0.22 : 0.08
            }}
            transition={{ duration: 0.18 }}
          />

          {/* Radial ripple on click */}
          <AnimatePresence>
            {showRipple && (
              <motion.div
                className="absolute pointer-events-none"
                style={{
                  left: ripplePos.x,
                  top: ripplePos.y,
                  transform: 'translate(-50%, -50%)',
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(160, 110, 255, 0.20) 0%, transparent 70%)'
                }}
                initial={{ scale: 0, opacity: 0.6 }}
                animate={{ scale: 2, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
              />
            )}
          </AnimatePresence>

          {/* Header Row */}
          <div className="flex items-center justify-between mb-3 relative z-10">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-4 h-4" style={{ color: 'rgba(200, 140, 255, 0.82)', strokeWidth: 2 }} />
              <h4 className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.94)', letterSpacing: '-0.005em' }}>
                {String(divergence?.topic || 'Unknown Topic')}
              </h4>
            </div>
            
            {/* OS Horizon Risk Capsule */}
            <div
              className="px-3.5 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wide relative overflow-hidden"
              style={{
                background: `linear-gradient(180deg, ${riskLevel.color}08, ${riskLevel.color}14)`,
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: `1px solid ${riskLevel.color}${riskLevel.label === 'Moderate' ? '28' : '32'}`,
                color: `${riskLevel.color}${riskLevel.label === 'Moderate' ? 'D9' : 'E5'}`,
                letterSpacing: '0.06em',
                boxShadow: `inset 0 0.5px 0 rgba(255,255,255,0.08)`
              }}
            >
              {/* Risk-level dot indicator */}
              <div style={{
                position: 'absolute',
                left: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: riskLevel.color,
                boxShadow: `0 0 6px ${riskLevel.color}${riskLevel.label === 'Moderate' ? '60' : '70'}`,
                pointerEvents: 'none'
              }} />
              <span style={{ marginLeft: '10px' }}>Risk: {riskLevel.label}</span>
            </div>
          </div>

          {/* Body - One-Line Explanation */}
          <p 
            className="text-sm relative z-10"
            style={{ 
              color: 'rgba(255,255,255,0.82)', 
              lineHeight: '1.52',
              fontWeight: 400,
              letterSpacing: '0.002em'
            }}
          >
            {contextCue}
          </p>

          {/* Metadata Footer - Fade In On Hover */}
          <motion.div
            className="flex items-center gap-5 mt-4 pt-3 border-t relative z-10"
            style={{ 
              borderColor: 'rgba(255,255,255,0.08)'
            }}
            animate={{ 
              opacity: isHovered ? 1 : 0,
              y: isHovered ? 0 : 4
            }}
            transition={{ duration: 0.18, ease: [0.26, 0.11, 0.26, 1.0] }}
          >
            <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.76)' }}>
              <BarChart2 className="w-3 h-3" strokeWidth={2} />
              <span className="font-medium">{confidence}% confidence</span>
            </div>
            <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.76)' }}>
              <Database className="w-3 h-3" strokeWidth={2} />
              <span className="font-medium">{sourceCount} sources</span>
            </div>
            <ExternalLink 
              className="w-3.5 h-3.5 ml-auto" 
              style={{ color: 'rgba(180, 120, 240, 0.72)' }}
              strokeWidth={2}
            />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function DivergenceReport({ divergences = [], onOpenDrawer }) {
  if (!Array.isArray(divergences) || divergences.length === 0) {
    return (
      <motion.div
        variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
        className="h-full rounded-[28px] p-8 backdrop-filter backdrop-blur-lg border flex flex-col items-center justify-center relative overflow-hidden"
        style={{ 
          background: 'linear-gradient(180deg, rgba(40, 38, 60, 0.28) 0%, rgba(18, 16, 28, 0.42) 100%)',
          borderColor: 'rgba(160, 120, 240, 0.12)',
          boxShadow: `
            0 12px 42px rgba(0,0,0,0.32),
            inset 0 1.5px 0 rgba(255,255,255,0.04)
          `
        }}
      >
        {/* Micro-grain texture */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          opacity: 0.012,
          mixBlendMode: 'overlay',
          borderRadius: '28px',
          pointerEvents: 'none'
        }} />

        <div className="text-center relative z-10">
          <div 
            className="p-3.5 rounded-[18px] mb-4 inline-block"
            style={{ 
              background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.32) 0%, rgba(0, 0, 0, 0.42) 100%)',
              border: '1px solid rgba(160, 120, 240, 0.14)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)'
            }}
          >
            <GitCommit className="w-5 h-5" style={{ color: 'rgba(180, 140, 255, 0.82)', strokeWidth: 2 }} />
          </div>
          <h3 className="text-sm font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.92)', letterSpacing: '0.01em' }}>
            No Divergences Detected
          </h3>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.72)', lineHeight: '1.4' }}>
            Consensus remains aligned across sources.
          </p>
        </div>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
      className="h-full rounded-[28px] relative overflow-hidden"
    >
      {/* OS Horizon V4 Atmospheric Background Integration */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, rgba(13, 15, 18, 0.04) 0%, rgba(21, 27, 34, 0.05) 100%)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      {/* Micro-grain texture (1.2%) */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        opacity: 0.012,
        mixBlendMode: 'overlay',
        borderRadius: '28px',
        zIndex: 1,
        pointerEvents: 'none'
      }} />

      {/* LAYER 1: Dark Liquid Silk Base */}
      <div
        className="relative"
        style={{
          background: 'linear-gradient(180deg, rgba(40, 38, 60, 0.35) 0%, rgba(18, 16, 28, 0.60) 100%)',
          backdropFilter: 'blur(32px) saturate(165%)',
          WebkitBackdropFilter: 'blur(32px) saturate(165%)',
          border: '1px solid rgba(160, 120, 240, 0.12)',
          boxShadow: `
            0 18px 58px rgba(0,0,0,0.45),
            0 0 40px rgba(120, 80, 255, 0.14),
            inset 0 1.5px 0 rgba(255,255,255,0.04)
          `,
          borderRadius: '28px',
          padding: '32px 28px 28px 28px',
          zIndex: 2
        }}
      >
        {/* LAYER 2: Light Glass Upper Shell (top 38%) */}
        <div
          className="absolute top-0 left-0 right-0 rounded-t-[26px] overflow-hidden"
          style={{
            height: '38%',
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0.06) 100%)',
            backdropFilter: 'blur(42px) saturate(170%)',
            WebkitBackdropFilter: 'blur(42px) saturate(170%)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderBottom: 'none',
            zIndex: 3,
            pointerEvents: 'none'
          }}
        >
          {/* Subsurface bloom along upper edge (Bloom.TopEdgeSoft) */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '10%',
            right: '10%',
            height: '3px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent)',
            filter: 'blur(1.5px)',
            pointerEvents: 'none'
          }} />
        </div>

        {/* Header Section */}
        <div className="flex items-start mb-6 relative z-10">
          <div 
            className="p-3 rounded-[18px] mr-3.5"
            style={{ 
              background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.32) 0%, rgba(0, 0, 0, 0.42) 100%)',
              border: '1px solid rgba(160, 120, 240, 0.16)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)'
            }}
          >
            <GitCommit className="w-5 h-5" style={{ color: 'rgba(180, 140, 255, 0.88)', strokeWidth: 2 }} />
          </div>
          <div>
            <h2 
              className="text-xl font-semibold mb-1"
              style={{ 
                color: 'rgba(255,255,255,0.96)',
                letterSpacing: '-0.01em'
              }}
            >
              Divergence Report
            </h2>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.70)', lineHeight: '1.4' }}>
              Where the consensus narrative fractures.
            </p>
          </div>
        </div>

        {/* Divergence Intensity Meter */}
        <DivergenceIntensityMeter divergences={divergences} />
        
        {/* Divergence Cards - OS Horizon spacing */}
        <div className="space-y-5 relative z-10">
          {divergences.slice(0, 3).map((divergence, index) => (
            <DivergenceCapsule
              key={divergence?.id || index}
              divergence={divergence}
              onClick={onOpenDrawer}
              index={index}
            />
          ))}
        </div>

        {divergences.length > 3 && (
          <motion.div
            className="text-center mt-7 pt-5 relative z-10"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-sm mb-2" style={{ color: 'rgba(255,255,255,0.76)', lineHeight: '1.4' }}>
              <span style={{ color: 'rgba(180, 140, 240, 0.92)', fontWeight: 600 }}>
                +{divergences.length - 3}
              </span> more fractures detected
            </p>
            <motion.button
              onClick={() => onOpenDrawer && onOpenDrawer(divergences[3])}
              className="text-xs font-medium"
              style={{ 
                color: 'rgba(180, 120, 240, 0.82)',
                letterSpacing: '0.02em'
              }}
              whileHover={{
                color: 'rgba(200, 140, 255, 0.94)',
                transition: { duration: 0.16 }
              }}
            >
              Explore full anomaly radar →
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}