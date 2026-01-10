import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Globe, Clock, Activity, ArrowUpRight, BarChart3, Landmark, Sunrise, Bitcoin, AreaChart, Droplets, ChevronDown, ChevronUp, Zap, AlertTriangle, DollarSign } from 'lucide-react';

const marketData = {
  US: [
    { name: 'S&P 500 Futures', symbol: 'ES=F', price: 4847.50, change: 12.75, changePercent: 0.26, context: "Futures rebound as mega-cap tech leads.", previous_close: 4834.75, ytd_change: '+2.1%', driver: "Inflation data coming in cooler than expected.", sparkline: [4820, 4835, 4840, 4845, 4847] },
    { name: 'Nasdaq Futures', symbol: 'NQ=F', price: 17234.25, change: -45.20, changePercent: -0.26, context: "Slight pullback after recent AI-driven rally.", previous_close: 17279.45, ytd_change: '+4.3%', driver: "Profit-taking in semiconductor stocks.", sparkline: [17280, 17260, 17245, 17240, 17234] },
    { name: 'Dow Futures', symbol: 'YM=F', price: 38456.00, change: 89.50, changePercent: 0.23, context: "Industrials and financials showing strength.", previous_close: 38366.50, ytd_change: '+1.8%', driver: "Strong bank earnings reports.", sparkline: [38400, 38420, 38440, 38450, 38456] },
    { name: 'VIX Index', symbol: 'VIX', price: 16.45, change: -0.85, changePercent: -4.91, context: "Volatility cools as risk appetite returns.", previous_close: 17.30, ytd_change: '-8.2%', driver: "Lower implied volatility ahead of Fed meeting.", sparkline: [17.8, 17.2, 16.8, 16.5, 16.45] }
  ],
  Europe: [
    { name: 'FTSE 100', symbol: 'UKX', price: 7698.20, change: 24.80, changePercent: 0.32, context: "Miners and oil majors provide support.", previous_close: 7673.40, ytd_change: '+0.5%', driver: "Commodity prices ticking slightly higher.", sparkline: [7665, 7680, 7690, 7695, 7698] },
    { name: 'DAX Index', symbol: 'DAX', price: 17089.40, change: -45.60, changePercent: -0.27, context: "Dragged lower by autos and banks.", previous_close: 17135.00, ytd_change: '+1.1%', driver: "ECB commentary hints at prolonged high rates.", sparkline: [17140, 17120, 17100, 17090, 17089] },
    { name: 'CAC 40', symbol: 'CAC', price: 7594.33, change: 18.90, changePercent: 0.25, context: "Luxury goods sector posts modest gains.", previous_close: 7575.43, ytd_change: '+0.9%', driver: "Positive earnings from LVMH group.", sparkline: [7570, 7580, 7585, 7590, 7594] },
    { name: 'EUR/USD', symbol: 'EURUSD', price: 1.0842, change: -0.0025, changePercent: -0.23, context: "Dollar strength weighs on the pair.", previous_close: 1.0867, ytd_change: '-1.5%', driver: "Diverging central bank expectations.", sparkline: [1.087, 1.086, 1.085, 1.0845, 1.0842] }
  ],
  Asia: [
    { name: 'Nikkei 225', symbol: 'N225', price: 33486.89, change: 156.25, changePercent: 0.47, context: "Tech exports continue to boost index.", previous_close: 33330.64, ytd_change: '+15.2%', driver: "Weaker Yen benefits major exporters.", sparkline: [33300, 33350, 33400, 33450, 33487] },
    { name: 'Hang Seng', symbol: 'HSI', price: 16538.42, change: -89.75, changePercent: -0.54, context: "Property sector concerns remain an overhang.", previous_close: 16628.17, ytd_change: '-3.4%', driver: "Regulatory uncertainty from Beijing.", sparkline: [16650, 16600, 16570, 16550, 16538] },
    { name: 'Shanghai Comp', symbol: 'SHCOMP', price: 2973.34, change: 12.84, changePercent: 0.43, context: "State-backed funds provide market stability.", previous_close: 2960.50, ytd_change: '-0.1%', driver: "PBOC injects liquidity to support markets.", sparkline: [2955, 2965, 2970, 2972, 2973] },
    { name: 'USD/JPY', symbol: 'USDJPY', price: 149.85, change: 0.42, changePercent: 0.28, context: "Rate differential continues to favor USD.", previous_close: 149.43, ytd_change: '+6.1%', driver: "Bank of Japan maintains dovish stance.", sparkline: [149.2, 149.4, 149.6, 149.7, 149.85] }
  ],
  Cryptocurrencies: [
    { name: 'Bitcoin', symbol: 'BTC-USD', price: 43580.50, change: 1245.75, changePercent: 2.94, context: "Crypto rally fueled by ETF flows.", previous_close: 42334.75, ytd_change: '+161.8%', driver: "Over $1.2B in net inflows to spot Bitcoin ETFs.", sparkline: [42000, 42500, 43000, 43300, 43581] },
    { name: 'Ethereum', symbol: 'ETH-USD', price: 2634.82, change: -45.20, changePercent: -1.69, context: "Consolidating gains below key resistance.", previous_close: 2680.02, ytd_change: '+115.2%', driver: "Anticipation of potential spot ETH ETFs.", sparkline: [2700, 2680, 2660, 2645, 2635] },
    { name: 'Solana', symbol: 'SOL-USD', price: 98.75, change: -2.85, changePercent: -2.81, context: "High-beta names see profit-taking.", previous_close: 101.60, ytd_change: '+890.5%', driver: "Network activity remains high despite price dip.", sparkline: [102, 101, 100, 99.5, 98.75] },
    { name: 'XRP', symbol: 'XRP-USD', price: 0.6234, change: 0.0156, changePercent: 2.57, context: "Positive momentum on legal clarity.", previous_close: 0.6078, ytd_change: '+80.1%', driver: "Favorable developments in SEC lawsuit.", sparkline: [0.605, 0.610, 0.618, 0.621, 0.6234] }
  ],
  Rates: [
    { name: '10Y Treasury', symbol: 'TNX', price: 4.287, change: 0.019, changePercent: 0.45, context: "Yields drift higher on economic data.", previous_close: 4.268, ytd_change: '+10.2%', driver: "Higher than expected jobs number.", sparkline: [4.25, 4.26, 4.27, 4.28, 4.287] },
    { name: '2Y Treasury', symbol: 'US2Y', price: 4.456, change: -0.012, changePercent: -0.27, context: "Front-end of the curve remains anchored.", previous_close: 4.468, ytd_change: '+0.5%', driver: "Reflects market pricing of Fed policy.", sparkline: [4.48, 4.47, 4.46, 4.458, 4.456] },
    { name: 'Fed Funds Rate', symbol: 'FEDFUNDS', price: 5.38, change: 0.00, changePercent: 0.00, context: "Market pricing in 'higher for longer'.", previous_close: 5.38, ytd_change: '+22.1%', driver: "No change expected at next FOMC meeting.", sparkline: [5.38, 5.38, 5.38, 5.38, 5.38] },
    { name: 'German 10Y Bund', symbol: 'TNX-DE', price: 2.184, change: -0.018, changePercent: -0.82, context: "European yields fall on dovish ECB hints.", previous_close: 2.202, ytd_change: '-12.5%', driver: "Weaker EU inflation prints.", sparkline: [2.21, 2.20, 2.19, 2.186, 2.184] }
  ],
  Commodities: [
    { name: 'Crude Oil WTI', symbol: 'CL=F', price: 78.25, change: -1.45, changePercent: -1.82, context: "Oil down on oversupply fears.", previous_close: 79.70, ytd_change: '+8.1%', driver: "Higher than expected US inventory build.", sparkline: [80.5, 79.8, 79.0, 78.5, 78.25] },
    { name: 'Gold Futures', symbol: 'GC=F', price: 2034.80, change: 8.90, changePercent: 0.44, context: "Finds support from geopolitical risks.", previous_close: 2025.90, ytd_change: '+11.2%', driver: "Central bank buying continues to be a tailwind.", sparkline: [2020, 2025, 2030, 2032, 2035] },
    { name: 'Natural Gas', symbol: 'NG=F', price: 2.847, change: 0.089, changePercent: 3.23, context: "Sharp rebound on weather forecast shifts.", previous_close: 2.758, ytd_change: '-45.6%', driver: "Colder weather forecasts for North America.", sparkline: [2.75, 2.78, 2.82, 2.84, 2.847] },
    { name: 'Copper Futures', symbol: 'HG=F', price: 3.8425, change: -0.0275, changePercent: -0.71, context: "Global growth concerns weigh on price.", previous_close: 3.8700, ytd_change: '-0.5%', driver: "Weaker manufacturing data from China.", sparkline: [3.88, 3.87, 3.86, 3.85, 3.8425] }
  ]
};

