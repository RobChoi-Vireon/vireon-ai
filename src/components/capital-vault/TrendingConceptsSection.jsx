import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const TRENDING_CONCEPTS = [
  {
    name: "Term Premium",
    definition: "The additional yield investors demand for holding long-term bonds instead of rolling short-term debt.",
    whyMatters: ["Signals inflation expectations", "Impacts long-term interest rates", "Influences equity valuation"],
    accent: 'rgba(255, 190, 90, 0.80)',
    glow: 'rgba(255, 170, 60, 0.09)'
  },
  {
    name: "Convexity",
    definition: "A measure of the curvature in the relationship between bond prices and yields, determining how duration changes as rates move.",
    whyMatters: ["Determines bond price sensitivity", "Critical for mortgage hedging", "Drives rates market volatility"],
    accent: 'rgba(100, 180, 255, 0.85)',
    glow: 'rgba(80, 160, 255, 0.09)'
  },
  {
    name: "Equity Risk Premium",
    definition: "The excess return an investor expects from stocks over the risk-free rate, compensating for taking on equity market risk.",
    whyMatters: ["Core input in equity valuation", "Reflects market fear or greed", "Changes with macro regime"],
    accent: 'rgba(88, 227, 164, 0.80)',
    glow: 'rgba(70, 210, 140, 0.09)'
  },
  {
    name: "Credit Spread",
    definition: "The yield difference between a corporate bond and a comparable maturity Treasury, representing credit and liquidity risk.",
    whyMatters: ["Reflects default risk pricing", "Leads equity volatility", "Impacts corporate funding costs"],
    accent: 'rgba(200, 140, 255, 0.80)',
    glow: 'rgba(180, 120, 255, 0.09)'
  }
];

const EASE = [0.26, 0.11, 0.26, 1.0];

export default function TrendingConceptsSection({ onSearch }) {
  return (
    <section>
      <div className="flex items-baseline gap-4 mb-6">
        <h2 className="text-xl font-semibold" style={{ color: 'rgba(255,255,255,0.94)', letterSpacing: '-0.02em' }}>
          Trending Financial Concepts
        </h2>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.42)' }}>Most searched this week</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {TRENDING_CONCEPTS.map((concept, i) => (
          <motion.div
            key={concept.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.07, duration: 0.4, ease: EASE }}
            whileHover={{ y: -3, transition: { duration: 0.15, ease: EASE } }}
            onClick={() => onSearch(concept.name)}
            className="cursor-pointer relative"
            style={{
              borderRadius: '18px',
              background: 'linear-gradient(180deg, rgba(18,22,34,0.68) 0%, rgba(12,16,26,0.75) 100%)',
              backdropFilter: 'blur(28px) saturate(155%)',
              WebkitBackdropFilter: 'blur(28px) saturate(155%)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: `inset 0 1px 0 rgba(255,255,255,0.05), 0 4px 16px rgba(0,0,0,0.16)`,
              padding: '20px'
            }}
          >
            {/* Accent glow */}
            <div style={{
              position: 'absolute', inset: 0, borderRadius: '18px',
              background: `radial-gradient(ellipse at 50% 0%, ${concept.glow} 0%, transparent 60%)`,
              pointerEvents: 'none'
            }} />

            {/* Top specular */}
            <div style={{
              position: 'absolute', top: 0, left: '18%', right: '18%', height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.11), transparent)',
              pointerEvents: 'none'
            }} />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-[14px] font-bold" style={{ color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.005em' }}>
                  {concept.name}
                </h3>
                <ArrowUpRight className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: 'rgba(160,170,195,0.40)' }} />
              </div>

              <p className="text-[12.5px] leading-relaxed mb-4 italic" style={{ color: 'rgba(195,205,225,0.68)' }}>
                "{concept.definition}"
              </p>

              <div>
                <p className="text-[10.5px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'rgba(155,165,185,0.52)' }}>
                  Why it matters
                </p>
                <ul className="space-y-1">
                  {concept.whyMatters.map((p, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: concept.accent }} />
                      <span className="text-[11.5px]" style={{ color: 'rgba(185,195,220,0.64)' }}>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}