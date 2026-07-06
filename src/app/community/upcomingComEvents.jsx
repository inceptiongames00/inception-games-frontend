"use client";

import { useState } from "react";
import Image from "next/image";
import { Calendar, MessageSquare, ArrowRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const events = [
  {
    id: 1,
    title: "Gaming Tournament",
    image:
      "https://res.cloudinary.com/jvpygp4b/image/upload/v1783157035/showcase_eh4z5f.jpg",
    date: "Oct 24, 7:00 PM",
    type: "upcoming",
    badge: "UPCOMING",
  },
  {
    id: 2,
    title: "University Meetup",
    image:
      "https://res.cloudinary.com/jvpygp4b/image/upload/v1783157043/news3_freort.jpg",
    date: "Oct 26, 6:30 PM",
    type: "upcoming",
    badge: "STARTING SOON",
  },
  {
    id: 3,
    title: "Online Community Feedback",
    image:
      "https://res.cloudinary.com/jvpygp4b/image/upload/v1783157047/news4_u9saum.jpg",
    date: "Oct 28, 9:00 PM",
    type: "upcoming",
  },
  {
    id: 4,
    title: "Winter Scrims 2023",
    image:
      "https://res.cloudinary.com/jvpygp4b/image/upload/v1783157148/summit_rsjhhe.jpg",
    date: "December 15, 2023",
    type: "past",
    badge: "COMPLETED",
  },
];

const tabs = ["All", "Upcoming Events", "Past Events"];

export default function UpcomingComEvents() {
  const [activeTab, setActiveTab] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    phone: "",
    email: "",
    website: "",
  });

  const filteredEvents =
    activeTab === "All"
      ? events
      : events.filter((event) =>
          activeTab === "Upcoming Events"
            ? event.type === "upcoming"
            : event.type === "past",
        );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Event Registration Data:", formData, "Event:", selectedEvent);
    setFormData({
      name: "",
      companyName: "",
      phone: "",
      email: "",
      website: "",
    });
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const openEventModal = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  return (
    <section className="relative overflow-hidden bg-zinc-950 py-20 px-4 sm:px-6">
      {/* Background Glow */}
      <div className="absolute left-0 top-0 h-[400px] w-[400px] rounded-full bg-purple-600/10 blur-[170px]" />
      <div className="absolute right-0 bottom-0 h-[400px] w-[400px] rounded-full bg-pink-600/10 blur-[180px]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight">
            {/* Upcoming{" "} */}
            COMMUNITY{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
              EVENTS
            </span>
          </h2>

          <p className="mt-4 text-zinc-300">
            Don't miss out on the action. Join our upcoming tournaments and
            community nights.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-10 flex justify-center gap-8 mb-14"
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative pb-3 text-xs uppercase tracking-widest transition cursor-pointer ${
                activeTab === tab
                  ? "text-purple-300"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {tab}

              {activeTab === tab && (
                <span className="absolute inset-x-0 -bottom-1 h-1 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 shadow-[0_0_20px_rgba(236,72,153,0.45)]" />
              )}
            </button>
          ))}
        </motion.div>

        {/* Cards */}
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {filteredEvents.map((event, idx) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              whileHover={{ y: -8 }}
              className="group rounded-2xl border border-white/10 bg-zinc-900/50 p-4 transition-all duration-300 hover:border-purple-500/30 hover:shadow-[0_0_35px_rgba(168,85,247,.2)] backdrop-blur-sm"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden rounded-xl">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-110"
                />

                {event.badge && (
                  <div
                    className={`absolute right-3 top-3 rounded-full px-3 py-1 text-[10px] font-semibold tracking-wider text-white ${
                      event.badge === "UPCOMING"
                        ? "bg-purple-600"
                        : event.badge === "STARTING SOON"
                          ? "bg-pink-500"
                          : "bg-zinc-600"
                    }`}
                  >
                    {event.badge}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="mt-5">
                <h3 className="text-xl font-semibold text-white">
                  {event.title}
                </h3>

                <div className="mt-3 flex items-center gap-2 text-sm text-zinc-300">
                  <Calendar size={14} />
                  {event.date}
                </div>

                <button
                  onClick={() => openEventModal(event)}
                  className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-500 rounded-full text-white font-semibold text-xs uppercase tracking-wider transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50 group/link cursor-pointer"
                >
                  Join Event
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Discord Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 flex justify-center"
        >
          <a
            href="https://discord.gg/StTgqPMERz"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-8 py-4 font-semibold text-white shadow-[0_0_30px_rgba(79,70,229,0.45)] transition hover:opacity-90"
          >
            Join Discord
            <MessageSquare size={18} />
          </a>
        </motion.div>
      </div>

      {/* Event Registration Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-black border border-purple-500/30 rounded-3xl shadow-2xl shadow-purple-500/20 max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="relative bg-gradient-to-r from-purple-600/20 to-pink-600/20 px-4 sm:px-6 md:px-8 py-5 sm:py-6 border-b border-purple-500/20">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 leading-tight">
                      Join Event
                    </h2>
                    {selectedEvent && (
                      <p className="text-xs sm:text-sm text-zinc-400 mt-1 line-clamp-2">
                        {selectedEvent.title}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-1 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
                  >
                    <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </button>
                </div>
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6 space-y-3 sm:space-y-4"
              >
                {/* Name */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-zinc-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  />
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-zinc-300 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder="Enter company name"
                    required
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-zinc-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    required
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-zinc-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                    required
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  />
                </div>

                {/* Website */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-zinc-300 mb-2">
                    Website URL
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://example.com"
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full mt-4 sm:mt-6 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/50"
                >
                  Register for Event
                </motion.button>

                {/* Cancel Button */}
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full px-4 sm:px-6 py-2 sm:py-2.5 bg-zinc-800/50 border border-zinc-700 text-zinc-300 text-xs sm:text-sm font-semibold rounded-lg hover:bg-zinc-800 transition-all"
                >
                  Cancel
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
