
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { format, addDays, parseISO, isToday } from 'date-fns';
import { getOptimizedMarketData } from '@/functions/getOptimizedMarketData';
import { CachedMarketData } from '@/entities/CachedMarketData';

export default function EquityEarnings() {
  const [earnings, setEarnings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEarnings();
  }, []);

  const loadEarnings = async () => {
    setIsLoading(true);
    try {
      // Try cache first
      const cached = await CachedMarketData.filter({ cacheKey: 'equity_earnings' });
      if (cached.length > 0 && cached[0].lastUpdated && isToday(new Date(cached[0].lastUpdated))) {
          setEarnings(cached[0].data.earnings || []); // Access 'earnings' property
          setIsLoading(false);
          return;
      }

      // Use optimized API routing - Finnhub for earnings
      const { data, error } = await getOptimizedMarketData({
        dataType: 'earnings_calendar'
      });

      if (error || !data || !data.data) {
        throw new Error(error?.message || 'Failed to fetch earnings data');
      }
      
      // Filter for upcoming earnings with estimates and sort by date
      const upcomingEarnings = data.data
        .filter(e => new Date(e.date) >= new Date() && e.epsEstimate)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      const finalData = upcomingEarnings.slice(0, 4);
      setEarnings(finalData);

      // Update Cache - wrap data in object
      const cachePayload = { earnings: finalData };
      await CachedMarketData.create({
          cacheKey: 'equity_earnings',
          data: cachePayload,
          lastUpdated: new Date().toISOString()
      }).catch(async () => {
          const existing = await CachedMarketData.filter({ cacheKey: 'equity_earnings' });
          if(existing.length > 0) {
              await CachedMarketData.update(existing[0].id, { data: cachePayload, lastUpdated: new Date().toISOString() });
          }
      });

    } catch (error) {
      console.error("Error loading earnings:", error);
      setEarnings([]); // Set to empty on error
    } finally {
      setIsLoading(false);
    }
  };

  const getSentimentColor = (epsEstimate, revenueEstimate) => {
    if (epsEstimate > 0 && revenueEstimate > 0) return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800/50';
    if (epsEstimate < 0) return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800/50';
    return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700/50 dark:text-gray-300 dark:border-gray-600/50';
  };
  
  const getBeatProbabilityColor = (probability) => {
    if (probability >= 75) return 'text-green-600 dark:text-green-400';
    if (probability >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  if (isLoading) {
    return (
      <Card className="h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
        <CardHeader className="pb-4">
          <Skeleton className="h-6 w-3/4 bg-gray-200 dark:bg-gray-600" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array(4).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-16 bg-gray-200 dark:bg-gray-600 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">Upcoming Earnings</CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={loadEarnings} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {earnings.length > 0 ? earnings.map((earning, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold font-mono text-gray-900 dark:text-gray-100">{earning.symbol}</span>
                  <Badge className={getSentimentColor(earning.epsEstimate, earning.revenueEstimate)}>
                    {earning.epsEstimate > 0 ? 'Positive Est.' : 'Negative Est.'}
                  </Badge>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {format(parseISO(earning.date), 'MMM d, yyyy')} ({earning.hour.toUpperCase()})
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  EPS: ${earning.epsEstimate?.toFixed(2) || 'N/A'}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Rev: ${earning.revenueEstimate ? `${(earning.revenueEstimate / 1_000_000_000).toFixed(2)}B` : 'N/A'}
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
              No upcoming earnings reports found.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
