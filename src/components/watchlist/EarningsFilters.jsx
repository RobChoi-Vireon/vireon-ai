import React from 'react';
import { motion } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// ============================================================================
// OS HORIZON LIQUID GLASS TAHOE — DESIGN SYSTEM
// ============================================================================
const GLASS = {
  segmented: {
    bg: 'rgba(255, 255, 255, 0.05)',
    blur: 'blur(24px)',
    border: 'rgba(255, 255, 255, 0.10)',
    innerShadow: 'inset 0 0 16px rgba(255,255,255,0.03)'
  },
  pill: {
    activeBg: 'rgba(255, 255, 255, 0.10)',
    activeGlow: '0 0 16px rgba(140, 175, 255, 0.12)'
  },
  dropdown: {
    bg: 'rgba(255, 255, 255, 0.06)',
    blur: 'blur(24px)',
    border: 'rgba(255, 255, 255, 0.10)'
  }
};

// ============================================================================
// GLASS SEGMENTED CONTROL
// ============================================================================
const GlassSegmentedControl = ({ options, selected, setSelected }) => (
  <div 
    className="flex items-center p-1 rounded-2xl"
    style={{
      background: GLASS.segmented.bg,
      backdropFilter: GLASS.segmented.blur,
      WebkitBackdropFilter: GLASS.segmented.blur,
      border: `1px solid ${GLASS.segmented.border}`,
      boxShadow: GLASS.segmented.innerShadow
    }}
  >
    {options.map((option) => (
      <button
        key={option}
        onClick={() => setSelected(option)}
        className="relative px-3.5 py-2 text-sm font-semibold rounded-xl transition-colors duration-200"
        style={{
          color: selected === option ? 'rgba(255,255,255,0.95)' : 'rgba(200, 210, 230, 0.60)'
        }}
      >
        {selected === option && (
          <motion.div
            layoutId="earningsFilterHighlight"
            className="absolute inset-0 rounded-xl"
            style={{
              background: GLASS.pill.activeBg,
              boxShadow: GLASS.pill.activeGlow
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
          />
        )}
        <span className="relative z-10">{option}</span>
      </button>
    ))}
  </div>
);

// ============================================================================
// GLASS DROPDOWN
// ============================================================================
const GlassDropdown = ({ value, onValueChange, placeholder, items }) => (
  <Select value={value} onValueChange={onValueChange}>
    <SelectTrigger 
      className="w-[160px] text-sm font-semibold rounded-xl py-2.5 px-3.5 focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50"
      style={{
        background: GLASS.dropdown.bg,
        backdropFilter: GLASS.dropdown.blur,
        WebkitBackdropFilter: GLASS.dropdown.blur,
        border: `1px solid ${GLASS.dropdown.border}`,
        color: 'rgba(200, 210, 230, 0.85)'
      }}
      aria-label={placeholder}
    >
      <SelectValue placeholder={placeholder} />
    </SelectTrigger>
    <SelectContent 
      className="rounded-xl border"
      style={{
        background: 'rgba(22, 28, 42, 0.92)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderColor: 'rgba(255,255,255,0.12)',
        color: 'rgba(200, 210, 230, 0.90)'
      }}
    >
      {items.map(item => (
        <SelectItem 
          key={item.value} 
          value={item.value} 
          className="focus:bg-blue-500/15 rounded-lg"
        >
          {item.label}
        </SelectItem>
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
      <GlassSegmentedControl
        options={segmentOptions}
        selected={filters.category}
        setSelected={(val) => setFilters(f => ({ ...f, category: val }))}
      />
      <div className="flex items-center gap-2.5">
        <GlassDropdown
          value={filters.timeframe}
          onValueChange={(val) => setFilters(f => ({ ...f, timeframe: val }))}
          placeholder="Timeframe"
          items={timeframeItems}
        />
        <GlassDropdown
          value={filters.sortBy}
          onValueChange={(val) => setFilters(f => ({ ...f, sortBy: val }))}
          placeholder="Sort by"
          items={sortItems}
        />
      </div>
    </div>
  );
}