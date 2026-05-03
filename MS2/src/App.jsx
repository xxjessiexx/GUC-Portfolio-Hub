import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import VerifyOTP from "./pages/VerifyOTP";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import ForgotPassword from "./pages/forgot-password";
import EditProfile from "./pages/EditProfile";
import FloatingCTA from "./components/ui/FloatingCTA";
import CreateNewProject from "./pages/CreateNewProject";
import SetPassword from "./pages/SetPassword"

import { UserProfileProvider } from "./context/UserProfileContext";

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
      <UserProfileProvider currentUser={currentUser}>
        <FloatingCTA />

        <Routes>
          <Route path="/" element={<Landing />} />

          <Route path="/verifyOTP" element={<VerifyOTP />} />
          <Route path="/SetPassword" element={<SetPassword users={users}
                                      setUsers={setUsers}
                                      setCurrentUser={setCurrentUser} />} />

          <Route
            path="/login"
            element={<Login users={users} setCurrentUser={setCurrentUser} />}
          />

          <Route
            path="/register"
            element={<Register addUser={addUser} />}
          />

          <Route path="/student-dashboard" element={<StudentDashboard />} />

          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/create-project" element={<CreateNewProject />} />
          <Route path="/forgot-password" element={<ForgotPassword users={users} setCurrentUser={setCurrentUser}/>} />
        </Routes>
      </UserProfileProvider>
    </BrowserRouter>
  );
}
