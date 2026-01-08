// 🔒 OS HORIZON INFLATION SECTION — IRONCLAD REBUILD
// Compliance: CEP Engine, Steve Jobs Clarity, Calm Technology, macOS Tahoe
// Last Updated: 2026-01-08

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Home, ShoppingCart, ChevronDown, ChevronUp } from 'lucide-react';

// ============================================================================
// MOTION DNA — Apple-Grade Easing
// ============================================================================
const MOTION = {
  ease: [0.16, 1, 0.3, 1],        // iOS/macOS spring curve
  easeSoft: [0.22, 0.61, 0.36, 1], // Gentler secondary
  duration: {
    fast: 0.3,
    base: 0.6,
    slow: 1.0,
    breathe: 8
  }
};

// ============================================================================
// GLASS SYSTEM — Liquid Glass Tokens
// ============================================================================
const GLASS = {
  hero: {
    bg: 'linear-gradient(160deg, rgba(255, 200, 100, 0.08) 0%, rgba(40, 45, 55, 0.70) 40%, rgba(25, 28, 35, 0.85) 100%)',
    blur: 'blur(40px) saturate(160%)',
    border: '1px solid rgba(255,255,255,0.10)',
    shadow: `
      inset 0 2px 0 rgba(255,255,255,0.08),
      inset 0 0 40px rgba(255, 200, 100, 0.04),
      0 24px 60px -20px rgba(0,0,0,0.50),
      0 0 40px rgba(255, 180, 80, 0.06)
    `,
    radius: '32px'
  },
  card: {
    bg: 'linear-gradient(180deg, rgba(255, 255, 255, 0.045) 0%, rgba(255, 255, 255, 0.028) 100%)',
    blur: 'blur(32px) saturate(165%)',
    border: '1px solid rgba(255,255,255,0.08)',
    shadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 16px rgba(0,0,0,0.08)',
    radius: '24px'
  },
  panel: {
    bg: 'linear-gradient(180deg, rgba(255, 255, 255, 0.038) 0%, rgba(255, 255, 255, 0.024) 100%)',
    blur: 'blur(28px) saturate(160%)',
    border: '1px solid rgba(255,255,255,0.06)',
    shadow: 'inset 0 0.5px 0 rgba(255,255,255,0.06), 0 2px 12px rgba(0,0,0,0.06)',
    radius: '20px'
  }
};

