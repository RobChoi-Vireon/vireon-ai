// 🔒 DESIGN LOCKED — OS HORIZON V4.0
// Last Updated: 2025-01-20
// Do not modify visual design without explicit assignment
// See: DESIGN_LOCKED_COMPONENTS.md

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, Scale, Globe, Info, Target, BookOpen, Activity, GitBranch, Lightbulb, Sparkles, ChevronLeft, ChevronRight, TrendingDown, TrendingUp, Building, AlertTriangle, ShieldCheck, Minus, Plus, Landmark, Package, Home, Construction, Banknote, Clock } from 'lucide-react';
import SignalEquilibriumBar from './SignalEquilibriumBar';

// ============================================================================
// HORIZON OS TOKENS + LIVING INTELLIGENCE + v1.1 + v1.2 IA + v1.3 FINAL POLISH + v1.5 READABILITY
// ============================================================================
const HORIZON = {
  glass: {
    base: 'rgba(24, 26, 29, 0.55)',
    tint: 'rgba(10, 10, 10, 0.42)',
    border: 'rgba(255, 255, 255, 0.06)',
    subsurface: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0.12) 100%)',
    radius: 20,
    blur: 26,
    shadow: '0 20px 60px rgba(0, 0, 0, 0.40)',
    topFalloff: 0.03,
  },
  type: {
    h1: { size: 22, weight: 600, tracking: -0.03, opacity: 0.92 },
    h2: { size: 18, weight: 600, tracking: -0.02, opacity: 0.88 },
    body: { size: 15, weight: 400, lh: 1.55, opacity: 0.82 },
    meta: { size: 12, weight: 500, tracking: 0.06, opacity: 0.65 },
    label: { size: 13, weight: 600, tracking: 0.04, opacity: 0.70 },
    drawerTitle: { size: 15.5, lh: 20, weight: 600, opacity: 0.70 },
    headline: { size: 16.5, lh: 24, weight: 600, opacity: 0.90 },
    takeaway: { size: 14.5, lh: 22, weight: 500, opacity: 0.90 },
    translation: { size: 13.5, lh: 20, weight: 500, opacity: 0.82 },
    confidence: { size: 13, lh: 18, weight: 500, opacity: 0.75 },
    ripple: { size: 14, lh: 20, weight: 500, opacity: 0.82 }, // Changed from 12.5, 18, 0.70
    context: { size: 12.5, lh: 18, weight: 400, opacity: 0.70 },
    takeawayCard: { size: 14, lh: 22, weight: 600, opacity: 0.90 },
  },
  color: {
    risk: '#F26A6A',
    opportunity: '#2ECF8D',
    neutral: '#5EA7FF',
    accent: '#7DD3FC',
    textBodyDark: 'rgba(255, 255, 255, 0.90)',
    textSecondaryDark: 'rgba(255, 255, 255, 0.75)',
    textTertiaryDark: 'rgba(255, 255, 255, 0.65)',
    textBodyLight: 'rgba(18, 18, 18, 0.90)',
    textSecondaryLight: 'rgba(18, 18, 18, 0.72)',
  },
  spacing: {
    blockGap: 12,
    sectionGap: 20,
    headlineToTakeaway: 8,
    takeawayToTranslation: 6,
    confidenceToImpact: 12,
    impactToRipple: 24, // Changed from 18 to 24
    sectionToContext: 16,
  },
  motion: {
    ease: [0.18, 0.82, 0.23, 1],
    ease_io: [0.4, 0, 0.2, 1],
    dur: { open: 260, close: 260, toggle: 200, fast: 120, med: 180 },
  },
  ri: {
    gapLg: '20px',
    gapMd: '12px',
    gapTighten: '-8px',
    cardGapExtra: '6px',
    riskTint: 'rgba(255, 60, 60, 0.08)',
    opptyTint: 'rgba(60, 220, 160, 0.08)',
    neutralTint: 'rgba(140, 170, 200, 0.06)',
    riskRim: '0 0 0 1px rgba(255,90,90,0.35), 0 8px 30px rgba(255,60,60,0.20)',
    opptyRim: '0 0 0 1px rgba(70,230,170,0.35), 0 8px 30px rgba(60,220,160,0.18)',
  },
  li: {
    haloRisk: 'rgba(255,75,75,0.25)',
    haloOppty: 'rgba(60,240,180,0.25)',
    haloNeutral: 'rgba(160,190,230,0.2)',
    aiVoice: 'rgba(90,150,255,0.35)',
  },
  polish: {
    toggleInactiveOpacity: 0.7,
    toggleBloomDuration: 160,
    barGradient: 0.03,
  },
  ia: {
    macroPostureOpacity: 0.70,
    sectionDividerOpacity: 0.04,
    categoryGlowAccent: 0.03,
  },
  mission: { // New mission object
    signalGlowStrength: 0.08,
    dividerOpacity: 0.04,
    netImpactSheen: 0.05,
    tooltipFadeDuration: 120,
    hoverScaleImpact: 1.015,
    takeawayFadeDuration: 120,
    timestampRecencyGreen: '#33ffb3',
    timestampRecencyYellow: '#ffd966',
    timestampRecencyGray: '#9aa0a6',
  }
};

// ============================================================================
// CONFIDENCE RING COMPONENT (WITH BREATHING)
// ============================================================================
const ConfidenceRing = ({ value, color, size = 42, sentiment = 'neutral' }) => {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldReduceMotion(mediaQuery.matches);
    const handler = (e) => setShouldReduceMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div 
      className={`relative inline-flex confidence-ring ${!shouldReduceMotion ? 'hzn-confidence-ring' : ''}`} 
      style={{ width: size, height: size }}
      data-sentiment={sentiment}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="3"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{
            strokeDashoffset: shouldReduceMotion ? offset : offset,
          }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : {
                  duration: 0.8,
                  ease: HORIZON.motion.ease,
                  delay: 0.4,
                }
          }
        />
      </svg>
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          fontSize: 14,
          fontWeight: 700,
          color,
          letterSpacing: '-0.02em',
        }}
      >
        {value}
      </div>
    </div>
  );
};

// ============================================================================
// NARRATIVE LINK (VISUAL CONNECTOR)
// ============================================================================
const NarrativeLink = () => (
  <div 
    className="li-link"
    aria-hidden="true"
    style={{
      position: 'relative',
      margin: '16px 0',
      height: '1px',
      background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.15), rgba(255,255,255,0))',
    }}
  />
);

// ============================================================================
// SECTION DIVIDER COMPONENT
// ============================================================================
const SectionDivider = () => (
  <div 
    className="my-6"
    style={{
      height: '1px',
      background: `linear-gradient(90deg, transparent, rgba(255,255,255,${HORIZON.ia.sectionDividerOpacity}), transparent)`
    }}
    aria-hidden="true"
  />
);

