import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, Eye, GitMerge, Target, BrainCircuit, Users, CheckCircle, XCircle, ChevronLeft, ChevronRight, Sparkles, TrendingUp, Newspaper, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// ============================================================================
// OS HORIZON LIQUID GLASS SYSTEM — TAHOE
// ============================================================================
const GLASS = {
  section: {
    bg: 'rgba(255, 255, 255, 0.04)',
    blur: 'blur(20px) saturate(120%)',
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
          background: `linear-gradient(135deg, ${iconColor}18, ${iconColor}08)`,
          backdropFilter: 'blur(16px) saturate(120%)',
          border: '1px solid rgba(255,255,255,0.10)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12)'
        }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <motion.div
          className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300"
          style={{ 
            background: `radial-gradient(circle at center, ${iconColor}25 0%, transparent 70%)`
          }}
        />
        <Icon className="w-5 h-5 relative z-10" style={{ color: iconColor }} strokeWidth={2.5} />
      </motion.div>
      
      <div>
        <h3 className="text-xl font-bold text-white tracking-tight"
           style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
          {title}
        </h3>
        <motion.div 
          className="h-0.5 mt-1 rounded-full"
          style={{ background: `linear-gradient(90deg, ${iconColor} 0%, transparent 100%)` }}
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ delay: delay + 0.2, duration: 0.8, ease: "easeOut" }}
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
            key={divergence.id} // Key change triggers re-animation
            className={`
              relative w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden
              border ${theme.borderColor} shadow-2xl
            `}
            style={{
              background: 'rgba(12, 18, 32, 0.75)',
              backdropFilter: 'blur(60px) saturate(175%)',
              WebkitBackdropFilter: 'blur(60px) saturate(175%)',
              boxShadow: `
                0 25px 50px -12px rgba(0, 0, 0, 0.8),
                0 0 50px ${theme.glowColor},
                inset 0 1.5px 0 rgba(255, 255, 255, 0.12)
              `
            }}
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{
                background: `linear-gradient(135deg, ${theme.glowColor} 0%, transparent 50%, ${theme.glowColor} 100%)`
              }}
              animate={{ 
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.005, 1]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />

            <motion.div 
              className="relative p-8 border-b border-white/10"
              variants={{
                hidden: { opacity: 0, y: -20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
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
                      className="relative p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm group hover:bg-white/10 transition-all duration-300"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label="Previous Divergence"
                    >
                      <ChevronLeft className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors" strokeWidth={2} />
                    </motion.button>
                    <motion.button
                      onClick={() => onNavigate('next')}
                      className="relative p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm group hover:bg-white/10 transition-all duration-300"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label="Next Divergence"
                    >
                      <ChevronRight className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors" strokeWidth={2} />
                    </motion.button>
                    <motion.button
                      onClick={onClose}
                      className="relative p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm group hover:bg-white/10 transition-all duration-300"
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors" strokeWidth={2} />
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
                  className="p-8 rounded-3xl border-l-4 relative overflow-hidden shadow-2xl"
                  style={{ 
                    borderColor: theme.primaryColor, 
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(24px) saturate(120%)',
                    WebkitBackdropFilter: 'blur(24px) saturate(120%)',
                    border: '1px solid rgba(255,255,255,0.10)',
                    borderLeft: `4px solid ${theme.primaryColor}`,
                    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.12), 0 10px 40px -10px ${theme.glowColor}`
                  }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <motion.div
                    className="absolute inset-0 opacity-30"
                    style={{ 
                      background: `radial-gradient(circle at left, ${theme.glowColor} 0%, transparent 60%)`
                    }}
                    animate={{ opacity: [0.2, 0.5, 0.2] }}
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
                <div 
                  className="p-6 rounded-2xl"
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    backdropFilter: 'blur(20px) saturate(120%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(120%)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10)'
                  }}
                >
                  <p className="text-lg font-medium leading-relaxed text-gray-100">
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
                        className="flex items-start p-4 rounded-lg"
                        style={{
                          background: 'rgba(255, 255, 255, 0.04)',
                          backdropFilter: 'blur(20px) saturate(120%)',
                          WebkitBackdropFilter: 'blur(20px) saturate(120%)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10)'
                        }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * i }}
                        whileHover={{ scale: 1.02 }}
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
                          className="text-base text-gray-300 leading-relaxed" 
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
                <div 
                  className="p-6 rounded-2xl space-y-4"
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    backdropFilter: 'blur(20px) saturate(120%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(120%)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10)'
                  }}
                >
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
                    <div 
                      className="p-5 rounded-2xl"
                      style={{
                        background: 'rgba(16, 185, 129, 0.08)',
                        backdropFilter: 'blur(20px) saturate(120%)',
                        WebkitBackdropFilter: 'blur(20px) saturate(120%)',
                        border: '1px solid rgba(16, 185, 129, 0.20)',
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10)'
                      }}
                    >
                      <div className="flex items-center text-green-400 mb-4">
                        <CheckCircle className="w-5 h-5 mr-3" />
                        <h4 className="font-semibold text-lg">Present In</h4>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {(divergence.present_in || []).map(src => (
                          <SourceLogo key={src} source={src} />
                        ))}
                      </div>
                    </div>
                     <div 
                       className="p-5 rounded-2xl"
                       style={{
                         background: 'rgba(239, 68, 68, 0.08)',
                         backdropFilter: 'blur(20px) saturate(120%)',
                         WebkitBackdropFilter: 'blur(20px) saturate(120%)',
                         border: '1px solid rgba(239, 68, 68, 0.20)',
                         boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10)'
                       }}
                     >
                      <div className="flex items-center text-red-400 mb-4">
                        <XCircle className="w-5 h-5 mr-3" />
                        <h4 className="font-semibold text-lg">Missing In</h4>
                      </div>
                      <div className="flex flex-wrap gap-3">
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
                  className="p-8 rounded-3xl relative overflow-hidden shadow-2xl"
                  style={{ 
                    background: 'rgba(139, 92, 246, 0.10)',
                    backdropFilter: 'blur(24px) saturate(120%)',
                    WebkitBackdropFilter: 'blur(24px) saturate(120%)',
                    border: '2px solid rgba(139, 92, 246, 0.30)',
                    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.12), 0 15px 50px -10px rgba(139, 92, 246, 0.4)`
                  }}
                  whileHover={{ scale: 1.02, y: -3 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <motion.div
                    className="absolute inset-0 opacity-25"
                    style={{ 
                      background: `radial-gradient(circle at center, rgba(139, 92, 246, 0.4) 0%, transparent 70%)`
                    }}
                    animate={{ opacity: [0.25, 0.45, 0.25] }}
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