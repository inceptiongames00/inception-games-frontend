"use client";

import { MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

export default function CommunityBanner() {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="relative overflow-hidden bg-zinc-950 text-white">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-32 h-[500px] w-[500px] rounded-full bg-purple-600/10 blur-[170px]" />
        <div className="absolute right-0 top-0 h-[450px] w-[450px] rounded-full bg-pink-600/10 blur-[180px]" />
        <div className="absolute bottom-0 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-purple-600/10 blur-[180px]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 pt-20 sm:pt-24 md:pt-10 md:py-10 md:px-0">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-6 text-center text-xs uppercase tracking-widest text-zinc-400"
        >
          JOIN OUR COMMUNITY
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center text-4xl sm:text-5xl font-bold tracking-tight leading-tight md:text-6xl lg:text-7xl xl:text-8xl"
        >
          Our{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
            Community
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-8 max-w-3xl text-center text-base leading-8 text-zinc-300 md:text-lg"
        >
          A legacy of high-octane competitive excellence and digital
          <br className="hidden md:block" />
          friendships. Join thousands of passionate gamers and creators
          <br className="hidden md:block" />
          shaping the future of play.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 flex flex-col gap-3 sm:gap-4 md:flex-row md:flex-wrap md:justify-center"
        >
          <button 
            onClick={() => scrollToSection("upcoming-events")}
            className="w-full sm:w-auto rounded-xl border border-white/10 bg-white/5 px-6 sm:px-8 py-3 sm:py-4 font-semibold text-sm sm:text-base backdrop-blur-md transition hover:bg-white/10 cursor-pointer"
          >
            Community Events
          </button>

          <button 
            onClick={() => scrollToSection("explore-merchandise")}
            className="w-full sm:w-auto rounded-xl border border-white/10 bg-white/5 px-6 sm:px-8 py-3 sm:py-4 font-semibold text-sm sm:text-base backdrop-blur-md transition hover:bg-white/10 cursor-pointer"
          >
            Explore Merchhandise
          </button>

          <button 
            onClick={() => scrollToSection("latest-news")}
            className="w-full sm:w-auto rounded-xl border border-white/10 bg-white/5 px-6 sm:px-8 py-3 sm:py-4 font-semibold text-sm sm:text-base backdrop-blur-md transition hover:bg-white/10 cursor-pointer"
          >
            Latest News
          </button>

          <a
            href="https://discord.gg/StTgqPMERz"
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 sm:px-8 py-3 sm:py-4 font-semibold text-sm sm:text-base text-white shadow-[0_0_30px_rgba(79,70,229,0.45)] transition hover:opacity-90"
          >
            <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Join Discord</span>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 sm:mt-16 md:mt-20 overflow-hidden rounded-xl bg-gradient-to-r from-white/[0.04] via-purple-500/[0.05] to-white/[0.04] backdrop-blur-xl border border-white/10"
        >
          <div className="grid w-full grid-cols-2 md:grid-cols-3 items-stretch">
            <div className="py-6 sm:py-7 px-4 text-center border-r border-white/10 md:border-r">
              <h2 className="text-2xl sm:text-3xl font-bold">$1,500+</h2>
              <p className="mt-2 text-[10px] sm:text-xs uppercase tracking-widest text-purple-300">
                Paid Out
              </p>
            </div>

            <div className="relative py-6 sm:py-7 px-4 text-center border-r border-white/10">
              <h2 className="text-2xl sm:text-3xl font-bold">5,000+</h2>
              <p className="mt-2 text-[10px] sm:text-xs uppercase tracking-widest text-purple-300">
                Active Gamers
              </p>
            </div>

            <div className="py-6 sm:py-7 px-4 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold">$1,000+</h2>
              <p className="mt-2 text-[10px] sm:text-xs uppercase tracking-widest text-purple-300">
                Prize Pools
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
