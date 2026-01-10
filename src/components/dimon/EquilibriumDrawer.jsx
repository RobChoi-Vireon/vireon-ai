import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const MOTION_TOKENS = {
  CURVES: {
    horizonIn: [0.22, 0.61, 0.36, 1],
  },
  DURATIONS: {
    drawerReveal: 0.22,
  }
};

const FORCE_COLORS = {
  growth: { core: '#B4F7C0', glow: 'rgba(180,247,192,0.40)' },
  rates: { core: '#C0A6FF', glow: 'rgba(192,166,255,0.40)' },
  fx: { core: '#6AC7F7', glow: 'rgba(106,199,247,0.40)' },
  geopolitics: { core: '#FFD37A', glow: 'rgba(255,211,122,0.40)' }
};

export default function EquilibriumDrawer({
  isOpen,
  stabilityIndex = 72,
  forces = {
    growth: 0.42,
    rates: -0.38,
    fx: 0.15,
    geopolitics: -0.28
  },
  equilibriumScore = 0.52,
  dominantForce = 'balanced'
}) {
  const sortedForces = React.useMemo(() => {
    return Object.entries(forces)
      .map(([key, value]) => ({ 
        name: key, 
        value,
        color: FORCE_COLORS[key]?.core || '#8DC4FF',
        glow: FORCE_COLORS[key]?.glow || 'rgba(141,196,255,0.28)'
      }))
      .sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
  }, [forces]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <motion.div
            className="fixed left-1/2 -translate-x-1/2 pointer-events-auto"
            style={{
              top: '220px',
              width: '420px',
              maxWidth: '90vw',
            }}
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ 
              duration: MOTION_TOKENS.DURATIONS.drawerReveal, 
              ease: MOTION_TOKENS.CURVES.horizonIn 
            }}
          >
            <div
              className="p-5 rounded-2xl"
              style={{
                background: 'rgba(10, 14, 20, 0.95)',
                backdropFilter: 'blur(36px) saturate(185%) brightness(1.08)',
                WebkitBackdropFilter: 'blur(36px) saturate(185%) brightness(1.08)',
                border: '1px solid rgba(255,255,255,0.13)',
                boxShadow: '0 16px 48px rgba(0,0,0,0.52), inset 0 1px 0 rgba(255,255,255,0.12)'
              }}
            >
              {/* Drawer Top Highlight */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: '32px',
                right: '32px',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)',
                borderRadius: '999px'
              }} />

              {/* Force Contribution Grid */}
              <div className="mb-4">
                <h5 style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.68)',
                  marginBottom: '14px'
                }}>
                  What's Driving Markets
                </h5>
                
                <div className="grid grid-cols-2 gap-2.5">
                  {sortedForces.map((force, i) => (
                    <motion.div
                      key={force.name}
                      className="flex items-center justify-between px-3.5 py-3 rounded-xl"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.06)'
                      }}
                      initial={{ opacity: 0, y: 3 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 + (i * 0.04), duration: 0.16 }}
                    >
                      <div className="flex items-center gap-2.5">
                        <div style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '999px',
                          background: force.color,
                          boxShadow: `0 0 12px ${force.glow}`
                        }} />
                        <span style={{
                          fontSize: '12px',
                          fontWeight: 500,
                          color: 'rgba(255,255,255,0.92)',
                          textTransform: 'capitalize'
                        }}>
                          {force.name}
                        </span>
                      </div>
                      <span style={{
                        fontSize: '13px',
                        fontWeight: 700,
                        color: force.value > 0 ? '#6EF3A5' : force.value < 0 ? '#F38B82' : 'rgba(255,255,255,0.60)'
                      }}>
                        {force.value > 0 ? '+' : ''}{Math.round(force.value * 100)}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div style={{
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)',
                margin: '16px 0'
              }} />

              {/* Stability Index + Label */}
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-11 h-11 flex-shrink-0">
                  <svg className="transform -rotate-90" width="44" height="44">
                    <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2.8" />
                    <motion.circle
                      cx="22" cy="22" r="18" fill="none"
                      stroke="#5EA7FF"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                      strokeDasharray="113"
                      initial={{ strokeDashoffset: 113 }}
                      animate={{ strokeDashoffset: 113 - stabilityIndex }}
                      transition={{ duration: 0.8, delay: 0.25, ease: MOTION_TOKENS.CURVES.horizonIn }}
                      style={{ filter: 'drop-shadow(0 0 7px rgba(94,167,255,0.35))' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-bold" style={{
                    color: 'rgba(255,255,255,0.98)',
                    fontSize: '12px'
                  }}>
                    {stabilityIndex}
                  </div>
                </div>

                <div className="flex-1">
                  <div style={{
                    fontSize: '10px',
                    color: 'rgba(255,255,255,0.68)',
                    letterSpacing: '0.12em',
                    fontWeight: 600,
                    marginBottom: '3px',
                    textTransform: 'uppercase'
                  }}>
                    Stability Index
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: 'rgba(255,255,255,0.94)',
                    fontWeight: 600,
                    letterSpacing: '-0.005em'
                  }}>
                    {stabilityIndex >= 70 ? 'Very Stable' : stabilityIndex >= 50 ? 'Somewhat Stable' : 'Higher Risk'}
                  </div>
                </div>
              </div>

              {/* Lyra Actionable Insight */}
              <motion.div
                className="px-4 py-3.5 rounded-xl"
                style={{
                  background: 'rgba(106, 199, 247, 0.06)',
                  border: '1px solid rgba(106, 199, 247, 0.16)',
                  boxShadow: 'inset 0 0 20px rgba(106, 199, 247, 0.07)'
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.2 }}
              >
                <div className="flex items-start gap-3">
                  <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'rgba(106, 199, 247, 0.82)' }} />
                  <div>
                    <p style={{
                      fontSize: '10px',
                      fontWeight: 600,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'rgba(106, 199, 247, 0.85)',
                      marginBottom: '6px'
                    }}>
                      Lyra Insight
                    </p>
                    <p style={{
                      fontSize: '13px',
                      lineHeight: '1.52',
                      color: 'rgba(235, 245, 252, 0.97)',
                      fontWeight: 400,
                      letterSpacing: '-0.003em'
                    }}>
                      {dominantForce === 'balanced'
                        ? "Markets are calm right now. Good time to look at both safe and growth-oriented investments."
                        : equilibriumScore > 0.6
                          ? "Global tensions and rising rates are creating pressure. Consider safer investments."
                          : "The economy is holding up well despite higher borrowing costs. Growth stocks look attractive."}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}