
import DashboardLayout from "@/components/layout/DashboardLayout";
import { AppCard } from "@/components/ui/AppCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import SearchInput from "@/components/filters/SearchInput";
import CourseBadge from "@/components/ui/CourseBadge";
import DiscoverCard from "@/components/ui/Searchcommons/DiscoverCard";
import { CheckCircle2 } from "lucide-react";
import InsightRow from "@/components/ui/Searchcommons/InsightRow";
import TipItem from "@/components/ui/Searchcommons/TipItem";
import RecommendedProjectsSection from "@/components/ui/Searchcommons/RecommendedProjectsSection";
import DiscoverSearchBar from "@/components/ui/Searchcommons/DiscoverSearchBar";
import { useNavigate } from "react-router-dom";
import {recommendedProjects} from "@/data/discoverdata"

import {
  Search,
  FolderOpen,
  Briefcase,
  GraduationCap,
  Lightbulb,
  Hash,
  Box,
  Users,
  Star,
  GitBranch,
  RefreshCw,
  ArrowRight,
  Heart,
  Leaf,
} from "lucide-react";



export default function DiscoverPage() {
  const navigate = useNavigate();
  return (
    <DashboardLayout>
      <div className="p-4 xl:p-5 space-y-3 min-h-screen">
        {/* HEADER */}
        <div>
          <h1 className="text-3xl xl:text-4xl font-black text-[#0F2233]">
            Discover
          </h1>

          <p className="mt-2 text-gray-500 font-medium text-m">
            Discover projects, portfolios, and course instructors across the GUC community.
          </p>
        </div>

        {/* SEARCH */}
       <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_260px] gap-4">
          <div className="flex-1 space-y-3">
            <AppCard className="p-4 rounded-[28px] border border-gray-100  shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <DiscoverSearchBar
                  placeholder="Search projects, portfolios, technologies, skills, or instructors..."
                />

                <button className="flex items-center px-4 py-2.5 rounded-2xl border border-gray-100 bg-white font-semibold text-gray-600 hover:bg-gray-50 transition">
                  <Search size={16} />
                  Filters
                </button>
              </div>
            </AppCard>

            {/* TOP CARDS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              <DiscoverCard
                icon={FolderOpen}
                title="Explore Projects"
                description="Browse innovative projects built by students across all disciplines."
                buttonText="Browse Projects"
                image="/discover/instructor-card.png"
                onClick={() => navigate("/explore-projects")}
                
              />

              <DiscoverCard
                icon={Briefcase}
                title="Explore Portfolios"
                description="Discover student portfolios showcasing skills, experience, and achievements."
                buttonText="Browse Portfolios"
                image="/discover/project-card.png"
                
              />

              <DiscoverCard
                icon={GraduationCap}
                title="Find Instructors"
                description="Connect with expert instructors and explore their courses and specialties."
                buttonText="Find Instructors"
                image="/discover/portfolio-card.png"
                onClick={() => navigate("/explore-instructors")}
               
              />
            </div>

            {/* RECOMMENDED */}
            <RecommendedProjectsSection
              projects={recommendedProjects}
            />
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="w-full xl:w-[260px] shrink-0 pt-1 space-y-4">
            {/* SEARCH TIPS */}
            <AppCard className="p-6 rounded-[28px] bg-transparent border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <Lightbulb size={18} className="text-yellow-500" />

                <h3 className="font-black text-[#16253A] text-lg">
                  Search Tips
                </h3>
              </div>

             <div className="space-y-3 text-sm text-gray-500 font-medium">
                <TipItem text="Try technologies: React, Node.js, Python" />
                
                <TipItem text="Search by skills: UI/UX, ML, Data Science" />
                
                <TipItem text='Use quotes for exact matches: “Smart App”' />
                
                <TipItem text="Combine filters for better results" />
              </div>
            </AppCard>

            {/* TAGS */}
            <AppCard className="p-6 rounded-[28px] bg-transparent border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Hash size={18} className="text-[#69A7FF]" />

                  <h3 className="font-black text-[#16253A] text-lg">
                    Trending Tags
                  </h3>
                </div>

                <button className="text-[#69A7FF] text-sm font-semibold hover:underline">
                  View All
                </button>
              </div>

              <div className="flex flex-wrap gap-3">
                {[
                  "React",
                  "AI/ML",
                  "Mobile App",
                  "Data Science",
                  "UI/UX",
                  "Python",
                  "Web Development",
                  "Firebase",
                ].map((tag) => (
                  <CourseBadge
                    key={tag}
                    course={tag}
                    className="mt-0"
                  />
                ))}
              </div>
            </AppCard>

            {/* INSIGHTS */}
            <AppCard className="p-6 rounded-[28px] bg-transparent border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <Box size={18} className="text-[#67D5C0]" />

                <h3 className="font-black text-[#16253A] text-lg">
                  Discovery Insights
                </h3>
              </div>

              <div className="space-y-5">
                <InsightRow
                  title="Projects"
                  subtitle="Across all disciplines"
                  number="248"
                  color="bg-blue-100 text-blue-500"
                />

                <InsightRow
                  title="Portfolios"
                  subtitle="Showcasing student work"
                  number="156"
                  color="bg-green-100 text-green-500"
                />

                <InsightRow
                  title="Instructors"
                  subtitle="Expert educators"
                  number="42"
                  color="bg-purple-100 text-purple-500"
                />
              </div>

              <div className="mt-6 text-sm text-gray-400 flex items-center justify-between">
                Updated just now

                <RefreshCw size={15} />
              </div>
            </AppCard>
          </div>
        </div>
        
      </div>
    </DashboardLayout>
  );
}



