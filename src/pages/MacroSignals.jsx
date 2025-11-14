
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DimonDigestRun } from '@/entities/DimonDigestRun';
import { generateDimonDigest } from '@/functions/generateDimonDigest';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import DigestHeader from '@/components/dimon/DigestHeader';
import PrioritySignalStrip from '@/components/dimon/PrioritySignalStrip';
import ExecutiveTakeaway from '@/components/dimon/ExecutiveTakeaway';
import ConsensusMeter from '@/components/dimon/ConsensusMeter';
import DivergenceReport from '@/components/dimon/DivergenceReport';
import CounterpointsPanel from '@/components/dimon/CounterpointsPanel';
import NarrativeMap from '@/components/dimon/NarrativeMap';
import SourceGrid from '@/components/dimon/SourceGrid';
import StrategicTrajectory from '@/components/dimon/StrategicTrajectory';
import ImplicationsPanel from '@/components/dimon/ImplicationsPanel';
import DigestSkeleton from '@/components/dimon/DigestSkeleton';
import DegradedBanner from '@/components/dimon/DegradedBanner';
import RetryWrapper from '@/components/core/RetryWrapper';

// NOTE: Lazy loading components is a key performance optimization.
// In a real build setup, these would be loaded asynchronously.
// const MemoDrawer = React.lazy(() => import('@/components/dimon/MemoDrawer'));
// const SentimentDrawer = React.lazy(() => import('@/components/dimon/SentimentDrawer'));
// etc.
import MemoDrawer from '@/components/dimon/MemoDrawer';
import SentimentDrawer from '@/components/dimon/SentimentDrawer';
import DivergenceDrawer from '@/components/dimon/DivergenceDrawer';
import SignalDetailDrawer from '@/components/dimon/SignalDetailDrawer';
import SegmentDetailDrawer from '@/components/dimon/SegmentDetailDrawer';
import GlobalSignalLattice from '@/components/dimon/GlobalHolographicMap';


const deepSanitize = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => deepSanitize(item));
  }
  
  const sanitized = {};
  Object.keys(obj).forEach(key => {
    sanitized[key] = deepSanitize(obj[key]);
  });
  
  return sanitized;
};


