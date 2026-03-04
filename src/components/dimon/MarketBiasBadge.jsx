import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const BAR_COUNT = 12;

export default function MarketBiasBadge({ sentimentScore = 50, isLoaded = true }) {
  // sentimentScore: 0 = full bullish, 100 = full bearish
  const isBullish = sentimentScore <= 35;
  const isBearish = sentimentScore >= 65;

  const label = isBullish ? 'Bullish Sentiment' : isBearish ? 'Bearish Sentiment' : 'Upbeat Sentiment';
  const color = isBullish ? '#32C288' : isBearish ? '#F26A6A' : '#32C288';

  // How many bars are "active" (filled), based on score
  // Bullish: more active bars. Bearish: fewer. Neutral: half.
  const activeBars = isBullish
    ? Math.round(BAR_COUNT * 0.75)
    : isBearish
    ? Math.round(BAR_COUNT * 0.35)
    : Math.round(BAR_COUNT * 0.55);

  // Heights: vary slightly for a natural waveform look
  const barHeights = [10, 14, 18, 16, 20, 18, 14, 16, 12, 16, 14, 10];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoaded ? 1 : 0 }}
      transition={{ duration: 0.32, delay: 1.5, ease: [0.22, 0.61, 0.36, 1] }}
      className="flex items-center gap-3"
    >
      {/* Bar chart */}
      <div className="flex items-end gap-[3px]" style={{ height: '22px' }}>
        {barHeights.map((h, i) => {
          const active = i < activeBars;
          return (
            <motion.div
              key={i}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: active ? 1 : 0.2 }}
              transition={{
                delay: 1.5 + i * 0.04,
                duration: 0.28,
                ease: [0.22, 0.61, 0.36, 1]
              }}
              style={{
                width: '3px',
                height: `${h}px`,
                borderRadius: '2px',
                background: active ? color : 'rgba(255,255,255,0.25)',
                transformOrigin: 'bottom',
                boxShadow: active ? `0 0 4px ${color}60` : 'none'
              }}
            />
          );
        })}
      </div>

      {/* Label */}
      <motion.span
        initial={{ opacity: 0, x: -4 }}
        animate={{ opacity: isLoaded ? 1 : 0, x: isLoaded ? 0 : -4 }}
        transition={{ duration: 0.28, delay: 1.7, ease: [0.22, 0.61, 0.36, 1] }}
        style={{
          fontSize: '15px',
          fontWeight: 600,
          color: 'rgba(255,255,255,0.88)',
          letterSpacing: '-0.01em'
        }}
      >
        {label}
      </motion.span>
    </motion.div>
  );
}