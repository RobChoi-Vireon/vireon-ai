import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const HORIZON_EASE = [0.26, 0.11, 0.26, 1.0];
const APPLE_EASE = [0.25, 0.1, 0.25, 1.0];

const StatePillColors = {
  "Cooling": { bg: "rgba(88, 227, 164, 0.12)", border: "rgba(88, 227, 164, 0.24)", text: "#58E3A4" },
  "Sticky": { bg: "rgba(255, 180, 100, 0.12)", border: "rgba(255, 180, 100, 0.24)", text: "#FFB464" },
  "Re-accelerating": { bg: "rgba(255, 106, 122, 0.12)", border: "rgba(255, 106, 122, 0.24)", text: "#FF6A7A" },
  "Mixed": { bg: "rgba(168, 179, 199, 0.12)", border: "rgba(168, 179, 199, 0.24)", text: "#A8B3C7" }
};

const PolicyBiasColors = {
  "Dovish": { bg: "rgba(88, 227, 164, 0.12)", border: "rgba(88, 227, 164, 0.24)", text: "#58E3A4" },
  "Neutral": { bg: "rgba(168, 179, 199, 0.12)", border: "rgba(168, 179, 199, 0.24)", text: "#A8B3C7" },
  "Hawkish": { bg: "rgba(255, 106, 122, 0.12)", border: "rgba(255, 106, 122, 0.24)", text: "#FF6A7A" }
};

const KPIChip = ({ label, value, isCore = false, microLabel }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -1.5 }}
      transition={{ duration: 0.5, ease: APPLE_EASE }}
      className="relative flex flex-col items-center justify-center rounded-[28px] overflow-hidden"
      style={{
        padding: '24px 28px',
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.032) 0%, rgba(255, 255, 255, 0.020) 100%)',
        backdropFilter: 'blur(40px) saturate(155%)',
        WebkitBackdropFilter: 'blur(40px) saturate(155%)',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: isHovered 
          ? 'inset 0 1px 0 rgba(255,255,255,0.10), 0 6px 24px rgba(0,0,0,0.12), 0 0 40px rgba(110, 180, 255, 0.04)'
          : 'inset 0 0.5px 0 rgba(255,255,255,0.06), 0 4px 16px rgba(0,0,0,0.06)',
        minWidth: '140px',
        transition: 'box-shadow 0.5s cubic-bezier(0.25, 0.1, 0.25, 1.0)'
      }}
    >
      <div style={{
        position: 'absolute',
        top: 0,
        left: '18%',
        right: '18%',
        height: '0.5px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)',
        pointerEvents: 'none',
        opacity: isHovered ? 1 : 0.7,
        transition: 'opacity 0.5s ease'
      }} />
      
      <div className="text-xs font-medium mb-1.5" style={{ 
        color: 'rgba(255,255,255,0.50)', 
        letterSpacing: '0.02em',
        transition: 'color 0.3s ease'
      }}>
        {label}
      </div>
      <div className="text-2xl font-bold tracking-tight" style={{ 
        color: 'rgba(255,255,255,0.92)',
        transition: 'color 0.3s ease'
      }}>
        {value ?? '—'}
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 4 }}
        transition={{ duration: 0.4, ease: APPLE_EASE }}
        className="text-[10px] font-medium mt-1.5"
        style={{ color: 'rgba(255,255,255,0.45)', height: isHovered ? 'auto' : 0 }}
      >
        {microLabel}
      </motion.div>
    </motion.div>
  );
};

const ImplicationPill = ({ label, direction, note, explanation }) => {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = direction === 'up' ? TrendingUp : direction === 'down' ? TrendingDown : Minus;
  const color = direction === 'up' ? '#58E3A4' : direction === 'down' ? '#FF6A7A' : '#A8B3C7';
  
  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -1 }}
      transition={{ duration: 0.5, ease: APPLE_EASE }}
      className="relative flex flex-col gap-1 rounded-[20px] overflow-hidden"
      style={{
        padding: '14px 20px',
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.032) 0%, rgba(255, 255, 255, 0.020) 100%)',
        backdropFilter: 'blur(36px) saturate(160%)',
        WebkitBackdropFilter: 'blur(36px) saturate(160%)',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: isHovered
          ? `inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 20px rgba(0,0,0,0.10), 0 0 32px ${color}15`
          : 'inset 0 0.5px 0 rgba(255,255,255,0.05), 0 2px 10px rgba(0,0,0,0.06)',
        transition: 'box-shadow 0.5s cubic-bezier(0.25, 0.1, 0.25, 1.0)'
      }}
    >
      <div className="flex items-center gap-2.5">
        <Icon className="w-4 h-4 flex-shrink-0" style={{ color, strokeWidth: 2 }} />
        <div className="flex flex-col">
          <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.88)' }}>{label}</span>
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.48)' }}>{note}</span>
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ 
          opacity: isHovered ? 1 : 0, 
          height: isHovered ? 'auto' : 0 
        }}
        transition={{ duration: 0.4, ease: APPLE_EASE }}
        className="text-xs leading-relaxed"
        style={{ 
          color: 'rgba(255,255,255,0.55)',
          marginTop: isHovered ? '6px' : 0,
          paddingTop: isHovered ? '6px' : 0,
          borderTop: isHovered ? '1px solid rgba(255,255,255,0.06)' : 'none'
        }}
      >
        {explanation}
      </motion.div>
    </motion.div>
  );
};

