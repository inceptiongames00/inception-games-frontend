"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import {
  Trophy,
  Users,
  Gamepad2,
  DollarSign,
  ArrowRight,
  Flame,
} from "lucide-react";
import Header from "./components/Header";
import TrustedBrands from "./components/TrustedBrands";
import GiveawayWinner from "./components/GiveawayWinner";
import OurPartners from "./components/OurPartners";
import Ecosystem from "../../src/app/components/Ecosystem/Ecosystem.jsx";
import Image from "next/image";
import UnifiedAuthModal from "./components/AuthModals/UnifiedAuthModal";
import LaunchCountdownModal from "./components/LaunchCountdownModal";
import LatestNews from "./components/LatestNews";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";

function AnimatedCounter({ target, suffix = "", prefix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const step = target / 60;

          const id = setInterval(() => {
            start += step;
            if (start >= target) {
              setCount(target);
              clearInterval(id);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const scrollTimeoutRef = useRef(null);
  const observerRef = useRef(null);
  const pollIntervalRef = useRef(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [countdownModalOpen, setCountdownModalOpen] = useState(false);

  const howToEarn = [
    {
      step: "01",
      title: "Sign Up Free",
      desc: "Create your account in 60 seconds.",
      icon: Gamepad2,
      color: "text-purple-400",
      bg: "bg-purple-500/10 border-purple-500/30",
    },
    {
      step: "02",
      title: "Join Tournaments",
      desc: "Play and compete.",
      icon: Trophy,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10 border-yellow-500/30",
    },
    {
      step: "03",
      title: "Build Fanbase",
      desc: "Grow followers.",
      icon: Users,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10 border-cyan-500/30",
    },
    {
      step: "04",
      title: "Earn Money",
      desc: "Get paid.",
      icon: DollarSign,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/30",
    },
  ];

  useEffect(() => {
    const section =
      searchParams.get("section") ||
      new URLSearchParams(window.location.search).get("section");
    console.log(
      "[v0] Section param detected:",
      section,
      "URL:",
      window.location.href,
    );

    if (!section) return;

    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    if (observerRef.current) observerRef.current.disconnect();
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);

    const doScroll = () => {
      const element = document.getElementById(section);

      if (!element) {
        const allIds = Array.from(document.querySelectorAll("[id]")).map(
          (el) => el.id,
        );
        console.log(
          "[v0] Element not found:",
          section,
          "Available IDs:",
          allIds,
        );
      } else {
        console.log("[v0] Element found! Scrolling to:", section);
        const headerOffset = 120;
        const elementPosition =
          element.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: elementPosition - headerOffset,
          behavior: "smooth",
        });

        if (observerRef.current) observerRef.current.disconnect();
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      }

      return !!element;
    };

    scrollTimeoutRef.current = setTimeout(() => {
      console.log("[v0] Starting scroll attempt for section:", section);

      if (doScroll()) return;

      observerRef.current = new MutationObserver(() => {
        doScroll();
      });

      observerRef.current.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false,
      });

      let scrollAttempts = 0;
      const maxAttempts = 50;

      pollIntervalRef.current = setInterval(() => {
        scrollAttempts++;
        if (doScroll()) {
          clearInterval(pollIntervalRef.current);
          if (observerRef.current) observerRef.current.disconnect();
        } else if (scrollAttempts >= maxAttempts) {
          console.log("[v0] Max scroll attempts reached for section:", section);
          clearInterval(pollIntervalRef.current);
          if (observerRef.current) observerRef.current.disconnect();
        }
      }, 300);
    }, 800);

    return () => {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      if (observerRef.current) observerRef.current.disconnect();
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [searchParams]);

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#0a0a14" }}>
      <Header />

      {/* ── HERO + SCRIMS WEEK ── */}
   <section className="relative bg-zinc-950 overflow-hidden">
  {/* Hero Section */}
  <div className="relative min-h-screen flex items-start justify-center overflow-hidden">
    <div className="absolute inset-0">
      <Image
        src="/Hero/bg.jpeg"
        alt="Esports Arena"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-zinc-950/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950/30" />
    </div>

    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 w-full pt-30">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center gap-6"
      >
        {/* Live badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 bg-zinc-900/60 border border-purple-500/50 rounded-full px-4 sm:px-5 py-1.5 sm:py-2"
        >
          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs sm:text-sm text-zinc-300 whitespace-nowrap">
            500 Gamers Earning,{" "}
            <span className="text-purple-400 font-semibold">Right Now</span>
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight text-center"
        >
          PLAY GAMES.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
            GET PAID.
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-base sm:text-lg text-zinc-300 max-w-2xl text-center leading-relaxed px-4"
        >
          From casual solo to esports grinder - turn your skills into real
          earnings through Scrims, tournaments, and creator brand deals, all
          in one place.
        </motion.p>

        {/* CTA Pills - Responsive flex wrap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-2 sm:gap-3 pt-2 sm:pt-4 px-2"
        >
          {[
            { icon: "🏆", text: "Play Scrims" },
            { icon: "🏆", text: "Play Tournaments" },
            { icon: "💎", text: "Brand Deals" },
            { icon: "🎁", text: "Free Entry @ 500 Fans" },
          ].map((item, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="relative px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-full text-white font-semibold transition-all duration-300 group whitespace-nowrap overflow-hidden border border-white/20 text-xs sm:text-sm"
              style={{
                background: "rgba(20, 20, 30, 0.3)",
                backdropFilter: "blur(10px)",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-transparent opacity-60 rounded-full" />
              <span className="flex items-center gap-1.5 sm:gap-2 relative z-10">
                <span className="text-base sm:text-lg">{item.icon}</span>
                {item.text}
              </span>
            </motion.button>
          ))}
        </motion.div>


        {/* Scrim Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="max-w-7xl mx-auto w-full mt-4"
        >
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold italic text-white">
              SCRIMS WEEK
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 tracking-widest">
              REGISTRATION GOING ON
            </p>
          </div>

          {/* Cards Grid - Responsive 5 columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5 px-4 sm:px-0">
            {[
              {
                title: "Free Fire",
                label: "FREE ENTRY",
                date: "STARTING 19TH",
                image: "https://images.pexels.com/photos/13930769/pexels-photo-13930769.jpeg?auto=compress&cs=tinysrgb&w=600",
                borderColor: "from-pink-500 to-blue-500",
                bgGradient: "from-pink-600 to-pink-500",
              },
              {
                title: "PUBG Mobile",
                label: "FREE ENTRY",
                date: "STARTING 19TH",
                image: "https://images.pexels.com/photos/13930769/pexels-photo-13930769.jpeg?auto=compress&cs=tinysrgb&w=600",
                borderColor: "from-purple-500 to-cyan-500",
                bgGradient: "from-purple-600 to-purple-500",
              },
              {
                title: "eFootball 2025",
                label: "FREE ENTRY",
                date: "STARTING 19TH",
                image: "https://images.pexels.com/photos/13930769/pexels-photo-13930769.jpeg?auto=compress&cs=tinysrgb&w=600",
                borderColor: "from-yellow-500 to-pink-500",
                bgGradient: "from-yellow-600 to-yellow-500",
              },
              {
                title: "FC 25",
                label: "FREE ENTRY",
                date: "STARTING 19TH",
                image: "https://images.pexels.com/photos/13930769/pexels-photo-13930769.jpeg?auto=compress&cs=tinysrgb&w=600",
                borderColor: "from-blue-500 to-purple-500",
                bgGradient: "from-blue-600 to-blue-500",
              },
              {
                title: "Valorant",
                label: "FREE ENTRY",
                date: "STARTING 19TH",
                image: "https://images.pexels.com/photos/13930769/pexels-photo-13930769.jpeg?auto=compress&cs=tinysrgb&w=600",
                borderColor: "from-red-500 to-orange-500",
                bgGradient: "from-red-600 to-red-500",
              },
            ].map((game, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + i * 0.08, duration: 0.5 }}
                className="group cursor-pointer h-full"
              >
                {/* Neon Border Container */}
                <div
                  className={`relative bg-gradient-to-br ${game.borderColor} p-[1.5px] rounded-lg sm:rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl h-full`}
                  style={{
                    boxShadow: "0 0 20px rgba(0,0,0,0.5)",
                  }}
                >
                  {/* Inner container */}
                  <div className="relative bg-zinc-950 rounded-lg sm:rounded-xl overflow-hidden flex flex-col h-full">
                    {/* Image Section */}
                    <div className="relative flex-1 overflow-hidden min-h-24 sm:min-h-28 md:min-h-36">
                      <img
                        src={game.image}
                        alt={game.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />
                      
                      {/* Top accent glow */}
                      <div className="absolute top-0 left-1/4 w-1/2 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>

                    {/* Bottom Info Section */}
                    <div className={`relative bg-gradient-to-r ${game.bgGradient} px-2.5 sm:px-3.5 py-2 sm:py-3`}>
                      <h3 className="text-xs sm:text-sm md:text-base font-bold text-yellow-300 mb-0.5 uppercase tracking-wider line-clamp-2 group-hover:text-white transition-colors duration-300">
                        {game.title}
                      </h3>
                      <p className="text-[10px] sm:text-xs font-bold text-yellow-300 mb-0.5 uppercase group-hover:text-yellow-100 transition-colors duration-300">
                        {game.label}
                      </p>
                      <p className="text-[8px] sm:text-[10px] text-white/90 uppercase tracking-wider">
                        {game.date}
                      </p>
                    </div>

                    {/* Corner accents */}
                    <div className="absolute top-1 right-1 w-1.5 h-1.5 border-r-[1.5px] border-t-[1.5px] border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-1 left-1 w-1.5 h-1.5 border-l-[1.5px] border-b-[1.5px] border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  </div>


  {/* Scroll indicator */}
  <motion.div
    animate={{ y: [0, 8, 0] }}
    transition={{ duration: 2, repeat: Infinity }}
    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-zinc-600 z-20"
  >
    <span className="text-xs">Scroll to explore</span>
    <div className="w-5 h-8 border-2 border-zinc-700 rounded-full flex items-start justify-center pt-1">
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="w-1 h-2 bg-purple-500 rounded-full"
      />
    </div>
  </motion.div>
</section>

      {/* ── HOW TO EARN ── */}
      <section
        id="how-to-earn"
        className="py-28 px-6 bg-zinc-950 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-purple-950/10 to-zinc-950 pointer-events-none" />
        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 rounded-full px-4 py-1.5 mb-5">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-purple-300">Your Earning Path</span>
            </div>
            <h2 className="text-5xl mb-4">
              How You{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Earn Money
              </span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Four simple steps from a casual gamer to a paid professional.
              Start today, get paid this month.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8 relative py-16">
            <div className="hidden md:block absolute top-36 left-[5%] right-[5%] h-1 pointer-events-none">
              <div className="processing-line w-full h-full" />
            </div>

            {howToEarn.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ y: -16 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  delay: i * 0.1,
                  duration: 0.6,
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                }}
                className="relative flex flex-col items-center text-center group"
              >
                <motion.div
                  whileHover={{
                    scale: 1.2,
                    y: -4,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className={`icon-animate-reveal icon-animate-reveal-${i} w-24 h-24 bg-gray-900 rounded-full border-1 border-gray-500 rounded-3xl flex items-center justify-center mb-8 relative z-10 transition-all duration-300`}
                  style={{
                    boxShadow: `0 20px 40px rgba(100, 100, 100, 0.1)`,
                  }}
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{
                      duration: 25,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute inset-1 rounded-full border-2 border-dashed opacity-50 group-hover:opacity-40 transition-opacity duration-300"
                    style={{
                      borderColor: "rgb(129, 23, 241)",
                    }}
                  />
                  <item.icon className="w-10 h-10 relative z-20 icon-color" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.2 }}
                  className="step-label text-xs font-extrabold mb-3 tracking-widest"
                  style={{
                    color: "rgb(120, 120, 120)",
                  }}
                >
                  STEP {item.step}
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.1 }}
                  className="step-title text-2xl font-bold mb-3 leading-tight transition-all duration-300"
                  style={{
                    color: "rgb(130, 130, 130)",
                  }}
                >
                  {item.title}
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.15 }}
                  className="step-description text-base leading-relaxed transition-colors duration-300"
                  style={{
                    color: "rgb(100, 100, 100)",
                  }}
                >
                  {item.desc}
                </motion.p>

                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.3, duration: 0.8 }}
                  className="h-1 mt-6 w-12 rounded-full origin-left"
                  style={{
                    background: `linear-gradient(90deg, ${["#a855f7", "#facc15", "#06b6d4", "#10b981"][i]}, ${["#ec4899", "#f97316", "#0ea5e9", "#34d399"][i]})`,
                  }}
                />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mt-14"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (user) {
                  router.push("/profile");
                } else {
                  setLoginModalOpen(true);
                }
              }}
              className="relative cursor-pointer px-10 py-3 bg-gradient-to-r from-purple-900 to-pink-800 hover:bg-transparent transition-all duration-500 rounded-[40px] inline-flex items-center gap-2 shadow-lg shadow-purple-500/20 font-semibold text-lg overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-pink-800 group-hover:opacity-0 transition-opacity duration-500 rounded-[40px]" />

              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-white/5 backdrop-blur-md rounded-[40px]" />

              <motion.div className="absolute inset-0 opacity-0 group-hover:opacity-100">
                <motion.div
                  className="absolute -left-1/2 top-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/25 to-transparent"
                  animate={{ x: ["0%", "250%"] }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </motion.div>

              <div className="absolute inset-0 rounded-[40px] border border-white/0 group-hover:border-purple-300/30 transition-all duration-500" />

              <span className="relative z-10 text-white group-hover:text-purple-200 transition-colors duration-300">
                {user ? "My Profile" : "Start Your Journey"}
              </span>

              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      <TrustedBrands />
      {/* ── GIVEAWAY WINNER SECTION  ── */}
      <GiveawayWinner />
      {/* ── PARTNER & UPDATES SECTION  ── */}
      <OurPartners />
      {/* <Ecosystem /> */}
      <LatestNews />
      <div id="career">{/* Career section can be added here if needed */}</div>
      <ContactSection />
      <Footer />

      {/* Countdown Modal */}
      <LaunchCountdownModal
        isOpen={countdownModalOpen}
        onClose={() => setCountdownModalOpen(false)}
        onCountdownComplete={() => {
          setCountdownModalOpen(false);
          setLoginModalOpen(true);
        }}
      />

      {/* Login Modal */}
      <UnifiedAuthModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div />}>
      <HomeContent />
    </Suspense>
  );
}
