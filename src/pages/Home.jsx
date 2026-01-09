import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useFeatureFlags } from '../components/core/FeatureFlags';
import { useMiniSheet } from '../components/core/MiniSheetProvider';
import { TrendingUp, TrendingDown, Activity, Zap, ArrowUpRight, Sparkles, Globe, BarChart3 } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { User } from '@/entities/User';

import SectorHeatmap from '../components/home/SectorHeatmap';
import ForYouCarousel from '../components/foryou/ForYouCarousel';
import ModuleWrapper from '../components/home/ModuleWrapper';
import ReorderControls from '../components/home/ReorderControls';
import MarketMovers from '../components/home/MarketMovers';
import GlobalMarketSnapshot from '../components/home/GlobalMarketSnapshot';
import KeyBenchmarks from '../components/home/KeyBenchmarks';
import PulseRadialHero from '../components/home/PulseRadialHero';
import { motion, AnimatePresence } from 'framer-motion';
import SectorDetailDrawer from '../components/home/SectorDetailDrawer';
import AssetDetailDrawer from '../components/home/AssetDetailDrawer';

const defaultModuleOrder = [
  'pulse',
  'heatmap',
  'metrics',
  'global',
  'movers',
  'watchlist',
  'foryou'
];

// Mini Sparkline Component
const MiniSparkline = ({ data, currentValue }) => {
  if (!data || data.length < 2) return null;

  const width = 120;
  const height = 60;
  const padding = 10;

  const minValue = Math.min(...data);
  const maxValue = Math.max(...data);
  const range = maxValue - minValue || 1;

  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((value - minValue) / range) * (height - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  const pathD = `M${points.split(' ').map(point => point).join(' L')}`;

  return (
    <div className="relative">
      <svg width={width} height={height} className="overflow-visible">
        <path
          d={pathD}
          fill="none"
          stroke="#58E3A4"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.9"
        />
        <circle
          cx={padding + ((data.length - 1) / (data.length - 1)) * (width - padding * 2)}
          cy={height - padding - ((currentValue - minValue) / range) * (height - padding * 2)}
          r="3"
          fill="#58E3A4"
          opacity="0.9"
        />
      </svg>
      <div className="absolute -bottom-6 right-0 text-xs font-medium" style={{ color: 'rgba(88, 227, 164, 0.6)' }}>
        7-Day Trend
      </div>
    </div>
  );
};


// Clean Market Metrics — OS Horizon
const LuxuryMetricCard = ({ item, index, isEnabled, openMiniSheet }) => {
  const [priceKey, setPriceKey] = useState(0);

  useEffect(() => {
    setPriceKey(prev => prev + 1);
  }, [item.price]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        ease: [0.26, 0.11, 0.26, 1.0]
      }}
      whileHover={{
        scale: 1.018,
        y: -2,
        transition: { duration: 0.18, ease: [0.26, 0.11, 0.26, 1.0] }
      }}
      onClick={(e) => {
        if (isEnabled('labs_modules')) {
          e.stopPropagation();
          openMiniSheet({ symbol: item.symbol }, { top: e.clientY, left: e.clientX });
        }
      }}
      className="group relative overflow-hidden rounded-3xl cursor-pointer"
      style={{
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.038) 0%, rgba(255, 255, 255, 0.022) 100%)',
        backdropFilter: 'blur(28px) saturate(165%)',
        WebkitBackdropFilter: 'blur(28px) saturate(165%)',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 16px rgba(0,0,0,0.08)'
      }}
    >
      <div className="relative z-10 p-6 lg:p-8">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-bold tracking-[0.15em] uppercase" style={{ color: 'rgba(255,255,255,0.48)' }}>
            {item.symbol}
          </div>
          <div className={`w-2 h-2 rounded-full ${item.positive ? 'bg-green-400' : 'bg-red-400'}`} style={{ opacity: 0.9 }} />
        </div>

        <motion.div
          key={priceKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: [0.26, 0.11, 0.26, 1.0] }}
          className="text-3xl lg:text-4xl font-bold tracking-[-0.02em] mb-3"
          style={{ color: 'rgba(255,255,255,0.96)' }}
        >
          {item.price}
        </motion.div>

        <div
          className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl text-sm font-semibold"
          style={{
            background: item.positive
              ? 'linear-gradient(180deg, rgba(88, 227, 164, 0.12) 0%, rgba(88, 227, 164, 0.08) 100%)'
              : 'linear-gradient(180deg, rgba(255, 106, 122, 0.12) 0%, rgba(255, 106, 122, 0.08) 100%)',
            border: item.positive ? '1px solid rgba(88, 227, 164, 0.18)' : '1px solid rgba(255, 106, 122, 0.18)',
            color: item.positive ? '#58E3A4' : '#FF6A7A'
          }}
        >
          {item.positive ? (
            <TrendingUp className="w-3.5 h-3.5" strokeWidth={2.5} />
          ) : (
            <TrendingDown className="w-3.5 h-3.5" strokeWidth={2.5} />
          )}
          <span>{item.change}</span>
        </div>
      </div>
    </motion.div>
  );
};

