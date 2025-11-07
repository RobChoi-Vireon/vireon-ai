import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Link, Download, Copy, Save } from 'lucide-react';

export default function SidePanel({ relatedTerms, pitfalls, actions, onTermClick, theme }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-24 space-y-8"
    >
      {/* Quick Actions */}
      <div className="p-5 rounded-2xl elevation-1" style={{backgroundColor: 'var(--card)', border: `1px solid var(--border)`}}>
        <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
        <div className="space-y-3">
          {actions.map(action => (
            <button key={action.label} onClick={action.action} disabled={action.disabled} className={`w-full flex items-center justify-center p-3 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-60 ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'}`}>
              <action.icon className="w-4 h-4 mr-2" /> {action.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Related Terms */}
      <div className="p-5 rounded-2xl elevation-1" style={{backgroundColor: 'var(--card)', border: `1px solid var(--border)`}}>
        <div className="flex items-center text-lg font-bold mb-4">
          <Link className="w-5 h-5 mr-2" /> Related Terms
        </div>
        <div className="flex flex-wrap gap-2">
          {relatedTerms.map(term => (
            <button
              key={term}
              onClick={() => onTermClick(term)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${theme === 'dark' ? 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-300' : 'bg-blue-100 hover:bg-blue-200 text-blue-700'}`}
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Common Pitfalls */}
      <div className="p-5 rounded-2xl elevation-1" style={{backgroundColor: 'var(--card)', border: `1px solid var(--border)`}}>
        <div className="flex items-center text-lg font-bold mb-4">
          <AlertCircle className="w-5 h-5 mr-2" /> Common Pitfalls
        </div>
        <ul className="space-y-2 list-disc list-inside text-sm" style={{color: 'var(--text-secondary)'}}>
          {pitfalls.map((pitfall, i) => (
            <li key={i}>{pitfall}</li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}