const MOCK_DATA = {
  run_id: 'mock-2025-01-20-0500',
  prepared_at: '2025-01-20T09:00:00Z',
  target_date: '2025-01-20',
  model_version: 'mock-v1.0',
  sources_hash: 'sha256:mock-digest-hash-stable-seed',
  priority_signals: [
    {
      tag: "Policy Shock",
      text: "DC unveils sweeping AI content rules, compliance costs surge",
      urgency: "critical",
      source: "washpost",
      quick_glance_tags: [
        { label: "Fed Risk", icon: "ShieldAlert", color: "text-amber-300" },
        { label: "Equities (-)", icon: "TrendingDown", color: "text-red-300" }
      ],
      associated_country_codes: ["US", "EU"],
      coordinates: [38.9072, -77.0369] // Washington D.C.
    },
    {
      tag: "Credit Stress", 
      text: "EM HY spreads widen 35 bps WoW, issuance freezes",
      urgency: "high",
      source: "ft",
      quick_glance_tags: [
        { label: "Liquidity", icon: "Waves", color: "text-blue-300" },
        { label: "Global (-)", icon: "Globe", color: "text-red-300" }
      ],
      associated_country_codes: ["AR", "TR", "ZA"],
      coordinates: [-34.6037, -58.3816] // Buenos Aires, Argentina
    },
    {
      tag: "Tech Disruption",
      text: "Quantum computing breakthrough threatens existing encryption standards",
      urgency: "medium",
      source: "nyt",
       quick_glance_tags: [
        { label: "Cyber Risk", icon: "Lock", color: "text-purple-300" },
        { label: "Long-Term", icon: "CalendarClock", color: "text-gray-300" }
      ],
      associated_country_codes: ["US", "CN", "GB"],
      coordinates: [34.0522, -118.2437] // Los Angeles, USA
    },
    {
      tag: "Geopolitical Risk",
      text: "Trade tensions escalate between major economic blocs, impacting global supply chains",
      urgency: "high",
      source: "wsj",
       quick_glance_tags: [
        { label: "Supply Chain", icon: "Link", color: "text-orange-300" },
        { label: "Industrials (-)", icon: "Factory", color: "text-red-300" }
      ],
      associated_country_codes: ["US", "CN", "DE", "JP"],
      coordinates: [39.9042, 116.4074] // Beijing, China
    },
    {
      tag: "Energy Transition",
      text: "New clean energy breakthrough promises significant cost reductions",
      urgency: "medium",
      source: "bloomberg",
      quick_glance_tags: [
        { label: "Climate", icon: "CloudSun", color: "text-green-300" },
        { label: "Opportunity", icon: "TrendingUp", color: "text-emerald-300" }
      ],
      associated_country_codes: ["DE", "FR", "US"],
      coordinates: [52.5200, 13.4050] // Berlin, Germany
    },
    {
      tag: "Social Unrest",
      text: "Protests over living costs intensify in several European capitals",
      urgency: "high",
      source: "reuters",
      quick_glance_tags: [
        { label: "Social Risk", icon: "Users", color: "text-rose-300" },
        { label: "Europe (-)", icon: "Euro", color: "text-red-300" }
      ],
      associated_country_codes: ["FR", "GB", "ES"],
      coordinates: [48.8566, 2.3522] // Paris, France
    }
  ],
  executive_takeaway: [
    {
      type: "Markets", 
      icon: "DollarSign",
      headline: "Industrial deal flow slows",
      insight: "Primary issuance windows shorten; HY/EM spreads widen 18-35 bps WoW; banks tighten underwriting. Credit markets are showing clear signs of stress as emerging market high-yield spreads decompress rapidly. This creates a challenging environment for industrial companies seeking refinancing, particularly those with significant international exposure. We expect M&A activity to slow significantly in Q1 as financing becomes more expensive and scarce.",
      exhibits: [
        { title: "HY Spread Decomposition Analysis", type: "Chart" },
        { title: "Q1 2025 Issuance Calendar - At Risk Deals", type: "Calendar" },
        { title: "Bank Underwriting Criteria Tightening Survey", type: "Document" },
        { title: "Industrial Sector Credit Stress Indicators", type: "Analysis" }
      ],
      key_metrics: {
        "HY Spread Widening": "18-35 bps WoW",
        "Deal Cancellation Rate": "23%",
        "Average Time to Close": "45% increase"
      },
      risk_assessment: "Medium-High - Refinancing cliff approaching",
      confidence_level: 0.78
    },
    {
      type: "Policy",
      icon: "Scale",
      headline: "Regulators harden stance on big tech",
      insight: "Bipartisan push on content/privacy expands audit scope Y/Y; capex guidance reflects regulatory friction. New AI content rules from DC signal a fundamental shift in how tech giants will operate, with compliance costs expected to surge 40-60% across major platforms. This represents a material headwind for FAANG stocks in the near term, as companies redirect resources from growth initiatives to regulatory compliance infrastructure.",
      exhibits: [
        { title: "Congressional Hearing Schedule Q1 2025", type: "Document" },
        { title: "Compliance Budget Allocations - Meta, Google, Apple", type: "Chart" },
        { title: "Legal Spend Forecasts by Tech Giant", type: "Analysis" },
        { title: "Historical Regulatory Impact on Stock Performance", type: "Research" }
      ],
      key_metrics: {
        "Expected Compliance Cost Increase": "40-60%",
        "Timeline for Implementation": "Q2 2025",
        "Affected Companies": "AAPL, GOOGL, META, AMZN"
      },
      risk_assessment: "High - Material impact on tech sector margins",
      confidence_level: 0.85
    },
    {
      type: "Global",
      icon: "Globe", 
      headline: "China demand softens into 2026",
      insight: "Exports normalize; household confidence lags; local infra offsets narrow in 2H. Chinese economic data continues to underwhelm expectations as the post-reopening boost fades. Consumer confidence remains well below pre-pandemic levels despite government stimulus efforts. Infrastructure spending, while providing some support, is insufficient to offset weakness in private consumption and export demand. This trend has significant implications for global commodity markets and multinational corporations with substantial China exposure.",
      exhibits: [
        { title: "China Export Volume Trends vs. Global Demand", type: "Chart" },
        { title: "Consumer Confidence Index - Historical Context", type: "Analysis" },
        { title: "Infrastructure Spending Effectiveness Analysis", type: "Research" },
        { title: "Global Supply Chain Impact Assessment", type: "Document" }
      ],
      key_metrics: {
        "Consumer Confidence": "-15% vs. pre-pandemic",
        "Export Growth YoY": "-3.2%",
        "Infrastructure Spending": "+8.5% but slowing"
      },
      risk_assessment: "Medium - Global growth implications",
      confidence_level: 0.72
    }
  ],
  consensus_score: 66,
  consensus_breakdown: {
    morning_takeaway: "Consensus tilts mixed (66), with policy oversight weighing most, credit spreads flashing stress, and China slowdown suppressing growth outlook.",
    segments: [
      {name: "Policy", weight: 0.30, trend: "+", note: "Heightened oversight", detail: "The policy landscape is shifting towards increased regulatory scrutiny, particularly on large technology companies. New regulations are expected regarding data privacy, AI content, and antitrust. This implies higher compliance costs and potential limitations on business models for affected sectors. Investors should monitor legislative progress and its potential impact on sector-specific profitability and innovation.", stress_level: "moderate", trend_indicator: "rising"},
      {name: "Credit", weight: 0.25, trend: "-", note: "Spread stress rising", detail: "Credit markets are showing signs of stress, particularly in emerging market high-yield (EM HY) bonds. Spreads have widened significantly week-over-week, indicating increased risk perception among lenders. This could lead to higher borrowing costs for corporations, reduced access to capital, and a slowdown in M&A activity, especially for companies with significant debt loads or reliance on credit markets for expansion.", stress_level: "high", trend_indicator: "worsening"},
      {name: "Equities", weight: 0.25, trend: "~", note: "Flat breadth", detail: "Equity market breadth remains flat, suggesting that recent market gains are concentrated in a few large-cap stocks rather than a broad-based recovery. This lack of participation could indicate underlying fragility. While headline indices might appear resilient, investors should exercise caution and diversify portfolios, focusing on companies with strong fundamentals that are less sensitive to macro swings.", stress_level: "stable", trend_indicator: "stable"},
      {name: "Global", weight: 0.20, trend: "-", note: "China slowdown", detail: "China's economic growth continues to decelerate, impacting global demand and commodity prices. Efforts to stimulate the economy have had limited success, and consumer confidence remains subdued. This slowdown poses risks to multinational corporations with significant exposure to the Chinese market and could dampen global trade volumes. Strategic adjustments to supply chains and market focus may be necessary to mitigate these risks.", stress_level: "moderate", trend_indicator: "worsening"},
    ]
  },
  synthesis: {
    consensus: [
      {
        claim: "Regulatory scrutiny on large-cap tech intensifying",
        evidence_urls: ["https://example.com/wapo/1", "https://example.com/nyt/1", "https://example.com/ft/1"],
        confidence: 0.74,
        macro_tags: ["Regulation", "Tech"],
        rationale: "Three sources reference hearings or rulemaking acceleration."
      }
    ],
    divergences: [
      {
        id: "em_credit",
        type: "coverage_gap",
        topic: "EM credit stress pockets",
        detail: "HY spreads +35bps WoW",
        present_in: ["ft"],
        missing_in: ["nyt", "wapo"],
        evidence_urls: ["https://example.com/ft/2"],
        confidence: 0.63,
        macro_tags: ["Credit", "EM"],
        rationale: "Only FT mentions syndication delays and spread decompression.",
        linked: ["ft", "washpost"]
      },
      {
        id: "energy_vs_industrials",
        type: "angle_disagreement", 
        topic: "Energy resilience vs industrial softness",
        detail: "Margin dispersion widens",
        present_in: ["wsj"],
        missing_in: ["nyt"],
        evidence_urls: ["https://example.com/wsj/1"],
        confidence: 0.58,
        macro_tags: ["Energy", "Industrial"],
        rationale: "Sector performance diverges significantly.",
        linked: ["ft"]
      }
    ],
    us_global_split: [
      {
        topic: "China growth trajectory",
        us_view: "contained slowdown",
        global_view: "structural deceleration", 
        evidence_urls_us: ["https://example.com/nyt/2"],
        evidence_urls_global: ["https://example.com/ft/3"],
        confidence: 0.71
      }
    ]
  },
  counterpoints: [
    {
      consensus: "Regulation tightening",
      counter: "Some analysts see FTC moderation pre-election",
      confidence: 0.45,
      source: "alternative_analysis"
    },
    {
      consensus: "China slowdown", 
      counter: "Stimulus signals may re-accelerate infra growth",
      confidence: 0.52,
      source: "contrarian_view"
    }
  ],
  blindspots: [
    {
      title: "Overseas press",
      text: "Nikkei highlights Asia M&A rebound, ignored in US press",
      significance: "medium",
      region: "asia"
    }
  ],
  sources: [
    {
      source: "wapo",
      name: "Washington Post",
      specialty: "Policy",
      topline: "Tech oversight rises",
      policy: "Committee signals broader enforcement runway",
      market_macro: "Bank capital debate resurfaces",
      tones: ["cautionary"],
      risk_flags: ["regulatory"],
      influence: 5,
      reliability: 4,
      historical_bias: "Tends to emphasize regulatory risks"
    },
    {
      source: "nyt", 
      name: "New York Times",
      specialty: "Domestic",
      topline: "Green industry narrative builds",
      policy: "Subsidy momentum intact",
      market_macro: "Household spend mixed",
      tones: ["neutral", "supportive"],
      risk_flags: ["policy", "labor"],
      influence: 4,
      reliability: 4,
      historical_bias: "Consumer-focused perspective"
    },
    {
      source: "wsj",
      name: "Wall Street Journal", 
      specialty: "Markets",
      topline: "Industrial M&A pipeline warming",
      policy: "Higher-for-longer priced by CFOs",
      market_macro: "EM corporate debt pockets tighten",
      tones: ["neutral", "cautionary"],
      risk_flags: ["credit", "rates"],
      influence: 5,
      reliability: 5,
      historical_bias: "Market-centric, corporate viewpoint"
    },
    {
      source: "ft",
      name: "Financial Times",
      specialty: "Global", 
      topline: "China outlook weakens",
      policy: "Local stimulus narrows",
      market_macro: "Export mix shifts",
      tones: ["cautionary"],
      risk_flags: ["fx", "growth", "rates"],
      influence: 5,
      reliability: 5,
      historical_bias: "Global macro focus, EM expertise"
    }
  ],
  trajectory: [
    {
      horizon: "Now",
      risk: "↑ Compliance drag",
      opportunity: "Neutral",
      confidence: 0.8
    },
    {
      horizon: "3M",
      risk: "↑ EM credit stress", 
      opportunity: "Selective M&A",
      confidence: 0.65
    },
    {
      horizon: "12M",
      risk: "Mixed global demand",
      opportunity: "Cheaper inputs for US",
      confidence: 0.55
    }
  ],
  strategic_implications: [
    { 
      type: 'risk', 
      text: "Compliance cycle tightening → ↑ costs, ↓ innovation velocity",
      timeframe: "short_term",
      priority: "high",
      action_cues: ["Tech sector watchlist", "Regulatory expense alerts", "Policy timeline tracker"]
    },
    { 
      type: 'risk', 
      text: "EM stress → ↑ funding costs for exporters", 
      timeframe: "medium_term",
      priority: "medium",
      action_cues: ["EM credit spreads alert", "Export-heavy stocks monitor", "FX volatility monitor"]
    },
    { 
      type: 'opportunity', 
      text: "China slowdown → cheaper inputs for US producers",
      timeframe: "long_term", 
      priority: "medium",
      action_cues: ["Commodity price alerts", "Manufacturing sector rotation", "Supply chain optimization"]
    }
  ],
  status: 'ok',
  missing_sources: [],
  sla_adherence: true,
  sentiment_flow: { green: 28, blue: 44, red: 28 },
  insight_line: "Markets lean risk-off — 3 divergences flagged in global credit spreads."
};

