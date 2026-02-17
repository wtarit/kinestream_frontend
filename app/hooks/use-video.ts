import { useCallback, useEffect, useState } from "react";
import type { VideoResponseDTO } from "~/types/video";
import { getVideo } from "~/services/video-service";

export function useVideo(id: number) {
  const [video, setVideo] = useState<VideoResponseDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVideo = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getVideo(id);
      setVideo(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch video");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchVideo();
  }, [fetchVideo]);

  return { video, isLoading, error, refetch: fetchVideo };
}
