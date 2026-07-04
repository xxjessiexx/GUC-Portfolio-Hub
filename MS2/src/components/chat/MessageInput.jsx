import { useState, useRef, useEffect } from "react";
import { Send, Smile, Paperclip, X } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { cn } from "@/lib/utils";

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = () => {
      reject(new Error("Could not read file."));
    };

    reader.readAsDataURL(file);
  });
}

export default function MessageInput({ onSend }) {
  const pickerRef = useRef(null);
  const fileInputRef = useRef(null);

  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSending, setIsSending] = useState(false);

  const hasMessage = message.trim().length > 0;
  const hasFile = Boolean(selectedFile);
  const canSend = (hasMessage || hasFile) && !isSending;

  const handleEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // localStorage cannot handle very large files well
    const maxSizeInMB = 2;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

    if (file.size > maxSizeInBytes) {
      alert(`Please choose a file smaller than ${maxSizeInMB} MB.`);
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
    event.target.value = "";
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = async () => {
    if (!canSend) return;

    try {
      setIsSending(true);

      let attachments = [];

      if (selectedFile) {
        const dataUrl = await fileToDataUrl(selectedFile);

        attachments = [
          {
            id: `attachment-${Date.now()}`,
            name: selectedFile.name,
            type: selectedFile.type || "application/octet-stream",
            size: selectedFile.size,
            dataUrl,
          },
        ];
      }

      onSend(message, attachments);

      setMessage("");
      setSelectedFile(null);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <footer className="relative shrink-0 bg-transparent p-5">
      {showEmojiPicker && (
        <div ref={pickerRef} className="absolute bottom-24 left-5 z-50">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />

      {selectedFile && (
        <div className="mb-3 flex w-fit max-w-full items-center gap-2 rounded-2xl border border-[color:var(--border-soft)] bg-[var(--surface)] px-3 py-2 text-xs font-bold text-[color:var(--primary)] shadow-sm">
          <Paperclip className="h-4 w-4 shrink-0" />

          <span className="truncate">{selectedFile.name}</span>

          <button
            type="button"
            onClick={removeSelectedFile}
            className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[color:var(--muted)] transition hover:bg-rose-500/10 hover:text-rose-500"
            aria-label="Remove attached file"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <div className="flex items-center gap-3 rounded-[24px] border border-[color:var(--border-soft)] bg-[var(--surface)] p-2 shadow-[var(--shadow-soft)]">
        <button
          type="button"
          onClick={handleAttachClick}
          className="grid h-11 w-11 place-items-center rounded-2xl text-[color:var(--muted)] transition hover:bg-[var(--surface-strong)] hover:text-[color:var(--primary)]"
          aria-label="Attach file"
        >
          <Paperclip size={20} />
        </button>

        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
          className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm font-semibold text-[color:var(--ink)] outline-none placeholder:text-[color:var(--muted)]"
        />

        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="grid h-11 w-11 place-items-center rounded-2xl text-[color:var(--muted)] transition hover:bg-[var(--surface-strong)] hover:text-[color:var(--primary)]"
          aria-label="Choose emoji"
        >
          <Smile size={20} />
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSend}
          className={cn(
            "grid h-11 w-11 place-items-center rounded-2xl transition",
            canSend
              ? "bg-[linear-gradient(135deg,var(--dark),var(--primary))] text-white shadow-[0_14px_28px_rgba(53,88,114,0.24)] hover:-translate-y-0.5 hover:shadow-[0_18px_35px_rgba(53,88,114,0.30)]"
              : "cursor-default bg-slate-200/70 text-slate-400 shadow-none"
          )}
          aria-label="Send message"
        >
          <Send size={18} />
        </button>
      </div>
    </footer>
  );
}