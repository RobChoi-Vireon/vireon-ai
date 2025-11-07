
import React, { useState, useEffect } from 'react';
import { InvokeLLM } from '@/integrations/Core';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Helper function to robustly extract a string from a potentially nested object
const safeText = (value, defaultText = "") => {
  if (value === null || value === undefined) return defaultText;
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    if (value.summary && typeof value.summary === 'string') return value.summary;
    if (value.text && typeof value.text === 'string') return value.text;
    if (value.rationale && typeof value.rationale === 'string') return value.rationale;
    if (value.analysis && typeof value.analysis === 'string') return value.analysis; // Added this line
    if (value.response && typeof value.response === 'string') return value.response;
    return JSON.stringify(value);
  }
  return String(value);
};

export default function MarketSentiment() {
  const [sentimentData, setSentimentData] = useState([]);
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const COLORS = {
    Bullish: '#22c55e', // green-500
    Bearish: '#ef4444', // red-500
    Neutral: '#a1a1aa', // zinc-400
  };

  useEffect(() => {
    loadSentiment();
  }, []);

  const loadSentiment = async () => {
    setIsLoading(true);
    try {
      const prompt = `Analyze today's overall market sentiment based on news flow. Provide a distribution (percentage) for Bullish, Bearish, and Neutral sentiment. Also, provide a one-sentence summary of the prevailing mood.`;
      const response = await InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            distribution: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string', enum: ['Bullish', 'Bearish', 'Neutral'] },
                  value: { type: 'number' }
                }
              }
            },
            summary: { type: 'string' }
          }
        }
      });
      if (response && response.distribution) {
        setSentimentData(response.distribution);
        // FIX: Defensively get the summary string before setting state
        setSummary(safeText(response.summary, "No summary available."));
      } else {
        throw new Error("Invalid response from AI");
      }
    } catch (error) {
      console.error("Failed to load market sentiment:", error);
      setSummary("Failed to load market sentiment.");
      setSentimentData([]);
    }
    setIsLoading(false);
  };

  return (
    <Card className="h-full vireon-card-elevated shadow-xl bg-gray-800 border border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="vireon-gradient-text" />
            <CardTitle className="vireon-text-primary">Market Sentiment</CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={loadSentiment} className="vireon-text-muted hover:vireon-text-primary">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-40 flex items-center justify-center">
            <p className="text-gray-400">Loading sentiment data...</p>
          </div>
        ) : (
          <>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={60}
                    fill="#8884d8" // This fill will be overridden by Cell fills
                    dataKey="value"
                    nameKey="name"
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm vireon-text-muted text-center mt-4">{summary}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
