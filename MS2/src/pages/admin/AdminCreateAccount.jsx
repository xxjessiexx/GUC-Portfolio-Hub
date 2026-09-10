import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  KeyRound,
  Mail,
  RotateCcw,
  ShieldCheck,
  UserPlus,
  UserRound,
} from "lucide-react";

import { AdminPageShell } from "@/components/adminModule/AdminPageShell";
import { AdminField, RequirementLine } from "@/components/adminModule/AdminFormPrimitives";
import { Input } from "@/components/ui/input";
import { useAdminModuleData } from "@/hooks/useAdminModuleData";
import { useToast } from "@/context/ToastContext";

const emptyAdmin = {
  name: "",
  email: "",
  username: "",
  password: "",
  note: "",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

const inputStyles =
  "min-h-[52px] w-full rounded-[14px] border border-[#C7D7E0] bg-[rgba(247,250,252,0.84)] px-4 text-[14px] font-extrabold text-[#183247] shadow-[inset_0_1px_0_rgba(255,255,255,0.66)] placeholder:text-[#8798A4] transition hover:border-[#9AB3C1] focus-visible:border-[#557C97] focus-visible:bg-white/95 focus-visible:ring-4 focus-visible:ring-[#7AAACE]/10";

function AdminEditorTabs({ active, onChange }) {
  const items = [
    { id: "account", label: "Account", icon: UserRound },
    { id: "access", label: "Access", icon: ShieldCheck },
  ];

  return (
    <nav
      className="mt-5 flex items-center gap-1 border-b border-[#BFD1DC]/85"
      aria-label="Admin editor sections"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const selected = active === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={`relative inline-flex h-12 items-center gap-2.5 px-4 text-[13px] font-black transition ${
              selected
                ? "text-[#17384E]"
                : "text-[#7A8D99] hover:text-[#355872]"
            }`}
          >
            <Icon
              className={`h-4 w-4 ${
                selected ? "text-[#355872]" : "text-[#8EA0AA]"
              }`}
            />
            {item.label}
            {selected ? (
              <span className="absolute inset-x-3 bottom-0 h-[3px] rounded-t-full bg-[#E6C77B]" />
            ) : null}
          </button>
        );
      })}
    </nav>
  );
}

