export default function AuthDivider({
  compact = false,
}) {
  return (
    <div
      className={`
        flex
        items-center
        gap-4
        font-semibold
        text-[color:var(--muted)]

        ${compact ? "my-4 text-xs" : "my-8"}
      `}
    >
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[color:var(--secondary)]/30 to-transparent" />

      <span>OR</span>

      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[color:var(--secondary)]/30 to-transparent" />
    </div>
  );
}