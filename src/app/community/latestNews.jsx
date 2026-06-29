"use client"
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const newsItems = [
  {
    id: 1,
    category: "UPDATES",
    badgeClass: "bg-pink-200 text-pink-900",
    title: "Season 5: Neon Dawn Launch",
    description:
      "The biggest update yet brings new maps, characters, and a complete overhaul of the ranking system.",
    image: "https://res.cloudinary.com/dpwjt3jxx/image/upload/v1782524556/71RgJZeOr-L._AC_UF894_1000_QL80__koq6v3.jpg",
  },
  {
    id: 2,
    category: "ESPORTS",
    badgeClass: "bg-cyan-200 text-cyan-900",
    title: "Global Finals 2024 Announced",
    description:
      "The road to the championship begins in Tokyo. Check out the full schedule and ticket information.",
    image: "https://res.cloudinary.com/dpwjt3jxx/image/upload/v1782524556/71RgJZeOr-L._AC_UF894_1000_QL80__koq6v3.jpg",
  },
  {
    id: 3,
    category: "COMMUNITY",
    badgeClass: "bg-purple-200 text-purple-900",
    title: "Creator Spotlight: Zen_Gamer",
    description:
      "Meet the visionary behind some of our community's most popular custom maps and game modes.",
    image: "https://res.cloudinary.com/dpwjt3jxx/image/upload/v1782524556/71RgJZeOr-L._AC_UF894_1000_QL80__koq6v3.jpg",
  },
];

export default function LatestNews() {
  const [selectedNews, setSelectedNews] = useState(null);

  useEffect(() => {
    document.body.style.overflow = selectedNews ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [selectedNews]);

  return (
    <section className="bg-[#111117] py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-white md:text-5xl">
            Latest{" "}
            <span className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]">
              News
            </span>
          </h2>
          <p className="mt-4 text-gray-400">
            Stay updated with the latest from the Inception Games universe.
          </p>
        </div>

        {/* News Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {newsItems.map((item) => (
            <article
              key={item.id}
              onClick={() => setSelectedNews(item)}
              className="overflow-hidden rounded-3xl border border-white/10 bg-[#18181F] transition-all duration-300 hover:border-cyan-400/30 cursor-pointer"
            >
              {/* Image */}
              <div className="relative h-56 bg-[#2A2A35]">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm font-medium text-white/50">
                    NEWS_IMAGE_{item.id}
                  </div>
                )}
                <span
                  className={`absolute left-4 top-4 rounded-full px-3 py-1 text-[10px] font-semibold tracking-wider ${item.badgeClass}`}
                >
                  {item.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-2xl font-semibold leading-tight text-white">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-gray-400">
                  {item.description}
                </p>
                <button className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-cyan-400">
                  Read More
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedNews && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 px-4"
            onClick={() => setSelectedNews(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              exit={{ scaleY: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative bg-[#18181F] border border-white/10 rounded-2xl max-w-lg w-full max-h-[80vh] flex flex-col overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedNews(null)}
                className="flex justify-end text-gray-500 hover:text-white cursor-pointer px-6 pt-4"
              >
                <X size={22} />
              </button>

              {/* Scrollable Content */}
              <div className="flex flex-col p-6 pt-2 space-y-4 overflow-y-auto">
                {/* Image with blurred backdrop */}
                <div className="w-full flex justify-center">
                  <div className="relative w-56 h-56">
                    <img
                      src={selectedNews.image}
                      alt={selectedNews.title}
                      className="w-full h-full object-cover rounded-xl shadow-md relative z-10"
                    />
                    <div
                      className="absolute inset-0 bg-cover bg-center blur-sm opacity-30 rounded-xl scale-110"
                      style={{ backgroundImage: `url(${selectedNews.image})` }}
                    />
                  </div>
                </div>

                {/* Text */}
                <div>
                  <span className={`inline-block rounded-full px-3 py-1 text-[10px] font-semibold tracking-wider mb-3 ${selectedNews.badgeClass}`}>
                    {selectedNews.category}
                  </span>
                  <h3 className="text-xl font-semibold text-white mb-1">
                    {selectedNews.title}
                  </h3>
                  <div className="w-full h-px bg-white/10 my-3" />
                  <p className="text-gray-400 text-sm leading-relaxed text-justify">
                    {selectedNews.description}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}