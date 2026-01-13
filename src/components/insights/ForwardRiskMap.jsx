import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, AlertTriangle, TrendingUp, Flame, Zap, Rocket, ArrowUp } from 'lucide-react';

const FuturisticTimelineSelector = ({ horizons, selected, onSelect }) => (
  <div className="relative mb-12">
    <div className="flex items-center justify-center p-2 bg-black/20 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl">
      {horizons.map((horizon) => (
        <motion.button
          key={horizon}
          onClick={() => onSelect(horizon)}
          className={`relative flex-1 px-8 py-4 text-base font-bold rounded-2xl transition-all duration-500 ${
            selected === horizon 
              ? 'text-white' 
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="relative z-10">{horizon}</span>
          {selected === horizon && (
            <motion.div 
              layoutId="radialTimelineIndicator" 
              className="absolute inset-0 rounded-2xl shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.4) 0%, rgba(59, 130, 246, 0.4) 100%)',
                border: '1px solid rgba(124, 58, 237, 0.6)',
                boxShadow: '0 0 30px rgba(124, 58, 237, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
        </motion.button>
      ))}
    </div>
  </div>
);

const RadialArc = ({ item, index, isRisk, totalItems, hoveredArc, setHoveredArc, onArcClick }) => {
  const { text, intensity } = item;
  const radius = 120;
  const strokeWidth = Math.max(8, intensity * 20);
  
  // Calculate arc position (risks on left half, opportunities on right half)
  const startAngle = isRisk 
    ? 90 + (index * 90 / totalItems)
    : 270 - (index * 90 / totalItems);
  const endAngle = isRisk
    ? 90 + ((index + 1) * 90 / totalItems)
    : 270 - ((index + 1) * 90 / totalItems);
    
  const startAngleRad = (startAngle * Math.PI) / 180;
  const endAngleRad = (endAngle * Math.PI) / 180;
  
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  
  const startX = 200 + radius * Math.cos(startAngleRad);
  const startY = 200 + radius * Math.sin(startAngleRad);
  const endX = 200 + radius * Math.cos(endAngleRad);
  const endY = 200 + radius * Math.sin(endAngleRad);
  
  const pathData = [
    "M", startX, startY,
    "A", radius, radius, 0, largeArcFlag, 0, endX, endY
  ].join(" ");
  
  const isHovered = hoveredArc === `${isRisk ? 'risk' : 'opp'}-${index}`;
  
  // Orbiting node position
  const midAngle = (startAngleRad + endAngleRad) / 2;
  const nodeX = 200 + radius * Math.cos(midAngle);
  const nodeY = 200 + radius * Math.sin(midAngle);
  
  const gradientId = `arc-gradient-${isRisk ? 'risk' : 'opp'}-${index}`;
  const glowId = `arc-glow-${isRisk ? 'risk' : 'opp'}-${index}`;
  
  return (
    <g>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          {isRisk ? (
            <>
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="50%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#EAB308" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="50%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#3B82F6" />
            </>
          )}
        </linearGradient>
        
        <filter id={glowId}>
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Arc Path */}
      <motion.path
        d={pathData}
        stroke={`url(#${gradientId})`}
        strokeWidth={isHovered ? strokeWidth * 1.5 : strokeWidth}
        fill="none"
        strokeLinecap="round"
        filter={`url(#${glowId})`}
        className="cursor-pointer"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ 
          pathLength: 1, 
          opacity: isHovered ? 1 : 0.8,
          strokeWidth: isHovered ? strokeWidth * 1.5 : strokeWidth
        }}
        transition={{ duration: 1.5, ease: "easeOut", delay: index * 0.2 }}
        onHoverStart={() => setHoveredArc(`${isRisk ? 'risk' : 'opp'}-${index}`)}
        onHoverEnd={() => setHoveredArc(null)}
        onClick={() => onArcClick(item, isRisk)}
        whileHover={{ filter: "brightness(1.2)" }}
      />
      
      {/* Orbiting Node */}
      <motion.circle
        cx={nodeX}
        cy={nodeY}
        r={isHovered ? 6 : 4}
        fill={isRisk ? "#EF4444" : "#10B981"}
        className="cursor-pointer"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.8, 1, 0.8],
          r: isHovered ? 6 : 4
        }}
        transition={{
          scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          r: { duration: 0.3 }
        }}
        style={{
          filter: `drop-shadow(0 0 8px ${isRisk ? '#EF4444' : '#10B981'})`
        }}
        onHoverStart={() => setHoveredArc(`${isRisk ? 'risk' : 'opp'}-${index}`)}
        onHoverEnd={() => setHoveredArc(null)}
        onClick={() => onArcClick(item, isRisk)}
      />
    </g>
  );
};

