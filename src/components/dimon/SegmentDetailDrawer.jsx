// 🔒 DESIGN LOCKED — STEVE JOBS DRAWER LAYOUT V2
// Narrative Flow | Apple-Grade Calm | Tahoe Glass
// Last Updated: 2025-01-28

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Briefcase, BarChart3, Globe, Target, Waves, ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Clock } from 'lucide-react';

// ============================================================================
// MOTION
// ============================================================================
const MOTION = {
  ease: [0.25, 0.1, 0.25, 1.0],
  duration: 0.24,
  stagger: 0.05
};

// ============================================================================
// TAHOE GLASS SYSTEM
// ============================================================================
const TAHOE = {
  hero: {
    bg: (rgb) => `radial-gradient(ellipse at 50% 0%, rgba(${rgb}, 0.08) 0%, rgba(255,255,255,0.025) 50%, rgba(255,255,255,0.015) 100%)`,
    blur: 'blur(16px)',
    radius: '24px',
    glow: (rgb) => `0 0 80px rgba(${rgb}, 0.08)`
  },
  card: {
    bg: 'rgba(255, 255, 255, 0.022)',
    blur: 'blur(12px)',
    radius: '18px',
    border: 'rgba(255, 255, 255, 0.045)'
  },
  summary: {
    bg: 'linear-gradient(180deg, rgba(255,255,255,0.028) 0%, rgba(255,255,255,0.012) 100%)',
    blur: 'blur(14px)',
    radius: '22px'
  },
  chip: {
    bg: 'rgba(255, 255, 255, 0.04)',
    border: 'rgba(255, 255, 255, 0.06)',
    radius: '10px'
  }
};

// ============================================================================
// THEMES
// ============================================================================
const getTheme = (name) => ({
  Policy: { Icon: Shield, color: '#5A9BE8', rgb: '90, 155, 232' },
  Credit: { Icon: Briefcase, color: '#9B7ADB', rgb: '155, 122, 219' },
  Equities: { Icon: BarChart3, color: '#2DB87D', rgb: '45, 184, 125' },
  Global: { Icon: Globe, color: '#D4A24A', rgb: '212, 162, 74' }
}[name] || { Icon: Shield, color: '#5A9BE8', rgb: '90, 155, 232' });

// ============================================================================
// DATA
// ============================================================================
const getData = (name) => ({
  Policy: {
    tldr: "Stricter rules are raising costs and putting pressure on big tech companies.",
    status: "Rising", trend: "up", certainty: 72, horizon: "Near-term",
    evidence: [
      { icon: Target, title: "Key Driver", text: "Regulators are getting tougher across content, privacy, and platform practices." },
      { icon: Waves, title: "Pressure Direction", text: "Rules are becoming stricter, making the environment harder for companies." },
      { icon: BarChart3, title: "Market Impact", text: "Moderate impact, with some industries beginning to feel more pressure." }
    ],
    summary: "Stricter regulation is creating steady pressure on the market. Big tech companies may face higher costs and slower stock price growth as oversight increases."
  },
  Credit: {
    tldr: "Borrowing is getting more expensive and harder to access, especially for weaker borrowers.",
    status: "Moderate", trend: "up", certainty: 68, horizon: "Medium-term",
    evidence: [
      { icon: Target, title: "Key Driver", text: "Lenders are getting more cautious after early signs of stress in riskier debt." },
      { icon: Waves, title: "Pressure Direction", text: "Credit is tightening, making it tougher for companies and households to refinance." },
      { icon: BarChart3, title: "Market Impact", text: "Moderate impact, with highly indebted companies and lower-quality borrowers feeling it first." }
    ],
    summary: "Tighter credit conditions can slow growth and increase default risk. Companies that rely heavily on cheap borrowing may face higher costs and less flexibility."
  },
  Equities: {
    tldr: "Most stock gains are coming from a small group of big companies, not the whole market.",
    status: "Narrow", trend: "neutral", certainty: 75, horizon: "Near-term",
    evidence: [
      { icon: Target, title: "Key Driver", text: "Investors are crowding into large, well-known names while smaller stocks lag behind." },
      { icon: Waves, title: "Pressure Direction", text: "Support for the market is narrowing, making it more vulnerable if leaders stumble." },
      { icon: BarChart3, title: "Market Impact", text: "Moderate impact, with the index looking strong on the surface but more fragile underneath." }
    ],
    summary: "A narrow group of winners can keep the market up, but it also raises concentration risk. If leadership cracks, the pullback can be sharper."
  },
  Global: {
    tldr: "Slower growth in key regions, especially China, is starting to weigh on the global outlook.",
    status: "Softening", trend: "down", certainty: 70, horizon: "Medium-term",
    evidence: [
      { icon: Target, title: "Key Driver", text: "Weaker demand from China and softer data in other major economies are cooling trade." },
      { icon: Waves, title: "Pressure Direction", text: "Growth momentum is cooling instead of accelerating." },
      { icon: BarChart3, title: "Market Impact", text: "Moderate impact, with export-driven and commodity-linked areas feeling the slowdown more." }
    ],
    summary: "A cooling global economy can pressure earnings expectations. If the slowdown deepens, markets may price in weaker profits and fewer growth opportunities."
  }
}[name]);

