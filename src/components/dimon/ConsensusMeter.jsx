// 🔒 DESIGN LOCKED — OS HORIZON V4.0 + SPIRIT LAYER + LIGHT-FIELD LENS
// Last Updated: 2025-01-20
// VisionOS-inspired Light-Field Consensus Lens applied
// See: DESIGN_LOCKED_COMPONENTS.md

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// OS Horizon Motion Tokens
const MOTION_TOKENS = {
  CURVES: {
    horizonIn: [0.22, 0.61, 0.36, 1],
    horizonSpring: [0.16, 1, 0.3, 1]
  },
  DURATIONS: {
    fast: 0.12,
    base: 0.15,
    slow: 0.5
  }
};

const MiniRing = ({ label, value, color, delay, isHovered }) => {
    const radius = 12;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;
    const [iconHovered, setIconHovered] = useState(false);

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <motion.div 
                        className="flex flex-col items-center gap-1.5 cursor-help"
                        onHoverStart={() => setIconHovered(true)}
                        onHoverEnd={() => setIconHovered(false)}
                        whileHover={{
                            scale: 1.02,
                            y: -0.5,
                            transition: { duration: 0.15, ease: MOTION_TOKENS.CURVES.horizonIn }
                        }}
                        style={{ position: 'relative' }}
                    >
                        {/* Gravitational orbital halo (Spirit Layer) */}
                        <motion.div
                            className="absolute"
                            style={{
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '36px',
                                height: '36px',
                                borderRadius: '999px',
                                background: `radial-gradient(circle, ${color}15 0%, transparent 70%)`,
                                filter: 'blur(10px)',
                                pointerEvents: 'none',
                                zIndex: -1
                            }}
                            animate={{
                                opacity: iconHovered ? 0.8 : 0.3,
                                scale: iconHovered ? 1.1 : 1
                            }}
                            transition={{ duration: 0.15 }}
                        />

                        <div className="relative w-7 h-7">
                            <svg width="28" height="28" className="transform -rotate-90">
                                <circle
                                    cx="14"
                                    cy="14"
                                    r={radius}
                                    fill="none"
                                    stroke="rgba(255,255,255,0.1)"
                                    strokeWidth="2.8"
                                />
                                <motion.circle
                                    cx="14"
                                    cy="14"
                                    r={radius}
                                    fill="none"
                                    stroke={color}
                                    strokeWidth="2.8"
                                    strokeDasharray={circumference}
                                    strokeLinecap="round"
                                    initial={{ strokeDashoffset: circumference, opacity: 0.88 }}
                                    animate={{ 
                                        strokeDashoffset: offset,
                                        opacity: iconHovered ? 0.98 : 0.92,
                                        filter: iconHovered 
                                            ? `drop-shadow(0 0 8px ${color}40)` 
                                            : `drop-shadow(0 0 6px ${color}28)`
                                    }}
                                    transition={{ 
                                        strokeDashoffset: { duration: 0.7, delay: delay * 0.18 + 0.3, ease: [0.25, 1, 0.5, 1] },
                                        opacity: { duration: 0.15 },
                                        filter: { duration: 0.15 }
                                    }}
                                />
                            </svg>
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
    const color = slope > 0 ? '#2BC686' : slope < 0 ? '#F26A6A' : '#5EA7FF';

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
                    strokeWidth="1.6"
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
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ 
                        duration: 0.3, 
                        delay: delay + 0.15,
                        ease: MOTION_TOKENS.CURVES.horizonIn
                    }}
                />
            </svg>
        </div>
    );
};

