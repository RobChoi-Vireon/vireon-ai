import React, { useState } from 'react';
import { TrendingUp, TrendingDown, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PulseCard({ pulse }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!pulse) return null;

  const getTrendColor = (trend) => {
    if (trend === 'up') return '#58E3A4';
    if (trend === 'down') return '#FF6A7A';
    return '#A8B3C7';
  };

  const getScoreColor = (score) => {
    if (score >= 70) return '#58E3A4';
    if (score >= 40) return '#4DA3FF';
    return '#FF6A7A';
  };

  return (
    <>
      {/* Main Pulse Card */}
      <div 
        className="relative p-6 rounded-2xl cursor-pointer group transition-all duration-200 hover:scale-[1.02]"
        style={{
          backgroundColor: 'var(--vrn-card)',
          backdropFilter: 'blur(20px)',
          border: '1px solid var(--vrn-border)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}
        onClick={() => setIsExpanded(true)}
      >
        {/* Trend Ribbon */}
        <div 
          className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
          style={{
            background: pulse.trend === 'up' 
              ? 'linear-gradient(90deg, #58E3A4 0%, #4DA3FF 100%)'
              : pulse.trend === 'down' 
              ? 'linear-gradient(90deg, #FF6A7A 0%, #FF8A65 100%)'
              : 'linear-gradient(90deg, #A8B3C7 0%, #B8C5D4 100%)'
          }}
        />
        
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-4 mb-3">
              <h2 className="text-2xl font-bold" style={{ color: 'var(--vrn-text-primary)' }}>
                Today Pulse
              </h2>
              <div 
                className="text-4xl font-bold"
                style={{ color: getScoreColor(pulse.score) }}
              >
                {pulse.score}
              </div>
            </div>
            <p className="text-base max-w-md leading-relaxed" style={{ color: 'var(--vrn-text-secondary)' }}>
              {pulse.blurb}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            {pulse.trend === 'up' ? (
              <TrendingUp className="w-8 h-8" style={{ color: '#58E3A4' }} />
            ) : pulse.trend === 'down' ? (
              <TrendingDown className="w-8 h-8" style={{ color: '#FF6A7A' }} />
            ) : (
              <div className="w-8 h-8 rounded-full" style={{ backgroundColor: '#A8B3C7' }} />
            )}
            <ChevronRight className="w-5 h-5 text-[#A8B3C7] group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Expanded Pulse Drawer */}
      {isExpanded && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            onClick={() => setIsExpanded(false)}
          />

          {/* Drawer */}
          <div className="fixed bottom-0 left-0 right-0 z-50 max-h-[80vh] overflow-hidden animate-in slide-in-from-bottom duration-300">
            <div 
              className="rounded-t-3xl border-t"
              style={{
                backgroundColor: 'var(--vrn-card)',
                backdropFilter: 'blur(20px)',
                borderColor: 'var(--vrn-border)'
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--vrn-border)' }}>
                <h3 className="text-xl font-semibold" style={{ color: 'var(--vrn-text-primary)' }}>
                  Market Pulse Details
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsExpanded(false)}
                  className="w-9 h-9 rounded-full"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
                {/* Key Drivers */}
                <div>
                  <h4 className="font-semibold mb-4" style={{ color: 'var(--vrn-text-primary)' }}>
                    Key Drivers
                  </h4>
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl" style={{
                      backgroundColor: 'rgba(77, 163, 255, 0.1)',
                      border: '1px solid rgba(77, 163, 255, 0.2)'
                    }}>
                      <div className="text-sm font-medium text-[#4DA3FF] mb-2">Macro</div>
                      <div style={{ color: 'var(--vrn-text-primary)' }}>{pulse.drivers?.macro}</div>
                    </div>
                    <div className="p-4 rounded-xl" style={{
                      backgroundColor: 'rgba(88, 227, 164, 0.1)',
                      border: '1px solid rgba(88, 227, 164, 0.2)'
                    }}>
                      <div className="text-sm font-medium text-[#58E3A4] mb-2">Sector</div>
                      <div style={{ color: 'var(--vrn-text-primary)' }}>{pulse.drivers?.sector}</div>
                    </div>
                    <div className="p-4 rounded-xl" style={{
                      backgroundColor: 'rgba(168, 179, 199, 0.1)',
                      border: '1px solid rgba(168, 179, 199, 0.2)'
                    }}>
                      <div className="text-sm font-medium text-[#A8B3C7] mb-2">Volatility</div>
                      <div style={{ color: 'var(--vrn-text-primary)' }}>{pulse.drivers?.volatility}</div>
                    </div>
                  </div>
                </div>

                {/* Upcoming Catalysts */}
                <div>
                  <h4 className="font-semibold mb-4" style={{ color: 'var(--vrn-text-primary)' }}>
                    Upcoming Catalysts
                  </h4>
                  <div className="space-y-3">
                    {pulse.catalysts?.map((catalyst, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between p-4 rounded-xl"
                        style={{
                          backgroundColor: 'var(--vrn-card)',
                          border: '1px solid var(--vrn-border)'
                        }}
                      >
                        <div>
                          <div className="font-medium" style={{ color: 'var(--vrn-text-primary)' }}>
                            {catalyst.event}
                          </div>
                          <div className="text-sm" style={{ color: 'var(--vrn-text-secondary)' }}>
                            {new Date(catalyst.date).toLocaleDateString()}
                          </div>
                        </div>
                        <div 
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: catalyst.impact === 'high' 
                              ? 'rgba(255, 106, 122, 0.2)' 
                              : catalyst.impact === 'medium' 
                              ? 'rgba(77, 163, 255, 0.2)' 
                              : 'rgba(168, 179, 199, 0.2)',
                            color: catalyst.impact === 'high' 
                              ? '#FF6A7A' 
                              : catalyst.impact === 'medium' 
                              ? '#4DA3FF' 
                              : '#A8B3C7'
                          }}
                        >
                          {catalyst.impact} impact
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}