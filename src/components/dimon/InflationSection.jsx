import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, BarChart2, ChevronRight, Flame, Wind } from 'lucide-react';

const ENTRY = { type: 'spring', stiffness: 320, damping: 35, mass: 0.85 };

const FONT = {
  display: '"SF Pro Display", Inter, system-ui, -apple-system, sans-serif',
  text:    '"SF Pro Text", Inter, system-ui, -apple-system, sans-serif',
};
const TYPE = {
  smoothing: { WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale', textRendering: 'optimizeLegibility' },
  tabular:   { fontVariantNumeric: 'tabular-nums' },
};

const GLASS = {
  panel: {
    background: 'linear-gradient(180deg, rgba(18,22,30,0.72) 0%, rgba(12,15,22,0.80) 100%)',
    backdropFilter: 'blur(32px) saturate(160%)',
    WebkitBackdropFilter: 'blur(32px) saturate(160%)',
    border: '1px solid rgba(255,255,255,0.07)',
    boxShadow: '0 20px 60px rgba(0,0,0,0.40), inset 0 1px 0 rgba(255,255,255,0.08)',
    borderRadius: '28px',
  },
  card: {
    background: 'linear-gradient(180deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.025) 100%)',
    backdropFilter: 'blur(20px) saturate(150%)',
    WebkitBackdropFilter: 'blur(20px) saturate(150%)',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.07), 0 4px 20px rgba(0,0,0,0.20)',
    borderRadius: '20px',
  }
};

const SPECULAR = {
  position: 'absolute', top: 0, left: '15%', right: '15%', height: '1px',
  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)',
  pointerEvents: 'none',
};

const InteractivePanel = ({ children, style = {}, contentStyle = {}, index = 0, noBloom = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);
  const [isNearCursor, setIsNearCursor] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dist = Math.sqrt((e.clientX - cx) ** 2 + (e.clientY - cy) ** 2);
      setIsNearCursor(dist < 90);
      if (isHovered) {
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        setTiltX(py * -1.2);
        setTiltY(px * 1.2);
      } else {
        setTiltX(0);
        setTiltY(0);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isHovered]);

  return (
    <motion.div
      ref={ref}
      style={{
        ...GLASS.card,
        ...style,
        position: 'relative',
        overflow: 'hidden',
        willChange: 'transform',
        transformStyle: 'preserve-3d',
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => { setIsHovered(false); setTiltX(0); setTiltY(0); }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      animate={{
        y: isPressed ? 1 : isHovered ? -2 : 0,
        scale: isPressed ? 0.99 : isHovered ? 1.006 : 1,
        rotateX: tiltX * 0.5,
        rotateY: tiltY * 0.5,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 28, mass: 1 }}
    >
      <div style={SPECULAR} />
      <motion.div
        style={{
          position: 'absolute', inset: '-10px', borderRadius: '24px',
          background: 'radial-gradient(ellipse at 50% 50%, rgba(86,156,235,0.10) 0%, transparent 70%)',
          filter: 'blur(16px)', pointerEvents: 'none', zIndex: 0,
        }}
        animate={{ opacity: isNearCursor && !isHovered ? 0.02 : 0 }}
        transition={{ duration: 0.25 }}
      />
      {!noBloom && (
        <motion.div
          style={{
            position: 'absolute', inset: 0, borderRadius: '20px', pointerEvents: 'none',
            background: 'radial-gradient(ellipse at 40% 20%, rgba(86,156,235,0.03) 0%, transparent 65%)',
            zIndex: 0,
          }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.22 }}
        />
      )}
      <motion.div
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
          background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)',
          borderRadius: '20px',
        }}
        animate={{ x: ['-110%', '110%'], opacity: [0, 0.05, 0] }}
        transition={{ duration: 1.4, ease: 'easeInOut', repeat: Infinity, repeatDelay: 7 + index * 1.8 }}
      />
      <div style={{ position: 'relative', zIndex: 1, ...contentStyle }}>
        {children}
      </div>
    </motion.div>
  );
};

