
import React, { useState, useEffect } from 'react';
import { InvokeLLM } from '@/integrations/Core';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart3, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { differenceInHours } from 'date-fns';
import { CachedMarketData } from '@/entities/CachedMarketData';

const safeText = (value, defaultText = "") => {
  if (value === null || value === undefined) return defaultText;
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    if (value.summary && typeof value.summary === 'string') return value.summary;
    if (value.text && typeof value.text === 'string') return value.text;
    if (value.content && typeof value.content === 'string') return value.content;
    if (value.response && typeof value.response === 'string') return value.response;
    if (value.rationale && typeof value.rationale === 'string') return value.rationale;
    if (value.insight && typeof value.insight === 'string') return value.insight;
    return JSON.stringify(value);
  }
  return String(value);
};

export default function MacroView() {
  const [summary, setSummary] = useState('');
  const [keyDrivers, setKeyDrivers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    setIsLoading(true);
    try {
      // Cache for 4 hours
      const cached = await CachedMarketData.filter({ cacheKey: 'macro_view' });
      if (cached.length > 0 && differenceInHours(new Date(), new Date(cached[0].lastUpdated)) < 4) {
          setSummary(cached[0].data.summary || ''); // Added default ''
          setKeyDrivers(cached[0].data.key_drivers || []); // Added default []
          setIsLoading(false);
          return;
      }

      const prompt = `Provide a concise, 2-sentence summary of the current global macro environment for an institutional investor. Also list the top 3 key drivers (e.g., "Fed Policy", "Inflation Data", "Geopolitical Tensions").`;
      const response = await InvokeLLM({
        prompt: prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            summary: { type: 'string' },
            key_drivers: { type: 'array', items: { type: 'string' } }
          },
          required: ['summary', 'key_drivers']
        }
      });

      if (response) {
        setSummary(safeText(response.summary));
        setKeyDrivers(response.key_drivers || []);
        
        // Update Cache - wrap data in object
        const cachePayload = { summary: safeText(response.summary), key_drivers: response.key_drivers || [] };
        await CachedMarketData.create({
            cacheKey: 'macro_view',
            data: cachePayload,
            lastUpdated: new Date().toISOString()
        }).catch(async (error) => {
            console.warn("Could not create new cache entry, attempting to update existing:", error);
            const existing = await CachedMarketData.filter({ cacheKey: 'macro_view' });
            if(existing.length > 0) {
                await CachedMarketData.update(existing[0].id, { data: cachePayload, lastUpdated: new Date().toISOString() });
            } else {
                console.error("Failed to create and also failed to find existing cache entry for update.");
            }
        });

      } else {
        throw new Error("Invalid AI response");
      }
    } catch (error) {
      console.error('Error loading macro summary:', error);
      setSummary('Global markets are navigating evolving central bank policies amid persistent inflation concerns. Geopolitical tensions continue to influence commodity prices and risk sentiment.');
      setKeyDrivers(['Fed Policy', 'Inflation Data', 'Geopolitical Tensions']);
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
          <Skeleton className="h-16 w-full mb-4 bg-gray-200 dark:bg-gray-600 rounded-lg" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-24 bg-gray-200 dark:bg-gray-600 rounded-full" />
            <Skeleton className="h-8 w-28 bg-gray-200 dark:bg-gray-600 rounded-full" />
            <Skeleton className="h-8 w-32 bg-gray-200 dark:bg-gray-600 rounded-full" />
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
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <BarChart3 className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">Macro View</CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={loadSummary} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg">
          <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed font-medium">{summary}</p>
        </div>
        <div>
          <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wide">Key Market Drivers</h4>
          <div className="flex flex-wrap gap-2">
            {keyDrivers.map((driver, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-700 font-medium px-3 py-1"
              >
                {driver}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
