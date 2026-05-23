"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import EventCard from "./EventCard";
import { useRouter } from "next/navigation";

export default function EventsSlider() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const router = useRouter();

  // Fetch events on mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // Auto-play carousel
  useEffect(() => {
    if (!autoPlay || events.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % events.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [autoPlay, events.length]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://inception-games.an.r.appspot.com/api/v1/tournaments?limit=6"
      );

      if (!response.ok) {
        console.error("Failed to fetch events:", response.statusText);
        setEvents([]);
        return;
      }

      const data = await response.json();
      // Handle different API response formats
      const eventList = data.data || data.tournaments || data || [];
      const formattedEvents = (Array.isArray(eventList) ? eventList : []).slice(0, 6);
      setEvents(formattedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePrev = () => {
    setAutoPlay(false);
    setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
    setTimeout(() => setAutoPlay(true), 5000);
  };

  const handleNext = () => {
    setAutoPlay(false);
    setCurrentIndex((prev) => (prev + 1) % events.length);
    setTimeout(() => setAutoPlay(true), 5000);
  };

  const handleEventClick = (event) => {
    router.push(`/events/${event.id}`);
  };

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="text-purple-500 animate-spin" />
          <p className="text-gray-400">Loading events...</p>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return null; // Don't show slider if no events
  }

  const itemsToShow = 3;
  const visibleEvents = events.slice(currentIndex, currentIndex + itemsToShow);

  return (
    <div className="w-full py-12 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Featured Events
            </h2>
            <p className="text-gray-400">
              Join upcoming tournaments, scrims, and brand deals
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="hidden md:flex gap-2">
            <button
              onClick={handlePrev}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all hover:border-purple-500/30"
              aria-label="Previous events"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNext}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all hover:border-purple-500/30"
              aria-label="Next events"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <AnimatePresence mode="wait">
              {visibleEvents.map((event, idx) => (
                <motion.div
                  key={`${event.id}-${currentIndex}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <EventCard event={event} onClick={handleEventClick} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {Array.from({ length: Math.ceil(events.length / itemsToShow) }).map(
              (_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setAutoPlay(false);
                    setCurrentIndex(idx * itemsToShow);
                    setTimeout(() => setAutoPlay(true), 5000);
                  }}
                  className={`h-2 rounded-full transition-all ${
                    idx * itemsToShow === currentIndex
                      ? "w-6 bg-purple-500"
                      : "w-2 bg-white/20 hover:bg-white/40"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              )
            )}
          </div>

          {/* View All Button */}
          <div className="text-center mt-8">
            <button
              onClick={() => router.push("/events")}
              className="px-6 py-3 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg text-purple-300 font-semibold transition-all hover:shadow-lg hover:shadow-purple-500/20"
            >
              View All Events
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
