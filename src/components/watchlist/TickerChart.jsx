import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, TrendingDown, Maximize2, Volume2, Bell } from 'lucide-react';

export default function TickerChart({ ticker, data }) {
  const [timeframe, setTimeframe] = useState('5D');
  
  if (!data) {
    return (
      <Card className="bg-gray-800/50 border border-gray-700/60">
        <CardContent className="p-6">
          <div className="text-center py-8 text-gray-500">
            <BarChart3 className="w-8 h-8 mx-auto mb-2" />
            <p>Chart data loading...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Generate mock chart data for visualization
  const generateChartData = () => {
    const points = 50;
    const basePrice = data.current_price || 100;
    const chartData = [];
    
    for (let i = 0; i < points; i++) {
      const variation = (Math.random() - 0.5) * 0.1;
      const price = basePrice * (1 + variation);
      chartData.push({
        time: i,
        price: price,
        volume: Math.random() * 1000000
      });
    }
    return chartData;
  };

  const chartData = data.chart_data || generateChartData();
  const maxPrice = Math.max(...chartData.map(d => d.price));
  const minPrice = Math.min(...chartData.map(d => d.price));
  const priceRange = maxPrice - minPrice;

  const getPointHeight = (price) => {
    if (priceRange === 0) return 50;
    return ((price - minPrice) / priceRange) * 100;
  };

  const isPositive = data.change >= 0;

  return (
    <Card className="bg-gray-800/50 border border-gray-700/60">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-gray-100">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            ${ticker} Chart
          </CardTitle>
          <div className="flex gap-1">
            {['1D', '5D', '1M', '3M', 'YTD', '1Y'].map(period => (
              <Button
                key={period}
                variant={timeframe === period ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeframe(period)}
                className={`text-xs ${
                  timeframe === period 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
                }`}
              >
                {period}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Price Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-3xl font-bold text-gray-100">
              ${data.current_price?.toFixed(2) || '--'}
            </div>
            <div className={`flex items-center gap-2 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? (
                <TrendingUp className="w-5 h-5" />
              ) : (
                <TrendingDown className="w-5 h-5" />
              )}
              <span className="font-semibold text-lg">
                {data.change > 0 ? '+' : ''}{data.change?.toFixed(2) || '--'} 
                ({data.change_percent > 0 ? '+' : ''}{data.change_percent?.toFixed(2) || '--'}%)
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant="outline" className="text-xs bg-gray-700 text-gray-300 border-gray-600">
              {timeframe} View
            </Badge>
            {data.alert_count > 0 && (
              <Badge className="bg-orange-900/30 text-orange-300 border-orange-600 text-xs">
                <Bell className="w-3 h-3 mr-1" />
                {data.alert_count} Alert{data.alert_count > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </div>

        {/* Interactive Chart */}
        <div className="relative h-48 bg-gray-900/50 rounded-lg p-4 mb-4">
          <svg 
            className="w-full h-full" 
            viewBox="0 0 400 160"
            preserveAspectRatio="none"
          >
            {/* Grid lines */}
            <defs>
              <pattern id="grid" width="40" height="32" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 32" fill="none" stroke="#374151" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* Price line */}
            {chartData.length > 1 && (
              <polyline
                fill="none"
                stroke={isPositive ? "#10b981" : "#ef4444"}
                strokeWidth="2"
                points={
                  chartData.map((point, index) => {
                    const x = (index / (chartData.length - 1)) * 400;
                    const y = 160 - (getPointHeight(point.price) * 160 / 100);
                    return `${x},${y}`;
                  }).join(' ')
                }
              />
            )}
            
            {/* Data points with hover effects */}
            {chartData.map((point, index) => {
              const x = (index / (chartData.length - 1)) * 400;
              const y = 160 - (getPointHeight(point.price) * 160 / 100);
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="3"
                  fill={isPositive ? "#10b981" : "#ef4444"}
                  className="hover:r-5 cursor-pointer transition-all opacity-0 hover:opacity-100"
                >
                  <title>${point.price.toFixed(2)} | Vol: {point.volume?.toLocaleString()}</title>
                </circle>
              );
            })}

            {/* Alert markers (mock) */}
            {[0.2, 0.6, 0.8].map((position, i) => (
              <g key={i}>
                <circle
                  cx={position * 400}
                  cy={30}
                  r="4"
                  fill="#f59e0b"
                  className="animate-pulse"
                />
                <text
                  x={position * 400}
                  y={20}
                  textAnchor="middle"
                  className="text-xs fill-yellow-500"
                >
                  📢
                </text>
              </g>
            ))}
          </svg>
          
          {/* Price labels */}
          <div className="absolute left-0 top-0 flex flex-col justify-between h-full text-xs text-gray-500 -ml-12">
            <span>${maxPrice?.toFixed(2)}</span>
            <span>${((maxPrice + minPrice) / 2)?.toFixed(2)}</span>
            <span>${minPrice?.toFixed(2)}</span>
          </div>

          {/* Expand button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-300"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Volume Chart */}
        <div className="h-12 bg-gray-900/30 rounded-lg p-2 mb-4">
          <div className="flex items-end justify-between h-full">
            {chartData.slice(-20).map((point, index) => {
              const height = (point.volume / Math.max(...chartData.map(p => p.volume))) * 100;
              return (
                <div
                  key={index}
                  className="bg-gray-500 rounded-sm flex-1 mx-px transition-all hover:bg-blue-500"
                  style={{ height: `${height}%` }}
                  title={`Volume: ${point.volume?.toLocaleString()}`}
                ></div>
              );
            })}
          </div>
        </div>

        {/* Chart Footer Stats */}
        <div className="grid grid-cols-3 gap-4 text-xs text-gray-400">
          <div>
            <div className="font-medium">52W Range</div>
            <div>${data.week52_low?.toFixed(2)} - ${data.week52_high?.toFixed(2)}</div>
          </div>
          <div>
            <div className="font-medium flex items-center gap-1">
              <Volume2 className="w-3 h-3" />
              Volume
            </div>
            <div>{data.volume}</div>
          </div>
          <div>
            <div className="font-medium">Market Cap</div>
            <div>{data.market_cap}</div>
          </div>
        </div>

        {/* AI Commentary */}
        <div className="mt-4 p-3 bg-blue-900/20 border border-blue-800/30 rounded-lg">
          <div className="text-sm font-medium text-blue-300 mb-1">AI Commentary</div>
          <p className="text-xs text-blue-200/80 leading-relaxed">
            {timeframe} view shows {isPositive ? 'bullish' : 'bearish'} momentum with {Math.abs(data.change_percent).toFixed(1)}% movement. 
            Volume is {data.volume_ratio > 1.5 ? 'elevated' : 'normal'} at {data.volume_ratio?.toFixed(1)}x average. 
            Recent sentiment analysis indicates {data.ai_sentiment_score > 0 ? 'positive' : 'negative'} market perception.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}