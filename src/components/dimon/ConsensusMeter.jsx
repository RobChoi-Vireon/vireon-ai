// 🔒 DESIGN LOCKED — OS HORIZON V4.0 + SPIRIT LAYER + RADIANT PANE
// Last Updated: 2025-01-20
// Complete architecture redesign: Radiant Pane + Flowfield + Micro-Flowlets
// See: DESIGN_LOCKED_COMPONENTS.md

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

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

// ============================================================================
// RADIANT PANE + FLOWFIELD VISUALIZATION
// VisionOS-inspired liquid glass pane with coherence-driven flowfield
// ============================================================================
const RadiantPaneFlowfield = ({ score, isHovered }) => {
    const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
    const [flowPhase, setFlowPhase] = useState(0);
    const particlesRef = useRef([]);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setShouldReduceMotion(mediaQuery.matches);
        const handler = (e) => setShouldReduceMotion(e.matches);
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    // Consensus coherence: 66 = moderate alignment
    const consensusCoherence = score / 100;
    const alignmentFactor = 0.70; // 70% for score 66
    const curvatureVariance = 11; // degrees

    // Initialize particles
    useEffect(() => {
        particlesRef.current = Array.from({ length: 35 }, () => ({
            x: Math.random() * 240,
            y: Math.random() * 160,
            vx: (Math.random() - 0.5) * 0.12,
            vy: (Math.random() - 0.5) * 0.12,
            size: Math.random() * 1.3 + 0.8,
            opacity: Math.random() * 0.03 + 0.03
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
            const speedMultiplier = isHovered ? 1.06 : 1.0;
            particlesRef.current.forEach(p => {
                const flowAngle = Math.sin(p.x * 0.018 + elapsed * 0.25) * (curvatureVariance * Math.PI / 180);
                p.vx = Math.cos(flowAngle) * 0.11 * speedMultiplier;
                p.vy = Math.sin(flowAngle) * 0.07 * speedMultiplier;
                
                p.x += p.vx;
                p.y += p.vy;
                
                if (p.x < -10) p.x = 250;
                if (p.x > 250) p.x = -10;
                if (p.y < -10) p.y = 170;
                if (p.y > 170) p.y = -10;
            });
            
            rafId = requestAnimationFrame(animate);
        };
        
        rafId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(rafId);
    }, [shouldReduceMotion, isHovered, curvatureVariance]);

    // Generate flow line path
    const generateFlowLine = (startY, amplitude, phaseOffset, variance) => {
        const points = [];
        const steps = 70;
        
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const x = t * 240;
            
            const baseFlow = Math.sin((t * Math.PI * 2.2) + phaseOffset + (flowPhase * 0.18));
            const varianceFlow = Math.sin((t * Math.PI * 1.6) + variance) * 0.35;
            const hoverAmplitude = isHovered ? 1.02 : 1.0;
            const y = startY + (baseFlow + varianceFlow) * amplitude * hoverAmplitude;
            
            points.push(`${x},${y}`);
        }
        
        return points.join(' ');
    };

    const lightDrift = Math.sin(flowPhase * (Math.PI / 16)) * 3;
    const shimmer = Math.cos(flowPhase * (Math.PI / 14)) * 0.015;

    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            {/* Radiant Pane Background */}
            <motion.div
                className="absolute"
                style={{
                    width: '220px',
                    height: '145px',
                    borderRadius: '32px',
                    background: `
                        linear-gradient(180deg, 
                            rgba(167, 209, 255, 0.10) 0%, 
                            rgba(123, 184, 255, 0.12) 45%,
                            rgba(155, 203, 255, 0.09) 100%
                        )
                    `,
                    backdropFilter: 'blur(18px)',
                    WebkitBackdropFilter: 'blur(18px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: `
                        inset 0 1px 0 rgba(255, 255, 255, 0.12),
                        inset 0 -1px 0 rgba(0, 0, 0, 0.08),
                        0 0 30px rgba(123, 184, 255, 0.08)
                    `,
                    willChange: 'transform, filter'
                }}
                animate={{
                    filter: isHovered ? 'brightness(1.03)' : 'brightness(1)',
                    rotateX: isHovered ? '0.8deg' : '0deg',
                    y: shouldReduceMotion ? 0 : lightDrift
                }}
                transition={{
                    filter: { duration: 0.12, ease: MOTION_TOKENS.CURVES.horizonIn },
                    rotateX: { duration: 0.12, ease: MOTION_TOKENS.CURVES.horizonIn },
                    y: { duration: 16, ease: 'easeInOut' }
                }}
            >
                {/* Internal shimmer layer */}
                <motion.div
                    className="absolute inset-0 rounded-[32px]"
                    style={{
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, transparent 60%)',
                        opacity: 0.5 + shimmer
                    }}
                />

                {/* Top bloom */}
                <div 
                    className="absolute top-0 left-[15%] right-[15%] h-[16px] rounded-full"
                    style={{
                        background: 'linear-gradient(180deg, rgba(167, 209, 255, 0.12) 0%, transparent 100%)',
                        filter: 'blur(8px)'
                    }}
                />
            </motion.div>

            {/* Flowfield Layer */}
            <svg 
                width="240" 
                height="160" 
                viewBox="0 0 240 160"
                className="absolute"
                style={{
                    zIndex: 2,
                    opacity: isHovered ? 0.75 : 0.68
                }}
            >
                <defs>
                    <filter id="flow-blur-new">
                        <feGaussianBlur stdDeviation="1.3" />
                    </filter>
                    
                    <linearGradient id="flow-grad-1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#8EBFFF" stopOpacity="0" />
                        <stop offset="20%" stopColor="#9CCFFF" stopOpacity="0.055" />
                        <stop offset="50%" stopColor="#ABD7FF" stopOpacity="0.065" />
                        <stop offset="80%" stopColor="#9CCFFF" stopOpacity="0.055" />
                        <stop offset="100%" stopColor="#8EBFFF" stopOpacity="0" />
                    </linearGradient>
                    
                    <linearGradient id="flow-grad-2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#9CCFFF" stopOpacity="0" />
                        <stop offset="25%" stopColor="#ABD7FF" stopOpacity="0.05" />
                        <stop offset="50%" stopColor="#B8E2FF" stopOpacity="0.06" />
                        <stop offset="75%" stopColor="#ABD7FF" stopOpacity="0.05" />
                        <stop offset="100%" stopColor="#9CCFFF" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Generate 12 flow lines */}
                {Array.from({ length: 12 }).map((_, i) => {
                    const yPos = 35 + (i * (90 / 11));
                    const phaseOffset = (i / 12) * Math.PI * 2;
                    const variance = (1 - alignmentFactor) * ((i % 4) * 0.4);
                    const gradient = i % 2 === 0 ? 'flow-grad-1' : 'flow-grad-2';
                    
                    return (
                        <motion.polyline
                            key={i}
                            points={generateFlowLine(yPos, 7.5, phaseOffset, variance)}
                            fill="none"
                            stroke={`url(#${gradient})`}
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            filter="url(#flow-blur-new)"
                            initial={{ opacity: 0, pathLength: 0 }}
                            animate={{ opacity: 1, pathLength: 1 }}
                            transition={{ 
                                duration: 0.85, 
                                delay: 0.15 + (i * 0.035),
                                ease: MOTION_TOKENS.CURVES.horizonIn
                            }}
                        />
                    );
                })}
            </svg>

            {/* Micro-Particle Layer */}
            <div className="absolute inset-0" style={{ zIndex: 3 }}>
                {particlesRef.current.map((particle, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                            left: `${(particle.x / 240) * 100}%`,
                            top: `${(particle.y / 160) * 100}%`,
                            width: `${particle.size}px`,
                            height: `${particle.size}px`,
                            background: i % 3 === 0 ? '#C9EBFF' : '#FFFFFF',
                            opacity: particle.opacity,
                            filter: 'blur(0.5px)',
                            pointerEvents: 'none'
                        }}
                    />
                ))}
            </div>

            {/* Text contrast scrim */}
            <div 
                className="absolute"
                style={{
                    width: '140px',
                    height: '140px',
                    background: 'radial-gradient(circle, rgba(16, 20, 28, 0.28) 0%, transparent 65%)',
                    pointerEvents: 'none',
                    zIndex: 5
                }}
            />
        </div>
    );
};

