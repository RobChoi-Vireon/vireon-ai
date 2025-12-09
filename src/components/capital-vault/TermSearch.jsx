import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, History, TrendingUp, Zap, Brain, Clock } from 'lucide-react';

const trendingChips = [
  { id: "fixed-income", label: "Fixed Income", action: "category", category: "Fixed Income", icon: Zap },
  { id: "quant", label: "Quant", action: "category", category: "Quant", icon: Brain },
  { id: "derivatives", label: "Derivatives", action: "category", category: "Derivatives", icon: TrendingUp },
  { id: "macro", label: "Macro", action: "category", category: "Macro", icon: Search }
];

export default function TermSearch({ onSearch, theme, isLoading, history, setHistory, searchTerm, setSearchTerm, suggestions = [] }) {
  const [query, setQuery] = useState(searchTerm || '');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  // Sync with external searchTerm changes
  useEffect(() => {
    setQuery(searchTerm || '');
  }, [searchTerm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setSearchTerm && setSearchTerm(query.trim());
      setIsFocused(false);
      inputRef.current.blur();
    }
  };

  const handleHistoryClick = (term) => {
    setQuery(term);
    onSearch(term);
    setSearchTerm && setSearchTerm(term);
    setIsFocused(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    onSearch(suggestion);
    setSearchTerm && setSearchTerm(suggestion);
    setIsFocused(false);
  };
  
  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('vireon-vault-history');
  };

  const handleChipClick = (chip) => {
    const categoryTerms = {
      "Fixed Income": "Duration",
      "Quant": "Sharpe ratio",
      "Derivatives": "Black-Scholes", 
      "Macro": "Yield curve"
    };
    
    const term = categoryTerms[chip.category] || chip.category;
    setQuery(term);
    onSearch(term);
    setSearchTerm && setSearchTerm(term);
  };

  const handleInputChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    
    // Instant search for suggestions
    if (newQuery.length >= 2 && suggestions.length > 0) {
      const exactMatch = suggestions.find(s => s.toLowerCase() === newQuery.toLowerCase());
      if (exactMatch) {
        // Trigger instant search
        setTimeout(() => {
          onSearch(exactMatch);
          setSearchTerm && setSearchTerm(exactMatch);
        }, 50);
      }
    }
  };

  return (
    <div className="relative max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center w-full">
          <div className="absolute inset-0 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.3)]" />
          
          <div className="relative flex items-center w-full">
            <div className="absolute left-6 z-10">
              <Search className={`w-6 h-6 transition-colors duration-300 ${isFocused ? 'text-purple-400' : 'text-gray-400'}`} />
            </div>
            
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 150)}
              placeholder="Search any finance term for instant results..."
              className="w-full h-20 pl-16 pr-20 rounded-3xl text-xl font-medium transition-all duration-300 focus:outline-none focus:ring-0 bg-gradient-to-br from-[#1A1D29]/90 to-[#12141C]/90 border border-white/20 hover:border-white/30 focus:border-purple-500/50 text-white placeholder-gray-400 backdrop-blur-2xl"
            />
            
            <div className="absolute right-6 flex items-center space-x-3 z-10">
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setSearchTerm('');
                    onSearch('');
                  }}
                  className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400 hover:text-white" />
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Enhanced dropdown */}
        <AnimatePresence>
          {isFocused && (suggestions.length > 0 || history.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full mt-4 w-full p-4 rounded-3xl z-50 backdrop-blur-2xl border border-white/20"
              style={{ 
                background: 'linear-gradient(135deg, rgba(26, 29, 41, 0.95) 0%, rgba(18, 20, 28, 0.95) 100%)'
              }}
            >
              {/* Instant Suggestions */}
              {suggestions.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center space-x-3 px-2 pt-1 pb-3">
                    <Clock className="w-4 h-4 text-green-400" />
                    <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400">Instant Results</h4>
                  </div>
                  <div className="space-y-2">
                    {suggestions.slice(0, 4).map((suggestion, index) => (
                      <button
                        key={suggestion}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full text-left px-4 py-3 rounded-2xl flex items-center transition-all duration-200 hover:bg-white/10 group bg-green-500/5 border border-green-500/20"
                      >
                        <Zap className="w-4 h-4 mr-4 text-green-400" />
                        <span className="font-medium text-white">{suggestion}</span>
                        <div className="ml-auto text-xs px-2 py-1 rounded bg-green-500/20 text-green-300">INSTANT</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* History */}
              {history.length > 0 && (
                <div>
                  <div className="flex justify-between items-center px-2 pt-1 pb-3">
                    <div className="flex items-center space-x-3">
                      <History className="w-4 h-4 text-purple-400" />
                      <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400">Recent</h4>
                    </div>
                    <button 
                      onClick={handleClearHistory} 
                      className="text-xs font-medium text-gray-400 hover:text-white transition-colors px-3 py-1 rounded-full hover:bg-white/10"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="space-y-2">
                    {history.slice(0, 4).map((term, index) => (
                      <button
                        key={term}
                        onClick={() => handleHistoryClick(term)}
                        className="w-full text-left px-4 py-3 rounded-2xl flex items-center transition-all duration-200 hover:bg-white/10 group"
                      >
                        <History className="w-4 h-4 mr-4 text-gray-400 group-hover:text-purple-400 transition-colors" />
                        <span className="font-medium text-gray-300 group-hover:text-white transition-colors">{term}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      {/* Working trending chips */}
      <div className="mt-8 flex flex-wrap justify-center gap-3 sm:gap-4 max-w-3xl mx-auto px-4">
        {trendingChips.map((chip, index) => {
          const IconComponent = chip.icon;
          return (
            <button
              key={chip.id}
              onClick={() => handleChipClick(chip)}
              className="flex items-center space-x-2 sm:space-x-3 px-4 sm:px-6 py-2 sm:py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 backdrop-blur-xl border border-white/20 hover:border-white/40 text-gray-300 hover:text-white group"
              style={{ background: 'rgba(255, 255, 255, 0.05)' }}
            >
              <IconComponent className="w-3.5 sm:w-4 h-3.5 sm:h-4 group-hover:text-purple-400 transition-colors" />
              <span>{chip.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}