// 🔒 DESIGN LOCKED — OS HORIZON LIQUID GLASS (macOS Tahoe)
// Strict Compliance with Vireon Design System

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Shield, TrendingUp, AlertTriangle } from 'lucide-react';

// ============================================================================
// OS HORIZON LIQUID GLASS SYSTEM — TAHOE (Light Transparent Frosted Glass)
// ============================================================================
const GLASS = {
  card: {
    bg: 'rgba(255, 255, 255, 0.06)',
    blur: 'blur(24px) saturate(120%)',
    radius: '20px',
    border: '1px solid rgba(255,255,255,0.10)',
    innerGlow: 'inset 0 1px 0 rgba(255,255,255,0.12)'
  },
  innerCard: {
    bg: 'rgba(255, 255, 255, 0.04)',
    blur: 'blur(20px) saturate(110%)',
    radius: '14px',
    border: '1px solid rgba(255,255,255,0.08)',
    innerGlow: 'inset 0 1px 0 rgba(255,255,255,0.10)'
  }
};

const sourceLogos = {
  wapo: { name: "WP", bg: "bg-blue-600", text: "text-white" },
  nyt: { name: "NYT", bg: "bg-gray-800", text: "text-white" },
  wsj: { name: "WSJ", bg: "bg-orange-600", text: "text-white" },
  ft: { name: "FT", bg: "bg-pink-600", text: "text-white" },
  economist: { name: "ECN", bg: "bg-red-700", text: "text-white" }
};

const getSourceWeight = (source) => {
    // Mock weighting based on a hypothetical influence/reliability score
    const influence = source.influence || 3;
    const reliability = source.reliability || 3;
    const score = (influence + reliability) / 10;
    return Math.round(score * 30 + 10); // Scale to a reasonable %
};

const AnglePill = ({ icon: Icon, title, text, color, delay }) => (
  <motion.div
    className="p-4 relative overflow-hidden"
    style={{ 
      background: GLASS.innerCard.bg,
      backdropFilter: GLASS.innerCard.blur,
      WebkitBackdropFilter: GLASS.innerCard.blur,
      borderRadius: GLASS.innerCard.radius,
      border: GLASS.innerCard.border,
      boxShadow: `${GLASS.innerCard.innerGlow}, 0 8px 25px -10px rgba(0,0,0,0.25)`
    }}
    variants={{
      hidden: { opacity: 0, y: 15, scale: 0.95 },
      visible: { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: { delay: delay * 0.1, type: 'spring', stiffness: 200, damping: 20 }
      }
    }}
    whileHover={{ 
      y: -3, 
      boxShadow: `${GLASS.innerCard.innerGlow}, 0 12px 30px -10px rgba(0,0,0,0.35), 0 0 20px ${color}15`
    }}
  >
    {/* Top specular — lighter */}
    <div style={{
      position: 'absolute',
      top: 0,
      left: '15%',
      right: '15%',
      height: '1px',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
      pointerEvents: 'none'
    }} />
    <div className="flex items-center mb-2 relative z-10">
      <Icon className="w-4 h-4 mr-2" style={{ color, filter: `drop-shadow(0 0 6px ${color}60)` }} />
      <h4 className="text-sm font-semibold" style={{ color }}>{title}</h4>
    </div>
    <p className="text-sm text-neutral-300 relative z-10">{text}</p>
  </motion.div>
);

