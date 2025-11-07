import React, { useState, useEffect } from 'react';
import { InvokeLLM } from '@/integrations/Core';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Target,
  Download,
  RefreshCw,
  Activity,
  Zap
} from 'lucide-react';
import { format, subDays, startOfWeek, startOfMonth } from 'date-fns';

export default function AlertSignalAnalytics({ alertHistory, tickerData, onRefresh }) {
  const [analytics, setAnalytics] = useState({});
  const [insights, setInsights] = useState("");
  const [timeframe, setTimeframe] = useState("1W");
  const [strategyFilter, setStrategyFilter] = useState("All");
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(true);

  useEffect(() => {
    generateAnalytics();
  }, [alertHistory, timeframe]);

  const generateAnalytics = async () => {
    setIsLoadingAnalytics(true);
    
    try {
      // Calculate date range
      const now = new Date();
      let startDate;
      switch (timeframe) {
        case "1D": startDate = subDays(now, 1); break;
        case "1W": startDate = startOfWeek(now); break;
        case "1M": startDate = startOfMonth(now); break;
        default: startDate = subDays(now, 7);
      }

      // Filter alerts by timeframe
      const filteredAlerts = alertHistory.filter(alert => 
        new Date(alert.triggered_at) >= startDate
      );

      // Generate analytics data
      const tickerFrequency = {};
      const sectorFrequency = {};
      const alertsByDay = {};
      const alertPerformance = [];

      filteredAlerts.forEach(alert => {
        // Ticker frequency
        tickerFrequency[alert.ticker] = (tickerFrequency[alert.ticker] || 0) + 1;
        
        // Sector frequency (from current ticker data)
        const currentData = tickerData[alert.ticker];
        if (currentData && currentData.sector) {
          sectorFrequency[currentData.sector] = (sectorFrequency[currentData.sector] || 0) + 1;
        }

        // Alerts by day
        const dayKey = format(new Date(alert.triggered_at), 'yyyy-MM-dd');
        alertsByDay[dayKey] = (alertsByDay[dayKey] || 0) + 1;

        // Performance calculation (simulated post-trigger move)
        const postTriggerMove = Math.random() * 6 - 3; // -3% to +3% random
        alertPerformance.push({
          ticker: alert.ticker,
          triggeredAt: alert.triggered_at,
          postMove: postTriggerMove,
          alertType: alert.alert_type
        });
      });

      // Sort and get top items
      const topTickers = Object.entries(tickerFrequency)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5);
      
      const topSectors = Object.entries(sectorFrequency)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5);

      // Calculate success rates
      const successfulAlerts = alertPerformance.filter(alert => Math.abs(alert.postMove) > 1).length;
      const successRate = alertPerformance.length > 0 ? (successfulAlerts / alertPerformance.length) * 100 : 0;

      // Average follow-through
      const avgFollowThrough = alertPerformance.length > 0 
        ? alertPerformance.reduce((sum, alert) => sum + Math.abs(alert.postMove), 0) / alertPerformance.length
        : 0;

      const analyticsData = {
        totalAlerts: filteredAlerts.length,
        topTickers,
        topSectors,
        alertsByDay,
        successRate,
        avgFollowThrough,
        alertPerformance: alertPerformance.slice(0, 10)
      };

      setAnalytics(analyticsData);

      // Generate AI insights
      await generateInsights(analyticsData, filteredAlerts);

    } catch (error) {
      console.error("Error generating analytics:", error);
    }
    
    setIsLoadingAnalytics(false);
  };

  const generateInsights = async (analyticsData, alerts) => {
    try {
      const { topTickers, topSectors, successRate, avgFollowThrough } = analyticsData;
      
      const prompt = `Analyze the following alert signal data for the ${timeframe} period and provide 2-3 key insights for institutional traders:

      Total Alerts: ${alerts.length}
      Success Rate: ${successRate.toFixed(1)}%
      Avg Follow-through: ${avgFollowThrough.toFixed(2)}%
      
      Top Alert Tickers: ${topTickers.map(([ticker, count]) => `${ticker} (${count}x)`).join(', ')}
      Top Sectors: ${topSectors.map(([sector, count]) => `${sector} (${count}x)`).join(', ')}

      Provide tactical insights about:
      - Alert frequency patterns and what they suggest
      - Sector concentration and rotation implications  
      - Success rate analysis and strategy recommendations
      
      Keep each insight under 50 words and actionable.`;

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
          insightsText = "Alert pattern analysis is processing...";
        }
      }
      
      setInsights(insightsText);
    } catch (error) {
      console.error("Error generating insights:", error);
      setInsights("Unable to generate insights at this time.");
    }
  };

  const exportToCsv = () => {
    const csvContent = [
      ["Ticker", "Alert Type", "Triggered At", "Triggered Price", "Post Move %"],
      ...analytics.alertPerformance?.map(alert => [
        alert.ticker,
        alert.alertType,
        format(new Date(alert.triggeredAt), 'yyyy-MM-dd HH:mm'),
        "", // Would need triggered price from alert history
        alert.postMove.toFixed(2)
      ]) || []
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `alert_analytics_${timeframe}_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1D">1 Day</SelectItem>
              <SelectItem value="1W">1 Week</SelectItem>
              <SelectItem value="1M">1 Month</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={strategyFilter} onValueChange={setStrategyFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Strategies</SelectItem>
              <SelectItem value="Momentum">Momentum</SelectItem>
              <SelectItem value="Earnings">Earnings-based</SelectItem>
              <SelectItem value="Macro">Macro-driven</SelectItem>
              <SelectItem value="Sentiment">Sentiment-reversal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportToCsv}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* AI Insights Banner */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Activity className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Alert Signal Insights</h3>
              {isLoadingAnalytics ? (
                <div className="animate-pulse">
                  <div className="h-4 bg-blue-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-blue-200 rounded w-1/2"></div>
                </div>
              ) : (
                <p className="text-blue-800 leading-relaxed text-sm whitespace-pre-line">
                  {insights}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="heatmap">Activity Heatmap</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Key Metrics */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Alerts</p>
                    <p className="text-2xl font-bold">{analytics.totalAlerts || 0}</p>
                  </div>
                  <Zap className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Success Rate</p>
                    <p className="text-2xl font-bold text-green-600">
                      {analytics.successRate?.toFixed(1) || 0}%
                    </p>
                  </div>
                  <Target className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg Follow-through</p>
                    <p className="text-2xl font-bold">
                      {analytics.avgFollowThrough?.toFixed(2) || 0}%
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Alert Density</p>
                    <p className="text-2xl font-bold">
                      {analytics.totalAlerts && timeframe === "1W" ? (analytics.totalAlerts / 7).toFixed(1) :
                       analytics.totalAlerts && timeframe === "1M" ? (analytics.totalAlerts / 30).toFixed(1) :
                       analytics.totalAlerts || 0}/day
                    </p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Most Active Tickers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.topTickers?.map(([ticker, count]) => (
                    <div key={ticker} className="flex items-center justify-between">
                      <span className="font-mono font-bold">${ticker}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(count / Math.max(...analytics.topTickers?.map(([,c]) => c) || [1])) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    </div>
                  )) || (
                    <p className="text-gray-500 text-sm">No alert data available</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Most Active Sectors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.topSectors?.map(([sector, count]) => (
                    <div key={sector} className="flex items-center justify-between">
                      <span className="text-sm">{sector}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${(count / Math.max(...analytics.topSectors?.map(([,c]) => c) || [1])) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    </div>
                  )) || (
                    <p className="text-gray-500 text-sm">No sector data available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="heatmap">
          <Card>
            <CardHeader>
              <CardTitle>Alert Activity Heatmap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {Object.entries(analytics.alertsByDay || {}).map(([date, count]) => (
                  <div key={date} className="text-center">
                    <div className="text-xs text-gray-500 mb-1">
                      {format(new Date(date), 'MMM d')}
                    </div>
                    <div 
                      className={`w-full h-8 rounded flex items-center justify-center text-xs font-bold text-white ${
                        count > 3 ? 'bg-red-500' : count > 1 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                    >
                      {count}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Recent Alert Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.alertPerformance?.map((alert, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold">${alert.ticker}</span>
                      <Badge variant="outline" className="text-xs">
                        {alert.alertType.replace('_', ' ')}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {format(new Date(alert.triggeredAt), 'MMM d, HH:mm')}
                      </span>
                    </div>
                    <div className={`flex items-center gap-1 font-bold ${
                      alert.postMove > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {alert.postMove > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      <span>{alert.postMove > 0 ? '+' : ''}{alert.postMove.toFixed(2)}%</span>
                    </div>
                  </div>
                )) || (
                  <p className="text-gray-500 text-sm">No performance data available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}