import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useSpring } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, ArrowRight, Sparkles } from 'lucide-react';

// ============================================================================
// EQUILIBRIUM PULSE — OS HORIZON V3.2
// Living macro force visualization with physics-based pulse particle
// ============================================================================

const MOTION_TOKENS = {
  CURVES: {
    horizonIn: [0.22, 0.61, 0.36, 1],
    horizonSpring: [0.16, 1, 0.3, 1],
    pulsePhysics: [0.4, 0.0, 0.2, 1]
  },
  DURATIONS: {
    moduleReveal: 0.6,
    drawerReveal: 0.22,
    pulseReaction: 0.14,
    hoverLift: 0.18
  }
};

const FORCE_COLORS = {
  growth: { core: '#B4F7C0', glow: 'rgba(180,247,192,0.35)' },
  rates: { core: '#C0A6FF', glow: 'rgba(192,166,255,0.35)' },
  fx: { core: '#6AC7F7', glow: 'rgba(106,199,247,0.35)' },
  geopolitics: { core: '#FFD37A', glow: 'rgba(255,211,122,0.35)' }
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
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const [pulseTime, setPulseTime] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
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
    if (dominantForce === 'balanced') return 'rgba(141,196,255,0.35)';
    if (equilibriumScore < 0.35) return FORCE_COLORS.growth.glow;
    if (equilibriumScore > 0.65) return FORCE_COLORS.geopolitics.glow;
    if (dominantForce === 'rates') return FORCE_COLORS.rates.glow;
    if (dominantForce === 'fx') return FORCE_COLORS.fx.glow;
    return 'rgba(141,196,255,0.35)';
  };

  const sortedForces = useMemo(() => {
    return Object.entries(forces)
      .map(([key, value]) => ({ 
        name: key, 
        value,
        color: FORCE_COLORS[key]?.core || '#8DC4FF',
        glow: FORCE_COLORS[key]?.glow || 'rgba(141,196,255,0.25)'
      }))
      .sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
  }, [forces]);

  const handleToggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
    if (onOpenDrawer) onOpenDrawer();
  };

  return (
    <motion.div
      ref={containerRef}
      className="equilibrium-pulse-module group relative"
      style={{
        width: '100%',
        padding: '18px 22px',
        borderRadius: '18px',
        backdropFilter: 'blur(26px) saturate(165%) brightness(1.04)',
        WebkitBackdropFilter: 'blur(26px) saturate(165%) brightness(1.04)',
        background: 'rgba(18, 22, 28, 0.38)',
        border: '1px solid rgba(255,255,255,0.09)',
        boxShadow: 'inset 0 2px 14px rgba(0, 0, 0, 0.40), 0 10px 36px rgba(0, 0, 0, 0.28)',
        cursor: 'pointer',
        willChange: 'filter, transform'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleToggleDrawer}
      whileHover={shouldReduceMotion ? {} : {
        filter: 'brightness(1.05)',
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
        left: '20px',
        right: '20px',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)',
        borderRadius: '999px',
        pointerEvents: 'none'
      }} />

      <motion.div
        className="absolute inset-0 rounded-[18px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.04) 0%, transparent 60%)',
          opacity: 0
        }}
        animate={{ opacity: isHovered ? 0.6 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Header Row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <h4 
            style={{
              fontSize: '15px',
              fontWeight: 600,
              letterSpacing: '-0.005em',
              color: 'rgba(255,255,255,0.95)',
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'
            }}
          >
            Global Equilibrium
          </h4>
          
          <div
            className="px-2 py-0.5 rounded-md"
            style={{
              background: 'rgba(255,255,255,0.08)',
              fontSize: '11px',
              fontWeight: 600,
              color: 'rgba(255,255,255,0.75)',
              letterSpacing: '0.02em'
            }}
          >
            {getStateLabel()}
          </div>
        </div>

        {/* More Link */}
        <motion.div
          className="flex items-center gap-1.5"
          animate={{ opacity: isHovered ? 1 : 0.6 }}
          transition={{ duration: 0.15 }}
        >
          <span style={{
            fontSize: '12px',
            fontWeight: 500,
            color: 'rgba(90, 160, 255, 0.85)',
            letterSpacing: '0.01em'
          }}>
            More
          </span>
          <motion.div
            animate={{ x: isHovered ? 2 : 0 }}
            transition={{ duration: 0.14 }}
          >
            <ArrowRight className="w-3.5 h-3.5" style={{ color: 'rgba(90, 160, 255, 0.85)' }} />
          </motion.div>
        </motion.div>
      </div>

      {/* 3-Layer Pulse Bar Container */}
      <div style={{ 
        position: 'relative',
        height: '32px',
        marginBottom: '14px'
      }}>
        {/* Layer 1: Glass Rail Background */}
        <div
          className="pulse-rail"
          style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            height: '6px',
            transform: 'translateY(-50%)',
            borderRadius: '999px',
            background: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.25)',
            overflow: 'hidden'
          }}
        >
          {/* Layer 2: Dynamic Gradient Flow */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(90deg, #3FAEFF 0%, #77E9CE 15%, #8DC4FF 35%, #C9B46B 50%, #FFD37A 65%, #FFB35C 85%, #FFC772 100%)',
              opacity: 0.35,
              mixBlendMode: 'screen'
            }}
            animate={shouldReduceMotion ? {} : {
              opacity: [0.35, 0.45, 0.35]
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
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.28) 50%, transparent 100%)',
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

        {/* Subsurface Glow Layer */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          height: '12px',
          transform: 'translateY(-50%)',
          background: 'linear-gradient(90deg, rgba(63,174,255,0.10), rgba(119,233,206,0.08), rgba(201,180,107,0.08), rgba(255,179,92,0.10))',
          filter: 'blur(10px)',
          opacity: 0.7,
          pointerEvents: 'none',
          borderRadius: '999px'
        }} />

        {/* Layer 3: Living Pulse Particle */}
        <motion.div
          className="pulse-particle"
          style={{
            position: 'absolute',
            top: '50%',
            left: `${pulseX.get() + pulseDrift}%`,
            transform: 'translate(-50%, -50%)',
            width: '14px',
            height: '14px',
            borderRadius: '999px',
            background: getPulseColor(),
            boxShadow: `0 0 ${18 * pulseGlowIntensity}px ${getPulseGlow()}, 0 0 6px rgba(255,255,255,0.5), inset 0 0 0 2px rgba(255,255,255,0.4)`,
            border: '1.5px solid rgba(255,255,255,0.6)',
            zIndex: 5,
            pointerEvents: 'none',
            willChange: 'transform, box-shadow',
            filter: drawerOpen ? 'brightness(1.15)' : 'brightness(1)'
          }}
          animate={{
            scale: drawerOpen ? 1.3 : (isHovered ? pulseScale * 1.08 : pulseScale),
            boxShadow: drawerOpen 
              ? `0 0 32px ${getPulseGlow()}, 0 0 12px rgba(255,255,255,0.8), inset 0 0 0 2px rgba(255,255,255,0.6)`
              : `0 0 ${18 * pulseGlowIntensity}px ${getPulseGlow()}, 0 0 6px rgba(255,255,255,0.5), inset 0 0 0 2px rgba(255,255,255,0.4)`
          }}
          transition={{
            scale: { duration: 0.3, ease: MOTION_TOKENS.CURVES.horizonSpring },
            boxShadow: { duration: 0.3, ease: 'easeOut' }
          }}
        >
          {/* Inner Refraction Highlight */}
          <div style={{
            position: 'absolute',
            top: '2px',
            left: '2px',
            width: '5px',
            height: '5px',
            borderRadius: '999px',
            background: 'rgba(255,255,255,0.75)',
            filter: 'blur(0.8px)',
            pointerEvents: 'none'
          }} />
        </motion.div>

        {/* Force Zone Labels */}
        <div className="absolute -bottom-5 left-0 right-0 flex justify-between text-xs" style={{
          color: 'rgba(255,255,255,0.52)',
          fontWeight: 500,
          fontSize: '10px',
          letterSpacing: '0.02em'
        }}>
          <span>Growth / Demand</span>
          <span>Tightening / Supply</span>
        </div>
      </div>

      {/* Summary Line */}
      <motion.p
        style={{
          fontSize: '13px',
          lineHeight: '1.45',
          color: 'rgba(255,255,255,0.88)',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
          fontWeight: 400,
          textAlign: 'center',
          marginTop: '14px',
          marginBottom: 0
        }}
        animate={{
          opacity: isHovered ? 1 : 0.88,
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
              bottom: 'calc(100% + 14px)',
              width: '380px',
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
                background: 'rgba(10, 14, 20, 0.94)',
                backdropFilter: 'blur(32px) saturate(180%) brightness(1.06)',
                WebkitBackdropFilter: 'blur(32px) saturate(180%) brightness(1.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                boxShadow: '0 14px 44px rgba(0,0,0,0.50), inset 0 1px 0 rgba(255,255,255,0.10)'
              }}
            >
              {/* Drawer Top Highlight */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: '28px',
                right: '28px',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.20), transparent)',
                borderRadius: '999px'
              }} />

              {/* Force Contribution Grid */}
              <div className="mb-4">
                <h5 style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.60)',
                  marginBottom: '12px'
                }}>
                  Force Contributions
                </h5>
                
                <div className="grid grid-cols-2 gap-2.5">
                  {sortedForces.map((force, i) => (
                    <motion.div
                      key={force.name}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl"
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.05)'
                      }}
                      initial={{ opacity: 0, y: 3 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 + (i * 0.04), duration: 0.16 }}
                    >
                      <div className="flex items-center gap-2">
                        <div style={{
                          width: '5px',
                          height: '5px',
                          borderRadius: '999px',
                          background: force.color,
                          boxShadow: `0 0 10px ${force.glow}`
                        }} />
                        <span style={{
                          fontSize: '11.5px',
                          fontWeight: 500,
                          color: 'rgba(255,255,255,0.85)',
                          textTransform: 'capitalize'
                        }}>
                          {force.name}
                        </span>
                      </div>
                      <span style={{
                        fontSize: '12.5px',
                        fontWeight: 700,
                        color: force.value > 0 ? '#6EF3A5' : force.value < 0 ? '#F38B82' : 'rgba(255,255,255,0.55)'
                      }}>
                        {force.value > 0 ? '+' : ''}{Math.round(force.value * 100)}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div style={{
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
                margin: '14px 0'
              }} />

              {/* Stability Index + Actionable */}
              <div className="flex items-center gap-4 mb-4">
                {/* Stability Ring */}
                <div className="relative w-10 h-10 flex-shrink-0">
                  <svg className="transform -rotate-90" width="40" height="40">
                    <circle cx="20" cy="20" r="17" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2.5" />
                    <motion.circle
                      cx="20" cy="20" r="17" fill="none"
                      stroke="#5EA7FF"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeDasharray="107"
                      initial={{ strokeDashoffset: 107 }}
                      animate={{ strokeDashoffset: 107 - stabilityIndex }}
                      transition={{ duration: 0.8, delay: 0.25, ease: MOTION_TOKENS.CURVES.horizonIn }}
                      style={{ filter: 'drop-shadow(0 0 6px rgba(94,167,255,0.3))' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-bold" style={{
                    color: 'rgba(255,255,255,0.95)',
                    fontSize: '11px'
                  }}>
                    {stabilityIndex}
                  </div>
                </div>

                {/* Stability Label */}
                <div className="flex-1">
                  <div style={{
                    fontSize: '9px',
                    color: 'rgba(255,255,255,0.60)',
                    letterSpacing: '0.12em',
                    fontWeight: 600,
                    marginBottom: '2px',
                    textTransform: 'uppercase'
                  }}>
                    Stability Index
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.88)',
                    fontWeight: 600
                  }}>
                    {stabilityIndex >= 70 ? 'High Stability' : stabilityIndex >= 50 ? 'Moderate' : 'Elevated Risk'}
                  </div>
                </div>
              </div>

              {/* Lyra Actionable Insight */}
              <motion.div
                className="px-4 py-3 rounded-xl"
                style={{
                  background: 'rgba(106, 199, 247, 0.05)',
                  border: '1px solid rgba(106, 199, 247, 0.14)',
                  boxShadow: 'inset 0 0 18px rgba(106, 199, 247, 0.06)'
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.2 }}
              >
                <div className="flex items-start gap-2.5">
                  <Sparkles className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: 'rgba(106, 199, 247, 0.75)' }} />
                  <div>
                    <p style={{
                      fontSize: '10px',
                      fontWeight: 600,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'rgba(106, 199, 247, 0.80)',
                      marginBottom: '5px'
                    }}>
                      Lyra Insight
                    </p>
                    <p style={{
                      fontSize: '12.5px',
                      lineHeight: '1.5',
                      color: 'rgba(225, 238, 248, 0.95)',
                      fontWeight: 400
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
                bottom: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '10px solid transparent',
                borderRight: '10px solid transparent',
                borderTop: '10px solid rgba(255,255,255,0.12)'
              }} />
              <div style={{
                position: 'absolute',
                bottom: '-7px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '9px solid transparent',
                borderRight: '9px solid transparent',
                borderTop: '9px solid rgba(10, 14, 20, 0.94)'
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
          outline: 2px solid rgba(90, 160, 255, 0.6);
          outline-offset: 4px;
        }

        /* High Contrast Mode */
        @media (prefers-contrast: high) {
          .pulse-rail {
            border-color: rgba(255, 255, 255, 0.5) !important;
          }
        }

        /* Touch Targets */
        @media (pointer: coarse) {
          .equilibrium-pulse-module {
            min-height: 44px;
          }
        }
      `}</style>
    </motion.div>
  );
}