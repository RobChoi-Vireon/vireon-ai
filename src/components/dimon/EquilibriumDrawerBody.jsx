import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ArrowRight, TrendingUp, TrendingDown, Minus, BarChart3, DollarSign, Activity, Globe } from 'lucide-react';

const MOTION_TOKENS = {
  CURVES: {
    horizonIn: [0.22, 0.61, 0.36, 1],
    horizonOut: [0.4, 0.0, 0.2, 1],
    drawerInhale: [0.25, 0.1, 0.25, 1],
  },
  DURATIONS: {
    ultraFast: 0.06,
    fast: 0.12,
    base: 0.18,
    slow: 0.24,
    microPulse: 0.008,
    drawerInhale: 0.40
  }
};

const TOKENS_HORIZON = {
  drawerGlass: 'rgba(10,15,22,0.72)', drawerTint: 'rgba(10,15,22,0.45)', drawerBlur: 'blur(22px)',
  drawerEdgeBloom: 'rgba(160,191,255,0.10)', drawerDivider: 'rgba(255,255,255,0.06)',
  panelShadow: '0 0 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)',
  glassBorder: 'rgba(160,191,255,0.10)',
  lightTemp: 'rgba(255, 255, 255, 0.03)', lightTempBottom: 'rgba(255, 255, 255, 0.00)',
};

const TOKENS_COLORS = {
  textPrimary: "rgba(255, 255, 255, 0.95)",
  textSecondary: "rgba(255, 255, 255, 0.80)",
  textBody: "rgba(255, 255, 255, 0.92)",
  textTertiary: "rgba(255,255,255,0.65)",
  textMuted: "rgba(255,255,255,0.58)",
};

const TOKENS_MACRO = {
  fx: { core: '#6AC7F7', bloom: 'rgba(106,199,247,0.38)', text: '#B8E7FF', glow: 'rgba(106,199,247,0.08)' },
  rates: { core: '#C0A6FF', bloom: 'rgba(192,166,255,0.38)', text: '#DECFFF', glow: 'rgba(192,166,255,0.08)' },
  growth: { core: '#B4F7C0', bloom: 'rgba(180,247,192,0.38)', text: '#D4FFDE', glow: 'rgba(180,247,192,0.08)' },
  geopolitics: { core: '#FFD37A', bloom: 'rgba(255,211,122,0.38)', text: '#FFE8B8', glow: 'rgba(255,211,122,0.08)' }
};

const getDomainColor = (id) => TOKENS_MACRO[id]?.core || TOKENS_MACRO.rates.core;
const getDomainText = (id) => TOKENS_MACRO[id]?.text || TOKENS_MACRO.rates.text;
const getDomainBloom = (id) => TOKENS_MACRO[id]?.bloom || TOKENS_MACRO.rates.bloom;
const getDomainGlow = (id) => TOKENS_MACRO[id]?.glow || TOKENS_MACRO.rates.glow;

const getDomainIcon = (id) => {
  const p = { className: "w-6 h-6", strokeWidth: 2 };
  return { rates: <BarChart3 {...p} />, fx: <DollarSign {...p} />, growth: <Activity {...p} />, geopolitics: <Globe {...p} /> }[id] || <Activity {...p} />;
};

const getPostureIcon = (posture) => {
  if (["hawkish", "tightening", "firming"].includes(posture)) return <TrendingUp className="w-4 h-4" />;
  if (["dovish", "loosening", "softening"].includes(posture)) return <TrendingDown className="w-4 h-4" />;
  return <Minus className="w-4 h-4" />;
};

