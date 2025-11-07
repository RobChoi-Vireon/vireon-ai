
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, GitCommit, Globe, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const ConfidenceArc = ({ confidence, color, isHovered }) => {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (confidence / 100) * circumference;

  return (
    <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 180 180">
      <defs>
        <filter id={`arc-glow-${color.icon}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle
        cx="90"
        cy="90"
        r={radius}
        fill="none"
        stroke={color.border.replace('border-', 'rgba(').replace('400/40', '56, 58, 64, 0.2')}
        strokeWidth="4"
      />
      <motion.circle
        cx="90"
        cy="90"
        r={radius}
        fill="none"
        stroke={color.icon.replace('text-', '').replace('-300', '')}
        strokeWidth="5"
        strokeDasharray={circumference}
        strokeLinecap="round"
        filter={`url(#arc-glow-${color.icon})`}
        initial={{ strokeDashoffset: circumference }}
        animate={{ 
          strokeDashoffset: offset,
          stroke: isHovered ? color.glow.replace('rgba(','').replace(', 0.4)',')') : color.icon.replace('text-', '').replace('-300', '')
        }}
        transition={{ 
          duration: 2, 
          ease: [0.22, 1, 0.36, 1],
          stroke: { duration: 0.3 }
        }}
      />
    </svg>
  );
};

const MiniSparkline = ({ data = [62, 58, 61, 59, 64, 67, 66], color, delay = 0 }) => {
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 40;
    const y = 12 - ((value - minValue) / range) * 12; // Invert Y to grow upwards, 12 is max height
    return `${x},${y}`;
  }).join(' ');

  // Last point coordinates for the circle
  const lastPoint = points.split(' ')[data.length - 1];
  const [lastX, lastY] = lastPoint.split(',').map(Number);


  return (
    <div className="flex items-center space-x-2">
      <svg width="40" height="12" className="overflow-visible">
        <motion.polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.8 }}
          transition={{ duration: 1.5, delay, ease: [0.25, 0.1, 0.25, 1] }}
        />
        <motion.circle
          cx={lastX}
          cy={lastY}
          r="1.5"
          fill={color}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: delay + 1 }}
        />
      </svg>
      <span className="text-xs font-medium" style={{ color }}>
        +{data[data.length - 1] - data[0]} pts
      </span>
    </div>
  );
};

