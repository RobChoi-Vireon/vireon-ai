import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitCommit, AlertTriangle, ExternalLink, TrendingUp, TrendingDown, Minus, Database, BarChart2 } from 'lucide-react';

// OS Horizon Motion Tokens
const MOTION = {
  CURVES: {
    horizonIn: [0.22, 0.61, 0.36, 1],
    horizonOut: [0.4, 0.0, 0.2, 1]
  },
  DURATIONS: {
    fast: 0.12,
    base: 0.17
  }
};

const DivergenceIntensityMeter = ({ divergences = [] }) => {
  const intensity = Math.min(5, Math.max(1, divergences.length));
  
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-2.5">
        <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.70)' }}>
          Fracture Intensity
        </span>
        <div className="flex items-center gap-1.5">
          {[...Array(5)].map((_, level) => (
            <div key={level} className="w-3 h-1.5 rounded-full bg-white/10">
              {level < intensity && (
                <motion.div
                  className="w-full h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #A855F7, #EC4899)' }}
                  animate={{ 
                    opacity: [0.7, 1, 0.7],
                    boxShadow: [
                      '0 0 2px rgba(168, 85, 247, 0.25)', 
                      '0 0 4px rgba(236, 72, 153, 0.35)', 
                      '0 0 2px rgba(168, 85, 247, 0.25)'
                    ]
                  }}
                  transition={{ 
                    duration: 2.5,
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: level * 0.2
                  }}
                />
              )}
            </div>
          ))}
        </div>
        <span className="text-xs font-semibold text-purple-300">{intensity}/5</span>
      </div>
      
      {/* Micro descriptor */}
      <p className="text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.70)', letterSpacing: '0.01em' }}>
        Degree of narrative disagreement
      </p>
    </div>
  );
};

