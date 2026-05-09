
import {
  Briefcase,
  MapPin,
  Mail,
  FileText,
  ExternalLink,
} from "lucide-react";

import { AppCard } from "@/components/ui/AppCard";
import PrimaryActionButton from "@/components/ui/Searchcommons/PrimaryActionButton";
import instructor from "@/data/ViewInstructorData";

export default function ViewInstructor() {
  return (
    <AppCard
      className="
        p-8
        rounded-[36px]
        border border-gray-100
        bg-white/70
        backdrop-blur-md
        shadow-sm
      "
    >
      {/* IMAGE */}
      <div className="flex flex-col items-center text-center">
        <div className="relative">
          <img
            src={instructor.image}
            alt={instructor.name}
            className="
              w-44 h-44
              rounded-full
              object-cover
            "
          />

          <div
            className="
              absolute bottom-4 right-3
              w-5 h-5
              rounded-full
              bg-green-500
              border-4 border-white
            "
          />
        </div>

        {/* NAME */}
        <h2
          className="
            mt-6
            text-4xl
            font-black
            text-[#16253A]
          "
        >
          {instructor.name}
        </h2>

        {/* USERNAME + EMAIL */}
        <p
          className="
            mt-2
            text-gray-400
            font-semibold
            text-lg
          "
        >
          @{instructor.username} • {instructor.email}
        </p>

        {/* INFO */}
        <div className="mt-6 space-y-4 text-gray-500">
          <div className="flex items-center justify-center gap-3">
            <Briefcase size={20} />
            <span className="font-semibold text-lg">
              {instructor.role}
            </span>
          </div>

          <div className="flex items-center justify-center gap-3">
            <MapPin size={20} />
            <span className="font-semibold text-lg">
              {instructor.location}
            </span>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div
        className="
          mt-8
          grid grid-cols-3
          border-t border-gray-100
          pt-6
        "
      >
        <div className="text-center border-r border-gray-100">
          <h3 className="text-5xl font-black text-[#16253A]">
            {instructor.department}
          </h3>

          <p className="mt-2 text-gray-500 font-semibold">
            Department
          </p>
        </div>

        <div className="text-center border-r border-gray-100">
          <h3 className="text-5xl font-black text-[#16253A]">
            {instructor.JoinedGUC}
          </h3>

          <p className="mt-2 text-gray-500 font-semibold">
            Joined GUC
          </p>
        </div>

        <div className="text-center">
          <h3 className="text-5xl font-black text-[#16253A]">
            {instructor.OfficeHours}
          </h3>

          <p className="mt-2 text-gray-500 font-semibold">
            Office Hours
          </p>
        </div>

        <div className="text-center">
          <h3 className="text-5xl font-black text-[#16253A]">
            {instructor.CourseLinked}
          </h3>

          <p className="mt-2 text-gray-500 font-semibold">
            Course Linked
          </p>
        </div>
      </div>

      {/* BUTTONS */}
      <div className="mt-8 space-y-4">
        <PrimaryActionButton
          text="Get in Touch"
          className="
            w-full
            h-16
            rounded-2xl
            justify-center
            text-lg
            font-bold
          "
        />

        <button
          className="
            w-full
            h-16
            rounded-2xl
            border border-gray-200
            bg-white
            flex items-center justify-center gap-3
            text-[#16253A]
            font-bold
            text-lg
            hover:bg-gray-50
            transition
          "
        >
          <FileText size={22} />
          View Resume
          <ExternalLink size={18} />
        </button>
      </div>

      {/* SOCIALS */}
      <div className="flex items-center justify-center gap-6 mt-10">
        {instructor.socials.map((social, index) => (
          <button
            key={index}
            className="
              w-16 h-16
              rounded-full
              bg-[#EEF5FF]
              flex items-center justify-center
              text-[#284C7A]
              hover:scale-105
              transition
            "
          >
            <social.icon size={28} />
          </button>
        ))}
      </div>
    </AppCard>
  );
}



