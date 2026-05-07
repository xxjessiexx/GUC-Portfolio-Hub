
import DashboardLayout from "@/components/layout/DashboardLayout";
import { AppCard } from "@/components/ui/AppCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import SearchInput from "@/components/filters/SearchInput";
import CourseBadge from "@/components/ui/CourseBadge";
import DiscoverCard from "@/components/ui/DiscoverCard";
import { CheckCircle2 } from "lucide-react";
import InsightRow from "@/components/ui/InsightRow";
import TipItem from "@/components/ui/TipItem";
import RecommendedProjectsSection from "@/components/ui/RecommendedProjectsSection";

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

const recommendedProjects = [
  {
    id: 1,
    title: "Smart Study Buddy",
    course: "CSEN 501 - Software Engineering",
    description:
      "AI-powered study assistant that helps students organize notes, track progress, and get personalized recommendations.",
    tags: ["React", "Node.js", "MongoDB"],
    rating: 4.8,
    contributors: 12,
    updated: "Updated 2 days ago",
    icon: Box,
    color: "bg-cyan-100 text-cyan-600",
  },
  {
    id: 2,
    title: "EcoTrack",
    course: "CSEN 307 - Database Systems",
    description:
      "Sustainability tracking platform that helps users monitor their environmental impact and adopt greener habits.",
    tags: ["Next.js", "PostgreSQL", "Tailwind"],
    rating: 4.6,
    contributors: 8,
    updated: "Updated 5 days ago",
    icon: Leaf,
    color: "bg-green-100 text-green-600",
  },
  {
    id: 3,
    title: "HealthSync",
    course: "CSEN 403 - Mobile Computing",
    description:
      "Mobile app for health monitoring and appointment management with secure data synchronization across devices.",
    tags: ["Flutter", "Firebase", "Dart"],
    rating: 4.7,
    contributors: 10,
    updated: "Updated 1 week ago",
    icon: Heart,
    color: "bg-red-100 text-red-500",
  },
];

export default function DiscoverPage() {
  return (
    <DashboardLayout>
      <div className="p-4 xl:p-5 space-y-3 bg-[#F8FBFF] min-h-screen">
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
       <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-5">
          <div className="flex-1 space-y-3">
            <AppCard className="p-4 rounded-[28px] border border-gray-100 bg-white shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1">
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    placeholder="Search projects, portfolios, technologies, skills, or instructors..."
                    className="w-full rounded-2xl border border-gray-100 py-3 pl-12 pr-4 outline-none bg-[#FCFDFF]"
                  />
                </div>

                <button className="flex items-center px-4 py-2.5 rounded-2xl border border-gray-100 bg-white font-semibold text-gray-600 hover:bg-gray-50 transition">
                  <Search size={16} />
                  Filters
                </button>
              </div>
            </AppCard>

            {/* TOP CARDS */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              <DiscoverCard
                icon={FolderOpen}
                title="Explore Projects"
                description="Browse innovative projects built by students across all disciplines."
                buttonText="Browse Projects"
                image="/discover/instructor-card.png"
                
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
               
              />
            </div>

            {/* RECOMMENDED */}
            <RecommendedProjectsSection
              projects={recommendedProjects}
            />
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="w-full xl:w-[290px] shrink-0 pt-2 space-y-5">
            {/* SEARCH TIPS */}
            <AppCard className="p-6 rounded-[28px] bg-white border border-gray-100 shadow-sm">
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
            <AppCard className="p-6 rounded-[28px] bg-white border border-gray-100 shadow-sm">
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
            <AppCard className="p-6 rounded-[28px] bg-white border border-gray-100 shadow-sm">
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



