import type { TranscodeJobResponseDTO } from "~/types/transcode";
import { TranscodeJobCard } from "./transcode-job-card";

export function TranscodeJobsList({
  jobs,
  isPolling,
}: {
  jobs: TranscodeJobResponseDTO[];
  isPolling: boolean;
}) {
  if (jobs.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <h4 className="text-sm font-semibold">Transcode Jobs</h4>
        {isPolling && (
          <span className="loading loading-dots loading-xs text-primary" />
        )}
      </div>
      {jobs.map((job) => (
        <TranscodeJobCard key={job.jobId} job={job} />
      ))}
    </div>
  );
}
