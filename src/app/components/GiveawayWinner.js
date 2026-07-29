"use client";
import { ArrowRight } from "lucide-react";
import { useState, useRef, useCallback } from "react";
import { FaFacebookF, FaTwitter, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import ReadMoreModal from "./Modals/ReadMoreModal";

export default function GiveawayWinner() {
  const [selectedNews, setSelectedNews] = useState(null);

  const trackRef = useRef(null);
  // Drag state stored in refs to avoid re-renders
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragOffsetAtStart = useRef(0); // pixel offset when drag began

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
      title: "Mousepad Giveaway tonight guys. Don't miss the chance.",
      description:
        "🎁 গিভঅ্যাওয়ে অ্যালার্ট: জিতে নিন প্রিমিয়াম গেমিং মাউস প্যাড! 🎁 Slice N Share কমিউনিটির জন্য আমরা নিয়ে এসেছি আরও একটি দুর্দান্ত গিভঅ্যাওয়ে! এবার আপনার গেমিং সেটআপকে আরও নিখুঁত করতে জিতে নিন একটি গেমিং মাউস প্যাড। ✨ অংশগ্রহণের নিয়মাবলি: - এই পোস্টটি আপনার টাইমলাইনে শেয়ার করুন (পোস্ট পাবলিক রাখতে হবে)। - কমেন্ট সেকশনে আপনার ৫ জন গেমার বন্ধুকে মেনশন করুন। - আমাদের পেজ ফলো করার জন্য ১০ জন বন্ধুকে ইনভাইট করুন। - সবগুলো কাজ শেষ করে এই পোস্টে 'MP2' লিখে কমেন্ট করুন",
      category: "Giveaway",
      categoryColor:
        "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
      image:
        "https://res.cloudinary.com/jvpygp4b/image/upload/v1783243501/mouse-pad_igx1iz.jpg",
    },
  ];

  // Triplicate for seamless infinite loop
  const winners = [...winnersData, ...winnersData, ...winnersData];

  // ── Helpers ──────────────────────────────────────────────────────────────

  /** Read the current translateX value being applied by the CSS animation. */
  const getCurrentOffset = () => {
    const el = trackRef.current;
    if (!el) return 0;
    const matrix = window.getComputedStyle(el).transform;
    if (!matrix || matrix === "none") return 0;
    // matrix(a,b,c,d,tx,ty)
    const match = matrix.match(/matrix.*\((.+)\)/);
    if (!match) return 0;
    const values = match[1].split(", ");
    return parseFloat(values[4]) || 0;
  };

  /** Pause the CSS animation and lock the track at its current pixel position. */
  const freezeAtCurrentOffset = () => {
    const el = trackRef.current;
    if (!el) return 0;
    const offset = getCurrentOffset();
    el.style.animationPlayState = "paused";
    el.style.transform = `translateX(${offset}px)`;
    // Detach from animation so our manual transform takes over
    el.style.animation = "none";
    return offset;
  };

  /** Resume the CSS animation, picking up from the given pixel offset. */
  const resumeAnimation = (offsetPx) => {
    const el = trackRef.current;
    if (!el) return;
    const totalWidth = el.scrollWidth;
    const loopWidth = totalWidth / 3; // one third = one copy
    // Clamp offset into [0, loopWidth) for a clean resume
    const clamped = ((offsetPx % loopWidth) + loopWidth) % loopWidth;
    // Convert pixel offset to a percentage of the full animation range (0 → -33.333%)
    const progress = clamped / loopWidth; // 0..1
    // animation-delay trick: negative delay = start mid-animation
    const duration = 30; // seconds, must match CSS
    const delay = -(progress * duration);
    el.style.transform = "";
    el.style.animation = `marquee-scroll ${duration}s linear ${delay}s infinite`;
    el.style.animationPlayState = "running";
  };

  // ── Drag / Swipe handlers ────────────────────────────────────────────────

  const onDragStart = useCallback((clientX) => {
    isDragging.current = true;
    dragStartX.current = clientX;
    dragOffsetAtStart.current = freezeAtCurrentOffset();
    if (trackRef.current) {
      trackRef.current.style.cursor = "grabbing";
    }
  }, []);

  const onDragMove = useCallback((clientX) => {
    if (!isDragging.current || !trackRef.current) return;
    const delta = clientX - dragStartX.current;
    const newOffset = dragOffsetAtStart.current + delta;
    trackRef.current.style.transform = `translateX(${newOffset}px)`;
  }, []);

  const onDragEnd = useCallback((clientX) => {
    if (!isDragging.current || !trackRef.current) return;
    isDragging.current = false;
    trackRef.current.style.cursor = "grab";
    const delta = clientX - dragStartX.current;
    const finalOffset = dragOffsetAtStart.current + delta;
    // Convert positive (leftward drag gives negative translateX) back to positive scroll offset
    resumeAnimation(-finalOffset);
  }, []);

  // Mouse events
  const handleMouseDown = (e) => onDragStart(e.clientX);
  const handleMouseMove = (e) => {
    if (isDragging.current) onDragMove(e.clientX);
  };
  const handleMouseUp = (e) => onDragEnd(e.clientX);
  const handleMouseLeave = (e) => {
    if (isDragging.current) onDragEnd(e.clientX);
  };

  // Pause / resume on hover
  const handleMouseEnter = () => {
    if (!isDragging.current && trackRef.current) {
      trackRef.current.style.animationPlayState = "paused";
    }
  };
  const handleSliderMouseLeave = (e) => {
    if (isDragging.current) {
      onDragEnd(e.clientX);
    } else if (trackRef.current) {
      trackRef.current.style.animationPlayState = "running";
    }
  };

  // Touch events
  const handleTouchStart = (e) => onDragStart(e.touches[0].clientX);
  const handleTouchMove = (e) => onDragMove(e.touches[0].clientX);
  const handleTouchEnd = (e) => onDragEnd(e.changedTouches[0].clientX);

  // ── Share ────────────────────────────────────────────────────────────────

  const handleShare = (platform, winner) => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    const { title, description } = winner;
    let shareLink = "";

    switch (platform) {
      case "facebook":
        if (typeof window !== "undefined" && window.FB) {
          window.FB.ui(
            {
              method: "share",
              href: shareUrl,
              hashtag: "#InceptionGames",
              display: "popup",
            },
            () => {},
          );
          return;
        }
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(title)}`;
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

  // ── Render ───────────────────────────────────────────────────────────────

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

        {/* Slider */}
        <div
          className="relative overflow-hidden"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleSliderMouseLeave}
        >
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 lg:w-40 bg-gradient-to-r from-[#0a0a14] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 lg:w-40 bg-gradient-to-l from-[#0a0a14] to-transparent z-10 pointer-events-none" />

          {/* Marquee track */}
          <div
            ref={trackRef}
            className="giveaway-marquee flex gap-3 sm:gap-4 lg:gap-5 cursor-grab select-none"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ touchAction: "pan-y pinch-zoom" }}
          >
            {winners.map((winner, idx) => (
              <div
                key={`winner-${idx}`}
                className="group cursor-pointer flex-shrink-0 w-72 sm:w-86"
              >
                <div className="group h-full">
                  <div className="rounded-2xl overflow-hidden bg-zinc-900/40 border border-zinc-800/50 hover:border-zinc-700/50 transition-all duration-300 flex flex-col backdrop-blur-sm hover:shadow-2xl hover:shadow-purple-500/10 h-full">
                    {/* Card image */}
                    <div
                      className="relative h-64 sm:h-72 md:h-80 overflow-hidden bg-gradient-to-br from-slate-700 to-slate-900 group-hover:scale-105 transition-transform duration-500"
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

                    {/* Card body */}
                    <div className="pt-4 px-2 flex-grow flex flex-col justify-between">
                      <h3 className="text-sm md:text-lg text-center font-bold text-white mb-3 leading-tight group-hover:text-purple-300 transition-colors duration-300">
                        {winner.title}
                      </h3>

                      <div className="mt-6 pt-4 border-t border-zinc-700/50">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedNews(winner)}
                            className="inline-flex items-center gap-1 p-2 px-4 bg-gradient-to-r from-purple-600 to-purple-500 rounded-full text-white text-xs uppercase tracking-wider transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50 group/link cursor-pointer"
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
                </div>
              </div>
            ))}
          </div>
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

      <style jsx>{`
        .giveaway-marquee {
          animation: marquee-scroll 30s linear infinite;
          width: max-content;
        }
        @keyframes marquee-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
      `}</style>
    </section>
  );
}
