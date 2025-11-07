import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { InvokeLLM } from "@/integrations/Core";
import { User } from "@/entities/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  FileText, 
  Download, 
  Calendar, 
  Clock,
  RefreshCw,
  Mail,
  Settings,
  Play,
  Rewind,
  Target,
  TrendingUp
} from "lucide-react";
import { format, startOfWeek, endOfWeek, subDays, isWeekend } from "date-fns";

import PlaybookGenerator from "../components/reports/PlaybookGenerator";
import WeekendPrep from "../components/reports/WeekendPrep";
import NewsReplay from "../components/reports/NewsReplay";

export default function Reports() {
  const [weeklyReport, setWeeklyReport] = useState(null);
  const [weekendPrep, setWeekendPrep] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const userData = await User.me();
      setUser(userData);

      // Load this week's report if exists
      const startDate = format(startOfWeek(new Date()), 'yyyy-MM-dd');
      const reports = await base44.entities.WeeklyPlaybook.filter({ week_start_date: startDate });
      if (reports.length > 0) {
        setWeeklyReport(reports[0]);
      }

      // Load weekend prep for upcoming week
      const prepDate = format(new Date(), 'yyyy-MM-dd');
      const preps = await base44.entities.WeekendPrep.filter({ prep_date: prepDate });
      if (preps.length > 0) {
        setWeekendPrep(preps[0]);
      }

    } catch (error) {
      console.error("Error loading reports data:", error);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-64 bg-gray-700 rounded"></div>
          <div className="h-10 w-full bg-gray-700 rounded-xl mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Skeleton className="h-48 bg-gray-700" />
            <Skeleton className="h-48 bg-gray-700" />
            <Skeleton className="h-48 bg-gray-700" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Automated Intelligence Reports</h1>
        <p className="text-gray-300 text-lg">
            Generate on-demand weekly playbooks, weekend prep, and market replays.
        </p>
      </div>

      <Tabs defaultValue="playbook" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800 border border-gray-700 p-1 rounded-xl shadow-sm">
            <TabsTrigger value="playbook" className="data-[state=active]:bg-blue-900/40 data-[state=active]:text-blue-300 text-gray-300 font-semibold rounded-lg py-2">Weekly Playbook</TabsTrigger>
            <TabsTrigger value="weekend" className="data-[state=active]:bg-blue-900/40 data-[state=active]:text-blue-300 text-gray-300 font-semibold rounded-lg py-2">Weekend Prep</TabsTrigger>
            <TabsTrigger value="replay" className="data-[state=active]:bg-blue-900/40 data-[state=active]:text-blue-300 text-gray-300 font-semibold rounded-lg py-2">News Replay</TabsTrigger>
            <TabsTrigger value="archive" className="data-[state=active]:bg-blue-900/40 data-[state=active]:text-blue-300 text-gray-300 font-semibold rounded-lg py-2">Archive</TabsTrigger>
        </TabsList>

        <TabsContent value="playbook">
          <PlaybookGenerator 
            weeklyReport={weeklyReport}
            onReportGenerated={loadData}
          />
        </TabsContent>

        <TabsContent value="weekend">
          <WeekendPrep 
            weekendPrep={weekendPrep}
            onPrepUpdated={loadData}
          />
        </TabsContent>

        <TabsContent value="replay">
          <NewsReplay />
        </TabsContent>

        <TabsContent value="archive">
          <Card className="bg-gray-800 border-gray-700/60 shadow-xl">
            <CardHeader>
              <CardTitle className="text-gray-100 font-bold">Report Archive</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-400">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold text-gray-200">Coming Soon</h3>
                <p>Historical reports and analytics archive will be available here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}