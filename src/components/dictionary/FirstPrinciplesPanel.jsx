import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Lightbulb, 
  ChevronsRight, 
  TestTube2, 
  AlertTriangle, 
  Briefcase, 
  Calendar, 
  Scale, 
  Link2, 
  ShieldAlert,
  Target,
  BookOpen
} from 'lucide-react';

const Section = ({ title, icon, children }) => (
  <div className="mb-6">
    <h3 className="flex items-center gap-2 font-semibold text-gray-200 mb-3">
      {icon}
      {title}
    </h3>
    <div className="pl-8 text-gray-300">{children}</div>
  </div>
);

const ListSection = ({ title, icon, items }) => (
  <Section title={title} icon={icon}>
    <ul className="space-y-2">
      {items?.map((item, index) => (
        <li key={index} className="flex items-start">
          <ChevronsRight className="w-4 h-4 text-indigo-400 mr-2 mt-1 flex-shrink-0" />
          <span>{item}</span>
        </li>
      )) || <p className="text-gray-500 italic">No items available</p>}
    </ul>
  </Section>
);

export default function FirstPrinciplesPanel({ principles }) {
  if (!principles) {
    return (
      <div className="p-6 text-center text-gray-500">
        <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>First-principles breakdown not available for this term.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900/50 rounded-b-lg">
      {/* Premise */}
      <Section title="Premise & Purpose" icon={<Lightbulb className="w-5 h-5 text-yellow-400" />}>
        <p className="italic text-gray-200 bg-yellow-900/10 p-3 rounded-lg border-l-4 border-yellow-500">
          {principles.premise || 'No premise defined'}
        </p>
      </Section>

      {/* Assumptions */}
      {principles.assumptions && principles.assumptions.length > 0 && (
        <ListSection 
          title="Key Assumptions" 
          icon={<Target className="w-5 h-5 text-blue-400" />} 
          items={principles.assumptions} 
        />
      )}

      {/* Derivation */}
      {principles.derivation && principles.derivation.length > 0 && (
        <ListSection 
          title="Step-by-Step Derivation" 
          icon={<ChevronsRight className="w-5 h-5 text-indigo-400" />} 
          items={principles.derivation} 
        />
      )}

      {/* Formulas */}
      {principles.formulas && principles.formulas.length > 0 && (
        <Section title="Mathematical Formula(s)" icon={<TestTube2 className="w-5 h-5 text-green-400" />}>
          <div className="space-y-4">
            {principles.formulas.map((formula, index) => (
              <Card key={index} className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <code className="text-green-300 font-mono text-lg block text-center">
                    {formula}
                  </code>
                </CardContent>
              </Card>
            ))}
            
            {/* Variables */}
            {principles.variables && Object.keys(principles.variables).length > 0 && (
              <div className="mt-4 space-y-2 text-sm bg-gray-800/30 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-200 mb-3">Where:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {Object.entries(principles.variables).map(([key, value]) => (
                    <div key={key} className="flex items-start gap-2">
                      <code className="text-green-300 font-mono font-bold bg-gray-900/50 px-2 py-1 rounded text-xs">
                        {key}
                      </code>
                      <span className="text-gray-300">=</span>
                      <span className="text-gray-300">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Section>
      )}

      {/* Worked Example */}
      {principles.worked_example && (
        <Section title="Worked Example" icon={<Scale className="w-5 h-5 text-cyan-400" />}>
          <div className="bg-cyan-900/10 border-l-4 border-cyan-500 p-4 rounded-r-lg">
            <code className="text-cyan-200 font-mono text-base whitespace-pre-wrap">
              {principles.worked_example}
            </code>
          </div>
        </Section>
      )}

      {/* Applications */}
      {principles.applications && principles.applications.length > 0 && (
        <ListSection 
          title="Real-World Applications" 
          icon={<Briefcase className="w-5 h-5 text-blue-400" />} 
          items={principles.applications} 
        />
      )}

      {/* Pitfalls */}
      {principles.pitfalls && principles.pitfalls.length > 0 && (
        <ListSection 
          title="Common Pitfalls & Limitations" 
          icon={<AlertTriangle className="w-5 h-5 text-red-400" />} 
          items={principles.pitfalls} 
        />
      )}
    </div>
  );
}