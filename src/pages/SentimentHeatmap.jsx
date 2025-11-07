import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  RefreshCw,
  BarChart3,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

export default function SentimentHeatmap() {
  const [articles, setArticles] = useState([]);
  const [timeframe, setTimeframe] = useState('24h');
  const [selectedSector, setSelectedSector] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  const sectors = [
    'All', 'Technology', 'Energy', 'Healthcare', 'Financial Services',
    'Consumer', 'Industrial', 'Real Estate', 'Utilities', 'Materials', 'Communications'
  ];

  useEffect(() => {
    loadData();
  }, [timeframe, selectedSector]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      let articleData = await base44.entities.NewsArticle.list('-published_date', 100);
      
      // Filter by timeframe
      const now = new Date();
      const cutoffTime = new Date();
      
      switch (timeframe) {
        case '1h':
          cutoffTime.setHours(now.getHours() - 1);
          break;
        case '4h':
          cutoffTime.setHours(now.getHours() - 4);
          break;
        case '24h':
          cutoffTime.setHours(now.getHours() - 24);
          break;
        case '7d':
          cutoffTime.setDate(now.getDate() - 7);
          break;
        default:
          cutoffTime.setHours(now.getHours() - 24);
      }

      articleData = articleData.filter(article => 
        new Date(article.published_date) >= cutoffTime
      );

      // Filter by sector
      if (selectedSector !== 'All') {
        articleData = articleData.filter(article => article.sector === selectedSector);
      }

      setArticles(articleData);
    } catch (error) {
      console.error('Error loading sentiment data:', error);
    }
    setIsLoading(false);
  };

  const getSentimentStats = () => {
    const stats = {
      bullish: articles.filter(a => a.sentiment === 'Bullish').length,
      bearish: articles.filter(a => a.sentiment === 'Bearish').length,
      neutral: articles.filter(a => a.sentiment === 'Neutral').length,
      total: articles.length
    };

    stats.bullishPercent = stats.total > 0 ? (stats.bullish / stats.total) * 100 : 0;
    stats.bearishPercent = stats.total > 0 ? (stats.bearish / stats.total) * 100 : 0;
    stats.neutralPercent = stats.total > 0 ? (stats.neutral / stats.total) * 100 : 0;

    return stats;
  };

  const getSectorSentiment = () => {
    const sectorData = {};
    
    sectors.slice(1).forEach(sector => {
      const sectorArticles = articles.filter(a => a.sector === sector);
      const bullish = sectorArticles.filter(a => a.sentiment === 'Bullish').length;
      const bearish = sectorArticles.filter(a => a.sentiment === 'Bearish').length;
      const total = sectorArticles.length;
      
      if (total > 0) {
        sectorData[sector] = {
          bullish,
          bearish,
          total,
          sentiment: bullish > bearish ? 'Bullish' : bearish > bullish ? 'Bearish' : 'Neutral',
          strength: total > 0 ? Math.abs(bullish - bearish) / total : 0
        };
      }
    });

    return sectorData;
  };

  const getRecentMoves = () => {
    return articles
      .filter(article => article.impact_score >= 7)
      .sort((a, b) => new Date(b.published_date) - new Date(a.published_date))
      .slice(0, 10);
  };

  const stats = getSentimentStats();
  const sectorData = getSectorSentiment();
  const recentMoves = getRecentMoves();

  const getSentimentColor = (sentiment, isBackground = false) => {
    switch (sentiment) {
      case 'Bullish':
        return isBackground ? 'bg-green-900/30 border-green-800' : 'text-green-300';
      case 'Bearish':
        return isBackground ? 'bg-red-900/30 border-red-800' : 'text-red-300';
      default:
        return isBackground ? 'bg-gray-700 border-gray-600' : 'text-gray-300';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-8 w-64 bg-gray-700" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-48 bg-gray-700" />
          <Skeleton className="h-48 bg-gray-700" />
          <Skeleton className="h-48 bg-gray-700" />
        </div>
        <Skeleton className="h-96 bg-gray-700" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-100 mb-2">Sentiment Time Series Dashboard</h1>
          <p className="text-gray-400">
            Real-time market sentiment analysis across sectors and timeframes
          </p>
        </div>
        
        <div className="flex gap-3">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32 bg-gray-800 border-gray-600 text-gray-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="1h" className="text-gray-100">1 Hour</SelectItem>
              <SelectItem value="4h" className="text-gray-100">4 Hours</SelectItem>
              <SelectItem value="24h" className="text-gray-100">24 Hours</SelectItem>
              <SelectItem value="7d" className="text-gray-100">7 Days</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedSector} onValueChange={setSelectedSector}>
            <SelectTrigger className="w-48 bg-gray-800 border-gray-600 text-gray-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              {sectors.map(sector => (
                <SelectItem key={sector} value={sector} className="text-gray-100">
                  {sector}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={loadData} className="bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800/50 border border-gray-700/60">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Articles</p>
                <p className="text-2xl font-bold text-gray-100">{stats.total}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border border-gray-700/60">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Bullish</p>
                <p className="text-2xl font-bold text-green-300">{stats.bullish}</p>
                <p className="text-xs text-gray-500">{stats.bullishPercent.toFixed(1)}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border border-gray-700/60">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Bearish</p>
                <p className="text-2xl font-bold text-red-300">{stats.bearish}</p>
                <p className="text-xs text-gray-500">{stats.bearishPercent.toFixed(1)}%</p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border border-gray-700/60">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Neutral</p>
                <p className="text-2xl font-bold text-gray-300">{stats.neutral}</p>
                <p className="text-xs text-gray-500">{stats.neutralPercent.toFixed(1)}%</p>
              </div>
              <BarChart3 className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sector Heatmap */}
        <Card className="bg-gray-800/50 border border-gray-700/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-100">
              <BarChart3 className="w-5 h-5 text-purple-400" />
              Sector Sentiment Heatmap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(sectorData).map(([sector, data]) => (
                <div
                  key={sector}
                  className={`p-4 rounded-lg border transition-colors ${getSentimentColor(data.sentiment, true)}`}
                >
                  <h4 className="font-semibold text-sm text-gray-100 mb-2">{sector}</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Articles</span>
                      <span className="text-gray-300">{data.total}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className={getSentimentColor(data.sentiment)}>
                        {data.sentiment}
                      </span>
                      <span className="text-gray-300">
                        {(data.strength * 100).toFixed(0)}% confidence
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {Object.keys(sectorData).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No sector data available for the selected timeframe</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent High-Impact Moves */}
        <Card className="bg-gray-800/50 border border-gray-700/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-100">
              <Activity className="w-5 h-5 text-orange-400" />
              High-Impact Stories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentMoves.map(article => (
                <div key={article.id} className="p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-semibold text-gray-100 leading-tight">
                      {article.title}
                    </h4>
                    <Badge className={getSentimentColor(article.sentiment, true)}>
                      {article.sentiment}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{article.sector}</span>
                    <div className="flex items-center gap-2">
                      <span>Impact: {article.impact_score}/10</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {format(new Date(article.published_date), 'HH:mm')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {recentMoves.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No high-impact stories in the selected timeframe</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sentiment Timeline */}
      <Card className="bg-gray-800/50 border border-gray-700/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-100">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            Sentiment Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-semibold">Sentiment Chart Visualization</p>
              <p className="text-sm">Interactive timeline chart would be rendered here</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}