import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, GitCommit, Globe, TrendingUp, TrendingDown, Minus } from 'lucide-react';

// OS Horizon V4 animation curves
const HORIZON_EASE = [0.26, 0.11, 0.26, 1.0];
const HORIZON_SPRING = { type: "spring", stiffness: 320, damping: 32, mass: 1 };
const HORIZON_REBOUND = [0.25, 0.8, 0.25, 1];

const ConfidenceArc = ({ confidence, color, isHovered }) => {
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (confidence / 100) * circumference;

  return (
    <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 160 160" style={{ overflow: 'visible' }}>
      <defs>
        {/* Multi-radius subsurface glow diffusion */}
        <filter id={`arc-glow-${color.label}`} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="8" result="blur1" />
          <feGaussianBlur stdDeviation="3" result="blur2" />
          <feGaussianBlur stdDeviation="1.5" result="blur3" />
          <feMerge>
            <feMergeNode in="blur1" opacity="0.25" />
            <feMergeNode in="blur2" opacity="0.70" />
            <feMergeNode in="blur3" opacity="0.06" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Liquid lens refraction gradient */}
        <linearGradient id={`liquid-ring-${color.label}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color.primary} stopOpacity="0.88" />
          <stop offset="50%" stopColor={color.primary} stopOpacity="0.96" />
          <stop offset="100%" stopColor={color.primary} stopOpacity="0.80" />
        </linearGradient>
      </defs>

      {/* Base ring track */}
      <circle
        cx="80"
        cy="80"
        r={radius}
        fill="none"
        stroke="rgba(255, 255, 255, 0.04)"
        strokeWidth="3.5"
      />

      {/* Liquid glass confidence arc */}
      <motion.circle
        cx="80"
        cy="80"
        r={radius}
        fill="none"
        stroke={`url(#liquid-ring-${color.label})`}
        strokeWidth="4.5"
        strokeDasharray={circumference}
        strokeLinecap="round"
        filter={`url(#arc-glow-${color.label})`}
        initial={{ strokeDashoffset: circumference }}
        animate={{ 
          strokeDashoffset: offset,
          strokeWidth: isHovered ? 5.5 : 4.5,
          opacity: isHovered ? 1 : 0.92
        }}
        transition={{ 
          duration: 1.8, 
          ease: HORIZON_EASE,
          strokeWidth: { duration: 0.12, ease: HORIZON_EASE }
        }}
      />
    </svg>
  );
};

const MiniSparkline = ({ data = [62, 58, 61, 59, 64, 67, 66], color, delay = 0 }) => {
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 40;
    const y = 12 - ((value - minValue) / range) * 12;
    return `${x},${y}`;
  }).join(' ');

  const lastPoint = points.split(' ')[data.length - 1];
  const [lastX, lastY] = lastPoint.split(',').map(Number);

  return (
    <div className="flex items-center space-x-2.5">
      <svg width="40" height="12" className="overflow-visible">
        <defs>
          <filter id={`sparkline-glow-${delay}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <motion.polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#sparkline-glow-${delay})`}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.88 }}
          transition={{ duration: 1.2, delay, ease: HORIZON_EASE }}
        />
        <motion.circle
          cx={lastX}
          cy={lastY}
          r="2"
          fill={color}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: delay + 0.8, ease: HORIZON_REBOUND }}
          style={{
            filter: `drop-shadow(0 0 4px ${color})`
          }}
        />
      </svg>
      <span 
        className="text-xs font-semibold" 
        style={{ color: color.replace(/[\d.]+\)$/,'0.76)') }}
      >
        +{data[data.length - 1] - data[0]} pts
      </span>
    </div>
  );
};

const ConfidenceBar = ({ percentage, color, delay = 0, width = "w-16" }) => (
  <div 
    className={`${width} h-1.5 rounded-full overflow-hidden relative`}
    style={{
      background: 'rgba(0, 0, 0, 0.28)',
      border: '1px solid rgba(255,255,255,0.04)'
    }}
  >
    <motion.div
      className="h-full rounded-full relative"
      style={{ 
        background: `linear-gradient(90deg, ${color}, ${color.replace(/[\d.]+\)$/,'0.88)')})`
      }}
      initial={{ width: 0 }}
      animate={{ width: `${percentage}%` }}
      transition={{ delay, duration: 0.7, ease: HORIZON_EASE }}
    >
      {/* Internal highlight */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: '20%',
        height: '50%',
        background: 'linear-gradient(90deg, rgba(255,255,255,0.16), transparent)',
        borderRadius: '999px 0 0 999px',
        filter: 'blur(0.5px)',
        pointerEvents: 'none'
      }} />
    </motion.div>
  </div>
);

