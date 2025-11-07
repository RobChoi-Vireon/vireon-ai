
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Briefcase, BarChart3, Globe, Zap, Target, TrendingUp, Eye, ChevronLeft, ChevronRight, Scale, BookOpen, Sparkles, Minus, Plus, FileText, Building2, Users, Gavel, DollarSign, TrendingDown, Factory, Truck } from 'lucide-react';

const LuxurySection = ({ icon: Icon, title, children, iconColor = "#4F46E5", delay = 0 }) => (
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
);

const ImpactTag = ({ tag, delay }) => {
  const isNegative = tag.direction === '-';
  const isPositive = tag.direction === '+';
  const colorClasses = isNegative
    ? 'bg-red-900/50 text-red-300 border-red-500/30'
    : isPositive ? 'bg-green-900/50 text-green-300 border-green-500/30'
    : 'bg-gray-700/50 text-gray-300 border-gray-500/30';

  const Icon = isNegative ? Minus : (isPositive ? Plus : null);

  return (
    <motion.div
      className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border text-sm font-medium transition-all duration-300 backdrop-blur-sm ${colorClasses}`}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 300, damping: 20 }}
      whileHover={{ y: -2, scale: 1.05 }}
    >
      {Icon && <Icon className="w-3.5 h-3.5" />}
      <span className="font-bold">{tag.asset}:</span>
      <span>{tag.detail}</span>
    </motion.div>
  );
};

const getTheme = (name) => {
  switch (name) {
    case 'Policy': return { Icon: Shield, color: '#60A5FA', gradient: 'from-blue-500/20 to-indigo-500/20', borderColor: 'border-blue-500/30', glowColor: 'rgba(96, 165, 250, 0.4)' };
    case 'Credit': return { Icon: Briefcase, color: '#C084FC', gradient: 'from-purple-500/20 to-violet-500/20', borderColor: 'border-purple-500/30', glowColor: 'rgba(192, 132, 252, 0.4)' };
    case 'Equities': return { Icon: BarChart3, color: '#34D399', gradient: 'from-emerald-500/20 to-teal-500/20', borderColor: 'border-emerald-500/30', glowColor: 'rgba(52, 211, 153, 0.4)' };
    case 'Global': return { Icon: Globe, color: '#F97316', gradient: 'from-orange-500/20 to-amber-500/20', borderColor: 'border-orange-500/30', glowColor: 'rgba(249, 115, 22, 0.4)' };
    default: return { Icon: Zap, color: '#A8B3C7', gradient: 'from-gray-500/20 to-slate-500/20', borderColor: 'border-slate-500/30', glowColor: 'rgba(168, 179, 199, 0.4)' };
  }
};

const getSegmentDetails = (segment) => {
  const baseDetails = {
    morning_takeaway: "General market conditions are the primary influence.",
    drivers: [{icon: Target, text: "No specific drivers identified.", weight: "medium"}],
    sentiment_rationale: ["General market conditions are the primary influence."],
    outlook: "Monitor for new catalysts.",
    impact_tags: [
      { asset: "Equities", detail: "Mixed", direction: "=" },
      { asset: "Rates", detail: "Neutral", direction: "=" }
    ]
  };

  if (!segment) return baseDetails;

  switch (segment.name) {
    case 'Policy':
      return {
        morning_takeaway: "Regulatory hardening raises compliance costs → downside for Big Tech multiples, hawkish Fed bias reinforced.",
        drivers: [
          {icon: Gavel, text: "Intensified **regulatory scrutiny** on big tech", weight: "high"}, 
          {icon: FileText, text: "Upcoming legislative proposals on **AI content**", weight: "medium"},
          {icon: Globe, text: "**Geopolitical factors** influencing trade policy", weight: "low"}
        ],
        sentiment_rationale: [
          "**Compliance costs** rising 40-60% for large-cap tech platforms",
          "**Margins pressured** as capex redirected from innovation to compliance", 
          "**Hawkish Fed bias** reinforced by regulatory tightening"
        ],
        outlook: "Q4 congressional AI hearings likely → stricter oversight → sector rotation away from high-growth tech. Monitor committee scheduling and bipartisan support levels.",
        impact_tags: [
          { asset: "Equities", detail: "Tech (-)", direction: "-" },
          { asset: "Rates", detail: "Treasuries (+)", direction: "+" },
          { asset: "FX", detail: "USD (+)", direction: "+" },
          { asset: "Credit", detail: "Neutral", direction: "=" }
        ]
      };
    case 'Credit':
      return {
        morning_takeaway: "EM HY spreads decompress rapidly → tightening financial conditions signal M&A slowdown and refinancing stress.",
        drivers: [
          {icon: TrendingUp, text: "Widening **high-yield (HY)** and **emerging market (EM)** spreads", weight: "high"},
          {icon: Building2, text: "**Freezing issuance** in primary debt markets", weight: "high"},
          {icon: Users, text: "**Tighter underwriting standards** from banks", weight: "medium"}
        ],
        sentiment_rationale: [
          "**Rising risk aversion** driving rapid spread decompression in EM", 
          "**Tightening financial conditions** stalling M&A and refinancing globally",
          "**Leading indicator** for broader credit market stress ahead"
        ],
        outlook: "CDX HY index above 400 bps signals broader risk-off → continued debt issuance freeze through month-end would confirm significant credit cycle turn.",
        impact_tags: [
          { asset: "Credit", detail: "Spreads widen (-)", direction: "-" },
          { asset: "Equities", detail: "Industrials (-)", direction: "-" },
          { asset: "FX", detail: "USD (+)", direction: "+" },
          { asset: "Rates", detail: "Treasuries (+)", direction: "+" }
        ]
      };
    case 'Equities':
      return {
        morning_takeaway: "Market breadth deteriorating → fragile concentration in mega-caps signals vulnerability to rotation shocks.",
        drivers: [
          {icon: TrendingDown, text: "**Sector rotation** from growth to value accelerating", weight: "medium"},
          {icon: BarChart3, text: "Narrowing **market breadth** with fewer stocks participating", weight: "high"},
          {icon: FileText, text: "**Earnings season surprises** and guidance updates", weight: "medium"}
        ],
        sentiment_rationale: [
          "**Market breadth deteriorating** with concentration risk in mega-cap stocks",
          "**Fragile and selective** market vulnerable to sentiment shocks", 
          "**Headline resilience** masking underlying structural weaknesses"
        ],
        outlook: "Advance-decline ratio below 1.0 for 5+ consecutive days → mega-cap leadership breakdown could trigger 5-10% broad market correction within 2-3 weeks.",
        impact_tags: [
          { asset: "Equities", detail: "Growth (-)", direction: "-" },
          { asset: "Equities", detail: "Value (+)", direction: "+" },
          { asset: "Rates", detail: "Neutral", direction: "=" },
          { asset: "FX", detail: "Mixed", direction: "=" }
        ]
      };
    case 'Global':
      return {
        morning_takeaway: "China demand weakness suppresses commodities → global growth outlook softens as stimulus efforts underperform.",
        drivers: [
          {icon: Factory, text: "Slowing demand from **China** post-reopening normalization", weight: "high"},
          {icon: Zap, text: "European **energy price volatility** creating uncertainty", weight: "medium"},
          {icon: DollarSign, text: "Strength of the **US Dollar (DXY)** pressuring EM", weight: "medium"}
        ],
        sentiment_rationale: [
          "**Structural slowdown** in China moving beyond cyclical weakness",
          "**Global commodity demand** declining as consumer confidence lags", 
          "**Multinational earnings** at risk from reduced China exposure"
        ],
        outlook: "Chinese PMI below 50 for 3+ months → global trade volume decline accelerates → commodity correction deepens 10-15% through Q2.",
        impact_tags: [
          { asset: "Equities", detail: "EM (-)", direction: "-" },
          { asset: "Commodities", detail: "Metals/Oil (-)", direction: "-" },
          { asset: "FX", detail: "USD (+)", direction: "+" },
          { asset: "Rates", detail: "Neutral", direction: "=" }
        ]
      };
    default:
      return baseDetails;
  }
};

const DriverItem = ({ item, delay }) => {
  const parts = item.text.split('**');
  const weightColors = {
    high: 'text-red-400',
    medium: 'text-amber-400', 
    low: 'text-green-400'
  };
  const weightDots = {
    high: 'bg-red-500',
    medium: 'bg-amber-500',
    low: 'bg-green-500'
  };
  
  return (
    <motion.li 
      className="flex items-start p-4 rounded-lg bg-white/5 border border-white/10" 
      variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 }}} 
      transition={{ delay: 0.1 + delay * 0.1 }}
    >
      <div className="flex items-center space-x-3 mr-4 mt-1">
        <div className={`w-2 h-2 rounded-full ${weightDots[item.weight]}`} />
        <span className={`text-xs font-bold uppercase ${weightColors[item.weight]} min-w-[60px]`}>
          {item.weight}
        </span>
      </div>
      <item.icon className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" strokeWidth={2} />
      <span className="text-gray-300">
        {parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="font-bold text-white">{part}</strong> : part)}
      </span>
    </motion.li>
  );
};

export default function SegmentDetailDrawer({ isOpen, onClose, segment, onNavigate }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose?.();
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen || !segment) return null;

  const theme = getTheme(segment.name);
  const details = getSegmentDetails(segment);
  const { Icon } = theme;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
  };

  const backdropVariants = {
    hidden: { opacity: 0, backdropFilter: 'blur(0px)' },
    visible: { opacity: 1, backdropFilter: 'blur(12px)', transition: { duration: 0.4 } }
  };

  const drawerVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 50, rotateX: -15 },
    visible: { opacity: 1, scale: 1, y: 0, rotateX: 0, transition: { type: 'spring', stiffness: 300, damping: 30, duration: 0.6 } },
    exit: { opacity: 0, scale: 0.95, y: 30, transition: { duration: 0.25, ease: 'easeIn' } }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        variants={backdropVariants}
        initial="hidden" animate="visible" exit="hidden"
        style={{ paddingTop: '80px' }}
      >
        <motion.div 
          className="absolute left-0 right-0 bottom-0 bg-black/60" 
          style={{ top: '80px' }}
          onClick={onClose} 
        />
        
        <motion.div
          key={segment.name}
          className={`relative w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden border ${theme.borderColor} shadow-2xl`}
          style={{
            background: `linear-gradient(135deg, rgba(15, 15, 25, 0.95) 0%, rgba(10, 10, 15, 0.98) 100%), linear-gradient(135deg, ${theme.gradient})`,
            backdropFilter: 'blur(20px)',
            boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 50px ${theme.glowColor}, inset 0 1px 0 rgba(255, 255, 255, 0.1)`
          }}
          variants={drawerVariants} initial="hidden" animate="visible" exit="exit"
        >
          <motion.div
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{ background: `linear-gradient(135deg, ${theme.glowColor} 0%, transparent 50%, ${theme.glowColor} 100%)`}}
            animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.005, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.div className="relative p-8 border-b border-white/10" variants={{ hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0 }}}>
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-5">
                <motion.div 
                  className="relative p-4 rounded-2xl border border-white/20 overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${theme.color}30, ${theme.color}15)`, backdropFilter: 'blur(10px)' }}
                  whileHover={{ scale: 1.05, rotate: 5 }} transition={{ type: "spring", stiffness: 300 }}
                >
                  <Icon className="w-7 h-7 relative z-10" style={{ color: theme.color }} strokeWidth={2} />
                </motion.div>
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-white mb-2">{segment.name} Analysis</h2>
                  <p className="text-sm font-medium text-gray-300">Detailed Segment Breakdown</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                  <motion.button
                    onClick={() => onNavigate('prev')}
                    className="relative p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm group hover:bg-white/10 transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Previous Segment"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors" strokeWidth={2} />
                  </motion.button>
                   <motion.button
                    onClick={() => onNavigate('next')}
                    className="relative p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm group hover:bg-white/10 transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Next Segment"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors" strokeWidth={2} />
                  </motion.button>
                <motion.button onClick={onClose} className="relative p-3 rounded-2xl bg-white/5 border border-white/10" whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}>
                  <X className="w-6 h-6 text-gray-300" />
                </motion.button>
              </div>
            </div>
          </motion.div>

          <motion.div 
            key={`${segment.name}-content`}
            className="overflow-y-auto max-h-[calc(90vh-140px)] p-8 space-y-10" 
            variants={containerVariants} 
            initial="hidden" 
            animate="visible"
          >
            {/* Morning Takeaway */}
            <LuxurySection icon={Sparkles} title="Morning Takeaway" iconColor="#FBCFE8">
              <motion.div 
                className="p-6 rounded-2xl border-l-4 relative overflow-hidden"
                style={{ 
                  borderColor: theme.color, 
                  background: `linear-gradient(90deg, ${theme.color}15, transparent 50%)`,
                }}
                whileHover={{ scale: 1.02 }}
              >
                <motion.div
                  className="absolute inset-0 opacity-20"
                  style={{ 
                    background: `radial-gradient(circle at left, ${theme.glowColor} 0%, transparent 60%)`
                  }}
                  animate={{ opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <p className="text-xl italic font-semibold text-white relative z-10">
                  "{details.morning_takeaway}"
                </p>
              </motion.div>
            </LuxurySection>

            {/* Key Drivers */}
            <LuxurySection icon={Target} title="Key Drivers" iconColor={theme.color}>
              <ul className="space-y-3">
                {details.drivers.map((driver, i) => (
                  <DriverItem key={i} item={driver} delay={i} />
                ))}
              </ul>
            </LuxurySection>

            {/* Impact Tags */}
            <LuxurySection icon={Target} title="Impact Tags" iconColor="#C4B5FD" delay={0.1}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {details.impact_tags.map((tag, i) => (
                  <ImpactTag key={i} tag={tag} delay={i * 0.05} />
                ))}
              </div>
            </LuxurySection>

            {/* Sentiment Rationale */}
            <LuxurySection icon={Eye} title="Sentiment Rationale" iconColor="#FBCFE8" delay={0.2}>
              <div className="p-6 rounded-2xl border border-white/10 bg-black/20 space-y-3">
                {details.sentiment_rationale.map((point, i) => (
                  <motion.div
                    key={i}
                    className="flex items-start"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                  >
                    <span className="text-blue-400 mr-3 mt-0.5">•</span>
                    <span 
                      className="text-base text-gray-300 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: point.replace(/\*\*(.*?)\*\*/g, '<strong class="text-amber-300 font-bold">$1</strong>') }}
                    />
                  </motion.div>
                ))}
              </div>
            </LuxurySection>
            
            {/* Forward Outlook */}
            <LuxurySection icon={TrendingUp} title="Forward Outlook" iconColor="#A7F3D0" delay={0.3}>
              <div className="p-6 rounded-2xl border border-white/10 bg-black/20 italic">
                <p className="text-base text-gray-300 leading-relaxed">"{details.outlook}"</p>
              </div>
            </LuxurySection>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
