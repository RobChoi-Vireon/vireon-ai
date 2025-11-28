// 🔒 DESIGN LOCKED — OS HORIZON LIQUID GLASS (macOS Tahoe)
// Strict Compliance with Vireon Design System
// Last Updated: 2025-01-28

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Briefcase, BarChart3, Globe, Target, Waves, ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Clock } from 'lucide-react';

// ============================================================================
// MOTION
// ============================================================================
const MOTION = {
  ease: [0.22, 0.61, 0.36, 1],
  duration: 0.30
};

// ============================================================================
// OS HORIZON LIQUID GLASS SYSTEM — TAHOE STANDARD
// ============================================================================
const GLASS = {
  canvas: {
    gradient: 'linear-gradient(180deg, #070B16 0%, #0A1020 50%, #090D17 100%)',
    bokeh: [
      { x: '18%', y: '22%', color: 'rgba(35, 55, 110, 0.055)', size: '380px' },
      { x: '78%', y: '30%', color: 'rgba(60, 45, 120, 0.045)', size: '300px' },
      { x: '55%', y: '68%', color: 'rgba(45, 60, 130, 0.05)', size: '340px' },
      { x: '85%', y: '75%', color: 'rgba(70, 55, 140, 0.04)', size: '260px' }
    ]
  },
  drawer: {
    bg: 'rgba(18, 24, 38, 0.57)',
    blur: 'blur(46px)',
    radius: '36px',
    border: 'linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(120,170,255,0.05) 100%)',
    innerGlow: '0 0 60px rgba(255,255,255,0.03)',
    innerShadow: 'inset 0 0 45px rgba(0,0,0,0.25)'
  },
  header: {
    bg: 'rgba(28, 35, 60, 0.42)',
    blur: 'blur(50px)',
    highlight: 'linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.14) 50%, transparent 90%)'
  },
  hero: {
    bg: 'rgba(32, 45, 72, 0.40)',
    blur: 'blur(48px)',
    radius: '28px'
  },
  card: {
    bg: 'rgba(22, 30, 52, 0.38)',
    blur: 'blur(32px)',
    radius: '24px'
  },
  chip: {
    bg: 'rgba(255, 255, 255, 0.08)',
    border: 'rgba(255, 255, 255, 0.18)',
    blur: 'blur(30px)',
    innerShadow: 'inset 0 0 18px rgba(255,255,255,0.10)',
    radius: '999px'
  }
};

// ============================================================================
// THEMES
// ============================================================================
const getTheme = (name) => ({
  Policy: { Icon: Shield, color: '#6BA3E8', rgb: '107, 163, 232' },
  Credit: { Icon: Briefcase, color: '#A88BE0', rgb: '168, 139, 224' },
  Equities: { Icon: BarChart3, color: '#5BC9A0', rgb: '91, 201, 160' },
  Global: { Icon: Globe, color: '#E0B86B', rgb: '224, 184, 107' }
}[name] || { Icon: Shield, color: '#6BA3E8', rgb: '107, 163, 232' });

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
// PULSING DOT
// ============================================================================
const PulsingDot = ({ color }) => (
  <motion.div
    className="w-1 h-1 rounded-full mr-2"
    style={{ 
      background: color, 
      boxShadow: `0 0 10px ${color}, 0 0 4px ${color}` 
    }}
    animate={{ 
      opacity: [0.6, 1, 0.6],
      boxShadow: [
        `0 0 8px ${color}, 0 0 3px ${color}`,
        `0 0 14px ${color}, 0 0 6px ${color}`,
        `0 0 8px ${color}, 0 0 3px ${color}`
      ]
    }}
    transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut' }}
  />
);

