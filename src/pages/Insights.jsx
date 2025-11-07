import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Download, GitCompare, UserCheck, TrendingUp, Shield, BarChart3, Compass, Calendar, AlertTriangle, Target, Zap, Flame, Rocket, ArrowUp, ArrowDown, TrendingDown, DollarSign, Activity } from 'lucide-react';
import AIOutlook from '../components/insights/AIOutlook';
import CrossSignalDivergence from '../components/insights/CrossSignalDivergence';
import PersonalizedLens from '../components/insights/PersonalizedLens';
import ForwardRiskMap from '../components/insights/ForwardRiskMap';
import StrategistPlaybook from '../components/insights/StrategistPlaybook';
import LyraLogo from '../components/core/LyraLogo';

// Mock data simulating complex backend synthesis
const mockOutlookData = {
  scenarios: [
    { 
      type: 'Bull', 
      probability: 25, 
      trending: 'up',
      drivers: ['CPI miss accelerates Fed pivot speculation.', 'Tech earnings surprise to the upside.', 'Geopolitical tensions in key regions de-escalate.'], 
      confidence: 'Medium', 
      historicalContext: "Similar setup in Q4 2018 preceded a 6% rally in equities.",
      linkedModules: ['Macro Signals', 'Sector Heatmap']
    },
    { 
      type: 'Base', 
      probability: 55, 
      trending: 'stable',
      drivers: ['Fed maintains hawkish pause, data dependent.', 'Mixed earnings season with slowing growth.', 'Orderly slowdown in consumer spending.'], 
      confidence: 'High', 
      historicalContext: "Reflects typical late-cycle dynamics with controlled volatility.",
      linkedModules: ['Macro Signals', 'Watchlist']
    },
    { 
      type: 'Bear', 
      probability: 20, 
      trending: 'down',
      drivers: ['Sticky inflation forces another rate hike.', 'Credit event surfaces in commercial real estate.', 'Major supply chain disruption in Asia.'], 
      confidence: 'Medium', 
      historicalContext: "Risk of a repeat of the 2022 inflationary shock remains, though contained.",
      linkedModules: ['Macro Signals', 'Event Tracker']
    },
  ],
  personalCallout: "This week's inflation data and MSFT earnings report will have an outsized impact on your tracked NVDA and AAPL positions.",
};

const mockDivergenceData = [
  {
    title: "Weakening Dollar vs. Lagging EM Equities",
    description: "The DXY has fallen 1.5% this week, which typically fuels a rally in Emerging Markets. However, the EEM ETF is flat, suggesting underlying weakness or risk aversion in EM that contradicts the FX signal.",
    whyItMatters: "Potential trap for longs in EM; suggests risk-off sentiment is more pervasive than FX markets indicate.",
    sources: ["Macro Signals", "Watchlist"],
    sourceModules: ["MacroSignals", "Watchlist"],
    assetClass: 'Equities',
    isNew: true,
    intensity: 'high'
  },
  {
    title: "Energy Sector Rotation vs. Yield Curve",
    description: "XLE is showing strong inflows, indicating a cyclical rotation. This move usually coincides with a steepening yield curve, but the 2s10s spread remains deeply inverted.",
    whyItMatters: "Conflict between equity and bond markets. One is pricing growth, the other recession. High probability of volatility.",
    sources: ["Sector Heatmap", "Macro Signals"],
    sourceModules: ["SectorHeatmap", "MacroSignals"],
    assetClass: 'Rates',
    isNew: false,
    intensity: 'medium'
  },
];

const mockPersonalizedData = [
  {
    ticker: "NVDA",
    logoUrl: "https://logo.clearbit.com/nvidia.com",
    insight: "Upcoming earnings imply an 8.5% move. The current macro stance makes tech highly sensitive to any guidance revisions, amplifying risk.",
    exposure: "High",
    exposureChange: "increased",
    impliedVol: 85.2,
    sentimentScore: 72,
    revisionTrend: "positive",
    links: { "Earnings": "/earnings/NVDA", "Macro": "/macrosignals" },
    isElevated: true,
    sparklineData: [80, 82, 85, 83, 87, 85, 88, 85]
  },
  {
    ticker: "JPM",
    logoUrl: "https://logo.clearbit.com/jpmorgan.com",
    insight: "Your watchlist is overweight Financials. Recent regional bank commentary suggests potential for better-than-expected net interest margins, a positive catalyst for JPM.",
    exposure: "Medium",
    exposureChange: "stable",
    impliedVol: 32.1,
    sentimentScore: 58,
    revisionTrend: "neutral",
    links: { "Watchlist": "/watchlist", "News": "/livefeed?q=JPM" },
    isElevated: false,
    sparklineData: [30, 31, 32, 31, 33, 32, 34, 32]
  },
];

