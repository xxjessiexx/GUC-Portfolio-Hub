import { useState } from "react";

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

import {
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
    verificationDocument: "",
  });

  const [errors, setErrors] = useState({});

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
      role === "student" &&
      !form.email.endsWith("@student.guc.edu.eg")
    ) {
      newErrors.email = "Please use your GUC student email address";
    } else if (role === "instructor" && !form.email.endsWith("@guc.edu.eg")) {
      newErrors.email = "Please use your GUC instructor email address";
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
      if (!form.department.trim())
        newErrors.department = "Department is required";
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

  const emailPlaceholder =
    role === "employer"
      ? "name@company.com"
      : role === "student"
      ? "name@student.guc.edu.eg"
      : "name@guc.edu.eg";

  return (
    <AuthLayout
      maxWidth="max-w-[760px]"
      contentClassName="px-12 py-10 max-sm:px-6"
    >
      <AuthHeader
        badge="Join GUC Portfolio Hub"
        title="Create your"
        highlightedWord="Account"
        description="Choose your role to personalize your registration flow."
      />

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

              <h3 className="font-black text-[#102630]">{option.title}</h3>

              <p className="mt-2 text-sm leading-6 text-[#7B8794]">
                {option.description}
              </p>
            </button>
          );
        })}
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid gap-5 md:grid-cols-2">
          <AuthInput
            label="Full Name"
            icon={User}
            value={form.fullName}
            error={errors.fullName}
            placeholder="Your full name"
            onChange={(e) => updateField("fullName", e.target.value)}
          />

          <AuthInput
            label="Email"
            icon={Mail}
            type="email"
            value={form.email}
            error={errors.email}
            placeholder={emailPlaceholder}
            onChange={(e) => updateField("email", e.target.value)}
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <AuthField error={errors.password}>
            <Label className="font-bold text-[#2C3947]">Password</Label>

            <AuthInputWrap error={errors.password}>
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
            </AuthInputWrap>
          </AuthField>

          <AuthInput
            label="Confirm Password"
            icon={Lock}
            type={showPassword ? "text" : "password"}
            value={form.confirmPassword}
            error={errors.confirmPassword}
            placeholder="••••••••"
            onChange={(e) => updateField("confirmPassword", e.target.value)}
          />
        </div>

        {role === "student" && (
          <div className="grid gap-5 md:grid-cols-2">
            <AuthInput
              label="Faculty"
              icon={GraduationCap}
              value={form.faculty}
              error={errors.faculty}
              placeholder="MET / IET / EMS..."
              onChange={(e) => updateField("faculty", e.target.value)}
            />

            <AuthInput
              label="Semester"
              icon={GraduationCap}
              value={form.semester}
              error={errors.semester}
              placeholder="6"
              onChange={(e) => updateField("semester", e.target.value)}
            />
          </div>
        )}

        {role === "instructor" && (
          <AuthInput
            label="Department"
            icon={Building2}
            value={form.department}
            error={errors.department}
            placeholder="Software Engineering"
            onChange={(e) => updateField("department", e.target.value)}
          />
        )}

        {role === "employer" && (
          <>
            <div className="grid gap-5 md:grid-cols-2">
              <AuthInput
                label="Company Name"
                icon={Building2}
                value={form.companyName}
                error={errors.companyName}
                placeholder="TechVista"
                onChange={(e) => updateField("companyName", e.target.value)}
              />

              <AuthInput
                label="Industry"
                icon={Briefcase}
                value={form.industry}
                error={errors.industry}
                placeholder="Software / FinTech / AI..."
                onChange={(e) => updateField("industry", e.target.value)}
              />
            </div>

            <AuthInput
              label="Company Verification Document"
              icon={Briefcase}
              type="file"
              error={errors.verificationDocument}
              onChange={(e) =>
                updateField(
                  "verificationDocument",
                  e.target.files?.[0]?.name || ""
                )
              }
              className="file:mr-4 file:rounded-xl file:border-0 file:bg-[#9CD5FF]/30 file:px-4 file:py-2 file:font-bold file:text-[#355872]"
            />
          </>
        )}

        <AuthSubmitButton>Create Account</AuthSubmitButton>
      </form>

      <AuthDivider />

      <AuthBottomLink
        text="Already have an account?"
        linkText="Sign In"
        to="/login"
      />
    </AuthLayout>
  );
}