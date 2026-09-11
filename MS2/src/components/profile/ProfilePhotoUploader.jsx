import { useRef } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Pencil } from "lucide-react";

export default function ProfilePhotoUploader({ image, setImage, name, size = "default" }) {
  const fileInputRef = useRef();

  const initials = name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setImage(imageUrl);
  };

  const compact = size === "compact";

  return (
    <div className="flex items-center">
      <div className="relative">
        <Avatar
          className={`${
            compact ? "h-[76px] w-[76px]" : "h-32 w-32"
          } ring-2 ring-white/40 shadow-[0_10px_26px_rgba(53,88,114,0.16)]`}
        >
          <AvatarImage src={image} />

          <AvatarFallback className="bg-[linear-gradient(135deg,var(--primary),var(--secondary))] text-3xl font-black text-white">
            {initials}
          </AvatarFallback>
        </Avatar>

        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          className={`absolute bottom-0 right-0 grid place-items-center rounded-full bg-[color:var(--primary)] text-white shadow-lg transition hover:scale-105 ${
            compact ? "h-8 w-8" : "h-10 w-10"
          }`}
        >
          <Pencil className="h-4 w-4" />
        </button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleUpload}
          className="hidden"
          accept="image/*"
        />
      </div>
    </div>
  );
}