
import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Globe, X, TrendingUp, TrendingDown, Minus, ArrowRight, Info, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import LyraLogo from '../core/LyraLogo';

// ============================================================================
// MACRO CONSTELLATION — OS HORIZON V5.4 EXPRESS
// Real-time balance of global macro forces.
// Glass diffused celestial intelligence — breathing, balanced, quiet.
// v3.5.1: Staggered tooltip reveal + refined hover physics
// v3.5.3: Micro-polish (typography density, halo decay, node expansion, attribution)
// v4.3: Drawer refinement (copy clarity, spacing harmony, staggered load)
// v5.1: Spatial flow — drawer emerges from orb, filament beam link
// v5.3: Cinematic motion — Apple-grade timing, easing, depth sequencing
// v5.4: Express mode — instantaneous, value-driven, keyboard flow
// ============================================================================

const TOKENS = {
  HORIZON: {
    globalScale: 1.45,
    globalScaleMd: 1.3,
    globalScaleSm: 1.1,
    clusterOffsetY: -4,
    orbitRadiusScale: 1.25,
    labelDistanceScale: 1.10,
    interactionRadiusScale: 1.2,
    glassBg: 'rgba(10,14,20,0.70)',
    glassBorder: 'rgba(160,191,255,0.10)',
    glassEdgeLight: 'rgba(160,191,255,0.10)',
    glassInner: 'rgba(255,255,255,0.04)',
    panelShadow: '0 0 80px rgba(0,0,0,0.4), 0 0 40px rgba(160,191,255,0.08)',
    drawerGlass: 'rgba(10,15,22,0.72)',
    drawerTint: 'rgba(10,15,22,0.45)',
    drawerBlur: 'blur(20px)',
    drawerEdgeBloom: 'rgba(160,191,255,0.10)',
    drawerDivider: 'rgba(255,255,255,0.06)',
    backdropBlur: 'blur(10px)',
    backdropOpacity: 0.30,
    blurPanel: 'blur(20px)',
    blurChip: 'blur(16px)',
    vignetteColor: '#070A0F',
    vignetteOpacity: 0.28,
    vignetteBlur: 24,
    vignetteSpread: 10,
    localBloomIntensity: 0.18,
    localBloomRadius: [220, 280],
    sheenEnabled: false,
    easing: [0.4, 0, 0.2, 1],
    easingApple: [0.32, 0.72, 0, 1],
    easingExpress: [0.2, 0, 0.2, 1],
    easingExpressClose: [0.4, 0, 1, 1],
    easingAppleCinematic: [0.28, 0.11, 0.32, 1],
    easingExit: [0.4, 0, 1, 1],
    easingElastic: [0.22, 1, 0.36, 1],
    easingSine: [0.61, 1, 0.88, 1],
    easingCubic: [0.33, 1, 0.68, 1],
    easingInOutCubic: [0.65, 0, 0.35, 1],
    easingOutQuad: [0.25, 0.46, 0.45, 0.94],
    overshoot: [0.34, 1.56, 0.64, 1],
    t_hover: 0.12,
    t_hoverOut: 0.95,
    t_haloDecay: 0.18,
    t_haloDecayOpacity: 0.18,
    t_labelLag: 0.08,
    t_tooltipOpen: 0.16,
    t_tooltipTextStagger: 0.08,
    t_tooltipTextDuration: 0.14,
    t_tooltipClose: 0.12,
    t_orbBreathIn: 0.14,
    t_orbBreathOut: 0.14,
    t_beamLink: 0.14,
    t_drawerOpen: 0.14,
    t_drawerOpenBurst: 0.11,
    t_drawerClose: 0.12,
    t_drawerCloseBurst: 0.10,
    t_contentStagger: 0.06,
    t_contentStaggerBurst: 0,
    t_backgroundDepthFade: 0.14,
    t_backgroundDepthClear: 0.14,
    t_drawerSwitch: 0.10,
    t_prefetch: 0.12,
    t_breathe: 4.5,
    t_pulse: 3,
    t_drift: 20,
    t_orbit: 10,
    t_sweep: 12,
    t_sheen: 24,
    t_tooltipPulse: 0.9,
    t_ringFill: 0.3,
    t_parallax: 0.12,
    t_parallaxOut: 0.16,
    parallaxOffset: 6,
    parallaxResponse: 0.4,
    translateSnap: 48,
    t_staggerSection: [0.06, 0.12, 0.18, 0.24],
    bgBase: '#06080D',
    bgEnd: '#0A0E14',
    bgSubsurfaceCenter: '#121823',
    bgSubsurfaceEdge: '#0B1016',
    bloomCenter: '#1A2732',
    bloomEdge: '#090B10'
  },
  MACRO: {
    fx: {
      core: '#6AC7F7',
      halo: 'rgba(106,199,247,0.38)',
      text: '#B8E7FF',
      sceneGlow: 'rgba(106,199,247,0.12)',
      bloom: 'rgba(106,199,247,0.18)',
      zDepth: -14
    },
    rates: {
      core: '#C0A6FF',
      halo: 'rgba(192,166,255,0.38)',
      text: '#DECFFF',
      sceneGlow: 'rgba(192,166,255,0.12)',
      bloom: 'rgba(192,166,255,0.18)',
      zDepth: -6
    },
    growth: {
      core: '#B4F7C0',
      halo: 'rgba(180,247,192,0.38)',
      text: '#D4FFDE',
      sceneGlow: 'rgba(180,247,192,0.12)',
      bloom: 'rgba(180,247,192,0.18)',
      zDepth: 8
    },
    geopolitics: {
      core: '#FFD37A',
      halo: 'rgba(255,211,122,0.38)',
      text: '#FFE8B8',
      sceneGlow: 'rgba(255,211,122,0.12)',
      bloom: 'rgba(255,211,122,0.18)',
      zDepth: 12
    }
  },
  colors: {
    textPrimary: "rgba(232,235,239,1)",
    textSecondary: "rgba(232,235,239,0.80)",
    textLabel: "rgba(191,199,212,1)",
    textChip: "rgba(232,235,239,0.85)",
    textTertiary: "rgba(255,255,255,0.65)"
  }
};

const ANGLES = {
  rates: 22.5,
  fx: 160.0,
  growth: 297.5,
  geopolitics: 75.0
};

const RADII = {
  rates: 0.35,
  fx: 0.39,
  growth: 0.37,
  geopolitics: 0.32
};

