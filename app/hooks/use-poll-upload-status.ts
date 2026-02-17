import { useEffect, useRef, useState } from "react";
import type { UploadStatusResponse } from "~/types/upload";
import { getUploadStatus } from "~/services/upload-service";

const POLL_INTERVAL = 2000;

export function usePollUploadStatus(
  videoId: number | null,
  enabled: boolean,
) {
  const [data, setData] = useState<UploadStatusResponse | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!videoId || !enabled) {
      setIsPolling(false);
      return;
    }

    setIsPolling(true);

    const poll = async () => {
      try {
        const status = await getUploadStatus(videoId);
        setData(status);

        if (
          status.status === "UPLOADED" ||
          status.status === "READY" ||
          status.status === "FAILED"
        ) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setIsPolling(false);
        }
      } catch {
        // Keep polling on transient errors
      }
    };

    poll();
    intervalRef.current = setInterval(poll, POLL_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsPolling(false);
    };
  }, [videoId, enabled]);

  return { data, isPolling };
}