// ============================================================================
// REALITY SPLIT HERO — OS Horizon Signature Visual Intelligence
// ============================================================================
const InflationRealitySplit = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldReduceMotion(mediaQuery.matches);
    const handler = (e) => setShouldReduceMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const handleMouseMove = (e) => {
    if (!heroRef.current || shouldReduceMotion) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePos({ x: x - 0.5, y: y - 0.5 });
  };

  // Calculate seam convergence based on cursor proximity to center
  const distanceFromCenter = Math.abs(mousePos.x);
  const convergence = Math.max(0, 1 - (distanceFromCenter * 2));

  return (
    <motion.div
      ref={heroRef}
      className="relative overflow-hidden cursor-default"
      style={{
        minHeight: '360px',
        background: 'transparent',
        borderRadius: '36px',
        isolation: 'isolate'
      }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, delay: 0.3, ease: MOTION.ease }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      {/* Unified Glass Surface */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, rgba(30, 35, 45, 0.75) 0%, rgba(20, 24, 32, 0.85) 100%)',
          backdropFilter: 'blur(50px) saturate(165%)',
          WebkitBackdropFilter: 'blur(50px) saturate(165%)',
          borderRadius: '36px',
          boxShadow: `
            0 30px 80px -25px rgba(0,0,0,0.60),
            inset 0 0 60px rgba(0,0,0,0.25)
          `
        }}
      />

      {/* Ambient Noise Texture */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        opacity: 0.018,
        mixBlendMode: 'overlay',
        borderRadius: '36px',
        pointerEvents: 'none'
      }} />

      {/* LEFT SIDE — Official Data (Cool, Sharp, Stable) */}
      <motion.div
        className="absolute inset-0"
        style={{
          clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)',
          background: 'linear-gradient(135deg, rgba(70, 90, 120, 0.35) 0%, rgba(45, 55, 70, 0.50) 100%)',
          borderRadius: '36px 0 0 36px'
        }}
        animate={shouldReduceMotion ? {} : {
          opacity: [0.92, 0.96, 0.92]
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        {/* Cool Subsurface Glow */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '15%',
          width: '60%',
          height: '50%',
          background: 'radial-gradient(ellipse, rgba(100, 140, 200, 0.10) 0%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none'
        }} />

        {/* Clarity Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 40%, rgba(0,0,0,0.03) 100%)',
          pointerEvents: 'none'
        }} />
      </motion.div>

      {/* RIGHT SIDE — Everyday Experience (Warm, Soft, Heavy) */}
      <motion.div
        className="absolute inset-0"
        style={{
          clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)',
          background: 'linear-gradient(135deg, rgba(90, 70, 50, 0.45) 0%, rgba(60, 50, 45, 0.60) 100%)',
          borderRadius: '0 36px 36px 0'
        }}
        animate={shouldReduceMotion ? {} : {
          opacity: [0.88, 0.94, 0.88]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.5
        }}
      >
        {/* Warm Subsurface Glow */}
        <div style={{
          position: 'absolute',
          top: '25%',
          right: '15%',
          width: '60%',
          height: '50%',
          background: 'radial-gradient(ellipse, rgba(255, 170, 90, 0.14) 0%, transparent 70%)',
          filter: 'blur(45px)',
          pointerEvents: 'none'
        }} />

        {/* Density Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.04) 0%, transparent 40%, rgba(0,0,0,0.06) 100%)',
          pointerEvents: 'none'
        }} />
      </motion.div>

      {/* SEAM — Soft Blended Gradient */}
      <motion.div
        className="absolute top-0 bottom-0"
        style={{
          left: '48%',
          width: '4%',
          background: 'linear-gradient(to right, transparent 0%, rgba(255,255,255,0.02) 50%, transparent 100%)',
          filter: 'blur(8px)',
          pointerEvents: 'none'
        }}
        animate={shouldReduceMotion ? {} : {
          opacity: [0.5, 0.7, 0.5],
          x: convergence * -2
        }}
        transition={{
          opacity: { duration: 7, repeat: Infinity, ease: 'easeInOut' },
          x: { type: 'spring', stiffness: 100, damping: 25 }
        }}
      />

      {/* Subtle Vertical Breathing Line */}
      <motion.div
        className="absolute top-0 bottom-0"
        style={{
          left: '50%',
          width: '1px',
          background: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)',
          pointerEvents: 'none'
        }}
        animate={shouldReduceMotion ? {} : {
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      {/* Content Container */}
      <div className="relative h-full flex items-center" style={{ padding: '48px 0', minHeight: '360px' }}>
        
        {/* LEFT SIDE CONTENT — Official Data */}
        <motion.div
          className="absolute left-0 w-1/2 flex items-center justify-center"
          style={{ padding: '0 6%' }}
          initial={{ opacity: 0, x: -30 }}
          animate={{ 
            opacity: isHovered ? 1 : 0.94, 
            x: 0,
            filter: isHovered ? 'brightness(1.08)' : 'brightness(1.04)'
          }}
          transition={{ 
            opacity: { duration: 0.4 },
            x: { duration: 0.9, delay: 0.5, ease: MOTION.ease },
            filter: { duration: 0.3 }
          }}
        >
          <div className="text-left">
            <motion.div
              className="text-sm font-semibold uppercase tracking-wider mb-3"
              style={{
                color: 'rgba(140, 180, 230, 0.75)',
                letterSpacing: '0.14em'
              }}
            >
              Official Data
            </motion.div>
            
            <motion.h3
              className="text-4xl font-bold mb-4"
              style={{
                color: 'rgba(200, 220, 255, 0.96)',
                letterSpacing: '-0.015em',
                textShadow: '0 2px 20px rgba(100, 140, 200, 0.25)'
              }}
            >
              Cooling Slowly
            </motion.h3>
            
            <motion.p
              className="text-base"
              style={{
                color: 'rgba(180, 200, 230, 0.80)',
                fontWeight: 440,
                lineHeight: 1.6,
                maxWidth: '240px'
              }}
            >
              Inflation is easing in the data.
            </motion.p>
          </div>
        </motion.div>

        {/* RIGHT SIDE CONTENT — Everyday Experience */}
        <motion.div
          className="absolute right-0 w-1/2 flex items-center justify-center"
          style={{ padding: '0 6%' }}
          initial={{ opacity: 0, x: 30 }}
          animate={{ 
            opacity: isHovered ? 1 : 0.94, 
            x: 0,
            filter: isHovered ? 'brightness(1.08)' : 'brightness(1.04)'
          }}
          transition={{ 
            opacity: { duration: 0.4 },
            x: { duration: 0.9, delay: 0.6, ease: MOTION.ease },
            filter: { duration: 0.3 }
          }}
        >
          <div className="text-right">
            <motion.div
              className="text-sm font-semibold uppercase tracking-wider mb-3"
              style={{
                color: 'rgba(255, 190, 120, 0.75)',
                letterSpacing: '0.14em'
              }}
            >
              Everyday Experience
            </motion.div>
            
            <motion.h3
              className="text-4xl font-bold mb-4"
              style={{
                color: 'rgba(255, 225, 200, 0.96)',
                letterSpacing: '-0.015em',
                textShadow: '0 2px 20px rgba(255, 160, 80, 0.25)'
              }}
            >
              Still Feels Expensive
            </motion.h3>
            
            <motion.p
              className="text-base ml-auto"
              style={{
                color: 'rgba(240, 210, 190, 0.80)',
                fontWeight: 440,
                lineHeight: 1.6,
                maxWidth: '240px'
              }}
            >
              Rent and services change slowly.
            </motion.p>
          </div>
        </motion.div>

        {/* SEAM UNDERSTANDING — Centered Micro-Text */}
        <motion.div
          className="absolute top-1/2 left-1/2"
          style={{
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            pointerEvents: 'none'
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ 
            opacity: [0, 0.65, 0.65],
            scale: 1,
            y: convergence * -3
          }}
          transition={{
            opacity: { duration: 1.0, delay: 2.2, times: [0, 0.5, 1] },
            scale: { duration: 0.8, delay: 2.2, ease: MOTION.ease },
            y: { type: 'spring', stiffness: 100, damping: 25 }
          }}
        >
          <div
            className="px-4 py-2 rounded-full text-[11px] font-medium"
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.75)',
              letterSpacing: '0.04em',
              boxShadow: '0 4px 16px rgba(0,0,0,0.20), inset 0 1px 0 rgba(255,255,255,0.06)'
            }}
          >
            Why inflation feels sticky
          </div>
        </motion.div>
      </div>

      {/* Top Specular Highlight */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '8%',
        right: '8%',
        height: '2px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)',
        pointerEvents: 'none',
        filter: 'blur(1px)',
        borderRadius: '36px 36px 0 0'
      }} />

      {/* Bottom Depth Shadow */}
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        left: '10%',
        right: '10%',
        height: '30%',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(0,0,0,0.20) 0%, transparent 70%)',
        filter: 'blur(30px)',
        pointerEvents: 'none'
      }} />

      {/* Subtle Border Rim */}
      <div style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '36px',
        border: '1px solid rgba(255,255,255,0.06)',
        pointerEvents: 'none'
      }} />
    </motion.div>
  );
};

