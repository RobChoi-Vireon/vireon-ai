import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Settings, Search } from 'lucide-react';

const alerts = [
    { id: 1, priority: 'Critical', content: 'NVDA price moved +5.2% on record volume spike.', ticker: 'NVDA', type: 'Price Move', time: '1 min ago', portfolio: true },
    { id: 2, priority: 'High', content: 'FED Meeting Minutes released, indicates hawkish stance.', ticker: 'MACRO', type: 'Macro', time: '5 min ago', portfolio: false },
    { id: 3, priority: 'Normal', content: 'New sentiment analysis for AAPL shows increasing bearishness.', ticker: 'AAPL', type: 'Sentiment', time: '12 min ago', portfolio: true },
];

const priorityColors = {
    'Critical': 'bg-red-500 border-red-500',
    'High': 'bg-orange-500 border-orange-500',
    'Normal': 'bg-blue-500 border-blue-500'
};

export default function AlertCenter() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            <div className="lg:col-span-2">
                <Card className="bg-gray-800/50 border border-gray-700/60 text-gray-200 h-full flex flex-col">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Real-Time Alert Feed</CardTitle>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">All</Button>
                            <Button variant="ghost" size="sm" className="text-red-400">Critical</Button>
                            <Button variant="ghost" size="sm">Portfolio-Only</Button>
                            <Button variant="ghost" size="sm">Follow-Up</Button>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-3 overflow-y-auto">
                        {alerts.map(alert => (
                             <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${priorityColors[alert.priority]} bg-gray-900/50`}>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <Badge variant="secondary" className="bg-gray-700 text-gray-300">{alert.type}</Badge>
                                        <Badge variant="outline" className="border-gray-600 font-mono">${alert.ticker}</Badge>
                                        <p className="text-sm">{alert.content}</p>
                                    </div>
                                    <span className="text-xs text-gray-500">{alert.time}</span>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
            <div className="space-y-6">
                <Card className="bg-gray-800/50 border border-gray-700/60 text-gray-200">
                    <CardHeader><CardTitle>AI Summary Panel</CardTitle></CardHeader>
                    <CardContent><p className="text-gray-400 text-sm">Top Signal: NVDA volume suggests institutional buying. Monitor for follow-through. FED minutes imply risk-off for tech.</p></CardContent>
                </Card>
                <Card className="bg-gray-800/50 border border-gray-700/60 text-gray-200">
                    <CardHeader><CardTitle>Custom Alert Settings</CardTitle></CardHeader>
                    <CardContent><p className="text-gray-400">Alert settings UI goes here.</p></CardContent>
                </Card>
            </div>
        </div>
    );
}