// src/layouts/AppLayout.tsx
import type { ReactNode } from "react";
import ServiceNav from "../components/ServiceNav";

type Props = {
  children: ReactNode;
};

export default function AppLayout({ children }: Props) {
  return (
    <div className="min-h-screen flex flex-col text-foreground w-full bg-background">
      {/* HEADER */}
      <ServiceNav />
      {/* MAIN CONTENT */}
      <main className="flex-1 flex justify-center px-4 py-8">
        <div className="w-full max-w-4xl">{children}</div>
      </main>

      {/* FOOTER */}
    </div>
  );
}
