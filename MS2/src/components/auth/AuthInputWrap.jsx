export default function AuthInputWrap({ children, error }) {
  return (
    <div
      className={`flex h-14 items-center gap-3 rounded-2xl bg-[color:var(--auth-input-bg)] px-4 shadow-[var(--auth-input-shadow)] backdrop-blur-xl transition focus-within:ring-4 ${
        error
          ? "border border-red-400 focus-within:ring-red-200 dark:focus-within:ring-red-500/20"
          : "border border-[color:var(--auth-input-border)] focus-within:border-[color:var(--gold)] focus-within:ring-[color:var(--gold)]/15"
      }`}
    >
      {children}
    </div>
  );
}