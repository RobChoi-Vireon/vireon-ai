
import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, useSpring } from 'framer-motion';
import { Globe } from 'lucide-react';
import LyraLogo from '../core/LyraLogo';

// ============================================================================
// MACRO EQUILIBRIUM GRID V2.2 - GLASS ECHOES (OS HORIZON)
// Parallax reflections + subsurface ripples for macOS Tahoe realism
// ============================================================================

// Visual state definitions for each macro posture
const POSTURE_STATES = {
  RISK_ON: {
    id: 'RISK_ON',
    label: 'Risk-On',
    coreHue: ['#D7F2F7', '#A7E9EF'], // Aqua-white gradient
    nucleusGlowMultiplier: 1.1,
    motionAmplitudeMultiplier: 1.05,
    pulseInterval: 6,
    mistSpeedMultiplier: 1.1,
    labelTone: 'rgba(255, 255, 255, 0.92)',
    accentReflection: '#91E7F2',
    emotionTone: 'buoyant clarity',
    breathingScale: [1.00, 1.018, 1.00]
  },
  NEUTRAL: {
    id: 'NEUTRAL',
    label: 'Neutral',
    coreHue: ['#C7CCD4', '#AEB5BE'], // Slate-silver gradient
    nucleusGlowMultiplier: 1.0,
    motionAmplitudeMultiplier: 1.0,
    pulseInterval: 8,
    mistSpeedMultiplier: 1.0,
    labelTone: 'rgba(255, 255, 255, 0.85)',
    accentReflection: '#DADDE2',
    emotionTone: 'stable equilibrium',
    breathingScale: [1.00, 1.015, 1.00]
  },
  RISK_OFF: {
    id: 'RISK_OFF',
    label: 'Risk-Off',
    coreHue: ['#F5E6C8', '#EBC69C'], // Amber-white gradient
    nucleusGlowMultiplier: 0.85,
    motionAmplitudeMultiplier: 0.8,
    pulseInterval: 10,
    mistSpeedMultiplier: 0.9,
    labelTone: 'rgba(255, 255, 255, 0.78)',
    accentReflection: '#E6C082',
    emotionTone: 'measured caution',
    breathingScale: [1.00, 1.012, 1.00]
  }
};

