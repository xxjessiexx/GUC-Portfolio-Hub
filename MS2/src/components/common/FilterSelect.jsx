import AppSelect from "@/components/common/AppSelect";

const VARIANTS = {
  toolbar: {
    trigger:
      "!h-11 !min-h-11 !w-full !rounded-[13px] !border-0 !bg-transparent !px-3 !shadow-none hover:!bg-[#EAF3F8] dark:hover:!bg-white/[0.06]",
    content:
      "!border-[#D5E3EA] !bg-[#F7FBFD] !backdrop-blur-none !opacity-100 dark:!border-white/10 dark:!bg-[#102638]",
  },
  standalone: {
    trigger:
      "!h-11 !min-h-11 !w-full !rounded-[14px] !border-[#D5E3EA] !bg-[#F4F9FC] !shadow-[0_8px_20px_rgba(53,88,114,0.06)] dark:!border-white/10 dark:!bg-[#102638]",
    content:
      "!border-[#D5E3EA] !bg-[#F7FBFD] !backdrop-blur-none !opacity-100 dark:!border-white/10 dark:!bg-[#102638]",
  },
  panel: {
    trigger:
      "!h-11 !min-h-11 !w-full !rounded-[13px] !border-[#D5E3EA] !bg-[#F9FCFE] !shadow-none focus-visible:!border-[#7AAACE] dark:!border-white/10 dark:!bg-[#102638]",
    content:
      "!border-[#D5E3EA] !bg-[#F7FBFD] !backdrop-blur-none !opacity-100 dark:!border-white/10 dark:!bg-[#102638]",
  },
};

export default function FilterSelect({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  className = "",
  variant = "standalone",
}) {
  const styles = VARIANTS[variant] || VARIANTS.standalone;

  return (
    <AppSelect
      value={value}
      onChange={onChange}
      options={options}
      placeholder={placeholder}
      className={`${styles.trigger} ${className}`}
      contentClassName={`max-h-64 ${styles.content}`}
    />
  );
}
