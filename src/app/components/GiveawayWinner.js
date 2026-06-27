"use client"

import { motion } from "framer-motion"

export default function GiveawayWinner() {
  const winners = [
    {
      title: "Team Alliances",
      description: "Recruit new talent for your organization or find the perfect roster to showcase your skills. Elite scouting starts here.",
      category: "ACTIVE RECRUITMENT",
      categoryColor: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
      image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=600&h=700&fit=crop",
    },
    {
      title: "Team Alliances",
      description: "Recruit new talent for your organization or find the perfect roster to showcase your skills. Elite scouting starts here.",
      category: "REGIONAL - LIVE NOW",
      categoryColor: "bg-green-500/20 text-green-300 border border-green-500/30",
      image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=600&h=700&fit=crop",
    },
    {
      title: "Team Alliances",
      description: "Recruit new talent for your organization or find the perfect roster to showcase your skills. Elite scouting starts here.",
      category: "INVITATIONAL",
      categoryColor: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
      image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=600&h=700&fit=crop",
    },
  ]

  return (
    <section className="py-20 px-4 sm:px-6" style={{ backgroundColor: "#0a0a14" }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
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

        {/* Winners Grid - 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {winners.map((winner, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: idx * 0.15, duration: 0.6 }}
              whileHover={{ y: -12, scale: 1.02 }}
              className="group cursor-pointer"
            >
              {/* Card Container */}
              <div className="rounded-2xl overflow-hidden bg-zinc-900/40 border border-zinc-800/50 hover:border-zinc-700/50 transition-all duration-300 h-full flex flex-col backdrop-blur-sm hover:shadow-2xl hover:shadow-purple-500/10">
                {/* Image Section */}
                <div
                  className="relative h-64 sm:h-72 md:h-80 overflow-hidden bg-gradient-to-br from-slate-700 to-slate-900 group-hover:scale-105 transition-transform duration-500"
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

                  {/* Bottom accent line */}
                  <div className="mt-6 pt-4 border-t border-zinc-700/50" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
