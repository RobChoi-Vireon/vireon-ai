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
// OS HORIZON LIQUID GLASS SYSTEM — TAHOE ULTRA
// ============================================================================
const GLASS = {
  canvas: {
    gradient: 'linear-gradient(180deg, #040810 0%, #071018 50%, #050912 100%)',
    bokeh: [
      { x: '18%', y: '22%', color: 'rgba(35, 55, 110, 0.055)', size: '380px' },
      { x: '78%', y: '30%', color: 'rgba(60, 45, 120, 0.045)', size: '300px' },
      { x: '55%', y: '68%', color: 'rgba(45, 60, 130, 0.05)', size: '340px' },
      { x: '85%', y: '75%', color: 'rgba(70, 55, 140, 0.04)', size: '260px' }
    ]
  },
  drawer: {
    bg: 'rgba(12, 18, 32, 0.72)',
    blur: 'blur(80px) saturate(180%)',
    radius: '40px',
    border: 'linear-gradient(135deg, rgba(255,255,255,0.28) 0%, rgba(140,180,255,0.12) 50%, rgba(255,255,255,0.08) 100%)',
    innerGlow: '0 0 100px rgba(255,255,255,0.04)',
    innerShadow: 'inset 0 0 60px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.12)'
  },
  header: {
    bg: 'rgba(20, 28, 48, 0.55)',
    blur: 'blur(60px) saturate(170%)',
    highlight: 'linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.22) 50%, transparent 95%)'
  },
  hero: {
    bg: 'rgba(24, 36, 60, 0.50)',
    blur: 'blur(60px) saturate(160%)',
    radius: '32px',
    border: '1px solid rgba(255,255,255,0.10)',
    innerGlow: 'inset 0 0 50px rgba(255,255,255,0.03), inset 0 1px 0 rgba(255,255,255,0.10)'
  },
  card: {
    bg: 'rgba(18, 26, 46, 0.48)',
    blur: 'blur(50px) saturate(165%)',
    radius: '28px',
    border: '1px solid rgba(255,255,255,0.08)',
    innerGlow: 'inset 0 0 40px rgba(255,255,255,0.025), inset 0 1px 0 rgba(255,255,255,0.08)'
  },
  chip: {
    bg: 'rgba(255, 255, 255, 0.06)',
    border: 'rgba(255, 255, 255, 0.20)',
    blur: 'blur(40px) saturate(160%)',
    innerShadow: 'inset 0 0 20px rgba(255,255,255,0.12), inset 0 1px 0 rgba(255,255,255,0.15)',
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
      className="flex items-center relative overflow-hidden"
      style={{
        padding: '10px 18px',
        fontSize: '13px',
        fontWeight: 550,
        letterSpacing: '0.01em',
        color: 'rgba(235, 240, 255, 0.92)',
        background: isActive 
          ? `linear-gradient(135deg, rgba(${theme.rgb}, 0.18) 0%, rgba(${theme.rgb}, 0.08) 100%)`
          : 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)',
        backdropFilter: GLASS.chip.blur,
        WebkitBackdropFilter: GLASS.chip.blur,
        border: `1px solid ${isActive ? `rgba(${theme.rgb}, 0.35)` : GLASS.chip.border}`,
        borderRadius: GLASS.chip.radius,
        boxShadow: isActive 
          ? `${GLASS.chip.innerShadow}, 0 0 25px rgba(${theme.rgb}, 0.15)`
          : GLASS.chip.innerShadow
      }}
      animate={{
        scale: isHovered ? 1.04 : 1,
        y: isHovered ? -1 : 0,
        boxShadow: isHovered 
          ? `${GLASS.chip.innerShadow}, 0 8px 32px rgba(0,0,0,0.25), 0 0 30px rgba(${theme.rgb}, 0.20)` 
          : isActive 
            ? `${GLASS.chip.innerShadow}, 0 0 25px rgba(${theme.rgb}, 0.15)`
            : GLASS.chip.innerShadow
      }}
      transition={{ duration: 0.18, ease: [0.22, 0.61, 0.36, 1] }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Top specular edge */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '15%',
        right: '15%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)',
        pointerEvents: 'none'
      }} />
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
      className="w-10 h-10 rounded-full flex items-center justify-center relative overflow-hidden"
      style={{ 
        background: 'linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.05) 100%)',
        backdropFilter: 'blur(30px) saturate(160%)',
        WebkitBackdropFilter: 'blur(30px) saturate(160%)',
        border: '1px solid rgba(255,255,255,0.12)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), inset 0 0 20px rgba(255,255,255,0.04)'
      }}
      animate={{
        scale: isHovered ? 1.08 : 1,
        background: isHovered 
          ? 'linear-gradient(135deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.08) 100%)' 
          : 'linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.05) 100%)',
        boxShadow: isHovered 
          ? 'inset 0 1px 0 rgba(255,255,255,0.18), inset 0 0 20px rgba(255,255,255,0.06), 0 8px 32px rgba(0,0,0,0.20), 0 0 20px rgba(150, 180, 255, 0.15)' 
          : 'inset 0 1px 0 rgba(255,255,255,0.12), inset 0 0 20px rgba(255,255,255,0.04)'
      }}
      transition={{ duration: 0.18, ease: [0.22, 0.61, 0.36, 1] }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileTap={{ scale: 0.92 }}
    >
      {/* Top specular */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '20%',
        right: '20%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)',
        pointerEvents: 'none'
      }} />
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
      className="relative overflow-hidden"
      style={{
        padding: '28px 36px 24px',
        background: GLASS.header.bg,
        backdropFilter: GLASS.header.blur,
        WebkitBackdropFilter: GLASS.header.blur,
        borderBottom: '1px solid rgba(255,255,255,0.06)'
      }}
    >
      {/* Specular highlight band */}
      <div 
        className="absolute top-0 left-0 right-0 h-[2px] pointer-events-none"
        style={{ 
          background: GLASS.header.highlight,
          borderRadius: '40px 40px 0 0'
        }}
      />
      
      {/* Ambient theme glow */}
      <div style={{
        position: 'absolute',
        top: '-20px',
        left: '10%',
        width: '80%',
        height: '80px',
        background: `radial-gradient(ellipse at 50% 100%, rgba(${theme.rgb}, 0.10) 0%, transparent 70%)`,
        pointerEvents: 'none'
      }} />
      
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-5">
          <motion.div 
            className="w-14 h-14 rounded-2xl flex items-center justify-center relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, rgba(${theme.rgb}, 0.20) 0%, rgba(255,255,255,0.06) 100%)`,
              backdropFilter: 'blur(28px) saturate(160%)',
              WebkitBackdropFilter: 'blur(28px) saturate(160%)',
              border: `1px solid rgba(${theme.rgb}, 0.25)`,
              boxShadow: `inset 0 1px 0 rgba(255,255,255,0.15), inset 0 0 24px rgba(${theme.rgb}, 0.10)`
            }}
            animate={{
              boxShadow: iconHovered 
                ? `0 0 35px rgba(${theme.rgb}, 0.35), inset 0 1px 0 rgba(255,255,255,0.18), inset 0 0 24px rgba(${theme.rgb}, 0.15)`
                : `inset 0 1px 0 rgba(255,255,255,0.15), inset 0 0 24px rgba(${theme.rgb}, 0.10)`,
              scale: iconHovered ? 1.05 : 1
            }}
            transition={{ duration: 0.20 }}
            onHoverStart={() => setIconHovered(true)}
            onHoverEnd={() => setIconHovered(false)}
          >
            {/* Icon specular */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: '15%',
              right: '15%',
              height: '1px',
              background: `linear-gradient(90deg, transparent, rgba(${theme.rgb}, 0.35), transparent)`,
              pointerEvents: 'none'
            }} />
            <Icon className="w-6 h-6 relative z-10" style={{ color: theme.color, filter: `drop-shadow(0 0 10px rgba(${theme.rgb}, 0.50))` }} strokeWidth={1.8} />
          </motion.div>
          <div>
            <h1 style={{ 
              fontSize: '18px', 
              fontWeight: 650, 
              color: 'rgba(255,255,255,0.96)', 
              letterSpacing: '-0.015em',
              textShadow: '0 2px 20px rgba(0,0,0,0.30)'
            }}>
              {segment.name}
            </h1>
            <p style={{ 
              fontSize: '13px', 
              fontWeight: 450, 
              color: 'rgba(200,210,235,0.70)', 
              marginTop: '4px',
              letterSpacing: '0.01em'
            }}>
              Market Pressure Analysis
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <NavButton onClick={() => onNavigate('prev')}>
            <ChevronLeft className="w-4.5 h-4.5" style={{ color: 'rgba(255,255,255,0.78)' }} strokeWidth={2} />
          </NavButton>
          <NavButton onClick={() => onNavigate('next')}>
            <ChevronRight className="w-4.5 h-4.5" style={{ color: 'rgba(255,255,255,0.78)' }} strokeWidth={2} />
          </NavButton>
          <NavButton onClick={onClose}>
            <X className="w-4.5 h-4.5" style={{ color: 'rgba(255,255,255,0.78)' }} strokeWidth={2} />
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
      className="mx-8 mt-8"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08, duration: 0.45, ease: MOTION.ease }}
    >
      <motion.div
        className="relative overflow-hidden"
        style={{
          padding: '32px 38px',
          background: `linear-gradient(145deg, rgba(${theme.rgb}, 0.12) 0%, ${GLASS.hero.bg} 40%, rgba(20, 30, 55, 0.45) 100%)`,
          backdropFilter: GLASS.hero.blur,
          WebkitBackdropFilter: GLASS.hero.blur,
          borderRadius: GLASS.hero.radius,
          border: GLASS.hero.border,
          boxShadow: `${GLASS.hero.innerGlow}, 0 20px 60px -20px rgba(0,0,0,0.40)`
        }}
        animate={{
          y: isHovered ? -3 : 0,
          boxShadow: isHovered 
            ? `${GLASS.hero.innerGlow}, 0 25px 70px -20px rgba(0,0,0,0.50), 0 0 40px rgba(${theme.rgb}, 0.10)`
            : `${GLASS.hero.innerGlow}, 0 20px 60px -20px rgba(0,0,0,0.40)`
        }}
        transition={{ duration: 0.22, ease: [0.22, 0.61, 0.36, 1] }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Top specular edge */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '10%',
          right: '10%',
          height: '1.5px',
          background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.20), rgba(${theme.rgb}, 0.25), rgba(255,255,255,0.20), transparent)`,
          pointerEvents: 'none'
        }} />
        
        {/* Ambient theme glow */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          left: '20%',
          width: '60%',
          height: '100%',
          background: `radial-gradient(ellipse at 50% 100%, rgba(${theme.rgb}, 0.08) 0%, transparent 70%)`,
          pointerEvents: 'none'
        }} />
        
        {/* Label */}
        <div style={{
          fontSize: '11px',
          fontWeight: 700,
          color: theme.color,
          letterSpacing: '0.20em',
          textTransform: 'uppercase',
          marginBottom: '16px',
          textShadow: `0 0 20px rgba(${theme.rgb}, 0.40)`
        }}>
          TL;DR
        </div>
        
        {/* Headline */}
        <p style={{
          fontSize: '22px',
          fontWeight: 520,
          color: 'rgba(255,255,255,0.96)',
          lineHeight: 1.55,
          marginBottom: '28px',
          textShadow: '0 2px 20px rgba(0,0,0,0.30)'
        }}>
          {data.tldr}
        </p>
        
        {/* Chips */}
        <div className="flex items-center justify-end gap-3">
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
      initial={{ opacity: 0, y: 14, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.40, ease: MOTION.ease }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="relative overflow-hidden"
        style={{
          padding: '26px 30px',
          background: GLASS.card.bg,
          backdropFilter: GLASS.card.blur,
          WebkitBackdropFilter: GLASS.card.blur,
          borderRadius: GLASS.card.radius,
          border: GLASS.card.border,
          boxShadow: `${GLASS.card.innerGlow}, 0 12px 40px -15px rgba(0,0,0,0.30)`
        }}
        animate={{
          y: isHovered ? -2 : 0,
          boxShadow: isHovered 
            ? `${GLASS.card.innerGlow}, 0 18px 50px -15px rgba(0,0,0,0.40), 0 0 30px rgba(${theme.rgb}, 0.06)`
            : `${GLASS.card.innerGlow}, 0 12px 40px -15px rgba(0,0,0,0.30)`
        }}
        transition={{ duration: 0.20, ease: [0.22, 0.61, 0.36, 1] }}
      >
        {/* Top specular edge */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '12%',
          right: '12%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
          pointerEvents: 'none'
        }} />
        
        <div className="flex items-start gap-5">
          <motion.div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, rgba(${theme.rgb}, 0.15) 0%, rgba(255,255,255,0.06) 100%)`,
              backdropFilter: 'blur(24px) saturate(150%)',
              WebkitBackdropFilter: 'blur(24px) saturate(150%)',
              border: `1px solid rgba(${theme.rgb}, 0.20)`,
              boxShadow: `inset 0 1px 0 rgba(255,255,255,0.12), inset 0 0 20px rgba(${theme.rgb}, 0.08)`
            }}
            animate={{
              boxShadow: iconHovered 
                ? `0 0 28px rgba(${theme.rgb}, 0.30), inset 0 1px 0 rgba(255,255,255,0.15), inset 0 0 20px rgba(${theme.rgb}, 0.12)`
                : `inset 0 1px 0 rgba(255,255,255,0.12), inset 0 0 20px rgba(${theme.rgb}, 0.08)`,
              scale: iconHovered ? 1.05 : 1
            }}
            transition={{ duration: 0.18 }}
            onHoverStart={() => setIconHovered(true)}
            onHoverEnd={() => setIconHovered(false)}
          >
            {/* Icon specular */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: '20%',
              right: '20%',
              height: '1px',
              background: `linear-gradient(90deg, transparent, rgba(${theme.rgb}, 0.30), transparent)`,
              pointerEvents: 'none'
            }} />
            <item.icon className="w-5 h-5 relative z-10" style={{ color: theme.color, filter: `drop-shadow(0 0 8px rgba(${theme.rgb}, 0.40))` }} strokeWidth={1.8} />
          </motion.div>
          <div className="flex-1 pt-1">
            <h4 style={{
              fontSize: '15px',
              fontWeight: 620,
              color: 'rgba(255,255,255,0.94)',
              marginBottom: '8px',
              letterSpacing: '-0.01em'
            }}>
              {item.title}
            </h4>
            <p style={{
              fontSize: '14px',
              fontWeight: 420,
              color: 'rgba(210,220,255,0.80)',
              lineHeight: 1.62
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
  <div className="mx-8 mt-8 flex flex-col" style={{ gap: '20px' }}>
    {data.evidence.map((item, i) => (
      <InfoCard 
        key={item.title} 
        item={item} 
        theme={theme} 
        delay={0.14 + (i * 0.06)} 
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
      className="mx-8 mt-10 mb-4"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.32, duration: 0.45, ease: MOTION.ease }}
    >
      <motion.div
        className="relative overflow-hidden"
        style={{
          padding: '32px 38px',
          background: `linear-gradient(160deg, ${GLASS.hero.bg} 0%, rgba(16, 24, 44, 0.50) 50%, rgba(${theme.rgb}, 0.06) 100%)`,
          backdropFilter: GLASS.hero.blur,
          WebkitBackdropFilter: GLASS.hero.blur,
          borderRadius: GLASS.hero.radius,
          border: GLASS.hero.border,
          boxShadow: `${GLASS.hero.innerGlow}, 0 20px 60px -20px rgba(0,0,0,0.40)`
        }}
        animate={{
          y: isHovered ? -3 : 0,
          boxShadow: isHovered 
            ? `${GLASS.hero.innerGlow}, 0 25px 70px -20px rgba(0,0,0,0.50), 0 0 40px rgba(${theme.rgb}, 0.08)`
            : `${GLASS.hero.innerGlow}, 0 20px 60px -20px rgba(0,0,0,0.40)`
        }}
        transition={{ duration: 0.22, ease: [0.22, 0.61, 0.36, 1] }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Top specular edge */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '10%',
          right: '10%',
          height: '1.5px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)',
          pointerEvents: 'none'
        }} />
        
        {/* Bottom ambient glow */}
        <div style={{
          position: 'absolute',
          bottom: '-30%',
          left: '10%',
          width: '80%',
          height: '60%',
          background: `radial-gradient(ellipse at 50% 0%, rgba(${theme.rgb}, 0.06) 0%, transparent 70%)`,
          pointerEvents: 'none'
        }} />
        
        <div style={{
          fontSize: '11px',
          fontWeight: 700,
          color: 'rgba(255,255,255,0.55)',
          letterSpacing: '0.20em',
          textTransform: 'uppercase',
          marginBottom: '16px'
        }}>
          What This Means
        </div>
        
        <p style={{
          fontSize: '16px',
          fontWeight: 440,
          color: 'rgba(235,240,255,0.94)',
          lineHeight: 1.75,
          textShadow: '0 2px 20px rgba(0,0,0,0.25)'
        }}>
          {data.summary}
        </p>
      </motion.div>
      
      {/* Bottom chips — 20px below card */}
      <div className="flex justify-center gap-3" style={{ marginTop: '20px' }}>
        <GlassChip isActive theme={theme}>
          {data.trend === 'up' && <TrendingUp className="w-3.5 h-3.5 mr-1.5" strokeWidth={2.2} />}
          {data.trend === 'down' && <TrendingDown className="w-3.5 h-3.5 mr-1.5" strokeWidth={2.2} />}
          {data.status}
        </GlassChip>
        <GlassChip theme={theme}>{data.certainty}% confidence</GlassChip>
        <GlassChip theme={theme}>
          <Clock className="w-3.5 h-3.5 mr-1.5" strokeWidth={2} />
          {data.horizon}
        </GlassChip>
      </div>
    </motion.div>
  );
};

