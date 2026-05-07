import { useState } from "react";
import { Send } from "lucide-react";

export default function MessageInput({
  onSend,
}) {

  const [message, setMessage] = useState("");

  const handleSubmit = () => {

    if (!message.trim()) return;

    onSend(message);

    setMessage("");
  };

  return (
    <div className="border-t bg-white p-5">

      <div className="flex gap-4">

        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }

          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}

          className="flex-1 rounded-2xl border px-5 py-4 outline-none"
        />

        <button
          onClick={handleSubmit}
          className="rounded-2xl bg-[linear-gradient(135deg,var(--dark),var(--primary))] px-6 text-white"
        >
          <Send size={20} />
        </button>

      </div>

    </div>
  );
}