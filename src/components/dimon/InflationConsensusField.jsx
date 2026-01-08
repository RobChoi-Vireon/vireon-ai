// 🔒 OS HORIZON INFLATION CONSENSUS FIELD — Signature Hero
// Purpose: Visual synthesis of CPI/PCE agreement through flowing convergence
// Compliance: VisionOS depth, macOS Tahoe glass, Steve Jobs clarity

import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

// ============================================================================
// MOTION DNA
// ============================================================================
const MOTION = {
  ease: [0.16, 1, 0.3, 1],
  easeSoft: [0.22, 0.61, 0.36, 1],
  flow: { type: 'spring', stiffness: 40, damping: 35, mass: 1.2 },
  parallax: { type: 'spring', stiffness: 80, damping: 28, mass: 0.8 }
};

// ============================================================================
// FLOWING PARTICLE FIELD — Organic Motion System
// ============================================================================
const FlowingField = ({ children, mouseOffset, region }) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
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
  }, []);

  // Motion characteristics per region
  const motionConfig = {
    cpi: {
      speed: 0.08,
      amplitude: 3.5,
      density: 0.9,
      flowX: -1.5,
      flowY: 0.8
    },
    pce: {
      speed: 0.12,
      amplitude: 2.8,
      density: 0.85,
      flowX: 1.5,
      flowY: 0.6
    }
  }[region] || { speed: 0.1, amplitude: 3, density: 0.85, flowX: 0, flowY: 0 };

  const flowX = Math.sin(phase * motionConfig.speed) * motionConfig.amplitude + motionConfig.flowX;
  const flowY = Math.cos(phase * motionConfig.speed * 0.7) * (motionConfig.amplitude * 0.6) + motionConfig.flowY;

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      animate={{
        x: flowX + (mouseOffset?.x || 0) * (region === 'cpi' ? -2 : 2),
        y: flowY + (mouseOffset?.y || 0) * 1.5
      }}
      transition={MOTION.flow}
    >
      {children}
    </motion.div>
  );
};

