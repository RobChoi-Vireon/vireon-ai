
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Plus, Bell, GitCompare, TrendingUp, TrendingDown, Calendar, ExternalLink, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NewsArticle } from '@/entities/NewsArticle';

const mockTickerData = {
  'AAPL': { name: 'Apple Inc.', price: 189.25, change: 3.50, changePercent: 1.88, volume: '186.5M', sector: 'Technology' },
  'MSFT': { name: 'Microsoft Corp.', price: 384.30, change: 4.15, changePercent: 1.09, volume: '45.2M', sector: 'Technology' },
  'NVDA': { name: 'NVIDIA Corp.', price: 875.50, change: 29.45, changePercent: 3.48, volume: '62.8M', sector: 'Technology' },
  'TSLA': { name: 'Tesla Inc.', price: 248.75, change: -8.90, changePercent: -3.45, volume: '125.4M', sector: 'Consumer Discretionary' },
  'GOOGL': { name: 'Alphabet Inc.', price: 140.80, change: -0.85, changePercent: -0.60, volume: '28.9M', sector: 'Technology' },
  'AMZN': { name: 'Amazon.com Inc.', price: 175.00, change: 2.15, changePercent: 1.24, volume: '41.2M', sector: 'Consumer Discretionary' },
  'META': { name: 'Meta Platforms Inc.', price: 485.20, change: 12.30, changePercent: 2.60, volume: '22.1M', sector: 'Technology' },
  'JPM': { name: 'JPMorgan Chase & Co.', price: 185.60, change: 1.85, changePercent: 1.01, volume: '18.7M', sector: 'Financials' },
  'V': { name: 'Visa Inc.', price: 278.45, change: 3.20, changePercent: 1.16, volume: '8.9M', sector: 'Financials' },
  'JNJ': { name: 'Johnson & Johnson', price: 162.35, change: -0.45, changePercent: -0.28, volume: '12.4M', sector: 'Healthcare' }
};

