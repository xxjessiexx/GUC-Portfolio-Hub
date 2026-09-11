import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Eye,
  EyeOff,
  KeyRound,
  Mail,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { AdminPageShell } from "@/components/adminModule/AdminPageShell";
import { Input } from "@/components/ui/input";
import { getUserById, updateUser } from "@/data/demoStore";
import { useToast } from "@/context/ToastContext";

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

function Field({ label, icon: Icon, required, children, error, helper }) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-black text-[#183247]">
        {Icon ? <Icon className="h-4 w-4 text-[#557C97]" /> : null}
        {label}
        {required ? <span className="text-[#C6A64D]">*</span> : null}
      </label>
      {children}
      {error ? (
        <p className="text-xs font-bold text-red-500">{error}</p>
      ) : helper ? (
        <p className="text-xs font-semibold text-[#7A8C98]">{helper}</p>
      ) : null}
    </div>
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

export default function AdminEditAccount() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const user = useMemo(() => getUserById(userId), [userId]);

  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeSection, setActiveSection] = useState("account");
  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    note: "",
  });

  useEffect(() => {
    if (!user) return;

    setForm({
      name: user.name || "",
      email: user.email || "",
      username: user.username || "",
      password: user.password || "",
      note: user.adminNote || user.note || "",
    });
  }, [user]);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(form.email);

  const canSubmit =
    Boolean(form.name.trim()) &&
    emailValid &&
    Boolean(form.username.trim()) &&
    form.password.length >= 6;

  const errors = {
    name:
      submitted && !form.name.trim()
        ? "Full name is required."
        : "",
    email:
      submitted && !emailValid
        ? "Enter a valid email address."
        : "",
    username:
      submitted && !form.username.trim()
        ? "Username is required."
        : "",
    password:
      submitted && form.password.length < 6
        ? "Password must be at least 6 characters."
        : "",
  };

  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const submit = (event) => {
    event.preventDefault();
    setSubmitted(true);

    if (!canSubmit || !user) {
      if (!form.name.trim() || !emailValid) {
        setActiveSection("account");
      } else {
        setActiveSection("access");
      }
      return;
    }

    updateUser(user.id, {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      username: form.username.trim(),
      password: form.password,
      adminNote: form.note.trim(),
    });

    showToast({
      title: "Admin account updated",
      description: `${form.name.trim()} was updated successfully.`,
      type: "success",
    });

    navigate("/admin/users");
  };

  if (!user || user.role !== "admin") {
    return (
      <AdminPageShell>
        <main className="mx-auto w-full max-w-[1480px]">
          <div className="rounded-[24px] border border-[#C9DBE4]/80 bg-white/70 p-8">
            <h1 className="text-3xl font-black text-[#112A3B]">
              Admin account not found
            </h1>
            <button
              type="button"
              onClick={() => navigate("/admin/users")}
              className="mt-6 h-11 rounded-[14px] bg-[#355872] px-5 text-sm font-black text-white"
            >
              Back to users
            </button>
          </div>
        </main>
      </AdminPageShell>
    );
  }

  return (
    <AdminPageShell>
      <main className="mx-auto flex h-[calc(100vh-9rem)] min-h-0 w-full max-w-[1480px] flex-col">
        <form
          id="edit-admin-form"
          onSubmit={submit}
          className="flex h-full min-h-0 flex-col"
        >
          <div className="shrink-0 border-b border-[#BFD1DC]/75 pb-4">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <span className="h-[3px] w-9 rounded-full bg-[#E6C77B]" />
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#5C8199]">
                    Admin editor
                  </p>
                </div>
                <h1 className="mt-3 text-[40px] font-black leading-none tracking-[-0.045em] text-[#112A3B] sm:text-[46px]">
                  Edit Admin
                </h1>
                <p className="mt-3 max-w-2xl text-[14px] font-semibold leading-6 text-[#718391]">
                  Update administrator identity and access in one focused workspace.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
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
                  className="inline-flex h-11 items-center gap-2 rounded-[14px] bg-[#355872] px-6 text-[12px] font-black text-white shadow-[0_10px_24px_rgba(53,88,114,0.18)] transition hover:bg-[#294A61] disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  Save changes
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
            <div className="h-full overflow-y-auto px-6 py-6 pr-5 sm:px-9 sm:pr-7 [scrollbar-gutter:stable] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#9AAAB4]/35">
              {activeSection === "account" ? (
                <section>
                  <SectionHeader
                    icon={UserRound}
                    title="Account details"
                    description="Update the administrator's identity and email."
                  />

                  <div className="grid gap-5 md:grid-cols-2">
                    <Field
                      label="Full name"
                      icon={UserRound}
                      required
                      error={errors.name}
                    >
                      <Input
                        className={inputStyles}
                        value={form.name}
                        onChange={(event) =>
                          update("name", event.target.value)
                        }
                      />
                    </Field>

                    <Field
                      label="GUC email"
                      icon={Mail}
                      required
                      error={errors.email}
                    >
                      <Input
                        className={inputStyles}
                        value={form.email}
                        onChange={(event) =>
                          update("email", event.target.value)
                        }
                      />
                    </Field>
                  </div>
                </section>
              ) : null}

              {activeSection === "access" ? (
                <section>
                  <SectionHeader
                    icon={ShieldCheck}
                    title="Access & credentials"
                    description="Update sign-in credentials and internal notes."
                  />

                  <div className="grid gap-5 md:grid-cols-2">
                    <Field
                      label="Username"
                      icon={ShieldCheck}
                      required
                      error={errors.username}
                    >
                      <Input
                        className={inputStyles}
                        value={form.username}
                        onChange={(event) =>
                          update("username", event.target.value)
                        }
                      />
                    </Field>

                    <Field
                      label="Password"
                      icon={KeyRound}
                      required
                      error={errors.password}
                    >
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          className={`${inputStyles} pr-12`}
                          value={form.password}
                          onChange={(event) =>
                            update("password", event.target.value)
                          }
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPassword((value) => !value)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-[#718391] hover:bg-black/5"
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </Field>
                  </div>

                  <div className="mt-5">
                    <Field
                      label="Admin note"
                      helper="Optional internal note about this administrator."
                    >
                      <textarea
                        value={form.note}
                        onChange={(event) =>
                          update("note", event.target.value)
                        }
                        rows={5}
                        className={`${inputStyles} min-h-32 resize-none py-3`}
                        placeholder="Add an optional note..."
                      />
                    </Field>
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
