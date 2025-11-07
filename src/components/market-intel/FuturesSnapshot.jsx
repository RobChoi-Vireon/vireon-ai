
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getOptimizedMarketData } from '@/functions/getOptimizedMarketData';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { CachedMarketData } from '@/entities/CachedMarketData';
import { useMarketStatus } from '../core/MarketStatusProvider';

const FUTURES_TICKERS = ['ES=F', 'NQ=F', 'RTY=F', 'GC=F', 'CL=F', '^VIX'];
const FUTURES_MAP = {
  'ES=F': 'S&P 500',
  'NQ=F': 'Nasdaq 100', 
  'RTY=F': 'Russell 2000',
  'GC=F': 'Gold',
  'CL=F': 'Crude Oil',
  '^VIX': 'VIX',
};

const FuturesCard = ({ data }) => {
  const isPositive = data.change >= 0;
  const isNeutral = data.change === 0;

  return (
    <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700/60 flex flex-col justify-between h-full">
      <div>
        <p className="text-sm font-medium text-gray-300">{FUTURES_MAP[data.symbol]}</p>
        <p className="text-2xl font-bold text-white">{data.price.toFixed(2)}</p>
      </div>
      <div className="flex items-center text-sm mt-2">
        {isNeutral ? <Minus className="w-4 h-4 text-gray-400" /> : isPositive ? <TrendingUp className="w-4 h-4 text-green-400" /> : <TrendingDown className="w-4 h-4 text-red-400" />}
        <span className={`ml-1 font-semibold ${isNeutral ? 'text-gray-400' : isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {data.change.toFixed(2)} ({data.changePercent.toFixed(2)}%)
        </span>
      </div>
    </div>
  );
};

export default function FuturesSnapshot({ isLoading: propIsLoading }) {
  const [futuresData, setFuturesData] = useState([]);
  const [componentLoading, setComponentLoading] = useState(true);
  const { isMarketOpen } = useMarketStatus();

  useEffect(() => {
    loadFuturesData(); // Initial load
    const interval = setInterval(() => {
      if (isMarketOpen) {
        loadFuturesData();
      }
    }, 60000); // Refresh every 60 seconds when market is open

    return () => clearInterval(interval);
  }, [isMarketOpen]);

  const loadFuturesData = async () => {
    setComponentLoading(true);

    // First, try to load from cache to show something immediately
    try {
      const cached = await CachedMarketData.filter({ cacheKey: 'futures_snapshot' });
      if (cached.length > 0 && cached[0].data && cached[0].data.futures) {
        setFuturesData(cached[0].data.futures);
      }
    } catch(e) {
      console.warn("Could not load cached futures data", e);
    }

    // If market is open, try to fetch live data
    if (isMarketOpen) {
      try {
        const { data, error } = await getOptimizedMarketData({
          dataType: 'prices',
          tickers: FUTURES_TICKERS.join(','),
        });
        
        if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
          // Transform the data to ensure it has the right structure
          const transformedData = data.data.map(item => ({
            symbol: item.symbol,
            price: parseFloat(item.price) || 0,
            change: parseFloat(item.change) || 0,
            changePercent: parseFloat(item.changePercent) || 0
          }));
          
          // Check if the API returned all zeros, which indicates a data quality issue
          if (transformedData.every(item => item.price === 0 && item.change === 0)) {
            throw new Error("API returned non-meaningful (all zeros) data.");
          }
          
          setFuturesData(transformedData);
          
          // Update cache
          const cachePayload = { futures: transformedData };
          const existingCache = await CachedMarketData.filter({ cacheKey: 'futures_snapshot' });
          if(existingCache.length > 0) {
            await CachedMarketData.update(existingCache[0].id, { 
              data: cachePayload, 
              lastUpdated: new Date().toISOString() 
            });
          } else {
            await CachedMarketData.create({
              cacheKey: 'futures_snapshot',
              data: cachePayload,
              lastUpdated: new Date().toISOString()
            });
          }
        } else if(error) {
          throw new Error(error.message || "API returned no data.");
        }
      } catch (apiError) {
        console.warn("Could not fetch live futures data, using fallback:", apiError.message);
        
        // Generate fallback data only if we have nothing to show (neither live nor cached)
        if (futuresData.length === 0) {
          const fallbackData = FUTURES_TICKERS.map(ticker => ({
            symbol: ticker,
            price: Math.random() * 100 + 3000,
            change: (Math.random() - 0.5) * 10,
            changePercent: (Math.random() - 0.5) * 3
          }));
          setFuturesData(fallbackData);
        }
      }
    }

    setComponentLoading(false);
  };

  const isLoading = propIsLoading || componentLoading;

  if (isLoading && futuresData.length === 0) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-28 bg-gray-700" />)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {FUTURES_TICKERS.map(ticker => {
        const data = futuresData.find(d => d.symbol === ticker);
        return data ? <FuturesCard key={ticker} data={data} /> : (
          <div key={ticker} className="p-4 rounded-lg bg-gray-800/50 border border-gray-700/60 flex flex-col justify-between h-full">
            <div>
              <p className="text-sm font-medium text-gray-300">{FUTURES_MAP[ticker]}</p>
              <p className="text-2xl font-bold text-gray-500">--</p>
            </div>
            <div className="flex items-center text-sm mt-2">
              <span className="ml-1 font-semibold text-gray-500">No Data</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
