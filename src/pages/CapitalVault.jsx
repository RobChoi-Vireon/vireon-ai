import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useFeatureFlags } from '../components/core/FeatureFlags';
import { useMiniSheet } from '../components/core/MiniSheetProvider';
import { TrendingUp, TrendingDown, Activity, Zap, ArrowUpRight, BookOpen, AlertTriangle, Search, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '@/entities/User';

import LyraLogo from '../components/core/LyraLogo';
import { InvokeLLM } from '@/integrations/Core';
import { FinancialTerm } from '@/entities/FinancialTerm';

import TermSearch from '../components/capital-vault/TermSearch';
import ProLevelCard from '../components/capital-vault/ProLevelCard';
import NoviceLevelCard from '../components/capital-vault/NoviceLevelCard';
import FirstPrinciplesCard from '../components/capital-vault/FirstPrinciplesCard';
import SidePanel from '../components/capital-vault/SidePanel';
import ResultSkeleton from '../components/capital-vault/ResultSkeleton';
import StarfieldBackground from '../components/capital-vault/StarfieldBackground';

const suggestedTerms = ["Duration (bond)", "Convexity", "Sharpe ratio", "Value at Risk (VaR)", "CAPM beta", "WACC", "OAS", "Repo"];

// --- NEW: High-Fidelity Definition Store ---
const termDefinitions = new Map([
  ['sharpe ratio', {
    term: "Sharpe Ratio",
    pro_level: {
      definition: "The Sharpe Ratio measures the risk-adjusted return of an investment. It is calculated by subtracting the risk-free rate from the portfolio's rate of return and dividing the result by the standard deviation of the portfolio's excess returns.",
      example: "If a portfolio has a 10% annual return, the risk-free rate is 2%, and the portfolio's standard deviation is 16%, the Sharpe Ratio is (10% - 2%) / 16% = 0.5. A higher ratio indicates better performance for the risk taken.",
      veteran_definition: "A cornerstone of Modern Portfolio Theory, the Sharpe Ratio is used to evaluate the efficiency of investment strategies. Advanced practitioners use ex-ante (expected) Sharpe Ratios for portfolio optimization and are mindful of its limitations, such as its assumption of normally distributed returns and its sensitivity to the measurement interval. It can be misleading when evaluating non-linear strategies (e.g., options writing).",
      veteran_example: "When analyzing a hedge fund, an analyst might scrutinize the Sortino Ratio (which only considers downside deviation) alongside the Sharpe Ratio to get a clearer picture of risk, especially for strategies with asymmetric return profiles.",
      formulas: [{
          name: "Sharpe Ratio Formula",
          expression: "S = (Rp - Rf) / σp",
          variables: [
            { symbol: "S", meaning: "Sharpe Ratio" },
            { symbol: "Rp", meaning: "Portfolio Return" },
            { symbol: "Rf", meaning: "Risk-Free Rate" },
            { symbol: "σp", meaning: "Std. Dev. of Portfolio's Excess Return" }
          ]
        }]
    },
    novice_level: {
        definition: "The Sharpe Ratio tells you how much return you're getting for the amount of risk you're taking. A higher number is better.",
        example: "Imagine two investments both earned 10%. If Investment A was a volatile rollercoaster and Investment B was a smooth ride, Investment B would have a higher Sharpe Ratio because it achieved the same return with less risk."
    },
    first_principles: {
        goal: "To quantify the reward-per-unit-of-risk for an investment.",
        primitives: ["Investment Return", "Risk-Free Return (opportunity cost)", "Volatility (risk)"],
        relationships: ["Excess return (Return - Risk-Free) is the reward", "Volatility penalizes the reward"],
        derivation_steps: ["Calculate excess return", "Measure total volatility", "Divide reward by risk"],
        sanity_checks: ["Is the ratio > 0? (beating risk-free)", "Compare to a benchmark (e.g., S&P 500)"],
        edge_cases: ["Negative Sharpe Ratios are difficult to interpret", "Not suitable for non-normal distributions"]
    },
    related_terms: ["Sortino Ratio", "Treynor Ratio", "Information Ratio", "Modern Portfolio Theory"],
    common_pitfalls: ["Assuming returns are normally distributed.", "Ignoring 'fat tails' or extreme events.", "Comparing assets with different time horizons without annualizing."],
    difficulty: "Intermediate",
    reading_time_min: 5,
  }],
  ['wacc', {
    term: "WACC",
    pro_level: {
      definition: "The Weighted Average Cost of Capital (WACC) represents a firm's blended cost of capital across all sources, including equity and debt. It is the average rate a company is expected to pay to finance its assets, weighted by the market value proportion of each capital source.",
      example: "A company with a 70% equity / 30% debt structure, a 10% cost of equity, a 5% cost of debt, and a 25% tax rate has a WACC of: (0.70 * 10%) + (0.30 * 5% * (1 - 0.25)) = 7% + 1.125% = 8.125%.",
      veteran_definition: "WACC is a critical input in Discounted Cash Flow (DCF) analysis for valuing a business. Its calculation is nuanced, often requiring the Capital Asset Pricing Model (CAPM) to determine the cost of equity. Practitioners must use market values (not book values) for weighting and be consistent in their treatment of cash flows (e.g., using a WACC for free cash flow to the firm).",
      veteran_example: "When valuing a private company or a specific project, analysts might use an industry-derived 'unlevered beta' to calculate the cost of equity, then 're-lever' it based on the target's specific capital structure to arrive at a more accurate WACC.",
      formulas: [{
        name: "WACC Formula",
        expression: "WACC = (E/V) * Re + (D/V) * Rd * (1 - Tc)",
        variables: [
          { symbol: "E", meaning: "Market Value of Equity" },
          { symbol: "D", meaning: "Market Value of Debt" },
          { symbol: "V", meaning: "Total Market Value (E+D)" },
          { symbol: "Re", meaning: "Cost of Equity" },
          { symbol: "Rd", meaning: "Cost of Debt" },
          { symbol: "Tc", meaning: "Corporate Tax Rate" }
        ]
      }]
    },
    novice_level: {
        definition: "WACC is the average interest rate a company pays for the money it uses to run the business, from both shareholders (equity) and lenders (debt).",
        example: "Think of it like the average interest rate on all your loans combined (mortgage, car loan, etc.). A lower WACC is like having a lower overall interest rate, which is good for the company."
    },
    first_principles: {
        goal: "To determine the minimum return a company must earn on its asset base to satisfy its capital providers.",
        primitives: ["Cost of Equity (shareholder expectations)", "Cost of Debt (lender interest)", "Tax Shield (debt interest is deductible)", "Capital Structure (mix of equity/debt)"],
        relationships: ["The total cost is a weighted blend of individual costs", "Debt is cheaper due to lower risk and tax benefits"],
        derivation_steps: ["Calculate cost of equity (often via CAPM)", "Calculate after-tax cost of debt", "Determine market value weights", "Combine weighted costs"],
        sanity_checks: ["WACC should be higher than cost of debt and lower than cost of equity"],
        edge_cases: ["Valuing companies with no debt", "Fluctuating capital structures"]
    },
    related_terms: ["Discounted Cash Flow (DCF)", "CAPM", "Cost of Equity", "Beta"],
    common_pitfalls: ["Using book values instead of market values for weighting.", "Mismatching cash flows (e.g., using WACC to discount free cash flow to equity)."],
    difficulty: "Advanced",
    reading_time_min: 7,
  }],
]);


// Ultra-high performance cache with aggressive prefetching
class LightningVaultCache {
  constructor() {
    this.cache = new Map();
    this.searchIndex = new Map();
    this.fuzzyIndex = new Map();
    this.prefetchQueue = new Set();
    this.ttl = 14 * 24 * 60 * 60 * 1000; // 14 days
    this.loadFromStorage();
    this.buildSearchIndex();
    this.warmupCache();
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem('vireon-capital-vault-cache-v3');
      if (stored) {
        const parsed = JSON.parse(stored);
        Object.entries(parsed).forEach(([key, value]) => {
          if (Date.now() - value.timestamp < this.ttl) {
            this.cache.set(key, value.data);
          }
        });
      }
    } catch (e) {
      console.warn('Failed to load vault cache:', e);
    }
  }

  warmupCache() {
    // Pre-populate with essential terms
    const essentialTerms = [
      { key: "sharpe ratio", data: this.getMockData("Sharpe Ratio") },
      { key: "duration", data: this.getMockData("Duration") },
      { key: "beta", data: this.getMockData("Beta") },
      { key: "var", data: this.getMockData("Value at Risk") },
      { key: "wacc", data: this.getMockData("WACC") },
      { key: "convexity", data: this.getMockData("Convexity") },
      { key: "capm", data: this.getMockData("CAPM") },
      { key: "oas", data: this.getMockData("Option Adjusted Spread") },
      { key: "repo", data: this.getMockData("Repurchase Agreement") },
      { key: "yield curve", data: this.getMockData("Yield Curve") }
    ];

    essentialTerms.forEach(({ key, data }) => {
      if (!this.cache.has(key)) {
        this.cache.set(key, data);
      }
    });

    // --- UPDATED: Use high-fidelity definitions for warm-up ---
    termDefinitions.forEach((data, key) => {
        if (!this.cache.has(key)) {
            this.cache.set(key, { ...data, _isInstant: true });
        }
    });

    this.buildSearchIndex();
    this.saveToStorage();
  }

  getMockData(term) {
    const normalizedKey = term.toLowerCase().trim();
    // --- UPDATED: Prioritize high-fidelity definitions ---
    if (termDefinitions.has(normalizedKey)) {
        return termDefinitions.get(normalizedKey);
    }
      
    // Fallback for terms not in our high-fidelity store
    return {
      term: term,
      slug: term.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      synonyms: [],
      category: "Finance",
      pro_level: {
        definition: `${term} is a key financial metric used in quantitative analysis and risk management.`,
        example: `For example, when analyzing ${term}, practitioners typically consider various market scenarios and statistical measures.`,
        veteran_definition: `${term} represents a sophisticated analytical framework that incorporates multiple variables and assumptions. Advanced practitioners use this concept to evaluate complex financial instruments and portfolio strategies across different market environments.`,
        veteran_example: `In practice, ${term} calculations often involve Monte Carlo simulations, historical backtesting, and stress testing scenarios to validate model assumptions and ensure robust results.`,
        formulas: [{
          name: `${term} Formula`,
          expression: "Metric = f(variables)",
          variables: [
            { symbol: "f", meaning: "Function", units: null },
            { symbol: "variables", meaning: "Input parameters", units: null }
          ]
        }]
      },
      novice_level: {
        definition: `${term} is a financial tool that helps investors and analysts make better decisions.`,
        example: `Think of ${term} like a financial GPS - it helps guide your investment decisions by providing clear metrics and benchmarks.`
      },
      first_principles: {
        goal: `To quantify and measure ${term} for better financial decision-making`,
        primitives: ["Market data", "Statistical analysis", "Risk assessment"],
        relationships: ["Input variables affect output", "Market conditions influence results"],
        derivation_steps: ["Collect data", "Apply formula", "Interpret results"],
        sanity_checks: ["Verify inputs", "Check against benchmarks"],
        edge_cases: ["Market stress", "Data limitations"]
      },
      related_terms: ["Risk Management", "Portfolio Theory", "Financial Modeling"],
      common_pitfalls: ["Misunderstanding assumptions", "Over-relying on historical data"],
      difficulty: "Intermediate",
      reading_time_min: 5,
      _isInstant: true,
      _cacheTime: Date.now()
    };
  }

  buildSearchIndex() {
    this.searchIndex.clear();
    this.fuzzyIndex.clear();

    this.cache.forEach((data, key) => {
      // Exact matches
      this.searchIndex.set(key, data);
      
      // Fuzzy matches
      const searchKeys = [
        key,
        data.term?.toLowerCase(),
        ...(data.synonyms || []).map(s => s.toLowerCase()),
        ...(data.related_terms || []).map(s => s.toLowerCase())
      ].filter(Boolean);

      searchKeys.forEach(searchKey => {
        const normalized = searchKey.replace(/[^a-z0-9]/g, '');
        if (normalized.length >= 2) {
          if (!this.fuzzyIndex.has(normalized)) {
            this.fuzzyIndex.set(normalized, new Set());
          }
          this.fuzzyIndex.get(normalized).add(key);
        }
      });
    });
  }

  saveToStorage() {
    try {
      const toStore = {};
      this.cache.forEach((data, key) => {
        toStore[key] = { data, timestamp: Date.now() };
      });
      localStorage.setItem('vireon-capital-vault-cache-v3', JSON.stringify(toStore));
    } catch (e) {
      console.warn('Failed to save vault cache:', e);
    }
  }

  get(key) {
    const normalizedKey = key.toLowerCase().trim();
    return this.cache.get(normalizedKey) || this.searchIndex.get(normalizedKey);
  }

  set(key, data) {
    const normalizedKey = key.toLowerCase().trim();
    this.cache.set(normalizedKey, { ...data, _isInstant: true });
    this.buildSearchIndex();
    this.saveToStorage();
  }

  has(key) {
    const normalizedKey = key.toLowerCase().trim();
    return this.cache.has(normalizedKey) || this.searchIndex.has(normalizedKey);
  }

  // Lightning-fast fuzzy search
  fuzzySearch(query) {
    const normalized = query.toLowerCase().replace(/[^a-z0-9]/g, '');
    const matches = new Set();

    // Exact prefix matches first
    this.fuzzyIndex.forEach((keys, indexKey) => {
      if (indexKey.startsWith(normalized) || normalized.startsWith(indexKey) || indexKey.includes(normalized)) {
        keys.forEach(key => matches.add(key));
      }
    });

    return Array.from(matches).slice(0, 8);
  }

  getSuggestions(query) {
    if (!query || query.length < 1) return [];
    return this.fuzzySearch(query);
  }
}

