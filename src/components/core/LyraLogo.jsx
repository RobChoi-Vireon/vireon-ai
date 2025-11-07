
import React from 'react';

// Lyra "AI Star" Logo
const LyraLogo = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 100 100" fill="none" className={className}>
    <defs>
      <linearGradient id="lyra-star-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00E5FF" />
        <stop offset="50%" stopColor="#7B68EE" />
        <stop offset="100%" stopColor="#DA70D6" />
      </linearGradient>
      <filter id="lyra-glow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      </filter>
    </defs>
    
    {/* Glow effect for a vibrant aura */}
    <g opacity="0.6" filter="url(#lyra-glow)">
      <g stroke="url(#lyra-star-gradient)" strokeWidth="4" strokeLinecap="round">
        <line x1="50" y1="50" x2="50" y2="10" />
        <line x1="50" y1="50" x2="85" y2="50" />
        <line x1="50" y1="50" x2="50" y2="90" />
        <line x1="50" y1="50" x2="15" y2="50" />
        <line x1="50" y1="50" x2="78" y2="22" />
        <line x1="50" y1="50" x2="78" y2="78" />
        <line x1="50" y1="50" x2="22" y2="78" />
        <line x1="50" y1="50" x2="22" y2="22" />
      </g>
    </g>

    {/* Crisp foreground connections */}
    <g stroke="url(#lyra-star-gradient)" strokeWidth="4" strokeLinecap="round">
      <line x1="50" y1="50" x2="50" y2="10" />
      <line x1="50" y1="50" x2="85" y2="50" />
      <line x1="50" y1="50" x2="50" y2="90" />
      <line x1="50" y1="50" x2="15" y2="50" />
      <line x1="50" y1="50" x2="78" y2="22" />
      <line x1="50" y1="50" x2="78" y2="78" />
      <line x1="50" y1="50" x2="22" y2="78" />
      <line x1="50" y1="50" x2="22" y2="22" />
    </g>

    {/* High-contrast nodes */}
    <g fill="white">
      <circle cx="50" cy="50" r="7" />
      <circle cx="50" cy="10" r="5" />
      <circle cx="85" cy="50" r="5" />
      <circle cx="50" cy="90" r="5" />
      <circle cx="15" cy="50" r="5" />
      <circle cx="78" cy="22" r="4" />
      <circle cx="78" cy="78" r="4" />
      <circle cx="22" cy="78" r="4" />
      <circle cx="22" cy="22" r="4" />
    </g>
    
    {/* Gradient overlay on center node */}
    <circle cx="50" cy="50" r="4" fill="url(#lyra-star-gradient)" />
  </svg>
);

export default LyraLogo;
