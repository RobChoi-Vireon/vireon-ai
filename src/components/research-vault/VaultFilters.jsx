import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, LayoutGrid, List } from 'lucide-react';

export default function VaultFilters({ searchTerm, setSearchTerm, activeFilters, setActiveFilters, view, setView }) {
    
    const handleFilterChange = (key, value) => {
        setActiveFilters(prev => ({...prev, [key]: value}));
    };

    return (
        <div className="bg-gray-800/50 border border-gray-700/60 p-4 rounded-xl flex flex-wrap gap-4 items-center">
            {/* Search */}
            <div className="relative flex-grow min-w-[250px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                    placeholder="Search vault (content, tags, tickers...)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-900/50 border-gray-700 text-gray-100"
                />
            </div>
            
            {/* Filters */}
            <Select value={activeFilters.source} onValueChange={(v) => handleFilterChange('source', v)}>
                <SelectTrigger className="w-36 bg-gray-800 border-gray-700 text-gray-300">
                    <SelectValue placeholder="Source"/>
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
                    <SelectItem value="all">All Sources</SelectItem>
                    <SelectItem value="File Upload">File Uploads</SelectItem>
                    <SelectItem value="Smart Note">Smart Notes</SelectItem>
                    <SelectItem value="Chat Log">Chat Logs</SelectItem>
                    <SelectItem value="Ingested Article">Ingested</SelectItem>
                </SelectContent>
            </Select>

            <Select value={activeFilters.sentiment} onValueChange={(v) => handleFilterChange('sentiment', v)}>
                <SelectTrigger className="w-36 bg-gray-800 border-gray-700 text-gray-300">
                    <SelectValue placeholder="Sentiment"/>
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
                    <SelectItem value="all">All Sentiments</SelectItem>
                    <SelectItem value="Bullish">Bullish</SelectItem>
                    <SelectItem value="Bearish">Bearish</SelectItem>
                    <SelectItem value="Neutral">Neutral</SelectItem>
                    <SelectItem value="Mixed">Mixed</SelectItem>
                </SelectContent>
            </Select>

            <Select value={activeFilters.status} onValueChange={(v) => handleFilterChange('status', v)}>
                <SelectTrigger className="w-36 bg-gray-800 border-gray-700 text-gray-300">
                    <SelectValue placeholder="Status"/>
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="starred">Starred</SelectItem>
                    <SelectItem value="follow-up">Follow-up</SelectItem>
                </SelectContent>
            </Select>

            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-gray-700/50 p-1 rounded-lg ml-auto">
                <Button variant={view === 'grid' ? 'default' : 'ghost'} size="icon" onClick={() => setView('grid')} className={view === 'grid' ? 'bg-blue-600' : 'text-gray-400'}>
                    <LayoutGrid className="w-4 h-4"/>
                </Button>
                <Button variant={view === 'list' ? 'default' : 'ghost'} size="icon" onClick={() => setView('list')} className={view === 'list' ? 'bg-blue-600' : 'text-gray-400'}>
                    <List className="w-4 h-4"/>
                </Button>
            </div>
        </div>
    );
}