// ============================================================================
// ATMOSPHERIC ENVIRONMENT — OS HORIZON LIQUID GLASS FIELD
// ============================================================================
const GlassFieldEnvironment = ({ mouseOffset }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Base Canvas Gradient — ultra smooth */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #050914 0%, #080F1F 45%, #050910 100%)'
        }}
      />
      
      {/* Noise Layer — 1.5% to prevent banding */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.80' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          opacity: 0.015,
          mixBlendMode: 'overlay'
        }}
      />
      
      {/* Bokeh Blooms — asymmetric, desaturated, extremely subtle */}
      <motion.div 
        className="absolute inset-0"
        animate={{
          x: mouseOffset ? -mouseOffset.x * 0.015 : 0,
          y: mouseOffset ? -mouseOffset.y * 0.015 : 0
        }}
        transition={{ type: 'spring', stiffness: 50, damping: 30 }}
      >
        {/* Bokeh 1 — upper left */}
        <div
          className="absolute rounded-full"
          style={{
            left: '15%',
            top: '18%',
            width: '420px',
            height: '420px',
            background: 'radial-gradient(circle, rgba(32, 48, 92, 0.055) 0%, transparent 70%)',
            filter: 'blur(90px)'
          }}
        />
        {/* Bokeh 2 — lower right */}
        <div
          className="absolute rounded-full"
          style={{
            right: '12%',
            bottom: '22%',
            width: '380px',
            height: '380px',
            background: 'radial-gradient(circle, rgba(53, 42, 95, 0.045) 0%, transparent 70%)',
            filter: 'blur(100px)'
          }}
        />
        {/* Bokeh 3 — center-right subtle */}
        <div
          className="absolute rounded-full"
          style={{
            right: '25%',
            top: '40%',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(40, 55, 100, 0.04) 0%, transparent 65%)',
            filter: 'blur(80px)'
          }}
        />
      </motion.div>
      
      {/* Vignette — dark corners, light center */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 85% 75% at 50% 50%, transparent 40%, rgba(3, 5, 12, 0.45) 100%)'
        }}
      />
    </div>
  );
};

