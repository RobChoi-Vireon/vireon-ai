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
  const range = maxValue - minValue || 1; // Avoid division by zero

  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((value - minValue) / range) * (height - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  const pathD = `M${points.split(' ').map(point => point).join(' L')}`;

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      <svg width={width} height={height} className="overflow-visible">
        <defs>
          <linearGradient id="sparklineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#4ADE80', stopOpacity: 0.8 }} />
            <stop offset="50%" style={{ stopColor: '#22C55E', stopOpacity: 0.9 }} />
            <stop offset="100%" style={{ stopColor: '#16A34A', stopOpacity: 1 }} />
          </linearGradient>
          <filter id="sparklineGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Glow effect */}
        <motion.path
          d={pathD}
          fill="none"
          stroke="url(#sparklineGradient)"
          strokeWidth="3"
          filter="url(#sparklineGlow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
        />

        {/* Main line */}
        <motion.path
          d={pathD}
          fill="none"
          stroke="url(#sparklineGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        />

        {/* End point indicator */}
        <motion.circle
          cx={padding + ((data.length - 1) / (data.length - 1)) * (width - padding * 2)}
          cy={height - padding - ((currentValue - minValue) / range) * (height - padding * 2)}
          r="3"
          fill="#22C55E"
          stroke="#4ADE80"
          strokeWidth="1"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 1.5 }}
        >
          <animate
            attributeName="r"
            values="3;4;3"
            dur="2s"
            repeatCount="indefinite"
          />
        </motion.circle>
      </svg>

      {/* Subtle label */}
      <motion.div
        className="absolute -bottom-6 right-0 text-xs font-medium text-green-300/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
      >
        7-Day Trend
      </motion.div>
    </motion.div>
  );
};


