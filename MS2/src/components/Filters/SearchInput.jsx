import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function SearchInput({
  search,
  setSearch,
  placeholder = "Search...",
}) {
  return (
    <div className="relative w-72">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        size={16}
      />

      <Input
        type="text"
        placeholder={placeholder}
        className="pl-9 bg-transparent"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}