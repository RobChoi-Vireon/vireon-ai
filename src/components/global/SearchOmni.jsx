import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Search, X, Plus, Bell, GitCompare, TrendingUp, TrendingDown, Calendar, ExternalLink, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NewsArticle } from '@/entities/NewsArticle';

// OS Horizon animation curves
const HORIZON_EASE_OUT = [0.25, 0.46, 0.45, 0.94];
const HORIZON_EASE_IN = [0.42, 0, 0.58, 1];
const HORIZON_REBOUND = [0.25, 0.8, 0.25, 1];

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
  const [showSweep, setShowSweep] = useState(false);
  
  return (
    <motion.div 
      className="relative rounded-[22px] overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.045) 0%, rgba(255, 255, 255, 0.028) 100%)',
        backdropFilter: 'blur(32px) saturate(168%)',
        WebkitBackdropFilter: 'blur(32px) saturate(168%)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: `
          inset 0 1.5px 0 rgba(255,255,255,0.06),
          inset 0 -1px 1px rgba(0,0,0,0.02),
          0 3px 14px rgba(0,0,0,0.09)
        `
      }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: HORIZON_REBOUND }}
      onHoverStart={() => setTimeout(() => setShowSweep(true), 350)}
      onHoverEnd={() => setShowSweep(false)}
      whileHover={{
        y: -2,
        backdropFilter: 'blur(36px) saturate(172%)',
        WebkitBackdropFilter: 'blur(36px) saturate(172%)',
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.055) 0%, rgba(255, 255, 255, 0.036) 100%)',
        boxShadow: `
          inset 0 1.5px 0 rgba(255,255,255,0.08),
          inset 0 -1px 1px rgba(0,0,0,0.02),
          0 6px 20px rgba(0,0,0,0.14),
          0 0 28px rgba(110, 180, 255, 0.05)
        `,
        transition: { duration: 0.15, ease: HORIZON_EASE_OUT }
      }}
      whileTap={{
        y: 0,
        scale: 0.995,
        transition: { duration: 0.08, ease: HORIZON_EASE_IN }
      }}
    >
      {/* Crown glow */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '16%',
        right: '16%',
        height: '1.5px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent)',
        filter: 'blur(0.5px)',
        pointerEvents: 'none'
      }} />

      {/* Corner ambient lighting */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '60px',
        height: '60px',
        background: 'radial-gradient(ellipse at 0% 0%, rgba(255,255,255,0.04) 0%, transparent 65%)',
        borderRadius: '22px 0 0 0',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '60px',
        height: '60px',
        background: 'radial-gradient(ellipse at 100% 0%, rgba(255,255,255,0.04) 0%, transparent 65%)',
        borderRadius: '0 22px 0 0',
        pointerEvents: 'none'
      }} />

      {/* Luminance sweep */}
      <AnimatePresence>
        {showSweep && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)',
              borderRadius: '22px'
            }}
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: '100%', opacity: [0, 0.06, 0] }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          />
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between p-5">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-lg font-extrabold tracking-tight" style={{ color: 'rgba(255,255,255,0.96)' }}>{ticker}</span>
            <span className="text-sm" style={{ color: 'rgba(255,255,255,0.60)', lineHeight: '1.45' }}>{data.name}</span>
            <span 
              className="text-xs px-2.5 py-1 rounded-full font-medium"
              style={{
                background: 'rgba(90, 150, 255, 0.10)',
                color: 'rgba(120, 170, 255, 0.82)',
                border: '1px solid rgba(90, 150, 255, 0.12)'
              }}
            >
              {data.sector}
            </span>
          </div>
          <div className="flex items-center space-x-5">
            <span className="text-xl font-black tracking-tight" style={{ color: 'rgba(255,255,255,0.98)' }}>${data.price.toFixed(2)}</span>
            <span 
              className="flex items-center space-x-1.5 text-sm font-bold"
              style={{ color: isPositive ? 'rgba(88, 227, 164, 0.82)' : 'rgba(255, 106, 122, 0.82)' }}
            >
              {isPositive ? <TrendingUp className="w-4 h-4" strokeWidth={2.2} /> : <TrendingDown className="w-4 h-4" strokeWidth={2.2} />}
              <span>{isPositive ? '+' : ''}{data.change.toFixed(2)} ({isPositive ? '+' : ''}{data.changePercent.toFixed(2)}%)</span>
            </span>
            <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.40)' }}>Vol: {data.volume}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {[
            { icon: Plus, label: 'Add', action: onAdd },
            { icon: Bell, label: 'Alert', action: onAlert },
            { icon: GitCompare, label: 'Compare', action: onCompare }
          ].map(({ icon: Icon, label, action }) => (
            <motion.button
              key={label}
              onClick={() => action(ticker)}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium"
              style={{
                background: 'rgba(255, 255, 255, 0.035)',
                color: 'rgba(255,255,255,0.72)',
                border: '1px solid rgba(255,255,255,0.06)'
              }}
              whileHover={{
                y: -0.5,
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'rgba(255,255,255,0.88)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                transition: { duration: 0.08, ease: HORIZON_EASE_OUT }
              }}
              whileTap={{
                scale: 0.98,
                background: 'rgba(255, 255, 255, 0.025)',
                transition: { duration: 0.08, ease: HORIZON_EASE_IN }
              }}
            >
              <Icon className="w-3.5 h-3.5" strokeWidth={2} />
              <span>{label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const NewsResult = ({ article }) => {
  const getSentimentColor = () => {
    switch (article.sentiment) {
      case 'Bullish': return 'rgba(88, 227, 164, 0.76)';
      case 'Bearish': return 'rgba(255, 106, 122, 0.76)';
      default: return 'rgba(255,255,255,0.48)';
    }
  };

  const [showSweep, setShowSweep] = useState(false);

  return (
    <motion.div 
      className="relative rounded-[18px] overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.028) 0%, rgba(255, 255, 255, 0.018) 100%)',
        backdropFilter: 'blur(24px) saturate(160%)',
        WebkitBackdropFilter: 'blur(24px) saturate(160%)',
        border: '1px solid rgba(255,255,255,0.05)',
        boxShadow: `
          inset 0 1px 0 rgba(255,255,255,0.03),
          inset 0 -1px 1px rgba(0,0,0,0.015),
          0 2px 10px rgba(0,0,0,0.06)
        `
      }}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: HORIZON_REBOUND }}
      onHoverStart={() => setTimeout(() => setShowSweep(true), 350)}
      onHoverEnd={() => setShowSweep(false)}
      whileHover={{
        y: -1.5,
        x: 0.75,
        backdropFilter: 'blur(28px) saturate(165%)',
        WebkitBackdropFilter: 'blur(28px) saturate(165%)',
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.038) 0%, rgba(255, 255, 255, 0.024) 100%)',
        boxShadow: `
          inset 0 1px 0 rgba(255,255,255,0.05),
          inset 0 -1px 1px rgba(0,0,0,0.015),
          0 4px 16px rgba(0,0,0,0.10)
        `,
        transition: { duration: 0.14, ease: HORIZON_EASE_OUT }
      }}
    >
      {/* Luminance sweep */}
      <AnimatePresence>
        {showSweep && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.03) 50%, transparent 100%)',
              borderRadius: '18px'
            }}
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: '100%', opacity: [0, 0.05, 0] }}
            transition={{ duration: 0.75, ease: 'easeInOut' }}
          />
        )}
      </AnimatePresence>

      <div className="flex items-start justify-between p-5">
        <div className="flex-1 pr-5">
          <h3 
            className="font-semibold leading-snug mb-3"
            style={{ 
              color: 'rgba(255,255,255,0.94)',
              fontSize: '15px',
              lineHeight: '1.45',
              letterSpacing: '-0.01em'
            }}
          >
            {article.title}
          </h3>
          <p 
            className="text-sm leading-relaxed mb-4"
            style={{ 
              color: 'rgba(255,255,255,0.64)',
              lineHeight: '1.55'
            }}
          >
            {article.summary}
          </p>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span 
              className="px-2.5 py-1 rounded-lg font-medium"
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                color: 'rgba(255,255,255,0.58)',
                border: '1px solid rgba(255,255,255,0.05)'
              }}
            >
              {article.source}
            </span>
            <span 
              className="px-2.5 py-1 rounded-lg font-semibold"
              style={{
                color: getSentimentColor()
              }}
            >
              {article.sentiment}
            </span>
            <span 
              className="font-medium"
              style={{ color: 'rgba(255,255,255,0.44)' }}
            >
              Impact: {article.impact_score}/10
            </span>
            {article.tickers_mentioned && article.tickers_mentioned.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {article.tickers_mentioned.slice(0, 3).map(ticker => (
                  <span 
                    key={ticker} 
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold"
                    style={{
                      background: 'rgba(138, 100, 223, 0.10)',
                      color: 'rgba(170, 140, 240, 0.78)',
                      border: '1px solid rgba(138, 100, 223, 0.12)'
                    }}
                  >
                    {ticker}
                  </span>
                ))}
                {article.tickers_mentioned.length > 3 && (
                  <span 
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold"
                    style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      color: 'rgba(255,255,255,0.52)',
                      border: '1px solid rgba(255,255,255,0.05)'
                    }}
                  >
                    +{article.tickers_mentioned.length - 3} More
                  </span>
                )}
              </motion.div>
              )}
              </motion.div>
        </div>
        <motion.a 
          href={article.source_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex-shrink-0 p-2 rounded-lg"
          style={{
            color: 'rgba(255,255,255,0.32)'
          }}
          whileHover={{
            color: 'rgba(255,255,255,0.72)',
            background: 'rgba(255, 255, 255, 0.04)',
            transition: { duration: 0.08 }
          }}
        >
          <ExternalLink className="w-4 h-4" strokeWidth={2} />
        </motion.a>
      </div>
    </motion.div>
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

  // Alive glass parallax
  const scrollRef = useRef(null);
  const { scrollY } = useScroll({ container: scrollRef });
  const parallaxY = useTransform(scrollY, [0, 100], [0, 1]);

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
          transition={{ duration: 0.13, ease: HORIZON_EASE_OUT }}
          className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[15vh]"
          onClick={() => setIsOpen(false)}
        >
          {/* Enhanced backdrop blur */}
          <motion.div 
            className="absolute inset-0"
            initial={{ backdropFilter: 'blur(0px)', WebkitBackdropFilter: 'blur(0px)' }}
            animate={{ backdropFilter: 'blur(62px)', WebkitBackdropFilter: 'blur(62px)' }}
            exit={{ backdropFilter: 'blur(0px)', WebkitBackdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.15, ease: HORIZON_EASE_OUT }}
            style={{
              background: 'rgba(0, 0, 0, 0.42)'
            }}
          />

          {/* macOS Tahoe Liquid Glass Panel */}
          <motion.div
            initial={{ scale: 0.96, y: -12, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: -12, opacity: 0 }}
            transition={{ 
              duration: 0.13, 
              ease: HORIZON_EASE_OUT,
              exit: { duration: 0.15, ease: HORIZON_EASE_IN }
            }}
            className="relative w-full max-w-3xl rounded-[34px] max-h-[80vh] flex flex-col overflow-hidden"
            style={{ 
              background: 'linear-gradient(180deg, rgba(31, 36, 48, 0.78) 0%, rgba(24, 28, 36, 0.84) 100%)',
              backdropFilter: 'blur(72px) saturate(172%)',
              WebkitBackdropFilter: 'blur(72px) saturate(172%)',
              border: '1px solid rgba(255,255,255,0.10)',
              boxShadow: `
                inset 0 0 0 1.5px rgba(255,255,255,0.03),
                inset 0 1px 0 rgba(255,255,255,0.06),
                0 28px 72px rgba(0,0,0,0.36),
                0 12px 38px rgba(0,0,0,0.26)
              `,
              transform: isPinching && initialPinchDistance ? 'scale(0.96)' : 'scale(1)',
              transition: 'transform 0.1s ease-out',
              touchAction: 'none'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Crown Glow - Top edge light catch */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: '12%',
              right: '12%',
              height: '2.5px',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)',
              filter: 'blur(1.2px)',
              pointerEvents: 'none',
              zIndex: 10
            }} />

            {/* Rim-light contour */}
            <div style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '34px',
              border: '1px solid rgba(255,255,255,0.06)',
              pointerEvents: 'none',
              zIndex: 10
            }} />

            {/* Drop-through Glow - Bottom edge refraction */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: '16%',
              right: '16%',
              height: '1.5px',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
              filter: 'blur(0.8px)',
              pointerEvents: 'none',
              zIndex: 10
            }} />

            {/* Corner Refraction - Top Left */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '80px',
              height: '80px',
              background: 'radial-gradient(ellipse at 0% 0%, rgba(255,255,255,0.06) 0%, transparent 60%)',
              borderRadius: '28px 0 0 0',
              pointerEvents: 'none'
            }} />

            {/* Corner Refraction - Top Right */}
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '80px',
              height: '80px',
              background: 'radial-gradient(ellipse at 100% 0%, rgba(255,255,255,0.06) 0%, transparent 60%)',
              borderRadius: '0 28px 0 0',
              pointerEvents: 'none'
            }} />

            {/* Alive Glass Parallax Layer */}
            <motion.div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(255,255,255,0.01) 0%, transparent 100%)',
                y: parallaxY,
                pointerEvents: 'none',
                borderRadius: '28px'
              }}
            />

            {/* Mobile pinch hint */}
            <div className="md:hidden absolute top-3 right-3 z-20 text-[10px] px-2 py-1 rounded-full flex items-center gap-1"
              style={{
                background: 'rgba(0, 0, 0, 0.24)',
                color: 'rgba(255,255,255,0.48)',
                backdropFilter: 'blur(8px)'
              }}
            >
              <span role="img" aria-label="pinch gesture">👌</span> Pinch to close
            </div>

            {/* Search Input */}
            <div 
              className="flex items-center gap-4 px-7 py-6 relative"
              style={{
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.012) 0%, transparent 100%)'
              }}
            >
              {/* Inner curvature sheen */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: '10%',
                right: '10%',
                height: '2px',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
                filter: 'blur(1px)',
                pointerEvents: 'none'
              }} />

              <motion.div
                animate={query ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 0.3, ease: HORIZON_EASE_OUT }}
              >
                <Search 
                  className="w-5 h-5" 
                  strokeWidth={2}
                  style={{ color: 'rgba(255,255,255,0.48)' }} 
                />
              </motion.div>
              <input
                type="text"
                placeholder="Search tickers, companies, or news..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-lg focus:outline-none"
                style={{
                  color: 'rgba(255,255,255,0.96)',
                  caretColor: 'rgba(110, 180, 255, 0.88)',
                  paddingLeft: '2px'
                }}
                autoFocus
              />
              {isLoading && (
                <motion.div 
                  className="w-4 h-4 rounded-full"
                  style={{
                    border: '2px solid rgba(110, 180, 255, 0.20)',
                    borderTopColor: 'rgba(110, 180, 255, 0.88)'
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                />
              )}

              {/* Focus inner glow */}
              <motion.div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse at 20% 50%, rgba(110, 180, 255, 0.03) 0%, transparent 65%)'
                }}
                animate={{
                  opacity: query ? 1 : 0
                }}
                transition={{ duration: 0.3, ease: HORIZON_EASE_OUT }}
              />
            </div>

            {/* Search Mode Tabs */}
            <div 
              className="flex items-center gap-2.5 px-7 py-4 relative"
              style={{
                borderBottom: '1px solid rgba(255,255,255,0.04)'
              }}
            >
              {/* Subtle divider line */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: '8%',
                right: '8%',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)',
                pointerEvents: 'none'
              }} />
              {[
                { id: 'all', label: 'All Results', icon: Search },
                { id: 'tickers', label: 'Tickers', icon: TrendingUp },
                { id: 'news', label: 'News', icon: Newspaper }
              ].map(mode => {
                const isActive = searchMode === mode.id;
                return (
                  <motion.button
                    key={mode.id}
                    onClick={() => setSearchMode(mode.id)}
                    className="relative flex items-center space-x-2 px-4 py-2.5 rounded-[16px] text-sm font-semibold"
                    style={{
                      background: isActive 
                        ? 'linear-gradient(180deg, rgba(110, 180, 255, 0.14) 0%, rgba(90, 160, 255, 0.11) 100%)'
                        : 'transparent',
                      color: isActive ? 'rgba(160, 200, 255, 0.96)' : 'rgba(255,255,255,0.56)',
                      border: isActive ? '1px solid rgba(110, 180, 255, 0.20)' : '1px solid transparent',
                      boxShadow: isActive 
                        ? 'inset 0 1.5px 0 rgba(255,255,255,0.10), 0 3px 10px rgba(110, 180, 255, 0.14)' 
                        : 'none',
                      letterSpacing: '0.01em'
                    }}
                    whileHover={!isActive ? {
                      y: -1,
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: 'rgba(255,255,255,0.76)',
                      transition: { duration: 0.12, ease: HORIZON_EASE_OUT }
                    } : {}}
                    whileTap={{ scale: 0.97 }}
                    animate={isActive ? {
                      scale: [1, 1.02, 1],
                      y: 1,
                      transition: { duration: 0.18, ease: HORIZON_REBOUND }
                    } : {}}
                  >
                    {/* Liquid ripple effect */}
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 rounded-[14px]"
                        style={{
                          background: 'radial-gradient(ellipse at 50% 50%, rgba(110, 180, 255, 0.08) 0%, transparent 70%)',
                          pointerEvents: 'none'
                        }}
                        transition={{ duration: 0.22, ease: HORIZON_EASE_OUT }}
                      />
                    )}
                    <mode.icon className="w-4 h-4 relative z-10" strokeWidth={2} />
                    <span className="relative z-10">{mode.label}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Results */}
            <motion.div 
              ref={scrollRef} 
              className="flex-1 overflow-y-auto px-3 py-3"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(255,255,255,0.12) transparent'
              }}
            >
              {query.trim() ? (
                <motion.div 
                  className="space-y-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, ease: HORIZON_EASE_OUT }}
                >
                  {/* Ticker Results */}
                  {searchResults.tickers.length > 0 && (
                    <div>
                      <div 
                        className="flex items-center mb-5 px-4 relative"
                        style={{
                          paddingLeft: '24px'
                        }}
                      >
                        {/* Left anchor line */}
                        <div style={{
                          position: 'absolute',
                          left: '12px',
                          top: '50%',
                          width: '3px',
                          height: '20px',
                          transform: 'translateY(-50%)',
                          background: 'linear-gradient(180deg, rgba(110, 180, 255, 0.32) 0%, transparent 100%)',
                          borderRadius: '2px'
                        }} />
                        
                        <h3 
                          className="text-base font-bold flex items-center"
                          style={{ 
                            color: 'rgba(255,255,255,0.92)',
                            letterSpacing: '0.03em'
                          }}
                        >
                          <TrendingUp className="w-5 h-5 mr-2.5" strokeWidth={2.2} style={{ color: 'rgba(255,255,255,0.72)' }} />
                          Market Data ({searchResults.tickers.length})
                        </h3>
                      </div>
                      <div className="space-y-3 px-2">
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
                      <div 
                        className="flex items-center mb-5 px-4 relative"
                        style={{
                          paddingLeft: '24px'
                        }}
                      >
                        {/* Left anchor line */}
                        <div style={{
                          position: 'absolute',
                          left: '12px',
                          top: '50%',
                          width: '3px',
                          height: '20px',
                          transform: 'translateY(-50%)',
                          background: 'linear-gradient(180deg, rgba(88, 227, 164, 0.32) 0%, transparent 100%)',
                          borderRadius: '2px'
                        }} />
                        
                        <h3 
                          className="text-base font-bold flex items-center"
                          style={{ 
                            color: 'rgba(255,255,255,0.92)',
                            letterSpacing: '0.03em'
                          }}
                        >
                          <Newspaper className="w-5 h-5 mr-2.5" strokeWidth={2.2} style={{ color: 'rgba(255,255,255,0.72)' }} />
                          News ({searchResults.news.length})
                        </h3>
                      </div>
                      <div className="space-y-3.5 px-2">
                        {searchResults.news.map(article => (
                          <NewsResult key={article.id} article={article} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* No Results */}
                  {!isLoading && searchResults.tickers.length === 0 && searchResults.news.length === 0 && (
                    <div className="text-center py-16">
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.22, ease: HORIZON_EASE_OUT }}
                      >
                        <div 
                          className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center"
                          style={{
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255,255,255,0.06)'
                          }}
                        >
                          <Search 
                            className="w-7 h-7" 
                            strokeWidth={1.5}
                            style={{ color: 'rgba(255,255,255,0.38)' }} 
                          />
                        </div>
                        <p 
                          className="text-lg font-semibold mb-2"
                          style={{ color: 'rgba(255,255,255,0.78)' }}
                        >
                          No results found
                        </p>
                        <p 
                          className="text-sm"
                          style={{ color: 'rgba(255,255,255,0.48)' }}
                        >
                          Try a different ticker or keyword
                        </p>
                      </motion.div>
                    </div>
                  )}
                </div>
              ) : (
                <motion.div 
                  className="text-center py-14"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  {/* Frosted Search Icon */}
                  <motion.div
                    className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center relative"
                    style={{
                      background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.025) 100%)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 16px rgba(0,0,0,0.08)'
                    }}
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.4, ease: HORIZON_EASE_OUT }}
                  >
                    {/* Inner glow */}
                    <div style={{
                      position: 'absolute',
                      inset: '6px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(110, 180, 255, 0.06) 0%, transparent 70%)',
                      pointerEvents: 'none'
                    }} />
                    <Search 
                      className="w-10 h-10 relative z-10" 
                      strokeWidth={1.5}
                      style={{ 
                        color: 'rgba(255,255,255,0.58)',
                        filter: 'drop-shadow(0 0 8px rgba(110, 180, 255, 0.16))'
                      }} 
                    />
                  </motion.div>

                  <p 
                    className="text-2xl font-semibold mb-2.5"
                    style={{ color: 'rgba(255,255,255,0.92)' }}
                  >
                    Market Search
                  </p>
                  <p 
                    className="text-sm mb-10"
                    style={{ 
                      color: 'rgba(255,255,255,0.52)',
                      maxWidth: '340px',
                      margin: '0 auto 40px'
                    }}
                  >
                    Search for stock tickers, company data, or market news
                  </p>

                  {/* Action Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-md mx-auto px-4">
                    {[
                      { icon: TrendingUp, label: 'Live Prices', color: 'rgba(110, 180, 255, 0.88)' },
                      { icon: Newspaper, label: 'Market News', color: 'rgba(88, 227, 164, 0.88)' },
                      { icon: Bell, label: 'Set Alerts', color: 'rgba(180, 150, 255, 0.88)' }
                    ].map(({ icon: Icon, label, color }) => (
                      <motion.div 
                        key={label}
                        className="relative rounded-[16px] p-4 overflow-hidden"
                        style={{
                          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.035) 0%, rgba(255, 255, 255, 0.02) 100%)',
                          border: '1px solid rgba(255,255,255,0.06)',
                          boxShadow: `
                            inset 0 1px 0 rgba(255,255,255,0.04),
                            inset 0 -1px 0 rgba(0,0,0,0.02),
                            0 2px 8px rgba(0,0,0,0.06)
                          `
                        }}
                        whileHover={{
                          y: -1,
                          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.045) 0%, rgba(255, 255, 255, 0.028) 100%)',
                          boxShadow: `
                            inset 0 1px 0 rgba(255,255,255,0.06),
                            0 4px 12px rgba(0,0,0,0.08)
                          `,
                          transition: { duration: 0.1, ease: HORIZON_EASE_OUT }
                        }}
                      >
                        {/* Crown glow */}
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: '20%',
                          right: '20%',
                          height: '1px',
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)',
                          pointerEvents: 'none'
                        }} />
                        <Icon 
                          className="w-7 h-7 mx-auto mb-2.5" 
                          strokeWidth={2}
                          style={{ color }} 
                        />
                        <p 
                          className="text-sm font-medium"
                          style={{ color: 'rgba(255,255,255,0.78)' }}
                        >
                          {label}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
            
            {/* Footer with macOS-style keycaps */}
            <div 
              className="px-6 py-3.5 text-xs flex items-center justify-between relative"
              style={{
                borderTop: '1px solid rgba(255,255,255,0.04)'
              }}
            >
              {/* Top glass luminance line */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: '10%',
                right: '10%',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
                pointerEvents: 'none'
              }} />

              <span style={{ color: 'rgba(255,255,255,0.44)', fontSize: '11px', fontWeight: 500 }}>
                Search across market data and news
              </span>
              <div className="flex items-center gap-4">
                <span style={{ color: 'rgba(255,255,255,0.48)', fontSize: '11px' }}>
                  Open{' '}
                  <kbd 
                    className="px-2 py-0.5 text-[10px] font-bold rounded-md inline-flex items-center"
                    style={{
                      background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)',
                      color: 'rgba(255,255,255,0.74)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      boxShadow: `
                        inset 0 0.5px 0 rgba(255,255,255,0.10),
                        inset 0 -1px 0 rgba(0,0,0,0.08),
                        0 1px 2px rgba(0,0,0,0.08)
                      `
                    }}
                  >
                    ⌘K
                  </kbd>
                </span>
                <span style={{ color: 'rgba(255,255,255,0.48)', fontSize: '11px' }}>
                  Close{' '}
                  <kbd 
                    className="px-2 py-0.5 text-[10px] font-bold rounded-md inline-flex items-center"
                    style={{
                      background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)',
                      color: 'rgba(255,255,255,0.74)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      boxShadow: `
                        inset 0 0.5px 0 rgba(255,255,255,0.10),
                        inset 0 -1px 0 rgba(0,0,0,0.08),
                        0 1px 2px rgba(0,0,0,0.08)
                      `
                    }}
                  >
                    Esc
                  </kbd>
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}