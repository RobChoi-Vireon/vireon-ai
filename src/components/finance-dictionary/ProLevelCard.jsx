import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, Variable, Sigma, ChevronDown, ChevronUp } from 'lucide-react';

const FormulaBlock = ({ formula, theme }) => (
  <div className={`p-4 my-4 rounded-xl ${theme === 'dark' ? 'bg-black/20' : 'bg-gray-50/80 border border-gray-200'}`}>
    <div className="flex items-center text-sm font-semibold mb-3">
      <Sigma className="w-4 h-4 mr-2" /> Formula: {formula.name}
    </div>
    <div className={`p-3 rounded-lg font-mono text-base text-center overflow-x-auto ${theme === 'dark' ? 'bg-black/30' : 'bg-gray-200/80'}`}>
      {formula.expression}
    </div>
    {formula.variables && formula.variables.length > 0 && (
      <div className="mt-4 space-y-2 text-sm">
        <div className="flex items-center font-semibold">
          <Variable className="w-4 h-4 mr-2" /> Variables
        </div>
        {formula.variables.map(v => (
          <div key={v.symbol} className="grid grid-cols-[25px_1fr] items-start gap-x-3">
            <span className="font-mono font-bold text-center">{v.symbol}</span>
            <span>= {v.meaning} {v.units && `(${v.units})`}</span>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default function ProLevelCard({ data, theme }) {
  const [isExpanded, setIsExpanded] = useState(false);
  if (!data) return null;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="p-6 rounded-2xl elevation-1" 
      style={{
        backgroundColor: 'var(--card)',
        border: `1px solid var(--border)`
      }}
    >
      <div className="flex items-center mb-4">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-100'}`}>
          <Book className={`w-5 h-5 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`} />
        </div>
        <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Pro Level</h2>
      </div>

      <div className="space-y-4 prose prose-sm max-w-none" style={{'--tw-prose-body': 'var(--text-secondary)', '--tw-prose-strong': 'var(--text-primary)'}}>
        <p><strong>Definition:</strong> {data.definition}</p>
        
        {data.formulas?.map((formula, i) => (
          <FormulaBlock key={i} formula={formula} theme={theme} />
        ))}

        <div>
          <strong>Worked Example:</strong>
          <div className="mt-2 whitespace-pre-wrap leading-relaxed">
            {data.example}
          </div>
        </div>
      </div>

      <div className="mt-6 border-t pt-4" style={{borderColor: 'var(--border)'}}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex justify-between items-center text-left font-semibold"
          style={{color: 'var(--accent)'}}
        >
          <span>{isExpanded ? 'Hide' : 'Show'} Veteran Detail</span>
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial="collapsed"
              animate="open"
              exit="collapsed"
              variants={{
                open: { opacity: 1, height: 'auto', marginTop: '1.5rem' },
                collapsed: { opacity: 0, height: 0, marginTop: 0 }
              }}
              transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
              className="overflow-hidden"
            >
              <div className="space-y-4 prose prose-sm max-w-none" style={{'--tw-prose-body': 'var(--text-secondary)', '--tw-prose-strong': 'var(--text-primary)'}}>
                <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Veteran Definition</h3>
                <p>{data.veteran_definition}</p>
                <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Veteran Example</h3>
                <div className="mt-2 whitespace-pre-wrap leading-relaxed">
                    {data.veteran_example}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}