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

      <div className="px-6 sm:px-6 py-3 sm:py-3">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
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
        <div className="grid grid-cols-1 gap-4">
          {/* Coming Soon Banner */}
          <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 p-8 flex items-center justify-center min-h-36">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-blue-500/5" />
            <h3 className="relative text-center text-2xl sm:text-3xl font-bold text-white">
              Pro Gear Shop Is Coming Soon
            </h3>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
