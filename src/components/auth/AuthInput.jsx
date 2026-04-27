import AuthField from "./AuthField";
import AuthInputWrap from "./AuthInputWrap";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AuthInput({
  label,
  icon: Icon,
  error,
  ...props
}) {
  return (
    <AuthField error={error}>
      <Label className="font-bold text-[#2C3947]">{label}</Label>

      <AuthInputWrap error={error}>
        {Icon && <Icon className="h-5 w-5 text-[#355872]" />}

        <Input
          {...props}
          className="border-0 bg-transparent shadow-none focus-visible:ring-0"
        />
      </AuthInputWrap>
    </AuthField>
  );
}