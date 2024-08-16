export interface MediaItem {
  type: "image" | "video" | "audio";
  url: string;
}

export interface MediaGalleryProps {
  mediaItems: MediaItem[];
}

export interface AudioPlayerProps {
  url: string;
}
