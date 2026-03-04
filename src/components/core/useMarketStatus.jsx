import { useState, useEffect } from 'react';

// Market hours in ET
const MARKET_HOURS = {
  premarket: { start: 4, end: 9.5 }, // 4:00 AM - 9:30 AM
  regular: { start: 9.5, end: 16 },  // 9:30 AM - 4:00 PM
  afterhours: { start: 16, end: 20 } // 4:00 PM - 8:00 PM
};

const MARKET_CONFIG = {
  premarket: {
    label: 'Premarket Trading',
    description: 'Extended hours trading',
    color: 'rgba(100, 165, 255, 0.72)',
    bg: 'rgba(100, 165, 255, 0.11)',
    border: 'rgba(100, 165, 255, 0.18)',
    dot: 'rgba(100, 165, 255, 0.88)',
    dotGlow: 'rgba(100, 165, 255, 0.30)',
  },
  regular: {
    label: 'Market Open',
    description: 'Live data streaming',
    color: 'rgba(88, 227, 164, 0.88)',
    bg: 'rgba(50, 194, 136, 0.11)',
    border: 'rgba(50, 194, 136, 0.18)',
    dot: 'rgba(88, 227, 164, 0.88)',
    dotGlow: 'rgba(88, 227, 164, 0.40)',
  },
  afterhours: {
    label: 'After-Hours Trading',
    description: 'Extended hours trading',
    color: 'rgba(255, 180, 80, 0.88)',
    bg: 'rgba(255, 180, 80, 0.11)',
    border: 'rgba(255, 180, 80, 0.18)',
    dot: 'rgba(255, 180, 80, 0.88)',
    dotGlow: 'rgba(255, 180, 80, 0.30)',
  },
  closed: {
    label: 'Market Closed',
    description: 'Opens 9:30 AM ET',
    color: 'rgba(255, 255, 255, 0.56)',
    bg: 'rgba(255, 255, 255, 0.05)',
    border: 'rgba(255, 255, 255, 0.10)',
    dot: 'rgba(255, 255, 255, 0.40)',
    dotGlow: 'rgba(255, 255, 255, 0.10)',
  },
};

function getMarketStatus() {
  const now = new Date();
  
  // Convert to ET (America/New_York)
  const etFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  
  const etTime = etFormatter.format(now);
  const [hours, minutes] = etTime.split(':').map(Number);
  const currentHours = hours + minutes / 60;
  
  // Get day of week (0 = Sunday, 6 = Saturday)
  const date = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  const dayNum = date.getDay();
  const isWeekday = dayNum >= 1 && dayNum <= 5;
  
  // If not a weekday, market is closed
  if (!isWeekday) {
    return 'closed';
  }
  
  // Check market hours
  if (currentHours >= MARKET_HOURS.regular.start && currentHours < MARKET_HOURS.regular.end) {
    return 'regular';
  } else if (currentHours >= MARKET_HOURS.premarket.start && currentHours < MARKET_HOURS.premarket.end) {
    return 'premarket';
  } else if (currentHours >= MARKET_HOURS.afterhours.start && currentHours < MARKET_HOURS.afterhours.end) {
    return 'afterhours';
  } else {
    return 'closed';
  }
}

export function useMarketStatus() {
  const [status, setStatus] = useState('regular');
  const [config, setConfig] = useState(MARKET_CONFIG.regular);
  
  useEffect(() => {
    // Initial status
    const newStatus = getMarketStatus();
    setStatus(newStatus);
    setConfig(MARKET_CONFIG[newStatus]);
    
    // Update every minute
    const interval = setInterval(() => {
      const newStatus = getMarketStatus();
      setStatus(newStatus);
      setConfig(MARKET_CONFIG[newStatus]);
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  return {
    status,
    ...config,
  };
}