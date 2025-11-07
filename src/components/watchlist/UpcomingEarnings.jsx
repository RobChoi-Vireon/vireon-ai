
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Zap, TrendingUp, Star, Sparkles, Clock, Target, ArrowRight, Download, Bell, Plus, BarChart3 } from 'lucide-react';
import { addDays, format, startOfToday, isSameDay } from 'date-fns';

import EarningsFilters from './EarningsFilters';
import EarningsCard from './EarningsCard';
import { Skeleton } from '@/components/ui/skeleton';
import { generateICS } from '../lib/calendar.js';
import DetailedEarningsModal from './DetailedEarningsModal'; // Added import for the new modal

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

// Next-Gen Skeleton Loader
const NextGenSkeletonLoader = ({ theme }) => (
  <div className="space-y-10">
    {[...Array(2)].map((_, i) => (
      <motion.div 
        key={i}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: i * 0.1 }}
        className="relative"
      >
        {/* Date header skeleton */}
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="w-12 h-12 rounded-2xl bg-white/5" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-32 rounded-lg bg-white/5" />
            <Skeleton className="h-4 w-48 rounded-md bg-white/5" />
          </div>
        </div>

        {/* Event cards skeleton */}
        <div className="space-y-4">
          {[...Array(2)].map((_, j) => (
            <Skeleton key={j} className="h-36 w-full rounded-3xl bg-white/5" />
          ))}
        </div>
      </motion.div>
    ))}
  </div>
);

// Next-Gen Statistics Component
const NextGenStatsBar = ({ stats, theme }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
    className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12"
  >
    <StatBox icon={Target} label="Total Events" value={stats.totalEvents} accentColor="text-blue-400" />
    <StatBox icon={Star} label="Critical Importance" value={stats.criticalEvents} accentColor="text-red-400" />
    <StatBox icon={TrendingUp} label="Likely Beat" value={stats.beatExpected} accentColor="text-green-400" />
    <StatBox icon={Zap} label="Avg Options Vol" value={`${Math.round(stats.avgOptionsVolume)}K`} accentColor="text-purple-400" />
  </motion.div>
);

const StatBox = ({ icon: Icon, label, value, accentColor }) => (
  <div className="relative p-5 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-400 mb-2">{label}</p>
        <p className="text-3xl font-black tracking-tighter text-white">{value}</p>
      </div>
      <Icon className={`w-6 h-6 ${accentColor}`} strokeWidth={2} />
    </div>
  </div>
);

