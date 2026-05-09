import { Box } from "lucide-react";
export default function InsightRow({
  title,
  subtitle,
  number,
  color,
}) {
  return (
          <div
        className="
          flex items-center justify-between
          p-4
          rounded-2xl
          border border-gray-100
          bg-white/85
        "
      >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
          <Box size={20} />
        </div>

        <div>
          <h4 className="font-black text-[#16253A]">
            {title}
          </h4>

          <p className="text-sm text-gray-500">
            {subtitle}
          </p>
        </div>
      </div>

      <span className="text-l font-black text-[#16253A]">
        {number}
      </span>
    </div>
  );
  
}