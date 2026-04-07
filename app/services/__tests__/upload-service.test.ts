import { jest, describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import { initUpload, uploadCallback, getUploadStatus } from "~/services/upload-service";

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

describe("initUpload", () => {
  it("sends POST with filename and keepOriginal", async () => {
    const mockData = {
      videoId: 1,
      uploadUrl: "https://s3.example.com/upload",
      uploadExpiresAt: "2024-01-01T00:00:00Z",
    };
    (globalThis.fetch as jest.Mock<typeof fetch>).mockResolvedValue(
      (await mockResponse(mockData)) as Response,
    );

    const result = await initUpload({ filename: "test.mp4", keepOriginal: true });

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/v1/videos/init-upload",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ filename: "test.mp4", keepOriginal: true }),
      }),
    );
    expect(result.videoId).toBe(1);
    expect(result.uploadUrl).toBe("https://s3.example.com/upload");
  });
});

describe("uploadCallback", () => {
  it("sends POST with no body", async () => {
    (globalThis.fetch as jest.Mock<typeof fetch>).mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ "content-length": "0" }),
      json: () => Promise.resolve(undefined),
      text: () => Promise.resolve(""),
    } as Response);

    await uploadCallback(1);

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/v1/videos/1/upload-callback",
      expect.objectContaining({
        method: "POST",
      }),
    );
  });
});

describe("getUploadStatus", () => {
  it("fetches upload status for a video", async () => {
    const mockData = {
      videoId: 1,
      status: "UPLOADED",
      uploadProgress: 100,
      processingProgress: 0,
      message: "Upload complete",
    };
    (globalThis.fetch as jest.Mock<typeof fetch>).mockResolvedValue(
      (await mockResponse(mockData)) as Response,
    );

    const result = await getUploadStatus(1);

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/v1/videos/1/upload-status",
      expect.any(Object),
    );
    expect(result.status).toBe("UPLOADED");
  });
});
