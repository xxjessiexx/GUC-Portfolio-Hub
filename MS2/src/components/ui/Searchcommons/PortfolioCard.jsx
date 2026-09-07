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
          bg-[linear-gradient(145deg,rgba(234,242,246,0.95),rgba(248,251,252,0.98))]
          dark:bg-[linear-gradient(145deg,rgba(14,35,49,0.95),rgba(18,42,58,0.98))]
        "
      >
        <img
          src={portfolio.image}
          alt={portfolio.name}
          className="
            h-[108px] w-[108px] rounded-full
            border-[5px] border-white/85
            object-cover
            shadow-[0_18px_38px_rgba(53,88,114,0.18)]
            dark:border-white/10
          "
        />

        <div className="absolute right-4 top-3 z-10">
          <FavoriteButton
            favorite={portfolio.favorite}
            onClick={() => toggleFavorite(portfolio.id)}
          />
        </div>
      </div>

      <div className="p-5">
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

        <div className="mt-4 flex flex-wrap items-center gap-2">
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

        {portfolio.bio ? (
          <p
            className="
              mt-4 line-clamp-3
              text-[12px] font-semibold leading-5
              text-[var(--muted)]
            "
          >
            {portfolio.bio}
          </p>
        ) : null}

        {visibleSkills.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {visibleSkills.map((skill) => (
              <CourseBadge key={skill} course={skill} />
            ))}

            {hiddenSkillCount > 0 ? (
              <span
                className="
                  inline-flex items-center
                  rounded-full
                  border border-[var(--card-border)]
                  bg-[var(--surface-soft)]
                  px-3 py-1.5
                  text-[10.5px] font-black
                  text-[var(--muted)]
                "
              >
                +{hiddenSkillCount}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    </AppCard>
  );
}
