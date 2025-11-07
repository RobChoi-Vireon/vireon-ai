import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, ExternalLink } from 'lucide-react';
import NewsCard from './NewsCard';
import { Skeleton } from '@/components/ui/skeleton';

// Safe text extraction helper
const safeText = (value, defaultText = "") => {
  if (value === null || value === undefined) return defaultText;
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toString();
  if (typeof value === 'boolean') return value.toString();
  if (typeof value === 'object') {
    if (value.summary && typeof value.summary === 'string') return value.summary;
    if (value.text && typeof value.text === 'string') return value.text;
    if (value.content && typeof value.content === 'string') return value.content;
    try {
      return JSON.stringify(value);
    } catch (e) {
      return defaultText;
    }
  }
  return String(value);
};

export default function NewsFeed() {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    loadNews();
    // Auto-refresh every 90 seconds for news
    const interval = setInterval(loadNews, 90000);
    return () => clearInterval(interval);
  }, []);

  const loadNews = async () => {
    setIsLoading(true);
    try {
      // Load existing news articles from the database first
      const existingArticles = await base44.entities.NewsArticle.list('-published_date', 10);
      
      if (existingArticles && existingArticles.length > 0) {
        // Process existing articles to ensure safe rendering
        const processedArticles = existingArticles.map(article => ({
          ...article,
          title: safeText(article.title, 'No title available'),
          summary: safeText(article.summary, ''),
          content: safeText(article.content, ''),
          source: safeText(article.source, 'Unknown source'),
          sentiment: safeText(article.sentiment, 'Neutral'),
          sector: safeText(article.sector, 'General'),
          category: safeText(article.category, 'News'),
          impact_score: typeof article.impact_score === 'number' ? article.impact_score : parseInt(safeText(article.impact_score, '5')),
          tickers_mentioned: Array.isArray(article.tickers_mentioned) ? article.tickers_mentioned : [],
          key_insights: Array.isArray(article.key_insights) ? article.key_insights : [],
          is_breaking: Boolean(article.is_breaking),
          is_bookmarked: Boolean(article.is_bookmarked)
        }));
        
        setNews(processedArticles);
        setLastUpdated(new Date());
      } else {
        // Fallback to enhanced mock data if no articles in database
        const mockNews = [
          {
            id: 'mock-1',
            title: "Fed Officials Signal Cautious Approach to Rate Cuts",
            summary: "Federal Reserve officials indicated they will take a measured approach to future interest rate reductions, citing persistent inflation concerns and robust labor market conditions.",
            content: "Federal Reserve officials indicated they will take a measured approach to future interest rate reductions, citing persistent inflation concerns and robust labor market conditions. The comments came during a speech at the Economic Club, where policymakers emphasized data-driven decision making. Markets responded with mixed sentiment as investors weigh the implications for near-term monetary policy.",
            source: "Reuters",
            source_url: "#",
            published_date: new Date().toISOString(),
            sentiment: "Neutral",
            sector: "Financial Services",
            category: "Fed Policy",
            region: "US",
            impact_score: 8,
            tickers_mentioned: ["SPY", "TLT", "QQQ"],
            is_breaking: false,
            is_bookmarked: false,
            key_insights: [
              "Fed maintains data-dependent stance on future rate decisions",
              "Inflation concerns continue to influence policy outlook",
              "Labor market strength supports cautious approach"
            ]
          },
          {
            id: 'mock-2',
            title: "Tech Earnings Drive Market Sentiment as AI Investments Surge",
            summary: "Major technology companies reported strong quarterly results, with artificial intelligence investments driving revenue growth across cloud computing and enterprise software segments.",
            content: "Major technology companies reported strong quarterly results, with artificial intelligence investments driving revenue growth across cloud computing and enterprise software segments. Analysts noted particular strength in data center demand and enterprise AI adoption, leading to upgraded price targets across the sector.",
            source: "Bloomberg",
            source_url: "#",
            published_date: new Date(Date.now() - 3600000).toISOString(),
            sentiment: "Bullish",
            sector: "Technology",
            category: "Earnings",
            region: "US",
            impact_score: 7,
            tickers_mentioned: ["NVDA", "MSFT", "GOOGL", "AMZN"],
            is_breaking: false,
            is_bookmarked: false,
            key_insights: [
              "AI infrastructure spending accelerating across major tech firms",
              "Cloud revenue growth exceeded analyst expectations",
              "Enterprise AI adoption driving higher margin services"
            ]
          },
          {
            id: 'mock-3',
            title: "Energy Sector Rallies on OPEC Production Cuts",
            summary: "Oil prices surged following OPEC+ announcement of extended production cuts through Q2, supporting energy sector equities and broader commodity markets.",
            content: "Oil prices surged following OPEC+ announcement of extended production cuts through Q2, supporting energy sector equities and broader commodity markets. West Texas Intermediate crude gained over 3% in morning trading, while Brent crude reached multi-week highs.",
            source: "Financial Times",
            source_url: "#",
            published_date: new Date(Date.now() - 7200000).toISOString(),
            sentiment: "Bullish",
            sector: "Energy",
            category: "Commodities",
            region: "Global",
            impact_score: 6,
            tickers_mentioned: ["XLE", "CVX", "XOM", "SLB"],
            is_breaking: false,
            is_bookmarked: false,
            key_insights: [
              "OPEC+ extends production cuts to support oil prices",
              "Energy equities benefit from improved commodity outlook",
              "Refining margins expected to improve with crude rally"
            ]
          },
          {
            id: 'mock-4',
            title: "Dollar Strengthens as Economic Data Beats Expectations",
            summary: "The U.S. dollar index climbed to multi-week highs after stronger-than-expected economic indicators reinforced expectations for sustained Federal Reserve policy stance.",
            content: "The U.S. dollar index climbed to multi-week highs after stronger-than-expected economic indicators reinforced expectations for sustained Federal Reserve policy stance. GDP growth and employment data both exceeded consensus forecasts, supporting the greenback against major trading partners.",
            source: "Wall Street Journal",
            source_url: "#",
            published_date: new Date(Date.now() - 10800000).toISOString(),
            sentiment: "Bullish",
            sector: "Financial Services",
            category: "Macro",
            region: "US",
            impact_score: 7,
            tickers_mentioned: ["DXY", "UUP", "FXE"],
            is_breaking: false,
            is_bookmarked: false,
            key_insights: [
              "Strong economic data supports dollar strength",
              "Fed policy expectations remain elevated",
              "Emerging market currencies under pressure"
            ]
          },
          {
            id: 'mock-5',
            title: "Cryptocurrency Markets Show Renewed Institutional Interest",
            summary: "Bitcoin and major altcoins gained ground as institutional investors renewed allocation strategies, with several major pension funds announcing crypto investment programs.",
            content: "Bitcoin and major altcoins gained ground as institutional investors renewed allocation strategies, with several major pension funds announcing crypto investment programs. Regulatory clarity improvements cited as key driver for institutional adoption across digital asset classes.",
            source: "CoinDesk",
            source_url: "#",
            published_date: new Date(Date.now() - 14400000).toISOString(),
            sentiment: "Bullish",
            sector: "Technology",
            category: "Crypto",
            region: "Global",
            impact_score: 5,
            tickers_mentioned: ["BTC", "ETH", "COIN"],
            is_breaking: false,
            is_bookmarked: false,
            key_insights: [
              "Institutional crypto adoption accelerating",
              "Regulatory environment improving for digital assets",
              "Pension funds exploring cryptocurrency allocations"
            ]
          }
        ];
        
        setNews(mockNews);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Error loading news:', error);
      // Set empty array on error to prevent crashes
      setNews([]);
      setLastUpdated(new Date());
    }
    setIsLoading(false);
  };

  const handleToggleBookmark = async (article) => {
    try {
      if (article.id && !article.id.toString().startsWith('mock')) {
        // Only update real articles in database
        await base44.entities.NewsArticle.update(article.id, {
          is_bookmarked: !article.is_bookmarked
        });
      }
      
      // Update local state
      setNews(prev => prev.map(item => 
        item.id === article.id 
          ? { ...item, is_bookmarked: !item.is_bookmarked }
          : item
      ));
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48 bg-gray-700" />
          <Skeleton className="h-9 w-24 bg-gray-700" />
        </div>
        <div className="space-y-4">
          {Array(5).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full bg-gray-700" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-100">Latest Market Intelligence</h2>
          {lastUpdated && (
            <p className="text-sm text-gray-400 mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        <Button
          onClick={loadNews}
          variant="outline"
          size="sm"
          className="bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>
      
      <div className="space-y-6">
        {news.length > 0 ? (
          news.map((article) => (
            <NewsCard
              key={article.id}
              article={article}
              onToggleBookmark={handleToggleBookmark}
            />
          ))
        ) : (
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="text-center py-8">
              <p className="text-gray-400">No news articles available.</p>
              <Button onClick={loadNews} className="mt-4">
                Load News
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}