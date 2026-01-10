import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const getScoreColor = (score) => {
  if (score >= 76) return { primary: '#58E3A4', secondary: '#73E6D2', glow: 'rgba(88, 227, 164, 0.25)' };
  if (score >= 61) return { primary: '#A8B3C7', secondary: '#B8C5D9', glow: 'rgba(168, 179, 199, 0.25)' };
  if (score >= 41) return { primary: '#FFB464', secondary: '#FFC989', glow: 'rgba(255, 180, 100, 0.25)' };
  return { primary: '#FF6A7A', secondary: '#FF8A97', glow: 'rgba(255, 106, 122, 0.25)' };
};

const TrajectorySparkline = ({ data, color }) => {
  const [pathD, setPathD] = useState('');
  const [endPoint, setEndPoint] = useState({ x: 0, y: 0 });
  const prevDataRef = useRef([]);

  useEffect(() => {
    const width = 240;
    const height = 60;
    const padding = 4;
    
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const points = data.map((value, i) => {
      const xPos = (i / (data.length - 1)) * width;
      const yPos = (height - padding) - ((value - min) / range) * (height - padding * 2);
      return { x: xPos, y: yPos };
    });

    const newPathD = points.map((point, i) => 
      `${i === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`
    ).join(' ');

    const lastPoint = points[points.length - 1];

    setPathD(newPathD);
    setEndPoint(lastPoint);
    prevDataRef.current = data;
  }, [data]);

  return (
    <svg width="240" height="60" className="overflow-visible">
      <defs>
        <linearGradient id="trajectoryFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.12" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      <motion.path
        d={`${pathD} L 240 60 L 0 60 Z`}
        fill="url(#trajectoryFill)"
        animate={{ d: `${pathD} L 240 60 L 0 60 Z` }}
        transition={{ duration: 0.8, ease: [0.26, 0.11, 0.26, 1.0] }}
      />

      <motion.path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.85"
        animate={{ d: pathD }}
        transition={{ duration: 0.8, ease: [0.26, 0.11, 0.26, 1.0] }}
      />

      <motion.circle
        cx={endPoint.x}
        cy={endPoint.y}
        r="4"
        fill={color}
        style={{
          filter: `drop-shadow(0 0 6px ${color}88)`
        }}
        animate={{ cx: endPoint.x, cy: endPoint.y }}
        transition={{ duration: 0.8, ease: [0.26, 0.11, 0.26, 1.0] }}
      />
    </svg>
  );
};

