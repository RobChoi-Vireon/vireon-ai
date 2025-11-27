import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { TrendingUp, TrendingDown, Triangle, ArrowUpRight, Scale, Calendar, Target, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Clean line icons for sentiment
const SentimentIcons = {
  risk: Triangle,
  opportunity: ArrowUpRight,
  neutral: Scale
};

// Enhanced Audi e-tron confidence bar
const ConfidenceBar = ({ confidence, sentiment, delay = 0 }) => {
  const shouldReduceMotion = useReducedMotion();
  
  const getGradientColors = (sentiment) => {
    switch (sentiment) {
      case 'risk':
        return 'linear-gradient(90deg, #FB923C 0%, #EF4444 100%)';
      case 'opportunity':
        return 'linear-gradient(90deg, #14B8A6 0%, #10B981 100%)';
      default: // for 'neutral' or 'balanced'
        return 'linear-gradient(90deg, #6366F1 0%, #8B5CF6 100%)';
    }
  };

  const getGlowColor = (sentiment) => {
    switch (sentiment) {
      case 'risk': return 'rgba(239, 68, 68, 0.4)';
      case 'opportunity': return 'rgba(16, 185, 129, 0.4)';
      default: return 'rgba(99, 102, 241, 0.4)';
    }
  };

  const confidencePercentage = Math.round((confidence || 0.6) * 100);
  const gradient = getGradientColors(sentiment);
  const glowColor = getGlowColor(sentiment);

  return (
    <div className="w-full space-y-2">
      <div className="h-2 bg-black/30 rounded-full overflow-hidden relative">
        {/* Main confidence fill */}
        <motion.div
          className="h-full rounded-full"
          style={{ background: gradient }}
          initial={{ width: 0 }}
          animate={{ width: `${confidencePercentage}%` }}
          transition={shouldReduceMotion ? 
            { duration: 0.3, delay } : 
            { 
              duration: 1.2, 
              delay, 
              ease: [0.22, 0.61, 0.36, 1]
            }
          }
        />
        
        {/* Audi e-tron sweep effect */}
        {!shouldReduceMotion && (
          <motion.div
            className="absolute top-0 bottom-0 w-8 h-full"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)',
              filter: 'blur(2px)'
            }}
            initial={{ x: '-32px' }}
            animate={{ x: `calc(${confidencePercentage}% + 8px)` }}
            transition={{ 
              duration: 1.2, 
              delay: delay + 0.2, 
              ease: [0.22, 0.61, 0.36, 1] 
            }}
          />
        )}
      </div>
      
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.8 }}
      >
        <span className="text-xs font-medium text-gray-400">
          Confidence: <span style={{ color: sentiment === 'risk' ? '#EF4444' : sentiment === 'opportunity' ? '#10B981' : '#6366F1' }}>{confidencePercentage}%</span>
        </span>
      </motion.div>
    </div>
  );
};

