
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, Calendar as CalendarIcon, Zap, TrendingUp, TrendingDown, Info, Shield, Target, Users, CheckCircle, XCircle, MinusCircle, HelpCircle, ChevronsRight, Newspaper, MessageSquare, BarChart, ExternalLink, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { format as formatDate } from 'date-fns';

// --- Helper Functions ---
const formatCurrency = (value) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}\u202fB`; // Thin non-breaking space
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}\u202fM`;
    return `$${value}`;
};

const formatFiscalPeriod = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const quarter = Math.floor(d.getMonth() / 3) + 1;
    const year = d.getFullYear().toString().slice(-2);
    return `FQ${quarter} ’${year}`;
};

// --- Polished Micro-Components ---

const RadialGauge = ({ value, peerMedian }) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const progress = (value / 100) * circumference;
    const shouldReduceMotion = useReducedMotion();

    let color = value > 75 ? "url(#gauge-hot)" : value > 25 ? "url(#gauge-neutral)" : "url(#gauge-cool)";

    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center">
            {/* Main gauge container with proper spacing */}
            <div className="relative w-40 h-40 flex items-center justify-center mb-3">
                <svg className="absolute inset-0" viewBox="0 0 120 120">
                    <defs>
                        <linearGradient id="gauge-hot"><stop stopColor="#EF4444" /><stop offset="1" stopColor="#F97316" /></linearGradient>
                        <linearGradient id="gauge-neutral"><stop stopColor="#F59E0B" /><stop offset="1" stopColor="#EAB308" /></linearGradient>
                        <linearGradient id="gauge-cool"><stop stopColor="#3B82F6" /><stop offset="1" stopColor="#60A5FA" /></linearGradient>
                    </defs>
                    <circle cx="60" cy="60" r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth="8" fill="none" />
                    {/* Banding */}
                    <circle cx="60" cy="60" r={radius} stroke="#3B82F6" opacity="0.3" strokeWidth="8" fill="none" strokeDasharray={`0, ${circumference * 0.25}, ${circumference * 0.75}`} />
                    <circle cx="60" cy="60" r={radius} stroke="#F59E0B" opacity="0.3" strokeWidth="8" fill="none" strokeDasharray={`0, ${circumference * 0.25}, ${circumference * 0.5}, ${circumference * 0.25}`} transform="rotate(90 60 60)" />
                    <circle cx="60" cy="60" r={radius} stroke="#EF4444" opacity="0.3" strokeWidth="8" fill="none" strokeDasharray={`0, ${circumference * 0.75}, ${circumference * 0.25}`} transform="rotate(270 60 60)" />
                    
                    <motion.circle
                        cx="60" cy="60" r={radius} stroke={color} strokeWidth="8" fill="none"
                        strokeDasharray={circumference} strokeLinecap="round" transform="rotate(-90 60 60)"
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: circumference - progress }}
                        transition={{ duration: shouldReduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
                    />
                    {peerMedian && (
                        <motion.g initial={{ rotate: -90 }} animate={{ rotate: -90 + (peerMedian / 100) * 360 }} transition={{ duration: shouldReduceMotion ? 0 : 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}>
                            <path d="M 60 5 L 57 10 L 63 10 Z" fill="rgba(255,255,255,0.9)" />
                        </motion.g>
                    )}
                </svg>
                <div className="text-center">
                    <motion.p className="text-4xl font-black text-white" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>{value}</motion.p>
                    <p className="text-xs font-semibold text-gray-400">IV Rank</p>
                </div>
            </div>
            {/* Improved peer median caption */}
            {peerMedian && (
                <div className="px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10">
                    <p className="text-xs font-medium text-gray-200 text-center">
                        Peer median: <span className="text-white font-semibold">{peerMedian}</span>
                    </p>
                </div>
            )}
        </div>
    );
};

const BeatMissHistory = ({ history }) => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    if (!history || history.length < 2) {
        return (
             <div className="flex-1 flex flex-col items-center justify-center p-6 rounded-2xl bg-white/[0.03] border border-white/10 h-full text-gray-500">
                <Info className="w-6 h-6 mb-2" />
                <h3 className="text-lg font-semibold text-white mb-1">Beat/Miss History</h3>
                <p className="text-xs">Insufficient history</p>
            </div>
        );
    }

    const chartData = history.slice(0, 8).map(h => ({ name: formatFiscalPeriod(h.date), surprise: parseFloat(h.surprise) || 0 }));
    const lastThree = chartData.slice(-3).map(d => d.surprise);
    const trend = lastThree.length === 3 && (lastThree.every(s => s > 0) ? 'up' : lastThree.every(s => s < 0) ? 'down' : null);

    return (
        <div className="relative h-full flex flex-col justify-between p-6 rounded-2xl bg-white/[0.03] border border-white/10">
            <div>
                <h3 className="text-lg font-semibold text-white mb-2">Beat/Miss History</h3>
                <p className="text-xs text-gray-400">Last {chartData.length} quarters</p>
            </div>
            <div className="relative w-full h-16 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 20, right: 10, left: 10, bottom: 0 }}>
                        <defs>
                            <linearGradient id="surpriseGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="rgba(139, 92, 246, 0.2)" stopOpacity={0.8}/><stop offset="95%" stopColor="rgba(139, 92, 246, 0)" stopOpacity={0}/></linearGradient>
                        </defs>
                        <RechartsTooltip content={() => null} />
                        <Area type="monotone" dataKey="surprise" stroke="rgba(139, 92, 246, 0.5)" strokeWidth={2} fill="url(#surpriseGradient)" />
                    </AreaChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-around">
                    {chartData.map((item, index) => (
                        <div key={index} className="relative group/dot" onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)} onFocus={() => setHoveredIndex(index)} onBlur={() => setHoveredIndex(null)} tabIndex={0}>
                            <motion.div className={`w-3 h-3 rounded-full border-2 border-transparent transition-all duration-200 ${item.surprise > 0 ? "bg-green-400" : item.surprise < 0 ? "bg-red-400" : "bg-gray-500"}`} animate={{ scale: hoveredIndex === index ? 1.5 : 1 }} />
                            <AnimatePresence>
                                {hoveredIndex === index && (
                                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 p-2 rounded-lg bg-gray-900/90 backdrop-blur-sm border border-white/10 shadow-lg whitespace-nowrap z-10">
                                        <p className="text-xs font-bold text-white">{item.name}</p>
                                        <p className={`text-xs font-semibold ${item.surprise > 0 ? "text-green-400" : item.surprise < 0 ? "text-red-400" : "text-gray-400"}`}>EPS Surprise: {item.surprise >= 0 ? '+' : ''}{item.surprise.toFixed(1)}%</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
                 {trend && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2">
                        {trend === 'up' ? <ArrowUpRight className="w-4 h-4 text-green-400" /> : <ArrowDownRight className="w-4 h-4 text-red-400" />}
                    </div>
                )}
            </div>
        </div>
    );
};

const StreetWatchingPill = ({ topic, context, icon, expandedPill, setExpandedPill }) => {
    const isExpanded = expandedPill === topic;
    const Icon = icon === 'news' ? Newspaper : icon === 'options' ? BarChart : MessageSquare;

    return (
        <div className="w-full">
            <motion.button onClick={() => setExpandedPill(isExpanded ? null : topic)} className="w-full flex items-center justify-between text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <span className="text-sm font-semibold text-white">{topic}</span>
                <motion.div animate={{ rotate: isExpanded ? 90 : 0 }}><ChevronsRight className="w-4 h-4 text-gray-400" /></motion.div>
            </motion.button>
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        key="content"
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: '8px' }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.22, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-black/20 text-sm text-gray-300">
                            <Icon className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" />
                            <p className="flex-1">{context}</p>
                            <button className="text-violet-400 hover:text-violet-300 self-start"><ExternalLink className="w-3.5 h-3.5" /></button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const SupportingMetricCard = ({ title, value, unit, sparklineData, threshold, sign }) => {
    const isThresholdMet = threshold && (
        (threshold.direction === 'above' && Math.abs(value) >= threshold.value) ||
        (threshold.direction === 'below' && Math.abs(value) <= threshold.value)
    );
    const colorClass = threshold ? { green: 'shadow-green-500/50', amber: 'shadow-yellow-500/50', teal: 'shadow-teal-500/50' }[threshold.color] : '';
    const lineStroke = sign ? (sign === 'positive' ? 'rgba(4, 187, 107, 0.7)' : 'rgba(239, 68, 68, 0.7)') : 'rgba(139, 92, 246, 0.7)';
    
    return (
        <div className="relative p-4 rounded-xl bg-white/5 backdrop-blur-sm">
            {isThresholdMet && (
                <motion.div 
                    className={`absolute -inset-px rounded-xl -z-10 blur-sm ${colorClass}`}
                    animate={{ opacity: [0, 0.7, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
            )}
            <p className="text-xs text-gray-400 font-medium mb-1">{title}</p>
            <div className="flex items-end justify-between gap-4">
                <p className="text-2xl font-bold text-white whitespace-nowrap" style={{fontFeatureSettings: "'tnum'"}}>{value}<span className="text-lg ml-1 text-gray-400">{unit}</span></p>
                {sparklineData && sparklineData.length > 1 && (
                    <div className="w-16 h-8 -mb-1">
                        <ResponsiveContainer>
                            <AreaChart data={sparklineData}><Area type="monotone" dataKey="v" stroke={lineStroke} fill="rgba(139, 92, 246, 0.1)" strokeWidth={2} /></AreaChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </div>
    );
};


export default function DetailedEarningsModal({ event, isOpen, onClose }) {
    const [expandedPill, setExpandedPill] = useState(null);
    const [showMoreStreet, setShowMoreStreet] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const triggerRef = useRef(null);
    const pageVisibilityRef = useRef(null);
    const shouldReduceMotion = useReducedMotion();

    useEffect(() => {
        if (isOpen) {
            triggerRef.current = document.activeElement;
            const handleKeyDown = (e) => {
                if (e.key === 'Escape') onClose();
            };
            window.addEventListener('keydown', handleKeyDown);
            
            const handleVisibilityChange = () => {
                pageVisibilityRef.current = document.visibilityState;
            };
            document.addEventListener("visibilitychange", handleVisibilityChange);

            return () => {
                window.removeEventListener('keydown', handleKeyDown);
                document.removeEventListener("visibilitychange", handleVisibilityChange);
                triggerRef.current?.focus();
            };
        }
    }, [isOpen, onClose]);
  
    const augmentedEvent = {
        ...event,
        impliedMove: 8.5,
        whisperEps: 2.45,
        ivRank: 82,
        peerMedianIv: 65,
        streetWatching: [
            { topic: 'iPhone China Sales', context: 'Analysts are concerned about a potential 15-20% YoY decline in iPhone shipments in China due to competition.', icon: 'news' },
            { topic: 'Vision Pro Production Ramp', context: 'Options markets are pricing in minimal impact from Vision Pro, but any positive surprise on production numbers could be a catalyst.', icon: 'options' },
            { topic: 'Services Growth vs. Estimates', context: 'The key debate is whether App Store and subscription growth can offset hardware weakness. Sell-side notes are divided.', icon: 'sell-side' },
            { topic: 'AI Strategy Update', context: 'Tim Cook is expected to provide the first major update on Apple\'s generative AI strategy.', icon: 'news' },
        ],
        supportingMetrics: {
            shortInterest: { value: 1.2, unit: 'days' },
            guidanceScore: { value: 78, unit: '/100', sparkline: [{v:65}, {v:68}, {v:72}, {v:78}], threshold: { value: 70, direction: 'above', color: 'green' } },
            revisionTrend: { value: '+12', unit: '%', sparkline: [{v:-2}, {v:5}, {v:8}, {v:12}], threshold: { value: 10, direction: 'above', color: 'amber' }, sign: 'positive' },
            institutionalFlow: { value: 1.8, unit: 'B', sparkline: [{v:0.5}, {v:0.8}, {v:-0.2}, {v:1.8}], threshold: { value: 1, direction: 'above', color: 'teal' }, sign: 'positive' },
        }
    };
    
    const streetWatchingItems = showMoreStreet ? augmentedEvent.streetWatching : augmentedEvent.streetWatching.slice(0, 3);

    if (!isOpen || !event) return null;
    const isPulseDisabled = shouldReduceMotion || isHovered || pageVisibilityRef.current === 'hidden';

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.985 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.985 }}
                        transition={{ duration: 0.18, ease: [0.22, 0.61, 0.36, 1] }}
                        className="relative z-10 w-full max-w-4xl h-[90vh] max-h-[800px] flex flex-col rounded-3xl overflow-hidden border border-white/10"
                        style={{ background: 'linear-gradient(145deg, rgba(18, 20, 28, 0.95), rgba(10, 12, 18, 0.95))' }}
                    >
                        <header className="sticky top-0 flex-shrink-0 p-6 border-b border-white/10 backdrop-blur-lg z-20">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <span className="px-3 py-1 rounded-lg bg-white/10 text-lg font-bold text-white">{event.ticker}</span>
                                        <h2 className="text-xl font-bold text-white">{event.name}</h2>
                                    </div>
                                    <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-gray-400">
                                        <span>{formatFiscalPeriod(event.date)}</span>
                                        <div className="w-1 h-1 rounded-full bg-gray-600 hidden md:block" />
                                        <span>{formatDate(new Date(event.date), 'MMM d')} • {event.time}</span>
                                        <div className="w-1 h-1 rounded-full bg-gray-600 hidden md:block" />
                                        <span className="font-semibold text-amber-400">High Risk</span>
                                    </div>
                                </div>
                                <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors"><X className="w-5 h-5 text-gray-400" /></button>
                            </div>
                        </header>
                        
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Primary Row - Fixed Height and Proper Padding */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Implied Move - Increased height and better text sizing */}
                                <div className="md:col-span-1 p-6 pt-10 pb-8 rounded-2xl bg-white/[0.03] border border-white/10 min-h-[220px] flex flex-col justify-between" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                                    <h3 className="text-lg font-semibold text-white mb-2">Implied Move</h3>
                                    <div className="flex-1 flex flex-col justify-center items-center">
                                        <motion.div 
                                            className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-violet-300 to-indigo-400 leading-tight text-center"
                                            style={{fontFeatureSettings: "'tnum'", lineHeight: '0.9'}}
                                            animate={{ opacity: isPulseDisabled ? 1 : [0.96, 1, 0.96] }}
                                            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', repeatDelay: 8.8 }}
                                        >
                                            ±{augmentedEvent.impliedMove.toFixed(1)}%
                                        </motion.div>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2 text-center">Market-implied move via options pricing</p>
                                </div>
                                
                                {/* Consensus */}
                                <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 min-h-[220px] flex flex-col justify-center">
                                    <h3 className="text-lg font-semibold text-white mb-2 flex justify-between items-center">
                                        Consensus
                                        {augmentedEvent.whisperEps > parseFloat(event.estimate.replace('$', '')) * 1.03 && <span className="px-2 py-0.5 rounded-full text-xs bg-purple-500/20 text-purple-300">Whisper Divergence</span>}
                                    </h3>
                                    <div className="flex items-end gap-4 flex-1 justify-center">
                                        <div>
                                            <p className="text-4xl font-bold text-white" style={{fontFeatureSettings: "'tnum'"}}>{event.estimate}</p>
                                            <p className="text-xs text-gray-400">EPS</p>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-semibold text-gray-300 whitespace-nowrap" style={{fontFeatureSettings: "'tnum'"}}>{formatCurrency(195200000000)}</p>
                                            <p className="text-xs text-gray-400">Revenue</p>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Beat/Miss History */}
                                <div className="min-h-[220px]">
                                    <BeatMissHistory history={event.epsSurpriseHistory} />
                                </div>
                            </div>

                            {/* Secondary Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* IV Rank Gauge - Increased height for better caption display */}
                                <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 min-h-[280px] flex flex-col items-center justify-center">
                                    <RadialGauge value={augmentedEvent.ivRank} peerMedian={augmentedEvent.peerMedianIv} />
                                </div>
                                
                                {/* Street Is Watching */}
                                <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
                                    <h3 className="text-lg font-semibold text-white mb-4">Street Is Watching</h3>
                                    <div className="space-y-2">
                                        {streetWatchingItems.map(pill => (
                                            <StreetWatchingPill key={pill.topic} {...pill} expandedPill={expandedPill} setExpandedPill={setExpandedPill} />
                                        ))}
                                        {augmentedEvent.streetWatching.length > 3 && !showMoreStreet && (
                                            <button onClick={() => setShowMoreStreet(true)} className="text-sm text-violet-400 font-semibold mt-2 hover:underline">+ {augmentedEvent.streetWatching.length - 3} more</button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Supporting Metrics */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <SupportingMetricCard title="Short Interest" {...augmentedEvent.supportingMetrics.shortInterest} />
                                <SupportingMetricCard title="Guidance Score" {...augmentedEvent.supportingMetrics.guidanceScore} />
                                <SupportingMetricCard title="Revision Trend" {...augmentedEvent.supportingMetrics.revisionTrend} />
                                <SupportingMetricCard title="Institutional Flow (30d)" value={formatCurrency(augmentedEvent.supportingMetrics.institutionalFlow.value * 1e9)} unit="" sparklineData={augmentedEvent.supportingMetrics.institutionalFlow.sparkline} threshold={augmentedEvent.supportingMetrics.institutionalFlow.threshold} sign={augmentedEvent.supportingMetrics.institutionalFlow.sign} />
                            </div>
                        </div>

                        <footer className="flex-shrink-0 p-6 border-t border-white/10 flex justify-end items-center gap-4">
                            <button className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-300 bg-white/5 hover:bg-white/10 transition-colors"><CalendarIcon className="inline w-4 h-4 mr-2" />Add to Calendar</button>
                            <button className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-500 to-indigo-500 hover:brightness-110 transition"><Zap className="inline w-4 h-4 mr-2" />Set Smart Alert</button>
                        </footer>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
