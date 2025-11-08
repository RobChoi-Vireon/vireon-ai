
import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, X, TrendingUp, TrendingDown, Minus, ArrowRight, Info } from 'lucide-react';
import LyraLogo from '../core/LyraLogo';

// ============================================================================
// MACRO EQUILIBRIUM GRID — OS HORIZON V1.9
// Liquid Silk / Halo Motion aesthetic with living depth & serenity
// ============================================================================

const TOKENS = {
  HORIZON: {
    glassBg: 'rgba(10,12,20,0.70)',
    glassBorder: 'rgba(255,255,255,0.08)',
    glassInner: 'rgba(255,255,255,0.04)',
    panelShadow: '0 0 80px rgba(0,0,0,0.4), 0 0 40px rgba(255,255,255,0.06)',
    blurPanel: 'blur(20px)',
    blurChip: 'blur(16px)',
    // Apple motion timing (in seconds for framer-motion)
    easing: [0.32, 0.72, 0, 1],
    overshoot: [0.34, 1.56, 0.64, 1],
    t_hover: 0.12,
    t_bloom: 0.25, // NEW - taken from former TOKENS.MOTION.t_bloom
    t_tooltip: 0.25, // Replaces former TOKENS.MOTION.t_capsule
    t_drawer: 0.45,
    t_pulse: 4,
    t_breathe: 6,
    t_drift: 8,
    bgCenter: 'rgba(10,12,20,0.92)',
    bgEdge: 'rgba(10,12,20,0.68)'
  },
  // OS Horizon Spectral Glow Logic
  MACRO: {
    fx: {
      core: '#7AD7F0',
      halo: 'rgba(122,215,240,0.40)',
      text: '#B8EEFF',
      sceneGlow: 'rgba(122,215,240,0.08)',
      bloom: 'rgba(122,215,240,0.15)',
      zDepth: 1.0
    },
    growth: {
      core: '#B4F7C0',
      halo: 'rgba(180,247,192,0.40)',
      text: '#D4FFDE',
      sceneGlow: 'rgba(180,247,192,0.08)',
      bloom: 'rgba(180,247,192,0.15)',
      zDepth: 0.8
    },
    geopolitics: {
      core: '#FFD37A',
      halo: 'rgba(255,211,122,0.40)',
      text: '#FFE8B8',
      sceneGlow: 'rgba(255,211,122,0.08)',
      bloom: 'rgba(255,211,122,0.15)',
      zDepth: 1.2
    },
    rates: {
      core: '#C0A6FF',
      halo: 'rgba(192,166,255,0.40)',
      text: '#DECFFF',
      sceneGlow: 'rgba(192,166,255,0.08)',
      bloom: 'rgba(192,166,255,0.15)',
      zDepth: 0.9
    },
    liquidity: {
      core: '#89CFFF',
      halo: 'rgba(137,207,255,0.40)',
      text: '#B8E2FF',
      sceneGlow: 'rgba(137,207,255,0.08)',
      bloom: 'rgba(137,207,255,0.15)',
      zDepth: 1.1
    }
  },
  colors: {
    textPrimary: "rgba(255,255,255,0.95)",
    textSecondary: "rgba(255,255,255,0.80)",
    textTertiary: "rgba(255,255,255,0.60)"
  }
};

// Golden-angle distribution (137.5° spacing)
const ANGLES = {
  rates: 22.5,
  fx: 160.0,
  growth: 297.5,
  geopolitics: 75.0
};

