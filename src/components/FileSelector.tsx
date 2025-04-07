import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Music, Upload } from 'lucide-react';

interface FileSelectorProps {
  onSelectFile: () => Promise<void>;
  isLoading: boolean;
}

const FileSelector: React.FC<FileSelectorProps> = ({ onSelectFile, isLoading }) => {
  return (
    <Card className="w-full mb-6 border-dashed border-2 hover:border-primary/50 transition-colors">
      <CardHeader className="text-center">
        <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Music className="w-6 h-6 text-primary" />
        </div>
        <CardTitle>Select an MP3 File</CardTitle>
        <CardDescription>
          Choose an MP3 file to view and edit its metadata
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="w-full max-w-sm mb-4 p-6 rounded-lg bg-muted/50">
          <div className="text-sm text-muted-foreground text-center">
            <p>Supports ID3v1 and ID3v2 tags</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center pb-6">
        <Button 
          onClick={onSelectFile} 
          disabled={isLoading}
          className="w-full max-w-xs"
          variant="gradient"
          size="lg"
        >
          <Upload className="mr-2 h-4 w-4" />
          {isLoading ? 'Loading...' : 'Select MP3 File'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FileSelector; 