// Hover pop-out drawer for additional signals
const SignalDrawer = ({ signals, sentiment, isVisible }) => {
  if (!signals || signals.length === 0) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="absolute top-full left-0 right-0 mt-2 p-4 rounded-xl border border-white/10 z-20"
          style={{
            background: 'rgba(15, 20, 25, 0.95)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="space-y-2">
            <h5 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
              Additional {sentiment === 'risk' ? 'Risk' : 'Opportunity'} Signals
            </h5>
            {signals.map((signal, index) => (
              <motion.div
                key={index}
                className={`px-3 py-2 rounded-lg text-sm ${
                  sentiment === 'risk' 
                    ? 'bg-red-500/10 text-red-300 border border-red-500/20' 
                    : 'bg-green-500/10 text-green-300 border border-green-500/20'
                }`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {signal}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Premium horizon tile
const HorizonTile = ({ item, index, delay }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);

  // Extract dominant headline and sentiment
  const getDominantMessage = (item) => {
    // Determine which is more impactful
    const riskIntensity = item.risk && item.risk.includes('↑') ? 2 : item.risk ? 1 : 0;
    const opportunityIntensity = item.opportunity && item.opportunity !== 'Neutral' ? 1 : 0;
    
    if (riskIntensity > opportunityIntensity) {
      return {
        headline: item.risk.replace('↑ ', '').replace('↓ ', ''),
        sentiment: 'risk',
        driver: item.opportunity !== 'Neutral' ? item.opportunity : null
      };
    } else if (opportunityIntensity > 0) {
      return {
        headline: item.opportunity,
        sentiment: 'opportunity', 
        driver: item.risk ? item.risk.replace('↑ ', '').replace('↓ ', '') : null
      };
    } else {
      return {
        headline: 'Mixed signals across indicators',
        sentiment: 'neutral',
        driver: null
      };
    }
  };

  // Get additional signals for drawer
  const getAdditionalSignals = (item, dominantSentiment) => {
    const additional = [];
    
    // Add context-based signals
    if (item.horizon === 'Now') {
      additional.push('Policy uncertainty', 'Regulatory headwinds');
    } else if (item.horizon === '3M') {
      if (dominantSentiment === 'risk') {
        additional.push('Credit spread widening', 'Export market stress');
      } else {
        additional.push('Valuation compression opportunities', 'Selective positioning');
      }
    } else if (item.horizon === '12M') {
      additional.push('Input cost deflation', 'Supply chain normalization');
    }
    
    return additional;
  };

  const getHorizonIcon = (horizon) => {
    switch (horizon) {
      case 'Now': return Target;
      case '3M': return Calendar; 
      case '12M': return Clock;
      default: return Target;
    }
  };

  const dominantMessage = getDominantMessage(item);
  const additionalSignals = getAdditionalSignals(item, dominantMessage.sentiment);
  const HorizonIcon = getHorizonIcon(item.horizon);
  const SentimentIcon = SentimentIcons[dominantMessage.sentiment];

  const handleToggleDrawer = () => {
    setShowDrawer(!showDrawer);
  };

  return (
    <motion.div
      className="relative group"
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] } }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div
        className="relative p-6 rounded-2xl cursor-pointer"
        style={{
          background: 'linear-gradient(145deg, rgba(30, 35, 45, 0.8), rgba(20, 25, 35, 0.9))',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
        whileHover={{ 
          y: -4,
          scale: 1.02,
          boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
          borderColor: 'rgba(255, 255, 255, 0.2)'
        }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onClick={handleToggleDrawer}
      >
        {/* Header: Horizon + Icon */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <HorizonIcon className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-bold text-white">{item.horizon}</h3>
          </div>
          <SentimentIcon className={`w-5 h-5 ${
            dominantMessage.sentiment === 'risk' ? 'text-red-400' :
            dominantMessage.sentiment === 'opportunity' ? 'text-green-400' :
            'text-blue-400'
          }`} />
        </div>

        {/* Dominant Headline */}
        <div className="mb-4">
          <h4 className="text-base font-semibold text-gray-100 leading-tight mb-2">
            {dominantMessage.headline}
          </h4>
          
          {/* Supporting Driver */}
          {dominantMessage.driver && (
            <p className="text-sm text-gray-400">
              {dominantMessage.driver}
            </p>
          )}
        </div>

        {/* Confidence Bar */}
        <ConfidenceBar 
          confidence={item.confidence || 0.6}
          sentiment={dominantMessage.sentiment}
          delay={delay + 0.5}
        />

        {/* Additional signals indicator */}
        {additionalSignals.length > 0 && (
          <motion.div
            className="mt-4 text-center"
            animate={{ opacity: isHovered ? 1 : 0.5 }}
          >
            <span className="text-xs text-gray-500 font-medium">
              +{additionalSignals.length} more signals
            </span>
          </motion.div>
        )}
      </motion.div>

      {/* Signal Drawer */}
      <SignalDrawer
        signals={additionalSignals}
        sentiment={dominantMessage.sentiment}
        isVisible={showDrawer}
      />
    </motion.div>
  );
};

// Compact mode row
const CompactRow = ({ item, index, delay }) => {
  const getDominantMessage = (item) => {
    const riskIntensity = item.risk && item.risk.includes('↑') ? 2 : item.risk ? 1 : 0;
    const opportunityIntensity = item.opportunity && item.opportunity !== 'Neutral' ? 1 : 0;
    
    if (riskIntensity > opportunityIntensity) {
      return { headline: item.risk.replace('↑ ', '').replace('↓ ', ''), sentiment: 'risk' };
    } else if (opportunityIntensity > 0) {
      return { headline: item.opportunity, sentiment: 'opportunity' };
    } else {
      return { headline: 'Mixed signals', sentiment: 'neutral' };
    }
  };

  const dominantMessage = getDominantMessage(item);
  const SentimentIcon = SentimentIcons[dominantMessage.sentiment];

  return (
    <motion.div
      className="flex items-center justify-between py-3 px-4 rounded-xl"
      style={{
        background: 'rgba(30, 35, 45, 0.6)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}
      variants={{
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.4, delay: delay + index * 0.1 } }
      }}
    >
      <div className="flex items-center gap-4 flex-1">
        <span className="font-bold text-white text-sm w-8">{item.horizon}</span>
        <SentimentIcon className={`w-4 h-4 ${
          dominantMessage.sentiment === 'risk' ? 'text-red-400' :
          dominantMessage.sentiment === 'opportunity' ? 'text-green-400' :
          'text-blue-400'
        }`} />
        <span className="text-sm text-gray-300 font-medium flex-1">
          {dominantMessage.headline}
        </span>
      </div>
      
      <div className="w-16">
        <ConfidenceBar 
          confidence={item.confidence || 0.6}
          sentiment={dominantMessage.sentiment}
          delay={delay + index * 0.2}
        />
      </div>
    </motion.div>
  );
};

const EvolutionDetailDrawer = ({ data, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!data) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal Content */}
      <motion.div
        className="relative p-6 rounded-2xl border border-white/20 max-w-md w-full mx-4"
        style={{
          background: 'rgba(15, 20, 25, 0.98)',
          backdropFilter: 'blur(24px)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
          maxHeight: '85vh',
          overflowY: 'auto'
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          aria-label="Close"
        >
          ×
        </button>

        <div className="mb-4">
          <h5 className="text-lg font-bold text-white mb-2">{data.label}</h5>
          <h6 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Context</h6>
          <p className="text-sm text-gray-300 leading-relaxed">{data.context}</p>
        </div>
        
        <div className="grid grid-cols-1 gap-4 mb-4">
          <div>
            <h6 className="text-xs font-semibold text-red-400 mb-2">Risks</h6>
            <div className="space-y-1">
              {data.risks.map((risk, i) => (
                <div key={i} className="text-sm text-red-300 bg-red-500/10 px-2 py-1 rounded border border-red-500/20">{risk}</div>
              ))}
            </div>
          </div>
          <div>
            <h6 className="text-xs font-semibold text-green-400 mb-2">Opportunities</h6>
            <div className="space-y-1">
              {data.opportunities.map((opp, i) => (
                <div key={i} className="text-sm text-green-300 bg-green-500/10 px-2 py-1 rounded border border-green-500/20">{opp}</div>
              ))}
            </div>
          </div>
        </div>
        
        <div>
          <h6 className="text-xs font-semibold text-gray-400 mb-2">Signals</h6>
          <div className="flex flex-wrap gap-1">
            {data.signals.map((signal, i) => (
              <span key={i} className="text-xs text-gray-400 bg-gray-500/10 px-2 py-1 rounded border border-gray-500/20">{signal}</span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};


// Premium horizontal timeline strip with strategist insights
const TimelineEvolution = ({ trajectory }) => {
  const [expandedData, setExpandedData] = useState(null); // Changed state from expandedHorizon to expandedData
  const shouldReduceMotion = useReducedMotion();

  const evolutionData = {
    'Now': {
      label: 'Now',
      summary: 'Compliance drag dominates.',
      confidence: 0.80,
      sentiment: 'risk',
      risks: ['Compliance costs', 'Policy uncertainty', 'Tech drag'],
      opportunities: ['Defensive stance', 'Quality premium'],
      signals: ['AI rules live', 'Tech oversight up', 'Bank capital debate'],
      context: 'EU tech rules add 15% to R&D. AI compliance requires new teams and infrastructure.'
    },
    '3M': {
      label: '3M',
      summary: 'EM credit stress rising; selective M&A emerging.',
      confidence: 0.65,
      sentiment: 'balanced', // Using 'balanced' maps to 'default' color
      risks: ['EM spreads widening', 'Funding costs up', 'Export stress'],
      opportunities: ['Selective M&A', 'Valuation entry', 'Sector rotation'],
      signals: ['HY +35bps', 'Industrial M&A', 'Credit strain'],
      context: 'EM HY stress rising. Creates selective entry points for positioned buyers.'
    },
    '12M': {
      label: '12M',
      summary: 'Demand uncertain; input costs falling.',
      confidence: 0.55,
      sentiment: 'opportunity',
      risks: ['Demand weak', 'China drag', 'Export fade'],
      opportunities: ['Input costs down', 'Supply chain gains', 'Margin expansion'],
      signals: ['China soft', 'Commodity drop', 'Cost relief'],
      context: 'China slowdown cuts input costs. Steel, aluminum down 12-18% YoY — margin tailwind for U.S. industrials.'
    }
  };

  const horizonOrder = ['Now', '3M', '12M'];

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.7) return '#F59E0B'; // Gold
    if (confidence >= 0.5) return '#EAB308'; // Yellow
    return '#6B7280'; // Grey
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'risk': return '#EF4444';
      case 'opportunity': return '#10B981';
      default: return '#6366F1'; // For 'balanced' or any other
    }
  };

  const handleHorizonClick = (horizon) => {
    setExpandedData(evolutionData[horizon]); // Set the data object for the drawer
  };

  return (
    <motion.div
      className="mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }} // Fixed: Reduced delay from 1.5s to 0.2s
    >
      <h4 className="text-sm font-semibold text-gray-300 mb-6">Trajectory</h4>
      
      {/* Fixed: Added proper overflow handling and positioning context */}
      <div className="relative overflow-visible">
        <div className="flex items-start justify-between gap-4 relative">
          {horizonOrder.map((horizon, index) => {
            const data = evolutionData[horizon];
            const isLast = index === horizonOrder.length - 1;
            
            return (
              <React.Fragment key={horizon}>
                {/* Fixed: Improved positioning and overflow for tiles */}
                <motion.div
                  layoutId={`evolution-tile-${horizon}`} // Added layoutId for potential shared layout animations if needed
                  className="relative flex-1 cursor-pointer group"
                  // Removed dynamic z-index as modal is now global
                  whileHover={{ scale: shouldReduceMotion ? 1 : 1.02 }}
                  whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
                  onClick={() => handleHorizonClick(horizon)}
                >
                  <div
                    className={`
                      p-4 rounded-xl border transition-all duration-300 relative
                      border-white/10 bg-white/2 group-hover:border-white/20
                    `}
                    style={{
                      backdropFilter: 'blur(12px)'
                    }}
                  >
                    {/* Horizon Label */}
                    <h5 className="text-sm font-bold text-white mb-2">
                      {data.label}
                    </h5>
                    
                    {/* Strategist Summary */}
                    <p className="text-xs text-gray-300 leading-relaxed mb-3 min-h-[2.5rem]">
                      {data.summary}
                    </p>
                    
                    {/* Confidence Bar */}
                    <div className="space-y-2">
                      <div className="h-1 bg-black/30 rounded-full overflow-hidden relative">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ 
                            background: `linear-gradient(90deg, ${getSentimentColor(data.sentiment)}80, ${getSentimentColor(data.sentiment)})`
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: `${data.confidence * 100}%` }}
                          transition={shouldReduceMotion ? 
                            { duration: 0.3, delay: 0.3 + index * 0.1 } : // Fixed: Reduced delays
                            { 
                              duration: 0.8, // Fixed: Faster animation
                              delay: 0.3 + index * 0.1, // Fixed: Much shorter delay
                              ease: [0.22, 0.61, 0.36, 1] 
                            }
                          }
                        />
                        
                        {/* Audi e-tron sweep effect, respects reduced motion */}
                        {!shouldReduceMotion && (
                          <motion.div
                            className="absolute top-0 bottom-0 w-4 h-full"
                            style={{
                              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)',
                              filter: 'blur(1px)'
                            }}
                            initial={{ x: '-16px' }}
                            animate={{ x: `calc(${data.confidence * 100}% + 4px)` }}
                            transition={{ 
                              duration: 0.8, // Fixed: Faster sweep
                              delay: 0.4 + index * 0.1, // Fixed: Much shorter delay
                              ease: [0.22, 0.61, 0.36, 1] 
                            }}
                          />
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium" style={{ color: getConfidenceColor(data.confidence) }}>
                          {Math.round(data.confidence * 100)}% confidence
                        </span>
                        <span className="text-xs text-gray-500">
                          {data.sentiment === 'risk' ? 'Risk-weighted' : data.sentiment === 'opportunity' ? 'Opportunity-weighted' : 'Balanced'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Removed the in-place drawer from here */}
                </motion.div>
                
                {/* Animated Arrow Connector */}
                {!isLast && (
                  <motion.div 
                    className="flex items-center justify-center flex-shrink-0 pt-8" // Kept pt-8 for consistent vertical alignment below the card content.
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }} // Fixed: Much faster
                  >
                    <div className="relative">
                      <ArrowRight className="w-4 h-4 text-gray-500" />
                      {!shouldReduceMotion && (
                        <motion.div
                          className="absolute inset-0 w-4 h-4"
                          animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 0.8, 0.5] 
                          }}
                          transition={{ 
                            duration: 2, 
                            repeat: Infinity, 
                            ease: "easeInOut",
                            delay: 1 + index * 0.2 // Fixed: Reduced delay
                          }}
                        >
                          <ArrowRight className="w-4 h-4 text-blue-400" />
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
      
      {/* Drawer is now rendered here, outside the flow */}
      <AnimatePresence>
        {expandedData && (
          <EvolutionDetailDrawer data={expandedData} onClose={() => setExpandedData(null)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function StrategicTrajectory({ trajectory = [], density }) {
  const [viewMode, setViewMode] = useState('expanded'); // 'expanded' or 'compact'
  const [isExpanded, setIsExpanded] = useState(false);

  const spacingClass = density === 'compact' ? 'p-4' : density === 'spacious' ? 'p-8' : 'p-6';

  if (!trajectory || trajectory.length === 0) {
    return null;
  }

  const toggleViewMode = () => {
    setViewMode(viewMode === 'expanded' ? 'compact' : 'expanded');
  };

  return (
    <motion.section
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      className={`rounded-2xl ${spacingClass} backdrop-filter backdrop-blur-16 border border-white/10 overflow-visible`} // Fixed: Added overflow-visible
      style={{ 
        background: 'linear-gradient(145deg, rgba(15, 20, 30, 0.8), rgba(10, 15, 25, 0.9))'
      }}
      aria-labelledby="strategic-trajectory-heading"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="p-2 rounded-lg mr-3" style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 id="strategic-trajectory-heading" className="text-lg font-semibold text-white">
              Strategic Trajectory
            </h2>
            <p className="text-sm text-gray-400">
              Risk/opportunity across time.
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 py-1.5 text-sm font-medium rounded-full border border-white/20 bg-white/5 hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isExpanded ? 'Hide Evolution' : 'Show Evolution'}
          </motion.button>
          
          <motion.button
            onClick={toggleViewMode}
            className="px-3 py-1.5 text-sm font-medium rounded-full border border-white/20 bg-white/5 hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {viewMode === 'expanded' ? 'Compact View' : 'Expanded View'}
          </motion.button>
        </div>
      </div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {viewMode === 'expanded' ? (
          <motion.div
            key="expanded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              variants={{
                hidden: { opacity: 0 },
                visible: { 
                  opacity: 1,
                  transition: { staggerChildren: 0.1 } // Fixed: Faster staggering
                }
              }}
              initial="hidden"
              animate="visible"
            >
              {trajectory.map((item, index) => (
                <HorizonTile
                  key={item.horizon}
                  item={item}
                  index={index}
                  delay={index * 0.1} // Fixed: Much shorter delay
                />
              ))}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="compact"
            variants={{
              hidden: { opacity: 0 },
              visible: { 
                opacity: 1,
                transition: { staggerChildren: 0.05 } // Fixed: Even faster for compact
              }
            }}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {trajectory.map((item, index) => (
              <CompactRow
                key={item.horizon}
                item={item}
                index={index}
                delay={0.05} // Fixed: Very short delay
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timeline Evolution */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            layout 
            transition={{ duration: 0.2, ease: [0.22, 0.61, 0.36, 1] }} // Fixed: Faster layout transition
          >
            <TimelineEvolution trajectory={trajectory} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}