import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Sparkles, AlertTriangle, Download, Copy, Save } from 'lucide-react';

import { InvokeLLM } from '@/integrations/Core';
import { ResearchAsset } from '@/entities/ResearchAsset';
import { FinancialTerm } from '@/entities/FinancialTerm';

import TermSearch from '../components/finance-dictionary/TermSearch';
import ProLevelCard from '../components/finance-dictionary/ProLevelCard';
import NoviceLevelCard from '../components/finance-dictionary/NoviceLevelCard';
import FirstPrinciplesCard from '../components/finance-dictionary/FirstPrinciplesCard';
import SidePanel from '../components/finance-dictionary/SidePanel';
import ResultSkeleton from '../components/finance-dictionary/ResultSkeleton';

const suggestedTerms = ["Duration (bond)", "Convexity", "Sharpe ratio", "Value at Risk (VaR)", "CAPM beta", "WACC", "OAS", "Repo"];

export default function FinanceDictionary() {
  const [theme, setTheme] = useState('dark');
  const [searchTerm, setSearchTerm] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [isCopied, setIsCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    setTheme(root.classList.contains('dark') ? 'dark' : 'light');
    const observer = new MutationObserver(() => setTheme(root.classList.contains('dark') ? 'dark' : 'light'));
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    
    const savedHistory = localStorage.getItem('vireon-dict-history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }

    return () => observer.disconnect();
  }, []);

  const updateHistory = (term) => {
    const newHistory = [term, ...history.filter(t => t !== term)].slice(0, 10);
    setHistory(newHistory);
    localStorage.setItem('vireon-dict-history', JSON.stringify(newHistory));
  };
  
  const handleSearch = useCallback(async (query) => {
    if (!query) return;
    
    setSearchTerm(query);
    setIsLoading(true);
    setError(null);
    setResult(null);
    setIsSaved(false);

    const systemPrompt = `You are the Vireon Finance Dictionary engine. For any finance/econ term, return ONLY JSON per schema. Provide:
- Pro Level: concise definition & example
- Veteran Definition & Example: deep, detail-oriented, advanced-level explanation for seasoned professionals
- Novice Level: plain-English definition & example
- First Principles: goal, core assumptions, logical relationships, derivation steps, sanity checks, edge cases
Keep concise fields short and direct. Veteran fields may be richer and more technical. Avoid fluff. No fake citations.`;
    const userPrompt = `Term: ${query}\nDepth Mode: detailed\nShow Math Steps: true\nReturn JSON per schema.`;

    try {
      const response = await InvokeLLM({
        prompt: `${systemPrompt}\n\n${userPrompt}`,
        response_json_schema: FinancialTerm.schema()
      });

      setResult(response);
      updateHistory(query);
    } catch (err) {
      console.error("Error fetching from Lyra:", err);
      setError("Couldn’t generate a clean answer. Try refining the term or check your connection.");
    } finally {
      setIsLoading(false);
    }
  }, [history]);

  const generateMarkdown = useCallback(() => {
    if (!result) return '';
    
    let md = `# ${result.term} - Vireon Finance Dictionary\n\n`;
    
    // Pro Level (Concise)
    md += `## Pro Level\n\n**Definition:** ${result.pro_level.definition}\n\n`;
    if (result.pro_level.formulas?.length > 0) {
        md += "**Formulas:**\n";
        result.pro_level.formulas.forEach(f => {
            md += `- **${f.name}:** \`\`\`\n${f.expression}\n\`\`\`\n`;
            if (f.variables?.length > 0) {
                f.variables.forEach(v => {
                    md += `  - *${v.symbol}*: ${v.meaning} ${v.units ? `(${v.units})` : ''}\n`;
                });
            }
        });
    }
    md += `\n**Example:**\n${result.pro_level.example}\n\n`;

    // Pro Level (Veteran)
    md += `## Veteran Level\n\n**Definition:** ${result.pro_level.veteran_definition}\n\n`;
    md += `**Example:**\n${result.pro_level.veteran_example}\n\n`;

    // Novice Level
    md += `## Novice Level\n\n**Definition:** ${result.novice_level.definition}\n\n`;
    md += `**Example:**\n${result.novice_level.example}\n\n`;

    // First Principles
    md += `## First Principles\n\n`;
    md += `* **Goal:** ${result.first_principles.goal}\n`;
    md += `* **Primitives:**\n${result.first_principles.primitives.map(p => `  - ${p}`).join('\n')}\n`;
    md += `* **Relationships:**\n${result.first_principles.relationships.map(r => `  - ${r}`).join('\n')}\n\n`;

    // Side Panel Info
    md += `--- \n\n`;
    md += `**Related Terms:** ${result.related_terms.join(', ')}\n\n`;
    md += `**Common Pitfalls:**\n${result.common_pitfalls.map(p => `- ${p}`).join('\n')}\n`;
    
    return md;
  }, [result]);

  const handleSave = async () => {
    if (!result) return;
    setIsSaved(true);
    try {
      await ResearchAsset.create({
        title: `Dictionary: ${result.term}`,
        asset_type: 'Smart Note',
        source: 'Vireon Finance Dictionary',
        content: generateMarkdown(),
        ai_summary: result.pro_level.definition,
        detected_tickers: [],
        tags: ['#FinanceDictionary', `#${result.category.replace(' ', '')}`],
        sentiment: 'Neutral',
      });
      setTimeout(() => setIsSaved(false), 2000); // Reset after 2s
    } catch(err) {
      console.error("Error saving to Research Vault:", err);
      setIsSaved(false); // Reset on error
    }
  };
  
  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(generateMarkdown());
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  const handleExport = () => {
    if (!result) return;
    const blob = new Blob([generateMarkdown()], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.term.toLowerCase().replace(/ /g, '-')}-vireon-finance-dictionary.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const quickActions = [
    { label: isSaved ? 'Saved!' : 'Save to Research Vault', icon: Save, action: handleSave, disabled: isSaved },
    { label: isCopied ? 'Copied!' : 'Copy as Markdown', icon: Copy, action: handleCopy, disabled: isCopied },
    { label: 'Export (.md)', icon: Download, action: handleExport, disabled: false }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-4">
          <BookOpen className={`w-10 h-10 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
          <h1 className={`text-5xl font-black tracking-[-0.03em] ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Finance Dictionary
          </h1>
        </div>
        <div className="mt-4 flex items-center justify-center space-x-2">
            <p className="text-lg" style={{color: 'var(--text-secondary)'}}>
                Your on-demand financial dictionary.
            </p>
            <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold ${theme === 'dark' ? 'bg-purple-500/10 text-purple-300' : 'bg-purple-100 text-purple-700'}`}>
              <Sparkles className="w-3 h-3" />
              <span>Powered by Lyra</span>
            </div>
        </div>
      </div>

      {/* Search */}
      <TermSearch
        onSearch={handleSearch}
        theme={theme}
        isLoading={isLoading}
        history={history}
        setHistory={setHistory}
      />
      
      {/* Content Area */}
      <div className="mt-12">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <ResultSkeleton key="skeleton" theme={theme} />
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center p-8 rounded-2xl"
              style={{backgroundColor: 'var(--card)', border: `1px solid var(--border)`}}
            >
              <AlertTriangle className={`w-10 h-10 mx-auto ${theme === 'dark' ? 'text-red-400' : 'text-red-500'}`} />
              <p className={`mt-4 font-semibold ${theme === 'dark' ? 'text-red-300' : 'text-red-600'}`}>
                {error}
              </p>
              <button
                onClick={() => handleSearch(searchTerm)}
                className={`mt-6 px-5 py-2.5 rounded-xl font-semibold transition-colors ${theme === 'dark' ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                Try Again
              </button>
            </motion.div>
          ) : result ? (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8"
            >
              <div className="lg:col-span-2 space-y-8">
                <ProLevelCard data={result.pro_level} theme={theme} />
                <NoviceLevelCard data={result.novice_level} theme={theme} />
                <FirstPrinciplesCard data={result.first_principles} theme={theme} />
              </div>
              <div className="hidden lg:block">
                <SidePanel
                  relatedTerms={result.related_terms}
                  pitfalls={result.common_pitfalls}
                  actions={quickActions}
                  onTermClick={handleSearch}
                  theme={theme}
                />
              </div>
              {/* Mobile Actions */}
              <div className="lg:hidden mt-8 p-4 rounded-2xl" style={{backgroundColor: 'var(--card)', border: `1px solid var(--border)`}}>
                 <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
                 <div className="space-y-3">
                   {quickActions.map(action => (
                     <button key={action.label} onClick={action.action} disabled={action.disabled} className={`w-full flex items-center justify-center p-3 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-60 ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'}`}>
                       <action.icon className="w-4 h-4 mr-2" /> {action.label}
                     </button>
                   ))}
                 </div>
              </div>
            </motion.div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg font-semibold" style={{color: 'var(--text-secondary)'}}>
                Search any finance or econ term
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
                {suggestedTerms.map(term => (
                  <button
                    key={term}
                    onClick={() => handleSearch(term)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>

      <footer className="text-center text-xs" style={{color: 'var(--text-tertiary)'}}>
        Educational content. Not investment advice.
      </footer>
    </div>
  );
}