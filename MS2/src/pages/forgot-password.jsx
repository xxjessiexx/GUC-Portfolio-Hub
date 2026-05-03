import { useState } from "react";
import AuthLayout from "../components/auth/AuthLayout";
import AuthHeader from "../components/auth/AuthHeader";
import AuthInput from "../components/auth/AuthInput";
import AuthSubmitButton from "../components/auth/AuthSubmitButton";
import AuthInputWrap from "@/components/auth/AuthInputWrap";
import AuthBottomLink from "../components/auth/AuthBottomLink";
import { useNavigate } from "react-router-dom";

import {
  Mail,
} from "lucide-react";

export default function ForgotPassword({ users, setCurrentUser }) {
 
  const [email, setEmail] = useState(
    sessionStorage.getItem("resetEmail") || ""
  );


  const [errors, setErrors] = useState({});
  const validate = () => {
    const newErrors = {};

    if (!email.trim()) newErrors.email = "Email is required";
   // else if (!email.endsWith("@student.guc.edu.eg")) 
   // newErrors.email = "Please use your GUC email address";
   // else if(!email.endsWith("@guc.edu.eg"))
   

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  
  const navigate = useNavigate();

const handleSubmit = (e) => {
  e.preventDefault();

  const newErrors = {};

  if (!email.trim()) {
    newErrors.email = "Email is required";
  } else {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const foundUser = users.find((user) => user.email === email);

    if (!foundUser) {
      newErrors.email = "This email is not registered";
    }
  }

  setErrors(newErrors);

  if (Object.keys(newErrors).length > 0) return;

  sessionStorage.setItem("resetEmail", email);

  navigate("/verifyOTP", { state: { email } });
};

  console.log("Users:", users);
console.log("Typed email:", email);

  return (
  
     
    <AuthLayout>
      
      <AuthHeader
  badge="Student Portfolio Platform"
  title="Forgot"
  highlightedWord="Password"
  description="Enter your email and we’ll send you a reset link"
  showBrand={true}
/>
  <form onSubmit={handleSubmit}>
      <AuthInput
        label="Email"
        type="email"
        required
        icon={Mail}
        value={email}
        placeholder="name@student.guc.edu.eg"
        error={errors.email}
        onChange={(e) => setEmail(e.target.value)}
      />
      
      <div className="mt-6">
      <AuthSubmitButton text="Send Reset Link" onClick={handleSubmit} className="mt-6 space-y-4" >
        Send
      </AuthSubmitButton>
      </div>
      </form>
      <AuthBottomLink backLabel="Back to login"
      backTo="/login">
      
    </AuthBottomLink>
    </AuthLayout>
   
    
  );
}
