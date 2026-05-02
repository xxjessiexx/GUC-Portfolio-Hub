import { useState } from "react";

import AuthLayout from "@/components/auth/AuthLayout";
import AuthHeader from "@/components/auth/AuthHeader";
import AuthInput from "@/components/auth/AuthInput";
import AuthSubmitButton from "@/components/auth/AuthSubmitButton";
import AuthDivider from "@/components/auth/AuthDivider";
import AuthBottomLink from "@/components/auth/AuthBottomLink";



import { Mail, Lock }from "lucide-react";
import { easeOutExpo, tapScale } from "@/lib/motionVariants";

export default function Login({users}) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!email.trim()) newErrors.email = "Email is required";
   // else if (!email.endsWith("@student.guc.edu.eg")) 
   // newErrors.email = "Please use your GUC email address";
   // else if(!email.endsWith("@guc.edu.eg"))
    if (!password.trim()) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (!validate()) return;
    const foundUser = users.find(
    (user) => user.email === email && user.password === password
    );
    if (foundUser) {
    window.location.href = "/student-dashboard";
  } else {
    setErrors({
      email: "",
      password: "Invalid email or password",
    });
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
                  onChange={(e) => setPassword(e.target.value)}
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