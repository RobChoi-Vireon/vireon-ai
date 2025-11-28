// 🔒 DESIGN LOCKED — OS HORIZON TAHOE LIQUID GLASS V1
// 16-Pillar Ironclad Audit Compliant
// Last Updated: 2025-01-28

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { X, Shield, Briefcase, BarChart3, Globe, Target, Waves, ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Clock } from 'lucide-react';

// ============================================================================
// MOTION CONFIG
// ============================================================================
const MOTION = {
  ease: [0.22, 0.61, 0.36, 1],
  duration: 0.28,
  stagger: 0.06
};

// ============================================================================
// TAHOE LIQUID GLASS SYSTEM
// ============================================================================
const TAHOE = {
  canvas: {
    gradient: `
      radial-gradient(ellipse at 20% 20%, #050814 0%, transparent 50%),
      radial-gradient(ellipse at 80% 20%, #050814 0%, transparent 50%),
      radial-gradient(ellipse at 50% 50%, #050A18 0%, transparent 70%),
      linear-gradient(to bottom, #050814 0%, #050A18 40%, #020712 100%)
    `,
    bokeh: [
      { x: '25%', y: '30%', color: 'rgba(58, 108, 245, 0.08)', size: '300px' },
      { x: '75%', y: '60%', color: 'rgba(138, 100, 255, 0.06)', size: '250px' }
    ]
  },
  drawer: {
    bg: 'rgba(10, 18, 40, 0.82)',
    blur: 'blur(30px)',
    radius: '28px',
    border: 'linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(120,180,255,0.02) 100%)',
    shadow: 'inset 0 0 40px rgba(0,0,0,0.35), 0 40px 80px -20px rgba(0,0,0,0.70)'
  },
  header: {
    bg: 'rgba(20, 32, 70, 0.9)',
    blur: 'blur(40px)'
  },
  tldr: {
    bg: 'rgba(23, 38, 80, 0.85)',
    blur: 'blur(38px)',
    radius: '24px'
  },
  card: {
    bg: 'rgba(13, 23, 55, 0.9)',
    blur: 'blur(24px)',
    radius: '20px'
  },
  chip: {
    bg: 'rgba(30, 52, 96, 0.9)',
    border: 'rgba(120, 180, 255, 0.35)',
    radius: '999px',
    activeGradient: 'linear-gradient(90deg, rgba(58,108,245,0.22) 0%, rgba(75,211,255,0.22) 100%)'
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
// PULSING DOT
// ============================================================================
const PulsingDot = ({ color }) => (
  <motion.div
    className="w-1.5 h-1.5 rounded-full mr-1.5"
    style={{ background: color, boxShadow: `0 0 6px ${color}` }}
    animate={{ opacity: [0.5, 1, 0.5] }}
    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
  />
);

// ============================================================================
// CHIP COMPONENT
// ============================================================================
const Chip = ({ children, isActive, theme }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      className="flex items-center"
      style={{
        padding: '6px 14px',
        fontSize: '13px',
        fontWeight: 500,
        color: 'rgba(220, 230, 255, 0.9)',
        background: isActive ? TAHOE.chip.activeGradient : TAHOE.chip.bg,
        border: `1px solid ${TAHOE.chip.border}`,
        borderRadius: TAHOE.chip.radius
      }}
      animate={{
        scale: isHovered ? 1.03 : 1,
        boxShadow: isHovered ? '0 0 16px rgba(84, 141, 255, 0.45)' : 'none'
      }}
      transition={{ duration: 0.14 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {isActive && <PulsingDot color={theme.color} />}
      {children}
    </motion.div>
  );
};

// ============================================================================
// HEADER
// ============================================================================
const Header = ({ segment, theme, onClose, onNavigate }) => {
  const { Icon } = theme;
  
  const NavButton = ({ onClick, children }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    return (
      <motion.button
        onClick={onClick}
        className="w-8 h-8 rounded-full flex items-center justify-center"
        style={{ background: 'rgba(255,255,255,0.06)' }}
        animate={{
          scale: isHovered ? 1.04 : 1,
          background: isHovered ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)',
          boxShadow: isHovered ? '0 0 12px rgba(120,180,255,0.25)' : 'none'
        }}
        transition={{ duration: 0.14 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileTap={{ scale: 0.95 }}
      >
        {children}
      </motion.button>
    );
  };

  return (
    <div 
      className="relative px-8 pt-7 pb-5"
      style={{
        background: TAHOE.header.bg,
        backdropFilter: TAHOE.header.blur,
        WebkitBackdropFilter: TAHOE.header.blur
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.div 
            className="w-11 h-11 rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(52, 87, 140, 0.65)',
              boxShadow: 'inset 0 0 12px rgba(120,180,255,0.15)'
            }}
            whileHover={{ 
              boxShadow: `0 0 20px rgba(${theme.rgb}, 0.3), inset 0 0 12px rgba(120,180,255,0.15)`,
              rotate: 3
            }}
          >
            <Icon className="w-5 h-5" style={{ color: theme.color }} strokeWidth={2} />
          </motion.div>
          <div>
            <h1 style={{ fontSize: '16px', fontWeight: 600, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.01em' }}>
              {segment.name}
            </h1>
            <p style={{ fontSize: '13px', fontWeight: 420, color: 'rgba(210,220,255,0.7)', marginTop: '1px' }}>
              Market Pressure Analysis
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <NavButton onClick={() => onNavigate('prev')}>
            <ChevronLeft className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.70)' }} />
          </NavButton>
          <NavButton onClick={() => onNavigate('next')}>
            <ChevronRight className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.70)' }} />
          </NavButton>
          <NavButton onClick={onClose}>
            <X className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.70)' }} />
          </NavButton>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// TL;DR CARD
// ============================================================================
const TLDRCard = ({ data, theme, weight, scrollY }) => {
  const [isHovered, setIsHovered] = useState(false);
  const y = useTransform(scrollY, [0, 100], [0, -8]);
  
  return (
    <motion.div
      className="mx-6 mt-5"
      style={{ y }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08, duration: MOTION.duration, ease: MOTION.ease }}
    >
      <motion.div
        className="relative overflow-hidden text-center"
        style={{
          padding: '28px 32px',
          background: TAHOE.tldr.bg,
          backdropFilter: TAHOE.tldr.blur,
          WebkitBackdropFilter: TAHOE.tldr.blur,
          borderRadius: TAHOE.tldr.radius
        }}
        animate={{
          y: isHovered ? -2 : 0,
          filter: isHovered ? 'brightness(1.04)' : 'brightness(1)'
        }}
        transition={{ duration: 0.16 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Micro label */}
        <div 
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: 'rgba(255,255,255,0.55)',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            marginBottom: '16px'
          }}
        >
          TL;DR
        </div>
        
        {/* Main text */}
        <p 
          style={{
            fontSize: '18px',
            fontWeight: 500,
            color: 'rgba(255,255,255,0.95)',
            lineHeight: 1.55,
            maxWidth: '80%',
            margin: '0 auto 20px'
          }}
        >
          {data.tldr}
        </p>
        
        {/* Chips */}
        <div className="flex items-center justify-center gap-2">
          <Chip isActive theme={theme}>{data.status}</Chip>
          <Chip theme={theme}>{Math.round(weight)}% weight</Chip>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ============================================================================
// EVIDENCE CARD
// ============================================================================
const EvidenceCard = ({ item, theme, delay }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: MOTION.duration, ease: MOTION.ease }}
      className="relative overflow-hidden"
      style={{
        padding: '20px 24px',
        background: TAHOE.card.bg,
        backdropFilter: TAHOE.card.blur,
        WebkitBackdropFilter: TAHOE.card.blur,
        borderRadius: TAHOE.card.radius
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="flex items-start gap-4"
        animate={{
          y: isHovered ? -1 : 0,
          filter: isHovered ? 'brightness(1.04)' : 'brightness(1)'
        }}
        transition={{ duration: 0.14 }}
      >
        <motion.div 
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            background: 'rgba(52, 87, 140, 0.65)',
            boxShadow: 'inset 0 0 10px rgba(120,180,255,0.12)'
          }}
          animate={{
            boxShadow: isHovered 
              ? `0 0 16px rgba(${theme.rgb}, 0.25), inset 0 0 10px rgba(120,180,255,0.12)`
              : 'inset 0 0 10px rgba(120,180,255,0.12)',
            rotate: isHovered ? 3 : 0
          }}
          transition={{ duration: 0.14 }}
        >
          <item.icon className="w-4.5 h-4.5" style={{ color: theme.color }} strokeWidth={2} />
        </motion.div>
        <div className="flex-1 pt-0.5">
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

// ============================================================================
// EVIDENCE STACK
// ============================================================================
const EvidenceStack = ({ data, theme }) => (
  <div className="mx-6 mt-5 flex flex-col" style={{ gap: '16px' }}>
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
// WHAT THIS MEANS
// ============================================================================
const WhatThisMeans = ({ data, theme, scrollY }) => {
  const y = useTransform(scrollY, [0, 100], [0, -8]);
  
  return (
    <motion.div
      className="mx-6 mt-5"
      style={{ y }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.34, duration: 0.22, ease: MOTION.ease }}
    >
      <div
        className="relative overflow-hidden text-center"
        style={{
          padding: '28px 30px',
          background: TAHOE.tldr.bg,
          backdropFilter: TAHOE.tldr.blur,
          WebkitBackdropFilter: TAHOE.tldr.blur,
          borderRadius: TAHOE.tldr.radius
        }}
      >
        <div 
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: 'rgba(255,255,255,0.55)',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            marginBottom: '14px'
          }}
        >
          What This Means
        </div>
        
        <p 
          style={{
            fontSize: '16px',
            fontWeight: 400,
            color: 'rgba(230,235,255,0.92)',
            lineHeight: 1.65,
            maxWidth: '420px',
            margin: '0 auto'
          }}
        >
          {data.summary}
        </p>
      </div>
      
      {/* Bottom chips */}
      <div className="flex justify-center gap-2.5 mt-4">
        <Chip isActive theme={theme}>
          {data.trend === 'up' && <TrendingUp className="w-3 h-3 mr-1.5" />}
          {data.trend === 'down' && <TrendingDown className="w-3 h-3 mr-1.5" />}
          {data.status}
        </Chip>
        <Chip theme={theme}>{data.certainty}%</Chip>
        <Chip theme={theme}>
          <Clock className="w-3 h-3 mr-1.5" />
          {data.horizon}
        </Chip>
      </div>
    </motion.div>
  );
};

// ============================================================================
// BOKEH LAYER
// ============================================================================
const BokehLayer = ({ scrollY }) => {
  const scale = useTransform(scrollY, [0, 200], [1, 0.9]);
  const opacity = useTransform(scrollY, [0, 200], [1, 0.7]);
  
  return (
    <motion.div 
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ scale, opacity }}
    >
      {TAHOE.canvas.bokeh.map((glow, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: glow.x,
            top: glow.y,
            width: glow.size,
            height: glow.size,
            background: glow.color,
            filter: 'blur(80px)',
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}
    </motion.div>
  );
};

// ============================================================================
// NOISE LAYER
// ============================================================================
const NoiseLayer = () => (
  <div 
    className="absolute inset-0 pointer-events-none"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      opacity: 0.015,
      mixBlendMode: 'overlay'
    }}
  />
);

