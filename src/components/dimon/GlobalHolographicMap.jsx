
import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Globe, X, TrendingUp, TrendingDown, Minus, ArrowRight, Info, ChevronLeft, ChevronRight, BarChart3, DollarSign, Activity, Sparkles } from 'lucide-react';
import LyraLogo from '../core/LyraLogo';
import { createPortal } from 'react-dom';
import EquilibriumPulse from './EquilibriumPulse';

// ============================================================================
// EQUILIBRIUM — OS HORIZON V3.2 "UNIFIED MOTION + INFORMATION HIERARCHY"
// Motion curves + micro-interactions + GPU-optimized transitions + simplified visual language
// ============================================================================

const MOTION_TOKENS = {
  CURVES: {
    horizonIn: [0.22, 0.61, 0.36, 1],      // gentle ease-out
    horizonOut: [0.4, 0.0, 0.2, 1],         // iOS-like ease-in
    horizonSpring: [0.16, 1, 0.3, 1],       // soft spring
    horizonOpacity: [0.33, 0.0, 0.67, 1],   // smooth alpha
    drawerInhale: [0.25, 0.1, 0.25, 1],     // drawer entrance
  },
  DURATIONS: {
    ultraFast: 0.06,   // 60ms
    fast: 0.12,        // 120ms
    base: 0.18,        // 180ms
    slow: 0.24,        // 240ms
    microPulse: 0.008, // 8ms - sub-frame tactile feedback
    drawerInhale: 0.40 // 400ms - drawer entrance
  },
  ELEVATION: {
    hover: { blur: 12, spread: 0, opacity: 0.10 },
    chip: { blur: 10, spread: 0, opacity: 0.08 }
  },
  INTENT_DELAY: {
    hoverReveal: 0.12  // 120ms prevents flicker on pass-throughs
  }
};

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
    hoverEnterRadius: 6, hoverExitRadius: 10, hoverEnterDelay: 120, hoverExitDelay: 90,
    corridorWidth: 16, corridorTTL: 250, velocityThreshold: 600,
    easing: [0.4, 0, 0.2, 1], easingApple: [0.32, 0.72, 0, 1], easingCubic: [0.65, 0, 0.35, 1],
    easingElastic: [0.22, 1, 0.36, 1], easingSine: [0.61, 1, 0.88, 1], easingOutQuad: [0.25, 0.46, 0.45, 0.94],
    overshoot: [0.34, 1.56, 0.64, 1],
    t_drawerOpen: 0.25, t_drawerClose: 0.20,
    t_hover: 0.12, t_haloDecay: 0.18, t_labelLag: 0.08,
    t_tooltipOpen: 0.06, t_tooltipClose: 0.18, t_tooltipTextStagger: 0.08, t_tooltipTextDuration: 0.14,
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
    fx: { core: '#6AC7F7', halo: 'rgba(106,199,247,0.38)', text: '#B8E7FF', bloom: 'rgba(106,199,247,0.18)', glow: 'rgba(106,199,247,0.08)', zDepth: -14 },
    rates: { core: '#C0A6FF', halo: 'rgba(192,166,255,0.38)', text: '#DECFFF', bloom: 'rgba(192,166,255,0.18)', glow: 'rgba(192,166,255,0.08)', zDepth: -6 },
    growth: { core: '#B4F7C0', halo: 'rgba(180,247,192,0.38)', text: '#D4FFDE', bloom: 'rgba(180,247,192,0.18)', glow: 'rgba(180,247,192,0.08)', zDepth: 8 },
    geopolitics: { core: '#FFD37A', halo: 'rgba(255,211,122,0.38)', text: '#FFE8B8', bloom: 'rgba(255,211,122,0.18)', glow: 'rgba(255,211,122,0.08)', zDepth: 12 }
  },
  colors: {
    textPrimary: "rgba(255, 255, 255, 0.95)",
    textSecondary: "rgba(255, 255, 255, 0.80)",
    textBody: "rgba(255, 255, 255, 0.92)",
    textLabel: "rgba(255, 255, 255, 0.85)",
    textChip: "rgba(232,235,239,0.85)",
    textTertiary: "rgba(255,255,255,0.65)",
    textMuted: "rgba(255,255,255,0.58)",
    textCTA: "rgba(145, 181, 255, 0.95)",
    deltaUp: '#6EF3A5',
    deltaDown: '#F38B82'
  }
};

const ANGLES = { rates: 22.5, fx: 160.0, growth: 297.5, geopolitics: 75.0 };
const RADII = { rates: 0.35, fx: 0.39, growth: 0.37, geopolitics: 0.32 };

const MOCK_DOMAINS = [
  { 
    id: "rates",
    title: "Rates Markets",
    posture: "hawkish",
    trend: "Hawkish Momentum",
    confidence_pct: 78,
    strength: 0.82,
    confidence_label: "High certainty",
    summary: "Policy tone remains hawkish as sticky services inflation persists; terminal-rate expectations drift higher.",
    insight: "Yields steady — credit markets adjusting to new baseline.",
    downstream_effects: [
      { title: "Credit spreads widen", tags: ["Credit", "HY", "IG"], link: "/credit" },
      { title: "Tech multiples compress", tags: ["Tech", "Large-cap growth"], link: "/equities/tech" },
      { title: "EM funding costs rise", tags: ["EM debt", "FX funding"], link: "/em" }
    ],
    actionable: {
      horizon: "1–3 months",
      conviction: "High",
      directives: [
        "Tilt: shorten duration; keep rate-sensitive equity underweight.",
        "Hedge: add payer swaptions; receive USD carry vs EM FX."
      ]
    },
    footer: {
      primary_cta: { label: "View market implications", route: "/implications/rates" },
      secondary_link: { label: "Open timeline", route: "/timeline/rates" },
      timestamp: new Date().toISOString()
    },
    last_updated_iso: new Date().toISOString(),
    sparkline: [0.72, 0.74, 0.76, 0.75, 0.78, 0.80, 0.79, 0.81, 0.82],
    confidenceDelta: 2
  },
  { 
    id: "fx",
    title: "FX Markets",
    posture: "stable",
    trend: "Stable Momentum",
    confidence_pct: 65,
    strength: 0.58,
    confidence_label: "Moderate confidence",
    summary: "Carry trades unwind as global rates converge; capital flows stabilize with cooling risk appetite.",
    insight: "Capital flows stabilizing; global risk appetite cooling.",
    downstream_effects: [
      { title: "EM currencies stabilize", tags: ["FX", "EM", "Volatility"], link: "/fx/em" },
      { title: "Energy imports neutral", tags: ["Commodities", "Trade"], link: "/commodities" },
      { title: "Bond yields compressed", tags: ["Fixed Income", "Rates"], link: "/bonds" }
    ],
    actionable: {
      horizon: "2–4 weeks",
      conviction: "Medium",
      directives: [
        "Monitor: yield-curve divergence for carry trade shifts.",
        "Position: favor domestic exposure until volatility returns."
      ]
    },
    footer: {
      primary_cta: { label: "View FX analytics", route: "/fx/dashboard" },
      secondary_link: { label: "Currency tracker", route: "/fx/tracker" },
      timestamp: new Date().toISOString()
    },
    addendum: "Next 48h: FX likely stable; carry re-risk limited unless yields diverge.",
    last_updated_iso: new Date().toISOString(),
    sparkline: [0.60, 0.59, 0.58, 0.57, 0.58, 0.59, 0.58, 0.57, 0.58],
    confidenceDelta: -3
  },
  { 
    id: "growth",
    title: "Growth Markets",
    posture: "softening",
    trend: "Softening Momentum",
    confidence_pct: 71,
    strength: 0.68,
    confidence_label: "Moderate confidence",
    summary: "China deceleration dampens global demand; US resilience persists but moderates across sectors.",
    insight: "Rotation toward defensive assets underway as markets rebalance.",
    downstream_effects: [
      { title: "Commodity prices soften", tags: ["Commodities", "Energy", "Materials"], link: "/commodities" },
      { title: "Defensive rotation starts", tags: ["Equities", "Defensive", "Utilities"], link: "/equities/defensive" },
      { title: "Services remain steady", tags: ["Services", "Labor", "Domestic"], link: "/sectors/services" }
    ],
    actionable: {
      horizon: "1–2 weeks",
      conviction: "High",
      directives: [
        "Rotate: favor defensive and pricing-power names.",
        "Monitor: commodities for further softening signals."
      ]
    },
    footer: {
      primary_cta: { label: "Growth outlook", route: "/growth/outlook" },
      secondary_link: { label: "Sector rotation", route: "/sectors" },
      timestamp: new Date().toISOString()
    },
    last_updated_iso: new Date().toISOString(),
    sparkline: [0.75, 0.74, 0.72, 0.70, 0.69, 0.68, 0.67, 0.68, 0.68],
    confidenceDelta: -1
  },
  { 
    id: "geopolitics",
    title: "Geopolitics Markets",
    posture: "tightening",
    trend: "Tightening Momentum",
    confidence_pct: 58,
    strength: 0.72,
    confidence_label: "Cautious read",
    summary: "Trade fragmentation reshapes supply chains; energy security concerns elevate regional tensions.",
    insight: "Policy tensions rising — volatility expanding in select regions.",
    downstream_effects: [
      { title: "Energy premium elevated", tags: ["Energy", "Oil", "Gas"], link: "/energy" },
      { title: "Onshoring accelerates", tags: ["Industrials", "Supply Chain", "Domestic"], link: "/industrials" },
      { title: "Regional blocs solidify", tags: ["Geopolitics", "Trade", "Policy"], link: "/geopolitics" }
    ],
    actionable: {
      horizon: "3–6 months",
      conviction: "Medium",
      directives: [
        "Hedge: prioritize domestic resilience and energy exposure.",
        "Diversify: reduce single-region concentration risk."
      ]
    },
    footer: {
      primary_cta: { label: "Risk analysis", route: "/geopolitics/risk" },
      secondary_link: { label: "Supply chain tracker", route: "/supply-chain" },
      timestamp: new Date().toISOString()
    },
    last_updated_iso: new Date().toISOString(),
    sparkline: [0.65, 0.66, 0.68, 0.70, 0.71, 0.72, 0.71, 0.72, 0.72],
    confidenceDelta: 4
  }
];

