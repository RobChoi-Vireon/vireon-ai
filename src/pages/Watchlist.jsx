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

// ============================================================================
// OS HORIZON LIQUID GLASS TAHOE — DESIGN SYSTEM
// ============================================================================
const GLASS = {
  card: {
    bg: 'rgba(18, 24, 38, 0.52)',
    blur: 'blur(40px)',
    radius: '28px',
    border: 'rgba(255, 255, 255, 0.12)',
    borderHover: 'rgba(255, 255, 255, 0.20)',
    innerGlow: 'inset 0 0 40px rgba(255,255,255,0.025)',
    innerShadow: 'inset 0 0 30px rgba(0,0,0,0.20)'
  },
  button: {
    bg: 'rgba(255, 255, 255, 0.08)',
    bgHover: 'rgba(255, 255, 255, 0.14)',
    blur: 'blur(24px)',
    border: 'rgba(255, 255, 255, 0.14)',
    innerShadow: 'inset 0 0 14px rgba(255,255,255,0.08)'
  },
  chip: {
    bg: 'rgba(255, 255, 255, 0.08)',
    border: 'rgba(255, 255, 255, 0.16)',
    blur: 'blur(28px)',
    innerShadow: 'inset 0 0 16px rgba(255,255,255,0.08)'
  }
};