const RadarSweep = () => (
  <motion.defs>
    <radialGradient id="radarSweep">
      <stop offset="0%" stopColor="rgba(124, 58, 237, 0.3)" />
      <stop offset="50%" stopColor="rgba(124, 58, 237, 0.1)" />
      <stop offset="100%" stopColor="transparent" />
    </radialGradient>
  </motion.defs>
);

const CenterLabel = ({ hoveredArc, currentData }) => {
  if (!hoveredArc) return null;
  
  const [type, indexStr] = hoveredArc.split('-');
  const index = parseInt(indexStr);
  const isRisk = type === 'risk';
  const items = isRisk ? currentData.risks : currentData.opportunities;
  const item = items[index];
  
  if (!item) return null;
  
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
    >
      <rect
        x={100}
        y={180}
        width={200}
        height={40}
        rx={20}
        fill="rgba(0, 0, 0, 0.8)"
        stroke="rgba(255, 255, 255, 0.2)"
        strokeWidth={1}
      />
      <text
        x={200}
        y={195}
        textAnchor="middle"
        className="text-sm font-bold fill-white"
      >
        {item.text.slice(0, 30)}...
      </text>
      <text
        x={200}
        y={210}
        textAnchor="middle"
        className={`text-xs font-bold ${isRisk ? 'fill-red-400' : 'fill-green-400'}`}
      >
        {Math.round(item.intensity * 100)}% Impact
      </text>
    </motion.g>
  );
};

