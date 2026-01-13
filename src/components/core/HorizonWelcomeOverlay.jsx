import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';

const EMOTIONAL_COPY = [
  "Where macro becomes intuitive.",
  "Calm clarity for complex markets.",
  "Intelligence that feels effortless.",
  "See what matters, clearly."
];

const LivingLight = ({ parallaxX, parallaxY }) => {
  return (
    <motion.div
      className="relative"
      style={{
        width: '100%',
        height: '500px',
        x: parallaxX,
        y: parallaxY
      }}
    >
      {/* Primary amorphous light form */}
      <motion.div
        className="absolute"
        style={{
          top: '50%',
          left: '50%',
          marginLeft: '-180px',
          marginTop: '-180px',
          width: '360px',
          height: '360px',
          background: 'radial-gradient(ellipse at 40% 35%, rgba(167, 116, 255, 0.25), rgba(78, 200, 255, 0.15) 50%, transparent 75%)',
          filter: 'blur(60px)',
          borderRadius: '40% 60% 70% 30% / 60% 30% 70% 40%'
        }}
        animate={{
          scale: [1, 1.15, 0.95, 1.08, 1],
          rotate: [0, 8, -5, 3, 0],
          borderRadius: [
            '40% 60% 70% 30% / 60% 30% 70% 40%',
            '60% 40% 30% 70% / 40% 70% 30% 60%',
            '45% 55% 65% 35% / 55% 45% 65% 35%',
            '50% 50% 60% 40% / 60% 40% 50% 50%',
            '40% 60% 70% 30% / 60% 30% 70% 40%'
          ]
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: [0.43, 0.13, 0.23, 0.96]
        }}
      />

      {/* Secondary light layer */}
      <motion.div
        className="absolute"
        style={{
          top: '50%',
          left: '50%',
          marginLeft: '-140px',
          marginTop: '-140px',
          width: '280px',
          height: '280px',
          background: 'radial-gradient(ellipse at 60% 50%, rgba(107, 185, 255, 0.20), rgba(147, 116, 255, 0.12) 60%, transparent 80%)',
          filter: 'blur(50px)',
          borderRadius: '60% 40% 50% 50% / 50% 60% 40% 50%'
        }}
        animate={{
          scale: [1, 0.92, 1.12, 0.98, 1],
          rotate: [0, -12, 6, -4, 0],
          x: [-8, 12, -6, 4, -8],
          y: [6, -10, 8, -5, 6],
          borderRadius: [
            '60% 40% 50% 50% / 50% 60% 40% 50%',
            '50% 50% 40% 60% / 60% 40% 50% 50%',
            '55% 45% 55% 45% / 45% 55% 45% 55%',
            '48% 52% 48% 52% / 52% 48% 52% 48%',
            '60% 40% 50% 50% / 50% 60% 40% 50%'
          ]
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: [0.45, 0.05, 0.55, 0.95]
        }}
      />

      {/* Atmosphere layer - subtle shifting light */}
      <motion.div
        className="absolute"
        style={{
          top: '50%',
          left: '50%',
          marginLeft: '-240px',
          marginTop: '-240px',
          width: '480px',
          height: '480px',
          background: 'radial-gradient(ellipse at 50% 40%, rgba(255, 255, 255, 0.08), transparent 65%)',
          filter: 'blur(80px)'
        }}
        animate={{
          opacity: [0.4, 0.7, 0.5, 0.65, 0.4],
          scale: [1, 1.05, 0.98, 1.03, 1]
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Glass depth layer */}
      <motion.div
        className="absolute"
        style={{
          top: '50%',
          left: '50%',
          marginLeft: '-160px',
          marginTop: '-160px',
          width: '320px',
          height: '320px',
          background: 'radial-gradient(circle at 45% 40%, rgba(255, 255, 255, 0.12), transparent 70%)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          filter: 'blur(30px)'
        }}
        animate={{
          x: [-3, 5, -2, 4, -3],
          y: [2, -4, 3, -3, 2],
          opacity: [0.3, 0.5, 0.35, 0.48, 0.3]
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: [0.45, 0.05, 0.55, 0.95]
        }}
      />
    </motion.div>
  );
};

export default function HorizonWelcomeOverlay({ onDismiss, isTestMode = false }) {
  const [selectedCopy] = useState(() => {
    const index = Math.floor(Math.random() * EMOTIONAL_COPY.length);
    return EMOTIONAL_COPY[index];
  });

  const containerRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Parallax transforms (extremely subtle - 2-4px max, damped)
  const visualX = useTransform(mouseX, [-1, 1], [-3, 3]);
  const visualY = useTransform(mouseY, [-1, 1], [-3, 3]);
  const bgX = useTransform(mouseX, [-1, 1], [-1.5, 1.5]);
  const bgY = useTransform(mouseY, [-1, 1], [-1.5, 1.5]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Normalize to -1 to 1, heavily damped
      const x = (e.clientX - centerX) / (rect.width / 2);
      const y = (e.clientY - centerY) / (rect.height / 2);
      
      mouseX.set(x * 0.15); // Very minimal parallax
      mouseY.set(y * 0.15);
    };

    container.addEventListener('mousemove', handleMouseMove);
    return () => container.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const handleDismiss = () => {
    if (!isTestMode) {
      // Persist that we've shown the welcome
      localStorage.setItem('vireon_welcome_shown', 'true');
      localStorage.setItem('vireon_welcome_last_shown', new Date().toISOString());
    }
    onDismiss();
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={containerRef}
        className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
        style={{
          background: 'rgba(11, 14, 19, 0.75)'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 0.985 }}
        transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
        onClick={handleDismiss}
      >
        {/* Blurred background layer */}
        <motion.div
          className="absolute inset-0"
          style={{
            backdropFilter: 'blur(32px) brightness(0.6) saturate(1.2)',
            WebkitBackdropFilter: 'blur(32px) brightness(0.6) saturate(1.2)',
            x: bgX,
            y: bgY
          }}
        />

        {/* Subtle film grain */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'2\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
            mixBlendMode: 'soft-light'
          }}
        />

        {/* Living light hero */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <LivingLight parallaxX={visualX} parallaxY={visualY} />
        </motion.div>

        {/* Content container - centered text only */}
        <motion.div
          className="relative flex flex-col items-center justify-center min-h-screen pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.23, 1, 0.32, 1] }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Text stack */}
          <motion.div
            className="text-center space-y-8 max-w-2xl px-6 mb-8"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7, ease: [0.23, 1, 0.32, 1] }}
          >
            {/* Greeting */}
            <h1 
              className="text-5xl md:text-6xl font-light tracking-tight"
              style={{
                color: 'rgba(255, 255, 255, 0.95)',
                letterSpacing: '-0.02em',
                fontWeight: 300
              }}
            >
              Welcome
            </h1>

            {/* Emotional subline */}
            <motion.p
              className="text-xl md:text-2xl font-light"
              style={{
                color: 'rgba(255, 255, 255, 0.65)',
                lineHeight: '1.5',
                letterSpacing: '-0.01em',
                fontWeight: 300
              }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.1 }}
            >
              {selectedCopy}
            </motion.p>
          </motion.div>

          {/* Enter button - small pill */}
          <motion.button
            className="px-8 py-3 rounded-full font-normal text-base pointer-events-auto transition-all duration-300"
            style={{
              background: 'rgba(255, 255, 255, 0.10)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: 'rgba(255, 255, 255, 0.90)',
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 20px rgba(0, 0, 0, 0.1)',
              letterSpacing: '0.01em',
              fontWeight: 400
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.5 }}
            whileHover={{
              scale: 1.04,
              backgroundColor: 'rgba(255, 255, 255, 0.14)',
              borderColor: 'rgba(255, 255, 255, 0.18)',
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDismiss}
          >
            Enter
          </motion.button>
        </motion.div>


      </motion.div>
    </AnimatePresence>
  );
}