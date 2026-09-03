import AppSelect from "@/components/common/AppSelect";

export default function ProfileSelectField({ label, value, options, onChange }) {
  return (
    <div className="grid gap-3 border-b border-[color:var(--primary)]/10 py-4 md:grid-cols-[180px_1fr] md:items-center dark:border-white/10">
      <p className="text-sm font-black text-[color:var(--dark)] dark:text-[color:var(--ink)]">
        {label}
      </p>

      <AppSelect
        value={value}
        onChange={onChange}
        options={options}
        placeholder={`Select ${label}`}
        className="max-w-[520px]"
      />
    </div>
  );
}
