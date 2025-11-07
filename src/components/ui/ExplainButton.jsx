import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Lightbulb, RefreshCw } from 'lucide-react';
import { InvokeLLM } from '@/integrations/Core';
import { Skeleton } from '@/components/ui/skeleton';

export default function ExplainButton({ text, promptPrefix = "Explain this in simple terms: " }) {
  const [isOpen, setIsOpen] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getExplanation = async () => {
    if (!isOpen) return;
    setIsLoading(true);
    setExplanation('');
    try {
      const response = await InvokeLLM({ prompt: `${promptPrefix} "${text}"` });
      setExplanation(response);
    } catch (error) {
      console.error("Failed to get explanation:", error);
      setExplanation("Sorry, I couldn't generate an explanation at this time.");
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open);
        if(open) {
            // Delay fetching until dialog is fully open to avoid jank
            setTimeout(getExplanation, 100);
        }
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="bg-yellow-400/10 border-yellow-400/30 text-yellow-300 hover:bg-yellow-400/20 hover:text-yellow-200">
          <Lightbulb className="w-4 h-4 mr-2" />
          Explain
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border-gray-700 text-gray-200">
        <DialogHeader>
          <DialogTitle className="text-white">Simple Explanation</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {isLoading ? (
            <div className="space-y-2">
                <Skeleton className="h-4 w-full bg-gray-700" />
                <Skeleton className="h-4 w-full bg-gray-700" />
                <Skeleton className="h-4 w-3/4 bg-gray-700" />
            </div>
          ) : (
            <p className="leading-relaxed">{explanation}</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}