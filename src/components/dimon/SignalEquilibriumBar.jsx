import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// ============================================================================
// SIGNAL EQUILIBRIUM BAR V2.1 - KINETIC DOT REFINEMENT (HORIZON OS)
// ============================================================================
// Beauty is the vessel; clarity is the cargo.
// This component teaches balance (Risk-Off ↔ Neutral ↔ Risk-On) and 
// communicates conviction (strength & volatility) in ≤3 seconds.
// v2.1: Apple-grade kinetic dot with glass aesthetics & adaptive color tinting

const TOKENS = {
  width: 120,
  height: 6,
  gradient: 'linear-gradient(90deg, #3BA7FF 0%, #9CA0A6 50%, #00FFB3 100%)',
  centerline: 'rgba(255,255,255,.15)',
  glow: 'rgba(255,255,255,.25)',
  axisLeft: 'rgba(59,167,255,.6)',
  axisRight: 'rgba(0,255,179,.6)',
  captionColor: 'rgba(255,255,255,.65)',
  captionSize: '12.5px',
  
  // Dot refinements
  dot: {
    baseSize: 12,
    riskOnTint: 'rgba(0,255,100,.20)',
    riskOffTint: 'rgba(255,50,50,.20)',
    neutralTint: 'rgba(255,255,255,.05)',
  }
};

