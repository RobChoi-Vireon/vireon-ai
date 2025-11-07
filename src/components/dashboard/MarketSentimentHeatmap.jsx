
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { NewsArticle } from '@/entities/NewsArticle';
import { CachedMarketData } from '@/entities/CachedMarketData';
import { isToday } from 'date-fns';

const sentimentToScore = (sentiment) => {
  if (sentiment === 'Bullish') return 1;
  if (sentiment === 'Bearish') return -1;
  return 0;
};

export default function MarketSentimentHeatmap() {
  const [heatmapData, setHeatmapData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHeatmapData();
  }, []);

  const loadHeatmapData = async () => {
    setIsLoading(true);

    try {
        // Try to load from cache first
        const cached = await CachedMarketData.filter({ cacheKey: 'market_sentiment_heatmap' });
        if (cached.length > 0 && isToday(new Date(cached[0].lastUpdated))) {
            setHeatmapData(cached[0].data.heatmap || []); // Access 'heatmap' property
            setIsLoading(false);
            return;
        }

        // Fetch recent news articles
        const articles = await NewsArticle.list('-published_date', 100);
        if (!articles || articles.length === 0) {
            setHeatmapData([]);
            setIsLoading(false);
            return;
        }

        const sentimentBySector = articles.reduce((acc, article) => {
            if (!article.sector || article.sector === 'General') return acc;
            
            if (!acc[article.sector]) {
                acc[article.sector] = { totalScore: 0, count: 0, volume: 0 };
            }
            
            acc[article.sector].totalScore += sentimentToScore(article.sentiment) * (article.impact_score || 5);
            acc[article.sector].count += (article.impact_score || 5); // Sum of impact scores
            acc[article.sector].volume += 1; // Count of articles
            
            return acc;
        }, {});
        
        const calculatedData = Object.entries(sentimentBySector)
            .map(([sector, data]) => ({
                sector,
                sentiment: data.count > 0 ? (data.totalScore / data.count) * 100 : 0,
                volume: data.volume > 15 ? 'High' : data.volume > 5 ? 'Medium' : 'Low'
            }))
            .sort((a, b) => b.sentiment - a.sentiment)
            .slice(0, 6); // Take top 6 sectors by sentiment
            
        setHeatmapData(calculatedData);
        
        // Update cache
        const cachePayload = { heatmap: calculatedData };
        const existingCache = await CachedMarketData.filter({ cacheKey: 'market_sentiment_heatmap' });
        if (existingCache.length > 0) {
            await CachedMarketData.update(existingCache[0].id, { data: cachePayload, lastUpdated: new Date().toISOString() });
        } else {
            await CachedMarketData.create({
                cacheKey: 'market_sentiment_heatmap',
                data: cachePayload,
                lastUpdated: new Date().toISOString()
            });
        }

    } catch (error) {
        console.error("Error loading heatmap data:", error);
        setHeatmapData([]); // Set to empty on error
    } finally {
        setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
        <CardHeader className="pb-4">
          <Skeleton className="h-6 w-3/4 bg-gray-200 dark:bg-gray-600" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {Array(6).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-20 bg-gray-200 dark:bg-gray-600 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">Market Sentiment</CardTitle>
        </div>
        <Button variant="ghost" size="icon" onClick={loadHeatmapData} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
          <RefreshCw className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {heatmapData.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {heatmapData.map((item, index) => (
              <div
                key={index}
                className="p-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <div className="flex justify-between items-center mb-3">
                  {/* Changed text-sm to text-base for improved readability of sector name */}
                  <span className="text-base font-semibold text-gray-800 dark:text-gray-200">{item.sector}</span>
                  {/* Changed text-xs to text-sm for improved readability of sentiment badge */}
                  <Badge 
                    className={`text-sm font-medium ${
                      item.sentiment > 0 
                        ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800/50' 
                        : 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800/50'
                    }`}
                  >
                    {item.sentiment >= 0 ? '+' : ''}{item.sentiment.toFixed(0)}%
                  </Badge>
                </div>
                {/* Changed text-xs to text-sm for improved readability of volume text */}
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  Volume: <span className="text-gray-800 dark:text-gray-200">{item.volume}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No sentiment data available. Ingest news to begin analysis.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
