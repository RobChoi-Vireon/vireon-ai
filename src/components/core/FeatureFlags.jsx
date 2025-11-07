
import React, { createContext, useContext, useState, useEffect } from 'react';

const FeatureFlagsContext = createContext();

export const useFeatureFlags = () => {
  const context = useContext(FeatureFlagsContext);
  if (!context) {
    throw new Error('useFeatureFlags must be used within FeatureFlagsProvider');
  }
  return context;
};

const defaultFlags = {
  labs_modules: true, // Default ON - all new modules behind this flag
};

export const FeatureFlagsProvider = ({ children }) => {
  const [flags, setFlags] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vireon-feature-flags');
      return saved ? { ...defaultFlags, ...JSON.parse(saved) } : defaultFlags;
    }
    return defaultFlags;
  });

  const toggleFlag = (flagName) => {
    setFlags(prev => {
      const newFlags = { ...prev, [flagName]: !prev[flagName] };
      localStorage.setItem('vireon-feature-flags', JSON.stringify(newFlags));
      return newFlags;
    });
  };

  const isEnabled = (flagName) => {
    return flags[flagName] || false;
  };

  return (
    <FeatureFlagsContext.Provider value={{ flags, toggleFlag, isEnabled }}>
      {children}
    </FeatureFlagsContext.Provider>
  );
};
