// 🔒 DESIGN LOCKED — OS HORIZON LIQUID GLASS (macOS Tahoe)
// Strict Compliance with Vireon Design System

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, AlertTriangle, TrendingUp, Clock, Zap, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// ============================================================================
// OS HORIZON LIQUID GLASS SYSTEM — TAHOE
// ============================================================================
const GLASS = {
  card: {
    bg: 'rgba(18, 26, 46, 0.50)',
    blur: 'blur(40px) saturate(165%)',
    radius: '20px',
    border: '1px solid rgba(255,255,255,0.08)',
    innerGlow: 'inset 0 0 30px rgba(255,255,255,0.02), inset 0 1px 0 rgba(255,255,255,0.08)'
  }
};

const icons = {
  risk: AlertTriangle,
  opportunity: TrendingUp
};

const priorityStyles = {
  high: { 
    bar: 'bg-red-500 shadow-red-500/50',
    glow: 'shadow-lg'
  },
  medium: { 
    bar: 'bg-orange-500 shadow-orange-500/30',
    glow: 'shadow-md'
  },
  low: { 
    bar: 'bg-blue-500/60 shadow-blue-500/20',
    glow: 'shadow-sm'
  }
};

const timeHorizonStyles = {
  short_term: {
    base: 'border-red-500/40 text-red-300',
    dot: 'bg-red-400',
    priority: 'high'
  },
  medium_term: {
    base: 'border-orange-500/40 text-orange-300',
    dot: 'bg-orange-400',
    priority: 'medium'
  },
  long_term: {
    base: 'border-blue-500/40 text-blue-300',
    dot: 'bg-blue-400',
    priority: 'low'
  }
};

const ImplicationPanel = React.memo(({ item, index, delay, totalCount, sectionType }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [preloadedContent, setPreloadedContent] = useState(false);

  const Icon = icons[item.type] || Lightbulb;
  const isRisk = item.type === 'risk';
  
  const accentColor = isRisk ? '#EF4444' : '#10B981';
  const hoverGlowColor = isRisk ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.12)';
  const borderStyle = isRisk 
    ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.35), rgba(239, 68, 68, 0.1))' 
    : 'linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(16, 185, 129, 0.1))';

  const expandedContext = isRisk 
    ? "New rules in Europe and the US mean tech companies will spend **15% more on research and development**. Companies need to hire new teams and update their systems to follow new AI content rules."
    : "Because China is buying less, raw materials are getting cheaper. **Steel, aluminum, and other materials cost 12-18% less than last year**, which helps US manufacturers keep more of what they earn.";
  
  const linkedSignals = item.action_cues || [];

  // Determine priority based on timeframe and explicit priority
  const effectivePriority = item.priority || timeHorizonStyles[item.timeframe]?.priority || 'medium';
  const priorityStyle = priorityStyles[effectivePriority] || priorityStyles.medium;
  const horizonStyle = timeHorizonStyles[item.timeframe] || { base: 'border-gray-500/40 text-gray-400', dot: 'bg-gray-400' };

  useEffect(() => {
    if (isHovered && !preloadedContent) {
      const timer = setTimeout(() => setPreloadedContent(true), 150);
      return () => clearTimeout(timer);
    }
  }, [isHovered, preloadedContent]);

  const handleToggle = () => setIsExpanded(!isExpanded);

  return (
    <motion.div
      className="relative"
      variants={{
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] } }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{ willChange: 'transform, opacity' }}
    >
      <motion.div
        className="relative cursor-pointer rounded-2xl overflow-hidden"
        style={{ background: borderStyle, padding: '1px' }}
        whileHover={{ y: -2, boxShadow: `0 8px 25px -5px ${hoverGlowColor}, 0 0 20px -5px ${hoverGlowColor}` }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.18, ease: [0.22, 0.61, 0.36, 1] }}
        onClick={handleToggle}
      >
        <div 
          className="relative p-6 rounded-[15px]"
          style={{
            background: 'rgba(20, 25, 35, 0.5)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <div className="flex items-start gap-4 mb-4">
            {/* Enhanced Priority Marker - Thin Vertical Bar */}
            <div className={`w-1 h-8 rounded-full ${priorityStyle.bar} ${priorityStyle.glow} mr-2 flex-shrink-0`} />
            
            <div className="flex-1 min-w-0">
              <h4 className="text-base font-bold text-neutral-100 leading-snug mb-3">
                {item.text}
              </h4>
              
              {/* Enhanced Inline Signals - Always Show Top 2 + More Indicator */}
              {!isExpanded && linkedSignals.length > 0 && (
                <motion.div
                  className="flex flex-wrap items-center gap-2 mb-2"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {linkedSignals.slice(0, 2).map((signal, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-full bg-black/20 border border-white/10 text-neutral-300"
                    >
                      <Zap className="w-3 h-3 opacity-60" />
                      {signal}
                    </span>
                  ))}
                  
                  {/* Show "+X more" if there are additional signals */}
                  {linkedSignals.length > 2 && (
                    <span className="text-xs text-neutral-500 font-medium">
                      +{linkedSignals.length - 2} more
                    </span>
                  )}
                </motion.div>
              )}

              {/* Balance Cue for Opportunities - Supporting Context */}
              {!isExpanded && sectionType === 'opportunity' && totalCount < 3 && linkedSignals.length > 2 && (
                <motion.div
                  className="mb-2"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="text-xs text-neutral-500 font-medium">
                    +{linkedSignals.length - 2} supporting signals
                  </span>
                </motion.div>
              )}
            </div>
          </div>

          <motion.div 
            className="flex flex-wrap items-center gap-3 text-xs"
            animate={{ opacity: isExpanded ? 0 : 1, transition: { duration: 0.2 } }}
            style={{ pointerEvents: isExpanded ? 'none' : 'auto' }}
          >
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium ${horizonStyle.base}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${horizonStyle.dot}`} />
              <span className="capitalize">{item.timeframe?.replace('_', ' ')}</span>
            </div>
          </motion.div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: '20px', transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1], when: "beforeChildren", staggerChildren: 0.05 } }}
                exit={{ opacity: 0, height: 0, marginTop: 0, transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] } }}
              >
                <motion.p 
                  className="text-sm text-neutral-300 leading-relaxed mb-4"
                  variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                  initial="hidden" animate="visible"
                  dangerouslySetInnerHTML={{ __html: expandedContext.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>') }}
                />
                
                <motion.div className="space-y-2" variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} initial="hidden" animate="visible">
                  <h5 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Linked Signals</h5>
                  <div className="flex flex-wrap gap-2">
                    {linkedSignals.map((signal, idx) => (
                      <motion.a 
                        key={signal} href="#"
                        className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-200 ${idx === 0 ? 'bg-black/40 border-white/20 text-neutral-100 font-semibold' : 'bg-black/20 border-white/10 text-neutral-300'}`}
                        variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}
                        whileHover={{
                          borderColor: 'rgba(255,255,255,0.3)', color: '#ffffff', background: 'rgba(255,255,255,0.1)',
                          filter: 'brightness(1.08)'
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        {signal}
                        <ExternalLink className="w-3 h-3 opacity-60" />
                      </motion.a>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
});

