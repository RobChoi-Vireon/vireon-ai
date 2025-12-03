import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

// ============================================================================
// OS HORIZON LIQUID GLASS SYSTEM — TAHOE (Light Frosted)
// ============================================================================
const GLASS = {
  card: {
    bg: 'rgba(255, 255, 255, 0.06)',
    blur: 'blur(24px) saturate(120%)',
    radius: '24px',
    border: '1px solid rgba(255,255,255,0.10)',
    innerGlow: 'inset 0 1px 0 rgba(255,255,255,0.12)'
  }
};

export default function PulseCard({ pulse }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  if (!pulse) return null;

  const getTrendColor = (trend) => {
    if (trend === 'up') return '#58E3A4';
    if (trend === 'down') return '#FF6A7A';
    return '#A8B3C7';
  };

  const getScoreColor = (score) => {
    if (score >= 70) return '#58E3A4';
    if (score >= 40) return '#4DA3FF';
    return '#FF6A7A';
  };

  const trendRgb = pulse.trend === 'up' ? '88, 227, 164' : pulse.trend === 'down' ? '255, 106, 122' : '168, 179, 199';

  return (
    <>
      {/* Main Pulse Card — OS Horizon Liquid Glass */}
      <motion.div 
        className="relative cursor-pointer group overflow-hidden"
        style={{
          background: GLASS.card.bg,
          backdropFilter: GLASS.card.blur,
          WebkitBackdropFilter: GLASS.card.blur,
          borderRadius: GLASS.card.radius,
          border: GLASS.card.border,
          boxShadow: `${GLASS.card.innerGlow}, 0 12px 40px -15px rgba(0,0,0,0.30)`
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsExpanded(true)}
        animate={{
          y: isHovered ? -3 : 0,
          boxShadow: isHovered 
            ? `${GLASS.card.innerGlow}, 0 18px 50px -15px rgba(0,0,0,0.40), 0 0 30px rgba(${trendRgb}, 0.08)`
            : `${GLASS.card.innerGlow}, 0 12px 40px -15px rgba(0,0,0,0.30)`
        }}
        transition={{ duration: 0.22, ease: [0.22, 0.61, 0.36, 1] }}
      >
        {/* Top specular edge */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '10%',
          right: '10%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
          pointerEvents: 'none',
          borderRadius: '24px 24px 0 0'
        }} />
        {/* Trend Ribbon with glow */}
        <motion.div 
          className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
          style={{
            background: pulse.trend === 'up' 
              ? 'linear-gradient(90deg, #58E3A4 0%, #4DA3FF 100%)'
              : pulse.trend === 'down' 
              ? 'linear-gradient(90deg, #FF6A7A 0%, #FF8A65 100%)'
              : 'linear-gradient(90deg, #A8B3C7 0%, #B8C5D4 100%)',
            boxShadow: pulse.trend === 'up'
              ? '0 0 20px rgba(88, 227, 164, 0.40)'
              : pulse.trend === 'down'
              ? '0 0 20px rgba(255, 106, 122, 0.40)'
              : '0 0 12px rgba(168, 179, 199, 0.30)'
          }}
        />
        
        <div className="relative z-10 p-6 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-4 mb-3">
              <h2 className="text-2xl font-bold text-white">
                Today Pulse
              </h2>
              <motion.div 
                className="text-5xl font-black"
                style={{ 
                  color: getScoreColor(pulse.score),
                  textShadow: `0 0 20px ${getScoreColor(pulse.score)}50`
                }}
                animate={{ scale: isHovered ? 1.05 : 1 }}
                transition={{ duration: 0.2 }}
              >
                {pulse.score}
              </motion.div>
            </div>
            <p className="text-base max-w-md leading-relaxed text-gray-300">
              {pulse.blurb}
            </p>
            
            {/* Confidence bar */}
            <div className="mt-4">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-xs font-medium text-gray-400 px-2 py-1 rounded-full bg-white/5 border border-white/10">
                  Confidence: {pulse.score}%
                </span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden w-full max-w-md">
                <motion.div
                  className="h-full rounded-full"
                  style={{ 
                    background: `linear-gradient(90deg, ${getScoreColor(pulse.score)}, ${getScoreColor(pulse.score)}80)`,
                    boxShadow: `0 0 12px ${getScoreColor(pulse.score)}60`
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pulse.score}%` }}
                  transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {pulse.trend === 'up' ? (
              <motion.div
                animate={{ y: isHovered ? -2 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <TrendingUp className="w-10 h-10" style={{ color: '#58E3A4', filter: 'drop-shadow(0 0 8px rgba(88, 227, 164, 0.50))' }} />
              </motion.div>
            ) : pulse.trend === 'down' ? (
              <motion.div
                animate={{ y: isHovered ? 2 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <TrendingDown className="w-10 h-10" style={{ color: '#FF6A7A', filter: 'drop-shadow(0 0 8px rgba(255, 106, 122, 0.50))' }} />
              </motion.div>
            ) : (
              <div className="w-10 h-10 rounded-full" style={{ backgroundColor: '#A8B3C7' }} />
            )}
            <motion.div
              animate={{ x: isHovered ? 4 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="w-6 h-6 text-gray-400" />
            </motion.div>
          </div>
        </div>
        
        {/* 7-Day Trend Mini Sparkline */}
        <div className="absolute bottom-4 right-6 text-xs text-gray-500 flex flex-col items-end">
          <div className="flex items-center space-x-1 mb-1">
            <svg width="60" height="24" className="opacity-70">
              <polyline
                fill="none"
                stroke={pulse.trend === 'up' ? '#58E3A4' : pulse.trend === 'down' ? '#FF6A7A' : '#A8B3C7'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="2,18 12,14 22,16 32,10 42,12 52,6 58,8"
              />
            </svg>
          </div>
          <span>7-Day Trend</span>
        </div>
      </motion.div>

      {/* Expanded Pulse Drawer — OS Horizon Liquid Glass */}
      <AnimatePresence>
        {isExpanded && (
          <>
            {/* Backdrop */}
            <motion.div 
              className="fixed inset-0 z-50"
              style={{ background: 'rgba(0, 0, 0, 0.70)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExpanded(false)}
            />

            {/* Drawer */}
            <motion.div 
              className="fixed bottom-0 left-0 right-0 z-50 max-h-[80vh] overflow-hidden"
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div 
                className="rounded-t-3xl overflow-hidden"
                style={{
                  background: 'rgba(12, 18, 32, 0.85)',
                  backdropFilter: 'blur(60px) saturate(175%)',
                  WebkitBackdropFilter: 'blur(60px) saturate(175%)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  borderBottom: 'none',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), 0 -20px 60px rgba(0,0,0,0.40)'
                }}
              >
                {/* Top specular edge */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: '10%',
                  right: '10%',
                  height: '1.5px',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)',
                  pointerEvents: 'none',
                  borderRadius: '24px 24px 0 0'
                }} />
                
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/8">
                  <h3 className="text-xl font-bold text-white">
                    Market Pulse Details
                  </h3>
                  <motion.button
                    onClick={() => setIsExpanded(false)}
                    className="p-2.5 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
                    whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.10)' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </motion.button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
                  {/* Key Drivers */}
                  <div>
                    <h4 className="font-semibold mb-4 text-white">
                      Key Drivers
                    </h4>
                    <div className="space-y-4">
                      <motion.div 
                        className="p-4 rounded-xl overflow-hidden relative"
                        style={{
                          background: 'linear-gradient(135deg, rgba(77, 163, 255, 0.12) 0%, rgba(255,255,255,0.04) 100%)',
                          backdropFilter: 'blur(20px)',
                          border: '1px solid rgba(77, 163, 255, 0.20)'
                        }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <div className="text-sm font-bold text-[#4DA3FF] mb-2">Macro</div>
                        <div className="text-white">{pulse.drivers?.macro}</div>
                      </motion.div>
                      <motion.div 
                        className="p-4 rounded-xl overflow-hidden relative"
                        style={{
                          background: 'linear-gradient(135deg, rgba(88, 227, 164, 0.12) 0%, rgba(255,255,255,0.04) 100%)',
                          backdropFilter: 'blur(20px)',
                          border: '1px solid rgba(88, 227, 164, 0.20)'
                        }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <div className="text-sm font-bold text-[#58E3A4] mb-2">Sector</div>
                        <div className="text-white">{pulse.drivers?.sector}</div>
                      </motion.div>
                      <motion.div 
                        className="p-4 rounded-xl overflow-hidden relative"
                        style={{
                          background: 'linear-gradient(135deg, rgba(168, 179, 199, 0.12) 0%, rgba(255,255,255,0.04) 100%)',
                          backdropFilter: 'blur(20px)',
                          border: '1px solid rgba(168, 179, 199, 0.20)'
                        }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <div className="text-sm font-bold text-[#A8B3C7] mb-2">Volatility</div>
                        <div className="text-white">{pulse.drivers?.volatility}</div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Upcoming Catalysts */}
                  <div>
                    <h4 className="font-semibold mb-4 text-white">
                      Upcoming Catalysts
                    </h4>
                    <div className="space-y-3">
                      {pulse.catalysts?.map((catalyst, index) => (
                        <motion.div 
                          key={index} 
                          className="flex items-center justify-between p-4 rounded-xl"
                          style={{
                            background: 'rgba(255,255,255,0.04)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255,255,255,0.08)'
                          }}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                        >
                          <div>
                            <div className="font-medium text-white">
                              {catalyst.event}
                            </div>
                            <div className="text-sm text-gray-400">
                              {new Date(catalyst.date).toLocaleDateString()}
                            </div>
                          </div>
                          <div 
                            className="px-3 py-1.5 rounded-full text-xs font-bold"
                            style={{
                              background: catalyst.impact === 'high' 
                                ? 'rgba(255, 106, 122, 0.15)' 
                                : catalyst.impact === 'medium' 
                                ? 'rgba(77, 163, 255, 0.15)' 
                                : 'rgba(168, 179, 199, 0.15)',
                              border: `1px solid ${catalyst.impact === 'high' 
                                ? 'rgba(255, 106, 122, 0.25)' 
                                : catalyst.impact === 'medium' 
                                ? 'rgba(77, 163, 255, 0.25)' 
                                : 'rgba(168, 179, 199, 0.25)'}`,
                              color: catalyst.impact === 'high' 
                                ? '#FF6A7A' 
                                : catalyst.impact === 'medium' 
                                ? '#4DA3FF' 
                                : '#A8B3C7'
                            }}
                          >
                            {catalyst.impact} impact
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}