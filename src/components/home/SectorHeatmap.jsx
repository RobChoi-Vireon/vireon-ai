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
  const width = 110;
  const height = 28;
  const padding = 2;
  // Desaturated colors — forest green / clay red
  const strokeColor = positive ? 'rgba(132, 198, 168, 0.85)' : 'rgba(218, 142, 152, 0.85)';
  const fillColor = positive ? 'rgba(132, 198, 168, 0.12)' : 'rgba(218, 142, 152, 0.12)';
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
    <div className="absolute bottom-4 right-4" style={{ 
      opacity: 0.62,
      transition: 'opacity 0.18s ease'
    }}>
      <svg width={width} height={height} className="overflow-visible">
        <defs>
          <linearGradient id={`${gradientId}-fill`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: strokeColor, stopOpacity: 0.18 }} />
            <stop offset="100%" style={{ stopColor: strokeColor, stopOpacity: 0.02 }} />
          </linearGradient>
        </defs>
        <motion.path 
          d={`${pathD} L${width - padding},${height} L${padding},${height} Z`} 
          fill={`url(#${gradientId}-fill)`} 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }} 
        />
        <motion.path 
          d={pathD} 
          fill="none" 
          stroke={strokeColor} 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          initial={{ pathLength: 0 }} 
          animate={{ pathLength: 1 }} 
          transition={{ duration: 1.0, ease: [0.22, 0.61, 0.36, 1] }} 
        />
      </svg>
    </div>
  );
};

