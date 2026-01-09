// 🔒 OS HORIZON V5.0 FLAGSHIP VISUAL — CPI vs PCE LIVING ORB
// Apple-Grade Cinematic Motion System + CEP Education Layer
// Last Updated: 2026-01-08

import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity, Layers, Home, CreditCard } from 'lucide-react';

// ============================================================================
// OS HORIZON MOTION DNA
// ============================================================================
const MOTION = {
  curves: {
    primary: [0.16, 1, 0.3, 1],      // Hero entrance
    secondary: [0.22, 0.61, 0.36, 1], // Interactions
    breathing: [0.45, 0.05, 0.55, 0.95] // Organic pulse
  },
  durations: {
    entrance: 1.8,
    breathing: 4.5,
    interaction: 0.22
  }
};

// ============================================================================
// EDUCATION POPOVER — "Why it feels different"
// ============================================================================
const EducationPopover = ({ isVisible, onClose }) => {
  useEffect(() => {
    if (!isVisible) return;
    const handleClickOutside = (e) => {
      if (!e.target.closest('.education-popover')) {
        onClose();
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="absolute education-popover z-50"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '340px',
            maxWidth: '90vw'
          }}
          initial={{ opacity: 0, scale: 0.94, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -8 }}
          transition={{ duration: 0.18, ease: [0.22, 0.61, 0.36, 1] }}
        >
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              padding: '24px 28px',
              background: 'rgba(18, 22, 32, 0.96)',
              backdropFilter: 'blur(40px) saturate(170%)',
              WebkitBackdropFilter: 'blur(40px) saturate(170%)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: `
                inset 0 1px 0 rgba(255, 255, 255, 0.10),
                0 16px 48px rgba(0, 0, 0, 0.40),
                0 0 60px rgba(100, 150, 220, 0.08)
              `
            }}
          >
            {/* Top Specular */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: '12%',
              right: '12%',
              height: '1.5px',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent)',
              pointerEvents: 'none'
            }} />

            {/* Title */}
            <h4 
              className="text-sm font-bold uppercase tracking-wider mb-4"
              style={{ 
                color: 'rgba(255, 255, 255, 0.60)',
                letterSpacing: '0.08em'
              }}
            >
              Why it feels different
            </h4>

            {/* Education Lines */}
            <div className="space-y-3.5">
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.88)' }}>
                CPI rises with rent and housing — renters feel it most.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.88)' }}>
                PCE tracks spending choices — people who can switch brands feel relief sooner.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.88)' }}>
                That gap is why inflation feels uneven.
              </p>
            </div>

            {/* Closing Note */}
            <p 
              className="text-xs mt-4 pt-3 border-t italic"
              style={{ 
                color: 'rgba(255, 255, 255, 0.45)',
                borderColor: 'rgba(255, 255, 255, 0.06)'
              }}
            >
              Inflation doesn't hit everyone the same way.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ============================================================================
// LIVING ORB NUCLEUS — Dual Metric Comparison
// ============================================================================
const LivingOrbNucleus = ({ cpiValue, pceValue, consensus, isHovered, onOrbClick }) => {
  const [breathingPhase, setBreathingPhase] = useState(0);
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const [isPillHovered, setIsPillHovered] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldReduceMotion(mediaQuery.matches);
    const handler = (e) => setShouldReduceMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (shouldReduceMotion) return;
    
    let rafId;
    let startTime = Date.now();
    
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      setBreathingPhase(elapsed);
      rafId = requestAnimationFrame(animate);
    };
    
    rafId = requestAnimationFrame(animate);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [shouldReduceMotion]);

  const breathingScale = 1 + Math.sin(breathingPhase * (2 * Math.PI / MOTION.durations.breathing)) * 0.025;
  const breathingOpacity = 0.08 + Math.sin(breathingPhase * (2 * Math.PI / MOTION.durations.breathing)) * 0.04;

  // Determine divergence/convergence
  const diff = Math.abs(cpiValue - pceValue);
  const isConverging = diff < 0.3;
  const isDiverging = diff > 0.8;
  
  const convergenceColor = isConverging ? '#73E6D2' : isDiverging ? '#ECA5FF' : '#8DC4FF';
  
  return (
    <div className="relative flex items-center justify-center" style={{ width: '280px', height: '280px' }}>
      {/* Volumetric Background Field */}
      <motion.div
        className="absolute"
        style={{
          width: '340px',
          height: '340px',
          background: `radial-gradient(circle, ${convergenceColor}15 0%, transparent 70%)`,
          filter: 'blur(40px)'
        }}
        animate={{
          scale: breathingScale * 1.1,
          opacity: breathingOpacity
        }}
        transition={{
          duration: MOTION.durations.breathing,
          ease: 'easeInOut'
        }}
      />

      {/* Outer Glass Ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '260px',
          height: '260px',
          background: `
            linear-gradient(135deg, 
              rgba(142, 187, 255, 0.08) 0%, 
              rgba(179, 212, 255, 0.12) 50%,
              rgba(142, 187, 255, 0.08) 100%
            )
          `,
          backdropFilter: 'blur(24px) saturate(160%)',
          WebkitBackdropFilter: 'blur(24px) saturate(160%)',
          border: '1px solid rgba(255, 255, 255, 0.14)',
          boxShadow: `
            inset 0 2px 12px rgba(255, 255, 255, 0.10),
            inset 0 -3px 10px rgba(0, 0, 0, 0.10),
            0 0 60px ${convergenceColor}20
          `
        }}
        animate={{
          scale: isHovered ? 1.05 : breathingScale,
          boxShadow: isHovered 
            ? `
              inset 0 2px 12px rgba(255, 255, 255, 0.12),
              inset 0 -3px 10px rgba(0, 0, 0, 0.10),
              0 0 80px ${convergenceColor}35
            `
            : `
              inset 0 2px 12px rgba(255, 255, 255, 0.10),
              inset 0 -3px 10px rgba(0, 0, 0, 0.10),
              0 0 60px ${convergenceColor}20
            `
        }}
        transition={{
          scale: { duration: isHovered ? MOTION.durations.interaction : MOTION.durations.breathing, ease: 'easeInOut' },
          boxShadow: { duration: MOTION.durations.interaction }
        }}
      >
        {/* Top Specular Highlight */}
        <div style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          width: '80px',
          height: '80px',
          background: 'radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.20) 0%, rgba(255, 255, 255, 0.05) 50%, transparent 70%)',
          filter: 'blur(18px)',
          borderRadius: '50%'
        }} />
      </motion.div>

      {/* Inner Core Orb */}
      <motion.div
        className="absolute rounded-full flex flex-col items-center justify-center cursor-pointer"
        style={{
          width: '200px',
          height: '200px',
          background: `
            linear-gradient(145deg, 
              rgba(179, 212, 255, 0.12) 0%, 
              rgba(142, 187, 255, 0.16) 50%,
              rgba(179, 212, 255, 0.12) 100%
            )
          `,
          backdropFilter: 'blur(18px) saturate(165%)',
          WebkitBackdropFilter: 'blur(18px) saturate(165%)',
          border: '1px solid rgba(255, 255, 255, 0.10)',
          boxShadow: `
            inset 0 1px 8px rgba(255, 255, 255, 0.08),
            inset 0 0 32px ${convergenceColor}12,
            0 8px 32px rgba(0, 0, 0, 0.15)
          `
        }}
        animate={{
          scale: breathingScale * 0.98,
          filter: isHovered ? 'brightness(1.08)' : 'brightness(1)'
        }}
        transition={{
          scale: { duration: isHovered ? MOTION.durations.interaction : MOTION.durations.breathing, ease: 'easeInOut' },
          filter: { duration: MOTION.durations.interaction }
        }}
        onClick={onOrbClick}
        whileHover={{ scale: breathingScale * 1.02 }}
      >
        {/* Central Metric Display */}
        <div className="flex flex-col items-center gap-2">
          {/* Consensus Reading */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6, ease: MOTION.curves.primary }}
          >
            <div 
              className="text-xs font-bold uppercase tracking-wider mb-1" 
              style={{ 
                color: convergenceColor,
                letterSpacing: '0.08em',
                textShadow: `0 0 20px ${convergenceColor}60`
              }}
            >
              Consensus
            </div>
            <div 
              className="text-5xl font-bold tracking-tight"
              style={{ 
                color: 'rgba(255, 255, 255, 0.96)',
                textShadow: '0 2px 20px rgba(0, 0, 0, 0.30)',
                lineHeight: 1,
                fontVariantNumeric: 'tabular-nums'
              }}
            >
              {consensus}%
            </div>
            
            {/* Static Subline */}
            <motion.p
              className="text-xs mt-2"
              style={{ color: 'rgba(255, 255, 255, 0.55)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6, duration: 0.4 }}
            >
              Prices are still rising faster than normal.
            </motion.p>
          </motion.div>

          {/* Convergence State Pill */}
          <motion.div
            className="text-center px-4 py-2 rounded-full relative"
            style={{
              background: isConverging 
                ? 'rgba(115, 230, 210, 0.15)' 
                : isDiverging 
                  ? 'rgba(236, 165, 255, 0.15)' 
                  : 'rgba(141, 196, 255, 0.15)',
              border: `1px solid ${convergenceColor}30`,
              backdropFilter: 'blur(12px)'
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5, duration: 0.5, ease: MOTION.curves.primary }}
            onHoverStart={() => setIsPillHovered(true)}
            onHoverEnd={() => setIsPillHovered(false)}
          >
            <div className="flex items-center gap-2">
              <Layers className="w-3.5 h-3.5" style={{ color: convergenceColor }} strokeWidth={2} />
              <span 
                className="text-xs font-semibold"
                style={{ color: convergenceColor }}
              >
                {isPillHovered 
                  ? 'Uneven impact' 
                  : (isConverging ? 'Converging' : isDiverging ? 'Diverging' : 'Tracking')
                }
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Rotating Energy Ring */}
      {!shouldReduceMotion && (
        <motion.svg
          className="absolute"
          width="280"
          height="280"
          viewBox="0 0 280 280"
          style={{ pointerEvents: 'none' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        >
          <defs>
            <linearGradient id="energyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={convergenceColor} stopOpacity="0.4" />
              <stop offset="50%" stopColor={convergenceColor} stopOpacity="0.15" />
              <stop offset="100%" stopColor={convergenceColor} stopOpacity="0.05" />
            </linearGradient>
          </defs>
          <circle
            cx="140"
            cy="140"
            r="128"
            fill="none"
            stroke="url(#energyGradient)"
            strokeWidth="2"
            strokeDasharray="8 16"
            opacity="0.6"
          />
        </motion.svg>
      )}
    </div>
  );
};

// ============================================================================
// METRIC SATELLITE — Individual CPI/PCE Display
// ============================================================================
const MetricSatellite = ({ 
  label, 
  value, 
  trend, 
  position, 
  delay, 
  color, 
  tldr, 
  secondary, 
  whoFeelsIt,
  whoIcon: WhoIcon 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Activity;
  
  return (
    <motion.div
      className="absolute"
      style={{
        ...position
      }}
      initial={{ opacity: 0, scale: 0.8, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.8, ease: MOTION.curves.primary }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div
        className="relative rounded-2xl overflow-hidden cursor-pointer"
        style={{
          padding: '20px 24px',
          width: '320px',
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.04) 100%)',
          backdropFilter: 'blur(28px) saturate(160%)',
          WebkitBackdropFilter: 'blur(28px) saturate(160%)',
          border: '1px solid rgba(255, 255, 255, 0.10)',
          boxShadow: `
            inset 0 1px 0 rgba(255, 255, 255, 0.10),
            0 8px 32px rgba(0, 0, 0, 0.12),
            0 0 40px ${color}15
          `
        }}
        animate={{
          y: isHovered ? -4 : 0,
          boxShadow: isHovered 
            ? `
              inset 0 1px 0 rgba(255, 255, 255, 0.12),
              0 12px 40px rgba(0, 0, 0, 0.18),
              0 0 60px ${color}30
            `
            : `
              inset 0 1px 0 rgba(255, 255, 255, 0.10),
              0 8px 32px rgba(0, 0, 0, 0.12),
              0 0 40px ${color}15
            `
        }}
        transition={{ duration: MOTION.durations.interaction }}
      >
        {/* Top Specular */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '15%',
          right: '15%',
          height: '1.5px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent)',
          pointerEvents: 'none'
        }} />

        {/* Ambient Glow - theme-specific */}
        <motion.div 
          style={{
            position: 'absolute',
            top: '20%',
            left: '20%',
            width: '60%',
            height: '40%',
            background: `radial-gradient(ellipse, ${color}${isHovered ? '18' : '10'} 0%, transparent 70%)`,
            filter: 'blur(20px)',
            pointerEvents: 'none'
          }}
          animate={{
            opacity: isHovered ? 1 : 0.7
          }}
          transition={{ duration: 0.2 }}
        />

        <div className="relative z-10">
          {/* Label */}
          <div className="flex items-center gap-2 mb-3">
            <TrendIcon className="w-4 h-4" style={{ color }} strokeWidth={2.5} />
            <span 
              className="text-xs font-bold uppercase tracking-wider"
              style={{ 
                color: 'rgba(255, 255, 255, 0.65)',
                letterSpacing: '0.08em'
              }}
            >
              {label}
            </span>
          </div>

          {/* Value */}
          <div 
            className="text-3xl font-bold tracking-tight mb-2"
            style={{ 
              color: 'rgba(255, 255, 255, 0.96)',
              textShadow: '0 2px 12px rgba(0, 0, 0, 0.25)',
              fontVariantNumeric: 'tabular-nums'
            }}
          >
            {value}%
          </div>

          {/* TL;DR */}
          <p 
            className="text-xs leading-snug mb-1.5"
            style={{ color: 'rgba(255, 255, 255, 0.78)' }}
          >
            {tldr}
          </p>

          {/* Secondary */}
          <p 
            className="text-[10px] mb-3"
            style={{ color: 'rgba(255, 255, 255, 0.48)' }}
          >
            {secondary}
          </p>

          {/* Who Feels It - Subtle Indicator */}
          <motion.div 
            className="flex items-center gap-1.5 pt-2 border-t"
            style={{ 
              borderColor: 'rgba(255, 255, 255, 0.06)'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 0.85 : 0.60 }}
            transition={{ duration: 0.16 }}
          >
            <WhoIcon className="w-3 h-3" style={{ color: 'rgba(255, 255, 255, 0.45)' }} strokeWidth={2} />
            <span 
              className="text-[10px] font-medium"
              style={{ color: 'rgba(255, 255, 255, 0.50)' }}
            >
              {whoFeelsIt}
            </span>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ============================================================================
// CONSENSUS INSIGHT CARD
// ============================================================================
const ConsensusInsight = ({ insight, divergenceNote }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      className="relative rounded-2xl overflow-hidden cursor-pointer"
      style={{
        padding: '28px 32px',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)',
        backdropFilter: 'blur(32px) saturate(165%)',
        WebkitBackdropFilter: 'blur(32px) saturate(165%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 8px 32px rgba(0, 0, 0, 0.10)'
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.0, duration: 0.8, ease: MOTION.curves.primary }}
      onClick={() => setIsExpanded(!isExpanded)}
      whileHover={{ y: -2 }}
    >
      {/* Top Specular */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '12%',
        right: '12%',
        height: '1.5px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)',
        pointerEvents: 'none'
      }} />

      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h4 
            className="text-sm font-bold uppercase tracking-wider mb-3"
            style={{ 
              color: 'rgba(255, 255, 255, 0.60)',
              letterSpacing: '0.08em'
            }}
          >
            Cross-Examination
          </h4>
          
          <p 
            className="text-lg font-medium leading-relaxed mb-3"
            style={{ color: 'rgba(255, 255, 255, 0.90)' }}
          >
            {insight}
          </p>

          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ 
              height: isExpanded ? 'auto' : 0,
              opacity: isExpanded ? 1 : 0
            }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            <p 
              className="text-sm leading-relaxed pt-2 border-t"
              style={{ 
                color: 'rgba(255, 255, 255, 0.65)',
                borderColor: 'rgba(255, 255, 255, 0.08)'
              }}
            >
              {divergenceNote}
            </p>
          </motion.div>
        </div>

        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <Activity 
            className="w-5 h-5 flex-shrink-0" 
            style={{ color: 'rgba(255, 255, 255, 0.40)' }}
            strokeWidth={2}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

// ============================================================================
// MAIN COMPONENT — CPI vs PCE Living Visual
// ============================================================================
export default function CPIvsPCEOrb({ data }) {
  const [isHovered, setIsHovered] = useState(false);
  const [showEducation, setShowEducation] = useState(false);
  const [isDimmed, setIsDimmed] = useState(false);

  if (!data) return null;

  const cpiValue = data.cpi_core_yoy || 3.2;
  const pceValue = data.pce_core_yoy || 2.8;
  const consensus = ((cpiValue + pceValue) / 2).toFixed(1);

  const cpiTrend = cpiValue > 3.0 ? 'up' : cpiValue < 2.5 ? 'down' : 'neutral';
  const pceTrend = pceValue > 2.5 ? 'up' : pceValue < 2.0 ? 'down' : 'neutral';

  const handleOrbClick = () => {
    setShowEducation(!showEducation);
    setIsDimmed(!showEducation);
  };

  return (
    <div className="relative w-full">
      {/* Main Visual Container */}
      <motion.div
        className="relative flex items-center justify-center py-16"
        style={{ minHeight: '520px' }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Dim Overlay when popover is open */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'rgba(0, 0, 0, 0.35)',
            backdropFilter: 'blur(4px)'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isDimmed ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        />

        {/* Ambient Background Field */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 60% 50% at 50% 45%, rgba(100, 150, 220, 0.04) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }} />

        {/* Central Living Orb */}
        <LivingOrbNucleus 
          cpiValue={cpiValue}
          pceValue={pceValue}
          consensus={consensus}
          isHovered={isHovered}
          onOrbClick={handleOrbClick}
        />

        {/* Education Popover */}
        <EducationPopover 
          isVisible={showEducation} 
          onClose={() => {
            setShowEducation(false);
            setIsDimmed(false);
          }}
        />

        {/* CPI Satellite - Left */}
        <MetricSatellite
          label="CPI Core"
          value={cpiValue}
          trend={cpiTrend}
          position={{ top: '50%', left: '40px', transform: 'translateY(-50%)' }}
          delay={1.8}
          color="#62CFFF"
          tldr="Everyday living costs are rising — renters and city households feel it most."
          secondary="Housing and services drive this."
          whoFeelsIt="Renters • Urban households"
          whoIcon={Home}
        />

        {/* PCE Satellite - Right */}
        <MetricSatellite
          label="PCE Core"
          value={pceValue}
          trend={pceTrend}
          position={{ top: '50%', right: '40px', transform: 'translateY(-50%)' }}
          delay={2.0}
          color="#C9A2FF"
          tldr="Daily spending is cooling — higher-income and flexible spenders feel relief first."
          secondary="Tracks what people actually buy."
          whoFeelsIt="Flexible spenders"
          whoIcon={CreditCard}
        />
      </motion.div>

      {/* Consensus Insight Card */}
      <div className="px-8">
        <ConsensusInsight
          insight={data.comparison_headline || "CPI and PCE showing coordinated movement, both tracking the Fed's 2% target with similar momentum patterns."}
          divergenceNote={data.comparison_detail || "Housing components in CPI remain elevated (+5.7% YoY) while PCE housing shows more moderation (+4.1%). This divergence is due to methodological differences in rent calculation and weighting."}
        />
      </div>

      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}