
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, TrendingUp, Clock, RefreshCw, Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { getOptimizedMarketData } from '@/functions/getOptimizedMarketData';
import { format, addDays, isSameDay } from 'date-fns';

export default function EventsCalendar() {
  const [earningsEvents, setEarningsEvents] = useState([]);
  const [trendingTickers, setTrendingTickers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('earnings');

  useEffect(() => {
    loadEventsData();
  }, []);

  const loadEventsData = async () => {
    setIsLoading(true);

    try {
      // Try to fetch real earnings data
      const { data: earningsData } = await getOptimizedMarketData({ dataType: 'earnings_calendar' });
      
      if (earningsData && earningsData.length > 0) {
        setEarningsEvents(earningsData.slice(0, 8));
      } else {
        // Mock earnings data
        const mockEarnings = [
          { date: '2024-08-11', symbol: 'ASTS', name: 'AST SpaceMobile, Inc.', time: 'AMC' },
          { date: '2024-08-11', symbol: 'OKLO', name: 'Oklo Inc.', time: 'AMC' },
          { date: '2024-08-13', symbol: 'CSCO', name: 'Cisco Systems, Inc.', time: 'AMC' },
          { date: '2024-08-14', symbol: 'BABA', name: 'Alibaba Group Holding Limited', time: 'BMO' },
          { date: '2024-08-14', symbol: 'AMCR', name: 'Amcor plc', time: 'BMO' },
          { date: '2024-08-15', symbol: 'NVDA', name: 'NVIDIA Corporation', time: 'AMC' },
          { date: '2024-08-16', symbol: 'AAPL', name: 'Apple Inc.', time: 'AMC' },
          { date: '2024-08-16', symbol: 'MSFT', name: 'Microsoft Corporation', time: 'AMC' }
        ];
        setEarningsEvents(mockEarnings);
      }

      // Mock trending tickers data (in real app, this might come from news sentiment or volume data)
      const mockTrending = [
        { symbol: 'TTD', name: 'The Trade Desk', price: 55.60, change: -32.73, changePercent: -37.05 },
        { symbol: 'SOUN', name: 'SoundHound AI', price: 13.80, change: 3.08, changePercent: 28.77 },
        { symbol: 'AAPL', name: 'Apple Inc.', price: 229.42, change: 9.39, changePercent: 4.27 },
        { symbol: 'SNOW', name: 'Snowflake Inc.', price: 192.49, change: -13.91, changePercent: -6.74 },
        { symbol: 'BMNR', name: 'Bitmine Immersion', price: 54.21, change: 12.93, changePercent: 31.32 }
      ];
      setTrendingTickers(mockTrending);

    } catch (error) {
      console.error('Error loading events data:', error);
    }

    setIsLoading(false);
  };

  const formatEarningsDate = (dateStr) => {
    const date = new Date(dateStr);
    const month = format(date, 'MMM').toUpperCase();
    const day = format(date, 'd');
    return { month, day };
  };

  const getTimeLabel = (time) => {
    const labels = {
      'AMC': 'After Market Close',
      'BMO': 'Before Market Open',
      'TAS': 'Time and Sales'
    };
    return labels[time] || time;
  };

  const renderTrendingItem = (item) => {
    const isPositive = item.changePercent > 0;
    const chartColor = isPositive ? '#10b981' : '#ef4444';
    
    return (
      <div key={item.symbol} className="flex items-center justify-between p-3 hover:bg-gray-700/30 rounded-lg transition-colors">
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-blue-400 text-sm">{item.symbol}</div>
          <p className="text-xs text-gray-400 truncate">{item.name}</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Mini trend chart */}
          <div className="w-16 h-8 flex items-center">
            <svg width="64" height="32" viewBox="0 0 64 32">
              <path
                d={generateTrendChart(item.changePercent)}
                stroke={chartColor}
                strokeWidth="1.5"
                fill="none"
                opacity="0.8"
              />
            </svg>
          </div>
          
          <div className="text-right">
            <div className="text-sm font-medium text-white">{item.price.toFixed(2)}</div>
            <div className={`text-xs font-medium ${
              isPositive ? 'text-green-400' : 'text-red-400'
            }`}>
              {isPositive ? '+' : ''}{item.change.toFixed(2)} ({isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%)
            </div>
          </div>
        </div>
      </div>
    );
  };

  const generateTrendChart = (changePercent) => {
    const isPositive = changePercent > 0;
    if (isPositive) {
      return 'M2,30 L10,28 L18,25 L26,20 L34,15 L42,10 L50,6 L58,3 L62,2';
    } else {
      return 'M2,2 L10,5 L18,10 L26,15 L34,20 L42,25 L50,28 L58,30 L62,32';
    }
  };

  if (isLoading) {
    return (
      <Card className="h-full bg-gray-800/50 border-gray-700">
        <CardHeader>
          <Skeleton className="h-6 w-32 bg-gray-700" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array(6).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-12 bg-gray-700" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full bg-gray-800/50 border-gray-700">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-gray-100 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Events & Markets
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={loadEventsData}>
            <RefreshCw className="w-4 h-4 text-gray-400" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-4">
          {/* Earnings Events Section */}
          <div>
            <div className="px-4 py-2 bg-gray-700/50 flex items-center justify-between">
              <h3 className="text-blue-300 font-medium text-sm">Earnings events</h3>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs bg-gray-600 border-gray-500">
                  Upcoming
                </Badge>
                <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white p-1">
                  <TrendingUp className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="px-4 space-y-3 py-2">
              {earningsEvents.map((event, index) => {
                const { month, day } = formatEarningsDate(event.date);
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-center min-w-0">
                        <div className="text-xs text-gray-400 uppercase">{month}</div>
                        <div className="text-lg font-bold text-white">{day}</div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-blue-400 text-sm">{event.symbol}</div>
                        <p className="text-xs text-gray-400 truncate">{event.name}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white p-2">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Trending Tickers Section */}
          <div className="border-t border-gray-700">
            <div className="px-4 py-2 bg-gray-700/50">
              <h3 className="text-white font-medium text-sm">Trending tickers</h3>
            </div>
            
            <div className="px-1 space-y-1 py-2">
              {trendingTickers.map(renderTrendingItem)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
