import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, DollarSign } from 'lucide-react';

const HORIZON_EASE = [0.26, 0.11, 0.26, 1.0];
const HORIZON_SPRING = { type: "spring", stiffness: 280, damping: 30, mass: 1 };

// OS Horizon System Colors
const SEMANTIC_COLORS = {
  policy: 'rgba(110, 180, 255, 0.85)',
  cooling: 'rgba(122, 237, 207, 0.70)',
  sticky: 'rgba(255, 211, 122, 0.70)'
};

const InflationHeroOrb = ({ gap }) => {
  const containerRef = useRef(null);
  const [breathPhase, setBreathPhase] = useState(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const parallaxX = useSpring(mouseX, { stiffness: 150, damping: 25 });
  const parallaxY = useSpring(mouseY, { stiffness: 150, damping: 25 });

  useEffect(() => {
    let rafId;
    let startTime = Date.now();
    
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const phase = (elapsed % 7) / 7;
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
    const deltaX = (e.clientX - centerX) / 50;
    const deltaY = (e.clientY - centerY) / 50;
    mouseX.set(deltaX);
    mouseY.set(deltaY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const breathScale = 1 + Math.sin(breathPhase * Math.PI * 2) * 0.012;
  const breathGlow = 0.16 + Math.sin(breathPhase * Math.PI * 2) * 0.04;

  return (
    <div 
      ref={containerRef}
      className="flex items-center justify-center relative" 
      style={{ height: '340px', width: '100%' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Ambient glow */}
      <motion.div 
        className="absolute pointer-events-none" 
        style={{
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle at center, rgba(110, 180, 255, 0.12) 0%, rgba(110, 180, 255, 0.04) 50%, transparent 75%)',
          filter: 'blur(50px)',
          opacity: breathGlow
        }}
        animate={{ scale: breathScale }}
        transition={{ duration: 1, ease: 'easeInOut' }}
      />
      
      {/* Orb system with parallax */}
      <motion.div
        className="relative"
        style={{
          x: parallaxX,
          y: parallaxY
        }}
      >
        {/* Outer ring */}
        <motion.div 
          style={{
            width: '280px',
            height: '280px',
            borderRadius: '50%',
            border: '1px solid rgba(110, 180, 255, 0.15)',
            position: 'absolute',
            left: '50%',
            top: '50%',
            marginLeft: '-140px',
            marginTop: '-140px'
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 0.4, scale: breathScale * 0.998 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        />

        {/* Middle ring */}
        <motion.div 
          style={{
            width: '220px',
            height: '220px',
            borderRadius: '50%',
            border: '1px solid rgba(110, 180, 255, 0.20)',
            position: 'absolute',
            left: '50%',
            top: '50%',
            marginLeft: '-110px',
            marginTop: '-110px'
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 0.5, scale: breathScale * 0.999 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />

        {/* Inner core orb */}
        <motion.div 
          style={{
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, rgba(30, 35, 45, 0.95) 0%, rgba(20, 25, 35, 0.98) 100%)',
            border: '1px solid rgba(110, 180, 255, 0.25)',
            boxShadow: `
              inset 0 4px 24px rgba(0,0,0,0.40),
              0 8px 40px rgba(110, 180, 255, ${breathGlow}),
              0 0 80px rgba(110, 180, 255, ${breathGlow * 0.6})
            `,
            position: 'absolute',
            left: '50%',
            top: '50%',
            marginLeft: '-80px',
            marginTop: '-80px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: breathScale }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* Glass highlight */}
          <div style={{
            position: 'absolute',
            top: '18%',
            left: '25%',
            width: '45%',
            height: '45%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(12px)',
            pointerEvents: 'none'
          }} />

          {/* Center text */}
          <div className="relative z-10 text-center">
            <div className="text-[10px] font-semibold mb-1 tracking-widest" style={{ 
              color: 'rgba(110, 180, 255, 0.70)',
              textTransform: 'uppercase'
            }}>
              Gap
            </div>
            <div className="text-4xl font-bold" style={{ 
              color: 'rgba(255,255,255,0.98)',
              textShadow: '0 2px 8px rgba(0,0,0,0.40)',
              fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif'
            }}>
              {gap}%
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

const MetricCard = ({ label, value, isCore, delay }) => {
  return (
    <motion.div
      className="relative rounded-2xl overflow-hidden group"
      style={{
        padding: '24px 20px',
        background: 'rgba(25, 30, 38, 0.50)',
        backdropFilter: 'blur(24px) saturate(140%)',
        WebkitBackdropFilter: 'blur(24px) saturate(140%)',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 4px 16px rgba(0,0,0,0.20)'
      }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{
        y: -2,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 8px 28px rgba(0,0,0,0.25)',
        transition: { duration: 0.2, ease: 'easeOut' }
      }}
    >
      <div className="text-center">
        <div className="text-[11px] font-medium mb-1.5 tracking-wide" style={{ 
          color: 'rgba(255,255,255,0.45)',
          textTransform: 'uppercase'
        }}>
          {label}
        </div>
        <div className="text-3xl font-bold mb-1" style={{ 
          color: 'rgba(255,255,255,0.98)',
          fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif'
        }}>
          {value}
        </div>
        {isCore && (
          <div 
            className="inline-block px-2 py-0.5 rounded-full text-[9px] font-semibold tracking-wider"
            style={{
              background: 'rgba(110, 180, 255, 0.12)',
              border: '1px solid rgba(110, 180, 255, 0.20)',
              color: 'rgba(110, 180, 255, 0.85)'
            }}
          >
            CORE
          </div>
        )}
      </div>
    </motion.div>
  );
};

const SegmentedControl = ({ options, active, onChange }) => {
  return (
    <div 
      className="inline-flex rounded-2xl p-1.5"
      style={{
        background: 'rgba(20, 25, 32, 0.60)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)'
      }}
    >
      {options.map((option) => (
        <motion.button
          key={option.id}
          onClick={() => onChange(option.id)}
          className="relative px-6 py-2.5 rounded-xl text-sm font-medium transition-colors"
          style={{
            color: active === option.id ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.50)',
            zIndex: active === option.id ? 2 : 1
          }}
          whileHover={{
            color: 'rgba(255,255,255,0.85)'
          }}
        >
          {active === option.id && (
            <motion.div
              layoutId="activeSegment"
              className="absolute inset-0 rounded-xl"
              style={{
                background: 'linear-gradient(135deg, rgba(110, 180, 255, 0.22) 0%, rgba(110, 180, 255, 0.15) 100%)',
                border: '1px solid rgba(110, 180, 255, 0.30)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10), 0 4px 12px rgba(110, 180, 255, 0.18)'
              }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            />
          )}
          <span className="relative z-10">{option.label}</span>
        </motion.button>
      ))}
    </div>
  );
};

const MeaningContent = () => (
  <motion.div
    initial={{ opacity: 0, y: 4 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -3 }}
    transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
    className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
  >
    <div className="space-y-2.5">
      <h4 className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.88)' }}>CPI</h4>
      <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.95)' }}>
        Everyday costs still feel high.
      </p>
      <p className="text-sm leading-relaxed" style={{ color: 'rgba(170,185,205,0.68)' }}>
        Because rent and services change slowly.
      </p>
      <p className="text-xs mt-3" style={{ color: 'rgba(140,160,185,0.52)' }}>
        Watch: rent and services.
      </p>
    </div>
    
    <div className="space-y-2.5">
      <h4 className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.88)' }}>PCE</h4>
      <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.95)' }}>
        People switch what they buy, so prices rise less.
      </p>
      <p className="text-sm leading-relaxed" style={{ color: 'rgba(170,185,205,0.68)' }}>
        Because people switch what they buy when prices rise.
      </p>
      <p className="text-xs mt-3" style={{ color: 'rgba(140,160,185,0.52)' }}>
        Watch: spending pullback.
      </p>
    </div>
    
    <div className="space-y-2.5">
      <h4 className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.88)' }}>Meaning</h4>
      <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.95)' }}>
        Rate decisions follow spending, not frustration.
      </p>
      <p className="text-sm leading-relaxed" style={{ color: 'rgba(170,185,205,0.68)' }}>
        Because inflation is tracked by what people keep buying.
      </p>
      <p className="text-xs mt-3" style={{ color: 'rgba(140,160,185,0.52)' }}>
        Watch: rate-cut timing.
      </p>
    </div>
  </motion.div>
);

const EvolvesContent = () => (
  <motion.div
    initial={{ opacity: 0, y: 4 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -3 }}
    transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
  >
    {[
      { label: 'Now', text: 'Prices stay stubborn in services. Because rent and wages take time to cool.' },
      { label: 'Near Term (~3m)', text: 'Goods prices cool faster than services. Because supply improves sooner than wages.' },
      { label: 'Medium Term (~6m)', text: 'Services cool, but not evenly. Because wage pressure fades gradually.' },
      { label: 'Confirmation (~12m)', text: 'Inflation moves closer to normal. Because slower demand finally shows up in prices.' }
    ].map((horizon, idx) => (
      <div key={idx} className="space-y-2">
        <div className="text-xs font-semibold tracking-wide" style={{ color: SEMANTIC_COLORS.policy }}>
          {horizon.label}
        </div>
        <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }}>
          {horizon.text}
        </p>
      </div>
    ))}
  </motion.div>
);

const LeadsContent = () => (
  <motion.div
    initial={{ opacity: 0, y: 4 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -3 }}
    transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto"
  >
    {[
      { title: 'Rates — Stay higher, longer', desc: 'Borrowing costs remain elevated as inflation persists.', icon: TrendingUp, color: 'rgba(255, 180, 120, 0.85)' },
      { title: 'Stocks — Valuations remain compressed', desc: 'Higher discount rates weigh on future earnings multiples.', icon: TrendingDown, color: 'rgba(180, 140, 255, 0.75)' },
      { title: 'Dollar — Stays supported', desc: 'Rate differentials keep the dollar elevated against peers.', icon: DollarSign, color: 'rgba(110, 200, 180, 0.80)' },
      { title: 'Credit — Conditions remain tight', desc: 'Lenders maintain caution until inflation clarity emerges.', icon: Minus, color: 'rgba(200, 200, 210, 0.65)' },
      { title: 'Risk — Path remains uneven', desc: 'Volatility persists as policy uncertainty lingers.', icon: TrendingDown, color: 'rgba(255, 160, 140, 0.75)' }
    ].map((item, idx) => (
      <motion.div
        key={idx}
        className="relative rounded-2xl overflow-hidden p-5"
        style={{
          background: 'rgba(25, 30, 38, 0.40)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: 'inset 0 0.5px 0 rgba(255,255,255,0.08), 0 2px 12px rgba(0,0,0,0.15)'
        }}
        whileHover={{
          y: -1.5,
          boxShadow: 'inset 0 0.5px 0 rgba(255,255,255,0.08), 0 5px 20px rgba(0,0,0,0.20)',
          transition: { duration: 0.20, ease: 'easeOut' }
        }}
      >
        <div className="flex items-start gap-3">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ 
              background: `${item.color}12`,
              border: `1px solid ${item.color}20`
            }}
          >
            <item.icon className="w-4 h-4" style={{ color: item.color }} strokeWidth={2} />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-sm mb-1.5" style={{ 
              color: 'rgba(255,255,255,0.96)',
              letterSpacing: '-0.005em'
            }}>
              {item.title}
            </h4>
            <p className="text-sm leading-relaxed" style={{ 
              color: 'rgba(180,195,215,0.75)',
              lineHeight: '1.5'
            }}>
              {item.desc}
            </p>
          </div>
        </div>
      </motion.div>
    ))}
  </motion.div>
);

