import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Info, Sparkles } from 'lucide-react';

// ============================================================================
// EQUILIBRIUM BALANCE MODULE — OS HORIZON V3.2
// Dynamic macro force visualization with intelligent hover interactions
// ============================================================================

const MOTION_TOKENS = {
  CURVES: {
    horizonIn: [0.22, 0.61, 0.36, 1],
    horizonOut: [0.4, 0.0, 0.2, 1],
    horizonSpring: [0.16, 1, 0.3, 1],
    inertialDrift: [0.22, 1, 0.36, 1],
    trendPulse: [0.25, 0.1, 0.25, 1]
  },
  DURATIONS: {
    orbBreathe: 4,
    drift: 0.8,
    drawerReveal: 0.20,
    trendPulse: 0.15,
    arrowChange: 0.25
  }
};

const FORCE_COLORS = {
  growth: { core: '#3FAEFF', glow: 'rgba(63,174,255,0.25)', text: '#B8E7FF' },
  rates: { core: '#C0A6FF', glow: 'rgba(192,166,255,0.25)', text: '#DECFFF' },
  fx: { core: '#6AC7F7', glow: 'rgba(106,199,247,0.25)', text: '#B8E7FF' },
  geopolitics: { core: '#FFC772', glow: 'rgba(255,199,114,0.25)', text: '#FFE8B8' }
};

