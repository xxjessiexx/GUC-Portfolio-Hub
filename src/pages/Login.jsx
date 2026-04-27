import { useState } from "react";
import { Link } from "react-router-dom";

import AuthLayout from "@/components/auth/AuthLayout";
import AuthHeader from "@/components/auth/AuthHeader";
import AuthInput from "@/components/auth/AuthInput";
import AuthField from "@/components/auth/AuthField";
import AuthInputWrap from "@/components/auth/AuthInputWrap";
import AuthSubmitButton from "@/components/auth/AuthSubmitButton";
import AuthDivider from "@/components/auth/AuthDivider";
import AuthBottomLink from "@/components/auth/AuthBottomLink";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!email.trim()) newErrors.email = "Email is required";
    else if (!email.endsWith("@student.guc.edu.eg"))
      newErrors.email = "Please use your GUC email address";

    if (!password.trim()) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (validate()) {
      window.location.href = "/student-dashboard";
    }
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

        <AuthField error={errors.password}>
          <div className="flex items-center justify-between">
            <Label className="font-bold text-[#2C3947]">Password</Label>

            <Link
              to="/forgot-password"
              className="text-sm font-bold text-[#355872] hover:text-[#7AAACE]"
            >
              Forgot password?
            </Link>
          </div>

          <AuthInputWrap error={errors.password}>
            <Lock className="h-5 w-5 text-[#355872]" />

            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setErrors((prev) => ({ ...prev, password: "" }));
              }}
              placeholder="••••••••"
              className="border-0 bg-transparent shadow-none focus-visible:ring-0"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-[#7B8794] hover:text-[#355872]"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </AuthInputWrap>
        </AuthField>

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