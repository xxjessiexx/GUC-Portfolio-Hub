export default function InitialsAvatar({ name = "User", className = "" }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={`grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[color:var(--accent)]/30 text-sm font-black text-[color:var(--primary)] ${className}`}
    >
      {initials}
    </div>
  );
}