import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Shield, Calendar, Compass, ArrowRight, ExternalLink, ChevronDown, Eye, BarChart3, Activity, Zap, X, TrendingUp } from 'lucide-react';

// Connected Signals Tooltip Component
const SignalTooltip = ({ signal, isVisible, position }) => (
  <AnimatePresence>
    {isVisible && (
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.9 }}
        className="absolute z-50 pointer-events-none"
        style={{ 
          left: position.x - 100, 
          top: position.y - 80 
        }}
      >
        <div 
          className="p-3 rounded-xl border backdrop-blur-xl shadow-2xl min-w-[200px]"
          style={{
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.9))',
            borderColor: 'rgba(139, 92, 246, 0.3)'
          }}
        >
          <h4 className="text-sm font-bold text-white mb-1">{signal}</h4>
          <p className="text-xs text-gray-300">Click to view detailed analysis</p>
          <div className="flex items-center gap-2 mt-2 text-xs text-violet-300">
            <TrendingUp className="w-3 h-3" />
            <span>Live market data</span>
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

// Right-Side Drawer for Connected Signals
const SignalDrawer = ({ isOpen, onClose, signal }) => {
  // Keyboard navigation
  React.useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />
        
        {/* Drawer */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="fixed top-0 right-0 h-full w-full max-w-md z-50"
          role="dialog"
          aria-label="Signal details"
          aria-modal="true"
          style={{
            background: 'linear-gradient(145deg, rgba(15, 15, 30, 0.95), rgba(25, 25, 45, 0.9))',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(139, 92, 246, 0.2)'
          }}
        >
          <div className="p-6 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">{signal}</h3>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Close signal details"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            {/* Content */}
            <div className="flex-1 space-y-6" role="region" aria-label={`${signal} live data`}>
              <div className="p-4 rounded-xl bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border border-violet-500/20">
                <h4 className="text-sm font-bold text-violet-300 mb-2">Live Analysis</h4>
                <p className="text-sm text-gray-200">
                  Real-time market data and AI-powered insights for {signal}. 
                  This would contain detailed charts, metrics, and analysis.
                </p>
              </div>
              
              {/* Mock Chart Area */}
              <div className="h-48 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-white/10 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-sm">Interactive Chart</p>
                  <p className="text-xs">Would show live {signal} data</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
  );
};

