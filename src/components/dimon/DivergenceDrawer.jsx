import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, Eye, GitMerge, Target, BrainCircuit, Users, CheckCircle, XCircle, ChevronLeft, ChevronRight, Sparkles, Zap, ArrowRight } from 'lucide-react';

const HORIZON_EASE = [0.22, 0.61, 0.36, 1];

const getDivergenceTheme = (type) => {
  switch (type) {
    case 'coverage_gap':
      return { Icon: Eye, label: 'Coverage Gap', color: '#FFB020', glow: 'rgba(255,176,32,0.18)' };
    case 'angle_disagreement':
      return { Icon: GitMerge, label: 'Angle Disagreement', color: '#B47FFF', glow: 'rgba(180,127,255,0.18)' };
    default:
      return { Icon: AlertCircle, label: 'Narrative Fracture', color: '#5EA7FF', glow: 'rgba(94,167,255,0.18)' };
  }
};

const getDivergenceDetails = (divergence) => {
  if (!divergence) return {
    morning_takeaway: "Market narrative divergence detected across sources.",
    rationale_bullets: ["Narrative inconsistency identified across publications"],
    forward_outlook: "Monitor for narrative convergence or escalation."
  };
  switch (divergence.id) {
    case 'em_credit':
      return {
        morning_takeaway: "Credit stress is underreported — Street may be underestimating systemic risk in emerging markets.",
        rationale_bullets: [
          "Spread decompression signals tightening financial conditions",
          "Coverage bias leaves Street blind to systemic EM corporate risk",
          "Liquidity risks threaten spillover into developed market credit"
        ],
        forward_outlook: "If EM HY spreads breach 600 bps, expect contagion into US high-yield and broader risk-off flows into Treasuries."
      };
    case 'energy_vs_industrials':
      return {
        morning_takeaway: "Energy resilience masked by industrial weakness — sector rotation signals may be misfiring.",
        rationale_bullets: [
          "Margin dispersion widening between energy and industrial sectors",
          "Commodity exposure creating performance divergence",
          "Cyclical indicators showing mixed signals across industrial verticals"
        ],
        forward_outlook: "Watch for industrial capex guidance revisions in Q4 earnings — could trigger broader cyclical sector reassessment."
      };
    default:
      return {
        morning_takeaway: "Market narrative fracture detected across key publications.",
        rationale_bullets: [
          "Source disagreement on market implications",
          "Coverage gaps creating information asymmetries",
          "Narrative conflicts may signal emerging market themes"
        ],
        forward_outlook: "Monitor for narrative convergence or escalation in coming sessions."
      };
  }
};

const SourceChip = ({ source, present }) => {
  const color = present ? 'rgba(88,227,164,0.90)' : 'rgba(255,106,122,0.90)';
  const bg = present ? 'rgba(88,227,164,0.08)' : 'rgba(255,106,122,0.08)';
  const border = present ? 'rgba(88,227,164,0.20)' : 'rgba(255,106,122,0.20)';
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      padding: '4px 10px', borderRadius: '8px',
      background: bg, border: `1px solid ${border}`,
      fontSize: '11px', fontWeight: 600, color, letterSpacing: '0.04em'
    }}>
      {present ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
      {source.toUpperCase()}
    </div>
  );
};

const SectionLabel = ({ children }) => (
  <p style={{
    fontSize: '10px', fontWeight: 600, letterSpacing: '0.12em',
    textTransform: 'uppercase', color: 'rgba(255,255,255,0.50)',
    marginBottom: '10px'
  }}>{children}</p>
);

