
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Calendar, DollarSign, Users, Target, X, Plus, GitCompare, Bell, BarChart3, Zap, Newspaper, ArrowDown, ArrowUp, ChevronRight } from 'lucide-react';

const QuickViewDrawer = ({ item, isOpen, onClose }) => {
  const [mobileTab, setMobileTab] = useState('metrics');
  const [showAllNews, setShowAllNews] = useState(false);

  const mockStats = {
    marketCap: item?.marketCap || '$2.8T',
    peRatio: item?.peRatio || '32.5',
    float: item?.float || '15.7B',
    sharesOutstanding: item?.sharesOutstanding || '16.2B',
    nextEarnings: item?.nextEarnings || '2024-07-25',
    dividendYield: item?.dividendYield || '0.52%'
  };

  const mockContext = {
    marketCap: 'Largest in S&P Tech',
    peRatio: 'vs sector avg. 28.1',
    float: '96% of outstanding shares',
    sharesOutstanding: 'Stable share count YoY',
    nextEarnings: 'Q3 preview — high expectations',
    dividendYield: 'Quarterly payout maintained'
  };

  const enhancedNews = [
    { 
      headline: 'New AI features boost iPhone upgrade cycle predictions', 
      tag: 'Product', 
      impact: 'Positive',
      time: '2h ago'
    },
    { 
      headline: 'Services revenue guidance raised on strong App Store growth', 
      tag: 'Guidance', 
      impact: 'High Impact',
      time: '1d ago'
    },
    { 
      headline: 'Supply chain report shows improved margins for next quarter', 
      tag: 'Supply Chain', 
      impact: 'Positive',
      time: '2d ago'
    },
    {
      headline: 'EU regulatory probe into App Store policies continues',
      tag: 'Regulatory',
      impact: 'Negative',
      time: '3d ago'
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
          <p className="text-sm text-gray-300 leading-relaxed" style={{ lineHeight: 1.35 }}>{newsItem.headline}</p>
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
                {item.symbol}
              </motion.h3>
              <motion.p 
                className="text-sm mt-1 text-gray-400 truncate"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {item.name || 'Company Name'}
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
                    <MetricCard icon={Calendar} iconColor="text-pink-400" label="Next Earnings" value={new Date(mockStats.nextEarnings).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} context={mockContext.nextEarnings} />
                    <MetricCard icon={TrendingUp} iconColor="text-cyan-400" label="Dividend Yield" value={mockStats.dividendYield} context={mockContext.dividendYield} />
                  </div>
                </motion.div>
                
                <div className="border-t border-white/5" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent)', height: '1px' }} />

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
                      transition={{ layout: { duration: 0.3, ease: 'easeOut' } }}
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
                      <MetricCard icon={Calendar} iconColor="text-pink-400" label="Next Earnings" value={new Date(mockStats.nextEarnings).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} context={mockContext.nextEarnings} />
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
                aria-label={`Set alert for ${item.symbol}`}
              >
                <Bell className="w-4 h-4" />
                <span>Alert</span>
              </motion.button>
              <motion.button 
                className="flex items-center justify-center space-x-2 py-3 px-2 rounded-xl text-sm font-semibold border border-white/10 text-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500" 
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                whileHover={{ scale: 1.02, y: -1, boxShadow: '0 4px 20px rgba(34, 197, 94, 0.3)' }}
                whileTap={{ scale: 0.98 }}
                aria-label={`Add ${item.symbol} to watchlist`}
              >
                <Plus className="w-4 h-4" />
                <span>Watch</span>
              </motion.button>
              <motion.button 
                className="flex items-center justify-center space-x-2 py-3 px-2 rounded-xl text-sm font-semibold border border-white/10 text-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500" 
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                whileHover={{ scale: 1.02, y: -1, boxShadow: '0 4px 20px rgba(168, 85, 247, 0.3)' }}
                whileTap={{ scale: 0.98 }}
                aria-label={`Compare ${item.symbol}`}
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

export default QuickViewDrawer;
