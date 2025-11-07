
import React, { useState, useEffect } from 'react';
import { NewsArticle } from '@/entities/NewsArticle';
import { updateNewsData } from '@/functions/updateNewsData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Newspaper, RefreshCw, ExternalLink, Clock, Bookmark, TrendingUp, TrendingDown, Minus, Wifi, WifiOff } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import DataSourceIndicator from './DataSourceIndicator';

export default function CuratedFeed() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [hasRealData, setHasRealData] = useState(false);

  useEffect(() => {
    loadArticles();
    // Auto-refresh every 5 minutes for news
    const interval = setInterval(loadArticles, 300000);
    return () => clearInterval(interval);
  }, []);

  const loadArticles = async () => {
    setIsLoading(true);
    
    try {
      // Call the backend function properly
      const response = await updateNewsData();
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      if (response.data && response.data.success && response.data.data && response.data.data.length > 0) {
        // Check if the data is real or mock
        const isReal = !response.data.data[0].isMockData;
        setHasRealData(isReal);

        // Only process real data, skip mock data
        if (isReal) {
          const articlesToInsert = response.data.data.slice(0, 20).map(article => ({
            title: article.title || 'Untitled Article',
            summary: typeof article.summary === 'string' ? article.summary : 'No summary available.',
            content: article.content || article.summary || 'No content available.',
            source: article.source || 'Unknown Source',
            source_url: article.source_url || '',
            published_date: article.published_date || new Date().toISOString(),
            sentiment: article.sentiment || 'Neutral',
            impact_score: article.impact_score || 5,
            is_breaking: article.is_breaking || false,
            sector: article.sector || 'General',
            category: article.category || 'News',
            region: article.region || 'Global',
            tickers_mentioned: article.tickers_mentioned || [],
            key_insights: article.key_insights || [],
            is_bookmarked: article.is_bookmarked || false
          }));

          try {
            await NewsArticle.bulkCreate(articlesToInsert);
            setLastUpdate(new Date());
          } catch (dbError) {
            console.warn('Database insertion failed:', dbError);
          }
        }
      } else {
        setHasRealData(false);
      }

    } catch (error) {
      console.error("Error calling NewsAPI:", error);
      setHasRealData(false);
    }

    // Load articles from database only - no fallback data
    try {
      const data = await NewsArticle.list("-published_date", 20);
      setArticles(data);
    } catch (dbError) {
      console.error("Error fetching articles from database:", dbError);
      setArticles([]);
      setHasRealData(false); // If database load fails, assume no real data is currently displayed
    }

    setIsLoading(false);
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'Bullish': return <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'Bearish': return <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />;
      default: return <Minus className="w-4 h-4 text-gray-500 dark:text-gray-400" />;
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'Bullish': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800/50';
      case 'Bearish': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800/50';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700/50 dark:text-gray-300 dark:border-gray-600/50';
    }
  };

  const getImpactColor = (score) => {
    if (score >= 8) return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800/50';
    if (score >= 6) return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800/50';
    return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800/50';
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array(5).fill(0).map((_, i) => (
          <Card key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <Skeleton className="h-6 w-3/4 mb-3 bg-gray-200 dark:bg-gray-600" />
              <Skeleton className="h-16 w-full mb-4 bg-gray-200 dark:bg-gray-600" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20 bg-gray-200 dark:bg-gray-600" />
                <Skeleton className="h-6 w-16 bg-gray-200 dark:bg-gray-600" />
                <Skeleton className="h-6 w-24 bg-gray-200 dark:bg-gray-600" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <Newspaper className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Live Intelligence Feed</h2>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span>{hasRealData ? 'Live NewsAPI data streaming' : 'Waiting for live data - check API keys'}</span>
              {lastUpdate && (
                <div className="flex items-center gap-1">
                  {hasRealData ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                  {lastUpdate.toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DataSourceIndicator source={hasRealData ? "live-api" : "no-data"} />
          <Button variant="outline" onClick={loadArticles} disabled={isLoading} className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Feed
          </Button>
        </div>
      </div>

      {articles.length > 0 ? (
        articles.map(article => (
          <Card key={article.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-gray-800/50 transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 mr-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 leading-tight">
                    {typeof article.title === 'string' ? article.title : 'Untitled Article'}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <span className="font-medium">{article.source}</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.published_date ? formatDistanceToNow(new Date(article.published_date), { addSuffix: true }) : 'N/A'}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button variant="ghost" size="sm" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                    <Bookmark className="w-4 h-4" />
                  </Button>
                  {article.source_url && (
                    <Button variant="ghost" size="sm" asChild className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                      <a href={article.source_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              {article.summary && (
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  {typeof article.summary === 'string' ? article.summary : 'Summary not available'}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3">
                <Badge className={getSentimentColor(article.sentiment)}>
                  {getSentimentIcon(article.sentiment)}
                  <span className="ml-1">{article.sentiment || 'Neutral'}</span>
                </Badge>

                {article.impact_score && (
                  <Badge className={getImpactColor(article.impact_score)}>
                    Impact: {article.impact_score}/10
                  </Badge>
                )}

                {article.sector && (
                  <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700">
                    {article.sector}
                  </Badge>
                )}

                {article.tickers_mentioned && article.tickers_mentioned.length > 0 && (
                  <div className="flex gap-1">
                    {article.tickers_mentioned.slice(0, 3).map(ticker => (
                      <Badge key={ticker} variant="outline" className="text-xs font-mono bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200">
                        ${ticker}
                      </Badge>
                    ))}
                    {article.tickers_mentioned.length > 3 && (
                      <Badge variant="outline" className="text-xs bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400">
                        +{article.tickers_mentioned.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardContent className="text-center py-12">
            <WifiOff className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No Live Data Available</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Ensure your NewsAPI key is configured and try refreshing.
            </p>
            <Button onClick={loadArticles} variant="outline" className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
