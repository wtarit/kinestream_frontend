import { FiFilm } from "react-icons/fi";
import { Link } from "react-router";

export function EmptyState({
  message = "No videos yet",
  showUploadLink = true,
}: {
  message?: string;
  showUploadLink?: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-base-content/60">
      <FiFilm className="text-6xl mb-4" />
      <p className="text-lg">{message}</p>
      {showUploadLink && (
        <Link to="/upload" className="btn btn-primary mt-4">
          Upload your first video
        </Link>
      )}
    </div>
  );
}
