
import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { InvokeLLM } from '@/integrations/Core';
import { User } from '@/entities/User';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Plus, X, Calendar, Target, AlertTriangle, TrendingUp, Download, RefreshCw, Sparkles, BarChart3, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

export default function WeekendPrep({ weekendPrep, onPrepUpdated }) {
  const [prep, setPrep] = useState({
    prep_date: format(new Date(), 'yyyy-MM-dd'),
    tagged_tickers: [], tagged_themes: [], macro_risks: [], custom_narratives: [],
    template_type: "Custom", sentiment_analysis: {}, upcoming_events: [],
    conflict_zones: [], ai_outlook: "", is_exported: false, top_risks: []
  });
  const [newTicker, setNewTicker] = useState("");
  const [newTheme, setNewTheme] = useState("");
  const [newRisk, setNewRisk] = useState("");
  const [newNarrative, setNewNarrative] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("Custom");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadData();
  }, [weekendPrep]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const userData = await User.me();
      setUser(userData);
      if (weekendPrep) {
        setPrep({ ...prep, ...weekendPrep, top_risks: weekendPrep.top_risks || [] });
        setSelectedTemplate(weekendPrep.template_type || "Custom");
      }
    } catch (error) { console.error("Error loading prep data:", error); }
    setIsLoading(false);
  };

  const applyTemplate = (templateType) => {
    let templateData = { ...prep, template_type: templateType, tagged_tickers: [], tagged_themes: [], macro_risks: [], custom_narratives: [] };
    switch (templateType) {
      case "Macro Prep":
        templateData.macro_risks = ["Fed Policy", "Inflation", "Employment", "GDP", "Geopolitics"];
        templateData.custom_narratives = ["Fed pivot expectations", "Yield curve dynamics"];
        break;
      case "Tech Setup":
        templateData.tagged_tickers = ["AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "TSLA"];
        templateData.tagged_themes = ["AI Revolution", "Cloud Computing", "Semiconductor Cycle"];
        break;
    }
    setPrep(templateData);
    setSelectedTemplate(templateType);
  };
  
  const addItem = (category, value) => {
    if (!value.trim()) return;
    setPrep(prev => ({ ...prev, [category]: [...(prev[category] || []), value.trim()] }));
    if (category === 'tagged_tickers') setNewTicker("");
    if (category === 'tagged_themes') setNewTheme("");
    if (category === 'macro_risks') setNewRisk("");
    if (category === 'custom_narratives') setNewNarrative("");
  };

  const removeItem = (category, index) => {
    setPrep(prev => ({ ...prev, [category]: (prev[category] || []).filter((_, i) => i !== index) }));
  };

  const generatePrepAnalysis = async () => {
    setIsGenerating(true);
    try {
      const articles = await base44.entities.NewsArticle.list('-published_date', 50);
      const emergingThemes = await base44.entities.EmergingTheme.list('-velocity_score', 10);
      
      const prompt = `You are an analyst preparing a weekend brief. Based on the user's tags and market context, generate a comprehensive analysis including sentiment, upcoming events, conflict zones, weekly outlook, and top risks.
      User Tags: Tickers: ${(prep.tagged_tickers || []).join(', ')}, Themes: ${(prep.tagged_themes || []).join(', ')}, Risks: ${(prep.macro_risks || []).join(', ')}, Narratives: ${(prep.custom_narratives || []).join(', ')}
      Market Context: Recent headlines: ${articles.slice(0, 5).map(a => a.title).join('; ')}. Emerging themes: ${emergingThemes.slice(0, 3).map(t => t.theme_name).join(', ')}.`;
      
      const response = await InvokeLLM({ prompt, response_json_schema: { type: "object", properties: { sentiment_analysis: { type: "object" }, upcoming_events: { type: "array", items: {type: "object"} }, conflict_zones: { type: "array", items: {type: "object"} }, ai_outlook: { type: "string" }, top_risks: { type: "array", items: {type: "string"} } } } });
      const updatedPrep = { ...prep, ...response };

      setPrep(updatedPrep);
      if (prep.id) { await base44.entities.WeekendPrep.update(prep.id, updatedPrep); } 
      else { const created = await base44.entities.WeekendPrep.create(updatedPrep); setPrep(created); }
      onPrepUpdated();
    } catch (error) { console.error("Error generating analysis:", error); }
    setIsGenerating(false);
  };
  
  if (isLoading) return <Skeleton className="h-96 w-full bg-gray-700" />;
  if (!prep) return <div className="text-center py-12 text-gray-400"><p>Loading weekend prep...</p></div>;

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700/60 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-gray-100 font-bold">
              <Calendar className="w-6 h-6 text-blue-400" /> Weekend Prep
            </CardTitle>
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-300">Template:</span>
                <Select value={selectedTemplate} onValueChange={applyTemplate}>
                    <SelectTrigger className="w-48 bg-gray-700 border-gray-600 text-white"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="Custom">Custom</SelectItem><SelectItem value="Macro Prep">Macro</SelectItem><SelectItem value="Tech Setup">Tech</SelectItem></SelectContent>
                </Select>
            </div>
          </div>
          <CardDescription className="text-gray-300 pt-2">Prepare for the week ahead with personalized, AI-driven analysis.</CardDescription>
        </CardHeader>
        <CardContent>
            <Button onClick={generatePrepAnalysis} disabled={isGenerating} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                {isGenerating ? 'Generating Analysis...' : 'Generate AI-Powered Prep'}
            </Button>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="setup" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800 border-gray-700 rounded-lg p-1">
          <TabsTrigger value="setup" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300">Setup & Tagging</TabsTrigger>
          <TabsTrigger value="analysis" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300">Analysis</TabsTrigger>
          <TabsTrigger value="outlook" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300">Weekly Outlook</TabsTrigger>
        </TabsList>

        <TabsContent value="setup">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[{key: 'tagged_tickers', title: 'Tickers to Watch', icon: Target, input: newTicker, setInput: setNewTicker, placeholder: 'e.g., AAPL'},
              {key: 'tagged_themes', title: 'Themes & Narratives', icon: TrendingUp, input: newTheme, setInput: setNewTheme, placeholder: 'e.g., AI Revolution'},
              {key: 'macro_risks', title: 'Macro Risk Factors', icon: AlertTriangle, input: newRisk, setInput: setNewRisk, placeholder: 'e.g., Fed Policy'},
              {key: 'custom_narratives', title: 'Custom Notes', icon: BarChart3, input: newNarrative, setInput: setNewNarrative, placeholder: 'e.g., Guidance trends'}].map(item => (
              <Card key={item.key} className="bg-gray-800 border-gray-700/60">
                <CardHeader><CardTitle className="flex items-center gap-2 text-white font-semibold"><item.icon className="w-5 h-5 text-blue-400" />{item.title}</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2">
                    <Input value={item.input} onChange={(e) => item.setInput(e.target.value)} placeholder={item.placeholder} onKeyPress={(e) => e.key === 'Enter' && addItem(item.key, item.input)} className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400" />
                    <Button onClick={() => addItem(item.key, item.input)} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white"><Plus className="w-4 h-4" /></Button>
                  </div>
                  <div className="flex flex-wrap gap-2 min-h-[40px]">
                    {(prep[item.key] || []).map((val, index) => <Badge key={index} variant="secondary" className="bg-gray-700 text-gray-200 border-gray-600 text-sm">{val}<X className="w-3 h-3 ml-2 cursor-pointer hover:text-red-400" onClick={() => removeItem(item.key, index)} /></Badge>)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="analysis">
          {prep.sentiment_analysis && Object.keys(prep.sentiment_analysis).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(prep.sentiment_analysis).map(([item, analysis]) => (
                <Card key={item} className="bg-gray-800 border-gray-700/60">
                  <CardHeader><CardTitle className="text-white">{item}</CardTitle></CardHeader>
                  <CardContent className="text-gray-300 space-y-1"><p><strong>Sentiment:</strong> {analysis.sentiment}</p><p><strong>Volatility:</strong> {analysis.volatility_outlook}</p></CardContent>
                </Card>
              ))}
            </div>
          ) : (
             <Card className="bg-gray-800 border-gray-700/60 text-center py-12"><CardContent><Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-500" /><h3 className="text-lg font-semibold text-white">No Analysis Generated Yet</h3><p className="text-gray-400">Add items and generate analysis to see results.</p></CardContent></Card>
          )}
        </TabsContent>
        
        <TabsContent value="outlook">
            <Card className="bg-gray-800 border-gray-700/60">
                <CardHeader><CardTitle className="text-white flex items-center gap-2"><Clock className="w-5 h-5"/>AI-Generated Weekly Outlook</CardTitle></CardHeader>
                <CardContent>
                  {prep.ai_outlook ? (
                    <div className="prose prose-invert max-w-none text-gray-300">
                        <p>{prep.ai_outlook}</p>
                        {prep.top_risks && prep.top_risks.length > 0 && <div className="mt-4"><h4>Top Risks:</h4><ul>{prep.top_risks.map((risk,i) => <li key={i}>{risk}</li>)}</ul></div>}
                    </div>
                  ) : (<div className="text-center py-8 text-gray-400"><Clock className="w-12 h-12 mx-auto mb-4 opacity-50" /><h3 className="text-lg font-semibold text-white">Generate analysis to see the weekly outlook.</h3></div>)}
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