// Regional sentiment and highlights data
const regionalSentiment = {
  US: { sentiment: 'Positive', summary: 'Tech strength offsets rate worries; futures steady.', color: 'text-emerald-400', tooltipText: 'Tech Strength Leads' },
  Europe: { sentiment: 'Mixed', summary: 'DAX softer on autos; FTSE flat on energy rebound.', color: 'text-amber-400', tooltipText: 'Mixed Sector Flows' },
  Asia: { sentiment: 'Mixed', summary: 'Nikkei surges on weak yen; China drags lower.', color: 'text-amber-400', tooltipText: 'Divergent Performance' },
  Cryptocurrencies: { sentiment: 'Positive', summary: 'Crypto rally fueled by institutional inflows.', color: 'text-emerald-400', tooltipText: 'Strong ETF Inflows' },
  Rates: { sentiment: 'Neutral', summary: 'Yields steady ahead of Fed minutes release.', color: 'text-slate-400', tooltipText: 'Yields Remain Stable' },
  Commodities: { sentiment: 'Negative', summary: 'Oil slide pressures energy complex broadly.', color: 'text-red-400', tooltipText: 'Oil Prices Weaken' }
};

const globalHighlights = [
  { icon: Droplets, text: 'Oil slide pressures energy equities globally.', sentiment: 'negative' },
  { icon: Bitcoin, text: 'Crypto rally boosts risk appetite across markets.', sentiment: 'positive' },
  { icon: AreaChart, text: 'Bond yields steady ahead of Fed minutes release.', sentiment: 'neutral' },
  { icon: TrendingUp, text: 'Tech megacaps drive futures momentum higher.', sentiment: 'positive' }
];

