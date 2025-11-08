import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, X, TrendingUp, TrendingDown, Minus, ArrowRight } from 'lucide-react';
import LyraLogo from '../core/LyraLogo';

// ============================================================================
// HORIZON CONSTELLATION - LIVING MACRO FIELD V6.a
// Calm field + depth offset with Apple-grade restraint
// ============================================================================

const TOKENS = {
  HORIZON: {
    glassBg: 'rgba(10,12,20,0.55)',
    glassBorder: 'rgba(255,255,255,0.06)',
    glassInner: 'rgba(255,255,255,0.03)',
    panelShadow: '0 0 60px rgba(255,255,255,0.04)',
    blurPanel: 'blur(30px)',
    blurChip: 'blur(20px)',
    easing: [0.32, 0.72, 0, 1],
    t_hover: 0.25,
    t_tooltip: 0.35,
    t_drawer: 0.6,
    t_pulse: 4,
    t_breathe: 6,
    bgCenter: 'rgba(10,12,20,0.88)',
    bgEdge: 'rgba(10,12,20,0.56)',
    AMBIENT: {
      centerFog: 'rgba(255,255,255,0.04)',
      sceneGlowRates: 'rgba(142,162,255,0.06)',
      sceneGlowGrowth: 'rgba(143,242,201,0.06)',
      sceneGlowFX: 'rgba(143,232,255,0.06)',
      sceneGlowGeopolitics: 'rgba(255,201,139,0.06)'
    }
  },
  MOTION: {
    ease: 'cubic-bezier(0.32,0.72,0,1)',
    t_hover: '250ms',
    t_capsule: '350ms',
    t_morph: '600ms',
    t_pulse: '4000ms',
    t_breathe: '6000ms'
  },
  GLASS: {
    cardBg: 'rgba(20,22,30,0.45)',
    panelBg: 'rgba(10,12,20,0.55)',
    border: 'rgba(255,255,255,0.06)',
    inner: 'rgba(255,255,255,0.03)',
    shadow: '0 0 60px rgba(255,255,255,0.04)'
  },
  MACRO: {
    rates: {
      core: '#8EA2FF',
      halo: 'rgba(142,162,255,0.45)',
      text: '#BFC9FF',
      sceneGlow: 'rgba(142,162,255,0.06)',
      dotColor: '#BFC9FF'
    },
    fx: {
      core: '#8FE8FF',
      halo: 'rgba(143,232,255,0.45)',
      text: '#C5F2FF',
      sceneGlow: 'rgba(143,232,255,0.06)',
      dotColor: '#C5F2FF'
    },
    growth: {
      core: '#8FF2C9',
      halo: 'rgba(143,242,201,0.45)',
      text: '#C8F7E6',
      sceneGlow: 'rgba(143,242,201,0.06)',
      dotColor: '#C8F7E6'
    },
    geopolitics: {
      core: '#FFC98B',
      halo: 'rgba(255,201,139,0.45)',
      text: '#FFE2BF',
      sceneGlow: 'rgba(255,201,139,0.06)',
      dotColor: '#FFE2BF'
    }
  },
  DEPTH: {
    near: { zGlow: 1.00, zBlur: 18 },
    mid: { zGlow: 0.88, zBlur: 20 },
    far: { zGlow: 0.76, zBlur: 22 }
  },
  colors: {
    textPrimary: "rgba(255,255,255,0.92)",
    textSecondary: "rgba(255,255,255,0.72)",
    textTertiary: "rgba(255,255,255,0.60)",
    labelDefault: "rgba(255,255,255,0.85)",
    labelDominant: "rgba(255,255,255,0.92)"
  }
};

// Golden-angle distribution
const ANGLES = {
  rates: 22.5,
  fx: 160.0,
  growth: 297.5,
  geopolitics: 75.0
};

// Expanded orbit radii (~12-15% increase for breathing room)
const BASE_RADII = {
  rates: 0.36,        // was 0.32
  fx: 0.40,           // was 0.36
  growth: 0.38,       // was 0.34
  geopolitics: 0.34   // was 0.30
};

