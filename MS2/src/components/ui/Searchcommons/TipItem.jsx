import { CheckCircle2 } from "lucide-react";
export default function TipItem({ text
}) {
  return (
    <div className="flex items-start gap-3">
      <CheckCircle2
        size={18}
        className="text-[#69A7FF] mt-[2px] shrink-0"
      />

      <p className="leading-6 text-gray-500 font-medium">
        {text}
      </p>
    </div>
  );
}

