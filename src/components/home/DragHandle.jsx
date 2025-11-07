import React from 'react';
import { GripVertical } from 'lucide-react';

export default function DragHandle({ isVisible, theme, ...dragProps }) {
  return (
    <div
      {...dragProps}
      className={`
        flex items-center justify-center w-8 h-8 rounded-lg cursor-grab active:cursor-grabbing
        transition-all duration-200
        ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
        ${theme === 'dark' 
          ? 'bg-white/[0.08] hover:bg-white/[0.12] border border-white/10' 
          : 'bg-black/[0.04] hover:bg-black/[0.08] border border-black/[0.06]'
        }
        hover:scale-105
      `}
      title="Drag to reorder"
    >
      <GripVertical className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} />
    </div>
  );
}