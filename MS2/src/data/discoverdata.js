import { Box, Leaf, Heart } from "lucide-react";
export const recommendedProjects = [
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