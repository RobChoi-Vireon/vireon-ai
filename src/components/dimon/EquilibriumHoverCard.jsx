import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { createPortal } from 'react-dom';

const MOTION_TOKENS = {
  CURVES: {
    horizonIn: [0.22, 0.61, 0.36, 1],
    horizonOut: [0.4, 0.0, 0.2, 1],
    horizonSpring: [0.16, 1, 0.3, 1],
    horizonOpacity: [0.33, 0.0, 0.67, 1],
  },
  DURATIONS: {
    ultraFast: 0.06,
    fast: 0.12,
    base: 0.18,
    slow: 0.24,
    microPulse: 0.008,
  },
  ELEVATION: {
    hover: { blur: 12, spread: 0, opacity: 0.10 },
    chip: { blur: 10, spread: 0, opacity: 0.08 }
  },
  INTENT_DELAY: { hoverReveal: 0.12 }
};

const TOKENS = {
  HORIZON: {
    glassBorder: 'rgba(160,191,255,0.10)',
    drawerDivider: 'rgba(255,255,255,0.06)',
    t_pulse: 3,
    t_hover: 0.12,
    hoverEnterDelay: 120,
  },
  colors: {
    textPrimary: "rgba(255, 255, 255, 0.95)",
    textSecondary: "rgba(255, 255, 255, 0.80)",
  }
};

const usePortalRoot = () => {
  const [portalRoot, setPortalRoot] = useState(null);
  useEffect(() => {
    let root = document.getElementById('equilibrium-overlay-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'equilibrium-overlay-root';
      root.setAttribute('aria-hidden', 'true');
      root.style.cssText = `position: fixed; inset: 0; pointer-events: none; z-index: 9999; overflow: hidden;`;
      document.body.appendChild(root);
    }
    setPortalRoot(root);
    return () => {
      setTimeout(() => {
        if (root && root.childNodes.length === 0 && document.body.contains(root)) root.remove();
      }, 100);
    };
  }, []);
  return portalRoot;
};

const calculateSmartPlacement = (nodeRect, cardWidth = 320, cardHeight = 360) => {
  const HEADER_HEIGHT = 72;
  const SAFE_MARGIN = 16;
  const SAFE_TOP = HEADER_HEIGHT + SAFE_MARGIN;
  const GAP_FROM_NODE = 14;
  const viewport = { width: window.innerWidth, height: window.innerHeight };
  const footerHeight = 84;
  const footerTop = viewport.height - footerHeight;
  let placement = 'bottom';
  let x = nodeRect.left;
  let y = nodeRect.bottom + GAP_FROM_NODE;
  let maxHeight = null;
  if (y + cardHeight > footerTop - SAFE_MARGIN) { placement = 'top'; y = nodeRect.top - GAP_FROM_NODE - cardHeight; }
  if (x + cardWidth > viewport.width - SAFE_MARGIN) x = viewport.width - SAFE_MARGIN - cardWidth;
  if (x < SAFE_MARGIN) x = SAFE_MARGIN;
  if (y < SAFE_TOP) y = SAFE_TOP;
  const arrowX = nodeRect.left + (nodeRect.width / 2) - x;
  const arrowY = placement.includes('top') ? cardHeight : -8;
  return { x, y, maxHeight, placement, arrow: { x: arrowX, y: arrowY, direction: placement.includes('top') ? 'down' : 'up' }, transformOrigin: placement.includes('top') ? 'bottom left' : 'top left' };
};

