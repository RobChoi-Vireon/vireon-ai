
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';

const benchmarkData = [
  { symbol: 'SPY', price: '$520.45', change: '+0.88%', changeValue: 0.88, context: "Mega-cap tech driving record inflows.", details: { high52w: '$525.75', avgVol: '75.2M', marketCap: '$518B' }, sparkline: [490, 495, 505, 510, 515, 520, 520], drivers: ['Mega-cap inflows +$2.8B this week.', '9 of 11 sectors positive on the day.'] },
  { symbol: 'QQQ', price: '$445.10', change: '+1.62%', changeValue: 1.62, context: "AI enthusiasm fueling Nasdaq momentum.", details: { high52w: '$449.39', avgVol: '48.1M', marketCap: '$245B' }, sparkline: [420, 425, 430, 438, 442, 440, 445], drivers: ['AI-related stocks contributing 70% of gains.', 'Record call option volume observed.'] },
  { symbol: 'VIX', price: '13.80', change: '-4.15%', changeValue: -4.15, context: "Volatility cooling as risk appetite improves.", details: { high52w: '$26.52', avgVol: 'N/A', marketCap: 'N/A' }, sparkline: [18, 17, 16.5, 15, 14.5, 14, 13.8], drivers: ['Implied volatility at 3-month lows.', 'VIX/VXV ratio indicates complacency.'] },
  { symbol: '10Y', price: '4.25%', change: '+0.03%', changeValue: 0.03, context: "Yields steady ahead of Fed minutes.", details: { high52w: '5.02%', avgVol: 'N/A', marketCap: 'N/A' }, sparkline: [4.4, 4.35, 4.3, 4.28, 4.22, 4.25, 4.25], drivers: ['Market pricing in 90% chance of no rate hike.', '2s10s curve remains inverted.'] },
  { symbol: 'DXY', price: '104.15', change: '-0.18%', changeValue: -0.18, context: "Dollar softens on global growth optimism.", details: { high52w: '107.35', avgVol: 'N/A', marketCap: 'N/A' }, sparkline: [105, 104.8, 104.5, 104.2, 104.4, 104.1, 104.15], drivers: ['EUR/USD strength weighs on the index.', 'Risk-on sentiment reduces safe-haven demand.'] },
  { symbol: 'BTC', price: '$68,500', change: '+2.75%', changeValue: 2.75, context: "Crypto rally fueled by institutional ETF flows.", details: { high52w: '$73,794', avgVol: '$45B', marketCap: '$1.3T' }, sparkline: [62000, 64000, 65000, 67000, 66000, 69000, 68500], drivers: ['$1.5B ETF inflows year-to-date.', 'Exchange balances continue to decline.'] },
];

const MiniSparkline = ({ data, positive }) => {
  const width = 140;
  const height = 40;
  const padding = 2;
  const strokeColor = positive ? '#22C55E' : '#EF4444';

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
  }, [data]);
  
  if (!points) return null;

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`sparkline-fill-${positive ? 'p' : 'n'}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity={0.25} />
          <stop offset="100%" stopColor={strokeColor} stopOpacity={0.05} />
        </linearGradient>
      </defs>
      <motion.path d={`M${points} L${width - padding},${height} L${padding},${height} Z`} fill={`url(#sparkline-fill-${positive ? 'p' : 'n'})`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} />
      <motion.path d={`M${points}`} fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: "easeInOut" }} />
    </svg>
  );
};

const BenchmarkCard = ({ item, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const positive = item.changeValue >= 0;

  const getMagnitudeStyling = (change) => {
    const absChange = Math.abs(change);
    if (absChange > 1.5) return { fontWeight: 800, textShadow: `0 0 12px ${positive ? 'rgba(34, 197, 94, 0.7)' : 'rgba(239, 68, 68, 0.7)'}` };
    if (absChange > 0.25) return { fontWeight: 700, textShadow: `0 0 8px ${positive ? 'rgba(34, 197, 94, 0.5)' : 'rgba(239, 68, 68, 0.5)'}` };
    return { fontWeight: 600, textShadow: `0 0 4px ${positive ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}` };
  };

  const magnitudeStyle = getMagnitudeStyling(item.changeValue);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.07, type: 'spring', stiffness: 100, damping: 20 }}
      whileHover={{ y: -5, scale: 1.05, boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative p-6 rounded-3xl cursor-pointer border border-white/10 overflow-hidden"
      style={{ background: 'linear-gradient(145deg, rgba(38, 43, 58, 0.9), rgba(22, 25, 35, 0.9))' }}
    >
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <span className="text-sm font-bold tracking-widest text-gray-400 uppercase">{item.symbol}</span>
        </div>
        
        <div className="flex-grow my-auto">
          <motion.div 
            key={item.price}
            initial={{ opacity: 0.5, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-4xl font-black text-white tracking-tighter"
          >
            {item.price}
          </motion.div>
          
          <motion.div 
            className="flex items-center space-x-2 text-lg mt-2"
            style={{ color: positive ? '#22C55E' : '#EF4444', fontWeight: magnitudeStyle.fontWeight, textShadow: magnitudeStyle.textShadow }}
          >
            {positive ? <TrendingUp size={20} strokeWidth={2.5}/> : <TrendingDown size={20} strokeWidth={2.5}/>}
            <span>{item.change}</span>
          </motion.div>
        </div>
        
        <div className="mt-auto pt-4">
          <p className="text-xs text-gray-400 leading-snug">{item.context}</p>
        </div>
      </div>
      
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute bottom-full mb-3 left-0 right-0 z-20 p-4 rounded-2xl border border-white/15 shadow-2xl"
            style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95))', backdropFilter: 'blur(20px)' }}
          >
            <div className="mb-3">
              <MiniSparkline data={item.sparkline} positive={positive} />
            </div>
            <div className="grid grid-cols-3 gap-3 text-center mb-4">
              <div>
                <div className="text-xs text-gray-400">52W High</div>
                <div className="text-sm font-semibold text-white">{item.details.high52w}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Avg Vol</div>
                <div className="text-sm font-semibold text-white">{item.details.avgVol}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Mkt Cap</div>
                <div className="text-sm font-semibold text-white">{item.details.marketCap}</div>
              </div>
            </div>
            {item.drivers && item.drivers.length > 0 && (
              <div className="border-t border-white/10 pt-3 space-y-2">
                {item.drivers.map((driver, i) => (
                  <div key={i} className="flex items-start space-x-2">
                    <ArrowUpRight className="w-3 h-3 mt-0.5 text-gray-500 flex-shrink-0" />
                    <p className="text-xs text-gray-300">{driver}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function KeyBenchmarks() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
      {benchmarkData.map((item, index) => (
        <BenchmarkCard key={item.symbol} item={item} index={index} />
      ))}
    </div>
  );
}
