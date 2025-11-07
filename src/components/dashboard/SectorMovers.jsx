
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getOptimizedMarketData } from '@/functions/getOptimizedMarketData';
import { CachedMarketData } from '@/entities/CachedMarketData';
import { useMarketStatus } from '../core/MarketStatusProvider';

const SECTOR_MAP = {
  XLK: 'Technology',
  XLE: 'Energy',
  XLV: 'Healthcare',
  XLF: 'Financials',
  XLY: 'Consumer Disc.',
  XLI: 'Industrials',
  XLB: 'Materials',
  XLP: 'Consumer Staples',
  XLU: 'Utilities',
  XLRE: 'Real Estate'
};

export default function SectorMovers() {
  const [sectorData, setSectorData] = useState([]);
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { isMarketOpen } = useMarketStatus();

  useEffect(() => {
    loadSectorData(); // Initial Load
    const interval = setInterval(() => {
        if (isMarketOpen) {
            loadSectorData();
        }
    }, 60000); // Refresh every 60 seconds

    return () => clearInterval(interval);
  }, [isMarketOpen]);

  const loadSectorData = async () => {
    setIsLoading(true);
    let liveDataFetched = false;
    
    // Step 1: Attempt to fetch live data if market is open
    if (isMarketOpen) {
      try {
        const sectorTickers = Object.keys(SECTOR_MAP);
        const { data, error } = await getOptimizedMarketData({
          dataType: 'market_indices',
          tickers: sectorTickers.join(','),
        });

        if (error || !data || !data.data) {
          throw new Error(error?.message || 'Failed to fetch sector data');
        }

        const etfData = data.data.filter(item => SECTOR_MAP[item.symbol]);
        const formattedData = etfData.map(etf => ({
          name: SECTOR_MAP[etf.symbol],
          change: etf.changePercent || 0
        }));
        
        formattedData.sort((a, b) => b.change - a.change);
        
        let newSummary = 'No sector performance data available today.';
        if (formattedData.length > 1) {
          const topPerformer = formattedData[0];
          const worstPerformer = formattedData[formattedData.length - 1];
          newSummary = `${topPerformer.name} leads the market, while ${worstPerformer.name} lags.`;
        } else if (formattedData.length === 1) { // Added this case for completeness
            newSummary = `${formattedData[0].name} is the only sector data available today.`;
        }

        setSectorData(formattedData);
        setSummary(newSummary);
        liveDataFetched = true;
        
        // Update Cache - wrap data in object
        const cachePayload = { formattedData, summary: newSummary };
        const existingCache = await CachedMarketData.filter({ cacheKey: 'sector_movers' });
        if(existingCache.length > 0) {
            await CachedMarketData.update(existingCache[0].id, { data: cachePayload, lastUpdated: new Date().toISOString() });
        } else {
            await CachedMarketData.create({
                cacheKey: 'sector_movers',
                data: cachePayload,
                lastUpdated: new Date().toISOString()
            });
        }

      } catch (error) {
        console.warn('Could not load live sector data, using cache/fallback:', error.message);
      }
    }
    
    // Step 2: Fallback to cache if live data failed or market is closed
    if (!liveDataFetched) {
        try {
          const cached = await CachedMarketData.filter({ cacheKey: 'sector_movers' });
          if (cached.length > 0) {
            setSectorData(cached[0].data.formattedData || []);
            setSummary(cached[0].data.summary || 'Awaiting live market data...');
          } else {
            setSectorData([]);
            setSummary('No data available. Connect to the market to see live sector performance.');
          }
        } catch(e) {
          console.warn("Could not load cached sector data", e);
          setSectorData([]);
          setSummary('Could not load sector data.');
        }
    }

    setIsLoading(false);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 p-3 rounded-lg shadow-lg">
          <p className="text-gray-900 dark:text-gray-100 font-medium">{`${label}`}</p>
          <p className={`font-semibold ${payload[0].value >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {`Change: ${payload[0].value > 0 ? '+' : ''}${payload[0].value.toFixed(2)}%`}
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <Card className="h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
        <CardHeader className="pb-4">
          <Skeleton className="h-6 w-3/4 bg-gray-200 dark:bg-gray-600" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full mb-4 bg-gray-200 dark:bg-gray-600" />
          <Skeleton className="h-48 w-full bg-gray-200 dark:bg-gray-600 rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">Sector Rotation</CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={loadSectorData} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200 font-medium leading-relaxed">{summary}</p>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sectorData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <XAxis 
                dataKey="name" 
                stroke="#6b7280" 
                fontSize={12}
                tickFormatter={(name) => name}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={50}
              />
              <YAxis stroke="#6b7280" fontSize={12} unit="%" />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
              <Bar dataKey="change" name="Change" radius={[4, 4, 0, 0]}>
                {sectorData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.change >= 0 ? '#10b981' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
