
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, FileType } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  onFileLoaded: (content: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileLoaded }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      toast({
        title: 'Invalid file format',
        description: 'Please upload a CSV file',
        variant: 'destructive'
      });
      return;
    }

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      onFileLoaded(content);
    };
    reader.onerror = () => {
      toast({
        title: 'Error reading file',
        description: 'There was a problem reading the file',
        variant: 'destructive'
      });
    };
    reader.readAsText(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            isDragging ? 'border-primary bg-primary/5' : 'border-gray-300'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="rounded-full bg-primary/10 p-3">
              <FileType className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Upload your blood sugar data</h3>
              <p className="text-sm text-muted-foreground">
                Drag and drop your CSV file, or click to select
              </p>
              <p className="text-xs text-muted-foreground">
                Format: CSV with Date and BloodSugar columns
              </p>
            </div>
            <Button 
              onClick={handleButtonClick}
              className="relative" 
              type="button"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload CSV
              <input
                ref={fileInputRef}
                type="file"
                className="sr-only"
                accept=".csv"
                onChange={handleFileChange}
              />
            </Button>
            {fileName && (
              <p className="text-sm font-medium text-primary">{fileName}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUpload;
