
import React from 'react';
import { AlertTriangle, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

class NetworkErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.error('NetworkErrorBoundary caught an error:', error, errorInfo);
  }

  componentDidMount() {
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
  }

  handleOnline = () => {
    this.setState({ isOnline: true });
  };

  handleOffline = () => {
    this.setState({ isOnline: false });
  };

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg)' }}>
          <div className="max-w-md w-full text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              {this.state.isOnline ? (
                <AlertTriangle className="w-10 h-10" style={{ color: 'var(--bear)' }} />
              ) : (
                <WifiOff className="w-10 h-10" style={{ color: 'var(--bear)' }} />
              )}
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {this.state.isOnline ? 'Something went wrong' : 'You\'re offline'}
              </h1>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {this.state.isOnline 
                  ? 'The application encountered an unexpected error. Please try refreshing the page.'
                  : 'Please check your internet connection and try again.'
                }
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={this.handleRetry} className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/'}
                className="flex items-center gap-2"
              >
                <Wifi className="w-4 h-4" />
                Go Home
              </Button>
            </div>

            {this.state.isOnline && (
              <div className="pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  If this problem persists, please contact support.
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default NetworkErrorBoundary;
