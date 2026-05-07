import { Eye } from "lucide-react";

export default function VisibilityFilter({
  value,
  onChange,
  options = [],
}) {
  return (
    <div className="flex items-center gap-2 border rounded-xl px-7 py-2 bg-white/70">
      <Eye size={16} className="text-gray-500" />

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent outline-none text-sm"
      >
        <option value="All">Visibility</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}