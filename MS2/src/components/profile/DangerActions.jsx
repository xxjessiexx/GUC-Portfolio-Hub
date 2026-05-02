import { LogOut, Ban } from "lucide-react";

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
  const handleLogout = () => {
    sessionStorage.removeItem("currentUser");
    window.location.href = "/login";
  };

  const handleDeactivate = () => {
    sessionStorage.removeItem("currentUser");
    window.location.href = "/";
  };

  return (
    <div>
      <h3 className="mb-5 text-xl font-black text-[color:var(--ink)]">
        Account Actions
      </h3>

      <div className="flex flex-col gap-4 sm:flex-row">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              type="button"
              className="flex h-12 items-center justify-center gap-3 rounded-2xl border border-red-400/30 bg-white/60 px-5 font-bold text-red-500 transition hover:bg-red-50"
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
                This action is dangerous. Your account will be deactivated and
                you will be redirected to the landing page.
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

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              type="button"
              className="flex h-12 items-center justify-center gap-3 rounded-2xl bg-[color:var(--primary)] px-5 font-bold text-white transition hover:bg-[color:var(--dark)]"
            >
              <LogOut className="h-5 w-5" />
              Log out
            </button>
          </AlertDialogTrigger>

          <AlertDialogContent className="z-[9999] rounded-3xl border border-white/70 bg-white/95 p-6 shadow-[0_24px_80px_rgba(44,57,71,0.25)] backdrop-blur-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl font-black text-[color:var(--ink)]">
                Log out?
              </AlertDialogTitle>

              <AlertDialogDescription className="text-base leading-7 text-[color:var(--muted)]">
                Are you sure you want to log out of your account?
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-2xl">
                Cancel
              </AlertDialogCancel>

              <AlertDialogAction
                onClick={handleLogout}
                className="rounded-2xl bg-[color:var(--primary)] font-bold text-white hover:bg-[color:var(--dark)]"
              >
                Yes, log out
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}