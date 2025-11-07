
import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { InvokeLLM } from '@/integrations/Core';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  Download,
  RefreshCw,
  Mic,
  BarChart3,
  AlertTriangle,
  Target
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Helper function to robustly extract a string from a potentially nested object
const safeGetString = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    // Prioritize specific keys
    if (value.summary && typeof value.summary === "string") return value.summary;
    if (value.gpt_summary && typeof value.gpt_summary === "string") return value.gpt_summary;
    if (value.historical_context && typeof value.historical_context === "string") return value.historical_context;
    if (value.text && typeof value.text === "string") return value.text;
    if (value.response && typeof value.response === "string") return value.response;
    // Fallback to JSON stringify for other objects
    try {
      return JSON.stringify(value);
    } catch (e) {
      return "[Object]"; // Fallback if stringify fails
    }
  }
  return String(value); // Convert other primitive types to string
};

export default function EventTracker() {
  const [eventRecaps, setEventRecaps] = useState([]);
  const [selectedRecap, setSelectedRecap] = useState(null);
  const [eventFilter, setEventFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    loadEventRecaps();
  }, []);

  const loadEventRecaps = async () => {
    setIsLoading(true);
    try {
      const recaps = await base44.entities.EventRecap.list('-event_date', 20);
      setEventRecaps(recaps);
      if (recaps.length > 0) {
        setSelectedRecap(recaps[0]);
      }
    } catch (error) {
      console.error('Error loading event recaps:', error);
    }
    setIsLoading(false);
  };

  const generateEventRecap = async () => {
    setIsGenerating(true);
    try {
      // Simulate generating a recap for a recent major event
      const response = await InvokeLLM({
        prompt: `Generate a comprehensive recap for a major recent economic event. Create realistic data for:
        
        1. A significant Fed meeting, CPI release, or earnings announcement
        2. Actual vs consensus readings with surprise factor
        3. Immediate market reactions across asset classes
        4. Key quotes from officials or earnings calls  
        5. Sentiment shift analysis
        6. Historical context
        
        Make this realistic and comprehensive as if covering a real major market event.`,
        response_json_schema: {
          type: "object",
          properties: {
            event_type: { type: "string", enum: ["Fed Meeting", "CPI Release", "NFP Release", "Earnings", "GDP Release", "Central Bank Meeting", "Geopolitical Event"] },
            event_title: { type: "string" },
            actual_reading: { type: "string" },
            consensus_estimate: { type: "string" },
            surprise_factor: { type: "number" },
            gpt_summary: { type: "string" },
            key_quotes: { type: "array", items: { type: "string" } },
            market_reaction: {
              type: "object",
              properties: {
                spx_move: { type: "number" },
                ten_year_yield: { type: "number" },
                dxy_move: { type: "number" },
                oil_move: { type: "number" },
                gold_move: { type: "number" },
                vix_move: { type: "number" },
                btc_move: { type: "number" }
              }
            },
            sentiment_shift: { type: "string", enum: ["Significantly Hawkish", "Hawkish", "Neutral", "Dovish", "Significantly Dovish"] },
            affected_sectors: { type: "array", items: { type: "string" } },
            historical_context: { type: "string" }
          }
        }
      });

      // Safely extract the summary text
      const summaryText = safeGetString(response.gpt_summary);
      const historicalContextText = safeGetString(response.historical_context);

      const eventData = {
        ...response,
        gpt_summary: summaryText, // Use the validated summary
        historical_context: historicalContextText, // Use the validated context
        event_date: new Date().toISOString()
      };

      const createdRecap = await base44.entities.EventRecap.create(eventData);
      await loadEventRecaps();
      setSelectedRecap(createdRecap);
    } catch (error) {
      console.error('Error generating event recap:', error);
    }
    setIsGenerating(false);
  };

  const exportRecap = () => {
    if (!selectedRecap) return;

    const recapContent = `
VIREON POST-EVENT RECAP
${selectedRecap.event_title}
${format(new Date(selectedRecap.event_date), 'MMMM d, yyyy - h:mm a')}

EVENT SUMMARY:
${safeGetString(selectedRecap.gpt_summary)}

KEY DATA:
Actual: ${selectedRecap.actual_reading}
Consensus: ${selectedRecap.consensus_estimate}
Surprise Factor: ${selectedRecap.surprise_factor}

MARKET REACTION:
SPX: ${selectedRecap.market_reaction?.spx_move > 0 ? '+' : ''}${selectedRecap.market_reaction?.spx_move}%
10Y Yield: ${selectedRecap.market_reaction?.ten_year_yield > 0 ? '+' : ''}${selectedRecap.market_reaction?.ten_year_yield}bp
DXY: ${selectedRecap.market_reaction?.dxy_move > 0 ? '+' : ''}${selectedRecap.market_reaction?.dxy_move}%
Oil: ${selectedRecap.market_reaction?.oil_move > 0 ? '+' : ''}${selectedRecap.market_reaction?.oil_move}%
Gold: ${selectedRecap.market_reaction?.gold_move > 0 ? '+' : ''}${selectedRecap.market_reaction?.gold_move}%
VIX: ${selectedRecap.market_reaction?.vix_move > 0 ? '+' : ''}${selectedRecap.market_reaction?.vix_move}%
BTC: ${selectedRecap.market_reaction?.btc_move > 0 ? '+' : ''}${selectedRecap.market_reaction?.btc_move}%

KEY QUOTES:
${selectedRecap.key_quotes?.map(quote => `"${safeGetString(quote)}"`).join('\n') || 'None'}

SENTIMENT SHIFT: ${selectedRecap.sentiment_shift}

AFFECTED SECTORS: ${selectedRecap.affected_sectors?.join(', ') || 'None'}

HISTORICAL CONTEXT:
${safeGetString(selectedRecap.historical_context)}

Generated by Vireon Financial Intelligence Platform
    `.trim();

    const blob = new Blob([recapContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Vireon_Event_Recap_${format(new Date(selectedRecap.event_date), 'yyyy-MM-dd')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredRecaps = eventFilter === "All" 
    ? eventRecaps 
    : eventRecaps.filter(recap => recap.event_type === eventFilter);

  const getReactionColor = (value) => {
    if (value > 0) return "text-green-400";
    if (value < 0) return "text-red-400";
    return "text-gray-400";
  };

  const getReactionIcon = (value) => {
    if (value > 0) return <TrendingUp className="w-4 h-4" />;
    if (value < 0) return <TrendingDown className="w-4 h-4" />;
    return <div className="w-4 h-4 bg-gray-500 rounded-full"></div>;
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case "Significantly Hawkish":
        return "bg-red-900/30 text-red-300 border-red-800";
      case "Hawkish":
        return "bg-orange-900/30 text-orange-300 border-orange-800";
      case "Neutral":
        return "bg-gray-700 text-gray-300 border-gray-600";
      case "Dovish":
        return "bg-blue-900/30 text-blue-300 border-blue-800";
      case "Significantly Dovish":
        return "bg-green-900/30 text-green-300 border-green-800";
      default:
        return "bg-gray-700 text-gray-300 border-gray-600";
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-8 w-64 bg-gray-700" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-96 bg-gray-700" />
          <div className="lg:col-span-2">
            <Skeleton className="h-96 bg-gray-700" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-100 mb-2">Post-Event Recap Engine</h1>
          <p className="text-gray-400">
            AI-powered analysis of major scheduled events and market reactions
          </p>
        </div>
        
        <div className="flex gap-3">
          <Select value={eventFilter} onValueChange={setEventFilter}>
            <SelectTrigger className="w-48 bg-gray-800 border-gray-600 text-gray-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="All" className="text-gray-100">All Events</SelectItem>
              <SelectItem value="Fed Meeting" className="text-gray-100">Fed Meetings</SelectItem>
              <SelectItem value="CPI Release" className="text-gray-100">CPI Releases</SelectItem>
              <SelectItem value="Earnings" className="text-gray-100">Earnings</SelectItem>
              <SelectItem value="NFP Release" className="text-gray-100">Jobs Reports</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={loadEventRecaps} className="bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          
          <Button 
            onClick={generateEventRecap}
            disabled={isGenerating}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isGenerating ? (
              <RefreshCw className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Target className="w-4 h-4 mr-2" />
            )}
            Generate Recap
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Event List */}
        <Card className="bg-gray-800/50 border border-gray-700/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-100">
              <Calendar className="w-5 h-5 text-blue-400" />
              Recent Events
              <Badge variant="outline" className="bg-gray-700 text-gray-300 border-gray-600">
                {filteredRecaps.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredRecaps.map(recap => (
                <div
                  key={recap.id}
                  onClick={() => setSelectedRecap(recap)}
                  className={`p-3 border rounded-lg cursor-pointer transition-all hover:bg-gray-700/50 ${
                    selectedRecap?.id === recap.id ? 'border-blue-500 bg-blue-900/30' : 'border-gray-700'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-sm leading-tight text-gray-100">
                      {recap.event_title}
                    </h4>
                    <Badge 
                      variant="outline" 
                      className={getSentimentColor(recap.sentiment_shift)}
                    >
                      {recap.sentiment_shift}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{recap.event_type}</span>
                    <span>
                      {formatDistanceToNow(new Date(recap.event_date), { addSuffix: true })}
                    </span>
                  </div>

                  {recap.surprise_factor && (
                    <div className="mt-2">
                      <Badge variant="outline" className="text-xs text-gray-300 border-gray-600">
                        Surprise: {recap.surprise_factor > 0 ? '+' : ''}{recap.surprise_factor}
                      </Badge>
                    </div>
                  )}
                </div>
              ))}
              
              {filteredRecaps.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No events found</p>
                  <p className="text-xs">Generate a recap to get started</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Event Detail */}
        <div className="lg:col-span-2 space-y-6">
          {selectedRecap ? (
            <>
              {/* Event Header */}
              <Card className="bg-gray-800/50 border border-gray-700/60">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl mb-2 text-gray-100">
                        {selectedRecap.event_title}
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(selectedRecap.event_date), 'MMMM d, yyyy')}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {format(new Date(selectedRecap.event_date), 'h:mm a')}
                        </div>
                        <Badge className={getSentimentColor(selectedRecap.sentiment_shift)}>
                          {selectedRecap.sentiment_shift}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700">
                        <Mic className="w-4 h-4 mr-2" />
                        Audio
                      </Button>
                      <Button variant="outline" size="sm" onClick={exportRecap} className="bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-gray-300 leading-relaxed text-lg">
                    {safeGetString(selectedRecap.gpt_summary)}
                  </p>
                </CardContent>
              </Card>

              {/* Data & Surprise */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-gray-800/50 border border-gray-700/60">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-100">Event Data</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Actual Reading</div>
                      <div className="text-xl font-bold text-gray-100">
                        {selectedRecap.actual_reading}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Consensus Estimate</div>
                      <div className="text-lg text-gray-300">
                        {selectedRecap.consensus_estimate}
                      </div>
                    </div>
                    
                    {selectedRecap.surprise_factor && (
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Surprise Factor</div>
                        <div className={`text-lg font-semibold ${getReactionColor(selectedRecap.surprise_factor)}`}>
                          {selectedRecap.surprise_factor > 0 ? '+' : ''}{selectedRecap.surprise_factor}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/50 border border-gray-700/60">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-100">Market Impact</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedRecap.market_reaction && (
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(selectedRecap.market_reaction).map(([asset, move]) => {
                          const assetNames = {
                            spx_move: 'SPX',
                            ten_year_yield: '10Y Yield',
                            dxy_move: 'DXY',
                            oil_move: 'Oil',
                            gold_move: 'Gold',
                            vix_move: 'VIX',
                            btc_move: 'BTC'
                          };
                          
                          return (
                            <div key={asset} className="flex items-center justify-between">
                              <span className="text-sm text-gray-400">
                                {assetNames[asset]}
                              </span>
                              <div className={`flex items-center gap-1 font-semibold ${getReactionColor(move)}`}>
                                {getReactionIcon(move)}
                                <span>
                                  {move > 0 ? '+' : ''}{move}
                                  {asset === 'ten_year_yield' ? 'bp' : '%'}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Key Quotes */}
              {selectedRecap.key_quotes && selectedRecap.key_quotes.length > 0 && (
                <Card className="bg-gray-800/50 border border-gray-700/60">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-100">Key Quotes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedRecap.key_quotes.map((quote, index) => (
                        <blockquote 
                          key={index}
                          className="border-l-4 border-blue-400 pl-4 italic text-gray-300"
                        >
                          "{safeGetString(quote)}"
                        </blockquote>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Affected Sectors & Historical Context */}
              <div className="grid md:grid-cols-2 gap-6">
                {selectedRecap.affected_sectors && selectedRecap.affected_sectors.length > 0 && (
                  <Card className="bg-gray-800/50 border border-gray-700/60">
                    <CardHeader>
                      <CardTitle className="text-lg text-gray-100">Affected Sectors</CardTitle>
                  </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedRecap.affected_sectors.map((sector, index) => (
                          <Badge key={index} variant="outline" className="bg-gray-700 text-gray-300 border-gray-600">
                            {sector}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {selectedRecap.historical_context && (
                  <Card className="bg-gray-800/50 border border-gray-700/60">
                    <CardHeader>
                      <CardTitle className="text-lg text-gray-100">Historical Context</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {safeGetString(selectedRecap.historical_context)}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </>
          ) : (
            <Card className="bg-gray-800/50 border border-gray-700/60">
              <CardContent className="text-center py-12">
                <Target className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-200 mb-2">Select an Event</h3>
                <p className="text-gray-400">
                  Choose an event from the list to view the detailed recap and analysis.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
