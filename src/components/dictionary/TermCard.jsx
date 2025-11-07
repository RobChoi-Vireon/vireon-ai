
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { 
  ChevronsUpDown, 
  Layers, 
  Lightbulb, 
  Copy, 
  Bookmark, 
  BookText, 
  GitCompare,
  ExternalLink,
  Heart,
  Clock
} from 'lucide-react';
import FirstPrinciplesPanel from './FirstPrinciplesPanel';

const categoryColors = {
  "#CorporateFinance": "bg-blue-900/30 text-blue-300 border-blue-700/50",
  "#Accounting": "bg-green-900/30 text-green-300 border-green-700/50",
  "#Investments": "bg-purple-900/30 text-purple-300 border-purple-700/50",
  "#Derivatives": "bg-red-900/30 text-red-300 border-red-700/50",
  "#Macro": "bg-yellow-900/30 text-yellow-300 border-yellow-700/50",
  "#Quant": "bg-cyan-900/30 text-cyan-300 border-cyan-700/50",
  "#RiskManagement": "bg-orange-900/30 text-orange-300 border-orange-700/50",
  "#PrivateEquity": "bg-indigo-900/30 text-indigo-300 border-indigo-700/50",
  "#Fintech": "bg-pink-900/30 text-pink-300 border-pink-700/50",
  "#Regulation": "bg-gray-900/30 text-gray-300 border-gray-700/50"
};

const difficultyColors = {
  "#Beginner": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  "#Intermediate": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  "#Advanced": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
};

