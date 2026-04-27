export default function AuthInputWrap({ children, error }) {
  return (
    <div
      className={`flex h-14 items-center gap-3 rounded-2xl bg-white/75 px-4 shadow-[var(--shadow-soft)] transition focus-within:ring-4 ${
        error
          ? "border border-red-400 focus-within:ring-red-200"
          : "border border-[color:var(--primary)]/15 focus-within:border-[color:var(--gold)] focus-within:ring-[color:var(--gold)]/15"
      }`}
    >
      {children}
    </div>
  );
}