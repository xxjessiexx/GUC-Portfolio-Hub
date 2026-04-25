export function AppCard({ children, className = "" }) {
  return (
    <div
      className={`rounded-[var(--radius-card)] border backdrop-blur-2xl ${className}`}
      style={{
        background: "var(--card-bg)",
        borderColor: "var(--card-border)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      {children}
    </div>
  );
}