import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { FiArrowLeft, FiTrash2 } from "react-icons/fi";
import { useVideo } from "~/hooks/use-video";
import { usePollTranscodeJobs } from "~/hooks/use-poll-transcode-jobs";
import { LoadingSpinner } from "~/components/common/loading-spinner";
import { ErrorAlert } from "~/components/common/error-alert";
import { VideoMetadata } from "~/components/video/video-metadata";
import { VideoVersionsList } from "~/components/video/video-versions-list";
import { DeleteVideoModal } from "~/components/video/delete-video-modal";
import { ResolutionPicker } from "~/components/transcode/resolution-picker";
import { TranscodeJobsList } from "~/components/transcode/transcode-jobs-list";
import { getThumbnailUrl } from "~/services/stream-service";
import { requestTranscode } from "~/services/transcode-service";
import { deleteVideo } from "~/services/video-service";
import type { ResolutionPresetDTO } from "~/types/resolution";

export function meta() {
  return [{ title: "KineStream - Video Details" }];
}

export default function VideoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const videoId = Number(id);

  const { video, isLoading, error, refetch } = useVideo(videoId);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTranscoding, setIsTranscoding] = useState(false);
  const [transcodeError, setTranscodeError] = useState<string | null>(null);
  const [pollJobs, setPollJobs] = useState(false);

  const { jobs, isPolling, hasActiveJobs } = usePollTranscodeJobs(
    videoId,
    pollJobs,
  );

  // Re-fetch video when all jobs finish
  if (pollJobs && !hasActiveJobs && jobs.length > 0) {
    setPollJobs(false);
    refetch();
  }

  const handleTranscode = async (resolutions: ResolutionPresetDTO[]) => {
    setIsTranscoding(true);
    setTranscodeError(null);
    try {
      for (const res of resolutions) {
        await requestTranscode(videoId, {
          targetResolution: res.label,
          format: "hls",
          priority: 0,
        });
      }
      setPollJobs(true);
    } catch (err) {
      setTranscodeError(err instanceof Error ? err.message : "Transcode request failed");
    } finally {
      setIsTranscoding(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteVideo(videoId);
      navigate("/");
    } catch {
      setIsDeleting(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} onRetry={refetch} />;
  if (!video) return <ErrorAlert message="Video not found" />;

  const canTranscode = video.status === "UPLOADED" || video.status === "READY";

  return (
    <div>
      <button className="btn btn-ghost btn-sm mb-4 gap-1" onClick={() => navigate("/")}>
        <FiArrowLeft /> Back to Videos
      </button>

      <h1 className="text-2xl font-bold mb-6">
        {video.name || video.originalFilename}
      </h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left column */}
        <div className="flex-1 space-y-4">
          <div className="aspect-video bg-base-300 rounded-lg overflow-hidden">
            {video.status !== "PENDING_UPLOAD" && (
              <img
                src={getThumbnailUrl(video.id)}
                alt={video.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            )}
          </div>

          <div className="card bg-base-200">
            <div className="card-body p-4">
              <h3 className="text-sm font-semibold mb-2">Video Information</h3>
              <VideoMetadata video={video} />
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="w-full lg:w-96 space-y-4">
          {/* Available versions */}
          <div className="card bg-base-200">
            <div className="card-body p-4">
              <h3 className="text-sm font-semibold mb-2">Available Versions</h3>
              <VideoVersionsList versions={video.availableVersions} videoId={video.id} />
            </div>
          </div>

          {/* Transcode section */}
          {canTranscode && (
            <div className="card bg-base-200">
              <div className="card-body p-4">
                <h3 className="text-sm font-semibold mb-2">Transcode</h3>
                {transcodeError && <ErrorAlert message={transcodeError} />}
                <ResolutionPicker
                  videoId={videoId}
                  onSubmit={handleTranscode}
                  isSubmitting={isTranscoding}
                />
              </div>
            </div>
          )}

          {/* Transcode jobs */}
          {(jobs.length > 0 || pollJobs) && (
            <div className="card bg-base-200">
              <div className="card-body p-4">
                <TranscodeJobsList jobs={jobs} isPolling={isPolling} />
              </div>
            </div>
          )}

          {/* Delete button */}
          <button
            className="btn btn-error btn-outline w-full gap-2"
            onClick={() => setShowDeleteModal(true)}
          >
            <FiTrash2 /> Delete Video
          </button>
        </div>
      </div>

      {showDeleteModal && (
        <DeleteVideoModal
          videoName={video.name || video.originalFilename}
          isDeleting={isDeleting}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
}
