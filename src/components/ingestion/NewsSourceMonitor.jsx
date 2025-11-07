import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  TrendingUp,
  Database,
  Zap,
  Globe
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { newsAPI } from '@/functions/newsAPI';
import { formatDistanceToNow } from 'date-fns';

const sourceIcons = {
  yahoo_rss: Globe,
  sec_company: Database,
  gnews_wires: Zap,
  gdelt_doc: TrendingUp
};

export default function NewsSourceMonitor() {
  const [sources, setSources] = useState([]);
  const [stats, setStats] = useState(null);
  const [recentNews, setRecentNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [sourcesRes, statsRes, newsRes] = await Promise.all([
        newsAPI({ endpoint: '/sources' }),
        newsAPI({ endpoint: '/stats' }),
        newsAPI({ endpoint: '/news?limit=10' })
      ]);

      if (sourcesRes.data?.success) setSources(sourcesRes.data.sources);
      if (statsRes.data?.success) setStats(statsRes.data.stats);
      if (newsRes.data?.success) setRecentNews(newsRes.data.data);

    } catch (error) {
      console.error('Error loading ingestion data:', error);
    }
    setIsLoading(false);
  };

  const triggerIngestion = async () => {
    try {
      setIsLoading(true);
      const response = await newsAPI({ 
        endpoint: '/ingest', 
        method: 'POST' 
      });
      
      if (response.data?.success) {
        setTimeout(loadData, 2000); // Reload data after ingestion
      }
    } catch (error) {
      console.error('Error triggering ingestion:', error);
    }
  };

  if (isLoading && !stats) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[1,2,3,4].map(i => (
                <Skeleton key={i} className="h-24" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            News Ingestion Pipeline
          </CardTitle>
          <div className="flex gap-2">
            <Button
              onClick={loadData}
              variant="outline"
              size="sm"
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              onClick={triggerIngestion}
              size="sm"
              disabled={isLoading}
            >
              <Zap className="w-4 h-4 mr-2" />
              Ingest Now
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-600">Articles (24h)</span>
                <TrendingUp className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-blue-900">
                {stats?.articles_last_24h || 0}
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-600">Alerts (24h)</span>
                <AlertCircle className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-green-900">
                {stats?.alerts_last_24h || 0}
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-purple-600">High Impact</span>
                <Zap className="w-4 h-4 text-purple-500" />
              </div>
              <div className="text-2xl font-bold text-purple-900">
                {stats?.high_impact_count || 0}
              </div>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-orange-600">Sources Active</span>
                <CheckCircle className="w-4 h-4 text-orange-500" />
              </div>
              <div className="text-2xl font-bold text-orange-900">
                {sources.filter(s => s.status === 'active').length}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="sources" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sources">Data Sources</TabsTrigger>
          <TabsTrigger value="recent">Recent Articles</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="sources">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sources.map((source) => {
              const IconComponent = sourceIcons[source.name] || Database;
              const sourceStats = stats?.sources?.[source.name];
              
              return (
                <Card key={source.name}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <IconComponent className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{source.display_name}</h3>
                          <p className="text-sm text-gray-500">
                            Updates every {source.interval / 60} min
                          </p>
                        </div>
                      </div>
                      <Badge 
                        variant={source.status === 'active' ? 'default' : 'secondary'}
                        className={source.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {source.status}
                      </Badge>
                    </div>

                    {sourceStats && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Articles (24h):</span>
                          <span className="font-medium">{sourceStats.count || 0}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Avg Impact:</span>
                          <span className="font-medium">{sourceStats.avg_impact || 'N/A'}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Recent Articles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentNews.map((article) => (
                  <div key={article.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-sm leading-tight">
                          {article.title}
                        </h4>
                        {article.is_breaking && (
                          <Badge className="bg-red-100 text-red-800 text-xs">
                            Breaking
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{article.source}</span>
                        <span>Impact: {article.impact_score}/10</span>
                        <span className={`px-2 py-1 rounded ${
                          article.sentiment === 'Bullish' ? 'bg-green-100 text-green-700' :
                          article.sentiment === 'Bearish' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {article.sentiment}
                        </span>
                        <span>
                          {formatDistanceToNow(new Date(article.published_date), { addSuffix: true })}
                        </span>
                      </div>

                      {article.tickers_mentioned && article.tickers_mentioned.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {article.tickers_mentioned.slice(0, 5).map(ticker => (
                            <Badge key={ticker} variant="outline" className="text-xs">
                              ${ticker}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-lg font-bold ${
                        article.impact_score >= 8 ? 'text-red-600' :
                        article.impact_score >= 6 ? 'text-orange-600' :
                        'text-gray-600'
                      }`}>
                        {article.impact_score}
                      </div>
                      <div className="text-xs text-gray-500">Impact</div>
                    </div>
                  </div>
                ))}
                
                {recentNews.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No recent articles found. Try triggering an ingestion.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Pipeline Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="font-medium">Processing Rate</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {stats?.articles_last_24h ? Math.round(stats.articles_last_24h / 24) : 0}
                    </div>
                    <div className="text-sm text-gray-500">articles/hour</div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span className="font-medium">Last Update</span>
                    </div>
                    <div className="text-sm font-medium text-blue-600">
                      {stats?.last_update 
                        ? formatDistanceToNow(new Date(stats.last_update), { addSuffix: true })
                        : 'Never'
                      }
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-purple-500" />
                      <span className="font-medium">Alert Rate</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-600">
                      {stats?.articles_last_24h && stats?.alerts_last_24h
                        ? Math.round((stats.alerts_last_24h / stats.articles_last_24h) * 100)
                        : 0
                      }%
                    </div>
                    <div className="text-sm text-gray-500">of articles</div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-medium mb-4">Source Breakdown (Last 24h)</h4>
                  <div className="space-y-2">
                    {Object.entries(stats?.sources || {}).map(([source, data]) => (
                      <div key={source} className="flex items-center justify-between py-2">
                        <span className="capitalize font-medium">{source.replace('_', ' ')}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-600">{data.count} articles</span>
                          <span className="text-sm text-gray-600">Avg: {data.avg_impact}</span>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${(data.count / Math.max(...Object.values(stats.sources).map(s => s.count))) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}