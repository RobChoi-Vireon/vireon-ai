import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { InvokeLLM } from '@/integrations/Core';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lightbulb, RefreshCw, Zap } from 'lucide-react';

import FilterPanel from '../components/alpha/FilterPanel';
import IdeaCard from '../components/alpha/IdeaCard';
import NextLikelyMovers from '../components/alpha/NextLikelyMovers';
import PredictionTracker from '../components/alpha/PredictionTracker';
import PerformanceLeaderboard from '../components/alpha/PerformanceLeaderboard';

export default function AlphaGeneration() {
  const [ideas, setIdeas] = useState([]);
  const [filteredIdeas, setFilteredIdeas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [filters, setFilters] = useState({
    sector: 'All',
    risk_level: 'All',
    sentiment_bias: 'All',
    time_horizon: 'All',
  });

  useEffect(() => {
    loadIdeas();
  }, []);

  useEffect(() => {
    let result = ideas;
    if (filters.sector !== 'All') {
      result = result.filter(idea => idea.sector === filters.sector);
    }
    if (filters.risk_level !== 'All') {
      result = result.filter(idea => idea.risk_level === filters.risk_level);
    }
    if (filters.sentiment_bias !== 'All') {
      result = result.filter(idea => idea.sentiment_bias === filters.sentiment_bias);
    }
    if (filters.time_horizon !== 'All') {
      result = result.filter(idea => idea.time_horizon === filters.time_horizon);
    }
    setFilteredIdeas(result);
  }, [filters, ideas]);

  const loadIdeas = async () => {
    setIsLoading(true);
    try {
      const existingIdeas = await base44.entities.AlphaIdea.list('-date', 50);
      setIdeas(existingIdeas);
    } catch (error) {
      console.error('Error loading alpha ideas:', error);
    }
    setIsLoading(false);
  };

  const handleGenerateIdeas = async () => {
    setIsGenerating(true);
    try {
      const recentNews = await base44.entities.NewsArticle.list('-published_date', 10);
      const newsContext = recentNews.map(n => `Title: ${n.title}, Sentiment: ${n.sentiment}, Sector: ${n.sector}`).join('; ');

      const response = await InvokeLLM({
        prompt: `You are an AI alpha generation engine for a top-tier hedge fund. Based on recent market news (${newsContext}), generate 5-7 high-conviction, actionable trade ideas. For each idea, provide a structured JSON object with the following fields: title, theme, summary, risk_overlay, tickers, keywords, time_horizon, risk_level, idea_score, sentiment_bias, and sector. Ensure diversity across themes, sectors, and biases.`,
        response_json_schema: {
          type: 'object',
          properties: {
            ideas: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                    title: { type: 'string' },
                    theme: { type: 'string' },
                    summary: { type: 'string' },
                    risk_overlay: { type: 'string' },
                    tickers: { type: 'array', items: { type: 'string' } },
                    keywords: { type: 'array', items: { type: 'string' } },
                    time_horizon: { type: 'string', enum: ["Short-Term (1-5 days)", "Medium-Term (1-4 weeks)", "Long-Term (1-6 months)"] },
                    risk_level: { type: 'string', enum: ["High", "Medium", "Low"] },
                    idea_score: { type: 'integer', minimum: 0, maximum: 100 },
                    sentiment_bias: { type: 'string', enum: ["Momentum", "Contrarian", "Rotation", "Value"] },
                    sector: { type: 'string', enum: ["Technology", "Energy", "Healthcare", "Financial Services", "Consumer", "Industrial", "Real Estate", "Utilities", "Materials", "Communications", "Cross-Asset"] }
                }
              }
            }
          }
        }
      });

      if (response && response.ideas) {
        const ideasWithDate = response.ideas.map(idea => ({
          ...idea,
          date: new Date().toISOString(),
        }));
        await base44.entities.AlphaIdea.bulkCreate(ideasWithDate);
      }
      
      await loadIdeas();
    } catch (error) {
      console.error('Error generating new ideas:', error);
    }
    setIsGenerating(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 bg-gray-950 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Alpha Generation Engine</h1>
        <p className="text-gray-300 text-lg">
          AI-powered tactical ideas and market setups based on real-time data and sentiment analysis.
        </p>
      </div>

      <Tabs defaultValue="ideas" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800 border border-gray-700 p-1 rounded-xl shadow-sm">
          <TabsTrigger value="ideas" className="data-[state=active]:bg-purple-900/40 data-[state=active]:text-purple-300 text-gray-300 font-semibold rounded-lg py-2">Alpha Ideas</TabsTrigger>
          <TabsTrigger value="movers" className="data-[state=active]:bg-green-900/40 data-[state=active]:text-green-300 text-gray-300 font-semibold rounded-lg py-2">Next Likely Movers</TabsTrigger>
          <TabsTrigger value="tracker" className="data-[state=active]:bg-blue-900/40 data-[state=active]:text-blue-300 text-gray-300 font-semibold rounded-lg py-2">Prediction Tracker</TabsTrigger>
          <TabsTrigger value="leaderboard" className="data-[state=active]:bg-orange-900/40 data-[state=active]:text-orange-300 text-gray-300 font-semibold rounded-lg py-2">Performance Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="ideas">
          <div className="flex justify-end mb-6">
            <Button
              onClick={handleGenerateIdeas}
              disabled={isGenerating}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
              {isGenerating ? 'Generating...' : 'Generate New Ideas'}
            </Button>
          </div>

          <FilterPanel filters={filters} setFilters={setFilters} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {isLoading ? (
              Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-64 w-full bg-gray-700" />)
            ) : filteredIdeas.length > 0 ? (
              filteredIdeas.map(idea => <IdeaCard key={idea.id} idea={idea} />)
            ) : (
              <div className="col-span-full text-center py-16 text-gray-500">
                <Lightbulb className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <h3 className="text-xl font-semibold text-gray-200">No Alpha Ideas Found</h3>
                <p className="text-gray-400 mt-2">Try adjusting your filters or generating a new set of ideas.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="movers">
          <NextLikelyMovers />
        </TabsContent>

        <TabsContent value="tracker">
          <PredictionTracker />
        </TabsContent>

        <TabsContent value="leaderboard">
          <PerformanceLeaderboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}