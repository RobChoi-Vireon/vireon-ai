import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Globe, X, TrendingUp, TrendingDown, Minus, ArrowRight, Info, ChevronLeft, ChevronRight, BarChart3, DollarSign, Activity } from 'lucide-react';
import LyraLogo from '../core/LyraLogo';

// ============================================================================
// MACRO CONSTELLATION — OS HORIZON V1.7.6 "DRAWER RESTORATION + PARALLAX BOOST"
// ✅ Full drawer functionality restored • Enhanced parallax motion • Balanced spacing
// ============================================================================

const TOKENS = {
  HORIZON: {
    globalScale: 1.45, globalScaleMd: 1.3, globalScaleSm: 1.1, clusterOffsetY: -4, 
    loadInDamping: 0.92,
    orbitRadiusScale: 1.65,
    labelDistanceScale: 1.18,
    hoverExpansion: 14,
    hoverCardOffset: 32,
    hoverTriggerRadius: 1.10,
    glassBg: 'rgba(10,14,20,0.70)', glassBorder: 'rgba(160,191,255,0.10)',
    panelShadow: '0 0 80px rgba(0,0,0,0.4), 0 0 40px rgba(160,191,255,0.08)',
    hoverCardShadow: '0 4px 28px rgba(0,0,0,0.18), 0 0 0 1px rgba(255,255,255,0.08)',
    drawerGlass: 'rgba(10,15,22,0.72)', drawerTint: 'rgba(10,15,22,0.45)', drawerBlur: 'blur(22px)',
    drawerEdgeBloom: 'rgba(160,191,255,0.10)', drawerDivider: 'rgba(255,255,255,0.06)',
    drawerShadow: '0 15px 60px rgba(0,0,0,0.30)', backdropBlur: 'blur(10px)', backdropOpacity: 0.30,
    blurPanel: 'blur(20px)', blurChip: 'blur(16px)', vignetteColor: '#070A0F', vignetteOpacity: 0.28,
    vignetteBlur: 24, localBloomIntensity: 0.18, localBloomRadius: [220, 280],
    easing: [0.4, 0, 0.2, 1], easingApple: [0.32, 0.72, 0, 1], easingCubic: [0.65, 0, 0.35, 1],
    easingElastic: [0.22, 1, 0.36, 1], easingSine: [0.61, 1, 0.88, 1], easingOutQuad: [0.25, 0.46, 0.45, 0.94],
    overshoot: [0.34, 1.56, 0.64, 1], 
    t_drawerOpen: 0.25, t_drawerClose: 0.20,
    t_hover: 0.12, t_haloDecay: 0.18, t_labelLag: 0.08,
    t_tooltipOpen: 0.20, t_tooltipClose: 0.15, t_tooltipTextStagger: 0.08, t_tooltipTextDuration: 0.14,
    t_tooltipSlide: 0.20,
    t_tooltipAutoFade: 0.80,
    t_orbBreathIn: 0.14, t_orbBreathOut: 0.14, t_beamLink: 0.14,
    t_contentStagger: 0.06, t_soWhatDelay: 0.10,
    t_breathe: 4.5, t_orbLifePulse: 4.0, t_haloPulse: 2.0,
    t_pulse: 3, t_orbit: 10, t_sweep: 12, t_parallax: 0.12,
    parallaxOffset: 10, parallaxResponse: 0.55, microParallaxMax: 4, microParallaxDamping: 0.85,
    bgBase: '#06080D', bgEnd: '#0A0E14', bgSubsurfaceCenter: '#121823', bgSubsurfaceEdge: '#0B1016',
    lightTemp: 'rgba(255, 255, 255, 0.03)', lightTempBottom: 'rgba(255, 255, 255, 0.00)',
    lineHeight: 24,
    blockSpacing: 16,
    connectingLineOpacity: 0.08
  },
  MACRO: {
    fx: { core: '#6AC7F7', halo: 'rgba(106,199,247,0.38)', text: '#B8E7FF', bloom: 'rgba(106,199,247,0.18)', zDepth: -14 },
    rates: { core: '#C0A6FF', halo: 'rgba(192,166,255,0.38)', text: '#DECFFF', bloom: 'rgba(192,166,255,0.18)', zDepth: -6 },
    growth: { core: '#B4F7C0', halo: 'rgba(180,247,192,0.38)', text: '#D4FFDE', bloom: 'rgba(180,247,192,0.18)', zDepth: 8 },
    geopolitics: { core: '#FFD37A', halo: 'rgba(255,211,122,0.38)', text: '#FFE8B8', bloom: 'rgba(255,211,122,0.18)', zDepth: 12 }
  },
  colors: {
    textPrimary: "rgba(255,255,255,0.88)",
    textSecondary: "rgba(255,255,255,0.78)",
    textLabel: "rgba(255,255,255,0.72)",
    textChip: "rgba(232,235,239,0.85)",
    textTertiary: "rgba(255,255,255,0.65)",
    deltaUp: '#6EF3A5',
    deltaDown: '#F38B82'
  },
  type: {
    headline: { base: 18, min: 16, max: 18, weight: 600 },
    confidence: { base: 14, min: 12, max: 14, weight: 500 },
    body: { base: 16, min: 14, max: 16, weight: 400 },
    subtext: { base: 13, min: 12, max: 13, weight: 400 },
    cta: { base: 14, min: 13, max: 14, weight: 500 }
  }
};

const ANGLES = { rates: 22.5, fx: 160.0, growth: 297.5, geopolitics: 75.0 };

const RADII = { 
  rates: 0.36,
  fx: 0.40,
  growth: 0.38,
  geopolitics: 0.34
};

const MOCK_DOMAINS = [
  { id: "rates", posture: "hawkish", confidence_pct: 78, strength: 0.82, 
    summary: "Fed holding firm; terminal rate expectations drift higher on sticky services inflation.", 
    ripple: ["Credit spreads widen", "Tech multiples compress", "EM funding costs rise"], addendum: null,
    last_updated_iso: new Date().toISOString(), 
    sparkline: [0.72, 0.74, 0.76, 0.75, 0.78, 0.80, 0.79, 0.81, 0.82],
    confidenceDelta: 2 },
  { id: "fx", posture: "stable", confidence_pct: 65, strength: 0.58, 
    summary: "Dollar steady as interest-rate gaps shrink; risk trades unwind slowly.", 
    ripple: ["EM currencies stabilize", "Energy imports neutral", "Bond yields remain contained."],
    addendum: "Next 48h: FX likely stable; carry re-risk limited unless yields diverge.",
    last_updated_iso: new Date().toISOString(), 
    sparkline: [0.60, 0.59, 0.58, 0.57, 0.58, 0.59, 0.58, 0.57, 0.58],
    confidenceDelta: -3 },
  { id: "growth", posture: "softening", confidence_pct: 71, strength: 0.68, 
    summary: "China slowdown weighs on global demand; US consumer resilient but moderating.", 
    ripple: ["Commodity prices soften", "Defensive rotation begins", "Services hold up"], addendum: null,
    last_updated_iso: new Date().toISOString(), 
    sparkline: [0.75, 0.74, 0.72, 0.70, 0.69, 0.68, 0.67, 0.68, 0.68],
    confidenceDelta: -1 },
  { id: "geopolitics", posture: "tightening", confidence_pct: 58, strength: 0.72, 
    summary: "Energy security concerns persist; trade fragmentation continues to reshape supply chains.", 
    ripple: ["Energy premium elevated", "Onshoring accelerates", "Regional trade blocs solidify"], addendum: null,
    last_updated_iso: new Date().toISOString(), 
    sparkline: [0.65, 0.66, 0.68, 0.70, 0.71, 0.72, 0.71, 0.72, 0.72],
    confidenceDelta: 4 }
];

