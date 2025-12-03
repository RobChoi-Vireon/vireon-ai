import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity, ChevronRight, Calendar, DollarSign, Users, Target, X, Plus, GitCompare, Bell, BarChart3, Zap, Newspaper, ArrowDown, ArrowUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const mockMoversData = {
  gainers: [
    { ticker: 'NVDA', name: 'NVIDIA Corporation', price: 875.50, change: 29.45, changePercent: 3.48, volume: '62.8M', sparkline: [820, 835, 850, 860, 875], news: ['AI chip demand exceeds expectations', 'Partnership with Microsoft announced', 'Q4 guidance raised significantly'] },
    { ticker: 'AMD', name: 'Advanced Micro Devices', price: 175.60, change: 5.80, changePercent: 3.42, volume: '45.2M', sparkline: [168, 170, 172, 174, 175], news: ['New Ryzen processors unveiled', 'Data center revenue surges', 'AI accelerator roadmap revealed'] },
    { ticker: 'SMCI', name: 'Super Micro Computer Inc', price: 980.10, change: 32.50, changePercent: 3.43, volume: '28.1M', sparkline: [945, 955, 970, 975, 980], news: ['Server demand at all-time high', 'Expanded manufacturing capacity', 'AI infrastructure partnership'] },
    { ticker: 'PLTR', name: 'Palantir Technologies', price: 25.50, change: 0.85, changePercent: 3.45, volume: '91.3M', sparkline: [24.2, 24.8, 25.1, 25.3, 25.5], news: ['Government contract extension', 'Commercial revenue growth', 'AI platform expansion'] },
    { ticker: 'COIN', name: 'Coinbase Global Inc', price: 245.30, change: 8.20, changePercent: 3.46, volume: '19.7M', sparkline: [235, 240, 242, 244, 245], news: ['Crypto trading volume increases', 'Regulatory clarity improves', 'Institutional adoption grows'] }
  ],
  losers: [
    { ticker: 'TSLA', name: 'Tesla Inc', price: 248.75, change: -8.90, changePercent: -3.45, volume: '125.4M', sparkline: [265, 260, 255, 250, 249], news: ['Price cuts in China announced', 'Delivery numbers miss estimates', 'Competition intensifies'] },
    { ticker: 'NFLX', name: 'Netflix Inc', price: 485.20, change: -15.30, changePercent: -3.06, volume: '8.9M', sparkline: [510, 505, 495, 490, 485], news: ['Subscriber growth slows', 'Content costs rise', 'Password sharing crackdown'] },
    { ticker: 'PYPL', name: 'PayPal Holdings Inc', price: 62.15, change: -1.85, changePercent: -2.89, volume: '12.5M', sparkline: [66, 65, 64, 63, 62], news: ['Transaction volume declines', 'Fintech competition grows', 'Regulatory scrutiny increases'] },
    { ticker: 'ROKU', name: 'Roku Inc', price: 45.80, change: -1.25, changePercent: -2.66, volume: '15.2M', sparkline: [48, 47, 46.5, 46, 45.8], news: ['Advertising revenue drops', 'Streaming wars intensify', 'Cord-cutting pace slows'] },
    { ticker: 'ZOOM', name: 'Zoom Video Communications', price: 78.30, change: -2.05, changePercent: -2.55, volume: '6.8M', sparkline: [82, 81, 80, 79, 78.3], news: ['Remote work trends decline', 'Enterprise competition', 'Growth normalization'] }
  ],
  active: [
    { ticker: 'AAPL', name: 'Apple Inc', price: 189.25, change: 3.50, changePercent: 1.88, volume: '186.5M', sparkline: [185, 187, 188, 189, 189.2], news: ['iPhone sales exceed expectations', 'Services revenue grows', 'AI features announced'] },
    { ticker: 'TSLA', name: 'Tesla Inc', price: 248.75, change: -8.90, changePercent: -3.45, volume: '125.4M', sparkline: [265, 260, 255, 250, 249], news: ['Price cuts in China announced', 'Delivery numbers miss estimates', 'Competition intensifies'] },
    { ticker: 'PLTR', name: 'Palantir Technologies', price: 25.50, change: 0.85, changePercent: 3.45, volume: '91.3M', sparkline: [24.2, 24.8, 25.1, 25.3, 25.5], news: ['Government contract extension', 'Commercial revenue growth', 'AI platform expansion'] },
    { ticker: 'SPY', name: 'SPDR S&P 500 ETF Trust', price: 485.20, change: 4.15, changePercent: 0.86, volume: '88.9M', sparkline: [480, 482, 484, 485, 485.2], news: ['Market rally continues', 'Fed policy optimism', 'Economic data positive'] },
    { ticker: 'QQQ', name: 'Invesco QQQ Trust', price: 392.15, change: 4.85, changePercent: 1.25, volume: '75.3M', sparkline: [387, 389, 391, 392, 392.1], news: ['Tech sector momentum', 'AI investment surge', 'Growth stocks rebound'] }
  ]
};

