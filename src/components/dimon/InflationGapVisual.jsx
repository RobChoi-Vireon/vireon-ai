import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HORIZON_EASE = [0.26, 0.11, 0.26, 1.0];

export default function InflationGapVisual({ cpi, pce, insight }) {
  const [isHovered, setIsHovered] = useState(false);

  // Calculate positions based on gap (normalized 0-5% range for visual spacing)
  const gap = Math.abs((cpi || 0) - (pce || 0));
  const maxGap = 2.0; // Max expected gap for scaling
  const normalizedGap = Math.min(gap / maxGap, 1) * 60; // Max 60px separation

  const cpiHigher = (cpi || 0) > (pce || 0);
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: HORIZON_EASE }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex items-center justify-center rounded-3xl overflow-hidden cursor-pointer"
      style={{
        padding: '48px',
        minHeight: '280px',
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.045) 0%, rgba(255, 255, 255, 0.028) 100%)',
        backdropFilter: 'blur(56px) saturate(180%)',
        WebkitBackdropFilter: 'blur(56px) saturate(180%)',
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.12), 0 12px 48px rgba(0,0,0,0.15)'
      }}
    >
      {/* Top specular highlight */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '20%',
        right: '20%',
        height: '2px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)',
        pointerEvents: 'none'
      }} />

      {/* Ambient glow */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 50% 50%, rgba(110, 180, 255, 0.08) 0%, transparent 60%)',
        opacity: isHovered ? 1 : 0.6,
        transition: 'opacity 0.4s ease',
        pointerEvents: 'none'
      }} />

      {/* Main visual container */}
      <div className="relative flex items-center justify-center" style={{ width: '100%', height: '160px' }}>
        
        {/* Connection line */}
        <motion.div
          animate={{
            opacity: isHovered ? 0.4 : 0.2,
            scale: isHovered ? 1 : 0.95
          }}
          transition={{ duration: 0.5, ease: HORIZON_EASE }}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: `${normalizedGap + 80}px`,
            height: '2px',
            background: 'linear-gradient(90deg, rgba(255,106,122,0.4), rgba(168,179,199,0.3), rgba(88,227,164,0.4))',
            borderRadius: '2px'
          }}
        />

        {/* CPI Orb */}
        <motion.div
          animate={{
            x: cpiHigher ? normalizedGap / 2 : -normalizedGap / 2,
            scale: [1, 1.02, 1],
          }}
          transition={{
            x: { duration: 0.6, ease: HORIZON_EASE },
            scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <motion.div
            whileHover={{ scale: 1.15 }}
            className="relative"
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(255, 140, 140, 0.45) 0%, rgba(255, 106, 122, 0.38) 100%)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1.5px solid rgba(255, 140, 140, 0.35)',
              boxShadow: `
                0 0 32px rgba(255, 106, 122, ${isHovered ? '0.5' : '0.3'}),
                inset 0 2px 4px rgba(255,255,255,0.2),
                inset 0 -2px 6px rgba(0,0,0,0.15)
              `,
              transition: 'box-shadow 0.4s ease'
            }}
          >
            {/* Inner highlight */}
            <div style={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.3)',
              filter: 'blur(6px)',
              pointerEvents: 'none'
            }} />
            
            {/* Label */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.3, ease: HORIZON_EASE }}
                  className="absolute left-1/2 -bottom-8 transform -translate-x-1/2 whitespace-nowrap"
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: 'rgba(255,255,255,0.90)',
                    textShadow: '0 2px 8px rgba(0,0,0,0.4)'
                  }}
                >
                  CPI {cpi}%
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* PCE Orb */}
        <motion.div
          animate={{
            x: cpiHigher ? -normalizedGap / 2 : normalizedGap / 2,
            scale: [1, 1.02, 1],
          }}
          transition={{
            x: { duration: 0.6, ease: HORIZON_EASE },
            scale: { duration: 3.3, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <motion.div
            whileHover={{ scale: 1.15 }}
            className="relative"
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(88, 227, 164, 0.45) 0%, rgba(64, 200, 145, 0.38) 100%)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1.5px solid rgba(88, 227, 164, 0.35)',
              boxShadow: `
                0 0 32px rgba(88, 227, 164, ${isHovered ? '0.5' : '0.3'}),
                inset 0 2px 4px rgba(255,255,255,0.2),
                inset 0 -2px 6px rgba(0,0,0,0.15)
              `,
              transition: 'box-shadow 0.4s ease'
            }}
          >
            {/* Inner highlight */}
            <div style={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.3)',
              filter: 'blur(6px)',
              pointerEvents: 'none'
            }} />

            {/* Label */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.3, ease: HORIZON_EASE }}
                  className="absolute left-1/2 -bottom-8 transform -translate-x-1/2 whitespace-nowrap"
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: 'rgba(255,255,255,0.90)',
                    textShadow: '0 2px 8px rgba(0,0,0,0.4)'
                  }}
                >
                  PCE {pce}%
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>

      {/* Insight text on hover */}
      <AnimatePresence>
        {isHovered && insight && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4, ease: HORIZON_EASE }}
            className="absolute bottom-6 left-8 right-8 text-center"
          >
            <p className="text-sm font-medium leading-relaxed" style={{ 
              color: 'rgba(255,255,255,0.80)',
              textShadow: '0 2px 12px rgba(0,0,0,0.5)'
            }}>
              {insight}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}