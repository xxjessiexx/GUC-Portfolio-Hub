export default function AuthDivider() {
  return (
    <div className="my-8 flex items-center gap-4 font-semibold text-[color:var(--muted)]">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[color:var(--secondary)]/30 to-transparent" />
      <span>OR</span>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[color:var(--secondary)]/30 to-transparent" />
    </div>
  );
}