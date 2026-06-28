"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";

const plans = [
  {
    name: "Free Gamer",
    price: "Free",
    isCurrent: true,
    features: [
      { text: "Basic Matchmaking", included: true },
      { text: "Community Forum Access", included: true },
      { text: "No Advanced Stats", included: false },
    ],
    cta: "Currently Active",
    ctaDisabled: true,
  },
  {
    name: "Pro Gamer",
    price: "249",
    period: "/mo",
    highlight: true,
    badge: "Most Popular",
    features: [
      { text: "Advanced Performance Stats", included: true },
      { text: "Pro Gear Discounts (10%)", included: true },
      { text: "Ad-free Experience", included: true },
      { text: "Priority Server Entry", included: true },
    ],
    cta: "Upgrade to Pro",
  },
  {
    name: "Elite Gamer",
    price: "349",
    period: "/mo",
    features: [
      { text: "All Pro Features", included: true },
      { text: "1-on-1 Coaching Session", included: true },
      { text: "Exclusive Tournament Entry", included: true },
      { text: "Beta Game Access", included: true },
    ],
    cta: "Go Elite",
  },
  {
    name: "Legendary Gamer",
    price: "449",
    period: "/mo",
    features: [
      { text: "All Elite Features", included: true },
      { text: "Personal Account Manager", included: true },
      { text: "Custom Profile Badge", included: true },
      { text: "Early Access to New Games", included: true },
    ],
    cta: "Go Legendary",
  },
];

export default function SubscriptionsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#060608] relative px-4 py-16 sm:py-20">
      {/* Close button */}
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="Close"
        className="absolute cursor-pointer top-6 right-6 sm:top-8 sm:right-8 text-gray-400 hover:text-white transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Header */}
      <div className="max-w-2xl mx-auto text-center mb-14">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
          Level Up Your Experience
        </h1>
        <p className="mt-3 text-sm sm:text-base text-gray-400">
          Level up with premium perks, elite gear, and expert coaching.
        </p>
      </div>

      {/* Plans grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative flex flex-col rounded-2xl p-6 ${
              plan.highlight
                ? "border-2 border-purple-500/60 bg-purple-500/[0.04] shadow-[0_0_35px_-8px_rgba(147,51,234,0.6)]"
                : "border border-white/10 bg-white/[0.02]"
            }`}
          >
            {/* Most Popular badge */}
            {plan.badge && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold tracking-wider uppercase text-white px-3 py-1 rounded-full bg-gradient-to-r from-[#7E22CE] to-[#581C87] shadow-md whitespace-nowrap">
                {plan.badge}
              </span>
            )}

            {/* Current plan tag */}
            {plan.isCurrent && (
              <span className="inline-block self-start text-[10px] font-semibold tracking-wider uppercase text-gray-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full mb-4">
                Current Plan
              </span>
            )}

            {/* Title */}
            <h3
              className={`text-lg font-bold mb-2 ${
                plan.highlight ? "text-purple-400" : "text-white"
              } ${plan.isCurrent ? "mt-0" : plan.badge ? "mt-4" : ""}`}
            >
              {plan.name}
            </h3>

            {/* Price */}
            <div className="flex items-baseline gap-1.5 mb-6">
              <span className="text-3xl font-bold text-white">
                {plan.price}
              </span>
              {plan.period && (
                <>
                  <span className="text-sm text-gray-400">BDT</span>
                  <span className="text-xs text-gray-500">{plan.period}</span>
                </>
              )}
            </div>

            {/* Features */}
            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((feature) => (
                <li
                  key={feature.text}
                  className={`flex items-start gap-2 text-sm ${
                    feature.included ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  {feature.included ? (
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <X className="w-4 h-4 text-gray-600 shrink-0 mt-0.5" />
                  )}
                  {feature.text}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <button
              type="button"
              disabled={plan.ctaDisabled}
              className={`w-full py-3 rounded-lg text-sm font-semibold tracking-wide uppercase transition-colors ${
                plan.ctaDisabled
                  ? "bg-white/5 text-gray-500 cursor-default"
                  : plan.highlight
                    ? "text-white bg-gradient-to-r from-[#7E22CE] to-[#581C87] hover:opacity-90"
                    : "text-purple-400 border border-purple-500/40 hover:bg-purple-500/10"
              }`}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
