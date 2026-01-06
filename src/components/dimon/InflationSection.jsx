import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, DollarSign } from 'lucide-react';

const HORIZON_EASE = [0.26, 0.11, 0.26, 1.0];

const InflationHeroOrb = ({ gap }) => {
  const containerRef = useRef(null);
  const [breathPhase, setBreathPhase] = useState(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const parallaxX = useSpring(mouseX, { stiffness: 120, damping: 28 });
  const parallaxY = useSpring(mouseY, { stiffness: 120, damping: 28 });

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
    const deltaX = (e.clientX - centerX) / 60;
    const deltaY = (e.clientY - centerY) / 60;
    mouseX.set(deltaX);
    mouseY.set(deltaY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const breathScale = 1 + Math.sin(breathPhase * Math.PI * 2) * 0.010;
  const breathGlow = 0.18 + Math.sin(breathPhase * Math.PI * 2) * 0.05;

  return (
    <div 
      ref={containerRef}
      className="flex items-center justify-center relative" 
      style={{ height: '420px', width: '100%', marginTop: '40px', marginBottom: '60px' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Ambient foundation glow */}
      <motion.div 
        className="absolute pointer-events-none" 
        style={{
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle at center, rgba(110, 180, 255, 0.14) 0%, rgba(110, 180, 255, 0.05) 45%, transparent 72%)',
          filter: 'blur(60px)',
          opacity: breathGlow
        }}
        animate={{ scale: breathScale }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
      />
      
      {/* Orb system */}
      <motion.div
        className="relative"
        style={{
          x: parallaxX,
          y: parallaxY
        }}
      >
        {/* Outer ring - largest, most subtle */}
        <motion.div 
          style={{
            width: '320px',
            height: '320px',
            borderRadius: '50%',
            border: '1px solid rgba(110, 180, 255, 0.12)',
            position: 'absolute',
            left: '50%',
            top: '50%',
            marginLeft: '-160px',
            marginTop: '-160px',
            pointerEvents: 'none'
          }}
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 0.30, scale: breathScale * 0.997 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Middle ring */}
        <motion.div 
          style={{
            width: '240px',
            height: '240px',
            borderRadius: '50%',
            border: '1px solid rgba(110, 180, 255, 0.18)',
            position: 'absolute',
            left: '50%',
            top: '50%',
            marginLeft: '-120px',
            marginTop: '-120px',
            pointerEvents: 'none'
          }}
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 0.45, scale: breathScale * 0.998 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Inner ring - brightest */}
        <motion.div 
          style={{
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            border: '1.5px solid rgba(110, 180, 255, 0.25)',
            position: 'absolute',
            left: '50%',
            top: '50%',
            marginLeft: '-90px',
            marginTop: '-90px',
            pointerEvents: 'none'
          }}
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 0.60, scale: breathScale * 0.999 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Core orb */}
        <motion.div 
          style={{
            width: '140px',
            height: '140px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 32% 32%, rgba(35, 42, 52, 0.92) 0%, rgba(22, 28, 38, 0.96) 100%)',
            border: '1.5px solid rgba(110, 180, 255, 0.32)',
            boxShadow: `
              inset 0 6px 28px rgba(0,0,0,0.50),
              0 12px 48px rgba(110, 180, 255, ${breathGlow * 0.8}),
              0 0 90px rgba(110, 180, 255, ${breathGlow * 0.5})
            `,
            position: 'absolute',
            left: '50%',
            top: '50%',
            marginLeft: '-70px',
            marginTop: '-70px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none'
          }}
          initial={{ opacity: 0, scale: 0.80 }}
          animate={{ opacity: 1, scale: breathScale }}
          transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Glass specular highlight */}
          <div style={{
            position: 'absolute',
            top: '20%',
            left: '28%',
            width: '48%',
            height: '48%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 68%)',
            borderRadius: '50%',
            filter: 'blur(14px)',
            pointerEvents: 'none'
          }} />

          {/* Core text */}
          <motion.div 
            className="relative z-10 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <div className="text-[10px] font-semibold mb-1.5 tracking-[0.12em]" style={{ 
              color: 'rgba(110, 180, 255, 0.75)',
              textTransform: 'uppercase',
              fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif'
            }}>
              Gap
            </div>
            <div className="text-5xl font-bold" style={{ 
              color: 'rgba(255,255,255,0.98)',
              textShadow: '0 3px 16px rgba(0,0,0,0.45)',
              fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
              letterSpacing: '-0.02em'
            }}>
              {gap}%
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