// Next-Gen Date Header
const NextGenDateHeader = ({ dateStr, eventsCount, theme, index }) => (
  <motion.div 
    className="flex items-center gap-4 mb-6"
    initial={{ opacity: 0, x: -30 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
  >
    <div className="w-12 h-12 flex-shrink-0 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center">
      <p className="text-2xl font-black text-white">{format(new Date(dateStr), 'd')}</p>
    </div>
    <div>
      <p className="text-xl font-bold text-white">{format(new Date(dateStr), 'EEEE')}</p>
      <p className="text-sm text-gray-400">{format(new Date(dateStr), 'MMMM yyyy')} • {eventsCount} events</p>
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
    if (isLoading) return <NextGenSkeletonLoader theme={theme} />;
    
    if (error) return (
      <motion.div 
        className="text-center py-20"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${theme === 'dark' ? 'bg-red-500/20 border border-red-500/30' : 'bg-red-100 border border-red-200'}`}>
          <TrendingUp className={`w-10 h-10 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`} strokeWidth={2} />
        </div>
        <p className={`text-xl font-bold mb-3 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-6 py-3 rounded-xl text-sm font-bold text-blue-500 hover:text-blue-400 transition-colors border border-blue-500/30 hover:border-blue-500/50 backdrop-blur-sm"
        >
          Try Again
        </button>
      </motion.div>
    );
    
    if (Object.keys(groupedEvents).length === 0) return (
      <motion.div 
        className="text-center py-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-2xl border ${theme === 'dark' ? 'bg-white/[0.08] border-white/20' : 'bg-gray-100 border-gray-200'}`}>
          <Calendar className={`w-10 h-10 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} strokeWidth={2} />
        </div>
        <p className={`text-2xl font-black mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          No Earnings Found
        </p>
        <p className={`text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          Try adjusting your filters or timeframe
        </p>
      </motion.div>
    );

    return (
      <div className="space-y-12">
        <NextGenStatsBar stats={summaryStats} theme={theme} />

        <AnimatePresence>
          {Object.entries(groupedEvents).map(([dateStr, eventsInDay], index) => (
            <motion.div key={dateStr} className="space-y-6">
              <NextGenDateHeader 
                dateStr={dateStr} 
                eventsCount={eventsInDay.length} 
                theme={theme} 
                index={index} 
              />
              
              <div className="space-y-4">
                {eventsInDay.map((event, eventIndex) => (
                  <EarningsCard 
                    key={event.id} 
                    event={event} 
                    theme={theme} 
                    onAddToCalendar={handleAddToCalendar}
                    onShowDetails={handleShowDetails} // Passed the new handler
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
        className="relative overflow-hidden rounded-3xl mt-12 p-8 md:p-12 border border-white/10"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(12, 74, 110, 0.2), transparent), linear-gradient(180deg, #0B0D10 0%, #0A0C0F 100%)',
        }}
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Dynamic background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div 
            className="absolute top-12 right-16 w-64 h-64 rounded-full opacity-[0.02] blur-3xl"
            style={{ background: 'linear-gradient(45deg, #3B82F6, #8B5CF6)' }}
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 20, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          />
          <motion.div 
            className="absolute bottom-12 left-16 w-48 h-48 rounded-full opacity-[0.03] blur-2xl"
            style={{ background: 'linear-gradient(45deg, #10B981, #059669)' }}
            animate={{ 
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0]
            }}
            transition={{ 
              duration: 15, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
        </div>

        {/* Next-Gen Header */}
        <motion.div 
          className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center space-x-5">
            <motion.div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-white/10 to-white/5 border border-white/10 shadow-lg"
              whileHover={{ scale: 1.1, rotate: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <BarChart3 className="w-8 h-8 text-blue-400" strokeWidth={2} />
            </motion.div>
            <div>
              <h2 className="text-4xl font-black tracking-[-0.03em] text-white">
                Earnings Calendar
              </h2>
              <p className="text-lg text-gray-400">
                Key financial events on your horizon.
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-3">
            <motion.button 
              className={`
                flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-sm
                transition-all duration-300 backdrop-blur-sm border hover:scale-105
                ${theme === 'dark' 
                  ? 'bg-white/[0.08] hover:bg-white/[0.12] text-gray-300 border-white/10 hover:border-white/20' 
                  : 'bg-black/[0.04] hover:bg-black/[0.08] text-gray-600 border-black/10 hover:border-black/20'
                }
                shadow-lg hover:shadow-xl
              `}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download className="w-4 h-4" strokeWidth={2} />
              <span>Export</span>
            </motion.button>
            
            <motion.button 
              className="flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300"
              whileHover={{ y: -2, scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Bell className="w-4 h-4" strokeWidth={2} />
              <span>Set Alerts</span>
            </motion.button>
          </div>
        </motion.div>
        
        <EarningsFilters filters={filters} setFilters={setFilters} theme={theme} />
        
        <motion.div 
          className="mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {renderContent()}
        </motion.div>

        {/* Floating sparkles effect */}
        <motion.div 
          className="absolute top-8 left-8 text-yellow-400/30"
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          <Sparkles className="w-6 h-6" />
        </motion.div>
        
        <motion.div 
          className="absolute bottom-8 right-8 text-blue-400/30"
          animate={{ 
            rotate: [360, 0],
            scale: [1.2, 1, 1.2]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          <Star className="w-5 h-5" />
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
