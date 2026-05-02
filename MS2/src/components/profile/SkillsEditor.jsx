import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SkillsEditor({ skills, onChange }) {
  const [newSkill, setNewSkill] = useState("");

  const addSkill = () => {
    const cleanSkill = newSkill.trim();
    if (!cleanSkill) return;

    onChange([...skills, cleanSkill]);
    setNewSkill("");
  };

  const removeSkill = (skillToRemove) => {
    onChange(skills.filter((skill) => skill !== skillToRemove));
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-4">
        <h3 className="text-xl font-black text-[color:var(--ink)]">Skills</h3>

        <div className="flex gap-2">
          <Input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Add skill"
            className="h-10 w-40 rounded-2xl bg-white/70"
          />

          <Button
            type="button"
            onClick={addSkill}
            className="rounded-2xl bg-[color:var(--primary)] text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {skills.map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center gap-2 rounded-2xl bg-[color:var(--accent)]/25 px-4 py-2 text-sm font-bold text-[color:var(--primary)]"
          >
            {skill}

            <button
              type="button"
              onClick={() => removeSkill(skill)}
              className="text-[color:var(--primary)]/70 hover:text-red-500"
            >
              <X className="h-4 w-4" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}