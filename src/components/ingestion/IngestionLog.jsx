import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from 'date-fns';
import { Terminal } from 'lucide-react';

export default function IngestionLog({ logs }) {
    const getLogColor = (type) => {
        switch (type) {
            case 'success':
                return 'text-green-400 font-semibold';
            case 'error':
                return 'text-red-400 font-semibold';
            case 'warn':
                return 'text-yellow-400 font-semibold';
            case 'system':
                return 'text-blue-400 font-bold';
            default:
                return 'text-gray-300';
        }
    };

    return (
        <Card className="bg-gray-800 border-gray-700/60 shadow-xl">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-100 font-bold">
                    <Terminal className="w-5 h-5" />
                    Ingestion Log
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-64 w-full bg-black rounded-md p-4 font-mono text-sm border border-gray-700">
                    {logs.map((log, index) => (
                        <div key={index} className="flex gap-4 items-start">
                            <span className="text-gray-500 flex-shrink-0">{format(log.time, 'HH:mm:ss')}</span>
                            <span className={`${getLogColor(log.type)} flex-shrink-0`}>[{log.type.toUpperCase()}]</span>
                            <p className="whitespace-pre-wrap break-words text-gray-300">{log.message}</p>
                        </div>
                    ))}
                </ScrollArea>
            </CardContent>
        </Card>
    );
}