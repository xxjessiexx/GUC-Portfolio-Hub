import { useState } from "react";
import AuthLayout from "../components/auth/AuthLayout";
import AuthHeader from "../components/auth/AuthHeader";
import AuthInput from "../components/auth/AuthInput";
import AuthSubmitButton from "../components/auth/AuthSubmitButton";
import AuthInputWrap from "@/components/auth/AuthInputWrap";
import AuthBottomLink from "../components/auth/AuthBottomLink";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
 
  const [email, setEmail] = useState(
    sessionStorage.getItem("resetEmail") || ""
  );

  const navigate = useNavigate();

const handleSubmit = (e) => {
  e.preventDefault();

  sessionStorage.setItem("resetEmail", email);

  navigate("/login"); // 🔥 redirect here
};

  return (
   
    <AuthLayout>
      
      <AuthHeader
  badge="Student Portfolio Platform"
  title="Forgot"
  highlightedWord="Password"
  description="Enter your email and we’ll send you a reset link"
  showBrand={true}
/>

      <AuthInput
        label="Email"
        type="email"
        value={email}
        placeholder="name@student.guc.edu.eg"
        onChange={(e) => setEmail(e.target.value)}
      />
      
      <div className="mt-6">
      <AuthSubmitButton text="Send Reset Link" onClick={handleSubmit} className="mt-6 space-y-4" >
        Send
        </AuthSubmitButton>
      </div>
      <AuthBottomLink >
      
    </AuthBottomLink>
    </AuthLayout>
    
  );
}