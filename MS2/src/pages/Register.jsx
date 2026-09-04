import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import AuthLayout from "@/components/auth/AuthLayout";
import AuthHeader from "@/components/auth/AuthHeader";
import AuthInput from "@/components/auth/AuthInput";
import AuthSubmitButton from "@/components/auth/AuthSubmitButton";
import AuthDivider from "@/components/auth/AuthDivider";
import AuthBottomLink from "@/components/auth/AuthBottomLink";
import AppSelect from "@/components/common/AppSelect";

import { useNavigate } from "react-router-dom";

import {
  Briefcase,
  Building2,
  GraduationCap,
  Lock,
  Mail,
  User,
} from "lucide-react";

import {
  easeOutExpo,
  tapScale,
} from "@/lib/motionVariants";

export default function Register({ addUser }) {
  const [role, setRole] = useState("student");

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const navigate = useNavigate();

  const facultyOptions = [
    "Engineering and Technology",
    "Management Technology",
    "Pharmacy and Biotechnology",
    "Applied Sciences and Arts",
    "Law and Legal Studies",
    "Dentistry",
  ];

  const semesterOptions = Array.from(
    { length: 10 },
    (_, index) => String(index + 1)
  );

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
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.fullName.trim()) {
      newErrors.fullName =
        "Full name is required";
    }

    if (!form.email.trim()) {
      newErrors.email =
        "Email is required";
    } else if (
      role === "student" &&
      !form.email.endsWith(
        "@student.guc.edu.eg"
      )
    ) {
      newErrors.email =
        "Please use your GUC student email address";
    } else if (
      role === "instructor" &&
      !form.email.endsWith("@guc.edu.eg")
    ) {
      newErrors.email =
        "Please use your GUC instructor email address";
    } else if (
      role === "employer" &&
      !/\S+@\S+\.\S+/.test(form.email)
    ) {
      newErrors.email =
        "Please enter a valid company email";
    }

    if (!form.password.trim()) {
      newErrors.password =
        "Password is required";
    } else if (
      form.password.length < 6
    ) {
      newErrors.password =
        "Password must be at least 6 characters";
    }

    if (
      form.confirmPassword !==
      form.password
    ) {
      newErrors.confirmPassword =
        "Passwords do not match";
    }

    if (role === "student") {
      if (!form.faculty.trim()) {
        newErrors.faculty =
          "Faculty is required";
      }

      if (!form.semester.trim()) {
        newErrors.semester =
          "Semester is required";
      }
    }

    if (role === "instructor") {
      if (!form.department.trim()) {
        newErrors.department =
          "Department is required";
      }
    }

    if (role === "employer") {
      if (!form.companyName.trim()) {
        newErrors.companyName =
          "Company name is required";
      }

      if (!form.industry.trim()) {
        newErrors.industry =
          "Industry is required";
      }

      if (!form.verificationDocument) {
        newErrors.verificationDocument =
          "Verification document is required for employer approval";
      }
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) return;

    const newUser = {
      name: form.fullName.trim(),
      email: form.email
        .trim()
        .toLowerCase(),
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
      if (
        typeof addUser !== "function"
      ) {
        throw new Error(
          "Registration is not connected correctly. Please check the /register route in App.jsx."
        );
      }

      addUser(newUser);

      toast.success(
        role === "employer"
          ? "Employer registration submitted for admin approval!"
          : "Account created successfully!",
        {
          className:
            "!border-white/10 !bg-[linear-gradient(135deg,var(--dark),var(--primary))] !text-white !shadow-[0_18px_55px_rgba(44,57,71,0.22)]",
          descriptionClassName:
            "!text-white/70",
        }
      );

      sessionStorage.setItem(
        "lastRegisteredRole",
        role
      );

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      toast.error(
        error?.message ||
          "Could not create account. Please try again.",
        {
          className:
            "!border-white/10 !bg-[linear-gradient(135deg,var(--dark),var(--primary))] !text-white !shadow-[0_18px_55px_rgba(44,57,71,0.22)]",
          descriptionClassName:
            "!text-white/70",
        }
      );
    }
  };

  const roleOptions = [
    {
      id: "student",
      label: "Student",
      subtitle: "Academic work",
      icon: GraduationCap,
    },
    {
      id: "instructor",
      label: "Instructor",
      subtitle: "Feedback & review",
      icon: User,
    },
    {
      id: "employer",
      label: "Employer",
      subtitle: "Talent & internships",
      icon: Briefcase,
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
      maxWidth="max-w-[740px]"
      contentClassName="
        px-10
        py-5
        max-sm:px-6
        max-sm:py-6
      "
    >
      {/* ================= HEADER ================= */}

      <AuthHeader
        compact
        badge="Join GUC Portfolio Hub"
        title="Create your"
        highlightedWord="Account"
        description="Set up your account and start building your portfolio."
      />

      {/* ================= ROLE SELECTOR ================= */}

      <div className="mb-5">
        <div
          className="
            grid
            grid-cols-3
            border-b
            border-[#C9DCE8]
          "
        >
          {roleOptions.map((option) => {
            const Icon = option.icon;
            const selected =
              role === option.id;

            return (
              <motion.button
                key={option.id}
                type="button"
                whileTap={tapScale}
                transition={{
                  duration: 0.18,
                  ease: easeOutExpo,
                }}
                onClick={() => {
                  setRole(option.id);
                  setErrors({});
                }}
                className="
                  group
                  relative
                  flex
                  items-center
                  justify-center
                  gap-3
                  px-3
                  pb-3.5
                  pt-1
                  text-left
                "
              >
                <div
                  className={`
                    grid
                    h-9
                    w-9
                    shrink-0
                    place-items-center
                    rounded-full
                    transition-all
                    duration-200

                    ${
                      selected
                        ? `
                          bg-[#29465D]
                          text-white
                          shadow-[0_7px_18px_rgba(44,57,71,0.18)]
                        `
                        : `
                          bg-[#EDF6FB]
                          text-[#72A0BF]
                          group-hover:bg-[#E5F2F9]
                          group-hover:text-[#355872]
                        `
                    }
                  `}
                >
                  <Icon
                    className="
                      h-[15px]
                      w-[15px]
                    "
                  />
                </div>

                <div>
                  <p
                    className={`
                      text-[12px]
                      font-black
                      transition-colors

                      ${
                        selected
                          ? "text-[#102735]"
                          : "text-[#738594] group-hover:text-[#355872]"
                      }
                    `}
                  >
                    {option.label}
                  </p>

                  <p
                    className={`
                      mt-[2px]
                      text-[8px]
                      font-semibold
                      transition-colors

                      ${
                        selected
                          ? "text-[#6594B6]"
                          : "text-[#97A9B5]"
                      }
                    `}
                  >
                    {option.subtitle}
                  </p>
                </div>

                {selected && (
                  <motion.span
                    layoutId="register-role"
                    transition={{
                      duration: 0.23,
                      ease: easeOutExpo,
                    }}
                    className="
                      absolute
                      -bottom-[1px]
                      left-[17%]
                      right-[17%]
                      h-[3px]
                      rounded-t-full
                      bg-[linear-gradient(90deg,#E6C77B_0%,#79B0E3_100%)]
                    "
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ================= FORM ================= */}

      <form
        className="space-y-4"
        onSubmit={handleSubmit}
      >
        {/* ACCOUNT DETAILS */}

        <section>
          <p
            className="
              mb-2.5
              text-[9px]
              font-black
              uppercase
              tracking-[0.17em]
              text-[#6689A4]
            "
          >
            Account details
          </p>

          <div className="space-y-3.5">
            <div className="grid gap-4 md:grid-cols-2">
              <AuthInput
                label="Full Name"
                required
                icon={User}
                value={form.fullName}
                error={errors.fullName}
                placeholder="Your full name"
                onChange={(event) =>
                  updateField(
                    "fullName",
                    event.target.value
                  )
                }
              />

              <AuthInput
                label="Email"
                icon={Mail}
                type="email"
                value={form.email}
                required
                error={errors.email}
                placeholder={
                  emailPlaceholder
                }
                onChange={(event) =>
                  updateField(
                    "email",
                    event.target.value
                  )
                }
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <AuthInput
                label="Password"
                icon={Lock}
                type="password"
                enableToggle
                showPassword={showPassword}
                setShowPassword={
                  setShowPassword
                }
                tapScale={tapScale}
                required
                easeOutExpo={easeOutExpo}
                value={form.password}
                error={errors.password}
                placeholder="••••••••"
                onChange={(event) =>
                  updateField(
                    "password",
                    event.target.value
                  )
                }
              />

              <AuthInput
                label="Confirm Password"
                icon={Lock}
                type="password"
                enableToggle
                required
                showPassword={
                  showConfirmPassword
                }
                setShowPassword={
                  setShowConfirmPassword
                }
                tapScale={tapScale}
                easeOutExpo={
                  easeOutExpo
                }
                value={
                  form.confirmPassword
                }
                error={
                  errors.confirmPassword
                }
                placeholder="••••••••"
                onChange={(event) =>
                  updateField(
                    "confirmPassword",
                    event.target.value
                  )
                }
              />
            </div>
          </div>
        </section>

        {/* ================= STUDENT ================= */}

        {role === "student" && (
          <motion.section
            key="student-fields"
            initial={{
              opacity: 0,
              y: 4,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.2,
            }}
          >
            <p
              className="
                mb-2.5
                text-[9px]
                font-black
                uppercase
                tracking-[0.17em]
                text-[#6689A4]
              "
            >
              GUC details
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label
                  className="
                    mb-1.5
                    block
                    text-sm
                    font-black
                    text-[color:var(--dark)]
                  "
                >
                  Faculty{" "}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <AppSelect
                  value={form.faculty}
                  onValueChange={(value) =>
                    updateField(
                      "faculty",
                      value
                    )
                  }
                  options={facultyOptions}
                  placeholder="Select faculty"
                />

                {errors.faculty && (
                  <p
                    className="
                      mt-1.5
                      text-xs
                      font-semibold
                      text-red-500
                    "
                  >
                    {errors.faculty}
                  </p>
                )}
              </div>

              <div>
                <label
                  className="
                    mb-1.5
                    block
                    text-sm
                    font-black
                    text-[color:var(--dark)]
                  "
                >
                  Semester{" "}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <AppSelect
                  value={form.semester}
                  onValueChange={(value) =>
                    updateField(
                      "semester",
                      value
                    )
                  }
                  options={
                    semesterOptions
                  }
                  placeholder="Select semester"
                />

                {errors.semester && (
                  <p
                    className="
                      mt-1.5
                      text-xs
                      font-semibold
                      text-red-500
                    "
                  >
                    {errors.semester}
                  </p>
                )}
              </div>
            </div>
          </motion.section>
        )}

        {/* ================= INSTRUCTOR ================= */}

        {role === "instructor" && (
          <motion.section
            key="instructor-fields"
            initial={{
              opacity: 0,
              y: 4,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.2,
            }}
          >
            <p
              className="
                mb-2.5
                text-[9px]
                font-black
                uppercase
                tracking-[0.17em]
                text-[#6689A4]
              "
            >
              GUC details
            </p>

            <AuthInput
              label="Department"
              icon={Building2}
              value={form.department}
              error={errors.department}
              placeholder="Software Engineering"
              onChange={(event) =>
                updateField(
                  "department",
                  event.target.value
                )
              }
            />
          </motion.section>
        )}

        {/* ================= EMPLOYER ================= */}

        {role === "employer" && (
          <motion.section
            key="employer-fields"
            initial={{
              opacity: 0,
              y: 4,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.2,
            }}
          >
            <p
              className="
                mb-2.5
                text-[9px]
                font-black
                uppercase
                tracking-[0.17em]
                text-[#6689A4]
              "
            >
              Company details
            </p>

            <div className="space-y-3.5">
              <div className="grid gap-4 md:grid-cols-2">
                <AuthInput
                  label="Company Name"
                  icon={Building2}
                  value={
                    form.companyName
                  }
                  error={
                    errors.companyName
                  }
                  placeholder="TechVista"
                  onChange={(event) =>
                    updateField(
                      "companyName",
                      event.target.value
                    )
                  }
                />

                <AuthInput
                  label="Industry"
                  icon={Briefcase}
                  value={
                    form.industry
                  }
                  error={
                    errors.industry
                  }
                  placeholder="Software / FinTech / AI..."
                  onChange={(event) =>
                    updateField(
                      "industry",
                      event.target.value
                    )
                  }
                />
              </div>

              <div>
                <label
                  className="
                    mb-1.5
                    block
                    text-sm
                    font-black
                    text-[color:var(--dark)]
                  "
                >
                  Company Verification
                  Document
                </label>

                <label
                  htmlFor="verificationDocument"
                  className="
                    group
                    flex
                    h-14
                    w-full
                    cursor-pointer
                    items-center
                    rounded-2xl
                    border
                    border-[color:var(--border-blue)]
                    bg-white/70
                    px-4
                    transition
                    hover:border-[color:var(--secondary)]/60
                  "
                >
                  <Briefcase
                    className="
                      mr-4
                      h-[18px]
                      w-[18px]
                      shrink-0
                      text-[color:var(--primary)]
                    "
                  />

                  <span
                    className="
                      flex
                      h-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-gray-100
                      px-4
                      text-xs
                      font-bold
                      text-[color:var(--primary)]
                      transition
                      group-hover:bg-gray-200
                    "
                  >
                    Choose File
                  </span>

                  <span
                    className="
                      ml-3
                      truncate
                      text-xs
                      font-medium
                      text-[color:var(--muted)]
                    "
                  >
                    {form.verificationDocument ||
                      "No file chosen"}
                  </span>

                  <input
                    id="verificationDocument"
                    type="file"
                    className="hidden"
                    onChange={(event) =>
                      updateField(
                        "verificationDocument",
                        event.target.files?.[0]
                          ?.name || ""
                      )
                    }
                  />
                </label>

                {errors.verificationDocument && (
                  <p
                    className="
                      mt-1.5
                      text-xs
                      font-semibold
                      text-red-500
                    "
                  >
                    {
                      errors.verificationDocument
                    }
                  </p>
                )}
              </div>
            </div>
          </motion.section>
        )}

        {/* ================= PRIMARY ACTION ================= */}

        <div className="pt-3">
          <AuthSubmitButton compact>
            Create Account
          </AuthSubmitButton>
        </div>
      </form>

      {/* ================= FOOTER ================= */}

      <AuthDivider compact />

      <AuthBottomLink
        compact
        text="Already have an account?"
        linkText="Sign In"
        to="/login"
      />
    </AuthLayout>
  );
}