const MiniSparkline = ({ data, positive }) => {
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 50;
    const y = 16 - ((value - Math.min(...data)) / (Math.max(...data) - Math.min(...data))) * 12;
    return `${x},${y}`;
  }).join(' ');
  const strokeColor = positive ? 'var(--bull)' : 'var(--bear)';

  return (
    <svg width="50" height="16" className="overflow-visible">
      <defs>
        <linearGradient id={`global-sparkline-gradient-${positive ? 'positive' : 'negative'}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: strokeColor, stopOpacity: 0.4 }} />
          <stop offset="100%" style={{ stopColor: strokeColor, stopOpacity: 0.1 }} />
        </linearGradient>
      </defs>
      <motion.polyline fill="none" stroke={strokeColor} strokeWidth="2" points={points} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, ease: "easeOut" }} />
      <motion.polygon fill={`url(#global-sparkline-gradient-${positive ? 'positive' : 'negative'})`} points={`${points} 50,16 0,16`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }} />
    </svg>
  );
};

const GlobalMarketCard = ({ instrument, index, region }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isPositive = instrument.change >= 0;
  const isOutsizedMove = Math.abs(instrument.changePercent) >= 2;

  const regionThemes = {
    US: 'from-blue-500/10 to-indigo-500/10 border-blue-500/20',
    Europe: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/20',
    Asia: 'from-orange-500/10 to-red-500/10 border-orange-500/20',
    Cryptocurrencies: 'from-yellow-500/10 to-amber-500/10 border-yellow-500/20',
    Rates: 'from-purple-500/10 to-violet-500/10 border-purple-500/20',
    Commodities: 'from-rose-500/10 to-pink-500/10 border-rose-500/20'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.23, 1, 0.32, 1] }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative"
    >
      <motion.div
        whileHover={{ y: -4, scale: 1.03, transition: { duration: 0.2 } }}
        className="relative overflow-hidden rounded-2xl p-6 cursor-pointer transition-all duration-300 backdrop-blur-xl border"
        style={{
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.038) 0%, rgba(255, 255, 255, 0.022) 100%)',
          borderColor: 'rgba(255,255,255,0.08)',
          boxShadow: isOutsizedMove
            ? `inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 16px rgba(0,0,0,0.08), 0 0 24px ${isPositive ? 'rgba(88, 227, 164, 0.2)' : 'rgba(255, 106, 122, 0.2)'}`
            : 'inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 16px rgba(0,0,0,0.08)'
        }}
      >
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <p className="text-lg font-bold truncate text-white" title={instrument.name}>{instrument.name}</p>
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{instrument.symbol}</p>
            </div>
            <div className="ml-3 flex-shrink-0 pt-1">
              <MiniSparkline data={instrument.sparkline} positive={isPositive} />
            </div>
          </div>

          <div className="mt-auto space-y-3">
            <motion.div
              key={instrument.price}
              initial={{ opacity: 0.7, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`text-3xl font-black tracking-tight ${isOutsizedMove ? (isPositive ? 'text-green-300' : 'text-red-300') : 'text-white'}`}
            >
              {typeof instrument.price === 'number' && instrument.price < 10
                ? instrument.price.toFixed(4)
                : instrument.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </motion.div>

            <motion.div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl font-bold text-sm ${isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {isPositive ? <TrendingUp className="w-4 h-4" strokeWidth={2.5} /> : <TrendingDown className="w-4 h-4" strokeWidth={2.5} />}
              <span>{isPositive ? '+' : ''}{instrument.change.toFixed(2)}</span>
              <span className="text-xs opacity-80">({isPositive ? '+' : ''}{instrument.changePercent.toFixed(2)}%)</span>
            </motion.div>

            <p className="text-xs text-gray-400 pt-2">{instrument.context}</p>
          </div>

          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: '16px' }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="overflow-hidden border-t border-white/10"
              >
                <div className="pt-4 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Prev. Close</span>
                    <span className="font-medium text-white">{instrument.previous_close.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">YTD Change</span>
                    <span className={`font-medium ${instrument.ytd_change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>{instrument.ytd_change}</span>
                  </div>
                   <div className="flex items-start space-x-2 pt-1">
                    <ArrowUpRight className="w-3 h-3 mt-0.5 text-gray-500 flex-shrink-0" />
                    <p className="text-xs text-gray-300">{instrument.driver}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

const regionIcons = {
  US: BarChart3,
  Europe: Landmark,
  Asia: Sunrise,
  Cryptocurrencies: Bitcoin,
  Rates: AreaChart,
  Commodities: Droplets,
};

const SentimentBadge = ({ sentiment, tooltipText }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getBadgeStyle = (sentiment) => {
    switch (sentiment) {
      case 'Positive': return 'bg-gradient-to-r from-emerald-500/20 to-green-500/20 border-emerald-500/30 text-emerald-300';
      case 'Negative': return 'bg-gradient-to-r from-red-500/20 to-rose-500/20 border-red-500/30 text-red-300';
      case 'Mixed': return 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-amber-500/30 text-amber-300';
      default: return 'bg-gradient-to-r from-slate-500/20 to-gray-500/20 border-slate-500/30 text-slate-300'; // Neutral
    }
  };

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative flex items-center"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium border backdrop-blur-sm ${getBadgeStyle(sentiment)}`}
      >
        {sentiment}
      </motion.div>
      <AnimatePresence>
        {isHovered && tooltipText && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max z-20"
          >
            <div className="px-3 py-1.5 text-xs font-semibold text-white rounded-lg border border-white/15 shadow-xl"
              style={{
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.9))',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)'
              }}
            >
              {tooltipText}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const RegionButton = ({ region, isActive, onClick }) => {
  const Icon = regionIcons[region];
  const sentiment = regionalSentiment[region];

  return (
    <motion.button
      onClick={onClick}
      className="relative group px-4 py-2.5 text-sm font-semibold tracking-wide rounded-xl transition-all duration-300 ease-out min-h-[44px] backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      style={{
        color: isActive ? 'rgba(255,255,255,0.96)' : 'rgba(155,163,176,1)'
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      tabIndex={0}
      role="tab"
      aria-selected={isActive}
      aria-controls={`${region.toLowerCase()}-panel`}
    >
      <div className="flex items-center space-x-2.5">
        {Icon && <Icon className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors duration-300" strokeWidth={2} style={ isActive ? { color: 'white' } : {}} />}
        <span>{region}</span>
        <SentimentBadge sentiment={sentiment.sentiment} tooltipText={sentiment.tooltipText} />
      </div>
      {isActive && (
        <motion.div 
          layoutId="activeRegionTab" 
          className="absolute inset-0 rounded-xl" 
          style={{ 
            zIndex: -1,
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.068) 0%, rgba(255, 255, 255, 0.048) 100%)',
            border: '1px solid rgba(255,255,255,0.10)',
            boxShadow: 'inset 0 0.5px 0 rgba(255,255,255,0.08), 0 2px 8px rgba(0,0,0,0.06)'
          }} 
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} 
        />
      )}
    </motion.button>
  );
};

