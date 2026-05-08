import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { student } from "@/data/studentDashboardData";

const UserProfileContext = createContext();

const roleLabels = {
  student: "Student",
  instructor: "Course Instructor",
  employer: "Employer",
  admin: "Administrator",
};

const roleDefaults = {
  student: {
    name: student.name,
    email: "yasmin.khaled@student.guc.edu.eg",
    role: "student",
    semester: student.semester || "6",
    faculty: "Faculty of Engineering",
    major: student.major || "Computer Science",
    title: "Student",
  },
  instructor: {
    name: "Dr. Sarah Hassan",
    email: "sarah.hassan@guc.edu.eg",
    role: "instructor",
    faculty: "Faculty of Engineering",
    major: "Computer Science",
    title: "Course Instructor",
    office: "C7.214",
  },
  employer: {
    name: "TechVista Cairo",
    companyName: "TechVista Cairo",
    email: "careers@techvista.io",
    role: "employer",
    faculty: "TechVista Cairo",
    major: "Talent Acquisition",
    title: "Employer",
    department: "Software Engineering",
    industry: "Software & AI Solutions",
  },
  admin: {
    name: "Nadine Amin",
    email: "admin@guc.edu.eg",
    role: "admin",
    faculty: "German University in Cairo",
    major: "Platform Administration",
    title: "Administrator",
  },
};

const defaultLinks = {
  linkedin: "",
  github: "",
  behance: "",
};

function normalizeRole(value) {
  const role = String(value || "").trim().toLowerCase();

  if (role.includes("admin")) return "admin";
  if (role.includes("instructor")) return "instructor";
  if (role.includes("employer") || role.includes("company")) return "employer";
  if (role.includes("student")) return "student";

  return "";
}

function buildProfile(currentUser) {
  const role =
    normalizeRole(
      currentUser?.accountRole ||
        currentUser?.systemRole ||
        currentUser?.role ||
        currentUser?.userType
    ) || "student";

  const fallback = roleDefaults[role] || roleDefaults.student;

  const major = currentUser?.major || fallback.major || "Computer Science";

  const companyName =
    currentUser?.companyName ||
    fallback.companyName ||
    currentUser?.company ||
    "";

  const displayName =
    role === "employer"
      ? companyName || currentUser?.name || fallback.name
      : currentUser?.name || fallback.name;

  return {
    ...fallback,
    ...currentUser,
    name: displayName,
    companyName,
    email: currentUser?.email || fallback.email,
    semester: currentUser?.semester || fallback.semester || "1",
    faculty: currentUser?.faculty || fallback.faculty,
    major,
    role,
    systemRole: role,
    accountRole: role,
    title: currentUser?.title || fallback.title || roleLabels[role],
    displayRole:
      currentUser?.displayRole ||
      (role === "student" ? `${major} Student` : roleLabels[role]),
    bio:
      currentUser?.bio ||
      (role === "employer"
        ? "Building practical software, AI tools, and internship pathways for ambitious GUC students."
        : "Passionate about building impactful digital solutions."),
    image: currentUser?.image || currentUser?.avatar || null,
    skills: currentUser?.skills || ["Python", "JavaScript", "React", "UI/UX"],
    links: currentUser?.links || defaultLinks,
  };
}

export function UserProfileProvider({ children, currentUser }) {
  const defaultProfile = useMemo(() => buildProfile(currentUser), [currentUser]);
  const [profile, setProfile] = useState(defaultProfile);

  useEffect(() => {
    setProfile(buildProfile(currentUser));
  }, [currentUser]);

  const updateProfile = (updates) => {
    setProfile((prev) => {
      const updatedRole = updates.role
        ? normalizeRole(updates.role) || prev.role
        : prev.role;

      const updatedProfile = {
        ...prev,
        ...updates,
        role: updatedRole,
        systemRole: updatedRole,
        accountRole: updatedRole,
      };

      try {
        const storedUser = JSON.parse(
          sessionStorage.getItem("currentUser") || "{}"
        );

        sessionStorage.setItem(
          "currentUser",
          JSON.stringify({
            ...storedUser,
            ...updatedProfile,
          })
        );
      } catch {
        sessionStorage.setItem("currentUser", JSON.stringify(updatedProfile));
      }

      return updatedProfile;
    });
  };

  return (
    <UserProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  return useContext(UserProfileContext);
}