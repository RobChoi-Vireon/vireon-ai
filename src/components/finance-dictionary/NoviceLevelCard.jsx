import React from 'react';
import { motion } from 'framer-motion';
import { Feather } from 'lucide-react';

export default function NoviceLevelCard({ data, theme }) {
  if (!data) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
      className="p-6 rounded-2xl elevation-1"
      style={{
        backgroundColor: 'var(--card)',
        border: `1px solid var(--border)`
      }}
    >
      <div className="flex items-center mb-4">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${theme === 'dark' ? 'bg-green-500/10' : 'bg-green-100'}`}>
          <Feather className={`w-5 h-5 ${theme === 'dark' ? 'text-green-300' : 'text-green-600'}`} />
        </div>
        <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Novice Level</h2>
      </div>
      
      <div className="space-y-4 prose prose-sm max-w-none" style={{'--tw-prose-body': 'var(--text-secondary)', '--tw-prose-strong': 'var(--text-primary)'}}>
        <p><strong>Definition:</strong> {data.definition}</p>
        <div>
          <strong>Simple Example:</strong>
          <div className="mt-2 whitespace-pre-wrap leading-relaxed">
            {data.example}
          </div>
        </div>
      </div>
    </motion.div>
  );
}