export const HoverCardPortal = ({
  domain, nodeRect, onClose, onCardEnter, onCardLeave,
  getDomainColor, getDomainBloom, getDomainIcon, getDomainText,
  getPostureIcon, getConfidenceStrength, shouldReduceMotion
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

  useEffect(() => { setRingAnimationComplete(false); }, [domain?.id]);

  useEffect(() => {
    if (!nodeRect) return;
    const handleUpdate = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        setPosition(calculateSmartPlacement(nodeRect));
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
    const handleKeyDown = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!portalRoot || !position || !domain) return null;

  const ringRadius = 14;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const targetOffset = ringCircumference - (ringCircumference * domain.confidence / 100);

  const adjustedDurations = shouldReduceMotion ? {
    ultraFast: MOTION_TOKENS.DURATIONS.ultraFast / 2,
    fast: MOTION_TOKENS.DURATIONS.fast / 2,
    base: MOTION_TOKENS.DURATIONS.base / 2,
    slow: MOTION_TOKENS.DURATIONS.slow / 2
  } : MOTION_TOKENS.DURATIONS;

  const cardContent = (
    <motion.div
      ref={cardRef}
      className="eq-hover-card"
      initial={{ opacity: 0, y: 4, scale: 0.995, filter: 'blur(2px)' }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 4, scale: isVisible ? 1 : 0.995, filter: isVisible ? 'blur(0px)' : 'blur(2px)', boxShadow: isCardHovered ? `0 8px 24px rgba(0,0,0,${MOTION_TOKENS.ELEVATION.hover.opacity})` : `0 0 ${MOTION_TOKENS.ELEVATION.hover.blur}px rgba(0,0,0,0.05)` }}
      exit={{ opacity: 0, y: 2, scale: 0.997, transition: { duration: adjustedDurations.base, ease: MOTION_TOKENS.CURVES.horizonOut } }}
      transition={{ duration: adjustedDurations.ultraFast, ease: MOTION_TOKENS.CURVES.horizonIn, boxShadow: { duration: adjustedDurations.fast, ease: MOTION_TOKENS.CURVES.horizonIn } }}
      style={{ position: 'absolute', left: `${position.x}px`, top: `${position.y}px`, width: '320px', maxHeight: position.maxHeight ? `${position.maxHeight}px` : 'none', overflowY: position.maxHeight ? 'auto' : 'visible', padding: '20px 22px', borderRadius: '20px', backdropFilter: 'blur(22px) saturate(165%) brightness(1.05)', WebkitBackdropFilter: 'blur(22px) saturate(165%) brightness(1.05)', background: 'rgba(24, 28, 33, 0.45)', border: `1px solid ${TOKENS.HORIZON.glassBorder}`, pointerEvents: 'auto', cursor: 'pointer', transformOrigin: position.transformOrigin, willChange: 'transform, opacity, filter, box-shadow' }}
      onClick={onClose}
      onMouseEnter={() => { setIsCardHovered(true); onCardEnter(); }}
      onMouseLeave={() => { setIsCardHovered(false); onCardLeave(); }}
      role="button"
      tabIndex={0}
      aria-label={`${domain.id} signal: ${domain.posture}. Click to expand.`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClose(); } }}
    >
      {position.maxHeight && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '32px', background: 'linear-gradient(to top, rgba(24,28,33,0.95), transparent)', pointerEvents: 'none', zIndex: 10 }} />
      )}

      {!shouldReduceMotion && (
        <motion.div className="absolute inset-0 rounded-[18px]" style={{ background: `radial-gradient(circle at center, ${getDomainBloom(domain.id)}, transparent 70%)`, mixBlendMode: 'screen', pointerEvents: 'none', zIndex: -1 }} animate={{ opacity: [0.10, 0.14, 0.10] }} transition={{ duration: TOKENS.HORIZON.t_pulse, repeat: Infinity, ease: 'easeInOut' }} />
      )}

      <div style={{ position: 'absolute', top: 0, left: '14px', right: '14px', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)', borderRadius: '999px', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${getDomainColor(domain.id)}15`, border: `1px solid ${getDomainColor(domain.id)}30`, boxShadow: `0 0 14px ${getDomainBloom(domain.id)}`, color: getDomainColor(domain.id) }}>
            {React.cloneElement(getDomainIcon(domain.id), { className: "w-4 h-4", strokeWidth: 2.5 })}
          </div>
          <motion.h4 initial={{ opacity: 0, y: -2 }} animate={{ opacity: 0.95, y: 0 }} transition={{ delay: shouldReduceMotion ? 0 : 0.05, duration: adjustedDurations.fast }} style={{ color: TOKENS.colors.textPrimary, fontSize: '18px', fontWeight: 600, letterSpacing: '-0.02em', textShadow: '0 1px 2px rgba(0,0,0,0.4)', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
            {domain.title}
          </motion.h4>
        </div>

        {/* SUBHEADER */}
        <motion.div initial={{ opacity: 0, y: -2 }} animate={{ opacity: 0.82, y: 0 }} transition={{ delay: shouldReduceMotion ? 0 : 0.08, duration: adjustedDurations.fast }} className="flex items-center gap-1.5 mb-4">
          {React.cloneElement(getPostureIcon(domain.posture), { className: "w-3.5 h-3.5" })}
          <span style={{ color: getDomainText(domain.id), fontSize: '13px', letterSpacing: '0.2px', textShadow: '0 1px 2px rgba(0,0,0,0.35)', fontWeight: 500, fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
            {domain.trend}
          </span>
        </motion.div>

        <div style={{ height: '1px', background: `linear-gradient(90deg, transparent, ${TOKENS.HORIZON.drawerDivider}, transparent)`, margin: '0 0 14px 0', opacity: 0.5 }} />

        {/* CONFIDENCE BLOCK */}
        <motion.div initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: shouldReduceMotion ? 0 : 0.12, duration: adjustedDurations.fast }} className="flex items-center gap-3 mb-4">
          <motion.div className="relative w-8 h-8 flex-shrink-0 eq-confidence-ring" whileHover={shouldReduceMotion ? {} : { scale: 1.04, transition: { duration: adjustedDurations.fast, ease: MOTION_TOKENS.CURVES.horizonSpring } }}>
            <svg className="transform -rotate-90" width="32" height="32" style={{ overflow: 'visible' }}>
              <circle cx="16" cy="16" r={ringRadius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2.5" />
              <motion.circle cx="16" cy="16" r={ringRadius} fill="none" stroke={getDomainColor(domain.id)} strokeWidth="2.5" strokeLinecap="round" strokeDasharray={ringCircumference} style={{ transformOrigin: 'center', willChange: 'stroke-dashoffset, filter' }} initial={{ strokeDashoffset: ringCircumference, opacity: 0.85 }} animate={shouldReduceMotion ? { strokeDashoffset: targetOffset, opacity: 1.0 } : { strokeDashoffset: targetOffset, opacity: 1.0, filter: ringAnimationComplete ? [`drop-shadow(0 0 5px ${getDomainBloom(domain.id)})`, `drop-shadow(0 0 8px ${getDomainBloom(domain.id)})`, `drop-shadow(0 0 5px ${getDomainBloom(domain.id)})`] : `drop-shadow(0 0 5px ${getDomainBloom(domain.id)})` }} transition={shouldReduceMotion ? { strokeDashoffset: { duration: 0 }, opacity: { duration: 0 } } : { strokeDashoffset: { duration: 0.6, delay: 0.3, ease: MOTION_TOKENS.CURVES.horizonIn }, opacity: { duration: 0.6, delay: 0.3, ease: MOTION_TOKENS.CURVES.horizonOpacity }, filter: ringAnimationComplete ? { duration: TOKENS.HORIZON.t_pulse, repeat: Infinity, ease: 'easeInOut' } : { duration: adjustedDurations.base, ease: 'easeOut' } }} onAnimationComplete={() => { if (!ringAnimationComplete) setRingAnimationComplete(true); }} />
              {!shouldReduceMotion && (
                <motion.circle cx="16" cy="16" r={ringRadius} fill="none" stroke={getDomainColor(domain.id)} strokeWidth="2.5" strokeLinecap="round" strokeDasharray={ringCircumference} strokeDashoffset={targetOffset} style={{ transformOrigin: 'center', pointerEvents: 'none' }} initial={{ opacity: 0, filter: `blur(6px) drop-shadow(0 0 6px ${getDomainBloom(domain.id)})` }} animate={{ opacity: ringAnimationComplete ? [0, 0.25, 0] : 0, filter: `blur(6px) drop-shadow(0 0 6px ${getDomainBloom(domain.id)})` }} transition={{ opacity: { duration: TOKENS.HORIZON.t_pulse, repeat: Infinity, ease: 'easeInOut' } }} />
              )}
            </svg>
            <motion.div className="absolute inset-0 flex items-center justify-center font-bold" style={{ color: TOKENS.colors.textPrimary, fontSize: '10px', textShadow: '0 1px 2px rgba(0,0,0,0.35)' }} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: shouldReduceMotion ? 0 : 0.4, duration: adjustedDurations.slow, ease: MOTION_TOKENS.CURVES.horizonIn }}>
              {domain.confidence}
            </motion.div>
          </motion.div>

          <div className="flex-1">
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.75)', letterSpacing: '0.15em', fontWeight: 600, textShadow: '0 1px 2px rgba(0,0,0,0.35)', marginBottom: '3px' }}>CONFIDENCE</div>
            <div style={{ fontSize: '14.5px', color: TOKENS.colors.textPrimary, textShadow: '0 1px 2px rgba(0,0,0,0.35)', fontWeight: 600, letterSpacing: '-0.01em' }}>
              {domain.confidence}% • {getConfidenceStrength(domain.confidence)}
            </div>
          </div>
        </motion.div>

        {/* BODY — posture as description */}
        <motion.p initial={{ opacity: 0, y: 3 }} animate={{ opacity: 0.90, y: 0 }} transition={{ delay: shouldReduceMotion ? 0 : 0.16, duration: adjustedDurations.fast }} style={{ color: 'rgba(255,255,255,0.88)', fontSize: '15px', lineHeight: '1.55', marginBottom: '12px', textShadow: '0 1px 2px rgba(0,0,0,0.35)', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif', fontWeight: 400 }}>
          {domain.posture}
        </motion.p>

        {/* INSIGHT BOX */}
        <motion.div className="eq-insight-chip" initial={{ opacity: 0, y: 2 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: shouldReduceMotion ? 0 : 0.20, duration: adjustedDurations.fast, ease: MOTION_TOKENS.CURVES.horizonIn }} onHoverStart={() => setIsInsightHovered(true)} onHoverEnd={() => setIsInsightHovered(false)} style={{ position: 'relative', width: '100%', padding: '9px 13px', borderRadius: '12px', marginTop: '10px', marginBottom: '14px', background: 'rgba(255,255,255,0.10)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.20)', boxShadow: isInsightHovered ? `inset 0 0 0 1px rgba(255,255,255,0.08), 0 0 ${MOTION_TOKENS.ELEVATION.chip.blur}px rgba(0,0,0,${MOTION_TOKENS.ELEVATION.chip.opacity})` : 'inset 0 0 0 1px rgba(255,255,255,0.08)', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif', fontSize: '14px', lineHeight: '1.5', color: 'rgba(255,255,255,0.92)', pointerEvents: 'none' }}>
          <span style={{ fontWeight: 600, opacity: 0.85, marginRight: '5px', letterSpacing: '0.3px', color: 'rgba(106,199,247,0.9)' }}>Ori Insight →</span>
          <span style={{ fontWeight: 400, opacity: 0.92 }}>{domain.insight}</span>
        </motion.div>

        <div style={{ height: '1px', background: `linear-gradient(90deg, transparent, ${TOKENS.HORIZON.drawerDivider}, transparent)`, margin: '14px 0 12px 0', opacity: 0.5 }} />

        {/* CTA */}
        <motion.button onClick={(e) => { e.stopPropagation(); onClose(); }} className="cta-expand-signal group" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: shouldReduceMotion ? 0 : 0.24, duration: adjustedDurations.fast }} whileHover={shouldReduceMotion ? {} : { backgroundColor: 'rgba(255,255,255,0.06)', y: -1, transition: { duration: MOTION_TOKENS.DURATIONS.microPulse, ease: MOTION_TOKENS.CURVES.horizonIn } }} whileTap={shouldReduceMotion ? {} : { y: 1, transition: { duration: MOTION_TOKENS.DURATIONS.microPulse, ease: MOTION_TOKENS.CURVES.horizonOut } }} style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '5px', minHeight: '36px', padding: '8px 12px', borderRadius: '12px', border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif', fontSize: '14px', fontWeight: 500, letterSpacing: '0.25px', color: 'rgba(90,160,255,0.95)', WebkitTapHighlightColor: 'transparent', outline: 'none', overflow: 'hidden', willChange: 'transform, background-color' }} aria-label="Expand signal for detailed analysis">
          {!shouldReduceMotion && (
            <motion.div className="absolute left-3 right-3 bottom-2 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.67), transparent)', transformOrigin: '50% 50%', scaleX: 0 }} initial={{ scaleX: 0 }} whileHover={{ scaleX: 1, transition: { duration: adjustedDurations.base, ease: MOTION_TOKENS.CURVES.horizonIn } }} />
          )}
          <span style={{ position: 'relative', zIndex: 1 }}>Expand signal</span>
          <motion.div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center' }} initial={{ x: 0, opacity: 0.85 }} animate={{ x: 0, opacity: 0.85 }} whileHover={shouldReduceMotion ? {} : { x: 2, opacity: 1, transition: { duration: MOTION_TOKENS.DURATIONS.microPulse, ease: MOTION_TOKENS.CURVES.horizonIn } }} whileTap={shouldReduceMotion ? {} : { x: 3, transition: { duration: MOTION_TOKENS.DURATIONS.microPulse, ease: MOTION_TOKENS.CURVES.horizonOut } }}>
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.div>
        </motion.button>
      </div>

      {!position.maxHeight && (
        <>
          <div style={{ position: 'absolute', left: `${position.arrow.x}px`, [position.arrow.direction === 'down' ? 'bottom' : 'top']: '-6px', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', [position.arrow.direction === 'down' ? 'borderTop' : 'borderBottom']: `8px solid ${TOKENS.HORIZON.glassBorder}`, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', left: `${position.arrow.x}px`, [position.arrow.direction === 'down' ? 'bottom' : 'top']: '-5px', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '7px solid transparent', borderRight: '7px solid transparent', [position.arrow.direction === 'down' ? 'borderTop' : 'borderBottom']: '7px solid rgba(24,28,33,0.45)', pointerEvents: 'none' }} />
        </>
      )}
    </motion.div>
  );

  return createPortal(cardContent, portalRoot);
};