import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Bell, TrendingUp, TrendingDown, Target } from 'lucide-react';

export default function PriceAlertDialog({ ticker, currentPrice, onSave, onClose }) {
  const [alertType, setAlertType] = useState('percentage_change');
  const [threshold, setThreshold] = useState('');
  const [condition, setCondition] = useState('above');

  const handleSave = () => {
    if (!threshold) return;

    const alertData = {
      alert_type: alertType,
      threshold: parseFloat(threshold),
      condition: alertType === 'price_threshold' ? condition : null,
      is_active: true
    };

    onSave(alertData);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900/50 border border-gray-700">
        <CardContent className="p-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Target className="w-5 h-5 text-blue-400" />
              <div className="text-2xl font-bold text-gray-100">${ticker}</div>
            </div>
            <div className="text-gray-400">
              Current Price: <span className="font-semibold text-gray-200">${currentPrice?.toFixed(2) || '--'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium text-gray-300">Alert Type</Label>
          <Select value={alertType} onValueChange={setAlertType}>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="percentage_change" className="text-gray-200">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-orange-400" />
                  Percentage Change
                </div>
              </SelectItem>
              <SelectItem value="price_threshold" className="text-gray-200">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-400" />
                  Price Threshold
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator className="border-gray-700" />

        {alertType === 'percentage_change' && (
          <div>
            <Label className="text-sm font-medium text-gray-300">
              Percentage Threshold (%)
            </Label>
            <Input
              type="number"
              step="0.1"
              placeholder="e.g., 2.5"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              className="bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Alert when price moves ±{threshold || 'X'}% in a day
            </p>
          </div>
        )}

        {alertType === 'price_threshold' && (
          <>
            <div>
              <Label className="text-sm font-medium text-gray-300">Condition</Label>
              <Select value={condition} onValueChange={setCondition}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="above" className="text-gray-200">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      Price goes above
                    </div>
                  </SelectItem>
                  <SelectItem value="below" className="text-gray-200">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-4 h-4 text-red-400" />
                      Price goes below
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-300">
                Price Threshold ($)
              </Label>
              <Input
                type="number"
                step="0.01"
                placeholder="e.g., 150.00"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                className="bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Alert when price goes {condition} ${threshold || 'X.XX'}
              </p>
            </div>
          </>
        )}
      </div>

      <Card className="bg-blue-900/20 border border-blue-800/50">
        <CardContent className="p-3">
          <div className="flex items-center gap-2 text-blue-300">
            <Bell className="w-4 h-4" />
            <span className="text-sm font-medium">Alert Preview</span>
          </div>
          <p className="text-xs text-blue-200/80 mt-1">
            {alertType === 'percentage_change' 
              ? `You'll be notified when ${ticker} moves ±${threshold || 'X'}% in a single day.`
              : `You'll be notified when ${ticker} ${condition === 'above' ? 'rises above' : 'falls below'} $${threshold || 'X.XX'}.`
            }
          </p>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button 
          variant="outline" 
          onClick={onClose}
          className="bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSave}
          disabled={!threshold}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Bell className="w-4 h-4 mr-2" />
          Save Alert
        </Button>
      </div>
    </div>
  );
}