export default function InflationSection({ data }) {
  const [activeTab, setActiveTab] = useState('meaning');
  
  if (!data) return null;

  const gap = Math.abs(data.cpi_core_yoy - data.pce_core_yoy).toFixed(1);

  const tabs = [
    { id: 'meaning', label: 'What This Means' },
    { id: 'evolves', label: 'How This Evolves' },
    { id: 'leads', label: 'What This Leads To' }
  ];

  return (
    <div 
      className="relative" 
      style={{
        padding: '48px 32px 64px 32px',
        marginBottom: '56px'
      }}
    >
      {/* Section Header */}
      <motion.div 
        className="mb-10"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2 className="text-3xl font-semibold mb-3" style={{ 
          color: 'rgba(255,255,255,0.98)',
          letterSpacing: '-0.02em',
          fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif'
        }}>
          Inflation — Sticky
        </h2>
        <p className="text-sm mb-6" style={{ 
          color: 'rgba(255,255,255,0.62)',
          lineHeight: '1.5'
        }}>
          Consumer prices remain elevated while policy inflation cools.
        </p>

        {/* Info capsule */}
        <motion.div
          className="rounded-xl p-4 max-w-2xl"
          style={{
            background: 'rgba(20, 25, 32, 0.55)',
            border: '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <div className="space-y-1.5 text-xs leading-relaxed" style={{ color: 'rgba(200,210,225,0.75)' }}>
            <p>• CPI reflects prices households feel.</p>
            <p>• PCE reflects prices policy responds to.</p>
            <p>• The gap explains why inflation can feel worse than policy suggests.</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Hero Visual */}
      <div className="mb-16">
        <InflationHeroOrb gap={gap} />
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
        <MetricCard label="CPI YoY" value={`${data.cpi_headline_yoy}%`} isCore={false} delay={0.1} />
        <MetricCard label="Core CPI YoY" value={`${data.cpi_core_yoy}%`} isCore={true} delay={0.15} />
        <MetricCard label="PCE YoY" value={`${data.pce_headline_yoy}%`} isCore={false} delay={0.2} />
        <MetricCard label="Core PCE YoY" value={`${data.pce_core_yoy}%`} isCore={true} delay={0.25} />
      </div>

      {/* Segmented Control */}
      <div className="flex justify-center mb-12">
        <SegmentedControl options={tabs} active={activeTab} onChange={setActiveTab} />
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'meaning' && <MeaningContent key="meaning" />}
        {activeTab === 'evolves' && <EvolvesContent key="evolves" />}
        {activeTab === 'leads' && <LeadsContent key="leads" />}
      </AnimatePresence>

      {/* Bottom fade transition */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none" style={{
        background: 'linear-gradient(180deg, transparent 0%, rgba(11,14,19,0.6) 60%, rgba(11,14,19,1) 100%)'
      }} />
    </div>
  );
}