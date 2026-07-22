"use client";

import { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Loader2, ChevronRight } from "lucide-react";
import { AuthContext } from "@/app/context/AuthContext";
import { API, setTokens, setStoredUser } from "@/lib/api";

export default function CombinedSignupJoinForm({ event, isOpen, onClose, isAuthenticated }) {
  const { user, resendOTP } = useContext(AuthContext);
  const [step, setStep] = useState("email"); // 'email', 'otp', 'personalInfo', 'success'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);
  const [message, setMessage] = useState("");
  
  // Multi-step form data
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [otp, setOtp] = useState("");
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [username, setUsername] = useState(user?.username || "");

  // Resend OTP Timer Effect
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Handle Resend OTP
  const handleResendOTP = async () => {
    setError("");
    setResendLoading(true);
    try {
      await resendOTP(email);
      setMessage("OTP resent successfully! Check your email.");
      setResendTimer(60); // 60 second cooldown
    } catch (err) {
      setError(err.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  // Step 1: Send OTP via email
  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }
    
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch(API.REGISTER_SEND_OTP, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: email.trim(),
          ...(phone && { phone })
        }),
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || data.message || "Failed to send OTP");
      }
      setStep("otp");
      setResendTimer(60); // Start 60 second cooldown
    } catch (err) {
      console.error("Send OTP error:", err);
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      setError("Please enter the OTP");
      return;
    }
    
    setLoading(true);
    setError("");
    try {
      const res = await fetch(API.REGISTER_VERIFY_OTP, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: email.trim(),
          otp: otp.trim()
        }),
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || data.message || "Invalid OTP");
      }
      
      // Store userId in sessionStorage for next step
      if (data.userId) {
        sessionStorage.setItem("temp_userId", data.userId);
      }
      
      setStep("personalInfo");
    } catch (err) {
      console.error("Verify OTP error:", err);
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Save personal info and join event
  const handleSavePersonalInfo = async (e) => {
    e.preventDefault();
    
    if (!fullName.trim()) {
      setError("Full name is required");
      return;
    }
    if (!username.trim()) {
      setError("Username is required");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      // Save personal info
      const personalRes = await fetch(API.REGISTER_PERSONAL_INFO, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          full_name: fullName.trim(),
          username: username.trim(),
        }),
      });
      
      if (!personalRes.ok) {
        const errorData = await personalRes.json();
        throw new Error(errorData.error || errorData.message || "Failed to save personal info");
      }
      
      // Get userId from sessionStorage
      const userId = sessionStorage.getItem("temp_userId");
      
      // Create session token since API uses email-based auth
      const accessToken = `email-otp-auth:${email.trim()}`;
      const tokens = {
        accessToken,
        refreshToken: "",
        email: email.trim(),
      };
      
      const userObj = {
        id: userId || `user_${Date.now()}`,
        email: email.trim(),
        fullName: fullName.trim(),
        username: username.trim(),
        phone: phone || "",
        authMethod: "email",
      };
      
      setTokens(tokens);
      setStoredUser(userObj);
      
      // Now join the event
      const joinRes = await fetch(API.EVENT_SIGNUP, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          eventId: event?.id,
          userId: userId || userObj.id,
        }),
      });
      
      if (!joinRes.ok) {
        console.warn("Event join had issues but signup was successful");
      }
      
      // Clean up
      sessionStorage.removeItem("temp_userId");
      setStep("success");
      
      setTimeout(() => {
        onClose?.();
        window.location.href = "/profile";
      }, 2000);
    } catch (err) {
      console.error("Save personal info error:", err);
      setError(err.message || "Failed to complete registration");
    } finally {
      setLoading(false);
    }
  };

  // For authenticated users: join event directly
  const handleJoinEvent = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError("You must be logged in to join");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const accessToken = localStorage.getItem("accessToken");
      const res = await fetch(API.EVENT_SIGNUP, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          eventId: event?.id,
          userId: user?.id || user?.userId,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to join event");
      }

      setStep("success");
      setTimeout(() => {
        onClose?.();
      }, 2000);
    } catch (err) {
      console.error("Join event error:", err);
      setError(err.message || "Failed to join event");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gradient-to-b from-gray-900 to-gray-950 rounded-2xl border border-white/10 max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-b from-gray-900 to-transparent p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">
              {isAuthenticated ? "Join Event" : "Join Event - Sign Up"}
            </h2>
            <p className="text-sm text-gray-400 mt-1">{event?.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Success State */}
          {step === "success" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                <div className="text-green-400 font-bold text-2xl">✓</div>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Success!</h3>
              <p className="text-gray-400">
                {isAuthenticated
                  ? "You've successfully joined the event!"
                  : "Account created and event joined successfully!"}
              </p>
              <p className="text-sm text-gray-500 mt-3">Redirecting to your profile...</p>
            </motion.div>
          )}

          {/* Loading State */}
          {loading && step !== "success" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Loader2 size={40} className="text-purple-500 animate-spin mx-auto mb-4" />
              <p className="text-white font-semibold">Processing your request...</p>
            </motion.div>
          )}

          {/* Authenticated User - Simple Join */}
          {isAuthenticated && step !== "success" && !loading && (
            <form onSubmit={handleJoinEvent}>
              <p className="text-gray-300 mb-6">
                Welcome back, {user?.fullName || "Player"}! Click below to join this event.
              </p>
              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all hover:shadow-lg hover:shadow-purple-500/30"
              >
                Join Event
              </button>
            </form>
          )}

          {/* Non-Authenticated User - Multi-Step Form */}
          {!isAuthenticated && step !== "success" && !loading && (
            <>
              {/* Step 1: Email & Phone */}
              {step === "email" && (
                <form onSubmit={handleSendOTP}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                      }}
                      placeholder="Enter your email"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                      disabled={loading}
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter your phone number"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                      disabled={loading}
                    />
                  </div>

                  {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all hover:shadow-lg hover:shadow-purple-500/30 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Sending OTP...
                      </>
                    ) : (
                      <>
                        Send OTP
                        <ChevronRight size={18} />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Step 2: OTP Verification */}
              {step === "otp" && (
                <form onSubmit={handleVerifyOTP}>
                  <p className="text-gray-300 mb-4 text-sm">
                    Enter the OTP sent to {email}
                  </p>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      OTP Code *
                    </label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => {
                        setOtp(e.target.value);
                        setError("");
                        setMessage("");
                      }}
                      placeholder="Enter 6-digit OTP"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors text-center text-2xl tracking-widest"
                      disabled={loading}
                    />
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-gray-400">Check your email</p>
                      {resendTimer > 0 ? (
                        <p className="text-xs text-gray-500">
                          Resend in {resendTimer}s
                        </p>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResendOTP}
                          disabled={resendLoading}
                          className="text-xs text-purple-400 hover:text-purple-300 disabled:text-gray-600 transition-colors"
                        >
                          {resendLoading ? "Sending..." : "Resend OTP"}
                        </button>
                      )}
                    </div>
                  </div>

                  {message && (
                    <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-300 text-sm">
                      {message}
                    </div>
                  )}

                  {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all hover:shadow-lg hover:shadow-purple-500/30 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Verify OTP
                        <ChevronRight size={18} />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setStep("email");
                      setOtp("");
                      setError("");
                    }}
                    className="w-full mt-3 py-2 px-4 text-purple-400 hover:text-purple-300 font-medium transition-colors"
                  >
                    Back to Email
                  </button>
                </form>
              )}

              {/* Step 3: Personal Information */}
              {step === "personalInfo" && (
                <form onSubmit={handleSavePersonalInfo}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        setError("");
                      }}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                      disabled={loading}
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Username *
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        setError("");
                      }}
                      placeholder="Choose your username"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                      disabled={loading}
                    />
                  </div>

                  {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all hover:shadow-lg hover:shadow-purple-500/30"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 size={18} className="animate-spin" />
                        Creating Account & Joining...
                      </span>
                    ) : (
                      "Create Account & Join Event"
                    )}
                  </button>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    By signing up, you agree to our Terms of Service and Privacy Policy
                  </p>
                </form>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
