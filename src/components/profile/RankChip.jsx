import React from 'react';

const RankChip = ({ rankKey, ranks, size = 'md' }) => {
  const rank = ranks.find(r => r.key === rankKey);

  if (!rank) {
    return null;
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm'
  };

  const isHolographic = rank.color_primary === 'holographic';
  
  const chipStyle = isHolographic ? {
    background: 'linear-gradient(90deg, #A0B4FF, #00A0C8, #E8B923, #F3F5F8)',
    backgroundSize: '200% 200%',
    color: '#000',
    animation: 'holographic-shine 4s linear infinite',
    border: '1px solid rgba(255, 255, 255, 0.5)'
  } : {
    backgroundColor: `${rank.color_primary}29`, // ~16% opacity
    color: rank.color_primary,
    borderColor: `${rank.color_primary}80`,
  };

  return (
    <>
      {isHolographic && (
        <style>{`
          @keyframes holographic-shine {
            0%{background-position:0% 50%}
            50%{background-position:100% 50%}
            100%{background-position:0% 50%}
          }
        `}</style>
      )}
      <div
        className={`font-bold rounded-full border inline-block ${sizeClasses[size]}`}
        style={chipStyle}
        aria-label={`Rank: ${rank.name}`}
      >
        {rank.name}
      </div>
    </>
  );
};

export default RankChip;