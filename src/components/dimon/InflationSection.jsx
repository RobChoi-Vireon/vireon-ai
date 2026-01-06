import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, DollarSign, Home, Activity } from 'lucide-react';

const HORIZON_EASE = [0.22, 1, 0.36, 1];
const HORIZON_SPRING = { stiffness: 60, damping: 20, mass: 1 };

// OS Horizon liquid glass material tokens
const GLASS = {
  panel: {
    background: 'rgba(18, 22, 28, 0.35)',
    backdropFilter: 'blur(22px) saturate(170%) brightness(1.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: 'inset 0 2px 16px rgba(0, 0, 0, 0.36), 0 24px 48px rgba(0, 0, 0, 0.32)'
  },
  card: {
    background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
    backdropFilter: 'blur(18px) saturate(165%)',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10), 0 4px 16px rgba(0,0,0,0.12)'
  }
};

const SEMANTIC_COLORS = {
  policy: '#6EB4FF',
  consumer: '#C9B46B',
  neutral: 'rgba(255,255,255,0.68)'
};

const InflationPressureCore = ({ gap, cpi, pce }) => {
  const containerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  
  const x = useSpring(0, HORIZON_SPRING);
  const y = useSpring(0, HORIZON_SPRING);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) / rect.width;
    const deltaY = (e.clientY - centerY) / rect.height;
    
    x.set(deltaX * 8);
    y.set(deltaY * 8);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div 
      ref={containerRef}
      className="relative flex flex-col items-center justify-center"
      style={{ height: '420px' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2, ease: HORIZON_EASE }}
    >
      {/* Ambient glow environment */}
      <motion.div 
        className="absolute"
        style={{
          width: '480px',
          height: '480px',
          background: 'radial-gradient(ellipse at center, rgba(201, 180, 107, 0.12) 0%, rgba(110, 180, 255, 0.08) 40%, transparent 70%)',
          filter: 'blur(48px)',
          pointerEvents: 'none'
        }}
        animate={{
          opacity: [0.6, 0.8, 0.6],
          scale: [1, 1.05, 1]
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Outer ring - CPI (consumer inflation) */}
      <motion.div
        className="absolute"
        style={{
          width: '280px',
          height: '280px',
          borderRadius: '50%',
          border: '1.5px solid rgba(201, 180, 107, 0.25)',
          background: 'radial-gradient(circle at 30% 30%, rgba(201, 180, 107, 0.08) 0%, transparent 50%)',
          backdropFilter: 'blur(8px)',
          boxShadow: 'inset 0 0 40px rgba(201, 180, 107, 0.06), 0 8px 32px rgba(0,0,0,0.2)',
          x,
          y
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ 
          opacity: 1, 
          scale: [1, 1.02, 1],
        }}
        transition={{
          opacity: { duration: 0.5, delay: 0.3 },
          scale: { duration: 6, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        {/* Specular highlight */}
        <div style={{
          position: 'absolute',
          top: '18%',
          left: '22%',
          width: '35%',
          height: '35%',
          background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.15) 0%, transparent 60%)',
          borderRadius: '50%',
          filter: 'blur(12px)'
        }} />
      </motion.div>

      {/* Middle ring spacer */}
      <motion.div
        className="absolute"
        style={{
          width: '210px',
          height: '210px',
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.04)'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      />

      {/* Inner core - PCE (policy inflation) */}
      <motion.div
        className="absolute"
        style={{
          width: '160px',
          height: '160px',
          borderRadius: '50%',
          border: '1.5px solid rgba(110, 180, 255, 0.30)',
          background: 'radial-gradient(circle at 35% 35%, rgba(110, 180, 255, 0.12) 0%, rgba(110, 180, 255, 0.04) 50%, transparent 70%)',
          backdropFilter: 'blur(12px)',
          boxShadow: 'inset 0 0 40px rgba(110, 180, 255, 0.10), 0 4px 24px rgba(0,0,0,0.25)',
          x: x.get() * 0.5,
          y: y.get() * 0.5
        }}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ 
          opacity: 1, 
          scale: [1, 1.03, 1]
        }}
        transition={{
          opacity: { duration: 0.5, delay: 0.5 },
          scale: { duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }
        }}
      >
        {/* Inner glow */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '25%',
          width: '40%',
          height: '40%',
          background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.18) 0%, transparent 65%)',
          borderRadius: '50%',
          filter: 'blur(10px)'
        }} />
      </motion.div>

      {/* Center content */}
      <motion.div
        className="relative z-20 flex flex-col items-center"
        style={{ x: x.get() * 0.3, y: y.get() * 0.3 }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7, ease: HORIZON_EASE }}
      >
        <div 
          className="text-xs font-semibold mb-2 tracking-wider"
          style={{ color: 'rgba(255,255,255,0.55)', letterSpacing: '0.08em' }}
        >
          GAP
        </div>
        <div 
          className="text-6xl font-bold mb-2"
          style={{ 
            color: 'rgba(255,255,255,0.98)',
            textShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}
        >
          {gap}%
        </div>
        <motion.div
          className="text-xs text-center px-4"
          style={{ 
            color: 'rgba(255,255,255,0.65)',
            lineHeight: '1.5',
            maxWidth: '240px'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          Consumer inflation remains above policy comfort
        </motion.div>
      </motion.div>

      {/* Atmospheric particles */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.3)',
            filter: 'blur(1px)',
            top: `${30 + i * 15}%`,
            left: `${25 + i * 20}%`
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.8
          }}
        />
      ))}
    </motion.div>
  );
};

