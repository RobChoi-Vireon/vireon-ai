import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, X } from "lucide-react";

const SECTORS = ["Technology", "Energy", "Healthcare", "Financial Services", "Consumer", "Industrial", "Real Estate", "Utilities", "Materials", "Communications"];
const CATEGORIES = ["Macro", "Fed Policy", "Earnings", "Geopolitics", "Regulatory", "M&A", "IPO", "Crypto", "Commodities", "FX"];
const REGIONS = ["US", "Europe", "Asia-Pacific", "Emerging Markets", "Global"];

export default function FilterPanel({ activeFilters, setActiveFilters, articles }) {
  const updateFilter = (key, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearAllFilters = () => {
    setActiveFilters({
      sector: "All",
      category: "All",
      sentiment: "All",
      region: "All"
    });
  };

  const activeFilterCount = Object.values(activeFilters).filter(value => value !== "All").length;

  // Get statistics from articles
  const stats = articles.reduce((acc, article) => {
    acc.sectors[article.sector] = (acc.sectors[article.sector] || 0) + 1;
    acc.categories[article.category] = (acc.categories[article.category] || 0) + 1;
    acc.sentiments[article.sentiment] = (acc.sentiments[article.sentiment] || 0) + 1;
    acc.regions[article.region] = (acc.regions[article.region] || 0) + 1;
    return acc;
  }, { sectors: {}, categories: {}, sentiments: {}, regions: {} });

  return (
    <Card className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/60 sticky top-20">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-gray-900 dark:text-gray-100">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                {activeFilterCount}
              </Badge>
            )}
          </div>
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sector Filter */}
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Sector
          </label>
          <Select value={activeFilters.sector} onValueChange={(value) => updateFilter('sector', value)}>
            <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <SelectItem value="All" className="text-gray-900 dark:text-gray-100">All Sectors</SelectItem>
              {SECTORS.map(sector => (
                <SelectItem key={sector} value={sector} className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <div className="flex justify-between items-center w-full">
                    <span>{sector}</span>
                    <span className="text-gray-500 dark:text-gray-400 text-xs">
                      {stats.sectors[sector] || 0}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Category
          </label>
          <Select value={activeFilters.category} onValueChange={(value) => updateFilter('category', value)}>
            <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <SelectItem value="All" className="text-gray-900 dark:text-gray-100">All Categories</SelectItem>
              {CATEGORIES.map(category => (
                <SelectItem key={category} value={category} className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <div className="flex justify-between items-center w-full">
                    <span>{category}</span>
                    <span className="text-gray-500 dark:text-gray-400 text-xs">
                      {stats.categories[category] || 0}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sentiment Filter */}
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Sentiment
          </label>
          <Select value={activeFilters.sentiment} onValueChange={(value) => updateFilter('sentiment', value)}>
            <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <SelectItem value="All" className="text-gray-900 dark:text-gray-100">All Sentiment</SelectItem>
              <SelectItem value="Bullish" className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">
                <div className="flex justify-between items-center w-full">
                  <span>Bullish</span>
                  <span className="text-gray-500 dark:text-gray-400 text-xs">
                    {stats.sentiments.Bullish || 0}
                  </span>
                </div>
              </SelectItem>
              <SelectItem value="Bearish" className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">
                <div className="flex justify-between items-center w-full">
                  <span>Bearish</span>
                  <span className="text-gray-500 dark:text-gray-400 text-xs">
                    {stats.sentiments.Bearish || 0}
                  </span>
                </div>
              </SelectItem>
              <SelectItem value="Neutral" className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">
                <div className="flex justify-between items-center w-full">
                  <span>Neutral</span>
                  <span className="text-gray-500 dark:text-gray-400 text-xs">
                    {stats.sentiments.Neutral || 0}
                  </span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Region Filter */}
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Region
          </label>
          <Select value={activeFilters.region} onValueChange={(value) => updateFilter('region', value)}>
            <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <SelectItem value="All" className="text-gray-900 dark:text-gray-100">All Regions</SelectItem>
              {REGIONS.map(region => (
                <SelectItem key={region} value={region} className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <div className="flex justify-between items-center w-full">
                    <span>{region}</span>
                    <span className="text-gray-500 dark:text-gray-400 text-xs">
                      {stats.regions[region] || 0}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filter Summary */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {articles.length} articles
          </div>
        </div>
      </CardContent>
    </Card>
  );
}