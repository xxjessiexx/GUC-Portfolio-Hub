import { MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";

function getIsDarkMode() {
  if (typeof document === "undefined") return false;

  return (
    document.documentElement.classList.contains("dark") ||
    document.body.classList.contains("dark") ||
    document.documentElement.getAttribute("data-theme") === "dark" ||
    document.body.getAttribute("data-theme") === "dark"
  );
}

export default function AdminTableActions({
  rowId,
  openMenu,
  setOpenMenu,
  actions,
}) {
  const [isDarkMode, setIsDarkMode] = useState(getIsDarkMode);

  useEffect(() => {
    const updateTheme = () => setIsDarkMode(getIsDarkMode());

    updateTheme();

    const observer = new MutationObserver(updateTheme);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  const getActionClassName = (action) => {
    if (action.danger) {
      return [
        "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold transition",
        isDarkMode
          ? "text-rose-200 hover:bg-rose-500/15 hover:text-rose-100"
          : "text-rose-600 hover:bg-rose-50 hover:text-rose-700",
      ].join(" ");
    }

     if (action.success) {
    return [
      "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold transition",
      isDarkMode
        ? "text-emerald-300 hover:bg-emerald-500/15 hover:text-emerald-200"
        : "text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700",
    ].join(" ");
  }

    return [
      "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold transition",
      isDarkMode
        ? "text-[#DDEFFF] hover:bg-[#9CD5FF]/10 hover:text-white"
        : "text-[#2C3947] hover:bg-[#EAF4FB] hover:text-[#355872]",
    ].join(" ");
  };

  const getIconClassName = (action) => {
    if (action.danger) {
      return isDarkMode
        ? "size-4 text-rose-200"
        : "size-4 text-rose-500";
    }

    if (action.success) {
    return isDarkMode
      ? "size-4 text-emerald-300"
      : "size-4 text-emerald-600";
  }

    return isDarkMode
      ? "size-4 text-[#9CD5FF]"
      : "size-4 text-[#355872]";
  };

  const triggerClassName = isDarkMode
    ? [
        "grid h-12 w-12 place-items-center rounded-2xl border shadow-[0_10px_28px_rgba(0,0,0,0.28)] transition",
        "border-white/10 bg-white/5 text-[#BFE7FF] hover:border-[#9CD5FF]/40 hover:bg-[#9CD5FF]/10",
      ].join(" ")
    : [
        "grid h-12 w-12 place-items-center rounded-2xl border shadow-[0_10px_28px_rgba(53,88,114,0.16)] transition",
        "border-[#A7C3D6] bg-[#EAF4FB] text-[#2C3947] hover:border-[#355872] hover:bg-[#DDEFFF] hover:text-[#355872]",
      ].join(" ");

  const menuClassName = isDarkMode
  ? [
      "absolute right-0 top-12 z-[9999]",
      "mt-2 w-52 overflow-hidden rounded-3xl p-1",
      "border border-white/10",
      "bg-[#182432]/95 backdrop-blur-xl",
      "shadow-[0_24px_70px_rgba(0,0,0,0.35)]",
    ].join(" ")
  : [
      "absolute right-0 top-12 z-[9999]",
      "mt-2 w-52 overflow-hidden rounded-3xl p-1",
      "border border-[#A7C3D6]",
      "bg-white",
      "shadow-[0_24px_70px_rgba(16,32,45,0.18)]",
    ].join(" ");


      

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() =>
          setOpenMenu((current) => (current === rowId ? null : rowId))
        }
        className={triggerClassName}
        aria-label="Open row actions"
      >
        <MoreHorizontal className="size-5 stroke-[3]" />
      </button>

      {openMenu === rowId && (
        <div className={menuClassName}>
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={() => {
                action.onClick();
                setOpenMenu(null);
              }}
              className={getActionClassName(action)}
            >
              {action.icon && (
                <action.icon className={getIconClassName(action)} />
              )}
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}