const PlaybookCard = ({ item, index, compactView }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredSignal, setHoveredSignal] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [selectedSignal, setSelectedSignal] = useState(null);
  const cardRef = useRef(null);
  
  // Cursor tracking for subtle gradient effect - REFINED INTENSITY
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Dramatically reduced tilt angles (70-80% reduction) - capped at 1.5 degrees
  const rotateX = useTransform(y, [-100, 100], [1.5, -1.5]);
  const rotateY = useTransform(x, [-100, 100], [-1.5, 1.5]);
  
  // Subtle shadow shift synchronized with tilt for depth realism
  const shadowX = useTransform(x, [-100, 100], [-2, 2]);
  const shadowY = useTransform(y, [-100, 100], [-2, 2]);
  const shadowBlur = useTransform([x, y], ([latestX, latestY]) => {
    const distance = Math.sqrt(latestX * latestX + latestY * latestY);
    return Math.min(15 + distance / 10, 25); // Subtle blur increase with movement
  });

  const handleMouseMove = (event) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Reduced sensitivity for more subtle effect
    x.set((event.clientX - centerX) / 8); // Reduced from /5 to /8
    y.set((event.clientY - centerY) / 8); // Reduced from /5 to /8
  };

  const handleSignalHover = (signal, event) => {
    setHoveredSignal(signal);
    setTooltipPosition({ x: event.clientX, y: event.clientY });
  };

  // Live VIX animation for Hedging card
  const [vixValue, setVixValue] = useState(18.5);
  React.useEffect(() => {
    if (item.title === "Hedging") {
      const interval = setInterval(() => {
        setVixValue(prev => prev + (Math.random() - 0.5) * 0.2);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [item.title]);

  return (
    <>
      <motion.div
        ref={cardRef}
        className="relative group overflow-hidden cursor-pointer"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          delay: index * 0.15, 
          duration: 0.8, 
          ease: [0.23, 1, 0.32, 1],
          type: "spring",
          stiffness: 100,
          damping: 15
        }}
        whileHover={{ 
          y: -12, 
          scale: 1.02,
          transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] }
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setHoveredSignal(null);
          // Smooth return to neutral position with luxury easing
          x.set(0);
          y.set(0);
        }}
        style={{
          perspective: 1200,
          transformStyle: "preserve-3d"
        }}
      >
        {/* Ultra-Luxury Glassmorphic Card with Refined Motion */}
        <motion.div
          className="relative rounded-3xl overflow-hidden backdrop-blur-3xl border shadow-2xl"
          style={{
            background: 'linear-gradient(145deg, rgba(15, 15, 30, 0.8), rgba(25, 25, 45, 0.6))',
            borderColor: isHovered ? 'rgba(139, 92, 246, 0.4)' : 'rgba(255, 255, 255, 0.1)',
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
            // Smooth transitions for luxurious feel
            transition: 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)'
          }}
          animate={{
            boxShadow: isHovered 
              ? [
                  '0 25px 80px rgba(139, 92, 246, 0.3), 0 0 0 1px rgba(139, 92, 246, 0.2)',
                  // Dynamic shadow that shifts with tilt
                  `${shadowX.get()}px ${shadowY.get() + 25}px ${shadowBlur.get()}px rgba(139, 92, 246, 0.3), 0 0 0 1px rgba(139, 92, 246, 0.2)`
                ]
              : [
                  '0 10px 40px rgba(0, 0, 0, 0.3)',
                  `${shadowX.get()}px ${shadowY.get() + 10}px ${Math.max(shadowBlur.get() - 10, 15)}px rgba(0, 0, 0, 0.3)`
                ]
          }}
          transition={{ 
            duration: 0.6,
            ease: [0.23, 1, 0.32, 1]
          }}
        >
          {/* Animated Gradient Background for Tactical View */}
          {item.title === "Tactical View" && (
            <motion.div
              className="absolute inset-0 opacity-20"
              style={{
                background: 'linear-gradient(45deg, rgba(124, 58, 237, 0.3), rgba(59, 130, 246, 0.2), rgba(16, 185, 129, 0.3))',
                backgroundSize: '400% 400%'
              }}
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}

          {/* Hover Gradient Overlay */}
          <motion.div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100"
            style={{
              background: 'radial-gradient(circle at center, rgba(139, 92, 246, 0.08) 0%, transparent 70%)',
              transition: 'opacity 0.5s cubic-bezier(0.23, 1, 0.32, 1)'
            }}
          />

          {/* Card Content - Crystal Clear Text */}
          <div className={`relative z-10 ${compactView ? 'p-6' : 'p-6 md:p-8'}`}>
            {/* Primary Insight Header */}
            <div className={`${compactView ? 'mb-4' : 'mb-6'}`}>
              <div className="flex items-center space-x-4 mb-4">
                {/* Enhanced Icon with Glow */}
                <motion.div 
                  className={`flex items-center justify-center border backdrop-blur-xl shadow-xl relative ${compactView ? 'w-12 h-12 rounded-xl' : 'w-12 h-12 md:w-16 md:h-16 rounded-2xl'}`}
                  style={{
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2))',
                    borderColor: 'rgba(139, 92, 246, 0.3)'
                  }}
                  whileHover={{ 
                    scale: 1.1, 
                    rotate: isHovered ? [0, -5, 5, 0] : 0,
                    boxShadow: '0 0 30px rgba(139, 92, 246, 0.4)'
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  <item.icon className={`text-violet-300 ${compactView ? 'w-6 h-6' : 'w-6 h-6 md:w-8 md:h-8'}`} strokeWidth={2} />
                  
                  {/* Glow Pulse */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)',
                      filter: 'blur(8px)'
                    }}
                    animate={isHovered ? {
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.8, 0.5]
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
                
                <div className="flex-1">
                  {/* Card Title with Gradient Accent - Crystal Clear Typography */}
                  <motion.h3 
                    className={`font-black tracking-tight mb-2 text-white ${compactView ? 'text-lg' : 'text-xl md:text-2xl'}`}
                    style={{ 
                      textShadow: '0 2px 4px rgba(0,0,0,0.3)', // Ensure text clarity over motion
                      backfaceVisibility: 'hidden' // Prevent text distortion during transforms
                    }}
                  >
                    {item.title}
                  </motion.h3>

                  {/* Live VIX Ticker for Hedging */}
                  {item.title === "Hedging" && (
                    <motion.div className="flex items-center space-x-2 text-sm">
                      <span className="text-gray-400">VIX:</span>
                      <motion.span 
                        className="font-bold text-orange-400"
                        key={Math.floor(vixValue * 10)}
                        initial={{ scale: 1.1, opacity: 0.8 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {vixValue.toFixed(1)}
                      </motion.span>
                      <motion.div
                        className="w-1.5 h-1.5 bg-green-400 rounded-full"
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    </motion.div>
                  )}

                  {/* Timeline Pulse for Catalysts */}
                  {item.title === "Catalysts to Watch" && (
                    <div className="flex items-center space-x-1 mt-2">
                      {[...Array(7)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 rounded-full bg-blue-400"
                          animate={{
                            opacity: [0.3, 1, 0.3],
                            scale: [0.8, 1.2, 0.8]
                          }}
                          transition={{
                            duration: 2,
                            delay: i * 0.2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Primary Content - Crystal Clear Body Text */}
              <motion.p 
                className={`leading-relaxed text-gray-200 font-medium ${compactView ? 'text-sm line-clamp-3' : 'text-sm md:text-base'}`}
                role="article"
                aria-label={`${item.title} recommendation`}
                style={{ 
                  lineHeight: 1.7,
                  textShadow: '0 1px 2px rgba(0,0,0,0.2)', // Subtle text enhancement
                  backfaceVisibility: 'hidden' // Prevent distortion
                }}
              >
                {item.content}
              </motion.p>
            </div>

            {/* Conditionally render detailed sections for expanded view */}
            {!compactView && (
              <>
                {/* Strategic Reasoning - Expandable */}
                <div className="border-t border-white/10 pt-6">
                  <motion.button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center justify-between w-full mb-4 group/expand"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    aria-expanded={isExpanded}
                    aria-label={`${isExpanded ? 'Collapse' : 'Expand'} reasoning details`}
                  >
                    <h4 className="text-base md:text-lg font-bold tracking-wide text-violet-300">
                      Why This Matters Now
                    </h4>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <ChevronDown className="w-5 h-5 text-violet-400 group-hover/expand:text-violet-300" />
                    </motion.div>
                  </motion.button>

                  {/* Expandable Content with Luxury Unfold Animation */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, y: -20 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -20 }}
                        transition={{ 
                          duration: 0.6, 
                          ease: [0.23, 1, 0.32, 1],
                          opacity: { duration: 0.4 }
                        }}
                        className="overflow-hidden"
                      >
                        <motion.div
                          className="p-4 md:p-6 rounded-2xl border mb-6"
                          style={{
                            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))',
                            borderColor: 'rgba(139, 92, 246, 0.2)'
                          }}
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.2, duration: 0.4 }}
                        >
                          <p className="text-sm leading-relaxed text-gray-300" style={{ lineHeight: 1.8 }}>
                            {item.reasoning}
                          </p>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Connected Signals - Interactive with Tooltips */}
                <div className="space-y-4">
                  <h5 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                    Connected Signals
                  </h5>
                  <div className="flex flex-wrap gap-3">
                    {item.linkedSignals.map((signal, i) => (
                      <motion.button
                        key={i}
                        className="relative flex items-center space-x-2 px-3 md:px-4 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-semibold border backdrop-blur-sm overflow-hidden group/signal"
                        style={{
                          background: 'linear-gradient(135deg, rgba(75, 85, 99, 0.2), rgba(55, 65, 81, 0.3))',
                          borderColor: 'rgba(156, 163, 175, 0.3)'
                        }}
                        whileHover={{ 
                          scale: 1.05, 
                          y: -3,
                          borderColor: 'rgba(139, 92, 246, 0.5)',
                          boxShadow: '0 8px 25px rgba(139, 92, 246, 0.2)'
                        }}
                        whileTap={{ scale: 0.95 }}
                        onMouseEnter={(e) => handleSignalHover(signal, e)}
                        onMouseLeave={() => setHoveredSignal(null)}
                        onClick={() => setSelectedSignal(signal)}
                        aria-label={`View live data for ${signal}`}
                      >
                        {/* Gradient Ripple Sweep */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                          initial={{ x: '-100%' }}
                          animate={hoveredSignal === signal ? { x: '200%' } : {}}
                          transition={{ duration: 0.8, ease: "easeInOut" }}
                        />
                        
                        <span className="relative z-10 text-gray-300 group-hover/signal:text-white transition-colors">
                          {signal}
                        </span>
                        <ExternalLink className="relative z-10 w-3 h-3 text-gray-400 group-hover/signal:text-violet-400 transition-colors" />
                      </motion.button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Tooltip for Connected Signals */}
      <SignalTooltip 
        signal={hoveredSignal}
        isVisible={!!hoveredSignal}
        position={tooltipPosition}
      />

      {/* Right-Side Drawer for Connected Signals */}
      <SignalDrawer
        isOpen={!!selectedSignal}
        onClose={() => setSelectedSignal(null)}
        signal={selectedSignal}
      />
    </>
  );
};

const StrategistPlaybook = ({ data }) => {
  const [compactView, setCompactView] = useState(false);

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="space-y-8 md:space-y-12"
    >
      {/* Universal Header - Redesigned for better toggle integration */}
      <motion.div
        className="relative flex flex-col md:flex-row items-center justify-between gap-6 p-6 md:p-8 rounded-3xl backdrop-blur-xl border"
        style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))',
          borderColor: 'rgba(139, 92, 246, 0.25)'
        }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        {/* Left Side: Title and Description */}
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-violet-500/30 to-indigo-500/30 flex items-center justify-center backdrop-blur-xl flex-shrink-0">
            <Compass className="w-6 h-6 md:w-8 md:h-8 text-violet-300" strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-black tracking-[-0.02em] mb-1 text-white">
              Strategist's Playbook
            </h2>
            <p className="text-base md:text-lg text-gray-200">
              What AI recommends you do right now
            </p>
          </div>
        </div>

        {/* Right Side: View Toggle - Now integrated */}
        <motion.div
          className="flex-shrink-0 inline-flex items-center p-1.5 bg-black/20 rounded-2xl backdrop-blur-sm border border-white/10"
          whileHover={{ scale: 1.02 }}
        >
          <motion.button
            className={`flex items-center gap-2 px-4 md:px-6 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
              !compactView 
                ? 'bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-lg' 
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setCompactView(false)}
            whileTap={{ scale: 0.95 }}
          >
            <Eye className="w-4 h-4" />
            <span className="hidden md:inline">Expanded</span>
          </motion.button>
          <motion.button
            className={`flex items-center gap-2 px-4 md:px-6 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
              compactView 
                ? 'bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-lg' 
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setCompactView(true)}
            whileTap={{ scale: 0.95 }}
          >
            <BarChart3 className="w-4 h-4" />
            <span className="hidden md:inline">Compact</span>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Playbook Cards Grid - Responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
        {Object.values(data).map((item, index) => (
          <PlaybookCard key={item.title} item={item} index={index} compactView={compactView} />
        ))}
      </div>

      {/* Elegant Bottom Fade */}
      <motion.div 
        className="h-16 md:h-24 bg-gradient-to-t from-transparent via-black/10 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      />
    </motion.section>
  );
};

export default StrategistPlaybook;