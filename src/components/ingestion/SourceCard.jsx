import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, DatabaseZap } from 'lucide-react';

export default function SourceCard({ title, description, icon: Icon, isLoading, isAnyLoading, onIngest }) {
  return (
    <Card className="bg-gray-800 border-gray-700/60 flex flex-col hover:border-blue-500/50 transition-colors duration-300 shadow-xl">
      <CardHeader className="flex-row items-center gap-4 space-y-0 pb-4">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <CardTitle className="text-lg font-bold text-gray-100">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        <CardDescription className="mb-6 text-gray-300 text-base">{description}</CardDescription>
        <Button
          onClick={onIngest}
          disabled={isLoading || isAnyLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold border-0 shadow-md disabled:bg-gray-600 disabled:opacity-50"
        >
          {isLoading ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <DatabaseZap className="w-4 h-4 mr-2" />
          )}
          {isLoading ? 'Ingesting...' : 'Start Ingestion'}
        </Button>
      </CardContent>
    </Card>
  );
}