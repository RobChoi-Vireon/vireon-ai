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
import InflationSection from '@/components/dimon/InflationSection';

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
      text: "New U.S. AI rules will raise costs for companies using AI tools.",
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
      text: "Borrowing costs for emerging-market companies are rising, and fewer new bonds are being issued.",
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
      text: "New quantum computer breakthrough could make current digital security systems vulnerable.",
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
      text: "Trade tensions between major economies are disrupting global supply chains.",
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
      text: "New clean energy technology could significantly lower renewable energy costs.",
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
      text: "Protests over rising living costs are spreading across major European cities.",
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
      headline: "Businesses are slowing down.",
      insight: "Companies are finding it harder to raise money through new bond sales. Borrowing costs are rising, especially for riskier companies and those in emerging markets. Banks are becoming more cautious about who they lend to. This makes it difficult for industrial companies to refinance their debt, particularly those with significant business outside the U.S. We expect merger and acquisition activity to slow significantly in the first quarter as financing becomes more expensive and harder to obtain.",
      exhibits: [
        { title: "High-Risk Borrowing Cost Analysis", type: "Chart" },
        { title: "Q1 2025 Deal Calendar - At Risk Transactions", type: "Calendar" },
        { title: "Bank Lending Standards Survey", type: "Document" },
        { title: "Industrial Sector Financial Stress Indicators", type: "Analysis" }
      ],
      key_metrics: {
        "Borrowing Cost Increase": "Rising across all categories",
        "Deal Cancellation Rate": "23%",
        "Average Time to Close": "45% increase"
      },
      risk_assessment: "Medium-High - Companies facing refinancing challenges ahead",
      confidence_level: 0.78
    },
    {
      type: "Policy",
      icon: "Scale",
      headline: "The government is cracking down on big tech.",
      insight: "Both political parties are pushing for stricter rules on content moderation and user privacy. New AI regulations from Washington signal a fundamental shift in how tech giants will operate, with compliance costs expected to increase by 40-60% across major platforms. This represents a significant challenge for large tech stocks in the near term, as companies redirect money from growth projects to meeting new regulatory requirements.",
      exhibits: [
        { title: "Congressional Hearing Schedule Q1 2025", type: "Document" },
        { title: "Compliance Budget Allocations - Meta, Google, Apple", type: "Chart" },
        { title: "Legal Spending Forecasts by Tech Giant", type: "Analysis" },
        { title: "Historical Regulatory Impact on Stock Performance", type: "Research" }
      ],
      key_metrics: {
        "Expected Compliance Cost Increase": "40-60%",
        "Timeline for Implementation": "Q2 2025",
        "Affected Companies": "AAPL, GOOGL, META, AMZN"
      },
      risk_assessment: "High - Significant impact on tech company profit margins",
      confidence_level: 0.85
    },
    {
      type: "Global",
      icon: "Globe", 
      headline: "China's economy is slowing.",
      insight: "Chinese exports are returning to normal levels after pandemic disruptions. Consumer confidence remains low despite government efforts to boost spending. Infrastructure projects are providing some support but not enough to offset weak consumer spending and declining export demand. This slowdown has significant implications for global commodity prices and international companies that rely heavily on Chinese customers.",
      exhibits: [
        { title: "China Export Trends vs. Global Demand", type: "Chart" },
        { title: "Consumer Confidence Index - Historical Context", type: "Analysis" },
        { title: "Infrastructure Spending Effectiveness Analysis", type: "Research" },
        { title: "Global Supply Chain Impact Assessment", type: "Document" }
      ],
      key_metrics: {
        "Consumer Confidence": "15% below pre-pandemic levels",
        "Export Growth": "Down 3.2% year-over-year",
        "Infrastructure Spending": "Up 8.5% but slowing"
      },
      risk_assessment: "Medium - Could affect global economic growth",
      confidence_level: 0.72
    }
  ],
  consensus_score: 66,
  consensus_breakdown: {
    morning_takeaway: "The market mood is mixed today: new government rules are creating costs, borrowing is getting harder, and China's slowdown is making investors cautious.",
    segments: [
      {name: "Policy", weight: 0.30, trend: "+", note: "More rules coming", detail: "The government is putting more rules on big tech companies. New laws about privacy, AI, and competition are on the way. This means companies will spend more on following rules, which could cut into profits. Watch for news from Washington about how this affects tech stocks.", stress_level: "moderate", trend_indicator: "rising"},
      {name: "Credit", weight: 0.25, trend: "-", note: "Borrowing getting harder", detail: "It's getting harder and more expensive to borrow money, especially for riskier companies. Lenders are being more careful about who they lend to. This could mean fewer business deals, less growth investment, and trouble for companies that need to refinance their debt soon.", stress_level: "high", trend_indicator: "worsening"},
      {name: "Equities", weight: 0.25, trend: "~", note: "Only some stocks rising", detail: "The stock market looks okay on the surface, but only a few big companies are doing well. Most stocks aren't participating in the gains. This could be a warning sign. Consider spreading your investments across different types of companies.", stress_level: "stable", trend_indicator: "stable"},
      {name: "Global", weight: 0.20, trend: "-", note: "China slowing down", detail: "China's economy is growing more slowly, which affects companies around the world. Chinese consumers aren't spending as much, and government programs haven't fully fixed the problem. Companies that sell a lot to China may see lower sales.", stress_level: "moderate", trend_indicator: "worsening"},
    ]
  },
  synthesis: {
    consensus: [
      {
        claim: "Government oversight of large tech companies is increasing",
        evidence_urls: ["https://example.com/wapo/1", "https://example.com/nyt/1", "https://example.com/ft/1"],
        confidence: 0.74,
        macro_tags: ["Regulation", "Tech"],
        rationale: "Three sources mention hearings or new regulations moving forward."
      }
    ],
    divergences: [
      {
        id: "em_credit",
        type: "coverage_gap",
        topic: "Borrowing stress for emerging market companies",
        detail: "Borrowing costs rising sharply",
        present_in: ["ft"],
        missing_in: ["nyt", "wapo"],
        evidence_urls: ["https://example.com/ft/2"],
        confidence: 0.63,
        macro_tags: ["Credit", "EM"],
        rationale: "Only the Financial Times mentions bond issuance delays and rising borrowing costs.",
        linked: ["ft", "washpost"]
      },
      {
        id: "energy_vs_industrials",
        type: "angle_disagreement", 
        topic: "Energy companies performing better than industrial companies",
        detail: "Profit margins diverging significantly",
        present_in: ["wsj"],
        missing_in: ["nyt"],
        evidence_urls: ["https://example.com/wsj/1"],
        confidence: 0.58,
        macro_tags: ["Energy", "Industrial"],
        rationale: "Different sectors showing significantly different performance.",
        linked: ["ft"]
      }
    ],
    us_global_split: [
      {
        topic: "China's economic growth path",
        us_view: "temporary slowdown",
        global_view: "long-term structural decline", 
        evidence_urls_us: ["https://example.com/nyt/2"],
        evidence_urls_global: ["https://example.com/ft/3"],
        confidence: 0.71
      }
    ]
  },
  counterpoints: [
    {
      consensus: "Rules are getting stricter",
      counter: "Some experts think enforcement might slow down before the election",
      confidence: 0.45,
      source: "alternative_analysis"
    },
    {
      consensus: "China is slowing down", 
      counter: "New government spending could help the economy recover",
      confidence: 0.52,
      source: "contrarian_view"
    }
  ],
  blindspots: [
    {
      title: "Asia deals picking up",
      text: "Asian news reports more company mergers, but this hasn't been covered much in the US",
      significance: "medium",
      region: "asia"
    }
  ],
  sources: [
    {
      source: "wapo",
      name: "Washington Post",
      specialty: "Policy",
      topline: "Tech oversight increasing",
      policy: "Congressional committees signaling more enforcement ahead",
      market_macro: "Debate over bank capital requirements resurfacing",
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
      topline: "Clean energy industry gaining momentum",
      policy: "Government subsidies continuing as planned",
      market_macro: "Consumer spending showing mixed results",
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
      topline: "Industrial mergers and acquisitions picking up",
      policy: "Company executives expect interest rates to stay high",
      market_macro: "Emerging market companies facing borrowing difficulties",
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
      topline: "China's economic outlook worsening",
      policy: "Government stimulus programs becoming more limited",
      market_macro: "Export patterns changing",
      tones: ["cautionary"],
      risk_flags: ["fx", "growth", "rates"],
      influence: 5,
      reliability: 5,
      historical_bias: "Global macro focus, emerging markets expertise"
    }
  ],
  trajectory: [
    {
      horizon: "Now",
      risk: "↑ New rules are costing companies money",
      opportunity: "Neutral",
      confidence: 0.8
    },
    {
      horizon: "3M",
      risk: "↑ Borrowing getting harder for some companies", 
      opportunity: "Good deals available for patient buyers",
      confidence: 0.65
    },
    {
      horizon: "12M",
      risk: "Global shoppers buying less",
      opportunity: "Cheaper materials help US manufacturers",
      confidence: 0.55
    }
  ],
  strategic_implications: [
    { 
      type: 'risk', 
      text: "Stricter rules mean higher costs and slower growth for tech companies",
      timeframe: "short_term",
      priority: "high",
      action_cues: ["Watch tech stocks", "Track compliance costs", "Follow policy news"]
    },
    { 
      type: 'risk', 
      text: "Borrowing is getting harder for companies with international business", 
      timeframe: "medium_term",
      priority: "medium",
      action_cues: ["Watch borrowing costs", "Track export companies", "Monitor currency swings"]
    },
    { 
      type: 'opportunity', 
      text: "China buying less means cheaper materials for US factories",
      timeframe: "long_term", 
      priority: "medium",
      action_cues: ["Track material prices", "Watch manufacturing stocks", "Follow supply chain news"]
    }
  ],
  status: 'ok',
  missing_sources: [],
  sla_adherence: true,
  sentiment_flow: { green: 28, blue: 44, red: 28 },
  insight_line: "Markets are playing it safe — we found three areas where experts disagree about borrowing conditions.",
  inflation: {
    cpi_headline_yoy: 3.4,
    cpi_core_yoy: 3.9,
    pce_headline_yoy: 2.6,
    pce_core_yoy: 2.9,
    cpi_mom: 0.3,
    pce_mom: 0.2,
    last_updated: "December 2025",
    state_tag: "Sticky",
    policy_bias: "Hawkish",
    comparison_headline: "CPI running above PCE",
    comparison_detail: "Shelter costs remain elevated in CPI, while PCE shows softer services inflation. Fed watches Core PCE most closely.",
    interpretation_bullets: [
      "Core inflation remains above the Fed's 2% target, with services prices showing persistence.",
      "Housing costs are the primary driver of CPI strength, creating a wedge between CPI and PCE measures.",
      "Month-over-month readings suggest disinflation has stalled, keeping pressure on monetary policy.",
      "Labor market strength continues to support wage growth, limiting downside in services inflation."
    ],
    market_implications: [
      { label: "Rates", direction: "up", note: "Higher for longer" },
      { label: "Equities", direction: "down", note: "Multiple compression" },
      { label: "Credit", direction: "neutral", note: "Spreads stable" },
      { label: "USD", direction: "up", note: "Rate differential support" },
      { label: "Risk", direction: "down", note: "Policy uncertainty" }
    ]
  }
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
  
  const isAnyDrawerOpen = selectedSignal || selectedTakeaway || selectedDivergence || isConsensusDrawerOpen || selectedSegment;

  return (
    <div className="min-h-screen font-sans overflow-x-hidden" style={{ 
      background: '#0B0E13',
      color: '#F8FAFC'
    }}>
      {/* OS Horizon V2 Canvas Atmosphere */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          filter: isAnyDrawerOpen ? 'blur(26px) saturate(1.3) brightness(1.15)' : 'none',
          transition: 'filter 280ms cubic-bezier(0.19, 1, 0.22, 1)',
          willChange: 'filter'
        }}
      >
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

      <main 
        className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pb-6 md:pb-8" 
        style={{ 
          paddingTop: '16px',
          filter: isAnyDrawerOpen ? 'blur(26px) saturate(1.3) brightness(1.15)' : 'none',
          transition: 'filter 280ms cubic-bezier(0.19, 1, 0.22, 1)',
          willChange: 'filter'
        }}
      >
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
                className="grid grid-cols-12 gap-4 md:gap-5"
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

                {/* 2.5) Inflation Section */}
                {digest.inflation && (
                  <motion.div 
                    variants={sectionVariants}
                    id="section-inflation" 
                    data-section-order="2.5"
                    className="col-span-12"
                  >
                    <InflationSection data={digest.inflation} />
                  </motion.div>
                )}

                {/* 3) Global Equilibrium Parallax */}
                <motion.div 
                  variants={sectionVariants}
                  id="section-global-equilibrium-parallax" 
                  data-section-order="3"
                  className="col-span-12"
                >
                  <GlobalSignalLattice onOpenSignalDrawer={setSelectedSignal} />
                </motion.div>
                
                {/* 4) Global Signals — OS HORIZON REFINED LAYOUT */}
                <motion.div className="col-span-12" variants={sectionVariants} id="section-global-signals" data-section-order="4">
                    <div className="mb-4 pl-2">
                        <h2 className="text-xl font-bold mb-1" style={{ color: 'rgba(255,255,255,0.95)' }}>
                          Global Signals
                        </h2>
                        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.70)' }}>
                          Consensus and divergence across key sources.
                        </p>
                    </div>
                    
                    {/* Enhanced Grid with Breathing Room */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                        <div className="lg:col-span-5 min-h-[480px]">
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

                {/* 5) Narrative Map */}
                {/* NOTE: NarrativeMap would be a great candidate for React.lazy() to code-split it */}
                {digest.synthesis && (
                  <motion.div 
                    variants={sectionVariants}
                    id="section-narrative-map" 
                    data-section-order="5"
                    className="col-span-12 relative z-10"
                  >
                    <NarrativeMap synthesis={digest.synthesis} density="compact" />
                  </motion.div>
                )}
                
                {/* 6) Trusted Source Weighting */}
                {digest.sources && digest.sources.length > 0 && (
                   <motion.div 
                    variants={sectionVariants}
                    id="section-source-weighting" 
                    data-section-order="6"
                    className="col-span-12"
                  >
                    <SourceGrid sources={digest.sources} density="compact" />
                  </motion.div>
                )}

                {/* 7) Strategic Implications & Trajectory */}
                 <div className="col-span-12 grid grid-cols-1 gap-6 md:gap-8">
                    {digest.strategic_implications && digest.strategic_implications.length > 0 && (
                      <motion.div 
                        variants={sectionVariants}
                        id="section-strategic-implications" 
                        data-section-order="7"
                      >
                        <ImplicationsPanel implications={digest.strategic_implications} />
                      </motion.div>
                    )}
                    {digest.trajectory && digest.trajectory.length > 0 && (
                      <motion.div 
                        variants={sectionVariants}
                        id="section-strategic-trajectory" 
                        data-section-order="7"
                      >
                        <StrategicTrajectory trajectory={digest.trajectory} density="compact" />
                      </motion.div>
                    )}
                 </div>

                {/* 8) Counterpoints & Blindspots */}
                {((digest.counterpoints && digest.counterpoints.length > 0) || (digest.blindspots && digest.blindspots.length > 0)) && (
                  <motion.div 
                    variants={sectionVariants}
                    id="section-counterpoints" 
                    data-section-order="8"
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