export default function PulseRadialHero({ score, trend, insight, sectorBreakdown, trendIndicator, sparklineData }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const colors = { primary: '#FFB464', secondary: '#FFC989', glow: 'rgba(255, 180, 100, 0.25)' };
  
  useEffect(() => {
    const start = animatedScore;
    const target = score;
    const duration = 1000;
    let startTime = null;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const eased = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
      
      setAnimatedScore(start + (target - start) * eased);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [score]);

  const radius = 140;
  const strokeWidth = 18;
  const normalizedRadius = radius - strokeWidth * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="relative overflow-hidden rounded-[28px]" style={{
      padding: '56px 64px',
      background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.035) 0%, rgba(255, 255, 255, 0.018) 100%)',
      backdropFilter: 'blur(28px) saturate(165%)',
      WebkitBackdropFilter: 'blur(28px) saturate(165%)',
      border: '1px solid rgba(255,255,255,0.06)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 8px 32px rgba(0,0,0,0.08)'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: '15%',
        right: '15%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)',
        pointerEvents: 'none'
      }} />

      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)`,
          filter: 'blur(80px)',
          pointerEvents: 'none',
          opacity: 0.6
        }}
      />

      <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
        {/* Radial Confidence Meter */}
        <div className="relative flex items-center justify-center" style={{ minWidth: '340px' }}>
          <svg width="340" height="340" className="transform -rotate-90">
            {/* Background ring */}
            <circle
              cx="170"
              cy="170"
              r={normalizedRadius}
              fill="none"
              stroke="rgba(255, 255, 255, 0.04)"
              strokeWidth={strokeWidth}
            />
            
            {/* Animated progress ring */}
            <motion.circle
              cx="170"
              cy="170"
              r={normalizedRadius}
              fill="none"
              stroke={`url(#pulseGradient)`}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{
                filter: `drop-shadow(0 0 12px ${colors.glow})`,
                transition: 'stroke-dashoffset 0.8s cubic-bezier(0.26, 0.11, 0.26, 1.0)'
              }}
            />
            
            {/* Gradient definition */}
            <defs>
              <linearGradient id="pulseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={colors.primary} stopOpacity="1" />
                <stop offset="100%" stopColor={colors.secondary} stopOpacity="0.9" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-7xl font-bold tracking-[-0.03em] mb-2" style={{
              color: 'rgba(255,255,255,0.98)',
              fontVariantNumeric: 'tabular-nums'
            }}>
              {Math.round(animatedScore)}
            </div>
            
            <div className="flex items-center gap-2 mb-1">
              <div className="text-lg font-semibold" style={{ 
                color: colors.primary,
                fontVariantNumeric: 'tabular-nums'
              }}>
                {trendIndicator.label} {trendIndicator.symbol}
              </div>
            </div>

            <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.42)' }}>
              Confidence
            </div>
          </div>

          {/* Orbital data points */}
          {sparklineData && sparklineData.slice(-3).map((value, i) => {
            const angle = (i * 120 - 60) * (Math.PI / 180);
            const orbitalRadius = 185;
            const x = 170 + orbitalRadius * Math.cos(angle);
            const y = 170 + orbitalRadius * Math.sin(angle);
            
            return (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${x}px`,
                  top: `${y}px`,
                  transform: 'translate(-50%, -50%)'
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.6, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.4, ease: [0.26, 0.11, 0.26, 1.0] }}
              >
                <div className="w-2 h-2 rounded-full" style={{ 
                  background: colors.primary,
                  boxShadow: `0 0 8px ${colors.glow}`
                }} />
              </motion.div>
            );
          })}
        </div>

        {/* Insight panel */}
        <div className="flex-1 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-[20px]" style={{
              padding: '16px 28px',
              background: `linear-gradient(180deg, ${colors.primary}18 0%, ${colors.primary}10 100%)`,
              border: `1px solid ${colors.primary}28`,
              width: 'fit-content'
            }}>
              {trendIndicator.symbol === '▲' ? (
                <TrendingUp className="w-5 h-5" style={{ color: colors.primary }} strokeWidth={2.2} />
              ) : trendIndicator.symbol === '▼' ? (
                <TrendingDown className="w-5 h-5" style={{ color: colors.primary }} strokeWidth={2.2} />
              ) : (
                <div className="w-5 h-1 rounded-full" style={{ background: colors.primary }} />
              )}
              <span className="text-[17px] font-bold" style={{ color: colors.primary }}>
                {trend}
              </span>
            </div>
            
            <div className="text-[14px] leading-relaxed" style={{ 
              color: 'rgba(255,255,255,0.58)',
              fontWeight: 500
            }}>
              {sectorBreakdown}
            </div>
          </div>

          <p className="text-[19px] leading-loose max-w-2xl" style={{ 
            color: 'rgba(255,255,255,0.88)',
            fontWeight: 500,
            letterSpacing: '-0.01em'
          }}>
            {insight}
          </p>

          {/* Mini trend graph */}
          {sparklineData && sparklineData.length > 1 && (
            <div className="pt-4">
              <TrajectorySparkline data={sparklineData} color={colors.primary} />
              <div className="text-[11px] font-semibold uppercase tracking-wider mt-2" style={{ color: `${colors.primary}99` }}>
                7-Day Trajectory
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}