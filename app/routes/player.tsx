import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { FiArrowLeft } from "react-icons/fi";
import { useVideo } from "~/hooks/use-video";
import { VideoPlayer } from "~/components/player/video-player";
import { ResolutionSelector } from "~/components/player/resolution-selector";
import { LoadingSpinner } from "~/components/common/loading-spinner";
import { ErrorAlert } from "~/components/common/error-alert";
import { getStreamingUrl } from "~/services/stream-service";

export function meta() {
  return [{ title: "KineStream - Player" }];
}

export default function Player() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const videoId = Number(id);

  const { video, isLoading, error } = useVideo(videoId);
  const [selectedResolution, setSelectedResolution] = useState(
    searchParams.get("resolution") || "",
  );
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [streamError, setStreamError] = useState<string | null>(null);

  // Set default resolution from video versions
  useEffect(() => {
    if (video && !selectedResolution) {
      const transcoded = video.availableVersions?.filter(
        (v) => v.versionType === "TRANSCODED",
      );
      if (transcoded?.length) {
        setSelectedResolution(transcoded[0].resolutionLabel);
      }
    }
  }, [video, selectedResolution]);

  // Fetch streaming URL when resolution changes
  useEffect(() => {
    if (!videoId || !selectedResolution) return;

    setStreamError(null);
    getStreamingUrl(videoId, selectedResolution)
      .then((res) => setStreamUrl(res.streamUrl))
      .catch((err) =>
        setStreamError(err instanceof Error ? err.message : "Failed to get stream URL"),
      );
  }, [videoId, selectedResolution]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;
  if (!video) return <ErrorAlert message="Video not found" />;

  return (
    <div className="max-w-5xl mx-auto">
      <button
        className="btn btn-ghost btn-sm mb-4 gap-1"
        onClick={() => navigate(`/videos/${videoId}`)}
      >
        <FiArrowLeft /> Back to Details
      </button>

      <h1 className="text-2xl font-bold mb-4">
        {video.name || video.originalFilename}
      </h1>

      {streamError && <ErrorAlert message={streamError} />}

      <VideoPlayer streamUrl={streamUrl} />

      <div className="mt-4">
        <ResolutionSelector
          versions={video.availableVersions || []}
          selectedResolution={selectedResolution}
          onChange={setSelectedResolution}
        />
      </div>
    </div>
  );
}
