import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Eye, EyeOff } from 'lucide-react';
import ForYouCard from './ForYouCard';

const forYouData = [
  { symbol: 'AMD', price: '$175.60', change: '+2.15%', positive: true, reason: 'Correlated to NVDA' },
  { symbol: 'SMCI', price: '$980.10', change: '+5.80%', positive: true, reason: 'Sector Momentum: AI Hardware' },
  { symbol: 'MU', price: '$95.20', change: '+1.90%', positive: true, reason: 'Sector Momentum: Semis' },
  { symbol: 'DELL', price: '$112.40', change: '+3.10%', positive: true, reason: 'Trending: AI Servers' },
  { symbol: 'PLTR', price: '$25.50', change: '-0.50%', positive: false, reason: 'High Social Volume' },
  { symbol: 'JPM', price: '$185.00', change: '+0.85%', positive: true, reason: 'Analyst Upgrade' },
];

function ForYouCarousel({ isVisible, onToggle }) {
  const [isNewPicksAvailable, setIsNewPicksAvailable] = useState(false);

  useEffect(() => {
    // Simulate new picks refresh every 30 seconds
    const interval = setInterval(() => {
      setIsNewPicksAvailable(true);
      setTimeout(() => setIsNewPicksAvailable(false), 3000);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const ForYouToggle = ({ isVisible, onToggle }) => (
    <motion.div className="relative">
      <motion.button
        onClick={onToggle}
        className={`
          flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200
          ${isVisible 
            ? 'bg-purple-500/20 border border-purple-500/30 text-purple-300 shadow-lg shadow-purple-500/20' 
            : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
          }
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{ rotate: isVisible ? 0 : 180 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </motion.div>
        <span>{isVisible ? 'Hide' : 'Show'} For You</span>
        
        {/* Animated glow when active */}
        <AnimatePresence>
          {isVisible && (
            <motion.div
              className="absolute inset-0 rounded-full bg-purple-500/10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: [0.5, 0.8, 0.5],
                scale: [1, 1.1, 1]
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );

  const HiddenStateButton = ({ onShow }) => (
    <motion.div className="relative group">
      <motion.button
        onClick={onShow}
        className="flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Sparkles className="w-4 h-4 text-purple-400" />
        <span>For You (Hidden)</span>
      </motion.button>
      
      {/* Tooltip */}
      <motion.div
        className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20"
        initial={{ opacity: 0, y: 5 }}
        whileHover={{ opacity: 1, y: 0 }}
      >
        <div 
          className="px-3 py-2 text-xs font-medium text-white rounded-lg border border-white/15 shadow-xl whitespace-nowrap"
          style={{
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.9))',
            backdropFilter: 'blur(20px)'
          }}
        >
          Show AI-powered personalized picks
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="flex items-center space-x-3">
          <motion.div
            animate={isNewPicksAvailable ? {
              scale: [1, 1.1, 1],
              opacity: [0.8, 1, 0.8]
            } : {}}
            transition={{ 
              duration: 2,
              repeat: isNewPicksAvailable ? Infinity : 0,
              ease: "easeInOut"
            }}
          >
            <Sparkles className="w-6 h-6 text-purple-400" />
          </motion.div>
          <h2 className="text-2xl font-bold tracking-[-0.01em] text-white">
            For You
          </h2>
          <motion.span
            className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30"
            animate={isNewPicksAvailable ? {
              boxShadow: [
                '0 0 0 rgba(168, 85, 247, 0)',
                '0 0 20px rgba(168, 85, 247, 0.4)',
                '0 0 0 rgba(168, 85, 247, 0)'
              ]
            } : {}}
            transition={{ 
              duration: 2,
              repeat: isNewPicksAvailable ? Infinity : 0,
              ease: "easeInOut"
            }}
          >
            Labs Feature
          </motion.span>
        </div>
        
        {isVisible 
          ? <ForYouToggle isVisible={isVisible} onToggle={onToggle} />
          : <HiddenStateButton onShow={onToggle} />
        }
      </motion.div>
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            key="foryou-content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0, transition: { duration: 0.2, ease: "easeInOut" } }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {/* Desktop/Tablet: Horizontal scroll layout */}
            <motion.div 
              className="hidden md:flex space-x-5 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-hide"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              {forYouData.map((item, index) => (
                <motion.div
                  key={item.symbol}
                  initial={{ opacity: 0, x: 30, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: 0.2 + index * 0.08,
                    ease: [0.23, 1, 0.32, 1]
                  }}
                >
                  <ForYouCard item={item} />
                </motion.div>
              ))}
            </motion.div>

            {/* Mobile: Horizontal scroll with snap */}
            <motion.div 
              className="md:hidden relative -mx-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div
                className="flex gap-4 overflow-x-auto pb-4 px-6"
                style={{
                  scrollSnapType: 'x mandatory',
                  WebkitOverflowScrolling: 'touch',
                  scrollBehavior: 'smooth'
                }}
              >
                {forYouData.map((item, index) => (
                  <motion.div
                    key={item.symbol}
                    className="flex-shrink-0 w-64"
                    style={{ scrollSnapAlign: 'center' }}
                    initial={{ opacity: 0, x: 30, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ 
                      duration: 0.4, 
                      delay: 0.2 + index * 0.08,
                      ease: [0.23, 1, 0.32, 1]
                    }}
                  >
                    <ForYouCard item={item} />
                  </motion.div>
                ))}
              </div>
              
              {/* Edge fade gradients */}
              <div className="absolute top-0 bottom-0 left-0 w-6 bg-gradient-to-r from-slate-900/80 to-transparent pointer-events-none" />
              <div className="absolute top-0 bottom-0 right-0 w-6 bg-gradient-to-l from-slate-900/80 to-transparent pointer-events-none" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default React.memo(ForYouCarousel);