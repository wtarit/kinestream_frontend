import type { ResolutionPresetDTO } from "~/types/resolution";
import type { TranscodeJobResponseDTO, TranscodeRequestDTO } from "~/types/transcode";
import { api } from "./api-client";

export function getSuggestedResolutions(
  videoId: number,
): Promise<ResolutionPresetDTO[]> {
  return api.get<ResolutionPresetDTO[]>(`/videos/${videoId}/suggested-resolutions`);
}

export function requestTranscode(
  videoId: number,
  req: TranscodeRequestDTO,
): Promise<TranscodeJobResponseDTO> {
  return api.post<TranscodeJobResponseDTO>(`/videos/${videoId}/transcode`, req);
}

export function getTranscodeJobs(
  videoId: number,
): Promise<TranscodeJobResponseDTO[]> {
  return api.get<TranscodeJobResponseDTO[]>(`/videos/${videoId}/transcode-jobs`);
}
