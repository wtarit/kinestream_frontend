import type { PageVideoResponseDTO } from "~/types/pagination";
import type { VideoResponseDTO, VideoStatus } from "~/types/video";
import { api } from "./api-client";

export interface GetVideosParams {
  status?: VideoStatus;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: string;
}

export function getVideos(params: GetVideosParams = {}): Promise<PageVideoResponseDTO> {
  const searchParams = new URLSearchParams();
  if (params.status) searchParams.set("status", params.status);
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.size !== undefined) searchParams.set("size", String(params.size));
  if (params.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params.sortDirection) searchParams.set("sortDirection", params.sortDirection);

  const query = searchParams.toString();
  return api.get<PageVideoResponseDTO>(`/videos${query ? `?${query}` : ""}`);
}

export function getVideo(id: number): Promise<VideoResponseDTO> {
  return api.get<VideoResponseDTO>(`/videos/${id}`);
}

export function deleteVideo(id: number): Promise<void> {
  return api.delete<void>(`/videos/${id}`);
}
