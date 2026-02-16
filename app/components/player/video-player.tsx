import { useEffect, useRef } from "react";
import { useHlsPlayer } from "~/hooks/use-hls-player";
import { ErrorAlert } from "~/components/common/error-alert";

export function VideoPlayer({ streamUrl }: { streamUrl: string | null }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { loadSource, error } = useHlsPlayer(videoRef);

  useEffect(() => {
    if (streamUrl) {
      loadSource(streamUrl);
    }
  }, [streamUrl, loadSource]);

  return (
    <div>
      {error && <ErrorAlert message={error} />}
      <video
        ref={videoRef}
        controls
        className="w-full rounded-lg bg-black aspect-video"
        playsInline
      />
    </div>
  );
}
