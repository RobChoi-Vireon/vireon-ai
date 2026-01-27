import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';

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

function SectorHeatmap({ setSelectedSector, onSectorClick }) {
  const [viewMode, setViewMode] = useState('absolute');
  const [timeframe, setTimeframe] = useState('1D');
  const [hoveredSector, setHoveredSector] = useState(null);

  const { data: sectorData = [], isLoading } = useQuery({
    queryKey: ['sector-performance'],
    queryFn: () => base44.entities.SectorPerformance.list('-sector_key'),
    initialData: [],
  });

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
    return sectorData.map(sector => {
      let displayChange;
      if (viewMode === 'absolute') {
        if (timeframe === '1D') displayChange = sector.change_pct_today || 0;
        else if (timeframe === '1W') displayChange = sector.change_pct_week || 0;
        else displayChange = sector.change_pct_year || 0;
      } else {
        if (timeframe === '1D') displayChange = sector.change_vs_market_today || 0;
        else if (timeframe === '1W') displayChange = sector.change_vs_market_week || 0;
        else displayChange = sector.change_vs_market_year || 0;
      }
      
      const movers = [
        { s: sector.leader_ticker_1, c: `${sector.leader_ticker_1_pct >= 0 ? '+' : ''}${sector.leader_ticker_1_pct?.toFixed(2)}%` },
        { s: sector.leader_ticker_2, c: `${sector.leader_ticker_2_pct >= 0 ? '+' : ''}${sector.leader_ticker_2_pct?.toFixed(2)}%` }
      ].filter(m => m.s);

      return { 
        ...sector, 
        name: sector.sector_name,
        displayChange,
        movers,
        sparkline: sector.sparkline_points || [10, 15, 20, 18, 25, 30, 35]
      };
    });
  }, [sectorData, viewMode, timeframe]);

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
      
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/30"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
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
              onClick={() => onSectorClick?.(sector, viewMode, timeframe)}
              onHoverStart={() => setHoveredSector(sector.name)}
              onHoverEnd={() => setHoveredSector(null)}
              whileHover={{ 
                y: -3, 
                scale: 1.015,
                transition: { duration: 0.18, ease: [0.26, 0.11, 0.26, 1.0] }
              }}
              whileTap={{ scale: 0.985, transition: { duration: 0.10 } }}
              className="group relative rounded-[22px] cursor-pointer overflow-hidden"
              style={{ 
                padding: '24px',
                background: style.background, 
                backdropFilter: 'blur(28px) saturate(160%)',
                WebkitBackdropFilter: 'blur(28px) saturate(160%)',
                border: `1px solid ${style.border}`, 
                boxShadow: `inset 0 1px 0 rgba(255, 255, 255, 0.08), ${style.glow}`,
                transition: 'all 0.18s cubic-bezier(0.26, 0.11, 0.26, 1.0)'
              }}
            >
              {(isLeader || isLaggard) && (
                <motion.div 
                  className="absolute top-4 right-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
                >
                  <div 
                    className="text-[11px] font-bold px-3 py-1.5 rounded-full"
                    style={{
                      background: isLeader 
                        ? 'linear-gradient(180deg, rgba(88, 227, 164, 0.16) 0%, rgba(88, 227, 164, 0.10) 100%)'
                        : 'linear-gradient(180deg, rgba(255, 106, 122, 0.16) 0%, rgba(255, 106, 122, 0.10) 100%)',
                      border: isLeader ? '1px solid rgba(88, 227, 164, 0.24)' : '1px solid rgba(255, 106, 122, 0.24)',
                      color: isLeader ? '#58E3A4' : '#FF6A7A',
                      textShadow: isLeader ? '0 0 8px rgba(88, 227, 164, 0.4)' : '0 0 8px rgba(255, 106, 122, 0.4)',
                      backdropFilter: 'blur(12px)',
                      letterSpacing: '0.02em'
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
                        y: sector.displayChange >= 0 ? -8 : 8,
                        scale: 0.92
                      }} 
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        scale: 1
                      }} 
                      exit={{ 
                        opacity: 0, 
                        y: sector.displayChange >= 0 ? 8 : -8,
                        scale: 0.92
                      }} 
                      transition={{ 
                        duration: 0.20, 
                        ease: [0.26, 0.11, 0.26, 1.0] 
                      }} 
                      className={`${magnitudeStyle.fontWeight}`}
                      style={{ 
                        fontSize: magnitudeStyle.fontSize, 
                        lineHeight: 1,
                        color: 'rgba(255,255,255,0.98)',
                        fontVariantNumeric: 'tabular-nums',
                        textShadow: magnitudeStyle.textShadow,
                        letterSpacing: '-0.02em'
                      }}
                    >
                      {sector.displayChange >= 0 ? '+' : ''}{sector.displayChange.toFixed(2)}%
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="space-y-1.5" style={{ 
                  opacity: 0.78,
                  transition: 'opacity 0.18s ease'
                }}>
                  {sector.movers.slice(0, 2).map((mover, i) => {
                    const isMoverPositive = mover.c.startsWith('+');
                    return (
                      <motion.div 
                        key={i} 
                        className="flex items-center gap-2 text-xs font-semibold"
                        style={{ color: 'rgba(255,255,255,0.72)' }}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.05, duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
                      >
                        {isMoverPositive ? 
                          <TrendingUp className="w-3.5 h-3.5" style={{ color: '#58E3A4' }} strokeWidth={2.2}/> : 
                          <TrendingDown className="w-3.5 h-3.5" style={{ color: '#FF6A7A' }} strokeWidth={2.2}/>
                        }
                        <span style={{ color: 'rgba(255,255,255,0.80)' }}>{mover.s}</span>
                        <span style={{ 
                          color: isMoverPositive ? '#58E3A4' : '#FF6A7A',
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
      )}
    </div>
  );
}

export default React.memo(SectorHeatmap);