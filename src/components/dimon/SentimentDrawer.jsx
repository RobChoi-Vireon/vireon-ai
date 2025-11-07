
import React, { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, TrendingDown, Minus, Activity, BarChart3, Zap, Shield, Globe, Briefcase, ArrowRight, AlertTriangle, ArrowRightCircle } from 'lucide-react';
import RadialGauge from './RadialGauge';

// Memoize the LuxurySection to prevent re-renders
const LuxurySection = React.memo(({ icon: Icon, title, children, iconColor = "#4F46E5", delay = 0 }) => (
  <motion.div 
    className="space-y-6"
    variants={{
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0 }
    }}
    transition={{ 
      delay,
      type: "spring",
      stiffness: 200,
      damping: 20
    }}
  >
    <div className="flex items-center space-x-4">
      <motion.div 
        className="relative p-3 rounded-xl border border-white/20 overflow-hidden"
        style={{ 
          background: `linear-gradient(135deg, ${iconColor}20, ${iconColor}10)`,
          backdropFilter: 'blur(10px)'
        }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <motion.div
          className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300"
          style={{ 
            background: `radial-gradient(circle at center, ${iconColor}30 0%, transparent 70%)`
          }}
        />
        <Icon className="w-5 h-5 relative z-10" style={{ color: iconColor }} strokeWidth={2.5} />
      </motion.div>
      
      <div>
        <h3 className="text-xl font-bold text-white tracking-tight"
           style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
          {title}
        </h3>
        <motion.div 
          className="h-0.5 mt-1 rounded-full"
          style={{ background: `linear-gradient(90deg, ${iconColor} 0%, transparent 100%)` }}
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ delay: delay + 0.2, duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
    {children}
  </motion.div>
));

