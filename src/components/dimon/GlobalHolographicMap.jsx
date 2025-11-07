import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, X, TrendingUp, TrendingDown, Minus, ArrowRight } from 'lucide-react';
import LyraLogo from '../core/LyraLogo';

// ============================================================================
// MACRO EQUILIBRIUM GRID V2.0 - OS HORIZON FINAL (macOS Tahoe)
// Instant comprehension (<5s) with calm, coherent breathing motion
// ============================================================================

// OS Horizon Theming Tokens (macOS Tahoe inspired)
const HORIZON = {
  colors: {
    bg: "#0D1015",
    glass: "rgba(17, 23, 30, 0.85)",
    border: "rgba(255,255,255,0.06)",
    textPrimary: "rgba(255,255,255,0.92)",
    textSecondary: "rgba(255,255,255,0.72)",
    textTertiary: "rgba(255,255,255,0.60)",
    rates: "#7E77FF",
    fx: "#6ECBE0",
    growth: "#7AD8B3",
    geo: "#D8AE6C"
  },
  radii: { glass: 16, chip: 12 },
  blur: { glass: 12, canvas: 28 }
};

// Mock macro domain data
const MOCK_DOMAINS = [
  {
    id: "rates",
    posture: "hawkish",
    confidence_pct: 78,
    strength: 0.82,
    summary: "Fed holding firm; terminal rate expectations drift higher on sticky services inflation.",
    ripple: [
      "Credit spreads widen",
      "Tech multiples compress",
      "EM funding costs rise"
    ],
    last_updated_iso: new Date().toISOString(),
    sparkline: [0.72, 0.74, 0.76, 0.75, 0.78, 0.80, 0.79, 0.81, 0.82]
  },
  {
    id: "fx",
    posture: "stable",
    confidence_pct: 65,
    strength: 0.58,
    summary: "Dollar range-bound as yield differentials narrow; carry trades unwind slowly.",
    ripple: [
      "EM currencies stabilize",
      "Energy imports neutral"
    ],
    last_updated_iso: new Date().toISOString(),
    sparkline: [0.60, 0.59, 0.58, 0.57, 0.58, 0.59, 0.58, 0.57, 0.58]
  },
  {
    id: "growth",
    posture: "softening",
    confidence_pct: 71,
    strength: 0.68,
    summary: "China slowdown weighs on global demand; US consumer resilient but moderating.",
    ripple: [
      "Commodity prices soften",
      "Defensive rotation begins",
      "Services hold up"
    ],
    last_updated_iso: new Date().toISOString(),
    sparkline: [0.75, 0.74, 0.72, 0.70, 0.69, 0.68, 0.67, 0.68, 0.68]
  },
  {
    id: "geopolitics",
    posture: "tightening",
    confidence_pct: 58,
    strength: 0.72,
    summary: "Energy security concerns persist; trade fragmentation continues to reshape supply chains.",
    ripple: [
      "Energy premium elevated",
      "Onshoring accelerates"
    ],
    last_updated_iso: new Date().toISOString(),
    sparkline: [0.65, 0.66, 0.68, 0.70, 0.71, 0.72, 0.71, 0.72, 0.72]
  }
];

