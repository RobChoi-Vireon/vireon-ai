import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, ChevronRight, ChevronDown, Info } from 'lucide-react';

const HORIZON_EASE = [0.26, 0.11, 0.26, 1.0];

// Arrow icon selector
const getArrowIcon = (direction) => {
  switch(direction) {
    case 'up': return TrendingUp;
    case 'down': return TrendingDown;
    default: return Minus;
  }
};

// State Status Row Component
const StateStatusRow = ({ arrow, label, status, sparkline }) => {
  const Icon = getArrowIcon(arrow);
  const color = arrow === 'up' ? 'rgba(255, 106, 122, 0.90)' : arrow === 'down' ? 'rgba(88, 227, 164, 0.90)' : 'rgba(168, 179, 199, 0.90)';
  
  return (
    <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <div className="flex items-center gap-3">
        <Icon className="w-4 h-4 flex-shrink-0" style={{ color }} strokeWidth={2.5} />
        <span className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>{label}</span>
      </div>
      <div className="flex items-center gap-3">
        {sparkline && (
          <div className="w-16 h-6 opacity-30">
            {/* Subtle sparkline placeholder */}
            <svg viewBox="0 0 64 24" className="w-full h-full">
              <polyline
                points="0,20 16,12 32,16 48,8 64,14"
                fill="none"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="1.5"
              />
            </svg>
          </div>
        )}
        <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.90)' }}>{status}</span>
      </div>
    </div>
  );
};

// Primary Driver Row Component
const DriverRow = ({ rank, name, weight, reason }) => {
  return (
    <div className="py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div 
              className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                color: 'rgba(255,255,255,0.70)'
              }}
            >
              {rank}
            </div>
            <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.90)' }}>{name}</span>
          </div>
          <p className="text-xs pl-7" style={{ color: 'rgba(255,255,255,0.65)' }}>{reason}</p>
        </div>
        <span 
          className="text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0"
          style={{ 
            background: 'rgba(94, 167, 255, 0.12)',
            color: 'rgba(255,255,255,0.75)'
          }}
        >
          {weight}%
        </span>
      </div>
    </div>
  );
};