const FuturisticSparkline = ({ data, positive }) => {
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 56;
    const y = 20 - ((value - Math.min(...data)) / (Math.max(...data) - Math.min(...data))) * 16;
    return `${x},${y}`;
  }).join(' ');

  const gradientId = `futuristic-gradient-${positive ? 'bull' : 'bear'}-${Math.random()}`;
  const glowId = `futuristic-glow-${positive ? 'bull' : 'bear'}-${Math.random()}`;

  return (
    <svg width="56" height="20" className="overflow-visible">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: positive ? '#10B981' : '#EF4444', stopOpacity: 0.8 }} />
          <stop offset="100%" style={{ stopColor: positive ? '#059669' : '#DC2626', stopOpacity: 0.2 }} />
        </linearGradient>
        <filter id={glowId}>
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Gradient fill area */}
      <motion.polygon
        fill={`url(#${gradientId})`}
        points={`${points} 56,20 0,20`}
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ opacity: 1, scaleY: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />

      {/* Main line with glow */}
      <motion.polyline
        fill="none"
        stroke={positive ? '#10B981' : '#EF4444'}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        filter={`url(#${glowId})`}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
      />

      {/* Endpoint dot */}
      <motion.circle
        cx={points.split(' ').slice(-1)[0].split(',')[0]}
        cy={points.split(' ').slice(-1)[0].split(',')[1]}
        r="3"
        fill={positive ? '#10B981' : '#EF4444'}
        stroke="rgba(255,255,255,0.8)"
        strokeWidth="1"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 1.2, type: "spring", stiffness: 400 }}
      >
        <animate 
          attributeName="r" 
          values="3;4;3" 
          dur="2s" 
          repeatCount="indefinite" 
        />
      </motion.circle>
    </svg>
  );
};

const VolumeHeatStrip = ({ volume, maxVolume }) => {
  const percentage = (parseFloat(volume.replace('M', '')) / maxVolume) * 100;
  
  return (
    <div className="w-full h-1.5 rounded-full overflow-hidden bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm">
      <motion.div 
        className="h-full rounded-full bg-gradient-to-r from-cyan-500/80 to-blue-500/80"
        style={{ 
          boxShadow: '0 0 8px rgba(6, 182, 212, 0.4)',
        }}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
      />
    </div>
  );
};

