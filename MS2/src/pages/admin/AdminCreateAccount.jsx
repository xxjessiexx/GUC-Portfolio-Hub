import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, KeyRound, Mail, RotateCcw, ShieldCheck, UserPlus, UserRound } from "lucide-react";
import { toast } from "sonner";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AdminPageShell } from "@/components/adminModule/AdminPageShell";
import { AdminField, AdminFormSectionHeader, AdminMotionCard, RequirementLine } from "@/components/adminModule/AdminFormPrimitives";
import { adminInputStyles, cardMotion, pageMotion } from "@/lib/adminFormTokens";
import { AppButton } from "@/components/ui/AppButton";
import { AppCard } from "@/components/ui/AppCard";
import { Input } from "@/components/ui/input";
import { useAdminModuleData } from "@/hooks/useAdminModuleData";
import SideToast from "@/components/ui/SideToast";
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
const [toast, setToast] = useState({
  open: false,
  title: "",
  description: "",
  type: "success",
});
  const submit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    if (!canSubmit) return;
    actions.createAdminUser({ name: form.name.trim(), email: normalizedEmail, username: normalizedUsername, password: form.password, note: form.note.trim() });
    sessionStorage.setItem(
  "adminToast",
  JSON.stringify({
    title: "Admin account created",
    description: `${form.name.trim()} can now sign in as an administrator.`,
    type: "success",
  })
);

navigate("/admin/users");
  };

  return (
    <AdminPageShell sidebarProgress={{ label: "Account readiness", value: Math.round((completion / 4) * 100) }}>
      
    <SideToast
  open={toast.open}
  title={toast.title}
  description={toast.description}
  type={toast.type}
  onClose={() =>
    setToast((current) => ({
      ...current,
      open: false,
    }))
  }
/>

          <main className="px-4 py-6 pb-24 sm:px-6 lg:px-8">
                      <div className="mx-auto max-w-7xl space-y-6">
                        <SectionHeader
                  className="
                    [&_h2]:mt-3
                    [&_h2]:text-4xl
                    [&_h2]:font-black
                    [&_h2]:tracking-tight
                    [&_h2]:text-[color:var(--ink)]
                    sm:[&_h2]:text-5xl
                
                    [&_p]:mt-3
                    [&_p]:text-base
                    [&_p]:font-semibold
                    [&_p]:text-[color:var(--muted)]
                  "
                  title="Create Admin Account"
                  subtitle="Provision another administrator using the required username and password flow."
                  action={
                            <div className="-m-2">
                              <span
                                onClick={() => navigate("/admin/users")}
                                className="inline-flex gap-2 items-center rounded-2xl px-9 py-3 text-white font-semibold 
                                bg-[linear-gradient(135deg,#2C3947_0%,#355872_55%,#7AAACE_100%)]
                hover:bg-[linear-gradient(135deg,#355872_0%,#46739A_55%,#8CC3EA_100%)] shadow-md hover:bg-[#243f69] transition-all cursor-pointer  hover:-translate-y-1
                      hover:scale-[1.02]
                      hover:brightness-110
                      hover:shadow-[0_24px_50px_rgba(53,88,114,.35)]  shadow-[0_12px_30px_rgba(53,88,114,.22)]
                
                      transition-all
                      duration-300
                      ease-out
                      hover:shadow-[0_20px_40px_rgba(53,88,114,.30),0_10px_45px_rgba(122,170,206,.35)] hover:bg-[linear-gradient(135deg,#1F2E3C_0%,#2D4B63_55%,#4F7EA4_100%)]"
                              >
                                <ArrowLeft className="h-5 w-5" />
                                
                                Back to Users
                              </span>
                            </div>
                          }
                        />
          
          
      

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

                setToast({
                  open: true,
                  title: "Form reset successfully",
                  description: "All admin account fields have been cleared.",
                  type: "success",
                });
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
      
      </div>
      </main>
    </AdminPageShell>
  );
}
