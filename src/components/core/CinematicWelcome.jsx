import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';

// Apple-grade easing curves
const APPLE_EASING = {
  entrance: [0.16, 1, 0.3, 1],        // Smooth ease-out
  reveal: [0.22, 0.61, 0.36, 1],      // Gentle reveal
  settle: [0.32, 0.72, 0, 1],         // Precise settle
  breathe: [0.4, 0, 0.2, 1],          // Subtle animation
};

const TIMINGS = {
  logoScale: 0.8,
  logoReveal: 1.2,
  textFade: 0.6,
  particleSpread: 2.0,
  holdPeak: 0.4,
  fadeOut: 0.6,
  total: 5000, // Total animation duration in ms
};

export default function CinematicWelcome({ onComplete, userEmail = '' }) {
  const [phase, setPhase] = useState('init'); // init → reveal → peak → settle → exit
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    const timeout1 = setTimeout(() => setPhase('reveal'), 100);
    const timeout2 = setTimeout(() => setPhase('peak'), 1400);
    const timeout3 = setTimeout(() => setPhase('settle'), 2200);
    const timeout4 = setTimeout(() => setPhase('exit'), 4200);
    const timeout5 = setTimeout(() => onComplete?.(), TIMINGS.total);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
      clearTimeout(timeout4);
      clearTimeout(timeout5);
    };
  }, [onComplete]);

  // Particle field animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    
    const resize = () => {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    // Generate particles
    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.6 + 0.2,
      phase: Math.random() * Math.PI * 2,
    }));

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const t = Math.min(elapsed / TIMINGS.total, 1);

      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;

      // Clear
      ctx.clearRect(0, 0, w, h);

      // Particle opacity based on phase
      let globalAlpha = 0;
      if (elapsed < 800) {
        globalAlpha = elapsed / 800;
      } else if (elapsed < 3500) {
        globalAlpha = 1;
      } else {
        globalAlpha = Math.max(0, 1 - (elapsed - 3500) / 1500);
      }

      particles.forEach((p) => {
        // Subtle drift
        p.x += p.vx * 0.0005;
        p.y += p.vy * 0.0005;

        // Wrap around
        if (p.x < 0) p.x = 1;
        if (p.x > 1) p.x = 0;
        if (p.y < 0) p.y = 1;
        if (p.y > 1) p.y = 0;

        // Draw particle with glow
        const px = p.x * w;
        const py = p.y * h;
        const twinkle = (Math.sin(p.phase + elapsed * 0.002) + 1) / 2;
        
        ctx.globalAlpha = p.alpha * twinkle * globalAlpha;
        
        // Outer glow
        const gradient = ctx.createRadialGradient(px, py, 0, px, py, p.size * 4);
        gradient.addColorStop(0, 'rgba(160, 191, 255, 0.6)');
        gradient.addColorStop(0.5, 'rgba(160, 191, 255, 0.2)');
        gradient.addColorStop(1, 'rgba(160, 191, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(px - p.size * 4, py - p.size * 4, p.size * 8, p.size * 8);

        // Core
        ctx.globalAlpha = p.alpha * globalAlpha;
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === 'exit' ? 0 : 1 }}
      transition={{ duration: TIMINGS.fadeOut, ease: APPLE_EASING.breathe }}
      style={{
        background: 'linear-gradient(135deg, #0B0E13 0%, #151922 100%)',
      }}
    >
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.4 }}
      />

      {/* Ambient gradient orbs */}
      <motion.div
        className="absolute inset-0 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 'reveal' || phase === 'peak' ? 0.3 : 0 }}
        transition={{ duration: 1.5, ease: APPLE_EASING.breathe }}
      >
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(124, 58, 237, 0.4) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.35) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
          animate={{
            scale: [1, 1.15, 1],
            x: [0, -30, 0],
            y: [0, 20, 0],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo reveal */}
        <AnimatePresence mode="wait">
          {(phase === 'reveal' || phase === 'peak' || phase === 'settle') && (
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ 
                scale: phase === 'peak' ? 1.05 : 1,
                opacity: 1,
              }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{
                scale: { 
                  duration: phase === 'peak' ? 0.8 : 1.2, 
                  ease: phase === 'peak' ? APPLE_EASING.reveal : APPLE_EASING.settle,
                  type: 'spring',
                  stiffness: 100,
                  damping: 20
                },
                opacity: { duration: 0.6, ease: APPLE_EASING.entrance }
              }}
              className="mb-8"
            >
              {/* Glass container for logo */}
              <motion.div
                className="relative rounded-[32px] p-8 backdrop-blur-2xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  boxShadow: '0 20px 80px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                }}
                animate={phase === 'peak' ? {
                  boxShadow: [
                    '0 20px 80px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                    '0 25px 100px rgba(110, 150, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
                    '0 20px 80px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                  ]
                } : {}}
                transition={{ duration: 2, ease: 'easeInOut' }}
              >
                {/* Ambient glow behind logo */}
                <motion.div
                  className="absolute inset-0 rounded-[32px]"
                  style={{
                    background: 'radial-gradient(circle at 50% 50%, rgba(110, 150, 255, 0.15) 0%, transparent 70%)',
                  }}
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* Logo */}
                <motion.img
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68943f7eb0fb9393bf9a8069/ea91941d0_Asset61xtransparent.png"
                  alt="Vireon"
                  className="w-20 h-20 relative z-10"
                  style={{
                    filter: 'drop-shadow(0 0 24px rgba(110, 150, 255, 0.6))',
                  }}
                  animate={phase === 'peak' ? {
                    filter: [
                      'drop-shadow(0 0 24px rgba(110, 150, 255, 0.6))',
                      'drop-shadow(0 0 32px rgba(110, 150, 255, 0.8))',
                      'drop-shadow(0 0 24px rgba(110, 150, 255, 0.6))',
                    ]
                  } : {}}
                  transition={{ duration: 2, ease: 'easeInOut' }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Brand name reveal */}
        <AnimatePresence mode="wait">
          {(phase === 'peak' || phase === 'settle') && (
            <motion.h1
              initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10 }}
              transition={{
                duration: 1.0,
                ease: APPLE_EASING.reveal,
              }}
              className="text-6xl font-bold mb-4"
              style={{
                background: 'linear-gradient(135deg, #FFFFFF 0%, #A0BFFF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.03em',
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
              }}
            >
              Vireon
            </motion.h1>
          )}
        </AnimatePresence>

        {/* Tagline */}
        <AnimatePresence mode="wait">
          {(phase === 'settle') && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.2,
                ease: APPLE_EASING.entrance,
              }}
              className="text-lg"
              style={{
                color: 'rgba(255, 255, 255, 0.65)',
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                letterSpacing: '0.01em',
                fontWeight: 400,
              }}
            >
              Your market intelligence platform
            </motion.p>
          )}
        </AnimatePresence>

        {/* Subtle progress indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, width: 0 }}
          animate={{ 
            opacity: phase === 'exit' ? 0 : 0.3,
            width: phase === 'exit' ? 0 : '120px',
          }}
          transition={{ duration: 0.6, ease: APPLE_EASING.entrance }}
        >
          <div className="h-1 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-400/60 to-purple-400/60 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{
                duration: TIMINGS.total / 1000,
                ease: 'linear',
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Light sweep effect */}
      <AnimatePresence>
        {phase === 'peak' && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            exit={{ opacity: 0 }}
            transition={{
              x: { duration: 1.2, ease: APPLE_EASING.entrance },
              opacity: { duration: 0.3 }
            }}
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.08) 50%, transparent 100%)',
              width: '200%',
            }}
          />
        )}
      </AnimatePresence>

      {/* Radial flash at peak */}
      <AnimatePresence>
        {phase === 'peak' && (
          <motion.div
            className="absolute inset-0 pointer-events-none flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.4, scale: 1.5 }}
            exit={{ opacity: 0, scale: 2 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div
              className="w-64 h-64 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(160, 191, 255, 0.4) 0%, transparent 70%)',
                filter: 'blur(60px)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}