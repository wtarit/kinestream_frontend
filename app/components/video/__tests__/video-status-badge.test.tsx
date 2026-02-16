import { describe, it, expect } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import { VideoStatusBadge } from "~/components/video/video-status-badge";
import type { VideoStatus } from "~/types/video";

describe("VideoStatusBadge", () => {
  const cases: { status: VideoStatus; label: string; expectedClass: string }[] = [
    { status: "PENDING_UPLOAD", label: "Pending Upload", expectedClass: "badge-ghost" },
    { status: "UPLOADED", label: "Uploaded", expectedClass: "badge-info" },
    { status: "PROCESSING", label: "Processing", expectedClass: "badge-warning" },
    { status: "READY", label: "Ready", expectedClass: "badge-success" },
    { status: "FAILED", label: "Failed", expectedClass: "badge-error" },
  ];

  cases.forEach(({ status, label, expectedClass }) => {
    it(`renders "${label}" with ${expectedClass} for status ${status}`, () => {
      render(<VideoStatusBadge status={status} />);
      const badge = screen.getByText(label);
      expect(badge).toBeInTheDocument();
      expect(badge.className).toContain(expectedClass);
    });
  });
});