const TickerResult = ({ ticker, data, onAdd, onAlert, onCompare }) => {
  const isPositive = data.change >= 0;
  
  return (
    <div className="flex items-center justify-between p-4 rounded-xl hover:bg-white/[0.05] transition-colors">
      <div className="flex-1">
        <div className="flex items-center space-x-3 mb-2">
          <span className="text-lg font-bold text-white">{ticker}</span>
          <span className="text-sm text-gray-400">{data.name}</span>
          <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-300">
            {data.sector}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-xl font-bold text-white">${data.price.toFixed(2)}</span>
          <span className={`flex items-center space-x-1 text-sm font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{isPositive ? '+' : ''}{data.change.toFixed(2)} ({isPositive ? '+' : ''}{data.changePercent.toFixed(2)}%)</span>
          </span>
          <span className="text-xs text-gray-500">Vol: {data.volume}</span>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button size="sm" variant="ghost" onClick={() => onAdd(ticker)} className="text-gray-300 hover:bg-white/10">
          <Plus className="w-4 h-4 mr-2" /> Add
        </Button>
        <Button size="sm" variant="ghost" onClick={() => onAlert(ticker)} className="text-gray-300 hover:bg-white/10">
          <Bell className="w-4 h-4 mr-2" /> Alert
        </Button>
        <Button size="sm" variant="ghost" onClick={() => onCompare(ticker)} className="text-gray-300 hover:bg-white/10">
          <GitCompare className="w-4 h-4 mr-2" /> Compare
        </Button>
      </div>
    </div>
  );
};

const NewsResult = ({ article }) => {
  const getSentimentColor = () => {
    switch (article.sentiment) {
      case 'Bullish': return 'text-green-400';
      case 'Bearish': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="p-4 rounded-xl hover:bg-white/[0.05] transition-colors border-l-4 border-blue-500/50">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h3 className="text-white font-semibold leading-tight mb-1">{article.title}</h3>
          <p className="text-gray-300 text-sm leading-relaxed mb-2">{article.summary}</p>
          <div className="flex items-center space-x-3 text-xs">
            <span className="text-gray-400">{article.source}</span>
            <span className={getSentimentColor()}>{article.sentiment}</span>
            <span className="text-gray-400">Impact: {article.impact_score}/10</span>
            {article.tickers_mentioned && article.tickers_mentioned.length > 0 && (
              <div className="flex space-x-1">
                {article.tickers_mentioned.slice(0, 3).map(ticker => (
                  <span key={ticker} className="px-2 py-1 rounded bg-purple-500/20 text-purple-300">
                    {ticker}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <a 
          href={article.source_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="ml-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <ExternalLink className="w-4 h-4 text-gray-400" />
        </a>
      </div>
    </div>
  );
};

export default function SearchOmni({ isOpen, setIsOpen, theme }) {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ tickers: [], news: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [searchMode, setSearchMode] = useState('all'); // 'all', 'tickers', 'news'

  // Pinch-to-close gesture state
  const [initialPinchDistance, setInitialPinchDistance] = useState(null);
  const [isPinching, setIsPinching] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          setIsOpen(false);
        }
        if (e.key === 'Escape') {
          setIsOpen(false);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'auto';
      };
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen, setIsOpen]);

  // Pinch-to-close gesture handler for mobile
  useEffect(() => {
    if (!isOpen) return;

    const handleTouchStart = (e) => {
      if (e.touches.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) + 
          Math.pow(touch2.clientY - touch1.clientY, 2)
        );
        setInitialPinchDistance(distance);
        setIsPinching(true);
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length === 2 && isPinching && initialPinchDistance) {
        e.preventDefault();
        
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const currentDistance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) + 
          Math.pow(touch2.clientY - touch1.clientY, 2)
        );
        
        const pinchRatio = currentDistance / initialPinchDistance;
        
        if (pinchRatio < 0.8) { // If distance reduces by more than 20%
          if (navigator.vibrate) {
            navigator.vibrate([25, 50, 25]); // Haptic feedback
          }
          setIsOpen(false);
          setIsPinching(false);
          setInitialPinchDistance(null);
        }
      }
    };

    const handleTouchEnd = (e) => {
      if (e.touches.length < 2) {
        setIsPinching(false);
        setInitialPinchDistance(null);
      }
    };

    // Use passive: false for touchstart and touchmove because we might call preventDefault
    // Use passive: true for touchend as we don't call preventDefault
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isOpen, isPinching, initialPinchDistance, setIsOpen]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        performSearch(query);
      } else {
        setSearchResults({ tickers: [], news: [] });
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [query, searchMode]);

  const performSearch = async (searchQuery) => {
    setIsLoading(true);
    
    try {
      const results = { tickers: [], news: [] };
      
      // Search tickers
      if (searchMode === 'all' || searchMode === 'tickers') {
        const tickerMatches = Object.entries(mockTickerData)
          .filter(([ticker, data]) => 
            ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
            data.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            data.sector.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .slice(0, 5);
        
        results.tickers = tickerMatches.map(([ticker, data]) => ({ ticker, ...data }));
      }
      
      // Search news
      if (searchMode === 'all' || searchMode === 'news') {
        try {
          const newsArticles = await NewsArticle.list('-published_date', 20);
          const filteredNews = newsArticles.filter(article => 
            article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.tickers_mentioned?.some(ticker => 
              ticker.toLowerCase().includes(searchQuery.toLowerCase())
            )
          ).slice(0, 3);
          
          results.news = filteredNews;
        } catch (error) {
          console.error('Error searching news:', error);
        }
      }
      
      setSearchResults(results);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToWatchlist = (ticker) => {
    console.log('Add to watchlist:', ticker);
    // TODO: Implement add to watchlist functionality
  };

  const handleSetAlert = (ticker) => {
    console.log('Set alert for:', ticker);
    // TODO: Implement alert functionality
  };

  const handleCompare = (ticker) => {
    console.log('Compare:', ticker);
    // TODO: Implement compare functionality
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[15vh]"
          onClick={() => setIsOpen(false)}
        >
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <motion.div
            initial={{ scale: 0.95, y: -20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: -20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className={`
              relative w-full max-w-3xl rounded-2xl
              ${theme === 'dark' 
                ? 'bg-gradient-to-br from-[#1A1D29]/95 to-[#12141C]/95 border border-white/10' 
                : 'bg-gradient-to-br from-white/95 to-white/90 border border-black/[0.08]'
              }
              backdrop-blur-xl shadow-2xl max-h-[80vh] flex flex-col
            `}
            style={{ 
              transform: isPinching && initialPinchDistance ? 'scale(0.95)' : 'scale(1)',
              transition: 'transform 0.1s ease-out',
              touchAction: 'none' // Disable default touch actions like pan/zoom
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile pinch hint */}
            <div className="md:hidden absolute top-2 right-2 text-xs text-gray-500 bg-black/30 px-2 py-1 rounded-full flex items-center gap-1">
              <span role="img" aria-label="pinch gesture">👌</span> Pinch to close
            </div>

            {/* Search Input */}
            <div className="flex items-center gap-4 p-6 border-b border-white/10">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tickers, companies, or news..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-lg focus:outline-none text-white placeholder-gray-400"
                autoFocus
              />
              {isLoading && (
                <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" />
              )}
            </div>

            {/* Search Mode Tabs */}
            <div className="flex items-center gap-2 px-6 py-3 border-b border-white/10">
              {[
                { id: 'all', label: 'All Results', icon: Search },
                { id: 'tickers', label: 'Tickers', icon: TrendingUp },
                { id: 'news', label: 'News', icon: Newspaper }
              ].map(mode => (
                <button
                  key={mode.id}
                  onClick={() => setSearchMode(mode.id)}
                  className={`
                    flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
                    ${searchMode === mode.id 
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  <mode.icon className="w-4 h-4" />
                  <span>{mode.label}</span>
                </button>
              ))}
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto p-2">
              {query.trim() ? (
                <div className="space-y-6">
                  {/* Ticker Results */}
                  {searchResults.tickers.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3 px-4 flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2" />
                        Market Data ({searchResults.tickers.length})
                      </h3>
                      <div className="space-y-2">
                        {searchResults.tickers.map(({ ticker, ...data }) => (
                          <TickerResult
                            key={ticker}
                            ticker={ticker}
                            data={data}
                            onAdd={handleAddToWatchlist}
                            onAlert={handleSetAlert}
                            onCompare={handleCompare}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* News Results */}
                  {searchResults.news.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3 px-4 flex items-center">
                        <Newspaper className="w-5 h-5 mr-2" />
                        News ({searchResults.news.length})
                      </h3>
                      <div className="space-y-2">
                        {searchResults.news.map(article => (
                          <NewsResult key={article.id} article={article} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* No Results */}
                  {!isLoading && searchResults.tickers.length === 0 && searchResults.news.length === 0 && (
                    <div className="text-center py-12">
                      <Search className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                      <p className="text-lg font-semibold text-gray-300">No results found</p>
                      <p className="text-gray-500">Try searching for ticker symbols, company names, or news topics</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-xl font-semibold text-gray-300 mb-2">Market Search</p>
                  <p className="text-gray-500 mb-6">Search for stock tickers, company data, or market news</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-md mx-auto">
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <TrendingUp className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-300">Live Prices</p>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <Newspaper className="w-6 h-6 text-green-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-300">Market News</p>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <Bell className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-300">Set Alerts</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="border-t border-white/10 p-4 text-xs text-gray-500 flex items-center justify-between">
              <span>Search across market data and news</span>
              <div className="flex items-center gap-4">
                <span>Open <kbd className="px-2 py-1 text-xs font-semibold text-gray-400 bg-white/10 border border-white/10 rounded-md">⌘K</kbd></span>
                <span>Close <kbd className="px-2 py-1 text-xs font-semibold text-gray-400 bg-white/10 border border-white/10 rounded-md">Esc</kbd></span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
