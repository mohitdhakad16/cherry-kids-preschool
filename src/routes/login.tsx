import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { KeyRound, Mail, ArrowLeft, Lock, ShieldCheck, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: AuthScreen,
});

type AuthView = "login" | "forgot" | "otp-verify" | "reset-password";

// Place your Web3Forms Access Key here (the same one used in your contact page)
const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_KEY;

function AuthScreen() {
  const [view, setView] = useState<AuthView>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [inputOtp, setInputOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  const [message, setMessage] = useState({ text: "", isError: false });
  const [loading, setLoading] = useState(false);

  // 1. STANDARD LOGIN HANDLER
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", isError: false });
    
    const currentValidPassword = localStorage.getItem("sunbeam_admin_fallback_pass") || "admin123";

    setTimeout(() => {
      setLoading(false);
      if (
        email.trim().toLowerCase() === "cherrykidspreprimaryschool@gmail.com" && 
        password === currentValidPassword
      ) {
        localStorage.setItem("sunbeam_session_active", "true");
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("user_role", "admin");
        
        window.location.href = "/admin";
      } else {
        setMessage({ text: "Invalid administrator credentials.", isError: true });
      }
    }, 400);
  };

  // 2. GENERATE AND SEND OTP VIA WEB3FORMS
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", isError: false });

    if (email.trim().toLowerCase() !== "cherrykidspreprimaryschool@gmail.com") {
      setMessage({ text: "Provided email is not registered as an administrator.", isError: true });
      setLoading(false);
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);

    try {
      // Structure the payload exactly how Web3Forms expects it
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          from_name: "Cherry Kids Security Gateway",
          subject: "Admin Portal - Password Reset Security Code",
          to_email: email, // Sends it explicitly to your email address
          message: `Your requested 6-digit administrative verification code is: ${code}. This code is valid for temporary verification access. Request a new code if you did not initiate this change.`,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setView("otp-verify");
        setMessage({ 
          text: `Security code successfully sent! Please check your email inbox (${email}) for the OTP.`, 
          isError: false 
        });
      } else {
        throw new Error(result.message || "Web3Forms submission failed");
      }
    } catch (error) {
      // Fallback fallback so local testing is never completely broken if the key is empty
      setView("otp-verify");
      setMessage({ 
        text: `Web3Forms dispatch pending configuration. For local testing, your OTP code is: ${code}`, 
        isError: false 
      });
    } finally {
      setLoading(false);
    }
  };

  // 3. VERIFY INPUT OTP MATCH
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputOtp === generatedOtp) {
      setMessage({ text: "Identity authenticated successfully. Provide your new security credentials.", isError: false });
      setView("reset-password");
    } else {
      setMessage({ text: "Invalid authorization code. Please try again.", isError: true });
    }
  };

  // 4. APPLY NEW PASSWORD & SEND BACK TO LOGIN
  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      // 1. Update password store locally
      localStorage.setItem("sunbeam_admin_fallback_pass", newPassword);
      setLoading(false);
      
      // 2. Clear values out and send back to the login presentation screen
      setView("login");
      setPassword(""); 
      setMessage({ text: "Password updated successfully! Please log in now using your new credentials.", isError: false });
    }, 400);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-6 bg-background">
      <div className="w-full max-w-md bg-card border border-border rounded-3xl p-8 shadow-sm">
        
        {message.text && (
          <div className={`p-4 rounded-xl text-sm mb-6 ${message.isError ? "bg-destructive/10 text-destructive" : "bg-emerald-500/10 text-emerald-600 font-medium"}`}>
            {message.text}
          </div>
        )}

        {/* VIEW 1: LOGIN */}
        {view === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold tracking-tight">Admin Portal</h1>
              <p className="text-sm text-muted-foreground mt-1">Sign in to manage Cherry Kids Admin Panel</p>
            </div>
            
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                <input type="email" required className="w-full border rounded-xl p-2.5 pl-10 bg-background text-sm" placeholder="info@example.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">Password</label>
                <button type="button" onClick={() => { setView("forgot"); setMessage({text:"", isError:false}); }} className="text-xs text-primary hover:underline font-medium">Forgot password?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                <input type="password" required className="w-full border rounded-xl p-2.5 pl-10 bg-background text-sm" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground py-2.5 rounded-xl font-medium hover:opacity-90 transition text-sm shadow-sm flex items-center justify-center gap-2 cursor-pointer">
              <KeyRound className="h-4 w-4" /> {loading ? "Signing in..." : "Login"}
            </button>
          </form>
        )}

        {/* VIEW 2: REQUEST OTP */}
        {view === "forgot" && (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <button type="button" onClick={() => setView("login")} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-2 transition">
              <ArrowLeft className="h-3 w-3" /> Back to login
            </button>
            <div className="mb-4">
              <h1 className="text-2xl font-bold tracking-tight">Reset Password</h1>
              <p className="text-sm text-muted-foreground mt-1">Enter your registered email below to receive a 6-digit verification code via email.</p>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">Confirm Admin Email</label>
              <input type="email" required className="w-full border rounded-xl p-2.5 bg-background text-sm" placeholder="cherrykidspreprimaryschool@gmail.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground py-2.5 rounded-xl font-medium hover:opacity-90 transition text-sm shadow-sm flex items-center justify-center gap-2 cursor-pointer">
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> {loading ? "Sending Email Code..." : "Send Verification OTP"}
            </button>
          </form>
        )}

        {/* VIEW 3: INPUT OTP */}
        {view === "otp-verify" && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="mb-4">
              <h1 className="text-2xl font-bold tracking-tight">Enter Secure OTP</h1>
              <p className="text-sm text-muted-foreground mt-1">Provide the 6-digit recovery code sent to your inbox.</p>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">6-Digit Verification Code</label>
              <input 
                type="text" required maxLength={6} className="w-full border rounded-xl p-3 bg-background text-center text-xl font-mono tracking-widest" placeholder="000000" 
                value={inputOtp} onChange={e => setInputOtp(e.target.value)} 
              />
            </div>

            <button type="submit" className="w-full bg-primary text-primary-foreground py-2.5 rounded-xl font-medium hover:opacity-90 transition text-sm shadow-sm cursor-pointer">
              Verify Credentials
            </button>
          </form>
        )}

        {/* VIEW 4: NEW PASSWORD */}
        {view === "reset-password" && (
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="mb-4">
              <h1 className="text-2xl font-bold tracking-tight">Create New Password</h1>
              <p className="text-sm text-muted-foreground mt-1">Identity confirmed. Establish a new strong administrative password.</p>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">New Password</label>
              <input type="password" required className="w-full border rounded-xl p-2.5 bg-background text-sm" placeholder="Enter new password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-emerald-600 text-white py-2.5 rounded-xl font-medium hover:bg-emerald-700 transition text-sm shadow-sm flex items-center justify-center gap-2 cursor-pointer">
              <ShieldCheck className="h-4 w-4" /> {loading ? "Saving changes..." : "Save New Password"}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}