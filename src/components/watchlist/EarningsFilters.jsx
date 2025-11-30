import React from 'react';
import { motion } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SegmentedControl = ({ options, selected, setSelected }) => ( // Removed theme prop from here
  <div className="flex items-center space-x-1 p-1.5 rounded-2xl bg-black/20 border border-white/10 backdrop-blur-xl">
    {options.map((option) => (
      <button
        key={option}
        onClick={() => setSelected(option)}
        className="relative px-4 py-2 text-sm font-bold rounded-xl transition-colors duration-300"
        style={{
            color: selected === option ? '#FFFFFF' : '#94A3B8'
        }}
      >
        {selected === option && (
          <motion.div
            layoutId="earningsFilterHighlight"
            className="absolute inset-0 rounded-xl bg-white/10 shadow-md"
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
          />
        )}
        <span className="relative z-10">{option}</span>
      </button>
    ))}
  </div>
);

const FilterDropdown = ({ value, onValueChange, placeholder, items }) => ( // Removed theme prop from here
  <Select value={value} onValueChange={onValueChange}>
    <SelectTrigger 
      className="w-[180px] text-sm font-semibold bg-black/20 border-white/10 text-gray-300 rounded-xl py-3 px-4 focus:ring-blue-500 focus:border-blue-500"
      aria-label={placeholder}
    >
      <SelectValue placeholder={placeholder} />
    </SelectTrigger>
    <SelectContent className="bg-[#1A1D29]/90 backdrop-blur-2xl border-white/20 text-gray-200">
      {items.map(item => (
        <SelectItem key={item.value} value={item.value} className="focus:bg-blue-500/20">{item.label}</SelectItem>
      ))}
    </SelectContent>
  </Select>
);

export default function EarningsFilters({ filters, setFilters, theme }) {
  const segmentOptions = ['Upcoming', 'Today', 'Past', 'My Watchlist'];
  const timeframeItems = [
    { value: '7d', label: 'Next 7 Days' },
    { value: '14d', label: 'Next 14 Days' },
    { value: '30d', label: 'Next 30 Days' },
    { value: 'quarter', label: 'This Quarter' },
  ];
  const sortItems = [
    { value: 'date', label: 'Sort by Date' },
    { value: 'marketCap', label: 'Sort by Market Cap' },
    { value: 'ticker', label: 'Sort by Ticker' },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <SegmentedControl
        options={segmentOptions}
        selected={filters.category}
        setSelected={(val) => setFilters(f => ({ ...f, category: val }))}
        // theme={theme} // theme prop removed as styling is now hardcoded for dark
      />
      <div className="flex items-center gap-3">
        <FilterDropdown
          value={filters.timeframe}
          onValueChange={(val) => setFilters(f => ({ ...f, timeframe: val }))}
          placeholder="Select timeframe"
          items={timeframeItems}
          // theme={theme} // theme prop removed as styling is now hardcoded for dark
        />
        <FilterDropdown
          value={filters.sortBy}
          onValueChange={(val) => setFilters(f => ({ ...f, sortBy: val }))}
          placeholder="Sort by"
          items={sortItems}
          // theme={theme} // theme prop removed as styling is now hardcoded for dark
        />
      </div>
    </div>
  );
}