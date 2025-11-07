import React, { useState } from 'react';
import { format, formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Clock,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// FINAL FIX: Robust safe text extraction function
const safeText = (value, defaultText = "") => {
  if (value === null || value === undefined) return defaultText;
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (typeof value === 'object') {
    // Prioritize known keys, but handle any string property
    if (value.summary && typeof value.summary === 'string') return value.summary;
    if (value.text && typeof value.text === 'string') return value.text;
    if (value.content && typeof value.content === 'string') return value.content;
    if (value.analysis && typeof value.analysis === 'string') return value.analysis;
    if (value.rationale && typeof value.rationale === 'string') return value.rationale;
    if (value.response && typeof value.response === 'string') return value.response;
    if (value.message && typeof value.message === 'string') return value.message;
    
    // Fallback to the first string property found
    for (const key in value) {
      if (typeof value[key] === 'string') return value[key];
    }

    // If no string property, stringify the object
    try {
      return JSON.stringify(value);
    } catch (e) {
      return defaultText;
    }
  }
  return String(value);
};

// Safe array extraction function
const safeArray = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') return [value];
  if (value === null || value === undefined) return [];
  if (typeof value === 'object') {
    // Try to extract array from common object patterns
    if (value.items && Array.isArray(value.items)) return value.items;
    if (value.list && Array.isArray(value.list)) return value.list;
    if (value.values && Array.isArray(value.values)) return value.values;
  }
  return [];
};

export default function NewsCard({ 
  article, 
  onToggleBookmark 
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Safe sentiment icon function
  const getSentimentIcon = (sentiment) => {
    const sentimentStr = safeText(sentiment).toLowerCase();
    switch (sentimentStr) {
      case "bullish": 
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case "bearish": 
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: 
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  // Safe sentiment color function
  const getSentimentColor = (sentiment) => {
    const sentimentStr = safeText(sentiment).toLowerCase();
    switch (sentimentStr) {
      case "bullish":
        return "bg-green-100 text-green-800 border-green-200";
      case "bearish":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getImpactColor = (score) => {
    const numScore = typeof score === 'number' ? score : parseInt(safeText(score, '0'));
    if (numScore >= 8) return "bg-red-100 text-red-800 border-red-200";
    if (numScore >= 6) return "bg-orange-100 text-orange-800 border-orange-200";
    if (numScore >= 4) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getSectorColor = (sector) => {
    const sectorStr = safeText(sector);
    const colors = {
      "Technology": "bg-blue-100 text-blue-800 border-blue-200",
      "Energy": "bg-green-100 text-green-800 border-green-200",
      "Healthcare": "bg-pink-100 text-pink-800 border-pink-200",
      "Financial Services": "bg-indigo-100 text-indigo-800 border-indigo-200",
      "Consumer": "bg-purple-100 text-purple-800 border-purple-200",
      "Industrial": "bg-gray-100 text-gray-800 border-gray-200",
      "Real Estate": "bg-amber-100 text-amber-800 border-amber-200",
      "Utilities": "bg-cyan-100 text-cyan-800 border-cyan-200",
      "Materials": "bg-lime-100 text-lime-800 border-lime-200",
      "Communications": "bg-rose-100 text-rose-800 border-rose-200"
    };
    return colors[sectorStr] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  // Safely extract article properties
  const title = safeText(article?.title, 'No title available');
  const summary = safeText(article?.summary, '');
  const content = safeText(article?.content, '');
  const source = safeText(article?.source, 'Unknown source');
  const publishedDate = article?.published_date || new Date().toISOString();
  const sentiment = safeText(article?.sentiment, 'Neutral');
  const sector = safeText(article?.sector, 'General');
  const category = safeText(article?.category, 'News');
  const impactScore = typeof article?.impact_score === 'number' ? article.impact_score : parseInt(safeText(article?.impact_score, '5'));
  const sourceUrl = safeText(article?.source_url, '');
  const isBreaking = Boolean(article?.is_breaking);
  const isBookmarked = Boolean(article?.is_bookmarked);
  const tickersMentioned = safeArray(article?.tickers_mentioned);
  const keyInsights = safeArray(article?.key_insights);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/60 rounded-xl overflow-hidden hover:shadow-lg dark:hover:shadow-gray-900/50 transition-shadow duration-300"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 mr-4">
            <div className="flex items-center gap-2 mb-2">
              {isBreaking && (
                <Badge className="bg-red-100 text-red-800 border-red-200 font-semibold text-xs px-2 py-1">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  BREAKING
                </Badge>
              )}
              <Badge className={getSectorColor(sector)}>
                {sector}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {category}
              </Badge>
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight mb-3 cursor-pointer hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}>
              {title}
            </h3>

            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
              <span className="font-medium text-gray-700 dark:text-gray-300">{source}</span>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDistanceToNow(new Date(publishedDate), { addSuffix: true })}
              </div>
              <div className="flex items-center gap-1">
                {getSentimentIcon(sentiment)}
                <Badge className={getSentimentColor(sentiment)}>
                  {sentiment}
                </Badge>
              </div>
              <Badge className={getImpactColor(impactScore)}>
                Impact: {impactScore}/10
              </Badge>
            </div>

            {tickersMentioned.length > 0 && (
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tickers:</span>
                <div className="flex gap-1 flex-wrap">
                  {tickersMentioned.slice(0, 5).map((ticker, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs font-mono">
                      ${safeText(ticker)}
                    </Badge>
                  ))}
                  {tickersMentioned.length > 5 && (
                    <Badge variant="outline" className="text-xs">
                      +{tickersMentioned.length - 5} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleBookmark && onToggleBookmark(article)}
              className={isBookmarked ? "text-blue-600 hover:text-blue-700" : "text-gray-400 hover:text-gray-600"}
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-5 h-5" />
              ) : (
                <Bookmark className="w-5 h-5" />
              )}
            </Button>
            
            {sourceUrl && sourceUrl !== '#' && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.open(sourceUrl, '_blank')}
                className="text-gray-400 hover:text-gray-600"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Summary */}
        {summary && (
          <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            {summary}
          </p>
        )}

        {/* Key Insights */}
        {keyInsights.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Key Insights:</h4>
            <ul className="space-y-1">
              {keyInsights.map((insight, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>{safeText(insight)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Expand/Collapse for full content */}
        <AnimatePresence>
          {isExpanded && content && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Full Article:</h4>
                <div className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                  {content}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expand Button */}
        {content && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-3 text-blue-600 hover:text-blue-700 p-0 h-auto font-medium"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4 mr-1" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-1" />
                Read Full Article
              </>
            )}
          </Button>
        )}
      </div>
    </motion.div>
  );
}