const SignalEquilibriumBar = ({ 
  bias = 0,           // -1 to +1
  confidence = 75,    // 0 to 100
  volatility = 0.3,   // 0 to 1
  horizon = 'ST',     // ST, MT, LT
  zscore = null       // optional z-score
}) => {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldReduceMotion(mediaQuery.matches);
    const handler = (e) => setShouldReduceMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Clamp inputs
  const clampedBias = Math.max(-1, Math.min(1, bias));
  const clampedConfidence = Math.max(0, Math.min(100, confidence));
  const clampedVolatility = Math.max(0, Math.min(1, volatility));

  // Position calculation (0% = left, 100% = right)
  const xPercent = ((clampedBias + 1) / 2) * 100;

  // Damping increases with confidence (calmer settle)
  const damping = 18 + (clampedConfidence / 100) * 14; // 18-32 range

  // Jitter amplitude from volatility (subtle vertical oscillation)
  const jitterAmplitude = clampedVolatility * 1.5;

  // Adaptive dot tint based on bias
  const getDotTint = () => {
    const absBias = Math.abs(clampedBias);
    
    if (absBias < 0.15) {
      // Neutral zone
      return TOKENS.dot.neutralTint;
    } else if (clampedBias > 0.15) {
      // Risk-On bias
      return TOKENS.dot.riskOnTint;
    } else {
      // Risk-Off bias
      return TOKENS.dot.riskOffTint;
    }
  };

  // Label logic
  const getLabel = () => {
    const absBias = Math.abs(clampedBias);
    let prefix = '';
    let direction = 'Neutral';

    if (absBias >= 0.15) {
      direction = clampedBias < 0 ? 'Risk-Off' : 'Risk-On';
      
      if (absBias >= 0.7) {
        prefix = 'Strong ';
      } else if (absBias >= 0.45) {
        prefix = 'Moderate ';
      } else {
        prefix = 'Lean ';
      }
    }

    let label = `${prefix}${direction}`;
    
    if (zscore !== null && zscore !== undefined) {
      const zscoreStr = zscore >= 0 ? `+${zscore.toFixed(2)}σ` : `${zscore.toFixed(2)}σ`;
      label += ` (${zscoreStr})`;
    }

    return label;
  };

  const label = getLabel();

  // Accessibility label
  const getAriaLabel = () => {
    const absBias = Math.abs(clampedBias);
    const strengthText = absBias >= 0.7 ? 'strong' : absBias >= 0.45 ? 'moderate' : absBias >= 0.15 ? 'slight' : 'neutral';
    const directionText = clampedBias < -0.15 ? 'risk-off' : clampedBias > 0.15 ? 'risk-on' : 'neutral';
    const confText = clampedConfidence >= 80 ? 'high' : clampedConfidence >= 60 ? 'moderate' : 'low';
    
    return `Signal equilibrium indicator: ${strengthText} ${directionText} tilt with ${confText} confidence on a balanced risk scale.`;
  };

  const dotTint = getDotTint();

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-2">
        <span 
          className="text-xs font-medium uppercase tracking-wide" 
          style={{ color: TOKENS.captionColor }}
        >
          Signal Equilibrium
        </span>
      </div>
      
      {/* Bar Container */}
      <div 
        className="relative w-full mx-auto"
        style={{ maxWidth: `${TOKENS.width}px` }}
        role="img"
        aria-label={getAriaLabel()}
      >
        {/* Axis Labels */}
        <div className="flex items-center justify-between mb-1.5">
          <span 
            className="text-[11.5px] font-medium"
            style={{ color: TOKENS.axisLeft }}
          >
            Risk-Off
          </span>
          <span 
            className="text-[11.5px] font-medium"
            style={{ color: TOKENS.axisRight }}
          >
            Risk-On
          </span>
        </div>

        {/* The Bar */}
        <div 
          className="relative rounded-full overflow-visible"
          style={{
            width: '100%',
            height: `${TOKENS.height}px`,
            background: TOKENS.gradient,
            boxShadow: `inset 0 1px 1px rgba(255,255,255,0.10), 0 0 0 1px rgba(255,255,255,0.05)`
          }}
        >
          {/* Sheen Overlay */}
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
              backgroundSize: '200% 100%'
            }}
            animate={{
              backgroundPosition: shouldReduceMotion ? '0% 0%' : ['0% 0%', '200% 0%']
            }}
            transition={
              shouldReduceMotion 
                ? { duration: 0 }
                : {
                    duration: 8 / (1 + clampedVolatility * 0.3),
                    ease: 'linear',
                    repeat: Infinity
                  }
            }
          />

          {/* Center Line */}
          <div
            className="absolute top-0 bottom-0"
            style={{
              left: '50%',
              width: '1px',
              background: TOKENS.centerline,
              transform: 'translateX(-0.5px)'
            }}
            aria-hidden="true"
          />
          
          {/* Kinetic Glass Dot - v2.1 */}
          <motion.div
            className="absolute top-1/2"
            style={{ 
              left: `${xPercent}%`,
              transform: 'translateX(-50%) translateY(-50%)',
              transformOrigin: 'center center',
              pointerEvents: 'none',
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: 1,
              opacity: 1,
              y: shouldReduceMotion ? 0 : [0, -jitterAmplitude, 0, jitterAmplitude, 0]
            }}
            transition={
              shouldReduceMotion 
                ? { duration: 0.2 }
                : {
                    scale: { 
                      delay: 0.5, 
                      type: 'spring', 
                      stiffness: 220, 
                      damping: damping,
                      overshoot: 1.08
                    },
                    opacity: { delay: 0.5, duration: 0.2 },
                    y: {
                      duration: 1.2,
                      ease: 'easeInOut',
                      repeat: Infinity,
                      delay: 0.7
                    }
                  }
            }
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
          >
            {/* Outer Glow Layer (hover enhancement) */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                width: `${TOKENS.dot.baseSize}px`,
                height: `${TOKENS.dot.baseSize}px`,
                transform: 'translate(-50%, -50%)',
                left: '50%',
                top: '50%',
                boxShadow: '0 0 6px rgba(255,255,255,.25)',
                pointerEvents: 'none',
              }}
              animate={{
                boxShadow: isHovered 
                  ? '0 0 10px rgba(255,255,255,.35)'
                  : '0 0 6px rgba(255,255,255,.25)',
                scale: isHovered ? 1.12 : 1
              }}
              transition={{ 
                duration: 0.18, 
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            />

            {/* Core Glass Dot */}
            <motion.div
              style={{
                width: `${TOKENS.dot.baseSize}px`,
                height: `${TOKENS.dot.baseSize}px`,
                borderRadius: '50%',
                background: `radial-gradient(circle at 40% 40%, rgba(255,255,255,.95) 0%, rgba(255,255,255,.25) 60%, rgba(255,255,255,.05) 100%)`,
                boxShadow: `
                  0 0 6px rgba(255,255,255,.25),
                  inset 0 0 3px rgba(255,255,255,.2),
                  0 0 0 1px rgba(255,255,255,.08)
                `,
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
                position: 'relative',
                overflow: 'visible',
              }}
              animate={{
                scale: isHovered ? 1.12 : 1,
                opacity: shouldReduceMotion ? 1 : [0.85, 1, 0.85]
              }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : {
                      scale: { duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] },
                      opacity: { duration: 2.8, ease: 'easeInOut', repeat: Infinity }
                    }
              }
            >
              {/* Adaptive Color Tint Overlay */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: dotTint,
                  mixBlendMode: 'screen',
                  pointerEvents: 'none',
                }}
              />

              {/* Subsurface Glow (light passing through) */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,.12) 0%, transparent 60%)',
                  mixBlendMode: 'overlay',
                  pointerEvents: 'none',
                }}
              />
            </motion.div>
          </motion.div>

          {/* Focus Ring (a11y) */}
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              boxShadow: '0 0 0 2px rgba(255,255,255,0.14)',
              opacity: 0
            }}
            whileFocus={{ opacity: 1 }}
            aria-hidden="true"
          />
        </div>

        {/* Caption */}
        <div 
          className="text-center mt-1.5"
          style={{
            fontSize: TOKENS.captionSize,
            color: TOKENS.captionColor,
            fontWeight: 500
          }}
        >
          {horizon === 'ST' && 'Short-Term'}
          {horizon === 'MT' && 'Medium-Term'}
          {horizon === 'LT' && 'Long-Term'}
        </div>
      </div>
    </div>
  );
};

export default React.memo(SignalEquilibriumBar);