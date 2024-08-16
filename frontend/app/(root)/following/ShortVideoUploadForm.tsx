import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface ShortVideoUploadFormProps {
  onClose: () => void;
}

export const ShortVideoUploadForm: React.FC<ShortVideoUploadFormProps> = ({
  onClose,
}) => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [video, setVideo] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState<string>('');

  const handleVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = function () {
        window.URL.revokeObjectURL(video.src);
        if (video.duration > 60) {
          setError('Video length must not exceed 60 seconds.');
          setVideo(null);
        } else {
          setError('');
          setVideo(file);
        }
      };

      video.src = URL.createObjectURL(file);
    }
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!video) {
      setError('Please select a video to upload.');
      return;
    }
    // Here you would typically send the data to your backend
    console.log('Submitting:', { title, description, video, tags });
    // Close the modal after submission
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setTitle(e.target.value)
          }
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setDescription(e.target.value)
          }
          required
        />
      </div>
      <div>
        <Label htmlFor="video">Video (max 60 seconds)</Label>
        <Input
          id="video"
          type="file"
          accept="video/*"
          onChange={handleVideoChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="tags">Tags</Label>
        <div className="flex space-x-2">
          <Input
            id="tags"
            value={currentTag}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setCurrentTag(e.target.value)
            }
            onKeyDown={handleTagKeyDown}
            placeholder="Add a tag and press Enter"
          />
          <Button type="button" onClick={handleAddTag}>
            Add Tag
          </Button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="text-xs font-bold"
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Upload Video</Button>
      </div>
    </form>
  );
};