const FuturisticMoverItem = ({ item, type, maxVolume, onItemClick, isActive }) => {
  const isPositive = item.change > 0;
  const isNegative = item.change < 0;
  
  const getChangeColor = () => {
    if (type === 'gainers') return 'text-emerald-400';
    if (type === 'losers') return 'text-red-400';
    return isPositive ? 'text-emerald-400' : isNegative ? 'text-red-400' : 'text-slate-400';
  };

  const getGlowColor = () => {
    if (type === 'gainers') return 'rgba(16, 185, 129, 0.3)';
    if (type === 'losers') return 'rgba(239, 68, 68, 0.3)';
    return isPositive ? 'rgba(16, 185, 129, 0.3)' : isNegative ? 'rgba(239, 68, 68, 0.3)' : 'rgba(100, 116, 139, 0.2)';
  };

  // OS Horizon Liquid Glass — Tahoe
  const GLASS_ITEM = {
    bg: 'rgba(50, 60, 78, 0.48)',
    blur: 'blur(40px) saturate(150%)',
    border: '1px solid rgba(255, 255, 255, 0.10)',
    innerGlow: 'inset 0 1px 0 rgba(255, 255, 255, 0.08)'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      role="button"
      tabIndex={0}
      aria-expanded={isActive}
      onClick={() => onItemClick(item)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onItemClick(item);
        }
      }}
      className={`
        group relative p-5 rounded-3xl cursor-pointer overflow-hidden
        transition-all duration-200 ease-out
        hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        body.reduce-motion:hover:scale-100
        ${isActive ? 'scale-[1.02]' : ''}
      `}
      style={{
        background: GLASS_ITEM.bg,
        backdropFilter: GLASS_ITEM.blur,
        WebkitBackdropFilter: GLASS_ITEM.blur,
        border: GLASS_ITEM.border,
        boxShadow: isActive 
          ? `${GLASS_ITEM.innerGlow}, 0 12px 40px -12px rgba(0,0,0,0.35)`
          : `${GLASS_ITEM.innerGlow}, 0 6px 24px -8px rgba(0,0,0,0.28)`
      }}
      whileHover={{
        boxShadow: `${GLASS_ITEM.innerGlow}, 0 16px 48px -12px rgba(0,0,0,0.40)`,
        transition: { duration: 0.15 }
      }}
    >
      {/* Top specular edge */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '10%',
        right: '10%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
        pointerEvents: 'none'
      }} />
      {/* Subtle animated background gradient */}
      <motion.div
        className="absolute inset-0 rounded-3xl opacity-30"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${getGlowColor()}, transparent 40%)`
        }}
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 0.1 }}
        transition={{ duration: 0.3 }}
      />

      <div className="relative z-10 flex items-center justify-between">
        <div className="flex-1 min-w-0 space-y-3">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              {/* Ticker - Bold and prominent */}
              <div 
                className="text-xl font-black tracking-[-0.01em] truncate text-white"
                style={{ 
                  textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                  letterSpacing: '-0.02em'
                }}
              >
                {item.ticker}
              </div>
              {/* Company name - Secondary */}
              <div className="text-sm font-medium truncate text-slate-400 mt-1">
                {item.name}
              </div>
            </div>
            <div className="text-right ml-4">
              {/* Price - Anchor element */}
              <motion.div 
                className="text-2xl font-black text-white"
                style={{ 
                  textShadow: '0 2px 12px rgba(255, 255, 255, 0.1)',
                  letterSpacing: '-0.01em'
                }}
                animate={{ opacity: [1, 0.8, 1] }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                key={item.price}
              >
                ${item.price.toFixed(2)}
              </motion.div>
              {/* % Change with high-tech glow */}
              <div 
                className={`text-base font-bold ${getChangeColor()}`}
                style={{ 
                  textShadow: `0 0 12px ${getGlowColor()}, 0 0 24px ${getGlowColor()}`,
                  filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))'
                }}
              >
                {isPositive ? '+' : ''}{item.change.toFixed(2)} ({isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%)
              </div>
            </div>
          </div>
          
          {/* Enhanced micro-chart and volume */}
          <div className="flex items-end justify-between mt-4">
            <FuturisticSparkline 
              data={item.sparkline} 
              positive={isPositive} 
            />
            {type === 'active' && (
              <div className="ml-4 flex-1 max-w-20" title={`Volume: ${item.volume}`}>
                <div className="text-xs font-medium text-slate-400 mb-1">
                  {item.volume}
                </div>
                <VolumeHeatStrip volume={item.volume} maxVolume={maxVolume} />
              </div>
            )}
          </div>
        </div>
        
        {/* Futuristic chevron with smooth glide */}
        <motion.div
          className="ml-4 opacity-60 group-hover:opacity-100"
          animate={{ x: 0 }}
          whileHover={{ x: 4 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
        >
          <ChevronRight 
            className="w-5 h-5 text-slate-400"
            style={{ filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

const QuickViewDrawer = ({ item, isOpen, onClose }) => {
  const [mobileTab, setMobileTab] = useState('metrics');
  const [showAllNews, setShowAllNews] = useState(false);

  const mockStats = {
    marketCap: '$2.1T',
    peRatio: '28.5',
    float: '15.7B',
    sharesOutstanding: '16.2B',
    nextEarnings: '2024-01-25',
    dividendYield: '0.50%'
  };

  const mockContext = {
    marketCap: 'Largest in S&P Tech',
    peRatio: 'vs sector avg. 23.2',
    float: '96% of outstanding shares',
    sharesOutstanding: 'Stable share count YoY',
    nextEarnings: 'Q4 preview — high expectations',
    dividendYield: 'Quarterly payout maintained'
  };

  const enhancedNews = [
    { 
      headline: 'AI chip demand exceeds expectations', 
      tag: 'Earnings', 
      impact: 'Positive',
      time: '2h ago'
    },
    { 
      headline: 'Partnership with Microsoft announced', 
      tag: 'Partnership', 
      impact: 'High Impact',
      time: '4h ago'
    },
    { 
      headline: 'Q4 guidance raised significantly', 
      tag: 'Guidance', 
      impact: 'Positive',
      time: '1d ago'
    },
    {
      headline: 'New product line to target enterprise solutions',
      tag: 'Product',
      impact: 'Positive',
      time: '2d ago'
    },
    {
      headline: 'Analyst ratings updated to "Strong Buy"',
      tag: 'Analyst',
      impact: 'Positive',
      time: '3d ago'
    },
    {
      headline: 'Supply chain concerns easing for next quarter',
      tag: 'Supply Chain',
      impact: 'Neutral',
      time: '4d ago'
    }
  ];

  useEffect(() => {
    if (isOpen) {
      const handleEscape = (e) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!item) return null;

  const getImpactStyle = (impact) => {
    switch (impact) {
      case 'Positive': return 'bg-gradient-to-r from-emerald-500/20 to-green-500/20 border-emerald-500/30 text-emerald-300';
      case 'Negative': return 'bg-gradient-to-r from-red-500/20 to-rose-500/20 border-red-500/30 text-red-300';
      case 'High Impact': return 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border-blue-500/30 text-blue-300';
      default: return 'bg-gradient-to-r from-gray-500/20 to-slate-500/20 border-gray-500/30 text-gray-300';
    }
  };
  
  const MetricCard = ({ icon: Icon, iconColor, label, value, context, hoverEffect = true }) => (
    <motion.div 
      className="group relative p-4 rounded-xl border border-white/10" 
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}
      whileHover={hoverEffect ? { y: -3, scale: 1.03, boxShadow: '0 8px 30px rgba(0,0,0,0.2)' } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3 mb-2.5">
            <Icon className={`w-5 h-5 ${iconColor}`} />
            <span className="text-sm font-semibold text-gray-400">{label}</span>
          </div>
          <div className="text-xl font-bold text-white">{value}</div>
          {context && <div className="text-xs text-gray-500 mt-1">{context}</div>}
        </div>
        <ChevronRight className="w-5 h-5 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      </div>
    </motion.div>
  );

  const NewsItem = ({ newsItem, index }) => (
    <motion.div
      className="group relative p-3 rounded-xl border border-white/10 hover:bg-white/[.03] transition-colors duration-200"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 + index * 0.05 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-2 mb-2">
            <span className={`px-2 py-0.5 rounded-md text-xs font-semibold border ${getImpactStyle(newsItem.tag)}`}>{newsItem.tag}</span>
            <span className={`px-2 py-0.5 rounded-md text-xs font-semibold border ${getImpactStyle(newsItem.impact)}`}>{newsItem.impact}</span>
            <span className="text-xs text-gray-500 flex-shrink-0 ml-auto">{newsItem.time}</span>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">{newsItem.headline}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-3 flex-shrink-0" />
      </div>
    </motion.div>
  );

  const MobileTabButton = ({ tabId, label }) => (
    <button
      onClick={() => setMobileTab(tabId)}
      className={`relative flex-1 py-3 text-sm font-bold transition-colors duration-200 ${mobileTab === tabId ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
    >
      {label}
      {mobileTab === tabId && (
        <motion.div
          layoutId="mobileTabIndicator"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}
    </button>
  );

  return (
    <AnimatePresence>
      {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-end justify-center p-4 md:items-center"
        onClick={onClose}
        style={{ backgroundColor: 'var(--scrim)' }}
      >
        <motion.div
          initial={{ y: '100%', opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: '100%', opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', damping: 30, stiffness: 350, duration: 0.3 }}
          onClick={e => e.stopPropagation()}
          className="relative w-full max-w-lg md:max-w-5xl lg:max-w-7xl rounded-t-3xl md:rounded-3xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.85))',
            backdropFilter: 'blur(32px)',
            WebkitBackdropFilter: 'blur(32px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Header */}
          <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-white/10">
            <div>
              <motion.h3 
                className="text-2xl font-black tracking-[-0.01em] text-white"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                {item.ticker}
              </motion.h3>
              <motion.p 
                className="text-sm mt-1 text-gray-400 truncate"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {item.name}
              </motion.p>
            </div>
            <motion.button
              onClick={onClose}
              className="p-2 rounded-xl transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
              aria-label="Close quick view"
              whileHover={{ scale: 1.05, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
            </motion.button>
          </div>
          
          <div className="flex-grow overflow-y-auto">
            {/* Desktop & Tablet: Two-column layout */}
            <div className="hidden md:grid md:grid-cols-2 gap-x-12 p-8">
              {/* Left Column */}
              <div className="space-y-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <h4 className="text-xl font-bold text-white mb-4 flex items-center"><BarChart3 className="w-5 h-5 mr-3 text-gray-400"/>Valuation & Structure</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <MetricCard icon={DollarSign} iconColor="text-blue-400" label="Market Cap" value={mockStats.marketCap} context={mockContext.marketCap} />
                    <MetricCard icon={Target} iconColor="text-purple-400" label="P/E Ratio" value={mockStats.peRatio} context={mockContext.peRatio} />
                    <MetricCard icon={Users} iconColor="text-emerald-400" label="Float" value={mockStats.float} context={mockContext.float} />
                    <MetricCard icon={BarChart3} iconColor="text-orange-400" label="Shares Outstanding" value={mockStats.sharesOutstanding} context={mockContext.sharesOutstanding} />
                  </div>
                </motion.div>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <h4 className="text-xl font-bold text-white mb-4 flex items-center"><Calendar className="w-5 h-5 mr-3 text-gray-400"/>Events</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <MetricCard icon={Calendar} iconColor="text-pink-400" label="Next Earnings" value="Jan 25" context={mockContext.nextEarnings} />
                    <MetricCard icon={TrendingUp} iconColor="text-cyan-400" label="Dividend Yield" value={mockStats.dividendYield} context={mockContext.dividendYield} />
                  </div>
                </motion.div>
                
                <div className="border-t border-white/5" />

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                  <h4 className="text-xl font-bold text-white mb-4 flex items-center"><Newspaper className="w-5 h-5 mr-3 text-gray-400"/>Latest News</h4>
                  <motion.div layout className="space-y-3">
                    <AnimatePresence initial={false}>
                      {enhancedNews.slice(0, showAllNews ? enhancedNews.length : 3).map((newsItem, index) => (
                        <NewsItem key={index} newsItem={newsItem} index={index} />
                      ))}
                    </AnimatePresence>
                  </motion.div>
                  {enhancedNews.length > 3 && (
                    <motion.button 
                      layout
                      onClick={() => setShowAllNews(!showAllNews)}
                      className="w-full text-center mt-4 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors py-2 flex items-center justify-center space-x-2"
                    >
                      <AnimatePresence mode="wait">
                        <motion.span key={showAllNews ? 'collapse' : 'expand'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          {showAllNews ? 'Collapse' : 'See All News'}
                        </motion.span>
                      </AnimatePresence>
                      {showAllNews ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                    </motion.button>
                  )}
                </motion.div>
              </div>
            </div>

            {/* Mobile: Tabbed layout */}
            <div className="md:hidden p-6">
              {/* Tab Navigation */}
              <div className="flex border-b border-white/10 mb-6">
                <MobileTabButton tabId="metrics" label="Metrics" />
                <MobileTabButton tabId="events" label="Events" />
                <MobileTabButton tabId="news" label="News" />
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={mobileTab}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                >
                  {mobileTab === 'metrics' && (
                    <div className="grid grid-cols-2 gap-4">
                      <MetricCard icon={DollarSign} iconColor="text-blue-400" label="Market Cap" value={mockStats.marketCap} context={mockContext.marketCap} />
                      <MetricCard icon={Target} iconColor="text-purple-400" label="P/E Ratio" value={mockStats.peRatio} context={mockContext.peRatio} />
                      <MetricCard icon={Users} iconColor="text-emerald-400" label="Float" value={mockStats.float} context={mockContext.float} />
                      <MetricCard icon={BarChart3} iconColor="text-orange-400" label="Shares Outstanding" value={mockStats.sharesOutstanding} context={mockContext.sharesOutstanding} />
                    </div>
                  )}
                  {mobileTab === 'events' && (
                    <div className="grid grid-cols-2 gap-4">
                      <MetricCard icon={Calendar} iconColor="text-pink-400" label="Next Earnings" value="Jan 25" context={mockContext.nextEarnings} />
                      <MetricCard icon={TrendingUp} iconColor="text-cyan-400" label="Dividend Yield" value={mockStats.dividendYield} context={mockContext.dividendYield} />
                    </div>
                  )}
                  {mobileTab === 'news' && (
                     <div className="space-y-3">
                      {enhancedNews.map((newsItem, index) => <NewsItem key={index} newsItem={newsItem} index={index} />)}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          
          {/* Enhanced Actions */}
          <motion.div 
            className="flex-shrink-0 p-6 border-t border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="grid grid-cols-4 gap-3">
              <motion.button 
                className="flex items-center justify-center space-x-2 py-3 px-2 rounded-xl text-sm font-semibold border border-white/10 text-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500" 
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                whileHover={{ scale: 1.02, y: -1, boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)' }}
                whileTap={{ scale: 0.98 }}
                aria-label={`Set alert for ${item.ticker}`}
              >
                <Bell className="w-4 h-4" />
                <span>Alert</span>
              </motion.button>
              <motion.button 
                className="flex items-center justify-center space-x-2 py-3 px-2 rounded-xl text-sm font-semibold border border-white/10 text-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500" 
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                whileHover={{ scale: 1.02, y: -1, boxShadow: '0 4px 20px rgba(34, 197, 94, 0.3)' }}
                whileTap={{ scale: 0.98 }}
                aria-label={`Add ${item.ticker} to watchlist`}
              >
                <Plus className="w-4 h-4" />
                <span>Watch</span>
              </motion.button>
              <motion.button 
                className="flex items-center justify-center space-x-2 py-3 px-2 rounded-xl text-sm font-semibold border border-white/10 text-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500" 
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                whileHover={{ scale: 1.02, y: -1, boxShadow: '0 4px 20px rgba(168, 85, 247, 0.3)' }}
                whileTap={{ scale: 0.98 }}
                aria-label={`Compare ${item.ticker}`}
              >
                <GitCompare className="w-4 h-4" />
                <span>Compare</span>
              </motion.button>
              <motion.button 
                className="flex items-center justify-center space-x-2 py-3 px-2 rounded-xl text-sm font-semibold border border-white/10 text-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500" 
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                whileHover={{ scale: 1.02, y: -1, boxShadow: '0 4px 20px rgba(245, 101, 101, 0.3)' }}
                whileTap={{ scale: 0.98 }}
                aria-label={`Deep dive into sector analysis`}
              >
                <Zap className="w-4 h-4" />
                <span>Sector</span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
      )}
    </AnimatePresence>
  );
};

function MarketMovers() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showQuickView, setShowQuickView] = useState(false);
  const [keyboardIndex, setKeyboardIndex] = useState(-1);

  const timeframes = ['1D', '5D', '1M'];
  const maxVolume = Math.max(...mockMoversData.active.map(item => parseFloat(item.volume.replace('M', ''))));

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setShowQuickView(true);
  };

  const handleCloseQuickView = () => {
    setShowQuickView(false);
  };
  
  useEffect(() => {
    if (!showQuickView) {
      const timer = setTimeout(() => setSelectedItem(null), 250);
      return () => clearTimeout(timer);
    }
  }, [showQuickView]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showQuickView) return;
      
      const allItems = [...mockMoversData.gainers, ...mockMoversData.losers, ...mockMoversData.active];
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setKeyboardIndex(prev => Math.min(prev + 1, allItems.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setKeyboardIndex(prev => Math.max(prev - 1, -1));
      } else if (e.key === 'Enter' && keyboardIndex >= 0) {
        e.preventDefault();
        handleItemClick(allItems[keyboardIndex]);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showQuickView, keyboardIndex]);

  const MoverSection = ({ title, data, type, icon: Icon, maxVolume }) => (
    <div className="space-y-6">
      {/* Section header with futuristic styling */}
      <div className="flex items-center space-x-4 relative">
        <Icon 
          className="w-6 h-6" 
          style={{ 
            color: type === 'gainers' ? '#10B981' : 
                   type === 'losers' ? '#EF4444' : '#06B6D4',
            filter: `drop-shadow(0 0 8px ${type === 'gainers' ? 'rgba(16, 185, 129, 0.4)' : 
                                           type === 'losers' ? 'rgba(239, 68, 68, 0.4)' : 
                                           'rgba(6, 182, 212, 0.4)'})`
          }} 
        />
        <h3 
          className="text-2xl font-black tracking-[-0.02em] text-white"
          style={{ 
            textShadow: '0 2px 12px rgba(255, 255, 255, 0.1)' 
          }}
        >
          {title}
        </h3>
        {/* Subtle gradient underline */}
        <motion.div
          className="absolute -bottom-2 left-10 right-0 h-0.5 rounded-full"
          style={{
            background: type === 'gainers' ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.6) 0%, transparent 100%)' :
                       type === 'losers' ? 'linear-gradient(90deg, rgba(239, 68, 68, 0.6) 0%, transparent 100%)' :
                       'linear-gradient(90deg, rgba(6, 182, 212, 0.6) 0%, transparent 100%)'
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        />
      </div>
      
      <div className="space-y-4">
        <AnimatePresence>
          {data.slice(0, 5).map((item, index) => (
            <FuturisticMoverItem 
              key={item.ticker}
              item={item}
              type={type}
              maxVolume={maxVolume}
              onItemClick={handleItemClick}
              isActive={selectedItem?.ticker === item.ticker && showQuickView}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );

  return (
    <div 
      className="space-y-12 relative overflow-hidden"
      style={{
        background: 'rgba(45, 55, 72, 0.42)',
        backdropFilter: 'blur(40px) saturate(150%)',
        WebkitBackdropFilter: 'blur(40px) saturate(150%)',
        borderRadius: '2rem',
        padding: '2rem',
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), inset 0 0 40px rgba(255,255,255,0.02), 0 20px 60px -20px rgba(0,0,0,0.35)'
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
        borderRadius: '32px 32px 0 0'
      }} />
      {/* Futuristic timeframe toggle */}
      <div className="flex items-center justify-between">
        <div 
          className="flex items-center space-x-1 p-1.5 rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          {timeframes.map(timeframe => (
            <button
              key={timeframe}
              onClick={() => setSelectedTimeframe(timeframe)}
              className={`
                px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200
                min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                ${selectedTimeframe === timeframe ? 'text-white' : 'text-slate-400 hover:text-white'}
              `}
              style={{
                background: selectedTimeframe === timeframe 
                  ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(37, 99, 235, 0.4) 100%)'
                  : 'transparent',
                boxShadow: selectedTimeframe === timeframe 
                  ? '0 4px 16px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  : 'none'
              }}
            >
              {timeframe}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop: Three columns with gradient separators */}
      <div className="hidden lg:grid lg:grid-cols-3 lg:gap-12 relative">
        {/* Gradient separators between columns */}
        <div className="absolute left-1/3 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-slate-600/30 to-transparent" />
        <div className="absolute left-2/3 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-slate-600/30 to-transparent" />
        
        <MoverSection 
          title="Gainers" 
          data={mockMoversData.gainers} 
          type="gainers" 
          icon={TrendingUp}
          maxVolume={maxVolume}
        />
        <MoverSection 
          title="Losers" 
          data={mockMoversData.losers} 
          type="losers" 
          icon={TrendingDown}
          maxVolume={maxVolume}
        />
        <MoverSection 
          title="Most Active" 
          data={mockMoversData.active} 
          type="active" 
          icon={Activity}
          maxVolume={maxVolume}
        />
      </div>

      {/* Mobile: Stacked */}
      <div className="lg:hidden space-y-12">
        <MoverSection 
          title="Gainers" 
          data={mockMoversData.gainers} 
          type="gainers" 
          icon={TrendingUp}
          maxVolume={maxVolume}
        />
        <MoverSection 
          title="Losers" 
          data={mockMoversData.losers} 
          type="losers" 
          icon={TrendingDown}
          maxVolume={maxVolume}
        />
        <MoverSection 
          title="Most Active" 
          data={mockMoversData.active} 
          type="active" 
          icon={Activity}
          maxVolume={maxVolume}
        />
      </div>

      {/* Quick View Drawer */}
      <QuickViewDrawer
        item={selectedItem}
        isOpen={showQuickView}
        onClose={handleCloseQuickView}
      />
    </div>
  );
}

export default React.memo(MarketMovers);