import React from 'react';
import { TrendingUp, TrendingDown, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function WatchlistCarousel({ watchlist }) {
  const getSentimentIntensity = (sentiment) => {
    const alpha = sentiment >= 0.6 ? 0.3 : sentiment <= 0.4 ? 0.3 : 0.1;
    const color = sentiment >= 0.6 ? '88, 227, 164' : sentiment <= 0.4 ? '255, 106, 122' : '168, 179, 199';
    return `rgba(${color}, ${alpha})`;
  };

  const renderSparkline = (data) => {
    if (!data || data.length < 2) return null;
    
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 40;
      const y = 16 - ((value - min) / range) * 16;
      return `${x},${y}`;
    }).join(' ');

    const isPositive = data[data.length - 1] > data[0];

    return (
      <svg width="40" height="16" className="opacity-60">
        <polyline
          fill="none"
          stroke={isPositive ? '#58E3A4' : '#FF6A7A'}
          strokeWidth="1.5"
          points={points}
        />
      </svg>
    );
  };

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex space-x-4 min-w-max">
        {watchlist.map((stock) => {
          const isPositive = stock.deltaPct > 0;
          const isNeutral = stock.deltaPct === 0;

          return (
            <div 
              key={stock.symbol}
              className="relative p-4 rounded-xl min-w-[180px] group cursor-pointer transition-all duration-200 hover:scale-[1.02]"
              style={{
                backgroundColor: 'var(--vrn-card)',
                backdropFilter: 'blur(20px)',
                border: '1px solid var(--vrn-border)',
                boxShadow: `0 4px 24px ${getSentimentIntensity(stock.sentiment)}`
              }}
            >
              {/* Quick Actions (appears on hover) */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-6 h-6"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-3">
                {/* Header */}
                <div>
                  <div className="font-mono font-bold text-[#4DA3FF] text-lg">
                    {stock.symbol}
                  </div>
                  <div 
                    className="text-xs truncate"
                    style={{ color: 'var(--vrn-text-secondary)' }}
                  >
                    {stock.name}
                  </div>
                </div>

                {/* Price & Change */}
                <div className="space-y-1">
                  <div 
                    className="text-xl font-bold"
                    style={{ color: 'var(--vrn-text-primary)' }}
                  >
                    ${stock.price.toFixed(2)}
                  </div>
                  <div className="flex items-center justify-between">
                    <div 
                      className="text-sm font-medium flex items-center space-x-1"
                      style={{ 
                        color: isNeutral ? 'var(--vrn-text-secondary)' : isPositive ? '#58E3A4' : '#FF6A7A'
                      }}
                    >
                      {!isNeutral && (
                        isPositive ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )
                      )}
                      <span>{isPositive ? '+' : ''}{stock.deltaPct.toFixed(2)}%</span>
                    </div>
                    {renderSparkline(stock.spark)}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div 
                    className="text-xs"
                    style={{ color: 'var(--vrn-text-secondary)' }}
                  >
                    Vol: {(stock.volume / 1000000).toFixed(1)}M
                  </div>
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{
                      background: stock.sentiment >= 0.6 
                        ? 'linear-gradient(135deg, #58E3A4 0%, #4DA3FF 100%)'
                        : stock.sentiment <= 0.4 
                        ? 'linear-gradient(135deg, #FF6A7A 0%, #FF8A65 100%)'
                        : '#A8B3C7'
                    }}
                    title={`Sentiment: ${(stock.sentiment * 100).toFixed(0)}%`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}