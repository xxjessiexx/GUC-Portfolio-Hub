import { useState } from "react";

import AuthLayout from "../components/auth/AuthLayout";
import AuthHeader from "../components/auth/AuthHeader";
import AuthInput from "../components/auth/AuthInput";
import AuthSubmitButton from "../components/auth/AuthSubmitButton";
import AuthBottomLink from "../components/auth/AuthBottomLink";

import { useNavigate } from "react-router-dom";

import { Mail } from "lucide-react";

export default function ForgotPassword({ users = [] }) {
  const [email, setEmail] = useState(
    sessionStorage.getItem("resetEmail") || ""
  );

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    const savedUsers = JSON.parse(sessionStorage.getItem("users")) || [];

    const allUsers = [
      ...users,
      ...savedUsers,
      {
        id: "admin-demo-1",
        name: "Nadine Amin",
        email: "admin@guc.edu.eg",
        password: "123456",
        role: "admin",
        title: "Platform Administrator",
        bio: "Responsible for verifying employers, managing users and courses, reviewing flags and appeals, and monitoring platform usage.",
        avatar: "",
      },
    ];

    const foundUser = allUsers.find(
      (user) =>
        user.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (foundUser) {
      sessionStorage.setItem("resetEmail", foundUser.email);
      navigate("/VerifyOTP");
    } else {
      setErrors({
        email:
          "Invalid email, make sure you are registered or enter a valid email address",
      });
    }
  };

  return (
    <AuthLayout>
      <AuthHeader
        badge="Student Portfolio Platform"
        title="Forgot"
        highlightedWord="Password"
        description="Enter your email and we’ll send you a reset link"
        showBrand={true}
      />

      <form onSubmit={handleSubmit}>
        <AuthInput
          label="Email"
          type="email"
          required
          icon={Mail}
          value={email}
          placeholder="name@student.guc.edu.eg"
          error={errors.email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="mt-6">
          <AuthSubmitButton
            text="Send Reset Link"
            className="mt-6 space-y-4"
          >
            Send
          </AuthSubmitButton>
        </div>
      </form>

      <AuthBottomLink
        backLabel="Back to login"
        backTo="/login"
      />
    </AuthLayout>
  );
}