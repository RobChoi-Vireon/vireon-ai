// 🔒 DESIGN LOCKED — OS HORIZON LIQUID GLASS (macOS Tahoe)
// Strict Compliance with Vireon Design System

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitBranch, Eye, AlertCircle, ChevronDown, ChevronUp, Scale, ArrowRight, Target, Radar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// ============================================================================
// OS HORIZON LIQUID GLASS SYSTEM — TAHOE
// ============================================================================
const GLASS = {
  panel: {
    bg: 'rgba(12, 18, 32, 0.68)',
    blur: 'blur(60px) saturate(175%)',
    radius: '28px',
    border: '1px solid rgba(255,255,255,0.10)',
    innerGlow: 'inset 0 0 60px rgba(255,255,255,0.03), inset 0 1px 0 rgba(255,255,255,0.10)'
  },
  card: {
    bg: 'rgba(18, 26, 46, 0.50)',
    blur: 'blur(40px) saturate(165%)',
    radius: '20px',
    border: '1px solid rgba(255,255,255,0.08)',
    innerGlow: 'inset 0 0 30px rgba(255,255,255,0.02), inset 0 1px 0 rgba(255,255,255,0.08)'
  }
};

const MiniConfidenceBar = ({ confidence }) => {
  const numBars = Math.max(1, Math.ceil(confidence * 5));
  const confidencePercentage = Math.round(confidence * 100);

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-1 h-3 rounded-sm bg-white/20 overflow-hidden">
            {i < numBars && (
              <motion.div
                className="h-full bg-amber-400"
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.05, ease: 'easeOut' }}
                style={{ transformOrigin: 'bottom' }}
              />
            )}
          </div>
        ))}
      </div>
      <span className="text-xs font-semibold text-gray-300 w-8 text-right">{confidencePercentage}%</span>
    </div>
  );
};

