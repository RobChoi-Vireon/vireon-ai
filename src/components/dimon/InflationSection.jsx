import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Info, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';

const HORIZON_EASE = [0.26, 0.11, 0.26, 1.0];

// OS Horizon Palette — No Orange
const HORIZON_COLORS = {
  deepBlue: 'rgba(110, 180, 255, 0.85)',
  coolTeal: 'rgba(122, 237, 207, 0.70)',
  fogGray: 'rgba(180, 195, 215, 0.65)',
  graphite: 'rgba(140, 160, 185, 0.50)'
};

const CollapsibleDisclaimer = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <motion.div
      className="mb-10 max-w-3xl mx-auto"
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: HORIZON_EASE }}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left rounded-2xl p-4 transition-colors"
        style={{
          background: 'rgba(22, 26, 34, 0.55)',
          border: '1px solid rgba(110, 180, 255, 0.15)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)'
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Info className="w-4 h-4" style={{ color: HORIZON_COLORS.deepBlue }} />
            <span className="text-xs font-medium" style={{ 
              color: HORIZON_COLORS.deepBlue,
              fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif'
            }}>
              About These Metrics
            </span>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" style={{ color: HORIZON_COLORS.fogGray }} />
          ) : (
            <ChevronDown className="w-4 h-4" style={{ color: HORIZON_COLORS.fogGray }} />
          )}
        </div>
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: HORIZON_EASE }}
            className="overflow-hidden"
          >
            <div className="pt-3 pb-1 px-4">
              <div className="space-y-2 text-sm leading-relaxed" style={{ 
                color: 'rgba(200,210,225,0.80)',
                fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif'
              }}>
                <p>CPI shows how prices are moving.</p>
                <p>PCE shows how people are actually spending.</p>
                <p>Together, they reveal whether inflation is easing or just shifting.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const SignalCapsule = ({ text }) => (
  <motion.div
    className="text-center mb-12"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.15, ease: HORIZON_EASE }}
  >
    <h3 className="text-lg font-medium tracking-wide" style={{
      color: 'rgba(255,255,255,0.92)',
      fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
      letterSpacing: '0.02em',
      lineHeight: '1.4'
    }}>
      {text}
    </h3>
  </motion.div>
);

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
      style={{ height: '400px', width: '100%', marginTop: '30px', marginBottom: '50px' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
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
      
      <motion.div
        className="relative"
        style={{
          x: parallaxX,
          y: parallaxY
        }}
      >
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
          transition={{ duration: 1, delay: 0.1, ease: HORIZON_EASE }}
        />

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
          transition={{ duration: 1, delay: 0.2, ease: HORIZON_EASE }}
        />

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
          transition={{ duration: 1, delay: 0.3, ease: HORIZON_EASE }}
        />

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
          transition={{ duration: 1, delay: 0.4, ease: HORIZON_EASE }}
        >
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
      transition={{ duration: 0.55, delay, ease: HORIZON_EASE }}
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

const InsightCard = ({ text, delay }) => (
  <motion.div
    className="flex-shrink-0 w-80 p-6 rounded-2xl"
    style={{
      background: 'rgba(28, 32, 40, 0.40)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      border: '1px solid rgba(110, 180, 255, 0.12)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 4px 16px rgba(0,0,0,0.18)'
    }}
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay, ease: HORIZON_EASE }}
    whileHover={{
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 8px 28px rgba(110, 180, 255, 0.15)',
      transition: { duration: 0.22 }
    }}
  >
    <p className="text-sm leading-relaxed" style={{
      color: 'rgba(220,230,245,0.92)',
      fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
      lineHeight: '1.6'
    }}>
      {text}
    </p>
  </motion.div>
);

const InsightCardsRow = () => (
  <div className="mb-16">
    <div className="overflow-x-auto pb-4 -mx-8 px-8" style={{ scrollbarWidth: 'thin' }}>
      <div className="flex gap-4 min-w-max">
        <InsightCard text="Inflation is cooling, but not evenly." delay={0.1} />
        <InsightCard text="Housing remains the main source of pressure." delay={0.15} />
        <InsightCard text="Goods inflation is no longer the problem." delay={0.2} />
        <InsightCard text="Services keep overall inflation elevated." delay={0.25} />
      </div>
    </div>
  </div>
);

const FlowCard = ({ number, text, delay }) => (
  <motion.div
    className="relative p-6 rounded-2xl"
    style={{
      background: 'rgba(28, 32, 40, 0.38)',
      border: '1px solid rgba(110, 180, 255, 0.10)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      boxShadow: 'inset 0 0.5px 0 rgba(255,255,255,0.04)'
    }}
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay, ease: HORIZON_EASE }}
  >
    <div className="flex items-start gap-4">
      <div 
        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
        style={{
          background: 'rgba(110, 180, 255, 0.15)',
          color: HORIZON_COLORS.deepBlue
        }}
      >
        {number}
      </div>
      <p className="text-sm leading-relaxed flex-1" style={{
        color: 'rgba(210,220,235,0.88)',
        fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
        lineHeight: '1.6'
      }}>
        {text}
      </p>
    </div>
  </motion.div>
);

