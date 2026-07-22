"use client";
import { ArrowRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { FaFacebookF, FaTwitter, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import ReadMoreModal from "./Modals/ReadMoreModal";

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
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragEnd, setDragEnd] = useState(0);
  const carouselRef = useRef(null);
  const autoPlayIntervalRef = useRef(null);

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
    if (!isDragging) {
      autoPlayIntervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          const nextIndex = prev + 1;
          return nextIndex >= winnersData.length * 2 ? 0 : nextIndex;
        });
      }, 5000);
    }

    return () => {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
      }
    };
  }, [isDragging, winnersData.length]);

  // Handle drag start
  const handleDragStart = (e) => {
    setIsDragging(true);
    const clientX = e.type && e.type.startsWith("touch") ? e.touches?.[0]?.clientX : e.clientX;
    setDragStart(clientX || 0);
  };

  // Handle drag move (for better tracking)
  const handleDragMove = (e) => {
    if (!isDragging) return;
    // Update drag start for continuous tracking during swipe
    const currentX = e.type && e.type.startsWith("touch") ? e.touches?.[0]?.clientX : e.clientX;
    if (!currentX) return;
    
    const diff = dragStart - currentX;
    const minSwipeDistance = 10;

    if (Math.abs(diff) > minSwipeDistance) {
      setDragEnd(currentX);
    }
  };

  // Handle drag end
  const handleDragEnd = (e) => {
    if (!isDragging) return;
    
    const clientX = e.type && e.type.startsWith("touch") ? e.changedTouches?.[0]?.clientX : e.clientX;
    const endX = clientX || dragEnd;
    setIsDragging(false);

    const diff = dragStart - endX;
    const minSwipeDistance = 30;

    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0) {
        // Swiped left - next slide
        setCurrentIndex((prev) => {
          const nextIndex = prev + 1;
          return nextIndex >= winnersData.length * 2 ? 0 : nextIndex;
        });
      } else {
        // Swiped right - previous slide
        setCurrentIndex((prev) => {
          return prev === 0 ? winnersData.length * 2 - 1 : prev - 1;
        });
      }
    }
  };

  const handleShare = (platform, winner) => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    const title = winner.title;
    const description = winner.description;
    const image = winner.image;

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
          <div className="flex justify-center gap-2 mt-4">
            <div className="w-50 h-1.5 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full" />
          </div>
        </motion.div>

        <div className="relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 lg:w-40 bg-gradient-to-r from-[#0a0a14] to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 lg:w-40 bg-gradient-to-l from-[#0a0a14] to-transparent z-10"></div>

          <div
            ref={carouselRef}
            className="flex gap-3 sm:gap-4 lg:gap-5 transition-transform duration-500 ease-out px-4 sm:px-6 cursor-grab active:cursor-grabbing select-none"
            style={{
              transform: `translateX(calc(-${currentIndex} * (calc(100% / 3))))`,
              touchAction: "pan-y pinch-zoom",
              userSelect: "none",
            }}
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
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
                  <div className="rounded-2xl overflow-hidden bg-zinc-900/40 border border-zinc-800/50 hover:border-zinc-700/50 transition-all duration-300 flex flex-col backdrop-blur-sm hover:shadow-2xl hover:shadow-purple-500/10 h-full">
                    <div
                      className="relative h-64 sm:h-72 md:h-80 overflow-hidden bg-gradient-to-br from-slate-700 to-slate-900 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                      style={{
                        backgroundImage: `url('${winner.image}')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30" />

                      <div
                        className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${winner.categoryColor} backdrop-blur-md`}
                      >
                        {winner.category}
                      </div>

                      <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-white/10 opacity-50" />
                      <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-white/10 opacity-50" />
                    </div>

                    <div className="p-6 flex-grow flex flex-col justify-between">
                      <div>
                        <h3 className="text-sm md:text-lg text-center font-bold text-white mb-3 leading-tight group-hover:text-purple-300 transition-colors duration-300">
                          {winner.title}
                        </h3>
                      </div>

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

      <AnimatePresence>
        {selectedNews && (
          <ReadMoreModal
            selectedNews={selectedNews}
            setSelectedNews={setSelectedNews}
            handleShare={handleShare}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
