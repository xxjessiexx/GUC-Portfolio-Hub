export default function DashboardFooter() {
  return (
    <footer className="mt-10 border-t border-[rgba(122,170,206,0.25)] py-8 text-sm text-[var(--muted)]">
      <div className="flex flex-col justify-between gap-3 md:flex-row">
        <p>© {new Date().getFullYear()} GUC Portfolio Hub.</p>

        <div className="flex gap-6">
          <span className="cursor-pointer transition hover:text-[var(--primary)]">
            Terms
          </span>
          <span className="cursor-pointer transition hover:text-[var(--primary)]">
            Privacy
          </span>
          <span className="cursor-pointer transition hover:text-[var(--primary)]">
            Support
          </span>
        </div>
      </div>
    </footer>
  );
}