import type {
  InitUploadRequest,
  InitUploadResponse,
  UploadStatusResponse,
} from "~/types/upload";
import { api } from "./api-client";

export function initUpload(req: InitUploadRequest): Promise<InitUploadResponse> {
  return api.post<InitUploadResponse>("/videos/init-upload", req);
}

export function uploadCallback(videoId: number): Promise<void> {
  return api.post<void>(`/videos/${videoId}/upload-callback`);
}

export function getUploadStatus(videoId: number): Promise<UploadStatusResponse> {
  return api.get<UploadStatusResponse>(`/videos/${videoId}/upload-status`);
}

export function uploadToS3(
  uploadUrl: string,
  file: File,
  onProgress: (percent: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl);
    xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`S3 upload failed with status ${xhr.status}`));
      }
    };

    xhr.onerror = () => reject(new Error("S3 upload failed: network error"));
    xhr.onabort = () => reject(new Error("S3 upload aborted"));

    xhr.send(file);
  });
}
