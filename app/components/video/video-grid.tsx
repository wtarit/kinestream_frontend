import type { VideoResponseDTO } from "~/types/video";
import { VideoCard } from "./video-card";

export function VideoGrid({ videos }: { videos: VideoResponseDTO[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}