const ConfidenceIndicator = ({ confidence, isRising = false }) => {
  const confidencePercentage = Math.round((confidence || 0.6) * 100);
  
  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.7) return { color: '#10B981', bg: 'rgba(16, 185, 129, 0.2)' };
    if (confidence >= 0.5) return { color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.2)' };
    return { color: '#6B7280', bg: 'rgba(107, 114, 128, 0.2)' };
  };

  const { color, bg } = getConfidenceColor(confidence);

  return (
    <div className="flex items-center gap-2">
      <div className="relative w-8 h-2 bg-black/30 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ 
            width: `${confidencePercentage}%`,
            boxShadow: isRising ? `0 0 8px ${color}60` : 'none'
          }}
          transition={{ duration: 1.2, ease: [0.22, 0.61, 0.36, 1] }}
        />
        {isRising && (
          <motion.div
            className="absolute inset-0 w-2 h-full rounded-full"
            style={{ background: `linear-gradient(90deg, transparent, ${color}80, transparent)` }}
            animate={{ x: ['-8px', '40px'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        )}
      </div>
      <span className="text-xs font-bold" style={{ color }}>
        {confidencePercentage}%
      </span>
    </div>
  );
};

const DebateCard = ({ counterpoint, index, isExpandedView = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isRising = Math.random() > 0.7; // Simulated rising confidence

  return (
    <motion.div
      className="relative overflow-hidden group"
      style={{ 
        background: GLASS.card.bg,
        backdropFilter: GLASS.card.blur,
        WebkitBackdropFilter: GLASS.card.blur,
        borderRadius: GLASS.card.radius,
        border: GLASS.card.border,
        boxShadow: `${GLASS.card.innerGlow}, 0 12px 40px -15px rgba(0,0,0,0.30)${isRising ? ', 0 0 25px rgba(245, 158, 11, 0.12)' : ''}`
      }}
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      animate={{
        y: isHovered ? -3 : 0,
        boxShadow: isHovered 
          ? `${GLASS.card.innerGlow}, 0 18px 50px -15px rgba(0,0,0,0.40), 0 0 30px rgba(245, 158, 11, 0.08)`
          : `${GLASS.card.innerGlow}, 0 12px 40px -15px rgba(0,0,0,0.30)${isRising ? ', 0 0 25px rgba(245, 158, 11, 0.12)' : ''}`
      }}
      transition={{ duration: 0.22, ease: [0.22, 0.61, 0.36, 1] }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={isExpandedView ? false : "hidden"}
      custom={index}
    >
      {/* Top specular edge */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '12%',
        right: '12%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
        pointerEvents: 'none'
      }} />
      
      {isRising && (
        <motion.div 
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(245, 158, 11, 0.08) 0%, transparent 70%)' }}
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      <div className="relative z-10 p-5">
        {/* Debate Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold text-amber-300 uppercase tracking-wide">
              Debate Snapshot
            </span>
            {isRising && (
              <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30 text-xs">
                Rising
              </Badge>
            )}
          </div>
          <ConfidenceIndicator confidence={counterpoint.confidence} isRising={isRising} />
        </div>

        {/* Consensus vs Counter */}
        <div className="space-y-4">
          {/* Consensus Side */}
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <Scale className="w-4 h-4 text-blue-400" />
            </div>
            <div className="flex-1">
              <h5 className="text-xs font-semibold text-blue-300 mb-1">CONSENSUS</h5>
              <p className="text-sm font-medium text-gray-200 leading-snug">
                {counterpoint.consensus}
              </p>
            </div>
          </div>

          {/* VS Separator */}
          <div className="flex items-center justify-center py-2">
            <div className="flex items-center gap-2">
              <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent w-8"></div>
              <ArrowRight className="w-4 h-4 text-white/40" />
              <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent w-8"></div>
            </div>
          </div>

          {/* Counter Side */}
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <GitBranch className="w-4 h-4 text-orange-400" />
            </div>
            <div className="flex-1">
              <h5 className="text-xs font-semibold text-orange-300 mb-1">COUNTER</h5>
              <p className="text-sm font-medium text-gray-200 leading-snug">
                {counterpoint.counter}
              </p>
            </div>
          </div>
        </div>

        {/* Source & Expand */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
          <span className="text-xs text-gray-400">
            Source: <span className="text-gray-300 capitalize font-medium">
              {counterpoint.source?.replace('_', ' ')}
            </span>
          </span>
          <motion.button 
            onClick={() => setIsExpanded(!isExpanded)} 
            className="p-1 rounded-full hover:bg-white/10 transition-colors"
            whileTap={{ scale: 0.9 }}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400"/> : <ChevronDown className="w-4 h-4 text-gray-400"/>}
          </motion.button>
        </div>

        {/* Expanded Details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 pt-3 border-t border-white/10"
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="space-y-2 text-xs text-gray-400">
                <p><span className="font-medium">Analysis:</span> This represents a {counterpoint.confidence && counterpoint.confidence > 0.6 ? 'strong' : 'moderate'} challenge to the prevailing narrative.</p>
                <p><span className="font-medium">Impact:</span> Could shift market sentiment if gains traction.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const BlindspotCard = ({ blindspot, index, isExpandedView = false }) => {
  const getIntensityLevel = (significance) => {
    switch (significance) {
      case 'high': return { label: 'Major', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)' };
      case 'medium': return { label: 'Moderate', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' };
      default: return { label: 'Minor', color: '#6366F1', bg: 'rgba(99, 102, 241, 0.1)' };
    }
  };

  const intensity = getIntensityLevel(blindspot.significance);

  return (
    <motion.div
      className="relative rounded-2xl border border-purple-500/20 backdrop-blur-lg overflow-hidden group"
      style={{ 
        background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(147, 51, 234, 0.05))',
        boxShadow: '0 0 20px rgba(147, 51, 234, 0.1)'
      }}
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      whileHover={{ y: -3, scale: 1.01, boxShadow: '0 8px 25px rgba(147, 51, 234, 0.2)' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      initial={isExpandedView ? false : "hidden"}
      animate={isExpandedView ? false : "visible"}
    >
      <motion.div 
        className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(168, 85, 247, 0.3) 0%, transparent 70%)'
        }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      <div className="relative z-10 p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-semibold text-purple-300 uppercase tracking-wide">
              Blindspot Detected
            </span>
          </div>
          <Badge 
            variant="outline" 
            style={{ 
              backgroundColor: intensity.bg,
              color: intensity.color,
              borderColor: `${intensity.color}30`
            }}
            className="text-xs font-bold"
          >
            {intensity.label}
          </Badge>
        </div>
        
        <div className="flex items-start space-x-3">
          <div className="p-2.5 rounded-xl bg-black/30 border border-purple-500/20">
            <Eye className="w-5 h-5 text-purple-300" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold mb-1 text-gray-100">{blindspot.title}</h4>
            <p className="text-sm text-gray-300 leading-relaxed">{blindspot.text}</p>
            {blindspot.region && (
              <div className="mt-2">
                <Badge variant="outline" className="border-purple-500/40 text-purple-300 bg-purple-900/30 text-xs">
                  {blindspot.region.toUpperCase()}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function CounterpointsPanel({ counterpoints = [], blindspots = [], density }) {
  const [viewMode, setViewMode] = useState('glance');
  const [showAll, setShowAll] = useState(false);
  const [expandedItemId, setExpandedItemId] = useState(null);
  
  const spacingClass = density === 'compact' ? 'p-4' : density === 'spacious' ? 'p-8' : 'p-6';

  if ((!counterpoints || counterpoints.length === 0) && (!blindspots || blindspots.length === 0)) {
    return null;
  }
  
  const visibleCounterpoints = showAll ? counterpoints.map((c, i) => ({ ...c, id: `c-${i}` })) : counterpoints.slice(0, 1).map((c, i) => ({ ...c, id: `c-${i}` }));
  const visibleBlindspots = showAll ? blindspots.map((b, i) => ({ ...b, id: `b-${i}` })) : blindspots.slice(0, 1).map((b, i) => ({ ...b, id: `b-${i}` }));

  const combinedItems = [
    ...visibleCounterpoints.map(item => ({ ...item, type: 'debate' })),
    ...visibleBlindspots.map(item => ({ ...item, type: 'blindspot' })),
  ];

  const handleRowClick = (id) => {
    setExpandedItemId(expandedItemId === id ? null : id);
  };

  const totalDebates = counterpoints.length;
  const totalBlindspots = blindspots.length;
  const totalItems = totalDebates + totalBlindspots;
  const visibleItemsCount = visibleCounterpoints.length + visibleBlindspots.length;

  const getConsensusState = () => {
    if (totalDebates > 3) return { text: "Lots of Disagreement", color: "text-red-400" };
    if (totalDebates > 1) return { text: "Some Disagreement", color: "text-amber-400" };
    return { text: "Mostly Agree", color: "text-green-400" };
  };
  const consensusState = getConsensusState();

  return (
    <motion.section
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
      className={`relative rounded-2xl ${spacingClass} border border-white/10 backdrop-blur-xl`}
      style={{ 
        background: 'linear-gradient(180deg, rgba(18, 20, 25, 0.85) 0%, rgba(18, 20, 25, 0.7) 100%)',
        boxShadow: '0 20px 40px -15px rgba(0,0,0,0.3)'
      }}
      aria-labelledby="counterpoints-heading"
    >
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-orange-500/10 via-transparent to-purple-500/10 blur-xl opacity-50" />

      <div className="relative z-10">
        {/* Header with Toggle */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="p-2.5 rounded-lg mr-4 bg-black/30 border border-white/10">
              <GitBranch className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 id="counterpoints-heading" className="text-lg font-semibold text-gray-100">
                Debate Board & Blindspot Radar
              </h2>
              <p className="text-sm text-gray-400">
                Where experts disagree and what others might be missing.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'glance' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('glance')}
              className="text-xs"
            >
              Quick Glance
            </Button>
            <Button
              variant={viewMode === 'cards' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('cards')}
              className="text-xs"
            >
              Cards
            </Button>
          </div>
        </div>
        
        {/* Net Summary Bar */}
        <motion.div
          className="mb-6 px-3 py-2 rounded-lg border border-white/10 text-xs text-center text-gray-400"
          style={{ background: 'rgba(0,0,0,0.15)'}}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <span className="font-semibold text-gray-300">{totalDebates} Active Debates</span>
          <span className="mx-2 text-gray-600">|</span>
          <span className="font-semibold text-purple-300">{totalBlindspots} Blindspots Detected</span>
          <span className="mx-2 text-gray-600">→</span>
          <span>Overall: <span className={`font-bold ${consensusState.color}`}>{consensusState.text}</span></span>
        </motion.div>

        <AnimatePresence mode="wait">
          {viewMode === 'cards' ? (
            <motion.div 
              key="cards"
              className="space-y-6"
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
            >
              {counterpoints && counterpoints.length > 0 && (
                <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
                  <h3 className="text-md font-semibold mb-4 flex items-center text-gray-200">
                    <Scale className="w-4 h-4 mr-2 text-amber-400" />
                    Active Debates ({counterpoints.length})
                  </h3>
                  <div className="space-y-4">
                    {visibleCounterpoints.map((counterpoint, index) => (
                      <DebateCard key={counterpoint.id} counterpoint={counterpoint} index={index} />
                    ))}
                  </div>
                </motion.div>
              )}

              {blindspots && blindspots.length > 0 && (
                <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
                  <h3 className="text-md font-semibold mb-4 flex items-center text-gray-200">
                    <Radar className="w-4 h-4 mr-2 text-purple-400" />
                    Radar Detections ({blindspots.length})
                  </h3>
                  <div className="space-y-4">
                    {visibleBlindspots.map((blindspot, index) => (
                      <BlindspotCard key={blindspot.id} blindspot={blindspot} index={index} />
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="glance"
              className="space-y-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {combinedItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div 
                    onClick={() => handleRowClick(item.id)}
                    className="p-3 rounded-lg group hover:bg-white/5 transition-colors duration-200 cursor-pointer"
                  >
                    {item.type === 'debate' ? (
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <Scale className="w-4 h-4 text-amber-400 flex-shrink-0" />
                          <p className="text-gray-300 truncate">
                            <span className="font-semibold text-amber-300">Consensus:</span> {item.consensus}
                          </p>
                          <ArrowRight className="w-4 h-4 text-white/40 mx-2 flex-shrink-0" />
                          <p className="text-orange-300 truncate flex-1">
                            {item.counter}
                          </p>
                        </div>
                        <div className="ml-4">
                          <MiniConfidenceBar confidence={item.confidence} />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-sm hover:bg-purple-500/10 rounded-lg -m-3 p-3 transition-colors duration-200">
                         <div className="flex items-center gap-2 flex-1 min-w-0">
                          <motion.div 
                            className="text-purple-400 flex-shrink-0"
                            animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                          >
                            <Radar className="w-4 h-4" />
                          </motion.div>
                          <p className="font-semibold text-purple-300 truncate">{item.title}</p>
                          <p className="text-gray-400 truncate ml-2 flex-1">{item.text}</p>
                        </div>
                        <Badge variant="outline" className="ml-4 border-purple-500/40 text-purple-300 bg-purple-900/30 text-xs">
                          {item.region?.toUpperCase() || 'GLOBAL'}
                        </Badge>
                      </div>
                    )}
                  </div>
                  <AnimatePresence>
                    {expandedItemId === item.id && (
                      <motion.div
                        className="pl-3 pr-3 pb-3"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        {item.type === 'debate' ? (
                          <DebateCard counterpoint={item} index={0} isExpandedView={true} /> 
                        ) : (
                          <BlindspotCard blindspot={item} index={0} isExpandedView={true} /> 
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Show More/Less Toggle */}
        {totalItems > visibleItemsCount && (
          <div className="flex justify-center pt-6 mt-4 border-t border-white/10">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAll(!showAll)}
              className="border-white/20 hover:bg-white/10 text-gray-300 hover:text-white backdrop-blur-sm"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            >
              {showAll ? 'Show Less' : `Show ${totalItems - visibleItemsCount} More`}
              {showAll ? (
                <ChevronUp className="w-4 h-4 ml-2" />
              ) : (
                <ChevronDown className="w-4 h-4 ml-2" />
              )}
            </Button>
          </div>
        )}
      </div>
    </motion.section>
  );
}