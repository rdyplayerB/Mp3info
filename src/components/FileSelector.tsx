import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Music, Upload } from 'lucide-react';
import { cn } from '../lib/utils';

interface FileSelectorProps {
  onFileSelect: (filePath: string) => void;
}

export function FileSelector({ onFileSelect }: FileSelectorProps) {
  const handleSelectFile = () => {
    // Get renderer API from electron
    const { ipcRenderer } = window.require('electron');
    
    // Ask main process to show open file dialog
    ipcRenderer.invoke('open-file-dialog').then((result: { canceled: boolean; filePaths: string[] }) => {
      if (!result.canceled && result.filePaths.length > 0) {
        onFileSelect(result.filePaths[0]);
      }
    });
  };

  return (
    <Card className="card-3d w-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl flex items-center gap-2">
          <Music className="h-5 w-5 text-primary" />
          <span>Select MP3 File</span>
        </CardTitle>
        <CardDescription>
          Choose an MP3 file to view and edit its metadata
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center gap-4 py-6">
          <div className="glass-morphism p-6 rounded-full">
            <Upload className="h-12 w-12 text-primary opacity-80" />
          </div>
          <p className="text-muted-foreground text-center max-w-xs">
            Click the button below to browse for an MP3 file on your computer
          </p>
          <Button 
            onClick={handleSelectFile} 
            className={cn(
              "btn-3d mt-2 w-full max-w-xs",
              "gradient-bg text-white hover:text-white border-none"
            )}
          >
            <Upload className="mr-2 h-4 w-4" />
            Select MP3 File
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 