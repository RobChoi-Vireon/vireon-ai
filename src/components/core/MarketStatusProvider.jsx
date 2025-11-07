import React, { createContext, useContext, useState, useEffect } from 'react';
import { isSameDay } from 'date-fns';

const MarketStatusContext = createContext({ isMarketOpen: false });

// List of US stock market holidays for 2024-2025
const US_HOLIDAYS = [
  "2024-01-01", "2024-01-15", "2024-02-19", "2024-03-29", "2024-05-27",
  "2024-06-19", "2024-07-04", "2024-09-02", "2024-11-28", "2024-12-25",
  "2025-01-01", "2025-01-20", "2025-02-17", "2025-04-18", "2025-05-26",
  "2025-06-19", "2025-07-04", "2025-09-01", "2025-11-27", "2025-12-25",
];

export const MarketStatusProvider = ({ children }) => {
  const [isMarketOpen, setIsMarketOpen] = useState(false);

  useEffect(() => {
    const checkMarketStatus = () => {
      const now = new Date();
      const estTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
      
      const dayOfWeek = estTime.getDay();
      const hour = estTime.getHours();
      const minute = estTime.getMinutes();

      // Check for holidays
      const isHoliday = US_HOLIDAYS.some(holiday => isSameDay(new Date(holiday), estTime));
      
      // Check for weekend
      if (dayOfWeek === 0 || dayOfWeek === 6 || isHoliday) {
        setIsMarketOpen(false);
        return;
      }

      // Check market hours (9:30 AM to 4:00 PM ET)
      const marketOpen = (hour > 9 || (hour === 9 && minute >= 30));
      const marketClose = hour < 16;

      setIsMarketOpen(marketOpen && marketClose);
    };

    checkMarketStatus();
    const interval = setInterval(checkMarketStatus, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <MarketStatusContext.Provider value={{ isMarketOpen }}>
      {children}
    </MarketStatusContext.Provider>
  );
};

export const useMarketStatus = () => useContext(MarketStatusContext);