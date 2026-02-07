import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, TrendingDown, Activity } from 'lucide-react';

const HORIZON_SPRING = { type: "spring", stiffness: 320, damping: 82, mass: 1 };

export default function FixedIncomeDetailDrawer({ isOpen, onClose, instrument }) {
  if (!instrument) return null;

  const changeValue = parseFloat(instrument.change);
  const isPositive = changeValue >= 0;

  // Generate related insights based on instrument type
  const getRelatedInsights = () => {
    const insights = {
      'U.S. Treasuries': [
        { label: 'Duration', value: 'Long-end stabilizing', sentiment: 'neutral' },
        { label: 'Curve', value: '2s10s at +35bps', sentiment: 'positive' },
        { label: 'Foreign Demand', value: 'Japan buying resumes', sentiment: 'positive' }
      ],
      'High Yield': [
        { label: 'Spreads', value: 'Tightening 12bps WoW', sentiment: 'positive' },
        { label: 'Issuance', value: 'Window opens post-Fed', sentiment: 'positive' },
        { label: 'Defaults', value: 'Sub-3% trailing 12M', sentiment: 'positive' }
      ],
      'T.I.P.S.': [
        { label: 'Breakevens', value: '5Y at 2.32%', sentiment: 'positive' },
        { label: 'Real Yields', value: 'Attractive vs nominal', sentiment: 'positive' },
        { label: 'Inflation Exp', value: 'Firming on energy', sentiment: 'neutral' }
      ],
      'High Grade': [
        { label: 'IG Spreads', value: '+95bps, near lows', sentiment: 'positive' },
        { label: 'Tech Issuance', value: 'Heavy supply absorbed', sentiment: 'neutral' },
        { label: 'Quality Mix', value: 'BBB widening vs AA', sentiment: 'negative' }
      ],
      'Municipals': [
        { label: 'Muni/Treasury', value: 'Ratio at 68%', sentiment: 'positive' },
        { label: 'Supply', value: 'Light seasonal pattern', sentiment: 'positive' },
        { label: 'Credit', value: 'State revenues solid', sentiment: 'positive' }
      ],
      'Convertibles': [
        { label: 'Equity Sensitivity', value: 'Delta rising to 0.65', sentiment: 'positive' },
        { label: 'New Issues', value: 'Tech converts popular', sentiment: 'positive' },
        { label: 'Premium', value: 'Trading tight to parity', sentiment: 'neutral' }
      ]
    };

    return insights[instrument.name] || [
      { label: 'Market Depth', value: 'Moderate liquidity', sentiment: 'neutral' },
      { label: 'Flows', value: 'Steady institutional', sentiment: 'positive' },
      { label: 'Technicals', value: 'Support holding', sentiment: 'positive' }
    ];
  };

  const relatedInsights = getRelatedInsights();

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'rgba(16, 185, 129, 0.12)';
      case 'negative': return 'rgba(239, 68, 68, 0.12)';
      default: return 'rgba(147, 197, 253, 0.08)';
    }
  };

  const getSentimentBorder = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'rgba(16, 185, 129, 0.20)';
      case 'negative': return 'rgba(239, 68, 68, 0.20)';
      default: return 'rgba(147, 197, 253, 0.15)';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[100]"
            style={{
              background: 'rgba(0, 0, 0, 0.60)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)'
            }}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={HORIZON_SPRING}
            className="fixed top-0 right-0 bottom-0 w-full md:w-[560px] z-[101] overflow-y-auto"
            style={{
              background: 'linear-gradient(180deg, rgba(12, 14, 18, 0.98) 0%, rgba(10, 12, 16, 0.98) 100%)',
              backdropFilter: 'blur(40px) saturate(165%)',
              WebkitBackdropFilter: 'blur(40px) saturate(165%)',
              borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '-8px 0 40px rgba(0, 0, 0, 0.3)'
            }}
          >
            <div className="p-8 space-y-8">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5" style={{ color: 'rgba(147, 197, 253, 0.8)' }} />
                    <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'rgba(147, 197, 253, 0.8)' }}>
                      Fixed Income Insight
                    </h2>
                  </div>
                  <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.48)' }}>
                    Updated just now
                  </p>
                </div>
                <motion.button
                  onClick={onClose}
                  className="rounded-full p-2"
                  style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}
                  whileHover={{
                    background: 'rgba(255, 255, 255, 0.10)',
                    scale: 1.05
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.70)' }} />
                </motion.button>
              </div>

              {/* Main Instrument Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, ...HORIZON_SPRING }}
                className="rounded-[24px] overflow-hidden"
                style={{
                  padding: '32px',
                  background: `linear-gradient(145deg, ${
                    isPositive 
                      ? 'rgba(16, 185, 129, 0.08), rgba(16, 185, 129, 0.04)' 
                      : 'rgba(239, 68, 68, 0.08), rgba(239, 68, 68, 0.04)'
                  })`,
                  backdropFilter: 'blur(28px) saturate(160%)',
                  WebkitBackdropFilter: 'blur(28px) saturate(160%)',
                  border: `1px solid ${isPositive ? 'rgba(16, 185, 129, 0.20)' : 'rgba(239, 68, 68, 0.20)'}`,
                  boxShadow: `inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 0 20px ${
                    isPositive ? 'rgba(16, 185, 129, 0.10)' : 'rgba(239, 68, 68, 0.10)'
                  }`
                }}
              >
                <div className="space-y-5">
                  {/* Large % Change */}
                  <div className="flex items-center gap-3">
                    {isPositive ? (
                      <TrendingUp className="w-8 h-8" style={{ color: 'rgba(16, 185, 129, 0.9)' }} />
                    ) : (
                      <TrendingDown className="w-8 h-8" style={{ color: 'rgba(239, 68, 68, 0.9)' }} />
                    )}
                    <div className="text-6xl font-extrabold" style={{
                      color: 'rgba(255,255,255,0.96)',
                      letterSpacing: '-0.03em',
                      fontVariantNumeric: 'tabular-nums'
                    }}>
                      {changeValue >= 0 ? '+' : ''}{changeValue.toFixed(2)}%
                    </div>
                  </div>

                  {/* Narrative */}
                  <p className="text-lg font-medium leading-relaxed" style={{
                    color: 'rgba(255,255,255,0.82)',
                    letterSpacing: '0.005em'
                  }}>
                    {instrument.whyMatters}
                  </p>

                  {/* Instrument Name */}
                  <div className="pt-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                    <p className="text-sm font-bold uppercase tracking-wider" style={{
                      color: 'rgba(255,255,255,0.52)'
                    }}>
                      {instrument.name}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Related Insights */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider" style={{
                  color: 'rgba(255,255,255,0.48)'
                }}>
                  Market Dynamics
                </h3>

                <div className="space-y-3">
                  {relatedInsights.map((insight, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.05, ...HORIZON_SPRING }}
                      className="rounded-[18px] overflow-hidden"
                      style={{
                        padding: '20px 24px',
                        background: `linear-gradient(145deg, ${getSentimentColor(insight.sentiment)}, transparent)`,
                        backdropFilter: 'blur(20px) saturate(155%)',
                        WebkitBackdropFilter: 'blur(20px) saturate(155%)',
                        border: `1px solid ${getSentimentBorder(insight.sentiment)}`,
                        boxShadow: 'inset 0 0.5px 0 rgba(255, 255, 255, 0.06)'
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{
                            color: 'rgba(255,255,255,0.52)'
                          }}>
                            {insight.label}
                          </p>
                          <p className="text-base font-bold" style={{
                            color: 'rgba(255,255,255,0.92)'
                          }}>
                            {insight.value}
                          </p>
                        </div>
                        {insight.sentiment === 'positive' && (
                          <TrendingUp className="w-5 h-5" style={{ color: 'rgba(16, 185, 129, 0.7)' }} />
                        )}
                        {insight.sentiment === 'negative' && (
                          <TrendingDown className="w-5 h-5" style={{ color: 'rgba(239, 68, 68, 0.7)' }} />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Bottom Context */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="rounded-[18px] overflow-hidden"
                style={{
                  padding: '18px 22px',
                  background: 'linear-gradient(180deg, rgba(110, 180, 255, 0.06) 0%, rgba(110, 180, 255, 0.03) 100%)',
                  backdropFilter: 'blur(20px) saturate(165%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(165%)',
                  border: '1px solid rgba(110, 180, 255, 0.12)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)'
                }}
              >
                <p className="text-sm font-medium leading-relaxed" style={{
                  color: 'rgba(255,255,255,0.76)'
                }}>
                  Fixed income dynamics shifting as rates stabilize and credit tightens.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}