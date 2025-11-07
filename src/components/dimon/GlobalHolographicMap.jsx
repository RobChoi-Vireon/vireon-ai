import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe } from 'lucide-react';
import LyraLogo from '../core/LyraLogo';

// ============================================================================
// MACRO EQUILIBRIUM GRID V2.0 - THE LIVING BALANCE (OS HORIZON)
// ============================================================================

const MacroEquilibriumGrid = ({ onOpenSignalDrawer }) => {
  const containerRef = useRef(null);
  const [hoveredDomain, setHoveredDomain] = useState(null);
  const [isHoveringCenter, setIsHoveringCenter] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });
  const [isInteracting, setIsInteracting] = useState(false);
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const [time, setTime] = useState(0);

  // OS Horizon easing
  const HORIZON_EASE = [0.45, 0, 0.1, 1];

  // Living color palette - desaturated, calm tones
  const LIVING_COLORS = {
    rates: '#A89BFA',      // Lavender
    fx: '#8CC8E7',         // Soft Aqua
    growth: '#A1D0B5',     // Mist Green
    geopolitics: '#E1B97A' // Warm Amber
  };

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

  // Calculate global posture with light hue
  const getGlobalPosture = useCallback(() => {
    const avgStrength = macroDomains.reduce((sum, d) => sum + d.strength, 0) / macroDomains.length;
    const riskOffWeight = (macroDomains[0].strength + macroDomains[3].strength) / 2;
    const riskOnWeight = (macroDomains[1].strength + macroDomains[2].strength) / 2;
    
    const maxStrength = Math.max(...macroDomains.map(d => d.strength));
    const dominantDomain = macroDomains.find(d => d.strength === maxStrength);
    
    if (riskOffWeight > riskOnWeight + 10) {
      return { 
        label: 'Lean Risk-Off', 
        color: '#E1B97A',
        lightHue: '#F5E6C8', // Amber White
        confidence: Math.round(avgStrength),
        dominantDriver: dominantDomain.name
      };
    } else if (riskOnWeight > riskOffWeight + 10) {
      return { 
        label: 'Lean Risk-On', 
        color: '#8CC8E7',
        lightHue: '#D7F2F7', // Aqua White
        confidence: Math.round(avgStrength),
        dominantDriver: dominantDomain.name
      };
    } else {
      return { 
        label: 'Neutral', 
        color: '#C7CCD4',
        lightHue: '#C7CCD4', // Soft Slate
        confidence: Math.round(avgStrength),
        dominantDriver: 'Balanced'
      };
    }
  }, [macroDomains]);

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

  // Parallax tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        setCursorPosition({ x, y });
        
        if (isInteracting) {
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const offsetX = ((x - centerX) / centerX) * 5;
          const offsetY = ((y - centerY) / centerY) * 5;
          
          setParallaxOffset({ x: offsetX, y: offsetY });
        }
      }
    };

    if (containerRef.current) {
      containerRef.current.addEventListener('mousemove', handleMouseMove);
      return () => containerRef.current?.removeEventListener('mousemove', handleMouseMove);
    }
  }, [isInteracting]);

  // Reset parallax
  useEffect(() => {
    if (!isInteracting) {
      const timer = setTimeout(() => {
        setParallaxOffset({ x: 0, y: 0 });
      }, 30);
      return () => clearTimeout(timer);
    }
  }, [isInteracting]);

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

  // Calculate living drift (vertical ±3px over 6s)
  const getLivingDrift = useCallback((index) => {
    if (shouldReduceMotion) return 0;
    // Synchronized phase across all orbs
    const phase = (time / 6) * Math.PI * 2;
    return Math.sin(phase + (index * Math.PI / 4)) * 3;
  }, [time, shouldReduceMotion]);

  // Calculate nucleus ripple (every 8s)
  const getNucleusRipple = useCallback(() => {
    if (shouldReduceMotion) return { scale: 1, opacity: 0 };
    const ripplePhase = (time % 8) / 8;
    if (ripplePhase < 0.3) {
      return {
        scale: 1 + ripplePhase * 0.5,
        opacity: (1 - ripplePhase / 0.3) * 0.25
      };
    }
    return { scale: 1, opacity: 0 };
  }, [time, shouldReduceMotion]);

  const ripple = getNucleusRipple();

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
              Living balance of global macro forces.
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
          scale: [1.00, 1.015, 1.00],
        }}
        transition={shouldReduceMotion ? {} : {
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        {/* Ambient Mist Particles */}
        {!shouldReduceMotion && (
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={`mist-${i}`}
                className="absolute rounded-full"
                style={{
                  width: 2 + Math.random() * 3,
                  height: 2 + Math.random() * 3,
                  background: 'rgba(255, 255, 255, 0.025)',
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
                  duration: 8 + Math.random() * 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: Math.random() * 2
                }}
              />
            ))}
          </div>
        )}

        {/* Dynamic Ambient Light Layer */}
        <div 
          className="absolute inset-0 pointer-events-none transition-colors duration-1000"
          style={{
            background: `radial-gradient(ellipse at center, ${globalPosture.lightHue}08 0%, transparent 70%)`,
            mixBlendMode: 'screen',
            opacity: 0.4
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
            willChange: 'transform'
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

              {/* Nucleus gradient */}
              <radialGradient id="nucleus-gradient">
                <stop offset="0%" stopColor={globalPosture.color} stopOpacity="0.15" />
                <stop offset="100%" stopColor={globalPosture.color} stopOpacity="0.02" />
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

            {/* Center Nucleus with Ripple */}
            <g>
              {/* Ripple wave */}
              {ripple.opacity > 0 && (
                <motion.circle
                  cx={dimensions.width / 2}
                  cy={dimensions.height / 2}
                  r={50 * ripple.scale}
                  fill="none"
                  stroke={globalPosture.color}
                  strokeWidth="2"
                  opacity={ripple.opacity}
                  style={{
                    filter: 'blur(2px)'
                  }}
                />
              )}

              {/* Outer glow */}
              <motion.circle
                cx={dimensions.width / 2}
                cy={dimensions.height / 2}
                r="50"
                fill="url(#nucleus-gradient)"
                animate={shouldReduceMotion ? {} : {
                  r: [50, 51, 50]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                style={{
                  filter: 'blur(12px)'
                }}
              />

              {/* Core nucleus */}
              <motion.circle
                cx={dimensions.width / 2}
                cy={dimensions.height / 2}
                r="20"
                fill={globalPosture.color}
                className="cursor-pointer"
                animate={shouldReduceMotion ? {} : {
                  scale: [1, 1.02, 1]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                onMouseEnter={() => setIsHoveringCenter(true)}
                onMouseLeave={() => setIsHoveringCenter(false)}
                style={{
                  filter: `drop-shadow(0 0 22px ${globalPosture.color}80)`,
                  pointerEvents: 'all',
                  transformOrigin: `${dimensions.width / 2}px ${dimensions.height / 2}px`,
                  opacity: 0.7
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

                  {/* Node core */}
                  <motion.circle
                    cx={pos.x}
                    cy={pos.y + drift}
                    r={domain.nodeSize}
                    fill={domain.color}
                    opacity={domain.opacity}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredDomain(domain.id)}
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

          {/* Always-Visible Captions */}
          {macroDomains.map((domain, index) => {
            const pos = getGridPosition(domain);
            const drift = getLivingDrift(index);
            const isHovered = hoveredDomain === domain.id;
            
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
                  textShadow: `0 0 8px ${domain.color}20`,
                  whiteSpace: 'nowrap'
                }}
                animate={{
                  opacity: isHovered ? 1 : 0.8
                }}
                transition={{ duration: 0.2 }}
              >
                {domain.name} – {domain.bias}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Center Hover Tooltip */}
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
                  border: `1px solid ${globalPosture.color}40`,
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
                    style={{ color: globalPosture.color }}
                  >
                    {globalPosture.label}
                  </span>
                  <span 
                    className="text-xs block"
                    style={{ color: 'rgba(255, 255, 255, 0.65)' }}
                  >
                    Dominant Driver: {globalPosture.dominantDriver}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Domain Hover Glass Card */}
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
                    
                    {/* Correlation ripple indicator */}
                    <motion.div 
                      className="mt-2 pt-2 border-t"
                      style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}
                    >
                      <div className="flex items-center gap-2">
                        <motion.div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: domain.color }}
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