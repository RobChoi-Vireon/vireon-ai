import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';

const HorizonSurface = ({ parallaxX, parallaxY }) => {
  return (
    <motion.div
      className="relative w-full h-full"
      style={{
        x: parallaxX,
        y: parallaxY
      }}
    >
      {/* Living horizon plane */}
      <div className="absolute inset-0 flex items-center justify-center perspective-1000">
        {/* Main surface - curved plane with infinite depth */}
        <motion.div
          className="relative"
          style={{
            width: '100vw',
            height: '40vh',
            transformStyle: 'preserve-3d',
            transform: 'rotateX(60deg) translateZ(-100px)'
          }}
        >
          {/* Atmospheric gradient base */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(180deg, transparent 0%, rgba(107, 115, 255, 0.04) 30%, rgba(79, 70, 229, 0.06) 70%, transparent 100%)',
              filter: 'blur(60px)'
            }}
          />

          {/* Glass surface with curvature */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.015) 0%, transparent 70%)',
              borderTop: '1px solid rgba(255, 255, 255, 0.02)',
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)'
            }}
            animate={{
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 8.5,
              repeat: Infinity,
              ease: [0.45, 0.05, 0.55, 0.95]
            }}
          />

          {/* Rolling light - extremely slow sweep */}
          <motion.div
            className="absolute inset-0 overflow-hidden"
            style={{
              mixBlendMode: 'screen'
            }}
          >
            <motion.div
              className="absolute"
              style={{
                width: '200%',
                height: '200%',
                left: '-50%',
                top: '-50%',
                background: 'linear-gradient(100deg, transparent 0%, transparent 45%, rgba(255, 255, 255, 0.03) 50%, transparent 55%, transparent 100%)'
              }}
              animate={{
                x: ['0%', '50%']
              }}
              transition={{
                duration: 18,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </motion.div>

          {/* Subtle depth layers */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0"
              style={{
                background: `radial-gradient(ellipse at 50% ${40 + i * 15}%, rgba(107, 115, 255, ${0.02 - i * 0.005}) 0%, transparent 60%)`,
                transform: `translateZ(${-30 - i * 20}px) scale(${1 + i * 0.1})`,
                opacity: 0.6 - i * 0.15
              }}
              animate={{
                opacity: [0.6 - i * 0.15, 0.7 - i * 0.15, 0.6 - i * 0.15]
              }}
              transition={{
                duration: 7 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 1.5
              }}
            />
          ))}

          {/* Atmospheric glow from below */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at 50% 80%, rgba(79, 70, 229, 0.08) 0%, transparent 50%)',
              filter: 'blur(80px)',
              transform: 'translateZ(-50px)'
            }}
            animate={{
              opacity: [0.4, 0.6, 0.4],
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </div>

      {/* Ambient light scatter */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(255, 255, 255, 0.008) 0%, transparent 70%)'
        }}
        animate={{
          opacity: [0.5, 0.7, 0.5]
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
};

export default function HorizonWelcomeOverlay({ onDismiss, isTestMode = false }) {
  const containerRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [showCTA, setShowCTA] = useState(false);

  // Parallax transforms (barely noticeable - 2-4px max)
  const surfaceX = useTransform(mouseX, [-1, 1], [-2, 2]);
  const surfaceY = useTransform(mouseY, [-1, 1], [-2, 2]);
  const bgX = useTransform(mouseX, [-1, 1], [-4, 4]);
  const bgY = useTransform(mouseY, [-1, 1], [-4, 4]);

  // Show CTA after delay
  useEffect(() => {
    const timer = setTimeout(() => setShowCTA(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Normalize to -1 to 1, heavily dampened for barely noticeable parallax
      const x = (e.clientX - centerX) / (rect.width / 2);
      const y = (e.clientY - centerY) / (rect.height / 2);
      
      mouseX.set(x * 0.15); // Very subtle
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
        className="fixed inset-0 z-[9999] overflow-hidden"
        style={{
          background: '#000000'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      >
        {/* Deep space background */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, #000000 0%, #0a0b0e 50%, #000000 100%)',
            x: bgX,
            y: bgY
          }}
        />

        {/* Ultra-subtle noise */}
        <div
          className="absolute inset-0 opacity-[0.008] pointer-events-none"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
            mixBlendMode: 'overlay'
          }}
        />

        {/* Living horizon surface */}
        <HorizonSurface parallaxX={surfaceX} parallaxY={surfaceY} />

        {/* Content layer */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* Welcome text */}
          <motion.h1
            className="text-6xl md:text-7xl lg:text-8xl font-light tracking-tight"
            style={{
              color: 'rgba(255, 255, 255, 0.95)',
              letterSpacing: '-0.02em',
              textShadow: '0 4px 24px rgba(0, 0, 0, 0.5)'
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
          >
            Welcome
          </motion.h1>

          {/* Enter button */}
          <AnimatePresence>
            {showCTA && (
              <motion.button
                className="mt-16 px-8 py-3 rounded-full font-medium text-sm"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: 'rgba(255, 255, 255, 0.85)',
                  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 16px rgba(0, 0, 0, 0.2)',
                  letterSpacing: '0.02em'
                }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                whileHover={{
                  scale: 1.03,
                  backgroundColor: 'rgba(255, 255, 255, 0.10)',
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDismiss}
              >
                Enter
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}