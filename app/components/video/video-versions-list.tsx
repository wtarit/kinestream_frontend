import { Link } from "react-router";
import { FiPlay } from "react-icons/fi";
import type { VideoVersionDTO } from "~/types/video";
import { formatResolution } from "~/lib/format";

export function VideoVersionsList({
  versions,
  videoId,
}: {
  versions: VideoVersionDTO[];
  videoId: number;
}) {
  if (!versions || versions.length === 0) {
    return <p className="text-sm text-base-content/60">No transcoded versions available.</p>;
  }

  return (
    <div className="space-y-2">
      {versions.map((v) => (
        <div
          key={v.id}
          className="flex items-center justify-between bg-base-300 rounded-lg px-3 py-2"
        >
          <div className="flex items-center gap-2">
            <span
              className={`badge badge-sm ${v.versionType === "ORIGINAL" ? "badge-ghost" : "badge-primary"}`}
            >
              {v.versionType}
            </span>
            <span className="text-sm">
              {v.resolutionLabel || formatResolution(v.width, v.height)}
            </span>
            {v.format && <span className="text-xs text-base-content/50">{v.format}</span>}
          </div>
          <Link
            to={`/videos/${videoId}/play?resolution=${v.resolutionLabel}`}
            className="btn btn-xs btn-primary btn-outline gap-1"
          >
            <FiPlay />
            Play
          </Link>
        </div>
      ))}
    </div>
  );
}
