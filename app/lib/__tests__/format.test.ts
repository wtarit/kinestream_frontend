import { describe, it, expect } from "@jest/globals";
import { formatDuration, formatBytes, formatDate, formatResolution } from "~/lib/format";

describe("formatDuration", () => {
  it("returns 0:00 for zero or falsy", () => {
    expect(formatDuration(0)).toBe("0:00");
    expect(formatDuration(NaN)).toBe("0:00");
  });

  it("formats seconds only", () => {
    expect(formatDuration(45)).toBe("0:45");
  });

  it("formats minutes and seconds", () => {
    expect(formatDuration(125)).toBe("2:05");
  });

  it("formats hours, minutes, and seconds", () => {
    expect(formatDuration(3661)).toBe("1:01:01");
  });
});

describe("formatBytes", () => {
  it("returns 0 B for zero", () => {
    expect(formatBytes(0)).toBe("0 B");
  });

  it("formats bytes", () => {
    expect(formatBytes(500)).toBe("500 B");
  });

  it("formats kilobytes", () => {
    expect(formatBytes(1024)).toBe("1.0 KB");
  });

  it("formats megabytes", () => {
    expect(formatBytes(1048576)).toBe("1.0 MB");
  });

  it("formats gigabytes", () => {
    expect(formatBytes(1073741824)).toBe("1.0 GB");
  });
});

describe("formatDate", () => {
  it("returns dash for empty string", () => {
    expect(formatDate("")).toBe("-");
  });

  it("formats a valid ISO date string", () => {
    const result = formatDate("2024-01-15T10:30:00Z");
    expect(result).toBeTruthy();
    expect(result).not.toBe("-");
  });
});

describe("formatResolution", () => {
  it("returns dash for missing values", () => {
    expect(formatResolution(0, 0)).toBe("-");
  });

  it("formats width x height", () => {
    expect(formatResolution(1920, 1080)).toBe("1920x1080");
  });
});
