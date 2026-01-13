import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCheck, TrendingUp, TrendingDown, Activity, Eye, BarChart3 } from 'lucide-react';

const EnhancedSparkline = ({ data, ticker }) => {
  const width = 120;
  const height = 40;
  
  if (!data || data.length < 2) return <div className="w-30 h-10" />;

  const minValue = Math.min(...data);
  const maxValue = Math.max(...data);
  const range = maxValue - minValue || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * (width - 10) + 5;
    const y = height - 5 - ((value - minValue) / range) * (height - 10);
    return `${x},${y}`;
  }).join(' ');

  const gradientId = `sparkline-gradient-${ticker}`;
  const glowId = `sparkline-glow-${ticker}`;

  return (
    <div className="relative">
      <svg width={width} height={height} className="overflow-visible">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#4F46E5', stopOpacity: 0.8 }} />
            <stop offset="100%" style={{ stopColor: '#7C3AED', stopOpacity: 0.2 }} />
          </linearGradient>
          <filter id={glowId}>
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Fill area */}
        <motion.polygon
          fill={`url(#${gradientId})`}
          points={`${points} ${width-5},${height-5} 5,${height-5}`}
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        />

        {/* Line */}
        <motion.polyline
          fill="none"
          stroke="#4F46E5"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
          filter={`url(#${glowId})`}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
        />

        {/* End point */}
        <motion.circle
          cx={points.split(' ').slice(-1)[0].split(',')[0]}
          cy={points.split(' ').slice(-1)[0].split(',')[1]}
          r="3"
          fill="#7C3AED"
          stroke="#A855F7"
          strokeWidth="1"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 2, duration: 0.3 }}
        />
      </svg>
    </div>
  );
};

const MetricTooltip = ({ ticker, impliedVol, sentimentScore, revisionTrend, isVisible }) => (
  <AnimatePresence>
    {isVisible && (
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.9 }}
        className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-30 pointer-events-none"
      >
        <div 
          className="p-4 rounded-2xl border border-white/20 shadow-2xl min-w-[200px]"
          style={{
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.9))',
            backdropFilter: 'blur(20px)'
          }}
        >
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Implied Vol</span>
              <span className="text-sm font-bold text-white">{impliedVol}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Sentiment</span>
              <span className={`text-sm font-bold ${sentimentScore > 60 ? 'text-green-400' : sentimentScore < 40 ? 'text-red-400' : 'text-yellow-400'}`}>
                {sentimentScore}/100
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Revisions</span>
              <span className={`text-sm font-bold ${
                revisionTrend === 'positive' ? 'text-green-400' : 
                revisionTrend === 'negative' ? 'text-red-400' : 'text-gray-400'
              }`}>
                {revisionTrend}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

