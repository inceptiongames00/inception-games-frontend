"use client";

import { motion } from "framer-motion";

export default function BrandDealsSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative mx-auto max-w-7xl rounded-lg overflow-hidden"
    >
      {/* Background with gradient and backdrop blur effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 backdrop-blur-sm" />

      {/* Content */}
      <div className="relative z-10 px-6 sm:px-12 py-16 sm:py-24 text-center flex flex-col items-center justify-center">
        {/* Coming Soon Badge */}
        <div className="inline-block mb-6 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full">
          <span className="text-sm font-bold text-white uppercase tracking-widest">
            Coming Soon
          </span>
        </div>

        {/* Main Text */}
        <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
            Brand Deal Events
          </span>
        </h3>

        <p className="text-zinc-400 text-base sm:text-lg max-w-md mb-8">
          Get ready for exclusive brand partnerships, collaborations, and
          sponsored tournament events.
        </p>
      </div>
    </motion.div>
  );
}