const mockRiskMapData = {
  "1-2 Weeks": { 
    risks: [
      { text: 'CPI print hotter than expected', intensity: 0.8, icon: Flame },
      { text: 'Geopolitical flare-up', intensity: 0.6, icon: Zap }
    ], 
    opportunities: [
      { text: 'Tech earnings beat lowered expectations', intensity: 0.7, icon: Rocket },
      { text: 'Dovish Fed surprise', intensity: 0.5, icon: ArrowUp }
    ] 
  },
  "1-3 Months": { 
    risks: [
      { text: 'Credit cycle tightening', intensity: 0.9, icon: Flame },
      { text: 'Slowing consumer spending', intensity: 0.7, icon: TrendingDown }
    ], 
    opportunities: [
      { text: 'Potential Fed pivot brings forward rate cuts', intensity: 0.8, icon: Rocket },
      { text: 'Disinflationary trend accelerates', intensity: 0.6, icon: BarChart3 }
    ] 
  },
  "6+ Months": { 
    risks: [
      { text: 'Deglobalization affecting supply chains', intensity: 0.6, icon: Activity },
      { text: 'Structural inflation', intensity: 0.7, icon: ArrowUp }
    ], 
    opportunities: [
      { text: 'AI-driven productivity boom fully materializes', intensity: 0.9, icon: Brain },
      { text: 'Energy transition investments', intensity: 0.8, icon: Zap }
    ] 
  }
};

const mockStrategistNotes = {
  hedging: { 
    title: "Hedging", 
    icon: Shield,
    content: "Consider short-dated VIX calls into CPI as a portfolio hedge against a hotter-than-expected print.",
    reasoning: "Historical volatility spikes during surprise inflation prints average 15-20%. Current VIX at 18.5 offers asymmetric upside protection.",
    linkedSignals: ["Macro Signals: CPI Expectations", "Options Flow: VIX Call Volume"]
  },
  catalysts: { 
    title: "Catalysts to Watch", 
    icon: Calendar,
    content: "Monitor Powell's speech on Thursday; market is pricing in a 70% chance of a hawkish tone, leaving room for a dovish surprise.",
    reasoning: "Fed Watch tool shows 70% hawkish probability vs 30% neutral/dovish. Any dovish lean could trigger 1-2% equity rally given current positioning.",
    linkedSignals: ["Event Calendar: Fed Speakers", "Macro Signals: Fed Policy Tracker"]
  },
  positioning: { 
    title: "Tactical View", 
    icon: Compass,
    content: "Remain neutral on broad indexes, but look for relative value in Healthcare (XLV) vs. Discretionary (XLY) on signs of economic slowing.",
    reasoning: "Healthcare typically outperforms during economic uncertainty. Current XLV/XLY ratio at 0.85, near historical support.",
    linkedSignals: ["Sector Heatmap: Rotation Signals", "Watchlist: Sector Allocation"]
  }
};

