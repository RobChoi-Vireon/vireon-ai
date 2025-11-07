
import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { InvokeLLM } from '@/integrations/Core';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, 
  TrendingUp, 
  TrendingDown, 
  Crown,
  Star,
  Target,
  Flame,
  Award,
  Sparkles
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

export default function PerformanceLeaderboard() {
  const [leaderboards, setLeaderboards] = useState({
    sectors: [],
    tickers: [],
    strategies: [],
    keywords: []
  });
  const [insights, setInsights] = useState("");
  const [timeframe, setTimeframe] = useState("30D");
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);

  useEffect(() => {
    generateLeaderboardData();
  }, [timeframe]);

  const generateLeaderboardData = async () => {
    setIsLoading(true);
    try {
      // Generate simulated performance data
      await generateSignalPerformance();
      await loadLeaderboards();
      await generateLeaderboardInsights();
    } catch (error) {
      console.error("Error generating leaderboard data:", error);
    }
    setIsLoading(false);
  };

  const generateSignalPerformance = async () => {
    try {
      const existingSignals = await base44.entities.SignalPerformance.list();
      
      if (existingSignals.length === 0) {
        // Generate initial performance data
        const performanceData = [];
        
        // Sectors
        const sectors = ["Technology", "Energy", "Healthcare", "Financial Services", "Consumer", "Industrial"];
        sectors.forEach(sector => {
          performanceData.push({
            signal_type: "sector",
            signal_name: sector,
            win_rate_30d: 45 + Math.random() * 40, // 45-85%
            win_rate_90d: 40 + Math.random() * 45, // 40-85%
            win_rate_ytd: 35 + Math.random() * 50, // 35-85%
            avg_return_30d: (Math.random() - 0.3) * 8, // -2.4% to 5.6%
            avg_return_90d: (Math.random() - 0.2) * 12, // -2.4% to 9.6%
            total_signals: Math.floor(Math.random() * 50) + 10,
            last_signal_date: new Date().toISOString(),
            confidence_ranking: Math.floor(Math.random() * 40) + 60,
            is_hot_signal: Math.random() > 0.7,
            last_updated: new Date().toISOString()
          });
        });

        // Top Tickers
        const tickers = ["AAPL", "TSLA", "NVDA", "MSFT", "GOOGL", "META", "AMZN", "NFLX"];
        tickers.forEach(ticker => {
          performanceData.push({
            signal_type: "ticker",
            signal_name: ticker,
            win_rate_30d: 35 + Math.random() * 50, // 35-85%
            win_rate_90d: 30 + Math.random() * 55, // 30-85%
            win_rate_ytd: 25 + Math.random() * 60, // 25-85%
            avg_return_30d: (Math.random() - 0.4) * 10, // -4% to 6%
            avg_return_90d: (Math.random() - 0.3) * 15, // -4.5% to 10.5%
            total_signals: Math.floor(Math.random() * 30) + 5,
            last_signal_date: new Date().toISOString(),
            confidence_ranking: Math.floor(Math.random() * 35) + 65,
            is_hot_signal: Math.random() > 0.6,
            last_updated: new Date().toISOString()
          });
        });

        // Strategies
        const strategies = ["Momentum", "Macro", "Sentiment", "Earnings", "Technical"];
        strategies.forEach(strategy => {
          performanceData.push({
            signal_type: "strategy",
            signal_name: strategy,
            win_rate_30d: 40 + Math.random() * 45, // 40-85%
            win_rate_90d: 35 + Math.random() * 50, // 35-85%
            win_rate_ytd: 30 + Math.random() * 55, // 30-85%
            avg_return_30d: (Math.random() - 0.25) * 6, // -1.5% to 4.5%
            avg_return_90d: (Math.random() - 0.15) * 9, // -1.35% to 7.65%
            total_signals: Math.floor(Math.random() * 80) + 20,
            last_signal_date: new Date().toISOString(),
            confidence_ranking: Math.floor(Math.random() * 30) + 70,
            is_hot_signal: Math.random() > 0.8,
            last_updated: new Date().toISOString()
          });
        });

        // Keywords
        const keywords = ["Powell", "Fed", "CPI", "inflation", "China", "AI", "earnings", "recession"];
        keywords.forEach(keyword => {
          performanceData.push({
            signal_type: "keyword",
            signal_name: keyword,
            win_rate_30d: 25 + Math.random() * 60, // 25-85%
            win_rate_90d: 20 + Math.random() * 65, // 20-85%
            win_rate_ytd: 15 + Math.random() * 70, // 15-85%
            avg_return_30d: (Math.random() - 0.5) * 8, // -4% to 4%
            avg_return_90d: (Math.random() - 0.4) * 12, // -4.8% to 7.2%
            total_signals: Math.floor(Math.random() * 40) + 8,
            last_signal_date: new Date().toISOString(),
            confidence_ranking: Math.floor(Math.random() * 50) + 50,
            is_hot_signal: Math.random() > 0.75,
            last_updated: new Date().toISOString()
          });
        });

        await base44.entities.SignalPerformance.bulkCreate(performanceData);
      }
    } catch (error) {
      console.error("Error generating signal performance:", error);
    }
  };

  const loadLeaderboards = async () => {
    try {
      const allSignals = await base44.entities.SignalPerformance.list();
      
      const winRateKey = timeframe === "30D" ? "win_rate_30d" : 
                        timeframe === "90D" ? "win_rate_90d" : "win_rate_ytd";
      const returnKey = timeframe === "30D" ? "avg_return_30d" : 
                       timeframe === "90D" ? "avg_return_90d" : "avg_return_ytd"; // Changed to avg_return_ytd for consistency in YTD

      const sectors = allSignals
        .filter(s => s.signal_type === "sector")
        .sort((a, b) => (b[winRateKey] || 0) - (a[winRateKey] || 0))
        .slice(0, 10);

      const tickers = allSignals
        .filter(s => s.signal_type === "ticker")
        .sort((a, b) => (b[returnKey] || 0) - (a[returnKey] || 0))
        .slice(0, 10);

      const strategies = allSignals
        .filter(s => s.signal_type === "strategy")
        .sort((a, b) => (b[winRateKey] || 0) - (a[winRateKey] || 0))
        .slice(0, 5);

      const keywords = allSignals
        .filter(s => s.signal_type === "keyword")
        .sort((a, b) => (b[winRateKey] || 0) - (a[winRateKey] || 0))
        .slice(0, 8);

      setLeaderboards({ sectors, tickers, strategies, keywords });
    } catch (error) {
      console.error("Error loading leaderboards:", error);
    }
  };

  const generateLeaderboardInsights = async () => {
    setIsGeneratingInsights(true);
    try {
      // Ensure leaderboards are populated before generating insights
      const currentLeaderboards = leaderboards.sectors.length > 0 ? leaderboards : await base44.entities.SignalPerformance.list().then(allSignals => {
          const winRateKey = timeframe === "30D" ? "win_rate_30d" : 
                            timeframe === "90D" ? "win_rate_90d" : "win_rate_ytd";
          const returnKey = timeframe === "30D" ? "avg_return_30d" : 
                           timeframe === "90D" ? "avg_return_90d" : "avg_return_ytd";

          return {
              sectors: allSignals.filter(s => s.signal_type === "sector").sort((a, b) => (b[winRateKey] || 0) - (a[winRateKey] || 0)).slice(0, 10),
              tickers: allSignals.filter(s => s.signal_type === "ticker").sort((a, b) => (b[returnKey] || 0) - (a[returnKey] || 0)).slice(0, 10),
              strategies: allSignals.filter(s => s.signal_type === "strategy").sort((a, b) => (b[winRateKey] || 0) - (a[winRateKey] || 0)).slice(0, 5),
              keywords: allSignals.filter(s => s.signal_type === "keyword").sort((a, b) => (b[winRateKey] || 0) - (a[winRateKey] || 0)).slice(0, 8),
          };
      });


      const topSector = currentLeaderboards.sectors[0];
      const topStrategy = currentLeaderboards.strategies[0];
      const topTicker = currentLeaderboards.tickers[0];

      const prompt = `Analyze the following top-performing signals for the ${timeframe} period and provide 2-3 tactical insights for institutional traders:

      Top Sector: ${topSector?.signal_name} (${topSector?.[`win_rate_${timeframe.toLowerCase()}`]?.toFixed(1)}% win rate)
      Top Strategy: ${topStrategy?.signal_name} (${topStrategy?.[`win_rate_${timeframe.toLowerCase()}`]?.toFixed(1)}% win rate)  
      Top Ticker: ${topTicker?.signal_name} (${topTicker?.[`avg_return_${timeframe.toLowerCase()}`]?.toFixed(1)}% avg return)

      Provide insights about:
      - What's driving outperformance in these areas
      - Market regime implications
      - Actionable strategy recommendations

      Keep each insight under 50 words and professional.`;

      const response = await InvokeLLM({ prompt });
      
      let insightsText = "";
      if (typeof response === 'string') {
        insightsText = response;
      } else if (typeof response === 'object' && response !== null) {
        const potentialInsights = response.insights || response.analysis || response.summary || response.answer;
        if (typeof potentialInsights === 'string') {
          insightsText = potentialInsights;
        } else if (Array.isArray(potentialInsights)) {
          insightsText = potentialInsights.join('\n\n');
        } else {
          insightsText = "Performance analysis is processing...";
        }
      }
      
      setInsights(insightsText);
    } catch (error) {
      console.error("Error generating insights:", error);
      setInsights("Unable to generate leaderboard insights at this time.");
    }
    setIsGeneratingInsights(false);
  };

  const getRankIcon = (index) => {
    if (index === 0) return <Crown className="w-5 h-5 text-yellow-400" />;
    if (index === 1) return <Award className="w-5 h-5 text-gray-300" />;
    if (index === 2) return <Star className="w-5 h-5 text-amber-500" />;
    return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-400">#{index + 1}</span>;
  };

  const getPerformanceColor = (value, isReturn = false) => {
    if (isReturn) {
      return value >= 2 ? "text-green-400" : value >= 0 ? "text-green-500" : "text-red-400";
    }
    return value >= 70 ? "text-green-400" : value >= 50 ? "text-yellow-400" : "text-red-400";
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64 bg-gray-700" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-80 bg-gray-700" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-100 mb-2">Performance Leaderboard</h2>
          <p className="text-gray-300">Top performing signals and strategies</p>
        </div>
        
        <div className="flex gap-2">
          {["30D", "90D", "YTD"].map(tf => (
            <Button
              key={tf}
              variant={timeframe === tf ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeframe(tf)}
              className={timeframe === tf ? 'bg-blue-600 text-white' : 'bg-gray-700 border-gray-600 text-gray-300'}
            >
              {tf}
            </Button>
          ))}
        </div>
      </div>

      {/* Performance Insights */}
      <Card className="border-purple-700 bg-purple-900/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-purple-400 mt-0.5" />
            <div>
              <h3 className="font-semibold text-purple-300 mb-2">Leaderboard Insights</h3>
              {isGeneratingInsights ? (
                <div className="animate-pulse">
                  <div className="h-4 bg-purple-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-purple-700 rounded w-1/2"></div>
                </div>
              ) : (
                <p className="text-purple-200 leading-relaxed text-sm whitespace-pre-line">
                  {insights}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="sectors" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800 border-gray-700 p-1 rounded-xl shadow-sm">
          <TabsTrigger value="sectors" className="data-[state=active]:bg-blue-900/40 data-[state=active]:text-blue-300 text-gray-300 font-semibold rounded-lg py-2">Top Sectors</TabsTrigger>
          <TabsTrigger value="tickers" className="data-[state=active]:bg-blue-900/40 data-[state=active]:text-blue-300 text-gray-300 font-semibold rounded-lg py-2">Top Tickers</TabsTrigger>
          <TabsTrigger value="strategies" className="data-[state=active]:bg-blue-900/40 data-[state=active]:text-blue-300 text-gray-300 font-semibold rounded-lg py-2">Top Strategies</TabsTrigger>
          <TabsTrigger value="keywords" className="data-[state=active]:bg-blue-900/40 data-[state=active]:text-blue-300 text-gray-300 font-semibold rounded-lg py-2">Top Keywords</TabsTrigger>
        </TabsList>

        <TabsContent value="sectors">
          <Card className="bg-gray-800 border-gray-700/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-100">
                <Trophy className="w-5 h-5 text-yellow-400" />
                Sector Performance Rankings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboards.sectors.map((sector, index) => (
                  <div key={sector.signal_name} className="flex items-center justify-between p-4 border border-gray-700 bg-gray-900/50 rounded-lg hover:bg-gray-700/50 transition-colors">
                    <div className="flex items-center gap-4">
                      {getRankIcon(index)}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-200">{sector.signal_name}</span>
                          {sector.is_hot_signal && (
                            <Badge className="bg-orange-900/40 text-orange-300 text-xs border-orange-500/50">
                              <Flame className="w-3 h-3 mr-1" />
                              Hot
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-400">
                          {sector.total_signals} signals • Last: {formatDistanceToNow(new Date(sector.last_signal_date), { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-sm text-gray-400">Win Rate</div>
                        <div className={`font-bold ${getPerformanceColor(sector[`win_rate_${timeframe.toLowerCase()}`])}`}>
                          {sector[`win_rate_${timeframe.toLowerCase()}`]?.toFixed(1)}%
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-sm text-gray-400">Avg Return</div>
                        <div className={`font-bold ${getPerformanceColor(sector[`avg_return_${timeframe.toLowerCase()}`] || sector.avg_return_30d, true)}`}>
                          {(sector[`avg_return_${timeframe.toLowerCase()}`] || sector.avg_return_30d)?.toFixed(1)}%
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="text-sm text-gray-400">Confidence</div>
                        <div className="font-bold text-blue-400">
                          {sector.confidence_ranking}/100
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tickers">
          <Card className="bg-gray-800 border-gray-700/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-100">
                <Target className="w-5 h-5 text-green-400" />
                Ticker Performance Rankings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboards.tickers.map((ticker, index) => (
                  <div key={ticker.signal_name} className="flex items-center justify-between p-4 border border-gray-700 bg-gray-900/50 rounded-lg hover:bg-gray-700/50 transition-colors">
                    <div className="flex items-center gap-4">
                      {getRankIcon(index)}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-lg text-gray-200">${ticker.signal_name}</span>
                          {ticker.is_hot_signal && (
                            <Badge className="bg-orange-900/40 text-orange-300 text-xs border-orange-500/50">
                              <Flame className="w-3 h-3 mr-1" />
                              Hot
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-400">
                          {ticker.total_signals} signals • Last: {formatDistanceToNow(new Date(ticker.last_signal_date), { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-sm text-gray-400">Win Rate</div>
                        <div className={`font-bold ${getPerformanceColor(ticker[`win_rate_${timeframe.toLowerCase()}`])}`}>
                          {ticker[`win_rate_${timeframe.toLowerCase()}`]?.toFixed(1)}%
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-sm text-gray-400">Avg Return</div>
                        <div className={`font-bold ${getPerformanceColor(ticker[`avg_return_${timeframe.toLowerCase()}`] || ticker.avg_return_30d, true)}`}>
                          {(ticker[`avg_return_${timeframe.toLowerCase()}`] || ticker.avg_return_30d)?.toFixed(1)}%
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="text-sm text-gray-400">Signals</div>
                        <div className="font-bold text-gray-200">
                          {ticker.total_signals}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strategies">
          <Card className="bg-gray-800 border-gray-700/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-100">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                Strategy Performance Rankings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboards.strategies.map((strategy, index) => (
                  <div key={strategy.signal_name} className="flex items-center justify-between p-4 border border-gray-700 bg-gray-900/50 rounded-lg hover:bg-gray-700/50 transition-colors">
                    <div className="flex items-center gap-4">
                      {getRankIcon(index)}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-lg text-gray-200">{strategy.signal_name}</span>
                          {strategy.is_hot_signal && (
                            <Badge className="bg-orange-900/40 text-orange-300 text-xs border-orange-500/50">
                              <Flame className="w-3 h-3 mr-1" />
                              Hot
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-400">
                          {strategy.total_signals} total signals generated
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-sm text-gray-400">Win Rate</div>
                        <div className={`font-bold text-xl ${getPerformanceColor(strategy[`win_rate_${timeframe.toLowerCase()}`])}`}>
                          {strategy[`win_rate_${timeframe.toLowerCase()}`]?.toFixed(1)}%
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-sm text-gray-400">Avg Return</div>
                        <div className={`font-bold text-xl ${getPerformanceColor(strategy[`avg_return_${timeframe.toLowerCase()}`] || strategy.avg_return_30d, true)}`}>
                          {(strategy[`avg_return_${timeframe.toLowerCase()}`] || strategy.avg_return_30d)?.toFixed(1)}%
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="text-sm text-gray-400">Confidence</div>
                        <div className="font-bold text-blue-400 text-xl">
                          {strategy.confidence_ranking}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="keywords">
          <Card className="bg-gray-800 border-gray-700/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-100">
                <Sparkles className="w-5 h-5 text-purple-400" />
                Keyword Performance Rankings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboards.keywords.map((keyword, index) => (
                  <div key={keyword.signal_name} className="flex items-center justify-between p-4 border border-gray-700 bg-gray-900/50 rounded-lg hover:bg-gray-700/50 transition-colors">
                    <div className="flex items-center gap-4">
                      {getRankIcon(index)}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold bg-gray-700/50 text-gray-200 px-2 py-1 rounded text-sm">
                            "{keyword.signal_name}"
                          </span>
                          {keyword.is_hot_signal && (
                            <Badge className="bg-orange-900/40 text-orange-300 text-xs border-orange-500/50">
                              <Flame className="w-3 h-3 mr-1" />
                              Trending
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-400">
                          {keyword.total_signals} signals • Smart tracker keyword
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-sm text-gray-400">Win Rate</div>
                        <div className={`font-bold ${getPerformanceColor(keyword[`win_rate_${timeframe.toLowerCase()}`])}`}>
                          {keyword[`win_rate_${timeframe.toLowerCase()}`]?.toFixed(1)}%
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-sm text-gray-400">Avg Impact</div>
                        <div className={`font-bold ${getPerformanceColor(keyword[`avg_return_${timeframe.toLowerCase()}`] || keyword.avg_return_30d, true)}`}>
                          {Math.abs(keyword[`avg_return_${timeframe.toLowerCase()}`] || keyword.avg_return_30d)?.toFixed(1)}%
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="text-sm text-gray-400">Signals</div>
                        <div className="font-bold text-gray-200">
                          {keyword.total_signals}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