// ============================================================================
// VOLUMETRIC LIGHT HALO — behind drawer
// ============================================================================
const VolumetricHalo = ({ mouseOffset }) => (
  <motion.div 
    className="absolute inset-0 pointer-events-none flex items-center justify-center"
    animate={{
      x: mouseOffset ? -mouseOffset.x * 0.008 : 0,
      y: mouseOffset ? -mouseOffset.y * 0.008 : 0
    }}
    transition={{ type: 'spring', stiffness: 40, damping: 25 }}
  >
    {/* Outer glow — large radius, very soft */}
    <div
      className="absolute"
      style={{
        width: '900px',
        height: '750px',
        background: 'radial-gradient(ellipse 100% 100% at 50% 48%, rgba(27, 52, 92, 0.18) 0%, rgba(27, 52, 92, 0.08) 35%, transparent 70%)',
        filter: 'blur(100px)'
      }}
    />
    
    {/* Inner glow — tighter to drawer */}
    <div
      className="absolute"
      style={{
        width: '700px',
        height: '600px',
        background: 'radial-gradient(ellipse 100% 100% at 50% 45%, rgba(45, 75, 130, 0.12) 0%, rgba(35, 60, 110, 0.05) 40%, transparent 65%)',
        filter: 'blur(50px)'
      }}
    />
    
    {/* Vertical gradient — lighter top, darker bottom */}
    <div
      className="absolute"
      style={{
        width: '680px',
        height: '700px',
        background: 'linear-gradient(180deg, rgba(60, 90, 150, 0.06) 0%, transparent 40%, rgba(5, 8, 18, 0.08) 100%)',
        filter: 'blur(40px)'
      }}
    />
    
    {/* Depth haze — subtle bluish fog */}
    <div
      className="absolute"
      style={{
        width: '660px',
        height: '580px',
        background: 'radial-gradient(ellipse 90% 85% at 50% 50%, rgba(50, 80, 140, 0.045) 0%, transparent 60%)',
        filter: 'blur(35px)'
      }}
    />
  </motion.div>
);

