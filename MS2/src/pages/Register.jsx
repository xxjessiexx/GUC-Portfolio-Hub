import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import AuthLayout from "@/components/auth/AuthLayout";
import AuthHeader from "@/components/auth/AuthHeader";
import AuthInput from "@/components/auth/AuthInput";
import AuthSubmitButton from "@/components/auth/AuthSubmitButton";
import AuthDivider from "@/components/auth/AuthDivider";
import AuthBottomLink from "@/components/auth/AuthBottomLink";

import { useNavigate } from "react-router-dom";



import {
  Briefcase,
  Building2,
  GraduationCap,
  Lock,
  Mail,
  User,
} from "lucide-react";
import { easeOutExpo, tapScale } from "@/lib/motionVariants";


export default function Register({ addUser }) {
  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

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

    if (!validate()) return;

    const newUser = {
      name: form.fullName.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
      role,
      faculty: form.faculty || "",
      major: "Computer Science",
      semester: form.semester || "1",
      department: form.department || "",
      companyName: form.companyName || "",
      industry: form.industry || "",
      image: null,
      bio: "Passionate about building impactful digital solutions.",
    };

    try {
      if (typeof addUser !== "function") {
        throw new Error("Registration is not connected correctly. Please check the /register route in App.jsx.");
      }

      addUser(newUser);

      toast.success(
        role === "employer"
          ? "Employer registration submitted for admin approval!"
          : "Account created successfully!",
        {
          className:
            "!border-white/10 !bg-[linear-gradient(135deg,var(--dark),var(--primary))] !text-white !shadow-[0_18px_55px_rgba(44,57,71,0.22)]",
          descriptionClassName: "!text-white/70",
        }
      );

      sessionStorage.setItem("lastRegisteredRole", role);
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(error?.message || "Could not create account. Please try again.", {
        className:
          "!border-white/10 !bg-[linear-gradient(135deg,var(--dark),var(--primary))] !text-white !shadow-[0_18px_55px_rgba(44,57,71,0.22)]",
        descriptionClassName: "!text-white/70",
      });
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

      {/* ROLE SELECTION */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        {roleOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = role === option.id;

          return (
            <motion.button
              key={option.id}
              type="button"
              whileHover={{ y: -4 }}
              whileTap={tapScale}
              transition={{ duration: 0.22, ease: easeOutExpo }}
              onClick={() => {
                setRole(option.id);
                setErrors({});
              }}
              className={`rounded-3xl border p-5 text-left transition hover:-translate-y-1 ${
                isSelected
                  ? "border-[color:var(--gold)] bg-[color:var(--accent)]/25 shadow-[0_18px_40px_rgba(53,88,114,0.16)]"
                  : "border-white/80 bg-white/55 hover:border-[color:var(--secondary)]/50"
              }`}
            >
              <Icon className="mb-4 h-7 w-7 text-[color:var(--primary)]" />

              <h3 className="font-black text-[color:var(--ink)]">
                {option.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                {option.description}
              </p>
            </motion.button>
          );
        })}
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid gap-5 md:grid-cols-2">
          <AuthInput
            label="Full Name"
            required
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
            required
            error={errors.email}
            placeholder={emailPlaceholder}
            onChange={(e) => updateField("email", e.target.value)}
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <AuthInput
          label="Password"
          icon={Lock}
          type="password"
          enableToggle
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          tapScale={tapScale}
          required
          easeOutExpo={easeOutExpo}
          value={form.password}
          error={errors.password}
          placeholder="••••••••"
          onChange={(e) => updateField("password", e.target.value)}
        />

        <AuthInput
            label="Confirm Password"
            icon={Lock}
            type="password"
            enableToggle
            required
            showPassword={showConfirmPassword}
            setShowPassword={setShowConfirmPassword}
            tapScale={tapScale}
            easeOutExpo={easeOutExpo}
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
              required
              icon={GraduationCap}
              value={form.faculty}
              error={errors.faculty}
              placeholder="MET / IET / EMS..."
              onChange={(e) => updateField("faculty", e.target.value)}
            />

            <AuthInput
              label="Semester"
              required
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
              className="file:mr-4 file:rounded-xl file:border-0 file:bg-[color:var(--accent)]/30 file:px-4 file:py-2 file:font-bold file:text-[color:var(--primary)]"
            />
          </>
        )}

        <AuthSubmitButton  >Create Account</AuthSubmitButton>
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