import React, { useState } from 'react';
import FileSelector from './FileSelector';
import MetadataEditor from './MetadataEditor';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

interface Mp3Tags {
  title?: string;
  artist?: string;
  album?: string;
  year?: string;
  comment?: {
    language: string;
    text: string;
  };
  genre?: string;
  trackNumber?: string;
}

const App: React.FC = () => {
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [tags, setTags] = useState<Mp3Tags | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  const handleFileSelection = async () => {
    setIsLoading(true);
    setMessage({ text: "Selecting file...", type: "info" });
    
    try {
      const result = await window.api.selectFile();
      
      if (result.error) {
        setMessage({ text: result.error, type: 'error' });
        return;
      }
      
      if (!result.canceled && result.filePath && result.tags) {
        setCurrentFile(result.filePath);
        setTags(result.tags);
        setMessage({ 
          text: `Loaded "${result.filePath.split('/').pop()}"`, 
          type: 'info' 
        });
      }
    } catch (error) {
      console.error("Error selecting file:", error);
      setMessage({ 
        text: `Error selecting file: ${error}`, 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (updatedTags: Mp3Tags) => {
    if (!currentFile) return;
    
    setIsLoading(true);
    setMessage(null);

    try {
      const result = await window.api.saveTags(currentFile, updatedTags);
      
      if (result.error) {
        setMessage({ text: result.error, type: 'error' });
        return;
      }
      
      if (result.success) {
        setTags(updatedTags);
        setMessage({ text: 'Tags saved successfully!', type: 'success' });
      }
    } catch (error) {
      setMessage({ 
        text: `Error saving tags: ${error}`, 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getMessageIcon = () => {
    switch (message?.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5" />;
      case 'error':
        return <AlertCircle className="h-5 w-5" />;
      case 'info':
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  const getMessageClasses = () => {
    const baseClasses = "flex items-center gap-2 p-4 text-sm rounded-md mb-6";
    
    switch (message?.type) {
      case 'success':
        return `${baseClasses} bg-green-50 text-green-700 border border-green-200`;
      case 'error':
        return `${baseClasses} bg-red-50 text-red-700 border border-red-200`;
      case 'info':
      default:
        return `${baseClasses} bg-blue-50 text-blue-700 border border-blue-200`;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center justify-center mb-2">
            <div className="p-3 bg-primary/10 rounded-full">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-8 h-8 text-primary"
              >
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-center mb-1">MP3 Metadata Editor</h1>
          <p className="text-muted-foreground text-center">
            Edit ID3 tags in your MP3 files with this simple, elegant editor
          </p>
        </header>
        
        {message && (
          <div className={getMessageClasses()}>
            {getMessageIcon()}
            <span>{message.text}</span>
          </div>
        )}
        
        <FileSelector onSelectFile={handleFileSelection} isLoading={isLoading} />
        
        {currentFile && tags && (
          <MetadataEditor 
            tags={tags} 
            onSave={handleSave} 
            isLoading={isLoading} 
            fileName={currentFile.split('/').pop() || ''} 
          />
        )}
      </div>
    </div>
  );
};

export default App; 