export default function DivergenceDrawer({ isOpen, onClose, divergence, onNavigate }) {
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    const handler = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', handler);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handler);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !divergence) return null;

  const theme = getDivergenceTheme(divergence.type);
  const { Icon } = theme;
  const details = getDivergenceDetails(divergence);
  const presentIn = divergence.present_in || [];
  const missingIn = divergence.missing_in || [];
  const confidence = Math.round((divergence.confidence || 0.6) * 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="div-backdrop"
            className="fixed inset-0 z-[200]"
            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', top: '72px' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            onClick={onClose}
          />

          {/* Drawer Panel */}
          <motion.div
            key={`div-panel-${divergence.id}`}
            className="fixed z-[210] flex flex-col"
            style={{
              top: '72px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '100%',
              maxWidth: '780px',
              maxHeight: 'calc(100vh - 88px)',
              borderRadius: '24px',
              background: 'rgba(13, 16, 22, 0.92)',
              backdropFilter: 'blur(36px) saturate(175%)',
              WebkitBackdropFilter: 'blur(36px) saturate(175%)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: `0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.10)`,
              overflow: 'hidden'
            }}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.26, ease: HORIZON_EASE }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top specular highlight */}
            <div style={{
              position: 'absolute', top: 0, left: '20%', right: '20%', height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)',
              pointerEvents: 'none', zIndex: 10
            }} />

            {/* Ambient domain glow */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '180px',
              background: `radial-gradient(ellipse at 50% 0%, ${theme.glow} 0%, transparent 70%)`,
              pointerEvents: 'none', zIndex: 0
            }} />

            {/* ─── HEADER ─── */}
            <div style={{
              position: 'relative', zIndex: 5,
              padding: '20px 24px 18px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px'
            }}>
              <div className="flex items-center gap-4">
                {/* Domain icon */}
                <div style={{
                  width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: `linear-gradient(135deg, ${theme.color}18, ${theme.color}0A)`,
                  border: `1px solid ${theme.color}30`,
                  boxShadow: `0 0 18px ${theme.glow}`
                }}>
                  <Icon className="w-5 h-5" style={{ color: theme.color }} strokeWidth={2} />
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <h2 style={{
                      fontSize: '17px', fontWeight: 600, color: 'rgba(255,255,255,0.96)',
                      letterSpacing: '-0.01em', lineHeight: 1.2
                    }}>
                      Divergence Analysis
                    </h2>
                    <span style={{
                      fontSize: '10px', fontWeight: 600, letterSpacing: '0.06em',
                      textTransform: 'uppercase', padding: '3px 9px', borderRadius: '999px',
                      color: theme.color, background: `${theme.color}14`, border: `1px solid ${theme.color}28`
                    }}>
                      {theme.label}
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.50)', lineHeight: 1.4 }}>
                    {divergence.topic}
                  </p>
                </div>
              </div>

              {/* Nav + Close */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                {[
                  { label: 'Prev', icon: ChevronLeft, action: () => onNavigate('prev') },
                  { label: 'Next', icon: ChevronRight, action: () => onNavigate('next') },
                  { label: 'Close', icon: X, action: onClose }
                ].map(({ label, icon: Ic, action }) => (
                  <motion.button
                    key={label}
                    onClick={action}
                    aria-label={label}
                    style={{
                      width: '36px', height: '36px', borderRadius: '10px', border: 'none',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'rgba(255,255,255,0.06)', cursor: 'pointer',
                      color: 'rgba(255,255,255,0.60)'
                    }}
                    whileHover={{ background: 'rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.92)' }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ duration: 0.14 }}
                  >
                    <Ic className="w-4 h-4" strokeWidth={2} />
                  </motion.button>
                ))}
              </div>
            </div>

            {/* ─── SCROLLABLE BODY ─── */}
            <div style={{
              overflowY: 'auto', position: 'relative', zIndex: 5,
              padding: '24px 24px 28px',
              scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.12) transparent',
              display: 'flex', flexDirection: 'column', gap: '20px'
            }}>

              {/* Morning Takeaway */}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05, duration: 0.22, ease: HORIZON_EASE }}
              >
                <SectionLabel>Morning Takeaway</SectionLabel>
                <div style={{
                  padding: '18px 20px', borderRadius: '14px',
                  background: `linear-gradient(135deg, ${theme.color}0D, rgba(255,255,255,0.03))`,
                  borderLeft: `2px solid ${theme.color}`,
                  border: `1px solid ${theme.color}20`,
                  borderLeftWidth: '2px'
                }}>
                  <p style={{
                    fontSize: '15px', lineHeight: '1.6', fontWeight: 500,
                    color: 'rgba(255,255,255,0.92)', letterSpacing: '-0.005em'
                  }}>
                    {details.morning_takeaway}
                  </p>
                </div>
              </motion.div>

              {/* AI Rationale */}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.10, duration: 0.22, ease: HORIZON_EASE }}
              >
                <SectionLabel>AI Rationale</SectionLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {details.rationale_bullets.map((bullet, i) => (
                    <motion.div
                      key={i}
                      style={{
                        display: 'flex', alignItems: 'flex-start', gap: '12px',
                        padding: '12px 14px', borderRadius: '12px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.06)'
                      }}
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.12 + i * 0.05, duration: 0.2, ease: HORIZON_EASE }}
                    >
                      <div style={{
                        width: '5px', height: '5px', borderRadius: '50%', flexShrink: 0, marginTop: '6px',
                        background: theme.color, boxShadow: `0 0 8px ${theme.glow}`
                      }} />
                      <p style={{ fontSize: '13.5px', lineHeight: '1.55', color: 'rgba(255,255,255,0.80)', fontWeight: 400 }}>
                        {bullet}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Source Coverage */}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.22, ease: HORIZON_EASE }}
              >
                <SectionLabel>Source Coverage</SectionLabel>
                <div style={{
                  padding: '16px 18px', borderRadius: '14px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex', flexDirection: 'column', gap: '14px'
                }}>
                  {/* Confidence bar */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>
                        Analysis Confidence
                      </span>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: theme.color }}>
                        {confidence}%
                      </span>
                    </div>
                    <div style={{ height: '4px', borderRadius: '999px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                      <motion.div
                        style={{ height: '100%', borderRadius: '999px', background: theme.color, boxShadow: `0 0 8px ${theme.glow}` }}
                        initial={{ width: '0%' }}
                        animate={{ width: `${confidence}%` }}
                        transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    {/* Present In */}
                    {presentIn.length > 0 && (
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(88,227,164,0.75)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
                          Present In
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {presentIn.map(src => <SourceChip key={src} source={src} present={true} />)}
                        </div>
                      </div>
                    )}
                    {/* Missing In */}
                    {missingIn.length > 0 && (
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(255,106,122,0.75)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
                          Missing In
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {missingIn.map(src => <SourceChip key={src} source={src} present={false} />)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Forward Outlook */}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.20, duration: 0.22, ease: HORIZON_EASE }}
              >
                <SectionLabel>Forward Outlook</SectionLabel>
                <div style={{
                  padding: '18px 20px', borderRadius: '14px',
                  background: 'rgba(106,199,247,0.05)',
                  border: '1px solid rgba(106,199,247,0.14)',
                  display: 'flex', alignItems: 'flex-start', gap: '12px'
                }}>
                  <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'rgba(106,199,247,0.75)' }} />
                  <p style={{
                    fontSize: '13.5px', lineHeight: '1.6', fontWeight: 400,
                    color: 'rgba(220,238,252,0.90)'
                  }}>
                    {details.forward_outlook}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* ─── FOOTER ─── */}
            <div style={{
              position: 'relative', zIndex: 5,
              padding: '12px 24px',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.02em' }}>
                ← → to navigate · Esc to close
              </span>
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>
                {presentIn.length + missingIn.length} sources analysed
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}