import { useRef } from "react";
import { FiAlertTriangle } from "react-icons/fi";

export function DeleteVideoModal({
  videoName,
  isDeleting,
  onConfirm,
  onCancel,
}: {
  videoName: string;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <dialog ref={dialogRef} className="modal modal-open">
      <div className="modal-box">
        <div className="flex items-center gap-3 mb-4">
          <FiAlertTriangle className="text-2xl text-warning" />
          <h3 className="font-bold text-lg">Delete Video</h3>
        </div>
        <p>
          Are you sure you want to delete <strong>{videoName}</strong>? This action cannot be undone.
        </p>
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onCancel} disabled={isDeleting}>
            Cancel
          </button>
          <button className="btn btn-error" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? <span className="loading loading-spinner loading-sm" /> : "Delete"}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onCancel}>close</button>
      </form>
    </dialog>
  );
}
