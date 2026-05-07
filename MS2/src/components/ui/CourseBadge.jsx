export default function CourseBadge({
  course,
  className = "",
}) {
  return (
    <p
      className={`
        inline-block
        mt-1.5
        px-3
        py-1
        rounded-full
        bg-[#E8F0FF]
        text-[#3B5FCC]
        text-[12px]
        font-medium
        ${className}
      `}
    >
      {course}
    </p>
  );
}