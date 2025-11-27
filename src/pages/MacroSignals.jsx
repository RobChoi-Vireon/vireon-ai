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
      text: "U.S. AI rules raise compliance costs. Tech stocks at risk.",
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
      text: "EM borrowing costs up. Bond issuance slowing.",
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
      text: "Quantum breakthrough threatens current encryption. Long-term risk.",
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
      text: "Trade tensions disrupt supply chains. Industrial costs rising.",
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
      text: "Clean energy costs may drop sharply. Renewables gain edge.",
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
      text: "Cost-of-living protests spread across Europe. Consumer risk rising.",
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
      headline: "Deal flow slowing as borrowing costs rise",
      insight: "Bond issuance stalling. High-yield spreads widening. Banks tightening lending. Industrial refinancing at risk. M&A likely to slow in Q1 as financing becomes scarce.",
      exhibits: [
        { title: "HY Spread Analysis", type: "Chart" },
        { title: "Q1 Deal Calendar — At Risk", type: "Calendar" },
        { title: "Bank Lending Survey", type: "Document" },
        { title: "Industrial Stress Indicators", type: "Analysis" }
      ],
      key_metrics: {
        "Borrowing Cost Increase": "Rising across all categories",
        "Deal Cancellation Rate": "23%",
        "Average Time to Close": "45% increase"
      },
      risk_assessment: "Medium-High — Refinancing risk elevated",
      confidence_level: 0.78
    },
    {
      type: "Policy",
      icon: "Scale",
      headline: "Tech oversight intensifying",
      insight: "Bipartisan push for stricter content and privacy rules. AI regulations signal 40-60% compliance cost jump. Growth budgets redirecting to legal. Tech margins under pressure near-term.",
      exhibits: [
        { title: "Congressional Hearing Calendar", type: "Document" },
        { title: "Compliance Budget Shifts", type: "Chart" },
        { title: "Legal Spend Forecasts", type: "Analysis" },
        { title: "Regulatory Impact History", type: "Research" }
      ],
      key_metrics: {
        "Expected Compliance Cost Increase": "40-60%",
        "Timeline for Implementation": "Q2 2025",
        "Affected Companies": "AAPL, GOOGL, META, AMZN"
      },
      risk_assessment: "High — Tech margins at risk",
      confidence_level: 0.85
    },
    {
      type: "Global",
      icon: "Globe", 
      headline: "China growth decelerating",
      insight: "Exports normalizing. Consumer confidence weak. Infrastructure spend not offsetting demand decline. Commodity prices and China-exposed companies at risk.",
      exhibits: [
        { title: "China Export Trends", type: "Chart" },
        { title: "Consumer Confidence History", type: "Analysis" },
        { title: "Infrastructure ROI", type: "Research" },
        { title: "Supply Chain Impact", type: "Document" }
      ],
      key_metrics: {
        "Consumer Confidence": "15% below pre-pandemic",
        "Export Growth": "Down 3.2% YoY",
        "Infrastructure Spending": "Up 8.5% but slowing"
      },
      risk_assessment: "Medium — Global growth drag",
      confidence_level: 0.72
    }
  ],
  consensus_score: 66,
  consensus_breakdown: {
    morning_takeaway: "Mixed sentiment. Regulation weighs on tech, credit stress rising, China drag persists.",
    segments: [
      {name: "Policy", weight: 0.30, trend: "+", note: "Oversight rising", detail: "Stricter tech rules ahead. Higher compliance costs expected. Watch legislative moves.", stress_level: "moderate", trend_indicator: "rising"},
      {name: "Credit", weight: 0.25, trend: "-", note: "Spreads widening", detail: "Borrowing costs up sharply. EM and HY under pressure. M&A financing constrained.", stress_level: "high", trend_indicator: "worsening"},
      {name: "Equities", weight: 0.25, trend: "~", note: "Narrow breadth", detail: "Gains concentrated in mega-caps. Broad participation weak. Diversify.", stress_level: "stable", trend_indicator: "stable"},
      {name: "Global", weight: 0.20, trend: "-", note: "China drag", detail: "Export demand soft. Consumer confidence low. Commodity prices pressured.", stress_level: "moderate", trend_indicator: "worsening"},
    ]
  },
  synthesis: {
    consensus: [
      {
        claim: "Tech oversight rising across regulators",
        evidence_urls: ["https://example.com/wapo/1", "https://example.com/nyt/1", "https://example.com/ft/1"],
        confidence: 0.74,
        macro_tags: ["Regulation", "Tech"],
        rationale: "Three sources confirm hearings and new rules advancing."
      }
    ],
    divergences: [
      {
        id: "em_credit",
        type: "coverage_gap",
        topic: "EM credit stress under-reported",
        detail: "HY spreads widening; issuance stalling",
        present_in: ["ft"],
        missing_in: ["nyt", "wapo"],
        evidence_urls: ["https://example.com/ft/2"],
        confidence: 0.63,
        macro_tags: ["Credit", "EM"],
        rationale: "FT only source flagging bond delays.",
        linked: ["ft", "washpost"]
      },
      {
        id: "energy_vs_industrials",
        type: "angle_disagreement", 
        topic: "Energy vs Industrial margin divergence",
        detail: "Energy outperforming; industrials lagging",
        present_in: ["wsj"],
        missing_in: ["nyt"],
        evidence_urls: ["https://example.com/wsj/1"],
        confidence: 0.58,
        macro_tags: ["Energy", "Industrial"],
        rationale: "Sector performance diverging sharply.",
        linked: ["ft"]
      }
    ],
    us_global_split: [
      {
        topic: "China growth outlook",
        us_view: "cyclical slowdown",
        global_view: "structural decline", 
        evidence_urls_us: ["https://example.com/nyt/2"],
        evidence_urls_global: ["https://example.com/ft/3"],
        confidence: 0.71
      }
    ]
  },
  counterpoints: [
    {
      consensus: "Regulation tightening",
      counter: "Enforcement may ease pre-election",
      confidence: 0.45,
      source: "alternative_analysis"
    },
    {
      consensus: "China slowing", 
      counter: "New stimulus may lift infrastructure",
      confidence: 0.52,
      source: "contrarian_view"
    }
  ],
  blindspots: [
    {
      title: "Asia M&A uptick",
      text: "Asian sources report rising deal flow — underreported in U.S. media",
      significance: "medium",
      region: "asia"
    }
  ],
  sources: [
    {
      source: "wapo",
      name: "Washington Post",
      specialty: "Policy",
      topline: "Tech oversight rising",
      policy: "Congress signals enforcement push",
      market_macro: "Bank capital debate resurfaces",
      tones: ["cautionary"],
      risk_flags: ["regulatory"],
      influence: 5,
      reliability: 4,
      historical_bias: "Regulatory risk focus"
    },
    {
      source: "nyt", 
      name: "New York Times",
      specialty: "Domestic",
      topline: "Clean energy momentum",
      policy: "Subsidies on track",
      market_macro: "Consumer spending mixed",
      tones: ["neutral", "supportive"],
      risk_flags: ["policy", "labor"],
      influence: 4,
      reliability: 4,
      historical_bias: "Consumer-focused"
    },
    {
      source: "wsj",
      name: "Wall Street Journal", 
      specialty: "Markets",
      topline: "Industrial M&A picks up",
      policy: "Executives expect rates to hold",
      market_macro: "EM borrowing strained",
      tones: ["neutral", "cautionary"],
      risk_flags: ["credit", "rates"],
      influence: 5,
      reliability: 5,
      historical_bias: "Corporate/market lens"
    },
    {
      source: "ft",
      name: "Financial Times",
      specialty: "Global", 
      topline: "China outlook dims",
      policy: "Stimulus running low",
      market_macro: "Export trends shifting",
      tones: ["cautionary"],
      risk_flags: ["fx", "growth", "rates"],
      influence: 5,
      reliability: 5,
      historical_bias: "Global macro / EM focus"
    }
  ],
  trajectory: [
    {
      horizon: "Now",
      risk: "↑ Compliance drag on growth",
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
      risk: "Global demand mixed",
      opportunity: "Lower input costs",
      confidence: 0.55
    }
  ],
  strategic_implications: [
    { 
      type: 'risk', 
      text: "Regulation tightening — tech costs up, innovation slowing",
      timeframe: "short_term",
      priority: "high",
      action_cues: ["Tech watchlist", "Compliance alerts", "Policy tracker"]
    },
    { 
      type: 'risk', 
      text: "EM stress — financing costs rising for global businesses", 
      timeframe: "medium_term",
      priority: "medium",
      action_cues: ["EM spread alerts", "Export monitor", "FX tracker"]
    },
    { 
      type: 'opportunity', 
      text: "China slowdown — cheaper inputs for U.S. manufacturers",
      timeframe: "long_term", 
      priority: "medium",
      action_cues: ["Commodity alerts", "Industrial rotation", "Supply chain moves"]
    }
  ],
  status: 'ok',
  missing_sources: [],
  sla_adherence: true,
  sentiment_flow: { green: 28, blue: 44, red: 28 },
  insight_line: "Risk-off tilt — 3 divergences flagged in global credit."
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
  const [isConsensusDrawerOpen, setIsConsensusDrawerOpen] = useState(false);
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
  const openConsensusDrawer = useCallback(() => setIsConsensusDrawerOpen(true), []);
  const closeConsensusDrawer = useCallback(() => setIsConsensusDrawerOpen(false), []);
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
      {/* OS Horizon V2 Canvas Atmosphere */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Large-Scale Atmospheric Gradient */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(12, 14, 18, 1) 0%, rgba(11, 14, 19, 1) 50%, rgba(10, 12, 16, 1) 100%)'
          }}
        />

        {/* Subtle Cyan-Lavender Palette Hint */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 50% 20%, rgba(110, 180, 255, 0.015) 0%, transparent 60%)'
          }}
        />

        {/* Textural Noise Layer */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            opacity: 0.012,
            mixBlendMode: 'overlay'
          }}
        />

        {/* Vignette Depth */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.18) 100%)'
          }}
        />
      </div>

      <main className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pb-8 md:pb-12" style={{ paddingTop: '28px' }}>
        <DigestHeader 
          targetDate={targetDate}
          setTargetDate={setTargetDate}
          isLoading={isLoading}
          sentimentFlow={digest?.sentiment_flow}
          insightLine={digest?.insight_line}
        />
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
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                        <div className="lg:col-span-5 min-h-[600px]">
                            <ConsensusMeter 
                                score={digest.consensus_score} 
                                breakdown={digest.consensus_breakdown} 
                                onOpenDrawer={openConsensusDrawer}
                            />
                        </div>
                        <div className="lg:col-span-7">
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
      <SentimentDrawer 
        isOpen={isConsensusDrawerOpen}
        onClose={closeConsensusDrawer}
        score={digest?.consensus_score}
        breakdown={digest?.consensus_breakdown}
        onOpenDetail={setSelectedSegment}
      />
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