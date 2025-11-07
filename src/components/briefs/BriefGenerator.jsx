import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, BrainCircuit, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BriefGenerator({ onGenerate, isGenerating, disabled }) {
  return (
    <Card className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border-gray-700/60 shadow-2xl overflow-hidden">
      <CardContent className="p-8 text-center relative">
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{
            transform: [
              'scale(1.5) rotate(0deg) translate(0px, 0px)',
              'scale(1.6) rotate(5deg) translate(10px, -10px)',
              'scale(1.5) rotate(-5deg) translate(-10px, 10px)',
              'scale(1.5) rotate(0deg) translate(0px, 0px)',
            ],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        >
          <BrainCircuit className="w-full h-full text-blue-500" />
        </motion.div>

        <div className="relative z-10">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <Sparkles className="w-10 h-10 text-white" />
          </div>

          <h2 className="text-3xl font-bold text-gray-100 mb-2">
            Craft Your Intelligence Edge
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Leverage Vireon's AI to synthesize today's critical market news, sentiment shifts, and sector movements into a single, actionable brief.
          </p>

          <Button
            onClick={onGenerate}
            disabled={isGenerating || disabled}
            size="lg"
            className="bg-white text-gray-900 font-bold hover:bg-gray-200 h-14 px-10 text-lg shadow-lg transition-transform duration-200 ease-in-out hover:scale-105 disabled:bg-gray-500 disabled:scale-100"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-6 h-6 mr-3 animate-spin" />
                Analyzing Market...
              </>
            ) : (
              <>
                <BrainCircuit className="w-6 h-6 mr-3" />
                Generate Alpha Brief
              </>
            )}
          </Button>

          {disabled && !isGenerating && (
             <p className="text-sm text-yellow-400 mt-4">
                No recent news articles found. Ingest data first to generate a brief.
             </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}