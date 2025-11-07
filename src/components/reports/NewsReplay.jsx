import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { InvokeLLM } from '@/integrations/Core';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Pause, Rewind, FastForward, BarChart3, TrendingUp, TrendingDown, Volume2, Clock, Target, RefreshCw } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function NewsReplay() {
  const [timeframe, setTimeframe] = useState("1D");
  const [selectedTicker, setSelectedTicker] = useState("SPY");
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [replayData, setReplayData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [turningPoints, setTurningPoints] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [availableTickers, setAvailableTickers] = useState(["SPY", "QQQ", "AAPL", "TSLA", "NVDA"]);

  useEffect(() => {
    loadReplayData();
  }, [timeframe, selectedTicker]);

  useEffect(() => {
    let interval;
    if (isPlaying && currentTime < replayData.length - 1) {
      interval = setInterval(() => {
        setCurrentTime(prev => Math.min(prev + 1, replayData.length - 1));
      }, 1000 / playbackSpeed);
    } else if (currentTime >= replayData.length - 1) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTime, replayData.length, playbackSpeed]);

  const loadReplayData = async () => {
    setIsLoading(true);
    const hours = { "1D": 24, "3D": 72, "5D": 120, "1W": 168 }[timeframe] || 24;
    try {
      const response = await InvokeLLM({
        prompt: `Generate a realistic hour-by-hour market replay for ${selectedTicker} over ${timeframe}. Include timestamp, price, news, sentiment, and 3-5 major turning points with explanations. Generate ${Math.min(hours, 48)} time points.`,
        response_json_schema: { type: "object", properties: { replay_events: { type: "array", items: {type:"object"} }, chart_data: { type: "array", items: {type:"object"} }, turning_points: { type: "array", items: {type:"object"} } } }
      });
      setReplayData(response.replay_events || []);
      setChartData(response.chart_data || []);
      setTurningPoints(response.turning_points || []);
      setCurrentTime(0);
    } catch (error) { console.error("Error loading replay data:", error); }
    setIsLoading(false);
  };
  
  const currentEvent = replayData[currentTime];
  const progressPercentage = replayData.length > 0 ? (currentTime / (replayData.length - 1)) * 100 : 0;

  if (isLoading && replayData.length === 0) return <div className="space-y-6"><div className="animate-pulse space-y-4"><div className="h-48 bg-gray-700 rounded-lg"></div><div className="h-64 bg-gray-700 rounded-lg"></div></div></div>;

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700/60 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-gray-100 font-bold"><Rewind className="w-6 h-6 text-blue-400" />Market News Replay</CardTitle>
          <CardDescription className="text-gray-300 pt-1">Replay historical market news and events to understand price action.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[ {label: "Timeframe", value: timeframe, onValueChange: setTimeframe, options: ["1D","3D","5D","1W"]}, {label: "Ticker", value: selectedTicker, onValueChange: setSelectedTicker, options: availableTickers}, {label: "Speed", value: playbackSpeed.toString(), onValueChange: v=>setPlaybackSpeed(parseFloat(v)), options: ["0.5","1","2","4"], suffix: "x"} ].map(item => (
                <div key={item.label} className="space-y-1"><label className="text-sm font-medium text-gray-300">{item.label}</label><Select value={item.value} onValueChange={item.onValueChange}><SelectTrigger className="bg-gray-700 border-gray-600 text-white"><SelectValue /></SelectTrigger><SelectContent>{item.options.map(opt => <SelectItem key={opt} value={opt}>${opt}{item.suffix||''}</SelectItem>)}</SelectContent></Select></div>
            ))}
            <div className="flex items-end"><Button variant="outline" onClick={loadReplayData} disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 border-0 text-white font-semibold"><RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />Reload</Button></div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-4">
                {[ {Icon: Rewind, onClick: () => setCurrentTime(Math.max(0, currentTime - 10))}, {Icon: isPlaying ? Pause : Play, onClick: () => setIsPlaying(!isPlaying)}, {Icon: FastForward, onClick: () => setCurrentTime(Math.min(replayData.length - 1, currentTime + 10))} ].map((btn, i)=><Button key={i} variant="outline" size="icon" onClick={btn.onClick} className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"><btn.Icon className="w-5 h-5"/></Button>)}
                <Slider value={[currentTime]} onValueChange={([value]) => setCurrentTime(value)} max={Math.max(0, replayData.length - 1)} step={1} className="w-full" />
                <span className="text-sm font-mono text-gray-300">{currentTime + 1}/{replayData.length}</span>
            </div>
            <div className="bg-gray-700 rounded-full h-1.5"><div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${progressPercentage}%` }} /></div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="timeline" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800 border-gray-700 rounded-lg p-1">
            <TabsTrigger value="timeline" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300">Timeline View</TabsTrigger>
            <TabsTrigger value="chart" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300">Chart Analysis</TabsTrigger>
            <TabsTrigger value="turning-points" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300">Turning Points</TabsTrigger>
        </TabsList>
        <TabsContent value="timeline">
          {currentEvent ? (
            <Card className="bg-gray-800 border-gray-700/60">
              <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2 text-white"><Clock className="w-5 h-5" />{currentEvent.timestamp}</CardTitle>
                    <Badge className={currentEvent.sentiment === 'Bullish' ? 'bg-green-600' : 'bg-red-600'}>{currentEvent.sentiment}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[ {label: "Price", value: `$${currentEvent.price?.toFixed(2)}`}, {label: "Change", value: `${currentEvent.price_change?.toFixed(2)}%`, color: currentEvent.price_change > 0 ? 'text-green-400' : 'text-red-400'}, {label: "Volume Ratio", value: `${currentEvent.volume_ratio?.toFixed(1)}x`}, {label: "Sentiment Score", value: currentEvent.sentiment_score} ].map(item=><div key={item.label} className="bg-gray-700/50 p-3 rounded-lg"><h4 className="text-sm font-medium text-gray-400 mb-1">{item.label}</h4><p className={`text-2xl font-bold text-white ${item.color||''}`}>{item.value}</p></div>)}
                  </div>
                  <div className="p-4 bg-gray-700/50 rounded-lg"><h4 className="font-semibold mb-2 flex items-center gap-2 text-white"><Volume2 className="w-4 h-4" />News</h4><p className="text-gray-300">{currentEvent.news_headline}</p></div>
                  {currentEvent.is_turning_point && <div className="p-4 bg-yellow-900/30 rounded-lg border border-yellow-500/50"><h4 className="font-semibold mb-2 flex items-center gap-2 text-yellow-300"><Target className="w-4 h-4" />Key Turning Point</h4><p className="text-yellow-200">{currentEvent.gpt_callout}</p></div>}
              </CardContent>
            </Card>
          ) : (<Card className="bg-gray-800 border-gray-700/60 text-center py-12"><CardContent><Clock className="w-12 h-12 mx-auto mb-4 text-gray-500" /><h3 className="text-lg font-semibold text-white">No Data Available</h3><p className="text-gray-400">Select a timeframe and ticker to start.</p></CardContent></Card>)}
        </TabsContent>
        <TabsContent value="chart">
            <Card className="bg-gray-800 border-gray-700/60"><CardHeader><CardTitle className="text-white flex items-center gap-2"><BarChart3 className="w-5 h-5"/>Price & Sentiment Chart</CardTitle></CardHeader><CardContent>{chartData.length > 0 ? <ResponsiveContainer width="100%" height={400}><LineChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="#4A5568"/><XAxis dataKey="time" stroke="#A0AEC0" /><YAxis yAxisId="price" orientation="left" stroke="#A0AEC0" /><YAxis yAxisId="sentiment" orientation="right" stroke="#A0AEC0" /><Tooltip /><Line yAxisId="price" type="monotone" dataKey="price" stroke="#4299E1" strokeWidth={2} name="Price" /><Line yAxisId="sentiment" type="monotone" dataKey="sentiment" stroke="#48BB78" strokeWidth={2} name="Sentiment" />{turningPoints.map((p,i) => <ReferenceLine key={i} x={chartData[p.time_index]?.time} stroke="red" strokeDasharray="4 4" />)}</LineChart></ResponsiveContainer> : <div className="text-center py-12 text-gray-500"><BarChart3 className="w-12 h-12 mx-auto mb-4" /><p>Chart data will appear after loading replay</p></div>}</CardContent></Card>
        </TabsContent>
        <TabsContent value="turning-points">
            <Card className="bg-gray-800 border-gray-700/60"><CardHeader><CardTitle className="text-white flex items-center gap-2"><Target className="w-5 h-5"/>Key Turning Points</CardTitle></CardHeader><CardContent>{turningPoints.length > 0 ? <div className="space-y-4">{turningPoints.map((p,i) => <Card key={i} className="p-4 bg-gray-700/50"><div className="flex justify-between items-start mb-2"><h4 className="font-semibold text-white">Turning Point #{i+1}</h4><Badge variant="outline" className={p.impact === 'High' ? 'border-red-400 text-red-300' : 'border-yellow-400 text-yellow-300'}>{p.impact} Impact</Badge></div><p className="text-gray-300">{p.description}</p><Button variant="link" size="sm" className="p-0 h-auto mt-2 text-blue-400" onClick={() => setCurrentTime(p.time_index)}>Jump to Point</Button></Card>)}</div> : <div className="text-center py-12 text-gray-500"><Target className="w-12 h-12 mx-auto mb-4" /><h3 className="text-lg font-semibold text-white">No Turning Points Detected</h3></div>}</CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}