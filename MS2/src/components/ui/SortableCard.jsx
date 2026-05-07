import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableCard({
  id,
  left,
  updated,
  middle,
  right,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border rounded-xl px-6 py-5 
      grid grid-cols-[2.4fr_1fr_1.4fr_0.8fr_1.2fr_1fr]
      items-center gap-6 bg-white
      ${isDragging ? "shadow-xl scale-[1.02]" : ""}
    `}
    >
      {/* LEFT */}
      <div className="flex items-center gap-5 min-w-0">

        {/* DRAG HANDLE */}
        <div
          {...listeners}
          {...attributes}
          className="grid grid-cols-2 gap-[4px]
          cursor-grab active:cursor-grabbing
          opacity-70 hover:opacity-100 mr-2"
        >
          {[...Array(6)].map((_, i) => (
            <span
              key={i}
              className="w-[4px] h-[4px] rounded-full bg-[#3A3558]"
            />
          ))}
        </div>

        {left}
      </div>

      {/* UPDATED */}
      <div className="text-sm font-medium text-gray-500">
        {updated}
      </div>

      {/* MIDDLE */}
      {middle}

      {/* RIGHT */}
      <div className="flex justify-end gap-2">
        {right}
      </div>
    </div>
  );
}