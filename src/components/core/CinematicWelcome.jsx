import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform } from 'framer-motion';

// Apple-grade motion DNA
const APPLE = {
  spring: { type: 'spring', stiffness: 90, damping: 18, mass: 0.8 },
  gentle: [0.16, 1, 0.3, 1],
  precise: [0.32, 0.72, 0, 1],
  entrance: [0.25, 0.46, 0.45, 0.94],
  reveal: [0.22, 0.61, 0.36, 1],
};

export default function CinematicWelcome({ onComplete }) {
  const [phase, setPhase] = useState('void'); // void → breathe → reveal → illuminate → brand → settle → exit
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const timeRef = useRef(0);

  // Emotional arc timing - slower, more deliberate
  useEffect(() => {
    const timeline = [
      { delay: 100, phase: 'breathe' },      // Darkness breathes
      { delay: 1000, phase: 'reveal' },      // Light emerges
      { delay: 1900, phase: 'illuminate' },  // Logo appears
      { delay: 2700, phase: 'brand' },       // Name reveals
      { delay: 3500, phase: 'settle' },      // Everything settles
      { delay: 4500, phase: 'exit' },        // Graceful exit
      { delay: 5200, phase: 'complete' },    // Done
    ];

    const timers = timeline.map(({ delay, phase }) =>
      setTimeout(() => setPhase(phase), delay)
    );

    const completeTimer = setTimeout(() => onComplete?.(), 5400);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  // Sophisticated particle field
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    // Elegant particle system - fewer, more refined
    const particles = Array.from({ length: 50 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      size: Math.random() * 1.5 + 0.3,
      alpha: Math.random() * 0.4 + 0.3,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.5 + 0.5,
    }));

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      timeRef.current += 0.016;

      ctx.clearRect(0, 0, w, h);

      // Particle behavior based on phase
      let globalAlpha = 0;
      if (phase === 'breathe') globalAlpha = Math.min(1, timeRef.current / 1.5);
      else if (phase === 'reveal' || phase === 'illuminate') globalAlpha = 1;
      else if (phase === 'brand' || phase === 'settle') globalAlpha = 0.6;
      else if (phase === 'exit') globalAlpha = Math.max(0, 1 - timeRef.current * 0.5);

      particles.forEach((p) => {
        // Organic drift
        p.x += p.vx * 0.0003 * p.speed;
        p.y += p.vy * 0.0003 * p.speed;

        // Soft boundaries
        if (p.x < 0) p.x = 1;
        if (p.x > 1) p.x = 0;
        if (p.y < 0) p.y = 1;
        if (p.y > 1) p.y = 0;

        const px = p.x * w;
        const py = p.y * h;
        
        // Gentle twinkle
        const twinkle = (Math.sin(p.phase + timeRef.current * p.speed) + 1) / 2;
        const brightness = 0.5 + twinkle * 0.5;

        // Soft glow halo
        const glowRadius = p.size * 6;
        const glow = ctx.createRadialGradient(px, py, 0, px, py, glowRadius);
        glow.addColorStop(0, `rgba(160, 191, 255, ${0.3 * brightness * globalAlpha})`);
        glow.addColorStop(0.4, `rgba(160, 191, 255, ${0.1 * brightness * globalAlpha})`);
        glow.addColorStop(1, 'rgba(160, 191, 255, 0)');
        ctx.fillStyle = glow;
        ctx.fillRect(px - glowRadius, py - glowRadius, glowRadius * 2, glowRadius * 2);

        // Crisp core
        ctx.globalAlpha = brightness * globalAlpha * p.alpha;
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [phase]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === 'exit' ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: APPLE.gentle }}
      style={{
        background: 'linear-gradient(180deg, #0A0D12 0%, #0F1218 50%, #0A0D12 100%)',
      }}
    >
      {/* Particle field canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.5 }}
      />

      {/* Ambient atmospheric orbs - slow, organic movement */}
      <AnimatePresence>
        {(phase === 'breathe' || phase === 'reveal' || phase === 'illuminate' || phase === 'brand') && (
          <>
            <motion.div
              className="absolute"
              style={{
                top: '20%',
                left: '25%',
                width: '500px',
                height: '500px',
                background: 'radial-gradient(circle, rgba(124, 58, 237, 0.25) 0%, transparent 70%)',
                filter: 'blur(120px)',
                borderRadius: '50%',
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: [0, 0.4, 0.3],
                scale: [0.8, 1.1, 1],
                x: [0, 40, 0],
                y: [0, -30, 0],
              }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{
                opacity: { duration: 2.5, times: [0, 0.4, 1], ease: APPLE.gentle },
                scale: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
                x: { duration: 10, repeat: Infinity, ease: 'easeInOut' },
                y: { duration: 12, repeat: Infinity, ease: 'easeInOut' },
              }}
            />
            <motion.div
              className="absolute"
              style={{
                bottom: '15%',
                right: '20%',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
                filter: 'blur(140px)',
                borderRadius: '50%',
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: [0, 0.35, 0.25],
                scale: [0.8, 1.15, 1.05],
                x: [0, -50, 0],
                y: [0, 20, 0],
              }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{
                opacity: { duration: 2.8, times: [0, 0.5, 1], ease: APPLE.gentle },
                scale: { duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 1 },
                x: { duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 0.5 },
                y: { duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 0.8 },
              }}
            />
          </>
        )}
      </AnimatePresence>

      {/* Main content choreography */}
      <div className="relative z-10 flex flex-col items-center">
        
        {/* Logo emergence - the hero moment */}
        <AnimatePresence>
          {(phase === 'illuminate' || phase === 'brand' || phase === 'settle') && (
            <motion.div
              className="mb-12"
              initial={{ scale: 0.5, opacity: 0, filter: 'blur(20px)' }}
              animate={{ 
                scale: phase === 'brand' ? [1, 1.02, 1] : 1,
                opacity: 1,
                filter: 'blur(0px)',
              }}
              exit={{ scale: 0.95, opacity: 0, filter: 'blur(10px)' }}
              transition={{
                scale: { duration: 0.6, times: [0, 0.6, 1], ease: APPLE.reveal },
                opacity: { duration: 1.2, ease: APPLE.gentle },
                filter: { duration: 1.2, ease: APPLE.gentle },
              }}
            >
              {/* Premium glass frame */}
              <motion.div
                className="relative rounded-[40px] backdrop-blur-3xl overflow-hidden"
                style={{
                  padding: '48px',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.03) 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  boxShadow: `
                    0 30px 90px rgba(0, 0, 0, 0.5),
                    0 0 0 1px rgba(255, 255, 255, 0.08) inset,
                    0 1px 0 rgba(255, 255, 255, 0.15) inset
                  `,
                }}
                animate={phase === 'brand' ? {
                  boxShadow: [
                    `0 30px 90px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.08) inset, 0 1px 0 rgba(255, 255, 255, 0.15) inset`,
                    `0 35px 110px rgba(110, 150, 255, 0.35), 0 0 0 1px rgba(160, 191, 255, 0.18) inset, 0 1px 0 rgba(255, 255, 255, 0.2) inset`,
                    `0 30px 90px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.08) inset, 0 1px 0 rgba(255, 255, 255, 0.15) inset`,
                  ]
                } : {}}
                transition={{ duration: 3, ease: 'easeInOut' }}
              >
                {/* Specular highlight */}
                <div
                  className="absolute top-0 left-[15%] right-[15%] h-[2px]"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
                    filter: 'blur(1px)',
                  }}
                />

                {/* Ambient inner glow */}
                <motion.div
                  className="absolute inset-0 rounded-[40px]"
                  style={{
                    background: 'radial-gradient(ellipse at 50% 40%, rgba(110, 150, 255, 0.12) 0%, transparent 65%)',
                  }}
                  animate={{
                    opacity: [0.4, 0.7, 0.4],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* Logo with perfect lighting */}
                <motion.div className="relative">
                  <motion.img
                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68943f7eb0fb9393bf9a8069/ea91941d0_Asset61xtransparent.png"
                    alt="Vireon"
                    className="w-24 h-24 relative z-10"
                    initial={{ scale: 0.7, opacity: 0, rotateY: -15 }}
                    animate={{ 
                      scale: 1,
                      opacity: 1,
                      rotateY: 0,
                      filter: [
                        'drop-shadow(0 0 30px rgba(110, 150, 255, 0.7))',
                        'drop-shadow(0 0 40px rgba(110, 150, 255, 0.9))',
                        'drop-shadow(0 0 30px rgba(110, 150, 255, 0.7))',
                      ]
                    }}
                    transition={{
                      scale: { ...APPLE.spring, duration: 1.4 },
                      opacity: { duration: 1.0, ease: APPLE.gentle },
                      rotateY: { duration: 1.2, ease: APPLE.precise },
                      filter: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
                    }}
                    style={{
                      transformStyle: 'preserve-3d',
                      perspective: '1000px',
                    }}
                  />
                  
                  {/* Logo halo - pulsing luminance */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: 'radial-gradient(circle, rgba(160, 191, 255, 0.4) 0%, transparent 70%)',
                      filter: 'blur(50px)',
                    }}
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Brand name - precision typography */}
        <AnimatePresence>
          {(phase === 'brand' || phase === 'settle') && (
            <motion.div
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
              transition={{
                duration: 1.3,
                ease: APPLE.reveal,
              }}
            >
              <h1
                className="text-7xl font-bold mb-3"
                style={{
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #C8D9FF 50%, #FFFFFF 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  letterSpacing: '-0.04em',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                  fontWeight: 700,
                  textShadow: '0 2px 40px rgba(160, 191, 255, 0.3)',
                }}
              >
                Vireon
              </h1>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1.0,
                  delay: 0.3,
                  ease: APPLE.entrance,
                }}
                className="text-lg tracking-wide"
                style={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                  fontWeight: 400,
                  letterSpacing: '0.02em',
                }}
              >
                Intelligence you can trust
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Radial flash at peak moment */}
        <AnimatePresence>
          {phase === 'illuminate' && (
            <motion.div
              className="absolute inset-0 pointer-events-none flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 0.6, scale: 2 }}
              exit={{ opacity: 0, scale: 2.5 }}
              transition={{ 
                opacity: { duration: 0.8, ease: 'easeOut' },
                scale: { duration: 1.2, ease: APPLE.gentle }
              }}
            >
              <div
                className="w-96 h-96 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(160, 191, 255, 0.5) 0%, transparent 60%)',
                  filter: 'blur(100px)',
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Light sweep - the signature moment */}
        <AnimatePresence>
          {phase === 'illuminate' && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ x: '-150%', opacity: 0 }}
              animate={{ x: '150%', opacity: [0, 0.6, 0] }}
              exit={{ opacity: 0 }}
              transition={{
                x: { duration: 1.8, ease: APPLE.precise },
                opacity: { duration: 1.8, times: [0, 0.3, 1], ease: 'easeInOut' }
              }}
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.12) 30%, rgba(255, 255, 255, 0.18) 50%, rgba(255, 255, 255, 0.12) 70%, transparent 100%)',
                width: '300%',
                transform: 'skewX(-15deg)',
              }}
            />
          )}
        </AnimatePresence>

        {/* Subtle progress indicator - refined aesthetic */}
        <motion.div
          className="absolute bottom-16 left-1/2"
          initial={{ opacity: 0, width: 0, x: '-50%' }}
          animate={{ 
            opacity: phase === 'exit' ? 0 : phase === 'void' ? 0 : 0.25,
            width: phase === 'exit' ? 0 : '140px',
          }}
          transition={{ 
            opacity: { duration: 0.8, ease: APPLE.gentle },
            width: { duration: 0.6, ease: APPLE.entrance }
          }}
        >
          <div 
            className="h-[2px] rounded-full overflow-hidden"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
            }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, rgba(124, 58, 237, 0.7) 0%, rgba(110, 150, 255, 0.7) 100%)',
              }}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{
                duration: 5.2,
                ease: 'linear',
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Vignette frame */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0, 0, 0, 0.6) 100%)',
        }}
      />
    </motion.div>
  );
}