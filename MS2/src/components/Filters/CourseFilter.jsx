import { ChevronDown } from "lucide-react";

export default function CourseFilter({
  value = "all",
  onChange,
  courses = [],
  options,
  label = "Course",
  placeholder = "All Courses",
  className = "",
}) {
  const items = options || courses;

  return (
    <div
      className={`
        relative
        min-w-[180px]
        rounded-2xl
        border border-[color:var(--border-soft)]
        bg-[color:var(--surface)]
        px-4 py-3
        shadow-[var(--shadow-soft)]
        ${className}
      `}
    >
      <span
        className="
          block
          text-[10px]
          font-black
          uppercase
          tracking-[0.16em]
          text-[color:var(--muted)]
        "
      >
        {label}
      </span>

      {/* SELECT */}
      <select
        value={value}
        onChange={(event) =>
          onChange?.(event.target.value)
        }
        className="
          mt-1
          w-full
          appearance-none
          bg-transparent
          text-sm
          font-black
          text-[color:var(--ink)]
          outline-none
          cursor-pointer
          pr-8
        "
      >
        <option value="all">{placeholder}</option>

        {items.map((course) => {
          const courseValue =
            typeof course === "string"
              ? course
              : course.value ||
                course.id ||
                course.name ||
                course.title;

          const courseLabel =
            typeof course === "string"
              ? course
              : course.label ||
                course.name ||
                course.title ||
                courseValue;

          return (
            <option
              key={courseValue}
              value={courseValue}
            >
              {courseLabel}
            </option>
          );
        })}
      </select>

      {/* ARROW */}
      <ChevronDown
        className="
          absolute
          right-4
          top-1/2
          -translate-y-1/2
          h-4 w-4
          text-[color:var(--muted)]
          pointer-events-none
        "
      />
    </div>
  );
}