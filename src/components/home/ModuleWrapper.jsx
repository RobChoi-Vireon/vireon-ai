import React, { useState, useRef } from 'react';
import DragHandle from './DragHandle';

export default function ModuleWrapper({ 
  children, 
  moduleId, 
  title, 
  isReorderMode, 
  onMoveModule, 
  theme,
  index,
  id,
  ...props 
}) {
  const [isDragHandleVisible, setIsDragHandleVisible] = useState(false);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const longPressTimer = useRef(null);

  const handleMouseEnter = () => {
    if (isReorderMode) {
      setIsDragHandleVisible(true);
    }
  };

  const handleMouseLeave = () => {
    setIsDragHandleVisible(false);
  };

  const handleTouchStart = (e) => {
    if (isReorderMode) {
      longPressTimer.current = setTimeout(() => {
        setIsLongPressing(true);
        setIsDragHandleVisible(true);
        // Haptic feedback on mobile
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }
      }, 500);
    }
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
    setIsLongPressing(false);
  };

  return (
    <div
      className={`
        relative group
        ${isReorderMode ? 'cursor-move' : ''}
        transition-all duration-300
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      {...props}
    >
      {/* Module Header with Drag Handle */}
      {isReorderMode && (
        <div className="flex items-center justify-between mb-4 px-2">
          <h3 className={`font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            {title}
          </h3>
          <DragHandle 
            isVisible={isDragHandleVisible || isLongPressing}
            theme={theme}
          />
        </div>
      )}
      
      {/* Module Content */}
      <div className={isReorderMode ? 'pointer-events-none' : ''}>
        {children}
      </div>
      
      {/* Reorder Mode Overlay */}
      {isReorderMode && (
        <div className={`
          absolute inset-0 rounded-3xl border-2 border-dashed 
          ${theme === 'dark' ? 'border-purple-500/30' : 'border-purple-400/50'}
          bg-gradient-to-br from-purple-500/5 to-purple-600/5
          pointer-events-none
        `} />
      )}
    </div>
  );
}