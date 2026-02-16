import type { ReactNode } from "react";

export function PageContainer({ children }: { children: ReactNode }) {
  return (
    <main className="container mx-auto max-w-7xl px-4 py-6">
      {children}
    </main>
  );
}
