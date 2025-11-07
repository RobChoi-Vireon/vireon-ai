
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import DataSourceIndicator from './DataSourceIndicator';
import { AlphaIdea } from '@/entities/AlphaIdea'; // New import for the real entity

export default function AlphaSignalsPulse({ compact = false }) {
  const [signals, setSignals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial load
    loadSignals();

    // Set up polling for real-time reliability
    const intervalId = setInterval(() => {
      loadSignals();
    }, 30000); // Poll every 30 seconds

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  const loadSignals = async () => {
    setIsLoading(true);

    try {
      // Load real alpha ideas from database using the AlphaIdea entity
      const alphaIdeas = await AlphaIdea.list('-date', 5);

      if (alphaIdeas && alphaIdeas.length > 0) {
        const transformedSignals = alphaIdeas.map(idea => ({
          id: idea.id,
          signal_type: idea.sentiment_bias || 'Strategy',
          ticker: idea.tickers?.[0] || 'MARKET',
          // More precise direction detection using toLowerCase()
          direction: idea.summary?.toLowerCase().includes('bullish') ? 'Bullish' : idea.summary?.toLowerCase().includes('bearish') ? 'Bearish' : 'Neutral',
          confidence: idea.idea_score || 70,
          timeframe: idea.time_horizon || '1-3 Days',
          rationale: idea.summary || 'Alpha signal detected',
          generated_at: idea.date || new Date().toISOString()
        }));

        setSignals(transformedSignals);
      } else {
        setSignals([]);
      }
    } catch (error) {
      console.error('Error loading alpha signals:', error);
      setSignals([]);
    }

    setIsLoading(false);
  };

  const getSignalColor = (direction) => {
    if (direction === 'Bullish') {
      return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800/50';
    } else if (direction === 'Bearish') {
      return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800/50';
    } else {
      return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700/50 dark:text-gray-300 dark:border-gray-600';
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-green-600 dark:text-green-400';
    if (confidence >= 60) return 'text-yellow-600 dark:text-yellow-400';
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
            {Array(3).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-20 bg-gray-200 dark:bg-gray-600 rounded-lg" />
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
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">Alpha Signals</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <DataSourceIndicator source={signals.length > 0 ? "database" : "no-data"} />
            <Button variant="ghost" size="icon" onClick={loadSignals} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {signals.length > 0 ? (
          <div className="space-y-4">
            {signals.map((signal) => (
              <div key={signal.id} className="p-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-bold font-mono text-lg text-gray-900 dark:text-gray-100">{signal.ticker}</span>
                    <Badge className={getSignalColor(signal.direction)}>
                      {signal.direction === 'Bullish' ? <TrendingUp className="w-3 h-3 mr-1" /> : signal.direction === 'Bearish' ? <TrendingDown className="w-3 h-3 mr-1" /> : null}
                      {signal.direction}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${getConfidenceColor(signal.confidence)}`}>
                      {signal.confidence}%
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {signal.timeframe}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {signal.rationale}
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                  <Badge variant="outline" className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700">
                    {signal.signal_type}
                  </Badge>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {signal.generated_at ? new Date(signal.generated_at).toLocaleString() : 'N/A'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Zap className="w-8 h-8 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400 text-sm mb-2">No alpha signals available</p>
            <p className="text-gray-500 text-xs">Signals will appear as new data is ingested.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