// ============================================================================
// LIQUID GLASS CHIP
// ============================================================================
const GlassChip = ({ children, isActive, theme }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      className="flex items-center"
      style={{
        padding: '8px 16px',
        fontSize: '13px',
        fontWeight: 500,
        color: 'rgba(230, 235, 255, 0.88)',
        background: GLASS.chip.bg,
        backdropFilter: GLASS.chip.blur,
        WebkitBackdropFilter: GLASS.chip.blur,
        border: `1px solid ${GLASS.chip.border}`,
        borderRadius: GLASS.chip.radius,
        boxShadow: GLASS.chip.innerShadow
      }}
      animate={{
        scale: isHovered ? 1.03 : 1,
        boxShadow: isHovered 
          ? `${GLASS.chip.innerShadow}, 0 0 22px rgba(140, 175, 255, 0.22)` 
          : GLASS.chip.innerShadow
      }}
      transition={{ duration: 0.15 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {isActive && <PulsingDot color={theme.color} />}
      {children}
    </motion.div>
  );
};

// ============================================================================
// NAV BUTTON
// ============================================================================
const NavButton = ({ onClick, children }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.button
      onClick={onClick}
      className="w-8 h-8 rounded-full flex items-center justify-center"
      style={{ 
        background: 'rgba(255,255,255,0.08)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)'
      }}
      animate={{
        scale: isHovered ? 1.06 : 1,
        background: isHovered ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.08)',
        boxShadow: isHovered ? '0 0 20px rgba(150, 180, 255, 0.20)' : 'none'
      }}
      transition={{ duration: 0.16 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileTap={{ scale: 0.94 }}
    >
      {children}
    </motion.button>
  );
};

// ============================================================================
// HEADER RIBBON
// ============================================================================
const Header = ({ segment, theme, onClose, onNavigate }) => {
  const { Icon } = theme;
  const [iconHovered, setIconHovered] = useState(false);
  
  return (
    <div 
      className="relative"
      style={{
        padding: '24px 36px 20px',
        background: GLASS.header.bg,
        backdropFilter: GLASS.header.blur,
        WebkitBackdropFilter: GLASS.header.blur
      }}
    >
      {/* Specular highlight band */}
      <div 
        className="absolute top-0 left-0 right-0 h-[3px] pointer-events-none"
        style={{ 
          background: GLASS.header.highlight,
          borderRadius: '36px 36px 0 0'
        }}
      />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.div 
            className="w-11 h-11 rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(255,255,255,0.07)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              boxShadow: 'inset 0 0 18px rgba(255,255,255,0.06)'
            }}
            animate={{
              boxShadow: iconHovered 
                ? `0 0 26px rgba(${theme.rgb}, 0.28), inset 0 0 18px rgba(255,255,255,0.06)`
                : 'inset 0 0 18px rgba(255,255,255,0.06)'
            }}
            onHoverStart={() => setIconHovered(true)}
            onHoverEnd={() => setIconHovered(false)}
          >
            <Icon className="w-5 h-5" style={{ color: theme.color }} strokeWidth={1.8} />
          </motion.div>
          <div>
            <h1 style={{ 
              fontSize: '16px', 
              fontWeight: 600, 
              color: 'rgba(255,255,255,0.92)', 
              letterSpacing: '-0.01em' 
            }}>
              {segment.name}
            </h1>
            <p style={{ 
              fontSize: '13px', 
              fontWeight: 420, 
              color: 'rgba(215,225,255,0.68)', 
              marginTop: '2px' 
            }}>
              Market Pressure Analysis
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2.5">
          <NavButton onClick={() => onNavigate('prev')}>
            <ChevronLeft className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.72)' }} />
          </NavButton>
          <NavButton onClick={() => onNavigate('next')}>
            <ChevronRight className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.72)' }} />
          </NavButton>
          <NavButton onClick={onClose}>
            <X className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.72)' }} />
          </NavButton>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// TL;DR HERO CARD
