"use client";

import React from "react";
import { ShoppingBag, Gamepad2 } from "lucide-react";

export default function ProGearShop({ products }) {
  const items = products?.length
    ? products
    : [
        {
          id: 1,
          name: "Elite Controller",
          image:
            "https://res.cloudinary.com/dpwjt3jxx/image/upload/v1782524556/71RgJZeOr-L._AC_UF894_1000_QL80__koq6v3.jpg",
        },
        {
          id: 2,
          name: "Pro Headset",
          image:
            "https://res.cloudinary.com/dpwjt3jxx/image/upload/v1782524556/71RgJZeOr-L._AC_UF894_1000_QL80__koq6v3.jpg",
        },
      ];

  return (
    <div className="h-full rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <h3 className="text-sm font-semibold text-white truncate">
            Pro Gear Shop
          </h3>
        </div>
        <span className="shrink-0 whitespace-nowrap text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-[#9333EA33] text-pink-300 border border-pink-500/20">
          Deals
        </span>
      </div>

      {/* Products */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 mb-4 flex-1">
        {items.slice(0, 2).map((item) => (
          <div key={item.id} className="group min-w-0">
            <div className="aspect-[4/3] rounded-xl bg-black/40 border border-white/5 flex items-center justify-center overflow-hidden group-hover:border-purple-500/30 transition-colors">
              {item.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
              )}
            </div>
            <p className="mt-2 text-[11px] sm:text-xs font-medium text-gray-200 truncate">
              {item.name}
            </p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        type="button"
        className="w-full py-2.5 rounded-lg border border-white/10 text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase text-gray-300 hover:bg-white/5 hover:text-white hover:border-white/20 transition-colors"
      >
        Visit Store
      </button>
    </div>
  );
}
