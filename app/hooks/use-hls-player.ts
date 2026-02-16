import Hls from "hls.js";
import { useCallback, useEffect, useRef, useState } from "react";

export function useHlsPlayer(videoRef: React.RefObject<HTMLVideoElement | null>) {
  const hlsRef = useRef<Hls | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isSupported = Hls.isSupported();

  const loadSource = useCallback(
    (url: string) => {
      const video = videoRef.current;
      if (!video) return;

      setError(null);

      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }

      if (isSupported) {
        const hls = new Hls({ enableWorker: true });
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(Hls.Events.ERROR, (_event, data) => {
          if (data.fatal) {
            setError(`Playback error: ${data.type}`);
          }
        });
        hlsRef.current = hls;
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        // Safari native HLS
        video.src = url;
      } else {
        setError("HLS playback is not supported in this browser.");
      }
    },
    [videoRef, isSupported],
  );

  const destroy = useCallback(() => {
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      hlsRef.current?.destroy();
    };
  }, []);

  return { loadSource, isSupported, error, destroy };
}
