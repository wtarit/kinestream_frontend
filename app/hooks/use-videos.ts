import { useCallback, useEffect, useState } from "react";
import type { PageVideoResponseDTO } from "~/types/pagination";
import type { VideoStatus } from "~/types/video";
import { getVideos, type GetVideosParams } from "~/services/video-service";

export function useVideos(params: GetVideosParams = {}) {
  const [data, setData] = useState<PageVideoResponseDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getVideos(params);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch videos");
    } finally {
      setIsLoading(false);
    }
  }, [params.status, params.page, params.size, params.sortBy, params.sortDirection]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  return { data, isLoading, error, refetch: fetchVideos };
}
