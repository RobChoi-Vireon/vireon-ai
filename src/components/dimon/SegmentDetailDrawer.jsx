// 🔒 DESIGN LOCKED — OS HORIZON TAHOE LIQUID GLASS V3
// 16-Pillar Ironclad Audit Compliant
// Last Updated: 2025-01-28

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Briefcase, BarChart3, Globe, Target, Waves, ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Clock } from 'lucide-react';

// ============================================================================
// MOTION SYSTEM
// ============================================================================
const MOTION = {
  ease: [0.22, 0.61, 0.36, 1],
  duration: 0.28,
  stagger: 0.06
};

// ============================================================================
// OS HORIZON TAHOE GLASS SYSTEM
// ============================================================================
const TAHOE = {
  // Global canvas
  canvas: {
    bg: `
      radial-gradient(ellipse at 30% 20%, rgba(60, 100, 180, 0.08) 0%, transparent 50%),
      radial-gradient(ellipse at 70% 80%, rgba(100, 60, 180, 0.06) 0%, transparent 50%),
      linear-gradient(180deg, #050814 0%, #050A18 50%, #020712 100%)
    `,
    noise: 0.015
  },
  // Main drawer
  drawer: {
    bg: 'rgba(10, 18, 40, 0.82)',
    blur: 'blur(30px)',
    radius: '28px',
    border: 'linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(120,180,255,0.02) 100%)',
    innerShadow: 'inset 0 0 40px rgba(0,0,0,0.35)',
    highlight: 'linear-gradient(90deg, transparent 20%, rgba(255,255,255,0.12) 50%, transparent 80%)'
  },
  // Header
  header: {
    bg: 'rgba(20, 32, 70, 0.9)',
    blur: 'blur(40px)'
  },
  // TL;DR card
  hero: {
    bg: 'rgba(23, 38, 80, 0.85)',
    blur: 'blur(38px)',
    radius: '24px'
  },
  // Middle cards
  card: {
    bg: 'rgba(13, 23, 55, 0.9)',
    blur: 'blur(24px)',
    radius: '20px',
    iconBg: 'rgba(52, 87, 140, 0.65)'
  },
  // Summary
  summary: {
    bg: 'rgba(23, 38, 80, 0.85)',
    blur: 'blur(38px)',
    radius: '24px'
  },
  // Chips
  chip: {
    bg: 'rgba(30, 52, 96, 0.9)',
    border: 'rgba(120, 180, 255, 0.35)',
    radius: '999px',
    activeGradient: 'linear-gradient(90deg, rgba(58, 108, 245, 0.25) 0%, rgba(75, 211, 255, 0.25) 100%)'
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
// HERO BLOCK — TL;DR Card with Tahoe Glass
// ============================================================================
const HeroBlock = ({ data, theme, weight }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      className="mx-7 mt-5"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08, duration: MOTION.duration, ease: MOTION.ease }}
    >
      <motion.div
        className="relative overflow-hidden"
        style={{
          padding: '28px 32px',
          background: TAHOE.hero.bg,
          backdropFilter: TAHOE.hero.blur,
          WebkitBackdropFilter: TAHOE.hero.blur,
          borderRadius: TAHOE.hero.radius,
          border: '1px solid rgba(120, 180, 255, 0.08)'
        }}
        animate={{
          y: isHovered ? -2 : 0,
          filter: isHovered ? 'brightness(1.04)' : 'brightness(1)'
        }}
        transition={{ duration: 0.18, ease: MOTION.ease }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* TL;DR micro-label */}
        <div 
          className="mb-4"
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: 'rgba(255,255,255,0.55)',
            letterSpacing: '0.18em',
            textTransform: 'uppercase'
          }}
        >
          TL;DR
        </div>
        
        {/* Hero headline */}
        <p 
          style={{
            fontSize: '18px',
            fontWeight: 500,
            color: 'rgba(255,255,255,0.95)',
            lineHeight: 1.55,
            maxWidth: '80%',
            marginBottom: '20px'
          }}
        >
          {data.tldr}
        </p>
        
        {/* State chips aligned right */}
        <div className="flex items-center justify-end gap-2">
          <TahoeChip theme={theme} isActive variant="status">
            {data.status}
          </TahoeChip>
          <TahoeChip theme={theme}>
            {Math.round(weight)}% weight
          </TahoeChip>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ============================================================================