const InflationPressureCore = ({ cpi, pce, stateTag }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-300, 300], [8, -8]);
  const rotateY = useTransform(mouseX, [-300, 300], [-8, 8]);

  const gap = cpi && pce ? Math.abs(cpi - pce).toFixed(1) : '—';
  const isPersistent = stateTag === "Sticky" || stateTag === "Re-accelerating";

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex items-center justify-center"
      style={{
        height: '380px',
        perspective: '1200px'
      }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d'
        }}
        transition={{ type: "spring", stiffness: 100, damping: 30 }}
        className="relative"
      >
        {/* Outer Ring - CPI (Felt Inflation) */}
        <motion.div
          animate={{
            scale: [1, 1.02, 1],
            opacity: [0.4, 0.5, 0.4]
          }}
          transition={{
            duration: isPersistent ? 6 : 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 rounded-full"
          style={{
            width: '280px',
            height: '280px',
            border: '2px solid rgba(255, 180, 100, 0.20)',
            background: 'radial-gradient(ellipse at center, rgba(255, 180, 100, 0.08) 0%, transparent 70%)',
            filter: 'blur(1px)',
            boxShadow: 'inset 0 0 60px rgba(255, 180, 100, 0.12), 0 0 80px rgba(255, 180, 100, 0.08)'
          }}
        />

        {/* Inner Core - PCE (Policy Inflation) */}
        <motion.div
          animate={{
            scale: [1, 1.03, 1],
            opacity: [0.6, 0.75, 0.6]
          }}
          transition={{
            duration: isPersistent ? 5 : 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
          className="absolute rounded-full"
          style={{
            width: '200px',
            height: '200px',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            border: '2px solid rgba(110, 180, 255, 0.30)',
            background: 'radial-gradient(ellipse at center, rgba(110, 180, 255, 0.12) 0%, rgba(110, 180, 255, 0.06) 50%, transparent 80%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: 'inset 0 0 40px rgba(110, 180, 255, 0.18), 0 0 60px rgba(110, 180, 255, 0.10)'
          }}
        />

        {/* Central Content */}
        <div 
          className="absolute flex flex-col items-center justify-center"
          style={{
            width: '280px',
            height: '280px',
            top: 0,
            left: 0
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: APPLE_EASE, delay: 0.3 }}
            className="text-center"
          >
            <div className="text-xs font-medium mb-2" style={{ color: 'rgba(255,255,255,0.45)', letterSpacing: '0.08em' }}>
              GAP
            </div>
            <div className="text-6xl font-bold tracking-tight mb-3" style={{ color: 'rgba(255,255,255,0.95)' }}>
              {gap}%
            </div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: APPLE_EASE, delay: 0.6 }}
              className="text-xs leading-relaxed px-8"
              style={{ color: 'rgba(255,255,255,0.55)', maxWidth: '220px' }}
            >
              Inflation felt by households remains above policy comfort.
            </motion.div>
          </motion.div>
        </div>

        {/* Ambient Glow */}
        <motion.div
          animate={{
            opacity: isPersistent ? [0.3, 0.5, 0.3] : [0.2, 0.35, 0.2],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            width: '320px',
            height: '320px',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(ellipse at center, rgba(255, 180, 100, 0.12) 0%, transparent 70%)',
            filter: 'blur(40px)'
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default function InflationSection({ data }) {
  if (!data) return null;

  const stateColors = StatePillColors[data.state_tag] || StatePillColors.Mixed;
  const policyColors = PolicyBiasColors[data.policy_bias] || PolicyBiasColors.Neutral;

  const meaningBullets = data.interpretation_bullets?.slice(0, 4) || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pl-2">
        <h2 className="text-2xl font-bold mb-1" style={{ color: 'rgba(255,255,255,0.95)' }}>
          Inflation
        </h2>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.50)' }}>
          CPI • PCE
        </p>
      </div>

      {/* Hero Visual: Inflation Pressure Core */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: APPLE_EASE }}
      >
        <InflationPressureCore 
          cpi={data.cpi_core_yoy} 
          pce={data.pce_core_yoy}
          stateTag={data.state_tag}
        />
      </motion.div>

      {/* 1) Snapshot: KPI Chips */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <KPIChip 
          label="CPI YoY" 
          value={data.cpi_headline_yoy ? `${data.cpi_headline_yoy}%` : null}
          microLabel="Household inflation"
        />
        <KPIChip 
          label="Core CPI YoY" 
          value={data.cpi_core_yoy ? `${data.cpi_core_yoy}%` : null}
          microLabel="Household inflation"
        />
        <KPIChip 
          label="PCE YoY" 
          value={data.pce_headline_yoy ? `${data.pce_headline_yoy}%` : null}
          microLabel="Policy inflation"
        />
        <KPIChip 
          label="Core PCE YoY" 
          value={data.pce_core_yoy ? `${data.pce_core_yoy}%` : null}
          microLabel="Policy inflation"
        />
      </div>

      {data.last_updated && (
        <div className="text-xs pl-2" style={{ color: 'rgba(255,255,255,0.35)' }}>
          Last updated: {data.last_updated}
        </div>
      )}

      {/* 2) Compare + 3) Meaning */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Compare Card - Simplified */}
        <div className="lg:col-span-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: APPLE_EASE }}
            className="relative rounded-[28px] overflow-hidden h-full"
            style={{
              padding: '28px 32px',
              background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.032) 0%, rgba(255, 255, 255, 0.020) 100%)',
              backdropFilter: 'blur(40px) saturate(155%)',
              WebkitBackdropFilter: 'blur(40px) saturate(155%)',
              border: '1px solid rgba(255,255,255,0.06)',
              boxShadow: 'inset 0 0.5px 0 rgba(255,255,255,0.06), 0 4px 20px rgba(0,0,0,0.08)'
            }}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              left: '18%',
              right: '18%',
              height: '0.5px',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)',
              pointerEvents: 'none'
            }} />

            <div className="flex items-center gap-3 mb-5">
              <div 
                className="text-[10px] font-bold px-3 py-1.5 rounded-full"
                style={{
                  background: stateColors.bg,
                  border: `1px solid ${stateColors.border}`,
                  color: stateColors.text,
                  letterSpacing: '0.05em'
                }}
              >
                {data.state_tag}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-base font-semibold leading-relaxed" style={{ color: 'rgba(255,255,255,0.88)' }}>
                {data.comparison_headline || "CPI and PCE tracking closely"}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                {data.comparison_detail || "Both measures showing similar trends. This wedge explains why inflation still feels high."}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Meaning Card - Intelligence Lines */}
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: APPLE_EASE, delay: 0.1 }}
            className="relative rounded-[28px] overflow-hidden h-full"
            style={{
              padding: '28px 32px',
              background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.032) 0%, rgba(255, 255, 255, 0.020) 100%)',
              backdropFilter: 'blur(40px) saturate(155%)',
              WebkitBackdropFilter: 'blur(40px) saturate(155%)',
              border: '1px solid rgba(255,255,255,0.06)',
              boxShadow: 'inset 0 0.5px 0 rgba(255,255,255,0.06), 0 4px 20px rgba(0,0,0,0.08)'
            }}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              left: '18%',
              right: '18%',
              height: '0.5px',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)',
              pointerEvents: 'none'
            }} />

            <h3 className="text-base font-semibold mb-5" style={{ color: 'rgba(255,255,255,0.92)' }}>
              Meaning
            </h3>

            <div className="space-y-4">
              {meaningBullets.map((bullet, idx) => (
                <motion.p
                  key={idx}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, ease: APPLE_EASE, delay: 0.2 + idx * 0.1 }}
                  className="text-sm leading-relaxed"
                  style={{ color: 'rgba(255,255,255,0.70)' }}
                >
                  {bullet}
                </motion.p>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* 4) Implications: Strategic Consequence Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: APPLE_EASE, delay: 0.2 }}
        className="relative rounded-[28px] overflow-hidden"
        style={{
          padding: '28px 32px',
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.032) 0%, rgba(255, 255, 255, 0.020) 100%)',
          backdropFilter: 'blur(40px) saturate(155%)',
          WebkitBackdropFilter: 'blur(40px) saturate(155%)',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: 'inset 0 0.5px 0 rgba(255,255,255,0.06), 0 4px 20px rgba(0,0,0,0.08)'
        }}
      >
        <div style={{
          position: 'absolute',
          top: 0,
          left: '18%',
          right: '18%',
          height: '0.5px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)',
          pointerEvents: 'none'
        }} />

        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-semibold" style={{ color: 'rgba(255,255,255,0.92)' }}>
            Implications
          </h3>
          <div 
            className="text-[10px] font-bold px-3 py-1.5 rounded-full"
            style={{
              background: policyColors.bg,
              border: `1px solid ${policyColors.border}`,
              color: policyColors.text,
              letterSpacing: '0.05em'
            }}
          >
            Policy: {data.policy_bias}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(data.market_implications || []).map((implication, idx) => (
            <ImplicationPill 
              key={idx}
              label={implication.label}
              direction={implication.direction}
              note={implication.note}
              explanation={implication.explanation}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}