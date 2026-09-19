import { useEffect, useRef, useState } from "react";

import {
  getChatDisplayMeta,
  getCurrentUser,
  getUserById,
} from "@/data/demoStore";

import ChatProfilePopover from "./ChatProfilePopover";

export default function ChatHeader({ selectedChat }) {
  const currentUser = getCurrentUser();

  const displayChat = getChatDisplayMeta(
    selectedChat,
    currentUser?.id
  );

  const otherUser = displayChat?.id
    ? getUserById(displayChat.id)
    : null;

  const [showProfile, setShowProfile] = useState(false);

  const profileAreaRef = useRef(null);
  const closeTimeoutRef = useRef(null);

  useEffect(() => {
    setShowProfile(false);
  }, [selectedChat?.id]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        profileAreaRef.current &&
        !profileAreaRef.current.contains(event.target)
      ) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setShowProfile(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }

    setShowProfile(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setShowProfile(false);
    }, 150);
  };

  return (
    <header className="relative z-30 flex shrink-0 items-center bg-transparent px-6 py-5">
      <div
        ref={profileAreaRef}
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button
          type="button"
          onClick={() =>
            setShowProfile((current) => !current)
          }
          aria-expanded={showProfile}
          className="
            group flex items-center gap-4
            rounded-[22px]
            px-2 py-1.5
            text-left
            transition-all duration-200
            hover:bg-white/40
            focus:outline-none
            focus:ring-2
            focus:ring-[color:var(--primary)]/20
          "
        >
          <div
            className="
              flex h-14 w-14 shrink-0
              items-center justify-center
              overflow-hidden rounded-2xl
              bg-[linear-gradient(135deg,var(--dark),var(--primary))]
              text-lg font-black text-white
              shadow-[var(--shadow-soft)]
              ring-1 ring-white/60
              transition-transform duration-200
              group-hover:scale-[1.03]
            "
          >
            {displayChat.image ? (
              <img
                src={displayChat.image}
                alt={displayChat.name}
                className="h-full w-full object-cover"
              />
            ) : (
              displayChat.avatar
            )}
          </div>

          <div className="min-w-0">
            <h2
              className="
                truncate text-lg font-black
                text-[color:var(--ink)]
                transition-colors
                group-hover:text-[color:var(--primary)]
              "
            >
              {displayChat.name}
            </h2>

            <div className="mt-1 flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${
                  displayChat.online
                    ? "bg-emerald-400"
                    : "bg-[color:var(--muted)]/50"
                }`}
              />

              <p className="text-xs font-bold text-[color:var(--muted)]">
                {displayChat.online ? "Online" : "Offline"}
              </p>
            </div>
          </div>
        </button>

        {showProfile && otherUser && (
          <ChatProfilePopover
            user={otherUser}
            onClose={() => setShowProfile(false)}
          />
        )}
      </div>
    </header>
  );
}