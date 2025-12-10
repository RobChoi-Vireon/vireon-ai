import React from 'react';
import { motion } from 'framer-motion';
import { Atom, Link, CheckSquare, AlertCircle, Puzzle } from 'lucide-react';

const PrincipleSection = ({ icon: Icon, title, items }) => (
  <div>
    <div className="flex items-center text-sm font-semibold mb-2">
      <Icon className="w-4 h-4 mr-2" />
      {title}
    </div>
    <ul className="list-disc list-inside space-y-1 pl-2">
      {items.map((item, i) => <li key={i}>{item}</li>)}
    </ul>
  </div>
);

export default function FirstPrinciplesCard({ data, theme }) {
  if (!data) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
      className="p-6 rounded-2xl elevation-1 backdrop-blur-xl"
      style={{
        backgroundColor: theme === 'dark' ? 'rgba(26, 29, 41, 0.8)' : 'rgba(255, 255, 255, 0.9)',
        border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`
      }}
    >
      <div className="flex items-center mb-4">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${theme === 'dark' ? 'bg-yellow-500/10' : 'bg-yellow-100'}`}>
          <Atom className={`w-5 h-5 ${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-600'}`} />
        </div>
        <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>First Principles</h2>
      </div>

      <div className="space-y-5 prose prose-sm max-w-none" style={{'--tw-prose-body': 'var(--text-secondary)', '--tw-prose-strong': 'var(--text-primary)'}}>
        <p><strong>Goal:</strong> {data.goal}</p>

        <PrincipleSection icon={Puzzle} title="Primitives" items={data.primitives} />
        <PrincipleSection icon={Link} title="Relationships" items={data.relationships} />
        <PrincipleSection icon={CheckSquare} title="Sanity Checks" items={data.sanity_checks} />
        <PrincipleSection icon={AlertCircle} title="Edge Cases" items={data.edge_cases} />
      </div>
    </motion.div>
  );
}