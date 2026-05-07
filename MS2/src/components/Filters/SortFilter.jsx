export default function SortFilter({
  value,
  onChange,
  options = [],
}) {
  return (
    <div className="flex items-center gap-2 border rounded-xl px-7 py-2 bg-white/70">
      <span className="text-sm text-gray-500">
        Sort by
      </span>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent outline-none text-sm font-medium"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}