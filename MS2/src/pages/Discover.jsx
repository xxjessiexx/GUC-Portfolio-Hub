
import DashboardLayout from "@/components/layout/DashboardLayout";
import { AppCard } from "@/components/ui/AppCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

import CourseBadge from "@/components/ui/CourseBadge";
import DiscoverCard from "@/components/ui/Searchcommons/DiscoverCard";
import { CheckCircle2 } from "lucide-react";
import InsightRow from "@/components/ui/Searchcommons/InsightRow";
import TipItem from "@/components/ui/Searchcommons/TipItem";
import RecommendedProjectsSection from "@/components/ui/Searchcommons/RecommendedProjectsSection";
import DiscoverSearchBar from "@/components/ui/Searchcommons/DiscoverSearchBar";
import { useNavigate } from "react-router-dom";
import {recommendedProjects} from "@/data/discoverdata"
import SearchFilterToolbar from "@/components/common/SearchFilterToolbar";
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
      
        {/* HEADER */}
          <main className="px-4 py-6 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
        <div>
           <h1 className="mt-3 text-4xl font-black tracking-tight text-[color:var(--ink)] sm:text-5xl">
            Discover
          </h1>

          <p className="mt-3 text-base font-semibold text-[color:var(--muted)]">
            Discover projects, portfolios, and course instructors across the GUC community.
          </p>
        </div>

        {/* SEARCH */}
       <div className="space-y-6">

  {/* TOP CARDS */}
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

    <DiscoverCard
      icon={FolderOpen}
      title="Explore Projects"
      description="Browse innovative projects built by students across all disciplines."
      buttonText="Browse Projects"
      image="/discover/project-card.png"
      onClick={() => navigate("/explore-projects")}
      
    />

    <DiscoverCard
      icon={Briefcase}
      title="Explore Portfolios"
      description="Discover student portfolios showcasing skills, experience, and achievements."
      buttonText="Browse Portfolios"
      image="/discover/portfolio-card.png"
      onClick={() => navigate("/explore-portfolio")}
    />

    <DiscoverCard
      icon={GraduationCap}
      title="Find Instructors"
      description="Connect with expert instructors and explore their courses and specialties."
      buttonText="Find Instructors"
      image="/discover/instructor-card.png"
      onClick={() => navigate("/explore-instructors")}
    />
  </div>

  {/* RECOMMENDED */}
  <RecommendedProjectsSection
    projects={recommendedProjects}
  />

  {/* INSIGHTS */}
  

</div>
        
      </div></main>
    </DashboardLayout>
    
  );
}



