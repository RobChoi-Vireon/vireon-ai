// 🔒 DESIGN LOCKED — OS HORIZON V4.0 + SPIRIT LAYER + HYBRID FLOWFIELD
// Last Updated: 2025-01-20
// Hybrid Flowfield Consensus Visual — 3-layer vector alignment system
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
// HYBRID FLOWFIELD CONSENSUS VISUAL — OS HORIZON V4.0 SPIRIT LAYER
// Three-layer vector alignment system expressing market consensus
// ============================================================================
const HybridFlowfieldConsensusVisual = ({ score, isHovered }) => {
    const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
    const [flowPhase, setFlowPhase] = useState(0);
    const canvasRef = useRef(null);
    const particlesRef = useRef([]);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setShouldReduceMotion(mediaQuery.matches);
        const handler = (e) => setShouldReduceMotion(e.matches);
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    // Consensus coherence: 66 = mixed → 70% alignment, 12° variance
    const consensusCoherence = score / 100;
    const alignmentFactor = 0.70; // 70% for score 66
    const directionalVariance = 12; // degrees

    // Initialize particles
    useEffect(() => {
        const particleCount = 32;
        particlesRef.current = Array.from({ length: particleCount }, (_, i) => ({
            x: Math.random() * 200,
            y: Math.random() * 140,
            vx: (Math.random() - 0.5) * 0.15,
            vy: (Math.random() - 0.5) * 0.15,
            size: Math.random() * 1.2 + 0.8,
            opacity: Math.random() * 0.02 + 0.04,
            phase: Math.random() * Math.PI * 2
        }));
    }, []);

    // Animation loop
    useEffect(() => {
        if (shouldReduceMotion) return;
        
        let rafId;
        let startTime = Date.now();
        
        const animate = () => {
            const elapsed = (Date.now() - startTime) / 1000;
            setFlowPhase(elapsed);
            
            // Update particles
            const speedMultiplier = isHovered ? 1.07 : 1.0;
            particlesRef.current.forEach(p => {
                // Vector field following (simplified)
                const flowAngle = Math.sin(p.x * 0.02 + elapsed * 0.3) * (directionalVariance * Math.PI / 180);
                p.vx = Math.cos(flowAngle) * 0.12 * speedMultiplier;
                p.vy = Math.sin(flowAngle) * 0.08 * speedMultiplier;
                
                p.x += p.vx;
                p.y += p.vy;
                
                // Wrap around
                if (p.x < -10) p.x = 210;
                if (p.x > 210) p.x = -10;
                if (p.y < -10) p.y = 150;
                if (p.y > 150) p.y = -10;
            });
            
            rafId = requestAnimationFrame(animate);
        };
        
        rafId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(rafId);
    }, [shouldReduceMotion, isHovered, directionalVariance]);

    // Generate flow line path (cubic Bézier)
    const generateFlowLine = (startY, amplitude, phaseOffset, variance) => {
        const points = [];
        const steps = 60;
        
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const x = t * 200;
            
            // Smooth cubic curve with slight directional variance
            const baseFlow = Math.sin((t * Math.PI * 2.5) + phaseOffset + (flowPhase * 0.2));
            const varianceFlow = Math.sin((t * Math.PI * 1.8) + variance) * 0.3;
            const y = startY + (baseFlow + varianceFlow) * amplitude * (1 + (isHovered ? 0.01 : 0));
            
            points.push(`${x},${y}`);
        }
        
        return points.join(' ');
    };

    const baseAmplitude = 8;
    const lineCount = 11;

    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            {/* LAYER 3: Gradient Depth Field */}
            <motion.div
                className="absolute inset-0"
                style={{
                    background: `
                        radial-gradient(ellipse at 35% 40%, rgba(123, 184, 255, 0.08) 0%, transparent 55%),
                        radial-gradient(ellipse at 65% 60%, rgba(156, 207, 255, 0.06) 0%, transparent 50%),
                        radial-gradient(ellipse at 50% 50%, rgba(167, 209, 255, 0.04) 0%, transparent 70%)
                    `,
                    filter: 'blur(18px)'
                }}
                animate={{
                    opacity: isHovered ? 0.12 : 0.10 // +2% luminance on hover
                }}
                transition={{ duration: 0.12, ease: MOTION_TOKENS.CURVES.horizonIn }}
            />

            {/* LAYER 1: Flow Lines (SVG) */}
            <svg 
                width="200" 
                height="140" 
                viewBox="0 0 200 140"
                className="absolute"
                style={{
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1
                }}
            >
                <defs>
                    <filter id="flow-blur">
                        <feGaussianBlur stdDeviation="1.2" />
                    </filter>
                    
                    <linearGradient id="flow-gradient-1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#77B4FF" stopOpacity="0" />
                        <stop offset="20%" stopColor="#8BC4FF" stopOpacity="0.06" />
                        <stop offset="50%" stopColor="#9CCFFF" stopOpacity="0.07" />
                        <stop offset="80%" stopColor="#8BC4FF" stopOpacity="0.06" />
                        <stop offset="100%" stopColor="#77B4FF" stopOpacity="0" />
                    </linearGradient>
                    
                    <linearGradient id="flow-gradient-2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#88BFFF" stopOpacity="0" />
                        <stop offset="25%" stopColor="#9CCFFF" stopOpacity="0.055" />
                        <stop offset="50%" stopColor="#A7D1FF" stopOpacity="0.065" />
                        <stop offset="75%" stopColor="#9CCFFF" stopOpacity="0.055" />
                        <stop offset="100%" stopColor="#88BFFF" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Generate flow lines with moderate alignment */}
                {Array.from({ length: lineCount }).map((_, i) => {
                    const yPos = 30 + (i * (80 / (lineCount - 1)));
                    const phaseOffset = (i / lineCount) * Math.PI * 2;
                    const variance = (1 - alignmentFactor) * (i % 3) * 0.5;
                    const gradient = i % 2 === 0 ? 'flow-gradient-1' : 'flow-gradient-2';
                    
                    return (
                        <motion.polyline
                            key={i}
                            points={generateFlowLine(yPos, baseAmplitude, phaseOffset, variance)}
                            fill="none"
                            stroke={`url(#${gradient})`}
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            filter="url(#flow-blur)"
                            initial={{ opacity: 0, pathLength: 0 }}
                            animate={{ opacity: 1, pathLength: 1 }}
                            transition={{ 
                                duration: 0.8, 
                                delay: 0.2 + (i * 0.04),
                                ease: MOTION_TOKENS.CURVES.horizonIn
                            }}
                        />
                    );
                })}
            </svg>

            {/* LAYER 2: Micro-Particle Drift (Canvas) */}
            <canvas
                ref={canvasRef}
                width={200}
                height={140}
                className="absolute"
                style={{
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 2,
                    opacity: isHovered ? 0.92 : 0.88
                }}
            />

            {/* Render particles via DOM (lighter than canvas for small count) */}
            {particlesRef.current.map((particle, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                        left: `${(particle.x / 200) * 100}%`,
                        top: `${(particle.y / 140) * 100}%`,
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                        background: i % 3 === 0 ? '#A7D1FF' : '#C9EBFF',
                        opacity: particle.opacity,
                        filter: 'blur(0.5px)',
                        pointerEvents: 'none',
                        willChange: 'transform'
                    }}
                    animate={{
                        x: particle.x,
                        y: particle.y
                    }}
                    transition={{ type: 'tween', ease: 'linear', duration: 0 }}
                />
            ))}

            {/* Text contrast scrim */}
            <div 
                className="absolute"
                style={{
                    width: '130px',
                    height: '130px',
                    background: 'radial-gradient(circle, rgba(16, 20, 28, 0.32) 0%, transparent 68%)',
                    pointerEvents: 'none',
                    zIndex: 5
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
            {/* HYBRID FLOWFIELD CONSENSUS VISUAL */}
            <HybridFlowfieldConsensusVisual score={score} isHovered={isHovered} />

            {/* Center Content — UNCHANGED */}
            <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ zIndex: 10 }}>
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
            {/* Spirit Layer: Subsurface lighting */}
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

            {/* Ambient glow */}
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

            {/* Main Gauge with Hybrid Flowfield */}
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