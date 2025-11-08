import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, X, TrendingUp, TrendingDown, Minus, ArrowRight } from 'lucide-react';
import LyraLogo from '../core/LyraLogo';

// ============================================================================
// HORIZON CONSTELLATION - FINAL MONOCHROME GLASS
// Calm depth and balance - Zero hue blending
// ============================================================================

const TOKENS = {
  TAHOE: {
    DARK: {
      paneBg: 'rgba(18,20,28,0.55)',
      paneBorder: 'rgba(255,255,255,0.06)',
      paneInner: 'rgba(255,255,255,0.03)',
      paneBlur: 'blur(30px)',
      shadow: '0 22px 70px rgba(0,0,0,0.45)',
      vignette: 'radial-gradient(ellipse 1400px 900px at 50% 50%, rgba(255,255,255,0.03), transparent 70%)',
      gravityWell: 'radial-gradient(circle at center, rgba(255,255,255,0.02) 0%, transparent 80%)'
    }
  },
  MOTION: {
    CALM: {
      ease_sine: [0.37, 0, 0.63, 1],
      t_breathe_min: 6200,
      t_breathe_max: 9000,
      t_thread: 5200,
      t_halo: 6800,
      amp_orb: 0.012,
      amp_nucleus: 0.018,
      amp_parallax: 2
    },
    ease: [0.32, 0.72, 0, 1],
    t_hover: 0.4,
    t_tooltip: 0.35,
    t_drawer: 0.6
  },
  MACRO: {
    rates: {
      core: '#A6A7FF',
      halo: 'rgba(166,167,255,0.85)',
      text: '#C5C6FF',
      dotColor: '#C5C6FF'
    },
    fx: {
      core: '#7BE0FF',
      halo: 'rgba(123,224,255,0.85)',
      text: '#B8EDFF',
      dotColor: '#B8EDFF'
    },
    growth: {
      core: '#8FF7C9',
      halo: 'rgba(143,247,201,0.85)',
      text: '#C8FBE6',
      dotColor: '#C8FBE6'
    },
    geopolitics: {
      core: '#FFD599',
      halo: 'rgba(255,213,153,0.85)',
      text: '#FFE8C5',
      dotColor: '#FFE8C5'
    }
  },
  DEPTH: {
    near: { zGlow: 1.00, zBlur: 20, haloRadius: 42 },
    mid: { zGlow: 0.88, zBlur: 22, haloRadius: 38 },
    far: { zGlow: 0.76, zBlur: 24, haloRadius: 35 }
  },
  colors: {
    textPrimary: "#E8EAED",
    textSecondary: "#A1A6AF",
    textTertiary: "rgba(255,255,255,0.60)",
    labelDefault: "rgba(255,255,255,0.85)",
    labelDominant: "rgba(255,255,255,0.95)",
    equilibriumText: "#E6E6E6"
  }
};

const ANGLES = {
  rates: 22.5,
  fx: 160.0,
  growth: 297.5,
  geopolitics: 75.0
};

const BASE_RADII = {
  rates: 0.36,
  fx: 0.40,
  growth: 0.38,
  geopolitics: 0.34
};

const DEPTH_MAP = {
  growth: 'near',
  rates: 'mid',
  fx: 'mid',
  geopolitics: 'far'
};

const PHASE_MAP = {
  nucleus: 0.11,
  rates: 0.32,
  fx: 0.58,
  growth: 0.83,
  geopolitics: 0.05
};

const MOCK_DOMAINS = [
  { id: "rates", posture: "hawkish", confidence_pct: 78, strength: 0.82, summary: "Fed holding firm; terminal rate expectations drift higher on sticky services inflation.", ripple: ["Credit spreads widen", "Tech multiples compress", "EM funding costs rise"], last_updated_iso: new Date().toISOString(), sparkline: [0.72, 0.74, 0.76, 0.75, 0.78, 0.80, 0.79, 0.81, 0.82] },
  { id: "fx", posture: "stable", confidence_pct: 65, strength: 0.58, summary: "Dollar range-bound as yield differentials narrow; carry trades unwind slowly.", ripple: ["EM currencies stabilize", "Energy imports neutral"], last_updated_iso: new Date().toISOString(), sparkline: [0.60, 0.59, 0.58, 0.57, 0.58, 0.59, 0.58, 0.57, 0.58] },
  { id: "growth", posture: "softening", confidence_pct: 71, strength: 0.68, summary: "China slowdown weighs on global demand; US consumer resilient but moderating.", ripple: ["Commodity prices soften", "Defensive rotation begins", "Services hold up"], last_updated_iso: new Date().toISOString(), sparkline: [0.75, 0.74, 0.72, 0.70, 0.69, 0.68, 0.67, 0.68, 0.68] },
  { id: "geopolitics", posture: "tightening", confidence_pct: 58, strength: 0.72, summary: "Energy security concerns persist; trade fragmentation continues to reshape supply chains.", ripple: ["Energy premium elevated", "Onshoring accelerates"], last_updated_iso: new Date().toISOString(), sparkline: [0.65, 0.66, 0.68, 0.70, 0.71, 0.72, 0.71, 0.72, 0.72] }
];

