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

// Sector → Benchmark ETF Mapping (static)
const SECTOR_BENCHMARKS = {
  'Technology': 'XLK',
  'Energy': 'XLE',
  'Financials': 'XLF',
  'Healthcare': 'XLV',
  'Industrials': 'XLI',
  'Consumer Discretionary': 'XLY',
  'Consumer Staples': 'XLP',
  'Communication Services': 'XLC',
  'Materials': 'XLB',
  'Utilities': 'XLU',
  'Real Estate': 'XLRE'
};

const enhancedSectorData = {
  'Technology': {
    mainDrivers: [
      {
        driver: 'AI Infrastructure Demand',
        impact: 'Positive',
        strength: 'High',
        confidence: 95,
        detail: 'Companies are spending big on AI infrastructure. Cloud providers need 40% more capacity to handle the demand.',
        supportingData: 'Cloud capacity up 40% this year, $180B spent on AI infrastructure'
      },
      {
        driver: 'Interest Rate Sensitivity',
        impact: 'Negative',
        strength: 'Medium',
        confidence: 75,
        detail: 'Higher interest rates are making expensive tech stocks less attractive. Tech stock valuations have dropped 15% since rates went up.',
        supportingData: 'Tech valuations fell 15% from peak, interest rates up 2%'
      },
      {
        driver: 'Earnings Revision Momentum',
        impact: 'Positive',
        strength: 'High',
        confidence: 88,
        detail: '78% of analysts raising their profit forecasts, especially for cloud and AI chip companies. Expectations are 3.2% higher on average.',
        supportingData: '78% of analysts raising forecasts, +3.2% average increase'
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
      { name: 'AI Becoming Profitable', icon: Bot, severity: 'high', interpretation: 'AI tools are starting to make real money. Market expected to grow 20% this year.', context: 'Companies are finding ways to charge for AI features and services.' },
      { name: 'Cloud Build-Out', icon: Server, severity: 'high', interpretation: 'Big cloud companies are expanding by 40% to handle AI workloads.', context: 'Watch how much Amazon, Microsoft, and Google are spending on data centers.' },
      { name: 'Chip Supply Fixing', icon: Cpu, severity: 'medium', interpretation: 'The chip shortage is ending. By mid-2024, supply will be healthy and profits should improve.', context: 'Watch memory and processor chip prices - they show supply health.' },
      { name: 'Edge Computing Expansion', icon: Globe, severity: 'medium', interpretation: '5G rollout and IoT adoption are unlocking new use cases.', context: 'Growth is tied to industrial automation and smart device proliferation.' }
    ],
    riskFactors: [
      { name: 'Government Lawsuits', icon: Gavel, severity: 'high', interpretation: 'Big tech companies are being sued for monopoly behavior. This could force business changes and hurt profits.', context: 'Watch cases involving app stores, advertising, and company acquisitions.' },
      { name: 'China Trade Ban', icon: Globe, severity: 'high', interpretation: 'The US banned selling advanced AI chips to China. This cuts off $15B+ in sales.', context: 'Chip makers are losing access to one of their biggest markets.' },
      { name: 'Stock Prices Under Pressure', icon: Decline, severity: 'medium', interpretation: 'Higher interest rates are making tech stocks look expensive. Prices have fallen 15% from peak.', context: 'Investors are demanding lower prices to justify the risk.' },
      { name: 'AI Bubble Concerns', icon: AlertTriangle, severity: 'low', interpretation: 'Retail sentiment showing signs of froth, potential for volatility.', context: 'Metrics show a divergence between institutional and retail positioning.' }
    ],
    forwardCatalysts: [
      { date: '2024-01-28', day: '28', event: 'Meta Earnings & AI Spending Plan', impact: 'High', context: 'Meta is expected to announce massive AI spending - possibly $30B+ per year. This signals their AI commitment and will boost suppliers.', daysUntil: calculateDaysUntil('2024-01-28') },
      { date: '2024-02-01', day: '01', event: 'AI Chip Supply Chain Data', impact: 'Medium', context: 'TSMC and Samsung capacity utilization rates for advanced AI chips', daysUntil: calculateDaysUntil('2024-02-01') },
      { date: '2024-02-05', day: '05', event: 'Cloud Spending Report', impact: 'High', context: 'Q4 data showing how much Amazon, Microsoft, and Google spent on cloud infrastructure. Expected to be strong.', daysUntil: calculateDaysUntil('2024-02-05') }
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
      { driver: 'Defensive Rotation', impact: 'Positive', strength: 'Medium', confidence: 80, detail: 'Investors are moving money into safer healthcare stocks during uncertain times. Big pension funds are increasing healthcare holdings by 2.3%.', supportingData: 'Pension funds moved 2.3% more money into healthcare' },
      { driver: 'Drug Pricing Pressure', impact: 'Negative', strength: 'Medium', confidence: 70, detail: 'Government is negotiating lower drug prices. Plus, cheaper generic versions are competing. Drug prices are down 12% on average.', supportingData: 'Average 12% price drop on negotiated drugs' },
      { driver: 'Biotech M&A Activity', impact: 'Positive', strength: 'High', confidence: 90, detail: 'Big pharma companies are buying smaller ones to grow. They\'re paying 23% above market price. $180B in deals so far - 40% more than usual.', supportingData: '$180B in deals this year, 40% more than normal' }
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
      { driver: 'Yield Curve Steepening', impact: 'Positive', strength: 'High', confidence: 85, detail: 'Banks make more money when long-term rates rise faster than short-term rates. The gap is widening, which boosts bank profits.', supportingData: 'Gap between 2-year and 10-year rates widening to 0.5%' },
      { driver: 'Credit Quality Concerns', impact: 'Negative', strength: 'Medium', confidence: 65, detail: 'Banks have risky office building loans and more people defaulting on credit cards. Office loan losses average 8.5% of total loans.', supportingData: 'Office building loan losses: average 8.5% of total loans' },
      { driver: 'Capital Return Acceleration', impact: 'Positive', strength: 'Medium', confidence: 75, detail: 'Banks passed stress tests and are returning more cash to shareholders through buybacks and dividends. Payouts increased from 52% to 65%.', supportingData: 'Average shareholder payout: 65% (up from 52%)' }
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
  'Consumer Discretionary': {
    mainDrivers: [
      { driver: 'Bifurcated Consumer Spending', impact: 'Mixed', strength: 'High', confidence: 80, detail: 'Rich people are still spending, but average people are cutting back. Luxury sales up 8%, regular stores down 3%.', supportingData: 'Luxury sales up 8% this year, regular stores down 3%' },
      { driver: 'Inventory Normalization', impact: 'Negative', strength: 'Medium', confidence: 70, detail: 'Retailers have too much stuff in warehouses. They\'ll need to discount to sell it. Inventory is 15% higher than normal.', supportingData: 'Inventory 15% higher than normal levels' },
      { driver: 'China Reopening Impact', impact: 'Positive', strength: 'Medium', confidence: 60, detail: 'China reopened and Chinese consumers are spending again. Luxury purchases in China jumped 25% this quarter.', supportingData: 'Chinese luxury spending up 25% this quarter' }
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
      { driver: 'Oil Inventory Build', impact: 'Negative', strength: 'High', confidence: 80, detail: 'More oil is being produced than used. US oil stockpiles grew by 8.2M barrels when they were expected to drop.', supportingData: 'US oil stockpiles: +8.2M barrels (expected -2.1M)' },
      { driver: 'Geopolitical Risk Premium', impact: 'Positive', strength: 'Medium', confidence: 70, detail: 'Middle East conflicts are keeping oil prices elevated despite high supply. War risk adds $8-12 per barrel.', supportingData: 'War risk adds $8-12 per barrel to oil prices' },
      { driver: 'Capital Discipline Focus', impact: 'Positive', strength: 'Medium', confidence: 75, detail: 'Energy companies are paying dividends instead of drilling more. They\'re generating 12% cash returns on average.', supportingData: 'Average cash returns: 12% across energy sector' }
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
      { driver: 'Infrastructure Spending', impact: 'Positive', strength: 'High', confidence: 90, detail: 'Government is spending $1.2 trillion on infrastructure. This will drive demand for construction and equipment for 5-7 years.', supportingData: '$1.2 trillion Infrastructure Act creating 5-7 years of demand' },
      { driver: 'Supply Chain Reshoring', impact: 'Positive', strength: 'Medium', confidence: 80, detail: 'Companies are moving factories back to North America. Manufacturing construction spending is up 67% year-over-year.', supportingData: 'Manufacturing construction up 67% this year' },
      { driver: 'Labor Cost Inflation', impact: 'Negative', strength: 'Medium', confidence: 60, detail: 'Companies can\'t find enough skilled workers. Wages are rising 6.2% per year vs 3.8% normally, squeezing profits.', supportingData: 'Industrial wages up 6.2% this year (normal is 3.8%)' }
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
  },
  'Communication Services': {
    mainDrivers: [
      { driver: 'Digital Ad Recovery', impact: 'Positive', strength: 'High', confidence: 85, detail: 'Digital advertising spending is rebounding after a soft 2023. Meta and Google seeing 12% growth in ad revenue.', supportingData: 'Digital ad revenue up 12% year-over-year' },
      { driver: 'Content Streaming Competition', impact: 'Negative', strength: 'Medium', confidence: 70, detail: 'Streaming wars are intensifying. Companies spending heavily on content while subscriber growth slows to 3%.', supportingData: 'Subscriber growth slowing to 3%, content costs up 18%' },
      { driver: 'AI Integration Opportunity', impact: 'Positive', strength: 'Medium', confidence: 75, detail: 'AI tools improving ad targeting and content recommendations, driving 8% higher engagement rates.', supportingData: 'AI-driven engagement up 8%, conversion rates improving' }
    ],
    institutionalFlow: { direction: 'Inflow', amount: '$0.6B', timeframe: '5 days', percentage: 50, vsPrior: '+12%', note: 'Ad recovery theme gaining traction.' },
    earningsRevisions: { direction: 'Up', upgrades: 22, downgrades: 11, avgChange: '+1.5%', note: 'Upgrades concentrated in digital advertising.' },
    keyThemes: [
      { name: 'AI-Powered Advertising', icon: Bot, severity: 'high', interpretation: 'Machine learning improving ad targeting and ROI for advertisers.', context: 'Drives higher pricing power for platforms.' },
      { name: 'Content Investment Cycle', icon: FileText, severity: 'high', interpretation: 'Major studios investing heavily in exclusive content to retain subscribers.', context: 'Watch subscriber churn rates closely.' },
      { name: '5G Monetization', icon: Zap, severity: 'medium', interpretation: 'Telecom carriers exploring new revenue streams from 5G services.', context: 'Enterprise and IoT applications are key.' },
      { name: 'Social Commerce Growth', icon: ShoppingBag, severity: 'medium', interpretation: 'Social platforms integrating e-commerce features for direct sales.', context: 'Competing with traditional e-commerce channels.' }
    ],
    riskFactors: [
      { name: 'Regulatory Scrutiny', icon: Gavel, severity: 'high', interpretation: 'Antitrust investigations and content moderation regulations increasing.', context: 'Could impact business models and profitability.' },
      { name: 'Ad Budget Cuts', icon: Scissors, severity: 'medium', interpretation: 'Economic uncertainty causing advertisers to reduce spending.', context: 'Cyclical risk tied to corporate profits.' },
      { name: 'Subscriber Saturation', icon: Users, severity: 'medium', interpretation: 'Streaming services facing slower growth in mature markets.', context: 'International expansion becoming critical.' },
      { name: 'Cord-Cutting Acceleration', icon: Decline, severity: 'low', interpretation: 'Traditional cable and satellite losing subscribers to streaming.', context: 'Long-term structural shift underway.' }
    ],
    forwardCatalysts: [
      { date: '2024-01-31', day: '31', event: 'Meta Q4 & Ad Revenue Outlook', impact: 'High', context: 'Meta earnings with focus on digital advertising recovery and AI monetization.', daysUntil: calculateDaysUntil('2024-01-31') },
      { date: '2024-02-06', day: '06', event: 'Disney Streaming Profitability', impact: 'High', context: 'Disney+ subscriber count and path to streaming profitability.', daysUntil: calculateDaysUntil('2024-02-06') }
    ],
    technicalLevels: { trend: 'Bullish', confidence: 62, timeframe: 'Daily', support: '285', resistance: '305', note: 'Testing key resistance after recent rally.' },
    sentiment: { retailScore: 58, institutionalScore: 65, note: 'Improving sentiment on ad recovery thesis.' }
  },
  'Consumer Staples': {
    mainDrivers: [
      { driver: 'Defensive Positioning', impact: 'Positive', strength: 'Medium', confidence: 78, detail: 'Investors are moving into safe consumer staple stocks during market uncertainty. Valuations are 8% above historical average.', supportingData: 'Valuations 8% above 10-year average' },
      { driver: 'Input Cost Deflation', impact: 'Positive', strength: 'High', confidence: 82, detail: 'Raw material costs are falling. Packaging, grains, and energy down 12% from peak, improving profit margins.', supportingData: 'Input costs down 12% from peak levels' },
      { driver: 'Private Label Competition', impact: 'Negative', strength: 'Medium', confidence: 68, detail: 'Retailers pushing cheaper store-brand products. Name brands losing 3.5% market share as consumers trade down.', supportingData: 'Branded products losing 3.5% market share to private label' }
    ],
    institutionalFlow: { direction: 'Inflow', amount: '$0.5B', timeframe: '5 days', percentage: 52, vsPrior: '+8%', note: 'Defensive rotation supporting inflows.' },
    earningsRevisions: { direction: 'Mixed', upgrades: 16, downgrades: 14, avgChange: '+0.4%', note: 'Mixed revisions reflecting margin improvement vs volume concerns.' },
    keyThemes: [
      { name: 'Margin Expansion', icon: TrendingUp, severity: 'high', interpretation: 'Lower input costs driving operating margin improvements.', context: 'Focus on companies with pricing power.' },
      { name: 'Premiumization Trend', icon: TrendingUp, severity: 'medium', interpretation: 'Affluent consumers trading up to premium brands despite inflation.', context: 'Bifurcated consumer driving mixed results.' },
      { name: 'E-commerce Penetration', icon: ShoppingBag, severity: 'medium', interpretation: 'Online grocery and staples sales continuing to gain share.', context: 'Supply chain and last-mile delivery investments key.' },
      { name: 'Health & Wellness Focus', icon: Sun, severity: 'medium', interpretation: 'Consumer preference shifting toward organic and functional foods.', context: 'Benefits brands with health-focused positioning.' }
    ],
    riskFactors: [
      { name: 'Volume Pressure', icon: Decline, severity: 'high', interpretation: 'Consumers buying less as they trade down to cheaper options.', context: 'Lower-income households reducing discretionary staples.' },
      { name: 'Retailer Consolidation', icon: Building2, severity: 'medium', interpretation: 'Large retailers gaining negotiating power, pressuring brand margins.', context: 'Walmart and Amazon driving hard bargains.' },
      { name: 'Currency Headwinds', icon: Globe, severity: 'medium', interpretation: 'Strong dollar hurting international sales and profitability.', context: 'Many staples companies have 40%+ international exposure.' },
      { name: 'Valuation Risk', icon: AlertTriangle, severity: 'low', interpretation: 'Trading at premium multiples, vulnerable to rotation.', context: 'Monitor relative valuation vs historical norms.' }
    ],
    forwardCatalysts: [
      { date: '2024-01-30', day: '30', event: 'Procter & Gamble Earnings', impact: 'High', context: 'P&G quarterly results and commentary on pricing power and volume trends.', daysUntil: calculateDaysUntil('2024-01-30') },
      { date: '2024-02-08', day: '08', event: 'Consumer Confidence Index', impact: 'Medium', context: 'Monthly consumer confidence data impacts staples demand outlook.', daysUntil: calculateDaysUntil('2024-02-08') }
    ],
    technicalLevels: { trend: 'Neutral', confidence: 48, timeframe: 'Daily', support: '720', resistance: '745', note: 'Range-bound near all-time highs.' },
    sentiment: { retailScore: 55, institutionalScore: 62, note: 'Moderate bullish sentiment on defensive qualities.' }
  },
  'Materials': {
    mainDrivers: [
      { driver: 'China Demand Slowdown', impact: 'Negative', strength: 'High', confidence: 82, detail: 'China using less steel, copper, and other materials as construction slows. Commodity prices down 8-15% from peak.', supportingData: 'Commodity prices down 8-15% on China slowdown' },
      { driver: 'US Manufacturing Reshoring', impact: 'Positive', strength: 'Medium', confidence: 72, detail: 'Factories returning to North America need more materials. Domestic demand for steel and chemicals up 5.5%.', supportingData: 'US industrial materials demand up 5.5%' },
      { driver: 'Energy Cost Relief', impact: 'Positive', strength: 'Medium', confidence: 70, detail: 'Natural gas and electricity costs falling 18% from peak, reducing production costs for chemical and metal companies.', supportingData: 'Energy input costs down 18% from peak' }
    ],
    institutionalFlow: { direction: 'Outflow', amount: '-$0.6B', timeframe: '5 days', percentage: 35, vsPrior: '-18%', note: 'China concerns driving defensive rotation.' },
    earningsRevisions: { direction: 'Down', upgrades: 8, downgrades: 19, avgChange: '-1.8%', note: 'Downgrades reflecting weaker commodity pricing.' },
    keyThemes: [
      { name: 'Green Transition Materials', icon: Recycle, severity: 'high', interpretation: 'Strong demand for lithium, cobalt, and rare earths for batteries and EVs.', context: 'Multi-year structural tailwind from electrification.' },
      { name: 'Reshoring Industrial Base', icon: Factory, severity: 'high', interpretation: 'US manufacturing expansion driving domestic materials demand.', context: 'Benefits steel, chemicals, and construction materials.' },
      { name: 'Commodity Price Volatility', icon: TrendingDown, severity: 'medium', interpretation: 'Commodity prices remain volatile amid shifting global demand patterns.', context: 'Watch China PMI and US housing starts closely.' },
      { name: 'Packaging Innovation', icon: Recycle, severity: 'medium', interpretation: 'Sustainable packaging regulations driving demand for recycled materials.', context: 'Benefits companies with recycling capabilities.' }
    ],
    riskFactors: [
      { name: 'China Property Crisis', icon: Building2, severity: 'high', interpretation: 'China real estate slowdown reducing steel and cement demand significantly.', context: 'China accounts for 50%+ of global steel consumption.' },
      { name: 'Energy Price Volatility', icon: Zap, severity: 'high', interpretation: 'Energy-intensive producers vulnerable to oil and gas price swings.', context: 'Affects chemicals, steel, and aluminum producers.' },
      { name: 'Overcapacity Risk', icon: Factory, severity: 'medium', interpretation: 'Global production capacity exceeds demand in several commodities.', context: 'Pricing power remains limited.' },
      { name: 'Environmental Regulations', icon: Globe, severity: 'medium', interpretation: 'Tighter emissions standards increasing compliance costs.', context: 'Particularly relevant in Europe and California.' }
    ],
    forwardCatalysts: [
      { date: '2024-01-29', day: '29', event: 'China PMI Release', impact: 'High', context: 'China manufacturing PMI data, key leading indicator for materials demand.', daysUntil: calculateDaysUntil('2024-01-29') },
      { date: '2024-02-03', day: '03', event: 'LIN Earnings & Outlook', impact: 'Medium', context: 'Linde industrial gases earnings and global manufacturing commentary.', daysUntil: calculateDaysUntil('2024-02-03') }
    ],
    technicalLevels: { trend: 'Bearish', confidence: 40, timeframe: 'Daily', support: '530', resistance: '560', note: 'Breaking below 50-day moving average.' },
    sentiment: { retailScore: 35, institutionalScore: 42, note: 'Bearish sentiment on China exposure and commodity weakness.' }
  },
  'Real Estate': {
    mainDrivers: [
      { driver: 'Higher Rates Pressure', impact: 'Negative', strength: 'High', confidence: 88, detail: 'Interest rates at 5%+ are making REITs less attractive vs bonds. REIT valuations down 18% from peak.', supportingData: 'REIT valuations down 18% since rate hikes began' },
      { driver: 'Office Space Headwinds', impact: 'Negative', strength: 'High', confidence: 80, detail: 'Remote work is permanent. Office buildings are 30% empty in major cities, hurting property values.', supportingData: 'Office vacancy rates averaging 30% in major metros' },
      { driver: 'Industrial/Logistics Strength', impact: 'Positive', strength: 'Medium', confidence: 75, detail: 'E-commerce needs more warehouses. Industrial REIT rents up 7.2% as vacancy stays under 4%.', supportingData: 'Industrial REIT rents up 7.2%, vacancy under 4%' }
    ],
    institutionalFlow: { direction: 'Outflow', amount: '-$0.4B', timeframe: '5 days', percentage: 32, vsPrior: '-22%', note: 'Rate sensitivity driving continued outflows.' },
    earningsRevisions: { direction: 'Down', upgrades: 9, downgrades: 18, avgChange: '-1.2%', note: 'Office REIT downgrades outweighing industrial strength.' },
    keyThemes: [
      { name: 'Industrial/Logistics Boom', icon: Truck, severity: 'high', interpretation: 'E-commerce growth driving warehouse and distribution center demand.', context: 'Supply remains tight in key markets.' },
      { name: 'Office Transformation', icon: Building2, severity: 'high', interpretation: 'Hybrid work models reshaping office space requirements.', context: 'Flight to quality favoring newer, amenity-rich buildings.' },
      { name: 'Multifamily Resilience', icon: Building2, severity: 'medium', interpretation: 'Apartment demand holding up despite housing affordability concerns.', context: 'High home prices keeping renters in place.' },
      { name: 'Data Center Demand', icon: Server, severity: 'medium', interpretation: 'AI and cloud growth driving specialized data center REIT performance.', context: 'Power and cooling requirements create barriers to entry.' }
    ],
    riskFactors: [
      { name: 'Rate Duration Risk', icon: TrendingDown, severity: 'high', interpretation: 'REITs sensitive to interest rate changes due to high leverage.', context: 'Fed policy path is the dominant variable.' },
      { name: 'Office Obsolescence', icon: Building2, severity: 'high', interpretation: 'Structural decline in office demand from remote work permanence.', context: 'Class B and C office buildings face highest risk.' },
      { name: 'Refinancing Wall', icon: Cash, severity: 'medium', interpretation: 'Many REITs face debt maturities in 2024-2025 at higher rates.', context: 'Could force asset sales or dilutive equity raises.' },
      { name: 'Recession Exposure', icon: Decline, severity: 'medium', interpretation: 'Economic downturn would hurt occupancy and rent growth.', context: 'Particularly relevant for retail and hospitality REITs.' }
    ],
    forwardCatalysts: [
      { date: '2024-01-28', day: '28', event: 'Prologis Industrial Outlook', impact: 'High', context: 'Leading industrial REIT earnings and commentary on warehouse demand trends.', daysUntil: calculateDaysUntil('2024-01-28') },
      { date: '2024-02-01', day: '01', event: 'Fed Interest Rate Decision', impact: 'High', context: 'Federal Reserve rate decision directly impacts REIT valuations and financing costs.', daysUntil: calculateDaysUntil('2024-02-01') }
    ],
    technicalLevels: { trend: 'Bearish', confidence: 35, timeframe: 'Daily', support: '380', resistance: '405', note: 'Downtrend intact, testing multi-year support.' },
    sentiment: { retailScore: 28, institutionalScore: 38, note: 'Broadly bearish on rate and office exposure.' }
  },
  'Utilities': {
    mainDrivers: [
      { driver: 'Safe Haven Demand', impact: 'Positive', strength: 'Medium', confidence: 75, detail: 'Investors seeking stability moving into utility stocks. Dividend yields averaging 3.8% attracting income investors.', supportingData: 'Average utility dividend yield: 3.8%' },
      { driver: 'Rate Sensitivity', impact: 'Negative', strength: 'Medium', confidence: 70, detail: 'Higher interest rates make utility dividends less attractive vs bonds. 10-year Treasury at 4.2% competing with utility yields.', supportingData: '10-year Treasury at 4.2% vs utility yields ~3.8%' },
      { driver: 'Clean Energy Transition', impact: 'Positive', strength: 'High', confidence: 85, detail: 'Utilities investing $95B annually in renewable energy infrastructure. Wind and solar capacity growing 22% per year.', supportingData: '$95B annual renewable investment, capacity up 22%' }
    ],
    institutionalFlow: { direction: 'Inflow', amount: '$0.3B', timeframe: '5 days', percentage: 48, vsPrior: '+5%', note: 'Modest defensive flows amid market volatility.' },
    earningsRevisions: { direction: 'Up', upgrades: 14, downgrades: 8, avgChange: '+0.6%', note: 'Upgrades from regulated rate increases.' },
    keyThemes: [
      { name: 'Grid Modernization', icon: Zap, severity: 'high', interpretation: 'Utilities investing heavily in grid upgrades to support electrification and renewables.', context: 'Creates a multi-decade capital deployment opportunity.' },
      { name: 'Renewable Buildout', icon: Sun, severity: 'high', interpretation: 'Wind and solar capacity additions accelerating to meet clean energy mandates.', context: 'Rate base growth supports earnings visibility.' },
      { name: 'Regulated Rate Increases', icon: TrendingUp, severity: 'medium', interpretation: 'State regulators approving higher rates to fund infrastructure investments.', context: 'Provides stable earnings growth of 5-6% annually.' },
      { name: 'EV Charging Infrastructure', icon: Zap, severity: 'medium', interpretation: 'Utilities building out EV charging networks as new revenue source.', context: 'Long-term opportunity tied to EV adoption rates.' }
    ],
    riskFactors: [
      { name: 'Interest Rate Sensitivity', icon: TrendingDown, severity: 'high', interpretation: 'Utility stocks typically decline when bond yields rise.', context: 'Fed policy path is the key driver.' },
      { name: 'Regulatory Lag Risk', icon: Gavel, severity: 'medium', interpretation: 'Utilities may not recover full costs if regulators deny rate requests.', context: 'Political and consumer affordability concerns.' },
      { name: 'Weather Volatility', icon: Cloud, severity: 'medium', interpretation: 'Extreme weather events increasing operational costs and damage.', context: 'Climate change driving higher insurance and repair costs.' },
      { name: 'Technology Disruption', icon: Bot, severity: 'low', interpretation: 'Distributed solar and battery storage reducing grid dependence.', context: 'Long-term structural risk to centralized utilities.' }
    ],
    forwardCatalysts: [
      { date: '2024-01-27', day: '27', event: 'NextEra Renewable Outlook', impact: 'Medium', context: 'Leading renewable utility provides guidance on clean energy investments.', daysUntil: calculateDaysUntil('2024-01-27') },
      { date: '2024-02-10', day: '10', event: 'Federal Energy Policy Update', impact: 'Medium', context: 'DOE announcement on grid modernization funding and clean energy incentives.', daysUntil: calculateDaysUntil('2024-02-10') }
    ],
    technicalLevels: { trend: 'Neutral', confidence: 50, timeframe: 'Daily', support: '305', resistance: '320', note: 'Trading in narrow range, awaiting catalyst.' },
    sentiment: { retailScore: 52, institutionalScore: 58, note: 'Neutral sentiment, valued for stability over growth.' }
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
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1
      }}
      transition={{ 
        delay: index * 0.08, 
        duration: 0.4, 
        ease: [0.22, 0.61, 0.36, 1] 
      }}
      whileHover={{ 
        y: -3, 
        scale: 1.012,
        transition: { duration: 0.18, ease: [0.26, 0.11, 0.26, 1.0] }
      }}
      whileTap={{ scale: 0.985, transition: { duration: 0.10 } }}
      className="group relative overflow-visible rounded-[20px] cursor-pointer"
      style={{
        padding: '24px',
        background: isHighlighted
          ? 'linear-gradient(180deg, rgba(110, 180, 255, 0.08) 0%, rgba(18, 22, 30, 0.92) 100%)'
          : 'linear-gradient(180deg, rgba(255, 255, 255, 0.042) 0%, rgba(255, 255, 255, 0.028) 100%)',
        backdropFilter: 'blur(32px) saturate(165%)',
        WebkitBackdropFilter: 'blur(32px) saturate(165%)',
        border: isHighlighted 
          ? '1px solid rgba(110, 180, 255, 0.14)' 
          : '1px solid rgba(255,255,255,0.08)',
        boxShadow: isHighlighted
          ? 'inset 0 1px 0 rgba(255,255,255,0.10), 0 4px 16px rgba(0,0,0,0.10), 0 0 24px rgba(110, 180, 255, 0.08)'
          : 'inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 16px rgba(0,0,0,0.08)',
        transition: 'all 0.18s cubic-bezier(0.26, 0.11, 0.26, 1.0)'
      }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Top specular */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '16%',
        right: '16%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
        pointerEvents: 'none'
      }} />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-2.5">
            {getImpactIcon(driver.impact)}
            <h4 className="font-bold text-[16px] leading-tight" style={{ 
              color: 'rgba(255,255,255,0.94)',
              letterSpacing: '-0.01em'
            }}>
              {driver.driver}
            </h4>
          </div>

          <motion.div
            className="inline-flex items-center rounded-[14px]"
            style={{
              padding: '8px 14px',
              fontSize: '12px',
              fontWeight: 700,
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

        {/* Confidence Bar */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2.5" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.56)' }}>
            <span className="font-medium">Confidence</span>
            <span className="font-bold" style={{ 
              color: 'rgba(255,255,255,0.88)',
              fontVariantNumeric: 'tabular-nums'
            }}>
              {driver.confidence}%
            </span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ 
                background: 'linear-gradient(90deg, #4DA3FF 0%, #58E3A4 100%)',
                boxShadow: 'inset 0 0.5px 0 rgba(255,255,255,0.18)'
              }}
              initial={{ width: 0 }}
              animate={{ width: `${driver.confidence}%` }}
              transition={{ duration: 0.8, delay: index * 0.15, ease: [0.22, 0.61, 0.36, 1] }}
            />
          </div>
        </div>

        <p className="text-[14px] leading-relaxed" style={{ 
          color: 'rgba(255,255,255,0.72)',
          transition: 'color 0.18s ease'
        }}>
          {driver.detail}
        </p>

        {/* OS Horizon Tooltip */}
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
          <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255, 106, 122, 0.12)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ 
                background: 'linear-gradient(to right, #58E3A4, #73E6D2)',
                boxShadow: 'inset 0 0.5px 0 rgba(255,255,255,0.18)'
              }}
              initial={{ width: 0 }}
              animate={{ width: animated ? `${upgradePercentage}%` : 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
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
                style={{ 
                  background: 'linear-gradient(to right, #4DA3FF, #60A5FA)',
                  boxShadow: 'inset 0 0.5px 0 rgba(255,255,255,0.18)'
                }}
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
                style={{ 
                  background: 'linear-gradient(to right, #8B5CF6, #A78BFA)',
                  boxShadow: 'inset 0 0.5px 0 rgba(255,255,255,0.18)'
                }}
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
          <div className="text-3xl lg:text-4xl font-bold" style={{ 
            color: 'rgba(255,255,255,0.96)',
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '-0.02em'
          }}>
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
    if (label.includes('Revisions')) {
      return (
        <div className="flex items-baseline gap-3">
          <div className="text-3xl lg:text-4xl font-bold flex items-center" style={{ 
            color: 'rgba(255,255,255,0.96)',
            fontVariantNumeric: 'tabular-nums'
          }}>
            {data.upgrades} <TrendingUp className="w-5 h-5 ml-2" style={{ color: '#58E3A4' }} strokeWidth={2.2} />
          </div>
           <div className="text-2xl font-bold" style={{ color: 'rgba(155, 163, 176, 1)' }}>/</div>
           <div className="text-3xl lg:text-4xl font-bold flex items-center" style={{ 
            color: 'rgba(255,255,255,0.96)',
            fontVariantNumeric: 'tabular-nums'
          }}>
            {data.downgrades} <TrendingDown className="w-5 h-5 ml-2" style={{ color: '#FF6A7A' }} strokeWidth={2.2} />
          </div>
        </div>
      );
    }
    if (label.includes('Technical')) {
       return (
        <>
          <div className="text-3xl lg:text-4xl font-bold" style={{ 
            color: 'rgba(255,255,255,0.96)',
            letterSpacing: '-0.02em'
          }}>
            {data.trend}
          </div>
          <div className="text-[14px] font-bold mt-2" style={{ 
            color: 'rgba(255,255,255,0.58)',
            fontVariantNumeric: 'tabular-nums'
          }}>
            {data.confidence}% confidence
          </div>
        </>
      );
    }
    if (label.includes('Sentiment')) {
        return (
            <div className="text-3xl lg:text-4xl font-bold" style={{ 
              color: 'rgba(255,255,255,0.96)',
              letterSpacing: '-0.02em'
            }}>
              Divergence
            </div>
        );
    }
    return <div className="text-3xl lg:text-4xl font-bold" style={{ 
      color: 'rgba(255,255,255,0.96)',
      letterSpacing: '-0.02em',
      fontVariantNumeric: 'tabular-nums'
    }}>
      {value}
    </div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ 
        scale: 1.018, 
        y: -3,
        transition: { duration: 0.18, ease: [0.26, 0.11, 0.26, 1.0] }
      }}
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
        border: isEmphasized 
          ? '1px solid rgba(110, 180, 255, 0.12)' 
          : '1px solid rgba(255,255,255,0.08)',
        boxShadow: isEmphasized
          ? 'inset 0 1px 0 rgba(255,255,255,0.10), 0 4px 16px rgba(0,0,0,0.10)'
          : 'inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 16px rgba(0,0,0,0.08)',
        transition: 'all 0.18s cubic-bezier(0.26, 0.11, 0.26, 1.0)'
      }}
    >
      {/* Top specular */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '16%',
        right: '16%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
        pointerEvents: 'none'
      }} />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex-grow">
          <div className="flex items-center justify-between mb-5">
            <h5 className="font-semibold text-[13px] uppercase tracking-wide" style={{ 
              color: 'rgba(255,255,255,0.62)',
              letterSpacing: '0.04em'
            }}>
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
            <p className="text-[13px] font-medium mt-4 text-center" style={{ 
              color: 'rgba(255,255,255,0.58)',
              lineHeight: 1.5
            }}>
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
            {/* Date Box */}
            <div className="relative flex-shrink-0">
              <div className="w-14 h-14 rounded-[16px] flex flex-col items-center justify-center overflow-hidden" style={{
                background: 'linear-gradient(180deg, rgba(77, 143, 251, 0.14) 0%, rgba(77, 143, 251, 0.10) 100%)',
                border: '1px solid rgba(77, 143, 251, 0.24)',
                backdropFilter: 'blur(12px)'
              }}>
                <span className="text-[11px] uppercase leading-none font-semibold" style={{ 
                  color: 'rgba(77, 143, 251, 1)',
                  opacity: 0.88,
                  letterSpacing: '0.02em'
                }}>
                  {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                </span>
                <span className="text-2xl font-bold leading-tight" style={{ 
                  color: 'rgba(255,255,255,0.96)',
                  fontVariantNumeric: 'tabular-nums'
                }}>
                  {event.day}
                </span>
                {event.daysUntil === 0 && (
                  <span className="absolute bottom-0 w-full text-center text-[9px] uppercase font-bold py-0.5" style={{
                    background: 'rgba(77, 143, 251, 0.30)',
                    color: '#D7E3FF',
                    letterSpacing: '0.03em'
                  }}>
                    Today
                  </span>
                )}
              </div>
            </div>

            <div className="flex-1">
              <p className="text-[16px] font-bold mb-3" style={{ 
                color: 'rgba(255,255,255,0.94)',
                letterSpacing: '-0.01em',
                lineHeight: 1.3
              }}>
                {event.event}
              </p>
              <div className="space-y-2">
                {/* Urgency Timeline */}
                <div className="w-36 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ 
                      background: 'linear-gradient(to right, #FFB464, #FF6A7A)',
                      boxShadow: 'inset 0 0.5px 0 rgba(255,255,255,0.16)'
                    }}
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
              padding: '8px 14px',
              fontSize: '12px',
              fontWeight: 700,
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

            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.18, ease: [0.26, 0.11, 0.26, 1.0] }}
            >
              <ChevronRight className="w-5 h-5" style={{ color: 'rgba(155, 163, 176, 1)' }} strokeWidth={2.0} />
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
          position: 'absolute',
          top: 0,
          left: '16%',
          right: '16%',
          height: '1px',
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
          <h4 className={`text-[15px] ${selectedEmphasis.fontWeight} mb-2`} style={{ 
            color: 'rgba(255,255,255,0.92)',
            letterSpacing: '-0.01em',
            lineHeight: 1.3
          }}>
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


