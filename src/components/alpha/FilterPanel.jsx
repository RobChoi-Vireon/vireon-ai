import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter } from 'lucide-react';

const FilterPanel = ({ filters, setFilters }) => {
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Card className="bg-gray-800 border-gray-700/60 shadow-xl">
      <CardContent className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
          {[
            { key: 'sector', placeholder: 'Sector', options: ["Technology", "Energy", "Healthcare", "Financial Services", "Consumer", "Industrial", "Real Estate", "Utilities", "Materials", "Communications", "Cross-Asset"] },
            { key: 'risk_level', placeholder: 'Risk Level', options: ["High", "Medium", "Low"] },
            { key: 'sentiment_bias', placeholder: 'Bias', options: ["Momentum", "Contrarian", "Rotation", "Value"] },
            { key: 'time_horizon', placeholder: 'Time Horizon', options: ["Short-Term (1-5 days)", "Medium-Term (1-4 weeks)", "Long-Term (1-6 months)"] }
          ].map(filter => (
            <div key={filter.key}>
              <label className="text-sm font-medium text-gray-300 mb-2 block">{filter.placeholder}</label>
              <Select value={filters[filter.key]} onValueChange={value => handleFilterChange(filter.key, value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-200 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder={`Filter by ${filter.placeholder}`} />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-gray-200 border-gray-600">
                  <SelectItem value="All">All {filter.placeholder}s</SelectItem>
                  {filter.options.map(opt => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterPanel;