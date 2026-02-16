import { useState } from "react";
import type { VideoStatus } from "~/types/video";
import { useVideos } from "~/hooks/use-videos";
import { VideoGrid } from "~/components/video/video-grid";
import { LoadingSpinner } from "~/components/common/loading-spinner";
import { EmptyState } from "~/components/common/empty-state";
import { ErrorAlert } from "~/components/common/error-alert";
import { PaginationControls } from "~/components/common/pagination-controls";

const STATUS_TABS: { label: string; value: VideoStatus | undefined }[] = [
  { label: "All", value: undefined },
  { label: "Pending", value: "PENDING_UPLOAD" },
  { label: "Uploaded", value: "UPLOADED" },
  { label: "Processing", value: "PROCESSING" },
  { label: "Ready", value: "READY" },
  { label: "Failed", value: "FAILED" },
];

export function meta() {
  return [
    { title: "KineStream - My Videos" },
    { name: "description", content: "Video streaming platform" },
  ];
}

export default function Home() {
  const [statusFilter, setStatusFilter] = useState<VideoStatus | undefined>(undefined);
  const [page, setPage] = useState(0);

  const { data, isLoading, error, refetch } = useVideos({
    status: statusFilter,
    page,
    size: 20,
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Videos</h1>
      </div>

      {/* Status filter tabs */}
      <div className="tabs tabs-boxed mb-6 bg-base-200">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.label}
            className={`tab ${statusFilter === tab.value ? "tab-active" : ""}`}
            onClick={() => {
              setStatusFilter(tab.value);
              setPage(0);
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && <ErrorAlert message={error} onRetry={refetch} />}

      {isLoading ? (
        <LoadingSpinner />
      ) : data && data.content.length > 0 ? (
        <>
          <VideoGrid videos={data.content} />
          <PaginationControls
            currentPage={data.number}
            totalPages={data.totalPages}
            onPageChange={setPage}
          />
        </>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
