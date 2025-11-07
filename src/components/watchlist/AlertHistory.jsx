import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, Download, RefreshCw, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

export default function AlertHistory({ alertHistory, onRefresh }) {
  const exportToPdf = (alert) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Price Alert - ${alert.ticker}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; padding: 2rem; }
            h1, h2 { color: #111827; }
            .alert-card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 1rem; margin: 1rem 0; }
            .triggered { color: #dc2626; font-weight: bold; }
            .price { color: #16a34a; font-weight: bold; }
          </style>
        </head>
        <body>
          <button onclick="window.print();">Print or Save as PDF</button>
          <h1>Price Alert Triggered - ${alert.ticker}</h1>
          <div class="alert-card">
            <h2>Alert Details</h2>
            <p><strong>Ticker:</strong> ${alert.ticker}</p>
            <p><strong>Alert Type:</strong> ${alert.alert_type.replace('_', ' ')}</p>
            <p><strong>Threshold:</strong> ${alert.threshold}${alert.alert_type === 'percentage_change' ? '%' : ''}</p>
            <p><strong>Triggered At:</strong> ${format(new Date(alert.triggered_at), 'PPPp')}</p>
            <p><strong>Triggered Price:</strong> <span class="price">$${alert.triggered_price?.toFixed(2)}</span></p>
            <h2>AI Commentary</h2>
            <p>${alert.ai_commentary}</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            📸 Alert History
            <Badge variant="outline">
              {alertHistory.length} triggered
            </Badge>
          </CardTitle>
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alertHistory.map(alert => (
            <div key={alert.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <div className="font-bold text-lg">${alert.ticker}</div>
                    <div className="text-sm text-gray-600">
                      {format(new Date(alert.triggered_at), 'PPP p')}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportToPdf(alert)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export PDF
                  </Button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-500">Alert Type</div>
                  <div className="font-medium">
                    {alert.alert_type === 'percentage_change' 
                      ? `${alert.threshold}% Change Alert`
                      : `Price ${alert.condition} $${alert.threshold}`
                    }
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Triggered Price</div>
                  <div className="font-bold text-lg text-green-600">
                    ${alert.triggered_price?.toFixed(2)}
                  </div>
                </div>
              </div>

              {alert.ai_commentary && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Camera className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-800">AI Analysis</span>
                  </div>
                  <p className="text-sm text-blue-700">{alert.ai_commentary}</p>
                </div>
              )}

              {alert.chart_snapshot_data && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm font-medium text-gray-700 mb-2">Chart Snapshot</div>
                  <div className="text-xs text-gray-500">
                    Chart data captured at time of alert (5-day view)
                  </div>
                  {/* Simple visualization of the chart data */}
                  <div className="mt-2 h-16 bg-white rounded border flex items-end justify-between px-2">
                    {alert.chart_snapshot_data?.slice(-10).map((point, index) => {
                      const height = Math.max(8, (point.close / Math.max(...alert.chart_snapshot_data.map(p => p.close))) * 48);
                      return (
                        <div
                          key={index}
                          className="w-2 bg-blue-500 rounded-t"
                          style={{ height: `${height}px` }}
                          title={`$${point.close?.toFixed(2)}`}
                        ></div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}

          {alertHistory.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Camera className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No Alert History</h3>
              <p>Price alerts you set will appear here when triggered</p>
              <p className="text-sm">Chart snapshots and AI analysis will be automatically captured</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}