import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitCommit, AlertTriangle, ChevronRight, BarChart2, Database, Eye, GitMerge, AlertCircle } from 'lucide-react';

// ─── OS HORIZON TOKENS ───────────────────────────────────────────────────────
const EASE = [0.22, 0.61, 0.36, 1];

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

function getTypeTheme(type) {
  const t = (type || '').toUpperCase();
  switch (t) {
    case 'COVERAGE_GAP':
    case 'coverage_gap': return { Icon: Eye, label: 'Coverage Gap', color: '#FFB020', glow: 'rgba(255,176,32,0.15)' };
    case 'ANGLE_DISAGREE':
    case 'angle_disagreement': return { Icon: GitMerge, label: 'Angle Disagree', color: '#B47FFF', glow: 'rgba(180,127,255,0.15)' };
    case 'DATA_CONFLICT': return { Icon: AlertCircle, label: 'Data Conflict', color: '#F26A6A', glow: 'rgba(242,106,106,0.15)' };
    case 'TIMING_MISMATCH': return { Icon: Database, label: 'Timing Mismatch', color: '#5EA7FF', glow: 'rgba(94,167,255,0.15)' };
    default: return { Icon: AlertCircle, label: 'Narrative Fracture', color: '#5EA7FF', glow: 'rgba(94,167,255,0.15)' };
  }
}

function getSeverityTheme(severity) {
  switch ((severity || '').toUpperCase()) {
    case 'CRITICAL': return { label: 'Critical', color: '#F26A6A', glow: 'rgba(242,106,106,0.20)' };
    case 'HIGH': return { label: 'Elevated', color: '#F26A6A', glow: 'rgba(242,106,106,0.20)' };
    case 'MODERATE': return { label: 'Moderate', color: '#FFB020', glow: 'rgba(255,176,32,0.20)' };
    default: return { label: 'Low', color: '#5EA7FF', glow: 'rgba(94,167,255,0.20)' };
  }
}

function getRiskLevel(confidence) {
  if (confidence >= 0.7) return { label: 'Elevated', color: '#F26A6A', glow: 'rgba(242,106,106,0.20)' };
  if (confidence >= 0.5) return { label: 'Moderate', color: '#FFB020', glow: 'rgba(255,176,32,0.20)' };
  return { label: 'Low', color: '#5EA7FF', glow: 'rgba(94,167,255,0.20)' };
}

function getContextCue(divergence) {
  switch (divergence?.id) {
    case 'em_credit': return 'Companies in developing countries are struggling to borrow money';
    case 'energy_vs_industrials': return 'Energy companies are doing well while factories are slowing down';
    default: return 'News sources are telling different stories about this topic';
  }
}

// ─── FRACTURE BAR ─────────────────────────────────────────────────────────────
const FractureBar = ({ count }) => {
  const intensity = Math.min(5, Math.max(1, count));
  const [tooltip, setTooltip] = useState(false);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <span style={{ fontSize: '11px', fontWeight: 500, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        Fracture Intensity
      </span>
      <div
        style={{ display: 'flex', gap: '4px', position: 'relative', cursor: 'default' }}
        onMouseEnter={() => setTooltip(true)}
        onMouseLeave={() => setTooltip(false)}
      >
        {[...Array(5)].map((_, i) => {
          const active = i < intensity;
          return (
            <motion.div
              key={i}
              style={{
                width: '20px', height: '5px', borderRadius: '999px',
                background: active
                  ? `linear-gradient(90deg, rgba(180,127,255,0.70), rgba(160,100,255,0.85))`
                  : 'rgba(255,255,255,0.08)',
                border: active ? '1px solid rgba(180,127,255,0.20)' : '1px solid rgba(255,255,255,0.05)',
                boxShadow: active ? '0 0 6px rgba(180,127,255,0.18), inset 0 1px 0 rgba(255,255,255,0.12)' : 'none',
              }}
              animate={active ? { opacity: [0.75, 1, 0.75] } : {}}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
            />
          );
        })}
        <AnimatePresence>
          {tooltip && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.15 }}
              style={{
                position: 'absolute', bottom: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)',
                padding: '5px 10px', borderRadius: '8px', whiteSpace: 'nowrap',
                background: 'rgba(10,13,20,0.96)', border: '1px solid rgba(255,255,255,0.10)',
                backdropFilter: 'blur(16px)', fontSize: '11px', color: 'rgba(255,255,255,0.80)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.40)', zIndex: 20
              }}
            >
              How much credible sources disagree.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(180,127,255,0.85)', letterSpacing: '0.02em' }}>
        {intensity}/5
      </span>
    </div>
  );
};

