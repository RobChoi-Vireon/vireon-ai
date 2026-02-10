import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, ChevronDown, Info } from 'lucide-react';

const HORIZON_EASE = [0.26, 0.11, 0.26, 1.0];
const SMOOTH_EXPAND = { 
  duration: 0.35,
  ease: [0.22, 0.61, 0.36, 1]
};
const CHEVRON_ROTATE = {
  duration: 0.35,
  ease: [0.22, 0.61, 0.36, 1]
};

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
      <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.90)' }}>{status}</span>
    </div>
  );
};



export default function InflationSection({ data }) {
  const [drawer1Open, setDrawer1Open] = useState(false);
  const [drawer2Open, setDrawer2Open] = useState(false);
  const [drawer3Open, setDrawer3Open] = useState(false);
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
      className="space-y-3"
    >
      {/* PRIMARY STATUS CARD */}
      <div
        className="relative rounded-3xl"
        style={{
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.045) 0%, rgba(255, 255, 255, 0.028) 100%)',
          backdropFilter: 'blur(40px) saturate(165%)',
          WebkitBackdropFilter: 'blur(40px) saturate(165%)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 20px rgba(0,0,0,0.08)',
          overflow: 'hidden',
          willChange: 'transform'
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
        <div className="flex items-start justify-between px-6 pt-5 pb-3">
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-1" style={{ color: 'rgba(255,255,255,0.96)', letterSpacing: '-0.02em' }}>
              Inflation
            </h3>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.50)' }}>
              Last updated {inflationData.timestamp_et} ET
            </p>
          </div>
        </div>

        {/* DELTA ANCHOR */}
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
          <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.90)' }}>
            {inflationData.delta_summary}
          </p>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* CURRENT STATE */}
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

          {/* WHY IT MATTERS */}
          <div>
            <div className="text-xs font-medium mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Why it matters
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.80)' }}>
              {inflationData.fed_implication}
            </p>
          </div>
        </div>
      </div>

      {/* DRAWER 1 - WHY INFLATION LOOKS THIS WAY */}
      <div
        className="relative rounded-2xl"
        style={{
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.045) 0%, rgba(255, 255, 255, 0.028) 100%)',
          backdropFilter: 'blur(40px) saturate(165%)',
          WebkitBackdropFilter: 'blur(40px) saturate(165%)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 20px rgba(0,0,0,0.08)',
          overflow: 'hidden',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          WebkitFontSmoothing: 'antialiased'
        }}
      >
        <button
          onClick={() => setDrawer1Open(!drawer1Open)}
          className="w-full px-5 py-4 text-left flex items-center justify-between"
          style={{
            background: drawer1Open ? 'rgba(255, 255, 255, 0.02)' : 'transparent',
            transition: 'background 0.2s ease-out'
          }}
        >
          <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.90)' }}>
            Why inflation looks this way
          </span>
          <motion.div
            animate={{ rotate: drawer1Open ? 180 : 0 }}
            transition={CHEVRON_ROTATE}
            style={{ 
              transformOrigin: 'center',
              backfaceVisibility: 'hidden'
            }}
          >
            <ChevronDown className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.50)' }} />
          </motion.div>
        </button>
        
        <AnimatePresence initial={false}>
          {drawer1Open && (
            <motion.div
              key="drawer1-content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={SMOOTH_EXPAND}
              style={{ 
                overflow: 'hidden',
                transformOrigin: 'top',
                backfaceVisibility: 'hidden',
                perspective: 1000,
                WebkitFontSmoothing: 'antialiased'
              }}
            >
              <motion.div 
                className="px-5 pb-4 pt-2 space-y-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.25 }}
              >
                {inflationData.drivers.slice(0, 3).map((driver, idx) => (
                  <div key={idx} className="py-2" style={{ borderBottom: idx < 2 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                    <div className="flex items-center justify-between gap-3 mb-1.5">
                      <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.90)' }}>{driver.name}</span>
                      <span 
                        className="text-xs font-semibold px-2 py-1 rounded-full"
                        style={{ 
                          background: 'rgba(94, 167, 255, 0.12)',
                          color: 'rgba(255,255,255,0.75)'
                        }}
                      >
                        {driver.weight}%
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>{driver.reason}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* DRAWER 2 - WHO FEELS THIS MOST */}
      <div
        className="relative rounded-2xl"
        style={{
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.045) 0%, rgba(255, 255, 255, 0.028) 100%)',
          backdropFilter: 'blur(40px) saturate(165%)',
          WebkitBackdropFilter: 'blur(40px) saturate(165%)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 20px rgba(0,0,0,0.08)',
          overflow: 'hidden',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          WebkitFontSmoothing: 'antialiased'
        }}
      >
        <button
          onClick={() => setDrawer2Open(!drawer2Open)}
          className="w-full px-5 py-4 text-left flex items-center justify-between"
          style={{
            background: drawer2Open ? 'rgba(255, 255, 255, 0.02)' : 'transparent',
            transition: 'background 0.2s ease-out'
          }}
        >
          <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.90)' }}>
            Who feels this most
          </span>
          <motion.div
            animate={{ rotate: drawer2Open ? 180 : 0 }}
            transition={CHEVRON_ROTATE}
            style={{ 
              transformOrigin: 'center',
              backfaceVisibility: 'hidden'
            }}
          >
            <ChevronDown className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.50)' }} />
          </motion.div>
        </button>
        
        <AnimatePresence initial={false}>
          {drawer2Open && (
            <motion.div
              key="drawer2-content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={SMOOTH_EXPAND}
              style={{ 
                overflow: 'hidden',
                transformOrigin: 'top',
                backfaceVisibility: 'hidden',
                perspective: 1000,
                WebkitFontSmoothing: 'antialiased'
              }}
            >
              <motion.div 
                className="px-5 pb-4 pt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.25 }}
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs font-medium mb-2" style={{ color: 'rgba(88, 227, 164, 0.80)' }}>Winners</div>
                    <ul className="space-y-1.5">
                      {inflationData.winners.slice(0, 4).map((item, idx) => (
                        <li key={idx} className="text-sm" style={{ color: 'rgba(255,255,255,0.70)' }}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-xs font-medium mb-2" style={{ color: 'rgba(255, 106, 122, 0.80)' }}>Losers</div>
                    <ul className="space-y-1.5">
                      {inflationData.losers.slice(0, 4).map((item, idx) => (
                        <li key={idx} className="text-sm" style={{ color: 'rgba(255,255,255,0.70)' }}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* DRAWER 3 - HOW TO READ THE DATA */}
      <div
        className="relative rounded-2xl"
        style={{
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.045) 0%, rgba(255, 255, 255, 0.028) 100%)',
          backdropFilter: 'blur(40px) saturate(165%)',
          WebkitBackdropFilter: 'blur(40px) saturate(165%)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 20px rgba(0,0,0,0.08)',
          overflow: 'hidden',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          WebkitFontSmoothing: 'antialiased'
        }}
      >
        <button
          onClick={() => setDrawer3Open(!drawer3Open)}
          className="w-full px-5 py-4 text-left flex items-center justify-between"
          style={{
            background: drawer3Open ? 'rgba(255, 255, 255, 0.02)' : 'transparent',
            transition: 'background 0.2s ease-out'
          }}
        >
          <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.90)' }}>
            How to read the data
          </span>
          <motion.div
            animate={{ rotate: drawer3Open ? 180 : 0 }}
            transition={CHEVRON_ROTATE}
            style={{ 
              transformOrigin: 'center',
              backfaceVisibility: 'hidden'
            }}
          >
            <ChevronDown className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.50)' }} />
          </motion.div>
        </button>
        
        <AnimatePresence initial={false}>
          {drawer3Open && (
            <motion.div
              key="drawer3-content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={SMOOTH_EXPAND}
              style={{ 
                overflow: 'hidden',
                transformOrigin: 'top',
                backfaceVisibility: 'hidden',
                perspective: 1000,
                WebkitFontSmoothing: 'antialiased'
              }}
            >
              <motion.div 
                className="px-5 pb-4 pt-2 space-y-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.25 }}
              >
                {/* CPI vs PCE - Nested */}
                <div>
                  <button
                    onClick={() => setShowCPIPCE(!showCPIPCE)}
                    className="w-full flex items-center justify-between py-3 px-4 rounded-xl"
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      transition: 'background 0.2s ease-out'
                    }}
                  >
                    <div className="text-left">
                      <div className="text-sm font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.90)' }}>CPI vs PCE</div>
                      <div className="text-xs" style={{ color: 'rgba(255,255,255,0.60)' }}>{inflationData.cpi_pce_collapsed}</div>
                    </div>
                    <motion.div
                      animate={{ rotate: showCPIPCE ? 180 : 0 }}
                      transition={CHEVRON_ROTATE}
                      style={{ 
                        transformOrigin: 'center',
                        backfaceVisibility: 'hidden'
                      }}
                    >
                      <ChevronDown 
                        className="w-4 h-4" 
                        style={{ color: 'rgba(255,255,255,0.40)' }} 
                      />
                    </motion.div>
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {showCPIPCE && (
                      <motion.div
                        key="cpipce-content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={SMOOTH_EXPAND}
                        style={{ 
                          overflow: 'hidden',
                          transformOrigin: 'top',
                          backfaceVisibility: 'hidden',
                          perspective: 1000,
                          WebkitFontSmoothing: 'antialiased'
                        }}
                      >
                        <motion.div 
                          className="pt-3 space-y-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.08, duration: 0.2 }}
                        >
                          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>• {inflationData.cpi_plain}</p>
                          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>• {inflationData.pce_plain}</p>
                          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>• {inflationData.why_fed_prefers}</p>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* What to Watch */}
                <div className="pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="text-xs font-medium mb-3" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    What to watch
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.70)' }}>Next 30–60 days</div>
                      <ul className="space-y-1.5">
                        {inflationData.watch_short.slice(0, 3).map((item, idx) => (
                          <li key={idx} className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="text-xs font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.70)' }}>Next 6–12 months</div>
                      <ul className="space-y-1.5">
                        {inflationData.watch_long.slice(0, 3).map((item, idx) => (
                          <li key={idx} className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Evidence & Confidence */}
                <div className="pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="text-xs font-medium mb-3" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    Evidence & Confidence
                  </div>
                  <div className="space-y-3">
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
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}