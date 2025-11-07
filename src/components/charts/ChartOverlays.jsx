import React, { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, Calendar, DollarSign, Target, Sparkles, X, Settings } from 'lucide-react';
import { format, parseISO, differenceInDays } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Mock data for events
const mockEvents = {
  earnings: [{ date: '2024-01-25', type: 'earnings', result: 'beat', description: 'Q4 EPS $2.18 vs $2.10 est' }],
  dividends: [{ date: '2024-02-15', type: 'dividend', amount: '$0.24', description: 'Quarterly dividend payment' }],
  macro: [{ date: '2024-01-31', type: 'fomc', decision: 'hold', description: 'Fed holds rates at 5.25-5.50%' }],
  upgrades: [{ date: '2024-01-15', type: 'upgrade', firm: 'Goldman', action: 'Buy', price: '$195', description: 'Raised to Buy, PT $195' }],
};

const EventMarker = ({ event, x, theme, isSmall }) => {
  const getEventStyle = (type, result) => {
    switch (type) {
      case 'earnings': return result === 'beat' ? { bg: 'bg-green-500', border: 'border-green-400' } : { bg: 'bg-red-500', border: 'border-red-400' };
      case 'dividend': return { bg: 'bg-blue-500', border: 'border-blue-400' };
      case 'fomc': return { bg: 'bg-purple-500', border: 'border-purple-400' };
      case 'upgrade': return { bg: 'bg-green-500', border: 'border-green-400' };
      default: return { bg: 'bg-gray-500', border: 'border-gray-400' };
    }
  };
  const style = getEventStyle(event.type, event.result || event.action?.toLowerCase());

  return (
    <div className="absolute group" style={{ left: `${x}px`, top: '10px', transform: 'translateX(-50%)' }}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`rounded-full ${style.bg} ${style.border} border-2 cursor-help transition-transform group-hover:scale-125 ${isSmall ? 'w-2 h-2' : 'w-2.5 h-2.5'}`} />
        </TooltipTrigger>
        <TooltipContent className={`p-2 rounded-lg shadow-xl ${theme === 'dark' ? 'bg-[#1A1D29] border-white/20' : 'bg-white'}`}>
          <p className="text-xs font-semibold">{format(parseISO(event.date), 'MMM d')}: <span className="font-normal">{event.description}</span></p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

const ExplainMoveTooltip = ({ isVisible, onClose, moveData, theme }) => {
  if (!isVisible || !moveData) return null;
  return (
    <div className={`absolute z-20 rounded-xl p-4 shadow-2xl min-w-[250px] max-w-[280px] ${theme === 'dark' ? 'bg-gradient-to-br from-[#1A1D29]/95 to-[#12141C]/95 border border-white/10' : 'bg-gradient-to-br from-white/95 to-white/90 border-black/[0.08]'} backdrop-blur-xl`} style={{ left: `${moveData.x}px`, top: `${moveData.y}px`, transform: 'translate(-50%, -100%) translateY(-15px)' }}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 font-semibold text-sm ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}"><Sparkles className="w-4 h-4" />AI Analysis</div>
        <button onClick={onClose} className={`p-1 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}><X className="w-3.5 h-3.5" /></button>
      </div>
      <div className="space-y-2">
        <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
          <span className="font-semibold">Largest Move: </span><span className={moveData.change > 0 ? 'text-green-400' : 'text-red-400'}>{moveData.change > 0 ? '+' : ''}{moveData.change.toFixed(2)}%</span>
          <span className="ml-2 text-xs opacity-75"> on {format(parseISO(moveData.date), 'MMM d')}</span>
        </div>
        <div className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{moveData.explanation}</div>
      </div>
    </div>
  );
};

export default function ChartOverlays({ chartData, theme, containerWidth }) {
  const [activeOverlays, setActiveOverlays] = useState({ earnings: true, dividends: false, macro: true, upgrades: true });
  const [explainTooltip, setExplainTooltip] = useState(null);
  const isSmall = containerWidth < 250;

  const eventPositions = useMemo(() => {
    if (!chartData || chartData.length === 0 || !containerWidth) return [];
    const positions = [];
    const startDate = parseISO(chartData[0].date);
    const endDate = parseISO(chartData[chartData.length - 1].date);
    const dateRange = Math.max(1, differenceInDays(endDate, startDate));
    Object.entries(mockEvents).forEach(([category, events]) => {
      if (activeOverlays[category]) {
        events.forEach(event => {
          const eventDate = parseISO(event.date);
          if (eventDate >= startDate && eventDate <= endDate) {
            const x = (differenceInDays(eventDate, startDate) / dateRange) * containerWidth;
            positions.push({ ...event, x });
          }
        });
      }
    });
    return positions;
  }, [chartData, activeOverlays, containerWidth]);

  const handleExplainMove = (event) => {
    if (!chartData || chartData.length < 2) return;
    let maxMove = 0, maxMoveIndex = 1;
    for (let i = 1; i < chartData.length; i++) {
      const change = ((chartData[i].close - chartData[i - 1].close) / chartData[i - 1].close) * 100;
      if (Math.abs(change) > Math.abs(maxMove)) {
        maxMove = change;
        maxMoveIndex = i;
      }
    }
    const explanation = maxMove > 0 ? "Positive earnings surprise and sector momentum likely drove this upward move." : "Broader market weakness following macro data likely caused this drop.";
    setExplainTooltip({ x: containerWidth / 2, y: 30, date: chartData[maxMoveIndex].date, change: maxMove, explanation });
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div className="absolute top-1 right-1 z-10 flex items-center gap-1">
        <Popover>
          <PopoverTrigger asChild>
            <button className={`p-1.5 rounded-md transition-colors ${theme === 'dark' ? 'text-gray-400 hover:bg-white/10' : 'text-gray-500 hover:bg-black/5'}`}><Settings className="w-3.5 h-3.5" /></button>
          </PopoverTrigger>
          <PopoverContent className={`w-48 p-3 shadow-xl rounded-xl ${theme === 'dark' ? 'bg-[#1A1D29] border-white/20' : 'bg-white'}`} side="bottom" align="end">
            <div className="space-y-3">
              <h4 className="text-xs font-semibold">Chart Overlays</h4>
              {Object.keys(activeOverlays).map(key => (
                <div key={key} className="flex items-center justify-between">
                  <label htmlFor={`overlay-${key}`} className="text-sm cursor-pointer">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                  <Checkbox id={`overlay-${key}`} checked={activeOverlays[key]} onCheckedChange={checked => setActiveOverlays(p => ({ ...p, [key]: !!checked }))} />
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        <Tooltip>
          <TooltipTrigger asChild>
            <button onClick={handleExplainMove} className={`p-1.5 rounded-md transition-colors ${theme === 'dark' ? 'text-gray-400 hover:bg-white/10' : 'text-gray-500 hover:bg-black/5'}`}><Sparkles className="w-3.5 h-3.5" /></button>
          </TooltipTrigger>
          <TooltipContent><p>Explain Biggest Move</p></TooltipContent>
        </Tooltip>
      </div>
      <div className="absolute inset-0 pointer-events-none">{eventPositions.map((event, index) => <EventMarker key={`${event.type}-${index}`} event={event} x={event.x} theme={theme} isSmall={isSmall} />)}</div>
      <ExplainMoveTooltip isVisible={!!explainTooltip} onClose={() => setExplainTooltip(null)} moveData={explainTooltip} theme={theme} />
    </TooltipProvider>
  );
}