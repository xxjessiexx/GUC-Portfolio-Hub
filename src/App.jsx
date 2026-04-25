import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

export default function App() {
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const handleMouseMove = (event) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 70;
      const y = (event.clientY / window.innerHeight - 0.5) * 70;

      document.documentElement.style.setProperty("--mouse-x", `${x}px`);
      document.documentElement.style.setProperty("--mouse-y", `${y}px`);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const validate = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!email.endsWith("@guc.edu.eg")) {
      newErrors.email = "Please use your GUC email address";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (validate()) {
      console.log("Login form valid", { email, password });
      alert("Login form is valid!");
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#F7F8F0_0%,#EAF4FA_45%,#D8ECF8_100%)] p-6 text-[#102630]">
      {/* Background blobs */}
      <div className="pointer-events-none fixed -left-28 -top-36 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,#9CD5FF_0%,rgba(122,170,206,0.28)_55%,transparent_72%)] blur-3xl transition-transform duration-300 ease-out [transform:translate(var(--mouse-x),var(--mouse-y))]" />

      <div className="pointer-events-none fixed -bottom-52 -right-44 h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,rgba(122,170,206,0.58)_0%,rgba(230,199,123,0.14)_52%,transparent_72%)] blur-3xl transition-transform duration-300 ease-out [transform:translate(calc(var(--mouse-x)*-1),calc(var(--mouse-y)*-1))]" />

      <Card className="relative z-10 w-full max-w-[610px] overflow-hidden rounded-[34px] border border-white/80 bg-white/65 shadow-[0_34px_100px_rgba(36,57,73,0.22)] backdrop-blur-2xl">
        {/* Gold premium overlay */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.75),transparent_36%),radial-gradient(circle_at_top_right,rgba(230,199,123,0.13),transparent_34%)]" />

        <CardContent className="relative z-10 px-16 py-12 max-sm:px-7 max-sm:py-9">
          {/* Brand */}
          <div className="mb-8 flex items-center justify-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl border border-white/80 bg-[#9CD5FF]/35 shadow-[0_14px_28px_rgba(53,88,114,0.18),0_0_0_6px_rgba(156,213,255,0.16)]">
              <GraduationCap className="h-8 w-8 text-[#355872]" />
            </div>

            <h2 className="text-2xl font-extrabold tracking-tight text-[#2C3947] max-sm:text-xl">
              GUC Portfolio Hub
            </h2>
          </div>

          {/* Header */}
          <div className="mb-10 text-center">
            <span className="mb-5 inline-flex rounded-full border border-[#9CD5FF]/60 bg-[#9CD5FF]/25 px-4 py-2 text-sm font-bold text-[#355872]">
              Student Portfolio Platform
            </span>

            <h1 className="mb-4 text-5xl font-black tracking-[-0.06em] text-[#102630] max-sm:text-4xl">
              Welcome{" "}
              <span className="relative text-[#355872] after:absolute after:-bottom-2 after:left-1 after:h-1 after:w-full after:rounded-full after:bg-[linear-gradient(90deg,#E6C77B,transparent)]">
                Back
              </span>
            </h1>

            <p className="mx-auto max-w-[410px] text-base leading-7 text-[#7B8794]">
              Sign in to manage your projects, achievements, and academic profile.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-7" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="space-y-3">
              <Label className="font-bold text-[#2C3947]">Email Address</Label>

              <div
                className={`flex h-14 items-center gap-3 rounded-2xl bg-white/75 px-4 shadow-[0_12px_30px_rgba(53,88,114,0.08)] transition focus-within:ring-4 ${
                  errors.email
                    ? "border border-red-400 focus-within:ring-red-200"
                    : "border border-[#355872]/15 focus-within:border-[#E6C77B] focus-within:ring-[#E6C77B]/15"
                }`}
              >
                <Mail className="h-5 w-5 text-[#355872]" />

                <Input
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setErrors((prev) => ({ ...prev, email: "" }));
                  }}
                  placeholder="your-email@guc.edu.eg"
                  className="border-0 bg-transparent shadow-none focus-visible:ring-0"
                />
              </div>

              {errors.email && (
                <p className="text-sm font-semibold text-red-500">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="font-bold text-[#2C3947]">Password</Label>

                <a
                  href="#"
                  className="text-sm font-bold text-[#355872] hover:text-[#7AAACE]"
                >
                  Forgot password?
                </a>
              </div>

              <div
                className={`flex h-14 items-center gap-3 rounded-2xl bg-white/75 px-4 shadow-[0_12px_30px_rgba(53,88,114,0.08)] transition focus-within:ring-4 ${
                  errors.password
                    ? "border border-red-400 focus-within:ring-red-200"
                    : "border border-[#355872]/15 focus-within:border-[#E6C77B] focus-within:ring-[#E6C77B]/15"
                }`}
              >
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
              </div>

              {errors.password && (
                <p className="text-sm font-semibold text-red-500">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Button */}
            <Button
              type="submit"
              className="h-16 w-full rounded-2xl bg-[linear-gradient(135deg,#2C3947,#355872_45%,#7AAACE)] text-xl font-extrabold text-white shadow-[0_20px_38px_rgba(53,88,114,0.32)] transition hover:-translate-y-1 hover:opacity-95 hover:shadow-[0_28px_48px_rgba(53,88,114,0.36),0_10px_32px_rgba(230,199,123,0.24)]"
            >
              Sign In
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
          </form>

          {/* OR Divider */}
          <div className="my-8 flex items-center gap-4 font-semibold text-[#7B8794]">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#7AAACE]/30 to-transparent" />
            <span>OR</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#7AAACE]/30 to-transparent" />
          </div>

          {/* Footer */}
          <p className="text-center text-lg font-semibold text-[#102630]">
            Don’t have an account?
            <a
              href="#"
              className="ml-4 font-extrabold text-[#7AAACE] hover:text-[#355872]"
            >
              Sign Up
            </a>
          </p>

          <a
            href="#"
            className="mx-auto mt-7 flex w-fit items-center gap-2 font-bold text-[#7B8794] hover:text-[#355872]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </a>
        </CardContent>
      </Card>
    </main>
  );
}