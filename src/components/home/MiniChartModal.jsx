import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { dataAdapter } from '../core/DataAdapter';

export default function MiniChartModal({ metric, isOpen, onClose }) {
  const [timeframe, setTimeframe] = useState('24h');
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && metric) {
      loadChartData();
    }
  }, [isOpen, metric, timeframe]);

  const loadChartData = async () => {
    if (!metric) return;
    
    setLoading(true);
    try {
      const data = await dataAdapter.getChartData(metric.id, timeframe);
      setChartData(data);
    } catch (error) {
      console.error('Error loading chart data:', error);
    }
    setLoading(false);
  };

  const renderChart = () => {
    if (loading || !chartData.length) {
      return (
        <div className="h-48 flex items-center justify-center">
          <div className="animate-pulse" style={{ color: 'var(--vrn-text-secondary)' }}>
            Loading chart...
          </div>
        </div>
      );
    }

    const minPrice = Math.min(...chartData.map(d => d.price));
    const maxPrice = Math.max(...chartData.map(d => d.price));
    const priceRange = maxPrice - minPrice || 1;

    const points = chartData.map((d, i) => {
      const x = (i / (chartData.length - 1)) * 300;
      const y = 180 - ((d.price - minPrice) / priceRange) * 160;
      return `${x},${y}`;
    }).join(' ');

    const isPositive = chartData[chartData.length - 1].price > chartData[0].price;

    return (
      <div className="h-48 p-4">
        <svg width="100%" height="100%" viewBox="0 0 300 180" className="overflow-visible">
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="30" height="20" patternUnits="userSpaceOnUse">
              <path 
                d="M 30 0 L 0 0 0 20" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="0.5" 
                opacity="0.1"
                style={{ color: 'var(--vrn-text-secondary)' }}
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Area fill */}
          <path
            d={`M 0,180 L ${points} L 300,180 Z`}
            fill={`url(#gradient-${metric.id})`}
            opacity="0.1"
          />
          
          {/* Line */}
          <polyline
            fill="none"
            stroke={isPositive ? '#58E3A4' : '#FF6A7A'}
            strokeWidth="2"
            points={points}
          />
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id={`gradient-${metric.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={isPositive ? '#58E3A4' : '#FF6A7A'} />
              <stop offset="100%" stopColor={isPositive ? '#58E3A4' : '#FF6A7A'} stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  };

  if (!isOpen || !metric) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[500px] md:h-[400px] z-50 animate-in zoom-in-95 duration-200">
        <div 
          className="w-full h-full rounded-2xl overflow-hidden"
          style={{
            backgroundColor: 'var(--vrn-card)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--vrn-border)',
            boxShadow: '0 24px 64px rgba(0, 0, 0, 0.2)'
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--vrn-border)' }}>
            <div>
              <h3 className="text-xl font-semibold" style={{ color: 'var(--vrn-text-primary)' }}>
                {metric.label}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <span 
                  className="text-2xl font-bold"
                  style={{ color: 'var(--vrn-text-primary)' }}
                >
                  {metric.id === 'BTC' ? `$${metric.price.toLocaleString()}` : metric.price.toFixed(2)}
                </span>
                <span 
                  className="text-sm font-medium"
                  style={{ 
                    color: metric.deltaPct > 0 ? '#58E3A4' : metric.deltaPct < 0 ? '#FF6A7A' : 'var(--vrn-text-secondary)'
                  }}
                >
                  {metric.deltaPct > 0 ? '+' : ''}{metric.deltaPct.toFixed(2)}%
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="w-9 h-9 rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Timeframe Selector */}
          <div className="flex space-x-1 p-4 border-b" style={{ borderColor: 'var(--vrn-border)' }}>
            {['24h', '5d', '1m'].map((tf) => (
              <Button
                key={tf}
                variant={timeframe === tf ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimeframe(tf)}
                className={timeframe === tf ? "bg-[#4DA3FF] text-white" : ""}
              >
                {tf}
              </Button>
            ))}
          </div>

          {/* Chart */}
          <div className="flex-1">
            {renderChart()}
          </div>
        </div>
      </div>
    </>
  );
}