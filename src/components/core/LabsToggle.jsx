
import React, { useState, useEffect } from 'react';
import { useFeatureFlags } from './FeatureFlags';
import { FlaskConical, Settings, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LabsToggle() {
  const { flags, toggleFlag } = useFeatureFlags();
  const [isOpen, setIsOpen] = useState(false);

  const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';

  // Add listener for the Escape key when the panel is open
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Cleanup the event listener when the component unmounts or the panel closes
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      {/* Labs Toggle Button - Now inline with other nav buttons */}
      <button
        onClick={() => setIsOpen(true)}
        className={`
          relative min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center
          transition-all duration-200 hover:scale-105 elevation-1 hover:elevation-2 card-hover
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
        `}
        aria-label="Labs Features"
      >
        <FlaskConical className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} strokeWidth={2} />
        {flags.labs_modules && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full border-2 border-white dark:border-gray-900" />
        )}
      </button>

      {/* Labs Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className={`
            relative w-full max-w-md rounded-2xl p-6 
            ${theme === 'dark' 
              ? 'bg-gradient-to-br from-[#1A1D29]/95 to-[#12141C]/95 border border-white/10' 
              : 'bg-gradient-to-br from-white/95 to-white/90 border border-black/[0.08]'
            }
            backdrop-blur-xl shadow-2xl
          `}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  ${theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-100'}
                `}>
                  <FlaskConical className={`w-4 h-4 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
                </div>
                <h2 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Labs Features
                </h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className={`
                  p-1.5 rounded-lg transition-colors
                  ${theme === 'dark' 
                    ? 'hover:bg-white/10 text-gray-400 hover:text-white' 
                    : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Enable experimental features and new modules for testing.
              </p>

              {/* Labs Modules Toggle */}
              <div className={`
                flex items-center justify-between p-4 rounded-xl
                ${theme === 'dark' 
                  ? 'bg-white/[0.05] border border-white/10' 
                  : 'bg-gray-50 border border-gray-200'
                }
              `}>
                <div>
                  <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Labs Modules
                  </h3>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Enable experimental features and new pages
                  </p>
                </div>
                <button
                  onClick={() => toggleFlag('labs_modules')}
                  className={`
                    relative w-11 h-6 rounded-full transition-colors duration-200
                    ${flags.labs_modules 
                      ? 'bg-purple-500' 
                      : theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
                    }
                  `}
                >
                  <div className={`
                    absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200
                    ${flags.labs_modules ? 'translate-x-5' : 'translate-x-0.5'}
                  `} />
                </button>
              </div>

              {flags.labs_modules && (
                <div className={`
                  p-3 rounded-lg text-xs
                  ${theme === 'dark' 
                    ? 'bg-purple-900/20 text-purple-300 border border-purple-500/20' 
                    : 'bg-purple-50 text-purple-700 border border-purple-200'
                  }
                `}>
                  ✨ Labs modules are now enabled. You'll see experimental features in the navigation.
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-white/10">
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                Snapshot: <span className="font-mono">vireon_baseline_ok</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
