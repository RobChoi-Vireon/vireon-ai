import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowUpRight } from 'lucide-react';

const AI_INSIGHTS = [
  {
    concept: "Convexity Hedging",
    insight: "Treasury volatility is increasing convexity hedging flows from mortgage investors, amplifying long-end yield moves and contributing to front-end/back-end divergence.",
    tags: ["Rates", "MBS", "Volatility"],
    accentColor: 'rgba(100, 175, 255, 0.85)',
    glowColor: 'rgba(80, 150, 255, 0.09)',
  },
  {
    concept: "Credit Spread Compression",
    insight: "Credit spreads remain historically tight relative to macro risk, suggesting positioning and technical liquidity flows are dominant drivers over fundamental credit deterioration.",
    tags: ["HY", "IG", "Technicals"],
    accentColor: 'rgba(88, 227, 164, 0.80)',
    glowColor: 'rgba(70, 210, 140, 0.09)',
  },
  {
    concept: "Term Premium Repricing",
    insight: "Recent increases in long-end yields appear driven more by term premium expansion than shifts in Fed expectations, as Treasury supply dynamics and fiscal uncertainty weigh on real yields.",
    tags: ["Rates", "Treasury", "Macro"],
    accentColor: 'rgba(255, 185, 80, 0.80)',
    glowColor: 'rgba(255, 165, 60, 0.09)',
  }
];

const EASE = [0.26, 0.11, 0.26, 1.0];

export default function AIInsightsSection({ onSearch }) {
  return (
    <section>
      <div className="flex items-baseline gap-4 mb-6">
        <h2 className="text-xl font-bold" style={{ color: 'rgba(255,255,255,0.94)', letterSpacing: '-0.01em' }}>
          AI Market Concepts Today
        </h2>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.42)' }}>Powered by Ori</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {AI_INSIGHTS.map((item, i) => (
          <motion.div
            key={item.concept}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 + i * 0.08, duration: 0.4, ease: EASE }}
            whileHover={{ y: -3, transition: { duration: 0.15, ease: EASE } }}
            onClick={() => onSearch(item.concept)}
            className="cursor-pointer relative"
            style={{
              borderRadius: '20px',
              background: 'linear-gradient(180deg, rgba(18,22,34,0.68) 0%, rgba(12,16,26,0.76) 100%)',
              backdropFilter: 'blur(32px) saturate(162%)',
              WebkitBackdropFilter: 'blur(32px) saturate(162%)',
              border: `1px solid ${item.accentColor.replace('0.85', '0.14')}`,
              boxShadow: `inset 0 1px 0 rgba(255,255,255,0.05), 0 4px 20px rgba(0,0,0,0.16)`,
              padding: '22px'
            }}
          >
            {/* Glow */}
            <div style={{
              position: 'absolute', inset: 0, borderRadius: '20px',
              background: `radial-gradient(ellipse at 50% 0%, ${item.glowColor} 0%, transparent 60%)`,
              pointerEvents: 'none'
            }} />
            <div style={{
              position: 'absolute', top: 0, left: '20%', right: '20%', height: '1px',
              background: `linear-gradient(90deg, transparent, ${item.accentColor.replace('0.80', '0.20')}, transparent)`,
              pointerEvents: 'none'
            }} />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-[14px] font-bold" style={{ color: 'rgba(255,255,255,0.96)', letterSpacing: '-0.005em' }}>
                  {item.concept}
                </h3>
                <ArrowUpRight className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'rgba(160,170,195,0.40)' }} />
              </div>

              {/* AI Insight block */}
              <div
                className="p-4 rounded-[14px] mb-4 relative"
                style={{
                  background: `linear-gradient(180deg, rgba(90, 140, 255, 0.06) 0%, rgba(70, 110, 220, 0.04) 100%)`,
                  border: '1px solid rgba(100, 160, 255, 0.12)'
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-3.5 h-3.5" style={{ color: 'rgba(100, 175, 255, 0.80)' }} />
                  <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'rgba(100, 175, 255, 0.72)' }}>
                    Ori Insight
                  </span>
                </div>
                <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(210, 220, 240, 0.82)' }}>
                  {item.insight}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 rounded-full text-[11px] font-medium"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: 'rgba(190,200,225,0.68)'
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}