// ============================================================================
// GLASS HIGHLIGHT
// ============================================================================
const GlassHighlight = () => (
  <div 
    className="absolute top-0 left-0 right-0 h-1.5 pointer-events-none"
    style={{
      background: 'linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.12) 50%, transparent 90%)',
      borderRadius: '28px 28px 0 0'
    }}
  />
);

// ============================================================================
// MAIN DRAWER
// ============================================================================
export default function SegmentDetailDrawer({ isOpen, onClose, segment, onNavigate }) {
  const scrollRef = useRef(null);
  const { scrollY } = useScroll({ container: scrollRef });
  
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
        transition={{ duration: 0.26 }}
        style={{ paddingTop: '80px' }}
      >
        {/* Canvas with gradient + bokeh + noise */}
        <motion.div 
          className="absolute inset-0"
          style={{ 
            top: '80px',
            background: TAHOE.canvas.gradient
          }}
          onClick={onClose}
        >
          <BokehLayer scrollY={scrollY} />
          <NoiseLayer />
        </motion.div>
        
        {/* Drawer */}
        <motion.div
          key={segment.name}
          className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col"
          style={{
            borderRadius: TAHOE.drawer.radius,
            background: TAHOE.drawer.bg,
            backdropFilter: TAHOE.drawer.blur,
            WebkitBackdropFilter: TAHOE.drawer.blur,
            boxShadow: TAHOE.drawer.shadow
          }}
          initial={{ opacity: 0, scale: 0.97, y: 10, filter: 'blur(4px)' }}
          animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 0.97, y: 10, filter: 'blur(4px)' }}
          transition={{ duration: 0.28, ease: MOTION.ease }}
        >
          {/* Gradient border overlay */}
          <div 
            className="absolute inset-0 pointer-events-none rounded-[28px]"
            style={{
              background: TAHOE.drawer.border,
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
              padding: '1px'
            }}
          />
          
          {/* Glass highlight strip */}
          <GlassHighlight />
          
          <Header segment={segment} theme={theme} onClose={onClose} onNavigate={onNavigate} />
          
          <div 
            ref={scrollRef}
            className="overflow-y-auto flex-1 pb-8" 
            style={{ scrollBehavior: 'smooth' }}
          >
            <TLDRCard data={data} theme={theme} weight={weight} scrollY={scrollY} />
            <EvidenceStack data={data} theme={theme} />
            <WhatThisMeans data={data} theme={theme} scrollY={scrollY} />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}