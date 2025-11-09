
import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Globe, X, TrendingUp, TrendingDown, Minus, ArrowRight, Info } from 'lucide-react';
import LyraLogo from '../core/LyraLogo';

// ============================================================================
// MACRO EQUILIBRIUM GRID — OS HORIZON V2.1 (LIQUID GLASS UNIVERSE)
// Base44 Motion Spec Compliant — 60fps target, Apple emotional design
// ============================================================================

// Motion Spec Constants
const MOTION_SPEC = {
  namespace: 'vireon.macro_grid.osh_v2_1',
  fps_target: 60,
  easings: {
    horizonSine: [0.445, 0.05, 0.55, 0.95], // sineInOut approximation
    horizonStandard: [0.4, 0, 0.2, 1], // Apple standard
    horizonEmphasis: [0.2, 0, 0, 1], // quicker settle
    horizonExit: [0.4, 0, 1, 1],
    elasticFill: [0.22, 1, 0.36, 1] // liquid % rings
  },
  durations: {
    hoverIn: 0.12,
    hoverOut: 0.16,
    drawerOpen: 0.22,
    drawerClose: 0.18,
    haloBurst: 0.45,
    linePulseLoop: 3,
    nodeBreathLoop: 4.5,
    orbitalDriftLoop: 10,
    gradientFlowLoop: 20,
    statusPulse: 12,
    shimmerPass: 2.6
  },
  nodes: {
    scale_idle: 1.0,
    scale_breath: [0.97, 1.03], // ±3%
    opacity_breath: [0.98, 1.00], // ±2%
    glow_intensity_idle: 1.0,
    glow_intensity_hover: 1.15,
    glow_intensity_active: 1.25,
    z_parallax_map: {
      fx: { z_px: -10, parallax: 0.8 },
      rates: { z_px: -5, parallax: 0.6 },
      growth: { z_px: 5, parallax: 0.5 },
      geopolitics: { z_px: 10, parallax: 0.4 }
    }
  },
  filaments: {
    width_px: 1,
    opacity: 0.20,
    pulse_brightness_delta: 0.20, // ±20%
    hover_brighten: 0.25, // +25%
    gradient: ['#6AC7F7', '#B4F7C0', '#FFD37A']
  },
  drawer: {
    background_blur_px: 20,
    glass_opacity: 0.70,
    edge_bloom_color: '#A0BFFF',
    edge_bloom_opacity: 0.10,
    fade_trail_ms: 60
  },
  background: {
    base_gradient: { top: '#06080D', bottom: '#0A0E14' },
    ambient_core: { center: '#1A2732', edge: '#090B10', opacity: 0.35 },
    grain_opacity: 0.04,
    hue_delta_deg: 6
  },
  luminance: {
    glow_radius_px: 24,
    glow_opacity: 0.40,
    subsurface_ring: { width_px: 2, color: 'rgba(255,255,255,0.05)', blur_px: 6 },
    cap_max_luma: 0.82
  },
  status_beam: {
    height_px: 2,
    shimmer_width_pct: 14,
    shimmer_opacity: 0.25,
    reflection_blur_px: 8,
    reflection_opacity: 0.15
  },
  performance: {
    max_blur_layers: 3,
    fps_threshold: 50
  },
  a11y: {
    focus_ring: { style: '2px solid rgba(122,215,240,0.9)', offset_px: 3 },
    contrast_min: 4.5
  }
};

const TOKENS = {
  HORIZON: {
    // Liquid Glass Tahoe palette
    glassBg: 'rgba(10,14,20,0.70)',
    glassBorder: 'rgba(160,191,255,0.10)',
    glassEdgeLight: 'rgba(160,191,255,0.10)',
    glassInner: 'rgba(255,255,255,0.04)',
    panelShadow: '0 0 80px rgba(0,0,0,0.4), 0 0 40px rgba(160,191,255,0.08)',
    // The previous blurPanel and blurChip tokens will be dynamically calculated
    ...MOTION_SPEC // Merging MOTION_SPEC directly into HORIZON
  },
  // OS Horizon Spectral Glow (updated for Liquid Glass)
  MACRO: {
    fx: {
      core: '#6AC7F7', // Blue
      halo: 'rgba(106,199,247,0.40)',
      text: '#B8E7FF',
      sceneGlow: 'rgba(106,199,247,0.12)',
      bloom: 'rgba(106,199,247,0.20)',
      zDepth: -10
    },
    rates: {
      core: '#C0A6FF', // Violet
      halo: 'rgba(192,166,255,0.40)',
      text: '#DECFFF',
      sceneGlow: 'rgba(192,166,255,0.12)',
      bloom: 'rgba(192,166,255,0.20)',
      zDepth: -5
    },
    growth: {
      core: '#B4F7C0', // Mint
      halo: 'rgba(180,247,192,0.40)',
      text: '#D4FFDE',
      sceneGlow: 'rgba(180,247,192,0.12)',
      bloom: 'rgba(180,247,192,0.20)',
      zDepth: 5
    },
    geopolitics: {
      core: '#FFD37A', // Amber
      halo: 'rgba(255,211,122,0.40)',
      text: '#FFE8B8',
      sceneGlow: 'rgba(255,211,122,0.12)',
      bloom: 'rgba(255,211,122,0.20)',
      zDepth: 10
    }
  },
  colors: {
    textPrimary: "rgba(255,255,255,0.95)",
    textSecondary: "rgba(255,255,255,0.80)",
    textTertiary: "rgba(255,255,255,0.65)"
  }
};

