import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function MacroInsightCapsule({ 
  insight = "Markets lean risk-off — 3 divergences flagged in global credit spreads.",
  expandedInsight = "Credit spreads widening across HY and EM. Fed policy expectations shifting hawkish. Monitor refinancing risks in industrial sector.",
  isLoading = false,
  onExpand,
  secondaryInsights = [
    { category: "Credit", summary: "HY spreads widen 35 bps WoW; issuance windows tighten", sentiment: "risk" },
    { category: "Equities", summary: "Flat breadth signals concentration risk in mega-cap tech", sentiment: "neutral" },
    { category: "Commodities", summary: "China demand softness weighs on industrial metals", sentiment: "risk" }
  ],
  sentimentScore = 34 // 0-100 scale, where <40 = risk-off, >60 = risk-on
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const [showPulse, setShowPulse] = useState(false);
  const [drawerWidth, setDrawerWidth] = useState(520);
  const [initialPinchDistance, setInitialPinchDistance] = useState(null);
  const [isPinching, setIsPinching] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldReduceMotion(mediaQuery.matches);
    const handler = (e) => setShouldReduceMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Responsive width calculation based on viewport
  useEffect(() => {
    const updateDrawerWidth = () => {
      const viewportWidth = window.innerWidth;
      let newWidth;
      
      if (viewportWidth <= 1280) {
        newWidth = 440;
      } else if (viewportWidth <= 1439) {
        newWidth = 480;
      } else if (viewportWidth <= 1679) {
        newWidth = 520;
      } else {
        newWidth = 560;
      }
      
      setDrawerWidth(newWidth);
    };

    updateDrawerWidth();
    window.addEventListener('resize', updateDrawerWidth);
    return () => window.removeEventListener('resize', updateDrawerWidth);
  }, []);

  // Trigger pulse animation when insight changes
  useEffect(() => {
    if (!shouldReduceMotion && insight) {
      setShowPulse(true);
      const timer = setTimeout(() => setShowPulse(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [insight, shouldReduceMotion]);

  // Lock body scroll when expanded
  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isExpanded]);

  const handleToggle = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    onExpand?.(newState);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsExpanded(false);
      onExpand?.(false);
    }
  };

  // Keyboard handling
  useEffect(() => {
    if (!isExpanded) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsExpanded(false);
        onExpand?.(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded, onExpand]);

  // Pinch-to-close gesture handler
  useEffect(() => {
    if (!isExpanded) return;

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
          setIsExpanded(false);
          onExpand?.(false);
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

    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isExpanded, isPinching, initialPinchDistance, onExpand]);

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'opportunity':
        return { color: '#73E6D2', bg: 'rgba(115, 230, 210, 0.1)' };
      case 'risk':
        return { color: '#ECA5FF', bg: 'rgba(236, 165, 255, 0.1)' };
      default:
        return { color: '#8DC4FF', bg: 'rgba(141, 196, 255, 0.1)' };
    }
  };

  return (
    <>
      {/* Compact Capsule */}
      <AnimatePresence>
        {!isExpanded && (
          <motion.div
            className="macro-insight-capsule"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ 
              duration: 0.6, 
              delay: 1.4,
              ease: [0.22, 0.61, 0.36, 1] 
            }}
            onClick={handleToggle}
            style={{
              position: 'relative',
              width: '280px',
              borderRadius: '18px',
              background: 'rgba(20, 20, 20, 0.55)',
              backdropFilter: 'blur(18px)',
              WebkitBackdropFilter: 'blur(18px)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0px 8px 40px rgba(0, 0, 0, 0.25)',
              padding: '20px',
              cursor: 'pointer',
              overflow: 'hidden',
              willChange: 'transform, box-shadow'
            }}
            whileHover={shouldReduceMotion ? {} : {
              y: -2,
              boxShadow: '0px 12px 48px rgba(0, 0, 0, 0.30), 0 0 0 1px rgba(255, 255, 255, 0.16)',
              transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }
            }}
            whileTap={shouldReduceMotion ? {} : {
              scale: 0.98,
              transition: { duration: 0.15 }
            }}
            role="button"
            aria-label="Expand macro insights"
            aria-expanded={isExpanded}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleToggle();
              }
            }}
          >
            {/* Gradient Border Overlay */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                borderRadius: '18px',
                background: 'linear-gradient(135deg, rgba(115, 230, 210, 0.12) 0%, rgba(236, 165, 255, 0.12) 100%)',
                opacity: 0.5,
                mixBlendMode: 'screen'
              }}
              animate={shouldReduceMotion ? {} : {
                opacity: showPulse ? [0.5, 1, 0.5] : 0.5
              }}
              transition={showPulse ? {
                duration: 1.2,
                ease: [0.25, 0.1, 0.25, 1]
              } : {
                duration: 0.4
              }}
              aria-hidden="true"
            />

            {/* Update Pulse Ring */}
            <AnimatePresence>
              {showPulse && !shouldReduceMotion && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    borderRadius: '18px',
                    border: '2px solid rgba(115, 230, 210, 0.6)',
                    opacity: 0.8
                  }}
                  initial={{ scale: 1, opacity: 0.8 }}
                  animate={{ scale: 1.05, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
                  aria-hidden="true"
                />
              )}
            </AnimatePresence>

            {/* Content */}
            <div className="relative z-10">
              {/* Label */}
              <motion.div 
                className="flex items-center gap-2 mb-3"
                animate={{
                  opacity: isLoading ? 0.5 : 1
                }}
              >
                <Sparkles 
                  className="w-4 h-4" 
                  style={{ 
                    color: '#73E6D2',
                    opacity: 0.9
                  }}
                />
                <span
                  style={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#A9ACB2',
                    letterSpacing: '0.02em',
                    textTransform: 'uppercase'
                  }}
                >
                  Macro Insight
                </span>
              </motion.div>

              {/* Main Insight Text */}
              <motion.p
                style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '14.5px',
                  fontWeight: 500,
                  color: '#EAEAEA',
                  lineHeight: 1.5
                }}
                animate={{
                  opacity: isLoading ? 0.5 : 1
                }}
              >
                {insight}
              </motion.p>
            </div>

            {/* Loading Overlay */}
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    background: 'rgba(20, 20, 20, 0.80)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: '18px'
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="w-5 h-5 rounded-full border-2 border-transparent"
                    style={{
                      borderTopColor: '#73E6D2',
                      borderRightColor: '#73E6D2'
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded Drawer */}
      <AnimatePresence>
        {isExpanded && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[100]"
              style={{
                background: 'rgba(0, 0, 0, 0.12)',
                backdropFilter: 'blur(2px)'
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
              onClick={handleBackdropClick}
              aria-hidden="true"
            />

            {/* Drawer Container - Responsive Width */}
            <motion.div
              className="fixed z-[101]"
              style={{
                top: '50%',
                left: '50%',
                width: `${drawerWidth}px`,
                maxWidth: 'calc(100vw - 96px)',
                maxHeight: '66vh',
                borderRadius: '24px',
                background: 'rgba(20, 20, 20, 0.55)',
                backdropFilter: 'blur(22px)',
                WebkitBackdropFilter: 'blur(22px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: '0 12px 48px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.04)',
                overflow: 'hidden',
                willChange: 'transform, opacity',
                transform: isPinching ? 'translate(-50%, -50%) scale(0.98)' : 'translate(-50%, -50%) scale(1)',
                transition: isPinching ? 'transform 0.1s ease-out' : 'none'
              }}
              initial={{ 
                opacity: 0,
                scale: 0.98,
                x: '-50%',
                y: '-45%'
              }}
              animate={{ 
                opacity: 1,
                scale: 1,
                x: '-50%',
                y: '-50%',
                transition: {
                  duration: 0.65,
                  ease: [0.25, 0.1, 0.25, 1]
                }
              }}
              exit={{ 
                opacity: 0,
                scale: 0.95,
                y: '-45%',
                transition: {
                  duration: 0.45,
                  ease: [0.25, 0.1, 0.25, 1]
                }
              }}
              role="dialog"
              aria-modal="true"
              aria-label="Expanded macro insights"
            >
              {/* Gradient Border Animation */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  borderRadius: '24px',
                  background: 'linear-gradient(135deg, rgba(115, 230, 210, 0.12) 0%, rgba(236, 165, 255, 0.12) 100%)',
                  mixBlendMode: 'screen'
                }}
                animate={{
                  opacity: [0.5, 0.7, 0.5]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                aria-hidden="true"
              />

              {/* Scrollable Content Container */}
              <div 
                className="relative z-10 h-full overflow-y-auto"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgba(255, 255, 255, 0.2) transparent'
                }}
              >
                {/* Header */}
                <div 
                  className="sticky top-0 z-20 px-6 py-5 border-b backdrop-blur-xl"
                  style={{ 
                    borderColor: 'rgba(255, 255, 255, 0.06)',
                    background: 'rgba(20, 20, 20, 0.8)'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="w-4 h-4" style={{ color: '#73E6D2' }} />
                        <span
                          style={{
                            fontFamily: 'Inter, system-ui, sans-serif',
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#A9ACB2',
                            letterSpacing: '0.02em',
                            textTransform: 'uppercase'
                          }}
                        >
                          Macro Insight
                        </span>
                      </div>
                      <span
                        style={{
                          fontFamily: 'Inter, system-ui, sans-serif',
                          fontSize: '12px',
                          color: '#8F9196'
                        }}
                      >
                        Updated 2m ago
                      </span>
                    </div>
                    
                    {/* Close Button */}
                    <motion.button
                      onClick={() => {
                        setIsExpanded(false);
                        onExpand?.(false);
                      }}
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{
                        background: 'rgba(255, 255, 255, 0.06)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.08)'
                      }}
                      whileHover={{ 
                        background: 'rgba(255, 255, 255, 0.1)',
                        scale: 1.05
                      }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Close insights"
                    >
                      <X className="w-4 h-4" style={{ color: '#D9D9D9' }} />
                    </motion.button>
                  </div>
                </div>

                {/* Content */}
                <div className="px-6 py-5 space-y-6">
                  {/* Primary Insight */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.5 }}
                  >
                    <p
                      style={{
                        fontFamily: 'Inter, system-ui, sans-serif',
                        fontSize: '15px',
                        fontWeight: 500,
                        color: '#EAEAEA',
                        lineHeight: 1.5
                      }}
                    >
                      {insight}
                    </p>
                  </motion.div>

                  {/* Secondary Insights */}
                  <motion.div 
                    className="space-y-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25, duration: 0.5 }}
                  >
                    {secondaryInsights.map((item, index) => {
                      const sentimentConfig = getSentimentColor(item.sentiment);
                      const SentimentIcon = item.sentiment === 'risk' ? TrendingDown : 
                                          item.sentiment === 'opportunity' ? TrendingUp : Minus;
                      
                      return (
                        <motion.div
                          key={index}
                          className="p-4 rounded-xl"
                          style={{
                            background: sentimentConfig.bg,
                            border: `1px solid ${sentimentConfig.color}20`,
                            backdropFilter: 'blur(10px)'
                          }}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.35 + (index * 0.1), duration: 0.5 }}
                          whileHover={{
                            y: -2,
                            background: `${sentimentConfig.color}15`,
                            borderColor: `${sentimentConfig.color}30`,
                            transition: { duration: 0.3 }
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <SentimentIcon 
                              className="w-4 h-4 mt-0.5 flex-shrink-0" 
                              style={{ color: sentimentConfig.color }}
                            />
                            <div className="flex-1">
                              <div
                                style={{
                                  fontFamily: 'Inter, system-ui, sans-serif',
                                  fontSize: '12px',
                                  fontWeight: 600,
                                  color: '#A0A2A7',
                                  marginBottom: '4px',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.03em'
                                }}
                              >
                                {item.category}
                              </div>
                              <div
                                style={{
                                  fontFamily: 'Inter, system-ui, sans-serif',
                                  fontSize: '13px',
                                  color: '#D9D9D9',
                                  lineHeight: 1.4
                                }}
                              >
                                {item.summary}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>

                  {/* Sentiment Gauge */}
                  <motion.div
                    className="pt-4"
                    style={{ borderTop: '1px solid rgba(255, 255, 255, 0.04)' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.55, duration: 0.5 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        style={{
                          fontFamily: 'Inter, system-ui, sans-serif',
                          fontSize: '12px',
                          fontWeight: 600,
                          color: '#A0A2A7',
                          textTransform: 'uppercase',
                          letterSpacing: '0.03em'
                        }}
                      >
                        Macro Posture
                      </span>
                      <span
                        style={{
                          fontFamily: 'Inter, system-ui, sans-serif',
                          fontSize: '12px',
                          fontWeight: 600,
                          color: sentimentScore < 40 ? '#ECA5FF' : sentimentScore > 60 ? '#73E6D2' : '#8DC4FF'
                        }}
                      >
                        {sentimentScore < 40 ? 'Risk-Off' : sentimentScore > 60 ? 'Risk-On' : 'Neutral'}
                      </span>
                    </div>
                    
                    {/* Animated Gauge Bar */}
                    <div 
                      className="relative h-2 rounded-full overflow-hidden"
                      style={{ background: 'rgba(255, 255, 255, 0.06)' }}
                    >
                      <motion.div
                        className="absolute inset-y-0 left-0"
                        style={{
                          background: `linear-gradient(90deg, 
                            #ECA5FF 0%, 
                            #8DC4FF 50%, 
                            #73E6D2 100%
                          )`,
                          borderRadius: '999px'
                        }}
                        initial={{ width: '0%' }}
                        animate={{ width: `${sentimentScore}%` }}
                        transition={{ 
                          duration: 0.8, 
                          delay: 0.65,
                          ease: [0.25, 0.1, 0.25, 1]
                        }}
                      />
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx>{`
        .macro-insight-capsule {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* Custom scrollbar styling */
        .macro-insight-capsule ::-webkit-scrollbar {
          width: 6px;
        }
        
        .macro-insight-capsule ::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .macro-insight-capsule ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
        
        .macro-insight-capsule ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        @media (prefers-reduced-motion: reduce) {
          .macro-insight-capsule,
          .macro-insight-capsule * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </>
  );
}