// Next-Gen Watchlist Card
const NextGenWatchlistCard = ({ item, onClick, isHighMove }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isPositive = parseFloat(item.changePercent) >= 0;
  const isFlat = Math.abs(parseFloat(item.changePercent)) < 0.05;

  const getPipColor = () => {
    if (isFlat) return 'bg-slate-500';
    return isPositive ? 'bg-green-500' : 'bg-red-500';
  };

  const getPipGlow = () => {
    if (isFlat) return 'shadow-[0_0_12px_2px] shadow-slate-500/30';
    return isPositive ? 'shadow-[0_0_12px_2px] shadow-green-500/30' : 'shadow-[0_0_12px_2px] shadow-red-500/30';
  };

  const getInnerGlow = () => {
    if (isFlat) return 'shadow-[inset_0_0_8px_2px] shadow-slate-500/10';
    return isPositive ? 'shadow-[inset_0_0_8px_2px] shadow-green-500/10' : 'shadow-[inset_0_0_8px_2px] shadow-red-500/10';
  }

  const WatchlistSparkline = ({ data, positive, flat }) => {
    const color = flat ? '#64748b' : (positive ? '#22c55e' : '#ef4444');
    const gradientId = `sparkline-gradient-${item.symbol}`;

    if (!data || data.length < 2) return <div className="w-16 h-8" />;

    const width = 64;
    const height = 32;
    const padding = 2;

    const minValue = Math.min(...data);
    const maxValue = Math.max(...data);
    const range = maxValue - minValue || 1;

    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - padding - ((value - minValue) / range) * (height - padding * 2);
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    }).join(' ');

    return (
      <svg width={width} height={height} className="overflow-visible" style={{ opacity: 0.6 }}>
        <path
          d={`M ${points}`}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.9"
        />
      </svg>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.05 * item.index, ease: [0.26, 0.11, 0.26, 1.0] }}
      whileHover={{ y: -2, transition: { duration: 0.18, ease: [0.26, 0.11, 0.26, 1.0] } }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onClick(item)}
      className="group relative flex-shrink-0 w-64 h-40 rounded-3xl cursor-pointer overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.038) 0%, rgba(255, 255, 255, 0.022) 100%)',
        backdropFilter: 'blur(28px) saturate(165%)',
        WebkitBackdropFilter: 'blur(28px) saturate(165%)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        padding: '32px',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 16px rgba(0,0,0,0.08)'
      }}
      aria-label={`${item.symbol}, price ${item.price}, change ${item.changePercent}% today.`}
    >
      <div className={`absolute top-4 right-4 w-2 h-2 rounded-full ${getPipColor()}`} style={{ opacity: 0.9 }} />

      <div className="relative z-10 flex flex-col justify-between h-full">
        <div>
          <div className="text-2xl font-bold text-white tracking-tight">{item.symbol}</div>
          <div className="text-xl font-bold text-white mt-1">${parseFloat(item.price.replace('$', '')).toFixed(2)}</div>
        </div>

        <div className="flex items-end justify-between">
          <div className={`flex items-center text-base ${isFlat ? 'text-slate-400' : isPositive ? 'text-green-400' : 'text-red-400'} ${isHighMove ? 'font-bold' : 'font-medium'}`}>
            {isPositive && !isFlat && <TrendingUp className="w-4 h-4 mr-1.5" strokeWidth={isHighMove ? 3 : 2.5} />}
            {!isPositive && !isFlat && <TrendingDown className="w-4 h-4 mr-1.5" strokeWidth={isHighMove ? 3 : 2.5} />}
            {isFlat && <span className="w-4 h-4 mr-1.5 font-bold">~</span>}
            {isPositive ? '+' : ''}{item.changePercent}%
          </div>
          <WatchlistSparkline data={item.sparkline} positive={isPositive} flat={isFlat} />
        </div>
      </div>
    </motion.div>
  );
};

