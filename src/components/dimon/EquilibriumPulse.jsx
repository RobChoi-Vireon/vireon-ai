import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useSpring } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, ArrowRight, Sparkles } from 'lucide-react';

// ============================================================================
// EQUILIBRIUM PULSE — OS HORIZON V3.2 (REFINED)
// Living macro force visualization with enhanced readability + Apple-grade polish
// ============================================================================

const MOTION_TOKENS = {
  CURVES: {
    horizonIn: [0.22, 0.61, 0.36, 1],
    horizonSpring: [0.16, 1, 0.3, 1],
    pulsePhysics: [0.4, 0.0, 0.2, 1],
    appleEaseOut: [0.32, 0, 0.67, 1.2]
  },
  DURATIONS: {
    moduleReveal: 0.6,
    drawerReveal: 0.22,
    pulseReaction: 0.14,
    hoverLift: 0.18,
    arrowNudge: 0.12,
    ripple: 0.08
  }
};

const FORCE_COLORS = {
  growth: { core: '#B4F7C0', glow: 'rgba(180,247,192,0.40)' },
  rates: { core: '#C0A6FF', glow: 'rgba(192,166,255,0.40)' },
  fx: { core: '#6AC7F7', glow: 'rgba(106,199,247,0.40)' },
  geopolitics: { core: '#FFD37A', glow: 'rgba(255,211,122,0.40)' }
};