const Node = ({ title, icon, color, delay, items = [], position, avgConfidence, onHoverChange }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleHoverStart = () => {
    setIsHovered(true);
    if (onHoverChange) onHoverChange(title, true);
  };

  const handleHoverEnd = () => {
    setIsHovered(false);
    if (onHoverChange) onHoverChange(title, false);
  };

  const getPanelPosition = () => {
    switch (position) {
        case 'left':
            return {
                container: "absolute bottom-full mb-8 left-0 w-[400px]",
                arrow: "absolute top-full left-[25%] -translate-x-1/2 -mt-1"
            };
        case 'right':
            return {
                container: "absolute bottom-full mb-8 right-0 w-[400px]",
                arrow: "absolute top-full right-[25%] translate-x-1/2 -mt-1"
            };
        default: // center
            return {
                container: "absolute bottom-full mb-8 left-1/2 -translate-x-1/2 w-[400px]",
                arrow: "absolute top-full left-1/2 -translate-x-1/2 -mt-1"
            };
    }
  };
  
  const panelPosition = getPanelPosition();

  const renderPopupContent = () => {
    switch (title) {
      case 'Consensus':
        return (
          <div className="space-y-4">
            <div className="space-y-3.5">
              {items.slice(0, 3).map((item, i) => (
                <motion.div 
                  key={i} 
                  className="space-y-2.5"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.08, duration: 0.3, ease: HORIZON_REBOUND }}
                >
                  <div className="flex items-start justify-between">
                    <p 
                      className="text-sm font-medium flex-1 mr-4 leading-relaxed"
                      style={{ 
                        color: 'rgba(255,255,255,0.86)',
                        lineHeight: '1.5'
                      }}
                    >
                      {item.claim}
                    </p>
                    <span 
                      className="text-xs font-bold whitespace-nowrap px-2 py-0.5 rounded-lg"
                      style={{ 
                        color: 'rgba(88, 227, 164, 0.88)',
                        background: 'rgba(88, 227, 164, 0.08)'
                      }}
                    >
                      {Math.round((item.confidence || 0) * 100)}%
                    </span>
                  </div>
                  <ConfidenceBar 
                    percentage={(item.confidence || 0) * 100} 
                    color={color.primary} 
                    delay={0.25 + i * 0.08}
                    width="w-full"
                  />
                </motion.div>
              ))}
            </div>
            
            <div className="pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.52)' }}>
                  7-day consensus trend
                </span>
                <MiniSparkline 
                  data={[62, 58, 61, 59, 64, 67, 66]} 
                  color="rgba(88, 227, 164, 0.82)" 
                  delay={0.6} 
                />
              </div>
            </div>
          </div>
        );

      case 'Divergences':
        return (
          <div className="space-y-4">
            {items.slice(0, 2).map((item, i) => (
              <motion.div
                key={i}
                className="grid grid-cols-2 gap-5 p-5 rounded-[18px] relative overflow-hidden"
                style={{ 
                  background: 'linear-gradient(180deg, rgba(147, 51, 234, 0.06) 0%, rgba(120, 40, 200, 0.08) 100%)',
                  backdropFilter: 'blur(20px) saturate(160%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(160%)',
                  border: '1px solid rgba(180, 120, 255, 0.12)',
                  boxShadow: `
                    inset 0 1px 0 rgba(255,255,255,0.05),
                    0 2px 10px rgba(0,0,0,0.08)
                  `
                }}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 + i * 0.08, duration: 0.28, ease: HORIZON_REBOUND }}
              >
                {/* Internal glow behind sentiment tags */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: '20%',
                  right: '20%',
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)',
                  filter: 'blur(1px)',
                  pointerEvents: 'none'
                }} />

                {/* Left Side - Angle A */}
                <div className="space-y-2.5">
                  <h5 
                    className="text-xs font-bold uppercase"
                    style={{ 
                      color: 'rgba(180, 120, 255, 0.82)',
                      letterSpacing: '0.05em'
                    }}
                  >
                    Angle A
                  </h5>
                  <p className="text-sm font-semibold leading-snug" style={{ color: 'rgba(255,255,255,0.90)' }}>
                    {item.topic}
                  </p>
                  <div className="flex items-center justify-between">
                    <ConfidenceBar 
                      percentage={(item.confidence || 0.6) * 100} 
                      color="rgba(180, 120, 255, 0.75)" 
                      delay={0.25 + i * 0.08}
                      width="w-14"
                    />
                    <span className="text-xs font-bold" style={{ color: 'rgba(180, 120, 255, 0.88)' }}>
                      {Math.round((item.confidence || 0.6) * 100)}%
                    </span>
                  </div>
                  <MiniSparkline 
                    data={[45, 52, 48, 51, 58, 60, 63]} 
                    color="rgba(180, 120, 255, 0.82)" 
                    delay={0.4 + i * 0.08} 
                  />
                </div>

                {/* Right Side - Angle B */}
                <div className="space-y-2.5">
                  <h5 
                    className="text-xs font-bold uppercase"
                    style={{ 
                      color: 'rgba(200, 160, 255, 0.82)',
                      letterSpacing: '0.05em'
                    }}
                  >
                    Angle B
                  </h5>
                  <p className="text-sm font-semibold leading-snug" style={{ color: 'rgba(255,255,255,0.90)' }}>
                    Counter-narrative
                  </p>
                  <div className="flex items-center justify-between">
                    <ConfidenceBar 
                      percentage={(1 - (item.confidence || 0.6)) * 100} 
                      color="rgba(200, 160, 255, 0.75)" 
                      delay={0.25 + i * 0.08}
                      width="w-14"
                    />
                    <span className="text-xs font-bold" style={{ color: 'rgba(200, 160, 255, 0.88)' }}>
                      {Math.round((1 - (item.confidence || 0.6)) * 100)}%
                    </span>
                  </div>
                  <MiniSparkline 
                    data={[55, 48, 52, 49, 42, 40, 37]} 
                    color="rgba(200, 160, 255, 0.82)" 
                    delay={0.4 + i * 0.08} 
                  />
                </div>
              </motion.div>
            ))}
          </div>
        );

      case 'US vs Global':
        return (
          <div className="space-y-4">
            {items.slice(0, 1).map((item, i) => (
              <motion.div
                key={i}
                className="grid grid-cols-2 gap-6"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.3, ease: HORIZON_REBOUND }}
              >
                {/* US Tilt */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4" style={{ color: 'rgba(125, 180, 255, 0.82)' }} strokeWidth={2} />
                    <h5 className="text-sm font-bold" style={{ color: 'rgba(125, 180, 255, 0.88)' }}>
                      US Tilt
                    </h5>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.78)' }}>
                    "{item.us_view}"
                  </p>
                  <div className="flex items-center justify-between">
                    <ConfidenceBar 
                      percentage={(item.confidence || 0.71) * 100} 
                      color="rgba(125, 180, 255, 0.75)" 
                      delay={0.25}
                      width="w-16"
                    />
                    <span className="text-xs font-bold" style={{ color: 'rgba(125, 180, 255, 0.88)' }}>
                      {Math.round((item.confidence || 0.71) * 100)}%
                    </span>
                  </div>
                  <MiniSparkline 
                    data={[68, 65, 69, 72, 71, 73, 71]} 
                    color="rgba(125, 180, 255, 0.82)" 
                    delay={0.4} 
                  />
                </div>

                {/* Global Tilt */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4" style={{ color: 'rgba(150, 190, 255, 0.82)' }} strokeWidth={2} />
                    <h5 className="text-sm font-bold" style={{ color: 'rgba(150, 190, 255, 0.88)' }}>
                      Global Tilt
                    </h5>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.78)' }}>
                    "{item.global_view}"
                  </p>
                  <div className="flex items-center justify-between">
                    <ConfidenceBar 
                      percentage={(1 - (item.confidence || 0.71)) * 100} 
                      color="rgba(150, 190, 255, 0.75)" 
                      delay={0.25}
                      width="w-16"
                    />
                    <span className="text-xs font-bold" style={{ color: 'rgba(150, 190, 255, 0.88)' }}>
                      {Math.round((1 - (item.confidence || 0.71)) * 100)}%
                    </span>
                  </div>
                  <MiniSparkline 
                    data={[32, 35, 31, 28, 29, 27, 29]} 
                    color="rgba(150, 190, 255, 0.82)" 
                    delay={0.4} 
                  />
                </div>
              </motion.div>
            ))}
          </div>
        );

      default:
        return <p className="text-gray-400">No analysis available.</p>;
    }
  };

  return (
    <motion.div
      className="relative group"
      variants={{ hidden: { opacity: 0, scale: 0.9, y: 12 }, visible: { opacity: 1, scale: 1, y: 0 } }}
      transition={{ delay, duration: 0.5, ease: HORIZON_REBOUND }}
    >
      {/* OS Horizon V4 Liquid Glass Node */}
      <motion.div 
        className="relative w-44 h-44 rounded-full flex flex-col items-center justify-center text-center p-4 cursor-pointer"
        style={{
          background: `linear-gradient(180deg, ${color.bgStart} 0%, ${color.bgEnd} 100%)`,
          backdropFilter: 'blur(28px) saturate(165%)',
          WebkitBackdropFilter: 'blur(28px) saturate(165%)',
          border: `1px solid ${color.borderColor}`,
          boxShadow: `
            inset 0 1.5px 0 rgba(255,255,255,0.08),
            inset 0 -1px 1px rgba(0,0,0,0.06),
            0 4px 18px rgba(0,0,0,0.12)
          `
        }}
        whileHover={{ 
          scale: 1.06,
          y: -2,
          backdropFilter: 'blur(32px) saturate(172%)',
          WebkitBackdropFilter: 'blur(32px) saturate(172%)',
          boxShadow: `
            inset 0 1.5px 0 rgba(255,255,255,0.12),
            inset 0 -1px 1px rgba(0,0,0,0.06),
            0 8px 28px rgba(0,0,0,0.18),
            0 0 32px ${color.glowHalo}
          `,
          transition: { duration: 0.12, ease: HORIZON_EASE }
        }}
        whileTap={{
          scale: 1.02,
          y: 0,
          transition: { duration: 0.08, ease: HORIZON_EASE }
        }}
        onHoverStart={handleHoverStart}
        onHoverEnd={handleHoverEnd}
      >
        {/* Unified global overhead soft-light source */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '15%',
          right: '15%',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)',
          filter: 'blur(1px)',
          pointerEvents: 'none',
          borderRadius: '2px'
        }} />

        {/* Subsurface glow diffusion - 70% falloff */}
        <motion.div 
          className="absolute -inset-3 rounded-full blur-2xl pointer-events-none"
          style={{ 
            background: `radial-gradient(circle, ${color.primary} 0%, transparent 70%)`
          }}
          animate={{ 
            opacity: isHovered ? [0.25, 0.35, 0.25] : [0.15, 0.22, 0.15],
            scale: isHovered ? [1.05, 1.15, 1.05] : [1, 1.05, 1]
          }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* 25% falloff layer */}
        <motion.div 
          className="absolute -inset-6 rounded-full blur-3xl pointer-events-none"
          style={{ 
            background: `radial-gradient(circle, ${color.primary} 0%, transparent 60%)`
          }}
          animate={{ 
            opacity: isHovered ? 0.12 : 0.08
          }}
          transition={{ duration: 0.15, ease: HORIZON_EASE }}
        />

        {/* 6% outermost haze */}
        <div 
          className="absolute -inset-12 rounded-full blur-[50px] pointer-events-none"
          style={{ 
            background: `radial-gradient(circle, ${color.primary} 0%, transparent 50%)`,
            opacity: 0.06
          }}
        />

        <ConfidenceArc confidence={avgConfidence} color={color} isHovered={isHovered} />
        
        {/* Icon container with liquid lens refraction */}
        <div className="relative z-10">
          <motion.div 
            className="p-3.5 rounded-full mb-2.5 relative overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.35) 0%, rgba(0, 0, 0, 0.48) 100%)',
              border: `1px solid ${color.iconBorder}`,
              boxShadow: `
                inset 0 1px 0 rgba(255,255,255,0.08),
                inset 0 -1px 2px rgba(0,0,0,0.25),
                0 2px 8px rgba(0,0,0,0.20)
              `
            }}
            animate={{
              boxShadow: isHovered 
                ? `
                  inset 0 1px 0 rgba(255,255,255,0.12),
                  inset 0 -1px 2px rgba(0,0,0,0.25),
                  0 4px 14px rgba(0,0,0,0.28),
                  0 0 18px ${color.glowHalo}
                `
                : `
                  inset 0 1px 0 rgba(255,255,255,0.08),
                  inset 0 -1px 2px rgba(0,0,0,0.25),
                  0 2px 8px rgba(0,0,0,0.20)
                `
            }}
            transition={{ duration: 0.12, ease: HORIZON_EASE }}
          >
            {/* Internal top-light */}
            <div style={{
              position: 'absolute',
              top: '10%',
              left: '20%',
              right: '20%',
              height: '30%',
              background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.16) 0%, transparent 60%)',
              pointerEvents: 'none',
              filter: 'blur(2px)'
            }} />

            <motion.div
              animate={{
                scale: isHovered ? 1.08 : 1,
                filter: isHovered 
                  ? `drop-shadow(0 0 10px ${color.primary}) brightness(1.10)`
                  : `drop-shadow(0 0 6px ${color.primary}) brightness(1.05)`
              }}
              transition={{ duration: 0.12, ease: HORIZON_EASE }}
            >
              {React.createElement(icon, { 
                className: `w-7 h-7 relative z-10`,
                style: { color: color.iconColor, strokeWidth: 2.0 }
              })}
            </motion.div>
          </motion.div>

          <h3 
            className="text-sm font-bold tracking-tight"
            style={{ 
              color: 'rgba(255,255,255,0.94)',
              letterSpacing: '0.01em'
            }}
          >
            {title}
          </h3>
        </div>
      </motion.div>
      
      {/* OS Horizon V4 Glass Capsule Hover Card */}
      <AnimatePresence>
        {isHovered && (
          <motion.div 
            className={panelPosition.container}
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              y: 0
            }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.18, ease: HORIZON_REBOUND }}
            style={{ pointerEvents: 'none', zIndex: 100 }}
          >
            <div className="relative">
              {/* OS Horizon V4 Liquid Glass Capsule */}
              <motion.div
                className="relative p-6 rounded-[22px]"
                style={{
                  background: 'linear-gradient(180deg, rgba(28, 32, 42, 0.88) 0%, rgba(22, 26, 34, 0.92) 100%)',
                  backdropFilter: 'blur(42px) saturate(168%)',
                  WebkitBackdropFilter: 'blur(42px) saturate(168%)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  boxShadow: `
                    inset 0 1.5px 0 rgba(255,255,255,0.08),
                    inset 0 -1px 1px rgba(0,0,0,0.10),
                    0 18px 42px rgba(0,0,0,0.32),
                    0 0 36px ${color.glowHalo}
                  `
                }}
                initial={{ scale: 0.96 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.12, ease: HORIZON_EASE }}
              >
                {/* Internal top-light (3% white) */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: '15%',
                  right: '15%',
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)',
                  filter: 'blur(1px)',
                  pointerEvents: 'none'
                }} />

                {/* Subtle curvature sheen */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0.02) 100%)',
                  borderRadius: '22px',
                  pointerEvents: 'none'
                }} />

                {/* Shimmer animation */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)',
                    borderRadius: '22px'
                  }}
                  initial={{ x: '-100%', opacity: 0 }}
                  animate={{ x: '100%', opacity: [0, 0.05, 0] }}
                  transition={{ duration: 1.2, delay: 0.3, ease: 'easeInOut' }}
                />

                <div className="relative z-10">
                  {renderPopupContent()}
                </div>
              </motion.div>

              {/* Arrow with liquid glass styling */}
              <div className={panelPosition.arrow}>
                <div 
                  className="w-3 h-3 rotate-45"
                  style={{
                    background: 'linear-gradient(225deg, rgba(28, 32, 42, 0.88) 0%, rgba(22, 26, 34, 0.92) 100%)',
                    border: '1px solid rgba(255,255,255,0.10)',
                    borderTop: 'none',
                    borderLeft: 'none'
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Connector = ({ delay, isHighlighted }) => {
  const [particleOffset, setParticleOffset] = useState(0);

  return (
    <motion.div 
      className="flex-1 h-0.5 relative"
      style={{ 
        transformOrigin: 'left',
        marginTop: '88px'
      }}
      variants={{ hidden: { scaleX: 0, opacity: 0 }, visible: { scaleX: 1, opacity: 1 } }}
      transition={{ duration: 1.0, delay, ease: HORIZON_EASE }}
    >
      {/* Liquid-light thread - 2px glowing filament */}
      <div 
        className="absolute inset-0 rounded-full"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)',
          height: '2px',
          top: '-0.75px',
          filter: 'blur(0.5px)'
        }}
      />

      {/* Core filament */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${isHighlighted ? 'rgba(110, 180, 255, 0.38)' : 'rgba(110, 180, 255, 0.18)'} 50%, transparent 100%)`,
          height: '2px',
          top: '-0.75px',
          boxShadow: isHighlighted 
            ? '0 0 12px rgba(110, 180, 255, 0.32), 0 0 6px rgba(110, 180, 255, 0.20)'
            : '0 0 8px rgba(110, 180, 255, 0.18)'
        }}
        animate={{
          opacity: isHighlighted ? [0.88, 1, 0.88] : 0.72
        }}
        transition={{
          opacity: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
        }}
      />

      {/* Gentle particulate drift animation */}
      <motion.div
        className="absolute top-[-1px] h-1 w-2 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(110, 180, 255, 0.55) 0%, transparent 70%)',
          filter: 'blur(2px)'
        }}
        animate={{ 
          x: ['-10%', '110%'],
          opacity: [0, 0.6, 0.8, 0.6, 0]
        }}
        transition={{ 
          duration: 5, 
          repeat: Infinity, 
          ease: 'easeInOut',
          delay: delay + 1.2
        }}
      />
    </motion.div>
  );
};

