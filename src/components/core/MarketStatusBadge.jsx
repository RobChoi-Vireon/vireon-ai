import React from 'react';
import { motion } from 'framer-motion';
import { useMarketStatus } from './useMarketStatus';

const HORIZON_SPRING = { type: 'spring', stiffness: 320, damping: 82, mass: 1 };

export default function MarketStatusBadge() {
  const marketStatus = useMarketStatus();
  const { label, description, color, bg, border, dot, dotGlow } = marketStatus;

  return (
    <motion.div
      className="relative rounded-[20px] overflow-hidden"
      style={{
        padding: '12px 16px',
        background: bg,
        backdropFilter: 'blur(32px) saturate(168%)',
        WebkitBackdropFilter: 'blur(32px) saturate(168%)',
        border: `1px solid ${border}`,
        boxShadow: `
          inset 0 1.5px 0 rgba(255,255,255,0.20),
          inset 0 0 32px ${dotGlow.replace(/[\d.]+\)$/, '0.10)')},
          0 4px 16px rgba(0,0,0,0.12),
          0 0 34px ${dotGlow.replace(/[\d.]+\)$/, '0.08)')}
        `,
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Top specular */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '16%',
          right: '16%',
          height: '1.5px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.24), transparent)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />

      {/* Ambient glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at 50% 35%, ${dotGlow.replace(/[\d.]+\)$/, '0.08)')} 0%, transparent 72%)`,
          borderRadius: '20px',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex items-center gap-3">
        {/* Pulsing dot */}
        <div className="relative flex-shrink-0">
          <motion.div
            className="w-2.5 h-2.5 rounded-full relative"
            style={{
              background: `linear-gradient(135deg, ${color} 0%, ${color.replace(/[\d.]+\)$/, '0.95)')})`,
              boxShadow: `
                0 0 16px ${dotGlow},
                inset 0 1px 1px rgba(255,255,255,0.38),
                inset 0 -1px 2px rgba(0,0,0,0.22)
              `,
            }}
            animate={{
              boxShadow: [
                `0 0 16px ${dotGlow}, inset 0 1px 1px rgba(255,255,255,0.38), inset 0 -1px 2px rgba(0,0,0,0.22)`,
                `0 0 22px ${dotGlow}, inset 0 1px 1px rgba(255,255,255,0.38), inset 0 -1px 2px rgba(0,0,0,0.22)`,
                `0 0 16px ${dotGlow}, inset 0 1px 1px rgba(255,255,255,0.38), inset 0 -1px 2px rgba(0,0,0,0.22)`,
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div
              style={{
                position: 'absolute',
                top: '0.5px',
                left: '0.5px',
                width: '3.5px',
                height: '3.5px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.58)',
                filter: 'blur(0.5px)',
                pointerEvents: 'none',
              }}
            />
          </motion.div>

          <motion.div
            className="absolute inset-0 w-2.5 h-2.5 rounded-full"
            style={{
              background: color.replace(/[\d.]+\)$/, '0.30)'),
              boxShadow: `0 0 10px ${dotGlow}`,
            }}
            animate={{ scale: [1, 1.8, 1], opacity: [0.7, 0, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        {/* Text */}
        <div>
          <p className="text-xs font-semibold" style={{ color }}>
            {label}
          </p>
          <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.56)', marginTop: '1px' }}>
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}