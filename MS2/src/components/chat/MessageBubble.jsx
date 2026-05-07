export default function MessageBubble({
  message,
}) {

  const isMe = message.sender === "me";

  return (
    <div
      className={`flex ${
        isMe
          ? "justify-end"
          : "justify-start"
      }`}
    >

      <div>

        <div
          className={`max-w-[500px] rounded-3xl px-6 py-4
          
          ${
            isMe
              ? "bg-[linear-gradient(135deg,var(--dark),var(--primary))] text-white text-white"
              : "bg-[#ececec] text-gray-800"
          }
          `}
        >
          {message.text}
        </div>

        <p
          className={`mt-1 text-xs text-gray-400
          ${isMe ? "text-right" : "text-left"}
          `}
        >
          {message.time}
        </p>

      </div>

    </div>
  );
}