import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, TrendingDown, BrainCircuit, DollarSign, Users, Zap, AlertTriangle, Target, Calendar, ArrowUpRight, Info, ChevronRight, ChevronDown, ArrowRight, Cpu, Cloud, Scale, Globe, TrendingDown as Decline, Bot, Server, Gavel, Building2, Scroll, Clock, FileText, HelpCircle, DollarSign as Cash, Sun, Droplets, Recycle, BarChart3, Construction, Cog, Factory, CreditCard, Scissors, ShoppingBag, Truck, HardHat } from 'lucide-react';

// Helper function to calculate days until for sample data
const calculateDaysUntil = (eventDate) => {
  const today = new Date('2024-01-25'); // Fixed reference date for consistency
  const dateParts = eventDate.split('-');
  const year = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10) - 1; // Month is 0-indexed
  const day = parseInt(dateParts[2], 10);
  const event = new Date(year, month, day);
  const diffTime = event.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays); // Ensure it's not negative
};

const enhancedSectorData = {
  'Technology': {
    mainDrivers: [
      {
        driver: 'AI Infrastructure Demand',
        impact: 'Positive',
        strength: 'High',
        confidence: 95,
        detail: 'Enterprise AI adoption accelerating, driving cloud and semiconductor demand. Major cloud providers expanding capacity by 40% Y/Y to meet AI workload requirements.',
        supportingData: '+40% YoY cloud capacity growth, $180B AI infrastructure spending'
      },
      {
        driver: 'Interest Rate Sensitivity',
        impact: 'Negative',
        strength: 'Medium',
        confidence: 75,
        detail: 'Higher rates pressure high-multiple growth stocks and reduce NPV of future cash flows. Tech P/E compression of 15% since rate hikes began.',
        supportingData: 'Tech P/E fell 15% from peak, discount rates up 200bps'
      },
      {
        driver: 'Earnings Revision Momentum',
        impact: 'Positive',
        strength: 'High',
        confidence: 88,
        detail: '78% of analysts raising Q4 estimates, particularly in cloud and AI hardware. Average revision +3.2% above consensus with semis leading at +5.8%.',
        supportingData: '78% of analysts raising estimates, +3.2% avg revision'
      }
    ],
    institutionalFlow: { 
      direction: 'Inflow', 
      amount: '$2.8B', 
      timeframe: '5 days', 
      percentage: 75, 
      vsPrior: '+65%',
      note: 'Strong rotation into AI infrastructure plays.' 
    },
    earningsRevisions: { 
      direction: 'Up', 
      upgrades: 47,
      downgrades: 13,
      avgChange: '+3.2%', 
      note: 'Majority upgrades signal improving fundamentals.'
    },
    keyThemes: [
      { name: 'Generative AI Monetization', icon: Bot, severity: 'high', interpretation: 'Projected TAM growth of +20% YoY fuels revenue upside.', context: 'AI-driven software and services are expected to be the primary growth vector.' },
      { name: 'Cloud Infrastructure Scaling', icon: Server, severity: 'high', interpretation: 'Major providers expanding capacity by 40% to meet AI demand.', context: 'Capital expenditures from AWS, Azure, and GCP are key indicators.' },
      { name: 'Semiconductor Cycle Recovery', icon: Cpu, severity: 'medium', interpretation: 'Inventory normalization expected by H2 2024, improving margins.', context: 'Watch for memory and logic chip pricing trends.' },
      { name: 'Edge Computing Expansion', icon: Globe, severity: 'medium', interpretation: '5G rollout and IoT adoption are unlocking new use cases.', context: 'Growth is tied to industrial automation and smart device proliferation.' }
    ],
    riskFactors: [
      { name: 'Regulatory Scrutiny', icon: Gavel, severity: 'high', interpretation: 'Antitrust lawsuits in US/EU pose headline and financial risk.', context: 'Focus on potential impacts to app stores, advertising, and M&A activity.' },
      { name: 'China Export Controls', icon: Globe, severity: 'high', interpretation: 'Geopolitical tensions impacting $15B+ in semiconductor trade.', context: 'Restrictions on advanced AI chips are a primary concern for hardware leaders.' },
      { name: 'Valuation Compression', icon: Decline, severity: 'medium', interpretation: 'Higher interest rates continue to pressure high-multiple stocks.', context: 'Tech P/E multiples fell -15% from their 2022 peak.' },
      { name: 'AI Bubble Concerns', icon: AlertTriangle, severity: 'low', interpretation: 'Retail sentiment showing signs of froth, potential for volatility.', context: 'Metrics show a divergence between institutional and retail positioning.' }
    ],
    forwardCatalysts: [
      { date: '2024-01-28', day: '28', event: 'Meta Earnings & AI Capex Guidance', impact: 'High', context: 'Meta expected to announce AI infrastructure capex surge, potentially $30B+ annually', daysUntil: calculateDaysUntil('2024-01-28') },
      { date: '2024-02-01', day: '01', event: 'AI Chip Supply Chain Data', impact: 'Medium', context: 'TSMC and Samsung capacity utilization rates for advanced AI chips', daysUntil: calculateDaysUntil('2024-02-01') },
      { date: '2024-02-05', day: '05', event: 'Cloud Infrastructure Spending Report', impact: 'High', context: 'Q4 hyperscaler capex data from AWS, Azure, Google Cloud expected strong', daysUntil: calculateDaysUntil('2024-02-05') }
    ],
    technicalLevels: { 
      trend: 'Bullish', 
      confidence: 72,
      timeframe: 'Daily',
      support: '4,850', 
      resistance: '5,120', 
      note: 'Momentum strengthening above key support.'
    },
    sentiment: { 
      retailScore: 43, 
      institutionalScore: 57,
      note: 'Institutional positioning stronger than retail.'
    }
  },
  'Healthcare': {
    mainDrivers: [
      { driver: 'Defensive Rotation', impact: 'Positive', strength: 'Medium', confidence: 80, detail: 'Flight to quality amid market uncertainty driving healthcare allocation. Pension funds increasing healthcare weighting by 2.3% this quarter.', supportingData: 'Pension fund reallocation: +2.3% to Healthcare' },
      { driver: 'Drug Pricing Pressure', impact: 'Negative', strength: 'Medium', confidence: 70, detail: 'Medicare negotiations and biosimilar competition weighing on margins. Average price reduction of 12% on negotiated drugs.', supportingData: 'Avg. 12% price reduction on negotiated drugs' },
      { driver: 'Biotech M&A Activity', impact: 'Positive', strength: 'High', confidence: 90, detail: 'Large pharma seeking growth through acquisitions, 23% premium average. $180B in announced deals YTD, 40% above historical average.', supportingData: '$180B M&A YTD, +40% vs. historical' }
    ],
    institutionalFlow: { direction: 'Inflow', amount: '$1.1B', timeframe: '5 days', percentage: 60, vsPrior: '+20%', note: 'Pension fund rebalancing and defensive positioning.' },
    earningsRevisions: { direction: 'Mixed', upgrades: 18, downgrades: 27, avgChange: '+0.8%', note: 'Biotech upgrades offset by pharma downgrades.' },
    keyThemes: [
      { name: 'GLP-1 Market Expansion', icon: Zap, severity: 'high', interpretation: 'Global market projected to exceed $100B by 2030.', context: 'Focus on new indications and supply chain capacity.' },
      { name: 'Oncology Pipeline Progress', icon: Target, severity: 'high', interpretation: 'Record number of Phase 3 trials underway for novel therapies.', context: 'Key readouts expected in H2 2024.' },
      { name: 'Digital Health Integration', icon: Bot, severity: 'medium', interpretation: 'AI-powered diagnostics gaining regulatory approval and adoption.', context: 'Partnerships between tech and pharma are accelerating this trend.' },
      { name: 'Biosimilar Competition', icon: Scale, severity: 'medium', interpretation: 'Over $50B in branded drug revenue at risk through 2025.', context: 'Impacting margins for large-cap pharmaceutical companies.' }
    ],
    riskFactors: [
      { name: 'Drug Pricing Legislation', icon: Scroll, severity: 'high', interpretation: 'Inflation Reduction Act provisions applying downward pressure.', context: 'Medicare price negotiations are a key variable.' },
      { name: 'FDA Approval Delays', icon: Clock, severity: 'medium', interpretation: 'Increased scrutiny on trial data integrity is slowing approvals.', context: 'Affects small and mid-cap biotech valuations.' },
      { name: 'Patent Cliff Exposure', icon: Decline, severity: 'medium', interpretation: 'Key blockbuster drugs facing imminent generic competition.', context: 'Watch for revenue replacement strategies.' },
      { name: 'Regulatory Uncertainty', icon: HelpCircle, severity: 'low', interpretation: 'Election year rhetoric may increase short-term volatility.', context: 'Less of a fundamental risk compared to pricing legislation.' }
    ],
    forwardCatalysts: [
      { date: '2024-01-30', day: '30', event: 'Eli Lilly GLP-1 Data', impact: 'High', context: 'New clinical trial data for GLP-1 drug, significant market moving potential.', daysUntil: calculateDaysUntil('2024-01-30') },
      { date: '2024-02-05', day: '05', event: 'FDA Advisory Committee', impact: 'Medium', context: 'Advisory committee meeting for a key oncology drug.', daysUntil: calculateDaysUntil('2024-02-05') }
    ],
    technicalLevels: { trend: 'Neutral', confidence: 55, timeframe: 'Daily', support: '1,680', resistance: '1,750', note: 'Consolidating near 50-day moving average.' },
    sentiment: { retailScore: 50, institutionalScore: 70, note: 'Institutions cautiously bullish on M&A prospects.' }
  },
  'Financials': {
    mainDrivers: [
      { driver: 'Yield Curve Steepening', impact: 'Positive', strength: 'High', confidence: 85, detail: 'Net interest margin expansion expectations as long rates rise faster than short rates. 2Y-10Y spread widening supports lending profitability.', supportingData: '2Y-10Y spread widening to +50bps' },
      { driver: 'Credit Quality Concerns', impact: 'Negative', strength: 'Medium', confidence: 65, detail: 'Commercial real estate exposure and rising charge-offs in consumer lending. Office real estate losses averaging 8.5% of loan books.', supportingData: 'CRE losses: avg. 8.5% of loan books' },
      { driver: 'Capital Return Acceleration', impact: 'Positive', strength: 'Medium', confidence: 75, detail: 'Banks increasing buybacks and dividends after stress test results. Average payout ratio increased to 65% from 52% last year.', supportingData: 'Avg payout ratio: 65% (up from 52%)' }
    ],
    institutionalFlow: { direction: 'Inflow', amount: '$1.9B', timeframe: '5 days', percentage: 68, vsPrior: '+45%', note: 'Value rotation momentum and yield curve positioning.' },
    earningsRevisions: { direction: 'Up', upgrades: 28, downgrades: 14, avgChange: '+2.1%', note: 'Upgrades focused on large-cap banks.' },
    keyThemes: [
      { name: 'NIM Expansion Cycle', icon: TrendingUp, severity: 'high', interpretation: 'Net Interest Margin benefits from higher for longer rates.', context: 'Monitor the 2-10 year yield curve spread.' },
      { name: 'Digital Banking Transformation', icon: CreditCard, severity: 'medium', interpretation: 'AI-driven cost savings and efficiency gains improving op-ex.', context: 'Fintech partnerships are key.' },
      { name: 'Fintech Integration', icon: Bot, severity: 'medium', interpretation: 'Partnerships and acquisitions driving innovation in consumer finance.', context: 'Focus on payment and lending tech.' },
      { name: 'Credit Cycle Management', icon: BarChart3, severity: 'high', interpretation: 'Focus on high-quality borrowers and loan loss provisions.', context: 'CRE is the main portfolio segment to watch.' }
    ],
    riskFactors: [
      { name: 'Commercial Real Estate', icon: Building2, severity: 'high', interpretation: 'Significant risk from office and retail loan portfolios.', context: 'Regional banks have the highest exposure.' },
      { name: 'Regulatory Capital Changes', icon: Gavel, severity: 'medium', interpretation: 'Basel III endgame rules could impact buybacks and dividends.', context: 'Implementation details are still being finalized.' },
      { name: 'Economic Recession Risk', icon: Decline, severity: 'medium', interpretation: 'Loan loss provisions would increase if economy slows.', context: 'Tied to unemployment and GDP growth forecasts.' },
      { name: 'Credit Loss Provisions', icon: Cash, severity: 'low', interpretation: 'Charge-offs remain below historical averages, but are ticking up.', context: 'Consumer credit (auto, card) is the first area to show stress.' }
    ],
    forwardCatalysts: [
      { date: '2024-01-26', day: '26', event: 'JPM Earnings & NIM Guidance', impact: 'High', context: 'JPMorgan Chase Q4 earnings report and critical net interest margin outlook.', daysUntil: calculateDaysUntil('2024-01-26') },
      { date: '2024-02-08', day: '08', event: 'Fed Bank Supervision Report', impact: 'Medium', context: 'Federal Reserve\'s latest report on bank supervision and health.', daysUntil: calculateDaysUntil('2024-02-08') }
    ],
    technicalLevels: { trend: 'Bullish', confidence: 75, timeframe: 'Daily', support: '615', resistance: '645', note: 'Breaking out from multi-month resistance.' },
    sentiment: { retailScore: 70, institutionalScore: 80, note: 'Broadly bullish sentiment across both cohorts.' }
  },
  'Consumer Disc.': {
    mainDrivers: [
      { driver: 'Bifurcated Consumer Spending', impact: 'Mixed', strength: 'High', confidence: 80, detail: 'High-income consumers resilient while lower-income showing stress. Luxury goods up 8% Y/Y, mass market down 3%.', supportingData: 'Luxury sales up 8%, mass market down 3%' },
      { driver: 'Inventory Normalization', impact: 'Negative', strength: 'Medium', confidence: 70, detail: 'Retailers working through excess inventory, pressuring margins. Average inventory levels 15% above historical norms.', supportingData: 'Inventory levels +15% vs. historical' },
      { driver: 'China Reopening Impact', impact: 'Positive', strength: 'Medium', confidence: 60, detail: 'Luxury goods and travel benefiting from normalized Chinese consumer activity. Chinese luxury spending up 25% Q/Q.', supportingData: 'Chinese luxury spending +25% Q/Q' }
    ],
    institutionalFlow: { direction: 'Outflow', amount: '-$0.8B', timeframe: '5 days', percentage: 30, vsPrior: '-15%', note: 'Rotation to defensive sectors amid consumer uncertainty.' },
    earningsRevisions: { direction: 'Down', upgrades: 15, downgrades: 23, avgChange: '-1.4%', note: 'Downgrades concentrated in mass-market retail.' },
    keyThemes: [
      { name: 'Luxury Resilience', icon: TrendingUp, severity: 'high', interpretation: 'High-end brands maintaining pricing power and demand.', context: 'Driven by wealth effect and international travel.' },
      { name: 'E-commerce Market Share', icon: ShoppingBag, severity: 'medium', interpretation: 'Online retailers continue to outperform brick-and-mortar.', context: 'Focus on last-mile delivery and personalization.' },
      { name: 'Supply Chain Optimization', icon: Truck, severity: 'medium', interpretation: 'Companies focusing on cost-cutting and efficiency gains.', context: 'Inventory levels are a key metric to watch.' },
      { name: 'Experiential Spending', icon: Globe, severity: 'low', interpretation: 'Travel and leisure demand remains soft among lower-income cohorts.', context: 'A key divergence point within the sector.' }
    ],
    riskFactors: [
      { name: 'Consumer Credit Stress', icon: CreditCard, severity: 'high', interpretation: 'Rising delinquency rates in auto and credit card loans.', context: 'A leading indicator for broader economic health.' },
      { name: 'Recessionary Spending Cuts', icon: Scissors, severity: 'high', interpretation: 'Non-essential spending at risk in a downturn.', context: 'Particularly affects apparel and home goods.' },
      { name: 'Wage Growth Deceleration', icon: Decline, severity: 'medium', interpretation: 'Slowing wage growth could impact consumer spending power.', context: 'Tied to the health of the labor market.' },
      { name: 'Inventory Overhang', icon: ShoppingBag, severity: 'medium', interpretation: 'Excess inventory may lead to margin pressure via discounts.', context: 'Retailer inventory-to-sales ratios are key.' }
    ],
    forwardCatalysts: [
      { date: '2024-01-31', day: '31', event: 'Amazon Q4 & AWS Growth', impact: 'High', context: 'Amazon earnings report, with focus on e-commerce and cloud (AWS) growth.', daysUntil: calculateDaysUntil('2024-01-31') },
      { date: '2024-02-06', day: '06', event: 'Retail Sales Data', impact: 'High', context: 'Monthly retail sales data release, key indicator for consumer health.', daysUntil: calculateDaysUntil('2024-02-06') }
    ],
    technicalLevels: { trend: 'Bearish', confidence: 30, timeframe: 'Daily', support: '1,420', resistance: '1,480', note: 'Trend remains weak below 200-day average.' },
    sentiment: { retailScore: 30, institutionalScore: 50, note: 'Institutions neutral, awaiting retail sales data.' }
  },
  'Energy': {
    mainDrivers: [
      { driver: 'Oil Inventory Build', impact: 'Negative', strength: 'High', confidence: 80, detail: 'Strategic reserves releases and increased shale production outpacing demand growth. US crude inventories up 8.2M barrels vs -2.1M expected.', supportingData: 'US crude inventories: +8.2M barrels (vs. -2.1M expected)' },
      { driver: 'Geopolitical Risk Premium', impact: 'Positive', strength: 'Medium', confidence: 70, detail: 'Middle East tensions supporting risk premium despite inventory concerns. Risk premium estimated at $8-12/barrel.', supportingData: 'Risk premium: $8-12/barrel due to geopolitics' },
      { driver: 'Capital Discipline Focus', impact: 'Positive', strength: 'Medium', confidence: 75, detail: 'Energy companies maintaining shareholder returns over growth capex. Free cash flow yields averaging 12% across sector.', supportingData: 'FCF yields: avg. 12% across sector' }
    ],
    institutionalFlow: { direction: 'Outflow', amount: '-$1.2B', timeframe: '5 days', percentage: 25, vsPrior: '-25%', note: 'ESG mandates driving divestiture and transition concerns.' },
    earningsRevisions: { direction: 'Down', upgrades: 6, downgrades: 22, avgChange: '-2.8%', note: 'Revisions tied to lower oil price forecasts.' },
    keyThemes: [
      { name: 'Free Cash Flow', icon: Cash, severity: 'high', interpretation: 'Shareholder returns (dividends, buybacks) prioritized over capex.', context: 'FCF yields are a key valuation metric.' },
      { name: 'Renewable Transition', icon: Sun, severity: 'high', interpretation: 'Majors investing in wind, solar, and carbon capture projects.', context: 'Pace of investment vs. fossil fuels is a key debate.' },
      { name: 'Shale Production', icon: Droplets, severity: 'medium', interpretation: 'Focus on efficiency and cost reduction in major basins.', context: 'Permian basin output is a bellwether.' },
      { name: 'ESG Compliance', icon: Recycle, severity: 'medium', interpretation: 'Navigating evolving environmental regulations and investor demands.', context: 'Affects cost of capital.' }
    ],
    riskFactors: [
      { name: 'Demand Destruction Risk', icon: Decline, severity: 'high', interpretation: 'A global economic slowdown could sharply reduce oil demand.', context: 'China\'s economic health is a major variable.' },
      { name: 'Stranded Asset Concerns', icon: AlertTriangle, severity: 'high', interpretation: 'Long-term risk from the accelerating transition to renewables.', context: 'Affects long-duration project financing.' },
      { name: 'Regulatory Headwinds', icon: Scroll, severity: 'medium', interpretation: 'Tighter regulations on drilling and emissions increase costs.', context: 'Particularly relevant in the US and Europe.' },
      { name: 'Transition Timeline', icon: HelpCircle, severity: 'medium', interpretation: 'Pace of EV adoption and renewable build-out is a key variable.', context: 'Creates uncertainty for long-term supply/demand models.' }
    ],
    forwardCatalysts: [
      { date: '2024-01-29', day: '29', event: 'ExxonMobil Permian Update', impact: 'High', context: 'ExxonMobil investor call focusing on Permian Basin production outlook and capex.', daysUntil: calculateDaysUntil('2024-01-29') },
      { date: '2024-02-07', day: '07', event: 'EIA Inventory Report', impact: 'Medium', context: 'Weekly EIA report on crude oil and refined product inventories.', daysUntil: calculateDaysUntil('2024-02-07') }
    ],
    technicalLevels: { trend: 'Bearish', confidence: 25, timeframe: 'Daily', support: '680', resistance: '720', note: 'Struggling at key resistance levels.' },
    sentiment: { retailScore: 20, institutionalScore: 40, note: 'Sentiment broadly bearish on inventory builds.' }
  },
  'Industrials': {
    mainDrivers: [
      { driver: 'Infrastructure Spending', impact: 'Positive', strength: 'High', confidence: 90, detail: 'Government infrastructure bills creating multi-year tailwind. $1.2T Infrastructure Act driving 5-7 year demand cycle.', supportingData: '$1.2T Infrastructure Act driving demand' },
      { driver: 'Supply Chain Reshoring', impact: 'Positive', strength: 'Medium', confidence: 80, detail: 'Nearshoring trends benefiting North American industrial capacity. Manufacturing construction spending up 67% Y/Y.', supportingData: 'Manufacturing construction +67% Y/Y' },
      { driver: 'Labor Cost Inflation', impact: 'Negative', strength: 'Medium', confidence: 60, detail: 'Skilled labor shortages driving wage inflation, pressuring margins. Industrial wage inflation at 6.2% Y/Y vs 3.8% historical average.', supportingData: 'Industrial wage inflation: 6.2% Y/Y' }
    ],
    institutionalFlow: { direction: 'Inflow', amount: '$0.9B', timeframe: '5 days', percentage: 55, vsPrior: '+30%', note: 'Infrastructure theme momentum and reshoring plays.' },
    earningsRevisions: { direction: 'Up', upgrades: 31, downgrades: 9, avgChange: '+1.9%', note: 'Strong revisions in machinery and construction.' },
    keyThemes: [
      { name: 'Infrastructure Modernization', icon: Construction, severity: 'high', interpretation: 'The $1.2T Infrastructure Act provides a multi-year tailwind.', context: 'Focus on engineering and construction firms.' },
      { name: 'Green Energy Transition', icon: Sun, severity: 'high', interpretation: 'Strong demand for electrical equipment and grid upgrades.', context: 'Benefits electrical equipment and engineering firms.' },
      { name: 'Automation Adoption', icon: Cog, severity: 'medium', interpretation: 'Robotics and automation driving efficiency gains and productivity.', context: 'A response to skilled labor shortages.' },
      { name: 'Reshoring Acceleration', icon: Factory, severity: 'medium', interpretation: 'Manufacturing capacity returning to North America.', context: 'Boosts construction and machinery demand.' }
    ],
    riskFactors: [
      { name: 'Economic Slowdown', icon: Decline, severity: 'high', interpretation: 'Cyclical demand is highly sensitive to GDP growth.', context: 'PMI data is a key leading indicator.' },
      { name: 'Labor Shortage', icon: HardHat, severity: 'high', interpretation: 'Skilled labor shortages impacting project timelines and costs.', context: 'Drives wage inflation and margin pressure.' },
      { name: 'Raw Material Costs', icon: Cash, severity: 'medium', interpretation: 'Volatility in steel, copper, and other input costs.', context: 'Can impact project profitability.' },
      { name: 'Supply Chain Disruptions', icon: Truck, severity: 'low', interpretation: 'Global supply chains have largely normalized, reducing risk.', context: 'Monitoring has shifted from crisis to optimization.' }
    ],
    forwardCatalysts: [
      { date: '2024-02-02', day: '02', event: 'Caterpillar Infrastructure Update', impact: 'High', context: 'Caterpillar earnings call and outlook on construction and mining equipment demand.', daysUntil: calculateDaysUntil('2024-02-02') },
      { date: '2024-02-09', day: '09', event: 'Infrastructure Spending Report', impact: 'Medium', context: 'Government report detailing progress and outlook for infrastructure projects.', daysUntil: calculateDaysUntil('2024-02-09') }
    ],
    technicalLevels: { trend: 'Bullish', confidence: 65, timeframe: 'Daily', support: '890', resistance: '925', note: 'Holding strong above previous breakout level.' },
    sentiment: { retailScore: 65, institutionalScore: 75, note: 'Sentiment supported by government spending tailwinds.' }
  }
};

