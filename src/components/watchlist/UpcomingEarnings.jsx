import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Zap, TrendingUp, Star, Sparkles, Clock, Target, ArrowRight, Download, Bell, Plus, BarChart3 } from 'lucide-react';
import { addDays, format, startOfToday, isSameDay } from 'date-fns';

import EarningsFilters from './EarningsFilters';
import EarningsCard from './EarningsCard';
import { Skeleton } from '@/components/ui/skeleton';
import { generateICS } from '@/components/lib/calendar';
import DetailedEarningsModal from './DetailedEarningsModal';

// ============================================================================
// OS HORIZON LIQUID GLASS TAHOE — DESIGN SYSTEM
// ============================================================================
const GLASS = {
  container: {
    bg: 'rgba(18, 24, 38, 0.48)',
    blur: 'blur(40px)',
    radius: '32px',
    border: 'rgba(255, 255, 255, 0.10)',
    innerGlow: 'inset 0 0 50px rgba(255,255,255,0.02)',
    innerShadow: 'inset 0 0 35px rgba(0,0,0,0.18)'
  },
  stat: {
    bg: 'rgba(255, 255, 255, 0.05)',
    blur: 'blur(28px)',
    border: 'rgba(255, 255, 255, 0.10)',
    innerShadow: 'inset 0 0 20px rgba(255,255,255,0.04)'
  },
  button: {
    bg: 'rgba(255, 255, 255, 0.08)',
    bgHover: 'rgba(255, 255, 255, 0.14)',
    blur: 'blur(24px)',
    border: 'rgba(255, 255, 255, 0.14)',
    innerShadow: 'inset 0 0 14px rgba(255,255,255,0.06)'
  }
};

