import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, TrendingDown, Minus, Calendar, ShieldAlert, Newspaper, Zap, Info } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const sentimentStyles = {
  Bullish: { 
    icon: <TrendingUp className="w-4 h-4 text-emerald-400" />, 
    text: 'text-emerald-400',
    gradient: 'from-emerald-500/20 to-green-500/20',
    glow: 'shadow-emerald-500/25'
  },
  Bearish: { 
    icon: <TrendingDown className="w-4 h-4 text-red-400" />, 
    text: 'text-red-400',
    gradient: 'from-red-500/20 to-orange-500/20',
    glow: 'shadow-red-500/25'
  },
  Neutral: { 
    icon: <Minus className="w-4 h-4 text-slate-400" />, 
    text: 'text-slate-400',
    gradient: 'from-slate-500/20 to-gray-500/20',
    glow: 'shadow-slate-500/25'
  },
};

// Compact Info Section
const CompactInfoSection = ({ icon: Icon, title, content, colorClass, gradient }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className="relative"
  >
    <div className={`p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl`}>
      <div className={`flex items-center space-x-3 mb-3 ${colorClass}`}>
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${gradient} border border-white/20`}>
          <Icon className="w-4 h-4" strokeWidth={2.5} />
        </div>
        <h3 className="text-sm font-bold tracking-wide uppercase">{title}</h3>
      </div>
      <p className="text-sm leading-relaxed text-gray-300 pl-11">
        {content}
      </p>
    </div>
  </motion.div>
);

export default function HeadlinesModal({ stock, isOpen, onClose, theme }) {
  if (!stock || !stock.headlines) return null;

  const { marketMoving, catalyst, riskNote, source, timestamp, sentiment } = stock.headlines;
  const sentimentStyle = sentimentStyles[sentiment] || sentimentStyles.Neutral;

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            transition={{ duration: 0.3 }}
          />

          {/* Compact Modal Container */}
          <motion.div
            className={`
              relative z-10 w-full max-w-2xl rounded-3xl overflow-hidden
              ${theme === 'dark' 
                ? 'bg-gradient-to-br from-[#1A1D29]/95 via-[#12141C]/95 to-[#0F1115]/95' 
                : 'bg-gradient-to-br from-white/95 via-white/90 to-gray-50/95'
              }
              backdrop-blur-3xl shadow-2xl border border-white/20
            `}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ 
              duration: 0.4, 
              ease: [0.25, 1, 0.5, 1],
              type: "spring",
              stiffness: 300,
              damping: 25
            }}
          >
            {/* Animated Background Orb */}
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20">
              <motion.div
                className={`w-full h-full rounded-full bg-gradient-to-br ${sentimentStyle.gradient}`}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
            
            {/* Header */}
            <div className="relative p-6 border-b border-white/10">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <motion.div 
                    className="flex items-center space-x-4 mb-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    {/* Company Icon */}
                    <motion.div 
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${sentimentStyle.gradient} border border-white/20 flex items-center justify-center backdrop-blur-xl shadow-xl`}
                      whileHover={{ scale: 1.05, rotate: 2 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <span className="text-lg font-black text-white">{stock.symbol.charAt(0)}</span>
                    </motion.div>
                    
                    <div>
                      <h1 className={`text-2xl font-black tracking-[-0.02em] ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {stock.symbol} Intelligence
                      </h1>
                      <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {stock.name}
                      </p>
                    </div>
                  </motion.div>
                  
                  {/* Metadata */}
                  <motion.div 
                    className={`flex items-center flex-wrap gap-4 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <motion.div 
                      className={`flex items-center space-x-2 px-3 py-1.5 rounded-full ${sentimentStyle.gradient} border border-white/20`}
                      whileHover={{ scale: 1.05 }}
                    >
                      {sentimentStyle.icon}
                      <span className={`font-bold ${sentimentStyle.text}`}>{sentiment}</span>
                    </motion.div>
                    
                    <div className="flex items-center space-x-1.5">
                      <Info className="w-3 h-3" />
                      <span className="font-semibold">{source}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1.5">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDistanceToNow(new Date(timestamp), { addSuffix: true })}</span>
                    </div>
                    
                    <motion.div 
                      className="flex items-center space-x-1.5 px-2 py-1 rounded-full bg-white/5 border border-white/10"
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                      <span className="text-xs font-bold uppercase tracking-wider">Live</span>
                    </motion.div>
                  </motion.div>
                </div>
                
                {/* Close Button */}
                <motion.button
                  onClick={onClose}
                  className={`
                    p-3 rounded-xl transition-all duration-200 group
                    ${theme === 'dark' 
                      ? 'hover:bg-white/10 text-gray-400 hover:text-white' 
                      : 'hover:bg-black/5 text-gray-500 hover:text-gray-700'
                    }
                    backdrop-blur-sm border border-white/10 hover:border-white/30
                  `}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <X className="w-5 h-5" strokeWidth={2} />
                </motion.button>
              </div>
            </div>

            {/* Compact Content Grid - No Scrolling */}
            <div className="p-6 space-y-4">
              <CompactInfoSection
                icon={Newspaper}
                title="Market Headlines"
                content={marketMoving}
                colorClass="text-blue-400"
                gradient="from-blue-500/20 to-cyan-500/20"
              />
              
              <CompactInfoSection
                icon={Zap}
                title="Key Catalysts"
                content={catalyst}
                colorClass="text-purple-400"
                gradient="from-purple-500/20 to-pink-500/20"
              />
              
              <CompactInfoSection
                icon={ShieldAlert}
                title="Risk Factors"
                content={riskNote}
                colorClass="text-amber-400"
                gradient="from-amber-500/20 to-orange-500/20"
              />
            </div>
            
            {/* Footer */}
            <div className={`
              border-t border-white/10 px-6 py-4 backdrop-blur-xl
              ${theme === 'dark' ? 'bg-white/[0.02]' : 'bg-black/[0.01]'}
            `}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1.5">
                    <kbd className="px-2 py-1 text-xs font-semibold rounded bg-white/10 border border-white/20">Esc</kbd>
                    <span>Close</span>
                  </div>
                </div>
                
                <motion.div 
                  className="text-xs font-semibold text-gray-400"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  AI Intelligence
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}