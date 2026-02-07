import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, TrendingDown, BrainCircuit, DollarSign, Users, Zap, AlertTriangle, Target, Calendar, ArrowUpRight, Info, ChevronRight, ChevronDown, Shield, Percent, BarChart3, Globe, Building2, Clock, Scale, Coins, Landmark, Activity } from 'lucide-react';

const calculateDaysUntil = (eventDate) => {
  const today = new Date();
  const event = new Date(eventDate);
  const diffTime = event.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

// Fixed Income Instruments → Benchmark ETF Mapping
const FIXED_INCOME_BENCHMARKS = {
  'T.I.P.S.': 'iShares TIPS Bond ETF (TIP)',
  'U.S. Treasuries': 'iShares 20+ Year Treasury Bond ETF (TLT)',
  'High Yield': 'iShares iBoxx $ High Yield Corporate Bond ETF (HYG)',
  'Convertibles': 'SPDR Bloomberg Convertible Securities ETF (CWB)',
  'Municipals': 'iShares National Muni Bond ETF (MUB)',
  'High Grade': 'iShares iBoxx $ Investment Grade Corporate Bond ETF (LQD)'
};

// Consensus Summary (outcome + cause)
const CONSENSUS_SUMMARY = {
  'T.I.P.S.': {
    outcome: 'TIPS spreads widened as inflation expectations firmed.',
    cause: 'Real yields compressed on Fed dovish pivot signals.'
  },
  'U.S. Treasuries': {
    outcome: 'Treasuries rallied as long-end yields stabilized.',
    cause: 'Duration demand returned on recession hedging flows.'
  },
  'High Yield': {
    outcome: 'High yield tightened as credit spreads compressed.',
    cause: 'Risk appetite strengthened on corporate earnings resilience.'
  },
  'Convertibles': {
    outcome: 'Convertibles outperformed on equity optionality demand.',
    cause: 'Tech sector strength and volatility compression drove flows.'
  },
  'Municipals': {
    outcome: 'Municipals held steady on tax-exempt appeal.',
    cause: 'Supply-demand balance remained favorable for investors.'
  },
  'High Grade': {
    outcome: 'Investment grade rallied on flight-to-quality flows.',
    cause: 'Corporate credit quality remained strong despite macro uncertainty.'
  }
};

const enhancedFixedIncomeData = {
  'T.I.P.S.': {
    mainDrivers: [
      { driver: 'Breakeven Inflation Expectations', impact: 'Positive', strength: 'High', confidence: 85, detail: '10-year breakeven inflation rate rising to 2.4% from 2.1%, signaling markets pricing in persistent inflation.', supportingData: '10Y breakeven: 2.4% vs 2.1% last month' },
      { driver: 'Real Yield Compression', impact: 'Positive', strength: 'Medium', confidence: 75, detail: 'Real yields falling as nominal rates hold steady while inflation expectations rise.', supportingData: 'Real yields down 15bps to 1.85%' },
      { driver: 'Fed Policy Pivot Expectations', impact: 'Mixed', strength: 'Medium', confidence: 70, detail: 'Markets pricing in potential rate cuts, supporting TIPS demand but capping upside.', supportingData: '65% probability of rate cut by June' }
    ],
    institutionalFlow: { direction: 'Inflow', amount: '$1.2B', timeframe: '5 days', percentage: 65, vsPrior: '+28%', note: 'Inflation hedge positioning accelerating.' },
    earningsRevisions: null,
    keyThemes: [
      { name: 'Inflation Protection Demand', icon: Shield, severity: 'high', interpretation: 'TIPS offering direct inflation hedge as CPI remains elevated.', context: 'Real yield compression driving tactical allocations.' },
      { name: 'Breakeven Rate Expansion', icon: Percent, severity: 'high', interpretation: 'Market-implied inflation expectations moving higher.', context: 'Watch for divergence from Fed dot plot forecasts.' },
      { name: 'Liquidity Conditions', icon: Activity, severity: 'medium', interpretation: 'TIPS market liquidity improving but still below pre-2022 levels.', context: 'Bid-ask spreads narrowing on increased participation.' },
      { name: 'Central Bank Positioning', icon: Landmark, severity: 'medium', interpretation: 'Foreign central banks rotating into TIPS for diversification.', context: 'Supports technical demand picture.' }
    ],
    riskFactors: [
      { name: 'Disinflation Scenario', icon: TrendingDown, severity: 'high', interpretation: 'If inflation falls faster than expected, TIPS underperform nominals.', context: 'CPI trajectory is the key variable.' },
      { name: 'Real Rate Volatility', icon: AlertTriangle, severity: 'medium', interpretation: 'Sharp moves in real yields can create mark-to-market losses.', context: 'Duration risk amplified in rising rate environments.' },
      { name: 'Liquidity Risk Premium', icon: Activity, severity: 'medium', interpretation: 'TIPS less liquid than nominal Treasuries in stress scenarios.', context: 'Wider spreads during market dislocations.' },
      { name: 'Deflation Tail Risk', icon: AlertTriangle, severity: 'low', interpretation: 'In deflationary scenarios, TIPS principal can decline.', context: 'Currently a low-probability event.' }
    ],
    forwardCatalysts: [
      { date: '2026-02-12', event: 'CPI Release', impact: 'High', context: 'January CPI data will directly impact breakeven inflation expectations and TIPS pricing.', daysUntil: calculateDaysUntil('2026-02-12') },
      { date: '2026-02-20', event: 'Fed Minutes Release', impact: 'Medium', context: 'FOMC meeting minutes may reveal inflation outlook shifts affecting real yield expectations.', daysUntil: calculateDaysUntil('2026-02-20') }
    ],
    technicalLevels: { trend: 'Bullish', confidence: 78, timeframe: 'Daily', support: '98.50', resistance: '101.20', note: 'Momentum strengthening on inflation concerns.' },
    sentiment: { retailScore: 52, institutionalScore: 72, note: 'Institutions positioning for sticky inflation.' }
  },
  'U.S. Treasuries': {
    mainDrivers: [
      { driver: 'Duration Demand Resurgence', impact: 'Positive', strength: 'High', confidence: 82, detail: 'Long-duration Treasury demand returning as recession hedging intensifies.', supportingData: '30Y yields down 12bps on flight-to-safety' },
      { driver: 'Supply-Demand Dynamics', impact: 'Negative', strength: 'Medium', confidence: 68, detail: 'Treasury issuance elevated due to deficit financing needs, creating supply pressure.', supportingData: '$1.8T in issuance expected Q1 2026' },
      { driver: 'Fed Rate Path Uncertainty', impact: 'Mixed', strength: 'High', confidence: 75, detail: 'Markets divided on Fed terminal rate, creating volatility in the curve.', supportingData: 'Terminal rate expectations range 3.5%-4.5%' }
    ],
    institutionalFlow: { direction: 'Inflow', amount: '$2.8B', timeframe: '5 days', percentage: 78, vsPrior: '+42%', note: 'Strong safe-haven flows on macro uncertainty.' },
    earningsRevisions: null,
    keyThemes: [
      { name: 'Yield Curve Dynamics', icon: BarChart3, severity: 'high', interpretation: 'Curve steepening as long-end rallies on recession concerns.', context: '2s10s spread widening to +45bps from inverted.' },
      { name: 'Foreign Demand', icon: Globe, severity: 'high', interpretation: 'Central bank and sovereign wealth fund buying supporting demand.', context: 'Particularly strong from Asia-Pacific buyers.' },
      { name: 'Repo Market Conditions', icon: Coins, severity: 'medium', interpretation: 'Treasury repo rates reflecting ample liquidity conditions.', context: 'Collateral scarcity not a concern currently.' },
      { name: 'Auction Dynamics', icon: Landmark, severity: 'medium', interpretation: 'Recent auctions showing healthy bid-to-cover ratios.', context: 'Indirect bidder participation key metric.' }
    ],
    riskFactors: [
      { name: 'Deficit Concerns', icon: AlertTriangle, severity: 'high', interpretation: 'Growing federal deficit creating long-term supply overhang fears.', context: 'Could pressure long-end yields higher.' },
      { name: 'Inflation Resurgence', icon: TrendingUp, severity: 'high', interpretation: 'Sticky inflation could force Fed to maintain higher rates longer.', context: 'Watch core PCE and wage growth data.' },
      { name: 'Debt Ceiling Risk', icon: Building2, severity: 'medium', interpretation: 'Political brinkmanship could create temporary market dysfunction.', context: 'X-date estimated for mid-2026.' },
      { name: 'Term Premium Normalization', icon: Scale, severity: 'medium', interpretation: 'Long-term rates may need higher term premium as QT continues.', context: 'Fed balance sheet reduction ongoing.' }
    ],
    forwardCatalysts: [
      { date: '2026-02-11', event: '30Y Treasury Auction', impact: 'High', context: 'Major long-duration auction will test demand for duration at current yield levels.', daysUntil: calculateDaysUntil('2026-02-11') },
      { date: '2026-02-26', event: 'Fed Chair Testimony', impact: 'High', context: 'Powell congressional testimony on monetary policy outlook and rate path.', daysUntil: calculateDaysUntil('2026-02-26') }
    ],
    technicalLevels: { trend: 'Bullish', confidence: 70, timeframe: 'Daily', support: '89.20', resistance: '92.50', note: 'Rally intact above key support.' },
    sentiment: { retailScore: 58, institutionalScore: 82, note: 'Institutions heavily positioned for safe-haven demand.' }
  },
  'High Yield': {
    mainDrivers: [
      { driver: 'Spread Tightening Momentum', impact: 'Positive', strength: 'High', confidence: 80, detail: 'HY spreads compressed 35bps to 320bps over Treasuries on risk-on appetite.', supportingData: 'HY OAS: 320bps vs 355bps last week' },
      { driver: 'Corporate Earnings Resilience', impact: 'Positive', strength: 'High', confidence: 88, detail: 'Below-investment-grade companies showing stronger-than-expected cash flow generation.', supportingData: 'HY issuer EBITDA growth +4.2% YoY' },
      { driver: 'Default Rate Expectations', impact: 'Negative', strength: 'Low', confidence: 60, detail: 'Default rates projected to tick up to 3.2% from 2.8%, but remain manageable.', supportingData: 'Consensus default forecast: 3.2% in 2026' }
    ],
    institutionalFlow: { direction: 'Inflow', amount: '$1.5B', timeframe: '5 days', percentage: 72, vsPrior: '+52%', note: 'Yield-starved investors chasing carry.' },
    earningsRevisions: null,
    keyThemes: [
      { name: 'Carry Trade Advantage', icon: Percent, severity: 'high', interpretation: 'High yield offering 6.2% yield premium over investment grade.', context: 'Attractive for income-focused portfolios.' },
      { name: 'Refinancing Window', icon: Clock, severity: 'high', interpretation: 'Issuers rushing to refinance debt while markets receptive.', context: '2024-2025 maturity wall being addressed proactively.' },
      { name: 'Credit Quality Bifurcation', icon: Scale, severity: 'medium', interpretation: 'BB-rated credits outperforming CCC as quality matters.', context: 'Flight to quality within high yield space.' },
      { name: 'Energy Sector Exposure', icon: Zap, severity: 'medium', interpretation: 'Energy companies represent 12% of HY index, creating commodity beta.', context: 'Oil price moves drive sector performance swings.' }
    ],
    riskFactors: [
      { name: 'Recession Vulnerability', icon: AlertTriangle, severity: 'high', interpretation: 'High yield extremely sensitive to economic downturn scenarios.', context: 'Defaults could spike to 6%+ in recession.' },
      { name: 'Liquidity Evaporation', icon: Activity, severity: 'high', interpretation: 'HY market can become illiquid quickly in risk-off environments.', context: 'Bid-ask spreads widen dramatically under stress.' },
      { name: 'Covenant-Lite Concerns', icon: Shield, severity: 'medium', interpretation: '80% of new issuance is covenant-lite, reducing investor protections.', context: 'Could amplify losses in distressed scenarios.' },
      { name: 'Interest Coverage Pressure', icon: Percent, severity: 'medium', interpretation: 'Higher rates pressuring interest coverage ratios for levered issuers.', context: 'Watch companies with ICR below 2.5x.' }
    ],
    forwardCatalysts: [
      { date: '2026-02-15', event: 'HY Issuance Window', impact: 'High', context: 'Major high yield issuance week as companies refinance 2026 maturities before volatility.', daysUntil: calculateDaysUntil('2026-02-15') },
      { date: '2026-02-28', event: 'Moody\'s HY Outlook', impact: 'Medium', context: 'Credit rating agency releases annual high yield default and outlook report.', daysUntil: calculateDaysUntil('2026-02-28') }
    ],
    technicalLevels: { trend: 'Bullish', confidence: 75, timeframe: 'Daily', support: '76.80', resistance: '78.50', note: 'Spread tightening driving price appreciation.' },
    sentiment: { retailScore: 45, institutionalScore: 68, note: 'Institutions chasing yield, retail cautious on credit risk.' }
  },
  'Convertibles': {
    mainDrivers: [
      { driver: 'Equity Volatility Decline', impact: 'Positive', strength: 'High', confidence: 80, detail: 'VIX falling to 16 from 22, reducing embedded option value but improving convertible equity sensitivity.', supportingData: 'VIX: 16 vs 22 last month' },
      { driver: 'Tech Sector Momentum', impact: 'Positive', strength: 'High', confidence: 85, detail: 'Convertibles heavily weighted to tech issuers benefiting from sector rally.', supportingData: 'Tech represents 42% of convert index' },
      { driver: 'New Issuance Pipeline', impact: 'Negative', strength: 'Low', confidence: 55, detail: 'Limited new convertible issuance creating scarcity premium but reducing opportunities.', supportingData: 'YTD issuance down 18% vs 2025' }
    ],
    institutionalFlow: { direction: 'Inflow', amount: '$0.8B', timeframe: '5 days', percentage: 58, vsPrior: '+35%', note: 'Balanced exposure to equity upside and credit downside protection.' },
    earningsRevisions: null,
    keyThemes: [
      { name: 'Equity Optionality', icon: TrendingUp, severity: 'high', interpretation: 'Convertibles providing asymmetric exposure to equity rallies.', context: 'Delta increasing as stocks rally into conversion territory.' },
      { name: 'Gamma Positioning', icon: Activity, severity: 'high', interpretation: 'Positive convexity as stocks approach conversion prices.', context: 'Tech converts showing highest gamma sensitivity.' },
      { name: 'Credit Floor Support', icon: Shield, severity: 'medium', interpretation: 'Bond floor providing downside protection in equity sell-offs.', context: 'Particularly valuable in volatile markets.' },
      { name: 'Issuer Quality Mix', icon: Scale, severity: 'medium', interpretation: 'Convertible issuers skew toward growth companies with lower credit ratings.', context: 'Average rating BB+, requiring active credit selection.' }
    ],
    riskFactors: [
      { name: 'Equity Market Correction', icon: TrendingDown, severity: 'high', interpretation: 'Sharp equity decline would pressure convertible valuations significantly.', context: 'Particularly exposed to tech sector drawdowns.' },
      { name: 'Volatility Spike', icon: AlertTriangle, severity: 'medium', interpretation: 'VIX surge could create temporary dislocations and liquidity issues.', context: 'Forced selling by volatility-sensitive strategies.' },
      { name: 'Redemption Risk', icon: Clock, severity: 'medium', interpretation: 'Issuers may call bonds if stock rallies significantly above conversion.', context: 'Reduces potential upside capture.' },
      { name: 'Market Size Constraints', icon: BarChart3, severity: 'low', interpretation: 'Convertible market smaller and less liquid than pure equity or credit.', context: 'Can create capacity constraints for large allocators.' }
    ],
    forwardCatalysts: [
      { date: '2026-02-10', event: 'Tech Earnings Season End', impact: 'High', context: 'Final major tech earnings reports will impact convertible delta and valuations.', daysUntil: calculateDaysUntil('2026-02-10') },
      { date: '2026-02-18', event: 'VIX Expiration Week', impact: 'Medium', context: 'Options expiration can create volatility spikes affecting convertible convexity.', daysUntil: calculateDaysUntil('2026-02-18') }
    ],
    technicalLevels: { trend: 'Bullish', confidence: 72, timeframe: 'Daily', support: '142.50', resistance: '148.20', note: 'Riding tech sector momentum higher.' },
    sentiment: { retailScore: 38, institutionalScore: 65, note: 'Institutional multi-asset allocators favoring the structure.' }
  },
  'Municipals': {
    mainDrivers: [
      { driver: 'Tax-Equivalent Yield Appeal', impact: 'Positive', strength: 'High', confidence: 80, detail: 'For high earners in 37% bracket, munis yielding 4.2% equivalent to 6.7% taxable.', supportingData: 'Tax-equivalent yield: 6.7% for top bracket' },
      { driver: 'Supply-Demand Balance', impact: 'Positive', strength: 'Medium', confidence: 75, detail: 'Muni issuance running 12% below seasonal averages while demand holds steady.', supportingData: 'Issuance down 12% vs historical average' },
      { driver: 'Credit Quality Concerns', impact: 'Negative', strength: 'Low', confidence: 60, detail: 'Some state and local governments facing fiscal stress, but overall quality remains strong.', supportingData: 'Default rate: 0.08% (historically low)' }
    ],
    institutionalFlow: { direction: 'Inflow', amount: '$0.6B', timeframe: '5 days', percentage: 54, vsPrior: '+18%', note: 'Steady tax-loss harvesting and year-end rebalancing flows.' },
    earningsRevisions: null,
    keyThemes: [
      { name: 'Tax Policy Stability', icon: Landmark, severity: 'high', interpretation: 'Federal tax rates expected to remain elevated, supporting muni demand.', context: 'Watch for tax reform proposals in election year.' },
      { name: 'Essential Service Revenue', icon: Building2, severity: 'high', interpretation: 'General obligation bonds backed by stable tax revenues.', context: 'Essential services (water, sewer) showing resilient cash flows.' },
      { name: 'Infrastructure Investment', icon: Building2, severity: 'medium', interpretation: 'Federal infrastructure funding benefiting state and local finances.', context: 'Revenue bonds for infrastructure projects gaining favor.' },
      { name: 'ESG Considerations', icon: Globe, severity: 'medium', interpretation: 'Green bonds and social impact munis attracting dedicated flows.', context: 'Sustainability-linked issuance growing 25% annually.' }
    ],
    riskFactors: [
      { name: 'Pension Underfunding', icon: AlertTriangle, severity: 'medium', interpretation: 'State and local pension liabilities creating long-term fiscal pressure.', context: 'Illinois and New Jersey highest risk.' },
      { name: 'Tax Reform Risk', icon: Landmark, severity: 'medium', interpretation: 'Potential changes to federal tax policy could reduce muni tax advantage.', context: 'Low probability but high impact.' },
      { name: 'Interest Rate Sensitivity', icon: Percent, severity: 'medium', interpretation: 'Long-duration munis vulnerable to rising rate scenarios.', context: 'Average duration 6.5 years in core muni funds.' },
      { name: 'State-Specific Risks', icon: Building2, severity: 'low', interpretation: 'Concentrated exposure to specific states increases idiosyncratic risk.', context: 'Diversification across states recommended.' }
    ],
    forwardCatalysts: [
      { date: '2026-02-14', event: 'State Budget Releases', impact: 'Medium', context: 'Key state budget proposals will signal fiscal health and potential revenue bond opportunities.', daysUntil: calculateDaysUntil('2026-02-14') },
      { date: '2026-03-01', event: 'Tax Season Demand Peak', impact: 'Medium', context: 'Seasonal muni demand typically peaks during tax season as investors seek tax-exempt income.', daysUntil: calculateDaysUntil('2026-03-01') }
    ],
    technicalLevels: { trend: 'Neutral', confidence: 58, timeframe: 'Daily', support: '105.80', resistance: '108.20', note: 'Range-bound trading on steady demand.' },
    sentiment: { retailScore: 62, institutionalScore: 70, note: 'Consistent demand from high-net-worth investors.' }
  },
  'High Grade': {
    mainDrivers: [
      { driver: 'Credit Spread Compression', impact: 'Positive', strength: 'High', confidence: 82, detail: 'Investment grade spreads tightened to 95bps from 115bps on strong corporate fundamentals.', supportingData: 'IG OAS: 95bps vs 115bps last month' },
      { driver: 'Strong Corporate Balance Sheets', impact: 'Positive', strength: 'High', confidence: 90, detail: 'IG companies maintaining healthy leverage ratios and interest coverage metrics.', supportingData: 'Median leverage: 2.5x debt/EBITDA (stable)' },
      { driver: 'Issuance Wave', impact: 'Negative', strength: 'Medium', confidence: 70, detail: 'Heavy IG issuance calendar as companies refinance and fund M&A activity.', supportingData: '$85B issuance expected in February' }
    ],
    institutionalFlow: { direction: 'Inflow', amount: '$2.2B', timeframe: '5 days', percentage: 70, vsPrior: '+38%', note: 'Flight-to-quality driving strong IG demand.' },
    earningsRevisions: null,
    keyThemes: [
      { name: 'Quality Flight', icon: Shield, severity: 'high', interpretation: 'Investors rotating from high yield into investment grade for safety.', context: 'Spreads tightening as demand outpaces supply.' },
      { name: 'Refinancing Activity', icon: Clock, severity: 'high', interpretation: 'Companies proactively refinancing debt to lock in current rates.', context: 'Maturity wall being addressed ahead of schedule.' },
      { name: 'Sector Diversification', icon: BarChart3, severity: 'medium', interpretation: 'IG index well-diversified across sectors reducing concentration risk.', context: 'No single sector exceeds 18% weight.' },
      { name: 'Duration Positioning', icon: Activity, severity: 'medium', interpretation: 'Intermediate-duration IG bonds offering optimal risk-return.', context: '5-7 year maturity bucket seeing strongest flows.' }
    ],
    riskFactors: [
      { name: 'M&A Leverage Risk', icon: Building2, severity: 'medium', interpretation: 'Debt-financed M&A could pressure credit ratings and spreads.', context: 'Watch for announcement of large leveraged buyouts.' },
      { name: 'Sector Concentration', icon: BarChart3, severity: 'medium', interpretation: 'Financials and tech represent 40% of IG index, creating sector risk.', context: 'Tech and bank health crucial for overall performance.' },
      { name: 'Rate Volatility', icon: TrendingUp, severity: 'medium', interpretation: 'Duration risk if rates rise faster than expected.', context: 'Average duration 8.5 years in core IG funds.' },
      { name: 'Downgrade Risk', icon: TrendingDown, severity: 'low', interpretation: 'Fallen angels (IG to HY downgrades) could create forced selling.', context: 'BBB-rated issuers warrant monitoring.' }
    ],
    forwardCatalysts: [
      { date: '2026-02-13', event: 'Large IG Issuance Week', impact: 'High', context: 'Major investment grade corporates bringing $40B+ to market, testing demand appetite.', daysUntil: calculateDaysUntil('2026-02-13') },
      { date: '2026-02-20', event: 'Corporate Earnings Review', impact: 'Medium', context: 'Final earnings reports will update credit quality assessments for IG issuers.', daysUntil: calculateDaysUntil('2026-02-20') }
    ],
    technicalLevels: { trend: 'Bullish', confidence: 74, timeframe: 'Daily', support: '102.40', resistance: '104.80', note: 'Spread tightening supporting price gains.' },
    sentiment: { retailScore: 65, institutionalScore: 78, note: 'Broadly positive on credit quality and carry opportunity.' }
  }
};

const DriverCard = ({ driver, theme, index, isHighlighted }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const getImpactIcon = (impact) => {
    const iconProps = { className: "w-5 h-5 mr-2" };
    if (impact === 'Positive') {
      return (
        <motion.div animate={{ rotate: [0, 5, 0], scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
          <TrendingUp {...iconProps} />
        </motion.div>
      );
    }
    if (impact === 'Negative') {
      return (
        <motion.div animate={{ rotate: [0, -5, 0], scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
          <TrendingDown {...iconProps} />
        </motion.div>
      );
    }
    return <AlertTriangle {...iconProps} />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
      whileHover={{ y: -3, scale: 1.012, transition: { duration: 0.18, ease: [0.26, 0.11, 0.26, 1.0] } }}
      whileTap={{ scale: 0.985, transition: { duration: 0.10 } }}
      className="group relative overflow-visible rounded-[20px] cursor-pointer"
      style={{
        padding: '24px',
        background: isHighlighted
          ? 'linear-gradient(180deg, rgba(110, 180, 255, 0.08) 0%, rgba(18, 22, 30, 0.92) 100%)'
          : 'linear-gradient(180deg, rgba(255, 255, 255, 0.042) 0%, rgba(255, 255, 255, 0.028) 100%)',
        backdropFilter: 'blur(32px) saturate(165%)',
        WebkitBackdropFilter: 'blur(32px) saturate(165%)',
        border: isHighlighted ? '1px solid rgba(110, 180, 255, 0.14)' : '1px solid rgba(255,255,255,0.08)',
        boxShadow: isHighlighted
          ? 'inset 0 1px 0 rgba(255,255,255,0.10), 0 4px 16px rgba(0,0,0,0.10), 0 0 24px rgba(110, 180, 255, 0.08)'
          : 'inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 16px rgba(0,0,0,0.08)',
        transition: 'all 0.18s cubic-bezier(0.26, 0.11, 0.26, 1.0)'
      }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div style={{
        position: 'absolute', top: 0, left: '16%', right: '16%', height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
        pointerEvents: 'none'
      }} />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-2.5">
            {getImpactIcon(driver.impact)}
            <h4 className="font-bold text-[16px] leading-tight" style={{ color: 'rgba(255,255,255,0.94)', letterSpacing: '-0.01em' }}>
              {driver.driver}
            </h4>
          </div>
          <motion.div
            className="inline-flex items-center rounded-[14px]"
            style={{
              padding: '8px 14px', fontSize: '12px', fontWeight: 700,
              background: driver.impact === 'Positive' 
                ? 'linear-gradient(180deg, rgba(88, 227, 164, 0.12) 0%, rgba(88, 227, 164, 0.08) 100%)'
                : driver.impact === 'Negative'
                ? 'linear-gradient(180deg, rgba(255, 106, 122, 0.12) 0%, rgba(255, 106, 122, 0.08) 100%)'
                : 'linear-gradient(180deg, rgba(255, 180, 100, 0.12) 0%, rgba(255, 180, 100, 0.08) 100%)',
              border: driver.impact === 'Positive'
                ? '1px solid rgba(88, 227, 164, 0.20)'
                : driver.impact === 'Negative'
                ? '1px solid rgba(255, 106, 122, 0.20)'
                : '1px solid rgba(255, 180, 100, 0.20)',
              color: driver.impact === 'Positive' ? '#58E3A4' : driver.impact === 'Negative' ? '#FF6A7A' : '#FFB464',
              letterSpacing: '0.01em'
            }}
            whileHover={{ scale: 1.04, transition: { duration: 0.16 } }}
            whileTap={{ scale: 0.96, transition: { duration: 0.10 } }}
          >
            {driver.impact}
          </motion.div>
        </div>

        <div className="mb-5">
          <div className="flex items-center justify-between mb-2.5" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.56)' }}>
            <span className="font-medium">Confidence</span>
            <span className="font-bold" style={{ color: 'rgba(255,255,255,0.88)', fontVariantNumeric: 'tabular-nums' }}>
              {driver.confidence}%
            </span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #4DA3FF 0%, #58E3A4 100%)', boxShadow: 'inset 0 0.5px 0 rgba(255,255,255,0.18)' }}
              initial={{ width: 0 }}
              animate={{ width: `${driver.confidence}%` }}
              transition={{ duration: 0.8, delay: index * 0.15, ease: [0.22, 0.61, 0.36, 1] }}
            />
          </div>
        </div>

        <p className="text-[14px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)', transition: 'color 0.18s ease' }}>
          {driver.detail}
        </p>

        <AnimatePresence>
          {showTooltip && driver.supportingData && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.94 }}
              className="absolute top-full mt-3 left-4 right-4 z-50 rounded-[14px]"
              style={{
                padding: '12px 14px',
                background: 'linear-gradient(135deg, rgba(12, 16, 22, 0.94), rgba(18, 22, 30, 0.92))',
                backdropFilter: 'blur(24px) saturate(165%)',
                WebkitBackdropFilter: 'blur(24px) saturate(165%)',
                border: '1px solid rgba(110, 180, 255, 0.18)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10), 0 8px 24px rgba(0,0,0,0.25)'
              }}
              transition={{ duration: 0.16, ease: [0.22, 0.61, 0.36, 1] }}
            >
              <div className="text-[12px] font-semibold" style={{ color: '#4DA3FF' }}>
                {driver.supportingData}
              </div>
              <div 
                className="absolute -top-1 left-4 w-2 h-2 rotate-45"
                style={{
                  background: 'linear-gradient(135deg, rgba(12, 16, 22, 0.94), rgba(18, 22, 30, 0.92))',
                  borderTop: '1px solid rgba(110, 180, 255, 0.18)',
                  borderLeft: '1px solid rgba(110, 180, 255, 0.18)'
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const StatCard = ({ icon: Icon, label, value, sublabel, data = {}, isEmphasized = false }) => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const renderDataVisualization = () => {
    if (label.includes('Flow')) {
      const isInflow = data.direction === 'Inflow';
      return (
        <div className="mt-4">
          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: isInflow ? 'linear-gradient(to right, #10B981, #34D399)' : 'linear-gradient(to right, #EF4444, #F87171)' }}
              initial={{ width: 0 }}
              animate={{ width: animated ? `${data.percentage}%` : 0 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            />
          </div>
        </div>
      );
    }

    if (label.includes('Sentiment')) {
      return (
        <div className="mt-4 space-y-3">
          <div>
            <div className="flex justify-between text-[12px] font-medium mb-2" style={{ color: 'rgba(255,255,255,0.58)' }}>
              <span>Retail</span>
              <span style={{ fontVariantNumeric: 'tabular-nums', color: 'rgba(255,255,255,0.82)' }}>{data.retailScore}%</span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(to right, #4DA3FF, #60A5FA)', boxShadow: 'inset 0 0.5px 0 rgba(255,255,255,0.18)' }}
                initial={{ width: 0 }}
                animate={{ width: animated ? `${data.retailScore}%` : 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[12px] font-medium mb-2" style={{ color: 'rgba(255,255,255,0.58)' }}>
              <span>Institutional</span>
              <span style={{ fontVariantNumeric: 'tabular-nums', color: 'rgba(255,255,255,0.82)' }}>{data.institutionalScore}%</span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(to right, #8B5CF6, #A78BFA)', boxShadow: 'inset 0 0.5px 0 rgba(255,255,255,0.18)' }}
                initial={{ width: 0 }}
                animate={{ width: animated ? `${data.institutionalScore}%` : 0 }}
                transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
              />
            </div>
          </div>
        </div>
      );
    }
    
    if (label.includes('Technical')) {
      return (
        <div className="mt-4">
          <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ 
                background: data.trend === 'Bullish' 
                  ? 'linear-gradient(to right, #58E3A4, #73E6D2)' 
                  : 'linear-gradient(to right, #FF6A7A, #F87171)',
                boxShadow: 'inset 0 0.5px 0 rgba(255,255,255,0.18)'
              }}
              initial={{ width: 0 }}
              animate={{ width: animated ? `${data.confidence}%` : 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
            />
          </div>
        </div>
      );
    }

    return null;
  };
  
  const renderValue = () => {
    if (label.includes('Flow')) {
      return (
        <>
          <div className="text-3xl lg:text-4xl font-bold" style={{ color: 'rgba(255,255,255,0.96)', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>
            {data.amount}
          </div>
          <div className="text-[14px] font-bold flex items-center mt-2" style={{
            color: data.vsPrior.startsWith('+') ? '#58E3A4' : '#FF6A7A',
            fontVariantNumeric: 'tabular-nums'
          }}>
            <ArrowUpRight className={`w-3.5 h-3.5 mr-1.5 ${!data.vsPrior.startsWith('+') && 'rotate-[135deg]'}`} strokeWidth={2.2} />
            {data.vsPrior} vs last week
          </div>
        </>
      );
    }
    if (label.includes('Technical')) {
      return (
        <>
          <div className="text-3xl lg:text-4xl font-bold" style={{ color: 'rgba(255,255,255,0.96)', letterSpacing: '-0.02em' }}>
            {data.trend}
          </div>
          <div className="text-[14px] font-bold mt-2" style={{ color: 'rgba(255,255,255,0.58)', fontVariantNumeric: 'tabular-nums' }}>
            {data.confidence}% confidence
          </div>
        </>
      );
    }
    if (label.includes('Sentiment')) {
      return (
        <div className="text-3xl lg:text-4xl font-bold" style={{ color: 'rgba(255,255,255,0.96)', letterSpacing: '-0.02em' }}>
          Divergence
        </div>
      );
    }
    return <div className="text-3xl lg:text-4xl font-bold" style={{ color: 'rgba(255,255,255,0.96)', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>{value}</div>;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.018, y: -3, transition: { duration: 0.18, ease: [0.26, 0.11, 0.26, 1.0] } }}
      whileTap={{ scale: 0.985, transition: { duration: 0.10 } }}
      transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
      className="relative overflow-hidden rounded-[22px]"
      style={{ 
        padding: '24px',
        background: isEmphasized 
          ? 'linear-gradient(180deg, rgba(110, 180, 255, 0.068) 0%, rgba(18, 22, 30, 0.92) 100%)'
          : 'linear-gradient(180deg, rgba(255, 255, 255, 0.042) 0%, rgba(255, 255, 255, 0.028) 100%)',
        backdropFilter: 'blur(32px) saturate(165%)',
        WebkitBackdropFilter: 'blur(32px) saturate(165%)',
        border: isEmphasized ? '1px solid rgba(110, 180, 255, 0.12)' : '1px solid rgba(255,255,255,0.08)',
        boxShadow: isEmphasized
          ? 'inset 0 1px 0 rgba(255,255,255,0.10), 0 4px 16px rgba(0,0,0,0.10)'
          : 'inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 16px rgba(0,0,0,0.08)',
        transition: 'all 0.18s cubic-bezier(0.26, 0.11, 0.26, 1.0)'
      }}
    >
      <div style={{
        position: 'absolute', top: 0, left: '16%', right: '16%', height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
        pointerEvents: 'none'
      }} />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex-grow">
          <div className="flex items-center justify-between mb-5">
            <h5 className="font-semibold text-[13px] uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.62)', letterSpacing: '0.04em' }}>
              {label}
            </h5>
            <Icon className="w-5 h-5" style={{ color: 'rgba(155, 163, 176, 1)', strokeWidth: 2.0 }} />
          </div>
          <motion.div
            className="mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: animated ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {renderValue()}
          </motion.div>
        </div>

        <div className="flex-shrink-0">
          {renderDataVisualization()}
          {sublabel && (
            <p className="text-[13px] font-medium mt-4 text-center" style={{ color: 'rgba(255,255,255,0.58)', lineHeight: 1.5 }}>
              {sublabel}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const EventCard = ({ event, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getImpactIcon = (impact) => {
    const iconProps = { className: "w-4 h-4 mr-1 inline-block" };
    switch (impact) {
      case 'High': return <Zap {...iconProps} />;
      case 'Medium': return <Info {...iconProps} />;
      default: return <Clock {...iconProps} />;
    }
  };

  const getUrgencyWidth = (daysUntil) => {
    const maxDays = 30;
    const percentage = Math.max(0, 1 - daysUntil / maxDays) * 100;
    return Math.min(100, Math.max(5, percentage));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="group relative"
    >
      <div className="flex flex-col rounded-[20px] overflow-hidden" style={{
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.042) 0%, rgba(255, 255, 255, 0.028) 100%)',
        backdropFilter: 'blur(28px) saturate(160%)',
        WebkitBackdropFilter: 'blur(28px) saturate(160%)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 3px 12px rgba(0,0,0,0.08)'
      }}>
        <motion.div
          whileHover={{
            y: isExpanded ? 0 : -1,
            background: isExpanded ? undefined : "linear-gradient(180deg, rgba(255, 255, 255, 0.052) 0%, rgba(255, 255, 255, 0.038) 100%)",
            transition: { duration: 0.16 }
          }}
          whileTap={{ scale: 0.995, transition: { duration: 0.10 } }}
          className="flex items-center justify-between cursor-pointer"
          style={{ padding: '24px' }}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center space-x-4">
            <div className="relative flex-shrink-0">
              <div className="w-14 h-14 rounded-[16px] flex flex-col items-center justify-center overflow-hidden" style={{
                background: 'linear-gradient(180deg, rgba(77, 143, 251, 0.14) 0%, rgba(77, 143, 251, 0.10) 100%)',
                border: '1px solid rgba(77, 143, 251, 0.24)',
                backdropFilter: 'blur(12px)'
              }}>
                <span className="text-[11px] uppercase leading-none font-semibold" style={{ color: 'rgba(77, 143, 251, 1)', opacity: 0.88, letterSpacing: '0.02em' }}>
                  {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                </span>
                <span className="text-2xl font-bold leading-tight" style={{ color: 'rgba(255,255,255,0.96)', fontVariantNumeric: 'tabular-nums' }}>
                  {new Date(event.date).getDate()}
                </span>
                {event.daysUntil === 0 && (
                  <span className="absolute bottom-0 w-full text-center text-[9px] uppercase font-bold py-0.5" style={{
                    background: 'rgba(77, 143, 251, 0.30)', color: '#D7E3FF', letterSpacing: '0.03em'
                  }}>Today</span>
                )}
              </div>
            </div>

            <div className="flex-1">
              <p className="text-[16px] font-bold mb-3" style={{ color: 'rgba(255,255,255,0.94)', letterSpacing: '-0.01em', lineHeight: 1.3 }}>
                {event.event}
              </p>
              <div className="space-y-2">
                <div className="w-36 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(to right, #FFB464, #FF6A7A)', boxShadow: 'inset 0 0.5px 0 rgba(255,255,255,0.16)' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${getUrgencyWidth(event.daysUntil)}%` }}
                    transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 0.61, 0.36, 1] }}
                  />
                </div>
                <p className="text-[13px] flex items-center font-medium" style={{ color: 'rgba(255,255,255,0.58)' }}>
                  {event.daysUntil === 0 ? 'Due Today' : `${event.daysUntil} day${event.daysUntil === 1 ? '' : 's'} remaining`}
                  <span className="mx-2" style={{ color: 'rgba(255,255,255,0.24)' }}>•</span>
                  <span style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-[14px]" style={{
              padding: '8px 14px', fontSize: '12px', fontWeight: 700,
              background: event.impact === 'High' 
                ? 'linear-gradient(180deg, rgba(255, 106, 122, 0.12) 0%, rgba(255, 106, 122, 0.08) 100%)'
                : event.impact === 'Medium'
                ? 'linear-gradient(180deg, rgba(255, 180, 100, 0.12) 0%, rgba(255, 180, 100, 0.08) 100%)'
                : 'linear-gradient(180deg, rgba(88, 227, 164, 0.12) 0%, rgba(88, 227, 164, 0.08) 100%)',
              border: event.impact === 'High'
                ? '1px solid rgba(255, 106, 122, 0.20)'
                : event.impact === 'Medium'
                ? '1px solid rgba(255, 180, 100, 0.20)'
                : '1px solid rgba(88, 227, 164, 0.20)',
              color: event.impact === 'High' ? '#FF6A7A' : event.impact === 'Medium' ? '#FFB464' : '#58E3A4',
              letterSpacing: '0.01em'
            }}>
              {getImpactIcon(event.impact)}
              {event.impact}
            </div>

            <motion.div animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ duration: 0.18, ease: [0.26, 0.11, 0.26, 1.0] }}>
              <ChevronRight className="w-5 h-5" style={{ color: 'rgba(155, 163, 176, 1)' }} strokeWidth={2.0} />
            </motion.div>
          </div>
        </motion.div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              key="expanded-content"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="pt-2 pb-6 px-6 ml-[92px]" style={{
                borderLeft: event.impact === 'High' ? '3px solid rgba(255, 106, 122, 0.24)' : '2px solid rgba(255, 180, 100, 0.20)'
              }}>
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12, duration: 0.20, ease: [0.22, 0.61, 0.36, 1] }}
                  className="text-[14px] leading-relaxed"
                  style={{ color: 'rgba(255,255,255,0.68)' }}
                >
                  {event.context}
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const InsightCard = ({ item, type, index }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const styles = {
    theme: {
      high: {
        bg: 'linear-gradient(145deg, rgba(16, 185, 129, 0.15), rgba(34, 197, 94, 0.08))',
        border: 'rgba(52, 211, 153, 0.25)',
        icon: 'text-emerald-400',
        tag: { bg: 'bg-emerald-500/10', text: 'text-emerald-300' }
      },
      medium: {
        bg: 'linear-gradient(145deg, rgba(16, 185, 129, 0.1), rgba(34, 197, 94, 0.05))',
        border: 'rgba(52, 211, 153, 0.15)',
        icon: 'text-emerald-400/80',
        tag: { bg: 'bg-emerald-500/5', text: 'text-emerald-400/80' }
      },
      low: {
        bg: 'rgba(16, 185, 129, 0.05)',
        border: 'rgba(52, 211, 153, 0.1)',
        icon: 'text-emerald-500/60',
        tag: { bg: 'bg-emerald-500/5', text: 'text-emerald-500/60' }
      }
    },
    risk: {
      high: {
        bg: 'linear-gradient(145deg, rgba(239, 68, 68, 0.15), rgba(248, 113, 113, 0.08))',
        border: 'rgba(248, 113, 113, 0.25)',
        icon: 'text-red-400',
        tag: { bg: 'bg-red-500/10', text: 'text-red-300' }
      },
      medium: {
        bg: 'linear-gradient(145deg, rgba(239, 68, 68, 0.1), rgba(248, 113, 113, 0.05))',
        border: 'rgba(248, 113, 113, 0.15)',
        icon: 'text-red-400/80',
        tag: { bg: 'bg-red-500/5', text: 'text-red-400/80' }
      },
      low: {
        bg: 'rgba(239, 68, 68, 0.05)',
        border: 'rgba(248, 113, 113, 0.1)',
        icon: 'text-red-500/60',
        tag: { bg: 'bg-red-500/5', text: 'text-red-500/60' }
      }
    }
  };

  const emphasis = {
    high: { scale: 1.0, fontWeight: 'font-bold' },
    medium: { scale: 0.98, fontWeight: 'font-semibold' },
    low: { scale: 0.96, fontWeight: 'font-medium' }
  };

  const selectedStyle = styles[type][item.severity];
  const selectedEmphasis = emphasis[item.severity];
  const IconComponent = item.icon;

  return (
    <motion.div
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: selectedEmphasis.scale }}
      transition={{ delay: index * 0.08, type: "spring", stiffness: 100, damping: 20 }}
      whileHover={{ y: -5, scale: selectedEmphasis.scale * 1.04, boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)' }}
    >
      <div
        className="relative h-full flex flex-col rounded-[20px] cursor-pointer overflow-hidden"
        style={{ 
          padding: '22px',
          background: selectedStyle.bg,
          backdropFilter: 'blur(28px) saturate(160%)',
          WebkitBackdropFilter: 'blur(28px) saturate(160%)',
          border: `1px solid ${selectedStyle.border}`,
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 3px 12px rgba(0,0,0,0.08)',
          transition: 'all 0.18s cubic-bezier(0.26, 0.11, 0.26, 1.0)'
        }}
      >
        <div style={{
          position: 'absolute', top: 0, left: '16%', right: '16%', height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)',
          pointerEvents: 'none'
        }} />

        <div className="flex items-start justify-between mb-4">
          <IconComponent className="w-5 h-5" style={{ color: selectedStyle.icon.replace('text-', '#'), strokeWidth: 2.0 }} />
          <div className="px-3 py-1.5 rounded-full text-[11px] font-bold" style={{
            background: selectedStyle.tag.bg.replace('bg-', 'rgba(') + ')',
            color: selectedStyle.tag.text.replace('text-', '#'),
            letterSpacing: '0.02em'
          }}>
            {item.severity}
          </div>
        </div>
        <div className="flex-grow">
          <h4 className={`text-[15px] ${selectedEmphasis.fontWeight} mb-2`} style={{ color: 'rgba(255,255,255,0.92)', letterSpacing: '-0.01em', lineHeight: 1.3 }}>
            {item.name}
          </h4>
          <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.68)' }}>
            {item.interpretation}
          </p>
        </div>
      </div>

      <AnimatePresence>
        {showTooltip && item.context && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.94 }}
            transition={{ duration: 0.16, ease: [0.22, 0.61, 0.36, 1] }}
            className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-max max-w-xs z-10 rounded-[14px] pointer-events-none"
            style={{ 
              padding: '12px 14px',
              background: 'linear-gradient(135deg, rgba(12, 16, 22, 0.94), rgba(18, 22, 30, 0.92))',
              backdropFilter: 'blur(24px) saturate(165%)',
              WebkitBackdropFilter: 'blur(24px) saturate(165%)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10), 0 8px 24px rgba(0,0,0,0.25)'
            }}
          >
            <div className="text-[12px] font-medium text-center leading-relaxed" style={{ color: 'rgba(255,255,255,0.88)' }}>
              {item.context}
            </div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 rotate-45" 
              style={{ 
                background: 'linear-gradient(135deg, rgba(12, 16, 22, 0.94), rgba(18, 22, 30, 0.92))',
                borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
                borderRight: '1px solid rgba(255, 255, 255, 0.12)'
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function FixedIncomeDetailDrawer({ instrument, onClose, theme }) {
  const [activeTab, setActiveTab] = useState('drivers');
  const [expandedSections, setExpandedSections] = useState({ themes: false, risks: false });
  const [insightExpanded, setInsightExpanded] = useState(false);
  const drawerRef = useRef(null);
  const insightRef = useRef(null);

  const instrumentData = instrument && enhancedFixedIncomeData[instrument.name] ? enhancedFixedIncomeData[instrument.name] : {};

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!instrument) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (insightExpanded) {
          setInsightExpanded(false);
        } else {
          handleClose();
        }
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        const tabOrder = ['drivers', 'flows', 'themes', 'events'];
        const currentIndex = tabOrder.indexOf(activeTab);
        let nextIndex;
        if (e.key === 'ArrowLeft') {
          nextIndex = currentIndex > 0 ? currentIndex - 1 : tabOrder.length - 1;
        } else {
          nextIndex = currentIndex < tabOrder.length - 1 ? currentIndex + 1 : 0;
        }
        setActiveTab(tabOrder[nextIndex]);
      }
    };
    const handleClickOutside = (e) => {
      if (insightRef.current && !insightRef.current.contains(e.target)) {
        setInsightExpanded(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [instrument, handleClose, activeTab, insightExpanded]);

  const toggleSectionExpansion = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  if (!instrument) return null;

  const tabs = [
    { id: 'drivers', label: 'Key Drivers', icon: Zap },
    { id: 'flows', label: 'Flows & Stats', icon: DollarSign },
    { id: 'themes', label: 'Themes & Risks', icon: BrainCircuit },
    { id: 'events', label: 'Upcoming Events', icon: Calendar }
  ];

  const backdropVariants = {
    hidden: { opacity: 0, backdropFilter: 'blur(0px)' },
    visible: { opacity: 1, backdropFilter: 'blur(20px)', transition: { duration: 0.28, ease: [0.22, 0.61, 0.36, 1] } },
    exit: { opacity: 0, backdropFilter: 'blur(0px)', transition: { duration: 0.24, ease: [0.32, 0.08, 0.24, 1] } }
  };

  const drawerVariants = {
    hidden: { opacity: 0, scale: 0.94, y: 30 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 320, damping: 35, mass: 0.9 } },
    exit: { opacity: 0, scale: 0.96, y: 20, transition: { duration: 0.24, ease: [0.32, 0.08, 0.24, 1] } }
  };

  const severityOrder = { high: 1, medium: 2, low: 3 };

  return (
    <AnimatePresence>
      {instrument && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0, 0, 0, 0.72)', WebkitBackdropFilter: 'blur(20px)', willChange: 'opacity, backdrop-filter' }}
          onClick={handleClose}
        >
          <motion.div
            ref={drawerRef}
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-7xl max-h-[92vh] flex flex-col overflow-hidden"
            style={{ 
              background: 'linear-gradient(180deg, rgba(18, 22, 30, 0.88) 0%, rgba(12, 16, 22, 0.92) 100%)', 
              backdropFilter: 'blur(48px) saturate(175%)', 
              WebkitBackdropFilter: 'blur(48px) saturate(175%)', 
              border: '1px solid rgba(255, 255, 255, 0.10)',
              borderRadius: '32px',
              boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.10), 0 24px 64px rgba(0,0,0,0.45)'
            }}
          >
            {/* Header */}
            <div className="relative flex-shrink-0" 
              style={{ 
                background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.038) 0%, rgba(255, 255, 255, 0.022) 100%)',
                backdropFilter: 'blur(28px) saturate(165%)',
                WebkitBackdropFilter: 'blur(28px) saturate(165%)',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                padding: '32px'
              }}>
              <div style={{
                position: 'absolute', top: 0, left: '16%', right: '16%', height: '1.5px',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent)',
                pointerEvents: 'none'
              }} />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'radial-gradient(ellipse 65% 35% at 50% 0%, rgba(110, 180, 255, 0.05), transparent 70%)',
                pointerEvents: 'none'
              }} />
              
              <div className="relative z-10 flex items-start justify-between gap-4">
                <div className="flex-shrink-0">
                  <motion.h3
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
                    className="text-3xl font-bold mb-3"
                    style={{ color: 'rgba(255,255,255,0.96)', letterSpacing: '-0.02em' }}
                  >
                    {instrument.name} Analysis
                  </motion.h3>
                  <div className="flex items-center gap-3">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.88 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1, duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
                      className="flex items-center gap-2.5 rounded-[18px]"
                      style={{
                        padding: '10px 16px',
                        background: parseFloat(instrument.change) >= 0
                          ? 'linear-gradient(180deg, rgba(88, 227, 164, 0.14) 0%, rgba(88, 227, 164, 0.10) 100%)'
                          : 'linear-gradient(180deg, rgba(255, 106, 122, 0.14) 0%, rgba(255, 106, 122, 0.10) 100%)',
                        border: parseFloat(instrument.change) >= 0
                          ? '1px solid rgba(88, 227, 164, 0.24)'
                          : '1px solid rgba(255, 106, 122, 0.24)',
                        backdropFilter: 'blur(12px)',
                        boxShadow: parseFloat(instrument.change) >= 0
                          ? 'inset 0 0.5px 0 rgba(88, 227, 164, 0.12)'
                          : 'inset 0 0.5px 0 rgba(255, 106, 122, 0.12)'
                      }}
                    >
                      {parseFloat(instrument.change) >= 0 ? 
                        <TrendingUp className="w-4 h-4" style={{ color: '#58E3A4' }} strokeWidth={2.2} /> : 
                        <TrendingDown className="w-4 h-4" style={{ color: '#FF6A7A' }} strokeWidth={2.2} />
                      }
                      <span className="text-base font-bold" style={{ 
                        color: parseFloat(instrument.change) >= 0 ? '#58E3A4' : '#FF6A7A',
                        fontVariantNumeric: 'tabular-nums'
                      }}>
                        {instrument.change}
                      </span>
                    </motion.div>
                    <span className="text-[13px] font-medium" style={{ color: 'rgba(255,255,255,0.58)' }}>Today</span>
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
                    className="mt-3"
                  >
                    <p className="text-[12px] font-medium" style={{ color: 'rgba(255,255,255,0.42)', letterSpacing: '0.005em', lineHeight: 1.4 }}>
                      Tracked via {FIXED_INCOME_BENCHMARKS[instrument.name] || 'N/A'}
                    </p>
                  </motion.div>
                </div>

                <motion.button
                  onClick={handleClose}
                  whileHover={{ 
                    scale: 1.04,
                    background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.078) 0%, rgba(255, 255, 255, 0.058) 100%)',
                    transition: { duration: 0.16 }
                  }}
                  whileTap={{ scale: 0.96, transition: { duration: 0.10 } }}
                  className="rounded-[20px] flex-shrink-0"
                  style={{ 
                    padding: '12px', width: '44px', height: '44px',
                    background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.058) 0%, rgba(255, 255, 255, 0.038) 100%)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}
                  aria-label="Close drawer"
                >
                  <X className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.72)' }} />
                </motion.button>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="px-8 pt-3 pb-5 flex-shrink-0"
              style={{ 
                background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.028) 0%, rgba(255, 255, 255, 0.018) 100%)',
                backdropFilter: 'blur(24px) saturate(165%)',
                WebkitBackdropFilter: 'blur(24px) saturate(165%)',
                borderBottom: '1px solid rgba(255,255,255,0.06)'
              }}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex gap-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <motion.button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className="relative flex items-center gap-2.5 rounded-[18px] overflow-hidden"
                        style={{
                          padding: '11px 18px',
                          background: isActive ? 'linear-gradient(180deg, rgba(255, 255, 255, 0.082) 0%, rgba(255, 255, 255, 0.062) 100%)' : 'transparent',
                          border: isActive ? '1px solid rgba(255,255,255,0.10)' : '1px solid transparent',
                          boxShadow: isActive ? 'inset 0 1px 0 rgba(255,255,255,0.08), 0 2px 8px rgba(0,0,0,0.06)' : 'none'
                        }}
                        whileHover={!isActive ? {
                          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.048) 0%, rgba(255, 255, 255, 0.032) 100%)',
                          transition: { duration: 0.16 }
                        } : {}}
                        whileTap={{ scale: 0.97, transition: { duration: 0.10 } }}
                      >
                        {isActive && (
                          <div style={{
                            position: 'absolute', top: 0, left: '16%', right: '16%', height: '1px',
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)',
                            pointerEvents: 'none'
                          }} />
                        )}
                        <Icon className="w-4 h-4" style={{ color: isActive ? 'rgba(215, 227, 255, 1)' : 'rgba(155, 163, 176, 1)', strokeWidth: 2.0 }} />
                        <span className="text-[14px] font-semibold" style={{ color: isActive ? 'rgba(255,255,255,0.96)' : 'rgba(255,255,255,0.62)', letterSpacing: '-0.005em' }}>
                          {tab.label}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>

                {/* TL;DR Insight Pill */}
                {CONSENSUS_SUMMARY[instrument.name] && (
                  <motion.div
                    ref={insightRef}
                    layout
                    initial={{ opacity: 0, scale: 0.92, x: 12 }}
                    animate={{ 
                      opacity: 1, scale: 1, x: 0,
                      width: insightExpanded ? '420px' : '72px',
                      height: insightExpanded ? 'auto' : '44px'
                    }}
                    transition={{ 
                      layout: { type: "spring", stiffness: 260, damping: 32, mass: 1.1 },
                      width: { type: "spring", stiffness: 260, damping: 32, mass: 1.1 },
                      height: { type: "spring", stiffness: 260, damping: 32, mass: 1.1 },
                      opacity: { duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }
                    }}
                    onClick={() => setInsightExpanded(!insightExpanded)}
                    className="hidden lg:flex items-center cursor-pointer rounded-[18px] overflow-hidden flex-shrink-0 relative"
                    style={{
                      padding: insightExpanded ? '14px 18px' : '10px 16px',
                      background: insightExpanded
                        ? 'linear-gradient(180deg, rgba(255, 255, 255, 0.042) 0%, rgba(255, 255, 255, 0.028) 100%)'
                        : 'linear-gradient(180deg, rgba(255, 255, 255, 0.032) 0%, rgba(255, 255, 255, 0.020) 100%)',
                      backdropFilter: insightExpanded ? 'blur(36px) saturate(168%)' : 'blur(32px) saturate(165%)',
                      WebkitBackdropFilter: insightExpanded ? 'blur(36px) saturate(168%)' : 'blur(32px) saturate(165%)',
                      border: insightExpanded ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(110, 180, 255, 0.14)',
                      boxShadow: insightExpanded
                        ? 'inset 0 0.5px 0 rgba(255,255,255,0.06), 0 4px 14px rgba(0,0,0,0.07)'
                        : 'inset 0 0.5px 0 rgba(110, 180, 255, 0.08), 0 2px 8px rgba(0,0,0,0.04), 0 0 16px rgba(110, 180, 255, 0.12)',
                      maxWidth: '420px',
                      minHeight: '44px'
                    }}
                    whileHover={!insightExpanded ? {
                      background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.048) 0%, rgba(255, 255, 255, 0.030) 100%)',
                      scale: 1.03,
                      boxShadow: 'inset 0 0.5px 0 rgba(110, 180, 255, 0.10), 0 3px 10px rgba(0,0,0,0.05), 0 0 20px rgba(110, 180, 255, 0.18)',
                      transition: { type: "spring", stiffness: 320, damping: 28, mass: 0.8 }
                    } : {}}
                    whileTap={{ scale: 0.97, transition: { type: "spring", stiffness: 380, damping: 26, mass: 0.7 } }}
                  >
                    <AnimatePresence>
                      {!insightExpanded && (
                        <motion.div
                          className="absolute inset-0 rounded-[18px]"
                          style={{
                            background: 'radial-gradient(ellipse at 50% 50%, rgba(110, 180, 255, 0.10) 0%, transparent 70%)',
                            filter: 'blur(8px)',
                            pointerEvents: 'none'
                          }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0.6, 0.85, 0.6], scale: [1, 1.08, 1] }}
                          exit={{ opacity: 0, transition: { duration: 0.32, ease: [0.22, 0.61, 0.36, 1] } }}
                          transition={{
                            opacity: { duration: 2.8, repeat: Infinity, ease: [0.45, 0.05, 0.55, 0.95] },
                            scale: { duration: 2.8, repeat: Infinity, ease: [0.45, 0.05, 0.55, 0.95] }
                          }}
                        />
                      )}
                    </AnimatePresence>

                    <motion.div 
                      style={{
                        position: 'absolute', top: 0, left: '16%', right: '16%', height: '1px',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
                        pointerEvents: 'none'
                      }}
                      animate={{ opacity: insightExpanded ? 0.6 : 1 }}
                      transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
                    />

                    <motion.div className="relative z-10 w-full min-h-[24px] flex items-center" layout
                      transition={{ layout: { type: "spring", stiffness: 260, damping: 32, mass: 1.0 } }}>
                      <AnimatePresence mode="wait" initial={false}>
                        {!insightExpanded ? (
                          <motion.span
                            key="tldr"
                            layout
                            initial={{ opacity: 0, scale: 0.88, filter: 'blur(4px)' }}
                            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, scale: 0.88, filter: 'blur(4px)', transition: { duration: 0.24, ease: [0.26, 0.11, 0.26, 1.0] } }}
                            transition={{ duration: 0.32, delay: 0.08, ease: [0.22, 0.61, 0.36, 1] }}
                            className="text-[11px] font-semibold whitespace-nowrap block"
                            style={{ color: 'rgba(215, 235, 255, 0.76)', letterSpacing: '0.03em', textShadow: '0 0 8px rgba(110, 180, 255, 0.22)' }}
                          >
                            TL;DR
                          </motion.span>
                        ) : (
                          <motion.div
                            key="insight"
                            layout
                            initial={{ opacity: 0, filter: 'blur(6px)', scale: 0.95 }}
                            animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
                            exit={{ opacity: 0, filter: 'blur(6px)', scale: 0.95, transition: { duration: 0.24, ease: [0.26, 0.11, 0.26, 1.0] } }}
                            transition={{ 
                              opacity: { duration: 0.42, delay: 0.16, ease: [0.22, 0.61, 0.36, 1] },
                              filter: { duration: 0.48, delay: 0.16, ease: [0.22, 0.61, 0.36, 1] },
                              scale: { type: "spring", stiffness: 240, damping: 30, mass: 1.0 },
                              layout: { type: "spring", stiffness: 260, damping: 32, mass: 1.0 }
                            }}
                            className="space-y-1.5 w-full"
                          >
                            <motion.p layout className="text-[11px] font-medium" 
                              style={{ color: 'rgba(255,255,255,0.72)', letterSpacing: '0.002em', lineHeight: 1.5 }}>
                              {CONSENSUS_SUMMARY[instrument.name].outcome}
                            </motion.p>
                            <motion.p layout className="text-[11px] font-medium" 
                              style={{ color: 'rgba(255,255,255,0.72)', letterSpacing: '0.002em', lineHeight: 1.5 }}>
                              {CONSENSUS_SUMMARY[instrument.name].cause}
                            </motion.p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </div>
            
            <div className="p-8 pt-7 flex-1 overflow-y-auto min-h-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.20, ease: [0.26, 0.11, 0.26, 1.0] }}
                >
                  {activeTab === 'drivers' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-16">
                      {(instrumentData.mainDrivers || []).map((driver, index) => (
                        <DriverCard key={index} driver={driver} theme={theme} index={index} isHighlighted={index === 0} />
                      ))}
                    </div>
                  )}

                  {activeTab === 'flows' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                      {instrumentData.institutionalFlow && (
                        <StatCard icon={DollarSign} label="Institutional Flow" sublabel={instrumentData.institutionalFlow.note} isEmphasized={true} data={instrumentData.institutionalFlow} />
                      )}
                      {instrumentData.sentiment && (
                        <StatCard icon={Users} label="Market Sentiment" sublabel={instrumentData.sentiment.note} data={instrumentData.sentiment} />
                      )}
                      {instrumentData.technicalLevels && (
                        <StatCard icon={Target} label="Technical View" sublabel={instrumentData.technicalLevels.note} data={instrumentData.technicalLevels} />
                      )}
                    </div>
                  )}

                  {activeTab === 'themes' && (
                    <div className="space-y-12">
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
                        <div className="mb-6">
                          <h3 className="text-2xl font-bold text-white/95 flex items-center mb-2">
                            <Zap className="w-6 h-6 mr-3 text-emerald-400" strokeWidth={2} />
                            Key Themes
                          </h3>
                          <p className="text-sm text-gray-400 leading-relaxed max-w-2xl">Structural drivers shaping fixed income performance.</p>
                        </div>
                        <div className="hidden md:grid md:grid-cols-4 lg:grid-cols-4 gap-4">
                          {(instrumentData.keyThemes || [])
                            .sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])
                            .map((themeItem, i) => (
                              <InsightCard key={i} item={themeItem} type="theme" index={i} />
                            ))}
                        </div>
                      </motion.div>

                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}>
                        <div className="mb-6">
                          <h3 className="text-2xl font-bold text-white/95 flex items-center mb-2">
                            <AlertTriangle className="w-6 h-6 mr-3 text-red-400" strokeWidth={2} />
                            Risk Factors
                          </h3>
                          <p className="text-sm text-gray-400 leading-relaxed max-w-2xl">Headwinds with potential to pressure valuations.</p>
                        </div>
                        <div className="hidden md:grid md:grid-cols-4 lg:grid-cols-4 gap-4">
                          {(instrumentData.riskFactors || [])
                            .sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])
                            .map((risk, i) => (
                              <InsightCard key={i} item={risk} type="risk" index={i} />
                            ))}
                        </div>
                      </motion.div>
                    </div>
                  )}

                  {activeTab === 'events' && (
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold text-white/95 mb-6 flex items-center">
                        <Calendar className="w-6 h-6 mr-3 text-blue-400" />
                        High-Impact Catalysts
                      </h3>
                      <div className="space-y-3">
                        {(instrumentData.forwardCatalysts || [])
                          .sort((a, b) => {
                            const impactOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
                            return impactOrder[b.impact] - impactOrder[a.impact] || a.daysUntil - b.daysUntil;
                          })
                          .map((event, i) => <EventCard key={i} event={event} index={i} />)}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}