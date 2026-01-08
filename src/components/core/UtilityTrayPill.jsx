import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

// ============================================================================
// OS HORIZON SCROLL CHOREOGRAPHY — Apple-Grade Dynamics
// ============================================================================

const STATES = {
  REST: {
    opacity: 1.00,
    blur: 20,
    saturate: 185,
    scale: 1.00,
    translateY: 0
  },
  SCROLLING: {
    opacity: 0.82,
    blur: 32,
    saturate: 165,
    scale: 0.990,
    translateY: 0
  },
  HIDDEN: {
    opacity: 0,
    blur: 20,
    saturate: 185,
    scale: 0.985,
    translateY: -80
  }
};

const TRANSITIONS = {
  HIDE: { duration: 0.48, ease: [0.32, 0.08, 0.24, 1] },
  REVEAL: { duration: 0.28, ease: [0.22, 0.61, 0.36, 1] },
  STATE_CHANGE: { duration: 0.16, ease: [0.26, 0.11, 0.26, 1.0] }
};

const SCROLL_CONFIG = {
  hideThreshold: 140,
  showThreshold: 40,
  deadzone: 4,
  stopDebounce: 140,
  revealZoneHeight: 24
};

// ============================================================================
// UTILITY TRAY PILL — Dynamic Scroll-Reactive HUD
// ============================================================================
export default function UtilityTrayPill({ children, isOverlayOpen = false }) {
  const [scrollY, setScrollY] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState('up');
  const [isScrolling, setIsScrolling] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isRevealZoneActive, setIsRevealZoneActive] = useState(false);
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  const scrollStopTimer = useRef(null);
  const rafId = useRef(null);
  const trayRef = useRef(null);

  // Motion values for smooth interpolation
  const opacityValue = useMotionValue(STATES.REST.opacity);
  const blurValue = useMotionValue(STATES.REST.blur);
  const scaleValue = useMotionValue(STATES.REST.scale);
  const translateYValue = useMotionValue(STATES.REST.translateY);

  // Smooth springs
  const smoothOpacity = useSpring(opacityValue, { stiffness: 200, damping: 30 });
  const smoothBlur = useSpring(blurValue, { stiffness: 180, damping: 28 });
  const smoothScale = useSpring(scaleValue, { stiffness: 250, damping: 32 });
  const smoothTranslateY = useSpring(translateYValue, { stiffness: 280, damping: 35 });

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldReduceMotion(mediaQuery.matches);
    const handler = (e) => setShouldReduceMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Compute desired state based on current conditions
  const getDesiredState = useCallback(() => {
    const isInteracting = isHovering || isOverlayOpen;
    
    // Always show if near top
    if (scrollY < SCROLL_CONFIG.showThreshold) return 'REST';
    
    // Lock visibility if interacting
    if (isInteracting) return 'REST';
    
    // Show if in reveal zone
    if (isRevealZoneActive) return 'REST';
    
    // Show if not scrolling (idle)
    if (!isScrolling) return 'REST';
    
    // Hide if scrolling down past threshold
    if (scrollDirection === 'down' && scrollY > SCROLL_CONFIG.hideThreshold) {
      return 'HIDDEN';
    }
    
    // Show if scrolling up
    if (scrollDirection === 'up') return 'SCROLLING';
    
    // Scrolling state (within threshold)
    return 'SCROLLING';
  }, [scrollY, scrollDirection, isScrolling, isHovering, isOverlayOpen, isRevealZoneActive]);

  // Apply state to motion values
  useEffect(() => {
    const state = getDesiredState();
    const target = STATES[state];
    
    if (shouldReduceMotion) {
      // Reduced motion: only use opacity, instant transitions
      opacityValue.set(state === 'HIDDEN' ? 0 : target.opacity);
      blurValue.set(target.blur);
      scaleValue.set(1);
      translateYValue.set(0);
    } else {
      opacityValue.set(target.opacity);
      blurValue.set(target.blur);
      scaleValue.set(target.scale);
      translateYValue.set(target.translateY);
    }
  }, [getDesiredState, opacityValue, blurValue, scaleValue, translateYValue, shouldReduceMotion]);

  // Scroll handler with rAF throttling
  const handleScroll = useCallback(() => {
    if (rafId.current) return;
    
    rafId.current = requestAnimationFrame(() => {
      const currentScrollY = window.scrollY || document.documentElement.scrollTop;
      setScrollY(currentScrollY);
      
      // Direction detection with deadzone
      const delta = currentScrollY - lastScrollY;
      if (Math.abs(delta) > SCROLL_CONFIG.deadzone) {
        setScrollDirection(delta > 0 ? 'down' : 'up');
        setLastScrollY(currentScrollY);
      }
      
      // Mark as scrolling
      setIsScrolling(true);
      
      // Clear and restart stop timer
      if (scrollStopTimer.current) {
        clearTimeout(scrollStopTimer.current);
      }
      
      scrollStopTimer.current = setTimeout(() => {
        setIsScrolling(false);
      }, SCROLL_CONFIG.stopDebounce);
      
      rafId.current = null;
    });
  }, [lastScrollY]);

  // Attach scroll listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollStopTimer.current) clearTimeout(scrollStopTimer.current);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [handleScroll]);

  return (
    <>
      {/* Reveal Zone — invisible trigger at top */}
      <div
        className="fixed top-0 left-0 right-0 pointer-events-auto z-[249]"
        style={{ height: `${SCROLL_CONFIG.revealZoneHeight}px` }}
        onMouseEnter={() => setIsRevealZoneActive(true)}
        onMouseLeave={() => setIsRevealZoneActive(false)}
        aria-hidden="true"
      />

      {/* Utility Tray Pill */}
      <motion.div
        ref={trayRef}
        className="fixed z-[250] flex items-center"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        style={{
          top: '18px',
          left: '50%',
          x: '-50%',
          padding: '16px 20px',
          borderRadius: '44px',
          border: '1px solid rgba(255,255,255,0.12)',
          willChange: 'transform, opacity, backdrop-filter',
          pointerEvents: 'auto'
        }}
      >
        {/* Dynamic glass background */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(35, 40, 48, 0.78) 0%, rgba(28, 33, 40, 0.74) 100%)',
            borderRadius: '44px',
            opacity: smoothOpacity,
            backdropFilter: useSpring(
              useTransform(smoothBlur, (blur) => `blur(${blur}px) saturate(${
                isScrolling ? STATES.SCROLLING.saturate : STATES.REST.saturate
              }%)`),
              { stiffness: 200, damping: 30 }
            ),
            WebkitBackdropFilter: useSpring(
              useTransform(smoothBlur, (blur) => `blur(${blur}px) saturate(${
                isScrolling ? STATES.SCROLLING.saturate : STATES.REST.saturate
              }%)`),
              { stiffness: 200, damping: 30 }
            ),
            scale: smoothScale,
            y: smoothTranslateY
          }}
        />

        {/* Noise Haze */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            opacity: 0.024,
            mixBlendMode: 'overlay',
            borderRadius: '44px'
          }}
        />

        {/* Vertical Gradient Depth */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(0,0,0,0.05) 0%, transparent 35%, rgba(255,255,255,0.04) 100%)',
            borderRadius: '44px'
          }}
        />

        {/* Glass Rim Edge Highlight */}
        <div
          className="absolute top-0 left-0 right-0 pointer-events-none"
          style={{
            height: '1.5px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)',
            borderRadius: '44px 44px 0 0',
            filter: 'blur(0.5px)'
          }}
        />

        {/* Content with scroll-reactive transform */}
        <motion.div
          className="flex items-center relative z-[260]"
          style={{
            opacity: smoothOpacity,
            scale: smoothScale,
            y: smoothTranslateY
          }}
        >
          {children}
        </motion.div>
      </motion.div>
    </>
  );
}