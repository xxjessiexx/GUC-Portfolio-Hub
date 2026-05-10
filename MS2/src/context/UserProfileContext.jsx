import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { student } from "@/data/studentDashboardData";
import { getCurrentUser, normalizeRole as normalizeStoreRole, setCurrentUser, updateUser } from "@/data/demoStore";

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
  const role = normalizeStoreRole(value || "");
  return role || "student";
}

function buildProfile(currentUser) {
  const storeUser = currentUser?.id ? getCurrentUser() || currentUser : currentUser;
  const role = normalizeRole(
    storeUser?.accountRole || storeUser?.systemRole || storeUser?.role || storeUser?.userType
  );

  const fallback = roleDefaults[role] || roleDefaults.student;
  const major = storeUser?.major || fallback.major || "Computer Science";
  const companyName = storeUser?.companyName || fallback.companyName || storeUser?.company || "";
  const displayName = role === "employer" ? companyName || storeUser?.name || fallback.name : storeUser?.name || fallback.name;

  return {
    ...fallback,
    ...storeUser,
    name: displayName,
    companyName,
    email: storeUser?.email || fallback.email,
    semester: storeUser?.semester || fallback.semester || "1",
    faculty: storeUser?.faculty || fallback.faculty,
    major,
    role,
    systemRole: role,
    accountRole: role,
    title: storeUser?.title || fallback.title || roleLabels[role],
    displayRole: storeUser?.displayRole || (role === "student" ? `${major} Student` : roleLabels[role]),
    bio:
      storeUser?.bio ||
      (role === "employer"
        ? "Building practical software, AI tools, and internship pathways for ambitious GUC students."
        : "Passionate about building impactful digital solutions."),
    image: storeUser?.image || storeUser?.avatar || null,
    skills: storeUser?.skills || ["Python", "JavaScript", "React", "UI/UX"],
    links: storeUser?.links || defaultLinks,
  };
}

export function UserProfileProvider({ children, currentUser }) {
  const defaultProfile = useMemo(() => buildProfile(currentUser), [currentUser]);
  const [profile, setProfile] = useState(defaultProfile);

  useEffect(() => {
    setProfile(buildProfile(currentUser));
  }, [currentUser]);

  useEffect(() => {
    const refresh = () => setProfile(buildProfile(currentUser));
    window.addEventListener("demo-current-user-change", refresh);
    window.addEventListener("demo-db-change", refresh);
    return () => {
      window.removeEventListener("demo-current-user-change", refresh);
      window.removeEventListener("demo-db-change", refresh);
    };
  }, [currentUser]);

  const updateProfile = (updates) => {
    setProfile((prev) => {
      const updatedRole = updates.role ? normalizeRole(updates.role) || prev.role : prev.role;
      const updatedProfile = {
        ...prev,
        ...updates,
        role: updatedRole,
        systemRole: updatedRole,
        accountRole: updatedRole,
      };

      try {
        const storedUser = JSON.parse(sessionStorage.getItem("currentUser") || "{}");
        const sessionUser = { ...storedUser, ...updatedProfile };
        sessionStorage.setItem("currentUser", JSON.stringify(sessionUser));

        if (sessionUser.id) {
          const saved = updateUser(sessionUser.id, updatedProfile);
          if (saved) setCurrentUser(saved);
        }
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