const mockEarningsEvents = [
  { 
    id: 1, 
    date: new Date(), 
    ticker: 'NVDA', 
    name: 'NVIDIA Corp.', 
    time: 'AMC', 
    estimate: '$5.65', 
    marketCap: '2.1T',
    sector: 'Technology',
    importance: 'High',
    consensus: 'Beat Expected',
    preMarketMove: '+2.3%',
    optionsVolume: '387K',
    analystRating: 'Strong Buy',
    notes: 'Key AI infrastructure provider. Strong demand for H100 GPUs. Expecting significant guidance for Q3.',
    analystPriceTarget: '$1000',
    epsSurpriseHistory: [
      { quarter: 'Q1 2024', surprise: '+12%', actual: '$5.65', estimate: '$5.04' },
      { quarter: 'Q4 2023', surprise: '+18%', actual: '$4.93', estimate: '$4.18' },
    ],
    riskFactors: ['Geopolitical tensions', 'Supply chain disruptions', 'Competition from AMD/Intel']
  },
  { 
    id: 2, 
    date: addDays(new Date(), 1), 
    ticker: 'AAPL', 
    name: 'Apple Inc.', 
    time: 'BMO', 
    estimate: '$2.35', 
    marketCap: '2.8T',
    sector: 'Technology',
    importance: 'Critical',
    consensus: 'Beat Expected',
    preMarketMove: '+1.1%',
    optionsVolume: '542K',
    analystRating: 'Buy',
    notes: 'iPhone sales remain strong. Services growth is key. Watch for guidance on China market.',
    analystPriceTarget: '$220',
    epsSurpriseHistory: [
      { quarter: 'Q1 2024', surprise: '+5%', actual: '$2.35', estimate: '$2.24' },
      { quarter: 'Q4 2023', surprise: '+8%', actual: '$2.18', estimate: '$2.02' },
    ],
    riskFactors: ['Regulatory scrutiny', 'Supply chain in Asia', 'Slowing iPhone demand']
  },
  { 
    id: 3, 
    date: addDays(new Date(), 1), 
    ticker: 'MSFT', 
    name: 'Microsoft Corp.', 
    time: 'BMO', 
    estimate: '$3.10', 
    marketCap: '3.1T',
    sector: 'Technology',
    importance: 'High',
    consensus: 'Beat Expected',
    preMarketMove: '+0.8%',
    optionsVolume: '298K',
    analystRating: 'Strong Buy',
    notes: 'Azure cloud growth is primary driver. Copilot adoption. LinkedIn performance.',
    analystPriceTarget: '$450',
    epsSurpriseHistory: [
      { quarter: 'Q1 2024', surprise: '+7%', actual: '$3.10', estimate: '$2.90' },
      { quarter: 'Q4 2023', surprise: '+10%', actual: '$2.93', estimate: '$2.66' },
    ],
    riskFactors: ['Cloud competition', 'Economic slowdown affecting enterprise IT spending']
  },
  { 
    id: 4, 
    date: addDays(new Date(), 2), 
    ticker: 'TSLA', 
    name: 'Tesla Inc.', 
    time: 'AMC', 
    estimate: '$0.95', 
    marketCap: '800B',
    sector: 'Consumer Discretionary',
    importance: 'High',
    consensus: 'Mixed Views',
    preMarketMove: '-0.5%',
    optionsVolume: '756K',
    analystRating: 'Hold',
    notes: 'Production numbers and delivery guidance are crucial. Margins and FSD updates.',
    analystPriceTarget: '$180',
    epsSurpriseHistory: [
      { quarter: 'Q1 2024', surprise: '-3%', actual: '$0.95', estimate: '$0.98' },
      { quarter: 'Q4 2023', surprise: '+2%', actual: '$0.71', estimate: '$0.69' },
    ],
    riskFactors: ['Increased EV competition', 'Demand fluctuations', 'Elon Musk related news']
  },
  { 
    id: 5, 
    date: addDays(new Date(), 5), 
    ticker: 'GOOGL', 
    name: 'Alphabet Inc.', 
    time: 'AMC', 
    estimate: '$1.80', 
    marketCap: '1.9T',
    sector: 'Technology',
    importance: 'High',
    consensus: 'Beat Expected',
    preMarketMove: '+1.4%',
    optionsVolume: '201K',
    analystRating: 'Buy',
    notes: 'Advertising revenue stability. Google Cloud profitability. AI development updates.',
    analystPriceTarget: '$185',
    epsSurpriseHistory: [
      { quarter: 'Q1 2024', surprise: '+9%', actual: '$1.80', estimate: '$1.65' },
      { quarter: 'Q4 2023', surprise: '+11%', actual: '$1.74', estimate: '$1.57' },
    ],
    riskFactors: ['Ad market volatility', 'Antitrust concerns', 'AI competition']
  },
  { 
    id: 6, 
    date: addDays(new Date(), 6), 
    ticker: 'DIS', 
    name: 'Walt Disney Co.', 
    time: 'AMC', 
    estimate: '$1.19', 
    marketCap: '220B',
    sector: 'Communication Services',
    importance: 'Medium',
    consensus: 'Mixed Views',
    preMarketMove: '+0.2%',
    optionsVolume: '134K',
    analystRating: 'Hold',
    notes: 'Streaming subscriber growth/profitability. Parks performance. Box office results.',
    analystPriceTarget: '$120',
    epsSurpriseHistory: [
      { quarter: 'Q1 2024', surprise: '+1%', actual: '$1.19', estimate: '$1.18' },
      { quarter: 'Q4 2023', surprise: '+5%', actual: '$1.07', estimate: '$1.02' },
    ],
    riskFactors: ['Streaming competition', 'Macroeconomic impact on parks', 'Content costs']
  },
  { 
    id: 7, 
    date: addDays(new Date(), 8), 
    ticker: 'AMZN', 
    name: 'Amazon.com, Inc.', 
    time: 'BMO', 
    estimate: '$1.05', 
    marketCap: '1.8T',
    sector: 'Consumer Discretionary',
    importance: 'Critical',
    consensus: 'Beat Expected',
    preMarketMove: '+1.8%',
    optionsVolume: '445K',
    analystRating: 'Strong Buy',
    notes: 'AWS cloud growth. E-commerce profitability. Advertising business performance.',
    analystPriceTarget: '$200',
    epsSurpriseHistory: [
      { quarter: 'Q1 2024', surprise: '+15%', actual: '$1.05', estimate: '$0.91' },
      { quarter: 'Q4 2023', surprise: '+20%', actual: '$0.98', estimate: '$0.82' },
    ],
    riskFactors: ['Regulatory pressure', 'Labor costs', 'Economic downturn impacting consumer spending']
  },
  { 
    id: 10, 
    date: addDays(new Date(), -1), 
    ticker: 'PYPL', 
    name: 'PayPal Holdings', 
    time: 'AMC', 
    estimate: '$1.22', 
    marketCap: '70B',
    sector: 'Financial Services',
    importance: 'Medium',
    consensus: 'Beat Expected',
    preMarketMove: '+0.9%',
    optionsVolume: '89K',
    analystRating: 'Buy',
    notes: 'Active accounts growth and engagement. New product initiatives. Competition from other fintechs.',
    analystPriceTarget: '$70',
    epsSurpriseHistory: [
      { quarter: 'Q1 2024', surprise: '+8%', actual: '$1.22', estimate: '$1.13' },
      { quarter: 'Q4 2023', surprise: '+10%', actual: '$1.08', estimate: '$0.98' },
    ],
    riskFactors: ['Competition in payments', 'Macroeconomic impact on consumer spending']
  },
];

