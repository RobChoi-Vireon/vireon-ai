import React from 'react';
import { motion } from 'framer-motion';
import { Globe, BarChart2, Layers, Cpu, TrendingUp, Briefcase, BookOpen, Activity } from 'lucide-react';

const CATEGORIES = [
  { name: 'Macro', icon: Globe, description: 'Monetary policy, inflation, yield curves, and global economic dynamics.', accent: 'rgba(255, 185, 80, 0.75)', glow: 'rgba(255, 165, 60, 0.09)' },
  { name: 'Fixed Income', icon: BarChart2, description: 'Bond pricing, duration, convexity, yield curves, and credit spreads.', accent: 'rgba(100, 180, 255, 0.80)', glow: 'rgba(80, 160, 255, 0.09)' },
  { name: 'Derivatives', icon: Layers, description: 'Options, futures, Greeks, volatility surfaces, and hedging strategies.', accent: 'rgba(200, 140, 255, 0.80)', glow: 'rgba(180, 120, 255, 0.09)' },
  { name: 'Quant', icon: Cpu, description: 'Statistical models, factor investing, alpha generation, and risk frameworks.', accent: 'rgba(88, 227, 164, 0.75)', glow: 'rgba(70, 210, 140, 0.09)' },
  { name: 'Markets', icon: TrendingUp, description: 'Equity market structure, microstructure, liquidity, and price discovery.', accent: 'rgba(125, 210, 255, 0.80)', glow: 'rgba(100, 190, 255, 0.09)' },
  { name: 'Corporate Finance', icon: Briefcase, description: 'Valuation, WACC, capital structure, M&A, and corporate strategy.', accent: 'rgba(255, 155, 100, 0.80)', glow: 'rgba(255, 135, 80, 0.09)' },
  { name: 'Accounting', icon: BookOpen, description: 'Financial statements, GAAP/IFRS, ratio analysis, and forensic accounting.', accent: 'rgba(160, 200, 120, 0.80)', glow: 'rgba(140, 180, 100, 0.09)' },
  { name: 'Statistics', icon: Activity, description: 'Probability, regression, time series, and quantitative risk measurement.', accent: 'rgba(160, 130, 255, 0.80)', glow: 'rgba(140, 110, 255, 0.09)' },
];

const EASE = [0.26, 0.11, 0.26, 1.0];

export default function CategoryExplorer({ onCategorySelect }) {
  return (
    <section>
      <div className="flex items-baseline gap-4 mb-6">
        <h2 className="text-xl font-semibold" style={{ color: 'rgba(255,255,255,0.94)', letterSpacing: '-0.02em' }}>
          Explore Financial Concepts
        </h2>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.42)' }}>Browse by category</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {CATEGORIES.map((cat, i) => {
          const Icon = cat.icon;
          return (
            <motion.button
              key={cat.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.05, duration: 0.35, ease: EASE }}
              whileHover={{ y: -3, transition: { duration: 0.14, ease: EASE } }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onCategorySelect(cat.name)}
              className="text-left relative"
              style={{
                borderRadius: '16px',
                background: 'linear-gradient(180deg, rgba(18,22,34,0.66) 0%, rgba(12,16,26,0.74) 100%)',
                backdropFilter: 'blur(28px) saturate(155%)',
                WebkitBackdropFilter: 'blur(28px) saturate(155%)',
                border: '1px solid rgba(255,255,255,0.07)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 3px 14px rgba(0,0,0,0.14)',
                padding: '18px'
              }}
            >
              {/* Ambient glow */}
              <div style={{
                position: 'absolute', inset: 0, borderRadius: '16px',
                background: `radial-gradient(ellipse at 50% 0%, ${cat.glow} 0%, transparent 65%)`,
                pointerEvents: 'none'
              }} />
              <div style={{
                position: 'absolute', top: 0, left: '20%', right: '20%', height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.09), transparent)',
                pointerEvents: 'none'
              }} />

              <div className="relative z-10">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: `1px solid ${cat.accent.replace('0.80', '0.18')}`,
                    boxShadow: `0 0 14px ${cat.glow}`
                  }}
                >
                  <Icon className="w-4.5 h-4.5" style={{ color: cat.accent, width: '18px', height: '18px' }} strokeWidth={1.8} />
                </div>
                <h3 className="text-[13.5px] font-bold mb-1.5" style={{ color: 'rgba(255,255,255,0.92)', letterSpacing: '-0.005em' }}>
                  {cat.name}
                </h3>
                <p className="text-[11.5px] leading-relaxed" style={{ color: 'rgba(175,185,210,0.58)' }}>
                  {cat.description}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}