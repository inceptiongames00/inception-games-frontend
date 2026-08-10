"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import { getTokens } from "@/lib/api";
import Swal from "sweetalert2";
import { useAuth } from "@/app/context/AuthContext";
import Image from "next/image";

const planFeatures = [
  [
    "Free Tournament (T1/T2 Lobbies) with International Team",
    "Scrims Access (T1/T2 Lobbies) with International Team",
    "Get Rewards on Tournament MVP",
    "Basic Performance Analytics & Star Player Recognition",
    "Career Guideline on Esports",
    "Networking Opportunity & Meetup",
    "Grind for the Esports World Cup",
  ],
  [
    "1x Major + 1x Mini Tournament Entry Pass (T1/T2 Lobbies)",
    "Merch Brand Deal: Free Website & Jersey Making Support (Earn ~5K–10K+ BDT)",
    "100 TK Discount code on partner brands",
    "Inception Esports Tryouts for the World Cup",
    "Live Streams (YT, FB, Discord) + Global News Feature",
    "Basic Performance Analytics & Star Player Recognition",
    "Content Mentorship on YouTube, Facebook & Instagram",
  ],
  [
    "2x Major Tournament Entry Pass (T1/T2 Lobbies)",
    "Merch Brand Deal: Free Website & Jersey Making Support (Earn ~10K–20K+ BDT/mo)",
    "Sponsorship Network: Access to brand deals based on performance",
    "200 TK Discount code on partner brands",
    "Priority Inception Esports Tryouts for the World Cup",
    "Priority Live Streams (YT, FB, Discord, etc.) + Premium Global Feature",
    "Monthly Analytics Report: In-depth end-of-month data tracking",
    "Advanced Content Mentorship on YouTube, Facebook & Instagram",
  ],
];

