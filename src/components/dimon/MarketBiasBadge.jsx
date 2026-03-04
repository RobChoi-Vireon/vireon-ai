import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function MarketBiasBadge({ sentimentScore = 50, isLoaded = true }) {
  const [breathe, setBreathe] = useState(0);

  useEffect(() => {
    let rafId, start = Date.now();
    const animate = () => {
      setBreathe((Date.now() - start) / 1000);
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Derive bias from score: 0 = full bullish, 100 = full bearish
  const isBullish = sentimentScore <= 35;
  const isBearish = sentimentScore >= 65;
  const isNeutral = !isBullish && !isBearish;

  const config = isBullish
    ? {
        label: 'Bullish',
        sublabel: 'Risk-On Bias',
        Icon: TrendingUp,
        color: '#32C288',
        glow: 'rgba(50, 194, 136, 0.28)',
        bg: 'rgba(50, 194, 136, 0.08)',
        border: 'rgba(50, 194, 136, 0.22)',
        dotColor: '#32C288',
      }
    : isBearish
    ? {
        label: 'Bearish',
        sublabel: 'Risk-Off Bias',
        Icon: TrendingDown,
        color: '#F26A6A',
        glow: 'rgba(242, 106, 106, 0.28)',
        bg: 'rgba(242, 106, 106, 0.08)',
        border: 'rgba(242, 106, 106, 0.22)',
        dotColor: '#F26A6A',
      }
    : {
        label: 'Neutral',
        sublabel: 'Mixed Signals',
        Icon: Minus,
        color: '#8EBBFF',
        glow: 'rgba(142, 187, 255, 0.22)',
        bg: 'rgba(142, 187, 255, 0.07)',
        border: 'rgba(142, 187, 255, 0.18)',
        dotColor: '#8EBBFF',
      };

  const pulseScale = 1 + Math.sin(breathe * Math.PI * 2 / 3) * 0.025;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 6 }}
      animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.92, y: isLoaded ? 0 : 6 }}
      transition={{ duration: 0.32, delay: 1.5, ease: [0.22, 0.61, 0.36, 1] }}
      className="flex items-center gap-3 px-4 py-3 rounded-[20px] relative overflow-hidden"
      style={{
        background: config.bg,
        border: `1px solid ${config.border}`,
        boxShadow: `0 0 22px ${config.glow}, inset 0 1px 0 rgba(255,255,255,0.07)`,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        minWidth: '170px'
      }}
    >
      {/* Ambient glow */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(ellipse at 30% 50%, ${config.bg} 0%, transparent 70%)`,
        pointerEvents: 'none',
        borderRadius: '20px'
      }} />

      {/* Pulsing dot */}
      <div className="relative flex-shrink-0">
        <motion.div
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: config.dotColor,
            boxShadow: `0 0 12px ${config.glow}`,
            scale: pulseScale
          }}
        />
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ background: config.dotColor, opacity: 0 }}
          animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Icon */}
      <config.Icon
        className="w-4 h-4 flex-shrink-0 relative z-10"
        style={{ color: config.color, strokeWidth: 2.5 }}
      />

      {/* Text */}
      <div className="relative z-10">
        <div className="text-[13px] font-semibold leading-none mb-0.5" style={{ color: config.color }}>
          {config.label}
        </div>
        <div className="text-[10px] font-medium" style={{ color: 'rgba(255,255,255,0.52)', letterSpacing: '0.02em' }}>
          {config.sublabel}
        </div>
      </div>
    </motion.div>
  );
}