export default function TermCard({ term, onTermClick, onAddToCompare, isInCompare }) {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState('pro'); // 'pro', 'simple', 'eli12'
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleCopy = (text) => {
    if (text) {
      navigator.clipboard.writeText(text);
      // Could add toast notification here
    }
  };

  const getCurrentDefinition = () => {
    switch (view) {
      case 'simple':
        return term.simple_terms?.one_liner || 'Simple definition not available.';
      case 'eli12':
        return term.simple_terms?.analogy || term.simple_terms?.one_liner || 'Simplified explanation not available.';
      default:
        return term.pro_definition || 'Professional definition not available.';
    }
  };

  return (
    <Card className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/60 transition-all hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        {/* Header */}
        <div className='p-6 border-b border-gray-700/60'>
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <CardTitle className="text-2xl font-bold text-gray-100 mb-3">
                {term.term}
              </CardTitle>
              
              {/* Difficulty and Category Tags */}
              <div className="flex flex-wrap gap-2">
                {term.difficulty_level && (
                  <Badge className={`${difficultyColors[term.difficulty_level]} h-6`}>
                    {term.difficulty_level.replace('#', '')}
                  </Badge>
                )}
                {term.category_tags?.map(tag => (
                  <Badge 
                    key={tag} 
                    variant="outline" 
                    className={`text-xs h-6 ${categoryColors[tag] || 'bg-gray-700/50 text-gray-300'}`}
                  >
                    {tag.replace('#', '')}
                  </Badge>
                ))}
              </div>

              {/* Aliases */}
              {term.aliases && term.aliases.length > 0 && (
                <div className="mt-4">
                  <span className="text-xs text-gray-500 uppercase tracking-wide">Also known as</span>
                  <p className="text-sm text-gray-400 italic mt-1">{term.aliases.join(', ')}</p>
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className='flex items-center gap-1'>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-gray-400 hover:text-gray-100"
                onClick={() => handleCopy(getCurrentDefinition())}
              >
                <Copy className="w-4 h-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className={`h-8 w-8 ${isBookmarked ? 'text-red-400' : 'text-gray-400'} hover:text-red-400`}
                onClick={() => setIsBookmarked(!isBookmarked)}
              >
                <Heart className={isBookmarked ? 'fill-current' : ''} />
              </Button>

              {onAddToCompare && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`h-8 w-8 ${isInCompare ? 'text-purple-400' : 'text-gray-400'} hover:text-purple-400`}
                  onClick={() => onAddToCompare(term)}
                  disabled={isInCompare}
                >
                  <GitCompare className="w-4 h-4" />
                </Button>
              )}
              
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-100">
                  <ChevronsUpDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
          
          {/* View Mode Switcher */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-1 rounded-lg bg-gray-900/50 p-1 border border-gray-700">
              <Button 
                size="sm" 
                onClick={() => setView('pro')} 
                variant={view === 'pro' ? 'secondary' : 'ghost'} 
                className={`h-7 px-3 text-xs ${view === 'pro' ? 'bg-blue-600 text-white' : 'text-gray-300'}`}
              >
                <BookText className="w-3 h-3 mr-1.5"/>
                MBA Standard
              </Button>
              <Button 
                size="sm" 
                onClick={() => setView('simple')} 
                variant={view === 'simple' ? 'secondary' : 'ghost'} 
                className={`h-7 px-3 text-xs ${view === 'simple' ? 'bg-green-600 text-white' : 'text-gray-300'}`}
              >
                <Lightbulb className="w-3 h-3 mr-1.5"/>
                Simple Terms
              </Button>
              <Button 
                size="sm" 
                onClick={() => setView('eli12')} 
                variant={view === 'eli12' ? 'secondary' : 'ghost'} 
                className={`h-7 px-3 text-xs ${view === 'eli12' ? 'bg-purple-600 text-white' : 'text-gray-300'}`}
              >
                <Heart className="w-3 h-3 mr-1.5"/>
                Like I'm 12
              </Button>
            </div>

            {term.sources && term.sources.length > 0 && (
              <Badge variant="outline" className="text-xs bg-gray-900/50 text-gray-400 border-gray-600">
                <ExternalLink className="w-3 h-3 mr-1" />
                {term.sources.length} source{term.sources.length !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </div>

        {/* Definition Content */}
        <CardContent className="p-6">
          <div className="prose prose-sm max-w-none prose-invert">
            <p className="text-lg text-gray-200 leading-relaxed">
              {getCurrentDefinition()}
            </p>
            
            {/* Analogy for simple view */}
            {view === 'simple' && term.simple_terms?.analogy && (
              <div className="mt-4 p-4 bg-blue-900/20 border-l-4 border-blue-500 rounded-r-lg">
                <p className="italic text-blue-200">
                  <strong>Think of it like this:</strong> {term.simple_terms.analogy}
                </p>
              </div>
            )}
          </div>
        </CardContent>

        {/* Expanded Content */}
        <CollapsibleContent>
          <div className="border-t border-gray-700/60">
            <div className="flex items-center gap-2 p-4 bg-gray-900/30">
              <Layers className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-bold text-gray-200">First-Principles Breakdown</h2>
              <Badge variant="outline" className="bg-indigo-900/30 text-indigo-300 border-indigo-700">
                Wharton Standard
              </Badge>
            </div>
            
            <FirstPrinciplesPanel principles={term.first_principles} />
            
            {/* Related Terms Full List */}
            {term.related_terms && term.related_terms.length > 0 && (
              <div className="p-6 border-t border-gray-700/60">
                <h4 className="text-base font-semibold text-gray-300 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Explore Related Concepts
                </h4>
                <div className="flex flex-wrap gap-2">
                  {term.related_terms.map(related => (
                    <Button
                      key={related}
                      variant="outline"
                      size="sm"
                      className="bg-gray-800/50 border-gray-600 hover:bg-gray-700 hover:border-blue-500"
                      onClick={() => onTermClick(related)}
                    >
                      {related}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Sources */}
            {term.sources && term.sources.length > 0 && (
              <div className="p-6 border-t border-gray-700/60 bg-gray-900/30">
                <h4 className="text-base font-semibold text-gray-300 mb-3">Academic & Industry Sources</h4>
                <div className="space-y-2">
                  {term.sources.map((source, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-400">
                      <ExternalLink className="w-3 h-3" />
                      <span>{source}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
