import { Link } from "react-router-dom";


import {
ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import ProjectCard from "@/components/landing/ProjectCard";

export default function ProjectSection({projects}) {
return (
    <section className="relative z-10 px-6 py-20">
        <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
            <p className="mb-3 text-sm font-black uppercase tracking-widest text-[#355872]">
                Explore
            </p>

            <h2 className="text-4xl font-black tracking-tight text-[#102630]">
                Discover amazing student work
            </h2>

            <p className="mt-3 max-w-xl text-[#7B8794]">
                Browse public projects without signing in. Save, message, or
                apply after logging in.
            </p>
            </div>

            <Link to="/projects">
            <Button
                variant="outline"
                className="h-12 rounded-2xl border-[#355872]/20 bg-white/60 font-bold text-[#355872]"
            >
                View All Projects
                <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
            {projects.map((project, index) => (
            <ProjectCard
            key={project.title}
            project={project}
            index={index}
            />
            ))}
        </div>
        </div>
    </section>
);
}