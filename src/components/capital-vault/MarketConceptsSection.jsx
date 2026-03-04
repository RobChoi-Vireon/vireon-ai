import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ArrowUpRight } from 'lucide-react';

const MARKET_CONCEPTS = [
  {
    name: "Term Premium",
    trend: "↑",
    trendDir: "up",
    summary: "Higher long-end Treasury yields are increasingly being driven by term premium repricing rather than Fed policy expectations.",
    whyMatters: ["Raises long-term borrowing costs", "Impacts equity valuations via discount rates", "Signals elevated inflation risk premium"],
    related: ["Duration", "Treasury Supply", "Yield Curve"],
    accentColor: 'rgba(255, 180, 80, 0.75)',
    glowColor: 'rgba(255, 160, 60, 0.12)',
    borderColor: 'rgba(255, 180, 80, 0.18)'
  },
  {
    name: "Convexity Hedging",
    trend: "↑",
    trendDir: "up",
    summary: "Mortgage investors are adjusting hedges as rate volatility increases, amplifying moves in the long end of the Treasury curve.",
    whyMatters: ["Can accelerate rate volatility", "Impacts bond market liquidity", "Influences mortgage spread widening"],
    related: ["Duration", "MBS", "Negative Convexity"],
    accentColor: 'rgba(120, 180, 255, 0.80)',
    glowColor: 'rgba(100, 160, 255, 0.10)',
    borderColor: 'rgba(120, 180, 255, 0.18)'
  },
  {
    name: "Credit Spread Compression",
    trend: "→",
    trendDir: "neutral",
    summary: "Investment-grade and high-yield spreads remain historically tight despite elevated macro uncertainty, driven by strong technical demand.",
    whyMatters: ["Signals risk appetite and liquidity", "Affects corporate funding costs", "Diverges from fundamental risk signals"],
    related: ["OAS", "Default Risk", "IG/HY Basis"],
    accentColor: 'rgba(88, 227, 164, 0.75)',
    glowColor: 'rgba(70, 210, 140, 0.10)',
    borderColor: 'rgba(88, 227, 164, 0.16)'
  }
];

const EASE = [0.26, 0.11, 0.26, 1.0];

export default function MarketConceptsSection({ onSearch }) {
  return (
    <section>
      <div className="flex items-baseline gap-4 mb-6">
        <h2 className="text-xl font-semibold" style={{ color: 'rgba(255,255,255,0.94)', letterSpacing: '-0.02em' }}>
          Concepts Driving Markets Today
        </h2>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.42)' }}>Live macro connections</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {MARKET_CONCEPTS.map((concept, i) => (
          <motion.div
            key={concept.name}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4, ease: EASE }}
            whileHover={{ y: -3, transition: { duration: 0.15, ease: EASE } }}
            onClick={() => onSearch(concept.name)}
            className="cursor-pointer relative overflow-visible"
            style={{
              borderRadius: '20px',
              background: `linear-gradient(180deg, rgba(20,24,36,0.70) 0%, rgba(14,18,28,0.80) 100%)`,
              backdropFilter: 'blur(32px) saturate(160%)',
              WebkitBackdropFilter: 'blur(32px) saturate(160%)',
              border: `1px solid ${concept.borderColor}`,
              boxShadow: `inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 20px rgba(0,0,0,0.18)`,
              padding: '22px'
            }}
          >
            {/* Ambient glow */}
            <div style={{
              position: 'absolute', inset: 0, borderRadius: '20px',
              background: `radial-gradient(ellipse at 50% 0%, ${concept.glowColor} 0%, transparent 65%)`,
              pointerEvents: 'none'
            }} />

            {/* Top highlight */}
            <div style={{
              position: 'absolute', top: 0, left: '20%', right: '20%', height: '1px',
              background: `linear-gradient(90deg, transparent, ${concept.accentColor.replace('0.75', '0.22')}, transparent)`,
              pointerEvents: 'none'
            }} />

            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-[15px] font-semibold" style={{ color: 'rgba(255,255,255,0.96)', letterSpacing: '-0.015em' }}>
                      {concept.name}
                    </h3>
                    <span className="text-sm font-bold" style={{ color: concept.accentColor }}>{concept.trend}</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'rgba(160,170,195,0.45)' }} />
              </div>

              {/* Summary */}
              <p className="text-[13px] leading-relaxed mb-4" style={{ color: 'rgba(200,210,230,0.72)' }}>
                {concept.summary}
              </p>

              {/* Why it matters */}
              <div className="mb-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'rgba(160,170,190,0.55)' }}>
                  Why it matters
                </p>
                <ul className="space-y-1">
                  {concept.whyMatters.map((point, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: concept.accentColor }} />
                      <span className="text-[12px]" style={{ color: 'rgba(195,205,225,0.68)' }}>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Related */}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'rgba(160,170,190,0.55)' }}>
                  Related
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {concept.related.map(r => (
                    <span
                      key={r}
                      className="px-2.5 py-1 rounded-full text-[11px] font-medium"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        color: 'rgba(200,210,235,0.72)'
                      }}
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}