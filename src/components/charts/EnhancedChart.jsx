import React, { useState, useEffect, useRef } from 'react';
import { useFeatureFlags } from '../core/FeatureFlags';
import ChartOverlays from './ChartOverlays';

export default function EnhancedChart({ children, chartData, className = "", ...props }) {
  const { isEnabled } = useFeatureFlags();
  const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  const ref = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    // Set up a ResizeObserver to detect when the component's size changes.
    const resizeObserver = new ResizeObserver(entries => {
      if (entries[0]) {
        setWidth(entries[0].contentRect.width);
      }
    });

    if (ref.current) {
      resizeObserver.observe(ref.current);
    }

    // Cleanup observer on component unmount
    return () => {
      if (ref.current) {
        resizeObserver.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`} {...props}>
      {children}
      
      {/* Pass the dynamic width to the overlays component */}
      {isEnabled('labs_modules') && width > 0 && (
        <ChartOverlays 
          chartData={chartData} 
          theme={theme}
          containerWidth={width}
        />
      )}
    </div>
  );
}