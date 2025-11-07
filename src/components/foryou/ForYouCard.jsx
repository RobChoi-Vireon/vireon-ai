import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Plus, Bell, GitCompare, Zap } from 'lucide-react';

const FuturisticSparkline = ({ data, positive }) => {
  const sparklineData = data || [42, 45, 44, 47, 49, 48, 52, 50];
  
  const points = sparklineData.map((value, index) => {
    const x = (index / (sparklineData.length - 1)) * 80;
    const y = 24 - ((value - Math.min(...sparklineData)) / (Math.max(...sparklineData) - Math.min(...sparklineData))) * 16;
    return `${x},${y}`;
  }).join(' ');

  const gradientId = `sparkline-gradient-${positive ? 'positive' : 'negative'}-${Math.random()}`;
  const glowId = `sparkline-glow-${positive ? 'positive' : 'negative'}-${Math.random()}`;

  return (
    <div className="absolute inset-0 flex items-center justify-center opacity-20">
      <svg width="80" height="24" className="overflow-visible">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: positive ? '#10B981' : '#EF4444', stopOpacity: 0.6 }} />
            <stop offset="100%" style={{ stopColor: positive ? '#059669' : '#DC2626', stopOpacity: 0.1 }} />
          </linearGradient>
          <filter id={glowId}>
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <motion.polygon
          fill={`url(#${gradientId})`}
          points={`${points} 80,24 0,24`}
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        />

        <motion.polyline
          fill="none"
          stroke={positive ? '#10B981' : '#EF4444'}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
          filter={`url(#${glowId})`}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
        />
      </svg>
    </div>
  );
};

const ReasonTag = ({ reason, isNew = false }) => {
  const [showNewPulse, setShowNewPulse] = useState(isNew);

  useEffect(() => {
    if (isNew) {
      const timer = setTimeout(() => setShowNewPulse(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isNew]);

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <motion.div
        className="px-3 py-1.5 rounded-full text-xs font-medium border backdrop-blur-sm"
        style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(124, 58, 237, 0.25))',
          borderColor: 'rgba(139, 92, 246, 0.3)',
          color: 'rgba(196, 181, 253, 0.9)'
        }}
        animate={showNewPulse ? {
          boxShadow: [
            '0 0 0 rgba(139, 92, 246, 0)',
            '0 0 20px rgba(139, 92, 246, 0.6)',
            '0 0 0 rgba(139, 92, 246, 0)'
          ]
        } : {}}
        transition={{
          duration: 1.5,
          repeat: showNewPulse ? 2 : 0,
          ease: "easeInOut"
        }}
      >
        {reason}
        
        {/* Subtle inner glow */}
        <div 
          className="absolute inset-0 rounded-full opacity-40"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), transparent)'
          }}
        />
      </motion.div>
    </motion.div>
  );
};

const ActionButton = ({ icon: Icon, label, variant = 'default' }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          bg: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.3))',
          border: 'rgba(59, 130, 246, 0.4)',
          text: 'text-blue-300',
          glow: 'rgba(59, 130, 246, 0.5)'
        };
      case 'success':
        return {
          bg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.3))',
          border: 'rgba(16, 185, 129, 0.4)',
          text: 'text-emerald-300',
          glow: 'rgba(16, 185, 129, 0.5)'
        };
      default:
        return {
          bg: 'linear-gradient(135deg, rgba(75, 85, 99, 0.2), rgba(55, 65, 81, 0.3))',
          border: 'rgba(75, 85, 99, 0.4)',
          text: 'text-gray-300',
          glow: 'rgba(75, 85, 99, 0.5)'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <motion.button
      className="relative px-3 py-1.5 rounded-full text-xs font-medium border backdrop-blur-sm transition-all duration-200"
      style={{
        background: styles.bg,
        borderColor: styles.border
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className={`flex items-center space-x-1.5 ${styles.text}`}>
        <Icon className="w-3.5 h-3.5" strokeWidth={2} />
        <span>{label}</span>
      </div>

      {/* Animated glow ring on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute inset-0 rounded-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: [0, 0.8, 0],
              scale: [0.8, 1.2, 1.4]
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              background: `radial-gradient(circle, ${styles.glow} 0%, transparent 70%)`,
              filter: 'blur(4px)'
            }}
          />
        )}
      </AnimatePresence>

      {/* Subtle inner highlight */}
      <div 
        className="absolute inset-0 rounded-full opacity-30"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), transparent)'
        }}
      />
    </motion.button>
  );
};

