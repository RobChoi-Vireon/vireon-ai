import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { InvokeLLM } from '@/integrations/Core';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Download, RefreshCw, FileText, Sparkles } from 'lucide-react';
import { format, startOfWeek, endOfWeek } from 'date-fns';

export default function PlaybookGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [reportHtml, setReportHtml] = useState(null);
  const [error, setError] = useState(null);

  const exportToPdf = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(reportHtml);
    printWindow.document.close();
  };
  
  const generatePlaybook = async () => {
    setIsLoading(true);
    setError(null);
    setReportHtml(null);

    try {
      const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
      const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
      const topAlerts = await base44.entities.AlertHistory.list('-triggered_at', 5);
      const topIdeas = await base44.entities.PredictionOutcome.filter({ was_correct: true }, '-outcome_date', 3);
      const recentArticles = await base44.entities.NewsArticle.list('-published_date', 50);

      const alertSummary = topAlerts.map(a => `${a.ticker} triggered ${a.alert_type} at ${a.triggered_price}`).join('; ');
      const ideaSummary = topIdeas.map(i => `${i.ticker} prediction was correct with ${i.actual_move_percent.toFixed(2)}% move`).join('; ');
      
      const sectorSentiment = {};
      recentArticles.forEach(article => {
        if (article.sector) {
          sectorSentiment[article.sector] = (sectorSentiment[article.sector] || 0) + (article.sentiment === 'Bullish' ? 1 : article.sentiment === 'Bearish' ? -1 : 0);
        }
      });
      const sectorSummary = Object.entries(sectorSentiment).map(([sector, score]) => `${sector}: ${score}`).join('; ');

      const prompt = `
        You are a chief investment strategist at a major hedge fund. Compile a "Monday Morning Playbook" PDF report for the upcoming week (${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d')}).
        Use the following data points from last week to inform your analysis:
        - Top Triggered Alerts: ${alertSummary}
        - Top Winning Ideas: ${ideaSummary}
        - Sector Sentiment Flow: ${sectorSummary}
        Structure the report with the following sections using HTML (with clean, modern TailwindCSS classes):
        1. **Executive Summary**: High-level overview.
        2. **Last Week's Recap**: Analysis of what worked and what moved.
        3. **Sector Rotation Map**: Summary of sector sentiment flows.
        4. **Key Macro Drivers**: Bulleted list of critical events.
        5. **Tactical Outlook & Actionable Ideas**: 2-3 new ideas.
      `;

      const generatedHtmlBody = await InvokeLLM({ prompt });
      
      const fullHtml = `
        <html>
          <head>
            <title>Vireon Weekly Playbook - ${format(new Date(), 'MMMM d, yyyy')}</title>
            <script src="https://cdn.tailwindcss.com"></script>
          </head>
          <body class="font-sans p-8 bg-gray-50 text-gray-800">
            <header class="flex justify-between items-center border-b pb-4 mb-6">
              <div>
                <h1 class="text-3xl font-bold text-gray-900">Vireon Weekly Playbook</h1>
                <p class="text-gray-600">For the week of ${format(weekStart, 'MMMM d, yyyy')}</p>
              </div>
              <div class="text-right">
                <p class="text-sm text-gray-500">Proprietary & Confidential</p>
              </div>
            </header>
            <main>${generatedHtmlBody}</main>
          </body>
        </html>
      `;
      
      setReportHtml(fullHtml);

    } catch(e) {
      console.error(e);
      setError("Failed to generate playbook. The AI model may be busy. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700/60 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-gray-100 font-bold">
            <FileText className="w-6 h-6 text-blue-400" />
            Monday Morning Playbook
        </CardTitle>
        <CardDescription className="text-gray-300 pt-1">
            Your automated weekly summary of market signals, themes, and tactical outlook.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center text-center p-6 bg-gray-900/50 rounded-lg border border-gray-700/50">
          <Sparkles className="w-12 h-12 text-purple-400 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Ready for the Week Ahead?</h3>
          <p className="text-gray-300 max-w-lg mx-auto mb-6">
            Generate a comprehensive, AI-powered report summarizing last week's key market drivers and providing a tactical outlook for the week to come.
          </p>
          <Button onClick={generatePlaybook} disabled={isLoading} size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold border-0 shadow-lg">
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Compiling Report...' : 'Generate This Week\'s Playbook'}
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mt-4 bg-red-900/30 border-red-500/50 text-red-300">
            <AlertTitle>Generation Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {reportHtml && !isLoading && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-center mb-4 text-white">Your Playbook is Ready!</h3>
            <div className="border border-gray-700 rounded-lg h-96 bg-white">
              <iframe
                srcDoc={reportHtml}
                className="w-full h-full"
                title="Playbook Preview"
              />
            </div>
            <div className="text-center mt-4">
              <Button onClick={exportToPdf} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
                <Download className="w-4 h-4 mr-2" />
                Download Full PDF Report
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}