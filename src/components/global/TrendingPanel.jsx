import React from 'react';
import { Flame } from 'lucide-react';

const trendingTopics = [
    "AI Chip Demand",
    "Fed Rate Path",
    "Consumer Spending Data",
    "China EV Market",
];

export default function TrendingPanel({ theme }) {
    return (
        <div className="border-l border-white/10 pl-4">
             <h3 className="text-xs font-semibold text-gray-400 px-2 mb-2 flex items-center gap-2"><Flame className="w-3.5 h-3.5" /> Trending</h3>
             <div className="space-y-1">
                {trendingTopics.map(topic => (
                    <div key={topic} className="p-2 rounded-lg text-sm hover:bg-white/[0.05] cursor-pointer">{topic}</div>
                ))}
            </div>
        </div>
    );
}