import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { NewsArticle } from '@/entities/NewsArticle';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

const NewsItem = ({ article }) => {
  const getImpactColor = (score) => {
    if (score >= 8) return 'bg-red-500';
    if (score >= 5) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  return (
    <div className="p-4 rounded-lg bg-gray-800/70 border border-gray-700/80">
      <div className="flex justify-between items-start mb-2">
        <p className="text-sm font-semibold text-white flex-1">{article.title}</p>
        <Badge className={`ml-4 text-white ${getImpactColor(article.impact_score)}`}>
          Impact: {article.impact_score}
        </Badge>
      </div>
      <p className="text-sm text-gray-400 mb-3">{article.summary?.substring(0, 120)}...</p>
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>{article.source}</span>
        <span>{formatDistanceToNow(new Date(article.published_date), { addSuffix: true })}</span>
      </div>
    </div>
  )
};

export default function NewsImpactFeed({ isLoading }) {
  const [articles, setArticles] = useState([]);
  
  useEffect(() => {
    const fetchNews = async () => {
      const newsData = await NewsArticle.list('-impact_score', 10);
      setArticles(newsData);
    };
    if (!isLoading) {
      fetchNews();
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <Card className="bg-gray-800/50 border-gray-700/60 h-full">
        <CardHeader><Skeleton className="h-6 w-32 bg-gray-700" /></CardHeader>
        <CardContent className="space-y-4">
          {Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-24 bg-gray-700" />)}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700/60 h-full">
      <CardHeader>
        <CardTitle className="text-white">News Impact Feed</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {articles.length > 0 ? (
          articles.map(article => <NewsItem key={article.id} article={article} />)
        ) : (
          <div className="text-center py-10 text-gray-500">No news available.</div>
        )}
      </CardContent>
    </Card>
  );
}