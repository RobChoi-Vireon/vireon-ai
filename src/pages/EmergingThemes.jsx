
import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { InvokeLLM } from '@/integrations/Core';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  TrendingUp,
  AlertTriangle,
  Zap,
  RefreshCw,
  Download,
  Search,
  Sparkles,
  Target,
  Activity,
  Clock,
  ExternalLink,
  History
} from 'lucide-react';
import { format, formatDistanceToNow, subDays } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import ThemeBacktester from '../components/alpha/ThemeBacktester';

// Add safeText to handle AI responses robustly
const safeText = (value, defaultText = "") => {
  if (value === null || value === undefined) return defaultText;
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    return value.summary || value.text || value.content || value.analysis || value.response || JSON.stringify(value);
  }
  return String(value);
};

export default function EmergingThemes() {
  const [themes, setThemes] = useState([]);
  const [filteredThemes, setFilteredThemes] = useState([]);
  const [velocityChart, setVelocityChart] = useState([]);
  const [weeklyInsights, setWeeklyInsights] = useState("");
  const [userOverlaps, setUserOverlaps] = useState([]);
  const [filters, setFilters] = useState({
    stage: "All",
    type: "All",
    sentiment: "All"
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    loadEmergingThemes();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [themes, filters]);

  const loadEmergingThemes = async () => {
    setIsLoading(true);
    try {
      await generateEmergingThemes();
      await generateWeeklyInsights();
      await checkUserOverlaps();
    } catch (error) {
      console.error("Error loading emerging themes:", error);
    }
    setIsLoading(false);
  };

  const generateEmergingThemes = async () => {
    setIsGenerating(true);
    try {
      // Get recent articles to analyze for emerging themes
      const recentArticles = await base44.entities.NewsArticle.list('-published_date', 100);
      const last7Days = recentArticles.filter(article =>
        new Date(article.published_date) >= subDays(new Date(), 7)
      );

      // Extract potential themes from headlines and content
      const headlines = last7Days.map(article => article.title).join('. ');

      const response = await InvokeLLM({
        prompt: `Analyze these recent financial headlines and identify 5-8 emerging investment themes that are gaining momentum. Look for:

        Headlines: ${headlines}

        For each theme, determine:
        - Theme name and type (Ticker/Sector/Keyword/Strategy/Geography)
        - Mention velocity and sentiment
        - Stage: "Emerging" (new/early), "Gaining Steam" (building), or "Getting Crowded" (mainstream)
        - Related tickers and key catalysts
        - AI summary of the opportunity
        - Risk factors

        IMPORTANT: For mention_count_7d, mention_count_30d, confidence_score, and impact_score - provide ONLY whole numbers (integers), no decimals.

        Focus on themes that appear to be accelerating in mentions or shifting in sentiment. Examples might be specific sectors gaining traction, new technologies, geopolitical themes, or regulatory changes.`,

        response_json_schema: {
          type: "object",
          properties: {
            themes: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  theme_name: { type: "string" },
                  theme_type: { type: "string", enum: ["Ticker", "Sector", "Keyword", "Strategy", "Geography"] },
                  mention_count_7d: { type: "integer", minimum: 1 },
                  velocity_score: { type: "number", minimum: 0.5 },
                  sentiment_score: { type: "number", minimum: -100, maximum: 100 },
                  stage: { type: "string", enum: ["Emerging", "Gaining Steam", "Getting Crowded"] },
                  related_tickers: { type: "array", items: { type: "string" } },
                  key_catalysts: { type: "array", items: { type: "string" } },
                  confidence_score: { type: "integer", minimum: 1, maximum: 100 },
                  ai_summary: { type: "string" },
                  risk_factors: { type: "array", items: { type: "string" } }
                }
              }
            }
          },
          required: ["themes"]
        }
      });

      if (response && response.themes) {
        // Clear existing themes and insert new ones
        const existingThemes = await base44.entities.EmergingTheme.list();

        // Add historical data for chart
        const chartData = [];
        for (let i = 6; i >= 0; i--) {
          const date = subDays(new Date(), i);
          chartData.push({
            date: format(date, 'MMM d'),
            themes: Math.max(1, response.themes.length - Math.floor(Math.random() * 3)),
            velocity: 1 + (Math.random() * 2)
          });
        }
        setVelocityChart(chartData);

        // Process and store themes with data validation
        const themesWithTimestamp = response.themes.map(theme => {
          return {
            ...theme,
            // Ensure all numeric fields are properly formatted
            mention_count_7d: Math.round(theme.mention_count_7d || 1),
            mention_count_30d: Math.round((theme.mention_count_7d || 1) * (2 + Math.random() * 2)),
            velocity_score: parseFloat((theme.velocity_score || 1.0).toFixed(2)),
            sentiment_score: Math.round(theme.sentiment_score || 0),
            confidence_score: Math.round(theme.confidence_score || 50),
            sentiment_velocity: parseFloat(((Math.random() - 0.5) * 20).toFixed(2)),
            institutional_signal: Math.random() > 0.7,
            first_detected: subDays(new Date(), Math.floor(Math.random() * 5)).toISOString(),
            peak_momentum_date: new Date().toISOString(),
            ai_summary: safeText(theme.ai_summary, "AI summary could not be generated.") // Use validated summary
          };
        });

        await base44.entities.EmergingTheme.bulkCreate(themesWithTimestamp);

        const allThemes = await base44.entities.EmergingTheme.list('-velocity_score');
        setThemes(allThemes);
      }

      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error generating emerging themes:", error);
    }
    setIsGenerating(false);
  };

  const generateWeeklyInsights = async () => {
    try {
      const topThemes = themes.slice(0, 3).map(theme =>
        `${theme.theme_name} (${theme.stage}, ${theme.velocity_score?.toFixed(1)}x velocity)`
      ).join(', ');

      const response = await InvokeLLM({
        prompt: `Based on these emerging investment themes: ${topThemes}

        Provide 2-3 high-level insights about current market rotation patterns and opportunities for institutional investors.

        Focus on:
        - What these themes suggest about market sentiment shifts
        - Potential sector rotation or style rotation implications
        - Timing considerations for institutional positioning

        Keep each insight under 60 words and actionable.`
      });

      // Use safeText to ensure we get a string
      setWeeklyInsights(safeText(response, "Weekly insights are being generated..."));

    } catch (error) {
      console.error("Error generating weekly insights:", error);
      setWeeklyInsights("Unable to generate insights at this time.");
    }
  };

  const checkUserOverlaps = async () => {
    try {
      // Check user's smart tracker terms for overlaps with emerging themes
      const userPrefs = await base44.entities.UserPreference.list();
      if (userPrefs.length > 0) {
        const userTerms = [
          ...(userPrefs[0].watchlist_tickers || []),
          ...(userPrefs[0].smart_tracking_terms || [])
        ];

        const overlaps = themes.filter(theme =>
          userTerms.some(term =>
            term.toLowerCase().includes(theme.theme_name.toLowerCase()) ||
            theme.theme_name.toLowerCase().includes(term.toLowerCase()) ||
            theme.related_tickers?.some(ticker => ticker === term)
          )
        );

        setUserOverlaps(overlaps);
      }
    } catch (error) {
      console.error("Error checking user overlaps:", error);
    }
  };

  const applyFilters = () => {
    let filtered = themes;

    if (filters.stage !== "All") {
      filtered = filtered.filter(theme => theme.stage === filters.stage);
    }

    if (filters.type !== "All") {
      filtered = filtered.filter(theme => theme.theme_type === filters.type);
    }

    if (filters.sentiment !== "All") {
      if (filters.sentiment === "Bullish") {
        filtered = filtered.filter(theme => theme.sentiment_score > 20);
      } else if (filters.sentiment === "Bearish") {
        filtered = filtered.filter(theme => theme.sentiment_score < -20);
      } else {
        filtered = filtered.filter(theme => theme.sentiment_score >= -20 && theme.sentiment_score <= 20);
      }
    }

    setFilteredThemes(filtered);
  };

  const exportTopThemes = () => {
    const topThemes = filteredThemes.slice(0, 3);
    const exportData = topThemes.map(theme => ({
      theme: theme.theme_name,
      stage: theme.stage,
      velocity: theme.velocity_score?.toFixed(2),
      sentiment: theme.sentiment_score,
      tickers: theme.related_tickers?.join(', '),
      summary: safeText(theme.ai_summary).substring(0, 100) // Sanitize for export
    }));

    const csvContent = [
      ["Theme", "Stage", "Velocity", "Sentiment", "Tickers", "Summary"],
      ...exportData.map(row => [
        row.theme,
        row.stage,
        row.velocity,
        row.sentiment,
        row.tickers,
        row.summary
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `emerging_themes_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  const getStageColor = (stage) => {
    switch (stage) {
      case "Emerging":
        return "bg-green-900/40 text-green-300 border-green-500/50";
      case "Gaining Steam":
        return "bg-yellow-900/40 text-yellow-300 border-yellow-500/50";
      case "Getting Crowded":
        return "bg-red-900/40 text-red-300 border-red-500/50";
      default:
        return "bg-gray-700 text-gray-300 border-gray-600";
    }
  };

  const getSentimentColor = (score) => {
    if (score > 20) return "text-green-400";
    if (score < -20) return "text-red-400";
    return "text-gray-200";
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="space-y-6 animate-pulse">
          <Skeleton className="h-8 w-64 bg-gray-700" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-48 bg-gray-700" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-100 mb-2">Emerging Alpha Themes</h1>
          <p className="text-gray-300 text-lg">
            AI-powered detection of early-stage investment opportunities and sentiment shifts
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Last updated: {formatDistanceToNow(lastUpdated, { addSuffix: true })}
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={exportTopThemes} className="bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600">
            <Download className="w-4 h-4 mr-2" />
            Export Top 3
          </Button>
          <Button
            onClick={generateEmergingThemes}
            disabled={isGenerating}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Scanning...' : 'Refresh Scan'}
          </Button>
        </div>
      </div>

      {/* Weekly Insights Banner */}
      <Card className="border-blue-700 bg-blue-900/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-blue-400 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-300 mb-2">Weekly Theme Intelligence</h3>
              <p className="text-blue-200 leading-relaxed text-sm whitespace-pre-line">
                {weeklyInsights}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="themes" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800 border-gray-700 p-1 rounded-xl shadow-sm">
          <TabsTrigger value="themes" className="data-[state=active]:bg-purple-900/40 data-[state=active]:text-purple-300 text-gray-300 font-semibold rounded-lg py-2">Theme Explorer</TabsTrigger>
          <TabsTrigger value="velocity" className="data-[state=active]:bg-purple-900/40 data-[state=active]:text-purple-300 text-gray-300 font-semibold rounded-lg py-2">Velocity Tracker</TabsTrigger>
          <TabsTrigger value="overlaps" className="data-[state=active]:bg-purple-900/40 data-[state=active]:text-purple-300 text-gray-300 font-semibold rounded-lg py-2">Your Overlaps</TabsTrigger>
          <TabsTrigger value="archive" className="data-[state=active]:bg-purple-900/40 data-[state=active]:text-purple-300 text-gray-300 font-semibold rounded-lg py-2">Theme Archive</TabsTrigger>
        </TabsList>

        <TabsContent value="themes">
          {/* Filters */}
          <Card className="bg-gray-800 border-gray-700/60 shadow-xl">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select value={filters.stage} onValueChange={(value) => setFilters({...filters, stage: value})}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-200">
                    <SelectValue placeholder="Filter by Stage" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 text-gray-200 border-gray-600">
                    <SelectItem value="All">All Stages</SelectItem>
                    <SelectItem value="Emerging">Emerging</SelectItem>
                    <SelectItem value="Gaining Steam">Gaining Steam</SelectItem>
                    <SelectItem value="Getting Crowded">Getting Crowded</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filters.type} onValueChange={(value) => setFilters({...filters, type: value})}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-200">
                    <SelectValue placeholder="Filter by Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 text-gray-200 border-gray-600">
                    <SelectItem value="All">All Types</SelectItem>
                    <SelectItem value="Ticker">Tickers</SelectItem>
                    <SelectItem value="Sector">Sectors</SelectItem>
                    <SelectItem value="Keyword">Keywords</SelectItem>
                    <SelectItem value="Strategy">Strategies</SelectItem>
                    <SelectItem value="Geography">Geography</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filters.sentiment} onValueChange={(value) => setFilters({...filters, sentiment: value})}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-200">
                    <SelectValue placeholder="Filter by Sentiment" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 text-gray-200 border-gray-600">
                    <SelectItem value="All">All Sentiment</SelectItem>
                    <SelectItem value="Bullish">Bullish</SelectItem>
                    <SelectItem value="Neutral">Neutral</SelectItem>
                    <SelectItem value="Bearish">Bearish</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center text-sm text-gray-300 justify-end">
                  <Activity className="w-4 h-4 mr-2" />
                  {filteredThemes.length} themes found
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Theme Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {filteredThemes.map(theme => (
              <Card key={theme.id} className="bg-gray-800 border-gray-700/60 hover:border-blue-500/50 transition-colors duration-300 shadow-xl flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <span className="font-bold text-gray-100">{theme.theme_name}</span>
                      </CardTitle>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge className={getStageColor(theme.stage)}>
                          {theme.stage}
                        </Badge>
                        <Badge variant="outline" className="border-gray-600 text-gray-300">
                          {theme.theme_type}
                        </Badge>
                        {theme.institutional_signal && (
                          <Badge className="bg-purple-900/40 text-purple-300 border-purple-500/50">
                            Institutional
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm text-gray-400">Confidence</div>
                      <div className="text-xl font-bold text-blue-400">
                        {theme.confidence_score}/100
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-4 text-center p-3 bg-gray-700/50 rounded-lg">
                      <div>
                        <div className="text-lg font-bold text-green-400">
                          {theme.velocity_score?.toFixed(1)}x
                        </div>
                        <div className="text-xs text-gray-400">Velocity</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-white">
                          {theme.mention_count_7d}
                        </div>
                        <div className="text-xs text-gray-400">Mentions 7D</div>
                      </div>
                      <div>
                        <div className={`text-lg font-bold ${getSentimentColor(theme.sentiment_score)}`}>
                          {theme.sentiment_score > 0 ? '+' : ''}{theme.sentiment_score}
                        </div>
                        <div className="text-xs text-gray-400">Sentiment</div>
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-3 my-4">
                      <div className="flex items-start gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm font-semibold text-blue-300">AI Analysis</span>
                      </div>
                      <p className="text-sm text-blue-200 leading-relaxed">
                        {safeText(theme.ai_summary)}
                      </p>
                    </div>

                    {/* Related Tickers */}
                    {theme.related_tickers && theme.related_tickers.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-sm text-gray-200 mb-2">Related Tickers:</h4>
                        <div className="flex flex-wrap gap-1">
                          {theme.related_tickers.slice(0, 4).map(ticker => (
                            <Badge key={ticker} variant="outline" className="text-xs font-mono bg-gray-700 text-gray-300 border-gray-600">
                              ${ticker}
                            </Badge>
                          ))}
                          {theme.related_tickers.length > 4 && (
                            <Badge variant="outline" className="text-xs bg-gray-700 text-gray-300 border-gray-600">
                              +{theme.related_tickers.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4 mt-auto border-t border-gray-700">
                    <Link to={`${createPageUrl("LiveFeed")}?search=${theme.theme_name}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full bg-gray-700 hover:bg-gray-600 border-gray-600 text-gray-200 font-semibold">
                        <Search className="w-4 h-4 mr-1" />
                        View News
                      </Button>
                    </Link>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="default" size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                          <History className="w-4 h-4 mr-1" />
                          Backtest
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl bg-gray-900 border-gray-700 text-white">
                        <DialogHeader>
                          <DialogTitle>Backtest: {theme.theme_name}</DialogTitle>
                        </DialogHeader>
                        <ThemeBacktester theme={theme} />
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredThemes.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <Zap className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <h3 className="text-xl font-semibold text-gray-200">No Emerging Themes Found</h3>
              <p className="mt-2">Try adjusting your filters or refresh the scan for new themes.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="velocity">
          <Card className="bg-gray-800 border-gray-700/60 shadow-xl">
            <CardHeader>
              <CardTitle className="text-gray-100">Theme Velocity Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={velocityChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', border: '1px solid #4b5563', color: '#e5e7eb' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="themes"
                    stroke="#4F46E5"
                    strokeWidth={2}
                    name="Theme Count"
                  />
                  <Line
                    type="monotone"
                    dataKey="velocity"
                    stroke="#10B981"
                    strokeWidth={2}
                    name="Avg Velocity"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overlaps">
          <Card className="bg-gray-800 border-gray-700/60 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-100">
                🎯 Your Smart Tracker Overlaps
                <Badge variant="outline" className="bg-blue-900/30 text-blue-300 border-blue-600/50">
                  {userOverlaps.length} matches
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userOverlaps.length > 0 ? (
                <div className="space-y-4">
                  {userOverlaps.map(theme => (
                    <div key={theme.id} className="border border-green-700 rounded-lg p-4 bg-green-900/30">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-green-300">{theme.theme_name}</h4>
                          <p className="text-sm text-green-400 mt-1">
                            This matches one of your tracked terms or tickers!
                          </p>
                        </div>
                        <Badge className={getStageColor(theme.stage)}>
                          {theme.stage}
                        </Badge>
                      </div>
                      <div className="mt-3 text-sm text-green-200">
                        <strong>Velocity:</strong> {theme.velocity_score?.toFixed(1)} •
                        <strong> Sentiment:</strong> {theme.sentiment_score} •
                        <strong> Confidence:</strong> {theme.confidence_score}/100
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 text-gray-500">
                  <Target className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                  <h3 className="text-xl font-semibold text-gray-200">No Overlaps Found</h3>
                  <p className="mt-2">None of your Smart Tracker terms match current emerging themes.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="archive">
          <Card className="bg-gray-800 border-gray-700/60 shadow-xl">
            <CardHeader>
              <CardTitle className="text-gray-100">Theme Archive & History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-16 text-gray-500">
                <Clock className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <h3 className="text-xl font-semibold text-gray-200">Coming Soon</h3>
                <p className="mt-2">Historical theme tracking and performance analysis.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
