import { useCallback, useRef, useState } from "react";
import { FiUploadCloud } from "react-icons/fi";
import { formatBytes } from "~/lib/format";

export function UploadDropzone({
  onFileSelected,
  disabled,
}: {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      setSelectedFile(file);
      onFileSelected(file);
    },
    [onFileSelected],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled) return;
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile, disabled],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  return (
    <div
      className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer ${
        isDragging
          ? "border-primary bg-primary/10"
          : "border-base-300 hover:border-primary/50"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => !disabled && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={handleChange}
        disabled={disabled}
      />
      <FiUploadCloud className="text-5xl text-primary mx-auto mb-4" />
      {selectedFile ? (
        <div>
          <p className="font-medium">{selectedFile.name}</p>
          <p className="text-sm text-base-content/60">{formatBytes(selectedFile.size)}</p>
        </div>
      ) : (
        <div>
          <p className="font-medium">Drop your video file here</p>
          <p className="text-sm text-base-content/60 mt-1">or click to browse</p>
        </div>
      )}
    </div>
  );
}