export default function ImplicationsPanel({ implications = [] }) {
  if (!implications || implications.length === 0) {
    return null;
  }
  
  const risks = implications.filter(item => item.type === 'risk');
  const opportunities = implications.filter(item => item.type === 'opportunity');

  const netTilt = risks.length > opportunities.length ? 'Risk-Heavy' : risks.length < opportunities.length ? 'Opportunity-Heavy' : 'Balanced';
  const netTiltColor = netTilt === 'Risk-Heavy' ? 'text-red-400' : netTilt === 'Opportunity-Heavy' ? 'text-green-400' : 'text-neutral-400';

  return (
    <div className="w-full">
      {/* Enhanced Net Tilt Summary */}
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-sm text-neutral-400">
          {risks.length} {risks.length === 1 ? 'Risk' : 'Risks'} vs. {opportunities.length} {opportunities.length === 1 ? 'Opportunity' : 'Opportunities'}
          <span className="mx-2 text-neutral-600">→</span>
          <span className={`font-semibold ${netTiltColor}`}>Net Tilt: {netTilt}</span>
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* Enhanced Section Header with Count */}
          <SectionHeader icon={AlertTriangle} title="Strategic Risks" count={risks.length} accentColor="#EF4444" delay={0} />
          <div className="space-y-6">
            {risks.map((item, index) => (
              <ImplicationPanel 
                item={item} 
                key={`risk-${index}`} 
                index={index} 
                delay={0.1 * index} 
                totalCount={risks.length}
                sectionType="risk"
              />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {/* Enhanced Section Header with Count */}
          <SectionHeader icon={TrendingUp} title="Strategic Opportunities" count={opportunities.length} accentColor="#10B981" delay={0.1} />
          <div className="space-y-6">
            {opportunities.map((item, index) => (
              <ImplicationPanel 
                item={item} 
                key={`opp-${index}`} 
                index={index} 
                delay={0.1 * index} 
                totalCount={opportunities.length}
                sectionType="opportunity"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const SectionHeader = ({ icon: Icon, title, count, accentColor, delay }) => (
  <motion.div 
    className="flex items-center space-x-3"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    <Icon className="w-6 h-6" style={{ color: accentColor }} />
    <div className="flex-1">
      <div className="flex items-center space-x-2">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <span className="text-sm text-neutral-500 font-medium">({count} {count === 1 ? 'item' : 'items'})</span>
      </div>
      <motion.div 
        className="h-0.5 mt-1.5 rounded-full"
        style={{ background: `linear-gradient(90deg, ${accentColor} 0%, rgba(255,255,255,0.1) 60%, transparent 100%)` }}
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ delay: delay + 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  </motion.div>
);