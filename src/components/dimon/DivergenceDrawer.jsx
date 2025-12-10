// 🔒 DESIGN LOCKED — OS HORIZON LIQUID GLASS (macOS Tahoe)
// Strict Compliance with Vireon Design System

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, Eye, GitMerge, Target, BrainCircuit, Users, CheckCircle, XCircle, ChevronLeft, ChevronRight, Sparkles, TrendingUp, Newspaper, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// ============================================================================
// OS HORIZON LIQUID GLASS SYSTEM — TAHOE
// ============================================================================
const GLASS = {
  drawer: {
    bg: 'rgba(12, 16, 28, 0.85)',
    blur: 'blur(80px) saturate(180%)',
    radius: '32px',
    border: '1px solid rgba(255,255,255,0.10)',
    innerGlow: 'inset 0 0 80px rgba(255,255,255,0.02), inset 0 1.5px 0 rgba(255,255,255,0.12)'
  },
  card: {
    bg: 'rgba(255, 255, 255, 0.04)',
    blur: 'blur(24px) saturate(150%)',
    radius: '20px',
    border: '1px solid rgba(255,255,255,0.08)',
    innerGlow: 'inset 0 1px 0 rgba(255,255,255,0.10)'
  }
};

const LuxurySection = ({ icon: Icon, title, children, iconColor = "#4F46E5", delay = 0 }) => (
  <motion.div 
    className="space-y-6"
    variants={{
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0 }
    }}
    transition={{ 
      delay,
      type: "spring",
      stiffness: 200,
      damping: 20
    }}
  >
    <div className="flex items-center space-x-4">
      <motion.div 
        className="relative p-3 rounded-xl overflow-hidden"
        style={{ 
          background: `linear-gradient(135deg, rgba(${iconColor.replace('#', '').match(/.{2}/g).map(x => parseInt(x, 16)).join(', ')}, 0.18) 0%, rgba(255,255,255,0.06) 100%)`,
          backdropFilter: GLASS.card.blur,
          WebkitBackdropFilter: GLASS.card.blur,
          border: `1px solid rgba(${iconColor.replace('#', '').match(/.{2}/g).map(x => parseInt(x, 16)).join(', ')}, 0.22)`,
          boxShadow: `${GLASS.card.innerGlow}, 0 0 20px rgba(${iconColor.replace('#', '').match(/.{2}/g).map(x => parseInt(x, 16)).join(', ')}, 0.10)`
        }}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div style={{
          position: 'absolute',
          top: 0,
          left: '15%',
          right: '15%',
          height: '1px',
          background: `linear-gradient(90deg, transparent, rgba(${iconColor.replace('#', '').match(/.{2}/g).map(x => parseInt(x, 16)).join(', ')}, 0.30), transparent)`,
          pointerEvents: 'none'
        }} />
        <Icon className="w-5 h-5 relative z-10" style={{ color: iconColor, filter: `drop-shadow(0 0 8px rgba(${iconColor.replace('#', '').match(/.{2}/g).map(x => parseInt(x, 16)).join(', ')}, 0.45))` }} strokeWidth={2} />
      </motion.div>
      
      <div className="flex-1">
        <h3 className="text-xl font-bold text-white tracking-tight"
           style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
          {title}
        </h3>
        <motion.div 
          className="h-0.5 mt-1.5 rounded-full"
          style={{ background: `linear-gradient(90deg, ${iconColor} 0%, rgba(255,255,255,0.1) 60%, transparent 100%)` }}
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ delay: delay + 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
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
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose?.();
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleKeyDown);
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

  const backdropVariants = {
    hidden: { opacity: 0, backdropFilter: 'blur(0px)' },
    visible: { 
      opacity: 1, 
      backdropFilter: 'blur(12px)',
      transition: { duration: 0.4 }
    }
  };

  const drawerVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.9, 
      y: 50,
      rotateX: -15
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      rotateX: 0,
      transition: { 
        type: 'spring', 
        stiffness: 300, 
        damping: 30,
        duration: 0.6
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: 30,
      transition: { duration: 0.25, ease: 'easeIn' }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="divergence-drawer-backdrop"
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          style={{ paddingTop: '80px' }} // Add top padding to avoid header
        >
          <motion.div
            className="absolute left-0 right-0 bottom-0 bg-black/60"
            style={{ top: '80px' }} // Start below header
            onClick={onClose}
          />
          
          <motion.div
            key={divergence.id}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden"
            style={{
              background: GLASS.drawer.bg,
              backdropFilter: GLASS.drawer.blur,
              WebkitBackdropFilter: GLASS.drawer.blur,
              borderRadius: GLASS.drawer.radius,
              border: GLASS.drawer.border,
              boxShadow: `${GLASS.drawer.innerGlow}, 0 30px 80px -20px rgba(0,0,0,0.60), 0 0 60px ${theme.glowColor}`
            }}
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div style={{
              position: 'absolute',
              top: 0,
              left: '10%',
              right: '10%',
              height: '2px',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
              pointerEvents: 'none',
              borderRadius: '32px 32px 0 0'
            }} />

            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at 50% 20%, ${theme.glowColor} 0%, transparent 70%)`,
                borderRadius: GLASS.drawer.radius
              }}
              animate={{ 
                opacity: [0.15, 0.30, 0.15]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />

            <motion.div 
              className="relative p-8 border-b border-white/5"
              variants={{
                hidden: { opacity: 0, y: -20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: '15%',
                right: '15%',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)',
                pointerEvents: 'none'
              }} />
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-5">
                  <motion.div 
                    className="relative p-4 rounded-2xl border border-white/20 overflow-hidden"
                    style={{ 
                      background: `linear-gradient(135deg, ${theme.primaryColor}30, ${theme.primaryColor}15)`,
                      backdropFilter: 'blur(10px)'
                    }}
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Icon className="w-7 h-7 relative z-10" style={{ color: theme.primaryColor }} strokeWidth={2} />
                  </motion.div>
                  
                  <div>
                    <motion.h2 
                      className="text-2xl font-black tracking-tight text-white mb-2"
                      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      Divergence Analysis
                    </motion.h2>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  {/* Divergence Type Badge (moved from confidence spot) */}
                  <motion.span 
                    className={`px-4 py-2 text-sm font-bold rounded-full capitalize ${theme.textColor}`}
                    style={{ 
                      background: `linear-gradient(135deg, ${theme.primaryColor}25, ${theme.primaryColor}15)`,
                      border: `1px solid ${theme.primaryColor}40`
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                  >
                    {theme.label}
                  </motion.span>

                  <div className="flex items-center space-x-2">
                    <motion.button
                      onClick={() => onNavigate('prev')}
                      className="relative p-3 rounded-2xl overflow-hidden group"
                      style={{
                        background: GLASS.card.bg,
                        backdropFilter: GLASS.card.blur,
                        WebkitBackdropFilter: GLASS.card.blur,
                        border: GLASS.card.border,
                        boxShadow: GLASS.card.innerGlow
                      }}
                      whileHover={{ scale: 1.05, boxShadow: `${GLASS.card.innerGlow}, 0 4px 15px rgba(0,0,0,0.20)` }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Previous Divergence"
                    >
                      <ChevronLeft className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors relative z-10" strokeWidth={2} />
                    </motion.button>
                    <motion.button
                      onClick={() => onNavigate('next')}
                      className="relative p-3 rounded-2xl overflow-hidden group"
                      style={{
                        background: GLASS.card.bg,
                        backdropFilter: GLASS.card.blur,
                        WebkitBackdropFilter: GLASS.card.blur,
                        border: GLASS.card.border,
                        boxShadow: GLASS.card.innerGlow
                      }}
                      whileHover={{ scale: 1.05, boxShadow: `${GLASS.card.innerGlow}, 0 4px 15px rgba(0,0,0,0.20)` }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Next Divergence"
                    >
                      <ChevronRight className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors relative z-10" strokeWidth={2} />
                    </motion.button>
                    <motion.button
                      onClick={onClose}
                      className="relative p-3 rounded-2xl overflow-hidden group"
                      style={{
                        background: GLASS.card.bg,
                        backdropFilter: GLASS.card.blur,
                        WebkitBackdropFilter: GLASS.card.blur,
                        border: GLASS.card.border,
                        boxShadow: GLASS.card.innerGlow
                      }}
                      whileHover={{ scale: 1.05, rotate: 90, boxShadow: `${GLASS.card.innerGlow}, 0 4px 15px rgba(0,0,0,0.20)` }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <X className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors relative z-10" strokeWidth={2} />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              key={`${divergence.id}-content`}
              className="overflow-y-auto max-h-[calc(90vh-140px)] p-8 space-y-10"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Morning Takeaway - Enhanced with Bold Keywords */}
              <LuxurySection 
                icon={Sparkles} 
                title="Morning Takeaway" 
                iconColor="#FDE68A"
                delay={0}
              >
                <motion.div 
                  className="p-8 rounded-3xl relative overflow-hidden"
                  style={{ 
                    background: GLASS.card.bg,
                    backdropFilter: GLASS.card.blur,
                    WebkitBackdropFilter: GLASS.card.blur,
                    borderRadius: GLASS.card.radius,
                    border: GLASS.card.border,
                    boxShadow: `${GLASS.card.innerGlow}, 0 12px 40px -15px rgba(0,0,0,0.30), 0 0 30px ${theme.glowColor}`
                  }}
                  whileHover={{ y: -3, boxShadow: `${GLASS.card.innerGlow}, 0 18px 50px -15px rgba(0,0,0,0.40), 0 0 40px ${theme.glowColor}` }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: '12%',
                    right: '12%',
                    height: '1.5px',
                    background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)`,
                    pointerEvents: 'none'
                  }} />
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{ 
                      background: `radial-gradient(ellipse at 50% 30%, ${theme.glowColor} 0%, transparent 70%)`,
                      borderRadius: GLASS.card.radius
                    }}
                    animate={{ opacity: [0.12, 0.25, 0.12] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                  <div className="text-center relative z-10">
                    <p 
                      className="text-2xl font-bold text-white leading-relaxed tracking-wide"
                      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                      dangerouslySetInnerHTML={{ __html: details.morning_takeaway }}
                    />
                  </div>
                </motion.div>
              </LuxurySection>

              {/* Divergence Topic */}
              <LuxurySection 
                icon={Target} 
                title="Divergence Topic" 
                iconColor={theme.primaryColor}
                delay={0.1}
              >
                <div className="p-6 rounded-2xl relative overflow-hidden"
                     style={{
                       background: GLASS.card.bg,
                       backdropFilter: GLASS.card.blur,
                       WebkitBackdropFilter: GLASS.card.blur,
                       border: GLASS.card.border,
                       boxShadow: GLASS.card.innerGlow
                     }}>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: '12%',
                    right: '12%',
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                    pointerEvents: 'none'
                  }} />
                  <p className="text-lg font-medium leading-relaxed text-gray-100 relative z-10">
                    {divergence.topic}
                  </p>
                </div>
              </LuxurySection>

              {/* AI Rationale */}
              <LuxurySection 
                icon={BrainCircuit} 
                title="AI Rationale" 
                iconColor="#34D399"
                delay={0.2}
              >
                 <div className="space-y-4">
                    {details.rationale_bullets.map((bullet, i) => (
                      <motion.div
                       key={i}
                       className="flex items-start p-4 rounded-lg relative overflow-hidden"
                       style={{
                         background: GLASS.card.bg,
                         backdropFilter: GLASS.card.blur,
                         WebkitBackdropFilter: GLASS.card.blur,
                         border: GLASS.card.border,
                         boxShadow: GLASS.card.innerGlow
                       }}
                       initial={{ opacity: 0, x: -20 }}
                       animate={{ opacity: 1, x: 0 }}
                       transition={{ delay: 0.1 * i }}
                       whileHover={{ y: -2, boxShadow: `${GLASS.card.innerGlow}, 0 8px 25px -10px rgba(0,0,0,0.30)` }}
                      >
                       <div style={{
                         position: 'absolute',
                         top: 0,
                         left: '12%',
                         right: '12%',
                         height: '1px',
                         background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                         pointerEvents: 'none'
                       }} />
                       <motion.div 
                         className="w-1.5 h-1.5 rounded-full mt-2 mr-4 flex-shrink-0"
                         style={{ background: theme.primaryColor, boxShadow: `0 0 6px ${theme.primaryColor}` }}
                         animate={{ 
                           scale: [1, 1.2, 1],
                           boxShadow: [
                             `0 0 6px ${theme.primaryColor}`,
                             `0 0 12px ${theme.primaryColor}`,
                             `0 0 6px ${theme.primaryColor}`
                           ]
                         }}
                         transition={{ 
                           duration: 2, 
                           repeat: Infinity, 
                           delay: i * 0.3 
                         }}
                       />
                       <p 
                         className="text-base text-gray-300 leading-relaxed relative z-10" 
                         dangerouslySetInnerHTML={{ __html: bullet }}
                       />
                      </motion.div>
                    ))}
                 </div>
              </LuxurySection>

              {/* Source Coverage - Unified Confidence Display */}
              <LuxurySection 
                icon={Users} 
                title="Source Coverage" 
                iconColor="#FBBF24"
                delay={0.3}
              >
                <div className="space-y-6">
                  {/* Coverage Skew + Confidence - Connected Design */}
                  <div className="p-6 rounded-2xl relative overflow-hidden space-y-4"
                      style={{
                        background: GLASS.card.bg,
                        backdropFilter: GLASS.card.blur,
                        WebkitBackdropFilter: GLASS.card.blur,
                        border: GLASS.card.border,
                        boxShadow: GLASS.card.innerGlow
                      }}>
                   <div style={{
                     position: 'absolute',
                     top: 0,
                     left: '12%',
                     right: '12%',
                     height: '1px',
                     background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                     pointerEvents: 'none'
                   }} />
                    {/* Coverage Skew Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{skew.indicator}</span>
                        <div>
                          <p className="text-sm font-medium text-gray-400">Coverage Skew</p>
                          <p className={`text-lg font-bold ${skew.color}`}>
                            {presentCount} source{presentCount !== 1 ? 's' : ''} vs. {missingCount} missing ({skew.level})
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Unified Confidence Bar */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-400">Analysis Confidence</span>
                        <span className="text-lg font-bold" style={{ color: theme.primaryColor }}>
                          {Math.round((divergence.confidence || 0) * 100)}%
                        </span>
                      </div>
                      <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ 
                            background: `linear-gradient(90deg, ${theme.primaryColor}90, ${theme.primaryColor}ff)`,
                            boxShadow: `0 0 10px ${theme.glowColor}`
                          }}
                          initial={{ width: '0%' }}
                          animate={{ width: `${(divergence.confidence || 0) * 100}%` }}
                          transition={{ duration: 2, delay: 0.5, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Source Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="p-5 rounded-2xl relative overflow-hidden"
                        style={{
                          background: 'linear-gradient(135deg, rgba(52, 211, 153, 0.12) 0%, rgba(255,255,255,0.04) 100%)',
                          backdropFilter: GLASS.card.blur,
                          WebkitBackdropFilter: GLASS.card.blur,
                          border: '1px solid rgba(52, 211, 153, 0.22)',
                          boxShadow: `${GLASS.card.innerGlow}, 0 0 20px rgba(52, 211, 153, 0.08)`
                        }}>
                     <div style={{
                       position: 'absolute',
                       top: 0,
                       left: '12%',
                       right: '12%',
                       height: '1px',
                       background: 'linear-gradient(90deg, transparent, rgba(52, 211, 153, 0.30), transparent)',
                       pointerEvents: 'none'
                     }} />
                      <div className="flex items-center text-green-400 mb-4 relative z-10">
                        <CheckCircle className="w-5 h-5 mr-3" style={{ filter: 'drop-shadow(0 0 6px rgba(52, 211, 153, 0.40))' }} />
                        <h4 className="font-semibold text-lg">Present In</h4>
                      </div>
                      <div className="flex flex-wrap gap-3 relative z-10">
                        {(divergence.present_in || []).map(src => (
                          <SourceLogo key={src} source={src} />
                        ))}
                      </div>
                    </div>
                     <div className="p-5 rounded-2xl relative overflow-hidden"
                          style={{
                            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(255,255,255,0.04) 100%)',
                            backdropFilter: GLASS.card.blur,
                            WebkitBackdropFilter: GLASS.card.blur,
                            border: '1px solid rgba(239, 68, 68, 0.22)',
                            boxShadow: `${GLASS.card.innerGlow}, 0 0 20px rgba(239, 68, 68, 0.08)`
                          }}>
                       <div style={{
                         position: 'absolute',
                         top: 0,
                         left: '12%',
                         right: '12%',
                         height: '1px',
                         background: 'linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.30), transparent)',
                         pointerEvents: 'none'
                       }} />
                      <div className="flex items-center text-red-400 mb-4 relative z-10">
                        <XCircle className="w-5 h-5 mr-3" style={{ filter: 'drop-shadow(0 0 6px rgba(239, 68, 68, 0.40))' }} />
                        <h4 className="font-semibold text-lg">Missing In</h4>
                      </div>
                      <div className="flex flex-wrap gap-3 relative z-10">
                         {(divergence.missing_in || []).map(src => (
                          <SourceLogo key={src} source={src} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </LuxurySection>

              {/* Forward Outlook - Enhanced Visual Weight */}
              <motion.div
                className="space-y-6"
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 }
                }}
                transition={{ 
                  delay: 0.4,
                  type: "spring",
                  stiffness: 200,
                  damping: 20
                }}
              >
                <div className="flex items-center space-x-4">
                  <motion.div 
                    className="relative p-3 rounded-xl border border-white/20 overflow-hidden"
                    style={{ 
                      background: `linear-gradient(135deg, #C4B5FD20, #C4B5FD10)`,
                      backdropFilter: 'blur(10px)'
                    }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Zap className="w-5 h-5 relative z-10" style={{ color: "#C4B5FD" }} strokeWidth={2.5} />
                  </motion.div>
                  
                  <div>
                    <motion.div
                      className="relative inline-block"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      {/* Gradient accent bar behind title */}
                      <motion.div
                        className="absolute inset-0 rounded-lg opacity-30"
                        style={{ 
                          background: `linear-gradient(90deg, #C4B5FD 0%, transparent 100%)`,
                        }}
                        animate={{ 
                          scaleX: [0, 1],
                          opacity: [0, 0.3, 0.3]
                        }}
                        transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
                      />
                      <h3 className="text-xl font-bold text-white tracking-tight relative z-10 px-2 py-1"
                         style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                        ⚡ Forward Outlook
                      </h3>
                    </motion.div>
                  </div>
                </div>
                
                <motion.div
                  className="p-8 rounded-3xl relative overflow-hidden"
                  style={{ 
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.14) 0%, rgba(255,255,255,0.04) 100%)',
                    backdropFilter: GLASS.card.blur,
                    WebkitBackdropFilter: GLASS.card.blur,
                    border: '1px solid rgba(139, 92, 246, 0.25)',
                    boxShadow: `${GLASS.card.innerGlow}, 0 12px 40px -15px rgba(0,0,0,0.30), 0 0 35px rgba(139, 92, 246, 0.15)`
                  }}
                  whileHover={{ y: -3, boxShadow: `${GLASS.card.innerGlow}, 0 18px 50px -15px rgba(0,0,0,0.40), 0 0 45px rgba(139, 92, 246, 0.20)` }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: '12%',
                    right: '12%',
                    height: '1.5px',
                    background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.35), transparent)',
                    pointerEvents: 'none'
                  }} />
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{ 
                      background: 'radial-gradient(ellipse at 50% 30%, rgba(139, 92, 246, 0.12) 0%, transparent 70%)',
                      borderRadius: GLASS.card.radius
                    }}
                    animate={{ opacity: [0.15, 0.30, 0.15] }}
                    transition={{ duration: 5, repeat: Infinity }}
                  />
                  <p 
                    className="text-xl font-semibold text-violet-100 relative z-10 leading-relaxed text-center"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                    dangerouslySetInnerHTML={{ __html: details.forward_outlook }}
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}