export default function SectorDetailDrawer({ sector, onClose, theme }) {
  const [activeTab, setActiveTab] = useState('drivers');
  const [expandedSections, setExpandedSections] = useState({ themes: false, risks: false });
  const [showBenchmarkTooltip, setShowBenchmarkTooltip] = useState(false);
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
    hidden: { opacity: 0, backdropFilter: 'blur(0px)' },
    visible: { 
      opacity: 1, 
      backdropFilter: 'blur(20px)',
      transition: { duration: 0.28, ease: [0.22, 0.61, 0.36, 1] }
    },
    exit: { 
      opacity: 0, 
      backdropFilter: 'blur(0px)',
      transition: { duration: 0.24, ease: [0.32, 0.08, 0.24, 1] }
    }
  };

  const drawerVariants = {
    hidden: { opacity: 0, scale: 0.94, y: 30 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { 
        type: "spring", 
        stiffness: 320, 
        damping: 35, 
        mass: 0.9 
      } 
    },
    exit: { 
      opacity: 0, 
      scale: 0.96, 
      y: 20, 
      transition: { duration: 0.24, ease: [0.32, 0.08, 0.24, 1] } 
    }
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
          style={{ 
            background: 'rgba(0, 0, 0, 0.72)',
            WebkitBackdropFilter: 'blur(20px)',
            willChange: 'opacity, backdrop-filter'
          }}
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
              boxShadow: `
                inset 0 1.5px 0 rgba(255,255,255,0.10),
                0 24px 64px rgba(0,0,0,0.45)
              `
            }}
          >
            {/* OS Horizon Header */}
            <div className="relative flex-shrink-0" 
                 style={{ 
                   background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.038) 0%, rgba(255, 255, 255, 0.022) 100%)',
                   backdropFilter: 'blur(28px) saturate(165%)',
                   WebkitBackdropFilter: 'blur(28px) saturate(165%)',
                   borderBottom: '1px solid rgba(255,255,255,0.08)',
                   padding: '32px'
                 }}>
              
              {/* Top specular */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: '16%',
                right: '16%',
                height: '1.5px',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent)',
                pointerEvents: 'none'
              }} />

              {/* Soft ambient bloom */}
              <div 
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'radial-gradient(ellipse 65% 35% at 50% 0%, rgba(110, 180, 255, 0.05), transparent 70%)',
                  pointerEvents: 'none'
                }}
              />
              
              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <motion.h3
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
                    className="text-3xl font-bold mb-3"
                    style={{ 
                      color: 'rgba(255,255,255,0.96)',
                      letterSpacing: '-0.02em'
                    }}
                  >
                    {sector.name} Analysis
                  </motion.h3>
                  <div className="flex items-center gap-3">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.88 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1, duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
                      className="flex items-center gap-2.5 rounded-[18px]"
                      style={{
                        padding: '10px 16px',
                        background: sector.change.startsWith('+') 
                          ? 'linear-gradient(180deg, rgba(88, 227, 164, 0.14) 0%, rgba(88, 227, 164, 0.10) 100%)'
                          : 'linear-gradient(180deg, rgba(255, 106, 122, 0.14) 0%, rgba(255, 106, 122, 0.10) 100%)',
                        border: sector.change.startsWith('+') 
                          ? '1px solid rgba(88, 227, 164, 0.24)'
                          : '1px solid rgba(255, 106, 122, 0.24)',
                        backdropFilter: 'blur(12px)',
                        boxShadow: sector.change.startsWith('+')
                          ? 'inset 0 0.5px 0 rgba(88, 227, 164, 0.12)'
                          : 'inset 0 0.5px 0 rgba(255, 106, 122, 0.12)'
                      }}
                    >
                      {sector.change.startsWith('+') ? 
                        <TrendingUp className="w-4 h-4" style={{ color: '#58E3A4' }} strokeWidth={2.2} /> : 
                        <TrendingDown className="w-4 h-4" style={{ color: '#FF6A7A' }} strokeWidth={2.2} />
                      }
                      <span className="text-base font-bold" style={{ 
                        color: sector.change.startsWith('+') ? '#58E3A4' : '#FF6A7A',
                        fontVariantNumeric: 'tabular-nums'
                      }}>
                        {sector.change}
                      </span>
                    </motion.div>
                    <span className="text-[13px] font-medium" style={{ color: 'rgba(255,255,255,0.58)' }}>
                      Today
                    </span>
                  </div>
                  
                  {/* Full Benchmark Name - Educational Layer (Always Visible) */}
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
                    className="mt-3"
                  >
                    <p className="text-[12px] font-medium" style={{ 
                      color: 'rgba(255,255,255,0.42)',
                      letterSpacing: '0.005em',
                      lineHeight: 1.4
                    }}>
                      Tracked via {SECTOR_BENCHMARKS[sector.name] ? 
                        `State Street ${sector.name} Select Sector SPDR ETF (${SECTOR_BENCHMARKS[sector.name]})` : 
                        'N/A'}
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
                  className="rounded-[20px]"
                  style={{ 
                    padding: '12px',
                    width: '44px',
                    height: '44px',
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
            
            {/* OS Horizon Tabs */}
            <div className="px-8 pt-3 pb-5 flex-shrink-0"
                 style={{ 
                   background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.028) 0%, rgba(255, 255, 255, 0.018) 100%)',
                   backdropFilter: 'blur(24px) saturate(165%)',
                   WebkitBackdropFilter: 'blur(24px) saturate(165%)',
                   borderBottom: '1px solid rgba(255,255,255,0.06)'
                 }}>
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
                        background: isActive 
                          ? 'linear-gradient(180deg, rgba(255, 255, 255, 0.082) 0%, rgba(255, 255, 255, 0.062) 100%)'
                          : 'transparent',
                        border: isActive ? '1px solid rgba(255,255,255,0.10)' : '1px solid transparent',
                        boxShadow: isActive 
                          ? 'inset 0 1px 0 rgba(255,255,255,0.08), 0 2px 8px rgba(0,0,0,0.06)'
                          : 'none'
                      }}
                      whileHover={!isActive ? {
                        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.048) 0%, rgba(255, 255, 255, 0.032) 100%)',
                        transition: { duration: 0.16 }
                      } : {}}
                      whileTap={{ scale: 0.97, transition: { duration: 0.10 } }}
                    >
                      {isActive && (
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: '16%',
                          right: '16%',
                          height: '1px',
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)',
                          pointerEvents: 'none'
                        }} />
                      )}
                      <Icon className="w-4 h-4" style={{ 
                        color: isActive ? 'rgba(215, 227, 255, 1)' : 'rgba(155, 163, 176, 1)',
                        strokeWidth: 2.0
                      }} />
                      <span className="text-[14px] font-semibold" style={{ 
                        color: isActive ? 'rgba(255,255,255,0.96)' : 'rgba(255,255,255,0.62)',
                        letterSpacing: '-0.005em'
                      }}>
                        {tab.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
            
            <div className="p-8 pt-7 flex-1 overflow-y-auto min-h-0 relative">
              {/* Material Unification Layer — Technology Analysis ONLY */}
              {sector.name === 'Technology' && (
                <motion.div
                  className="absolute inset-0 rounded-[24px] pointer-events-none"
                  style={{
                    background: 'rgba(18, 22, 30, 0.35)',
                    backdropFilter: 'blur(18px) saturate(140%)',
                    WebkitBackdropFilter: 'blur(18px) saturate(140%)',
                    maskImage: 'radial-gradient(ellipse at center, black 60%, transparent 100%)',
                    WebkitMaskImage: 'radial-gradient(ellipse at center, black 60%, transparent 100%)'
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
                />
              )}

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.20, ease: [0.26, 0.11, 0.26, 1.0] }}
                  className="relative z-10"
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