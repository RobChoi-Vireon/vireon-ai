import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';

export default function DebouncedInput({ 
  value, 
  onChange, 
  delay = 300,
  ...props 
}) {
  const [internalValue, setInternalValue] = useState(value);

  const debouncedOnChange = useCallback(
    debounce((val) => onChange?.(val), delay),
    [onChange, delay]
  );

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  useEffect(() => {
    debouncedOnChange(internalValue);
  }, [internalValue, debouncedOnChange]);

  return (
    <Input
      {...props}
      value={internalValue}
      onChange={(e) => setInternalValue(e.target.value)}
    />
  );
}

// Debounce utility function
function debounce(func, wait, immediate) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
}