export default function InsightsPage() {
  const [selectedTimeHorizon, setSelectedTimeHorizon] = useState("1-2 Weeks");
  const timeHorizons = Object.keys(mockRiskMapData);
  const scrollContainerRef = useRef(null);

  return (
    <>
      {/* Refined Gradient Bridge */}
      <div className="fixed top-0 left-0 md:left-[280px] w-8 md:w-12 h-full pointer-events-none z-10">
        <div 
          className="w-full h-full opacity-40"
          style={{
            background: 'linear-gradient(90deg, rgba(0, 0, 0, 0.9) 0%, rgba(26, 26, 46, 0.4) 40%, rgba(15, 23, 42, 0.15) 70%, transparent 100%)'
          }}
        />
      </div>

      {/* Main Content Container with Elevated Design */}
      <div 
        className="relative min-h-screen ml-4 md:ml-8 mr-4 md:mr-6 mt-4 md:mt-6 mb-4 md:mb-6 rounded-2xl md:rounded-3xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0a0a12 0%, #12141f 50%, #0f1419 100%)',
          boxShadow: `
            0 0 0 1px rgba(79, 70, 229, 0.08),
            0 8px 32px rgba(0, 0, 0, 0.5),
            0 16px 64px rgba(26, 26, 46, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.06)
          `
        }}
      >
        {/* Inner Content with Superior Spacing */}
        <div className="relative z-20 px-6 md:px-12 py-8 md:py-12 space-y-16">
          
          {/* Refined Header with Blue Gradient Accent */}
          <motion.div 
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="relative overflow-hidden rounded-2xl md:rounded-3xl p-6 md:p-8 border"
            style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.6), rgba(10, 15, 30, 0.8))',
              borderColor: 'rgba(79, 70, 229, 0.15)',
              backdropFilter: 'blur(24px)'
            }}
          >
            {/* Subtle Animated Background */}
            <div className="absolute inset-0 overflow-hidden opacity-30">
              <motion.div 
                className="absolute -top-10 -right-10 w-32 md:w-40 h-32 md:h-40 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)' }}
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div 
                className="absolute -bottom-10 -left-10 w-24 md:w-32 h-24 md:h-32 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(79, 70, 229, 0.2) 0%, transparent 70%)' }}
                animate={{ 
                  scale: [1.2, 1, 1.2],
                  opacity: [0.4, 0.6, 0.4]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              />
            </div>

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center space-x-4 md:space-x-6">
                <motion.div 
                  className="w-16 md:w-20 h-16 md:h-20 rounded-2xl md:rounded-3xl flex items-center justify-center border backdrop-blur-sm shadow-2xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(79, 70, 229, 0.15))',
                    borderColor: 'rgba(79, 70, 229, 0.25)'
                  }}
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  <Brain className="w-8 md:w-10 h-8 md:h-10 text-blue-400" strokeWidth={2.5}/>
                </motion.div>
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-[-0.04em] text-white">
                    AI Strategist
                  </h1>
                  <p className="text-sm md:text-base lg:text-lg text-gray-400 mt-2 mb-3 md:mb-4">
                    Interpreting signals, forecasting scenarios, personalizing insights
                  </p>
                  
                  {/* Refined "Powered by Lyra" Badge */}
                  <motion.div
                    className="relative inline-flex items-center gap-2 md:gap-3 px-3 md:px-5 py-2 md:py-2.5 rounded-full overflow-hidden cursor-pointer group"
                    style={{
                      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(79, 70, 229, 0.15) 100%)',
                      border: '1px solid rgba(79, 70, 229, 0.3)',
                      backdropFilter: 'blur(12px)'
                    }}
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1, 
                      y: 0,
                      boxShadow: [
                        '0 0 20px rgba(79, 70, 229, 0.2)',
                        '0 0 30px rgba(59, 130, 246, 0.3)',
                        '0 0 20px rgba(79, 70, 229, 0.2)'
                      ]
                    }}
                    transition={{ 
                      opacity: { duration: 0.4, ease: "easeOut" },
                      scale: { duration: 0.4, ease: "easeOut" },
                      y: { duration: 0.4, ease: "easeOut" },
                      boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }
                    }}
                    whileHover={{ 
                      scale: 1.03,
                      boxShadow: "0 0 35px rgba(59, 130, 246, 0.4)"
                    }}
                  >
                    {/* Shimmer Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-12"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '200%' }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                    />
                    
                    {/* Lyra Logo */}
                    <motion.div
                      animate={{
                        rotate: [0, 15, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{
                        duration: 0.6,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatDelay: 5
                      }}
                    >
                      <LyraLogo className="w-3 md:w-4 h-3 md:h-4" />
                    </motion.div>
                    
                    <div className="relative z-10 flex items-center gap-1 md:gap-2">
                      <span className="text-xs font-semibold text-blue-200 tracking-wide">
                        Powered by
                      </span>
                      <span className="font-black text-xs md:text-sm tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-blue-300">
                        Lyra
                      </span>
                    </div>
                  </motion.div>
                </div>
              </div>
              
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)' }} 
                whileTap={{ scale: 0.95 }} 
                className="flex items-center space-x-3 px-4 md:px-6 py-3 rounded-xl md:rounded-2xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, #3B82F6 0%, #4F46E5 100%)'
                }}
              >
                <Download className="w-4 md:w-5 h-4 md:h-5" />
                <span className="text-sm md:text-base">Export Analysis</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Personalized Callout - Refined */}
          <motion.div 
            className="p-3 md:p-4 rounded-xl md:rounded-2xl border flex items-center space-x-3 md:space-x-4 backdrop-blur-sm"
            style={{
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(79, 70, 229, 0.08))',
              borderColor: 'rgba(59, 130, 246, 0.2)'
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 300, damping: 20 }}
          >
            <div className="flex-shrink-0 w-8 md:w-10 h-8 md:h-10 rounded-full flex items-center justify-center border"
              style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(79, 70, 229, 0.12))',
                borderColor: 'rgba(59, 130, 246, 0.2)'
              }}
            >
              <Target className="w-4 md:w-5 h-4 md:h-5 text-blue-400" />
            </div>
            <p className="text-xs md:text-sm font-medium text-blue-100">
              <strong className="font-semibold text-white">Personal Impact:</strong> {mockOutlookData.personalCallout}
            </p>
          </motion.div>

          {/* AI Market Outlook */}
          <AIOutlook data={mockOutlookData} />

          {/* Cross-Signals & Divergences */}
          <CrossSignalDivergence data={mockDivergenceData} />
          
          {/* Personalized Portfolio Lens */}
          <PersonalizedLens data={mockPersonalizedData} />

          {/* Forward Risk & Opportunity Map */}
          <ForwardRiskMap 
            data={mockRiskMapData}
            selectedTimeHorizon={selectedTimeHorizon}
            onTimeHorizonChange={setSelectedTimeHorizon}
          />
          
          {/* Strategist's Playbook */}
          <StrategistPlaybook data={mockStrategistNotes} />
        </div>

        {/* Subtle Inner Glow */}
        <div 
          className="absolute inset-0 pointer-events-none rounded-2xl md:rounded-3xl"
          style={{
            background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(59, 130, 246, 0.06), transparent 70%)'
          }}
        />
      </div>
    </>
  );
}