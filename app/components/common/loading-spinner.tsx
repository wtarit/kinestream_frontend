export function LoadingSpinner({ size = "lg" }: { size?: "sm" | "md" | "lg" }) {
  return (
    <div className="flex justify-center items-center py-12">
      <span className={`loading loading-spinner loading-${size} text-primary`} />
    </div>
  );
}