const DriverCard = ({ driver, theme, index, isHighlighted }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  const getImpactColor = (impact) => {
    switch (impact) {
      case 'Positive': return 'from-emerald-500/20 to-green-500/20 border-emerald-500/30 text-emerald-300';
      case 'Negative': return 'from-red-500/20 to-rose-500/20 border-red-500/30 text-red-300';
      default: return 'from-amber-500/20 to-yellow-500/20 border-amber-500/30 text-amber-300';
    }
  };

  const getImpactIcon = (impact) => {
    const iconProps = { className: "w-5 h-5 mr-2" };
    if (impact === 'Positive') {
      return (
        <motion.div
          animate={{ rotate: [0, 5, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <TrendingUp {...iconProps} />
        </motion.div>
      );
    }
    if (impact === 'Negative') {
      return (
        <motion.div
          animate={{ rotate: [0, -5, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <TrendingDown {...iconProps} />
        </motion.div>
      );
    }
    return <AlertTriangle {...iconProps} />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: isHighlighted ? 1.05 : 1,
        boxShadow: isHighlighted ? '0 8px 32px rgba(59, 130, 246, 0.15)' : '0 4px 16px rgba(0, 0, 0, 0.1)'
      }}
      transition={{ delay: index * 0.1, type: "spring", stiffness: 100, damping: 15 }}
      whileHover={{ y: -2, scale: isHighlighted ? 1.07 : 1.02 }}
      className="group relative overflow-visible rounded-2xl p-6 backdrop-blur-2xl border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
      style={{
        background: isHighlighted
          ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(18, 20, 25, 0.8))'
          : 'rgba(18, 20, 25, 0.8)'
      }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Enhanced gradient overlay */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${getImpactColor(driver.impact)} opacity-0 group-hover:opacity-100 transition-all duration-500`}
        style={{ filter: 'blur(20px)' }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            {getImpactIcon(driver.impact)}
            <h4 className="font-bold text-lg text-white leading-tight">
              {driver.driver}
            </h4>
          </div>

          <motion.div
            className={`inline-flex items-center px-3 py-1.5 rounded-xl text-sm font-bold border bg-gradient-to-r ${getImpactColor(driver.impact)}`}
            whileHover={{ scale: 1.05 }}
          >
            {driver.impact} Impact
          </motion.div>
        </div>

        {/* Confidence Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
            <span>Confidence Level</span>
            <span>{driver.confidence}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${driver.confidence}%` }}
              transition={{ duration: 1, delay: index * 0.2, ease: "easeOut" }}
            />
          </div>
        </div>

        <p className="text-sm leading-relaxed text-gray-300 group-hover:text-white transition-colors duration-300 line-clamp-3">
          {driver.detail}
        </p>

        {/* Enhanced Tooltip - Positioned Below */}
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              className="absolute top-full mt-3 left-4 right-4 z-50 p-3 rounded-lg backdrop-blur-xl border border-white/20 shadow-2xl"
              style={{ background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.90))' }}
            >
              <div className="text-xs text-blue-300 font-semibold">
                {driver.supportingData}
              </div>
              {/* Tooltip arrow pointing up */}
              <div className="absolute -top-1 left-4 w-2 h-2 rotate-45 border-t border-l border-white/20"
                style={{ background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.90))' }}
              ></div>
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
              className={`h-full rounded-full`}
              style={{ background: isInflow ? 'linear-gradient(to right, #10B981, #34D399)' : 'linear-gradient(to right, #EF4444, #F87171)'}}
              initial={{ width: 0 }}
              animate={{ width: animated ? `${data.percentage}%` : 0 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            />
          </div>
        </div>
      );
    }

    if (label.includes('Revisions')) {
      const totalRevisions = data.upgrades + data.downgrades;
      const upgradePercentage = totalRevisions > 0 ? (data.upgrades / totalRevisions) * 100 : 0;
      return (
         <div className="mt-4">
          <div className="h-3 bg-red-500/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(to right, #10B981, #34D399)'}}
              initial={{ width: 0 }}
              animate={{ width: animated ? `${upgradePercentage}%` : 0 }}
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
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Retail</span>
              <span>{data.retailScore}%</span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(to right, #3B82F6, #60A5FA)'}}
                initial={{ width: 0 }}
                animate={{ width: animated ? `${data.retailScore}%` : 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              />
            </div>
          </div>
          <div>
             <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Institutional</span>
              <span>{data.institutionalScore}%</span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(to right, #8B5CF6, #A78BFA)'}}
                initial={{ width: 0 }}
                animate={{ width: animated ? `${data.institutionalScore}%` : 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      );
    }
    
    if (label.includes('Technical')) {
        return (
          <div className="mt-4">
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                  className="h-full rounded-full"
                  style={{ background: data.trend === 'Bullish' ? 'linear-gradient(to right, #10B981, #34D399)' : 'linear-gradient(to right, #EF4444, #F87171)'}}
                  initial={{ width: 0 }}
                  animate={{ width: animated ? `${data.confidence}%` : 0 }}
                  transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
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
          <div className="text-3xl lg:text-4xl font-black text-white">{data.amount}</div>
          <div className={`text-base font-bold flex items-center mt-1 ${data.vsPrior.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
             <ArrowUpRight className={`w-4 h-4 mr-1 ${!data.vsPrior.startsWith('+') && 'rotate-[135deg]'}`} />
             {data.vsPrior} vs last week
          </div>
        </>
      );
    }
    if (label.includes('Revisions')) {
      return (
        <div className="flex items-baseline space-x-3">
          <div className="text-3xl lg:text-4xl font-black text-white flex items-center">
            {data.upgrades} <TrendingUp className="w-6 h-6 ml-2 text-emerald-400" />
          </div>
           <div className="text-2xl font-bold text-gray-500">/</div>
           <div className="text-3xl lg:text-4xl font-black text-white flex items-center">
            {data.downgrades} <TrendingDown className="w-6 h-6 ml-2 text-red-400" />
          </div>
        </div>
      );
    }
    if (label.includes('Technical')) {
       return (
        <>
          <div className="text-3xl lg:text-4xl font-black text-white">{data.trend}</div>
          <div className="text-base font-bold text-gray-400 mt-1">{data.confidence}% confidence</div>
        </>
      );
    }
    if (label.includes('Sentiment')) {
        return (
            <div className="text-3xl lg:text-4xl font-black text-white">Divergence</div>
        );
    }
    return <div className="text-3xl lg:text-4xl font-black text-white">{value}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.03, y: -4 }}
      transition={{ duration: 0.3 }}
      className={`relative overflow-hidden rounded-3xl p-6 backdrop-blur-2xl border transition-all duration-300
        ${isEmphasized ? 'border-blue-500/30' : 'border-white/10'}
      `}
      style={{ 
        background: isEmphasized ? 'rgba(59, 130, 246, 0.05)' : 'rgba(18, 20, 25, 0.8)',
      }}
    >
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex-grow">
          <div className="flex items-center justify-between mb-4">
            <h5 className="font-semibold text-gray-300 text-base uppercase tracking-wider">
              {label}
            </h5>
            <Icon className={`w-6 h-6 text-gray-500`} />
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
            <p className="text-sm text-gray-400 mt-4 text-center">
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

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'High': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default: return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    }
  };
  
  const getImpactAccent = (impact) => {
    switch (impact) {
      case 'High': return { color: 'border-red-400/80', thickness: 'border-l-4' };
      case 'Medium': return { color: 'border-amber-400/80', thickness: 'border-l-2' };
      default: return { color: 'border-emerald-400/80', thickness: 'border-l-2' };
    }
  };

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
  
  const accentStyle = getImpactAccent(event.impact);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="group relative"
    >
      <div className="flex flex-col rounded-2xl bg-gray-800/50 border border-white/10 backdrop-blur-md transition-all duration-300 overflow-hidden">
        <motion.div
          whileHover={{
              y: isExpanded ? 0 : -2,
              backgroundColor: "rgba(30, 41, 59, 0.6)"
          }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-between p-6 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center space-x-4">
            {/* Date Box */}
            <div className="relative flex-shrink-0">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-700/20 to-blue-900/20 border border-blue-500/30 flex flex-col items-center justify-center overflow-hidden">
                <span className="text-xs text-blue-300 opacity-80 uppercase leading-none">
                  {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                </span>
                <span className="text-2xl font-extrabold text-white leading-tight">
                  {event.day}
                </span>
                {event.daysUntil === 0 && (
                  <span className="absolute bottom-0 w-full text-center text-[8px] uppercase font-bold bg-blue-500/30 text-blue-100 py-0.5">Today</span>
                )}
              </div>
            </div>

            <div className="flex-1">
              <p className={`text-white text-xl group-hover:text-blue-300 transition-colors duration-200 ${event.impact === 'High' ? 'font-black' : 'font-bold'}`}>
                {event.event}
              </p>
              <div className="mt-2 space-y-2">
                {/* Urgency Timeline */}
                <div className="w-36 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-orange-500 to-red-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${getUrgencyWidth(event.daysUntil)}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                  />
                </div>
                <p className="text-gray-400 text-sm flex items-center">
                  {event.daysUntil === 0 ? 'Due Today' : `${event.daysUntil} day${event.daysUntil === 1 ? '' : 's'} remaining`}
                  <span className="mx-2 text-gray-600">•</span>
                  <span className="font-medium">{new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className={`flex items-center px-4 py-2 rounded-xl font-bold text-sm border ${getImpactColor(event.impact)}`}>
              {getImpactIcon(event.impact)}
              {event.impact} Impact
            </span>

            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <ChevronRight className="w-6 h-6 text-gray-500 group-hover:text-white transition-colors" />
            </motion.div>
          </div>
        </motion.div>

        {/* Expanded Context */}
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
              <div className={`pt-1 pb-6 px-6 ml-[92px] ${accentStyle.thickness} ${accentStyle.color}`}>
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.25 }}
                  className="text-gray-400 text-[15px] leading-relaxed"
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
        className="relative h-full flex flex-col p-6 rounded-2xl border backdrop-blur-sm cursor-pointer transition-all duration-300 overflow-hidden"
        style={{ background: selectedStyle.bg, borderColor: selectedStyle.border }}
      >
        <div className="flex items-start justify-between mb-4">
          <IconComponent className={`w-6 h-6 ${selectedStyle.icon}`} strokeWidth={1.5} />
          <div className={`px-2.5 py-1 rounded-md text-xs font-bold ${selectedStyle.tag.bg} ${selectedStyle.tag.text}`}>
            {item.severity} Impact
          </div>
        </div>
        <div className="flex-grow">
          <h4 className={`text-lg text-white ${selectedEmphasis.fontWeight}`}>{item.name}</h4>
          <p className="mt-2 text-sm text-gray-400 leading-relaxed">{item.interpretation}</p>
        </div>
      </div>

      <AnimatePresence>
        {showTooltip && item.context && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-max max-w-xs z-10 p-3 rounded-xl backdrop-blur-xl border border-white/20 shadow-2xl"
            style={{ background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.90))' }}
          >
            <div className="text-xs font-medium text-blue-300 text-center leading-relaxed">
              {item.context}
            </div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 border-b border-r border-white/20" 
                 style={{ background: 'rgba(30, 41, 59, 0.90)' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};


export default function SectorDetailDrawer({ sector, onClose, theme }) {
  const [activeTab, setActiveTab] = useState('drivers');
  const [expandedSections, setExpandedSections] = useState({ themes: false, risks: false });
  const drawerRef = useRef(null);

  // sector.name might be undefined initially if the prop is not immediately available.
  // Add a defensive check here to prevent errors.
  const sectorData = sector && enhancedSectorData[sector.name] ? enhancedSectorData[sector.name] : {};

  // Memoize handleClose to fix dependency issue
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!sector) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleClose();
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
    const handleWheel = (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
        if (e.deltaY < -20) handleClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('wheel', handleWheel, { passive: false });
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('wheel', handleWheel);
      document.body.style.overflow = 'unset';
    };
  }, [sector, handleClose, activeTab]);

  const toggleSectionExpansion = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (!sector) return null;

  const tabs = [
    { id: 'drivers', label: 'Key Drivers', icon: Zap },
    { id: 'flows', label: 'Flows & Stats', icon: DollarSign },
    { id: 'themes', label: 'Themes & Risks', icon: BrainCircuit },
    { id: 'events', label: 'Upcoming Events', icon: Calendar }
  ];

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const drawerVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 50, rotateX: -10 },
    visible: { opacity: 1, scale: 1, y: 0, rotateX: 0, transition: { type: "spring", stiffness: 300, damping: 30, mass: 0.8 } },
    exit: { opacity: 0, scale: 0.95, y: 30, rotateX: 5, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } }
  };

  const severityOrder = { high: 1, medium: 2, low: 3 };

  return (
    <AnimatePresence>
      {sector && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
          onClick={handleClose}
        >
          <motion.div
            ref={drawerRef}
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-7xl max-h-[95vh] flex flex-col overflow-hidden"
            style={{ 
              background: 'rgba(12, 18, 32, 0.75)', 
              backdropFilter: 'blur(60px) saturate(175%)', 
              WebkitBackdropFilter: 'blur(60px) saturate(175%)', 
              borderRadius: '28px',
              border: '1px solid rgba(255, 255, 255, 0.10)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), inset 0 0 60px rgba(255,255,255,0.02), 0 25px 80px -20px rgba(0,0,0,0.50)'
            }}
          >
            {/* Top specular edge */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: '10%',
              right: '10%',
              height: '1.5px',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
              pointerEvents: 'none',
              borderRadius: '28px 28px 0 0',
              zIndex: 10
            }} />
            {/* OS Horizon Liquid Glass Header */}
            <div className="relative border-b border-white/8 flex-shrink-0" 
                 style={{ 
                   background: 'rgba(255, 255, 255, 0.03)',
                   backdropFilter: 'blur(40px) saturate(160%)',
                   WebkitBackdropFilter: 'blur(40px) saturate(160%)'
                 }}>
              
              {/* Soft gradient accent glow */}
              <div 
                className="absolute inset-x-0 top-0 h-32"
                style={{
                  background: 'radial-gradient(ellipse 70% 40% at 50% -10%, rgba(34, 211, 238, 0.08), transparent 70%)',
                  pointerEvents: 'none'
                }}
              />
              
              <div className="relative z-10 flex items-start justify-between p-8">
                <div>
                  <motion.h3
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-3xl font-black text-white mb-2"
                    style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}
                  >
                    {sector.name} Deep Analysis
                  </motion.h3>
                  <div className="flex items-center space-x-4">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 }}
                      className={`flex items-center space-x-3 px-4 py-2 rounded-xl font-bold backdrop-blur-sm border ${sector.change.startsWith('+') ? 'bg-gradient-to-r from-emerald-500/15 to-green-500/15 border-emerald-500/25 text-emerald-300' : 'bg-gradient-to-r from-red-500/15 to-rose-500/15 border-red-500/25 text-red-300'}`}
                    >
                      {sector.change.startsWith('+') ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                      <span className="text-lg">{sector.change}</span>
                    </motion.div>
                    <span className="text-sm text-gray-400">Today's Performance</span>
                  </div>
                </div>
                <motion.button
                  onClick={handleClose}
                  whileHover={{ scale: 1.05, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 rounded-2xl transition-all duration-200"
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}
                >
                  <X className="w-6 h-6 text-gray-400 hover:text-white transition-colors" />
                </motion.button>
              </div>
            </div>
            
            {/* OS Horizon Liquid Glass Drawer Tabs */}
            <div className="px-8 pt-2 pb-4 flex-shrink-0"
                 style={{ 
                   background: 'rgba(255, 255, 255, 0.02)',
                   backdropFilter: 'blur(24px) saturate(150%)',
                   WebkitBackdropFilter: 'blur(24px) saturate(150%)'
                 }}>
              <div className="flex space-x-6">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative flex items-center space-x-3 px-3 py-4 text-sm transition-all duration-300 ${isActive ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                      whileHover={{ y: -1, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon className="w-4 h-4" strokeWidth={isActive ? 2.5 : 1.8} />
                      <span className={isActive ? 'font-semibold' : 'font-medium'}>{tab.label}</span>
                      
                      {/* Glowing underline for active tab */}
                      {isActive && (
                        <motion.div
                          layoutId="activeTabGlow"
                          className="absolute bottom-0 left-0 right-0 h-0.5"
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        >
                          <div 
                            className="h-full w-full rounded-full"
                            style={{
                              background: 'linear-gradient(90deg, #22D3EE, #14B8A6)',
                              boxShadow: '0 0 12px rgba(34, 211, 238, 0.6), 0 0 24px rgba(20, 184, 166, 0.3)'
                            }}
                          />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
            
            <div className="p-8 pt-6 flex-1 overflow-y-auto min-h-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                  {activeTab === 'drivers' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-16">
                      {(sectorData.mainDrivers || []).map((driver, index) => (
                        <DriverCard key={index} driver={driver} theme={theme} index={index} isHighlighted={index === 0} />
                      ))}
                    </div>
                  )}

                  {activeTab === 'flows' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                      {sectorData.institutionalFlow && (
                        <StatCard
                          icon={DollarSign}
                          label="Institutional Flow"
                          sublabel={sectorData.institutionalFlow.note}
                          isEmphasized={true}
                          data={sectorData.institutionalFlow}
                        />
                      )}

                      {sectorData.earningsRevisions && (
                        <StatCard
                          icon={TrendingUp}
                          label="Earnings Revisions"
                          sublabel={sectorData.earningsRevisions.note}
                          isEmphasized={true}
                          data={sectorData.earningsRevisions}
                        />
                      )}

                      {sectorData.sentiment && (
                        <StatCard
                          icon={Users}
                          label="Market Sentiment"
                          sublabel={sectorData.sentiment.note}
                          data={sectorData.sentiment}
                        />
                      )}

                      {sectorData.technicalLevels && (
                        <StatCard
                          icon={Target}
                          label="Technical View"
                          sublabel={sectorData.technicalLevels.note}
                          data={sectorData.technicalLevels}
                        />
                      )}
                    </div>
                  )}

                  {activeTab === 'themes' && (
                    <div className="space-y-12">
                      {/* Secular Growth Drivers */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      >
                        <div className="mb-6">
                          <h3 className="text-2xl font-bold text-white/95 flex items-center mb-2">
                            <Zap className="w-6 h-6 mr-3 text-emerald-400" strokeWidth={2} />
                            Secular Growth Drivers
                          </h3>
                          <p className="text-sm text-gray-400 leading-relaxed max-w-2xl">Structural tailwinds propelling sector strength.</p>
                        </div>

                        {/* Desktop/Tablet: Single Row Grid */}
                        <div className="hidden md:grid md:grid-cols-4 lg:grid-cols-4 gap-4">
                          {(sectorData.keyThemes || [])
                            .sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])
                            .map((themeItem, i) => (
                              <InsightCard key={i} item={themeItem} type="theme" index={i} />
                            ))}
                        </div>

                        {/* Mobile: Horizontal Scroll with Expansion */}
                        <div className="md:hidden">
                          <AnimatePresence>
                            {!expandedSections.themes ? (
                              <motion.div
                                key="themes-scroll"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex space-x-4 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-hide"
                                style={{ 
                                  scrollSnapType: 'x mandatory',
                                  WebkitOverflowScrolling: 'touch'
                                }}
                              >
                                {(sectorData.keyThemes || [])
                                  .sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])
                                  .map((themeItem, i) => (
                                    <div 
                                      key={i} 
                                      className="flex-shrink-0 w-72" 
                                      style={{ scrollSnapAlign: 'center' }}
                                    >
                                      <InsightCard item={themeItem} type="theme" index={i} />
                                    </div>
                                  ))}
                                
                                {/* See All Toggle Button */}
                                <motion.button
                                  onClick={() => toggleSectionExpansion('themes')}
                                  className="flex-shrink-0 w-24 h-full min-h-[200px] flex flex-col items-center justify-center rounded-2xl border border-white/10 backdrop-blur-sm text-gray-400 hover:text-white hover:bg-white/[0.08] transition-all duration-300"
                                  style={{ 
                                    background: 'rgba(18, 20, 25, 0.8)',
                                    scrollSnapAlign: 'center'
                                  }}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <ChevronDown className="w-5 h-5 mb-2" />
                                  <span className="text-xs font-semibold text-center leading-tight">See All</span>
                                </motion.button>
                              </motion.div>
                            ) : (
                              <motion.div
                                key="themes-expanded"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                              >
                                <div className="grid grid-cols-1 gap-4">
                                  {(sectorData.keyThemes || [])
                                    .sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])
                                    .map((themeItem, i) => (
                                      <InsightCard key={i} item={themeItem} type="theme" index={i} />
                                    ))}
                                </div>
                                
                                {/* Collapse Button */}
                                <motion.button
                                  onClick={() => toggleSectionExpansion('themes')}
                                  className="mt-4 w-full py-3 rounded-xl border border-white/10 backdrop-blur-sm text-gray-400 hover:text-white hover:bg-white/[0.08] transition-all duration-300 flex items-center justify-center space-x-2"
                                  style={{ background: 'rgba(18, 20, 25, 0.8)' }}
                                  whileHover={{ scale: 1.01 }}
                                  whileTap={{ scale: 0.99 }}
                                >
                                  <motion.div
                                      animate={{ rotate: -90 }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      <ChevronDown className="w-4 h-4" />
                                    </motion.div>
                                  <span className="text-sm font-semibold">Collapse</span>
                                </motion.button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>

                      {/* Macro & Regulatory Risks */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
                      >
                        <div className="mb-6">
                          <h3 className="text-2xl font-bold text-white/95 flex items-center mb-2">
                            <AlertTriangle className="w-6 h-6 mr-3 text-red-400" strokeWidth={2} />
                            Macro & Regulatory Risks
                          </h3>
                          <p className="text-sm text-gray-400 leading-relaxed max-w-2xl">External headwinds with potential to constrain growth.</p>
                        </div>

                        {/* Desktop/Tablet: Single Row Grid */}
                        <div className="hidden md:grid md:grid-cols-4 lg:grid-cols-4 gap-4">
                          {(sectorData.riskFactors || [])
                            .sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])
                            .map((risk, i) => (
                              <InsightCard key={i} item={risk} type="risk" index={i} />
                            ))}
                        </div>

                        {/* Mobile: Horizontal Scroll */}
                        <div className="md:hidden">
                          <AnimatePresence>
                            {!expandedSections.risks ? (
                              <motion.div
                                key="risks-scroll"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex space-x-4 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-hide"
                                style={{ 
                                  scrollSnapType: 'x mandatory',
                                  WebkitOverflowScrolling: 'touch'
                                }}
                              >
                                {(sectorData.riskFactors || [])
                                  .sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])
                                  .map((risk, i) => (
                                    <div 
                                      key={i} 
                                      className="flex-shrink-0 w-72" 
                                      style={{ scrollSnapAlign: 'center' }}
                                    >
                                      <InsightCard item={risk} type="risk" index={i} />
                                    </div>
                                  ))}
                                
                                {/* See All Toggle Button */}
                                <motion.button
                                  onClick={() => toggleSectionExpansion('risks')}
                                  className="flex-shrink-0 w-24 h-full min-h-[200px] flex flex-col items-center justify-center rounded-2xl border border-white/10 backdrop-blur-sm text-gray-400 hover:text-white hover:bg-white/[0.08] transition-all duration-300"
                                  style={{ 
                                    background: 'rgba(18, 20, 25, 0.8)',
                                    scrollSnapAlign: 'center'
                                  }}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <ChevronDown className="w-5 h-5 mb-2" />
                                  <span className="text-xs font-semibold text-center leading-tight">See All</span>
                                </motion.button>
                              </motion.div>
                            ) : (
                              <motion.div
                                key="risks-expanded"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                              >
                                <div className="grid grid-cols-1 gap-4">
                                  {(sectorData.riskFactors || [])
                                    .sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])
                                    .map((risk, i) => (
                                      <InsightCard key={i} item={risk} type="risk" index={i} />
                                    ))}
                                </div>
                                
                                {/* Collapse Button */}
                                <motion.button
                                  onClick={() => toggleSectionExpansion('risks')}
                                  className="mt-4 w-full py-3 rounded-xl border border-white/10 backdrop-blur-sm text-gray-400 hover:text-white hover:bg-white/[0.08] transition-all duration-300 flex items-center justify-center space-x-2"
                                  style={{ background: 'rgba(18, 20, 25, 0.8)' }}
                                  whileHover={{ scale: 1.01 }}
                                  whileTap={{ scale: 0.99 }}
                                >
                                  <motion.div
                                      animate={{ rotate: -90 }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      <ChevronDown className="w-4 h-4" />
                                    </motion.div>
                                  <span className="text-sm font-semibold">Collapse</span>
                                </motion.button>
                              </motion.div>
                            )}
                          </AnimatePresence>
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
                        {(sectorData.forwardCatalysts || [])
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