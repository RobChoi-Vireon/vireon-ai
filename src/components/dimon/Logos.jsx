import React from 'react';

// Define the individual logo components.
// These are designed to accept a className prop which will control their size.
export const WashingtonPostLogo = ({ className }) => (
  <div className={`flex items-center justify-center bg-blue-600 ${className}`}>
    <span className="text-white font-bold text-xs">WP</span>
  </div>
);

export const NewYorkTimesLogo = ({ className }) => (
  <div className={`flex items-center justify-center bg-gray-800 ${className}`}>
    <span className="text-white font-bold text-xs">NYT</span>
  </div>
);

export const WallStreetJournalLogo = ({ className }) => (
  <div className={`flex items-center justify-center bg-orange-600 ${className}`}>
    <span className="text-white font-bold text-xs">WSJ</span>
  </div>
);

export const FinancialTimesLogo = ({ className }) => (
  <div className={`flex items-center justify-center bg-pink-600 ${className}`}>
    <span className="text-white font-bold text-xs">FT</span>
  </div>
);

export const EconomistLogo = ({ className }) => (
  <div className={`flex items-center justify-center bg-red-600 ${className}`}>
    <span className="text-white font-bold text-xs">E</span>
  </div>
);

// Map source keys (lowercase) to their respective component and display name.
// Exporting this map allows other components to render single logos easily.
export const sourceMap = {
  wapo: { Component: WashingtonPostLogo, name: 'Washington Post' },
  nyt: { Component: NewYorkTimesLogo, name: 'New York Times' },
  wsj: { Component: WallStreetJournalLogo, name: 'Wall Street Journal' },
  ft: { Component: FinancialTimesLogo, name: 'Financial Times' },
  economist: { Component: EconomistLogo, name: 'The Economist' },
};

/**
 * Renders a group of publication logos based on provided sources.
 * Each logo is displayed in a rounded container with dynamic sizing.
 */
const Logos = ({ sources = [], size = 8 }) => {
  // If no sources are provided or it's not an array, render nothing.
  if (!Array.isArray(sources) || sources.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center -space-x-2">
      {sources.map((sourceKey) => {
        // Retrieve the component and name info from the sourceMap using a lowercase key.
        const sourceInfo = sourceMap[sourceKey.toLowerCase()];

        // If a source key does not correspond to a known logo, skip rendering this item.
        if (!sourceInfo) {
          return null;
        }

        // Render each logo within a dynamically sized, rounded container.
        return (
          <div
            key={sourceKey} // Use the sourceKey as a unique key for list rendering.
            className={`w-${size} h-${size} rounded-full bg-white/10 border-2 border-neutral-800 flex items-center justify-center overflow-hidden shadow-md`}
            title={sourceInfo.name} // Provides an accessible tooltip on hover.
          >
            <sourceInfo.Component className="w-full h-full object-cover" />
          </div>
        );
      })}
    </div>
  );
};

export default Logos;