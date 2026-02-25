import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';

/**
 * HorizonWelcomeOverlay
 * 
 * A cinematic welcome visual centered on a single, living "power core"—
 * an abstract, organic presence that feels intelligent, calm, and aware.
 * 
 * The core is the hero. Everything else serves it.
 * No logos, no product names, minimal text (Apple-style).
 */

const PowerCore = ({ parallaxX, parallaxY, cursorInfluence = { x: 0, y: 0 }, brightnessPulse = false }) => {
  return (
    <motion.div
      className="relative"
      style={{
        x: parallaxX,
        y: parallaxY,
        width: '360px',
        height: '360px'
      }}
      animate={{
        z: [0, 12, 6, 0]
      }}
      transition={{
        duration: 22.3,
        repeat: Infinity,
        ease: "easeInOut",
        times: [0, 0.28, 0.65, 1]
      }}
    >
      <svg
        viewBox="0 0 360 360"
        width="360"
        height="360"
        className="absolute inset-0"
        style={{
          filter: 'drop-shadow(0 0 120px rgba(107, 115, 255, 0.25))',
        }}
      >
        <defs>
          {/* Soft radial gradient for the core body */}
          <radialGradient id="coreGradient" cx="42%" cy="38%" r="68%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.18)" />
            <stop offset="28%" stopColor="rgba(200, 210, 255, 0.12)" />
            <stop offset="55%" stopColor="rgba(107, 115, 255, 0.09)" />
            <stop offset="78%" stopColor="rgba(100, 110, 200, 0.05)" />
            <stop offset="100%" stopColor="rgba(80, 90, 180, 0.01)" />
          </radialGradient>

          {/* Inner luminous light source: asymmetric, responds to cursor */}
          <radialGradient id="innerLight" cx="46%" cy="33%" r="42%">
            <stop offset="0%" stopColor="rgba(220, 230, 255, 0.32)" />
            <stop offset="38%" stopColor="rgba(150, 170, 255, 0.12)" />
            <stop offset="100%" stopColor="rgba(100, 120, 200, 0)" />
          </radialGradient>

          {/* Spectral edge glow */}
          <radialGradient id="edgeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="60%" stopColor="rgba(255, 255, 255, 0)" />
            <stop offset="85%" stopColor="rgba(107, 115, 255, 0.1)" />
            <stop offset="100%" stopColor="rgba(107, 115, 255, 0.05)" />
          </radialGradient>

          {/* Blur filter for soft edges */}
          <filter id="softEdge">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" />
          </filter>

          {/* Refined glow effect */}
          <filter id="coreGlow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer field / aura layer: subtle asymmetric drift */}
        <motion.circle
          cx="180"
          cy="180"
          r="170"
          fill="none"
          stroke="url(#edgeGlow)"
          strokeWidth="0.5"
          filter="url(#coreGlow)"
          animate={{
            opacity: [0.25, 0.45, 0.28, 0.35, 0.2, 0.4, 0.25]
          }}
          transition={{
            duration: 16.8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Main core body: organic ellipse with asymmetric drift */}
        <motion.ellipse
          cx="180"
          cy="180"
          rx="140"
          ry="145"
          fill="url(#coreGradient)"
          animate={{
            rx: [140, 139, 141, 138, 142, 140],
            ry: [145, 146, 144, 147, 143, 145]
          }}
          transition={{
            duration: 14.3,
            repeat: Infinity,
            ease: [0.43, 0.13, 0.23, 0.96]
          }}
        />

        {/* Inner light source: responds to cursor, internal drift with moments of stillness */}
        <motion.ellipse
          cx="180"
          cy="175"
          rx="85"
          ry="95"
          fill="url(#innerLight)"
          filter="url(#softEdge)"
          animate={{
            cx: [180, 180, 183, 183, 180, 177, 177, 180, 181, 181, 180],
            cy: [175, 175, 172, 172, 175, 178, 178, 175, 170, 170, 175],
            opacity: brightnessPulse 
              ? [0.48, 0.48, 0.68, 0.75, 0.72, 0.65, 0.58, 0.55, 0.45, 0.62, 0.48]
              : [0.48, 0.48, 0.68, 0.65, 0.52, 0.58, 0.55, 0.45, 0.62, 0.6, 0.48]
          }}
          transition={{
            duration: brightnessPulse ? 2.2 : 21.8,
            repeat: brightnessPulse ? 0 : Infinity,
            ease: "easeInOut",
            times: [0, 0.09, 0.24, 0.3, 0.36, 0.5, 0.56, 0.63, 0.76, 0.82, 1]
          }}
        />

        {/* Subsurface highlight: intentional drift with settling */}
        <motion.ellipse
          cx="150"
          cy="120"
          rx="60"
          ry="70"
          fill="rgba(255, 255, 255, 0.15)"
          filter="url(#softEdge)"
          animate={{
            cx: [150, 150, 158, 158, 150, 142, 142, 150, 155, 155, 150],
            cy: [120, 120, 118, 118, 120, 122, 122, 120, 116, 116, 120],
            opacity: [0.25, 0.25, 0.48, 0.45, 0.32, 0.22, 0.2, 0.28, 0.42, 0.4, 0.25]
          }}
          transition={{
            duration: 23.6,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.06, 0.18, 0.24, 0.33, 0.45, 0.51, 0.6, 0.72, 0.78, 1]
          }}
        />

        {/* Outer contour: alive but not breathing */}
        <motion.ellipse
          cx="180"
          cy="180"
          rx="145"
          ry="150"
          fill="none"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth="1"
          animate={{
            strokeOpacity: [0.06, 0.11, 0.07, 0.09, 0.05, 0.08, 0.06]
          }}
          transition={{
            duration: 15.7,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Far subtle secondary glow: very slow fade */}
        <motion.circle
          cx="180"
          cy="180"
          r="165"
          fill="none"
          stroke="rgba(107, 115, 255, 0.05)"
          strokeWidth="0.5"
          animate={{
            opacity: [0.08, 0.2, 0.12, 0.08]
          }}
          transition={{
            duration: 18.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </svg>
    </motion.div>
  );
};

export default function HorizonWelcomeOverlay({ onDismiss, isTestMode = false }) {
  const containerRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [cursorInfluence, setCursorInfluence] = useState({ x: 0, y: 0 });
  const [isIdle, setIsIdle] = useState(false);
  const [brightnessPulse, setBrightnessPulse] = useState(false);
  const [isDismissing, setIsDismissing] = useState(false);
  const idleTimeoutRef = useRef(null);
  const cursorDelayRef = useRef(null);

  // Very subtle parallax (2–3px max)
  const coreX = useTransform(mouseX, [-1, 1], [-3, 3]);
  const coreY = useTransform(mouseY, [-1, 1], [-3, 3]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const x = (e.clientX - centerX) / (rect.width / 2);
      const y = (e.clientY - centerY) / (rect.height / 2);

      mouseX.set(x * 0.2); // Heavily damped
      mouseY.set(y * 0.2);

      // Internal light responds to cursor with ~120ms delay, max 2-3px
      clearTimeout(cursorDelayRef.current);
      cursorDelayRef.current = setTimeout(() => {
        setCursorInfluence({
          x: x * 2.2,
          y: y * 2.2
        });
      }, 120);

      setIsIdle(false);

      // Reset idle timer
      clearTimeout(idleTimeoutRef.current);
      idleTimeoutRef.current = setTimeout(() => {
        setIsIdle(true);
        setCursorInfluence({ x: 0, y: 0 });
      }, 4500);
    };

    // Return to neutral when idle
    const handleMouseLeave = () => {
      setCursorInfluence({ x: 0, y: 0 });
      setIsIdle(true);
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(idleTimeoutRef.current);
      clearTimeout(cursorDelayRef.current);
    };
  }, [mouseX, mouseY]);

  const handleDismiss = () => {
    setIsDismissing(true);
    if (!isTestMode) {
      localStorage.setItem('vireon_welcome_shown', 'true');
      localStorage.setItem('vireon_welcome_last_shown', new Date().toISOString());
    }
    setTimeout(() => onDismiss(), 720);
  };

  const handleEnterPress = () => {
    setBrightnessPulse(true);
    setTimeout(() => handleDismiss(), 300);
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={containerRef}
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
        style={{
          background: '#0B0E13'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.02 }}
        transition={{ 
          opacity: { duration: 0.32, ease: [0.23, 1, 0.32, 1] },
          exit: { duration: 0.72, ease: [0.4, 0, 0.2, 1] }
        }}
        onClick={isDismissing ? undefined : handleDismiss}
      >
        {/* OPTIMIZED: Single scrim layer with static effects */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'rgba(11, 14, 19, 0.85)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'2\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.008\'/%3E%3C/svg%3E")',
            mixBlendMode: 'normal'
          }}
        />

        {/* Content Stack */}
        <motion.div
          className="relative flex flex-col items-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Power Core: subtle offset + diffusive exit */}
          <motion.div 
            className="mb-16 md:mb-20"
            exit={{ 
              opacity: 0,
              filter: 'blur(12px) brightness(1.6)',
              scale: 1.08
            }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            animate={{
              x: isIdle ? 0 : cursorInfluence.x,
              y: isIdle ? 0 : cursorInfluence.y
            }}
            transition={{
              x: { type: "tween", duration: 0.7, ease: "easeOut" },
              y: { type: "tween", duration: 0.7, ease: "easeOut" }
            }}
          >
            <PowerCore parallaxX={coreX} parallaxY={coreY} cursorInfluence={cursorInfluence} brightnessPulse={brightnessPulse} />
          </motion.div>

          {/* Minimal Text Stack */}
          <motion.div
            className="text-center space-y-3"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {/* Greeting: lighter weight, elevated, generous spacing */}
            <h1
              className="text-6xl md:text-7xl"
              style={{
                color: 'rgba(255, 255, 255, 0.91)',
                letterSpacing: '0.035em',
                fontWeight: 100,
                marginBottom: '0px',
                transform: 'translateY(-4px)'
              }}
            >
              Welcome
            </h1>

            {/* Subline: secondary, quiet, refined */}
            <p
              className="text-lg md:text-xl"
              style={{
                color: 'rgba(255, 255, 255, 0.42)',
                letterSpacing: '0.055em',
                lineHeight: '1.8',
                fontWeight: 300,
                marginTop: '22px'
              }}
            >
              Designed for intuition.
            </p>
          </motion.div>

          {/* CTA Button: luminosity-only interaction, core responds on press */}
          <motion.button
            className="mt-16 px-12 py-3.5 rounded-full font-medium text-base pointer-events-auto"
            style={{
              background: 'rgba(107, 115, 255, 0.12)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#ffffff',
              boxShadow: `
                0 0 40px rgba(107, 115, 255, 0.2),
                inset 0 1px 0 rgba(255, 255, 255, 0.1)
              `,
              letterSpacing: '0.04em'
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1.4 }}
            whileHover={{
              backgroundColor: 'rgba(107, 115, 255, 0.18)',
              borderColor: 'rgba(255, 255, 255, 0.15)',
              boxShadow: `
                0 0 45px rgba(107, 115, 255, 0.28),
                inset 0 1px 0 rgba(255, 255, 255, 0.14)
              `,
              transition: { duration: 0.4 }
            }}
            whileTap={{ 
              scale: 0.98,
              boxShadow: `
                0 0 40px rgba(107, 115, 255, 0.22),
                inset 0 1px 0 rgba(255, 255, 255, 0.12)
              `
            }}
            onClick={handleEnterPress}
          >
            Enter
          </motion.button>
        </motion.div>

        {/* Test Mode Badge */}
        {isTestMode && (
          <motion.div
            className="absolute top-6 left-6 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'rgba(255, 255, 255, 0.5)',
              backdropFilter: 'blur(12px)'
            }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            Preview
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}