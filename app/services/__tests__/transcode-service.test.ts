import { jest, describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import {
  getSuggestedResolutions,
  requestTranscode,
  getTranscodeJobs,
} from "~/services/transcode-service";

const mockResponse = (data: unknown, status = 200) =>
  Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    headers: new Headers({ "content-type": "application/json" }),
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  } as Response);

beforeEach(() => {
  globalThis.fetch = jest.fn() as jest.Mock<typeof fetch>;
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("getSuggestedResolutions", () => {
  it("fetches suggested resolutions for a video", async () => {
    const mockData = [
      { label: "720p", width: 1280, height: 720, targetBitrateKbps: 2500, description: "HD" },
    ];
    (globalThis.fetch as jest.Mock<typeof fetch>).mockResolvedValue(
      (await mockResponse(mockData)) as Response,
    );

    const result = await getSuggestedResolutions(1);

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/v1/videos/1/suggested-resolutions",
      expect.any(Object),
    );
    expect(result).toHaveLength(1);
    expect(result[0].label).toBe("720p");
  });
});

describe("requestTranscode", () => {
  it("sends transcode request", async () => {
    const mockData = { jobId: 10, videoId: 1, status: "PENDING" };
    (globalThis.fetch as jest.Mock<typeof fetch>).mockResolvedValue(
      (await mockResponse(mockData)) as Response,
    );

    const result = await requestTranscode(1, {
      targetResolution: "720p",
      format: "hls",
      priority: 0,
    });

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/v1/videos/1/transcode",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ targetResolution: "720p", format: "hls", priority: 0 }),
      }),
    );
    expect(result.jobId).toBe(10);
  });
});

describe("getTranscodeJobs", () => {
  it("fetches transcode jobs for a video", async () => {
    const mockData = [
      { jobId: 10, videoId: 1, jobType: "TRANSCODE", status: "COMPLETED" },
    ];
    (globalThis.fetch as jest.Mock<typeof fetch>).mockResolvedValue(
      (await mockResponse(mockData)) as Response,
    );

    const result = await getTranscodeJobs(1);

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/v1/videos/1/transcode-jobs",
      expect.any(Object),
    );
    expect(result).toHaveLength(1);
  });
});
