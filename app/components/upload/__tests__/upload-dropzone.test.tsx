import { jest, describe, it, expect } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UploadDropzone } from "~/components/upload/upload-dropzone";

describe("UploadDropzone", () => {
  it("renders default state", () => {
    render(<UploadDropzone onFileSelected={jest.fn()} />);
    expect(screen.getByText("Drop your video file here")).toBeInTheDocument();
    expect(screen.getByText("or click to browse")).toBeInTheDocument();
  });

  it("calls onFileSelected when file is chosen", async () => {
    const onFileSelected = jest.fn();
    render(<UploadDropzone onFileSelected={onFileSelected} />);

    const file = new File(["video content"], "test.mp4", { type: "video/mp4" });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;

    await userEvent.upload(input, file);

    expect(onFileSelected).toHaveBeenCalledWith(file);
  });

  it("shows selected file name and size", async () => {
    render(<UploadDropzone onFileSelected={jest.fn()} />);

    const file = new File(["x".repeat(1024)], "myvideo.mp4", { type: "video/mp4" });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;

    await userEvent.upload(input, file);

    expect(screen.getByText("myvideo.mp4")).toBeInTheDocument();
  });

  it("disables input when disabled prop is true", () => {
    render(<UploadDropzone onFileSelected={jest.fn()} disabled />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });
});