// ============================================================================
// MAIN CONSENSUS FIELD
// ============================================================================
export default function InflationConsensusField() {
  const [isHovered, setIsHovered] = useState(false);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const fieldRef = useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldReduceMotion(mediaQuery.matches);
    const handler = (e) => setShouldReduceMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const handleMouseMove = (e) => {
    if (!fieldRef.current || shouldReduceMotion) return;
    const rect = fieldRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 15;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 12;
    setMouseOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMouseOffset({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={fieldRef}
      className="relative overflow-hidden cursor-default"
      style={{
        height: '420px',
        background: 'linear-gradient(180deg, rgba(18, 22, 30, 0.70) 0%, rgba(15, 18, 25, 0.85) 100%)',
        backdropFilter: 'blur(50px) saturate(165%)',
        WebkitBackdropFilter: 'blur(50px) saturate(165%)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '32px',
        boxShadow: `
          inset 0 1px 0 rgba(255,255,255,0.05),
          inset 0 0 60px rgba(0,0,0,0.20),
          0 20px 60px -15px rgba(0,0,0,0.40)
        `
      }}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1.0, delay: 0.3, ease: MOTION.ease }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileHover={{
        y: -3,
        boxShadow: `
          inset 0 1px 0 rgba(255,255,255,0.06),
          inset 0 0 60px rgba(0,0,0,0.20),
          0 24px 70px -15px rgba(0,0,0,0.50),
          0 0 35px rgba(255, 200, 100, 0.04)
        `
      }}
    >
      {/* Noise Texture */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        opacity: 0.015,
        mixBlendMode: 'overlay',
        borderRadius: '32px',
        pointerEvents: 'none'
      }} />

      {/* === LEFT REGION: CPI Influence === */}
      <FlowingField mouseOffset={mouseOffset} region="cpi">
        {/* Warm amber subsurface */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '-15%',
          width: '55%',
          height: '80%',
          background: 'radial-gradient(ellipse 100% 90% at 30% 50%, rgba(255, 190, 90, 0.08) 0%, rgba(200, 140, 60, 0.04) 40%, transparent 70%)',
          filter: 'blur(60px)',
          opacity: 0.7
        }} />

        {/* Charcoal depth */}
        <div style={{
          position: 'absolute',
          top: '30%',
          left: '-5%',
          width: '45%',
          height: '60%',
          background: 'radial-gradient(ellipse 80% 100% at 35% 50%, rgba(60, 50, 40, 0.20) 0%, transparent 65%)',
          filter: 'blur(50px)',
          opacity: 0.6
        }} />
      </FlowingField>

      {/* === RIGHT REGION: PCE Influence === */}
      <FlowingField mouseOffset={mouseOffset} region="pce">
        {/* Cool graphite subsurface */}
        <div style={{
          position: 'absolute',
          top: '10%',
          right: '-15%',
          width: '55%',
          height: '80%',
          background: 'radial-gradient(ellipse 100% 90% at 70% 50%, rgba(90, 130, 180, 0.08) 0%, rgba(70, 100, 140, 0.04) 40%, transparent 70%)',
          filter: 'blur(60px)',
          opacity: 0.7
        }} />

        {/* Blue-gray depth */}
        <div style={{
          position: 'absolute',
          top: '30%',
          right: '-5%',
          width: '45%',
          height: '60%',
          background: 'radial-gradient(ellipse 80% 100% at 65% 50%, rgba(50, 60, 80, 0.18) 0%, transparent 65%)',
          filter: 'blur(50px)',
          opacity: 0.6
        }} />
      </FlowingField>

      {/* === CENTER REGION: Convergence Field === */}
      <motion.div
        className="absolute inset-0 pointer-events-none flex items-center justify-center"
        animate={{
          opacity: [0.5, 0.65, 0.5]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        {/* Convergence bloom */}
        <div style={{
          width: '50%',
          height: '70%',
          background: 'radial-gradient(ellipse 80% 90% at 50% 50%, rgba(130, 150, 180, 0.06) 0%, rgba(160, 140, 120, 0.03) 35%, transparent 65%)',
          filter: 'blur(70px)'
        }} />
      </motion.div>

      {/* === LABELS: CPI and PCE === */}
      {/* CPI Label */}
      <motion.div
        className="absolute"
        style={{
          top: '32px',
          left: '48px'
        }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.8, ease: MOTION.easeSoft }}
      >
        <div 
          className="text-xs font-bold uppercase tracking-wider mb-1"
          style={{
            color: 'rgba(255, 200, 110, 0.65)',
            letterSpacing: '0.18em'
          }}
        >
          CPI
        </div>
        <div 
          className="text-sm font-medium"
          style={{
            color: 'rgba(255,255,255,0.48)',
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
          top: '32px',
          right: '48px',
          textAlign: 'right'
        }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.9, ease: MOTION.easeSoft }}
      >
        <div 
          className="text-xs font-bold uppercase tracking-wider mb-1"
          style={{
            color: 'rgba(110, 160, 210, 0.65)',
            letterSpacing: '0.18em'
          }}
        >
          PCE
        </div>
        <div 
          className="text-sm font-medium"
          style={{
            color: 'rgba(255,255,255,0.48)',
            letterSpacing: '0.01em'
          }}
        >
          How People Spend
        </div>
      </motion.div>

      {/* === CONSENSUS CORE: Center Text === */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        {/* Top Divider */}
        <motion.div
          style={{
            width: '50px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent)',
            marginBottom: '28px'
          }}
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.6, delay: 1.2, ease: MOTION.easeSoft }}
        />

        {/* Consensus Label */}
        <motion.div
          className="text-xs font-bold uppercase tracking-wider mb-3"
          style={{
            color: 'rgba(255,255,255,0.45)',
            letterSpacing: '0.20em'
          }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.0, ease: MOTION.easeSoft }}
        >
          Inflation Consensus
        </motion.div>

        {/* Main State */}
        <motion.div
          className="text-5xl md:text-6xl font-bold mb-6 relative"
          style={{
            color: 'rgba(255,255,255,0.98)',
            letterSpacing: '-0.025em',
            textAlign: 'center'
          }}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 1.1, ease: MOTION.ease }}
        >
          {/* Text glow intensifies on hover */}
          <motion.div
            animate={{
              textShadow: isHovered 
                ? '0 0 30px rgba(255, 255, 255, 0.20), 0 4px 28px rgba(0,0,0,0.40)'
                : '0 0 20px rgba(255, 255, 255, 0.12), 0 4px 28px rgba(0,0,0,0.40)'
            }}
            transition={{ duration: 0.4, ease: MOTION.easeSoft }}
          >
            Still Elevated
          </motion.div>

          {/* Subsurface glow behind text */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '140%',
            height: '120%',
            background: 'radial-gradient(ellipse, rgba(255, 255, 255, 0.04) 0%, transparent 60%)',
            filter: 'blur(40px)',
            zIndex: -1,
            pointerEvents: 'none'
          }} />
        </motion.div>

        {/* Subline */}
        <motion.p
          className="text-base md:text-lg leading-relaxed text-center px-8"
          style={{
            color: 'rgba(220, 230, 245, 0.85)',
            fontWeight: 440,
            maxWidth: '560px'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.4, ease: MOTION.easeSoft }}
        >
          Both CPI and PCE agree: price pressure hasn't eased enough.
        </motion.p>

        {/* Bottom Divider */}
        <motion.div
          style={{
            width: '50px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent)',
            marginTop: '28px'
          }}
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.6, delay: 1.5, ease: MOTION.easeSoft }}
        />
      </div>

      {/* === CONVERGENCE LINES — Subtle Directional Flow === */}
      {!shouldReduceMotion && (
        <>
          {/* CPI → Center flow line */}
          <motion.div
            className="absolute pointer-events-none"
            style={{
              top: '50%',
              left: '10%',
              width: '35%',
              height: '1px',
              background: 'linear-gradient(90deg, rgba(255, 190, 90, 0.15) 0%, rgba(160, 140, 120, 0.08) 60%, transparent 100%)',
              filter: 'blur(1.5px)',
              transformOrigin: 'left center'
            }}
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 0.6, scaleX: 1 }}
            transition={{ duration: 1.2, delay: 1.6, ease: MOTION.ease }}
          />

          {/* PCE → Center flow line */}
          <motion.div
            className="absolute pointer-events-none"
            style={{
              top: '50%',
              right: '10%',
              width: '35%',
              height: '1px',
              background: 'linear-gradient(270deg, rgba(110, 160, 210, 0.15) 0%, rgba(120, 140, 170, 0.08) 60%, transparent 100%)',
              filter: 'blur(1.5px)',
              transformOrigin: 'right center'
            }}
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 0.6, scaleX: 1 }}
            transition={{ duration: 1.2, delay: 1.7, ease: MOTION.ease }}
          />
        </>
      )}

      {/* === DEPTH VIGNETTE === */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 85% 80% at 50% 50%, transparent 45%, rgba(8, 10, 14, 0.50) 100%)',
        pointerEvents: 'none',
        borderRadius: '32px'
      }} />

      {/* Top Specular Highlight */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '8%',
        right: '8%',
        height: '2px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)',
        pointerEvents: 'none',
        filter: 'blur(1px)'
      }} />

      {/* Hover Clarity Enhancement */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.02) 0%, transparent 60%)',
          borderRadius: '32px'
        }}
        animate={{
          opacity: isHovered ? 1 : 0
        }}
        transition={{ duration: 0.5, ease: MOTION.easeSoft }}
      />

      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </motion.div>
  );
}