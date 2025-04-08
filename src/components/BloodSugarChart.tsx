
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartData } from '@/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

interface BloodSugarChartProps {
  chartData: ChartData;
}

const BloodSugarChart: React.FC<BloodSugarChartProps> = ({ chartData }) => {
  // Format data for recharts
  const data = chartData.dates.map((date, index) => ({
    date,
    morning: chartData.morningValues[index],
    evening: chartData.eveningValues[index]
  }));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Blood Sugar Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                angle={-45} 
                textAnchor="end" 
                height={70}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                label={{ value: 'Blood Sugar (mg/dL)', angle: -90, position: 'insideLeft' }}
                domain={[0, 'auto']}
              />
              <Tooltip 
                formatter={(value) => [`${value} mg/dL`, '']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Legend verticalAlign="top" height={36} />
              
              {/* Reference lines for medical thresholds */}
              <ReferenceLine y={70} stroke="#9C27B0" strokeDasharray="3 3" label={{ value: 'Hypoglycemic', position: 'insideBottomRight', fill: '#9C27B0' }} />
              <ReferenceLine y={100} stroke="#4CAF50" strokeDasharray="3 3" label={{ value: 'Normal Fasting Max', position: 'insideBottomRight', fill: '#4CAF50' }} />
              <ReferenceLine y={140} stroke="#FF9800" strokeDasharray="3 3" label={{ value: 'Normal Postprandial Max', position: 'insideBottomRight', fill: '#FF9800' }} />
              <ReferenceLine y={200} stroke="#F44336" strokeDasharray="3 3" label={{ value: 'Prediabetic Max', position: 'insideBottomRight', fill: '#F44336' }} />
              
              <Line
                type="monotone"
                dataKey="morning"
                name="Morning (Fasting)"
                stroke="#2C73D2"
                strokeWidth={2}
                activeDot={{ r: 8 }}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="evening"
                name="Evening (Post-meal)"
                stroke="#0091AD"
                strokeWidth={2}
                activeDot={{ r: 8 }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default BloodSugarChart;
