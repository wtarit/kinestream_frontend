import type { StreamingUrlResponse } from "~/types/stream";
import { api, buildUrl } from "./api-client";

export function getStreamingUrl(
  videoId: number,
  resolution: string,
  format: string = "hls",
): Promise<StreamingUrlResponse> {
  const params = new URLSearchParams({ resolution, format });
  return api.get<StreamingUrlResponse>(`/videos/${videoId}/stream?${params}`);
}

export function getThumbnailUrl(videoId: number): string {
  return buildUrl(`/videos/${videoId}/thumbnail`);
}
