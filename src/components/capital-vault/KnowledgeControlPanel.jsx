import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BookOpen, Target, Sparkles, Hash } from 'lucide-react';

const VIEW_MODES = [
  { id: 'pro', label: 'Pro Level', sub: 'Institutional-grade', icon: TrendingUp, accent: 'rgba(100, 175, 255, 0.85)' },
  { id: 'novice', label: 'Novice Level', sub: 'Simplified explanations', icon: BookOpen, accent: 'rgba(88, 227, 164, 0.85)' },
  { id: 'principles', label: 'First Principles', sub: 'Concept from fundamentals', icon: Target, accent: 'rgba(200, 145, 255, 0.85)' },
  { id: 'ai', label: 'AI Insight', sub: 'Real-time market context', icon: Sparkles, accent: 'rgba(255, 185, 80, 0.85)' },
];

const TRENDING_TOPICS = [
  'Inflation', 'Term Premium', 'Credit Stress', 'Liquidity', 'Yield Curve', 'Volatility', 'Duration', 'Fed Policy'
];

const GLASS_PANEL = {
  background: 'linear-gradient(180deg, rgba(20,24,36,0.70) 0%, rgba(14,18,28,0.78) 100%)',
  backdropFilter: 'blur(32px) saturate(160%)',
  WebkitBackdropFilter: 'blur(32px) saturate(160%)',
  border: '1px solid rgba(255,255,255,0.08)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 4px 18px rgba(0,0,0,0.14)'
};

export default function KnowledgeControlPanel({ viewMode, setViewMode, onSearch }) {
  return (
    <div className="space-y-4 sticky top-8">
      {/* Header */}
      <div>
        <h3 className="text-base font-bold mb-0.5" style={{ color: 'rgba(255,255,255,0.88)', letterSpacing: '-0.005em' }}>
          Knowledge Controls
        </h3>
        <p className="text-[12px]" style={{ color: 'rgba(160,170,190,0.55)' }}>Adjust how concepts are explained</p>
      </div>

      {/* View Modes */}
      <div className="relative rounded-[18px] p-4" style={GLASS_PANEL}>
        {/* Top highlight */}
        <div style={{
          position: 'absolute', top: 0, left: '15%', right: '15%', height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)',
          borderRadius: '1px', pointerEvents: 'none'
        }} />

        <p className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: 'rgba(160,170,190,0.55)' }}>View Mode</p>
        <div className="space-y-1.5">
          {VIEW_MODES.map(mode => {
            const Icon = mode.icon;
            const isActive = viewMode === mode.id;
            return (
              <motion.button
                key={mode.id}
                onClick={() => setViewMode(mode.id)}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-left transition-all duration-150 relative"
                style={{
                  background: isActive
                    ? `linear-gradient(135deg, ${mode.accent.replace('0.85', '0.12')} 0%, ${mode.accent.replace('0.85', '0.06')} 100%)`
                    : 'rgba(255,255,255,0.03)',
                  border: isActive
                    ? `1px solid ${mode.accent.replace('0.85', '0.22')}`
                    : '1px solid transparent',
                }}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: isActive ? mode.accent.replace('0.85', '0.15') : 'rgba(255,255,255,0.06)',
                    border: `1px solid ${isActive ? mode.accent.replace('0.85', '0.28') : 'rgba(255,255,255,0.06)'}`
                  }}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: isActive ? mode.accent : 'rgba(160,170,195,0.60)', strokeWidth: 1.8 }} />
                </div>
                <div>
                  <p className="text-[13px] font-semibold" style={{ color: isActive ? 'rgba(255,255,255,0.95)' : 'rgba(200,210,230,0.72)' }}>
                    {mode.label}
                  </p>
                  <p className="text-[11px]" style={{ color: 'rgba(155,165,185,0.52)' }}>{mode.sub}</p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Trending Topics */}
      <div className="relative rounded-[18px] p-4" style={GLASS_PANEL}>
        <div style={{
          position: 'absolute', top: 0, left: '15%', right: '15%', height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)',
          borderRadius: '1px', pointerEvents: 'none'
        }} />

        <div className="flex items-center gap-2 mb-3">
          <Hash className="w-3.5 h-3.5" style={{ color: 'rgba(160,170,190,0.55)' }} />
          <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'rgba(160,170,190,0.55)' }}>Trending Topics</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {TRENDING_TOPICS.map(topic => (
            <button
              key={topic}
              onClick={() => onSearch(topic)}
              className="px-2.5 py-1 rounded-full text-[12px] font-medium transition-all duration-150 hover:scale-105"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.09)',
                color: 'rgba(195,205,228,0.70)'
              }}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}