const PersonalizedCard = ({ ticker, logoUrl, insight, exposure, exposureChange, impliedVol, sentimentScore, revisionTrend, links, isElevated, sparklineData, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const getExposureStyles = () => {
    switch (exposure) {
      case 'High':
        return { bg: 'bg-red-500/20', text: 'text-red-300', border: 'border-red-500/30', glow: 'shadow-red-500/20' };
      case 'Medium':
        return { bg: 'bg-yellow-500/20', text: 'text-yellow-300', border: 'border-yellow-500/30', glow: 'shadow-yellow-500/20' };
      default:
        return { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/30', glow: 'shadow-blue-500/20' };
    }
  };

  const exposureStyles = getExposureStyles();

  return (
    <motion.div
      className="relative group overflow-hidden rounded-3xl border backdrop-blur-xl cursor-pointer transition-all duration-500 hover:shadow-xl"
      style={{
        background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.5), rgba(15, 23, 42, 0.6))',
        borderColor: isElevated ? 'rgba(124, 58, 237, 0.6)' : 'rgba(255, 255, 255, 0.15)',
      }}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.1 + index * 0.15, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ y: -8, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Elevated Ticker Glow Effect */}
      {isElevated && (
        <motion.div 
          className="absolute inset-0 rounded-3xl"
          animate={{ 
            boxShadow: [
              '0 0 20px rgba(124, 58, 237, 0.3)',
              '0 0 40px rgba(124, 58, 237, 0.5)',
              '0 0 20px rgba(124, 58, 237, 0.3)'
            ]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Animated Background Pattern */}
      <motion.div 
        className="absolute inset-0 opacity-10"
        animate={isHovered ? { scale: [1, 1.05, 1] } : { scale: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full group-hover:-translate-x-full transition-transform duration-1000" />
      </motion.div>

      <div className="relative z-10 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <img 
                src={logoUrl} 
                alt={`${ticker} logo`} 
                className="w-10 h-10 rounded-full bg-white/10 p-2"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500/30 to-indigo-500/30 flex items-center justify-center text-white font-bold text-sm hidden">
                {ticker.charAt(0)}
              </div>
              {isElevated && (
                <motion.div 
                  className="absolute -inset-1 rounded-full bg-gradient-to-r from-violet-500/50 to-purple-500/50"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
              )}
            </motion.div>
            <div>
              <h4 className="text-xl font-black text-white tracking-tight">{ticker}</h4>
              {exposureChange && (
                <motion.span 
                  className={`text-xs font-medium ${
                    exposureChange === 'increased' ? 'text-red-400' : 
                    exposureChange === 'decreased' ? 'text-green-400' : 'text-gray-400'
                  }`}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {exposureChange === 'increased' ? '↗ Increased Risk' : 
                   exposureChange === 'decreased' ? '↘ Reduced Risk' : '→ Stable'}
                </motion.span>
              )}
            </div>
          </div>
          
          <div className="relative">
            <motion.span 
              className={`px-3 py-1.5 text-xs font-bold rounded-full border ${exposureStyles.bg} ${exposureStyles.text} ${exposureStyles.border}`}
              whileHover={{ scale: 1.05 }}
              onHoverStart={() => setShowTooltip(true)}
              onHoverEnd={() => setShowTooltip(false)}
              aria-label={`${exposure} risk level - hover for details`}
            >
              {exposure} Risk
            </motion.span>
            <MetricTooltip 
              ticker={ticker}
              impliedVol={impliedVol}
              sentimentScore={sentimentScore}
              revisionTrend={revisionTrend}
              isVisible={showTooltip}
            />
          </div>
        </div>

        {/* Insight Text */}
        <p className="text-base text-gray-200 leading-relaxed mb-6 min-h-[3rem]">
          {insight}
        </p>

        {/* Footer with Actions and Sparkline */}
        <div className="flex items-end justify-between">
          <div className="flex flex-wrap gap-2">
            {Object.entries(links).map(([name, url]) => (
              <motion.button 
                key={name} 
                className="px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-indigo-500/20 to-violet-500/20 text-indigo-300 rounded-lg border border-indigo-500/30 hover:border-indigo-500/50 transition-all duration-200"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center space-x-1">
                  <span>Go to {name}</span>
                  <Activity className="w-3 h-3" />
                </span>
              </motion.button>
            ))}
          </div>
          
          {/* Enhanced Sparkline */}
          <div className="flex-shrink-0">
            <EnhancedSparkline data={sparklineData} ticker={ticker} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const PersonalizedLens = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="space-y-8"
      >
        {/* Section Header */}
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500/20 to-blue-500/20 flex items-center justify-center border border-green-500/30">
            <UserCheck className="w-6 h-6 text-green-400" strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white tracking-[-0.02em]">Personal Impact Lens</h2>
            <p className="text-gray-200">How today's market news affects your stocks</p>
          </div>
        </div>

        {/* Empty State */}
        <div className="p-12 rounded-3xl border border-white/10 text-center" style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
          <Eye className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Holdings Tracked</h3>
          <p className="text-gray-300">Add stocks to your watchlist to see personalized insights here</p>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="space-y-8"
    >
      {/* Section Header */}
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500/20 to-blue-500/20 flex items-center justify-center border border-green-500/30">
          <UserCheck className="w-6 h-6 text-green-400" strokeWidth={2} />
        </div>
        <div>
          <h2 className="text-3xl font-black text-white tracking-[-0.02em]">Personal Impact Lens</h2>
          <p className="text-gray-200">How today's market news affects your stocks</p>
        </div>
      </div>

      {/* Personalized Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {data.map((item, index) => (
          <PersonalizedCard key={`${item.ticker}-${index}`} {...item} index={index} />
        ))}
      </div>
    </motion.section>
  );
};

export default PersonalizedLens;