// ============================================================================
// PORTAL OVERLAY ROOT MANAGER
// ============================================================================
const usePortalRoot = () => {
  const [portalRoot, setPortalRoot] = useState(null);

  useEffect(() => {
    let root = document.getElementById('equilibrium-overlay-root');
    
    if (!root) {
      root = document.createElement('div');
      root.id = 'equilibrium-overlay-root';
      root.setAttribute('aria-hidden', 'true');
      root.style.cssText = `
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 9999;
        overflow: hidden;
      `;
      document.body.appendChild(root);
    }
    
    setPortalRoot(root);

    return () => {
      setTimeout(() => {
        if (root && root.childNodes.length === 0 && document.body.contains(root)) {
          root.remove();
        }
      }, 100);
    };
  }, []);

  return portalRoot;
};

// ============================================================================
// SMART PLACEMENT CALCULATOR (COLLISION-AWARE)
// ============================================================================
const calculateSmartPlacement = (nodeRect, cardWidth = 270, cardHeight = 340) => {
  const SAFE_MARGIN = 32;
  const GAP_FROM_NODE = 14;
  
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight
  };

  const footerHeight = 84;
  const footerTop = viewport.height - footerHeight;

  let placement = 'bottom';
  let x = nodeRect.left;
  let y = nodeRect.bottom + GAP_FROM_NODE;
  let maxHeight = null;

  if (y + cardHeight > footerTop - SAFE_MARGIN) {
    placement = 'top';
    y = nodeRect.top - GAP_FROM_NODE - cardHeight;
    
    if (y < SAFE_MARGIN) {
      y = SAFE_MARGIN;
      maxHeight = nodeRect.top - GAP_FROM_NODE - SAFE_MARGIN;
      placement = 'top-capped';
    }
  }

  if (x + cardWidth > viewport.width - SAFE_MARGIN) {
    x = viewport.width - SAFE_MARGIN - cardWidth;
  }

  if (x < SAFE_MARGIN) {
    x = SAFE_MARGIN;
  }

  const arrowX = nodeRect.left + (nodeRect.width / 2) - x;
  const arrowY = placement.includes('top') 
    ? cardHeight 
    : -8;

  return {
    x,
    y,
    maxHeight,
    placement,
    arrow: {
      x: arrowX,
      y: arrowY,
      direction: placement.includes('top') ? 'down' : 'up'
    },
    transformOrigin: placement.includes('top') ? 'bottom left' : 'top left'
  };
};