function SectionHeader({ icon: Icon, title, description }) {
  return (
    <div className="mb-7 flex items-start gap-3">
      <span className="mt-2 h-[2px] w-8 shrink-0 rounded-full bg-[#E6C77B]" />
      <div>
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-[#557C97]" />
          <h2 className="text-[20px] font-black tracking-[-0.025em] text-[#142A3A]">
            {title}
          </h2>
        </div>
        <p className="mt-1 text-[13px] font-semibold leading-5 text-[#718391]">
          {description}
        </p>
      </div>
    </div>
  );
}

export default function AdminCreateAccount() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { users, actions } = useAdminModuleData();

  const [form, setForm] = useState(emptyAdmin);
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeSection, setActiveSection] = useState("account");

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const normalizedEmail = form.email.trim().toLowerCase();
  const normalizedUsername = form.username.trim().toLowerCase();

  const emailValid = EMAIL_REGEX.test(normalizedEmail);
  const passwordStrongEnough = form.password.length >= 6;

  const duplicateEmail = useMemo(
    () =>
      Boolean(normalizedEmail) &&
      users.some(
        (user) =>
          String(user.email || "").trim().toLowerCase() === normalizedEmail
      ),
    [users, normalizedEmail]
  );

  const duplicateUsername = useMemo(
    () =>
      Boolean(normalizedUsername) &&
      users.some(
        (user) =>
          String(user.username || "").trim().toLowerCase() ===
          normalizedUsername
      ),
    [users, normalizedUsername]
  );

  const errors = {
    name:
      submitted && !form.name.trim()
        ? "Full name is required."
        : "",
    email:
      submitted && !normalizedEmail
        ? "GUC email is required."
        : normalizedEmail && !emailValid
          ? "Enter a valid email address."
          : duplicateEmail
            ? "This email already exists."
            : "",
    username:
      submitted && !normalizedUsername
        ? "Username is required."
        : duplicateUsername
          ? "This username already exists."
          : "",
    password:
      submitted && !form.password
        ? "Password is required."
        : form.password && !passwordStrongEnough
          ? "Password must be at least 6 characters."
          : "",
  };

  const completion = [
    form.name.trim(),
    emailValid && !duplicateEmail,
    normalizedUsername && !duplicateUsername,
    passwordStrongEnough,
  ].filter(Boolean).length;

  const canSubmit =
    Boolean(form.name.trim()) &&
    emailValid &&
    Boolean(normalizedUsername) &&
    passwordStrongEnough &&
    !duplicateEmail &&
    !duplicateUsername;

  const submit = (event) => {
    event.preventDefault();
    setSubmitted(true);

    if (!canSubmit) {
      if (!form.name.trim() || !emailValid || duplicateEmail) {
        setActiveSection("account");
      } else {
        setActiveSection("access");
      }
      return;
    }

    const adminName = form.name.trim();

    actions.createAdminUser({
      name: adminName,
      email: normalizedEmail,
      username: normalizedUsername,
      password: form.password,
      note: form.note.trim(),
    });

    setForm(emptyAdmin);
    setSubmitted(false);
    setShowPassword(false);

    showToast({
      title: "Admin account created",
      description: `${adminName} can now sign in as an administrator.`,
      type: "success",
    });

    navigate("/admin/users", { replace: true });
  };

  const resetForm = () => {
    setForm(emptyAdmin);
    setSubmitted(false);
    setShowPassword(false);
    setActiveSection("account");
  };

  return (
    <AdminPageShell
      sidebarProgress={{
        label: "Account readiness",
        value: Math.round((completion / 4) * 100),
      }}
    >
      <main className="mx-auto flex h-[calc(100vh-9rem)] min-h-0 w-full max-w-[1480px] flex-col">
        <form
          id="admin-account-form"
          onSubmit={submit}
          className="flex h-full min-h-0 flex-col"
        >
          <div className="shrink-0 border-b border-[#BFD1DC]/75 pb-4">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <span className="h-[3px] w-9 rounded-full bg-[#E6C77B]" />
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#5C8199]">
                    Admin editor
                  </p>
                </div>
                <h1 className="mt-3 text-[40px] font-black leading-none tracking-[-0.045em] text-[#112A3B] sm:text-[46px]">
                  Create Admin
                </h1>
                <p className="mt-3 max-w-2xl text-[14px] font-semibold leading-6 text-[#718391]">
                  Create an administrator account in one focused workspace.
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => navigate("/admin/users")}
                  className="h-11 rounded-[14px] px-4 text-[12px] font-black text-[#718391] transition hover:bg-[#EAF2F6] hover:text-[#355872]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-[14px] bg-[#355872] px-6 text-[12px] font-black text-white shadow-[0_10px_24px_rgba(53,88,114,0.18)] transition hover:bg-[#294A61] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <UserPlus className="h-4 w-4" />
                  Create admin
                </button>
              </div>
            </div>
          </div>

          <div className="shrink-0">
            <AdminEditorTabs
              active={activeSection}
              onChange={setActiveSection}
            />
          </div>

          <div className="mt-4 min-h-0 flex-1 overflow-hidden rounded-[24px] border border-[#C9DBE4]/80 bg-[rgba(249,252,253,0.70)] shadow-[0_16px_36px_rgba(53,88,114,0.065)] backdrop-blur-xl">
            <div className="h-full overflow-y-auto px-6 py-6 pr-5 sm:px-9 sm:pr-7 [scrollbar-gutter:stable] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#9AAAB4]/35 hover:[&::-webkit-scrollbar-thumb]:bg-[#8799A5]/50">
              {activeSection === "account" ? (
                <section>
                  <SectionHeader
                    icon={UserRound}
                    title="Account details"
                    description="Set the administrator's identity and GUC email."
                  />

                  <div className="grid gap-5 md:grid-cols-2">
                    <AdminField
                      label="Full name"
                      required
                      icon={UserRound}
                      error={errors.name}
                      feedback="This name appears across the admin workspace."
                    >
                      <Input
                        value={form.name}
                        onChange={(event) => update("name", event.target.value)}
                        placeholder="Nadine Admin"
                        className={inputStyles}
                      />
                    </AdminField>

                    <AdminField
                      label="GUC email"
                      required
                      icon={Mail}
                      error={errors.email}
                      success={
                        emailValid && !duplicateEmail
                          ? "Email is available."
                          : ""
                      }
                      feedback="Use the administrator's GUC email address."
                    >
                      <Input
                        value={form.email}
                        onChange={(event) => update("email", event.target.value)}
                        placeholder="admin@guc.edu.eg"
                        className={inputStyles}
                      />
                    </AdminField>
                  </div>
                </section>
              ) : null}

              {activeSection === "access" ? (
                <section>
                  <SectionHeader
                    icon={ShieldCheck}
                    title="Access & credentials"
                    description="Set sign-in credentials and review account readiness."
                  />

                  <div className="grid gap-5 md:grid-cols-2">
                    <AdminField
                      label="Username"
                      required
                      icon={ShieldCheck}
                      error={errors.username}
                      success={
                        normalizedUsername && !duplicateUsername
                          ? "Username is available."
                          : ""
                      }
                    >
                      <Input
                        value={form.username}
                        onChange={(event) =>
                          update("username", event.target.value)
                        }
                        placeholder="nadine.admin"
                        className={inputStyles}
                      />
                    </AdminField>

                    <AdminField
                      label="Password"
                      required
                      icon={KeyRound}
                      error={errors.password}
                      success={
                        passwordStrongEnough
                          ? "Password meets the minimum length."
                          : ""
                      }
                    >
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          value={form.password}
                          onChange={(event) =>
                            update("password", event.target.value)
                          }
                          placeholder="••••••••"
                          className={`${inputStyles} pr-12`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-[#718391] transition hover:bg-black/5 hover:text-[#183247]"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </AdminField>
                  </div>

                  <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
                    <AdminField
                      label="Admin note"
                      feedback="Optional internal note about this administrator."
                    >
                      <textarea
                        value={form.note}
                        onChange={(event) => update("note", event.target.value)}
                        rows={5}
                        placeholder="Add an optional note..."
                        className={`${inputStyles} min-h-32 resize-none py-3`}
                      />
                    </AdminField>

                    <aside className="rounded-[18px] border border-[#C9DBE4]/75 bg-white/50 p-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#718391]">
                        Account readiness
                      </p>
                      <div className="mt-4 space-y-2">
                        <RequirementLine done={Boolean(form.name.trim())}>
                          Full name added
                        </RequirementLine>
                        <RequirementLine
                          done={Boolean(emailValid && !duplicateEmail)}
                        >
                          Valid unique email
                        </RequirementLine>
                        <RequirementLine
                          done={Boolean(
                            normalizedUsername && !duplicateUsername
                          )}
                        >
                          Unique username
                        </RequirementLine>
                        <RequirementLine done={passwordStrongEnough}>
                          Password accepted
                        </RequirementLine>
                      </div>
                    </aside>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="inline-flex h-11 items-center gap-2 rounded-[14px] border border-[#C9DBE4] bg-white/55 px-5 text-[12px] font-black text-[#718391] transition hover:bg-white hover:text-[#355872]"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Reset
                    </button>
                  </div>
                </section>
              ) : null}
            </div>
          </div>
        </form>
      </main>
    </AdminPageShell>
  );
}
