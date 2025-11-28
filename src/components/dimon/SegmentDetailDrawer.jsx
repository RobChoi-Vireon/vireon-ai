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
// STEVE JOBS V1 GLASS SYSTEM — Unified Glass Slab
// ============================================================================
const GLASS = {
  drawer: {
    bg: `radial-gradient(circle at top center, rgba(255,255,255,0.06) 0%, rgba(6,10,20,0.96) 55%, rgba(3,6,14,1) 100%)`,
    blur: 'blur(24px)',
    radius: '26px',
    shadow: `0 0 40px rgba(0,0,0,0.35), 0 0 0 0.5px rgba(255,255,255,0.05) inset`
  },
  hero: {
    bg: 'rgba(10,20,40,0.9)',
    blur: 'blur(14px)',
    radius: '26px',
    padding: '32px',
    shadow: `0 18px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.08)`
  },
  card: {
    bg: 'rgba(255, 255, 255, 0.02)',
    blur: 'blur(12px)',
    radius: '22px',
    padding: '22px 26px'
  },
  summary: {
    bg: 'rgba(255,255,255,0.03)',
    blur: 'blur(16px)',
    radius: '26px',
    padding: '32px 30px'
  },
  chip: {
    radius: '16px',
    padding: '6px 14px'
  },
  badge: (rgb) => ({
    bg: `rgba(${rgb}, 0.10)`,
    radius: '16px',
    padding: '6px 14px'
  })
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
const HeroBlock = ({ data, theme, weight }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  
  return (
    <motion.div
      className="mx-9 mt-4"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08, duration: MOTION.duration, ease: MOTION.ease }}
    >
      <motion.div
        className="relative overflow-hidden text-center"
        style={{
          padding: GLASS.hero.padding,
          background: GLASS.hero.bg,
          backdropFilter: GLASS.hero.blur,
          WebkitBackdropFilter: GLASS.hero.blur,
          borderRadius: GLASS.hero.radius,
          boxShadow: GLASS.hero.shadow
        }}
        animate={{
          scale: isHovered ? 1.01 : 1,
          filter: isHovered ? 'brightness(1.04)' : 'brightness(1)'
        }}
        transition={{ duration: 0.16, ease: MOTION.ease }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* TL;DR floating chip */}
        <div 
          className="inline-block mb-5"
          style={{
            fontSize: '9px',
            fontWeight: 550,
            color: 'rgba(255,255,255,0.55)',
            background: 'rgba(255,255,255,0.06)',
            padding: GLASS.chip.padding,
            borderRadius: GLASS.chip.radius,
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
            style={{
              fontSize: '11px',
              fontWeight: 540,
              color: theme.color,
              background: `rgba(${theme.rgb}, 0.10)`,
              padding: GLASS.badge(theme.rgb).padding,
              borderRadius: GLASS.badge(theme.rgb).radius
            }}
          >
            {data.status}
          </span>
          <span 
            style={{
              fontSize: '11px',
              fontWeight: 480,
              color: 'rgba(255,255,255,0.55)',
              background: 'rgba(255,255,255,0.04)',
              padding: GLASS.chip.padding,
              borderRadius: GLASS.chip.radius
            }}
          >
            {Math.round(weight)}% weight
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ============================================================================
// EVIDENCE TRIO — Lightweight Stepping Stones
// ============================================================================
const EvidenceCard = ({ item, theme, delay }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: MOTION.duration, ease: MOTION.ease }}
      className="relative overflow-hidden"
      style={{
        padding: GLASS.card.padding,
        background: GLASS.card.bg,
        backdropFilter: GLASS.card.blur,
        WebkitBackdropFilter: GLASS.card.blur,
        borderRadius: GLASS.card.radius
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="flex items-start gap-4"
        animate={{
          scale: isHovered ? 1.005 : 1,
          filter: isHovered ? 'brightness(1.03)' : 'brightness(1)'
        }}
        transition={{ duration: 0.14, ease: MOTION.ease }}
      >
        <div 
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: `rgba(${theme.rgb}, 0.10)`,
            boxShadow: isHovered ? `0 0 8px rgba(${theme.rgb}, 0.16)` : 'none',
            transition: 'box-shadow 0.14s ease'
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
      </motion.div>
    </motion.div>
  );
};

const EvidenceTrio = ({ data, theme }) => (
  <div className="mx-9 mt-5 flex flex-col" style={{ gap: '22px' }}>
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
    className="mx-9 mt-6"
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.34, duration: 0.22, ease: MOTION.ease }}
  >
    <div
      className="relative overflow-hidden text-center"
      style={{
        padding: GLASS.summary.padding,
        background: GLASS.summary.bg,
        backdropFilter: GLASS.summary.blur,
        WebkitBackdropFilter: GLASS.summary.blur,
        borderRadius: GLASS.summary.radius
      }}
    >
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
const SignalChip = ({ children, theme, isActive }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  
  return (
    <motion.div
      className="flex items-center gap-1"
      style={{
        fontSize: '10px',
        fontWeight: 500,
        color: isActive ? theme.color : 'rgba(255,255,255,0.55)',
        background: isActive ? `rgba(${theme.rgb}, 0.12)` : 'rgba(255,255,255,0.04)',
        padding: GLASS.chip.padding,
        borderRadius: GLASS.chip.radius,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: isHovered && isActive ? `0 0 12px rgba(${theme.rgb}, 0.22)` : 'none',
        border: isHovered ? `1px solid rgba(${theme.rgb}, 0.30)` : '1px solid transparent',
        transition: 'box-shadow 0.14s ease, border 0.14s ease'
      }}
      animate={{ scale: isHovered ? 1.03 : 1 }}
      transition={{ duration: 0.14, ease: MOTION.ease }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {children}
    </motion.div>
  );
};

const SignalRow = ({ data, theme }) => {
  const TrendIcon = data.trend === 'up' ? TrendingUp : data.trend === 'down' ? TrendingDown : null;
  
  return (
    <motion.div
      className="flex justify-center mx-9 mt-6 mb-10"
      style={{ gap: '10px' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.42, duration: MOTION.duration }}
    >
      {TrendIcon && (
        <SignalChip theme={theme} isActive>
          <TrendIcon className="w-3 h-3" strokeWidth={2.5} />
          <span>{data.status}</span>
        </SignalChip>
      )}
      
      <SignalChip theme={theme}>
        <span>{data.certainty}%</span>
      </SignalChip>
      
      <SignalChip theme={theme}>
        <Clock className="w-3 h-3" strokeWidth={2.5} />
        <span>{data.horizon}</span>
      </SignalChip>
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
      className="relative px-9 pt-7 pb-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.18 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div 
            className="w-11 h-11 rounded-[14px] flex items-center justify-center"
            style={{
              background: `rgba(${theme.rgb}, 0.12)`,
              boxShadow: `0 0 8px rgba(${theme.rgb}, 0.16)`
            }}
          >
            <Icon className="w-5 h-5" style={{ color: theme.color }} strokeWidth={2} />
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
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${ml ? 'ml-1' : ''}`}
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
              whileHover={{ background: 'rgba(255,255,255,0.08)' }}
              whileTap={{ scale: 0.95 }}
            >
              <BtnIcon className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.60)' }} />
            </motion.button>
          ))}
        </div>
      </div>
      
      {/* Subtle divider */}
      <div 
        className="absolute bottom-0 left-9 right-9 h-px"
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
        {/* Backdrop with vignette */}
        <motion.div 
          className="absolute inset-0"
          style={{ 
            top: '80px',
            background: `
              radial-gradient(ellipse at 50% 50%, rgba(5,8,20,0.75) 0%, rgba(5,10,19,0.92) 100%),
              linear-gradient(to bottom, #050814 0%, #050A13 100%)
            `,
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)'
          }}
          onClick={onClose}
        />
        
        {/* Drawer — Unified Glass Slab */}
        <motion.div
          key={segment.name}
          className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col"
          style={{
            borderRadius: GLASS.drawer.radius,
            background: GLASS.drawer.bg,
            backdropFilter: GLASS.drawer.blur,
            WebkitBackdropFilter: GLASS.drawer.blur,
            boxShadow: GLASS.drawer.shadow
          }}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.22, ease: [0.16, 0.80, 0.33, 1] }}
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