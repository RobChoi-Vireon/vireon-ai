import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen } from 'lucide-react';

import LyraLogo from '../components/core/LyraLogo';
import StarfieldBackground from '../components/capital-vault/StarfieldBackground';
import HeroSearch from '../components/capital-vault/HeroSearch';
import MarketConceptsSection from '../components/capital-vault/MarketConceptsSection';
import CategoryExplorer from '../components/capital-vault/CategoryExplorer';
import KnowledgeControlPanel from '../components/capital-vault/KnowledgeControlPanel';
import SearchResultCard from '../components/capital-vault/SearchResultCard';
import ResultSkeleton from '../components/capital-vault/ResultSkeleton';

// ─── Lightweight cache (kept from original) ─────────────────────────────────
const termDefinitions = new Map([
  ['sharpe ratio', { term: "Sharpe Ratio", category: "Quant", difficulty: "Intermediate", reading_time_min: 5, synonyms: [], pro_level: { definition: "The Sharpe Ratio measures the risk-adjusted return of an investment by dividing excess return over the risk-free rate by the standard deviation of those excess returns.", example: "Portfolio return 10%, risk-free 2%, std dev 16% → Sharpe = (10-2)/16 = 0.5", veteran_definition: "A cornerstone of Modern Portfolio Theory used to evaluate strategy efficiency. Advanced practitioners pair it with the Sortino Ratio for non-linear strategies.", veteran_example: "When analysing a hedge fund, scrutinise the Sortino Ratio alongside Sharpe for asymmetric return profiles.", formulas: [{ name: "Sharpe Ratio", expression: "S = (Rp - Rf) / σp", variables: [{ symbol: "Rp", meaning: "Portfolio Return" }, { symbol: "Rf", meaning: "Risk-Free Rate" }, { symbol: "σp", meaning: "Std Dev of Excess Return" }] }] }, novice_level: { definition: "The Sharpe Ratio tells you how much return you're getting per unit of risk taken. Higher is better.", example: "Two funds both returned 10%. The one that did so with less volatility has a higher Sharpe Ratio." }, first_principles: { goal: "Quantify reward-per-unit-of-risk.", primitives: ["Return", "Risk-free rate", "Volatility"], relationships: ["Excess return is the reward; volatility is the penalty"], derivation_steps: ["Subtract risk-free from return", "Divide by standard deviation"], sanity_checks: ["Ratio > 0 means beating risk-free"], edge_cases: ["Negative Sharpe Ratios are ambiguous"] }, related_terms: ["Sortino Ratio", "Treynor Ratio", "Information Ratio", "Modern Portfolio Theory"], common_pitfalls: ["Assuming normally distributed returns", "Ignoring fat-tail risk", "Comparing across different time horizons without annualising"] }],
  ['wacc', { term: "WACC", category: "Corporate Finance", difficulty: "Advanced", reading_time_min: 7, synonyms: ["Weighted Average Cost of Capital"], pro_level: { definition: "WACC is a firm's blended cost of capital across equity and debt sources, weighted by market-value proportions.", example: "70% equity at 10% + 30% debt at 5% × (1-25% tax) = 7% + 1.125% = 8.125%", veteran_definition: "Critical DCF input. Requires CAPM for cost of equity. Must use market values, not book values, for weighting.", veteran_example: "Analysts use unlevered beta from industry comparables, then re-lever to the target's capital structure.", formulas: [{ name: "WACC", expression: "WACC = (E/V)·Re + (D/V)·Rd·(1−Tc)", variables: [{ symbol: "E", meaning: "Market Value of Equity" }, { symbol: "D", meaning: "Market Value of Debt" }, { symbol: "Re", meaning: "Cost of Equity" }, { symbol: "Rd", meaning: "Cost of Debt" }, { symbol: "Tc", meaning: "Corporate Tax Rate" }] }] }, novice_level: { definition: "WACC is the average interest rate a company pays across all its capital sources.", example: "Like the blended interest rate across all your loans." }, first_principles: { goal: "Minimum return to satisfy all capital providers.", primitives: ["Cost of equity", "After-tax cost of debt", "Capital structure weights"], relationships: ["Total cost is a weighted blend; debt is cheaper due to tax shield"], derivation_steps: ["Calculate cost of equity via CAPM", "Calculate after-tax cost of debt", "Weight by market values"], sanity_checks: ["WACC should sit between cost of debt and cost of equity"], edge_cases: ["Zero-debt firms", "Fluctuating capital structures"] }, related_terms: ["DCF", "CAPM", "Cost of Equity", "Beta"], common_pitfalls: ["Using book values for weighting", "Mismatching WACC to wrong cash flow definition"] }],
]);

