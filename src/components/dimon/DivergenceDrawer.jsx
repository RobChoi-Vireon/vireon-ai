import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, Eye, GitMerge, CheckCircle, XCircle, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

// ─── OS HORIZON TOKENS ───────────────────────────────────────────────────────
const EASE = [0.22, 0.61, 0.36, 1];

function getDivergenceTheme(type) {
  const t = (type || '').toUpperCase();
  switch (t) {
    case 'COVERAGE_GAP':
    case 'coverage_gap':    return { Icon: Eye,         label: 'Coverage Gap',      color: '#FFB020', glow: 'rgba(255,176,32,0.12)' };
    case 'ANGLE_DISAGREE':
    case 'angle_disagreement': return { Icon: GitMerge, label: 'Angle Disagree', color: '#B47FFF', glow: 'rgba(180,127,255,0.12)' };
    case 'DATA_CONFLICT':   return { Icon: AlertCircle, label: 'Data Conflict',    color: '#F26A6A', glow: 'rgba(242,106,106,0.12)' };
    case 'TIMING_MISMATCH': return { Icon: AlertCircle, label: 'Timing Mismatch',  color: '#5EA7FF', glow: 'rgba(94,167,255,0.12)' };
    default:                return { Icon: AlertCircle, label: 'Narrative Fracture', color: '#5EA7FF', glow: 'rgba(94,167,255,0.12)' };
  }
}

function getDivergenceDetails(divergence) {
  if (!divergence) return {
    morning_takeaway: "Market narrative divergence detected across sources.",
    rationale_bullets: ["Narrative inconsistency identified across publications"],
    forward_outlook: "Monitor for narrative convergence or escalation."
  };
  switch (divergence.id) {
    case 'em_credit': return {
      morning_takeaway: "Credit stress is underreported — Street may be underestimating systemic risk in emerging markets.",
      rationale_bullets: [
        "Spread decompression signals tightening financial conditions",
        "Coverage bias leaves Street blind to systemic EM corporate risk",
        "Liquidity risks threaten spillover into developed market credit"
      ],
      forward_outlook: "If EM HY spreads breach 600 bps, expect contagion into US high-yield and broader risk-off flows into Treasuries."
    };
    case 'energy_vs_industrials': return {
      morning_takeaway: "Energy resilience masked by industrial weakness — sector rotation signals may be misfiring.",
      rationale_bullets: [
        "Margin dispersion widening between energy and industrial sectors",
        "Commodity exposure creating performance divergence",
        "Cyclical indicators showing mixed signals across industrial verticals"
      ],
      forward_outlook: "Watch for industrial capex guidance revisions in Q4 earnings — could trigger broader cyclical sector reassessment."
    };
    default: return {
      morning_takeaway: "Market narrative fracture detected across key publications.",
      rationale_bullets: [
        "Source disagreement on market implications",
        "Coverage gaps creating information asymmetries",
        "Narrative conflicts may signal emerging market themes"
      ],
      forward_outlook: "Monitor for narrative convergence or escalation in coming sessions."
    };
  }
}

// ─── SOURCE CHIP ─────────────────────────────────────────────────────────────
const SourceChip = ({ source, present }) => {
  const [hov, setHov] = useState(false);
  const color = present ? '#58E3A4' : '#FF6A7A';
  return (
    <motion.div
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      animate={{
        background: hov
          ? (present ? 'rgba(88,227,164,0.14)' : 'rgba(255,106,122,0.14)')
          : (present ? 'rgba(88,227,164,0.07)' : 'rgba(255,106,122,0.07)')
      }}
      transition={{ duration: 0.14 }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '5px',
        padding: '4px 10px 4px 8px', borderRadius: '999px',
        border: `1px solid ${present ? 'rgba(88,227,164,0.20)' : 'rgba(255,106,122,0.20)'}`,
        fontSize: '11px', fontWeight: 600, color,
        letterSpacing: '0.04em', cursor: 'default',
        boxShadow: hov ? `0 0 10px ${present ? 'rgba(88,227,164,0.15)' : 'rgba(255,106,122,0.15)'}` : 'none'
      }}
    >
      {present
        ? <CheckCircle className="w-3 h-3" strokeWidth={2.5} />
        : <XCircle className="w-3 h-3" strokeWidth={2.5} />}
      {source.toUpperCase()}
    </motion.div>
  );
};

