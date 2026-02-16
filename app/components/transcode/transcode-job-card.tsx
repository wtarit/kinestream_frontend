import type { TranscodeJobResponseDTO } from "~/types/transcode";
import { formatDate } from "~/lib/format";

const statusConfig: Record<string, { className: string; label: string }> = {
  PENDING: { className: "badge-ghost", label: "Pending" },
  IN_PROGRESS: { className: "badge-warning", label: "In Progress" },
  COMPLETED: { className: "badge-success", label: "Completed" },
  FAILED: { className: "badge-error", label: "Failed" },
};

const jobTypeLabels: Record<string, string> = {
  EXTRACT_METADATA: "Extract Metadata",
  GENERATE_THUMBNAIL: "Generate Thumbnail",
  TRANSCODE: "Transcode",
  GENERATE_HLS: "Generate HLS",
};

export function TranscodeJobCard({ job }: { job: TranscodeJobResponseDTO }) {
  const statusCfg = statusConfig[job.status] ?? { className: "badge-ghost", label: job.status };

  return (
    <div className="bg-base-300 rounded-lg px-3 py-2 space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">
          {jobTypeLabels[job.jobType] || job.jobType}
        </span>
        <span className={`badge badge-sm ${statusCfg.className}`}>{statusCfg.label}</span>
      </div>
      <div className="flex items-center gap-3 text-xs text-base-content/50">
        <span>Attempts: {job.attemptCount}</span>
        {job.startedAt && <span>Started: {formatDate(job.startedAt)}</span>}
        {job.completedAt && <span>Completed: {formatDate(job.completedAt)}</span>}
      </div>
      {job.status === "IN_PROGRESS" && (
        <progress className="progress progress-primary w-full h-1" />
      )}
      {job.errorMessage && (
        <p className="text-xs text-error">{job.errorMessage}</p>
      )}
    </div>
  );
}
