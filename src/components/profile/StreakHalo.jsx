import React from 'react';

const StreakHalo = ({ days, best, color }) => {
  // Opacity scales from 0.2 to 0.6 based on current streak relative to best
  const opacity = Math.min(0.6, 0.2 + (days / (best || days)) * 0.4);

  return (
    <div className="relative w-24 h-24">
      {/* Halo Effect */}
      <div 
        className="absolute inset-0 rounded-full"
        style={{
          boxShadow: `0 0 20px 5px ${color}`,
          opacity: opacity,
        }}
      />
      {/* Avatar Placeholder */}
      <div className="relative w-full h-full rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center border-2 border-white/10 shadow-lg">
      </div>
    </div>
  );
};

export default StreakHalo;