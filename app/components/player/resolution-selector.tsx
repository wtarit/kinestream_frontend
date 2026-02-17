import type { VideoVersionDTO } from "~/types/video";
import { formatResolution } from "~/lib/format";

export function ResolutionSelector({
  versions,
  selectedResolution,
  onChange,
}: {
  versions: VideoVersionDTO[];
  selectedResolution: string;
  onChange: (resolution: string) => void;
}) {
  const transcodedVersions = versions.filter((v) => v.versionType === "TRANSCODED");

  if (transcodedVersions.length === 0) return null;

  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium">Resolution:</label>
      <select
        className="select select-sm select-bordered"
        value={selectedResolution}
        onChange={(e) => onChange(e.target.value)}
      >
        {transcodedVersions.map((v) => (
          <option key={v.id} value={v.resolutionLabel}>
            {v.resolutionLabel || formatResolution(v.width, v.height)}
          </option>
        ))}
      </select>
    </div>
  );
}