// ============================================================================
// LIGHT-FIELD CONSENSUS LENS — OS HORIZON V4.0 (VisionOS-INSPIRED)
// Metaphor: Consensus as refractive volumetric light surface
// ============================================================================
const LightFieldConsensusLens = ({ score, isHovered }) => {
    const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
    const [lightPhase, setLightPhase] = useState(0);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setShouldReduceMotion(mediaQuery.matches);
        const handler = (e) => setShouldReduceMotion(e.matches);
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    useEffect(() => {
        if (shouldReduceMotion) return;
        
        let rafId;
        let startTime = Date.now();
        
        const animate = () => {
            const elapsed = (Date.now() - startTime) / 1000;
            setLightPhase(elapsed);
            rafId = requestAnimationFrame(animate);
        };
        
        rafId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(rafId);
    }, [shouldReduceMotion]);

    // Consensus coherence: 66 = mixed → 70% uniformity, slight asymmetry
    const consensusCoherence = score / 100;
    const uniformity = 0.70; // 70% for score of 66
    const driftVariance = (1 - uniformity) * 12; // Medium drift variance

    // Internal light drift (15 second cycle)
    const verticalDrift = Math.sin(lightPhase * (Math.PI * 2 / 15)) * driftVariance;
    const diagonalDrift = Math.cos(lightPhase * (Math.PI * 2 / 15) * 0.7) * (driftVariance * 0.5);

    // Hover effects
    const baseLuminance = isHovered ? 0.15 : 0.12; // +3% on hover
    const baseThickness = isHovered ? 1.02 : 1.0; // +2% thickness on hover
    const parallaxTilt = isHovered ? 0.8 : 0; // 0.8° parallax tilt

    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            {/* VisionOS Light-Field Plane */}
            <motion.div
                className="absolute"
                style={{
                    width: '145%',
                    height: '42px',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    willChange: 'transform, opacity'
                }}
                animate={{
                    rotateX: `${parallaxTilt}deg`,
                    y: shouldReduceMotion ? 0 : verticalDrift,
                    x: shouldReduceMotion ? 0 : diagonalDrift,
                    scaleY: baseThickness
                }}
                transition={{
                    rotateX: { duration: 0.12, ease: MOTION_TOKENS.CURVES.horizonIn },
                    y: { duration: 15, ease: 'easeInOut' },
                    x: { duration: 15, ease: 'easeInOut' },
                    scaleY: { duration: 0.12, ease: MOTION_TOKENS.CURVES.horizonIn }
                }}
            >
                {/* Base light-field layer */}
                <motion.div
                    className="absolute inset-0"
                    style={{
                        background: `
                            linear-gradient(
                                180deg,
                                rgba(167, 209, 255, ${baseLuminance * 0.65}) 0%,
                                rgba(123, 184, 255, ${baseLuminance}) 35%,
                                rgba(123, 184, 255, ${baseLuminance * 0.95}) 65%,
                                rgba(167, 209, 255, ${baseLuminance * 0.55}) 100%
                            )
                        `,
                        filter: 'blur(8px)',
                        mixBlendMode: 'screen'
                    }}
                    animate={{
                        opacity: shouldReduceMotion ? 1 : [1, 0.92, 1]
                    }}
                    transition={{
                        duration: 14,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }}
                />

                {/* Refracted highlight layer (top edge bloom) */}
                <motion.div
                    className="absolute"
                    style={{
                        top: 0,
                        left: '10%',
                        right: '10%',
                        height: '12px',
                        background: 'linear-gradient(180deg, rgba(167, 209, 255, 0.08) 0%, transparent 100%)',
                        filter: 'blur(6px)',
                        mixBlendMode: 'screen'
                    }}
                    animate={{
                        opacity: shouldReduceMotion ? 0.6 : [0.6, 0.75, 0.6],
                        scaleX: shouldReduceMotion ? 1 : [1, 1.08, 1]
                    }}
                    transition={{
                        duration: 16,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }}
                />

                {/* Inner shadow (bottom edge depth) */}
                <div
                    className="absolute"
                    style={{
                        bottom: 0,
                        left: '8%',
                        right: '8%',
                        height: '8px',
                        background: 'linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.018) 100%)',
                        filter: 'blur(4px)',
                        pointerEvents: 'none'
                    }}
                />

                {/* Asymmetric refraction (consensus at 66 = slight irregularity) */}
                <motion.div
                    className="absolute"
                    style={{
                        left: '15%',
                        right: '20%',
                        top: '25%',
                        bottom: '25%',
                        background: 'radial-gradient(ellipse, rgba(167, 209, 255, 0.12) 0%, transparent 65%)',
                        filter: 'blur(14px)',
                        mixBlendMode: 'screen'
                    }}
                    animate={{
                        opacity: shouldReduceMotion ? 0.7 : [0.7, 0.85, 0.7],
                        x: shouldReduceMotion ? 0 : [0, 3, 0]
                    }}
                    transition={{
                        duration: 13,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }}
                />

                {/* Secondary refraction layer (offset for "mixed" feeling) */}
                <motion.div
                    className="absolute"
                    style={{
                        left: '25%',
                        right: '15%',
                        top: '20%',
                        bottom: '20%',
                        background: 'radial-gradient(ellipse, rgba(123, 184, 255, 0.10) 0%, transparent 60%)',
                        filter: 'blur(12px)',
                        mixBlendMode: 'screen'
                    }}
                    animate={{
                        opacity: shouldReduceMotion ? 0.65 : [0.65, 0.78, 0.65],
                        x: shouldReduceMotion ? 0 : [0, -2, 0]
                    }}
                    transition={{
                        duration: 17,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: 0.5
                    }}
                />
            </motion.div>

            {/* Darkening scrim for text contrast */}
            <div 
                className="absolute"
                style={{
                    width: '140px',
                    height: '140px',
                    background: 'radial-gradient(circle, rgba(16, 20, 28, 0.35) 0%, transparent 70%)',
                    pointerEvents: 'none'
                }}
            />
        </div>
    );
};