// ============================================================================
// HOVER CARD PORTAL — OS HORIZON V3.1 MOTION CHOREOGRAPHY
// ============================================================================
const HoverCardPortal = ({ 
  domain, 
  nodeRect, 
  onClose,
  onCardEnter,
  onCardLeave,
  getDomainColor, 
  getDomainBloom, 
  getDomainIcon, 
  getDomainText,
  getPostureIcon,
  getConfidenceStrength,
  shouldReduceMotion
}) => {
  const portalRoot = usePortalRoot();
  const cardRef = useRef(null);
  const [position, setPosition] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [ringAnimationComplete, setRingAnimationComplete] = useState(false);
  const [isInsightHovered, setIsInsightHovered] = useState(false);
  const [isCardHovered, setIsCardHovered] = useState(false);
  const rafRef = useRef(null);

  useEffect(() => {
    if (nodeRect) {
      const pos = calculateSmartPlacement(nodeRect);
      setPosition(pos);
      const timer = setTimeout(() => setIsVisible(true), MOTION_TOKENS.INTENT_DELAY.hoverReveal * 1000);
      return () => clearTimeout(timer);
    }
  }, [nodeRect]);

  useEffect(() => {
    setRingAnimationComplete(false);
  }, [domain?.id]);

  useEffect(() => {
    if (!nodeRect) return;

    const updatePosition = () => {
      const pos = calculateSmartPlacement(nodeRect);
      setPosition(pos);
    };

    const handleUpdate = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        updatePosition();
        rafRef.current = null;
      });
    };

    window.addEventListener('scroll', handleUpdate, { passive: true });
    window.addEventListener('resize', handleUpdate);

    return () => {
      window.removeEventListener('scroll', handleUpdate);
      window.removeEventListener('resize', handleUpdate);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [nodeRect]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!portalRoot || !position || !domain) return null;

  const ringRadius = 14;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const targetOffset = ringCircumference - (ringCircumference * domain.confidence_pct / 100);

  const adjustedDurations = shouldReduceMotion ? {
    ultraFast: MOTION_TOKENS.DURATIONS.ultraFast / 2,
    fast: MOTION_TOKENS.DURATIONS.fast / 2,
    base: MOTION_TOKENS.DURATIONS.base / 2
  } : MOTION_TOKENS.DURATIONS;

  const cardContent = (
    <motion.div
      ref={cardRef}
      className="eq-hover-card"
      initial={{ 
        opacity: 0, 
        y: 4, 
        scale: 0.995,
        filter: 'blur(2px)'
      }}
      animate={{
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : 4,
        scale: isVisible ? 1 : 0.995,
        filter: isVisible ? 'blur(0px)' : 'blur(2px)',
        boxShadow: isCardHovered 
          ? `0 8px 24px rgba(0, 0, 0, ${MOTION_TOKENS.ELEVATION.hover.opacity})`
          : `0 0 ${MOTION_TOKENS.ELEVATION.hover.blur}px rgba(0, 0, 0, 0.05)`
      }}
      exit={{
        opacity: 0,
        y: 2,
        scale: 0.997,
        transition: { 
          duration: adjustedDurations.base, 
          ease: MOTION_TOKENS.CURVES.horizonOut 
        }
      }}
      transition={{
        duration: adjustedDurations.ultraFast,
        ease: MOTION_TOKENS.CURVES.horizonIn,
        boxShadow: {
          duration: adjustedDurations.fast,
          ease: MOTION_TOKENS.CURVES.horizonIn
        }
      }}
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '270px',
        maxHeight: position.maxHeight ? `${position.maxHeight}px` : 'none',
        overflowY: position.maxHeight ? 'auto' : 'visible',
        padding: '18px 20px',
        borderRadius: '18px',
        backdropFilter: 'blur(22px) saturate(165%) brightness(1.05)',
        WebkitBackdropFilter: 'blur(22px) saturate(165%) brightness(1.05)',
        background: 'rgba(24, 28, 33, 0.45)',
        border: `1px solid ${TOKENS.HORIZON.glassBorder}`,
        pointerEvents: 'auto',
        cursor: 'pointer',
        transformOrigin: position.transformOrigin,
        willChange: 'transform, opacity, filter, box-shadow'
      }}
      onClick={onClose}
      onMouseEnter={() => {
        setIsCardHovered(true);
        onCardEnter();
      }}
      onMouseLeave={() => {
        setIsCardHovered(false);
        onCardLeave();
      }}
      role="button"
      tabIndex={0}
      aria-label={`${domain.id} signal: ${domain.summary}. Click to expand.`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClose();
        }
      }}
    >
      {position.maxHeight && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '32px',
          background: 'linear-gradient(to top, rgba(24, 28, 33, 0.95), transparent)',
          pointerEvents: 'none', zIndex: 10
        }} />
      )}

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
          transition={{ duration: TOKENS.HORIZON.t_pulse, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      <div style={{
        position: 'absolute', top: 0, left: '14px', right: '14px', height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
        borderRadius: '999px', pointerEvents: 'none'
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-2">
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
          <motion.h4
            initial={{ opacity: 0, y: -2 }}
            animate={{ opacity: 0.95, y: 0 }}
            transition={{ 
              delay: shouldReduceMotion ? 0 : 0.05, 
              duration: adjustedDurations.fast 
            }}
            style={{
              color: TOKENS.colors.textPrimary,
              fontSize: '18px',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)',
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'
            }}
          >
            {domain.title}
          </motion.h4>
        </div>

        {/* SUBHEADER */}
        <motion.div
          initial={{ opacity: 0, y: -2 }}
          animate={{ opacity: 0.82, y: 0 }}
          transition={{ 
            delay: shouldReduceMotion ? 0 : 0.08, 
            duration: adjustedDurations.fast 
          }}
          className="flex items-center gap-1.5 mb-4"
        >
          {React.cloneElement(getPostureIcon(domain.posture), { className: "w-3.5 h-3.5" })}
          <span style={{
            color: getDomainText(domain.id),
            fontSize: '13px',
            letterSpacing: '0.2px',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.35)',
            fontWeight: 500,
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
          }}>
            {domain.trend}
          </span>
        </motion.div>

        <div style={{
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${TOKENS.HORIZON.drawerDivider}, transparent)`,
          margin: '0 0 14px 0',
          opacity: 0.5
        }} />

        {/* CONFIDENCE BLOCK */}
        <motion.div
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: shouldReduceMotion ? 0 : 0.12, 
            duration: adjustedDurations.fast 
          }}
          className="flex items-center gap-3 mb-4"
        >
          <motion.div 
            className="relative w-8 h-8 flex-shrink-0 eq-confidence-ring"
            whileHover={shouldReduceMotion ? {} : {
              scale: 1.04,
              transition: { 
                duration: adjustedDurations.fast, 
                ease: MOTION_TOKENS.CURVES.horizonSpring 
              }
            }}
          >
            <svg className="transform -rotate-90" width="32" height="32" style={{ overflow: 'visible' }}>
              <circle cx="16" cy="16" r={ringRadius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2.5" />
              <motion.circle
                cx="16" cy="16" r={ringRadius} fill="none"
                stroke={getDomainColor(domain.id)}
                strokeWidth="2.5" strokeLinecap="round"
                strokeDasharray={ringCircumference}
                style={{ transformOrigin: 'center', willChange: 'stroke-dashoffset, filter' }}
                initial={{ strokeDashoffset: ringCircumference, opacity: 0.85 }}
                animate={shouldReduceMotion ? {
                  strokeDashoffset: targetOffset, opacity: 1.0
                } : {
                  strokeDashoffset: targetOffset, 
                  opacity: 1.0,
                  filter: ringAnimationComplete 
                    ? [
                        `drop-shadow(0 0 5px ${getDomainBloom(domain.id)})`,
                        `drop-shadow(0 0 8px ${getDomainBloom(domain.id)})`,
                        `drop-shadow(0 0 5px ${getDomainBloom(domain.id)})`
                      ]
                    : `drop-shadow(0 0 5px ${getDomainBloom(domain.id)})`
                }}
                transition={shouldReduceMotion ? {
                  strokeDashoffset: { duration: 0 }, opacity: { duration: 0 }
                } : {
                  strokeDashoffset: { duration: 0.6, delay: 0.3, ease: MOTION_TOKENS.CURVES.horizonIn },
                  opacity: { duration: 0.6, delay: 0.3, ease: MOTION_TOKENS.CURVES.horizonOpacity },
                  filter: ringAnimationComplete ? { 
                    duration: TOKENS.HORIZON.t_pulse, 
                    repeat: Infinity, 
                    ease: 'easeInOut' 
                  } : { 
                    duration: adjustedDurations.base, 
                    ease: 'easeOut' 
                  }
                }}
                onAnimationComplete={() => {
                  if (!ringAnimationComplete) setRingAnimationComplete(true);
                }}
              />
              {!shouldReduceMotion && (
                <motion.circle
                  cx="16" cy="16" r={ringRadius} fill="none"
                  stroke={getDomainColor(domain.id)}
                  strokeWidth="2.5" strokeLinecap="round"
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={targetOffset}
                  style={{ transformOrigin: 'center', pointerEvents: 'none' }}
                  initial={{ opacity: 0, filter: `blur(6px) drop-shadow(0 0 6px ${getDomainBloom(domain.id)})` }}
                  animate={{
                    opacity: ringAnimationComplete ? [0, 0.25, 0] : 0,
                    filter: `blur(6px) drop-shadow(0 0 6px ${getDomainBloom(domain.id)})`
                  }}
                  transition={{ opacity: { duration: TOKENS.HORIZON.t_pulse, repeat: Infinity, ease: 'easeInOut' } }}
                />
              )}
            </svg>
            
            <motion.div
              className="absolute inset-0 flex items-center justify-center font-bold"
              style={{
                color: TOKENS.colors.textPrimary,
                fontSize: '10px',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.35)'
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                delay: shouldReduceMotion ? 0 : 0.4, 
                duration: adjustedDurations.slow, 
                ease: MOTION_TOKENS.CURVES.horizonIn 
              }}
            >
              {domain.confidence_pct}
            </motion.div>
          </motion.div>
          
          <div className="flex-1">
            <div style={{
              fontSize: '11px',
              color: 'rgba(255, 255, 255, 0.75)',
              letterSpacing: '0.15em',
              fontWeight: 600,
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.35)',
              marginBottom: '3px'
            }}>
              CONFIDENCE
            </div>
            <div style={{
              fontSize: '14.5px',
              color: TOKENS.colors.textPrimary,
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.35)',
              fontWeight: 600,
              letterSpacing: '-0.01em'
            }}>
              {domain.confidence_pct}% • {getConfidenceStrength(domain.confidence_pct)}
            </div>
          </div>
        </motion.div>

        {/* BODY DESCRIPTION */}
        <motion.p
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 0.90, y: 0 }}
          transition={{ 
            delay: shouldReduceMotion ? 0 : 0.16, 
            duration: adjustedDurations.fast 
          }}
          style={{
            color: 'rgba(255, 255, 255, 0.88)',
            fontSize: '15px',
            lineHeight: '1.55',
            marginBottom: '12px',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.35)',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
            fontWeight: 400
          }}
        >
          {domain.summary}
        </motion.p>

        {/* INSIGHT BOX — Lyra-branded with hover pulse */}
        <motion.div
          className="eq-insight-chip"
          initial={{ opacity: 0, y: 2 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: shouldReduceMotion ? 0 : 0.20, 
            duration: adjustedDurations.fast, 
            ease: MOTION_TOKENS.CURVES.horizonIn 
          }}
          onHoverStart={() => setIsInsightHovered(true)}
          onHoverEnd={() => setIsInsightHovered(false)}
          style={{
            position: 'relative',
            width: '100%',
            padding: '9px 13px',
            borderRadius: '12px',
            marginTop: '10px',
            marginBottom: '14px',
            background: 'rgba(255, 255, 255, 0.10)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.20)',
            boxShadow: isInsightHovered 
              ? `inset 0 0 0 1px rgba(255, 255, 255, 0.08), 0 0 ${MOTION_TOKENS.ELEVATION.chip.blur}px rgba(0, 0, 0, ${MOTION_TOKENS.ELEVATION.chip.opacity})`
              : 'inset 0 0 0 1px rgba(255, 255, 255, 0.08)',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
            fontSize: '14px',
            lineHeight: '1.5',
            color: 'rgba(255, 255, 255, 0.92)',
            pointerEvents: 'none',
            filter: isInsightHovered ? 'brightness(1.03)' : 'brightness(1)',
            transition: `filter ${adjustedDurations.fast}s ${MOTION_TOKENS.CURVES.horizonOpacity.map(n => n).join(',')}, box-shadow ${adjustedDurations.fast}s ${MOTION_TOKENS.CURVES.horizonIn.map(n => n).join(',')}`
          }}
        >
          <span style={{ 
            fontWeight: 600, 
            opacity: 0.85, 
            marginRight: '5px', 
            letterSpacing: '0.3px',
            color: 'rgba(106, 199, 247, 0.9)'
          }}>
            Lyra Insight →
          </span>
          <span style={{ fontWeight: 400, opacity: 0.92 }}>
            {domain.insight}
          </span>
        </motion.div>

        <div style={{
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${TOKENS.HORIZON.drawerDivider}, transparent)`,
          margin: '14px 0 12px 0',
          opacity: 0.5
        }} />

        {/* CTA — 8MS MICRO-NUDGE */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ 
            delay: shouldReduceMotion ? 0 : 0.24, 
            duration: adjustedDurations.fast 
          }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}
        >
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="cta-expand-signal group"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={shouldReduceMotion ? {} : {
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              y: -1,
              transition: { 
                duration: MOTION_TOKENS.DURATIONS.microPulse, 
                ease: MOTION_TOKENS.CURVES.horizonIn 
              }
            }}
            whileTap={shouldReduceMotion ? {} : {
              y: 1,
              transition: { 
                duration: MOTION_TOKENS.DURATIONS.microPulse, 
                ease: MOTION_TOKENS.CURVES.horizonOut 
              }
            }}
            style={{
              position: 'relative',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              minHeight: '36px',
              padding: '8px 12px',
              borderRadius: '12px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
              fontSize: '14px',
              fontWeight: 500,
              letterSpacing: '0.25px',
              color: 'rgba(90, 160, 255, 0.95)',
              WebkitTapHighlightColor: 'transparent',
              outline: 'none',
              overflow: 'hidden',
              willChange: 'transform, background-color'
            }}
            aria-label="Expand signal for detailed analysis"
          >
            {!shouldReduceMotion && (
              <motion.div
                className="absolute left-3 right-3 bottom-2 h-[1px]"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.67), transparent)',
                  transformOrigin: '50% 50%',
                  scaleX: 0
                }}
                initial={{ scaleX: 0 }}
                whileHover={{
                  scaleX: 1,
                  transition: { 
                    duration: adjustedDurations.base, 
                    ease: MOTION_TOKENS.CURVES.horizonIn 
                  }
                }}
              />
            )}

            <span style={{ position: 'relative', zIndex: 1 }}>Expand signal</span>
            
            <motion.div
              style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center' }}
              initial={{ x: 0, opacity: 0.85 }}
              animate={{ x: 0, opacity: 0.85 }}
              whileHover={shouldReduceMotion ? {} : {
                x: 2, 
                opacity: 1,
                transition: { 
                  duration: MOTION_TOKENS.DURATIONS.microPulse, 
                  ease: MOTION_TOKENS.CURVES.horizonIn 
                }
              }}
              whileTap={shouldReduceMotion ? {} : {
                x: 3,
                transition: { 
                  duration: MOTION_TOKENS.DURATIONS.microPulse, 
                  ease: MOTION_TOKENS.CURVES.horizonOut 
                }
              }}
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.div>
          </motion.button>
        </motion.div>
      </div>

      {!position.maxHeight && (
        <>
          <div style={{
            position: 'absolute',
            left: `${position.arrow.x}px`,
            [position.arrow.direction === 'down' ? 'bottom' : 'top']: '-6px',
            transform: 'translateX(-50%)',
            width: 0, height: 0,
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            [position.arrow.direction === 'down' ? 'borderTop' : 'borderBottom']: `8px solid ${TOKENS.HORIZON.glassBorder}`,
            pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute',
            left: `${position.arrow.x}px`,
            [position.arrow.direction === 'down' ? 'bottom' : 'top']: '-5px',
            transform: 'translateX(-50%)',
            width: 0, height: 0,
            borderLeft: '7px solid transparent',
            borderRight: '7px solid transparent',
            [position.arrow.direction === 'down' ? 'borderTop' : 'borderBottom']: '7px solid rgba(24, 28, 33, 0.45)',
            pointerEvents: 'none'
          }} />
        </>
      )}
    </motion.div>
  );

  return createPortal(cardContent, portalRoot);
};

