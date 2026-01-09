import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react';

const getImplicationDetails = (implication) => {
  if (!implication) return null;

  const baseDetails = {
    'Rates': {
      up: {
        title: 'Rates Markets',
        subtitle: 'Rising pressure',
        what: 'The Federal Reserve is staying tough on inflation because prices keep rising. This means borrowing costs will stay high or go higher.',
        downstream: [
          { text: 'Borrowing costs rising for companies', tags: ['credit', 'hy', 'ig'] },
          { text: 'Tech stock valuations under pressure', tags: ['tech', 'large-cap growth'] },
          { text: 'Emerging markets paying more to borrow', tags: ['em debt', 'fx funding'] }
        ],
        neutral: [
          { text: 'Regional banks adapting to new rate environment', tags: ['financials', 'lending'] }
        ],
        upside: [
          { text: 'Higher yields attract bond investors', tags: ['fixed income', 'treasuries'] }
        ]
      },
      down: {
        title: 'Rates Markets',
        subtitle: 'Easing pressure',
        what: 'The Federal Reserve may start cutting interest rates as inflation cools, making borrowing cheaper.',
        downstream: [
          { text: 'Lower borrowing costs for companies', tags: ['credit', 'refinancing'] },
          { text: 'Growth stocks becoming more attractive', tags: ['tech', 'innovation'] }
        ],
        neutral: [
          { text: 'Banks adjusting to lower rate environment', tags: ['financials'] }
        ],
        upside: [
          { text: 'Corporate expansion opportunities increase', tags: ['growth', 'm&a'] }
        ]
      }
    },
    'Equities': {
      down: {
        title: 'Equity Markets',
        subtitle: 'Compression risk',
        what: 'Higher interest rates make stocks less attractive compared to bonds, putting pressure on stock valuations.',
        downstream: [
          { text: 'Growth stocks facing valuation pressure', tags: ['tech', 'high-growth'] },
          { text: 'Dividend stocks becoming more competitive', tags: ['income', 'value'] }
        ],
        neutral: [
          { text: 'Quality companies holding steady', tags: ['large-cap', 'defensives'] }
        ],
        upside: [
          { text: 'Value stocks may outperform', tags: ['value', 'traditional'] }
        ]
      },
      up: {
        title: 'Equity Markets',
        subtitle: 'Expansion opportunity',
        what: 'Lower rates make stocks more attractive, supporting higher valuations.',
        downstream: [
          { text: 'Growth stocks rallying on lower rates', tags: ['tech', 'innovation'] }
        ],
        neutral: [
          { text: 'Broad market participation improving', tags: ['indices'] }
        ],
        upside: [
          { text: 'Risk appetite returning to markets', tags: ['growth', 'small-cap'] }
        ]
      }
    },
    'Credit': {
      neutral: {
        title: 'Credit Markets',
        subtitle: 'Spreads stable',
        what: 'Corporate bond spreads remain steady despite inflation concerns, showing investor confidence in credit quality.',
        downstream: [
          { text: 'Investment-grade issuance steady', tags: ['ig', 'corporate bonds'] }
        ],
        neutral: [
          { text: 'High-yield spreads unchanged', tags: ['hy', 'credit'] }
        ],
        upside: [
          { text: 'Refinancing windows remain open', tags: ['corporate finance'] }
        ]
      }
    },
    'USD': {
      up: {
        title: 'Dollar Strength',
        subtitle: 'Rate differential support',
        what: 'Higher U.S. interest rates attract foreign investment, strengthening the dollar.',
        downstream: [
          { text: 'U.S. exporters facing headwinds', tags: ['industrials', 'trade'] },
          { text: 'Emerging market debt under pressure', tags: ['em', 'fx'] }
        ],
        neutral: [
          { text: 'Commodities priced in dollars adjust', tags: ['commodities'] }
        ],
        upside: [
          { text: 'U.S. importers benefit from strong dollar', tags: ['consumer', 'retail'] }
        ]
      }
    },
    'Risk': {
      down: {
        title: 'Risk Sentiment',
        subtitle: 'Policy uncertainty',
        what: 'Unclear Federal Reserve policy is making investors more cautious about taking risks.',
        downstream: [
          { text: 'Volatility increasing across asset classes', tags: ['vix', 'options'] },
          { text: 'Defensive sectors outperforming', tags: ['utilities', 'staples'] }
        ],
        neutral: [
          { text: 'Cash positions rising', tags: ['money markets'] }
        ],
        upside: [
          { text: 'Safe-haven assets attracting flows', tags: ['treasuries', 'gold'] }
        ]
      }
    }
  };

  const details = baseDetails[implication.label]?.[implication.direction];
  return details || {
    title: implication.label,
    subtitle: implication.note || 'Market impact',
    what: `${implication.label} showing ${implication.direction} movement based on current inflation trends.`,
    downstream: [],
    neutral: [],
    upside: []
  };
};

