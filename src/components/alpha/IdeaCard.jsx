import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { createPageUrl } from '@/utils';
import { ExternalLink, ShieldAlert } from 'lucide-react';

const IdeaCard = ({ idea }) => {
  const getRiskColor = (risk) => {
    if (risk === 'High') return 'bg-red-900/40 text-red-300 border-red-500/50';
    if (risk === 'Medium') return 'bg-yellow-900/40 text-yellow-300 border-yellow-500/50';
    return 'bg-green-900/40 text-green-300 border-green-500/50';
  };
  
  const getScoreColor = (score) => {
    if (score >= 75) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className="flex flex-col bg-gray-800 border-gray-700/60 hover:border-blue-500/50 transition-colors duration-300 shadow-xl">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold text-gray-100">{idea.title}</CardTitle>
          <Badge variant="outline" className={`${getRiskColor(idea.risk_level)} font-semibold`}>{idea.risk_level} Risk</Badge>
        </div>
        <div className="flex flex-wrap gap-2 text-xs mt-2">
            <Badge variant="secondary" className="bg-gray-700 text-gray-300">{idea.sector}</Badge>
            <Badge variant="secondary" className="bg-gray-700 text-gray-300">{idea.sentiment_bias}</Badge>
            <Badge variant="secondary" className="bg-gray-700 text-gray-300">{idea.time_horizon}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <p className="text-sm text-gray-300 leading-relaxed">{idea.summary}</p>
        
        {idea.risk_overlay && (
            <div className="p-3 bg-red-900/20 border border-red-800 rounded-lg text-red-300 text-sm flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-400"/>
                <span><strong>Risk:</strong> {idea.risk_overlay}</span>
            </div>
        )}

        <div>
          <label className="text-xs font-semibold text-gray-300">Conviction Score: {idea.idea_score}</label>
          <Progress value={idea.idea_score} className="h-2 mt-1 bg-gray-700" indicatorClassName={getScoreColor(idea.idea_score)} />
        </div>

        {idea.tickers && idea.tickers.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2 text-gray-200">Relevant Tickers:</h4>
            <div className="flex flex-wrap gap-2">
              {idea.tickers.map(ticker => (
                <Badge key={ticker} variant="outline" className="font-mono bg-gray-700 text-gray-300 border-gray-600">${ticker}</Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Link to={createPageUrl(`LiveFeed?search=${(idea.keywords || []).join(',')}`)} className="w-full">
            <Button variant="outline" className="w-full bg-gray-700 hover:bg-gray-600 border-gray-600 text-gray-200 font-semibold">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Related News
            </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default IdeaCard;