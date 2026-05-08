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
    <label
      className={`flex min-w-[180px] items-center justify-between gap-3 rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface)] px-4 py-3 shadow-[var(--shadow-soft)] ${className}`}
    >
      <div className="min-w-0">
        <span className="block text-[10px] font-black uppercase tracking-[0.16em] text-[color:var(--muted)]">
          {label}
        </span>

        <select
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          className="mt-0.5 w-full appearance-none bg-transparent text-sm font-black text-[color:var(--ink)] outline-none"
        >
          <option value="all">{placeholder}</option>

          {items.map((course) => {
            const courseValue =
              typeof course === "string"
                ? course
                : course.value || course.id || course.name || course.title;

            const courseLabel =
              typeof course === "string"
                ? course
                : course.label || course.name || course.title || courseValue;

            return (
              <option key={courseValue} value={courseValue}>
                {courseLabel}
              </option>
            );
          })}
        </select>
      </div>

      <ChevronDown className="pointer-events-none h-4 w-4 shrink-0 text-[color:var(--muted)]" />
    </label>
  );
}