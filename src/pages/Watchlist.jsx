import React, { useState, useEffect, useCallback } from 'react';
import { useFeatureFlags } from '../components/core/FeatureFlags';
import { useMiniSheet } from '../components/core/MiniSheetProvider';
import HeadlinesSheet from '../components/watchlist/HeadlinesSheet';
import { TrendingUp, TrendingDown, Plus, BarChart3, GitCompare, Newspaper, X, Check } from 'lucide-react';
import UpcomingEarnings from '../components/watchlist/UpcomingEarnings';
import ForYouCarousel from '../components/foryou/ForYouCarousel';
import { motion, AnimatePresence } from 'framer-motion';
import ComparisonView from '../components/watchlist/ComparisonView';
import { Skeleton } from '../components/ui/skeleton';

// Enhanced Luxury Watchlist Card Component
const LuxuryWatchlistCard = ({ item, index, theme, onHeadlinesClick, onChartClick, isSelected, isSelectable, isEnabled }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const isPositive = item.change.startsWith('+');
  const performanceIntensity = Math.abs(parseFloat(item.change.replace('%', '').replace('+', '')));

  return (
    <motion.div
      layout
      key={item.symbol}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.7, 
        delay: index * 0.1, 
        ease: [0.22, 1, 0.36, 1] 
      }}
      whileHover={{ 
        y: -10, 
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative"
    >
      {/* Dynamic Performance Glow */}
      <motion.div 
        className="absolute -inset-1 rounded-[2rem] blur-2xl transition-opacity duration-500"
        animate={{
          opacity: isHovered ? (isPositive ? 0.5 : 0.4) : 0.2,
          background: isPositive 
            ? `radial-gradient(ellipse at 70% 30%, rgba(88, 227, 164, 0.6) 0%, transparent 70%)`
            : `radial-gradient(ellipse at 70% 30%, rgba(255, 106, 122, 0.5) 0%, transparent 70%)`
        }}
      />
      
      {/* Main Card with Luxurious Styling */}
      <div className={`
        relative overflow-hidden rounded-[2rem] border backdrop-blur-2xl transition-all duration-500
        bg-gradient-to-br from-white/[0.06] via-white/[0.04] to-transparent
        border-white/[0.12] hover:border-white/[0.20]
        group-hover:shadow-2xl group-hover:shadow-black/50
        ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-black' : ''}
      `}>
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>

        <div className="relative z-10 p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className={`w-3 h-3 rounded-full ${isPositive ? 'bg-green-400' : 'bg-red-400'}`} />
                <motion.div 
                  className={`absolute inset-0 w-3 h-3 rounded-full ${isPositive ? 'bg-green-400' : 'bg-red-400'}`}
                  animate={{ scale: [1, 2.5, 1], opacity: [1, 0, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
              <div>
                <motion.h3 
                  className="text-2xl font-black tracking-[-0.02em] text-white"
                  animate={{ scale: isHovered ? 1.05 : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {item.symbol}
                </motion.h3>
                <p className="text-sm font-medium text-gray-400 group-hover:text-gray-300 transition-colors">
                  {item.name}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Headlines Button */}
              {isEnabled('labs_modules') && (
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onHeadlinesClick(item)}
                  className="p-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 backdrop-blur-sm shadow-lg hover:shadow-xl"
                >
                  <Newspaper className="w-5 h-5 text-gray-300" strokeWidth={2} />
                </motion.button>
              )}

              {/* Chart Button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onChartClick(item)}
                disabled={!isSelectable}
                className={`p-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl
                  ${isSelected
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-blue-500/25'
                    : !isSelectable
                      ? 'opacity-50 cursor-not-allowed bg-gray-500/20'
                      : 'bg-white/[0.08] hover:bg-white/[0.15] border border-white/10'
                  } backdrop-blur-sm`}
              >
                <BarChart3 className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-gray-300'}`} strokeWidth={2} />
              </motion.button>
            </div>
          </div>

          {/* Sophisticated Chart Visualization */}
          <div className="h-24 mb-6">
            <svg width="100%" height="100%" viewBox="0 0 400 96" className="overflow-visible">
              <defs>
                <linearGradient id={`gradient-${item.symbol}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={isPositive ? '#58E3A4' : '#FF6A7A'} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={isPositive ? '#58E3A4' : '#FF6A7A'} stopOpacity={0.05} />
                </linearGradient>
                <filter id={`glow-${item.symbol}`}>
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <motion.path
                d="M 0,60 Q 50,80 100,65 T 200,45 T 300,55 T 400,30"
                fill={`url(#gradient-${item.symbol})`}
                stroke={isPositive ? '#58E3A4' : '#FF6A7A'}
                strokeWidth="3"
                filter={`url(#glow-${item.symbol})`}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2, ease: "easeInOut", delay: index * 0.2 }}
              />
            </svg>
          </div>

          {/* Price and Performance */}
          <div className="flex items-end justify-between">
            <div>
              <motion.p 
                className="text-4xl font-black tracking-[-0.03em] mb-1 text-white"
                key={item.price}
                initial={{ opacity: 0.7, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {item.price}
              </motion.p>
              <motion.div
                key={item.change}
                initial={{ opacity: 0.7, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className={`flex items-center space-x-2 text-lg font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}
              >
                {isPositive ? <TrendingUp strokeWidth={2.5} /> : <TrendingDown strokeWidth={2.5} />}
                <span>{item.change}</span>
              </motion.div>
            </div>
            
            <div className="text-right">
              <div className="flex space-x-1.5 mb-2">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={`w-2 h-7 rounded-full ${i < Math.ceil(performanceIntensity) ? (isPositive ? 'bg-green-400' : 'bg-red-400') : 'bg-gray-700'}`}
                    initial={{ scaleY: 0, opacity: 0 }}
                    animate={{ scaleY: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 + i * 0.05 + 0.5, duration: 0.4 }}
                  />
                ))}
              </div>
              <p className="text-xs font-medium text-gray-400">
                Move: {performanceIntensity.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* Selection Checkmark */}
        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute top-4 right-4 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg border-2 border-black"
            >
              <Check className="w-5 h-5 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default function Watchlist() {
  const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  const { isEnabled } = useFeatureFlags();
  const { openMiniSheet } = useMiniSheet();
  
  const [selectedStock, setSelectedStock] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [comparisonMode, setComparisonMode] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState([]);
  const [showComparisonView, setShowComparisonView] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Define handleCloseSheet with useCallback to prevent re-renders
  const handleCloseSheet = useCallback(() => {
    setIsSheetOpen(false);
    setTimeout(() => setSelectedStock(null), 300);
  }, []);

  // Add Escape key listener to close modal
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        handleCloseSheet();
      }
    };

    if (isSheetOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSheetOpen, handleCloseSheet]);


  const handleHeadlinesClick = (stock) => {
    setSelectedStock(stock);
    setIsSheetOpen(true);
  };
  
  const handleChartClick = (stock) => {
    if (!comparisonMode) return;

    const isAlreadySelected = selectedForComparison.some(s => s.symbol === stock.symbol);

    if (isAlreadySelected) {
      setSelectedForComparison(prev => prev.filter(s => s.symbol !== stock.symbol));
      setShowComparisonView(false); // Hide view if one is deselected
    } else if (selectedForComparison.length < 2) {
      const newSelection = [...selectedForComparison, stock];
      setSelectedForComparison(newSelection);
      if (newSelection.length === 2) {
        setShowComparisonView(true);
      }
    }
  };

  const toggleComparisonMode = () => {
    setComparisonMode(prev => !prev);
    setSelectedForComparison([]);
    setShowComparisonView(false);
  };

  const resetComparison = () => {
    setSelectedForComparison([]);
    setShowComparisonView(false);
  };

  const watchlistData = [
    { 
      symbol: 'AAPL', 
      name: 'Apple Inc.', 
      price: '$189.25', 
      change: '+1.85%', 
      positive: true, 
      volume: '45.2M', 
      chartData: [
        { date: '2024-01-01', close: 180, open: 178, high: 182, low: 177 },
        { date: '2024-01-08', close: 185, open: 180, high: 188, low: 179 },
        { date: '2024-01-15', close: 189, open: 185, high: 192, low: 184 },
        { date: '2024-01-22', close: 190, open: 189, high: 193, low: 188 },
        { date: '2024-01-29', close: 192, open: 190, high: 195, low: 189 },
        { date: '2024-02-05', close: 195, open: 192, high: 198, low: 191 },
        { date: '2024-02-12', close: 198, open: 195, high: 200, low: 194 },
      ],
      headlines: { 
        marketMoving: 'Reports say Apple secured a new supplier for Vision Pro 2, which could speed up production.', 
        catalyst: 'WWDC Keynote - June 5th', 
        riskNote: 'European regulators are still investigating App Store practices.', 
        source: 'Bloomberg', 
        timestamp: new Date(Date.now() - 3600000).toISOString(), 
        sentiment: 'Bullish' 
      } 
    },
    { 
      symbol: 'MSFT', 
      name: 'Microsoft Corp.', 
      price: '$384.30', 
      change: '+0.95%', 
      positive: true, 
      volume: '28.1M',
      chartData: [
        { date: '2024-01-01', close: 375, open: 373, high: 378, low: 372 },
        { date: '2024-01-08', close: 380, open: 375, high: 382, low: 374 },
        { date: '2024-01-15', close: 384, open: 380, high: 386, low: 379 },
        { date: '2024-01-22', close: 385, open: 384, high: 388, low: 383 },
        { date: '2024-01-29', close: 388, open: 385, high: 390, low: 384 },
        { date: '2024-02-05', close: 390, open: 388, high: 392, low: 387 },
        { date: '2024-02-12', close: 393, open: 390, high: 395, low: 389 },
      ],
      headlines: { 
        marketMoving: 'Microsoft announces major partnership with London Stock Exchange for AI data services.', 
        catalyst: 'Ignite Conference - Nov 15th', 
        riskNote: 'Regulators are still reviewing the Activision deal, which could create problems.', 
        source: 'Reuters', 
        timestamp: new Date(Date.now() - 7200000).toISOString(), 
        sentiment: 'Bullish' 
      } 
    },
    { 
      symbol: 'NVDA', 
      name: 'NVIDIA Corp.', 
      price: '$875.50', 
      change: '+3.42%', 
      positive: true, 
      volume: '62.8M',
      chartData: [
        { date: '2024-01-01', close: 820, open: 815, high: 825, low: 810 },
        { date: '2024-01-08', close: 850, open: 820, high: 860, low: 815 },
        { date: '2024-01-15', close: 875, open: 850, high: 880, low: 845 },
        { date: '2024-01-22', close: 880, open: 875, high: 890, low: 870 },
        { date: '2024-01-29', close: 900, open: 880, high: 910, low: 875 },
        { date: '2024-02-05', close: 920, open: 900, high: 930, low: 895 },
        { date: '2024-02-12', close: 950, open: 920, high: 960, low: 915 },
      ],
      headlines: { 
        marketMoving: 'NVIDIA says demand for its new H200 AI chip is stronger than expected, beating production goals.', 
        catalyst: 'GTC AI Conference - Mar 18th', 
        riskNote: 'Big cloud companies are starting to make their own chips, which could hurt NVIDIA.', 
        source: 'The Verge', 
        timestamp: new Date(Date.now() - 900000).toISOString(), 
        sentiment: 'Bullish' 
      } 
    },
    { 
      symbol: 'TSLA', 
      name: 'Tesla Inc.', 
      price: '$248.75', 
      change: '-1.25%', 
      positive: false, 
      volume: '91.3M',
      chartData: [
        { date: '2024-01-01', close: 260, open: 258, high: 262, low: 255 },
        { date: '2024-01-08', close: 252, open: 260, high: 265, low: 250 },
        { date: '2024-01-15', close: 248, open: 252, high: 254, low: 245 },
        { date: '2024-01-22', close: 245, open: 248, high: 250, low: 240 },
        { date: '2024-01-29', close: 240, open: 245, high: 242, low: 238 },
        { date: '2024-02-05', close: 235, open: 240, high: 237, low: 233 },
        { date: '2024-02-12', close: 230, open: 235, high: 232, low: 228 },
      ],
      headlines: { 
        marketMoving: 'Tesla cuts prices again in China to compete with local car makers.', 
        catalyst: 'Q4 Earnings Call - Jan 24th', 
        riskNote: 'Investors are worried profits are shrinking due to the price war.', 
        source: 'CNBC', 
        timestamp: new Date(Date.now() - 14400000).toISOString(), 
        sentiment: 'Bearish' 
      } 
    },
    { 
      symbol: 'GOOGL', 
      name: 'Alphabet Inc.', 
      price: '$142.65', 
      change: '+0.75%', 
      positive: true, 
      volume: '31.5M',
      chartData: [
        { date: '2024-01-01', close: 138, open: 137, high: 140, low: 136 },
        { date: '2024-01-08', close: 141, open: 138, high: 143, low: 137 },
        { date: '2024-01-15', close: 142, open: 141, high: 144, low: 140 },
        { date: '2024-01-22', close: 143, open: 142, high: 145, low: 141 },
        { date: '2024-01-29', close: 145, open: 143, high: 147, low: 142 },
        { date: '2024-02-05', close: 146, open: 145, high: 148, low: 144 },
        { date: '2024-02-12', close: 148, open: 146, high: 150, low: 145 },
      ],
      headlines: { 
        marketMoving: 'Google's Gemini AI model updates show strong performance compared to competitors.', 
        catalyst: 'I/O Developer Conference - May 10th', 
        riskNote: 'AI chatbots could threaten Google's main search business.', 
        source: 'WSJ', 
        timestamp: new Date(Date.now() - 21600000).toISOString(), 
        sentiment: 'Neutral' 
      } 
    },
    { 
      symbol: 'AMZN', 
      name: 'Amazon.com, Inc.', 
      price: '$179.62', 
      change: '-1.58%', 
      positive: false, 
      volume: '41.8M',
      chartData: [
        { date: '2024-01-01', close: 175, open: 176, high: 180, low: 174 },
        { date: '2024-01-08', close: 178, open: 175, high: 181, low: 173 },
        { date: '2024-01-15', close: 179, open: 178, high: 182, low: 177 },
        { date: '2024-01-22', close: 178, open: 179, high: 180, low: 176 },
        { date: '2024-01-29', close: 177, open: 178, high: 179, low: 175 },
        { date: '2024-02-05', close: 175, open: 177, high: 177, low: 173 },
        { date: '2024-02-12', close: 173, open: 175, high: 175, low: 171 },
      ],
      headlines: { 
        marketMoving: 'Amazon Web Services launches new AI tools for business customers, strengthening its cloud leadership.', 
        catalyst: 'Prime Day Dates Announcement', 
        riskNote: 'European regulators are pushing for stricter rules on online shopping.', 
        source: 'TechCrunch', 
        timestamp: new Date(Date.now() - 86400000).toISOString(), 
        sentiment: 'Neutral' 
      } 
    },
  ];

  const watchlistTickers = watchlistData.map(item => item.symbol);

  if (isLoading) {
    return (
      <div className="space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Skeleton className="h-10 w-48" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-11 w-32 rounded-xl" />
            <Skeleton className="h-11 w-24 rounded-xl" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-80 rounded-[2rem]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      
      {/* Stunning Header */}
      <motion.div 
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1 
          className="text-4xl md:text-6xl font-black tracking-[-0.04em] text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-300"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          My Watchlist
        </motion.h1>
        <div className="flex items-stretch sm:items-center space-x-2">
          <motion.button 
            onClick={toggleComparisonMode}
            className={`
              flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold
              transition-all duration-300 hover:scale-105 border backdrop-blur-lg
              ${comparisonMode
                ? 'bg-gradient-to-r from-blue-500/80 to-indigo-600/80 text-white shadow-lg shadow-blue-500/25 border-blue-400'
                : 'bg-white/[0.08] hover:bg-white/[0.12] text-gray-300 border-white/10'
              }
            `}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <GitCompare className="w-4 h-4" strokeWidth={2} />
            <span>{comparisonMode ? 'Exit Compare' : 'Compare'}</span>
            {selectedForComparison.length > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                {selectedForComparison.length}
              </span>
            )}
          </motion.button>
          <motion.button 
            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white
            bg-gradient-to-r from-blue-500 to-indigo-600 
            hover:from-blue-600 hover:to-indigo-700
            shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30
            hover:scale-105 transition-all duration-300"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            <span>Add New</span>
          </motion.button>
        </div>
      </motion.div>
      
      {/* Elegant Comparison Status Bar */}
      <AnimatePresence>
        {comparisonMode && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            className="p-4 rounded-2xl border-2 border-dashed border-blue-500/30 bg-blue-500/10 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <GitCompare className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="font-semibold text-white">Comparison Mode</p>
                  <p className="text-sm text-gray-300">
                    {selectedForComparison.length === 0 && 'Click the chart icon on any card to select it.'}
                    {selectedForComparison.length === 1 && `You picked ${selectedForComparison[0].symbol}. Pick one more.`}
                    {selectedForComparison.length === 2 && `Comparing ${selectedForComparison.map(s => s.symbol).join(' vs ')}`}
                  </p>
                </div>
              </div>
              {selectedForComparison.length > 0 && (
                <button
                  onClick={resetComparison}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors text-gray-300 hover:text-white hover:bg-white/10"
                >
                  Reset
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence mode="wait">
        {!showComparisonView ? (
          <motion.div
            key="watchlist-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {watchlistData.map((item, index) => {
              const isSelected = selectedForComparison.some(s => s.symbol === item.symbol);
              const isSelectable = comparisonMode && (selectedForComparison.length < 2 || isSelected);
              
              return (
                <LuxuryWatchlistCard
                  key={item.symbol}
                  item={item}
                  index={index}
                  theme={theme}
                  onHeadlinesClick={handleHeadlinesClick}
                  onChartClick={handleChartClick}
                  isSelected={isSelected}
                  isSelectable={isSelectable}
                  isEnabled={isEnabled}
                />
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            key="comparison-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <ComparisonView 
              stocks={selectedForComparison} 
              theme={theme}
              onClose={resetComparison} // Resetting exits the view
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      <HeadlinesSheet 
        stock={selectedStock} 
        isOpen={isSheetOpen} 
        onClose={handleCloseSheet}
        theme={theme}
      />

      {/* Upcoming Earnings Section */}
      <UpcomingEarnings watchlistTickers={watchlistTickers} theme={theme} />

      {/* LABS: For You Carousel */}
      {isEnabled('labs_modules') && <ForYouCarousel />}
    </div>
  );
}