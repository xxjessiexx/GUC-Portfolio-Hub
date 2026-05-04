import { Ban } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function DangerActions() {
    const handleDeactivate = () => {
      const users = JSON.parse(sessionStorage.getItem("users")) || [];
      const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

      const updatedUsers = users.filter(
        (user) => user.email !== currentUser.email
      );

      sessionStorage.setItem("users", JSON.stringify(updatedUsers));
      sessionStorage.removeItem("currentUser");

      window.location.href = "/";
    };

  return (
    <div>
      <h3 className="mb-5 text-xl font-black text-[color:var(--ink)]">
        Account Actions
      </h3>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button
            type="button"
            className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-red-400/40 bg-red-50 px-6 text-base font-black text-red-500 shadow-sm transition hover:-translate-y-0.5 hover:bg-red-100"
          >
            <Ban className="h-5 w-5" />
            Deactivate Account
          </button>
        </AlertDialogTrigger>

        <AlertDialogContent className="z-[9999] rounded-3xl border border-white/70 bg-white/95 p-6 shadow-[0_24px_80px_rgba(44,57,71,0.25)] backdrop-blur-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black text-[color:var(--ink)]">
              Deactivate account?
            </AlertDialogTitle>

            <AlertDialogDescription className="text-base leading-7 text-[color:var(--muted)]">
              This action is dangerous. Your account will be deactivated and you
              will be redirected to the landing page.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-2xl">
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDeactivate}
              className="rounded-2xl bg-red-500 font-bold text-white hover:bg-red-600"
            >
              Yes, deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}