import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

// Sector → Full Benchmark ETF Name Mapping
const SECTOR_BENCHMARK_FULL_NAMES = {
  'Technology': 'State Street Technology Select Sector SPDR ETF (XLK)',
  'Energy': 'State Street Energy Select Sector SPDR ETF (XLE)',
  'Consumer Discretionary': 'State Street Consumer Discretionary Select Sector SPDR ETF (XLY)',
  'Consumer Staples': 'State Street Consumer Staples Select Sector SPDR ETF (XLP)',
  'Communication Services': 'State Street Communication Services Select Sector SPDR ETF (XLC)',
  'Industrials': 'State Street Industrial Select Sector SPDR ETF (XLI)',
  'Financials': 'State Street Financial Select Sector SPDR ETF (XLF)',
  'Utilities': 'State Street Utilities Select Sector SPDR ETF (XLU)',
  'Materials': 'State Street Materials Select Sector SPDR ETF (XLB)',
  'Real Estate': 'State Street Real Estate Select Sector SPDR ETF (XLRE)',
  'Healthcare': 'State Street Health Care Select Sector SPDR ETF (XLV)'
};

// Extract ticker from full name (e.g., "XLK" from "...ETF (XLK)")
const getBenchmarkTicker = (sectorName) => {
  const fullName = SECTOR_BENCHMARK_FULL_NAMES[sectorName];
  if (!fullName) return 'N/A';
  const match = fullName.match(/\(([A-Z]+)\)$/);
  return match ? match[1] : 'N/A';
};

