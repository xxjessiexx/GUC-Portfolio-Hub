export default function ProjectPageTabs({
  visibleTabs,
  activeTab,
  setActiveTab,
}) {
  return (
    <nav
      className="flex min-w-0 items-center gap-6 overflow-x-auto border-t border-[#E3EBEF] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      aria-label="Project workspace sections"
    >
      {visibleTabs.map((tab) => {
        const active = activeTab === tab;

        return (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`relative shrink-0 py-3.5 text-[13px] font-black capitalize transition-colors ${
              active
                ? "text-[#355872]"
                : "text-[#7C8D98] hover:text-[#506F83]"
            }`}
          >
            {tab}

            {active ? (
              <span className="absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-[#4F7EA4]" />
            ) : null}
          </button>
        );
      })}
    </nav>
  );
}
