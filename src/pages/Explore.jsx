
import React, { useState, useEffect } from 'react';
import { FinancialTerm } from '@/entities/FinancialTerm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, BookOpen, BrainCircuit, Lightbulb } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import ExplainButton from '../components/ui/ExplainButton';

export default function Explore() {
  const [terms, setTerms] = useState([]);
  const [filteredTerms, setFilteredTerms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTerm, setSelectedTerm] = useState(null);

  useEffect(() => {
    const loadTerms = async () => {
      setIsLoading(true);
      try {
        const allTerms = await FinancialTerm.list();
        setTerms(allTerms);
        setFilteredTerms(allTerms);
        if(allTerms.length > 0) {
            setSelectedTerm(allTerms[0]);
        }
      } catch (error) {
        console.error("Error loading financial terms:", error);
      }
      setIsLoading(false);
    };
    loadTerms();
  }, []);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredTerms(terms);
    } else {
      setFilteredTerms(
        terms.filter(term =>
          term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (term.aliases && term.aliases.some(alias => alias.toLowerCase().includes(searchTerm.toLowerCase())))
        )
      );
    }
  }, [searchTerm, terms]);

  const renderTermContent = (term) => (
    <div className="space-y-6">
        <div>
            <h3 className="text-lg font-semibold text-gray-200 flex items-center gap-2"><BookOpen className="w-5 h-5 text-blue-400" /> Pro Definition</h3>
            <p className="text-gray-300 mt-2 text-base leading-relaxed">{term.pro_definition}</p>
        </div>
        <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/60">
            <h3 className="text-lg font-semibold text-gray-200 flex items-center gap-2"><Lightbulb className="w-5 h-5 text-yellow-400" /> Simple Terms</h3>
            <div className="mt-2 space-y-2">
                <p className="text-gray-300"><span className="font-semibold text-gray-100">One-Liner:</span> {term.simple_terms?.one_liner}</p>
                <p className="text-gray-300"><span className="font-semibold text-gray-100">Analogy:</span> {term.simple_terms?.analogy}</p>
            </div>
        </div>
         <div>
            <h3 className="text-lg font-semibold text-gray-200 flex items-center gap-2"><BrainCircuit className="w-5 h-5 text-purple-400" /> First Principles</h3>
             <div className="mt-2 space-y-3 text-gray-400">
                <p><span className="font-semibold text-gray-200">Premise:</span> {term.first_principles?.premise}</p>
                <div>
                  <h4 className="font-semibold text-gray-200">Applications:</h4>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                      {term.first_principles?.applications?.map((app, i) => <li key={i}>{app}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-200">Pitfalls:</h4>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                      {term.first_principles?.pitfalls?.map((pitfall, i) => <li key={i}>{pitfall}</li>)}
                  </ul>
                </div>
             </div>
        </div>
    </div>
  );

  return (
    <div className="p-6 min-h-screen bg-gray-950 text-gray-200" style={{ background: 'linear-gradient(180deg, #111827 0%, #0c0d24 100%)' }}>
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-white tracking-tight">Explore Concepts</h1>
        <p className="text-gray-300 mt-1 text-lg">Your interactive financial dictionary.</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
            <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                    placeholder="Search terms..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 bg-gray-800 border-gray-700 text-gray-200 w-full"
                />
            </div>
            <div className="space-y-2 max-h-[70vh] overflow-y-auto">
                {isLoading ? Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-12 w-full bg-gray-700" />) :
                 filteredTerms.map(term => (
                    <div key={term.id}
                         onClick={() => setSelectedTerm(term)}
                         className={`p-3 rounded-lg cursor-pointer border-2 ${selectedTerm?.id === term.id ? 'bg-blue-900/40 border-blue-600' : 'bg-gray-800/50 border-transparent hover:bg-gray-700/50'}`}>
                        <p className="font-semibold text-gray-100">{term.term}</p>
                        <p className="text-xs text-gray-400">{term.category_tags && term.category_tags.join(', ')}</p>
                    </div>
                ))}
            </div>
        </div>
        <div className="md:col-span-2">
            <Card className="bg-gray-900 border-gray-700/60">
                <CardHeader>
                    {selectedTerm ? (
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-2xl font-bold text-white">{selectedTerm.term}</CardTitle>
                            <ExplainButton text={`Explain the financial term "${selectedTerm.term}" in even simpler terms, like I'm ten years old.`} />
                        </div>
                    ) : <Skeleton className="h-8 w-1/2 bg-gray-700" />}
                </CardHeader>
                <CardContent>
                    {selectedTerm ? renderTermContent(selectedTerm) : <p className="text-gray-400">Select a term to see its definition.</p>}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
