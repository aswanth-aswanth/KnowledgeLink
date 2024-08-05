import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { TagInput } from "@/components/ui/tag-input";
import { ImageUpload } from "@/components/ui/image-upload";
import { VideoUpload } from "@/components/ui/video-upload";
import { AudioUpload } from "@/components/ui/audio-upload";
import apiClient from "@/api/apiClient";
import axios from "axios";

interface Video {
  type: "youtubeVideo" | "videoFile";
  url: string;
  duration: number;
  file?: File;
}

interface Audio {
  url: string;
  file: File;
}
interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [tags, setTags] = useState<string[]>([]);
  const [images, setImages] = useState<{ url: string; file?: File }[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [audios, setAudios] = useState<Audio[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPost = async (postData: FormData) => {
    const token = localStorage.getItem("token");

    try {
      const response = await apiClient.post(`/post`, postData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.error ||
            "An error occurred while creating the post"
        );
      }
      throw error;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    tags.forEach((tag) => formData.append("tags[]", tag));

    images.forEach((image, index) => {
      if (image.file) {
        formData.append(`images`, image.file);
      }
    });

    videos.forEach((video, index) => {
      if (video.type === "videoFile" && video.file) {
        formData.append(`videos`, video.file);
      } else if (video.type === "youtubeVideo") {
        formData.append(`youtubeVideos[]`, video.url);
      }
    });

    audios.forEach((audio, index) => {
      formData.append(`audios`, audio.file);
    });

    try {
      const result = await createPost(formData);
      console.log("Post created:", result);
      onClose();
    } catch (error) {
      console.error("createPostError : ", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] bg-white">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4 ">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Tags</Label>
            <TagInput value={tags} onChange={setTags} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Images</Label>
            <ImageUpload
              images={images}
              onChange={setImages}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Videos</Label>
            <VideoUpload
              videos={videos}
              onChange={setVideos}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Audios</Label>
            <AudioUpload
              audios={audios}
              onChange={setAudios}
              className="col-span-3"
            />
          </div>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Post"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
