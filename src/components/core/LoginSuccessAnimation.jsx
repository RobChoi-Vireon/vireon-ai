import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const VireonBrainLogo = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 80 80" fill="none" className={className}>
    <defs>
      <linearGradient id="vireon-success-left" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00E5FF" />
        <stop offset="100%" stopColor="#6B73FF" />
      </linearGradient>
      <linearGradient id="vireon-success-right" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6B73FF" />
        <stop offset="100%" stopColor="#FF6EC7" />
      </linearGradient>
    </defs>
    <path d="M 8 35 Q 8 20 18 15 Q 25 12 32 15 Q 38 18 40 25 Q 40 45 35 55 Q 25 65 12 62 Q 8 55 8 35 Z" stroke="url(#vireon-success-left)" strokeWidth="2" fill="none" />
    <path d="M 72 35 Q 72 20 62 15 Q 55 12 48 15 Q 42 18 40 25 Q 40 45 45 55 Q 55 65 68 62 Q 72 55 72 35 Z" stroke="url(#vireon-success-right)" strokeWidth="2" fill="none" />
  </svg>
);

const Checkmark = () => (
  <motion.svg
    width="80"
    height="80"
    viewBox="0 0 100 100"
    initial="hidden"
    animate="visible"
    className="absolute"
  >
    <motion.circle
      cx="50"
      cy="50"
      r="45"
      stroke="rgba(0, 229, 255, 0.2)"
      strokeWidth="4"
      fill="none"
    />
    <motion.path
      d="M 28 52 L 45 68 L 72 35"
      strokeWidth="8"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      variants={{
        hidden: { pathLength: 0 },
        visible: { 
          pathLength: 1, 
          transition: { duration: 0.4, ease: 'easeInOut', delay: 0.5 } 
        },
      }}
    />
  </motion.svg>
);


export default function LoginSuccessAnimation({ onAnimationComplete }) {
  const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';

  useEffect(() => {
    const timer = setTimeout(() => {
      onAnimationComplete();
    }, 1800); // Total animation duration + buffer

    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3, ease: 'easeOut' } }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{ backgroundColor: 'var(--bg)' }}
      aria-live="assertive"
      aria-label="Signed in successfully. Redirecting to dashboard."
    >
      <div className="relative flex items-center justify-center w-24 h-24">
        <AnimatePresence>
          <motion.div
            key="success-pill"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              transition: { type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }
            }}
          >
            <Checkmark />
          </motion.div>
        </AnimatePresence>
        
        <motion.div
          key="logo-pulse"
          initial={{ scale: 1 }}
          animate={{
            scale: [1, 1.08, 1],
            transition: { duration: 0.6, ease: 'easeInOut', delay: 0.3 }
          }}
          className="absolute"
        >
          <VireonBrainLogo className="w-12 h-12" />
        </motion.div>
      </div>
      
      <motion.h2 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.9, duration: 0.4 } }}
        className="mt-6 text-xl font-semibold"
        style={{ color: 'var(--text-primary)' }}
      >
        Welcome Back
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 1.1, duration: 0.4 } }}
        className="text-sm"
        style={{ color: 'var(--text-tertiary)' }}
      >
        Redirecting to your dashboard...
      </motion.p>
    </motion.div>
  );
}