
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Brain, TrendingUp, Calendar, ArrowUpRight, BarChart3, AlertTriangle, Target, Clock, Lightbulb, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DetailedInsightModal = ({ insight, onClose, theme }) => {
  if (!insight) return null;

  const getIcon = () => {
    switch (insight.type) {
      case 'macro': return <Brain className="w-7 h-7" strokeWidth={2.5} />;
      case 'sector': return <TrendingUp className="w-7 h-7" strokeWidth={2.5} />;
      case 'events': return <Calendar className="w-7 h-7" strokeWidth={2.5} />;
      default: return <Brain className="w-7 h-7" strokeWidth={2.5} />;
    }
  };

  const getColorScheme = () => {
    // Overriding to use the new AI Insights theme
    return { 
        bg: 'from-indigo-500/[0.12] to-violet-500/[0.12]', 
        border: 'border-violet-500/40', 
        text: 'text-violet-400', 
        accent: 'bg-violet-500/20',
        gradient: 'from-indigo-400/[0.08] via-transparent to-violet-600/[0.04]'
    };
  };

  const colors = getColorScheme();

  // Optimized animation variants for faster performance
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: [0.25, 1, 0.5, 1] 
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9, 
      y: 20,
      transition: { 
        duration: 0.3,
        ease: [0.4, 0, 1, 1]
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        delayChildren: 0.3, 
        staggerChildren: 0.08 
      } 
    },
    exit: { opacity: 0 }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { 
        duration: 0.6,
        ease: [0.25, 1, 0.5, 1]
      } 
    },
    exit: { opacity: 0 }
  };

  // Fast close handler
  const handleClose = () => {
    onClose();
  };

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4" 
      onClick={handleClose}
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div
        className="absolute inset-0 backdrop-blur-xl"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
        variants={backdropVariants}
      />
      
      <motion.div
        onClick={(e) => e.stopPropagation()}
        variants={modalVariants}
        className={`
          relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-4xl border backdrop-blur-2xl shadow-3xl
          bg-gradient-to-br ${colors.bg} ${colors.border}
        `}
        style={{ backdropFilter: 'blur(20px)' }}
      >
        {/* Enhanced ambient background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} pointer-events-none opacity-40`} />
        
        {/* Header - Enhanced for luxury */}
        <div className="sticky top-0 z-10 p-8 md:p-10 border-b border-white/10 backdrop-blur-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <motion.div 
                className={`w-16 h-16 rounded-3xl flex items-center justify-center ${colors.accent} ${colors.border} border backdrop-blur-sm shadow-xl`}
                whileHover={{ scale: 1.1, rotate: 10 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                {getIcon()}
              </motion.div>
              <div>
                <h2 className={`text-3xl md:text-4xl font-black tracking-[-0.02em] text-white`}>
                  {insight.title}
                </h2>
                <p className={`text-base ${colors.text} font-bold mt-2`}>
                  Deep Analysis • Generated {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
            <motion.button
              onClick={handleClose}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white backdrop-blur-sm border border-white/10 hover:border-white/20`}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-6 h-6" strokeWidth={2.5} />
            </motion.button>
          </div>
        </div>

        {/* Content - Enhanced animations and spacing */}
        <motion.div
          className="p-8 md:p-10 space-y-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="flex items-center space-x-4">
              <motion.div 
                className={`w-10 h-10 rounded-2xl flex items-center justify-center ${colors.accent} backdrop-blur-sm`}
                whileHover={{ scale: 1.1 }}
              >
                <Target className="w-5 h-5" strokeWidth={2.5} />
              </motion.div>
              <h3 className={`text-2xl font-black text-white`}>
                Executive Summary
              </h3>
            </div>
            <div className="relative p-6 rounded-3xl backdrop-blur-sm border border-white/10"
                 style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500 rounded-full" />
              <p className={`text-lg leading-relaxed pl-6 font-medium text-gray-200`}>
                {insight.executiveSummary}
              </p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-8">
            <div className="flex items-center space-x-4">
              <motion.div 
                className={`w-10 h-10 rounded-2xl flex items-center justify-center ${colors.accent} backdrop-blur-sm`}
                whileHover={{ scale: 1.1 }}
              >
                <BarChart3 className="w-5 h-5" strokeWidth={2.5} />
              </motion.div>
              <h3 className={`text-2xl font-black text-white`}>
                Key Insights
              </h3>
            </div>
            <div className="grid gap-6">
              {insight.keyInsights?.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className={`group p-6 rounded-3xl border backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] bg-white/[0.03] border-white/10 hover:border-white/20`}
                >
                  <div className="flex items-start space-x-5">
                    <motion.div 
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center ${colors.accent} flex-shrink-0 mt-1`}
                      whileHover={{ scale: 1.1, rotate: 10 }}
                    >
                      <span className={`text-base font-black ${colors.text}`}>{index + 1}</span>
                    </motion.div>
                    <div className="flex-1 space-y-4">
                      <h4 className={`text-xl font-bold text-white`}>
                        {item.title}
                      </h4>
                      <p className={`text-base leading-relaxed text-gray-300`}>
                        {item.description}
                      </p>
                      {item.impact && (
                        <div className="flex items-center space-x-3">
                          <span className={`text-sm font-semibold text-gray-500`}>
                            Market Impact:
                          </span>
                          <motion.span 
                            className={`text-sm font-black px-3 py-1 rounded-full backdrop-blur-sm border ${ 
                              item.impact === 'High' ? 'bg-red-500/20 text-red-300 border-red-500/30' : 
                              item.impact === 'Medium' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' : 
                              'bg-blue-500/20 text-blue-300 border-blue-500/30'
                            }`}
                            whileHover={{ scale: 1.05 }}
                          >
                            {item.impact}
                          </motion.span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {insight.riskFactors?.length > 0 && (
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="flex items-center space-x-4">
                <motion.div 
                  className="w-10 h-10 rounded-2xl flex items-center justify-center bg-red-500/20 backdrop-blur-sm"
                  whileHover={{ scale: 1.1 }}
                >
                  <AlertTriangle className="w-5 h-5 text-red-400" strokeWidth={2.5} />
                </motion.div>
                <h3 className={`text-2xl font-black text-white`}>
                  Risk Factors
                </h3>
              </div>
              <div className="space-y-4">
                {insight.riskFactors.map((risk, index) => (
                  <motion.div 
                    key={index} 
                    className={`flex items-start space-x-4 p-5 rounded-2xl backdrop-blur-sm border bg-red-500/10 border-red-500/20`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-1" strokeWidth={2} />
                    <p className={`text-base leading-relaxed font-medium text-gray-200`}>
                      {risk}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {insight.timeHorizons?.length > 0 && (
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="flex items-center space-x-4">
                <motion.div 
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center ${colors.accent} backdrop-blur-sm`}
                  whileHover={{ scale: 1.1 }}
                >
                  <Clock className="w-5 h-5" strokeWidth={2.5} />
                </motion.div>
                <h3 className={`text-2xl font-black text-white`}>
                  Time Horizons
                </h3>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {insight.timeHorizons.map((horizon, index) => (
                  <motion.div 
                    key={index} 
                    className={`p-6 rounded-3xl text-center border backdrop-blur-sm transition-all duration-300 hover:scale-105 bg-white/[0.03] border-white/10`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15, duration: 0.5 }}
                    whileHover={{ y: -4 }}
                  >
                    <div className={`text-xl font-bold mb-3 ${colors.text}`}>
                      {horizon.period}
                    </div>
                    <p className={`text-base text-gray-300`}>
                      {horizon.outlook}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          <motion.div variants={itemVariants} className={`p-8 rounded-3xl border backdrop-blur-sm bg-gradient-to-r ${colors.bg} ${colors.border}`}>
            <div className="flex items-center space-x-4 mb-6">
              <motion.div 
                className={`w-10 h-10 rounded-2xl flex items-center justify-center ${colors.accent} backdrop-blur-sm`}
                whileHover={{ scale: 1.1, rotate: 10 }}
              >
                <ArrowUpRight className="w-5 h-5" strokeWidth={2.5} />
              </motion.div>
              <h3 className={`text-2xl font-black text-white`}>
                Recommended Actions
              </h3>
            </div>
            <div className="space-y-4">
              {insight.nextSteps?.map((step, index) => (
                <motion.div 
                  key={index} 
                  className={`flex items-start space-x-4 text-base text-gray-200`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                >
                  <motion.div 
                    className={`w-3 h-3 rounded-full ${colors.accent} mt-2 flex-shrink-0`}
                    whileHover={{ scale: 1.5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  />
                  <span className="font-medium leading-relaxed">{step}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Enhanced floating accent elements */}
        <motion.div 
          className="absolute top-20 right-20 w-32 h-32 rounded-full opacity-[0.03] blur-3xl pointer-events-none"
          style={{ 
            background: colors.bg.includes('blue') ? 'linear-gradient(45deg, #3B82F6, #8B5CF6)' :
                        colors.bg.includes('green') ? 'linear-gradient(45deg, #10B981, #3B82F6)' :
                        'linear-gradient(45deg, #8B5CF6, #EC4899)'
          }}
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
            opacity: [0.03, 0.08, 0.03]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default DetailedInsightModal;
