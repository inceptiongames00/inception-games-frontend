'use client';

import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function ProGearShop() {
  const gearItems = [
    {
      id: 1,
      name: 'Elite Controller',
      icon: '🎮',
      image: 'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=500&h=400&fit=crop',
    },
    {
      id: 2,
      name: 'Pro Headset',
      icon: '🎧',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=400&fit=crop',
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="rounded-2xl border border-white/[0.06] bg-[#0c0c12] overflow-hidden relative mt-6"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-purple-500/30 via-transparent to-transparent" />

      <div className="p-3 sm:p-3">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-purple-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">Pro Gear Shop</h2>
          </div>
          <button className="px-3 py-1 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider hover:bg-purple-500/30 transition">
             Visit Store
          </button>
        </div>

        {/* Gear Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {gearItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + idx * 0.05 }}
              className="rounded-xl border border-white/[0.08] bg-white/[0.02] overflow-hidden hover:border-white/[0.12] transition"
            >
              {/* Placeholder Image */}
              <div className="h-24 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative overflow-hidden">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="text-3xl">{item.icon}</span>
                )}
              </div>

              {/* Item Name */}
              <div className="p-3">
                <p className="text-sm font-semibold text-white">{item.name}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
