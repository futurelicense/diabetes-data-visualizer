
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FileUpload from '@/components/FileUpload';
import BloodSugarChart from '@/components/BloodSugarChart';
import SummaryStats from '@/components/SummaryStats';
import InsightsPanel from '@/components/InsightsPanel';
import { ActivitySquare, BarChart3, FileText } from 'lucide-react';
import { processCSVData, prepareChartData } from '@/utils/processData';
import { ProcessedData, ChartData } from '@/types';
import { useToast } from '@/hooks/use-toast';

const Index: React.FC = () => {
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const { toast } = useToast();

  const handleFileLoaded = (content: string) => {
    const data = processCSVData(content);
    
    if (!data) {
      toast({
        title: 'Invalid data format',
        description: 'Unable to process the uploaded file. Please check the CSV format.',
        variant: 'destructive',
      });
      return;
    }
    
    setProcessedData(data);
    setChartData(prepareChartData(data));
    
    toast({
      title: 'Data loaded successfully',
      description: `Processed ${data.readings.length} blood sugar readings.`,
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">Diabetes Data Visualizer</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Upload your blood sugar data to visualize trends, get insights, and improve your diabetes management.
        </p>
      </div>

      {!processedData ? (
        <div className="max-w-xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
              <CardDescription>
                Upload a CSV file with your blood glucose readings to generate visualizations and insights.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload onFileLoaded={handleFileLoaded} />
            </CardContent>
          </Card>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Privacy First</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Your data stays in your browser. We don't store or transmit your medical information.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clinical Standards</CardTitle>
                <ActivitySquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Analysis based on American Diabetes Association and WHO guidelines.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Interactive Analysis</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Visualize morning vs. evening patterns and get personalized insights.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2">How to prepare your data</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Your CSV file should have at least two columns: <code>Date</code> and <code>BloodSugar</code>
            </p>
            
            <div className="bg-muted p-4 rounded-md overflow-x-auto">
              <pre className="text-xs">
                Date,BloodSugar<br />
                2023-04-01T08:30:00,120<br />
                2023-04-01T18:45:00,145<br />
                2023-04-02T07:15:00,118<br />
                ...
              </pre>
            </div>
            
            <p className="text-sm text-muted-foreground mt-4">
              The date column should be in a standard date format. The blood sugar values should be in mg/dL.
            </p>
          </div>
        </div>
      ) : (
        <Tabs defaultValue="chart" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="chart">Chart View</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chart" className="mt-0">
            {chartData && (
              <BloodSugarChart chartData={chartData} />
            )}
            <div className="mt-8">
              <button 
                onClick={() => {
                  setProcessedData(null);
                  setChartData(null);
                }}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Upload different data
              </button>
            </div>
          </TabsContent>
          
          <TabsContent value="stats" className="mt-0">
            <SummaryStats data={processedData} />
            <div className="mt-8">
              <button 
                onClick={() => {
                  setProcessedData(null);
                  setChartData(null);
                }}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Upload different data
              </button>
            </div>
          </TabsContent>
          
          <TabsContent value="insights" className="mt-0">
            <InsightsPanel data={processedData} />
            <div className="mt-8">
              <button 
                onClick={() => {
                  setProcessedData(null);
                  setChartData(null);
                }}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Upload different data
              </button>
            </div>
          </TabsContent>
        </Tabs>
      )}
      
      <footer className="mt-16 text-center text-xs text-muted-foreground">
        <p>
          Diabetes Data Visualizer - This tool is for informational purposes only and not intended to replace 
          professional medical advice. Always consult with your healthcare provider regarding your health decisions.
        </p>
      </footer>
    </div>
  );
};

export default Index;
