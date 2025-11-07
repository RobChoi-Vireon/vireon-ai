
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, ChevronUp, TrendingUp, TrendingDown, Zap, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const mockCommentaryData = [
  {
    id: 1,
    timestamp: new Date(Date.now() - 300000), // 5 min ago
    type: 'market_move',
    title: 'NVDA breaks $900',
    content: 'Strong volume surge on AI chip demand speculation ahead of GTC conference.',
    signal: 'high',
    sentiment: 'bullish'
  },
  {
    id: 2,
    timestamp: new Date(Date.now() - 900000), // 15 min ago
    type: 'macro',
    title: '10Y yield touches 4.4%',
    content: 'Bond selloff accelerates as hot CPI data shifts Fed expectations.',
    signal: 'high',
    sentiment: 'bearish'
  },
  {
    id: 3,
    timestamp: new Date(Date.now() - 1800000), // 30 min ago
    type: 'sector',
    title: 'Tech sector rotation',
    content: 'Money flowing from mega-caps into smaller AI plays. SMCI, AMD gaining.',
    signal: 'medium',
    sentiment: 'neutral'
  },
  {
    id: 4,
    timestamp: new Date(Date.now() - 2700000), // 45 min ago
    type: 'earnings',
    title: 'Earnings whispers',
    content: 'AAPL guidance expectations building ahead of Thursday report.',
    signal: 'medium',
    sentiment: 'bullish'
  },
  {
    id: 5,
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    type: 'alert',
    title: 'VIX spike alert',
    content: 'Volatility index jumps 15% in past hour on macro uncertainty.',
    signal: 'high',
    sentiment: 'bearish'
  }
];

const CommentaryItem = ({ item, theme }) => {
  const getTypeIcon = (type) => {
    switch (type) {
      case 'market_move': return <TrendingUp className="w-4 h-4" />;
      case 'macro': return <Zap className="w-4 h-4" />;
      case 'earnings': return <TrendingUp className="w-4 h-4" />;
      case 'alert': return <TrendingDown className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getSignalColor = (signal, sentiment) => {
    if (signal === 'high') {
      return sentiment === 'bullish' ? 'text-green-400' : sentiment === 'bearish' ? 'text-red-400' : 'text-orange-400';
    }
    return theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`
        p-4 rounded-xl border-l-2 transition-all duration-200 hover:scale-[1.02]
        ${theme === 'dark' 
          ? 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06]' 
          : 'bg-black/[0.02] border-black/5 hover:bg-black/[0.04]'
        }
        ${item.signal === 'high' && item.sentiment === 'bullish' && 'border-l-green-400'}
        ${item.signal === 'high' && item.sentiment === 'bearish' && 'border-l-red-400'}
        ${item.signal === 'high' && item.sentiment === 'neutral' && 'border-l-orange-400'}
        ${item.signal === 'medium' && 'border-l-blue-400'}
      `}
    >
      <div className="flex items-start justify-between mb-2">
        <div className={`flex items-center space-x-2 ${getSignalColor(item.signal, item.sentiment)}`}>
          {getTypeIcon(item.type)}
          <span className="text-sm font-semibold">{item.title}</span>
        </div>
        <div className="flex items-center space-x-1 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          <span>{formatDistanceToNow(item.timestamp, { addSuffix: true })}</span>
        </div>
      </div>
      <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
        {item.content}
      </p>
    </motion.div>
  );
};

export default function LiveCommentary({ isOpen, onClose, theme }) {
  const [commentary, setCommentary] = useState(mockCommentaryData);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  // Pinch-to-close gesture state
  const [initialPinchDistance, setInitialPinchDistance] = useState(null);
  const [isPinching, setIsPinching] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Pinch-to-close gesture handler for mobile
  useEffect(() => {
    if (!isOpen || isDesktop) return;

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
        
        if (pinchRatio < 0.8) {
          if (navigator.vibrate) {
            navigator.vibrate([25, 50, 25]);
          }
          onClose();
          setIsPinching(false);
          setInitialPinchDistance(null);
        }
      }
    };

    const handleTouchEnd = (e) => {
      if (e.touches.length < 2) { // Less than 2 touches means one or both fingers lifted
        setIsPinching(false);
        setInitialPinchDistance(null);
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isOpen, isDesktop, isPinching, initialPinchDistance, onClose]);

  // Desktop: Right Panel
  if (isDesktop) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`
              fixed top-0 right-0 h-full w-80 z-40
              ${theme === 'dark' 
                ? 'bg-gradient-to-b from-[#12141C]/95 to-[#0F1117]/95 border-l border-white/10' 
                : 'bg-gradient-to-b from-white/95 to-gray-50/95 border-l border-black/10'
              }
              backdrop-blur-xl shadow-2xl
            `}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  ${theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100'}
                `}>
                  <MessageSquare className={`w-4 h-4 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
                <div>
                  <h2 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Live Commentary
                  </h2>
                  <div className="flex items-center space-x-2 text-xs">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                      {commentary.length} signals
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-xl transition-colors ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}
              >
                <X className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
              </button>
            </div>

            {/* Commentary Feed */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {commentary.map((item) => (
                <CommentaryItem key={item.id} item={item} theme={theme} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Mobile: Bottom Sheet
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-40 ${theme === 'dark' ? 'bg-black/40' : 'bg-black/20'} backdrop-blur-sm`}
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`
              fixed bottom-0 left-0 right-0 z-50 h-[70vh] rounded-t-3xl
              ${theme === 'dark' 
                ? 'bg-gradient-to-t from-[#12141C] to-[#0F1117]' 
                : 'bg-gradient-to-t from-white to-gray-50'
              }
              shadow-2xl
            `}
            style={{ 
              transform: isPinching && initialPinchDistance ? 'scale(0.95)' : 'scale(1)',
              transition: 'transform 0.1s ease-out',
              touchAction: 'none' // Disables default browser touch actions like pan and zoom
            }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-4 pb-2 relative"> {/* Added relative for absolute positioning */}
              <div className={`w-12 h-1.5 rounded-full ${theme === 'dark' ? 'bg-white/20' : 'bg-gray-300'}`} />
              {/* Pinch gesture hint */}
              <div className="absolute top-4 right-4 text-xs text-gray-500">
                👌 Pinch to close
              </div>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <MessageSquare className={`w-5 h-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Live Commentary
                </h2>
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-xl ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}
              >
                <ChevronUp className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
              </button>
            </div>

            {/* Commentary Feed */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {commentary.map((item) => (
                <CommentaryItem key={item.id} item={item} theme={theme} />
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
