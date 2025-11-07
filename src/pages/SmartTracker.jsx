
import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { User } from "@/entities/User";
import { InvokeLLM } from "@/integrations/Core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  X, 
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  ExternalLink,
  Target,
  RefreshCw
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

// FINAL FIX: This function will robustly handle any data format
const safeText = (value, defaultText = "") => {
  if (value === null || value === undefined) return defaultText;
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    // Prioritize specific string properties
    if (value.summary && typeof value.summary === 'string') return value.summary;
    if (value.text && typeof value.text === 'string') return value.text;
    if (value.rationale && typeof value.rationale === 'string') return value.rationale;
    if (value.analysis && typeof value.analysis === 'string') return value.analysis;
    if (value.response && typeof value.response === 'string') return value.response;
    // Fallback to stringifying the object if no specific string property is found
    return JSON.stringify(value);
  }
  // For other primitive types (numbers, booleans), convert to string
  return String(value);
};

export default function SmartTracker() {
  const [trackedTerms, setTrackedTerms] = useState([]);
  const [termResults, setTermResults] = useState({});
  const [newTerm, setNewTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState({});

  useEffect(() => {
    loadUserTracking();
  }, []);

  const loadUserTracking = async () => {
    setIsLoading(true);
    try {
      const user = await User.me();
      const preferences = await base44.entities.UserPreference.filter({ 
        created_by: user.email 
      });

      if (preferences.length > 0 && preferences[0].smart_tracking_terms) {
        const terms = preferences[0].smart_tracking_terms;
        setTrackedTerms(terms);
        
        // Load results for each term
        for (const term of terms) {
          await loadTermResults(term);
        }
      }
    } catch (error) {
      console.error("Error loading tracking data:", error);
    }
    setIsLoading(false);
  };

  const addTerm = async () => {
    const term = newTerm.trim();
    if (!term || trackedTerms.includes(term)) return;

    const updatedTerms = [...trackedTerms, term];
    setTrackedTerms(updatedTerms);
    setNewTerm("");

    // Update user preferences
    try {
      const user = await User.me();
      const preferences = await base44.entities.UserPreference.filter({ 
        created_by: user.email 
      });

      if (preferences.length > 0) {
        await base44.entities.UserPreference.update(preferences[0].id, {
          ...preferences[0],
          smart_tracking_terms: updatedTerms
        });
      } else {
        await base44.entities.UserPreference.create({
          smart_tracking_terms: updatedTerms
        });
      }

      // Load results for new term
      await loadTermResults(term);
    } catch (error) {
      console.error("Error saving tracking term:", error);
    }
  };

  const removeTerm = async (termToRemove) => {
    const updatedTerms = trackedTerms.filter(term => term !== termToRemove);
    setTrackedTerms(updatedTerms);
    
    // Remove from results
    const newResults = { ...termResults };
    delete newResults[termToRemove];
    setTermResults(newResults);

    // Update user preferences
    try {
      const user = await User.me();
      const preferences = await base44.entities.UserPreference.filter({ 
        created_by: user.email 
      });

      if (preferences.length > 0) {
        await base44.entities.UserPreference.update(preferences[0].id, {
          ...preferences[0],
          smart_tracking_terms: updatedTerms
        });
      }
    } catch (error) {
      console.error("Error updating tracking terms:", error);
    }
  };

  const loadTermResults = async (term) => {
    setIsGenerating(prev => ({ ...prev, [term]: true }));
    
    try {
      // Search for relevant articles
      const articles = await base44.entities.NewsArticle.list("-published_date", 100);
      const lowercasedTerm = term.toLowerCase();
      // FIX: Use optional chaining on ticker to prevent crashes.
      const relevantArticles = articles.filter(article =>
        article.title?.toLowerCase().includes(lowercasedTerm) ||
        article.content?.toLowerCase().includes(lowercasedTerm) ||
        (article.tickers_mentioned && 
         article.tickers_mentioned.some(ticker => 
           ticker?.toLowerCase() === lowercasedTerm
         ))
      ).slice(0, 10);

      if (relevantArticles.length > 0) {
        // Calculate sentiment distribution
        const sentimentCounts = { Bullish: 0, Bearish: 0, Neutral: 0 };
        relevantArticles.forEach(article => {
          if (article.sentiment) {
            sentimentCounts[article.sentiment]++;
          }
        });

        // Generate AI summary
        const headlines = relevantArticles.slice(0, 5).map(a => a.title).join('. ');
        const summaryResponse = await InvokeLLM({
          prompt: `Based on these recent headlines about "${term}": ${headlines}

          Provide a 2-3 sentence summary of the key developments and sentiment around this term/ticker. Focus on the most significant trends and implications.`,
          response_json_schema: {
            type: "object",
            properties: {
              summary: { type: "string" }
            },
            required: ["summary"]
          }
        });

        // FIX: Sanitize the summary before setting state
        const summaryText = safeText(summaryResponse.summary, "AI summary could not be generated.");

        setTermResults(prev => ({
          ...prev,
          [term]: {
            articles: relevantArticles,
            sentiment: sentimentCounts,
            summary: summaryText,
            lastUpdated: new Date()
          }
        }));
      } else {
        setTermResults(prev => ({
          ...prev,
          [term]: {
            articles: [],
            sentiment: { Bullish: 0, Bearish: 0, Neutral: 0 },
            summary: `No recent articles found for "${term}".`,
            lastUpdated: new Date()
          }
        }));
      }
    } catch (error) {
      console.error(`Error loading results for ${term}:`, error);
      setTermResults(prev => ({
        ...prev,
        [term]: {
          articles: [],
          sentiment: { Bullish: 0, Bearish: 0, Neutral: 0 },
          summary: `Error loading data for "${term}". Please try refreshing.`,
          lastUpdated: new Date()
        }
      }));
    }
    
    setIsGenerating(prev => ({ ...prev, [term]: false }));
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case "Bullish": return <TrendingUp className="w-4 h-4 text-green-400" />;
      case "Bearish": return <TrendingDown className="w-4 h-4 text-red-400" />;
      default: return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getOverallSentiment = (sentimentCounts) => {
    const total = Object.values(sentimentCounts).reduce((a, b) => a + b, 0);
    if (total === 0) return "neutral";
    
    const bullishPct = sentimentCounts.Bullish / total;
    const bearishPct = sentimentCounts.Bearish / total;
    
    if (bullishPct > bearishPct + 0.2) return "bullish";
    if (bearishPct > bullishPct + 0.2) return "bearish";
    return "neutral";
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="space-y-6">
          <Skeleton className="h-8 w-64 bg-gray-700" />
          <Skeleton className="h-32 w-full bg-gray-700" />
          <div className="grid md:grid-cols-2 gap-6">
            {Array(4).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full bg-gray-700" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Smart Tracker</h1>
        <p className="text-gray-300 text-lg">
          Track custom keywords, tickers, or people for personalized intelligence feeds
        </p>
      </div>

      {/* Add New Term */}
      <Card className="bg-gray-800 border-gray-700/60 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-gray-100 font-bold">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            Your Tracking Terms
            <Badge variant="outline" className="bg-blue-900/30 text-blue-300 border-blue-600/50 font-semibold">
              {trackedTerms.length} active
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 mb-6">
            <Input
              value={newTerm}
              onChange={(e) => setNewTerm(e.target.value)}
              placeholder="Enter ticker, keyword, or person (e.g., NVDA, Powell, China stimulus)"
              className="flex-1 bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && addTerm()}
            />
            <Button onClick={addTerm} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6">
              <Plus className="w-4 h-4 mr-2" />
              Track Term
            </Button>
          </div>

          {/* Current Terms */}
          {trackedTerms.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {trackedTerms.map(term => {
                const results = termResults[term];
                const sentiment = results ? getOverallSentiment(results.sentiment) : "neutral";
                
                return (
                  <div key={term} className="relative group">
                    <Badge
                      variant="outline"
                      className={`text-sm px-4 py-2 font-medium ${
                        sentiment === 'bullish' ? 'border-green-500/50 bg-green-900/30 text-green-300' :
                        sentiment === 'bearish' ? 'border-red-500/50 bg-red-900/30 text-red-300' :
                        'border-gray-500/50 bg-gray-700/50 text-gray-300'
                      }`}
                    >
                      <span className="font-semibold">{term}</span>
                      {results && (
                        <span className="ml-2 text-xs opacity-75">
                          {results.articles.length} articles
                        </span>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20"
                        onClick={() => removeTerm(term)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6" />
              </div>
              <p className="font-medium">No tracking terms yet. Add some to get started!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results for Each Term */}
      {trackedTerms.length > 0 && (
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-gray-100">Tracking Results</h2>
          
          {trackedTerms.map(term => {
            const results = termResults[term];
            const isGeneratingThis = isGenerating[term];
            
            return (
              <Card key={term} className="bg-gray-800 border-gray-700/60 shadow-xl">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-3 text-gray-100">
                      <span className="font-mono text-lg font-bold">{term}</span>
                      {results && (
                        <Badge variant="outline" className="bg-blue-900/30 text-blue-300 border-blue-600/50 font-semibold">
                          {results.articles.length} articles
                        </Badge>
                      )}
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadTermResults(term)}
                      disabled={isGeneratingThis}
                      className="bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
                    >
                      <RefreshCw className={`w-4 h-4 mr-2 ${isGeneratingThis ? 'animate-spin' : ''}`} />
                      {isGeneratingThis ? 'Updating...' : 'Refresh'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {isGeneratingThis ? (
                    <div className="space-y-4">
                      <Skeleton className="h-4 w-3/4 bg-gray-700" />
                      <Skeleton className="h-16 w-full bg-gray-700" />
                      <div className="flex gap-2">
                        {Array(3).fill(0).map((_, i) => (
                          <Skeleton key={i} className="h-8 w-16 bg-gray-700" />
                        ))}
                      </div>
                    </div>
                  ) : results ? (
                    <div className="space-y-6">
                      {/* AI Summary */}
                      <div className="bg-blue-900/30 border border-blue-600/50 rounded-lg p-4">
                        <div className="flex items-start gap-2 mb-2">
                          <Sparkles className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm font-semibold text-blue-300">AI Summary</span>
                        </div>
                        <p className="text-sm text-blue-200 leading-relaxed">{safeText(results.summary)}</p>
                        <p className="text-xs text-blue-300 mt-2">
                          Last updated: {formatDistanceToNow(results.lastUpdated, { addSuffix: true })}
                        </p>
                      </div>

                      {/* Sentiment Distribution */}
                      <div className="flex items-center gap-6">
                        <h4 className="font-semibold text-gray-100">Sentiment:</h4>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4 text-green-400" />
                            <span className="text-sm text-gray-300 font-medium">
                              {results.sentiment.Bullish} Bullish
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingDown className="w-4 h-4 text-red-400" />
                            <span className="text-sm text-gray-300 font-medium">
                              {results.sentiment.Bearish} Bearish
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Minus className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-300 font-medium">
                              {results.sentiment.Neutral} Neutral
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Recent Articles */}
                      {results.articles.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-100 mb-3">Recent Articles:</h4>
                          <div className="space-y-3">
                            {results.articles.slice(0, 5).map(article => (
                              <div key={article.id} className="flex items-start gap-3 p-3 bg-gray-700/50 rounded-lg border border-gray-600/50">
                                <div className="flex-shrink-0">
                                  {getSentimentIcon(article.sentiment)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h5 className="font-medium text-gray-100 text-sm leading-snug">
                                    {article.title}
                                  </h5>
                                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                                    <span className="font-medium">{article.source}</span>
                                    <span>•</span>
                                    <span>{formatDistanceToNow(new Date(article.published_date), { addSuffix: true })}</span>
                                    {article.impact_score && (
                                      <>
                                        <span>•</span>
                                        <span>Impact: {article.impact_score}/10</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                                {article.source_url && (
                                  <a href={article.source_url} target="_blank" rel="noopener noreferrer">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-200 hover:bg-gray-600/50">
                                      <ExternalLink className="w-3 h-3" />
                                    </Button>
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <p className="font-medium">Click "Refresh" to load results for this term.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
