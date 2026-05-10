import { ArrowRight } from "lucide-react";

import { AppCard } from "@/components/ui/AppCard";

import PortfolioCard from "./PortfolioCard";
import { useNavigate } from "react-router-dom";

export default function Pannelforportfolios({
  portfolios,
  view = "grid",
  toggleFavorite,
}) {
    const navigate = useNavigate();

  return (
    <AppCard
      className="
        p-6
        rounded-[30px]
        bg-white/65
        border border-gray-100
        shadow-sm
      "
    >
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2
            className="
              text-2xl
              font-black
              text-[#16253A]
            "
          >
            Your Favorite Portfolios
          </h2>
        </div>

        <button
  onClick={() => navigate("/favorite-portfolios")}
  className="
    text-[#69A7FF]
    font-semibold
    flex items-center gap-2
    hover:underline
  "
>
  View More Recommendations

  
</button>
      </div>

      {/* CARDS */}
      <div
        className={
          view === "grid"
      ? `
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-3
        gap-5
        items-start
      `
      : "flex flex-col gap-5"
        }
      >
        {portfolios.map((portfolio) => (
  <div key={portfolio.id} className="w-full min-w-0">
    <PortfolioCard
      portfolio={portfolio}
      toggleFavorite={toggleFavorite}
    />
  </div>
))}
      </div>
    </AppCard>
  );
}