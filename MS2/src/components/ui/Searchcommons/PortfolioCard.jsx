// src/components/ui/Searchcommons/PortfolioCard.jsx

import { FolderOpen, ArrowRight ,Flag} from "lucide-react";

import {AppCard} from "@/components/ui/AppCard";
import CourseBadge from "@/components/ui/CourseBadge";
import { useNavigate } from "react-router-dom";
import FavoriteButton from "./FavoriteButton";
import { BadgeCheck } from "lucide-react";


export default function PortfolioCard({
  portfolio,
  toggleFavorite,
  showReport = false,
  onReport,
  compactBadges = false,
}) { const navigate = useNavigate();
  return (
    <AppCard
      className="
  h-full
  flex
  flex-col
  p-6
  rounded-[28px]

  bg-[var(--card-bg)]
  border border-[var(--card-border)]

  shadow-[var(--shadow-card)]
  hover:shadow-[var(--shadow-lifted)]

  backdrop-blur-md
  transition-all
  duration-300
  transform: translateY(-4px);
  hover:-translate-y-1
  hover:border-[var(--primary)]
"
    >

      {/* TOP */}
      {/* TOP */}
<div className="relative">

  {/* REPORT / FAVORITE BUTTON */}
  
      <FavoriteButton
        favorite={portfolio.favorite}
        onClick={() =>
          toggleFavorite(portfolio.id)
        }
      />

    
  </div>

  {/* IMAGE + PROJECT COUNT */}
  

  <div className="flex items-start justify-between">

  {/* LEFT */}
  <div className="flex gap-5">

    {/* Avatar */}
<img
  src={portfolio.image}
  alt={portfolio.name}
  className="w-20 h-20 rounded-full object-cover mt-5"
/>

{/* Badges */}
<div className="absolute top-0 left-20 flex items-center gap-14 mt-4 left-20">
  {/* Projects */}
  <div
    className="
      inline-flex
      items-center
      gap-2
      px-3
      py-1
      rounded-full
      bg-[var(--project-badge-bg)]
      text-[var(--project-badge-text)]
      border border-[var(--project-badge-border)]
      text-xs
      font-bold
    "
  >
    <FolderOpen className="w-3 h-3" />
    {portfolio.projects} Projects
  </div>

  {/* Outstanding */}
  {portfolio.projects >= 6 && (
    <div
      className="
        inline-flex
        items-center
        gap-2
        px-3
        py-1
        rounded-full
        border border-[var(--gold)]
        bg-[rgba(230,199,123,0.12)]
        text-[var(--gold)]
        text-xs
        font-semibold
        ml-2
      "
    >
      <BadgeCheck className="w-3 h-3 fill-current" />
      Outstanding
    </div>
  )}
</div>
</div>
</div>


  


      {/* INFO */}
      <div className="mt-5">

        <button
  onClick={() => navigate(`/public-portfolio?userId=${portfolio.id}`)} className="text-2xl font-black text-[var(--ink)] hover:text-[var(--accent)]
    transition-all ">
          {portfolio.name}
        </button>

        <p className="mt-1 text-[var(--muted)] font-semibold">
          {portfolio.major} • {portfolio.level}
        </p>

        <p className="mt-4 text-[var(--muted)] leading-7">
          {portfolio.bio}
        </p>
      </div>

      {/* SKILLS */}
       <div className="mt-5 flex flex-wrap content-start gap-2 min-h-[170px]">

        {portfolio.skills.map((skill) => (
          <CourseBadge
            key={skill}
            course={skill}
            className="mt-0"
          />
        ))}
      </div>

      
       
    </AppCard>
  );
}