const getRegimeTheme = (arrow) => {
  if (arrow === 'up')   return { label: 'Heating', color: '#F26A6A', glow: 'rgba(242,106,106,0.15)', Icon: TrendingUp };
  if (arrow === 'down') return { label: 'Cooling', color: '#5CD8A0', glow: 'rgba(92,216,160,0.15)',  Icon: TrendingDown };
  return                       { label: 'Stable',  color: '#5EA7FF', glow: 'rgba(94,167,255,0.15)',  Icon: Minus };
};

const getCategoryColor = (yoy) => {
  if (yoy < 2)   return '#5CD8A0';
  if (yoy < 3)   return '#9BA3B0';
  if (yoy < 4)   return '#FFB020';
  return '#F26A6A';
};

const MiniBar = ({ value, maxVal = 6, color, delay = 0 }) => {
  const pct = Math.min((Math.abs(value) / maxVal) * 100, 100);
  return (
    <div style={{ position: 'relative', height: '3px', borderRadius: '999px', background: 'rgba(255,255,255,0.07)', overflow: 'visible', marginTop: '6px', marginBottom: '4px' }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.max(pct, 2)}%` }}
        transition={{ duration: 0.9, delay, ease: [0.22, 0.61, 0.36, 1] }}
        style={{ position: 'absolute', top: 0, left: 0, height: '100%', borderRadius: '999px', background: color }}
      >
        <div style={{
          position: 'absolute', right: '-3px', top: '50%', transform: 'translateY(-50%)',
          width: '6px', height: '6px', borderRadius: '50%', background: color,
          boxShadow: `0 0 6px 1px ${color}88`,
        }} />
      </motion.div>
    </div>
  );
};

export default function InflationSection({ data }) {
  const [showImpact, setShowImpact] = useState(false);
  if (!data) return null;

  const d = {
    timestamp_display: data.timestamp_display || '',
    delta_summary: data.delta_summary || '',
    headline_state: data.headline_state || { arrow: 'flat', label: 'Headline Inflation', status: '' },
    core_state: data.core_state || { arrow: 'flat', label: 'Core Inflation', status: '' },
    services_state: data.services_state || { arrow: 'flat', label: 'Services Inflation', status: '' },
    fed_implication: data.fed_implication || '',
    drivers: data.drivers || [],
    winners: data.winners || [],
    losers: data.losers || [],
    cpi_plain: data.cpi_plain || '',
    pce_plain: data.pce_plain || '',
    why_fed_prefers: data.why_fed_prefers || '',
    watch_short: data.watch_short || [],
    watch_long: data.watch_long || [],
    sources: data.sources || [],
    cpi_pce_collapsed: data.cpi_pce_collapsed || '',
    components: data.inflation?.components || data.components || null,
  };

  const regimeTheme = getRegimeTheme(d.headline_state.arrow);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ ...ENTRY, delay: 0.05 }}
      style={{ ...GLASS.panel, padding: '28px 26px', position: 'relative', overflow: 'visible' }}
    >
      {/* Top specular */}
      <div style={{
        position: 'absolute', top: 0, left: '15%', right: '15%', height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
        borderRadius: '999px', pointerEvents: 'none'
      }} />
      {/* Ambient bloom */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '120px',
        background: `radial-gradient(ellipse at 50% 0%, ${regimeTheme.glow.replace('0.15','0.07')} 0%, transparent 70%)`,
        borderRadius: '28px 28px 0 0', pointerEvents: 'none'
      }} />

      {/* ── 1. HEADER ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '6px', position: 'relative' }}>
        <div>
          <h2 style={{ fontFamily: FONT.display, fontSize: '28px', fontWeight: 600, color: 'rgba(255,255,255,0.97)', letterSpacing: '-0.01em', margin: 0, lineHeight: 1.2, ...TYPE.smoothing }}>
            Inflation
          </h2>
          <p style={{ fontFamily: FONT.text, fontSize: '12px', fontWeight: 400, color: 'rgba(255,255,255,0.65)', margin: '4px 0 0', letterSpacing: '0', lineHeight: 1.4, ...TYPE.smoothing }}>
            {d.timestamp_display ? `Last updated ${d.timestamp_display}` : 'Real-time price pressure signals.'}
          </p>
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '7px',
          padding: '7px 14px 7px 11px', borderRadius: '999px',
          background: `${regimeTheme.color}0C`, border: `1px solid ${regimeTheme.color}25`,
          backdropFilter: 'blur(12px)', fontFamily: FONT.text, fontSize: '11px', fontWeight: 600,
          color: regimeTheme.color, letterSpacing: '0.06em', textTransform: 'uppercase', ...TYPE.smoothing
        }}>
          <motion.div
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: '6px', height: '6px', borderRadius: '50%', background: regimeTheme.color, boxShadow: `0 0 6px ${regimeTheme.color}` }}
          />
          {regimeTheme.label}
        </div>
      </div>

      {/* ── 2. DELTA BANNER ── */}
      {d.delta_summary && (
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...ENTRY, delay: 0.08 }}
          style={{ margin: '16px 0' }}
        >
          <InteractivePanel index={0} contentStyle={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontFamily: FONT.text, fontSize: '11px', fontWeight: 600, color: 'rgba(92,216,160,0.85)', letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap', flexShrink: 0, ...TYPE.smoothing }}>
              Δ Since last update
            </span>
            <div style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.08)', flexShrink: 0 }} />
            <span style={{ fontFamily: FONT.text, fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.85)', lineHeight: 1.5, letterSpacing: '0.01em', ...TYPE.smoothing }}>{d.delta_summary}</span>
          </InteractivePanel>
        </motion.div>
      )}

      {/* ── 3. THREE STATE CARDS ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ ...ENTRY, delay: 0.12 }}
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '10px' }}
      >
        {[d.headline_state, d.core_state, d.services_state].map((state, i) => {
          const t = getRegimeTheme(state.arrow);
          return (
            <InteractivePanel key={i} index={i + 1} contentStyle={{ padding: '16px 18px' }}>
              <motion.div style={{
                position: 'absolute', inset: 0, borderRadius: '20px', pointerEvents: 'none',
                background: `radial-gradient(ellipse at 0% 50%, ${t.glow} 0%, transparent 65%)`
              }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px', position: 'relative', zIndex: 2 }}>
                <t.Icon className="w-3 h-3" style={{ color: t.color }} strokeWidth={2.5} />
                <span style={{ fontFamily: FONT.text, fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.06em', textTransform: 'uppercase', ...TYPE.smoothing }}>
                  {state.label}
                </span>
              </div>
              <p style={{ fontFamily: FONT.text, fontSize: '15px', fontWeight: 500, color: 'rgba(255,255,255,0.92)', lineHeight: 1.45, margin: '0 0 12px', position: 'relative', zIndex: 2, ...TYPE.smoothing }}>
                {state.status}
              </p>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                padding: '3px 10px 3px 7px', borderRadius: '999px',
                background: `${t.color}0C`, border: `1px solid ${t.color}22`,
                fontFamily: FONT.text, fontSize: '12px', fontWeight: 500, color: t.color, letterSpacing: '0.04em', textTransform: 'uppercase',
                position: 'relative', zIndex: 2
              }}>
                <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: t.color, boxShadow: `0 0 5px ${t.color}` }} />
                {t.label}
              </div>
            </InteractivePanel>
          );
        })}
      </motion.div>

      {/* ── 4. FED IMPLICATION STRIP ── */}
      {d.fed_implication && (
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...ENTRY, delay: 0.16 }}
          style={{ marginBottom: '14px' }}
        >
          <InteractivePanel index={4} contentStyle={{ padding: '11px 16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontFamily: FONT.text, fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.50)', letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap', flexShrink: 0, ...TYPE.smoothing }}>
              Fed Implication
            </span>
            <div style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.08)', flexShrink: 0 }} />
            <span style={{ fontFamily: FONT.text, fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.85)', lineHeight: 1.5, ...TYPE.smoothing }}>{d.fed_implication}</span>
          </InteractivePanel>
        </motion.div>
      )}

      {/* ── 5. CATEGORY | DRIVERS (2-col) ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ ...ENTRY, delay: 0.20 }}
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}
      >
        {d.components && d.components.length > 0 && (
          <InteractivePanel index={5} contentStyle={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '14px' }}>
              <BarChart2 className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.40)' }} strokeWidth={2} />
              <span style={{ fontFamily: FONT.text, fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.06em', textTransform: 'uppercase', ...TYPE.smoothing }}>
                Inflation by Category
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {d.components.slice(0, 5).map((cat, idx) => {
                const barColor = getCategoryColor(cat.yoy);
                const arrowChar = cat.direction === 'up' ? '↑' : cat.direction === 'down' ? '↓' : '→';
                const arrowColor = cat.direction === 'up' ? '#F26A6A' : cat.direction === 'down' ? '#5CD8A0' : '#9BA3B0';
                return (
                  <div key={idx}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontFamily: FONT.text, fontSize: '14px', fontWeight: 500, color: 'rgba(255,255,255,0.88)', ...TYPE.smoothing }}>{cat.name}</span>
                      <span style={{ fontFamily: FONT.text, fontSize: '16px', fontWeight: 600, color: arrowColor, ...TYPE.smoothing, ...TYPE.tabular }}>
                        {arrowChar} {cat.yoy >= 0 ? '+' : ''}{Number(cat.yoy).toFixed(1)}%
                      </span>
                    </div>
                    <MiniBar value={cat.yoy} maxVal={6} color={barColor} delay={0.08 + idx * 0.06} />
                    <p style={{ fontFamily: FONT.text, fontSize: '12px', fontWeight: 400, color: 'rgba(255,255,255,0.75)', margin: 0, lineHeight: 1.4, ...TYPE.smoothing }}>{cat.note}</p>
                  </div>
                );
              })}
            </div>
          </InteractivePanel>
        )}

        <InteractivePanel index={6} contentStyle={{ padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '14px' }}>
            <Flame className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.40)' }} strokeWidth={2} />
            <span style={{ fontFamily: FONT.text, fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.06em', textTransform: 'uppercase', ...TYPE.smoothing }}>
              Key Drivers
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {d.drivers.slice(0, 3).map((driver, idx) => {
              const roleLabel = driver.role || (driver.weight >= 40 ? 'Primary' : driver.weight >= 25 ? 'Supporting' : 'Offset');
              const roleColor = roleLabel === 'Primary' ? '#5EA7FF' : roleLabel === 'Offset' ? '#F26A6A' : '#5CD8A0';
              return (
                <div key={idx}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0' }}>
                    <span style={{ fontFamily: FONT.text, fontSize: '14px', fontWeight: 500, color: 'rgba(255,255,255,0.90)', ...TYPE.smoothing }}>{driver.name}</span>
                    <div style={{
                      fontFamily: FONT.text, padding: '2px 9px', borderRadius: '6px', fontSize: '11px', fontWeight: 600,
                      background: `${roleColor}0C`, border: `1px solid ${roleColor}22`,
                      color: roleColor, letterSpacing: '0.06em', textTransform: 'uppercase', ...TYPE.smoothing
                    }}>{roleLabel}</div>
                  </div>
                  <MiniBar value={driver.weight} maxVal={100} color="linear-gradient(90deg, rgba(94,167,255,0.80), rgba(160,120,255,0.65))" delay={0.10 + idx * 0.08} />
                  <p style={{ fontFamily: FONT.text, fontSize: '12px', fontWeight: 400, color: 'rgba(255,255,255,0.75)', margin: '4px 0 0', lineHeight: 1.5, ...TYPE.smoothing }}>{driver.reason}</p>
                </div>
              );
            })}
            {d.drivers.length === 0 && (
              <p style={{ fontFamily: FONT.text, fontSize: '13px', fontWeight: 400, color: 'rgba(255,255,255,0.40)', textAlign: 'center', padding: '20px 0', ...TYPE.smoothing }}>Driver data pending.</p>
            )}
          </div>
        </InteractivePanel>
      </motion.div>

      {/* ── 6. IMPACT ACCORDION ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ ...ENTRY, delay: 0.24 }}
        style={{ marginBottom: '10px' }}
      >
        {/* Breathing bloom wrapper — only active when closed */}
        <motion.div
          style={{ borderRadius: '20px', position: 'relative' }}
          animate={!showImpact ? {
            boxShadow: [
              '0 0 0px rgba(255,118,42,0), inset 0 0 0px rgba(255,118,42,0), 0 0 0 1px rgba(255,118,42,0)',
              '0 0 32px rgba(255,118,42,0.36), inset 0 0 56px rgba(255,100,30,0.22), 0 0 0 1px rgba(255,118,42,0.50)',
              '0 0 0px rgba(255,118,42,0), inset 0 0 0px rgba(255,118,42,0), 0 0 0 1px rgba(255,118,42,0)',
            ]
          } : {
            boxShadow: '0 0 0px rgba(255,118,42,0)',
          }}
          transition={!showImpact ? {
            duration: 3.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.2,
          } : { duration: 0.4, ease: 'easeOut' }}
        >
          <InteractivePanel index={6} noBloom>
            <button
              onClick={() => setShowImpact(v => !v)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 18px',
                background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left'
              }}
            >
              <motion.span
                style={{ fontFamily: FONT.text, fontSize: '14px', fontWeight: 500, letterSpacing: '0', flex: 1, ...TYPE.smoothing }}
                animate={!showImpact ? {
                  color: ['rgba(255,255,255,0.55)', 'rgba(255,148,80,1)', 'rgba(255,255,255,0.55)'],
                } : { color: 'rgba(255,255,255,0.65)' }}
                transition={!showImpact ? {
                  duration: 3.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.2,
                } : { duration: 0.3 }}
              >
                Impact
              </motion.span>
              <motion.div
                animate={!showImpact ? {
                  rotate: 0,
                  opacity: [0.20, 1, 0.20],
                  x: [0, 4, 0],
                } : { rotate: 90, opacity: 1, x: 0 }}
                transition={!showImpact ? {
                  duration: 3.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.2,
                } : { duration: 0.18 }}
              >
                <ChevronRight className="w-3.5 h-3.5" style={{ color: 'rgba(255,118,42,0.80)' }} strokeWidth={2} />
              </motion.div>
            </button>

            {showImpact && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.22, ease: [0.22, 0.61, 0.36, 1] }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{ padding: '0 14px 20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '12px', marginBottom: '16px' }}>
                    {/* Winners */}
                    <InteractivePanel index={7} noBloom
                      style={{ background: 'linear-gradient(180deg, rgba(92,216,160,0.06) 0%, rgba(92,216,160,0.03) 100%)', border: '1px solid rgba(92,216,160,0.12)' }}
                      contentStyle={{ padding: '16px 18px' }}
                    >
                      <div style={{ ...SPECULAR, background: 'linear-gradient(90deg, transparent, rgba(92,216,160,0.14), transparent)' }} />
                      <div style={{ fontFamily: FONT.text, fontSize: '12px', fontWeight: 600, color: 'rgba(92,216,160,0.85)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '12px', ...TYPE.smoothing }}>Winners</div>
                      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {d.winners.slice(0, 5).map((item, idx) => (
                          <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontFamily: FONT.text, fontSize: '14px', fontWeight: 400, color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, ...TYPE.smoothing }}>
                            <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'rgba(92,216,160,0.75)', flexShrink: 0, marginTop: '5px', boxShadow: '0 0 5px rgba(92,216,160,0.45)' }} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </InteractivePanel>

                    {/* Losers */}
                    <InteractivePanel index={8} noBloom
                      style={{ background: 'linear-gradient(180deg, rgba(242,106,106,0.06) 0%, rgba(242,106,106,0.03) 100%)', border: '1px solid rgba(242,106,106,0.12)' }}
                      contentStyle={{ padding: '16px 18px' }}
                    >
                      <div style={{ ...SPECULAR, background: 'linear-gradient(90deg, transparent, rgba(242,106,106,0.14), transparent)' }} />
                      <div style={{ fontFamily: FONT.text, fontSize: '12px', fontWeight: 600, color: 'rgba(242,106,106,0.85)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '12px', ...TYPE.smoothing }}>Losers</div>
                      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {d.losers.slice(0, 5).map((item, idx) => (
                          <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontFamily: FONT.text, fontSize: '14px', fontWeight: 400, color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, ...TYPE.smoothing }}>
                            <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'rgba(242,106,106,0.75)', flexShrink: 0, marginTop: '5px', boxShadow: '0 0 5px rgba(242,106,106,0.45)' }} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </InteractivePanel>

                    {/* What to Watch */}
                    <InteractivePanel index={9} noBloom contentStyle={{ padding: '16px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '14px' }}>
                        <Wind className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.40)' }} strokeWidth={2} />
                        <span style={{ fontFamily: FONT.text, fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.06em', textTransform: 'uppercase', ...TYPE.smoothing }}>What to Watch</span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        {[{ label: 'Next 30–60 days', items: d.watch_short }, { label: 'Next 6–12 months', items: d.watch_long }].map(({ label, items }) => (
                          <div key={label}>
                            <div style={{ fontFamily: FONT.text, fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.65)', marginBottom: '10px', letterSpacing: '0.02em', ...TYPE.smoothing }}>{label}</div>
                            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              {items.slice(0, 4).map((item, idx) => (
                                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '7px', fontFamily: FONT.text, fontSize: '14px', fontWeight: 400, color: 'rgba(255,255,255,0.85)', lineHeight: 1.5, ...TYPE.smoothing }}>
                                  <ChevronRight className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.28)', flexShrink: 0, marginTop: '2px' }} strokeWidth={2} />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </InteractivePanel>
                  </div>

                  {/* How to Read the Data */}
                  <div style={{ marginTop: '4px' }}>
                    <div style={{ fontFamily: FONT.text, fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px', ...TYPE.smoothing }}>
                      How to Read the Data
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {[
                        { label: 'CPI', value: (d.cpi_pce_collapsed?.match(/[\d.]+%/) || [])[0] || '', color: '#5EA7FF', desc: d.cpi_plain },
                        { label: 'PCE', value: d.cpi_pce_collapsed?.split('/')[1]?.trim() || '2.5%', color: '#B47FFF', desc: d.pce_plain },
                        { label: 'Gap', value: '0.1%', color: '#FFB020', desc: d.why_fed_prefers },
                      ].map((item, idx) => (
                        <InteractivePanel key={idx} index={20 + idx} contentStyle={{ flex: 1, padding: '10px 14px' }} style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                            <span style={{ fontFamily: FONT.display, fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.90)', letterSpacing: '-0.005em', ...TYPE.smoothing }}>{item.label}</span>
                            <span style={{
                              fontFamily: FONT.text, fontSize: '12px', fontWeight: 600, padding: '1px 7px', borderRadius: '999px',
                              background: `${item.color}10`, color: item.color, border: `1px solid ${item.color}20`, ...TYPE.smoothing, ...TYPE.tabular
                            }}>{item.value}</span>
                          </div>
                          <p style={{ fontFamily: FONT.text, fontSize: '13px', fontWeight: 400, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5, margin: 0, ...TYPE.smoothing }}>{item.desc}</p>
                        </InteractivePanel>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </InteractivePanel>
        </motion.div>
      </motion.div>

      {/* ── 8. TOP WEIGHTED SOURCES ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...ENTRY, delay: 0.30 }}
      >
        <InteractivePanel index={11} contentStyle={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', flexShrink: 0 }}>
            <span style={{ fontFamily: FONT.text, fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap', ...TYPE.smoothing }}>
              Top Weighted Sources
            </span>
            <div style={{
              fontFamily: FONT.text, fontSize: '11px', fontWeight: 600, padding: '1px 7px', borderRadius: '999px',
              background: 'rgba(94,167,255,0.12)', color: 'rgba(140,195,255,0.90)',
              border: '1px solid rgba(94,167,255,0.22)', ...TYPE.smoothing, ...TYPE.tabular
            }}>{d.sources.length}</div>
          </div>
          <div style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.07)', flexShrink: 0 }} />
          <div style={{ display: 'flex', gap: '7px', flex: 1, overflow: 'hidden' }}>
            {d.sources.slice(0, 5).map((source, idx) => (
              <a key={idx} href={source.url || '#'} target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  padding: '4px 12px', borderRadius: '999px',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                  fontFamily: FONT.text, color: 'rgba(255,255,255,0.65)', fontSize: '12px', fontWeight: 500, letterSpacing: '0.03em',
                  textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0, ...TYPE.smoothing,
                  transition: 'background 0.14s ease-out, color 0.14s ease-out, transform 0.18s ease-out',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.10)'; e.currentTarget.style.color = 'rgba(255,255,255,0.92)'; e.currentTarget.style.transform = 'translateY(-1px) scale(1.006)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; e.currentTarget.style.transform = 'translateY(0) scale(1)'; }}
              >
                {source.name}
              </a>
            ))}
          </div>
        </InteractivePanel>
      </motion.div>
    </motion.div>
  );
}