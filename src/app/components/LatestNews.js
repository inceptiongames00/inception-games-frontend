"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

export default function LatestNews() {
  const newsList = [
    {
      title: "Season 5: Neon Dawn Launch",
      description: "The biggest update yet brings new maps, characters, and a complete overhaul of the ranking system.",
      image: "/News/bignews.jpg",
      category: "UPDATES",
      categoryColor: "bg-pink-500/20 text-pink-300 border border-pink-500/30",
      readMoreLink: "#",
    },
    {
      title: "Global Finals 2024 Announced",
      description: "The road to the championship begins in Tokyo. Check out the full schedule and ticket information.",
      image: "/News/news3.jpg",
      category: "ESPORTS",
      categoryColor: "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30",
      readMoreLink: "#",
    },
    {
      title: "Creator Spotlight: Zen_Gamer",
      description: "Meet the visionary behind some of our community's most popular custom maps and game modes.",
      image: "/News/news4.jpg",
      category: "COMMUNITY",
      categoryColor: "bg-purple-500/20 text-purple-300 border border-purple-500/30",
      readMoreLink: "#",
    },
  ]

  return (
    <section id="news" className="py-20 px-4 sm:px-6" style={{ backgroundColor: "#0a0a14" }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white">
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
          {newsList.map((news, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: idx * 0.15, duration: 0.6 }}
              whileHover={{ y: -8 }}
              className="group cursor-pointer"
            >
              {/* Card Container */}
              <div className="rounded-2xl overflow-hidden bg-zinc-900/50 border border-zinc-800/50 hover:border-zinc-700/50 transition-all duration-300 h-full flex flex-col backdrop-blur-sm">
                {/* Image Section */}
                <div
                  className="relative h-48 sm:h-56 md:h-64 overflow-hidden bg-gradient-to-br from-slate-700 to-slate-900"
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
                    <a
                      href={news.readMoreLink}
                      className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-semibold text-sm uppercase tracking-wider transition-colors duration-300 group/link"
                    >
                      Read More
                      <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-300" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-500 rounded-full text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
          >
            View All
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
