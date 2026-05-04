import { useRef } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Pencil } from "lucide-react";

export default function ProfilePhotoUploader({ image, setImage, name }) {
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

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <Avatar className="h-32 w-32 ring-4 ring-white/20 shadow-xl">
          <AvatarImage src={image} />

          <AvatarFallback className="bg-[linear-gradient(135deg,var(--primary),var(--secondary))] text-3xl font-black text-white">
            {initials}
          </AvatarFallback>
        </Avatar>

        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          className="absolute bottom-0 right-0 grid h-10 w-10 place-items-center rounded-full bg-[color:var(--primary)] text-white shadow-lg transition hover:scale-105"
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