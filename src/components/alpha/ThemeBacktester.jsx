
import React, { useState, useEffect } from 'react';
import { InvokeLLM } from '@/integrations/Core';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Minus, Info, AlertTriangle } from 'lucide-react';
import { format, subDays, addDays } from 'date-fns';

export default function ThemeBacktester({ theme }) {
  const [backtestData, setBacktestData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    runBacktest();
  }, [theme]);

  const runBacktest = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const tickersToTest = theme.related_tickers?.slice(0, 3) || [];
      if (tickersToTest.length === 0) {
        setError("No associated tickers to backtest for this theme.");
        setIsLoading(false);
        return;
      }
      
      const startDate = format(subDays(new Date(theme.first_detected), 1), 'yyyy-MM-dd');
      const endDate = format(addDays(new Date(theme.first_detected), 30), 'yyyy-MM-dd');

      const prompt = `
        You are a quantitative financial analyst. Perform a historical backtest for an investment theme.

        Theme: "${theme.theme_name}"
        Associated Tickers: ${tickersToTest.join(', ')}
        Benchmark: SPY
        Backtest Period: From ${startDate} to ${endDate}

        Instructions:
        1. Generate realistic daily historical price data for each ticker and the SPY benchmark for the specified period.
        2. Create a daily performance chart dataset. Each data point should include the date, the cumulative return of an equally-weighted portfolio of the theme tickers, and the cumulative return of the SPY benchmark. Both should start at 0% on day 1.
        3. Calculate the following overall performance metrics for the theme portfolio:
           - Total Return (%)
           - Benchmark (SPY) Return (%)
           - Alpha vs. Benchmark (%)
           - Max Drawdown (%)
           - Sharpe Ratio (assume a 2% risk-free rate)
           - Win Rate (% of days the theme portfolio outperformed the benchmark)
        4. Provide a 2-sentence GPT-generated insight summarizing the backtest results, highlighting whether the theme showed alpha.

        Format your response as a single JSON object.
      `;

      const response = await InvokeLLM({
        prompt: prompt,
        response_json_schema: {
          type: "object",
          properties: {
            chart_data: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  date: { type: "string" },
                  theme_return: { type: "number" },
                  benchmark_return: { type: "number" },
                },
                required: ["date", "theme_return", "benchmark_return"],
              },
            },
            metrics: {
              type: "object",
              properties: {
                total_return: { type: "number" },
                benchmark_return: { type: "number" },
                alpha: { type: "number" },
                max_drawdown: { type: "number" },
                sharpe_ratio: { type: "number" },
                win_rate: { type: "number" },
              },
              required: ["total_return", "benchmark_return", "alpha", "max_drawdown", "sharpe_ratio", "win_rate"],
            },
            summary_insight: { type: "string" },
          },
          required: ["chart_data", "metrics", "summary_insight"],
        }
      });

      setBacktestData(response);

    } catch (e) {
      console.error("Backtest failed:", e);
      setError("Failed to generate backtest data. The AI model may be overloaded. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderMetricCard = (title, value, unit = '%', positiveIsGood = true) => {
    const isPositive = typeof value === 'number' && value > 0;
    const isNegative = typeof value === 'number' && value < 0;
    
    let colorClass = 'text-white';
    if (positiveIsGood) {
      if (isPositive) colorClass = 'text-green-400';
      if (isNegative) colorClass = 'text-red-400';
    } else {
      if (isPositive) colorClass = 'text-red-400';
      if (isNegative) colorClass = 'text-green-400';
    }

    return (
      <Card className="text-center p-4 bg-gray-800 border-gray-700/60">
        <CardTitle className="text-sm font-medium text-gray-400 mb-1">{title}</CardTitle>
        <div className={`text-2xl font-bold ${colorClass}`}>
          {typeof value === 'number' ? `${value.toFixed(2)}${unit}` : 'N/A'}
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4 p-4 animate-pulse">
        <Skeleton className="h-8 w-3/4 bg-gray-700" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Skeleton className="h-20 bg-gray-700" />
          <Skeleton className="h-20 bg-gray-700" />
          <Skeleton className="h-20 bg-gray-700" />
          <Skeleton className="h-20 bg-gray-700" />
          <Skeleton className="h-20 bg-gray-700" />
          <Skeleton className="h-20 bg-gray-700" />
        </div>
        <Skeleton className="h-64 w-full bg-gray-700" />
      </div>
    );
  }
  
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!backtestData) return null;

  return (
    <div className="space-y-6 p-4">
      <Alert className="border-blue-700 bg-blue-900/30">
        <Info className="h-4 w-4 text-blue-400" />
        <AlertTitle className="text-blue-300 font-semibold">AI-Generated Summary</AlertTitle>
        <AlertDescription className="text-blue-200">
          {backtestData.summary_insight}
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {renderMetricCard('Total Return', backtestData.metrics.total_return)}
        {renderMetricCard('Benchmark', backtestData.metrics.benchmark_return)}
        {renderMetricCard('Alpha', backtestData.metrics.alpha)}
        {renderMetricCard('Max Drawdown', backtestData.metrics.max_drawdown, '%', false)}
        {renderMetricCard('Sharpe Ratio', backtestData.metrics.sharpe_ratio, '')}
        {renderMetricCard('Win Rate', backtestData.metrics.win_rate)}
      </div>

      <Card className="bg-gray-800 border-gray-700/60">
        <CardHeader>
          <CardTitle className="text-gray-100">Performance vs. Benchmark (SPY)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={backtestData.chart_data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis tickFormatter={(value) => `${value.toFixed(0)}%`} stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', border: '1px solid #4b5563', color: '#e5e7eb' }}
                formatter={(value) => `${value.toFixed(2)}%`} 
              />
              <Legend wrapperStyle={{ color: '#e5e7eb' }} />
              <Line type="monotone" dataKey="theme_return" name="Theme" stroke="#4F46E5" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="benchmark_return" name="SPY" stroke="#6b7280" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
