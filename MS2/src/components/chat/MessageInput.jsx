import { useState, useRef, useEffect  } from "react";
import { Send,  Smile } from "lucide-react";
import EmojiPicker from "emoji-picker-react";

export default function MessageInput({
  onSend,
}) {
  const pickerRef = useRef(null);

  const [message, setMessage] = useState("");

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiClick = (emojiData) => {
  setMessage((prev) => prev + emojiData.emoji);
};

useEffect(() => {

  const handleClickOutside = (event) => {

    if (
      pickerRef.current &&
      !pickerRef.current.contains(event.target)
    ) {
      setShowEmojiPicker(false);
    }

  };

  document.addEventListener(
    "mousedown",
    handleClickOutside
  );

  return () => {

    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );

  };

}, []);


  const handleSubmit = () => {

    if (!message.trim()) return;

    onSend(message);

    setMessage("");
  };

  return (
    <div className="relative border-t bg-white p-5">

      <div className="flex gap-4">

        {showEmojiPicker && (

  <div ref={pickerRef} className="absolute bottom-24 left-5 z-50">

    <EmojiPicker
      onEmojiClick={handleEmojiClick}
    />

  </div>

)}
<button
  type="button"
  onClick={() =>
    setShowEmojiPicker(!showEmojiPicker)
  }
  className="rounded-2xl border px-4 text-gray-600 transition hover:bg-gray-100"
>
  <Smile size={22} />
</button>

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