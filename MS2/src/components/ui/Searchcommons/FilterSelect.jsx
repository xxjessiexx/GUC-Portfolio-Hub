import AppSelect from "@/components/common/AppSelect";

export default function FilterSelect({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  className = "",
  triggerClassName = "",
  contentClassName = "",
  itemClassName = "",
  triggerProps = {},
  contentProps = {},
}) {
  return (
    <AppSelect
      value={value}
      onChange={onChange}
      options={options}
      placeholder={placeholder}
      className={className}
      triggerClassName={triggerClassName}
      contentClassName={`max-h-64 ${contentClassName}`}
      itemClassName={itemClassName}
      triggerProps={triggerProps}
      contentProps={contentProps}
    />
  );
}