// EVIDENCE CARDS — Middle cards with Tahoe styling
// ============================================================================
const EvidenceCard = ({ item, theme, delay }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -4, y: x * 4 });
  };
  
  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: MOTION.duration, ease: MOTION.ease }}
      className="relative overflow-hidden"
      style={{
        padding: '20px 24px',
        background: TAHOE.card.bg,
        backdropFilter: TAHOE.card.blur,
        WebkitBackdropFilter: TAHOE.card.blur,
        borderRadius: TAHOE.card.radius,
        border: '1px solid rgba(120, 180, 255, 0.06)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setTilt({ x: 0, y: 0 }); }}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="flex items-start gap-4"
        animate={{
          y: isHovered ? -1 : 0,
          filter: isHovered ? 'brightness(1.04)' : 'brightness(1)'
        }}
        transition={{ duration: 0.15, ease: MOTION.ease }}
      >
        <motion.div 
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            background: TAHOE.card.iconBg,
            boxShadow: `inset 0 1px 2px rgba(255,255,255,0.12), ${isHovered ? `0 0 16px rgba(${theme.rgb}, 0.30)` : 'none'}`,
            transition: 'box-shadow 0.2s ease'
          }}
          animate={{
            rotateX: isHovered ? tilt.x : 0,
            rotateY: isHovered ? tilt.y : 0
          }}
          transition={{ duration: 0.15 }}
        >
          <item.icon className="w-[18px] h-[18px]" style={{ color: theme.color }} strokeWidth={2} />
        </motion.div>
        <div className="flex-1 pt-1">
          <h4 
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'rgba(255,255,255,0.9)',
              marginBottom: '6px'
            }}
          >
            {item.title}
          </h4>
          <p 
            style={{
              fontSize: '13px',
              fontWeight: 400,
              color: 'rgba(210,220,255,0.78)',
              lineHeight: 1.5
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
  <div className="mx-7 mt-4 flex flex-col" style={{ gap: '16px' }}>
    {data.evidence.map((item, i) => (
      <EvidenceCard 
        key={item.title} 
        item={item} 
        theme={theme} 
        delay={0.14 + (i * MOTION.stagger)} 
      />
    ))}
  </div>
);

// ============================================================================
// NARRATIVE SUMMARY — What This Means Panel
// ============================================================================
const NarrativeSummary = ({ data, theme }) => (
  <motion.div
    className="mx-7 mt-5"
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.32, duration: 0.22, ease: MOTION.ease }}
  >
    <div
      className="relative overflow-hidden"
      style={{
        padding: '26px 28px',
        background: TAHOE.summary.bg,
        backdropFilter: TAHOE.summary.blur,
        WebkitBackdropFilter: TAHOE.summary.blur,
        borderRadius: TAHOE.summary.radius,
        border: '1px solid rgba(120, 180, 255, 0.08)'
      }}
    >
      <h3 
        className="mb-4"
        style={{
          fontSize: '12px',
          fontWeight: 600,
          color: 'rgba(255,255,255,0.55)',
          letterSpacing: '0.18em',
          textTransform: 'uppercase'
        }}
      >
        What This Means
      </h3>
      
      <p 
        style={{
          fontSize: '16px',
          fontWeight: 400,
          color: 'rgba(230,235,255,0.92)',
          lineHeight: 1.65
        }}
      >
        {data.summary}
      </p>
    </div>
  </motion.div>
);

// ============================================================================
// TAHOE CHIP SYSTEM
// ============================================================================
const TahoeChip = ({ children, theme, isActive, variant }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      className="flex items-center gap-1.5 relative"
      style={{
        fontSize: '13px',
        fontWeight: 500,
        color: isActive ? 'rgba(220,230,255,0.95)' : 'rgba(220,230,255,0.9)',
        background: isActive ? TAHOE.chip.activeGradient : TAHOE.chip.bg,
        padding: '6px 14px',
        borderRadius: TAHOE.chip.radius,
        border: `1px solid ${TAHOE.chip.border}`,
        boxShadow: isHovered ? '0 0 16px rgba(84,141,255,0.45)' : 'none',
        transition: 'box-shadow 0.15s ease'
      }}
      animate={{ scale: isHovered ? 1.03 : 1 }}
      transition={{ duration: 0.14, ease: MOTION.ease }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Pulsing dot for active status chips */}
      {isActive && variant === 'status' && (
        <motion.div
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: '#4BD3FF' }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
      {children}
    </motion.div>
  );
};

// ============================================================================
// SIGNAL ROW — Bottom chips
// ============================================================================
const SignalRow = ({ data, theme }) => {
  const TrendIcon = data.trend === 'up' ? TrendingUp : data.trend === 'down' ? TrendingDown : null;
  
  return (
    <motion.div
      className="flex justify-center mx-7 mt-4 mb-8"
      style={{ gap: '12px' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.40, duration: MOTION.duration }}
    >
      {TrendIcon && (
        <TahoeChip theme={theme} isActive variant="status">
          <TrendIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
          <span>{data.status}</span>
        </TahoeChip>
      )}
      
      <TahoeChip theme={theme}>
        <span>{data.certainty}%</span>
      </TahoeChip>
      
      <TahoeChip theme={theme}>
        <Clock className="w-3.5 h-3.5" strokeWidth={2} />
        <span>{data.horizon}</span>
      </TahoeChip>
    </motion.div>
  );
};

