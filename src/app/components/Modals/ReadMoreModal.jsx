"use client";

import React from "react";
import { X } from "lucide-react";
import { FaFacebookF, FaTwitter, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";

export default function ReadMoreModal({
  selectedNews,
  setSelectedNews,
  handleShare,
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 overscroll-contain"
    >
      <div
        className="relative bg-gradient-to-br from-zinc-900 via-zinc-900 to-black
             border border-purple-500/30 rounded-3xl
             shadow-2xl shadow-purple-500/30
             max-w-6xl w-full h-[85vh] max-h-[700px]
             overflow-hidden p-8"
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedNews(null)}
          className="absolute top-4 right-4 p-2 bg-black/70 hover:bg-black rounded-xl z-30 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 h-full min-h-0 overflow-hidden">
          {/* LEFT SIDE */}
          <div
            className="relative h-[250px] md:h-full bg-cover bg-center md:bg-top bg-no-repeat rounded-lg overflow-hidden"
            style={{ backgroundImage: `url(${selectedNews.image})` }}
          >
            {/* Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

            {/* Bottom Content */}
            <div className="absolute bottom-0 left-0 right-0 z-10">
              <div className="px-6 py-4">
                <div
                  className={`inline-block mb-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${selectedNews.categoryColor}`}
                >
                  {selectedNews.category}
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                  {selectedNews.title}
                </h2>
              </div>

              {/* Share Section */}
              <div className="px-6 pb-4 flex items-center gap-3">
                <span className="text-sm text-zinc-400 font-medium">
                  Share:
                </span>

                <button
                  onClick={() => handleShare("facebook", selectedNews)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#1877F2] flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer"
                >
                  <FaFacebookF className="text-white text-sm" />
                </button>

                <button
                  onClick={() => handleShare("twitter", selectedNews)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#1DA1F2] flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer"
                >
                  <FaTwitter className="text-white text-sm" />
                </button>

                <button
                  onClick={() => handleShare("linkedin", selectedNews)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#0A66C2] flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer"
                >
                  <FaLinkedin className="text-white text-sm" />
                </button>

                <button
                  onClick={() => handleShare("whatsapp", selectedNews)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#25D366] flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer"
                >
                  <FaWhatsapp className="text-white text-sm" />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex flex-col h-full min-h-0">
            <h3 className="text-2xl font-bold text-white px-0 md:px-6 pb-4">
              Full Story
            </h3>

            <div className="h-1 bg-gradient-to-r from-purple-500/0 via-purple-500/50 to-purple-500/0 rounded-full" />

            {/* Scrollable Content */}
            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-0 py-6 md:p-6">
              <p className="text-zinc-300 leading-relaxed whitespace-pre-line">
                {selectedNews.details ?? selectedNews.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
