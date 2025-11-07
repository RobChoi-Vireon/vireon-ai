
import React, { useState, useEffect } from 'react';
import { AlphaIdea } from '@/entities/AlphaIdea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Target, RefreshCw, TrendingUp, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AlphaRadar({ compact = false }) {
  const [ideas, setIdeas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadIdeas();
  }, []);

  const loadIdeas = async () => {
    setIsLoading(true);
    
    try {
      // Load real alpha ideas from database
      // Using the imported AlphaIdea entity directly
      const alphaIdeas = await AlphaIdea.list('-date', compact ? 2 : 3);
      
      if (alphaIdeas && alphaIdeas.length > 0) {
        setIdeas(alphaIdeas);
      } else {
        setIdeas([]);
      }
    } catch (error) {
      console.error('Error loading alpha ideas:', error);
      setIdeas([]);
    }
    
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <Card className="h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
        <CardHeader className="pb-4">
          <Skeleton className="h-6 w-3/4 bg-gray-200 dark:bg-gray-600" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(compact ? 2 : 3).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-24 bg-gray-200 dark:bg-gray-600 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
              <Target className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            </div>
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">Alpha Radar</CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={loadIdeas} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {ideas.length > 0 ? (
          <div className="space-y-4">
            {ideas.slice(0, compact ? 2 : 3).map((idea) => (
              <div key={idea.id} className="p-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-1">{idea.title}</h4>
                    <Badge variant="outline" className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700 mb-2">
                      {idea.theme}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${getScoreColor(idea.idea_score)}`}>
                      {idea.idea_score}/100
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  {idea.summary}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {idea.tickers.slice(0, 3).map((ticker) => (
                      <Badge key={ticker} variant="outline" className="text-xs font-mono bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200">
                        ${ticker}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getRiskColor(idea.risk_level)}>
                      {idea.risk_level}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="w-3 h-3" />
                      <span>{idea.time_horizon.split(' ')[0]}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Target className="w-8 h-8 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400 text-sm mb-2">No alpha ideas available</p>
            <p className="text-gray-500 text-xs">Ideas will appear as analysis runs</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function getScoreColor(score) {
  if (score >= 80) return 'text-green-600 dark:text-green-400';
  if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
}

function getRiskColor(risk) {
  switch (risk) {
    case 'Low': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800/50';
    case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800/50';
    case 'High': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800/50';
    default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700/50 dark:text-gray-300 dark:border-gray-600/50';
  }
}
