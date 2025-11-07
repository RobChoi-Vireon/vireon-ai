import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, X, TrendingUp, TrendingDown, Minus, ArrowRight } from 'lucide-react';
import LyraLogo from '../core/LyraLogo';

// ============================================================================
// MACRO EQUILIBRIUM GRID V2.0 - HORIZON EVOLUTION (Liquid Silk + Tahoe Glass)
// Alive, continuous motion with spatial continuity (hover → drawer morph)
// ============================================================================

// Horizon OS Global Tokens
const TOKENS = {
  HORIZON: {
    glassBg: 'rgba(10,12,20,0.55)',
    glassBorder: 'rgba(255,255,255,0.06)',
    glassInner: 'rgba(255,255,255,0.03)',
    haloWeak: 'rgba(255,255,255,0.15)',
    panelShadow: '0 0 60px rgba(255,255,255,0.04)',
    blurPanel: 'blur(30px)',
    blurChip: 'blur(20px)',
    easing: 'cubic-bezier(0.32,0.72,0,1)',
    t_hover: '250ms',
    t_tooltip: '350ms',
    t_drawer: '600ms',
    t_pulse: '3000ms',
    bgCenter: 'rgba(10,12,20,0.85)',
    bgEdge: 'rgba(10,12,20,0.55)'
  },
  colors: {
    rates: "#7E77FF",
    fx: "#6ECBE0",
    growth: "#7AD8B3",
    geo: "#D8AE6C",
    textPrimary: "rgba(255,255,255,0.92)",
    textSecondary: "rgba(255,255,255,0.72)",
    textTertiary: "rgba(255,255,255,0.60)"
  }
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
  const capsuleRef = useRef(null);
  const [hoveredDomain, setHoveredDomain] = useState(null);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 480 });
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const [capsuleBounds, setCapsuleBounds] = useState(null);
  const [isMorphing, setIsMorphing] = useState(false);

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

  // Get diamond position for each domain
  const getDomainPosition = useCallback((domainId) => {
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const radius = 140;

    const positions = {
      rates: { x: centerX, y: centerY - radius },
      fx: { x: centerX + radius, y: centerY },
      growth: { x: centerX, y: centerY + radius },
      geopolitics: { x: centerX - radius, y: centerY }
    };

    return positions[domainId] || { x: centerX, y: centerY };
  }, [dimensions]);

  const getDomainColor = (domainId) => {
    const colorMap = {
      rates: TOKENS.colors.rates,
      fx: TOKENS.colors.fx,
      growth: TOKENS.colors.growth,
      geopolitics: TOKENS.colors.geo
    };
    return colorMap[domainId] || TOKENS.colors.rates;
  };

  const getDomainIcon = (domainId) => {
    const iconMap = {
      rates: "📊",
      fx: "💱",
      growth: "📈",
      geopolitics: "🌍"
    };
    return iconMap[domainId] || "•";
  };

  const getPostureIcon = (posture) => {
    if (["hawkish", "tightening", "firming"].includes(posture)) return <TrendingUp className="w-4 h-4" />;
    if (["dovish", "loosening", "softening"].includes(posture)) return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  // Capture capsule position before opening drawer
  const handleOpenDrawer = useCallback((domain, event) => {
    if (capsuleRef.current) {
      const bounds = capsuleRef.current.getBoundingClientRect();
      setCapsuleBounds(bounds);
    }
    setIsMorphing(true);
    setTimeout(() => {
      setSelectedDomain(domain);
      setIsMorphing(false);
    }, parseInt(TOKENS.HORIZON.t_drawer));
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setIsMorphing(true);
    setTimeout(() => {
      setSelectedDomain(null);
      setCapsuleBounds(null);
      setIsMorphing(false);
    }, parseInt(TOKENS.HORIZON.t_drawer));
  }, []);

  // Get connections between domains
  const connections = useMemo(() => [
    { from: "rates", to: "fx" },
    { from: "growth", to: "geopolitics" }
  ], []);

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
                color: TOKENS.colors.textPrimary
              }}
            >
              Macro Equilibrium Grid
            </h2>
            <p 
              style={{
                fontSize: '13px',
                color: TOKENS.colors.textTertiary
              }}
            >
              Living balance of global macro forces.
            </p>
          </div>
        </div>
        
        {/* Powered by Lyra - 60% opacity with soft glow */}
        <motion.div
          className="group cursor-pointer"
          style={{ opacity: 0.6 }}
          whileHover={{ opacity: 0.8 }}
          transition={{ duration: 0.3 }}
        >
          <div
            className="flex items-center space-x-2 px-4 py-2 rounded-xl"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              border: '1px solid rgba(255,255,255,0.06)',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.06) inset, 0 0 16px rgba(129, 140, 248, 0.15)',
              borderRadius: '12px'
            }}
          >
            <span 
              className="text-xs font-medium"
              style={{ color: TOKENS.colors.textTertiary }}
            >
              Powered by
            </span>
            <LyraLogo className="w-5 h-5" />
            <span 
              className="text-sm font-bold"
              style={{ color: TOKENS.colors.textPrimary }}
            >
              Lyra
            </span>
          </div>
        </motion.div>
      </div>

      {/* Grid Wrapper (Scene Canvas) */}
      <div 
        ref={containerRef}
        className="relative w-full rounded-3xl overflow-hidden"
        style={{
          height: '480px',
          background: `radial-gradient(800px circle at 45% 40%, ${TOKENS.HORIZON.bgCenter}, ${TOKENS.HORIZON.bgEdge})`,
          border: '1px solid rgba(255,255,255,0.04)',
          borderRadius: '24px'
        }}
      >
        <svg 
          width={dimensions.width} 
          height={dimensions.height}
          className="absolute inset-0"
          style={{ overflow: 'visible' }}
        >
          <defs>
            {/* Orb radial gradients (Liquid Silk nucleus) */}
            {domains.map((domain) => (
              <radialGradient key={`nucleus-${domain.id}`} id={`nucleus-${domain.id}`}>
                <stop offset="0%" stopColor={getDomainColor(domain.id)} stopOpacity="1" />
                <stop offset="70%" stopColor="rgba(255,255,255,0)" stopOpacity="0" />
              </radialGradient>
            ))}

            {/* Connection gradients */}
            {connections.map((conn, i) => (
              <linearGradient key={`conn-grad-${i}`} id={`conn-grad-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={getDomainColor(conn.from)} stopOpacity="0.65" />
                <stop offset="100%" stopColor={getDomainColor(conn.to)} stopOpacity="0.65" />
              </linearGradient>
            ))}
          </defs>

          {/* Energy Thread Connections with pulse */}
          {connections.map((conn, i) => {
            const fromPos = getDomainPosition(conn.from);
            const toPos = getDomainPosition(conn.to);
            const isAdjacent = hoveredDomain === conn.from || hoveredDomain === conn.to;
            
            return (
              <g key={`connection-${i}`}>
                <motion.line
                  x1={fromPos.x}
                  y1={fromPos.y}
                  x2={toPos.x}
                  y2={toPos.y}
                  stroke={`url(#conn-grad-${i})`}
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  initial={{ opacity: 0.65 }}
                  animate={{ 
                    opacity: isAdjacent ? 1 : (hoveredDomain ? 0.4 : 0.65),
                    strokeDashoffset: shouldReduceMotion ? 0 : [0, -8]
                  }}
                  transition={{ 
                    opacity: { duration: 0.25 },
                    strokeDashoffset: { 
                      duration: 3, 
                      repeat: Infinity, 
                      ease: "linear" 
                    }
                  }}
                  style={{
                    filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.35))'
                  }}
                />
              </g>
            );
          })}

          {/* Center Nucleus (small) */}
          <circle
            cx={dimensions.width / 2}
            cy={dimensions.height / 2}
            r="8"
            fill={TOKENS.HORIZON.haloWeak}
            style={{
              filter: 'drop-shadow(0 0 12px rgba(255, 255, 255, 0.3))'
            }}
          />

          {/* Liquid Silk Orbs */}
          {domains.map((domain, index) => {
            const pos = getDomainPosition(domain.id);
            const color = getDomainColor(domain.id);
            const isHovered = hoveredDomain === domain.id;
            const baseSize = 72;
            const size = baseSize * (0.9 + domain.strength * 0.2);
            const radius = size / 2;

            return (
              <g key={domain.id}>
                {/* Ambient nebula depth (per orb) */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="600"
                  fill={`url(#nucleus-${domain.id})`}
                  opacity="0.06"
                  style={{
                    filter: 'blur(40px)',
                    pointerEvents: 'none'
                  }}
                />

                {/* Halo glow */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={radius + 60}
                  fill={color}
                  opacity={isHovered ? "0.12" : "0.08"}
                  style={{
                    filter: `blur(60px)`,
                    pointerEvents: 'none',
                    transition: `opacity ${TOKENS.HORIZON.t_hover} ${TOKENS.HORIZON.easing}`
                  }}
                />

                {/* Main Liquid Silk orb */}
                <motion.circle
                  cx={pos.x}
                  cy={pos.y}
                  r={radius}
                  fill={`url(#nucleus-${domain.id})`}
                  className="orb cursor-pointer"
                  style={{
                    filter: `drop-shadow(0 6px 24px rgba(0,0,0,0.35))`,
                    transformOrigin: `${pos.x}px ${pos.y}px`,
                    pointerEvents: 'all'
                  }}
                  animate={shouldReduceMotion ? {} : {
                    scale: isHovered ? 1.02 : [1, 1.03, 1],
                    y: isHovered ? -2 : 0
                  }}
                  transition={shouldReduceMotion ? {} : {
                    scale: isHovered ? 
                      { duration: 0.25, ease: TOKENS.HORIZON.easing } : 
                      { duration: 6, repeat: Infinity, ease: "easeInOut" },
                    y: { duration: 0.25, ease: TOKENS.HORIZON.easing }
                  }}
                  onMouseEnter={() => setHoveredDomain(domain.id)}
                  onMouseLeave={() => setHoveredDomain(null)}
                  onClick={(e) => handleOpenDrawer(domain, e)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleOpenDrawer(domain, e);
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`${domain.id} domain: ${domain.posture}, ${domain.confidence_pct}% confidence`}
                  aria-describedby={`capsule-${domain.id}`}
                />

                {/* Outer ring */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={radius}
                  fill="none"
                  stroke={color}
                  strokeWidth="1"
                  opacity="0.3"
                  style={{ pointerEvents: 'none' }}
                />

                {/* Highlight */}
                <ellipse
                  cx={pos.x - radius * 0.25}
                  cy={pos.y - radius * 0.25}
                  rx={radius * 0.3}
                  ry={radius * 0.35}
                  fill="rgba(255, 255, 255, 0.4)"
                  style={{
                    filter: 'blur(4px)',
                    pointerEvents: 'none'
                  }}
                />
              </g>
            );
          })}
        </svg>

        {/* Domain Labels */}
        {domains.map((domain) => {
          const pos = getDomainPosition(domain.id);
          const color = getDomainColor(domain.id);
          
          return (
            <div
              key={`label-${domain.id}`}
              className="absolute pointer-events-none text-center"
              style={{
                left: pos.x,
                top: pos.y + 50,
                transform: 'translateX(-50%)',
                fontFamily: 'SF Pro Text, -apple-system, system-ui, sans-serif',
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '0.01em',
                color: color,
                textShadow: `0 1px 1px rgba(0,0,0,0.35), 0 0 12px ${color}40`,
              }}
            >
              {domain.id.toUpperCase()}
            </div>
          );
        })}

        {/* Hover Info Capsule (glass micro-card) */}
        <AnimatePresence>
          {hoveredDomain && !selectedDomain && !isMorphing && (
            <motion.div
              ref={capsuleRef}
              id={`capsule-${hoveredDomain}`}
              className="absolute z-50"
              style={{
                left: getDomainPosition(hoveredDomain).x + 60,
                top: getDomainPosition(hoveredDomain).y - 40,
                transformOrigin: 'center left'
              }}
              initial={{ opacity: 0, y: 6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.95 }}
              transition={{ 
                duration: parseFloat(TOKENS.HORIZON.t_tooltip) / 1000, 
                ease: TOKENS.HORIZON.easing 
              }}
            >
              {(() => {
                const domain = domains.find(d => d.id === hoveredDomain);
                if (!domain) return null;
                
                return (
                  <div
                    className="cursor-pointer"
                    onClick={(e) => handleOpenDrawer(domain, e)}
                    style={{
                      backdropFilter: TOKENS.HORIZON.blurChip,
                      WebkitBackdropFilter: TOKENS.HORIZON.blurChip,
                      background: 'rgba(20,22,30,0.45)',
                      border: `1px solid ${TOKENS.HORIZON.glassBorder}`,
                      boxShadow: TOKENS.HORIZON.panelShadow,
                      borderRadius: '16px',
                      padding: '14px 16px',
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
                          color: TOKENS.colors.textPrimary,
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
                        color: TOKENS.colors.textSecondary,
                        fontSize: '13px',
                        lineHeight: '1.5',
                        marginBottom: '12px',
                        textShadow: '0 1px 1px rgba(0,0,0,0.35)'
                      }}
                    >
                      {domain.summary.length > 85 ? domain.summary.substring(0, 82) + '...' : domain.summary}
                    </p>
                    
                    <div 
                      className="flex items-center gap-2 text-xs"
                      style={{ color: TOKENS.colors.textTertiary }}
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

        {/* Floating Global Balance Bar */}
        <motion.div
          className="absolute left-6 right-6 bottom-6"
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: parseFloat(TOKENS.HORIZON.t_tooltip) / 1000,
            ease: "easeOut"
          }}
        >
          <div
            style={{
              backdropFilter: TOKENS.HORIZON.blurChip,
              WebkitBackdropFilter: TOKENS.HORIZON.blurChip,
              background: 'rgba(20,22,30,0.45)',
              border: `1px solid ${TOKENS.HORIZON.glassBorder}`,
              boxShadow: TOKENS.HORIZON.panelShadow,
              borderRadius: '16px',
              padding: '14px 16px',
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}
          >
            <span 
              className="font-semibold"
              style={{ 
                color: TOKENS.colors.textPrimary,
                fontSize: '14.5px',
                lineHeight: '20px',
                textShadow: '0 1px 1px rgba(0,0,0,0.35)'
              }}
            >
              Global Balance:
            </span>
            <span 
              style={{ 
                color: TOKENS.colors.textSecondary,
                fontSize: '14.5px',
                lineHeight: '20px',
                textShadow: '0 1px 1px rgba(0,0,0,0.35)'
              }}
            >
              {globalSummary}
            </span>
            
            {dominantDriver !== "balanced" && (
              <>
                <div 
                  className="w-px h-4"
                  style={{ background: TOKENS.HORIZON.glassBorder }}
                />
                <div className="flex items-center gap-2">
                  <span 
                    style={{ 
                      color: TOKENS.colors.textTertiary,
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
        </motion.div>
      </div>

      {/* Morph Overlay (capsule → drawer transition) */}
      <AnimatePresence>
        {isMorphing && capsuleBounds && (
          <motion.div
            className="fixed z-45"
            style={{
              left: capsuleBounds.left,
              top: capsuleBounds.top,
              width: capsuleBounds.width,
              height: capsuleBounds.height,
              backdropFilter: TOKENS.HORIZON.blurPanel,
              WebkitBackdropFilter: TOKENS.HORIZON.blurPanel,
              background: TOKENS.HORIZON.glassBg,
              border: `1px solid ${TOKENS.HORIZON.glassBorder}`,
              boxShadow: TOKENS.HORIZON.panelShadow,
              borderRadius: '20px',
              pointerEvents: 'none'
            }}
            animate={{
              left: window.innerWidth - 520,
              top: 0,
              width: 520,
              height: '100vh',
              borderRadius: '0px'
            }}
            transition={{
              duration: parseFloat(TOKENS.HORIZON.t_drawer) / 1000,
              ease: TOKENS.HORIZON.easing
            }}
          />
        )}
      </AnimatePresence>

      {/* Dimmed Background during morph/drawer */}
      <AnimatePresence>
        {(selectedDomain || isMorphing) && (
          <motion.div
            className="fixed inset-0 z-40"
            style={{
              background: 'rgba(10, 12, 20, 0.55)',
              backdropFilter: 'blur(30px)',
              WebkitBackdropFilter: 'blur(30px)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: isMorphing ? 0.1 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: parseFloat(TOKENS.HORIZON.t_drawer) / 1000,
              ease: TOKENS.HORIZON.easing
            }}
            onClick={handleCloseDrawer}
          />
        )}
      </AnimatePresence>

      {/* Detailed Drawer (Horizon Glass) */}
      <AnimatePresence>
        {selectedDomain && !isMorphing && (
          <motion.div
            className="fixed top-0 right-0 h-full z-50 overflow-y-auto"
            style={{
              width: '520px',
              maxWidth: '90vw',
              backdropFilter: TOKENS.HORIZON.blurPanel,
              WebkitBackdropFilter: TOKENS.HORIZON.blurPanel,
              background: TOKENS.HORIZON.glassBg,
              border: `1px solid ${TOKENS.HORIZON.glassBorder}`,
              boxShadow: TOKENS.HORIZON.panelShadow,
              borderRadius: '20px'
            }}
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ 
              duration: parseFloat(TOKENS.HORIZON.t_drawer) / 1000,
              ease: TOKENS.HORIZON.easing
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div 
              className="sticky top-0 z-10 p-6 border-b"
              style={{
                background: TOKENS.HORIZON.glassBg,
                borderColor: TOKENS.HORIZON.glassBorder,
                backdropFilter: TOKENS.HORIZON.blurChip
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      background: `${getDomainColor(selectedDomain.id)}20`,
                      border: `1px solid ${getDomainColor(selectedDomain.id)}40`,
                      boxShadow: `0 0 16px ${getDomainColor(selectedDomain.id)}30`
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
                        color: TOKENS.colors.textPrimary,
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
                  onClick={handleCloseDrawer}
                  className="p-2 rounded-lg transition-colors hover:bg-white/10"
                  style={{ color: TOKENS.colors.textTertiary }}
                  aria-label="Close drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Confidence Gauge (liquid fill) */}
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
                      transition={{ 
                        duration: 0.7,
                        ease: TOKENS.HORIZON.easing
                      }}
                    />
                  </svg>
                  <div 
                    className="absolute inset-0 flex items-center justify-center font-bold"
                    style={{ 
                      color: TOKENS.colors.textPrimary,
                      fontSize: '16px'
                    }}
                  >
                    {selectedDomain.confidence_pct}%
                  </div>
                </div>
                
                <div className="flex-1">
                  <div 
                    className="text-xs font-medium mb-1"
                    style={{ color: TOKENS.colors.textTertiary }}
                  >
                    CONFIDENCE LEVEL
                  </div>
                  <div 
                    className="text-sm"
                    style={{ color: TOKENS.colors.textSecondary }}
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
                  style={{ color: TOKENS.colors.textTertiary }}
                >
                  What This Means
                </h4>
                <p 
                  style={{
                    color: TOKENS.colors.textPrimary,
                    fontSize: '15px',
                    lineHeight: '1.6',
                    textShadow: '0 1px 1px rgba(0,0,0,0.35)'
                  }}
                >
                  {selectedDomain.summary}
                </p>
              </div>

              {/* Ripple Impact (Effect Chips) */}
              <div>
                <h4 
                  className="text-xs font-bold uppercase tracking-wide mb-3"
                  style={{ color: TOKENS.colors.textTertiary }}
                >
                  Downstream Effects
                </h4>
                <div className="space-y-2">
                  {selectedDomain.ripple.map((effect, i) => (
                    <motion.div
                      key={i}
                      className="effect-chip"
                      style={{
                        backdropFilter: TOKENS.HORIZON.blurChip,
                        WebkitBackdropFilter: TOKENS.HORIZON.blurChip,
                        background: 'rgba(25,27,36,0.45)',
                        border: `1px solid ${TOKENS.HORIZON.glassBorder}`,
                        boxShadow: `inset 0 0 0 1px ${TOKENS.HORIZON.glassInner}`,
                        borderRadius: '12px',
                        padding: '10px 12px',
                        display: 'flex',
                        alignItems: 'start',
                        gap: '8px'
                      }}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        delay: 0.4 + i * 0.1,
                        duration: 0.4,
                        ease: TOKENS.HORIZON.easing
                      }}
                    >
                      <div 
                        className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                        style={{ background: getDomainColor(selectedDomain.id) }}
                      />
                      <span 
                        style={{ 
                          color: TOKENS.colors.textSecondary,
                          fontSize: '14px',
                          lineHeight: '1.5',
                          textShadow: '0 1px 1px rgba(0,0,0,0.35)'
                        }}
                      >
                        {effect}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Trend Chart (48h sparkline with orb-tinted gradient) */}
              <div>
                <h4 
                  className="text-xs font-bold uppercase tracking-wide mb-3"
                  style={{ color: TOKENS.colors.textTertiary }}
                >
                  48-Hour Trend
                </h4>
                <div 
                  className="p-4 rounded-lg"
                  style={{
                    background: 'rgba(0, 0, 0, 0.2)',
                    border: `1px solid ${TOKENS.HORIZON.glassBorder}`
                  }}
                >
                  <svg width="100%" height="60" className="overflow-visible">
                    <defs>
                      <linearGradient id={`sparkline-${selectedDomain.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={getDomainColor(selectedDomain.id)} stopOpacity="0.7" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0)" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    
                    {(() => {
                      const data = selectedDomain.sparkline;
                      const width = 450;
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
                            animate={{ opacity: 0.7 }}
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
                            transition={{ 
                              duration: 1.2,
                              delay: 0.6,
                              ease: TOKENS.HORIZON.easing
                            }}
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
                style={{ color: TOKENS.colors.textTertiary }}
              >
                Updated {new Date(selectedDomain.last_updated_iso).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Performance & Accessibility CSS */}
      <style jsx>{`
        .orb {
          transform: translateZ(0);
          will-change: transform, opacity;
          backface-visibility: hidden;
        }

        @keyframes orb-breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }

        .orb {
          animation: orb-breathe 6s ease-in-out infinite;
        }

        .orb:hover {
          animation: none;
        }

        @media (prefers-reduced-motion: reduce) {
          .orb {
            animation: none !important;
          }
          * {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }

        svg {
          shape-rendering: geometricPrecision;
        }

        /* Enhanced focus ring with domain color */}
        .orb:focus-visible {
          outline: none;
          filter: drop-shadow(0 0 0 1px ${TOKENS.colors.textPrimary}) 
                  drop-shadow(0 0 0 2px currentColor)
                  drop-shadow(0 0 12px currentColor) !important;
        }

        /* Text contrast guard */
        .effect-chip span,
        .floating-bar span,
        p {
          text-shadow: 0 1px 1px rgba(0,0,0,0.35);
        }
      `}</style>
    </motion.section>
  );
};

export default MacroEquilibriumGrid;