// ─── DIVERGENCE CARD ──────────────────────────────────────────────────────────
const DivergenceCard = ({ divergence, onClick, index }) => {
  const [hovered, setHovered] = useState(false);
  const typeTheme = getTypeTheme(divergence?.type);
  // Support both live data (severity string + confidence integer) and old format (confidence 0-1)
  const hasLiveData = divergence?.severity !== undefined || divergence?.headline !== undefined;
  const risk = hasLiveData
    ? getSeverityTheme(divergence?.severity)
    : getRiskLevel(divergence?.confidence || 0.6);
  const contextCue = hasLiveData
    ? (divergence?.summary || divergence?.headline || '')
    : getContextCue(divergence);
  // confidence: live data = integer 0-100, old = float 0-1
  const rawConf = divergence?.confidence || 0;
  const confidence = hasLiveData ? rawConf : Math.round(rawConf * 100);
  // source count: live data has source_count field
  const sourceCount = divergence?.source_count
    ?? ((divergence?.present_in || []).length + (divergence?.missing_in || []).length);
  // headline: live data uses headline, old uses topic
  const headline = divergence?.headline || divergence?.topic || 'Unknown Topic';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.30, ease: EASE }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      tabIndex={0}
      role="button"
      aria-label={`View divergence: ${divergence?.topic}`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick?.(divergence); }}
      style={{ outline: 'none', position: 'relative' }}
    >
      <motion.div
        onClick={() => onClick?.(divergence)}
        animate={{
          y: hovered ? -2 : 0,
          boxShadow: hovered
            ? `inset 0 1px 0 rgba(255,255,255,0.10), 0 8px 32px rgba(0,0,0,0.30), 0 0 0 1px rgba(255,255,255,0.09)`
            : GLASS.card.boxShadow
        }}
        transition={{ duration: 0.16, ease: EASE }}
        style={{
          ...GLASS.card,
          padding: '20px 22px',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Top specular edge */}
        <div style={{
          position: 'absolute', top: 0, left: '15%', right: '15%', height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)',
          pointerEvents: 'none'
        }} />

        {/* Hover specular sweep */}
        <motion.div
          style={{
            position: 'absolute', inset: 0, borderRadius: '20px', pointerEvents: 'none',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 55%)'
          }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.16 }}
        />

        {/* Type accent glow (very subtle) */}
        <motion.div
          style={{
            position: 'absolute', inset: 0, borderRadius: '20px', pointerEvents: 'none',
            background: `radial-gradient(ellipse at 0% 50%, ${typeTheme.glow} 0%, transparent 65%)`
          }}
          animate={{ opacity: hovered ? 1 : 0.4 }}
          transition={{ duration: 0.18 }}
        />

        {/* ── Header Row ── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '10px', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            {/* Icon puck */}
            <div style={{
              width: '30px', height: '30px', borderRadius: '9px', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: `${typeTheme.color}12`, border: `1px solid ${typeTheme.color}22`,
              boxShadow: `0 0 10px ${typeTheme.glow}`
            }}>
              <typeTheme.Icon className="w-3.5 h-3.5" style={{ color: typeTheme.color }} strokeWidth={2} />
            </div>
            <h4 style={{
              fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.94)',
              letterSpacing: '-0.01em', lineHeight: 1.3,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
            }}>
              {String(divergence?.topic || 'Unknown Topic')}
            </h4>
          </div>

          {/* Risk pill */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px', flexShrink: 0,
            padding: '4px 10px 4px 8px', borderRadius: '999px',
            background: `${risk.color}0C`, border: `1px solid ${risk.color}22`,
            backdropFilter: 'blur(12px)', fontSize: '10px', fontWeight: 600,
            color: risk.color, letterSpacing: '0.05em', textTransform: 'uppercase'
          }}>
            <div style={{
              width: '5px', height: '5px', borderRadius: '50%',
              background: risk.color, boxShadow: `0 0 5px ${risk.color}80`
            }} />
            {risk.label}
          </div>
        </div>

        {/* ── Summary ── */}
        <p style={{
          fontSize: '13px', lineHeight: '1.55', color: 'rgba(255,255,255,0.72)',
          fontWeight: 400, position: 'relative', zIndex: 2, marginBottom: '14px'
        }}>
          {contextCue}
        </p>

        {/* ── Footer row (always visible) ── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '16px',
          paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)',
          position: 'relative', zIndex: 2
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <BarChart2 className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.40)' }} strokeWidth={2} />
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.52)', fontWeight: 500 }}>
              {confidence}% confidence
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Database className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.40)' }} strokeWidth={2} />
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.52)', fontWeight: 500 }}>
              {sourceCount} {sourceCount === 1 ? 'source' : 'sources'}
            </span>
          </div>

          {/* Type chip */}
          <div style={{
            marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px',
            padding: '2px 8px', borderRadius: '999px',
            background: `${typeTheme.color}0A`, border: `1px solid ${typeTheme.color}18`,
            fontSize: '10px', fontWeight: 600, color: `${typeTheme.color}CC`, letterSpacing: '0.04em',
            textTransform: 'uppercase'
          }}>
            {typeTheme.label}
          </div>

          {/* Chevron affordance */}
          <motion.div
            animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -4 }}
            transition={{ duration: 0.14, ease: EASE }}
            style={{ flexShrink: 0 }}
          >
            <ChevronRight className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.45)' }} strokeWidth={2} />
          </motion.div>
        </div>

        {/* Focus ring */}
        <motion.div
          style={{
            position: 'absolute', inset: '-1px', borderRadius: '21px', pointerEvents: 'none',
            border: '2px solid rgba(180,127,255,0.40)', opacity: 0
          }}
          whileFocus={{ opacity: 1 }}
        />
      </motion.div>
    </motion.div>
  );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function DivergenceReport({ divergences = [], onOpenDrawer }) {
  // ── Empty state ──
  if (!Array.isArray(divergences) || divergences.length === 0) {
    return (
      <motion.div
        variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
        style={{ ...GLASS.panel, padding: '40px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '220px', position: 'relative', overflow: 'hidden' }}
      >
        <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)', pointerEvents: 'none' }} />
        <div style={{
          width: '40px', height: '40px', borderRadius: '12px', marginBottom: '14px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)'
        }}>
          <GitCommit className="w-5 h-5" style={{ color: 'rgba(180,127,255,0.80)' }} strokeWidth={2} />
        </div>
        <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.88)', marginBottom: '6px', letterSpacing: '-0.005em' }}>
          No Divergences Detected
        </h3>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.48)', lineHeight: '1.5', textAlign: 'center' }}>
          All sources are aligned on the key narratives today.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
      style={{ ...GLASS.panel, padding: '26px 24px 24px', position: 'relative', overflow: 'visible' }}
    >
      {/* Top specular edge */}
      <div style={{
        position: 'absolute', top: 0, left: '15%', right: '15%', height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
        borderRadius: '999px', pointerEvents: 'none'
      }} />

      {/* Ambient violet bloom in top area */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '120px',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(140,100,255,0.07) 0%, transparent 70%)',
        borderRadius: '28px 28px 0 0', pointerEvents: 'none'
      }} />

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '18px', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(180,127,255,0.10)', border: '1px solid rgba(180,127,255,0.18)',
            boxShadow: '0 0 12px rgba(180,127,255,0.12), inset 0 1px 0 rgba(255,255,255,0.08)'
          }}>
            <GitCommit className="w-4.5 h-4.5" style={{ color: 'rgba(180,127,255,0.88)' }} strokeWidth={2} />
          </div>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'rgba(255,255,255,0.96)', letterSpacing: '-0.01em', lineHeight: 1.2, marginBottom: '3px' }}>
              Divergence Report
            </h2>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.48)', lineHeight: 1.4 }}>
              Where credible sources disagree.
            </p>
          </div>
        </div>
        <FractureBar count={divergences.length} />
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', marginBottom: '18px' }} />

      {/* ── Cards ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {divergences.slice(0, 3).map((d, i) => (
          <DivergenceCard key={d?.id || i} divergence={d} onClick={onOpenDrawer} index={i} />
        ))}
      </div>

      {/* ── More button ── */}
      {divergences.length > 3 && (
        <motion.div
          style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <span style={{ fontSize: '12px', color: 'rgba(180,127,255,0.80)', fontWeight: 500 }}>
            +{divergences.length - 3} more fractures detected
          </span>
          <motion.button
            onClick={() => onOpenDrawer?.(divergences[3])}
            style={{
              display: 'block', margin: '6px auto 0',
              fontSize: '11px', fontWeight: 500, color: 'rgba(255,255,255,0.45)',
              background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.02em'
            }}
            whileHover={{ color: 'rgba(255,255,255,0.70)' }}
            transition={{ duration: 0.14 }}
          >
            See all →
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}