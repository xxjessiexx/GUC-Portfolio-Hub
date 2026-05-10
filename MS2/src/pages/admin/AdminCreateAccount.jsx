import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, KeyRound, Mail, RotateCcw, ShieldCheck, UserPlus, UserRound } from "lucide-react";
import { toast } from "sonner";

import { AdminPageShell } from "@/components/adminModule/AdminPageShell";
import { AdminField, AdminFormSectionHeader, AdminMotionCard, RequirementLine } from "@/components/adminModule/AdminFormPrimitives";
import { adminInputStyles, cardMotion, pageMotion } from "@/lib/adminFormTokens";
import { AppButton } from "@/components/ui/AppButton";
import { AppCard } from "@/components/ui/AppCard";
import { Input } from "@/components/ui/input";
import { useAdminModuleData } from "@/hooks/useAdminModuleData";
import { AdminPageHeader } from "@/components/adminModule/AdminPageHeader";

const emptyAdmin = { name: "", email: "", username: "", password: "", note: "" };
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

export default function AdminCreateAccount() {
  const navigate = useNavigate();
  const { users, actions } = useAdminModuleData();
  const [form, setForm] = useState(emptyAdmin);
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const normalizedEmail = form.email.trim().toLowerCase();
  const normalizedUsername = form.username.trim().toLowerCase();
  const emailValid = EMAIL_REGEX.test(normalizedEmail);
  const passwordStrongEnough = form.password.length >= 6;
  const duplicateEmail = useMemo(() => users.some((user) => user.email.toLowerCase() === normalizedEmail), [users, normalizedEmail]);
  const duplicateUsername = useMemo(() => users.some((user) => user.username?.toLowerCase() === normalizedUsername), [users, normalizedUsername]);

  const errors = {
    name: submitted && !form.name.trim() ? "Full name is required." : "",
    email: submitted && !normalizedEmail ? "GUC email is required." : normalizedEmail && !emailValid ? "Enter a valid email address." : duplicateEmail ? "This email already exists." : "",
    username: submitted && !normalizedUsername ? "Username is required." : duplicateUsername ? "This username already exists." : "",
    password: submitted && !form.password ? "Password is required." : form.password && !passwordStrongEnough ? "Password must be at least 6 characters." : "",
  };
  const completion = [form.name.trim(), emailValid && !duplicateEmail, normalizedUsername && !duplicateUsername, passwordStrongEnough].filter(Boolean).length;
  const canSubmit = form.name.trim() && emailValid && normalizedUsername && passwordStrongEnough && !duplicateEmail && !duplicateUsername;

  const submit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    if (!canSubmit) return;
    actions.createAdminUser({ name: form.name.trim(), email: normalizedEmail, username: normalizedUsername, password: form.password, note: form.note.trim() });
    toast.success("Admin account created", { description: `${form.name.trim()} can now sign in as an administrator.` });
    navigate("/admin/users");
  };

  return (
    <AdminPageShell sidebarProgress={{ label: "Account readiness", value: Math.round((completion / 4) * 100) }}>
      <motion.div initial="hidden" animate="visible" variants={pageMotion} className="space-y-5">
        <motion.div variants={cardMotion}>
          <AppButton as={Link} to="/admin/users" variant="glass" size="sm" className="w-fit"><ArrowLeft className="size-4" />Back to users</AppButton>
        </motion.div>

        <motion.div variants={cardMotion}>
          <AdminPageHeader
            eyebrow="Admin Access"
            title="Create Admin Account"
            description="Provision another administrator using the required username and password flow."
            actionLabel="Back to Users"
            actionTo="/admin/users"
            icon={ArrowLeft}
          />
        </motion.div>

        <form onSubmit={submit} className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="space-y-4">
            <AdminMotionCard>
              <div className="space-y-4">
                <AdminFormSectionHeader icon={UserPlus} title="Admin identity" description="Use clean details so the account is easy to audit later." />
                <div className="grid gap-4 md:grid-cols-2">
                  <AdminField label="Full name" required icon={UserRound} error={errors.name} feedback="Shown in the users table.">
                    <Input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Nadine Admin" className={adminInputStyles} />
                  </AdminField>
                  <AdminField label="GUC email" required icon={Mail} error={errors.email} success={emailValid && !duplicateEmail ? "Email looks good." : ""} feedback="Admins should use GUC emails.">
                    <Input value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="admin@guc.edu.eg" className={adminInputStyles} />
                  </AdminField>
                </div>
              </div>
            </AdminMotionCard>

            <AdminMotionCard>
              <div className="space-y-4">
                <AdminFormSectionHeader icon={ShieldCheck} title="Login credentials" description="Compatible with the current prototype login while matching the requirement wording." />
                <div className="grid gap-4 md:grid-cols-2">
                  <AdminField label="Username" required icon={ShieldCheck} error={errors.username} feedback="Required by Req 53.">
                    <Input value={form.username} onChange={(e) => update("username", e.target.value)} placeholder="nadine.admin" className={adminInputStyles} />
                  </AdminField>
                  <AdminField label="Password" required icon={KeyRound} error={errors.password} success={passwordStrongEnough ? "Password length is accepted." : ""} feedback="Minimum 6 characters for the demo.">
                    <div className="relative">
                      <Input type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="••••••••" className={`${adminInputStyles} pr-12`} />
                      <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-[color:var(--muted)] hover:bg-black/5 hover:text-[color:var(--ink)]">
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                  </AdminField>
                </div>
                <AdminField label="Admin note" feedback="Optional reason shown in recent activity.">
                  <textarea value={form.note} onChange={(e) => update("note", e.target.value)} rows={3} placeholder="Why are we creating this admin account?" className={`${adminInputStyles} min-h-[90px] w-full resize-none py-3`} />
                </AdminField>
              </div>
            </AdminMotionCard>

            <motion.div
              variants={cardMotion}
              className="flex flex-col-reverse gap-3 rounded-[28px] border border-white/70 bg-white/45 p-4 shadow-[0_18px_45px_rgba(53,88,114,0.08)] sm:flex-row sm:justify-end"
            >
              <AppButton
                type="button"
                variant="glass"
                className="rounded-2xl px-6 py-3 font-black"
                onClick={() => {
                  setForm(emptyAdmin);
                  setSubmitted(false);
                }}
              >
                <RotateCcw className="size-4" />
                Reset
              </AppButton>

              <AppButton
                type="submit"
                className="rounded-2xl bg-[color:var(--primary)] px-6 py-3 font-black text-white shadow-[0_14px_30px_rgba(31,58,92,0.22)] transition hover:-translate-y-0.5 hover:bg-[color:var(--primary)]/90"
              >
                <UserPlus className="size-4" />
                Create admin
              </AppButton>
            </motion.div>
          </div>

          <motion.aside variants={cardMotion} className="space-y-4 xl:sticky xl:top-6 xl:self-start">
            <AppCard variant="strong" radius="lg" padding="lg" className="p-5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[color:var(--secondary)]">Account preview</p>
              <div className="mt-4 rounded-3xl border border-[color:var(--border-blue)] bg-white/70 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--primary)] text-lg font-black text-white">{form.name?.[0]?.toUpperCase() || "A"}</div>
                <p className="mt-3 font-black text-[color:var(--ink)]">{form.name || "Admin name"}</p>
                <p className="text-sm font-semibold text-[color:var(--muted)]">{normalizedEmail || "admin@guc.edu.eg"}</p>
                <p className="mt-2 text-xs font-black uppercase tracking-[0.14em] text-[color:var(--primary)]">@{normalizedUsername || "username"}</p>
              </div>
              <div className="mt-4 space-y-2">
                <RequirementLine done={Boolean(form.name.trim())}>Full name added</RequirementLine>
                <RequirementLine done={Boolean(emailValid && !duplicateEmail)}>Valid unique email</RequirementLine>
                <RequirementLine done={Boolean(normalizedUsername && !duplicateUsername)}>Unique username</RequirementLine>
                <RequirementLine done={passwordStrongEnough}>Password accepted</RequirementLine>
              </div>
            </AppCard>
          </motion.aside>
        </form>
      </motion.div>
    </AdminPageShell>
  );
}
