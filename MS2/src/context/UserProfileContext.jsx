import { createContext, useContext, useEffect, useState } from "react";
import { student } from "@/data/studentDashboardData";

const UserProfileContext = createContext();

export function UserProfileProvider({ children, currentUser }) {
  const [profile, setProfile] = useState({
    name: currentUser?.name || student.name,
    email: currentUser?.email || "yasmin.khaled@student.guc.edu.eg",
    semester: currentUser?.semester || student.semester,
    faculty: currentUser?.faculty || "Faculty of Engineering",
    major: currentUser?.major || "Computer Science",
    role: currentUser?.major
      ? `${currentUser.major} Student`
      : "Computer Science Student",
    bio:
      currentUser?.bio ||
      "Passionate about building impactful digital solutions.",
    image: currentUser?.image || null,
  });

  useEffect(() => {
    if (!currentUser) return;

    setProfile({
      name: currentUser.name,
      email: currentUser.email,
      semester: currentUser.semester,
      faculty: currentUser.faculty || "Faculty of Engineering",
      major: currentUser.major || "Computer Science",
      role: `${currentUser.major || "Computer Science"} Student`,
      bio:
        currentUser.bio ||
        "Passionate about building impactful digital solutions.",
      image: currentUser.image || null,
    });
  }, [currentUser]);

  const updateProfile = (updates) => {
    setProfile((prev) => {
      const updatedProfile = { ...prev, ...updates };
      sessionStorage.setItem("currentUser", JSON.stringify(updatedProfile));
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