import { useState } from "react";

import AuthLayout from "@/components/auth/AuthLayout";
import AuthHeader from "@/components/auth/AuthHeader";
import AuthInput from "@/components/auth/AuthInput";
import AuthSubmitButton from "@/components/auth/AuthSubmitButton";
import AuthBottomLink from "@/components/auth/AuthBottomLink";

import { useNavigate, useLocation } from "react-router-dom";

import { Lock } from "lucide-react";
import { easeOutExpo, tapScale } from "@/lib/motionVariants";

export default function SetPassword({ users = [], setUsers }) {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [newpassword, setnewPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmpassword, setconfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || sessionStorage.getItem("resetEmail");

  const validate = () => {
    const newErrors = {};

    if (!newpassword.trim()) newErrors.password = "Password is required";
    else if (newpassword.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (!confirmpassword.trim())
      newErrors.confirmpassword = "Password is required";

    if (confirmpassword !== newpassword) {
      newErrors.confirmpassword = "Passwords do not match";
    }

    if (!email) {
      newErrors.password = "Reset email was not found. Please try again.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) return;

    let updatedUsers = users.map((user) => {
      if (user.email.toLowerCase() === email.toLowerCase()) {
        return {
          ...user,
          password: newpassword,
        };
      }

      return user;
    });

    const userExists = updatedUsers.some(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );

    if (!userExists && email.toLowerCase() === "admin@guc.edu.eg") {
      updatedUsers = [
        ...updatedUsers,
        {
          id: "admin-demo-1",
          name: "Nadine Amin",
          email: "admin@guc.edu.eg",
          password: newpassword,
          role: "admin",
          title: "Platform Administrator",
          bio: "Responsible for verifying employers, managing users and courses, reviewing flags and appeals, and monitoring platform usage.",
          avatar: "",
        },
      ];
    }

    setUsers(updatedUsers);
    sessionStorage.setItem("users", JSON.stringify(updatedUsers));
    sessionStorage.removeItem("resetEmail");

    navigate("/login");
  };

  return (
    <AuthLayout>
      <AuthHeader
        showBrand
        badge="Student Portfolio Platform"
        title="Set a new"
        highlightedWord="password"
        description="Set a new password to be able to access your account"
      />

      <form className="space-y-7" onSubmit={handleSubmit}>
        <AuthInput
          label="New Password"
          icon={Lock}
          type="password"
          enableToggle
          showPassword={showNewPassword}
          setShowPassword={setShowNewPassword}
          tapScale={tapScale}
          required
          easeOutExpo={easeOutExpo}
          value={newpassword}
          error={errors.password}
          placeholder="••••••••"
          onChange={(e) => setnewPassword(e.target.value)}
        />

        <AuthInput
          label="Confirm Password"
          icon={Lock}
          type="password"
          enableToggle
          showPassword={showConfirmPassword}
          setShowPassword={setShowConfirmPassword}
          tapScale={tapScale}
          required
          easeOutExpo={easeOutExpo}
          value={confirmpassword}
          error={errors.confirmpassword}
          placeholder="••••••••"
          onChange={(e) => setconfirmPassword(e.target.value)}
        />

        <AuthSubmitButton>Reset Password</AuthSubmitButton>
      </form>

      <AuthBottomLink backLabel="Back to login" backTo="/login" />
    </AuthLayout>
  );
}