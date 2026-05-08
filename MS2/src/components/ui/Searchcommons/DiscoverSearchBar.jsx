import { Search } from "lucide-react";

export default function DiscoverSearchBar({
  placeholder,
  value,
  onChange,
}) {
  return (
    <div
      className="
        w-full
        h-[64px]
        bg-white
        border border-gray-100
        rounded-[24px]
        shadow-sm
        flex items-center
        px-5
      "
    >
      <Search
        size={20}
        className="text-gray-400 shrink-0"
      />

      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="
          flex-1
          ml-4
          bg-transparent
          outline-none
          text-[#16253A]
          placeholder:text-gray-400
          text-[17px]
          font-medium
        "
      />
    </div>
  );
}