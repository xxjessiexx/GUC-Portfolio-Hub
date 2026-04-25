import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useSpring } from "framer-motion";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Building2,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Mail,
  User,
} from "lucide-react";

export default function Register() {
  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    faculty: "",
    semester: "",
    department: "",
    companyName: "",
    industry: "",
    companyWebsite: "",
    verificationDocument: "",
  });

  const [errors, setErrors] = useState({});

  const blobOneX = useSpring(0, { stiffness: 45, damping: 18 });
  const blobOneY = useSpring(0, { stiffness: 45, damping: 18 });
  const blobTwoX = useSpring(0, { stiffness: 35, damping: 20 });
  const blobTwoY = useSpring(0, { stiffness: 35, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 90;
      const y = (event.clientY / window.innerHeight - 0.5) * 90;

      blobOneX.set(x);
      blobOneY.set(y);
      blobTwoX.set(-x);
      blobTwoY.set(-y);
    };

    globalThis.addEventListener("mousemove", handleMouseMove);
    return () => globalThis.removeEventListener("mousemove", handleMouseMove);
  }, [blobOneX, blobOneY, blobTwoX, blobTwoY]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      (role === "student" || role === "instructor") &&
      !form.email.endsWith("@guc.edu.eg") &&
      !form.email.endsWith("@student.guc.edu.eg")
    ) {
      newErrors.email = "Please use a valid GUC email address";
    } else if (role === "employer" && !/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Please enter a valid company email";
    }

    if (!form.password.trim()) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (form.confirmPassword !== form.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (role === "student") {
      if (!form.faculty.trim()) newErrors.faculty = "Faculty is required";
      if (!form.semester.trim()) newErrors.semester = "Semester is required";
    }

    if (role === "instructor") {
      if (!form.department.trim()) newErrors.department = "Department is required";
    }

    if (role === "employer") {
      if (!form.companyName.trim())
        newErrors.companyName = "Company name is required";
      if (!form.industry.trim()) newErrors.industry = "Industry is required";
      if (!form.verificationDocument)
        newErrors.verificationDocument =
          "Verification document is required for employer approval";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (validate()) {
      alert(
        role === "employer"
          ? "Employer registration submitted for admin approval!"
          : "Registration form is valid!"
      );
    }
  };

  const roleOptions = [
    {
      id: "student",
      title: "Student",
      icon: GraduationCap,
      description: "Create a portfolio and showcase your projects.",
    },
    {
      id: "instructor",
      title: "Instructor",
      icon: User,
      description: "Review projects and manage academic feedback.",
    },
    {
      id: "employer",
      title: "Employer",
      icon: Briefcase,
      description: "Discover student talent and post internships.",
    },
  ];

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#F7F8F0_0%,#EAF4FA_45%,#D8ECF8_100%)] p-6 text-[#102630]">
      <motion.div
        style={{ x: blobOneX, y: blobOneY }}
        className="pointer-events-none fixed -left-28 -top-36 h-[540px] w-[540px] rounded-full bg-[radial-gradient(circle,#9CD5FF_0%,rgba(122,170,206,0.32)_55%,transparent_72%)] blur-3xl"
      />

      <motion.div
        style={{ x: blobTwoX, y: blobTwoY }}
        className="pointer-events-none fixed -bottom-52 -right-44 h-[640px] w-[640px] rounded-full bg-[radial-gradient(circle,rgba(122,170,206,0.62)_0%,rgba(230,199,123,0.16)_52%,transparent_72%)] blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[760px]"
      >
        <Card className="relative overflow-hidden rounded-[34px] border border-white/80 bg-white/65 shadow-[0_34px_100px_rgba(36,57,73,0.22)] backdrop-blur-2xl">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.75),transparent_36%),radial-gradient(circle_at_top_right,rgba(230,199,123,0.13),transparent_34%)]" />

          <CardContent className="relative z-10 px-12 py-10 max-sm:px-6">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl border border-white/80 bg-[#9CD5FF]/35 shadow-[0_14px_28px_rgba(53,88,114,0.18),0_0_0_6px_rgba(156,213,255,0.16)]">
                <GraduationCap className="h-8 w-8 text-[#355872]" />
              </div>

              <span className="mb-4 inline-flex rounded-full border border-[#9CD5FF]/60 bg-[#9CD5FF]/25 px-4 py-2 text-sm font-bold text-[#355872]">
                Join GUC Portfolio Hub
              </span>

              <h1 className="text-5xl font-black tracking-[-0.06em] text-[#102630] max-sm:text-4xl">
                Create your{" "}
                <span className="relative text-[#355872] after:absolute after:-bottom-2 after:left-1 after:h-1 after:w-full after:rounded-full after:bg-[linear-gradient(90deg,#E6C77B,transparent)]">
                  Account
                </span>
              </h1>

              <p className="mx-auto mt-5 max-w-[480px] text-base leading-7 text-[#7B8794]">
                Choose your role to personalize your registration flow.
              </p>
            </div>

            <div className="mb-8 grid gap-4 md:grid-cols-3">
              {roleOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = role === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      setRole(option.id);
                      setErrors({});
                    }}
                    className={`rounded-3xl border p-5 text-left transition hover:-translate-y-1 ${
                      isSelected
                        ? "border-[#E6C77B] bg-[#9CD5FF]/25 shadow-[0_18px_40px_rgba(53,88,114,0.16)]"
                        : "border-white/80 bg-white/55 hover:border-[#7AAACE]/50"
                    }`}
                  >
                    <Icon className="mb-4 h-7 w-7 text-[#355872]" />
                    <h3 className="font-black text-[#102630]">
                      {option.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[#7B8794]">
                      {option.description}
                    </p>
                  </button>
                );
              })}
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid gap-5 md:grid-cols-2">
                <Field error={errors.fullName}>
                  <Label className="font-bold text-[#2C3947]">Full Name</Label>
                  <InputWrap error={errors.fullName}>
                    <User className="h-5 w-5 text-[#355872]" />
                    <Input
                      value={form.fullName}
                      onChange={(e) => updateField("fullName", e.target.value)}
                      placeholder="Your full name"
                      className="border-0 bg-transparent shadow-none focus-visible:ring-0"
                    />
                  </InputWrap>
                </Field>

                <Field error={errors.email}>
                  <Label className="font-bold text-[#2C3947]">Email</Label>
                  <InputWrap error={errors.email}>
                    <Mail className="h-5 w-5 text-[#355872]" />
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      placeholder={
                        role === "employer"
                          ? "name@company.com"
                          : "name@guc.edu.eg"
                      }
                      className="border-0 bg-transparent shadow-none focus-visible:ring-0"
                    />
                  </InputWrap>
                </Field>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <Field error={errors.password}>
                  <Label className="font-bold text-[#2C3947]">Password</Label>
                  <InputWrap error={errors.password}>
                    <Lock className="h-5 w-5 text-[#355872]" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => updateField("password", e.target.value)}
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
                  </InputWrap>
                </Field>

                <Field error={errors.confirmPassword}>
                  <Label className="font-bold text-[#2C3947]">
                    Confirm Password
                  </Label>
                  <InputWrap error={errors.confirmPassword}>
                    <Lock className="h-5 w-5 text-[#355872]" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={(e) =>
                        updateField("confirmPassword", e.target.value)
                      }
                      placeholder="••••••••"
                      className="border-0 bg-transparent shadow-none focus-visible:ring-0"
                    />
                  </InputWrap>
                </Field>
              </div>

              {role === "student" && (
                <div className="grid gap-5 md:grid-cols-2">
                  <Field error={errors.faculty}>
                    <Label className="font-bold text-[#2C3947]">Faculty</Label>
                    <InputWrap error={errors.faculty}>
                      <GraduationCap className="h-5 w-5 text-[#355872]" />
                      <Input
                        value={form.faculty}
                        onChange={(e) => updateField("faculty", e.target.value)}
                        placeholder="MET / IET / EMS..."
                        className="border-0 bg-transparent shadow-none focus-visible:ring-0"
                      />
                    </InputWrap>
                  </Field>

                  <Field error={errors.semester}>
                    <Label className="font-bold text-[#2C3947]">Semester</Label>
                    <InputWrap error={errors.semester}>
                      <GraduationCap className="h-5 w-5 text-[#355872]" />
                      <Input
                        value={form.semester}
                        onChange={(e) =>
                          updateField("semester", e.target.value)
                        }
                        placeholder="6"
                        className="border-0 bg-transparent shadow-none focus-visible:ring-0"
                      />
                    </InputWrap>
                  </Field>
                </div>
              )}

              {role === "instructor" && (
                <Field error={errors.department}>
                  <Label className="font-bold text-[#2C3947]">Department</Label>
                  <InputWrap error={errors.department}>
                    <Building2 className="h-5 w-5 text-[#355872]" />
                    <Input
                      value={form.department}
                      onChange={(e) =>
                        updateField("department", e.target.value)
                      }
                      placeholder="Software Engineering"
                      className="border-0 bg-transparent shadow-none focus-visible:ring-0"
                    />
                  </InputWrap>
                </Field>
              )}

              {role === "employer" && (
                <>
                  <div className="grid gap-5 md:grid-cols-2">
                    <Field error={errors.companyName}>
                      <Label className="font-bold text-[#2C3947]">
                        Company Name
                      </Label>
                      <InputWrap error={errors.companyName}>
                        <Building2 className="h-5 w-5 text-[#355872]" />
                        <Input
                          value={form.companyName}
                          onChange={(e) =>
                            updateField("companyName", e.target.value)
                          }
                          placeholder="TechVista"
                          className="border-0 bg-transparent shadow-none focus-visible:ring-0"
                        />
                      </InputWrap>
                    </Field>

                    <Field error={errors.industry}>
                      <Label className="font-bold text-[#2C3947]">
                        Industry
                      </Label>
                      <InputWrap error={errors.industry}>
                        <Briefcase className="h-5 w-5 text-[#355872]" />
                        <Input
                          value={form.industry}
                          onChange={(e) =>
                            updateField("industry", e.target.value)
                          }
                          placeholder="Software / FinTech / AI..."
                          className="border-0 bg-transparent shadow-none focus-visible:ring-0"
                        />
                      </InputWrap>
                    </Field>
                  </div>

                  <Field error={errors.verificationDocument}>
                    <Label className="font-bold text-[#2C3947]">
                      Company Verification Document
                    </Label>
                    <InputWrap error={errors.verificationDocument}>
                      <Briefcase className="h-5 w-5 text-[#355872]" />
                      <Input
                        type="file"
                        onChange={(e) =>
                          updateField(
                            "verificationDocument",
                            e.target.files?.[0]?.name || ""
                          )
                        }
                        className="border-0 bg-transparent shadow-none file:mr-4 file:rounded-xl file:border-0 file:bg-[#9CD5FF]/30 file:px-4 file:py-2 file:font-bold file:text-[#355872] focus-visible:ring-0"
                      />
                    </InputWrap>
                  </Field>
                </>
              )}

              <Button
                type="submit"
                className="h-16 w-full rounded-2xl bg-[linear-gradient(135deg,#2C3947,#355872_45%,#7AAACE)] text-xl font-extrabold text-white shadow-[0_20px_38px_rgba(53,88,114,0.32)] transition hover:-translate-y-1 hover:opacity-95 hover:shadow-[0_28px_48px_rgba(53,88,114,0.36),0_10px_32px_rgba(230,199,123,0.24)]"
              >
                Create Account
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </form>

            <div className="my-8 flex items-center gap-4 font-semibold text-[#7B8794]">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#7AAACE]/30 to-transparent" />
              <span>OR</span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#7AAACE]/30 to-transparent" />
            </div>

            <p className="text-center text-lg font-semibold text-[#102630]">
              Already have an account?
              <Link
                to="/login"
                className="ml-4 font-extrabold text-[#7AAACE] hover:text-[#355872]"
              >
                Sign In
              </Link>
            </p>

            <Link
              to="/"
              className="mx-auto mt-7 flex w-fit items-center gap-2 font-bold text-[#7B8794] hover:text-[#355872]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
}

function Field({ children, error }) {
  return (
    <div className="space-y-3">
      {children}
      {error && <p className="text-sm font-semibold text-red-500">{error}</p>}
    </div>
  );
}

function InputWrap({ children, error }) {
  return (
    <div
      className={`flex h-14 items-center gap-3 rounded-2xl bg-white/75 px-4 shadow-[0_12px_30px_rgba(53,88,114,0.08)] transition focus-within:ring-4 ${
        error
          ? "border border-red-400 focus-within:ring-red-200"
          : "border border-[#355872]/15 focus-within:border-[#E6C77B] focus-within:ring-[#E6C77B]/15"
      }`}
    >
      {children}
    </div>
  );
}