// ============================================================================
// HERO BLOCK — The Story Opens
// ============================================================================
const HeroBlock = ({ data, theme, weight }) => (
  <motion.div
    className="mx-8 mt-6"
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.08, duration: MOTION.duration, ease: MOTION.ease }}
  >
    <div
      className="relative overflow-hidden text-center"
      style={{
        padding: '36px 32px 32px',
        background: TAHOE.hero.bg(theme.rgb),
        backdropFilter: TAHOE.hero.blur,
        WebkitBackdropFilter: TAHOE.hero.blur,
        borderRadius: TAHOE.hero.radius,
        boxShadow: TAHOE.hero.glow(theme.rgb)
      }}
    >
      {/* Soft parallax glow */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 20%, rgba(${theme.rgb}, 0.06) 0%, transparent 60%)`,
          filter: 'blur(30px)'
        }}
      />
      
      {/* TL;DR floating chip */}
      <div 
        className="inline-block px-3 py-1 rounded-full mb-5"
        style={{
          fontSize: '9px',
          fontWeight: 550,
          color: 'rgba(255,255,255,0.55)',
          background: 'rgba(255,255,255,0.06)',
          letterSpacing: '0.1em'
        }}
      >
        TL;DR
      </div>
      
      {/* Hero headline */}
      <p 
        className="relative"
        style={{
          fontSize: '19px',
          fontWeight: 480,
          color: 'rgba(255,255,255,0.95)',
          lineHeight: 1.52,
          maxWidth: '520px',
          margin: '0 auto 22px'
        }}
      >
        {data.tldr}
      </p>
      
      {/* Sentiment + Weight badges */}
      <div className="flex items-center justify-center gap-2.5">
        <span 
          className="px-3 py-1.5 rounded-full"
          style={{
            fontSize: '11px',
            fontWeight: 540,
            color: theme.color,
            background: `rgba(${theme.rgb}, 0.12)`,
            border: `1px solid rgba(${theme.rgb}, 0.16)`
          }}
        >
          {data.status}
        </span>
        <span 
          className="px-3 py-1.5 rounded-full"
          style={{
            fontSize: '11px',
            fontWeight: 480,
            color: 'rgba(255,255,255,0.55)',
            background: TAHOE.chip.bg,
            border: `1px solid ${TAHOE.chip.border}`
          }}
        >
          {Math.round(weight)}% weight
        </span>
      </div>
    </div>
  </motion.div>
);

// ============================================================================
// EVIDENCE TRIO — Lightweight Stepping Stones
// ============================================================================
const EvidenceCard = ({ item, theme, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: MOTION.duration, ease: MOTION.ease }}
    className="relative overflow-hidden"
    style={{
      padding: '18px 20px',
      background: TAHOE.card.bg,
      backdropFilter: TAHOE.card.blur,
      WebkitBackdropFilter: TAHOE.card.blur,
      borderRadius: TAHOE.card.radius,
      border: `0.5px solid ${TAHOE.card.border}`
    }}
  >
    <div className="flex items-start gap-3.5">
      <div 
        className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{
          background: `rgba(${theme.rgb}, 0.10)`,
          border: `1px solid rgba(${theme.rgb}, 0.12)`
        }}
      >
        <item.icon className="w-4 h-4" style={{ color: theme.color }} strokeWidth={2} />
      </div>
      <div className="flex-1 pt-0.5">
        <h4 
          style={{
            fontSize: '13px',
            fontWeight: 520,
            color: 'rgba(255,255,255,0.78)',
            marginBottom: '5px'
          }}
        >
          {item.title}
        </h4>
        <p 
          style={{
            fontSize: '14px',
            fontWeight: 400,
            color: 'rgba(255,255,255,0.62)',
            lineHeight: 1.52
          }}
        >
          {item.text}
        </p>
      </div>
    </div>
  </motion.div>
);

const EvidenceTrio = ({ data, theme }) => (
  <div className="mx-8 mt-6 flex flex-col gap-3">
    {data.evidence.map((item, i) => (
      <EvidenceCard 
        key={item.title} 
        item={item} 
        theme={theme} 
        delay={0.16 + (i * MOTION.stagger)} 
      />
    ))}
  </div>
);

// ============================================================================
// NARRATIVE SUMMARY — The Story Closes
// ============================================================================
const NarrativeSummary = ({ data }) => (
  <motion.div
    className="mx-8 mt-7"
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.34, duration: MOTION.duration, ease: MOTION.ease }}
  >
    <div
      className="relative overflow-hidden text-center"
      style={{
        padding: '30px 28px',
        background: TAHOE.summary.bg,
        backdropFilter: TAHOE.summary.blur,
        WebkitBackdropFilter: TAHOE.summary.blur,
        borderRadius: TAHOE.summary.radius
      }}
    >
      {/* Warm vignette */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.012) 0%, transparent 70%)',
          borderRadius: TAHOE.summary.radius
        }}
      />
      
      <h3 
        className="relative mb-4"
        style={{
          fontSize: '10px',
          fontWeight: 550,
          color: 'rgba(255,255,255,0.42)',
          letterSpacing: '0.14em',
          textTransform: 'uppercase'
        }}
      >
        What This Means
      </h3>
      
      <p 
        className="relative"
        style={{
          fontSize: '16px',
          fontWeight: 430,
          color: 'rgba(255,255,255,0.88)',
          lineHeight: 1.60,
          maxWidth: '440px',
          margin: '0 auto'
        }}
      >
        {data.summary}
      </p>
    </div>
  </motion.div>
);

// ============================================================================
// MICRO SIGNAL ROW — Quiet Metadata
// ============================================================================
const SignalRow = ({ data, theme }) => {
  const TrendIcon = data.trend === 'up' ? TrendingUp : data.trend === 'down' ? TrendingDown : null;
  
  return (
    <motion.div
      className="flex justify-center gap-2 mx-8 mt-6 mb-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.70 }}
      transition={{ delay: 0.42, duration: MOTION.duration }}
    >
      {TrendIcon && (
        <div 
          className="flex items-center gap-1 px-2 py-1"
          style={{
            fontSize: '9px',
            fontWeight: 500,
            color: theme.color,
            background: 'transparent',
            border: `1px solid rgba(${theme.rgb}, 0.18)`,
            borderRadius: TAHOE.chip.radius
          }}
        >
          <TrendIcon className="w-2.5 h-2.5" strokeWidth={2.5} />
          <span>{data.status}</span>
        </div>
      )}
      
      <div 
        className="px-2 py-1"
        style={{
          fontSize: '9px',
          fontWeight: 500,
          color: 'rgba(255,255,255,0.50)',
          background: 'transparent',
          border: `1px solid ${TAHOE.chip.border}`,
          borderRadius: TAHOE.chip.radius
        }}
      >
        {data.certainty}%
      </div>
      
      <div 
        className="flex items-center gap-1 px-2 py-1"
        style={{
          fontSize: '9px',
          fontWeight: 500,
          color: 'rgba(255,255,255,0.50)',
          background: 'transparent',
          border: `1px solid ${TAHOE.chip.border}`,
          borderRadius: TAHOE.chip.radius
        }}
      >
        <Clock className="w-2.5 h-2.5" strokeWidth={2.5} />
        <span>{data.horizon}</span>
      </div>
    </motion.div>
  );
};

// ============================================================================
// HEADER
// ============================================================================
const Header = ({ segment, theme, onClose, onNavigate }) => {
  const { Icon } = theme;
  
  return (
    <motion.div 
      className="relative px-8 pt-7 pb-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.18 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div 
            className="w-10 h-10 rounded-[14px] flex items-center justify-center"
            style={{
              background: `rgba(${theme.rgb}, 0.12)`,
              border: `1px solid rgba(${theme.rgb}, 0.16)`
            }}
          >
            <Icon className="w-[18px] h-[18px]" style={{ color: theme.color }} strokeWidth={2} />
          </div>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 600, color: 'rgba(255,255,255,0.94)', letterSpacing: '-0.02em' }}>
              {segment.name}
            </h1>
            <p style={{ fontSize: '13px', fontWeight: 420, color: 'rgba(255,255,255,0.45)', marginTop: '1px' }}>
              Market Pressure Analysis
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5">
          {[
            { action: () => onNavigate('prev'), icon: ChevronLeft },
            { action: () => onNavigate('next'), icon: ChevronRight },
            { action: onClose, icon: X, ml: true }
          ].map(({ action, icon: BtnIcon, ml }, i) => (
            <motion.button
              key={i}
              onClick={action}
              className={`w-8 h-8 rounded-xl flex items-center justify-center ${ml ? 'ml-1' : ''}`}
              style={{ background: TAHOE.chip.bg, border: `1px solid ${TAHOE.chip.border}` }}
              whileHover={{ background: 'rgba(255,255,255,0.07)' }}
              whileTap={{ scale: 0.95 }}
            >
              <BtnIcon className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.60)' }} />
            </motion.button>
          ))}
        </div>
      </div>
      
      {/* Subtle divider */}
      <div 
        className="absolute bottom-0 left-8 right-8 h-px"
        style={{ background: 'rgba(255,255,255,0.06)' }}
      />
    </motion.div>
  );
};

// ============================================================================
// MAIN DRAWER
// ============================================================================
export default function SegmentDetailDrawer({ isOpen, onClose, segment, onNavigate }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKey = (e) => e.key === 'Escape' && onClose?.();
      document.addEventListener('keydown', handleKey);
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleKey);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen || !segment) return null;

  const theme = getTheme(segment.name);
  const data = getData(segment.name);
  const weight = (segment?.weight || 0) * 100;

  if (!data) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        style={{ paddingTop: '80px' }}
      >
        {/* Backdrop */}
        <motion.div 
          className="absolute inset-0"
          style={{ 
            top: '80px',
            background: 'rgba(0,0,0,0.82)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)'
          }}
          onClick={onClose}
        />
        
        {/* Drawer */}
        <motion.div
          key={segment.name}
          className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col"
          style={{
            borderRadius: '26px',
            background: 'linear-gradient(180deg, rgba(12, 14, 20, 0.97) 0%, rgba(8, 10, 16, 0.98) 100%)',
            backdropFilter: 'blur(70px) saturate(175%)',
            WebkitBackdropFilter: 'blur(70px) saturate(175%)',
            border: '1px solid rgba(255,255,255,0.045)',
            boxShadow: '0 40px 80px -20px rgba(0,0,0,0.80)'
          }}
          initial={{ opacity: 0, scale: 0.97, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 14 }}
          transition={{ duration: 0.26, ease: MOTION.ease }}
        >
          <Header segment={segment} theme={theme} onClose={onClose} onNavigate={onNavigate} />
          
          <div className="overflow-y-auto flex-1" style={{ scrollBehavior: 'smooth' }}>
            <HeroBlock data={data} theme={theme} weight={weight} />
            <EvidenceTrio data={data} theme={theme} />
            <NarrativeSummary data={data} />
            <SignalRow data={data} theme={theme} />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}