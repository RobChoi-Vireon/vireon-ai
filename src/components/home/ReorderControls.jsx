
import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Check, Move } from 'lucide-react';

function ReorderControls({ 
  isReorderMode, 
  onToggleReorderMode, 
  onResetToDefault, 
  theme 
}) {
  return (
    <div className="flex items-center space-x-3">
      {isReorderMode ? (
        <>
          <Button
            onClick={onResetToDefault}
            variant="outline"
            size="sm"
            className={`
              ${theme === 'dark' 
                ? 'bg-white/[0.08] hover:bg-white/[0.12] border-white/10 text-gray-300' 
                : 'bg-black/[0.04] hover:bg-black/[0.08] border-black/[0.06] text-gray-600'
              }
            `}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset to Default
          </Button>
          <Button
            onClick={onToggleReorderMode}
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Check className="w-4 h-4 mr-2" />
            Done
          </Button>
        </>
      ) : (
        <Button
          onClick={onToggleReorderMode}
          variant="outline"
          size="sm"
          className={`
            ${theme === 'dark' 
              ? 'bg-white/[0.08] hover:bg-white/[0.12] border-white/10 text-gray-300' 
              : 'bg-black/[0.04] hover:bg-black/[0.08] border-black/[0.06] text-gray-600'
            }
          `}
        >
          <Move className="w-4 h-4 mr-2" />
          Reorder Modules
        </Button>
      )}
    </div>
  );
}

export default React.memo(ReorderControls);
