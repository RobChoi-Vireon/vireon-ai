import React, { useState, useRef, useEffect } from 'react';
import { Skeleton } from '../ui/skeleton';

export default function LazyChart({ chartData, className = "", ...props }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      // Simulate chart loading time
      const timer = setTimeout(() => setIsLoaded(true), 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!isVisible || !isLoaded) {
    return (
      <div ref={elementRef} className={`${className} flex items-center justify-center`}>
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  // Simple SVG chart representation
  return (
    <div ref={elementRef} className={`${className} elevation-1 rounded-xl overflow-hidden`} {...props}>
      <svg width="100%" height="100%" viewBox="0 0 200 60" preserveAspectRatio="none">
        <defs>
          <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: 'var(--accent)', stopOpacity: 0.3 }} />
            <stop offset="100%" style={{ stopColor: 'var(--accent)', stopOpacity: 0.1 }} />
          </linearGradient>
        </defs>
        
        {/* Background */}
        <rect width="100%" height="100%" fill="var(--chart-bg)" />
        
        {/* Grid lines */}
        <g stroke="var(--chart-grid)" strokeWidth="0.5">
          <line x1="0" y1="15" x2="200" y2="15" />
          <line x1="0" y1="30" x2="200" y2="30" />
          <line x1="0" y1="45" x2="200" y2="45" />
        </g>
        
        {/* Chart line */}
        <path
          d="M 0 30 L 25 20 L 50 35 L 75 25 L 100 15 L 125 28 L 150 18 L 175 12 L 200 20"
          fill="url(#chartGradient)"
          stroke="var(--accent)"
          strokeWidth="2"
        />
        
        {/* Data points */}
        {[0, 25, 50, 75, 100, 125, 150, 175, 200].map((x, i) => {
          const y = [30, 20, 35, 25, 15, 28, 18, 12, 20][i];
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="2"
              fill="var(--accent)"
              opacity="0.8"
            />
          );
        })}
      </svg>
    </div>
  );
}