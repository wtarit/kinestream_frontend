import type { VideoStatus } from "~/types/video";

const statusConfig: Record<VideoStatus, { className: string; label: string }> = {
  PENDING_UPLOAD: { className: "badge-ghost", label: "Pending Upload" },
  UPLOADED: { className: "badge-info", label: "Uploaded" },
  PROCESSING: { className: "badge-warning", label: "Processing" },
  READY: { className: "badge-success", label: "Ready" },
  FAILED: { className: "badge-error", label: "Failed" },
};

export function VideoStatusBadge({ status }: { status: VideoStatus }) {
  const config = statusConfig[status] ?? { className: "badge-ghost", label: status };
  return <span className={`badge ${config.className} badge-sm`}>{config.label}</span>;
}
