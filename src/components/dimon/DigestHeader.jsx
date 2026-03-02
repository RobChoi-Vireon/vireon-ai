import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence, useSpring } from 'framer-motion';
import { Calendar, Share, Info, Clock, Database, Zap, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const HORIZON_EASE = [0.26, 0.11, 0.26, 1.0];

// Utility: Calculate relative luminance from hex color (WCAG standard)
const getLuminance = (hex) => {
  // Handle 3-digit hex codes
  if (hex.length === 4) {
    hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
  }
  const rgb = parseInt(hex.slice(1), 16);
  const r = ((rgb >> 16) & 0xff) / 255;
  const g = ((rgb >> 8) & 0xff) / 255;
  const b = (rgb & 0xff) / 255;

  const [rs, gs, bs] = [r, g, b].map(c => {
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  // WCAG formula for relative luminance
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

// Utility: Get color at position along gradient (0..1)
const getColorAtPosition = (t) => {
  // Gradient: #62CFFF → #C9A2FF → #77E9CE
  const colors = [
    { pos: 0, hex: '#62CFFF' },
    { pos: 0.5, hex: '#C9A2FF' },
    { pos: 1, hex: '#77E9CE' }
  ];

  if (t <= 0) return colors[0].hex;
  if (t >= 1) return colors[2].hex;

  // Find the two colors to interpolate between
  let lower = colors[0];
  let upper = colors[1];

  for (let i = 0; i < colors.length - 1; i++) {
    if (t >= colors[i].pos && t <= colors[i + 1].pos) {
      lower = colors[i];
      upper = colors[i + 1];
      break;
    }
  }

  // Interpolate RGB values
  const range = upper.pos - lower.pos;
  const rangeT = (t - lower.pos) / range;

  const lowerRgb = parseInt(lower.hex.slice(1), 16);
  const upperRgb = parseInt(upper.hex.slice(1), 16);

  const r1 = (lowerRgb >> 16) & 0xff;
  const g1 = (lowerRgb >> 8) & 0xff;
  const b1 = lowerRgb & 0xff;

  const r2 = (upperRgb >> 16) & 0xff;
  const g2 = (upperRgb >> 8) & 0xff;
  const b2 = upperRgb & 0xff;

  const r = Math.round(r1 + (r2 - r1) * rangeT);
  const g = Math.round(g1 + (g2 - g1) * rangeT);
  const b = Math.round(b1 + (b2 - b1) * rangeT);

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

// Enhanced Arc Tooltip with contrast-aware styling
const ArcTooltip = ({ segment, position, isVisible }) => {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const [isLightVariant, setIsLightVariant] = useState(false);

  // Smooth spring for position changes
  const springConfig = { stiffness: 400, damping: 35, mass: 0.5 };
  const x = useSpring(position.x, springConfig);
  const y = useSpring(position.y - 60, springConfig);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldReduceMotion(mediaQuery.matches);
    const handler = (e) => setShouldReduceMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (!segment || !isVisible) return;

    const arcXRange = 220;
    const relativeX = segment.x - 10;
    const t = Math.max(0, Math.min(1, relativeX / arcXRange));

    const color = getColorAtPosition(t);
    const luminance = getLuminance(color);

    setIsLightVariant(luminance > 0.65);
  }, [segment, position, isVisible]);

  // Update spring values when position changes
  useEffect(() => {
    x.set(position.x);
    y.set(position.y - 60);
  }, [position.x, position.y, x, y]);

  if (!isVisible || !segment) return null;

  const darkVariant = {
    background: 'rgba(10, 12, 15, 0.92)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.10)',
    boxShadow: '0 6px 22px rgba(0,0,0,0.35)',
    titleColor: 'rgba(255, 255, 255, 0.88)',
    metaColor: 'rgba(255, 255, 255, 0.72)',
    innerHighlight: 'linear-gradient(180deg, rgba(255,255,255,0.07), transparent)'
  };

  const lightVariant = {
    background: 'rgba(255, 255, 255, 0.92)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(0, 0, 0, 0.10)',
    boxShadow: '0 6px 22px rgba(0,0,0,0.25)',
    titleColor: 'rgba(11, 14, 18, 0.88)',
    metaColor: 'rgba(11, 14, 18, 0.72)',
    innerHighlight: 'linear-gradient(180deg, rgba(0,0,0,0.05), transparent)'
  };

  const currentVariant = isLightVariant ? lightVariant : darkVariant;

  return (
    <motion.div
      className="absolute pointer-events-none z-20"
      style={{
        left: 0,
        top: 0,
        x,
        y,
        translateX: '-50%',
        willChange: 'transform, opacity'
      }}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={shouldReduceMotion ? { duration: 0 } : {
        duration: 0.14,
        ease: [0.22, 0.61, 0.36, 1]
      }}
    >
      {/* Local dim mask */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: 'radial-gradient(circle, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.00) 70%)',
          filter: 'blur(2px)',
          borderRadius: '14px',
          transform: 'translateY(4px) scale(1.1)',
          opacity: 1
        }}
        aria-hidden="true"
      />

      <motion.div
        className="relative px-3 py-2 rounded-xl text-xs font-medium"
        style={{
          background: currentVariant.background,
          backdropFilter: currentVariant.backdropFilter,
          WebkitBackdropFilter: currentVariant.WebkitBackdropFilter,
          border: currentVariant.border,
          boxShadow: currentVariant.boxShadow,
          borderRadius: '12px'
        }}
        animate={{
          background: currentVariant.background
        }}
        transition={{
          duration: 0.14,
          ease: [0.22, 0.61, 0.36, 1]
        }}
      >
        {/* Inner highlight */}
        <div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            background: currentVariant.innerHighlight,
            opacity: 0.6,
            borderRadius: '12px'
          }}
          aria-hidden="true"
        />

        <div className="relative z-10">
          <div
            className="font-semibold mb-0.5"
            style={{ color: currentVariant.titleColor }}
          >
            {segment.name}
          </div>
          <div
            className="opacity-90"
            style={{ color: currentVariant.metaColor }}
          >
            {segment.value}% {segment.sentiment}
          </div>
        </div>

        {/* Arrow */}
        <div
          className="absolute -bottom-1 left-1/2 -translate-x-1/2"
          style={{
            width: 0,
            height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: `6px solid ${isLightVariant ? 'rgba(255,255,255,0.92)' : 'rgba(10,12,15,0.92)'}`,
            opacity: 0.6,
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
          }}
          aria-hidden="true"
        />
      </motion.div>
    </motion.div>
  );
};