// ============================================================================
// MAIN DRAWER
// ============================================================================
export default function SegmentDetailDrawer({ isOpen, onClose, segment, onNavigate }) {
  const scrollRef = useRef(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKey = (e) => e.key === 'Escape' && onClose?.();
      document.addEventListener('keydown', handleKey);
      
      // Mouse parallax handler
      const handleMouseMove = (e) => {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        setMouseOffset({
          x: (e.clientX - centerX) / centerX,
          y: (e.clientY - centerY) / centerY
        });
      };
      window.addEventListener('mousemove', handleMouseMove);
      
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleKey);
        window.removeEventListener('mousemove', handleMouseMove);
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
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 pt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.28 }}
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
        
        {/* Liquid Glass Field Environment */}
        <div 
          className="absolute inset-0"
          onClick={onClose}
        >
          <GlassFieldEnvironment mouseOffset={mouseOffset} />
        </div>
        
        {/* Volumetric Light Halo — behind drawer */}
        <VolumetricHalo mouseOffset={mouseOffset} />
        
        {/* Drawer */}
        <motion.div
          key={segment.name}
          className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col"
          style={{
            borderRadius: GLASS.drawer.radius,
            background: GLASS.drawer.bg,
            backdropFilter: GLASS.drawer.blur,
            WebkitBackdropFilter: GLASS.drawer.blur,
            boxShadow: `
              ${GLASS.drawer.innerGlow}, 
              ${GLASS.drawer.innerShadow}, 
              0 40px 80px -20px rgba(0,0,0,0.60),
              0 0 120px rgba(92, 155, 255, 0.10),
              0 0 60px rgba(130, 100, 200, 0.06)
            `
          }}
          initial={{ opacity: 0, scale: 0.94, y: 20, filter: 'blur(12px)' }}
          animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 0.96, y: 12, filter: 'blur(8px)' }}
          transition={{ duration: 0.38, ease: MOTION.ease }}
        >
          {/* Gradient border — enhanced */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              borderRadius: GLASS.drawer.radius,
              background: GLASS.drawer.border,
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
              padding: '1.5px'
            }}
          />
          
          {/* Outer luminous ring */}
          <div 
            className="absolute -inset-[1px] pointer-events-none"
            style={{
              borderRadius: GLASS.drawer.radius,
              background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.04) 100%)',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
              padding: '1px',
              filter: 'blur(0.5px)'
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