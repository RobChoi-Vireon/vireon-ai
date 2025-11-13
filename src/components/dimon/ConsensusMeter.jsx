import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// OS Horizon Motion Tokens
const MOTION = {
  CURVES: {
    horizonIn: [0.22, 0.61, 0.36, 1],
    horizonOut: [0.4, 0.0, 0.2, 1]
  },
  DURATIONS: {
    fast: 0.12,
    base: 0.18
  }
};

const MiniRing = ({ label, value, color, delay }) => {
    const [isHovered, setIsHovered] = useState(false);
    const radius = 12;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <motion.div 
                        className="flex flex-col items-center gap-1.5 cursor-help"
                        onHoverStart={() => setIsHovered(true)}
                        onHoverEnd={() => setIsHovered(false)}
                        whileHover={{
                            scale: 1.02,
                            transition: { duration: 0.09 }
                        }}
                    >
                        <div className="relative w-7 h-7">
                            <svg width="28" height="28" className="transform -rotate-90">
                                <defs>
                                    <filter id={`mini-ring-glow-${label}`} x="-50%" y="-50%" width="200%" height="200%">
                                        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                                        <feColorMatrix 
                                            in="coloredBlur" 
                                            type="matrix" 
                                            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.85 0"
                                        />
                                        <feMerge>
                                            <feMergeNode in="coloredBlur"/>
                                            <feMergeNode in="SourceGraphic"/>
                                        </feMerge>
                                    </filter>
                                </defs>
                                
                                <circle
                                    cx="14"
                                    cy="14"
                                    r={radius}
                                    fill="none"
                                    stroke="rgba(255,255,255,0.1)"
                                    strokeWidth="3"
                                />
                                <motion.circle
                                    cx="14"
                                    cy="14"
                                    r={radius}
                                    fill="none"
                                    stroke={color}
                                    strokeWidth="3"
                                    strokeDasharray={circumference}
                                    strokeLinecap="round"
                                    filter={`url(#mini-ring-glow-${label})`}
                                    initial={{ strokeDashoffset: circumference }}
                                    animate={{ 
                                        strokeDashoffset: offset,
                                        opacity: isHovered ? 1 : 0.92
                                    }}
                                    transition={{ 
                                        strokeDashoffset: {
                                            duration: 0.7, 
                                            delay: delay * 0.18 + 0.3,
                                            ease: [0.25, 1, 0.5, 1]
                                        },
                                        opacity: { duration: 0.09 }
                                    }}
                                />
                            </svg>
                            
                            {/* Soft Pulse Highlight on Hover */}
                            <motion.div
                                className="absolute inset-0 rounded-full pointer-events-none"
                                style={{
                                    background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
                                    opacity: 0
                                }}
                                animate={{ opacity: isHovered ? 0.3 : 0 }}
                                transition={{ duration: 0.09 }}
                            />
                        </div>
                        <span className="text-[10px] font-medium" style={{ color: 'rgba(255,255,255,0.70)' }}>
                            {label}
                        </span>
                    </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                    {label}: {Math.round(value)}%
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

const Sparkline = ({ data = [62, 58, 61, 59, 64, 67, 66], delay = 0 }) => {
    const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setShouldReduceMotion(mediaQuery.matches);
        const handler = (e) => setShouldReduceMotion(e.matches);
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue;
    
    const points = data.map((value, index) => {
        const x = (index / (data.length - 1)) * 96;
        const y = 36 - ((value - minValue) / range) * 32;
        return `${x},${y}`;
    }).join(' ');

    const slope = data[data.length - 1] - data[0];
    const color = slope > 0 ? '#2ECF8D' : slope < 0 ? '#F26A6A' : '#5EA7FF';

    return (
        <div className="flex items-center justify-center">
            <svg width="96" height="36" className="overflow-visible">
                <defs>
                    <filter id="sparkline-glow">
                        <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                
                <motion.polyline
                    points={points}
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#sparkline-glow)"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ 
                        pathLength: shouldReduceMotion ? 1 : 1, 
                        opacity: shouldReduceMotion ? 1 : 1 
                    }}
                    transition={shouldReduceMotion ? { duration: 0 } : { 
                        duration: 0.3, 
                        delay: delay,
                        ease: [0.25, 1, 0.5, 1] 
                    }}
                />
                
                <motion.circle
                    cx={points.split(' ')[data.length - 1].split(',')[0]}
                    cy={points.split(' ')[data.length - 1].split(',')[1]}
                    r="2"
                    fill={color}
                    filter="url(#sparkline-glow)"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: delay + 0.3 }}
                />
            </svg>
        </div>
    );
};

