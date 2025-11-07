
import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { InvokeLLM } from '@/integrations/Core';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUp, ArrowDown, Minus, RefreshCw, BrainCircuit } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format } from 'date-fns';

const safeText = (value, defaultText = "") => {
  if (value === null || value === undefined) return defaultText;
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    if (value.summary && typeof value.summary === 'string') return value.summary;
    if (value.text && typeof value.text === 'string') return value.text;
    if (value.rationale && typeof value.rationale === 'string') return value.rationale;
    if (value.analysis && typeof value.analysis === 'string') return value.analysis; // Added this line
    if (value.response && typeof value.response === 'string') return value.response;   // Added this line
    return JSON.stringify(value);
  }
  return String(value);
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 border border-gray-700 p-3 rounded-lg shadow-lg">
        <p className="text-gray-300 text-sm">{`Date: ${format(new Date(label), 'MMM d')}`}</p>
        <p className="text-blue-300 font-semibold">{`Estimate: $${payload[0].value.toFixed(2)}`}</p>
      </div>
    );
  }
  return null;
};

export default function EstimateDriftTracker({ ticker, reportingPeriod }) {
  const [driftData, setDriftData] = useState([]);
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (ticker && reportingPeriod) {
      loadDriftData();
    }
  }, [ticker, reportingPeriod]);

  const loadDriftData = async () => {
    setIsLoading(true);
    try {
      const data = await base44.entities.EstimateDrift.filter({
        ticker: ticker,
        reporting_period: reportingPeriod,
      }, '-tracking_date', 30); // Get last 30 days
      
      setDriftData(data.sort((a, b) => new Date(a.tracking_date) - new Date(b.tracking_date)));
      generateAiAnalysis(data);
    } catch (error) {
      console.error('Error loading drift data:', error);
      setDriftData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateAiAnalysis = async (data) => {
    if (!data || data.length < 2) {
        setAiAnalysis('Not enough data for analysis.');
        return;
    }
    setIsAnalyzing(true);
    try {
        const firstEstimate = data[0].eps_estimate;
        const latestEstimate = data[data.length - 1].eps_estimate;
        const change = latestEstimate - firstEstimate;
        const percentChange = (change / firstEstimate) * 100;
        const revisionsUp = data.filter(d => d.revision_direction === 'Up').length;
        const revisionsDown = data.filter(d => d.revision_direction === 'Down').length;

        const prompt = `Analyze the following earnings estimate drift data for ${ticker} (${reportingPeriod}):
        - Start Estimate (30d ago): $${firstEstimate.toFixed(2)}
        - Latest Estimate: $${latestEstimate.toFixed(2)}
        - 30-Day Change: ${percentChange.toFixed(2)}%
        - Upward Revisions: ${revisionsUp}
        - Downward Revisions: ${revisionsDown}
        
        Provide a concise, 1-2 sentence analysis highlighting the pattern and sentiment. Then, add a "Historical Context" line referencing a hypothetical historical surprise rate for this drift pattern.
        Example: "Estimates for ${ticker} show a clear upward trend, with ${revisionsUp} positive revisions suggesting bullish sentiment ahead of earnings.
        Historical Context: Last 4 times with this drift pattern → 3 beat, 1 inline."`;

      const response = await InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            analysis: { type: 'string' }
          },
          required: ["analysis"] // Changed to only expect 'analysis' and make it required
        }
      });
      
      const analysisText = safeText(response.analysis, "AI analysis could not be generated."); // Updated how analysis is set
      setAiAnalysis(analysisText);

    } catch (error) {
      console.error('Error generating AI analysis:', error);
      setAiAnalysis('Could not generate AI analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  if (isLoading) {
    return (
      <Card className="bg-gray-800/50 border border-gray-700/60">
        <CardContent className="p-4">
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-40 w-full mb-4" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (driftData.length === 0) {
      return (
          <Card className="bg-gray-800/50 border border-gray-700/60">
              <CardContent className="p-6 text-center text-gray-400">
                  No estimate drift data available for {ticker}.
              </CardContent>
          </Card>
      )
  }

  const latestData = driftData[driftData.length - 1];
  const thirtyDayChange = latestData.eps_estimate - driftData[0].eps_estimate;
  const thirtyDayPercentChange = (thirtyDayChange / driftData[0].eps_estimate) * 100;

  return (
    <Card className="bg-gray-800/50 border border-gray-700/60">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-gray-100 text-lg">
            Estimate Drift for {ticker} ({reportingPeriod})
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={loadDriftData} className="text-gray-400 hover:text-white">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-4 text-center">
            <div>
                <p className="text-sm text-gray-400">Current EPS Estimate</p>
                <p className="text-2xl font-bold text-white">${latestData.eps_estimate.toFixed(3)}</p>
            </div>
            <div>
                <p className="text-sm text-gray-400">30-Day Change</p>
                <div className={`flex items-center justify-center gap-1 text-2xl font-bold ${thirtyDayPercentChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {thirtyDayPercentChange >= 0 ? <ArrowUp className="w-5 h-5" /> : <ArrowDown className="w-5 h-5" />}
                    {thirtyDayPercentChange.toFixed(2)}%
                </div>
            </div>
            <div>
                <p className="text-sm text-gray-400">30-Day Revisions</p>
                <div className="flex items-center justify-center gap-2 text-xl font-bold">
                    <span className="text-green-400 flex items-center">{latestData.revision_count_30d || 0}<ArrowUp className="w-4 h-4" /></span>
                    <span className="text-gray-500">|</span>
                    <span className="text-red-400 flex items-center">{driftData.filter(d => d.revision_direction === 'Down').length}<ArrowDown className="w-4 h-4" /></span>
                </div>
            </div>
        </div>

        {/* Chart */}
        <div className="h-60 w-full">
            <ResponsiveContainer>
                <LineChart data={driftData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                    <XAxis 
                      dataKey="tracking_date" 
                      tickFormatter={(date) => format(new Date(date), 'MMM d')}
                      stroke="#a0aec0"
                      fontSize={12}
                    />
                    <YAxis 
                      domain={['dataMin - 0.01', 'dataMax + 0.01']} 
                      stroke="#a0aec0"
                      fontSize={12}
                      tickFormatter={(value) => `$${value.toFixed(2)}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line type="monotone" dataKey="eps_estimate" name="EPS Estimate" stroke="#3b82f6" strokeWidth={2} dot={{ r: 2 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>

        {/* AI Analysis */}
        <Card className="bg-gray-900/50 border-blue-800/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-300 text-base">
              <BrainCircuit className="w-5 h-5" />
              AI-Powered Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isAnalyzing ? (
              <Skeleton className="h-12 w-full" />
            ) : (
              <p className="text-gray-300 whitespace-pre-line text-sm">{safeText(aiAnalysis)}</p>
            )}
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
