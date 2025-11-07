
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import {
  Briefcase,
  TrendingUp,
  TrendingDown,
  Info,
  Newspaper,
  Star,
  ExternalLink,
  Users
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { getOptimizedMarketData } from '@/functions/getOptimizedMarketData';

export default function TickerInfoPanel({ ticker, data, onSetAlert }) {
  const [profile, setProfile] = useState(null);
  const [finnhubNews, setFinnhubNews] = useState([]);
  const [recommendations, setRecommendations] = useState(null);
  const [metrics, setMetrics] = useState(null); // Added new state for metrics
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (ticker) {
      fetchTickerDetails();
    }
  }, [ticker]);

  const fetchTickerDetails = async () => {
    setIsLoading(true);
    try {
      // Use optimized API routing - Finnhub for fundamentals (their strength)
      const [fundamentalsRes, newsRes] = await Promise.all([
        getOptimizedMarketData({ dataType: 'fundamentals', ticker }),
        getOptimizedMarketData({ dataType: 'company_news', ticker })
      ]);
      
      if (fundamentalsRes.data && fundamentalsRes.data.data) {
        setProfile(fundamentalsRes.data.data.profile);
        setRecommendations(fundamentalsRes.data.data.recommendations);
        setMetrics(fundamentalsRes.data.data.metrics);
      } else {
        setProfile(null);
        setRecommendations(null);
        setMetrics(null);
      }
      
      if (newsRes.data && newsRes.data.data) {
        setFinnhubNews(newsRes.data.data || []);
      } else {
        setFinnhubNews([]);
      }
    } catch (error) {
      console.error(`Error fetching optimized details for ${ticker}:`, error);
      setProfile(null);
      setFinnhubNews([]);
      setRecommendations(null);
      setMetrics(null);
    }
    setIsLoading(false);
  };

  const recommendationData = recommendations ? [
    { name: 'Strong Buy', count: recommendations.strongBuy, color: '#10b981' },
    { name: 'Buy', count: recommendations.buy, color: '#34d399' },
    { name: 'Hold', count: recommendations.hold, color: '#f59e0b' },
    { name: 'Sell', count: recommendations.sell, color: '#f87171' },
    { name: 'Strong Sell', count: recommendations.strongSell, color: '#ef4444' },
  ] : [];

  if (!ticker || !data) {
    return (
      <Card className="bg-gray-800/50 border-none rounded-none shadow-none">
        <CardContent className="p-6 text-center text-gray-400">
          Select a ticker to view details.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="h-full">
      <Tabs defaultValue="profile" className="h-full flex flex-col">
        <TabsList className="grid w-full grid-cols-3 bg-gray-900 border-b border-gray-800 rounded-none">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="news">News</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>
        <div className="flex-1 overflow-auto">
          <TabsContent value="profile" className="p-4 space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-6 w-1/2" />
              </div>
            ) : profile ? (
              <>
                <div className="flex items-center gap-4">
                  {profile.logo && (
                    <img src={profile.logo} alt={`${profile.name} logo`} className="w-12 h-12 rounded-full bg-gray-700 p-1" />
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-gray-100">{profile.name}</h3>
                    <p className="text-sm text-gray-400">{profile.finnhubIndustry}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-gray-300 border-gray-600">{profile.exchange}</Badge>
                <p className="text-sm text-gray-300 leading-relaxed">{profile.description || "No description available."}</p>
                <Button asChild variant="outline" size="sm">
                  <a href={profile.weburl} target="_blank" rel="noopener noreferrer">
                    Visit Website <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </>
            ) : <p className="text-gray-400">No profile data available.</p>}
          </TabsContent>
          <TabsContent value="news" className="p-4 space-y-4">
            {isLoading ? (
              Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
            ) : finnhubNews.length > 0 ? (
              finnhubNews.slice(0, 10).map(newsItem => (
                <a href={newsItem.url} target="_blank" rel="noopener noreferrer" key={newsItem.id} className="block p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors">
                  <h4 className="font-semibold text-gray-200 mb-1 leading-tight">{newsItem.headline}</h4>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{newsItem.source}</span>
                    <span>{formatDistanceToNow(new Date(newsItem.datetime * 1000), { addSuffix: true })}</span>
                  </div>
                </a>
              ))
            ) : <p className="text-gray-400">No recent news available for this ticker.</p>}
          </TabsContent>
          <TabsContent value="analysis" className="p-4 space-y-4">
            {isLoading ? (
              <Skeleton className="h-48 w-full" />
            ) : recommendations ? (
              <>
                <h3 className="font-bold text-lg text-gray-100">Analyst Recommendations</h3>
                <p className="text-sm text-gray-400">
                  Based on {recommendations.strongBuy + recommendations.buy + recommendations.hold + recommendations.sell + recommendations.strongSell} analysts.
                  Last updated: {recommendations.period}
                </p>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={recommendationData} layout="vertical" margin={{ left: 20 }}>
                      <XAxis type="number" hide />
                      <YAxis type="category" dataKey="name" stroke="#9ca3af" fontSize={12} width={80} />
                      <Tooltip
                        cursor={{ fill: 'rgba(128, 128, 128, 0.1)' }}
                        contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem' }}
                      />
                      <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                        {recommendationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </>
            ) : <p className="text-gray-400">No analyst recommendation data available.</p>}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
