export default function CourseBadge({
  course,
  className = "",
}) {
  return (
    <span
      className={`
  inline-flex items-center
  rounded-full border
  border-white/10
  bg-[var(--surface-strong)]
border-[var(--border-blue)]
text-[var(--ink)]
  px-3 py-1.5
  text-xs font-black
  text-[#EBEDE3]
  shadow-[0_8px_18px_rgba(53,88,114,0.14)]
  dark:bg-[image:var(--nav-gradient)]
  dark:#F4F2F2

        ${className}
      `}
    >
      {course}
    </span>
  );
}