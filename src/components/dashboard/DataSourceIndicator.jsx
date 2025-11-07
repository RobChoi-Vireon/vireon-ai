import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Database, Sparkles, User, Wifi, WifiOff } from 'lucide-react';

export default function DataSourceIndicator({ source, className = "" }) {
  const getSourceInfo = () => {
    switch (source) {
      case 'real':
        return {
          icon: Wifi,
          text: 'Live Data',
          color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300'
        };
      case 'ai-generated':
        return {
          icon: Sparkles,
          text: 'AI Generated',
          color: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300'
        };
      case 'user-data':
        return {
          icon: User,
          text: 'User Data',
          color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300'
        };
      case 'static':
        return {
          icon: WifiOff,
          text: 'Static Demo',
          color: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300'
        };
      default:
        return {
          icon: Database,
          text: 'Unknown',
          color: 'bg-gray-100 text-gray-800 border-gray-200'
        };
    }
  };

  const { icon: Icon, text, color } = getSourceInfo();

  return (
    <Badge className={`${color} ${className} text-xs flex items-center gap-1`}>
      <Icon className="w-3 h-3" />
      {text}
    </Badge>
  );
}