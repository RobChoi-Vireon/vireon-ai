import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitCommit, AlertTriangle, ExternalLink, TrendingUp, TrendingDown, Minus, Database, BarChart2 } from 'lucide-react';

const DivergenceIntensityMeter = ({ divergences = [] }) => {
  const intensity = Math.min(5, Math.max(1, divergences.length));
  
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-2">
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
                      '0 0 3px rgba(168, 85, 247, 0.3)', 
                      '0 0 6px rgba(236, 72, 153, 0.4)', 
                      '0 0 3px rgba(168, 85, 247, 0.3)'
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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div
        onClick={handleClick}
        className="relative cursor-pointer group"
        whileHover={{ y: -2 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* OS Horizon Compact Card */}
        <div
          className="relative px-4 py-3.5 rounded-2xl border transition-all duration-300 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.08), rgba(236, 72, 153, 0.08))',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            border: '1px solid rgba(168, 85, 247, 0.18)',
            boxShadow: `
              inset 0 1px 0 rgba(255,255,255,0.06),
              0 0 16px rgba(168, 85, 247, 0.05),
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

          {/* Header Row */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4" style={{ color: '#C084FC' }} />
              <h4 className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.92)' }}>
                {String(divergence?.topic || 'Unknown Topic')}
              </h4>
            </div>
            
            {/* Risk Tag Chip */}
            <div
              className="px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wide"
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

          {/* Body - One-Line Explanation */}
          <p 
            className="text-sm"
            style={{ 
              color: 'rgba(255,255,255,0.75)', 
              lineHeight: '1.5',
              fontWeight: 400
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
      className="h-full rounded-2xl p-6 backdrop-filter backdrop-blur-md border"
      style={{ 
        background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
        borderColor: 'rgba(255,255,255,0.10)'
      }}
    >
      <div className="flex items-center mb-4">
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
      </div>

      {/* Divergence Intensity Meter */}
      <DivergenceIntensityMeter divergences={divergences} />
      
      {/* Divergence Cards - 12px vertical spacing */}
      <div className="space-y-3">
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
          className="text-center mt-6 pt-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
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