import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SyncBanner({ status, message, onRetry }) {
  if (status === 'idle') {
    return null;
  }

  const statusConfig = {
    syncing: {
      icon: <RefreshCw className="w-4 h-4 animate-spin" />,
      color: 'bg-blue-600',
    },
    success: {
      icon: <CheckCircle className="w-4 h-4" />,
      color: 'bg-green-600',
    },
    failed: {
      icon: <AlertTriangle className="w-4 h-4" />,
      color: 'bg-red-600',
    },
  };

  const { icon, color } = statusConfig[status];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`fixed bottom-5 right-5 ${color} text-white px-4 py-2 rounded-lg shadow-2xl flex items-center gap-3 z-50`}
      >
        {icon}
        <span className="text-sm font-medium">{message}</span>
        {status === 'failed' && onRetry && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onRetry}
            className="text-white hover:bg-white/20 h-auto px-2 py-1"
          >
            Retry
          </Button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}