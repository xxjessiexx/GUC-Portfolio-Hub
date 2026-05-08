// src/pages/ExplorePortfolios.jsx

import DashboardLayout from "@/components/layout/DashboardLayout";

import DiscoverSearchBar from "@/components/ui/Searchcommons/DiscoverSearchBar";
import CourseBadge from "@/components/ui/CourseBadge";
import PortfolioCard from "@/components/ui/Searchcommons/PortfolioCard";
import InsightRow from "@/components/ui/Searchcommons/InsightRow";
import {AppCard} from "@/components/ui/AppCard";
import PrimaryActionButton from "@/components/ui/Searchcommons/PrimaryActionButton";
import FavoriteButton from "@/components/ui/Searchcommons/FavoriteButton";

import {
  FolderOpen,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import { useState } from "react";

import portfoliosData from "@/data/portfoliosData";

export default function ExplorePortfolios() {

  const [search, setSearch] = useState("");
  const [selectedMajor, setSelectedMajor] =
    useState("All Majors");

  const [selectedSkill, setSelectedSkill] =
    useState("All Skills");

  const [selectedSort, setSelectedSort] =
    useState("Most Projects");

    
    const [portfolios, setPortfolios] =
  useState(portfoliosData);
  const toggleFavorite = (id) => {
  setPortfolios((prev) =>
    prev.map((portfolio) =>
      portfolio.id === id
        ? {
            ...portfolio,
            favorite: !portfolio.favorite,
          }
        : portfolio
    )
  );
};

  /* FILTERING */
  const filteredPortfolios = portfolios
    .filter((portfolio) => {

      const matchesSearch =
        portfolio.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||

          portfolio.email
    .toLowerCase()
    .includes(search.toLowerCase()) ||

        portfolio.bio
          .toLowerCase()
          .includes(search.toLowerCase()) ||

        portfolio.skills.some((skill) =>
          skill
            .toLowerCase()
            .includes(search.toLowerCase())

            
        );

      const matchesMajor =
        selectedMajor === "All Majors" ||
        portfolio.major === selectedMajor;

      const matchesSkill =
        selectedSkill === "All Skills" ||
        portfolio.skills.includes(selectedSkill);


        


      return (
        matchesSearch &&
        matchesMajor &&
        matchesSkill
      );
    })

    .sort((a, b) => {

      if (selectedSort === "Most Projects") {
        return b.projects - a.projects;
      }

      if (selectedSort === "A-Z") {
        return a.name.localeCompare(b.name);
      }

      return 0;
    });

  return (
    <DashboardLayout>

      <div className="space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-5xl font-black text-[#16253A]">
            Explore Portfolios
          </h1>

          <p className="mt-3 text-lg text-gray-500">
            Discover and get inspired by portfolios from talented GUC students across all majors and interests.
          </p>
        </div>

        {/* CONTENT */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">

          {/* LEFT */}
          <div className="space-y-5">

            {/* SEARCH + FILTERS */}
            <AppCard
              className="
                p-5
                rounded-[30px]
                border border-gray-100
                bg-transparent
                backdrop-blur-md
              "
            >

              <div className="grid grid-cols-1 lg:grid-cols-[1fr_170px_170px_170px] gap-4">

                <DiscoverSearchBar
                  placeholder="Search by student name or email..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />

                {/* MAJOR */}
                <label
                className="
                    h-[64px]
                    rounded-2xl
                    border border-gray-100
                    bg-white
                    px-4
                    flex flex-col justify-center
                "
                >
                <span
                    className="
                    text-[10px]
                    uppercase
                    tracking-[0.15em]
                    font-black
                    text-gray-400
                    "
                >
                    Major
                </span>

                <select
                    value={selectedMajor}
                    onChange={(e) =>
                    setSelectedMajor(e.target.value)
                    }
                    className="
                    bg-transparent
                    outline-none
                    font-bold
                    text-[#16253A]
                    "
                >
                    <option>All Majors</option>
                    <option>Computer Science</option>
                    <option>Software Engineering</option>
                    <option>Information Systems</option>
                    <option>Data Science</option>
                    <option>UI/UX Design</option>
                </select>
                </label>

                {/* SKILLS */}
                

                <label
                    className="
                        h-[64px]
                        rounded-2xl
                        border border-gray-100
                        bg-white
                        px-4
                        flex flex-col justify-center
                    "
                    >
                    <span
                        className="
                        text-[10px]
                        uppercase
                        tracking-[0.15em]
                        font-black
                        text-gray-400
                        "
                    >
                        Skills
                    </span>
                            <select
                                value={selectedSkill}
                                onChange={(e) =>
                                    setSelectedSkill(e.target.value)
                                    }
                    className="
                    bg-transparent
                    outline-none
                    font-bold
                    text-[#16253A]
                    "
                    >
                     <option>All Skills</option>
                        <option>React</option>
                          <option>Python</option>
                            <option>Figma</option>
                             <option>SQL</option>
                            <option>Tailwind</option>
                     </select>
                    </label>
                {/* SORT */}
                <label
                    className="
                        h-[64px]
                        rounded-2xl
                        border border-gray-100
                        bg-white
                        px-4
                        flex flex-col justify-center
                    "
                    >
                    <span
                        className="
                        text-[10px]
                        uppercase
                        tracking-[0.15em]
                        font-black
                        text-gray-400
                        "
                    >
                        Sort By
                    </span>
                <select
                  value={selectedSort}
                  onChange={(e) =>
                    setSelectedSort(e.target.value)
                  }
                  className="
                    bg-transparent
                    outline-none
                    font-bold
                    text-[#16253A]
                    "
                >
                  <option>Most Projects</option>
                  <option>A-Z</option>
                </select>
</label>
              </div>
            </AppCard>

            {/* PORTFOLIOS */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

              {filteredPortfolios.map((portfolio) => (
                <PortfolioCard
                  key={portfolio.id}
                  portfolio={portfolio}
                  toggleFavorite={toggleFavorite}
                />
              ))}

            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-5">

            {/* INSIGHTS */}
            <AppCard className="p-6 rounded-[28px] bg-transparent border border-gray-100 shadow-sm">

              <div className="flex items-center gap-2 mb-6">
                <Sparkles
                  size={18}
                  className="text-[#69A7FF]"
                />

                <h3 className="text-xl font-black text-[#16253A]">
                  Discovery Insights
                </h3>
              </div>

              <div className="space-y-4">

                <InsightRow
                  title="Active Portfolios"
                  subtitle="Students with public portfolios"
                  number="156"
                  color="bg-blue-100 text-blue-500"
                />

                <InsightRow
                  title="Total Projects"
                  subtitle="Across all portfolios"
                  number="248"
                  color="bg-green-100 text-green-500"
                />

                <InsightRow
                  title="Top Skills"
                  subtitle="Most in-demand skills"
                  number="React"
                  color="bg-purple-100 text-purple-500"
                />
              </div>
            </AppCard>

            {/* FEATURED */}
            <AppCard
              className="
                p-6
                rounded-[30px]
                border border-gray-100
                bg-transparent
                backdrop-blur-md
              "
            >

              <h3 className="text-xl font-black text-[#16253A]">
                Featured Students
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Outstanding portfolios to check out.
              </p>

              <div className="mt-6 space-y-4">

                {portfolios.slice(0, 3).map((student) => (
                  <div
                    key={student.id}
                    className="
                      flex items-center justify-between
                      p-3
                      rounded-2xl
                      border border-gray-100
                    "
                  >

                    <div className="flex items-center gap-3">

                      <img
                        src={student.image}
                        alt={student.name}
                        className="
                          w-12 h-12
                          rounded-full
                          object-cover
                        "
                      />

                      <div>
                        <h4 className="font-bold text-[#16253A]">
                          {student.name}
                        </h4>

                        <p className="text-sm text-gray-500">
                          {student.major}
                        </p>
                      </div>
                      
                    </div>

                    <div
                        className="
                            px-4 py-2
                            rounded-full
                            bg-[#EEF5FF]
                            text-[#69A7FF]
                            text-sm
                            font-bold
                            whitespace-nowrap
                            flex items-center justify-center
                    "
                    >
                    {student.projects} Projects
                    </div>
                   
                  </div>
                ))}
              </div>

              <PrimaryActionButton
              text="View All Portfolios"
                className="
                  mt-6
                  w-full
                  h-14
                  rounded-2xl
                  bg-[#284C7A]
                  text-white
                  font-bold
                  flex items-center justify-center gap-2
                  hover:bg-[#1E3C63]
                  transition
                "
              >
                View All Portfolios

                <ArrowRight size={18} />
              </PrimaryActionButton>
            </AppCard>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}