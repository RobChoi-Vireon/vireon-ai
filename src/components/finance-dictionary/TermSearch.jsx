import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, X, History, TrendingUp } from 'lucide-react';

const trendingChips = ["A-Z Index", "Trending", "Newest", "Fixed Income", "Quant"];

export default function TermSearch({ onSearch, theme, isLoading, history, setHistory }) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setIsFocused(false);
      inputRef.current.blur();
    }
  };

  const handleHistoryClick = (term) => {
    setQuery(term);
    onSearch(term);
    setIsFocused(false);
  };
  
  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('vireon-dict-history');
  }

  return (
    <div className="relative max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div 
          className={`
            absolute inset-0 rounded-2xl transition-all duration-300
            ${isFocused 
              ? theme === 'dark' ? 'shadow-[0_0_0_2px_#4DA3FF,0_8px_32px_rgba(77,163,255,0.15)]' : 'shadow-[0_0_0_2px_#2D7FF9,0_8px_32px_rgba(45,127,249,0.15)]'
              : ''
            }
          `}
        />
        <div className="relative flex items-center w-full">
          <Search className={`absolute left-5 w-5 h-5 transition-colors ${isFocused ? (theme === 'dark' ? 'text-blue-300' : 'text-blue-600') : (theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}`} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 150)} // Delay to allow history click
            placeholder="Search any finance or econ term..."
            className={`
              w-full h-16 pl-14 pr-16 rounded-2xl text-lg font-medium transition-all
              focus:outline-none focus:ring-0
              ${theme === 'dark' ? 'bg-[#1A1D29] border border-white/10 text-white placeholder-gray-500' : 'bg-white border border-gray-200 text-gray-900 placeholder-gray-400'}
            `}
          />
          <div className="absolute right-5 flex items-center space-x-3">
            {isLoading && (
              <div className="w-5 h-5 border-2 border-t-transparent border-blue-400 rounded-full animate-spin" />
            )}
          </div>
        </div>
      </form>
      <AnimatePresence>
        {isFocused && history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`absolute top-full mt-2 w-full p-2 rounded-2xl z-10 ${theme === 'dark' ? 'bg-[#1A1D29] border border-white/10' : 'bg-white border border-gray-200 shadow-lg'}`}
          >
            <div className="flex justify-between items-center px-2 pt-1 pb-2">
                <h4 className={`text-xs font-bold uppercase ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Recent Searches</h4>
                <button onClick={handleClearHistory} className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'}`}>Clear</button>
            </div>
            {history.map(term => (
              <button
                key={term}
                onClick={() => handleHistoryClick(term)}
                className={`w-full text-left px-4 py-2.5 rounded-lg flex items-center transition-colors ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-100'}`}
              >
                <History className={`w-4 h-4 mr-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className="font-medium">{term}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        {trendingChips.map(chip => (
          <button key={chip} className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${theme === 'dark' ? 'bg-white/5 text-gray-300 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
}