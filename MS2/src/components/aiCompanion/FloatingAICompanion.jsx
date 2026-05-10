import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  ChevronDown,
  Compass,
  Heart,
  MessageCircle,
  Moon,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  answerAssistantQuestion,
  getAssistantQuickPrompts,
  getAssistantWelcome,
} from "@/data/assistant/assistantKnowledge";
import { getCurrentUser, normalizeRole } from "@/data/demoStore";

const COLLAPSED_KEY = "guc-ai-companion-collapsed";
const LEGACY_ENABLED_KEY = "guc-ai-companion-enabled";
const POSITION_KEY = "guc-ai-companion-launcher-position";
const CHAT_KEY = "guc-ai-companion-chat-v5";
const COMPANION_NAME_KEY = "guc-ai-companion-name";
const COMPANION_GENDER_KEY = "guc-ai-companion-gender";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const defaultCompanionName = (gender) => (gender === "female" ? "Nova" : "Atlas");

function readJson(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

function getDefaultLauncherPosition() {
  if (typeof window === "undefined") return { x: 72, y: 180 };
  return {
    x: Math.max(24, window.innerWidth - 112),
    y: Math.max(104, Math.min(window.innerHeight - 120, 210)),
  };
}

function getSafePosition(value) {
  const fallback = getDefaultLauncherPosition();
  if (typeof window === "undefined") return fallback;

  return {
    x: clamp(Number(value?.x ?? fallback.x), 12, Math.max(12, window.innerWidth - 88)),
    y: clamp(Number(value?.y ?? fallback.y), 92, Math.max(92, window.innerHeight - 88)),
  };
}

function getInitialCollapsed() {
  if (typeof window === "undefined") return false;

  // Old versions stored this and made him disappear forever.
  // Keep the user's intention, but convert it into the new tiny-circle UX.
  if (localStorage.getItem(LEGACY_ENABLED_KEY) === "false") {
    localStorage.removeItem(LEGACY_ENABLED_KEY);
    localStorage.setItem(COLLAPSED_KEY, "true");
    return true;
  }

  return localStorage.getItem(COLLAPSED_KEY) === "true";
}

function getInitialMessages() {
  if (typeof window !== "undefined") {
    try {
      const stored = JSON.parse(sessionStorage.getItem(CHAT_KEY) || "[]");
      if (Array.isArray(stored) && stored.length) return stored;
    } catch {
      // ignore broken cache
    }
  }

  return [
    {
      id: "welcome",
      role: "assistant",
      ...getAssistantWelcome(),
    },
  ];
}

function getMoodLine(mood, asleep, name) {
  if (asleep) return "Zzz... click me when you need help.";
  if (mood === "love") return `Sending tiny hearts, ${name} ♡`;
  if (mood === "thinking") return "Checking the seed database...";
  if (mood === "happy") return "Found something useful.";
  if (mood === "wave") return `Hi ${name}! Need help here?`;
  return "Click my robot body to tuck me back into the circle.";
}

function RobotMascot({ isOpen, isWaving, mood = "idle", asleep = false, tiny = false, heartBurst = false }) {
  const happy = mood === "happy" || mood === "love";
  const thinking = mood === "thinking";
  const waving = isWaving || mood === "wave";

  const sizeClass = tiny ? "h-12 w-12" : "h-28 w-28";
  const headClass = tiny ? "h-7 w-11 rounded-[16px] p-[4px]" : "h-16 w-24 rounded-[2rem] p-2";
  const faceClass = tiny ? "rounded-[12px]" : "rounded-[1.45rem]";
  const eyeClass = tiny ? "h-1.5 w-2" : "h-3.5 w-4";

  return (
    <motion.div
      className={`relative ${sizeClass} drop-shadow-[0_22px_28px_rgba(44,57,71,0.25)]`}
      animate={{
        y: asleep ? [0, 1, 0] : tiny ? [0, -2.5, 0] : [0, -9, 0],
        rotate: thinking ? [0, -2, 2, 0] : isOpen ? [0, -1, 1, 0] : [0, 1.5, -1.5, 0],
      }}
      transition={{ duration: thinking ? 1.2 : tiny ? 3.8 : 4.8, repeat: Infinity, ease: "easeInOut" }}
    >
      {!tiny && mood === "love" && (
        <motion.span
          className="absolute -right-4 -top-4 text-2xl text-rose-400"
          initial={{ opacity: 0, scale: 0.4, y: 10 }}
          animate={{ opacity: [0, 1, 0], scale: [0.4, 1.15, 0.7], y: [10, -12, -28] }}
          transition={{ duration: 1.35, repeat: Infinity, repeatDelay: 0.45 }}
        >
          ♥
        </motion.span>
      )}

      {!tiny && asleep && (
        <motion.span
          className="absolute -right-5 -top-5 inline-flex items-center gap-1 rounded-full border border-white/45 bg-white/80 px-2 py-1 text-[10px] font-black text-[color:var(--primary)] shadow-lg backdrop-blur-xl dark:bg-[color:var(--card-bg-strong)]/80 dark:text-[color:var(--accent)]"
          animate={{ y: [0, -5, 0], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2.3, repeat: Infinity }}
        >
          <Moon className="h-3 w-3" /> zzz
        </motion.span>
      )}

      {heartBurst && !tiny && (
        <div className="pointer-events-none absolute inset-0">
          {["♥", "♡", "♥"].map((heart, index) => (
            <motion.span
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              className="absolute text-xl text-rose-400"
              style={{ left: `${25 + index * 19}%`, top: `${20 - index * 4}%` }}
              animate={{ y: [-2, -48], opacity: [0, 1, 0], scale: [0.5, 1.15, 0.75] }}
              transition={{ duration: 1.2, delay: index * 0.12 }}
            >
              {heart}
            </motion.span>
          ))}
        </div>
      )}

      <motion.div
        className={`absolute left-1/2 top-0 ${tiny ? "h-2.5 w-5" : "h-5 w-12"} -translate-x-1/2 rounded-t-[22px] bg-[linear-gradient(180deg,var(--surface-elevated),rgba(122,170,206,0.75))]`}
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className={`absolute ${tiny ? "left-[2px] top-[12px] h-4 w-2.5" : "left-3 top-4 h-8 w-6"} rounded-l-3xl bg-[linear-gradient(180deg,var(--card-bg-strong),rgba(122,170,206,0.38))]`} />
      <div className={`absolute ${tiny ? "right-[2px] top-[12px] h-4 w-2.5" : "right-3 top-4 h-8 w-6"} rounded-r-3xl bg-[linear-gradient(180deg,var(--card-bg-strong),rgba(122,170,206,0.38))]`} />

      <div className={`absolute left-1/2 ${tiny ? "top-2" : "top-3"} ${headClass} -translate-x-1/2 bg-[linear-gradient(135deg,var(--card-bg-strong),var(--surface-soft),rgba(156,213,255,0.35))] shadow-inner ring-1 ring-[color:var(--border-blue)]`}>
        <div className={`relative h-full ${faceClass} bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.34),transparent_42%),linear-gradient(135deg,var(--primary),var(--secondary))] shadow-[inset_0_0_20px_rgba(156,213,255,0.22)] dark:bg-[radial-gradient(circle_at_50%_35%,rgba(156,213,255,0.16),transparent_42%),linear-gradient(135deg,#061923,#0c2634)]`}>
          <motion.span
            className={`absolute ${tiny ? "left-[9px] top-[8px]" : "left-5 top-5"} ${eyeClass} rounded-full bg-[color:var(--accent)] shadow-[0_0_16px_rgba(156,213,255,0.86)]`}
            animate={{ scaleY: asleep ? 0.16 : [1, 0.15, 1], scaleX: happy ? 1.08 : 1 }}
            transition={{ duration: 3.2, repeat: asleep ? 0 : Infinity, repeatDelay: 2.5 }}
          />
          <motion.span
            className={`absolute ${tiny ? "right-[9px] top-[8px]" : "right-5 top-5"} ${eyeClass} rounded-full bg-[color:var(--accent)] shadow-[0_0_16px_rgba(156,213,255,0.86)]`}
            animate={{ scaleY: asleep ? 0.16 : [1, 0.15, 1], scaleX: happy ? 1.08 : 1 }}
            transition={{ duration: 3.2, repeat: asleep ? 0 : Infinity, repeatDelay: 2.5 }}
          />
          <motion.span
            className={`absolute left-1/2 ${tiny ? "top-[15px] h-1.5 w-3" : "top-9 h-2.5 w-6"} -translate-x-1/2 rounded-b-full bg-[color:var(--accent)] shadow-[0_0_14px_rgba(156,213,255,0.82)]`}
            animate={{ scaleX: asleep ? 0.65 : happy ? 1.35 : isOpen ? 1.25 : 1, opacity: thinking ? [0.45, 1, 0.45] : 1 }}
            transition={{ duration: 0.65, repeat: thinking ? Infinity : 0 }}
          />
        </div>
      </div>

      <div className={`absolute left-1/2 ${tiny ? "top-[31px] h-4 w-7 rounded-t-lg" : "top-[4.9rem] h-12 w-16 rounded-t-[1.2rem]"} -translate-x-1/2 rounded-b-[2.5rem] bg-[linear-gradient(135deg,var(--card-bg-strong),var(--surface-soft),rgba(156,213,255,0.32))] ring-1 ring-[color:var(--border-blue)]`}>
        {!tiny && <div className="absolute bottom-5 left-4 h-3 w-8 border-b-4 border-[color:var(--primary)]/35" />}
      </div>

      <motion.div
        className={`absolute ${tiny ? "left-[8px] top-[31px] h-4 w-2" : "left-1 top-[4.7rem] h-10 w-5"} origin-top rounded-full bg-[linear-gradient(180deg,var(--card-bg-strong),rgba(122,170,206,0.38))]`}
        animate={{ rotate: waving ? [-8, -44, -8, -34, -8] : asleep ? 16 : [-6, 5, -6] }}
        transition={{ duration: waving ? 1.1 : 3.4, repeat: asleep ? 0 : Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className={`absolute ${tiny ? "right-[8px] top-[31px] h-4 w-2" : "right-1 top-[4.7rem] h-10 w-5"} origin-top rounded-full bg-[linear-gradient(180deg,var(--card-bg-strong),rgba(122,170,206,0.38))]`}
        animate={{ rotate: asleep ? -16 : [6, -5, 6] }}
        transition={{ duration: 3.2, repeat: asleep ? 0 : Infinity, ease: "easeInOut" }}
      />

      {!tiny && (
        <motion.div
          className="absolute -bottom-3 left-1/2 h-3 w-16 -translate-x-1/2 rounded-full bg-[color:var(--dark)]/15 blur-sm"
          animate={{ scaleX: [1, 0.75, 1], opacity: [0.22, 0.12, 0.22] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </motion.div>
  );
}

function TinyRobotBadge({ mood, asleep, isWaving }) {
  return (
    <div className="relative grid h-full w-full place-items-center overflow-hidden rounded-full">
      <span className="absolute inset-0 rounded-full bg-[image:var(--gradient-brand)] opacity-35" />
      <span className="absolute inset-[3px] rounded-full border border-white/45 bg-white/28 shadow-[inset_0_1px_12px_rgba(255,255,255,0.32)] backdrop-blur-2xl dark:bg-[color:var(--card-bg-strong)]/32" />
      <span className="absolute -right-2 -top-2 h-10 w-10 rounded-full bg-[color:var(--accent)]/35 blur-xl" />

      <RobotMascot tiny mood={mood} asleep={asleep} isWaving={isWaving} />

      <span className="absolute bottom-1.5 right-1.5 h-2.5 w-2.5 rounded-full border border-white bg-[color:var(--accent)] shadow-[0_0_12px_rgba(156,213,255,0.9)]" />
    </div>
  );
}

function ActionButton({ action, onAction, onNavigate }) {
  const path = action.path || action.to;
  return (
    <button
      type="button"
      onClick={() => (path ? onNavigate(path) : onAction(action.query || action.label))}
      className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-[color:var(--border-blue)] bg-white/70 px-3 py-1.5 text-xs font-black text-[color:var(--primary)] transition hover:-translate-y-0.5 hover:bg-white dark:bg-white/10 dark:text-[color:var(--accent)]"
      title={action.description || path || action.query || action.label}
    >
      {path ? <Compass className="h-3.5 w-3.5 shrink-0" /> : <Sparkles className="h-3.5 w-3.5 shrink-0" />}
      <span className="truncate">{action.label}</span>
    </button>
  );
}

function ChatMessage({ message, onAction, onNavigate }) {
  const isBot = message.role !== "user" && message.from !== "user";
  const actions = message.actions || message.routes || [];

  return (
    <div className={`flex ${isBot ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[86%] rounded-3xl px-4 py-3 text-sm leading-6 shadow-sm ${
          isBot
            ? "border border-[color:var(--border-blue)] bg-[color:var(--surface-elevated)] text-[color:var(--ink)]"
            : "bg-[image:var(--gradient-brand)] text-white"
        }`}
      >
        {isBot && message.title && (
          <div className="mb-1 flex items-center gap-1.5 text-[12px] font-black text-[color:var(--primary)] dark:text-[color:var(--accent)]">
            <Sparkles className="h-3.5 w-3.5" />
            {message.title}
          </div>
        )}
        <p className="whitespace-pre-line">{message.text}</p>

        {isBot && Array.isArray(actions) && actions.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {actions.map((action, index) => (
              <ActionButton
                // eslint-disable-next-line react/no-array-index-key
                key={`${action.label}-${action.path || action.query || index}`}
                action={action}
                onAction={onAction}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        )}

        {isBot && message.meta?.source && (
          <div className="mt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
            Source: {message.meta.source}
          </div>
        )}
      </div>
    </div>
  );
}

export default function FloatingAICompanion() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const dragStart = useRef({ x: 0, y: 0 });
  const dragged = useRef(false);
  const idleTimer = useRef(null);

  const currentUser = useMemo(() => getCurrentUser(), []);
  const role = normalizeRole(currentUser?.role || currentUser?.accountRole || currentUser?.systemRole || "student");
  const name = currentUser?.firstName || currentUser?.name?.split(" ")?.[0] || "there";
  const quickPrompts = useMemo(() => getAssistantQuickPrompts(role), [role]);

  const [collapsed, setCollapsed] = useState(getInitialCollapsed);
  const [launcherPosition, setLauncherPosition] = useState(() => getSafePosition(readJson(POSITION_KEY, null)));
  const [messages, setMessages] = useState(getInitialMessages);
  const [input, setInput] = useState("");
  const [mood, setMood] = useState("wave");
  const [asleep, setAsleep] = useState(false);
  const [heartBurst, setHeartBurst] = useState(false);
  const [greetingHidden, setGreetingHidden] = useState(false);
  const [personalizeOpen, setPersonalizeOpen] = useState(false);
  const [companionGender, setCompanionGender] = useState(() => {
    if (typeof window === "undefined") return "male";
    const stored = localStorage.getItem(COMPANION_GENDER_KEY);
    return stored === "female" ? "female" : "male";
  });
  const [companionName, setCompanionName] = useState(() => {
    if (typeof window === "undefined") return "Atlas";
    const storedName = localStorage.getItem(COMPANION_NAME_KEY);
    const storedGender = localStorage.getItem(COMPANION_GENDER_KEY);
    return storedName?.trim() || defaultCompanionName(storedGender === "female" ? "female" : "male");
  });

  const wake = (nextMood = "wave") => {
    setAsleep(false);
    setMood(nextMood);
    window.clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(() => {
      setMood("sleep");
      setAsleep(true);
    }, 32000);
  };

  const persistCollapsed = (value) => {
    setCollapsed(value);
    localStorage.setItem(COLLAPSED_KEY, value ? "true" : "false");
    localStorage.removeItem(LEGACY_ENABLED_KEY);
    if (!value) wake("wave");
  };

  const saveCompanionName = (value) => {
    const clean = String(value || "").replace(/[^a-zA-Z0-9 _-]/g, "").trim().slice(0, 22);
    const next = clean || defaultCompanionName(companionGender);
    setCompanionName(next);
    localStorage.setItem(COMPANION_NAME_KEY, next);
    wake("happy");
  };

  const saveCompanionGender = (value) => {
    const nextGender = value === "female" ? "female" : "male";
    const previousDefault = defaultCompanionName(companionGender);
    setCompanionGender(nextGender);
    localStorage.setItem(COMPANION_GENDER_KEY, nextGender);

    // If the user has not customized the name yet, switch to the matching default name.
    if (!localStorage.getItem(COMPANION_NAME_KEY) || companionName === previousDefault) {
      const nextName = defaultCompanionName(nextGender);
      setCompanionName(nextName);
      localStorage.setItem(COMPANION_NAME_KEY, nextName);
    }
    wake("wave");
  };

  useEffect(() => {
    sessionStorage.setItem(CHAT_KEY, JSON.stringify(messages.slice(-18)));
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    wake("wave");
    const interval = window.setInterval(() => {
      if (!collapsed && !asleep) {
        const moods = ["idle", "wave", "happy", "love"];
        setMood(moods[Math.floor(Math.random() * moods.length)]);
      }
    }, 12000);

    const onResize = () => {
      setLauncherPosition((prev) => {
        const next = getSafePosition(prev);
        writeJson(POSITION_KEY, next);
        return next;
      });
    };

    window.addEventListener("resize", onResize);
    return () => {
      window.clearInterval(interval);
      window.clearTimeout(idleTimer.current);
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collapsed, asleep]);

  const ask = (rawQuestion = input) => {
    const cleanQuestion = String(rawQuestion || "").trim();
    if (!cleanQuestion) return;

    wake("thinking");
    setInput("");
    setGreetingHidden(true);
    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: "user", text: cleanQuestion }]);

    const renameMatch = cleanQuestion.match(/(?:rename|name|call)\s+(?:you|him|her|it|my\s+pet|the\s+assistant)?\s*(?:to|as)?\s+([a-zA-Z][a-zA-Z0-9 _-]{1,22})/i);
    if (renameMatch) {
      const requestedName = renameMatch[1].replace(/^(male|female|boy|girl)$/i, "").trim();
      if (requestedName) {
        window.setTimeout(() => {
          saveCompanionName(requestedName);
          setMood("happy");
          setMessages((prev) => [
            ...prev,
            {
              id: `b-${Date.now()}`,
              role: "assistant",
              title: "Renamed",
              text: `Done — my name is ${requestedName} now.`,
              mood: "happy",
              meta: { source: "AI companion preferences" },
            },
          ]);
        }, 180);
        return;
      }
    }

    const genderMatch = cleanQuestion.match(/(?:make|set|change|gender).*\b(male|female|boy|girl)\b/i);
    if (genderMatch) {
      const nextGender = /female|girl/i.test(genderMatch[1]) ? "female" : "male";
      window.setTimeout(() => {
        saveCompanionGender(nextGender);
        const visibleName = localStorage.getItem(COMPANION_NAME_KEY) || defaultCompanionName(nextGender);
        setMood("wave");
        setMessages((prev) => [
          ...prev,
          {
            id: `b-${Date.now()}`,
            role: "assistant",
            title: "Persona updated",
            text: `Done — ${visibleName} is now set as a ${nextGender} desk pet.`,
            mood: "wave",
            meta: { source: "AI companion preferences" },
          },
        ]);
      }, 180);
      return;
    }

    window.setTimeout(() => {
      const answer = answerAssistantQuestion(cleanQuestion);
      setMood(answer.mood || "happy");
      if (answer.mood === "love" || /thank|cute|love|heart/i.test(cleanQuestion)) {
        setHeartBurst(true);
        window.setTimeout(() => setHeartBurst(false), 1300);
      }
      setMessages((prev) => [...prev, { id: `b-${Date.now()}`, role: "assistant", ...answer }]);
    }, 220);
  };

  const goTo = (path) => {
    wake("wave");
    if (!path || path.includes(":")) return;
    navigate(path);
    persistCollapsed(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    ask(input);
  };

  const updateLauncherPosition = (event, info) => {
    const next = getSafePosition({ x: info.point.x - 36, y: info.point.y - 36 });
    setLauncherPosition(next);
    writeJson(POSITION_KEY, next);
    window.setTimeout(() => {
      dragged.current = false;
    }, 90);
  };

  const openFromLauncher = () => {
    if (dragged.current) return;
    persistCollapsed(false);
  };

  if (collapsed) {
    return (
      <motion.button
        type="button"
        drag
        dragMomentum={false}
        dragElastic={0.05}
        onPointerDown={(event) => {
          dragStart.current = { x: event.clientX, y: event.clientY };
          dragged.current = false;
        }}
        onDrag={(event) => {
          const dx = Math.abs(event.clientX - dragStart.current.x);
          const dy = Math.abs(event.clientY - dragStart.current.y);
          if (dx + dy > 8) dragged.current = true;
        }}
        onDragEnd={updateLauncherPosition}
        onClick={openFromLauncher}
        initial={{ opacity: 0, scale: 0.5, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        whileHover={{ scale: 1.08, y: -2 }}
        whileTap={{ scale: 0.96 }}
        style={{ left: launcherPosition.x, top: launcherPosition.y }}
        className="group fixed z-[70] grid h-[72px] w-[72px] cursor-grab place-items-center rounded-full border border-white/45 bg-white/18 shadow-[0_18px_50px_rgba(44,57,71,0.24)] outline-none backdrop-blur-2xl transition focus-visible:ring-4 focus-visible:ring-[color:var(--ring-soft)] active:cursor-grabbing dark:bg-[color:var(--card-bg-strong)]/22"
        aria-label={`Open ${companionName} AI companion`}
        title="Drag me or click to open"
      >
        <span className="absolute inset-0 rounded-full bg-[color:var(--accent)]/15 blur-xl" />
        <TinyRobotBadge mood={mood} asleep={asleep} isWaving={mood === "wave"} />
        <span className="pointer-events-none absolute -left-28 top-1/2 hidden -translate-y-1/2 rounded-2xl border border-[color:var(--border-blue)] bg-[color:var(--surface-elevated)]/90 px-3 py-2 text-xs font-black text-[color:var(--ink)] opacity-0 shadow-[var(--shadow-card)] backdrop-blur-xl transition group-hover:opacity-100 xl:block">
          Drag me · open AI guide
        </span>
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 35, y: 20, scale: 0.94 }}
      animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="fixed right-8 top-[44vh] z-[70] hidden max-w-[calc(100vw-2rem)] select-none lg:block"
    >
      <AnimatePresence>
        {!greetingHidden && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.94 }}
            className="absolute -left-40 top-2 w-44 rounded-[24px] border border-[color:var(--border-blue)] bg-[color:var(--surface-elevated)]/95 p-3 text-sm font-bold text-[color:var(--ink)] shadow-[var(--shadow-card)] backdrop-blur-xl"
          >
            <button
              type="button"
              onClick={() => setGreetingHidden(true)}
              className="absolute right-2 top-2 text-[color:var(--muted)] hover:text-[color:var(--ink)]"
              aria-label="Hide greeting bubble"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            {getMoodLine(mood, asleep, name)}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.aside
        initial={{ opacity: 0, x: 28, scale: 0.94 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 28, scale: 0.94 }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-24 right-0 w-[390px] overflow-hidden rounded-[32px] border border-[color:var(--border-blue)] bg-[color:var(--card-bg-strong)] shadow-[0_28px_90px_rgba(44,57,71,0.24)] backdrop-blur-2xl dark:shadow-[0_28px_90px_rgba(0,0,0,0.42)]"
      >
        <div className="relative overflow-hidden bg-[image:var(--gradient-brand)] p-4 text-white">
          <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/15 blur-2xl" />
          <div className="relative flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/12 ring-1 ring-white/15">
                <Bot className="h-5 w-5 text-[color:var(--accent)]" />
              </div>
              <div>
                <p className="text-sm font-black">{companionName}</p>
                <p className="text-xs font-semibold text-white/62">{companionGender === "female" ? "Female" : "Male"} desk pet · {role} mode</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPersonalizeOpen((value) => !value)}
                className="rounded-xl bg-white/10 px-3 py-2 text-xs font-black text-white transition hover:bg-white/15"
                aria-label="Customize AI companion"
                title="Rename or choose persona"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => {
                  wake("love");
                  setHeartBurst(true);
                  window.setTimeout(() => setHeartBurst(false), 1300);
                }}
                className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-white transition hover:bg-white/15"
                aria-label="Send hearts"
                title="Send hearts"
              >
                <Heart className="h-4 w-4 fill-current" />
              </button>
              <button
                type="button"
                onClick={() => persistCollapsed(true)}
                className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-white transition hover:bg-white/15"
                aria-label="Collapse AI companion"
                title="Collapse to tiny circle"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {personalizeOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="border-b border-[color:var(--border-blue)] bg-[color:var(--surface-soft)] p-4"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-black text-[color:var(--ink)]">Desk pet identity</p>
                  <p className="text-xs font-semibold text-[color:var(--muted)]">Keep the old cute robot design, but personalize who he/she is.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPersonalizeOpen(false)}
                  className="rounded-xl border border-[color:var(--border-blue)] bg-white/55 px-2 py-1 text-xs font-black text-[color:var(--muted)] hover:text-[color:var(--ink)] dark:bg-white/10"
                >
                  Done
                </button>
              </div>

              <label className="block text-[11px] font-black uppercase tracking-[0.16em] text-[color:var(--muted)]">Name</label>
              <div className="mt-1.5 flex gap-2">
                <input
                  value={companionName}
                  onChange={(event) => setCompanionName(event.target.value)}
                  onBlur={(event) => saveCompanionName(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      saveCompanionName(event.currentTarget.value);
                    }
                  }}
                  maxLength={22}
                  className="min-w-0 flex-1 rounded-2xl border border-[color:var(--border-blue)] bg-[color:var(--input-bg)] px-3 py-2 text-sm font-bold text-[color:var(--ink)] outline-none focus:ring-4 focus:ring-[color:var(--ring-soft)]"
                  placeholder="Name your desk pet"
                />
                <button
                  type="button"
                  onClick={() => saveCompanionName(companionName)}
                  className="rounded-2xl bg-[image:var(--gradient-brand)] px-4 py-2 text-xs font-black text-white shadow-[var(--shadow-soft)]"
                >
                  Save
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                {[
                  { value: "male", label: "Male", hint: "Atlas default" },
                  { value: "female", label: "Female", hint: "Nova default" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => saveCompanionGender(option.value)}
                    className={`rounded-2xl border px-3 py-2 text-left transition ${
                      companionGender === option.value
                        ? "border-[color:var(--primary)] bg-[color:var(--primary)]/10 text-[color:var(--primary)] shadow-sm dark:border-[color:var(--accent)] dark:text-[color:var(--accent)]"
                        : "border-[color:var(--border-blue)] bg-white/55 text-[color:var(--ink)] hover:-translate-y-0.5 dark:bg-white/10"
                    }`}
                  >
                    <span className="block text-sm font-black">{option.label}</span>
                    <span className="block text-[11px] font-bold text-[color:var(--muted)]">{option.hint}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={scrollRef} className="max-h-[370px] space-y-3 overflow-y-auto p-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} onAction={ask} onNavigate={goTo} />
          ))}
        </div>

        <div className="border-t border-[color:var(--border-blue)] bg-[color:var(--surface-soft)] p-4">
          <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
            {quickPrompts.slice(0, 4).map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => ask(suggestion)}
                className="shrink-0 rounded-full border border-[color:var(--border-blue)] bg-white/60 px-3 py-1.5 text-xs font-black text-[color:var(--primary)] transition hover:-translate-y-0.5 hover:bg-white dark:bg-white/10 dark:text-[color:var(--accent)]"
              >
                {suggestion}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex items-center gap-2 rounded-2xl border border-[color:var(--border-blue)] bg-[color:var(--input-bg)] p-2 shadow-sm">
            <input
              value={input}
              onChange={(event) => {
                setInput(event.target.value);
                wake("idle");
              }}
              onFocus={() => wake("wave")}
              placeholder="Ask about projects, courses, companies..."
              className="min-w-0 flex-1 bg-transparent px-2 text-sm font-semibold text-[color:var(--ink)] outline-none placeholder:text-[color:var(--muted)]"
            />
            <button
              type="submit"
              className="grid h-10 w-10 place-items-center rounded-xl bg-[image:var(--gradient-brand)] text-white shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </motion.aside>

      <button
        type="button"
        onClick={() => persistCollapsed(true)}
        className="group relative block rounded-[34px] p-1 outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--ring-soft)]"
        aria-label={`Collapse ${companionName} to tiny circle`}
        title="Click me to return to tiny circle"
      >
        <span className="absolute inset-2 rounded-full bg-[color:var(--accent)]/30 opacity-0 blur-2xl transition group-hover:opacity-100" />
        <RobotMascot isOpen isWaving={mood === "wave"} mood={mood} asleep={asleep} heartBurst={heartBurst} />
        <span className="absolute bottom-1 right-2 grid h-10 w-10 place-items-center rounded-2xl border border-white/50 bg-[image:var(--gradient-brand)] text-white shadow-[0_14px_30px_rgba(44,57,71,0.24)]">
          <MessageCircle className="h-4 w-4" />
        </span>
      </button>
    </motion.div>
  );
}
