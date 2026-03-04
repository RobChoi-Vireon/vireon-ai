import React from 'react';
import { motion } from 'framer-motion';

const BAR_COUNT = 12;

// Map bar_color string to actual CSS color
const BAR_COLOR_MAP = {
  green: '#32C288',
  yellow: '#FFB020',
  red: '#F26A6A',
  gray: 'rgba(255,255,255,0.45)',
};

export default function MarketBiasBadge({
  sentimentScore = 50,
  isLoaded = true,
  tone = null,
  barLevel = null,
  barColor = null,
}) {
  // Resolve bar color
  const resolvedBarColor = BAR_COLOR_MAP[barColor] || '#32C288';

  // Resolve active bar count: use live barLevel (1-10 scaled to 12 bars), else derive from score
  const activeBars = barLevel != null
    ? Math.round((barLevel / 10) * BAR_COUNT)
    : sentimentScore <= 35
      ? Math.round(BAR_COUNT * 0.75)
      : sentimentScore >= 65
        ? Math.round(BAR_COUNT * 0.35)
        : Math.round(BAR_COUNT * 0.55);

  // Resolve label: use live tone, else derive from score
  const label = tone || (
    sentimentScore <= 35 ? 'Bullish Sentiment' :
    sentimentScore >= 65 ? 'Bearish Sentiment' :
    'Upbeat Sentiment'
  );

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
                background: active ? resolvedBarColor : 'rgba(255,255,255,0.25)',
                transformOrigin: 'bottom',
                boxShadow: active ? `0 0 4px ${resolvedBarColor}60` : 'none'
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