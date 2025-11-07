import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, UploadCloud, Rss, Newspaper, BarChart, ShieldCheck, Clock, Target, FileUp, Settings, Play } from 'lucide-react';

const IngestionCard = ({ children, className }) => (
    <Card className={`bg-gray-800 border-gray-700 shadow-lg ${className}`}>
        {children}
    </Card>
);

export default function IngestionSuite() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
                <IngestionCard>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between text-lg">
                            <span className="text-white font-semibold">Manual Ingestion Triggers</span>
                            <div className="flex items-center gap-2 text-xs">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-gray-300 font-medium">Sources Online</span>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-4 flex-wrap">
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold border-0 shadow-lg">
                                <Rss className="w-4 h-4 mr-2"/>Ingest RSS Feeds
                            </Button>
                            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold border-0 shadow-lg">
                                <Newspaper className="w-4 h-4 mr-2"/>Ingest News API
                            </Button>
                            <Button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold border-0 shadow-lg">
                                <BarChart className="w-4 h-4 mr-2"/>Ingest Macro Data
                            </Button>
                        </div>
                        <div className="text-sm text-gray-200 font-medium bg-gray-700/50 rounded-lg p-3 border border-gray-600">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-200">Last Run Status:</span>
                                <Badge className="bg-green-600 text-white font-semibold">Success (25 items)</Badge>
                            </div>
                        </div>
                    </CardContent>
                </IngestionCard>

                <IngestionCard>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between text-lg">
                            <span className="text-white font-semibold">Smart Ingestion Profiles</span>
                            <Button variant="outline" size="sm" className="bg-blue-600 border-blue-500 hover:bg-blue-700 text-white font-medium">
                                <Plus className="w-4 h-4 mr-2"/>New Profile
                            </Button>
                        </CardTitle>
                        <CardDescription className="text-gray-300 pt-1 font-medium">
                            Automate complex ingestion workflows with saved profiles.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {['Pre-Market Sweep', 'Tech Sector Deep-Dive', 'Macro Risk Monitor'].map((profile, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg border border-gray-600 hover:bg-gray-600/80 transition-colors">
                                <div className="flex items-center gap-3">
                                    <ShieldCheck className="w-5 h-5 text-blue-400" />
                                    <span className="font-semibold text-white">{profile}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge className="bg-green-600 text-white font-semibold">Active</Badge>
                                    <Button size="sm" variant="outline" className="bg-blue-600 border-blue-500 hover:bg-blue-700 text-white">
                                        <Play className="w-4 h-4"/>
                                    </Button>
                                    <Button size="sm" variant="outline" className="bg-gray-600 border-gray-500 hover:bg-gray-700 text-white">
                                        <Settings className="w-4 h-4"/>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </IngestionCard>

                <IngestionCard>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between text-lg">
                             <span className="text-white font-semibold">Auto-Trigger Rules</span>
                             <Button variant="outline" size="sm" className="bg-orange-600 border-orange-500 hover:bg-orange-700 text-white font-medium">
                                <Plus className="w-4 h-4 mr-2"/>New Rule
                             </Button>
                        </CardTitle>
                         <CardDescription className="text-gray-300 pt-1 font-medium">
                            Create "if-this-then-that" rules for autonomous operation.
                         </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center gap-3 text-white p-3 bg-gray-700 rounded-lg border border-gray-600">
                            <span className="font-bold text-orange-400 bg-orange-900/30 px-2 py-1 rounded text-sm">IF</span>
                            <span className="font-medium">VIX moves &gt; 10%</span>
                            <span className="font-bold text-blue-400 bg-blue-900/30 px-2 py-1 rounded text-sm">THEN</span>
                            <span className="font-medium">Run "Macro Risk Monitor" profile</span>
                        </div>
                         <div className="flex items-center gap-3 text-white p-3 bg-gray-700 rounded-lg border border-gray-600">
                            <span className="font-bold text-orange-400 bg-orange-900/30 px-2 py-1 rounded text-sm">IF</span>
                            <span className="font-medium">Daily at 08:00 EST</span>
                            <span className="font-bold text-blue-400 bg-blue-900/30 px-2 py-1 rounded text-sm">THEN</span>
                            <span className="font-medium">Run "Pre-Market Sweep" profile</span>
                        </div>
                    </CardContent>
                </IngestionCard>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
                 <IngestionCard>
                    <CardHeader>
                        <CardTitle className="text-lg text-white font-semibold">Document Ingestion</CardTitle>
                         <CardDescription className="text-gray-300 pt-1 font-medium">
                            Upload research documents for AI analysis.
                         </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="border-2 border-dashed border-gray-500 rounded-lg p-8 text-center bg-gray-700/30 hover:border-gray-400 hover:bg-gray-700/50 transition-colors">
                            <UploadCloud className="mx-auto h-12 w-12 text-gray-300" />
                            <p className="mt-4 text-sm text-white font-medium">Drag & drop PDF, TXT, or DOCX files here</p>
                            <p className="text-xs text-gray-300 mt-1 font-medium">or</p>
                             <Button variant="outline" size="sm" className="mt-3 bg-gray-600 border-gray-500 hover:bg-gray-700 text-white font-medium">
                                <FileUp className="w-4 h-4 mr-2" />
                                Select Files
                            </Button>
                        </div>
                    </CardContent>
                </IngestionCard>
                
                <IngestionCard>
                    <CardHeader>
                        <CardTitle className="text-lg text-white font-semibold">Ingestion Summary (24h)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                           <span className="text-gray-200 font-medium">Total Articles Processed:</span>
                           <span className="font-bold text-white text-xl">1,204</span>
                       </div>
                       <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                           <span className="text-gray-200 font-medium">High-Impact Signals Flagged:</span>
                           <span className="font-bold text-white text-xl">87</span>
                       </div>
                       <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                           <span className="text-gray-200 font-medium">Top Source:</span>
                           <Badge className="bg-blue-600 text-white font-semibold">News API</Badge>
                       </div>
                       <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                           <span className="text-gray-200 font-medium">Net Sentiment:</span>
                           <Badge className="bg-red-600 text-white font-semibold">Slightly Bearish</Badge>
                       </div>
                    </CardContent>
                </IngestionCard>
            </div>
        </div>
    );
}