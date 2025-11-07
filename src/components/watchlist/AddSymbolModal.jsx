import React, { useState } from 'react';
import { X, Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AddSymbolModal({ isOpen, onClose, onAdd }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions] = useState([
    { symbol: 'META', name: 'Meta Platforms Inc.', sector: 'Technology' },
    { symbol: 'NFLX', name: 'Netflix Inc.', sector: 'Communication' },
    { symbol: 'AMD', name: 'Advanced Micro Devices', sector: 'Technology' },
    { symbol: 'CRM', name: 'Salesforce Inc.', sector: 'Technology' },
    { symbol: 'UBER', name: 'Uber Technologies', sector: 'Consumer' }
  ]);

  const filteredSuggestions = suggestions.filter(stock =>
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = (symbol) => {
    onAdd(symbol);
    setSearchTerm('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      handleAdd(searchTerm.trim().toUpperCase());
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[500px] md:max-h-[600px] z-50">
        <div className="w-full h-full backdrop-blur-xl bg-[rgba(251,251,253,0.95)] dark:bg-[rgba(18,20,28,0.95)] rounded-2xl border border-black/5 dark:border-white/5 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-black/5 dark:border-white/5">
            <h3 className="text-xl font-semibold">Add Symbol</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="w-9 h-9 rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Search */}
          <div className="p-6 border-b border-black/5 dark:border-white/5">
            <form onSubmit={handleSubmit} className="flex space-x-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#A8B3C7]" />
                <Input
                  placeholder="Search symbol or company name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12"
                  autoFocus
                />
              </div>
              <Button 
                type="submit"
                disabled={!searchTerm.trim()}
                className="bg-gradient-to-r from-[#4DA3FF] to-[#58E3A4] text-white px-6"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </form>
          </div>

          {/* Suggestions */}
          <div className="p-6 max-h-96 overflow-y-auto">
            <h4 className="font-medium mb-4 text-[#A8B3C7]">
              {searchTerm ? 'Search Results' : 'Popular Symbols'}
            </h4>
            
            <div className="space-y-2">
              {(searchTerm ? filteredSuggestions : suggestions).map((stock) => (
                <div
                  key={stock.symbol}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors"
                  onClick={() => handleAdd(stock.symbol)}
                >
                  <div>
                    <div className="font-mono font-bold text-[#4DA3FF]">
                      {stock.symbol}
                    </div>
                    <div className="text-sm text-[#A8B3C7]">
                      {stock.name}
                    </div>
                    <div className="text-xs text-[#A8B3C7]">
                      {stock.sector}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            {searchTerm && filteredSuggestions.length === 0 && (
              <div className="text-center py-8">
                <p className="text-[#A8B3C7] mb-4">No results found for "{searchTerm}"</p>
                <Button
                  onClick={() => handleAdd(searchTerm.trim().toUpperCase())}
                  className="bg-gradient-to-r from-[#4DA3FF] to-[#58E3A4] text-white"
                >
                  Add "{searchTerm.trim().toUpperCase()}" anyway
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}