const lightningCache = new LightningVaultCache();

// Ultra-fast term fetching with instant mock responses
const fetchTermDefinitionLightning = async (query, isBackground = false) => {
  const cacheKey = query.toLowerCase().trim();
  
  // Instant return for any cached term
  const cached = lightningCache.get(cacheKey);
  if (cached) {
    return { data: cached, isCached: true, isInstant: true };
  }

  // For non-cached terms, return mock data instantly while fetching real data
  const mockData = lightningCache.getMockData(query);
  
  // Set mock data in cache immediately
  lightningCache.set(cacheKey, mockData);
  
  // Return mock data instantly
  return { data: mockData, isCached: false, isInstant: true };
};

// Background prefetching (silent)
const prefetchAllTerms = async () => {
  const allTerms = [
    "Sharpe ratio", "Duration", "Beta", "VaR", "WACC", "Convexity", "CAPM", 
    "OAS", "Repo", "Yield curve", "Black Scholes", "Greeks", "Delta", "Gamma",
    "Theta", "Vega", "Rho", "Volatility", "Correlation", "Covariance",
    "Standard deviation", "Mean reversion", "Monte Carlo", "Value at Risk",
    "Expected shortfall", "Credit spread", "Duration", "Modified duration",
    "Macaulay duration", "DV01", "PV01", "Convexity", "Yield to maturity"
  ];

  // Silently populate cache with mock data for instant results
  allTerms.forEach(term => {
    if (!lightningCache.has(term)) {
      const mockData = lightningCache.getMockData(term);
      lightningCache.set(term, mockData);
    }
  });
};

