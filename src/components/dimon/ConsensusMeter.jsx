
// 🔒 DESIGN LOCKED — OS HORIZON V4.0 + SPIRIT LAYER + RADIANT CAPSULE
// Last Updated: 2025-01-20
// Complete rebuild: Floating capsule + unified flowfield architecture
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
// RADIANT PANE + HYBRID FLOWFIELD ENGINE
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

    // Consensus coherence: 66 = moderate alignment with soft imperfections
    const consensusCoherence = score / 100;
    const alignmentFactor = 0.70;
    const curvatureVariance = 10;

    // Initialize particles
    useEffect(() => {
        particlesRef.current = Array.from({ length: 32 }, () => ({
            x: Math.random() * 260,
            y: Math.random() * 170,
            vx: (Math.random() - 0.5) * 0.13,
            vy: (Math.random() - 0.5) * 0.11,
            size: Math.random() * 1.4 + 0.9,
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
            
            const speedMultiplier = isHovered ? 1.06 : 1.0;
            particlesRef.current.forEach(p => {
                const flowAngle = Math.sin(p.x * 0.016 + elapsed * 0.22) * (curvatureVariance * Math.PI / 180);
                p.vx = Math.cos(flowAngle) * 0.12 * speedMultiplier;
                p.vy = Math.sin(flowAngle) * 0.08 * speedMultiplier;
                
                p.x += p.vx;
                p.y += p.vy;
                
                if (p.x < -15) p.x = 275;
                if (p.x > 275) p.x = -15;
                if (p.y < -15) p.y = 185;
                if (p.y > 185) p.y = -15;
            });
            
            rafId = requestAnimationFrame(animate);
        };
        
        rafId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(rafId);
    }, [shouldReduceMotion, isHovered, curvatureVariance]);

    // Generate flow line with smooth Bézier curvature
    const generateFlowLine = (startY, amplitude, phaseOffset, variance) => {
        const points = [];
        const steps = 75;
        
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const x = t * 260;
            
            const baseFlow = Math.sin((t * Math.PI * 2.4) + phaseOffset + (flowPhase * 0.16));
            const varianceFlow = Math.sin((t * Math.PI * 1.7) + variance) * 0.32;
            const breathe = Math.sin(flowPhase * 0.35) * 0.015;
            const hoverAmplitude = isHovered ? 1.02 : 1.0;
            const y = startY + (baseFlow + varianceFlow) * amplitude * (1 + breathe) * hoverAmplitude;
            
            points.push(`${x},${y}`);
        }
        
        return points.join(' ');
    };

    const diagonalDrift = Math.sin(flowPhase * (Math.PI / 15)) * 2.5;
    const shimmer = Math.cos(flowPhase * (Math.PI / 13)) * 0.012;

    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            {/* Radiant Pane */}
            <motion.div
                className="absolute"
                style={{
                    width: '235px',
                    height: '155px',
                    borderRadius: '34px',
                    background: `
                        linear-gradient(145deg, 
                            rgba(167, 209, 255, 0.14) 0%, 
                            rgba(123, 184, 255, 0.16) 40%,
                            rgba(155, 203, 255, 0.12) 100%
                        )
                    `,
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.10)',
                    boxShadow: `
                        inset 0 1px 2px rgba(255, 255, 255, 0.15),
                        inset 0 -1px 1px rgba(0, 0, 0, 0.10),
                        0 0 35px rgba(123, 184, 255, 0.10)
                    `,
                    willChange: 'transform, filter'
                }}
                animate={{
                    filter: isHovered ? 'brightness(1.03)' : 'brightness(1)',
                    rotateX: isHovered ? '0.7deg' : '0deg',
                    x: shouldReduceMotion ? 0 : diagonalDrift * 0.5,
                    y: shouldReduceMotion ? 0 : diagonalDrift * 0.3
                }}
                transition={{
                    filter: { duration: 0.12, ease: MOTION_TOKENS.CURVES.horizonIn },
                    rotateX: { duration: 0.12, ease: MOTION_TOKENS.CURVES.horizonIn },
                    x: { duration: 15, ease: 'easeInOut' },
                    y: { duration: 15, ease: 'easeInOut' }
                }}
            >
                {/* Internal diagonal streak */}
                <motion.div
                    className="absolute inset-0 rounded-[34px]"
                    style={{
                        background: 'linear-gradient(125deg, rgba(255, 255, 255, 0.10) 0%, transparent 45%, rgba(167, 209, 255, 0.05) 100%)',
                        opacity: 0.6 + shimmer
                    }}
                />

                {/* Top bloom */}
                <div 
                    className="absolute top-0 left-[18%] right-[18%] h-[18px] rounded-full"
                    style={{
                        background: 'linear-gradient(180deg, rgba(167, 209, 255, 0.15) 0%, transparent 100%)',
                        filter: 'blur(9px)'
                    }}
                />
            </motion.div>

            {/* Flowfield Layer */}
            <svg 
                width="260" 
                height="170" 
                viewBox="0 0 260 170"
                className="absolute"
                style={{
                    zIndex: 2,
                    opacity: isHovered ? 0.72 : 0.65
                }}
            >
                <defs>
                    <filter id="flow-blur-capsule">
                        <feGaussianBlur stdDeviation="1.4" />
                    </filter>
                    
                    <linearGradient id="flow-grad-capsule-1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#8EBFFF" stopOpacity="0" />
                        <stop offset="22%" stopColor="#9CCFFF" stopOpacity="0.058" />
                        <stop offset="50%" stopColor="#ABD7FF" stopOpacity="0.068" />
                        <stop offset="78%" stopColor="#9CCFFF" stopOpacity="0.058" />
                        <stop offset="100%" stopColor="#8EBFFF" stopOpacity="0" />
                    </linearGradient>
                    
                    <linearGradient id="flow-grad-capsule-2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#9CCFFF" stopOpacity="0" />
                        <stop offset="25%" stopColor="#ABD7FF" stopOpacity="0.052" />
                        <stop offset="50%" stopColor="#B8E2FF" stopOpacity="0.062" />
                        <stop offset="75%" stopColor="#ABD7FF" stopOpacity="0.052" />
                        <stop offset="100%" stopColor="#9CCFFF" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Generate 14 flow lines */}
                {Array.from({ length: 14 }).map((_, i) => {
                    const yPos = 38 + (i * (94 / 13));
                    const phaseOffset = (i / 14) * Math.PI * 2;
                    const variance = (1 - alignmentFactor) * ((i % 4) * 0.42);
                    const gradient = i % 2 === 0 ? 'flow-grad-capsule-1' : 'flow-grad-capsule-2';
                    
                    return (
                        <motion.polyline
                            key={i}
                            points={generateFlowLine(yPos, 7.8, phaseOffset, variance)}
                            fill="none"
                            stroke={`url(#${gradient})`}
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            filter="url(#flow-blur-capsule)"
                            initial={{ opacity: 0, pathLength: 0 }}
                            animate={{ opacity: 1, pathLength: 1 }}
                            transition={{ 
                                duration: 0.9, 
                                delay: 0.12 + (i * 0.032),
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
                            left: `${(particle.x / 260) * 100}%`,
                            top: `${(particle.y / 170) * 100}%`,
                            width: `${particle.size}px`,
                            height: `${particle.size}px`,
                            background: i % 3 === 0 ? '#C9EBFF' : '#FFFFFF',
                            opacity: particle.opacity,
                            filter: 'blur(0.6px)',
                            transform: `translate3d(${Math.cos(i) * 0.3}px, ${Math.sin(i) * 0.3}px, 0)`,
                            pointerEvents: 'none'
                        }}
                    />
                ))}
            </div>

            {/* Text contrast scrim */}
            <div 
                className="absolute"
                style={{
                    width: '145px',
                    height: '145px',
                    background: 'radial-gradient(circle, rgba(16, 20, 28, 0.26) 0%, transparent 63%)',
                    pointerEvents: 'none',
                    zIndex: 5
                }}
            />
        </div>
    );
};