const MacroEquilibriumGrid = ({ onOpenSignalDrawer, globalPostureState = 'NEUTRAL', macroSignalStrength = 1.0 }) => {
  const containerRef = useRef(null);
  const [hoveredDomain, setHoveredDomain] = useState(null);
  const [isHoveringCenter, setIsHoveringCenter] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });
  const [isInteracting, setIsInteracting] = useState(false);
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const [time, setTime] = useState(0);
  const [isStateTransitioning, setIsStateTransitioning] = useState(false);
  
  // Glass Echoes v2.2 state
  const [ripples, setRipples] = useState([]);
  const [labelLift, setLabelLift] = useState({});
  const [trailGlows, setTrailGlows] = useState([]);
  const [fpsStable, setFpsStable] = useState(true);
  const lastRippleTime = useRef({});
  const frameTimesRef = useRef([]);
  
  // Spring-animated values for smooth state transitions
  const glowIntensity = useSpring(1.0, { stiffness: 80, damping: 25 });
  const motionAmplitude = useSpring(1.0, { stiffness: 80, damping: 25 });
  
  // Glass reflection parallax spring
  const glassReflectionX = useSpring(0, { stiffness: 400, damping: 40 });
  const glassReflectionY = useSpring(0, { stiffness: 400, damping: 40 });

  // OS Horizon easing
  const HORIZON_EASE = [0.45, 0, 0.1, 1];

  // Living color palette - desaturated, calm tones
  const LIVING_COLORS = {
    rates: '#A89BFA',      // Lavender
    fx: '#8CC8E7',         // Soft Aqua
    growth: '#A1D0B5',     // Mist Green
    geopolitics: '#E1B97A' // Warm Amber
  };

  // Get active posture state with fallback
  const activePosture = useMemo(() => {
    return POSTURE_STATES[globalPostureState] || POSTURE_STATES.NEUTRAL;
  }, [globalPostureState]);

  // Calculate modulated glow intensity with optional strength parameter
  const modulatedGlowIntensity = useMemo(() => {
    const baseMultiplier = activePosture.nucleusGlowMultiplier;
    const strengthModulation = 0.85 + (0.15 * Math.max(0, Math.min(1, macroSignalStrength)));
    return baseMultiplier * strengthModulation;
  }, [activePosture, macroSignalStrength]);

  // Update spring values when state changes
  useEffect(() => {
    setIsStateTransitioning(true);
    
    // Optional "breath catch" — 200ms pause for human feel
    const breathCatchTimer = setTimeout(() => {
      glowIntensity.set(modulatedGlowIntensity);
      motionAmplitude.set(activePosture.motionAmplitudeMultiplier);
    }, 200);

    const transitionCompleteTimer = setTimeout(() => {
      setIsStateTransitioning(false);
    }, 1100); // 200ms breath + 900ms transition

    return () => {
      clearTimeout(breathCatchTimer);
      clearTimeout(transitionCompleteTimer);
    };
  }, [activePosture, modulatedGlowIntensity, glowIntensity, motionAmplitude]);

  // Macro domains with living properties
  const macroDomains = useMemo(() => {
    const baseStrength = [78, 65, 71, 58];
    const baseVolatility = [0.8, 0.6, 0.9, 0.7];
    
    return [
      {
        id: 'rates',
        name: 'Rates',
        color: LIVING_COLORS.rates,
        opacity: 0.85,
        gridPosition: 'top-left',
        strength: baseStrength[0],
        volatility: baseVolatility[0],
        trend: 'Hawkish tilt continues',
        bias: 'Hawkish Tilt ↑',
        nodeSize: 16 + (baseStrength[0] / 100) * 32,
        confidence: Math.round((baseStrength[0] + baseVolatility[0] * 20) / 2)
      },
      {
        id: 'fx',
        name: 'FX',
        color: LIVING_COLORS.fx,
        opacity: 0.85,
        gridPosition: 'top-right',
        strength: baseStrength[1],
        volatility: baseVolatility[1],
        trend: 'USD strength persists',
        bias: 'Dollar Strength →',
        nodeSize: 16 + (baseStrength[1] / 100) * 32,
        confidence: Math.round((baseStrength[1] + baseVolatility[1] * 20) / 2)
      },
      {
        id: 'growth',
        name: 'Growth',
        color: LIVING_COLORS.growth,
        opacity: 0.85,
        gridPosition: 'bottom-left',
        strength: baseStrength[2],
        volatility: baseVolatility[2],
        trend: 'China slowdown weighing',
        bias: 'Soft Landing ~',
        nodeSize: 16 + (baseStrength[2] / 100) * 32,
        confidence: Math.round((baseStrength[2] + baseVolatility[2] * 20) / 2)
      },
      {
        id: 'geopolitics',
        name: 'Geopolitics',
        color: LIVING_COLORS.geopolitics,
        opacity: 0.85,
        gridPosition: 'bottom-right',
        strength: baseStrength[3],
        volatility: baseVolatility[3],
        trend: 'Energy security concerns',
        bias: 'Risk Premium ↑',
        nodeSize: 16 + (baseStrength[3] / 100) * 32,
        confidence: Math.round((baseStrength[3] + baseVolatility[3] * 20) / 2)
      }
    ];
  }, []);

  // Calculate global posture with light hue (now using activePosture)
  const getGlobalPosture = useCallback(() => {
    const avgStrength = macroDomains.reduce((sum, d) => sum + d.strength, 0) / macroDomains.length;
    const maxStrength = Math.max(...macroDomains.map(d => d.strength));
    const dominantDomain = macroDomains.find(d => d.strength === maxStrength);
    
    return { 
      label: activePosture.label,
      color: activePosture.coreHue[0],
      lightHue: activePosture.coreHue[0],
      confidence: Math.round(avgStrength),
      dominantDriver: dominantDomain.name,
      emotionTone: activePosture.emotionTone
    };
  }, [macroDomains, activePosture]);

  const globalPosture = getGlobalPosture();

  // Correlations
  const getCorrelations = useCallback(() => {
    return [
      { from: 'rates', to: 'fx', strength: 0.75 },
      { from: 'growth', to: 'geopolitics', strength: 0.72 }
    ];
  }, []);

  const correlations = getCorrelations();

  // Check reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldReduceMotion(mediaQuery.matches);
    const handler = (e) => setShouldReduceMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // FPS monitoring for performance guard
  useEffect(() => {
    if (shouldReduceMotion) return;
    
    let lastTime = performance.now();
    let frameId;
    
    const checkFPS = () => {
      const now = performance.now();
      const frameTime = now - lastTime;
      lastTime = now;
      
      frameTimesRef.current.push(frameTime);
      if (frameTimesRef.current.length > 5) {
        frameTimesRef.current.shift();
      }
      
      // Check if consistently over 16.6ms (60 FPS threshold)
      const avgFrameTime = frameTimesRef.current.reduce((a, b) => a + b, 0) / frameTimesRef.current.length;
      setFpsStable(avgFrameTime <= 16.6);
      
      frameId = requestAnimationFrame(checkFPS);
    };
    
    frameId = requestAnimationFrame(checkFPS);
    return () => cancelAnimationFrame(frameId);
  }, [shouldReduceMotion]);

  // Update dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: Math.min(rect.height, 500) });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Living pulse animation loop
  useEffect(() => {
    if (shouldReduceMotion) return;

    let animationFrameId;
    let startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const elapsed = (now - startTime) / 1000;
      setTime(elapsed);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [shouldReduceMotion]);

  // Glass reflection parallax tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        setCursorPosition({ x, y });
        
        if (isInteracting && !shouldReduceMotion) {
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          
          // Parallax for content
          const offsetX = ((x - centerX) / centerX) * 5;
          const offsetY = ((y - centerY) / centerY) * 5;
          setParallaxOffset({ x: offsetX, y: offsetY });
          
          // Glass reflection parallax (smaller range, clamped)
          const glassOffsetX = Math.max(-10, Math.min(10, ((x - centerX) / centerX) * 0.035 * rect.width));
          const glassOffsetY = Math.max(-10, Math.min(10, ((y - centerY) / centerY) * 0.035 * rect.height));
          glassReflectionX.set(glassOffsetX);
          glassReflectionY.set(glassOffsetY);
        }
      }
    };

    if (containerRef.current) {
      containerRef.current.addEventListener('mousemove', handleMouseMove);
      return () => containerRef.current?.removeEventListener('mousemove', handleMouseMove);
    }
  }, [isInteracting, shouldReduceMotion, glassReflectionX, glassReflectionY]);

  // Reset parallax
  useEffect(() => {
    if (!isInteracting) {
      const timer = setTimeout(() => {
        setParallaxOffset({ x: 0, y: 0 });
        glassReflectionX.set(0);
        glassReflectionY.set(0);
      }, 30);
      return () => clearTimeout(timer);
    }
  }, [isInteracting, glassReflectionX, glassReflectionY]);

  // Spawn subsurface ripple
  const spawnRipple = useCallback((x, y, elementId, isNucleus = false) => {
    if (shouldReduceMotion) return;
    
    const now = Date.now();
    const lastTime = lastRippleTime.current[elementId] || 0;
    
    // Throttle: min 700ms between ripples per element
    if (now - lastTime < 700) return;
    
    lastRippleTime.current[elementId] = now;
    
    // Cap at 2 concurrent ripples
    setRipples(prev => {
      const newRipples = [...prev];
      if (newRipples.length >= 2) {
        newRipples.shift(); // Remove oldest
      }
      
      // Ripple params adjusted by posture state
      const baseRadius = isNucleus ? 14 : 14;
      const baseMaxRadius = isNucleus ? 180 : 140;
      const baseDuration = isNucleus ? 1100 : 900;
      const baseOpacity = 0.10;
      
      let radiusMultiplier = 1;
      let opacityMultiplier = 1;
      let durationMultiplier = 1;
      
      if (activePosture.id === 'RISK_ON') {
        radiusMultiplier = 1.1;
        durationMultiplier = 0.9;
      } else if (activePosture.id === 'RISK_OFF') {
        radiusMultiplier = 0.9;
        opacityMultiplier = 0.8;
        durationMultiplier = 1.1;
      }
      
      const ripple = {
        id: `${elementId}-${now}`,
        x,
        y,
        startRadius: baseRadius,
        maxRadius: baseMaxRadius * radiusMultiplier,
        duration: baseDuration * durationMultiplier,
        opacity: baseOpacity * opacityMultiplier,
        startTime: now
      };
      
      newRipples.push(ripple);
      
      // Auto-remove after duration
      setTimeout(() => {
        setRipples(current => current.filter(r => r.id !== ripple.id));
      }, ripple.duration);
      
      return newRipples;
    });
    
    // Trigger label lift for nearby labels
    setLabelLift(prev => ({ ...prev, [elementId]: true }));
    setTimeout(() => {
      setLabelLift(prev => ({ ...prev, [elementId]: false }));
    }, 320);
  }, [shouldReduceMotion, activePosture]);

  // Spawn trail glow during pulse peak
  const spawnTrailGlow = useCallback((domain, index) => {
    if (shouldReduceMotion || !fpsStable) return;
    
    const pos = getGridPosition(domain);
    const drift = getLivingDrift(index);
    
    const trail = {
      id: `trail-${domain.id}-${Date.now()}`,
      x: pos.x,
      y: pos.y + drift,
      color: domain.color,
      startTime: Date.now()
    };
    
    setTrailGlows(prev => [...prev, trail]);
    
    setTimeout(() => {
      setTrailGlows(current => current.filter(t => t.id !== trail.id));
    }, 480);
  }, [shouldReduceMotion, fpsStable, dimensions, time, activePosture, motionAmplitude]); // Added missing dependencies to useCallback

  // Calculate fixed grid position
  const getGridPosition = useCallback((domain) => {
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const offset = 100;
    
    const positions = {
      'top-left': { x: centerX - offset, y: centerY - offset },
      'top-right': { x: centerX + offset, y: centerY - offset },
      'bottom-left': { x: centerX - offset, y: centerY + offset },
      'bottom-right': { x: centerX + offset, y: centerY + offset }
    };
    
    return positions[domain.gridPosition] || { x: centerX, y: centerY };
  }, [dimensions]);

  // Calculate living drift (vertical ±3px over dynamic interval, respecting state)
  const getLivingDrift = useCallback((index) => {
    if (shouldReduceMotion) return 0;
    const currentAmplitude = motionAmplitude.get();
    const phase = (time / activePosture.pulseInterval) * Math.PI * 2;
    return Math.sin(phase + (index * Math.PI / 4)) * 3 * currentAmplitude;
  }, [time, shouldReduceMotion, activePosture, motionAmplitude]);

  // Calculate nucleus ripple (using dynamic pulse interval)
  const getNucleusRipple = useCallback(() => {
    if (shouldReduceMotion) return { scale: 1, opacity: 0 };
    const ripplePhase = (time % activePosture.pulseInterval) / activePosture.pulseInterval;
    if (ripplePhase < 0.3) {
      return {
        scale: 1 + ripplePhase * 0.5,
        opacity: (1 - ripplePhase / 0.3) * 0.25 * glowIntensity.get()
      };
    }
    return { scale: 1, opacity: 0 };
  }, [time, shouldReduceMotion, activePosture, glowIntensity]);

  const ripple = getNucleusRipple();

  // Get state-aware accent color for info cards
  const getStateAccentColor = () => {
    return activePosture.accentReflection;
  };

  // Detect pulse peak for trail glow spawning
  useEffect(() => {
    if (shouldReduceMotion || !fpsStable) return;
    
    const phase = (time / activePosture.pulseInterval) % 1;
    
    // Spawn trails at pulse peak (phase ~0.5)
    if (phase > 0.48 && phase < 0.52) {
      macroDomains.forEach((domain, index) => {
        spawnTrailGlow(domain, index);
      });
    }
  }, [time, activePosture, shouldReduceMotion, fpsStable, macroDomains, spawnTrailGlow]);

  return (
    <motion.section
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      aria-label="Visual equilibrium map of global macro domains"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pl-2">
        <div className="flex items-center space-x-3">
          <Globe className="w-6 h-6 text-blue-300" />
          <div>
            <h2 
              className="font-bold text-gray-100"
              style={{
                fontSize: '16px',
                lineHeight: '22px',
                letterSpacing: '0.01em'
              }}
            >
              Macro Equilibrium Grid
            </h2>
            <p 
              className="text-gray-400"
              style={{
                fontSize: '13px',
                color: 'rgba(255, 255, 255, 0.68)'
              }}
            >
              Living balance of global macro forces • {activePosture.emotionTone}
            </p>
          </div>
        </div>
        
        {/* Powered by Lyra */}
        <motion.div
          className="group cursor-pointer relative"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <motion.div
            className="absolute -inset-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(129, 140, 248, 0.15) 0%, transparent 70%)',
              filter: 'blur(8px)',
            }}
          />
          
          <motion.div
            className="relative flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '10px'
            }}
            whileHover={{
              background: 'rgba(255, 255, 255, 0.08)',
              borderColor: 'rgba(129, 140, 248, 0.3)',
              boxShadow: '0 8px 32px rgba(129, 140, 248, 0.2)',
            }}
            transition={{ duration: 0.3 }}
          >
            <motion.span 
              className="text-xs font-medium text-gray-400 group-hover:text-gray-300 transition-colors duration-300"
            >
              Powered by
            </motion.span>
            
            <motion.div
              whileHover={{ scale: 1.1, rotate: [0, -2, 2, 0] }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <LyraLogo className="w-5 h-5" />
            </motion.div>
            
            <motion.span 
              className="text-sm font-bold text-white group-hover:text-blue-200 transition-colors duration-300"
            >
              Lyra
            </motion.span>
          </motion.div>
        </motion.div>
      </div>

      {/* Living Grid Container */}
      <motion.div 
        ref={containerRef}
        className="relative w-full rounded-3xl overflow-hidden"
        style={{
          height: '500px',
          background: 'radial-gradient(ellipse at center, rgba(10, 12, 18, 0.96) 0%, rgba(6, 8, 12, 0.98) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(22px)',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.04), 0 12px 40px rgba(0,0,0,0.3)',
          willChange: 'transform, opacity'
        }}
        onMouseEnter={() => {
          setIsInteracting(true);
          if (containerRef.current) {
            containerRef.current.style.filter = 'brightness(1.02)';
          }
        }}
        onMouseLeave={() => {
          setIsInteracting(false);
          setHoveredDomain(null);
          setIsHoveringCenter(false);
          if (containerRef.current) {
            containerRef.current.style.filter = 'brightness(1)';
          }
        }}
        animate={shouldReduceMotion ? {} : {
          scale: activePosture.breathingScale,
        }}
        transition={shouldReduceMotion ? {} : {
          duration: activePosture.pulseInterval,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        {/* Glass Reflection Pane - v2.2 */}
        {!shouldReduceMotion && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%, rgba(255,255,255,0.10) 100%)',
              mixBlendMode: 'overlay',
              x: glassReflectionX,
              y: glassReflectionY,
              willChange: 'transform',
              zIndex: 5
            }}
            animate={shouldReduceMotion ? {} : {
              opacity: [0.06, 0.10, 0.06]
            }}
            transition={{
              duration: 16,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            aria-hidden="true"
          />
        )}

        {/* Ambient Mist Particles with state-aware speed */}
        {!shouldReduceMotion && (
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={`mist-${i}`}
                className="absolute rounded-full"
                style={{
                  width: 2 + Math.random() * 3,
                  height: 2 + Math.random() * 3,
                  background: `${activePosture.coreHue[0]}15`,
                  filter: 'blur(1px)',
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  x: [0, Math.random() * 40 - 20],
                  y: [0, Math.random() * 40 - 20],
                  opacity: [0.025, 0.03, 0.025]
                }}
                transition={{
                  duration: (8 + Math.random() * 4) / activePosture.mistSpeedMultiplier,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: Math.random() * 2
                }}
              />
            ))}
          </div>
        )}

        {/* Dynamic Ambient Light Layer - crossfades with state */}
        <motion.div 
          className="absolute inset-0 pointer-events-none transition-colors duration-1000"
          style={{
            background: `radial-gradient(ellipse at center, ${activePosture.coreHue[0]}08 0%, transparent 70%)`,
            mixBlendMode: 'screen',
            opacity: 0.4
          }}
          animate={{
            background: `radial-gradient(ellipse at center, ${activePosture.coreHue[0]}08 0%, transparent 70%)`
          }}
          transition={{
            duration: 0.9,
            ease: [0.25, 0.1, 0.25, 1]
          }}
          aria-hidden="true"
        />

        {/* Subsurface Glow Layer */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            mixBlendMode: 'overlay',
            borderRadius: '24px'
          }}
          aria-hidden="true"
        />

        {/* Subsurface Ripples - v2.2 */}
        <AnimatePresence>
          {ripples.map(ripple => {
            const elapsed = (Date.now() - ripple.startTime) / ripple.duration;
            if (elapsed >= 1) return null;
            
            const currentRadius = ripple.startRadius + (ripple.maxRadius - ripple.startRadius) * elapsed;
            const currentOpacity = ripple.opacity * (1 - elapsed);
            
            return (
              <motion.div
                key={ripple.id}
                className="absolute pointer-events-none"
                style={{
                  left: ripple.x,
                  top: ripple.y,
                  width: currentRadius * 2,
                  height: currentRadius * 2,
                  marginLeft: -currentRadius,
                  marginTop: -currentRadius,
                  borderRadius: '50%',
                  border: `2px solid rgba(255, 255, 255, ${currentOpacity})`,
                  boxShadow: `0 0 12px rgba(255, 255, 255, ${currentOpacity * 0.5})`,
                  filter: 'blur(12px)',
                  mixBlendMode: 'soft-light',
                  zIndex: 2,
                  willChange: 'transform, opacity'
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: currentOpacity, 
                  scale: currentRadius / ripple.startRadius 
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: ripple.duration / 1000,
                  ease: [0.45, 0, 0.1, 1]
                }}
                aria-hidden="true"
              />
            );
          })}
        </AnimatePresence>

        {/* Trail Glows - v2.2 */}
        {!shouldReduceMotion && fpsStable && (
          <AnimatePresence>
            {trailGlows.map(trail => {
              const elapsed = (Date.now() - trail.startTime) / 480;
              if (elapsed >= 1) return null;
              
              // Desaturate and brighten color
              const trailColor = trail.color.replace(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/, (match, r, g, b) => {
                const avg = (parseInt(r) + parseInt(g) + parseInt(b)) / 3;
                const newR = Math.min(255, parseInt(r) * 0.75 + avg * 0.25 + 15);
                const newG = Math.min(255, parseInt(g) * 0.75 + avg * 0.25 + 15);
                const newB = Math.min(255, parseInt(b) * 0.75 + avg * 0.25 + 15);
                return `rgb(${newR}, ${newG}, ${newB})`;
              });
              
              return (
                <motion.div
                  key={trail.id}
                  className="absolute pointer-events-none"
                  style={{
                    left: trail.x - 32,
                    top: trail.y - 4,
                    width: Math.max(36, 64 * (1 - elapsed)),
                    height: 8,
                    background: `linear-gradient(90deg, ${trailColor}00, ${trailColor}${Math.floor((0.08 * (1 - elapsed)) * 255).toString(16).padStart(2, '0')}, ${trailColor}00)`,
                    filter: 'blur(4px)',
                    zIndex: 1,
                    willChange: 'opacity'
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.08 * (1 - elapsed) }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.48, ease: 'easeOut' }}
                  aria-hidden="true"
                />
              );
            })}
          </AnimatePresence>
        )}

        {/* Grid System with Living Motion */}
        <motion.div 
          className="absolute inset-0"
          animate={{
            x: parallaxOffset.x,
            y: parallaxOffset.y
          }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
            mass: 0.8,
            duration: 0.4
          }}
          style={{
            willChange: 'transform',
            zIndex: 3
          }}
        >
          <svg 
            width={dimensions.width} 
            height={dimensions.height}
            className="absolute inset-0"
            style={{ pointerEvents: 'none' }}
          >
            <defs>
              {/* Enhanced glow filters */}
              {macroDomains.map((domain) => (
                <filter key={`glow-${domain.id}`} id={`node-glow-${domain.id}`} x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="16" result="blur" />
                  <feFlood floodColor={domain.color} floodOpacity="0.6" />
                  <feComposite in2="blur" operator="in" result="glow" />
                  <feMerge>
                    <feMergeNode in="glow" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              ))}

              {/* Nucleus gradient - now state-aware */}
              <radialGradient id="nucleus-gradient">
                <stop offset="0%" stopColor={activePosture.coreHue[0]} stopOpacity="0.15" />
                <stop offset="100%" stopColor={activePosture.coreHue[1]} stopOpacity="0.02" />
              </radialGradient>

              {/* Connection line gradients */}
              {correlations.map((corr, i) => {
                const fromDomain = macroDomains.find(d => d.id === corr.from);
                const toDomain = macroDomains.find(d => d.id === corr.to);
                return (
                  <linearGradient key={`corr-${i}`} id={`corr-gradient-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={fromDomain.color} stopOpacity="0.4" />
                    <stop offset="100%" stopColor={toDomain.color} stopOpacity="0.4" />
                  </linearGradient>
                );
              })}
            </defs>

            {/* Connection Lines */}
            {correlations.filter(c => c.strength > 0.7).map((corr, i) => {
              const fromDomain = macroDomains.find(d => d.id === corr.from);
              const toDomain = macroDomains.find(d => d.id === corr.to);
              const fromPos = getGridPosition(fromDomain);
              const toPos = getGridPosition(toDomain);
              
              const isHighlighted = hoveredDomain === corr.from || hoveredDomain === corr.to;
              
              return (
                <motion.line
                  key={`line-${i}`}
                  x1={fromPos.x}
                  y1={fromPos.y + getLivingDrift(macroDomains.findIndex(d => d.id === corr.from))}
                  x2={toPos.x}
                  y2={toPos.y + getLivingDrift(macroDomains.findIndex(d => d.id === corr.to))}
                  stroke={`url(#corr-gradient-${i})`}
                  strokeWidth="2"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: isHighlighted ? 0.6 : 0.4
                  }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                />
              );
            })}

            {/* Center Nucleus with Ripple - state-aware glow */}
            <g>
              {/* Ripple wave */}
              {ripple.opacity > 0 && (
                <motion.circle
                  cx={dimensions.width / 2}
                  cy={dimensions.height / 2}
                  r={50 * ripple.scale}
                  fill="none"
                  stroke={activePosture.coreHue[0]}
                  strokeWidth="2"
                  opacity={ripple.opacity}
                  style={{
                    filter: 'blur(2px)'
                  }}
                />
              )}

              {/* Outer glow - state-aware */}
              <motion.circle
                cx={dimensions.width / 2}
                cy={dimensions.height / 2}
                r="50"
                fill="url(#nucleus-gradient)"
                animate={shouldReduceMotion ? {} : {
                  r: [50, 51, 50],
                  opacity: [glowIntensity.get() * 0.5, glowIntensity.get() * 0.6, glowIntensity.get() * 0.5]
                }}
                transition={{
                  duration: activePosture.pulseInterval,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                style={{
                  filter: 'blur(12px)'
                }}
              />

              {/* Core nucleus - state-aware color */}
              <motion.circle
                cx={dimensions.width / 2}
                cy={dimensions.height / 2}
                r="20"
                fill={activePosture.coreHue[0]}
                className="cursor-pointer"
                animate={shouldReduceMotion ? {} : {
                  scale: [1, 1.02, 1],
                  opacity: [0.7 * glowIntensity.get(), 0.75 * glowIntensity.get(), 0.7 * glowIntensity.get()]
                }}
                transition={{
                  duration: activePosture.pulseInterval,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                onMouseEnter={() => {
                  setIsHoveringCenter(true);
                  spawnRipple(dimensions.width / 2, dimensions.height / 2, 'nucleus', true);
                }}
                onMouseLeave={() => setIsHoveringCenter(false)}
                style={{
                  filter: `drop-shadow(0 0 ${22 * glowIntensity.get()}px ${activePosture.coreHue[0]}80)`,
                  pointerEvents: 'all',
                  transformOrigin: `${dimensions.width / 2}px ${dimensions.height / 2}px`
                }}
              />

              {/* Highlight */}
              <ellipse
                cx={dimensions.width / 2 - 5}
                cy={dimensions.height / 2 - 5}
                rx="5"
                ry="6"
                fill="rgba(255, 255, 255, 0.5)"
                style={{
                  filter: 'blur(2px)'
                }}
              />
            </g>

            {/* Living Orbs */}
            {macroDomains.map((domain, index) => {
              const pos = getGridPosition(domain);
              const drift = getLivingDrift(index);
              const isHovered = hoveredDomain === domain.id;
              
              // Cascading wave response (0.6s delay between rings)
              const waveDelay = index * 0.6;
              const waveResponse = ripple.opacity > 0 ? 1 + ripple.scale * 0.05 : 1;
              
              return (
                <g key={domain.id}>
                  {/* Anticipatory pre-glow (50px radius detection) */}
                  <motion.circle
                    cx={pos.x}
                    cy={pos.y + drift}
                    r={domain.nodeSize + 12}
                    fill={domain.color}
                    opacity={0}
                    animate={{
                      opacity: isHovered ? domain.opacity * 0.4 : 0
                    }}
                    transition={{ duration: 0.2 }}
                    style={{
                      filter: 'blur(18px)'
                    }}
                  />

                  {/* Node glow with wave response */}
                  <motion.circle
                    cx={pos.x}
                    cy={pos.y + drift}
                    r={domain.nodeSize + 8}
                    fill={domain.color}
                    opacity={domain.opacity * 0.3}
                    filter={`url(#node-glow-${domain.id})`}
                    animate={shouldReduceMotion ? {} : {
                      scale: isHovered ? 1.1 : (hoveredDomain && hoveredDomain !== domain.id ? 1 : waveResponse),
                      opacity: isHovered ? domain.opacity * 0.5 : (hoveredDomain && hoveredDomain !== domain.id ? domain.opacity * 0.25 : domain.opacity * 0.3)
                    }}
                    transition={{
                      scale: { duration: 0.35, ease: 'easeOut', delay: waveDelay },
                      opacity: { duration: 0.35 }
                    }}
                    style={{
                      transformOrigin: `${pos.x}px ${pos.y + drift}px`
                    }}
                  />

                  {/* Node core with ripple spawn */}
                  <motion.circle
                    cx={pos.x}
                    cy={pos.y + drift}
                    r={domain.nodeSize}
                    fill={domain.color}
                    opacity={domain.opacity}
                    className="cursor-pointer"
                    onMouseEnter={() => {
                      setHoveredDomain(domain.id);
                      spawnRipple(pos.x, pos.y + drift, domain.id, false);
                    }}
                    onMouseLeave={() => setHoveredDomain(null)}
                    animate={shouldReduceMotion ? {} : {
                      scale: isHovered ? 1.1 : waveResponse,
                      opacity: isHovered ? domain.opacity + 0.1 : domain.opacity
                    }}
                    transition={{
                      scale: { duration: 0.35, ease: 'easeOut', delay: waveDelay },
                      opacity: { duration: 0.35 }
                    }}
                    style={{
                      pointerEvents: 'all',
                      transformOrigin: `${pos.x}px ${pos.y + drift}px`,
                      filter: `drop-shadow(0 0 22px ${domain.color}60)`
                    }}
                  />

                  {/* Highlight */}
                  <ellipse
                    cx={pos.x - 3}
                    cy={pos.y + drift - 3}
                    rx="3"
                    ry="4"
                    fill="rgba(255, 255, 255, 0.6)"
                    style={{
                      filter: 'blur(1px)'
                    }}
                  />
                </g>
              );
            })}
          </svg>

          {/* Always-Visible Captions with Label Lift - v2.2 */}
          {macroDomains.map((domain, index) => {
            const pos = getGridPosition(domain);
            const drift = getLivingDrift(index);
            const isHovered = hoveredDomain === domain.id;
            const hasLift = labelLift[domain.id];
            
            return (
              <motion.div
                key={`caption-${domain.id}`}
                className="absolute pointer-events-none"
                style={{
                  left: pos.x,
                  top: pos.y + drift + domain.nodeSize + 18,
                  transform: 'translateX(-50%)',
                  fontFamily: 'SF Pro Text, -apple-system, system-ui, sans-serif',
                  fontSize: '12px',
                  fontWeight: 500,
                  letterSpacing: '-0.01em',
                  color: domain.color,
                  opacity: 0.8,
                  textShadow: hasLift 
                    ? `0 1px 0 rgba(255, 255, 255, 0.25), 0 0 8px ${domain.color}20`
                    : `0 0 8px ${domain.color}20`,
                  whiteSpace: 'nowrap',
                  willChange: 'opacity, text-shadow'
                }}
                animate={{
                  opacity: isHovered ? 1 : 0.8,
                  color: isStateTransitioning ? activePosture.labelTone : domain.color
                }}
                transition={{ 
                  opacity: { duration: 0.2 },
                  color: { duration: 0.6 },
                  textShadow: { duration: 0.32 }
                }}
              >
                {domain.name} – {domain.bias}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Center Hover Tooltip - state-aware accent */}
        <AnimatePresence>
          {isHoveringCenter && (
            <motion.div
              className="absolute pointer-events-none z-[200]"
              style={{
                left: dimensions.width / 2,
                top: dimensions.height / 2 - 70,
                transform: 'translateX(-50%)'
              }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.35, ease: HORIZON_EASE }}
            >
              <div
                className="px-4 py-2.5 rounded-xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(18px)',
                  WebkitBackdropFilter: 'blur(18px)',
                  border: `1px solid ${getStateAccentColor()}40`,
                  boxShadow: `0 8px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)`,
                  borderRadius: '14px'
                }}
              >
                <div className="text-center">
                  <span 
                    className="text-sm font-semibold block mb-1"
                    style={{ color: 'rgba(255, 255, 255, 0.82)' }}
                  >
                    Global Posture
                  </span>
                  <span 
                    className="text-base font-bold block mb-1"
                    style={{ color: activePosture.coreHue[0] }}
                  >
                    {globalPosture.label}
                  </span>
                  <span 
                    className="text-xs block"
                    style={{ color: 'rgba(255, 255, 255, 0.65)' }}
                  >
                    {activePosture.emotionTone} • Dominant: {globalPosture.dominantDriver}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Domain Hover Glass Card - state-aware accent */}
        <AnimatePresence>
          {hoveredDomain && (
            <motion.div
              className="absolute pointer-events-none z-[200]"
              style={{
                left: cursorPosition.x + 16,
                top: cursorPosition.y - 40,
              }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.35, ease: HORIZON_EASE }}
            >
              {(() => {
                const domain = macroDomains.find(d => d.id === hoveredDomain);
                if (!domain) return null;
                
                return (
                  <div
                    className="px-4 py-3 rounded-xl"
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      backdropFilter: 'blur(18px)',
                      WebkitBackdropFilter: 'blur(18px)',
                      border: `1px solid ${domain.color}40`,
                      boxShadow: `0 8px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)`,
                      borderRadius: '14px',
                      minWidth: '240px'
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div 
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ 
                          background: domain.color,
                          boxShadow: `0 0 8px ${domain.color}80`
                        }}
                      />
                      <span 
                        className="text-sm font-semibold"
                        style={{ color: 'rgba(255, 255, 255, 0.9)' }}
                      >
                        {domain.name}
                      </span>
                    </div>
                    <p 
                      className="text-xs mb-2"
                      style={{ 
                        color: 'rgba(255, 255, 255, 0.75)',
                        lineHeight: '1.4',
                        fontFamily: 'SF Pro Text, -apple-system, system-ui, sans-serif',
                        fontSize: '13px'
                      }}
                    >
                      {domain.trend}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span style={{ color: 'rgba(255, 255, 255, 0.65)' }}>
                        Confidence: {domain.confidence}%
                      </span>
                      <span style={{ color: domain.color, fontWeight: 600 }}>
                        {domain.bias}
                      </span>
                    </div>
                    
                    {/* Correlation ripple indicator - state-aware accent */}
                    <motion.div 
                      className="mt-2 pt-2 border-t"
                      style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}
                    >
                      <div className="flex items-center gap-2">
                        <motion.div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: getStateAccentColor() }}
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.6, 1, 0.6]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut'
                          }}
                        />
                        <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '11px' }}>
                          Correlation pulse active
                        </span>
                      </div>
                    </motion.div>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Legend - Bottom Left */}
        <div className="absolute bottom-6 left-6">
          <div 
            className="flex flex-wrap items-center gap-3 px-4 py-2 rounded-xl border backdrop-blur-xl"
            style={{
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '10px'
            }}
          >
            {macroDomains.map((domain) => (
              <motion.div 
                key={domain.id}
                className="flex items-center gap-2 cursor-pointer"
                whileHover={{ opacity: 1, scale: 1.05 }}
                style={{ opacity: 0.7 }}
                transition={{ duration: 0.2 }}
                onHoverStart={() => setHoveredDomain(domain.id)}
                onHoverEnd={() => setHoveredDomain(null)}
              >
                <div 
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ 
                    background: domain.color,
                    boxShadow: `0 0 6px ${domain.color}60`
                  }}
                />
                <span 
                  className="text-xs font-medium"
                  style={{ 
                    color: 'rgba(255, 255, 255, 0.82)',
                    fontSize: '12px'
                  }}
                >
                  {domain.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Performance CSS */}
      <style jsx>{`
        /* GPU acceleration */
        svg, .absolute {
          transform: translateZ(0);
          will-change: transform, opacity;
          backface-visibility: hidden;
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* Smooth rendering */
        svg {
          shape-rendering: geometricPrecision;
        }
      `}</style>
    </motion.section>
  );
};

export default MacroEquilibriumGrid;