export default function NarrativeMap({ synthesis, density }) {
  const [hoveredNode, setHoveredNode] = useState(null);

  if (!synthesis) return null;
  
  const { consensus = [], divergences = [], us_global_split = [] } = synthesis;

  const calculateAvgConfidence = (items) => {
    if (!items || items.length === 0) return 0;
    const total = items.reduce((sum, item) => sum + (item.confidence || 0), 0);
    return (total / items.length) * 100;
  };

  const consensusConfidence = calculateAvgConfidence(consensus);
  const divergenceConfidence = calculateAvgConfidence(divergences);
  const splitConfidence = calculateAvgConfidence(us_global_split);

  // OS Horizon V4 unified color system
  const nodeColors = {
    consensus: { 
      label: 'consensus',
      bgStart: 'rgba(22, 163, 74, 0.08)',
      bgEnd: 'rgba(18, 140, 62, 0.12)',
      borderColor: 'rgba(88, 227, 164, 0.16)',
      iconBorder: 'rgba(88, 227, 164, 0.20)',
      iconColor: 'rgba(88, 227, 164, 0.92)',
      primary: 'rgba(88, 227, 164, 0.45)',
      glowHalo: 'rgba(88, 227, 164, 0.18)'
    },
    divergences: { 
      label: 'divergences',
      bgStart: 'rgba(147, 51, 234, 0.08)',
      bgEnd: 'rgba(120, 40, 200, 0.12)',
      borderColor: 'rgba(180, 120, 255, 0.16)',
      iconBorder: 'rgba(180, 120, 255, 0.20)',
      iconColor: 'rgba(180, 120, 255, 0.92)',
      primary: 'rgba(180, 120, 255, 0.45)',
      glowHalo: 'rgba(180, 120, 255, 0.18)'
    },
    split: { 
      label: 'split',
      bgStart: 'rgba(99, 102, 241, 0.08)',
      bgEnd: 'rgba(80, 85, 220, 0.12)',
      borderColor: 'rgba(125, 180, 255, 0.16)',
      iconBorder: 'rgba(125, 180, 255, 0.20)',
      iconColor: 'rgba(125, 180, 255, 0.92)',
      primary: 'rgba(125, 180, 255, 0.45)',
      glowHalo: 'rgba(125, 180, 255, 0.18)'
    }
  };
  
  const nodeSubtitles = {
    Consensus: "Where the Street agrees",
    Divergences: "Where narratives fracture",
    "US vs Global": "Regional perspective"
  }

  const nodes = [
      { title: "Consensus", icon: CheckCircle, color: nodeColors.consensus, delay: 0.1, items: consensus, avgConfidence: consensusConfidence, position: 'left' },
      { title: "Divergences", icon: GitCommit, color: nodeColors.divergences, delay: 0.5, items: divergences, avgConfidence: divergenceConfidence, position: 'center' },
      { title: "US vs Global", icon: Globe, color: nodeColors.split, delay: 0.9, items: us_global_split, avgConfidence: splitConfidence, position: 'right' }
  ];

  const handleNodeHover = (nodeTitle, isHovering) => {
    setHoveredNode(isHovering ? nodeTitle : null);
  };

  const getConnectorHighlight = (index) => {
    if (!hoveredNode) return false;
    if (index === 0) return hoveredNode === 'Consensus' || hoveredNode === 'Divergences';
    if (index === 1) return hoveredNode === 'Divergences' || hoveredNode === 'US vs Global';
    return false;
  };

  return (
    <motion.section
      aria-labelledby="narrative-map-heading"
      className="relative"
    >
      {/* OS Horizon V4 Section Header */}
      <div className="flex items-center mb-8 pl-2">
         <h2 id="narrative-map-heading" className="text-2xl font-bold" style={{ color: 'rgba(255,255,255,0.94)' }}>
           Narrative Map
         </h2>
         <p className="text-sm ml-5" style={{ color: 'rgba(255,255,255,0.58)' }}>
           Connecting the macro dots.
         </p>
      </div>

      {/* OS Horizon V4 Container with atmospheric background */}
      <div 
        className="relative flex items-start justify-around p-10 rounded-[28px] overflow-hidden"
        style={{ 
          background: 'linear-gradient(180deg, rgba(12, 15, 25, 0.42) 0%, rgba(21, 27, 45, 0.48) 100%)',
          backdropFilter: 'blur(32px) saturate(165%)',
          WebkitBackdropFilter: 'blur(32px) saturate(165%)',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: `
            inset 0 1.5px 0 rgba(255,255,255,0.04),
            inset 0 -1px 1px rgba(0,0,0,0.08),
            0 4px 22px rgba(0,0,0,0.16)
          `
        }}
      >
        {/* Atmospheric gradient refinement */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(12, 15, 25, 0.04) 0%, rgba(21, 27, 45, 0.06) 100%)',
          pointerEvents: 'none'
        }} />

        {/* Top-light source */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '20%',
          right: '20%',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)',
          filter: 'blur(1px)',
          pointerEvents: 'none'
        }} />

        {/* Texture noise */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          opacity: 0.015,
          mixBlendMode: 'overlay',
          pointerEvents: 'none'
        }} />

        {nodes.map((node, index) => (
            <React.Fragment key={node.title}>
              <div className="flex flex-col items-center space-y-3 relative z-10">
                <Node {...node} onHoverChange={handleNodeHover} />
                <p 
                  className="text-xs font-medium"
                  style={{ 
                    color: 'rgba(255,255,255,0.52)',
                    letterSpacing: '0.02em'
                  }}
                >
                  {nodeSubtitles[node.title]}
                </p>
              </div>
              {index < nodes.length - 1 && (
                <div className="w-full max-w-[140px] relative z-0">
                  <Connector 
                    delay={node.delay + 0.3} 
                    isHighlighted={getConnectorHighlight(index)}
                  />
                </div>
              )}
            </React.Fragment>
        ))}
      </div>
    </motion.section>
  );
}