import { ArrowRight } from "lucide-react";

import { AppCard } from "@/components/ui/AppCard";

import PortfolioCard from "./PortfolioCard";
import { useNavigate } from "react-router-dom";

export default function Pannelforportfolios({
  portfolios,
  view = "grid",
  toggleFavorite,
  hideViewMore = false
}) {
    const navigate = useNavigate();

  return (
    <AppCard
  className="
    p-6
    rounded-[30px]

    bg-[var(--card-bg)]
    border border-[var(--card-border)]

    shadow-[var(--shadow-card)]
  "
>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2
            className="
              text-2xl
              font-black
              text-[var(--ink)]
            "
          >
            Your Favorite Portfolios
          </h2>
        </div>

        {!hideViewMore && (

  <button
  onClick={() =>
    navigate("/favorite-portfolios")
  }
  className="
    text-[var(--primary)]
hover:text-[var(--accent)]
    font-semibold
    flex items-center gap-2
    hover:underline
  "
>
  View More Portfolios

  
</button>

)}
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
  compactBadges={true}
/>
  </div>
))}
      </div>
    </AppCard>
  );
}