import { useState, useEffect } from 'react';

const MARKET_CONFIG = {
  open: {
    label: 'Markets Open',
    color: 'rgba(88, 227, 164, 0.88)',
    bg: 'rgba(50, 194, 136, 0.11)',
    border: 'rgba(50, 194, 136, 0.18)',
    dot: 'rgba(88, 227, 164, 0.88)',
    dotGlow: 'rgba(88, 227, 164, 0.40)',
  },
  closed: {
    label: 'Markets Closed',
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
  
  // Check if within market hours: 9:30 AM - 4:00 PM ET on weekdays
  const isOpen = isWeekday && currentHours >= 9.5 && currentHours < 16;
  
  return isOpen ? 'open' : 'closed';
}

export function useMarketStatus() {
  const [status, setStatus] = useState('open');
  const [config, setConfig] = useState(MARKET_CONFIG.open);
  
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