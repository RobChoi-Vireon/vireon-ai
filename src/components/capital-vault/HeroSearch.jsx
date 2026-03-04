import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, History, Zap, Clock } from 'lucide-react';

const HINT_EXAMPLES = [
  "What is term premium?",
  "What drives credit spreads?",
  "What is convexity?",
  "What is the equity risk premium?"
];

export default function HeroSearch({ onSearch, isLoading, history, setHistory, searchTerm, setSearchTerm, suggestions = [] }) {
  const [query, setQuery] = useState(searchTerm || '');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { setQuery(searchTerm || ''); }, [searchTerm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setSearchTerm?.(query.trim());
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  const handleSuggestionClick = (s) => {
    setQuery(s); onSearch(s); setSearchTerm?.(s); setIsFocused(false);
  };

  const handleHistoryClick = (t) => {
    setQuery(t); onSearch(t); setSearchTerm?.(t); setIsFocused(false);
  };

  const handleClear = () => {
    setQuery(''); setSearchTerm?.(''); onSearch('');
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  return (
    <div className="relative max-w-3xl mx-auto">
      {/* Ambient glow behind search */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        height: '100px',
        background: 'radial-gradient(ellipse, rgba(100, 140, 255, 0.12) 0%, transparent 70%)',
        filter: 'blur(30px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <form onSubmit={handleSubmit} className="relative z-10">
        <motion.div
          animate={{
            boxShadow: isFocused
              ? '0 0 0 1px rgba(100, 160, 255, 0.35), 0 8px 40px rgba(0,0,0,0.28), 0 0 60px rgba(80, 130, 255, 0.08)'
              : '0 4px 24px rgba(0,0,0,0.20), inset 0 1px 0 rgba(255,255,255,0.06)'
          }}
          transition={{ duration: 0.2 }}
          style={{
            borderRadius: '20px',
            background: 'linear-gradient(180deg, rgba(28, 32, 44, 0.72) 0%, rgba(18, 22, 34, 0.80) 100%)',
            backdropFilter: 'blur(40px) saturate(165%)',
            WebkitBackdropFilter: 'blur(40px) saturate(165%)',
            border: isFocused ? '1px solid rgba(100, 160, 255, 0.30)' : '1px solid rgba(255,255,255,0.09)',
          }}
        >
          {/* Top highlight */}
          <div style={{
            position: 'absolute', top: 0, left: '15%', right: '15%', height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)',
            borderRadius: '1px', pointerEvents: 'none'
          }} />

          <div className="flex items-center px-6" style={{ height: '68px' }}>
            <motion.div
              animate={{ color: isFocused ? 'rgba(100, 160, 255, 0.90)' : 'rgba(140, 150, 170, 0.70)' }}
              transition={{ duration: 0.18 }}
              className="flex-shrink-0 mr-4"
            >
              <Search className="w-5 h-5" />
            </motion.div>

            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 160)}
              placeholder="Search financial concepts, signals, or market mechanics..."
              className="flex-1 bg-transparent focus:outline-none text-[16px] font-medium"
              style={{
                color: 'rgba(255,255,255,0.92)',
                caretColor: 'rgba(100, 160, 255, 0.90)',
                letterSpacing: '-0.01em',
                fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', sans-serif",
              }}
            />

            <AnimatePresence>
              {query && (
                <motion.button
                  type="button"
                  onClick={handleClear}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.12 }}
                  className="flex-shrink-0 ml-3 p-1.5 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" style={{ color: 'rgba(180,185,200,0.70)' }} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Dropdown */}
        <AnimatePresence>
          {isFocused && (suggestions.length > 0 || history.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.16 }}
              className="absolute top-full mt-3 w-full p-4 rounded-[18px] z-30"
              style={{
                background: 'linear-gradient(180deg, rgba(22, 26, 38, 0.96) 0%, rgba(16, 20, 30, 0.98) 100%)',
                backdropFilter: 'blur(40px)',
                WebkitBackdropFilter: 'blur(40px)',
                border: '1px solid rgba(255,255,255,0.09)',
                boxShadow: '0 16px 48px rgba(0,0,0,0.40)'
              }}
            >
              {suggestions.length > 0 && (
                <div className="mb-3">
                  <div className="flex items-center gap-2 px-2 pb-2">
                    <Zap className="w-3.5 h-3.5" style={{ color: 'rgba(88, 200, 150, 0.80)' }} />
                    <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'rgba(160,170,185,0.65)' }}>Instant Results</span>
                  </div>
                  {suggestions.slice(0, 5).map(s => (
                    <button key={s} onClick={() => handleSuggestionClick(s)}
                      className="w-full text-left px-4 py-2.5 rounded-xl flex items-center gap-3 hover:bg-white/[0.07] transition-colors"
                    >
                      <Zap className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'rgba(88, 200, 150, 0.70)' }} />
                      <span className="text-sm font-medium" style={{ color: 'rgba(235,240,255,0.88)' }}>{s}</span>
                    </button>
                  ))}
                </div>
              )}
              {history.length > 0 && (
                <div>
                  <div className="flex items-center justify-between px-2 pb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" style={{ color: 'rgba(160,120,255,0.75)' }} />
                      <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'rgba(160,170,185,0.65)' }}>Recent</span>
                    </div>
                    <button onClick={() => { setHistory([]); localStorage.removeItem('vireon-vault-history'); }}
                      className="text-[11px] font-medium hover:text-white transition-colors" style={{ color: 'rgba(160,170,185,0.55)' }}>Clear</button>
                  </div>
                  {history.slice(0, 4).map(t => (
                    <button key={t} onClick={() => handleHistoryClick(t)}
                      className="w-full text-left px-4 py-2.5 rounded-xl flex items-center gap-3 hover:bg-white/[0.07] transition-colors group"
                    >
                      <History className="w-3.5 h-3.5 flex-shrink-0 group-hover:text-purple-400 transition-colors" style={{ color: 'rgba(160,170,185,0.55)' }} />
                      <span className="text-sm font-medium group-hover:text-white transition-colors" style={{ color: 'rgba(200,205,220,0.75)' }}>{t}</span>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      {/* Hint examples */}
      {!query && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-5"
        >
          {HINT_EXAMPLES.map((hint, i) => (
            <button
              key={i}
              onClick={() => { setQuery(hint.replace(/^What is |What drives /i, '').replace('?', '')); onSearch(hint.replace(/^What is |What drives /i, '').replace('?', '')); }}
              className="text-sm transition-colors hover:text-white"
              style={{ color: 'rgba(160,170,190,0.52)', fontStyle: 'italic' }}
            >
              {hint}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
}