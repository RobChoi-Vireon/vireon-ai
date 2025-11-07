import React from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  MessageSquare, 
  UploadCloud, 
  Star, 
  Flag, 
  Trash2, 
  MoreVertical,
  Link as LinkIcon
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from 'date-fns';

export default function AssetCard({ asset, onUpdate, onDelete }) {
  const toggleStar = async () => {
    const updatedAsset = await base44.entities.ResearchAsset.update(asset.id, { is_starred: !asset.is_starred });
    onUpdate(updatedAsset);
  };
  
  const toggleFollowUp = async () => {
    const updatedAsset = await base44.entities.ResearchAsset.update(asset.id, { is_flagged_for_follow_up: !asset.is_flagged_for_follow_up });
    onUpdate(updatedAsset);
  };

  const assetIcons = {
    "File Upload": <UploadCloud className="w-4 h-4" />,
    "Smart Note": <FileText className="w-4 h-4" />,
    "Chat Log": <MessageSquare className="w-4 h-4" />,
    "Ingested Article": <LinkIcon className="w-4 h-4" />,
  };
  
  const sentimentColors = {
      "Bullish": "bg-green-900/50 text-green-300 border-green-700",
      "Bearish": "bg-red-900/50 text-red-300 border-red-700",
      "Neutral": "bg-gray-700 text-gray-300 border-gray-600",
      "Mixed": "bg-yellow-900/50 text-yellow-300 border-yellow-700"
  };

  return (
    <Card className="bg-gray-800/50 border border-gray-700/60 flex flex-col justify-between hover:border-blue-600/50 transition-colors">
      <CardHeader>
        <div className="flex justify-between items-start">
            <CardTitle className="text-md font-bold text-gray-100 leading-tight pr-4">{asset.title}</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="w-8 h-8 flex-shrink-0 text-gray-400 hover:text-white">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-800 border-gray-700 text-gray-200">
                <DropdownMenuItem onClick={toggleStar} className="hover:bg-gray-700">
                  <Star className={`w-4 h-4 mr-2 ${asset.is_starred ? 'text-yellow-400' : ''}`} />
                  <span>{asset.is_starred ? 'Unstar' : 'Star'}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={toggleFollowUp} className="hover:bg-gray-700">
                  <Flag className={`w-4 h-4 mr-2 ${asset.is_flagged_for_follow_up ? 'text-orange-400' : ''}`} />
                  <span>{asset.is_flagged_for_follow_up ? 'Unflag' : 'Flag for Follow-up'}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(asset.id)} className="text-red-400 hover:bg-red-900/30 hover:!text-red-300">
                  <Trash2 className="w-4 h-4 mr-2" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
            <div className="flex items-center gap-1">
                {assetIcons[asset.asset_type] || <FileText className="w-4 h-4" />}
                <span>{asset.asset_type}</span>
            </div>
            <span>•</span>
            <span>{formatDistanceToNow(new Date(asset.created_date), { addSuffix: true })}</span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-300 leading-relaxed line-clamp-3">
          {asset.ai_summary || asset.content || "No summary available."}
        </p>
      </CardContent>
      <CardFooter>
        <div className="flex flex-wrap gap-2">
          {asset.sentiment && <Badge className={sentimentColors[asset.sentiment]}>{asset.sentiment}</Badge>}
          {asset.detected_tickers?.slice(0, 3).map(ticker => (
            <Badge key={ticker} variant="outline" className="font-mono bg-gray-700/50 text-gray-300 border-gray-600">
              ${ticker}
            </Badge>
          ))}
          {asset.tags?.slice(0, 2).map(tag => (
            <Badge key={tag} variant="secondary" className="bg-blue-900/50 text-blue-300 border border-blue-800/50">
              #{tag}
            </Badge>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}