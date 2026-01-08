// 🔒 OS HORIZON INFLATION PRESSURE FIELD — Signature Component
// Compliance: CEP Engine, Calm Technology, VisionOS Depth
// Last Updated: 2026-01-08

import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

// ============================================================================
// MOTION DNA
// ============================================================================
const MOTION = {
  ease: [0.16, 1, 0.3, 1],
  easeSoft: [0.22, 0.61, 0.36, 1],
  breathe: 14
};

// ============================================================================
// INFLATION PRESSURE FIELD — Organic Atmospheric Hero
// ============================================================================
export default function InflationPressureField({ state, subline }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [breathPhase, setBreathPhase] = useState(0);
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const containerRef = useRef(null);

  // Mouse position tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring-based parallax
  const springConfig = { stiffness: 80, damping: 40, mass: 1.2 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Transform mouse position to subtle offset
  const pressureShiftX = useTransform(smoothMouseX, [-300, 300], [-15, 15]);
  const pressureShiftY = useTransform(smoothMouseY, [-300, 300], [-10, 10]);

  // Check for reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldReduceMotion(mediaQuery.matches);
    const handler = (e) => setShouldReduceMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Breathing animation loop
  useEffect(() => {
    if (shouldReduceMotion) return;

    let rafId;
    let startTime = Date.now();

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      setBreathPhase(elapsed);
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [shouldReduceMotion]);

  // Mouse movement handler
  const handleMouseMove = (e) => {
    if (!containerRef.current || shouldReduceMotion) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  // Breathing calculations
  const breathScale = 1 + Math.sin(breathPhase * (2 * Math.PI / MOTION.breathe)) * 0.03;
  const breathOpacity = 0.5 + Math.sin(breathPhase * (2 * Math.PI / MOTION.breathe)) * 0.15;
  const breathShift = Math.sin(breathPhase * (2 * Math.PI / MOTION.breathe)) * 8;

  return (
    <motion.div
      ref={containerRef}
      className="relative overflow-hidden cursor-default"
      style={{
        height: '380px',
        borderRadius: '36px',
        background: 'transparent'
      }}
      initial={{ opacity: 0, y: 40, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1.2, delay: 0.3, ease: MOTION.ease }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ===== PRESSURE FIELD BACKGROUND ===== */}
      
      {/* Base Gradient Field — Organic Flow */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 140% 120% at 50% 55%, 
              rgba(15, 18, 22, 0.95) 0%, 
              rgba(20, 24, 30, 0.90) 40%,
              rgba(25, 28, 35, 0.85) 100%
            )
          `,
          borderRadius: '36px'
        }}
      />

      {/* Amber Pressure Layer — Warm Inward Compression */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 110% 95% at ${48 + breathShift * 0.3}% ${45 + breathShift * 0.2}%, 
              rgba(255, 180, 90, ${breathOpacity * 0.18}) 0%, 
              rgba(230, 160, 70, ${breathOpacity * 0.12}) 30%,
              rgba(200, 140, 60, ${breathOpacity * 0.06}) 55%,
              transparent 75%
            )
          `,
          filter: 'blur(60px)',
          mixBlendMode: 'screen',
          transformOrigin: 'center',
          x: pressureShiftX,
          y: pressureShiftY
        }}
        animate={{
          scale: breathScale,
          opacity: breathOpacity
        }}
        transition={{
          duration: MOTION.breathe,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      {/* Graphite Resistance Layer — Cool Outer Push */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 135% 110% at 50% 50%, 
              transparent 40%,
              rgba(80, 95, 120, 0.10) 65%,
              rgba(60, 72, 95, 0.16) 85%,
              rgba(40, 50, 70, 0.22) 100%
            )
          `,
          filter: 'blur(50px)',
          mixBlendMode: 'multiply',
          borderRadius: '36px'
        }}
        animate={{
          scale: 1 + Math.sin(breathPhase * (2 * Math.PI / MOTION.breathe) + Math.PI) * 0.02
        }}
        transition={{
          duration: MOTION.breathe,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      {/* Secondary Amber Tendrils — Asymmetric Pressure */}
      <motion.div
        className="absolute"
        style={{
          top: '15%',
          left: '10%',
          width: '45%',
          height: '50%',
          background: 'radial-gradient(ellipse, rgba(255, 190, 95, 0.08) 0%, transparent 65%)',
          filter: 'blur(70px)',
          mixBlendMode: 'screen',
          x: pressureShiftX,
          y: pressureShiftY
        }}
        animate={{
          opacity: [0.4, 0.6, 0.4],
          scale: [1, 1.08, 1]
        }}
        transition={{
          duration: MOTION.breathe * 1.2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      <motion.div
        className="absolute"
        style={{
          bottom: '20%',
          right: '15%',
          width: '40%',
          height: '45%',
          background: 'radial-gradient(ellipse, rgba(220, 150, 70, 0.07) 0%, transparent 60%)',
          filter: 'blur(65px)',
          mixBlendMode: 'screen',
          x: useTransform(pressureShiftX, (x) => -x * 0.7),
          y: useTransform(pressureShiftY, (y) => -y * 0.7)
        }}
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.06, 1]
        }}
        transition={{
          duration: MOTION.breathe * 1.3,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2
        }}
      />

      {/* Depth Vignette — Realistic Edge Darkening */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 85% 75% at 50% 50%, transparent 45%, rgba(5, 8, 12, 0.50) 100%)',
          borderRadius: '36px',
          pointerEvents: 'none'
        }}
      />

      {/* Ambient Noise Grain */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        opacity: 0.018,
        mixBlendMode: 'overlay',
        borderRadius: '36px',
        pointerEvents: 'none'
      }} />

      {/* Outer Glass Surface */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(0,0,0,0.08) 100%)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          borderRadius: '36px',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
          pointerEvents: 'none'
        }}
      />

      {/* ===== COMPRESSION CORE (TEXT LAYER) ===== */}
      
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="relative text-center"
          initial={{ opacity: 0, y: 15, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.0, delay: 1.0, ease: MOTION.ease }}
        >
          {/* Compression Zone — Liquid Glass Refraction */}
          <motion.div
            className="absolute"
            style={{
              inset: '-60px -80px',
              background: `
                radial-gradient(ellipse 100% 90% at 50% 50%, 
                  rgba(255, 200, 100, 0.05) 0%, 
                  rgba(255, 220, 120, 0.03) 30%,
                  transparent 65%
                )
              `,
              backdropFilter: 'blur(20px) brightness(1.08)',
              WebkitBackdropFilter: 'blur(20px) brightness(1.08)',
              borderRadius: '50%',
              pointerEvents: 'none',
              zIndex: 0
            }}
            animate={{
              scale: isHovered ? 1.08 : breathScale,
              opacity: isHovered ? 0.85 : breathOpacity * 0.7
            }}
            transition={isHovered ? {
              duration: 0.6,
              ease: MOTION.easeSoft
            } : {
              duration: MOTION.breathe,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />

          {/* Contrast Tightening Layer on Hover */}
          <motion.div
            className="absolute"
            style={{
              inset: '-50px -70px',
              background: 'radial-gradient(ellipse, rgba(0,0,0,0.15) 0%, transparent 70%)',
              filter: 'blur(40px)',
              borderRadius: '50%',
              pointerEvents: 'none',
              zIndex: 0
            }}
            animate={{
              opacity: isHovered ? 0.6 : 0
            }}
            transition={{ duration: 0.5, ease: MOTION.easeSoft }}
          />

          {/* Soft Background Glow on Hover */}
          <motion.div
            className="absolute"
            style={{
              inset: '-70px -90px',
              background: 'radial-gradient(ellipse, rgba(255, 200, 100, 0.12) 0%, transparent 65%)',
              filter: 'blur(50px)',
              borderRadius: '50%',
              pointerEvents: 'none',
              zIndex: 0
            }}
            animate={{
              opacity: isHovered ? 0.5 : 0,
              scale: isHovered ? 1.15 : 1
            }}
            transition={{ duration: 0.7, ease: MOTION.easeSoft }}
          />

          {/* Text Content */}
          <div className="relative z-10">
            {/* Label */}
            <motion.div
              className="text-xs font-bold uppercase tracking-wider mb-3"
              style={{
                color: 'rgba(255, 190, 100, 0.80)',
                letterSpacing: '0.20em',
                textShadow: '0 0 18px rgba(255, 190, 100, 0.25)'
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2, ease: MOTION.easeSoft }}
            >
              Inflation Pressure
            </motion.div>

            {/* State */}
            <motion.h2
              className="text-6xl font-bold mb-6"
              style={{
                color: 'rgba(255,255,255,0.98)',
                letterSpacing: '-0.025em',
                textShadow: `
                  0 0 30px rgba(255, 200, 100, 0.08),
                  0 4px 24px rgba(0,0,0,0.40)
                `
              }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.3, ease: MOTION.ease }}
              whileHover={{
                textShadow: `
                  0 0 35px rgba(255, 200, 100, 0.12),
                  0 4px 24px rgba(0,0,0,0.40)
                `
              }}
            >
              {state}
            </motion.h2>

            {/* Subline */}
            <motion.p
              className="text-base max-w-lg mx-auto leading-relaxed"
              style={{
                color: 'rgba(220, 230, 245, 0.85)',
                fontWeight: 450,
                textShadow: '0 2px 16px rgba(0,0,0,0.30)'
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 1.5, ease: MOTION.easeSoft }}
            >
              {subline}
            </motion.p>
          </div>
        </motion.div>
      </div>

      {/* ===== ATMOSPHERIC ENHANCEMENTS ===== */}

      {/* Subsurface Lighting — Bottom Uplift */}
      <motion.div
        className="absolute"
        style={{
          bottom: '-15%',
          left: '20%',
          width: '60%',
          height: '40%',
          background: 'radial-gradient(ellipse, rgba(255, 185, 85, 0.06) 0%, transparent 70%)',
          filter: 'blur(55px)',
          pointerEvents: 'none'
        }}
        animate={{
          opacity: [0.4, 0.6, 0.4]
        }}
        transition={{
          duration: MOTION.breathe * 1.1,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1.5
        }}
      />

      {/* Edge Rim Light — Subtle Top Highlight */}
      <div
        className="absolute"
        style={{
          top: 0,
          left: '15%',
          right: '15%',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
          filter: 'blur(1px)',
          pointerEvents: 'none'
        }}
      />

      {/* Hover Interaction Feedback */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(255, 200, 100, 0.04) 0%, transparent 60%)',
          filter: 'blur(45px)',
          borderRadius: '36px',
          pointerEvents: 'none'
        }}
        animate={{
          opacity: isHovered ? 0.8 : 0,
          scale: isHovered ? 1.12 : 1
        }}
        transition={{ duration: 0.7, ease: MOTION.easeSoft }}
      />

      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </motion.div>
  );
}