// Golden-angle distribution with 30% more spacing
const ANGLES = {
  rates: 22.5,
  fx: 160.0,
  growth: 297.5,
  geopolitics: 75.0
};

// Organic radius variation (increased spacing)
const RADII = {
  rates: 0.40, // +30% from 0.31
  fx: 0.46, // +30% from 0.35
  growth: 0.43, // +30% from 0.33
  geopolitics: 0.38 // +30% from 0.29
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
  const [gradientDrift, setGradientDrift] = useState(0);
  const [currentFPS, setCurrentFPS] = useState(60);
  const [blurQuality, setBlurQuality] = useState(3);

  // Cursor-based parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

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
      return `Equilibrium Balanced — Rates ${ratesDomain.posture}; FX ${fxDomain.posture}; Growth ${growthDomain.posture}; Geopolitics ${geoDomain.posture}.`;
    }
    
    return `Equilibrium leaning toward ${dominantDriver.charAt(0).toUpperCase() + dominantDriver.slice(1)} — ${dominantDriver === 'rates' ? ratesDomain.posture : dominantDriver === 'fx' ? fxDomain.posture : dominantDriver === 'growth' ? growthDomain.posture : geoDomain.posture}.`;
  }, [domains, dominantDriver]);

  const balanceAngle = useMemo(() => {
    if (dominantDriver === "balanced") return 0;
    return ANGLES[dominantDriver] || 0;
  }, [dominantDriver]);

  // FPS monitoring for performance scaling
  useEffect(() => {
    if (shouldReduceMotion) return;
    
    let frameCount = 0;
    let lastTime = performance.now();
    let rafId;
    
    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      const elapsed = currentTime - lastTime;
      
      if (elapsed >= 1000) {
        const fps = Math.round((frameCount * 1000) / elapsed);
        setCurrentFPS(fps);
        
        // Dynamic blur quality adjustment
        if (fps < MOTION_SPEC.performance.fps_threshold) {
          setBlurQuality(1);
        } else {
          setBlurQuality(3);
        }
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      rafId = requestAnimationFrame(measureFPS);
    };
    
    rafId = requestAnimationFrame(measureFPS);
    return () => cancelAnimationFrame(rafId);
  }, [shouldReduceMotion]);

  // Ultra-slow gradient drift (1px/sec)
  useEffect(() => {
    if (shouldReduceMotion) return;
    
    const interval = setInterval(() => {
      setGradientDrift(prev => (prev + 1) % 1000);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [shouldReduceMotion]);

  // Mouse tracking for parallax
  useEffect(() => {
    if (shouldReduceMotion || !containerRef.current) return;
    
    const handleMouseMove = (e) => {
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - centerX) / (rect.width / 2);
      const deltaY = (e.clientY - centerY) / (rect.height / 2);
      
      mouseX.set(deltaX);
      mouseY.set(deltaY);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [shouldReduceMotion, mouseX, mouseY]);

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

  // Orbital drift + Z-depth + Cursor parallax
  const getOrbPosition = useCallback((domainId, strength, time = 0, cursorX = 0, cursorY = 0) => {
    const angle = ANGLES[domainId] * (Math.PI / 180);
    const baseSize = 40;
    const sizeRange = 20;
    const diameter = baseSize + (strength * sizeRange);
    const radius = diameter / 2;
    
    const baseRadiusFactor = RADII[domainId];
    const strengthFactor = 0.9 + (strength * 0.2);
    const adjustedRadius = orbitBaseRadius * baseRadiusFactor * strengthFactor;
    
    // Orbital drift (6-8px radius, 10s loop)
    const driftPhase = (ANGLES[domainId] / 360) * Math.PI * 2;
    const driftRadius = 6 + (Math.abs(Math.sin(driftPhase)) * 2);
    const orbitAngle = (time * 2 * Math.PI) / MOTION_SPEC.durations.orbitalDriftLoop;
    const driftX = Math.cos(orbitAngle + driftPhase) * driftRadius;
    const driftY = Math.sin(orbitAngle + driftPhase) * driftRadius;
    
    // Z-depth scaling
    const zDepth = TOKENS.MACRO[domainId]?.zDepth || 0;
    const zScale = 1 + (zDepth * 0.01); 
    
    // Cursor parallax
    const parallaxConfig = MOTION_SPEC.nodes.z_parallax_map[domainId] || { parallax: 0.5 };
    const parallaxX = cursorX * parallaxConfig.parallax * 10;
    const parallaxY = cursorY * parallaxConfig.parallax * 10;
    
    const orbX = cx + adjustedRadius * Math.cos(angle) * zScale + driftX + parallaxX;
    const orbY = cy + adjustedRadius * Math.sin(angle) * zScale + driftY + parallaxY;
    
    return { x: orbX, y: orbY, radius, diameter, zDepth };
  }, [cx, cy, orbitBaseRadius]);

  const getLabelPosition = useCallback((orbX, orbY, orbRadius) => {
    const vx = orbX - cx;
    const vy = orbY - cy;
    const norm = Math.hypot(vx, vy) || 1;
    const nx = vx / norm;
    const ny = vy / norm;
    const offset = orbRadius + 16;
    
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
    }, MOTION_SPEC.durations.haloBurst * 1000);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setIsMorphing(true);
    setTimeout(() => {
      setSelectedDomain(null);
      setCapsuleBounds(null);
      setIsMorphing(false);
    }, (MOTION_SPEC.durations.drawerClose + (MOTION_SPEC.drawer.fade_trail_ms / 1000)) * 1000);
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
    if (isLowPower || blurQuality === 1) {
      return type === 'panel' ? 'blur(16px)' : 'blur(12px)';
    }
    return type === 'panel' ? `blur(${MOTION_SPEC.drawer.background_blur_px}px)` : 'blur(16px)';
  }, [isLowPower, blurQuality]);

  // Orbital drift time
  const [orbitTime, setOrbitTime] = useState(0);
  useEffect(() => {
    if (shouldReduceMotion) return;
    
    let rafId;
    let lastTime = Date.now();
    
    const animate = () => {
      const now = Date.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      
      setOrbitTime(prev => (prev + delta) % MOTION_SPEC.durations.orbitalDriftLoop);
      rafId = requestAnimationFrame(animate);
    };
    
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [shouldReduceMotion]);

  // Cursor parallax values
  const cursorX = useTransform(mouseX, [-1, 1], [-1, 1]);
  const cursorY = useTransform(mouseY, [-1, 1], [-1, 1]);

  return (
    <motion.section variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} aria-label="Horizon Constellation">
      <div className="flex items-center justify-between mb-6 pl-2">
        <div className="flex items-center space-x-3">
          <Globe className="w-6 h-6" style={{ color: '#6AC7F7' }} />
          <div>
            <h2 style={{ 
              fontSize: '18px', 
              lineHeight: '24px', 
              fontWeight: 600, 
              color: TOKENS.colors.textPrimary,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'
            }}>Macro Equilibrium Grid</h2>
            <p style={{ 
              fontSize: '13px', 
              color: TOKENS.colors.textTertiary,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
            }}>Celestial equilibrium suspended beneath glass.</p>
          </div>
        </div>
        <div className="powered-by-lyra cursor-pointer" style={{ opacity: 0.6 }}>
          <div className="flex items-center space-x-2 px-4 py-2" style={{ 
            background: 'rgba(255, 255, 255, 0.05)', 
            backdropFilter: 'blur(14px)', 
            WebkitBackdropFilter: 'blur(14px)', 
            border: '1px solid rgba(160,191,255,0.08)', 
            borderRadius: '12px' 
          }}>
            <span className="text-xs font-medium" style={{ 
              color: TOKENS.colors.textTertiary, 
              letterSpacing: '0.25px',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
            }}>Powered by</span>
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
          background: `linear-gradient(180deg, ${MOTION_SPEC.background.base_gradient.top} 0%, ${MOTION_SPEC.background.base_gradient.bottom} 100%)`,
          border: '1px solid rgba(160,191,255,0.08)',
          borderRadius: '24px',
          paddingTop: `${headerSafe}px`,
          paddingBottom: `${safeBottom}px`,
          position: 'relative'
        }}>
        
        {/* Subsurface blur + grain texture */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backdropFilter: `blur(${MOTION_SPEC.drawer.background_blur_px}px)`,
          WebkitBackdropFilter: `blur(${MOTION_SPEC.drawer.background_blur_px}px)`,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='${MOTION_SPEC.background.grain_opacity}'/%3E%3C/svg%3E")`,
          borderRadius: '24px',
          pointerEvents: 'none',
          zIndex: 1
        }} />
        
        {/* Ambient bloom center with ultra-slow drift */}
        <motion.div 
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            borderRadius: '24px',
            overflow: 'hidden',
            zIndex: 1
          }}
          animate={{
            background: `radial-gradient(900px circle at ${50 + Math.sin(gradientDrift * 0.001) * 2}% ${46 + Math.cos(gradientDrift * 0.001) * 2}%, ${MOTION_SPEC.background.ambient_core.center} 0%, ${MOTION_SPEC.background.ambient_core.edge} 70%)`,
            opacity: MOTION_SPEC.background.ambient_core.opacity
          }}
          transition={{ duration: 1, ease: 'linear' }}
        />
        
        {/* Scene Ambient */}
        <motion.div 
          className="scene-ambient"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            borderRadius: '24px',
            overflow: 'hidden',
            mixBlendMode: 'screen',
            opacity: 0.5,
            zIndex: 2
          }}
          animate={{
            background: dominantDriver === 'balanced' 
              ? 'radial-gradient(900px circle at 50% 46%, rgba(255,255,255,0.02), transparent 70%)'
              : `radial-gradient(900px circle at 50% 46%, ${TOKENS.MACRO[dominantDriver].sceneGlow}, transparent 70%)`
          }}
          transition={{ duration: 1.5, ease: MOTION_SPEC.easings.horizonStandard }}
        />
        
        <div ref={constellationRef} className="constellation-layer" style={{ 
          position: 'absolute', 
          inset: 0, 
          transform: `translateY(${constellationShift}px)`, 
          transition: shouldReduceMotion ? 'none' : 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          willChange: 'transform',
          zIndex: 3
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
            boxShadow: 'inset 0 0 0 1px rgba(160,191,255,0.06)',
            opacity: 0.2,
            filter: 'blur(0.5px)',
            pointerEvents: 'none',
            zIndex: 2,
            transition: shouldReduceMotion ? 'none' : 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            willChange: 'width, height'
          }} aria-hidden="true" />

          {/* Breathing Nucleus */}
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
            transition={{ duration: 0.8, ease: MOTION_SPEC.easings.horizonStandard }}
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
              background: 'rgba(160,191,255,0.12)',
              boxShadow: '0 0 80px rgba(160,191,255,0.15), inset 0 0 0 1px rgba(255,255,255,0.08)',
              pointerEvents: 'none'
            }}
            animate={shouldReduceMotion ? {} : {
              scale: [1, 1.08, 1]
            }}
            transition={{
              duration: MOTION_SPEC.durations.nodeBreathLoop,
              repeat: Infinity,
              ease: MOTION_SPEC.easings.horizonSine
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
                  transition={{ duration: 0.8, ease: MOTION_SPEC.easings.horizonStandard }}
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
                  {/* Gaussian glow with subsurface scatter */}
                  <filter id={`bloom-${domain.id}`} x="-100%" y="-100%" width="300%" height="300%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation={MOTION_SPEC.luminance.glow_radius_px} result="blur" />
                    <feColorMatrix in="blur" type="matrix" values={`1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${MOTION_SPEC.luminance.glow_opacity} 0`} result="bloom" />
                    <feMerge>
                      <feMergeNode in="bloom" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  {/* Subsurface scatter ring */}
                  <filter id={`scatter-${domain.id}`}>
                    <feGaussianBlur in="SourceGraphic" stdDeviation={MOTION_SPEC.luminance.subsurface_ring.blur_px} />
                    <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 0 0.05 0" />
                  </filter>
                </React.Fragment>
              ))}
              {/* Connecting lines gradient: blue→mint→amber */}
              {connections.map((conn, i) => (
                <linearGradient key={`conn-grad-${i}`} id={`conn-grad-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  {MOTION_SPEC.filaments.gradient.map((color, idx) => (
                    <stop key={idx} offset={`${(idx / (MOTION_SPEC.filaments.gradient.length - 1)) * 100}%`} stopColor={color} stopOpacity={MOTION_SPEC.filaments.opacity} />
                  ))}
                </linearGradient>
              ))}
            </defs>

            {/* 1px Filament Connecting Lines with pulse */}
            <g style={{ zIndex: 2 }}>
              {connections.map((conn, i) => {
                const fromDomain = domains.find(d => d.id === conn.from);
                const toDomain = domains.find(d => d.id === conn.to);
                const fromPos = getOrbPosition(conn.from, fromDomain.strength, orbitTime, cursorX.get(), cursorY.get());
                const toPos = getOrbPosition(conn.to, toDomain.strength, orbitTime, cursorX.get(), cursorY.get());
                const isAdjacent = hoveredDomain === conn.from || hoveredDomain === conn.to;
                const pathD = `M ${fromPos.x},${fromPos.y} Q ${cx},${cy} ${toPos.x},${toPos.y}`;
                const baseOpacity = MOTION_SPEC.filaments.opacity;
                const hoverBoost = MOTION_SPEC.filaments.hover_brighten;
                const pulseDelta = MOTION_SPEC.filaments.pulse_brightness_delta;
                
                return (
                  <motion.path 
                    key={`connection-${i}`} 
                    d={pathD} 
                    stroke={`url(#conn-grad-${i})`} 
                    strokeWidth={MOTION_SPEC.filaments.width_px} 
                    strokeLinecap="round" 
                    fill="none"
                    animate={{ 
                      opacity: isAdjacent 
                        ? baseOpacity + hoverBoost
                        : shouldReduceMotion 
                          ? baseOpacity 
                          : [baseOpacity - pulseDelta, baseOpacity + pulseDelta, baseOpacity - pulseDelta]
                    }}
                    transition={
                      isAdjacent
                        ? { duration: 0.3, ease: MOTION_SPEC.easings.horizonStandard }
                        : { 
                            duration: MOTION_SPEC.durations.linePulseLoop, 
                            repeat: Infinity, 
                            ease: MOTION_SPEC.easings.horizonSine
                          }
                    }
                    style={{ 
                      filter: 'drop-shadow(0 2px 12px rgba(0,0,0,0.4))'
                    }} 
                  />
                );
              })}
            </g>

            {/* Orbs with breathing motion */}
            <g style={{ zIndex: 3 }}>
              {domains.map((domain, idx) => {
                const pos = getOrbPosition(domain.id, domain.strength, orbitTime, cursorX.get(), cursorY.get());
                const color = getDomainColor(domain.id);
                const bloom = getDomainBloom(domain.id);
                const isHovered = hoveredDomain === domain.id;

                // Randomize breathing phase
                const breathPhase = idx * 1.2;

                return (
                  <g key={domain.id}>
                    {/* Gaussian glow */}
                    <motion.circle 
                      cx={pos.x} 
                      cy={pos.y} 
                      r={pos.radius + 40} 
                      fill={bloom}
                      style={{ 
                        filter: `blur(${MOTION_SPEC.luminance.glow_radius_px}px)`, 
                        pointerEvents: 'none'
                      }}
                      animate={shouldReduceMotion ? {} : {
                        opacity: isHovered 
                          ? MOTION_SPEC.luminance.glow_opacity * MOTION_SPEC.nodes.glow_intensity_hover
                          : MOTION_SPEC.nodes.opacity_breath.map(v => v * MOTION_SPEC.luminance.glow_opacity),
                        scale: isHovered 
                          ? 1.05 
                          : MOTION_SPEC.nodes.scale_breath
                      }}
                      transition={
                        isHovered
                          ? { duration: MOTION_SPEC.durations.hoverIn, ease: MOTION_SPEC.easings.horizonStandard }
                          : { 
                              duration: MOTION_SPEC.durations.nodeBreathLoop, 
                              repeat: Infinity, 
                              ease: MOTION_SPEC.easings.horizonSine,
                              delay: breathPhase
                            }
                      }
                    />
                    
                    {/* Subsurface scatter ring */}
                    <circle 
                      cx={pos.x} 
                      cy={pos.y} 
                      r={pos.radius + MOTION_SPEC.luminance.subsurface_ring.width_px} 
                      fill="none"
                      stroke={MOTION_SPEC.luminance.subsurface_ring.color}
                      strokeWidth={MOTION_SPEC.luminance.subsurface_ring.width_px}
                      style={{ 
                        filter: `url(#scatter-${domain.id})`,
                        pointerEvents: 'none'
                      }}
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
                          transition={{ 
                            duration: MOTION_SPEC.durations.hoverIn, 
                            ease: MOTION_SPEC.easings.horizonStandard
                          }}
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
                        scale: isHovered ? 1.05 : MOTION_SPEC.nodes.scale_breath,
                        opacity: isHovered ? 1 : MOTION_SPEC.nodes.opacity_breath
                      }}
                      transition={
                        isHovered 
                          ? { duration: MOTION_SPEC.durations.hoverIn, ease: MOTION_SPEC.easings.horizonStandard } 
                          : { 
                              duration: MOTION_SPEC.durations.nodeBreathLoop, 
                              repeat: Infinity, 
                              ease: MOTION_SPEC.easings.horizonSine,
                              delay: breathPhase
                            }
                      }
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
            const orbPos = getOrbPosition(domain.id, domain.strength, orbitTime, cursorX.get(), cursorY.get());
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
                  background: 'rgba(10,14,20,0.50)',
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
                  boxShadow: isHovered ? '0 0 16px rgba(160,191,255,0.15)' : 'none',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
                }}
                animate={{
                  color: isHovered ? TOKENS.colors.textPrimary : getDomainText(domain.id),
                  scale: isHovered ? 1.05 : 1
                }}
                transition={{ duration: MOTION_SPEC.durations.hoverIn, ease: MOTION_SPEC.easings.horizonStandard }}
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
                  const pos = getOrbPosition(hoveredDomain, domain.strength, orbitTime, cursorX.get(), cursorY.get());
                  return pos.x + 70;
                })(),
                top: (() => {
                  const domain = domains.find(d => d.id === hoveredDomain);
                  const pos = getOrbPosition(hoveredDomain, domain.strength, orbitTime, cursorX.get(), cursorY.get());
                  return pos.y - 50;
                })(),
                transformOrigin: 'center left', 
                pointerEvents: 'auto' 
              }}
              initial={{ opacity: 0, y: 6, filter: 'blur(4px)' }} 
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} 
              exit={{ opacity: 0, y: 6, filter: 'blur(4px)' }}
              transition={{ duration: 0.25, ease: MOTION_SPEC.easings.horizonStandard }}>
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
                        textShadow: '0 1px 2px rgba(0,0,0,0.4)',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'
                      }}>{domain.id}</span>
                      <span className="ml-auto text-xs font-bold" style={{ 
                        color: getDomainText(domain.id), 
                        textShadow: '0 1px 2px rgba(0,0,0,0.4)',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
                      }}>{domain.confidence_pct}%</span>
                    </div>
                    <p className="text-on-glass" style={{ 
                      color: TOKENS.colors.textSecondary, 
                      fontSize: '14px', 
                      lineHeight: '1.6', 
                      marginBottom: '14px', 
                      textShadow: '0 1px 2px rgba(0,0,0,0.4)',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
                    }}>
                      {domain.summary.length > 90 ? domain.summary.substring(0, 87) + '...' : domain.summary}
                    </p>
                    <div className="flex items-center gap-2 text-xs" style={{ 
                      color: TOKENS.colors.textTertiary, 
                      minHeight: '44px', 
                      alignItems: 'center' 
                    }}>
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span className="font-medium" style={{ 
                        letterSpacing: '0.25px',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
                      }}>Click for details</span>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Equilibrium Bar with shimmer pass */}
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
          boxShadow: `${TOKENS.HORIZON.panelShadow}, inset 0 0 0 1px ${TOKENS.HORIZON.glassEdgeLight}`,
          zIndex: 1,
          pointerEvents: 'none'
        }}>
          <div className="footer-content" style={{ display: 'contents', pointerEvents: 'auto' }}>
            {/* 2px beam gradient with shimmer */}
            <div className="balance-indicator-container" style={{ width: '160px', position: 'relative' }}>
              <div className="balance-indicator-track" style={{
                height: `${MOTION_SPEC.status_beam.height_px}px`,
                borderRadius: '999px',
                position: 'relative',
                overflow: 'hidden',
                background: 'transparent'
              }}>
                {/* Animated gradient beam */}
                <motion.div 
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: `linear-gradient(90deg, ${MOTION_SPEC.filaments.gradient.join(', ')}, ${MOTION_SPEC.filaments.gradient[0]})`,
                    backgroundSize: '200% 100%'
                  }}
                  animate={shouldReduceMotion ? {} : {
                    backgroundPosition: ['0% 0%', '200% 0%']
                  }}
                  transition={shouldReduceMotion ? {} : {
                    duration: MOTION_SPEC.durations.statusPulse,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                />
                
                {/* Shimmer pass */}
                {!shouldReduceMotion && (
                  <motion.div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: `-${MOTION_SPEC.status_beam.shimmer_width_pct}%`,
                      width: `${MOTION_SPEC.status_beam.shimmer_width_pct}%`,
                      height: '100%',
                      background: `linear-gradient(90deg, transparent, rgba(255,255,255,${MOTION_SPEC.status_beam.shimmer_opacity}), transparent)`
                    }}
                    animate={{
                      left: [`-${MOTION_SPEC.status_beam.shimmer_width_pct}%`, '100%']
                    }}
                    transition={{
                      duration: MOTION_SPEC.durations.shimmerPass,
                      repeat: Infinity,
                      ease: 'linear',
                      repeatDelay: 0.5
                    }}
                  />
                )}
                
                {/* Under-reflection blur */}
                <div style={{
                  position: 'absolute',
                  bottom: `-${MOTION_SPEC.status_beam.reflection_blur_px}px`,
                  left: 0,
                  right: 0,
                  height: `${MOTION_SPEC.status_beam.reflection_blur_px}px`,
                  background: `linear-gradient(90deg, ${MOTION_SPEC.filaments.gradient.map(c => c.replace(')', `, ${MOTION_SPEC.status_beam.reflection_opacity})`).replace('#', 'rgba(').join(', ')})`,
                  filter: `blur(${MOTION_SPEC.status_beam.reflection_blur_px}px)`,
                  opacity: MOTION_SPEC.status_beam.reflection_opacity
                }} />
                
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
                  transition={{ duration: 0.8, ease: MOTION_SPEC.easings.elasticFill }}
                />
              </div>
            </div>
            
            <div className="flex-1 flex items-center gap-3">
              <span className="text-on-glass" style={{ 
                color: TOKENS.colors.textSecondary, 
                fontSize: '14px', 
                lineHeight: '20px', 
                textShadow: '0 1px 2px rgba(0,0,0,0.4)',
                fontWeight: 400,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
              }}>
                {globalSummary}
              </span>
              
              {/* Info tip */}
              <div className="relative">
                <button
                  onMouseEnter={() => setShowEquilibriumTip(true)}
                  onMouseLeave={() => setShowEquilibriumTip(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                  style={{ 
                    minWidth: '32px', 
                    minHeight: '32px',
                    outline: showEquilibriumTip ? MOTION_SPEC.a11y.focus_ring.style : 'none',
                    outlineOffset: `${MOTION_SPEC.a11y.focus_ring.offset_px}px`
                  }}
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
                      transition={{ duration: 0.2, ease: MOTION_SPEC.easings.horizonStandard }}
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
                        letterSpacing: '0.25px',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
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

      {/* Halo burst animation */}
      <AnimatePresence>
        {haloAnimating && hoveredDomain && (
          <motion.div
            className="fixed z-40"
            style={{
              left: (() => {
                const domain = domains.find(d => d.id === hoveredDomain);
                const pos = getOrbPosition(hoveredDomain, domain.strength, orbitTime, cursorX.get(), cursorY.get());
                return containerRef.current ? containerRef.current.getBoundingClientRect().left + pos.x : 0;
              })(),
              top: (() => {
                const domain = domains.find(d => d.id === hoveredDomain);
                const pos = getOrbPosition(hoveredDomain, domain.strength, orbitTime, cursorX.get(), cursorY.get());
                return containerRef.current ? containerRef.current.getBoundingClientRect().top + pos.y : 0;
              })(),
              width: '100px',
              height: '100px',
              transform: 'translate(-50%, -50%)',
              borderRadius: '999px',
              background: `radial-gradient(circle, ${getDomainBloom(hoveredDomain)}, transparent 70%)`,
              pointerEvents: 'none'
            }}
            initial={{ scale: 0.85, opacity: 0.2 }}
            animate={{ scale: 1.1, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: MOTION_SPEC.durations.haloBurst, ease: MOTION_SPEC.easings.horizonEmphasis }}
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
          transition={{ duration: MOTION_SPEC.durations.haloBurst, ease: MOTION_SPEC.easings.elasticFill }} />
        )}
      </AnimatePresence>

      {/* Scrim backdrop */}
      <AnimatePresence>
        {(selectedDomain || isMorphing) && (
          <motion.div 
            className="fixed inset-0 z-40" 
            style={{ 
              background: 'rgba(6,8,13,0.70)', 
              backdropFilter: `blur(${MOTION_SPEC.drawer.background_blur_px}px)`, 
              WebkitBackdropFilter: `blur(${MOTION_SPEC.drawer.background_blur_px}px)` 
            }}
            initial={{ opacity: 0 }} 
            animate={{ opacity: isMorphing ? 0.7 : 1 }} 
            exit={{ opacity: 0 }}
            transition={{ duration: MOTION_SPEC.durations.haloBurst, ease: MOTION_SPEC.easings.horizonStandard }} 
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
            boxShadow: `${TOKENS.HORIZON.panelShadow}, inset 0 0 0 1px ${TOKENS.HORIZON.glassEdgeLight}`, 
            borderRadius: '24px 0 0 24px'
          }}
          initial={{ x: '100%', y: -8, opacity: 0 }} 
          animate={{ x: 0, y: 0, opacity: 1 }} 
          exit={{ x: '100%', y: -6, opacity: 0 }}
          transition={{ 
            duration: MOTION_SPEC.durations.drawerOpen,
            ease: MOTION_SPEC.easings.horizonStandard,
            exit: { duration: MOTION_SPEC.durations.drawerClose, ease: MOTION_SPEC.easings.horizonExit }
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
                      fontWeight: 600,
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'
                    }}>{selectedDomain.id}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {getPostureIcon(selectedDomain.posture)}
                      <span className="font-medium capitalize" style={{ 
                        color: getDomainText(selectedDomain.id), 
                        fontSize: '14px', 
                        textShadow: '0 1px 2px rgba(0,0,0,0.4)',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
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
                    minHeight: '44px',
                    outline: 'none'
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
                          ease: MOTION_SPEC.easings.elasticFill
                        },
                        opacity: {
                          duration: 2,
                          repeat: Infinity,
                          ease: MOTION_SPEC.easings.horizonSine
                        }
                      }} 
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-bold" style={{ 
                    color: TOKENS.colors.textPrimary, 
                    fontSize: '16px',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'
                  }}>{selectedDomain.confidence_pct}%</div>
                </div>
                <div className="flex-1">
                  <div className="text-xs font-medium mb-1" style={{ 
                    color: TOKENS.colors.textTertiary, 
                    letterSpacing: '0.25px',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
                  }}>CONFIDENCE LEVEL</div>
                  <div className="text-sm" style={{ 
                    color: TOKENS.colors.textSecondary, 
                    fontWeight: 400,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
                  }}>Signal strength: {Math.round(selectedDomain.strength * 100)}%</div>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wide mb-3" style={{ 
                  color: TOKENS.colors.textTertiary, 
                  letterSpacing: '0.25px',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
                }}>What This Means</h4>
                <p className="text-on-glass" style={{ 
                  color: TOKENS.colors.textPrimary, 
                  fontSize: '15px', 
                  lineHeight: '1.6', 
                  textShadow: '0 1px 2px rgba(0,0,0,0.4)',
                  fontWeight: 400,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
                }}>{selectedDomain.summary}</p>
              </div>
              
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wide mb-3" style={{ 
                  color: TOKENS.colors.textTertiary, 
                  letterSpacing: '0.25px',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
                }}>Downstream Effects</h4>
                <div className="space-y-2">
                  {selectedDomain.ripple.map((effect, i) => (
                    <motion.div 
                      key={i} 
                      className="effect-chip" 
                      style={{
                        backdropFilter: getBlur('chip'), 
                        WebkitBackdropFilter: getBlur('chip'), 
                        background: 'rgba(10,14,20,0.50)',
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
                        ease: MOTION_SPEC.easings.horizonStandard
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
                        fontWeight: 400,
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
                      }}>{effect}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wide mb-3" style={{ 
                  color: TOKENS.colors.textTertiary, 
                  letterSpacing: '0.25px',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
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
                            ease: MOTION_SPEC.easings.horizonStandard
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
                letterSpacing: '0.25px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
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
          outline: ${MOTION_SPEC.a11y.focus_ring.style};
          outline-offset: ${MOTION_SPEC.a11y.focus_ring.offset_px}px;
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
