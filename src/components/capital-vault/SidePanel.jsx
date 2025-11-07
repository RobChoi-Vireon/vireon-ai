import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Link, Target, Eye, TrendingUp, Book } from 'lucide-react';

export default function SidePanel({ 
  viewMode, 
  setViewMode, 
  onCategorySelect, 
  relatedTerms = [], 
  pitfalls = [], 
  onTermClick, 
  theme 
}) {
  const viewModes = [
    { id: 'pro', label: 'Pro Level', icon: TrendingUp },
    { id: 'novice', label: 'Novice Level', icon: Book },
    { id: 'principles', label: 'First Principles', icon: Target }
  ];

  const categories = [
    'Markets', 'Accounting', 'Macro', 'Derivatives', 
    'Fixed Income', 'Quant', 'Corporate Finance', 'Statistics'
  ];

  const handleCategoryClick = (category) => {
    if (onCategorySelect) {
      onCategorySelect(category);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-24 space-y-6"
    >
      {/* View Mode Selector */}
      <div className="p-5 rounded-2xl elevation-1 backdrop-blur-xl" style={{backgroundColor: theme === 'dark' ? 'rgba(26, 29, 41, 0.8)' : 'rgba(255, 255, 255, 0.9)', border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`}}>
        <h3 className="text-lg font-bold mb-4">View Mode</h3>
        <div className="space-y-2">
          {viewModes.map(mode => (
            <button 
              key={mode.id}
              onClick={() => setViewMode(mode.id)}
              className={`w-full flex items-center justify-start p-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                viewMode === mode.id 
                  ? theme === 'dark' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-blue-100 text-blue-700 border border-blue-200'
                  : theme === 'dark' ? 'bg-white/5 hover:bg-white/10 text-gray-300' : 'bg-gray-50 hover:bg-gray-100 text-gray-600'
              }`}
            >
              <mode.icon className="w-4 h-4 mr-2" />
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="p-5 rounded-2xl elevation-1 backdrop-blur-xl" style={{backgroundColor: theme === 'dark' ? 'rgba(26, 29, 41, 0.8)' : 'rgba(255, 255, 255, 0.9)', border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`}}>
        <div className="flex items-center text-lg font-bold mb-4">
          <Eye className="w-5 h-5 mr-2" />
          Categories
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 ${theme === 'dark' ? 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-300' : 'bg-purple-100 hover:bg-purple-200 text-purple-700'}`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      {/* Related Terms - Only show if we have terms */}
      {relatedTerms && relatedTerms.length > 0 && (
        <div className="p-5 rounded-2xl elevation-1 backdrop-blur-xl" style={{backgroundColor: theme === 'dark' ? 'rgba(26, 29, 41, 0.8)' : 'rgba(255, 255, 255, 0.9)', border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`}}>
          <div className="flex items-center text-lg font-bold mb-4">
            <Link className="w-5 h-5 mr-2" /> Related Terms
          </div>
          <div className="flex flex-wrap gap-2">
            {relatedTerms.map((term, index) => (
              <button
                key={`${term}-${index}`}
                onClick={() => onTermClick && onTermClick(term)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 ${theme === 'dark' ? 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-300' : 'bg-blue-100 hover:bg-blue-200 text-blue-700'}`}
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Common Pitfalls - Only show if we have pitfalls */}
      {pitfalls && pitfalls.length > 0 && (
        <div className="p-5 rounded-2xl elevation-1 backdrop-blur-xl" style={{backgroundColor: theme === 'dark' ? 'rgba(26, 29, 41, 0.8)' : 'rgba(255, 255, 255, 0.9)', border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`}}>
          <div className="flex items-center text-lg font-bold mb-4">
            <AlertCircle className="w-5 h-5 mr-2" /> Common Pitfalls
          </div>
          <ul className="space-y-2 list-disc list-inside text-sm" style={{color: 'var(--text-secondary)'}}>
            {pitfalls.map((pitfall, i) => (
              <li key={i}>{pitfall}</li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}