const MetricCard = ({ label, value, description, icon: Icon }) => {
  return (
    <motion.div
      className="relative rounded-2xl overflow-hidden"
      style={{
        padding: '20px',
        ...GLASS.card,
        cursor: 'default'
      }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: HORIZON_EASE }}
      whileHover={{
        y: -3,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), 0 8px 32px rgba(0,0,0,0.16)',
        transition: { duration: 0.22, ease: 'easeOut' }
      }}
    >
      {/* Top rim light */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '20%',
        right: '20%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
        pointerEvents: 'none'
      }} />

      <div className="flex items-center justify-between mb-3">
        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)', letterSpacing: '0.05em', fontWeight: 500 }}>
          {label}
        </span>
        {Icon && <Icon className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.35)' }} />}
      </div>
      
      <div className="text-3xl font-bold mb-2" style={{ color: 'rgba(255,255,255,0.98)' }}>
        {value}%
      </div>
      
      <motion.div
        className="text-xs"
        style={{ color: 'rgba(255,255,255,0.48)', lineHeight: '1.4' }}
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {description}
      </motion.div>
    </motion.div>
  );
};

const IntelligenceSummary = () => {
  return (
    <motion.div
      className="relative rounded-2xl overflow-hidden"
      style={{
        padding: '28px 32px',
        ...GLASS.card,
        maxWidth: '680px',
        margin: '0 auto'
      }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3, ease: HORIZON_EASE }}
    >
      <div style={{
        position: 'absolute',
        top: 0,
        left: '15%',
        right: '15%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)'
      }} />

      <h3 
        className="text-sm font-semibold mb-4" 
        style={{ 
          color: SEMANTIC_COLORS.neutral,
          letterSpacing: '0.02em'
        }}
      >
        Inflation — Sticky
      </h3>
      
      <p 
        className="text-base leading-relaxed"
        style={{ 
          color: 'rgba(255,255,255,0.85)',
          lineHeight: '1.65'
        }}
      >
        Consumer prices remain elevated even as policy inflation cools. The gap explains why inflation still feels high despite easing data.
      </p>
    </motion.div>
  );
};

const ValuePill = ({ id, label, isActive, onClick }) => {
  return (
    <motion.button
      onClick={() => onClick(id)}
      className="relative px-5 py-2.5 rounded-full"
      style={{
        background: isActive 
          ? 'rgba(110, 180, 255, 0.15)'
          : 'rgba(255,255,255,0.04)',
        border: `1px solid ${isActive ? 'rgba(110, 180, 255, 0.30)' : 'rgba(255,255,255,0.08)'}`,
        color: isActive ? 'rgba(110, 180, 255, 0.95)' : 'rgba(255,255,255,0.60)',
        fontSize: '13px',
        fontWeight: 500,
        cursor: 'pointer'
      }}
      whileHover={{
        background: isActive 
          ? 'rgba(110, 180, 255, 0.18)'
          : 'rgba(255,255,255,0.06)',
        transition: { duration: 0.18 }
      }}
      whileTap={{ scale: 0.97 }}
    >
      {label}
      {isActive && (
        <motion.div
          layoutId="activePill"
          className="absolute inset-0 rounded-full"
          style={{
            background: 'rgba(110, 180, 255, 0.08)',
            zIndex: -1
          }}
          transition={{ duration: 0.25, ease: HORIZON_EASE }}
        />
      )}
    </motion.button>
  );
};

