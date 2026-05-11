import {
  Briefcase,
  MapPin,
  Mail,
  Globe,
} from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

import { AppButton } from "@/components/ui/AppButton";
import { useNavigate } from "react-router-dom";
import { getExistingDirectChat } from "@/data/demoStore";

function getInstructorValue(instructor, keys, fallback = "—") {
  for (const key of keys) {
    const value = instructor?.[key];
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return value;
    }
  }

  return fallback;
}

function getOfficeHours(instructor) {
  const value = getInstructorValue(
    instructor,
    ["officeHours", "OfficeHours", "availability"],
    "By appointment"
  );

  const text = String(value);
  const [main, details] = text.split("(");

  return {
    main: main.trim() || "By appointment",
    details: details ? `(${details.replace(")", "")})` : "",
  };
}

export default function InstructorProfileCard({
  instructor,
  onClose,
}) {
  const navigate = useNavigate();
  const officeHours = getOfficeHours(instructor);

  const image = getInstructorValue(
    instructor,
    ["image", "profileImage", "avatar"],
    "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop"
  );

  const name = getInstructorValue(instructor, ["name", "fullName"], "Instructor");
  const email = getInstructorValue(instructor, ["email"], "No email listed");
  const username = getInstructorValue(
    instructor,
    ["username"],
    String(email).includes("@") ? String(email).split("@")[0] : String(name).toLowerCase().replace(/\s+/g, ".")
  );

  const title = getInstructorValue(instructor, ["title", "role"], "Course Instructor");
  const department = getInstructorValue(instructor, ["department", "Department"], "Computer Science");
  const office = getInstructorValue(instructor, ["office", "location", "Location"], "GUC Campus");
  const joinedGuc = getInstructorValue(instructor, ["joinedGUC", "JoinedGUC", "joinedAt"], "—");
  const coursesCount = instructor?.courseRecords?.length ?? instructor?.courses?.length ?? 0;

  const socials = instructor?.socials?.length
    ? instructor.socials
    : [
        { icon: FaLinkedin, label: "LinkedIn" },
        { icon: FaGithub, label: "GitHub" },
        { icon: Globe, label: "Website" },
      ];

  const handleGetInTouch = () => {
    if (!instructor?.id) {
      navigate("/chat");
      return;
    }

    const existingChat = getExistingDirectChat(instructor.id);

    onClose?.();

    if (existingChat?.id) {
      navigate(`/chat?chatId=${encodeURIComponent(existingChat.id)}`);
      return;
    }

    navigate(`/chat?targetUserId=${encodeURIComponent(instructor.id)}`);
  };

  return (
    <div
      className="
        grid
        gap-6
        p-2
        lg:grid-cols-[320px_1fr]
      "
    >
      {/* LEFT */}
      <div className="text-center">
        {/* IMAGE */}
        <div className="relative mx-auto w-fit">
          <img
            src={image}
            alt={name}
            className="
              mx-auto
              h-52 w-52
              rounded-full
              object-cover
            "
          />

          <div
            className="
              absolute bottom-4 right-4
              h-5 w-5
              rounded-full
              border-4 border-white
              bg-green-500
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
          {name}
        </h2>

        <p
          className="
            mt-2
            font-semibold
            text-gray-400
          "
        >
          @{username}
        </p>

        <p
          className="
            font-semibold
            text-gray-400
          "
        >
          {email}
        </p>

        {/* ACTIONS */}
        <div className="mt-8 space-y-5">
          <AppButton
            onClick={handleGetInTouch}
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
            {socials.map((social, index) => {
              const SocialIcon = social.icon;

              return (
                <button
                  key={social.label || index}
                  type="button"
                  className="
                    flex h-14 w-14
                    items-center justify-center
                    rounded-full
                    bg-[#EEF5FF]
                    text-[#284C7A]
                    transition
                    hover:scale-105
                  "
                >
                  <SocialIcon size={24} />
                </button>
              );
            })}
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
              <Briefcase className="text-[#284C7A]" />

              <span
                className="
                  text-lg
                  font-semibold
                  text-gray-600
                "
              >
                {title}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="text-[#284C7A]" />

              <span
                className="
                  text-lg
                  font-semibold
                  text-gray-600
                "
              >
                {office}
              </span>
            </div>
          </div>
        </div>

        {instructor.bio && (
          <div className="rounded-3xl border border-gray-100 bg-[#F8FBFF] p-5">
            <h4 className="font-black text-[#16253A]">About</h4>
            <p className="mt-2 leading-7 text-gray-600">{instructor.bio}</p>
          </div>
        )}

        {/* STATS */}
        <div
          className="
            mt-10
            grid grid-cols-2 gap-y-6
            border-t border-gray-100
            pt-8
            md:grid-cols-4
          "
        >
          <ProfileStat
            value={department}
            label="Department"
          />

          <ProfileStat
            value={joinedGuc}
            label="Joined GUC"
          />

          <ProfileStat
            value={officeHours.main}
            label="Office Hours"
            subValue={officeHours.details}
          />

          <ProfileStat
            value={coursesCount}
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
        px-4
        text-center
        md:border-r md:border-gray-100
      "
    >
      <h3
        className="
          text-2xl
          font-black
          text-[#16253A]
        "
      >
        {value}
      </h3>

      <p
        className="
          mt-2
          font-semibold
          text-gray-500
        "
      >
        {subValue || label}
      </p>
    </div>
  );
}
