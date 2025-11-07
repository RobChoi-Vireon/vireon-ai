import React, { useState, useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function RetryWrapper({ 
  children, 
  onRetry, 
  error = null, 
  isLoading = false,
  maxRetries = 3,
  retryDelay = 1000 
}) {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    if (retryCount < maxRetries) {
      setIsRetrying(true);
      setRetryCount(prev => prev + 1);
      
      try {
        await new Promise(resolve => setTimeout(resolve, retryDelay * retryCount));
        await onRetry();
      } catch (err) {
        console.error('Retry failed:', err);
      } finally {
        setIsRetrying(false);
      }
    }
  };

  // Auto-retry on network errors
  useEffect(() => {
    if (error && retryCount < maxRetries && !isRetrying) {
      const timer = setTimeout(() => {
        handleRetry();
      }, retryDelay * (retryCount + 1));
      
      return () => clearTimeout(timer);
    }
  }, [error, retryCount, maxRetries, isRetrying]);

  if (error && retryCount >= maxRetries) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <AlertTriangle className="w-6 h-6" style={{ color: 'var(--bear)' }} />
        </div>
        <div className="text-center space-y-2">
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
            Connection Error
          </h3>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Unable to load content after {maxRetries} attempts
          </p>
        </div>
        <Button onClick={() => window.location.reload()} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Page
        </Button>
      </div>
    );
  }

  if (isLoading || isRetrying) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin w-6 h-6 border-2 rounded-full" style={{ 
          borderColor: 'var(--border)', 
          borderTopColor: 'var(--accent)' 
        }} />
        <span className="ml-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
          {isRetrying ? `Retrying... (${retryCount}/${maxRetries})` : 'Loading...'}
        </span>
      </div>
    );
  }

  return children;
}