const ConsequenceCard = ({ title, description, icon: Icon }) => {
  return (
    <motion.div
      className="relative rounded-2xl overflow-hidden"
      style={{
        padding: '24px',
        ...GLASS.card,
        cursor: 'default'
      }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: HORIZON_EASE }}
      whileHover={{
        y: -2,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), 0 6px 28px rgba(0,0,0,0.18)',
        transition: { duration: 0.20, ease: 'easeOut' }
      }}
    >
      <div style={{
        position: 'absolute',
        top: 0,
        left: '20%',
        right: '20%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)'
      }} />

      <div className="flex items-start gap-3 mb-3">
        {Icon && (
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)'
            }}
          >
            <Icon className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.55)' }} strokeWidth={2} />
          </div>
        )}
        <h4 
          className="font-semibold text-sm flex-1"
          style={{ color: 'rgba(255,255,255,0.92)', lineHeight: '1.5' }}
        >
          {title}
        </h4>
      </div>
      
      <p 
        className="text-sm leading-relaxed"
        style={{ color: 'rgba(255,255,255,0.68)', paddingLeft: '44px' }}
      >
        {description}
      </p>
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
        background: 'linear-gradient(180deg, rgba(15,17,22,1) 0%, rgba(18,21,26,1) 60%, rgba(13,16,20,1) 100%)',
        padding: '64px 40px 100px 40px',
        borderRadius: '28px',
        marginBottom: '48px'
      }}
    >
      {/* Ambient environment glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at 50% 20%, rgba(201, 180, 107, 0.04) 0%, transparent 60%)',
        borderRadius: '28px'
      }} />
      
      {/* Quiet top light */}
      <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none" style={{
        background: 'linear-gradient(180deg, rgba(255,255,255,0.015) 0%, transparent 100%)',
        borderRadius: '28px 28px 0 0'
      }} />

      {/* Hero: Inflation Pressure Core */}
      <div className="mb-20">
        <InflationPressureCore gap={gap} cpi={data.cpi_core_yoy} pce={data.pce_core_yoy} />
      </div>

      {/* Supporting metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
        <MetricCard
          label="CPI YoY"
          value={data.cpi_headline_yoy}
          description="What households feel"
          icon={Home}
        />
        <MetricCard
          label="Core CPI"
          value={data.cpi_core_yoy}
          description="Without food & energy"
        />
        <MetricCard
          label="PCE YoY"
          value={data.pce_headline_yoy}
          description="What policy tracks"
          icon={Activity}
        />
        <MetricCard
          label="Core PCE"
          value={data.pce_core_yoy}
          description="Fed's preferred gauge"
        />
      </div>

      {/* Intelligence summary */}
      <div className="mb-16">
        <IntelligenceSummary />
      </div>

      {/* Value layers - pill navigation */}
      <div className="flex justify-center gap-3 mb-14">
        {[
          { id: 'meaning', label: 'What This Means' },
          { id: 'evolves', label: 'How This Evolves' },
          { id: 'leads', label: 'What This Leads To' }
        ].map((mode) => (
          <ValuePill
            key={mode.id}
            id={mode.id}
            label={mode.label}
            isActive={activeTab === mode.id}
            onClick={setActiveTab}
          />
        ))}
      </div>

      {/* Mode content */}
      <AnimatePresence mode="wait">
        {activeTab === 'meaning' && (
          <motion.div
            key="meaning"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={{ duration: 0.26, ease: HORIZON_EASE }}
            className="max-w-4xl mx-auto space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ConsequenceCard
                title="CPI"
                description="Everyday costs still feel high because rent and services change slowly."
                icon={Home}
              />
              <ConsequenceCard
                title="PCE"
                description="People switch what they buy, so prices rise less in policy measures."
                icon={Activity}
              />
              <ConsequenceCard
                title="Meaning"
                description="Rate decisions follow spending patterns, not consumer frustration."
                icon={TrendingDown}
              />
            </div>
          </motion.div>
        )}

        {activeTab === 'evolves' && (
          <motion.div
            key="evolves"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={{ duration: 0.26, ease: HORIZON_EASE }}
            className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            <ConsequenceCard
              title="Now"
              description="Prices stay stubborn in services because rent and wages take time to cool."
            />
            <ConsequenceCard
              title="Near Term (~3m)"
              description="Goods prices cool faster than services as supply improves."
            />
            <ConsequenceCard
              title="Medium Term (~6m)"
              description="Services cool, but not evenly, as wage pressure fades gradually."
            />
            <ConsequenceCard
              title="Confirmation (~12m)"
              description="Inflation moves closer to normal as slower demand shows up in prices."
            />
          </motion.div>
        )}

        {activeTab === 'leads' && (
          <motion.div
            key="leads"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={{ duration: 0.26, ease: HORIZON_EASE }}
            className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            <ConsequenceCard
              title="Rates — Stay higher, longer"
              description="Inflation cools slowly, keeping policy restrictive."
              icon={TrendingUp}
            />
            <ConsequenceCard
              title="Stocks — Valuations remain compressed"
              description="Higher rates reduce what investors will pay for future earnings."
              icon={TrendingDown}
            />
            <ConsequenceCard
              title="Dollar — Stays supported"
              description="US rates remain elevated relative to global peers."
              icon={DollarSign}
            />
            <ConsequenceCard
              title="Credit — Conditions remain tight"
              description="Banks and markets wait for clearer signs of cooling."
              icon={Activity}
            />
            <ConsequenceCard
              title="Risk — Path remains uneven"
              description="Cooling happens in waves, not straight lines."
              icon={Minus}
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