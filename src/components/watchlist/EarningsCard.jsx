import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, BarChart2, TrendingUp, ChevronDown, CalendarPlus, BellPlus, Zap, ShieldCheck, ExternalLink } from 'lucide-react';
import CompanyLogo from './CompanyLogo';
import { Button } from '@/components/ui/button';

export default function EarningsCard({ event, theme, onAddToCalendar, onShowDetails }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const importanceStyles = {
    'Critical': 'from-red-500/80 to-orange-500/80',
    'High': 'from-amber-500/80 to-yellow-500/80',
    'Medium': 'from-blue-500/80 to-sky-500/80',
  };
  
  const consensusStyles = {
    'Beat Expected': 'text-green-400',
    'Mixed Views': 'text-amber-400',
    'Miss Expected': 'text-red-400',
  }

  const cardVariants = {
    initial: { opacity: 0, y: 30, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.98 },
  };

  return (
    <motion.div
      layout
      variants={cardVariants}
      transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
      className="w-full"
    >
      <div 
        className={`
          group relative overflow-hidden rounded-3xl cursor-pointer
          transition-all duration-500 ease-out border
          ${isExpanded 
            ? 'shadow-2xl shadow-blue-500/20 border-blue-500/40' 
            : 'hover:shadow-xl hover:shadow-black/50 border-white/10 hover:border-white/20'
          }
          bg-gradient-to-br from-white/[0.03] to-white/[0.02] backdrop-blur-2xl
        `}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Hover Glow Effect */}
        <motion.div 
          className="absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-400"
          style={{
            background: 'radial-gradient(600px at 50% 50%, rgba(0, 110, 255, 0.2), transparent 80%)'
          }}
        />
        
        <div className="relative z-10 p-5 md:p-6">
          <div className="flex items-center justify-between gap-4">
            {/* Importance Beacon */}
            <div className="flex-shrink-0 flex items-center justify-center">
              <div className={`relative w-4 h-24 rounded-full bg-gradient-to-b ${importanceStyles[event.importance] || 'from-gray-500/50 to-gray-600/50'}`}>
                <motion.div 
                  className="absolute inset-0 rounded-full blur-md"
                  style={{ background: `linear-gradient(to bottom, ${importanceStyles[event.importance]?.replace('/80', '/30') || 'transparent'})` }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
            </div>

            {/* Main Info */}
            <div className="flex items-center gap-4 flex-1">
              <CompanyLogo ticker={event.ticker} className="w-12 h-12 md:w-14 md:h-14" />
              <div className="flex-1 min-w-0">
                <p className="text-2xl font-black tracking-[-0.02em] text-white">
                  {event.ticker}
                </p>
                <p className="text-sm truncate text-gray-400 group-hover:text-gray-300 transition-colors">
                  {event.name}
                </p>
              </div>
            </div>

            {/* Quick Actions & Stats */}
            <div className="flex items-center gap-4">
              {/* Detailed Analysis Button */}
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onShowDetails?.(event);
                }}
                className="p-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 hover:border-purple-500/50 text-purple-300 hover:text-white transition-all duration-300 hover:scale-105"
                whileHover={{ rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                title="Detailed Analysis"
              >
                <ExternalLink className="w-5 h-5" />
              </motion.button>

              {/* Key Stats */}
              <div className="text-right hidden sm:block">
                <p className="text-xs font-medium tracking-wide uppercase text-gray-500">
                  EPS Estimate
                </p>
                <p className="text-2xl font-bold tracking-tight text-white">
                  {event.estimate}
                </p>
              </div>
              
              <div className="text-right hidden md:block">
                <p className="text-xs font-medium tracking-wide uppercase text-gray-500">
                  Market Cap
                </p>
                <p className="text-2xl font-bold tracking-tight text-white">
                  {event.marketCap}
                </p>
              </div>

              {/* Expand Toggle */}
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-white/[0.05] border border-white/10"
              >
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </motion.div>
            </div>
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: '1.5rem' }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="border-t pt-6 border-white/[0.1]">
                  {/* Detailed Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-6">
                    <StatPill icon={Zap} label="Consensus" value={event.consensus} valueColor={consensusStyles[event.consensus]} />
                    <StatPill icon={TrendingUp} label="Pre-Mkt Move" value={event.preMarketMove} valueColor={event.preMarketMove.startsWith('+') ? 'text-green-400' : 'text-red-400'} />
                    <StatPill icon={BarChart2} label="Options Vol" value={event.optionsVolume} />
                    <StatPill icon={ShieldCheck} label="Analyst Rating" value={event.analystRating} valueColor="text-sky-400"/>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center justify-end space-x-3">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => { e.stopPropagation(); onAddToCalendar(event); }}
                      className="group flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold backdrop-blur-lg border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all duration-300"
                    >
                      <CalendarPlus className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                      <span>Add to Calendar</span>
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={(e) => e.stopPropagation()}
                      className="group flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:scale-105 transition-all duration-300"
                    >
                      <BellPlus className="w-4 h-4 transition-transform duration-300 group-hover:animate-pulse" />
                      <span>Set Smart Alert</span>
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

const StatPill = ({ icon: Icon, label, value, valueColor = 'text-white' }) => (
  <div className="p-4 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-xl">
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5">
        <Icon className="w-4 h-4 text-gray-400" />
      </div>
      <div>
        <p className="text-xs font-medium uppercase text-gray-500">{label}</p>
        <p className={`text-base font-bold tracking-tight ${valueColor}`}>{value}</p>
      </div>
    </div>
  </div>
);