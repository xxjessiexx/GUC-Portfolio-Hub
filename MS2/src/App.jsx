import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { NotificationsProvider } from "./context/NotificationsContext";
import { UserProfileProvider } from "./context/UserProfileContext";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import VerifyOTP from "./pages/VerifyOTP";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import InstructorDashboard from "./pages/InstructorDashboard";
import EmployerDashboard from "./pages/EmployerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ForgotPassword from "./pages/forgot-password";
import EditStudentProfile from "./pages/EditStudentProfile";
import EditInstructorProfile from "./pages/EditInstructorProfile";
import EditEmployerProfile from "./pages/EditEmployerProfile";
import FloatingCTA from "./components/ui/FloatingCTA";
import CreateNewProject from "./pages/CreateNewProject";
import SetPassword from "./pages/SetPassword";
import ViewAllProjects from "./pages/ViewAllProjects";
import Notifications from "./pages/Notifications";
import EditProject from "./pages/EditProject";
import Portfolio from "./pages/Portfolio";
import ManagePortfolio from "./pages/ManagePortfolio";
import CreateInternship from "./pages/CreateInternship";
import Discover from "./pages/Discover";
import Internships from "./pages/Internships";
import InternshipDetails from "./pages/InternshipDetails";
import MyApplications from "./pages/MyApplications";
import ManageInternships from "./pages/ManageInternships";
import ManageApplicants from "./pages/ManageApplicants";
import ProjectPage from "./pages/ProjectPage";
import ExploreInstructors from "./pages/ExploreInstructors";

export default function App() {
  const [users, setUsers] = useState(() => {
    const stored = sessionStorage.getItem("users");
    return stored ? JSON.parse(stored) : [];
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const stored = sessionStorage.getItem("currentUser");
    return stored ? JSON.parse(stored) : null;
  });

  const addUser = (user) => {
    setUsers((prev) => {
      const updated = [...prev, user];
      sessionStorage.setItem("users", JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    console.log("Users array:", users);
    console.log("Current user:", currentUser);
  }, [users, currentUser]);

  return (
    <BrowserRouter>
      <NotificationsProvider>
        <UserProfileProvider currentUser={currentUser}>
          <FloatingCTA />

          <Routes>
            <Route path="/" element={<Landing />} />

            <Route path="/verifyOTP" element={<VerifyOTP />} />
            <Route
              path="/SetPassword"
              element={
                <SetPassword
                  users={users}
                  setUsers={setUsers}
                  setCurrentUser={setCurrentUser}
                />
              }
            />

            <Route
              path="/login"
              element={<Login users={users} setCurrentUser={setCurrentUser} />}
            />
            <Route path="/register" element={<Register addUser={addUser} />} />

            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/instructor-dashboard" element={<InstructorDashboard />} />
            <Route path="/employer-dashboard" element={<EmployerDashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />

            <Route path="/notifications" element={<Notifications />} />

            <Route path="/discover" element={<Discover />} />
            <Route path="/Discover" element={<Discover />} />
            <Route path="/view-all-projects" element={<ViewAllProjects />} />

            <Route path="/create-internship" element={<CreateInternship />} />
            <Route path="/internships" element={<Internships />} />
            <Route path="/internships/:internshipId" element={<InternshipDetails />} />
            <Route path="/my-applications" element={<MyApplications />} />
            <Route path="/manage-internships" element={<ManageInternships />} />
            <Route path="/manage-applicants/:internshipId" element={<ManageApplicants />} />

            <Route path="/student-dashboard/portfolio" element={<Portfolio />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/manage-portfolio" element={<ManagePortfolio />} />

            <Route path="/edit-student-profile" element={<EditStudentProfile />} />
            <Route path="/edit-instructor-profile" element={<EditInstructorProfile />} />
            <Route path="/edit-employer-profile" element={<EditEmployerProfile />} />

            <Route path="/create-project" element={<CreateNewProject />} />
            <Route path="/edit-project/:projectId" element={<EditProject />} />
            <Route path="/projects/:projectId/edit" element={<EditProject />} />
            <Route path="/project" element={<ProjectPage />} />
            <Route path="/explore-instructors" element={<ExploreInstructors />} />

            <Route
              path="/forgot-password"
              element={<ForgotPassword users={users} setCurrentUser={setCurrentUser} />}
            />
          </Routes>
        </UserProfileProvider>
      </NotificationsProvider>
    </BrowserRouter>
  );
}
