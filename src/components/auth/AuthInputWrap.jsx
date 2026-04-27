export default function AuthInputWrap({ children, error }) {
  return (
    <div
      className={`flex h-14 items-center gap-3 rounded-2xl bg-white/75 px-4 shadow-[0_12px_30px_rgba(53,88,114,0.08)] transition focus-within:ring-4 ${
        error
          ? "border border-red-400 focus-within:ring-red-200"
          : "border border-[#355872]/15 focus-within:border-[#E6C77B] focus-within:ring-[#E6C77B]/15"
      }`}
    >
      {children}
    </div>
  );
}