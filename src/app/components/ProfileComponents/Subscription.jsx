"use client";

import React from "react";
import { Check } from "lucide-react";
import Link from "next/link";

export default function Subscription({ plan }) {
  const data = plan || {
    name: "Free Gamer Plan",
    tier: "FREE",
    expiration: "No expiration",
    progress: 35, // 0-100, drives the bar fill
    perks: ["Priority Access", "Exclusive Tournaments"],
  };

  return (
    <div className="h-full rounded-2xl border border-white/10 bg-white/[0.02] p-5 flex flex-col">
      <h3 className="text-sm font-semibold text-white mb-4">Subscription</h3>

      <div className="flex items-center gap-2 mb-1">
        <p className="text-base font-semibold text-white">{data.name}</p>
        <span className="text-[10px] font-bold tracking-wide px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400">
          {data.tier}
        </span>
      </div>
      <p className="text-xs text-gray-500 mb-4">{data.expiration}</p>

      {/* Progress bar */}
      <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden mb-5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#7E22CE] to-[#581C87]"
          style={{ width: `${data.progress}%` }}
        />
      </div>

      {/* Perks */}
      <ul className="space-y-2 mb-6 flex-1">
        {data.perks.map((perk) => (
          <li
            key={perk}
            className="flex items-center gap-2 text-xs text-gray-300"
          >
            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            {perk}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link
        href="/subscriptions"
        className="flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-[#7E22CE] to-[#581C87] px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:opacity-90 hover:shadow-lg active:scale-[0.98]"
      >
        Upgrade Plan
      </Link>
    </div>
  );
}
