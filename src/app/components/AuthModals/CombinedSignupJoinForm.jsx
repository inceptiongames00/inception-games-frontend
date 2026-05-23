"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Loader2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { API, setTokens, setStoredUser, getTokens } from "@/lib/api";

export default function CombinedSignupJoinForm({ event, isOpen, onClose, isAuthenticated }) {
  const { user } = useAuth();
  const [step, setStep] = useState("form"); // 'form', 'loading', 'success'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Form state for non-authenticated users
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    passwordConfirm: "",
    gamingProfile: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError("Full name is required");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!formData.email.includes("@")) {
      setError("Please enter a valid email");
      return false;
    }
    if (!formData.phone.trim()) {
      setError("Phone number is required");
      return false;
    }
    if (!formData.password) {
      setError("Password is required");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (formData.password !== formData.passwordConfirm) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSignupAndJoin = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setStep("loading");
    setError("");

    try {
      // Step 1: Register user
      const signupRes = await fetch(API.REGISTER_PERSONAL_INFO, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phoneNumber: formData.phone,
          password: formData.password,
          // Optional fields
          gamingProfile: formData.gamingProfile || formData.fullName,
        }),
      });

      if (!signupRes.ok) {
        const errorData = await signupRes.json();
        throw new Error(errorData.message || "Signup failed");
      }

      const signupData = await signupRes.json();
      
      // Extract tokens from response (handle various API response formats)
      const userData = signupData.data || signupData.user || {};
      const accessToken = signupData.data?.accessToken || 
                         signupData.accessToken || 
                         signupData.token ||
                         userData.accessToken ||
                         "";
      
      const refreshToken = signupData.data?.refreshToken || 
                          signupData.refreshToken || 
                          userData.refreshToken ||
                          "";

      // Store tokens and user data
      if (accessToken) {
        setTokens({
          accessToken,
          refreshToken: refreshToken || "",
        });
        setStoredUser(userData);

        // Step 2: Join event
        const joinRes = await fetch(API.EVENT_SIGNUP, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            eventId: event.id,
            userId: userData.id || userData.userId,
          }),
        });

        if (!joinRes.ok) {
          console.warn("Event join request returned non-ok status, but signup was successful");
          // Don't throw error here - user is registered even if event join had issues
        }

        // Success!
        setStep("success");
        setTimeout(() => {
          onClose?.();
          // Optionally redirect to event or profile
          window.location.href = "/profile";
        }, 2000);
      } else {
        throw new Error("No access token received from signup");
      }
    } catch (err) {
      console.error("Signup/Join error:", err);
      setError(err.message || "Failed to complete signup and event registration");
      setStep("form");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinEvent = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError("You must be logged in to join");
      return;
    }

    setLoading(true);
    setStep("loading");
    setError("");

    try {
      const tokens = getTokens();
      const res = await fetch(API.EVENT_SIGNUP, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokens?.accessToken}`,
        },
        body: JSON.stringify({
          eventId: event.id,
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
      setStep("form");
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

          {step === "loading" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Loader2 size={40} className="text-purple-500 animate-spin mx-auto mb-4" />
              <p className="text-white font-semibold">Processing your request...</p>
            </motion.div>
          )}

          {step === "form" && (
            <form onSubmit={isAuthenticated ? handleJoinEvent : handleSignupAndJoin}>
              {/* Non-authenticated user form */}
              {!isAuthenticated && (
                <>
                  {/* Full Name */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                      disabled={loading}
                    />
                  </div>

                  {/* Email */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                      disabled={loading}
                    />
                  </div>

                  {/* Phone */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                      disabled={loading}
                    />
                  </div>

                  {/* Password */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter password (min 6 characters)"
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Confirm Password *
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="passwordConfirm"
                      value={formData.passwordConfirm}
                      onChange={handleInputChange}
                      placeholder="Confirm password"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                      disabled={loading}
                    />
                  </div>

                  {/* Gaming Profile (Optional) */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Gaming Profile / IGN (Optional)
                    </label>
                    <input
                      type="text"
                      name="gamingProfile"
                      value={formData.gamingProfile}
                      onChange={handleInputChange}
                      placeholder="Your gaming username"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                      disabled={loading}
                    />
                  </div>
                </>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all hover:shadow-lg hover:shadow-purple-500/30"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={18} className="animate-spin" />
                    Processing...
                  </span>
                ) : isAuthenticated ? (
                  "Join Event"
                ) : (
                  "Create Account & Join Event"
                )}
              </button>

              {/* Terms */}
              {!isAuthenticated && (
                <p className="text-xs text-gray-500 text-center mt-4">
                  By signing up, you agree to our Terms of Service and Privacy Policy
                </p>
              )}
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
