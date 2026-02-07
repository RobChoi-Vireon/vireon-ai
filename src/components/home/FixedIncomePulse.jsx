import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import FixedIncomeDetailDrawer from './FixedIncomeDetailDrawer';

const mockFixedIncomeData = [
  { name: 'T.I.P.S.', change: '+0.35%', whyMatters: 'Inflation expectations firming' },
  { name: 'U.S. Treasuries', change: '+0.12%', whyMatters: 'Rates stabilizing at the long end' },
  { name: 'High Yield', change: '+0.68%', whyMatters: 'Credit spreads tightening' },
  { name: 'Convertibles', change: '+0.52%', whyMatters: 'Equity optionality back in demand' },
  { name: 'Municipals', change: '+0.18%', whyMatters: 'Tax-exempt flows steady' },
  { name: 'High Grade', change: '+0.22%', whyMatters: 'Flight to quality continues' }
];

export default function FixedIncomePulse() {
  const [showAllInstruments, setShowAllInstruments] = useState(false);
  const [selectedInstrument, setSelectedInstrument] = useState(null);

  const focusTier = mockFixedIncomeData.slice(0, 4);
  const allInstruments = mockFixedIncomeData;

  const getTileStyle = (change, isFocus = false) => {
    const absChange = Math.abs(parseFloat(change));
    const magnitude = Math.min(absChange / 1.0, 1); // Scale relative to 1%
    
    const baseOpacity = isFocus ? (0.05 + magnitude * 0.08) : (0.04 + magnitude * 0.05);
    const secondaryOpacity = isFocus ? (0.025 + magnitude * 0.04) : (0.02 + magnitude * 0.03);
    const borderOpacity = isFocus ? (0.12 + magnitude * 0.14) : (0.08 + magnitude * 0.10);
    const glowOpacity = isFocus ? (0.04 + magnitude * 0.10) : (0.03 + magnitude * 0.06);
    const glowRadius = isFocus ? (8 + magnitude * 10) : (5 + magnitude * 6);
    
    if (parseFloat(change) > 0) {
      return {
        background: `linear-gradient(145deg, rgba(16, 185, 129, ${baseOpacity}), rgba(16, 185, 129, ${secondaryOpacity}))`,
        border: `rgba(16, 185, 129, ${borderOpacity})`,
        glow: `0 0 ${glowRadius}px rgba(16, 185, 129, ${glowOpacity})`
      };
    } else {
      return {
        background: `linear-gradient(145deg, rgba(239, 68, 68, ${baseOpacity}), rgba(239, 68, 68, ${secondaryOpacity}))`,
        border: `rgba(239, 68, 68, ${borderOpacity})`,
        glow: `0 0 ${glowRadius}px rgba(239, 68, 68, ${glowOpacity})`
      };
    }
  };

  return (
    <div className="relative overflow-hidden rounded-[28px]" style={{
      background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.038) 0%, rgba(255, 255, 255, 0.024) 100%)',
      backdropFilter: 'blur(32px) saturate(165%)',
      WebkitBackdropFilter: 'blur(32px) saturate(165%)',
      border: '1px solid rgba(255,255,255,0.07)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 8px 32px rgba(0,0,0,0.10)',
      padding: '28px'
    }}>
      {/* Top specular highlight */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '15%',
        right: '15%',
        height: '1.5px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
        pointerEvents: 'none'
      }} />

      {/* Header */}
      <div className="mb-5">
        <h2 className="text-2xl font-bold tracking-[-0.02em] mb-1" style={{ color: 'rgba(255,255,255,0.92)' }}>
          Fixed Income Pulse
        </h2>
        <p className="text-[13px] font-medium" style={{ 
          color: 'rgba(255,255,255,0.52)',
          letterSpacing: '0.008em'
        }}>
          Rates and credit signals shaping risk appetite
        </p>
      </div>

      {/* Fixed Income Narrative Bar */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
        className="mb-7 rounded-[18px] overflow-hidden"
        style={{
          padding: '16px 24px',
          background: 'linear-gradient(180deg, rgba(147, 197, 253, 0.05) 0%, rgba(147, 197, 253, 0.03) 100%)',
          backdropFilter: 'blur(24px) saturate(165%)',
          WebkitBackdropFilter: 'blur(24px) saturate(165%)',
          border: '1px solid rgba(147, 197, 253, 0.10)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 0 16px rgba(147, 197, 253, 0.04)'
        }}
      >
        <p className="text-[14px] font-medium text-center" style={{ 
          color: 'rgba(255,255,255,0.82)',
          letterSpacing: '0.008em',
          lineHeight: 1.6
        }}>
          Long-end yields stable; credit tightening supports risk-on.
        </p>
      </motion.div>

      {/* Focus Tier - 4 Large Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {focusTier.map((instrument, index) => {
          const style = getTileStyle(instrument.change, true);
          const changeValue = parseFloat(instrument.change);

          return (
            <motion.div
              key={instrument.name}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: index * 0.06, 
                duration: 0.5, 
                ease: [0.22, 0.61, 0.36, 1] 
              }}
              onClick={() => setSelectedInstrument(instrument)}
              whileHover={{ 
                y: -3, 
                scale: 1.006,
                transition: { duration: 0.18, ease: [0.26, 0.11, 0.26, 1.0] }
              }}
              whileTap={{ scale: 0.985, transition: { duration: 0.10 } }}
              className="group relative rounded-[24px] cursor-pointer overflow-hidden"
              style={{ 
                padding: '36px',
                background: style.background, 
                backdropFilter: 'blur(28px) saturate(160%)',
                WebkitBackdropFilter: 'blur(28px) saturate(160%)',
                border: `1px solid ${style.border}`, 
                boxShadow: `inset 0 1px 0 rgba(255, 255, 255, 0.06), ${style.glow}`,
                transition: 'all 0.18s cubic-bezier(0.26, 0.11, 0.26, 1.0)',
                minHeight: '200px'
              }}
            >
              <div className="relative z-10 flex flex-col justify-between h-full">
                {/* Large % Number - PRIMARY */}
                <div className="mb-5 flex items-center">
                  <AnimatePresence mode="wait">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.92 }} 
                      animate={{ opacity: 1, scale: 1 }} 
                      exit={{ opacity: 0, scale: 0.92 }} 
                      transition={{ duration: 0.20, ease: [0.26, 0.11, 0.26, 1.0] }} 
                      className="text-5xl md:text-6xl font-extrabold"
                      style={{ 
                        lineHeight: 1,
                        color: 'rgba(255,255,255,0.94)',
                        fontVariantNumeric: 'tabular-nums',
                        textShadow: changeValue > 0 
                          ? '0 0 10px rgba(34, 197, 94, 0.18)' 
                          : '0 0 10px rgba(239, 68, 68, 0.18)',
                        letterSpacing: '-0.03em'
                      }}
                    >
                      {changeValue >= 0 ? '+' : ''}{changeValue.toFixed(2)}%
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="space-y-3">
                  {/* Why it matters - SECONDARY */}
                  <p className="text-[14px] font-medium leading-relaxed" style={{ 
                    color: 'rgba(255,255,255,0.68)',
                    letterSpacing: '0.005em',
                    lineHeight: 1.5
                  }}>
                    {instrument.whyMatters}
                  </p>

                  {/* Instrument Name - TERTIARY */}
                  <h3 className="text-[13px] font-semibold leading-tight" style={{ 
                    color: 'rgba(255,255,255,0.48)',
                    letterSpacing: '0.02em'
                  }}>
                    {instrument.name}
                  </h3>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Subtle separator fade */}
      <div className="relative h-8 mb-4" style={{
        background: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.012) 50%, transparent 100%)',
        pointerEvents: 'none'
      }} />

      {/* All Instruments - Collapsed/Expandable */}
      <div>
        <motion.button
          onClick={() => setShowAllInstruments(!showAllInstruments)}
          className="w-full rounded-[18px] mb-4"
          style={{
            padding: '13px 20px',
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.038) 0%, rgba(255, 255, 255, 0.024) 100%)',
            backdropFilter: 'blur(24px) saturate(165%)',
            WebkitBackdropFilter: 'blur(24px) saturate(165%)',
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: 'inset 0 0.5px 0 rgba(255,255,255,0.04), 0 2px 6px rgba(0,0,0,0.04)'
          }}
          whileHover={{
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.052) 0%, rgba(255, 255, 255, 0.036) 100%)',
            transition: { duration: 0.16 }
          }}
          whileTap={{ scale: 0.98, transition: { duration: 0.10 } }}
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-[13px] font-semibold" style={{ 
              color: 'rgba(255,255,255,0.70)',
              letterSpacing: '0.008em'
            }}>
              {showAllInstruments ? 'Hide fixed income map' : 'View full fixed income map'}
            </span>
            <motion.div
              animate={{ rotate: showAllInstruments ? 180 : 0 }}
              transition={{ duration: 0.20, ease: [0.26, 0.11, 0.26, 1.0] }}
            >
              <TrendingDown className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.58)' }} />
            </motion.div>
          </div>
        </motion.button>

        {/* Expanded All Instruments Grid */}
        <AnimatePresence>
          {showAllInstruments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: [0.26, 0.11, 0.26, 1.0] }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                {allInstruments.map((instrument, index) => {
                  const style = getTileStyle(instrument.change, false);
                  const changeValue = parseFloat(instrument.change);
                  
                  return (
                    <motion.div
                      key={instrument.name}
                      initial={{ opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ 
                        delay: index * 0.04, 
                        duration: 0.3, 
                        ease: [0.22, 0.61, 0.36, 1] 
                      }}
                      onClick={() => setSelectedInstrument(instrument)}
                      whileHover={{ 
                        y: -2, 
                        scale: 1.012,
                        transition: { duration: 0.16, ease: [0.26, 0.11, 0.26, 1.0] }
                      }}
                      whileTap={{ scale: 0.98, transition: { duration: 0.10 } }}
                      className="group relative rounded-[16px] cursor-pointer overflow-hidden"
                      style={{ 
                        padding: '16px',
                        background: `linear-gradient(145deg, ${
                          changeValue > 0 
                            ? 'rgba(16, 185, 129, 0.05), rgba(16, 185, 129, 0.025)' 
                            : 'rgba(239, 68, 68, 0.05), rgba(239, 68, 68, 0.025)'
                        })`,
                        backdropFilter: 'blur(20px) saturate(155%)',
                        WebkitBackdropFilter: 'blur(20px) saturate(155%)',
                        border: `1px solid ${
                          changeValue > 0 
                            ? 'rgba(16, 185, 129, 0.10)' 
                            : 'rgba(239, 68, 68, 0.10)'
                        }`, 
                        boxShadow: `inset 0 0.5px 0 rgba(255, 255, 255, 0.04), 0 0 6px ${
                          changeValue > 0 
                            ? 'rgba(16, 185, 129, 0.04)' 
                            : 'rgba(239, 68, 68, 0.04)'
                        }`,
                        transition: 'all 0.16s cubic-bezier(0.26, 0.11, 0.26, 1.0)'
                      }}
                    >
                      <div className="relative z-10">
                        {/* Instrument Name */}
                        <h3 className="text-[12px] font-semibold leading-tight mb-2.5" style={{ 
                          color: 'rgba(255,255,255,0.66)',
                          letterSpacing: '0.008em'
                        }}>
                          {instrument.name}
                        </h3>
                        
                        {/* % Change - smaller */}
                        <AnimatePresence mode="wait">
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.90 }} 
                            animate={{ opacity: 1, scale: 1 }} 
                            exit={{ opacity: 0, scale: 0.90 }} 
                            transition={{ duration: 0.18, ease: [0.26, 0.11, 0.26, 1.0] }} 
                            className="text-xl font-bold"
                            style={{ 
                              lineHeight: 1,
                              color: 'rgba(255,255,255,0.90)',
                              fontVariantNumeric: 'tabular-nums',
                              letterSpacing: '-0.015em'
                            }}
                          >
                            {changeValue >= 0 ? '+' : ''}{changeValue.toFixed(2)}%
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}