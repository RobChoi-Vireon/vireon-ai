import React, { createContext, useContext, useState, useCallback } from 'react';
import MiniStatSheet from '../global/MiniStatSheet';
import { useFeatureFlags } from './FeatureFlags';

const MiniSheetContext = createContext();

export const useMiniSheet = () => {
  const context = useContext(MiniSheetContext);
  if (!context) {
    throw new Error('useMiniSheet must be used within a MiniSheetProvider');
  }
  return context;
};

export const MiniSheetProvider = ({ children }) => {
  const { isEnabled } = useFeatureFlags();
  const [sheetState, setSheetState] = useState({
    isOpen: false,
    data: null,
    position: { top: 0, left: 0 },
  });

  const openMiniSheet = useCallback((data, position) => {
    if (!isEnabled('labs_modules')) return;
    setSheetState({ isOpen: true, data, position });
  }, [isEnabled]);

  const closeMiniSheet = useCallback(() => {
    setSheetState(prevState => ({ ...prevState, isOpen: false }));
  }, []);

  return (
    <MiniSheetContext.Provider value={{ openMiniSheet, closeMiniSheet }}>
      {children}
      <MiniStatSheet
        isOpen={sheetState.isOpen}
        onClose={closeMiniSheet}
        data={sheetState.data}
        position={sheetState.position}
      />
    </MiniSheetContext.Provider>
  );
};