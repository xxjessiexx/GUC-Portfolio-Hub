export default function Toast({ notification, onClose }) {
  if (!notification) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[999] w-[500px] border-r border-white/10 bg-[linear-gradient(180deg,#2C3947,#355872)] text-white shadow-[18px_0_70px_rgba(44,57,71,0.24)] backdrop-blur-2xl transition-all duration-300 ease-out rounded-2xl bg-white p-4 shadow-xl border border-gray-200 animate-slide-in">
      
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-sm text-white shadow-[18px_0_70px_rgba(44,57,71,0.24)] backdrop-blur-2xl">
          {notification.title}
        </h3>

        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-50 text-xs"
        >
          ✕
        </button>
      </div>

      <p className="text-sm font-semibold text-white/55 mt-1">
        {notification.text}
      </p>

      <p className="text-xs font-semibold text-white/55 mt-2">
        {notification.time}
      </p>
    </div>
  );
}