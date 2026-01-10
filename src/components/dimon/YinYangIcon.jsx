import React from 'react';
import { motion } from 'framer-motion';

// ============================================================================
// YIN-YANG ICON — OS HORIZON SYSTEM ICON
// Apple-grade minimalist balance symbol for equilibrium visualization
// ============================================================================

export default function YinYangIcon({ className = "w-4 h-4", color = "rgba(255,255,255,0.72)" }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      className={className}
      style={{ strokeWidth: 1.5 }}
    >
      {/* Outer Circle */}
      <circle 
        cx="12" 
        cy="12" 
        r="10" 
        stroke={color} 
        strokeWidth="1.5" 
        fill="none"
      />
      
      {/* S-Curve Divider */}
      <path 
        d="M12 2 C12 7, 12 7, 12 12 C12 17, 12 17, 12 22" 
        stroke={color} 
        strokeWidth="1.5" 
        fill="none"
        strokeLinecap="round"
      />
      
      {/* Upper Dot */}
      <circle 
        cx="12" 
        cy="7" 
        r="1.5" 
        fill={color}
      />
      
      {/* Lower Dot */}
      <circle 
        cx="12" 
        cy="17" 
        r="1.5" 
        fill={color}
      />
    </svg>
  );
}