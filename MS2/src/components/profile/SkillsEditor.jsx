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

      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-[color:var(--primary)]/15 bg-white/75 px-3 py-3 shadow-sm">
        {skills.map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center gap-2 rounded-xl border border-[color:var(--primary)]/20 bg-[color:var(--primary)]/10 px-3 py-1.5 text-sm font-bold text-[color:var(--primary)]"
          >
            {skill}

            <button
              type="button"
              onClick={() => removeSkill(skill)}
              className="text-[color:var(--primary)]/70 transition hover:text-red-500"
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