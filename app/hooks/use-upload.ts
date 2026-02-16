import { useCallback, useState } from "react";
import type { UploadStatusResponse } from "~/types/upload";
import {
  initUpload,
  uploadToS3,
  uploadCallback,
} from "~/services/upload-service";
import { usePollUploadStatus } from "./use-poll-upload-status";

export type UploadPhase =
  | "idle"
  | "initializing"
  | "uploading"
  | "calling-back"
  | "polling"
  | "done"
  | "error";

export function useUpload() {
  const [phase, setPhase] = useState<UploadPhase>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoId, setVideoId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: serverStatus } = usePollUploadStatus(
    videoId,
    phase === "polling",
  );

  // Transition to done when server reports terminal state
  if (
    phase === "polling" &&
    serverStatus &&
    (serverStatus.status === "UPLOADED" ||
      serverStatus.status === "READY" ||
      serverStatus.status === "FAILED")
  ) {
    if (serverStatus.status === "FAILED") {
      setPhase("error");
      setError(serverStatus.message || "Upload processing failed");
    } else {
      setPhase("done");
    }
  }

  const startUpload = useCallback(
    async (file: File, keepOriginal: boolean) => {
      setPhase("initializing");
      setUploadProgress(0);
      setError(null);

      try {
        const initRes = await initUpload({
          filename: file.name,
          keepOriginal,
        });
        setVideoId(initRes.videoId);

        setPhase("uploading");
        await uploadToS3(initRes.uploadUrl, file, setUploadProgress);

        setPhase("calling-back");
        await uploadCallback(initRes.videoId, {
          uploadStatus: "COMPLETED",
          fileSize: file.size,
        });

        setPhase("polling");
      } catch (err) {
        setPhase("error");
        setError(err instanceof Error ? err.message : "Upload failed");
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setPhase("idle");
    setUploadProgress(0);
    setVideoId(null);
    setError(null);
  }, []);

  return {
    phase,
    uploadProgress,
    serverStatus,
    videoId,
    error,
    startUpload,
    reset,
  };
}