const ViewModeToggle = ({ viewMode, setViewMode, timeframe, setTimeframe }) => {
  const ToggleButton = ({ isActive, onClick, children }) => (
    <motion.button
      onClick={onClick}
      className="relative rounded-[16px] overflow-hidden"
      style={{
        padding: '10px 16px',
        background: isActive 
          ? 'linear-gradient(180deg, rgba(255, 255, 255, 0.085) 0%, rgba(255, 255, 255, 0.062) 100%)'
          : 'linear-gradient(180deg, rgba(255, 255, 255, 0.048) 0%, rgba(255, 255, 255, 0.032) 100%)',
        backdropFilter: 'blur(32px) saturate(165%)',
        WebkitBackdropFilter: 'blur(32px) saturate(165%)',
        border: isActive ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(255,255,255,0.06)',
        boxShadow: isActive 
          ? 'inset 0 1px 0 rgba(255,255,255,0.10), 0 2px 8px rgba(0,0,0,0.08)'
          : 'inset 0 0.5px 0 rgba(255,255,255,0.05), 0 1px 4px rgba(0,0,0,0.05)'
      }}
      whileHover={!isActive ? {
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.068) 0%, rgba(255, 255, 255, 0.048) 100%)',
        transition: { duration: 0.16 }
      } : {}}
      whileTap={{ scale: 0.98, transition: { duration: 0.10 } }}
    >
      {isActive && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: '16%',
          right: '16%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)',
          pointerEvents: 'none'
        }} />
      )}
      <span className="text-[13px] font-semibold" style={{ 
        color: isActive ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.58)',
        letterSpacing: '0.01em'
      }}>
        {children}
      </span>
    </motion.button>
  );

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5">
        <ToggleButton isActive={viewMode === 'absolute'} onClick={() => setViewMode('absolute')}>
          Absolute
        </ToggleButton>
        <ToggleButton isActive={viewMode === 'relative'} onClick={() => setViewMode('relative')}>
          vs. Market
        </ToggleButton>
      </div>
      <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.10)' }} />
      <div className="flex items-center gap-1.5">
        <ToggleButton isActive={timeframe === '1D'} onClick={() => setTimeframe('1D')}>
          Today
        </ToggleButton>
        <ToggleButton isActive={timeframe === '1W'} onClick={() => setTimeframe('1W')}>
          vs. Week
        </ToggleButton>
        <ToggleButton isActive={timeframe === '1Y'} onClick={() => setTimeframe('1Y')}>
          vs. Year
        </ToggleButton>
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
    const baseOpacity = 0.024 + magnitude * 0.028;
    const secondaryOpacity = 0.018 + magnitude * 0.022;
    const borderOpacity = 0.06 + magnitude * 0.04;
    
    if (change > 0) {
      // Desaturated forest green
      return {
        background: `linear-gradient(180deg, rgba(72, 140, 108, ${baseOpacity}), rgba(58, 120, 92, ${secondaryOpacity}))`,
        border: `rgba(88, 227, 164, ${borderOpacity})`,
        colorHint: 'rgba(88, 227, 164, 0.18)'
      };
    } else {
      // Muted clay red
      return {
        background: `linear-gradient(180deg, rgba(168, 82, 92, ${baseOpacity}), rgba(148, 68, 78, ${secondaryOpacity}))`,
        border: `rgba(255, 106, 122, ${borderOpacity})`,
        colorHint: 'rgba(255, 106, 122, 0.18)'
      };
    }
  };

  // Magnitude-based styling helper — quiet confidence
  const getMagnitudeStyling = (change) => {
    const absChange = Math.abs(change);
    if (absChange > 2) {
      return {
        fontSize: '2.5rem',
        fontWeight: 'font-bold'
      };
    } else if (absChange > 0.5) {
      return {
        fontSize: '2.25rem',
        fontWeight: 'font-semibold'
      };
    } else {
      return {
        fontSize: '2rem',
        fontWeight: 'font-semibold'
      };
    }
  };

  return (
    <div className="relative overflow-hidden rounded-[28px]" style={{
      background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.042) 0%, rgba(255, 255, 255, 0.028) 100%)',
      backdropFilter: 'blur(32px) saturate(165%)',
      WebkitBackdropFilter: 'blur(32px) saturate(165%)',
      border: '1px solid rgba(255,255,255,0.08)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 8px 32px rgba(0,0,0,0.12)',
      padding: '28px'
    }}>
      {/* Top specular highlight */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '15%',
        right: '15%',
        height: '1.5px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)',
        pointerEvents: 'none'
      }} />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-[-0.02em] mb-1" style={{ color: 'rgba(255,255,255,0.95)' }}>
            Sector Heatmap
          </h2>
          <div className="h-5 flex items-center">
            <AnimatePresence mode="wait">
              <motion.p 
                key={`${viewMode}-${timeframe}`} 
                className="text-[13px] font-medium" 
                style={{ color: 'rgba(255,255,255,0.58)' }}
                initial={{ opacity: 0, y: -3 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: 3 }} 
                transition={{ duration: 0.18, ease: [0.26, 0.11, 0.26, 1.0] }}
              >
                {viewDescriptions[viewMode][timeframe]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
        <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} timeframe={timeframe} setTimeframe={setTimeframe} />
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
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: index * 0.05, 
                duration: 0.5, 
                ease: [0.22, 0.61, 0.36, 1] 
              }}
              onClick={() => setSelectedSector(sector)}
              onHoverStart={() => setHoveredSector(sector.name)}
              onHoverEnd={() => setHoveredSector(null)}
              whileHover={{ 
                y: -2, 
                scale: 1.008,
                transition: { duration: 0.16, ease: [0.26, 0.11, 0.26, 1.0] }
              }}
              whileTap={{ scale: 0.99, transition: { duration: 0.10 } }}
              className="group relative rounded-[22px] cursor-pointer overflow-hidden"
              style={{ 
                padding: '24px',
                background: `
                  linear-gradient(180deg, 
                    rgba(18, 22, 30, 0.75) 0%, 
                    rgba(15, 18, 24, 0.82) 100%
                  ),
                  ${style.background}
                `,
                backgroundBlendMode: 'overlay',
                backdropFilter: 'blur(32px) saturate(145%)',
                WebkitBackdropFilter: 'blur(32px) saturate(145%)',
                border: `1px solid ${style.border}`, 
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 4px 16px rgba(0, 0, 0, 0.12)',
                transition: 'all 0.16s ease-out',
                backgroundImage: `
                  url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"),
                  linear-gradient(180deg, rgba(18, 22, 30, 0.75) 0%, rgba(15, 18, 24, 0.82) 100%),
                  ${style.background}
                `,
                backgroundSize: 'auto, auto, auto',
                backgroundPosition: 'center, center, center'
              }}
            >
              {(isLeader || isLaggard) && (
                <motion.div 
                  className="absolute top-3.5 right-3.5"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
                >
                  <div 
                    className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
                    style={{
                      background: isLeader 
                        ? 'rgba(72, 140, 108, 0.18)'
                        : 'rgba(168, 82, 92, 0.18)',
                      border: isLeader ? '1px solid rgba(72, 140, 108, 0.28)' : '1px solid rgba(168, 82, 92, 0.28)',
                      color: isLeader ? 'rgba(132, 198, 168, 1)' : 'rgba(218, 142, 152, 1)',
                      backdropFilter: 'blur(8px)',
                      letterSpacing: '0.03em'
                    }}
                  >
                    {isLeader ? 'Leader' : 'Laggard'}
                  </div>
                </motion.div>
              )}
              
              <AnimatePresence>
                {hoveredSector === sector.name && (
                  <motion.div 
                    className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 z-30 w-max pointer-events-none" 
                    initial={{ opacity: 0, y: 8, scale: 0.94 }} 
                    animate={{ opacity: 1, y: 0, scale: 1 }} 
                    exit={{ opacity: 0, y: 8, scale: 0.94 }} 
                    transition={{ duration: 0.16, ease: [0.22, 0.61, 0.36, 1] }}
                  >
                    <div 
                      className="px-4 py-2.5 text-[13px] font-medium max-w-xs text-center rounded-[14px]" 
                      style={{ 
                        background: 'linear-gradient(135deg, rgba(12, 16, 22, 0.94), rgba(18, 22, 30, 0.92))',
                        backdropFilter: 'blur(24px) saturate(165%)',
                        WebkitBackdropFilter: 'blur(24px) saturate(165%)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10), 0 8px 24px rgba(0,0,0,0.25)',
                        color: 'rgba(255,255,255,0.88)'
                      }}
                    >
                      {sector.context}
                      <div 
                        className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 rotate-45"
                        style={{
                          background: 'linear-gradient(135deg, rgba(12, 16, 22, 0.94), rgba(18, 22, 30, 0.92))',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
                          borderRight: '1px solid rgba(255, 255, 255, 0.12)'
                        }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative z-10 flex flex-col justify-between h-full min-h-[180px]">
                <h3 className="text-[15px] font-bold leading-tight mb-3" style={{ 
                  color: 'rgba(255,255,255,0.92)',
                  letterSpacing: '-0.01em'
                }}>
                  {sector.name}
                </h3>
                
                <div className="my-6 flex-1 flex items-center">
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={`${viewMode}-${timeframe}-${sector.name}`}
                      initial={{ 
                        opacity: 0, 
                        y: sector.displayChange >= 0 ? -6 : 6,
                        scale: 0.94
                      }} 
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        scale: 1
                      }} 
                      exit={{ 
                        opacity: 0, 
                        y: sector.displayChange >= 0 ? 6 : -6,
                        scale: 0.94
                      }} 
                      transition={{ 
                        duration: 0.18, 
                        ease: [0.26, 0.11, 0.26, 1.0] 
                      }} 
                      className={`${magnitudeStyle.fontWeight}`}
                      style={{ 
                        fontSize: magnitudeStyle.fontSize, 
                        lineHeight: 1,
                        color: 'rgba(255,255,255,0.96)',
                        fontVariantNumeric: 'tabular-nums',
                        letterSpacing: '-0.025em'
                      }}
                    >
                      {sector.displayChange >= 0 ? '+' : ''}{sector.displayChange.toFixed(2)}%
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="space-y-1.5" style={{ 
                  opacity: 0.72,
                  transition: 'opacity 0.18s ease'
                }}>
                  {sector.movers.slice(0, 2).map((mover, i) => {
                    const isMoverPositive = mover.c.startsWith('+');
                    return (
                      <motion.div 
                        key={i} 
                        className="flex items-center gap-2 text-xs font-medium"
                        style={{ color: 'rgba(255,255,255,0.68)' }}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.05, duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
                      >
                        {isMoverPositive ? 
                          <TrendingUp className="w-3 h-3" style={{ color: 'rgba(132, 198, 168, 0.92)' }} strokeWidth={2.0}/> : 
                          <TrendingDown className="w-3 h-3" style={{ color: 'rgba(218, 142, 152, 0.92)' }} strokeWidth={2.0}/>
                        }
                        <span style={{ color: 'rgba(255,255,255,0.78)' }}>{mover.s}</span>
                        <span style={{ 
                          color: isMoverPositive ? 'rgba(132, 198, 168, 1)' : 'rgba(218, 142, 152, 1)',
                          fontVariantNumeric: 'tabular-nums'
                        }}>
                          {mover.c}
                        </span>
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