const MetricCard = ({ label, value, isCore, delay }) => {
  return (
    <motion.div
      className="relative rounded-2xl overflow-hidden"
      style={{
        padding: '28px 22px',
        background: 'rgba(28, 32, 40, 0.45)',
        backdropFilter: 'blur(28px) saturate(140%)',
        WebkitBackdropFilter: 'blur(28px) saturate(140%)',
        border: '1px solid rgba(255,255,255,0.05)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03), 0 6px 20px rgba(0,0,0,0.22)'
      }}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{
        y: -2,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 10px 32px rgba(0,0,0,0.28)',
        transition: { duration: 0.22, ease: 'easeOut' }
      }}
    >
      <div className="text-center">
        <div className="text-[10px] font-medium mb-2 tracking-[0.08em]" style={{ 
          color: 'rgba(255,255,255,0.42)',
          textTransform: 'uppercase',
          fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif'
        }}>
          {label}
        </div>
        <div className="text-3xl font-bold mb-1.5" style={{ 
          color: 'rgba(255,255,255,0.98)',
          fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
          letterSpacing: '-0.01em'
        }}>
          {value}
        </div>
        {isCore && (
          <div 
            className="inline-block px-2.5 py-1 rounded-full text-[9px] font-semibold tracking-[0.08em]"
            style={{
              background: 'rgba(110, 180, 255, 0.10)',
              border: '1px solid rgba(110, 180, 255, 0.18)',
              color: 'rgba(110, 180, 255, 0.88)'
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
        background: 'rgba(22, 26, 34, 0.65)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 4px 16px rgba(0,0,0,0.15)'
      }}
    >
      {options.map((option) => (
        <motion.button
          key={option.id}
          onClick={() => onChange(option.id)}
          className="relative px-7 py-2.5 rounded-xl text-sm font-medium"
          style={{
            color: active === option.id ? 'rgba(255,255,255,0.98)' : 'rgba(255,255,255,0.48)',
            fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
            zIndex: active === option.id ? 2 : 1
          }}
          whileHover={{
            color: active === option.id ? 'rgba(255,255,255,0.98)' : 'rgba(255,255,255,0.72)'
          }}
          whileTap={{ scale: 0.97 }}
        >
          {active === option.id && (
            <motion.div
              layoutId="activeSegmentGlow"
              className="absolute inset-0 rounded-xl"
              style={{
                background: 'linear-gradient(135deg, rgba(110, 180, 255, 0.24) 0%, rgba(110, 180, 255, 0.16) 100%)',
                border: '1px solid rgba(110, 180, 255, 0.32)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), 0 4px 18px rgba(110, 180, 255, 0.20)'
              }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            />
          )}
          <span className="relative z-10">{option.label}</span>
        </motion.button>
      ))}
    </div>
  );
};

const StakeholderPills = ({ active, onChange }) => {
  const stakeholders = [
    { id: 'consumer', label: 'Consumer' },
    { id: 'worker', label: 'Worker' },
    { id: 'business', label: 'Business' },
    { id: 'government', label: 'Government' },
    { id: 'investor', label: 'Investor' }
  ];

  return (
    <div className="flex flex-wrap gap-2 justify-center mb-8">
      {stakeholders.map((stakeholder) => (
        <motion.button
          key={stakeholder.id}
          onClick={() => onChange(stakeholder.id)}
          className="px-5 py-2 rounded-full text-sm font-medium transition-all"
          style={{
            background: active === stakeholder.id 
              ? 'rgba(110, 180, 255, 0.18)' 
              : 'rgba(28, 32, 40, 0.45)',
            border: active === stakeholder.id 
              ? '1px solid rgba(110, 180, 255, 0.32)' 
              : '1px solid rgba(255,255,255,0.06)',
            color: active === stakeholder.id 
              ? 'rgba(255,255,255,0.98)' 
              : 'rgba(255,255,255,0.55)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)'
          }}
          whileHover={{
            background: active === stakeholder.id 
              ? 'rgba(110, 180, 255, 0.22)' 
              : 'rgba(28, 32, 40, 0.60)',
            color: 'rgba(255,255,255,0.92)'
          }}
          whileTap={{ scale: 0.96 }}
        >
          {stakeholder.label}
        </motion.button>
      ))}
    </div>
  );
};

const MeaningContent = () => (
  <motion.div
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -4 }}
    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
    className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto"
  >
    <div className="space-y-3">
      <h4 className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.88)' }}>CPI</h4>
      <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.95)' }}>
        Everyday costs still feel high.
      </p>
      <p className="text-sm leading-relaxed" style={{ color: 'rgba(170,185,205,0.68)' }}>
        Because rent and services change slowly.
      </p>
    </div>
    
    <div className="space-y-3">
      <h4 className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.88)' }}>PCE</h4>
      <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.95)' }}>
        Spending shifts, so inflation looks cooler.
      </p>
      <p className="text-sm leading-relaxed" style={{ color: 'rgba(170,185,205,0.68)' }}>
        Because people switch what they buy when prices rise.
      </p>
    </div>
    
    <div className="space-y-3">
      <h4 className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.88)' }}>Meaning</h4>
      <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.95)' }}>
        The Fed reacts to demand, not pain.
      </p>
      <p className="text-sm leading-relaxed" style={{ color: 'rgba(170,185,205,0.68)' }}>
        Because inflation is tracked by what people keep buying.
      </p>
    </div>
  </motion.div>
);

