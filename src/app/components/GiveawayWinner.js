"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaFacebookF, FaTwitter, FaLinkedin, FaWhatsapp } from "react-icons/fa";

// Initialize Facebook SDK
const initializeFacebookSDK = () => {
  if (typeof window !== "undefined" && !window.FB) {
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

  const winners = [
    {
      title: "Team Alliances",
      description:
        "Recruit new talent for your organization or find the perfect roster to showcase your skills. Elite scouting starts here.",
      category: "ACTIVE RECRUITMENT",
      categoryColor:
        "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
      image:
        "https://res.cloudinary.com/jvpygp4b/image/upload/v1783243580/jersey_yngoyq.jpg",
    },
    {
      title: "Team Alliances",
      description:
        "Recruit new talent for your organization or find the perfect roster to showcase your skills. Elite scouting starts here.",
      category: "REGIONAL - LIVE NOW",
      categoryColor:
        "bg-green-500/20 text-green-300 border border-green-500/30",
      image:
        "https://res.cloudinary.com/jvpygp4b/image/upload/v1783243503/mouse-winner_l9hp4i.jpg",
    },
    {
      title: "Team Alliances",
      description:
        "Recruit new talent for your organization or find the perfect roster to showcase your skills. Elite scouting starts here.",
      category: "INVITATIONAL",
      categoryColor: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
      image:
        "https://res.cloudinary.com/jvpygp4b/image/upload/v1783243502/gpu-winner_w22div.jpg",
    },
    {
      title: "Team Alliances",
      description:
        "Recruit new talent for your organization or find the perfect roster to showcase your skills. Elite scouting starts here.",
      category: "ACTIVE RECRUITMENT",
      categoryColor:
        "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
      image:
        "https://res.cloudinary.com/jvpygp4b/image/upload/v1783243501/mouse-pad_igx1iz.jpg",
    },
  ];

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIndex = prev + 1;
        // When reaching the end of the duplicated set, jump back to the beginning
        return nextIndex >= winners.length * 2 ? 0 : nextIndex;
      });
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [winners.length]);

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
            style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
          >
            {/* First set */}
            {winners.map((winner, idx) => (
              <div
                key={`set1-${idx}`}
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
                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 leading-tight group-hover:text-purple-300 transition-colors duration-300">
                          {winner.title}
                        </h3>
                        <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
                          {winner.description}
                        </p>
                      </div>

                      {/* Bottom section with accent line and share buttons */}
                      <div className="mt-6 pt-4 border-t border-zinc-700/50">
                        <div className="flex items-center gap-3">
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
            {/* Duplicate set for seamless loop */}
            {winners.map((winner, idx) => (
              <div
                key={`set2-${idx}`}
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
                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 leading-tight group-hover:text-purple-300 transition-colors duration-300">
                          {winner.title}
                        </h3>
                        <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
                          {winner.description}
                        </p>
                      </div>

                      {/* Bottom section with accent line and share buttons */}
                      <div className="mt-6 pt-4 border-t border-zinc-700/50">
                        <div className="flex items-center gap-3">
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
          {winners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`transition-all duration-300 rounded-full ${
                idx === currentIndex
                  ? "w-8 h-2 bg-gradient-to-r from-pink-500 to-purple-500"
                  : "w-2 h-2 bg-zinc-600 hover:bg-zinc-500"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
