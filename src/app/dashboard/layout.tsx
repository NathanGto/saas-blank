import { ReactNode } from "react";
import { Sidebar } from "@/components/sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950">
      <div className="mx-auto flex max-w-6xl flex-col md:flex-row">
        <Sidebar />
        <div className="flex-1">
          <div className="px-4 py-6 sm:px-6 lg:px-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
