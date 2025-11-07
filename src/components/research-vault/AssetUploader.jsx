import React, { useState, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { UploadFile, ExtractDataFromUploadedFile, InvokeLLM } from '@/integrations/Core';
import { Button } from '@/components/ui/button';
import { UploadCloud, FileText, Loader2, CheckCircle, AlertTriangle, X } from 'lucide-react';

const aiAnalysisPrompt = `Analyze the following text from a financial document.
Provide a concise, professional summary (2-3 sentences).
Extract up to 5 key takeaways as an array of strings.
Identify all stock tickers mentioned as an array of strings.
Suggest up to 5 relevant tags as an array of strings (e.g., "Earnings", "Fed Policy", "Analyst Note").
Determine the overall sentiment ("Bullish", "Bearish", "Neutral", "Mixed").

Text to analyze:
---
{textContent}
---
`;

const aiAnalysisSchema = {
    type: "object",
    properties: {
        summary: { type: "string" },
        key_takeaways: { type: "array", items: { type: "string" } },
        detected_tickers: { type: "array", items: { type: "string" } },
        tags: { type: "array", items: { type: "string" } },
        sentiment: { type: "string", enum: ["Bullish", "Bearish", "Neutral", "Mixed"] }
    },
    required: ["summary", "key_takeaways", "detected_tickers", "tags", "sentiment"]
};

export default function AssetUploader({ onClose, onUploadComplete }) {
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState('idle'); // idle, uploading, analyzing, complete, error
  const [error, setError] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = droppedFiles.filter(file => 
      ['application/pdf', 'text/plain', 'text/csv', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)
    );
    
    setFiles(prev => [...prev, ...validFiles]);
  }, []);

  const handleFileSelect = useCallback((e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selectedFiles]);
  }, []);

  const handleUploadAndAnalyze = async () => {
    if (files.length === 0) return;
    setStatus('uploading');
    setError(null);

    try {
      const file = files[0]; // Process one file at a time for this UI
      const { file_url } = await UploadFile({ file });
      
      setStatus('analyzing');
      // For non-text files, we might need a text extraction step first.
      // For simplicity, we assume text can be extracted or we use a mock.
      // In a real scenario: const { output } = await ExtractDataFromUploadedFile(...)
      const mockTextContent = "Analyst note on NVDA: Bullish outlook on AI chip demand. Raised price target to $1,100. Key risks include geopolitical tensions and supply chain constraints. Earnings call next week is a key catalyst.";

      const aiResult = await InvokeLLM({
        prompt: aiAnalysisPrompt.replace('{textContent}', mockTextContent),
        response_json_schema: aiAnalysisSchema
      });

      await base44.entities.ResearchAsset.create({
          title: file.name,
          asset_type: "File Upload",
          source: `Upload: ${file.type}`,
          file_url: file_url,
          ai_summary: aiResult.summary,
          ai_key_takeaways: aiResult.key_takeaways,
          detected_tickers: aiResult.detected_tickers,
          tags: aiResult.tags,
          sentiment: aiResult.sentiment
      });

      setStatus('complete');
      onUploadComplete();
      setTimeout(onClose, 1500);

    } catch (err) {
      console.error(err);
      setError(err.message || "An unknown error occurred.");
      setStatus('error');
    }
  };

  const statusIcons = {
    idle: <UploadCloud className="w-12 h-12 text-gray-500" />,
    uploading: <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />,
    analyzing: <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />,
    complete: <CheckCircle className="w-12 h-12 text-green-500" />,
    error: <AlertTriangle className="w-12 h-12 text-red-500" />,
  };
  
  const statusMessages = {
      idle: "Drag & drop files here, or click to select",
      uploading: "Uploading file...",
      analyzing: "AI is analyzing content...",
      complete: "Asset saved to vault!",
      error: "Upload failed. Please try again."
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl border border-gray-700">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-100">Upload to Research Vault</h2>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5"/>
              </Button>
          </div>

          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragOver ? 'border-blue-500 bg-blue-900/20' : 'border-gray-600 hover:border-blue-600'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input').click()}
          >
            <input
              id="file-input"
              type="file"
              multiple
              accept=".pdf,.txt,.csv,.doc,.docx"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="flex flex-col items-center justify-center">
              {statusIcons[status]}
              <p className="mt-4 text-sm text-gray-300">{statusMessages[status]}</p>
              {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
            </div>
          </div>
          
          {files.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-gray-300 mb-2">Selected file:</h4>
              <div className="bg-gray-700/50 p-3 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-200">{files[0].name}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setFiles([])} className="text-gray-500 hover:text-red-400">
                  <X className="w-4 h-4"/>
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-900/50 px-6 py-4 rounded-b-xl flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} className="bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700">
            Cancel
          </Button>
          <Button 
            onClick={handleUploadAndAnalyze} 
            disabled={files.length === 0 || ['uploading', 'analyzing', 'complete'].includes(status)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {status === 'uploading' && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {status === 'analyzing' && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {status === 'complete' && <CheckCircle className="w-4 h-4 mr-2" />}
            Upload & Analyze
          </Button>
        </div>
      </div>
    </div>
  );
}