// Organic radius variation with Z-depth parallax
const RADII = {
  rates: 0.31,
  fx: 0.35,
  growth: 0.33,
  geopolitics: 0.29
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
  const [showEquilibriumTip, setShowEquilibriumTip] = useState(false);
  const [haloAnimating, setHaloAnimating] = useState(false);

  // Living Equilibrium Field - hue shift animation
  const [fieldHue, setFieldHue] = useState(220);

  const domains = MOCK_DOMAINS;

  // Safe area constants
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
      return `Equilibrium Balanced — Rates ${ratesDomain.posture}; FX ${fxDomain.posture}; Growth ${growthDomain.posture}; Geopolitics ${geoDomain.posture}.`;
    }
    
    return `Equilibrium leaning toward ${dominantDriver.charAt(0).toUpperCase() + dominantDriver.slice(1)} — ${dominantDriver === 'rates' ? ratesDomain.posture : dominantDriver === 'fx' ? fxDomain.posture : dominantDriver === 'growth' ? growthDomain.posture : geoDomain.posture}.`;
  }, [domains, dominantDriver]);

  const balanceAngle = useMemo(() => {
    if (dominantDriver === "balanced") return 0;
    return ANGLES[dominantDriver] || 0;
  }, [dominantDriver]);

  // Living Equilibrium Field - subtle hue shift (1-2°/s)
  useEffect(() => {
    if (shouldReduceMotion) return;
    
    const interval = setInterval(() => {
      setFieldHue(prev => {
        const next = prev + 0.5;
        if (next > 260) return 220;
        return next;
      });
    }, 500);
    
    return () => clearInterval(interval);
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
    const offsetMagnitude = balanceBias * 12;
    return {
      x: Math.sin(angleRad) * offsetMagnitude,
      y: -Math.cos(angleRad) * offsetMagnitude
    };
  }, [balanceAngle, balanceBias]);

  // Multi-depth constellation with Z-parallax and micro-drift
  const getOrbPosition = useCallback((domainId, strength, time = 0) => {
    const angle = ANGLES[domainId] * (Math.PI / 180);
    const baseSize = 40;
    const sizeRange = 20;
    const diameter = baseSize + (strength * sizeRange);
    const radius = diameter / 2;
    
    const baseRadiusFactor = RADII[domainId];
    const strengthFactor = 0.9 + (strength * 0.2);
    const zDepth = TOKENS.MACRO[domainId]?.zDepth || 1.0;
    const adjustedRadius = orbitBaseRadius * baseRadiusFactor * strengthFactor * zDepth;
    
    // Micro-drift motion (≤2px)
    const driftPhase = (ANGLES[domainId] / 360) * Math.PI * 2;
    const driftX = Math.sin(time + driftPhase) * 2;
    const driftY = Math.cos(time + driftPhase * 1.3) * 2;
    
    const orbX = cx + adjustedRadius * Math.cos(angle) + driftX;
    const orbY = cy + adjustedRadius * Math.sin(angle) + driftY;
    
    return { x: orbX, y: orbY, radius, diameter, zDepth };
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
  const getDomainBloom = (domainId) => TOKENS.MACRO[domainId]?.bloom || TOKENS.MACRO.rates.bloom;

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
    setHaloAnimating(true);
    setIsMorphing(true);
    setTimeout(() => {
      setSelectedDomain(domain);
      setHaloAnimating(false);
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
    if (isLowPower) return type === 'panel' ? 'blur(16px)' : 'blur(12px)';
    return type === 'panel' ? TOKENS.HORIZON.blurPanel : TOKENS.HORIZON.blurChip;
  }, [isLowPower]);

  // Micro-drift animation time
  const [driftTime, setDriftTime] = useState(0);
  useEffect(() => {
    if (shouldReduceMotion) return;
    
    let rafId;
    let lastTime = Date.now();
    
    const animate = () => {
      const now = Date.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      
      setDriftTime(prev => prev + delta * 0.5);
      rafId = requestAnimationFrame(animate);
    };
    
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [shouldReduceMotion]);

  return (
    <motion.section variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} aria-label="Horizon Constellation">
      <div className="flex items-center justify-between mb-6 pl-2">
        <div className="flex items-center space-x-3">
          <Globe className="w-6 h-6 text-blue-300" />
          <div>
            <h2 className="font-bold" style={{ fontSize: '18px', lineHeight: '24px', letterSpacing: '-0.01em', fontWeight: 600, color: TOKENS.colors.textPrimary }}>Macro Equilibrium Grid</h2>
            <p style={{ fontSize: '13px', color: TOKENS.colors.textTertiary, letterSpacing: '0.01em' }}>Living constellation of macro forces.</p>
          </div>
        </div>
        <div className="powered-by-lyra cursor-pointer" style={{ opacity: 0.6 }}>
          <div className="flex items-center space-x-2 px-4 py-2" style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', border: '1px solid rgba(255,255,255,0.06)', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)', borderRadius: '12px' }}>
            <span className="text-xs font-medium" style={{ color: TOKENS.colors.textTertiary, letterSpacing: '0.25px' }}>Powered by</span>
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
          background: `linear-gradient(180deg, 
            hsl(${fieldHue}, 25%, 8%) 0%, 
            hsl(${fieldHue + 10}, 22%, 10%) 50%, 
            hsl(${fieldHue + 20}, 18%, 9%) 100%)`,
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '24px',
          paddingTop: `${headerSafe}px`,
          paddingBottom: `${safeBottom}px`,
          transition: shouldReduceMotion ? 'none' : 'background 2s ease-in-out'
        }}>
        
        {/* Scene Ambient with additive diffusion */}
        <motion.div 
          className="scene-ambient"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            borderRadius: '24px',
            overflow: 'hidden',
            mixBlendMode: 'screen',
            opacity: 0.4
          }}
          animate={{
            background: dominantDriver === 'balanced' 
              ? 'radial-gradient(900px circle at 50% 46%, rgba(255,255,255,0.02), transparent 70%)'
              : `radial-gradient(900px circle at 50% 46%, ${TOKENS.MACRO[dominantDriver].sceneGlow}, transparent 70%)`
          }}
          transition={{ duration: 1.5, ease: TOKENS.HORIZON.easing }}
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
            opacity: 0.25,
            filter: 'blur(0.5px)',
            pointerEvents: 'none',
            zIndex: 2,
            transition: shouldReduceMotion ? 'none' : 'all 0.4s cubic-bezier(0.32, 0.72, 0, 1)',
            willChange: 'width, height'
          }} aria-hidden="true" />

          {/* Breathing Nucleus with tilt */}
          <motion.div 
            className="nucleus-container" 
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
            transition={{ duration: 0.8, ease: TOKENS.HORIZON.easing }}
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
              background: 'rgba(210,225,255,0.12)',
              boxShadow: '0 0 80px rgba(160,180,255,0.15), inset 0 0 0 1px rgba(255,255,255,0.08)',
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

            {/* Nucleus rays */}
            {domains.map((domain) => {
              const angle = ANGLES[domain.id];
              const isDominant = domain.id === dominantDriver;
              const rayAlpha = isDominant ? 0.5 : 0.15;
              
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
                  transition={{ duration: 0.8, ease: TOKENS.HORIZON.easing }}
                />
              );
            })}
          </motion.div>

          {/* SVG Layer */}
          <svg width={dimensions.width} height={dimensions.height} className="absolute inset-0" style={{ overflow: 'visible', zIndex: 2 }}>
            <defs>
              {domains.map((domain) => (
                <React.Fragment key={`defs-${domain.id}`}>
                  <radialGradient id={`nucleus-${domain.id}`}>
                    <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
                    <stop offset="45%" stopColor={getDomainColor(domain.id)} stopOpacity="0.85" />
                    <stop offset="70%" stopColor="rgba(255,255,255,0)" stopOpacity="0" />
                  </radialGradient>
                  <filter id={`bloom-${domain.id}`} x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="24" result="blur" />
                    <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.4 0" result="bloom" />
                    <feMerge>
                      <feMergeNode in="bloom" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </React.Fragment>
              ))}
              {connections.map((conn, i) => (
                <linearGradient key={`conn-grad-${i}`} id={`conn-grad-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={getDomainHalo(conn.from)} />
                  <stop offset="100%" stopColor={getDomainHalo(conn.to)} />
                </linearGradient>
              ))}
            </defs>

            {/* Energy Threads */}
            <g style={{ zIndex: 2 }}>
              {connections.map((conn, i) => {
                const fromDomain = domains.find(d => d.id === conn.from);
                const toDomain = domains.find(d => d.id === conn.to);
                const fromPos = getOrbPosition(conn.from, fromDomain.strength, driftTime);
                const toPos = getOrbPosition(conn.to, toDomain.strength, driftTime);
                const isAdjacent = hoveredDomain === conn.from || hoveredDomain === conn.to;
                const strokeWidth = 1.5 + (conn.relationship * 1.5);
                const pathD = `M ${fromPos.x},${fromPos.y} Q ${cx},${cy} ${toPos.x},${toPos.y}`;
                
                return (
                  <motion.path 
                    key={`connection-${i}`} 
                    d={pathD} 
                    stroke={`url(#conn-grad-${i})`} 
                    strokeWidth={strokeWidth} 
                    strokeLinecap="round" 
                    fill="none"
                    animate={{ 
                      opacity: isAdjacent ? 0.85 : (hoveredDomain ? 0.25 : 0.55),
                      strokeDashoffset: shouldReduceMotion ? 0 : [120, -300]
                    }}
                    transition={{ 
                      opacity: { duration: TOKENS.HORIZON.t_bloom, ease: TOKENS.HORIZON.easing },
                      strokeDashoffset: { 
                        duration: TOKENS.HORIZON.t_pulse, 
                        repeat: Infinity, 
                        ease: "linear" 
                      }
                    }}
                    style={{ 
                      filter: 'drop-shadow(0 2px 12px rgba(0,0,0,0.4))',
                      strokeDasharray: '120 300'
                    }} 
                  />
                );
              })}
            </g>

            {/* Orbs with subsurface diffusion */}
            <g style={{ zIndex: 3 }}>
              {domains.map((domain) => {
                const pos = getOrbPosition(domain.id, domain.strength, driftTime);
                const color = getDomainColor(domain.id);
                const bloom = getDomainBloom(domain.id);
                const isHovered = hoveredDomain === domain.id;

                return (
                  <g key={domain.id}>
                    {/* Subsurface light diffusion */}
                    <motion.circle 
                      cx={pos.x} 
                      cy={pos.y} 
                      r={pos.radius + 40} 
                      fill={bloom}
                      style={{ 
                        filter: 'blur(24px)', 
                        pointerEvents: 'none'
                      }}
                      animate={{
                        opacity: 0.4,
                        scale: isHovered ? 1.05 : 1
                      }}
                      transition={{ duration: TOKENS.HORIZON.t_hover, ease: TOKENS.HORIZON.easing }}
                    />
                    
                    {/* Hover bloom expansion */}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.circle 
                          cx={pos.x} 
                          cy={pos.y} 
                          r={pos.radius + 5} 
                          fill={bloom}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 0.6, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: TOKENS.HORIZON.t_hover, delay: TOKENS.HORIZON.t_hover, ease: TOKENS.HORIZON.easing }}
                          style={{ 
                            filter: 'blur(16px)', 
                            pointerEvents: 'none'
                          }}
                        />
                      )}
                    </AnimatePresence>
                    
                    {/* Main orb */}
                    <motion.circle 
                      cx={pos.x} 
                      cy={pos.y} 
                      r={pos.radius} 
                      fill={`url(#nucleus-${domain.id})`}
                      className="orb cursor-pointer" 
                      data-key={domain.id}
                      style={{ 
                        filter: `url(#bloom-${domain.id})`,
                        transformOrigin: `${pos.x}px ${pos.y}px`, 
                        pointerEvents: 'all', 
                        color: color
                      }}
                      animate={shouldReduceMotion ? {} : { 
                        scale: isHovered ? 1.04 : [1, 1.03, 1]
                      }}
                      transition={shouldReduceMotion ? {} : {
                        scale: isHovered 
                          ? { duration: TOKENS.HORIZON.t_hover, ease: TOKENS.HORIZON.overshoot } 
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
                    
                    {/* Stroke ring */}
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

          {/* Glass Tag Labels */}
          {domains.map((domain) => {
            const orbPos = getOrbPosition(domain.id, domain.strength, driftTime);
            const labelPos = getLabelPosition(orbPos.x, orbPos.y, orbPos.radius);
            const isHovered = hoveredDomain === domain.id;
            
            return (
              <motion.div 
                key={`label-${domain.id}`} 
                className="orb-label" 
                style={{
                  position: 'absolute',
                  left: `${labelPos.x}px`,
                  top: `${labelPos.y}px`,
                  transform: 'translate(-50%, -50%)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  background: 'rgba(20,22,30,0.50)',
                  border: `1px solid ${TOKENS.HORIZON.glassBorder}`,
                  borderRadius: '10px',
                  padding: '5px 9px',
                  fontWeight: 600,
                  fontSize: '11px',
                  letterSpacing: '0.03em',
                  textTransform: 'uppercase',
                  color: isHovered ? TOKENS.colors.textPrimary : getDomainText(domain.id),
                  textShadow: '0 1px 2px rgba(0,0,0,0.4)',
                  pointerEvents: 'none',
                  zIndex: 3,
                  boxShadow: isHovered ? '0 0 16px rgba(255,255,255,0.1)' : 'none'
                }}
                animate={{
                  color: isHovered ? TOKENS.colors.textPrimary : getDomainText(domain.id),
                  scale: isHovered ? 1.05 : 1
                }}
                transition={{ duration: TOKENS.HORIZON.t_hover, ease: TOKENS.HORIZON.easing }}
              >
                {domain.id}
              </motion.div>
            );
          })}
        </div>

        {/* Hover Info Capsule */}
        <AnimatePresence>
          {hoveredDomain && !selectedDomain && !isMorphing && (
            <motion.div 
              ref={capsuleRef} 
              id={`capsule-${hoveredDomain}`} 
              className="absolute z-50" 
              style={{ 
                left: (() => {
                  const domain = domains.find(d => d.id === hoveredDomain);
                  const pos = getOrbPosition(hoveredDomain, domain.strength, driftTime);
                  return pos.x + 70;
                })(),
                top: (() => {
                  const domain = domains.find(d => d.id === hoveredDomain);
                  const pos = getOrbPosition(hoveredDomain, domain.strength, driftTime);
                  return pos.y - 50;
                })(),
                transformOrigin: 'center left', 
                pointerEvents: 'auto' 
              }}
              initial={{ opacity: 0, y: 6, filter: 'blur(4px)' }} 
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} 
              exit={{ opacity: 0, y: 6, filter: 'blur(4px)' }}
              transition={{ duration: TOKENS.HORIZON.t_tooltip, ease: TOKENS.HORIZON.easing }}>
              {(() => {
                const domain = domains.find(d => d.id === hoveredDomain);
                if (!domain) return null;
                return (
                  <div className="cursor-pointer hover-capsule" onClick={() => handleOpenDrawer(domain)} style={{
                    backdropFilter: getBlur('chip'), 
                    WebkitBackdropFilter: getBlur('chip'), 
                    background: TOKENS.HORIZON.glassBg,
                    border: `1px solid ${TOKENS.HORIZON.glassBorder}`, 
                    boxShadow: TOKENS.HORIZON.panelShadow,
                    borderRadius: '18px', 
                    padding: '16px 18px', 
                    minWidth: '300px', 
                    maxWidth: '340px'
                  }}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ 
                        background: getDomainColor(domain.id), 
                        boxShadow: `0 0 12px ${getDomainBloom(domain.id)}` 
                      }} />
                      <span className="font-semibold capitalize" style={{ 
                        color: TOKENS.colors.textPrimary, 
                        fontSize: '15px', 
                        textShadow: '0 1px 2px rgba(0,0,0,0.4)' 
                      }}>{domain.id}</span>
                      <span className="ml-auto text-xs font-bold" style={{ 
                        color: getDomainText(domain.id), 
                        textShadow: '0 1px 2px rgba(0,0,0,0.4)' 
                      }}>{domain.confidence_pct}%</span>
                    </div>
                    <p className="text-on-glass" style={{ 
                      color: TOKENS.colors.textSecondary, 
                      fontSize: '14px', 
                      lineHeight: '1.6', 
                      marginBottom: '14px', 
                      textShadow: '0 1px 2px rgba(0,0,0,0.4)' 
                    }}>
                      {domain.summary.length > 90 ? domain.summary.substring(0, 87) + '...' : domain.summary}
                    </p>
                    <div className="flex items-center gap-2 text-xs" style={{ 
                      color: TOKENS.colors.textTertiary, 
                      minHeight: '44px', 
                      alignItems: 'center' 
                    }}>
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span className="font-medium" style={{ letterSpacing: '0.25px' }}>Click for details</span>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Equilibrium Bar */}
        <div ref={footerRef} className="balance-footer" style={{
          position: 'absolute',
          left: '32px',
          right: '32px',
          bottom: '22px',
          height: `${footerH}px`,
          borderRadius: '20px',
          padding: '16px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          backdropFilter: getBlur('chip'),
          WebkitBackdropFilter: getBlur('chip'),
          background: TOKENS.HORIZON.glassBg,
          border: `1px solid ${TOKENS.HORIZON.glassBorder}`,
          boxShadow: `${TOKENS.HORIZON.panelShadow}, inset 0 0 0 1px ${TOKENS.HORIZON.glassInner}`,
          zIndex: 1,
          pointerEvents: 'none'
        }}>
          <div className="footer-content" style={{ display: 'contents', pointerEvents: 'auto' }}>
            {/* Light-reactive bar */}
            <div className="balance-indicator-container" style={{ width: '160px', position: 'relative' }}>
              <div className="balance-indicator-track" style={{
                height: '2px',
                borderRadius: '999px',
                position: 'relative',
                overflow: 'hidden',
                background: 'transparent'
              }}>
                {/* Flowing gradient beam */}
                <motion.div 
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(90deg, rgba(122,215,240,0.6), rgba(180,247,192,0.6), rgba(255,211,122,0.6), rgba(192,166,255,0.6), rgba(122,215,240,0.6))',
                    backgroundSize: '200% 100%',
                    filter: 'blur(0.5px)',
                    boxShadow: '0 0 8px rgba(255,255,255,0.2)'
                  }}
                  animate={shouldReduceMotion ? {} : {
                    backgroundPosition: ['0% 0%', '100% 0%']
                  }}
                  transition={shouldReduceMotion ? {} : {
                    duration: 8,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                />
                
                {/* Orb marker */}
                <motion.div 
                  className="balance-indicator-dot"
                  style={{
                    position: 'absolute',
                    top: '50%',
                    width: '10px',
                    height: '10px',
                    borderRadius: '999px',
                    background: dominantDriver === 'balanced' 
                      ? 'rgba(255,255,255,0.7)' 
                      : getDomainColor(dominantDriver),
                    boxShadow: `0 0 20px ${dominantDriver === 'balanced' 
                      ? 'rgba(255,255,255,0.5)' 
                      : getDomainBloom(dominantDriver)}, 0 0 8px rgba(255,255,255,0.3)`,
                    transform: 'translate(-50%, -50%)',
                    border: '1px solid rgba(255,255,255,0.3)'
                  }}
                  animate={{
                    left: `calc(10% + ${balanceBias * 80}%)`
                  }}
                  transition={{ duration: 0.8, ease: TOKENS.HORIZON.overshoot }}
                />
              </div>
            </div>
            
            <div className="flex-1 flex items-center gap-3">
              <span className="text-on-glass" style={{ 
                color: TOKENS.colors.textSecondary, 
                fontSize: '14px', 
                lineHeight: '20px', 
                textShadow: '0 1px 2px rgba(0,0,0,0.4)',
                fontWeight: 400
              }}>
                {globalSummary}
              </span>
              
              {/* Info tip */}
              <div className="relative">
                <button
                  onMouseEnter={() => setShowEquilibriumTip(true)}
                  onMouseLeave={() => setShowEquilibriumTip(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                  style={{ minWidth: '32px', minHeight: '32px' }}
                  aria-label="Equilibrium info"
                >
                  <Info className="w-4 h-4" style={{ color: TOKENS.colors.textTertiary }} />
                </button>
                
                <AnimatePresence>
                  {showEquilibriumTip && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.2, ease: TOKENS.HORIZON.easing }}
                      className="absolute bottom-full right-0 mb-2 p-3 rounded-lg"
                      style={{
                        background: TOKENS.HORIZON.glassBg,
                        backdropFilter: getBlur('chip'),
                        WebkitBackdropFilter: getBlur('chip'),
                        border: `1px solid ${TOKENS.HORIZON.glassBorder}`,
                        boxShadow: TOKENS.HORIZON.panelShadow,
                        width: '240px',
                        pointerEvents: 'none'
                      }}
                    >
                      <p style={{
                        fontSize: '12px',
                        lineHeight: '1.5',
                        color: TOKENS.colors.textSecondary,
                        letterSpacing: '0.25px'
                      }}>
                        Real-time equilibrium state showing the balance and lean of macro forces. Dot position reflects dominant driver strength.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Halo pulse animation */}
      <AnimatePresence>
        {haloAnimating && hoveredDomain && (
          <motion.div
            className="fixed z-40"
            style={{
              left: (() => {
                const domain = domains.find(d => d.id === hoveredDomain);
                const pos = getOrbPosition(hoveredDomain, domain.strength, driftTime);
                return containerRef.current ? containerRef.current.getBoundingClientRect().left + pos.x : 0;
              })(),
              top: (() => {
                const domain = domains.find(d => d.id === hoveredDomain);
                const pos = getOrbPosition(hoveredDomain, domain.strength, driftTime);
                return containerRef.current ? containerRef.current.getBoundingClientRect().top + pos.y : 0;
              })(),
              width: '100px',
              height: '100px',
              transform: 'translate(-50%, -50%)',
              borderRadius: '999px',
              background: `radial-gradient(circle, ${getDomainBloom(hoveredDomain)}, transparent 70%)`,
              pointerEvents: 'none'
            }}
            initial={{ scale: 0.5, opacity: 0.8 }}
            animate={{ scale: 8, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: TOKENS.HORIZON.t_drawer, ease: TOKENS.HORIZON.easing }}
          />
        )}
      </AnimatePresence>

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
          transition={{ duration: TOKENS.HORIZON.t_drawer, ease: TOKENS.HORIZON.overshoot }} />
        )}
      </AnimatePresence>

      {/* Scrim backdrop */}
      <AnimatePresence>
        {(selectedDomain || isMorphing) && (
          <motion.div 
            className="fixed inset-0 z-40" 
            style={{ 
              background: 'rgba(10, 12, 20, 0.60)', 
              backdropFilter: 'blur(20px)', 
              WebkitBackdropFilter: 'blur(20px)' 
            }}
            initial={{ opacity: 0 }} 
            animate={{ opacity: isMorphing ? 0.7 : 1 }} 
            exit={{ opacity: 0 }}
            transition={{ duration: TOKENS.HORIZON.t_drawer, ease: TOKENS.HORIZON.easing }} 
            onClick={handleCloseDrawer} 
          />
        )}
      </AnimatePresence>

      {/* Floating Glass Drawer Panel */}
      <AnimatePresence>
        {selectedDomain && !isMorphing && (
          <motion.div className="fixed top-0 right-0 h-full z-50 overflow-y-auto" style={{
            width: '520px', 
            maxWidth: '90vw', 
            backdropFilter: getBlur('panel'), 
            WebkitBackdropFilter: getBlur('panel'),
            background: TOKENS.HORIZON.glassBg, 
            border: `1px solid ${TOKENS.HORIZON.glassBorder}`,
            boxShadow: TOKENS.HORIZON.panelShadow, 
            borderRadius: '24px 0 0 24px'
          }}
          initial={{ x: '100%', opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          exit={{ x: '100%', opacity: 0, y: 8 }}
          transition={{ 
            duration: 0.22, 
            ease: TOKENS.HORIZON.easing,
            exit: { duration: 0.22, ease: 'easeInOut' }
          }} 
          onClick={(e) => e.stopPropagation()}>
            
            <div className="sticky top-0 z-10 p-6 border-b" style={{ 
              background: TOKENS.HORIZON.glassBg, 
              borderColor: TOKENS.HORIZON.glassBorder, 
              backdropFilter: getBlur('chip') 
            }}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ 
                    background: `${getDomainColor(selectedDomain.id)}15`, 
                    border: `1px solid ${getDomainColor(selectedDomain.id)}30`, 
                    boxShadow: `0 0 20px ${getDomainBloom(selectedDomain.id)}` 
                  }}>
                    <span style={{ fontSize: '22px' }}>{getDomainIcon(selectedDomain.id)}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold capitalize" style={{ 
                      color: TOKENS.colors.textPrimary, 
                      fontSize: '18px', 
                      textShadow: '0 1px 2px rgba(0,0,0,0.4)',
                      fontWeight: 600
                    }}>{selectedDomain.id}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {getPostureIcon(selectedDomain.posture)}
                      <span className="font-medium capitalize" style={{ 
                        color: getDomainText(selectedDomain.id), 
                        fontSize: '14px', 
                        textShadow: '0 1px 2px rgba(0,0,0,0.4)' 
                      }}>{selectedDomain.posture}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={handleCloseDrawer} 
                  className="p-2 rounded-lg transition-colors hover:bg-white/10" 
                  style={{ 
                    color: TOKENS.colors.textTertiary, 
                    minWidth: '44px', 
                    minHeight: '44px' 
                  }} 
                  aria-label="Close drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Liquid motion confidence ring */}
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16">
                  <svg className="transform -rotate-90" width="64" height="64">
                    <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
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
                        strokeDashoffset: 176 - (176 * selectedDomain.confidence_pct / 100),
                        opacity: [0.8, 1, 0.8]
                      }} 
                      transition={{ 
                        strokeDashoffset: { 
                          duration: 1.2, 
                          ease: TOKENS.HORIZON.overshoot 
                        },
                        opacity: {
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut'
                        }
                      }} 
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-bold" style={{ 
                    color: TOKENS.colors.textPrimary, 
                    fontSize: '16px' 
                  }}>{selectedDomain.confidence_pct}%</div>
                </div>
                <div className="flex-1">
                  <div className="text-xs font-medium mb-1" style={{ 
                    color: TOKENS.colors.textTertiary, 
                    letterSpacing: '0.25px' 
                  }}>CONFIDENCE LEVEL</div>
                  <div className="text-sm" style={{ 
                    color: TOKENS.colors.textSecondary, 
                    fontWeight: 400 
                  }}>Signal strength: {Math.round(selectedDomain.strength * 100)}%</div>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wide mb-3" style={{ 
                  color: TOKENS.colors.textTertiary, 
                  letterSpacing: '0.25px' 
                }}>What This Means</h4>
                <p className="text-on-glass" style={{ 
                  color: TOKENS.colors.textPrimary, 
                  fontSize: '15px', 
                  lineHeight: '1.6', 
                  textShadow: '0 1px 2px rgba(0,0,0,0.4)',
                  fontWeight: 400
                }}>{selectedDomain.summary}</p>
              </div>
              
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wide mb-3" style={{ 
                  color: TOKENS.colors.textTertiary, 
                  letterSpacing: '0.25px' 
                }}>Downstream Effects</h4>
                <div className="space-y-2">
                  {selectedDomain.ripple.map((effect, i) => (
                    <motion.div 
                      key={i} 
                      className="effect-chip" 
                      style={{
                        backdropFilter: getBlur('chip'), 
                        WebkitBackdropFilter: getBlur('chip'), 
                        background: 'rgba(25,27,36,0.50)',
                        border: `1px solid ${TOKENS.HORIZON.glassBorder}`, 
                        boxShadow: `inset 0 0 0 1px ${TOKENS.HORIZON.glassInner}`,
                        borderRadius: '14px', 
                        padding: '12px 14px', 
                        display: 'flex', 
                        alignItems: 'start', 
                        gap: '10px'
                      }}
                      initial={{ opacity: 0, x: -10 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      transition={{ 
                        delay: 0.4 + i * 0.1, 
                        duration: 0.4, 
                        ease: TOKENS.HORIZON.easing 
                      }}>
                      <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ 
                        background: getDomainColor(selectedDomain.id),
                        boxShadow: `0 0 6px ${getDomainBloom(selectedDomain.id)}`
                      }} />
                      <span className="text-on-glass" style={{ 
                        color: TOKENS.colors.textSecondary, 
                        fontSize: '14px', 
                        lineHeight: '1.6', 
                        textShadow: '0 1px 2px rgba(0,0,0,0.4)',
                        fontWeight: 400
                      }}>{effect}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wide mb-3" style={{ 
                  color: TOKENS.colors.textTertiary, 
                  letterSpacing: '0.25px' 
                }}>48-Hour Trend</h4>
                <div className="p-4 rounded-lg" style={{ 
                  background: 'rgba(0, 0, 0, 0.25)', 
                  border: `1px solid ${TOKENS.HORIZON.glassBorder}` 
                }}>
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
                      return (<>
                        <motion.path 
                          d={areaD} 
                          fill={`url(#sparkline-${selectedDomain.id})`} 
                          className="trend-area" 
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
                      </>);
                    })()}
                  </svg>
                </div>
              </div>
              
              <div className="text-xs" style={{ 
                color: TOKENS.colors.textTertiary, 
                textShadow: '0 1px 2px rgba(0,0,0,0.4)',
                letterSpacing: '0.25px'
              }}>
                Updated {new Date(selectedDomain.last_updated_iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .text-on-glass { text-shadow: 0 1px 2px rgba(0,0,0,0.4); }
        
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
          outline: 2px solid ${TOKENS.colors.textPrimary};
          outline-offset: 4px;
          filter: drop-shadow(0 0 0 2px currentColor) drop-shadow(0 0 16px currentColor) !important; 
        }
        
        * {
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', sans-serif;
        }
      `}</style>
    </motion.section>
  );
};

export default MacroEquilibriumGrid;