const MacroEquilibriumGrid = ({ onOpenSignalDrawer }) => {
  const containerRef = useRef(null);
  const [hoveredDomain, setHoveredDomain] = useState(null);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 480 });
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const [time, setTime] = useState(0);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const domains = MOCK_DOMAINS;

  // Calculate dominant driver
  const dominantDriver = useMemo(() => {
    const maxStrength = Math.max(...domains.map(d => d.strength));
    const dominant = domains.find(d => d.strength === maxStrength);
    
    if (maxStrength < 0.65) return "balanced";
    
    const sortedByStrength = [...domains].sort((a, b) => b.strength - a.strength);
    if (sortedByStrength[0].strength - sortedByStrength[1].strength < 0.1) {
      return "balanced";
    }
    
    return dominant.id;
  }, [domains]);

  // Generate global summary
  const globalSummary = useMemo(() => {
    const ratesDomain = domains.find(d => d.id === "rates");
    const fxDomain = domains.find(d => d.id === "fx");
    const growthDomain = domains.find(d => d.id === "growth");
    const geoDomain = domains.find(d => d.id === "geopolitics");
    
    return `Rates leaning ${ratesDomain.posture}; FX ${fxDomain.posture}; Growth ${growthDomain.posture}; Geopolitics ${geoDomain.posture}.`;
  }, [domains]);

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
        setDimensions({ width: rect.width, height: 480 });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Animation loop for breathing motion
  useEffect(() => {
    if (shouldReduceMotion) return;

    let animationFrameId;
    const startTime = performance.now();

    const animate = () => {
      const elapsed = (performance.now() - startTime) / 1000;
      setTime(elapsed);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [shouldReduceMotion]);

  // Track cursor position
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setCursorPosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    if (containerRef.current) {
      containerRef.current.addEventListener('mousemove', handleMouseMove);
      return () => containerRef.current?.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  // Get diamond position for each domain
  const getDomainPosition = useCallback((domainId, index) => {
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2 - 20;
    const radius = 140;

    const positions = {
      rates: { x: centerX, y: centerY - radius }, // Top
      fx: { x: centerX + radius, y: centerY }, // Right
      growth: { x: centerX, y: centerY + radius }, // Bottom
      geopolitics: { x: centerX - radius, y: centerY } // Left
    };

    return positions[domainId] || { x: centerX, y: centerY };
  }, [dimensions]);

  // Breathing animation (shared harmonic rhythm)
  const getBreathingOffset = useCallback((index) => {
    if (shouldReduceMotion) return { y: 0, scale: 1 };
    
    const phase = (time / 1000) + (index * Math.PI * 0.25);
    const y = Math.sin(phase) * 6; // 6px max drift
    const scale = 1 + Math.sin(phase + 0.6) * 0.03; // ±3% scale
    
    return { y, scale };
  }, [time, shouldReduceMotion]);

  // Get domain color
  const getDomainColor = (domainId) => {
    const colorMap = {
      rates: HORIZON.colors.rates,
      fx: HORIZON.colors.fx,
      growth: HORIZON.colors.growth,
      geopolitics: HORIZON.colors.geo
    };
    return colorMap[domainId] || HORIZON.colors.rates;
  };

  // Get domain icon
  const getDomainIcon = (domainId) => {
    const iconMap = {
      rates: "📊",
      fx: "💱",
      growth: "📈",
      geopolitics: "🌍"
    };
    return iconMap[domainId] || "•";
  };

  // Get posture icon
  const getPostureIcon = (posture) => {
    if (["hawkish", "tightening", "firming"].includes(posture)) return <TrendingUp className="w-4 h-4" />;
    if (["dovish", "loosening", "softening"].includes(posture)) return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

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
              className="font-bold"
              style={{
                fontSize: '16px',
                lineHeight: '22px',
                letterSpacing: '0.01em',
                color: HORIZON.colors.textPrimary
              }}
            >
              Macro Equilibrium Grid
            </h2>
            <p 
              style={{
                fontSize: '13px',
                color: HORIZON.colors.textTertiary
              }}
            >
              Global macro balance at a glance.
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
              border: `1px solid ${HORIZON.colors.border}`,
              borderRadius: '10px'
            }}
            whileHover={{
              background: 'rgba(255, 255, 255, 0.08)',
              borderColor: 'rgba(129, 140, 248, 0.3)',
              boxShadow: '0 8px 32px rgba(129, 140, 248, 0.2)',
            }}
            transition={{ duration: 0.3 }}
          >
            <span 
              className="text-xs font-medium transition-colors duration-300"
              style={{ color: HORIZON.colors.textTertiary }}
            >
              Powered by
            </span>
            
            <motion.div
              whileHover={{ scale: 1.1, rotate: [0, -2, 2, 0] }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <LyraLogo className="w-5 h-5" />
            </motion.div>
            
            <span 
              className="text-sm font-bold"
              style={{ color: HORIZON.colors.textPrimary }}
            >
              Lyra
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* Glass Canvas */}
      <motion.div 
        ref={containerRef}
        className="relative w-full rounded-3xl overflow-visible"
        style={{
          height: '480px',
          background: 'radial-gradient(ellipse at center, rgba(10, 12, 18, 0.96) 0%, rgba(6, 8, 12, 0.98) 100%)',
          border: `1px solid ${HORIZON.colors.border}`,
          backdropFilter: `blur(${HORIZON.blur.canvas}px)`,
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.04), 0 12px 40px rgba(0,0,0,0.3)',
        }}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Ambient particles (reduced motion aware) */}
        {!shouldReduceMotion && (
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                className="absolute rounded-full"
                style={{
                  width: 2,
                  height: 2,
                  background: 'rgba(255, 255, 255, 0.12)',
                  filter: 'blur(0.5px)',
                  left: `${20 + (i * 10)}%`,
                  top: `${30 + (i % 3) * 20}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.12, 0.25, 0.12]
                }}
                transition={{
                  duration: 6 + i * 0.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.3
                }}
              />
            ))}
          </div>
        )}

        <svg 
          width={dimensions.width} 
          height={dimensions.height}
          className="absolute inset-0"
          style={{ overflow: 'visible' }}
        >
          <defs>
            {/* Glow filters for each domain */}
            {domains.map((domain) => (
              <filter key={`glow-${domain.id}`} id={`glow-${domain.id}`} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feFlood floodColor={getDomainColor(domain.id)} floodOpacity="0.5" />
                <feComposite in2="blur" operator="in" result="glow" />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            ))}

            {/* Halo line gradients */}
            {domains.map((domain) => (
              <linearGradient key={`halo-${domain.id}`} id={`halo-${domain.id}`}>
                <stop offset="0%" stopColor={getDomainColor(domain.id)} stopOpacity="0.3" />
                <stop offset="100%" stopColor={getDomainColor(domain.id)} stopOpacity="0.65" />
              </linearGradient>
            ))}
          </defs>

          {/* Dynamic Balance Halo - lines from nucleus to each orb */}
          {domains.map((domain, index) => {
            const pos = getDomainPosition(domain.id, index);
            const centerX = dimensions.width / 2;
            const centerY = dimensions.height / 2 - 20;
            const breathing = getBreathingOffset(index);
            
            const strokeWidth = 2 + (domain.strength * 4);
            
            return (
              <motion.line
                key={`halo-${domain.id}`}
                x1={centerX}
                y1={centerY}
                x2={pos.x}
                y2={pos.y + breathing.y}
                stroke={`url(#halo-${domain.id})`}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                initial={{ opacity: 0, pathLength: 0 }}
                animate={{ 
                  opacity: hoveredDomain === domain.id ? 0.8 : 0.65,
                  pathLength: 1
                }}
                transition={{ 
                  opacity: { duration: 0.3 },
                  pathLength: { duration: 1.2, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }
                }}
                style={{
                  filter: `drop-shadow(0 0 ${4 + domain.strength * 4}px ${getDomainColor(domain.id)}40)`
                }}
              />
            );
          })}

          {/* Center Nucleus */}
          <motion.circle
            cx={dimensions.width / 2}
            cy={dimensions.height / 2 - 20}
            r="12"
            fill="rgba(255, 255, 255, 0.15)"
            animate={shouldReduceMotion ? {} : {
              scale: [1, 1.08, 1],
              opacity: [0.15, 0.25, 0.15]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            style={{
              filter: 'drop-shadow(0 0 12px rgba(255, 255, 255, 0.3))'
            }}
          />

          {/* Domain Orbs */}
          {domains.map((domain, index) => {
            const pos = getDomainPosition(domain.id, index);
            const breathing = getBreathingOffset(index);
            const color = getDomainColor(domain.id);
            const isHovered = hoveredDomain === domain.id;
            const baseSize = 72;
            const size = baseSize * (0.9 + domain.strength * 0.2);
            const radius = size / 2;

            return (
              <g key={domain.id}>
                {/* Outer glow */}
                <motion.circle
                  cx={pos.x}
                  cy={pos.y + breathing.y}
                  r={radius + 10}
                  fill={color}
                  opacity={0.2}
                  filter={`url(#glow-${domain.id})`}
                  animate={{
                    opacity: isHovered ? 0.35 : 0.2
                  }}
                  transition={{ duration: 0.3 }}
                />

                {/* Main orb */}
                <motion.circle
                  cx={pos.x}
                  cy={pos.y + breathing.y}
                  r={radius}
                  fill={color}
                  opacity={0.75}
                  className="cursor-pointer"
                  style={{
                    filter: `drop-shadow(0 10px 30px rgba(0,0,0,0.45))`,
                    transformOrigin: `${pos.x}px ${pos.y}px`,
                    pointerEvents: 'all'
                  }}
                  animate={{
                    scale: breathing.scale * (isHovered ? 1.08 : 1),
                    opacity: isHovered ? 0.85 : 0.75
                  }}
                  transition={{ duration: 0.3 }}
                  onMouseEnter={() => setHoveredDomain(domain.id)}
                  onMouseLeave={() => setHoveredDomain(null)}
                  onClick={() => setSelectedDomain(domain)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') setSelectedDomain(domain);
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`${domain.id} domain: ${domain.posture}, ${domain.confidence_pct}% confidence`}
                  aria-describedby={`tooltip-${domain.id}`}
                />

                {/* Inner core */}
                <circle
                  cx={pos.x}
                  cy={pos.y + breathing.y}
                  r={radius * 0.65}
                  fill={color}
                  opacity={0.95}
                  style={{ pointerEvents: 'none' }}
                />

                {/* Highlight */}
                <ellipse
                  cx={pos.x - radius * 0.3}
                  cy={pos.y + breathing.y - radius * 0.3}
                  rx={radius * 0.25}
                  ry={radius * 0.3}
                  fill="rgba(255, 255, 255, 0.4)"
                  style={{
                    filter: 'blur(3px)',
                    pointerEvents: 'none'
                  }}
                />
              </g>
            );
          })}
        </svg>

        {/* Domain Labels (always visible) */}
        {domains.map((domain, index) => {
          const pos = getDomainPosition(domain.id, index);
          const breathing = getBreathingOffset(index);
          const color = getDomainColor(domain.id);
          
          return (
            <motion.div
              key={`label-${domain.id}`}
              className="absolute pointer-events-none text-center"
              style={{
                left: pos.x,
                top: pos.y + breathing.y + 50,
                transform: 'translateX(-50%)',
                fontFamily: 'SF Pro Text, -apple-system, system-ui, sans-serif',
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '0.01em',
                color: color,
                textShadow: `0 0 12px ${color}40`,
              }}
            >
              {domain.id.toUpperCase()}
            </motion.div>
          );
        })}

        {/* Hover Card */}
        <AnimatePresence>
          {hoveredDomain && (
            <motion.div
              id={`tooltip-${hoveredDomain}`}
              className="absolute pointer-events-none z-50"
              style={{
                left: cursorPosition.x + 20,
                top: cursorPosition.y - 40,
              }}
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.22, 0.61, 0.36, 1] }}
            >
              {(() => {
                const domain = domains.find(d => d.id === hoveredDomain);
                if (!domain) return null;
                
                return (
                  <div
                    style={{
                      background: HORIZON.colors.glass,
                      border: `1px solid ${HORIZON.colors.border}`,
                      borderRadius: `${HORIZON.radii.glass}px`,
                      backdropFilter: `blur(${HORIZON.blur.glass}px)`,
                      WebkitBackdropFilter: `blur(${HORIZON.blur.glass}px)`,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
                      padding: '16px',
                      minWidth: '280px',
                      maxWidth: '320px'
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div 
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ 
                          background: getDomainColor(domain.id),
                          boxShadow: `0 0 8px ${getDomainColor(domain.id)}80`
                        }}
                      />
                      <span 
                        className="font-semibold capitalize"
                        style={{ 
                          color: HORIZON.colors.textPrimary,
                          fontSize: '14px'
                        }}
                      >
                        {domain.id}
                      </span>
                      <span 
                        className="ml-auto text-xs font-bold"
                        style={{ color: getDomainColor(domain.id) }}
                      >
                        {domain.confidence_pct}%
                      </span>
                    </div>
                    
                    <p 
                      style={{
                        color: HORIZON.colors.textSecondary,
                        fontSize: '13px',
                        lineHeight: '1.5',
                        marginBottom: '12px'
                      }}
                    >
                      {domain.summary.length > 85 ? domain.summary.substring(0, 82) + '...' : domain.summary}
                    </p>
                    
                    <div 
                      className="flex items-center gap-2 text-xs"
                      style={{ color: HORIZON.colors.textTertiary }}
                    >
                      <ArrowRight className="w-3 h-3" />
                      <span>Click for details</span>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Micro-Summary Bar (always visible) */}
        <motion.div
          className="absolute bottom-6 left-6 right-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          role="status"
          aria-live="polite"
        >
          <div
            style={{
              background: HORIZON.colors.glass,
              border: `1px solid ${HORIZON.colors.border}`,
              borderRadius: `${HORIZON.radii.chip}px`,
              backdropFilter: `blur(${HORIZON.blur.glass}px)`,
              WebkitBackdropFilter: `blur(${HORIZON.blur.glass}px)`,
              boxShadow: '0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)',
              padding: '12px 16px'
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <span 
                  className="font-semibold"
                  style={{ 
                    color: HORIZON.colors.textPrimary,
                    fontSize: '14.5px',
                    lineHeight: '20px'
                  }}
                >
                  Global Balance:
                </span>
                <span 
                  style={{ 
                    color: HORIZON.colors.textSecondary,
                    fontSize: '14.5px',
                    lineHeight: '20px'
                  }}
                >
                  {globalSummary}
                </span>
              </div>
              
              {dominantDriver !== "balanced" && (
                <>
                  <div 
                    className="hidden sm:block w-px h-4"
                    style={{ background: HORIZON.colors.border }}
                  />
                  <div className="flex items-center gap-2">
                    <span 
                      style={{ 
                        color: HORIZON.colors.textTertiary,
                        fontSize: '13px'
                      }}
                    >
                      Dominant:
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span style={{ fontSize: '14px' }}>
                        {getDomainIcon(dominantDriver)}
                      </span>
                      <span 
                        className="font-semibold capitalize"
                        style={{ 
                          color: getDomainColor(dominantDriver),
                          fontSize: '13px'
                        }}
                      >
                        {dominantDriver}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Detailed Drawer (right slide-in) */}
      <AnimatePresence>
        {selectedDomain && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDomain(null)}
            />

            {/* Drawer Panel */}
            <motion.div
              className="fixed top-0 right-0 h-full z-50 overflow-y-auto"
              style={{
                width: '520px',
                maxWidth: '90vw',
                background: HORIZON.colors.glass,
                backdropFilter: `blur(${HORIZON.blur.canvas}px)`,
                WebkitBackdropFilter: `blur(${HORIZON.blur.canvas}px)`,
                borderLeft: `1px solid ${HORIZON.colors.border}`,
                boxShadow: '-8px 0 32px rgba(0,0,0,0.5)'
              }}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.42, ease: [0.22, 0.61, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Header */}
              <div 
                className="sticky top-0 z-10 p-6 border-b"
                style={{
                  background: HORIZON.colors.glass,
                  borderColor: HORIZON.colors.border,
                  backdropFilter: `blur(${HORIZON.blur.glass}px)`
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{
                        background: `${getDomainColor(selectedDomain.id)}20`,
                        border: `1px solid ${getDomainColor(selectedDomain.id)}40`
                      }}
                    >
                      <span style={{ fontSize: '20px' }}>
                        {getDomainIcon(selectedDomain.id)}
                      </span>
                    </div>
                    <div>
                      <h3 
                        className="font-bold capitalize"
                        style={{ 
                          color: HORIZON.colors.textPrimary,
                          fontSize: '20px'
                        }}
                      >
                        {selectedDomain.id}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        {getPostureIcon(selectedDomain.posture)}
                        <span 
                          className="font-semibold capitalize"
                          style={{ 
                            color: getDomainColor(selectedDomain.id),
                            fontSize: '14px'
                          }}
                        >
                          {selectedDomain.posture}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedDomain(null)}
                    className="p-2 rounded-lg transition-colors hover:bg-white/10"
                    style={{ color: HORIZON.colors.textTertiary }}
                    aria-label="Close drawer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Confidence Ring */}
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16">
                    <svg className="transform -rotate-90" width="64" height="64">
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        fill="none"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="4"
                      />
                      <motion.circle
                        cx="32"
                        cy="32"
                        r="28"
                        fill="none"
                        stroke={getDomainColor(selectedDomain.id)}
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray="176"
                        initial={{ strokeDashoffset: 176 }}
                        animate={{ 
                          strokeDashoffset: 176 - (176 * selectedDomain.confidence_pct / 100) 
                        }}
                        transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </svg>
                    <div 
                      className="absolute inset-0 flex items-center justify-center font-bold"
                      style={{ 
                        color: HORIZON.colors.textPrimary,
                        fontSize: '16px'
                      }}
                    >
                      {selectedDomain.confidence_pct}%
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div 
                      className="text-xs font-medium mb-1"
                      style={{ color: HORIZON.colors.textTertiary }}
                    >
                      CONFIDENCE LEVEL
                    </div>
                    <div 
                      className="text-sm"
                      style={{ color: HORIZON.colors.textSecondary }}
                    >
                      Signal strength: {Math.round(selectedDomain.strength * 100)}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Drawer Content */}
              <div className="p-6 space-y-6">
                {/* Translation (plain language) */}
                <div>
                  <h4 
                    className="text-xs font-bold uppercase tracking-wide mb-3"
                    style={{ color: HORIZON.colors.textTertiary }}
                  >
                    What This Means
                  </h4>
                  <p 
                    style={{
                      color: HORIZON.colors.textPrimary,
                      fontSize: '15px',
                      lineHeight: '1.6'
                    }}
                  >
                    {selectedDomain.summary}
                  </p>
                </div>

                {/* Ripple Impact */}
                <div>
                  <h4 
                    className="text-xs font-bold uppercase tracking-wide mb-3"
                    style={{ color: HORIZON.colors.textTertiary }}
                  >
                    Downstream Effects
                  </h4>
                  <div className="space-y-2">
                    {selectedDomain.ripple.map((effect, i) => (
                      <motion.div
                        key={i}
                        className="flex items-start gap-2 p-3 rounded-lg"
                        style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: `1px solid ${HORIZON.colors.border}`
                        }}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                      >
                        <div 
                          className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                          style={{ background: getDomainColor(selectedDomain.id) }}
                        />
                        <span 
                          style={{ 
                            color: HORIZON.colors.textSecondary,
                            fontSize: '14px',
                            lineHeight: '1.5'
                          }}
                        >
                          {effect}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Historical Pulse (48h sparkline) */}
                <div>
                  <h4 
                    className="text-xs font-bold uppercase tracking-wide mb-3"
                    style={{ color: HORIZON.colors.textTertiary }}
                  >
                    48-Hour Trend
                  </h4>
                  <div 
                    className="p-4 rounded-lg"
                    style={{
                      background: 'rgba(0, 0, 0, 0.2)',
                      border: `1px solid ${HORIZON.colors.border}`
                    }}
                  >
                    <svg width="100%" height="60" className="overflow-visible">
                      <defs>
                        <linearGradient id={`sparkline-${selectedDomain.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={getDomainColor(selectedDomain.id)} stopOpacity="0.3" />
                          <stop offset="100%" stopColor={getDomainColor(selectedDomain.id)} stopOpacity="0.05" />
                        </linearGradient>
                      </defs>
                      
                      {(() => {
                        const data = selectedDomain.sparkline;
                        const width = containerRef.current?.offsetWidth - 88 || 400;
                        const height = 60;
                        const padding = 4;
                        
                        const minValue = Math.min(...data);
                        const maxValue = Math.max(...data);
                        const range = maxValue - minValue || 0.1;
                        
                        const points = data.map((value, i) => {
                          const x = (i / (data.length - 1)) * width;
                          const y = height - padding - ((value - minValue) / range) * (height - padding * 2);
                          return `${x},${y}`;
                        }).join(' ');
                        
                        const pathD = `M ${points}`;
                        const areaD = `M ${points} L ${width},${height} L 0,${height} Z`;
                        
                        return (
                          <>
                            <motion.path
                              d={areaD}
                              fill={`url(#sparkline-${selectedDomain.id})`}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.6, delay: 0.5 }}
                            />
                            <motion.path
                              d={pathD}
                              fill="none"
                              stroke={getDomainColor(selectedDomain.id)}
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            />
                          </>
                        );
                      })()}
                    </svg>
                  </div>
                </div>

                {/* Last Updated */}
                <div 
                  className="text-xs"
                  style={{ color: HORIZON.colors.textTertiary }}
                >
                  Updated {new Date(selectedDomain.last_updated_iso).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Performance CSS */}
      <style jsx>{`
        svg, .absolute {
          transform: translateZ(0);
          will-change: transform, opacity;
          backface-visibility: hidden;
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        svg {
          shape-rendering: geometricPrecision;
        }

        /* Focus ring styling */
        circle:focus-visible {
          outline: none;
          filter: drop-shadow(0 0 0 2px ${HORIZON.colors.textPrimary}) 
                  drop-shadow(0 0 8px currentColor) !important;
        }
      `}</style>
    </motion.section>
  );
};

export default MacroEquilibriumGrid;