// ============================================================================
// METRIC CARD — Secondary Supporting Cards
// ============================================================================
const MetricCard = ({ icon: Icon, label, value, isFedFocus, delay }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative overflow-hidden"
      style={{
        padding: '28px 26px',
        background: GLASS.card.bg,
        backdropFilter: GLASS.card.blur,
        WebkitBackdropFilter: GLASS.card.blur,
        border: GLASS.card.border,
        borderRadius: GLASS.card.radius,
        boxShadow: GLASS.card.shadow
      }}
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay, ease: MOTION.ease }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{
        y: -2,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10), 0 6px 20px rgba(0,0,0,0.12), 0 0 25px rgba(110, 180, 255, 0.04)'
      }}
    >
      {/* Top Specular */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '15%',
        right: '15%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
        pointerEvents: 'none'
      }} />

      {/* Icon */}
      <motion.div
        className="mb-4"
        animate={{
          scale: isHovered ? 1.05 : 1
        }}
        transition={{ duration: 0.2 }}
      >
        <Icon 
          className="w-5 h-5" 
          style={{ 
            color: 'rgba(180, 200, 230, 0.75)',
            strokeWidth: 1.8
          }} 
        />
      </motion.div>

      {/* Label */}
      <div 
        className="text-xs font-medium mb-2" 
        style={{ 
          color: 'rgba(255,255,255,0.58)',
          letterSpacing: '0.02em'
        }}
      >
        {label}
      </div>

      {/* Value */}
      <div 
        className="text-3xl font-bold tracking-tight" 
        style={{ color: 'rgba(255,255,255,0.96)' }}
      >
        {value}
      </div>

      {/* Fed Focus Badge */}
      {isFedFocus && (
        <motion.div
          className="mt-3 inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold"
          style={{
            background: 'rgba(110, 180, 255, 0.10)',
            border: '1px solid rgba(110, 180, 255, 0.20)',
            color: 'rgba(110, 180, 255, 0.90)'
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: delay + 0.3 }}
        >
          Fed watches this
        </motion.div>
      )}
    </motion.div>
  );
};