const ForwardRiskMap = ({ data, selectedTimeHorizon, onTimeHorizonChange }) => {
  const [hoveredArc, setHoveredArc] = useState(null);
  const [selectedArc, setSelectedArc] = useState(null);
  
  const horizons = Object.keys(data);
  const currentData = data[selectedTimeHorizon] || { risks: [], opportunities: [] };

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
      }
      
      const currentIndex = horizons.findIndex(horizon => horizon === selectedTimeHorizon);

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        const newIndex = (currentIndex - 1 + horizons.length) % horizons.length;
        onTimeHorizonChange(horizons[newIndex]);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        const newIndex = (currentIndex + 1) % horizons.length;
        onTimeHorizonChange(horizons[newIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [horizons, selectedTimeHorizon, onTimeHorizonChange]);

  const handleArcClick = (item, isRisk) => {
    setSelectedArc({ item, isRisk });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="space-y-12"
    >
      {/* Futuristic Section Header */}
      <div className="text-center space-y-6">
        <motion.div 
          className="inline-flex items-center space-x-4 p-6 rounded-3xl backdrop-blur-xl border border-purple-500/30"
          style={{
            background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.15), rgba(30, 27, 75, 0.2))'
          }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/30 to-indigo-500/30 flex items-center justify-center">
            <BarChart3 className="w-7 h-7 text-purple-300" strokeWidth={2.5} />
          </div>
          <div className="text-left">
            <h2 className="text-4xl font-black text-white tracking-[-0.02em]">What Could Go Right or Wrong</h2>
            <p className="text-lg text-gray-200 mt-1">Biggest risks and opportunities across three time windows</p>
          </div>
        </motion.div>
      </div>

      {/* Timeline Selector */}
      <FuturisticTimelineSelector 
        horizons={horizons}
        selected={selectedTimeHorizon}
        onSelect={onTimeHorizonChange}
      />

      {/* Radial Radar Visualization */}
      <div className="flex flex-col items-center">
        <motion.div
          className="relative rounded-3xl backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, rgba(0, 0, 0, 0.3), rgba(30, 41, 59, 0.2))',
            width: '480px',
            height: '480px'
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        >
          {/* Radar Sweep Animation */}
          <motion.div
            className="absolute inset-0 rounded-3xl"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            style={{
              background: 'conic-gradient(from 0deg, transparent 0%, rgba(124, 58, 237, 0.2) 10%, transparent 20%)'
            }}
          />
          
          <svg width="480" height="480" viewBox="0 0 400 400" className="relative z-10">
            <RadarSweep />
            
            {/* Concentric Circles */}
            {[80, 120, 160].map((radius, index) => (
              <circle
                key={radius}
                cx="200"
                cy="200"
                r={radius}
                fill="none"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
            ))}
            
            {/* Center Divider Line */}
            <line
              x1="200"
              y1="40"
              x2="200"
              y2="360"
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="1"
              strokeDasharray="4,4"
            />
            
            {/* Risk Arcs (Left Half) */}
            <AnimatePresence>
              {currentData.risks.map((risk, index) => (
                <RadialArc
                  key={`${selectedTimeHorizon}-risk-${index}`}
                  item={risk}
                  index={index}
                  isRisk={true}
                  totalItems={currentData.risks.length}
                  hoveredArc={hoveredArc}
                  setHoveredArc={setHoveredArc}
                  onArcClick={handleArcClick}
                />
              ))}
            </AnimatePresence>
            
            {/* Opportunity Arcs (Right Half) */}
            <AnimatePresence>
              {currentData.opportunities.map((opportunity, index) => (
                <RadialArc
                  key={`${selectedTimeHorizon}-opp-${index}`}
                  item={opportunity}
                  index={index}
                  isRisk={false}
                  totalItems={currentData.opportunities.length}
                  hoveredArc={hoveredArc}
                  setHoveredArc={setHoveredArc}
                  onArcClick={handleArcClick}
                />
              ))}
            </AnimatePresence>
            
            {/* Center Labels */}
            <text x="120" y="30" className="text-sm font-bold fill-red-400" textAnchor="middle">
              RISKS
            </text>
            <text x="280" y="30" className="text-sm font-bold fill-green-400" textAnchor="middle">
              OPPORTUNITIES
            </text>
            
            {/* Dynamic Center Label */}
            <AnimatePresence>
              <CenterLabel hoveredArc={hoveredArc} currentData={currentData} />
            </AnimatePresence>
          </svg>
        </motion.div>
      </div>

      {/* Mini Popout Card */}
      <AnimatePresence>
        {selectedArc && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedArc(null)}
          >
            <motion.div
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 border border-white/20 max-w-md mx-4 shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center space-x-4 mb-4">
                {selectedArc.isRisk ? (
                  <AlertTriangle className="w-8 h-8 text-red-400" />
                ) : (
                  <TrendingUp className="w-8 h-8 text-green-400" />
                )}
                <div>
                  <h3 className={`text-xl font-bold ${selectedArc.isRisk ? 'text-red-300' : 'text-green-300'}`}>
                    {selectedArc.isRisk ? 'Risk Analysis' : 'Opportunity Analysis'}
                  </h3>
                  <p className="text-sm text-gray-400">Impact: {Math.round(selectedArc.item.intensity * 100)}%</p>
                </div>
              </div>
              <p className="text-gray-200 leading-relaxed mb-4">
                {selectedArc.item.text}
              </p>
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 mb-6">
                <p className="text-sm text-blue-200 font-medium">
                  <span className="font-bold">What this means:</span> Monitor this closely—it could significantly impact your portfolio in this timeframe.
                </p>
              </div>
              <button
                onClick={() => setSelectedArc(null)}
                className="w-full px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-200"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default ForwardRiskMap;