const MOCK_DOMAINS = [
  { 
    id: "rates", 
    posture: "hawkish", 
    confidence_pct: 78, 
    strength: 0.82, 
    summary: "Fed holding firm; terminal rate expectations drift higher on sticky services inflation.", 
    ripple: ["Credit spreads widen", "Tech multiples compress", "EM funding costs rise"], 
    addendum: null,
    last_updated_iso: new Date().toISOString(), 
    sparkline: [0.72, 0.74, 0.76, 0.75, 0.78, 0.80, 0.79, 0.81, 0.82],
    confidenceDelta: 2
  },
  { 
    id: "fx", 
    posture: "stable", 
    confidence_pct: 65, 
    strength: 0.58, 
    summary: "Dollar steady as interest-rate gaps shrink; risk trades unwind slowly.", 
    ripple: ["EM currencies stabilize", "Energy imports neutral", "Bond yields remain contained, supporting moderate equity valuations."],
    addendum: "Next 48h: FX likely stable; carry re-risk limited unless yields diverge.",
    last_updated_iso: new Date().toISOString(), 
    sparkline: [0.60, 0.59, 0.58, 0.57, 0.58, 0.59, 0.58, 0.57, 0.58],
    confidenceDelta: -3
  },
  { 
    id: "growth", 
    posture: "softening", 
    confidence_pct: 71, 
    strength: 0.68, 
    summary: "China slowdown weighs on global demand; US consumer resilient but moderating.", 
    ripple: ["Commodity prices soften", "Defensive rotation begins", "Services hold up"],
    addendum: null,
    last_updated_iso: new Date().toISOString(), 
    sparkline: [0.75, 0.74, 0.72, 0.70, 0.69, 0.68, 0.67, 0.68, 0.68],
    confidenceDelta: -1
  },
  { 
    id: "geopolitics", 
    posture: "tightening", 
    confidence_pct: 58, 
    strength: 0.72, 
    summary: "Energy security concerns persist; trade fragmentation continues to reshape supply chains.", 
    ripple: ["Energy premium elevated", "Onshoring accelerates", "Regional trade blocs solidify"],
    addendum: null,
    last_updated_iso: new Date().toISOString(), 
    sparkline: [0.65, 0.66, 0.68, 0.70, 0.71, 0.72, 0.71, 0.72, 0.72],
    confidenceDelta: 4
  }
];