export default function ForYouCard({ item, index = 0 }) {
  const [isHovered, setIsHovered] = useState(false);
  const [showSparkline, setShowSparkline] = useState(false);
  const isPositive = item.positive;

  useEffect(() => {
    const timer = setTimeout(() => setShowSparkline(true), 800 + index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  const handleRippleEffect = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const ripple = document.createElement('div');
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.1)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 600ms linear';
    ripple.style.pointerEvents = 'none';

    card.appendChild(ripple);
    setTimeout(() => card.removeChild(ripple), 600);
  };

  return (
    <motion.div
      className="group relative flex-shrink-0 w-72 h-64 rounded-3xl cursor-pointer overflow-hidden"
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.05,
        ease: [0.23, 1, 0.32, 1]
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleRippleEffect}
      whileHover={{ 
        y: -8, 
        scale: 1.02,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      whileTap={{ scale: 0.98 }}
      style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
        backdropFilter: 'blur(32px)',
        WebkitBackdropFilter: 'blur(32px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: isHovered 
          ? '0 20px 60px rgba(0, 0, 0, 0.4), 0 8px 32px rgba(0, 0, 0, 0.3)' 
          : '0 8px 32px rgba(0, 0, 0, 0.3), 0 4px 16px rgba(0, 0, 0, 0.2)'
      }}
    >
      {/* Diagonal gradient overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, transparent 50%, rgba(0, 0, 0, 0.1) 100%)'
        }}
      />

      {/* Sparkline background */}
      <AnimatePresence>
        {showSparkline && isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FuturisticSparkline positive={isPositive} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col justify-between h-full p-6">
        {/* Header with Symbol and Tag */}
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <motion.h3 
              className="text-2xl font-black text-white tracking-tight"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              {item.symbol}
            </motion.h3>
          </div>
          
          <ReasonTag reason={item.reason} isNew={index === 0} />
        </div>

        {/* Center - Price with glow effect */}
        <div className="flex-1 flex items-center justify-center relative">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <motion.div 
              className="text-4xl font-bold text-white mb-2"
              animate={isHovered ? {
                textShadow: [
                  '0 0 0 rgba(255, 255, 255, 0)',
                  '0 0 20px rgba(255, 255, 255, 0.3)',
                  '0 0 0 rgba(255, 255, 255, 0)'
                ]
              } : {}}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              {item.price}
            </motion.div>
            
            <motion.div 
              className={`inline-flex items-center space-x-2 text-lg font-semibold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}
              animate={isHovered ? {
                textShadow: [
                  '0 0 0 rgba(16, 185, 129, 0)',
                  `0 0 12px ${isPositive ? 'rgba(16, 185, 129, 0.6)' : 'rgba(239, 68, 68, 0.6)'}`,
                  '0 0 0 rgba(16, 185, 129, 0)'
                ]
              } : {}}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              {isPositive ? 
                <TrendingUp className="w-5 h-5" strokeWidth={2.5} /> : 
                <TrendingDown className="w-5 h-5" strokeWidth={2.5} />
              }
              <span>{item.change}</span>
            </motion.div>
          </motion.div>
        </div>

        {/* Footer - Action Buttons */}
        <motion.div 
          className="flex items-center justify-between space-x-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <ActionButton icon={Plus} label="Add" variant="success" />
          <ActionButton icon={Bell} label="Alert" variant="default" />
          <ActionButton icon={GitCompare} label="Compare" variant="primary" />
        </motion.div>
      </div>

      {/* Hover glow effect */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute inset-0 rounded-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              background: `radial-gradient(circle at center, ${isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'} 0%, transparent 70%)`,
              filter: 'blur(20px)'
            }}
          />
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes ripple {
          to {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </motion.div>
  );
}