import React, { useState } from 'react';
import { TrendingUp, TrendingDown, MoreHorizontal, AlertCircle, BarChart3, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function WatchlistItem({ stock, onRemove, viewMode }) {
  const [showQuickActions, setShowQuickActions] = useState(false);
  
  const isPositive = stock.deltaPct > 0;
  const isNeutral = stock.deltaPct === 0;

  const getSentimentColor = (sentiment) => {
    if (sentiment >= 0.6) return 'border-l-[#58E3A4] bg-[#58E3A4]/5';
    if (sentiment <= 0.4) return 'border-l-[#FF6A7A] bg-[#FF6A7A]/5';
    return 'border-l-[#A8B3C7] bg-[#A8B3C7]/5';
  };

  const renderSparkline = (data) => {
    if (!data || data.length < 2) return null;
    
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 60;
      const y = 20 - ((value - min) / range) * 20;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width="60" height="20">
        <polyline
          fill="none"
          stroke={isPositive ? '#58E3A4' : '#FF6A7A'}
          strokeWidth="1.5"
          points={points}
          opacity="0.8"
        />
      </svg>
    );
  };

  if (viewMode === 'heat') {
    return (
      <div 
        className={`
          p-4 rounded-xl backdrop-blur-lg cursor-pointer group
          bg-[rgba(255,255,255,0.72)] dark:bg-[rgba(18,20,28,0.6)]
          border-l-4 ${getSentimentColor(stock.sentiment)}
          hover:shadow-md transition-all duration-200
        `}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <span className="font-mono font-bold text-[#4DA3FF] text-lg">
                {stock.symbol}
              </span>
              <span className="text-sm text-[#A8B3C7] truncate">
                {stock.name}
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-xl font-bold">
                ${stock.price.toFixed(2)}
              </div>
              <div className={`
                flex items-center space-x-1 text-sm font-medium
                ${isNeutral ? 'text-[#A8B3C7]' : isPositive ? 'text-[#58E3A4]' : 'text-[#FF6A7A]'}
              `}>
                {!isNeutral && (
                  isPositive ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )
                )}
                <span>{isPositive ? '+' : ''}{stock.deltaPct.toFixed(2)}%</span>
              </div>
              {renderSparkline(stock.spark)}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <AlertCircle className="w-4 h-4 mr-2" />
                Set Alert
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BarChart3 className="w-4 h-4 mr-2" />
                Compare
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onRemove(stock.symbol)}
                className="text-[#FF6A7A]"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Sentiment intensity bar */}
        <div className="mt-3 h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
          <div 
            className={`
              h-full transition-all duration-300
              ${stock.sentiment >= 0.6 ? 'bg-[#58E3A4]' : 
                stock.sentiment <= 0.4 ? 'bg-[#FF6A7A]' : 'bg-[#A8B3C7]'}
            `}
            style={{ width: `${stock.sentiment * 100}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`
        p-4 rounded-xl backdrop-blur-lg
        bg-[rgba(255,255,255,0.72)] dark:bg-[rgba(18,20,28,0.6)]
        border border-black/5 dark:border-white/5
        hover:shadow-md transition-all duration-200
        ${getSentimentColor(stock.sentiment)}
      `}
    >
      <div className="flex items-center justify-between">
        {/* Symbol & Name */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3 mb-1">
            <span className="font-mono font-bold text-[#4DA3FF] text-lg">
              {stock.symbol}
            </span>
            <div 
              className={`
                w-2 h-2 rounded-full
                ${stock.sentiment >= 0.6 ? 'bg-[#58E3A4]' : 
                  stock.sentiment <= 0.4 ? 'bg-[#FF6A7A]' : 'bg-[#A8B3C7]'}
              `}
              title={`Sentiment: ${(stock.sentiment * 100).toFixed(0)}%`}
            />
          </div>
          <p className="text-sm text-[#A8B3C7] truncate">{stock.name}</p>
          <p className="text-xs text-[#A8B3C7] mt-1">
            Vol: {(stock.volume / 1000000).toFixed(1)}M • {stock.marketCap}
          </p>
        </div>

        {/* Price */}
        <div className="text-right flex-shrink-0 mx-6">
          <div className="text-xl font-bold">
            ${stock.price.toFixed(2)}
          </div>
        </div>

        {/* Change */}
        <div className="text-right flex-shrink-0 mx-6">
          <div className={`
            flex items-center space-x-1 text-sm font-medium
            ${isNeutral ? 'text-[#A8B3C7]' : isPositive ? 'text-[#58E3A4]' : 'text-[#FF6A7A]'}
          `}>
            {!isNeutral && (
              isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )
            )}
            <span>{isPositive ? '+' : ''}{stock.deltaPct.toFixed(2)}%</span>
          </div>
        </div>

        {/* Sparkline */}
        <div className="flex-shrink-0 mx-6">
          {renderSparkline(stock.spark)}
        </div>

        {/* Actions */}
        <div className="flex-shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <AlertCircle className="w-4 h-4 mr-2" />
                Set Alert
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BarChart3 className="w-4 h-4 mr-2" />
                Compare
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onRemove(stock.symbol)}
                className="text-[#FF6A7A]"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}