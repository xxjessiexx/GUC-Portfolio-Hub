import { Pin } from "lucide-react";

export default function PinnedFilter({
  value,
  onChange,
  options = [],
}) {
  return (
    <div className="flex items-center gap-2 border rounded-xl px-7 py-2 bg-white/70">
      <Pin
        size={16}
        className="text-gray-500 rotate-45"
        strokeWidth={2.5}
      />

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent outline-none text-sm"
      >
        <option value="All">Pinned</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}