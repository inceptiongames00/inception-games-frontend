"use client";

import { Suspense } from "react";
import Header from "../components/Header";
import EventsSection from "../components/ProfileComponents/EventsSection";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

export default function PublicEventsPage() {
  return (
    <main className="min-h-screen bg-black">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 px-6 bg-gradient-to-b from-zinc-950 to-black border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Events</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Discover and join tournaments, scrims, and exclusive brand deals. No sign-up required to browse.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Events Section - Reuse from Profile */}
      <section className="py-16 px-6 bg-black min-h-screen">
        <div className="max-w-7xl mx-auto">
          <Suspense fallback={<div className="text-center text-gray-400 py-16">Loading events...</div>}>
            <EventsSection initialFilter="all" routePrefix="" />
          </Suspense>
        </div>
      </section>

      <Footer />
    </main>
  );
}
