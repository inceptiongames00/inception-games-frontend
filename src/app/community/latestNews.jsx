"use client";
import { ArrowRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { FaFacebookF, FaTwitter, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import Link from "next/link";

const newsItems = [
  {
    title: "গেম খেলা হতে পারে কারো পেশা",
    description:
      "গেম তৈরি ও বাজারজাত করে দেশের অর্থনীতিতেও বড় অবদান রাখতে পারে গেম নির্মাতা প্রতিষ্ঠান। পেশাদার গেমারদের জন্য প্ল্যাটফর্ম তৈরি ও গেম তৈরির কাজ করছেন কাজী হাসিব ও তাঁর দল। তাঁদের দুই প্রতিষ্ঠানের সম্পর্কে লিখেছেন আশিক উল বারাত",
    image:
      "https://res.cloudinary.com/jvpygp4b/image/upload/v1783157039/bignews_jmxxbf.jpg",
    category: "UPDATES",
    categoryColor: "bg-pink-500/20 text-pink-300 border border-pink-500/30",
    readMoreLink:
      "http://facebook.com/slicenshareFB/posts/pfbid02UKgh3GBxwnuJH7VxPbNtQEUkHfSd8naroqFMUeyZ4U3F7bh3fVLvydJvGxnfZCK6l?mibextid=wwXIfr&rdid=PlkdRZwQddmDpaYt&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2Fp%2F16yMhZvtR9%2F%3Fmibextid%3DwwXIfr#",
  },
  {
    title:
      "Digital Entrepreneurship and Innovation Ecosystem Development (DEIED)",
    description:
      "Digital Entrepreneurship and Innovation Ecosystem Development (DEIED) Project Office has organized a Dialogue Session to introduce the Startup and Scaleup Program (Accelerating Bangladesh) and the University Innovation Hub Program to senior public-sector leadership. ",
    image:
      "https://res.cloudinary.com/jvpygp4b/image/upload/v1783157043/news3_freort.jpg",
    category: "ESPORTS",
    categoryColor: "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30",
    readMoreLink: "",
  },
  {
    title: "Airtel Buzz Presents Bangladesh Gaming & Esports Summit 2025",
    description:
      "Dedicating to my Core Teammates & gamers ❤️. Tournament sign up going on at our website. Don't forget to sign up. Slice N Share at Airtel Buzz Presents Bangladesh Gaming & Esports Summit 2025.",
    image:
      "https://res.cloudinary.com/jvpygp4b/image/upload/v1783157047/news4_u9saum.jpg",
    category: "COMMUNITY",
    categoryColor:
      "bg-purple-500/20 text-purple-300 border border-purple-500/30",
    readMoreLink: "",
  },
];

const loremText =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

export default function LatestNews() {
  const [selectedNews, setSelectedNews] = useState(null);

  const handleShare = (platform, news) => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    const title = news.title;
    const description = news.description;
    let shareLink = "";

    switch (platform) {
      case "facebook":
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(title + " - " + description)}`;
        break;
      case "twitter":
        shareLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title + " - " + description)}`;
        break;
      case "linkedin":
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      case "whatsapp":
        shareLink = `https://wa.me/?text=${encodeURIComponent(title + " - " + description + " " + shareUrl)}`;
        break;
      default:
        return;
    }

    if (typeof window !== "undefined") {
      window.open(shareLink, "share-dialog", "width=800,height=600");
    }
  };

  return (
    <section id="latest-news" className="py-20 px-4 sm:px-6 bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight">
            LATEST{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
              NEWS
            </span>
          </h2>

          {/* Underline accent */}
          <div className="flex justify-center gap-2 mt-4">
            <div className="w-50 h-1.5 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full" />
          </div>
        </motion.div>

        {/* News Grid - 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {newsItems.map((news, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: idx * 0.15, duration: 0.6 }}
              whileHover={{ y: -8 }}
              className="group cursor-pointer"
              // onClick={() => setSelectedNews(news)}
            >
              {/* Card Container */}
              <div className="rounded-2xl overflow-hidden bg-zinc-900/50 border border-zinc-800/50 hover:border-purple-500/30 transition-all duration-300 h-full flex flex-col backdrop-blur-sm">
                {/* Image Section */}
                <div
                  className="relative h-48 sm:h-56 md:h-64 overflow-hidden bg-gradient-to-br from-slate-700 to-slate-900 bg-cover bg-center"
                  style={{
                    backgroundImage: `url('${news.image}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

                  {/* Category Badge */}
                  <div
                    className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${news.categoryColor} backdrop-blur-sm`}
                  >
                    {news.category}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 sm:p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-3 leading-tight group-hover:text-purple-300 transition-colors duration-300 line-clamp-2">
                      {news.title}
                    </h3>
                    <p className="text-sm sm:text-base text-zinc-300 leading-relaxed line-clamp-3">
                      {news.description}
                    </p>
                  </div>

                  {/* Read More Link */}
                  <div className="mt-4 pt-4 border-t border-zinc-700/50">
                    <div className="flex items-center gap-3">
                      <Link
                        href={news.readMoreLink || "#"}
                        target={news.readMoreLink ? "_blank" : undefined}
                        onClick={(e) => {
                          if (!news.readMoreLink) {
                            e.preventDefault();
                          }
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-500 rounded-full text-white font-semibold text-xs uppercase tracking-wider transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50 group/link cursor-pointer"
                      >
                        Read More
                        <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-300" />
                      </Link>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare("facebook", news);
                        }}
                        className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-[#1877F2] backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer"
                        aria-label="Share on Facebook"
                      >
                        <FaFacebookF className="text-white text-sm md:text-base" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare("twitter", news);
                        }}
                        className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-[#1DA1F2] backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer"
                        aria-label="Share on Twitter"
                      >
                        <FaTwitter className="text-white text-sm md:text-base" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare("linkedin", news);
                        }}
                        className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-[#0A66C2] backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer"
                        aria-label="Share on LinkedIn"
                      >
                        <FaLinkedin className="text-white text-sm md:text-base" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare("whatsapp", news);
                        }}
                        className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-[#25D366] backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer"
                        aria-label="Share on WhatsApp"
                      >
                        <FaWhatsapp className="text-white text-sm md:text-base" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* News Detail Modal */}
        <AnimatePresence>
          {selectedNews && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedNews(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 40 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-black border border-purple-500/30 rounded-3xl shadow-2xl shadow-purple-500/30 max-w-6xl w-full max-h-[85vh] overflow-hidden flex flex-col"
              >
                {/* Header with Image */}
                <div className="relative">
                  <div
                    className="h-48 sm:h-56 md:h-72 lg:h-96 bg-gradient-to-br from-slate-700 to-slate-900 bg-cover bg-center"
                    style={{
                      backgroundImage: `url('${selectedNews.image}')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={() => setSelectedNews(null)}
                    className="absolute top-3 sm:top-4 right-3 sm:right-4 p-2 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-lg transition-colors z-10"
                  >
                    <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </button>

                  {/* Title and Category Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 md:px-8 py-5 sm:py-6 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <div
                      className={`inline-block mb-2 sm:mb-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${selectedNews.categoryColor} backdrop-blur-sm`}
                    >
                      {selectedNews.category}
                    </div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-tight">
                      {selectedNews.title}
                    </h2>
                  </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6">
                  <div className="space-y-4 sm:space-y-6">
                    <p className="text-sm sm:text-base md:text-lg text-zinc-300 leading-relaxed">
                      {selectedNews.description}
                    </p>

                    <div className="h-1 bg-gradient-to-r from-purple-500/0 via-purple-500/50 to-purple-500/0 rounded-full" />

                    <div className="space-y-3 sm:space-y-4">
                      <h3 className="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                        Full Story
                      </h3>
                      <p className="text-xs sm:text-sm md:text-base text-zinc-400 leading-relaxed">
                        {loremText}
                      </p>
                      <p className="text-xs sm:text-sm md:text-base text-zinc-400 leading-relaxed">
                        {loremText}
                      </p>
                    </div>
                  </div>

                  {/* Custom scrollbar styles */}
                  <style jsx>{`
                    div::-webkit-scrollbar {
                      width: 8px;
                    }
                    div::-webkit-scrollbar-track {
                      background: rgba(24, 24, 27, 0.5);
                    }
                    div::-webkit-scrollbar-thumb {
                      background: rgba(168, 85, 247, 0.5);
                      border-radius: 4px;
                    }
                    div::-webkit-scrollbar-thumb:hover {
                      background: rgba(168, 85, 247, 0.8);
                    }
                  `}</style>
                </div>

                {/* Footer with Share Buttons */}
                <div className="border-t border-zinc-700/50 px-4 sm:px-6 md:px-8 py-3 sm:py-4 bg-zinc-900/50 flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
                  <span className="text-xs sm:text-sm text-zinc-400 font-medium">
                    Share:
                  </span>
                  <button
                    onClick={() => handleShare("facebook", selectedNews)}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-[#1877F2] backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:scale-110"
                    aria-label="Share on Facebook"
                  >
                    <FaFacebookF className="text-white text-xs sm:text-sm" />
                  </button>
                  <button
                    onClick={() => handleShare("twitter", selectedNews)}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-[#1DA1F2] backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:scale-110"
                    aria-label="Share on Twitter"
                  >
                    <FaTwitter className="text-white text-xs sm:text-sm" />
                  </button>
                  <button
                    onClick={() => handleShare("linkedin", selectedNews)}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-[#0A66C2] backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:scale-110"
                    aria-label="Share on LinkedIn"
                  >
                    <FaLinkedin className="text-white text-xs sm:text-sm" />
                  </button>
                  <button
                    onClick={() => handleShare("whatsapp", selectedNews)}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-[#25D366] backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:scale-110"
                    aria-label="Share on WhatsApp"
                  >
                    <FaWhatsapp className="text-white text-xs sm:text-sm" />
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
