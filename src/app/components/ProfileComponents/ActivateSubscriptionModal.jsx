"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle, CheckCircle, Loader2, ChevronDown } from "lucide-react";
import Swal from "sweetalert2";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://inception-games.an.r.appspot.com/api/v1";

export default function ActivateSubscriptionModal({
  isOpen,
  onClose,
  subscription,
  userId,
  onSuccess,
}) {
  const [trxId, setTrxId] = useState("");
  const [reference, setReference] = useState("");
  const [last4digit, setLast4digit] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("BKASH");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // 'success', 'error', null
  const [errorMessage, setErrorMessage] = useState("");
  const [copiedBkash, setCopiedBkash] = useState(false);

  if (!subscription) return null;

  const handleCopyBkash = () => {
    navigator.clipboard.writeText("01926695213");
    setCopiedBkash(true);
    setTimeout(() => setCopiedBkash(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setStatus(null);

    // Validation
    if (!trxId.trim()) {
      setErrorMessage("Transaction ID is required");
      return;
    }
    if (!reference.trim()) {
      setErrorMessage("Reference is required");
      return;
    }
    if (!userId) {
      setErrorMessage("User ID is missing. Please refresh the page.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create JSON payload with only required fields
      const payload = {
        user_id: userId,
        reference: reference.trim(),
        trx_id: trxId.trim(),
        sender_last_4: last4digit.trim(),
        payment_method: paymentMethod.trim(),
      };

      const response = await fetch(
        `${API_BASE_URL}/subscription/submit-proof`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        // Reset form
        setTrxId("");
        setReference("");
        setLast4digit("");

        // Show SweetAlert with manual close button
        Swal.fire({
          icon: "success",
          title: "Payment Submitted!",
          html: `<div class="text-left">
            <p class="text-gray-300">Your payment proof has been submitted successfully.</p>
            <p class="text-gray-300 mt-2">Your subscription will be activated soon.</p>
            <p class="text-yellow-400 text-sm mt-4 font-semibold">Admin Verification Time:</p>
            <p class="text-gray-400 text-sm">Daily 11:00 AM - 10:00 PM</p>
          </div>`,
          background: "#1a1a2e",
          color: "#fff",
          confirmButtonColor: "#ec4899",
          confirmButtonText: "Close",
          allowOutsideClick: false,
          allowEscapeKey: false,
        });

        // Call onSuccess callback to refetch data
        if (onSuccess) {
          onSuccess();
        }

        // Close modal after alert is closed
        setTimeout(() => {
          onClose();
        }, 500);
      } else {
        setStatus("error");
        setErrorMessage(
          data.message || "Failed to submit payment details. Please try again.",
        );

        // Show error SweetAlert with manual close button
        Swal.fire({
          icon: "error",
          title: "Submission Failed",
          text: data.message || "Failed to submit payment details. Please try again.",
          background: "#1a1a2e",
          color: "#fff",
          confirmButtonColor: "#ec4899",
          confirmButtonText: "Try Again",
          allowOutsideClick: false,
          allowEscapeKey: false,
        }).then(() => {
          setStatus(null);
          setErrorMessage("");
        });
      }
    } catch (error) {
      setStatus("error");
      const errorMsg = "Network error. Please check your connection and try again.";
      setErrorMessage(errorMsg);
      console.error("Error submitting payment details:", error);

      // Show error SweetAlert with manual close button
      Swal.fire({
        icon: "error",
        title: "Network Error",
        text: errorMsg,
        background: "#1a1a2e",
        color: "#fff",
        confirmButtonColor: "#ec4899",
        confirmButtonText: "Try Again",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then(() => {
        setStatus(null);
        setErrorMessage("");
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setTrxId("");
      setReference("");
      setLast4digit("");
      setStatus(null);
      setErrorMessage("");
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="bg-[#0c0c14] rounded-2xl border border-white/[0.06] w-full max-w-3xl shadow-2xl my-8 max-h-[90vh] overflow-y-auto custom-scrollbar"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/[0.06] sticky top-0 bg-[#0c0c14] z-10 rounded-t-2xl">
              <h2 className="text-2xl font-bold text-white">
                Activate Subscription
              </h2>
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="p-2 hover:bg-white/[0.05] rounded-lg transition disabled:opacity-50"
              >
                <X size={24} className="text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {status === "success" ? (
                <motion.div
                  className="flex flex-col items-center justify-center py-8 text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mb-4">
                    <CheckCircle size={32} className="text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Processing...
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Please wait while we process your submission.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Payment Instructions */}
                  <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-white">💳</span>
                      <h4 className="font-semibold text-white">
                        Send BDT {subscription?.price} to this bKash number
                      </h4>
                    </div>

                    {/* bKash Number */}
                    <div className="bg-black/30 rounded-lg p-3 border border-white/[0.05]">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-center flex-1">
                          <p className="text-2xl font-bold text-purple-400">
                            01926695213
                          </p>
                          <p className="text-xs text-gray-400">
                            Account type: Personal
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyBkash}
                          className="px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-all duration-300 flex-shrink-0 whitespace-nowrap cursor-pointer"
                        >
                          {copiedBkash ? "✓ Copied!" : "Copy"}
                        </button>
                      </div>
                    </div>

                    {/* How to pay with QR Code on the right - Equal heights */}
                    <div className="flex gap-6 items-stretch">
                      {/* Left: How to pay list */}
                      <div className="flex-1 bg-black/20 rounded-lg p-4 border border-white/[0.05]">
                        <div className="space-y-1.5 text-sm">
                          <p className="text-gray-300 font-medium">
                            📌 How to pay:
                          </p>
                          <ol className="text-gray-400 space-y-1 pl-4 list-decimal text-xs leading-relaxed">
                            <li>Open bKash App → Send Money</li>
                            <li>
                              Enter number:{" "}
                              <span className="text-purple-300 font-mono">
                                01926695213
                              </span>{" "}
                              OR Scan Our bKash QR Code
                            </li>
                            <li>
                              Amount:{" "}
                              <span className="text-emerald-300 font-bold">
                                BDT {subscription?.price}
                              </span>
                            </li>
                            <li>
                              Reference:{" "}
                              <span className="text-yellow-300">
                                Check your email for ref no.
                              </span>
                            </li>
                            <li>
                              <span className="text-orange-300">
                                Turn on Cashout Charge
                              </span>
                            </li>
                            <li>Send &amp; Copy Your Trnx ID</li>
                            <li>
                              Paste your Trnx ID and reference No. below here
                            </li>
                            <li>Submit</li>
                            <li>
                              After Admin Approval - You can Submit Form for
                              multiple Tournament a month
                            </li>
                          </ol>
                        </div>
                      </div>

                      {/* Right: QR Code - Larger */}
                      <div className="flex-shrink-0 flex flex-col items-center justify-center bg-black/20 rounded-lg p-4 border border-white/[0.05] min-w-[140px]">
                        <div className="w-32 h-32 bg-white rounded-xl p-2.5 flex items-center justify-center shadow-lg">
                          <img
                            src="/bkash-qr-code.png"
                            alt="bKash QR Code"
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.parentElement.innerHTML = `
                        <div class="w-full h-full bg-gray-800 rounded flex items-center justify-center">
                          <svg class="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 7h2v2H7V7zm10 0h2v2h-2V7zM7 17h2v2H7v-2zm10 0h2v2h-2v-2z" />
                          </svg>
                        </div>
                      `;
                            }}
                          />
                        </div>
                        <p className="text-xs text-gray-400 text-center mt-2 font-medium">
                          Scan to Pay
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Notice Box */}
                  <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                    <p className="text-amber-200/90 text-xs leading-relaxed">
                      <span className="font-semibold">📢 নোট:</span> অ্যাডমিন
                      প্রতিদিন সকাল ১১:০০ টা থেকে রাত ১০:০০ টার মধ্যে আপনার
                      পেমেন্ট ভেরিফিকেশন (যাচাইকরণ) সম্পন্ন করবেন। যদি এই সময়ের
                      মধ্যে কোনো সাড়া না পান, তাহলে ফেসবুক পেজে মেসেজ দিন অথবা
                      ডিসকর্ড অ্যাডমিনকে মেনশন করুন। আপনার পেমেন্ট নিশ্চিত হলেই
                      রেজিস্ট্রেশন সম্পন্ন হবে।
                      <br />
                      <br />
                      <span className="text-red-400 font-semibold">
                        ⚠️ ভুয়া পেমেন্টের কোনো অভিযোগ বা সমস্যা বিবেচনা করা হবে
                        না।
                      </span>{" "}
                      আপনার ট্রানজেকশন আইডি (Tranx ID) এবং রেফারেন্স আইডি (Ref
                      ID) বারবার ভালো করে পরীক্ষা করে নিন। ভুল তথ্য দেওয়ার জন্য
                      আমরা দায়ী থাকব না। ভুল তথ্য ইনপুট দিলে কোনো রিফান্ড (টাকা
                      ফেরত) দেওয়া হবে না।
                    </p>
                  </div>

                  {/* Reference */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Reference <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      placeholder="Check your email for reference no. e.g., IG-001054"
                      className="w-full px-4 py-3 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Select Payment Method{" "}
                      <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="paymentMethod"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        disabled={isSubmitting}
                        className="w-full px-4 pr-10 py-3 bg-white/[0.05] border border-white/[0.1] rounded-xl text-white focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.05] text-sm transition appearance-none cursor-pointer"
                      >
                        {["BKASH", "NAGAD", "ROCKET"].map((type) => (
                          <option
                            key={type}
                            value={type}
                            className="bg-[#1a1a24]"
                          >
                            {type}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={18}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      />
                    </div>
                  </div>

                  {/* Transaction ID */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Transaction ID <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value)}
                      placeholder="e.g., 8TY3K2X9"
                      className="w-full px-4 py-3 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Last 4 digit */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Last 4 digit <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={last4digit}
                      onChange={(e) => setLast4digit(e.target.value)}
                      placeholder="Enter the last 4 digits of your payment phone no. e.g., 2222"
                      className="w-full px-4 py-3 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Error Message */}
                  {errorMessage && !status && (
                    <motion.div
                      className="flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/30"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <AlertCircle
                        size={20}
                        className="text-red-400 flex-shrink-0"
                      />
                      <p className="text-red-300 text-sm">{errorMessage}</p>
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Activate Subscription"
                    )}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
