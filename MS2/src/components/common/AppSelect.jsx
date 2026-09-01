import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// IMPORTANT: These are copied from the Create Project screen.
// That screen is the visual source of truth for dropdowns in the app.
const CREATE_PROJECT_TRIGGER_STYLES =
  "min-h-12 rounded-2xl border border-white/70 bg-[var(--input-bg)] px-4 text-sm font-semibold text-[color:var(--ink)] shadow-[0_10px_28px_rgba(53,88,114,0.06)] placeholder:text-[color:var(--muted)]/65 transition focus-visible:border-[color:var(--accent)] focus-visible:ring-2 focus-visible:ring-[color:var(--ring-soft)] h-12 w-full justify-between py-0 text-left";

const CREATE_PROJECT_CONTENT_STYLES =
  "rounded-2xl border-white/70 bg-[var(--surface-elevated)] text-[color:var(--ink)] shadow-[var(--shadow-card)] backdrop-blur-2xl";

function normalizeOption(option) {
  if (typeof option === "string" || typeof option === "number") {
    return { value: String(option), label: String(option), disabled: false };
  }

  const value = option?.value ?? option?.id ?? option?.name ?? option?.title ?? "";
  const label = option?.label ?? option?.name ?? option?.title ?? String(value);

  return {
    ...option,
    value: String(value),
    label: String(label),
    disabled: Boolean(option?.disabled),
  };
}

export default function AppSelect({
  value,
  onValueChange,
  onChange,
  options = [],
  placeholder = "Select an option",
  disabled = false,
  className = "",
  triggerClassName = "",
  contentClassName = "",
  itemClassName = "",
  triggerProps = {},
  contentProps = {},
}) {
  const normalizedOptions = options
    .map(normalizeOption)
    .filter((option) => option.value !== "");

  const selectedValue = value === undefined || value === null ? "" : String(value);

  const handleValueChange = (nextValue) => {
    onValueChange?.(nextValue);
    onChange?.(nextValue);
  };

  return (
    <Select value={selectedValue} onValueChange={handleValueChange} disabled={disabled}>
      <SelectTrigger
        className={cn(
          CREATE_PROJECT_TRIGGER_STYLES,
          className,
          triggerClassName
        )}
        {...triggerProps}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      {/* Deliberately leave position at SelectContent's original default.
          This preserves the Create Project menu sizing/alignment exactly. */}
      <SelectContent
        className={cn(CREATE_PROJECT_CONTENT_STYLES, contentClassName)}
        {...contentProps}
      >
        {normalizedOptions.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            disabled={option.disabled}
            className={itemClassName}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
