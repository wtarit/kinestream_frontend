import { FiAlertCircle } from "react-icons/fi";

export function ErrorAlert({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div role="alert" className="alert alert-error">
      <FiAlertCircle className="text-lg" />
      <span>{message}</span>
      {onRetry && (
        <button className="btn btn-sm btn-ghost" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}
