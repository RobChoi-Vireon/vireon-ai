import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { User } from '@/entities/User';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  RefreshCw, 
  Settings2, 
  Clock, 
  Plus, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

export default function AutoSyncPreferences() {
  const [preferences, setPreferences] = useState(null);
  const [ingestionProfiles, setIngestionProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle', 'saving', 'saved', 'error'

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const user = await User.me();
      
      // Load user preferences
      const userPrefs = await base44.entities.UserPreference.filter({ created_by: user.email });
      if (userPrefs.length > 0) {
        setPreferences(userPrefs[0]);
      } else {
        // Create default preferences
        const defaultPrefs = {
          auto_sync_enabled: true,
          sync_threshold_minutes: 15,
          default_ingestion_profile_id: null,
          last_sync_timestamp: null
        };
        const created = await base44.entities.UserPreference.create(defaultPrefs);
        setPreferences(created);
      }

      // Load ingestion profiles
      const profiles = await base44.entities.IngestionProfile.list();
      setIngestionProfiles(profiles);
    } catch (error) {
      console.error('Error loading auto-sync preferences:', error);
    }
    setIsLoading(false);
  };

  const updatePreference = async (key, value) => {
    if (!preferences) return;
    
    setIsSaving(true);
    setSaveStatus('saving');
    
    try {
      const updatedPrefs = { ...preferences, [key]: value };
      await base44.entities.UserPreference.update(preferences.id, updatedPrefs);
      setPreferences(updatedPrefs);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Error updating preference:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
    setIsSaving(false);
  };

  const getTimeThresholdLabel = (minutes) => {
    if (minutes < 60) {
      return `${minutes} minutes`;
    }
    const hours = minutes / 60;
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  };

  const getLastSyncStatus = () => {
    if (!preferences?.last_sync_timestamp) {
      return { text: 'Never synced', color: 'text-gray-500', icon: null };
    }

    const lastSync = new Date(preferences.last_sync_timestamp);
    const timeAgo = formatDistanceToNow(lastSync, { addSuffix: true });
    
    return {
      text: `Last synced ${timeAgo}`,
      color: 'text-green-400',
      icon: CheckCircle2
    };
  };

  const getSaveStatusIndicator = () => {
    switch (saveStatus) {
      case 'saving':
        return <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />;
      case 'saved':
        return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default:
        return null;
    }
  };

  if (isLoading || !preferences) {
    return (
      <Card className="bg-gray-800/50 border border-gray-700/60">
        <CardHeader>
          <div className="animate-pulse">
            <div className="h-6 bg-gray-700 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-2/3"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-700 rounded"></div>
            <div className="h-8 bg-gray-700 rounded"></div>
            <div className="h-8 bg-gray-700 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const lastSyncStatus = getLastSyncStatus();
  const selectedProfile = ingestionProfiles.find(p => p.id === preferences.default_ingestion_profile_id);

  return (
    <Card className="bg-gray-800/50 border border-gray-700/60 shadow-lg hover:shadow-xl transition-all duration-300">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-700/30 transition-colors rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-900/30 rounded-lg">
                  <RefreshCw className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-gray-100 flex items-center gap-2">
                    Auto-Sync Preferences
                    {getSaveStatusIndicator()}
                  </CardTitle>
                  <p className="text-sm text-gray-400 mt-1">
                    Control automatic data ingestion on app launch
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge 
                  variant="outline" 
                  className={`${preferences.auto_sync_enabled 
                    ? 'bg-green-900/30 text-green-300 border-green-700' 
                    : 'bg-gray-700 text-gray-300 border-gray-600'
                  }`}
                >
                  {preferences.auto_sync_enabled ? 'Enabled' : 'Disabled'}
                </Badge>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-6 pt-2">
            {/* Auto-Sync Toggle */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-4 rounded-lg bg-gray-900/30 border border-gray-700/50"
            >
              <div className="flex-1">
                <Label className="text-base font-semibold text-gray-100">
                  Enable Auto-Ingestion at App Open
                </Label>
                <p className="text-sm text-gray-400 mt-1">
                  Automatically sync data when you log in or open the app
                </p>
              </div>
              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-4 h-4 text-gray-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Vireon will automatically run your selected Smart Ingestion Profile to keep your data up to date.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Switch
                  checked={preferences.auto_sync_enabled}
                  onCheckedChange={(value) => updatePreference('auto_sync_enabled', value)}
                  disabled={isSaving}
                  className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-600"
                />
              </div>
            </motion.div>

            <AnimatePresence>
              {preferences.auto_sync_enabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <Separator className="border-gray-700" />

                  {/* Profile Selection */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold text-gray-100">
                      Default Smart Ingestion Profile
                    </Label>
                    <div className="flex gap-3">
                      <Select
                        value={preferences.default_ingestion_profile_id || ""}
                        onValueChange={(value) => updatePreference('default_ingestion_profile_id', value)}
                        disabled={isSaving}
                      >
                        <SelectTrigger className="flex-1 bg-gray-900 border-gray-600 text-gray-100 hover:bg-gray-800 transition-colors">
                          <SelectValue placeholder="Select a profile to run automatically..." />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          {ingestionProfiles.map(profile => (
                            <SelectItem 
                              key={profile.id} 
                              value={profile.id} 
                              className="text-gray-100 hover:bg-gray-700 focus:bg-gray-700"
                            >
                              <div className="flex items-center justify-between w-full">
                                <span>{profile.profile_name}</span>
                                <Badge variant="outline" className="ml-2 text-xs bg-gray-700 text-gray-300">
                                  {profile.sources?.length || 0} sources
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button 
                        variant="outline" 
                        className="bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700 px-3"
                        disabled={isSaving}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {!preferences.default_ingestion_profile_id && (
                      <p className="text-sm text-amber-400 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        You need to select a profile for auto-sync to work
                      </p>
                    )}
                  </div>

                  <Separator className="border-gray-700" />

                  {/* Sync Frequency */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <Label className="text-base font-semibold text-gray-100">
                        Minimum Time Between Auto-Syncs
                      </Label>
                    </div>
                    <Select
                      value={preferences.sync_threshold_minutes?.toString()}
                      onValueChange={(value) => updatePreference('sync_threshold_minutes', parseInt(value))}
                      disabled={isSaving}
                    >
                      <SelectTrigger className="w-64 bg-gray-900 border-gray-600 text-gray-100 hover:bg-gray-800 transition-colors">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="5" className="text-gray-100 hover:bg-gray-700">5 minutes</SelectItem>
                        <SelectItem value="15" className="text-gray-100 hover:bg-gray-700">15 minutes</SelectItem>
                        <SelectItem value="30" className="text-gray-100 hover:bg-gray-700">30 minutes</SelectItem>
                        <SelectItem value="60" className="text-gray-100 hover:bg-gray-700">1 hour</SelectItem>
                        <SelectItem value="180" className="text-gray-100 hover:bg-gray-700">3 hours</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-400">
                      Prevents redundant syncing if you reopen the app quickly. 
                      Only auto-sync if last sync was more than {getTimeThresholdLabel(preferences.sync_threshold_minutes)} ago.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <Separator className="border-gray-700" />

            {/* Status Footer */}
            <div className="flex items-center justify-between p-4 bg-gray-900/20 rounded-lg border border-gray-700/30">
              <div className="flex items-center gap-3">
                {lastSyncStatus.icon && <lastSyncStatus.icon className={`w-4 h-4 ${lastSyncStatus.color}`} />}
                <div>
                  <p className={`text-sm font-medium ${lastSyncStatus.color}`}>
                    {lastSyncStatus.text}
                  </p>
                  {selectedProfile && (
                    <p className="text-xs text-gray-500 mt-1">
                      Profile: {selectedProfile.profile_name}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Settings2 className="w-3 h-3" />
                Auto-configured
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}