// ============================================================================
// CATEGORY MICRO-FLOWLETS
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
        for (let i = 0; i <= 22; i++) {
            const t = i / 22;
            const x = t * 32;
            const y = 3.5 + Math.sin((t * Math.PI * 1.6) + phase) * 1.3;
            points.push(`${x},${y}`);
        }
        return points.join(' ');
    };

    return (
        <div className="flex justify-center gap-4 mb-7">
            {segments.map((segment, index) => {
                const colors = segmentColors[segment.name] || { main: '#AAB1B8', soft: '#D0D0D0' };
                const value = (segment.weight || 0) * 100;
                
                return (
                    <motion.div
                        key={segment.name}
                        className="flex flex-col items-center gap-2"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.65 + (index * 0.05), duration: 0.32 }}
                    >
                        {/* Micro-flowlet visualization */}
                        <motion.div
                            className="relative"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.12, ease: MOTION_TOKENS.CURVES.horizonIn }}
                        >
                            <svg width="32" height="7" viewBox="0 0 32 7">
                                <defs>
                                    <linearGradient id={`micro-grad-capsule-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor={colors.main} stopOpacity="0" />
                                        <stop offset="28%" stopColor={colors.main} stopOpacity="0.24" />
                                        <stop offset="72%" stopColor={colors.soft} stopOpacity="0.28" />
                                        <stop offset="100%" stopColor={colors.main} stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                
                                <motion.polyline
                                    points={generateMicroFlow(index * 0.9)}
                                    fill="none"
                                    stroke={`url(#micro-grad-capsule-${index})`}
                                    strokeWidth="1.3"
                                    strokeLinecap="round"
                                    animate={{
                                        opacity: isHovered ? 0.32 : 0.26
                                    }}
                                    transition={{ duration: 0.12, ease: MOTION_TOKENS.CURVES.horizonIn }}
                                />
                            </svg>
                            
                            {/* Soft glow on hover */}
                            <motion.div
                                className="absolute inset-0"
                                style={{
                                    background: `radial-gradient(ellipse, ${colors.main}25 0%, transparent 70%)`,
                                    filter: 'blur(5px)'
                                }}
                                animate={{
                                    opacity: isHovered ? 0.65 : 0
                                }}
                                transition={{ duration: 0.12 }}
                            />
                        </motion.div>

                        {/* Label and value */}
                        <div className="text-center">
                            <div className="text-[10px] font-medium" style={{ color: 'rgba(255,255,255,0.68)' }}>
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
// MICROTREND BAND
// ============================================================================
const MicrotrendBand = ({ data, delay, isHovered }) => {
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
    
    // Smooth curve interpolation (no sharp angles)
    const generateSmoothPath = () => {
        let path = '';
        data.forEach((value, index) => {
            const x = (index / (data.length - 1)) * 128;
            const y = 20 - ((value - minValue) / range) * 15;
            
            if (index === 0) {
                path += `M ${x},${y}`;
            } else {
                const prevX = ((index - 1) / (data.length - 1)) * 128;
                const prevY = 20 - ((data[index - 1] - minValue) / range) * 15;
                const cpX = (prevX + x) / 2;
                path += ` Q ${cpX},${prevY} ${x},${y}`;
            }
        });
        return path;
    };

    const slope = data[data.length - 1] - data[0];
    const baseColor = slope > 0 ? '#7FFFC1' : slope < 0 ? '#FFB8A3' : '#A3CFFF';

    return (
        <div className="flex items-center justify-center mb-7">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay, duration: 0.35 }}
            >
                <svg width="128" height="22" className="overflow-visible">
                    <defs>
                        <filter id="microtrend-glow">
                            <feGaussianBlur stdDeviation="1.3" result="coloredBlur"/>
                            <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>
                    
                    <motion.path
                        d={generateSmoothPath()}
                        fill="none"
                        stroke={baseColor}
                        strokeWidth="1.3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        filter="url(#microtrend-glow)"
                        style={{ opacity: 0.35 }}
                        animate={{
                            opacity: isHovered ? 0.41 : 0.35,
                            x: shouldReduceMotion ? 0 : Math.sin(driftPhase * 0.35) * 1.8
                        }}
                        transition={{
                            opacity: { duration: 0.12, ease: MOTION_TOKENS.CURVES.horizonIn },
                            x: { duration: 12, ease: 'linear' }
                        }}
                    />
                </svg>
            </motion.div>
        </div>
    );
};

// ============================================================================
// MAIN CONSENSUS COMPONENT (FLOATING RADIANT CAPSULE CONTAINER)
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
            className="h-full rounded-[30px] flex flex-col cursor-pointer relative overflow-hidden consensus-capsule"
            style={{
                padding: '30px 26px',
                // Liquid glass with 10% translucency (8-12% range)
                background: `
                    linear-gradient(180deg, 
                        rgba(20, 24, 32, 0.92) 0%,
                        rgba(18, 22, 30, 0.90) 100%
                    )
                `,
                backdropFilter: 'blur(20px) saturate(150%)',
                WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                // Outer glow (blur 20px, opacity 7%)
                boxShadow: `
                    0 0 20px rgba(123, 184, 255, 0.07),
                    0 20px 40px rgba(0, 0, 0, 0.20)
                `,
                willChange: 'transform, filter, box-shadow'
            }}
            whileHover={{ 
                y: -1.5,
                // +3% luminance increase
                filter: 'brightness(1.03)',
                boxShadow: `
                    0 0 22px rgba(123, 184, 255, 0.10),
                    0 22px 48px rgba(0, 0, 0, 0.26)
                `,
                transition: { 
                    duration: 0.12, 
                    ease: MOTION_TOKENS.CURVES.horizonIn 
                }
            }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            onClick={handleOpenDrawer}
        >
            {/* Subsurface gradient lighting (top +2% luminance) */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '60%',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 100%)',
                pointerEvents: 'none',
                borderRadius: '30px 30px 0 0'
            }} />

            {/* Subsurface gradient lighting (bottom -3% luminance) */}
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '60%',
                background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.03) 100%)',
                pointerEvents: 'none',
                borderRadius: '0 0 30px 30px'
            }} />

            {/* Soft edge bloom (1-2% opacity) */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: '20%',
                right: '20%',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.015), transparent)',
                filter: 'blur(2px)',
                pointerEvents: 'none'
            }} />

            {/* TOP: Title Row */}
            <div className="flex items-center justify-between mb-7" style={{ position: 'relative', zIndex: 10 }}>
                <motion.h2 
                    className="text-base font-semibold"
                    style={{ color: 'rgba(255,255,255,0.96)' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.08 }}
                >
                    Consensus
                </motion.h2>
                <motion.div
                    className="px-3 py-1.5 rounded-full text-xs font-semibold"
                    style={{
                        background: 'rgba(255, 255, 255, 0.09)',
                        color: 'rgba(255,255,255,0.76)',
                        fontSize: '11px'
                    }}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 0.76, scale: 1 }}
                    transition={{ delay: 0.18 }}
                >
                    {score}%
                </motion.div>
            </div>

            {/* MIDDLE: Primary Content (Radiant Pane + Flowfield + Score) */}
            <div className="relative flex items-center justify-center mb-9" style={{ minHeight: '170px', zIndex: 10 }}>
                <RadiantPaneFlowfield score={score} isHovered={isHovered} />
                
                {/* Center Score Stack */}
                <div className="relative z-10 flex flex-col items-center justify-center">
                    <motion.span
                        className="text-[10px] font-medium uppercase tracking-wide mb-3"
                        style={{ 
                            color: 'rgba(255,255,255,0.72)', 
                            letterSpacing: '0.08em',
                            textShadow: '0 0 4px rgba(0,0,0,0.15)'
                        }}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.38, duration: 0.32 }}
                    >
                        Overall Street Alignment
                    </motion.span>
                    
                    <motion.span
                        className="text-[40px] font-bold mb-3"
                        style={{ 
                            color: scoreColor,
                            textShadow: isHovered ? `0 0 14px ${scoreColor}38` : `0 0 8px ${scoreColor}22`,
                            letterSpacing: '-0.02em'
                        }}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.48, duration: 0.35 }}
                    >
                        {score}
                    </motion.span>
                    
                    <motion.div
                        className="text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.68, duration: 0.32 }}
                    >
                        <div className="text-[14px] font-bold mb-1.5" style={{ color: 'rgba(255,255,255,0.90)' }}>
                            {scoreLabel} Consensus
                        </div>
                        <div className="text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.66)' }}>
                            Weight: Medium
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* LOWER MIDDLE: Category Micro-Flowlets */}
            <div style={{ position: 'relative', zIndex: 10 }}>
                <CategoryMicroFlowlets segments={segments} isHovered={isHovered} />
            </div>

            {/* BOTTOM: Microtrend Band */}
            <div style={{ position: 'relative', zIndex: 10 }}>
                <MicrotrendBand data={trendData} delay={0.95} isHovered={isHovered} />
            </div>

            {/* FOOTER: Metadata */}
            <motion.p
                className="text-xs text-center"
                style={{ color: 'rgba(255,255,255,0.68)', opacity: 0.80, position: 'relative', zIndex: 10 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.80 }}
                transition={{ delay: 1.15 }}
            >
                Based on {sourcesCount} sources • Updated {updatedAgo}
            </motion.p>

            {/* Hover Hint */}
            <motion.div 
                className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center text-xs pointer-events-none"
                style={{ color: 'rgba(255,255,255,0.58)', zIndex: 10 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.2 }}
            >
                <Activity className="w-3 h-3 mr-1.5" />
                View detailed breakdown
            </motion.div>

            <style jsx>{`
                .consensus-capsule {
                    transform: translateZ(0);
                    backface-visibility: hidden;
                }

                .consensus-capsule * {
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
