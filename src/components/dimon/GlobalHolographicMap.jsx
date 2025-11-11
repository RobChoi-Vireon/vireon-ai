
import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Globe, X, TrendingUp, TrendingDown, Minus, ArrowRight, Info, ChevronLeft, ChevronRight, BarChart3, DollarSign, Activity } from 'lucide-react';
import LyraLogo from '../core/LyraLogo';

// ============================================================================
// MACRO CONSTELLATION — OS HORIZON V1.9.7 "NO-STICK HOVER"
// Tight hover bounds • Intent corridor • Velocity exit • Apple precision
// ============================================================================

const TOKENS = {
  HORIZON: {
    globalScale: 1.45, globalScaleMd: 1.3, globalScaleSm: 1.1, clusterOffsetY: -4, orbitRadiusScale: 1.25,
    labelDistanceScale: 1.10,
    glassBg: 'rgba(24, 28, 33, 0.45)',
    glassBorder: 'rgba(160,191,255,0.10)',
    panelShadow: '0 0 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)',
    hoverCardShadow: '0 0 40px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.08)',
    drawerGlass: 'rgba(10,15,22,0.72)', drawerTint: 'rgba(10,15,22,0.45)', drawerBlur: 'blur(22px)',
    drawerEdgeBloom: 'rgba(160,191,255,0.10)', drawerDivider: 'rgba(255,255,255,0.06)',
    drawerShadow: '0 15px 60px rgba(0,0,0,0.30)',
    backdropBlur: 'blur(10px)', backdropOpacity: 0.30,
    blurPanel: 'blur(22px) saturate(165%) brightness(1.05)',
    blurChip: 'blur(16px)', vignetteColor: '#070A0F', vignetteOpacity: 0.28,
    vignetteBlur: 24, localBloomIntensity: 0.18, localBloomRadius: [220, 280],
    // Tight hover zone (v1.9.7)
    hoverEnterRadius: 6, hoverExitRadius: 10, hoverEnterDelay: 100, hoverExitDelay: 90,
    corridorWidth: 16, corridorTTL: 250, velocityThreshold: 600,
    easing: [0.4, 0, 0.2, 1], easingApple: [0.32, 0.72, 0, 1], easingCubic: [0.65, 0, 0.35, 1],
    easingElastic: [0.22, 1, 0.36, 1], easingSine: [0.61, 1, 0.88, 1], easingOutQuad: [0.25, 0.46, 0.45, 0.94],
    overshoot: [0.34, 1.56, 0.64, 1],
    t_drawerOpen: 0.25, t_drawerClose: 0.20,
    t_hover: 0.12, t_haloDecay: 0.18, t_labelLag: 0.08,
    t_tooltipOpen: 0.20, t_tooltipClose: 0.15, t_tooltipTextStagger: 0.08, t_tooltipTextDuration: 0.14,
    t_orbBreathIn: 0.14, t_orbBreathOut: 0.14, t_beamLink: 0.14,
    t_contentStagger: 0.06, t_soWhatDelay: 0.10,
    t_breathe: 4.5, t_orbLifePulse: 4.0, t_haloPulse: 1.5,
    t_pulse: 3, t_orbit: 10, t_sweep: 12, t_parallax: 0.12,
    parallaxOffset: 6, parallaxResponse: 0.4, microParallaxMax: 4, microParallaxDamping: 0.85,
    bgBase: '#06080D', bgEnd: '#0A0E14', bgSubsurfaceCenter: '#121823', bgSubsurfaceEdge: '#0B1016',
    lightTemp: 'rgba(255, 255, 255, 0.03)', lightTempBottom: 'rgba(255, 255, 255, 0.00)',
    lineHeight: 26
  },
  MACRO: {
    fx: { core: '#6AC7F7', halo: 'rgba(106,199,247,0.38)', text: '#B8E7FF', bloom: 'rgba(106,199,247,0.18)', zDepth: -14 },
    rates: { core: '#C0A6FF', halo: 'rgba(192,166,255,0.38)', text: '#DECFFF', bloom: 'rgba(192,166,255,0.18)', zDepth: -6 },
    growth: { core: '#B4F7C0', halo: 'rgba(180,247,192,0.38)', text: '#D4FFDE', bloom: 'rgba(180,247,192,0.18)', zDepth: 8 },
    geopolitics: { core: '#FFD37A', halo: 'rgba(255,211,122,0.38)', text: '#FFE8B8', bloom: 'rgba(255,211,122,0.18)', zDepth: 12 }
  },
  colors: {
    textPrimary: "rgba(255, 255, 255, 0.95)",
    textSecondary: "rgba(255, 255, 255, 0.80)",
    textBody: "rgba(255, 255, 255, 0.88)",
    textLabel: "rgba(255, 255, 255, 0.85)",
    textChip: "rgba(232,235,239,0.85)",
    textTertiary: "rgba(255,255,255,0.65)",
    textCTA: "rgba(145, 181, 255, 0.95)",
    deltaUp: '#6EF3A5',
    deltaDown: '#F38B82'
  }
};

const ANGLES = { rates: 22.5, fx: 160.0, growth: 297.5, geopolitics: 75.0 };
const RADII = { rates: 0.35, fx: 0.39, growth: 0.37, geopolitics: 0.32 };