class VaultCache {
  constructor() {
    this.cache = new Map();
    this.ttl = 14 * 24 * 60 * 60 * 1000;
    this._load();
    termDefinitions.forEach((data, key) => { if (!this.cache.has(key)) this.cache.set(key, data); });
  }
  _load() {
    try {
      const stored = localStorage.getItem('vireon-capital-vault-cache-v3');
      if (stored) {
        const parsed = JSON.parse(stored);
        Object.entries(parsed).forEach(([k, v]) => { if (Date.now() - v.timestamp < this.ttl) this.cache.set(k, v.data); });
      }
    } catch {}
  }
  _save() {
    try {
      const obj = {};
      this.cache.forEach((d, k) => { obj[k] = { data: d, timestamp: Date.now() }; });
      localStorage.setItem('vireon-capital-vault-cache-v3', JSON.stringify(obj));
    } catch {}
  }
  _mock(term) {
    const k = term.toLowerCase().trim();
    if (termDefinitions.has(k)) return termDefinitions.get(k);
    return { term, slug: k.replace(/[^a-z0-9]/g, '-'), synonyms: [], category: "Finance", difficulty: "Intermediate", reading_time_min: 4, pro_level: { definition: `${term} is a key financial concept used in quantitative and risk analysis.`, example: `Practitioners apply ${term} across a range of market scenarios.`, veteran_definition: `${term} is a sophisticated framework incorporating multiple market variables.`, veteran_example: `Advanced use of ${term} involves stress testing and scenario analysis.`, formulas: [] }, novice_level: { definition: `${term} helps investors make better financial decisions.`, example: `Think of ${term} as a financial compass.` }, first_principles: { goal: `Quantify ${term} for better decision-making.`, primitives: ["Market data", "Statistical analysis"], relationships: ["Inputs affect outputs"], derivation_steps: ["Collect data", "Apply formula", "Interpret"], sanity_checks: ["Verify inputs"], edge_cases: ["Market stress"] }, related_terms: ["Risk Management", "Portfolio Theory"], common_pitfalls: ["Misunderstanding assumptions", "Over-relying on historical data"] };
  }
  get(key) { const k = key.toLowerCase().trim(); return this.cache.get(k); }
  set(key, data) { const k = key.toLowerCase().trim(); this.cache.set(k, data); this._save(); }
  has(key) { return this.cache.has(key.toLowerCase().trim()); }
  suggest(query) {
    const q = query.toLowerCase().replace(/[^a-z0-9]/g, '');
    const matches = [];
    this.cache.forEach((_, k) => { if (k.replace(/[^a-z0-9]/g, '').includes(q)) matches.push(k); });
    return matches.slice(0, 6);
  }
  fetch(query) {
    const k = query.toLowerCase().trim();
    if (this.has(k)) return this.get(k);
    const mock = this._mock(query);
    this.set(k, mock);
    return mock;
  }
}

