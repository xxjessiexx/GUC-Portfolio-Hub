// src/components/ui/Searchcommons/PortfolioCard.jsx

import { BadgeCheck, FolderOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { AppCard } from "@/components/ui/AppCard";
import CourseBadge from "@/components/ui/CourseBadge";
import FavoriteButton from "./FavoriteButton";

export default function PortfolioCard({
  portfolio,
  toggleFavorite,
  showReport = false,
  onReport,
  compactBadges = false,
}) {
  const navigate = useNavigate();

  const openPortfolio = () =>
    navigate(`/public-portfolio?userId=${portfolio.id}`);

  const visibleSkills = Array.isArray(portfolio.skills)
    ? portfolio.skills.slice(0, 5)
    : [];

  const hiddenSkillCount = Math.max(
    (portfolio.skills?.length || 0) - visibleSkills.length,
    0
  );

  const isOutstanding = Number(portfolio.projects || 0) >= 6;

  return (
    <AppCard
      role="link"
      tabIndex={0}
      onClick={openPortfolio}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openPortfolio();
        }
      }}
      className="
        group
        w-full max-w-[320px]
        overflow-hidden
        rounded-3xl
        border border-[var(--card-border)]
        bg-[var(--card-bg)]
        shadow-[var(--shadow-card)]
        backdrop-blur-md
        cursor-pointer
        outline-none
        transition-all duration-300
        hover:-translate-y-1
        hover:border-[var(--primary)]
        hover:shadow-[var(--shadow-lifted)]
        focus-visible:ring-4
        focus-visible:ring-[#7AAACE]/20
      "
    >
      {/* Visual zone — mirrors project card image area without inventing imagery */}
      <div
      
  className="
    relative flex h-44 items-center justify-center
    border-b border-[var(--card-border)]

   bg-[#ADBFCA]
dark:bg-[#162633]
  "
>

  
      
       <img
  src={portfolio.image}
  alt={portfolio.name}
  className="
    h-[108px] w-[108px]
    rounded-full
    object-cover
    border-[4px] border-[#E4EBEF]
    shadow-[0_8px_18px_rgba(53,88,114,0.28),0_-2px_5px_rgba(255,255,255,0.65)]
    dark:border-[#29404F]
    dark:shadow-[0_8px_20px_rgba(0,0,0,0.4),0_-2px_4px_rgba(255,255,255,0.06)]
  "
/>
        <div className="absolute right-4 top-3 z-10">
          <FavoriteButton
            favorite={portfolio.favorite}
            onClick={() => toggleFavorite(portfolio.id)}
          />
        </div>
      </div>

<div className="flex flex-1 flex-col p-5">

       <div className="min-h-[72px]">
  <h3
    className="
      text-lg font-black
      text-[color:var(--ink)]
      transition
      group-hover:text-[color:var(--primary)]
    "
  >
    {portfolio.name}
  </h3>

  <p className="mt-1 text-sm font-medium text-gray-500 dark:text-[var(--muted)]">
    {[portfolio.major, portfolio.level].filter(Boolean).join(" · ")}
  </p>
</div>
        <div className="mt-4 min-h-[34px] flex flex-wrap items-center gap-2">
          <span
            className="
              inline-flex items-center gap-1.5
              rounded-full
              border border-[var(--project-badge-border)]
              bg-[var(--project-badge-bg)]
              px-2.5 py-1.5
              text-[10.5px] font-black
              text-[var(--project-badge-text)]
            "
          >
            <FolderOpen className="h-3.5 w-3.5" />
            {portfolio.projects ?? 0} Projects
          </span>

          {isOutstanding ? (
            <span
              className="
                inline-flex items-center gap-1.5
                rounded-full
                border border-[var(--gold)]
                bg-[rgba(230,199,123,0.10)]
                px-2.5 py-1.5
                text-[10.5px] font-black
                text-[#B89736]
                dark:text-[var(--gold)]
              "
            >
              <BadgeCheck className="h-3.5 w-3.5 fill-current" />
              Outstanding
            </span>
          ) : null}
        </div>
<div className="mt-5 h-[60px]">
  {portfolio.bio ? (
    <p
      className="
        line-clamp-3
        text-[12px] font-semibold leading-5
        text-[var(--muted)]
      "
    >
      {portfolio.bio}
    </p>
  ) : null}
</div>

        {visibleSkills.length ? (
  <div className="mt-5 border-t border-[#D7E1E7] pt-4 dark:border-white/10">
    {/* Header */}
    <div className="mb-3 flex items-center justify-between">
      <span
        className="
          text-[10px] font-black uppercase
          tracking-[0.16em]
          text-[var(--muted)]
        "
      >
        Skills
      </span>

      <span
        className="
          text-[11px] font-extrabold
          text-[var(--muted)]
        "
      >
        {portfolio.skills.length} skills
      </span>
    </div>

    {/* Skills */}
    {/* Skills */}
<div className="flex flex-wrap items-center gap-y-2">
  {visibleSkills.map((skill, index) => (
    <div key={skill} className="flex items-center">
      <span
        className="
          text-[11.5px] font-black
          text-[#355872]
          dark:text-[#8FC5E8]
        "
      >
        {skill}
      </span>

      <span
        className="
          mx-3
          text-[13px] font-black
          text-[#C49A2C]
          dark:text-[var(--gold)]
        "
      >
        ·
      </span>
    </div>
  ))}

  {hiddenSkillCount > 0 && (
    <span
      className="
        text-[11px] font-black
        text-[#355872]
        dark:text-[#8FC5E8]
      "
    >
      +{hiddenSkillCount} more{" "}
      {hiddenSkillCount === 1 ? "skill" : "skills"}
    </span>
  )}
</div>
  </div>
) : null}
      </div>
    </AppCard>
  );
}
