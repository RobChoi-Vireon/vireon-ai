
import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { User } from '@/entities/User';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  User as UserIcon, 
  Briefcase, 
  Target, 
  Zap, 
  Bell, 
  Settings,
  TrendingUp,
  Calendar,
  FileText
} from 'lucide-react';
import DataSourceIndicator from './DataSourceIndicator';

export default function MyWorkspace() {
  const [user, setUser] = useState(null);
  const [userPrefs, setUserPrefs] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWorkspaceData();
  }, []);

  const loadWorkspaceData = async () => {
    setIsLoading(true);
    try {
      const userData = await User.me();
      setUser(userData);

      const preferences = await base44.entities.UserPreference.filter({ created_by: userData.email });
      if (preferences.length > 0) {
        setUserPrefs(preferences[0]);
      }

      // NUCLEAR FIX: Use static activity data - NO AI calls
      const staticActivity = [
        {
          id: 1,
          type: 'watchlist_update',
          description: 'Added NVDA to watchlist',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          icon: Target
        },
        {
          id: 2,
          type: 'alert_triggered',
          description: 'Price alert triggered for AAPL',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          icon: Bell
        },
        {
          id: 3,
          type: 'report_generated',
          description: 'Daily digest generated',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          icon: FileText
        }
      ];
      setRecentActivity(staticActivity);
    } catch (error) {
      console.error('Error loading workspace data:', error);
    }
    setIsLoading(false);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffHours > 0) {
      return `${diffHours}h ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes}m ago`;
    } else {
      return 'Just now';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <Skeleton className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-600" />
              <div>
                <Skeleton className="h-6 w-48 mb-2 bg-gray-200 dark:bg-gray-600" />
                <Skeleton className="h-4 w-32 bg-gray-200 dark:bg-gray-600" />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array(4).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-20 bg-gray-200 dark:bg-gray-600 rounded-lg" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Profile Section */}
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <UserIcon className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Welcome back, {user?.full_name?.split(' ')[0] || 'User'}!
              </h2>
              <p className="text-gray-600 dark:text-gray-400">Professional • {user?.email}</p>
            </div>
            <DataSourceIndicator source="user-data" />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-800 dark:text-blue-300">Watchlist</span>
              </div>
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {userPrefs?.watchlist_tickers?.length || 0}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-green-800 dark:text-green-300">Tracking</span>
              </div>
              <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                {userPrefs?.smart_tracking_terms?.length || 0}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/50">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium text-purple-800 dark:text-purple-300">Alerts</span>
              </div>
              <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                {userPrefs?.notification_threshold || 7}/10
              </div>
            </div>

            <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/50">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <span className="text-sm font-medium text-orange-800 dark:text-orange-300">Active</span>
              </div>
              <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                24/7
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <activity.icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{activity.description}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{formatTime(activity.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Zap className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link to={createPageUrl("Watchlist")}>
              <Button variant="outline" className="w-full justify-start bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                <Briefcase className="w-4 h-4 mr-2" />
                Manage Watchlist
              </Button>
            </Link>
            <Link to={createPageUrl("SmartTracker")}>
              <Button variant="outline" className="w-full justify-start bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                <Target className="w-4 h-4 mr-2" />
                Smart Tracker
              </Button>
            </Link>
            <Link to={createPageUrl("Settings")}>
              <Button variant="outline" className="w-full justify-start bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                <Settings className="w-4 h-4 mr-2" />
                Preferences
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
