import React from 'react';

const ResonanceMeter = ({ value, max, label, color }) => {
  const progressPercentage = max > 0 ? (value / max) * 100 : 0;

  return (
    <div className="w-full">
      <div 
        className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden border border-white/5"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin="0"
        aria-valuemax={max}
        aria-label="XP progress"
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${progressPercentage}%`,
            background: `linear-gradient(90deg, ${color}99, ${color}FF)`,
          }}
        />
      </div>
      {label && (
        <div className="text-xs text-gray-400 mt-1 text-right">
          <span>{label}</span>
        </div>
      )}
    </div>
  );
};

export default ResonanceMeter;