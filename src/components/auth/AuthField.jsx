export default function AuthField({ children, error }) {
  return (
    <div className="space-y-3">
      {children}

      {error && <p className="text-sm font-semibold text-red-500">{error}</p>}
    </div>
  );
}