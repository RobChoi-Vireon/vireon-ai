// 🔒 DESIGN LOCKED — OS HORIZON V4.0
// Matches MemoDrawer design system

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, Eye, GitMerge, Target, BrainCircuit, Users, CheckCircle, XCircle, ChevronLeft, ChevronRight, Sparkles, TrendingUp, Newspaper, Zap, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// ============================================================================
// HORIZON OS TOKENS — Matching MemoDrawer
// ============================================================================
const HORIZON = {
  glass: {
    radius: 24,
    blur: 26,
  },
  type: {
    h1: { size: 22, weight: 600, tracking: -0.03, opacity: 0.92 },
    drawerTitle: { size: 15.5, lh: 20, weight: 600, opacity: 0.70 },
    body: { size: 14.5, lh: 22, weight: 500, opacity: 0.82 },
    meta: { size: 12, weight: 500, tracking: 0.06, opacity: 0.65 },
  },
  color: {
    accent: '#7DD3FC',
    textBodyDark: 'rgba(255, 255, 255, 0.90)',
    textSecondaryDark: 'rgba(255, 255, 255, 0.75)',
    textTertiaryDark: 'rgba(255, 255, 255, 0.65)',
  },
  spacing: {
    sectionGap: 20,
  },
  motion: {
    ease: [0.18, 0.82, 0.23, 1],
    dur: { open: 260, close: 260 },
  },
};

// ============================================================================
// SECTION DIVIDER
// ============================================================================
const SectionDivider = () => (
  <div 
    className="my-6"
    style={{
      height: '1px',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)'
    }}
    aria-hidden="true"
  />
);

const LuxurySection = ({ icon: Icon, title, children, iconColor = "#4F46E5", delay = 0 }) => (
  <motion.div 
    className="ri-section"
    style={{ marginBottom: `${HORIZON.spacing.sectionGap}px` }}
  >
    <h3 className="ri-section-title">
      <Icon className="w-4 h-4" style={{ color: HORIZON.color.accent }} />
      {title}
    </h3>
    {children}
  </motion.div>
);

const SourceLogo = ({ source }) => {
  const logos = {
    'ft': { name: 'FT', color: '#FF6B9D', bg: 'bg-pink-500/20', border: 'border-pink-500/30' },
    'wsj': { name: 'WSJ', color: '#0274BE', bg: 'bg-blue-500/20', border: 'border-blue-500/30' },
    'nyt': { name: 'NYT', color: '#000', bg: 'bg-gray-500/20', border: 'border-gray-500/30' },
    'wapo': { name: 'WAPO', color: '#005DC7', bg: 'bg-indigo-500/20', border: 'border-indigo-500/30' },
    'washpost': { name: 'WAPO', color: '#005DC7', bg: 'bg-indigo-500/20', border: 'border-indigo-500/30' }
  };

  const logo = logos[source.toLowerCase()] || { name: source.toUpperCase(), color: '#6B7280', bg: 'bg-gray-500/20', border: 'border-gray-500/30' };

  return (
    <div className={`inline-flex items-center justify-center w-12 h-8 rounded-md text-xs font-bold ${logo.bg} ${logo.border} border`} style={{ color: logo.color }}>
      {logo.name}
    </div>
  );
};