// Main page component
export default function MacroSignalsPage() {
  const [digest, setDigest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);

  const [selectedSignal, setSelectedSignal] = useState(null);
  const [selectedTakeaway, setSelectedTakeaway] = useState(null);
  const [selectedDivergence, setSelectedDivergence] = useState(null);
  const [selectedSegment, setSelectedSegment] = useState(null);

  // Memoize sanitized data to prevent re-computation on re-renders
  const sanitizedDigest = useMemo(() => {
    if (!MOCK_DATA) return null;
    // NOTE: For very large objects, this sanitization could be moved to a Web Worker
    // to avoid blocking the main thread on initial load.
    return deepSanitize(MOCK_DATA);
  }, []);

  const fetchDigest = useCallback(async (date) => {
    setIsLoading(true);
    setError(null);
    setDigest(null);

    // Add performance mark for tracking
    performance.mark('digest_fetch_start');

    try {
      // Simulate fetching data with a delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      setDigest(sanitizedDigest);
      performance.mark('digest_fetch_end');
      performance.measure('digest_fetch_duration', 'digest_fetch_start', 'digest_fetch_end');

    } catch (err) {
      console.error("Error fetching digest:", err);
      setError(err.message || "Digest unavailable. Please try again shortly.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [sanitizedDigest]); // Dependency is stable

  useEffect(() => {
    fetchDigest(targetDate);
  }, [targetDate, fetchDigest]);

  // Wrap navigation handlers in useCallback to stabilize them for child components
  const handleNavigateTakeaway = useCallback((direction) => {
    if (!digest?.executive_takeaway || !selectedTakeaway) return;
    const takeaways = digest.executive_takeaway;
    const currentIndex = takeaways.findIndex(item => item.headline === selectedTakeaway.headline);
    if (currentIndex === -1) return;
    const totalItems = takeaways.length;
    const nextIndex = direction === 'next' ? (currentIndex + 1) % totalItems : (currentIndex - 1 + totalItems) % totalItems;
    setSelectedTakeaway(takeaways[nextIndex]);
  }, [digest, selectedTakeaway]);

  const handleNavigateSignal = useCallback((direction) => {
    if (!digest?.priority_signals || !selectedSignal) return;
    const signals = digest.priority_signals;
    const currentIndex = signals.findIndex(signal => signal.text === selectedSignal.text);
    if (currentIndex === -1) return;
    const totalItems = signals.length;
    const nextIndex = direction === 'next' ? (currentIndex + 1) % totalItems : (currentIndex - 1 + totalItems) % totalItems;
    setSelectedSignal(signals[nextIndex]);
  }, [digest, selectedSignal]);

  const handleNavigateSegment = useCallback((direction) => {
    if (!digest?.consensus_breakdown?.segments || !selectedSegment) return;
    const segments = digest.consensus_breakdown.segments;
    const currentIndex = segments.findIndex(seg => seg.name === selectedSegment.name);
    if (currentIndex === -1) return;
    const totalItems = segments.length;
    const nextIndex = direction === 'next' ? (currentIndex + 1) % totalItems : (currentIndex - 1 + totalItems) % totalItems;
    setSelectedSegment(segments[nextIndex]);
  }, [digest, selectedSegment]);

  const handleNavigateDivergence = useCallback((direction) => {
    if (!digest?.synthesis?.divergences || !selectedDivergence) return;
    const divergences = digest.synthesis.divergences;
    const currentIndex = divergences.findIndex(d => d.id === selectedDivergence.id);
    if (currentIndex === -1) return;
    const totalItems = divergences.length;
    const nextIndex = direction === 'next' ? (currentIndex + 1) % totalItems : (currentIndex - 1 + totalItems) % totalItems;
    setSelectedDivergence(divergences[nextIndex]);
  }, [digest, selectedDivergence]);

  // Stable callbacks for opening/closing drawers
  const closeTakeawayDrawer = useCallback(() => setSelectedTakeaway(null), []);
  const closeDivergenceDrawer = useCallback(() => setSelectedDivergence(null), []);
  const closeSignalDrawer = useCallback(() => setSelectedSignal(null), []);
  const closeSegmentDrawer = useCallback(() => setSelectedSegment(null), []);
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
        // Handle takeaway navigation
        if (selectedTakeaway) {
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                handleNavigateTakeaway('next');
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                handleNavigateTakeaway('prev');
            }
        }
        
        // Handle signal navigation
        else if (selectedSignal) {
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                handleNavigateSignal('next');
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                handleNavigateSignal('prev');
            }
        }

        // Handle segment navigation
        else if (selectedSegment) {
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                handleNavigateSegment('next');
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                handleNavigateSegment('prev');
            }
        }
        // Handle divergence navigation
        else if (selectedDivergence) {
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                handleNavigateDivergence('next');
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                handleNavigateDivergence('prev');
            }
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedTakeaway, handleNavigateTakeaway, selectedSignal, handleNavigateSignal, selectedSegment, handleNavigateSegment, selectedDivergence, handleNavigateDivergence]);
  
  const isDegraded = useMemo(() => digest?.status === 'degraded' || (digest?.missing_sources?.length || 0) > 0, [digest]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const sectionVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.98
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
  };
  
  return (
    <div className="min-h-screen font-sans overflow-x-hidden" style={{ 
      background: '#0B0E13',
      color: '#F8FAFC'
    }}>
      {/* Subtle Vignette - Replaces Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-25">
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0.0) 100%)'
          }}
        />
      </div>

      <DigestHeader 
        targetDate={targetDate}
        setTargetDate={setTargetDate}
        isLoading={isLoading}
        sentimentFlow={digest?.sentiment_flow}
        insightLine={digest?.insight_line}
      />

      <main className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <RetryWrapper 
          error={error} 
          isLoading={isLoading} 
          onRetry={() => fetchDigest(targetDate)}
        >
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div 
                key="skeleton" 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
              >
                <DigestSkeleton />
              </motion.div>
            ) : digest && (
              <motion.div 
                key="content" 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.3 } }}
                className="grid grid-cols-12 gap-6 md:gap-8"
                id="dimon-digest-container"
              >
                {isDegraded && (
                  <motion.div variants={sectionVariants} className="col-span-12">
                    <DegradedBanner missingSources={digest.missing_sources || []} />
                  </motion.div>
                )}
                
                {/* 1) U.S. Front Page Signals */}
                {digest.priority_signals && digest.priority_signals.length > 0 && (
                  <motion.div 
                    variants={sectionVariants}
                    id="section-priority-signals" 
                    data-section-order="1"
                    className="col-span-12"
                  >
                    <PrioritySignalStrip signals={digest.priority_signals} onOpenDrawer={setSelectedSignal} />
                  </motion.div>
                )}

                {/* 2) U.S. Business & Markets */}
                {digest.executive_takeaway && digest.executive_takeaway.length > 0 && (
                  <motion.div 
                    variants={sectionVariants}
                    id="section-executive-takeaway" 
                    data-section-order="2"
                    className="col-span-12"
                  >
                    <ExecutiveTakeaway digest={digest} onOpenMemo={setSelectedTakeaway} />
                  </motion.div>
                )}

                {/* 2.5) Global Holographic Map - MIDDLE ANCHOR PLACEMENT */}
                <motion.div 
                  variants={sectionVariants}
                  id="section-global-holographic-map" 
                  data-section-order="2.5"
                  className="col-span-12"
                >
                  <GlobalSignalLattice onOpenSignalDrawer={setSelectedSignal} />
                </motion.div>
                
                {/* 3) Global Signals — OS HORIZON REFINED LAYOUT */}
                <motion.div className="col-span-12" variants={sectionVariants} id="section-global-signals" data-section-order="3">
                    <div className="mb-6 pl-2">
                        <h2 className="text-2xl font-bold mb-2" style={{ color: 'rgba(255,255,255,0.95)' }}>
                          Global Signals
                        </h2>
                        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.70)' }}>
                          Consensus and divergence across key sources.
                        </p>
                    </div>
                    
                    {/* Enhanced Grid with Breathing Room */}
                    <div className="grid grid-cols-12 gap-5 items-start">
                        <div className="col-span-12 lg:col-span-4">
                            <ConsensusMeter 
                                score={digest.consensus_score} 
                                breakdown={digest.consensus_breakdown} 
                                onOpenDrawer={setSelectedSegment}
                            />
                        </div>
                        <div className="col-span-12 lg:col-span-8">
                            <DivergenceReport 
                                divergences={digest.synthesis?.divergences || []} 
                                onOpenDrawer={setSelectedDivergence} 
                            />
                        </div>
                    </div>
                </motion.div>

                {/* 4) Narrative Map */}
                {/* NOTE: NarrativeMap would be a great candidate for React.lazy() to code-split it */}
                {digest.synthesis && (
                  <motion.div 
                    variants={sectionVariants}
                    id="section-narrative-map" 
                    data-section-order="4"
                    className="col-span-12 relative z-10"
                  >
                    <NarrativeMap synthesis={digest.synthesis} density="compact" />
                  </motion.div>
                )}
                
                {/* 5) Trusted Source Weighting */}
                {digest.sources && digest.sources.length > 0 && (
                   <motion.div 
                    variants={sectionVariants}
                    id="section-source-weighting" 
                    data-section-order="5"
                    className="col-span-12"
                  >
                    <SourceGrid sources={digest.sources} density="compact" />
                  </motion.div>
                )}

                {/* 6) Strategic Implications & Trajectory */}
                 <div className="col-span-12 grid grid-cols-1 gap-6 md:gap-8">
                    {digest.strategic_implications && digest.strategic_implications.length > 0 && (
                      <motion.div 
                        variants={sectionVariants}
                        id="section-strategic-implications" 
                        data-section-order="6"
                      >
                        <ImplicationsPanel implications={digest.strategic_implications} />
                      </motion.div>
                    )}
                    {digest.trajectory && digest.trajectory.length > 0 && (
                      <motion.div 
                        variants={sectionVariants}
                        id="section-strategic-trajectory" 
                        data-section-order="6"
                      >
                        <StrategicTrajectory trajectory={digest.trajectory} density="compact" />
                      </motion.div>
                    )}
                 </div>

                {/* 7) Counterpoints & Blindspots */}
                {((digest.counterpoints && digest.counterpoints.length > 0) || (digest.blindspots && digest.blindspots.length > 0)) && (
                  <motion.div 
                    variants={sectionVariants}
                    id="section-counterpoints" 
                    data-section-order="7"
                    className="col-span-12"
                  >
                    <CounterpointsPanel 
                      counterpoints={digest.counterpoints || []} 
                      blindspots={digest.blindspots || []}
                      density="compact"
                    />
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </RetryWrapper>
      </main>

      {/* 
        NOTE: Performance optimization. Only one drawer is truly "open" at a time.
        The current structure correctly ensures only one's content is rendered.
        The isOpen={!!...} pattern is efficient.
        We pass stable callbacks to prevent re-renders of memoized drawers.
      */}
      <MemoDrawer 
        isOpen={!!selectedTakeaway}
        onClose={closeTakeawayDrawer}
        item={selectedTakeaway}
        onNavigate={handleNavigateTakeaway}
      />
      {/* Removed SentimentDrawer as per instructions, ConsensusMeter now directly triggers SegmentDetailDrawer */}
      <DivergenceDrawer
        isOpen={!!selectedDivergence}
        onClose={closeDivergenceDrawer}
        divergence={selectedDivergence}
        onNavigate={handleNavigateDivergence}
      />
      <SignalDetailDrawer
        isOpen={!!selectedSignal}
        onClose={closeSignalDrawer}
        signal={selectedSignal}
        onNavigate={handleNavigateSignal}
      />
      <SegmentDetailDrawer
        isOpen={!!selectedSegment}
        onClose={closeSegmentDrawer}
        segment={selectedSegment}
        onNavigate={handleNavigateSegment}
      />
      
      <footer className="relative z-10 text-center py-8 border-t border-white/10">
        <p className="text-xs opacity-50">
          This is a demonstration of Vireon's macro-synthesis engine. Not financial advice.
        </p>
      </footer>
    </div>
  );
}