const MacroConstellation = ({ onOpenSignalDrawer }) => {
  const containerRef = useRef(null);
  const footerRef = useRef(null);
  const constellationRef = useRef(null);
  const drawerRef = useRef(null);
  const prefetchTimerRef = useRef(null);
  const hoverTimeoutRef = useRef(null);
  const pendingHoverRef = useRef(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  const [hoveredDomain, setHoveredDomain] = useState(null);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const [isLowPower, setIsLowPower] = useState(false);
  const [constellationShift, setConstellationShift] = useState(0);
  const [orbitScale, setOrbitScale] = useState(1.0);
  const [showEquilibriumTip, setShowEquilibriumTip] = useState(false);
  const [noiseDrift, setNoiseDrift] = useState(0);
  const [isStatusBarHovered, setIsStatusBarHovered] = useState(false);
  const [filamentFlash, setFilamentFlash] = useState(null);
  const [isSwitchingNode, setIsSwitchingNode] = useState(false);
  const [viewportSize, setViewportSize] = useState('lg');
  const [drawerOrigin, setDrawerOrigin] = useState(null);
  const [showBeam, setShowBeam] = useState(false);
  const [swayTime, setSwayTime] = useState(0);
  const [orbPulseActive, setOrbPulseActive] = useState(false);
  const [hoveredChartPoint, setHoveredChartPoint] = useState(null);
  const [drawerLuminance, setDrawerLuminance] = useState(1.0);
  
  const glassParallaxX = useSpring(0, { damping: 30, stiffness: 90 });
  const glassParallaxY = useSpring(0, { damping: 30, stiffness: 90 });
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const parallaxX = useSpring(mouseX, { damping: 20, stiffness: 100 });
  const parallaxY = useSpring(mouseY, { damping: 20, stiffness: 100 });
  const bgParallaxX = useSpring(mouseX, { damping: 25, stiffness: 80 });
  const bgParallaxY = useSpring(mouseY, { damping: 25, stiffness: 80 });
  
  const domains = MOCK_DOMAINS;
  const headerSafe = 64;
  const footerH = 84;
  const footerBleed = 28;
  const haloBleed = 18;
  const minClear = 24;
  const safeBottom = footerH + footerBleed + haloBleed + minClear;

  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoad(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const getGlobalScale = useCallback(() => {
    const baseScale = viewportSize === 'sm' ? TOKENS.HORIZON.globalScaleSm : 
                      viewportSize === 'md' ? TOKENS.HORIZON.globalScaleMd : 
                      TOKENS.HORIZON.globalScale;
    return isInitialLoad ? baseScale * TOKENS.HORIZON.loadInDamping : baseScale;
  }, [viewportSize, isInitialLoad]);

  const getResponsiveFont = useCallback((typeKey) => {
    const scale = TOKENS.type[typeKey];
    if (!scale) return '16px';
    return `clamp(${scale.min}px, ${(scale.base / 16) * 1.1}vw, ${scale.max}px)`;
  }, []);

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
    const rates = domains.find(d => d.id === "rates");
    const fx = domains.find(d => d.id === "fx");
    const growth = domains.find(d => d.id === "growth");
    const geo = domains.find(d => d.id === "geopolitics");
    
    if (dominantDriver === "balanced") {
      return `Equilibrium Balanced — Rates ${rates.posture}; FX ${fx.posture}; Growth ${growth.posture}; Geopolitics ${geo.posture}.`;
    }
    
    return `Equilibrium leaning toward ${dominantDriver.charAt(0).toUpperCase() + dominantDriver.slice(1)}.`;
  }, [domains, dominantDriver]);

  const balanceAngle = useMemo(() => dominantDriver === "balanced" ? 0 : ANGLES[dominantDriver] || 0, [dominantDriver]);

  const connections = useMemo(() => [
    { from: "rates", to: "growth", relationship: 0.7, tension: 0.8 },
    { from: "fx", to: "geopolitics", relationship: 0.6, tension: 0.8 },
    { from: "rates", to: "fx", relationship: 0.8, tension: 0.9 },
    { from: "growth", to: "geopolitics", relationship: 0.5, tension: 0.9 }
  ], []);

  const { cx, cy, orbitBaseRadius } = useMemo(() => {
    const globalScale = getGlobalScale();
    const safeW = dimensions.width;
    const safeH = dimensions.height - safeBottom - headerSafe;
    const centerX = dimensions.width / 2;
    const centerY = headerSafe + (safeH / 2) + (safeH * TOKENS.HORIZON.clusterOffsetY / 100) + 16;
    const responsiveScale = viewportSize === 'sm' ? 1.10 : 1.20;
    const baseRadius = Math.min(safeW, safeH) * 0.34 * TOKENS.HORIZON.orbitRadiusScale * globalScale * (viewportSize === 'lg' ? 1.0 : responsiveScale / 1.20);
    const shortH = window.innerHeight <= 820;
    const radius = baseRadius * (shortH ? 0.92 : 1.00) * orbitScale;
    
    return { cx: centerX, cy: centerY, orbitBaseRadius: radius };
  }, [dimensions, safeBottom, headerSafe, orbitScale, getGlobalScale, viewportSize]);

  const nucleusOffset = useMemo(() => {
    const angleRad = (balanceAngle * Math.PI) / 180;
    const offsetMagnitude = balanceBias * 12;
    return { x: Math.sin(angleRad) * offsetMagnitude, y: -Math.cos(angleRad) * offsetMagnitude };
  }, [balanceAngle, balanceBias]);

  const getOrbPosition = useCallback((domainId, strength, time = 0, px = 0, py = 0) => {
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
    
    return {
      x: cx + adjustedRadius * Math.cos(angle) * zScale + swayX + (px * parallaxFactor),
      y: cy + adjustedRadius * Math.sin(angle) * zScale + swayY + (py * parallaxFactor),
      radius, diameter, zDepth
    };
  }, [cx, cy, orbitBaseRadius, getGlobalScale]);

  const getLabelPosition = useCallback((orbX, orbY, orbRadius) => {
    const vx = orbX - cx;
    const vy = orbY - cy;
    const norm = Math.hypot(vx, vy) || 1;
    const offset = orbRadius + (16 * TOKENS.HORIZON.labelDistanceScale);
    return { x: orbX + (vx / norm) * offset, y: orbY + (vy / norm) * offset };
  }, [cx, cy]);

  const getHoverCardPosition = useCallback((orbX, orbY, orbRadius) => {
    const offsetDistance = orbRadius + TOKENS.HORIZON.hoverCardOffset;
    const cardWidth = 260;
    const cardHeight = 280;
    
    const isUpperHalf = orbY < cy;
    const isLeftHalf = orbX < cx;
    const verticalDistance = Math.abs(orbY - cy);
    const horizontalDistance = Math.abs(orbX - cx);
    
    let position = {};
    let anchorX = 0;
    let anchorY = 0;
    
    if (horizontalDistance > verticalDistance * 0.8) {
      if (isLeftHalf) {
        position = { left: orbX + offsetDistance, top: orbY - (cardHeight / 2) };
        anchorX = 0;
        anchorY = cardHeight / 2;
      } else {
        position = { left: orbX - offsetDistance - cardWidth, top: orbY - (cardHeight / 2) };
        anchorX = cardWidth;
        anchorY = cardHeight / 2;
      }
    } else {
      if (isUpperHalf) {
        position = { left: orbX - (cardWidth / 2), top: orbY + offsetDistance };
        anchorX = cardWidth / 2;
        anchorY = 0;
      } else {
        position = { left: orbX - (cardWidth / 2), top: orbY - offsetDistance - cardHeight };
        anchorX = cardWidth / 2;
        anchorY = cardHeight;
      }
    }
    
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (containerRect) {
      const headerSafeSpace = headerSafe + 20;
      if (position.top < headerSafeSpace) position.top = headerSafeSpace;
      
      const bottomSafeSpace = containerRect.height - safeBottom - 20;
      if (position.top + cardHeight > bottomSafeSpace) position.top = bottomSafeSpace - cardHeight;

      if (position.left < 10) position.left = 10;
      if (position.left + cardWidth > containerRect.width - 10) position.left = containerRect.width - cardWidth - 10;
    }
    
    return { ...position, orbX, orbY, orbRadius, cardAnchorX: anchorX, cardAnchorY: anchorY };
  }, [cx, cy, headerSafe, safeBottom]);

  const getDomainColor = (id) => TOKENS.MACRO[id]?.core || TOKENS.MACRO.rates.core;
  const getDomainText = (id) => TOKENS.MACRO[id]?.text || TOKENS.MACRO.rates.text;
  const getDomainBloom = (id) => TOKENS.MACRO[id]?.bloom || TOKENS.MACRO.rates.bloom;

  const getDomainIcon = (id) => {
    const p = { className: "w-6 h-6", strokeWidth: 2 };
    return { rates: <BarChart3 {...p} />, fx: <DollarSign {...p} />, growth: <Activity {...p} />, geopolitics: <Globe {...p} /> }[id] || <Activity {...p} />;
  };

  const getPostureIcon = (posture) => {
    if (["hawkish", "tightening", "firming"].includes(posture)) return <TrendingUp className="w-4 h-4" />;
    if (["dovish", "loosening", "softening"].includes(posture)) return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getBlur = useCallback((type) => isLowPower ? (type === 'panel' ? 'blur(16px)' : 'blur(12px)') : (type === 'panel' ? 'blur(20px)' : 'blur(16px)'), [isLowPower]);

  const getActionableSignal = useCallback((domain) => ({
    rates: "Position for rate-sensitive defensive rotation; monitor tech multiples.",
    fx: "FX risk limited near-term; watch for yield curve divergence catalysts.",
    growth: "Defensive-equity rotation likely next 48h; monitor commodities for continued softening.",
    geopolitics: "Regional supply-chain hedges warranted; energy exposure elevated."
  }[domain.id] || "Monitor for emerging cross-domain shifts."), []);

  const getSoWhatInterpretation = useCallback((domain) => ({
    rates: "So what: Long-duration positioning at risk; defensive rotation favored until inflation data stabilizes.",
    fx: "So what: Carry trades stabilizing; volatility compression likely—favor domestic exposure until yield divergence.",
    growth: "So what: Margin compression ahead; rotate to defensives and quality names with pricing power.",
    geopolitics: "So what: Supply chain fragmentation accelerating; prioritize domestic resilience and energy hedges."
  }[domain.id] || "Monitor for shifts in macro equilibrium dynamics."), []);

  useEffect(() => {
    if (shouldReduceMotion || !selectedDomain) {
      setDrawerLuminance(1.0);
      return;
    }
    
    let rafId;
    let startTime = Date.now();
    
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const pulsePhase = (elapsed % TOKENS.HORIZON.t_orbLifePulse) / TOKENS.HORIZON.t_orbLifePulse;
      const sineWave = Math.sin(pulsePhase * Math.PI * 2);
      const luminance = 1.0 + (sineWave * 0.03);
      setDrawerLuminance(luminance);
      rafId = requestAnimationFrame(animate);
    };
    
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [shouldReduceMotion, selectedDomain]);

  const handleDomainHover = useCallback((domain) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    if (pendingHoverRef.current) {
      clearTimeout(pendingHoverRef.current);
      pendingHoverRef.current = null;
    }

    if (domain?.id) {
      pendingHoverRef.current = setTimeout(() => {
        setHoveredDomain(domain.id);
        pendingHoverRef.current = null;
      }, 10);
    } else {
      hoverTimeoutRef.current = setTimeout(() => {
        setHoveredDomain(null);
        hoverTimeoutRef.current = null;
      }, 200);
    }
  }, []);

  const handleOpenDrawer = useCallback((domain) => {
    console.log('✅ Opening drawer for domain:', domain.id);
    if (selectedDomain?.id === domain.id) {
      console.log('⚠️ Domain already selected, ignoring');
      return;
    }
    
    const domainPos = getOrbPosition(domain.id, domain.strength, swayTime, 0, 0); 
    const containerRect = containerRef.current?.getBoundingClientRect();
    
    if (containerRect) {
      const origin = { 
        x: domainPos.x, 
        y: domainPos.y, 
        screenX: containerRect.left + domainPos.x, 
        screenY: containerRect.top + domainPos.y 
      };
      console.log('📍 Drawer origin set:', origin);
      setDrawerOrigin(origin);
    }

    // Immediate drawer opening for responsiveness
    console.log('🚀 Setting selected domain:', domain.id);
    setSelectedDomain(domain);
    setShowBeam(true);
    setIsSwitchingNode(false);
  }, [selectedDomain, getOrbPosition, swayTime]);

  const handleCloseDrawer = useCallback(() => {
    console.log('🔒 Closing drawer');
    setShowBeam(false);
    setTimeout(() => { 
      setSelectedDomain(null); 
      setIsSwitchingNode(false); 
      setDrawerOrigin(null);
      console.log('✅ Drawer closed and cleaned up');
    }, TOKENS.HORIZON.t_drawerClose * 1000); 
  }, []);

  const handleNextDomain = useCallback(() => {
    if (!selectedDomain) return;
    const idx = domains.findIndex(d => d.id === selectedDomain.id);
    const nextDomain = domains[(idx + 1) % domains.length];
    console.log('➡️ Navigating to next domain:', nextDomain.id);
    handleOpenDrawer(nextDomain);
  }, [selectedDomain, domains, handleOpenDrawer]);

  const handlePrevDomain = useCallback(() => {
    if (!selectedDomain) return;
    const idx = domains.findIndex(d => d.id === selectedDomain.id);
    const prevDomain = domains[(idx - 1 + domains.length) % domains.length];
    console.log('⬅️ Navigating to prev domain:', prevDomain.id);
    handleOpenDrawer(prevDomain);
  }, [selectedDomain, domains, handleOpenDrawer]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedDomain) handleCloseDrawer();
      else if (e.key === 'ArrowLeft' && selectedDomain) { e.preventDefault(); handlePrevDomain(); }
      else if (e.key === 'ArrowRight' && selectedDomain) { e.preventDefault(); handleNextDomain(); }
      else if (['1', '2', '3', '4'].includes(e.key)) {
        const map = { '1': 'fx', '2': 'rates', '3': 'growth', '4': 'geopolitics' };
        const domain = domains.find(d => d.id === map[e.key]);
        if (domain) handleOpenDrawer(domain);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedDomain, handleCloseDrawer, handlePrevDomain, handleNextDomain, domains, handleOpenDrawer]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current || shouldReduceMotion) return;
      const rect = containerRef.current.getBoundingClientRect();
      const normX = ((e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2));
      const normY = ((e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2));
      mouseX.set(normX * 24);
      mouseY.set(normY * 24);
      if (selectedDomain) {
        glassParallaxX.set(-normX * TOKENS.HORIZON.microParallaxMax * TOKENS.HORIZON.microParallaxDamping);
        glassParallaxY.set(-normY * TOKENS.HORIZON.microParallaxMax * TOKENS.HORIZON.microParallaxDamping);
      } else {
        glassParallaxX.set(0);
        glassParallaxY.set(0);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [shouldReduceMotion, selectedDomain, mouseX, mouseY, glassParallaxX, glassParallaxY]);

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
    const update = () => {
      const w = window.innerWidth;
      setViewportSize(w < 768 ? 'sm' : w < 1024 ? 'md' : 'lg');
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: 700 });
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const interval = setInterval(() => setNoiseDrift(prev => (prev + 0.3) % 1000), 1000);
    return () => clearInterval(interval);
  }, [shouldReduceMotion]);

  useEffect(() => {
    if (shouldReduceMotion) return;
    let rafId, lastTime = Date.now();
    const animate = () => {
      const now = Date.now();
      setSwayTime(prev => prev + (now - lastTime) / 1000);
      lastTime = now;
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [shouldReduceMotion]);
  
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      if (pendingHoverRef.current) clearTimeout(pendingHoverRef.current);
    };
  }, []);

  const drawerCenterPosition = useMemo(() => {
    if (!selectedDomain || !drawerOrigin) return { left: 0, top: 0, width: 0, height: 0 };
    
    const headerHeight = 72;
    const safeTopPadding = 8;
    const safeTop = headerHeight + safeTopPadding;
    
    const drawerWidth = 520;
    const maxDrawerHeight = Math.min(window.innerHeight - headerHeight - 72, 700);
    const drawerHeight = maxDrawerHeight;
    
    const bloomOriginY = drawerOrigin.screenY + 10;
    
    let targetTop = bloomOriginY - (drawerHeight / 2);
    targetTop = Math.max(targetTop, safeTop);
    
    const viewportAdjustment = window.innerHeight < 720 ? 24 : 0;
    
    return {
      left: drawerOrigin.screenX - (drawerWidth / 2),
      top: targetTop,
      width: drawerWidth,
      height: drawerHeight - viewportAdjustment
    };
  }, [selectedDomain, drawerOrigin]);

  // Debug logging
  useEffect(() => {
    if (selectedDomain) {
      console.log('📊 Selected domain state:', {
        id: selectedDomain.id,
        hasOrigin: !!drawerOrigin,
        position: drawerCenterPosition,
        isSwitching: isSwitchingNode
      });
    }
  }, [selectedDomain, drawerOrigin, drawerCenterPosition, isSwitchingNode]);

  return (
    <motion.section variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} aria-label="Macro Constellation" style={{ maxWidth: '84vw', margin: '0 auto' }}>
      <div className="flex items-center justify-between mb-6 pl-2">
        <div className="flex items-center space-x-3">
          <Globe className="w-6 h-6" style={{ color: '#6AC7F7' }} />
          <div>
            <h2 style={{ fontSize: '18px', lineHeight: '24px', fontWeight: 600, color: TOKENS.colors.textPrimary, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>Macro Constellation</h2>
            <p style={{ fontSize: '13px', color: TOKENS.colors.textTertiary, letterSpacing: '0.2em', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>Real-time balance of global macro forces.</p>
          </div>
        </div>
        <div className="powered-by-lyra cursor-pointer" style={{ opacity: 0.6 }}>
          <div className="flex items-center space-x-2 px-4 py-2" style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', border: '1px solid rgba(160,191,255,0.08)', borderRadius: '12px' }}>
            <span className="text-xs font-medium" style={{ color: TOKENS.colors.textTertiary, letterSpacing: '0.25px', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>Powered by</span>
            <LyraLogo className="w-5 h-5" />
            <span className="text-sm font-bold" style={{ color: TOKENS.colors.textPrimary }}>Lyra</span>
          </div>
        </div>
      </div>

      <div ref={containerRef} className="grid-wrapper relative w-full overflow-hidden" data-dominant={dominantDriver} style={{ height: '700px', background: `linear-gradient(184deg, ${TOKENS.HORIZON.bgBase} 0%, ${TOKENS.HORIZON.bgEnd} 100%)`, border: '1px solid rgba(160,191,255,0.08)', borderRadius: '24px', paddingTop: '4vh', paddingBottom: '5vh', position: 'relative' }}>
        
        <motion.div style={{ position: 'absolute', inset: 0, background: `radial-gradient(900px circle at 52% 48%, ${TOKENS.HORIZON.bgSubsurfaceCenter} 0%, ${TOKENS.HORIZON.bgSubsurfaceEdge} 70%)`, opacity: 0.35, borderRadius: '24px', pointerEvents: 'none', zIndex: 1 }} animate={{ x: shouldReduceMotion ? 0 : bgParallaxX.get() * TOKENS.HORIZON.parallaxOffset * 0.8, y: shouldReduceMotion ? 0 : bgParallaxY.get() * TOKENS.HORIZON.parallaxOffset * 0.8 }} transition={{ duration: TOKENS.HORIZON.t_parallax, ease: TOKENS.HORIZON.easingApple }} />
        
        <motion.div style={{ position: 'absolute', inset: 0, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`, backgroundSize: '200px 200px', opacity: 0.15, borderRadius: '24px', pointerEvents: 'none', zIndex: 2 }} animate={{ backgroundPosition: [`${noiseDrift}px 0px`, `${noiseDrift + 0.3}px 0px`] }} transition={{ duration: 1, ease: 'linear' }} />
        
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at center, transparent 60%, ${TOKENS.HORIZON.vignetteColor} 100%)`, opacity: TOKENS.HORIZON.vignetteOpacity, filter: `blur(${TOKENS.HORIZON.vignetteBlur}px)`, borderRadius: '24px', pointerEvents: 'none', zIndex: 2 }} />
        
        {domains.map((domain) => {
          const pos = getOrbPosition(domain.id, domain.strength, swayTime, 0, 0);
          const bloomRadius = Math.min(...TOKENS.HORIZON.localBloomRadius) + (domain.strength * (Math.max(...TOKENS.HORIZON.localBloomRadius) - Math.min(...TOKENS.HORIZON.localBloomRadius)));
          const isActiveOrb = selectedDomain?.id === domain.id;
          
          return (
            <React.Fragment key={`bloom-${domain.id}`}>
              <motion.div style={{ position: 'absolute', left: pos.x, top: pos.y, width: bloomRadius * 2, height: bloomRadius * 2, transform: 'translate(-50%, -50%)', background: `radial-gradient(circle, ${getDomainBloom(domain.id)}, transparent 72%)`, opacity: selectedDomain ? 0.12 : TOKENS.HORIZON.localBloomIntensity, mixBlendMode: 'screen', pointerEvents: 'none', zIndex: 2, transition: 'opacity 0.3s ease' }} />
              {isActiveOrb && (
                <motion.div animate={{ opacity: [0.15, 0.22, 0.15], scale: [1, 1.12, 1] }} transition={{ opacity: { duration: 4, repeat: Infinity, ease: 'easeInOut' }, scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' } }} style={{ position: 'absolute', left: pos.x, top: pos.y, width: bloomRadius * 2.3, height: bloomRadius * 2.3, transform: 'translate(-50%, -50%)', background: `radial-gradient(circle, ${getDomainBloom(domain.id)}, transparent 65%)`, filter: 'blur(28px)', mixBlendMode: 'screen', pointerEvents: 'none', zIndex: 1 }} />
              )}
            </React.Fragment>
          );
        })}
        
        <motion.div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 4 }} animate={{ x: shouldReduceMotion ? 0 : parallaxX.get() * TOKENS.HORIZON.parallaxOffset * 0.25, y: shouldReduceMotion ? 0 : parallaxY.get() * TOKENS.HORIZON.parallaxOffset * 0.25 }} transition={{ duration: TOKENS.HORIZON.t_parallax, ease: TOKENS.HORIZON.easingApple }}>
          {selectedDomain && <motion.div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: '100%', height: '100%', background: `radial-gradient(circle at center, ${getDomainBloom(selectedDomain.id)} 0%, transparent 60%)`, opacity: 0.1, filter: 'blur(80px)', pointerEvents: 'none', mixBlendMode: 'screen' }} initial={{ opacity: 0 }} animate={{ opacity: 0.1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: 'easeInOut' }} />}
        </motion.div>

        <motion.div ref={constellationRef} style={{ position: 'absolute', inset: 0, willChange: 'transform', zIndex: 3, opacity: selectedDomain ? 0.9 : 1 }} animate={{ y: constellationShift, x: shouldReduceMotion ? 0 : parallaxX.get() * TOKENS.HORIZON.parallaxResponse }} transition={{ y: { duration: shouldReduceMotion ? 0 : 0.4, ease: TOKENS.HORIZON.easing }, x: { duration: shouldReduceMotion ? 0 : TOKENS.HORIZON.t_parallax, ease: TOKENS.HORIZON.easingApple } }}>
          <div style={{ position: 'absolute', left: `${cx}px`, top: `${cy}px`, width: `${orbitBaseRadius * 2}px`, height: `${orbitBaseRadius * 2}px`, transform: 'translate(-50%, -50%)', borderRadius: '999px', boxShadow: 'inset 0 0 0 1px rgba(160,191,255,0.06)', opacity: 0.2, filter: 'blur(0.5px)', pointerEvents: 'none', zIndex: 2, transition: shouldReduceMotion ? 'none' : 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }} aria-hidden="true" />

          <motion.div style={{ position: 'absolute', left: `${cx}px`, top: `${cy}px`, zIndex: 2 }} animate={{ x: nucleusOffset.x, y: nucleusOffset.y }} transition={{ duration: 0.8, ease: TOKENS.HORIZON.easing }}>
            <motion.div style={{ position: 'absolute', left: 0, top: 0, transform: 'translate(-50%, -50%)', width: `${22 * getGlobalScale()}px`, height: `${22 * getGlobalScale()}px`, borderRadius: '999px', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', background: 'rgba(160,191,255,0.12)', boxShadow: '0 0 80px rgba(160,191,255,0.15), inset 0 0 0 1px rgba(255,255,255,0.08)', pointerEvents: 'none' }} animate={shouldReduceMotion ? {} : { scale: [0.985, 1.025, 0.985], opacity: [0.985, 1, 0.985] }} transition={{ duration: TOKENS.HORIZON.t_breathe, repeat: Infinity, ease: "easeInOut" }} aria-hidden="true" />
            {domains.map((d) => <motion.div key={`ray-${d.id}`} style={{ position: 'absolute', left: 0, top: 0, width: '28%', height: '2px', transformOrigin: 'left center', borderRadius: '999px', background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.45))', pointerEvents: 'none' }} animate={{ rotate: ANGLES[d.id], opacity: d.id === dominantDriver ? 0.5 : 0.15 }} transition={{ duration: 0.8, ease: TOKENS.HORIZON.easing }} />)}
          </motion.div>

          <svg width={dimensions.width} height={dimensions.height} style={{ position: 'absolute', inset: 0, overflow: 'visible', zIndex: 2 }}>
            <defs>
              {domains.map((d) => (
                <React.Fragment key={`defs-${d.id}`}>
                  <radialGradient id={`nucleus-${d.id}`}>
                    <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
                    <stop offset="45%" stopColor={getDomainColor(d.id)} stopOpacity="0.85" />
                    <stop offset="70%" stopColor="rgba(255,255,255,0)" stopOpacity="0" />
                  </radialGradient>
                  <filter id={`bloom-${d.id}`} x="-100%" y="-100%" width="300%" height="300%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="20" result="blur" />
                    <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.38 0" result="bloom" />
                    <feMerge><feMergeNode in="bloom" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                  <filter id={`scatter-${d.id}`}>
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

            <g style={{ mixBlendMode: 'screen' }}>
              {connections.map((conn, i) => {
                const from = domains.find(d => d.id === conn.from);
                const to = domains.find(d => d.id === conn.to);
                const fromPos = getOrbPosition(conn.from, from.strength, swayTime, parallaxX.get(), parallaxY.get());
                const toPos = getOrbPosition(conn.to, to.strength, swayTime, parallaxX.get(), parallaxY.get());
                
                const tension = conn.tension || 0.5;
                const cp1x = fromPos.x * (1 - tension) + cx * tension;
                const cp1y = fromPos.y * (1 - tension) + cy * tension;
                const cp2x = cx * (1 - tension) + toPos.x * tension;
                const cp2y = cy * (1 - tension) + toPos.y * tension;

                const isAdjacent = hoveredDomain === conn.from || hoveredDomain === conn.to || selectedDomain?.id === conn.from || selectedDomain?.id === conn.to;
                const isFlashing = filamentFlash === conn.from || filamentFlash === conn.to;
                
                return (
                  <motion.path key={`conn-${i}`} d={`M ${fromPos.x},${fromPos.y} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${toPos.x},${toPos.y}`} stroke={`url(#conn-grad-${i})`} strokeWidth="1" strokeLinecap="round" fill="none" animate={{ opacity: isFlashing ? [0.20, 0.60, 0.20] : isAdjacent ? (selectedDomain ? 0.15 : [0.20, 0.45, 0.20]) : shouldReduceMotion ? (selectedDomain ? 0.10 : 0.20) : (selectedDomain ? [0.10, 0.14, 0.10] : [0.16, 0.24, 0.16]) }} transition={isFlashing ? { duration: 0.2, ease: TOKENS.HORIZON.easing } : isAdjacent ? { duration: 0.3, ease: TOKENS.HORIZON.easing } : { duration: TOKENS.HORIZON.t_pulse, repeat: Infinity, ease: "easeInOut" }} style={{ filter: 'drop-shadow(0 2px 12px rgba(0,0,0,0.4))' }} />
                );
              })}
            </g>

            <g style={{ mixBlendMode: 'screen' }}>
              {domains.map((domain, idx) => {
                const orbPos = getOrbPosition(domain.id, domain.strength, swayTime, parallaxX.get(), parallaxY.get());
                const color = getDomainColor(domain.id);
                const bloom = getDomainBloom(domain.id);
                const isHovered = hoveredDomain === domain.id;
                const isSelected = selectedDomain?.id === domain.id;
                const isPulsing = orbPulseActive && (isHovered || isSelected || (selectedDomain === null && hoveredDomain === domain.id)); 

                return (
                  <g key={domain.id}>
                    <motion.circle cx={orbPos.x} cy={orbPos.y} r={orbPos.radius + 40} fill={bloom} style={{ filter: 'blur(20px)', pointerEvents: 'none' }} animate={shouldReduceMotion ? {} : { opacity: isPulsing ? [0.38, 0.55, 0.38] : isHovered || isSelected ? 0.55 : [0.38, 0.42, 0.38], scale: isPulsing ? [1, 1.08, 1] : isHovered || isSelected ? 1.05 : [0.985, 1.025, 0.985] }} transition={isPulsing ? { duration: TOKENS.HORIZON.t_orbBreathIn, ease: TOKENS.HORIZON.easingSine } : isHovered || isSelected ? { duration: TOKENS.HORIZON.t_hover, ease: TOKENS.HORIZON.easingApple } : { duration: TOKENS.HORIZON.t_breathe, repeat: Infinity, ease: "easeInOut", delay: idx * 1.2 }} />
                    <circle cx={orbPos.x} cy={orbPos.y} r={orbPos.radius + 2} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" style={{ filter: `url(#scatter-${domain.id})`, pointerEvents: 'none' }} />
                    <AnimatePresence>
                      {(isHovered || isSelected) && <motion.circle cx={orbPos.x} cy={orbPos.y} r={orbPos.radius + TOKENS.HORIZON.hoverExpansion} fill={bloom} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 0.6, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ opacity: { duration: TOKENS.HORIZON.t_haloDecay, ease: TOKENS.HORIZON.easingSine }, scale: { duration: TOKENS.HORIZON.t_hover, ease: TOKENS.HORIZON.easingApple } }} style={{ filter: 'blur(16px)', pointerEvents: 'none' }} />}
                    </AnimatePresence>
                    
                    {isSelected && !shouldReduceMotion && (
                      <motion.circle 
                        cx={orbPos.x} 
                        cy={orbPos.y} 
                        r={orbPos.radius} 
                        fill="none"
                        stroke={color}
                        strokeWidth="2"
                        opacity="0.4"
                        style={{ pointerEvents: 'none' }}
                        animate={{ 
                          scale: [1.00, 1.03, 1.00],
                          opacity: [0.4, 0.6, 0.4]
                        }}
                        transition={{ 
                          duration: TOKENS.HORIZON.t_orbLifePulse, 
                          repeat: Infinity, 
                          ease: "easeInOut" 
                        }}
                      />
                    )}
                    
                    <motion.circle 
                      cx={orbPos.x} 
                      cy={orbPos.y} 
                      r={orbPos.radius * TOKENS.HORIZON.hoverTriggerRadius} 
                      fill={`url(#nucleus-${domain.id})`} 
                      className="orb cursor-pointer" 
                      style={{ filter: `url(#bloom-${domain.id})`, transformOrigin: `${orbPos.x}px ${orbPos.y}px`, pointerEvents: 'all', color }} 
                      animate={shouldReduceMotion ? {} : { scale: isPulsing ? [1, 1.05, 1] : isSelected ? [1, 1.025, 1] : isHovered ? 1.05 : [0.985, 1.025, 0.985], opacity: isPulsing ? [0.985, 1, 0.985] : isHovered || isSelected ? 1 : [0.985, 1, 0.985] }} 
                      transition={isPulsing ? { duration: TOKENS.HORIZON.t_orbBreathIn, ease: TOKENS.HORIZON.easingSine } : isSelected ? { duration: TOKENS.HORIZON.t_orbLifePulse, repeat: Infinity, ease: "easeInOut" } : isHovered ? { duration: TOKENS.HORIZON.t_hover, ease: TOKENS.HORIZON.easingApple } : { duration: TOKENS.HORIZON.t_breathe, repeat: Infinity, ease: "easeInOut", delay: idx * 1.2 }} 
                      onMouseEnter={() => handleDomainHover(domain)} 
                      onMouseLeave={() => handleDomainHover(null)} 
                      onClick={() => handleOpenDrawer(domain)} 
                      onKeyDown={(e) => { if (e.key === 'Enter') handleOpenDrawer(domain); }} 
                      tabIndex={0} 
                      role="button" 
                      aria-label={`${domain.id} domain: ${domain.posture}, ${domain.confidence_pct}% confidence`} 
                    />
                    <circle cx={orbPos.x} cy={orbPos.y} r={orbPos.radius} fill="none" stroke={color} strokeWidth="1" opacity="0.25" style={{ pointerEvents: 'none' }} />
                  </g>
                );
              })}
            </g>
          </svg>

          <AnimatePresence mode="wait">
            {hoveredDomain && !selectedDomain && (() => {
              const domain = domains.find(d => d.id === hoveredDomain);
              if (!domain) return null;
              
              const orbPos = getOrbPosition(hoveredDomain, domain.strength, swayTime, parallaxX.get(), parallaxY.get());
              const cardPos = getHoverCardPosition(orbPos.x, orbPos.y, orbPos.radius);

              const cardWidth = 260;
              const cardHeight = 280;
              
              const bridgeMinX = Math.min(orbPos.x - orbPos.radius * TOKENS.HORIZON.hoverTriggerRadius, cardPos.left);
              const bridgeMaxX = Math.max(orbPos.x + orbPos.radius * TOKENS.HORIZON.hoverTriggerRadius, cardPos.left + cardWidth);
              const bridgeMinY = Math.min(orbPos.y - orbPos.radius * TOKENS.HORIZON.hoverTriggerRadius, cardPos.top);
              const bridgeMaxY = Math.max(orbPos.y + orbPos.radius * TOKENS.HORIZON.hoverTriggerRadius, cardPos.top + cardHeight);

              const bridgePadding = 20;
              const bridgeLeft = bridgeMinX - bridgePadding;
              const bridgeTop = bridgeMinY - bridgePadding;
              const bridgeWidth = (bridgeMaxX - bridgeMinX) + (2 * bridgePadding);
              const bridgeHeight = (bridgeMaxY - bridgeMinY) + (2 * bridgePadding);
              
              const vecX = (cardPos.left + cardPos.cardAnchorX) - orbPos.x;
              const vecY = (cardPos.top + cardPos.cardAnchorY) - orbPos.y;
              const midX = orbPos.x + vecX * 0.5;
              const midY = orbPos.y + vecY * 0.5;
              const controlX = midX + vecY * 0.1; 
              const controlY = midY - vecX * 0.1;
              
              return (
                <React.Fragment key={`tooltip-group-${hoveredDomain}`}>
                  <motion.div
                    style={{
                      position: 'absolute',
                      left: `${bridgeLeft}px`,
                      top: `${bridgeTop}px`,
                      width: `${bridgeWidth}px`,
                      height: `${bridgeHeight}px`,
                      pointerEvents: 'auto',
                      zIndex: 4
                    }}
                    onMouseEnter={() => handleDomainHover(domain)}
                    onMouseLeave={() => handleDomainHover(null)}
                    aria-hidden="true"
                  />
                  
                  <svg width={dimensions.width} height={dimensions.height} style={{ position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none', zIndex: 4 }}>
                    <motion.path
                      d={`M ${orbPos.x},${orbPos.y} Q ${controlX},${controlY} ${cardPos.left + cardPos.cardAnchorX},${cardPos.top + cardPos.cardAnchorY}`}
                      stroke="rgba(255,255,255,0.08)"
                      strokeWidth="1"
                      fill="none"
                      initial={{ opacity: 0, pathLength: 0 }}
                      animate={{ opacity: TOKENS.HORIZON.connectingLineOpacity, pathLength: 1 }}
                      exit={{ opacity: 0, pathLength: 0 }}
                      transition={{ duration: TOKENS.HORIZON.t_tooltipOpen, ease: TOKENS.HORIZON.easingCubic }}
                    />
                  </svg>
                  
                  <motion.div
                    key={`tooltip-${hoveredDomain}`}
                    initial={{ opacity: 0, scale: 0.98, y: 8 }}
                    animate={{ opacity: 1, scale: 1.00, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, y: 8, transition: { duration: TOKENS.HORIZON.t_tooltipClose, ease: TOKENS.HORIZON.easingCubic } }}
                    transition={{ 
                      opacity: { duration: TOKENS.HORIZON.t_tooltipOpen, ease: TOKENS.HORIZON.easingCubic },
                      scale: { duration: TOKENS.HORIZON.t_tooltipOpen, ease: TOKENS.HORIZON.easingCubic },
                      y: { duration: TOKENS.HORIZON.t_tooltipSlide, ease: TOKENS.HORIZON.easingCubic }
                    }}
                    style={{
                      position: 'absolute',
                      left: `${cardPos.left}px`,
                      top: `${cardPos.top}px`,
                      width: '260px',
                      padding: '16px 18px',
                      borderRadius: '16px',
                      backdropFilter: getBlur('panel'),
                      WebkitBackdropFilter: getBlur('panel'),
                      background: TOKENS.HORIZON.glassBg,
                      border: `1px solid ${TOKENS.HORIZON.glassBorder}`,
                      boxShadow: TOKENS.HORIZON.hoverCardShadow,
                      pointerEvents: 'auto',
                      zIndex: 6
                    }}
                    onMouseEnter={() => handleDomainHover(domain)}
                    onMouseLeave={() => handleDomainHover(null)}
                  >
                    {!shouldReduceMotion && (
                      <motion.div
                        className="absolute inset-0 rounded-[16px]"
                        style={{
                          background: `radial-gradient(circle at center, ${getDomainBloom(domain.id)}, transparent 70%)`,
                          mixBlendMode: 'screen',
                          pointerEvents: 'none',
                          zIndex: -1
                        }}
                        animate={{ opacity: [0.95, 1.00, 0.95] }}
                        transition={{ duration: TOKENS.HORIZON.t_haloPulse, repeat: Infinity, ease: 'easeInOut' }}
                      />
                    )}
                    
                    <div style={{ 
                      position: 'absolute', 
                      top: 0, 
                      left: '12px', 
                      right: '12px', 
                      height: '1px', 
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                      borderRadius: '999px'
                    }} />
                    
                    <div className="flex items-center gap-3 mb-4" style={{ paddingTop: '2px' }}>
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" 
                        style={{ 
                          background: `${getDomainColor(domain.id)}15`, 
                          border: `1px solid ${getDomainColor(domain.id)}30`,
                          boxShadow: `0 0 12px ${getDomainBloom(domain.id)}`,
                          color: getDomainColor(domain.id)
                        }}
                      >
                        {React.cloneElement(getDomainIcon(domain.id), { className: "w-4 h-4", strokeWidth: 2 })}
                      </div>
                      <div className="flex-1 min-w-0">
                        <motion.h4 
                          initial={{ opacity: 0, y: -3 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: TOKENS.HORIZON.t_tooltipTextStagger, duration: TOKENS.HORIZON.t_tooltipTextDuration }}
                          style={{ 
                            color: TOKENS.colors.textPrimary, 
                            fontSize: getResponsiveFont('headline'),
                            fontWeight: TOKENS.type.headline.weight,
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                            letterSpacing: '-0.015em',
                            lineHeight: 1.2
                          }}
                        >
                          {domain.id.charAt(0).toUpperCase() + domain.id.slice(1)}
                        </motion.h4>
                        <motion.div 
                          initial={{ opacity: 0, y: -3 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: TOKENS.HORIZON.t_tooltipTextStagger * 1.5, duration: TOKENS.HORIZON.t_tooltipTextDuration }}
                          className="flex items-center gap-1.5"
                          style={{ marginTop: '2px' }}
                        >
                          {React.cloneElement(getPostureIcon(domain.posture), { className: "w-3.5 h-3.5" })}
                          <span style={{ 
                            color: getDomainText(domain.id), 
                            fontSize: getResponsiveFont('subtext'),
                            fontWeight: TOKENS.type.subtext.weight,
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
                          }}>
                            {domain.posture.charAt(0).toUpperCase() + domain.posture.slice(1)}
                          </span>
                        </motion.div>
                      </div>
                    </div>
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 3 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: TOKENS.HORIZON.t_tooltipTextStagger * 2, duration: TOKENS.HORIZON.t_tooltipTextDuration }}
                      className="flex items-center gap-3 mb-4 pb-4"
                      style={{ borderBottom: `1px solid ${TOKENS.HORIZON.drawerDivider}` }}
                    >
                      <div className="relative w-7 h-7 flex-shrink-0">
                        <svg className="transform -rotate-90" width="28" height="28">
                          <circle cx="14" cy="14" r="12" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2.5" />
                          <circle 
                            cx="14" 
                            cy="14" 
                            r="12" 
                            fill="none" 
                            stroke={getDomainColor(domain.id)} 
                            strokeWidth="2.5" 
                            strokeLinecap="round" 
                            strokeDasharray="75.4"
                            strokeDashoffset={75.4 - (75.4 * domain.confidence_pct / 100)}
                          />
                        </svg>
                        <div 
                          className="absolute inset-0 flex items-center justify-center font-bold" 
                          style={{ 
                            color: TOKENS.colors.textPrimary, 
                            fontSize: '9px',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'
                          }}
                        >
                          {domain.confidence_pct}
                          {domain.confidenceDelta !== undefined && domain.confidenceDelta !== 0 && (
                            <motion.span 
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.15, duration: 0.15 }}
                              className="absolute -right-1 -top-0.5 text-[7px]"
                              style={{ 
                                color: domain.confidenceDelta > 0 ? TOKENS.colors.deltaUp : TOKENS.colors.deltaDown
                              }}
                            >
                              {domain.confidenceDelta > 0 ? '▲' : '▼'}
                            </motion.span>
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div style={{ 
                          fontSize: getResponsiveFont('confidence'),
                          fontWeight: TOKENS.type.confidence.weight,
                          color: TOKENS.colors.textLabel, 
                          letterSpacing: '0.12em', 
                          textTransform: 'uppercase',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                          marginBottom: '3px'
                        }}>
                          CONFIDENCE
                        </div>
                        <div style={{ 
                          fontSize: getResponsiveFont('subtext'),
                          fontWeight: TOKENS.type.subtext.weight,
                          color: TOKENS.colors.textSecondary,
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
                        }}>
                          Strength: {Math.round(domain.strength * 100)}%
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.p
                      initial={{ opacity: 0, y: 3 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: TOKENS.HORIZON.t_tooltipTextStagger * 3, duration: TOKENS.HORIZON.t_tooltipTextDuration }}
                      style={{ 
                        color: TOKENS.colors.textSecondary, 
                        fontSize: getResponsiveFont('body'),
                        fontWeight: TOKENS.type.body.weight,
                        lineHeight: `${TOKENS.HORIZON.lineHeight}px`,
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                        letterSpacing: '-0.01em'
                      }}
                    >
                      {domain.summary.length > 120 ? domain.summary.substring(0, 120) + '...' : domain.summary}
                    </motion.p>
                    
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: TOKENS.HORIZON.t_tooltipTextStagger * 4, duration: TOKENS.HORIZON.t_tooltipTextDuration }}
                      className="mt-4 pt-4 flex items-center justify-center gap-1.5"
                      style={{ borderTop: `1px solid ${TOKENS.HORIZON.drawerDivider}` }}
                    >
                      <span style={{ 
                        fontSize: getResponsiveFont('cta'),
                        fontWeight: TOKENS.type.cta.weight,
                        color: TOKENS.colors.textTertiary, 
                        letterSpacing: '0.01em',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
                      }}>
                        Click to view details
                      </span>
                      <ArrowRight className="w-3 h-3" style={{ color: TOKENS.colors.textTertiary }} />
                    </motion.div>
                  </motion.div>
                </React.Fragment>
              );
            })()}
          </AnimatePresence>

          {domains.map((domain) => {
            const orbPos = getOrbPosition(domain.id, domain.strength, swayTime, parallaxX.get(), parallaxY.get());
            const labelPos = getLabelPosition(orbPos.x, orbPos.y, orbPos.radius);
            const isHovered = hoveredDomain === domain.id;
            const isSelected = selectedDomain?.id === domain.id;
            
            return (
              <motion.div key={`label-${domain.id}`} style={{ position: 'absolute', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', background: 'rgba(10,14,20,0.50)', border: `1px solid ${TOKENS.HORIZON.glassBorder}`, borderRadius: '10px', padding: '5px 9px', fontWeight: 600, fontSize: '11px', letterSpacing: '0.03em', textTransform: 'lowercase', textShadow: '0 1px 2px rgba(0,0,0,0.4)', pointerEvents: 'none', zIndex: 3, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }} animate={{ left: `${labelPos.x}px`, top: `${labelPos.y}px`, x: '-50%', y: '-50%', color: isHovered || isSelected ? TOKENS.colors.textLabel : getDomainText(domain.id), scale: isHovered || isSelected ? 1.05 : 1, boxShadow: isHovered || isSelected ? '0 0 16px rgba(160,191,255,0.15)' : 'none' }} transition={{ left: { duration: TOKENS.HORIZON.t_labelLag, ease: TOKENS.HORIZON.easingApple }, top: { duration: TOKENS.HORIZON.t_labelLag, ease: TOKENS.HORIZON.easingApple }, color: { duration: TOKENS.HORIZON.t_hover, ease: TOKENS.HORIZON.easing }, scale: { duration: TOKENS.HORIZON.t_hover, ease: TOKENS.HORIZON.easing }, boxShadow: { duration: TOKENS.HORIZON.t_hover, ease: TOKENS.HORIZON.easing } }}>
                {domain.id}
              </motion.div>
            );
          })}
        </motion.div>

        <div ref={footerRef} onMouseEnter={() => setIsStatusBarHovered(true)} onMouseLeave={() => setIsStatusBarHovered(false)} style={{ position: 'absolute', left: '14%', right: '14%', bottom: '32px', height: `${footerH}px`, borderRadius: '20px', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '14px', backdropFilter: getBlur('chip'), WebkitBackdropFilter: getBlur('chip'), background: TOKENS.HORIZON.glassBg, border: `1px solid ${TOKENS.HORIZON.glassBorder}`, boxShadow: `${TOKENS.HORIZON.panelShadow}, inset 0 0 2px rgba(106,199,247,0.12)`, zIndex: 5, cursor: 'pointer', transition: 'filter 200ms cubic-bezier(0.4,0,0.2,1)', filter: isStatusBarHovered ? 'brightness(1.08)' : 'brightness(1)' }}>
          <div style={{ width: '160px', position: 'relative' }}>
            <div style={{ height: '2px', borderRadius: '999px', position: 'relative', overflow: 'hidden', background: 'linear-gradient(90deg, rgba(106,199,247,0.3), rgba(180,247,192,0.3), rgba(255,211,122,0.3))' }}>
              {!shouldReduceMotion && <motion.div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)', width: '100%' }} animate={{ x: ['-100%', '100%'] }} transition={{ duration: TOKENS.HORIZON.t_sweep, repeat: Infinity, ease: 'linear' }} />}
              <div style={{ position: 'absolute', bottom: '-8px', left: 0, right: 0, height: '8px', background: 'linear-gradient(90deg, rgba(106,199,247,0.15), rgba(180,247,192,0.15), rgba(255,211,122,0.15))', filter: 'blur(8px)', opacity: 0.15 }} />
              <motion.div style={{ position: 'absolute', top: '50%', width: '10px', height: '10px', borderRadius: '999px', background: dominantDriver === 'balanced' ? 'rgba(255,255,255,0.7)' : getDomainColor(dominantDriver), boxShadow: `0 0 20px ${dominantDriver === 'balanced' ? 'rgba(255,255,255,0.5)' : getDomainBloom(dominantDriver)}, 0 0 8px rgba(255,255,255,0.3)`, transform: 'translate(-50%, -50%)', border: '1px solid rgba(255,255,255,0.3)' }} animate={{ left: `calc(10% + ${balanceBias * 80}%)` }} transition={{ duration: 0.8, ease: TOKENS.HORIZON.overshoot }} />
            </div>
          </div>
          <div className="flex-1 flex items-center gap-3">
            <span style={{ color: TOKENS.colors.textSecondary, fontSize: '14px', lineHeight: '20px', textShadow: '0 1px 2px rgba(0,0,0,0.4)', fontWeight: 400, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>{globalSummary}</span>
            <div className="relative">
              <button onMouseEnter={() => setShowEquilibriumTip(true)} onMouseLeave={() => setShowEquilibriumTip(false)} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors" style={{ minWidth: '32px', minHeight: '32px' }} aria-label="Equilibrium info"><Info className="w-4 h-4" style={{ color: TOKENS.colors.textTertiary }} /></button>
              <AnimatePresence>
                {showEquilibriumTip && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.80 }} exit={{ opacity: 0 }} transition={{ duration: 0.18, ease: TOKENS.HORIZON.easingApple }} className="absolute bottom-full right-0 mb-2 p-3 rounded-lg" style={{ background: TOKENS.HORIZON.glassBg, backdropFilter: getBlur('chip'), WebkitBackdropFilter: getBlur('chip'), border: `1px solid ${TOKENS.HORIZON.glassBorder}`, boxShadow: TOKENS.HORIZON.panelShadow, width: '240px', pointerEvents: 'none' }}><p style={{ fontSize: '12px', lineHeight: '1.5', color: TOKENS.colors.textSecondary, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>Real-time equilibrium state showing the balance and lean of macro forces.</p></motion.div>}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center" style={{ marginTop: '10px' }}>
        <p style={{ fontSize: '9px', fontWeight: 400, color: TOKENS.colors.textTertiary, opacity: 0.55, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>Data via Lyra models</p>
      </div>

      <AnimatePresence>
        {selectedDomain && (
          <motion.div 
            className="fixed inset-0 z-40" 
            style={{ background: 'rgba(6,8,13,0.70)', backdropFilter: TOKENS.HORIZON.backdropBlur, WebkitBackdropFilter: TOKENS.HORIZON.backdropBlur }}
            initial={{ opacity: 0 }} 
            animate={{ opacity: TOKENS.HORIZON.backdropOpacity }} 
            exit={{ opacity: 0 }}
            transition={{ duration: TOKENS.HORIZON.t_drawerOpen, ease: TOKENS.HORIZON.easingCubic }} 
            onClick={handleCloseDrawer} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedDomain && drawerOrigin && (
          <motion.div 
            ref={drawerRef}
            className="fixed z-50 flex flex-col drawer-with-header-safe" 
            style={{
              left: drawerCenterPosition.left,
              top: drawerCenterPosition.top,
              width: drawerCenterPosition.width,
              height: drawerCenterPosition.height,
              backdropFilter: TOKENS.HORIZON.drawerBlur,
              WebkitBackdropFilter: TOKENS.HORIZON.drawerBlur,
              background: TOKENS.HORIZON.drawerGlass,
              border: `1px solid ${TOKENS.HORIZON.glassBorder}`,
              boxShadow: `${TOKENS.HORIZON.drawerShadow}, ${TOKENS.HORIZON.panelShadow}, 0 0 12px ${TOKENS.HORIZON.drawerEdgeBloom}, inset 0 0 0 1px rgba(255,255,255,0.10)`,
              borderRadius: '24px',
              overflow: 'hidden',
              filter: `brightness(${drawerLuminance})`,
              pointerEvents: 'auto'
            }}
            initial={{ 
              left: drawerOrigin.screenX,
              top: drawerOrigin.screenY + 10,
              width: 0,
              height: 0,
              scale: 0.96,
              opacity: 0
            }} 
            animate={{ 
              left: drawerCenterPosition.left,
              top: drawerCenterPosition.top,
              width: drawerCenterPosition.width,
              height: drawerCenterPosition.height,
              scale: 1,
              opacity: 1
            }} 
            exit={{ 
              left: drawerOrigin.screenX,
              top: drawerOrigin.screenY + 10,
              width: 0,
              height: 0,
              scale: 0.96,
              opacity: 0
            }}
            transition={{ duration: TOKENS.HORIZON.t_drawerOpen, ease: TOKENS.HORIZON.easingCubic }} 
            onClick={(e) => e.stopPropagation()}
          >
            
            <div 
              className="drawer-header-blur-extension"
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: '-16px',
                height: '16px',
                backdropFilter: TOKENS.HORIZON.drawerBlur,
                WebkitBackdropFilter: TOKENS.HORIZON.drawerBlur,
                background: 'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0))',
                pointerEvents: 'none',
                zIndex: 0
              }}
              aria-hidden="true"
            />
            
            <motion.div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate3d(-50%, -50%, 0)', width: '120%', height: '120%', background: `radial-gradient(circle at center, ${getDomainBloom(selectedDomain.id)} 0%, transparent 60%)`, opacity: 0.08, filter: 'blur(32px)', pointerEvents: 'none', mixBlendMode: 'screen', zIndex: 0 }} initial={{ opacity: 0 }} animate={{ opacity: 0.08, x: glassParallaxX, y: glassParallaxY }} exit={{ opacity: 0 }} transition={{ opacity: { duration: 0.5, ease: 'easeInOut' } }} />
            <motion.div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '80px', background: `linear-gradient(to bottom, ${TOKENS.HORIZON.lightTemp} 0%, ${TOKENS.HORIZON.lightTempBottom} 100%)`, pointerEvents: 'none', borderRadius: '24px 24px 0 0', zIndex: 1 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: 'easeOut' }} />
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100%', background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0) 100%)', pointerEvents: 'none', borderRadius: '24px', zIndex: 1 }} />
            
            <motion.div className="flex-shrink-0 p-5 border-b" style={{ background: TOKENS.HORIZON.drawerTint, borderColor: TOKENS.HORIZON.drawerDivider, backdropFilter: getBlur('chip'), position: 'relative', zIndex: 10 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.05, duration: TOKENS.HORIZON.t_contentStagger, ease: TOKENS.HORIZON.easingOutQuad }}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: `${getDomainColor(selectedDomain.id)}15`, border: `1px solid ${getDomainColor(selectedDomain.id)}30`, boxShadow: `0 0 20px ${getDomainBloom(selectedDomain.id)}`, color: getDomainColor(selectedDomain.id) }}>
                    {getDomainIcon(selectedDomain.id)}
                  </div>
                  <div>
                    <h3 style={{ color: TOKENS.colors.textPrimary, fontSize: '18px', fontWeight: 600, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>{selectedDomain.id.charAt(0).toUpperCase() + selectedDomain.id.slice(1)}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {getPostureIcon(selectedDomain.posture)}
                      <span style={{ color: getDomainText(selectedDomain.id), fontSize: '14px', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>{selectedDomain.posture.charAt(0).toUpperCase() + selectedDomain.posture.slice(1)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={handlePrevDomain} className="p-2 rounded-lg hover:bg-white/10 transition-colors" style={{ color: TOKENS.colors.textTertiary, minWidth: '36px', minHeight: '36px' }} aria-label="Previous domain"><ChevronLeft className="w-4 h-4" /></button>
                  <button onClick={handleNextDomain} className="p-2 rounded-lg hover:bg-white/10 transition-colors" style={{ color: TOKENS.colors.textTertiary, minWidth: '36px', minHeight: '36px' }} aria-label="Next domain"><ChevronRight className="w-4 h-4" /></button>
                  <button onClick={handleCloseDrawer} className="p-2 rounded-lg hover:bg-white/10 transition-colors" style={{ color: TOKENS.colors.textTertiary, minWidth: '36px', minHeight: '36px' }} aria-label="Close drawer"><X className="w-5 h-5" /></button>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="relative w-9 h-9">
                  <svg className="transform -rotate-90" width="36" height="36">
                    <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
                    <motion.circle cx="18" cy="18" r="16" fill="none" stroke={getDomainColor(selectedDomain.id)} strokeWidth="3" strokeLinecap="round" strokeDasharray="100" initial={{ strokeDashoffset: 100 }} animate={{ strokeDashoffset: 100 - (100 * selectedDomain.confidence_pct / 100) }} transition={{ duration: 0.3, ease: TOKENS.HORIZON.easingElastic }} />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-bold" style={{ color: TOKENS.colors.textPrimary, fontSize: '12px' }}>
                    {selectedDomain.confidence_pct}%
                    {selectedDomain.confidenceDelta !== undefined && (
                      <span className={`absolute -right-2 -top-1 text-[8px] ${selectedDomain.confidenceDelta > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {selectedDomain.confidenceDelta > 0 ? '↑' : '↓'}{Math.abs(selectedDomain.confidenceDelta)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-xs font-medium mb-1" style={{ color: TOKENS.colors.textLabel, letterSpacing: '0.2em' }}>CONFIDENCE</div>
                  <div className="text-sm" style={{ color: TOKENS.colors.textSecondary, fontWeight: 400 }}>Strength: {Math.round(selectedDomain.strength * 100)}%</div>
                </div>
              </div>
            </motion.div>

            <div className="flex-1 overflow-y-auto p-6" style={{ position: 'relative', zIndex: 2 }}>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: TOKENS.HORIZON.t_contentStagger, duration: 0.2 }} style={{ marginBottom: `${TOKENS.HORIZON.blockSpacing}px` }}>
                <h4 style={{ color: 'rgba(255,255,255,0.9)', fontSize: '13px', fontWeight: 500, marginBottom: '8px' }}>What This Means</h4>
                <p style={{ color: TOKENS.colors.textSecondary, fontSize: '14px', lineHeight: '22px' }}>{selectedDomain.summary}</p>
                {selectedDomain.addendum && <p style={{ color: TOKENS.colors.textSecondary, fontSize: '13px', marginTop: '8px', opacity: 0.9 }}>{selectedDomain.addendum}</p>}
              </motion.div>
              
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: TOKENS.HORIZON.t_contentStagger * 2, duration: 0.2 }} style={{ marginBottom: `${TOKENS.HORIZON.blockSpacing}px` }}>
                <h4 style={{ color: 'rgba(255,255,255,0.9)', fontSize: '13px', fontWeight: 500, marginBottom: '8px' }}>48-Hour Trend</h4>
                <div className="relative p-3 rounded-lg" style={{ background: 'rgba(0, 0, 0, 0.25)', border: `1px solid ${TOKENS.HORIZON.glassBorder}` }}>
                  <svg 
                    width="100%" 
                    height="56" 
                    className="overflow-visible"
                    onMouseLeave={() => setHoveredChartPoint(null)}
                  >
                    <defs>
                      <linearGradient id={`sparkline-drawer-${selectedDomain.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={getDomainColor(selectedDomain.id)} stopOpacity="0.7" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0)" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {(() => {
                      const data = selectedDomain.sparkline;
                      const width = 460;
                      const height = 56;
                      const padding = 4;
                      const minValue = Math.min(...data);
                      const maxValue = Math.max(...data);
                      const range = maxValue - minValue || 0.1;
                      const points = data.map((value, i) => {
                        const x = (i / (data.length - 1)) * width;
                        const y = height - padding - ((value - minValue) / range) * (height - padding * 2);
                        return { x, y, value, index: i };
                      });
                      const pathD = `M ${points.map(p => `${p.x},${p.y}`).join(' ')}`;
                      const areaD = `M ${points.map(p => `${p.x},${p.y}`).join(' ')} L ${width},${height} L 0,${height} Z`;
                      
                      const lastPoint = points[points.length - 1];

                      return (
                        <>
                          <path d={areaD} fill={`url(#sparkline-drawer-${selectedDomain.id})`} />
                          <path d={pathD} fill="none" stroke={getDomainColor(selectedDomain.id)} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                          
                          {points.map((point, i) => (
                            <g key={i}>
                              <circle
                                cx={point.x}
                                cy={point.y}
                                r="6"
                                fill="transparent"
                                style={{ cursor: 'pointer' }}
                                onMouseEnter={() => setHoveredChartPoint(point)}
                                aria-label={`Data point ${i + 1}: ${(point.value * 100).toFixed(1)}%`}
                              />
                              {hoveredChartPoint?.index === i && (
                                <>
                                  <line x1={point.x} y1={point.y} x2={point.x} y2={height} stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="2,2" />
                                  <circle cx={point.x} cy={point.y} r="3" fill={getDomainColor(selectedDomain.id)} opacity="1" />
                                  <circle cx={point.x} cy={point.y} r="5" fill="none" stroke={getDomainColor(selectedDomain.id)} strokeWidth="1.5" opacity="0.5" />
                                </>
                              )}
                            </g>
                          ))}
                          
                          <g>
                            <circle cx={lastPoint.x} cy={lastPoint.y} r="2.5" fill={getDomainColor(selectedDomain.id)} opacity={hoveredChartPoint?.index === points.length - 1 ? "1" : "0.7"}>
                              <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
                            </circle>
                            <circle cx={lastPoint.x} cy={lastPoint.y} r="6" fill="none" stroke={getDomainColor(selectedDomain.id)} strokeWidth="1" opacity="0.3">
                              <animate attributeName="r" values="6;9;6" dur="2s" repeatCount="indefinite" />
                              <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2s" repeatCount="indefinite" />
                            </circle>
                          </g>
                        </>
                      );
                    })()}
                  </svg>
                  
                  <div className="absolute top-2 right-2 px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1" style={{ background: 'rgba(0,0,0,0.4)', color: getDomainColor(selectedDomain.id), opacity: 0.85 }}>
                    {(selectedDomain.sparkline[selectedDomain.sparkline.length - 1] * 100).toFixed(1)}%
                    {(() => {
                      const last6h = selectedDomain.sparkline.slice(-3);
                      const roc = last6h[last6h.length - 1] - last6h[0];
                      return roc > 0.01 ? <TrendingUp className="w-3 h-3" /> : roc < -0.01 ? <TrendingDown className="w-3 h-3" /> : null;
                    })()}
                  </div>
                  
                  <AnimatePresence>
                    {hoveredChartPoint && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.12 }}
                        className="absolute px-3 py-2 rounded-lg"
                        style={{
                          left: `${(hoveredChartPoint.x / 460) * 100}%`,
                          top: '-60px',
                          transform: 'translateX(-50%)',
                          background: 'rgba(0,0,0,0.85)',
                          backdropFilter: 'blur(12px)',
                          border: '1px solid rgba(255,255,255,0.15)',
                          fontSize: '11px',
                          color: 'rgba(255,255,255,0.95)',
                          whiteSpace: 'nowrap',
                          pointerEvents: 'none'
                        }}
                      >
                        <div className="font-bold mb-1">{(hoveredChartPoint.value * 100).toFixed(1)}%</div>
                        <div className="text-[10px] opacity-75">Point {hoveredChartPoint.index + 1} / {selectedDomain.sparkline.length}</div>
                        {hoveredChartPoint.index > 0 && (
                          <div className="text-[10px] mt-1">
                            Δ prev: {(((hoveredChartPoint.value - selectedDomain.sparkline[hoveredChartPoint.index - 1]) / selectedDomain.sparkline[hoveredChartPoint.index - 1]) * 100).toFixed(2)}%
                          </div>
                        )}
                        <div className="text-[10px]">
                          Δ 48h: {(((hoveredChartPoint.value - selectedDomain.sparkline[0]) / selectedDomain.sparkline[0]) * 100).toFixed(2)}%
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
              
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: TOKENS.HORIZON.t_contentStagger * 3, duration: 0.2 }} style={{ marginBottom: `${TOKENS.HORIZON.blockSpacing}px` }}>
                <h4 style={{ color: 'rgba(255,255,255,0.9)', fontSize: '13px', fontWeight: 500, marginBottom: '8px' }}>Downstream Effects</h4>
                <div className="space-y-2">
                  {selectedDomain.ripple.slice(0, 3).map((effect, i) => (
                    <div key={i} style={{ backdropFilter: getBlur('chip'), background: 'rgba(255,255,255,0.06)', border: `1px solid ${TOKENS.HORIZON.glassBorder}`, borderRadius: '12px', padding: '10px 12px', display: 'flex', gap: '8px' }}>
                      <div style={{ width: '4px', height: '4px', borderRadius: '999px', marginTop: '6px', background: getDomainColor(selectedDomain.id), boxShadow: `0 0 6px ${getDomainBloom(selectedDomain.id)}` }} />
                      <span style={{ color: TOKENS.colors.textChip, fontSize: '12px', lineHeight: '1.4' }}>{effect}</span>
                    </div>
                  ))}
                </div>
                
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: TOKENS.HORIZON.t_contentStagger * 4, duration: 0.2 }}
                  className="mt-3 p-3 rounded-lg"
                  style={{ background: 'rgba(66,135,245,0.08)', border: '1px solid rgba(66,135,245,0.25)' }}
                >
                  <p className="text-xs font-semibold mb-1" style={{ color: 'rgba(66,135,245,0.9)', letterSpacing: '0.15em' }}>ACTIONABLE SIGNAL</p>
                  <p style={{ color: 'rgba(180,200,230,0.95)', fontSize: '11.5px', lineHeight: '1.5' }}>{getActionableSignal(selectedDomain)}</p>
                  
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: TOKENS.HORIZON.t_contentStagger * 4 + TOKENS.HORIZON.t_soWhatDelay, duration: 0.1 }}
                    style={{ color: 'rgba(255,255,255,0.60)', fontSize: '10.5px', lineHeight: '1.45', fontWeight: 400, marginTop: '8px', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
                  >
                    {getSoWhatInterpretation(selectedDomain)}
                  </motion.p>
                </motion.div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: TOKENS.HORIZON.t_contentStagger * 5, duration: 0.2 }} className="pt-3 border-t" style={{ borderColor: TOKENS.HORIZON.drawerDivider }}>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors hover:brightness-110" style={{ background: 'rgba(66,135,245,0.15)', color: '#4287f5', border: '1px solid rgba(66,135,245,0.3)' }} aria-label="View detailed market implications">
                  <span>View market implications</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <div className="flex items-center justify-between mt-2 text-xs" style={{ color: TOKENS.colors.textTertiary }}>
                  <span>Updated {new Date(selectedDomain.last_updated_iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <span className="opacity-60">1-4 • ← → • ESC</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @media (prefers-reduced-motion: reduce) { 
          *, *::before, *::after { animation: none !important; transition: none !important; } 
        }
        
        .orb { min-width: 44px; min-height: 44px; }
        
        .orb:focus-visible { 
          outline: 2px solid rgba(122,215,240,0.9);
          outline-offset: 3px;
          z-index: 251;
        }
        
        .drawer-with-header-safe:focus-within {
          outline: 2px solid rgba(66,135,245,0.6);
          outline-offset: -2px;
          z-index: 251;
        }
        
        @supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
          .drawer-header-blur-extension {
            background: rgba(10,15,22,0.85) !important;
          }
        }
        
        * { 
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        @media (max-width: 1280px) {
          h4, .headline { font-size: ${TOKENS.type.headline.min}px !important; }
          .body-text { font-size: ${TOKENS.type.body.min}px !important; }
          .sub-text { font-size: ${TOKENS.type.subtext.min}px !important; }
        }
        
        @media (prefers-contrast: more) {
          * {
            color: rgba(255,255,255,0.95) !important;
          }
        }
      `}</style>
    </motion.section>
  );
};

export default MacroConstellation;