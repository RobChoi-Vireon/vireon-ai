import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import { TrendingUp, TrendingDown, Anchor, ExternalLink } from 'lucide-react';

const TriangularProbabilitySpectrum = ({ scenarios }) => {
  const [hoveredVertex, setHoveredVertex] = useState(null);
  const [hoveredCenterOrb, setHoveredCenterOrb] = useState(false);
  const [counts, setCounts] = useState({ bull: 0, base: 0, bear: 0 });
  const [isTooltipHovered, setIsTooltipHovered] = useState(false);
  
  // Extract probabilities
  const bullProb = scenarios.find(s => s.type === 'Bull')?.probability || 0;
  const baseProb = scenarios.find(s => s.type === 'Base')?.probability || 0;
  const bearProb = scenarios.find(s => s.type === 'Bear')?.probability || 0;
  
  // Normalize probabilities
  const total = bullProb + baseProb + bearProb;
  const normalizedBull = total === 0 ? 0 : bullProb / total;
  const normalizedBase = total === 0 ? 0 : baseProb / total;
  const normalizedBear = total === 0 ? 0 : bearProb / total;

  // Animated count-up
  useEffect(() => {
    const timer = setTimeout(() => {
      setCounts({ bull: bullProb, base: baseProb, bear: bearProb });
    }, 500);
    return () => clearTimeout(timer);
  }, [bullProb, baseProb, bearProb]);
  
  // Triangle dimensions
  const size = 320;
  const containerSize = size + 120;
  const centerX = containerSize / 2;
  const centerY = containerSize / 2;
  const radius = size * 0.32;
  
  // Calculate triangle vertices
  const vertices = {
    bull: { 
      x: centerX, 
      y: centerY - radius,
      label: 'Bull Case',
      color: '#10B981',
      glowColor: 'rgba(16, 185, 129, 0.5)',
      hoverColor: 'rgba(16, 185, 129, 0.9)'
    },
    base: { 
      x: centerX + radius * Math.cos(Math.PI / 6), 
      y: centerY + radius * Math.sin(Math.PI / 6),
      label: 'Base Case',
      color: '#3B82F6',
      glowColor: 'rgba(59, 130, 246, 0.5)',
      hoverColor: 'rgba(59, 130, 246, 0.9)'
    },
    bear: { 
      x: centerX - radius * Math.cos(Math.PI / 6), 
      y: centerY + radius * Math.sin(Math.PI / 6),
      label: 'Bear Case',
      color: '#EF4444',
      glowColor: 'rgba(239, 68, 68, 0.5)',
      hoverColor: 'rgba(239, 68, 68, 0.9)'
    }
  };
  
  // Calculate center orb position
  const orbX = normalizedBull * vertices.bull.x + normalizedBase * vertices.base.x + normalizedBear * vertices.bear.x;
  const orbY = normalizedBull * vertices.bull.y + normalizedBase * vertices.base.y + normalizedBear * vertices.bear.y;

  const handleMouseEnter = (vertex) => {
    setHoveredVertex(vertex);
  };

  const handleMouseLeave = () => {
    if (!isTooltipHovered) {
      setHoveredVertex(null);
    }
  };

  const handleTooltipMouseEnter = () => {
    setIsTooltipHovered(true);
  };

  const handleTooltipMouseLeave = () => {
    setIsTooltipHovered(false);
    setHoveredVertex(null);
  };

  const handleCenterOrbMouseEnter = () => {
    setHoveredCenterOrb(true);
  };

  const handleCenterOrbMouseLeave = () => {
    setHoveredCenterOrb(false);
  };
  
  return (
    <div className="relative w-full flex justify-center mb-8">
      <motion.div
        className="relative overflow-visible backdrop-blur-xl border shadow-2xl flex items-center justify-center"
        style={{
          background: 'linear-gradient(145deg, rgba(10, 15, 30, 0.6), rgba(15, 23, 42, 0.4))',
          borderColor: 'rgba(79, 70, 229, 0.15)',
          width: `${containerSize}px`,
          height: `${containerSize}px`,
          borderRadius: '2rem'
        }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
      >
        {/* Subtle Aurora Background */}
        <motion.div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            background: 'conic-gradient(from 0deg, #10B981, #3B82F6, #EF4444, #10B981)',
            filter: 'blur(50px)'
          }}
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
          }}
        />
        
        <svg width={containerSize} height={containerSize} className="relative z-10" style={{ overflow: 'visible' }}>
          <defs>
            {/* Refined Gradients */}
            <radialGradient id="triangleGradient" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="rgba(79, 70, 229, 0.12)" />
              <stop offset="70%" stopColor="rgba(59, 130, 246, 0.06)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            
            {/* Edge Gradients */}
            <linearGradient id="edgeGradient1" gradientUnits="userSpaceOnUse" x1={vertices.bull.x} y1={vertices.bull.y} x2={vertices.base.x} y2={vertices.base.y}>
              <stop offset="0%" stopColor={vertices.bull.color} stopOpacity="0.6" />
              <stop offset="50%" stopColor={vertices.base.color} stopOpacity="0.4" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
            
            <linearGradient id="edgeGradient2" gradientUnits="userSpaceOnUse" x1={vertices.base.x} y1={vertices.base.y} x2={vertices.bear.x} y2={vertices.bear.y}>
              <stop offset="0%" stopColor={vertices.base.color} stopOpacity="0.6" />
              <stop offset="50%" stopColor={vertices.bear.color} stopOpacity="0.4" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
            
            <linearGradient id="edgeGradient3" gradientUnits="userSpaceOnUse" x1={vertices.bear.x} y1={vertices.bear.y} x2={vertices.bull.x} y2={vertices.bull.y}>
              <stop offset="0%" stopColor={vertices.bear.color} stopOpacity="0.6" />
              <stop offset="50%" stopColor={vertices.bull.color} stopOpacity="0.4" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
            
            {/* Glow Filters */}
            <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            
            <filter id="orbGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="7" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Triangle Background */}
          <motion.polygon
            points={`${vertices.bull.x},${vertices.bull.y} ${vertices.base.x},${vertices.base.y} ${vertices.bear.x},${vertices.bear.y}`}
            fill="url(#triangleGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          />
          
          {/* Triangle Edges */}
          {Object.entries(vertices).map(([key, vertex], index) => {
            const nextKey = Object.keys(vertices)[(index + 1) % 3];
            const nextVertex = vertices[nextKey];
            const gradientId = `edgeGradient${index + 1}`;
            
            return (
              <g key={`edge-${key}`}>
                <motion.line
                  x1={vertex.x} y1={vertex.y}
                  x2={nextVertex.x} y2={nextVertex.y}
                  stroke={`url(#${gradientId})`}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.7 }}
                  transition={{ delay: 0.6 + index * 0.2, duration: 1 }}
                />
                
                {/* Light Sweep */}
                <motion.circle
                  r="2.5"
                  fill="#ffffff"
                  filter="url(#nodeGlow)"
                  animate={{
                    cx: [vertex.x, nextVertex.x, vertex.x],
                    cy: [vertex.y, nextVertex.y, vertex.y],
                    opacity: [0, 0.7, 0]
                  }}
                  transition={{
                    duration: 6,
                    delay: index * 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </g>
            );
          })}
          
          {/* Node Spheres */}
          {Object.entries(vertices).map(([key, vertex]) => {
            const isHovered = hoveredVertex === key;
            const prob = scenarios.find(s => s.type === key.charAt(0).toUpperCase() + key.slice(1))?.probability || 0;
            
            return (
              <g key={key}>
                {/* Glow Base */}
                <motion.circle
                  cx={vertex.x} cy={vertex.y}
                  r={isHovered ? 16 : 13}
                  fill={vertex.glowColor}
                  filter="url(#nodeGlow)"
                  animate={{
                    r: [isHovered ? 16 : 13, isHovered ? 18 : 15, isHovered ? 16 : 13],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                {/* Main Node */}
                <motion.circle
                  cx={vertex.x} cy={vertex.y}
                  r={isHovered ? 11 : 9}
                  fill={vertex.color}
                  className="cursor-pointer"
                  onMouseEnter={() => handleMouseEnter(key)}
                  onMouseLeave={handleMouseLeave}
                  animate={{
                    scale: isHovered ? [1, 1.1, 1] : [1, 1.05, 1],
                    fill: isHovered ? vertex.hoverColor : vertex.color
                  }}
                  transition={{
                    scale: { duration: isHovered ? 0.6 : 4, repeat: Infinity },
                    fill: { duration: 0.3 }
                  }}
                  style={{
                    filter: `drop-shadow(0 0 10px ${vertex.glowColor})`,
                    pointerEvents: 'all'
                  }}
                />
                
                {/* Labels */}
                <motion.text
                  x={vertex.x}
                  y={key === 'bull' ? vertex.y - 32 : vertex.y + 38}
                  textAnchor="middle"
                  className="text-sm font-bold fill-white pointer-events-none"
                  style={{ 
                    fontFamily: 'Inter, sans-serif',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'
                  }}
                  animate={{
                    scale: isHovered ? 1.1 : 1,
                    fill: isHovered ? vertex.color : '#ffffff'
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {vertex.label}
                </motion.text>
                
                {/* Percentage */}
                <motion.text
                  x={vertex.x}
                  y={key === 'bull' ? vertex.y - 52 : vertex.y + 60}
                  textAnchor="middle"
                  className="text-2xl font-black pointer-events-none"
                  style={{ 
                    fill: vertex.color,
                    fontFamily: 'Inter, sans-serif',
                    filter: `drop-shadow(0 2px 8px ${vertex.glowColor})`
                  }}
                  animate={{
                    scale: isHovered ? [1, 1.2, 1] : 1
                  }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.tspan
                    animate={{ opacity: [0, 1] }}
                    transition={{ duration: 0.6, delay: 1 }}
                  >
                    {Math.round(counts[key] || prob)}%
                  </motion.tspan>
                </motion.text>
              </g>
            );
          })}
          
          {/* Center Orb */}
          <motion.g>
            {/* Orb Trails */}
            <motion.circle
              cx={orbX} cy={orbY}
              r="18"
              fill="none"
              stroke="#4F46E5"
              strokeWidth="2"
              strokeOpacity="0.25"
              animate={{
                r: [18, 32, 18],
                strokeOpacity: [0.25, 0, 0.25]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
            
            {/* Main Orb */}
            <motion.circle
              cx={orbX} cy={orbY}
              r="7"
              className="cursor-pointer"
              filter="url(#orbGlow)"
              onMouseEnter={handleCenterOrbMouseEnter}
              onMouseLeave={handleCenterOrbMouseLeave}
              animate={{
                cx: orbX,
                cy: orbY,
                fill: hoveredVertex ? 
                  (hoveredVertex === 'bull' ? '#10B981' : 
                   hoveredVertex === 'base' ? '#3B82F6' : 
                   hoveredVertex === 'bear' ? '#EF4444' : '#4F46E5') : 
                  hoveredCenterOrb ? '#6366F1' : '#4F46E5',
                scale: hoveredCenterOrb ? [1, 1.3, 1] : 1
              }}
              transition={{
                cx: { duration: 1.2, ease: [0.23, 1, 0.32, 1] },
                cy: { duration: 1.2, ease: [0.23, 1, 0.32, 1] },
                fill: { duration: 0.4 },
                scale: { duration: hoveredCenterOrb ? 0.8 : 2, repeat: hoveredCenterOrb ? Infinity : 0 }
              }}
              style={{
                filter: `drop-shadow(0 0 12px rgba(79, 70, 229, 0.7))`,
                pointerEvents: 'all'
              }}
            />
            
            {/* Inner Highlight */}
            <motion.circle
              cx={orbX} cy={orbY}
              r="3.5"
              fill="#ffffff"
              opacity="0.5"
              className="pointer-events-none"
              animate={{
                cx: orbX,
                cy: orbY,
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{
                cx: { duration: 1.2, ease: [0.23, 1, 0.32, 1] },
                cy: { duration: 1.2, ease: [0.23, 1, 0.32, 1] },
                opacity: { duration: 2, repeat: Infinity }
              }}
            />
          </motion.g>
          
          {/* Tooltip */}
          <AnimatePresence>
            {hoveredVertex && (
              <motion.g
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                style={{ pointerEvents: 'none' }}
              >
                <motion.rect
                  x={containerSize / 2 - 100}
                  y={containerSize / 2 - 60}
                  width="200"
                  height="120"
                  rx="16"
                  fill="rgba(0, 0, 0, 0.92)"
                  stroke="rgba(79, 70, 229, 0.3)"
                  strokeWidth="1"
                  filter="url(#nodeGlow)"
                />
                
                <foreignObject
                  x={containerSize / 2 - 90}
                  y={containerSize / 2 - 55}
                  width="180"
                  height="110"
                  style={{ pointerEvents: 'none' }}
                >
                  <div 
                    xmlns="http://www.w3.org/1999/xhtml"
                    className="text-center text-white h-full flex flex-col justify-start items-center p-2"
                    style={{ fontFamily: 'Inter, sans-serif', pointerEvents: 'none' }}
                  >
                    <h3 className="text-base font-bold">
                      {vertices[hoveredVertex].label}
                    </h3>
                    <p className="text-xs text-gray-300 mt-1">
                      Confidence: {scenarios.find(s => s.type === hoveredVertex.charAt(0).toUpperCase() + hoveredVertex.slice(1))?.confidence || 'N/A'}
                    </p>
                    <p className="text-xs font-semibold text-gray-400 mt-2">
                      Key Drivers:
                    </p>
                    <div className="text-xs text-gray-400 leading-tight mt-1 space-y-1">
                      {(scenarios.find(s => s.type === hoveredVertex.charAt(0).toUpperCase() + hoveredVertex.slice(1))?.drivers || []).slice(0, 2).map((driver, i) => (
                        <p key={i} className="break-words">{driver}</p>
                      ))}
                    </div>
                  </div>
                </foreignObject>
              </motion.g>
            )}
          </AnimatePresence>

          {/* Center Orb Tooltip */}
          <AnimatePresence>
            {hoveredCenterOrb && (
              <motion.g
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                style={{ pointerEvents: 'none' }}
              >
                <motion.rect
                  x={containerSize / 2 - 110}
                  y={containerSize / 2 + 40}
                  width="220"
                  height="100"
                  rx="16"
                  fill="rgba(0, 0, 0, 0.92)"
                  stroke="rgba(79, 70, 229, 0.3)"
                  strokeWidth="1"
                  filter="url(#nodeGlow)"
                />
                
                <foreignObject
                  x={containerSize / 2 - 100}
                  y={containerSize / 2 + 45}
                  width="200"
                  height="90"
                  style={{ pointerEvents: 'none' }}
                >
                  <div 
                    xmlns="http://www.w3.org/1999/xhtml"
                    className="text-center text-white h-full flex flex-col justify-start items-center p-2"
                    style={{ fontFamily: 'Inter, sans-serif', pointerEvents: 'none' }}
                  >
                    <h3 className="text-base font-bold text-blue-300 mb-1">
                      Market Consensus
                    </h3>
                    <p className="text-xs text-gray-300 mb-2">
                      Probability-weighted outlook
                    </p>
                    <div className="flex justify-center space-x-4 text-xs">
                      <div className="text-center">
                        <div className="text-green-400 font-bold">{bullProb}%</div>
                        <div className="text-gray-400">Bull</div>
                      </div>
                      <div className="text-center">
                        <div className="text-blue-400 font-bold">{baseProb}%</div>
                        <div className="text-gray-400">Base</div>
                      </div>
                      <div className="text-center">
                        <div className="text-red-400 font-bold">{bearProb}%</div>
                        <div className="text-gray-400">Bear</div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      {baseProb > 50 ? 'Balanced outlook expected' : 
                       bullProb > bearProb ? 'Optimistic bias detected' : 'Cautious sentiment prevails'}
                    </p>
                  </div>
                </foreignObject>
              </motion.g>
            )}
          </AnimatePresence>
        </svg>
      </motion.div>
    </div>
  );
};

const ScenarioCard = ({ type, probability, trending, drivers, confidence, historicalContext, linkedModules, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const styles = {
    Bull: { icon: TrendingUp, color: 'emerald', bgGradient: 'from-emerald-500/15 to-transparent' },
    Base: { icon: Anchor, color: 'blue', bgGradient: 'from-blue-500/15 to-transparent' },
    Bear: { icon: TrendingDown, color: 'red', bgGradient: 'from-red-500/15 to-transparent' },
  };
  const { icon: Icon, color, bgGradient } = styles[type];

  const confidenceStyles = {
    High: "text-emerald-400 bg-emerald-500/15 border-emerald-500/25",
    Medium: "text-yellow-400 bg-yellow-500/15 border-yellow-500/25",
    Low: "text-orange-400 bg-orange-500/15 border-orange-500/25",
  };

  const getTrendingIndicator = () => {
    if (trending === 'up') return { color: 'text-emerald-400', symbol: '↗', glow: 'shadow-emerald-500/20' };
    if (trending === 'down') return { color: 'text-red-400', symbol: '↘', glow: 'shadow-red-500/20' };
    return { color: 'text-gray-400', symbol: '→', glow: 'shadow-gray-500/20' };
  };

  const trendIndicator = getTrendingIndicator();

  return (
    <motion.div 
      className="relative group overflow-hidden rounded-3xl border backdrop-blur-xl cursor-pointer"
      style={{
        background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.6), rgba(10, 12, 18, 0.7))',
        borderColor: `rgba(${color === 'emerald' ? '16, 185, 129' : color === 'blue' ? '59, 130, 246' : '239, 68, 68'}, 0.25)`,
      }}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.1 + index * 0.15, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ y: -8, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Subtle Background Gradient */}
      <div className={`absolute top-0 left-0 right-0 h-2/3 bg-gradient-to-b ${bgGradient} pointer-events-none transition-opacity duration-500 group-hover:opacity-60`} />
      
      {/* Trending Glow */}
      {trending === 'up' && (
        <motion.div
          className={`absolute inset-0 rounded-3xl ${trendIndicator.glow} shadow-lg`}
          animate={{ 
            boxShadow: [
              `0 0 15px rgba(16, 185, 129, 0.2)`,
              `0 0 30px rgba(16, 185, 129, 0.4)`,
              `0 0 15px rgba(16, 185, 129, 0.2)`
            ]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      
      <div className="relative z-10 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Icon className={`w-6 h-6 text-${color}-400`} strokeWidth={2.5} />
            <div className="flex items-center space-x-2">
              <h4 className={`text-xl font-black text-${color}-400`}>{type} Case</h4>
              <motion.div
                className="flex items-center justify-center w-5 h-5 rounded-full border backdrop-blur-sm"
                style={{
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(79, 70, 229, 0.15))',
                  borderColor: 'rgba(59, 130, 246, 0.25)'
                }}
                animate={isHovered ? {
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    '0 0 0 rgba(59, 130, 246, 0)',
                    '0 0 10px rgba(59, 130, 246, 0.3)',
                    '0 0 0 rgba(59, 130, 246, 0)'
                  ]
                } : {}}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                <ExternalLink className="w-3 h-3 text-blue-400" strokeWidth={2.5} />
              </motion.div>
            </div>
            <motion.span 
              className={`text-lg ${trendIndicator.color} ml-2`}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {trendIndicator.symbol}
            </motion.span>
          </div>
          <div className="text-right">
            <motion.span 
              className="text-3xl font-black text-white"
              key={probability}
              initial={{ scale: 1.2, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {probability}%
            </motion.span>
          </div>
        </div>

        {/* Confidence Badge */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1.5 text-xs font-bold rounded-full border ${confidenceStyles[confidence]}`}>
              Confidence: {confidence}
            </span>
          </div>
        </div>

        {/* Drivers */}
        <ul className="space-y-3 mb-6">
          {drivers.map((driver, i) => (
            <motion.li 
              key={i} 
              className="flex items-start space-x-3 text-sm text-gray-300 leading-relaxed"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
            >
              <span className={`text-${color}-400 mt-1 font-bold`}>•</span>
              <span>{driver}</span>
            </motion.li>
          ))}
        </ul>

        {/* Historical Context */}
        <motion.p 
          className="text-xs text-gray-500 italic leading-relaxed p-3 rounded-xl border"
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            borderColor: 'rgba(255, 255, 255, 0.05)'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 + index * 0.2 }}
        >
          {historicalContext}
        </motion.p>
      </div>
    </motion.div>
  );
};

const AIOutlook = ({ data }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.1 }}
      className="space-y-8"
    >
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center border"
          style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(79, 70, 229, 0.15))',
            borderColor: 'rgba(59, 130, 246, 0.25)'
          }}
        >
          <TrendingUp className="w-6 h-6 text-blue-400" strokeWidth={2} />
        </div>
        <div>
          <h2 className="text-3xl font-black text-white tracking-[-0.02em]">Market Scenarios</h2>
          <p className="text-gray-400">Probability-weighted outlook with confidence intervals</p>
        </div>
      </div>

      {/* Triangular Probability Spectrum */}
      <TriangularProbabilitySpectrum scenarios={data.scenarios} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {data.scenarios.map((scenario, index) => (
          <ScenarioCard key={scenario.type} {...scenario} index={index} />
        ))}
      </div>
    </motion.section>
  );
};

export default AIOutlook;