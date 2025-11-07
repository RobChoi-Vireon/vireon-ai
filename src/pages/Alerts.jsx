import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Bell, 
  Clock, 
  Settings2, 
  CheckCheck, 
  Trash2, 
  TrendingUp, 
  AlertTriangle,
  Building,
  FileText,
  DollarSign
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const ALERT_CATEGORIES = [
  { id: 'earnings', label: 'Earnings', icon: DollarSign, color: 'bg-green-100 text-green-800' },
  { id: 'guidance', label: 'Guidance', icon: TrendingUp, color: 'bg-blue-100 text-blue-800' },
  { id: 'ma', label: 'M&A', icon: Building, color: 'bg-purple-100 text-purple-800' },
  { id: 'regulatory', label: 'Regulatory', icon: AlertTriangle, color: 'bg-red-100 text-red-800' },
  { id: 'sec', label: 'SEC Filings', icon: FileText, color: 'bg-gray-100 text-gray-800' },
];

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    threshold: 0.7,
    categories: {
      earnings: true,
      guidance: true,
      ma: true,
      regulatory: true,
      sec: false
    },
    quietHours: {
      enabled: true,
      start: '22:00',
      end: '07:00'
    }
  });

  useEffect(() => {
    // Mock data - replace with actual API call
    setTimeout(() => {
      setAlerts([
        {
          id: '1',
          title: 'Apple Reports Q4 Earnings Beat',
          content: 'Apple Inc. reported quarterly earnings of $1.64 per share, beating estimates of $1.60.',
          category: 'earnings',
          ticker: 'AAPL',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          importance: 0.9,
          isRead: false,
          source: 'SEC Filing'
        },
        {
          id: '2',
          title: 'Tesla Raises Full-Year Guidance',
          content: 'Tesla has increased its full-year delivery guidance following strong Q3 performance.',
          category: 'guidance',
          ticker: 'TSLA',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          importance: 0.8,
          isRead: false,
          source: 'Press Release'
        },
        {
          id: '3',
          title: 'Microsoft Acquires AI Startup',
          content: 'Microsoft announces acquisition of AI startup for $500M to enhance Azure capabilities.',
          category: 'ma',
          ticker: 'MSFT',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
          importance: 0.7,
          isRead: true,
          source: 'Bloomberg'
        },
        {
          id: '4',
          title: 'FDA Approves New Drug',
          content: 'Regulatory approval granted for breakthrough cancer treatment.',
          category: 'regulatory',
          ticker: 'PFE',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
          importance: 0.85,
          isRead: true,
          source: 'FDA Press Release'
        }
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const groupedAlerts = alerts.reduce((groups, alert) => {
    const date = alert.timestamp.toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(alert);
    return groups;
  }, {});

  const markAsRead = (alertIds) => {
    setAlerts(prev => prev.map(alert => 
      alertIds.includes(alert.id) ? { ...alert, isRead: true } : alert
    ));
  };

  const markAllAsRead = () => {
    setAlerts(prev => prev.map(alert => ({ ...alert, isRead: true })));
  };

  const clearDay = (date) => {
    setAlerts(prev => prev.filter(alert => alert.timestamp.toDateString() !== date));
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getCategoryInfo = (categoryId) => {
    return ALERT_CATEGORIES.find(cat => cat.id === categoryId) || ALERT_CATEGORIES[0];
  };

  const AlertItem = ({ alert }) => {
    const categoryInfo = getCategoryInfo(alert.category);
    const IconComponent = categoryInfo.icon;

    return (
      <Card className={`transition-all duration-200 ${!alert.isRead ? 'border-blue-200 bg-blue-50/30 dark:border-blue-800 dark:bg-blue-900/10' : ''}`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <div className={`p-2 rounded-lg ${categoryInfo.color} dark:bg-opacity-20`}>
                <IconComponent className="w-4 h-4" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <Badge variant="outline" className="font-mono text-xs">
                    {alert.ticker}
                  </Badge>
                  <Badge className={categoryInfo.color}>
                    {categoryInfo.label}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {formatTime(alert.timestamp)}
                  </span>
                  {!alert.isRead && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}
                </div>
                
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {alert.title}
                </h3>
                
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  {alert.content}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Source: {alert.source}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      alert.importance >= 0.8 ? 'bg-red-100 text-red-800' :
                      alert.importance >= 0.6 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {alert.importance >= 0.8 ? 'High' : alert.importance >= 0.6 ? 'Med' : 'Low'} Impact
                    </span>
                    {!alert.isRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead([alert.id])}
                        className="text-xs"
                      >
                        Mark Read
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const SettingsPanel = () => (
    <div className="space-y-6">
      {/* Importance Threshold */}
      <div>
        <Label className="text-base font-semibold mb-4 block">
          Importance Threshold
        </Label>
        <div className="px-3">
          <Slider
            value={[settings.threshold]}
            onValueChange={([value]) => setSettings(prev => ({ ...prev, threshold: value }))}
            max={1}
            min={0}
            step={0.1}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>Low (0.0)</span>
            <span className="font-medium">Current: {settings.threshold.toFixed(1)}</span>
            <span>High (1.0)</span>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Only show alerts with importance above this threshold
        </p>
      </div>

      {/* Categories */}
      <div>
        <Label className="text-base font-semibold mb-4 block">
          Alert Categories
        </Label>
        <div className="space-y-3">
          {ALERT_CATEGORIES.map((category) => (
            <div key={category.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <category.icon className="w-4 h-4 text-gray-500" />
                <span className="font-medium">{category.label}</span>
              </div>
              <Switch
                checked={settings.categories[category.id]}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({
                    ...prev,
                    categories: { ...prev.categories, [category.id]: checked }
                  }))
                }
              />
            </div>
          ))}
        </div>
      </div>

      {/* Quiet Hours */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <Label className="text-base font-semibold">
            Quiet Hours
          </Label>
          <Switch
            checked={settings.quietHours.enabled}
            onCheckedChange={(checked) => 
              setSettings(prev => ({
                ...prev,
                quietHours: { ...prev.quietHours, enabled: checked }
              }))
            }
          />
        </div>
        {settings.quietHours.enabled && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm mb-2 block">Start Time</Label>
              <input
                type="time"
                value={settings.quietHours.start}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  quietHours: { ...prev.quietHours, start: e.target.value }
                }))}
                className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-800"
              />
            </div>
            <div>
              <Label className="text-sm mb-2 block">End Time</Label>
              <input
                type="time"
                value={settings.quietHours.end}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  quietHours: { ...prev.quietHours, end: e.target.value }
                }))}
                className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-800"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const unreadCount = alerts.filter(alert => !alert.isRead).length;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Alerts
            </h1>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="h-6">
                {unreadCount} unread
              </Badge>
            )}
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Real-time notifications for your watchlist
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {unreadCount > 0 && (
            <>
              <Button variant="outline" onClick={markAllAsRead}>
                <CheckCheck className="w-4 h-4 mr-2" />
                Mark All Read
              </Button>
            </>
          )}
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                <Settings2 className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Alert Settings</SheetTitle>
                <SheetDescription>
                  Customize your alert preferences and thresholds.
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <SettingsPanel />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Alerts by Date */}
      <div className="space-y-6">
        {Object.entries(groupedAlerts).map(([date, dayAlerts]) => (
          <div key={date}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                {date === new Date().toDateString() ? 'Today' : date}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => clearDay(date)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Clear Day
              </Button>
            </div>
            
            <div className="space-y-3">
              {dayAlerts.map(alert => (
                <AlertItem key={alert.id} alert={alert} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {alerts.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No alerts yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Alerts will appear here when important events happen with your watchlist.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}