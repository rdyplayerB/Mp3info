import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

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
  onSave: (updatedTags: Mp3Tags) => void;
  isLoading: boolean;
  fileName: string;
}

// Genre list based on ID3v1 specification
const genres = [
  'Blues', 'Classic Rock', 'Country', 'Dance', 'Disco', 'Funk', 'Grunge', 'Hip-Hop',
  'Jazz', 'Metal', 'New Age', 'Oldies', 'Other', 'Pop', 'R&B', 'Rap', 'Reggae',
  'Rock', 'Techno', 'Industrial', 'Alternative', 'Ska', 'Death Metal', 'Pranks',
  'Soundtrack', 'Euro-Techno', 'Ambient', 'Trip-Hop', 'Vocal', 'Jazz+Funk', 'Fusion',
  'Trance', 'Classical', 'Instrumental', 'Acid', 'House', 'Game', 'Sound Clip',
  'Gospel', 'Noise', 'AlternRock', 'Bass', 'Soul', 'Punk', 'Space', 'Meditative',
  'Instrumental Pop', 'Instrumental Rock', 'Ethnic', 'Gothic', 'Darkwave',
  'Techno-Industrial', 'Electronic', 'Pop-Folk', 'Eurodance', 'Dream', 'Southern Rock',
  'Comedy', 'Cult', 'Gangsta', 'Top 40', 'Christian Rap', 'Pop/Funk', 'Jungle',
  'Native American', 'Cabaret', 'New Wave', 'Psychadelic', 'Rave', 'Showtunes',
  'Trailer', 'Lo-Fi', 'Tribal', 'Acid Punk', 'Acid Jazz', 'Polka', 'Retro',
  'Musical', 'Rock & Roll', 'Hard Rock'
];

const MetadataEditor: React.FC<MetadataEditorProps> = ({ tags, onSave, isLoading, fileName }) => {
  const [editedTags, setEditedTags] = useState<Mp3Tags>({ ...tags });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedTags(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenreChange = (value: string) => {
    setEditedTags(prev => ({
      ...prev,
      genre: value
    }));
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedTags(prev => ({
      ...prev,
      comment: {
        language: prev.comment?.language || 'eng',
        text: e.target.value
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedTags);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Edit Metadata</span>
          <span className="text-sm font-normal text-muted-foreground">
            {fileName}
          </span>
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={editedTags.title || ''}
                onChange={handleInputChange}
                placeholder="Song title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="artist">Artist</Label>
              <Input
                id="artist"
                name="artist"
                value={editedTags.artist || ''}
                onChange={handleInputChange}
                placeholder="Artist name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="album">Album</Label>
              <Input
                id="album"
                name="album"
                value={editedTags.album || ''}
                onChange={handleInputChange}
                placeholder="Album name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                name="year"
                value={editedTags.year || ''}
                onChange={handleInputChange}
                placeholder="Release year"
                maxLength={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="trackNumber">Track Number</Label>
              <Input
                id="trackNumber"
                name="trackNumber"
                value={editedTags.trackNumber || ''}
                onChange={handleInputChange}
                placeholder="Track #"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="genre">Genre</Label>
              <Select 
                value={editedTags.genre || ''} 
                onValueChange={handleGenreChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {genres.map((genre) => (
                    <SelectItem key={genre} value={genre}>
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Comments</Label>
            <Textarea
              id="comment"
              name="comment"
              value={editedTags.comment?.text || ''}
              onChange={handleCommentChange}
              placeholder="Add comments about this track"
              rows={3}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default MetadataEditor; 