
import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { User } from '@/entities/User';
import { InvokeLLM } from '@/integrations/Core';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Bell,
  Settings,
  RefreshCw,
  Target,
  Activity,
  BarChart3,
  Filter,
  Eye,
  AlertTriangle,
  Volume2,
  Clock,
  Wifi,
  WifiOff,
  Zap
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useMarketStatus } from '../core/MarketStatusProvider'; // New import

import TickerChart from './TickerChart';
import TickerInfoPanel from './TickerInfoPanel';
import PriceAlertDialog from './PriceAlertDialog';
import { getOptimizedMarketData } from '@/functions/getOptimizedMarketData';

export default function WatchlistDashboard() {
  const [watchlist, setWatchlist] = useState(null);
  const [tickerData, setTickerData] = useState({});
  const [updatedTickers, setUpdatedTickers] = useState({});
  const [selectedTicker, setSelectedTicker] = useState(null);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [newTicker, setNewTicker] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('ticker');
  const [viewMode, setViewMode] = useState('detailed');
  const [lastUpdate, setLastUpdate] = useState(null);
  const [errorState, setErrorState] = useState(null);

  const { isMarketOpen } = useMarketStatus(); // Use the market status hook
  const prevTickerData = useRef({});
  const updateIntervalRef = useRef(null);

  useEffect(() => {
    loadWatchlistData();

    // Auto-refresh only when market is open
    if (isMarketOpen) {
      if (updateIntervalRef.current) clearInterval(updateIntervalRef.current);
      updateIntervalRef.current = setInterval(() => loadWatchlistData(true), 15000); // Refresh every 15s
    } else {
      if (updateIntervalRef.current) clearInterval(updateIntervalRef.current);
    }

    return () => {
      if (updateIntervalRef.current) clearInterval(updateIntervalRef.current);
    };
  }, [isMarketOpen]); // Re-run effect when market status changes

  const loadWatchlistData = async (isRefresh = false) => {
    if (!isRefresh) setIsLoading(true);
    setErrorState(null); // Clear previous errors

    try {
      // Step 1: Get user's watchlist from their preferences
      const user = await User.me();
      const preferences = await base44.entities.UserPreference.filter({ created_by: user.email });

      let currentWatchlistTickers = ['SPY', 'QQQ', 'AAPL', 'MSFT', 'NVDA']; // Default tickers
      if (preferences.length > 0 && preferences[0].watchlist_tickers?.length > 0) {
        currentWatchlistTickers = preferences[0].watchlist_tickers;
      } else {
        // Optionally create the preference entry if it doesn't exist
        if (preferences.length === 0) {
          await base44.entities.UserPreference.create({
            created_by: user.email,
            watchlist_tickers: currentWatchlistTickers
          });
        }
      }

      setWatchlist({ name: "My Watchlist", tickers: currentWatchlistTickers });

      // If no tickers, clear data and finish loading
      if (currentWatchlistTickers.length === 0) {
        setTickerData({});
        setSelectedTicker(null);
        if (!isRefresh) setIsLoading(false);
        return;
      }

      // Fetch market data using the optimized function
      const response = await getOptimizedMarketData({
        dataType: 'prices',
        tickers: currentWatchlistTickers.join(',')
      });

      if (response.error) {
        throw new Error(response.error);
      }

      const newTickerDataSet = {};
      if (response.data && response.data.data) {
        response.data.data.forEach(item => {
          const prev = prevTickerData.current[item.symbol];
          newTickerDataSet[item.symbol] = {
            ticker: item.symbol,
            current_price: item.price,
            change: item.change,
            change_percent: item.changePercent,
            volume: item.volume?.toLocaleString() || 'N/A', // Volume from API, formatted
            last_updated: new Date().toISOString(),
            sector: getSectorForTicker(item.symbol),
            bid_price: item.price - (0.01 + Math.random() * 0.02), // Simulate small spread
            ask_price: item.price + (0.01 + Math.random() * 0.02),
            day_high: item.high,
            day_low: item.low,
            previous_close: item.price - item.change,
            is_real_data: !item.isMockData, // True if not mock data from the source
            ai_sentiment_score: (item.changePercent || 0) * 10, // Simple derivation
            volume_ratio: 1, // Placeholder for now, could be derived from average volume later
            alert_count: 0 // Placeholder, actual alerts would come from backend
          };

          // Check for significant price changes to trigger update animation
          if (prev && item.price !== undefined && prev.current_price !== undefined && Math.abs(item.price - prev.current_price) > 0.01) {
            setUpdatedTickers(prevTickers => ({ ...prevTickers, [item.symbol]: item.price > prev.current_price ? 'up' : 'down' }));
          }
        });
      }

      setTickerData(newTickerDataSet);
      prevTickerData.current = { ...newTickerDataSet };

      if (currentWatchlistTickers.length > 0 && !selectedTicker) {
        setSelectedTicker(currentWatchlistTickers[0]);
      } else if (currentWatchlistTickers.length === 0) {
        setSelectedTicker(null);
        setShowDetailPanel(false);
      }

      setLastUpdate(new Date());
      setTimeout(() => setUpdatedTickers({}), 1200); // Clear animations after a short delay

    } catch (error) {
      console.error('Error loading watchlist data:', error);
      setErrorState(error.message);
    }
    if (!isRefresh) setIsLoading(false);
  };

  const getSectorForTicker = (ticker) => {
    const sectors = {
      'AAPL': 'Technology',
      'MSFT': 'Technology',
      'GOOGL': 'Technology',
      'TSLA': 'Consumer',
      'NVDA': 'Technology',
      'META': 'Technology',
      'AMZN': 'Consumer',
      'JPM': 'Financial Services',
      'JNJ': 'Healthcare',
      'XOM': 'Energy',
      'BTC': 'Crypto',
      'ETH': 'Crypto',
      'SPY': 'ETF',
      'QQQ': 'ETF'
    };
    return sectors[ticker] || 'General';
  };

  const addTicker = async () => {
    if (!newTicker.trim() || !watchlist) return;

    const ticker = newTicker.trim().toUpperCase();
    if (watchlist.tickers.includes(ticker)) {
      setNewTicker('');
      return;
    }

    try {
      const updatedTickers = [...watchlist.tickers, ticker];
      // Update UserPreference with the new list of tickers
      const user = await User.me();
      const prefs = await base44.entities.UserPreference.filter({ created_by: user.email });
      if (prefs.length > 0) {
        await base44.entities.UserPreference.update(prefs[0].id, {
          watchlist_tickers: updatedTickers
        });
      } else {
        await base44.entities.UserPreference.create({
          created_by: user.email,
          watchlist_tickers: updatedTickers
        });
      }

      setWatchlist({ ...watchlist, tickers: updatedTickers });
      setNewTicker('');

      // Immediately load data for new ticker, and all others in watchlist
      await loadWatchlistData();
    } catch (error) {
      console.error('Error adding ticker:', error);
      setErrorState(`Failed to add ticker: ${error.message}`);
    }
  };

  const removeTicker = async (tickerToRemove) => {
    if (!watchlist) return;

    try {
      const updatedTickers = watchlist.tickers.filter(t => t !== tickerToRemove);
      // Update UserPreference
      const user = await User.me();
      const prefs = await base44.entities.UserPreference.filter({ created_by: user.email });
      if (prefs.length > 0) {
        await base44.entities.UserPreference.update(prefs[0].id, {
          watchlist_tickers: updatedTickers
        });
      } else {
        // This case should ideally not happen if a watchlist exists
        console.warn("User preference not found when trying to remove ticker.");
      }

      setWatchlist({ ...watchlist, tickers: updatedTickers });

      const newTickerData = { ...tickerData };
      delete newTickerData[tickerToRemove];
      setTickerData(newTickerData);

      if (selectedTicker === tickerToRemove) {
        setSelectedTicker(updatedTickers[0] || null); // Select first remaining ticker or null
        if (!updatedTickers[0]) setShowDetailPanel(false); // Hide panel if no tickers left
      }
      // Re-load data to reflect changes
      await loadWatchlistData();
    } catch (error) {
      console.error('Error removing ticker:', error);
      setErrorState(`Failed to remove ticker: ${error.message}`);
    }
  };

  const handleTickerClick = (ticker) => {
    setSelectedTicker(ticker);
    setShowDetailPanel(true);
  };

  const getSentimentColor = (score) => {
    if (score > 20) return 'text-green-400 bg-green-900/30 border-green-700';
    if (score < -20) return 'text-red-400 bg-red-900/30 border-red-700';
    return 'text-gray-400 bg-gray-800/50 border-gray-600';
  };

  const getPriceChangeColor = (change) => {
    if (change > 0) return 'text-green-400';
    if (change < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  const getVolumeColor = (ratio) => {
    if (ratio > 1.5) return 'text-orange-400';
    if (ratio > 1.2) return 'text-yellow-400';
    return 'text-gray-400';
  };

  const filteredAndSortedTickers = () => {
    if (!watchlist) return [];

    let tickers = watchlist.tickers.filter(ticker => {
      const snapshot = tickerData[ticker];
      if (!snapshot) return true; // Keep tickers that haven't loaded yet

      switch (filterBy) {
        case 'gainers': return snapshot.change_percent > 0;
        case 'losers': return snapshot.change_percent < 0;
        case 'high-volume':
          // Parse volume, remove commas (from toLocaleString) or 'M' (from mock, though now it's from API)
          const volumeValue = parseFloat(String(snapshot.volume).replace(/M/g, '').replace(/,/g, ''));
          // A simple heuristic for "high volume" based on a threshold relative to price, or a fixed high number
          // This would ideally compare to average volume for the stock, but for now a simple threshold
          return volumeValue > 10_000_000;
        case 'alerts': return snapshot.alert_count > 0;
        case 'bullish': return snapshot.ai_sentiment_score > 0;
        case 'bearish': return snapshot.ai_sentiment_score < 0;
        default: return true;
      }
    });

    tickers.sort((a, b) => {
      const snapshotA = tickerData[a];
      const snapshotB = tickerData[b];

      // If data is missing for one, put it at the end
      if (!snapshotA && !snapshotB) return 0;
      if (!snapshotA) return 1;
      if (!snapshotB) return -1;

      switch (sortBy) {
        case 'price': return snapshotB.current_price - snapshotA.current_price;
        case 'change': return snapshotB.change_percent - snapshotA.change_percent;
        case 'volume':
          // Parse volume for sorting
          const volumeA = parseFloat(String(snapshotA.volume).replace(/M/g, '').replace(/,/g, ''));
          const volumeB = parseFloat(String(snapshotB.volume).replace(/M/g, '').replace(/,/g, ''));
          return volumeB - volumeA;
        case 'sentiment': return snapshotB.ai_sentiment_score - snapshotA.ai_sentiment_score;
        case 'alerts': return snapshotB.alert_count - snapshotA.alert_count;
        default: return a.localeCompare(b); // Default to alphabetical sort by ticker
      }
    });

    return tickers;
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 bg-gray-950 min-h-screen">
        <Skeleton className="h-8 w-64 bg-gray-700" />
        <div className="grid grid-cols-1 gap-4">
          {Array(5).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-16 bg-gray-700" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-950 text-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-100 flex items-center gap-3">
              Portfolio Tracker
            </h1>
            <div className="flex items-center gap-4 text-sm mt-1">
              <span className={isMarketOpen ? 'text-green-400' : 'text-red-400'}>
                {isMarketOpen ? '🟢 Market Open' : '🔴 Market Closed'}
              </span>
              {lastUpdate && (
                <span className="text-gray-400">Updated {lastUpdate.toLocaleTimeString()}</span>
              )}
            </div>
            {errorState && (
              <div className="mt-2 text-red-400 text-sm flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" /> {errorState}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => loadWatchlistData()}
              className="bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>

            <Button
              onClick={() => setShowAlertDialog(true)}
              disabled={!selectedTicker}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Bell className="w-4 h-4 mr-2" />
              Set Alert
            </Button>
          </div>
        </div>

        {/* Watchlist Display (Simplified for single watchlist) */}
        {watchlist && (
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold text-gray-100">{watchlist.name}</h3>
            <Badge variant="outline" className="ml-2 text-xs bg-gray-700 text-gray-400 border-gray-600">
              {watchlist.tickers.length} tickers
            </Badge>
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex gap-2">
            <Input
              placeholder="Add ticker (e.g., AAPL)"
              value={newTicker}
              onChange={(e) => setNewTicker(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTicker()}
              className="w-40 bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500"
            />
            <Button onClick={addTicker} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex gap-2">
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-gray-200">
                <SelectValue placeholder="Filter by" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all" className="text-gray-200">All</SelectItem>
                <SelectItem value="gainers" className="text-gray-200">Gainers</SelectItem>
                <SelectItem value="losers" className="text-gray-200">Losers</SelectItem>
                <SelectItem value="high-volume" className="text-gray-200">High Volume</SelectItem>
                <SelectItem value="alerts" className="text-gray-200">With Alerts</SelectItem>
                <SelectItem value="bullish" className="text-gray-200">Bullish</SelectItem>
                <SelectItem value="bearish" className="text-gray-200">Bearish</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-gray-200">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="ticker" className="text-gray-200">Ticker</SelectItem>
                <SelectItem value="price" className="text-gray-200">Price</SelectItem>
                <SelectItem value="change" className="text-gray-200">Change %</SelectItem>
                <SelectItem value="volume" className="text-gray-200">Volume</SelectItem>
                <SelectItem value="sentiment" className="text-gray-200">Sentiment</SelectItem>
                <SelectItem value="alerts" className="text-gray-200">Alerts</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === 'detailed' ? 'compact' : 'detailed')}
              className="bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700"
            >
              <Eye className="w-4 h-4 mr-1" />
              {viewMode === 'detailed' ? 'Compact' : 'Detailed'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Ticker List */}
        <div className="flex-1 overflow-auto">
          {!watchlist || watchlist.tickers.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Target className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-200 mb-2">No Tickers in Watchlist</h3>
                <p className="text-gray-400">
                  Add your first ticker to start tracking prices and AI insights.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4">
              <div className="space-y-2">
                {filteredAndSortedTickers().map(ticker => {
                  const snapshot = tickerData[ticker];
                  if (!snapshot) {
                    return (
                      <Card key={ticker} className="bg-gray-800/30 border border-gray-700/60">
                        <CardContent className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <h4 className="font-bold text-lg text-gray-100">{ticker}</h4>
                            <div className="animate-pulse flex space-x-4">
                              <div className="h-4 bg-gray-700 rounded w-20"></div>
                              <div className="h-4 bg-gray-700 rounded w-16"></div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">Loading...</div>
                          <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeTicker(ticker);
                              }}
                              className="text-gray-500 hover:text-red-400"
                            >
                              ×
                            </Button>
                        </CardContent>
                      </Card>
                    );
                  }

                  const updateStatus = updatedTickers[ticker];

                  return (
                    <Card
                      key={ticker}
                      className={`bg-gray-800/50 border border-gray-700/60 hover:bg-gray-800/70 transition-all duration-300 cursor-pointer ${
                        selectedTicker === ticker ? 'ring-2 ring-blue-500' : ''
                      } ${snapshot.alert_count > 0 ? 'border-l-4 border-l-orange-500' : ''} ${
                        updateStatus === 'up' ? 'bg-green-900/20 border-green-800/50' :
                        updateStatus === 'down' ? 'bg-red-900/20 border-red-800/50' : ''
                      }`}
                      onClick={() => handleTickerClick(ticker)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-lg text-gray-100">{ticker}</h4>
                                {snapshot.alert_count > 0 && (
                                  <Badge variant="outline" className="bg-orange-900/30 text-orange-300 border-orange-600">
                                    <Bell className="w-3 h-3 mr-1" />
                                    {snapshot.alert_count}
                                  </Badge>
                                )}
                                {!snapshot.is_real_data && ( // Show MOCK badge if data source indicated it was mock
                                  <Badge variant="outline" className="bg-blue-900/30 text-blue-400 border-blue-700 text-xs">
                                    MOCK
                                  </Badge>
                                )}
                              </div>
                              <div className="text-sm text-gray-400">{snapshot.sector}</div>
                            </div>

                            <div className="text-right">
                              <div className="text-2xl font-bold text-gray-100">
                                ${snapshot.current_price?.toFixed(2)}
                              </div>
                              <div className={`text-sm font-semibold ${getPriceChangeColor(snapshot.change_percent)}`}>
                                {snapshot.change_percent > 0 ? '+' : ''}{snapshot.change_percent?.toFixed(2)}%
                                <span className="ml-1 text-xs">
                                  (${snapshot.change?.toFixed(2)})
                                </span>
                              </div>
                              {viewMode === 'detailed' && (
                                <div className="text-xs text-gray-500 mt-1">
                                  Bid: ${snapshot.bid_price?.toFixed(2)} | Ask: ${snapshot.ask_price?.toFixed(2)}
                                </div>
                              )}
                            </div>
                          </div>

                          {viewMode === 'detailed' && (
                            <div className="flex items-center gap-4">
                              <div className="text-center">
                                <div className="text-xs text-gray-500">Volume</div>
                                <div className={`text-sm font-medium ${getVolumeColor(snapshot.volume_ratio)}`}>
                                  {snapshot.volume}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {snapshot.volume_ratio?.toFixed(1)}x avg
                                </div>
                              </div>

                              <div className="text-center">
                                <div className="text-xs text-gray-500">AI Sentiment</div>
                                <Badge className={`text-xs px-2 py-1 border ${getSentimentColor(snapshot.ai_sentiment_score)}`}>
                                  {snapshot.ai_sentiment_score > 0 ? '+' : ''}{snapshot.ai_sentiment_score?.toFixed(0)}
                                </Badge>
                              </div>

                              <div className="text-center">
                                <div className="text-xs text-gray-500">Updated</div>
                                <div className="text-xs text-gray-400 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {new Date(snapshot.last_updated).toLocaleTimeString()}
                                </div>
                              </div>
                            </div>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeTicker(ticker);
                            }}
                            className="text-gray-500 hover:text-red-400"
                          >
                            ×
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {showDetailPanel && selectedTicker && (
          <div className="w-96 border-l border-gray-800 bg-gray-900/50">
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <h3 className="font-semibold text-gray-100">
                {selectedTicker} Details
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetailPanel(false)}
                className="text-gray-500 hover:text-gray-300"
              >
                ×
              </Button>
            </div>
            <div className="overflow-auto max-h-[calc(100vh-160px)]"> {/* Adjust height based on header */}
              <TickerChart ticker={selectedTicker} data={tickerData[selectedTicker]} />
              <TickerInfoPanel
                ticker={selectedTicker}
                data={tickerData[selectedTicker]}
                onSetAlert={() => setShowAlertDialog(true)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Price Alert Dialog */}
      {showAlertDialog && selectedTicker && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">
              Set Price Alert for {selectedTicker}
            </h3>
            <PriceAlertDialog
              ticker={selectedTicker}
              currentPrice={tickerData[selectedTicker]?.current_price}
              onSave={async (alertData) => {
                try {
                  await base44.entities.PriceAlert.create({
                    ticker: selectedTicker,
                    ...alertData
                  });
                  setShowAlertDialog(false);
                  // Refresh ticker data to update alert count (if backend supports it)
                  if (watchlist) {
                    loadWatchlistData();
                  }
                } catch (error) {
                  console.error('Error creating alert:', error);
                  setErrorState(`Failed to set alert: ${error.message}`);
                }
              }}
              onClose={() => setShowAlertDialog(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