// ============================================================================
const HeroCard = ({ data, theme, weight }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      className="mx-9 mt-7"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.06, duration: MOTION.duration, ease: MOTION.ease }}
    >
      <motion.div
        className="relative overflow-hidden"
        style={{
          padding: '28px 34px',
          background: GLASS.hero.bg,
          backdropFilter: GLASS.hero.blur,
          WebkitBackdropFilter: GLASS.hero.blur,
          borderRadius: GLASS.hero.radius,
          boxShadow: 'inset 0 0 35px rgba(255,255,255,0.025)'
        }}
        animate={{
          y: isHovered ? -2 : 0,
          filter: isHovered ? 'brightness(1.03)' : 'brightness(1)'
        }}
        transition={{ duration: 0.18 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Label */}
        <div style={{
          fontSize: '12px',
          fontWeight: 600,
          color: 'rgba(255,255,255,0.50)',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          marginBottom: '14px'
        }}>
          TL;DR
        </div>
        
        {/* Headline */}
        <p style={{
          fontSize: '21px',
          fontWeight: 500,
          color: 'rgba(255,255,255,0.95)',
          lineHeight: 1.50,
          marginBottom: '24px'
        }}>
          {data.tldr}
        </p>
        
        {/* Chips */}
        <div className="flex items-center justify-end gap-2.5">
          <GlassChip isActive theme={theme}>{data.status}</GlassChip>
          <GlassChip theme={theme}>{Math.round(weight)}% weight</GlassChip>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ============================================================================
// INFO CARD
// ============================================================================
const InfoCard = ({ item, theme, delay }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [iconHovered, setIconHovered] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: MOTION.duration, ease: MOTION.ease }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        style={{
          padding: '22px 28px',
          background: GLASS.card.bg,
          backdropFilter: GLASS.card.blur,
          WebkitBackdropFilter: GLASS.card.blur,
          borderRadius: GLASS.card.radius,
          boxShadow: 'inset 0 0 28px rgba(255,255,255,0.018)'
        }}
        animate={{
          y: isHovered ? -1.5 : 0,
          filter: isHovered ? 'brightness(1.03)' : 'brightness(1)'
        }}
        transition={{ duration: 0.16 }}
      >
        <div className="flex items-start gap-4">
          <motion.div 
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              background: 'rgba(255,255,255,0.065)',
              backdropFilter: 'blur(22px)',
              WebkitBackdropFilter: 'blur(22px)',
              boxShadow: 'inset 0 0 16px rgba(255,255,255,0.055)'
            }}
            animate={{
              boxShadow: iconHovered 
                ? `0 0 22px rgba(${theme.rgb}, 0.24), inset 0 0 16px rgba(255,255,255,0.055)`
                : 'inset 0 0 16px rgba(255,255,255,0.055)'
            }}
            onHoverStart={() => setIconHovered(true)}
            onHoverEnd={() => setIconHovered(false)}
          >
            <item.icon className="w-[18px] h-[18px]" style={{ color: theme.color }} strokeWidth={1.8} />
          </motion.div>
          <div className="flex-1 pt-0.5">
            <h4 style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'rgba(255,255,255,0.90)',
              marginBottom: '7px'
            }}>
              {item.title}
            </h4>
            <p style={{
              fontSize: '13px',
              fontWeight: 400,
              color: 'rgba(210,220,255,0.78)',
              lineHeight: 1.58
            }}>
              {item.text}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ============================================================================
// INFO CARDS STACK
// ============================================================================
const InfoStack = ({ data, theme }) => (
  <div className="mx-9 mt-7 flex flex-col" style={{ gap: '26px' }}>
    {data.evidence.map((item, i) => (
      <InfoCard 
        key={item.title} 
        item={item} 
        theme={theme} 
        delay={0.12 + (i * 0.05)} 
      />
    ))}
  </div>
);

