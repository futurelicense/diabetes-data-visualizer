
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProcessedData } from '@/types';
import { formatTrend } from '@/utils/processData';
import { ArrowDown, ArrowRight, ArrowUp, Activity, TrendingUp, TrendingDown } from 'lucide-react';

interface SummaryStatsProps {
  data: ProcessedData;
}

const SummaryStats: React.FC<SummaryStatsProps> = ({ data }) => {
  const { stats } = data;
  
  const getTrendIcon = (trend: 'stable' | 'increasing' | 'decreasing') => {
    switch(trend) {
      case 'increasing': return <TrendingUp className="h-4 w-4 text-diabetic" />;
      case 'decreasing': return <TrendingDown className="h-4 w-4 text-normal" />;
      default: return <ArrowRight className="h-4 w-4 text-muted-foreground" />;
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Summary Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Averages</h3>
              <div className="mt-1 grid grid-cols-2 gap-2">
                <div className="rounded-md border p-2">
                  <p className="text-xs text-muted-foreground">Overall</p>
                  <p className="text-lg font-semibold">{stats.average.toFixed(1)} mg/dL</p>
                </div>
                <div className="rounded-md border p-2">
                  <p className="text-xs text-muted-foreground">Morning</p>
                  <p className="text-lg font-semibold">{stats.morningAverage.toFixed(1)} mg/dL</p>
                </div>
                <div className="rounded-md border p-2">
                  <p className="text-xs text-muted-foreground">Evening</p>
                  <p className="text-lg font-semibold">{stats.eveningAverage.toFixed(1)} mg/dL</p>
                </div>
                <div className="rounded-md border p-2">
                  <p className="text-xs text-muted-foreground">Range</p>
                  <p className="text-lg font-semibold">{stats.min} - {stats.max} mg/dL</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Trends</h3>
              <div className="mt-1 grid grid-cols-2 gap-2">
                <div className="rounded-md border p-2">
                  <p className="text-xs text-muted-foreground">Morning Trend</p>
                  <p className="text-lg font-semibold flex items-center gap-1">
                    {getTrendIcon(stats.morningTrend)}
                    {formatTrend(stats.morningTrend)}
                  </p>
                </div>
                <div className="rounded-md border p-2">
                  <p className="text-xs text-muted-foreground">Evening Trend</p>
                  <p className="text-lg font-semibold flex items-center gap-1">
                    {getTrendIcon(stats.eveningTrend)}
                    {formatTrend(stats.eveningTrend)}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Blood Sugar Categories</h3>
            <div className="mt-2 space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-xs range-normal">Normal</span>
                  <span className="text-xs font-medium">{stats.normalPercentage.toFixed(1)}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div 
                    className="h-full rounded-full bg-normal" 
                    style={{ width: `${stats.normalPercentage}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-xs range-prediabetic">Pre-diabetic</span>
                  <span className="text-xs font-medium">{stats.prediabeticPercentage.toFixed(1)}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div 
                    className="h-full rounded-full bg-prediabetic" 
                    style={{ width: `${stats.prediabeticPercentage}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-xs range-diabetic">Diabetic</span>
                  <span className="text-xs font-medium">{stats.diabeticPercentage.toFixed(1)}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div 
                    className="h-full rounded-full bg-diabetic" 
                    style={{ width: `${stats.diabeticPercentage}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-xs range-hypoglycemic">Hypoglycemic</span>
                  <span className="text-xs font-medium">{stats.hypoglycemicPercentage.toFixed(1)}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div 
                    className="h-full rounded-full bg-hypoglycemic" 
                    style={{ width: `${stats.hypoglycemicPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryStats;
