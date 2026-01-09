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

// OS Horizon V4 Mini Sparkline — Refined Precision
const MiniSparkline = ({ data, currentValue }) => {
  if (!data || data.length < 2) return null;

  const width = 140;
  const height = 72;
  const padding = 12;

  const minValue = Math.min(...data);
  const maxValue = Math.max(...data);
  const range = maxValue - minValue || 1;

  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((value - minValue) / range) * (height - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  const pathD = `M${points.split(' ').map(point => point).join(' L')}`;
  const areaD = `${pathD} L${width - padding},${height - padding} L${padding},${height - padding} Z`;

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
    >
      <svg width={width} height={height} className="overflow-visible">
        <defs>
          <linearGradient id="pulseSparkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#58E3A4" stopOpacity="0.88" />
            <stop offset="100%" stopColor="#73E6D2" stopOpacity="0.92" />
          </linearGradient>
          <linearGradient id="pulseAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#58E3A4" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#58E3A4" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Area fill */}
        <motion.path
          d={areaD}
          fill="url(#pulseAreaGradient)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
        />

        {/* Main line */}
        <motion.path
          d={pathD}
          fill="none"
          stroke="url(#pulseSparkGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 0.61, 0.36, 1], delay: 0.5 }}
        />

        {/* End point nucleus */}
        <motion.circle
          cx={padding + ((data.length - 1) / (data.length - 1)) * (width - padding * 2)}
          cy={height - padding - ((currentValue - minValue) / range) * (height - padding * 2)}
          r="4"
          fill="#58E3A4"
          stroke="rgba(255,255,255,0.28)"
          strokeWidth="1.5"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 1.4, ease: [0.22, 0.61, 0.36, 1] }}
          style={{
            filter: 'drop-shadow(0 0 8px rgba(88, 227, 164, 0.55))'
          }}
        />

        {/* Pulsing halo */}
        <motion.circle
          cx={padding + ((data.length - 1) / (data.length - 1)) * (width - padding * 2)}
          cy={height - padding - ((currentValue - minValue) / range) * (height - padding * 2)}
          r="4"
          fill="none"
          stroke="#58E3A4"
          strokeWidth="1"
          initial={{ scale: 1, opacity: 0.7 }}
          animate={{ 
            scale: [1, 1.8, 1],
            opacity: [0.7, 0, 0.7]
          }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>

      {/* Refined label */}
      <motion.div
        className="absolute -bottom-6 right-0 text-[11px] font-semibold tracking-wide uppercase"
        style={{ color: 'rgba(88, 227, 164, 0.52)', letterSpacing: '0.04em' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.4 }}
      >
        7-Day Trend
      </motion.div>
    </motion.div>
  );
};


// OS Horizon V4 Mini Sparkline — Refined Precision
const MiniSparkline = ({ data, currentValue }) => {
  if (!data || data.length < 2) return null;

  const width = 140;
  const height = 72;
  const padding = 12;

  const minValue = Math.min(...data);
  const maxValue = Math.max(...data);
  const range = maxValue - minValue || 1;

  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((value - minValue) / range) * (height - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  const pathD = `M${points.split(' ').map(point => point).join(' L')}`;
  const areaD = `${pathD} L${width - padding},${height - padding} L${padding},${height - padding} Z`;

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
    >
      <svg width={width} height={height} className="overflow-visible">
        <defs>
          <linearGradient id="pulseSparkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#58E3A4" stopOpacity="0.88" />
            <stop offset="100%" stopColor="#73E6D2" stopOpacity="0.92" />
          </linearGradient>
          <linearGradient id="pulseAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#58E3A4" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#58E3A4" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Area fill */}
        <motion.path
          d={areaD}
          fill="url(#pulseAreaGradient)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
        />

        {/* Main line */}
        <motion.path
          d={pathD}
          fill="none"
          stroke="url(#pulseSparkGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 0.61, 0.36, 1], delay: 0.5 }}
        />

        {/* End point nucleus */}
        <motion.circle
          cx={padding + ((data.length - 1) / (data.length - 1)) * (width - padding * 2)}
          cy={height - padding - ((currentValue - minValue) / range) * (height - padding * 2)}
          r="4"
          fill="#58E3A4"
          stroke="rgba(255,255,255,0.28)"
          strokeWidth="1.5"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 1.4, ease: [0.22, 0.61, 0.36, 1] }}
          style={{
            filter: 'drop-shadow(0 0 8px rgba(88, 227, 164, 0.55))'
          }}
        />

        {/* Pulsing halo */}
        <motion.circle
          cx={padding + ((data.length - 1) / (data.length - 1)) * (width - padding * 2)}
          cy={height - padding - ((currentValue - minValue) / range) * (height - padding * 2)}
          r="4"
          fill="none"
          stroke="#58E3A4"
          strokeWidth="1"
          initial={{ scale: 1, opacity: 0.7 }}
          animate={{ 
            scale: [1, 1.8, 1],
            opacity: [0.7, 0, 0.7]
          }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>

      {/* Refined label */}
      <motion.div
        className="absolute -bottom-6 right-0 text-[11px] font-semibold tracking-wide uppercase"
        style={{ color: 'rgba(88, 227, 164, 0.52)', letterSpacing: '0.04em' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.4 }}
      >
        7-Day Trend
      </motion.div>
    </motion.div>
  );
};