export default function EquilibriumPulse({ 
  equilibriumScore = 0.52,
  volatility = 0.35,
  dominantForce = 'balanced',
  forces = {
    growth: 0.42,
    rates: -0.38,
    fx: 0.15,
    geopolitics: -0.28
  },
  stabilityIndex = 72,
  summary = "Growth resilience offsetting tight rates",
  onOpenDrawer
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMoreHovered, setIsMoreHovered] = useState(false);
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const [pulseTime, setPulseTime] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showRipple, setShowRipple] = useState(false);
  const containerRef = useRef(null);
  const rafRef = useRef(null);

  const pulseX = useSpring(equilibriumScore * 100, { stiffness: 60, damping: 20 });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldReduceMotion(mediaQuery.matches);
    const handler = (e) => setShouldReduceMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    pulseX.set(equilibriumScore * 100);
  }, [equilibriumScore, pulseX]);

  useEffect(() => {
    if (shouldReduceMotion || drawerOpen) return;

    let startTime = Date.now();
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      setPulseTime(elapsed);
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [shouldReduceMotion, drawerOpen]);

  const pulseDrift = useMemo(() => {
    if (shouldReduceMotion || drawerOpen) return 0;
    const speed = 0.3 + (volatility * 0.7);
    const direction = (equilibriumScore - 0.5) * 2;
    return Math.sin(pulseTime * speed) * 2 * (1 + Math.abs(direction) * 0.5);
  }, [pulseTime, volatility, equilibriumScore, shouldReduceMotion, drawerOpen]);

  const pulseScale = useMemo(() => {
    if (shouldReduceMotion || drawerOpen) return 1;
    const breathe = Math.sin(pulseTime * 1.5) * 0.08;
    return 1 + breathe;
  }, [pulseTime, shouldReduceMotion, drawerOpen]);

  const pulseGlowIntensity = useMemo(() => {
    if (shouldReduceMotion || drawerOpen) return 0.5;
    const pulse = Math.sin(pulseTime * 2) * 0.25;
    return 0.5 + pulse;
  }, [pulseTime, shouldReduceMotion, drawerOpen]);

  const getStateLabel = () => {
    if (dominantForce === 'balanced') return 'Balanced';
    if (Math.abs(equilibriumScore - 0.5) < 0.15) return 'Stable';
    if (volatility > 0.6) return 'Diverging';
    if (equilibriumScore < 0.4) return 'Growth-Leaning';
    if (equilibriumScore > 0.6) return 'Tightening';
    return 'Shifting';
  };

  const getPulseColor = () => {
    if (dominantForce === 'balanced') return '#8DC4FF';
    if (equilibriumScore < 0.35) return FORCE_COLORS.growth.core;
    if (equilibriumScore > 0.65) return FORCE_COLORS.geopolitics.core;
    if (dominantForce === 'rates') return FORCE_COLORS.rates.core;
    if (dominantForce === 'fx') return FORCE_COLORS.fx.core;
    return '#8DC4FF';
  };

  const getPulseGlow = () => {
    if (dominantForce === 'balanced') return 'rgba(141,196,255,0.40)';
    if (equilibriumScore < 0.35) return FORCE_COLORS.growth.glow;
    if (equilibriumScore > 0.65) return FORCE_COLORS.geopolitics.glow;
    if (dominantForce === 'rates') return FORCE_COLORS.rates.glow;
    if (dominantForce === 'fx') return FORCE_COLORS.fx.glow;
    return 'rgba(141,196,255,0.40)';
  };

  const sortedForces = useMemo(() => {
    return Object.entries(forces)
      .map(([key, value]) => ({ 
        name: key, 
        value,
        color: FORCE_COLORS[key]?.core || '#8DC4FF',
        glow: FORCE_COLORS[key]?.glow || 'rgba(141,196,255,0.28)'
      }))
      .sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
  }, [forces]);

  const handleToggleDrawer = () => {
    setShowRipple(true);
    setTimeout(() => setShowRipple(false), 400);
    setDrawerOpen(!drawerOpen);
    if (onOpenDrawer) onOpenDrawer();
  };

  const handleMoreClick = (e) => {
    e.stopPropagation();
    handleToggleDrawer();
  };

  return (
    <motion.div
      ref={containerRef}
      className="equilibrium-pulse-module group relative"
      style={{
        width: '100%',
        padding: '24px',
        borderRadius: '24px',
        backdropFilter: 'blur(32px) saturate(170%) brightness(1.05)',
        WebkitBackdropFilter: 'blur(32px) saturate(170%) brightness(1.05)',
        background: 'rgba(18, 22, 28, 0.42)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: 'inset 0 2px 16px rgba(0, 0, 0, 0.38), 0 12px 42px rgba(0, 0, 0, 0.30)',
        cursor: 'pointer',
        willChange: 'filter, transform'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleToggleDrawer}
      whileHover={shouldReduceMotion ? {} : {
        filter: 'brightness(1.06)',
        y: -2,
        transition: { 
          duration: MOTION_TOKENS.DURATIONS.hoverLift, 
          ease: MOTION_TOKENS.CURVES.horizonIn 
        }
      }}
      whileTap={{
        scale: 0.996,
        transition: { duration: 0.08, ease: 'easeOut' }
      }}
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: MOTION_TOKENS.DURATIONS.moduleReveal, 
        delay: 0.4, 
        ease: MOTION_TOKENS.CURVES.horizonIn 
      }}
      tabIndex={0}
      role="button"
      aria-label={`Global Equilibrium: ${getStateLabel()}. Click for detailed breakdown.`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleToggleDrawer();
        }
      }}
    >
      {/* Subsurface Horizon Lighting */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '28px',
        right: '28px',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent)',
        borderRadius: '999px',
        pointerEvents: 'none'
      }} />

      <motion.div
        className="absolute inset-0 rounded-[24px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.05) 0%, transparent 65%)',
          opacity: 0
        }}
        animate={{ opacity: isHovered ? 0.7 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Header Row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <h4 
            style={{
              fontSize: '18px',
              fontWeight: 600,
              letterSpacing: '-0.01em',
              color: 'rgba(255,255,255,0.98)',
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
              textShadow: '0 1px 2px rgba(0,0,0,0.25)'
            }}
          >
            Global Equilibrium
          </h4>
          
          <div
            className="px-2.5 py-1 rounded-lg"
            style={{
              background: 'rgba(255,255,255,0.10)',
              fontSize: '11px',
              fontWeight: 600,
              color: 'rgba(255,255,255,0.88)',
              letterSpacing: '0.02em',
              border: '1px solid rgba(255,255,255,0.08)'
            }}
          >
            {getStateLabel()}
          </div>
        </div>

        {/* More Link — Apple-Grade Micro-Interaction */}
        <motion.button
          className="flex items-center gap-1.5 px-2 py-1 -mr-2 rounded-lg"
          onMouseEnter={() => setIsMoreHovered(true)}
          onMouseLeave={() => setIsMoreHovered(false)}
          onClick={handleMoreClick}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden'
          }}
          whileHover={{
            background: 'rgba(255,255,255,0.06)',
            transition: { duration: 0.14 }
          }}
          aria-label="View detailed force breakdown"
        >
          {/* Ripple Effect on Click */}
          <AnimatePresence>
            {showRipple && (
              <motion.div
                className="absolute inset-0 rounded-lg"
                style={{
                  background: 'radial-gradient(circle, rgba(90,160,255,0.3) 0%, transparent 70%)',
                  pointerEvents: 'none'
                }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: [0.6, 0], scale: 1.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: MOTION_TOKENS.DURATIONS.ripple * 5 }}
              />
            )}
          </AnimatePresence>

          <motion.span
            style={{
              fontSize: '12.5px',
              fontWeight: 500,
              color: 'rgba(90, 160, 255, 0.90)',
              letterSpacing: '0.01em',
              position: 'relative',
              zIndex: 1
            }}
            animate={{
              color: isMoreHovered ? 'rgba(120, 180, 255, 1)' : 'rgba(90, 160, 255, 0.90)',
              x: isMoreHovered ? 2 : 0
            }}
            transition={{ duration: MOTION_TOKENS.DURATIONS.arrowNudge }}
          >
            More
          </motion.span>
          <motion.div
            style={{ position: 'relative', zIndex: 1 }}
            animate={{ 
              x: isMoreHovered ? 3 : 0,
              opacity: isMoreHovered ? 1 : 0.85
            }}
            transition={{ 
              duration: MOTION_TOKENS.DURATIONS.arrowNudge,
              ease: MOTION_TOKENS.CURVES.appleEaseOut
            }}
          >
            <ArrowRight className="w-3.5 h-3.5" style={{ color: 'rgba(90, 160, 255, 0.90)' }} />
          </motion.div>
        </motion.button>
      </div>

      {/* 3-Layer Pulse Bar Container */}
      <div style={{ 
        position: 'relative',
        height: '38px',
        marginBottom: '14px',
        marginTop: '8px'
      }}>
        {/* Layer 1: Glass Rail Background */}
        <div
          className="pulse-rail"
          style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            height: '7px',
            transform: 'translateY(-50%)',
            borderRadius: '999px',
            background: 'rgba(255,255,255,0.07)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.28)',
            overflow: 'hidden'
          }}
        >
          {/* Layer 2: Dynamic Gradient Flow (increased saturation) */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(90deg, #42B0FF 0%, #7AEDCF 15%, #90CAFF 35%, #D4BD78 50%, #FFD982 65%, #FFB965 85%, #FFCA7A 100%)',
              opacity: 0.42,
              mixBlendMode: 'screen'
            }}
            animate={shouldReduceMotion ? {} : {
              opacity: [0.42, 0.52, 0.42]
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />

          {/* Traveling Shimmer */}
          {!shouldReduceMotion && !drawerOpen && (
            <motion.div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.32) 50%, transparent 100%)',
                width: '40%'
              }}
              animate={{
                x: ['-40%', '140%']
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
                repeatDelay: 0.8
              }}
            />
          )}
        </div>

        {/* Subsurface Glow Layer (enhanced softness) */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          height: '16px',
          transform: 'translateY(-50%)',
          background: 'linear-gradient(90deg, rgba(66,176,255,0.12), rgba(122,237,207,0.10), rgba(212,189,120,0.10), rgba(255,185,101,0.12))',
          filter: 'blur(12px)',
          opacity: 0.75,
          pointerEvents: 'none',
          borderRadius: '999px'
        }} />

        {/* Layer 3: Living Pulse Particle (enhanced glow) */}
        <motion.div
          className="pulse-particle"
          style={{
            position: 'absolute',
            top: '50%',
            left: `${pulseX.get() + pulseDrift}%`,
            transform: 'translate(-50%, -50%)',
            width: '16px',
            height: '16px',
            borderRadius: '999px',
            background: getPulseColor(),
            boxShadow: `0 0 ${22 * pulseGlowIntensity}px ${getPulseGlow()}, 0 0 8px rgba(255,255,255,0.55), inset 0 0 0 2px rgba(255,255,255,0.45)`,
            border: '1.5px solid rgba(255,255,255,0.65)',
            zIndex: 5,
            pointerEvents: 'none',
            willChange: 'transform, box-shadow',
            filter: drawerOpen ? 'brightness(1.18)' : 'brightness(1)'
          }}
          animate={{
            scale: drawerOpen ? 1.3 : (isHovered ? pulseScale * 1.08 : pulseScale),
            boxShadow: drawerOpen 
              ? `0 0 36px ${getPulseGlow()}, 0 0 14px rgba(255,255,255,0.85), inset 0 0 0 2px rgba(255,255,255,0.65)`
              : `0 0 ${22 * pulseGlowIntensity}px ${getPulseGlow()}, 0 0 8px rgba(255,255,255,0.55), inset 0 0 0 2px rgba(255,255,255,0.45)`
          }}
          transition={{
            scale: { duration: 0.3, ease: MOTION_TOKENS.CURVES.horizonSpring },
            boxShadow: { duration: 0.3, ease: 'easeOut' }
          }}
        >
          {/* Inner Refraction Highlight */}
          <div style={{
            position: 'absolute',
            top: '2.5px',
            left: '2.5px',
            width: '5.5px',
            height: '5.5px',
            borderRadius: '999px',
            background: 'rgba(255,255,255,0.80)',
            filter: 'blur(0.9px)',
            pointerEvents: 'none'
          }} />

          {/* Ambient Underside Glow (Apple Control Center style) */}
          <div style={{
            position: 'absolute',
            bottom: '-4px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '20px',
            height: '6px',
            background: getPulseGlow(),
            filter: 'blur(6px)',
            opacity: pulseGlowIntensity * 0.6,
            borderRadius: '999px',
            pointerEvents: 'none'
          }} />
        </motion.div>

        {/* Force Zone Labels (enhanced brightness + spacing) */}
        <div className="absolute left-0 right-0 flex justify-between text-xs" style={{
          color: 'rgba(255,255,255,0.68)',
          fontWeight: 500,
          fontSize: '13px',
          letterSpacing: '0.01em',
          bottom: '-26px'
        }}>
          <span>Growth / Demand</span>
          <span>Tightening / Supply</span>
        </div>
      </div>

      {/* Summary Line (enhanced prominence) */}
      <motion.p
        style={{
          fontSize: '16px',
          lineHeight: '1.42',
          color: 'rgba(255,255,255,0.96)',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
          fontWeight: 500,
          textAlign: 'center',
          marginTop: '20px',
          marginBottom: 0,
          letterSpacing: '-0.005em',
          textShadow: '0 1px 2px rgba(0,0,0,0.20)'
        }}
        animate={{
          opacity: isHovered ? 1 : 0.96,
          y: isHovered ? -1 : 0
        }}
        transition={{ duration: 0.18 }}
      >
        {summary}
      </motion.p>

      {/* Hover Drawer Bubble */}
      <AnimatePresence>
        {isHovered && !drawerOpen && (
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
            style={{
              bottom: 'calc(100% + 16px)',
              width: '420px',
              maxWidth: '90vw',
              zIndex: 30
            }}
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ 
              duration: MOTION_TOKENS.DURATIONS.drawerReveal, 
              ease: MOTION_TOKENS.CURVES.horizonIn 
            }}
          >
            <div
              className="p-5 rounded-2xl"
              style={{
                background: 'rgba(10, 14, 20, 0.95)',
                backdropFilter: 'blur(36px) saturate(185%) brightness(1.08)',
                WebkitBackdropFilter: 'blur(36px) saturate(185%) brightness(1.08)',
                border: '1px solid rgba(255,255,255,0.13)',
                boxShadow: '0 16px 48px rgba(0,0,0,0.52), inset 0 1px 0 rgba(255,255,255,0.12)'
              }}
            >
              {/* Drawer Top Highlight */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: '32px',
                right: '32px',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)',
                borderRadius: '999px'
              }} />

              {/* Force Contribution Grid */}
              <div className="mb-4">
                <h5 style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.68)',
                  marginBottom: '14px'
                }}>
                  Force Contributions
                </h5>
                
                <div className="grid grid-cols-2 gap-2.5">
                  {sortedForces.map((force, i) => (
                    <motion.div
                      key={force.name}
                      className="flex items-center justify-between px-3.5 py-3 rounded-xl"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.06)'
                      }}
                      initial={{ opacity: 0, y: 3 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 + (i * 0.04), duration: 0.16 }}
                    >
                      <div className="flex items-center gap-2.5">
                        <div style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '999px',
                          background: force.color,
                          boxShadow: `0 0 12px ${force.glow}`
                        }} />
                        <span style={{
                          fontSize: '12px',
                          fontWeight: 500,
                          color: 'rgba(255,255,255,0.92)',
                          textTransform: 'capitalize'
                        }}>
                          {force.name}
                        </span>
                      </div>
                      <span style={{
                        fontSize: '13px',
                        fontWeight: 700,
                        color: force.value > 0 ? '#6EF3A5' : force.value < 0 ? '#F38B82' : 'rgba(255,255,255,0.60)'
                      }}>
                        {force.value > 0 ? '+' : ''}{Math.round(force.value * 100)}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div style={{
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)',
                margin: '16px 0'
              }} />

              {/* Stability Index + Label */}
              <div className="flex items-center gap-4 mb-4">
                {/* Stability Ring */}
                <div className="relative w-11 h-11 flex-shrink-0">
                  <svg className="transform -rotate-90" width="44" height="44">
                    <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2.8" />
                    <motion.circle
                      cx="22" cy="22" r="18" fill="none"
                      stroke="#5EA7FF"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                      strokeDasharray="113"
                      initial={{ strokeDashoffset: 113 }}
                      animate={{ strokeDashoffset: 113 - stabilityIndex }}
                      transition={{ duration: 0.8, delay: 0.25, ease: MOTION_TOKENS.CURVES.horizonIn }}
                      style={{ filter: 'drop-shadow(0 0 7px rgba(94,167,255,0.35))' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-bold" style={{
                    color: 'rgba(255,255,255,0.98)',
                    fontSize: '12px'
                  }}>
                    {stabilityIndex}
                  </div>
                </div>

                {/* Stability Label */}
                <div className="flex-1">
                  <div style={{
                    fontSize: '10px',
                    color: 'rgba(255,255,255,0.68)',
                    letterSpacing: '0.12em',
                    fontWeight: 600,
                    marginBottom: '3px',
                    textTransform: 'uppercase'
                  }}>
                    Stability Index
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: 'rgba(255,255,255,0.94)',
                    fontWeight: 600,
                    letterSpacing: '-0.005em'
                  }}>
                    {stabilityIndex >= 70 ? 'High Stability' : stabilityIndex >= 50 ? 'Moderate' : 'Elevated Risk'}
                  </div>
                </div>
              </div>

              {/* Lyra Actionable Insight */}
              <motion.div
                className="px-4 py-3.5 rounded-xl"
                style={{
                  background: 'rgba(106, 199, 247, 0.06)',
                  border: '1px solid rgba(106, 199, 247, 0.16)',
                  boxShadow: 'inset 0 0 20px rgba(106, 199, 247, 0.07)'
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.2 }}
              >
                <div className="flex items-start gap-3">
                  <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'rgba(106, 199, 247, 0.82)' }} />
                  <div>
                    <p style={{
                      fontSize: '10px',
                      fontWeight: 600,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'rgba(106, 199, 247, 0.85)',
                      marginBottom: '6px'
                    }}>
                      Lyra Insight
                    </p>
                    <p style={{
                      fontSize: '13px',
                      lineHeight: '1.52',
                      color: 'rgba(235, 245, 252, 0.97)',
                      fontWeight: 400,
                      letterSpacing: '-0.003em'
                    }}>
                      {dominantForce === 'balanced'
                        ? "Equilibrium stable; opportunities expanding across defensive and cyclical sectors."
                        : equilibriumScore > 0.6
                          ? "Watch geopolitical and rate pressure — defensive positioning advised."
                          : "Growth resilience offsetting tight rates — favor cyclical exposure."}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Drawer Arrow */}
              <div style={{
                position: 'absolute',
                bottom: '-9px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '11px solid transparent',
                borderRight: '11px solid transparent',
                borderTop: '11px solid rgba(255,255,255,0.13)'
              }} />
              <div style={{
                position: 'absolute',
                bottom: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '10px solid transparent',
                borderRight: '10px solid transparent',
                borderTop: '10px solid rgba(10, 14, 20, 0.95)'
              }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        /* GPU Acceleration */
        .pulse-particle,
        .equilibrium-pulse-module {
          transform: translateZ(0);
          backface-visibility: hidden;
        }

        /* Reduced Motion Support */
        @media (prefers-reduced-motion: reduce) {
          .pulse-particle {
            animation: none !important;
            transition: none !important;
          }
        }

        /* Focus State */
        .equilibrium-pulse-module:focus-visible {
          outline: 2px solid rgba(90, 160, 255, 0.65);
          outline-offset: 4px;
        }

        /* High Contrast Mode */
        @media (prefers-contrast: high) {
          .pulse-rail {
            border-color: rgba(255, 255, 255, 0.5) !important;
          }
          
          .equilibrium-pulse-module h4,
          .equilibrium-pulse-module p {
            color: #FFFFFF !important;
          }
        }

        /* Touch Targets */
        @media (pointer: coarse) {
          .equilibrium-pulse-module {
            min-height: 48px;
          }
        }

        /* Mobile Responsiveness */
        @media (max-width: 768px) {
          .equilibrium-pulse-module h4 {
            font-size: 17px !important;
          }
          
          .equilibrium-pulse-module p {
            font-size: 15px !important;
          }
          
          .equilibrium-pulse-module .force-zone-labels {
            font-size: 12px !important;
          }
        }

        /* Performance Optimization */
        .pulse-particle::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 999px;
          z-index: -1;
        }
      `}</style>
    </motion.div>
  );
}