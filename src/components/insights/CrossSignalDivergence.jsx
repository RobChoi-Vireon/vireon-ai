
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitCompare, ArrowRight, Zap, BarChart, Banknote, Globe, Activity } from 'lucide-react';

const DivergenceCard = ({ title, description, whyItMatters, sources, sourceModules, assetClass, isNew, intensity, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  const intensityColors = {
    high: { bg: 'bg-red-500/15', border: 'border-red-500/30', glow: 'shadow-red-500/20' },
    medium: { bg: 'bg-yellow-500/15', border: 'border-yellow-500/30', glow: 'shadow-yellow-500/20' },
    low: { bg: 'bg-blue-500/15', border: 'border-blue-500/30', glow: 'shadow-blue-500/20' },
  };

  const colors = intensityColors[intensity] || intensityColors.medium;

  return (
    <motion.div 
      className={`relative group overflow-hidden rounded-2xl border backdrop-blur-xl cursor-pointer transition-all duration-500 ${colors.bg} ${colors.border} hover:shadow-xl ${colors.glow}`}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.1 + index * 0.15, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ y: -6, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* New Anomaly Pulse Effect */}
      {isNew && (
        <motion.div 
          className="absolute -top-3 -right-3 z-20"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
        >
          <motion.div 
            className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 flex items-center justify-center shadow-lg"
            animate={{ 
              boxShadow: [
                '0 0 0 0 rgba(139, 92, 246, 0.7)',
                '0 0 0 15px rgba(139, 92, 246, 0)',
              ]
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Zap className="w-5 h-5 text-white" />
          </motion.div>
        </motion.div>
      )}

      {/* Animated Background Pattern */}
      <motion.div 
        className="absolute inset-0 opacity-20"
        animate={isHovered ? { scale: [1, 1.05, 1] } : { scale: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-full group-hover:-translate-x-full transition-transform duration-1000" />
      </motion.div>

      <div className="relative z-10 p-8">
        {/* Header with Source Ribbons */}
        <div className="flex items-start justify-between mb-4">
          <h4 className="text-lg font-bold text-white leading-tight pr-4">{title}</h4>
          <div className="flex flex-wrap gap-1 justify-end">
            {sources.map((source, i) => (
              <motion.span 
                key={source}
                className="px-2 py-1 text-xs font-semibold bg-gradient-to-r from-indigo-500/20 to-violet-500/20 text-indigo-300 rounded-md border border-indigo-500/30 whitespace-nowrap"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                {source}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-300 leading-relaxed mb-4 line-clamp-3">
          {description}
        </p>

        {/* Why It Matters - Bold Punchline */}
        <motion.div
          className="p-4 rounded-xl bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 mb-6"
          whileHover={{ scale: 1.02 }}
        >
          <p className="text-sm font-bold text-violet-300 leading-relaxed">
            <span className="text-violet-200">Why this matters:</span> {whyItMatters}
          </p>
        </motion.div>

        {/* Footer with Explore Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
              {assetClass} Anomaly
            </span>
            {intensity && (
              <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                intensity === 'high' ? 'bg-red-500/20 text-red-300' :
                intensity === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                'bg-blue-500/20 text-blue-300'
              }`}>
                {intensity.toUpperCase()}
              </span>
            )}
          </div>
          
          <motion.button 
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
              isHovered 
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                : 'text-gray-400 border border-transparent'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Explore</span>
            <ArrowRight className="w-3 h-3" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const assetClasses = [
    { id: 'All', name: 'All', icon: Globe },
    { id: 'Equities', name: 'Equities', icon: BarChart },
    { id: 'Rates', name: 'Rates', icon: Banknote },
    { id: 'FX', name: 'FX', icon: Activity },
    { id: 'Commodities', name: 'Commodities', icon: Zap },
];

const CrossSignalDivergence = ({ data }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const filteredData = activeFilter === 'All' ? data : data.filter(d => d.assetClass === activeFilter);

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ignore key presses if the user is typing in an input field
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
      }
      
      const currentIndex = assetClasses.findIndex(ac => ac.id === activeFilter);

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        const newIndex = (currentIndex - 1 + assetClasses.length) % assetClasses.length;
        setActiveFilter(assetClasses[newIndex].id);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        const newIndex = (currentIndex + 1) % assetClasses.length;
        setActiveFilter(assetClasses[newIndex].id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeFilter]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="space-y-8"
    >
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center border border-orange-500/30">
            <GitCompare className="w-6 h-6 text-orange-400" strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white tracking-[-0.02em]">Signal Anomalies</h2>
            <p className="text-gray-400">Cross-module divergences and contradictions</p>
          </div>
        </div>

        {/* Asset Class Filter */}
        <div className="flex space-x-1 p-1.5 bg-black/30 rounded-2xl backdrop-blur-sm border border-white/10">
          {assetClasses.map(ac => (
            <motion.button 
              key={ac.id} 
              onClick={() => setActiveFilter(ac.id)} 
              className={`relative flex items-center space-x-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-300 ${
                activeFilter === ac.id 
                  ? 'text-white shadow-lg' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ac.icon className="w-4 h-4" strokeWidth={2} />
              <span>{ac.name}</span>
              {activeFilter === ac.id && (
                <motion.div 
                  layoutId="divergenceFilterIndicator" 
                  className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-violet-500/20 rounded-xl border border-indigo-500/30"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Divergence Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AnimatePresence mode="wait">
          {filteredData.map((item, index) => (
            <DivergenceCard key={`${activeFilter}-${item.title}`} {...item} index={index} />
          ))}
        </AnimatePresence>
      </div>
    </motion.section>
  );
};

export default CrossSignalDivergence;
