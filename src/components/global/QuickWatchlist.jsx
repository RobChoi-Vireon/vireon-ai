import React from 'react';
import { Eye, TrendingUp, TrendingDown } from 'lucide-react';

const watchlistData = [
    { symbol: 'AAPL', price: '$189.25', change: '+1.85%', positive: true },
    { symbol: 'MSFT', price: '$384.30', change: '+0.95%', positive: true },
    { symbol: 'NVDA', price: '$875.50', change: '+3.42%', positive: true },
    { symbol: 'TSLA', price: '$248.75', change: '-1.25%', positive: false },
];

export default function QuickWatchlist({ theme }) {
    return (
        <div>
            <h3 className="text-xs font-semibold text-gray-400 px-2 mb-2 flex items-center gap-2"><Eye className="w-3.5 h-3.5" /> Watchlist</h3>
            <div className="space-y-1">
                {watchlistData.map(item => (
                    <div key={item.symbol} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/[0.05] cursor-pointer">
                        <span className="font-semibold">{item.symbol}</span>
                        <div className="flex items-center gap-3">
                            <span className="text-sm">{item.price}</span>
                            <span className={`text-sm font-semibold flex items-center gap-1 ${item.positive ? 'text-green-400' : 'text-red-400'}`}>
                                {item.positive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                                {item.change}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}