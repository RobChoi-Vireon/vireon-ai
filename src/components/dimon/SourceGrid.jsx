import React from 'react';
import { motion } from 'framer-motion';
import SourceAccordion from './SourceAccordion';

const orderedSources = ["wapo", "nyt", "wsj", "ft", "economist"];

const generateAggregateSkew = (sources) => {
  if (!sources || sources.length === 0) return "No source analysis available.";
  
  const cautionaryCount = sources.filter(s => s.tones?.includes('cautionary')).length;
  const supportiveCount = sources.filter(s => s.tones?.includes('supportive')).length;
  const neutralCount = sources.filter(s => s.tones?.includes('neutral')).length;
  
  const riskySources = sources.filter(s => s.risk_flags?.length > 2).map(s => s.name || s.source?.toUpperCase()).slice(0, 2);
  const neutralSources = sources.filter(s => s.tones?.includes('neutral')).map(s => s.name || s.source?.toUpperCase()).slice(0, 2);
  
  if (cautionaryCount >= supportiveCount && riskySources.length > 0) {
    const riskText = riskySources.join(' and ');
    const neutralText = neutralSources.length > 0 ? `, while ${neutralSources.join(' and ')} coverage remains neutral` : '';
    return `Trusted source weighting tilts hawkish: **${riskText}** stress credit risk and China slowdown${neutralText}.`;
  } else if (supportiveCount > cautionaryCount) {
    return `Source consensus leans **bullish** with supportive narratives dominating across major publications.`;
  } else {
    return `Sources show **mixed signals** with balanced coverage across risk and opportunity themes.`;
  }
};

export default function SourceGrid({ sources, density }) {
  if (!Array.isArray(sources)) {
    return null;
  }
  
  const sortedSources = sources.sort((a, b) => orderedSources.indexOf(a.source) - orderedSources.indexOf(b.source));
  const aggregateSkew = generateAggregateSkew(sortedSources);

  return (
    <motion.section 
      aria-labelledby="source-weighting-heading"
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
    >
      <div className="flex items-center mb-4">
        <h2 id="source-weighting-heading" className="text-lg font-bold text-white">
          Trusted Source Weighting
        </h2>
        <p className="text-xs text-neutral-400 ml-3">Weighting signals from key publications.</p>
      </div>
      
      {/* Section-Level Summary with Shimmer */}
      <motion.div 
        className="mb-6 relative overflow-hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="p-4 rounded-xl bg-black/20 border border-white/5 relative">
          {/* Shimmer Sweep Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          />
          
          <p 
            className="text-sm text-gray-300 relative z-10"
            dangerouslySetInnerHTML={{ 
              __html: aggregateSkew.replace(/\*\*(.*?)\*\*/g, '<span class="font-semibold text-amber-300">$1</span>')
            }}
          />
        </div>
      </motion.div>
      
      <div className="space-y-4">
        {sortedSources.map((sourceData, index) => (
          <SourceAccordion key={sourceData.source} source={sourceData} density={density} index={index} />
        ))}
      </div>
    </motion.section>
  );
}