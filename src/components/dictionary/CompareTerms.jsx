import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, X, GitCompare } from 'lucide-react';

const categoryColors = {
  "#CorporateFinance": "bg-blue-900/30 text-blue-300 border-blue-700/50",
  "#Accounting": "bg-green-900/30 text-green-300 border-green-700/50",
  "#Investments": "bg-purple-900/30 text-purple-300 border-purple-700/50",
  "#Derivatives": "bg-red-900/30 text-red-300 border-red-700/50",
  "#Macro": "bg-yellow-900/30 text-yellow-300 border-yellow-700/50",
  "#Quant": "bg-cyan-900/30 text-cyan-300 border-cyan-700/50"
};

export default function CompareTerms({ terms, onRemoveTerm, onBackToBrowse }) {
  if (terms.length === 0) {
    return (
      <Card className="bg-gray-800/50 border border-gray-700/60">
        <CardContent className="p-12 text-center">
          <GitCompare className="w-16 h-16 mx-auto text-gray-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-300 mb-2">No Terms Selected</h3>
          <p className="text-gray-500 mb-6">
            Select up to 2 terms from the dictionary to compare their definitions, formulas, and applications.
          </p>
          <Button onClick={onBackToBrowse} className="bg-blue-600 hover:bg-blue-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Browse
          </Button>
        </CardContent>
      </Card>
    );
  }

  const CompareSection = ({ title, getValue }) => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-200 mb-3 pb-2 border-b border-gray-700">
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {terms.map((term, index) => (
          <div key={term.id} className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs">Term {index + 1}</Badge>
              <span className="font-medium text-gray-200">{term.term}</span>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg">
              {getValue(term)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={onBackToBrowse} className="bg-gray-800">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Browse
          </Button>
          <h2 className="text-2xl font-bold text-gray-100">
            Compare Financial Terms ({terms.length}/2)
          </h2>
        </div>
      </div>

      {/* Selected Terms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {terms.map((term, index) => (
          <Card key={term.id} className="bg-gray-800/50 border border-gray-700/60">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-lg text-gray-100">{term.term}</CardTitle>
                <div className="flex flex-wrap gap-1 mt-2">
                  {term.category_tags?.slice(0, 3).map(tag => (
                    <Badge key={tag} className={`text-xs ${categoryColors[tag] || 'bg-gray-700'}`}>
                      {tag.replace('#', '')}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemoveTerm(term.id)}
                className="h-8 w-8 text-gray-400 hover:text-red-400"
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Comparison Sections */}
      <Card className="bg-gray-800/50 border border-gray-700/60">
        <CardContent className="p-6">
          <CompareSection
            title="Professional Definitions"
            getValue={(term) => (
              <p className="text-gray-200 text-sm leading-relaxed">
                {term.pro_definition || 'No definition available'}
              </p>
            )}
          />

          <CompareSection
            title="Simple Terms"
            getValue={(term) => (
              <div className="space-y-2">
                <p className="text-gray-200 text-sm">
                  {term.simple_terms?.one_liner || 'No simple explanation available'}
                </p>
                {term.simple_terms?.analogy && (
                  <p className="text-blue-200 text-sm italic bg-blue-900/20 p-2 rounded">
                    "{term.simple_terms.analogy}"
                  </p>
                )}
              </div>
            )}
          />

          {terms.every(term => term.first_principles?.formulas?.length > 0) && (
            <CompareSection
              title="Formulas"
              getValue={(term) => (
                <div className="space-y-2">
                  {term.first_principles.formulas.map((formula, idx) => (
                    <code key={idx} className="block text-green-300 font-mono text-sm bg-gray-900/50 p-2 rounded">
                      {formula}
                    </code>
                  ))}
                </div>
              )}
            />
          )}

          <CompareSection
            title="Applications"
            getValue={(term) => (
              <div className="space-y-1">
                {term.first_principles?.applications?.length > 0 ? (
                  term.first_principles.applications.map((app, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-indigo-400 mt-1">•</span>
                      <span>{app}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm italic">No applications listed</p>
                )}
              </div>
            )}
          />

          <CompareSection
            title="Common Pitfalls"
            getValue={(term) => (
              <div className="space-y-1">
                {term.first_principles?.pitfalls?.length > 0 ? (
                  term.first_principles.pitfalls.map((pitfall, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-red-400 mt-1">⚠</span>
                      <span>{pitfall}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm italic">No pitfalls listed</p>
                )}
              </div>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}