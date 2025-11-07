
import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { InvokeLLM } from '@/integrations/Core';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Zap, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Target,
  RefreshCw,
  Sparkles,
  BookmarkPlus,
  ExternalLink
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function NextLikelyMovers() {
  const [predictions, setPredictions] = useState([]);
  const [insights, setInsights] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    loadPredictions();
    // Auto-refresh every hour
    const interval = setInterval(loadPredictions, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const loadPredictions = async () => {
    setIsLoading(true);
    try {
      // Get existing predictions from today
      const today = format(new Date(), 'yyyy-MM-dd');
      const existingPredictions = await base44.entities.MarketPrediction.filter({
        date: today
      });

      if (existingPredictions.length > 0) {
        setPredictions(existingPredictions.sort((a, b) => b.confidence_score - a.confidence_score));
        setLastUpdated(new Date(existingPredictions[0].created_date));
      } else {
        await generatePredictions();
      }
    } catch (error) {
      console.error("Error loading predictions:", error);
    }
    setIsLoading(false);
  };

  const generatePredictions = async () => {
    setIsGenerating(true);
    try {
      // Get recent market data and news
      const recentNews = await base44.entities.NewsArticle.list('-published_date', 15);
      const highImpactNews = recentNews.filter(article => article.impact_score >= 7);
      
      // Create context from news
      const newsContext = highImpactNews.slice(0, 10).map(article => 
        `${article.title} (${article.sentiment}, Impact: ${article.impact_score}, Tickers: ${article.tickers_mentioned?.join(', ') || 'N/A'})`
      ).join('; ');

      const response = await InvokeLLM({
        prompt: `You are an AI market prediction engine for institutional traders. Based on recent high-impact news and market patterns, identify 8-12 tickers with high probability of significant movement in the next 1-7 days.

        Recent High-Impact News: ${newsContext}

        For each prediction, analyze:
        - Recent news sentiment and momentum
        - Sector rotation patterns  
        - Volume and technical indicators
        - Earnings proximity and guidance
        - Macro economic factors

        Provide structured predictions with confidence scoring based on signal strength.`,
        response_json_schema: {
          type: "object",
          properties: {
            market_overview: { type: "string" },
            predictions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  ticker: { type: "string" },
                  company_name: { type: "string" },
                  direction: { type: "string", enum: ["Bullish", "Bearish"] },
                  timeframe: { type: "string", enum: ["Intraday", "1-3 Days", "1 Week"] },
                  confidence_score: { type: "integer", minimum: 1, maximum: 100 },
                  rationale: { type: "string" },
                  key_catalysts: { type: "array", items: { type: "string" } },
                  sector: { type: "string" },
                  risk_factors: { type: "array", items: { type: "string" } },
                  price_target_change: { type: "number" },
                  related_news: { type: "array", items: { type: "string" } }
                }
              }
            }
          },
          required: ["market_overview", "predictions"]
        }
      });

      if (response && response.predictions) {
        const today = format(new Date(), 'yyyy-MM-dd');
        const predictionsWithDate = response.predictions.map(prediction => ({
          ...prediction,
          date: today,
          generated_at: new Date().toISOString()
        }));

        // Store predictions
        await base44.entities.MarketPrediction.bulkCreate(predictionsWithDate);
        
        setPredictions(predictionsWithDate.sort((a, b) => b.confidence_score - a.confidence_score));
        setInsights(response.market_overview);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error("Error generating predictions:", error);
    }
    setIsGenerating(false);
  };

  const getConfidenceColor = (score) => {
    if (score >= 80) return "bg-green-900/40 text-green-300 border-green-500/50";
    if (score >= 60) return "bg-yellow-900/40 text-yellow-300 border-yellow-500/50";
    return "bg-red-900/40 text-red-300 border-red-500/50";
  };

  const getDirectionIcon = (direction) => {
    return direction === "Bullish" ? 
      <TrendingUp className="w-4 h-4 text-green-600" /> : 
      <TrendingDown className="w-4 h-4 text-red-600" />;
  };

  const getDirectionColor = (direction) => {
    return direction === "Bullish" ? 
      "bg-green-900/40 text-green-300 border-green-500/50" :
      "bg-red-900/40 text-red-300 border-red-500/50";
  };

  const trackPrediction = async (prediction) => {
    try {
      // Add to user's watchlist
      const userPrefs = await base44.entities.UserPreference.list();
      if (userPrefs.length > 0) {
        const currentWatchlist = userPrefs[0].watchlist_tickers || [];
        if (!currentWatchlist.includes(prediction.ticker)) {
          await base44.entities.UserPreference.update(userPrefs[0].id, {
            ...userPrefs[0],
            watchlist_tickers: [...currentWatchlist, prediction.ticker]
          });
          
          // Show success feedback
          console.log(`Added ${prediction.ticker} to watchlist`);
        }
      }
    } catch (error) {
      console.error("Error tracking prediction:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-100 mb-2">Next Likely Movers</h2>
          <p className="text-gray-300">AI-powered short-term movement predictions</p>
          {lastUpdated && (
            <p className="text-sm text-gray-400 mt-1">
              Last updated: {formatDistanceToNow(lastUpdated, { addSuffix: true })}
            </p>
          )}
        </div>

        <Button 
          onClick={generatePredictions}
          disabled={isGenerating}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
          {isGenerating ? 'Generating...' : 'Refresh Predictions'}
        </Button>
      </div>

      {/* Market Overview Insights */}
      {insights && (
        <Card className="border-blue-700 bg-blue-900/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-300 mb-2">Market Movement Overview</h3>
                <p className="text-blue-200 leading-relaxed text-sm">{insights}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Predictions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array(9).fill(0).map((_, i) => <Skeleton key={i} className="h-80 w-full bg-gray-700" />)
        ) : predictions.length > 0 ? (
          predictions.map((prediction, index) => (
            <Card key={prediction.ticker || index} className="bg-gray-800 border-gray-700/60 hover:border-blue-500/50 transition-colors duration-300 shadow-xl flex flex-col">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <span className="font-mono font-bold text-gray-100">${prediction.ticker}</span>
                      {getDirectionIcon(prediction.direction)}
                    </CardTitle>
                    <p className="text-sm text-gray-300 mt-1">{prediction.company_name}</p>
                  </div>
                  <Badge className={`${getConfidenceColor(prediction.confidence_score)} font-semibold`}>
                    {prediction.confidence_score}% confidence
                  </Badge>
                </div>

                <div className="flex gap-2 mt-3">
                  <Badge className={`${getDirectionColor(prediction.direction)} font-semibold`}>
                    {prediction.direction}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1 border-gray-600 text-gray-300">
                    <Clock className="w-3 h-3" />
                    {prediction.timeframe}
                  </Badge>
                  {prediction.sector && (
                    <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                      {prediction.sector}
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col justify-between">
                <div>
                  {/* Rationale */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-sm text-gray-200 mb-2">AI Analysis:</h4>
                    <p className="text-sm text-gray-300 leading-relaxed">{prediction.rationale}</p>
                  </div>

                  {/* Key Catalysts */}
                  {prediction.key_catalysts && prediction.key_catalysts.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-sm text-gray-200 mb-2">Key Catalysts:</h4>
                      <ul className="space-y-1">
                        {prediction.key_catalysts.slice(0, 3).map((catalyst, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span>{catalyst}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Price Target */}
                  {prediction.price_target_change && (
                    <div className="mb-4 p-3 bg-gray-700/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Expected Move:</span>
                        <span className={`font-bold ${prediction.price_target_change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {prediction.price_target_change > 0 ? '+' : ''}{prediction.price_target_change.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Risk Factors */}
                  {prediction.risk_factors && prediction.risk_factors.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-sm text-red-300 mb-2">Risk Factors:</h4>
                      <div className="text-xs text-red-300 bg-red-900/20 p-2 rounded">
                        {prediction.risk_factors.slice(0, 2).join('; ')}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t border-gray-700 mt-auto">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 bg-gray-700 hover:bg-gray-600 border-gray-600 text-gray-200 font-semibold"
                    onClick={() => trackPrediction(prediction)}
                  >
                    <BookmarkPlus className="w-4 h-4 mr-1" />
                    Track
                  </Button>
                  <Link to={`${createPageUrl("LiveFeed")}?search=${prediction.ticker}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full bg-gray-700 hover:bg-gray-600 border-gray-600 text-gray-200 font-semibold">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      News
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-16 text-gray-500">
            <Zap className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <h3 className="text-xl font-semibold text-gray-200">No Movement Predictions Available</h3>
            <p className="mt-2">Generate new predictions to see AI-powered market forecasts.</p>
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <Card className="mt-8 border-yellow-700 bg-yellow-900/30">
        <CardContent className="p-4">
          <div className="text-center">
            <h3 className="font-semibold text-yellow-300 mb-2">Prediction Disclaimer</h3>
            <p className="text-yellow-200 text-sm">
              These predictions are AI-generated based on current market data and news sentiment. 
              Past performance does not guarantee future results. Always conduct your own research.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