const CombinedSentimentRow = ({ activeRegion, regionalSummaries }) => {
  const [isNarrativeHovered, setIsNarrativeHovered] = useState(false);
  const sentiment = regionalSentiment[activeRegion];
  const regions = ['US', 'Europe', 'Asia', 'Cryptocurrencies', 'Rates', 'Commodities'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mt-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-8"
    >
      {/* Left: Sentiment Badges */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2 lg:pb-0 -mx-2 px-2 lg:mx-0 lg:px-0"
        style={{
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <span className="text-xs font-semibold text-gray-400 whitespace-nowrap mr-2 hidden lg:inline">Sentiment:</span>
        {regions.map((region) => {
          const summary = regionalSummaries[region];
          const isActive = region === activeRegion;

          return (
            <motion.div
              key={region}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-medium backdrop-blur-sm border whitespace-nowrap transition-all duration-200 ${summary.isPositive ? 'bg-green-500/10 text-green-400 border-green-500/25' : 'bg-red-500/10 text-red-400 border-red-500/25'} ${!isActive ? 'opacity-70 hover:opacity-100' : ''}`}
              style={{ scrollSnapAlign: 'start' }}
              whileHover={{ scale: 1.02 }}
            >
              <span>{region}</span>
              <span>{summary.isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(summary.avg).toFixed(2)}%</span>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Right: Active Region Narrative */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative flex-1 lg:max-w-md"
        onMouseEnter={() => setIsNarrativeHovered(true)}
        onMouseLeave={() => setIsNarrativeHovered(false)}
      >
        <motion.p
          key={activeRegion}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className={`text-sm font-medium ${sentiment.color} leading-relaxed lg:text-right cursor-help`}
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {sentiment.summary}
        </motion.p>

        {/* Full Text Tooltip on Hover */}
        <AnimatePresence>
          {isNarrativeHovered && sentiment.summary.length > 60 && (
            <motion.div
              initial={{ opacity: 0, y: 5, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.95 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute top-full right-0 mt-2 w-max max-w-xs z-20"
            >
              <div className="px-3 py-2 text-xs font-medium text-white rounded-lg border border-white/15 shadow-xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.9))',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)'
                }}
              >
                {sentiment.summary}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

const HighlightsDrawer = ({ isOpen, onToggle }) => {
  return (
    <div className="mt-6">
      <motion.button
        onClick={onToggle}
        className="flex items-center space-x-2 text-sm font-medium text-gray-400 hover:text-white transition-colors duration-300"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span>Global Highlights</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="mt-4 overflow-hidden rounded-2xl border border-white/10 backdrop-blur-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6), rgba(15, 23, 42, 0.8))'
            }}
          >
            <div className="p-6 space-y-4">
              {globalHighlights.map((highlight, index) => {
                const Icon = highlight.icon;
                const getHighlightColor = (sentiment) => {
                  switch (sentiment) {
                    case 'positive': return 'text-emerald-400';
                    case 'negative': return 'text-red-400';
                    default: return 'text-amber-400';
                  }
                };

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ x: 4, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                    className="flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 cursor-default"
                  >
                    <Icon className={`w-5 h-5 ${getHighlightColor(highlight.sentiment)}`} strokeWidth={1.5} />
                    <span className="text-sm text-gray-300 leading-relaxed">{highlight.text}</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const calculateRegionalChange = (regionData) => {
  if (!regionData || regionData.length === 0) return { avg: 0, isPositive: true };
  const sum = regionData.reduce((acc, curr) => acc + curr.changePercent, 0);
  const avg = sum / regionData.length;
  return { avg: avg, isPositive: avg >= 0 };
};

const GlobalMarketSnapshot = () => {
  const [activeRegion, setActiveRegion] = useState('US');
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [liveMarketData, setLiveMarketData] = useState(marketData);
  const [showHighlights, setShowHighlights] = useState(false);

  const tabListRef = useRef(null); // Ref for the tablist container

  const regions = ['US', 'Europe', 'Asia', 'Cryptocurrencies', 'Rates', 'Commodities'];
  const currentData = liveMarketData[activeRegion] || [];

  const regionalSummaries = useMemo(() => ({
    US: calculateRegionalChange(liveMarketData.US),
    Europe: calculateRegionalChange(liveMarketData.Europe),
    Asia: calculateRegionalChange(liveMarketData.Asia),
    Cryptocurrencies: calculateRegionalChange(liveMarketData.Cryptocurrencies),
    Rates: calculateRegionalChange(liveMarketData.Rates),
    Commodities: calculateRegionalChange(liveMarketData.Commodities),
  }), [liveMarketData]);

  useEffect(() => {
    if (!isAutoRefresh) return;
    const interval = setInterval(() => {
      setLiveMarketData(prevData => {
        const newData = JSON.parse(JSON.stringify(prevData));
        Object.keys(newData).forEach(region => {
          newData[region].forEach(instrument => {
            const volatility = 0.001; // reduced volatility for more stable demo
            const change = (Math.random() - 0.5) * 2 * volatility * instrument.price;
            instrument.price += change;
            instrument.change += change;
            const divisor = instrument.price - instrument.change;
            instrument.changePercent = divisor !== 0 ? (instrument.change / divisor) * 100 : 0;
            instrument.sparkline.shift();
            instrument.sparkline.push(instrument.price);
          });
        });
        return newData;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [isAutoRefresh]);

  const handleTabKeyDown = (e) => {
    const tabs = Array.from(tabListRef.current.querySelectorAll('[role="tab"]'));
    const focusedTab = document.activeElement;
    const currentIndex = tabs.indexOf(focusedTab);

    if (currentIndex === -1) return; // If focus is not on a tab, do nothing.

    let newIndex = currentIndex;

    switch (e.key) {
      case 'ArrowLeft':
        newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        e.preventDefault();
        break;
      case 'ArrowRight':
        newIndex = (currentIndex + 1) % tabs.length;
        e.preventDefault();
        break;
      case 'Home':
        newIndex = 0;
        e.preventDefault();
        break;
      case 'End':
        newIndex = tabs.length - 1;
        e.preventDefault();
        break;
      case 'Enter':
      case ' ': // Spacebar
        // Do nothing special here, the onClick handler will fire.
        // Prevent default spacebar scrolling for accessibility
        e.preventDefault();
        break;
      default:
        return; // Don't prevent default for other keys
    }

    if (newIndex !== currentIndex) {
      tabs[newIndex].focus();
      tabs[newIndex].click(); // Activate the tab visually and logically
    }
  };

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-20 -mx-8 px-8 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center border backdrop-blur-sm" 
              style={{
                background: 'linear-gradient(180deg, rgba(77, 143, 251, 0.14) 0%, rgba(77, 143, 251, 0.10) 100%)',
                border: '1px solid rgba(77, 143, 251, 0.24)',
                boxShadow: 'inset 0 0.5px 0 rgba(255,255,255,0.10), 0 2px 8px rgba(0,0,0,0.08)'
              }}
              whileHover={{ scale: 1.05, rotate: 5 }} 
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Globe className="w-6 h-6 text-blue-400" strokeWidth={2} />
            </motion.div>
            <div>
              <h2 className="text-3xl font-black tracking-[-0.02em] text-white">Global Markets</h2>
              <p className="text-sm text-gray-400 flex items-center space-x-2"><Clock className="w-4 h-4" /><span>24/7 worldwide coverage</span></p>
            </div>
          </div>
          <motion.button 
            onClick={() => setIsAutoRefresh(!isAutoRefresh)} 
            className="flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 border backdrop-blur-sm"
            style={{
              background: isAutoRefresh 
                ? 'linear-gradient(180deg, rgba(88, 227, 164, 0.12) 0%, rgba(88, 227, 164, 0.08) 100%)'
                : 'linear-gradient(180deg, rgba(155, 163, 176, 0.12) 0%, rgba(155, 163, 176, 0.08) 100%)',
              borderColor: isAutoRefresh ? 'rgba(88, 227, 164, 0.24)' : 'rgba(155, 163, 176, 0.20)',
              color: isAutoRefresh ? '#58E3A4' : '#9BA3B0',
              boxShadow: 'inset 0 0.5px 0 rgba(255,255,255,0.08), 0 2px 8px rgba(0,0,0,0.06)'
            }}
            whileHover={{ scale: 1.05 }} 
            animate={{ 
              boxShadow: isAutoRefresh 
                ? [
                    'inset 0 0.5px 0 rgba(255,255,255,0.08), 0 2px 8px rgba(0,0,0,0.06), 0 0 0 rgba(88, 227, 164, 0)',
                    'inset 0 0.5px 0 rgba(255,255,255,0.08), 0 2px 8px rgba(0,0,0,0.06), 0 0 16px rgba(88, 227, 164, 0.3)',
                    'inset 0 0.5px 0 rgba(255,255,255,0.08), 0 2px 8px rgba(0,0,0,0.06), 0 0 0 rgba(88, 227, 164, 0)'
                  ]
                : 'inset 0 0.5px 0 rgba(255,255,255,0.08), 0 2px 8px rgba(0,0,0,0.06)'
            }} 
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className={`w-2 h-2 rounded-full ${isAutoRefresh ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
            <span>{isAutoRefresh ? 'LIVE' : 'PAUSED'}</span>
          </motion.button>
        </div>

        <div
          ref={tabListRef}
          role="tablist"
          onKeyDown={handleTabKeyDown}
          className="mt-6 flex flex-wrap gap-2 p-2 rounded-2xl backdrop-blur-sm border"
          style={{
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.028) 0%, rgba(255, 255, 255, 0.018) 100%)',
            borderColor: 'rgba(255,255,255,0.08)',
            boxShadow: 'inset 0 0.5px 0 rgba(255,255,255,0.06), 0 2px 8px rgba(0,0,0,0.06)'
          }}
        >
          {regions.map(region => (
            <RegionButton
              key={region}
              region={region}
              isActive={activeRegion === region}
              onClick={() => setActiveRegion(region)}
            />
          ))}
        </div>

        {/* Combined Sentiment Row */}
        <CombinedSentimentRow activeRegion={activeRegion} regionalSummaries={regionalSummaries} />

        <HighlightsDrawer isOpen={showHighlights} onToggle={() => setShowHighlights(!showHighlights)} />
      </div>

      <motion.div
        key={activeRegion}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        role="tabpanel"
        id={`${activeRegion.toLowerCase()}-panel`}
        aria-labelledby={`${activeRegion}-tab`} // This would link to the RegionButton if it had an ID.
      >
        <AnimatePresence>
          {currentData.map((instrument, index) => (
            <GlobalMarketCard key={`${activeRegion}-${instrument.symbol}`} instrument={instrument} index={index} region={activeRegion} />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default React.memo(GlobalMarketSnapshot);