
import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const ConfettiPiece = ({ x, y, rotate, color }) => {
  const shouldReduceMotion = useReducedMotion();

  const variants = {
    initial: {
      opacity: 1,
      y: y.start,
      x: '50%',
      scale: 1,
      rotate: rotate.start,
    },
    animate: {
      opacity: [1, 1, 0],
      y: y.end,
      x: x,
      scale: shouldReduceMotion ? 1 : [1, 1.2, 0.5],
      rotate: shouldReduceMotion ? rotate.start : rotate.end,
      transition: {
        duration: Math.random() * 2 + 2,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      className="absolute top-0 left-1/2 w-2 h-4"
      style={{ background: color }}
      variants={variants}
      initial="initial"
      animate="animate"
    />
  );
};

const Confetti = ({ count = 100, onComplete }) => {
  const shouldReduceMotion = useReducedMotion();
  const colors = ['#A0B4FF', '#00A0C8', '#E8B923', '#F3F5F8', '#FFFFFF'];

  // Fire onComplete callback after a delay
  React.useEffect(() => {
    // If motion is reduced, there is no animation, so call onComplete immediately.
    if (shouldReduceMotion) {
      if (onComplete) onComplete();
      return;
    }
    
    // Otherwise, set a timer to fire after the animation duration.
    const timer = setTimeout(() => {
        if (onComplete) onComplete();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onComplete, shouldReduceMotion]); // Added shouldReduceMotion to dependencies

  // Don't render the confetti pieces if motion is reduced
  if (shouldReduceMotion) {
    return null;
  }
  
  return (
    <div className="absolute inset-0 pointer-events-none z-[100]">
      {Array.from({ length: count }).map((_, i) => (
        <ConfettiPiece
          key={i}
          x={Math.random() * 200 - 100 + 'vw'}
          y={{ start: -20, end: '100vh' }}
          rotate={{ start: Math.random() * 360, end: Math.random() * 1080 }}
          color={colors[i % colors.length]}
        />
      ))}
    </div>
  );
};

export default Confetti;