// OS Horizon V4 Luxury Metric Card — Liquid Glass Refinement
const LuxuryMetricCard = ({ item, index, isEnabled, openMiniSheet }) => {
  const [priceKey, setPriceKey] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setPriceKey(prev => prev + 1);
  }, [item.price]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: 0.1 + index * 0.06,
        ease: [0.22, 0.61, 0.36, 1]
      }}
      whileHover={{
        scale: 1.02,
        y: -4,
        transition: { type: "spring", stiffness: 300, damping: 28 }
      }}
      whileTap={{ scale: 0.98, transition: { duration: 0.10 } }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={(e) => {
        if (isEnabled('labs_modules')) {
          e.stopPropagation();
          openMiniSheet({ symbol: item.symbol }, { top: e.clientY, left: e.clientX });
        }
      }}
      className="group relative overflow-hidden rounded-[24px] cursor-pointer"
      style={{
        padding: '24px',
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.045) 0%, rgba(255, 255, 255, 0.028) 100%)',
        backdropFilter: 'blur(32px) saturate(165%)',
        WebkitBackdropFilter: 'blur(32px) saturate(165%)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 16px rgba(0,0,0,0.08)'
      }}
    >
      {/* Top specular */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '16%',
        right: '16%',
        height: '1.5px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)',
        pointerEvents: 'none'
      }} />

      {/* Ambient bloom */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          background: item.positive 
            ? 'radial-gradient(ellipse at 50% 30%, rgba(88, 227, 164, 0.05) 0%, transparent 70%)'
            : 'radial-gradient(ellipse at 50% 30%, rgba(255, 106, 122, 0.05) 0%, transparent 70%)',
          borderRadius: '24px',
          pointerEvents: 'none',
          opacity: isHovered ? 1 : 0.6
        }}
        transition={{ duration: 0.3 }}
      />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center justify-between mb-5">
          <motion.div
            className="text-[11px] font-bold tracking-[0.08em] uppercase"
            style={{ 
              color: 'rgba(255,255,255,0.58)',
              letterSpacing: '0.06em'
            }}
            animate={{ letterSpacing: isHovered ? '0.10em' : '0.08em' }}
            transition={{ duration: 0.18 }}
          >
            {item.symbol}
          </motion.div>

          {/* Status pip */}
          <div className="relative">
            <motion.div
              className="w-2.5 h-2.5 rounded-full"
              style={{
                background: item.positive ? '#58E3A4' : '#FF6A7A',
                boxShadow: item.positive 
                  ? '0 0 8px rgba(88, 227, 164, 0.55)' 
                  : '0 0 8px rgba(255, 106, 122, 0.55)'
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.75, 1]
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute inset-0 w-2.5 h-2.5 rounded-full"
              style={{ background: item.positive ? '#58E3A4' : '#FF6A7A' }}
              animate={{ 
                scale: [1, 1.8, 1],
                opacity: [0.6, 0, 0.6]
              }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* Price */}
        <motion.div
          key={priceKey}
          initial={{ opacity: 0, scale: 0.92, y: 6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
          className="text-3xl font-bold tracking-[-0.02em] mb-4"
          style={{
            color: 'rgba(255,255,255,0.96)',
            fontVariantNumeric: 'tabular-nums'
          }}
        >
          {item.price}
        </motion.div>

        {/* Change pill */}
        <motion.div
          className="inline-flex items-center gap-2 rounded-[16px]"
          style={{
            padding: '8px 14px',
            background: item.positive 
              ? 'linear-gradient(180deg, rgba(88, 227, 164, 0.12) 0%, rgba(88, 227, 164, 0.08) 100%)'
              : 'linear-gradient(180deg, rgba(255, 106, 122, 0.12) 0%, rgba(255, 106, 122, 0.08) 100%)',
            border: item.positive ? '1px solid rgba(88, 227, 164, 0.20)' : '1px solid rgba(255, 106, 122, 0.20)',
            backdropFilter: 'blur(12px)',
            boxShadow: item.positive 
              ? 'inset 0 0.5px 0 rgba(88, 227, 164, 0.12)'
              : 'inset 0 0.5px 0 rgba(255, 106, 122, 0.12)'
          }}
          whileHover={{ scale: 1.04, transition: { duration: 0.16 } }}
          animate={{
            boxShadow: item.positive
              ? [
                  'inset 0 0.5px 0 rgba(88, 227, 164, 0.12), 0 0 14px rgba(88, 227, 164, 0.22)',
                  'inset 0 0.5px 0 rgba(88, 227, 164, 0.12), 0 0 20px rgba(88, 227, 164, 0.30)',
                  'inset 0 0.5px 0 rgba(88, 227, 164, 0.12), 0 0 14px rgba(88, 227, 164, 0.22)'
                ]
              : [
                  'inset 0 0.5px 0 rgba(255, 106, 122, 0.12), 0 0 14px rgba(255, 106, 122, 0.22)',
                  'inset 0 0.5px 0 rgba(255, 106, 122, 0.12), 0 0 20px rgba(255, 106, 122, 0.30)',
                  'inset 0 0.5px 0 rgba(255, 106, 122, 0.12), 0 0 14px rgba(255, 106, 122, 0.22)'
                ]
          }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        >
          {item.positive ? (
            <TrendingUp className="w-3.5 h-3.5" style={{ color: '#58E3A4' }} strokeWidth={2.2} />
          ) : (
            <TrendingDown className="w-3.5 h-3.5" style={{ color: '#FF6A7A' }} strokeWidth={2.2} />
          )}
          <span className="text-[13px] font-bold" style={{ 
            color: item.positive ? '#58E3A4' : '#FF6A7A',
            fontVariantNumeric: 'tabular-nums'
          }}>
            {item.change}
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
};

// OS Horizon V4 Watchlist Card — Precision Capsule Design
const NextGenWatchlistCard = ({ item, onClick, isHighMove }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isPositive = parseFloat(item.changePercent) >= 0;
  const isFlat = Math.abs(parseFloat(item.changePercent)) < 0.05;

  const WatchlistSparkline = ({ data, positive, flat }) => {
    const color = flat ? '#A8B3C7' : (positive ? '#58E3A4' : '#FF6A7A');
    const gradientId = `wl-spark-${item.symbol}`;

    if (!data || data.length < 2) return <div className="w-16 h-8" />;

    const width = 68;
    const height = 34;
    const padding = 2;

    const minValue = Math.min(...data);
    const maxValue = Math.max(...data);
    const range = maxValue - minValue || 1;

    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - padding - ((value - minValue) / range) * (height - padding * 2);
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    }).join(' ');

    const pathD = `M ${points}`;
    const areaD = `${pathD} L ${width},${height} L 0,${height} Z`;

    return (
      <svg width={width} height={height} className="overflow-visible">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.16} />
            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <motion.path
          d={areaD}
          fill={`url(#${gradientId})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0.9 : 0.6 }}
          transition={{ duration: 0.3 }}
        />
        <motion.path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.0, ease: [0.22, 0.61, 0.36, 1] }}
          style={{ opacity: isHovered ? 0.95 : 0.75 }}
        />
      </svg>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.08 * item.index, ease: [0.22, 0.61, 0.36, 1] }}
      whileHover={{ 
        y: -3, 
        scale: 1.012,
        transition: { type: 'spring', stiffness: 300, damping: 28 }
      }}
      whileTap={{ scale: 0.988, transition: { duration: 0.10 } }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onClick(item)}
      className="group relative flex-shrink-0 w-64 rounded-[22px] cursor-pointer overflow-hidden"
      style={{
        padding: '22px',
        minHeight: '156px',
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.042) 0%, rgba(255, 255, 255, 0.028) 100%)',
        backdropFilter: 'blur(32px) saturate(165%)',
        WebkitBackdropFilter: 'blur(32px) saturate(165%)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 16px rgba(0,0,0,0.08)'
      }}
      aria-label={`${item.symbol}, price ${item.price}, change ${item.changePercent}% today.`}
    >
      {/* Top specular */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '16%',
        right: '16%',
        height: '1.5px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)',
        pointerEvents: 'none'
      }} />

      {/* Status pip */}
      <div className="absolute top-5 right-5">
        <motion.div
          className="w-2 h-2 rounded-full"
          style={{
            background: isFlat ? '#A8B3C7' : (isPositive ? '#58E3A4' : '#FF6A7A'),
            boxShadow: isFlat 
              ? '0 0 7px rgba(168, 179, 199, 0.50)'
              : (isPositive ? '0 0 7px rgba(88, 227, 164, 0.55)' : '0 0 7px rgba(255, 106, 122, 0.55)')
          }}
          animate={{
            scale: [1, 1.18, 1],
            opacity: [1, 0.78, 1]
          }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute inset-0 w-2 h-2 rounded-full"
          style={{ background: isFlat ? '#A8B3C7' : (isPositive ? '#58E3A4' : '#FF6A7A') }}
          animate={{ 
            scale: [1, 1.7, 1],
            opacity: [0.55, 0, 0.55]
          }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Ambient bloom */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          background: isFlat 
            ? 'radial-gradient(ellipse at 50% 30%, rgba(168, 179, 199, 0.04) 0%, transparent 70%)'
            : (isPositive 
              ? 'radial-gradient(ellipse at 50% 30%, rgba(88, 227, 164, 0.06) 0%, transparent 70%)'
              : 'radial-gradient(ellipse at 50% 30%, rgba(255, 106, 122, 0.06) 0%, transparent 70%)'),
          borderRadius: '22px',
          pointerEvents: 'none',
          opacity: isHovered ? 1 : 0.5
        }}
        transition={{ duration: 0.3 }}
      />

      <div className="relative z-10 flex flex-col justify-between h-full">
        <div>
          <div className="text-2xl font-bold tracking-tight mb-1.5" style={{ 
            color: 'rgba(255,255,255,0.96)',
            letterSpacing: '-0.02em'
          }}>
            {item.symbol}
          </div>
          <div className="text-xl font-bold" style={{ 
            color: 'rgba(255,255,255,0.90)',
            fontVariantNumeric: 'tabular-nums'
          }}>
            ${parseFloat(item.price.replace('$', '')).toFixed(2)}
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div className={`flex items-center text-base ${isHighMove ? 'font-bold' : 'font-semibold'}`} style={{
            color: isFlat ? '#A8B3C7' : (isPositive ? '#58E3A4' : '#FF6A7A'),
            fontVariantNumeric: 'tabular-nums'
          }}>
            {isPositive && !isFlat && <TrendingUp className="w-4 h-4 mr-1.5" strokeWidth={2.2} />}
            {!isPositive && !isFlat && <TrendingDown className="w-4 h-4 mr-1.5" strokeWidth={2.2} />}
            {isFlat && <Activity className="w-4 h-4 mr-1.5" strokeWidth={2.2} />}
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
            {/* OS Horizon V4 Pulse Hero */}
            <motion.div
              className="relative overflow-hidden rounded-[28px]"
              style={{
                padding: '36px 40px',
                background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.042) 0%, rgba(255, 255, 255, 0.028) 100%)',
                backdropFilter: 'blur(32px) saturate(165%)',
                WebkitBackdropFilter: 'blur(32px) saturate(165%)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 8px 32px rgba(0,0,0,0.12)'
              }}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
            >
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

              {/* Subtle ambient bloom */}
              <motion.div
                style={{
                  position: 'absolute',
                  top: '10%',
                  right: '8%',
                  width: '280px',
                  height: '280px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(88, 227, 164, 0.08) 0%, transparent 70%)',
                  filter: 'blur(48px)',
                  pointerEvents: 'none'
                }}
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.4, 0.6, 0.4]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />

              <motion.div
                style={{
                  position: 'absolute',
                  bottom: '15%',
                  left: '5%',
                  width: '240px',
                  height: '240px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(77, 143, 251, 0.06) 0%, transparent 70%)',
                  filter: 'blur(52px)',
                  pointerEvents: 'none'
                }}
                animate={{
                  scale: [1.1, 1, 1.1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              />

              <div className="relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                  <div className="flex-1 space-y-7">
                    {/* OS Horizon Score Display */}
                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-6">
                      <div className="relative flex items-baseline">
                        <motion.div
                          key={Math.round(animatedScore)}
                          initial={{ opacity: 0, scale: 0.88 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
                          className="relative flex items-baseline"
                        >
                          <div className="text-7xl sm:text-8xl lg:text-9xl font-bold tracking-[-0.04em]" style={{
                            color: 'rgba(255,255,255,0.98)',
                            fontVariantNumeric: 'tabular-nums',
                            textShadow: '0 2px 12px rgba(0,0,0,0.15)'
                          }}>
                            {Math.round(animatedScore)}
                          </div>

                          <motion.div
                            className="flex items-center ml-3 -mt-6"
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
                          >
                            <span className="text-xl font-bold" style={{ 
                              color: trendIndicator.color.includes('green') ? '#58E3A4' : trendIndicator.color.includes('red') ? '#FF6A7A' : 'rgba(168, 179, 199, 1)',
                              fontVariantNumeric: 'tabular-nums'
                            }}>
                              ({trendIndicator.label} {trendIndicator.symbol})
                            </span>
                          </motion.div>
                        </motion.div>
                      </div>

                      {/* OS Horizon Sentiment Pill */}
                      <motion.div
                        key={pulseData.trend}
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
                        className="relative group"
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                      >
                        <div className="flex items-center gap-2.5 rounded-[18px]" style={{
                          padding: '10px 18px',
                          background: 'linear-gradient(180deg, rgba(88, 227, 164, 0.14) 0%, rgba(88, 227, 164, 0.10) 100%)',
                          backdropFilter: 'blur(12px)',
                          border: '1px solid rgba(88, 227, 164, 0.24)',
                          boxShadow: 'inset 0 0.5px 0 rgba(88, 227, 164, 0.12)'
                        }}>
                          <TrendingUp className="w-4 h-4" style={{ color: '#58E3A4' }} strokeWidth={2.2} />
                          <span className="text-[14px] font-bold tracking-tight" style={{ 
                            color: '#58E3A4',
                            letterSpacing: '0.01em'
                          }}>
                            {pulseData.trend}
                          </span>
                        </div>

                        <AnimatePresence>
                          {showTooltip && (
                            <motion.div
                              initial={{ opacity: 0, y: 6, scale: 0.94 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 6, scale: 0.94 }}
                              className="absolute top-full mt-3 left-1/2 -translate-x-1/2 z-50 rounded-[14px] pointer-events-none"
                              style={{
                                padding: '12px 14px',
                                background: 'linear-gradient(135deg, rgba(12, 16, 22, 0.94), rgba(18, 22, 30, 0.92))',
                                backdropFilter: 'blur(24px) saturate(165%)',
                                WebkitBackdropFilter: 'blur(24px) saturate(165%)',
                                border: '1px solid rgba(255, 255, 255, 0.12)',
                                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10), 0 8px 24px rgba(0,0,0,0.25)',
                                maxWidth: '320px'
                              }}
                              transition={{ duration: 0.16, ease: [0.22, 0.61, 0.36, 1] }}
                            >
                              <div className="text-[12px] font-medium text-center leading-relaxed" style={{ color: 'rgba(255,255,255,0.88)' }}>
                                {pulseData.sectorBreakdown}
                              </div>
                              <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 rotate-45" style={{
                                background: 'linear-gradient(135deg, rgba(12, 16, 22, 0.94), rgba(18, 22, 30, 0.92))',
                                borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
                                borderRight: '1px solid rgba(255, 255, 255, 0.12)'
                              }} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </div>

                    <motion.p
                      className="text-base leading-relaxed max-w-2xl"
                      style={{ 
                        color: 'rgba(255,255,255,0.78)',
                        fontWeight: 500,
                        letterSpacing: '-0.005em'
                      }}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
                    >
                      {pulseData.insight}
                    </motion.p>
                  </div>

                  {/* Mini Sparkline */}
                  <div className="relative mx-auto lg:mx-0 flex items-center justify-center">
                    <MiniSparkline data={pulseData.sparklineData} currentValue={pulseData.score} />
                  </div>
                </div>

                {/* OS Horizon Progress Bar */}
                <div className="relative" style={{ marginTop: '36px' }}>
                  <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <motion.div
                      className="h-full rounded-full relative overflow-hidden"
                      style={{
                        background: 'linear-gradient(90deg, #58E3A4 0%, #73E6D2 100%)',
                        boxShadow: 'inset 0 0.5px 0 rgba(255,255,255,0.20)'
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${animatedScore}%` }}
                      transition={{
                        duration: 1.0,
                        ease: [0.22, 0.61, 0.36, 1],
                        delay: 0.4
                      }}
                    >
                      <div className="absolute inset-0 rounded-full" style={{
                        background: 'linear-gradient(90deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.28) 100%)'
                      }} />

                      <motion.div
                        className="absolute top-0 right-0 w-16 h-full rounded-full"
                        style={{
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)'
                        }}
                        animate={{
                          x: ['-120%', '220%'],
                        }}
                        transition={{
                          duration: 3,
                          ease: "easeInOut",
                          repeat: Infinity,
                          repeatDelay: 6,
                        }}
                      />
                    </motion.div>
                  </div>

                  <motion.div
                    className="absolute -top-9 left-0 rounded-[12px]"
                    style={{
                      padding: '6px 10px',
                      background: 'linear-gradient(180deg, rgba(88, 227, 164, 0.12) 0%, rgba(88, 227, 164, 0.08) 100%)',
                      border: '1px solid rgba(88, 227, 164, 0.18)',
                      backdropFilter: 'blur(12px)'
                    }}
                    initial={{ opacity: 0, x: 0 }}
                    animate={{
                      opacity: 1,
                      x: `${(animatedScore / 100) * 100}%`
                    }}
                    transition={{
                      duration: 1.0,
                      ease: [0.22, 0.61, 0.36, 1],
                      delay: 0.6
                    }}
                  >
                    <span className="text-[11px] font-bold" style={{ 
                      color: '#58E3A4',
                      fontVariantNumeric: 'tabular-nums',
                      letterSpacing: '0.01em'
                    }}>
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
        {/* OS Horizon Page Header */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-5"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
        >
          <div className="space-y-2.5">
            <motion.h1
              className="text-3xl md:text-5xl font-bold tracking-[-0.03em]"
              style={{ 
                color: 'rgba(255,255,255,0.98)',
                letterSpacing: '-0.02em'
              }}
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 0.61, 0.36, 1] }}
            >
              Market Pulse
            </motion.h1>
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.18, ease: [0.22, 0.61, 0.36, 1] }}
            >
              <div className="flex items-center gap-2">
                <div className="relative">
                  <motion.div
                    className="w-2 h-2 rounded-full"
                    style={{ background: '#58E3A4' }}
                    animate={{
                      boxShadow: [
                        '0 0 6px rgba(88, 227, 164, 0.5)',
                        '0 0 14px rgba(88, 227, 164, 0.8)',
                        '0 0 6px rgba(88, 227, 164, 0.5)'
                      ]
                    }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.div
                    className="absolute inset-0 w-2 h-2 rounded-full"
                    style={{ background: '#58E3A4' }}
                    animate={{
                      scale: [1, 2, 1],
                      opacity: [0.7, 0, 0.7]
                    }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
                <span className="text-[13px] font-semibold" style={{ color: '#58E3A4' }}>Live</span>
              </div>
              <div style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.16)' }} />
              <span className="text-[13px] font-medium" style={{ color: 'rgba(255,255,255,0.56)' }}>Updated now</span>
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