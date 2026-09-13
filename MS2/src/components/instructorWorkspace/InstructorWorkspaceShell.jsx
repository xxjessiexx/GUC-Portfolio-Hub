import DashboardLayout from "@/components/layout/DashboardLayout";
import { cn } from "@/lib/utils";

export default function InstructorWorkspaceShell({
  children,
  className = "",
  contentClassName = "",
  overlay = null,
}) {
  return (
    <DashboardLayout workspace="instructor" workspaceLabel="Instructor Workspace">
      <main className={cn("min-h-screen px-4 py-6 sm:px-6 lg:px-8", className)}>
        <div
          className={cn(
            "mx-auto w-full max-w-[1480px] space-y-6",
            contentClassName
          )}
        >
          {children}
        </div>
      </main>
      {overlay}
    </DashboardLayout>
  );
}