const RadialGauge = ({ score, isHovered }) => {
    const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setShouldReduceMotion(mediaQuery.matches);
        const handler = (e) => setShouldReduceMotion(e.matches);
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    const radius = 58;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    const getZoneColor = (score) => {
        if (score < 40) return '#F26A6A';
        if (score < 70) return '#5EA7FF';
        return '#2ECF8D';
    };

    const getZoneLabel = (score) => {
        if (score < 40) return 'Risk-Tilt';
        if (score < 70) return 'Mixed';
        return 'Constructive';
    };

    const color = getZoneColor(score);
    const label = getZoneLabel(score);

    return (
        <div className="relative flex items-center justify-center w-[136px] h-[136px] mx-auto">
            <svg width="136" height="136" className="transform -rotate-90">
                <defs>
                    {/* Reduced glow intensity by ~10% (was 1.15, now 1.04) */}
                    <filter id="gauge-glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3.2" result="coloredBlur"/>
                        <feColorMatrix 
                            in="coloredBlur" 
                            type="matrix" 
                            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1.04 0"
                        />
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                
                {/* Background Circle */}
                <circle
                    cx="68"
                    cy="68"
                    r={radius}
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="10"
                />
                
                {/* Animated Progress Circle */}
                <motion.circle
                    cx="68"
                    cy="68"
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeLinecap="round"
                    filter="url(#gauge-glow)"
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ 
                        strokeDashoffset: shouldReduceMotion ? offset : offset,
                        opacity: isHovered ? 1 : 0.95
                    }}
                    transition={shouldReduceMotion ? { duration: 0 } : { 
                        duration: 0.7, 
                        ease: [0.25, 1, 0.5, 1],
                        opacity: { duration: 0.2 }
                    }}
                />
            </svg>
            
            {/* Center Content - OS Horizon Typography Hierarchy */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                {/* Tier 1: Caption Label (55-65% opacity, smaller) */}
                <motion.span
                    className="text-[9px] font-medium uppercase tracking-wide mb-2"
                    style={{ 
                        color: 'rgba(255,255,255,0.60)',
                        letterSpacing: '0.10em'
                    }}
                    initial={{ opacity: 0, y: -3 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                >
                    Overall Street Alignment
                </motion.span>
                
                {/* Tier 2: Hero Number (unchanged brightness) */}
                <motion.span
                    className="text-3xl font-bold mb-2"
                    style={{ color }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                >
                    {score}
                </motion.span>
                
                {/* Tier 3 & 4: Medium Emphasis + Caption */}
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.3 }}
                >
                    {/* Tier 3: Medium Emphasis (stronger than caption) */}
                    <div className="text-[13px] font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.82)' }}>
                        {label} Consensus
                    </div>
                    {/* Tier 4: Caption (55-65% opacity, smaller) */}
                    <div className="text-[10px] font-medium" style={{ color: 'rgba(255,255,255,0.60)' }}>
                        Weight: Medium
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default function ConsensusMeter({ score, breakdown, onOpenDrawer }) {
    const [isHovered, setIsHovered] = useState(false);

    if (typeof score !== 'number') {
        return null;
    }

    const segments = breakdown?.segments || [];
    
    const segmentColors = {
        'Policy': '#F26A6A',
        'Credit': '#5EA7FF',
        'Equities': '#2ECF8D',
        'Global': '#FFB020'
    };

    const trendData = [62, 58, 61, 59, 64, 67, 66];
    const sourcesCount = 5;
    const updatedAgo = "2m ago";

    const handleOpenDrawer = () => {
        try {
            onOpenDrawer();
        } catch (error) {
            console.error('Error opening sentiment drawer:', error);
        }
    };

    return (
        <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="h-full rounded-2xl flex flex-col cursor-pointer relative overflow-hidden"
            style={{
                background: 'rgba(16, 20, 28, 0.55)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
                backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0.08) 100%)',
                paddingTop: '30px',
                paddingBottom: '30px',
                paddingLeft: '24px',
                paddingRight: '24px'
            }}
            whileHover={{ 
                y: -1.5,
                scale: 1.01,
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 12px 42px rgba(0,0,0,0.36)',
                borderColor: 'rgba(255,255,255,0.2)',
                transition: { duration: MOTION.DURATIONS.fast, ease: MOTION.CURVES.horizonOut }
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            onClick={handleOpenDrawer}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <motion.h2 
                    className="text-base font-semibold"
                    style={{ color: 'rgba(255,255,255,0.95)' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    Consensus
                </motion.h2>
                <motion.div
                    className="px-2.5 py-1 rounded-full text-xs font-semibold"
                    style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'rgba(255,255,255,0.92)'
                    }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    aria-label={`Consensus score ${score} percent`}
                >
                    {score}%
                </motion.div>
            </div>

            {/* Main Gauge */}
            <div className="flex-1 flex items-center justify-center" style={{ marginTop: '16px', marginBottom: '16px' }}>
                <RadialGauge score={score} isHovered={isHovered} />
            </div>

            {/* Low-Opacity Divider (Grounding Element) */}
            <div 
                className="h-px mb-4"
                style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)',
                    marginTop: '12px'
                }}
            />

            {/* Mini Segment Rings (+10-14px spacing from donut) */}
            <motion.div 
                className="flex justify-center gap-2.5"
                style={{ marginBottom: '18px' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                {segments.map((segment, index) => (
                    <MiniRing
                        key={segment.name}
                        label={segment.name}
                        value={(segment.weight || 0) * 100}
                        color={segmentColors[segment.name] || '#AAB1B8'}
                        delay={index}
                    />
                ))}
            </motion.div>

            {/* Sparkline (+6-10px spacing from mini-rings) */}
            <motion.div
                style={{ marginBottom: '16px' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
            >
                <Sparkline data={trendData} delay={0.9} />
            </motion.div>

            {/* Footnote (+10px above footer) */}
            <motion.p
                className="text-xs text-center"
                style={{ 
                    color: 'rgba(255,255,255,0.70)',
                    marginTop: '10px'
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
            >
                Based on {sourcesCount} sources • Updated {updatedAgo}
            </motion.p>

            {/* Hover Hint */}
            <motion.div 
                className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center text-xs pointer-events-none"
                style={{ color: 'rgba(255,255,255,0.6)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.2 }}
            >
                <Activity className="w-3 h-3 mr-1" />
                View detailed breakdown
            </motion.div>
        </motion.div>
    );
}