// ============================================================================
// MEANING PANEL — Plain-English Explanation
// ============================================================================
const MeaningPanel = ({ bullets }) => {
  return (
    <motion.div
      className="relative overflow-hidden"
      style={{
        padding: '32px 36px',
        background: GLASS.panel.bg,
        backdropFilter: GLASS.panel.blur,
        WebkitBackdropFilter: GLASS.panel.blur,
        border: GLASS.panel.border,
        borderRadius: GLASS.panel.radius,
        boxShadow: GLASS.panel.shadow
      }}
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.4, ease: MOTION.ease }}
    >
      {/* Top Specular */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '12%',
        right: '12%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)',
        pointerEvents: 'none'
      }} />

      {/* Header */}
      <h3 
        className="text-sm font-bold uppercase tracking-wider mb-5"
        style={{
          color: 'rgba(255,255,255,0.50)',
          letterSpacing: '0.16em'
        }}
      >
        What This Means
      </h3>

      {/* Bullets */}
      <div className="space-y-3.5">
        {bullets.map((bullet, idx) => (
          <motion.div
            key={idx}
            className="flex items-start gap-3"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1.5 + (idx * 0.1), ease: MOTION.easeSoft }}
          >
            <div 
              className="w-1 h-1 rounded-full mt-2 flex-shrink-0"
              style={{
                background: 'rgba(255,255,255,0.40)',
                boxShadow: '0 0 4px rgba(255,255,255,0.20)'
              }}
            />
            <p 
              className="text-base leading-relaxed"
              style={{ color: 'rgba(235, 240, 255, 0.85)' }}
            >
              {bullet}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// ============================================================================
// CONTEXT PANEL — Why It Still Feels Expensive
// ============================================================================
const ContextPanel = ({ points }) => {
  return (
    <motion.div
      className="relative overflow-hidden"
      style={{
        padding: '32px 36px',
        background: GLASS.panel.bg,
        backdropFilter: GLASS.panel.blur,
        WebkitBackdropFilter: GLASS.panel.blur,
        border: GLASS.panel.border,
        borderRadius: GLASS.panel.radius,
        boxShadow: GLASS.panel.shadow
      }}
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.6, ease: MOTION.ease }}
    >
      {/* Top Specular */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '12%',
        right: '12%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)',
        pointerEvents: 'none'
      }} />

      {/* Header */}
      <h3 
        className="text-sm font-bold uppercase tracking-wider mb-5"
        style={{
          color: 'rgba(255,255,255,0.50)',
          letterSpacing: '0.16em'
        }}
      >
        Why It Still Feels Expensive
      </h3>

      {/* Points */}
      <div className="space-y-3.5">
        {points.map((point, idx) => (
          <motion.div
            key={idx}
            className="flex items-start gap-3"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1.7 + (idx * 0.1), ease: MOTION.easeSoft }}
          >
            <div 
              className="w-1 h-1 rounded-full mt-2 flex-shrink-0"
              style={{
                background: 'rgba(255,255,255,0.40)',
                boxShadow: '0 0 4px rgba(255,255,255,0.20)'
              }}
            />
            <p 
              className="text-base leading-relaxed"
              style={{ color: 'rgba(235, 240, 255, 0.85)' }}
            >
              {point}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// ============================================================================
// MARKET IMPACT STRIP — Single Horizontal Direction
// ============================================================================
const MarketImpactStrip = ({ impacts }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      className="relative overflow-hidden"
      style={{
        padding: '28px 32px',
        background: GLASS.panel.bg,
        backdropFilter: GLASS.panel.blur,
        WebkitBackdropFilter: GLASS.panel.blur,
        border: GLASS.panel.border,
        borderRadius: GLASS.panel.radius,
        boxShadow: GLASS.panel.shadow
      }}
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.8, ease: MOTION.ease }}
    >
      {/* Top Specular */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '12%',
        right: '12%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)',
        pointerEvents: 'none'
      }} />

      {/* Header */}
      <h3 
        className="text-sm font-bold uppercase tracking-wider mb-5"
        style={{
          color: 'rgba(255,255,255,0.50)',
          letterSpacing: '0.16em'
        }}
      >
        Market Impact
      </h3>

      {/* Impact Points */}
      <div className="flex flex-wrap items-center gap-4">
        {impacts.map((impact, idx) => (
          <motion.div
            key={idx}
            className="flex items-center gap-2.5"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1.9 + (idx * 0.08), ease: MOTION.easeSoft }}
          >
            <impact.icon 
              className="w-4 h-4" 
              style={{ 
                color: 'rgba(180, 200, 230, 0.70)',
                strokeWidth: 1.8
              }} 
            />
            <span 
              className="text-sm font-medium"
              style={{ color: 'rgba(235, 240, 255, 0.88)' }}
            >
              {impact.text}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Expandable "Why this happens" */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-5 flex items-center gap-2 text-xs font-medium"
        style={{
          color: 'rgba(110, 180, 255, 0.80)'
        }}
        whileHover={{ color: 'rgba(110, 180, 255, 1)' }}
      >
        <span>Why this happens</span>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3, ease: MOTION.easeSoft }}
        >
          <ChevronDown className="w-3.5 h-3.5" strokeWidth={2} />
        </motion.div>
      </motion.button>

      {/* Expanded Explanation */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0
        }}
        transition={{ duration: 0.4, ease: MOTION.easeSoft }}
        style={{ overflow: 'hidden' }}
      >
        <p 
          className="text-sm leading-relaxed mt-4 pt-4"
          style={{
            color: 'rgba(200, 210, 230, 0.75)',
            borderTop: '1px solid rgba(255,255,255,0.06)'
          }}
        >
          When inflation stays high, the Fed keeps rates elevated to slow demand. Higher rates make borrowing expensive, which pressures stock valuations and supports the dollar as yields stay attractive.
        </p>
      </motion.div>
    </motion.div>
  );
};

