import { Link } from "react-router";
import { FiClock, FiHardDrive } from "react-icons/fi";
import type { VideoResponseDTO } from "~/types/video";
import { formatBytes, formatDuration } from "~/lib/format";
import { getThumbnailUrl } from "~/services/stream-service";
import { VideoStatusBadge } from "./video-status-badge";

export function VideoCard({ video }: { video: VideoResponseDTO }) {
  return (
    <Link to={`/videos/${video.id}`} className="card bg-base-200 shadow-md hover:shadow-lg transition-shadow">
      <figure className="relative aspect-video bg-base-300">
        {video.status !== "PENDING_UPLOAD" ? (
          <img
            src={getThumbnailUrl(video.id)}
            alt={video.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : null}
        {video.durationSeconds > 0 && (
          <span className="absolute bottom-2 right-2 bg-black/75 text-white text-xs px-1.5 py-0.5 rounded">
            {formatDuration(video.durationSeconds)}
          </span>
        )}
      </figure>
      <div className="card-body p-3 gap-1">
        <h3 className="card-title text-sm line-clamp-1">{video.name || video.originalFilename}</h3>
        <div className="flex items-center justify-between">
          <VideoStatusBadge status={video.status} />
          <div className="flex items-center gap-2 text-xs text-base-content/60">
            {video.fileSizeBytes > 0 && (
              <span className="flex items-center gap-1">
                <FiHardDrive />
                {formatBytes(video.fileSizeBytes)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