// ============================================================================
// IMPACT CHIP
// ============================================================================
const ImpactChip = ({ text, tone = 'neutral' }) => {
  const styles = {
    risk: { bg: HORIZON.ri.riskTint, fg: HORIZON.color.risk },
    opportunity: { bg: HORIZON.ri.opptyTint, fg: HORIZON.color.opportunity },
    neutral: { bg: HORIZON.ri.neutralTint, fg: HORIZON.color.neutral },
  };

  const style = styles[tone] || styles.neutral;

  return (
    <div
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full"
      style={{
        background: style.bg,
        color: style.fg,
        fontSize: 13,
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </div>
  );
};

// ============================================================================
// CONTEXT TAGS (TEMPORAL AWARENESS)
// ============================================================================
const ContextTags = ({ type, ageLabel = 'Generated today' }) => (
  <div className="li-meta-tags flex items-center gap-2 mb-3">
    <span className="li-tag flex items-center gap-1.5">
      <Clock className="w-3 h-3" />
      {ageLabel}
    </span>
    <span className="li-tag flex items-center gap-1.5">
      <Target className="w-3 h-3" />
      {type} Analysis
    </span>
  </div>
);

const contextIcons = {
  TrendingDown,
  Landmark,
  Globe,
  Scale,
  Banknote,
  Package,
  Home,
  Construction,
  Building
};

// ============================================================================
// TIMESTAMP RECENCY HELPER
// ============================================================================
const getTimestampColor = (timestamp) => {
  const now = new Date();
  // Mock time parsing for demonstration. In a real app, you'd parse actual ISO strings or similar.
  // Assuming timestamp is like "HH:MM UTC" and relative to current day.
  const [timePart] = timestamp.split(' ');
  const [hoursStr] = timePart.split(':');
  const hours = parseInt(hoursStr, 10);

  // For demonstration, let's assume "now" is around 12 UTC for consistent mock output
  const currentHour = 12; // new Date().getHours();
  const diff = Math.abs(currentHour - hours);
  
  if (diff < 6) return HORIZON.mission.timestampRecencyGreen;
  if (diff < 12) return HORIZON.mission.timestampRecencyYellow;
  return HORIZON.mission.timestampRecencyGray;
};

const MemoDrawer = ({ isOpen, onClose, item, onNavigate }) => {
  const [viewMode, setViewMode] = useState('simplified');
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);
  const containerRef = useRef(null);
  const previousFocusRef = useRef(null);
  const beamRef = useRef(null);
  const scrollTimeout = useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldReduceMotion(mediaQuery.matches);
    const handler = (e) => setShouldReduceMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Handle liquid silk opening animation
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        setIsAnimatingIn(true);
      });
    } else {
      setIsAnimatingIn(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      
      setViewMode('simplified');

      const handleKeyDown = (e) => {
        if (e.target.tagName.toLowerCase() === 'input' || e.target.tagName.toLowerCase() === 'textarea') {
          return;
        }

        const key = e.key.toLowerCase();
        
        if (key === 'escape') {
          onClose?.();
        } else if (key === 'arrowleft' || (e.metaKey && key === 'arrowleft')) {
          e.preventDefault();
          onNavigate?.('prev');
        } else if (key === 'arrowright' || (e.metaKey && key === 'arrowright')) {
          e.preventDefault();
          onNavigate?.('next');
        } else if (key === 'd') {
          e.preventDefault();
          setViewMode(prev => prev === 'detailed' ? 'simplified' : 'detailed');
        }
      };
      
      document.addEventListener('keydown', handleKeyDown);
      
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
        
        if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
          previousFocusRef.current.focus();
        }
      };
    }
  }, [isOpen, onClose, onNavigate]);

  // Light beam scroll dampening
  useEffect(() => {
    const drawer = containerRef.current?.querySelector('.overflow-y-auto');
    if (!drawer || !beamRef.current) return;

    const handleScroll = () => {
      if (beamRef.current && viewMode === 'detailed') {
        beamRef.current.style.opacity = '0.02';
        clearTimeout(scrollTimeout.current);
        scrollTimeout.current = setTimeout(() => {
          if (beamRef.current && viewMode === 'detailed') {
            beamRef.current.style.opacity = '0.035';
          }
        }, 350);
      }
    };

    drawer.addEventListener('scroll', handleScroll);
    return () => {
      drawer.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [viewMode]);

  // Reset view mode when item changes
  useEffect(() => {
    if (item) {
      setViewMode('simplified');
    }
  }, [item]);

  const getTheme = (type) => {
    switch (type) {
      case 'Markets':
        return {
          Icon: DollarSign,
          primaryColor: '#34D399',
          sentiment: 'opportunity',
        };
      case 'Policy':
        return {
          Icon: Scale,
          primaryColor: '#60A5FA',
          sentiment: 'neutral',
        };
      case 'Global':
        return {
          Icon: Globe,
          primaryColor: '#F97316',
          sentiment: 'risk',
        };
      default:
        return {
          Icon: Info,
          primaryColor: '#A8B3C7',
          sentiment: 'neutral',
        };
    }
  };

  const getEnhancedAnalysis = (item) => {
    const type = item?.type || 'Analysis';
    const baseAnalysis = {
      headline_summary: "",
      morning_takeaway: "",
      translation: "",
      ripple_impact: "",
      context_points: [],
      market_impact: {
        short_term: { text: "", severity: 0.8, confidence: 0.75 },
        medium_term: { text: "", severity: 0.55, confidence: 0.65 },
        long_term: { text: "", severity: 0.30, confidence: 0.45 }
      },
      risk_opportunity: {
        risk: { text: "", confidence: 0.7 },
        opportunity: { text: "", confidence: 0.6 }
      },
      impact_tags: [],
      key_takeaway: "",
      source_count: 42,
    };

    switch (type) {
      case 'Markets':
        return {
          ...baseAnalysis,
          headline_summary: "Industrial deal flow slows as spreads widen and banks tighten underwriting standards.",
          morning_takeaway: "Refinancing cliff risk → pressures industrial credit spreads and creates downside bias for high-beta equities.",
          translation: "This means credit conditions are tightening, raising funding costs and pushing investors defensive.",
          ripple_impact: "Watch high-beta equities and industrial spreads for further downside pressure.",
          context_points: [
            { icon: 'TrendingDown', text: "Spreads widen (HY/EM +18–35 bps WoW)", color: "text-red-300" },
            { icon: 'Landmark', text: "Banks tighten underwriting criteria", color: "text-amber-300" },
            { icon: 'Globe', text: "EM credit stress emerges globally", color: "text-orange-300" }
          ],
          market_impact: {
            short_term: { text: "Monitor volatility and refinancing windows", severity: 0.8, confidence: 0.75 },
            medium_term: { text: "Potential for trend establishment in credit markets", severity: 0.55, confidence: 0.65 },
            long_term: { text: "Dependent on follow-through and macro conditions", severity: 0.30, confidence: 0.45 }
          },
          risk_opportunity: {
            risk: { text: "Refinancing cliff approaching for industrial sector, elevated execution risk in deal markets", confidence: 0.78 },
            opportunity: { text: "Potential for alpha if credit thesis proves correct, with favorable entry points emerging", confidence: 0.65 }
          },
          impact_tags: [
            { asset: "Equities", detail: "Industrials (–)", direction: "-" },
            { asset: "Credit", detail: "Spreads widen (–)", direction: "-" },
            { asset: "Rates", detail: "Neutral", direction: "=" },
            { asset: "FX", detail: "USD (+)", direction: "+" }
          ],
          key_takeaway: "Credit stress in industrials signals refinancing risks → near-term downside in high-yield exposure.",
          source_count: 38,
        };
      case 'Policy':
        return {
          ...baseAnalysis,
          headline_summary: "Regulators harden stance on big tech as bipartisan push expands audit scope and compliance requirements.",
          morning_takeaway: "Regulatory hardening raises compliance costs → downside for Big Tech multiples, hawkish Fed bias reinforced.",
          translation: "Big tech companies will spend more on compliance, reducing profit margins and stock attractiveness.",
          ripple_impact: "Next: stress may surface in tech sector margins and growth multiple compression.",
          context_points: [
            { icon: 'Scale', text: "Bipartisan push on content/privacy expands Y/Y", color: "text-blue-300" },
            { icon: 'Banknote', text: "Capex guidance reflects regulatory friction", color: "text-amber-300" },
            { icon: 'Landmark', text: "Committee signals broader enforcement runway", color: "text-purple-300" }
          ],
          market_impact: {
            short_term: { text: "Compliance drag on tech sector margins", severity: 0.85, confidence: 0.80 },
            medium_term: { text: "Structural shift in tech operating models", severity: 0.60, confidence: 0.70 },
            long_term: { text: "Regulatory framework becomes embedded cost", severity: 0.40, confidence: 0.50 }
          },
          risk_opportunity: {
            risk: { text: "Material impact on tech sector margins as compliance costs surge 40-60% across major platforms", confidence: 0.85 },
            opportunity: { text: "Potential for regulatory clarity to create competitive moats for compliant players", confidence: 0.55 }
          },
          impact_tags: [
            { asset: "Equities", detail: "Tech (–)", direction: "-" },
            { asset: "Rates", detail: "Treasuries (+)", direction: "+" },
            { asset: "FX", detail: "USD (+)", direction: "+" },
            { asset: "Credit", detail: "Neutral", direction: "=" }
          ],
          key_takeaway: "Hardened regulation lifts compliance costs → Fed bias hawkish, downside for growth tech multiples.",
          source_count: 45,
        };
      case 'Global':
        return {
          ...baseAnalysis,
          headline_summary: "China demand softens into 2026 as exports normalize and household confidence lags recovery efforts.",
          morning_takeaway: "China demand slowdown weakens commodities and EM exports → downside pressure on global growth forecasts.",
          translation: "Slower Chinese consumer spending will reduce global demand for commodities and exports.",
          ripple_impact: "Monitor commodity prices and emerging market trade volumes for weakness signals.",
          context_points: [
            { icon: 'Package', text: "Exports normalize post-reopening boost", color: "text-orange-300" },
            { icon: 'Home', text: "Household confidence lags despite stimulus", color: "text-red-300" },
            { icon: 'Construction', text: "Local infrastructure offsets narrow in 2H", color: "text-amber-300" }
          ],
          market_impact: {
            short_term: { text: "Commodity demand weakens, EM trade volumes decline", severity: 0.75, confidence: 0.70 },
            medium_term: { text: "Global supply chain adjustments accelerate", severity: 0.50, confidence: 0.60 },
            long_term: { text: "Structural shifts in global trade patterns", severity: 0.35, confidence: 0.45 }
          },
          risk_opportunity: {
            risk: { text: "Global growth implications as China consumer confidence remains 15% below pre-pandemic levels", confidence: 0.72 },
            opportunity: { text: "Cheaper inputs for US producers, potential supply chain diversification benefits", confidence: 0.58 }
          },
          impact_tags: [
            { asset: "Equities", detail: "EM (–)", direction: "-" },
            { asset: "Commodities", detail: "Metals/Oil (–)", direction: "-" },
            { asset: "FX", detail: "USD (+)", direction: "+" },
            { asset: "Rates", detail: "Neutral", direction: "=" }
          ],
          key_takeaway: "China demand weakness suppresses commodities → global growth outlook softens.",
          source_count: 49,
        };
      default:
        return {
          ...baseAnalysis,
          translation: "Plain take: tighter credit conditions favor defensive posture until spreads stabilize.",
          ripple_impact: "Next: stress may surface in high-beta equities and loan origination activity."
        };
    }
  };

  const type = String(item?.type || 'Analysis');
  const theme = useMemo(() => getTheme(type), [type]);
  const analysis = useMemo(() => getEnhancedAnalysis(item), [item]);

  if (!isOpen || !item) return null;

  const headline = String(item.headline || 'No headline available');
  const { Icon } = theme;
  const confOverall = Math.round((item.confidence_level || 0.75) * 100);

  // Calculate source count
  const sourceCount = analysis.source_count || 42; // Fallback to a default if not specified

  // Macro posture (could be dynamic from data)
  const getMacroPosture = (type) => {
    switch (type) {
      case 'Markets': return 'Lean Risk-Off';
      case 'Policy': return 'Hawkish Bias';
      case 'Global': return 'Growth Concerns';
      default: return 'Neutral';
    }
  };

  const getSeverityColor = (severity) => {
    if (severity >= 0.7) return { color: '#EF4444', bg: 'bg-red-500' };
    if (severity >= 0.4) return { color: '#F59E0B', bg: 'bg-amber-500' };
    return { color: '#10B981', bg: 'bg-green-500' };
  };

  const getTrendArrow = (value, prevValue) => {
    if (!prevValue) return '→';
    if (value > prevValue) return '↗︎';
    if (value < prevValue) return '↘︎';
    return '→';
  };

  const ImpactTag = ({ tag, delay }) => {
    const isNegative = tag.direction === '-';
    const isPositive = tag.direction === '+';
    const colorClasses = isNegative
      ? 'bg-red-900/50 text-red-300 border-red-500/30'
      : isPositive ? 'bg-green-900/50 text-green-300 border-green-500/30'
      : 'bg-gray-700/50 text-gray-300 border-gray-500/30';

    const IconComp = isNegative ? Minus : (isPositive ? Plus : null);

    return (
      <motion.div
        className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border text-sm font-medium transition-all duration-300 backdrop-blur-sm ${colorClasses}`}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay, type: 'spring', stiffness: 300, damping: 20 }}
        whileHover={{ y: -2, scale: 1.05 }}
      >
        {IconComp && <IconComp className="w-3.5 h-3.5" />}
        <span className="font-bold">{tag.asset}:</span>
        <span>{tag.detail}</span>
      </motion.div>
    );
  };

  // Calculate net bias from impact tags for Signal Equilibrium Bar
  const calculateSignalBias = (tags) => {
    if (!tags || tags.length === 0) return { bias: 0, volatility: 0.3 };
    
    let score = 0;
    tags.forEach(tag => {
      if (tag.direction === '-') score -= 1;
      if (tag.direction === '+') score += 1;
    });
    
    // Normalize to -1 to +1 range
    const bias = Math.max(-1, Math.min(1, score / (tags.length * 0.7)));
    
    // Calculate volatility based on tag diversity
    const directions = tags.map(t => t.direction);
    const hasConflict = directions.includes('-') && directions.includes('+');
    const volatility = hasConflict ? 0.6 : 0.3;
    
    return { bias, volatility };
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <style>{`
            /* ============================================================================
               HORIZON OS DRAWER - v1.5 READABILITY OPTIMIZATION
            ============================================================================ */
            
            :root {
              /* Typography Tokens */
              --txt-body-dark: ${HORIZON.color.textBodyDark};
              --txt-secondary-dark: ${HORIZON.color.textSecondaryDark};
              --txt-tertiary-dark: ${HORIZON.color.textTertiaryDark};
              --txt-body-light: ${HORIZON.color.textBodyLight};
              --txt-secondary-light: ${HORIZON.color.textSecondaryLight};
              
              /* Spacing Tokens */
              --section-gap: ${HORIZON.spacing.sectionGap}px;
              --block-gap: ${HORIZON.spacing.blockGap}px;
              --h-line: 24px;
              --m-line: 22px;
              --s-line: 20px;
              
              /* Motion Tokens */
              --fade-fast: ${HORIZON.motion.dur.fast}ms;
              --fade-med: ${HORIZON.motion.dur.med}ms;
              --fade-slow: ${HORIZON.motion.dur.toggle}ms;
              
              /* Divider */
              --divider-soft: linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,0));
              
              /* Legacy Tokens */
              --hzn-dur-open: 280ms;
              --hzn-dur-close: 200ms;
              --hzn-dur-stagger: 60ms;
              --hzn-ease-silk: cubic-bezier(0.19, 1, 0.22, 1);
              --hzn-ease-out: cubic-bezier(0.16, 1, 0.3, 1);
              --hzn-ease-io: cubic-bezier(0.4, 0, 0.2, 1);
              --hzn-open-scale: 0.96;
              --hzn-open-translate: 8px;
              
              --ri-gap-lg: ${HORIZON.ri.gapLg};
              --ri-gap-md: ${HORIZON.ri.gapMd};
              --ri-gap-tighten: ${HORIZON.ri.gapTighten};
              --ri-card-gap-extra: ${HORIZON.ri.cardGapExtra};
              --ri-dur: 280ms;
              --ri-dur-fast: ${HORIZON.motion.dur.fast}ms;
              --ri-ease-weight: cubic-bezier(0.18, 0.82, 0.23, 1);
              
              --li-duration: 280ms;
              --li-ease: cubic-bezier(0.4, 0, 0.2, 1);
              --li-halo-risk: rgba(255,75,75,0.25);
              --li-halo-oppty: rgba(60,240,180,0.25);
              --li-halo-neutral: rgba(160,190,230,0.2);
              --li-ai-voice: rgba(105,160,255,0.60);
              
              --mp-radius: 16px;
              --mp-border: 1px solid rgba(255,255,255,0.06);
              --mp-shadow-soft: 0 8px 24px rgba(0,0,0,0.25);
              --mp-risk-rim: inset 0 0 0 1px rgba(255,90,90,0.38), 0 0 22px rgba(255,60,60,0.22);
              --mp-up-rim: inset 0 0 0 1px rgba(60,220,160,0.34), 0 0 22px rgba(60,220,160,0.20);
              --mp-gap: 12px;
              --mp-dur: 260ms;
              --mp-ease: cubic-bezier(0.4,0,0.2,1);
              
              --glass-top-falloff: ${HORIZON.glass.topFalloff};
              --toggle-inactive-opacity: ${HORIZON.polish.toggleInactiveOpacity};
              --toggle-bloom-duration: ${HORIZON.polish.toggleBloomDuration}ms;
              --bar-vertical-gradient: ${HORIZON.polish.barGradient};
              --macro-posture-opacity: ${HORIZON.ia.macroPostureOpacity};
              
              --signal-glow-strength: ${HORIZON.mission.signalGlowStrength};
              --divider-opacity: ${HORIZON.mission.dividerOpacity};
              --net-impact-sheen: ${HORIZON.mission.netImpactSheen};
              --tooltip-fade-duration: ${HORIZON.mission.tooltipFadeDuration}ms;
              --hover-scale-impact: ${HORIZON.mission.hoverScaleImpact};
              --takeaway-fade-duration: ${HORIZON.mission.takeawayFadeDuration}ms;
            }
            
            /* Frosted Backdrop with localized scrim */
            .hzn-frosted-backdrop {
              position: fixed;
              inset: 0;
              z-index: 80;
              background: rgba(24, 26, 29, 0.55);
              backdrop-filter: blur(26px) saturate(1.3) brightness(1.15);
              -webkit-backdrop-filter: blur(26px) saturate(1.3) brightness(1.15);
              opacity: 0;
              transition: opacity var(--hzn-dur-open) var(--hzn-ease-silk),
                          filter var(--li-duration) var(--li-ease),
                          backdrop-filter var(--li-duration) var(--li-ease);
              will-change: opacity, filter, backdrop-filter;
              contain: paint;
              mask-image: linear-gradient(to bottom, transparent 0, black calc(72px + 8px));
              -webkit-mask-image: linear-gradient(to bottom, transparent 0, black calc(72px + 8px));
            }
            
            .hzn-frosted-backdrop--open {
              opacity: 1;
            }
            
            [data-sentiment="risk"] .hzn-frosted-backdrop {
              filter: blur(26px) saturate(1.15) brightness(1.03) hue-rotate(0deg);
            }
            
            [data-sentiment="opportunity"] .hzn-frosted-backdrop {
              filter: blur(26px) saturate(1.15) brightness(1.03) hue-rotate(150deg);
            }
            
            [data-sentiment="neutral"] .hzn-frosted-backdrop {
              filter: blur(26px) saturate(1.05) brightness(1.02) hue-rotate(220deg);
            }
            
            /* Localized radial scrim under drawer */
            .hzn-frosted-backdrop::after {
              content: "";
              position: absolute;
              inset: -2%;
              pointer-events: none;
              background: radial-gradient(ellipse 40% 35% at 50% 12%, rgba(0,0,0,0.12), transparent 100%);
              mix-blend-mode: multiply;
            }
            
            @supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
              .hzn-frosted-backdrop {
                background: rgba(24, 26, 29, 0.82);
              }
            }
            
            /* Header Scrim */
            .hzn-header-scrim {
              position: fixed;
              inset-inline: 0;
              top: 0;
              height: 72px;
              z-index: 95;
              pointer-events: none;
              background: linear-gradient(to bottom, rgba(0, 0, 0, 0.35) 0%, rgba(0, 0, 0, 0.22) 35%, rgba(0, 0, 0, 0.00) 100%);
              box-shadow: inset 0 -1px 0 rgba(255, 255, 255, 0.05);
              mix-blend-mode: normal;
              opacity: 0;
              transition: opacity var(--hzn-dur-open) var(--hzn-ease-silk);
              will-change: opacity;
            }
            
            .hzn-header-scrim--open {
              opacity: 1;
            }
            
            /* Priority Drawer with Top-Edge Ambient Falloff */
            .hzn-drawer {
              position: fixed;
              z-index: 90;
              left: 0;
              right: 0;
              margin-inline: auto;
              top: calc(72px + 14px);
              max-width: min(820px, 90vw);
              border: 1px solid rgba(255, 255, 255, 0.06);
              background: linear-gradient(to bottom, rgba(255,255,255,0.08), rgba(0,0,0,0.12));
              box-shadow: 0 24px 70px rgba(0, 0, 0, 0.45);
              border-radius: calc(var(--mp-radius) + 8px);
              overflow: visible;
              
              transform: translateY(var(--hzn-open-translate)) scale(var(--hzn-open-scale));
              opacity: 0;
              will-change: transform, opacity;
              transition: 
                transform var(--hzn-dur-open) var(--hzn-ease-silk),
                opacity var(--hzn-dur-open) var(--hzn-ease-silk);
            }
            
            .hzn-drawer--open {
              transform: translateY(0) scale(1);
              opacity: 1;
            }
            
            /* Top-edge ambient falloff - ENHANCED (v1.3) */
            .hzn-drawer::before {
              content: "";
              position: absolute;
              left: 0;
              right: 0;
              top: 0;
              height: 24px;
              pointer-events: none;
              background: linear-gradient(to bottom, rgba(255, 255, 255, calc(var(--glass-top-falloff) * 1.5)) 0%, rgba(255, 255, 255, var(--glass-top-falloff)) 50%, rgba(255, 255, 255, 0.00) 100%);
              mix-blend-mode: screen;
              opacity: 0.75;
              z-index: 1;
              border-radius: calc(var(--mp-radius) + 8px) calc(var(--mp-radius) + 8px) 0 0;
            }
            
            .hzn-drawer::after {
              content: "";
              position: absolute;
              left: 12px;
              right: 12px;
              top: 0;
              height: 1px;
              pointer-events: none;
              background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.08), transparent);
              opacity: 0.9;
              z-index: 1;
            }
            
            /* Center Light Beam */
            .li-beam {
              position: absolute;
              inset: 0;
              pointer-events: none;
              background: linear-gradient(to bottom, rgba(255,255,255,0.05), rgba(255,255,255,0) 40%), linear-gradient(to bottom, rgba(255,255,255,0) 60%, rgba(255,255,255,0.04) 100%);
              mask-image: linear-gradient(to right, transparent 48.5%, black 50%, transparent 51.5%);
              -webkit-mask-image: linear-gradient(to right, transparent 48.5%, black 50%, transparent 51.5%);
              opacity: 0;
              transition: opacity var(--mp-dur) var(--mp-ease);
            }
            
            .drawer--detailed .li-beam {
              opacity: 0.035;
            }
            
            @media (prefers-reduced-motion: no-preference) {
              .drawer--detailed .li-beam {
                animation: liBeamBreath 8s ease-in-out infinite;
              }
            }
            
            @keyframes liBeamBreath {
              0%, 100% { opacity: 0.028; }
              50% { opacity: 0.045; }
            }
            
            /* Narrative Link */
            .li-link {
              animation: liPulseLine 3s ease-in-out infinite;
            }
            
            @keyframes liPulseLine {
              0%, 100% { opacity: 0.3; }
              50% { opacity: 0.7; }
            }
            
            /* Micro-Transitions - Optimized for Readability */
            .ri-section {
              margin-bottom: var(--section-gap);
              line-height: 1.55;
              opacity: 0;
              transition: opacity var(--fade-fast) var(--li-ease);
            }
            
            /* Tightened gap between Confidence and Impact (v1.1) */
            .ri-section.confidence-section + .ri-section.impact-section {
              margin-top: var(--ri-gap-tighten);
            }
            
            .hzn-drawer--open .ri-section {
              animation: giFadeUp var(--fade-med) var(--hzn-ease-silk) forwards;
            }
            
            .hzn-drawer--open .ri-section:nth-of-type(1) { animation-delay: calc(var(--hzn-dur-stagger) * 0); }
            .hzn-drawer--open .ri-section:nth-of-type(2) { animation-delay: calc(var(--hzn-dur-stagger) * 1); }
            .hzn-drawer--open .ri-section:nth-of-type(3) { animation-delay: calc(var(--hzn-dur-stagger) * 2); }
            .hzn-drawer--open .ri-section:nth-of-type(4) { animation-delay: calc(var(--hzn-dur-stagger) * 3); }
            .hzn-drawer--open .ri-section:nth-of-type(5) { animation-delay: calc(var(--hzn-dur-stagger) * 4); }
            .hzn-drawer--open .ri-section:nth-of-type(6) { animation-delay: calc(var(--hzn-dur-stagger) * 5); }
            
            @keyframes giFadeUp {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            
            /* Auto-reveal Details */
            .ri-details {
              overflow: clip;
              max-height: 0;
              opacity: 0;
              transition: max-height var(--fade-slow) var(--ri-ease-io), 
                          opacity var(--fade-slow) var(--ri-ease-io);
            }
            
            .drawer--detailed .ri-details {
              max-height: 1800px;
              opacity: 1;
            }
            
            /* Confidence Ring Breathing */
            .confidence-ring {
              transition: box-shadow var(--li-duration) var(--li-ease);
            }
            
            .confidence-ring[data-sentiment="risk"] {
              animation: confidenceBreathe 5s ease-in-out infinite;
              box-shadow: 0 0 0 0 currentColor;
            }
            
            .confidence-ring[data-sentiment="opportunity"] {
              animation: confidenceBreathe 5s ease-in-out infinite;
              box-shadow: 0 0 0 0 currentColor;
            }
            
            .confidence-ring[data-sentiment="neutral"] {
              animation: confidenceBreathe 5s ease-in-out infinite;
              box-shadow: 0 0 0 0 currentColor;
            }
            
            @keyframes confidenceBreathe {
              0%, 100% { box-shadow: 0 0 0 0 currentColor; }
              50% { box-shadow: 0 0 0 8px currentColor; }
            }
            
            /* Confidence Row Baseline Alignment */
            .ri-confidence-inline {
              display: flex;
              align-items: center;
              gap: 10px;
              line-height: 1.2;
              transform: translateY(-1px);
            }
            
            /* Context Tags */
            .li-meta-tags {
              display: flex;
              align-items: center;
              flex-wrap: wrap;
            }
            
            .li-tag {
              background: rgba(255, 255, 255, 0.06);
              border: 1px solid rgba(255, 255, 255, 0.08);
              border-radius: 10px;
              padding: 4px 10px;
              font-size: 12px;
              color: rgba(255, 255, 255, 0.65);
              display: inline-flex;
              align-items: center;
            }
            
            /* Grid for Risk/Upside Cards */
            .ri-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: calc(16px + var(--ri-card-gap-extra));
              overflow: visible;
            }
            
            /* Luminous Active Cards */
            .ri-card {
              border-radius: var(--mp-radius);
              padding: 20px;
              background: rgba(255, 255, 255, 0.02);
              border: var(--mp-border);
              box-shadow: var(--mp-shadow-soft);
              overflow: visible;
              transition: box-shadow var(--ri-dur) var(--ri-ease-io), background var(--ri-dur) var(--ri-ease-io);
            }
            
            /* Inner shadow mask for depth (v1.1) */
            .ri-card::before {
              content: "";
              position: absolute;
              inset: 0;
              border-radius: var(--mp-radius);
              box-shadow: inset 0 2px 4px rgba(0,0,0,0.15);
              pointer-events: none;
              opacity: 0.3;
            }
            
            .ri-card.active.risk {
              box-shadow: var(--mp-risk-rim), var(--mp-shadow-soft);
              background: linear-gradient(180deg, rgba(255, 60, 60, 0.08), transparent);
              filter: drop-shadow(0 10px 18px rgba(120,20,20,0.25));
            }
            
            .ri-card.active.oppty {
              box-shadow: var(--mp-up-rim), var(--mp-shadow-soft);
              background: linear-gradient(180deg, rgba(60, 220, 160, 0.08), transparent);
              filter: drop-shadow(0 10px 18px rgba(14,70,52,0.22));
            }
            
            .ri-card p {
              margin-bottom: 10px;
            }
            
            /* Typography - Optimized for Apple-grade readability */
            .ri-section-title {
              font-size: ${HORIZON.type.drawerTitle.size}px;
              line-height: ${HORIZON.type.drawerTitle.lh}px;
              font-weight: ${HORIZON.type.drawerTitle.weight};
              letter-spacing: -0.01em;
              text-transform: uppercase;
              color: var(--txt-tertiary-dark);
              opacity: ${HORIZON.type.drawerTitle.opacity};
              margin-bottom: 6px;
              display: flex;
              align-items: center;
              gap: 6px;
            }
            
            .ri-section-body {
              font-size: ${HORIZON.type.context.size}px;
              line-height: ${HORIZON.type.context.lh}px;
              font-weight: ${HORIZON.type.context.weight};
              color: var(--txt-body-dark);
              max-width: 72ch;
            }
            
            .ri-section-body strong {
              font-weight: 600;
              opacity: 1;
            }
            
            /* Toggle Chip States (v1.1) */
            .toggle-chip {
              position: relative;
              overflow: hidden;
            }
            
            .toggle-chip--inactive {
              opacity: var(--toggle-inactive-opacity);
            }
            
            .toggle-chip--active {
              opacity: 1;
            }
            
            /* Toggle Bloom Pulse (v1.1) */
            @keyframes toggleBloomPulse {
              0% { opacity: 0.08; transform: scale(0.9); }
              100% { opacity: 0; transform: scale(1.2); }
            }
            
            .toggle-chip--active::after {
              content: "";
              position: absolute;
              inset: 0;
              background: radial-gradient(circle, rgba(255,255,255,0.2), transparent 70%);
              border-radius: inherit;
              animation: toggleBloomPulse var(--toggle-bloom-duration) cubic-bezier(0.25,1,0.5,1) forwards;
              pointer-events: none;
            }
            
            /* Severity/Confidence Bars with Vertical Gradient (v1.1) */
            .severity-bar,
            .confidence-bar {
              position: relative;
              height: 1.5px; /* Use px for consistency if 1.5 is meant literally */
              border-radius: 9999px;
              overflow: hidden;
            }
            
            .severity-bar > div,
            .confidence-bar > div {
              height: 100%;
              border-radius: inherit;
              background: linear-gradient(
                to bottom,
                currentColor calc(100% - var(--bar-vertical-gradient) * 100%),
                color-mix(in srgb, currentColor 90%, black) 100%
              );
            }
            
            /* Header Controls */
            .hzn-drawer .drawer-controls [data-icon] {
              opacity: 0;
              transform: scale(0.96);
            }
            
            .hzn-drawer--open .drawer-controls [data-icon] {
              animation: hznControlsIn 260ms var(--hzn-ease-silk) 120ms forwards;
            }
            
            @keyframes hznControlsIn {
              to { opacity: 1; transform: scale(1); }
            }
            
            /* Confidence Ring Initial State */
            .hzn-confidence-ring {
              opacity: 0;
              transform: scale(0.92);
            }
            
            .hzn-drawer--open .hzn-confidence-ring {
              animation: hznRingIn 320ms var(--hzn-ease-silk) 180ms forwards;
            }
            
            @keyframes hznRingIn {
              to { opacity: 1; transform: scale(1); }
            }
            
            /* Icon hover */
            [data-icon]:hover {
              transform: translateY(-1px);
              filter: brightness(1.1);
              transition: transform 180ms cubic-bezier(0.4, 0, 0.2, 1), filter 180ms cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            /* Performance */
            .hzn-drawer,
            .hzn-frosted-backdrop,
            .hzn-header-scrim {
              transform: translateZ(0);
              backface-visibility: hidden;
              perspective: 1000px;
            }
            
            /* Reduced Motion */
            @media (prefers-reduced-motion: reduce) {
              .hzn-drawer,
              .hzn-frosted-backdrop,
              .hzn-header-scrim,
              .ri-section,
              .ri-details,
              .li-beam,
              .drawer-controls [data-icon],
              .hzn-confidence-ring,
              .confidence-ring,
              .li-link,
              .toggle-chip--active::after {
                transition: none !important;
                animation: none !important;
                transform: none !important;
                filter: none !important;
              }
              
              .drawer--detailed .ri-details {
                max-height: none !important;
                opacity: 1 !important;
              }
              
              .hzn-drawer--open .ri-section,
              .hzn-drawer--open .drawer-controls [data-icon],
              .hzn-drawer--open .hzn-confidence-ring {
                opacity: 1 !important;
                transform: none !important;
              }
            }

            /* v1.2 IA Additions */
            .macro-posture {
              opacity: var(--macro-posture-opacity, 0.70);
            }
            
            .risk-card-glow::before {
              content: "";
              position: absolute;
              inset: -1px;
              border-radius: var(--mp-radius);
              background: radial-gradient(circle at top, rgba(242, 106, 106, ${HORIZON.ia.categoryGlowAccent}), transparent 60%);
              pointer-events: none;
            }
            
            .oppty-card-glow::before {
              content: "";
              position: absolute;
              inset: -1px;
              border-radius: var(--mp-radius);
              background: radial-gradient(circle at top, rgba(46, 207, 141, ${HORIZON.ia.categoryGlowAccent}), transparent 60%);
              pointer-events: none;
            }
            
            .tooltip-trigger {
              cursor: help;
              text-decoration: underline;
              text-decoration-style: dotted;
              text-underline-offset: 2px;
            }

            /* v1.3 Mission Additions */
            /* Impact Chip Enhanced Hover (v1.3) */
            .impact-chip {
              transition: transform 120ms ease-out, filter 120ms ease-out;
            }
            
            .impact-chip:hover {
              transform: scale(var(--hover-scale-impact));
              filter: brightness(1.03);
            }
            
            /* Confidence Tooltip (v1.3) */
            .confidence-tooltip {
              position: absolute;
              bottom: calc(100% + 8px);
              left: 50%;
              transform: translateX(-50%) scale(0.98);
              background: rgba(18, 20, 25, 0.95);
              backdrop-filter: blur(12px);
              border: 1px solid rgba(255, 255, 255, 0.15);
              border-radius: 8px;
              padding: 8px 12px;
              font-size: 11px;
              line-height: 1.4;
              color: rgba(255, 255, 255, 0.85);
              max-width: 220px;
              opacity: 0;
              pointer-events: none;
              z-index: 100;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
              transition: opacity var(--tooltip-fade-duration) ease-out, 
                          transform var(--tooltip-fade-duration) ease-out;
            }
            
            .confidence-tooltip.visible {
              opacity: 1;
              transform: translateX(-50%) scale(1);
            }
            
            .confidence-tooltip::after {
              content: "";
              position: absolute;
              top: 100%;
              left: 50%;
              transform: translateX(-50%);
              border: 4px solid transparent;
              border-top-color: rgba(18, 20, 25, 0.95);
            }
            
            /* Key Takeaway Gradient Sweep (v1.3) */
            .key-takeaway-card {
              position: relative;
              overflow: hidden;
            }
            
            .key-takeaway-card::before {
              content: "";
              position: absolute;
              top: 0;
              left: -100%;
              width: 100%;
              height: 100%;
              background: linear-gradient(90deg, transparent, rgba(155,135,255,0.06), transparent);
              transition: left 600ms ease-out;
              pointer-events: none;
            }
            
            .key-takeaway-card:hover::before {
              left: 100%;
            }
            
            /* Timestamp Recency Colors (v1.3) */
            .timestamp-recent-6h { color: ${HORIZON.mission.timestampRecencyGreen}; opacity: 0.5; }
            .timestamp-recent-12h { color: ${HORIZON.mission.timestampRecencyYellow}; opacity: 0.6; }
            .timestamp-older { color: ${HORIZON.mission.timestampRecencyGray}; opacity: 0.6; }
            
            /* Signal Strength Glyph (v1.3) */
            .signal-strength-glyph {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              width: 16px;
              height: 16px;
              margin-left: 6px;
              opacity: 0.6;
              filter: drop-shadow(0 0 ${HORIZON.mission.signalGlowStrength * 100}px rgba(255,255,255,0.08));
            }
          `}</style>

          {/* Header Scrim */}
          <div
            className={`hzn-header-scrim ${isAnimatingIn ? 'hzn-header-scrim--open' : ''}`}
            aria-hidden="true"
          />

          {/* Sentiment-Aware Frosted Backdrop */}
          <div
            data-sentiment={theme.sentiment}
            className={`hzn-frosted-backdrop ${isAnimatingIn ? 'hzn-frosted-backdrop--open' : ''}`}
            onClick={onClose}
            role="presentation"
            aria-hidden={!isOpen}
          />

          {/* Priority Drawer Panel */}
          <aside
            ref={containerRef}
            data-sentiment={theme.sentiment}
            className={`hzn-drawer ${isAnimatingIn ? 'hzn-drawer--open' : ''} ${viewMode === 'detailed' ? 'drawer--detailed' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-label="Executive Takeaway Analysis"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Center Light Beam */}
            <div ref={beamRef} className="li-beam" aria-hidden="true" />

            <div className="relative w-full max-h-[88vh]" style={{ overflow: 'hidden' }}>
              {/* HEADER */}
              <div
                className="relative z-10 p-8 pb-6"
                style={{
                  borderBottom: 'none',
                  boxShadow: '0 1px 0 rgba(0,0,0,0.02), inset 0 -1px 0 rgba(255,255,255,0.03)'
                }}
              >
                <div className="flex items-start justify-between gap-6 mb-4">
                  <div className="flex-1 min-w-0">
                    <h1
                      className="mb-1"
                      style={{
                        fontSize: HORIZON.type.h1.size,
                        fontWeight: HORIZON.type.h1.weight,
                        letterSpacing: `${HORIZON.type.h1.tracking}em`,
                        color: '#FFFFFF',
                        opacity: HORIZON.type.h1.opacity,
                      }}
                    >
                      {type} Analysis
                    </h1>
                    
                    {/* Macro Posture */}
                    <p
                      className="macro-posture mb-2" // Changed mb-3 to mb-2
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: '#AAB1B8',
                        letterSpacing: '0.02em',
                      }}
                    >
                      Macro Posture: {getMacroPosture(type)}
                    </p>
                    
                    {/* Meta Row */}
                    <p
                      className="mb-0" // Changed mb-3 to mb-0
                      style={{
                        fontSize: HORIZON.type.meta.size,
                        fontWeight: HORIZON.type.meta.weight,
                        color: '#AAB1B8',
                        opacity: HORIZON.type.meta.opacity,
                        textTransform: 'uppercase',
                        letterSpacing: `${HORIZON.type.meta.tracking}em`,
                      }}
                    >
                      Generated today • {type} Analysis • Horizon: Short-Term (1W) • Based on {sourceCount} sources
                    </p>
                  </div>

                  {/* Navigation Controls */}
                  <div className="drawer-controls flex items-center gap-1.5">
                    <motion.button
                      onClick={() => onNavigate?.('prev')}
                      className="p-2 rounded-xl"
                      style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        color: 'rgba(255,255,255,0.68)',
                      }}
                      whileHover={{
                        y: -1,
                        background: 'rgba(255, 255, 255, 0.08)',
                        color: 'rgba(255,255,255,0.88)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        transition: { duration: 0.12 }
                      }}
                      whileTap={{ 
                        scale: 0.97, 
                        y: 0.5,
                        transition: { duration: 0.08 }
                      }}
                      aria-label="Previous takeaway"
                    >
                      <ChevronLeft className="w-5 h-5" data-icon />
                    </motion.button>

                    <motion.button
                      onClick={() => onNavigate?.('next')}
                      className="p-2 rounded-xl"
                      style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        color: 'rgba(255,255,255,0.68)',
                      }}
                      whileHover={{
                        y: -1,
                        background: 'rgba(255, 255, 255, 0.08)',
                        color: 'rgba(255,255,255,0.88)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        transition: { duration: 0.12 }
                      }}
                      whileTap={{ 
                        scale: 0.97, 
                        y: 0.5,
                        transition: { duration: 0.08 }
                      }}
                      aria-label="Next takeaway"
                    >
                      <ChevronRight className="w-5 h-5" data-icon />
                    </motion.button>

                    <motion.button
                      onClick={onClose}
                      className="p-2 rounded-xl ml-2"
                      style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        color: 'rgba(255,255,255,0.68)',
                      }}
                      whileHover={{
                        y: -1,
                        background: 'rgba(255, 255, 255, 0.08)',
                        color: 'rgba(255,255,255,0.88)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        transition: { duration: 0.12 }
                      }}
                      whileTap={{ 
                        scale: 0.97, 
                        y: 0.5,
                        transition: { duration: 0.08 }
                      }}
                      aria-label="Close"
                    >
                      <X className="w-5 h-5" data-icon />
                    </motion.button>

                    <motion.button
                      onClick={() => setViewMode(prev => prev === 'detailed' ? 'simplified' : 'detailed')}
                      className="toggle-chip px-3.5 py-1.5 rounded-xl ml-2 text-xs font-semibold"
                      style={{
                        background: viewMode === 'detailed' ? 'rgba(94, 167, 255, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                        border: viewMode === 'detailed' ? '1px solid rgba(94, 167, 255, 0.24)' : '1px solid rgba(255, 255, 255, 0.06)',
                        color: viewMode === 'detailed' ? 'rgba(160, 200, 255, 0.95)' : 'rgba(255,255,255,0.68)',
                        boxShadow: viewMode === 'detailed' ? 'inset 0 1px 0 rgba(255,255,255,0.08), 0 0 12px rgba(94, 167, 255, 0.12)' : 'none'
                      }}
                      whileHover={{
                        y: -1,
                        background: viewMode === 'detailed' ? 'rgba(94, 167, 255, 0.18)' : 'rgba(255, 255, 255, 0.08)',
                        boxShadow: viewMode === 'detailed' ? 'inset 0 1px 0 rgba(255,255,255,0.10), 0 0 16px rgba(94, 167, 255, 0.18)' : '0 2px 8px rgba(0,0,0,0.08)',
                        transition: { duration: 0.12 }
                      }}
                      whileTap={{ scale: 0.97 }}
                      aria-label={viewMode === 'detailed' ? 'Switch to simplified view' : 'Switch to detailed view'}
                    >
                      {viewMode === 'detailed' ? 'Simplified' : 'Detailed'}
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* BODY - Living Narrative Flow */}
              <div
                className="relative z-10 overflow-y-auto"
                style={{
                  maxHeight: 'calc(88vh - 180px)',
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgba(255, 255, 255, 0.18) rgba(255, 255, 255, 0.04)',
                }}
              >
                <style>{`
                  .overflow-y-auto::-webkit-scrollbar {
                    width: 6px;
                  }
                  .overflow-y-auto::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.04);
                    border-radius: 6px;
                  }
                  .overflow-y-auto::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.18);
                    border-radius: 6px;
                  }
                  .overflow-y-auto::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.25);
                  }
                `}</style>

                <div className="p-8 pt-4"> {/* Changed pt-6 to pt-4 */}
                  {/* HEADLINE SUMMARY */}
                  <section className="ri-section" style={{ marginBottom: `${HORIZON.spacing.headlineToTakeaway}px` }}>
                    <h3 className="ri-section-title">
                      <Target className="w-4 h-4" style={{ color: HORIZON.color.accent }} />
                      Headline Summary
                    </h3>
                    <p 
                      style={{ 
                        fontSize: `${HORIZON.type.headline.size}px`, 
                        lineHeight: `${HORIZON.type.headline.lh}px`,
                        fontWeight: HORIZON.type.headline.weight,
                        color: HORIZON.color.textBodyDark,
                        maxWidth: '72ch'
                      }}
                    >
                      {analysis.headline_summary}
                    </p>
                  </section>

                  <SectionDivider />

                  {/* MORNING TAKEAWAY + Enhanced Confidence */}
                  <section className="ri-section confidence-section">
                    <h3 className="ri-section-title">
                      <Sparkles className="w-4 h-4" style={{ color: HORIZON.color.accent }} />
                      Morning Takeaway
                    </h3>
                    <p 
                      style={{ 
                        fontSize: `${HORIZON.type.takeaway.size}px`, 
                        lineHeight: `${HORIZON.type.takeaway.lh}px`,
                        fontWeight: HORIZON.type.takeaway.weight,
                        color: HORIZON.color.textBodyDark,
                        marginBottom: `${HORIZON.spacing.takeawayToTranslation}px`,
                        maxWidth: '72ch'
                      }}
                    >
                      <strong>{analysis.morning_takeaway}</strong>
                    </p>
                    
                    {/* TRANSLATION - ALWAYS VISIBLE (v1.4.1) */}
                    {analysis.translation && (
                      <motion.div
                        className="mt-4 p-3 rounded-xl"
                        style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.06)',
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: HORIZON.motion.dur.med / 1000, delay: 0.3 }}
                        whileHover={{ y: -1 }}
                        role="region"
                        aria-label={`Translation: ${analysis.translation}`}
                      >
                        <div className="flex items-start gap-2">
                          <Sparkles 
                            className="w-4 h-4 mt-0.5 flex-shrink-0" 
                            style={{ color: 'rgba(255, 255, 255, 0.38)' }}
                            aria-hidden="true"
                          />
                          <div>
                            <div 
                              className="text-xs font-medium uppercase tracking-wide mb-1"
                              style={{ color: HORIZON.color.textTertiaryDark }}
                            >
                              Translation
                            </div>
                            <p 
                              style={{ 
                                fontSize: `${HORIZON.type.translation.size}px`, 
                                lineHeight: `${HORIZON.type.translation.lh}px`, 
                                fontWeight: HORIZON.type.translation.weight,
                                color: HORIZON.color.textSecondaryDark,
                                margin: 0,
                                maxWidth: '64ch'
                              }}
                            >
                              {analysis.translation}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    
                    <div className="ri-confidence-inline" style={{ marginTop: `${HORIZON.spacing.confidenceToImpact}px` }}>
                      <div className="relative inline-flex items-center">
                        <span 
                          className="text-xs font-medium uppercase tracking-wide cursor-help" 
                          style={{ 
                            color: HORIZON.color.textTertiaryDark,
                            fontSize: `${HORIZON.type.confidence.size}px`,
                            lineHeight: `${HORIZON.type.confidence.lh}px`,
                            fontWeight: HORIZON.type.confidence.weight
                          }}
                          onMouseEnter={(e) => {
                            const tooltip = e.currentTarget.nextElementSibling;
                            if (tooltip) tooltip.classList.add('visible');
                          }}
                          onMouseLeave={(e) => {
                            const tooltip = e.currentTarget.nextElementSibling;
                            if (tooltip) tooltip.classList.remove('visible');
                          }}
                        >
                          Confidence
                        </span>
                        
                        {/* Tooltip */}
                        <div className="confidence-tooltip">
                          Confidence reflects reliability derived from {sourceCount} sources, recency, and cross-asset correlation. Updated daily.
                        </div>
                        
                        {/* Signal Strength Glyph - Minimal Bars */}
                        <svg 
                          className="ml-1.5" 
                          width="16" 
                          height="16" 
                          viewBox="0 0 16 16" 
                          fill="none"
                          style={{ opacity: 0.4 }}
                          aria-label="Signal strength indicator"
                        >
                          <path d="M2 10h2M6 7h2M10 4h2M14 2h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          <rect x="2" y="10" width="2" height="4" rx="0.5" fill="currentColor" opacity="0.5" />
                          <rect x="6" y="7" width="2" height="7" rx="0.5" fill="currentColor" opacity="0.7" />
                          <rect x="10" y="4" width="2" height="10" rx="0.5" fill="currentColor" opacity="0.9" />
                          <rect x="14" y="2" width="2" height="12" rx="0.5" fill="currentColor" />
                        </svg>
                      </div>
                      
                      <ConfidenceRing value={confOverall} color={theme.primaryColor} size={42} sentiment={theme.sentiment} />
                    </div>
                  </section>

                  <SectionDivider />

                  {/* IMPACT OVERVIEW - with Signal Equilibrium Bar */}
                  <section className="ri-section impact-section">
                    <h3 className="ri-section-title">
                      <Activity className="w-4 h-4" style={{ color: HORIZON.color.accent }} />
                      Impact Overview
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {analysis.impact_tags.map((tag, i) => {
                        const tone = tag.direction === '-' ? 'risk' : tag.direction === '+' ? 'opportunity' : 'neutral';
                        return (
                          <div key={i} className="impact-chip">
                            <ImpactChip text={`${tag.asset}: ${tag.detail}`} tone={tone} />
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Signal Equilibrium Bar V2 */}
                    {(() => {
                      const { bias, volatility } = calculateSignalBias(analysis.impact_tags);
                      return (
                        <SignalEquilibriumBar 
                          bias={bias}
                          confidence={confOverall}
                          volatility={volatility}
                          horizon="ST"
                          zscore={null}
                        />
                      );
                    })()}

                    {/* RIPPLE IMPACT - ONLY IN DETAILED MODE (v1.4.1 + v1.5) */}
                    {viewMode === 'detailed' && analysis.ripple_impact && (
                      <motion.div
                        className="flex items-start gap-2"
                        style={{ marginTop: `${HORIZON.spacing.impactToRipple}px` }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: HORIZON.motion.dur.med / 1000, delay: 0.4 }}
                        whileHover={{ y: -1 }}
                        role="region"
                        aria-label={`Ripple Impact: ${analysis.ripple_impact}`}
                      >
                        <svg 
                          width="16" 
                          height="16" 
                          viewBox="0 0 16 16" 
                          fill="none"
                          className="mt-0.5 flex-shrink-0"
                          style={{ color: 'rgba(255, 255, 255, 0.38)' }}
                          aria-hidden="true"
                        >
                          <path 
                            d="M3 8h10M8 3l5 5-5 5" 
                            stroke="currentColor" 
                            strokeWidth="1.5" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div>
                          <span 
                            className="text-xs font-medium uppercase tracking-wide mr-2"
                            style={{ color: HORIZON.color.textTertiaryDark }}
                          >
                            Ripple Impact
                          </span>
                          <span 
                            style={{ 
                              fontSize: `${HORIZON.type.ripple.size}px`, 
                              lineHeight: `${HORIZON.type.ripple.lh}px`,
                              fontWeight: HORIZON.type.ripple.weight,
                              color: HORIZON.color.textSecondaryDark
                            }}
                          >
                            {analysis.ripple_impact}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </section>

                  {/* AUTO-REVEAL DETAILS */}
                  <div className="ri-details">
                    <SectionDivider />

                    {/* CONTEXT AND SOURCE - with timestamp coloring */}
                    <div style={{ marginBottom: `${HORIZON.spacing.sectionGap}px` }}>
                      <h4 className="ri-section-title">
                        <BookOpen className="w-4 h-4" style={{ color: HORIZON.color.accent }} />
                        Context and Source
                      </h4>
                      <div className="space-y-3">
                        {analysis.context_points.map((point, i) => {
                          const IconComp = contextIcons[point.icon];
                          const timestamp = `${9 + i}:${30 + (i * 15)} UTC`;
                          const timestampColor = getTimestampColor(timestamp);
                          const hours = parseInt(timestamp.split(':')[0]) - 9;
                          const timestampClass = hours < 6 ? 'timestamp-recent-6h' : hours < 12 ? 'timestamp-recent-12h' : 'timestamp-older';
                          
                          return (
                            <motion.div
                              key={i}
                              className="flex items-start justify-between p-4 rounded-xl bg-white/5 border border-white/10"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: i * 0.1, duration: HORIZON.motion.dur.fast / 1000 }}
                              whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.08)' }}
                            >
                              <div className="flex items-start flex-1">
                                {IconComp && <IconComp className={`w-5 h-5 mr-4 mt-0.5 flex-shrink-0 ${point.color}`} strokeWidth={2.5} />}
                                <span 
                                  style={{ 
                                    fontSize: `${HORIZON.type.context.size}px`, 
                                    lineHeight: `${HORIZON.type.context.lh}px`,
                                    fontWeight: HORIZON.type.context.weight,
                                    color: HORIZON.color.textBodyDark
                                  }}
                                >
                                  {point.text}
                                </span>
                              </div>
                              <span 
                                className={`text-xs ml-3 flex-shrink-0 ${timestampClass}`}
                                style={{ fontSize: '12.5px' }}
                              >
                                {timestamp}
                              </span>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>

                    <SectionDivider />

                    {/* MARKET IMPACT - with trend arrows and gradient bars */}
                    <div className="mb-6">
                      <h4 className="ri-section-title">
                        <Activity className="w-4 h-4" style={{ color: HORIZON.color.accent }} />
                        Market Impact
                      </h4>
                      <div className="grid gap-4">
                        {Object.entries(analysis.market_impact).map(([horizon, data], i) => {
                          const severityInfo = getSeverityColor(data.severity);
                          const confidenceInfo = getSeverityColor(data.confidence);
                          // Mock prev values for trend arrows
                          const prevSeverity = data.severity - 0.05;
                          const prevConfidence = data.confidence - 0.03;
                          
                          return (
                            <motion.div 
                              key={horizon}
                              className="relative p-4 rounded-lg bg-white/5 border border-white/10 space-y-3"
                              whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.08)' }}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: i * 0.1 }}
                            >
                              <div className="flex items-center justify-between">
                                <span className="relative font-semibold text-white bg-gray-500/20 px-3 py-1 rounded-full text-sm" style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.15)' }}>
                                  {horizon.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}:
                                Stewardship
                                </span>
                                <div className="flex items-center space-x-4">
                                  <div className="flex items-center space-x-2">
                                    <span className="text-xs text-gray-400">Severity:</span>
                                    <span className="text-xs" style={{ color: severityInfo.color }}>
                                      {getTrendArrow(data.severity, prevSeverity)}
                                    </span>
                                    <div className="severity-bar w-16 bg-black/30">
                                      <div style={{ width: `${data.severity*100}%`, color: severityInfo.color }}></div>
                                    </div>
                                    <span className="text-xs font-bold" style={{color: severityInfo.color}}>
                                      {Math.round(data.severity * 100)}%
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-xs text-gray-400">Confidence:</span>
                                    <span className="text-xs" style={{ color: confidenceInfo.color }}>
                                      {getTrendArrow(data.confidence, prevConfidence)}
                                    </span>
                                    <div className="confidence-bar w-16 bg-black/30">
                                      <div style={{ width: `${data.confidence*100}%`, color: confidenceInfo.color }}></div>
                                    </div>
                                    <span className="text-xs font-bold" style={{color: confidenceInfo.color}}>
                                      {Math.round(data.confidence * 100)}%
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <span className="text-gray-300">{data.text}</span>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>

                    <SectionDivider />

                    {/* LUMINOUS RISK/OPPORTUNITY CARDS - with header glow */}
                    <div className="ri-grid mb-6">
                      {/* Downside Risk */}
                      <div className={`ri-card risk-card-glow relative ${theme.sentiment === 'risk' ? 'active risk' : ''}`}>
                        <div className="flex items-center gap-3 mb-3">
                          <AlertTriangle className="w-5 h-5" style={{ color: HORIZON.color.risk }} />
                          <h4 className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#AAB1B8', margin: 0 }}>
                            Downside Risk
                          </h4>
                        </div>
                        <p className="text-sm mb-3" style={{ color: '#D7DBE0', lineHeight: 1.6, opacity: 0.82 }}>
                          {analysis.risk_opportunity.risk.text}
                        </p>
                        <div className="text-xs" style={{ color: '#AAB1B8' }}>
                          Confidence: <span style={{ color: HORIZON.color.risk, fontWeight: 700 }}>
                            {Math.round(analysis.risk_opportunity.risk.confidence * 100)}%
                          </span>
                        </div>
                      </div>

                      {/* Potential Upside */}
                      <div className={`ri-card oppty-card-glow relative ${theme.sentiment === 'opportunity' ? 'active oppty' : ''}`}>
                        <div className="flex items-center gap-3 mb-3">
                          <ShieldCheck className="w-5 h-5" style={{ color: HORIZON.color.opportunity }} />
                          <h4 className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#AAB1B8', margin: 0 }}>
                            Potential Upside
                          </h4>
                        </div>
                        <p className="text-sm mb-3" style={{ color: '#D7DBE0', lineHeight: 1.6, opacity: 0.82 }}>
                          {analysis.risk_opportunity.opportunity.text}
                        </p>
                        <div className="text-xs" style={{ color: '#AAB1B8' }}>
                          Confidence: <span style={{ color: HORIZON.color.opportunity, fontWeight: 700 }}>
                            {Math.round(analysis.risk_opportunity.opportunity.confidence * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <SectionDivider />

                    {/* KEY TAKEAWAY - Enhanced */}
                    <motion.div
                      className="ri-card key-takeaway-card"
                      style={{
                        background: 'rgba(139, 92, 246, 0.10)',
                        border: '1px solid rgba(139, 92, 246, 0.20)',
                        marginBottom: `${HORIZON.spacing.sectionGap}px`
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8, duration: HORIZON.mission.takeawayFadeDuration / 1000 }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <Lightbulb className="w-4 h-4" style={{ color: '#C4B5FD' }} />
                        <h4 className="ri-section-title" style={{ margin: 0 }}>
                          Key Takeaway
                        </h4>
                      </div>
                      <motion.p 
                        style={{ 
                          fontSize: viewMode === 'simplified' ? '14px' : `${HORIZON.type.takeawayCard.size}px`,
                          lineHeight: `${HORIZON.type.takeawayCard.lh}px`,
                          fontWeight: HORIZON.type.takeawayCard.weight,
                          color: '#E9D5FF',
                          letterSpacing: '-0.02em',
                          maxWidth: '64ch'
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        {viewMode === 'simplified' 
                          ? analysis.key_takeaway.split('→')[0].trim() + '...'
                          : analysis.key_takeaway
                        }
                      </motion.p>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </>
      )}
    </AnimatePresence>
  );
}

export default React.memo(MemoDrawer);