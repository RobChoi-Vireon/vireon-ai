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

// 🔒 DESIGN LOCKED — OS HORIZON V4.0
// Last Updated: 2025-01-20
// Do not modify visual design without explicit assignment
// See: DESIGN_LOCKED_COMPONENTS.md

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
    trend: "Rising pressure",
    confidence_pct: 78,
    strength: 0.82,
    confidence_label: "Strong signal",
    summary: "The Federal Reserve is staying tough on inflation because prices keep rising. This means borrowing costs will stay high or go higher.",
    insight: "Interest rates holding steady while banks and companies adjust to the new normal.",
    downstream_effects: [
      { title: "Borrowing costs rising for companies", tags: ["Credit", "High Yield", "Investment Grade"], link: "/credit" },
      { title: "Tech stock valuations under pressure", tags: ["Tech", "Large-Cap Growth"], link: "/equities/tech" },
      { title: "Emerging markets paying more to borrow", tags: ["Emerging Markets", "Currency Funding"], link: "/em" }
    ],
    actionable: {
      horizon: "1–3 months",
      conviction: "High",
      directives: [
        "Favor short-term bonds and avoid stocks that are sensitive to interest rates.",
        "Protect against rising rates and hold dollars instead of emerging market currencies."
      ]
    },
    footer: {
      primary_cta: { label: "View detailed analysis", route: "/implications/rates" },
      secondary_link: { label: "View timeline", route: "/timeline/rates" },
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
    trend: "Steady trend",
    confidence_pct: 65,
    strength: 0.58,
    confidence_label: "Moderate signal",
    summary: "Currency markets are settling down as interest rates around the world become more similar. Money is moving less between countries as investors become more cautious.",
    insight: "Money flows between countries are stabilizing. Investors are becoming less aggressive.",
    downstream_effects: [
      { title: "Emerging market currencies steadying", tags: ["Currencies", "Emerging Markets", "Volatility"], link: "/fx/em" },
      { title: "Energy import costs staying flat", tags: ["Commodities", "Trade"], link: "/commodities" },
      { title: "Bond interest rates tightening together", tags: ["Fixed Income", "Rates"], link: "/bonds" }
    ],
    actionable: {
      horizon: "2–4 weeks",
      conviction: "Moderate",
      directives: [
        "Watch for interest rate differences between countries—they could shift currency bets.",
        "Stick with US investments until market swings pick up again."
      ]
    },
    footer: {
      primary_cta: { label: "View detailed analysis", route: "/fx/dashboard" },
      secondary_link: { label: "Track currencies", route: "/fx/tracker" },
      timestamp: new Date().toISOString()
    },
    addendum: "Next 48 hours: Currency markets likely to stay calm unless interest rates move unexpectedly.",
    last_updated_iso: new Date().toISOString(),
    sparkline: [0.60, 0.59, 0.58, 0.57, 0.58, 0.59, 0.58, 0.57, 0.58],
    confidenceDelta: -3
  },
  {
    id: "growth",
    title: "Growth Markets",
    posture: "softening",
    trend: "Mild slowdown",
    confidence_pct: 71,
    strength: 0.68,
    confidence_label: "Moderate signal",
    summary: "China's economy is slowing, which is reducing demand worldwide. The US economy is still holding up but showing signs of cooling across different industries.",
    insight: "Investors are shifting toward safer, more defensive investments as growth slows.",
    downstream_effects: [
      { title: "Raw material prices falling", tags: ["Commodities", "Energy", "Materials"], link: "/commodities" },
      { title: "Money moving to safer stocks", tags: ["Equities", "Defensive", "Utilities"], link: "/equities/defensive" },
      { title: "Service businesses holding steady", tags: ["Services", "Labor", "Domestic"], link: "/sectors/services" }
    ],
    actionable: {
      horizon: "1–2 weeks",
      conviction: "Strong",
      directives: [
        "Shift toward defensive stocks and companies that can raise prices easily.",
        "Watch commodity prices for more signs of weakening demand."
      ]
    },
    footer: {
      primary_cta: { label: "View detailed analysis", route: "/growth/outlook" },
      secondary_link: { label: "View sectors", route: "/sectors" },
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
    trend: "Rising tension",
    confidence_pct: 58,
    strength: 0.72,
    confidence_label: "Moderate signal",
    summary: "Countries are trading less with each other, forcing companies to rebuild supply chains. Concerns about energy security are increasing tensions in key regions.",
    insight: "Political tensions are building, creating more uncertainty in specific parts of the world.",
    downstream_effects: [
      { title: "Energy prices staying high", tags: ["Energy", "Oil", "Gas"], link: "/energy" },
      { title: "Companies moving factories back home", tags: ["Industrials", "Supply Chain", "Domestic"], link: "/industrials" },
      { title: "Countries forming closer trading groups", tags: ["Geopolitics", "Trade", "Policy"], link: "/geopolitics" }
    ],
    actionable: {
      horizon: "3–6 months",
      conviction: "Moderate",
      directives: [
        "Focus on US companies and energy investments that can handle disruptions.",
        "Spread your investments across multiple countries to reduce risk."
      ]
    },
    footer: {
      primary_cta: { label: "View detailed analysis", route: "/geopolitics/risk" },
      secondary_link: { label: "Track supply chains", route: "/supply-chain" },
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
const calculateSmartPlacement = (nodeRect, cardWidth = 320, cardHeight = 360) => {
  const HEADER_HEIGHT = 72;
  const SAFE_MARGIN = 16;
  const SAFE_TOP = HEADER_HEIGHT + SAFE_MARGIN; // 88px from top
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
  }

  if (x + cardWidth > viewport.width - SAFE_MARGIN) {
    x = viewport.width - SAFE_MARGIN - cardWidth;
  }

  if (x < SAFE_MARGIN) {
    x = SAFE_MARGIN;
  }

  // Final safety check to ensure card never goes above header
  if (y < SAFE_TOP) {
    y = SAFE_TOP;
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
        width: '320px',
        maxHeight: position.maxHeight ? `${position.maxHeight}px` : 'none',
        overflowY: position.maxHeight ? 'auto' : 'visible',
        padding: '20px 22px',
        borderRadius: '20px',
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
            Ori Insight →
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
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="cta-expand-signal group"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: shouldReduceMotion ? 0 : 0.24,
            duration: adjustedDurations.fast
          }}
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

const MacroConstellation = ({ onOpenSignalDrawer, equilibriumData }) => {
  const containerRef = useRef(null);
  const constellationRef = useRef(null);
  const drawerRef = useRef(null);

  const [hoveredDomain, setHoveredDomain] = useState(null);
  const [hoveredNodeRect, setHoveredNodeRect] = useState(null);
  const [isCardHovered, setIsCardHovered] = useState(false);
  const hoverEnterTimerRef = useRef(null);
  const hoverExitTimerRef = useRef(null);

  const [selectedDomain, setSelectedDomain] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
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

  const [isPillHovered, setIsPillHovered] = useState(false);
  const [isEquilibriumActive, setIsEquilibriumActive] = useState(false);
  const equilibriumExitTimerRef = useRef(null);

  const domains = useMemo(() => {
    if (!equilibriumData?.domains || !Array.isArray(equilibriumData.domains) || equilibriumData.domains.length === 0) return MOCK_DOMAINS;
    const result = (equilibriumData.domains || []).map(d => {
      if (!d || !d.id) return null;
      const key = d.id;
      const mock = MOCK_DOMAINS.find(m => m.id === key);
      return { id: key, title: d.title || mock?.title || key, posture: d.posture || '', trend: d.trend || 'stable', confidence_pct: typeof d.confidence === 'number' ? d.confidence : 50, strength: typeof d.confidence === 'number' ? d.confidence / 100 : 0.5, confidence_label: d.confidence >= 70 ? 'Strong signal' : d.confidence >= 40 ? 'Moderate signal' : 'Weak signal', summary: d.posture || '', insight: d.insight || '', downstream_effects: Array.isArray(d.signals) ? d.signals.map(s => ({ title: s.headline || '', tags: Array.isArray(s.tags) ? s.tags : [] })) : [], actionable: Array.isArray(d.actions) ? { horizon: d.action_timeframe || '', conviction: d.action_urgency || 'Moderate', directives: d.actions } : null, footer: { primary_cta: { label: 'View detailed analysis', route: `/${key}` }, secondary_link: { label: 'View timeline', route: `/timeline/${key}` }, timestamp: equilibriumData.as_of || new Date().toISOString() }, last_updated_iso: equilibriumData.as_of || new Date().toISOString(), sparkline: mock?.sparkline || [], confidenceDelta: 0 };
    });
  }, [equilibriumData]);

  const getGlobalScale = useCallback(() => {
    if (viewportSize === 'sm') return TOKENS.HORIZON.globalScaleSm;
    if (viewportSize === 'md') return TOKENS.HORIZON.globalScaleMd;
    return TOKENS.HORIZON.globalScale;
  }, [viewportSize]);

  const dominantDriver = useMemo(() => {
    if (equilibriumData?.dominant_force) return equilibriumData.dominant_force;
    const maxStrength = Math.max(...domains.map(d => d.strength));
    const dominant = domains.find(d => d.strength === maxStrength);
    if (maxStrength < 0.65) return "balanced";
    const sortedByStrength = [...domains].sort((a, b) => b.strength - a.strength);
    if (sortedByStrength[0].strength - sortedByStrength[1].strength < 0.1) return "balanced";
    return dominant.id;
  }, [domains, equilibriumData]);

  const balanceBias = useMemo(() => {
    if (equilibriumData?.equilibrium_score != null) return equilibriumData.equilibrium_score / 100;
    if (dominantDriver === "balanced") return 0.5;
    const dominant = domains.find(d => d.id === dominantDriver);
    const normalizedStrength = Math.min(Math.max((dominant.strength - 0.5) / (1.0 - 0.5), 0), 1);
    if (dominant.id === "rates" || dominant.id === "geopolitics") return 0.5 - (normalizedStrength * 0.5);
    return 0.5 + (normalizedStrength * 0.5);
  }, [dominantDriver, domains, equilibriumData]);

  const globalSummary = useMemo(() => {
    if (equilibriumData?.summary) return equilibriumData.summary;
    if (dominantDriver === "balanced") return `Market forces in near-perfect balance; tactical opportunities across sectors.`;
    const dominant = domains.find(d => d.id === dominantDriver);
    return `${dominant.title.split(' ')[0]} dynamics are pulling the market with ${Math.round(dominant.strength * 100)}% conviction.`;
  }, [domains, dominantDriver, equilibriumData]);

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
    const safeH = dimensions.height; // Use the direct height of the orb-cluster-visual
    const centerX = dimensions.width / 2;
    const centerY = (safeH / 2) + (safeH * TOKENS.HORIZON.clusterOffsetY / 100);
    const baseRadius = Math.min(safeW, safeH) * 0.34 * TOKENS.HORIZON.orbitRadiusScale * globalScale;
    const shortH = window.innerHeight <= 820;
    const radius = baseRadius * (shortH ? 0.92 : 1.00) * orbitScale;

    return { cx: centerX, cy: centerY, orbitBaseRadius: radius };
  }, [dimensions, orbitScale, getGlobalScale]);

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

  const getLabelPosition = useCallback((orbX, orbY, orbRadius, domainId) => {
    const vx = orbX - cx;
    const vy = orbY - cy;
    const norm = Math.hypot(vx, vy) || 1;
    // Push label far enough outside the orb so it never overlaps
    // orbRadius covers the orb edge, +40px clears the bloom/halo, +16px is breathing room
    const offset = orbRadius + 40 + 16;
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
    if (confidence_pct >= 75) return "Strong signal";
    if (confidence_pct >= 65) return "Moderate signal";
    if (confidence_pct >= 55) return "Weak signal";
    return "Very weak signal";
  }, []);

  const handleDomainHoverEnter = useCallback((domain, event) => {
    if (isEquilibriumActive) return; // BLOCK hero interactions when equilibrium is active
    
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
  }, [isEquilibriumActive]);

  const handleDomainHoverLeave = useCallback(() => {
    if (isEquilibriumActive) return; // BLOCK hero interactions when equilibrium is active
    
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
  }, [isCardHovered, isEquilibriumActive]);

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
      if (!containerRef.current || shouldReduceMotion || isEquilibriumActive) return; // BLOCK parallax when equilibrium active
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
  }, [shouldReduceMotion, selectedDomain, mouseX, mouseY, glassParallaxX, glassParallaxY, isEquilibriumActive]);

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
        // Set dimensions to match the orb-cluster-visual's fixed height of 500px
        setDimensions({ width: rect.width, height: 500 });
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

  // Cleanup equilibrium exit timer on unmount
  useEffect(() => {
    return () => {
      if (equilibriumExitTimerRef.current) {
        clearTimeout(equilibriumExitTimerRef.current);
      }
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
    <motion.section 
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} 
      aria-label="Equilibrium" 
      style={{ 
        maxWidth: '84vw', 
        margin: '0 auto',
        position: 'relative',
        isolation: 'isolate'
      }}
    >
      <div className="flex items-center justify-between mb-6 pl-2">
         <div className="flex items-center space-x-3">
           <div>
             <h2 style={{ fontSize: '18px', lineHeight: '24px', fontWeight: 600, color: TOKENS.colors.textPrimary, fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>Equilibrium</h2>
             <p style={{ fontSize: '13px', color: TOKENS.colors.textTertiary, letterSpacing: '0.2em', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>Real-time balance of global macro forces.</p>
           </div>
         </div>

        {/* LIQUID GLASS PILL — POWERED BY LYRA */}
        <motion.div
          className="powered-by-lyra-pill"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{
            opacity: 1,
            scale: isPillHovered ? 1.03 : 1,
            y: isPillHovered ? -1.5 : 0,
            filter: isPillHovered ? 'brightness(1.08)' : 'brightness(1)'
          }}
          transition={{
            scale: { duration: 0.18, ease: MOTION_TOKENS.CURVES.horizonIn },
            y: { duration: 0.18, ease: MOTION_TOKENS.CURVES.horizonIn },
            filter: { duration: 0.18, ease: MOTION_TOKENS.CURVES.horizonIn },
            border: { duration: 0.18, ease: MOTION_TOKENS.CURVES.horizonIn },
            boxShadow: { duration: 0.18, ease: MOTION_TOKENS.CURVES.horizonIn }
          }}
          onHoverStart={() => setIsPillHovered(true)}
          onHoverEnd={() => setIsPillHovered(false)}
          whileTap={shouldReduceMotion ? {} : {
            scale: 0.98,
            y: 0,
            filter: 'brightness(0.94)',
            transition: {
              duration: MOTION_TOKENS.DURATIONS.microPulse,
              ease: MOTION_TOKENS.CURVES.horizonOut
            }
          }}
          style={{
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: 'clamp(7px, 1vw, 9px) clamp(16px, 2vw, 20px)',
            borderRadius: '999px',
            cursor: 'pointer',
            overflow: 'hidden',
            background: 'linear-gradient(180deg, rgba(14, 18, 26, 0.62) 0%, rgba(10, 13, 20, 0.68) 100%)',
            backdropFilter: 'blur(16px) saturate(140%)',
            WebkitBackdropFilter: 'blur(16px) saturate(140%)',
            border: isPillHovered ? '1px solid rgba(160, 191, 255, 0.35)' : '1px solid rgba(160, 191, 255, 0.22)',
            boxShadow: isPillHovered
              ? `0 6px 24px rgba(0, 0, 0, 0.30), 0 0 18px rgba(106, 199, 247, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.18)`
              : `0 4px 16px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.12)`,
            willChange: 'transform, filter, box-shadow'
          }}
          role="button"
          aria-label="Powered by Ori AI"
          tabIndex={0}
        >
          {/* Ambient Inner Glow */}
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at 50% 20%, rgba(106, 199, 247, 0.08) 0%, transparent 70%)',
              pointerEvents: 'none',
              borderRadius: '999px'
            }}
            animate={{
              opacity: isPillHovered ? [0.7, 0.9, 0.7] : [0.6, 0.8, 0.6]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />

          {/* Content Layer */}
          <motion.div
            className="flex items-center gap-2"
            style={{ position: 'relative', zIndex: 1 }}
            animate={{
              x: isPillHovered ? -0.5 : 0
            }}
            transition={{
              duration: 0.16,
              ease: [0.22, 1, 0.36, 1]
            }}
          >
            <span
              className="text-xs font-medium"
              style={{
                color: 'rgba(255, 255, 255, 0.65)',
                letterSpacing: '0.3px',
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                fontSize: 'clamp(10px, 1.2vw, 11.5px)'
              }}
            >
              Powered by
            </span>
            <LyraLogo className="w-5 h-5" style={{ flexShrink: 0 }} />
            <span
              className="font-bold"
              style={{
                color: TOKENS.colors.textPrimary,
                fontSize: 'clamp(12px, 1.4vw, 13.5px)',
                letterSpacing: '-0.01em',
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'
              }}
            >
              Ori
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* OS HORIZON V4.0 — EQUILIBRIUM STACK CONTAINER (AUTO-LAYOUT) */}
      <div
        className="equilibrium-stack-container"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'clamp(48px, 8vw, 96px)',
          width: '100%',
          height: 'auto',
          minHeight: '600px',
          paddingTop: '48px',
          paddingBottom: '48px',
          background: `linear-gradient(184deg, ${TOKENS.HORIZON.bgBase} 0%, ${TOKENS.HORIZON.bgEnd} 100%)`,
          border: '1px solid rgba(160,191,255,0.08)',
          borderRadius: '24px',
          position: 'relative',
          overflow: 'visible',
          pointerEvents: 'none'
        }}
      >
        {/* ORB CLUSTER VISUAL (FIXED HEIGHT + BOTTOM BOUNDARY) */}
        <div
          ref={containerRef}
          className={`orb-cluster-visual ${isEquilibriumActive ? 'hero-orbs-muted' : ''}`}
          data-dominant={dominantDriver}
          style={{
            position: 'relative',
            width: '100%',
            height: '500px', // Fixed height for the visual area
            maxHeight: '500px',
            overflow: 'hidden', // CRITICAL: Prevents orbs/glow from bleeding into equilibrium area
            pointerEvents: isEquilibriumActive ? 'none' : 'auto', // DISABLE all hero interactions when equilibrium is active
            opacity: isEquilibriumActive ? 0.6 : 1, // Visual de-emphasis when equilibrium is active
            filter: isEquilibriumActive ? 'brightness(0.7) saturate(0.8)' : 'brightness(1) saturate(1)',
            transition: 'opacity 0.2s ease-out, filter 0.2s ease-out'
          }}
        >
          {/* UNIFIED SMOOTH BACKGROUND — Single seamless gradient */}
          <div
            className="equilibrium-unified-background"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: `
                radial-gradient(
                  ellipse 850px 520px at 50% 46%, 
                  rgba(18, 24, 35, 0.68) 0%, 
                  rgba(14, 18, 26, 0.52) 35%, 
                  rgba(11, 14, 19, 0.35) 58%, 
                  rgba(7, 10, 15, 0.18) 75%, 
                  transparent 100%
                )
              `,
              borderRadius: '24px',
              pointerEvents: 'none',
              zIndex: 1
            }}
            aria-hidden="true"
          />

          {/* NOISE TEXTURE — SINGLE LAYER */}
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
              backgroundSize: '200px 200px',
              opacity: 0.15,
              borderRadius: '24px',
              pointerEvents: 'none',
              zIndex: 3
            }}
            animate={{ backgroundPosition: [`${noiseDrift}px 0px`, `${noiseDrift + 0.3}px 0px`] }}
            transition={{ duration: 1, ease: 'linear' }}
          />

          {/* VIGNETTE — SINGLE UNIFORM LAYER */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(ellipse at center, transparent 55%, ${TOKENS.HORIZON.vignetteColor} 100%)`,
              opacity: TOKENS.HORIZON.vignetteOpacity,
              filter: `blur(${TOKENS.HORIZON.vignetteBlur}px)`,
              borderRadius: '24px',
              pointerEvents: 'none',
              zIndex: 4
            }}
          />

          {/* BLOOM HALOS (BENEATH CONSTELLATION) */}
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
                    zIndex: 5
                  }}
                />
                {isActiveOrb && (
                  <motion.div
                    className="orb-halo"
                    animate={{ opacity: [0.15, 0.22, 0.15], scale: [1, 1.12, 1] }}
                    transition={{ opacity: { duration: 4, repeat: Infinity, ease: 'easeInOut' }, scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' } }}
                    style={{ position: 'absolute', left: pos.x, top: pos.y, width: bloomRadius * 2.3, height: bloomRadius * 2.3, transform: 'translate(-50%, -50%)', background: `radial-gradient(circle, ${getDomainBloom(domain.id)} 0%, transparent 65%)`, filter: 'blur(28px)', mixBlendMode: 'screen', pointerEvents: 'none', zIndex: 5 }}
                  />
                )}
              </React.Fragment>
            );
          })}

          {/* SELECTED DOMAIN AMBIENT GLOW (STATIC) */}
          <motion.div className="glow-overlay" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 6 }} animate={{ x: shouldReduceMotion ? 0 : parallaxX.get() * TOKENS.HORIZON.parallaxOffset * 0.15, y: shouldReduceMotion ? 0 : parallaxY.get() * TOKENS.HORIZON.parallaxOffset * 0.15 }} transition={{ duration: TOKENS.HORIZON.t_parallax, ease: TOKENS.HORIZON.easingApple }}>
            {selectedDomain && (
              <motion.div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '100%',
                  height: '100%',
                  background: `radial-gradient(circle at center, ${getDomainBloom(selectedDomain.id)} 0%, transparent 60%)`,
                  opacity: 0.1,
                  filter: 'blur(80px)',
                  pointerEvents: 'none',
                  mixBlendMode: 'screen'
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              />
            )}
          </motion.div>

          {/* CONSTELLATION LAYER — PARALLAX APPLIES HERE */}
          <motion.div
            ref={constellationRef}
            style={{
              position: 'absolute',
              inset: 0,
              willChange: 'transform',
              zIndex: 10,
              opacity: selectedDomain ? 0.9 : 1,
              pointerEvents: 'auto'
            }}
            animate={{
              y: constellationShift,
              x: shouldReduceMotion ? 0 : parallaxX.get() * TOKENS.HORIZON.parallaxResponse
            }}
            transition={{
              y: { duration: shouldReduceMotion ? 0 : 0.4, ease: TOKENS.HORIZON.easing },
              x: { duration: shouldReduceMotion ? 0 : TOKENS.HORIZON.t_parallax, ease: TOKENS.HORIZON.easingApple }
            }}
          >
            {/* ORBIT RING */}
            <div style={{ position: 'absolute', left: `${cx}px`, top: `${cy}px`, width: `${orbitBaseRadius * 2}px`, height: `${orbitBaseRadius * 2}px`, transform: 'translate(-50%, -50%)', borderRadius: '999px', boxShadow: 'inset 0 0 0 1px rgba(160,191,255,0.06)', opacity: 0.2, filter: 'blur(0.5px)', pointerEvents: 'none', zIndex: 1, transition: shouldReduceMotion ? 'none' : 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }} aria-hidden="true" />

            {/* CENTRAL NUCLEUS */}
            <motion.div style={{ position: 'absolute', left: `${cx}px`, top: `${cy}px`, zIndex: 2, pointerEvents: 'none' }} animate={{ x: nucleusOffset.x, y: nucleusOffset.y }} transition={{ duration: 0.8, ease: TOKENS.HORIZON.easing }}>
              <motion.div style={{ position: 'absolute', left: 0, top: 0, transform: 'translate(-50%, -50%)', width: `${22 * getGlobalScale()}px`, height: `${22 * getGlobalScale()}px`, borderRadius: '999px', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', background: 'rgba(160,191,255,0.12)', boxShadow: '0 0 80px rgba(160,191,255,0.15), inset 0 0 0 1px rgba(255,255,255,0.08)', pointerEvents: 'none' }} animate={shouldReduceMotion ? {} : { scale: [0.985, 1.025, 0.985], opacity: [0.985, 1, 0.985] }} transition={{ duration: TOKENS.HORIZON.t_breathe, repeat: Infinity, ease: "easeInOut" }} aria-hidden="true" />
              {domains.map((d) => <motion.div key={`ray-${d.id}`} style={{ position: 'absolute', left: 0, top: 0, width: '28%', height: '2px', transformOrigin: 'left center', borderRadius: '999px', background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.45))', pointerEvents: 'none' }} animate={{ rotate: ANGLES[d.id], opacity: d.id === dominantDriver ? 0.5 : 0.15 }} transition={{ duration: 0.8, ease: TOKENS.HORIZON.easing }} />)}
            </motion.div>

            {/* SVG LAYER — CONNECTIONS + ORBS */}
            <svg width={dimensions.width} height={dimensions.height} style={{ position: 'absolute', inset: 0, overflow: 'visible', zIndex: 3, pointerEvents: 'none' }}>
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
                  if (!from || !to) return null;
                  const fromPos = getOrbPosition(conn.from, from.strength, swayTime, parallaxX.get(), parallaxY.get()); const toPos = getOrbPosition(conn.to, to.strength, swayTime, parallaxX.get(), parallaxY.get());
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

            {/* Hover Card Portal */}
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

            {/* LABELS */}
            {domains.map((domain) => {
              const orbPos = getOrbPosition(domain.id, domain.strength, swayTime, parallaxX.get(), parallaxY.get());
              const labelPos = getLabelPosition(orbPos.x, orbPos.y, orbPos.radius, domain.id);
              const isHovered = hoveredDomain === domain.id;
              const isSelected = selectedDomain?.id === domain.id;
              
              const labelText = {
                fx: 'Housing',
                rates: 'Savings & Returns',
                growth: 'Borrowing Costs',
                geopolitics: 'Job Market'
              }[domain.id] || domain.id;

              return (
                <motion.div key={`label-${domain.id}`} style={{ position: 'absolute', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', background: 'rgba(10,14,20,0.50)', border: `1px solid ${TOKENS.HORIZON.glassBorder}`, borderRadius: '10px', padding: '6px 11px', fontWeight: 500, fontSize: '12px', letterSpacing: '0.02em', textShadow: '0 1px 2px rgba(0,0,0,0.4)', pointerEvents: 'none', zIndex: 11, fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }} animate={{ left: `${labelPos.x}px`, top: `${labelPos.y}px`, x: '-50%', y: '-50%', color: isHovered || isSelected ? TOKENS.colors.textLabel : getDomainText(domain.id), scale: isHovered || isSelected ? 1.05 : 1, boxShadow: isHovered || isSelected ? '0 0 16px rgba(160,191,255,0.15)' : 'none' }} transition={{ left: { duration: TOKENS.HORIZON.t_labelLag, ease: TOKENS.HORIZON.easingApple }, top: { duration: TOKENS.HORIZON.t_labelLag, ease: TOKENS.HORIZON.easingApple }, color: { duration: TOKENS.HORIZON.t_hover, ease: TOKENS.HORIZON.easing }, scale: { duration: TOKENS.HORIZON.t_hover, ease: TOKENS.HORIZON.easing }, boxShadow: { duration: TOKENS.HORIZON.t_hover, ease: TOKENS.HORIZON.easing } }}>
                {labelText}
              </motion.div>
              );
          })}
        </motion.div>
      </div>

        {/* GLOBAL EQUILIBRIUM FOCUS REGION (CARD + HOVER MENU) */}
        <div
          className="equilibrium-focus-region"
          onPointerEnter={() => {
            // Clear any pending exit timer
            if (equilibriumExitTimerRef.current) {
              clearTimeout(equilibriumExitTimerRef.current);
              equilibriumExitTimerRef.current = null;
            }
            
            // Activate equilibrium state
            setIsEquilibriumActive(true);
            
            // Immediately close any open hero tooltips
            if (hoveredDomain) {
              setHoveredDomain(null);
              setHoveredNodeRect(null);
              setIsCardHovered(false);
            }
            if (hoverEnterTimerRef.current) {
              clearTimeout(hoverEnterTimerRef.current);
              hoverEnterTimerRef.current = null;
            }
            if (hoverExitTimerRef.current) {
              clearTimeout(hoverExitTimerRef.current);
              hoverExitTimerRef.current = null;
            }
          }}
          onPointerLeave={() => {
            // Set timer to deactivate after delay (prevents flicker on quick re-entry)
            if (equilibriumExitTimerRef.current) {
              clearTimeout(equilibriumExitTimerRef.current);
            }
            
            equilibriumExitTimerRef.current = setTimeout(() => {
              setIsEquilibriumActive(false);
            }, 150); // 150ms delay to prevent flickering
          }}
          style={{
            position: 'relative',
            width: '72%',
            maxWidth: '900px',
            zIndex: 4,
            pointerEvents: 'auto', // Re-enable pointer events for equilibrium region
            paddingTop: '12px', // Padding to prevent hit-test gap between menu and card
            paddingBottom: '12px'
          }}
        >
          <EquilibriumPulse
            equilibriumScore={balanceBias}
            volatility={equilibriumData?.volatility != null ? equilibriumData.volatility / 100 : 0.3 + (Math.abs(balanceBias - 0.5) * 0.4)}
            dominantForce={dominantDriver}
            forces={equilibriumData?.forces ? { growth: equilibriumData.forces.growth / 100, rates: equilibriumData.forces.rates / 100, fx: equilibriumData.forces.fx / 100, geopolitics: equilibriumData.forces.geopolitics / 100 } : { growth: domains.find(d => d.id === 'growth')?.strength || 0, rates: -(domains.find(d => d.id === 'rates')?.strength || 0), fx: (domains.find(d => d.id === 'fx')?.strength || 0) * 0.5, geopolitics: -(domains.find(d => d.id === 'geopolitics')?.strength || 0) }}
            stabilityIndex={equilibriumData?.stability_index != null ? equilibriumData.stability_index : (dominantDriver === 'balanced' ? 85 : Math.round(75 - (Math.abs(balanceBias - 0.5) * 50)))}
            summary={globalSummary}
            lyraInsight={equilibriumData?.lyra_insight}
            stateLabel={equilibriumData?.state_label}
            onOpenDrawer={() => console.log('Equilibrium drawer requested')}
            isEquilibriumActive={isEquilibriumActive}
          />
        </div>
      </div>

      <div className="flex justify-center" style={{ marginTop: '10px' }}>
        <p style={{ fontSize: '9px', fontWeight: 400, color: TOKENS.colors.textTertiary, opacity: 0.55, fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>Data via Ori models</p>
      </div>

      {/* EXPANSION DRAWER — ANCHORED INSIDE ORB CLUSTER */}
      <AnimatePresence>
        {selectedDomain && !isSwitchingNode && containerRef.current && (() => {
          return (
            <>
              {/* Local Overlay within Section */}
              <motion.div
                className="absolute z-40"
                style={{
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(6,8,13,0.65)',
                  backdropFilter: 'blur(8px) brightness(0.92)',
                  WebkitBackdropFilter: 'blur(8px) brightness(0.92)',
                  pointerEvents: 'auto',
                  borderRadius: '24px'
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={handleCloseDrawer}
              />

              {/* Anchored Expansion Panel */}
              <motion.div
                ref={drawerRef}
                className="absolute z-50 flex flex-col drawer-with-header-safe"
                role="dialog"
                aria-modal="true"
                aria-label={`${selectedDomain.title} detailed analysis`}
                style={{
                  top: `${cy}px`,
                  left: `${cx}px`,
                  transform: 'translate(-50%, -50%)',
                  width: '520px',
                  maxWidth: 'calc(100% - 48px)',
                  maxHeight: '500px',
                  overflow: 'hidden',
                  backdropFilter: TOKENS.HORIZON.drawerBlur,
                  WebkitBackdropFilter: TOKENS.HORIZON.drawerBlur,
                  background: TOKENS.HORIZON.drawerGlass,
                  border: `1px solid ${TOKENS.HORIZON.glassBorder}`,
                  boxShadow: `0 0 60px rgba(0, 0, 0, 0.15), ${TOKENS.HORIZON.panelShadow}, 0 0 12px ${TOKENS.HORIZON.drawerEdgeBloom}, inset 0 0 0 1px rgba(255,255,255,0.10)`,
                  borderRadius: '24px',
                  filter: `brightness(${drawerLuminance})`,
                  pointerEvents: 'auto'
                }}
              initial={{
                scale: 0.92,
                opacity: 0
              }}
              animate={{
                scale: 1,
                opacity: 1,
                transition: {
                  duration: MOTION_TOKENS.DURATIONS.drawerInhale,
                  ease: MOTION_TOKENS.CURVES.drawerInhale
                }
              }}
              exit={{
                scale: 0.94,
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
              className="flex-shrink-0 p-3 border-b"
              style={{
                background: TOKENS.HORIZON.drawerTint,
                borderColor: TOKENS.HORIZON.drawerDivider,
                backdropFilter: getBlur('chip'),
                position: 'relative',
                zIndex: 10,
                overflow: 'visible'
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
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-4">
                  <motion.div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
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
                      fontSize: '17px',
                      fontWeight: 600,
                      lineHeight: '1.2',
                      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                      letterSpacing: '-0.01em',
                      marginBottom: '4px'
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
                <div className="relative w-9 h-9">
                  <svg className="transform -rotate-90" width="36" height="36">
                    <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2.5" />
                    <motion.circle
                      cx="18" cy="18" r="15" fill="none"
                      stroke={getDomainColor(selectedDomain.id)}
                      strokeWidth="2.5" strokeLinecap="round"
                      strokeDasharray="94"
                      initial={{ strokeDashoffset: 94, opacity: 0.9 }}
                      animate={{ strokeDashoffset: 94 - (94 * selectedDomain.confidence_pct / 100), opacity: 0.98 }}
                      transition={{ duration: 0.6, delay: 0.2, ease: MOTION_TOKENS.CURVES.horizonIn }}
                      style={{ filter: `drop-shadow(0 0 6px ${getDomainBloom(selectedDomain.id)})` }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-bold" style={{ color: TOKENS.colors.textPrimary, fontSize: '11px' }}>
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
              className="overflow-y-auto"
              style={{ 
                position: 'relative', 
                zIndex: 2, 
                paddingLeft: '20px', 
                paddingRight: '20px', 
                paddingTop: '16px', 
                paddingBottom: '16px', 
                overflowX: 'hidden'
              }}
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
                style={{ marginBottom: '12px' }}
              >
                <h4 style={{
                  color: 'rgba(255,255,255,0.68)',
                  fontSize: '11px',
                  fontWeight: 600,
                  marginBottom: '6px',
                  lineHeight: '1.3',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase'
                }}>
                  What It Means
                </h4>
                <p style={{
                  color: TOKENS.colors.textBody,
                  fontSize: '13px',
                  lineHeight: '1.55',
                  fontWeight: 400,
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word'
                }}>
                  {selectedDomain.summary}
                </p>
                {selectedDomain.addendum && (
                  <p style={{
                    color: TOKENS.colors.textSecondary,
                    fontSize: '12px',
                    marginTop: '10px',
                    opacity: 0.85,
                    lineHeight: '1.5',
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
                style={{ marginBottom: '18px' }}
              >
                <h4 style={{
                  color: 'rgba(255,255,255,0.68)',
                  fontSize: '11px',
                  fontWeight: 600,
                  marginBottom: '10px',
                  lineHeight: '1.3',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase'
                }}>
                  What Happens Next
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
                        borderRadius: '10px',
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
                          fontSize: '12.5px',
                          lineHeight: '1.4',
                          fontWeight: 500,
                          marginBottom: '5px'
                        }}>
                          {effect.title}
                        </p>
                        <div style={{
                          fontSize: '10px',
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
                className="p-3 rounded-2xl relative overflow-hidden"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '12px',
                  boxShadow: `inset 0 0 20px ${getDomainGlow(selectedDomain.id)}`,
                  padding: '14px 16px',
                  marginBottom: '16px'
                }}
                whileHover={shouldReduceMotion ? {} : {
                  filter: 'brightness(1.03)',
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

                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold" style={{
                    color: 'rgba(255,255,255,0.68)',
                    letterSpacing: '0.12em',
                    fontSize: '10px',
                    lineHeight: '1.3',
                    fontWeight: 600,
                    textTransform: 'uppercase'
                  }}>
                    What You Should Do
                  </p>
                  <div className="flex items-center gap-3 text-xs">
                    <span style={{ color: 'rgba(255, 255, 255, 0.58)', fontSize: '12px' }}>
                      {selectedDomain.actionable.horizon}
                    </span>
                    <span
                      className="px-2.5 py-1 rounded-full text-[10px] font-semibold"
                      style={{
                        background: selectedDomain.actionable.conviction === 'Strong'
                          ? 'rgba(88, 227, 164, 0.15)'
                          : selectedDomain.actionable.conviction === 'Moderate'
                            ? 'rgba(90, 160, 255, 0.15)'
                            : 'rgba(255, 255, 255, 0.10)',
                        color: selectedDomain.actionable.conviction === 'Strong'
                          ? 'rgba(88, 227, 164, 0.95)'
                          : selectedDomain.actionable.conviction === 'Moderate'
                            ? 'rgba(90, 160, 255, 0.95)'
                            : 'rgba(255, 255, 255, 0.75)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        letterSpacing: '0.03em'
                      }}
                    >
                      {selectedDomain.actionable.conviction}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
                        marginTop: '5px',
                        flexShrink: 0,
                        boxShadow: `0 0 6px ${getDomainBloom(selectedDomain.id)}`
                      }} />
                      <p style={{
                        color: 'rgba(220, 230, 240, 0.96)',
                        fontSize: '12.5px',
                        lineHeight: '1.5',
                        fontWeight: 400,
                        flex: 1,
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word'
                      }}>
                        {directive}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* FIXED FOOTER */}
            <motion.div
              className="flex-shrink-0 border-t"
              style={{
                background: TOKENS.HORIZON.drawerTint,
                borderColor: TOKENS.HORIZON.drawerDivider,
                backdropFilter: getBlur('panel'),
                zIndex: 10,
                paddingLeft: '16px',
                paddingRight: '16px',
                paddingTop: '12px',
                paddingBottom: '12px',
                overflow: 'visible'
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
            </>
          );
        })()}
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

        html.transitions-enabled *:not([data-no-transition]) {
          transition: background-color 150ms ease, color 150ms ease, border-color 150ms ease, opacity 200ms ease, transform 200ms ease, box-shadow 200ms ease;
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
        .orb-cluster-visual {
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

        /* Ensure .orb-cluster-visual manages pointer events correctly */
        .orb-cluster-visual {
            pointer-events: all;
        }

        /* OS HORIZON V4.0 — HERO MUTED STATE */
        .hero-orbs-muted {
          pointer-events: none !important;
        }

        .hero-orbs-muted .orb-nucleus {
          pointer-events: none !important;
          cursor: default !important;
        }

        .hero-orbs-muted .orb-halo,
        .hero-orbs-muted .link-path {
          opacity: 0.5 !important;
        }
      `}</style>
    </motion.section>
  );
};

export default MacroConstellation;