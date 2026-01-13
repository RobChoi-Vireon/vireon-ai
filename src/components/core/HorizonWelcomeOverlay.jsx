import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const EMOTIONAL_COPY = [
  "Calm clarity for fast markets.",
  "Signal. Structure. Decision.",
  "A quieter way to see the world move.",
  "Where macro becomes intuitive."
];

const HorizonCore = ({ parallaxX, parallaxY }) => {
  return (
    <motion.div
      className="relative"
      style={{
        x: parallaxX,
        y: parallaxY
      }}
    >
      {/* Outer glow rings */}
      <motion.div
        className="absolute inset-0"
        style={{
          width: '420px',
          height: '420px',
          left: '50%',
          top: '50%',
          marginLeft: '-210px',
          marginTop: '-210px'
        }}
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.15, 0.25, 0.15]
        }}
        transition={{
          duration: 7.2,
          repeat: Infinity,
          ease: [0.45, 0.05, 0.55, 0.95]
        }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle at center, rgba(107, 115, 255, 0.25) 0%, transparent 70%)',
            filter: 'blur(40px)'
          }}
        />
      </motion.div>

      {/* Core orb */}
      <motion.div
        className="relative"
        style={{
          width: '280px',
          height: '280px'
        }}
        animate={{
          scale: [1, 1.03, 1]
        }}
        transition={{
          duration: 6.5,
          repeat: Infinity,
          ease: [0.45, 0.05, 0.55, 0.95]
        }}
      >
        {/* Main orb surface */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.18), rgba(107, 115, 255, 0.12) 40%, rgba(255, 110, 199, 0.08) 70%, transparent)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: `
              0 0 80px rgba(107, 115, 255, 0.3),
              inset 0 0 60px rgba(255, 255, 255, 0.08),
              0 20px 60px rgba(0, 0, 0, 0.15)
            `
          }}
        />

        {/* Subsurface highlight */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '140px',
            height: '140px',
            top: '30px',
            left: '50px',
            background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.25), transparent 60%)',
            filter: 'blur(25px)'
          }}
          animate={{
            opacity: [0.4, 0.65, 0.4],
            x: [-5, 5, -5],
            y: [-3, 3, -3]
          }}
          transition={{
            duration: 9.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Spectral light sweep */}
        <motion.div
          className="absolute inset-0 rounded-full overflow-hidden"
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
              background: 'linear-gradient(135deg, transparent 40%, rgba(255, 255, 255, 0.12) 50%, transparent 60%)'
            }}
            animate={{
              rotate: [0, 360]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </motion.div>

        {/* Contour rings */}
        {[0.7, 0.85].map((scale, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full"
            style={{
              border: '1px solid rgba(255, 255, 255, 0.06)',
              transform: `scale(${scale})`,
              left: `${(1 - scale) * 50}%`,
              top: `${(1 - scale) * 50}%`,
              width: `${scale * 100}%`,
              height: `${scale * 100}%`
            }}
            animate={{
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 5.5 + i * 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.8
            }}
          />
        ))}
      </motion.div>

      {/* Breathing waves */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          width: '280px',
          height: '280px',
          border: '1px solid rgba(255, 255, 255, 0.15)'
        }}
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.5, 0, 0.5]
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeOut"
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

  // Parallax transforms (very subtle)
  const coreX = useTransform(mouseX, [-1, 1], [-6, 6]);
  const coreY = useTransform(mouseY, [-1, 1], [-6, 6]);
  const bgX = useTransform(mouseX, [-1, 1], [-3, 3]);
  const bgY = useTransform(mouseY, [-1, 1], [-3, 3]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Normalize to -1 to 1
      const x = (e.clientX - centerX) / (rect.width / 2);
      const y = (e.clientY - centerY) / (rect.height / 2);
      
      mouseX.set(x * 0.3); // Dampen effect
      mouseY.set(y * 0.3);
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

        {/* Subtle noise texture */}
        <div
          className="absolute inset-0 opacity-[0.015] pointer-events-none"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
            mixBlendMode: 'overlay'
          }}
        />

        {/* Content container */}
        <motion.div
          className="relative flex flex-col items-center pointer-events-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Hero Core */}
          <div className="mb-12 md:mb-16">
            <HorizonCore parallaxX={coreX} parallaxY={coreY} />
          </div>

          {/* Text stack */}
          <motion.div
            className="text-center space-y-4 max-w-2xl px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Logo/Brand */}
            <div className="flex items-center justify-center gap-3 mb-2">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68943f7eb0fb9393bf9a8069/ea91941d0_Asset61xtransparent.png"
                alt="Vireon"
                className="w-10 h-10 rounded-lg"
                style={{ 
                  boxShadow: '0 0 20px rgba(110, 150, 255, 0.5), 0 0 10px rgba(110, 150, 255, 0.3)'
                }}
              />
              <h1 
                className="text-5xl md:text-6xl font-black tracking-[-0.03em]"
                style={{
                  background: 'linear-gradient(to right, #A774FF, #4EC8FF)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 2px 12px rgba(107, 115, 255, 0.3))'
                }}
              >
                Vireon
              </h1>
            </div>

            {/* Subhead */}
            <p 
              className="text-lg md:text-xl font-semibold tracking-wide"
              style={{
                color: 'rgba(255, 255, 255, 0.65)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontSize: '13px'
              }}
            >
              OS Horizon
            </p>

            {/* Emotional copy */}
            <motion.p
              className="text-xl md:text-2xl font-light"
              style={{
                color: 'rgba(255, 255, 255, 0.85)',
                lineHeight: '1.5',
                letterSpacing: '-0.01em',
                marginTop: '24px'
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7 }}
            >
              {selectedCopy}
            </motion.p>
          </motion.div>

          {/* Enter button */}
          <motion.button
            className="mt-12 px-10 py-4 rounded-full font-semibold text-base pointer-events-auto transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, rgba(107, 115, 255, 0.20), rgba(79, 70, 229, 0.25))',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              boxShadow: `
                0 0 40px rgba(107, 115, 255, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.15),
                0 8px 32px rgba(0, 0, 0, 0.15)
              `,
              letterSpacing: '0.02em'
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            whileHover={{
              scale: 1.05,
              boxShadow: `
                0 0 50px rgba(107, 115, 255, 0.4),
                inset 0 1px 0 rgba(255, 255, 255, 0.2),
                0 12px 40px rgba(0, 0, 0, 0.2)
              `,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDismiss}
          >
            Enter Vireon
          </motion.button>

          {/* Skip button (subtle) */}
          <motion.button
            className="mt-6 text-sm font-medium pointer-events-auto transition-colors duration-200"
            style={{
              color: 'rgba(255, 255, 255, 0.35)',
              letterSpacing: '0.03em'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            whileHover={{ color: 'rgba(255, 255, 255, 0.6)' }}
            onClick={handleDismiss}
          >
            Skip
          </motion.button>
        </motion.div>

        {/* Test mode indicator */}
        {isTestMode && (
          <motion.div
            className="absolute top-6 left-6 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: 'rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(12px)'
            }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            Preview Mode
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}