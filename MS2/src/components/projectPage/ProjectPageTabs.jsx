export default function ProjectPageTabs({
  visibleTabs,
  activeTab,
  setActiveTab,
}) {
  return (
    <div className="flex flex-wrap gap-6 border-b border-[color:var(--primary)]/10 pb-2">
      {visibleTabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`pb-2 text-sm font-black capitalize ${
            activeTab === tab
              ? "border-b-2 border-[var(--primary)] text-[var(--primary)]"
              : "text-[color:var(--muted)]"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}