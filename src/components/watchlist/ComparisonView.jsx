import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, TrendingDown, BarChart3, ArrowUpRight, ArrowDownRight, Calendar, DollarSign, Activity, Volume2, Zap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine, Area, AreaChart } from 'recharts';

// Mock comparison data generator
const generateComparisonData = (stock1, stock2) => {
  const dates = [];
  const today = new Date();
  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date);
  }

  return {
    chartData: dates.map((date, index) => {
      const volatility1 = 0.02;
      const volatility2 = 0.025;
      const trend1 = Math.sin(index * 0.1) * 0.01;
      const trend2 = Math.cos(index * 0.1) * 0.015;
      
      return {
        date: date.toISOString().split('T')[0],
        dateFormatted: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        [stock1.symbol]: 100 + (Math.random() - 0.5) * volatility1 * 100 + trend1 * 100 + index * 0.5,
        [stock2.symbol]: 100 + (Math.random() - 0.5) * volatility2 * 100 + trend2 * 100 + index * 0.3,
      };
    }),
    analytics: {
      correlation: (Math.random() * 0.8 + 0.1).toFixed(3),
      volatility: {
        [stock1.symbol]: (Math.random() * 0.3 + 0.1).toFixed(2),
        [stock2.symbol]: (Math.random() * 0.3 + 0.1).toFixed(2),
      },
      beta: {
        [stock1.symbol]: (Math.random() * 2 + 0.5).toFixed(2),
        [stock2.symbol]: (Math.random() * 2 + 0.5).toFixed(2),
      },
      performance: {
        [stock1.symbol]: {
          period1d: (Math.random() * 6 - 3).toFixed(2),
          period7d: (Math.random() * 15 - 7.5).toFixed(2),
          period30d: (Math.random() * 30 - 15).toFixed(2),
          ytd: (Math.random() * 60 - 30).toFixed(2),
        },
        [stock2.symbol]: {
          period1d: (Math.random() * 6 - 3).toFixed(2),
          period7d: (Math.random() * 15 - 7.5).toFixed(2),
          period30d: (Math.random() * 30 - 15).toFixed(2),
          ytd: (Math.random() * 60 - 30).toFixed(2),
        }
      }
    }
  };
};