const MacroConstellation = ({ onOpenSignalDrawer }) => {
  const containerRef = useRef(null);
  const footerRef = useRef(null);
  const constellationRef = useRef(null);
  const drawerRef = useRef(null);

  const [hoveredDomain, setHoveredDomain] = useState(null);
  const [hoveredNodeRect, setHoveredNodeRect] = useState(null);
  const [isCardHovered, setIsCardHovered] = useState(false);
  const hoverEnterTimerRef = useRef(null);
  const hoverExitTimerRef = useRef(null);

  const [selectedDomain, setSelectedDomain] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const [isLowPower, setIsLowPower] = useState(false);
  const [constellationShift, setConstellationShift] = useState(0);
  const [orbitScale, setOrbitScale] = useState(1.0);
  const [noiseDrift, setNoiseDrift] = useState(0);
  const [filamentFlash, setFilamentFlash] = useState(null);
  const [isSwitchingNode, setIsSwitchingNode] = useState(false);
  const [viewportSize, setViewportSize] = useState('lg');
  const [drawerOrigin, setDrawerOrigin] = useState(null);
  const [showBeam, setShowBeam] = useState(false);
  const [swayTime, setSwayTime] = useState(0);
  const [orbPulseActive, setOrbPulseActive] = useState(false);
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

  // Responsive equilibrium spacing (calculated from orb glow boundary)
  const getEquilibriumSpacing = useCallback(() => {
    if (viewportSize === 'sm') return 48; // Mobile: 40-56px range
    if (viewportSize === 'md') return 64; // Tablet: 56-72px range
    return 92; // Desktop: 88-96px range (optimal visual rhythm)
  }, [viewportSize]);

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
    if (dominantDriver === "balanced") return 0.5;
    const dominant = domains.find(d => d.id === dominantDriver);
    const normalizedStrength = Math.min(Math.max((dominant.strength - 0.5) / (1.0 - 0.5), 0), 1);
    
    if (dominant.id === "rates" || dominant.id === "geopolitics") { // Rates and geopolitics are "negative" forces
      return 0.5 - (normalizedStrength * 0.5);
    } else { // FX and Growth are "positive" forces
      return 0.5 + (normalizedStrength * 0.5);
    }
  }, [dominantDriver, domains]);

  const globalSummary = useMemo(() => {
    if (dominantDriver === "balanced") {
      return `Market forces in near-perfect balance; tactical opportunities across sectors.`;
    }
    const dominant = domains.find(d => d.id === dominantDriver);
    return `${dominant.title.split(' ')[0]} dynamics are pulling the market with ${Math.round(dominant.strength * 100)}% conviction.`;
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
    const offsetMagnitude = (balanceBias - 0.5) * 2 * 12;
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
  const getDomainGlow = (id) => TOKENS.MACRO[id]?.glow || TOKENS.MACRO.rates.glow;

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

  const getConfidenceStrength = useCallback((confidence_pct) => {
    if (confidence_pct >= 75) return "High Signal Strength";
    if (confidence_pct >= 65) return "Moderate Strength";
    if (confidence_pct >= 55) return "Emerging Signal";
    return "Weak Signal";
  }, []);

  const handleDomainHoverEnter = useCallback((domain, event) => {
    const target = event.currentTarget;
    
    if (hoverExitTimerRef.current) {
      clearTimeout(hoverExitTimerRef.current);
      hoverExitTimerRef.current = null;
    }
    
    if (hoverEnterTimerRef.current) {
      clearTimeout(hoverEnterTimerRef.current);
    }
    
    hoverEnterTimerRef.current = setTimeout(() => {
      if (target && typeof target.getBoundingClientRect === 'function') {
        try {
          const rect = target.getBoundingClientRect();
          setHoveredDomain(domain.id);
          setHoveredNodeRect(rect);
        } catch (error) {
          console.warn('Failed to get bounding rect:', error);
        }
      }
    }, TOKENS.HORIZON.hoverEnterDelay);
  }, []);

  const handleDomainHoverLeave = useCallback(() => {
    if (hoverEnterTimerRef.current) {
      clearTimeout(hoverEnterTimerRef.current);
      hoverEnterTimerRef.current = null;
    }
    
    if (hoverExitTimerRef.current) {
      clearTimeout(hoverExitTimerRef.current);
    }
    
    hoverExitTimerRef.current = setTimeout(() => {
      if (!isCardHovered) {
        setHoveredDomain(null);
        setHoveredNodeRect(null);
      }
    }, 400);
  }, [isCardHovered]);

  const handleCardEnter = useCallback(() => {
    setIsCardHovered(true);
    
    if (hoverExitTimerRef.current) {
      clearTimeout(hoverExitTimerRef.current);
      hoverExitTimerRef.current = null;
    }
  }, []);

  const handleCardLeave = useCallback(() => {
    setIsCardHovered(false);
    
    if (hoverExitTimerRef.current) {
      clearTimeout(hoverExitTimerRef.current);
    }
    
    hoverExitTimerRef.current = setTimeout(() => {
      setHoveredDomain(null);
      setHoveredNodeRect(null);
    }, 150);
  }, []);

  const handleOpenDrawer = useCallback((domain) => {
    if (selectedDomain?.id === domain.id) return;
    
    if (hoverEnterTimerRef.current) {
      clearTimeout(hoverEnterTimerRef.current);
      hoverEnterTimerRef.current = null;
    }
    if (hoverExitTimerRef.current) {
      clearTimeout(hoverExitTimerRef.current);
      hoverExitTimerRef.current = null;
    }
    
    setHoveredDomain(null);
    setHoveredNodeRect(null);
    setIsCardHovered(false);

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

  const handleCardClick = useCallback((domain) => {
    if (hoverEnterTimerRef.current) {
      clearTimeout(hoverEnterTimerRef.current);
      hoverEnterTimerRef.current = null;
    }
    if (hoverExitTimerRef.current) {
      clearTimeout(hoverExitTimerRef.current);
      hoverExitTimerRef.current = null;
    }
    
    setHoveredDomain(null);
    setHoveredNodeRect(null);
    setIsCardHovered(false);
    
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
  
  useEffect(() => {
    return () => {
      if (hoverEnterTimerRef.current) clearTimeout(hoverEnterTimerRef.current);
      if (hoverExitTimerRef.current) clearTimeout(hoverExitTimerRef.current);
    };
  }, []);

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
      left: `calc(50% - ${drawerWidth / 2}px)`,
      top: targetTop,
      width: drawerWidth,
      height: drawerHeight - viewportAdjustment
    };
  }, [selectedDomain, drawerOrigin]);


  return (
    <motion.section variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} aria-label="Equilibrium" style={{ maxWidth: '84vw', margin: '0 auto' }}>
      <div className="flex items-center justify-between mb-6 pl-2">
        <div className="flex items-center space-x-3">
          <Globe className="w-6 h-6" style={{ color: '#6AC7F7' }} />
          <div>
            <h2 style={{ fontSize: '18px', lineHeight: '24px', fontWeight: 600, color: TOKENS.colors.textPrimary, fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>Equilibrium</h2>
            <p style={{ fontSize: '13px', color: TOKENS.colors.textTertiary, letterSpacing: '0.2em', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>Real-time balance of global macro forces.</p>
          </div>
        </div>
        <div className="powered-by-lyra cursor-pointer" style={{ opacity: 0.6 }}>
          <div className="flex items-center space-x-2 px-4 py-2" style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', border: '1px solid rgba(160,191,255,0.08)', borderRadius: '12px' }}>
            <span className="text-xs font-medium" style={{ color: TOKENS.colors.textTertiary, letterSpacing: '0.25px', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>Powered by</span>
            <LyraLogo className="w-5 h-5" />
            <span className="text-sm font-bold" style={{ color: TOKENS.colors.textPrimary }}>Lyra</span>
          </div>
        </div>
      </div>

      <div ref={containerRef} className="grid-wrapper relative w-full overflow-hidden" data-dominant={dominantDriver} style={{ height: '700px', background: `linear-gradient(184deg, ${TOKENS.HORIZON.bgBase} 0%, ${TOKENS.HORIZON.bgEnd} 100%)`, border: '1px solid rgba(160,191,255,0.08)', borderRadius: '24px', paddingTop: '4vh', paddingBottom: '5vh', position: 'relative', pointerEvents: 'none' }}>

        <motion.div style={{ position: 'absolute', inset: 0, background: `radial-gradient(900px circle at 52% 48%, ${TOKENS.HORIZON.bgSubsurfaceCenter} 0%, ${TOKENS.HORIZON.bgSubsurfaceEdge} 70%)`, opacity: 0.35, borderRadius: '24px', pointerEvents: 'none', zIndex: 1 }} animate={{ x: shouldReduceMotion ? 0 : bgParallaxX.get() * TOKENS.HORIZON.parallaxOffset * 0.6, y: shouldReduceMotion ? 0 : bgParallaxY.get() * TOKENS.HORIZON.parallaxOffset * 0.6 }} transition={{ duration: TOKENS.HORIZON.t_parallax, ease: TOKENS.HORIZON.easingApple }} />

        <motion.div style={{ position: 'absolute', inset: 0, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3Cfilter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`, backgroundSize: '200px 200px', opacity: 0.15, borderRadius: '24px', pointerEvents: 'none', zIndex: 2 }} animate={{ backgroundPosition: [`${noiseDrift}px 0px`, `${noiseDrift + 0.3}px 0px`] }} transition={{ duration: 1, ease: 'linear' }} />

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
                  <stop offset="50%" stopColor="#C9B46B" stopOpacity="0.20" />
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
                      onMouseEnter={(e) => handleDomainHoverEnter(domain, e)}
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

          {/* Hover Card - OS HORIZON V3.1 MOTION */}
          <AnimatePresence>
            {hoveredDomain && !selectedDomain && hoveredNodeRect && (() => {
              const domain = domains.find(d => d.id === hoveredDomain);
              if (!domain) return null;

              return (
                <HoverCardPortal
                  key={`tooltip-${hoveredDomain}`}
                  domain={domain}
                  nodeRect={hoveredNodeRect}
                  onClose={() => handleCardClick(domain)}
                  onCardEnter={handleCardEnter}
                  onCardLeave={handleCardLeave}
                  getDomainColor={getDomainColor}
                  getDomainBloom={getDomainBloom}
                  getDomainIcon={getDomainIcon}
                  getDomainText={getDomainText}
                  getPostureIcon={getPostureIcon}
                  getConfidenceStrength={getConfidenceStrength}
                  shouldReduceMotion={shouldReduceMotion}
                />
              );
            })()}
          </AnimatePresence>

          {domains.map((domain) => {
            const orbPos = getOrbPosition(domain.id, domain.strength, swayTime, parallaxX.get(), parallaxY.get());
            const labelPos = getLabelPosition(orbPos.x, orbPos.y, orbPos.radius);
            const isHovered = hoveredDomain === domain.id;
            const isSelected = selectedDomain?.id === domain.id;

            return (
              <motion.div key={`label-${domain.id}`} style={{ position: 'absolute', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', background: 'rgba(10,14,20,0.50)', border: `1px solid ${TOKENS.HORIZON.glassBorder}`, borderRadius: '10px', padding: '5px 9px', fontWeight: 600, fontSize: '11px', letterSpacing: '0.03em', textTransform: 'lowercase', textShadow: '0 1px 2px rgba(0,0,0,0.4)', pointerEvents: 'none', zIndex: 3, fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }} animate={{ left: `${labelPos.x}px`, top: `${labelPos.y}px`, x: '-50%', y: '-50%', color: isHovered || isSelected ? TOKENS.colors.textLabel : getDomainText(domain.id), scale: isHovered || isSelected ? 1.05 : 1, boxShadow: isHovered || isSelected ? '0 0 16px rgba(160,191,255,0.15)' : 'none' }} transition={{ left: { duration: TOKENS.HORIZON.t_labelLag, ease: TOKENS.HORIZON.easingApple }, top: { duration: TOKENS.HORIZON.t_labelLag, ease: TOKENS.HORIZON.easingApple }, color: { duration: TOKENS.HORIZON.t_hover, ease: TOKENS.HORIZON.easing }, scale: { duration: TOKENS.HORIZON.t_hover, ease: TOKENS.HORIZON.easing }, boxShadow: { duration: TOKENS.HORIZON.t_hover, ease: TOKENS.HORIZON.easing } }}>
                {domain.id}
              </motion.div>
            );
          })}
        </motion.div>

        {/* EQUILIBRIUM PULSE — GLOW-AWARE RESPONSIVE SPACING */}
        <div style={{
          position: 'absolute',
          left: '14%',
          right: '14%',
          bottom: `${getEquilibriumSpacing()}px`,
          zIndex: 6,
          pointerEvents: 'auto'
        }}>
          <EquilibriumPulse
            equilibriumScore={balanceBias}
            volatility={0.3 + (Math.abs(balanceBias - 0.5) * 0.4)}
            dominantForce={dominantDriver}
            forces={{
              growth: domains.find(d => d.id === 'growth')?.strength || 0,
              rates: -(domains.find(d => d.id === 'rates')?.strength || 0),
              fx: (domains.find(d => d.id === 'fx')?.strength || 0) * 0.5,
              geopolitics: -(domains.find(d => d.id === 'geopolitics')?.strength || 0)
            }}
            stabilityIndex={
              dominantDriver === 'balanced' 
                ? 85 
                : Math.round(75 - (Math.abs(balanceBias - 0.5) * 50))
            }
            summary={globalSummary}
            onOpenDrawer={() => console.log('Equilibrium drawer requested')}
          />
        </div>

      </div>

      <div className="flex justify-center" style={{ marginTop: '10px' }}>
        <p style={{ fontSize: '9px', fontWeight: 400, color: TOKENS.colors.textTertiary, opacity: 0.55, fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>Data via Lyra models</p>
      </div>

      {/* DRAWER OVERLAY */}
      <AnimatePresence>
        {selectedDomain && (
          <motion.div
            className="fixed inset-0 z-40 drawer-overlay"
            style={{ 
              background: 'rgba(6,8,13,0.25)',
              backdropFilter: 'blur(0px) brightness(1)',
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
              backdropFilter: 'blur(12px) brightness(0.97)',
              WebkitBackdropFilter: 'blur(12px) brightness(0.97)',
              transition: {
                opacity: { duration: 0.1, ease: 'easeOut' },
                backdropFilter: { duration: 0.5, ease: MOTION_TOKENS.CURVES.horizonIn },
                WebkitBackdropFilter: { duration: 0.5, ease: MOTION_TOKENS.CURVES.horizonIn }
              }
            }}
            exit={{ 
              opacity: 0,
              backdropFilter: 'blur(0px) brightness(1)',
              WebkitBackdropFilter: 'blur(0px) brightness(1)',
              transition: {
                opacity: { duration: 0.25, ease: 'easeInOut' },
                backdropFilter: { duration: 0.15, delay: 0.25, ease: 'easeOut' },
                WebkitBackdropFilter: { duration: 0.15, delay: 0.25, ease: 'easeOut' }
              }
            }}
            onClick={handleCloseDrawer}
          />
        )}
      </AnimatePresence>

      {/* EXPANSION DRAWER — OS HORIZON V3.2 */}
      <AnimatePresence>
        {selectedDomain && !isSwitchingNode && drawerOrigin && (
          <motion.div
            ref={drawerRef}
            className="fixed z-50 flex flex-col drawer-with-header-safe"
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedDomain.title} detailed analysis`}
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
              scale: 0.985,
              opacity: 0,
              y: 4
            }}
            animate={{
              scale: 1,
              opacity: 1,
              y: 0,
              transition: {
                duration: MOTION_TOKENS.DURATIONS.drawerInhale,
                ease: MOTION_TOKENS.CURVES.drawerInhale
              }
            }}
            exit={{
              scale: 0.99,
              opacity: 0,
              transition: {
                duration: MOTION_TOKENS.DURATIONS.base,
                ease: MOTION_TOKENS.CURVES.horizonOut
              }
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background layers */}
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
                background: `radial-gradient(circle at center, ${getDomainGlow(selectedDomain.id)} 0%, transparent 70%)`, 
                opacity: 0.15, 
                filter: 'blur(40px)', 
                pointerEvents: 'none', 
                mixBlendMode: 'screen', 
                zIndex: 0 
              }} 
              initial={{ opacity: 0 }} 
              animate={{ 
                opacity: 0.15, 
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

            {/* HEADER */}
            <motion.div 
              className="flex-shrink-0 p-6 border-b" 
              style={{ 
                background: TOKENS.HORIZON.drawerTint, 
                borderColor: TOKENS.HORIZON.drawerDivider, 
                backdropFilter: getBlur('chip'), 
                position: 'relative', 
                zIndex: 10 
              }} 
              initial={{ opacity: 0, y: -4 }} 
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { 
                  duration: MOTION_TOKENS.DURATIONS.fast, 
                  delay: shouldReduceMotion ? 0 : 0.03, 
                  ease: MOTION_TOKENS.CURVES.horizonIn 
                }
              }} 
              exit={{ 
                opacity: 0, 
                y: -5,
                transition: { duration: MOTION_TOKENS.DURATIONS.fast }
              }}
            >
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-4">
                  <motion.div 
                    className="w-12 h-12 rounded-full flex items-center justify-center" 
                    style={{ 
                      background: `${getDomainColor(selectedDomain.id)}12`, 
                      border: `1px solid ${getDomainColor(selectedDomain.id)}25`, 
                      boxShadow: `0 0 16px ${getDomainBloom(selectedDomain.id)}`, 
                      color: getDomainColor(selectedDomain.id) 
                    }}
                    animate={shouldReduceMotion ? {} : {
                      filter: ['brightness(1)', 'brightness(1.06)', 'brightness(1)']
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
                    <h3 style={{ 
                      color: TOKENS.colors.textPrimary, 
                      fontSize: '19px', 
                      fontWeight: 600, 
                      lineHeight: '1.25', 
                      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif', 
                      letterSpacing: '-0.01em',
                      marginBottom: '6px' 
                    }}>
                      {selectedDomain.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      {React.cloneElement(getPostureIcon(selectedDomain.posture), {className: "w-3.5 h-3.5", style: { color: getDomainText(selectedDomain.id) }})}
                      <span style={{ color: getDomainText(selectedDomain.id), fontSize: '13px', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif', fontWeight: 500, letterSpacing: '0.2px' }}>
                        {selectedDomain.trend}
                      </span>
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
                <div className="relative w-10 h-10">
                  <svg className="transform -rotate-90" width="40" height="40">
                    <circle cx="20" cy="20" r="17" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
                    <motion.circle 
                      cx="20" cy="20" r="17" fill="none" 
                      stroke={getDomainColor(selectedDomain.id)} 
                      strokeWidth="3" strokeLinecap="round" 
                      strokeDasharray="107" 
                      initial={{ strokeDashoffset: 107, opacity: 0.9 }} 
                      animate={{ strokeDashoffset: 107 - (107 * selectedDomain.confidence_pct / 100), opacity: 0.98 }} 
                      transition={{ duration: 0.6, delay: 0.2, ease: MOTION_TOKENS.CURVES.horizonIn }}
                      style={{ filter: `drop-shadow(0 0 6px ${getDomainBloom(selectedDomain.id)})` }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-bold" style={{ color: TOKENS.colors.textPrimary, fontSize: '13px' }}>
                    {selectedDomain.confidence_pct}
                    {selectedDomain.confidenceDelta !== undefined && (
                      <span className={`absolute -right-2 -top-1 text-[9px] ${selectedDomain.confidenceDelta > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {selectedDomain.confidenceDelta > 0 ? '↑' : '↓'}{Math.abs(selectedDomain.confidenceDelta)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-xs font-medium mb-1" style={{ 
                    color: 'rgba(255,255,255,0.68)', 
                    letterSpacing: '0.18em', 
                    fontSize: '10px', 
                    lineHeight: '1.4', 
                    fontWeight: 600,
                    textTransform: 'uppercase'
                  }}>
                    CONFIDENCE
                  </div>
                  <div className="text-sm" style={{ 
                    color: TOKENS.colors.textPrimary, 
                    fontWeight: 600, 
                    fontSize: '14px',
                    lineHeight: '1.4',
                    letterSpacing: '-0.005em'
                  }}>
                    {selectedDomain.confidence_pct}% · {selectedDomain.confidence_label}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* SCROLLABLE BODY — OS HORIZON V3.2 HIERARCHY */}
            <motion.div 
              className="flex-1 overflow-y-auto px-6 pb-24" 
              style={{ position: 'relative', zIndex: 2, paddingTop: '28px' }}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                transition: { 
                  duration: MOTION_TOKENS.DURATIONS.fast, 
                  delay: shouldReduceMotion ? 0 : 0.06, 
                  ease: MOTION_TOKENS.CURVES.horizonIn 
                }
              }}
              exit={{ 
                opacity: 0,
                transition: { duration: MOTION_TOKENS.DURATIONS.fast }
              }}
            >
              {/* 1) WHAT IT MEANS */}
              <motion.div 
                initial={{ opacity: 0, y: 4 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ 
                  delay: shouldReduceMotion ? 0 : 0.09, 
                  duration: MOTION_TOKENS.DURATIONS.fast 
                }} 
                style={{ marginBottom: '24px' }}
              >
                <h4 style={{ 
                  color: 'rgba(255,255,255,0.68)', 
                  fontSize: '12px', 
                  fontWeight: 600, 
                  marginBottom: '12px', 
                  lineHeight: '1.4',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase'
                }}>
                  What It Means
                </h4>
                <p style={{ 
                  color: TOKENS.colors.textBody, 
                  fontSize: '14px', 
                  lineHeight: '1.6', 
                  fontWeight: 400 
                }}>
                  {selectedDomain.summary}
                </p>
                {selectedDomain.addendum && (
                  <p style={{ 
                    color: TOKENS.colors.textSecondary, 
                    fontSize: '13px', 
                    marginTop: '10px', 
                    opacity: 0.85, 
                    lineHeight: '1.55', 
                    fontWeight: 400 
                  }}>
                    {selectedDomain.addendum}
                  </p>
                )}
              </motion.div>

              {/* 2) DOWNSTREAM EFFECTS — SIMPLIFIED */}
              <motion.div 
                initial={{ opacity: 0, y: 4 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ 
                  delay: shouldReduceMotion ? 0 : 0.12, 
                  duration: MOTION_TOKENS.DURATIONS.fast 
                }} 
                style={{ marginBottom: '32px' }}
              >
                <h4 style={{ 
                  color: 'rgba(255,255,255,0.68)', 
                  fontSize: '12px', 
                  fontWeight: 600, 
                  marginBottom: '12px', 
                  lineHeight: '1.4',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase'
                }}>
                  Downstream Effects
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {selectedDomain.downstream_effects.map((effect, i) => (
                    <motion.div 
                      key={i}
                      className="eq-effect-row-minimal group"
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        delay: shouldReduceMotion ? 0 : 0.15 + (i * 0.04),
                        duration: MOTION_TOKENS.DURATIONS.fast,
                        ease: MOTION_TOKENS.CURVES.horizonIn
                      }}
                      whileHover={effect.link ? { 
                        x: 4,
                        transition: { 
                          duration: 0.14,
                          ease: MOTION_TOKENS.CURVES.horizonIn 
                        }
                      } : {}}
                      style={{ 
                        background: 'rgba(255,255,255,0.03)', 
                        borderRadius: '12px',
                        padding: '10px 12px', 
                        display: 'flex', 
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        gap: '10px',
                        position: 'relative',
                        cursor: effect.link ? 'pointer' : 'default',
                        transition: `transform 0.14s ${MOTION_TOKENS.CURVES.horizonIn.map(n => n).join(',')}, filter 0.14s ease`
                      }}
                      onClick={effect.link ? () => console.log(`Navigate to ${effect.link}`) : undefined}
                    >
                      <div className="flex-1 min-w-0">
                        <p style={{ 
                          color: TOKENS.colors.textBody, 
                          fontSize: '13.5px', 
                          lineHeight: '1.42', 
                          fontWeight: 500,
                          marginBottom: '6px'
                        }}>
                          {effect.title}
                        </p>
                        <div style={{ 
                          fontSize: '11px', 
                          color: TOKENS.colors.textMuted,
                          fontWeight: 400,
                          letterSpacing: '0.02em'
                        }}>
                          {effect.tags.map((tag, idx) => (
                            <React.Fragment key={idx}>
                              {idx > 0 && <span style={{ opacity: 0.7, margin: '0 4px' }}>·</span>}
                              <span style={{ textTransform: 'lowercase' }}>{tag.toLowerCase()}</span>
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                      {effect.link && (
                        <motion.div
                          style={{ flexShrink: 0, paddingTop: '2px' }}
                          animate={{ opacity: 0.4 }}
                          whileHover={{ opacity: 0.8 }}
                          transition={{ duration: 0.14 }}
                        >
                          <ArrowRight className="w-3.5 h-3.5" style={{ color: TOKENS.colors.textTertiary }} />
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* 3) ACTIONABLE SIGNAL — SOFT GLOW PANEL */}
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: shouldReduceMotion ? 0 : 0.18, 
                  duration: MOTION_TOKENS.DURATIONS.fast 
                }}
                className="p-5 rounded-2xl relative overflow-hidden"
                style={{ 
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '14px',
                  boxShadow: `inset 0 0 20px ${getDomainGlow(selectedDomain.id)}`
                }}
                whileHover={shouldReduceMotion ? {} : {
                  filter: 'brightness(1.02)',
                  transition: { duration: 0.14 }
                }}
              >
                {!shouldReduceMotion && (
                  <motion.div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: `radial-gradient(circle at 50% 0%, ${getDomainGlow(selectedDomain.id)}, transparent 70%)`,
                      opacity: 0.12,
                      pointerEvents: 'none'
                    }}
                    animate={{
                      opacity: [0.12, 0.18, 0.12]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                  />
                )}
                
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-semibold" style={{ 
                    color: 'rgba(255,255,255,0.68)', 
                    letterSpacing: '0.12em', 
                    fontSize: '11px',
                    lineHeight: '1.4', 
                    fontWeight: 600,
                    textTransform: 'uppercase'
                  }}>
                    Actionable Signal
                  </p>
                  <div className="flex items-center gap-3 text-xs">
                    <span style={{ color: 'rgba(255, 255, 255, 0.58)', fontSize: '12px' }}>
                      {selectedDomain.actionable.horizon}
                    </span>
                    <span 
                      className="px-2.5 py-1 rounded-full text-[10px] font-semibold"
                      style={{
                        background: selectedDomain.actionable.conviction === 'High' 
                          ? 'rgba(88, 227, 164, 0.15)'
                          : selectedDomain.actionable.conviction === 'Medium'
                            ? 'rgba(90, 160, 255, 0.15)'
                            : 'rgba(255, 255, 255, 0.10)',
                        color: selectedDomain.actionable.conviction === 'High'
                          ? 'rgba(88, 227, 164, 0.95)'
                          : selectedDomain.actionable.conviction === 'Medium'
                            ? 'rgba(90, 160, 255, 0.95)'
                            : 'rgba(255, 255, 255, 0.75)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        letterSpacing: '0.03em'
                      }}
                    >
                      {selectedDomain.actionable.conviction} Conviction
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {selectedDomain.actionable.directives.map((directive, i) => (
                    <motion.div
                      key={i}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -3 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: shouldReduceMotion ? 0 : 0.21 + (i * 0.05),
                        duration: MOTION_TOKENS.DURATIONS.fast
                      }}
                    >
                      <div style={{
                        width: '4px',
                        height: '4px',
                        borderRadius: '999px',
                        background: getDomainColor(selectedDomain.id),
                        marginTop: '7px',
                        flexShrink: 0,
                        boxShadow: `0 0 6px ${getDomainBloom(selectedDomain.id)}`
                      }} />
                      <p style={{ 
                        color: 'rgba(215, 225, 235, 0.94)', 
                        fontSize: '13.5px',
                        lineHeight: '1.55', 
                        fontWeight: 400,
                        flex: 1
                      }}>
                        {directive}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* STICKY FOOTER */}
            <motion.div 
              className="flex-shrink-0 border-t p-5"
              style={{
                position: 'sticky',
                bottom: 0,
                background: TOKENS.HORIZON.drawerTint,
                borderColor: TOKENS.HORIZON.drawerDivider,
                backdropFilter: getBlur('panel'),
                zIndex: 10
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { 
                  duration: MOTION_TOKENS.DURATIONS.fast, 
                  delay: shouldReduceMotion ? 0 : 0.24, 
                  ease: MOTION_TOKENS.CURVES.horizonIn 
                }
              }}
              exit={{ 
                opacity: 0, 
                y: 5,
                transition: { duration: MOTION_TOKENS.DURATIONS.fast }
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <motion.button
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl font-medium"
                  style={{ 
                    background: 'rgba(90,160,255,0.12)', 
                    color: '#5A9EFF', 
                    border: '1px solid rgba(90,160,255,0.25)', 
                    fontSize: '13.5px',
                    paddingTop: '11px',
                    paddingBottom: '11px',
                    fontWeight: 600,
                    letterSpacing: '0.01em'
                  }} 
                  aria-label={selectedDomain.footer.primary_cta.label}
                  whileHover={{
                    y: -1,
                    background: 'rgba(90,160,255,0.18)',
                    boxShadow: '0 0 16px rgba(90,160,255,0.25)',
                    filter: 'brightness(1.03)',
                    transition: { 
                      duration: 0.14,
                      ease: MOTION_TOKENS.CURVES.horizonIn 
                    }
                  }}
                  whileTap={{
                    y: 1,
                    scale: 0.99,
                    transition: { duration: MOTION_TOKENS.DURATIONS.microPulse }
                  }}
                  onClick={() => console.log(`Navigate to ${selectedDomain.footer.primary_cta.route}`)}
                >
                  <span>{selectedDomain.footer.primary_cta.label}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>

                <motion.button
                  className="px-4 py-3 rounded-xl text-sm font-medium"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: TOKENS.colors.textSecondary,
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    fontSize: '12.5px',
                    fontWeight: 500
                  }}
                  whileHover={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    y: -1,
                    transition: { 
                      duration: 0.14,
                      ease: MOTION_TOKENS.CURVES.horizonIn 
                    }
                  }}
                  whileTap={{
                    y: 1,
                    scale: 0.99,
                    transition: { duration: MOTION_TOKENS.DURATIONS.microPulse }
                  }}
                  onClick={() => console.log(`Navigate to ${selectedDomain.footer.secondary_link.route}`)}
                  aria-label={selectedDomain.footer.secondary_link.label}
                >
                  {selectedDomain.footer.secondary_link.label}
                </motion.button>
              </div>

              <div className="flex items-center justify-between text-xs" style={{ color: TOKENS.colors.textTertiary, fontSize: '11px' }}>
                <span style={{ opacity: 0.70 }}>
                  Updated {new Date(selectedDomain.footer.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span style={{ opacity: 0.55, letterSpacing: '0.05em' }}>
                  1–4 · ← → · ESC
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes ripple {
          from { opacity: 1; transform: scale(0); }
          to { opacity: 0; transform: scale(2); }
        }
        
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        /* Global Z-Index Scale */
        :root {
          --z-app: 10;
          --z-popover: 40;
          --z-tooltip: 45;
          --z-modal: 50;
          --z-toast: 60;
          --z-devtools: 70;
          --header-h: 72px;
          --bg: #0B0E13;
          --card: rgba(18, 20, 28, 0.65);
          --border: #2C2F36;
          --shadow: rgba(0, 0, 0, 0.45);
          --text-primary: #F3F5F7;
          --text-secondary: #B6BDCB;
          --text-tertiary: #7E8798;
          --muted: #5B6170;
          --accent: #4DA3FF;
          --bull: #58E3A4;
          --bear: #FF6A7A;
          --neutral: #A8B3C7;
          --chart-bg: #0F1115;
          --chart-grid: #242833;
          --chart-text: #B6BDCB;
          --scrim: rgba(0, 0, 0, 0.55);
          --horizon-link: rgba(90, 160, 255, 0.95);
        }
        
        html:not(.transitions-enabled) * {
          transition: none !important;
        }
        
        html.transitions-enabled * {
          transition: background-color 150ms ease, color 150ms ease, border-color 150ms ease, opacity 200ms ease, transform 200ms ease, box-shadow 200ms ease !important;
        }
        
        html { background-color: #0B0E13; }
        
        .vireon-portal-container {
          position: relative;
          z-index: var(--z-modal);
        }
        
        .drawer-overlay {
          position: fixed;
          inset: 0;
          z-index: var(--z-modal);
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        
        .drawer-panel {
          position: fixed;
          z-index: calc(var(--z-modal) + 1);
          background: rgba(18, 20, 25, 0.95);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);
          overscroll-behavior: contain;
        }
        
        body.drawer-open {
          overflow: hidden;
          position: fixed;
          width: 100%;
        }
        
        .elevation-0 {
          background: var(--bg);
        }
        
        .elevation-1 {
          background: var(--card);
          border: 1px solid var(--border);
          box-shadow: 0 2px 12px var(--shadow);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        
        .elevation-2 {
          background: var(--card);
          border: 1px solid var(--border);
          box-shadow: 0 8px 32px var(--shadow);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        
        .elevation-3 {
          background: var(--card);
          border: 1px solid var(--border);
          box-shadow: 0 16px 64px var(--shadow);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }

        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            transform: none !important;
          }
        }

        *:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 2px;
          z-index: calc(var(--z-modal) + 2);
        }

        .cta-expand-signal:focus-visible {
          outline: none;
          box-shadow: 
            inset 0 0 0 1.5px rgba(255, 255, 255, 0.28),
            0 0 0 3px rgba(255, 255, 255, 0.10);
        }

        @media (prefers-contrast: high) {
          * {
            border-color: currentColor !important;
          }
        }

        ::-webkit-scrollbar { 
          width: 6px; 
        }
        ::-webkit-scrollbar-track { 
          background: transparent; 
        }
        ::-webkit-scrollbar-thumb {
          background: var(--muted);
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: var(--text-tertiary);
        }

        @supports (padding: max(0px)) {
          .drawer-panel-bottom {
            padding-bottom: max(env(safe-area-inset-bottom), 16px);
          }
          
          .drawer-panel-top {
            top: max(var(--header-h), env(safe-area-inset-top));
          }
        }

        .animate-shimmer {
          background: linear-gradient(
            90deg,
            var(--card) 0%,
            var(--border) 50%,
            var(--card) 100%
          );
          background-size: 200% 100%;
          animation: shimmer 1.3s infinite;
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .card-hover {
          transition: transform 150ms ease-out, box-shadow 150ms ease-out;
        }
        
        .card-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px var(--shadow);
        }
        
        @media (prefers-reduced-motion: reduce) {
          .card-hover:hover {
            transform: none;
          }
        }

        .tap-highlight-transparent {
          -webkit-tap-highlight-color: transparent;
        }
        
        body {
          font-size: 15px;
          line-height: 1.5;
          color: var(--text-primary);
          background: var(--bg);
        }
        
        @media (max-width: 768px) {
          :root {
            --header-h: 60px;
          }
          
          body {
            font-size: 14px;
            line-height: 1.55;
          }
        }
        
        .toast-success {
          background: rgba(43, 190, 118, 0.08);
          border: 1px solid rgba(43, 190, 118, 0.15);
          color: var(--bull);
        }
        
        .toast-error {
          background: rgba(227, 63, 95, 0.08);
          border: 1px solid rgba(227, 63, 95, 0.15);
          color: var(--bear);
        }

        @media (pointer: coarse) {
          .cta-expand-signal {
            min-width: 44px;
            min-height: 44px;
          }
        }

        .cta-expand-signal:active {
          filter: brightness(1.02);
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
        .grid-wrapper {
          pointer-events: all;
        }

        /* OS HORIZON V3.2 — DRAWER ENHANCEMENTS */
        
        .eq-effect-row-minimal {
          will-change: transform, filter;
        }
        
        .eq-effect-row-minimal:hover {
          filter: brightness(1.02);
        }
        
        /* GPU Compositing */
        .eq-hover-card,
        .eq-confidence-ring,
        .eq-insight-chip,
        .cta-expand-signal,
        .drawer-with-header-safe,
        .eq-effect-row-minimal {
          transform: translateZ(0);
          backface-visibility: hidden;
        }
        
        .eq-hover-card p,
        .eq-hover-card span,
        .drawer-with-header-safe p,
        .drawer-with-header-safe span {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
        }
        
        @media (prefers-reduced-motion: reduce) {
          .eq-hover-card,
          .eq-confidence-ring,
          .eq-insight-chip,
          .cta-expand-signal,
          .drawer-with-header-safe,
          .eq-effect-row-minimal {
            transition: none !important;
            animation: none !important;
          }
          
          .eq-confidence-ring circle {
            animation: none !important;
          }
        }
        
        @media (prefers-contrast: high) {
          .eq-hover-card {
            border-color: rgba(255, 255, 255, 0.5) !important;
          }
          
          .eq-hover-card p,
          .eq-hover-card span {
            color: #FFFFFF !important;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 1) !important;
          }
        }
        
        @media (pointer: coarse) {
          .cta-expand-signal,
          .orb-nucleus {
            min-width: 44px;
            min-height: 44px;
          }
        }
        
        .cta-expand-signal:focus-visible {
          outline: none;
          box-shadow: 
            inset 0 0 0 1.5px rgba(255, 255, 255, 0.28),
            0 0 0 3px rgba(255, 255, 255, 0.10);
        }
        
        .orb-nucleus:focus-visible {
          outline: 2px solid rgba(122,215,240,0.9);
          outline-offset: 3px;
          z-index: 102;
        }
        
        .orb-halo, 
        .link-path, 
        .glow-overlay, 
        .panel-glass, 
        .drawer-overlay {
          pointer-events: none !important;
        }
        
        .grid-wrapper {
          pointer-events: all;
        }
        
        @supports (will-change: transform) {
          .eq-hover-card::before {
            content: '';
            position: absolute;
            inset: -1px;
            z-index: -1;
            border-radius: 19px;
          }
        }
      `}</style>
    </motion.section>
  );
};

export default MacroConstellation;
