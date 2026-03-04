import React from 'react';
import { motion } from 'framer-motion';
import { useMarketStatus } from './useMarketStatus';

const HORIZON_SPRING = { type: 'spring', stiffness: 320, damping: 82, mass: 1 };

export default function MarketStatusBadge() {
  const marketStatus = useMarketStatus();
  const { label, color, dot, dotGlow } = marketStatus;

  return (
    <div className="flex items-center gap-2">
      {/* Pulsing dot */}
      <div className="relative flex-shrink-0">
        <motion.div
          className="w-2 h-2 rounded-full relative"
          style={{
            background: dot,
            boxShadow: `
              0 0 12px ${dotGlow},
              inset 0 0.5px 0.5px rgba(255,255,255,0.40)
            `,
          }}
          animate={{
            boxShadow: [
              `0 0 12px ${dotGlow}, inset 0 0.5px 0.5px rgba(255,255,255,0.40)`,
              `0 0 16px ${dotGlow}, inset 0 0.5px 0.5px rgba(255,255,255,0.40)`,
              `0 0 12px ${dotGlow}, inset 0 0.5px 0.5px rgba(255,255,255,0.40)`,
            ],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div
          className="absolute inset-0 w-2 h-2 rounded-full"
          style={{
            background: color.replace(/[\d.]+\)$/, '0.25)'),
            boxShadow: `0 0 8px ${dotGlow}`,
          }}
          animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Label */}
      <p className="text-sm font-medium" style={{ color }}>
        {label}
      </p>
    </div>
  );
}