export default function InflationSection({ data }) {
  const [showTrustDrawer, setShowTrustDrawer] = useState(false);
  const [showCPIPCE, setShowCPIPCE] = useState(false);
  
  if (!data) return null;

  // Mock data structure - replace with actual data binding
  const inflationData = {
    timestamp_et: data.timestamp_et || new Date().toLocaleString('en-US', { timeZone: 'America/New_York', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    delta_summary: data.delta_summary || "Core inflation ticked down 0.1pp while services remain elevated; no major surprises",
    confidence_score: data.confidence_score || 82,
    confidence_reason: data.confidence_reason || "High-quality data from BLS, Fed, and market surveys",
    
    // State rows
    headline_state: { arrow: 'down', label: 'Headline inflation', status: 'Cooling slowly' },
    core_state: { arrow: 'flat', label: 'Core inflation', status: 'Sticky' },
    services_state: { arrow: 'up', label: 'Services inflation', status: 'Elevated' },
    
    // Why it matters
    fed_implication: "Fed likely holds rates near current levels through Q2 given persistent services pressure",
    market_implication: "Rate-sensitive sectors (REITs, utilities) remain under pressure until clear disinflation",
    
    // Primary drivers
    drivers: [
      { rank: 1, name: 'Shelter & housing', weight: 45, reason: 'Rent inflation takes 12–18 months to show up in official data' },
      { rank: 2, name: 'Services (not housing)', weight: 35, reason: 'Wages still rising in leisure, healthcare' },
      { rank: 3, name: 'Goods deflation', weight: 20, reason: 'Supply chains normalized, demand softer' }
    ],
    
    // Winners/Losers
    winners: ['Lenders', 'Cash holders', 'Short-duration bonds', 'Pricing power firms'],
    losers: ['Renters', 'Fixed-income retirees', 'Long-duration growth stocks', 'Variable-rate borrowers'],
    
    // CPI vs PCE
    cpi_pce_collapsed: "CPI shows what people pay. PCE shows what people actually spend — the Fed prefers this.",
    cpi_plain: "CPI includes rent, gas, food — and updates slowly",
    pce_plain: "PCE adjusts when people change what they buy",
    why_fed_prefers: "The Fed prefers PCE because it reflects real behavior faster",
    
    // Watch items
    watch_short: [
      "Services inflation: watch if price pressure stays high",
      "Wage growth: still driving service costs up",
      "Sticky services: the part the Fed worries about most"
    ],
    watch_long: [
      "Housing costs: cool slowly and show up late in official data",
      "Labor market: cooling would ease wage pressure",
      "Fed outlook: watch for tone changes on rates"
    ],
    
    // Sources
    sources: [
      { name: 'BLS CPI', weight: 35 },
      { name: 'BEA PCE', weight: 30 },
      { name: 'Federal Reserve / FOMC', weight: 25 },
      { name: 'Surveys / Nowcasts', weight: 10 }
    ]
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: HORIZON_EASE }}
      className="relative rounded-3xl overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.045) 0%, rgba(255, 255, 255, 0.028) 100%)',
        backdropFilter: 'blur(40px) saturate(165%)',
        WebkitBackdropFilter: 'blur(40px) saturate(165%)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 20px rgba(0,0,0,0.08)'
      }}
    >
      {/* Top specular highlight */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '15%',
        right: '15%',
        height: '1.5px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
        pointerEvents: 'none'
      }} />

      {/* HEADER */}
      <div className="flex items-start justify-between p-6 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex-1">
          <h3 className="text-2xl font-bold mb-1" style={{ color: 'rgba(255,255,255,0.96)', letterSpacing: '-0.02em' }}>
            Inflation
          </h3>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.50)' }}>
            Last updated {inflationData.timestamp_et} ET
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTrustDrawer(!showTrustDrawer)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
            style={{
              background: 'rgba(94, 167, 255, 0.12)',
              border: '1px solid rgba(94, 167, 255, 0.20)',
              color: 'rgba(94, 167, 255, 0.95)'
            }}
          >
            <Info className="w-3 h-3" />
            <span>Confidence {inflationData.confidence_score}/100</span>
          </button>
        </div>
      </div>

      {/* SECTION 0: DELTA ANCHOR */}
      <div 
        className="px-6 py-3"
        style={{
          background: 'linear-gradient(90deg, rgba(94, 167, 255, 0.08) 0%, rgba(94, 167, 255, 0.04) 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.06)'
        }}
      >
        <div className="text-xs font-medium mb-1" style={{ color: 'rgba(255,255,255,0.50)', letterSpacing: '0.02em' }}>
          Δ Since last update
        </div>
        <p className="text-sm font-semibold truncate" style={{ color: 'rgba(255,255,255,0.90)' }}>
          {inflationData.delta_summary}
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* SECTION 1: CURRENT STATE */}
        <div>
          <div className="text-xs font-medium mb-3" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Current state
          </div>
          <div className="space-y-1">
            <StateStatusRow {...inflationData.headline_state} />
            <StateStatusRow {...inflationData.core_state} />
            <StateStatusRow {...inflationData.services_state} />
          </div>
        </div>

        {/* SECTION 2: WHY THIS MATTERS */}
        <div>
          <div className="text-xs font-medium mb-3" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Why it matters
          </div>
          <div className="space-y-2">
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.80)' }}>
              {inflationData.fed_implication}
            </p>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.80)' }}>
              {inflationData.market_implication}
            </p>
          </div>
        </div>

        {/* SECTION 3: PRIMARY DRIVERS */}
        <div>
          <div className="text-xs font-medium mb-3" style={{ color: 'rgba(255,255,255,0.45)' }}>
            What's driving it
          </div>
          <div className="space-y-1">
            {inflationData.drivers.map((driver, idx) => (
              <DriverRow key={idx} {...driver} />
            ))}
          </div>
        </div>

        {/* SECTION 4A: WHO FEELS IT */}
        <div>
          <div className="text-xs font-medium mb-3" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Who feels it
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-medium mb-2" style={{ color: 'rgba(88, 227, 164, 0.80)' }}>Winners</div>
              <ul className="space-y-1.5">
                {inflationData.winners.map((item, idx) => (
                  <li key={idx} className="text-sm" style={{ color: 'rgba(255,255,255,0.70)' }}>• {item}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-xs font-medium mb-2" style={{ color: 'rgba(255, 106, 122, 0.80)' }}>Losers</div>
              <ul className="space-y-1.5">
                {inflationData.losers.map((item, idx) => (
                  <li key={idx} className="text-sm" style={{ color: 'rgba(255,255,255,0.70)' }}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* SECTION 4B: CPI VS PCE EXPLAINER */}
        <div>
          <button
            onClick={() => setShowCPIPCE(!showCPIPCE)}
            className="w-full flex items-center justify-between py-3 px-4 rounded-xl transition-colors"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255,255,255,0.06)'
            }}
          >
            <div className="text-left">
              <div className="text-sm font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.90)' }}>CPI vs PCE</div>
              <div className="text-xs" style={{ color: 'rgba(255,255,255,0.60)' }}>{inflationData.cpi_pce_collapsed}</div>
            </div>
            <ChevronDown 
              className="w-4 h-4 transition-transform" 
              style={{ 
                color: 'rgba(255,255,255,0.40)',
                transform: showCPIPCE ? 'rotate(180deg)' : 'rotate(0deg)'
              }} 
            />
          </button>
          
          <AnimatePresence>
            {showCPIPCE && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: HORIZON_EASE }}
                className="overflow-hidden"
              >
                <div className="pt-3 space-y-2">
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>• {inflationData.cpi_plain}</p>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>• {inflationData.pce_plain}</p>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>• {inflationData.why_fed_prefers}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* SECTION 5: WHAT TO WATCH */}
        <div>
          <div className="text-xs font-medium mb-3" style={{ color: 'rgba(255,255,255,0.45)' }}>
            What to watch
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.70)' }}>Next 30–60 days</div>
              <ul className="space-y-1.5">
                {inflationData.watch_short.map((item, idx) => (
                  <li key={idx} className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>• {item}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-xs font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.70)' }}>Next 6–12 months</div>
              <ul className="space-y-1.5">
                {inflationData.watch_long.map((item, idx) => (
                  <li key={idx} className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 6: TRUST DRAWER */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        {!showTrustDrawer ? (
          <button
            onClick={() => setShowTrustDrawer(true)}
            className="w-full px-6 py-3 text-left text-sm transition-colors hover:bg-white/5"
            style={{ color: 'rgba(255,255,255,0.50)' }}
          >
            Evidence · Confidence {inflationData.confidence_score}/100
          </button>
        ) : (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-6 py-4 space-y-3"
          >
            <div>
              <div className="text-sm font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.90)' }}>
                Confidence {inflationData.confidence_score}/100
              </div>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.65)' }}>
                {inflationData.confidence_reason}
              </p>
            </div>
            
            <div>
              <div className="text-xs font-medium mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Sources
              </div>
              <div className="space-y-1.5">
                {inflationData.sources.map((source, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span style={{ color: 'rgba(255,255,255,0.70)' }}>{source.name}</span>
                    <span style={{ color: 'rgba(255,255,255,0.50)' }}>{source.weight}%</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}