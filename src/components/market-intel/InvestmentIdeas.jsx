import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lightbulb, TrendingUp, TrendingDown, DollarSign, Clock, Star, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function InvestmentIdeas() {
  const [globalIndices, setGlobalIndices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState('US');

  useEffect(() => {
    loadGlobalData();
  }, []);

  const loadGlobalData = async () => {
    setIsLoading(true);

    // Mock global market data based on your screenshots
    const mockGlobalData = {
      US: [
        { name: 'S&P 500', price: 6391.60, change: 51.60, changePercent: 0.81 },
        { name: 'Dow 30', price: 44224.10, change: 255.46, changePercent: 0.58 },
        { name: 'Nasdaq', price: 21448.92, change: 206.23, changePercent: 0.97 },
        { name: 'Russell 2000', price: 2220.74, change: 6.03, changePercent: 0.27 },
        { name: 'VIX', price: 15.42, change: -1.15, changePercent: -6.94 },
        { name: 'Gold', price: 3454.30, change: 0.60, changePercent: 0.02 }
      ],
      Europe: [
        { name: 'FTSE 100', price: 8234.50, change: -15.20, changePercent: -0.18 },
        { name: 'DAX', price: 18956.30, change: 45.80, changePercent: 0.24 },
        { name: 'CAC 40', price: 7523.40, change: -8.90, changePercent: -0.12 },
        { name: 'Euro Stoxx 50', price: 4987.20, change: 12.30, changePercent: 0.25 }
      ],
      Asia: [
        { name: 'Nikkei 225', price: 39101.00, change: -145.20, changePercent: -0.37 },
        { name: 'Shanghai Composite', price: 2856.40, change: 8.90, changePercent: 0.31 },
        { name: 'Hang Seng', price: 17234.50, change: -89.20, changePercent: -0.51 },
        { name: 'Kospi', price: 2634.80, change: 15.40, changePercent: 0.59 }
      ],
      Cryptocurrencies: [
        { name: 'Bitcoin', price: 67234.50, change: 1234.20, changePercent: 1.87 },
        { name: 'Ethereum', price: 3456.80, change: -45.20, changePercent: -1.29 },
        { name: 'BNB', price: 589.40, change: 8.90, changePercent: 1.53 },
        { name: 'Solana', price: 189.20, change: -5.40, changePercent: -2.77 }
      ],
      Rates: [
        { name: '10Y Treasury', price: 4.28, change: 0.02, changePercent: 0.47 },
        { name: '2Y Treasury', price: 4.15, change: -0.01, changePercent: -0.24 },
        { name: '30Y Treasury', price: 4.52, change: 0.03, changePercent: 0.67 },
        { name: 'Fed Funds Rate', price: 5.25, change: 0, changePercent: 0 }
      ]
    };

    setGlobalIndices(mockGlobalData);
    setIsLoading(false);
  };

  const renderIndexCard = (index) => {
    const isPositive = index.changePercent > 0;
    const isNeutral = index.changePercent === 0;
    
    return (
      <div key={index.name} className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/50">
        <div className="mb-2">
          <h4 className="text-white font-medium text-sm">{index.name}</h4>
        </div>
        
        <div className="mb-3">
          <span className="text-2xl font-bold text-white">
            {index.price.toLocaleString(undefined, { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 2 
            })}
          </span>
        </div>
        
        {/* Mini chart placeholder */}
        <div className="mb-3 h-8 flex items-end">
          <svg width="100%" height="32" viewBox="0 0 100 32" className="opacity-70">
            <path
              d={generateIndexChart(index.changePercent)}
              stroke={isNeutral ? '#6b7280' : isPositive ? '#10b981' : '#ef4444'}
              strokeWidth="1.5"
              fill="none"
            />
          </svg>
        </div>
        
        <div className="flex items-center gap-1 text-sm">
          {isNeutral ? (
            <span className="text-gray-400">—</span>
          ) : isPositive ? (
            <TrendingUp className="w-4 h-4 text-green-400" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-400" />
          )}
          <span className={`font-medium ${
            isNeutral ? 'text-gray-400' : isPositive ? 'text-green-400' : 'text-red-400'
          }`}>
            {isPositive ? '+' : ''}{index.change.toFixed(2)} ({isPositive ? '+' : ''}{index.changePercent.toFixed(2)}%)
          </span>
        </div>
      </div>
    );
  };

  const generateIndexChart = (changePercent) => {
    const isPositive = changePercent > 0;
    if (changePercent === 0) {
      return 'M0,16 L100,16'; // Flat line for no change
    } else if (isPositive) {
      return 'M0,28 L20,25 L40,22 L60,18 L80,12 L100,8';
    } else {
      return 'M0,8 L20,12 L40,18 L60,22 L80,25 L100,28';
    }
  };

  if (isLoading) {
    return (
      <Card className="h-full bg-gray-800/50 border-gray-700">
        <CardHeader>
          <Skeleton className="h-6 w-40 bg-gray-700" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {Array(6).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-32 bg-gray-700 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const regions = Object.keys(globalIndices);
  const currentData = globalIndices[selectedRegion] || [];

  return (
    <Card className="h-full bg-gray-800/50 border-gray-700">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-gray-100">Global Markets</CardTitle>
          <Button variant="ghost" size="icon" onClick={loadGlobalData}>
            <RefreshCw className="w-4 h-4 text-gray-400" />
          </Button>
        </div>
        
        {/* Market close indicator */}
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-400">U.S. markets close in 1h 14m</span>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {/* Region Tabs */}
        <div className="px-4 pb-4">
          <div className="flex gap-2 overflow-x-auto">
            {regions.map((region) => (
              <Button
                key={region}
                variant={selectedRegion === region ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedRegion(region)}
                className={`${
                  selectedRegion === region 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                } whitespace-nowrap`}
              >
                {region}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Indices Grid */}
        <div className="px-4 pb-4">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {currentData.map(renderIndexCard)}
          </div>
        </div>
        
        {/* Navigation arrows */}
        <div className="flex justify-center pb-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="w-8 h-8 text-gray-400">
              <span className="text-lg">‹</span>
            </Button>
            <Button variant="ghost" size="icon" className="w-8 h-8 text-gray-400">
              <span className="text-lg">›</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}