import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, DollarSign, TrendingDown as ArrowDown } from 'lucide-react';

const HORIZON_EASE = [0.26, 0.11, 0.26, 1.0];
const HORIZON_SPRING = { type: "spring", stiffness: 280, damping: 30, mass: 1 };

// OS Horizon color system
const SEMANTIC_COLORS = {
  policy: 'rgba(110, 180, 255, 0.75)',
  cooling: 'rgba(122, 237, 207, 0.70)',
  sticky: 'rgba(255, 211, 122, 0.70)'
};

const InflationPressureCore = ({ gap, regime = 'sticky' }) => {
  const containerRef = useRef(null);
  const [breathPhase, setBreathPhase] = useState(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const parallaxX = useSpring(mouseX, HORIZON_SPRING);
  const parallaxY = useSpring(mouseY, HORIZON_SPRING);

  useEffect(() => {
    let rafId;
    let startTime = Date.now();
    
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const phase = (elapsed % 7) / 7; // 7 second breath cycle
      setBreathPhase(phase);
      rafId = requestAnimationFrame(animate);
    };
    
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) / 40;
    const deltaY = (e.clientY - centerY) / 40;
    mouseX.set(deltaX);
    mouseY.set(deltaY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const breathScale = 1 + Math.sin(breathPhase * Math.PI * 2) * 0.015;
  const breathGlow = 0.14 + Math.sin(breathPhase * Math.PI * 2) * 0.03;

  const regimeColor = regime === 'sticky' ? 'rgba(255, 211, 122, 0.70)' : 'rgba(122, 237, 207, 0.70)';
  const regimeGlow = regime === 'sticky' ? 'rgba(255, 211, 122, 0.25)' : 'rgba(122, 237, 207, 0.25)';

  return (
    <div 
      ref={containerRef}
      className="flex flex-col items-center justify-center relative" 
      style={{ height: '380px' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Ambient horizon bloom */}
      <motion.div 
        className="absolute pointer-events-none" 
        style={{
          width: '360px',
          height: '360px',
          background: `radial-gradient(ellipse at center, ${regimeGlow}, rgba(110, 180, 255, 0.06) 45%, transparent 75%)`,
          filter: 'blur(40px)',
          opacity: breathGlow
        }}
        animate={{ scale: breathScale }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      />
      
      {/* Liquid glass orb container */}
      <motion.div
        className="relative pointer-events-none"
        style={{
          x: parallaxX,
          y: parallaxY
        }}
      >
        {/* Outer ring (CPI - consumer inflation) */}
        <motion.div 
          className="absolute left-1/2 top-1/2" 
          style={{
            width: '240px',
            height: '240px',
            marginLeft: '-120px',
            marginTop: '-120px',
            borderRadius: '50%',
            border: '1.5px solid rgba(255,255,255,0.08)',
            background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 50%, transparent 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: 'inset 0 2px 12px rgba(0,0,0,0.15), 0 8px 32px rgba(0,0,0,0.20)'
          }}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: breathScale }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Glass refraction highlight */}
          <div style={{
            position: 'absolute',
            top: '12%',
            left: '18%',
            width: '35%',
            height: '35%',
            background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.18) 0%, transparent 60%)',
            borderRadius: '50%',
            filter: 'blur(8px)'
          }} />
        </motion.div>

        {/* Inner ring (PCE - policy inflation) */}
        <motion.div 
          className="absolute left-1/2 top-1/2" 
          style={{
            width: '160px',
            height: '160px',
            marginLeft: '-80px',
            marginTop: '-80px',
            borderRadius: '50%',
            border: '1.5px solid rgba(255,255,255,0.12)',
            background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 50%, transparent 100%)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            boxShadow: `inset 0 2px 16px rgba(0,0,0,0.20), 0 4px 24px ${regimeGlow}`
          }}
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: breathScale }}
          transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Inner glass highlight */}
          <div style={{
            position: 'absolute',
            top: '15%',
            left: '20%',
            width: '40%',
            height: '40%',
            background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.22) 0%, transparent 65%)',
            borderRadius: '50%',
            filter: 'blur(6px)'
          }} />
        </motion.div>

        {/* Core content */}
        <motion.div 
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="text-xs font-semibold mb-1" style={{ 
            color: 'rgba(255,255,255,0.60)', 
            letterSpacing: '0.08em',
            textTransform: 'uppercase'
          }}>
            Gap
          </div>
          <div className="text-5xl font-bold mb-2" style={{ 
            color: 'rgba(255,255,255,0.98)',
            textShadow: '0 2px 12px rgba(0,0,0,0.30)'
          }}>
            {gap}%
          </div>
          <motion.div 
            className="text-xs"
            style={{ 
              color: 'rgba(255,255,255,0.55)',
              maxWidth: '180px',
              lineHeight: '1.4'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.8 }}
          >
            Consumer inflation remains above policy comfort
          </motion.div>
        </motion.div>

        {/* Subtle connecting arc between rings */}
        <svg 
          className="absolute left-1/2 top-1/2 pointer-events-none"
          width="240" 
          height="240" 
          style={{ marginLeft: '-120px', marginTop: '-120px', opacity: 0.3 }}
        >
          <motion.circle
            cx="120"
            cy="120"
            r="100"
            fill="none"
            stroke={regimeColor}
            strokeWidth="0.5"
            strokeDasharray="4 4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.3 }}
            transition={{ duration: 1.2, delay: 0.6, ease: 'easeInOut' }}
          />
        </svg>
      </motion.div>
    </div>
  );
};