const mockSectorData = [
  { name: 'Technology', change: '+1.85%', sparkline: [10, 20, 15, 30, 25, 45, 50], movers: [{ s: 'NVDA', c: '+4.2%' }, { s: 'AAPL', c: '+3.1%' }], context: 'AI infrastructure flows driving $2.8B rotation.', weekAgo: '+0.9%', yearAvg: '+12.4%' },
  { name: 'Communication Services', change: '+0.55%', sparkline: [35, 38, 36, 40, 39, 42, 44], movers: [{ s: 'META', c: '+2.1%' }, { s: 'GOOGL', c: '+1.8%' }], context: 'Advertising recovery boosting digital platforms.', weekAgo: '+0.2%', yearAvg: '+9.7%' },
  { name: 'Consumer Discretionary', change: '-0.45%', sparkline: [60, 55, 58, 50, 52, 48, 45], movers: [{ s: 'TSLA', c: '-2.5%' }, { s: 'AMZN', c: '+1.3%' }], context: 'Consumer spending concerns weigh on discretionary.', weekAgo: '-1.2%', yearAvg: '+3.1%' },
  { name: 'Consumer Staples', change: '+0.28%', sparkline: [50, 51, 50, 52, 51, 53, 52], movers: [{ s: 'PG', c: '+0.9%' }, { s: 'KO', c: '+0.7%' }], context: 'Defensive positioning driving staples demand.', weekAgo: '+0.1%', yearAvg: '+4.5%' },
  { name: 'Energy', change: '-2.20%', sparkline: [80, 75, 70, 65, 60, 58, 55], movers: [{ s: 'XOM', c: '-1.5%' }, { s: 'CVX', c: '-1.1%' }], context: 'Crude sell-off and inventory build pressuring sector.', weekAgo: '-0.8%', yearAvg: '+22.7%' },
  { name: 'Financials', change: '+1.15%', sparkline: [20, 22, 28, 25, 30, 35, 38], movers: [{ s: 'JPM', c: '+1.8%' }, { s: 'BAC', c: '+1.1%' }], context: 'Yield curve steepening supports lending margins.', weekAgo: '+2.1%', yearAvg: '+15.8%' },
  { name: 'Healthcare', change: '+0.72%', sparkline: [30, 32, 35, 33, 38, 40, 42], movers: [{ s: 'LLY', c: '+2.8%' }, { s: 'UNH', c: '+1.2%' }], context: 'Defensive rotation amid market uncertainty.', weekAgo: '-0.3%', yearAvg: '+8.2%' },
  { name: 'Industrials', change: '+0.90%', sparkline: [40, 42, 41, 45, 48, 47, 50], movers: [{ s: 'CAT', c: '+1.9%' }, { s: 'GE', c: '+1.3%' }], context: 'Infrastructure spending momentum continues.', weekAgo: '+1.5%', yearAvg: '+11.3%' },
  { name: 'Materials', change: '-1.05%', sparkline: [55, 52, 50, 48, 47, 45, 43], movers: [{ s: 'LIN', c: '-0.8%' }, { s: 'FCX', c: '-2.1%' }], context: 'China demand slowdown weighing on commodities.', weekAgo: '-0.6%', yearAvg: '+5.8%' },
  { name: 'Real Estate', change: '-0.85%', sparkline: [45, 44, 42, 41, 40, 39, 38], movers: [{ s: 'PLD', c: '-1.2%' }, { s: 'AMT', c: '-0.6%' }], context: 'Higher rates continuing to pressure valuations.', weekAgo: '-1.8%', yearAvg: '-2.3%' },
  { name: 'Utilities', change: '+0.15%', sparkline: [48, 48, 49, 49, 50, 50, 51], movers: [{ s: 'NEE', c: '+0.5%' }, { s: 'DUK', c: '+0.3%' }], context: 'Flight to safety supporting utility stocks.', weekAgo: '+0.4%', yearAvg: '+6.1%' },
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
  const [showAllSectors, setShowAllSectors] = useState(false);
  const [benchmarkTooltip, setBenchmarkTooltip] = useState(null);

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

  // Focus Tier - 4 key sectors with role labels
  const focusTier = [
    { ...mockSectorData[0], role: 'Leader', whyMatters: 'Driven by AI earnings upgrades' }, // Technology
    { ...mockSectorData[4], role: 'Laggard', whyMatters: 'Pressured by crude weakness' }, // Energy
    { ...mockSectorData[5], role: 'Momentum', whyMatters: 'Rates tailwind for banks' }, // Financials
    { ...mockSectorData[3], role: 'Defensive', whyMatters: 'Defensive bid on staples' } // Consumer Staples
  ];
  
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

      {/* Header + Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="text-2xl font-bold tracking-[-0.02em] mb-1" style={{ color: 'rgba(255,255,255,0.95)' }}>
            Equity Sector Heatmap
          </h2>
        </div>
        <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} timeframe={timeframe} setTimeframe={setTimeframe} />
      </div>

      {/* Market Narrative Bar */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
        className="mb-6 rounded-[18px] overflow-hidden"
        style={{
          padding: '14px 20px',
          background: 'linear-gradient(180deg, rgba(110, 180, 255, 0.06) 0%, rgba(110, 180, 255, 0.04) 100%)',
          backdropFilter: 'blur(24px) saturate(165%)',
          WebkitBackdropFilter: 'blur(24px) saturate(165%)',
          border: '1px solid rgba(110, 180, 255, 0.12)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 0 20px rgba(110, 180, 255, 0.06)'
        }}
      >
        <p className="text-[14px] font-medium text-center" style={{ 
          color: 'rgba(255,255,255,0.88)',
          letterSpacing: '0.005em',
          lineHeight: 1.5
        }}>
          Risk-on led by Technology + Financials; Energy + Materials lagging.
        </p>
      </motion.div>

      {/* Focus Tier - 4 Large Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        {focusTier.map((sector, index) => {
          const processedSector = processedData.find(s => s.name === sector.name);
          if (!processedSector) return null;
          
          const style = getTileStyle(processedSector.displayChange, maxAbsChange);

          return (
            <motion.div
              key={sector.name}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: index * 0.06, 
                duration: 0.5, 
                ease: [0.22, 0.61, 0.36, 1] 
              }}
              onClick={() => setSelectedSector(processedSector)}
              onHoverStart={() => setHoveredSector(sector.name)}
              onHoverEnd={() => setHoveredSector(null)}
              whileHover={{ 
                y: -4, 
                scale: 1.012,
                transition: { duration: 0.18, ease: [0.26, 0.11, 0.26, 1.0] }
              }}
              whileTap={{ scale: 0.985, transition: { duration: 0.10 } }}
              className="group relative rounded-[24px] cursor-pointer overflow-hidden"
              style={{ 
                padding: '32px',
                background: style.background, 
                backdropFilter: 'blur(28px) saturate(160%)',
                WebkitBackdropFilter: 'blur(28px) saturate(160%)',
                border: `1px solid ${style.border}`, 
                boxShadow: `inset 0 1px 0 rgba(255, 255, 255, 0.08), ${style.glow}`,
                transition: 'all 0.18s cubic-bezier(0.26, 0.11, 0.26, 1.0)',
                minHeight: '200px'
              }}
            >
              {/* Role Badge */}
              <motion.div 
                className="absolute top-5 right-5"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
              >
                <div 
                  className="text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider"
                  style={{
                    background: sector.role === 'Leader' || sector.role === 'Momentum'
                      ? 'linear-gradient(180deg, rgba(88, 227, 164, 0.14) 0%, rgba(88, 227, 164, 0.09) 100%)'
                      : sector.role === 'Laggard'
                      ? 'linear-gradient(180deg, rgba(255, 106, 122, 0.14) 0%, rgba(255, 106, 122, 0.09) 100%)'
                      : 'linear-gradient(180deg, rgba(147, 197, 253, 0.14) 0%, rgba(147, 197, 253, 0.09) 100%)',
                    border: sector.role === 'Leader' || sector.role === 'Momentum'
                      ? '1px solid rgba(88, 227, 164, 0.22)'
                      : sector.role === 'Laggard'
                      ? '1px solid rgba(255, 106, 122, 0.22)'
                      : '1px solid rgba(147, 197, 253, 0.22)',
                    color: sector.role === 'Leader' || sector.role === 'Momentum'
                      ? '#58E3A4'
                      : sector.role === 'Laggard'
                      ? '#FF6A7A'
                      : '#93C5FD',
                    textShadow: sector.role === 'Leader' || sector.role === 'Momentum'
                      ? '0 0 6px rgba(88, 227, 164, 0.3)'
                      : sector.role === 'Laggard'
                      ? '0 0 6px rgba(255, 106, 122, 0.3)'
                      : '0 0 6px rgba(147, 197, 253, 0.3)',
                    backdropFilter: 'blur(12px)',
                    letterSpacing: '0.04em'
                  }}
                >
                  {sector.role}
                </div>
              </motion.div>

              <div className="relative z-10 flex flex-col justify-between h-full">
                {/* Sector Name - smaller, quieter */}
                <h3 className="text-[14px] font-semibold leading-tight mb-2" style={{ 
                  color: 'rgba(255,255,255,0.68)',
                  letterSpacing: '0.01em'
                }}>
                  {sector.name}
                </h3>
                
                {/* Large % Number */}
                <div className="my-4 flex-1 flex items-center">
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={`${viewMode}-${timeframe}-${sector.name}`}
                      initial={{ opacity: 0, scale: 0.92 }} 
                      animate={{ opacity: 1, scale: 1 }} 
                      exit={{ opacity: 0, scale: 0.92 }} 
                      transition={{ duration: 0.20, ease: [0.26, 0.11, 0.26, 1.0] }} 
                      className="text-5xl font-extrabold"
                      style={{ 
                        lineHeight: 1,
                        color: 'rgba(255,255,255,0.96)',
                        fontVariantNumeric: 'tabular-nums',
                        textShadow: processedSector.displayChange > 0 
                          ? '0 0 16px rgba(34, 197, 94, 0.32)' 
                          : '0 0 16px rgba(239, 68, 68, 0.32)',
                        letterSpacing: '-0.03em'
                      }}
                    >
                      {processedSector.displayChange >= 0 ? '+' : ''}{processedSector.displayChange.toFixed(2)}%
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Why it matters - single line, plain English */}
                <p className="text-[13px] font-medium leading-relaxed mb-3" style={{ 
                  color: 'rgba(255,255,255,0.58)',
                  letterSpacing: '0.005em'
                }}>
                  {sector.whyMatters}
                </p>

                {/* Benchmark Chip */}
                <div 
                  className="relative inline-block"
                  onMouseEnter={() => setBenchmarkTooltip(sector.name)}
                  onMouseLeave={() => setBenchmarkTooltip(null)}
                >
                  <div 
                    className="inline-flex items-center rounded-[10px] cursor-help"
                    style={{
                      padding: '6px 10px',
                      background: 'rgba(255, 255, 255, 0.032)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      backdropFilter: 'blur(8px)'
                    }}
                  >
                    <span className="text-[11px] font-semibold" style={{ 
                      color: 'rgba(255,255,255,0.48)',
                      letterSpacing: '0.015em'
                    }}>
                      Benchmark: {getBenchmarkTicker(sector.name)}
                    </span>
                  </div>

                  {/* Benchmark Tooltip */}
                  <AnimatePresence>
                    {benchmarkTooltip === sector.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 4, scale: 0.94 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.94 }}
                        transition={{ duration: 0.14, ease: [0.22, 0.61, 0.36, 1] }}
                        className="absolute bottom-full mb-2 left-0 w-max max-w-[280px] z-50 rounded-[12px] pointer-events-none"
                        style={{ 
                          padding: '10px 12px',
                          background: 'linear-gradient(135deg, rgba(12, 16, 22, 0.96), rgba(18, 22, 30, 0.94))',
                          backdropFilter: 'blur(20px) saturate(165%)',
                          WebkitBackdropFilter: 'blur(20px) saturate(165%)',
                          border: '1px solid rgba(255, 255, 255, 0.10)',
                          boxShadow: 'inset 0 0.5px 0 rgba(255,255,255,0.08), 0 6px 20px rgba(0,0,0,0.30)'
                        }}
                      >
                        <div className="text-[11px] font-medium leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>
                          {SECTOR_BENCHMARK_FULL_NAMES[sector.name]}
                        </div>
                        <div className="absolute top-full left-6 w-2 h-2 rotate-45" 
                             style={{ 
                               background: 'linear-gradient(135deg, rgba(12, 16, 22, 0.96), rgba(18, 22, 30, 0.94))',
                               borderBottom: '1px solid rgba(255, 255, 255, 0.10)',
                               borderRight: '1px solid rgba(255, 255, 255, 0.10)'
                             }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                </div>

              {/* Subtle sparkline */}
              <div className="absolute bottom-6 right-6 opacity-40 group-hover:opacity-70 transition-opacity duration-300">
                <RefinedSparkline 
                  data={sector.sparkline} 
                  positive={processedSector.displayChange >= 0} 
                  isHovered={false}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* All Sectors - Collapsed/Expandable */}
      <div>
        <motion.button
          onClick={() => setShowAllSectors(!showAllSectors)}
          className="w-full rounded-[18px] mb-4"
          style={{
            padding: '14px 20px',
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.048) 0%, rgba(255, 255, 255, 0.032) 100%)',
            backdropFilter: 'blur(24px) saturate(165%)',
            WebkitBackdropFilter: 'blur(24px) saturate(165%)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 2px 8px rgba(0,0,0,0.06)'
          }}
          whileHover={{
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.068) 0%, rgba(255, 255, 255, 0.048) 100%)',
            transition: { duration: 0.16 }
          }}
          whileTap={{ scale: 0.98, transition: { duration: 0.10 } }}
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-[14px] font-semibold" style={{ 
              color: 'rgba(255,255,255,0.82)',
              letterSpacing: '0.005em'
            }}>
              {showAllSectors ? 'Hide all sectors' : 'Show all sectors'}
            </span>
            <motion.div
              animate={{ rotate: showAllSectors ? 180 : 0 }}
              transition={{ duration: 0.20, ease: [0.26, 0.11, 0.26, 1.0] }}
            >
              <TrendingDown className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.62)' }} />
            </motion.div>
          </div>
        </motion.button>

        {/* Expanded All Sectors Grid */}
        <AnimatePresence>
          {showAllSectors && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: [0.26, 0.11, 0.26, 1.0] }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-2">
                {processedData.map((sector, index) => {
                  const style = getTileStyle(sector.displayChange, maxAbsChange);
                  
                  return (
                    <motion.div
                      key={sector.name}
                      initial={{ opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ 
                        delay: index * 0.04, 
                        duration: 0.3, 
                        ease: [0.22, 0.61, 0.36, 1] 
                      }}
                      onClick={() => setSelectedSector(sector)}
                      whileHover={{ 
                        y: -2, 
                        scale: 1.02,
                        transition: { duration: 0.16, ease: [0.26, 0.11, 0.26, 1.0] }
                      }}
                      whileTap={{ scale: 0.98, transition: { duration: 0.10 } }}
                      className="group relative rounded-[18px] cursor-pointer overflow-hidden"
                      style={{ 
                        padding: '18px',
                        background: `linear-gradient(145deg, ${
                          sector.displayChange > 0 
                            ? 'rgba(16, 185, 129, 0.08), rgba(16, 185, 129, 0.04)' 
                            : 'rgba(239, 68, 68, 0.08), rgba(239, 68, 68, 0.04)'
                        })`,
                        backdropFilter: 'blur(24px) saturate(160%)',
                        WebkitBackdropFilter: 'blur(24px) saturate(160%)',
                        border: `1px solid ${
                          sector.displayChange > 0 
                            ? 'rgba(16, 185, 129, 0.16)' 
                            : 'rgba(239, 68, 68, 0.16)'
                        }`, 
                        boxShadow: `inset 0 0.5px 0 rgba(255, 255, 255, 0.06), 0 0 12px ${
                          sector.displayChange > 0 
                            ? 'rgba(16, 185, 129, 0.08)' 
                            : 'rgba(239, 68, 68, 0.08)'
                        }`,
                        transition: 'all 0.16s cubic-bezier(0.26, 0.11, 0.26, 1.0)'
                      }}
                    >
                      <div className="relative z-10">
                        {/* Sector Name */}
                        <h3 className="text-[13px] font-semibold leading-tight mb-3" style={{ 
                          color: 'rgba(255,255,255,0.78)',
                          letterSpacing: '0.005em'
                        }}>
                          {sector.name}
                        </h3>

                        {/* % Change */}
                        <AnimatePresence mode="wait">
                          <motion.div 
                            key={`${viewMode}-${timeframe}-${sector.name}`}
                            initial={{ opacity: 0, scale: 0.90 }} 
                            animate={{ opacity: 1, scale: 1 }} 
                            exit={{ opacity: 0, scale: 0.90 }} 
                            transition={{ duration: 0.18, ease: [0.26, 0.11, 0.26, 1.0] }} 
                            className="text-2xl font-bold mb-2"
                            style={{ 
                              lineHeight: 1,
                              color: 'rgba(255,255,255,0.96)',
                              fontVariantNumeric: 'tabular-nums',
                              letterSpacing: '-0.02em'
                            }}
                          >
                            {sector.displayChange >= 0 ? '+' : ''}{sector.displayChange.toFixed(2)}%
                          </motion.div>
                        </AnimatePresence>

                        {/* Benchmark Chip - Compact Tiles */}
                        <div 
                          className="relative inline-block"
                          onMouseEnter={() => setBenchmarkTooltip(sector.name)}
                          onMouseLeave={() => setBenchmarkTooltip(null)}
                        >
                          <div 
                            className="inline-flex items-center rounded-[8px] cursor-help"
                            style={{
                              padding: '4px 8px',
                              background: 'rgba(255, 255, 255, 0.028)',
                              border: '1px solid rgba(255, 255, 255, 0.06)',
                              backdropFilter: 'blur(6px)'
                            }}
                          >
                            <span className="text-[10px] font-semibold" style={{ 
                              color: 'rgba(255,255,255,0.42)',
                              letterSpacing: '0.015em'
                            }}>
                              {getBenchmarkTicker(sector.name)}
                            </span>
                          </div>

                          {/* Benchmark Tooltip */}
                          <AnimatePresence>
                            {benchmarkTooltip === sector.name && (
                              <motion.div
                                initial={{ opacity: 0, y: 4, scale: 0.94 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 4, scale: 0.94 }}
                                transition={{ duration: 0.14, ease: [0.22, 0.61, 0.36, 1] }}
                                className="absolute bottom-full mb-2 left-0 w-max max-w-[280px] z-50 rounded-[12px] pointer-events-none"
                                style={{ 
                                  padding: '10px 12px',
                                  background: 'linear-gradient(135deg, rgba(12, 16, 22, 0.96), rgba(18, 22, 30, 0.94))',
                                  backdropFilter: 'blur(20px) saturate(165%)',
                                  WebkitBackdropFilter: 'blur(20px) saturate(165%)',
                                  border: '1px solid rgba(255, 255, 255, 0.10)',
                                  boxShadow: 'inset 0 0.5px 0 rgba(255,255,255,0.08), 0 6px 20px rgba(0,0,0,0.30)'
                                }}
                              >
                                <div className="text-[11px] font-medium leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>
                                  {SECTOR_BENCHMARK_FULL_NAMES[sector.name]}
                                </div>
                                <div className="absolute top-full left-6 w-2 h-2 rotate-45" 
                                     style={{ 
                                       background: 'linear-gradient(135deg, rgba(12, 16, 22, 0.96), rgba(18, 22, 30, 0.94))',
                                       borderBottom: '1px solid rgba(255, 255, 255, 0.10)',
                                       borderRight: '1px solid rgba(255, 255, 255, 0.10)'
                                     }}
                                />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default React.memo(SectorHeatmap);