// ─── SECTION LABEL ────────────────────────────────────────────────────────────
const SectionLabel = ({ children }) => (
  <p style={{
    fontSize: '10px', fontWeight: 600, letterSpacing: '0.12em',
    textTransform: 'uppercase', color: 'rgba(255,255,255,0.42)', marginBottom: '10px'
  }}>
    {children}
  </p>
);

// ─── INSET PANEL ─────────────────────────────────────────────────────────────
const InsetPanel = ({ children, accent, style = {} }) => (
  <div style={{
    padding: '16px 18px', borderRadius: '14px',
    background: accent
      ? `linear-gradient(135deg, ${accent}0A, rgba(255,255,255,0.02))`
      : 'rgba(255,255,255,0.03)',
    border: accent ? `1px solid ${accent}1A` : '1px solid rgba(255,255,255,0.06)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
    ...style
  }}>
    {children}
  </div>
);

// ─── CONTROL BUTTON ──────────────────────────────────────────────────────────
const CtrlBtn = ({ icon: Icon, label, onClick }) => (
  <motion.button
    onClick={onClick}
    aria-label={label}
    style={{
      width: '34px', height: '34px', borderRadius: '999px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
      backdropFilter: 'blur(12px)', cursor: 'pointer', color: 'rgba(255,255,255,0.55)',
      outline: 'none', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)'
    }}
    whileHover={{
      background: 'rgba(255,255,255,0.11)',
      color: 'rgba(255,255,255,0.90)',
      boxShadow: '0 0 12px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.10)'
    }}
    whileTap={{ scale: 0.94 }}
    transition={{ duration: 0.13 }}
  >
    <Icon className="w-4 h-4" strokeWidth={2} />
  </motion.button>
);

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function DivergenceDrawer({ isOpen, onClose, divergence, onNavigate }) {
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    const handler = (e) => {
      if (e.key === 'Escape') onClose?.();
      if (e.key === 'ArrowLeft') onNavigate?.('prev');
      if (e.key === 'ArrowRight') onNavigate?.('next');
    };
    document.addEventListener('keydown', handler);
    return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', handler); };
  }, [isOpen, onClose, onNavigate]);

  if (!isOpen || !divergence) return null;

  const theme = getDivergenceTheme(divergence.type);
  const { Icon } = theme;

  // Support both live data shape and old shape
  const hasLiveData = divergence?.morning_takeaway !== undefined || divergence?.ai_rationale !== undefined;
  const details = hasLiveData
    ? {
        morning_takeaway: divergence.morning_takeaway || '',
        rationale_bullets: divergence.ai_rationale || [],
        forward_outlook: divergence.forward_outlook || ''
      }
    : getDivergenceDetails(divergence);

  const presentIn = divergence.sources_present || divergence.present_in || [];
  const missingIn = divergence.sources_missing || divergence.missing_in || [];
  // confidence: live = integer 0-100, old = float 0-1
  const rawConf = divergence.confidence || 0;
  const confidence = hasLiveData ? rawConf : Math.round(rawConf * 100);
  // topic/headline display
  const displayTitle = divergence.headline || divergence.topic || 'Divergence Analysis';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            key="div-backdrop"
            style={{
              position: 'fixed', inset: 0, zIndex: 200, top: '72px',
              background: 'rgba(4,6,12,0.60)',
              backdropFilter: 'blur(22px) saturate(140%)',
              WebkitBackdropFilter: 'blur(22px) saturate(140%)'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            onClick={onClose}
          />

          {/* ── Sheet Panel ── */}
          <motion.div
            key={`div-sheet-${divergence.id}`}
            style={{
              position: 'fixed', zIndex: 210,
              top: '80px', left: '50%',
              width: '100%', maxWidth: '760px',
              maxHeight: 'calc(100vh - 96px)',
              borderRadius: '28px',
              background: 'linear-gradient(180deg, rgba(16,19,28,0.96) 0%, rgba(10,13,20,0.98) 100%)',
              backdropFilter: 'blur(48px) saturate(180%)',
              WebkitBackdropFilter: 'blur(48px) saturate(180%)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 40px 100px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.03), inset 0 1px 0 rgba(255,255,255,0.10)',
              overflow: 'hidden',
              display: 'flex', flexDirection: 'column'
            }}
            initial={{ opacity: 0, y: 12, scale: 0.975, x: '-50%' }}
            animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
            exit={{ opacity: 0, y: 8, scale: 0.982, x: '-50%' }}
            transition={{ duration: 0.26, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top specular */}
            <div style={{
              position: 'absolute', top: 0, left: '18%', right: '18%', height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
              pointerEvents: 'none', zIndex: 20
            }} />

            {/* Theme ambient glow */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '200px',
              background: `radial-gradient(ellipse at 50% 0%, ${theme.glow} 0%, transparent 72%)`,
              pointerEvents: 'none', zIndex: 0
            }} />

            {/* ── HEADER ── */}
            <div style={{
              position: 'relative', zIndex: 10, flexShrink: 0,
              padding: '20px 22px 18px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
                {/* Icon puck */}
                <div style={{
                  width: '42px', height: '42px', borderRadius: '13px', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: `linear-gradient(135deg, ${theme.color}18, ${theme.color}0A)`,
                  border: `1px solid ${theme.color}28`,
                  boxShadow: `0 0 20px ${theme.glow}, inset 0 1px 0 rgba(255,255,255,0.08)`
                }}>
                  <Icon className="w-5 h-5" style={{ color: theme.color }} strokeWidth={2} />
                </div>

                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <h2 style={{
                      fontSize: '17px', fontWeight: 600, color: 'rgba(255,255,255,0.96)',
                      letterSpacing: '-0.015em', lineHeight: 1.2
                    }}>
                      Divergence Analysis
                    </h2>
                    {/* Type chip */}
                    <span style={{
                      fontSize: '10px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
                      padding: '3px 8px', borderRadius: '999px',
                      color: theme.color, background: `${theme.color}12`, border: `1px solid ${theme.color}25`
                    }}>
                      {theme.label}
                    </span>
                  </div>
                  <p style={{
                    fontSize: '12.5px', color: 'rgba(255,255,255,0.48)', lineHeight: 1.4,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                  }}>
                    {displayTitle}
                  </p>
                </div>
              </div>

              {/* Control rail */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                <CtrlBtn icon={ChevronLeft} label="Previous divergence" onClick={() => onNavigate('prev')} />
                <CtrlBtn icon={ChevronRight} label="Next divergence" onClick={() => onNavigate('next')} />
                <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.08)', margin: '0 2px' }} />
                <CtrlBtn icon={X} label="Close" onClick={onClose} />
              </div>
            </div>

            {/* ── SCROLLABLE BODY ── */}
            <div style={{
              overflowY: 'auto', position: 'relative', zIndex: 5, flex: 1,
              padding: '22px 22px 24px',
              scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.10) transparent',
              display: 'flex', flexDirection: 'column', gap: '18px'
            }}>

              {/* Morning Takeaway */}
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06, duration: 0.22, ease: EASE }}
              >
                <SectionLabel>Morning Takeaway</SectionLabel>
                <div style={{
                  padding: '18px 20px', borderRadius: '14px',
                  background: `linear-gradient(135deg, ${theme.color}0C, rgba(255,255,255,0.02))`,
                  borderLeft: `2px solid ${theme.color}60`,
                  border: `1px solid ${theme.color}1C`,
                  borderLeftWidth: '2px',
                  boxShadow: `inset 0 1px 0 rgba(255,255,255,0.04), 0 0 30px ${theme.glow}`
                }}>
                  <p style={{
                    fontSize: '15px', lineHeight: '1.62', fontWeight: 500,
                    color: 'rgba(255,255,255,0.92)', letterSpacing: '-0.008em'
                  }}>
                    {details.morning_takeaway}
                  </p>
                </div>
              </motion.div>

              {/* AI Rationale */}
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.10, duration: 0.22, ease: EASE }}
              >
                <SectionLabel>AI Rationale</SectionLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                  {details.rationale_bullets.map((bullet, i) => (
                    <BulletRow key={i} text={bullet} color={theme.color} glow={theme.glow} delay={0.12 + i * 0.05} />
                  ))}
                </div>
              </motion.div>

              {/* Source Coverage */}
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.22, ease: EASE }}
              >
                <SectionLabel>Source Coverage</SectionLabel>
                <InsetPanel>
                  {/* Confidence row */}
                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>
                        Analysis Confidence
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: theme.color, letterSpacing: '-0.01em' }}>
                        {confidence}%
                      </span>
                    </div>
                    {/* Glass track */}
                    <div style={{
                      height: '5px', borderRadius: '999px',
                      background: 'rgba(255,255,255,0.07)',
                      boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.30), inset 0 0 0 1px rgba(255,255,255,0.04)',
                      overflow: 'hidden', position: 'relative'
                    }}>
                      {/* Track inner shimmer */}
                      <div style={{
                        position: 'absolute', inset: 0, top: 0, left: 0, right: 0, height: '1px',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)'
                      }} />
                      <motion.div
                        style={{
                          height: '100%', borderRadius: '999px',
                          background: `linear-gradient(90deg, ${theme.color}90, ${theme.color})`,
                          boxShadow: `0 0 10px ${theme.glow}`
                        }}
                        initial={{ width: '0%' }}
                        animate={{ width: `${confidence}%` }}
                        transition={{ duration: 0.55, delay: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
                      />
                    </div>
                  </div>

                  {/* Source chips */}
                  {(presentIn.length > 0 || missingIn.length > 0) && (
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                      {presentIn.length > 0 && (
                        <div style={{ flex: 1, minWidth: '120px' }}>
                          <p style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(88,227,164,0.65)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
                            Present In
                          </p>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {presentIn.map(src => <SourceChip key={src} source={src} present={true} />)}
                          </div>
                        </div>
                      )}
                      {missingIn.length > 0 && (
                        <div style={{ flex: 1, minWidth: '120px' }}>
                          <p style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(255,106,122,0.65)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
                            Missing In
                          </p>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {missingIn.map(src => <SourceChip key={src} source={src} present={false} />)}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </InsetPanel>
              </motion.div>

              {/* Forward Outlook */}
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.20, duration: 0.22, ease: EASE }}
              >
                <SectionLabel>Forward Outlook</SectionLabel>
                <div style={{
                  padding: '16px 18px', borderRadius: '14px',
                  background: 'rgba(106,199,247,0.05)', border: '1px solid rgba(106,199,247,0.12)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
                  display: 'flex', alignItems: 'flex-start', gap: '12px'
                }}>
                  <div style={{
                    width: '26px', height: '26px', borderRadius: '8px', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(106,199,247,0.10)', border: '1px solid rgba(106,199,247,0.16)'
                  }}>
                    <Sparkles className="w-3.5 h-3.5" style={{ color: 'rgba(106,199,247,0.80)' }} />
                  </div>
                  <p style={{
                    fontSize: '13.5px', lineHeight: '1.62', fontWeight: 400,
                    color: 'rgba(210,235,252,0.88)', letterSpacing: '-0.003em'
                  }}>
                    {details.forward_outlook}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* ── FOOTER ── */}
            <div style={{
              position: 'relative', zIndex: 10, flexShrink: 0,
              padding: '11px 22px', borderTop: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.02em' }}>
                ← → navigate · Esc close
              </span>
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.28)' }}>
                {presentIn.length + missingIn.length} sources analysed
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Extracted bullet row to keep JSX clean
function BulletRow({ text, color, glow, delay }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.div
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      initial={{ opacity: 0, x: -4 }}
      animate={{ opacity: 1, x: 0, background: hov ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.03)' }}
      transition={{ delay, duration: 0.20, ease: EASE }}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: '12px',
        padding: '11px 14px', borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)'
      }}
    >
      <div style={{
        width: '5px', height: '5px', borderRadius: '50%', flexShrink: 0, marginTop: '7px',
        background: color, boxShadow: `0 0 7px ${glow}`
      }} />
      <p style={{ fontSize: '13.5px', lineHeight: '1.58', color: 'rgba(255,255,255,0.78)', fontWeight: 400 }}>
        {text}
      </p>
    </motion.div>
  );
}