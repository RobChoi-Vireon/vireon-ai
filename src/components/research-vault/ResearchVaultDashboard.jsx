import React, { useState, useEffect, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

import VaultFilters from './VaultFilters';
import AssetUploader from './AssetUploader';
import SmartNoteEditor from './SmartNoteEditor';
import AssetCard from './AssetCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function ResearchVaultDashboard() {
  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState('grid'); // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    source: 'all',
    category: 'all',
    sentiment: 'all',
    status: 'all'
  });
  const [showUploader, setShowUploader] = useState(false);
  const [showNoteEditor, setShowNoteEditor] = useState(false);

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    setIsLoading(true);
    try {
      const data = await base44.entities.ResearchAsset.list('-created_date', 100);
      setAssets(data);
    } catch (error) {
      console.error('Error loading research assets:', error);
    }
    setIsLoading(false);
  };

  const handleAssetUpdate = (updatedAsset) => {
    setAssets(prevAssets => 
      prevAssets.map(asset => asset.id === updatedAsset.id ? updatedAsset : asset)
    );
  };

  const handleAssetDelete = async (assetId) => {
    try {
        await base44.entities.ResearchAsset.delete(assetId);
        setAssets(prevAssets => prevAssets.filter(asset => asset.id !== assetId));
    } catch(error) {
        console.error("Error deleting asset:", error);
    }
  };

  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      // Search logic (searches title, summary, content, tags)
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === '' ||
        asset.title?.toLowerCase().includes(searchLower) ||
        asset.ai_summary?.toLowerCase().includes(searchLower) ||
        asset.content?.toLowerCase().includes(searchLower) ||
        asset.tags?.some(tag => tag.toLowerCase().includes(searchLower)) ||
        asset.detected_tickers?.some(ticker => ticker.toLowerCase().includes(searchLower));

      // Filter logic
      const matchesSource = activeFilters.source === 'all' || asset.source === activeFilters.source;
      const matchesSentiment = activeFilters.sentiment === 'all' || asset.sentiment === activeFilters.sentiment;
      
      const matchesStatus = activeFilters.status === 'all' ||
        (activeFilters.status === 'starred' && asset.is_starred) ||
        (activeFilters.status === 'follow-up' && asset.is_flagged_for_follow_up);

      return matchesSearch && matchesSource && matchesSentiment && matchesStatus;
    });
  }, [assets, searchTerm, activeFilters]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-gray-950 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Research Vault</h1>
          <p className="text-gray-400">Your institutional memory, powered by AI.</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setShowUploader(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <Plus className="w-4 h-4 mr-2" /> Upload Content
          </Button>
           <Button onClick={() => setShowNoteEditor(true)} variant="outline" className="bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700">
            <Plus className="w-4 h-4 mr-2" /> New Note
          </Button>
        </div>
      </div>

      {/* Filters */}
      <VaultFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeFilters={activeFilters}
        setActiveFilters={setActiveFilters}
        view={view}
        setView={setView}
      />
      
      {/* Asset Grid/List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => (
             <Card key={i} className="bg-gray-800/50 border border-gray-700/60 p-4">
                <Skeleton className="h-5 w-3/4 mb-3 bg-gray-700"/>
                <Skeleton className="h-3 w-1/2 mb-4 bg-gray-700"/>
                <Skeleton className="h-12 w-full mb-4 bg-gray-700"/>
                <div className="flex gap-2">
                    <Skeleton className="h-5 w-16 bg-gray-700"/>
                    <Skeleton className="h-5 w-16 bg-gray-700"/>
                </div>
             </Card>
          ))}
        </div>
      ) : (
        <div className={`grid gap-6 ${view === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {filteredAssets.map(asset => (
            <AssetCard 
                key={asset.id} 
                asset={asset} 
                onUpdate={handleAssetUpdate}
                onDelete={handleAssetDelete}
            />
          ))}
        </div>
      )}

      {filteredAssets.length === 0 && !isLoading && (
          <div className="text-center py-16">
              <h3 className="text-lg font-semibold text-gray-200">No assets found</h3>
              <p className="text-gray-500">Try adjusting your filters or uploading new content.</p>
          </div>
      )}

      {/* Uploader Modal */}
      {showUploader && <AssetUploader onClose={() => setShowUploader(false)} onUploadComplete={loadAssets} />}
      
      {/* Note Editor Modal */}
      {showNoteEditor && <SmartNoteEditor onClose={() => setShowNoteEditor(false)} onSaveComplete={loadAssets} />}
    </div>
  );
}