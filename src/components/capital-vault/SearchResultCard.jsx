import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Sparkles, Link2, AlertTriangle } from 'lucide-react';
import ProLevelCard from './ProLevelCard';
import NoviceLevelCard from './NoviceLevelCard';
import FirstPrinciplesCard from './FirstPrinciplesCard';

const EASE = [0.26, 0.11, 0.26, 1.0];

const GLASS_PANEL = {
  borderRadius: '20px',
  background: 'linear-gradient(180deg, rgba(20,24,36,0.72) 0%, rgba(14,18,28,0.80) 100%)',
  backdropFilter: 'blur(36px) saturate(162%)',
  WebkitBackdropFilter: 'blur(36px) saturate(162%)',
  border: '1px solid rgba(255,255,255,0.09)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 6px 28px rgba(0,0,0,0.22)'
};

export default function SearchResultCard({ data, viewMode, onTermClick }) {
  if (!data) return null;

  const aiInsight = `${data.term || 'This concept'} is actively relevant in current market dynamics. Understanding it helps connect macro signals to portfolio implications.`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: EASE }}
      className="space-y-5"
    >
      {/* Term Header Card */}
      <div className="relative p-6" style={GLASS_PANEL}>
        <div style={{
          position: 'absolute', top: 0, left: '15%', right: '15%', height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(100, 160, 255, 0.22), transparent)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '20px',
          background: 'radial-gradient(ellipse at 50% 0%, rgba(80, 130, 255, 0.06) 0%, transparent 60%)',
          pointerEvents: 'none'
        }} />

        <div className="relative z-10 flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(100, 160, 255, 0.12)', border: '1px solid rgba(100, 160, 255, 0.22)' }}>
            <BookOpen className="w-5 h-5" style={{ color: 'rgba(100, 175, 255, 0.88)' }} strokeWidth={1.8} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-black mb-1" style={{
              color: 'rgba(255,255,255,0.96)', letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, #F0F4FF 0%, #C8D8FF 60%, #A8B8FF 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
            }}>
              {data.term}
            </h2>
            {data.category && (
              <span className="text-[12px] font-medium px-2.5 py-0.5 rounded-full"
                style={{ background: 'rgba(100, 160, 255, 0.10)', border: '1px solid rgba(100, 160, 255, 0.18)', color: 'rgba(140, 190, 255, 0.80)' }}>
                {data.category}
              </span>
            )}
          </div>
          {data.difficulty && (
            <div className="px-3 py-1 rounded-full text-[12px] font-semibold flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', color: 'rgba(200,210,235,0.70)' }}>
              {data.difficulty}
            </div>
          )}
        </div>
      </div>

      {/* AI Market Context */}
      <div className="relative p-5 rounded-[18px]"
        style={{
          background: 'linear-gradient(180deg, rgba(80, 130, 255, 0.07) 0%, rgba(60, 100, 220, 0.05) 100%)',
          backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)',
          border: '1px solid rgba(100, 160, 255, 0.14)',
          boxShadow: 'inset 0 1px 0 rgba(100, 160, 255, 0.08)'
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4" style={{ color: 'rgba(100, 175, 255, 0.82)' }} />
          <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'rgba(100, 175, 255, 0.72)' }}>
            Ori — Market Context
          </span>
        </div>
        <p className="text-[13.5px] leading-relaxed" style={{ color: 'rgba(210, 220, 245, 0.82)' }}>
          {aiInsight}
        </p>
      </div>

      {/* Main Content Card */}
      <AnimatePresence mode="wait">
        {viewMode === 'pro' && data.pro_level && (
          <motion.div key="pro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
            <ProLevelCard data={data.pro_level} theme="dark" />
          </motion.div>
        )}
        {viewMode === 'novice' && data.novice_level && (
          <motion.div key="novice" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
            <NoviceLevelCard data={data.novice_level} theme="dark" />
          </motion.div>
        )}
        {(viewMode === 'principles' || viewMode === 'ai') && data.first_principles && (
          <motion.div key="principles" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
            <FirstPrinciplesCard data={data.first_principles} theme="dark" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Related Concepts */}
      {data.related_terms?.length > 0 && (
        <div className="relative p-5" style={{ ...GLASS_PANEL, borderRadius: '18px' }}>
          <div style={{
            position: 'absolute', top: 0, left: '15%', right: '15%', height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)',
            pointerEvents: 'none'
          }} />
          <div className="flex items-center gap-2 mb-4">
            <Link2 className="w-4 h-4" style={{ color: 'rgba(160,170,195,0.60)' }} />
            <span className="text-[13px] font-semibold" style={{ color: 'rgba(220,225,245,0.82)' }}>Related Concepts</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.related_terms.map(term => (
              <button key={term} onClick={() => onTermClick(term)}
                className="px-3 py-1.5 rounded-full text-[12.5px] font-medium transition-all duration-150 hover:scale-105"
                style={{ background: 'rgba(100, 160, 255, 0.08)', border: '1px solid rgba(100, 160, 255, 0.16)', color: 'rgba(150, 195, 255, 0.82)' }}
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Common Pitfalls */}
      {data.common_pitfalls?.length > 0 && (
        <div className="relative p-5" style={{ ...GLASS_PANEL, borderRadius: '18px', border: '1px solid rgba(255, 180, 80, 0.12)' }}>
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '18px',
            background: 'radial-gradient(ellipse at 50% 0%, rgba(255, 165, 60, 0.05) 0%, transparent 60%)',
            pointerEvents: 'none'
          }} />
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4" style={{ color: 'rgba(255, 185, 80, 0.80)' }} />
            <span className="text-[13px] font-semibold" style={{ color: 'rgba(220,225,245,0.82)' }}>Common Pitfalls</span>
          </div>
          <ul className="space-y-2">
            {data.common_pitfalls.map((pitfall, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'rgba(255, 185, 80, 0.70)' }} />
                <span className="text-[13px]" style={{ color: 'rgba(200, 210, 230, 0.70)' }}>{pitfall}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}