export default function EquilibriumDrawerBody({
  selectedDomain,
  drawerLuminance,
  shouldReduceMotion,
  glassParallaxX,
  glassParallaxY,
  cx,
  cy,
  drawerRef,
  handleCloseDrawer,
  handlePrevDomain,
  handleNextDomain,
  isLowPower,
}) {
  const getBlur = (type) => isLowPower ? (type === 'panel' ? 'blur(16px)' : 'blur(12px)') : (type === 'panel' ? 'blur(20px)' : 'blur(16px)');

  return (
    <>
      {/* Local Overlay within Section */}
      <motion.div
        className="absolute z-40"
        style={{
          top: 0, left: 0, right: 0, bottom: 0,
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
          backdropFilter: TOKENS_HORIZON.drawerBlur,
          WebkitBackdropFilter: TOKENS_HORIZON.drawerBlur,
          background: TOKENS_HORIZON.drawerGlass,
          border: `1px solid ${TOKENS_HORIZON.glassBorder}`,
          boxShadow: `0 0 60px rgba(0, 0, 0, 0.15), ${TOKENS_HORIZON.panelShadow}, 0 0 12px ${TOKENS_HORIZON.drawerEdgeBloom}, inset 0 0 0 1px rgba(255,255,255,0.10)`,
          borderRadius: '24px',
          filter: `brightness(${drawerLuminance})`,
          pointerEvents: 'auto'
        }}
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, transition: { duration: MOTION_TOKENS.DURATIONS.drawerInhale, ease: MOTION_TOKENS.CURVES.drawerInhale } }}
        exit={{ scale: 0.94, opacity: 0, transition: { duration: MOTION_TOKENS.DURATIONS.base, ease: MOTION_TOKENS.CURVES.horizonOut } }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="drawer-header-blur-extension" style={{ position: 'absolute', left: 0, right: 0, top: '-16px', height: '16px', backdropFilter: TOKENS_HORIZON.drawerBlur, WebkitBackdropFilter: TOKENS_HORIZON.drawerBlur, background: 'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0))', pointerEvents: 'none', zIndex: 0 }} aria-hidden="true" />

        <motion.div
          style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate3d(-50%, -50%, 0)', width: '120%', height: '120%', background: `radial-gradient(circle at center, ${getDomainGlow(selectedDomain.id)} 0%, transparent 70%)`, opacity: 0.15, filter: 'blur(40px)', pointerEvents: 'none', mixBlendMode: 'screen', zIndex: 0 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15, x: glassParallaxX, y: glassParallaxY, transition: { opacity: { duration: 0.5, ease: 'easeOut' } } }}
          exit={{ opacity: 0, transition: { duration: 0.25 } }}
        />

        <motion.div
          style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '80px', background: `linear-gradient(to bottom, ${TOKENS_HORIZON.lightTemp} 0%, ${TOKENS_HORIZON.lightTempBottom} 100%)`, pointerEvents: 'none', borderRadius: '24px 24px 0 0', zIndex: 1 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.35, delay: 0.15, ease: 'easeOut' } }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
        />

        <div className="panel-glass" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100%', background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0) 100%)', pointerEvents: 'none', borderRadius: '24px', zIndex: 1 }} />

        {/* HEADER */}
        <motion.div
          className="flex-shrink-0 p-3 border-b"
          style={{ background: TOKENS_HORIZON.drawerTint, borderColor: TOKENS_HORIZON.drawerDivider, backdropFilter: getBlur('chip'), position: 'relative', zIndex: 10, overflow: 'visible' }}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0, transition: { duration: MOTION_TOKENS.DURATIONS.fast, delay: shouldReduceMotion ? 0 : 0.03, ease: MOTION_TOKENS.CURVES.horizonIn } }}
          exit={{ opacity: 0, y: -5, transition: { duration: MOTION_TOKENS.DURATIONS.fast } }}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-4">
              <motion.div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: `${getDomainColor(selectedDomain.id)}12`, border: `1px solid ${getDomainColor(selectedDomain.id)}25`, boxShadow: `0 0 16px ${getDomainBloom(selectedDomain.id)}`, color: getDomainColor(selectedDomain.id) }}
                animate={shouldReduceMotion ? {} : { filter: ['brightness(1)', 'brightness(1.06)', 'brightness(1)'] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              >
                {getDomainIcon(selectedDomain.id)}
              </motion.div>
              <div>
                <h3 style={{ color: TOKENS_COLORS.textPrimary, fontSize: '17px', fontWeight: 600, lineHeight: '1.2', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif', letterSpacing: '-0.01em', marginBottom: '4px' }}>
                  {selectedDomain.title}
                </h3>
                <div className="flex items-center gap-2">
                  {React.cloneElement(getPostureIcon(selectedDomain.posture), { className: "w-3.5 h-3.5", style: { color: getDomainText(selectedDomain.id) } })}
                  <span style={{ color: getDomainText(selectedDomain.id), fontSize: '13px', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif', fontWeight: 500, letterSpacing: '0.2px' }}>
                    {selectedDomain.trend}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handlePrevDomain} className="p-2 rounded-lg hover:bg-white/10 transition-colors" style={{ color: TOKENS_COLORS.textTertiary, minWidth: '36px', minHeight: '36px' }} aria-label="Previous domain"><ChevronLeft className="w-4 h-4" /></button>
              <button onClick={handleNextDomain} className="p-2 rounded-lg hover:bg-white/10 transition-colors" style={{ color: TOKENS_COLORS.textTertiary, minWidth: '36px', minHeight: '36px' }} aria-label="Next domain"><ChevronRight className="w-4 h-4" /></button>
              <button onClick={handleCloseDrawer} className="p-2 rounded-lg hover:bg-white/10 transition-colors" style={{ color: TOKENS_COLORS.textTertiary, minWidth: '36px', minHeight: '36px' }} aria-label="Close drawer"><X className="w-5 h-5" /></button>
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
              <div className="absolute inset-0 flex items-center justify-center font-bold" style={{ color: TOKENS_COLORS.textPrimary, fontSize: '11px' }}>
                {selectedDomain.confidence_pct}
                {selectedDomain.confidenceDelta !== undefined && (
                  <span className={`absolute -right-2 -top-1 text-[9px] ${selectedDomain.confidenceDelta > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {selectedDomain.confidenceDelta > 0 ? '↑' : '↓'}{Math.abs(selectedDomain.confidenceDelta)}
                  </span>
                )}
              </div>
            </div>
            <div className="flex-1">
              <div className="text-xs font-medium mb-1" style={{ color: 'rgba(255,255,255,0.68)', letterSpacing: '0.18em', fontSize: '10px', lineHeight: '1.4', fontWeight: 600, textTransform: 'uppercase' }}>CONFIDENCE</div>
              <div className="text-sm" style={{ color: TOKENS_COLORS.textPrimary, fontWeight: 600, fontSize: '14px', lineHeight: '1.4', letterSpacing: '-0.005em' }}>
                {selectedDomain.confidence_pct}% · {selectedDomain.confidence_label}
              </div>
            </div>
          </div>
        </motion.div>

        {/* SCROLLABLE BODY */}
        <motion.div
          className="overflow-y-auto"
          style={{ position: 'relative', zIndex: 2, paddingLeft: '20px', paddingRight: '20px', paddingTop: '16px', paddingBottom: '16px', overflowX: 'hidden' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: MOTION_TOKENS.DURATIONS.fast, delay: shouldReduceMotion ? 0 : 0.06, ease: MOTION_TOKENS.CURVES.horizonIn } }}
          exit={{ opacity: 0, transition: { duration: MOTION_TOKENS.DURATIONS.fast } }}
        >
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: shouldReduceMotion ? 0 : 0.09, duration: MOTION_TOKENS.DURATIONS.fast }} style={{ marginBottom: '12px' }}>
            <h4 style={{ color: 'rgba(255,255,255,0.68)', fontSize: '11px', fontWeight: 600, marginBottom: '6px', lineHeight: '1.3', letterSpacing: '0.12em', textTransform: 'uppercase' }}>What It Means</h4>
            <p style={{ color: TOKENS_COLORS.textBody, fontSize: '13px', lineHeight: '1.55', fontWeight: 400, wordWrap: 'break-word', overflowWrap: 'break-word' }}>{selectedDomain.summary}</p>
            {selectedDomain.addendum && (
              <p style={{ color: TOKENS_COLORS.textSecondary, fontSize: '12px', marginTop: '10px', opacity: 0.85, lineHeight: '1.5', fontWeight: 400 }}>{selectedDomain.addendum}</p>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: shouldReduceMotion ? 0 : 0.12, duration: MOTION_TOKENS.DURATIONS.fast }} style={{ marginBottom: '18px' }}>
            <h4 style={{ color: 'rgba(255,255,255,0.68)', fontSize: '11px', fontWeight: 600, marginBottom: '10px', lineHeight: '1.3', letterSpacing: '0.12em', textTransform: 'uppercase' }}>What Happens Next</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {selectedDomain.downstream_effects.map((effect, i) => (
                <motion.div
                  key={i}
                  className="eq-effect-row-minimal group"
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: shouldReduceMotion ? 0 : 0.15 + (i * 0.04), duration: MOTION_TOKENS.DURATIONS.fast, ease: MOTION_TOKENS.CURVES.horizonIn }}
                  whileHover={effect.link ? { x: 4, transition: { duration: 0.14, ease: MOTION_TOKENS.CURVES.horizonIn } } : {}}
                  style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '10px 12px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', position: 'relative', cursor: effect.link ? 'pointer' : 'default' }}
                  onClick={effect.link ? () => console.log(`Navigate to ${effect.link}`) : undefined}
                >
                  <div className="flex-1 min-w-0">
                    <p style={{ color: TOKENS_COLORS.textBody, fontSize: '12.5px', lineHeight: '1.4', fontWeight: 500, marginBottom: '5px' }}>{effect.title}</p>
                    <div style={{ fontSize: '10px', color: TOKENS_COLORS.textMuted, fontWeight: 400, letterSpacing: '0.02em' }}>
                      {effect.tags.map((tag, idx) => (
                        <React.Fragment key={idx}>
                          {idx > 0 && <span style={{ opacity: 0.7, margin: '0 4px' }}>·</span>}
                          <span style={{ textTransform: 'lowercase' }}>{tag.toLowerCase()}</span>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                  {effect.link && (
                    <motion.div style={{ flexShrink: 0, paddingTop: '2px' }} animate={{ opacity: 0.4 }} whileHover={{ opacity: 0.8 }} transition={{ duration: 0.14 }}>
                      <ArrowRight className="w-3.5 h-3.5" style={{ color: TOKENS_COLORS.textTertiary }} />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: shouldReduceMotion ? 0 : 0.18, duration: MOTION_TOKENS.DURATIONS.fast }}
            className="p-3 rounded-2xl relative overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', boxShadow: `inset 0 0 20px ${getDomainGlow(selectedDomain.id)}`, padding: '14px 16px', marginBottom: '16px' }}
            whileHover={shouldReduceMotion ? {} : { filter: 'brightness(1.03)', transition: { duration: 0.14 } }}
          >
            {!shouldReduceMotion && (
              <motion.div
                style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 0%, ${getDomainGlow(selectedDomain.id)}, transparent 70%)`, opacity: 0.12, pointerEvents: 'none' }}
                animate={{ opacity: [0.12, 0.18, 0.12] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.68)', letterSpacing: '0.12em', fontSize: '10px', lineHeight: '1.3', fontWeight: 600, textTransform: 'uppercase' }}>What You Should Do</p>
              <div className="flex items-center gap-3 text-xs">
                <span style={{ color: 'rgba(255, 255, 255, 0.58)', fontSize: '12px' }}>{selectedDomain.actionable.horizon}</span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold" style={{
                  background: selectedDomain.actionable.conviction === 'Strong' ? 'rgba(88, 227, 164, 0.15)' : selectedDomain.actionable.conviction === 'Moderate' ? 'rgba(90, 160, 255, 0.15)' : 'rgba(255, 255, 255, 0.10)',
                  color: selectedDomain.actionable.conviction === 'Strong' ? 'rgba(88, 227, 164, 0.95)' : selectedDomain.actionable.conviction === 'Moderate' ? 'rgba(90, 160, 255, 0.95)' : 'rgba(255, 255, 255, 0.75)',
                  border: '1px solid rgba(255, 255, 255, 0.08)', letterSpacing: '0.03em'
                }}>{selectedDomain.actionable.conviction}</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {selectedDomain.actionable.directives.map((directive, i) => (
                <motion.div key={i} className="flex items-start gap-3" initial={{ opacity: 0, x: -3 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: shouldReduceMotion ? 0 : 0.21 + (i * 0.05), duration: MOTION_TOKENS.DURATIONS.fast }}>
                  <div style={{ width: '4px', height: '4px', borderRadius: '999px', background: getDomainColor(selectedDomain.id), marginTop: '5px', flexShrink: 0, boxShadow: `0 0 6px ${getDomainBloom(selectedDomain.id)}` }} />
                  <p style={{ color: 'rgba(220, 230, 240, 0.96)', fontSize: '12.5px', lineHeight: '1.5', fontWeight: 400, flex: 1, wordWrap: 'break-word', overflowWrap: 'break-word' }}>{directive}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* FIXED FOOTER */}
        <motion.div
          className="flex-shrink-0 border-t"
          style={{ background: TOKENS_HORIZON.drawerTint, borderColor: TOKENS_HORIZON.drawerDivider, backdropFilter: getBlur('panel'), zIndex: 10, paddingLeft: '16px', paddingRight: '16px', paddingTop: '12px', paddingBottom: '12px', overflow: 'visible' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, transition: { duration: MOTION_TOKENS.DURATIONS.fast, delay: shouldReduceMotion ? 0 : 0.24, ease: MOTION_TOKENS.CURVES.horizonIn } }}
          exit={{ opacity: 0, y: 5, transition: { duration: MOTION_TOKENS.DURATIONS.fast } }}
        >
          <div className="flex items-center justify-between text-xs" style={{ color: TOKENS_COLORS.textTertiary, fontSize: '11px' }}>
            <span style={{ opacity: 0.70 }}>Updated {new Date(selectedDomain.footer.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <span style={{ opacity: 0.55, letterSpacing: '0.05em' }}>1–4 · ← → · ESC</span>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}