const MetricCard = ({ label, value, hover, delay }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative flex flex-col items-center justify-center rounded-2xl overflow-hidden"
      style={{
        padding: '20px 18px',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.038) 0%, rgba(255, 255, 255, 0.025) 100%)',
        backdropFilter: 'blur(20px) saturate(160%)',
        WebkitBackdropFilter: 'blur(20px) saturate(160%)',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: 'inset 0 0.5px 0 rgba(255,255,255,0.08), 0 2px 10px rgba(0,0,0,0.08)',
        cursor: 'default'
      }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{
        y: -1,
        boxShadow: 'inset 0 0.5px 0 rgba(255,255,255,0.08), 0 4px 18px rgba(0,0,0,0.12)',
        transition: { duration: 0.18, ease: 'easeOut' }
      }}
    >
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute top-2 left-0 right-0 text-center text-xs"
            style={{ color: 'rgba(110, 180, 255, 0.75)', fontWeight: 500 }}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
          >
            {hover}
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div 
        className="text-xs font-medium mb-2"
        style={{ color: 'rgba(255,255,255,0.52)', letterSpacing: '0.02em' }}
        animate={{ opacity: isHovered ? 0 : 1, y: isHovered ? 4 : 0 }}
        transition={{ duration: 0.18 }}
      >
        {label}
      </motion.div>
      <div className="text-2xl font-bold" style={{ color: 'rgba(255,255,255,0.96)' }}>
        {value}
      </div>
    </motion.div>
  );
};

const LearningColumn = ({ title, primary, secondary, watch }) => {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold mb-3" style={{ color: 'rgba(255,255,255,0.85)' }}>
        {title}
      </h4>
      <div className="space-y-2">
        <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.95)' }}>
          {primary}
        </p>
        <p className="text-sm leading-relaxed" style={{ color: 'rgba(170,185,205,0.70)' }}>
          {secondary}
        </p>
        {watch && (
          <p className="text-xs mt-3" style={{ color: 'rgba(140,160,185,0.55)' }}>
            {watch}
          </p>
        )}
      </div>
    </div>
  );
};

const TimeHorizon = ({ label, lines, arcProgress }) => {
  const arcLength = 100;
  const dashOffset = arcLength - (arcLength * arcProgress);
  
  return (
    <div className="relative">
      {/* Segmented progress arc */}
      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
        <svg width="60" height="30" viewBox="0 0 60 30" fill="none">
          <path
            d="M 10 25 Q 30 5, 50 25"
            stroke={SEMANTIC_COLORS.policy}
            strokeWidth="1.5"
            strokeDasharray="4 2"
            strokeDashoffset={dashOffset}
            opacity="0.35"
            fill="none"
          />
        </svg>
      </div>
      
      <div className="space-y-2 pt-2">
        <div className="text-xs font-semibold" style={{ color: SEMANTIC_COLORS.policy }}>
          {label}
        </div>
        {lines.map((line, idx) => (
          <p key={idx} className="text-sm leading-relaxed" style={{ 
            color: 'rgba(255,255,255,0.85)'
          }}>
            {line}
          </p>
        ))}
      </div>
    </div>
  );
};

