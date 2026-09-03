import AppSelect from "@/components/common/AppSelect";

export default function FilterSelect({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  className = "",
}) {
  return (
    <AppSelect
      value={value}
      onChange={onChange}
      options={options}
      placeholder={placeholder}
      className={className}
      contentClassName="max-h-64"
    />
  );
}
