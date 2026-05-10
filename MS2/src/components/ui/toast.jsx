export default function Toast({ notification, onClose }) {
  if (!notification) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[999] w-[500px] rounded-2xl border border-white/10 bg-[linear-gradient(180deg,#2C3947,#355872)] p-4 text-white shadow-[18px_0_70px_rgba(44,57,71,0.24)] backdrop-blur-2xl transition-all duration-300 ease-out animate-slide-in">
      <div className="flex items-start justify-between">
        <h3 className="text-sm font-bold text-white">
          {notification.title}
        </h3>

        <button
          type="button"
          onClick={onClose}
          className="text-xs text-white/55 transition hover:text-white"
        >
          ✕
        </button>
      </div>

      <p className="mt-1 text-sm font-semibold text-white/65">
        {notification.text}
      </p>

      <p className="mt-2 text-xs font-semibold text-white/45">
        {notification.time}
      </p>
    </div>
  );
}