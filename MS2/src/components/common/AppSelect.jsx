import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const CREATE_PROJECT_TRIGGER_STYLES =
  "min-h-12 rounded-2xl border border-white/70 bg-[var(--input-bg)] px-4 text-sm font-semibold text-[color:var(--ink)] shadow-[0_10px_28px_rgba(53,88,114,0.06)] placeholder:text-[color:var(--muted)]/65 transition focus-visible:border-[color:var(--accent)] focus-visible:ring-2 focus-visible:ring-[color:var(--ring-soft)] h-12 w-full justify-between py-0 text-left";

const CREATE_PROJECT_CONTENT_STYLES =
  "rounded-2xl border border-white/70 bg-[var(--surface-elevated)] text-[color:var(--ink)] shadow-[var(--shadow-card)] backdrop-blur-2xl";

function normalizeOption(option) {
  if (
    typeof option === "string" ||
    typeof option === "number"
  ) {
    return {
      value: String(option),
      label: String(option),
      disabled: false,
    };
  }

  const value =
    option?.value ??
    option?.id ??
    option?.name ??
    option?.title ??
    "";

  const label =
    option?.label ??
    option?.name ??
    option?.title ??
    String(value);

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
  multiple = false,
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  



  const normalizedOptions = options
    .map(normalizeOption)
    .filter((option) => option.value !== "");

  // Close multi-select when clicking outside
  // Position the floating dropdown



// Update position when dropdown opens / page moves


useEffect(() => {
  if (!multiple) return;

  const handleClickOutside = (event) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target)
    ) {
      setOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );
  };
}, [multiple]);


// Close when clicking outside

  /* ==========================================
     MULTI SELECT
  ========================================== */

  if (multiple) {
  const selectedValues = Array.isArray(value)
    ? value.map(String)
    : [];

  const handleToggle = (optionValue) => {
    const nextValues = selectedValues.includes(optionValue)
      ? selectedValues.filter(
          (item) => item !== optionValue
        )
      : [...selectedValues, optionValue];

    onValueChange?.(nextValues);
    onChange?.(nextValues);
  };

  const displayValue =
    selectedValues.length === 0
      ? placeholder
      : selectedValues.length === 1
      ? normalizedOptions.find(
          (option) => option.value === selectedValues[0]
        )?.label ?? selectedValues[0]
      : `${selectedValues.length} selected`;

  return (
    <div
      ref={containerRef}
      className="relative w-full"
    >
      {/* TRIGGER */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          CREATE_PROJECT_TRIGGER_STYLES,
          `
            flex items-center justify-between
            text-[14px]
            font-semibold
            text-[var(--ink)]
          `,
          className,
          triggerClassName
        )}
        {...triggerProps}
      >
        <span className="truncate text-[color:var(--ink)]">
  {displayValue}
</span>

        <ChevronDown
          size={17}
          strokeWidth={2.2}
          className={cn(
            `
              ml-2
              shrink-0
              text-[var(--muted)]
              transition-transform
              duration-200
            `,
            open && "rotate-180"
          )}
        />
      </button>

      {/* DROPDOWN */}
      {open && (
        <div
          data-filter-dropdown="true"
          className={cn(
            `
              absolute
              left-0
              top-[calc(100%+4px)]
              z-[9999]

              w-full
              overflow-hidden

              rounded-[16px]
              border
              border-[#D5E3EA]

              bg-[#F7FBFD]

              p-1.5

              shadow-[0_12px_30px_rgba(53,88,114,0.10)]

              dark:border-white/10
              dark:bg-[#102638]
              dark:shadow-[0_16px_36px_rgba(0,0,0,0.24)]
            `,
            contentClassName
          )}
          {...contentProps}
        >
          <div
            className="
              max-h-64
              overflow-y-auto
              overscroll-contain
            "
          >
            {normalizedOptions.map((option) => {
              const selected =
                selectedValues.includes(option.value);

              return (
                <button
                  key={option.value}
                  type="button"
                  disabled={option.disabled}
                  onClick={(event) => {
                    event.stopPropagation();
                    handleToggle(option.value);
                  }}
                  className={cn(
                    `
                      flex
                      min-h-[42px]
                      w-full
                      items-center
                      justify-between

                      rounded-[11px]

                      px-3
                      py-2.5

                      text-left
                      text-[14px]
                      font-semibold
                      text-[var(--ink)]

                      transition-colors
                      duration-150

                      hover:bg-[#EAF3F8]

                      dark:text-[#E8F1F8]
                      dark:hover:bg-white/[0.06]

                      disabled:pointer-events-none
                      disabled:opacity-50
                    `,
                    selected &&
                      `
                        bg-[#E1F0FA]
                        text-[#355872]

                        dark:bg-white/[0.08]
                        dark:text-[#9CD5FF]
                      `,
                    itemClassName
                  )}
                >
                  <span className="min-w-0 truncate">
                    {option.label}
                  </span>

                  {selected && (
                    <Check
                      size={17}
                      strokeWidth={2.5}
                      className="
                        ml-3
                        shrink-0
                        text-[#355872]

                        dark:text-[#9CD5FF]
                      "
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
  /* ==========================================
     SINGLE SELECT
  ========================================== */

  const selectedValue =
    value === undefined || value === null
      ? ""
      : String(value);

  const handleValueChange = (nextValue) => {
    onValueChange?.(nextValue);
    onChange?.(nextValue);
  };

  return (
    <Select
      value={selectedValue}
      onValueChange={handleValueChange}
      disabled={disabled}
    >
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

      <SelectContent
        className={cn(
          CREATE_PROJECT_CONTENT_STYLES,
          contentClassName
        )}
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