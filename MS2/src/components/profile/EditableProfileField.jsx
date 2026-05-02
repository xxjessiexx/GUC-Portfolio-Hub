import { useState } from "react";
import { Pencil, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function EditableProfileField({ label, value, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftValue, setDraftValue] = useState(value);

  const handleSave = () => {
    onSave(draftValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDraftValue(value);
    setIsEditing(false);
  };

  return (
    <div className="grid gap-3 border-b border-[color:var(--primary)]/10 py-4 md:grid-cols-[180px_1fr_auto] md:items-center">
      <p className="text-sm font-black text-[color:var(--dark)]">{label}</p>

      {isEditing ? (
        <Input
          value={draftValue}
          onChange={(e) => setDraftValue(e.target.value)}
          className="h-11 rounded-2xl border-[color:var(--primary)]/15 bg-white/70 px-4 text-[color:var(--ink)] shadow-none focus-visible:ring-[color:var(--gold)]/20"
        />
      ) : (
        <p className="text-sm font-semibold text-[color:var(--muted)]">
          {value}
        </p>
      )}

      {isEditing ? (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSave}
            className="grid h-9 w-9 place-items-center rounded-xl bg-[color:var(--primary)] text-white"
          >
            <Check className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={handleCancel}
            className="grid h-9 w-9 place-items-center rounded-xl bg-white/70 text-[color:var(--muted)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="grid h-9 w-9 place-items-center rounded-xl bg-white/70 text-[color:var(--primary)] transition hover:bg-[color:var(--accent)]/25"
        >
          <Pencil className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}