// ============================================================================
// GLASS SKELETON LOADER
// ============================================================================
const GlassSkeletonLoader = () => (
  <div className="space-y-8">
    {[...Array(2)].map((_, i) => (
      <motion.div 
        key={i}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: i * 0.08 }}
      >
        <div className="flex items-center gap-4 mb-5">
          <div 
            className="w-11 h-11 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
          />
          <div className="space-y-2">
            <div className="h-5 w-28 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }} />
            <div className="h-3.5 w-40 rounded-md" style={{ background: 'rgba(255,255,255,0.04)' }} />
          </div>
        </div>
        <div className="space-y-3">
          {[...Array(2)].map((_, j) => (
            <div 
              key={j} 
              className="h-28 w-full rounded-2xl"
              style={{ 
                background: 'rgba(18, 24, 38, 0.40)',
                border: '1px solid rgba(255,255,255,0.06)'
              }}
            />
          ))}
        </div>
      </motion.div>
    ))}
  </div>
);

// ============================================================================
// GLASS STAT BOX
// ============================================================================
const GlassStatBox = ({ icon: Icon, label, value, accentColor, accentRgb, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div 
      className="relative overflow-hidden"
      style={{
        padding: '20px',
        background: GLASS.stat.bg,
        backdropFilter: GLASS.stat.blur,
        WebkitBackdropFilter: GLASS.stat.blur,
        borderRadius: '20px',
        border: `1px solid ${GLASS.stat.border}`,
        boxShadow: GLASS.stat.innerShadow
      }}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 + index * 0.06, ease: [0.22, 0.61, 0.36, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top highlight */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '20%',
        right: '20%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)',
        pointerEvents: 'none'
      }} />
      
      {/* Hover glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 30%, rgba(${accentRgb}, 0.08) 0%, transparent 70%)`,
          borderRadius: '20px'
        }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
      
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p 
            className="text-xs font-medium uppercase tracking-wide mb-2"
            style={{ color: 'rgba(200, 210, 230, 0.60)' }}
          >
            {label}
          </p>
          <p 
            className="text-2xl font-bold tracking-tight"
            style={{ color: 'rgba(255,255,255,0.95)' }}
          >
            {value}
          </p>
        </div>
        <div 
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{
            background: `rgba(${accentRgb}, 0.12)`,
            boxShadow: `inset 0 0 12px rgba(${accentRgb}, 0.08)`
          }}
        >
          <Icon className="w-4 h-4" style={{ color: accentColor }} strokeWidth={2} />
        </div>
      </div>
    </motion.div>
  );
};

// ============================================================================
// GLASS STATS BAR
// ============================================================================
const GlassStatsBar = ({ stats }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
    <GlassStatBox icon={Target} label="Total Events" value={stats.totalEvents} accentColor="#6BA3FF" accentRgb="107, 163, 255" index={0} />
    <GlassStatBox icon={Star} label="Critical" value={stats.criticalEvents} accentColor="#FF7A8A" accentRgb="255, 122, 138" index={1} />
    <GlassStatBox icon={TrendingUp} label="Likely Beat" value={stats.beatExpected} accentColor="#58E3A4" accentRgb="88, 227, 164" index={2} />
    <GlassStatBox icon={Zap} label="Avg Options Vol" value={`${Math.round(stats.avgOptionsVolume)}K`} accentColor="#B68AE8" accentRgb="182, 138, 232" index={3} />
  </div>
);

// ============================================================================
// GLASS DATE HEADER
// ============================================================================
const GlassDateHeader = ({ dateStr, eventsCount, index }) => (
  <motion.div 
    className="flex items-center gap-4 mb-5"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 0.61, 0.36, 1] }}
  >
    <div 
      className="w-11 h-11 flex-shrink-0 rounded-2xl flex items-center justify-center"
      style={{
        background: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow: 'inset 0 0 14px rgba(255,255,255,0.04)'
      }}
    >
      <p 
        className="text-lg font-bold"
        style={{ color: 'rgba(255,255,255,0.95)' }}
      >
        {format(new Date(dateStr), 'd')}
      </p>
    </div>
    <div>
      <p 
        className="text-base font-semibold"
        style={{ color: 'rgba(255,255,255,0.92)' }}
      >
        {format(new Date(dateStr), 'EEEE')}
      </p>
      <p 
        className="text-sm"
        style={{ color: 'rgba(200, 210, 230, 0.55)' }}
      >
        {format(new Date(dateStr), 'MMMM yyyy')} • {eventsCount} event{eventsCount > 1 ? 's' : ''}
      </p>
    </div>
  </motion.div>
);

export default function UpcomingEarnings({ watchlistTickers, theme }) {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: 'Upcoming',
    timeframe: '14d',
    sortBy: 'date',
  });

  // New state for detailed modal
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Enhanced loading simulation with realistic timing
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Simulate realistic API loading
        await new Promise(res => setTimeout(res, 800));
        setEvents(mockEarningsEvents);
      } catch (e) {
        setError("Unable to load earnings data. Please try again.");
        console.error(e);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [watchlistTickers]);
  
  const handleAddToCalendar = (event) => {
    const icsUrl = generateICS(event);
    const link = document.createElement('a');
    link.href = icsUrl;
    link.download = `${event.ticker}_earnings.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShowDetails = (event) => {
    setSelectedEvent(event);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailModalOpen(false);
    // Give time for modal exit animation before clearing data
    setTimeout(() => setSelectedEvent(null), 300); 
  };

  const filteredAndSortedEvents = useMemo(() => {
    let today = startOfToday();
    let processedEvents = [...events];

    // Filter by category
    switch (filters.category) {
      case 'Today':
        processedEvents = processedEvents.filter(e => isSameDay(e.date, today));
        break;
      case 'Past':
        processedEvents = processedEvents.filter(e => e.date < today);
        break;
      case 'My Watchlist':
        processedEvents = processedEvents.filter(e => watchlistTickers.includes(e.ticker));
        break;
      case 'Upcoming':
      default:
        processedEvents = processedEvents.filter(e => e.date >= today);
        break;
    }

    // Filter by timeframe for upcoming
    if (filters.category === 'Upcoming') {
      let endDate;
      if (filters.timeframe === '7d') endDate = addDays(today, 7);
      else if (filters.timeframe === '30d') endDate = addDays(today, 30);
      else if (filters.timeframe === 'quarter') endDate = addDays(today, 90);
      else endDate = addDays(today, 14); // default 14d
      processedEvents = processedEvents.filter(e => e.date <= endDate);
    }
    
    // Sort
    processedEvents.sort((a, b) => {
      switch (filters.sortBy) {
        case 'marketCap':
          // Extract numeric value from marketCap string (e.g., '2.1T' -> 2100, '800B' -> 0.8)
          const parseMarketCap = (capStr) => {
            if (capStr.endsWith('T')) {
              return parseFloat(capStr.replace('T', '')) * 1000; // Convert T to B for comparison
            } else if (capStr.endsWith('B')) {
              return parseFloat(capStr.replace('B', ''));
            }
            return parseFloat(capStr);
          };
          const capA = parseMarketCap(a.marketCap);
          const capB = parseMarketCap(b.marketCap);
          return capB - capA; // Sort descending
        case 'ticker':
          return a.ticker.localeCompare(b.ticker);
        case 'date':
        default:
          return filters.category === 'Past' ? b.date - a.date : a.date - b.date;
      }
    });

    return processedEvents;
  }, [events, filters, watchlistTickers]);

  const groupedEvents = useMemo(() => {
    return filteredAndSortedEvents.reduce((acc, event) => {
      const dateStr = format(event.date, 'yyyy-MM-dd');
      if (!acc[dateStr]) {
        acc[dateStr] = [];
      }
      acc[dateStr].push(event);
      return acc;
    }, {});
  }, [filteredAndSortedEvents]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const totalEvents = filteredAndSortedEvents.length;
    const criticalEvents = filteredAndSortedEvents.filter(e => e.importance === 'Critical').length;
    const beatExpected = filteredAndSortedEvents.filter(e => e.consensus === 'Beat Expected').length;
    const avgOptionsVolume = totalEvents > 0 ? filteredAndSortedEvents.reduce((acc, e) => acc + parseFloat(e.optionsVolume.replace('K', '')), 0) / totalEvents : 0;
    
    return { totalEvents, criticalEvents, beatExpected, avgOptionsVolume };
  }, [filteredAndSortedEvents]);

  const renderContent = () => {
    if (isLoading) return <GlassSkeletonLoader />;
    
    if (error) return (
      <motion.div 
        className="text-center py-16"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div 
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{
            background: 'rgba(255, 100, 120, 0.12)',
            border: '1px solid rgba(255, 100, 120, 0.20)'
          }}
        >
          <TrendingUp className="w-7 h-7" style={{ color: '#FF7A8A' }} strokeWidth={2} />
        </div>
        <p className="text-lg font-semibold mb-3" style={{ color: '#FF7A8A' }}>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: 'rgba(200, 210, 230, 0.85)'
          }}
        >
          Try Again
        </button>
      </motion.div>
    );
    
    if (Object.keys(groupedEvents).length === 0) return (
      <motion.div 
        className="text-center py-16"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div 
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.10)'
          }}
        >
          <Calendar className="w-7 h-7" style={{ color: 'rgba(200, 210, 230, 0.55)' }} strokeWidth={2} />
        </div>
        <p className="text-xl font-bold mb-2" style={{ color: 'rgba(255,255,255,0.92)' }}>
          No Earnings Found
        </p>
        <p className="text-sm" style={{ color: 'rgba(200, 210, 230, 0.55)' }}>
          Try adjusting your filters or timeframe
        </p>
      </motion.div>
    );

    return (
      <div className="space-y-10">
        <GlassStatsBar stats={summaryStats} />

        <AnimatePresence>
          {Object.entries(groupedEvents).map(([dateStr, eventsInDay], index) => (
            <motion.div key={dateStr} className="space-y-4">
              <GlassDateHeader 
                dateStr={dateStr} 
                eventsCount={eventsInDay.length} 
                index={index} 
              />
              
              <div className="space-y-3">
                {eventsInDay.map((event) => (
                  <EarningsCard 
                    key={event.id} 
                    event={event} 
                    theme={theme} 
                    onAddToCalendar={handleAddToCalendar}
                    onShowDetails={handleShowDetails}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <>
      <motion.div 
        className="relative overflow-hidden mt-10"
        style={{
          padding: '32px',
          background: GLASS.container.bg,
          backdropFilter: GLASS.container.blur,
          WebkitBackdropFilter: GLASS.container.blur,
          borderRadius: GLASS.container.radius,
          border: `1px solid ${GLASS.container.border}`,
          boxShadow: `${GLASS.container.innerGlow}, ${GLASS.container.innerShadow}, 0 25px 50px -15px rgba(0,0,0,0.35)`
        }}
        initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
      >
        {/* Gradient border overlay */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            borderRadius: GLASS.container.radius,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%, rgba(255,255,255,0.02) 100%)',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            padding: '1px'
          }}
        />
        
        {/* Top specular highlight */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '12%',
          right: '12%',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)',
          pointerEvents: 'none'
        }} />

        {/* Subtle bokeh */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ borderRadius: GLASS.container.radius }}>
          <div
            className="absolute rounded-full"
            style={{
              top: '-10%',
              right: '5%',
              width: '300px',
              height: '300px',
              background: 'radial-gradient(circle, rgba(100, 140, 220, 0.06) 0%, transparent 70%)',
              filter: 'blur(60px)'
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              bottom: '-5%',
              left: '10%',
              width: '250px',
              height: '250px',
              background: 'radial-gradient(circle, rgba(88, 227, 164, 0.04) 0%, transparent 70%)',
              filter: 'blur(50px)'
            }}
          />
        </div>

        {/* Header */}
        <motion.div 
          className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-5 relative z-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 0.61, 0.36, 1] }}
        >
          <div className="flex items-center gap-4">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{
                background: 'rgba(107, 163, 255, 0.12)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(107, 163, 255, 0.18)',
                boxShadow: 'inset 0 0 16px rgba(107, 163, 255, 0.08)'
              }}
            >
              <BarChart3 className="w-5 h-5" style={{ color: '#6BA3FF' }} strokeWidth={2} />
            </div>
            <div>
              <h2 
                className="text-2xl font-bold tracking-[-0.02em]"
                style={{ color: 'rgba(255,255,255,0.95)' }}
              >
                Earnings Calendar
              </h2>
              <p 
                className="text-sm"
                style={{ color: 'rgba(200, 210, 230, 0.60)' }}
              >
                Key financial events on your horizon
              </p>
            </div>
          </div>

          {/* Action buttons — Glass style */}
          <div className="flex items-center gap-2.5">
            <motion.button 
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold"
              style={{
                background: GLASS.button.bg,
                backdropFilter: GLASS.button.blur,
                WebkitBackdropFilter: GLASS.button.blur,
                border: `1px solid ${GLASS.button.border}`,
                color: 'rgba(200, 210, 230, 0.85)',
                boxShadow: GLASS.button.innerShadow
              }}
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
            >
              <Download className="w-4 h-4" strokeWidth={2} />
              <span>Export</span>
            </motion.button>
            
            <motion.button 
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold"
              style={{
                background: 'linear-gradient(135deg, rgba(99, 140, 255, 0.50) 0%, rgba(130, 100, 255, 0.42) 100%)',
                backdropFilter: GLASS.button.blur,
                WebkitBackdropFilter: GLASS.button.blur,
                border: '1px solid rgba(140, 170, 255, 0.30)',
                color: 'rgba(255,255,255,0.98)',
                boxShadow: `${GLASS.button.innerShadow}, 0 0 24px rgba(99, 140, 255, 0.22)`
              }}
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
            >
              <Bell className="w-4 h-4" strokeWidth={2} />
              <span>Set Alerts</span>
            </motion.button>
          </div>
        </motion.div>
        
        <div className="relative z-10">
          <EarningsFilters filters={filters} setFilters={setFilters} theme={theme} />
        </div>
        
        <motion.div 
          className="mt-10 relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {renderContent()}
        </motion.div>
      </motion.div>

      {/* Detailed Analysis Modal */}
      <DetailedEarningsModal
        event={selectedEvent}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetails}
        theme={theme}
      />
    </>
  );
}