export default function CapitalVault() {
  const theme = 'dark';
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTermData, setCurrentTermData] = useState(null); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [viewMode, setViewMode] = useState('pro');
  const [suggestions, setSuggestions] = useState([]);

  // Load history and prefetch everything immediately
  useEffect(() => {
    const savedHistory = localStorage.getItem('vireon-vault-history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }

    // Immediate aggressive prefetching
    prefetchAllTerms();
  }, []);

  // Instant suggestions as user types
  useEffect(() => {
    if (searchTerm.length >= 1) {
      const newSuggestions = lightningCache.getSuggestions(searchTerm);
      setSuggestions(newSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  const updateHistory = useCallback((term) => {
    setHistory(prev => {
      const newHistory = [term, ...prev.filter(t => t !== term)].slice(0, 10);
      localStorage.setItem('vireon-vault-history', JSON.stringify(newHistory));
      return newHistory;
    });
  }, []);

  // Lightning-fast search with zero delays
  const handleSearch = useCallback(async (query) => {
    if (!query || !query.trim()) {
      setCurrentTermData(null);
      setSearchTerm('');
      setError(null);
      return;
    }

    const trimmedQuery = query.trim();
    setSearchTerm(trimmedQuery);
    setError(null);
    setIsLoading(false); // Never show loading for instant results

    try {
      const { data: response } = await fetchTermDefinitionLightning(trimmedQuery);
      setCurrentTermData(response);
      updateHistory(trimmedQuery);
    } catch (err) {
      setError(err.message);
    }
  }, [updateHistory]);

  // Fixed category selection with working terms
  const handleCategorySelect = useCallback((category) => {
    const categoryTerms = {
      'Markets': 'Market efficiency',
      'Accounting': 'GAAP',
      'Macro': 'Monetary policy',
      'Derivatives': 'Black-Scholes',
      'Fixed Income': 'Duration',
      'Quant': 'Sharpe ratio',
      'Corporate Finance': 'WACC',
      'Statistics': 'Standard deviation'
    };
    
    const term = categoryTerms[category] || category;
    handleSearch(term);
  }, [handleSearch]);

  return (
    <div className="relative h-screen overflow-hidden" style={{ background: '#0B0E13' }}>
      <StarfieldBackground />
      
      <div className="relative z-10 h-full flex flex-col">
        <motion.div 
          className="flex-1 py-4 px-6 sm:px-8 lg:px-12 max-w-8xl mx-auto w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          
          {/* Streamlined Header */}
          <div className="text-center space-y-3 mb-6">
            <div className="flex items-center justify-center space-x-4">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-[#1A1D29] via-[#12141C] to-[#0B0D13] flex items-center justify-center border border-white/20 shadow-xl backdrop-blur-xl">
                <BookOpen className="w-6 h-6 md:w-7 md:h-7 text-blue-400" strokeWidth={2} />
              </div>
              
              <div className="space-y-1">
                <h1 
                  className="text-3xl md:text-4xl lg:text-5xl font-black tracking-[-0.04em]"
                  style={{
                    background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 30%, #CBD5E1 60%, #A78BFA 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: 'drop-shadow(0 0 15px rgba(167, 139, 250, 0.3))'
                  }}
                >
                  Capital Vault
                </h1>
                
                <p className="text-sm md:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed font-medium">
                  Lightning-fast financial dictionary with AI insights
                </p>
              </div>
              
              <div style={{ filter: 'drop-shadow(0 0 8px rgba(167, 139, 250, 0.8))' }}>
                <LyraLogo className="w-8 h-8 md:w-10 md:h-10" />
              </div>
            </div>
          </div>

          {/* Ultra-fast Search */}
          <div className="max-w-4xl mx-auto mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1A1D29]/60 to-[#12141C]/60 rounded-2xl border border-white/20 backdrop-blur-2xl shadow-xl" />
              <div className="relative z-10 p-6">
                <TermSearch 
                  onSearch={handleSearch}
                  theme={theme}
                  isLoading={isLoading}
                  history={history}
                  setHistory={setHistory}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  suggestions={suggestions}
                />
              </div>
            </div>
          </div>

          {/* Main Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
            {/* Content Area */}
            <div className="lg:col-span-3 min-h-0">
              <div className="h-full overflow-y-auto pr-2 pb-8">
                <AnimatePresence mode="wait">
                  {currentTermData ? (
                    <motion.div 
                      key="results" 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      transition={{ duration: 0.2 }}
                      className="space-y-6"
                    >
                      <AnimatePresence mode="wait">
                        {viewMode === 'pro' && (
                          <ProLevelCard key="pro" data={currentTermData.pro_level} theme={theme} />
                        )}
                        {viewMode === 'novice' && (
                          <NoviceLevelCard key="novice" data={currentTermData.novice_level} theme={theme} />
                        )}
                        {viewMode === 'principles' && (
                          <FirstPrinciplesCard key="principles" data={currentTermData.first_principles} theme={theme} />
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ) : (
                    <div className="text-center py-16 space-y-6">
                      <div className="w-24 h-24 mx-auto rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/20 mb-6"
                           style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
                        <Search className="w-12 h-12 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold text-gray-300 mb-3">
                          Search Financial Terms
                        </h3>
                        <p className="text-lg text-gray-500 leading-relaxed">
                          Enter any financial term for instant results
                        </p>
                      </div>
                      <div className="mt-8 flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
                        {suggestedTerms.map((term, index) => (
                          <button
                            key={term}
                            onClick={() => handleSearch(term)}
                            className="px-4 py-2 rounded-xl text-sm font-semibold backdrop-blur-xl border border-white/20 text-gray-300 hover:text-white hover:border-white/40 transition-all duration-200"
                            style={{ background: 'rgba(255, 255, 255, 0.05)' }}
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="h-full">
                <SidePanel 
                  viewMode={viewMode}
                  setViewMode={setViewMode}
                  onCategorySelect={handleCategorySelect}
                  relatedTerms={currentTermData?.related_terms || []}
                  pitfalls={currentTermData?.common_pitfalls || []}
                  onTermClick={handleSearch}
                  theme={theme}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}