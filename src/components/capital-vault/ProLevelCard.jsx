import React from 'react';
import { motion } from 'framer-motion';
import { Award, ExternalLink, Copy, BookOpen, Lightbulb } from 'lucide-react';

export default function ProLevelCard({ data, theme }) {
  if (!data) return null;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
      className="relative overflow-hidden rounded-3xl p-8 md:p-10 backdrop-blur-2xl border border-white/20 shadow-2xl mb-8"
      style={{
        background: 'linear-gradient(135deg, rgba(26, 29, 41, 0.7) 0%, rgba(18, 20, 28, 0.7) 100%)'
      }}
    >
      {/* Ambient background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none" />
      
      {/* Header with enhanced styling */}
      <motion.div 
        className="flex items-center justify-between mb-8"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <div className="flex items-center space-x-4">
          <motion.div 
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-purple-500/30 backdrop-blur-sm shadow-lg"
            whileHover={{ scale: 1.1, rotate: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Award className="w-7 h-7 text-purple-400" strokeWidth={2} />
          </motion.div>
          <div>
            <h2 className="text-3xl font-black tracking-tight text-white">Professional Level</h2>
            <p className="text-purple-400 font-semibold">Executive-grade financial intelligence</p>
          </div>
        </div>
        <motion.button
          onClick={() => copyToClipboard(data.definition)}
          className="p-3 rounded-xl backdrop-blur-sm border border-white/20 hover:border-white/30 text-gray-400 hover:text-white transition-all duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title="Copy definition"
        >
          <Copy className="w-5 h-5" />
        </motion.button>
      </motion.div>
      
      <div className="space-y-10">
        {/* Definition Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="space-y-4"
        >
          <div className="flex items-center space-x-3">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <h3 className="text-xl font-bold text-white">Definition</h3>
          </div>
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full" />
            <p className="text-lg leading-relaxed text-gray-200 pl-6 font-medium">
              {data.definition}
            </p>
          </div>
        </motion.div>

        {/* Example Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="space-y-4"
        >
          <div className="flex items-center space-x-3">
            <Lightbulb className="w-5 h-5 text-green-400" />
            <h3 className="text-xl font-bold text-white">Example</h3>
          </div>
          <div className="relative p-6 rounded-2xl backdrop-blur-sm border border-white/10"
               style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
            <div className="whitespace-pre-wrap leading-relaxed text-gray-200 font-medium">
              {data.example}
            </div>
          </div>
        </motion.div>

        {/* Veteran Definition (if available) - Enhanced visibility */}
        {data.veteran_definition && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="space-y-6"
          >
            <div className="flex items-center space-x-3">
              <Award className="w-6 h-6 text-orange-400" />
              <h3 className="text-2xl font-bold text-white">Veteran Insight</h3>
              <span className="px-4 py-2 text-sm font-bold uppercase tracking-wider rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">
                Advanced
              </span>
            </div>
            <div className="relative p-8 rounded-2xl backdrop-blur-sm border border-orange-500/30 shadow-lg"
                 style={{ background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.08) 0%, rgba(245, 101, 101, 0.04) 100%)' }}>
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-400 to-red-400 rounded-full" />
              <div className="pl-6 whitespace-pre-wrap leading-relaxed text-gray-100 font-medium text-lg">
                {data.veteran_definition}
              </div>
            </div>
          </motion.div>
        )}

        {/* Veteran Example (if available) - Enhanced visibility */}
        {data.veteran_example && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="space-y-6"
          >
            <div className="flex items-center space-x-3">
              <ExternalLink className="w-6 h-6 text-orange-400" />
              <h3 className="text-2xl font-bold text-white">Advanced Example</h3>
            </div>
            <div className="relative p-8 rounded-2xl backdrop-blur-sm border border-orange-500/30 shadow-lg"
                 style={{ background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.08) 0%, rgba(245, 101, 101, 0.04) 100%)' }}>
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-400 to-red-400 rounded-full" />
              <div className="pl-6 whitespace-pre-wrap leading-relaxed text-gray-100 font-medium text-lg">
                {data.veteran_example}
              </div>
            </div>
          </motion.div>
        )}

        {/* Formulas Section (if available) - Enhanced spacing */}
        {data.formulas && data.formulas.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="space-y-8"
          >
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 text-purple-400 font-bold text-xl">∑</div>
              <h3 className="text-2xl font-bold text-white">Mathematical Formulas</h3>
            </div>
            <div className="space-y-8">
              {data.formulas.map((formula, index) => (
                <motion.div
                  key={index}
                  className="relative p-8 rounded-2xl backdrop-blur-sm border border-purple-500/30 shadow-lg"
                  style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(124, 58, 237, 0.04) 100%)' }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                >
                  <h4 className="text-xl font-bold text-purple-300 mb-6">{formula.name}</h4>
                  <div className="bg-black/40 p-4 sm:p-6 rounded-xl border border-purple-500/40 mb-6 overflow-x-auto">
                   <code className="text-purple-200 font-mono text-base sm:text-xl break-words">{formula.expression}</code>
                  </div>
                  {formula.variables && formula.variables.length > 0 && (
                    <div className="space-y-4">
                      <h5 className="text-lg font-semibold text-gray-300">Variables:</h5>
                      <div className="grid grid-cols-1 gap-3 sm:gap-4">
                       {formula.variables.map((variable, varIndex) => (
                         <div key={varIndex} className="flex items-start sm:items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg bg-white/5 border border-white/10">
                           <code className="text-purple-300 font-mono font-bold text-base sm:text-lg flex-shrink-0">{variable.symbol}</code>
                           <div className="flex-1 min-w-0">
                             <span className="text-gray-200 text-sm sm:text-base break-words">{variable.meaning}</span>
                             {variable.units && (
                               <span className="text-gray-400 text-xs sm:text-sm ml-2">({variable.units})</span>
                             )}
                           </div>
                         </div>
                       ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Enhanced bottom padding to prevent cutoff */}
      <div className="h-20 sm:h-12" />

      {/* Floating accent elements */}
      <motion.div 
        className="absolute top-8 right-8 w-24 h-24 rounded-full opacity-[0.03] blur-2xl pointer-events-none"
        style={{ background: 'linear-gradient(45deg, #8B5CF6, #3B82F6)' }}
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360]
        }}
        transition={{ 
          duration: 15, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      />
    </motion.div>
  );
}