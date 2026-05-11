// src/components/ui/Searchcommons/PortfolioCard.jsx

import { FolderOpen, ArrowRight ,Flag} from "lucide-react";

import {AppCard} from "@/components/ui/AppCard";
import CourseBadge from "@/components/ui/CourseBadge";
import { useNavigate } from "react-router-dom";
import FavoriteButton from "./FavoriteButton";

export default function PortfolioCard({
  portfolio,toggleFavorite,
  showReport = false,
  onReport,
}) { const navigate = useNavigate();
  return (
    <AppCard
      className="
        p-6
        rounded-[28px]
        border border-gray-100
        bg-white/85
        backdrop-blur-md
        hover:shadow-md
        transition
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
  <div className="flex items-start gap-4">

    <img
      src={portfolio.image}
      alt={portfolio.name}
      className="
        w-20 h-20
        rounded-full
        object-cover
      "
    />

    <div
      className="
        flex items-center gap-2
        px-3 py-1
        rounded-full
        bg-[#EEF5FF]
        text-[#69A7FF]
        text-xs
        font-bold
      "
    >
      <FolderOpen size={13} />
      {portfolio.projects} Projects
    </div>

  </div>



      {/* INFO */}
      <div className="mt-5">

        <h3 className="text-2xl font-black text-[#16253A]">
          {portfolio.name}
        </h3>

        <p className="mt-1 text-gray-500 font-semibold">
          {portfolio.major} • {portfolio.level}
        </p>

        <p className="mt-4 text-gray-500 leading-7">
          {portfolio.bio}
        </p>
      </div>

      {/* SKILLS */}
      <div className="flex flex-wrap gap-2 mt-5">

        {portfolio.skills.map((skill) => (
          <CourseBadge
            key={skill}
            course={skill}
            className="mt-0"
          />
        ))}
      </div>

      {/* BUTTON */}
      <div className="flex justify-end mt-6">
      <button
  onClick={() => navigate(`/public-portfolio?userId=${portfolio.id}`)}
  className="
    mt-6
    text-[#69A7FF]
    font-bold
    flex items-center gap-2
    hover:gap-3
    transition-all
  "
>
  View Portfolio
  
</button>
        </div>
    </AppCard>
  );
}