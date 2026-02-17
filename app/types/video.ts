export type VideoStatus =
  | "PENDING_UPLOAD"
  | "UPLOADED"
  | "PROCESSING"
  | "READY"
  | "FAILED";

export type VersionType = "ORIGINAL" | "TRANSCODED";

export interface VideoVersionDTO {
  id: number;
  versionType: VersionType;
  resolutionLabel: string;
  width: number;
  height: number;
  format: string;
  streamingUrl: string;
}

export interface VideoResponseDTO {
  id: number;
  name: string;
  originalFilename: string;
  status: VideoStatus;
  format: string;
  codec: string;
  durationSeconds: number;
  width: number;
  height: number;
  bitrateKbps: number;
  frameRate: number;
  fileSizeBytes: number;
  thumbnailUrl: string;
  thumbnailTimestampSeconds: number;
  availableVersions: VideoVersionDTO[];
  createdDateTime: string;
  uploadCompletedAt: string;
  processingCompletedAt: string;
  updatedAt: string;
}
