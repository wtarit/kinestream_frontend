import { Link } from "react-router";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import type { UploadPhase } from "~/hooks/use-upload";
import type { UploadStatusResponse } from "~/types/upload";

export function UploadProgress({
  phase,
  uploadProgress,
  serverStatus,
  videoId,
  error,
}: {
  phase: UploadPhase;
  uploadProgress: number;
  serverStatus: UploadStatusResponse | null;
  videoId: number | null;
  error: string | null;
}) {
  if (phase === "idle") return null;

  return (
    <div className="mt-6 space-y-4">
      {/* S3 Upload Progress */}
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span>Uploading to storage</span>
          <span>{phase === "uploading" ? `${uploadProgress}%` : phase === "initializing" ? "Initializing..." : "Complete"}</span>
        </div>
        <progress
          className="progress progress-primary w-full"
          value={phase === "initializing" ? undefined : uploadProgress}
          max="100"
        />
      </div>

      {/* Server Processing */}
      {(phase === "calling-back" || phase === "polling" || phase === "done") && (
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Server processing</span>
            <span>
              {phase === "calling-back"
                ? "Notifying server..."
                : serverStatus?.message || (phase === "done" ? "Complete" : "Processing...")}
            </span>
          </div>
          <progress
            className="progress progress-secondary w-full"
            value={serverStatus?.processingProgress ?? undefined}
            max="100"
          />
        </div>
      )}

      {/* Done */}
      {phase === "done" && videoId && (
        <div className="alert alert-success">
          <FiCheckCircle className="text-lg" />
          <span>Upload complete!</span>
          <Link to={`/videos/${videoId}`} className="btn btn-sm btn-ghost">
            View Video
          </Link>
        </div>
      )}

      {/* Error */}
      {phase === "error" && error && (
        <div className="alert alert-error">
          <FiXCircle className="text-lg" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
