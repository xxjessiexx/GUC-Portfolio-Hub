import { useState} from "react";
import { useNavigate } from "react-router-dom";

import AuthLayout from "@/components/auth/AuthLayout";
import AuthHeader from "@/components/auth/AuthHeader";
import AuthSubmitButton from "@/components/auth/AuthSubmitButton";
import AuthBottomLink from "@/components/auth/AuthBottomLink";

import { useLocation } from "react-router-dom";
//import { PinInput } from "@mantine/core";

import {
InputOTP,
InputOTPGroup,
InputOTPSlot,
} from "@/components/ui/input-otp";
import PinInputLikeMantine from "@/components/ui/PinInputLikeMantine";

export default function VerifyOTP() {
const [otp, setOtp] = useState("");
const navigate = useNavigate();
const location = useLocation();

const email =
location.state?.email || sessionStorage.getItem("resetEmail");

const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/SetPassword", { state: { email } });
};

return (
    <AuthLayout>
    <AuthHeader
        showBrand
        badge="Student Portfolio Platform"
        title="Check your"
        highlightedWord="email"
        description="Input the code that was sent to your email"
    />

    <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="flex justify-center mt-10">
         <PinInputLikeMantine
        length={6}
        value={otp}
        onChange={setOtp}
      />
        </div>
            
        <AuthSubmitButton disabled={otp.length !== 6}>
  Continue
</AuthSubmitButton>
    </form>
    <div className="my-8 flex items-center gap-4 font-semibold text-[color:var(--muted)]">
    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[color:var(--secondary)]/30 to-transparent" />

    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[color:var(--secondary)]/30 to-transparent" />
    </div>
    <AuthBottomLink
            text="Didn't get any code?"
            linkText="Click to resend"
            to="/VerifyOTP"
            backLabel="Back to login"
            backTo="/login"
    />
    </AuthLayout>
);
}