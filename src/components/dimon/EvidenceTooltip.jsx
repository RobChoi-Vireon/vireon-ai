import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function EvidenceTooltip({ item, children }) {
  const [isVisible, setIsVisible] = useState(false);

  if (!item || (!item.evidence_urls && !item.evidence_url && !item.confidence && !item.macro_tags)) {
    return <div>{children}</div>;
  }

  const evidenceUrls = item.evidence_urls || (item.evidence_url ? [item.evidence_url] : []);

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50 pointer-events-none"
          >
            <div className="bg-neutral-800/95 backdrop-blur-xl border border-neutral-700 rounded-lg p-3 shadow-2xl min-w-64 max-w-80">
              
              {item.confidence && (
                <div className="mb-2">
                  <span className="text-xs text-neutral-400">Confidence: </span>
                  <span className="text-sm font-semibold text-white">
                    {Math.round(item.confidence * 100)}%
                  </span>
                </div>
              )}

              {item.macro_tags && item.macro_tags.length > 0 && (
                <div className="mb-2">
                  <span className="text-xs text-neutral-400 block mb-1">Macro Tags:</span>
                  <div className="flex flex-wrap gap-1">
                    {item.macro_tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs border-neutral-600 text-neutral-300">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {item.rationale && (
                <div className="mb-2">
                  <span className="text-xs text-neutral-400 block mb-1">Rationale:</span>
                  <p className="text-xs text-neutral-200">{item.rationale}</p>
                </div>
              )}

              {evidenceUrls.length > 0 && (
                <div>
                  <span className="text-xs text-neutral-400 block mb-1">Evidence:</span>
                  <div className="space-y-1">
                    {evidenceUrls.slice(0, 3).map((url, index) => (
                      <div key={index} className="flex items-center text-xs text-blue-400 hover:text-blue-300">
                        <ExternalLink className="w-3 h-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{new URL(url).hostname}</span>
                      </div>
                    ))}
                    {evidenceUrls.length > 3 && (
                      <span className="text-xs text-neutral-500">+{evidenceUrls.length - 3} more sources</span>
                    )}
                  </div>
                </div>
              )}

              {/* Tooltip arrow */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-neutral-800 border-r border-b border-neutral-700 rotate-45"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}