export default function DivergenceDrawer({ isOpen, onClose, divergence, onNavigate }) {
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);
  const containerRef = useRef(null);
  const previousFocusRef = useRef(null);

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
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose?.();
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleKeyDown);
        if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
          previousFocusRef.current.focus();
        }
      };
    }
  }, [isOpen, onClose]);
  
  const getDivergenceTheme = (type) => {
    switch (type) {
      case 'coverage_gap':
        return {
          Icon: Eye,
          label: 'Coverage Gap',
          primaryColor: '#FBBF24', // Amber
          gradient: 'from-amber-500/20 via-yellow-500/10 to-amber-600/20',
          borderColor: 'border-amber-500/30',
          textColor: 'text-amber-300',
          glowColor: 'rgba(251, 191, 36, 0.4)'
        };
      case 'angle_disagreement':
        return {
          Icon: GitMerge,
          label: 'Angle Disagreement',
          primaryColor: '#8B5CF6', // Violet
          gradient: 'from-violet-500/20 via-purple-500/10 to-violet-600/20',
          borderColor: 'border-violet-500/30',
          textColor: 'text-violet-300',
          glowColor: 'rgba(139, 92, 246, 0.4)'
        };
      default:
        return {
          Icon: AlertCircle,
          label: 'Unknown Divergence',
          primaryColor: '#A8B3C7', // Slate
          gradient: 'from-slate-500/20 via-gray-500/10 to-slate-600/20',
          borderColor: 'border-slate-500/30',
          textColor: 'text-slate-300',
          glowColor: 'rgba(168, 179, 199, 0.4)'
        };
    }
  };

  const getDivergenceDetails = (divergence) => {
    if (!divergence) return {
      morning_takeaway: "Market **narrative divergence** detected across sources.",
      rationale_bullets: ["Narrative inconsistency identified across publications"],
      forward_outlook: "Monitor for narrative convergence or escalation."
    };

    switch (divergence.id) {
      case 'em_credit':
        return {
          morning_takeaway: "**Credit stress** is **underreported** — Street may be **underestimating systemic risk** in emerging markets.",
          rationale_bullets: [
            "**Spread decompression** signals tightening financial conditions",
            "**Coverage bias** leaves Street blind to systemic EM corporate risk",
            "**Liquidity risks** threaten spillover into developed market credit"
          ],
          forward_outlook: "If **EM HY spreads breach 600 bps**, expect contagion into US high-yield and broader **risk-off flows** into Treasuries."
        };
      case 'energy_vs_industrials':
        return {
          morning_takeaway: "**Energy resilience** masked by **industrial weakness** — sector rotation signals may be **misfiring**.",
          rationale_bullets: [
            "**Margin dispersion** widening between energy and industrial sectors",
            "**Commodity exposure** creating performance divergence",
            "**Cyclical indicators** showing mixed signals across industrial verticals"
          ],
          forward_outlook: "Watch for **industrial capex guidance revisions** in Q4 earnings — could trigger broader **cyclical sector reassessment**."
        };
      default:
        return {
          morning_takeaway: "Market **narrative fracture** detected across **key publications**.",
          rationale_bullets: [
            "**Source disagreement** on market implications",
            "**Coverage gaps** creating information asymmetries",
            "**Narrative conflicts** may signal emerging market themes"
          ],
          forward_outlook: "Monitor for **narrative convergence** or escalation in coming sessions."
        };
    }
  };

  const getSkewSeverity = (presentCount, missingCount) => {
    const totalCount = presentCount + missingCount;
    const ratio = Math.abs(presentCount - missingCount) / totalCount;
    
    if (ratio >= 0.7) return { level: 'High Skew', color: 'text-red-400', indicator: '🔴' };
    if (ratio >= 0.4) return { level: 'Moderate Skew', color: 'text-amber-400', indicator: '🟡' };
    return { level: 'Low Skew', color: 'text-green-400', indicator: '🟢' };
  };

  if (!isOpen || !divergence) return null;

  const theme = getDivergenceTheme(divergence.type);
  const { Icon } = theme;
  const details = getDivergenceDetails(divergence);

  const presentCount = (divergence.present_in || []).length;
  const missingCount = (divergence.missing_in || []).length;
  const skew = getSkewSeverity(presentCount, missingCount);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
        duration: 0.3
      }
    }
  };



  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <style>{`
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
              transition: opacity ${HORIZON.motion.dur.open}ms cubic-bezier(0.19, 1, 0.22, 1);
              will-change: opacity;
            }
            
            .hzn-header-scrim--open {
              opacity: 1;
            }

            .hzn-frosted-backdrop {
              position: fixed;
              inset: 0;
              z-index: 80;
              background: rgba(24, 26, 29, 0.55);
              backdrop-filter: blur(26px) saturate(1.3) brightness(1.15);
              -webkit-backdrop-filter: blur(26px) saturate(1.3) brightness(1.15);
              opacity: 0;
              transition: opacity ${HORIZON.motion.dur.open}ms cubic-bezier(0.19, 1, 0.22, 1);
              will-change: opacity;
              mask-image: linear-gradient(to bottom, transparent 0, black calc(72px + 8px));
              -webkit-mask-image: linear-gradient(to bottom, transparent 0, black calc(72px + 8px));
            }
            
            .hzn-frosted-backdrop--open {
              opacity: 1;
            }

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
              border-radius: calc(${HORIZON.glass.radius}px);
              overflow: visible;
              
              transform: translateY(8px) scale(0.96);
              opacity: 0;
              will-change: transform, opacity;
              transition: 
                transform ${HORIZON.motion.dur.open}ms cubic-bezier(0.19, 1, 0.22, 1),
                opacity ${HORIZON.motion.dur.open}ms cubic-bezier(0.19, 1, 0.22, 1);
            }
            
            .hzn-drawer--open {
              transform: translateY(0) scale(1);
              opacity: 1;
            }

            .hzn-drawer::before {
              content: "";
              position: absolute;
              left: 0;
              right: 0;
              top: 0;
              height: 24px;
              pointer-events: none;
              background: linear-gradient(to bottom, rgba(255, 255, 255, 0.045) 0%, rgba(255, 255, 255, 0.03) 50%, rgba(255, 255, 255, 0.00) 100%);
              mix-blend-mode: screen;
              opacity: 0.75;
              z-index: 1;
              border-radius: ${HORIZON.glass.radius}px ${HORIZON.glass.radius}px 0 0;
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

            .ri-section {
              margin-bottom: ${HORIZON.spacing.sectionGap}px;
              line-height: 1.55;
              opacity: 0;
            }

            .hzn-drawer--open .ri-section {
              animation: giFadeUp 180ms cubic-bezier(0.19, 1, 0.22, 1) forwards;
            }
            
            .hzn-drawer--open .ri-section:nth-of-type(1) { animation-delay: 0ms; }
            .hzn-drawer--open .ri-section:nth-of-type(2) { animation-delay: 60ms; }
            .hzn-drawer--open .ri-section:nth-of-type(3) { animation-delay: 120ms; }
            .hzn-drawer--open .ri-section:nth-of-type(4) { animation-delay: 180ms; }
            
            @keyframes giFadeUp {
              from { opacity: 0; }
              to { opacity: 1; }
            }

            .ri-section-title {
              font-size: ${HORIZON.type.drawerTitle.size}px;
              line-height: ${HORIZON.type.drawerTitle.lh}px;
              font-weight: ${HORIZON.type.drawerTitle.weight};
              letter-spacing: -0.01em;
              text-transform: uppercase;
              color: ${HORIZON.color.textTertiaryDark};
              opacity: ${HORIZON.type.drawerTitle.opacity};
              margin-bottom: 6px;
              display: flex;
              align-items: center;
              gap: 6px;
            }
          `}</style>

          {/* Header Scrim */}
          <div
            className={`hzn-header-scrim ${isAnimatingIn ? 'hzn-header-scrim--open' : ''}`}
            aria-hidden="true"
          />

          {/* Frosted Backdrop */}
          <div
            className={`hzn-frosted-backdrop ${isAnimatingIn ? 'hzn-frosted-backdrop--open' : ''}`}
            onClick={onClose}
            role="presentation"
            aria-hidden={!isOpen}
          />

          {/* Drawer Panel */}
          <aside
            ref={containerRef}
            className={`hzn-drawer ${isAnimatingIn ? 'hzn-drawer--open' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-label="Divergence Analysis"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full max-h-[88vh]" style={{ overflow: 'hidden' }}>
              {/* HEADER */}
              <div
                className="relative z-10 p-8 pb-4"
                style={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
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
                      {theme.label}
                    </h1>
                    
                    <p
                      className="mb-2"
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: '#AAB1B8',
                        letterSpacing: '0.02em',
                        opacity: 0.70,
                      }}
                    >
                      {divergence.topic}
                    </p>
                    
                    <p
                      className="mb-0"
                      style={{
                        fontSize: HORIZON.type.meta.size,
                        fontWeight: HORIZON.type.meta.weight,
                        color: '#AAB1B8',
                        opacity: HORIZON.type.meta.opacity,
                        textTransform: 'uppercase',
                        letterSpacing: `${HORIZON.type.meta.tracking}em`,
                      }}
                    >
                      Generated today • Divergence Analysis • {(divergence.present_in || []).length + (divergence.missing_in || []).length} sources analyzed
                    </p>
                  </div>

                  {/* Navigation Controls */}
                  <div className="drawer-controls flex items-center gap-2">
                      <button
                      onClick={() => onNavigate?.('prev')}
                      className="p-2.5 rounded-xl transition-all duration-180"
                      style={{
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        color: '#D7DBE0',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.10)';
                        e.currentTarget.style.transform = 'scale(1.03)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                      aria-label="Previous divergence"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => onNavigate?.('next')}
                      className="p-2.5 rounded-xl transition-all duration-180"
                      style={{
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        color: '#D7DBE0',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.10)';
                        e.currentTarget.style.transform = 'scale(1.03)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                      aria-label="Next divergence"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>

                    <button
                      onClick={onClose}
                      className="p-2.5 rounded-xl ml-2 transition-all duration-180"
                      style={{
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        color: '#D7DBE0',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.10)';
                        e.currentTarget.style.transform = 'scale(1.03)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                      aria-label="Close"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>

              {/* BODY */}
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

                <div className="p-8 pt-4">
                  {/* MORNING TAKEAWAY */}
                  <LuxurySection 
                    icon={Sparkles} 
                    title="Morning Takeaway"
                  >
                    <p 
                      style={{ 
                        fontSize: `${HORIZON.type.body.size}px`, 
                        lineHeight: `${HORIZON.type.body.lh}px`,
                        fontWeight: HORIZON.type.body.weight,
                        color: HORIZON.color.textBodyDark,
                        maxWidth: '72ch'
                      }}
                      dangerouslySetInnerHTML={{ __html: details.morning_takeaway }}
                    />
                  </LuxurySection>

                  <SectionDivider />

                  {/* DETAILED ANALYSIS */}
                  <LuxurySection 
                    icon={Target} 
                    title="Detailed Analysis"
                  >
                    <p 
                      style={{ 
                        fontSize: `${HORIZON.type.body.size}px`, 
                        lineHeight: `${HORIZON.type.body.lh}px`,
                        fontWeight: HORIZON.type.body.weight,
                        color: HORIZON.color.textBodyDark,
                        maxWidth: '72ch'
                      }}
                    >
                      {divergence.detail || divergence.rationale || 'Analysis not available'}
                    </p>
                  </LuxurySection>

                  <SectionDivider />

              {/* AI RATIONALE */}
              <LuxurySection 
                icon={BrainCircuit} 
                title="AI Rationale"
              >
                <div className="space-y-3">
                  {details.rationale_bullets.map((bullet, i) => (
                    <motion.div
                      key={i}
                      className="flex items-start p-4 rounded-xl bg-white/5 border border-white/10"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i }}
                      whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.08)' }}
                    >
                      <motion.div 
                        className="w-1.5 h-1.5 rounded-full mt-2 mr-4 flex-shrink-0"
                        style={{ background: theme.primaryColor }}
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.7, 1, 0.7]
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity, 
                          delay: i * 0.3 
                        }}
                      />
                      <p 
                        style={{ 
                          fontSize: `12.5px`, 
                          lineHeight: `18px`,
                          fontWeight: 400,
                          color: HORIZON.color.textBodyDark
                        }}
                        dangerouslySetInnerHTML={{ __html: bullet }}
                      />
                    </motion.div>
                  ))}
                </div>
              </LuxurySection>

              <SectionDivider />

              {/* SOURCE COVERAGE */}
              <LuxurySection 
                icon={Users} 
                title="Source Coverage"
              >
                <div className="space-y-4">
                  {/* Confidence Display */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-sm font-medium" style={{ color: HORIZON.color.textTertiaryDark }}>
                      Analysis Confidence
                    </span>
                    <div className="flex items-center space-x-3">
                      <div className="w-24 h-2 bg-black/40 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ 
                            background: `linear-gradient(90deg, ${theme.primaryColor}90, ${theme.primaryColor}ff)`,
                          }}
                          initial={{ width: '0%' }}
                          animate={{ width: `${(divergence.confidence || 0) * 100}%` }}
                          transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }}
                        />
                      </div>
                      <span className="text-lg font-bold" style={{ color: theme.primaryColor }}>
                        {Math.round((divergence.confidence || 0) * 100)}%
                      </span>
                    </div>
                  </div>

                  {/* Coverage Skew */}
                  <div className="flex items-center space-x-3 p-4 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-2xl">{skew.indicator}</span>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide" style={{ color: HORIZON.color.textTertiaryDark }}>Coverage Skew</p>
                      <p className={`text-sm font-bold ${skew.color}`}>
                        {presentCount} source{presentCount !== 1 ? 's' : ''} vs. {missingCount} missing
                      </p>
                    </div>
                  </div>
                </div>
              </LuxurySection>

              <SectionDivider />

                  {/* SOURCE BREAKDOWN */}
                  <LuxurySection 
                    icon={BookOpen} 
                    title="Source Breakdown"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-5 rounded-xl bg-green-900/10 border border-green-500/20">
                        <div className="flex items-center text-green-400 mb-4">
                          <CheckCircle className="w-5 h-5 mr-3" />
                          <h4 className="font-semibold">Present In</h4>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {(divergence.present_in || []).map(src => (
                            <SourceLogo key={src} source={src} />
                          ))}
                        </div>
                      </div>
                      <div className="p-5 rounded-xl bg-red-900/10 border border-red-500/20">
                        <div className="flex items-center text-red-400 mb-4">
                          <XCircle className="w-5 h-5 mr-3" />
                          <h4 className="font-semibold">Missing In</h4>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {(divergence.missing_in || []).map(src => (
                            <SourceLogo key={src} source={src} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </LuxurySection>

                  <SectionDivider />

                  {/* FORWARD OUTLOOK */}
                  <LuxurySection 
                    icon={Zap} 
                    title="⚡ Forward Outlook"
                  >
                    <motion.div
                      className="p-6 rounded-2xl bg-violet-500/10 border border-violet-500/20"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <p 
                        style={{ 
                          fontSize: `${HORIZON.type.body.size}px`, 
                          lineHeight: `${HORIZON.type.body.lh}px`,
                          fontWeight: HORIZON.type.body.weight,
                          color: '#E9D5FF',
                          textAlign: 'center',
                          maxWidth: '64ch',
                          margin: '0 auto'
                        }}
                        dangerouslySetInnerHTML={{ __html: details.forward_outlook }}
                      />
                    </motion.div>
                  </LuxurySection>
                </div>
              </div>
            </div>
          </aside>
        </>
      )}
    </AnimatePresence>
  );
}