// ============================================================================
// CATEGORY MICRO-FLOWLETS (Replace Legacy Rings)
// ============================================================================
const CategoryMicroFlowlets = ({ segments, isHovered }) => {
    const segmentColors = {
        'Policy': { main: '#F26A6A', soft: '#FFB8B8' },
        'Credit': { main: '#5EA7FF', soft: '#A3CFFF' },
        'Equities': { main: '#2BC686', soft: '#7FE8B8' },
        'Global': { main: '#FFB020', soft: '#FFD280' }
    };

    const generateMicroFlow = (phase) => {
        const points = [];
        for (let i = 0; i <= 20; i++) {
            const t = i / 20;
            const x = t * 34;
            const y = 3 + Math.sin((t * Math.PI * 1.5) + phase) * 1.2;
            points.push(`${x},${y}`);
        }
        return points.join(' ');
    };

    return (
        <div className="flex justify-center gap-3 mb-6">
            {segments.map((segment, index) => {
                const colors = segmentColors[segment.name] || { main: '#AAB1B8', soft: '#D0D0D0' };
                const value = (segment.weight || 0) * 100;
                
                return (
                    <motion.div
                        key={segment.name}
                        className="flex flex-col items-center gap-1.5"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + (index * 0.05), duration: 0.3 }}
                    >
                        {/* Micro-flowlet visualization */}
                        <motion.div
                            className="relative"
                            whileHover={{ scale: 1.04 }}
                            transition={{ duration: 0.12 }}
                        >
                            <svg width="34" height="6" viewBox="0 0 34 6">
                                <defs>
                                    <linearGradient id={`micro-grad-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor={colors.main} stopOpacity="0" />
                                        <stop offset="30%" stopColor={colors.main} stopOpacity="0.25" />
                                        <stop offset="70%" stopColor={colors.soft} stopOpacity="0.30" />
                                        <stop offset="100%" stopColor={colors.main} stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                
                                <motion.polyline
                                    points={generateMicroFlow(index * 0.8)}
                                    fill="none"
                                    stroke={`url(#micro-grad-${index})`}
                                    strokeWidth="1.2"
                                    strokeLinecap="round"
                                    animate={{
                                        opacity: isHovered ? 0.35 : 0.28
                                    }}
                                    transition={{ duration: 0.12 }}
                                />
                            </svg>
                            
                            {/* Glow on hover */}
                            <motion.div
                                className="absolute inset-0"
                                style={{
                                    background: `radial-gradient(circle, ${colors.main}20 0%, transparent 70%)`,
                                    filter: 'blur(4px)'
                                }}
                                animate={{
                                    opacity: isHovered ? 0.6 : 0
                                }}
                                transition={{ duration: 0.12 }}
                            />
                        </motion.div>

                        {/* Label and value */}
                        <div className="text-center">
                            <div className="text-[10px] font-medium" style={{ color: 'rgba(255,255,255,0.70)' }}>
                                {segment.name}
                            </div>
                            <div className="text-[11px] font-bold" style={{ color: colors.main }}>
                                {Math.round(value)}%
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};

// ============================================================================
// MICRO TRENDLINE BAND (Replace Legacy Zigzag)
// ============================================================================
const MicroTrendlineBand = ({ data, delay, isHovered }) => {
    const [driftPhase, setDriftPhase] = useState(0);
    const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

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
            setDriftPhase(elapsed);
            rafId = requestAnimationFrame(animate);
        };
        
        rafId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(rafId);
    }, [shouldReduceMotion]);

    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue;
    
    // Smooth curve interpolation
    const points = data.map((value, index) => {
        const x = (index / (data.length - 1)) * 120;
        const y = 18 - ((value - minValue) / range) * 14;
        return `${x},${y}`;
    }).join(' ');

    const slope = data[data.length - 1] - data[0];
    const baseColor = slope > 0 ? '#7FFFC1' : slope < 0 ? '#FFB8A3' : '#A3CFFF';

    return (
        <div className="flex items-center justify-center mb-6">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay, duration: 0.3 }}
            >
                <svg width="120" height="20" className="overflow-visible">
                    <defs>
                        <filter id="trendline-glow">
                            <feGaussianBlur stdDeviation="1.2" result="coloredBlur"/>
                            <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>
                    
                    <motion.path
                        d={`M ${points.split(' ').map((p, i) => {
                            const [x, y] = p.split(',').map(Number);
                            return i === 0 ? `${x},${y}` : `L ${x},${y}`;
                        }).join(' ')}`}
                        fill="none"
                        stroke={baseColor}
                        strokeWidth="1.3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        filter="url(#trendline-glow)"
                        style={{ opacity: 0.35 }}
                        animate={{
                            opacity: isHovered ? 0.42 : 0.35,
                            x: shouldReduceMotion ? 0 : Math.sin(driftPhase * 0.4) * 1.5
                        }}
                        transition={{
                            opacity: { duration: 0.12 },
                            x: { duration: 20, ease: 'linear' }
                        }}
                    />
                </svg>
            </motion.div>
        </div>
    );
};

// ============================================================================
// MAIN CONSENSUS COMPONENT
// ============================================================================
export default function ConsensusMeter({ score, breakdown, onOpenDrawer }) {
    const [isHovered, setIsHovered] = useState(false);

    if (typeof score !== 'number') {
        return null;
    }

    const segments = breakdown?.segments || [];
    const trendData = [62, 58, 61, 59, 64, 67, 66];
    const sourcesCount = 5;
    const updatedAgo = "2m ago";

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

    const handleOpenDrawer = () => {
        try {
            onOpenDrawer();
        } catch (error) {
            console.error('Error opening sentiment drawer:', error);
        }
    };

    const scoreColor = getZoneColor(score);
    const scoreLabel = getZoneLabel(score);

    return (
        <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="h-full rounded-2xl flex flex-col cursor-pointer relative overflow-hidden consensus-meter-card"
            style={{
                padding: '28px 24px',
                background: 'rgba(16, 20, 28, 0.55)',
                backdropFilter: 'blur(16px) saturate(140%)',
                WebkitBackdropFilter: 'blur(16px) saturate(140%)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
                backgroundImage: `
                    linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 50%, rgba(0,0,0,0.11) 100%)
                `,
                willChange: 'transform, filter, box-shadow'
            }}
            whileHover={{ 
                y: -4,
                scale: 1.015,
                filter: 'brightness(1.01)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 12px 40px rgba(0,0,0,0.3)',
                borderColor: 'rgba(255,255,255,0.2)',
                transition: { duration: 0.12, ease: MOTION_TOKENS.CURVES.horizonIn }
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            onClick={handleOpenDrawer}
        >
            {/* Subsurface lighting */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: '28px',
                right: '28px',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent)',
                pointerEvents: 'none'
            }} />

            {/* Ambient glow */}
            <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                    background: 'radial-gradient(circle at 50% 45%, rgba(94, 167, 255, 0.06) 0%, transparent 65%)'
                }}
                animate={{ opacity: isHovered ? 0.7 : 0 }}
                transition={{ duration: 0.3 }}
            />

            {/* TOP: Title Row */}
            <div className="flex items-center justify-between mb-6">
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
                    animate={{ opacity: 0.75, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {score}%
                </motion.div>
            </div>

            {/* MIDDLE: Primary Content Area (Radiant Pane + Flowfield + Score) */}
            <div className="relative flex items-center justify-center mb-8" style={{ minHeight: '160px' }}>
                <RadiantPaneFlowfield score={score} isHovered={isHovered} />
                
                {/* Center Score */}
                <div className="relative z-10 flex flex-col items-center justify-center">
                    <motion.span
                        className="text-[10px] font-medium uppercase tracking-wide mb-2"
                        style={{ color: 'rgba(255,255,255,0.70)', letterSpacing: '0.07em' }}
                        initial={{ opacity: 0, y: -3 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.3 }}
                    >
                        Overall Street Alignment
                    </motion.span>
                    
                    <motion.span
                        className="text-4xl font-bold mb-2"
                        style={{ 
                            color: scoreColor,
                            textShadow: isHovered ? `0 0 12px ${scoreColor}40` : 'none'
                        }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, duration: 0.3 }}
                    >
                        {score}
                    </motion.span>
                    
                    <motion.div
                        className="text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7, duration: 0.3 }}
                    >
                        <div className="text-[13px] font-bold mb-1" style={{ color: 'rgba(255,255,255,0.88)' }}>
                            {scoreLabel} Consensus
                        </div>
                        <div className="text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.65)' }}>
                            Weight: Medium
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* LOWER MIDDLE: Category Micro-Flowlets */}
            <CategoryMicroFlowlets segments={segments} isHovered={isHovered} />

            {/* BOTTOM: Micro Trendline Band */}
            <MicroTrendlineBand data={trendData} delay={0.9} isHovered={isHovered} />

            {/* FOOTER: Sources + Updated */}
            <motion.p
                className="text-xs text-center"
                style={{ color: 'rgba(255,255,255,0.70)', opacity: 0.82 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.82 }}
                transition={{ delay: 1.1 }}
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