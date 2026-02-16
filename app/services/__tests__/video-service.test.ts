import { jest, describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import { getVideos, getVideo, deleteVideo } from "~/services/video-service";

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

describe("getVideos", () => {
  it("fetches videos with no params", async () => {
    const mockData = { content: [], totalPages: 0, number: 0 };
    (globalThis.fetch as jest.Mock<typeof fetch>).mockResolvedValue(
      (await mockResponse(mockData)) as Response,
    );

    const result = await getVideos();

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/v1/videos",
      expect.objectContaining({ headers: expect.any(Object) }),
    );
    expect(result).toEqual(mockData);
  });

  it("includes query params when provided", async () => {
    const mockData = { content: [], totalPages: 0, number: 0 };
    (globalThis.fetch as jest.Mock<typeof fetch>).mockResolvedValue(
      (await mockResponse(mockData)) as Response,
    );

    await getVideos({ status: "READY", page: 1, size: 10 });

    const calledUrl = (globalThis.fetch as jest.Mock<typeof fetch>).mock.calls[0][0] as string;
    expect(calledUrl).toContain("status=READY");
    expect(calledUrl).toContain("page=1");
    expect(calledUrl).toContain("size=10");
  });
});

describe("getVideo", () => {
  it("fetches a single video by id", async () => {
    const mockData = { id: 42, name: "test.mp4", status: "READY" };
    (globalThis.fetch as jest.Mock<typeof fetch>).mockResolvedValue(
      (await mockResponse(mockData)) as Response,
    );

    const result = await getVideo(42);

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/v1/videos/42",
      expect.any(Object),
    );
    expect(result).toEqual(mockData);
  });
});

describe("deleteVideo", () => {
  it("sends DELETE request", async () => {
    (globalThis.fetch as jest.Mock<typeof fetch>).mockResolvedValue({
      ok: true,
      status: 204,
      headers: new Headers({ "content-length": "0" }),
      json: () => Promise.resolve(undefined),
      text: () => Promise.resolve(""),
    } as Response);

    await deleteVideo(42);

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/v1/videos/42",
      expect.objectContaining({ method: "DELETE" }),
    );
  });
});