// Enhanced Luxury Market Metrics with Real-time Animations
const LuxuryMetricCard = ({ item, index, isEnabled, openMiniSheet }) => {
  const [priceKey, setPriceKey] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setPriceKey(prev => prev + 1);
  }, [item.price]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        delay: 0.1 + index * 0.08,
        ease: [0.23, 1, 0.32, 1]
      }}
      whileHover={{
        scale: 1.05,
        y: -8,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={(e) => {
        if (isEnabled('labs_modules')) {
          e.stopPropagation();
          openMiniSheet({ symbol: item.symbol }, { top: e.clientY, left: e.clientX });
        }
      }}
      className="group relative overflow-hidden rounded-3xl cursor-pointer"
    >
      {/* OS Horizon Liquid Glass — Tahoe */}
      <div 
        className="absolute inset-0 rounded-3xl"
        style={{
          background: 'rgba(50, 60, 78, 0.48)',
          backdropFilter: 'blur(40px) saturate(150%)',
          WebkitBackdropFilter: 'blur(40px) saturate(150%)'
        }}
      />
      
      {/* Top specular edge */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '12%',
        right: '12%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
        pointerEvents: 'none',
        zIndex: 5
      }} />

      {/* Dynamic Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-3xl"
        animate={{
          boxShadow: isHovered
            ? `0 0 60px ${item.positive ? 'rgba(88, 227, 164, 0.4)' : 'rgba(255, 106, 122, 0.4)'}`
            : '0 0 20px rgba(0, 0, 0, 0.3)'
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Ambient Light Animation */}
      <motion.div
        className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/5 to-transparent"
        animate={{
          x: isHovered ? ['-100%', '100%'] : '-100%',
          opacity: isHovered ? [0, 0.6, 0] : 0
        }}
        transition={{
          duration: isHovered ? 1.5 : 0,
          ease: "easeInOut",
          repeat: isHovered ? Infinity : 0,
          repeatDelay: 2
        }}
      />

      <div className="relative z-10 p-6 lg:p-8">
        <div className="flex items-center justify-between mb-4">
          {/* Symbol with Luxury Typography */}
          <motion.div
            className="text-xs font-black tracking-[0.2em] uppercase text-gray-400 group-hover:text-white transition-colors duration-300"
            animate={{ letterSpacing: isHovered ? '0.3em' : '0.2em' }}
            transition={{ duration: 0.3 }}
          >
            {item.symbol}
          </motion.div>

          {/* Sophisticated Status Indicator */}
          <div className="relative">
            <motion.div
              className={`w-3 h-3 rounded-full ${item.positive ? 'bg-green-400' : 'bg-red-400'}`}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [1, 0.7, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <div className={`absolute inset-0 w-3 h-3 rounded-full ${item.positive ? 'bg-green-400' : 'bg-red-400'} opacity-30 animate-ping`} />
          </div>
        </div>

        {/* Price with Stunning Animation */}
        <motion.div
          key={priceKey}
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="text-3xl lg:text-4xl font-black tracking-[-0.03em] text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all duration-300"
        >
          {item.price}
        </motion.div>

        {/* Change Indicator with Premium Styling */}
        <motion.div
          className={`
            inline-flex items-center space-x-2 px-4 py-2 rounded-2xl font-bold text-sm
            ${item.positive
              ? 'bg-gradient-to-r from-green-500/30 to-emerald-500/30 border border-green-500/40 text-green-300'
              : 'bg-gradient-to-r from-red-500/30 to-pink-500/30 border border-red-500/40 text-red-300'
            }
            shadow-2xl backdrop-blur-sm
          `}
          whileHover={{ scale: 1.05 }}
          animate={{
            boxShadow: item.positive
              ? ['0 0 20px rgba(88, 227, 164, 0.3)', '0 0 30px rgba(88, 227, 164, 0.5)', '0 0 20px rgba(88, 227, 164, 0.3)']
              : ['0 0 20px rgba(255, 106, 122, 0.3)', '0 0 30px rgba(255, 106, 122, 0.5)', '0 0 20px rgba(255, 106, 122, 0.3)']
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          {item.positive ? (
            <TrendingUp className="w-4 h-4" strokeWidth={2.5} />
          ) : (
            <TrendingDown className="w-4 h-4" strokeWidth={2.5} />
          )}
          <span>{item.change}</span>
        </motion.div>
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
      <svg width={width} height={height} className="overflow-visible opacity-50 group-hover:opacity-70 transition-opacity">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.12} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <motion.path
          d={`M ${points}`}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: "circOut" }}
        />
        <motion.path
          d={`M ${points} L ${width},${height} L 0,${height} Z`}
          fill={`url(#${gradientId})`}
          stroke="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
      </svg>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 * item.index, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3, transition: { type: 'spring', stiffness: 300, damping: 15 } }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onClick(item)}
      className="group relative flex-shrink-0 w-64 h-40 rounded-3xl cursor-pointer overflow-hidden p-6"
      style={{
        background: 'rgba(50, 60, 78, 0.48)',
        backdropFilter: 'blur(40px) saturate(150%)',
        WebkitBackdropFilter: 'blur(40px) saturate(150%)',
        border: '1px solid rgba(255, 255, 255, 0.10)',
        boxShadow: isHovered 
          ? 'inset 0 1px 0 rgba(255,255,255,0.10), 0 16px 48px -16px rgba(0,0,0,0.40)'
          : 'inset 0 1px 0 rgba(255,255,255,0.08), 0 8px 32px -12px rgba(0,0,0,0.30)'
      }}
      aria-label={`${item.symbol}, price ${item.price}, change ${item.changePercent}% today.`}
    >
      {/* Top specular edge */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '12%',
        right: '12%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
        pointerEvents: 'none'
      }} />
      {/* Glow Pip */}
      <div className={`absolute top-4 right-4 w-2 h-2 rounded-full ${getPipColor()} ${getPipGlow()} transition-all duration-300`} />

      {/* Inner Glow on Hover */}
      <motion.div
        className={`absolute inset-0 rounded-3xl transition-shadow duration-300 ${isHovered ? getInnerGlow() : ''}`}
        style={{
          boxShadow: isHovered ? `0 8px 32px rgba(0,0,0,0.2), ${getInnerGlow().replace('shadow-[inset_0_0_8px_2px]', 'inset 0 0 12px 3px')}` : '0 4px 16px rgba(0,0,0,0.2)'
        }}
      />

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
            {/* OS Horizon Liquid Glass — Tahoe Hero Pulse Card */}
            <motion.div
              className="relative overflow-hidden rounded-[2rem] p-8 lg:p-12"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
              style={{
                background: 'rgba(45, 55, 72, 0.45)',
                backdropFilter: 'blur(40px) saturate(150%)',
                WebkitBackdropFilter: 'blur(40px) saturate(150%)',
                border: '1px solid rgba(255,255,255,0.10)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), inset 0 0 50px rgba(255,255,255,0.02), 0 24px 70px -24px rgba(0,0,0,0.40)'
              }}
            >
              {/* Top specular edge */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: '6%',
                right: '6%',
                height: '1.5px',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)',
                pointerEvents: 'none',
                borderRadius: '32px 32px 0 0'
              }} />

              {/* Animated Orbs */}
              <motion.div
                className="absolute top-10 right-10 w-32 h-32 rounded-full bg-gradient-to-r from-green-400/20 to-emerald-500/20 blur-2xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute bottom-10 left-10 w-24 h-24 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-500/20 blur-xl"
                animate={{
                  scale: [1.2, 1, 1.2],
                  opacity: [0.4, 0.7, 0.4]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              />

              <div className="relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 lg:mb-12 gap-8">
                  <div className="space-y-6 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-baseline space-y-6 sm:space-y-0 sm:space-x-6">
                      {/* Enhanced Score Display with Inline Trend */}
                      <div className="relative flex items-baseline">
                        <motion.div
                          key={Math.round(animatedScore)}
                          initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
                          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                          className="relative flex items-baseline"
                        >
                          {/* Main Score */}
                          <div className="text-7xl sm:text-8xl lg:text-9xl font-black tracking-[-0.05em] text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-100 to-gray-300">
                            {Math.round(animatedScore)}
                          </div>

                          {/* Inline Trend Indicator as Superscript */}
                          <motion.div
                            className="flex items-center ml-2 -mt-4"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: 0.6 }}
                          >
                            <span className={`text-xl font-bold ${trendIndicator.color} mr-1`}>
                              ({trendIndicator.label}
                            </span>
                            <motion.span
                              className={`text-xl ${trendIndicator.color}`}
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              {trendIndicator.symbol})
                            </motion.span>
                          </motion.div>

                          {/* Glow effect behind score */}
                          <motion.div
                            className="absolute inset-0 text-7xl sm:text-8xl lg:text-9xl font-black tracking-[-0.05em] text-white opacity-20"
                            animate={{
                              textShadow: [
                                '0 0 20px rgba(255,255,255,0.2)',
                                '0 0 40px rgba(255,255,255,0.4)',
                                '0 0 20px rgba(255,255,255,0.2)'
                              ]
                            }}
                            transition={{ duration: 3, repeat: Infinity }}
                          >
                            {Math.round(animatedScore)}
                          </motion.div>
                        </motion.div>
                      </div>

                      {/* Enhanced Sentiment Badge with Tooltip */}
                      <motion.div
                        key={pulseData.trend}
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="relative group"
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
                        <div className="relative flex items-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 backdrop-blur-sm shadow-2xl">
                          {/* Dynamic Sentiment Icon */}
                          <motion.div
                            animate={{
                              scale: [1, 1.05, 1],
                              rotate: [0, 2, 0, -2, 0]
                            }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                          >
                            <TrendingUp className="w-4 h-4 text-green-300" strokeWidth={2.5} />
                          </motion.div>
                          <span className="text-green-300 text-base font-bold tracking-wide">
                            {pulseData.trend.toUpperCase()}
                          </span>
                        </div>

                        {/* Enhanced Micro-Context Tooltip */}
                        <AnimatePresence>
                          {showTooltip && (
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.9 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.9 }}
                              className="absolute top-full mt-3 left-1/2 transform -translate-x-1/2 z-50"
                            >
                              <div className="px-4 py-3 rounded-xl backdrop-blur-xl border border-white/20 shadow-2xl max-w-xs"
                                style={{
                                  background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.90))'
                                }}
                              >
                                <div className="text-xs font-medium text-white/90 text-center leading-relaxed">
                                  {pulseData.sectorBreakdown}
                                </div>
                                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rotate-45 border-t border-l border-white/20"
                                  style={{ background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.90))' }}
                                ></div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </div>

                    <motion.p
                      className="text-lg leading-relaxed max-w-2xl text-gray-300"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    >
                      {pulseData.insight}
                    </motion.p>
                  </div>

                  {/* Replace Static Icon with Dynamic Mini Sparkline */}
                  <div className="relative mx-auto lg:mx-0 flex items-center justify-center">
                    <MiniSparkline data={pulseData.sparklineData} currentValue={pulseData.score} />
                  </div>
                </div>

                {/* Enhanced Progress Bar with Gradient Fill */}
                <div className="relative">
                  {/* Background Track */}
                  <div className="h-4 rounded-full overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20">
                    {/* Animated Progress Fill with Gradient */}
                    <motion.div
                      className="h-full rounded-full relative overflow-hidden"
                      style={{
                        background: 'linear-gradient(90deg, #4ADE80 0%, #22C55E 50%, #16A34A 100%)',
                        boxShadow: '0 0 10px rgba(34, 197, 94, 0.3)'
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${animatedScore}%` }}
                      transition={{
                        duration: 1.2,
                        ease: [0.25, 0.46, 0.45, 0.94],
                        delay: 0.3
                      }}
                    >
                      {/* Enhanced Inner Glow */}
                      <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-white/20 to-white/40 rounded-full" />

                      {/* Refined Moving Highlight */}
                      <motion.div
                        className="absolute top-0 right-0 w-12 h-full rounded-full bg-gradient-to-r from-transparent via-white/50 to-transparent"
                        animate={{
                          x: ['-100%', '200%'],
                        }}
                        transition={{
                          duration: 2.5,
                          ease: "easeInOut",
                          repeat: Infinity,
                          repeatDelay: 5,
                        }}
                      />
                    </motion.div>
                  </div>

                  {/* Refined Confidence Indicator with Reduced Emphasis */}
                  <motion.div
                    className="absolute -top-8 left-0 px-2 py-1 rounded-lg bg-green-500/10 border border-green-500/20 backdrop-blur-sm"
                    initial={{ opacity: 0, x: 0 }}
                    animate={{
                      opacity: 1,
                      x: `${(animatedScore / 100) * 100}%`
                    }}
                    transition={{
                      duration: 1.2,
                      ease: [0.25, 0.46, 0.45, 0.94],
                      delay: 0.5
                    }}
                    style={{ transform: 'translateX(-50%)' }}
                  >
                    <span className="text-xs font-medium text-green-300/70">
                      Confidence: {Math.round(animatedScore)}%
                    </span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
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
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-sm font-medium text-gray-400">{watchlistData.length} assets tracked</span>
              </div>
              <motion.button
                className="flex items-center space-x-2 px-6 py-3 rounded-2xl text-sm font-semibold text-blue-400 border border-blue-500/20 hover:bg-blue-500/10 backdrop-blur-sm transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
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
        {/* Enhanced Header with Improved Live Indicator */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="space-y-2">
            <motion.h1
              className="text-3xl md:text-5xl font-black tracking-[-0.03em] text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-300"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              Market Pulse
            </motion.h1>
            <motion.div
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex items-center space-x-2">
                <div className="relative">
                  {/* Enhanced Live Indicator with Glowing Pulse */}
                  <motion.div
                    className="w-2 h-2 rounded-full bg-green-500"
                    animate={{
                      boxShadow: [
                        '0 0 4px rgba(34, 197, 94, 0.6)',
                        '0 0 12px rgba(34, 197, 94, 0.9)',
                        '0 0 4px rgba(34, 197, 94, 0.6)'
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.div
                    className="absolute inset-0 w-2 h-2 rounded-full bg-green-500"
                    animate={{
                      scale: [1, 1.8, 1],
                      opacity: [0.8, 0, 0.8]
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
                <span className="text-sm font-medium text-green-400">Live</span>
              </div>
              <div className="h-4 w-px bg-gray-600" />
              <span className="text-sm text-gray-400">Updated now</span>
            </motion.div>
          </div>

          {isEnabled('labs_modules') && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <ReorderControls
                isReorderMode={isReorderMode}
                onToggleReorderMode={toggleReorderMode}
                onResetToDefault={handleResetToDefault}
                theme={theme}
              />
            </motion.div>
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
                          whileHover={!isReorderMode ? { y: -2 } : {}}
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