import type { VideoStatus } from "./video";

export interface InitUploadRequest {
  filename: string;
  keepOriginal: boolean;
}

export interface InitUploadResponse {
  videoId: number;
  uploadUrl: string;
  uploadExpiresAt: string;
}

export interface UploadStatusResponse {
  videoId: number;
  status: VideoStatus;
  uploadProgress: number;
  processingProgress: number;
  message: string;
}
