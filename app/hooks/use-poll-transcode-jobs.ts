import { useEffect, useRef, useState } from "react";
import type { TranscodeJobResponseDTO } from "~/types/transcode";
import { getTranscodeJobs } from "~/services/transcode-service";

const POLL_INTERVAL = 3000;

export function usePollTranscodeJobs(
  videoId: number | null,
  enabled: boolean,
) {
  const [jobs, setJobs] = useState<TranscodeJobResponseDTO[]>([]);
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
        const result = await getTranscodeJobs(videoId);
        setJobs(result);

        const hasActive = result.some(
          (j) => j.status === "PENDING" || j.status === "IN_PROGRESS",
        );
        if (!hasActive && result.length > 0) {
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

  const hasActiveJobs = jobs.some(
    (j) => j.status === "PENDING" || j.status === "IN_PROGRESS",
  );

  return { jobs, isPolling, hasActiveJobs };
}