export default function UpgradePlanModal({
  isOpen,
  onClose,
  plans = [],
  activePlanName = null,
  onSubscriptionSuccess,
  onOpenActivateModal,
}) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingPlanId, setLoadingPlanId] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const tokens = getTokens();

  const handleSubscribe = async (planName, planId) => {
    if (!planName || planName.toLowerCase().includes("free")) return;

    setLoading(true);
    setLoadingPlanId(planId);
    setError(null);
    setSuccess(null);

    try {
      if (!tokens?.accessToken) {
        Swal.fire({
          icon: "error",
          title: "Authentication Error",
          text: "Not authenticated",
          confirmButtonColor: "#a855f7",
        });
        setLoadingPlanId(null);
        return;
      }

      const response = await fetch(
        "https://inception-games.an.r.appspot.com/api/v1/subscription/subscribe",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokens.accessToken}`,
          },
          body: JSON.stringify({
            user_id: user?.id,
            plan: planName,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Subscription failed");
      }

      // Trigger profile refetch immediately after successful API call
      if (onSubscriptionSuccess) {
        onSubscriptionSuccess();
      }

      // Show success alert, then close this modal and open activate modal
      await Swal.fire({
        icon: "success",
        title: "Subscription Successful!",
        html: `<p>You have successfully subscribed to <strong>${planName}</strong></p>`,
        confirmButtonColor: "#a855f7",
        timer: 2000,
        timerProgressBar: true,
      });

      // After Swal closes, close this modal then open the activate modal
      onClose();
      if (onOpenActivateModal) {
        onOpenActivateModal();
      }
    } catch (err) {
      console.error("[UpgradePlanModal] Subscription error:", err);
      Swal.fire({
        icon: "error",
        title: "Subscription Failed",
        text: err.message || "Failed to complete subscription",
        confirmButtonColor: "#a855f7",
      });
    } finally {
      setLoading(false);
      setLoadingPlanId(null);
    }
  };

  // Transform API plans to display format
  const transformedPlans =
    plans.length > 0
      ? plans.map((plan, idx) => {
          const isActive = activePlanName && plan.plan === activePlanName;
          return {
            id: plan.id,
            name: plan.plan,
            price: `${plan.price} BDT`,
            period: `month`,
            badge: isActive ? "ACTIVE" : idx === 2 ? "MOST POPULAR" : null,
            badgeColor: isActive
              ? "bg-emerald-500 text-white"
              : idx === 2
                ? "bg-purple-600 text-white"
                : "",
            isCurrentPlan: isActive,
            duration_days: plan.duration_days,
            features: planFeatures[idx],
            buttonText: isActive
              ? "CURRENT PLAN"
              : plan.plan === "Casual Pass"
                ? "Select Free"
                : "BUY NOW",
            buttonStyle: isActive
              ? "bg-gray-500 cursor-not-allowed opacity-60"
              : idx === 2
                ? "bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400"
                : "bg-transparent border-2 border-purple-500 text-purple-400 hover:bg-purple-500/10",
            highlighted: idx === 2 && !isActive,
          };
        })
      : [];

  const displayPlans = transformedPlans;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[200] p-0 sm:p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.4 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-black via-[#0a0a0f] to-black border border-white/[0.08] rounded-none sm:rounded-3xl w-full sm:max-w-6xl shadow-2xl shadow-black/50 overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-lg bg-white/[0.05] border border-white/[0.1] text-gray-400 hover:text-white hover:bg-white/[0.08] transition z-10"
            >
              <X size={20} />
            </button>

            {/* Content */}
            <div className="p-8 sm:p-12">
              {/* Header */}
              <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                  Level Up Your Experience
                </h2>
                <p className="text-lg text-gray-400">
                  Choose the perfect plan for your gaming journey.
                </p>
              </motion.div>

              {/* Error Message */}
              {error && (
                <motion.div
                  className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {error}
                </motion.div>
              )}

              {/* Success Message */}
              {success && (
                <motion.div
                  className="mb-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  ✓ {success}
                </motion.div>
              )}

              {/* Plans Container with horizontal scroll on mobile */}
              {/* Desktop: Grid Layout */}
              <div className="hidden sm:block">
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, staggerChildren: 0.1 }}
                >
                  {displayPlans.map((plan, index) => (
                    <PlanCard 
                      key={plan.id} 
                      plan={plan} 
                      index={index} 
                      loading={loading} 
                      loadingPlanId={loadingPlanId} 
                      handleSubscribe={handleSubscribe} 
                    />
                  ))}
                </motion.div>
              </div>

              {/* Mobile: Swipeable Slider */}
              <div className="sm:hidden">
                <motion.div
                  drag="x"
                  dragElastic={0.2}
                  dragMomentum={false}
                  onDragEnd={(e, { offset, velocity }) => {
                    const swipe = (offset.x / 100) * velocity.x;
                    if (swipe < -50 && currentSlide < displayPlans.length - 1) {
                      setCurrentSlide(currentSlide + 1);
                    }
                    if (swipe > 50 && currentSlide > 0) {
                      setCurrentSlide(currentSlide - 1);
                    }
                  }}
                  animate={{ x: -currentSlide * 100 + "%" }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="flex cursor-grab active:cursor-grabbing"
                >
                  {displayPlans.map((plan, index) => (
                    <div key={plan.id} className="w-full flex-shrink-0 px-4">
                      <PlanCard 
                        plan={plan} 
                        index={index} 
                        loading={loading} 
                        loadingPlanId={loadingPlanId} 
                        handleSubscribe={handleSubscribe} 
                      />
                    </div>
                  ))}
                </motion.div>

                {/* Slider Indicators */}
                <div className="flex justify-center gap-2 mt-6">
                  {displayPlans.map((_, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`h-2 rounded-full transition-all ${
                        index === currentSlide
                          ? "bg-purple-600 w-6"
                          : "bg-white/20 w-2"
                      }`}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PlanCard({ plan, index, loading, loadingPlanId, handleSubscribe }) {
  return (
    <motion.div
      key={plan.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.1 }}
      className={`rounded-2xl border transition-all duration-300 relative ${
        plan.highlighted
          ? "border-purple-500/60 bg-gradient-to-br from-purple-950/40 to-purple-900/20 shadow-lg shadow-purple-600/30 scale-105"
          : "border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04]"
      }`}
    >
      {/* 4 round images — top right, overlapping row */}
      <div className="absolute top-5 right-4 flex flex-row z-10">
        {[
          "https://res.cloudinary.com/jvpygp4b/image/upload/v1784462969/efootball-2022_uxq9.1200_qgp8ke.webp",
          "https://res.cloudinary.com/jvpygp4b/image/upload/v1784462998/fc26-1_iuc46n.jpg",
          "https://res.cloudinary.com/jvpygp4b/image/upload/v1784463010/co52c8_uw5bug.jpg",
          "https://res.cloudinary.com/jvpygp4b/image/upload/v1784463013/pubg-mobile-thumbnail_lqs8ai.webp",
        ].map((src, i) => (
          <div
            key={i}
            style={{
              marginLeft: i === 0 ? 0 : "-8px",
              zIndex: i,
            }}
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-white bg-white/10"
          >
            <Image
              src={src}
              alt=""
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      <div className="p-6 pt-8">
        {/* Badge */}
        {plan.badge && (
          <div className="flex justify-center mb-4 -mt-12">
            <span
              className={`text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider ${plan.badgeColor}`}
            >
              {plan.badge}
            </span>
          </div>
        )}
        {/* Plan Name */}
        <h3 className="text-xl font-bold text-white mb-2">
          {plan.name}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-1 mb-6">
          {parseInt(plan.price) === 0 ? (
            <span className="text-3xl font-bold text-white">
              FREE
            </span>
          ) : (
            <>
              <span className="text-3xl font-bold text-white">
                {parseInt(plan.price)}
              </span>
              <span className="text-sm font-medium text-gray-400">
                BDT
              </span>
            </>
          )}
          {plan.period && parseInt(plan.price) !== 0 && (
            <span className="text-sm text-gray-500">
              /{plan.period}
            </span>
          )}
        </div>
        {/* Features */}
        <div className="space-y-3 mb-6 h-70 overflow-y-scroll overscroll-contain custom-scrollbar">
          {plan.features.map((feature, idx) => {
            const isString = typeof feature === "string";
            const text = isString ? feature : feature.text;
            const disabled = feature.disabled;

            return (
              <div
                key={idx}
                className={`flex items-start gap-3 ${disabled ? "opacity-40" : ""}`}
              >
                <Check
                  size={18}
                  className={`flex-shrink-0 mt-0.5 ${
                    disabled
                      ? "text-gray-600"
                      : "text-emerald-400"
                  }`}
                />
                <span
                  className={`text-sm ${disabled ? "text-gray-600" : "text-gray-300"}`}
                >
                  {text}
                </span>
              </div>
            );
          })}
        </div>

        {/* Button */}
        <motion.button
          onClick={() => handleSubscribe(plan.name, plan.id)}
          disabled={
            plan.isCurrentPlan ||
            (loading && loadingPlanId === plan.id)
          }
          className={`w-full py-3 cursor-pointer rounded-lg font-bold text-sm uppercase tracking-wider transition-all duration-300 ${plan.buttonStyle} ${loading && loadingPlanId === plan.id ? "opacity-50" : ""}`}
          whileHover={{
            scale:
              plan.isCurrentPlan ||
              (loading && loadingPlanId === plan.id)
                ? 1
                : 1.02,
          }}
          whileTap={{
            scale:
              plan.isCurrentPlan ||
              (loading && loadingPlanId === plan.id)
                ? 1
                : 0.98,
          }}
        >
          {loading && loadingPlanId === plan.id
            ? "Processing..."
            : plan.buttonText}
        </motion.button>
      </div>
    </motion.div>
  );
}
