"use client";
import { ArrowRight, X } from "lucide-react";
import { useState, useEffect } from "react";
import { FaFacebookF, FaTwitter, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// Initialize Facebook SDK
const initializeFacebookSDK = () => {
  if (typeof window === "undefined") return;

  if (!window.FB) {
    window.fbAsyncInit = function () {
      FB.init({
        appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || "1234567890",
        xfbml: true,
        version: "v18.0",
      });
    };

    const script = document.createElement("script");
    script.async = true;
    script.defer = true;
    script.crossOrigin = "anonymous";
    script.src =
      "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0";
    document.body.appendChild(script);
  }
};

export default function GiveawayWinner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedNews, setSelectedNews] = useState(null);

  const winnersData = [
    {
      title: "5 Jerseys Giveaway is ON GKEC 🎉",
      description: "",
      category: "Giveaway",
      categoryColor:
        "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
      image:
        "https://res.cloudinary.com/jvpygp4b/image/upload/v1783243580/jersey_yngoyq.jpg",
    },
    {
      title: "Gaming Mouse Winner - ANTOR HASAN",
      description:
        "বিশাল অভিনন্দন ময়মনসিংহের অন্তর হাসানকে, আমাদের গেমিং মাউস গিভঅ্যাওয়ের ভাগ্যবান বিজয়ী! 🎉 আজ ঢাকায় আমাদের ফাউন্ডার অত্যন্ত আনন্দের সাথে হার্ডওয়্যারটি তার বন্ধু ইমরানের হাতে আনুষ্ঠানিকভাবে তুলে দিয়েছেন। নতুন মাউস দিয়ে গেমিং হোক আরও নিখুঁত, অন্তর!",
      category: "Giveaway",
      categoryColor:
        "bg-green-500/20 text-green-300 border border-green-500/30",
      image:
        "https://res.cloudinary.com/jvpygp4b/image/upload/v1783243503/mouse-winner_l9hp4i.jpg",
    },
    {
      title: "GPU Winner - AL MOHAIMIN FARABI",
      description:
        "আনন্দের সাথে জানাচ্ছি যে, আমাদের জিপিইউ (GPU) গিভঅ্যাওয়ে বিজয়ী আল মোহাইমিন ফারাবী আজ তার পুরস্কারটি বুঝে নিতে চট্টগ্রাম থেকে ঢাকায় এসেছেন! এবং জিপিইউ বুঝে পেয়েছেন। ব্র্যান্ড নিউ ARC A580 8GB. যারা এই আয়োজনে অংশ নিয়েছেন এবং আমাদের সাপোর্ট করেছেন, তাদের সবাইকে ধন্যবাদ। জিপিইউটি নিজ হাতে বিজয়ীর হাতে তুলে দেওয়ার জন্য আমাদের ফাউন্ডারকে বিশেষ ধন্যবাদ। তিনি আরোও জানান, নতুন আরও কিছু চমক ঈদের পর আসছে।",
      category: "Giveaway",
      categoryColor: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
      image:
        "https://res.cloudinary.com/jvpygp4b/image/upload/v1783243502/gpu-winner_w22div.jpg",
    },
    {
      title: "Mousepad Giveaway tonight guys. Don't miss the chance. ",
      description:
        "🎁 গিভঅ্যাওয়ে অ্যালার্ট: জিতে নিন প্রিমিয়াম গেমিং মাউস প্যাড! 🎁 Slice N Share কমিউনিটির জন্য আমরা নিয়ে এসেছি আরও একটি দুর্দান্ত গিভঅ্যাওয়ে! এবার আপনার গেমিং সেটআপকে আরও নিখুঁত করতে জিতে নিন একটি গেমিং মাউস প্যাড। ✨ অংশগ্রহণের নিয়মাবলি: - এই পোস্টটি আপনার টাইমলাইনে শেয়ার করুন (পোস্ট পাবলিক রাখতে হবে)। - কমেন্ট সেকশনে আপনার ৫ জন গেমার বন্ধুকে মেনশন করুন। - আমাদের পেজ ফলো করার জন্য ১০ জন বন্ধুকে ইনভাইট করুন। - সবগুলো কাজ শেষ করে এই পোস্টে 'MP2' লিখে কমেন্ট করুন",
      category: "Giveaway",
      categoryColor:
        "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
      image:
        "https://res.cloudinary.com/jvpygp4b/image/upload/v1783243501/mouse-pad_igx1iz.jpg",
    },
  ];

  // Duplicate for seamless infinite loop
  const winners = [...winnersData, ...winnersData];

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIndex = prev + 1;
        // Loop back when reaching the end of duplicated set
        return nextIndex >= winnersData.length * 2 ? 0 : nextIndex;
      });
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [winnersData.length]);

  const handleShare = (platform, winner) => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    const title = winner.title;
    const description = winner.description;
    const image = winner.image;

    // Update Open Graph meta tags dynamically for social sharing
    if (typeof window !== "undefined") {
      const updateMetaTags = () => {
        let ogTitle = document.querySelector('meta[property="og:title"]');
        let ogDescription = document.querySelector(
          'meta[property="og:description"]',
        );
        let ogImage = document.querySelector('meta[property="og:image"]');
        let ogUrl = document.querySelector('meta[property="og:url"]');
        let twitterTitle = document.querySelector('meta[name="twitter:title"]');
        let twitterDescription = document.querySelector(
          'meta[name="twitter:description"]',
        );
        let twitterImage = document.querySelector('meta[name="twitter:image"]');

        if (!ogTitle) {
          ogTitle = document.createElement("meta");
          ogTitle.setAttribute("property", "og:title");
          document.head.appendChild(ogTitle);
        }
        if (!ogDescription) {
          ogDescription = document.createElement("meta");
          ogDescription.setAttribute("property", "og:description");
          document.head.appendChild(ogDescription);
        }
        if (!ogImage) {
          ogImage = document.createElement("meta");
          ogImage.setAttribute("property", "og:image");
          document.head.appendChild(ogImage);
        }
        if (!ogUrl) {
          ogUrl = document.createElement("meta");
          ogUrl.setAttribute("property", "og:url");
          document.head.appendChild(ogUrl);
        }
        if (!twitterTitle) {
          twitterTitle = document.createElement("meta");
          twitterTitle.setAttribute("name", "twitter:title");
          document.head.appendChild(twitterTitle);
        }
        if (!twitterDescription) {
          twitterDescription = document.createElement("meta");
          twitterDescription.setAttribute("name", "twitter:description");
          document.head.appendChild(twitterDescription);
        }
        if (!twitterImage) {
          twitterImage = document.createElement("meta");
          twitterImage.setAttribute("name", "twitter:image");
          document.head.appendChild(twitterImage);
        }

        ogTitle.setAttribute("content", title);
        ogDescription.setAttribute("content", description);
        ogImage.setAttribute("content", image);
        ogUrl.setAttribute("content", shareUrl);
        twitterTitle.setAttribute("content", title);
        twitterDescription.setAttribute("content", description);
        twitterImage.setAttribute("content", image);
      };

      updateMetaTags();
    }

    let shareLink = "";

    switch (platform) {
      case "facebook":
        // Use Facebook Share Dialog - requires app ID but gives better results
        if (typeof window !== "undefined" && window.FB) {
          FB.ui(
            {
              method: "share",
              href: shareUrl,
              hashtag: "#InceptionGames",
              display: "popup",
            },
            function () {},
          );
          return;
        } else {
          // Fallback to direct share
          shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(title)}`;
        }
        break;
      case "twitter":
        shareLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title + " - " + description)}&hashtags=InceptionGames,Esports`;
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

    if (typeof window !== "undefined" && shareLink) {
      window.open(shareLink, "share-dialog", "width=800,height=600");
    }
  };

  return (
    <section
      className="py-20 px-4 sm:px-6"
      style={{ backgroundColor: "#0a0a14" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-white">
            GIVEAWAY{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
              WINNER
            </span>
          </h2>
          {/* Underline accent */}
          <div className="flex justify-center gap-2 mt-4">
            <div className="w-50 h-1.5 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full" />
          </div>
        </motion.div>

        {/* Auto-Slider Container */}
        <div className="relative overflow-hidden">
          {/* Gradient overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 lg:w-40 bg-gradient-to-r from-[#0a0a14] to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 lg:w-40 bg-gradient-to-l from-[#0a0a14] to-transparent z-10"></div>

          {/* Carousel Container - Show 3 cards */}
          <div
            className="flex gap-3 sm:gap-4 lg:gap-5 transition-transform duration-500 ease-out px-4 sm:px-6"
            style={{
              transform: `translateX(calc(-${currentIndex} * (calc(100% / 3))))`,
            }}
          >
            {winners.map((winner, idx) => (
              <div
                key={`winner-${idx}`}
                className="w-full lg:w-1/3 flex-shrink-0 px-2 sm:px-3"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="group cursor-pointer h-full"
                >
                  {/* Card Container */}
                  <div className="rounded-2xl overflow-hidden bg-zinc-900/40 border border-zinc-800/50 hover:border-zinc-700/50 transition-all duration-300 flex flex-col backdrop-blur-sm hover:shadow-2xl hover:shadow-purple-500/10 h-full">
                    {/* Image Section */}
                    <div
                      className="relative h-64 sm:h-72 md:h-80 overflow-hidden bg-gradient-to-br from-slate-700 to-slate-900 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                      style={{
                        backgroundImage: `url('${winner.image}')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      {/* Dark Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30" />

                      {/* Category Badge */}
                      <div
                        className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${winner.categoryColor} backdrop-blur-md`}
                      >
                        {winner.category}
                      </div>

                      {/* Corner decorations */}
                      <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-white/10 opacity-50" />
                      <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-white/10 opacity-50" />
                    </div>

                    {/* Content Section */}
                    <div className="p-6 flex-grow flex flex-col justify-between">
                      <div>
                        <h3 className="text-sm md:text-lg text-center font-bold text-white mb-3 leading-tight group-hover:text-purple-300 transition-colors duration-300">
                          {winner.title}
                        </h3>
                      </div>

                      {/* Bottom section with accent line and share buttons */}
                      <div className="mt-6 pt-4 border-t border-zinc-700/50">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedNews(winner)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-500 rounded-full text-white font-semibold text-xs uppercase tracking-wider transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50 group/link cursor-pointer"
                          >
                            Read More
                            <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-300" />
                          </button>

                          <button
                            onClick={() => handleShare("facebook", winner)}
                            className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-[#1877F2] backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:scale-110"
                            aria-label="Share on Facebook"
                          >
                            <FaFacebookF className="text-white text-sm md:text-base" />
                          </button>
                          <button
                            onClick={() => handleShare("twitter", winner)}
                            className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-[#1DA1F2] backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:scale-110"
                            aria-label="Share on Twitter"
                          >
                            <FaTwitter className="text-white text-sm md:text-base" />
                          </button>
                          <button
                            onClick={() => handleShare("linkedin", winner)}
                            className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-[#0A66C2] backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:scale-110"
                            aria-label="Share on LinkedIn"
                          >
                            <FaLinkedin className="text-white text-sm md:text-base" />
                          </button>
                          <button
                            onClick={() => handleShare("whatsapp", winner)}
                            className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-[#25D366] backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:scale-110"
                            aria-label="Share on WhatsApp"
                          >
                            <FaWhatsapp className="text-white text-sm md:text-base" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {winnersData.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`transition-all duration-300 rounded-full ${
                idx === currentIndex % winnersData.length
                  ? "w-8 h-2 bg-gradient-to-r from-pink-500 to-purple-500"
                  : "w-2 h-2 bg-zinc-600 hover:bg-zinc-500"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
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
                    backgroundPosition: "top",
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
                  <div className="h-1 bg-gradient-to-r from-purple-500/0 via-purple-500/50 to-purple-500/0 rounded-full" />

                  <div className="space-y-3 sm:space-y-4">
                    <h3 className="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                      Full Story
                    </h3>
                    <p className="text-xs sm:text-sm md:text-base text-zinc-400 leading-relaxed">
                      {selectedNews.description}
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
    </section>
  );
}