const ConsequenceCard = ({ title, description, icon: Icon, tint }) => {
  return (
    <motion.div
      className="relative rounded-2xl overflow-hidden"
      style={{
        padding: '22px',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.040) 0%, rgba(255, 255, 255, 0.025) 100%)',
        backdropFilter: 'blur(24px) saturate(165%)',
        WebkitBackdropFilter: 'blur(24px) saturate(165%)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: 'inset 0 0.5px 0 rgba(255,255,255,0.10), 0 2px 14px rgba(0,0,0,0.10)',
        cursor: 'default'
      }}
      whileHover={{
        y: -1.5,
        boxShadow: 'inset 0 0.5px 0 rgba(255,255,255,0.10), 0 5px 22px rgba(0,0,0,0.14)',
        transition: { duration: 0.20, ease: 'easeOut' }
      }}
    >
      <div className="flex items-start gap-3 mb-2.5">
        {Icon && (
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ 
              background: `${tint}15`,
              border: `1px solid ${tint}25`
            }}
          >
            <Icon className="w-4 h-4" style={{ color: tint, opacity: 0.85 }} strokeWidth={2} />
          </div>
        )}
        <div className="flex-1">
          <h4 className="font-semibold text-sm mb-1.5" style={{ 
            color: 'rgba(255,255,255,0.96)',
            letterSpacing: '-0.005em'
          }}>
            {title}
          </h4>
          <p className="text-sm leading-relaxed" style={{ 
            color: 'rgba(180,195,215,0.78)',
            lineHeight: '1.5'
          }}>
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default function InflationSection({ data }) {
  const [activeTab, setActiveTab] = useState('meaning');
  
  if (!data) return null;

  const gap = Math.abs(data.cpi_core_yoy - data.pce_core_yoy).toFixed(1);

  return (
    <div 
      className="relative" 
      style={{
        background: 'linear-gradient(180deg, rgba(25,28,33,1) 0%, rgba(22,25,30,1) 100%)',
        padding: '56px 32px 80px 32px',
        borderRadius: '28px',
        marginBottom: '48px'
      }}
    >
      {/* Subtle vertical daylight gradient */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'linear-gradient(180deg, rgba(255,255,255,0.012) 0%, transparent 50%)',
        borderRadius: '28px'
      }} />
      
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'rgba(255,255,255,0.98)' }}>
          Inflation
        </h2>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
          CPI • PCE
        </p>
      </div>

      {/* Liquid Glass Hero */}
      <div className="flex justify-center mb-20">
        <InflationPressureCore gap={gap} regime="sticky" />
      </div>

      {/* Supporting Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
        {[
          { label: 'CPI', value: `${data.cpi_headline_yoy}%`, hover: 'What households feel' },
          { label: 'Core CPI', value: `${data.cpi_core_yoy}%`, hover: 'Excluding food & energy' },
          { label: 'PCE', value: `${data.pce_headline_yoy}%`, hover: 'What policy tracks' },
          { label: 'Core PCE', value: `${data.pce_core_yoy}%`, hover: 'Fed\'s preferred gauge' }
        ].map((kpi, idx) => (
          <MetricCard key={idx} {...kpi} delay={0.1 + (idx * 0.05)} />
        ))}
      </div>

      {/* Intelligence Summary Panel */}
      <motion.div
        className="relative rounded-2xl overflow-hidden mb-14 max-w-3xl mx-auto"
        style={{
          padding: '28px 32px',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.045) 0%, rgba(255, 255, 255, 0.028) 100%)',
          backdropFilter: 'blur(24px) saturate(165%)',
          WebkitBackdropFilter: 'blur(24px) saturate(165%)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10), 0 8px 32px rgba(0,0,0,0.12)'
        }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Top glass highlight */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '20%',
          right: '20%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.20), transparent)'
        }} />

        <h3 className="text-lg font-semibold mb-3" style={{ 
          color: 'rgba(255,255,255,0.98)',
          letterSpacing: '-0.01em'
        }}>
          Inflation — Sticky
        </h3>
        <p className="text-sm leading-relaxed" style={{ 
          color: 'rgba(200,210,225,0.85)',
          lineHeight: '1.65'
        }}>
          Consumer prices remain elevated even as policy inflation cools. The gap explains why inflation still feels high despite easing data.
        </p>
      </motion.div>

      {/* Pill-Style Intelligence Navigation */}
      <div className="flex justify-center gap-3 mb-12">
        {[
          { id: 'meaning', label: 'What This Means' },
          { id: 'evolves', label: 'How This Evolves' },
          { id: 'leads', label: 'What This Leads To' }
        ].map((mode) => (
          <motion.button
            key={mode.id}
            onClick={() => setActiveTab(mode.id)}
            className="relative px-5 py-2.5 rounded-full text-sm font-medium"
            style={{
              background: activeTab === mode.id 
                ? 'linear-gradient(135deg, rgba(110, 180, 255, 0.18) 0%, rgba(110, 180, 255, 0.12) 100%)'
                : 'rgba(255,255,255,0.04)',
              border: `1px solid ${activeTab === mode.id ? 'rgba(110, 180, 255, 0.25)' : 'rgba(255,255,255,0.06)'}`,
              color: activeTab === mode.id ? 'rgba(200,220,255,0.98)' : 'rgba(255,255,255,0.60)',
              boxShadow: activeTab === mode.id 
                ? 'inset 0 1px 0 rgba(255,255,255,0.12), 0 4px 16px rgba(110, 180, 255, 0.15)'
                : 'none'
            }}
            whileHover={{
              background: activeTab === mode.id 
                ? 'linear-gradient(135deg, rgba(110, 180, 255, 0.22) 0%, rgba(110, 180, 255, 0.16) 100%)'
                : 'rgba(255,255,255,0.06)',
              transition: { duration: 0.18, ease: 'easeOut' }
            }}
            whileTap={{ scale: 0.97 }}
          >
            {activeTab === mode.id && (
              <motion.div
                layoutId="activePill"
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(110, 180, 255, 0.08) 0%, transparent 70%)',
                  zIndex: -1
                }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              />
            )}
            {mode.label}
          </motion.button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'meaning' && (
          <motion.div
            key="meaning"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <LearningColumn
              title="CPI"
              primary="Everyday costs still feel high."
              secondary="Because rent and services change slowly."
              watch="Watch: rent and services."
            />
            <LearningColumn
              title="PCE"
              primary="People switch what they buy, so prices rise less."
              secondary="Because people switch what they buy when prices rise."
              watch="Watch: spending pullback."
            />
            <LearningColumn
              title="Meaning"
              primary="Rate decisions follow spending, not frustration."
              secondary="Because inflation is tracked by what people keep buying."
              watch="Watch: rate-cut timing."
            />
          </motion.div>
        )}

        {activeTab === 'evolves' && (
          <motion.div
            key="evolves"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <TimeHorizon
              label="Now"
              lines={[
                "Prices stay stubborn in services.",
                "Because rent and wages take time to cool."
              ]}
              arcProgress={0.25}
            />
            <TimeHorizon
              label="Near Term (~3m)"
              lines={[
                "Goods prices cool faster than services.",
                "Because supply improves sooner than wages."
              ]}
              arcProgress={0.45}
            />
            <TimeHorizon
              label="Medium Term (~6m)"
              lines={[
                "Services cool, but not evenly.",
                "Because wage pressure fades gradually."
              ]}
              arcProgress={0.65}
            />
            <TimeHorizon
              label="Confirmation (~12m)"
              lines={[
                "Inflation moves closer to normal.",
                "Because slower demand finally shows up in prices."
              ]}
              arcProgress={0.85}
            />
          </motion.div>
        )}

        {activeTab === 'leads' && (
          <motion.div
            key="leads"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <ConsequenceCard
              title="Rates — Stay higher, longer"
              description="Borrowing costs remain elevated as inflation persists."
              icon={TrendingUp}
              tint="rgba(255, 180, 120, 0.85)"
            />
            <ConsequenceCard
              title="Stocks — Valuations remain compressed"
              description="Higher discount rates weigh on future earnings multiples."
              icon={ArrowDown}
              tint="rgba(180, 140, 255, 0.75)"
            />
            <ConsequenceCard
              title="Dollar — Stays supported"
              description="Rate differentials keep the dollar elevated against peers."
              icon={DollarSign}
              tint="rgba(110, 200, 180, 0.80)"
            />
            <ConsequenceCard
              title="Credit — Conditions remain tight"
              description="Lenders maintain caution until inflation clarity emerges."
              icon={Minus}
              tint="rgba(200, 200, 210, 0.65)"
            />
            <ConsequenceCard
              title="Risk — Path remains uneven"
              description="Volatility persists as policy uncertainty lingers."
              icon={TrendingDown}
              tint="rgba(255, 160, 140, 0.75)"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced transition zone - dissolve into background */}
      <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none" style={{
        background: 'linear-gradient(180deg, transparent 0%, rgba(16,18,22,0.6) 50%, rgba(13,15,19,0.9) 85%, rgba(11,14,19,1) 100%)',
        borderRadius: '0 0 28px 28px'
      }} />
      
      {/* Quiet light diffusion at transition */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-20 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at center top, rgba(255,255,255,0.008) 0%, transparent 70%)',
        filter: 'blur(20px)'
      }} />
    </div>
  );
}