// 🔒 OS HORIZON INFLATION CONSENSUS FLOW — Living System Visualization
// Purpose: Continuous convergence of CPI/PCE into unified consensus
// Compliance: VisionOS depth, macOS Tahoe, Calm Technology

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// ============================================================================
// MOTION DNA
// ============================================================================
const MOTION = {
  ease: [0.16, 1, 0.3, 1],
  easeSoft: [0.22, 0.61, 0.36, 1]
};

// ============================================================================
// FLOWING GRADIENT SYSTEM
// ============================================================================
const InfluenceFlow = ({ side, phase, mouseProximity }) => {
  const isCPI = side === 'cpi';
  
  // Motion characteristics
  const baseSpeed = isCPI ? 0.06 : 0.09;
  const flowOffset = Math.sin(phase * baseSpeed) * 25;
  const breathe = Math.sin(phase * 0.08) * 8;
  
  // Color and gradient config
  const flowGradient = isCPI
    ? `radial-gradient(ellipse 85% 100% at ${20 + flowOffset}% 50%, 
        rgba(255, 190, 90, 0.12) 0%, 
        rgba(200, 140, 70, 0.08) 25%,
        rgba(160, 120, 60, 0.04) 50%,
        transparent 75%)`
    : `radial-gradient(ellipse 85% 100% at ${80 - flowOffset}% 50%, 
        rgba(110, 160, 210, 0.11) 0%, 
        rgba(90, 130, 170, 0.07) 25%,
        rgba(70, 110, 150, 0.04) 50%,
        transparent 75%)`;

  const denseLayer = isCPI
    ? `radial-gradient(ellipse 70% 85% at ${15 + breathe}% 48%, 
        rgba(220, 150, 60, 0.08) 0%, 
        rgba(180, 120, 50, 0.04) 40%,
        transparent 70%)`
    : `radial-gradient(ellipse 70% 85% at ${85 - breathe}% 52%, 
        rgba(80, 120, 170, 0.08) 0%, 
        rgba(60, 100, 150, 0.04) 40%,
        transparent 70%)`;

  return (
    <div 
      className="absolute inset-0 pointer-events-none"
      style={{
        left: isCPI ? 0 : 'auto',
        right: isCPI ? 'auto' : 0,
        width: '50%'
      }}
    >
      {/* Primary flow */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          background: flowGradient,
          filter: 'blur(80px)',
          opacity: 0.9 + (mouseProximity * 0.15)
        }}
      />
      
      {/* Dense layer */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          background: denseLayer,
          filter: 'blur(60px)',
          opacity: 0.7
        }}
      />
    </div>
  );
};

// ============================================================================
// CONSENSUS CORE — Center Equilibrium
// ============================================================================
const ConsensusCore = ({ phase, isHovered }) => {
  const breatheScale = 1 + Math.sin(phase * 0.07) * 0.018;
  const shimmer = Math.sin(phase * 0.05) * 0.02;

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      {/* Core ambient field */}
      <motion.div
        style={{
          width: '45%',
          height: '75%',
          background: `radial-gradient(ellipse 90% 95% at ${50 + shimmer}% ${50 - shimmer}%, 
            rgba(150, 160, 180, 0.10) 0%, 
            rgba(170, 150, 140, 0.05) 35%,
            transparent 68%)`,
          filter: 'blur(90px)',
          transform: `scale(${breatheScale})`,
          opacity: 0.85
        }}
      />
      
      {/* Stabilization halo */}
      <div
        style={{
          position: 'absolute',
          width: '30%',
          height: '50%',
          background: 'radial-gradient(ellipse, rgba(255, 255, 255, 0.04) 0%, transparent 65%)',
          filter: 'blur(50px)',
          opacity: isHovered ? 0.9 : 0.7,
          transition: 'opacity 0.6s ease-out'
        }}
      />
    </div>
  );
};

