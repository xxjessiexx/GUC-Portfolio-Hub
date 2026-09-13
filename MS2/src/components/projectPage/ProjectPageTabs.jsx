export default function ProjectPageTabs({
  visibleTabs,
  activeTab,
  setActiveTab,
  tabIndicators = {},
  rightSlot = null,
}) {
  return (
    <div className="flex min-w-0 items-center gap-4 border-t border-[#E3EBEF]">
      <nav
        className="flex min-w-0 flex-1 items-center gap-6 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Project workspace sections"
      >
        {visibleTabs.map((tab) => {
          const active = activeTab === tab;
          const indicatorCount = Number(tabIndicators?.[tab] || 0);

          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`relative inline-flex shrink-0 items-center gap-1.5 py-3.5 text-[13px] font-black capitalize transition-colors ${
                active
                  ? "text-[#355872]"
                  : "text-[#7C8D98] hover:text-[#506F83]"
              }`}
            >
              <span>{tab}</span>
              {indicatorCount > 0 ? (
                <span
                  className="grid min-w-[18px] place-items-center rounded-full bg-[#FFF1BF] px-1.5 py-0.5 text-[9px] font-black leading-none text-[#8A6815]"
                  aria-label={`${indicatorCount} changes in ${tab}`}
                >
                  {indicatorCount}
                </span>
              ) : null}

              {active ? (
                <span className="absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-[#4F7EA4]" />
              ) : null}
            </button>
          );
        })}
      </nav>

      {rightSlot ? <div className="shrink-0 py-2.5">{rightSlot}</div> : null}
    </div>
  );
}
