export default function CourseBadge({
  course,
  className = "",
}) {
  return (
    <span
      className={`
        inline-flex items-center 
       rounded-full border
        border-[#355872]/20 
        bg-[#355872] px-3 py-1.5 
        text-xs font-black 
        text-white 
        shadow-[0_8px_18px_rgba(53,88,114,0.14)]
         dark:border-white/10 
         dark:bg-[#9CD5FF] 
         dark:text-[#071521]
        ${className}
      `}
    >
      {course}
    </span>
  );
}