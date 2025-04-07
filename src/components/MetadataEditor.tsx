import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Music, Save, Disc, User, Calendar, Tag } from 'lucide-react';

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

interface MetadataEditorProps {
  tags: Mp3Tags;
  fileName: string;
  onSave: (tags: Mp3Tags) => Promise<void>;
  isLoading: boolean;
}

const MetadataEditor: React.FC<MetadataEditorProps> = ({ 
  tags, 
  fileName, 
  onSave, 
  isLoading 
}) => {
  const [editedTags, setEditedTags] = useState<Mp3Tags>(tags);
  
  // Update local state when props change
  useEffect(() => {
    setEditedTags(tags);
  }, [tags]);

  const handleChange = (field: keyof Mp3Tags, value: string) => {
    if (field === 'comment') {
      setEditedTags({
        ...editedTags,
        comment: {
          language: 'eng',
          text: value
        }
      });
    } else {
      setEditedTags({
        ...editedTags,
        [field]: value
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedTags);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="mr-4 p-2 rounded-full bg-secondary/50">
              <Music className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Edit Metadata</CardTitle>
              <CardDescription>{fileName}</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} id="metadata-form" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="flex items-center">
                <Music className="h-4 w-4 mr-2" />
                Title
              </Label>
              <Input
                id="title"
                value={editedTags.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Track title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="artist" className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                Artist
              </Label>
              <Input
                id="artist"
                value={editedTags.artist || ''}
                onChange={(e) => handleChange('artist', e.target.value)}
                placeholder="Artist name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="album" className="flex items-center">
                <Disc className="h-4 w-4 mr-2" />
                Album
              </Label>
              <Input
                id="album"
                value={editedTags.album || ''}
                onChange={(e) => handleChange('album', e.target.value)}
                placeholder="Album name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="year" className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Year
              </Label>
              <Input
                id="year"
                value={editedTags.year || ''}
                onChange={(e) => handleChange('year', e.target.value)}
                placeholder="Release year"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="genre" className="flex items-center">
                <Tag className="h-4 w-4 mr-2" />
                Genre
              </Label>
              <Input
                id="genre"
                value={editedTags.genre || ''}
                onChange={(e) => handleChange('genre', e.target.value)}
                placeholder="Music genre"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="trackNumber" className="flex items-center">
                <Tag className="h-4 w-4 mr-2" />
                Track Number
              </Label>
              <Input
                id="trackNumber"
                value={editedTags.trackNumber || ''}
                onChange={(e) => handleChange('trackNumber', e.target.value)}
                placeholder="Track number"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="comment" className="flex items-center">
              Comment
            </Label>
            <Textarea
              id="comment"
              value={editedTags.comment?.text || ''}
              onChange={(e) => handleChange('comment', e.target.value)}
              placeholder="Additional notes or comments"
              rows={3}
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          type="submit"
          form="metadata-form"
          disabled={isLoading}
          variant="gradient"
        >
          <Save className="mr-2 h-4 w-4" />
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MetadataEditor; 