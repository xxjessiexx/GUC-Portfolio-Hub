import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthLayout from "@/components/auth/AuthLayout";
import AuthHeader from "@/components/auth/AuthHeader";
import AuthInput from "@/components/auth/AuthInput";
import AuthSubmitButton from "@/components/auth/AuthSubmitButton";
import AuthDivider from "@/components/auth/AuthDivider";
import AuthBottomLink from "@/components/auth/AuthBottomLink";

import { Mail, Lock } from "lucide-react";
import { easeOutExpo, tapScale } from "@/lib/motionVariants";
import { demoUsers } from "@/data/DemoUsers";
import { getDashboardRouteByRole, normalizeUserRole } from "@/utils/roleRoutes";

function findUserByCredentials(users, email, password) {
  const normalizedEmail = email.trim().toLowerCase();
  const registeredUsers = Array.isArray(users) ? users : [];
  const sessionUsers = JSON.parse(sessionStorage.getItem("users") || "[]");

  const allUsers = [...demoUsers, ...registeredUsers, ...sessionUsers];

  return allUsers.find(
    (user) =>
      user.email?.trim().toLowerCase() === normalizedEmail &&
      user.password === password
  );
}

export default function Login({ users, setCurrentUser }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!email.trim()) newErrors.email = "Email is required";

    if (!password.trim()) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) return;

    const foundUser = findUserByCredentials(users, email, password);

    if (!foundUser) {
      setErrors({
        email: "",
        password: "Invalid email or password",
      });
      return;
    }

    const role = normalizeUserRole(
  foundUser.role ||
    foundUser.accountRole ||
    foundUser.systemRole ||
    foundUser.userType ||
    "student"
);
    const normalizedUser = {
      ...foundUser,
      role,
      systemRole: role,
      accountRole: role,
    };

    sessionStorage.setItem("currentUser", JSON.stringify(normalizedUser));
    setCurrentUser(normalizedUser);
    navigate(getDashboardRouteByRole(role));
  };

  return (
    <AuthLayout>
      <AuthHeader
        showBrand
        badge="Student Portfolio Platform"
        title="Welcome"
        highlightedWord="Back"
        description="Sign in to manage your projects, achievements, and academic profile."
      />

      <form className="space-y-7" onSubmit={handleSubmit}>
        <AuthInput
          label="Email Address"
          required
          icon={Mail}
          type="email"
          value={email}
          error={errors.email}
          placeholder="your-email@student.guc.edu.eg"
          onChange={(event) => {
            setEmail(event.target.value);
            setErrors((prev) => ({ ...prev, email: "" }));
          }}
        />

        <AuthInput
          label="Password"
          icon={Lock}
          type="password"
          forgotPassword
          enableToggle
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          tapScale={tapScale}
          required
          easeOutExpo={easeOutExpo}
          value={password}
          error={errors.password}
          placeholder="••••••••"
          onChange={(event) => {
            setPassword(event.target.value);
            setErrors((prev) => ({ ...prev, password: "" }));
          }}
        />

        <AuthSubmitButton>Sign In</AuthSubmitButton>
      </form>

      <AuthDivider />

      <AuthBottomLink
        text="Don’t have an account?"
        linkText="Sign Up"
        to="/register"
      />
    </AuthLayout>
  );
}
