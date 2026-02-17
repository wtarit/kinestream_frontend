import { jest, describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import { renderHook, act } from "@testing-library/react";

// For ESM, use unstable_mockModule before importing the module under test
jest.unstable_mockModule("~/services/upload-service", () => ({
  getUploadStatus: jest.fn(),
  initUpload: jest.fn(),
  uploadCallback: jest.fn(),
  uploadToS3: jest.fn(),
}));

const { getUploadStatus } = await import("~/services/upload-service");
const { usePollUploadStatus } = await import("~/hooks/use-poll-upload-status");

const mockGetUploadStatus = getUploadStatus as jest.MockedFunction<typeof getUploadStatus>;

describe("usePollUploadStatus", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockGetUploadStatus.mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("does not poll when disabled", () => {
    renderHook(() => usePollUploadStatus(1, false));
    expect(mockGetUploadStatus).not.toHaveBeenCalled();
  });

  it("does not poll when videoId is null", () => {
    renderHook(() => usePollUploadStatus(null, true));
    expect(mockGetUploadStatus).not.toHaveBeenCalled();
  });

  it("polls immediately when enabled with videoId", async () => {
    mockGetUploadStatus.mockResolvedValue({
      videoId: 1,
      status: "PROCESSING",
      uploadProgress: 100,
      processingProgress: 50,
      message: "Processing...",
    });

    const { result } = renderHook(() => usePollUploadStatus(1, true));

    await act(async () => {
      await Promise.resolve();
    });

    expect(mockGetUploadStatus).toHaveBeenCalledWith(1);
    expect(result.current.data?.status).toBe("PROCESSING");
    expect(result.current.isPolling).toBe(true);
  });

  it("stops polling when status reaches UPLOADED", async () => {
    mockGetUploadStatus.mockResolvedValue({
      videoId: 1,
      status: "UPLOADED",
      uploadProgress: 100,
      processingProgress: 100,
      message: "Done",
    });

    const { result } = renderHook(() => usePollUploadStatus(1, true));

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.data?.status).toBe("UPLOADED");
    expect(result.current.isPolling).toBe(false);
  });
});