const cache = new VaultCache();

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CapitalVault() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTermData, setCurrentTermData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState('pro');
  const [suggestions, setSuggestions] = useState([]);
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('vireon-vault-history') || '[]'); } catch { return []; }
  });

  useEffect(() => {
    if (searchTerm.length >= 1) setSuggestions(cache.suggest(searchTerm));
    else setSuggestions([]);
  }, [searchTerm]);

  const updateHistory = useCallback((term) => {
    setHistory(prev => {
      const next = [term, ...prev.filter(t => t !== term)].slice(0, 10);
      localStorage.setItem('vireon-vault-history', JSON.stringify(next));
      return next;
    });
  }, []);

  const handleSearch = useCallback((query) => {
    if (!query?.trim()) { setCurrentTermData(null); setSearchTerm(''); return; }
    const trimmed = query.trim();
    setSearchTerm(trimmed);
    setIsLoading(true);
    setTimeout(() => {
      const data = cache.fetch(trimmed);
      setCurrentTermData(data);
      updateHistory(trimmed);
      setIsLoading(false);
    }, 120);
  }, [updateHistory]);

  const handleCategorySelect = useCallback((category) => {
    const map = { 'Markets': 'Market efficiency', 'Accounting': 'GAAP', 'Macro': 'Monetary policy', 'Derivatives': 'Black-Scholes', 'Fixed Income': 'Duration', 'Quant': 'Sharpe ratio', 'Corporate Finance': 'WACC', 'Statistics': 'Standard deviation' };
    handleSearch(map[category] || category);
  }, [handleSearch]);

  const hasResult = !!currentTermData && !isLoading;
  const isSearchActive = !!searchTerm;

  return (
    <div className="relative min-h-screen" style={{ background: '#0B0E13', fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Inter', sans-serif", WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale' }}>
      <StarfieldBackground />

      {/* Page ambient glow */}
      <div style={{
        position: 'fixed', top: 0, left: '25%', right: '25%', height: '400px',
        background: 'radial-gradient(ellipse, rgba(70, 100, 200, 0.07) 0%, transparent 70%)',
        filter: 'blur(60px)', pointerEvents: 'none', zIndex: 1
      }} />

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 max-w-[1380px] mx-auto">
        
        {/* ── Main Layout ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
          
          {/* Left: main content */}
          <div className="min-w-0 space-y-10">

            {/* ── Header + Search ─────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.26, 0.11, 0.26, 1] }}
              className="text-center space-y-5"
            >
              <div>
                <div className="flex items-center justify-center gap-4 mb-2">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, rgba(30,36,56,0.90) 0%, rgba(18,22,38,0.95) 100%)', border: '1px solid rgba(100, 160, 255, 0.22)', boxShadow: '0 0 20px rgba(80, 130, 255, 0.12)' }}>
                    <BookOpen className="w-5 h-5" style={{ color: 'rgba(100, 175, 255, 0.88)' }} strokeWidth={1.8} />
                  </div>
                  <h1 className="text-4xl font-bold tracking-[-0.03em]" style={{
                    background: 'linear-gradient(135deg, #F0F4FF 0%, #D0DCFF 40%, #A8BCFF 80%, #8AA4FF 100%)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
                  }}>
                    Capital Vault
                  </h1>
                  <div style={{ filter: 'drop-shadow(0 0 8px rgba(140, 100, 255, 0.70))' }}>
                    <LyraLogo className="w-9 h-9" />
                  </div>
                </div>
                <p className="text-[15px]" style={{ color: 'rgba(180, 190, 215, 0.60)', letterSpacing: '-0.01em', fontWeight: 400 }}>
                  Lighting Fast AI Dictionary, powered by Ori Intelligence
                </p>
              </div>

              <HeroSearch
                onSearch={handleSearch}
                isLoading={isLoading}
                history={history}
                setHistory={setHistory}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                suggestions={suggestions}
              />
            </motion.div>

            {/* Content area */}
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <ResultSkeleton theme="dark" />
                </motion.div>
              ) : hasResult ? (
                <motion.div
                  key={`result-${currentTermData.term}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.26, 0.11, 0.26, 1] }}
                >
                  <SearchResultCard
                    data={currentTermData}
                    viewMode={viewMode}
                    onTermClick={handleSearch}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-12"
                >
                  <CategoryExplorer onCategorySelect={handleCategorySelect} />
                  <MarketConceptsSection onSearch={handleSearch} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* When result is showing, also show category explorer below */}
            {hasResult && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <CategoryExplorer onCategorySelect={handleCategorySelect} />
              </motion.div>
            )}
          </div>

          {/* Right: knowledge control panel */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.26, 0.11, 0.26, 1] }}
            className="hidden lg:block"
          >
            <KnowledgeControlPanel
              viewMode={viewMode}
              setViewMode={setViewMode}
              onSearch={handleSearch}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}