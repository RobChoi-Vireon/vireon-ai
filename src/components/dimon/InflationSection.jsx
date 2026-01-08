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
// HERO CARD — Dominant Signal
// ============================================================================
const InflationHeroCard = ({ state, subline }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
    setMousePos({ x, y });
  };

  return (
    <motion.div
      ref={cardRef}
      className="relative overflow-hidden cursor-default"
      style={{
        padding: '48px 44px',
        background: GLASS.hero.bg,
        backdropFilter: GLASS.hero.blur,
        WebkitBackdropFilter: GLASS.hero.blur,
        border: GLASS.hero.border,
        borderRadius: GLASS.hero.radius,
        boxShadow: GLASS.hero.shadow
      }}
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: MOTION.duration.slow, delay: 0.3, ease: MOTION.ease }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      whileHover={{
        y: -4,
        boxShadow: `
          inset 0 2px 0 rgba(255,255,255,0.10),
          inset 0 0 45px rgba(255, 200, 100, 0.06),
          0 28px 70px -20px rgba(0,0,0,0.60),
          0 0 50px rgba(255, 180, 80, 0.10)
        `
      }}
    >
      {/* Top Specular Edge */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '10%',
        right: '10%',
        height: '2px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), rgba(255,200,100,0.12), rgba(255,255,255,0.18), transparent)',
        pointerEvents: 'none'
      }} />

      {/* Ambient Theme Glow */}
      <motion.div 
        style={{
          position: 'absolute',
          top: '-30%',
          left: '20%',
          width: '60%',
          height: '80%',
          background: 'radial-gradient(ellipse at 50% 100%, rgba(255, 190, 90, 0.10) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
        animate={{
          opacity: [0.6, 0.8, 0.6],
          scale: [1, 1.05, 1]
        }}
        transition={{
          duration: MOTION.duration.breathe,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      {/* Parallax Glow Layer */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(255, 200, 100, 0.08) 0%, transparent 65%)',
          pointerEvents: 'none',
          borderRadius: GLASS.hero.radius
        }}
        animate={{
          x: mousePos.x,
          y: mousePos.y
        }}
        transition={{
          type: 'spring',
          stiffness: 150,
          damping: 30
        }}
      />

      {/* Label */}
      <motion.div
        className="text-xs font-bold uppercase tracking-wider mb-4"
        style={{
          color: 'rgba(255, 190, 90, 0.85)',
          letterSpacing: '0.18em',
          textShadow: '0 0 16px rgba(255, 190, 90, 0.30)'
        }}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5, ease: MOTION.easeSoft }}
      >
        Inflation Pressure
      </motion.div>

      {/* State */}
      <motion.h3
        className="text-5xl font-bold mb-5"
        style={{
          color: 'rgba(255,255,255,0.98)',
          letterSpacing: '-0.02em',
          textShadow: '0 2px 24px rgba(0,0,0,0.35)'
        }}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6, ease: MOTION.ease }}
      >
        {state}
      </motion.h3>

      {/* Subline */}
      <motion.p
        className="text-lg leading-relaxed"
        style={{
          color: 'rgba(235, 240, 255, 0.88)',
          fontWeight: 450,
          maxWidth: '520px'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8, ease: MOTION.easeSoft }}
      >
        {subline}
      </motion.p>

      {/* Ambient Noise Texture */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        opacity: 0.015,
        mixBlendMode: 'overlay',
        borderRadius: GLASS.hero.radius,
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

  // Data mapping
  const heroState = "Still Elevated";
  const heroSubline = "Prices are cooling slowly, but not enough for the Fed to relax.";

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