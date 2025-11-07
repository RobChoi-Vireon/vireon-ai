import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const MarketClock = () => {
  const [marketStatus, setMarketStatus] = useState({
    status: 'Loading...',
    countdown: '',
    color: 'bg-gray-500',
    time: ''
  });

  useEffect(() => {
    const getMarketStatus = () => {
      // Use IANA time zone for accuracy, including daylight saving
      const now = new Date();
      const etTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
      const dayOfWeek = etTime.getDay(); // 0 = Sunday, 6 = Saturday
      const hour = etTime.getHours();
      const minute = etTime.getMinutes();
      const second = etTime.getSeconds();

      const timeInMinutes = hour * 60 + minute;
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      const marketOpenTime = 9 * 60 + 30; // 9:30 AM
      const marketCloseTime = 16 * 60; // 4:00 PM
      const preMarketOpenTime = 4 * 60; // 4:00 AM
      const afterHoursCloseTime = 20 * 60; // 8:00 PM
      
      let status, countdown, color;

      if (isWeekend) {
        status = 'Market Closed';
        color = 'bg-red-500';
        let daysUntilMonday = (8 - dayOfWeek) % 7;
        if (daysUntilMonday === 0) daysUntilMonday = 1; // Handle Sunday case
        const nextOpen = new Date(etTime);
        nextOpen.setDate(etTime.getDate() + daysUntilMonday);
        nextOpen.setHours(9, 30, 0, 0);
        countdown = formatCountdown(nextOpen - etTime, 'Opens in');
      } else if (timeInMinutes >= marketOpenTime && timeInMinutes < marketCloseTime) {
        status = 'Market Open';
        color = 'bg-green-500 animate-pulse';
        const closeTime = new Date(etTime);
        closeTime.setHours(16, 0, 0, 0);
        countdown = formatCountdown(closeTime - etTime, 'Closes in');
      } else if (timeInMinutes >= preMarketOpenTime && timeInMinutes < marketOpenTime) {
        status = 'Pre-Market';
        color = 'bg-yellow-500';
        const openTime = new Date(etTime);
        openTime.setHours(9, 30, 0, 0);
        countdown = formatCountdown(openTime - etTime, 'Opens in');
      } else if (timeInMinutes >= marketCloseTime && timeInMinutes < afterHoursCloseTime) {
        status = 'After-Hours';
        color = 'bg-blue-500';
        countdown = 'Session ends at 8:00 PM';
      } else {
        status = 'Market Closed';
        color = 'bg-red-500';
        const nextOpen = new Date(etTime);
        if (hour >= afterHoursCloseTime) {
          nextOpen.setDate(etTime.getDate() + 1); // Next day
        }
        nextOpen.setHours(9, 30, 0, 0);
        countdown = formatCountdown(nextOpen - etTime, 'Opens in');
      }
      
      setMarketStatus({
        status,
        countdown,
        color,
        time: etTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
      });
    };

    const formatCountdown = (ms, prefix) => {
      if (ms < 0) return '';
      const totalSeconds = Math.floor(ms / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      
      let countdownStr = prefix;
      if (hours > 0) {
        countdownStr += ` ${hours}h`;
      }
      if (minutes > 0) {
        countdownStr += ` ${minutes}m`;
      }
      return countdownStr.trim();
    };

    getMarketStatus(); // Initial call
    const intervalId = setInterval(getMarketStatus, 1000); // Update every second

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  return (
    <div className="flex items-center gap-3 bg-gray-900/50 border border-gray-700 rounded-lg px-3 py-1.5">
        <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${marketStatus.color} shadow-sm`}></div>
            <span className="font-semibold text-sm text-gray-100">{marketStatus.status}</span>
        </div>
        <div className="w-px h-5 bg-gray-600"></div>
        <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="font-mono text-sm text-gray-200">{marketStatus.time} ET</span>
        </div>
        {marketStatus.countdown && (
            <>
                <div className="w-px h-5 bg-gray-600"></div>
                <span className="text-sm text-gray-400">{marketStatus.countdown}</span>
            </>
        )}
    </div>
  );
};

export default MarketClock;