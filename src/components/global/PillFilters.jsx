import React from 'react';

const filters = ["Stocks", "ETFs", "Options", "News", "Sectors"];

export default function PillFilters({ theme }) {
    return (
        <div className="flex gap-2 mb-4 px-2">
            {filters.map(filter => (
                <button 
                    key={filter}
                    className={`px-3 py-1.5 text-sm font-semibold rounded-full transition-colors
                        ${theme === 'dark' 
                            ? 'bg-white/[0.08] hover:bg-white/[0.12] text-gray-300'
                            : 'bg-black/[0.04] hover:bg-black/[0.08] text-gray-600'
                        }
                    `}
                >
                    {filter}
                </button>
            ))}
        </div>
    );
}