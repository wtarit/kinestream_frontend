export type JobType =
  | "GENERATE_THUMBNAIL"
  | "TRANSCODE"
  | "GENERATE_HLS";

export type JobStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED";

export interface TranscodeRequestDTO {
  targetResolution: string;
  format: string;
  priority: number;
}

export interface TranscodeJobResponseDTO {
  jobId: number;
  videoId: number;
  jobType: JobType;
  status: JobStatus;
  priority: number;
  attemptCount: number;
  errorMessage: string;
  createdAt: string;
  startedAt: string;
  completedAt: string;
}