// ============================================================================
// GLASS ICON BUTTON — visionOS Style
// ============================================================================
const GlassIconButton = ({ onClick, icon: Icon, isActive, disabled, className = "" }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative rounded-2xl flex items-center justify-center ${className}`}
      style={{
        width: '44px',
        height: '44px',
        background: isActive 
          ? 'linear-gradient(135deg, rgba(99, 140, 255, 0.45) 0%, rgba(130, 100, 255, 0.35) 100%)'
          : GLASS.button.bg,
        backdropFilter: GLASS.button.blur,
        WebkitBackdropFilter: GLASS.button.blur,
        border: `1px solid ${isActive ? 'rgba(130, 160, 255, 0.40)' : GLASS.button.border}`,
        boxShadow: isActive
          ? `${GLASS.button.innerShadow}, 0 0 20px rgba(99, 140, 255, 0.25)`
          : GLASS.button.innerShadow,
        opacity: disabled ? 0.4 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer'
      }}
      animate={{
        scale: isHovered && !disabled ? 1.06 : 1,
        background: isHovered && !disabled && !isActive 
          ? GLASS.button.bgHover 
          : isActive 
            ? 'linear-gradient(135deg, rgba(99, 140, 255, 0.45) 0%, rgba(130, 100, 255, 0.35) 100%)'
            : GLASS.button.bg
      }}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      transition={{ duration: 0.15 }}
    >
      {/* Top highlight */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '20%',
        right: '20%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)',
        pointerEvents: 'none'
      }} />
      
      <Icon 
        className="w-5 h-5" 
        style={{ 
          color: isActive ? 'rgba(255,255,255,0.95)' : 'rgba(200, 210, 230, 0.85)',
          filter: isActive ? 'drop-shadow(0 0 6px rgba(130, 170, 255, 0.5))' : 'none'
        }} 
        strokeWidth={1.8} 
      />
    </motion.button>
  );
};

// ============================================================================
// LIQUID GLASS WATCHLIST CARD — OS Horizon Tahoe
// ============================================================================
const LiquidGlassCard = ({ item, index, onHeadlinesClick, onChartClick, isSelected, isSelectable, isEnabled }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const isPositive = item.change.startsWith('+');
  const performanceIntensity = Math.abs(parseFloat(item.change.replace('%', '').replace('+', '')));
  const accentColor = isPositive ? '#58E3A4' : '#FF6A7A';
  const accentRgb = isPositive ? '88, 227, 164' : '255, 106, 122';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.08, 
        ease: [0.22, 0.61, 0.36, 1] 
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      {/* Volumetric Glow — behind card */}
      <motion.div 
        className="absolute -inset-3 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 40%, rgba(${accentRgb}, 0.12) 0%, transparent 70%)`,
          filter: 'blur(30px)',
          borderRadius: '36px'
        }}
        animate={{
          opacity: isHovered ? 0.8 : 0.3,
          scale: isHovered ? 1.02 : 1
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Main Card — Liquid Glass */}
      <motion.div 
        className="relative overflow-hidden"
        style={{
          padding: '24px',
          background: GLASS.card.bg,
          backdropFilter: GLASS.card.blur,
          WebkitBackdropFilter: GLASS.card.blur,
          borderRadius: GLASS.card.radius,
          border: `1px solid ${isHovered ? GLASS.card.borderHover : GLASS.card.border}`,
          boxShadow: `
            ${GLASS.card.innerGlow},
            ${GLASS.card.innerShadow},
            0 20px 40px -15px rgba(0,0,0,0.35)
          `
        }}
        animate={{
          y: isHovered ? -4 : 0,
          boxShadow: isHovered 
            ? `
              ${GLASS.card.innerGlow},
              ${GLASS.card.innerShadow},
              0 25px 50px -15px rgba(0,0,0,0.45),
              0 0 40px rgba(${accentRgb}, 0.08)
            `
            : `
              ${GLASS.card.innerGlow},
              ${GLASS.card.innerShadow},
              0 20px 40px -15px rgba(0,0,0,0.35)
            `
        }}
        transition={{ duration: 0.25, ease: [0.22, 0.61, 0.36, 1] }}
      >
        {/* Gradient border overlay */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            borderRadius: GLASS.card.radius,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%, rgba(255,255,255,0.03) 100%)',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            padding: '1px'
          }}
        />
        
        {/* Top specular highlight */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '15%',
          right: '15%',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
          pointerEvents: 'none'
        }} />

        {/* Header */}
        <div className="flex items-start justify-between mb-5 relative z-10">
          <div className="flex items-center gap-3.5">
            {/* Pulsing status dot */}
            <div className="relative">
              <motion.div 
                className="w-2.5 h-2.5 rounded-full"
                style={{ 
                  background: accentColor,
                  boxShadow: `0 0 10px ${accentColor}, 0 0 4px ${accentColor}`
                }}
                animate={{ 
                  opacity: [0.7, 1, 0.7],
                  boxShadow: [
                    `0 0 8px ${accentColor}, 0 0 3px ${accentColor}`,
                    `0 0 14px ${accentColor}, 0 0 6px ${accentColor}`,
                    `0 0 8px ${accentColor}, 0 0 3px ${accentColor}`
                  ]
                }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
            <div>
              <h3 
                className="text-xl font-bold tracking-[-0.02em]"
                style={{ color: 'rgba(255,255,255,0.95)' }}
              >
                {item.symbol}
              </h3>
              <p 
                className="text-sm font-medium"
                style={{ color: 'rgba(200, 210, 230, 0.65)' }}
              >
                {item.name}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isEnabled('labs_modules') && (
              <GlassIconButton
                onClick={() => onHeadlinesClick(item)}
                icon={Newspaper}
              />
            )}
            <GlassIconButton
              onClick={() => onChartClick(item)}
              icon={BarChart3}
              isActive={isSelected}
              disabled={!isSelectable}
            />
          </div>
        </div>

        {/* Mini Chart */}
        <div className="h-20 mb-5 relative z-10">
          <svg width="100%" height="100%" viewBox="0 0 400 80" className="overflow-visible">
            <defs>
              <linearGradient id={`glass-gradient-${item.symbol}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={accentColor} stopOpacity={0.25} />
                <stop offset="100%" stopColor={accentColor} stopOpacity={0.02} />
              </linearGradient>
              <filter id={`glass-glow-${item.symbol}`}>
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <motion.path
              d={isPositive 
                ? "M 0,55 Q 60,65 120,50 T 240,35 T 360,40 T 400,25"
                : "M 0,25 Q 60,30 120,40 T 240,50 T 360,55 T 400,60"
              }
              fill={`url(#glass-gradient-${item.symbol})`}
              stroke={accentColor}
              strokeWidth="2.5"
              filter={`url(#glass-glow-${item.symbol})`}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut", delay: index * 0.1 }}
            />
          </svg>
        </div>

        {/* Price & Change */}
        <div className="flex items-end justify-between relative z-10">
          <div>
            <p 
              className="text-3xl font-bold tracking-[-0.02em] mb-1"
              style={{ color: 'rgba(255,255,255,0.95)' }}
            >
              {item.price}
            </p>
            <div 
              className="flex items-center gap-1.5 text-base font-semibold"
              style={{ color: accentColor }}
            >
              {isPositive ? <TrendingUp className="w-4 h-4" strokeWidth={2.5} /> : <TrendingDown className="w-4 h-4" strokeWidth={2.5} />}
              <span>{item.change}</span>
            </div>
          </div>
          
          {/* Performance bars */}
          <div className="text-right">
            <div className="flex gap-1 mb-1.5 justify-end">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1.5 rounded-full"
                  style={{
                    height: '24px',
                    background: i < Math.ceil(performanceIntensity) 
                      ? `linear-gradient(180deg, ${accentColor} 0%, rgba(${accentRgb}, 0.4) 100%)`
                      : 'rgba(255,255,255,0.08)',
                    boxShadow: i < Math.ceil(performanceIntensity) 
                      ? `0 0 8px rgba(${accentRgb}, 0.4)`
                      : 'none'
                  }}
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: 1 }}
                  transition={{ delay: index * 0.08 + i * 0.04 + 0.4, duration: 0.35 }}
                />
              ))}
            </div>
            <p 
              className="text-xs font-medium"
              style={{ color: 'rgba(200, 210, 230, 0.55)' }}
            >
              {performanceIntensity.toFixed(1)}% move
            </p>
          </div>
        </div>

        {/* Selection indicator */}
        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(99, 140, 255, 0.9) 0%, rgba(130, 100, 255, 0.85) 100%)',
                boxShadow: '0 0 16px rgba(99, 140, 255, 0.5), inset 0 1px 1px rgba(255,255,255,0.3)'
              }}
            >
              <Check className="w-4 h-4 text-white" strokeWidth={2.5} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
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
        marketMoving: 'Google\'s Gemini AI model updates show strong performance compared to competitors.', 
        catalyst: 'I/O Developer Conference - May 10th', 
        riskNote: 'AI chatbots could threaten Google\'s main search business.', 
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
      <div className="space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Skeleton className="h-9 w-44 rounded-xl" style={{ background: 'rgba(255,255,255,0.06)' }} />
          <div className="flex items-center gap-2.5">
            <Skeleton className="h-11 w-32 rounded-2xl" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <Skeleton className="h-11 w-28 rounded-2xl" style={{ background: 'rgba(255,255,255,0.06)' }} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton 
              key={i} 
              className="h-72" 
              style={{ 
                background: 'rgba(18, 24, 38, 0.45)',
                borderRadius: '28px',
                border: '1px solid rgba(255,255,255,0.08)'
              }} 
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Header — OS Horizon Style */}
      <motion.div 
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-5"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
      >
        <h1 
          className="text-3xl md:text-4xl font-bold tracking-[-0.025em]"
          style={{ color: 'rgba(255,255,255,0.95)' }}
        >
          My Watchlist
        </h1>
        <div className="flex items-center gap-2.5">
          {/* Compare Button — Glass Style */}
          <motion.button 
            onClick={toggleComparisonMode}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold"
            style={{
              background: comparisonMode 
                ? 'linear-gradient(135deg, rgba(99, 140, 255, 0.40) 0%, rgba(130, 100, 255, 0.32) 100%)'
                : GLASS.button.bg,
              backdropFilter: GLASS.button.blur,
              WebkitBackdropFilter: GLASS.button.blur,
              border: `1px solid ${comparisonMode ? 'rgba(130, 160, 255, 0.35)' : GLASS.button.border}`,
              color: comparisonMode ? 'rgba(255,255,255,0.95)' : 'rgba(200, 210, 230, 0.85)',
              boxShadow: comparisonMode 
                ? `${GLASS.button.innerShadow}, 0 0 20px rgba(99, 140, 255, 0.20)`
                : GLASS.button.innerShadow
            }}
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
          >
            <GitCompare className="w-4 h-4" strokeWidth={2} />
            <span>{comparisonMode ? 'Exit Compare' : 'Compare'}</span>
            {selectedForComparison.length > 0 && (
              <span 
                className="ml-1 px-2 py-0.5 rounded-full text-xs font-bold"
                style={{ 
                  background: 'rgba(255,255,255,0.15)',
                  color: 'rgba(255,255,255,0.95)'
                }}
              >
                {selectedForComparison.length}
              </span>
            )}
          </motion.button>
          
          {/* Add New Button — Glass Accent */}
          <motion.button 
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold"
            style={{
              background: 'linear-gradient(135deg, rgba(99, 140, 255, 0.50) 0%, rgba(130, 100, 255, 0.42) 100%)',
              backdropFilter: GLASS.button.blur,
              WebkitBackdropFilter: GLASS.button.blur,
              border: '1px solid rgba(140, 170, 255, 0.30)',
              color: 'rgba(255,255,255,0.98)',
              boxShadow: `${GLASS.button.innerShadow}, 0 0 24px rgba(99, 140, 255, 0.22)`
            }}
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            <span>Add New</span>
          </motion.button>
        </div>
      </motion.div>
      
      {/* Comparison Status Bar — Glass */}
      <AnimatePresence>
        {comparisonMode && (
          <motion.div
            initial={{ opacity: 0, y: -15, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -15, height: 0 }}
            className="overflow-hidden"
          >
            <div 
              className="p-4 rounded-2xl"
              style={{
                background: 'rgba(99, 140, 255, 0.08)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px dashed rgba(99, 140, 255, 0.25)'
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ 
                      background: 'rgba(99, 140, 255, 0.15)',
                      boxShadow: 'inset 0 0 12px rgba(99, 140, 255, 0.1)'
                    }}
                  >
                    <GitCompare className="w-4 h-4" style={{ color: '#8AB4FF' }} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: 'rgba(255,255,255,0.92)' }}>Comparison Mode</p>
                    <p className="text-xs" style={{ color: 'rgba(200, 210, 230, 0.65)' }}>
                      {selectedForComparison.length === 0 && 'Select two assets to compare'}
                      {selectedForComparison.length === 1 && `${selectedForComparison[0].symbol} selected — pick one more`}
                      {selectedForComparison.length === 2 && `Comparing ${selectedForComparison.map(s => s.symbol).join(' vs ')}`}
                    </p>
                  </div>
                </div>
                {selectedForComparison.length > 0 && (
                  <button
                    onClick={resetComparison}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
                    style={{ 
                      color: 'rgba(200, 210, 230, 0.75)',
                      background: 'rgba(255,255,255,0.06)'
                    }}
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Card Grid */}
      <AnimatePresence mode="wait">
        {!showComparisonView ? (
          <motion.div
            key="watchlist-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {watchlistData.map((item, index) => {
              const isSelected = selectedForComparison.some(s => s.symbol === item.symbol);
              const isSelectable = comparisonMode && (selectedForComparison.length < 2 || isSelected);
              
              return (
                <LiquidGlassCard
                  key={item.symbol}
                  item={item}
                  index={index}
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
            initial={{ opacity: 0, scale: 0.97, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.97, filter: 'blur(8px)' }}
          >
            <ComparisonView 
              stocks={selectedForComparison} 
              theme={theme}
              onClose={resetComparison}
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