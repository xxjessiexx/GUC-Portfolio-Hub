import { useNavigate } from "react-router-dom";

function getRoleLabel(user) {
  const role = String(
    user?.role || user?.systemRole || user?.accountRole || ""
  ).toLowerCase();

  if (role === "student") {
    return user?.title || user?.level || "Student";
  }

  if (role === "instructor") {
    return user?.title || user?.position || "Instructor";
  }

  if (role === "employer") {
    return user?.position || user?.companyName || "Employer";
  }

  return user?.title || "Member";
}

function getSecondaryInfo(user) {
  const role = String(
    user?.role || user?.systemRole || user?.accountRole || ""
  ).toLowerCase();

  if (role === "student") {
    return user?.major || user?.faculty || "";
  }

  if (role === "instructor") {
    return (
      user?.department ||
      user?.faculty ||
      user?.specialization ||
      ""
    );
  }

  if (role === "employer") {
    return user?.companyName || user?.industry || "";
  }

  return "";
}

export default function ChatProfilePopover({
  user,
  onClose,
}) {
  const navigate = useNavigate();

  if (!user) return null;

  const role = String(
    user.role || user.systemRole || user.accountRole || ""
  ).toLowerCase();

  const roleLabel = getRoleLabel(user);
  const secondaryInfo = getSecondaryInfo(user);

  const bio =
    user.bio ||
    user.companyBio ||
    user.about ||
    user.description ||
    "No profile description has been added yet.";

  const skills = Array.isArray(user.skills)
    ? user.skills.slice(0, 4)
    : [];

  const handleViewProfile = () => {
    if (role === "student") {
      navigate(`/public-portfolio?userId=${user.id}`);
      onClose?.();
    }
  };

  return (
    <div
      className="
        absolute left-0 top-[calc(100%+12px)] z-50
        w-[330px] max-w-[calc(100vw-32px)]
        overflow-hidden rounded-[24px]
        border border-white/70
        bg-[rgba(255,255,255,0.94)]
        p-5
        shadow-[0_24px_55px_rgba(27,63,85,0.18),0_8px_22px_rgba(27,63,85,0.10),inset_0_1px_0_rgba(255,255,255,0.94)]
        backdrop-blur-xl
      "
      onClick={(event) => event.stopPropagation()}
    >
      <div>
        <p className="text-sm font-black text-[color:var(--primary)]">
          {roleLabel}
        </p>

        {secondaryInfo && (
          <p className="mt-1 text-xs font-semibold text-[color:var(--muted)]">
            {secondaryInfo}
          </p>
        )}
      </div>

      <p
        className="
          mt-4 overflow-hidden
          text-sm font-semibold leading-6
          text-[color:var(--muted)]
          [display:-webkit-box]
          [-webkit-box-orient:vertical]
          [-webkit-line-clamp:3]
        "
      >
        {bio}
      </p>

      {skills.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="
                rounded-full
                border border-[color:var(--primary)]/10
                bg-[color:var(--primary)]/7
                px-3 py-1
                text-[11px] font-extrabold
                text-[color:var(--primary)]
              "
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {role === "student" && (
        <button
          type="button"
          onClick={handleViewProfile}
          className="
            mt-5 w-full
            rounded-2xl
            bg-[color:var(--dark)]
            px-4 py-3
            text-sm font-black text-white
            shadow-[0_10px_22px_rgba(27,63,85,0.16)]
            transition-all duration-200
            hover:-translate-y-0.5
            hover:opacity-95
            hover:shadow-[0_14px_26px_rgba(27,63,85,0.22)]
            focus:outline-none
            focus:ring-2
            focus:ring-[color:var(--dark)]/25
          "
        >
          View Portfolio
        </button>
      )}
    </div>
  );
}