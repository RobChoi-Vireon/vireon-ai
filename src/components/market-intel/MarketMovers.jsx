
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, Volume2, RefreshCw, Star } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { getOptimizedMarketData } from '@/functions/getOptimizedMarketData';
import { useMarketStatus } from '../core/MarketStatusProvider';
import { CachedMarketData } from '@/entities/CachedMarketData';

export default function MarketMovers() {
  const [gainers, setGainers] = useState([]);
  const [losers, setLosers] = useState([]);
  const [mostActive, setMostActive] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isMarketOpen } = useMarketStatus();

  useEffect(() => {
    loadMoversData();
  }, [isMarketOpen]);

  const loadMoversData = async () => {
    setIsLoading(true);
    setError(null);
    let liveDataFetched = false;

    // Step 1: Attempt to load from cache first for immediate display
    try {
        const [cachedGainers, cachedLosers, cachedActive] = await Promise.all([
            CachedMarketData.filter({ cacheKey: 'market_movers_gainers' }),
            CachedMarketData.filter({ cacheKey: 'market_movers_losers' }),
            CachedMarketData.filter({ cacheKey: 'market_movers_active' })
        ]);
        if(cachedGainers.length > 0) setGainers(cachedGainers[0].data.movers || []);
        if(cachedLosers.length > 0) setLosers(cachedLosers[0].data.movers || []);
        if(cachedActive.length > 0) setMostActive(cachedActive[0].data.movers || []);
    } catch(e) {
        console.warn("Could not load cached movers data", e);
    }

    // Step 2: Fetch live data if market is open
    if(isMarketOpen) {
        try {
          const [gainersRes, losersRes, activeRes] = await Promise.all([
            getOptimizedMarketData({ dataType: 'day_gainers' }),
            getOptimizedMarketData({ dataType: 'day_losers' }),
            getOptimizedMarketData({ dataType: 'most_active' })
          ]);

          const processAndCache = async (data, cacheKey) => {
              if (data && Array.isArray(data.data)) {
                  const movers = data.data.slice(0, 5);
                  const cachePayload = { movers };
                  const existing = await CachedMarketData.filter({ cacheKey });
                  if(existing.length > 0) {
                      await CachedMarketData.update(existing[0].id, { data: cachePayload, lastUpdated: new Date().toISOString() });
                  } else {
                      await CachedMarketData.create({ cacheKey, data: cachePayload, lastUpdated: new Date().toISOString() });
                  }
                  return movers;
              }
              return [];
          };

          setGainers(await processAndCache(gainersRes.data, 'market_movers_gainers'));
          setLosers(await processAndCache(losersRes.data, 'market_movers_losers'));
          setMostActive(await processAndCache(activeRes.data, 'market_movers_active'));
          liveDataFetched = true;

        } catch (err) {
          console.error('Error loading movers data:', err);
          // Only set an error message if no live data was fetched successfully
          // and we haven't already set the data from cache.
          if (!liveDataFetched && gainers.length === 0 && losers.length === 0 && mostActive.length === 0) {
            setError('Failed to load market movers');
          }
        }
    }
    
    // Step 3: Handle error/mock data if still no data after cache and live attempts
    if (!liveDataFetched && gainers.length === 0 && losers.length === 0 && mostActive.length === 0) {
       // Generate mock data for demonstration
       const mockGainers = [
         { symbol: 'NEGG', price: 81.97, changePercent: 37.90, change: 22.53, volume: 1200000 },
         { symbol: 'SOUN', price: 13.86, changePercent: 29.33, change: 3.14, volume: 850000 },
         { symbol: 'BMNR', price: 53.95, changePercent: 30.70, change: 12.67, volume: 320000 },
         { symbol: 'SHC', price: 13.95, changePercent: 24.33, change: 2.73, volume: 180000 },
         { symbol: 'GSAT', price: 28.60, changePercent: 13.58, change: 3.42, volume: 950000 }
       ];

       const mockLosers = [
         { symbol: 'TTD', price: 55.63, changePercent: -37.02, change: -32.70, volume: 2100000 },
         { symbol: 'UAA', price: 5.39, changePercent: -18.78, change: -1.25, volume: 890000 },
         { symbol: 'UA', price: 5.18, changePercent: -17.46, change: -1.09, volume: 650000 },
         { symbol: 'TWLO', price: 99.34, changePercent: -18.83, change: -23.05, volume: 1400000 },
         { symbol: 'GT', price: 8.45, changePercent: -17.59, change: -1.81, volume: 420000 }
       ];

       const mockActive = [
         { symbol: 'SOUN', price: 13.86, changePercent: 29.33, change: 3.14, volume: 8500000 },
         { symbol: 'NVDA', price: 182.87, changePercent: 1.16, change: 2.10, volume: 7200000 },
         { symbol: 'TTD', price: 55.63, changePercent: -37.02, change: -32.70, volume: 6800000 },
         { symbol: 'AAPL', price: 229.34, changePercent: 4.23, change: 9.31, volume: 5900000 },
         { symbol: 'TSLA', price: 329.52, changePercent: 2.25, change: 7.25, volume: 5100000 }
       ];

       setGainers(mockGainers);
       setLosers(mockLosers);
       setMostActive(mockActive);
    }

    setIsLoading(false);
  };

  const renderMoverItem = (item, index, showStar = false) => {
    const isPositive = item.changePercent > 0;
    const chartColor = isPositive ? '#10b981' : '#ef4444';
    
    return (
      <div key={item.symbol} className="flex items-center justify-between p-3 hover:bg-gray-700/30 rounded-lg transition-colors">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-blue-400 text-sm">{item.symbol}</span>
            {showStar && index === 2 && <Star className="w-3 h-3 text-yellow-400 fill-current" />}
          </div>
          <p className="text-xs text-gray-400 truncate">
            {getCompanyName(item.symbol)}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Mini chart placeholder */}
          <div className="w-16 h-8 flex items-center">
            <svg width="64" height="32" viewBox="0 0 64 32">
              <path
                d={generateMiniChart(item.changePercent)}
                stroke={chartColor}
                strokeWidth="1.5"
                fill="none"
                opacity="0.8"
              />
            </svg>
          </div>
          
          <div className="text-right min-w-0">
            <div className="text-sm font-medium text-white">{item.price.toFixed(2)}</div>
            <div className={`text-xs font-medium flex items-center gap-1 ${
              isPositive ? 'text-green-400' : 'text-red-400'
            }`}>
              {isPositive ? '+' : ''}{item.change.toFixed(2)} ({isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%)
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getCompanyName = (symbol) => {
    const names = {
      'NEGG': 'Newegg Commerce',
      'SOUN': 'SoundHound AI',
      'BMNR': 'Bitmine Immersion',
      'SHC': 'Sotera Health Co.',
      'GSAT': 'Globalstar, Inc.',
      'TTD': 'The Trade Desk',
      'UAA': 'Under Armour, Inc.',
      'UA': 'Under Armour, Inc.',
      'TWLO': 'Twilio Inc.',
      'GT': 'The Goodyear Tire',
      'NVDA': 'NVIDIA Corporation',
      'AAPL': 'Apple Inc.',
      'TSLA': 'Tesla, Inc.'
    };
    return names[symbol] || `${symbol} Company`;
  };

  const generateMiniChart = (changePercent) => {
    const isPositive = changePercent > 0;
    if (isPositive) {
      return 'M2,30 L10,25 L18,22 L26,18 L34,15 L42,12 L50,8 L58,5 L62,2';
    } else {
      return 'M2,2 L10,5 L18,8 L26,12 L34,15 L42,18 L50,22 L58,25 L62,30';
    }
  };

  if (isLoading) {
    return (
      <Card className="h-full bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-100">Market Movers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array(5).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-16 bg-gray-700" />
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
          <CardTitle className="text-gray-100">Market Movers</CardTitle>
          <Button variant="ghost" size="icon" onClick={loadMoversData}>
            <RefreshCw className="w-4 h-4 text-gray-400" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="gainers" className="w-full">
          <TabsList className="w-full bg-gray-700/50 border-b border-gray-600 rounded-none">
            <TabsTrigger value="gainers" className="flex-1 text-green-400">
              Top gainers
            </TabsTrigger>
            <TabsTrigger value="losers" className="flex-1 text-red-400">
              Top losers
            </TabsTrigger>
            <TabsTrigger value="active" className="flex-1 text-blue-400">
              Most active
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="gainers" className="p-3 space-y-1">
            {gainers.map((item, index) => renderMoverItem(item, index, false))}
          </TabsContent>
          
          <TabsContent value="losers" className="p-3 space-y-1">
            {losers.map((item, index) => renderMoverItem(item, index, false))}
          </TabsContent>
          
          <TabsContent value="active" className="p-3 space-y-1">
            {mostActive.map((item, index) => renderMoverItem(item, index, false))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