// ============================================================================
// MAIN SECTION
// ============================================================================
export default function InflationSection({ data }) {
  if (!data) return null;

  const meaningBullets = [
    "Prices are still rising faster than the Fed wants.",
    "Housing costs are the main reason inflation feels sticky.",
    "Wage growth keeps service prices from falling quickly."
  ];

  const contextPoints = [
    "CPI counts rent and housing more heavily.",
    "PCE reflects what people actually spend day to day.",
    "Rent stays high, so CPI stays elevated."
  ];

  const marketImpacts = [
    { icon: TrendingUp, text: "Rates likely stay high" },
    { icon: DollarSign, text: "Stocks face pressure" },
    { icon: Home, text: "Dollar stays supported" }
  ];

  return (
    <div className="space-y-6">
      {/* Section Title */}
      <motion.div
        className="pl-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: MOTION.easeSoft }}
      >
        <h2 
          className="text-3xl font-bold mb-1" 
          style={{ 
            color: 'rgba(255,255,255,0.96)',
            letterSpacing: '-0.01em'
          }}
        >
          Inflation
        </h2>
        <p 
          className="text-sm" 
          style={{ color: 'rgba(255,255,255,0.56)' }}
        >
          CPI · PCE
        </p>
      </motion.div>

      {/* Reality Split Hero */}
      <InflationRealitySplit />

      {/* Secondary Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={ShoppingCart}
          label="Everyday Prices"
          value={data.cpi_headline_yoy ? `${data.cpi_headline_yoy}%` : '3.4%'}
          delay={0.7}
        />
        <MetricCard
          icon={TrendingUp}
          label="Services Prices"
          value="3.9%"
          delay={0.8}
        />
        <MetricCard
          icon={DollarSign}
          label="Consumer Spending Prices"
          value={data.pce_headline_yoy ? `${data.pce_headline_yoy}%` : '2.6%'}
          delay={0.9}
        />
        <MetricCard
          icon={Home}
          label="Core Consumer Prices"
          value={data.pce_core_yoy ? `${data.pce_core_yoy}%` : '2.9%'}
          isFedFocus
          delay={1.0}
        />
      </div>

      {/* Explanation Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <MeaningPanel bullets={meaningBullets} />
        <ContextPanel points={contextPoints} />
      </div>

      {/* Market Impact Strip */}
      <MarketImpactStrip impacts={marketImpacts} />
    </div>
  );
}