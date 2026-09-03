import AppSelect from "@/components/common/AppSelect";

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
  const normalizedItems = [
    { value: "all", label: placeholder },
    ...items.map((course) => ({
      value:
        typeof course === "string"
          ? course
          : course.value || course.id || course.name || course.title,
      label:
        typeof course === "string"
          ? course
          : course.label || course.name || course.title || course.value,
    })),
  ];

  return (
    <div className={className}>
      <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.16em] text-[color:var(--muted)]">
        {label}
      </span>
      <AppSelect
        value={value}
        onChange={onChange}
        options={normalizedItems}
        placeholder={placeholder}
        className="min-w-[180px]"
      />
    </div>
  );
}