const EffectCard = ({ title, effects }) => {
  if (!effects || effects.length === 0) return null;

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.50)' }}>
        {title}
      </h4>
      {effects.map((effect, idx) => (
        <div 
          key={idx}
          className="p-4 rounded-xl"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255,255,255,0.06)'
          }}
        >
          <p className="text-sm mb-2" style={{ color: 'rgba(255,255,255,0.85)' }}>
            {effect.text}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {effect.tags.map((tag, i) => (
              <span 
                key={i}
                className="text-[10px] px-2 py-0.5 rounded-md"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  color: 'rgba(255,255,255,0.55)'
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default function ImplicationDrawer({ isOpen, onClose, implication, onNavigate }) {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('drawer-open');
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose?.();
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.classList.remove('drawer-open');
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen || !implication) return null;

  const details = getImplicationDetails(implication);
  const Icon = implication.direction === 'up' ? TrendingUp : implication.direction === 'down' ? TrendingDown : Minus;
  const iconColor = implication.direction === 'up' ? '#58E3A4' : implication.direction === 'down' ? '#FF6A7A' : '#A8B3C7';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="fixed z-[201] w-full max-w-2xl rounded-3xl overflow-hidden border border-white/10"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              maxHeight: '85vh',
              background: 'linear-gradient(135deg, rgba(15, 15, 25, 0.95) 0%, rgba(10, 10, 15, 0.98) 100%)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.22, 0.61, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div 
                    className="p-3 rounded-xl"
                    style={{
                      background: `linear-gradient(135deg, ${iconColor}20, ${iconColor}10)`,
                      border: `1px solid ${iconColor}30`
                    }}
                  >
                    <Icon className="w-6 h-6" style={{ color: iconColor }} strokeWidth={2} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                      {details.title}
                    </h2>
                    <p className="text-sm mt-1" style={{ color: iconColor }}>
                      {details.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {onNavigate && (
                    <>
                      <button
                        onClick={() => onNavigate('prev')}
                        className="p-2 rounded-xl hover:bg-white/10 transition-all"
                        style={{
                          background: 'rgba(255, 255, 255, 0.06)',
                          border: '1px solid rgba(255, 255, 255, 0.08)'
                        }}
                      >
                        <ChevronLeft className="w-5 h-5 text-gray-300" />
                      </button>
                      <button
                        onClick={() => onNavigate('next')}
                        className="p-2 rounded-xl hover:bg-white/10 transition-all"
                        style={{
                          background: 'rgba(255, 255, 255, 0.06)',
                          border: '1px solid rgba(255, 255, 255, 0.08)'
                        }}
                      >
                        <ChevronRight className="w-5 h-5 text-gray-300" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={onClose}
                    className="p-2 rounded-xl hover:bg-white/10 transition-all"
                    style={{
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.08)'
                    }}
                  >
                    <X className="w-6 h-6 text-gray-300" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto p-6 space-y-6" style={{ maxHeight: 'calc(85vh - 100px)' }}>
              {/* What It Means */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'rgba(255,255,255,0.50)' }}>
                  What It Means
                </h3>
                <p className="text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }}>
                  {details.what}
                </p>
              </div>

              {/* Downstream Effects */}
              <EffectCard title="Downstream Effects" effects={details.downstream} />

              {/* Neutral Effects */}
              <EffectCard title="Neutral" effects={details.neutral} />

              {/* Risk-Off Effects */}
              <EffectCard title="Risk-Off" effects={details.upside} />

              {/* Footer */}
              <div className="pt-4 border-t border-white/10">
                <p className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.40)' }}>
                  Updated {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}