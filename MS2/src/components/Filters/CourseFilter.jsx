import { GraduationCap } from "lucide-react";

export default function CourseFilter({
  value,
  onChange,
  options = [],
}) {
  return (
    <div className="flex items-center gap-2 border rounded-xl px-6 py-2 bg-white/70">
      <GraduationCap size={16} className="text-gray-500" />

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent outline-none text-sm"
      >
        <option value="All">Course</option>

        {options.map((course) => (
          <option key={course} value={course}>
            {course}
          </option>
        ))}
      </select>
    </div>
  );
}