// ============================================================================
// HEADER — Merged glass sheet, no harsh divider
// ============================================================================
const Header = ({ segment, theme, onClose, onNavigate }) => {
  const { Icon } = theme;
  
  return (
    <motion.div 
      className="relative px-8 pt-7 pb-5"
      style={{
        background: TAHOE.header.bg,
        backdropFilter: TAHOE.header.blur,
        WebkitBackdropFilter: TAHOE.header.blur,
        borderRadius: '28px 28px 0 0'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.18 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.div 
            className="w-11 h-11 rounded-full flex items-center justify-center"
            style={{
              background: TAHOE.card.iconBg,
              boxShadow: `inset 0 1px 2px rgba(255,255,255,0.15), 0 0 12px rgba(${theme.rgb}, 0.20)`
            }}
            whileHover={{ 
              boxShadow: `inset 0 1px 2px rgba(255,255,255,0.15), 0 0 20px rgba(${theme.rgb}, 0.35)`,
              rotateY: 4,
              rotateX: -3
            }}
            transition={{ duration: 0.2 }}
          >
            <Icon className="w-5 h-5" style={{ color: theme.color }} strokeWidth={2} />
          </motion.div>
          <div>
            <h1 style={{ fontSize: '16px', fontWeight: 600, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.01em' }}>
              {segment.name}
            </h1>
            <p style={{ fontSize: '13px', fontWeight: 420, color: 'rgba(210,220,255,0.7)', marginTop: '2px' }}>
              Market Pressure Analysis
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {[
            { action: () => onNavigate('prev'), icon: ChevronLeft },
            { action: () => onNavigate('next'), icon: ChevronRight },
            { action: onClose, icon: X, ml: true }
          ].map(({ action, icon: BtnIcon, ml }, i) => (
            <motion.button
              key={i}
              onClick={action}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${ml ? 'ml-2' : ''}`}
              style={{ 
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.08)'
              }}
              whileHover={{ 
                scale: 1.04,
                background: 'rgba(255,255,255,0.12)',
                boxShadow: '0 0 12px rgba(120,180,255,0.25)'
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.15 }}
            >
              <BtnIcon className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.70)' }} />
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// ============================================================================
// NOISE OVERLAY
// ============================================================================
const NoiseOverlay = () => (
  <div 
    className="absolute inset-0 pointer-events-none"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      opacity: 0.015,
      mixBlendMode: 'overlay',
      borderRadius: '28px'
    }}
  />
);

// ============================================================================
// MAIN DRAWER
// ============================================================================
export default function SegmentDetailDrawer({ isOpen, onClose, segment, onNavigate }) {
  const scrollRef = useRef(null);
  
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
        transition={{ duration: 0.28, ease: MOTION.ease }}
        style={{ paddingTop: '80px' }}
      >
        {/* Global canvas with deep navy gradient + bokeh */}
        <motion.div 
          className="absolute inset-0"
          style={{ 
            top: '80px',
            background: TAHOE.canvas.bg,
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)'
          }}
          onClick={onClose}
        >
          {/* Bokeh glows */}
          <div
            className="absolute w-96 h-96 rounded-full"
            style={{
              top: '10%',
              left: '20%',
              background: 'radial-gradient(circle, rgba(80,120,200,0.08) 0%, transparent 70%)',
              filter: 'blur(60px)'
            }}
          />
          <div
            className="absolute w-80 h-80 rounded-full"
            style={{
              bottom: '20%',
              right: '15%',
              background: 'radial-gradient(circle, rgba(120,80,180,0.06) 0%, transparent 70%)',
              filter: 'blur(50px)'
            }}
          />
          <NoiseOverlay />
        </motion.div>
        
        {/* Main Drawer Glass */}
        <motion.div
          key={segment.name}
          className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col"
          style={{
            borderRadius: TAHOE.drawer.radius,
            background: TAHOE.drawer.bg,
            backdropFilter: TAHOE.drawer.blur,
            WebkitBackdropFilter: TAHOE.drawer.blur,
            boxShadow: `
              ${TAHOE.drawer.innerShadow},
              0 40px 80px -20px rgba(0,0,0,0.70)
            `
          }}
          initial={{ opacity: 0, scale: 0.97, y: 10, filter: 'blur(4px)' }}
          animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 0.97, y: 8, filter: 'blur(2px)' }}
          transition={{ duration: 0.28, ease: MOTION.ease }}
        >
          {/* Gradient border effect */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              borderRadius: TAHOE.drawer.radius,
              border: '1px solid transparent',
              background: `${TAHOE.drawer.border} border-box`,
              WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude'
            }}
          />
          
          {/* Top highlight strip */}
          <div 
            className="absolute top-0 left-0 right-0 h-1.5 pointer-events-none"
            style={{
              background: TAHOE.drawer.highlight,
              borderRadius: '28px 28px 0 0'
            }}
          />
          
          <NoiseOverlay />
          
          <Header segment={segment} theme={theme} onClose={onClose} onNavigate={onNavigate} />
          
          <div 
            ref={scrollRef}
            className="overflow-y-auto flex-1" 
            style={{ scrollBehavior: 'smooth' }}
          >
            <HeroBlock data={data} theme={theme} weight={weight} />
            <EvidenceTrio data={data} theme={theme} />
            <NarrativeSummary data={data} theme={theme} />
            <SignalRow data={data} theme={theme} />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}