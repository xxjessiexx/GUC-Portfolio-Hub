import AuthField from "./AuthField";
import AuthInputWrap from "./AuthInputWrap";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

import {
  Eye,
  EyeOff,
} from "lucide-react";

export default function AuthInput({
  label,
  icon: Icon,
  error,
  className = "",
  showPassword,
  setShowPassword,
  enableToggle = false,
  tapScale,
  easeOutExpo,
  ...props
}) {

  const isPassword = props.type === "password" && enableToggle;

  return (
    <AuthField error={error}>
      <Label className="font-bold text-[color:var(--dark)]">{label}</Label>

      <AuthInputWrap error={error}>
        {Icon && <Icon className="h-5 w-5 text-[color:var(--primary)]" />}

        <Input
          {...props}
          type={
            isPassword
              ? showPassword
                ? "text"
                : "password"
              : props.type
          }
          className={`border-0 bg-transparent shadow-none focus-visible:ring-0 ${className}`}
        />

          {isPassword && (
            <motion.button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                whileHover={{ scale: 1.08 }}
                whileTap={tapScale}
                transition={{ duration: 0.18, ease: easeOutExpo }}
                className="text-[color:var(--muted)] hover:text-[color:var(--primary)]"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </motion.button>
          )}
      </AuthInputWrap>
    </AuthField>
  );
}