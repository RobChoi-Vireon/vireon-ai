import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, X, TrendingUp, TrendingDown, Minus, ChevronRight } from 'lucide-react';
import LyraLogo from '../core/LyraLogo';

// ============================================================================
// MACRO EQUILIBRIUM HALO - OS HORIZON FINAL (macOS Tahoe)
// 5-second comprehension with calm, coordinated motion
// ============================================================================

// Horizon Design Tokens (macOS Tahoe)
const H = {
  bg: "rgba(10,12,18,.85)",
  glass: "rgba(255,255,255,.06)",
  border: "rgba(255,255,255,.08)",
  textHi: "rgba(255,255,255,.92)",
  textMed: "rgba(255,255,255,.74)",
  textSub: "rgba(255,255,255,.56)",
  sheen: "linear-gradient(120deg, rgba(255,255,255,.08), rgba(255,255,255,0))",
  rates: "#8A7CFF",
  fx: "#6FD4E3",
  growth: "#85E0B8",
  geo: "#E0B56E"
};

// Mock equilibrium data
const MOCK_EQUILIBRIUM = {
  global_posture: "Leaning Risk-Off",
  global_confidence_pct: 68,
  domains: [
    {
      key: "rates",
      label: "Rates",
      strength: 0.82,
      momentum: 0.6,
      confidence_pct: 78,
      translation: "Fed holding firm; terminal rate expectations drift higher on sticky services inflation.",
      ripple_impact: "Credit spreads widen; tech multiples compress further.",
      sparkline: [0.72, 0.74, 0.75, 0.76, 0.78, 0.79, 0.80, 0.81, 0.82]
    },
    {
      key: "fx",
      label: "FX",
      strength: 0.58,
      momentum: -0.2,
      confidence_pct: 65,
      translation: "Dollar range-bound as yield differentials narrow; carry trades unwind slowly.",
      ripple_impact: "EM currencies stabilize; energy imports remain neutral.",
      sparkline: [0.60, 0.59, 0.58, 0.57, 0.58, 0.59, 0.58, 0.57, 0.58]
    },
    {
      key: "growth",
      label: "Growth",
      strength: 0.68,
      momentum: -0.5,
      confidence_pct: 71,
      translation: "China slowdown weighs on global demand; US consumer resilient but moderating.",
      ripple_impact: "Commodity prices soften; defensive rotation begins.",
      sparkline: [0.75, 0.74, 0.72, 0.71, 0.70, 0.69, 0.68, 0.68, 0.68]
    },
    {
      key: "geopolitics",
      label: "Geopolitics",
      strength: 0.72,
      momentum: 0.4,
      confidence_pct: 58,
      translation: "Energy security concerns persist; trade fragmentation continues to reshape supply chains.",
      ripple_impact: "Energy premium remains elevated; onshoring accelerates.",
      sparkline: [0.65, 0.66, 0.68, 0.70, 0.71, 0.72, 0.71, 0.72, 0.72]
    }
  ]
};

