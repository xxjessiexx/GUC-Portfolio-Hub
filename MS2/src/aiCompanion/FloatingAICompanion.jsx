import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useDragControls } from "framer-motion";
import {
  Bot,
  ChevronDown,
  Compass,
  Cookie,
  GripHorizontal,
  Heart,
  MessageCircle,
  Moon,
  Send,
  Sparkles,
  Wand2,
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
const PANEL_POSITION_KEY = "guc-ai-companion-panel-position";
const CHAT_KEY = "guc-ai-companion-chat-v8";
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

function getDefaultPanelPosition() {
  if (typeof window === "undefined") return { x: 740, y: 210 };
  return {
    x: Math.max(24, window.innerWidth - 548),
    y: Math.max(98, Math.min(window.innerHeight - 560, window.innerHeight * 0.34)),
  };
}

function getSafePosition(value, size = 88, minY = 92) {
  const fallback = getDefaultLauncherPosition();
  if (typeof window === "undefined") return fallback;

  return {
    x: clamp(Number(value?.x ?? fallback.x), 12, Math.max(12, window.innerWidth - size)),
    y: clamp(Number(value?.y ?? fallback.y), minY, Math.max(minY, window.innerHeight - size)),
  };
}

function getSafePanelPosition(value) {
  const fallback = getDefaultPanelPosition();
  if (typeof window === "undefined") return fallback;

  return {
    x: clamp(Number(value?.x ?? fallback.x), 16, Math.max(16, window.innerWidth - 516)),
    y: clamp(Number(value?.y ?? fallback.y), 88, Math.max(88, window.innerHeight - 560)),
  };
}

function getInitialCollapsed() {
  if (typeof window === "undefined") return false;

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

function getMoodLine(mood, asleep, userName, petName, activity) {
  if (asleep) return `${petName} is taking a tiny desk nap. Click to wake.`;
  if (activity === "dance") return `${petName} is doing a little dashboard dance.`;
  if (activity === "dizzy") return "Careful! Too much shaking made me dizzy.";
  if (activity === "snack") return "Snack accepted. Productivity restored.";
  if (activity === "curious") return "I noticed you here. Need directions?";
  if (activity === "listening") return "I am listening. Ask me anything about the website.";
  if (mood === "love") return `Sending tiny hearts, ${userName} ♡`;
  if (mood === "thinking") return "Checking the seed database...";
  if (mood === "happy") return "Found something useful.";
  if (mood === "wave") return `Hi ${userName}! Need help here?`;
  return `Drag ${petName}, pet ${petName}, or ask a question.`;
}

function ActivityBits({ activity, tiny = false }) {
  if (activity === "dance") {
    return (
      <div className="pointer-events-none absolute inset-0">
        {["♪", "♫", "♪"].map((note, index) => (
          <motion.span
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            className={`${tiny ? "text-[10px]" : "text-lg"} absolute font-black text-[color:var(--accent)]`}
            style={{ left: `${8 + index * 34}%`, top: `${tiny ? 2 : -8 + index * 8}%` }}
            animate={{ y: [4, -18, 4], opacity: [0, 1, 0], rotate: [-8, 10, -8] }}
            transition={{ duration: 1.2, delay: index * 0.16, repeat: Infinity }}
          >
            {note}
          </motion.span>
        ))}
      </div>
    );
  }

  if (activity === "curious") {
    return (
      <motion.span
        className={`absolute ${tiny ? "-right-1 -top-1 text-xs" : "-right-5 -top-3 text-2xl"} font-black text-[color:var(--accent)] drop-shadow`}
        animate={{ y: [0, -5, 0], rotate: [-6, 8, -6] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      >
        ?
      </motion.span>
    );
  }

  if (activity === "snack") {
    return (
      <motion.span
        className={`absolute ${tiny ? "-right-1 -top-1" : "-right-5 -top-4"} grid ${tiny ? "h-5 w-5" : "h-9 w-9"} place-items-center rounded-full border border-white/55 bg-white/75 text-amber-700 shadow-lg backdrop-blur-xl dark:bg-[color:var(--card-bg-strong)]/80`}
        animate={{ scale: [0.9, 1.08, 0.9], rotate: [-6, 6, -6] }}
        transition={{ duration: 1.15, repeat: Infinity }}
      >
        <Cookie className={tiny ? "h-3 w-3" : "h-5 w-5"} />
      </motion.span>
    );
  }

  if (activity === "dizzy") {
    return (
      <motion.span
        className={`absolute ${tiny ? "-right-1 -top-1 text-xs" : "-right-5 -top-5 text-2xl"} font-black text-[color:var(--primary)] dark:text-[color:var(--accent)]`}
        animate={{ rotate: [0, 360], opacity: [0.55, 1, 0.55] }}
        transition={{ duration: 0.85, repeat: Infinity, ease: "linear" }}
      >
        @
      </motion.span>
    );
  }

  return null;
}

function RobotMascot({
  isOpen,
  isWaving,
  mood = "idle",
  asleep = false,
  tiny = false,
  heartBurst = false,
  activity = "idle",
  onPet,
  onTickle,
}) {
  const happy = mood === "happy" || mood === "love" || activity === "snack";
  const thinking = mood === "thinking" || activity === "listening";
  const dancing = activity === "dance";
  const dizzy = activity === "dizzy";
  const waving = isWaving || mood === "wave" || activity === "curious";

  const sizeClass = tiny ? "h-12 w-12" : "h-28 w-28";
  const headClass = tiny ? "h-7 w-11 rounded-[16px] p-[4px]" : "h-16 w-24 rounded-[2rem] p-2";
  const faceClass = tiny ? "rounded-[12px]" : "rounded-[1.45rem]";
  const eyeClass = tiny ? "h-1.5 w-2" : "h-3.5 w-4";

  return (
    <motion.div
      role="button"
      tabIndex={tiny ? -1 : 0}
      onPointerEnter={() => !tiny && onPet?.("curious")}
      onDoubleClick={(event) => {
        event.stopPropagation();
        onTickle?.();
      }}
      onKeyDown={(event) => {
        if (!tiny && (event.key === "Enter" || event.key === " ")) onPet?.("pet");
      }}
      className={`relative ${sizeClass} drop-shadow-[0_22px_28px_rgba(44,57,71,0.25)]`}
      animate={{
        y: asleep ? [0, 1, 0] : tiny ? [0, -2.5, 0] : dancing ? [0, -13, 0, -5, 0] : [0, -9, 0],
        rotate: dizzy ? [0, -8, 8, -8, 0] : dancing ? [-5, 6, -6, 5, -5] : thinking ? [0, -2, 2, 0] : isOpen ? [0, -1, 1, 0] : [0, 1.5, -1.5, 0],
        scale: activity === "snack" ? [1, 1.04, 1] : 1,
      }}
      transition={{ duration: dancing ? 1.2 : thinking ? 1.2 : tiny ? 3.8 : 4.8, repeat: Infinity, ease: "easeInOut" }}
    >
      <ActivityBits activity={activity} tiny={tiny} />

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
            animate={{ scaleY: asleep ? 0.16 : [1, 0.15, 1], scaleX: happy ? 1.14 : 1 }}
            transition={{ duration: 3.2, repeat: asleep ? 0 : Infinity, repeatDelay: 2.5 }}
          />
          <motion.span
            className={`absolute ${tiny ? "right-[9px] top-[8px]" : "right-5 top-5"} ${eyeClass} rounded-full bg-[color:var(--accent)] shadow-[0_0_16px_rgba(156,213,255,0.86)]`}
            animate={{ scaleY: asleep ? 0.16 : [1, 0.15, 1], scaleX: happy ? 1.14 : 1 }}
            transition={{ duration: 3.2, repeat: asleep ? 0 : Infinity, repeatDelay: 2.5 }}
          />
          <motion.span
            className={`absolute left-1/2 ${tiny ? "top-[15px] h-1.5 w-3" : "top-9 h-2.5 w-6"} -translate-x-1/2 rounded-b-full bg-[color:var(--accent)] shadow-[0_0_14px_rgba(156,213,255,0.82)]`}
            animate={{ scaleX: asleep ? 0.65 : happy ? 1.55 : isOpen ? 1.25 : 1, opacity: thinking ? [0.45, 1, 0.45] : 1 }}
            transition={{ duration: 0.65, repeat: thinking ? Infinity : 0 }}
          />
        </div>
      </div>

      <div className={`absolute left-1/2 ${tiny ? "top-[31px] h-4 w-7 rounded-t-lg" : "top-[4.9rem] h-12 w-16 rounded-t-[1.2rem]"} -translate-x-1/2 rounded-b-[2.5rem] bg-[linear-gradient(135deg,var(--card-bg-strong),var(--surface-soft),rgba(156,213,255,0.32))] ring-1 ring-[color:var(--border-blue)]`}>
        {!tiny && <div className="absolute bottom-5 left-4 h-3 w-8 border-b-4 border-[color:var(--primary)]/35" />}
      </div>

      <motion.div
        className={`absolute ${tiny ? "left-[8px] top-[31px] h-4 w-2" : "left-1 top-[4.7rem] h-10 w-5"} origin-top rounded-full bg-[linear-gradient(180deg,var(--card-bg-strong),rgba(122,170,206,0.38))]`}
        animate={{ rotate: waving || dancing ? [-8, -48, -8, -36, -8] : asleep ? 16 : [-6, 5, -6] }}
        transition={{ duration: waving || dancing ? 1.1 : 3.4, repeat: asleep ? 0 : Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className={`absolute ${tiny ? "right-[8px] top-[31px] h-4 w-2" : "right-1 top-[4.7rem] h-10 w-5"} origin-top rounded-full bg-[linear-gradient(180deg,var(--card-bg-strong),rgba(122,170,206,0.38))]`}
        animate={{ rotate: dancing ? [8, 48, 8, 36, 8] : asleep ? -16 : [6, -5, 6] }}
        transition={{ duration: dancing ? 1.1 : 3.2, repeat: asleep ? 0 : Infinity, ease: "easeInOut" }}
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

function TinyRobotBadge({ mood, asleep, isWaving, activity }) {
  return (
    <div className="relative grid h-full w-full place-items-center overflow-hidden rounded-full">
      <span className="absolute inset-0 rounded-full bg-[image:var(--gradient-brand)] opacity-35" />
      <span className="absolute inset-[3px] rounded-full border border-white/45 bg-white/28 shadow-[inset_0_1px_12px_rgba(255,255,255,0.32)] backdrop-blur-2xl dark:bg-[color:var(--card-bg-strong)]/32" />
      <span className="absolute -right-2 -top-2 h-10 w-10 rounded-full bg-[color:var(--accent)]/35 blur-xl" />

      <RobotMascot tiny mood={mood} asleep={asleep} isWaving={isWaving} activity={activity} />

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
  const activityTimer = useRef(null);
  const tinyPositionRef = useRef(null);
  const panelPositionRef = useRef(null);
  const panelDragControls = useDragControls();

  const currentUser = useMemo(() => getCurrentUser(), []);
  const role = normalizeRole(currentUser?.role || currentUser?.accountRole || currentUser?.systemRole || "student");
  const userFirstName = currentUser?.firstName || currentUser?.name?.split(" ")?.[0] || "there";
  const quickPrompts = useMemo(() => getAssistantQuickPrompts(role), [role]);

  const [collapsed, setCollapsed] = useState(getInitialCollapsed);
  const [launcherPosition, setLauncherPosition] = useState(() => getSafePosition(readJson(POSITION_KEY, null)));
  const [panelPosition, setPanelPosition] = useState(() => getSafePanelPosition(readJson(PANEL_POSITION_KEY, null)));
  const [messages, setMessages] = useState(getInitialMessages);
  const [input, setInput] = useState("");
  const [mood, setMood] = useState("wave");
  const [activity, setActivity] = useState("curious");
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

  const setTemporaryActivity = (nextActivity, nextMood = "happy", duration = 2800) => {
    window.clearTimeout(activityTimer.current);
    setActivity(nextActivity);
    setMood(nextMood);
    activityTimer.current = window.setTimeout(() => {
      setActivity("idle");
      if (!asleep) setMood("idle");
    }, duration);
  };

  const wake = (nextMood = "wave", nextActivity = "idle") => {
    setAsleep(false);
    setMood(nextMood);
    setActivity(nextActivity);
    window.clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(() => {
      setMood("sleep");
      setActivity("idle");
      setAsleep(true);
    }, 42000);
  };

  const interact = (type) => {
    setAsleep(false);
    if (type === "pet") {
      setHeartBurst(true);
      setTemporaryActivity("snack", "love", 2200);
      window.setTimeout(() => setHeartBurst(false), 1300);
      return;
    }
    if (type === "tickle") {
      setTemporaryActivity("dance", "happy", 3600);
      return;
    }
    if (type === "shake") {
      setTemporaryActivity("dizzy", "thinking", 2100);
      return;
    }
    if (type === "curious") {
      if (!asleep && activity === "idle") setTemporaryActivity("curious", "wave", 1800);
      return;
    }
    setTemporaryActivity("listening", "wave", 2200);
  };

  const persistCollapsed = (value) => {
    setCollapsed(value);
    localStorage.setItem(COLLAPSED_KEY, value ? "true" : "false");
    localStorage.removeItem(LEGACY_ENABLED_KEY);
    if (!value) wake("wave", "curious");
  };

  const saveCompanionName = (value) => {
    const clean = String(value || "").replace(/[^a-zA-Z0-9 _-]/g, "").trim().slice(0, 22);
    const next = clean || defaultCompanionName(companionGender);
    setCompanionName(next);
    localStorage.setItem(COMPANION_NAME_KEY, next);
    wake("happy", "dance");
  };

  const saveCompanionGender = (value) => {
    const nextGender = value === "female" ? "female" : "male";
    const previousDefault = defaultCompanionName(companionGender);
    setCompanionGender(nextGender);
    localStorage.setItem(COMPANION_GENDER_KEY, nextGender);

    if (!localStorage.getItem(COMPANION_NAME_KEY) || companionName === previousDefault) {
      const nextName = defaultCompanionName(nextGender);
      setCompanionName(nextName);
      localStorage.setItem(COMPANION_NAME_KEY, nextName);
    }
    wake("wave", "dance");
  };

  useEffect(() => {
    sessionStorage.setItem(CHAT_KEY, JSON.stringify(messages.slice(-18)));
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    wake("wave", "curious");
    const interval = window.setInterval(() => {
      if (asleep) return;
      const actionPool = collapsed
        ? ["idle", "wave", "curious", "sleep", "love"]
        : ["idle", "wave", "happy", "love", "dance", "curious", "listening"];
      const next = actionPool[Math.floor(Math.random() * actionPool.length)];
      if (next === "sleep") {
        setMood("sleep");
        setActivity("idle");
        setAsleep(true);
      } else if (next === "dance") {
        setTemporaryActivity("dance", "happy", 3200);
      } else if (next === "curious") {
        setTemporaryActivity("curious", "wave", 2600);
      } else if (next === "listening") {
        setTemporaryActivity("listening", "wave", 2400);
      } else {
        setMood(next);
        setActivity("idle");
      }
    }, collapsed ? 7000 : 8500);

    const onResize = () => {
      setLauncherPosition((prev) => {
        const next = getSafePosition(prev);
        writeJson(POSITION_KEY, next);
        return next;
      });
      setPanelPosition((prev) => {
        const next = getSafePanelPosition(prev);
        writeJson(PANEL_POSITION_KEY, next);
        return next;
      });
    };

    const onReset = () => {
      const tiny = getDefaultLauncherPosition();
      const panel = getDefaultPanelPosition();
      setLauncherPosition(tiny);
      setPanelPosition(panel);
      writeJson(POSITION_KEY, tiny);
      writeJson(PANEL_POSITION_KEY, panel);
      wake("happy", "dance");
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("guc-ai-companion-reset-position", onReset);
    return () => {
      window.clearInterval(interval);
      window.clearTimeout(idleTimer.current);
      window.clearTimeout(activityTimer.current);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("guc-ai-companion-reset-position", onReset);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collapsed, asleep]);

  const ask = (rawQuestion = input) => {
    const cleanQuestion = String(rawQuestion || "").trim();
    if (!cleanQuestion) return;

    wake("thinking", "listening");
    setInput("");
    setGreetingHidden(true);
    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: "user", text: cleanQuestion }]);

    const renameMatch = cleanQuestion.match(/(?:rename|name|call)\s+(?:you|him|her|it|my\s+pet|the\s+assistant)?\s*(?:to|as)?\s+([a-zA-Z][a-zA-Z0-9 _-]{1,22})/i);
    if (renameMatch) {
      const requestedName = renameMatch[1].replace(/^(male|female|boy|girl)$/i, "").trim();
      if (requestedName) {
        window.setTimeout(() => {
          saveCompanionName(requestedName);
          setMessages((prev) => [
            ...prev,
            {
              id: `b-${Date.now()}`,
              role: "assistant",
              title: "Renamed",
              text: `Done — my name is ${requestedName} now. Double-click me if you want me to do a tiny dance.`,
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
      setActivity("idle");
      if (answer.mood === "love" || /thank|cute|love|heart/i.test(cleanQuestion)) {
        setHeartBurst(true);
        window.setTimeout(() => setHeartBurst(false), 1300);
      }
      setMessages((prev) => [...prev, { id: `b-${Date.now()}`, role: "assistant", ...answer }]);
    }, 220);
  };

  const goTo = (path) => {
    wake("wave", "curious");
    if (!path || path.includes(":")) return;
    navigate(path);
    persistCollapsed(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    ask(input);
  };

  const openFromLauncher = () => {
    if (dragged.current) return;
    persistCollapsed(false);
  };

  const handleTinyDragStart = (event) => {
    tinyPositionRef.current = launcherPosition;
    dragStart.current = { x: event.clientX, y: event.clientY };
    dragged.current = false;
    interact("curious");
  };

  const handleTinyDrag = (event, info) => {
    if (Math.abs(info.offset.x) + Math.abs(info.offset.y) > 8) dragged.current = true;
  };

  const handleTinyDragEnd = (event, info) => {
    const base = tinyPositionRef.current || launcherPosition;
    const next = getSafePosition({ x: base.x + info.offset.x, y: base.y + info.offset.y });
    setLauncherPosition(next);
    writeJson(POSITION_KEY, next);
    if (Math.abs(info.velocity.x) + Math.abs(info.velocity.y) > 950) interact("shake");
    window.setTimeout(() => {
      dragged.current = false;
    }, 120);
  };

  const handlePanelDragStart = () => {
    panelPositionRef.current = panelPosition;
    dragged.current = false;
    interact("curious");
  };

  const handlePanelDrag = (event, info) => {
    if (Math.abs(info.offset.x) + Math.abs(info.offset.y) > 8) dragged.current = true;
  };

  const handlePanelDragEnd = (event, info) => {
    const base = panelPositionRef.current || panelPosition;
    const next = getSafePanelPosition({ x: base.x + info.offset.x, y: base.y + info.offset.y });
    setPanelPosition(next);
    writeJson(PANEL_POSITION_KEY, next);
    if (Math.abs(info.velocity.x) + Math.abs(info.velocity.y) > 950) interact("shake");
    window.setTimeout(() => {
      dragged.current = false;
    }, 120);
  };

  if (collapsed) {
    return (
      <motion.button
        type="button"
        drag
        dragMomentum={false}
        dragElastic={0.04}
        onDragStart={handleTinyDragStart}
        onDrag={handleTinyDrag}
        onDragEnd={handleTinyDragEnd}
        onClick={openFromLauncher}
        onDoubleClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          interact("tickle");
        }}
        initial={{ opacity: 0, scale: 0.5, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        whileHover={{ scale: 1.08, y: -2 }}
        whileTap={{ scale: 0.96 }}
        style={{ left: launcherPosition.x, top: launcherPosition.y, touchAction: "none" }}
        className="group fixed z-[70] grid h-[72px] w-[72px] cursor-grab place-items-center rounded-full border border-white/45 bg-white/18 shadow-[0_18px_50px_rgba(44,57,71,0.24)] outline-none backdrop-blur-2xl transition focus-visible:ring-4 focus-visible:ring-[color:var(--ring-soft)] active:cursor-grabbing dark:bg-[color:var(--card-bg-strong)]/22"
        aria-label={`Open ${companionName} AI companion`}
        title="Drag me · click to open · double-click for dance"
      >
        <span className="absolute inset-0 rounded-full bg-[color:var(--accent)]/15 blur-xl" />
        <TinyRobotBadge mood={mood} asleep={asleep} isWaving={mood === "wave"} activity={activity} />
        <span className="pointer-events-none absolute -left-32 top-1/2 hidden -translate-y-1/2 rounded-2xl border border-[color:var(--border-blue)] bg-[color:var(--surface-elevated)]/90 px-3 py-2 text-xs font-black text-[color:var(--ink)] opacity-0 shadow-[var(--shadow-card)] backdrop-blur-xl transition group-hover:opacity-100 xl:block">
          Drag me · click to open
        </span>
      </motion.button>
    );
  }

  return (
    <motion.div
      drag
      dragControls={panelDragControls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0.04}
      onDragStart={handlePanelDragStart}
      onDrag={handlePanelDrag}
      onDragEnd={handlePanelDragEnd}
      initial={{ opacity: 0, x: 35, y: 20, scale: 0.94 }}
      animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      style={{ left: panelPosition.x, top: panelPosition.y, touchAction: "none" }}
      className="fixed z-[70] hidden max-w-[calc(100vw-2rem)] select-none items-end gap-3 lg:flex"
    >
      <motion.aside
        initial={{ opacity: 0, x: 28, scale: 0.94 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 28, scale: 0.94 }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        className="w-[390px] overflow-hidden rounded-[32px] border border-[color:var(--border-blue)] bg-[color:var(--card-bg-strong)] shadow-[0_28px_90px_rgba(44,57,71,0.24)] backdrop-blur-2xl dark:shadow-[0_28px_90px_rgba(0,0,0,0.42)]"
      >
        <div className="relative overflow-hidden bg-[image:var(--gradient-brand)] p-4 text-white">
          <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/15 blur-2xl" />
          <div className="relative flex items-center justify-between gap-3">
            <button
              type="button"
              onPointerDown={(event) => panelDragControls.start(event)}
              className="flex min-w-0 flex-1 cursor-grab items-center gap-3 rounded-2xl text-left active:cursor-grabbing"
              aria-label={`Drag ${companionName} panel`}
              title="Drag the assistant panel"
            >
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/12 ring-1 ring-white/15">
                <Bot className="h-5 w-5 text-[color:var(--accent)]" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-black">{companionName}</p>
                <p className="truncate text-xs font-semibold text-white/62">{companionGender === "female" ? "Female" : "Male"} interactive desk pet · {role} mode</p>
              </div>
              <GripHorizontal className="ml-auto h-4 w-4 shrink-0 text-white/55" />
            </button>

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
                onClick={() => interact("pet")}
                className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-white transition hover:bg-white/15"
                aria-label="Pet companion"
                title="Pet / send hearts"
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
                  <p className="text-xs font-semibold text-[color:var(--muted)]">Rename, choose persona, then drag me anywhere on the dashboard.</p>
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
                wake("idle", "listening");
              }}
              onFocus={() => wake("wave", "listening")}
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

      <div className="relative flex flex-col items-center gap-2">
        <AnimatePresence>
          {!greetingHidden && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.94 }}
              className="absolute -left-44 -top-20 w-48 rounded-[24px] border border-[color:var(--border-blue)] bg-[color:var(--surface-elevated)]/95 p-3 text-sm font-bold text-[color:var(--ink)] shadow-[var(--shadow-card)] backdrop-blur-xl"
            >
              <button
                type="button"
                onClick={() => setGreetingHidden(true)}
                className="absolute right-2 top-2 text-[color:var(--muted)] hover:text-[color:var(--ink)]"
                aria-label="Hide greeting bubble"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              {getMoodLine(mood, asleep, userFirstName, companionName, activity)}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="button"
          onPointerDown={(event) => {
            if (event.detail > 1) return;
            panelDragControls.start(event);
          }}
          onClick={(event) => {
            if (dragged.current) return;
            event.stopPropagation();
            persistCollapsed(true);
          }}
          onDoubleClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            interact("tickle");
          }}
          className="group relative block cursor-grab rounded-[34px] p-1 outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--ring-soft)] active:cursor-grabbing"
          aria-label={`Drag ${companionName} or click to collapse to tiny circle`}
          title="Drag me · click to return to tiny circle · double-click for dance"
        >
          <span className="absolute inset-2 rounded-full bg-[color:var(--accent)]/30 opacity-0 blur-2xl transition group-hover:opacity-100" />
          <RobotMascot
            isOpen
            isWaving={mood === "wave"}
            mood={mood}
            asleep={asleep}
            heartBurst={heartBurst}
            activity={activity}
            onPet={(type) => interact(type)}
            onTickle={() => interact("tickle")}
          />
          <span className="absolute bottom-1 right-2 grid h-10 w-10 place-items-center rounded-2xl border border-white/50 bg-[image:var(--gradient-brand)] text-white shadow-[0_14px_30px_rgba(44,57,71,0.24)]">
            <MessageCircle className="h-4 w-4" />
          </span>
        </button>

        <div className="flex items-center gap-1 rounded-full border border-[color:var(--border-blue)] bg-[color:var(--surface-elevated)]/90 px-2 py-1 shadow-sm backdrop-blur-xl">
          <button
            type="button"
            onClick={() => interact("pet")}
            className="grid h-7 w-7 place-items-center rounded-full text-rose-400 transition hover:bg-rose-400/10"
            title="Pet"
          >
            <Heart className="h-3.5 w-3.5 fill-current" />
          </button>
          <button
            type="button"
            onClick={() => interact("tickle")}
            className="grid h-7 w-7 place-items-center rounded-full text-[color:var(--primary)] transition hover:bg-[color:var(--primary)]/10 dark:text-[color:var(--accent)]"
            title="Play"
          >
            <Wand2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => {
              setAsleep(true);
              setMood("sleep");
              setActivity("idle");
            }}
            className="grid h-7 w-7 place-items-center rounded-full text-[color:var(--muted)] transition hover:bg-[color:var(--muted)]/10"
            title="Nap"
          >
            <Moon className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
