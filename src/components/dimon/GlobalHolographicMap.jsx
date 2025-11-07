import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe } from 'lucide-react';
import LyraLogo from '../core/LyraLogo';

// ============================================================================
// MACRO EQUILIBRIUM GRID - OS HORIZON V1.5
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

  // Horizon easing
  const HORIZON_EASE = [0.45, 0, 0.1, 1];

  // Macro domains with fixed grid positions
  const macroDomains = useMemo(() => {
    const baseStrength = [78, 65, 71, 58]; // Rates, FX, Growth, Geo
    const baseVolatility = [0.8, 0.6, 0.9, 0.7];
    
    return [
      {
        id: 'rates',
        name: 'Rates',
        color: '#8C83F2',
        opacity: 0.50,
        gridPosition: 'top-left', // Top-Left quadrant
        strength: baseStrength[0],
        volatility: baseVolatility[0],
        trend: 'Hawkish tilt continues, spread stress rising',
        nodeSize: 16 + (baseStrength[0] / 100) * 32, // Size based on strength: 16-48px
        confidence: Math.round((baseStrength[0] + baseVolatility[0] * 20) / 2)
      },
      {
        id: 'fx',
        name: 'FX',
        color: '#7FD0F2',
        opacity: 0.50,
        gridPosition: 'top-right', // Top-Right quadrant
        strength: baseStrength[1],
        volatility: baseVolatility[1],
        trend: 'USD strength persists on rate differentials',
        nodeSize: 16 + (baseStrength[1] / 100) * 32,
        confidence: Math.round((baseStrength[1] + baseVolatility[1] * 20) / 2)
      },
      {
        id: 'growth',
        name: 'Growth',
        color: '#9DE2C1',
        opacity: 0.50,
        gridPosition: 'bottom-left', // Bottom-Left quadrant
        strength: baseStrength[2],
        volatility: baseVolatility[2],
        trend: 'China slowdown weighing on global outlook',
        nodeSize: 16 + (baseStrength[2] / 100) * 32,
        confidence: Math.round((baseStrength[2] + baseVolatility[2] * 20) / 2)
      },
      {
        id: 'geopolitics',
        name: 'Geopolitics',
        color: '#E4C088',
        opacity: 0.50,
        gridPosition: 'bottom-right', // Bottom-Right quadrant
        strength: baseStrength[3],
        volatility: baseVolatility[3],
        trend: 'Energy security concerns elevate risk premium',
        nodeSize: 16 + (baseStrength[3] / 100) * 32,
        confidence: Math.round((baseStrength[3] + baseVolatility[3] * 20) / 2)
      }
    ];
  }, []);

  // Calculate global posture
  const getGlobalPosture = useCallback(() => {
    const avgStrength = macroDomains.reduce((sum, d) => sum + d.strength, 0) / macroDomains.length;
    const riskOffWeight = (macroDomains[0].strength + macroDomains[3].strength) / 2;
    const riskOnWeight = (macroDomains[1].strength + macroDomains[2].strength) / 2;
    
    // Find dominant driver
    const maxStrength = Math.max(...macroDomains.map(d => d.strength));
    const dominantDomain = macroDomains.find(d => d.strength === maxStrength);
    
    if (riskOffWeight > riskOnWeight + 10) {
      return { 
        label: 'Lean Risk-Off', 
        color: '#E4C088', 
        confidence: Math.round(avgStrength),
        dominantDriver: dominantDomain.name
      };
    } else if (riskOnWeight > riskOffWeight + 10) {
      return { 
        label: 'Lean Risk-On', 
        color: '#6FE4D0', 
        confidence: Math.round(avgStrength),
        dominantDriver: dominantDomain.name
      };
    } else {
      return { 
        label: 'Neutral', 
        color: '#D0D3DB', 
        confidence: Math.round(avgStrength),
        dominantDriver: 'Balanced'
      };
    }
  }, [macroDomains]);

  const globalPosture = getGlobalPosture();

  // Check correlations (show lines when > 0.7)
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

  // Reset parallax with 400ms decay
  useEffect(() => {
    if (!isInteracting) {
      const timer = setTimeout(() => {
        setParallaxOffset({ x: 0, y: 0 });
      }, 30);
      return () => clearTimeout(timer);
    }
  }, [isInteracting]);

  // Calculate fixed grid position for each domain
  const getGridPosition = useCallback((domain) => {
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const offset = 100; // Distance from center
    
    const positions = {
      'top-left': { x: centerX - offset, y: centerY - offset },
      'top-right': { x: centerX + offset, y: centerY - offset },
      'bottom-left': { x: centerX - offset, y: centerY + offset },
      'bottom-right': { x: centerX + offset, y: centerY + offset }
    };
    
    return positions[domain.gridPosition] || { x: centerX, y: centerY };
  }, [dimensions]);

  return (
    <motion.section
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      aria-label="Visual equilibrium map of global macro domains"
    >
      {/* Header with Powered by Lyra */}
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
              Fixed visual balance of global macro forces.
            </p>
          </div>
        </div>
        
        {/* Powered by Lyra - Frosted Glass Chip */}
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

      {/* Grid Container with Global Breathing */}
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
        {/* Inner Glow Layer */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            backdropFilter: 'blur(22px)',
            WebkitBackdropFilter: 'blur(22px)',
            mixBlendMode: 'overlay',
            borderRadius: '24px'
          }}
          aria-hidden="true"
        />

        {/* Grid System with Parallax */}
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
              {/* Glow filters for nodes */}
              {macroDomains.map((domain) => (
                <filter key={`glow-${domain.id}`} id={`node-glow-${domain.id}`} x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="14" result="blur" />
                  <feFlood floodColor={domain.color} floodOpacity="0.5" />
                  <feComposite in2="blur" operator="in" result="glow" />
                  <feMerge>
                    <feMergeNode in="glow" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              ))}

              {/* Nucleus gradient */}
              <radialGradient id="nucleus-gradient">
                <stop offset="0%" stopColor={globalPosture.color} stopOpacity="0.12" />
                <stop offset="100%" stopColor={globalPosture.color} stopOpacity="0.02" />
              </radialGradient>

              {/* Connection line gradients */}
              {correlations.map((corr, i) => {
                const fromDomain = macroDomains.find(d => d.id === corr.from);
                const toDomain = macroDomains.find(d => d.id === corr.to);
                return (
                  <linearGradient key={`corr-${i}`} id={`corr-gradient-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={fromDomain.color} stopOpacity="0.35" />
                    <stop offset="100%" stopColor={toDomain.color} stopOpacity="0.35" />
                  </linearGradient>
                );
              })}
            </defs>

            {/* Connection Lines (only when correlation > 0.7) */}
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
                  y1={fromPos.y}
                  x2={toPos.x}
                  y2={toPos.y}
                  stroke={`url(#corr-gradient-${i})`}
                  strokeWidth="2"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: isHighlighted ? 0.55 : 0.35
                  }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                />
              );
            })}

            {/* Center Nucleus */}
            <g>
              {/* Outer glow with breathing */}
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
                  opacity: 0.6
                }}
              />

              {/* Subtle highlight */}
              <ellipse
                cx={dimensions.width / 2 - 5}
                cy={dimensions.height / 2 - 5}
                rx="5"
                ry="6"
                fill="rgba(255, 255, 255, 0.4)"
                style={{
                  filter: 'blur(2px)'
                }}
              />
            </g>

            {/* Grid Nodes (Fixed Positions) */}
            {macroDomains.map((domain, index) => {
              const pos = getGridPosition(domain);
              const isHovered = hoveredDomain === domain.id;
              
              return (
                <g key={domain.id}>
                  {/* Node glow */}
                  <motion.circle
                    cx={pos.x}
                    cy={pos.y}
                    r={domain.nodeSize + 8}
                    fill={domain.color}
                    opacity={domain.opacity * 0.3}
                    filter={`url(#node-glow-${domain.id})`}
                    animate={shouldReduceMotion ? {} : {
                      scale: isHovered ? 1.08 : [1, 1.03, 1],
                      opacity: isHovered ? domain.opacity * 0.5 : [domain.opacity * 0.3, domain.opacity * 0.35, domain.opacity * 0.3]
                    }}
                    transition={shouldReduceMotion ? { duration: 0 } : {
                      scale: isHovered ? { duration: 0.25 } : { duration: 6, repeat: Infinity, ease: 'easeInOut' },
                      opacity: { duration: isHovered ? 0.25 : 6, repeat: isHovered ? 0 : Infinity }
                    }}
                    style={{
                      transformOrigin: `${pos.x}px ${pos.y}px`
                    }}
                  />

                  {/* Node core */}
                  <motion.circle
                    cx={pos.x}
                    cy={pos.y}
                    r={domain.nodeSize}
                    fill={domain.color}
                    opacity={domain.opacity}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredDomain(domain.id)}
                    onMouseLeave={() => setHoveredDomain(null)}
                    animate={shouldReduceMotion ? {} : {
                      scale: isHovered ? 1.08 : [1, 1.03, 1],
                      opacity: isHovered ? domain.opacity + 0.1 : domain.opacity
                    }}
                    transition={shouldReduceMotion ? { duration: 0 } : {
                      scale: isHovered ? { duration: 0.25, ease: HORIZON_EASE } : { duration: 6, repeat: Infinity, ease: 'easeInOut' },
                      opacity: { duration: 0.25 }
                    }}
                    style={{
                      pointerEvents: 'all',
                      transformOrigin: `${pos.x}px ${pos.y}px`,
                      filter: `drop-shadow(0 0 22px ${domain.color}40)`
                    }}
                  />

                  {/* Node highlight */}
                  <ellipse
                    cx={pos.x - 3}
                    cy={pos.y - 3}
                    rx="3"
                    ry="4"
                    fill="rgba(255, 255, 255, 0.5)"
                    style={{
                      filter: 'blur(1px)'
                    }}
                  />
                </g>
              );
            })}
          </svg>
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
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.14, ease: HORIZON_EASE }}
            >
              <div
                className="px-4 py-2.5 rounded-xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(18px)',
                  WebkitBackdropFilter: 'blur(18px)',
                  border: `1px solid ${globalPosture.color}40`,
                  boxShadow: `0 6px 16px rgba(0,0,0,0.25)`,
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

        {/* Domain Hover Tooltip */}
        <AnimatePresence>
          {hoveredDomain && (
            <motion.div
              className="absolute pointer-events-none z-[200]"
              style={{
                left: cursorPosition.x + 16,
                top: cursorPosition.y - 40,
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.14, ease: HORIZON_EASE }}
            >
              {(() => {
                const domain = macroDomains.find(d => d.id === hoveredDomain);
                if (!domain) return null;
                
                return (
                  <div
                    className="px-3 py-2 rounded-xl"
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      backdropFilter: 'blur(18px)',
                      WebkitBackdropFilter: 'blur(18px)',
                      border: `1px solid ${domain.color}40`,
                      boxShadow: `0 6px 16px rgba(0,0,0,0.25)`,
                      borderRadius: '14px'
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div 
                        className="w-2 h-2 rounded-full"
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
                      className="text-xs mb-1"
                      style={{ 
                        color: 'rgba(255, 255, 255, 0.75)',
                        lineHeight: '1.4',
                        maxWidth: '240px',
                        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                        fontSize: '13.5px'
                      }}
                    >
                      {domain.trend}
                    </p>
                    <div className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.65)' }}>
                      Confidence: {domain.confidence}%
                    </div>
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