// Main component wrapped in React.memo
const SentimentDrawer = ({ isOpen, onClose, score, breakdown, onOpenDetail }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          onClose?.();
        }
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  const consensusScore = useMemo(() => (typeof score === 'number' ? score : 0), [score]);
  const segments = useMemo(() => (Array.isArray(breakdown?.segments) ? breakdown.segments : []), [breakdown]);

  const getTrendInfo = (trend, name) => {
    switch (name) {
      case 'Policy': return { Icon: Shield, color: 'text-blue-400' };
      case 'Credit': return { Icon: Briefcase, color: 'text-purple-400' };
      case 'Equities': return { Icon: BarChart3, color: 'text-emerald-400' };
      case 'Global': return { Icon: Globe, color: 'text-orange-400' };
      default: return { Icon: Zap, color: 'text-gray-400' };
    }
  };

  const getStressIcon = (level) => {
      switch(level) {
          case 'high': return <AlertTriangle className="w-4 h-4 text-red-400" />;
          case 'moderate': return <AlertTriangle className="w-4 h-4 text-amber-400" />;
          case 'stable': return <Shield className="w-4 h-4 text-green-400" />;
          default: return null;
      }
  };

  const getTrendIcon = (indicator) => {
      switch(indicator) {
          case 'worsening': return <TrendingDown className="w-4 h-4 text-red-400" />;
          case 'rising': return <TrendingUp className="w-4 h-4 text-amber-400" />;
          case 'stable': return <ArrowRightCircle className="w-4 h-4 text-gray-400" />;
          default: return null;
      }
  };

  // Define getScoreColor here to make it available in the component's scope
  const getScoreColor = (s) => {
    if (s >= 70) return '#34D399'; // Emerald
    if (s >= 40) return '#60A5FA'; // Blue
    return '#F87171'; // Red
  };

  const getSegmentGradient = (name) => {
    switch (name) {
      case 'Policy': return 'from-blue-500/20 to-indigo-500/20';
      case 'Credit': return 'from-purple-500/20 to-violet-500/20';
      case 'Equities': return 'from-emerald-500/20 to-teal-500/20';
      case 'Global': return 'from-orange-500/20 to-amber-500/20';
      default: return 'from-gray-500/20 to-slate-500/20';
    }
  };
  
  if (!isOpen) return null;

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

  const backdropVariants = {
    hidden: { opacity: 0, backdropFilter: 'blur(0px)' },
    visible: { 
      opacity: 1, 
      backdropFilter: 'blur(12px)',
      transition: { duration: 0.4 }
    }
  };

  const drawerVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.9, 
      y: 50,
      rotateX: -15
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      rotateX: 0,
      transition: { 
        type: 'spring', 
        stiffness: 300, 
        damping: 30,
        duration: 0.6
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: 30,
      transition: { duration: 0.25, ease: 'easeIn' }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { type: 'spring', stiffness: 200, damping: 20 }
    },
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        style={{ paddingTop: '80px', willChange: 'opacity' }} // Performance optimization
      >
        <motion.div
          className="absolute left-0 right-0 bottom-0 bg-black/60"
          style={{ top: '80px' }}
          onClick={onClose}
        />

        <motion.div
          className={`
            relative w-full max-w-2xl rounded-3xl overflow-hidden
            border border-indigo-500/30 shadow-2xl
          `}
          style={{
            background: `
              linear-gradient(135deg, rgba(15, 15, 25, 0.95) 0%, rgba(10, 10, 15, 0.98) 100%),
              linear-gradient(135deg, from-indigo-500/20 via-blue-500/10 to-purple-600/20)
            `,
            backdropFilter: 'blur(20px)',
            boxShadow: `
              0 25px 50px -12px rgba(0, 0, 0, 0.8),
              0 0 50px rgba(99, 102, 241, 0.4),
              inset 0 1px 0 rgba(255, 255, 255, 0.1)
            `,
            willChange: 'transform, opacity' // Performance optimization
          }}
          variants={drawerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Animated border glow */}
          <motion.div
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{
              background: `linear-gradient(135deg, rgba(99, 102, 241, 0.4) 0%, transparent 50%, rgba(99, 102, 241, 0.4) 100%)`
            }}
            animate={{ 
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.005, 1]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />

          {/* Header */}
          <motion.div variants={itemVariants} className="relative p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/20 flex items-center justify-center backdrop-blur-xl">
                  <Activity className="w-6 h-6 text-indigo-300" strokeWidth={2} />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-white">
                    Street Alignment
                  </h2>
                  <p className="text-sm text-gray-400 font-medium">
                    Consensus & Segment Breakdown
                  </p>
                </div>
              </div>
              <motion.button
                onClick={onClose}
                className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center group hover:bg-white/20 transition-all duration-200"
                whileHover={{ scale: 1.1, rotate: 90 }}
              >
                <X className="w-5 h-5 text-gray-300 transition-colors" />
              </motion.button>
            </div>
          </motion.div>

          {/* Body */}
          <div className="p-8">
            {/* Top Section: Gauge */}
            <motion.div variants={itemVariants} className="flex flex-col items-center mb-8">
              <RadialGauge score={consensusScore} />
              <p className="mt-4 text-base font-medium text-gray-300">
                Overall Consensus Score
              </p>
            </motion.div>

            {/* Bottom Section: Segments Grid */}
            {segments.length > 0 ? (
              <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {segments.map((segment, index) => {
                  const { Icon, color } = getTrendInfo(segment?.trend, segment?.name);
                  const weight = (segment?.weight || 0) * 100;
                  const gradient = getSegmentGradient(segment?.name);

                  const handleOpenDetail = () => onOpenDetail && onOpenDetail(segment);

                  return (
                    <motion.div
                      key={segment.name} // Use stable key
                      variants={itemVariants}
                      className={`
                        p-5 rounded-2xl border border-white/10 backdrop-blur-lg 
                        transition-all duration-300 hover:border-white/20
                        bg-gradient-to-br ${gradient} shadow-lg cursor-pointer group
                      `}
                      style={{ willChange: 'transform, box-shadow' }}
                      whileHover={{ y: -5, scale: 1.03 }}
                      onClick={handleOpenDetail}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2.5">
                          <Icon className={`w-5 h-5 ${color}`} strokeWidth={2.5} />
                          <span className="text-md font-semibold text-white">
                            {String(segment?.name || 'Unknown')}
                          </span>
                        </div>
                        <span className={`text-xl font-bold ${color}`}>
                          {Math.round(weight)}%
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-300 mb-2 h-10">
                        {String(segment?.note || 'No additional insights.')}
                      </p>

                      <div className="flex items-center justify-start space-x-4 mb-4 h-6">
                          <div className="flex items-center space-x-1.5" title={`Stress Level: ${segment.stress_level}`}>
                            {getStressIcon(segment.stress_level)}
                            <span className="text-xs font-medium text-gray-300 capitalize">{segment.stress_level}</span>
                          </div>
                          <div className="flex items-center space-x-1.5" title={`Trend: ${segment.trend_indicator}`}>
                            {getTrendIcon(segment.trend_indicator)}
                            <span className="text-xs font-medium text-gray-300 capitalize">{segment.trend_indicator}</span>
                          </div>
                      </div>

                      <div className="w-full h-2 bg-black/30 rounded-full overflow-hidden mb-2">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: `linear-gradient(90deg, ${getScoreColor(weight)}99, ${getScoreColor(weight)}ff)` }}
                          initial={{ width: '0%' }}
                          animate={{ width: `${weight}%` }}
                          transition={{ duration: 0.8, delay: 0.4 + index * 0.1, ease: 'easeOut' }}
                        />
                      </div>

                      <div className="flex items-center justify-end text-xs text-gray-400 h-4 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                          <span>View Analysis</span>
                          <ArrowRight className="w-3 h-3 ml-1.5 transform transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div variants={itemVariants} className="text-center py-8">
                <Zap className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-500">No segment data available</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default React.memo(SentimentDrawer);
