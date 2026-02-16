import { useState } from "react";
import { useUpload } from "~/hooks/use-upload";
import { UploadDropzone } from "~/components/upload/upload-dropzone";
import { KeepOriginalToggle } from "~/components/upload/keep-original-toggle";
import { UploadProgress } from "~/components/upload/upload-progress";

export function meta() {
  return [
    { title: "KineStream - Upload Video" },
    { name: "description", content: "Upload a video" },
  ];
}

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [keepOriginal, setKeepOriginal] = useState(true);

  const { phase, uploadProgress, serverStatus, videoId, error, startUpload, reset } =
    useUpload();

  const isUploading = phase !== "idle" && phase !== "done" && phase !== "error";

  const handleUpload = () => {
    if (!file) return;
    startUpload(file, keepOriginal);
  };

  const handleReset = () => {
    reset();
    setFile(null);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Upload Video</h1>

      <div className="card bg-base-200 shadow-lg">
        <div className="card-body">
          <UploadDropzone
            onFileSelected={setFile}
            disabled={isUploading}
          />

          <KeepOriginalToggle
            checked={keepOriginal}
            onChange={setKeepOriginal}
            disabled={isUploading}
          />

          <div className="card-actions mt-4">
            {phase === "idle" && (
              <button
                className="btn btn-primary w-full"
                disabled={!file}
                onClick={handleUpload}
              >
                Upload Video
              </button>
            )}
            {(phase === "done" || phase === "error") && (
              <button className="btn btn-ghost w-full" onClick={handleReset}>
                Upload Another
              </button>
            )}
          </div>

          <UploadProgress
            phase={phase}
            uploadProgress={uploadProgress}
            serverStatus={serverStatus}
            videoId={videoId}
            error={error}
          />
        </div>
      </div>
    </div>
  );
}
