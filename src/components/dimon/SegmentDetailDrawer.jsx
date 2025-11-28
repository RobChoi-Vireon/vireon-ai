// 🔒 DESIGN LOCKED — APPLE FULL GLASS UNIFICATION V1
// Single Glass Surface | Tahoe/VisionOS Aesthetic | Zero Visual Noise
// Last Updated: 2025-01-28

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Briefcase, BarChart3, Globe, Target, Waves, ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Clock } from 'lucide-react';

// ============================================================================
// MOTION CONFIG
// ============================================================================
const MOTION = {
  ease: [0.25, 0.1, 0.25, 1.0],
  duration: 0.22,
  stagger: 0.04
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
    insights: [
      { icon: Target, title: "Key Driver", text: "Regulators are getting tougher across content, privacy, and platform practices." },
      { icon: Waves, title: "Pressure Direction", text: "Rules are becoming stricter, making the environment harder for companies." },
      { icon: BarChart3, title: "Market Impact", text: "Moderate impact, with some industries beginning to feel more pressure." }
    ],
    summary: "Stricter regulation is creating steady pressure on the market. Big tech companies may face higher costs and slower stock price growth as oversight increases."
  },
  Credit: {
    tldr: "Borrowing is getting more expensive and harder to access, especially for weaker borrowers.",
    status: "Moderate", trend: "up", certainty: 68, horizon: "Medium-term",
    insights: [
      { icon: Target, title: "Key Driver", text: "Lenders are getting more cautious after early signs of stress in riskier debt." },
      { icon: Waves, title: "Pressure Direction", text: "Credit is tightening, making it tougher for companies and households to refinance." },
      { icon: BarChart3, title: "Market Impact", text: "Moderate impact, with highly indebted companies and lower-quality borrowers feeling it first." }
    ],
    summary: "Tighter credit conditions can slow growth and increase default risk. Companies that rely heavily on cheap borrowing may face higher costs and less flexibility."
  },
  Equities: {
    tldr: "Most stock gains are coming from a small group of big companies, not the whole market.",
    status: "Narrow", trend: "neutral", certainty: 75, horizon: "Near-term",
    insights: [
      { icon: Target, title: "Key Driver", text: "Investors are crowding into large, well-known names while smaller stocks lag behind." },
      { icon: Waves, title: "Pressure Direction", text: "Support for the market is narrowing, making it more vulnerable if leaders stumble." },
      { icon: BarChart3, title: "Market Impact", text: "Moderate impact, with the index looking strong on the surface but more fragile underneath." }
    ],
    summary: "A narrow group of winners can keep the market up, but it also raises concentration risk. If leadership cracks, the pullback can be sharper."
  },
  Global: {
    tldr: "Slower growth in key regions, especially China, is starting to weigh on the global outlook.",
    status: "Softening", trend: "down", certainty: 70, horizon: "Medium-term",
    insights: [
      { icon: Target, title: "Key Driver", text: "Weaker demand from China and softer data in other major economies are cooling trade." },
      { icon: Waves, title: "Pressure Direction", text: "Growth momentum is cooling instead of accelerating." },
      { icon: BarChart3, title: "Market Impact", text: "Moderate impact, with export-driven and commodity-linked areas feeling the slowdown more." }
    ],
    summary: "A cooling global economy can pressure earnings expectations. If the slowdown deepens, markets may price in weaker profits and fewer growth opportunities."
  }
}[name]);

