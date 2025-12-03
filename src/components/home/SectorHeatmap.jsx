import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const mockSectorData = [
  { name: 'Technology', change: '+1.85%', sparkline: [10, 20, 15, 30, 25, 45, 50], movers: [{ s: 'NVDA', c: '+4.2%' }, { s: 'AAPL', c: '+3.1%' }], context: 'AI infrastructure flows driving $2.8B rotation.', weekAgo: '+0.9%', yearAvg: '+12.4%' },
  { name: 'Healthcare', change: '+0.72%', sparkline: [30, 32, 35, 33, 38, 40, 42], movers: [{ s: 'LLY', c: '+2.8%' }, { s: 'UNH', c: '+1.2%' }], context: 'Defensive rotation amid market uncertainty.', weekAgo: '-0.3%', yearAvg: '+8.2%' },
  { name: 'Financials', change: '+1.15%', sparkline: [20, 22, 28, 25, 30, 35, 38], movers: [{ s: 'JPM', c: '+1.8%' }, { s: 'BAC', c: '+1.1%' }], context: 'Yield curve steepening supports lending margins.', weekAgo: '+2.1%', yearAvg: '+15.8%' },
  { name: 'Consumer Disc.', change: '-0.45%', sparkline: [60, 55, 58, 50, 52, 48, 45], movers: [{ s: 'TSLA', c: '-2.5%' }, { s: 'AMZN', c: '+1.3%' }], context: 'Consumer spending concerns weigh on discretionary.', weekAgo: '-1.2%', yearAvg: '+3.1%' },
  { name: 'Energy', change: '-2.20%', sparkline: [80, 75, 70, 65, 60, 58, 55], movers: [{ s: 'XOM', c: '-1.5%' }, { s: 'CVX', c: '-1.1%' }], context: 'Crude sell-off and inventory build pressuring sector.', weekAgo: '-0.8%', yearAvg: '+22.7%' },
  { name: 'Industrials', change: '+0.90%', sparkline: [40, 42, 41, 45, 48, 47, 50], movers: [{ s: 'CAT', c: '+1.9%' }, { s: 'GE', c: '+1.3%' }], context: 'Infrastructure spending momentum continues.', weekAgo: '+1.5%', yearAvg: '+11.3%' },
];

const SP500_CHANGE = 1.10;

const RefinedSparkline = ({ data, positive, isHovered }) => {
  const width = 120;
  const height = 30;
  const padding = 2;
  const strokeColor = positive ? '#22C55E' : '#EF4444';
  const gradientId = `sparkline-gradient-${positive ? 'green' : 'red'}-${Math.random()}`;

  const points = useMemo(() => {
    if (!data || data.length < 2) return '';
    const minValue = Math.min(...data);
    const maxValue = Math.max(...data);
    const range = maxValue - minValue || 1;
    return data.map((value, index) => {
      const x = padding + (index / (data.length - 1)) * (width - padding * 2);
      const y = height - padding - ((value - minValue) / range) * (height - padding * 2);
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    }).join(' ');
  }, [data, width, height, padding]);
  
  if (!points) return null;

  const pathD = `M${points}`;

  return (
    <div className="absolute bottom-5 right-5 opacity-70 group-hover:opacity-100 transition-opacity duration-200">
      <svg width={width} height={height} className="overflow-visible">
        <defs>
          <linearGradient id={`${gradientId}-fill`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: strokeColor, stopOpacity: 0.3 }} />
            <stop offset="100%" style={{ stopColor: strokeColor, stopOpacity: 0.05 }} />
          </linearGradient>
        </defs>
        <motion.path 
          d={`${pathD} L${width - padding},${height} L${padding},${height} Z`} 
          fill={`url(#${gradientId}-fill)`} 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 0.5 }} 
        />
        <motion.path 
          d={pathD} 
          fill="none" 
          stroke={strokeColor} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          initial={{ pathLength: 0 }} 
          animate={{ pathLength: 1 }} 
          transition={{ duration: 1.2, ease: "easeOut" }} 
        />
        <AnimatePresence>
          {isHovered && (
            <motion.circle 
              cx={points.split(' ').slice(-1)[0].split(',')[0]} 
              cy={points.split(' ').slice(-1)[0].split(',')[1]} 
              r="3" 
              fill={strokeColor} 
              stroke="rgba(255,255,255,0.8)" 
              strokeWidth="1" 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }} 
              exit={{ scale: 0 }} 
              transition={{ duration: 0.2 }}
            />
          )}
        </AnimatePresence>
      </svg>
    </div>
  );
};

