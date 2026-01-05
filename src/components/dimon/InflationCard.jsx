// 🔒 DESIGN LOCKED — OS HORIZON V4.0
// Inflation Section - CEP Engine Enforced
// C: User understands state in <3s | E: CPI/PCE values + source | P: Policy bias + market cues

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

export default function InflationCard({ data, index = 0 }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Safe data access with defaults
  const cpiYoy = data?.cpi_yoy ?? 3.2;
  const cpiCoreYoy = data?.cpi_core_yoy ?? 3.8;
  const pceYoy = data?.pce_yoy ?? 2.8;
  const pceCoreYoy = data?.pce_core_yoy ?? 3.1;
  const stateTag = data?.state_tag || 'Mixed';
  const policyBias = data?.policy_bias || 'Neutral';
  const lastUpdated = data?.last_updated || 'Dec 2025';
  const interpretation = data?.interpretation || 'Inflation moderating but core measures remain elevated';
  const marketImplications = data?.market_implications || ['Rates', 'Equities', 'Credit'];

  // Determine state color
  const getStateColor = () => {
    switch (stateTag) {
      case 'Cooling': return { bg: 'rgba(88, 227, 164, 0.08)', text: '#58E3A4', border: 'rgba(88, 227, 164, 0.15)' };
      case 'Sticky': return { bg: 'rgba(255, 199, 114, 0.08)', text: '#FFC772', border: 'rgba(255, 199, 114, 0.15)' };
      case 'Re-accelerating': return { bg: 'rgba(255, 106, 122, 0.08)', text: '#FF6A7A', border: 'rgba(255, 106, 122, 0.15)' };
      default: return { bg: 'rgba(168, 179, 199, 0.08)', text: '#A8B3C7', border: 'rgba(168, 179, 199, 0.15)' };
    }
  };

  const getPolicyColor = () => {
    switch (policyBias) {
      case 'Dovish': return { bg: 'rgba(88, 227, 164, 0.06)', text: '#58E3A4' };
      case 'Hawkish': return { bg: 'rgba(255, 106, 122, 0.06)', text: '#FF6A7A' };
      default: return { bg: 'rgba(168, 179, 199, 0.06)', text: '#A8B3C7' };
    }
  };

  const stateColor = getStateColor();
  const policyColor = getPolicyColor();

  // Determine CPI vs PCE comparison
  const getComparison = () => {
    const diff = cpiYoy - pceYoy;
    if (Math.abs(diff) < 0.3) return { text: 'Tracking', icon: Activity, color: '#A8B3C7' };
    if (diff > 0) return { text: 'CPI above PCE', icon: TrendingUp, color: '#FFC772' };
    return { text: 'PCE above CPI', icon: TrendingDown, color: '#6AC7F7' };
  };

  const comparison = getComparison();

  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.46,
        delay: index * 0.08,
        ease: [0.22, 0.61, 0.36, 1]
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{ willChange: 'transform, filter' }}
    >
      {/* OS Horizon Liquid-Glass Panel */}
      <motion.div
        className="relative rounded-[28px] backdrop-blur-xl overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.095) 0%, rgba(255, 255, 255, 0.082) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.11)',
          boxShadow: `
            0 ${isPressed ? 8 : 20}px ${isPressed ? 32 : 44}px -8px rgba(0, 0, 0, ${isPressed ? '0.24' : '0.28'}),
            inset 0 1.5px 0 rgba(255,255,255,0.07),
            inset 0 -1px 1px rgba(0,0,0,0.03)
          `,
          minHeight: '220px',
          padding: '26px 28px',
          transformStyle: 'preserve-3d',
          perspective: '1200px'
        }}
        animate={{
          y: isPressed ? 2 : (isHovered ? -2 : 0),
          scale: isPressed ? 0.99 : (isHovered ? 1.01 : 1),
          background: isPressed 
            ? 'linear-gradient(145deg, rgba(255, 255, 255, 0.072) 0%, rgba(255, 255, 255, 0.058) 100%)'
            : (isHovered 
              ? 'linear-gradient(145deg, rgba(255, 255, 255, 0.108) 0%, rgba(255, 255, 255, 0.092) 100%)'
              : 'linear-gradient(145deg, rgba(255, 255, 255, 0.095) 0%, rgba(255, 255, 255, 0.082) 100%)'),
          boxShadow: isPressed
            ? '0 8px 32px -8px rgba(0, 0, 0, 0.24), inset 0 2px 4px rgba(0,0,0,0.10)'
            : (isHovered
              ? '0 26px 52px -8px rgba(0, 0, 0, 0.34), 0 0 26px rgba(86, 156, 235, 0.12), inset 0 1.5px 0 rgba(255,255,255,0.09)'
              : '0 20px 44px -8px rgba(0, 0, 0, 0.28), inset 0 1.5px 0 rgba(255,255,255,0.07)')
        }}
        transition={{
          type: "spring",
          stiffness: 290,
          damping: 28,
          mass: 1
        }}
      >
        {/* Micro-grain texture */}
        <div 
          className="absolute inset-0 opacity-[0.012] pointer-events-none"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
            mixBlendMode: 'overlay',
            borderRadius: '28px'
          }}
        />

        {/* Subsurface lighting */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 22% 18%, rgba(255, 255, 255, 0.10) 0%, rgba(0, 0, 0, 0.007) 100%)',
            borderRadius: '28px'
          }}
        />

        {/* Content */}
        <div className="relative z-10">
          {/* Header Row */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <h3 
                className="font-semibold"
                style={{
                  fontSize: '18px',
                  color: 'rgba(255, 255, 255, 0.95)',
                  letterSpacing: '-0.01em'
                }}
              >
                Inflation
              </h3>
              <div
                className="px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider"
                style={{
                  background: stateColor.bg,
                  border: `1px solid ${stateColor.border}`,
                  color: stateColor.text,
                  letterSpacing: '0.06em'
                }}
              >
                {stateTag}
              </div>
            </div>
            <span 
              className="text-[10px] font-medium"
              style={{ color: 'rgba(255, 255, 255, 0.48)' }}
            >
              {lastUpdated}
            </span>
          </div>

          {/* 1) Snapshot - 4 KPI chips */}
          <div className="grid grid-cols-2 gap-2.5 mb-4">
            {[
              { label: 'CPI', value: cpiYoy },
              { label: 'Core CPI', value: cpiCoreYoy },
              { label: 'PCE', value: pceYoy },
              { label: 'Core PCE', value: pceCoreYoy }
            ].map((metric, i) => (
              <div
                key={i}
                className="px-3 py-2 rounded-xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.06)'
                }}
              >
                <div 
                  className="text-[10px] font-semibold mb-1"
                  style={{ color: 'rgba(255, 255, 255, 0.62)' }}
                >
                  {metric.label}
                </div>
                <div 
                  className="text-lg font-bold"
                  style={{ color: 'rgba(255, 255, 255, 0.96)' }}
                >
                  {metric.value}%
                </div>
              </div>
            ))}
          </div>

          {/* 2) Compare - Single divergence line */}
          <div 
            className="flex items-center gap-2 px-3 py-2 rounded-xl mb-4"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}
          >
            <comparison.icon 
              className="w-3.5 h-3.5"
              style={{ color: comparison.color }}
            />
            <span 
              className="text-xs font-medium"
              style={{ color: 'rgba(255, 255, 255, 0.78)' }}
            >
              {comparison.text}
            </span>
          </div>

          {/* 3) Meaning - Compact synthesis */}
          <p
            className="text-xs leading-relaxed mb-4"
            style={{
              color: 'rgba(255, 255, 255, 0.72)',
              lineHeight: '1.5'
            }}
          >
            {interpretation}
          </p>

          {/* 4) Implications - Pill strip */}
          <div className="flex items-center gap-2 flex-wrap">
            {marketImplications.map((imp, i) => (
              <div
                key={i}
                className="px-2 py-1 rounded-full text-[9px] font-semibold"
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  color: 'rgba(255, 255, 255, 0.64)'
                }}
              >
                {imp}
              </div>
            ))}
            <div
              className="px-2 py-1 rounded-full text-[9px] font-semibold ml-auto"
              style={{
                background: policyColor.bg,
                color: policyColor.text
              }}
            >
              Fed: {policyBias}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}