const ConfidenceBar = ({ percentage, color, delay = 0, width = "w-16" }) => (
  <div className={`${width} h-1.5 bg-black/30 rounded-full overflow-hidden`}>
    <motion.div
      className="h-full rounded-full"
      style={{ background: `linear-gradient(90deg, ${color}, ${color}CC)` }}
      initial={{ width: 0 }}
      animate={{ width: `${percentage}%` }}
      transition={{ delay, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
    />
  </div>
);

const Node = ({ title, icon, color, delay, items = [], position, avgConfidence }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const getPanelPosition = () => {
    switch (position) {
        case 'left':
            return {
                container: "absolute bottom-full mb-8 left-0 w-[400px]",
                arrow: "absolute top-full left-[25%] -translate-x-1/2 -mt-1"
            };
        case 'right':
            return {
                container: "absolute bottom-full mb-8 right-0 w-[400px]",
                arrow: "absolute top-full right-[25%] translate-x-1/2 -mt-1"
            };
        default: // center
            return {
                container: "absolute bottom-full mb-8 left-1/2 -translate-x-1/2 w-[400px]",
                arrow: "absolute top-full left-1/2 -translate-x-1/2 -mt-1"
            };
    }
  };
  
  const panelPosition = getPanelPosition();

  const renderPopupContent = () => {
    switch (title) {
      case 'Consensus':
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              {items.slice(0, 3).map((item, i) => (
                <motion.div 
                  key={i} 
                  className="space-y-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                >
                  <div className="flex items-start justify-between">
                    <p className="text-sm font-medium text-gray-200 flex-1 mr-3">
                      {item.claim}
                    </p>
                    <span className="text-xs font-bold text-green-300 whitespace-nowrap">
                      {Math.round((item.confidence || 0) * 100)}%
                    </span>
                  </div>
                  <ConfidenceBar 
                    percentage={(item.confidence || 0) * 100} 
                    color={color.glow} 
                    delay={0.5 + i * 0.1}
                    width="w-full"
                  />
                </motion.div>
              ))}
            </div>
            
            <div className="pt-3 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 font-medium">7-day consensus trend</span>
                <MiniSparkline 
                  data={[62, 58, 61, 59, 64, 67, 66]} 
                  color="#22C55E" 
                  delay={1} 
                />
              </div>
            </div>
          </div>
        );

      case 'Divergences':
        return (
          <div className="space-y-4">
            {items.slice(0, 2).map((item, i) => (
              <motion.div
                key={i}
                className="grid grid-cols-2 gap-4 p-4 rounded-xl border border-white/10"
                style={{ background: 'rgba(147, 51, 234, 0.05)' }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.95 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
              >
                {/* Left Side - Angle A */}
                <div className="space-y-2">
                  <h5 className="text-xs font-bold text-purple-300 uppercase tracking-wide">
                    Angle A
                  </h5>
                  <p className="text-sm font-semibold text-gray-200">
                    {item.topic}
                  </p>
                  <div className="flex items-center justify-between">
                    <ConfidenceBar 
                      percentage={(item.confidence || 0.6) * 100} 
                      color="#A855F7" 
                      delay={0.5 + i * 0.1}
                      width="w-12"
                    />
                    <span className="text-xs font-bold text-purple-300">
                      {Math.round((item.confidence || 0.6) * 100)}%
                    </span>
                  </div>
                  <MiniSparkline 
                    data={[45, 52, 48, 51, 58, 60, 63]} 
                    color="#A855F7" 
                    delay={0.8 + i * 0.1} 
                  />
                </div>

                {/* Right Side - Angle B */}
                <div className="space-y-2">
                  <h5 className="text-xs font-bold text-purple-300 uppercase tracking-wide">
                    Angle B
                  </h5>
                  <p className="text-sm font-semibold text-gray-200">
                    Counter-narrative
                  </p>
                  <div className="flex items-center justify-between">
                    <ConfidenceBar 
                      percentage={(1 - (item.confidence || 0.6)) * 100} 
                      color="#C084FC" 
                      delay={0.5 + i * 0.1}
                      width="w-12"
                    />
                    <span className="text-xs font-bold text-purple-400">
                      {Math.round((1 - (item.confidence || 0.6)) * 100)}%
                    </span>
                  </div>
                  <MiniSparkline 
                    data={[55, 48, 52, 49, 42, 40, 37]} 
                    color="#C084FC" 
                    delay={0.8 + i * 0.1} 
                  />
                </div>
              </motion.div>
            ))}
          </div>
        );

      case 'US vs Global':
        return (
          <div className="space-y-4">
            {items.slice(0, 1).map((item, i) => (
              <motion.div
                key={i}
                className="grid grid-cols-2 gap-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                {/* US Tilt */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-indigo-300" />
                    <h5 className="text-sm font-bold text-indigo-300">US Tilt</h5>
                  </div>
                  <p className="text-sm text-gray-300">
                    "{item.us_view}"
                  </p>
                  <div className="flex items-center justify-between">
                    <ConfidenceBar 
                      percentage={(item.confidence || 0.71) * 100} 
                      color="#6366F1" 
                      delay={0.5}
                      width="w-14"
                    />
                    <span className="text-xs font-bold text-indigo-300">
                      {Math.round((item.confidence || 0.71) * 100)}%
                    </span>
                  </div>
                  <MiniSparkline 
                    data={[68, 65, 69, 72, 71, 73, 71]} 
                    color="#6366F1" 
                    delay={0.8} 
                  />
                </div>

                {/* Global Tilt */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-indigo-400" />
                    <h5 className="text-sm font-bold text-indigo-400">Global Tilt</h5>
                  </div>
                  <p className="text-sm text-gray-300">
                    "{item.global_view}"
                  </p>
                  <div className="flex items-center justify-between">
                    <ConfidenceBar 
                      percentage={(1 - (item.confidence || 0.71)) * 100} 
                      color="#818CF8" 
                      delay={0.5}
                      width="w-14"
                    />
                    <span className="text-xs font-bold text-indigo-400">
                      {Math.round((1 - (item.confidence || 0.71)) * 100)}%
                    </span>
                  </div>
                  <MiniSparkline 
                    data={[32, 35, 31, 28, 29, 27, 29]} 
                    color="#818CF8" 
                    delay={0.8} 
                  />
                </div>
              </motion.div>
            ))}
          </div>
        );

      default:
        return <p className="text-gray-400">No analysis available.</p>;
    }
  };

  return (
    <motion.div
      className="relative group"
      variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } }}
      transition={{ delay, type: 'spring', stiffness: 150, damping: 15 }}
    >
      {/* Fixed: Moved hover detection to only the circular element */}
      <motion.div 
        className={`relative w-48 h-48 rounded-full flex flex-col items-center justify-center text-center p-4 transition-all duration-300 cursor-pointer`} 
        style={{ background: color.bg }}
        whileHover={{ scale: 1.05 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <ConfidenceArc confidence={avgConfidence} color={color} isHovered={isHovered} />
        
        <motion.div 
          className="absolute -inset-1 rounded-full blur-xl transition-opacity duration-300" 
          style={{ background: color.glow }}
          animate={{ 
            opacity: isHovered ? [0.7, 1, 0.7] : [0.5, 0.7, 0.5],
            scale: isHovered ? 1.1 : 1,
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        
        <div className="relative z-10">
          <div className={`p-3 rounded-full bg-black/40 mb-2 border ${color.border}`}>
            {React.createElement(icon, { className: `w-8 h-8 ${color.icon}` })}
          </div>
          <h3 className="text-md font-bold text-white tracking-wide">{title}</h3>
        </div>
      </motion.div>
      
      {/* Fixed: Popup positioned outside hover detection area */}
      <motion.div 
        className={panelPosition.container}
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ 
          opacity: isHovered ? 1 : 0, 
          scale: isHovered ? 1 : 0.8,
          y: isHovered ? 0 : 20
        }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        style={{ pointerEvents: 'none' }} // Fixed: Prevent popup from interfering with hover detection
      >
        <div className="relative">
          <motion.div
            className="relative p-6 rounded-2xl border border-white/20 shadow-2xl"
            style={{
              background: `linear-gradient(145deg, rgba(15, 15, 25, 0.95), rgba(10, 10, 15, 0.98))`,
              backdropFilter: 'blur(24px)',
              boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px ${color.glow}40`
            }}
          >
            {renderPopupContent()}
          </motion.div>
          <div className={panelPosition.arrow}>
             <div className="w-3 h-3 rotate-45" style={{background: 'rgba(15, 15, 25, 0.95)'}}/>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Connector = ({ delay }) => (
  <motion.div 
    className="flex-1 h-1 relative overflow-hidden"
    style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.05), rgba(255,255,255,0.1), rgba(255,255,255,0.05))' }}
    variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1 } }}
    transition={{ duration: 0.8, delay, ease: 'easeInOut' }}
    style={{ transformOrigin: 'left' }}
  >
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"
      style={{ filter: 'blur(5px)' }}
      animate={{ x: ['-100%', '200%'] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'linear', delay: 1 }}
    />
  </motion.div>
);

export default function NarrativeMap({ synthesis, density }) {
  if (!synthesis) return null;
  
  const { consensus = [], divergences = [], us_global_split = [] } = synthesis;

  const calculateAvgConfidence = (items) => {
    if (!items || items.length === 0) return 0;
    const total = items.reduce((sum, item) => sum + (item.confidence || 0), 0);
    return (total / items.length) * 100;
  };

  const consensusConfidence = calculateAvgConfidence(consensus);
  const divergenceConfidence = calculateAvgConfidence(divergences);
  const splitConfidence = calculateAvgConfidence(us_global_split);

  const nodeColors = {
    consensus: { bg: 'rgba(22, 163, 74, 0.2)', border: 'border-green-400/40', icon: 'text-green-300', glow: 'rgba(22, 163, 74, 0.4)' },
    divergences: { bg: 'rgba(147, 51, 234, 0.2)', border: 'border-purple-400/40', icon: 'text-purple-300', glow: 'rgba(147, 51, 234, 0.4)' },
    split: { bg: 'rgba(99, 102, 241, 0.2)', border: 'border-indigo-400/40', icon: 'text-indigo-300', glow: 'rgba(99, 102, 241, 0.4)' },
  };
  
  const nodeSubtitles = {
    Consensus: "Where the Street agrees",
    Divergences: "Where narratives fracture",
    "US vs Global": "Regional perspective"
  }

  const nodes = [
      { title: "Consensus", icon: CheckCircle, color: nodeColors.consensus, delay: 0.1, items: consensus, avgConfidence: consensusConfidence, position: 'left' },
      { title: "Divergences", icon: GitCommit, color: nodeColors.divergences, delay: 0.5, items: divergences, avgConfidence: divergenceConfidence, position: 'center' },
      { title: "US vs Global", icon: Globe, color: nodeColors.split, delay: 0.9, items: us_global_split, avgConfidence: splitConfidence, position: 'right' }
  ];

  return (
    <motion.section
      aria-labelledby="narrative-map-heading"
    >
      <div className="flex items-center mb-6 pl-2">
         <h2 id="narrative-map-heading" className="text-lg font-bold text-gray-100">Narrative Map</h2>
         <p className="text-sm text-gray-400 ml-4">Connecting the macro dots.</p>
      </div>

      <div className="flex items-start justify-around p-8 rounded-2xl border border-white/10" style={{ background: 'rgba(10,10,10,0.5)'}}>
        {nodes.map((node, index) => (
            <React.Fragment key={node.title}>
              <div className="flex flex-col items-center space-y-2">
                <Node {...node} />
                <p className="text-xs text-gray-500 font-medium">{nodeSubtitles[node.title]}</p>
              </div>
              {index < nodes.length - 1 && <div className="pt-24 w-full"><Connector delay={node.delay + 0.2} /></div>}
            </React.Fragment>
        ))}
      </div>
    </motion.section>
  );
}