const ViewModeToggle = ({ viewMode, setViewMode, timeframe, setTimeframe }) => {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-1 p-1 rounded-xl bg-black/15 backdrop-blur-sm border border-white/8">
        <button 
          onClick={() => setViewMode('absolute')} 
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${viewMode === 'absolute' ? 'bg-blue-500/20 text-white border border-blue-500/30' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
        >
          Absolute
        </button>
        <button 
          onClick={() => setViewMode('relative')} 
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${viewMode === 'relative' ? 'bg-blue-500/20 text-white border border-blue-500/30' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
        >
          vs. Market
        </button>
      </div>
      <div className="flex items-center space-x-1 p-1 rounded-xl bg-black/15 backdrop-blur-sm border border-white/8">
        <button 
          onClick={() => setTimeframe('1D')} 
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${timeframe === '1D' ? 'bg-purple-500/20 text-white border border-purple-500/30' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
        >
          Today
        </button>
        <button 
          onClick={() => setTimeframe('1W')} 
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${timeframe === '1W' ? 'bg-purple-500/20 text-white border border-purple-500/30' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
        >
          vs. Week
        </button>
        <button 
          onClick={() => setTimeframe('1Y')} 
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${timeframe === '1Y' ? 'bg-purple-500/20 text-white border border-purple-500/30' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
        >
          vs. Year Avg
        </button>
      </div>
    </div>
  );
};

function SectorHeatmap({ setSelectedSector }) {
  const [viewMode, setViewMode] = useState('absolute');
  const [timeframe, setTimeframe] = useState('1D');
  const [hoveredSector, setHoveredSector] = useState(null);

  const viewDescriptions = {
    absolute: { 
      '1D': 'Sectors displayed by raw daily performance.', 
      '1W': 'Sectors compared to last week\'s performance.', 
      '1Y': 'Sectors compared to their 1-year average performance.' 
    },
    relative: { 
      '1D': 'Sectors relative to S&P 500 benchmark.', 
      '1W': 'Sectors relative to S&P 500 (weekly comparison).', 
      '1Y': 'Sectors relative to S&P 500 (vs. 1-year average).' 
    }
  };
  
  const processedData = useMemo(() => {
    return mockSectorData.map(sector => {
      const absoluteChange = parseFloat(sector.change);
      let displayChange = absoluteChange;
      if (viewMode === 'relative') displayChange = absoluteChange - SP500_CHANGE;
      if (timeframe === '1W') displayChange = absoluteChange - parseFloat(sector.weekAgo);
      if (timeframe === '1Y') displayChange = absoluteChange - parseFloat(sector.yearAvg);
      return { ...sector, displayChange };
    });
  }, [viewMode, timeframe]);

  const { topGainer, topLoser, maxAbsChange } = useMemo(() => {
    const sorted = [...processedData].sort((a, b) => b.displayChange - a.displayChange);
    const allChanges = processedData.map(s => Math.abs(s.displayChange));
    return { topGainer: sorted[0], topLoser: sorted[sorted.length - 1], maxAbsChange: Math.max(...allChanges) };
  }, [processedData]);

  const getTileStyle = (change, maxChange) => {
    const magnitude = Math.min(Math.abs(change) / (maxChange || 1), 1);
    const baseOpacity = 0.1 + magnitude * 0.2;
    const secondaryOpacity = 0.05 + magnitude * 0.1;
    const borderOpacity = 0.2 + magnitude * 0.3;
    const glowOpacity = 0.1 + magnitude * 0.4;
    const glowRadius = 8 + magnitude * 20;
    
    if (change > 0) {
      return {
        background: `linear-gradient(145deg, rgba(16, 185, 129, ${baseOpacity}), rgba(16, 185, 129, ${secondaryOpacity}))`,
        border: `rgba(16, 185, 129, ${borderOpacity})`,
        glow: `0 0 ${glowRadius}px rgba(16, 185, 129, ${glowOpacity})`
      };
    } else {
      return {
        background: `linear-gradient(145deg, rgba(239, 68, 68, ${baseOpacity}), rgba(239, 68, 68, ${secondaryOpacity}))`,
        border: `rgba(239, 68, 68, ${borderOpacity})`,
        glow: `0 0 ${glowRadius}px rgba(239, 68, 68, ${glowOpacity})`
      };
    }
  };

  // Magnitude-based styling helper
  const getMagnitudeStyling = (change) => {
    const absChange = Math.abs(change);
    if (absChange > 2) {
      return {
        fontSize: '2.75rem',
        fontWeight: 'font-black',
        textShadow: change > 0 ? '0 0 20px rgba(34, 197, 94, 0.6)' : '0 0 20px rgba(239, 68, 68, 0.6)'
      };
    } else if (absChange > 0.5) {
      return {
        fontSize: '2.5rem',
        fontWeight: 'font-extrabold',
        textShadow: change > 0 ? '0 0 12px rgba(34, 197, 94, 0.4)' : '0 0 12px rgba(239, 68, 68, 0.4)'
      };
    } else {
      return {
        fontSize: '2.25rem',
        fontWeight: 'font-bold',
        textShadow: change > 0 ? '0 0 6px rgba(34, 197, 94, 0.2)' : '0 0 6px rgba(239, 68, 68, 0.2)'
      };
    }
  };

  // OS Horizon Liquid Glass — Tahoe
  const GLASS = {
    panel: {
      bg: 'rgba(45, 55, 72, 0.42)',
      blur: 'blur(40px) saturate(150%)',
      border: '1px solid rgba(255,255,255,0.10)',
      innerGlow: 'inset 0 1px 0 rgba(255,255,255,0.08), inset 0 0 40px rgba(255,255,255,0.02)'
    }
  };

  return (
    <div 
      className="relative overflow-hidden rounded-3xl p-8"
      style={{
        background: GLASS.panel.bg,
        backdropFilter: GLASS.panel.blur,
        WebkitBackdropFilter: GLASS.panel.blur,
        border: GLASS.panel.border,
        boxShadow: `${GLASS.panel.innerGlow}, 0 20px 60px -20px rgba(0,0,0,0.35)`
      }}
    >
      {/* Top specular edge */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '8%',
        right: '8%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
        pointerEvents: 'none',
        borderRadius: '24px 24px 0 0'
      }} />
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold tracking-[-0.01em] text-white">Sector Heatmap</h2>
        <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} timeframe={timeframe} setTimeframe={setTimeframe} />
      </div>

      <div className="h-8 flex items-center mb-6">
        <AnimatePresence mode="wait">
          <motion.p 
            key={`${viewMode}-${timeframe}`} 
            className="text-sm text-gray-400" 
            initial={{ opacity: 0, y: -5 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 5 }} 
            transition={{ duration: 0.2 }}
          >
            {viewDescriptions[viewMode][timeframe]}
          </motion.p>
        </AnimatePresence>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {processedData.map((sector, index) => {
          const isLeader = sector.name === topGainer.name;
          const isLaggard = sector.name === topLoser.name;
          const style = getTileStyle(sector.displayChange, maxAbsChange);
          const magnitudeStyle = getMagnitudeStyling(sector.displayChange);

          return (
            <motion.div
              key={sector.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedSector(sector)}
              onHoverStart={() => setHoveredSector(sector.name)}
              onHoverEnd={() => setHoveredSector(null)}
              whileHover={{ 
                y: -4, 
                scale: 1.02,
                boxShadow: `0 12px 40px rgba(0, 0, 0, 0.3), ${style.glow}`,
                transition: { duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }
              }}
              className="group relative p-6 rounded-2xl cursor-pointer border overflow-hidden"
              style={{ 
                background: style.background, 
                borderColor: style.border, 
                boxShadow: `inset 0 1px 1px rgba(255, 255, 255, 0.08), ${style.glow}`,
                transition: 'all 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
              }}
            >
              {(isLeader || isLaggard) && (
                <motion.div 
                  className="absolute top-3 right-3"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <span 
                    className={`text-xs font-bold px-2 py-1 rounded-full ${isLeader ? 'text-green-300 bg-green-500/10' : 'text-red-300 bg-red-500/10'}`} 
                    style={{ 
                      textShadow: isLeader ? '0 0 8px rgba(52, 211, 153, 0.5)' : '0 0 8px rgba(248, 113, 113, 0.5)',
                      backdropFilter: 'blur(4px)'
                    }}
                  >
                    {isLeader ? 'Leader' : 'Laggard'}
                  </span>
                </motion.div>
              )}
              
              <AnimatePresence>
                {hoveredSector === sector.name && (
                  <motion.div 
                    className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-30 w-max" 
                    initial={{ opacity: 0, y: 10, scale: 0.9 }} 
                    animate={{ opacity: 1, y: 0, scale: 1 }} 
                    exit={{ opacity: 0, y: 10, scale: 0.9 }} 
                    transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    <div 
                      className="px-3 py-2 text-xs font-semibold text-white rounded-lg border border-white/15 shadow-2xl max-w-xs text-center" 
                      style={{ 
                        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.90))', 
                        backdropFilter: 'blur(20px)' 
                      }}
                    >
                      {sector.context}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-slate-700 border-b border-r border-white/15"></div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative z-10 flex flex-col justify-between h-full min-h-[170px]">
                <h3 className="text-base font-bold text-white/90 leading-tight mb-4">{sector.name}</h3>
                
                <div className="my-6 flex-1 flex items-center">
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={`${viewMode}-${timeframe}-${sector.name}`}
                      initial={{ 
                        opacity: 0, 
                        y: sector.displayChange >= 0 ? -10 : 10,
                        scale: 0.9
                      }} 
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        scale: 1
                      }} 
                      exit={{ 
                        opacity: 0, 
                        y: sector.displayChange >= 0 ? 10 : -10,
                        scale: 0.9
                      }} 
                      transition={{ 
                        duration: 0.25, 
                        ease: [0.25, 0.46, 0.45, 0.94] 
                      }} 
                      className={`text-white ${magnitudeStyle.fontWeight}`}
                      style={{ 
                        fontSize: magnitudeStyle.fontSize, 
                        lineHeight: 1,
                        textShadow: magnitudeStyle.textShadow
                      }}
                    >
                      {sector.displayChange >= 0 ? '+' : ''}{sector.displayChange.toFixed(2)}%
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="space-y-1 opacity-80 group-hover:opacity-100 transition-opacity duration-200">
                  {sector.movers.slice(0, 2).map((mover, i) => {
                    const isMoverPositive = mover.c.startsWith('+');
                    return (
                      <motion.div 
                        key={i} 
                        className="flex items-center space-x-1.5 text-xs text-white/70 font-semibold"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.05 }}
                      >
                        {isMoverPositive ? 
                          <TrendingUp className="w-3.5 h-3.5 text-green-400" strokeWidth={2.5}/> : 
                          <TrendingDown className="w-3.5 h-3.5 text-red-400" strokeWidth={2.5}/>
                        }
                        <span className="font-medium">{mover.s}</span>
                        <span className={isMoverPositive ? 'text-green-400' : 'text-red-400'}>{mover.c}</span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
              
              <RefinedSparkline 
                data={sector.sparkline} 
                positive={sector.displayChange >= 0} 
                isHovered={hoveredSector === sector.name} 
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default React.memo(SectorHeatmap);