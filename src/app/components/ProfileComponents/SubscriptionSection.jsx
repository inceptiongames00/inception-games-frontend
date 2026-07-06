"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Crown } from "lucide-react";
import UpgradePlanModal from "./UpgradePlanModal";
import ActivateSubscriptionModal from "./ActivateSubscriptionModal";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://inception-games.an.r.appspot.com/api/v1";

export default function SubscriptionSection({
  userProfile,
  userId,
  onSubscriptionSuccess,
}) {
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isActivateModalOpen, setIsActivateModalOpen] = useState(false);
  const [subscriptionTiers, setSubscriptionTiers] = useState([]);
  const [apiPlans, setApiPlans] = useState([]);
  const [activeSubscription, setActiveSubscription] = useState(null);
  const [hasMounted, setHasMounted] = useState(false);

  // Handle client-side mounting to prevent hydration mismatches
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Extract and display active subscription from userProfile
  useEffect(() => {
    if (!hasMounted) return;

    if (
      userProfile?.subscriptions &&
      Array.isArray(userProfile.subscriptions) &&
      userProfile.subscriptions.length > 0
    ) {
      const activeSub = userProfile.subscriptions[0];
      setActiveSubscription(activeSub);

      const statusColors = {
        active: "bg-emerald-500/20 border-emerald-500/40 text-emerald-400",
        pending: "bg-yellow-500/20 border-yellow-500/40 text-yellow-400",
        expired: "bg-red-500/20 border-red-500/40 text-red-400",
      };

      // Format date safely (YYYY-MM-DD) to avoid hydration mismatch
      let expirationText = "No expiration";
      if (activeSub.end_date) {
        const date = new Date(activeSub.end_date);
        const day = date.getUTCDate();
        const month = date.toLocaleString("en-US", {
          month: "short",
          timeZone: "UTC",
        });
        const year = date.getUTCFullYear();

        // Get ordinal suffix (st, nd, rd, th)
        const suffix =
          ["th", "st", "nd", "rd"][
            day % 10 > 3 ? 0 : (day % 100) - 20 > 3 ? 0 : day % 10
          ] || "th";

        expirationText = `Expires: ${day}${suffix} ${month} ${year}`;
      }

      const displaySub = {
        name: activeSub.plan || activeSub.plan_name || "Plan",
        badge: activeSub.status?.toUpperCase() || "PENDING",
        badgeColor: statusColors[activeSub.status] || statusColors.pending,
        price: activeSub.price ? `${activeSub.price} BDT` : "FREE",
        expiration: expirationText,
        features: [
          "Priority Access",
          "Exclusive Tournaments",
          "Enhanced Support",
        ],
        buttonText:
          activeSub.status === "pending"
            ? "ACTIVATE SUBSCRIPTION"
            : activeSub.status === "expired"
              ? "RENEW PLAN"
              : "UPGRADE PLAN",
        buttonStyle:
          activeSub.status === "pending"
            ? "bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400"
            : activeSub.status === "expired"
              ? "bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400"
              : "bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400",
      };

      setSubscriptionTiers([displaySub]);
    }
  }, [userProfile, hasMounted]);

  // Fetch available plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/cms/subscription/plans`);
        const data = await response.json();

        if (data.plans && Array.isArray(data.plans)) {
          setApiPlans(data.plans);
        }
      } catch (error) {
        console.error(
          "[SubscriptionSection] Error fetching subscription plans:",
          error,
        );
      }
    };

    if (hasMounted) {
      fetchPlans();
    }
  }, [hasMounted]);

  // Don't render until client is mounted to prevent hydration mismatch
  if (!hasMounted) {
    return null;
  }

  return (
    <motion.div
      className="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-[#0c0c14] to-[#14141f] overflow-hidden relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5" />

      {/* Top accent - updated gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-pink-500/40" />

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

      <div className="relative z-10 p-4 sm:p-5">
        {/* Header with icon */}
        <motion.div
          className="flex items-center gap-3 mb-6"
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <Crown size={20} className="text-purple-400" />
          </div>
          <h3 className="text-2xl font-bold text-white">Subscription</h3>
        </motion.div>

        {subscriptionTiers.length > 0 ? (
          subscriptionTiers.map((tier, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 1) }}
            >
              {/* Plan Name + Badge */}
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h4 className="text-lg sm:text-xl font-bold text-white">
                  {tier.name}
                </h4>
                <span
                  className={`px-2.5 py-0.5 rounded-lg border text-[10px] sm:text-xs font-bold uppercase tracking-wider ${tier.badgeColor}`}
                >
                  {tier.badge}
                </span>
              </div>

              {/* Price */}
              <div className="mt-1 flex items-baseline gap-1">
                <p className="text-1xl sm:text-2xl font-bold text-white">
                  {parseInt(tier.price) === 0 ? "FREE" : parseInt(tier.price)}{" "}
                  BDT
                </p>
                {parseInt(tier.price) !== 0 && (
                  <span className="text-xs sm:text-sm text-gray-400">
                    /month
                  </span>
                )}
              </div>

              {/* Expiration */}
              <p className="text-gray-500 text-sm mt-0.5">{tier.expiration}</p>

              {/* Divider */}
              <div className="my-4 h-px bg-gradient-to-r from-white/[0.06] to-transparent" />

              {/* Features List */}
              <div className="space-y-2.5 mb-5">
                {tier.features.map((feature, idx) => (
                  <motion.div
                    key={idx}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 * (idx + 1) }}
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <Check size={12} className="text-emerald-400" />
                    </div>
                    <span className="text-gray-400 text-sm sm:text-base">
                      {feature}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Upgrade Button */}
              <motion.button
                onClick={() => {
                  if (tier.badge === "PENDING") {
                    setIsActivateModalOpen(true);
                  } else {
                    setIsUpgradeModalOpen(true);
                  }
                }}
                className={`w-full cursor-pointer py-3 rounded-xl font-bold text-white text-sm sm:text-sm transition duration-300 shadow-lg shadow-purple-500/20 ${tier.buttonStyle}`}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                {tier.buttonText}
              </motion.button>
            </motion.div>
          ))
        ) : (
          <div className="text-gray-500 text-sm">Loading subscription...</div>
        )}
      </div>

      {/* Activate Subscription Modal */}
      <ActivateSubscriptionModal
        isOpen={isActivateModalOpen}
        onClose={() => setIsActivateModalOpen(false)}
        subscription={activeSubscription}
        userId={userId}
      />

      {/* Upgrade Plan Modal */}
      <UpgradePlanModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        plans={apiPlans}
        activePlanName={
          activeSubscription?.plan || activeSubscription?.plan_name
        }
        onSubscriptionSuccess={onSubscriptionSuccess}
      />
    </motion.div>
  );
}