const DivergenceCapsule = ({ divergence, onClick, index }) => {
  const [isHovered, setIsHovered] = useState(false);

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

  const handleClick = () => {
    try {
      if (divergence && onClick) {
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
      transition={{ 
        delay: index * 0.02, 
        duration: MOTION.DURATIONS.base, 
        ease: MOTION.CURVES.horizonIn 
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div
        onClick={handleClick}
        className="relative cursor-pointer group"
        whileHover={{ 
          y: -2,
          scale: 1.01,
          transition: { duration: MOTION.DURATIONS.fast }
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{
          // Horizontal inset: 16-24px from container edge
          marginLeft: '20px',
          marginRight: '20px'
        }}
      >
        {/* OS Horizon Compact Card - Floating Design */}
        <div
          className="relative rounded-2xl border transition-all duration-300 overflow-hidden"
          style={{
            // Row card inset and floating effect
            paddingTop: '14px',
            paddingBottom: '14px',
            paddingLeft: '16px',
            paddingRight: '16px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.10), rgba(236, 72, 153, 0.12))',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            border: '1px solid rgba(168, 85, 247, 0.18)',
            boxShadow: `
              inset 0 1px 0 rgba(255,255,255,0.06),
              0 0 12px rgba(168, 85, 247, 0.05),
              0 4px 12px rgba(0,0,0,0.15)
            `
          }}
        >
          {/* Ambient Purple Glow */}
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 50% 0%, rgba(168, 85, 247, 0.12) 0%, transparent 60%)',
              opacity: 0
            }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Header Row - Icon + Title + Risk Pill */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              {/* Warning Icon (scaled down 15-20%, purple outer glow) */}
              <div className="relative">
                <AlertTriangle className="w-3.5 h-3.5" style={{ color: '#C084FC' }} />
                <div 
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `radial-gradient(circle, rgba(168, 85, 247, 0.08), transparent 70%)`,
                    filter: 'blur(4px)',
                    transform: 'scale(2.5)',
                    pointerEvents: 'none'
                  }}
                />
              </div>
              
              {/* Title (medium weight, full opacity) */}
              <h4 className="text-sm font-medium" style={{ color: 'rgba(255,255,255,1.0)' }}>
                {String(divergence?.topic || 'Unknown Topic')}
              </h4>
            </div>
            
            {/* Risk Tag Chip (vertically centered, reduced padding 10%) */}
            <div
              className="px-2 py-0.5 rounded-lg text-[10px] font-semibold uppercase tracking-wide flex items-center"
              style={{
                background: `${riskLevel.color}15`,
                border: `1px solid ${riskLevel.color}40`,
                color: riskLevel.color,
                letterSpacing: '0.05em'
              }}
            >
              Risk: {riskLevel.label}
            </div>
          </div>

          {/* Body - One-Line Explanation (75% opacity, smaller font) */}
          <p 
            className="text-[13px]"
            style={{ 
              color: 'rgba(255,255,255,0.75)', 
              lineHeight: '1.5',
              fontWeight: 400,
              marginTop: '6px'
            }}
          >
            {contextCue}
          </p>

          {/* Metadata Footer - Fade In On Hover */}
          <motion.div
            className="flex items-center gap-4 mt-3 pt-2 border-t"
            style={{ 
              borderColor: 'rgba(255,255,255,0.06)',
              opacity: 0
            }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(255,255,255,0.70)' }}>
              <BarChart2 className="w-3 h-3" />
              <span>{confidence}% confidence</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(255,255,255,0.70)' }}>
              <Database className="w-3 h-3" />
              <span>{sourceCount} sources</span>
            </div>
            <ExternalLink className="w-3 h-3 ml-auto" style={{ color: 'rgba(168, 85, 247, 0.70)' }} />
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
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        className="h-full rounded-2xl p-6 backdrop-filter backdrop-blur-md border flex flex-col items-center justify-center"
        style={{ 
          background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
          borderColor: 'rgba(255,255,255,0.10)'
        }}
      >
        <div className="text-center">
          <div className="p-3 rounded-xl mb-3 inline-block" style={{ background: 'rgba(0,0,0,0.30)', border: '1px solid rgba(255,255,255,0.10)' }}>
            <GitCommit className="w-5 h-5 text-purple-300" />
          </div>
          <h3 className="text-sm font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.88)' }}>
            No Divergences Detected
          </h3>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.70)' }}>
            Consensus remains aligned across sources.
          </p>
        </div>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      className="h-full rounded-2xl backdrop-filter backdrop-blur-md border"
      style={{ 
        background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
        borderColor: 'rgba(255,255,255,0.10)',
        paddingTop: '24px',
        paddingBottom: '24px',
        paddingLeft: '24px',
        paddingRight: '24px'
      }}
    >
      {/* Header Block (subtle fade-in + hover shimmer) */}
      <motion.div 
        className="flex items-center mb-5 relative"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.14, ease: MOTION.CURVES.horizonIn }}
      >
        {/* Hover Shimmer Effect (4-6% intensity) */}
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)',
            opacity: 0
          }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        
        <div className="p-2.5 rounded-xl mr-3" style={{ background: 'rgba(0,0,0,0.30)', border: '1px solid rgba(255,255,255,0.10)' }}>
          <GitCommit className="w-5 h-5 text-purple-300" />
        </div>
        <div>
          <h2 className="text-lg font-semibold" style={{ color: 'rgba(255,255,255,0.95)' }}>
            Divergence Report
          </h2>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.70)' }}>
            Where the consensus narrative fractures.
          </p>
        </div>
      </motion.div>

      {/* Divergence Intensity Meter */}
      <DivergenceIntensityMeter divergences={divergences} />
      
      {/* Divergence Cards - 16px vertical spacing (14-18px range) */}
      <div className="space-y-4">
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
          className="text-center pt-4"
          style={{ 
            borderTop: '1px solid rgba(255,255,255,0.05)',
            marginTop: '24px'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.70)' }}>
            <span className="text-purple-300 font-semibold">+{divergences.length - 3}</span> more fractures detected
          </p>
          <button
            onClick={() => onOpenDrawer && onOpenDrawer(divergences[3])}
            className="text-xs font-medium transition-colors mt-1"
            style={{ 
              color: 'rgba(168, 85, 247, 0.85)',
              letterSpacing: '0.01em'
            }}
          >
            Explore full anomaly radar →
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}