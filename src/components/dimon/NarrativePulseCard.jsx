import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const HORIZON_EASE = [0.26, 0.11, 0.26, 1.0];

const POSITIONING_STATES = {
  'under_owned': {
    label: 'Under-owned',
    color: 'rgba(100,165,255,0.76)',
    bg: 'rgba(100,165,255,0.09)',
    border: 'rgba(100,165,255,0.16)',
    tooltip: 'Market positioning appears light relative to the dominant narrative'
  },
  'neutral': {
    label: 'Neutral',
    color: 'rgba(255,255,255,0.56)',
    bg: 'rgba(255,255,255,0.05)',
    border: 'rgba(255,255,255,0.10)',
    tooltip: 'Market positioning is balanced relative to the dominant narrative'
  },
  'crowded': {
    label: 'Crowded',
    color: 'rgba(255,180,80,0.76)',
    bg: 'rgba(255,180,80,0.09)',
    border: 'rgba(255,180,80,0.16)',
    tooltip: 'Market positioning appears heavy relative to the dominant narrative'
  }
};

export default function NarrativePulseCard({ summary = null, isEmpty = false }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);

  const placeholderText = "Markets show strong consensus around increasing regulatory pressure on large tech firms, while investors remain divided on emerging market credit stress and the global growth outlook.";
  const displayText = summary || placeholderText;
  const showViewButton = displayText.length > 140;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1, ease: HORIZON_EASE }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="mb-5"
    >
      {/* Glass card container */}
      <motion.div
        animate={{
          y: hovered ? -2 : 0,
          boxShadow: hovered
            ? [
                'inset 0 1.5px 0 rgba(255,255,255,0.14)',
                'inset 0 -1px 0 rgba(0,0,0,0.14)',
                'inset 1px 0 0 rgba(255,255,255,0.08)',
                '0 8px 32px rgba(0,0,0,0.20)',
                '0 0 40px rgba(100,170,255,0.08)',
              ].join(', ')
            : [
                'inset 0 1.5px 0 rgba(255,255,255,0.10)',
                'inset 0 -1px 0 rgba(0,0,0,0.10)',
                'inset 1px 0 0 rgba(255,255,255,0.05)',
                '0 4px 16px rgba(0,0,0,0.12)',
              ].join(', ')
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        style={{
          borderRadius: '20px',
          background: 'linear-gradient(160deg, rgba(255,255,255,0.066) 0%, rgba(255,255,255,0.032) 55%, rgba(255,255,255,0.044) 100%)',
          backdropFilter: 'blur(52px) saturate(175%) brightness(1.05)',
          WebkitBackdropFilter: 'blur(52px) saturate(175%) brightness(1.05)',
          border: '1px solid rgba(255,255,255,0.11)',
          padding: '16px 18px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Top specular highlight */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '8%',
            right: '8%',
            height: '1px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 35%, rgba(255,255,255,0.14) 50%, rgba(255,255,255,0.12) 65%, transparent 100%)',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />

        {/* Subsurface glow */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '100px',
            background: 'radial-gradient(ellipse at 50% -10%, rgba(100,170,255,0.06) 0%, transparent 65%)',
            pointerEvents: 'none',
            zIndex: 0,
            borderRadius: '20px',
          }}
        />

        {/* Content */}
        <div className="relative z-10">
          {isEmpty ? (
            <>
              <h3 className="text-[13px] font-semibold mb-2.5" style={{ color: 'rgba(255,255,255,0.88)' }}>
                Narrative Pulse
              </h3>
              <p className="text-[12px] leading-[1.5]" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Briefing will appear once narrative signals are detected.
              </p>
            </>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="text-[13px] font-semibold" style={{ color: 'rgba(255,255,255,0.88)' }}>
                  Narrative Pulse
                </h3>
                <span className="text-[10px] whitespace-nowrap flex-shrink-0" style={{ color: 'rgba(255,255,255,0.32)' }}>
                  Updated: —
                </span>
              </div>

              {/* Summary text */}
              <motion.div
                animate={{ height: isExpanded ? 'auto' : '56px' }}
                transition={{ duration: 0.2, ease: HORIZON_EASE }}
                style={{ overflow: 'hidden' }}
              >
                <p
                  className="text-[12px] leading-[1.6] font-medium"
                  style={{
                    color: 'rgba(255,255,255,0.78)',
                    display: isExpanded ? 'block' : '-webkit-box',
                    WebkitLineClamp: isExpanded ? 'unset' : 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {displayText}
                </p>
              </motion.div>

              {/* Expand/collapse button */}
              {showViewButton && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-[11px] font-semibold mt-2 transition-colors duration-150"
                  style={{
                    color: 'rgba(100,165,255,0.76)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(100,165,255,0.92)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(100,165,255,0.76)')}
                >
                  <span>{isExpanded ? 'Show less' : 'Show more'}</span>
                </button>
              )}

              {/* Footer pills */}
              <div className="flex gap-2.5 mt-3.5 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="text-[10px] px-2.5 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.48)' }}>
                  Consensus: —
                </span>
                <span className="text-[10px] px-2.5 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.48)' }}>
                  Divergence: —
                </span>
                <span className="text-[10px] px-2.5 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.48)' }}>
                  Momentum: —
                </span>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}