// Z-depth assignments
const DEPTH_MAP = {
  growth: 'near',       // feels closer
  rates: 'mid',
  fx: 'mid',
  geopolitics: 'far'    // slightly farther
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
  const constellationRef = useRef(null);
  const [hoveredDomain, setHoveredDomain] = useState(null);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const [capsuleBounds, setCapsuleBounds] = useState(null);
  const [isMorphing, setIsMorphing] = useState(false);
  const [isLowPower, setIsLowPower] = useState(false);
  const [constellationShift, setConstellationShift] = useState(0);
  const [orbitScale, setOrbitScale] = useState(1.0);

  const domains = MOCK_DOMAINS;

  const headerSafe = 64;
  const footerH = 84;
  const footerBleed = 24;
  const haloBleed = 18;
  const minClear = 24;
  const safeBottom = footerH + footerBleed + haloBleed + minClear;

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
    
    const biasStr = balanceBias > 0 ? `(+${(balanceBias * 0.5).toFixed(2)})` : '';
    return `Equilibrium leaning toward ${dominantDriver.charAt(0).toUpperCase() + dominantDriver.slice(1)} ${biasStr}`;
  }, [domains, dominantDriver, balanceBias]);

  const balanceAngle = useMemo(() => {
    if (dominantDriver === "balanced") return 0;
    return ANGLES[dominantDriver] || 0;
  }, [dominantDriver]);

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
        setDimensions({ width: rect.width, height: 600 });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const { cx, cy, orbitBaseRadius } = useMemo(() => {
    const safeW = dimensions.width;
    const safeH = dimensions.height - safeBottom - headerSafe;
    const centerX = dimensions.width / 2;
    const centerY = headerSafe + safeH / 2 - safeH * 0.025;
    
    const baseRadius = Math.min(safeW, safeH) * 0.34;
    const shortH = window.innerHeight <= 820;
    const radius = baseRadius * (shortH ? 0.92 : 1.00) * orbitScale;
    
    return { cx: centerX, cy: centerY, orbitBaseRadius: radius };
  }, [dimensions, safeBottom, headerSafe, orbitScale]);

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

  useEffect(() => {
    if (!footerRef.current || !constellationRef.current) return;

    const checkCollision = () => {
      const footerRect = footerRef.current.getBoundingClientRect();
      const footerTop = footerRect.top;
      
      const growthDomain = domains.find(d => d.id === 'growth');
      const growthPos = getOrbPosition('growth', growthDomain.strength);
      const growthBottom = growthPos.y + growthPos.radius + haloBleed;
      
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return;
      
      const absoluteGrowthBottom = containerRect.top + growthBottom;
      const gap = footerTop - absoluteGrowthBottom;
      
      if (gap < minClear) {
        const dy = minClear - gap;
        setConstellationShift(-dy);
        
        if (dy > 16 || window.innerHeight <= 820) {
          setOrbitScale(0.96);
        } else {
          setOrbitScale(1.0);
        }
      } else {
        setConstellationShift(0);
        setOrbitScale(1.0);
      }
    };

    checkCollision();
    window.addEventListener('resize', checkCollision);
    return () => window.removeEventListener('resize', checkCollision);
  }, [dimensions, getOrbPosition, domains]);

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
    }, TOKENS.HORIZON.t_drawer * 1000);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setIsMorphing(true);
    setTimeout(() => {
      setSelectedDomain(null);
      setCapsuleBounds(null);
      setIsMorphing(false);
    }, TOKENS.HORIZON.t_drawer * 1000);
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

  const getBlur = useCallback((type) => {
    if (isLowPower) return type === 'panel' ? 'blur(18px)' : 'blur(12px)';
    return type === 'panel' ? TOKENS.HORIZON.blurPanel : TOKENS.HORIZON.blurChip;
  }, [isLowPower]);

  return (
    <motion.section variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} aria-label="Horizon Constellation">
      <div className="flex items-center justify-between mb-6 pl-2">
        <div className="flex items-center space-x-3">
          <Globe className="w-6 h-6 text-blue-300" />
          <div>
            <h2 className="font-bold" style={{ fontSize: '16px', lineHeight: '22px', letterSpacing: '0.01em', color: TOKENS.colors.textPrimary }}>Macro Equilibrium Grid</h2>
            <p style={{ fontSize: '13px', color: TOKENS.colors.textTertiary }}>Living constellation of macro forces.</p>
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

      <div 
        ref={containerRef} 
        className="grid-wrapper relative w-full overflow-hidden" 
        data-dominant={dominantDriver}
        style={{
          height: '600px',
          background: `radial-gradient(900px circle at 50% 48%, ${TOKENS.HORIZON.AMBIENT.centerFog}, transparent 72%), linear-gradient(to bottom, rgba(255,255,255,0.02), transparent)`,
          border: '1px solid rgba(255,255,255,0.04)',
          borderRadius: '24px',
          paddingTop: `${headerSafe}px`,
          paddingBottom: `${safeBottom}px`,
          '--angle': `${balanceAngle}deg`,
          '--bias': balanceBias
        }}
      >
        
        {/* Unified calm ambient glow */}
        <motion.div 
          className="scene-ambient"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            borderRadius: '24px',
            overflow: 'hidden'
          }}
          animate={{
            background: dominantDriver === 'balanced' 
              ? 'radial-gradient(1100px circle at 50% 46%, rgba(255,255,255,0.00), transparent 74%)'
              : `radial-gradient(1100px circle at 50% 46%, ${TOKENS.MACRO[dominantDriver].sceneGlow}, transparent 74%)`
          }}
          transition={{ duration: 0.5, ease: TOKENS.HORIZON.easing }}
        />

        {/* Ultra-subtle grain (calm, no banding) */}
        <div 
          className="grain-overlay"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="140" height="140"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23n)" opacity="0.03"/></svg>')`,
            mixBlendMode: 'soft-light',
            opacity: 0.08,
            filter: 'blur(64px)'
          }}
        />
        
        <div ref={constellationRef} className="constellation-layer" style={{ 
          position: 'absolute', 
          inset: 0, 
          transform: `translateY(${constellationShift}px)`, 
          transition: shouldReduceMotion ? 'none' : 'transform 0.4s cubic-bezier(0.32, 0.72, 0, 1)',
          willChange: 'transform'
        }}>
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
            zIndex: 2,
            transition: shouldReduceMotion ? 'none' : 'all 0.4s cubic-bezier(0.32, 0.72, 0, 1)',
            willChange: 'width, height'
          }} aria-hidden="true" />

          {/* Nucleus Carrier */}
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
            transition={{ duration: 0.5, ease: TOKENS.HORIZON.easing }}
          >
            <motion.div className="nucleus" style={{
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
              boxShadow: '0 0 80px rgba(160,180,255,0.12), inset 0 0 0 1px rgba(255,255,255,0.07)',
              pointerEvents: 'none'
            }}
            animate={shouldReduceMotion ? {} : {
              scale: [1, 1.08, 1]
            }}
            transition={{
              duration: TOKENS.HORIZON.t_breathe,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            aria-hidden="true" />

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
                transition={{ duration: 0.5, ease: TOKENS.HORIZON.easing }}
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
                  transition={{ duration: 0.5, ease: TOKENS.HORIZON.easing }}
                />
              );
            })}
          </motion.div>

          {/* SVG Layer */}
          <svg width={dimensions.width} height={dimensions.height} className="absolute inset-0" style={{ overflow: 'visible', zIndex: 2 }}>
            <defs>
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
              <linearGradient id="growth-halo-mask" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="white" stopOpacity="1" />
                <stop offset="70%" stopColor="white" stopOpacity="0.6" />
                <stop offset="100%" stopColor="white" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            {/* Connections with depth falloff */}
            <g style={{ zIndex: 2 }}>
              {connections.map((conn, i) => {
                const fromDomain = domains.find(d => d.id === conn.from);
                const toDomain = domains.find(d => d.id === conn.to);
                const fromPos = getOrbPosition(conn.from, fromDomain.strength);
                const toPos = getOrbPosition(conn.to, toDomain.strength);
                const isAdjacent = hoveredDomain === conn.from || hoveredDomain === conn.to;
                const strokeWidth = 1.5 + (conn.relationship * 1.5);
                const pathD = `M ${fromPos.x},${fromPos.y} Q ${cx},${cy} ${toPos.x},${toPos.y}`;
                
                // Depth-based opacity adjustment
                let baseOpacity = 0.65;
                if (conn.from === 'geopolitics') baseOpacity = 0.6;
                if (conn.from === 'growth') baseOpacity = 0.7;
                
                return (
                  <motion.path 
                    key={`connection-${i}`} 
                    d={pathD} 
                    stroke={`url(#conn-grad-${i})`} 
                    strokeWidth={strokeWidth} 
                    strokeLinecap="round" 
                    fill="none"
                    className={`connection ${isAdjacent ? 'adjacent' : 'other'}`}
                    animate={{ 
                      opacity: isAdjacent ? 1 : (hoveredDomain ? 0.35 : baseOpacity),
                      strokeDashoffset: shouldReduceMotion ? 0 : [140, -320]
                    }}
                    transition={{ 
                      opacity: { duration: TOKENS.HORIZON.t_hover, ease: TOKENS.HORIZON.easing },
                      strokeDashoffset: { 
                        duration: TOKENS.HORIZON.t_pulse, 
                        repeat: Infinity, 
                        ease: "linear" 
                      }
                    }}
                    style={{ 
                      filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.35))',
                      strokeDasharray: '140 320'
                    }} 
                  />
                );
              })}
            </g>

            {/* Orbs with depth layering */}
            <g style={{ zIndex: 3 }}>
              {domains.map((domain) => {
                const pos = getOrbPosition(domain.id, domain.strength);
                const color = getDomainColor(domain.id);
                const isHovered = hoveredDomain === domain.id;
                const isGrowth = domain.id === 'growth';
                const confidence = domain.confidence_pct / 100;
                const depth = getDepthParams(domain.id);
                const glowRadius = (90 * depth.zGlow) + (60 * confidence);

                return (
                  <g key={domain.id}>
                    <motion.circle 
                      cx={pos.x} 
                      cy={pos.y} 
                      r={pos.radius + 60} 
                      fill={color}
                      opacity={isGrowth ? "0.06" : "0.08"}
                      animate={{ 
                        opacity: isHovered ? (isGrowth ? 0.09 : 0.12) : (isGrowth ? 0.06 : 0.08),
                        r: pos.radius + glowRadius
                      }}
                      transition={{ duration: TOKENS.HORIZON.t_hover, ease: TOKENS.HORIZON.easing }}
                      style={{ 
                        filter: `blur(${depth.zBlur}px)`, 
                        pointerEvents: 'none',
                        mask: isGrowth ? 'url(#growth-halo-mask)' : 'none',
                        WebkitMask: isGrowth ? 'url(#growth-halo-mask)' : 'none'
                      }} 
                    />
                    
                    <motion.circle 
                      cx={pos.x} 
                      cy={pos.y} 
                      r={pos.radius} 
                      fill={`url(#nucleus-${domain.id})`}
                      className="orb cursor-pointer" 
                      data-key={domain.id}
                      style={{ 
                        filter: isHovered 
                          ? `drop-shadow(0 8px 28px rgba(0,0,0,0.35)) drop-shadow(0 0 ${glowRadius * 1.5}px ${color})`
                          : `drop-shadow(0 8px 28px rgba(0,0,0,0.35)) drop-shadow(0 0 ${glowRadius}px ${color})`,
                        transformOrigin: `${pos.x}px ${pos.y}px`, 
                        pointerEvents: 'all', 
                        color: color,
                        opacity: isGrowth ? 0.78 : 1
                      }}
                      animate={shouldReduceMotion ? {} : { 
                        scale: isHovered ? 1.04 : [1, 1.03, 1]
                      }}
                      transition={shouldReduceMotion ? {} : {
                        scale: isHovered 
                          ? { duration: TOKENS.HORIZON.t_hover, ease: TOKENS.HORIZON.easing } 
                          : { duration: TOKENS.HORIZON.t_breathe, repeat: Infinity, ease: "easeInOut" }
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
                      cx={pos.x} 
                      cy={pos.y} 
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

          {/* Labels with hierarchy */}
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
                  border: `1px solid ${TOKENS.HORIZON.glassBorder}`,
                  borderRadius: '12px',
                  padding: '6px 10px',
                  fontWeight: 600,
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
                transition={{ duration: TOKENS.HORIZON.t_hover, ease: TOKENS.HORIZON.easing }}
              >
                {domain.id.toUpperCase()}
              </motion.div>
            );
          })}
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
                  return pos.y - 50;
                })(),
                transformOrigin: 'center left', 
                pointerEvents: 'auto' 
              }}
              initial={{ opacity: 0, y: 6 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: TOKENS.HORIZON.t_tooltip, ease: TOKENS.HORIZON.easing }}>
              {(() => {
                const domain = domains.find(d => d.id === hoveredDomain);
                if (!domain) return null;
                return (
                  <div className="cursor-pointer hover-capsule" onClick={() => handleOpenDrawer(domain)} style={{
                    backdropFilter: getBlur('chip'), 
                    WebkitBackdropFilter: getBlur('chip'), 
                    background: TOKENS.GLASS.cardBg,
                    border: `1px solid ${TOKENS.GLASS.border}`, 
                    boxShadow: TOKENS.GLASS.shadow,
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

        {/* Balance Footer */}
        <div ref={footerRef} className="balance-footer" style={{
          position: 'absolute',
          left: '32px',
          right: '32px',
          bottom: '22px',
          height: `${footerH}px`,
          borderRadius: '18px',
          padding: '14px 16px 16px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          backdropFilter: getBlur('chip'),
          WebkitBackdropFilter: getBlur('chip'),
          background: TOKENS.GLASS.cardBg,
          border: `1px solid ${TOKENS.GLASS.border}`,
          boxShadow: TOKENS.GLASS.shadow,
          zIndex: 1,
          pointerEvents: 'none'
        }}>
          <div className="footer-content" style={{ display: 'contents', pointerEvents: 'auto' }}>
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
                  transition={{ duration: 0.5, ease: TOKENS.HORIZON.easing }}
                />
              </div>
            </div>
            
            <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <span className="text-on-glass" style={{ color: TOKENS.colors.textSecondary, fontSize: '14px', lineHeight: '20px', textShadow: '0 1px 1px rgba(0,0,0,0.35)' }}>
                {globalSummary}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Morph overlay */}
      <AnimatePresence>
        {isMorphing && capsuleBounds && (
          <motion.div className="fixed z-45" style={{
            left: capsuleBounds.left, 
            top: capsuleBounds.top, 
            width: capsuleBounds.width, 
            height: capsuleBounds.height,
            backdropFilter: getBlur('panel'), 
            WebkitBackdropFilter: getBlur('panel'), 
            background: TOKENS.GLASS.panelBg,
            border: `1px solid ${TOKENS.GLASS.border}`, 
            boxShadow: TOKENS.GLASS.shadow, 
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
          transition={{ duration: TOKENS.HORIZON.t_drawer, ease: TOKENS.HORIZON.easing }} />
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
            transition={{ duration: TOKENS.HORIZON.t_drawer, ease: TOKENS.HORIZON.easing }} 
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
            backdropFilter: getBlur('panel'), 
            WebkitBackdropFilter: getBlur('panel'),
            background: TOKENS.GLASS.panelBg, 
            border: `1px solid ${TOKENS.GLASS.border}`,
            boxShadow: TOKENS.GLASS.shadow, 
            borderRadius: '20px'
          }}
          initial={{ x: '100%', opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          exit={{ x: '100%', opacity: 0 }}
          transition={{ duration: TOKENS.HORIZON.t_drawer, ease: TOKENS.HORIZON.easing }} 
          onClick={(e) => e.stopPropagation()}>
            
            <div className="sticky top-0 z-10 p-6 border-b" style={{ background: TOKENS.GLASS.panelBg, borderColor: TOKENS.GLASS.border, backdropFilter: getBlur('chip') }}>
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
                      initial={{ strokeDashoffset: 176 }} animate={{ strokeDashoffset: 176 - (176 * selectedDomain.confidence_pct / 100) }} transition={{ duration: 0.7, ease: TOKENS.HORIZON.easing }} />
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
                      backdropFilter: getBlur('chip'), WebkitBackdropFilter: getBlur('chip'), background: TOKENS.GLASS.cardBg,
                      border: `1px solid ${TOKENS.GLASS.border}`, boxShadow: `inset 0 0 0 1px ${TOKENS.GLASS.inner}`,
                      borderRadius: '12px', padding: '10px 12px', display: 'flex', alignItems: 'start', gap: '8px'
                    }}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.1, duration: 0.4, ease: TOKENS.HORIZON.easing }}>
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: getDomainColor(selectedDomain.id) }} />
                      <span className="text-on-glass" style={{ color: TOKENS.colors.textSecondary, fontSize: '14px', lineHeight: '1.5', textShadow: '0 1px 1px rgba(0,0,0,0.35)' }}>{effect}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: TOKENS.colors.textTertiary }}>48-Hour Trend</h4>
                <div className="p-4 rounded-lg" style={{ background: 'rgba(0, 0, 0, 0.2)', border: `1px solid ${TOKENS.GLASS.border}` }}>
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
                        <motion.path d={pathD} fill="none" stroke={getDomainColor(selectedDomain.id)} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, delay: 0.6, ease: TOKENS.HORIZON.easing }} />
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
        .constellation-layer { will-change: transform; }
        
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