export default function Home() {
  const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  const { isEnabled } = useFeatureFlags();
  const { openMiniSheet } = useMiniSheet();
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [moduleOrder, setModuleOrder] = useState(defaultModuleOrder);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isAssetDrawerOpen, setIsAssetDrawerOpen] = useState(false);
  const [pulseData, setPulseData] = useState({
    score: 72,
    trend: 'Somewhat Optimistic',
    insight: 'Markets are holding steady with tech stocks leading the way.',
    previousScore: 68,
    sectorBreakdown: 'Tech +3.4%, Banks +2.1%, Energy flat, Healthcare +1.2%',
    sparklineData: [65, 68, 70, 69, 71, 68, 72] // 7-day historical data
  });
  const [selectedSector, setSelectedSector] = useState(null);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isForYouVisible, setIsForYouVisible] = useState(true); // New state for 'For You' toggle

  // Move data definitions outside of useMemo to fix dependencies
  const metricCapsules = useMemo(() => [
    { symbol: 'SPY', price: '$485.20', change: '+0.85%', positive: true },
    { symbol: 'QQQ', price: '$392.15', change: '+1.24%', positive: true },
    { symbol: 'VIX', price: '18.45', change: '-2.10%', positive: false },
    { symbol: '10Y', price: '4.35%', change: '+0.05%', positive: true },
    { symbol: 'DXY', price: '103.82', change: '-0.15%', positive: false },
    { symbol: 'BTC', price: '$45,280', change: '+2.45%', positive: true },
  ], []);

  const watchlistData = useMemo(() => [
    { symbol: 'AAPL', name: 'Apple Inc.', price: '$189.25', changePercent: '1.85', positive: true, sparkline: [185, 186, 185.5, 187, 188, 189.25], index: 0 },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: '$384.30', changePercent: '0.95', positive: true, sparkline: [380, 381, 382, 383, 382.5, 384.30], index: 1 },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', price: '$875.50', changePercent: '3.42', positive: true, sparkline: [840, 855, 860, 850, 865, 875.50], index: 2 },
    { symbol: 'TSLA', name: 'Tesla, Inc.', price: '$248.75', changePercent: '-1.25', positive: false, sparkline: [255, 252, 253, 250, 249, 248.75], index: 3 },
    { symbol: 'AMZN', name: 'Amazon.com, Inc.', price: '$175.00', changePercent: '1.05', positive: true, sparkline: [172, 173, 174, 173.5, 174.5, 175.00], index: 4 },
    { symbol: 'GOOG', name: 'Alphabet Inc.', price: '$140.80', changePercent: '-0.30', positive: false, sparkline: [142, 141.5, 141, 140.5, 141.2, 140.80], index: 5 },
  ], []);

  const getTrendIndicator = useCallback(() => {
    const diff = pulseData.score - pulseData.previousScore;
    if (Math.abs(diff) < 1) return { symbol: '→', color: 'text-gray-400', label: 'Steady', sign: '' };
    if (diff > 0) return { symbol: '▲', color: 'text-green-400', label: `+${diff.toFixed(1)}`, sign: '+' };
    return { symbol: '▼', color: 'text-red-400', label: diff.toFixed(1), sign: '' };
  }, [pulseData.score, pulseData.previousScore]);

  useEffect(() => {
    // Load user's saved module order
    loadUserModuleOrder();

    // Load 'For You' visibility state
    const forYouPref = localStorage.getItem('vireon-foryou-visible');
    setIsForYouVisible(forYouPref ? JSON.parse(forYouPref) : true);

    // Initialize animatedScore on first mount with initial pulseData.score
    setAnimatedScore(pulseData.score);

    // Simulate real-time updates for pulse score
    const pulseInterval = setInterval(() => {
      setPulseData(prev => {
        const newScore = Math.min(100, Math.max(0, prev.score + (Math.random() - 0.5) * 4));
        // Update sparkline data by shifting and adding new score
        const newSparklineData = [...prev.sparklineData.slice(1), newScore];
        return {
          ...prev,
          previousScore: prev.score,
          score: newScore,
          sparklineData: newSparklineData
        };
      });
    }, 3000);

    return () => {
      clearInterval(pulseInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionally run only once on mount

  // Effect to animate the score whenever pulseData.score changes
  useEffect(() => {
    let startScore = 0;
    // Use functional update to get the latest animatedScore without adding it as a dependency
    setAnimatedScore(currentAnimatedScore => {
      startScore = currentAnimatedScore;
      return currentAnimatedScore;
    });

    let targetScore = pulseData.score;
    let duration = 1000; // 1 second animation
    let startTime = null;

    const easeInOutQuad = (t) => {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    };

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = (currentTime - startTime) / duration;
      const easedProgress = easeInOutQuad(Math.min(progress, 1)); // Ensure progress doesn't exceed 1

      const currentScore = startScore + (targetScore - startScore) * easedProgress;

      if (progress < 1) {
        setAnimatedScore(Math.round(currentScore));
        requestAnimationFrame(animate);
      } else {
        setAnimatedScore(Math.round(targetScore));
      }
    };

    const animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);

  }, [pulseData.score]); // Re-run whenever actual pulseData.score changes

  const loadUserModuleOrder = async () => {
    try {
      const user = await User.me();
      if (user.dashboard_module_order && Array.isArray(user.dashboard_module_order) && user.dashboard_module_order.length > 0) {
        const newOrder = defaultModuleOrder.filter(id => user.dashboard_module_order.includes(id));
        defaultModuleOrder.forEach(id => {
          if (!newOrder.includes(id)) {
            newOrder.push(id);
          }
        });
        setModuleOrder(newOrder);
      } else {
        setModuleOrder(defaultModuleOrder);
      }
    } catch (error) {
      console.error('Error loading module order:', error);
      setModuleOrder(defaultModuleOrder);
    } finally {
        setIsLoading(false);
    }
  };

  const saveModuleOrder = async (newOrder) => {
    try {
      await User.updateMyUserData({ dashboard_module_order: newOrder });
    } catch (error) {
      console.error('Error saving module order:', error);
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const newOrder = Array.from(moduleOrder);
    const [reorderedItem] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, reorderedItem);

    setModuleOrder(newOrder);
    saveModuleOrder(newOrder);
  };

  const handleResetToDefault = () => {
    setModuleOrder(defaultModuleOrder);
    saveModuleOrder(defaultModuleOrder);
  };

  const toggleReorderMode = () => {
    setIsReorderMode(!isReorderMode);
  };

  const handleToggleForYou = useCallback(() => {
    setIsForYouVisible(prev => {
      const newState = !prev;
      localStorage.setItem('vireon-foryou-visible', JSON.stringify(newState));
      return newState;
    });
  }, []);

  const handleAssetClick = useCallback((asset) => {
    setSelectedAsset(asset);
    setIsAssetDrawerOpen(true);
  }, []);

  const closeAssetDrawer = useCallback(() => {
    setIsAssetDrawerOpen(false);
  }, []);

  const renderModule = useMemo(() => (moduleId, index) => {
    const moduleProps = {
      moduleId,
      isReorderMode,
      theme,
      index
    };

    switch (moduleId) {
      case 'pulse':
        const trendIndicator = getTrendIndicator();
        return (
          <ModuleWrapper key={moduleId} title="Market Pulse" {...moduleProps}>
            <PulseRadialHero
              score={pulseData.score}
              trend={pulseData.trend}
              insight={pulseData.insight}
              sectorBreakdown={pulseData.sectorBreakdown}
              trendIndicator={trendIndicator}
              sparklineData={pulseData.sparklineData}
            />
          </ModuleWrapper>
        );

      case 'heatmap':
        return isEnabled('labs_modules') ? (
          <ModuleWrapper key={moduleId} title="Sector Heatmap" {...moduleProps}>
            <SectorHeatmap setSelectedSector={setSelectedSector} />
          </ModuleWrapper>
        ) : null;

      case 'metrics':
        return (
          <ModuleWrapper key={moduleId} title="Key Benchmarks" {...moduleProps}>
            <KeyBenchmarks />
          </ModuleWrapper>
        );

      case 'global':
        return (
          <ModuleWrapper key={moduleId} title="Global Markets" {...moduleProps}>
            <GlobalMarketSnapshot />
          </ModuleWrapper>
        );

      case 'movers':
        return (
          <ModuleWrapper key={moduleId} title="Market Movers" {...moduleProps}>
            <MarketMovers theme={theme} />
          </ModuleWrapper>
        );

      case 'watchlist':
        return (
          <ModuleWrapper key={moduleId} title="Tracked Assets" {...moduleProps}>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-blue-400" style={{ opacity: 0.9 }} />
                <span className="text-sm font-medium text-gray-400">{watchlistData.length} assets tracked</span>
              </div>
              <motion.button
                className="flex items-center space-x-2 px-6 py-3 rounded-2xl text-sm font-semibold text-blue-400 border border-blue-500/20 hover:bg-blue-500/10 backdrop-blur-sm transition-all duration-300"
                whileHover={{ scale: 1.018, transition: { duration: 0.18, ease: [0.26, 0.11, 0.26, 1.0] } }}
                whileTap={{ scale: 0.97, transition: { duration: 0.1 } }}
              >
                <span>View All</span>
                <ArrowUpRight className="w-4 h-4" strokeWidth={2} />
              </motion.button>
            </div>

            <div className="relative -mx-6">
              <div
                className="flex gap-x-6 overflow-x-auto pb-4 px-6 scrollbar-hide"
                style={{
                  scrollSnapType: 'x mandatory',
                  WebkitOverflowScrolling: 'touch',
                }}
              >
                {watchlistData.map((item) => (
                  <div key={item.symbol} style={{ scrollSnapAlign: 'center' }}>
                    <NextGenWatchlistCard
                      item={item}
                      onClick={handleAssetClick}
                      isHighMove={Math.abs(parseFloat(item.changePercent)) >= 3.00}
                    />
                  </div>
                ))}
              </div>
              {/* Edge Fades for scroll container */}
              <div className="absolute top-0 bottom-0 left-0 w-6 bg-gradient-to-r from-slate-900/80 to-transparent pointer-events-none" />
              <div className="absolute top-0 bottom-0 right-0 w-6 bg-gradient-to-l from-slate-900/80 to-transparent pointer-events-none" />
            </div>
          </ModuleWrapper>
        );

      case 'foryou':
        return isEnabled('labs_modules') ? (
          <ModuleWrapper key={moduleId} title="For You" {...moduleProps}>
            <ForYouCarousel isVisible={isForYouVisible} onToggle={handleToggleForYou} />
          </ModuleWrapper>
        ) : null;

      default:
        return null;
    }
  }, [isReorderMode, theme, isEnabled, pulseData, animatedScore, showTooltip, getTrendIndicator, watchlistData, handleAssetClick, isForYouVisible, handleToggleForYou]);

  if (isLoading) {
    return (
      <div className="space-y-4 md:space-y-6 animate-pulse">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-2">
            <div className="h-7 sm:h-8 w-32 md:w-48 rounded-lg" style={{ backgroundColor: 'var(--border)' }}></div>
            <div className="h-4 sm:h-4 w-24 md:w-32 rounded-md" style={{ backgroundColor: 'var(--border)' }}></div>
          </div>
          <div className="h-9 sm:h-10 w-full sm:w-32 md:w-40 rounded-lg" style={{ backgroundColor: 'var(--border)' }}></div>
        </div>
        <div className="h-36 sm:h-40 w-full rounded-xl md:rounded-2xl p-4 sm:p-6" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}></div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3">
          {Array(6).fill(0).map((_, i) => ( <div key={i} className="h-24 sm:h-28 rounded-lg md:rounded-xl" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}></div> ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8 lg:space-y-10">
        {/* OS Horizon Page Header */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-5"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
        >
          <div className="space-y-2.5">
            <h1
              className="text-3xl md:text-5xl font-bold tracking-[-0.03em]"
              style={{ 
                color: 'rgba(255,255,255,0.98)',
                letterSpacing: '-0.02em'
              }}
            >
              Market Pulse
            </h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <motion.div
                    className="w-2 h-2 rounded-full"
                    style={{ background: '#58E3A4' }}
                    animate={{
                      opacity: [0.9, 1, 0.9]
                    }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
                <span className="text-[13px] font-semibold" style={{ color: '#58E3A4' }}>Live</span>
              </div>
              <div style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.16)' }} />
              <span className="text-[13px] font-medium" style={{ color: 'rgba(255,255,255,0.56)' }}>Updated now</span>
            </div>
          </div>

          {isEnabled('labs_modules') && (
            <ReorderControls
              isReorderMode={isReorderMode}
              onToggleReorderMode={toggleReorderMode}
              onResetToDefault={handleResetToDefault}
              theme={theme}
            />
          )}
        </motion.div>

        {/* Draggable Modules with Enhanced Animations */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="home-modules" isDropDisabled={!isReorderMode}>
            {(provided) => (
              <motion.div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-8 lg:space-y-10"
                variants={{
                  visible: { transition: { staggerChildren: 0.15 } }
                }}
                initial="hidden"
                animate="visible"
              >
                {moduleOrder.map((moduleId, index) => {
                  const moduleComponent = renderModule(moduleId, index);
                  if (!moduleComponent) return null;

                  return (
                    <Draggable
                      key={moduleId}
                      draggableId={moduleId}
                      index={index}
                      isDragDisabled={!isReorderMode}
                    >
                      {(provided, snapshot) => (
                        <motion.div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`
                          ${snapshot.isDragging ? 'rotate-3 scale-105 shadow-2xl' : ''}
                          transition-all duration-300 ease-out
                          `}
                          variants={{
                            hidden: { opacity: 0, y: 50, scale: 0.95 },
                            visible: {
                              opacity: 1,
                              y: 0,
                              scale: 1,
                              transition: {
                                duration: 0.6,
                                ease: [0.23, 1, 0.32, 1]
                              }
                            }
                          }}
                          whileHover={!isReorderMode ? { y: -2, transition: { duration: 0.18, ease: [0.26, 0.11, 0.26, 1.0] } } : {}}
                        >
                          {moduleComponent}
                        </motion.div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </motion.div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {/* Render Drawer at the page level for full overlay */}
      <SectorDetailDrawer
        sector={selectedSector}
        onClose={() => setSelectedSector(null)}
        theme={theme}
      />
      <AssetDetailDrawer
        item={selectedAsset}
        isOpen={isAssetDrawerOpen}
        onClose={closeAssetDrawer}
      />
    </>
  );
}