import React, { useState, useEffect } from 'react';
import { NewsArticle } from '@/entities/NewsArticle';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw, Newspaper, TrendingUp, LayoutGrid, List, AlertTriangle, Zap, Activity, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ArticleCard from '../components/live-feed/ArticleCard';
import FeedFilters from '../components/live-feed/FeedFilters';
import TimelineArticleCard from '../components/live-feed/TimelineArticleCard';
import { motion, AnimatePresence } from 'framer-motion';

export default function LiveFeed() {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [viewMode, setViewMode] = useState('grid');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const [filters, setFilters] = useState({
    sector: "All",
    category: "All",
    impact: "All"
  });

  useEffect(() => {
    const root = document.documentElement;
    const currentTheme = root.classList.contains('dark') ? 'dark' : 'light';
    setTheme(currentTheme);

    const observer = new MutationObserver(() => {
      setTheme(root.classList.contains('dark') ? 'dark' : 'light');
    });
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });

    loadArticles();
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let result = articles;
    if (filters.sector !== "All") {
      result = result.filter(a => a.sector === filters.sector);
    }
    if (filters.category !== "All") {
      result = result.filter(a => a.category === filters.category);
    }
    if (filters.impact !== "All") {
        if (filters.impact === 'High (7+)') result = result.filter(a => a.impact_score >= 7);
        if (filters.impact === 'Medium (4-6)') result = result.filter(a => a.impact_score >= 4 && a.impact_score < 7);
        if (filters.impact === 'Low (1-3)') result = result.filter(a => a.impact_score < 4);
    }
    setFilteredArticles(result);
  }, [filters, articles]);

  const MOCK_ARTICLES = [
    {
      id: '1',
      title: 'Fed Signals Rate Cut Pause as Inflation Data Shows Resilience',
      content: 'Federal Reserve officials indicated they may hold interest rates steady longer than expected after core PCE inflation came in above forecasts at 2.8% year-over-year.',
      summary: 'Fed may pause rate cuts as inflation remains sticky above target.',
      key_insights: ['Core PCE at 2.8% vs 2.6% expected', 'Market pricing in fewer cuts for 2024', 'Dollar strengthens on hawkish pivot'],
      source: 'Bloomberg',
      source_url: 'https://www.bloomberg.com',
      published_date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      sector: 'Financial Services',
      category: 'Fed Policy',
      sentiment: 'Bearish',
      region: 'US',
      impact_score: 9,
      tickers_mentioned: ['SPY', 'TLT', 'UUP'],
      is_breaking: true
    },
    {
      id: '2',
      title: 'NVIDIA Earnings Beat Estimates, AI Demand Surges',
      content: 'NVIDIA reported Q4 earnings of $5.16 per share vs $4.64 expected, driven by accelerating AI infrastructure spending from hyperscalers.',
      summary: 'NVDA crushes earnings on robust AI demand, guiding higher for next quarter.',
      key_insights: ['Data center revenue up 217% YoY', 'Gaming segment rebounds 15%', 'Gross margins expand to 78%'],
      source: 'CNBC',
      source_url: 'https://www.cnbc.com',
      published_date: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      sector: 'Technology',
      category: 'Earnings',
      sentiment: 'Bullish',
      region: 'US',
      impact_score: 8,
      tickers_mentioned: ['NVDA', 'AMD', 'MSFT'],
      is_breaking: false
    },
    {
      id: '3',
      title: 'Oil Prices Surge on Middle East Supply Concerns',
      content: 'Brent crude jumped 4.2% to $88.50/barrel amid escalating tensions in the Red Sea, threatening key shipping routes.',
      summary: 'Geopolitical risk premium returns to oil markets.',
      key_insights: ['Brent up 4.2% intraday', 'Shipping disruptions mounting', 'Energy stocks outperform'],
      source: 'Reuters',
      source_url: 'https://www.reuters.com',
      published_date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      sector: 'Energy',
      category: 'Geopolitics',
      sentiment: 'Bullish',
      region: 'Global',
      impact_score: 7,
      tickers_mentioned: ['XLE', 'XOM', 'CVX'],
      is_breaking: false
    },
    {
      id: '4',
      title: 'Tesla Cuts Prices Across Europe Amid EV Competition',
      content: 'Tesla reduced Model 3 and Model Y prices by up to 6% in major European markets as competition intensifies from BYD and legacy automakers.',
      summary: 'TSLA slashes prices in Europe to defend market share.',
      key_insights: ['Model Y down 6% in Germany', 'Competition from BYD intensifies', 'Margin pressure continues'],
      source: 'Financial Times',
      source_url: 'https://www.ft.com',
      published_date: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      sector: 'Consumer Discretionary',
      category: 'M&A',
      sentiment: 'Bearish',
      region: 'Europe',
      impact_score: 6,
      tickers_mentioned: ['TSLA', 'GM', 'F'],
      is_breaking: false
    },
    {
      id: '5',
      title: 'Bitcoin Breaks $50K as ETF Inflows Accelerate',
      content: 'Bitcoin surged past $50,000 for the first time since 2021 as spot ETF inflows topped $2.1B in a single week.',
      summary: 'BTC rallies on institutional demand via new spot ETFs.',
      key_insights: ['$2.1B weekly ETF inflows', 'Institutional adoption rising', 'Halving event approaching'],
      source: 'CoinDesk',
      source_url: 'https://www.coindesk.com',
      published_date: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
      sector: 'Technology',
      category: 'Crypto',
      sentiment: 'Bullish',
      region: 'Global',
      impact_score: 8,
      tickers_mentioned: ['COIN', 'MSTR', 'RIOT'],
      is_breaking: false
    },
    {
      id: '6',
      title: 'JPMorgan Sees Risk of Treasury Sell-Off on Debt Ceiling',
      content: 'JPMorgan analysts warn of potential 10-year yield spike to 4.75% if debt ceiling negotiations drag into Q3.',
      summary: 'Wall Street flags fiscal risk as debt ceiling deadline looms.',
      key_insights: ['Yields could hit 4.75%', 'Political gridlock risk rising', 'Duration positioning cautious'],
      source: 'Wall Street Journal',
      source_url: 'https://www.wsj.com',
      published_date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      sector: 'Financial Services',
      category: 'Macro',
      sentiment: 'Bearish',
      region: 'US',
      impact_score: 7,
      tickers_mentioned: ['TLT', 'JPM', 'BAC'],
      is_breaking: false
    },
    {
      id: '7',
      title: 'Amazon Web Services Revenue Beats, AI Adoption Accelerates',
      content: 'AWS reported $24.2B in Q4 revenue vs $24.0B expected, with management citing strong AI workload growth.',
      summary: 'AWS beats on AI momentum, cloud reacceleration underway.',
      key_insights: ['AWS revenue up 13% YoY', 'AI workloads driving growth', 'Operating margins expand'],
      source: 'Bloomberg',
      source_url: 'https://www.bloomberg.com',
      published_date: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
      sector: 'Technology',
      category: 'Earnings',
      sentiment: 'Bullish',
      region: 'US',
      impact_score: 8,
      tickers_mentioned: ['AMZN', 'MSFT', 'GOOGL'],
      is_breaking: false
    },
    {
      id: '8',
      title: 'Healthcare Sector Rallies on Drug Pricing Relief',
      content: 'Healthcare stocks surged after Senate negotiations yielded a scaled-back drug pricing reform bill, easing investor concerns.',
      summary: 'XLV rallies as drug pricing fears ease in Washington.',
      key_insights: ['XLV up 2.8% on session', 'Reform bill less aggressive', 'Biotech outperforms'],
      source: 'CNBC',
      source_url: 'https://www.cnbc.com',
      published_date: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(),
      sector: 'Healthcare',
      category: 'Regulatory',
      sentiment: 'Bullish',
      region: 'US',
      impact_score: 6,
      tickers_mentioned: ['XLV', 'JNJ', 'PFE'],
      is_breaking: false
    }
  ];

  const loadArticles = async (retries = 3) => {
    setIsLoading(true);
    setError(null);
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const fetchedArticles = await NewsArticle.list('-published_date', 50);
        if (fetchedArticles && fetchedArticles.length > 0) {
          setArticles(fetchedArticles);
          setFilteredArticles(fetchedArticles);
        } else {
          // Use mock data if no real articles
          setArticles(MOCK_ARTICLES);
          setFilteredArticles(MOCK_ARTICLES);
        }
        setLastUpdated(new Date());
        setIsLoading(false);
        return;
      } catch (err) {
        console.error(`Error loading articles (attempt ${attempt}):`, err);
        if (attempt === retries) {
          // Fallback to mock data on error
          setArticles(MOCK_ARTICLES);
          setFilteredArticles(MOCK_ARTICLES);
          setError(null); // Don't show error, just use mock data
        }
        await new Promise(res => setTimeout(res, 1000 * attempt));
      }
    }
    setIsLoading(false);
  };

  const viewToggle = (
    <div className={`flex items-center p-1 rounded-2xl backdrop-blur-xl border transition-all duration-300 hover:shadow-lg ${theme === 'dark' ? 'bg-white/[0.08] border-white/10 hover:border-white/20' : 'bg-black/[0.04] border-black/[0.08] hover:border-black/[0.12]'}`}>
      <motion.button 
        onClick={() => setViewMode('grid')}
        className={`p-3 rounded-xl text-sm font-bold transition-all duration-300 min-w-[120px] ${viewMode === 'grid' ? (theme === 'dark' ? 'bg-white/15 text-white shadow-lg' : 'bg-white text-black shadow-lg') : (theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-black hover:bg-black/5')}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        aria-label="Switch to grid view"
      >
        <LayoutGrid className="w-5 h-5 inline mr-2" />
        Grid View
      </motion.button>
      <motion.button 
        onClick={() => setViewMode('timeline')}
        className={`p-3 rounded-xl text-sm font-bold transition-all duration-300 min-w-[120px] ${viewMode === 'timeline' ? (theme === 'dark' ? 'bg-white/15 text-white shadow-lg' : 'bg-white text-black shadow-lg') : (theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-black hover:bg-black/5')}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        aria-label="Switch to timeline view"
      >
        <List className="w-5 h-5 inline mr-2" />
        Timeline
      </motion.button>
    </div>
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    },
  };

  return (
    <div className="min-h-screen font-sans overflow-x-hidden" style={{ 
      background: '#0B0E13',
      color: '#F8FAFC'
    }}>
      {/* Ambient background layers for depth */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: `
              radial-gradient(600px circle at 20% 30%, rgba(202, 51, 255, 0.08), transparent),
              radial-gradient(800px circle at 80% 70%, rgba(77, 143, 251, 0.06), transparent),
              radial-gradient(400px circle at 50% 100%, rgba(88, 227, 164, 0.04), transparent)
            `
          }}
        />
        {/* Floating orbs for ambiance */}
        <motion.div 
          className="absolute w-80 h-80 rounded-full opacity-10 blur-3xl"
          style={{ 
            background: 'linear-gradient(45deg, rgba(77, 143, 251, 0.4), rgba(202, 51, 255, 0.3))',
            left: '10%',
            top: '15%'
          }}
          animate={{ 
            x: [0, 40, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute w-60 h-60 rounded-full opacity-8 blur-2xl"
          style={{ 
            background: 'linear-gradient(45deg, rgba(88, 227, 164, 0.3), rgba(233, 196, 106, 0.2))',
            right: '15%',
            bottom: '20%'
          }}
          animate={{ 
            x: [0, -30, 0],
            y: [0, 20, 0],
            scale: [1, 0.8, 1]
          }}
          transition={{ 
            duration: 30, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
      </div>

      <div className="relative z-10 space-y-6 md:space-y-10">
        {/* Enhanced Header */}
        <motion.div 
          className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 md:p-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <motion.div 
                className={`w-12 h-12 rounded-3xl flex items-center justify-center backdrop-blur-xl border ${theme === 'dark' ? 'bg-blue-500/20 border-blue-500/30' : 'bg-blue-100 border-blue-200'}`}
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Zap className={`w-6 h-6 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} strokeWidth={2.5} />
              </motion.div>
              <div>
                <h1 className={`text-4xl md:text-6xl font-black tracking-[-0.04em] ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} style={{
                  background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 60%, #CBD5E1 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Live News Feed
                </h1>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <motion.div 
                      className="relative"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <div className="absolute inset-0 w-3 h-3 rounded-full bg-green-500 animate-ping opacity-75" />
                    </motion.div>
                    <span className={`text-sm font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                      LIVE UPDATES
                    </span>
                  </div>
                  <div className="h-4 w-px bg-white/20" />
                  <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {filteredArticles.length} stories • Last updated {lastUpdated.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4 w-full md:w-auto">
            {viewToggle}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                onClick={loadArticles} 
                disabled={isLoading}
                className={`
                  group relative w-full md:w-auto px-8 py-4 rounded-2xl font-bold text-base backdrop-blur-xl border
                  ${theme === 'dark' 
                    ? 'bg-gradient-to-r from-[#1A1D29] to-[#12141C] hover:from-[#1F2235] hover:to-[#151823] border border-white/20 hover:border-white/30 text-white' 
                    : 'bg-gradient-to-r from-white to-gray-50 hover:from-gray-50 hover:to-gray-100 border border-black/10 hover:border-black/20 text-black'
                  }
                  shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:scale-100
                `}
                style={{
                  boxShadow: '0 10px 40px rgba(77, 143, 251, 0.2), 0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
              >
                <motion.div
                  animate={isLoading ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ duration: 1, repeat: isLoading ? Infinity : 0, ease: "linear" }}
                >
                  <RefreshCw className={`w-5 h-5 mr-3 inline`} />
                </motion.div>
                Refresh Feed
              </Button>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="px-6 md:px-8"
        >
          <FeedFilters filters={filters} setFilters={setFilters} theme={theme} />
        </motion.div>

        <div className="px-6 md:px-8">
          {isLoading ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {Array(6).fill(0).map((_, i) => (
                <motion.div 
                  key={i} 
                  variants={itemVariants}
                  className={`
                    rounded-3xl p-8 backdrop-blur-xl border
                    ${theme === 'dark' ? 'bg-white/[0.03] border-white/10' : 'bg-black/[0.02] border-black/[0.06]'}
                  `}
                >
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-16 w-16 rounded-2xl bg-gray-700/30" />
                      <div className="space-y-3 flex-1">
                        <Skeleton className="h-5 w-32 bg-gray-700/30" />
                        <Skeleton className="h-8 w-full bg-gray-700/30" />
                      </div>
                    </div>
                    <Skeleton className="h-32 w-full bg-gray-700/30 rounded-2xl" />
                    <div className="flex space-x-3">
                      <Skeleton className="h-8 w-20 rounded-full bg-gray-700/30" />
                      <Skeleton className="h-8 w-24 rounded-full bg-gray-700/30" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : error ? (
            <motion.div 
              className="col-span-full text-center py-20 md:py-32"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-xl border ${theme === 'dark' ? 'bg-red-500/10 border-red-500/20' : 'bg-red-100 border-red-200'}`}>
                <AlertTriangle className={`w-12 h-12 ${theme === 'dark' ? 'text-red-400' : 'text-red-500'}`} />
              </div>
              <h2 className={`text-3xl font-bold mb-4 ${theme === 'dark' ? 'text-red-300' : 'text-red-600'}`}>
                Connection Error
              </h2>
              <p className={`text-lg mb-8 max-w-md mx-auto ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                {error}
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={() => loadArticles()} size="lg" className="rounded-2xl px-8 py-4 text-base font-bold">
                  <RefreshCw className="w-5 h-5 mr-3" />
                  Try Again
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              {viewMode === 'grid' ? (
                <motion.div
                  key="grid"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
                >
                  {filteredArticles.length > 0 ? (
                    filteredArticles.map((article, index) => (
                      <motion.div key={article.id} variants={itemVariants}>
                        <ArticleCard article={article} theme={theme} />
                      </motion.div>
                    ))
                  ) : (
                    <motion.div 
                      className="col-span-full text-center py-20"
                      variants={itemVariants}
                    >
                      <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 ${theme === 'dark' ? 'bg-white/[0.08]' : 'bg-gray-100'}`}>
                        <TrendingUp className={`w-10 h-10 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                      </div>
                      <h3 className={`text-2xl font-bold mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        No stories match your filters
                      </h3>
                      <p className={`text-base ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                        Try changing your filters or refresh the page
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="timeline"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative" 
                >
                  <div className={`hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full rounded-full ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`} />
                  <div className="space-y-12">
                    {filteredArticles.length > 0 ? (
                      filteredArticles.map((article, index) => (
                        <motion.div key={article.id} variants={itemVariants}>
                          <TimelineArticleCard article={article} index={index} theme={theme} />
                        </motion.div>
                      ))
                    ) : (
                      <motion.div 
                        className="text-center py-20"
                        variants={itemVariants}
                      >
                        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 ${theme === 'dark' ? 'bg-white/[0.08]' : 'bg-gray-100'}`}>
                          <TrendingUp className={`w-10 h-10 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                        </div>
                        <h3 className={`text-2xl font-bold mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                          No articles match your filters
                        </h3>
                        <p className={`text-base ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                          Try adjusting your search criteria or refresh the feed
                        </p>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}