
import React from 'react';
import { motion } from 'framer-motion';

export default function RadialGauge({ score, isHovered }) {
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const scoreNormalised = Math.max(0, Math.min(100, score)); // clamp score between 0 and 100

    // Calculate arc lengths for 270-degree gauge (3/4 of a full circle)
    const gaugeArcLength = circumference * 0.75;
    // Calculate the strokeDashoffset for the progress based on the 270-degree arc
    const animatedOffset = gaugeArcLength - (scoreNormalised / 100) * gaugeArcLength;

    const getScoreDescriptor = (s) => {
        if (s > 75) return { text: "Strong Bullish", color: "#10B981", intensity: "high" };
        if (s > 60) return { text: "Mildly Bullish", color: "#34D399", intensity: "medium" };
        if (s > 40) return { text: "Neutral", color: "#F59E0B", intensity: "low" };
        if (s > 25) return { text: "Mildly Bearish", color: "#F97316", intensity: "medium" };
        return { text: "Strong Bearish", color: "#EF4444", intensity: "high" };
    };
    
    // Convert score (0-100) to angle (-135 to 135 degrees) for a 270-degree sweep
    const angle = (scoreNormalised / 100) * 270 - 135;

    const getColorForScore = (s) => {
        const red = [239, 68, 68];
        const yellow = [245, 158, 11];
        const green = [16, 185, 129];
        
        const p = s / 100;
        if (p < 0.5) {
            const ratio = p * 2;
            const r = Math.round(red[0] + (yellow[0] - red[0]) * ratio);
            const g = Math.round(red[1] + (yellow[1] - red[1]) * ratio);
            const b = Math.round(red[2] + (yellow[2] - red[2]) * ratio);
            return `rgb(${r},${g},${b})`;
        } else {
            const ratio = (p - 0.5) * 2;
            const r = Math.round(yellow[0] + (green[0] - yellow[0]) * ratio);
            const g = Math.round(yellow[1] + (green[1] - yellow[1]) * ratio);
            const b = Math.round(yellow[2] + (green[2] - yellow[2]) * ratio);
            return `rgb(${r},${g},${b})`;
        }
    };

    const scoreColor = getColorForScore(scoreNormalised);
    const descriptor = getScoreDescriptor(scoreNormalised);

    // Glow intensity based on consensus strength
    const getGlowIntensity = (intensity) => {
        switch (intensity) {
            case 'high': return { blur: 16, opacity: 0.8 };
            case 'medium': return { blur: 12, opacity: 0.6 };
            default: return { blur: 8, opacity: 0.4 };
        }
    };

    const glowSettings = getGlowIntensity(descriptor.intensity);

    return (
        <div className="relative flex flex-col items-center">
            {/* Main Gauge Container */}
            <motion.div 
                className="relative w-52 h-52 flex items-center justify-center"
                animate={{ 
                    scale: isHovered ? 1.08 : 1,
                    rotate: isHovered ? [0, 1, 0] : 0
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
                <svg width="200" height="200" className="transform -rotate-90">
                    <defs>
                        {/* Enhanced Gradient Definitions for Arc */}
                        <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#EF4444" stopOpacity="0.8" />
                            <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.9" />
                            <stop offset="100%" stopColor="#10B981" stopOpacity="0.8" />
                        </linearGradient>
                        
                        {/* Enhanced Shimmer Sweep Effect */}
                        <linearGradient id="shimmerSweep" x1="0%" y1="0%" x2="100%" y2="0%">
                            <motion.stop 
                                offset="0%" 
                                stopColor="rgba(255,255,255,0.0)"
                                animate={{ 
                                    offset: ["0%", "40%", "60%", "100%"],
                                    stopColor: ["rgba(255,255,255,0.0)", "rgba(255,255,255,0.0)", "rgba(255,255,255,0.6)", "rgba(255,255,255,0.0)"] 
                                }}
                                transition={{ 
                                    duration: isHovered ? 4 : 8, 
                                    repeat: Infinity, 
                                    ease: [0.25, 0.1, 0.25, 1] 
                                }}
                            />
                            <motion.stop 
                                offset="50%" 
                                stopColor="rgba(255,255,255,0.0)"
                                animate={{ 
                                    offset: ["10%", "50%", "70%", "110%"],
                                    stopColor: ["rgba(255,255,255,0.0)", "rgba(255,255,255,0.0)", "rgba(255,255,255,0.8)", "rgba(255,255,255,0.0)"] 
                                }}
                                transition={{ 
                                    duration: isHovered ? 4 : 8, 
                                    repeat: Infinity, 
                                    ease: [0.25, 0.1, 0.25, 1],
                                    delay: 0.2 
                                }}
                            />
                            <stop offset="100%" stopColor="rgba(255,255,255,0.0)" />
                        </linearGradient>
                        
                        {/* Enhanced Glow Filter */}
                        <filter id="glow">
                            <feGaussianBlur stdDeviation={isHovered ? "5" : "3"} result="coloredBlur"/>
                            <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>
                    
                    {/* Background Arc */}
                    <circle
                        cx="100"
                        cy="100"
                        r={radius}
                        fill="none"
                        stroke={isHovered ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.08)"}
                        strokeWidth="12"
                        strokeDasharray={`${gaugeArcLength} ${circumference}`}
                        transform="rotate(135 100 100)"
                    />
                    
                    {/* Foreground Animated Arc */}
                    <motion.circle
                        cx="100"
                        cy="100"
                        r={radius}
                        fill="none"
                        stroke="url(#gaugeGradient)"
                        strokeWidth={isHovered ? "14" : "12"}
                        strokeLinecap="round"
                        strokeDasharray={`${gaugeArcLength} ${circumference}`}
                        initial={{ strokeDashoffset: gaugeArcLength }}
                        animate={{ strokeDashoffset: animatedOffset }}
                        transition={{ duration: 2.5, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                        transform="rotate(135 100 100)"
                        filter="url(#glow)"
                    />
                     {/* Shimmer Sweep Overlay */}
                     <motion.circle
                        cx="100"
                        cy="100"
                        r={radius}
                        fill="none"
                        stroke="url(#shimmerSweep)"
                        strokeWidth={isHovered ? "15" : "13"}
                        strokeLinecap="round"
                        strokeDasharray={`${gaugeArcLength} ${circumference}`}
                        initial={{ strokeDashoffset: gaugeArcLength }}
                        animate={{ strokeDashoffset: animatedOffset }}
                        transition={{ duration: 2.5, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                        transform="rotate(135 100 100)"
                        opacity={isHovered ? 1 : 0.8}
                    />
                </svg>

                {/* Enhanced Needle */}
                <motion.div
                    className="absolute w-1 h-2/5 origin-bottom"
                    style={{ top: '10%', left: '50%', transform: `translateX(-50%) rotate(${angle}deg)` }}
                    animate={{ 
                        rotate: isHovered 
                            ? [angle - 4, angle + 4, angle - 4] 
                            : [angle - 1, angle + 1, angle - 1]
                    }}
                    transition={{ 
                        duration: isHovered ? 2 : 4, 
                        repeat: Infinity, 
                        ease: 'easeInOut' 
                    }}
                >
                    <div className="w-full h-full bg-gradient-to-t from-gray-400 to-white rounded-t-full" />
                    <motion.div 
                        className="absolute top-0 -left-0.5 w-2 h-2 rounded-full"
                        style={{ background: scoreColor }}
                        animate={{ 
                            scale: isHovered ? [1, 1.5, 1] : [1, 1.2, 1],
                            boxShadow: isHovered 
                                ? [`0 0 8px ${scoreColor}`, `0 0 16px ${scoreColor}`, `0 0 8px ${scoreColor}`]
                                : [`0 0 4px ${scoreColor}`, `0 0 8px ${scoreColor}`, `0 0 4px ${scoreColor}`]
                        }}
                        transition={{ 
                            duration: isHovered ? 1.5 : 2, 
                            repeat: Infinity, 
                            ease: 'easeInOut' 
                        }}
                    />
                </motion.div>

                {/* Enhanced Center Orb */}
                <motion.div 
                    className="absolute w-24 h-24 rounded-full border border-white/10 flex items-center justify-center text-center"
                    style={{
                        background: 'radial-gradient(circle, rgba(30, 32, 40, 0.9) 0%, rgba(15, 16, 20, 0.95) 100%)',
                    }}
                    animate={{ 
                        scale: isHovered ? [1, 1.06, 1] : [1, 1.03, 1],
                        borderColor: isHovered ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)'
                    }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                    {/* Enhanced Breathing Glow behind the number */}
                    <motion.div 
                        className="absolute inset-0 rounded-full"
                        style={{
                           boxShadow: `0 0 ${glowSettings.blur}px ${scoreColor}`,
                        }}
                        animate={{ 
                            opacity: isHovered 
                                ? [glowSettings.opacity + 0.2, glowSettings.opacity + 0.5, glowSettings.opacity + 0.2] 
                                : [glowSettings.opacity, glowSettings.opacity + 0.1, glowSettings.opacity],
                            boxShadow: isHovered
                                ? [`0 0 ${glowSettings.blur + 8}px ${scoreColor}`, `0 0 ${glowSettings.blur + 16}px ${scoreColor}`, `0 0 ${glowSettings.blur + 8}px ${scoreColor}`]
                                : [`0 0 ${glowSettings.blur}px ${scoreColor}`, `0 0 ${glowSettings.blur + 4}px ${scoreColor}`, `0 0 ${glowSettings.blur}px ${scoreColor}`]
                        }}
                        transition={{ 
                            duration: isHovered ? 3 : 6, 
                            repeat: Infinity, 
                            ease: "easeInOut" 
                        }}
                    />
                    
                    <motion.div
                        className="relative z-10"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ 
                            opacity: 1, 
                            y: 0,
                            scale: isHovered ? 1.05 : 1
                        }}
                        transition={{ delay: 1 }}
                    >
                         <h3 
                            className="text-4xl font-bold tracking-tighter text-transparent bg-clip-text"
                            style={{ 
                                backgroundImage: `linear-gradient(135deg, white, ${descriptor.color})`,
                                textShadow: isHovered 
                                    ? `0 4px 20px ${scoreColor}60` 
                                    : `0 2px 10px ${scoreColor}40`
                             }}
                        >
                            {Math.round(score)}
                        </h3>
                    </motion.div>
                </motion.div>
            </motion.div>

            {/* Enhanced Descriptor Text */}
            <motion.div 
                className="mt-4 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
            >
                <h4 
                    className="font-semibold text-lg" 
                    style={{ 
                        color: descriptor.color,
                        textShadow: isHovered 
                            ? `0 0 25px ${descriptor.color}70`
                            : `0 0 15px ${descriptor.color}50`
                    }}
                >
                    {descriptor.text}
                </h4>
            </motion.div>
        </div>
    );
}