const MOCK_DOMAINS = [
  { id: "rates", posture: "hawkish", confidence_pct: 78, strength: 0.82,
    summary: "Fed holding firm; terminal rate expectations drift higher on sticky services inflation.",
    ripple: ["Credit spreads widen", "Tech multiples compress", "EM funding costs rise"], addendum: null,
    last_updated_iso: new Date().toISOString(),
    sparkline: [0.72, 0.74, 0.76, 0.75, 0.78, 0.80, 0.79, 0.81, 0.82],
    confidenceDelta: 2 },
  { id: "fx", posture: "stable", confidence_pct: 65, strength: 0.58,
    summary: "Rates aligning globally, risk trades unwinding gradually.",
    ripple: ["EM currencies stabilize", "Energy imports neutral", "Bond yields remain contained."],
    addendum: "Next 48h: FX likely stable; carry re-risk limited unless yields diverge.",
    last_updated_iso: new Date().toISOString(),
    sparkline: [0.60, 0.59, 0.58, 0.57, 0.58, 0.59, 0.58, 0.57, 0.58],
    confidenceDelta: -3 },
  { id: "growth", posture: "softening", confidence_pct: 71, strength: 0.68,
    summary: "China's slowdown is cooling global demand while the US consumer remains resilient.",
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

  const [hoveredDomain, setHoveredDomain] = useState(null);
  const hoverEnterTimerRef = useRef(null);
  const hoverExitTimerRef = useRef(null);

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
    { from: "rates", to: "growth", relationship: 0.7 },
    { from: "fx", to: "geopolitics", relationship: 0.6 },
    { from: "rates", to: "fx", relationship: 0.8 },
    { from: "growth", to: "geopolitics", relationship: 0.5 }
  ], []);

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

  const getDomainColor = (id) => TOKENS.MACRO[id]?.core || TOKENS.MACRO.rates.core;
  const getDomainText = (id) => TOKENS.MACRO[id]?.text || TOKENS.MACRO.rates.text;
  const getDomainBloom = (id) => TOKENS.MACRO[id]?.bloom || TOKENS.MACRO.rates.bloom;

  const getTextOpacityAdjustment = useCallback((domainId) => {
    const bloomColor = TOKENS.MACRO[domainId]?.bloom || TOKENS.MACRO.rates.bloom;
    const rgbaMatch = bloomColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(,\s*([0-9.]+))?\)/);
    if (!rgbaMatch) return 0;

    const r = parseFloat(rgbaMatch[1]);
    const g = parseFloat(rgbaMatch[2]);
    const b = parseFloat(rgbaMatch[3]);
    const a = rgbaMatch[5] !== undefined ? parseFloat(rgbaMatch[5]) : 1;

    const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 * a;

    if (luminance > 0.65) return 0.05;
    if (luminance < 0.35) return -0.05;
    return 0;
  }, []);

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

  // Insight lines for cognitive clarity (v2.2 - Final OS Horizon Polish)
  const getInsightLine = useCallback((domainId) => ({
    growth: "Insight: Rotation toward defensive assets underway as markets rebalance.",
    rates: "Insight: Yields steady — credit markets adjusting to new baseline.",
    fx: "Insight: Capital flows stabilizing; global risk appetite cooling.",
    geopolitics: "Insight: Policy tensions rising — volatility expanding in select regions."
  }[domainId] || "Insight: Market dynamics shifting — monitor key indicators."), []);

  // Concise signal summaries (v2.1 - Apple-style brevity)
  const getConcisenSummary = useCallback((domain) => {
    const summaries = {
      rates: "Fed holding firm; terminal rate expectations drift higher on sticky services inflation.",
      fx: "Rates aligning globally, risk trades unwinding gradually.",
      growth: "China's slowdown is cooling global demand while the US consumer remains resilient.",
      geopolitics: "Energy security concerns persist; trade fragmentation continues to reshape supply chains."
    };
    return summaries[domain.id] || domain.summary;
  }, []);

  // Simplified tight hover with debouncing (v1.9.7 - FIXED)
  const handleDomainHoverEnter = useCallback((domain) => {
    // Clear any pending exit
    if (hoverExitTimerRef.current) {
      clearTimeout(hoverExitTimerRef.current);
      hoverExitTimerRef.current = null;
    }
    
    // Clear any pending enter
    if (hoverEnterTimerRef.current) {
      clearTimeout(hoverEnterTimerRef.current);
    }
    
    // Debounced enter
    hoverEnterTimerRef.current = setTimeout(() => {
      setHoveredDomain(domain.id);
    }, TOKENS.HORIZON.hoverEnterDelay);
  }, []);

  // Fast hover exit (v1.9.7 - FIXED)
  const handleDomainHoverLeave = useCallback(() => {
    // Clear enter timer if still pending
    if (hoverEnterTimerRef.current) {
      clearTimeout(hoverEnterTimerRef.current);
      hoverEnterTimerRef.current = null;
    }
    
    // Clear any pending exit
    if (hoverExitTimerRef.current) {
      clearTimeout(hoverExitTimerRef.current);
    }
    
    // Fast exit
    hoverExitTimerRef.current = setTimeout(() => {
      setHoveredDomain(null);
    }, TOKENS.HORIZON.hoverExitDelay);
  }, []);

  // Drawer open handler - MUST come before handleCardClick
  const handleOpenDrawer = useCallback((domain) => {
    if (selectedDomain?.id === domain.id) return;
    
    const domainPos = getOrbPosition(domain.id, domain.strength, swayTime, 0, 0); 
    const containerRect = containerRef.current?.getBoundingClientRect();
    
    if (containerRect) {
      setDrawerOrigin({ 
        x: domainPos.x, 
        y: domainPos.y, 
        screenX: containerRect.left + domainPos.x, 
        screenY: containerRect.top + domainPos.y 
      });
    }

    if (selectedDomain) {
      setIsSwitchingNode(true);
      setFilamentFlash(domain.id);
      setTimeout(() => setFilamentFlash(null), 200);
      setTimeout(() => {
        setSelectedDomain(domain);
        setShowBeam(true); 
        setIsSwitchingNode(false);
      }, 100);
    } else {
      setOrbPulseActive(true); 
      setTimeout(() => { setOrbPulseActive(false); setShowBeam(true); }, TOKENS.HORIZON.t_orbBreathIn * 1000);
      setTimeout(() => setSelectedDomain(domain), (TOKENS.HORIZON.t_orbBreathIn + TOKENS.HORIZON.t_beamLink) * 1000);
    }
  }, [selectedDomain, getOrbPosition, swayTime]);

  // Card click handler (v1.9.7) - NOW COMES AFTER handleOpenDrawer
  const handleCardClick = useCallback((domain) => {
    // Clear hover timers
    if (hoverEnterTimerRef.current) {
      clearTimeout(hoverEnterTimerRef.current);
      hoverEnterTimerRef.current = null;
    }
    if (hoverExitTimerRef.current) {
      clearTimeout(hoverExitTimerRef.current);
      hoverExitTimerRef.current = null;
    }
    
    setHoveredDomain(null);
    handleOpenDrawer(domain);
  }, [handleOpenDrawer]);

  const handleCloseDrawer = useCallback(() => {
    setShowBeam(false); 
    setOrbPulseActive(true); 
    setTimeout(() => setOrbPulseActive(false), TOKENS.HORIZON.t_orbBreathOut * 1000); 
    setTimeout(() => { 
      setSelectedDomain(null); 
      setIsSwitchingNode(false); 
      setDrawerOrigin(null); 
      
      if (containerRef.current) {
        const orbElement = containerRef.current.querySelector('.orb[data-focused="true"]');
        if (orbElement) orbElement.focus();
      }
    }, TOKENS.HORIZON.t_drawerClose * 1000); 
  }, []);

  const handleNextDomain = useCallback(() => {
    if (!selectedDomain) return;
    const idx = domains.findIndex(d => d.id === selectedDomain.id);
    handleOpenDrawer(domains[(idx + 1) % domains.length]);
  }, [selectedDomain, domains, handleOpenDrawer]);

  const handlePrevDomain = useCallback(() => {
    if (!selectedDomain) return;
    const idx = domains.findIndex(d => d.id === selectedDomain.id);
    handleOpenDrawer(domains[(idx - 1 + domains.length) % domains.length]);
  }, [selectedDomain, domains, handleOpenDrawer]);

  // Orb Life Pulse
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

  // Keyboard shortcuts
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

  // Simplified mouse move - parallax only (v1.9.7 - FIXED)
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current || shouldReduceMotion) return;
      const rect = containerRef.current.getBoundingClientRect();
      const normX = ((e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2));
      const normY = ((e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2));
      mouseX.set(normX * 14);
      mouseY.set(normY * 14);
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

  const drawerCenterPosition = useMemo(() => {
    if (!selectedDomain || !drawerOrigin) return { x: 0, y: 0 };

    const headerHeight = 72;
    const safeTopPadding = 8;
    const safeTop = headerHeight + safeTopPadding;
    const bottomMargin = 16;

    const drawerWidth = 520;
    const maxDrawerHeight = Math.min(window.innerHeight - headerHeight - 72 - bottomMargin, 700);
    const drawerHeight = maxDrawerHeight;

    const bloomOriginY = drawerOrigin.screenY + 10;

    let targetTop = bloomOriginY - (drawerHeight / 2);
    targetTop = Math.max(targetTop, safeTop);
    targetTop = Math.min(targetTop, window.innerHeight - drawerHeight - bottomMargin);

    const viewportAdjustment = window.innerHeight < 720 ? 24 : 0;

    return {
      left: drawerOrigin.screenX - (drawerWidth / 2),
      top: targetTop,
      width: drawerWidth,
      height: drawerHeight - viewportAdjustment
    };
  }, [selectedDomain, drawerOrigin]);

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

      <div ref={containerRef} className="grid-wrapper relative w-full overflow-hidden" data-dominant={dominantDriver} style={{ height: '700px', background: `linear-gradient(184deg, ${TOKENS.HORIZON.bgBase} 0%, ${TOKENS.HORIZON.bgEnd} 100%)`, border: '1px solid rgba(160,191,255,0.08)', borderRadius: '24px', paddingTop: '4vh', paddingBottom: '5vh', position: 'relative', pointerEvents: 'none' }}>

        <motion.div style={{ position: 'absolute', inset: 0, background: `radial-gradient(900px circle at 52% 48%, ${TOKENS.HORIZON.bgSubsurfaceCenter} 0%, ${TOKENS.HORIZON.bgSubsurfaceEdge} 70%)`, opacity: 0.35, borderRadius: '24px', pointerEvents: 'none', zIndex: 1 }} animate={{ x: shouldReduceMotion ? 0 : bgParallaxX.get() * TOKENS.HORIZON.parallaxOffset * 0.6, y: shouldReduceMotion ? 0 : bgParallaxY.get() * TOKENS.HORIZON.parallaxOffset * 0.6 }} transition={{ duration: TOKENS.HORIZON.t_parallax, ease: TOKENS.HORIZON.easingApple }} />

        <motion.div style={{ position: 'absolute', inset: 0, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3Csvg%3E")`, backgroundSize: '200px 200px', opacity: 0.15, borderRadius: '24px', pointerEvents: 'none', zIndex: 2 }} animate={{ backgroundPosition: [`${noiseDrift}px 0px`, `${noiseDrift + 0.3}px 0px`] }} transition={{ duration: 1, ease: 'linear' }} />

        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at center, transparent 60%, ${TOKENS.HORIZON.vignetteColor} 100%)`, opacity: TOKENS.HORIZON.vignetteOpacity, filter: `blur(${TOKENS.HORIZON.vignetteBlur}px)`, borderRadius: '24px', pointerEvents: 'none', zIndex: 2 }} />

        {domains.map((domain) => {
          const pos = getOrbPosition(domain.id, domain.strength, swayTime, 0, 0);
          const bloomRadius = Math.min(...TOKENS.HORIZON.localBloomRadius) + (domain.strength * (Math.max(...TOKENS.HORIZON.localBloomRadius) - Math.min(...TOKENS.HORIZON.localBloomRadius)));
          const isActiveOrb = selectedDomain?.id === domain.id;
          const isHovered = hoveredDomain === domain.id;

          return (
            <React.Fragment key={`bloom-${domain.id}`}>
              <motion.div
                className="orb-halo"
                style={{
                  position: 'absolute',
                  left: pos.x,
                  top: pos.y,
                  width: bloomRadius * 2,
                  height: bloomRadius * 2,
                  transform: 'translate(-50%, -50%)',
                  background: `radial-gradient(circle, ${getDomainBloom(domain.id)}, rgba(0,0,0,0.25) 72%)`,
                  opacity: selectedDomain ? 0.12 : (isHovered ? 0.45 : TOKENS.HORIZON.localBloomIntensity),
                  mixBlendMode: 'screen',
                  pointerEvents: 'none',
                  zIndex: 2,
                  transition: 'opacity 0.3s ease'
                }}
              />
              {isActiveOrb && (
                <motion.div
                  className="orb-halo"
                  animate={{ opacity: [0.15, 0.22, 0.15], scale: [1, 1.12, 1] }}
                  transition={{ opacity: { duration: 4, repeat: Infinity, ease: 'easeInOut' }, scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' } }}
                  style={{ position: 'absolute', left: pos.x, top: pos.y, width: bloomRadius * 2.3, height: bloomRadius * 2.3, transform: 'translate(-50%, -50%)', background: `radial-gradient(circle, ${getDomainBloom(domain.id)} 0%, transparent 65%)`, filter: 'blur(28px)', mixBlendMode: 'screen', pointerEvents: 'none', zIndex: 1 }}
                />
              )}
            </React.Fragment>
          );
        })}

        <motion.div className="glow-overlay" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 4 }} animate={{ x: shouldReduceMotion ? 0 : parallaxX.get() * TOKENS.HORIZON.parallaxOffset * 0.15, y: shouldReduceMotion ? 0 : parallaxY.get() * TOKENS.HORIZON.parallaxOffset * 0.15 }} transition={{ duration: TOKENS.HORIZON.t_parallax, ease: TOKENS.HORIZON.easingApple }}>
          {selectedDomain && <motion.div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: '100%', height: '100%', background: `radial-gradient(circle at center, ${getDomainBloom(selectedDomain.id)} 0%, transparent 60%)`, opacity: 0.1, filter: 'blur(80px)', pointerEvents: 'none', mixBlendMode: 'screen' }} initial={{ opacity: 0 }} animate={{ opacity: 0.1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: 'easeInOut' }} />}
        </motion.div>

        <motion.div ref={constellationRef} style={{ position: 'absolute', inset: 0, willChange: 'transform', zIndex: 3, opacity: selectedDomain ? 0.9 : 1, pointerEvents: 'auto' }} animate={{ y: constellationShift, x: shouldReduceMotion ? 0 : parallaxX.get() * TOKENS.HORIZON.parallaxResponse }} transition={{ y: { duration: shouldReduceMotion ? 0 : 0.4, ease: TOKENS.HORIZON.easing }, x: { duration: shouldReduceMotion ? 0 : TOKENS.HORIZON.t_parallax, ease: TOKENS.HORIZON.easingApple } }}>
          <div style={{ position: 'absolute', left: `${cx}px`, top: `${cy}px`, width: `${orbitBaseRadius * 2}px`, height: `${orbitBaseRadius * 2}px`, transform: 'translate(-50%, -50%)', borderRadius: '999px', boxShadow: 'inset 0 0 0 1px rgba(160,191,255,0.06)', opacity: 0.2, filter: 'blur(0.5px)', pointerEvents: 'none', zIndex: 2, transition: shouldReduceMotion ? 'none' : 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }} aria-hidden="true" />

          <motion.div style={{ position: 'absolute', left: `${cx}px`, top: `${cy}px`, zIndex: 2, pointerEvents: 'none' }} animate={{ x: nucleusOffset.x, y: nucleusOffset.y }} transition={{ duration: 0.8, ease: TOKENS.HORIZON.easing }}>
            <motion.div style={{ position: 'absolute', left: 0, top: 0, transform: 'translate(-50%, -50%)', width: `${22 * getGlobalScale()}px`, height: `${22 * getGlobalScale()}px`, borderRadius: '999px', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', background: 'rgba(160,191,255,0.12)', boxShadow: '0 0 80px rgba(160,191,255,0.15), inset 0 0 0 1px rgba(255,255,255,0.08)', pointerEvents: 'none' }} animate={shouldReduceMotion ? {} : { scale: [0.985, 1.025, 0.985], opacity: [0.985, 1, 0.985] }} transition={{ duration: TOKENS.HORIZON.t_breathe, repeat: Infinity, ease: "easeInOut" }} aria-hidden="true" />
            {domains.map((d) => <motion.div key={`ray-${d.id}`} style={{ position: 'absolute', left: 0, top: 0, width: '28%', height: '2px', transformOrigin: 'left center', borderRadius: '999px', background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.45))', pointerEvents: 'none' }} animate={{ rotate: ANGLES[d.id], opacity: d.id === dominantDriver ? 0.5 : 0.15 }} transition={{ duration: 0.8, ease: TOKENS.HORIZON.easing }} />)}
          </motion.div>

          <svg width={dimensions.width} height={dimensions.height} style={{ position: 'absolute', inset: 0, overflow: 'visible', zIndex: 2, pointerEvents: 'none' }}>
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

            <g className="link-path" style={{ mixBlendMode: 'screen', pointerEvents: 'none' }}>
              {connections.map((conn, i) => {
                const from = domains.find(d => d.id === conn.from);
                const to = domains.find(d => d.id === conn.to);
                const fromPos = getOrbPosition(conn.from, from.strength, swayTime, parallaxX.get(), parallaxY.get());
                const toPos = getOrbPosition(conn.to, to.strength, swayTime, parallaxX.get(), parallaxY.get());
                const isAdjacent = hoveredDomain === conn.from || hoveredDomain === conn.to || selectedDomain?.id === conn.from || selectedDomain?.id === conn.to;
                const isFlashing = filamentFlash === conn.from || filamentFlash === conn.to;

                return (
                  <motion.path key={`conn-${i}`} d={`M ${fromPos.x},${fromPos.y} Q ${cx},${cy} ${toPos.x},${toPos.y}`} stroke={`url(#conn-grad-${i})`} strokeWidth="1" strokeLinecap="round" fill="none" animate={{ opacity: isFlashing ? [0.20, 0.60, 0.20] : isAdjacent ? (selectedDomain ? 0.15 : [0.20, 0.45, 0.20]) : shouldReduceMotion ? (selectedDomain ? 0.10 : 0.20) : (selectedDomain ? [0.10, 0.14, 0.10] : [0.16, 0.24, 0.16]) }} transition={isFlashing ? { duration: 0.2, ease: TOKENS.HORIZON.easing } : isAdjacent ? { duration: 0.3, ease: TOKENS.HORIZON.easing } : { duration: TOKENS.HORIZON.t_pulse, repeat: Infinity, ease: "easeInOut" }} style={{ filter: 'drop-shadow(0 2px 12px rgba(0,0,0,0.4))', pointerEvents: 'none' }} />
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
                    <motion.circle className="orb-halo" cx={orbPos.x} cy={orbPos.y} r={orbPos.radius + 40} fill={bloom} style={{ filter: 'blur(20px)', pointerEvents: 'none' }} animate={shouldReduceMotion ? {} : { opacity: isPulsing ? [0.38, 0.55, 0.38] : isHovered || isSelected ? 0.55 : [0.38, 0.42, 0.38], scale: isPulsing ? [1, 1.08, 1] : isHovered || isSelected ? 1.05 : [0.985, 1.025, 0.985] }} transition={isPulsing ? { duration: TOKENS.HORIZON.t_orbBreathIn, ease: TOKENS.HORIZON.easingSine } : isHovered || isSelected ? { duration: TOKENS.HORIZON.t_hover, ease: TOKENS.HORIZON.easingApple } : { duration: TOKENS.HORIZON.t_breathe, repeat: Infinity, ease: "easeInOut", delay: idx * 1.2 }} />
                    <circle cx={orbPos.x} cy={orbPos.y} r={orbPos.radius + 2} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" style={{ filter: `url(#scatter-${domain.id})`, pointerEvents: 'none' }} />
                    <AnimatePresence>
                      {(isHovered || isSelected) && <motion.circle className="orb-halo" cx={orbPos.x} cy={orbPos.y} r={orbPos.radius + 11} fill={bloom} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 0.6, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ opacity: { duration: TOKENS.HORIZON.t_haloDecay, ease: TOKENS.HORIZON.easingSine }, scale: { duration: TOKENS.HORIZON.t_hover, ease: TOKENS.HORIZON.easingApple } }} style={{ filter: 'blur(16px)', pointerEvents: 'none' }} />}
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

                    {/* Tight hitbox orb nucleus (v1.9.7) */}
                    <motion.circle
                      cx={orbPos.x}
                      cy={orbPos.y}
                      r={orbPos.radius + TOKENS.HORIZON.hoverEnterRadius}
                      fill={`url(#nucleus-${domain.id})`}
                      className="orb-nucleus cursor-pointer"
                      data-domain-id={domain.id}
                      data-focused={isSelected ? "true" : "false"}
                      style={{
                        filter: `url(#bloom-${domain.id})`,
                        transformOrigin: `${orbPos.x}px ${orbPos.y}px`,
                        pointerEvents: 'auto',
                        color
                      }}
                      animate={shouldReduceMotion ? {} : {
                        scale: isPulsing ? [1, 1.05, 1] : isSelected ? [1, 1.025, 1] : isHovered ? 1.05 : [0.985, 1.025, 0.985],
                        opacity: isPulsing ? [0.985, 1, 0.985] : isHovered || isSelected ? 1 : [0.985, 1, 0.985]
                      }}
                      transition={isPulsing ? { duration: TOKENS.HORIZON.t_orbBreathIn, ease: TOKENS.HORIZON.easingSine } : isSelected ? { duration: TOKENS.HORIZON.t_orbLifePulse, repeat: Infinity, ease: "easeInOut" } : isHovered ? { duration: TOKENS.HORIZON.t_hover, ease: TOKENS.HORIZON.easingApple } : { duration: TOKENS.HORIZON.t_breathe, repeat: Infinity, ease: "easeInOut", delay: idx * 1.2 }}
                      onMouseEnter={() => handleDomainHoverEnter(domain)}
                      onMouseLeave={handleDomainHoverLeave}
                      onClick={() => handleOpenDrawer(domain)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleOpenDrawer(domain); }}
                      tabIndex={0}
                      role="button"
                      aria-label={`Open ${domain.id} drawer: ${domain.posture}, ${domain.confidence_pct}% confidence`}
                    />
                    <circle cx={orbPos.x} cy={orbPos.y} r={orbPos.radius} fill="none" stroke={color} strokeWidth="1" opacity="0.25" style={{ pointerEvents: 'none' }} />
                  </g>
                );
              })}
            </g>
          </svg>

          {/* Hover Card - FINAL OS HORIZON POLISH v2.2 */}
          <AnimatePresence>
            {hoveredDomain && !selectedDomain && (() => {
              const domain = domains.find(d => d.id === hoveredDomain);
              if (!domain) return null;

              const orbPos = getOrbPosition(hoveredDomain, domain.strength, swayTime, parallaxX.get(), parallaxY.get());
              const isLeft = orbPos.x < cx;
              const tooltipX = isLeft ? orbPos.x + orbPos.radius + 22 : orbPos.x - orbPos.radius - 22;
              const tooltipY = orbPos.y;

              const opacityAdjust = getTextOpacityAdjustment(domain.id);
              const insightText = getInsightLine(hoveredDomain);
              const summaryText = getConcisenSummary(domain);

              return (
                <motion.div
                  key={`tooltip-${hoveredDomain}`}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{
                    opacity: 1,
                    scale: 1.01
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.96,
                    transition: { duration: 0.22, ease: [0.4, 0, 0.2, 1] }
                  }}
                  whileHover={{
                    scale: 1.01
                  }}
                  style={{
                    position: 'absolute',
                    left: `${tooltipX}px`,
                    top: `${tooltipY}px`,
                    transform: `translate(${isLeft ? '0' : '-100%'}, -50%)`,
                    width: '270px',
                    padding: '16px 18px',
                    borderRadius: '18px',
                    backdropFilter: 'blur(22px) saturate(165%) brightness(1.05)',
                    WebkitBackdropFilter: 'blur(22px) saturate(165%) brightness(1.05)',
                    background: 'rgba(24, 28, 33, 0.45)',
                    border: `1px solid ${TOKENS.HORIZON.glassBorder}`,
                    boxShadow: TOKENS.HORIZON.hoverCardShadow,
                    pointerEvents: 'auto',
                    zIndex: 101,
                    cursor: 'pointer'
                  }}
                  onClick={() => handleCardClick(domain)}
                  onMouseEnter={() => {
                    if (hoverExitTimerRef.current) {
                      clearTimeout(hoverExitTimerRef.current);
                      hoverExitTimerRef.current = null;
                    }
                  }}
                  onMouseLeave={() => {
                    if (hoverEnterTimerRef.current) {
                      clearTimeout(hoverEnterTimerRef.current);
                      hoverEnterTimerRef.current = null;
                    }
                    if (hoverExitTimerRef.current) {
                      clearTimeout(hoverExitTimerRef.current);
                    }
                    hoverExitTimerRef.current = setTimeout(() => {
                      setHoveredDomain(null);
                    }, TOKENS.HORIZON.hoverExitDelay);
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Open ${domain.id} drawer: ${domain.posture}, ${domain.confidence_pct}% confidence. ${insightText}`}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleCardClick(domain); } }}
                >
                  {/* Reflected halo - alive calmness pulse */}
                  {!shouldReduceMotion && (
                    <motion.div
                      className="absolute inset-0 rounded-[18px]"
                      style={{
                        background: `radial-gradient(circle at center, ${getDomainBloom(domain.id)}, transparent 70%)`,
                        mixBlendMode: 'screen',
                        pointerEvents: 'none',
                        zIndex: -1
                      }}
                      animate={{ opacity: [0.10, 0.14, 0.10] }}
                      transition={{ duration: 0.3, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  )}
                  
                  {/* Vignette mask for glare clamp */}
                  <div 
                    className="absolute inset-0 rounded-[18px]"
                    style={{
                      background: `radial-gradient(circle at ${isLeft ? '85%' : '15%'} 15%, rgba(0,0,0,0.22), rgba(0,0,0,0) 140px)`,
                      pointerEvents: 'none',
                      zIndex: 0
                    }}
                    aria-hidden="true"
                  />

                  {/* Top rim highlight */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: '14px',
                    right: '14px',
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                    borderRadius: '999px',
                    pointerEvents: 'none'
                  }} />

                  {/* Content wrapper */}
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    {/* Header: Icon + Title + Posture */}
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          background: `${getDomainColor(domain.id)}15`,
                          border: `1px solid ${getDomainColor(domain.id)}30`,
                          boxShadow: `0 0 14px ${getDomainBloom(domain.id)}`,
                          color: getDomainColor(domain.id)
                        }}
                      >
                        {React.cloneElement(getDomainIcon(domain.id), { className: "w-4 h-4", strokeWidth: 2.5 })}
                      </div>
                      <div className="flex-1 min-w-0">
                        <motion.h4
                          initial={{ opacity: 0, y: -3 }}
                          animate={{
                            opacity: 0.95 + opacityAdjust,
                            y: 0
                          }}
                          transition={{
                            delay: 0.05,
                            duration: 0.18
                          }}
                          style={{
                            color: TOKENS.colors.textPrimary,
                            fontSize: '18px',
                            fontWeight: 600,
                            letterSpacing: '-0.02em',
                            textShadow: '0 1px 2px rgba(0, 0, 0, 0.35)',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'
                          }}
                        >
                          {domain.id.charAt(0).toUpperCase() + domain.id.slice(1)} Markets
                        </motion.h4>
                        <motion.div
                          initial={{ opacity: 0, y: -3 }}
                          animate={{
                            opacity: 0.82 + opacityAdjust,
                            y: 0
                          }}
                          transition={{
                            delay: 0.08,
                            duration: 0.18
                          }}
                          className="flex items-center gap-1.5"
                        >
                          {React.cloneElement(getPostureIcon(domain.posture), { className: "w-3.5 h-3.5" })}
                          <span style={{
                            color: getDomainText(domain.id),
                            fontSize: '13px',
                            letterSpacing: '0.2px',
                            textShadow: '0 1px 2px rgba(0, 0, 0, 0.35)',
                            fontWeight: 500,
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
                          }}>
                            {domain.posture.charAt(0).toUpperCase() + domain.posture.slice(1)} Momentum
                          </span>
                        </motion.div>
                      </div>
                    </div>

                    {/* Subtle section divider */}
                    <div style={{
                      height: '1px',
                      background: `linear-gradient(90deg, transparent, ${TOKENS.HORIZON.drawerDivider}, transparent)`,
                      margin: '0 0 12px 0',
                      opacity: 0.5
                    }} />

                    {/* Confidence Section with Brightened Ring */}
                    <motion.div
                      initial={{ opacity: 0, y: 3 }}
                      animate={{
                        opacity: 1,
                        y: 0
                      }}
                      transition={{
                        delay: 0.12,
                        duration: 0.18
                      }}
                      className="flex items-center gap-3 mb-3"
                    >
                      <div className="relative w-8 h-8 flex-shrink-0">
                        <svg className="transform -rotate-90" width="32" height="32">
                          <circle cx="16" cy="16" r="14" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2.5" />
                          <circle
                            cx="16"
                            cy="16"
                            r="14"
                            fill="none"
                            stroke={getDomainColor(domain.id)}
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeDasharray="87.9"
                            strokeDashoffset={87.9 - (87.9 * domain.confidence_pct / 100)}
                            style={{
                              filter: `drop-shadow(0 0 5px ${getDomainBloom(domain.id)})`,
                              opacity: 1.0
                            }}
                          />
                        </svg>
                        <div
                          className="absolute inset-0 flex items-center justify-center font-bold"
                          style={{
                            color: TOKENS.colors.textPrimary,
                            fontSize: '10px',
                            textShadow: '0 1px 2px rgba(0, 0, 0, 0.35)'
                          }}
                        >
                          {domain.confidence_pct}
                          {domain.confidenceDelta !== undefined && domain.confidenceDelta !== 0 && (
                            <motion.span
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.18, duration: 0.15 }}
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
                          fontSize: '13px',
                          color: 'rgba(255, 255, 255, 0.88)',
                          letterSpacing: '0.15em',
                          fontWeight: 600,
                          textShadow: '0 1px 2px rgba(0, 0, 0, 0.35)',
                          marginBottom: '2px'
                        }}>
                          CONFIDENCE
                        </div>
                        <div style={{
                          fontSize: '14px',
                          color: TOKENS.colors.textSecondary,
                          textShadow: '0 1px 2px rgba(0, 0, 0, 0.35)',
                          fontWeight: 400
                        }}>
                          {domain.confidence_pct}% — {summaryText.substring(0, 65)}...
                        </div>
                      </div>
                    </motion.div>

                    {/* Faint horizontal gradient divider (5-10% white blur) */}
                    <div style={{
                      height: '2px',
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
                      filter: 'blur(1px)',
                      margin: '12px 0',
                      opacity: 0.6
                    }} />

                    {/* Signal Summary - Enhanced line-height for breathing room */}
                    <motion.p
                      initial={{ opacity: 0, y: 3 }}
                      animate={{
                        opacity: 0.90 + opacityAdjust,
                        y: 0
                      }}
                      transition={{
                        delay: 0.16,
                        duration: 0.18
                      }}
                      style={{
                        color: 'rgba(255, 255, 255, 0.90)',
                        fontSize: '16.5px',
                        lineHeight: '25px',
                        marginBottom: '8px',
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.35)',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                        fontWeight: 400
                      }}
                    >
                      {summaryText.length > 100 ? summaryText.substring(0, 100) + '...' : summaryText}
                    </motion.p>

                    {/* Insight Line - Enhanced line-height */}
                    <motion.div
                      className="insight-line"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        delay: 0.20,
                        duration: 0.2
                      }}
                      style={{
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                        fontSize: '14.5px',
                        lineHeight: '23px',
                        color: 'rgba(255, 255, 255, 0.78)',
                        letterSpacing: '0.15px',
                        marginTop: '6px',
                        marginBottom: '6px',
                        pointerEvents: 'none'
                      }}
                      aria-label={insightText}
                    >
                      <span style={{
                        fontWeight: 500,
                        opacity: 0.75,
                        marginRight: '4px',
                        letterSpacing: '0.3px'
                      }}>
                        {insightText.split(':')[0]}:
                      </span>
                      <span style={{
                        fontWeight: 400,
                        opacity: 0.85
                      }}>
                        {insightText.split(':')[1]}
                      </span>
                    </motion.div>

                    {/* Subtle section divider */}
                    <div style={{
                      height: '1px',
                      background: `linear-gradient(90deg, transparent, ${TOKENS.HORIZON.drawerDivider}, transparent)`,
                      margin: '12px 0 10px 0',
                      opacity: 0.5
                    }} />

                    {/* CTA Section - Smooth hover fade */}
                    <motion.div
                      className="cta-section"
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: 1
                      }}
                      transition={{
                        delay: 0.24,
                        duration: 0.15
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <motion.span
                        className="cta-text"
                        whileHover={{
                          x: 3,
                          letterSpacing: '0.4px',
                          transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] }
                        }}
                        style={{
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                          fontSize: '14px',
                          fontWeight: 500,
                          letterSpacing: '0.25px',
                          color: 'rgba(90, 160, 255, 0.95)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          transition: 'all 250ms ease-in-out',
                          cursor: 'pointer',
                          textShadow: '0 1px 2px rgba(0, 0, 0, 0.35)'
                        }}
                        aria-label="Expand signal, button"
                      >
                        <span>Expand signal</span>
                        <motion.div
                          whileHover={{
                            x: 2,
                            transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] }
                          }}
                        >
                          <ArrowRight className="w-3.5 h-3.5" style={{ color: 'rgba(90, 160, 255, 0.95)' }} />
                        </motion.div>
                      </motion.span>
                    </motion.div>
                  </div>

                  {/* Pointer triangles */}
                  <div
                    style={{
                      position: 'absolute',
                      [isLeft ? 'left' : 'right']: '-6px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 0,
                      height: 0,
                      borderTop: '8px solid transparent',
                      borderBottom: '8px solid transparent',
                      [isLeft ? 'borderRight' : 'borderLeft']: `8px solid ${TOKENS.HORIZON.glassBorder}`,
                      pointerEvents: 'none'
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      [isLeft ? 'left' : 'right']: '-5px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 0,
                      height: 0,
                      borderTop: '7px solid transparent',
                      borderBottom: '7px solid transparent',
                      [isLeft ? 'borderRight' : 'borderLeft']: '7px solid rgba(24, 28, 33, 0.45)',
                      pointerEvents: 'none'
                    }}
                  />
                </motion.div>
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

        <div ref={footerRef} onMouseEnter={() => setIsStatusBarHovered(true)} onMouseLeave={() => setIsStatusBarHovered(false)} style={{ position: 'absolute', left: '14%', right: '14%', bottom: '32px', height: `${footerH}px`, borderRadius: '20px', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '14px', backdropFilter: getBlur('chip'), WebkitBackdropFilter: getBlur('chip'), background: TOKENS.HORIZON.glassBg, border: `1px solid ${TOKENS.HORIZON.glassBorder}`, boxShadow: `${TOKENS.HORIZON.panelShadow}, inset 0 0 2px rgba(106,199,247,0.12)`, zIndex: 1, cursor: 'pointer', transition: 'filter 200ms cubic-bezier(0.4,0,0.2,1)', filter: isStatusBarHovered ? 'brightness(1.08)' : 'brightness(1)', pointerEvents: 'auto' }}>
          <div style={{ width: '160px', position: 'relative' }}>
            <div style={{ height: '2px', borderRadius: '999px', position: 'relative', overflow: 'hidden', background: 'linear-gradient(90deg, rgba(106,199,247,0.3), rgba(180,247,192,0.3), rgba(255,211,122,0.3))' }}>
              {!shouldReduceMotion && <motion.div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)', width: '100%' }} animate={{ x: ['-100%', '100%'] }} transition={{ duration: TOKENS.HORIZON.t_sweep, repeat: Infinity, ease: 'linear' }} />}
              <div style={{ position: 'absolute', bottom: '-8px', left: 0, right: 0, height: '8px', background: 'linear-gradient(90deg, rgba(106,199,247,0.15), rgba(180,247,192,0.15), rgba(255,255,255,0.15))', filter: 'blur(8px)', opacity: 0.15 }} />
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

      {/* OS HORIZON BACKDROP - INHALE/EXHALE BREATHING */}
      <AnimatePresence>
        {selectedDomain && (
          <motion.div
            className="fixed inset-0 z-40 drawer-overlay"
            style={{ 
              background: 'rgba(6,8,13,0.25)', // Reduced from 0.70 - maintain visible context
              backdropFilter: 'blur(0px) brightness(1)', // Start state
              WebkitBackdropFilter: 'blur(0px) brightness(1)',
              pointerEvents: 'none' 
            }}
            initial={{ 
              opacity: 0,
              backdropFilter: 'blur(0px) brightness(1)',
              WebkitBackdropFilter: 'blur(0px) brightness(1)'
            }}
            animate={{ 
              opacity: 1,
              backdropFilter: 'blur(12px) brightness(0.97)', // +8% blur, -3% brightness
              WebkitBackdropFilter: 'blur(12px) brightness(0.97)',
              transition: {
                opacity: { duration: 0.1, ease: 'easeOut' }, // Pre-stage 100ms
                backdropFilter: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
                WebkitBackdropFilter: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
              }
            }}
            exit={{ 
              opacity: 0,
              backdropFilter: 'blur(0px) brightness(1)', // Restore
              WebkitBackdropFilter: 'blur(0px) brightness(1)',
              transition: {
                opacity: { duration: 0.25, ease: 'easeInOut' }, // Fade-back 250ms
                backdropFilter: { duration: 0.15, delay: 0.25, ease: 'easeOut' }, // Background restore 150ms after fade
                WebkitBackdropFilter: { duration: 0.15, delay: 0.25, ease: 'easeOut' }
              }
            }}
            onClick={handleCloseDrawer}
          />
        )}
      </AnimatePresence>

      {/* OS HORIZON DRAWER - INHALE/EXHALE MOTION */}
      <AnimatePresence>
        {selectedDomain && !isSwitchingNode && drawerOrigin && (
          <motion.div
            ref={drawerRef}
            className="fixed z-50 flex flex-col drawer-with-header-safe"
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedDomain.id} domain details`}
            style={{
              left: drawerCenterPosition.left,
              top: drawerCenterPosition.top,
              width: drawerCenterPosition.width,
              height: drawerCenterPosition.height,
              backdropFilter: TOKENS.HORIZON.drawerBlur,
              WebkitBackdropFilter: TOKENS.HORIZON.drawerBlur,
              background: TOKENS.HORIZON.drawerGlass,
              border: `1px solid ${TOKENS.HORIZON.glassBorder}`,
              boxShadow: `0 0 60px rgba(0, 0, 0, 0.15), ${TOKENS.HORIZON.panelShadow}, 0 0 12px ${TOKENS.HORIZON.drawerEdgeBloom}, inset 0 0 0 1px rgba(255,255,255,0.10)`,
              borderRadius: '24px',
              overflow: 'hidden',
              filter: `brightness(${drawerLuminance})`
            }}
            initial={{
              left: drawerCenterPosition.left,
              top: drawerCenterPosition.top,
              width: drawerCenterPosition.width,
              height: drawerCenterPosition.height,
              scale: 0.985, // Start slightly smaller for depth
              opacity: 0,
              y: 0
            }}
            animate={{
              scale: [0.985, 1.015, 1.005], // Lift 1.5%, settle with -0.5% bounce
              opacity: [0, 1, 1],
              y: [0, 0, 0],
              transition: {
                scale: {
                  duration: 0.5,
                  times: [0, 0.5, 1], // Pre-stage (0-100ms implicit), Lift (100-350ms), Settle (350-500ms)
                  ease: [0.25, 0.1, 0.25, 1] // Cubic ease-in-out for smooth lift
                },
                opacity: {
                  duration: 0.25,
                  delay: 0.1, // After pre-stage
                  ease: 'easeInOut'
                }
              }
            }}
            exit={{
              scale: 0.99, // Scale down 1%
              opacity: 0,
              transition: {
                scale: { duration: 0.25, ease: 'easeInOut' }, // Fade-back 250ms
                opacity: { duration: 0.25, ease: 'easeInOut' }
              }
            }}
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

            <motion.div 
              style={{ 
                position: 'absolute', 
                left: '50%', 
                top: '50%', 
                transform: 'translate3d(-50%, -50%, 0)', 
                width: '120%', 
                height: '120%', 
                background: `radial-gradient(circle at center, ${getDomainBloom(selectedDomain.id)} 0%, transparent 60%)`, 
                opacity: 0.08, 
                filter: 'blur(32px)', 
                pointerEvents: 'none', 
                mixBlendMode: 'screen', 
                zIndex: 0 
              }} 
              initial={{ opacity: 0 }} 
              animate={{ 
                opacity: 0.08, 
                x: glassParallaxX, 
                y: glassParallaxY,
                transition: {
                  opacity: { duration: 0.5, ease: 'easeOut' }
                }
              }} 
              exit={{ 
                opacity: 0,
                transition: { duration: 0.25 }
              }} 
            />
            
            <motion.div 
              style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                right: 0, 
                height: '80px', 
                background: `linear-gradient(to bottom, ${TOKENS.HORIZON.lightTemp} 0%, ${TOKENS.HORIZON.lightTempBottom} 100%)`, 
                pointerEvents: 'none', 
                borderRadius: '24px 24px 0 0', 
                zIndex: 1 
              }} 
              initial={{ opacity: 0 }} 
              animate={{ 
                opacity: 1,
                transition: { duration: 0.35, delay: 0.15, ease: 'easeOut' }
              }} 
              exit={{ 
                opacity: 0,
                transition: { duration: 0.2 }
              }} 
            />
            
            <div className="panel-glass" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100%', background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0) 100%)', pointerEvents: 'none', borderRadius: '24px', zIndex: 1 }} />

            {/* OS HORIZON REFINED HEADER v2.2 */}
            <motion.div 
              className="flex-shrink-0 p-5 border-b" 
              style={{ 
                background: TOKENS.HORIZON.drawerTint, 
                borderColor: TOKENS.HORIZON.drawerDivider, 
                backdropFilter: getBlur('chip'), 
                position: 'relative', 
                zIndex: 10 
              }} 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { duration: 0.3, delay: 0.2, ease: 'easeOut' }
              }} 
              exit={{ 
                opacity: 0, 
                y: -5,
                transition: { duration: 0.15 }
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  {/* Icon with breathing glow */}
                  <motion.div 
                    className="w-12 h-12 rounded-full flex items-center justify-center" 
                    style={{ 
                      background: `${getDomainColor(selectedDomain.id)}15`, 
                      border: `1px solid ${getDomainColor(selectedDomain.id)}30`, 
                      boxShadow: `0 0 20px ${getDomainBloom(selectedDomain.id)}`, 
                      color: getDomainColor(selectedDomain.id) 
                    }}
                    animate={shouldReduceMotion ? {} : {
                      filter: [
                        'brightness(1)',
                        'brightness(1.08)',
                        'brightness(1)'
                      ]
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                  >
                    {getDomainIcon(selectedDomain.id)}
                  </motion.div>
                  <div>
                    <h3 style={{ color: TOKENS.colors.textPrimary, fontSize: '17px', fontWeight: 600, lineHeight: '22px', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif', marginBottom: '6px' }}>{selectedDomain.id.charAt(0).toUpperCase() + selectedDomain.id.slice(1)} Markets</h3>
                    <div className="flex items-center gap-2">
                      {getPostureIcon(selectedDomain.posture)}
                      <span style={{ color: getDomainText(selectedDomain.id), fontSize: '14px', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif', fontWeight: 500 }}>{selectedDomain.posture.charAt(0).toUpperCase() + selectedDomain.posture.slice(1)} Momentum</span>
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
                {/* Animated confidence ring */}
                <div className="relative w-9 h-9">
                  <svg className="transform -rotate-90" width="36" height="36">
                    <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
                    <motion.circle 
                      cx="18" 
                      cy="18" 
                      r="16" 
                      fill="none" 
                      stroke={getDomainColor(selectedDomain.id)} 
                      strokeWidth="3" 
                      strokeLinecap="round" 
                      strokeDasharray="100" 
                      initial={{ strokeDashoffset: 100, opacity: 0.9 }} 
                      animate={{ strokeDashoffset: 100 - (100 * selectedDomain.confidence_pct / 100), opacity: 0.98 }} 
                      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                      style={{
                        filter: `drop-shadow(0 0 6px ${getDomainBloom(selectedDomain.id)})`
                      }}
                    />
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
                  <div className="text-xs font-medium mb-1" style={{ color: TOKENS.colors.textLabel, letterSpacing: '0.2em', fontSize: '15px', lineHeight: '22.5px', fontWeight: 500 }}>Confidence</div>
                  <div className="text-sm" style={{ color: TOKENS.colors.textSecondary, fontWeight: 400, fontSize: '14px' }}>{selectedDomain.confidence_pct} — {selectedDomain.summary.substring(0, 50)}...</div>
                </div>
              </div>
            </motion.div>

            {/* OS HORIZON REFINED BODY v2.2 */}
            <motion.div 
              className="flex-1 overflow-y-auto p-6" 
              style={{ position: 'relative', zIndex: 2 }}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                transition: { duration: 0.3, delay: 0.25, ease: 'easeOut' }
              }}
              exit={{ 
                opacity: 0,
                transition: { duration: 0.15 }
              }}
            >
              {/* What It Means */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.2 }} style={{ marginBottom: '16px' }}>
                <h4 style={{ color: 'rgba(255,255,255,0.9)', fontSize: '15px', fontWeight: 500, marginBottom: '8px', lineHeight: '22.5px' }}>What It Means</h4>
                <p style={{ color: TOKENS.colors.textSecondary, fontSize: '14.5px', lineHeight: '23.9px', fontWeight: 400 }}>
                  {selectedDomain.id === 'fx' 
                    ? 'Global rates converging — FX steady as risk trades ease.'
                    : selectedDomain.summary}
                </p>
                {selectedDomain.addendum && (
                  <p style={{ color: TOKENS.colors.textSecondary, fontSize: '13.5px', marginTop: '8px', opacity: 0.9, lineHeight: '22.3px', fontWeight: 400 }}>
                    {selectedDomain.id === 'fx'
                      ? 'Next 48 h: Currency momentum stable; carry risk muted unless yields shift.'
                      : selectedDomain.addendum}
                  </p>
                )}
              </motion.div>

              <div style={{
                height: '2px',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
                filter: 'blur(1px)',
                margin: '16px 0',
                opacity: 0.6
              }} />

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.33, duration: 0.2 }} style={{ marginBottom: '16px' }}>
                <h4 style={{ color: 'rgba(255,255,255,0.9)', fontSize: '15px', fontWeight: 500, marginBottom: '8px', lineHeight: '22.5px' }}>Downstream Effects</h4>
                <div className="space-y-2">
                  {selectedDomain.ripple.slice(0, 3).map((effect, i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ scale: 1.01 }}
                      style={{ 
                        backdropFilter: getBlur('chip'), 
                        background: i % 2 === 0 ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.04)', 
                        border: `1px solid ${TOKENS.HORIZON.glassBorder}`, 
                        borderRadius: '14px', 
                        padding: '12px 14px', 
                        display: 'flex', 
                        gap: '10px',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                      onHoverStart={() => {
                        const ripple = document.createElement('div');
                        ripple.style.cssText = `
                          position: absolute;
                          inset: 0;
                          background: radial-gradient(circle at center, rgba(255,255,255,0.1), transparent 70%);
                          opacity: 0;
                          animation: ripple 0.3s ease-out;
                          pointer-events: none;
                        `;
                        const target = document.currentTarget;
                        if (target) {
                          target.appendChild(ripple);
                          setTimeout(() => ripple.remove(), 300);
                        }
                      }}
                    >
                      <div style={{ width: '4px', height: '4px', borderRadius: '999px', marginTop: '8px', background: getDomainColor(selectedDomain.id), boxShadow: `0 0 6px ${getDomainBloom(selectedDomain.id)}` }} />
                      <span style={{ color: TOKENS.colors.textChip, fontSize: '14px', lineHeight: '22.4px', fontWeight: 500 }}>{effect}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <div style={{
                height: '2px',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
                filter: 'blur(1px)',
                margin: '16px 0',
                opacity: 0.6
              }} />

              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.36, duration: 0.2 }}
                className="mt-3 p-4 rounded-lg relative overflow-hidden"
                style={{ 
                  background: 'rgba(66,135,245,0.072)', 
                  border: '1px solid rgba(66,135,245,0.25)',
                  borderLeft: '2px solid rgba(66,135,245,0.6)',
                  boxShadow: 'inset 1px 0 0 rgba(255,255,255,0.1)'
                }}
              >
                {!shouldReduceMotion && (
                  <motion.div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)',
                      pointerEvents: 'none'
                    }}
                    animate={{
                      x: ['-100%', '200%']
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: 'linear'
                    }}
                  />
                )}
                <p className="text-xs font-semibold mb-1" style={{ color: 'rgba(66,135,245,0.9)', letterSpacing: '0.15em', fontSize: '15px', lineHeight: '22.5px', fontWeight: 500 }}>Actionable signal</p>
                <p style={{ color: 'rgba(180,200,230,0.95)', fontSize: '14px', lineHeight: '22.4px', fontWeight: 400 }}>
                  {selectedDomain.id === 'fx'
                    ? 'FX risk limited short term — watch yield-curve divergence.'
                    : getActionableSignal(selectedDomain)}
                </p>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.46, duration: 0.1 }}
                  style={{ color: 'rgba(255,255,255,0.60)', fontSize: '13.5px', lineHeight: '22.3px', fontWeight: 400, marginTop: '10px', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
                >
                  {selectedDomain.id === 'fx'
                    ? 'So what: Carry positions re-enter range; favor domestic exposure until vol returns.'
                    : getSoWhatInterpretation(selectedDomain)}
                </motion.p>
              </motion.div>

              <div style={{
                height: '2px',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
                filter: 'blur(1px)',
                margin: '16px 0 12px 0',
                opacity: 0.6
              }} />

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.39, duration: 0.2 }} className="pt-3">
                <motion.button 
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg font-medium text-sm transition-colors hover:brightness-110" 
                  style={{ background: 'rgba(66,135,245,0.15)', color: '#4287f5', border: '1px solid rgba(66,135,245,0.3)', fontSize: '15.5px', paddingLeft: '24px', paddingRight: '24px' }} 
                  aria-label="View detailed market implications"
                  whileHover={{
                    y: -2,
                    transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] }
                  }}
                >
                  <span>View market implications</span>
                  <motion.div
                    whileHover={{
                      x: 2,
                      transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] }
                    }}
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </motion.div>
                </motion.button>
                <div className="flex items-center justify-between mt-2 text-xs" style={{ color: TOKENS.colors.textTertiary }}>
                  <span>Updated {new Date(selectedDomain.last_updated_iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <span className="opacity-60">1-4 • ← → • ESC</span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes ripple {
          from { opacity: 1; transform: scale(0); }
          to { opacity: 0; transform: scale(2); }
        }
        
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation: none !important; transition: none !important; }
        }

        .orb-nucleus {
          min-width: 44px;
          min-height: 44px;
        }

        .orb-nucleus::after {
          content: "";
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          pointer-events: auto;
        }

        .orb-nucleus:focus-visible {
          outline: 2px solid rgba(122,215,240,0.9);
          outline-offset: 3px;
          z-index: 102;
        }

        .drawer-with-header-safe:focus-within {
          outline: 2px solid rgba(66,135,245,0.6);
          outline-offset: -2px;
          z-index: 102;
        }

        .orb-halo, .link-path, .glow-overlay, .panel-glass, .drawer-overlay {
          pointer-events: none !important;
        }

        @supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
          .drawer-header-blur-extension {
            background: rgba(10,15,22,0.85) !important;
          }
        }

        * { font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", sans-serif; }
      `}</style>
    </motion.section>
  );
};

export default MacroConstellation;
