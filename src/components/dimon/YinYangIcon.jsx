import React from 'react';
import { motion } from 'framer-motion';

const YinYangIcon = ({ className = "w-5 h-5", style = {}, strokeWidth = 1.5 }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <defs>
        <linearGradient id="yin-yang-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.95" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.75" />
        </linearGradient>
      </defs>
      
      {/* Outer circle */}
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="url(#yin-yang-gradient)"
        strokeWidth={strokeWidth}
        fill="none"
      />
      
      {/* S-curve divider */}
      <path
        d="M12 2 C12 7, 12 7, 12 12 C12 17, 12 17, 12 22"
        stroke="url(#yin-yang-gradient)"
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
      />
      
      {/* Upper semicircle (yang side) */}
      <path
        d="M12 2 A5 5 0 0 1 12 12"
        stroke="url(#yin-yang-gradient)"
        strokeWidth={strokeWidth}
        fill="none"
      />
      
      {/* Lower semicircle (yin side) */}
      <path
        d="M12 12 A5 5 0 0 1 12 22"
        stroke="url(#yin-yang-gradient)"
        strokeWidth={strokeWidth}
        fill="none"
      />
      
      {/* Small circle in yang (upper) */}
      <circle
        cx="12"
        cy="7"
        r="1.5"
        fill="none"
        stroke="url(#yin-yang-gradient)"
        strokeWidth={strokeWidth * 0.8}
      />
      
      {/* Small circle in yin (lower) */}
      <circle
        cx="12"
        cy="17"
        r="1.5"
        fill="url(#yin-yang-gradient)"
        fillOpacity="0.3"
      />
    </svg>
  );
};

export default YinYangIcon;