const MacroConstellation = ({ onOpenSignalDrawer }) => {
  const containerRef = useRef(null);
  const capsuleRef = useRef(null);
  const footerRef = useRef(null);
  const constellationRef = useRef(null);
  const [hoveredDomain, setHoveredDomain] = useState(null);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [previousDomain, setPreviousDomain] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const [capsuleBounds, setCapsuleBounds] = useState(null);
  const [isMorphing, setIsMorphing] = useState(false);
  const [isLowPower, setIsLowPower] = useState(false);
  const [constellationShift, setConstellationShift] = useState(0);
  const [orbitScale, setOrbitScale] = useState(1.0);
  const [showEquilibriumTip, setShowEquilibriumTip] = useState(false);
  const [haloAnimating, setHaloAnimating] = useState(false);
  const [noiseDrift, setNoiseDrift] = useState(0);
  const [isStatusBarHovered, setIsStatusBarHovered] = useState(false);
  const [filamentFlash, setFilamentFlash] = useState(null);
  const [isSwitchingNode, setIsSwitchingNode] = useState(false);
  const [viewportSize, setViewportSize] = useState('lg');
  const [drawerOrigin, setDrawerOrigin] = useState(null);
  const [showBeam, setShowBeam] = useState(false);
  const [swayTime, setSwayTime] = useState(0);
  const [orbPulseActive, setOrbPulseActive] = useState(false);
  const [openHistory, setOpenHistory] = useState([]);
  const [isBurstMode, setIsBurstMode] = useState(false);
  const [prefetchedDomain, setPrefetchedDomain] = useState(null);
  const prefetchTimerRef = useRef(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const parallaxX = useSpring(mouseX, { damping: 20, stiffness: 100 });
  const parallaxY = useSpring(mouseY, { damping: 20, stiffness: 100 });
  
  const bgParallaxX = useSpring(mouseX, { damping: 25, stiffness: 80 });
  const bgParallaxY = useSpring(mouseY, { damping: 25, stiffness: 80 });
  
  const drawerParallaxX = useSpring(mouseX, { damping: 30, stiffness: 70 });
  const drawerParallaxY = useSpring(mouseY, { damping: 30, stiffness: 70 });

  const domains = MOCK_DOMAINS;

  const headerSafe = 64;
  const footerH = 84;
  const footerBleed = 28;
  const haloBleed = 18;
  const minClear = 24;
  const safeBottom = footerH + footerBleed + haloBleed + minClear;

  const getGlobalScale = useCallback(() => {
    if (viewportSize === 'sm') return TOKENS.HORIZON.globalScaleSm;
    if (viewportSize === 'md') return TOKENS.HORIZON.globalScaleMd;
    return TOKENS.HORIZON.globalScale;
  }, [viewportSize]);

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

  const connections = useMemo(() => [
    { from: "rates", to: "growth", relationship: 0.7 },
    { from: "fx", to: "geopolitics", relationship: 0.6 },
    { from: "rates", to: "fx", relationship: 0.8 },
    { from: "growth", to: "geopolitics", relationship: 0.5 }
  ], []);

  // Burst mode detection
  useEffect(() => {
    const now = Date.now();
    const recentOpens = openHistory.filter(time => now - time < 4000);
    setIsBurstMode(recentOpens.length >= 2);
  }, [openHistory]);

  // Prefetch on hover
  const handleDomainHover = useCallback((domain) => {
    setHoveredDomain(domain?.id || null);
    
    if (domain) {
      if (prefetchTimerRef.current) clearTimeout(prefetchTimerRef.current);
      prefetchTimerRef.current = setTimeout(() => {
        setPrefetchedDomain(domain);
      }, TOKENS.HORIZON.t_prefetch * 1000);
    } else {
      if (prefetchTimerRef.current) {
        clearTimeout(prefetchTimerRef.current);
        prefetchTimerRef.current = null;
      }
    }
  }, []);

  useEffect(() => {
    if (shouldReduceMotion) return;
    
    const interval = setInterval(() => {
      setNoiseDrift(prev => (prev + 0.3) % 1000);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [shouldReduceMotion]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current || shouldReduceMotion) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const normX = ((e.clientX - centerX) / (rect.width / 2));
      const normY = ((e.clientY - centerY) / (rect.height / 2));
      
      mouseX.set(normX * 14);
      mouseY.set(normY * 14);
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
    const updateViewport = () => {
      const width = window.innerWidth;
      if (width < 768) setViewportSize('sm');
      else if (width < 1024) setViewportSize('md');
      else setViewportSize('lg');
    };
    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: 700 });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const { cx, cy, orbitBaseRadius } = useMemo(() => {
    const globalScale = getGlobalScale();
    const safeW = dimensions.width;
    const safeH = dimensions.height - safeBottom - headerSafe;
    const centerX = dimensions.width / 2;
    const centerY = headerSafe + (safeH / 2) + (safeH * TOKENS.HORIZON.clusterOffsetY / 100);
    
    const baseRadius = Math.min(safeW, safeH) * 0.34 * TOKENS.HORIZON.orbitRadiusScale * globalScale;
    const shortH = window.innerHeight <= 820;
    const radius = baseRadius * (shortH ? 0.92 : 1.00) * orbitScale;
    
    return { cx: centerX, cy: centerY, orbitBaseRadius: radius };
  }, [dimensions, safeBottom, headerSafe, orbitScale, getGlobalScale]);

  const nucleusOffset = useMemo(() => {
    const angleRad = (balanceAngle * Math.PI) / 180;
    const offsetMagnitude = balanceBias * 12;
    return {
      x: Math.sin(angleRad) * offsetMagnitude,
      y: -Math.cos(angleRad) * offsetMagnitude
    };
  }, [balanceAngle, balanceBias]);

  const getOrbPosition = useCallback((domainId, strength, time = 0, parallaxOffsetX = 0, parallaxOffsetY = 0) => {
    const angle = ANGLES[domainId] * (Math.PI / 180);
    const globalScale = getGlobalScale();
    const baseSize = 40 * globalScale;
    const sizeRange = 20 * globalScale;
    const diameter = baseSize + (strength * sizeRange);
    const radius = diameter / 2;
    
    const baseRadiusFactor = RADII[domainId];
    const strengthFactor = 0.9 + (strength * 0.2);
    const adjustedRadius = orbitBaseRadius * baseRadiusFactor * strengthFactor;
    
    const swayPhase = (ANGLES[domainId] / 360) * Math.PI * 2;
    const swayRadius = 8 + (Math.abs(Math.sin(swayPhase)) * 2);
    const swayAngle = (time * 2 * Math.PI) / TOKENS.HORIZON.t_orbit;
    const swayX = Math.cos(swayAngle + swayPhase) * swayRadius;
    const swayY = Math.sin(swayAngle + swayPhase) * swayRadius;
    
    const zDepth = TOKENS.MACRO[domainId]?.zDepth || 0;
    const zScale = 1 + (zDepth * 0.003);
    const parallaxFactor = zDepth * 0.1;
    
    const orbX = cx + adjustedRadius * Math.cos(angle) * zScale + swayX + (parallaxOffsetX * parallaxFactor);
    const orbY = cy + adjustedRadius * Math.sin(angle) * zScale + swayY + (parallaxOffsetY * parallaxFactor);
    
    return { x: orbX, y: orbY, radius, diameter, zDepth };
  }, [cx, cy, orbitBaseRadius, getGlobalScale]);

  const getLabelPosition = useCallback((orbX, orbY, orbRadius) => {
    const vx = orbX - cx;
    const vy = orbY - cy;
    const norm = Math.hypot(vx, vy) || 1;
    const nx = vx / norm;
    const ny = vy / norm;
    const offset = orbRadius + (16 * TOKENS.HORIZON.labelDistanceScale);
    
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
  }, [dimensions, getOrbPosition, domains, haloBleed, minClear]);

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
    if (selectedDomain?.id === domain.id) return;
    
    setOpenHistory(prev => [...prev, Date.now()]);

    // Capture the orb's position for the drawer origin animation
    const domainPos = getOrbPosition(domain.id, domain.strength, swayTime, 0, 0); // Pass 0,0 for parallax as drawer itself has its own
    const containerRect = containerRef.current?.getBoundingClientRect();
    
    if (containerRect) {
      setDrawerOrigin({
        x: domainPos.x, // relative to containerRef
        y: domainPos.y, // relative to containerRef
        screenX: containerRect.left + domainPos.x, // absolute screen X
        screenY: containerRect.top + domainPos.y    // absolute screen Y
      });
    }

    if (selectedDomain) {
      setIsSwitchingNode(true);
      setPreviousDomain(selectedDomain);
      
      setFilamentFlash(domain.id);
      setTimeout(() => setFilamentFlash(null), 200);
      
      setTimeout(() => {
        setSelectedDomain(domain);
        setShowBeam(true); // Show beam after switching is complete
        setIsSwitchingNode(false);
        setPreviousDomain(null);
      }, TOKENS.HORIZON.t_drawerSwitch * 1000);
    } else {
      setOrbPulseActive(true); // Start orb pulse before halo animation
      setTimeout(() => {
        setOrbPulseActive(false); // End orb pulse as halo fades
        setShowBeam(true); // Show beam after orb pulse finishes
      }, TOKENS.HORIZON.t_orbBreathIn * 1000);
      
      setTimeout(() => {
        setSelectedDomain(domain); // Select domain after beam has formed
      }, (TOKENS.HORIZON.t_orbBreathIn + TOKENS.HORIZON.t_beamLink) * 1000);
    }
  }, [selectedDomain, getOrbPosition, swayTime]);

  const handleCloseDrawer = useCallback(() => {
    setShowBeam(false); // Hide beam immediately to start its exit animation
    setOrbPulseActive(true); // Start orb pulse for exit
    
    setTimeout(() => {
      setOrbPulseActive(false); // End orb pulse as drawer collapses
    }, TOKENS.HORIZON.t_orbBreathOut * 1000); // Using a separate token for orb exit breathe
    
    const closeDuration = shouldReduceMotion 
      ? 0.09 
      : isBurstMode 
        ? TOKENS.HORIZON.t_drawerCloseBurst 
        : TOKENS.HORIZON.t_drawerClose;
    
    setTimeout(() => {
      setSelectedDomain(null);
      setPreviousDomain(null);
      setIsSwitchingNode(false);
      setDrawerOrigin(null); // Reset drawer origin
    }, closeDuration * 1000); // Delay state reset to allow drawer exit animation
  }, [shouldReduceMotion, isBurstMode]);

  const handleNextDomain = useCallback(() => {
    if (!selectedDomain) return;
    const currentIndex = domains.findIndex(d => d.id === selectedDomain.id);
    const nextIndex = (currentIndex + 1) % domains.length;
    handleOpenDrawer(domains[nextIndex]);
  }, [selectedDomain, domains, handleOpenDrawer]);

  const handlePrevDomain = useCallback(() => {
    if (!selectedDomain) return;
    const currentIndex = domains.findIndex(d => d.id === selectedDomain.id);
    const prevIndex = (currentIndex - 1 + domains.length) % domains.length;
    handleOpenDrawer(domains[prevIndex]);
  }, [selectedDomain, domains, handleOpenDrawer]);

  const handleDomainByKey = useCallback((key) => {
    const domainMap = { '1': 'fx', '2': 'rates', '3': 'growth', '4': 'geopolitics' };
    const domainId = domainMap[key];
    if (domainId) {
      const domain = domains.find(d => d.id === domainId);
      if (domain) handleOpenDrawer(domain);
    }
  }, [domains, handleOpenDrawer]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedDomain) {
        handleCloseDrawer();
      } else if (e.key === 'ArrowLeft' && selectedDomain) {
        e.preventDefault();
        handlePrevDomain();
      } else if (e.key === 'ArrowRight' && selectedDomain) {
        e.preventDefault();
        handleNextDomain();
      } else if (e.key === 'Enter' && selectedDomain) {
        // Trigger implications action (or view details button click)
        const viewDetailsButton = document.querySelector('.drawer-view-details-button');
        if (viewDetailsButton) viewDetailsButton.click();
      } else if (['1', '2', '3', '4'].includes(e.key)) {
        handleDomainByKey(e.key);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedDomain, handleCloseDrawer, handlePrevDomain, handleNextDomain, handleDomainByKey]);

  useEffect(() => {
    if (shouldReduceMotion) return;
    
    let rafId;
    let lastTime = Date.now();
    
    const animate = () => {
      const now = Date.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      
      setSwayTime(prev => prev + delta);
      rafId = requestAnimationFrame(animate);
    };
    
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [shouldReduceMotion]);

  const getBlur = useCallback((type) => {
    if (isLowPower) return type === 'panel' ? 'blur(16px)' : 'blur(12px)';
    return type === 'panel' ? TOKENS.HORIZON.blurPanel : TOKENS.HORIZON.blurChip;
  }, [isLowPower]);

  // Calculate the fixed screen position of the drawer's top-left corner
  const drawerFinalPosition = useMemo(() => {
    if (typeof window === 'undefined') return { x: 0, y: 0 };
    const calculatedDrawerWidth = Math.max(420, Math.min(window.innerWidth * 0.32, 500));
    return {
      x: window.innerWidth - calculatedDrawerWidth,
      y: 0
    };
  }, []);

  const getTimings = useCallback(() => {
    if (shouldReduceMotion) {
      return {
        open: 0.09,
        close: 0.09,
        stagger: 0,
        backdrop: 0.09
      };
    }
    if (isBurstMode) {
      return {
        open: TOKENS.HORIZON.t_drawerOpenBurst,
        close: TOKENS.HORIZON.t_drawerCloseBurst,
        stagger: TOKENS.HORIZON.t_contentStaggerBurst,
        backdrop: 0.11
      };
    }
    return {
      open: TOKENS.HORIZON.t_drawerOpen,
      close: TOKENS.HORIZON.t_drawerClose,
      stagger: TOKENS.HORIZON.t_contentStagger,
      backdrop: TOKENS.HORIZON.t_backgroundDepthFade
    };
  }, [shouldReduceMotion, isBurstMode]);

  const timings = getTimings();

  return (
    <motion.section 
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} 
      aria-label="Macro Constellation"
      style={{ maxWidth: '84vw', margin: '0 auto' }}
    >
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
            }}>Macro Constellation</h2>
            <p style={{ 
              fontSize: '13px', 
              color: TOKENS.colors.textTertiary,
              letterSpacing: '0.2em',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
            }}>Real-time balance of global macro forces.</p>
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
          height: '700px',
          background: `linear-gradient(184deg, ${TOKENS.HORIZON.bgBase} 0%, ${TOKENS.HORIZON.bgEnd} 100%)`,
          border: '1px solid rgba(160,191,255,0.08)',
          borderRadius: '24px',
          paddingTop: '4vh',
          paddingBottom: '5vh',
          position: 'relative'
        }}>
        
        <motion.div 
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(900px circle at 52% 48%, ${TOKENS.HORIZON.bgSubsurfaceCenter} 0%, ${TOKENS.HORIZON.bgSubsurfaceEdge} 70%)`,
            opacity: 0.35,
            borderRadius: '24px',
            pointerEvents: 'none',
            zIndex: 1
          }}
          animate={{
            x: shouldReduceMotion ? 0 : bgParallaxX.get() * TOKENS.HORIZON.parallaxOffset * 0.6,
            y: shouldReduceMotion ? 0 : bgParallaxY.get() * TOKENS.HORIZON.parallaxOffset * 0.6
          }}
          transition={{
            duration: TOKENS.HORIZON.t_parallax,
            ease: TOKENS.HORIZON.easingApple
          }}
        />
        
        <motion.div 
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3Cfilter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
            opacity: 0.15,
            borderRadius: '24px',
            pointerEvents: 'none',
            zIndex: 2
          }}
          animate={{
            backgroundPosition: [`${noiseDrift}px 0px`, `${noiseDrift + 0.3}px 0px`]
          }}
          transition={{ duration: 1, ease: 'linear' }}
        />
        
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse at center, transparent 60%, ${TOKENS.HORIZON.vignetteColor} 100%)`,
            opacity: TOKENS.HORIZON.vignetteOpacity,
            filter: `blur(${TOKENS.HORIZON.vignetteBlur}px)`,
            borderRadius: '24px',
            pointerEvents: 'none',
            zIndex: 2
          }}
        />
        
        {domains.map((domain) => {
          const pos = getOrbPosition(domain.id, domain.strength, swayTime, parallaxX.get(), parallaxY.get());
          const bloomRadius = Math.min(...TOKENS.HORIZON.localBloomRadius) + (domain.strength * (Math.max(...TOKENS.HORIZON.localBloomRadius) - Math.min(...TOKENS.HORIZON.localBloomRadius)));
          
          return (
            <motion.div
              key={`bloom-field-${domain.id}`}
              style={{
                position: 'absolute',
                left: pos.x,
                top: pos.y,
                width: bloomRadius * 2,
                height: bloomRadius * 2,
                transform: 'translate(-50%, -50%)',
                background: `radial-gradient(circle, ${getDomainBloom(domain.id)}, transparent 72%)`,
                opacity: selectedDomain ? 0.12 : TOKENS.HORIZON.localBloomIntensity,
                mixBlendMode: 'screen',
                pointerEvents: 'none',
                zIndex: 2,
                transition: 'opacity 0.3s ease'
              }}
            />
          );
        })}
        
        <motion.div 
          ref={constellationRef} 
          className="constellation-layer" 
          style={{ 
            position: 'absolute', 
            inset: 0, 
            willChange: 'transform',
            zIndex: 3,
            opacity: selectedDomain ? 0.9 : 1
          }}
          animate={{
            y: constellationShift,
            x: shouldReduceMotion ? 0 : parallaxX.get() * TOKENS.HORIZON.parallaxResponse,
            y: shouldReduceMotion ? 0 : parallaxY.get() * TOKENS.HORIZON.parallaxResponse
          }}
          transition={{ 
            y: shouldReduceMotion ? { duration: 0 } : { duration: 0.4, ease: TOKENS.HORIZON.easing },
            x: shouldReduceMotion ? { duration: 0 } : { duration: TOKENS.HORIZON.t_parallax, ease: TOKENS.HORIZON.easingApple },
            y: shouldReduceMotion ? { duration: 0 } : { duration: TOKENS.HORIZON.t_parallaxOut, ease: TOKENS.HORIZON.easingApple }
          }}
        >
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
              width: `${22 * getGlobalScale()}px`,
              height: `${22 * getGlobalScale()}px`,
              borderRadius: '999px',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              background: 'rgba(160,191,255,0.12)',
              boxShadow: '0 0 80px rgba(160,191,255,0.15), inset 0 0 0 1px rgba(255,255,255,0.08)',
              pointerEvents: 'none'
            }}
            animate={shouldReduceMotion ? {} : {
              scale: [0.985, 1.025, 0.985],
              opacity: [0.985, 1, 0.985]
            }}
            transition={{
              duration: TOKENS.HORIZON.t_breathe,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            aria-hidden="true" />

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

          <svg width={dimensions.width} height={dimensions.height} className="absolute inset-0" style={{ overflow: 'visible', zIndex: 2 }}>
            <defs>
              {domains.map((domain) => (
                <React.Fragment key={`defs-${domain.id}`}>
                  <radialGradient id={`nucleus-${domain.id}`}>
                    <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
                    <stop offset="45%" stopColor={getDomainColor(domain.id)} stopOpacity="0.85" />
                    <stop offset="70%" stopColor="rgba(255,255,255,0)" stopOpacity="0" />
                  </radialGradient>
                  <filter id={`bloom-${domain.id}`} x="-100%" y="-100%" width="300%" height="300%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="20" result="blur" />
                    <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.38 0" result="bloom" />
                    <feMerge>
                      <feMergeNode in="bloom" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <filter id={`scatter-${domain.id}`}>
                    <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
                    <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.05 0" />
                  </filter>
                </React.Fragment>
              ))}
              {connections.map((conn, i) => (
                <linearGradient key={`conn-grad-${i}`} id={`conn-grad-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6AC7F7" stopOpacity="0.20" />
                  <stop offset="50%" stopColor="#B4F7C0" stopOpacity="0.20" />
                  <stop offset="100%" stopColor="#FFD37A" stopOpacity="0.20" />
                </linearGradient>
              ))}
            </defs>

            <g style={{ zIndex: 2, mixBlendMode: 'screen' }}>
              {connections.map((conn, i) => {
                const fromDomain = domains.find(d => d.id === conn.from);
                const toDomain = domains.find(d => d.id === conn.to);
                const fromPos = getOrbPosition(conn.from, fromDomain.strength, swayTime, parallaxX.get(), parallaxY.get());
                const toPos = getOrbPosition(conn.to, toDomain.strength, swayTime, parallaxX.get(), parallaxY.get());
                const isAdjacent = hoveredDomain === conn.from || hoveredDomain === conn.to || selectedDomain?.id === conn.from || selectedDomain?.id === conn.to;
                const isFlashing = filamentFlash === conn.from || filamentFlash === conn.to;
                const pathD = `M ${fromPos.x},${fromPos.y} Q ${cx},${cy} ${toPos.x},${toPos.y}`;
                
                return (
                  <motion.path 
                    key={`connection-${i}`} 
                    d={pathD} 
                    stroke={`url(#conn-grad-${i})`} 
                    strokeWidth="1" 
                    strokeLinecap="round" 
                    fill="none"
                    animate={{ 
                      opacity: isFlashing
                        ? [0.20, 0.60, 0.20]
                        : isAdjacent 
                          ? selectedDomain ? 0.15 : [0.20, 0.45, 0.20]
                          : shouldReduceMotion 
                            ? selectedDomain ? 0.10 : 0.20 
                            : selectedDomain ? [0.10, 0.14, 0.10] : [0.16, 0.24, 0.16]
                    }}
                    transition={
                      isFlashing
                        ? { duration: 0.2, ease: TOKENS.HORIZON.easing }
                        : isAdjacent
                          ? { duration: 0.3, ease: TOKENS.HORIZON.easing }
                          : { 
                              duration: TOKENS.HORIZON.t_pulse, 
                              repeat: Infinity, 
                              ease: "easeInOut" 
                            }
                    }
                    style={{ 
                      filter: 'drop-shadow(0 2px 12px rgba(0,0,0,0.4))'
                    }} 
                  />
                );
              })}
            </g>

            <g style={{ zIndex: 3, mixBlendMode: 'screen' }}>
              {domains.map((domain, idx) => {
                const pos = getOrbPosition(domain.id, domain.strength, swayTime, parallaxX.get(), parallaxY.get());
                const color = getDomainColor(domain.id);
                const bloom = getDomainBloom(domain.id);
                const isHovered = hoveredDomain === domain.id;
                const isSelected = selectedDomain?.id === domain.id;
                const isPulsing = orbPulseActive && (isHovered || isSelected || selectedDomain === null && hoveredDomain === domain.id); // Active for both open/close state on relevant orb
                const isSurrounding = (hoveredDomain || selectedDomain) && hoveredDomain !== domain.id && selectedDomain?.id !== domain.id;
                const breathPhase = idx * 1.2;

                return (
                  <g key={domain.id}>
                    <motion.circle 
                      cx={pos.x} 
                      cy={pos.y} 
                      r={pos.radius + 40} 
                      fill={bloom}
                      style={{ 
                        filter: 'blur(20px)', 
                        pointerEvents: 'none'
                      }}
                      animate={shouldReduceMotion ? {} : {
                        opacity: isPulsing
                          ? [0.38, 0.55, 0.38]
                          : isHovered || isSelected
                            ? 0.55
                            : isSurrounding 
                              ? 0.36
                              : [0.38, 0.42, 0.38],
                        scale: isPulsing
                          ? [1, 1.08, 1]
                          : isHovered || isSelected
                            ? 1.05 
                            : isSurrounding
                              ? 1
                              : [0.985, 1.025, 0.985]
                      }}
                      transition={
                        isPulsing
                          ? { duration: TOKENS.HORIZON.t_orbBreathIn, ease: TOKENS.HORIZON.easingSine }
                          : isHovered || isSelected || isSurrounding
                            ? { 
                                duration: isHovered || isSelected ? TOKENS.HORIZON.t_hover : TOKENS.HORIZON.t_hoverOut, 
                                ease: TOKENS.HORIZON.easingApple 
                              }
                            : { 
                                duration: TOKENS.HORIZON.t_breathe, 
                                repeat: Infinity, 
                                ease: "easeInOut",
                                delay: breathPhase
                              }
                      }
                    />
                    
                    <circle 
                      cx={pos.x} 
                      cy={pos.y} 
                      r={pos.radius + 2} 
                      fill="none"
                      stroke="rgba(255,255,255,0.05)"
                      strokeWidth="2"
                      style={{ 
                        filter: `url(#scatter-${domain.id})`,
                        pointerEvents: 'none'
                      }}
                    />
                    
                    <AnimatePresence>
                      {(isHovered || isSelected) && (
                        <motion.circle 
                          cx={pos.x} 
                          cy={pos.y} 
                          r={pos.radius + 11} 
                          fill={bloom}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 0.6, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ 
                            opacity: { duration: TOKENS.HORIZON.t_haloDecay, ease: TOKENS.HORIZON.easingSine },
                            scale: { duration: TOKENS.HORIZON.t_hover, ease: TOKENS.HORIZON.easingApple }
                          }}
                          style={{ 
                            filter: 'blur(16px)', 
                            pointerEvents: 'none'
                          }}
                        />
                      )}
                    </AnimatePresence>
                    
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
                        scale: isPulsing
                          ? [1, 1.05, 1]
                          : isHovered || isSelected
                            ? 1.05
                            : [0.985, 1.025, 0.985],
                        opacity: isPulsing
                          ? [0.985, 1, 0.985]
                          : isHovered || isSelected
                            ? 1 
                            : isSurrounding
                              ? 0.88
                              : [0.985, 1, 0.985]
                      }}
                      transition={
                        isPulsing
                          ? { duration: TOKENS.HORIZON.t_orbBreathIn, ease: TOKENS.HORIZON.easingSine }
                          : isHovered || isSelected || isSurrounding
                            ? { 
                                duration: isHovered || isSelected ? TOKENS.HORIZON.t_hover : TOKENS.HORIZON.t_hoverOut, 
                                ease: TOKENS.HORIZON.easingApple 
                              }
                            : { 
                                duration: TOKENS.HORIZON.t_breathe, 
                                repeat: Infinity, 
                                ease: "easeInOut",
                                delay: breathPhase
                              }
                      }
                      onMouseEnter={() => handleDomainHover(domain)} 
                      onMouseLeave={() => handleDomainHover(null)}
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

          {domains.map((domain) => {
            const orbPos = getOrbPosition(domain.id, domain.strength, swayTime, parallaxX.get(), parallaxY.get());
            const labelPos = getLabelPosition(orbPos.x, orbPos.y, orbPos.radius);
            const isHovered = hoveredDomain === domain.id;
            const isSelected = selectedDomain?.id === domain.id;
            
            return (
              <motion.div 
                key={`label-${domain.id}`} 
                className="orb-label" 
                style={{
                  position: 'absolute',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  background: 'rgba(10,14,20,0.50)',
                  border: `1px solid ${TOKENS.HORIZON.glassBorder}`,
                  borderRadius: '10px',
                  padding: '5px 9px',
                  fontWeight: 600,
                  fontSize: '11px',
                  letterSpacing: '0.03em',
                  textTransform: 'lowercase',
                  textShadow: '0 1px 2px rgba(0,0,0,0.4)',
                  pointerEvents: 'none',
                  zIndex: 3,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
                }}
                animate={{
                  left: `${labelPos.x}px`,
                  top: `${labelPos.y}px`,
                  x: '-50%',
                  y: '-50%',
                  color: isHovered || isSelected ? TOKENS.colors.textLabel : getDomainText(domain.id),
                  scale: isHovered || isSelected ? 1.05 : 1,
                  boxShadow: isHovered || isSelected ? '0 0 16px rgba(160,191,255,0.15)' : 'none'
                }}
                transition={{ 
                  left: { duration: TOKENS.HORIZON.t_labelLag, ease: TOKENS.HORIZON.easingApple },
                  top: { duration: TOKENS.HORIZON.t_labelLag, ease: TOKENS.HORIZON.easingApple },
                  color: { duration: TOKENS.HORIZON.t_hover, ease: TOKENS.HORIZON.easing },
                  scale: { duration: TOKENS.HORIZON.t_hover, ease: TOKENS.HORIZON.easing },
                  boxShadow: { duration: TOKENS.HORIZON.t_hover, ease: TOKENS.HORIZON.easing }
                }}
              >
                {domain.id}
              </motion.div>
            );
          })}
        </motion.div>

        <AnimatePresence>
          {hoveredDomain && !selectedDomain && !isMorphing && (
            <motion.div 
              ref={capsuleRef} 
              id={`capsule-${hoveredDomain}`} 
              className="absolute z-50" 
              style={{ 
                left: (() => {
                  const domain = domains.find(d => d.id === hoveredDomain);
                  const pos = getOrbPosition(hoveredDomain, domain.strength, swayTime, parallaxX.get(), parallaxY.get());
                  return pos.x + (70 * getGlobalScale());
                })(),
                top: (() => {
                  const domain = domains.find(d => d.id === hoveredDomain);
                  const pos = getOrbPosition(hoveredDomain, domain.strength, swayTime, parallaxX.get(), parallaxY.get());
                  return pos.y - 50;
                })(),
                transformOrigin: 'center left', 
                pointerEvents: 'auto' 
              }}
              initial={{ opacity: 0, y: -6 }} 
              animate={{ 
                opacity: 1,
                y: 0 
              }} 
              exit={{ opacity: 0, y: -4 }}
              transition={{ 
                opacity: { duration: TOKENS.HORIZON.t_tooltipOpen, ease: TOKENS.HORIZON.easingApple },
                y: { duration: TOKENS.HORIZON.t_tooltipOpen, ease: TOKENS.HORIZON.easingApple }
              }}>
              {(() => {
                const domain = domains.find(d => d.id === hoveredDomain);
                if (!domain) return null;
                return (
                  <div className="cursor-pointer hover-capsule" onClick={() => handleOpenDrawer(domain)} style={{
                    backdropFilter: getBlur('chip'), 
                    WebkitBackdropFilter: getBlur('chip'), 
                    background: TOKENS.HORIZON.glassBg,
                    border: `1px solid ${TOKENS.HORIZON.glassBorder}`, 
                    boxShadow: `${TOKENS.HORIZON.panelShadow}, 0 0 8px rgba(160,191,255,0.08), inset 0 0 0 1px rgba(255,255,255,0.10)`,
                    borderRadius: '18px', 
                    padding: '16px 18px', 
                    minWidth: '300px', 
                    maxWidth: '340px'
                  }}>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ 
                        delay: TOKENS.HORIZON.t_tooltipTextStagger,
                        duration: TOKENS.HORIZON.t_tooltipTextDuration,
                        ease: "easeOut"
                      }}
                    >
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
                        lineHeight: '1.4', 
                        marginBottom: '12px',
                        textShadow: '0 1px 2px rgba(0,0,0,0.4)',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
                      }}>
                        {domain.summary.length > 90 ? domain.summary.substring(0, 87) + '...' : domain.summary}
                      </p>
                      
                      {domain.ripple && domain.ripple.length > 0 && (
                        <div className="flex items-start gap-2 mb-4" style={{ marginTop: '8px' }}>
                          <span style={{ 
                            color: TOKENS.colors.textTertiary, 
                            fontSize: '13px',
                            opacity: 0.85,
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
                          }}>•</span>
                          <p style={{ 
                            color: TOKENS.colors.textTertiary, 
                            fontSize: '13px', 
                            lineHeight: '1.35',
                            opacity: 0.85,
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
                          }}>
                            Downstream: {domain.ripple[0]}
                          </p>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 text-xs" style={{ 
                        color: TOKENS.colors.textTertiary, 
                        minHeight: '44px', 
                        alignItems: 'center' 
                      }}>
                        <ArrowRight className="w-3.5 h-3.5" />
                        <span className="font-medium" style={{ 
                          letterSpacing: '0.25px',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
                        }}>View market implications</span>
                      </div>
                    </motion.div>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>

        <div 
          ref={footerRef} 
          className="balance-footer" 
          onMouseEnter={() => setIsStatusBarHovered(true)}
          onMouseLeave={() => setIsStatusBarHovered(false)}
          style={{
            position: 'absolute',
            left: '14%',
            right: '14%',
            bottom: '32px',
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
            boxShadow: `${TOKENS.HORIZON.panelShadow}, inset 0 0 2px rgba(106,199,247,0.12)`,
            zIndex: 1,
            cursor: 'pointer',
            transition: 'filter 200ms cubic-bezier(0.4,0,0.2,1)',
            filter: isStatusBarHovered ? 'brightness(1.08)' : 'brightness(1)'
          }}>
          <div className="footer-content" style={{ display: 'contents', pointerEvents: 'auto' }}>
            <div className="balance-indicator-container" style={{ width: '160px', position: 'relative' }}>
              <div className="balance-indicator-track" style={{
                height: '2px',
                borderRadius: '999px',
                position: 'relative',
                overflow: 'hidden',
                background: 'linear-gradient(90deg, rgba(106,199,247,0.3), rgba(180,247,192,0.3), rgba(255,211,122,0.3))'
              }}>
                {!shouldReduceMotion && (
                  <motion.div 
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)',
                      width: '100%'
                    }}
                    animate={{
                      x: ['-100%', '100%']
                    }}
                    transition={{
                      duration: TOKENS.HORIZON.t_sweep,
                      repeat: Infinity,
                      ease: 'linear'
                    }}
                  />
                )}
                
                <div style={{
                  position: 'absolute',
                  bottom: '-8px',
                  left: 0,
                  right: 0,
                  height: '8px',
                  background: 'linear-gradient(90deg, rgba(106,199,247,0.15), rgba(180,247,192,0.15), rgba(255,211,122,0.15))',
                  filter: 'blur(8px)',
                  opacity: 0.15
                }} />
                
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
                fontWeight: 400,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
              }}>
                {globalSummary}
              </span>
              
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
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.80 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.18, ease: TOKENS.HORIZON.easingApple }}
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

      <div className="flex justify-center" style={{ marginTop: '10px' }}>
        <p style={{
          fontSize: '9px',
          fontWeight: 400,
          color: TOKENS.colors.textTertiary,
          opacity: 0.55,
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
          letterSpacing: '0.3px'
        }}>
          Data via Lyra models
        </p>
      </div>

      <AnimatePresence>
        {haloAnimating && hoveredDomain && !selectedDomain && (
          <motion.div
            className="fixed z-40"
            style={{
              left: (() => {
                const domain = domains.find(d => d.id === hoveredDomain);
                const pos = getOrbPosition(hoveredDomain, domain.strength, swayTime, parallaxX.get(), parallaxY.get());
                return containerRef.current ? containerRef.current.getBoundingClientRect().left + pos.x : 0;
              })(),
              top: (() => {
                const domain = domains.find(d => d.id === hoveredDomain);
                const pos = getOrbPosition(hoveredDomain, domain.strength, swayTime, parallaxX.get(), parallaxY.get());
                return containerRef.current ? containerRef.current.getBoundingClientRect().top + pos.y : 0;
              })(),
              width: '100px',
              height: '100px',
              transform: 'translate(-50%, -50%)',
              borderRadius: '999px',
              background: `radial-gradient(circle, ${getDomainBloom(hoveredDomain)}, transparent 70%)`,
              pointerEvents: 'none'
            }}
            initial={{ scale: 0.85, opacity: 0.18 }}
            animate={{ scale: 1.10, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: TOKENS.HORIZON.t_haloDecay, 
              ease: TOKENS.HORIZON.easingSine 
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedDomain && (
          <motion.div 
            className="fixed inset-0 z-40" 
            style={{ 
              background: 'rgba(6,8,13,0.70)', 
              backdropFilter: TOKENS.HORIZON.backdropBlur,
              WebkitBackdropFilter: TOKENS.HORIZON.backdropBlur
            }}
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }} 
            animate={{ 
              opacity: TOKENS.HORIZON.backdropOpacity,
              backdropFilter: TOKENS.HORIZON.backdropBlur
            }} 
            exit={{ 
              opacity: 0,
              backdropFilter: 'blur(0px)'
            }}
            transition={{ 
              duration: timings.backdrop, 
              ease: TOKENS.HORIZON.easingOutQuad
            }} 
            onClick={handleCloseDrawer} 
          />
        )}
      </AnimatePresence>
      
      {/* Filament Beam */}
      <AnimatePresence>
        {selectedDomain && showBeam && drawerOrigin && (
          <motion.svg
            className="fixed inset-0 z-[45] pointer-events-none" // z-index between backdrop (z-40) and drawer (z-50)
            style={{ width: '100vw', height: '100vh' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: TOKENS.HORIZON.t_beamLink,
              ease: TOKENS.HORIZON.easingSine
            }}
          >
            <defs>
              <linearGradient id="beam-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={getDomainColor(selectedDomain.id)} stopOpacity="0.35" />
                <stop offset="50%" stopColor="rgba(140,180,255,0.35)" />
                <stop offset="100%" stopColor="rgba(160,191,255,0.15)" />
              </linearGradient>
              <filter id="beam-glow">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.5 0" />
              </filter>
            </defs>
            <motion.line
              x1={drawerOrigin.screenX}
              y1={drawerOrigin.screenY}
              // Target slightly to the right of the drawer's top-left to simulate aiming for the icon
              x2={drawerFinalPosition.x + 60} // Center of the drawer icon is approx 60px from left
              y2={window.innerHeight / 2} // Target vertical center or slightly above, not just top
              stroke="url(#beam-gradient)"
              strokeWidth="2"
              strokeLinecap="round"
              filter="url(#beam-glow)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              exit={{ pathLength: 0, opacity: 0 }}
              transition={{
                pathLength: { 
                  duration: TOKENS.HORIZON.t_beamLink, 
                  ease: TOKENS.HORIZON.easingSine 
                },
                opacity: { 
                  duration: TOKENS.HORIZON.t_beamLink * 0.6, 
                  ease: TOKENS.HORIZON.easingSine 
                }
              }}
            />
          </motion.svg>
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {selectedDomain && !isSwitchingNode && drawerOrigin && (
          <motion.div 
            className="fixed right-0 h-[calc(100vh-72px)] z-50 overflow-y-auto focus-trap" 
            style={{
              top: '72px',
              width: '32vw',
              minWidth: '420px',
              maxWidth: '500px',
              backdropFilter: TOKENS.HORIZON.drawerBlur,
              WebkitBackdropFilter: TOKENS.HORIZON.drawerBlur,
              background: TOKENS.HORIZON.drawerGlass,
              border: `1px solid ${TOKENS.HORIZON.glassBorder}`,
              boxShadow: `${TOKENS.HORIZON.panelShadow}, 0 0 12px ${TOKENS.HORIZON.drawerEdgeBloom}, inset 0 0 0 1px rgba(255,255,255,0.10)`,
              borderRadius: '18px 0 0 18px',
              willChange: 'transform, opacity, backdrop-filter'
            }}
            initial={{ 
              x: TOKENS.HORIZON.translateSnap,
              scale: 0.985,
              opacity: 0
            }} 
            animate={{ 
              x: shouldReduceMotion ? 0 : drawerParallaxX.get() * TOKENS.HORIZON.parallaxResponse,
              y: shouldReduceMotion ? 0 : drawerParallaxY.get() * TOKENS.HORIZON.parallaxResponse,
              scale: 1,
              opacity: 1
            }} 
            exit={{ 
              x: TOKENS.HORIZON.translateSnap,
              scale: 0.985,
              opacity: 0
            }}
            transition={{ 
              x: shouldReduceMotion 
                ? { duration: 0 }
                : { 
                    duration: timings.open, 
                    ease: TOKENS.HORIZON.easingExpress 
                  },
              y: { 
                duration: timings.open, 
                ease: TOKENS.HORIZON.easingExpress 
              },
              scale: { 
                duration: timings.open, 
                ease: TOKENS.HORIZON.easingExpress 
              },
              opacity: { 
                duration: timings.open * 0.7, 
                ease: TOKENS.HORIZON.easingOutQuad 
              }
            }} 
            onClick={(e) => e.stopPropagation()}
            tabIndex={-1}
          >
            
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '100%',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0) 100%)',
              pointerEvents: 'none',
              borderRadius: '18px 0 0 18px'
            }} />
            
            <motion.div 
              className="sticky top-0 z-10 p-5 border-b" 
              style={{ 
                background: TOKENS.HORIZON.drawerTint,
                borderColor: TOKENS.HORIZON.drawerDivider,
                backdropFilter: getBlur('chip')
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: timings.stagger > 0 ? timings.stagger : timings.open * 0.7,
                ease: TOKENS.HORIZON.easingOutQuad
              }}
            >
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
                    <motion.h3 
                      key={selectedDomain.id}
                      initial={{ opacity: 0.7 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: timings.open * 0.5 }}
                      className="font-semibold capitalize" 
                      style={{ 
                        color: TOKENS.colors.textPrimary, 
                        fontSize: '18px',
                        fontWeight: 600,
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'
                      }}>
                      {selectedDomain.id.charAt(0).toUpperCase() + selectedDomain.id.slice(1)}
                    </motion.h3>
                    <div className="flex items-center gap-2 mt-1">
                      {getPostureIcon(selectedDomain.posture)}
                      <span className="font-medium capitalize" style={{ 
                        color: getDomainText(selectedDomain.id), 
                        fontSize: '14px',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
                      }}>{selectedDomain.posture.charAt(0).toUpperCase() + selectedDomain.posture.slice(1)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevDomain}
                    className="p-2 rounded-lg transition-colors hover:bg-white/10"
                    style={{ color: TOKENS.colors.textTertiary, minWidth: '36px', minHeight: '36px' }}
                    aria-label="Previous domain (Arrow Left)"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNextDomain}
                    className="p-2 rounded-lg transition-colors hover:bg-white/10"
                    style={{ color: TOKENS.colors.textTertiary, minWidth: '36px', minHeight: '36px' }}
                    aria-label="Next domain (Arrow Right)"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={handleCloseDrawer} 
                    className="p-2 rounded-lg transition-colors hover:bg-white/10" 
                    style={{ 
                      color: TOKENS.colors.textTertiary, 
                      minWidth: '36px', 
                      minHeight: '36px' 
                    }} 
                    aria-label="Close drawer (ESC)"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="relative w-9 h-9">
                  <svg className="transform -rotate-90" width="36" height="36">
                    <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
                    <motion.circle 
                      key={`ring-${selectedDomain.id}`}
                      cx="18" 
                      cy="18" 
                      r="16" 
                      fill="none" 
                      stroke={getDomainColor(selectedDomain.id)} 
                      strokeWidth="3" 
                      strokeLinecap="round" 
                      strokeDasharray="100"
                      initial={{ strokeDashoffset: 100 }} 
                      animate={{ 
                        strokeDashoffset: 100 - (100 * selectedDomain.confidence_pct / 100),
                        opacity: [0.8, 1, 0.8]
                      }} 
                      transition={{ 
                        strokeDashoffset: { 
                          duration: 0.3,
                          ease: TOKENS.HORIZON.easingElastic
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
                    fontSize: '12px',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'
                  }}>
                    {selectedDomain.confidence_pct}%
                    {selectedDomain.confidenceDelta !== undefined && (
                      <span className={`absolute -right-2 -top-1 text-[8px] ${selectedDomain.confidenceDelta > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {selectedDomain.confidenceDelta > 0 ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-xs font-medium mb-1" style={{ 
                    color: TOKENS.colors.textLabel,
                    letterSpacing: '0.2em',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
                  }}>CONFIDENCE LEVEL</div>
                  <div className="text-sm" style={{ 
                    color: TOKENS.colors.textSecondary, 
                    fontWeight: 400,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
                  }}>Signal strength: {Math.round(selectedDomain.strength * 100)}%</div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              key={`content-${selectedDomain.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: timings.open * 0.8,
                ease: TOKENS.HORIZON.easing 
              }}
              className="p-6 space-y-6"
              style={{ paddingTop: '24px' }}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ 
                  delay: timings.stagger,
                  duration: timings.open * 0.7,
                  ease: TOKENS.HORIZON.easingSine
                }}
              >
                <h4 className="font-medium mb-3" style={{ 
                  color: 'rgba(255,255,255,0.9)',
                  letterSpacing: '0.01em',
                  fontSize: '13px',
                  fontWeight: 500,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
                }}>What This Means</h4>
                <p className="text-on-glass" style={{ 
                  color: TOKENS.colors.textSecondary, 
                  fontSize: '14px', 
                  lineHeight: '1.5',
                  fontWeight: 400,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
                }}>{selectedDomain.summary}</p>
                {selectedDomain.addendum && (
                  <p className="text-on-glass" style={{ 
                    color: TOKENS.colors.textSecondary, 
                    fontSize: '13px', 
                    lineHeight: '1.5',
                    fontWeight: 400,
                    opacity: 0.9,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                    marginTop: '12px'
                  }}>{selectedDomain.addendum}</p>
                )}
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ 
                  delay: timings.stagger * 2,
                  duration: timings.open * 0.7,
                  ease: TOKENS.HORIZON.easingSine
                }}
              >
                <h4 className="font-medium mb-3" style={{ 
                  color: 'rgba(255,255,255,0.9)',
                  letterSpacing: '0.01em',
                  fontSize: '13px',
                  fontWeight: 500,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
                }}>Downstream Effects</h4>
                <div className="space-y-2">
                  {selectedDomain.ripple.slice(0, 3).map((effect, i) => (
                    <div 
                      key={i} 
                      className="effect-chip" 
                      style={{
                        backdropFilter: getBlur('chip'), 
                        WebkitBackdropFilter: getBlur('chip'), 
                        background: 'rgba(255,255,255,0.06)',
                        border: `1px solid ${TOKENS.HORIZON.glassBorder}`,
                        borderRadius: '12px', 
                        padding: '10px 12px', 
                        display: 'flex', 
                        alignItems: 'start', 
                        gap: '8px'
                      }}>
                      <div className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ 
                        background: getDomainColor(selectedDomain.id),
                        boxShadow: `0 0 6px ${getDomainBloom(selectedDomain.id)}`
                      }} />
                      <span className="text-on-glass" style={{ 
                        color: TOKENS.colors.textChip, 
                        fontSize: '12px', 
                        lineHeight: '1.35',
                        fontWeight: 400,
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
                      }}>{effect}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ 
                  delay: timings.stagger * 3,
                  duration: timings.open * 0.7,
                  ease: TOKENS.HORIZON.easingSine
                }}
                style={{ marginTop: '8px' }}
              >
                <h4 className="font-medium mb-3" style={{ 
                  color: 'rgba(255,255,255,0.9)',
                  letterSpacing: '0.01em',
                  fontSize: '13px',
                  fontWeight: 500,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
                }}>48-Hour Trend</h4>
                <div className="p-4 rounded-lg relative" style={{ 
                  background: 'rgba(0, 0, 0, 0.25)', 
                  border: `1px solid ${TOKENS.HORIZON.glassBorder}` 
                }}>
                  <svg width="100%" height="56" className="overflow-visible">
                    <defs>
                      <linearGradient id={`sparkline-drawer-${selectedDomain.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={getDomainColor(selectedDomain.id)} stopOpacity="0.7" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0)" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {(() => {
                      const data = selectedDomain.sparkline;
                      const width = 360;
                      const height = 56;
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
                      const lastValue = data[data.length - 1];
                      return (<>
                        <path 
                          d={areaD} 
                          fill={`url(#sparkline-drawer-${selectedDomain.id})`} 
                          className="trend-area"
                        />
                        <path 
                          d={pathD} 
                          fill="none" 
                          stroke={getDomainColor(selectedDomain.id)} 
                          strokeWidth="2.5" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                      </>);
                    })()}
                  </svg>
                  <div className="absolute top-2 right-2 px-2 py-1 rounded-md text-xs font-bold" style={{
                    background: 'rgba(0,0,0,0.4)',
                    color: getDomainColor(selectedDomain.id),
                    opacity: 0.85,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
                  }}>
                    {(selectedDomain.sparkline[selectedDomain.sparkline.length - 1] * 100).toFixed(1)}%
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ 
                  delay: timings.stagger * 4,
                  duration: timings.open * 0.7,
                  ease: TOKENS.HORIZON.easingSine
                }}
                className="pt-4 border-t space-y-3" 
                style={{ borderColor: TOKENS.HORIZON.drawerDivider, marginTop: '8px' }}
              >
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors drawer-view-details-button" style={{
                    background: 'rgba(66,135,245,0.15)',
                    color: '#4287f5',
                    border: '1px solid rgba(66,135,245,0.3)',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
                  }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(66,135,245,0.25)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(66,135,245,0.15)'}>
                    <span>View market implications</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center justify-between text-xs" style={{ 
                  color: TOKENS.colors.textTertiary,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
                }}>
                  <div>
                    Updated {new Date(selectedDomain.last_updated_iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="flex items-center gap-2 opacity-60">
                    <span>1-4 • Arrow Keys • ESC</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
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
          outline: 2px solid rgba(122,215,240,0.9);
          outline-offset: 3px;
          filter: drop-shadow(0 0 0 2px currentColor) drop-shadow(0 0 16px currentColor) !important; 
        }

        .focus-trap {
          outline: none;
        }

        .focus-trap:focus-within {
          outline: 2px solid rgba(66,135,245,0.6);
          outline-offset: -2px;
        }
        
        * {
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", sans-serif;
        }
      `}</style>
    </motion.section>
  );
};

export default MacroConstellation;