// ============================================================================
// CONVERGENCE LINES — Subtle Directional Indicators
// ============================================================================
const ConvergenceLines = ({ phase }) => {
  const cpiFlow = Math.sin(phase * 0.08) * 8;
  const pceFlow = Math.sin(phase * 0.10) * 6;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* CPI → Center */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: `${12 + cpiFlow}%`,
          width: '32%',
          height: '1px',
          background: 'linear-gradient(90deg, rgba(255, 190, 90, 0.18) 0%, rgba(180, 150, 100, 0.10) 50%, transparent 100%)',
          filter: 'blur(2px)',
          opacity: 0.6,
          transform: 'translateY(-50%)'
        }}
      />

      {/* PCE → Center */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          right: `${12 - pceFlow}%`,
          width: '32%',
          height: '1px',
          background: 'linear-gradient(270deg, rgba(110, 160, 210, 0.18) 0%, rgba(100, 140, 180, 0.10) 50%, transparent 100%)',
          filter: 'blur(2px)',
          opacity: 0.6,
          transform: 'translateY(-50%)'
        }}
      />
    </div>
  );
};

// ============================================================================
// MAIN CONSENSUS FLOW
// ============================================================================
export default function InflationConsensusFlow() {
  const [isHovered, setIsHovered] = useState(false);
  const [mouseProximity, setMouseProximity] = useState(0);
  const [phase, setPhase] = useState(0);
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const fieldRef = useRef(null);

  // Reduced motion detection
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldReduceMotion(mediaQuery.matches);
    const handler = (e) => setShouldReduceMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Continuous phase animation
  useEffect(() => {
    if (shouldReduceMotion) return;

    let rafId;
    let startTime = Date.now();

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      setPhase(elapsed);
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [shouldReduceMotion]);

  // Mouse proximity tracking
  const handleMouseMove = (e) => {
    if (!fieldRef.current || shouldReduceMotion) return;
    const rect = fieldRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distance = Math.sqrt(
      Math.pow(e.clientX - centerX, 2) + 
      Math.pow(e.clientY - centerY, 2)
    );
    const maxDistance = Math.sqrt(Math.pow(rect.width / 2, 2) + Math.pow(rect.height / 2, 2));
    const proximity = Math.max(0, 1 - (distance / maxDistance));
    setMouseProximity(proximity * 0.3);
  };

  return (
    <motion.div
      ref={fieldRef}
      className="relative overflow-hidden cursor-default"
      style={{
        height: '420px',
        background: 'linear-gradient(180deg, rgba(16, 20, 28, 0.75) 0%, rgba(12, 16, 22, 0.88) 100%)',
        backdropFilter: 'blur(50px) saturate(165%)',
        WebkitBackdropFilter: 'blur(50px) saturate(165%)',
        borderRadius: '32px',
        boxShadow: `
          inset 0 1px 0 rgba(255,255,255,0.04),
          inset 0 0 80px rgba(0,0,0,0.25),
          0 20px 60px -15px rgba(0,0,0,0.45)
        `
      }}
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1.2, delay: 0.3, ease: MOTION.ease }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMouseProximity(0);
      }}
      whileHover={{
        y: -3,
        boxShadow: `
          inset 0 1px 0 rgba(255,255,255,0.05),
          inset 0 0 80px rgba(0,0,0,0.25),
          0 24px 70px -15px rgba(0,0,0,0.55),
          0 0 40px rgba(150, 160, 180, 0.04)
        `
      }}
    >
      {/* Noise Texture */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.90' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        opacity: 0.012,
        mixBlendMode: 'overlay',
        borderRadius: '32px',
        pointerEvents: 'none'
      }} />

      {/* Depth Fog Layer */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 80% 75% at 50% 52%, transparent 40%, rgba(5, 8, 12, 0.45) 100%)',
        pointerEvents: 'none',
        borderRadius: '32px'
      }} />

      {/* === FLOWING INFLUENCES === */}
      {!shouldReduceMotion && (
        <>
          <InfluenceFlow side="cpi" phase={phase} mouseProximity={mouseProximity} />
          <InfluenceFlow side="pce" phase={phase} mouseProximity={mouseProximity} />
          <ConsensusCore phase={phase} isHovered={isHovered} />
          <ConvergenceLines phase={phase} />
        </>
      )}

      {/* Reduced motion fallback gradient */}
      {shouldReduceMotion && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `
            linear-gradient(90deg, 
              rgba(255, 190, 90, 0.08) 0%, 
              rgba(150, 160, 180, 0.06) 50%,
              rgba(110, 160, 210, 0.08) 100%)
          `,
          filter: 'blur(70px)',
          opacity: 0.7,
          pointerEvents: 'none'
        }} />
      )}

      {/* === LABELS === */}
      {/* CPI Label */}
      <motion.div
        className="absolute"
        style={{
          top: '36px',
          left: '48px'
        }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, delay: 0.8, ease: MOTION.easeSoft }}
      >
        <div 
          className="text-xs font-bold uppercase tracking-wider mb-1.5"
          style={{
            color: 'rgba(255, 200, 110, 0.68)',
            letterSpacing: '0.18em'
          }}
        >
          CPI
        </div>
        <div 
          className="text-sm font-medium"
          style={{
            color: 'rgba(255,255,255,0.46)',
            letterSpacing: '0.01em'
          }}
        >
          Everyday Prices
        </div>
      </motion.div>

      {/* PCE Label */}
      <motion.div
        className="absolute"
        style={{
          top: '36px',
          right: '48px',
          textAlign: 'right'
        }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, delay: 0.9, ease: MOTION.easeSoft }}
      >
        <div 
          className="text-xs font-bold uppercase tracking-wider mb-1.5"
          style={{
            color: 'rgba(110, 180, 230, 0.68)',
            letterSpacing: '0.18em'
          }}
        >
          PCE
        </div>
        <div 
          className="text-sm font-medium"
          style={{
            color: 'rgba(255,255,255,0.46)',
            letterSpacing: '0.01em'
          }}
        >
          How People Spend
        </div>
      </motion.div>

      {/* === CONSENSUS CORE TEXT === */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
        {/* Top Divider */}
        <motion.div
          style={{
            width: '60px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)',
            marginBottom: '32px'
          }}
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.7, delay: 1.3, ease: MOTION.easeSoft }}
        />

        {/* Consensus Label */}
        <motion.div
          className="text-xs font-bold uppercase tracking-wider mb-4"
          style={{
            color: 'rgba(255,255,255,0.42)',
            letterSpacing: '0.22em'
          }}
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1, ease: MOTION.easeSoft }}
        >
          Inflation Consensus
        </motion.div>

        {/* Main State */}
        <motion.div
          className="text-5xl md:text-6xl font-bold mb-7 relative"
          style={{
            color: 'rgba(255,255,255,0.98)',
            letterSpacing: '-0.025em',
            textAlign: 'center'
          }}
          initial={{ opacity: 0, scale: 0.90 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            textShadow: isHovered 
              ? '0 0 32px rgba(255, 255, 255, 0.22), 0 4px 30px rgba(0,0,0,0.45)'
              : '0 0 22px rgba(255, 255, 255, 0.14), 0 4px 30px rgba(0,0,0,0.45)'
          }}
          transition={{ 
            opacity: { duration: 1.0, delay: 1.2, ease: MOTION.ease },
            scale: { duration: 1.0, delay: 1.2, ease: MOTION.ease },
            textShadow: { duration: 0.5, ease: MOTION.easeSoft }
          }}
        >
          Still Elevated

          {/* Text subsurface glow */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '150%',
            height: '130%',
            background: 'radial-gradient(ellipse, rgba(255, 255, 255, 0.05) 0%, transparent 62%)',
            filter: 'blur(45px)',
            zIndex: -1,
            pointerEvents: 'none'
          }} />
        </motion.div>

        {/* Subline */}
        <motion.p
          className="text-base md:text-lg leading-relaxed text-center px-10"
          style={{
            color: 'rgba(218, 228, 245, 0.86)',
            fontWeight: 440,
            maxWidth: '580px'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 1.5, ease: MOTION.easeSoft }}
        >
          Both CPI and PCE still show pressure.
        </motion.p>

        {/* Bottom Divider */}
        <motion.div
          style={{
            width: '60px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)',
            marginTop: '32px'
          }}
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.7, delay: 1.6, ease: MOTION.easeSoft }}
        />
      </div>

      {/* Top Specular Highlight */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '8%',
        right: '8%',
        height: '2px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
        pointerEvents: 'none',
        filter: 'blur(1.2px)'
      }} />

      {/* Hover Clarity Layer */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.025) 0%, transparent 65%)',
          borderRadius: '32px'
        }}
        animate={{
          opacity: isHovered ? 1 : 0
        }}
        transition={{ duration: 0.6, ease: MOTION.easeSoft }}
      />

      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
          }
        }
      `}</style>
    </motion.div>
  );
}