import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import FloatingCTA from "./components/ui/FloatingCTA";
import { useState, useEffect } from "react";

export default function App() {

  const [users, setUsers] = useState([]);

  const addUser = (user) => {
    setUsers((prev) => [...prev, user]);
  };
  useEffect(() => {
  console.log("Users array:", users);
}, [users]);
  return (
    <BrowserRouter>
      <FloatingCTA />

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login users={users}/>} />
        <Route path="/register" element={<Register addUser={addUser}/>} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