const MacroEquilibriumGrid = ({ onOpenSignalDrawer }) => {
  const containerRef = useRef(null);
  const capsuleRef = useRef(null);
  const footerRef = useRef(null);
  const [hoveredDomain, setHoveredDomain] = useState(null);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const [capsuleBounds, setCapsuleBounds] = useState(null);
  const [isMorphing, setIsMorphing] = useState(false);
  const [isLowPower, setIsLowPower] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const domains = MOCK_DOMAINS;

  const dominantDriver = useMemo(() => {
    const maxStrength = Math.max(...domains.map(d => d.strength));
    const dominant = domains.find(d => d.strength === maxStrength);
    if (maxStrength < 0.65) return "balanced";
    const sortedByStrength = [...domains].sort((a, b) => b.strength - a.strength);
    if (sortedByStrength[0].strength - sortedByStrength[1].strength < 0.1) return "balanced";
    return dominant.id;
  }, [domains]);

  const balanceBias = useMemo(() => {
    if (dominantDriver === "balanced") return 0;
    const dominant = domains.find(d => d.id === dominantDriver);
    return dominant ? Math.min(dominant.strength * 1.2, 1) : 0;
  }, [dominantDriver, domains]);

  const globalSummary = useMemo(() => {
    const ratesDomain = domains.find(d => d.id === "rates");
    const fxDomain = domains.find(d => d.id === "fx");
    const growthDomain = domains.find(d => d.id === "growth");
    const geoDomain = domains.find(d => d.id === "geopolitics");
    
    if (dominantDriver === "balanced") {
      return `Equilibrium balanced — Rates ${ratesDomain.posture}; FX ${fxDomain.posture}; Growth ${growthDomain.posture}; Geopolitics ${geoDomain.posture}.`;
    }
    
    return `Equilibrium leaning toward ${dominantDriver.charAt(0).toUpperCase() + dominantDriver.slice(1)} — Rates ${ratesDomain.posture}; FX ${fxDomain.posture}; Growth ${growthDomain.posture}; Geopolitics ${geoDomain.posture}.`;
  }, [domains, dominantDriver]);

  const balanceAngle = useMemo(() => {
    if (dominantDriver === "balanced") return 0;
    return ANGLES[dominantDriver] || 0;
  }, [dominantDriver]);

  useEffect(() => {
    if (shouldReduceMotion || !containerRef.current) return;
    
    const handleMouseMove = (e) => {
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) / rect.width;
      const deltaY = (e.clientY - centerY) / rect.height;
      
      setMousePosition({ 
        x: deltaX * TOKENS.MOTION.CALM.amp_parallax, 
        y: deltaY * TOKENS.MOTION.CALM.amp_parallax 
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [shouldReduceMotion]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldReduceMotion(mediaQuery.matches);
    const handler = (e) => setShouldReduceMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
      navigator.getBattery().then(battery => setIsLowPower(battery.level < 0.2));
    }
  }, []);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const { cx, cy, orbitBaseRadius } = useMemo(() => {
    const safeW = dimensions.width - 72;
    const safeH = dimensions.height - 200;
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2 - 20;
    const baseRadius = Math.min(safeW, safeH) * 0.32;
    
    return { cx: centerX, cy: centerY, orbitBaseRadius: baseRadius };
  }, [dimensions]);

  const nucleusOffset = useMemo(() => {
    const angleRad = (balanceAngle * Math.PI) / 180;
    const offsetMagnitude = balanceBias * 14;
    return {
      x: Math.sin(angleRad) * offsetMagnitude,
      y: -Math.cos(angleRad) * offsetMagnitude
    };
  }, [balanceAngle, balanceBias]);

  const balanceVectorWidth = useMemo(() => {
    return `${30 + (balanceBias * 8)}%`;
  }, [balanceBias]);

  const getOrbPosition = useCallback((domainId, strength) => {
    const angle = ANGLES[domainId] * (Math.PI / 180);
    const baseSize = 40;
    const sizeRange = 20;
    const diameter = baseSize + (strength * sizeRange);
    const radius = diameter / 2;
    
    const baseRadiusFactor = BASE_RADII[domainId];
    const strengthFactor = 0.95 + (strength * 0.15);
    const adjustedRadius = orbitBaseRadius * baseRadiusFactor * strengthFactor;
    
    const orbX = cx + adjustedRadius * Math.cos(angle);
    const orbY = cy + adjustedRadius * Math.sin(angle);
    
    return { x: orbX, y: orbY, radius, diameter };
  }, [cx, cy, orbitBaseRadius]);

  const getLabelPosition = useCallback((orbX, orbY, orbRadius) => {
    const vx = orbX - cx;
    const vy = orbY - cy;
    const norm = Math.hypot(vx, vy) || 1;
    const nx = vx / norm;
    const ny = vy / norm;
    const offset = orbRadius + 14;
    
    return {
      x: orbX + nx * offset,
      y: orbY + ny * offset
    };
  }, [cx, cy]);

  const getDomainColor = (domainId) => TOKENS.MACRO[domainId]?.core || TOKENS.MACRO.rates.core;
  const getDomainHalo = (domainId) => TOKENS.MACRO[domainId]?.halo || TOKENS.MACRO.rates.halo;
  const getDomainText = (domainId) => TOKENS.MACRO[domainId]?.text || TOKENS.MACRO.rates.text;
  const getDomainDotColor = (domainId) => TOKENS.MACRO[domainId]?.dotColor || TOKENS.MACRO.rates.dotColor;

  const getDepthParams = (domainId) => {
    const depthLevel = DEPTH_MAP[domainId] || 'mid';
    return TOKENS.DEPTH[depthLevel];
  };

  const getDomainIcon = (domainId) => {
    const iconMap = { rates: "📊", fx: "💱", growth: "📈", geopolitics: "🌍" };
    return iconMap[domainId] || "•";
  };

  const getPostureIcon = (posture) => {
    if (["hawkish", "tightening", "firming"].includes(posture)) return <TrendingUp className="w-4 h-4" />;
    if (["dovish", "loosening", "softening"].includes(posture)) return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const handleOpenDrawer = useCallback((domain) => {
    if (capsuleRef.current) {
      setCapsuleBounds(capsuleRef.current.getBoundingClientRect());
    }
    setIsMorphing(true);
    setTimeout(() => {
      setSelectedDomain(domain);
      setIsMorphing(false);
    }, TOKENS.MOTION.t_drawer * 1000);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setIsMorphing(true);
    setTimeout(() => {
      setSelectedDomain(null);
      setCapsuleBounds(null);
      setIsMorphing(false);
    }, TOKENS.MOTION.t_drawer * 1000);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedDomain) handleCloseDrawer();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedDomain, handleCloseDrawer]);

  const connections = useMemo(() => [
    { from: "rates", to: "growth", relationship: 0.7 },
    { from: "fx", to: "geopolitics", relationship: 0.6 },
    { from: "rates", to: "fx", relationship: 0.8 },
    { from: "growth", to: "geopolitics", relationship: 0.5 }
  ], []);

  return (
    <motion.section variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} aria-label="Horizon Constellation">
      <div className="flex items-center justify-between mb-6 pl-2">
        <div className="flex items-center space-x-3">
          <Globe className="w-6 h-6 text-blue-300" />
          <div>
            <h2 className="font-bold" style={{ fontSize: '16px', lineHeight: '22px', letterSpacing: '0.02em', color: TOKENS.colors.textPrimary }}>Macro Equilibrium Grid</h2>
            <p style={{ fontSize: '13px', color: TOKENS.colors.textSecondary }}>Living constellation of macro forces.</p>
          </div>
        </div>
        <div className="powered-by-lyra cursor-pointer" style={{ opacity: 0.6 }}>
          <div className="flex items-center space-x-2 px-4 py-2" style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', border: '1px solid rgba(255,255,255,0.06)', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)', borderRadius: '12px' }}>
            <span className="text-xs font-medium" style={{ color: TOKENS.colors.textTertiary }}>Powered by</span>
            <LyraLogo className="w-5 h-5" />
            <span className="text-sm font-bold" style={{ color: TOKENS.colors.textPrimary }}>Lyra</span>
          </div>
        </div>
      </div>

      {/* Pure monochrome shell - zero color contamination */}
      <div 
        ref={containerRef} 
        className="grid-wrapper relative w-full overflow-hidden"
        data-dominant={dominantDriver}
        style={{
          background: '#0a0d12',
          minHeight: '600px'
        }}
      >
        {/* Liquid glass pane - completely neutral */}
        <div className="glass-pane" style={{
          position: 'relative',
          margin: '24px',
          borderRadius: '22px',
          overflow: 'hidden',
          backdropFilter: TOKENS.TAHOE.DARK.paneBlur,
          WebkitBackdropFilter: TOKENS.TAHOE.DARK.paneBlur,
          background: TOKENS.TAHOE.DARK.paneBg,
          border: `1px solid ${TOKENS.TAHOE.DARK.paneBorder}`,
          boxShadow: TOKENS.TAHOE.DARK.shadow
        }}>
          {/* Monochrome inner vignette only - zero hue */}
          <div style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: TOKENS.TAHOE.DARK.vignette,
            mixBlendMode: 'screen',
            opacity: 1
          }} />
          
          {/* Inner glow */}
          <div style={{
            position: 'absolute',
            inset: '1px',
            borderRadius: '21px',
            pointerEvents: 'none',
            boxShadow: `inset 0 0 0 1px ${TOKENS.TAHOE.DARK.paneInner}`
          }} />

          {/* Constellation layer with micro-parallax */}
          <motion.div 
            className="constellation-layer" 
            style={{ 
              position: 'relative',
              padding: '36px 36px 28px',
              minHeight: '520px'
            }}
            animate={shouldReduceMotion ? {} : {
              x: mousePosition.x,
              y: mousePosition.y
            }}
            transition={{ duration: 0.8, ease: TOKENS.MOTION.CALM.ease_sine }}
          >
            {/* Monochrome gravity well - zero color bleed */}
            <div style={{
              position: 'absolute',
              left: `${cx}px`,
              top: `${cy}px`,
              width: `${orbitBaseRadius * 2.8}px`,
              height: `${orbitBaseRadius * 2.8}px`,
              transform: 'translate(-50%, -50%)',
              background: TOKENS.TAHOE.DARK.gravityWell,
              pointerEvents: 'none',
              opacity: 1,
              zIndex: 1
            }} />

            {/* Orbit Ring */}
            <div className="orbit-ring" style={{
              position: 'absolute',
              left: `${cx}px`,
              top: `${cy}px`,
              width: `${orbitBaseRadius * 2}px`,
              height: `${orbitBaseRadius * 2}px`,
              transform: 'translate(-50%, -50%)',
              borderRadius: '999px',
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)',
              opacity: 0.35,
              filter: 'blur(0.2px)',
              pointerEvents: 'none',
              zIndex: 2
            }} aria-hidden="true" />

            {/* Nucleus Carrier with offset */}
            <motion.div 
              className="nucleus-carrier" 
              style={{
                position: 'absolute',
                left: `${cx}px`,
                top: `${cy}px`,
                zIndex: 2
              }}
              animate={{
                x: nucleusOffset.x,
                y: nucleusOffset.y
              }}
              transition={{ duration: 0.5, ease: TOKENS.MOTION.ease }}
            >
              {/* Breathing Nucleus */}
              <motion.div 
                className="nucleus" 
                data-phase={PHASE_MAP.nucleus}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  transform: 'translate(-50%, -50%)',
                  width: '22px',
                  height: '22px',
                  borderRadius: '999px',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  background: 'rgba(210,225,255,0.10)',
                  boxShadow: '0 0 8px 2px rgba(255,255,255,0.12), 0 0 80px rgba(160,180,255,0.10), inset 0 0 0 1px rgba(255,255,255,0.07)',
                  pointerEvents: 'none'
                }}
                animate={shouldReduceMotion ? {} : {
                  scale: [1 - TOKENS.MOTION.CALM.amp_nucleus, 1 + TOKENS.MOTION.CALM.amp_nucleus, 1 - TOKENS.MOTION.CALM.amp_nucleus]
                }}
                transition={shouldReduceMotion ? {} : {
                  duration: (TOKENS.MOTION.CALM.t_breathe_min + TOKENS.MOTION.CALM.t_breathe_max) / 2000,
                  repeat: Infinity,
                  ease: TOKENS.MOTION.CALM.ease_sine,
                  delay: -PHASE_MAP.nucleus
                }}
                aria-hidden="true" 
              />

              {/* Balance Vector */}
              {dominantDriver !== "balanced" && (
                <motion.div
                  className="balance-vector"
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    height: '2px',
                    transformOrigin: 'left center',
                    borderRadius: '999px',
                    background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.55))',
                    opacity: 0.6,
                    pointerEvents: 'none'
                  }}
                  animate={{
                    rotate: balanceAngle,
                    width: balanceVectorWidth
                  }}
                  transition={{ duration: 0.5, ease: TOKENS.MOTION.ease }}
                />
              )}

              {/* Nucleus rays */}
              {domains.map((domain) => {
                const angle = ANGLES[domain.id];
                const isDominant = domain.id === dominantDriver;
                const rayAlpha = isDominant ? 0.55 : 0.2;
                
                return (
                  <motion.div
                    key={`ray-${domain.id}`}
                    className="nucleus-ray"
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      width: '28%',
                      height: '2px',
                      transformOrigin: 'left center',
                      borderRadius: '999px',
                      background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.45))',
                      pointerEvents: 'none'
                    }}
                    animate={{
                      rotate: angle,
                      opacity: rayAlpha
                    }}
                    transition={{ duration: 0.5, ease: TOKENS.MOTION.ease }}
                  />
                );
              })}
            </motion.div>

            {/* SVG Layer */}
            <svg width={dimensions.width - 48} height={dimensions.height - 100} className="absolute" style={{ left: '24px', top: '36px', overflow: 'visible', zIndex: 2 }}>
              <defs>
                {/* Isolated orb gradients - color contained within orb only */}
                {domains.map((domain) => (
                  <radialGradient key={`nucleus-${domain.id}`} id={`nucleus-${domain.id}`}>
                    <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
                    <stop offset="45%" stopColor={getDomainColor(domain.id)} stopOpacity="0.85" />
                    <stop offset="70%" stopColor="rgba(255,255,255,0)" stopOpacity="0" />
                  </radialGradient>
                ))}
                {connections.map((conn, i) => (
                  <linearGradient key={`conn-grad-${i}`} id={`conn-grad-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={getDomainHalo(conn.from)} />
                    <stop offset="100%" stopColor={getDomainHalo(conn.to)} />
                  </linearGradient>
                ))}
              </defs>

              {/* Thin luminescent threads */}
              <g style={{ zIndex: 2 }}>
                {connections.map((conn, i) => {
                  const fromDomain = domains.find(d => d.id === conn.from);
                  const toDomain = domains.find(d => d.id === conn.to);
                  const fromPos = getOrbPosition(conn.from, fromDomain.strength);
                  const toPos = getOrbPosition(conn.to, toDomain.strength);
                  const isAdjacent = hoveredDomain === conn.from || hoveredDomain === conn.to;
                  const pathD = `M ${fromPos.x - 24},${fromPos.y - 36} Q ${cx - 24},${cy - 36} ${toPos.x - 24},${toPos.y - 36}`;
                  
                  return (
                    <motion.path 
                      key={`connection-${i}`} 
                      d={pathD} 
                      stroke={`url(#conn-grad-${i})`} 
                      strokeWidth="1" 
                      strokeLinecap="round" 
                      fill="none"
                      style={{ 
                        filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.35))',
                        strokeDasharray: '140 320'
                      }} 
                      animate={shouldReduceMotion ? { opacity: 0.55 } : { 
                        opacity: isAdjacent ? [0.55, 0.63, 0.55] : 0.55,
                        strokeDashoffset: [140, -320]
                      }}
                      transition={shouldReduceMotion ? {} : { 
                        opacity: isAdjacent ? { 
                          duration: TOKENS.MOTION.CALM.t_thread / 1000, 
                          repeat: Infinity, 
                          ease: TOKENS.MOTION.CALM.ease_sine
                        } : { duration: 0 },
                        strokeDashoffset: { 
                          duration: TOKENS.MOTION.CALM.t_thread / 1000,
                          repeat: Infinity, 
                          ease: "linear" 
                        }
                      }}
                    />
                  );
                })}
              </g>

              {/* Orbs with isolated halos - no overlap blending */}
              <g style={{ zIndex: 3 }}>
                {domains.map((domain) => {
                  const pos = getOrbPosition(domain.id, domain.strength);
                  const color = getDomainColor(domain.id);
                  const isHovered = hoveredDomain === domain.id;
                  const confidence = domain.confidence_pct / 100;
                  const depth = getDepthParams(domain.id);
                  const phase = PHASE_MAP[domain.id];
                  const breathDuration = (TOKENS.MOTION.CALM.t_breathe_min + (phase * (TOKENS.MOTION.CALM.t_breathe_max - TOKENS.MOTION.CALM.t_breathe_min))) / 1000;
                  
                  // Isolated halo - size restricted to prevent overlap
                  const haloRadius = depth.haloRadius + (confidence * 8);

                  return (
                    <g key={domain.id}>
                      {/* Contained halo - isolated color emission */}
                      <motion.circle 
                        cx={pos.x - 24} 
                        cy={pos.y - 36} 
                        r={haloRadius} 
                        fill={color}
                        style={{ 
                          filter: `blur(${depth.zBlur}px)`, 
                          pointerEvents: 'none',
                          opacity: 0.85
                        }} 
                        animate={shouldReduceMotion ? {} : {
                          opacity: [0.78, 0.92, 0.78],
                          r: [haloRadius - 2, haloRadius + 2, haloRadius - 2]
                        }}
                        transition={shouldReduceMotion ? {} : {
                          duration: TOKENS.MOTION.CALM.t_halo / 1000,
                          repeat: Infinity,
                          ease: TOKENS.MOTION.CALM.ease_sine,
                          delay: -phase * 0.8
                        }}
                      />
                      
                      {/* Orb core */}
                      <motion.circle 
                        cx={pos.x - 24} 
                        cy={pos.y - 36} 
                        r={pos.radius} 
                        fill={`url(#nucleus-${domain.id})`}
                        className="orb cursor-pointer" 
                        data-key={domain.id}
                        data-phase={phase}
                        style={{ 
                          filter: isHovered 
                            ? `drop-shadow(0 8px 28px rgba(0,0,0,0.35)) drop-shadow(0 0 ${haloRadius * 1.2}px ${color})`
                            : `drop-shadow(0 8px 28px rgba(0,0,0,0.35)) drop-shadow(0 0 ${haloRadius}px ${color})`,
                          transformOrigin: `${pos.x - 24}px ${pos.y - 36}px`, 
                          pointerEvents: 'all', 
                          color: color
                        }}
                        animate={shouldReduceMotion ? {} : { 
                          scale: isHovered 
                            ? [1, 1.02, 1] 
                            : [1 - TOKENS.MOTION.CALM.amp_orb, 1 + TOKENS.MOTION.CALM.amp_orb, 1 - TOKENS.MOTION.CALM.amp_orb]
                        }}
                        transition={shouldReduceMotion ? {} : {
                          scale: isHovered 
                            ? { duration: TOKENS.MOTION.t_hover, ease: TOKENS.MOTION.ease, repeat: Infinity } 
                            : { 
                                duration: breathDuration, 
                                repeat: Infinity, 
                                ease: TOKENS.MOTION.CALM.ease_sine,
                                delay: -phase * 1.2
                              }
                        }}
                        onMouseEnter={() => setHoveredDomain(domain.id)} 
                        onMouseLeave={() => setHoveredDomain(null)}
                        onClick={() => handleOpenDrawer(domain)} 
                        onKeyDown={(e) => { if (e.key === 'Enter') handleOpenDrawer(domain); }}
                        tabIndex={0} 
                        role="button" 
                        aria-label={`${domain.id} domain: ${domain.posture}, ${domain.confidence_pct}% confidence`} 
                        aria-describedby={`capsule-${domain.id}`} 
                      />
                      
                      <circle 
                        cx={pos.x - 24} 
                        cy={pos.y - 36} 
                        r={pos.radius} 
                        fill="none" 
                        stroke={color} 
                        strokeWidth="1" 
                        opacity="0.25" 
                        style={{ pointerEvents: 'none' }} 
                      />
                    </g>
                  );
                })}
              </g>
            </svg>

            {/* Labels */}
            {domains.map((domain) => {
              const orbPos = getOrbPosition(domain.id, domain.strength);
              const labelPos = getLabelPosition(orbPos.x, orbPos.y, orbPos.radius);
              const isHovered = hoveredDomain === domain.id;
              const isDominant = domain.id === dominantDriver;
              
              return (
                <motion.div 
                  key={`label-${domain.id}`} 
                  className="orb-label" 
                  data-key={domain.id}
                  style={{
                    position: 'absolute',
                    left: `${labelPos.x}px`,
                    top: `${labelPos.y}px`,
                    transform: 'translate(-50%, -50%)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    background: 'rgba(20,22,30,0.45)',
                    border: `1px solid ${TOKENS.TAHOE.DARK.paneBorder}`,
                    borderRadius: '12px',
                    padding: '6px 10px',
                    fontWeight: 500,
                    fontSize: '12px',
                    letterSpacing: '0.02em',
                    color: isHovered ? TOKENS.colors.labelDominant : (isDominant ? TOKENS.colors.labelDominant : TOKENS.colors.labelDefault),
                    textShadow: '0 1px 1px rgba(0,0,0,0.35)',
                    pointerEvents: 'none',
                    zIndex: 3
                  }}
                  animate={{
                    color: isHovered ? TOKENS.colors.labelDominant : (isDominant ? TOKENS.colors.labelDominant : TOKENS.colors.labelDefault)
                  }}
                  transition={{ duration: TOKENS.MOTION.t_hover, ease: TOKENS.MOTION.ease }}
                >
                  {domain.id.toUpperCase()}
                </motion.div>
              );
            })}
          </motion.div>

          {/* Balance Footer */}
          <div ref={footerRef} className="balance-footer" style={{
            margin: '14px 24px 24px',
            borderRadius: '16px',
            overflow: 'hidden',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            background: 'rgba(18,20,28,0.55)',
            border: `1px solid ${TOKENS.TAHOE.DARK.paneBorder}`,
            boxShadow: '0 14px 36px rgba(0,0,0,0.45)',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            zIndex: 1
          }}>
            <div className="balance-indicator-container" style={{ width: '140px', position: 'relative' }}>
              <div className="balance-track" style={{
                height: '6px',
                borderRadius: '999px',
                opacity: 0.55,
                background: 'linear-gradient(90deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))',
                position: 'relative'
              }}>
                <motion.div 
                  className="balance-dot"
                  data-dominant={dominantDriver}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    width: '12px',
                    height: '12px',
                    borderRadius: '999px',
                    background: dominantDriver === 'balanced' ? 'rgba(255,255,255,0.6)' : getDomainDotColor(dominantDriver),
                    boxShadow: `0 0 24px ${dominantDriver === 'balanced' ? 'rgba(255,255,255,0.4)' : getDomainDotColor(dominantDriver)}`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  animate={{
                    left: `calc(10% + ${balanceBias * 80}%)`
                  }}
                  transition={{ duration: 0.5, ease: TOKENS.MOTION.ease }}
                />
              </div>
            </div>
            
            <div className="flex-1">
              <span className="text-on-glass" style={{ 
                color: TOKENS.colors.equilibriumText, 
                fontSize: '14px', 
                lineHeight: '20px', 
                letterSpacing: '0.02em',
                textShadow: '0 1px 1px rgba(0,0,0,0.35)' 
              }}>
                {globalSummary}
              </span>
            </div>
          </div>
        </div>

        {/* Hover Capsule */}
        <AnimatePresence>
          {hoveredDomain && !selectedDomain && !isMorphing && (
            <motion.div 
              ref={capsuleRef} 
              id={`capsule-${hoveredDomain}`} 
              className="absolute z-50" 
              style={{ 
                left: (() => {
                  const domain = domains.find(d => d.id === hoveredDomain);
                  const pos = getOrbPosition(hoveredDomain, domain.strength);
                  return pos.x + 70;
                })(),
                top: (() => {
                  const domain = domains.find(d => d.id === hoveredDomain);
                  const pos = getOrbPosition(hoveredDomain, domain.strength);
                  return pos.y - 50 + 36;
                })(),
                transformOrigin: 'center left', 
                pointerEvents: 'auto' 
              }}
              initial={{ opacity: 0, y: 6 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: TOKENS.MOTION.t_tooltip, ease: TOKENS.MOTION.ease }}>
              {(() => {
                const domain = domains.find(d => d.id === hoveredDomain);
                if (!domain) return null;
                return (
                  <div className="cursor-pointer hover-capsule" onClick={() => handleOpenDrawer(domain)} style={{
                    backdropFilter: 'blur(20px)', 
                    WebkitBackdropFilter: 'blur(20px)', 
                    background: TOKENS.TAHOE.DARK.paneBg,
                    border: `1px solid ${TOKENS.TAHOE.DARK.paneBorder}`, 
                    boxShadow: TOKENS.TAHOE.DARK.shadow,
                    borderRadius: '16px', 
                    padding: '14px 16px', 
                    minWidth: '280px', 
                    maxWidth: '320px'
                  }}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: getDomainColor(domain.id), boxShadow: `0 0 8px ${getDomainColor(domain.id)}80` }} />
                      <span className="font-semibold capitalize" style={{ color: TOKENS.colors.textPrimary, fontSize: '14px', textShadow: '0 1px 1px rgba(0,0,0,0.35)' }}>{domain.id}</span>
                      <span className="ml-auto text-xs font-bold" style={{ color: getDomainText(domain.id), textShadow: '0 1px 1px rgba(0,0,0,0.35)' }}>{domain.confidence_pct}%</span>
                    </div>
                    <p className="text-on-glass" style={{ color: TOKENS.colors.textSecondary, fontSize: '13px', lineHeight: '1.5', marginBottom: '12px', textShadow: '0 1px 1px rgba(0,0,0,0.35)' }}>
                      {domain.summary.length > 85 ? domain.summary.substring(0, 82) + '...' : domain.summary}
                    </p>
                    <div className="flex items-center gap-2 text-xs" style={{ color: TOKENS.colors.textTertiary, minHeight: '44px', alignItems: 'center' }}>
                      <ArrowRight className="w-3.5 h-3.5" /><span className="font-medium">Click for details</span>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Morph overlay */}
      <AnimatePresence>
        {isMorphing && capsuleBounds && (
          <motion.div className="fixed z-45" style={{
            left: capsuleBounds.left, 
            top: capsuleBounds.top, 
            width: capsuleBounds.width, 
            height: capsuleBounds.height,
            backdropFilter: 'blur(30px)', 
            WebkitBackdropFilter: 'blur(30px)', 
            background: TOKENS.TAHOE.DARK.paneBg,
            border: `1px solid ${TOKENS.TAHOE.DARK.paneBorder}`, 
            boxShadow: TOKENS.TAHOE.DARK.shadow, 
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
          transition={{ duration: TOKENS.MOTION.t_drawer, ease: TOKENS.MOTION.ease }} />
        )}
      </AnimatePresence>

      {/* Scrim */}
      <AnimatePresence>
        {(selectedDomain || isMorphing) && (
          <motion.div 
            className="fixed inset-0 z-40" 
            style={{ 
              background: 'rgba(10, 12, 20, 0.55)', 
              backdropFilter: 'blur(30px)', 
              WebkitBackdropFilter: 'blur(30px)' 
            }}
            initial={{ opacity: 0 }} 
            animate={{ opacity: isMorphing ? 0.65 : 1 }} 
            exit={{ opacity: 0 }}
            transition={{ duration: TOKENS.MOTION.t_drawer, ease: TOKENS.MOTION.ease }} 
            onClick={handleCloseDrawer} 
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {selectedDomain && !isMorphing && (
          <motion.div className="fixed top-0 right-0 h-full z-50 overflow-y-auto" style={{
            width: '520px', 
            maxWidth: '90vw', 
            backdropFilter: 'blur(30px)', 
            WebkitBackdropFilter: 'blur(30px)',
            background: TOKENS.TAHOE.DARK.paneBg, 
            border: `1px solid ${TOKENS.TAHOE.DARK.paneBorder}`,
            boxShadow: TOKENS.TAHOE.DARK.shadow, 
            borderRadius: '20px'
          }}
          initial={{ x: '100%', opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          exit={{ x: '100%', opacity: 0 }}
          transition={{ duration: TOKENS.MOTION.t_drawer, ease: TOKENS.MOTION.ease }} 
          onClick={(e) => e.stopPropagation()}>
            
            <div className="sticky top-0 z-10 p-6 border-b" style={{ background: TOKENS.TAHOE.DARK.paneBg, borderColor: TOKENS.TAHOE.DARK.paneBorder, backdropFilter: 'blur(20px)' }}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `${getDomainColor(selectedDomain.id)}20`, border: `1px solid ${getDomainColor(selectedDomain.id)}40`, boxShadow: `0 0 16px ${getDomainColor(selectedDomain.id)}30` }}>
                    <span style={{ fontSize: '20px' }}>{getDomainIcon(selectedDomain.id)}</span>
                  </div>
                  <div>
                    <h3 className="font-bold capitalize" style={{ color: TOKENS.colors.textPrimary, fontSize: '20px', textShadow: '0 1px 1px rgba(0,0,0,0.35)' }}>{selectedDomain.id}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {getPostureIcon(selectedDomain.posture)}
                      <span className="font-semibold capitalize" style={{ color: getDomainText(selectedDomain.id), fontSize: '14px', textShadow: '0 1px 1px rgba(0,0,0,0.35)' }}>{selectedDomain.posture}</span>
                    </div>
                  </div>
                </div>
                <button onClick={handleCloseDrawer} className="p-2 rounded-lg transition-colors hover:bg-white/10" style={{ color: TOKENS.colors.textTertiary, minWidth: '44px', minHeight: '44px' }} aria-label="Close drawer"><X className="w-5 h-5" /></button>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16">
                  <svg className="transform -rotate-90" width="64" height="64">
                    <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                    <motion.circle cx="32" cy="32" r="28" fill="none" stroke={getDomainColor(selectedDomain.id)} strokeWidth="4" strokeLinecap="round" strokeDasharray="176"
                      initial={{ strokeDashoffset: 176 }} animate={{ strokeDashoffset: 176 - (176 * selectedDomain.confidence_pct / 100) }} transition={{ duration: 0.7, ease: TOKENS.MOTION.ease }} />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-bold" style={{ color: TOKENS.colors.textPrimary, fontSize: '16px' }}>{selectedDomain.confidence_pct}%</div>
                </div>
                <div className="flex-1">
                  <div className="text-xs font-medium mb-1" style={{ color: TOKENS.colors.textTertiary }}>CONFIDENCE LEVEL</div>
                  <div className="text-sm" style={{ color: TOKENS.colors.textSecondary }}>Signal strength: {Math.round(selectedDomain.strength * 100)}%</div>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: TOKENS.colors.textTertiary }}>What This Means</h4>
                <p className="text-on-glass" style={{ color: TOKENS.colors.textPrimary, fontSize: '15px', lineHeight: '1.6', textShadow: '0 1px 1px rgba(0,0,0,0.35)' }}>{selectedDomain.summary}</p>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: TOKENS.colors.textTertiary }}>Downstream Effects</h4>
                <div className="space-y-2">
                  {selectedDomain.ripple.map((effect, i) => (
                    <motion.div key={i} className="effect-chip" style={{
                      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', background: TOKENS.TAHOE.DARK.paneBg,
                      border: `1px solid ${TOKENS.TAHOE.DARK.paneBorder}`, boxShadow: `inset 0 0 0 1px ${TOKENS.TAHOE.DARK.paneInner}`,
                      borderRadius: '12px', padding: '10px 12px', display: 'flex', alignItems: 'start', gap: '8px'
                    }}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.1, duration: 0.4, ease: TOKENS.MOTION.ease }}>
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: getDomainColor(selectedDomain.id) }} />
                      <span className="text-on-glass" style={{ color: TOKENS.colors.textSecondary, fontSize: '14px', lineHeight: '1.5', textShadow: '0 1px 1px rgba(0,0,0,0.35)' }}>{effect}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: TOKENS.colors.textTertiary }}>48-Hour Trend</h4>
                <div className="p-4 rounded-lg" style={{ background: 'rgba(0, 0, 0, 0.2)', border: `1px solid ${TOKENS.TAHOE.DARK.paneBorder}` }}>
                  <svg width="100%" height="60" className="overflow-visible">
                    <defs>
                      <linearGradient id={`sparkline-${selectedDomain.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={getDomainColor(selectedDomain.id)} stopOpacity="0.7" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0)" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {(() => {
                      const data = selectedDomain.sparkline; const width = 450; const height = 60; const padding = 4;
                      const minValue = Math.min(...data); const maxValue = Math.max(...data); const range = maxValue - minValue || 0.1;
                      const points = data.map((value, i) => {
                        const x = (i / (data.length - 1)) * width;
                        const y = height - padding - ((value - minValue) / range) * (height - padding * 2);
                        return `${x},${y}`;
                      }).join(' ');
                      const pathD = `M ${points}`; const areaD = `M ${points} L ${width},${height} L 0,${height} Z`;
                      return (<>
                        <motion.path d={areaD} fill={`url(#sparkline-${selectedDomain.id})`} className="trend-area" initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ duration: 0.6, delay: 0.5 }} />
                        <motion.path d={pathD} fill="none" stroke={getDomainColor(selectedDomain.id)} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, delay: 0.6, ease: TOKENS.MOTION.ease }} />
                      </>);
                    })()}
                  </svg>
                </div>
              </div>
              <div className="text-xs" style={{ color: TOKENS.colors.textTertiary, textShadow: '0 1px 1px rgba(0,0,0,0.35)' }}>
                Updated {new Date(selectedDomain.last_updated_iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .text-on-glass { text-shadow: 0 1px 1px rgba(0,0,0,0.35); }
        
        @media (prefers-reduced-motion: reduce) { 
          *, *::before, *::after {
            animation: none !important;
            transition: none !important;
          }
        }
        
        .orb, .hover-capsule { min-width: 44px; min-height: 44px; }
        
        svg { shape-rendering: geometricPrecision; }
        
        .orb:focus-visible { 
          outline: none; 
          filter: drop-shadow(0 0 0 1px ${TOKENS.colors.textPrimary}) drop-shadow(0 0 0 2px currentColor) drop-shadow(0 0 12px currentColor) !important; 
        }
      `}</style>
    </motion.section>
  );
};

export default MacroEquilibriumGrid;