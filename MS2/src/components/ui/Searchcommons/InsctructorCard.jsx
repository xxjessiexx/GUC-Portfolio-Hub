import { Mail, MapPin, Eye } from "lucide-react";
import { AppCard } from "@/components/ui/AppCard";
import CourseBadge from "@/components/ui/CourseBadge";

export default function InstructorCard({ instructor,onView }) {
  return (
    <AppCard
      className="
        p-6
        rounded-[28px]
        border border-gray-100
        bg-white
        shadow-sm
      "
    >
      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-[1.2fr_0.9fr_1.3fr_auto]
          gap-6
          items-center
        "
      >

        {/* LEFT */}
        <div className="flex items-center gap-5">
          <img
            src={instructor.image}
            alt={instructor.name}
            className="w-24 h-24 rounded-full object-cover"
          />

          <div>
            <h2 className="text-2xl font-black text-[#16253A]">
              {instructor.name}
            </h2>

            <p className="mt-1 text-gray-500 font-semibold">
              {instructor.role}
            </p>

            <p className="mt-2 text-[#69A7FF] font-semibold">
              {instructor.department}
            </p>
          </div>
        </div>

        {/* CENTER */}
        <div className="space-y-4 xl:border-l xl:border-r border-gray-100 xl:px-6">

          <div className="flex items-center gap-3 text-gray-500">
            <Mail size={18} />
            <span>{instructor.email}</span>
          </div>

          <div className="flex items-center gap-3 text-gray-500">
            <MapPin size={18} />
            <span>{instructor.office}</span>
          </div>
        </div>

        {/* COURSES */}
        <div>
          <h3 className="font-black text-[#16253A] mb-3">
            Courses Taught
          </h3>

          <div className="flex flex-wrap gap-2">
            {instructor.courses.map((course) => (
              <CourseBadge
                key={course}
                course={course}
                className="mt-0"
              />
            ))}
          </div>
        </div>

        {/* BUTTON */}
        <div className="flex justify-end">
          <button
  onClick={onView}
  className="
    h-12
    px-6
    rounded-full
    border border-[#CFE2FF]
    text-[#69A7FF]
    font-semibold
    flex items-center gap-2
    hover:bg-[#EEF5FF]
    transition
  "
>
  <Eye size={18} />
  View Profile
</button>
        </div>

      </div>
    </AppCard>
  );
}