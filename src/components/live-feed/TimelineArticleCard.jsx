import React from 'react';
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Flame, TrendingUp, TrendingDown, Minus, Newspaper, Clock } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';

// Enhanced Animated Background Graphics Component
const AnimatedGraphic = ({ theme, index }) => {
  const graphics = {
    dots: (
      <div className="absolute inset-0 overflow-hidden opacity-15">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-blue-400' : 'bg-blue-500'}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.5, 1.5, 0.5],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 4 + i * 0.3,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    ),
    waves: (
      <div className="absolute inset-0 overflow-hidden opacity-12">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute inset-0 border-2 rounded-full ${theme === 'dark' ? 'border-purple-400/40' : 'border-purple-500/50'}`}
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ 
              scale: [0, 2, 2.5],
              opacity: [0.8, 0.4, 0]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              delay: i * 1.5,
              ease: "easeOut"
            }}
          />
        ))}
      </div>
    ),
    pulse: (
      <div className="absolute inset-0 flex items-center justify-center opacity-8">
        <motion.div
          className={`w-40 h-40 rounded-full border-2 ${theme === 'dark' ? 'border-green-400/50' : 'border-green-500/60'}`}
          animate={{
            scale: [1, 1.5, 1],
            rotate: [0, 180, 360],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    ),
    sparkles: (
      <div className="absolute inset-0 overflow-hidden opacity-20">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${15 + (i % 4) * 25}%`,
              top: `${15 + Math.floor(i / 4) * 25}%`,
            }}
            animate={{
              y: [-15, 15, -15],
              x: [-8, 8, -8],
              rotate: [0, 360],
              opacity: [0.2, 1, 0.2],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{
              duration: 5 + i * 0.7,
              repeat: Infinity,
              delay: i * 0.8,
              ease: "easeInOut"
            }}
          >
            <div className={`w-3 h-3 ${theme === 'dark' ? 'bg-yellow-400' : 'bg-yellow-500'} rounded-full shadow-lg`} />
          </motion.div>
        ))}
      </div>
    )
  };

  const graphicTypes = ['dots', 'waves', 'pulse', 'sparkles'];
  const selectedType = graphicTypes[index % graphicTypes.length];
  
  return graphics[selectedType] || graphics.dots;
};