const MacroEquilibriumHalo = ({ onOpenSignalDrawer }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [hoveredDomain, setHoveredDomain] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 420 });
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const [time, setTime] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isInteracting, setIsInteracting] = useState(false);

  const data = MOCK_EQUILIBRIUM;

  // Get domain color
  const getDomainColor = (key) => {
    const colorMap = { rates: H.rates, fx: H.fx, growth: H.growth, geopolitics: H.geo };
    return colorMap[key] || H.rates;
  };

  // Get domain icon
  const getDomainIcon = (key) => {
    const icons = { rates: "📊", fx: "💱", growth: "📈", geopolitics: "🌍" };
    return icons[key] || "•";
  };

  // Check reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldReduceMotion(mediaQuery.matches);
    const handler = (e) => setShouldReduceMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Update dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: 420 });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Master time wave animation
  useEffect(() => {
    if (shouldReduceMotion) return;
    
    let frameId;
    const animate = () => {
      setTime(performance.now() / 1000);
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [shouldReduceMotion]);

  // Track mouse for parallax
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 2
      });
    };

    if (isInteracting && containerRef.current) {
      containerRef.current.addEventListener('mousemove', handleMouseMove);
      return () => containerRef.current?.removeEventListener('mousemove', handleMouseMove);
    }
  }, [isInteracting]);

  // Generate summary text
  const summaryText = useMemo(() => {
    const parts = data.domains.map(d => {
      const posture = d.momentum > 0.3 ? 'firming' : d.momentum < -0.3 ? 'softening' : 'stable';
      return `${d.label} ${posture}`;
    });
    return `Global Balance: ${parts.join(' • ')}.`;
  }, [data.domains]);

  // Draw canvas halo
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    canvas.style.width = `${dimensions.width}px`;
    canvas.style.height = `${dimensions.height}px`;
    ctx.scale(dpr, dpr);

    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const baseRadius = 100;

    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    // Draw halo bands (clockwise: Rates, FX, Growth, Geo)
    data.domains.forEach((domain, idx) => {
      const angle = (idx / data.domains.length) * Math.PI * 2 - Math.PI / 2;
      const phaseOffset = (idx * Math.PI / 2);
      const wave = Math.sin(time + phaseOffset);
      
      const radiusVariation = shouldReduceMotion ? 0 : wave * 8;
      const radius = baseRadius + radiusVariation;
      
      const strokeWidth = 6 + (domain.strength * 14);
      const brightness = Math.min(0.6, 0.22 + domain.strength * 0.38);
      
      // Parse hex to rgb
      const hex = getDomainColor(domain.key);
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      
      // Draw band arc (90° segment)
      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${brightness})`;
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = 'round';
      ctx.shadowBlur = 14;
      ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.25)`;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, angle, angle + Math.PI / 2);
      ctx.stroke();
      
      // Draw orbit glyph
      const orbX = centerX + Math.cos(angle + Math.PI / 4) * radius;
      const orbY = centerY + Math.sin(angle + Math.PI / 4) * radius;
      const orbSize = 14 + (domain.confidence_pct * 0.18);
      
      // Trail if momentum exists
      if (Math.abs(domain.momentum) > 0.1) {
        const trailLength = Math.abs(domain.momentum) * 42;
        const trailAngle = angle + Math.PI / 4 + (domain.momentum > 0 ? Math.PI : 0);
        
        const gradient = ctx.createLinearGradient(
          orbX,
          orbY,
          orbX + Math.cos(trailAngle) * trailLength,
          orbY + Math.sin(trailAngle) * trailLength
        );
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.32)`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 3;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.moveTo(orbX, orbY);
        ctx.lineTo(
          orbX + Math.cos(trailAngle) * trailLength,
          orbY + Math.sin(trailAngle) * trailLength
        );
        ctx.stroke();
      }
      
      // Orb gradient
      const orbGradient = ctx.createRadialGradient(orbX, orbY, 0, orbX, orbY, orbSize);
      orbGradient.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
      orbGradient.addColorStop(1, 'rgba(255, 255, 255, 0.10)');
      
      ctx.fillStyle = orbGradient;
      ctx.shadowBlur = 8;
      ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.4)`;
      ctx.beginPath();
      ctx.arc(orbX, orbY, orbSize, 0, Math.PI * 2);
      ctx.fill();
      
      // Orb tint
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.25)`;
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(orbX, orbY, orbSize * 0.8, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw nucleus
    const nucleusSize = Math.min(64, Math.max(48, 54));
    const nucleusOpacity = shouldReduceMotion ? 0.55 : 0.92 + Math.sin(time * 0.5) * (data.global_confidence_pct / 100) * 0.16;
    
    const nucleusGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, nucleusSize);
    nucleusGradient.addColorStop(0, `rgba(255, 255, 255, ${nucleusOpacity})`);
    nucleusGradient.addColorStop(1, 'rgba(255, 255, 255, 0.12)');
    
    ctx.fillStyle = nucleusGradient;
    ctx.shadowBlur = 18;
    ctx.shadowColor = 'rgba(255, 255, 255, 0.20)';
    ctx.beginPath();
    ctx.arc(centerX, centerY, nucleusSize, 0, Math.PI * 2);
    ctx.fill();

  }, [dimensions, time, data, shouldReduceMotion]);

  // Generate clickable hotspots for domains
  const getDomainHotspot = useCallback((domain, idx) => {
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const baseRadius = 100;
    const angle = (idx / data.domains.length) * Math.PI * 2 - Math.PI / 2;
    
    const orbX = centerX + Math.cos(angle + Math.PI / 4) * baseRadius;
    const orbY = centerY + Math.sin(angle + Math.PI / 4) * baseRadius;
    const orbSize = 14 + (domain.confidence_pct * 0.18);
    
    return { x: orbX, y: orbY, radius: orbSize + 8 };
  }, [dimensions, data.domains.length]);

  // Check if point is in hotspot
  const isInHotspot = useCallback((x, y, hotspot) => {
    const dx = x - hotspot.x;
    const dy = y - hotspot.y;
    return Math.sqrt(dx * dx + dy * dy) <= hotspot.radius;
  }, []);

  // Handle canvas click
  const handleCanvasClick = useCallback((e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    data.domains.forEach((domain, idx) => {
      const hotspot = getDomainHotspot(domain, idx);
      if (isInHotspot(x, y, hotspot)) {
        setSelectedDomain(domain);
      }
    });
  }, [data.domains, getDomainHotspot, isInHotspot]);

  // Handle canvas hover
  const handleCanvasHover = useCallback((e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    let foundHover = null;
    data.domains.forEach((domain, idx) => {
      const hotspot = getDomainHotspot(domain, idx);
      if (isInHotspot(x, y, hotspot)) {
        foundHover = domain.key;
      }
    });
    
    setHoveredDomain(foundHover);
    if (canvasRef.current) {
      canvasRef.current.style.cursor = foundHover ? 'pointer' : 'default';
    }
  }, [data.domains, getDomainHotspot, isInHotspot]);

  return (
    <motion.section
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      aria-label="Macro equilibrium visualization"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pl-2">
        <div className="flex items-center space-x-3">
          <Globe className="w-6 h-6 text-blue-300" />
          <div>
            <h2 
              className="font-bold"
              style={{
                fontSize: '16px',
                lineHeight: '22px',
                letterSpacing: '0.01em',
                color: H.textHi
              }}
            >
              Macro Equilibrium
            </h2>
            <p style={{ fontSize: '13px', color: H.textSub }}>
              Global balance at a glance • Click domains for insight
            </p>
          </div>
        </div>
        
        {/* Powered by Lyra */}
        <motion.div
          className="group cursor-pointer relative"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <motion.div
            className="absolute -inset-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(129, 140, 248, 0.15) 0%, transparent 70%)',
              filter: 'blur(8px)',
            }}
          />
          
          <div
            className="relative flex items-center space-x-2 px-4 py-2 rounded-xl"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(14px)',
              border: `1px solid ${H.border}`,
              borderRadius: '10px'
            }}
          >
            <span className="text-xs font-medium" style={{ color: H.textSub }}>
              Powered by
            </span>
            <LyraLogo className="w-5 h-5" />
            <span className="text-sm font-bold" style={{ color: H.textHi }}>
              Lyra
            </span>
          </div>
        </motion.div>
      </div>

      {/* Glass Pane Container */}
      <motion.div
        ref={containerRef}
        className="relative rounded-3xl overflow-hidden"
        style={{
          height: '420px',
          borderRadius: '24px',
          backdropFilter: 'blur(14px) saturate(115%)',
          background: 'linear-gradient(180deg, rgba(18,22,30,.74), rgba(10,12,18,.86))',
          boxShadow: `inset 0 1px 0 ${H.glass}, 0 30px 80px rgba(0,0,0,.45)`,
          border: `1px solid ${H.border}`
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        onMouseEnter={() => setIsInteracting(true)}
        onMouseLeave={() => {
          setIsInteracting(false);
          setHoveredDomain(null);
        }}
        whileHover={shouldReduceMotion ? {} : { y: -1 }}
      >
        {/* Reflection Layer (parallax sheen) */}
        {!shouldReduceMotion && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: H.sheen,
              opacity: 0.08,
              willChange: 'transform'
            }}
            animate={{
              x: mousePos.x * -8,
              y: mousePos.y * -8,
              rotate: 4
            }}
            transition={{ type: 'spring', stiffness: 100, damping: 25 }}
          />
        )}

        {/* Canvas for halo rendering */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0"
          onClick={handleCanvasClick}
          onMouseMove={handleCanvasHover}
          style={{ 
            cursor: hoveredDomain ? 'pointer' : 'default',
            willChange: 'transform'
          }}
        />

        {/* Hover Tooltip */}
        <AnimatePresence>
          {hoveredDomain && (
            <motion.div
              className="absolute pointer-events-none z-20"
              style={{
                left: '50%',
                top: '30%',
                transform: 'translateX(-50%)'
              }}
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              {(() => {
                const domain = data.domains.find(d => d.key === hoveredDomain);
                if (!domain) return null;
                
                return (
                  <div
                    style={{
                      background: H.bg,
                      backdropFilter: 'blur(12px)',
                      border: `1px solid ${H.border}`,
                      borderRadius: '12px',
                      padding: '8px 12px',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
                    }}
                  >
                    <div className="flex items-center gap-2 text-sm">
                      <span style={{ color: H.textHi, fontWeight: 600 }}>
                        {domain.label}
                      </span>
                      <span style={{ color: getDomainColor(domain.key), fontWeight: 700 }}>
                        {domain.confidence_pct}%
                      </span>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Summary Bar (always visible) */}
        <motion.div
          className="absolute bottom-4 left-4 right-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div
            style={{
              background: 'rgba(255,255,255,.04)',
              border: `1px solid ${H.border}`,
              borderRadius: '14px',
              padding: '10px 14px',
              backdropFilter: 'blur(10px)'
            }}
          >
            <p
              style={{
                fontSize: '13.5px',
                lineHeight: '1.5',
                color: H.textMed,
                fontWeight: 500
              }}
            >
              {summaryText}
            </p>
          </div>
        </motion.div>

        {/* Posture Label (center) */}
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none"
          style={{ marginTop: '-10px' }}
        >
          <motion.div
            animate={shouldReduceMotion ? {} : {
              scale: [1, 1.02, 1],
              opacity: [0.85, 0.95, 0.85]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div
              className="font-bold mb-1"
              style={{
                fontSize: '15px',
                color: H.textHi,
                textShadow: '0 0 12px rgba(255,255,255,0.3)'
              }}
            >
              {data.global_posture}
            </div>
            <div
              className="text-xs font-medium"
              style={{ color: H.textSub }}
            >
              {data.global_confidence_pct}% confidence
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Domain Drawer */}
      <AnimatePresence>
        {selectedDomain && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDomain(null)}
            />

            {/* Drawer Panel */}
            <motion.div
              className="fixed top-0 right-0 h-full z-50 overflow-y-auto"
              style={{
                width: '480px',
                maxWidth: '90vw',
                background: 'linear-gradient(180deg, rgba(18,22,30,.95), rgba(10,12,18,.98))',
                backdropFilter: 'blur(28px)',
                borderLeft: `1px solid ${H.border}`,
                boxShadow: '-8px 0 32px rgba(0,0,0,0.5)'
              }}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.22, ease: [0.22, 0.61, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setSelectedDomain(null);
              }}
              tabIndex={-1}
            >
              {/* Header */}
              <div 
                className="sticky top-0 z-10 p-6 border-b"
                style={{
                  background: H.bg,
                  borderColor: H.border,
                  backdropFilter: 'blur(14px)'
                }}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                      style={{
                        background: `${getDomainColor(selectedDomain.key)}20`,
                        border: `1px solid ${getDomainColor(selectedDomain.key)}40`
                      }}
                    >
                      {getDomainIcon(selectedDomain.key)}
                    </div>
                    <div>
                      <h3 
                        className="font-bold capitalize"
                        style={{ color: H.textHi, fontSize: '22px' }}
                      >
                        {selectedDomain.label}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ 
                            background: getDomainColor(selectedDomain.key),
                            boxShadow: `0 0 6px ${getDomainColor(selectedDomain.key)}`
                          }}
                        />
                        <span style={{ color: H.textMed, fontSize: '14px' }}>
                          Strength: {Math.round(selectedDomain.strength * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedDomain(null)}
                    className="p-2 rounded-xl transition-colors hover:bg-white/10"
                    style={{ color: H.textSub }}
                    aria-label="Close drawer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Confidence Ring */}
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20">
                    <svg className="transform -rotate-90" width="80" height="80">
                      <circle
                        cx="40" cy="40" r="34"
                        fill="none"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="5"
                      />
                      <motion.circle
                        cx="40" cy="40" r="34"
                        fill="none"
                        stroke={getDomainColor(selectedDomain.key)}
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeDasharray="214"
                        initial={{ strokeDashoffset: 214 }}
                        animate={{ 
                          strokeDashoffset: 214 - (214 * selectedDomain.confidence_pct / 100)
                        }}
                        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </svg>
                    <div 
                      className="absolute inset-0 flex items-center justify-center font-black"
                      style={{ color: H.textHi, fontSize: '18px' }}
                    >
                      {selectedDomain.confidence_pct}%
                    </div>
                  </div>
                  
                  <div>
                    <div 
                      className="text-xs font-bold uppercase tracking-wider mb-1"
                      style={{ color: H.textSub }}
                    >
                      Conviction Level
                    </div>
                    <div style={{ color: H.textMed, fontSize: '14px' }}>
                      Signal confidence in current assessment
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Translation */}
                <div>
                  <h4 
                    className="text-xs font-bold uppercase tracking-wide mb-3"
                    style={{ color: H.textSub }}
                  >
                    What This Means
                  </h4>
                  <p 
                    style={{
                      color: H.textHi,
                      fontSize: '15px',
                      lineHeight: '1.6',
                      fontWeight: 500
                    }}
                  >
                    {selectedDomain.translation}
                  </p>
                </div>

                {/* Ripple Impact */}
                <div>
                  <h4 
                    className="text-xs font-bold uppercase tracking-wide mb-3"
                    style={{ color: H.textSub }}
                  >
                    Next Effect To Watch
                  </h4>
                  <div
                    className="p-4 rounded-xl"
                    style={{
                      background: `${getDomainColor(selectedDomain.key)}12`,
                      border: `1px solid ${getDomainColor(selectedDomain.key)}30`
                    }}
                  >
                    <p 
                      style={{
                        color: H.textMed,
                        fontSize: '14px',
                        lineHeight: '1.5'
                      }}
                    >
                      {selectedDomain.ripple_impact}
                    </p>
                  </div>
                </div>

                {/* Trend Sparkline */}
                {selectedDomain.sparkline && selectedDomain.sparkline.length > 0 && (
                  <div>
                    <h4 
                      className="text-xs font-bold uppercase tracking-wide mb-3"
                      style={{ color: H.textSub }}
                    >
                      Recent Trend
                    </h4>
                    <div 
                      className="p-4 rounded-xl"
                      style={{
                        background: 'rgba(0,0,0,0.2)',
                        border: `1px solid ${H.border}`
                      }}
                    >
                      <svg width="100%" height="60" className="overflow-visible">
                        <defs>
                          <linearGradient id={`grad-${selectedDomain.key}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={getDomainColor(selectedDomain.key)} stopOpacity="0.2" />
                            <stop offset="100%" stopColor={getDomainColor(selectedDomain.key)} stopOpacity="0.05" />
                          </linearGradient>
                        </defs>
                        
                        {(() => {
                          const sparkData = selectedDomain.sparkline;
                          const width = (containerRef.current?.offsetWidth || 480) - 88;
                          const height = 60;
                          const padding = 4;
                          
                          const minVal = Math.min(...sparkData);
                          const maxVal = Math.max(...sparkData);
                          const range = maxVal - minVal || 0.1;
                          
                          const points = sparkData.map((v, i) => {
                            const x = (i / (sparkData.length - 1)) * width;
                            const y = height - padding - ((v - minVal) / range) * (height - padding * 2);
                            return `${x},${y}`;
                          }).join(' ');
                          
                          const pathD = `M ${points}`;
                          const areaD = `M ${points} L ${width},${height} L 0,${height} Z`;
                          const lastPoint = points.split(' ').pop().split(',');
                          
                          return (
                            <>
                              <motion.path
                                d={areaD}
                                fill={`url(#grad-${selectedDomain.key})`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                              />
                              <motion.path
                                d={pathD}
                                fill="none"
                                stroke={getDomainColor(selectedDomain.key)}
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                              />
                              <motion.circle
                                cx={lastPoint[0]}
                                cy={lastPoint[1]}
                                r="4"
                                fill={getDomainColor(selectedDomain.key)}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.8, type: 'spring', stiffness: 300 }}
                              />
                            </>
                          );
                        })()}
                      </svg>
                    </div>
                  </div>
                )}

                {/* Momentum Indicator */}
                <div>
                  <h4 
                    className="text-xs font-bold uppercase tracking-wide mb-3"
                    style={{ color: H.textSub }}
                  >
                    Momentum
                  </h4>
                  <div className="flex items-center gap-3">
                    {selectedDomain.momentum > 0.2 ? (
                      <>
                        <TrendingUp className="w-5 h-5" style={{ color: getDomainColor(selectedDomain.key) }} />
                        <span style={{ color: H.textMed, fontSize: '14px' }}>
                          Strengthening trend
                        </span>
                      </>
                    ) : selectedDomain.momentum < -0.2 ? (
                      <>
                        <TrendingDown className="w-5 h-5" style={{ color: getDomainColor(selectedDomain.key) }} />
                        <span style={{ color: H.textMed, fontSize: '14px' }}>
                          Weakening trend
                        </span>
                      </>
                    ) : (
                      <>
                        <Minus className="w-5 h-5" style={{ color: H.textSub }} />
                        <span style={{ color: H.textMed, fontSize: '14px' }}>
                          Stable
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Performance CSS */}
      <style jsx>{`
        canvas {
          transform: translateZ(0);
          will-change: transform;
          backface-visibility: hidden;
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </motion.section>
  );
};

export default MacroEquilibriumHalo;