const RiskFlagPill = ({ flag, delay }) => {
  const riskLevels = {
    'high': { icon: AlertTriangle, color: '#F87171', rgb: '248, 113, 113' },
    'medium': { icon: AlertTriangle, color: '#FBBF24', rgb: '251, 191, 36' },
    'low': { icon: Shield, color: '#34D399', rgb: '52, 211, 153' },
  };

  const getLevel = (f) => {
    if (['rates', 'credit', 'regulatory'].includes(f)) return 'high';
    if (['geopolitical', 'liquidity', 'fx'].includes(f)) return 'medium';
    return 'low';
  }
  
  const level = getLevel(flag);
  const { icon: Icon, color, rgb } = riskLevels[level];

  return (
    <motion.div
      className="inline-flex items-center space-x-2 px-3.5 py-2 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, rgba(${rgb}, 0.12) 0%, rgba(255,255,255,0.04) 100%)`,
        backdropFilter: 'blur(20px) saturate(150%)',
        WebkitBackdropFilter: 'blur(20px) saturate(150%)',
        borderRadius: '999px',
        border: `1px solid rgba(${rgb}, 0.25)`,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.10), inset 0 0 15px rgba(${rgb}, 0.06)`
      }}
      variants={{
        hidden: { opacity: 0, scale: 0.8 },
        visible: { 
          opacity: 1, 
          scale: 1,
          transition: { delay: delay * 0.05, type: 'spring', stiffness: 300, damping: 20 }
        }
      }}
      whileHover={{ y: -2, scale: 1.05, boxShadow: `inset 0 1px 0 rgba(255,255,255,0.12), 0 0 20px rgba(${rgb}, 0.20)` }}
    >
      {/* Top specular */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '20%',
        right: '20%',
        height: '1px',
        background: `linear-gradient(90deg, transparent, rgba(${rgb}, 0.30), transparent)`,
        pointerEvents: 'none'
      }} />
      <Icon className="w-3.5 h-3.5 relative z-10" style={{ color, filter: `drop-shadow(0 0 5px rgba(${rgb}, 0.50))` }} />
      <span className="text-xs font-semibold capitalize relative z-10" style={{ color }}>
        {flag}
      </span>
    </motion.div>
  );
};

const ToneIndicator = ({ tones = [] }) => {
  const primaryTone = tones[0] || 'neutral';
  
  const toneConfig = {
    cautionary: { 
      label: 'Cautionary', 
      dotColor: '#FB7185', 
      rgb: '251, 113, 133',
      textColor: '#FDA4AF'
    },
    supportive: { 
      label: 'Supportive', 
      dotColor: '#34D399', 
      rgb: '52, 211, 153',
      textColor: '#6EE7B7'
    },
    alarmist: { 
      label: 'Alarmist', 
      dotColor: '#F87171', 
      rgb: '248, 113, 113',
      textColor: '#FCA5A5'
    },
    neutral: { 
      label: 'Neutral', 
      dotColor: '#9CA3AF', 
      rgb: '156, 163, 175',
      textColor: '#D1D5DB'
    }
  };

  const config = toneConfig[primaryTone];

  return (
    <motion.div 
      className="inline-flex items-center gap-2.5 pl-3.5 pr-4 py-2 text-sm font-medium relative overflow-hidden"
      style={{ 
        background: `linear-gradient(135deg, rgba(${config.rgb}, 0.14) 0%, rgba(255,255,255,0.04) 100%)`,
        backdropFilter: 'blur(25px) saturate(160%)',
        WebkitBackdropFilter: 'blur(25px) saturate(160%)',
        borderRadius: '999px',
        border: `1px solid rgba(${config.rgb}, 0.28)`,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.12), inset 0 0 20px rgba(${config.rgb}, 0.08), 0 0 15px rgba(${config.rgb}, 0.12)`
      }}
      whileHover={{ 
        scale: 1.04,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.14), inset 0 0 20px rgba(${config.rgb}, 0.10), 0 0 22px rgba(${config.rgb}, 0.18)`
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
    >
      {/* Top specular */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '18%',
        right: '18%',
        height: '1px',
        background: `linear-gradient(90deg, transparent, rgba(${config.rgb}, 0.35), transparent)`,
        pointerEvents: 'none'
      }} />
      
      <motion.div 
        className="w-2 h-2 rounded-full relative z-10"
        style={{ 
          backgroundColor: config.dotColor, 
          boxShadow: `0 0 6px ${config.dotColor}, 0 0 12px ${config.dotColor}80` 
        }}
        animate={{
          scale: [1, 1.15, 1],
          boxShadow: [
            `0 0 6px ${config.dotColor}, 0 0 12px ${config.dotColor}80`,
            `0 0 10px ${config.dotColor}, 0 0 18px ${config.dotColor}A0`,
            `0 0 6px ${config.dotColor}, 0 0 12px ${config.dotColor}80`
          ]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <span className="font-semibold relative z-10" style={{ color: config.textColor }}>{config.label}</span>
    </motion.div>
  );
};


export default function SourceAccordion({ source, density, index = 0 }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  if (!source) return null;

  const logoInfo = sourceLogos[source.source] || { name: source.source.substring(0, 3).toUpperCase(), bg: "bg-gray-500", text: "text-white" };
  const weight = getSourceWeight(source);
  
  const expandedSectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <motion.div
      layout
      className="overflow-hidden relative"
      style={{
        background: GLASS.card.bg,
        backdropFilter: GLASS.card.blur,
        WebkitBackdropFilter: GLASS.card.blur,
        borderRadius: GLASS.card.radius,
        border: GLASS.card.border,
        boxShadow: `${GLASS.card.innerGlow}, 0 12px 40px -15px rgba(0,0,0,0.35)`
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        boxShadow: isHovered 
          ? `${GLASS.card.innerGlow}, 0 16px 48px -16px rgba(0,0,0,0.40)`
          : `${GLASS.card.innerGlow}, 0 8px 32px -12px rgba(0,0,0,0.30)`,
        transition: { delay: index * 0.05, type: 'spring', stiffness: 200, damping: 25 } 
      }}
      whileHover={{ y: -3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Top specular edge — lighter glass */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '10%',
        right: '10%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)',
        pointerEvents: 'none',
        borderRadius: '20px 20px 0 0'
      }} />
      
      <header
        className="flex items-center p-5 cursor-pointer relative z-10"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Left Side: Logo and Weight */}
        <div className="flex items-center space-x-4 flex-shrink-0 pr-4">
          <div 
            className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm relative overflow-hidden ${logoInfo.bg} ${logoInfo.text}`}
            style={{
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.20), 0 4px 12px rgba(0,0,0,0.25)'
            }}
          >
            {/* Logo specular */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: '15%',
              right: '15%',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.30), transparent)',
              pointerEvents: 'none'
            }} />
            <span className="relative z-10">{logoInfo.name}</span>
          </div>
          <div>
            <div className="text-white font-semibold text-lg">{weight}%</div>
            <div className="w-12 h-1 bg-neutral-800 rounded-full mt-1 overflow-hidden">
               <motion.div
                 className="h-full rounded-full"
                 style={{
                    backgroundImage: 'linear-gradient(110deg, #6366f1, #3b82f6, #22d3ee, #6366f1)',
                    backgroundSize: '200% 100%'
                 }}
                 initial={{ width: 0 }}
                 animate={{ 
                    width: `${weight}%`,
                    backgroundPosition: ['0% center', '200% center']
                 }}
                 transition={{
                   width: { duration: 1.5, delay: 0.5 + index * 0.1, ease: [0.16, 1, 0.3, 1] },
                   backgroundPosition: {
                       duration: 3,
                       repeat: Infinity,
                       ease: 'linear',
                       repeatDelay: 0.5
                   }
                 }}
               />
            </div>
          </div>
        </div>

        {/* Center: Name and Topline */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-white text-lg truncate">{source.name}</h3>
          <p className="text-sm text-neutral-400 truncate">{source.topline}</p>
        </div>

        {/* Right Side: Badge and Chevron */}
        <div className="flex items-center space-x-4 pl-4 flex-shrink-0">
          <ToneIndicator tones={source.tones} /> {/* Replaced old tone badge */}
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <ChevronDown className="w-5 h-5 text-neutral-400" />
          </motion.div>
        </div>
      </header>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.section
            key="content"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="px-4 pb-4 overflow-hidden"
          >
            <motion.div 
              className="pt-4 border-t border-white/10 space-y-4"
              variants={expandedSectionVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Policy & Market/Macro Angles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AnglePill icon={Shield} title="Policy Angle" text={source.policy} color="#60A5FA" delay={0} />
                  <AnglePill icon={TrendingUp} title="Market/Macro Angle" text={source.market_macro} color="#34D399" delay={1} />
              </div>

              {/* Risk Flags */}
              {(source.risk_flags && source.risk_flags.length > 0) && (
                 <motion.div variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 }}}}>
                    <h4 className="text-sm font-semibold text-neutral-300 mb-3">Key Risk Factors</h4>
                    <div className="flex flex-wrap gap-2">
                        {source.risk_flags.map((flag, i) => (
                           <RiskFlagPill key={i} flag={flag} delay={i + 2} />
                        ))}
                    </div>
                 </motion.div>
              )}
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>
    </motion.div>
  );
}