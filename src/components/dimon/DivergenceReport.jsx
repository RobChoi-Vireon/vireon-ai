
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitCommit, AlertTriangle, ExternalLink, TrendingUp, TrendingDown, Minus, Database, BarChart2 } from 'lucide-react';

const DivergenceIntensityMeter = ({ divergences = [] }) => {
  const intensity = Math.min(5, Math.max(1, divergences.length));
  
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="text-xs font-medium text-gray-400">Fracture Intensity</span>
      <div className="flex items-center gap-1.5">
        {[...Array(5)].map((_, level) => (
          <div key={level} className="w-3 h-1.5 rounded-full bg-white/10">
            {level < intensity && (
              <motion.div
                className="w-full h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #A855F7, #EC4899)' }}
                animate={{ 
                  opacity: [0.7, 1, 0.7],
                  boxShadow: [
                    '0 0 3px rgba(168, 85, 247, 0.3)', 
                    '0 0 6px rgba(236, 72, 153, 0.4)', 
                    '0 0 3px rgba(168, 85, 247, 0.3)'
                  ]
                }}
                transition={{ 
                  duration: 2.5,
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: level * 0.2
                }}
              />
            )}
          </div>
        ))}
      </div>
      <span className="text-xs font-medium text-purple-300">{intensity}/5</span>
    </div>
  );
};

const DivergenceCapsule = ({ divergence, onClick, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Removed getRiskTilt and associated logic based on the outline.
  // The risk tilt display elements (bar, icon, color) are also removed.

  const getContextCue = (divergence) => {
    switch (divergence?.id) {
      case 'em_credit':
        return 'Localized EM credit strain flagged by spreads';
      case 'energy_vs_industrials':
        return 'Energy strength diverges from weak industrial output'; // Updated cue
      default:
        return 'Narrative inconsistency detected across sources';
    }
  };

  const getSourceCount = (divergence) => {
    // Corrected to directly return the sum of present_in and missing_in lengths
    return (divergence?.present_in || []).length + (divergence?.missing_in || []).length;
  };

  const contextCue = getContextCue(divergence);
  const sourceCount = getSourceCount(divergence);
  const confidence = Math.round((divergence?.confidence || 0.6) * 100);

  const handleClick = () => {
    try {
      if (divergence && onClick) {
        onClick(divergence);
      }
    } catch (error) {
      console.error('Error handling divergence click:', error);
    }
  };

  // Removed getTiltColor and getTiltIcon as they are no longer used.

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }} // Removed scale: 0.9
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, type: 'spring', stiffness: 200, damping: 20 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div
        onClick={handleClick}
        className="relative cursor-pointer group"
        whileHover={{ y: -2, scale: 1.02 }}
        // Removed whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div
          className="relative px-4 py-3 h-[44px] flex items-center rounded-full border transition-all duration-300 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(236, 72, 153, 0.05))',
            borderImage: 'linear-gradient(135deg, rgba(168, 85, 247, 0.4), rgba(236, 72, 153, 0.3)) 1',
            backdropFilter: 'blur(12px)',
            boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.05)' // Added box-shadow
          }}
        >
          {/* Animated Pulse Dot */}
          <motion.div
            className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
            style={{ background: 'linear-gradient(135deg, #A855F7, #EC4899)' }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }} // Updated scale, removed second pulse
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />

          <AnimatePresence mode="wait"> {/* Added AnimatePresence and mode="wait" */}
            <motion.div
              key={isHovered ? 'details' : 'default'} // Key changes based on hover state
              className="flex items-center justify-between w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {isHovered ? (
                <div className="flex items-center justify-between w-full text-xs">
                  <div className="flex items-center gap-1.5 text-purple-300">
                    <BarChart2 className="w-3 h-3" />
                    <span>{confidence}% confidence</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-purple-300">
                    <Database className="w-3 h-3" />
                    <span>{sourceCount} sources</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-purple-300" />
                  <span className="text-sm font-medium text-purple-200">
                    {String(divergence?.topic || 'Unknown Topic')}
                  </span>
                  <ExternalLink className="w-3 h-3 opacity-70 text-purple-400" />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
      
      {/* Context Cue */}
      <motion.p
        className="text-xs text-gray-400/80 mt-1.5 text-center px-4" // Updated styling
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.1 + 0.3 }}
      >
        {contextCue}
      </motion.p>
      {/* Removed Interactive Hover Expansion block as per outline */}
    </motion.div>
  );
};

export default function DivergenceReport({ divergences = [], onOpenDrawer }) {
  if (!Array.isArray(divergences) || divergences.length === 0) {
    return (
      <motion.div
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        className="h-full rounded-2xl p-6 backdrop-filter backdrop-blur-md border border-white/10 flex flex-col items-center justify-center"
        style={{ background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))' }}
      >
        <div className="text-center">
          <div className="p-3 rounded-xl mb-3 bg-black/30 border border-white/10 inline-block">
            <GitCommit className="w-5 h-5 text-purple-300" />
          </div>
          <h3 className="text-sm font-semibold text-gray-300 mb-1">No Divergences Detected</h3>
          <p className="text-xs text-gray-400">Consensus remains aligned across sources.</p>
        </div>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      className="h-full rounded-2xl p-6 backdrop-filter backdrop-blur-md border border-white/10"
      style={{ background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))' }}
    >
      <div className="flex items-center mb-4"> {/* Changed mb-6 to mb-4 */}
        <div className="p-2.5 rounded-xl mr-3 bg-black/30 border border-white/10">
          <GitCommit className="w-5 h-5 text-purple-300" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-100">
            Divergence Report
          </h2>
          <p className="text-sm text-gray-400">
            Where the consensus narrative fractures.
          </p>
        </div>
      </div>

      {/* Divergence Intensity Meter */}
      <DivergenceIntensityMeter divergences={divergences} />
      
      <div className="space-y-6"> {/* Changed space-y-4 to space-y-6 */}
        {divergences.slice(0, 3).map((divergence, index) => (
          <DivergenceCapsule
            key={divergence?.id || index}
            divergence={divergence}
            onClick={onOpenDrawer}
            index={index}
          />
        ))}
      </div>

      {divergences.length > 3 && (
        <motion.div
          className="text-center mt-6 pt-4 border-t border-white/5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-sm text-gray-400">
            <span className="text-purple-300 font-medium">+{divergences.length - 3}</span> more fractures detected
          </p>
          <button
            onClick={() => onOpenDrawer && onOpenDrawer(divergences[3])}
            className="text-xs text-purple-400 hover:text-purple-300 transition-colors mt-1"
          >
            Explore full anomaly radar →
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
