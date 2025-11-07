import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

export default function DegradedBanner({ missingSources = [] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center space-x-3"
    >
      <AlertTriangle className="w-5 h-5 flex-shrink-0" />
      <div>
        <p className="font-semibold text-sm">Digest is in Degraded Mode.</p>
        <p className="text-xs">
          Some sources may be missing.
          {missingSources.length > 0 && ` Unavailable: ${missingSources.join(', ').toUpperCase()}`}
        </p>
      </div>
    </motion.div>
  );
}