// Mobile metrics pills for nucleus tap
const MobileMetricsPills = ({ isVisible, metrics }) => {
  if (!isVisible || !metrics) return null;

  const positions = [
    { x: -80, y: -20 },
    { x: 80, y: -20 },
    { x: -80, y: 20 },
    { x: 80, y: 20 }
  ];

  return (
    <AnimatePresence>
      {metrics.map((metric, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{
            left: `50%`,
            top: `50%`,
            transform: `translate(calc(-50% + ${positions[i].x}px), calc(-50% + ${positions[i].y}px))`
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.22, delay: i * 0.05, ease: [0.22, 0.61, 0.36, 1] }}
        >
          <div
            className="px-2 py-1 rounded-md text-[10px] font-semibold whitespace-nowrap"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'rgba(255, 255, 255, 0.8)'
            }}
          >
            {metric.label}: {metric.value}%
          </div>
        </motion.div>
      ))}
    </AnimatePresence>
  );
};

export default function DigestHeader({
  targetDate,
  setTargetDate,
  isLoading,
  sessionData = null,
  error = null
}) {
  // Bind to top_block with null-safe fallbacks
  const lastUpdated = sessionData?.top_block?.as_of?.updated_ago || "—";
  const dateDisplay = sessionData?.top_block?.as_of?.date_display || "—";
  const stats = {
    sources: sessionData?.top_block?.overview?.sources_count || 0,
    signals: sessionData?.top_block?.overview?.signals_count || 0
  };
  const sentimentPosition = sessionData?.top_block?.sentiment?.position || "neutral";
  const sentimentConfidence = sessionData?.top_block?.sentiment?.confidence || 0;
  const insightLine = sessionData?.top_block?.sentiment?.commentary || "Markets are being evaluated.";

  // Continuous sentiment score: 0 = full risk-on, 50 = neutral, 100 = full risk-off
  const sentimentScore = sessionData?.top_block?.sentiment?.sentiment_score ?? 50;

  // Derive label from score (5 tiers for nuanced display)
  const sentimentLabel = (() => {
    if (sentimentScore <= 15) return "Risk-On";
    if (sentimentScore <= 35) return "Cautiously Risk-On";
    if (sentimentScore <= 65) return "Market Neutral";
    if (sentimentScore <= 85) return "Cautiously Risk-Off";
    return "Risk-Off";
  })();

  // Map sentiment score to sentimentFlow for gauge visualization
  // Score 0 = full green (risk-on), 50 = balanced, 100 = full red (risk-off)
  const sentimentFlow = (() => {
    const t = sentimentScore / 100;
    const green = Math.round(60 - (t * 45));
    const red = Math.round(15 + (t * 45));
    const blue = Math.round(100 - green - red);
    return { green, blue, red };
  })();
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredSegment, setHoveredSegment] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isMobileMetricsExpanded, setIsMobileMetricsExpanded] = useState(false);
  const [focusedSegmentIndex, setFocusedSegmentIndex] = useState(-1);

  const headerRef = useRef(null);
  const arcRef = useRef(null);
  const rafRef = useRef(null);
  const lastHoverTimeRef = useRef(0);
  const lastSegmentRef = useRef(null);
  const pointerPosRef = useRef({ x: 0, y: 0 });

  // Precomputed arc samples for butter-smooth tracking
  const arcSamples = useMemo(() => {
    const samples = [];
    const sampleCount = 256;
    const arcStart = 10;
    const arcEnd = 230;
    const arcWidth = arcEnd - arcStart;

    for (let i = 0; i < sampleCount; i++) {
      const t = i / (sampleCount - 1);
      const x = arcStart + (arcWidth * t);
      // Approximate y position on arc (using simple circular arc)
      const radius = 110;
      const angle = Math.PI * (1 - t); // Angle from 0 (right) to PI (left) for a semi-circle
      const calculatedY = 110 - (radius * Math.sin(angle)); // Adjusted for arc center at y=110

      // Determine segment based on t (0-1 range for the entire arc)
      // Adjust these thresholds based on how the segments are defined
      let segmentId = -1;
      // Assuming segments are roughly equal parts of the arc
      if (t >= 0 && t < (1 / 4)) segmentId = 0; // Credit
      else if (t >= (1 / 4) && t < (2 / 4)) segmentId = 1; // Equities
      else if (t >= (2 / 4) && t < (3 / 4)) segmentId = 2; // Commodities
      else if (t >= (3 / 4) && t <= 1) segmentId = 3; // FX


      // Calculate luminance at this position (not directly used here, but kept for consistency if needed later)
      const color = getColorAtPosition(t);
      const luminance = getLuminance(color);

      samples.push({ x, y: calculatedY, t, segmentId, luminance });
    }

    return samples;
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldReduceMotion(mediaQuery.matches);

    const handler = (e) => setShouldReduceMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Load sequence trigger
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const getDominantSentiment = () => {
    const { green, blue, red } = sentimentFlow;
    const total = green + blue + red;
    const greenPct = (green / total) * 100;
    const bluePct = (blue / total) * 100;
    const redPct = (red / total) * 100;

    if (greenPct > bluePct && greenPct > redPct) return 'opportunity';
    if (redPct > bluePct && redPct > greenPct) return 'risk';
    return 'neutral';
  };

  const getActiveSentimentPosition = () => {
    if (!sentimentFlow) return 120; // Default to center if no sentimentFlow
    const { green, blue, red } = sentimentFlow;
    const total = green + blue + red;

    if (total === 0) return 120; // Center position if no data

    const arcStart = 10;
    const arcEnd = 230;
    const arcWidth = arcEnd - arcStart;

    const greenPct = green / total;
    const bluePct = blue / total;
    const redPct = red / total;

    const greenZoneEnd = arcStart + (arcWidth * greenPct);
    const blueZoneEnd = greenZoneEnd + (arcWidth * bluePct);

    const sentiment = getDominantSentiment();

    if (sentiment === 'opportunity') {
      return arcStart + (arcWidth * greenPct * 0.5);
    } else if (sentiment === 'risk') {
      return blueZoneEnd + (arcWidth * redPct * 0.5);
    } else {
      return greenZoneEnd + (arcWidth * bluePct * 0.5);
    }
  };

  const getSentimentProps = () => {
    if (!sentimentFlow) return { baseHue: '#8DC4FF', luminance: 0.70, motionSpeed: 1.0, bloom: 0.4 }; // Default if no data
    const sentiment = getDominantSentiment();
    switch (sentiment) {
      case 'opportunity':
        return { baseHue: '#73E6D2', luminance: 0.78, motionSpeed: 1.2, bloom: 0.6 };
      case 'risk':
        return { baseHue: '#ECA5FF', luminance: 0.83, motionSpeed: 1.3, bloom: 0.75 };
      default:
        return { baseHue: '#8DC4FF', luminance: 0.70, motionSpeed: 1.0, bloom: 0.4 };
    }
  };

  const sentimentProps = getSentimentProps();
  const activeNodeX = getActiveSentimentPosition();

  // Calculate nucleus color based on sentiment
  const getNucleusColor = () => {
    if (!sentimentFlow) return '#8DC4FF';
    const sentiment = getDominantSentiment();
    if (sentiment === 'opportunity') return '#73E6D2'; // Mint
    if (sentiment === 'risk') return '#ECA5FF'; // Lavender
    return '#8DC4FF'; // Blue
  };

  const nucleusColor = getNucleusColor();

  // Arc segment definitions (4 invisible hit zones)
  const arcSegments = [
    { name: 'Credit', value: 61, sentiment: 'risk-off', startAngle: 0, endAngle: 45, x: 45, y: 95 },
    { name: 'Equities', value: 58, sentiment: 'neutral', startAngle: 45, endAngle: 90, x: 90, y: 65 },
    { name: 'Commodities', value: 52, sentiment: 'mixed', startAngle: 90, endAngle: 135, x: 150, y: 65 },
    { name: 'FX', value: 48, sentiment: 'risk-on', startAngle: 135, endAngle: 180, x: 195, y: 95 }
  ];

  // Mobile metrics for nucleus tap
  const mobileMetrics = [
    { label: 'Credit', value: 61 },
    { label: 'Equities', value: 58 },
    { label: 'Commodities', value: 52 },
    { label: 'FX', value: 48 }
  ];

  // Find nearest sample point with hysteresis
  const findNearestSample = useCallback((clientX, clientY) => {
    if (!arcRef.current || arcSamples.length === 0) return null;

    const rect = arcRef.current.getBoundingClientRect();
    // Transform client coordinates to SVG viewBox coordinates
    const svgX = ((clientX - rect.left) / rect.width) * 240;
    const svgY = ((clientY - rect.top) / rect.height) * 120;

    let minDist = Infinity;
    let nearestSample = null;

    for (const sample of arcSamples) {
      const dist = Math.sqrt(
        Math.pow(sample.x - svgX, 2) +
        Math.pow(sample.y - svgY, 2)
      );

      if (dist < minDist) {
        minDist = dist;
        nearestSample = sample;
      }
    }

    // Apply hysteresis: require 14px spatial dead-zone or 100ms time to switch segments
    const now = Date.now();
    if (lastSegmentRef.current !== null &&
      nearestSample && lastSegmentRef.current.segmentId !== nearestSample.segmentId) {

      if (minDist < 14 && (now - lastHoverTimeRef.current) < 100) {
        return arcSamples[lastSegmentRef.current.segmentId * (arcSamples.length / 4) + Math.floor((arcSamples.length / 8))]; // Return a sample from the *center* of the previous segment for consistency
      }
    }

    if (nearestSample && nearestSample.segmentId !== lastSegmentRef.current?.segmentId) {
      lastHoverTimeRef.current = now;
    }

    lastSegmentRef.current = nearestSample;
    return nearestSample;
  }, [arcSamples]);

  // Butter-smooth hover handler with rAF loop
  const handlePointerMove = useCallback((event) => {
    if (!arcRef.current || shouldReduceMotion) return;

    pointerPosRef.current = {
      x: event.clientX,
      y: event.clientY
    };

    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(function updateTooltip() {
        const sample = findNearestSample(
          pointerPosRef.current.x,
          pointerPosRef.current.y
        );

        if (sample && sample.segmentId >= 0) {
          const segment = arcSegments[sample.segmentId];
          if (segment) {
            setTooltipPosition({ x: segment.x, y: segment.y });
            setHoveredSegment(segment);
          }
        } else {
          setHoveredSegment(null);
        }

        rafRef.current = null;
      });
    }
  }, [arcSegments, findNearestSample, shouldReduceMotion]);

  const handlePointerEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handlePointerLeave = useCallback(() => {
    setIsHovered(false);
    setHoveredSegment(null);
    lastSegmentRef.current = null;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  // Keyboard navigation
  const handleSegmentKeyDown = useCallback((e, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const segment = arcSegments[index];
      setTooltipPosition({ x: segment.x, y: segment.y });
      setHoveredSegment(segment);
      setFocusedSegmentIndex(index);
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (index + 1) % arcSegments.length;
      document.querySelector(`[data-segment-index="${nextIndex}"]`)?.focus();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (index - 1 + arcSegments.length) % arcSegments.length;
      document.querySelector(`[data-segment-index="${prevIndex}"]`)?.focus();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setHoveredSegment(null);
      setFocusedSegmentIndex(-1);
    }
  }, [arcSegments]);

  const handleSegmentFocus = useCallback((segment, index) => {
    if (!shouldReduceMotion) {
      setTooltipPosition({ x: segment.x, y: segment.y });
      setHoveredSegment(segment);
      setFocusedSegmentIndex(index);
    }
  }, [shouldReduceMotion]);

  const handleSegmentBlur = useCallback(() => {
    setHoveredSegment(null);
    setFocusedSegmentIndex(-1);
  }, []);

  // Cleanup rAF on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <motion.header
      ref={headerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.26, ease: [0.22, 0.61, 0.36, 1] }}
      onMouseEnter={handlePointerEnter}
      onMouseLeave={handlePointerLeave}
      className="halo-spectrum-header overflow-hidden mb-12"
      style={{
        borderRadius: '28px',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        boxShadow: 'inset 0 0 10px rgba(0,0,0,0.20), 0 12px 48px rgba(0,0,0,0.4), 0 2px 16px rgba(0,0,0,0.3)',
        willChange: 'opacity, filter',
        transform: 'translateZ(0)',
        perspective: 'none'
      }}
    >
      {/* Dual-Layer Glass Surface */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          backdropFilter: 'blur(18px) saturate(1.05) brightness(1.08)',
          WebkitBackdropFilter: 'blur(18px) saturate(1.05) brightness(1.08)',
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, rgba(0, 0, 0, 0.10) 100%)',
          zIndex: 0
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.26, ease: [0.22, 0.61, 0.36, 1] }}
      />

      {/* Directional Top Light Vignette */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          top: '-10%',
          left: '48%',
          width: '120%',
          height: '80%',
          marginLeft: '-60%',
          background: 'radial-gradient(ellipse 120% 80% at 48% 10%, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0.12) 70%)',
          zIndex: 1
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.22, delay: 0.12, ease: [0.22, 0.61, 0.36, 1] }}
      />

      {/* Depth Balance Layer - Right Side Gradient Plane */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          top: 0,
          right: 0,
          width: '50%',
          height: '100%',
          background: 'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(255,255,255,0.03) 100%)',
          zIndex: 1,
          borderRadius: '0 28px 28px 0'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.4, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        aria-hidden="true"
      />

      <div className="relative container mx-auto px-6 lg:px-10 pt-10 pb-4" style={{ zIndex: 10 }}>

        <div className="flex flex-col lg:flex-row items-start justify-between gap-6">

          <motion.div
            className="flex-1 space-y-2.5 w-full"
          >

            {/* OS Horizon V2 Typography — System-Level Hero */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 8 }}
              transition={{ duration: 0.36, delay: 0.12, ease: [0.22, 0.61, 0.36, 1] }}
              className="relative"
              style={{ marginBottom: '20px', marginTop: '0px' }}
            >
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                style={{
                  fontWeight: 700,
                  letterSpacing: '-0.02em'
                }}
              >
                <span style={{
                  color: 'rgba(255,255,255,0.88)',
                  textShadow: '0 0 2px rgba(255,255,255,0.1)'
                }}>
                  Macro{' '}
                </span>
                <span
                  className="halo-gradient-text"
                  style={{
                    background: 'linear-gradient(90deg, #7DC4F5 0%, #B8A8FF 50%, #D8B8FF 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    backgroundSize: '200% auto',
                    filter: 'brightness(1.05)'
                  }}
                >
                  Signals
                </span>
              </h1>
            </motion.div>

            {/* OS Horizon V2 Tagline — Improved Contrast */}
            <motion.p
              className="text-sm italic"
              style={{
                color: 'rgba(255,255,255,0.78)',
                fontWeight: 500,
                letterSpacing: '0.01em',
                marginBottom: '16px'
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: isLoaded ? 1 : 0 }}
              transition={{ duration: 0.22, delay: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
            >
              Global posture, distilled in real time.
            </motion.p>

            {/* OS Horizon V2 Info Capsules — Unified Glass Pills */}
            <motion.div
              className="flex flex-wrap items-center gap-2.5"
              style={{ marginBottom: '18px' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: isLoaded ? 1 : 0 }}
              transition={{ duration: 0.22, delay: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
            >
              {/* Updated Capsule — OS Horizon Glass */}
              <motion.div
                className="glass-info-capsule flex items-center gap-2 px-4 py-2 rounded-[20px]"
                style={{
                  background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.048) 0%, rgba(255, 255, 255, 0.035) 100%)',
                  backdropFilter: 'blur(32px) saturate(165%)',
                  WebkitBackdropFilter: 'blur(32px) saturate(165%)',
                  border: 'none',
                  boxShadow: `
                    0 4px 28px rgba(0,0,0,0.08),
                    0 0 18px rgba(0,0,0,0.04),
                    inset 0 1px 1.5px rgba(255,255,255,0.05)
                  `
                }}
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: isLoaded ? 1 : 0.96, opacity: isLoaded ? 1 : 0 }}
                transition={{ duration: 0.22, delay: 0.32, ease: [0.22, 0.61, 0.36, 1] }}
                whileHover={shouldReduceMotion ? {} : {
                  background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.058) 0%, rgba(255, 255, 255, 0.045) 100%)',
                  boxShadow: `
                    0 6px 28px rgba(0,0,0,0.10),
                    0 0 22px rgba(110, 180, 255, 0.03),
                    inset 0 1px 2px rgba(255,255,255,0.07)
                  `
                }}
                tabIndex={0}
                role="button"
                aria-label={`Updated ${lastUpdated}`}
              >
                <Clock className="w-3.5 h-3.5" style={{ color: sentimentProps.baseHue, opacity: 0.92, strokeWidth: 2.0, filter: 'brightness(1.03)' }} />
                <span className="text-[13px] font-medium" style={{ color: 'rgba(255,255,255,0.82)' }}>
                  Updated <span style={{ color: 'rgba(255,255,255,0.96)', fontWeight: 600 }}>{lastUpdated}</span>
                </span>
              </motion.div>

              <span style={{ color: 'rgba(255,255,255,0.28)' }}>•</span>

              {/* Sources Capsule — OS Horizon Glass */}
              <motion.div
                className="glass-info-capsule flex items-center gap-2 px-4 py-2 rounded-[20px]"
                style={{
                  background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.048) 0%, rgba(255, 255, 255, 0.035) 100%)',
                  backdropFilter: 'blur(32px) saturate(165%)',
                  WebkitBackdropFilter: 'blur(32px) saturate(165%)',
                  border: 'none',
                  boxShadow: `
                    0 4px 28px rgba(0,0,0,0.08),
                    0 0 18px rgba(0,0,0,0.04),
                    inset 0 1px 1.5px rgba(255,255,255,0.05)
                  `
                }}
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: isLoaded ? 1 : 0.96, opacity: isLoaded ? 1 : 0 }}
                transition={{ duration: 0.22, delay: 0.38, ease: [0.22, 0.61, 0.36, 1] }}
                whileHover={shouldReduceMotion ? {} : {
                  background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.058) 0%, rgba(255, 255, 255, 0.045) 100%)',
                  boxShadow: `
                    0 6px 28px rgba(0,0,0,0.10),
                    0 0 22px rgba(110, 180, 255, 0.03),
                    inset 0 1px 2px rgba(255,255,255,0.07)
                  `
                }}
                tabIndex={0}
                role="button"
                aria-label={`${stats.sources} sources`}
              >
                <Database className="w-3.5 h-3.5" style={{ color: sentimentProps.baseHue, opacity: 0.92, strokeWidth: 2.0, filter: 'brightness(1.03)' }} />
                <span className="text-[13px] font-medium" style={{ color: 'rgba(255,255,255,0.82)' }}>
                  Sources <span style={{ color: 'rgba(255,255,255,0.96)', fontWeight: 600 }}>{stats.sources}</span>
                </span>
              </motion.div>

              <span style={{ color: 'rgba(255,255,255,0.28)' }}>•</span>

              {/* Signals Capsule — OS Horizon Glass */}
              <motion.div
                className="glass-info-capsule flex items-center gap-2 px-4 py-2 rounded-[20px]"
                style={{
                  background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.048) 0%, rgba(255, 255, 255, 0.035) 100%)',
                  backdropFilter: 'blur(32px) saturate(165%)',
                  WebkitBackdropFilter: 'blur(32px) saturate(165%)',
                  border: 'none',
                  boxShadow: `
                    0 4px 28px rgba(0,0,0,0.08),
                    0 0 18px rgba(0,0,0,0.04),
                    inset 0 1px 1.5px rgba(255,255,255,0.05)
                  `
                }}
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: isLoaded ? 1 : 0.96, opacity: isLoaded ? 1 : 0 }}
                transition={{ duration: 0.22, delay: 0.44, ease: [0.22, 0.61, 0.36, 1] }}
                whileHover={shouldReduceMotion ? {} : {
                  background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.058) 0%, rgba(255, 255, 255, 0.045) 100%)',
                  boxShadow: `
                    0 6px 28px rgba(0,0,0,0.10),
                    0 0 22px rgba(110, 180, 255, 0.03),
                    inset 0 1px 2px rgba(255,255,255,0.07)
                  `
                }}
                tabIndex={0}
                role="button"
                aria-label={`${stats.signals} signals`}
              >
                <Zap className="w-3.5 h-3.5" style={{ color: sentimentProps.baseHue, opacity: 0.92, strokeWidth: 2.0, filter: 'brightness(1.03)' }} />
                <span className="text-[13px] font-medium" style={{ color: 'rgba(255,255,255,0.82)' }}>
                  Signals <span style={{ color: sentimentProps.baseHue, fontWeight: 700, filter: 'brightness(1.08)' }}>{stats.signals}</span>
                </span>
              </motion.div>
            </motion.div>

            {/* Halo Spectrum Arc */}
            <motion.div
              className="relative pt-2 pb-2 w-full"
              style={{ transform: 'translateY(0px)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: isLoaded ? 1 : 0 }}
              transition={{ duration: 0.22, delay: 0.42, ease: [0.22, 0.61, 0.36, 1] }}
            >
              <label
                className="text-sm font-semibold tracking-wide block"
                style={{
                  color: 'rgba(255,255,255,0.63)',
                  marginBottom: '32px'
                }}
              >
                How markets are feeling today, based on {stats.sources} sources
              </label>

              {/* Arc Visualization */}
              <div className="relative w-full">
                <div
                  className="max-w-xl relative"
                  ref={arcRef}
                  onPointerMove={handlePointerMove}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none'
                  }}
                >
                  {/* Error State */}
                  {error && (
                    <motion.div
                      className="mb-4 p-3 rounded-xl flex items-center gap-2"
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(239, 68, 68, 0.3)'
                      }}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <AlertCircle className="w-4 h-4 text-red-400" />
                      <span className="text-sm text-red-300">{error}</span>
                    </motion.div>
                  )}

                  {/* Loading State */}
                  {isLoading && !isLoaded && (
                    <motion.div
                      className="flex flex-col items-center justify-center py-12"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div
                        className="w-12 h-12 rounded-full border-4 border-white/10 border-t-blue-400"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      />
                      <span className="text-sm text-white/60 mt-3">Loading market mood...</span>
                    </motion.div>
                  )}

                  {/* Empty State */}
                  {!isLoading && !error && !sentimentFlow && (
                    <motion.div
                      className="flex flex-col items-center justify-center py-12"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.4 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Database className="w-8 h-8 text-white/40 mb-2" />
                      <span className="text-sm text-white/60">Waiting for market updates...</span>
                    </motion.div>
                  )}

                  {/* Main Arc Visualization */}
                  {!isLoading && !error && sentimentFlow && (
                    <svg
                      viewBox="0 0 240 120"
                      className="w-full h-auto"
                      style={{
                        overflow: 'visible',
                        background: 'transparent'
                      }}
                      preserveAspectRatio="xMidYMid meet"
                      aria-label="Market mood visualization"
                      role="img"
                    >
                      <defs>
                        {/* Core Stroke Gradient */}
                        <linearGradient id="haloGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#62CFFF" stopOpacity="0.95">
                            <animate
                              attributeName="stop-color"
                              values="#62CFFF;#77E9CE;#62CFFF"
                              dur="8s"
                              repeatCount="indefinite"
                              calcMode="spline"
                              keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"
                            />
                          </stop>
                          <stop offset="50%" stopColor="#C9A2FF" stopOpacity="0.95">
                            <animate
                              attributeName="stop-color"
                              values="#C9A2FF;#62CFFF;#C9A2FF"
                              dur="8s"
                              repeatCount="indefinite"
                              calcMode="spline"
                              keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"
                            />
                          </stop>
                          <stop offset="100%" stopColor="#77E9CE" stopOpacity="0.95">
                            <animate
                              attributeName="stop-color"
                              values="#77E9CE;#C9A2FF;#77E9CE"
                              dur="8s"
                              repeatCount="indefinite"
                              calcMode="spline"
                              keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"
                            />
                          </stop>
                        </linearGradient>

                        {/* Enhanced Atmosphere Gradient with Top Fade */}
                        <linearGradient id="atmosphereFade" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopOpacity="0.04" />
                          <stop offset="15%" stopOpacity="0.08" />
                          <stop offset="25%" stopOpacity="0.12" />
                          <stop offset="100%" stopOpacity="0.15" />
                        </linearGradient>

                        <filter id="atmosphereGlow" x="-50%" y="-50%" width="200%" height="200%">
                          <feGaussianBlur stdDeviation="24" result="blur" />
                          <feFlood floodColor="rgba(120,200,255,1)" />
                          <feComposite in2="blur" operator="in" />
                        </filter>

                        {/* Rim Light Filter */}
                        <filter id="rimLight" x="-50%" y="-50%" width="200%" height="200%">
                          <feGaussianBlur stdDeviation="6" result="blur" />
                          <feFlood floodColor="rgba(255,255,255,0.06)" />
                          <feComposite in2="blur" operator="in" />
                        </filter>

                        {/* Simple Nucleus Gradient - Clean Apple Style */}
                        <radialGradient id="nucleusSimpleGradient">
                          <stop offset="0%" stopColor={nucleusColor} stopOpacity="1" />
                          <stop offset="50%" stopColor={nucleusColor} stopOpacity="0.8" />
                          <stop offset="100%" stopColor={nucleusColor} stopOpacity="0.4" />
                        </radialGradient>

                        {/* Soft Ambient Glow */}
                        <filter id="nucleusAmbientGlow" x="-100%" y="-100%" width="300%" height="300%">
                          <feGaussianBlur stdDeviation="8" result="blur" />
                          <feFlood floodColor={nucleusColor} floodOpacity="0.3" />
                          <feComposite in2="blur" operator="in" result="glow" />
                          <feMerge>
                            <feMergeNode in="glow" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>

                      {/* Atmosphere Layer with gradient fade */}
                      <motion.path
                        d="M 10 110 A 110 110 0 0 1 230 110"
                        fill="none"
                        stroke="url(#atmosphereFade)"
                        strokeWidth="16"
                        strokeLinecap="round"
                        filter="url(#atmosphereGlow)"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.95 }}
                        transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        style={{ mixBlendMode: 'screen', transformOrigin: 'center' }}
                      />

                      {/* Rim Light Layer — Softened */}
                      <motion.path
                        d="M 10 110 A 110 110 0 0 1 230 110"
                        fill="none"
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth="18"
                        strokeLinecap="round"
                        filter="url(#rimLight)"
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: isLoaded ? 0.95 : 0, scale: isLoaded ? 1 : 0.96 }}
                        transition={{ duration: 1.1, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
                        style={{ mixBlendMode: 'screen', transformOrigin: 'center' }}
                      />

                      {/* Core Stroke — Refined Opacity */}
                      <motion.path
                        d="M 10 110 A 110 110 0 0 1 230 110"
                        fill="none"
                        stroke="url(#haloGradient)"
                        strokeWidth="15"
                        strokeLinecap="round"
                        opacity="0.95"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ 
                          pathLength: shouldReduceMotion ? 1 : (isLoaded ? 1 : 0),
                          opacity: shouldReduceMotion ? 1 : (isLoaded ? 0.95 : 0)
                        }}
                        transition={shouldReduceMotion ? {} : {
                          pathLength: {
                            duration: 1.4,
                            delay: 0.8,
                            ease: [0.16, 1, 0.3, 1]
                          },
                          opacity: {
                            duration: 0.8,
                            delay: 0.8,
                            ease: [0.16, 1, 0.3, 1]
                          }
                        }}
                      />

                      {/* Interactive Segments with Ring Overlay */}
                      {arcSegments.map((segment, i) => (
                        <g key={i}>
                          {/* Hover ring overlay with butter-smooth transitions */}
                          <motion.path
                            d="M 10 110 A 110 110 0 0 1 230 110"
                            fill="none"
                            stroke="rgba(255, 255, 255, 0.22)"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            style={{
                              mixBlendMode: 'screen',
                              clipPath: `inset(0 ${100 - (segment.endAngle / 180 * 100)}% 0 ${segment.startAngle / 180 * 100}%)`
                            }}
                            initial={{ opacity: 0 }}
                            animate={{
                              opacity: (hoveredSegment?.name === segment.name || focusedSegmentIndex === i) ? 1 : 0
                            }}
                            transition={shouldReduceMotion ? { duration: 0 } : {
                              duration: 0.14,
                              ease: [0.22, 0.61, 0.36, 1]
                            }}
                          />

                          {/* Invisible hit area with proper ARIA */}
                          <motion.path
                            d="M 10 110 A 110 110 0 0 1 230 110"
                            fill="none"
                            stroke="transparent"
                            strokeWidth="40"
                            strokeLinecap="round"
                            className="cursor-pointer"
                            style={{
                              pointerEvents: 'stroke',
                              clipPath: `inset(0 ${100 - (segment.endAngle / 180 * 100)}% 0 ${segment.startAngle / 180 * 100}%)`
                            }}
                            onFocus={() => handleSegmentFocus(segment, i)}
                            onBlur={handleSegmentBlur}
                            onKeyDown={(e) => handleSegmentKeyDown(e, i)}
                            tabIndex={0}
                            role="button"
                            data-segment-index={i}
                            aria-label={`${segment.name} sentiment: ${segment.value}% ${segment.sentiment}`}
                          />
                        </g>
                      ))}

                      {/* Simple Apple-Grade Nucleus */}
                      {!shouldReduceMotion && sentimentFlow && (
                        <g filter="url(#nucleusAmbientGlow)">
                          {/* Soft Background Glow */}
                          <motion.circle
                            cx={activeNodeX}
                            cy={110}
                            r="16"
                            fill={nucleusColor}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{
                              opacity: isLoaded ? 0.15 : 0,
                              scale: isLoaded ? 1 : 0.8
                            }}
                            transition={{
                              duration: 1.0,
                              delay: 2.0,
                              ease: [0.16, 1, 0.3, 1]
                            }}
                            style={{
                              filter: 'blur(12px)',
                              transformOrigin: 'center'
                            }}
                          />

                          {/* Main Nucleus Orb */}
                          <motion.circle
                            cx={activeNodeX}
                            cy={110}
                            r="8"
                            fill="url(#nucleusSimpleGradient)"
                            className="cursor-pointer md:cursor-default"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{
                              scale: isLoaded ? (isMobileMetricsExpanded ? 1.15 : [0.95, 1.0, 0.998, 1.002, 1.0]) : 0,
                              opacity: isLoaded ? (isMobileMetricsExpanded ? 1 : [0, 0.9, 0.95, 0.9]) : 0
                            }}
                            transition={{
                              scale: {
                                duration: isMobileMetricsExpanded ? 0.22 : 6,
                                delay: isMobileMetricsExpanded ? 0 : 2.1,
                                ease: isMobileMetricsExpanded ? [0.22, 0.61, 0.36, 1] : [0.25, 0.1, 0.25, 1],
                                repeat: isMobileMetricsExpanded ? 0 : Infinity
                              },
                              opacity: {
                                duration: isMobileMetricsExpanded ? 0.3 : 6,
                                delay: 2.1,
                                ease: [0.25, 0.1, 0.25, 1],
                                repeat: isMobileMetricsExpanded ? 0 : Infinity
                              }
                            }}
                            onClick={() => {
                              if ('ontouchstart' in window) {
                                setIsMobileMetricsExpanded(!isMobileMetricsExpanded);
                              }
                            }}
                            style={{
                              touchAction: 'manipulation',
                              backdropFilter: 'blur(4px)',
                              WebkitBackdropFilter: 'blur(4px)',
                              transformOrigin: 'center'
                            }}
                          />

                          {/* Subtle Refraction Highlight */}
                          <motion.ellipse
                            cx={activeNodeX - 2}
                            cy={110 - 2}
                            rx="2.5"
                            ry="3"
                            fill="rgba(255, 255, 255, 0.6)"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{
                              opacity: isLoaded ? 0.4 : 0,
                              scale: isLoaded ? 1 : 0.5
                            }}
                            transition={{
                              duration: 0.8,
                              delay: 2.3,
                              ease: [0.16, 1, 0.3, 1]
                            }}
                            style={{
                              filter: 'blur(0.5px)',
                              transformOrigin: 'center'
                            }}
                          />
                        </g>
                      )}
                    </svg>
                  )}

                  {/* Enhanced Tooltip with Butter Smooth Motion */}
                  <AnimatePresence mode="wait">
                    {hoveredSegment && (
                      <ArcTooltip
                        segment={hoveredSegment}
                        position={tooltipPosition}
                        isVisible={!!hoveredSegment}
                      />
                    )}
                  </AnimatePresence>

                  {/* Mobile Metrics Pills */}
                  {'ontouchstart' in window && (
                    <MobileMetricsPills
                      isVisible={isMobileMetricsExpanded}
                      metrics={mobileMetrics}
                    />
                  )}

                  {/* OS Horizon V2 Arc Context Labels — Refined Positioning */}
                  <div className="flex justify-between text-[11px] px-2 arc-labels" style={{
                    color: 'rgba(255,255,255,0.56)',
                    fontWeight: 500,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    marginTop: '18px',
                    transition: 'color 160ms ease'
                  }}>
                    <span>Risk-On</span>
                    <span>Neutral</span>
                    <span>Risk-Off</span>
                  </div>

                  {/* Current Macro Posture Label */}
                  <motion.div
                    className="text-center"
                    style={{ marginTop: '10px' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isLoaded ? 1 : 0 }}
                    transition={{ duration: 0.28, delay: 1.2 }}
                  >
                    <span 
                      className="inline-block px-3.5 py-1.5 rounded-full text-[11px] font-semibold uppercase"
                      style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        color: 'rgba(255,255,255,0.65)',
                        letterSpacing: '0.06em'
                      }}
                    >
                      {sentimentLabel}
                    </span>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Summary Line - OS Horizon V2 Spacing */}
            <motion.p
              className="text-base leading-relaxed"
              style={{
                color: 'rgba(255,255,255,0.88)',
                fontWeight: 550,
                letterSpacing: '-0.01em',
                maxWidth: '700px',
                marginTop: '12px'
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: isLoaded ? 1 : 0 }}
              transition={{ duration: 0.3, delay: 1.0 }}
            >
              {insightLine}
            </motion.p>
          </motion.div>

          {/* OS Horizon V2 Analysis Panel — Unified Glass Stack */}
          <motion.div
            className="flex flex-col gap-2 flex-shrink-0"
            style={{ marginRight: '16px', marginTop: '8px' }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, x: isLoaded ? 0 : 20 }}
            transition={{ duration: 0.4, delay: 1.3, ease: [0.22, 0.61, 0.36, 1] }}
          >
            {/* OS Horizon V4 Liquid-Glass Analysis Date Capsule */}
            <motion.div
              className="date-glass flex flex-col items-end rounded-[30px] relative overflow-hidden"
              style={{
                background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.048) 0%, rgba(255, 255, 255, 0.034) 100%)',
                backdropFilter: 'blur(36px) saturate(168%)',
                WebkitBackdropFilter: 'blur(36px) saturate(168%)',
                border: '1px solid rgba(255,255,255,0.09)',
                boxShadow: `
                  0 4px 22px rgba(0,0,0,0.08),
                  inset 0 1.5px 0 rgba(255,255,255,0.07),
                  inset 0 -1px 1px rgba(0,0,0,0.03)
                `,
                padding: '14px 16px',
                transform: 'perspective(800px) rotateY(0.8deg)'
              }}
              animate={{
                opacity: [1, 0.97, 1]
              }}
              transition={{
                opacity: { duration: 4.4, repeat: Infinity, ease: "easeInOut" }
              }}
              whileHover={shouldReduceMotion ? {} : {
                scale: 1.01,
                background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.056) 0%, rgba(255, 255, 255, 0.042) 100%)',
                boxShadow: `
                  0 5px 24px rgba(0,0,0,0.10),
                  inset 0 1.5px 0 rgba(255,255,255,0.09),
                  inset 0 -1px 1px rgba(0,0,0,0.03)
                `,
                transition: { type: "spring", stiffness: 290, damping: 28 }
              }}
            >
              {/* Enhanced vertical gradient: top 4% white → bottom 8% ultramarine */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '45%',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 100%)',
                borderRadius: '30px 30px 0 0',
                pointerEvents: 'none'
              }} />

              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '45%',
                background: 'linear-gradient(0deg, rgba(90, 120, 180, 0.08) 0%, transparent 100%)',
                borderRadius: '0 0 30px 30px',
                pointerEvents: 'none'
              }} />

              {/* Subsurface bloom at bottom (5%) */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: '15%',
                right: '15%',
                height: '35%',
                background: 'radial-gradient(ellipse at 50% 100%, rgba(90, 120, 180, 0.05) 0%, transparent 70%)',
                filter: 'blur(10px)',
                pointerEvents: 'none'
              }} />

              {/* Micro-grain texture (1.2%) */}
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                opacity: 0.012,
                mixBlendMode: 'overlay',
                borderRadius: '30px',
                pointerEvents: 'none'
              }} />

              {/* Inner Top Highlight */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: '16%',
                right: '16%',
                height: '2px',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.13), transparent)',
                filter: 'blur(0.8px)',
                pointerEvents: 'none'
              }} />

              {/* Enhanced internal glow (4-6% increase) */}
              <div style={{
                position: 'absolute',
                top: '20%',
                left: '20%',
                right: '20%',
                height: '30%',
                background: 'radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.07) 0%, transparent 70%)',
                filter: 'blur(10px)',
                pointerEvents: 'none'
              }} />

              <label 
                className="text-[10px] font-semibold uppercase tracking-wider relative z-10" 
                style={{ 
                  color: 'rgba(255,255,255,0.60)', 
                  letterSpacing: '0.08em', 
                  marginBottom: '10px'
                  }}
                  >
                  Date
                  </label>

              {/* Date Input in Glass Pocket */}
              <div 
                className="relative rounded-[14px] overflow-hidden"
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  boxShadow: 'inset 0 1.5px 3px rgba(0,0,0,0.10), inset 0 0 8px rgba(0,0,0,0.04)'
                }}
              >
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  disabled={isLoading}
                  className="horizon-date-input text-sm border-none outline-none w-full transition-all"
                  style={{
                    background: 'transparent',
                    color: 'rgba(255, 255, 255, 0.94)',
                    colorScheme: 'dark',
                    padding: '10px 14px',
                    fontWeight: 500
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Embedded Styles - Depth Balance */}
      <style jsx>{`
        /* Arc Interaction Tokens */
        :root {
          --arc-stroke: clamp(12px, 1.6vw, 16px);
          --ring-opacity-max: 0.22;
          --ring-blur: 2px;
          --tooltip-blur: 10px;
          --tooltip-dark: rgba(10,12,15,0.92);
          --tooltip-dark-border: rgba(255,255,255,0.10);
          --tooltip-light: rgba(255,255,255,0.92);
          --tooltip-light-text: #0B0E12;
          --ease-horizon: cubic-bezier(0.22,0.61,0.36,1);
          --ease-depth-breathe: cubic-bezier(0.25, 0.1, 0.25, 1);
        }

        /* Refined Title Gradient Drift - Apple-Grade Animation */
        .halo-gradient-text {
          animation: titleDrift 8s ease-in-out infinite alternate;
          animation-timing-function: cubic-bezier(0.45, 0.05, 0.55, 0.95);
        }

        @keyframes titleDrift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* Unified Motion & Easing System */
        * {
          transition-timing-function: var(--ease-horizon);
        }

        /* Keyboard Focus Ring - Accessibility */
        .glass-info-capsule:focus-visible,
        .date-glass:focus-within {
          outline: 1px solid rgba(255, 255, 255, 0.25);
          outline-offset: 4px;
        }

        .horizon-icon-btn:hover {
          background: rgba(255, 255, 255, 0.1) !important;
          box-shadow: 0 0 0 2px rgba(115, 230, 210, 0.4), 0 4px 12px rgba(115, 230, 210, 0.2);
          transform: scale(1.05);
          transition: all 0.16s var(--ease-horizon);
        }

        .horizon-date-input:focus {
          background: rgba(255, 255, 255, 0.08) !important;
          box-shadow: 0 0 0 1.5px rgba(110, 180, 255, 0.32);
          transition: all 0.18s var(--ease-horizon);
        }

        .horizon-date-input:hover {
          background: rgba(255, 255, 255, 0.08) !important;
        }
        
        /* Depth Field Shadow Fade - Seamless Integration */
        /* OS Horizon V4 Analysis Panel Atmosphere */
        .date-glass {
          position: relative;
        }

        .date-glass::before {
          content: '';
          position: absolute;
          inset: -18px;
          border-radius: 34px;
          background: linear-gradient(
            180deg, 
            rgba(13, 15, 18, 0.045) 0%, 
            rgba(21, 27, 34, 0.05) 100%
          );
          z-index: -1;
          pointer-events: none;
          opacity: 1;
        }

        .date-glass::after {
          content: '';
          position: absolute;
          inset: -18px;
          border-radius: 34px;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.012;
          mix-blend-mode: overlay;
          z-index: -1;
          pointer-events: none;
        }

        /* Arc Segment Focus Enhancement */
        .cursor-pointer:focus-visible {
          outline: 2px solid rgba(255, 255, 255, 0.4);
          outline-offset: 4px;
        }

        /* Performance Optimization */
        .halo-spectrum-header {
          transform: translateZ(0);
          backface-visibility: hidden;
          will-change: opacity, filter;
        }

        /* Tooltip Smooth Transform */
        .absolute.pointer-events-none.z-20 {
          will-change: transform, opacity;
        }

        /* Arc Labels Enhanced Readability */
        .arc-labels {
          font-weight: 500;
          letter-spacing: 0.01em;
          transition: color 160ms ease;
        }

        /* Reduced Motion Support */
        @media (prefers-reduced-motion: reduce) {
          .halo-gradient-text {
            animation: none;
            background-position: 0% 50%;
          }
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.12ms !important;
          }
        }
      `}</style>
    </motion.header>
  );
}