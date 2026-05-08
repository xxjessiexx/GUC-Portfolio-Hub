import { useEffect, useRef, useState } from "react";

export default function PinInputLikeMantine({
  length = 6,
  value = "",
  onChange,
  disabled = false,
}) {
  const [values, setValues] = useState(Array(length).fill(""));
  const inputsRef = useRef([]);

  // sync external value → internal state
  useEffect(() => {
    if (!value) return;
    const arr = value.split("").slice(0, length);
    setValues((prev) =>
      prev.map((_, i) => arr[i] || "")
    );
  }, [value]);

  const update = (arr) => {
    setValues(arr);
    onChange?.(arr.join(""));
  };

  const handleChange = (val, idx) => {
    if (!/^\d?$/.test(val)) return;

    const copy = [...values];
    copy[idx] = val;
    update(copy);

    if (val && idx < length - 1) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace") {
      if (values[idx]) {
        const copy = [...values];
        copy[idx] = "";
        update(copy);
      } else if (idx > 0) {
        inputsRef.current[idx - 1]?.focus();
      }
    }

    if (e.key === "ArrowLeft" && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }

    if (e.key === "ArrowRight" && idx < length - 1) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length)
      .split("");

    if (!pasted.length) return;

    const filled = Array(length)
      .fill("")
      .map((_, i) => pasted[i] || "");

    update(filled);

    const nextIndex = Math.min(pasted.length, length - 1);
    inputsRef.current[nextIndex]?.focus();
  };

  return (
    <div className="flex gap-2">
      {values.map((val, i) => (
        <input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          value={val}
          disabled={disabled}
          onChange={(e) => handleChange(e.target.value, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onPaste={handlePaste}
          maxLength={1}
          className="
            w-12 h-12 text-center text-xl
            border rounded-md
            focus:outline-none focus:ring-2 focus:ring-blue-500
            disabled:opacity-50
          "
        />
      ))}
    </div>
  );
}