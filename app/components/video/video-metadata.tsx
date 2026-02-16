import type { VideoResponseDTO } from "~/types/video";
import { formatBytes, formatDate, formatDuration, formatResolution } from "~/lib/format";
import { VideoStatusBadge } from "./video-status-badge";

export function VideoMetadata({ video }: { video: VideoResponseDTO }) {
  const rows = [
    { label: "Status", value: <VideoStatusBadge status={video.status} /> },
    { label: "Resolution", value: formatResolution(video.width, video.height) },
    { label: "Duration", value: formatDuration(video.durationSeconds) },
    { label: "File Size", value: formatBytes(video.fileSizeBytes) },
    { label: "Codec", value: video.codec || "-" },
    { label: "Format", value: video.format || "-" },
    { label: "Bitrate", value: video.bitrateKbps ? `${video.bitrateKbps} kbps` : "-" },
    { label: "Frame Rate", value: video.frameRate ? `${video.frameRate} fps` : "-" },
    { label: "Created", value: formatDate(video.createdDateTime) },
    { label: "Uploaded", value: formatDate(video.uploadCompletedAt) },
    { label: "Processed", value: formatDate(video.processingCompletedAt) },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="table table-sm">
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th className="text-base-content/60 font-medium w-32">{row.label}</th>
              <td>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
