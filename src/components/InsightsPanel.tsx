
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, BrainCircuit, FileText, FileDown } from 'lucide-react';
import { ProcessedData } from '@/types';
import { generateReportCSV } from '@/utils/processData';

interface InsightsPanelProps {
  data: ProcessedData;
}

const InsightsPanel: React.FC<InsightsPanelProps> = ({ data }) => {
  const { insights } = data;
  
  const handleDownloadReport = () => {
    const csvContent = generateReportCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    
    link.href = url;
    link.setAttribute('download', `blood-sugar-report-${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadSample = () => {
    const sampleCSV = `Date,BloodSugar
2023-04-01T08:30:00,120
2023-04-01T18:45:00,145
2023-04-02T07:15:00,118
2023-04-02T19:30:00,135
2023-04-03T08:00:00,125
2023-04-03T20:00:00,155
2023-04-04T07:45:00,122
2023-04-04T19:15:00,140
2023-04-05T08:30:00,130
2023-04-05T18:30:00,150`;
    
    const blob = new Blob([sampleCSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.setAttribute('download', 'blood-sugar-sample.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleDownloadRawCSV = () => {
    let csvContent = "Date,BloodSugar\n";
    
    data.readings.forEach(reading => {
      const dateStr = reading.date.toISOString();
      csvContent += `${dateStr},${reading.value}\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    
    link.href = url;
    link.setAttribute('download', `blood-sugar-data-${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5" />
          Personalized Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {insights.map((insight, index) => (
            <li key={index} className="rounded-md border p-3 text-sm">
              {insight}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        <Button className="w-full" onClick={handleDownloadReport}>
          <Download className="h-4 w-4 mr-2" />
          Download Full Report
        </Button>
        <Button 
          variant="secondary" 
          className="w-full" 
          onClick={handleDownloadRawCSV}
        >
          <FileDown className="h-4 w-4 mr-2" />
          Download Raw CSV Data
        </Button>
        <Button 
          variant="outline" 
          className="w-full text-xs" 
          onClick={handleDownloadSample}
        >
          <FileText className="h-4 w-4 mr-2" />
          Download CSV Sample Format
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InsightsPanel;