const WhyThisMattersFlow = () => (
  <div className="max-w-3xl mx-auto space-y-4 mb-16">
    <FlowCard 
      number="1" 
      text="CPI shows inflation slowing, but unevenly." 
      delay={0.1} 
    />
    <FlowCard 
      number="2" 
      text="PCE confirms pressure is easing faster beneath the surface." 
      delay={0.15} 
    />
    <FlowCard 
      number="3" 
      text="Policymakers focus more on PCE than headlines." 
      delay={0.2} 
    />
    <FlowCard 
      number="4" 
      text="Markets react to persistence, not direction." 
      delay={0.25} 
    />
  </div>
);

const EffectTile = ({ cause, effect, delay }) => (
  <motion.div
    className="p-6 rounded-2xl"
    style={{
      background: 'rgba(28, 32, 40, 0.35)',
      border: '1px solid rgba(110, 180, 255, 0.08)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)'
    }}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay, ease: HORIZON_EASE }}
    whileHover={{
      boxShadow: '0 6px 24px rgba(110, 180, 255, 0.12)',
      transition: { duration: 0.22 }
    }}
  >
    <div className="space-y-3">
      <div>
        <div className="text-[10px] font-semibold tracking-wider mb-1.5" style={{ 
          color: HORIZON_COLORS.graphite,
          textTransform: 'uppercase'
        }}>
          Cause
        </div>
        <p className="text-sm font-medium" style={{ 
          color: 'rgba(200,210,225,0.85)',
          fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif'
        }}>
          {cause}
        </p>
      </div>
      <div className="flex items-center justify-center py-1">
        <ArrowRight className="w-4 h-4" style={{ color: HORIZON_COLORS.deepBlue }} />
      </div>
      <div>
        <div className="text-[10px] font-semibold tracking-wider mb-1.5" style={{ 
          color: HORIZON_COLORS.graphite,
          textTransform: 'uppercase'
        }}>
          Effect
        </div>
        <p className="text-sm font-medium" style={{ 
          color: 'rgba(220,230,245,0.90)',
          fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif'
        }}>
          {effect}
        </p>
      </div>
    </div>
  </motion.div>
);

const DownstreamEffects = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto mb-16">
    <EffectTile 
      cause="Sticky housing" 
      effect="Rate cuts get delayed." 
      delay={0.1} 
    />
    <EffectTile 
      cause="Services inflation" 
      effect="Policy stays cautious." 
      delay={0.15} 
    />
    <EffectTile 
      cause="Cooling PCE" 
      effect="Confidence builds slowly." 
      delay={0.2} 
    />
  </div>
);

const LearningOutcome = ({ text, delay }) => (
  <motion.div
    className="p-5 rounded-xl"
    style={{
      background: 'rgba(28, 32, 40, 0.32)',
      border: '1px solid rgba(110, 180, 255, 0.08)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)'
    }}
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay, ease: HORIZON_EASE }}
  >
    <p className="text-sm leading-relaxed" style={{
      color: 'rgba(210,220,235,0.88)',
      fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
      lineHeight: '1.6'
    }}>
      {text}
    </p>
  </motion.div>
);

const WhatYouShouldKnow = () => (
  <div className="max-w-3xl mx-auto space-y-3">
    <h4 className="text-base font-semibold mb-6 text-center" style={{
      color: 'rgba(255,255,255,0.88)',
      fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
      letterSpacing: '0.01em'
    }}>
      What You Should Know
    </h4>
    <LearningOutcome text="CPI reacts slower than reality." delay={0.1} />
    <LearningOutcome text="PCE reflects real consumer behavior." delay={0.15} />
    <LearningOutcome text="Markets trust PCE more than headlines." delay={0.2} />
    <LearningOutcome text="Sticky inflation delays policy relief." delay={0.25} />
  </div>
);

export default function InflationSection({ data }) {
  if (!data) return null;

  const gap = Math.abs(data.cpi_core_yoy - data.pce_core_yoy).toFixed(1);

  return (
    <div 
      className="relative" 
      style={{
        padding: '56px 40px 72px 40px',
        marginBottom: '64px'
      }}
    >
      <CollapsibleDisclaimer />

      <SignalCapsule text="Housing costs are delaying inflation's cooldown." />

      <InflationHeroOrb gap={gap} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-16 max-w-5xl mx-auto">
        <MetricCard label="CPI YoY" value={`${data.cpi_headline_yoy}%`} isCore={false} delay={0.1} />
        <MetricCard label="Core CPI YoY" value={`${data.cpi_core_yoy}%`} isCore={true} delay={0.15} />
        <MetricCard label="PCE YoY" value={`${data.pce_headline_yoy}%`} isCore={false} delay={0.2} />
        <MetricCard label="Core PCE YoY" value={`${data.pce_core_yoy}%`} isCore={true} delay={0.25} />
      </div>

      <InsightCardsRow />

      <WhyThisMattersFlow />

      <DownstreamEffects />

      <WhatYouShouldKnow />

      <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none" style={{
        background: 'linear-gradient(180deg, transparent 0%, rgba(11,14,19,0.65) 55%, rgba(11,14,19,0.92) 85%, rgba(11,14,19,1) 100%)'
      }} />
    </div>
  );
}