// ============================================================================
// HEADER SECTION (Unified with Panel)
// ============================================================================
const HeaderSection = ({ segment, theme, onClose, onNavigate }) => {
  const { Icon } = theme;
  const [iconHovered, setIconHovered] = React.useState(false);
  
  return (
    <div className="px-10 pt-10 pb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{
              background: `rgba(${theme.rgb}, 0.08)`,
            }}
            animate={{ y: iconHovered ? -1 : 0 }}
            transition={{ duration: 0.16 }}
            onHoverStart={() => setIconHovered(true)}
            onHoverEnd={() => setIconHovered(false)}
          >
            <Icon className="w-5 h-5" style={{ color: theme.color }} strokeWidth={2} />
          </motion.div>
          <div>
            <h1 style={{ 
              fontSize: '26px', 
              fontWeight: 600, 
              color: 'rgba(255,255,255,0.94)', 
              letterSpacing: '-0.02em',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'
            }}>
              {segment.name}
            </h1>
            <p style={{ 
              fontSize: '14px', 
              fontWeight: 400, 
              color: 'rgba(255,255,255,0.55)', 
              marginTop: '2px',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
            }}>
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
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${ml ? 'ml-2' : ''}`}
              style={{ background: 'rgba(255,255,255,0.04)' }}
              whileHover={{ background: 'rgba(255,255,255,0.08)' }}
              whileTap={{ scale: 0.95 }}
            >
              <BtnIcon className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.55)' }} />
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// TL;DR INSET SECTION
// ============================================================================
const TLDRSection = ({ data, theme, weight }) => (
  <motion.div 
    className="mx-10 mb-8"
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.06, duration: MOTION.duration, ease: MOTION.ease }}
  >
    <div
      className="relative text-center"
      style={{
        padding: '28px 32px',
        background: 'rgba(255,255,255,0.018)',
        borderRadius: '20px',
        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.12)'
      }}
    >
      {/* Subtle breath animation overlay */}
      <motion.div
        className="absolute inset-0 rounded-[20px] pointer-events-none"
        style={{ background: 'rgba(255,255,255,0.01)' }}
        animate={{ opacity: [0.02, 0.035, 0.02] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      {/* TL;DR label */}
      <div 
        className="inline-block mb-4"
        style={{
          fontSize: '10px',
          fontWeight: 500,
          color: 'rgba(255,255,255,0.45)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase'
        }}
      >
        TL;DR
      </div>
      
      {/* Main text */}
      <p 
        style={{
          fontSize: '17px',
          fontWeight: 500,
          color: 'rgba(255,255,255,0.92)',
          lineHeight: 1.55,
          maxWidth: '480px',
          margin: '0 auto 18px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
        }}
      >
        {data.tldr}
      </p>
      
      {/* Tags */}
      <div className="flex items-center justify-center gap-2">
        <span 
          style={{
            fontSize: '11px',
            fontWeight: 500,
            color: theme.color,
            background: `rgba(${theme.rgb}, 0.08)`,
            padding: '5px 12px',
            borderRadius: '10px'
          }}
        >
          {data.status}
        </span>
        <span 
          style={{
            fontSize: '11px',
            fontWeight: 450,
            color: 'rgba(255,255,255,0.50)',
            background: 'rgba(255,255,255,0.03)',
            padding: '5px 12px',
            borderRadius: '10px'
          }}
        >
          {Math.round(weight)}% weight
        </span>
      </div>
    </div>
  </motion.div>
);

// ============================================================================
// INSIGHTS STACK (Three Rows with Separators)
// ============================================================================
const InsightRow = ({ item, theme, isLast, delay }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: MOTION.duration, ease: MOTION.ease }}
    >
      <motion.div
        className="flex items-start gap-4 px-10 py-5"
        animate={{ filter: isHovered ? 'brightness(1.02)' : 'brightness(1)' }}
        transition={{ duration: 0.14 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `rgba(${theme.rgb}, 0.06)` }}
        >
          <item.icon className="w-4 h-4" style={{ color: theme.color }} strokeWidth={2} />
        </div>
        
        <div className="flex-1 pt-0.5">
          <h4 
            style={{
              fontSize: '11px',
              fontWeight: 500,
              color: 'rgba(255,255,255,0.55)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: '6px'
            }}
          >
            {item.title}
          </h4>
          <p 
            style={{
              fontSize: '15px',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.82)',
              lineHeight: 1.55,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
            }}
          >
            {item.text}
          </p>
        </div>
      </motion.div>
      
      {/* Separator */}
      {!isLast && (
        <div 
          className="mx-10"
          style={{ 
            height: '1px', 
            background: 'rgba(255,255,255,0.06)'
          }} 
        />
      )}
    </motion.div>
  );
};

const InsightsStack = ({ data, theme }) => (
  <div className="mb-6">
    {data.insights.map((item, i) => (
      <InsightRow 
        key={item.title}
        item={item} 
        theme={theme}
        isLast={i === data.insights.length - 1}
        delay={0.10 + (i * MOTION.stagger)}
      />
    ))}
  </div>
);

// ============================================================================
// WHAT THIS MEANS INSET SECTION
// ============================================================================
const SummarySection = ({ data }) => (
  <motion.div 
    className="mx-10 mb-6"
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.24, duration: 0.22, ease: MOTION.ease }}
  >
    <div
      className="relative text-center"
      style={{
        padding: '28px 32px',
        background: 'rgba(255,255,255,0.015)',
        borderRadius: '20px',
        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.10)'
      }}
    >
      {/* Subtle breath animation */}
      <motion.div
        className="absolute inset-0 rounded-[20px] pointer-events-none"
        style={{ background: 'rgba(255,255,255,0.008)' }}
        animate={{ opacity: [0.02, 0.03, 0.02] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      <h3 
        style={{
          fontSize: '10px',
          fontWeight: 500,
          color: 'rgba(255,255,255,0.40)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: '12px'
        }}
      >
        What This Means
      </h3>
      
      <p 
        style={{
          fontSize: '16px',
          fontWeight: 400,
          color: 'rgba(255,255,255,0.85)',
          lineHeight: 1.60,
          maxWidth: '420px',
          margin: '0 auto',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
        }}
      >
        {data.summary}
      </p>
    </div>
  </motion.div>
);

// ============================================================================
// TAGS ROW (Integrated into Panel)
// ============================================================================
const TagsRow = ({ data, theme }) => {
  const TrendIcon = data.trend === 'up' ? TrendingUp : data.trend === 'down' ? TrendingDown : null;
  
  return (
    <motion.div
      className="flex justify-center gap-2 px-10 pb-10 pt-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.30, duration: MOTION.duration }}
    >
      {TrendIcon && (
        <div 
          className="flex items-center gap-1.5"
          style={{
            fontSize: '11px',
            fontWeight: 500,
            color: theme.color,
            background: `rgba(${theme.rgb}, 0.05)`,
            padding: '6px 12px',
            borderRadius: '10px'
          }}
        >
          <TrendIcon className="w-3 h-3" strokeWidth={2.5} />
          <span>{data.status}</span>
        </div>
      )}
      
      <div 
        style={{
          fontSize: '11px',
          fontWeight: 450,
          color: 'rgba(255,255,255,0.50)',
          background: 'rgba(255,255,255,0.025)',
          padding: '6px 12px',
          borderRadius: '10px'
        }}
      >
        {data.certainty}%
      </div>
      
      <div 
        className="flex items-center gap-1.5"
        style={{
          fontSize: '11px',
          fontWeight: 450,
          color: 'rgba(255,255,255,0.50)',
          background: 'rgba(255,255,255,0.025)',
          padding: '6px 12px',
          borderRadius: '10px'
        }}
      >
        <Clock className="w-3 h-3" strokeWidth={2.5} />
        <span>{data.horizon}</span>
      </div>
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
        className="fixed inset-0 z-[200] flex items-center justify-center p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.20 }}
        style={{ paddingTop: '90px' }}
      >
        {/* Soft Radial Backdrop (Not Pure Black) */}
        <motion.div 
          className="absolute inset-0"
          style={{ 
            top: '80px',
            background: `
              radial-gradient(ellipse at 50% 40%, rgba(18, 22, 32, 0.88) 0%, rgba(8, 10, 16, 0.96) 70%),
              linear-gradient(to bottom, rgba(12, 14, 22, 0.92) 0%, rgba(6, 8, 14, 0.98) 100%)
            `,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)'
          }}
          onClick={onClose}
        />
        
        {/* Single Unified Glass Panel */}
        <motion.div
          key={segment.name}
          className="relative w-full max-w-[640px] max-h-[82vh] overflow-hidden flex flex-col"
          style={{
            borderRadius: '40px',
            background: 'linear-gradient(180deg, rgba(22, 26, 38, 0.75) 0%, rgba(16, 20, 30, 0.80) 100%)',
            backdropFilter: 'blur(40px) saturate(140%)',
            WebkitBackdropFilter: 'blur(40px) saturate(140%)',
            border: `1px solid rgba(${theme.rgb}, 0.12)`,
            boxShadow: `
              0 0 0 0.5px rgba(255,255,255,0.04) inset,
              0 1px 0 rgba(255,255,255,0.03) inset,
              0 60px 120px -30px rgba(0,0,0,0.60)
            `
          }}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.22, ease: [0.16, 0.80, 0.33, 1] }}
        >
          {/* Content */}
          <div className="overflow-y-auto flex-1" style={{ scrollBehavior: 'smooth' }}>
            <HeaderSection segment={segment} theme={theme} onClose={onClose} onNavigate={onNavigate} />
            <TLDRSection data={data} theme={theme} weight={weight} />
            <InsightsStack data={data} theme={theme} />
            <SummarySection data={data} />
            <TagsRow data={data} theme={theme} />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}