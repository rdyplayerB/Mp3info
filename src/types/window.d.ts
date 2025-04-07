export {};

declare global {
  interface Window {
    api: {
      selectFile: () => Promise<{
        filePath?: string;
        tags?: any;
        canceled?: boolean;
        error?: string;
      }>;
      saveTags: (filePath: string, tags: any) => Promise<{
        success?: boolean;
        error?: string;
      }>;
    };
  }
} 