// ============================================================================
// WHAT THIS MEANS
// ============================================================================
const SummaryCard = ({ data, theme }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      className="mx-9 mt-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.28, duration: MOTION.duration, ease: MOTION.ease }}
    >
      <motion.div
        className="relative overflow-hidden"
        style={{
          padding: '28px 34px',
          background: GLASS.hero.bg,
          backdropFilter: GLASS.hero.blur,
          WebkitBackdropFilter: GLASS.hero.blur,
          borderRadius: GLASS.hero.radius,
          boxShadow: 'inset 0 0 35px rgba(255,255,255,0.025)'
        }}
        animate={{
          y: isHovered ? -1.5 : 0,
          filter: isHovered ? 'brightness(1.03)' : 'brightness(1)'
        }}
        transition={{ duration: 0.18 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <div style={{
          fontSize: '12px',
          fontWeight: 600,
          color: 'rgba(255,255,255,0.50)',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          marginBottom: '14px'
        }}>
          What This Means
        </div>
        
        <p style={{
          fontSize: '16px',
          fontWeight: 400,
          color: 'rgba(230,235,255,0.92)',
          lineHeight: 1.72
        }}>
          {data.summary}
        </p>
      </motion.div>
      
      {/* Bottom chips — 16px below card */}
      <div className="flex justify-center gap-3" style={{ marginTop: '16px' }}>
        <GlassChip isActive theme={theme}>
          {data.trend === 'up' && <TrendingUp className="w-3.5 h-3.5 mr-1.5" strokeWidth={2} />}
          {data.trend === 'down' && <TrendingDown className="w-3.5 h-3.5 mr-1.5" strokeWidth={2} />}
          {data.status}
        </GlassChip>
        <GlassChip theme={theme}>{data.certainty}%</GlassChip>
        <GlassChip theme={theme}>
          <Clock className="w-3.5 h-3.5 mr-1.5" strokeWidth={2} />
          {data.horizon}
        </GlassChip>
      </div>
    </motion.div>
  );
};

// ============================================================================
// BOKEH LAYER
// ============================================================================
const BokehLayer = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {GLASS.canvas.bokeh.map((glow, i) => (
      <div
        key={i}
        className="absolute rounded-full"
        style={{
          left: glow.x,
          top: glow.y,
          width: glow.size,
          height: glow.size,
          background: glow.color,
          filter: 'blur(90px)',
          transform: 'translate(-50%, -50%)'
        }}
      />
    ))}
  </div>
);

// ============================================================================
// NOISE LAYER
// ============================================================================
const NoiseLayer = () => (
  <div 
    className="absolute inset-0 pointer-events-none"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      opacity: 0.01,
      mixBlendMode: 'overlay'
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
        transition={{ duration: 0.28 }}
        style={{ paddingTop: '80px' }}
      >
        {/* Custom scrollbar styles */}
        <style>{`
          .tahoe-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .tahoe-scrollbar::-webkit-scrollbar-track {
            background: rgba(255,255,255,0.08);
            border-radius: 999px;
          }
          .tahoe-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255,255,255,0.14);
            border-radius: 999px;
            backdrop-filter: blur(18px);
          }
          .tahoe-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(255,255,255,0.20);
          }
        `}</style>
        {/* Canvas */}
        <motion.div 
          className="absolute inset-0"
          style={{ 
            top: '80px',
            background: GLASS.canvas.gradient
          }}
          onClick={onClose}
        >
          <BokehLayer />
          <NoiseLayer />
        </motion.div>
        
        {/* Drawer */}
        <motion.div
          key={segment.name}
          className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col"
          style={{
            borderRadius: GLASS.drawer.radius,
            background: GLASS.drawer.bg,
            backdropFilter: GLASS.drawer.blur,
            WebkitBackdropFilter: GLASS.drawer.blur,
            boxShadow: `${GLASS.drawer.innerGlow}, ${GLASS.drawer.innerShadow}, 0 30px 60px -15px rgba(0,0,0,0.50)`
          }}
          initial={{ opacity: 0, scale: 0.97, y: 8, filter: 'blur(6px)' }}
          animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 0.97, y: 8, filter: 'blur(6px)' }}
          transition={{ duration: 0.30, ease: MOTION.ease }}
        >
          {/* Gradient border */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              borderRadius: GLASS.drawer.radius,
              background: GLASS.drawer.border,
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
              padding: '1px'
            }}
          />
          
          <Header segment={segment} theme={theme} onClose={onClose} onNavigate={onNavigate} />
          
          <div 
            ref={scrollRef}
            className="overflow-y-auto flex-1 pb-10 tahoe-scrollbar" 
            style={{ scrollBehavior: 'smooth' }}
          >
            <HeroCard data={data} theme={theme} weight={weight} />
            <InfoStack data={data} theme={theme} />
            <SummaryCard data={data} theme={theme} />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}