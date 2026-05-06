import { useState } from "react";
import { X } from "lucide-react";

export default function SkillsEditor({ skills = [], onChange }) {
  const [input, setInput] = useState("");

  const addSkill = () => {
    const trimmed = input.trim();
    if (!trimmed || skills.includes(trimmed)) return;

    onChange([...skills, trimmed]);
    setInput("");
  };

  const removeSkill = (skillToRemove) => {
    onChange(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addSkill();
    }
  };

  return (
    <div>
      <h3 className="mb-4 text-xl font-black text-[color:var(--ink)]">
        Skills
      </h3>

      <div className="flex flex-wrap items-center gap-3 rounded-[24px] border border-[color:var(--primary)]/12 bg-white/75 px-4 py-4 shadow-sm dark:border-white/10 dark:bg-white/[0.055]">
        {skills.map((skill) => (
          <span
            key={skill}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-[#7AAACE]/55 bg-[#5F86A3] px-5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(53,88,114,0.14)] dark:border-white/10 dark:bg-white/10 dark:text-[color:var(--accent)] dark:shadow-none"
          >
            <span>{skill}</span>

            <button
              type="button"
              onClick={() => removeSkill(skill)}
              className="grid h-5 w-5 place-items-center rounded-full text-white/85 transition hover:bg-white/15 hover:text-white dark:text-[color:var(--accent)]/75 dark:hover:bg-white/10"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        ))}

        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter skill"
          className="min-w-[140px] flex-1 bg-transparent text-sm font-semibold text-[color:var(--ink)] outline-none placeholder:text-[color:var(--muted)]/70"
        />
      </div>
    </div>
  );
}