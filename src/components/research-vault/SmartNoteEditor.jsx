import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Save, Loader2, X } from 'lucide-react';

export default function SmartNoteEditor({ onClose, onSaveComplete }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return;
    setIsSaving(true);
    try {
      await base44.entities.ResearchAsset.create({
        title: title,
        content: content,
        tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
        asset_type: 'Smart Note',
        source: 'Manual Entry'
        // In a real app, AI could analyze the note content to add more metadata
      });
      onSaveComplete();
      onClose();
    } catch (error) {
      console.error("Error saving note:", error);
    }
    setIsSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl border border-gray-700">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-100">Create a Smart Note</h2>
             <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5"/>
            </Button>
          </div>
          <div className="space-y-4">
            <Input
              placeholder="Note Title (e.g., 'Q1 NVDA Earnings Prep')"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-gray-900/50 border-gray-700 text-gray-100 placeholder:text-gray-500 text-lg"
            />
            <Textarea
              placeholder="Start writing your research note, investment memo, or meeting summary here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="bg-gray-900/50 border-gray-700 text-gray-200 min-h-[200px]"
            />
            <Input
              placeholder="Tags (comma-separated, e.g., AI, Earnings, Risk)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="bg-gray-900/50 border-gray-700 text-gray-100 placeholder:text-gray-500"
            />
          </div>
        </div>
        <div className="bg-gray-900/50 px-6 py-4 rounded-b-xl flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} className="bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving || !title.trim() || !content.trim()} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : <Save className="w-4 h-4 mr-2"/>}
            Save Note
          </Button>
        </div>
      </div>
    </div>
  );
}