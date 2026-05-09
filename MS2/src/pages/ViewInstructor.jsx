
import {
  Briefcase,
  MapPin,
  FileText,
  ExternalLink,
  Mail,
} from "lucide-react";

import AppModal from "@/components/common/AppModal";
import PrimaryActionButton from "@/components/ui/Searchcommons/PrimaryActionButton";
import { AppButton } from "@/components/ui/AppButton";
import { useNavigate } from "react-router-dom";
import ChatsSection from "./ChatsSection";
import InstructorProfileCard from "./InstructorProfileCard";

import { FaGithub, FaLinkedin} from "react-icons/fa";
import {Globe} from "lucide-react"

const instructor = {
  image:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1200&auto=format&fit=crop",

  name: "Yasmin Khaled",

  username: "yasminkhaled",

  email: "yasmin.khaled@guc.edu.eg",

  role: "Business Informatics Instructor",

  location: "Giza, Egypt",

  Department: "BI",

  JoinedGUC: 2005,

  OfficeHours:
    "Sun, Tue, Thu (10:00 AM - 12:00 PM)",

  CourseLinked: "4",

  socials: [
    {
      icon: FaLinkedin,
    },
    {
      icon: FaGithub,
    },
    {
      icon: Globe,
    },
  ],
};

export default function ViewInstructor({
  
  onClose,
}) {  return (
    <AppModal
      title=""
      onClose={onClose}
      maxWidth="max-w-5xl"
    >
      <InstructorProfileCard
        instructor={instructor}
      />
    </AppModal>
  );
}