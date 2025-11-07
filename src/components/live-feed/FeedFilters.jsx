import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

const FilterSelect = ({ label, value, onValueChange, options, theme }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger 
        className={`
          w-full md:w-56 px-6 py-4 rounded-2xl font-bold transition-all duration-300
          ${theme === 'dark' 
            ? 'bg-white/[0.08] border border-white/15 hover:bg-white/[0.12] hover:border-white/25 text-white' 
            : 'bg-black/[0.04] border border-black/[0.08] hover:bg-black/[0.08] hover:border-black/[0.12] text-black'
          }
          text-sm backdrop-blur-xl shadow-lg hover:shadow-xl
        `}
      >
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent 
        className={`
          rounded-2xl border backdrop-blur-2xl shadow-2xl
          ${theme === 'dark' 
            ? 'bg-[#1A1D29]/95 border-white/20' 
            : 'bg-white/95 border-black/10'
          }
        `}
      >
        <SelectItem value="All" className="font-bold text-base py-3 px-4 rounded-xl">All {label}s</SelectItem>
        {options.map(option => (
          <SelectItem key={option} value={option} className="font-medium text-base py-3 px-4 rounded-xl hover:bg-white/10">
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </motion.div>
);

export default function FeedFilters({ filters, setFilters, theme }) {
  const sectors = ["Technology", "Energy", "Healthcare", "Financial Services", "Consumer", "Industrial"];
  const categories = ["Macro", "Fed Policy", "Earnings", "Geopolitics", "M&A"];
  const impacts = ["High (7+)", "Medium (4-6)", "Low (1-3)"];

  return (
    <motion.div 
      className={`
        relative overflow-hidden rounded-3xl p-8 md:p-10 backdrop-blur-xl border
        ${theme === 'dark' 
          ? 'bg-gradient-to-br from-[#1A1D29]/80 to-[#12141C]/80 border-white/15' 
          : 'bg-gradient-to-br from-white/90 to-white/80 border-black/[0.08]'
        }
        shadow-2xl
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent" />
      
      <div className="relative z-10">
        <motion.div 
          className="flex items-center gap-4 text-2xl font-black mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div 
            className={`w-14 h-14 rounded-3xl flex items-center justify-center backdrop-blur-sm ${theme === 'dark' ? 'bg-blue-500/20 border border-blue-500/30' : 'bg-blue-100 border border-blue-300'}`}
            whileHover={{ scale: 1.1, rotate: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <SlidersHorizontal className={`w-7 h-7 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} strokeWidth={2.5} />
          </motion.div>
          <div>
            <span className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} style={{
              background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: theme === 'dark' ? 'transparent' : 'inherit',
              backgroundClip: 'text'
            }}>
              Filter News
            </span>
            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Refine your feed by sector, category, and impact level
            </p>
          </div>
        </motion.div>
        
        <div className="flex flex-col md:flex-row gap-6">
          <FilterSelect 
            label="Sector" 
            value={filters.sector} 
            onValueChange={val => setFilters(f => ({...f, sector: val}))} 
            options={sectors} 
            theme={theme} 
          />
          <FilterSelect 
            label="Category" 
            value={filters.category} 
            onValueChange={val => setFilters(f => ({...f, category: val}))} 
            options={categories} 
            theme={theme} 
          />
          <FilterSelect 
            label="Impact" 
            value={filters.impact} 
            onValueChange={val => setFilters(f => ({...f, impact: val}))} 
            options={impacts} 
            theme={theme} 
          />
        </div>
      </div>

      {/* Ambient background element */}
      <motion.div 
        className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10 blur-2xl"
        style={{ background: 'linear-gradient(45deg, #4D8FFB, #CA33FF)' }}
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360]
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      />
    </motion.div>
  );
}