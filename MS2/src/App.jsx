import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { NotificationsProvider } from "./context/NotificationsContext";
import { UserProfileProvider } from "./context/UserProfileContext";
import { Toaster } from "sonner";

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
import ExploreProjects from "@/pages/ExploreProjects";
import ExplorePortfolios from "./pages/ExplorePortfolios";
import ChatsSection from "@/pages/ChatsSection";
import EditInternship from "@/pages/EditInternship";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

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

          <Toaster richColors position="top-right" />

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

            <Route
              path="/student-dashboard"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/instructor-dashboard"
              element={
                <ProtectedRoute allowedRoles={["instructor"]}>
                  <InstructorDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/employer-dashboard"
              element={
                <ProtectedRoute allowedRoles={["employer"]}>
                  <EmployerDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/chat"
              element={
                <ProtectedRoute
                  allowedRoles={["student", "instructor", "employer", "admin"]}
                >
                  <ChatsSection />
                </ProtectedRoute>
              }
            />

            <Route
              path="/notifications"
              element={
                <ProtectedRoute
                  allowedRoles={["student", "instructor", "employer", "admin"]}
                >
                  <Notifications />
                </ProtectedRoute>
              }
            />

            <Route
              path="/discover"
              element={
                <ProtectedRoute
                  allowedRoles={["student", "instructor", "employer", "admin"]}
                >
                  <Discover />
                </ProtectedRoute>
              }
            />

            <Route
              path="/Discover"
              element={
                <ProtectedRoute
                  allowedRoles={["student", "instructor", "employer", "admin"]}
                >
                  <Discover />
                </ProtectedRoute>
              }
            />

            <Route
              path="/view-all-projects"
              element={
                <ProtectedRoute allowedRoles={["student", "instructor", "admin"]}>
                  <ViewAllProjects />
                </ProtectedRoute>
              }
            />

            <Route
              path="/create-internship"
              element={
                <ProtectedRoute allowedRoles={["employer"]}>
                  <CreateInternship />
                </ProtectedRoute>
              }
            />

            <Route
              path="/internships"
              element={
                <ProtectedRoute
                  allowedRoles={["student", "instructor", "employer", "admin"]}
                >
                  <Internships />
                </ProtectedRoute>
              }
            />

            <Route
              path="/internships/:internshipId"
              element={
                <ProtectedRoute
                  allowedRoles={["student", "instructor", "employer", "admin"]}
                >
                  <InternshipDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/my-applications"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <MyApplications />
                </ProtectedRoute>
              }
            />

            <Route
              path="/manage-internships"
              element={
                <ProtectedRoute allowedRoles={["employer"]}>
                  <ManageInternships />
                </ProtectedRoute>
              }
            />

            <Route
              path="/manage-applicants/:internshipId"
              element={
                <ProtectedRoute allowedRoles={["employer"]}>
                  <ManageApplicants />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student-dashboard/portfolio"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <Portfolio />
                </ProtectedRoute>
              }
            />

            <Route
              path="/portfolio"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <Portfolio />
                </ProtectedRoute>
              }
            />

            <Route
              path="/manage-portfolio"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <ManagePortfolio />
                </ProtectedRoute>
              }
            />

            <Route
              path="/edit-student-profile"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <EditStudentProfile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/edit-instructor-profile"
              element={
                <ProtectedRoute allowedRoles={["instructor"]}>
                  <EditInstructorProfile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/edit-employer-profile"
              element={
                <ProtectedRoute allowedRoles={["employer"]}>
                  <EditEmployerProfile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/create-project"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <CreateNewProject />
                </ProtectedRoute>
              }
            />

            <Route
              path="/edit-project/:projectId"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <EditProject />
                </ProtectedRoute>
              }
            />

            <Route
              path="/projects/:projectId/edit"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <EditProject />
                </ProtectedRoute>
              }
            />

            <Route
              path="/project"
              element={
                <ProtectedRoute
                  allowedRoles={["student", "instructor", "employer", "admin"]}
                >
                  <ProjectPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/explore-instructors"
              element={
                <ProtectedRoute allowedRoles={["student", "instructor", "admin"]}>
                  <ExploreInstructors />
                </ProtectedRoute>
              }
            />

            <Route
              path="/explore-projects"
              element={
                <ProtectedRoute
                  allowedRoles={["student", "instructor", "employer", "admin"]}
                >
                  <ExploreProjects />
                </ProtectedRoute>
              }
            />

            <Route
              path="/explore-portfolio"
              element={
                <ProtectedRoute
                  allowedRoles={["student", "instructor", "employer", "admin"]}
                >
                  <ExplorePortfolios />
                </ProtectedRoute>
              }
            />

            <Route
              path="/edit-internship/:internshipId"
              element={
                <ProtectedRoute allowedRoles={["employer"]}>
                  <EditInternship />
                </ProtectedRoute>
              }
            />

            <Route
              path="/forgot-password"
              element={
                <ForgotPassword
                  users={users}
                  setCurrentUser={setCurrentUser}
                />
              }
            />
          </Routes>
        </UserProfileProvider>
      </NotificationsProvider>
    </BrowserRouter>
  );
}