const EvolvesContent = () => (
  <motion.div
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -4 }}
    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto"
  >
    {[
      { label: 'Now', text: 'Prices stay stubborn in services. Because rent and wages take time to cool.' },
      { label: 'Near Term (~3m)', text: 'Goods cool faster than services. Because supply improves before wages do.' },
      { label: 'Medium Term (~6m)', text: 'Services cool, but unevenly. Because wage pressure fades gradually.' },
      { label: 'Confirmation (~12m)', text: 'Inflation moves closer to normal. Because slower demand finally shows up in prices.' }
    ].map((horizon, idx) => (
      <div key={idx} className="space-y-2.5">
        <div className="text-xs font-semibold tracking-wide" style={{ color: 'rgba(110, 180, 255, 0.85)' }}>
          {horizon.label}
        </div>
        <p className="text-sm leading-relaxed" style={{ color: 'rgba(220,230,245,0.88)' }}>
          {horizon.text}
        </p>
      </div>
    ))}
  </motion.div>
);

const ConsequencesContent = ({ activeStakeholder, setActiveStakeholder }) => {
  const stakeholderHeadlines = {
    consumer: 'Purchasing power erodes despite wage gains',
    worker: 'Wage gains offset but do not erase pressure',
    business: 'Margins compressed by input cost stickiness',
    government: 'Fiscal space narrows as debt servicing rises',
    investor: 'Asset returns lag inflation-adjusted expectations'
  };

  const downstreamEffects = [
    { 
      title: 'Rates', 
      subtitle: 'Higher for longer',
      desc: 'Because services inflation constrains policy easing',
      icon: TrendingUp, 
      color: 'rgba(255, 180, 120, 0.85)' 
    },
    { 
      title: 'Equities', 
      subtitle: 'Multiple compression',
      desc: 'Because elevated discount rates persist',
      icon: TrendingDown, 
      color: 'rgba(180, 140, 255, 0.75)' 
    },
    { 
      title: 'Credit', 
      subtitle: 'Spreads stable',
      desc: 'Because growth holds while policy waits',
      icon: Minus, 
      color: 'rgba(110, 200, 180, 0.80)' 
    },
    { 
      title: 'USD', 
      subtitle: 'Rate differential support',
      desc: 'Because US rates stay elevated vs peers',
      icon: DollarSign, 
      color: 'rgba(110, 180, 255, 0.75)' 
    },
    { 
      title: 'Risk', 
      subtitle: 'Policy uncertainty',
      desc: 'Because inflation path remains unclear',
      icon: TrendingDown, 
      color: 'rgba(255, 160, 140, 0.75)' 
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-6xl mx-auto"
    >
      {/* Stakeholder Pills */}
      <StakeholderPills active={activeStakeholder} onChange={setActiveStakeholder} />

      {/* Headline */}
      <motion.div 
        className="text-center mb-12"
        key={activeStakeholder}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
      >
        <p className="text-base" style={{ 
          color: 'rgba(255,255,255,0.92)',
          fontWeight: 500,
          letterSpacing: '-0.005em'
        }}>
          {stakeholderHeadlines[activeStakeholder]}
        </p>
      </motion.div>

      {/* Downstream Effects */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold mb-6" style={{ 
          color: 'rgba(255,255,255,0.65)',
          letterSpacing: '0.02em'
        }}>
          Downstream Effects
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {downstreamEffects.map((item, idx) => (
            <motion.div
              key={idx}
              className="relative rounded-2xl overflow-hidden p-5"
              style={{
                background: 'rgba(28, 32, 40, 0.38)',
                backdropFilter: 'blur(22px)',
                WebkitBackdropFilter: 'blur(22px)',
                border: '1px solid rgba(255,255,255,0.06)',
                boxShadow: 'inset 0 0.5px 0 rgba(255,255,255,0.06), 0 3px 14px rgba(0,0,0,0.18)'
              }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              whileHover={{
                y: -1.5,
                boxShadow: 'inset 0 0.5px 0 rgba(255,255,255,0.08), 0 6px 24px rgba(0,0,0,0.24)',
                transition: { duration: 0.22, ease: 'easeOut' }
              }}
            >
              <div className="flex items-start gap-3.5 mb-3">
                <div 
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ 
                    background: `${item.color}14`,
                    border: `1px solid ${item.color}22`
                  }}
                >
                  <item.icon className="w-4 h-4" style={{ color: item.color }} strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm mb-0.5" style={{ 
                    color: 'rgba(255,255,255,0.96)',
                    letterSpacing: '-0.005em'
                  }}>
                    {item.title}
                  </h4>
                  <p className="text-xs" style={{ 
                    color: 'rgba(180,195,215,0.65)'
                  }}>
                    {item.subtitle}
                  </p>
                </div>
              </div>
              <p className="text-sm leading-relaxed" style={{ 
                color: 'rgba(185,200,220,0.76)',
                lineHeight: '1.52'
              }}>
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};



export default function InflationSection({ data }) {
  const [activeTab, setActiveTab] = useState('meaning');
  const [activeStakeholder, setActiveStakeholder] = useState('worker');
  
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
        padding: '56px 40px 72px 40px',
        marginBottom: '64px'
      }}
    >
      {/* Section Header */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2 className="text-3xl font-semibold mb-4" style={{ 
          color: 'rgba(255,255,255,0.98)',
          letterSpacing: '-0.02em',
          fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif'
        }}>
          Inflation — Sticky
        </h2>
        <p className="text-sm mb-6 leading-relaxed" style={{ 
          color: 'rgba(255,255,255,0.62)',
          lineHeight: '1.5',
          maxWidth: '600px'
        }}>
          Consumer prices remain elevated while policy inflation cools.
        </p>

        {/* Info capsule */}
        <motion.div
          className="rounded-xl p-5 max-w-2xl"
          style={{
            background: 'rgba(22, 26, 34, 0.58)',
            border: '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            boxShadow: 'inset 0 0.5px 0 rgba(255,255,255,0.04)'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="space-y-2 text-xs leading-relaxed" style={{ 
            color: 'rgba(200,210,225,0.75)',
            fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif'
          }}>
            <p>• CPI reflects prices households feel.</p>
            <p>• PCE reflects prices policy responds to.</p>
            <p>• The gap explains why inflation can feel worse than policy suggests.</p>
          </div>
        </motion.div>
      </motion.div>

      {/* PRIMARY HERO ARTIFACT */}
      <InflationHeroOrb gap={gap} />

      {/* Supporting Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-16 max-w-5xl mx-auto">
        <MetricCard label="CPI YoY" value={`${data.cpi_headline_yoy}%`} isCore={false} delay={0.1} />
        <MetricCard label="Core CPI YoY" value={`${data.cpi_core_yoy}%`} isCore={true} delay={0.15} />
        <MetricCard label="PCE YoY" value={`${data.pce_headline_yoy}%`} isCore={false} delay={0.2} />
        <MetricCard label="Core PCE YoY" value={`${data.pce_core_yoy}%`} isCore={true} delay={0.25} />
      </div>

      {/* Segmented Control */}
      <div className="flex justify-center mb-14">
        <SegmentedControl options={tabs} active={activeTab} onChange={setActiveTab} />
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'meaning' && <MeaningContent key="meaning" />}
        {activeTab === 'evolves' && <EvolvesContent key="evolves" />}
        {activeTab === 'leads' && (
          <LeadsContent 
            key="leads" 
            activeStakeholder={activeStakeholder}
            setActiveStakeholder={setActiveStakeholder}
          />
        )}
      </AnimatePresence>

      {/* Bottom fade transition */}
      <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none" style={{
        background: 'linear-gradient(180deg, transparent 0%, rgba(11,14,19,0.65) 55%, rgba(11,14,19,0.92) 85%, rgba(11,14,19,1) 100%)'
      }} />
    </div>
  );
}