import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const MOTION_TOKENS = {
  CURVES: { horizonIn: [0.22, 0.61, 0.36, 1] },
  DURATIONS: { fast: 0.12 }
};

const TOKENS = {
  colors: {
    textBody: 'rgba(255, 255, 255, 0.92)',
    textSecondary: 'rgba(255, 255, 255, 0.80)',
    textMuted: 'rgba(255,255,255,0.58)',
    textTertiary: 'rgba(255,255,255,0.65)',
    textPrimary: 'rgba(255, 255, 255, 0.95)',
  }
};

export default function EquilibriumDrawerBody({ selectedDomain, getDomainColor, getDomainBloom, getDomainGlow, shouldReduceMotion }) {
  return (
    <motion.div
      className="overflow-y-auto"
      style={{ position: 'relative', zIndex: 2, paddingLeft: '20px', paddingRight: '20px', paddingTop: '16px', paddingBottom: '16px', overflowX: 'hidden' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: MOTION_TOKENS.DURATIONS.fast, delay: shouldReduceMotion ? 0 : 0.06, ease: MOTION_TOKENS.CURVES.horizonIn } }}
      exit={{ opacity: 0, transition: { duration: MOTION_TOKENS.DURATIONS.fast } }}
    >
      {/* 1) WHAT IT MEANS */}
      <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: shouldReduceMotion ? 0 : 0.09, duration: MOTION_TOKENS.DURATIONS.fast }} style={{ marginBottom: '12px' }}>
        <h4 style={{ color: 'rgba(255,255,255,0.68)', fontSize: '11px', fontWeight: 600, marginBottom: '6px', lineHeight: '1.3', letterSpacing: '0.12em', textTransform: 'uppercase' }}>What It Means</h4>
        <p style={{ color: TOKENS.colors.textBody, fontSize: '13px', lineHeight: '1.55', fontWeight: 400, wordWrap: 'break-word', overflowWrap: 'break-word' }}>{selectedDomain.summary}</p>
        {selectedDomain.addendum && (
          <p style={{ color: TOKENS.colors.textSecondary, fontSize: '12px', marginTop: '10px', opacity: 0.85, lineHeight: '1.5', fontWeight: 400 }}>{selectedDomain.addendum}</p>
        )}
      </motion.div>

      {/* 2) DOWNSTREAM EFFECTS */}
      <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: shouldReduceMotion ? 0 : 0.12, duration: MOTION_TOKENS.DURATIONS.fast }} style={{ marginBottom: '18px' }}>
        <h4 style={{ color: 'rgba(255,255,255,0.68)', fontSize: '11px', fontWeight: 600, marginBottom: '10px', lineHeight: '1.3', letterSpacing: '0.12em', textTransform: 'uppercase' }}>What Happens Next</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {selectedDomain.downstream_effects.map((effect, i) => (
            <motion.div key={i} className="eq-effect-row-minimal group"
              initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: shouldReduceMotion ? 0 : 0.15 + (i * 0.04), duration: MOTION_TOKENS.DURATIONS.fast, ease: MOTION_TOKENS.CURVES.horizonIn }}
              whileHover={effect.link ? { x: 4, transition: { duration: 0.14, ease: MOTION_TOKENS.CURVES.horizonIn } } : {}}
              style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '10px 12px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', position: 'relative', cursor: effect.link ? 'pointer' : 'default' }}
              onClick={effect.link ? () => console.log(`Navigate to ${effect.link}`) : undefined}
            >
              <div className="flex-1 min-w-0">
                <p style={{ color: TOKENS.colors.textBody, fontSize: '12.5px', lineHeight: '1.4', fontWeight: 500, marginBottom: '5px' }}>{effect.title}</p>
                <div style={{ fontSize: '10px', color: TOKENS.colors.textMuted, fontWeight: 400, letterSpacing: '0.02em' }}>
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
                  <ArrowRight className="w-3.5 h-3.5" style={{ color: TOKENS.colors.textTertiary }} />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 3) ACTIONABLE SIGNAL */}
      <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: shouldReduceMotion ? 0 : 0.18, duration: MOTION_TOKENS.DURATIONS.fast }}
        className="p-3 rounded-2xl relative overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', boxShadow: `inset 0 0 20px ${getDomainGlow(selectedDomain.id)}`, padding: '14px 16px', marginBottom: '16px' }}
        whileHover={shouldReduceMotion ? {} : { filter: 'brightness(1.03)', transition: { duration: 0.14 } }}
      >
        {!shouldReduceMotion && (
          <motion.div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 0%, ${getDomainGlow(selectedDomain.id)}, transparent 70%)`, opacity: 0.12, pointerEvents: 'none' }}
            animate={{ opacity: [0.12, 0.18, 0.12] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} />
        )}
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.68)', letterSpacing: '0.12em', fontSize: '10px', lineHeight: '1.3', fontWeight: 600, textTransform: 'uppercase' }}>What You Should Do</p>
          <div className="flex items-center gap-3 text-xs">
            <span style={{ color: 'rgba(255,255,255,0.58)', fontSize: '12px' }}>{selectedDomain.actionable.horizon}</span>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold" style={{
              background: selectedDomain.actionable.conviction === 'Strong' ? 'rgba(88,227,164,0.15)' : selectedDomain.actionable.conviction === 'Moderate' ? 'rgba(90,160,255,0.15)' : 'rgba(255,255,255,0.10)',
              color: selectedDomain.actionable.conviction === 'Strong' ? 'rgba(88,227,164,0.95)' : selectedDomain.actionable.conviction === 'Moderate' ? 'rgba(90,160,255,0.95)' : 'rgba(255,255,255,0.75)',
              border: '1px solid rgba(255,255,255,0.08)', letterSpacing: '0.03em'
            }}>
              {selectedDomain.actionable.conviction}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {selectedDomain.actionable.directives.map((directive, i) => (
            <motion.div key={i} className="flex items-start gap-3" initial={{ opacity: 0, x: -3 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: shouldReduceMotion ? 0 : 0.21 + (i * 0.05), duration: MOTION_TOKENS.DURATIONS.fast }}>
              <div style={{ width: '4px', height: '4px', borderRadius: '999px', background: getDomainColor(selectedDomain.id), marginTop: '5px', flexShrink: 0, boxShadow: `0 0 6px ${getDomainBloom(selectedDomain.id)}` }} />
              <p style={{ color: 'rgba(220,230,240,0.96)', fontSize: '12.5px', lineHeight: '1.5', fontWeight: 400, flex: 1, wordWrap: 'break-word', overflowWrap: 'break-word' }}>{directive}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}