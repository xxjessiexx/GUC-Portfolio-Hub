import {
  Briefcase,
  MapPin,
  Mail,
} from "lucide-react";

import { AppButton } from "@/components/ui/AppButton";
import { useNavigate } from "react-router-dom";

export default function InstructorProfileCard({
  instructor,
}) {
  const navigate = useNavigate();

  return (
    <div
      className="
        grid
        lg:grid-cols-[320px_1fr]
        gap-6
        p-2
      "
    >
      {/* LEFT */}
      <div className="text-center">

        {/* IMAGE */}
        <div className="relative mx-auto w-fit">
          <img
            src={instructor.image}
            alt={instructor.name}
            className="
              w-52 h-52
              rounded-full
              object-cover
              mx-auto
            "
          />

          <div
            className="
              absolute bottom-4 right-4
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
            text-3xl
            font-black
            text-[#16253A]
          "
        >
          {instructor.name}
        </h2>

        <p
          className="
            mt-2
            text-gray-400
            font-semibold
          "
        >
          @{instructor.username}
        </p>

        <p
          className="
            text-gray-400
            font-semibold
          "
        >
          {instructor.email}
        </p>

        {/* ACTIONS */}
        <div className="mt-8 space-y-5">

          <AppButton
            onClick={() => navigate("/chat")}
            className="
              rounded-2xl
              bg-[color:var(--primary)]
              px-5
              font-black
              text-white
              hover:bg-[color:var(--dark)]
            "
          >
            <Mail size={22} />

            Get in Touch
          </AppButton>

          {/* SOCIALS */}
          <div
            className="
              flex items-center justify-center
              gap-4
            "
          >
            {instructor.socials.map(
              (social, index) => (
                <button
                  key={index}
                  className="
                    w-14 h-14
                    rounded-full
                    bg-[#EEF5FF]
                    flex items-center justify-center
                    text-[#284C7A]
                    hover:scale-105
                    transition
                  "
                >
                  <social.icon size={24} />
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="space-y-8">

        <div>
          <h3
            className="
              text-2xl
              font-black
              text-[#16253A]
            "
          >
            Instructor Information
          </h3>

          <div className="mt-6 space-y-5">

            <div className="flex items-center gap-3">
              <Briefcase
                className="text-[#284C7A]"
              />

              <span
                className="
                  text-lg
                  font-semibold
                  text-gray-600
                "
              >
                {instructor.role}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <MapPin
                className="text-[#284C7A]"
              />

              <span
                className="
                  text-lg
                  font-semibold
                  text-gray-600
                "
              >
                {instructor.location}
              </span>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div
          className="
            mt-10
            grid grid-cols-4
            border-t border-gray-100
            pt-8
          "
        >
          <ProfileStat
            value={instructor.Department}
            label="Department"
          />

          <ProfileStat
            value={instructor.JoinedGUC}
            label="Joined GUC"
          />

          <ProfileStat
            value={
              instructor.OfficeHours.split(
                "("
              )[0]
            }
            subValue={`(${
              instructor.OfficeHours
                .split("(")[1]
                ?.replace(")", "")
            })`}
          />

          <ProfileStat
            value={instructor.CourseLinked}
            label="Courses"
          />
        </div>
      </div>
    </div>
  );
}

function ProfileStat({
  value,
  label,
  subValue,
}) {
  return (
    <div
      className="
        text-center
        border-r border-gray-100
        px-4
      "
    >
      <h3
        className="
          text-3xl
          font-black
          text-[#16253A]
        "
      >
        {value}
      </h3>

      {subValue ? (
        <p
          className="
            mt-2
            text-gray-500
            font-semibold
          "
        >
          {subValue}
        </p>
      ) : (
        <p
          className="
            mt-2
            text-gray-500
            font-semibold
          "
        >
          {label}
        </p>
      )}
    </div>
  );
}