export default function EquilibriumBalanceModule({ 
  equilibriumScore = 0.52, 
  trend = 'improving',
  dominantForce = 'balanced',
  forces = {
    growth: 0.42,
    rates: -0.38,
    fx: 0.15,
    geopolitics: -0.28
  },
  stabilityIndex = 72,
  summary = "Global market forces are balanced — some pressure from international tensions.",
  actionableInsight = "Watch for rising political tensions. Consider safer, more defensive investments.",
  lastUpdated = new Date()
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const [orbBreathPhase, setOrbBreathPhase] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldReduceMotion(mediaQuery.matches);
    const handler = (e) => setShouldReduceMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (shouldReduceMotion) return;
    
    let rafId;
    let startTime = Date.now();
    
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const phase = (elapsed % MOTION_TOKENS.DURATIONS.orbBreathe) / MOTION_TOKENS.DURATIONS.orbBreathe;
      setOrbBreathPhase(phase);
      rafId = requestAnimationFrame(animate);
    };
    
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [shouldReduceMotion]);

  const orbScale = useMemo(() => {
    if (shouldReduceMotion) return 1;
    const breathe = Math.sin(orbBreathPhase * Math.PI * 2);
    return 0.97 + (breathe * 0.03);
  }, [orbBreathPhase, shouldReduceMotion]);

  const orbGlow = useMemo(() => {
    if (shouldReduceMotion) return 0.35;
    const pulse = Math.sin(orbBreathPhase * Math.PI * 2);
    return 0.35 + (pulse * 0.12);
  }, [orbBreathPhase, shouldReduceMotion]);

  const orbPosition = useMemo(() => {
    const position = equilibriumScore * 100;
    const drift = shouldReduceMotion ? 0 : Math.sin(orbBreathPhase * Math.PI) * 0.5;
    return Math.max(8, Math.min(92, position + drift));
  }, [equilibriumScore, orbBreathPhase, shouldReduceMotion]);

  const getTrendIcon = () => {
    if (trend === 'improving') return <TrendingUp className="w-3.5 h-3.5" style={{ color: '#58E3A4' }} />;
    if (trend === 'deteriorating') return <TrendingDown className="w-3.5 h-3.5" style={{ color: '#FF9B7A' }} />;
    return <Minus className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.5)' }} />;
  };

  const getTrendColor = () => {
    if (trend === 'improving') return '#58E3A4';
    if (trend === 'deteriorating') return '#FF9B7A';
    return 'rgba(255,255,255,0.5)';
  };

  const getOrbColor = () => {
    if (dominantForce === 'balanced') return '#3FAEFF';
    if (equilibriumScore < 0.35) return FORCE_COLORS.growth.core;
    if (equilibriumScore > 0.65) return FORCE_COLORS.geopolitics.core;
    return '#8DC4FF';
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

  return (
    <motion.div
      ref={containerRef}
      className="equilibrium-balance-module group relative"
      style={{
        width: '72%',
        margin: '0 auto',
        padding: '20px 24px',
        borderRadius: '16px',
        backdropFilter: 'blur(24px) saturate(165%)',
        WebkitBackdropFilter: 'blur(24px) saturate(165%)',
        background: 'rgba(20, 24, 29, 0.35)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: 'inset 0 2px 12px rgba(0, 0, 0, 0.45), 0 8px 32px rgba(0, 0, 0, 0.25)',
        cursor: 'pointer',
        willChange: 'filter, transform'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{
        filter: 'brightness(1.04)',
        transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }
      }}
      whileTap={{
        scale: 0.995,
        transition: { duration: 0.1, ease: 'easeOut' }
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3, ease: MOTION_TOKENS.CURVES.horizonIn }}
    >
      {/* Top rim highlight */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '20px',
        right: '20px',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
        borderRadius: '999px',
        pointerEvents: 'none'
      }} />

      {/* Header Row */}
      <div className="flex items-center justify-between mb-5">
        <motion.div className="flex items-center gap-3">
          <h4 
            style={{
              fontSize: '14px',
              fontWeight: 600,
              letterSpacing: '-0.01em',
              color: 'rgba(255,255,255,0.95)',
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'
            }}
          >
            Global Equilibrium
          </h4>
          
          {/* Trend Arrow */}
          <motion.div
            className="flex items-center gap-1.5"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              transition: {
                duration: MOTION_TOKENS.DURATIONS.arrowChange,
                ease: MOTION_TOKENS.CURVES.trendPulse
              }
            }}
            key={trend}
          >
            <motion.div
              animate={shouldReduceMotion ? {} : {
                scale: [1, 1.2, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{
                duration: MOTION_TOKENS.DURATIONS.trendPulse,
                ease: 'easeInOut'
              }}
            >
              {getTrendIcon()}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Info Hint Transform */}
        <motion.div
          className="flex items-center gap-2 overflow-hidden"
          style={{ height: '20px' }}
        >
          <AnimatePresence mode="wait">
            {!isHovered ? (
              <motion.div
                key="info-icon"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.15 }}
              >
                <Info className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.4)' }} />
              </motion.div>
            ) : (
              <motion.span
                key="info-text"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.15 }}
                style={{
                  fontSize: '12px',
                  fontWeight: 500,
                  color: 'rgba(90, 160, 255, 0.95)',
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                View Force Breakdown
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Horizon Balance Line Container */}
      <div style={{ 
        width: '100%', 
        margin: '0 auto',
        position: 'relative',
        height: '28px',
        marginBottom: '16px'
      }}>
        {/* Balance Line Base */}
        <motion.div 
          style={{ 
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            height: '2px', 
            borderRadius: '999px',
            background: 'linear-gradient(90deg, #3FAEFF 0%, #8DC4FF 30%, #C9B46B 50%, #FFD37A 70%, #FFC772 100%)',
            boxShadow: '0 2px 8px rgba(63, 174, 255, 0.15)',
            transform: 'translateY(-50%)'
          }}
          animate={shouldReduceMotion ? {} : {
            scaleX: [1, 1.01, 1],
            opacity: [0.9, 1, 0.9]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: [0.4, 0, 0.2, 1]
          }}
        >
          {/* Traveling shimmer */}
          {!shouldReduceMotion && (
            <motion.div 
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)',
                width: '100%',
                borderRadius: '999px'
              }}
              animate={{
                x: ['-100%', '200%']
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'linear',
                repeatDelay: 1
              }}
            />
          )}
        </motion.div>

        {/* Subsurface glow beneath line */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          height: '8px',
          background: 'linear-gradient(90deg, rgba(63,174,255,0.12), rgba(255,199,114,0.12))',
          filter: 'blur(8px)',
          opacity: 0.6,
          transform: 'translateY(-50%)',
          pointerEvents: 'none'
        }} />

        {/* Horizon Balance Orb */}
        <motion.div
          className="horizon-orb"
          style={{
            position: 'absolute',
            top: '50%',
            left: `${orbPosition}%`,
            transform: 'translate(-50%, -50%)',
            width: '18px',
            height: '18px',
            borderRadius: '999px',
            background: getOrbColor(),
            boxShadow: `0 0 ${16 * orbGlow}px ${getOrbColor()}80, 0 0 4px rgba(255,255,255,0.4)`,
            border: '2px solid rgba(255,255,255,0.3)',
            zIndex: 3,
            pointerEvents: 'none',
            willChange: 'transform, box-shadow'
          }}
          animate={{
            scale: orbScale,
            boxShadow: `0 0 ${16 * orbGlow}px ${getOrbColor()}80, 0 0 4px rgba(255,255,255,0.4)`
          }}
          transition={{
            left: { 
              duration: MOTION_TOKENS.DURATIONS.drift, 
              ease: MOTION_TOKENS.CURVES.inertialDrift 
            }
          }}
        >
          {/* Inner refraction highlight */}
          <div style={{
            position: 'absolute',
            top: '3px',
            left: '3px',
            width: '6px',
            height: '6px',
            borderRadius: '999px',
            background: 'rgba(255,255,255,0.6)',
            filter: 'blur(1px)',
            pointerEvents: 'none'
          }} />
        </motion.div>

        {/* Force Labels - Left & Right */}
        <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-xs" style={{
          color: 'rgba(255,255,255,0.58)',
          fontWeight: 500,
          letterSpacing: '0.01em',
          fontSize: '11px'
        }}>
          <span>Growth / Demand</span>
          <span>Tightening / Supply</span>
        </div>
      </div>

      {/* One-Line Summary */}
      <motion.p
        style={{
          fontSize: '13px',
          lineHeight: '1.5',
          color: 'rgba(255,255,255,0.85)',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
          fontWeight: 400,
          textAlign: 'center',
          marginTop: '16px',
          marginBottom: '4px'
        }}
        animate={{
          opacity: isHovered ? 0.95 : 0.85
        }}
        transition={{ duration: 0.2 }}
      >
        {summary}
      </motion.p>

      {/* Hover Drawer Bubble */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 w-full max-w-md pointer-events-none"
            style={{
              bottom: 'calc(100% + 16px)',
              zIndex: 20
            }}
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ 
              duration: MOTION_TOKENS.DURATIONS.drawerReveal, 
              ease: MOTION_TOKENS.CURVES.horizonIn 
            }}
          >
            <div
              className="p-5 rounded-2xl"
              style={{
                background: 'rgba(12, 15, 20, 0.92)',
                backdropFilter: 'blur(28px) saturate(180%)',
                WebkitBackdropFilter: 'blur(28px) saturate(180%)',
                border: '1px solid rgba(255,255,255,0.12)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)'
              }}
            >
              {/* Drawer top highlight */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: '24px',
                right: '24px',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)',
                borderRadius: '999px'
              }} />

              {/* Force Contribution Breakdown */}
              <div className="mb-5">
                <h5 style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.65)',
                  marginBottom: '14px'
                }}>
                  Force Contributions
                </h5>
                
                <div className="grid grid-cols-2 gap-3">
                  {sortedForces.map((force, i) => (
                    <motion.div
                      key={force.name}
                      className="flex items-center justify-between p-3 rounded-xl"
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.06)'
                      }}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.15 }}
                    >
                      <div className="flex items-center gap-2">
                        <div style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '999px',
                          background: force.color,
                          boxShadow: `0 0 8px ${force.glow}`
                        }} />
                        <span style={{
                          fontSize: '12px',
                          fontWeight: 500,
                          color: 'rgba(255,255,255,0.85)',
                          textTransform: 'capitalize'
                        }}>
                          {force.name}
                        </span>
                      </div>
                      <span style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: force.value > 0 ? '#58E3A4' : force.value < 0 ? '#FF9B7A' : 'rgba(255,255,255,0.6)'
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
                margin: '16px 0'
              }} />

              {/* Stability Index */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="relative w-9 h-9">
                    <svg className="transform -rotate-90" width="36" height="36">
                      <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2.5" />
                      <motion.circle
                        cx="18" cy="18" r="16" fill="none"
                        stroke="#5EA7FF"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeDasharray="100"
                        initial={{ strokeDashoffset: 100 }}
                        animate={{ strokeDashoffset: 100 - stabilityIndex }}
                        transition={{ duration: 0.7, delay: 0.2, ease: MOTION_TOKENS.CURVES.horizonIn }}
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
                  <div>
                    <div style={{
                      fontSize: '10px',
                      color: 'rgba(255,255,255,0.65)',
                      letterSpacing: '0.1em',
                      fontWeight: 600,
                      marginBottom: '2px',
                      textTransform: 'uppercase'
                    }}>
                      Stability Index
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: 'rgba(255,255,255,0.85)',
                      fontWeight: 500
                    }}>
                      {stabilityIndex >= 70 ? 'Stable' : stabilityIndex >= 50 ? 'Moderate' : 'Volatile'}
                    </div>
                  </div>
                </div>

                {/* Trend Badge */}
                <div
                  className="px-3 py-1.5 rounded-full"
                  style={{
                    background: trend === 'improving' 
                      ? 'rgba(88, 227, 164, 0.12)' 
                      : trend === 'deteriorating'
                        ? 'rgba(255, 155, 122, 0.12)'
                        : 'rgba(255,255,255,0.08)',
                    border: `1px solid ${trend === 'improving' 
                      ? 'rgba(88, 227, 164, 0.25)' 
                      : trend === 'deteriorating'
                        ? 'rgba(255, 155, 122, 0.25)'
                        : 'rgba(255,255,255,0.12)'}`,
                    fontSize: '11px',
                    fontWeight: 600,
                    color: getTrendColor(),
                    textTransform: 'capitalize'
                  }}
                >
                  {trend}
                </div>
              </div>

              {/* Actionable Interpretation */}
              <div
                className="p-4 rounded-xl"
                style={{
                  background: 'rgba(106, 199, 247, 0.06)',
                  border: '1px solid rgba(106, 199, 247, 0.15)',
                  boxShadow: 'inset 0 0 16px rgba(106, 199, 247, 0.08)'
                }}
              >
                <div className="flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'rgba(106, 199, 247, 0.8)' }} />
                  <div>
                    <p style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'rgba(106, 199, 247, 0.85)',
                      marginBottom: '6px'
                    }}>
                      Lyra Insight
                    </p>
                    <p style={{
                      fontSize: '13px',
                      lineHeight: '1.55',
                      color: 'rgba(220, 235, 245, 0.95)',
                      fontWeight: 400
                    }}>
                      {actionableInsight}
                    </p>
                  </div>
                </div>
              </div>

              {/* Drawer arrow */}
              <div style={{
                position: 'absolute',
                bottom: '-7px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '9px solid transparent',
                borderRight: '9px solid transparent',
                borderTop: '9px solid rgba(255,255,255,0.12)'
              }} />
              <div style={{
                position: 'absolute',
                bottom: '-6px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderTop: '8px solid rgba(12, 15, 20, 0.92)'
              }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timestamp Footer */}
      <motion.div
        className="flex items-center justify-center text-xs mt-3"
        style={{ color: 'rgba(255,255,255,0.45)', fontSize: '10px' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
      >
        Updated {new Date(lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </motion.div>

      <style jsx>{`
        .horizon-orb {
          will-change: transform, box-shadow;
        }

        @media (prefers-reduced-motion: reduce) {
          .horizon-orb {
            animation: none !important;
            transition: none !important;
          }
        }

        @supports (backdrop-filter: blur(28px)) {
          .equilibrium-balance-module {
            backdrop-filter: blur(24px) saturate(165%);
            -webkit-backdrop-filter: blur(24px) saturate(165%);
          }
        }
      `}</style>
    </motion.div>
  );
}