// YinYang Icon Component - OS Horizon Thematic Design
// Apple-grade UI/UX standards with glass morphism

import React from 'react';
import { motion } from 'framer-motion';

const YinYangIcon = ({ className = "w-6 h-6", style = {} }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <defs>
        {/* Gradient for glass effect */}
        <linearGradient id="yinyang-glass-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255, 255, 255, 0.85)" />
          <stop offset="50%" stopColor="rgba(255, 255, 255, 0.65)" />
          <stop offset="100%" stopColor="rgba(255, 255, 255, 0.45)" />
        </linearGradient>

        {/* Subtle glow filter */}
        <filter id="yinyang-glow">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        {/* Shadow for depth */}
        <filter id="yinyang-shadow">
          <feDropShadow dx="0" dy="0.5" stdDeviation="1.5" floodOpacity="0.25"/>
        </filter>
      </defs>

      {/* Outer circle - glass border */}
      <circle
        cx="50"
        cy="50"
        r="48"
        fill="none"
        stroke="url(#yinyang-glass-gradient)"
        strokeWidth="1.2"
        filter="url(#yinyang-glow)"
      />

      {/* Main dividing S-curve - creates the yin-yang divide */}
      <path
        d="M 50 2 
           C 50 2, 78 26, 78 50 
           C 78 74, 50 98, 50 98 
           C 50 98, 22 74, 22 50 
           C 22 26, 50 2, 50 2 Z"
        fill="url(#yinyang-glass-gradient)"
        opacity="0.85"
        filter="url(#yinyang-shadow)"
      />

      {/* Upper (yang) circle */}
      <circle
        cx="50"
        cy="26"
        r="11"
        fill="rgba(18, 22, 30, 0.75)"
        stroke="url(#yinyang-glass-gradient)"
        strokeWidth="0.8"
        filter="url(#yinyang-glow)"
      />

      {/* Lower (yin) circle */}
      <circle
        cx="50"
        cy="74"
        r="11"
        fill="url(#yinyang-glass-gradient)"
        stroke="none"
        opacity="0.90"
        filter="url(#yinyang-glow)"
      />

      {/* Upper dot (yin in yang) */}
      <circle
        cx="50"
        cy="26"
        r="3.5"
        fill="url(#yinyang-glass-gradient)"
        opacity="0.95"
      />

      {/* Lower dot (yang in yin) */}
      <circle
        cx="50"
        cy="74"
        r="3.5"
        fill="rgba(18, 22, 30, 0.85)"
      />

      {/* Specular highlight on top for glass effect */}
      <ellipse
        cx="38"
        cy="22"
        rx="18"
        ry="10"
        fill="rgba(255, 255, 255, 0.12)"
        opacity="0.75"
        style={{ filter: 'blur(6px)' }}
      />
    </svg>
  );
};

export default YinYangIcon;