const RadialGauge = ({ score, isHovered }) => {
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
            {/* LIGHT-FIELD CONSENSUS LENS (replaces harmonic wave) */}
            <LightFieldConsensusLens score={score} isHovered={isHovered} />

            {/* Center Content — UNCHANGED */}
            <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ zIndex: 10 }}>
                {/* Label Above Number */}
                <motion.span
                    className="text-[10px] font-medium uppercase tracking-wide mb-2"
                    style={{ 
                        color: 'rgba(255,255,255,0.70)',
                        letterSpacing: '0.07em'
                    }}
                    initial={{ opacity: 0, y: -3 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                >
                    Overall Street Alignment
                </motion.span>
                
                <motion.span
                    className="text-3xl font-bold mb-2"
                    style={{ color }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                >
                    {score}
                </motion.span>
                
                <motion.div
                    className="text-center mt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.3 }}
                >
                    <div className="text-[13px] font-bold mb-2" style={{ color: 'rgba(255,255,255,0.88)' }}>
                        {label} Consensus
                    </div>
                    <div className="text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.65)' }}>
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
        'Equities': '#2BC686',
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
            className="h-full rounded-2xl flex flex-col cursor-pointer relative overflow-hidden consensus-meter-card"
            style={{
                padding: '24px',
                background: 'rgba(16, 20, 28, 0.55)',
                backdropFilter: 'blur(16px) saturate(140%)',
                WebkitBackdropFilter: 'blur(16px) saturate(140%)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
                backgroundImage: `
                    linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 50%, rgba(0,0,0,0.11) 100%)
                `,
                filter: 'brightness(1) blur(0px)',
                willChange: 'transform, filter, box-shadow'
            }}
            whileHover={{ 
                y: -4,
                scale: 1.015,
                filter: 'brightness(1.01) blur(0px)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 12px 40px rgba(0,0,0,0.3)',
                borderColor: 'rgba(255,255,255,0.2)',
                transition: { duration: 0.12, ease: MOTION_TOKENS.CURVES.horizonIn }
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            onClick={handleOpenDrawer}
        >
            {/* Spirit Layer: Subsurface lighting (macOS Tahoe) */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: '28px',
                right: '28px',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent)',
                borderRadius: '999px',
                pointerEvents: 'none'
            }} />

            {/* Spirit Layer: Ambient radial glow for gravitational field metaphor */}
            <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                    background: 'radial-gradient(circle at 50% 45%, rgba(94, 167, 255, 0.06) 0%, transparent 65%)',
                    opacity: 0
                }}
                animate={{ opacity: isHovered ? 0.7 : 0 }}
                transition={{ duration: 0.3 }}
            />

            {/* Header */}
            <div className="flex items-center justify-between mb-2">
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
                        background: 'rgba(255, 255, 255, 0.08)',
                        color: 'rgba(255,255,255,0.75)',
                        fontSize: '11px'
                    }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ 
                        opacity: 0.75,
                        scale: 1 
                    }}
                    transition={{ delay: 0.2 }}
                    aria-label={`Consensus score ${score} percent`}
                >
                    {score}%
                </motion.div>
            </div>

            {/* Main Gauge with Light-Field Lens */}
            <div className="flex-1 flex items-center justify-center my-3">
                <RadialGauge score={score} isHovered={isHovered} />
            </div>

            {/* Mini Segment Rings */}
            <motion.div 
                className="flex justify-center gap-2 mb-4"
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
                        isHovered={isHovered}
                    />
                ))}
            </motion.div>

            {/* Sparkline */}
            <motion.div
                className="mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ 
                    delay: 0.8,
                    duration: 0.15
                }}
            >
                <Sparkline data={trendData} delay={0.85} />
            </motion.div>

            {/* Footnote */}
            <motion.p
                className="text-xs text-center"
                style={{ 
                    color: 'rgba(255,255,255,0.70)',
                    opacity: 0.82
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.82 }}
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

            {/* GPU optimization */}
            <style jsx>{`
                .consensus-meter-card {
                    transform: translateZ(0);
                    backface-visibility: hidden;
                }

                .consensus-meter-card * {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                }

                @media (prefers-reduced-motion: reduce) {
                    * {
                        animation: none !important;
                        transition: none !important;
                    }
                }
            `}</style>
        </motion.div>
    );
}