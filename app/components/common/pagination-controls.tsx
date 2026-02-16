export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-6">
      <div className="join">
        <button
          className="join-item btn btn-sm"
          disabled={currentPage === 0}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`join-item btn btn-sm ${i === currentPage ? "btn-active btn-primary" : ""}`}
            onClick={() => onPageChange(i)}
          >
            {i + 1}
          </button>
        ))}
        <button
          className="join-item btn btn-sm"
          disabled={currentPage === totalPages - 1}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