const PerformanceCard = ({ title, stock1, stock2, value1, value2, theme }) => {
  const isStock1Better = parseFloat(value1) > parseFloat(value2);
  
  return (
    <motion.div 
      className={`
        relative overflow-hidden rounded-2xl p-5 backdrop-blur-xl transition-all duration-500 hover:scale-[1.02]
        ${theme === 'dark' 
          ? 'bg-gradient-to-br from-[#1A1D29]/80 to-[#12141C]/80 border border-white/10 hover:border-white/20' 
          : 'bg-gradient-to-br from-white/90 to-white/80 border border-black/[0.08] hover:border-black/[0.15]'
        }
        shadow-xl hover:shadow-2xl group
      `}
      whileHover={{ y: -2 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* Subtle hover glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <h4 className={`text-sm font-bold mb-4 flex items-center space-x-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
          <span>{title}</span>
        </h4>
        
        <div className="space-y-3">
          <motion.div 
            className={`flex items-center justify-between p-3 rounded-xl transition-all duration-300 ${
              isStock1Better 
                ? 'bg-gradient-to-r from-green-500/15 to-emerald-500/15 border border-green-500/30 shadow-green-500/10 shadow-lg' 
                : 'bg-white/[0.05] border border-white/[0.08]'
            }`}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <span className={`font-black text-lg tracking-[-0.01em] ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {stock1.symbol}
            </span>
            <span className={`font-bold text-lg ${
              parseFloat(value1) > 0 ? 'text-green-400' : parseFloat(value1) < 0 ? 'text-red-400' : 'text-gray-400'
            }`}>
              {parseFloat(value1) > 0 ? '+' : ''}{value1}%
            </span>
          </motion.div>
          
          <motion.div 
            className={`flex items-center justify-between p-3 rounded-xl transition-all duration-300 ${
              !isStock1Better 
                ? 'bg-gradient-to-r from-green-500/15 to-emerald-500/15 border border-green-500/30 shadow-green-500/10 shadow-lg' 
                : 'bg-white/[0.05] border border-white/[0.08]'
            }`}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <span className={`font-black text-lg tracking-[-0.01em] ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {stock2.symbol}
            </span>
            <span className={`font-bold text-lg ${
              parseFloat(value2) > 0 ? 'text-green-400' : parseFloat(value2) < 0 ? 'text-red-400' : 'text-gray-400'
            }`}>
              {parseFloat(value2) > 0 ? '+' : ''}{value2}%
            </span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const CustomTooltip = ({ active, payload, label, theme }) => {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <motion.div 
      className={`
        p-4 rounded-2xl border backdrop-blur-2xl shadow-2xl
        ${theme === 'dark' 
          ? 'bg-[#1A1D29]/95 border-white/20 text-white' 
          : 'bg-white/95 border-black/10 text-gray-900'
        }
      `}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <p className="text-sm font-bold mb-3 text-blue-400">{label}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center justify-between space-x-6 mb-2 last:mb-0">
          <div className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm font-semibold">{entry.dataKey}</span>
          </div>
          <span className="text-sm font-black">
            {entry.value?.toFixed(2)}%
          </span>
        </div>
      ))}
    </motion.div>
  );
};

export default function ComparisonView({ stocks, theme, onClose }) {
  const [comparisonData, setComparisonData] = useState(null);
  const [timeframe, setTimeframe] = useState('30d');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  const [stock1, stock2] = stocks;

  useEffect(() => {
    // Simulate loading
    setIsLoading(true);
    const timer = setTimeout(() => {
      setComparisonData(generateComparisonData(stock1, stock2));
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [stock1, stock2]);

  const periodButtons = [
    { key: '1d', label: '1D' },
    { key: '7d', label: '7D' },
    { key: '30d', label: '30D' },
    { key: 'ytd', label: 'YTD' }
  ];

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`
          relative overflow-hidden rounded-3xl p-8 md:p-12 min-h-[600px] flex items-center justify-center
          ${theme === 'dark' 
            ? 'bg-gradient-to-br from-[#1A1D29]/90 to-[#12141C]/90 border border-white/10' 
            : 'bg-gradient-to-br from-white/90 to-white/70 border border-black/[0.08]'
          }
          backdrop-blur-2xl shadow-2xl
        `}
      >
        <div className="text-center space-y-6">
          <motion.div 
            className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-blue-500/30"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <BarChart3 className="w-8 h-8 text-blue-400" />
          </motion.div>
          <div className="space-y-3">
            <motion.h3 
              className={`text-2xl font-black tracking-[-0.02em] ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Generating Comparison
            </motion.h3>
            <p className={`text-base ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Analyzing {stock1.symbol} vs {stock2.symbol} with advanced metrics...
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        relative overflow-hidden rounded-3xl
        ${theme === 'dark' 
          ? 'bg-gradient-to-br from-[#1A1D29]/90 to-[#12141C]/90 border border-white/10' 
          : 'bg-gradient-to-br from-white/90 to-white/70 border border-black/[0.08]'
        }
        backdrop-blur-2xl shadow-2xl
      `}
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-full animate-pulse" />
      </div>

      {/* Header */}
      <div className="relative z-10 p-6 md:p-8 border-b border-white/[0.08]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.div 
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-blue-500/30"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <BarChart3 className="w-6 h-6 text-blue-400" strokeWidth={2} />
            </motion.div>
            <div>
              <motion.h2 
                className={`text-2xl md:text-3xl font-black tracking-[-0.02em] ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Stock Comparison
              </motion.h2>
              <motion.p 
                className={`text-base ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <span className="font-bold text-blue-400">{stock1.symbol}</span> vs <span className="font-bold text-green-400">{stock2.symbol}</span> • Last 30 Days
              </motion.p>
            </div>
          </div>
          <motion.button
            onClick={onClose}
            className={`
              p-3 rounded-xl transition-all duration-200 hover:scale-105
              ${theme === 'dark' 
                ? 'hover:bg-white/10 text-gray-400 hover:text-white' 
                : 'hover:bg-black/5 text-gray-500 hover:text-gray-700'
              }
              backdrop-blur-sm
            `}
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <X className="w-6 h-6" />
          </motion.button>
        </div>
      </div>

      {/* Chart Section */}
      <div className="relative z-10 p-6 md:p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-xl font-black tracking-[-0.01em] ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Relative Performance
            </h3>
            <div className="flex items-center space-x-2">
              {periodButtons.map((period) => (
                <motion.button
                  key={period.key}
                  onClick={() => setSelectedPeriod(period.key)}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300
                    ${selectedPeriod === period.key
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                      : theme === 'dark'
                        ? 'bg-white/[0.08] hover:bg-white/[0.12] text-gray-300 hover:text-white'
                        : 'bg-black/[0.04] hover:bg-black/[0.08] text-gray-600 hover:text-gray-900'
                    }
                  `}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  {period.label}
                </motion.button>
              ))}
            </div>
          </div>
          
          <motion.div 
            className="h-80 w-full rounded-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={comparisonData.chartData}>
                <defs>
                  <linearGradient id="colorStock1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorStock2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="dateFormatted" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: theme === 'dark' ? '#9CA3AF' : '#6B7280', fontWeight: 600 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: theme === 'dark' ? '#9CA3AF' : '#6B7280', fontWeight: 600 }}
                  domain={['dataMin - 2', 'dataMax + 2']}
                />
                <Tooltip content={<CustomTooltip theme={theme} />} />
                <ReferenceLine y={100} stroke={theme === 'dark' ? '#374151' : '#D1D5DB'} strokeDasharray="5 5" strokeWidth={1} />
                <Area
                  type="monotone"
                  dataKey={stock1.symbol}
                  stroke="#3B82F6"
                  fillOpacity={1}
                  fill="url(#colorStock1)"
                  strokeWidth={3}
                />
                <Area
                  type="monotone"
                  dataKey={stock2.symbol}
                  stroke="#10B981"
                  fillOpacity={1}
                  fill="url(#colorStock2)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Performance Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <PerformanceCard
            title="1 Day"
            stock1={stock1}
            stock2={stock2}
            value1={comparisonData.analytics.performance[stock1.symbol].period1d}
            value2={comparisonData.analytics.performance[stock2.symbol].period1d}
            theme={theme}
          />
          <PerformanceCard
            title="7 Days"
            stock1={stock1}
            stock2={stock2}
            value1={comparisonData.analytics.performance[stock1.symbol].period7d}
            value2={comparisonData.analytics.performance[stock2.symbol].period7d}
            theme={theme}
          />
          <PerformanceCard
            title="30 Days"
            stock1={stock1}
            stock2={stock2}
            value1={comparisonData.analytics.performance[stock1.symbol].period30d}
            value2={comparisonData.analytics.performance[stock2.symbol].period30d}
            theme={theme}
          />
          <PerformanceCard
            title="YTD"
            stock1={stock1}
            stock2={stock2}
            value1={comparisonData.analytics.performance[stock1.symbol].ytd}
            value2={comparisonData.analytics.performance[stock2.symbol].ytd}
            theme={theme}
          />
        </div>

        {/* Analytics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            className={`
              relative overflow-hidden p-6 rounded-2xl text-center backdrop-blur-xl
              ${theme === 'dark' 
                ? 'bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/30' 
                : 'bg-gradient-to-br from-purple-100 to-indigo-100 border border-purple-200'
              }
              shadow-xl hover:shadow-2xl transition-all duration-500
            `}
            whileHover={{ scale: 1.02, y: -2 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="relative z-10">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Activity className={`w-10 h-10 mx-auto mb-4 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} strokeWidth={2} />
              </motion.div>
              <h4 className={`font-black text-lg mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Correlation
              </h4>
              <p className={`text-3xl font-black tracking-[-0.02em] ${theme === 'dark' ? 'text-purple-300' : 'text-purple-700'}`}>
                {comparisonData.analytics.correlation}
              </p>
              <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-purple-200' : 'text-purple-600'}`}>
                Price Movement Sync
              </p>
            </div>
          </motion.div>

          <motion.div 
            className={`
              relative overflow-hidden p-6 rounded-2xl text-center backdrop-blur-xl
              ${theme === 'dark' 
                ? 'bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30' 
                : 'bg-gradient-to-br from-orange-100 to-red-100 border border-orange-200'
              }
              shadow-xl hover:shadow-2xl transition-all duration-500
            `}
            whileHover={{ scale: 1.02, y: -2 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="relative z-10">
              <Volume2 className={`w-10 h-10 mx-auto mb-4 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`} strokeWidth={2} />
              <h4 className={`font-black text-lg mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Volatility
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-bold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    {stock1.symbol}
                  </span>
                  <span className={`text-lg font-black ${theme === 'dark' ? 'text-orange-300' : 'text-orange-700'}`}>
                    {comparisonData.analytics.volatility[stock1.symbol]}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-bold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    {stock2.symbol}
                  </span>
                  <span className={`text-lg font-black ${theme === 'dark' ? 'text-orange-300' : 'text-orange-700'}`}>
                    {comparisonData.analytics.volatility[stock2.symbol]}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className={`
              relative overflow-hidden p-6 rounded-2xl text-center backdrop-blur-xl
              ${theme === 'dark' 
                ? 'bg-gradient-to-br from-green-500/20 to-teal-500/20 border border-green-500/30' 
                : 'bg-gradient-to-br from-green-100 to-teal-100 border border-green-200'
              }
              shadow-xl hover:shadow-2xl transition-all duration-500
            `}
            whileHover={{ scale: 1.02, y: -2 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="relative z-10">
              <TrendingUp className={`w-10 h-10 mx-auto mb-4 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} strokeWidth={2} />
              <h4 className={`font-black text-lg mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Beta
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-bold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    {stock1.symbol}
                  </span>
                  <span className={`text-lg font-black ${theme === 'dark' ? 'text-green-300' : 'text-green-700'}`}>
                    {comparisonData.analytics.beta[stock1.symbol]}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-bold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    {stock2.symbol}
                  </span>
                  <span className={`text-lg font-black ${theme === 'dark' ? 'text-green-300' : 'text-green-700'}`}>
                    {comparisonData.analytics.beta[stock2.symbol]}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}