export default function TimelineArticleCard({ article, index, theme }) {
  const getSentimentStyle = () => {
    switch (article.sentiment) {
      case 'Bullish': return { 
        icon: <TrendingUp className="w-4 h-4 text-green-400" />, 
        badge: 'border-green-500/40 bg-green-500/15 text-green-400',
        nodeColor: 'bg-green-500/30 border-green-500/50'
      };
      case 'Bearish': return { 
        icon: <TrendingDown className="w-4 h-4 text-red-400" />, 
        badge: 'border-red-500/40 bg-red-500/15 text-red-400',
        nodeColor: 'bg-red-500/30 border-red-500/50'
      };
      default: return { 
        icon: <Minus className="w-4 h-4 text-gray-400" />, 
        badge: 'border-gray-500/40 bg-gray-500/15 text-gray-400',
        nodeColor: 'bg-blue-500/30 border-blue-500/50'
      };
    }
  };

  const sentimentStyle = getSentimentStyle();
  const impactColor = article.impact_score >= 7 ? 'text-orange-400' : article.impact_score >= 4 ? 'text-yellow-400' : 'text-blue-400';
  const isEven = index % 2 === 0;

  const cardVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.6, 
        delay: index * 0.1, 
        ease: [0.25, 1, 0.5, 1] 
      } 
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="relative"
    >
      {/* Mobile Layout */}
      <div className="md:hidden flex items-start space-x-6">
        {/* Mobile Timeline Node */}
        <div className="relative flex-shrink-0 mt-3">
          <motion.div 
            className={`w-8 h-8 rounded-2xl flex items-center justify-center backdrop-blur-sm border-2 ${sentimentStyle.nodeColor}`}
            whileHover={{ scale: 1.2, rotate: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Newspaper className={`w-4 h-4 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
          </motion.div>
          {/* Mobile Timeline Line */}
          <div className={`absolute top-8 left-1/2 transform -translate-x-1/2 w-1 h-12 rounded-full ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`} />
        </div>
        
        {/* Mobile Article Card */}
        <motion.div
          className="flex-1"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <div className={`
            group relative overflow-hidden rounded-2xl p-6 cursor-pointer backdrop-blur-xl border
            transition-all duration-300 hover:shadow-2xl
            ${theme === 'dark' 
              ? 'bg-gradient-to-br from-[#1A1D29]/60 to-[#12141C]/60 border-white/10 hover:border-white/25' 
              : 'bg-gradient-to-br from-white/80 to-white/60 border-black/[0.08] hover:border-black/[0.15]'
            }
          `}>
            {article.is_breaking && (
              <motion.div 
                className="absolute top-3 right-3 flex items-center space-x-1 text-red-400 text-xs font-black uppercase tracking-wider"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Flame className="w-4 h-4" />
                <span>BREAKING</span>
              </motion.div>
            )}
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${theme === 'dark' ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                  {article.source}
                </div>
                <div className="flex items-center space-x-1 text-xs text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span>{formatDistanceToNow(new Date(article.published_date), { addSuffix: true })}</span>
                </div>
              </div>
              
              <h3 className={`text-lg font-bold leading-snug ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {article.title}
              </h3>
              
              <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {article.summary}
              </p>
              
              <div className="flex flex-wrap gap-3 items-center justify-between pt-3 border-t" style={{borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}}>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={`${sentimentStyle.badge} text-xs font-bold px-3 py-1 rounded-full`}>
                    {sentimentStyle.icon}
                    <span className="ml-2">{article.sentiment}</span>
                  </Badge>
                  <div className={`text-xs font-black ${impactColor}`}>
                    Impact: {article.impact_score}/10
                  </div>
                </div>
                <motion.a 
                  href={article.source_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="opacity-60 group-hover:opacity-100 transition-opacity p-2 rounded-lg hover:bg-white/10"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <ExternalLink className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'}`} />
                </motion.a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Desktop Layout - Enhanced */}
      <div className="hidden md:flex items-center">
        
        {/* Card Container */}
        <div className={`flex-1 ${isEven ? 'pr-12 order-1' : 'pl-12 order-3'}`}>
          <motion.div 
            className={`
              group relative overflow-hidden rounded-3xl p-8 cursor-pointer backdrop-blur-xl border
              transition-all duration-500 hover:shadow-3xl
              ${theme === 'dark' 
                ? 'bg-gradient-to-br from-[#1A1D29]/60 to-[#12141C]/60 border-white/10 hover:border-white/25' 
                : 'bg-gradient-to-br from-white/80 to-white/60 border-black/[0.08] hover:border-black/[0.15]'
              }
            `}
            whileHover={{ scale: 1.03, y: -5 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {article.is_breaking && (
              <motion.div 
                className="absolute top-4 right-4 flex items-center space-x-3 text-red-400 text-sm font-black uppercase tracking-wider"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Flame className="w-5 h-5" />
                <span>BREAKING NEWS</span>
              </motion.div>
            )}
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className={`text-sm font-bold uppercase tracking-wider px-4 py-2 rounded-full backdrop-blur-sm ${theme === 'dark' ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                  {article.source}
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{formatDistanceToNow(new Date(article.published_date), { addSuffix: true })}</span>
                </div>
              </div>
              
              <h3 className={`text-2xl font-bold leading-tight group-hover:text-blue-400 transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {article.title}
              </h3>
              
              <p className={`text-base leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {article.summary}
              </p>
              
              <div className="flex flex-wrap gap-4 items-center justify-between pt-4 border-t" style={{borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}}>
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className={`${sentimentStyle.badge} font-bold px-4 py-2 rounded-full`}>
                    {sentimentStyle.icon}
                    <span className="ml-2">{article.sentiment}</span>
                  </Badge>
                  <motion.div 
                    className={`text-sm font-black ${impactColor}`}
                    whileHover={{ scale: 1.05 }}
                  >
                    Impact: {article.impact_score}/10
                  </motion.div>
                </div>
                <motion.a 
                  href={article.source_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`opacity-0 group-hover:opacity-100 transition-all duration-300 p-3 rounded-xl backdrop-blur-sm ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ExternalLink className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'}`} />
                </motion.a>
              </div>
            </div>

            {/* Hover gradient effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl">
              <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 via-transparent to-purple-500/5" />
            </div>
          </motion.div>
        </div>

        {/* Desktop Timeline Node - Enhanced */}
        <div className="relative z-10 flex-shrink-0 order-2">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 400 }}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-sm border-2 ${sentimentStyle.nodeColor} shadow-lg`}
            whileHover={{ scale: 1.2, rotate: 15 }}
          >
            <Newspaper className={`w-6 h-6 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
          </motion.div>
        </div>

        {/* Empty space with enhanced animated graphics */}
        <div className={`flex-1 ${isEven ? 'pl-12 order-3' : 'pr-12 order-1'} relative h-40`}>
          <AnimatedGraphic theme={theme} index={index} />
        </div>
      </div>
    </motion.div>
  );
}