import React from 'react';
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Flame, TrendingUp, TrendingDown, Minus, Clock } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';

export default function ArticleCard({ article, theme }) {

  const getSentimentStyle = () => {
    switch (article.sentiment) {
      case 'Bullish': return {
        icon: <TrendingUp className="w-4 h-4 text-green-400" />,
        badge: 'border-green-500/40 bg-green-500/15 text-green-400',
        border: 'border-l-green-500/60',
        glow: 'shadow-green-500/20'
      };
      case 'Bearish': return {
        icon: <TrendingDown className="w-4 h-4 text-red-400" />,
        badge: 'border-red-500/40 bg-red-500/15 text-red-400',
        border: 'border-l-red-500/60',
        glow: 'shadow-red-500/20'
      };
      default: return {
        icon: <Minus className="w-4 h-4 text-gray-400" />,
        badge: 'border-gray-500/40 bg-gray-500/15 text-gray-400',
        border: 'border-l-gray-500/60',
        glow: 'shadow-gray-500/20'
      };
    }
  };

  const sentimentStyle = getSentimentStyle();

  const impactColor = article.impact_score >= 7 
    ? 'text-orange-400' 
    : article.impact_score >= 4 
    ? 'text-yellow-400' 
    : 'text-blue-400';

  const impactGlow = article.impact_score >= 7 
    ? 'shadow-orange-500/20' 
    : article.impact_score >= 4 
    ? 'shadow-yellow-500/20' 
    : 'shadow-blue-500/20';

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={`
        group relative overflow-hidden rounded-3xl p-8 cursor-pointer backdrop-blur-xl border
        transition-all duration-500 hover:shadow-2xl
        ${theme === 'dark' 
          ? 'bg-gradient-to-br from-[#1A1D29]/60 to-[#12141C]/60 border-white/10 hover:border-white/25' 
          : 'bg-gradient-to-br from-white/80 to-white/60 border-black/[0.08] hover:border-black/[0.15]'
        }
        border-l-4 ${sentimentStyle.border} ${sentimentStyle.glow}
      `}
      style={{
        boxShadow: `0 10px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)`
      }}
    >
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />

      {article.is_breaking && (
        <motion.div 
          className="absolute top-6 right-6 flex items-center space-x-2 text-red-400 text-xs font-black uppercase tracking-wider"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Flame className="w-5 h-5" />
          <span>BREAKING</span>
        </motion.div>
      )}
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex-grow space-y-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-sm ${theme === 'dark' ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                {article.source}
              </div>
              <div className="flex items-center space-x-1 text-xs text-gray-400">
                <Clock className="w-3 h-3" />
                <span>{formatDistanceToNow(new Date(article.published_date), { addSuffix: true })}</span>
              </div>
            </div>
            <h3 className={`text-xl font-bold leading-tight group-hover:text-blue-400 transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {article.title}
            </h3>
          </div>
          
          <p className={`text-base leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            {article.summary}
          </p>
        </div>
        
        <div className="mt-8 pt-6 border-t flex justify-between items-center" style={{borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}}>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className={`${sentimentStyle.badge} font-semibold px-3 py-1 rounded-full`}>
              {sentimentStyle.icon}
              <span className="ml-2">{article.sentiment}</span>
            </Badge>
            <motion.div 
              className={`text-sm font-black flex items-center ${impactColor} ${impactGlow}`}
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
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
          >
            <ExternalLink className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'}`} />
          </motion.a>
        </div>
      </div>

      {/* Hover gradient effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 via-transparent to-purple-500/5 rounded-3xl" />
      </div>
    </motion.div>
  );
}