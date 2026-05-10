import DashboardLayout
from "@/components/layout/DashboardLayout";

import PortfolioCard
from "@/components/ui/Searchcommons/PortfolioCard";

import {
  getAllPortfolios,
  toggleFavoritePortfolio,
} from "@/data/demoStore";

import { useState } from "react";

export default function FeaturedStudents() {

  const [portfolios, setPortfolios] =
    useState(getAllPortfolios());

  const toggleFavorite = (id) => {
    toggleFavoritePortfolio(id);

    setPortfolios(getAllPortfolios());
  };

  const featuredStudents = portfolios
    .filter((portfolio) => portfolio.projects >= 4)
    .sort((a, b) => b.projects - a.projects);

  return (
    <DashboardLayout>

      <div className="space-y-8">

        {/* HEADER */}
        <div>

          <h1
            className="
              text-4xl
              font-black
              text-[#16253A]
            "
          >
            Featured Students
          </h1>

          <p
            className="
              mt-3
              text-m
              text-gray-500
            "
          >
            Explore talented students with
            outstanding portfolios and many
            successful projects.
          </p>

        </div>

        {/* GRID */}
        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-3
            gap-6
          "
        >

          {featuredStudents.map((portfolio) => (

            <PortfolioCard
              key={portfolio.id}
              portfolio={portfolio}
              toggleFavorite={toggleFavorite}
            />

          ))}

        </div>

      </div>

    </DashboardLayout>
  );
}