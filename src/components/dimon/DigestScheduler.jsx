import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Clock, Play, Settings, AlertCircle } from 'lucide-react';
import { generateDimonDigest } from '@/functions/generateDimonDigest';

export default function DigestScheduler({ theme }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastRun, setLastRun] = useState(null);
  const [slaStatus, setSlaStatus] = useState('on-track');

  const handleGenerateDigest = async () => {
    setIsGenerating(true);
    try {
      const response = await generateDimonDigest({
        targetDate: new Date().toISOString().split('T')[0]
      });
      setLastRun(new Date());
      console.log('Digest generated:', response.data);
    } catch (error) {
      console.error('Failed to generate digest:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    // Check SLA status (should be delivered by 05:00 ET)
    const now = new Date();
    const hour = now.getHours();
    if (hour >= 5 && hour < 9) {
      setSlaStatus('delivered');
    } else if (hour >= 4 && hour < 5) {
      setSlaStatus('generating');
    } else {
      setSlaStatus('scheduled');
    }
  }, []);

  return (
    <div className={`
      p-4 rounded-xl border
      ${theme === 'dark' ? 'bg-white/[0.05] border-white/10' : 'bg-black/[0.02] border-black/[0.06]'}
    `}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Clock className={`w-5 h-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
          <div>
            <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Daily Generation
            </span>
            <div className="flex items-center space-x-2 text-sm">
              <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                slaStatus === 'delivered' ? 'bg-green-500/20 text-green-400' :
                slaStatus === 'generating' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-blue-500/20 text-blue-400'
              }`}>
                {slaStatus === 'delivered' ? 'Delivered 05:00 ET' :
                 slaStatus === 'generating' ? 'Generating...' :
                 'Scheduled 04:30 ET'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerateDigest}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Generating
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Generate Now
              </>
            )}
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}