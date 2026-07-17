"use client";

import { useState } from "react";
import Image from "next/image";
import { Calendar, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";

const events = [
  {
    id: 1,
    title:
      "Inception Games at Startup Showcase Event - Connecting with aspiring entrepreneurs and gamers",
    image:
      "https://res.cloudinary.com/jvpygp4b/image/upload/v1783157035/showcase_eh4z5f.jpg",
    date: "November 14",
    type: "upcoming",
    badge: "UPCOMING",
  },
  {
    id: 2,
    title:
      "Digital Entrepreneurship and Innovation Ecosystem Development (DEIED) Project Office has organized a Dialogue Session to introduce the Startup and Scaleup Program (Accelerating Bangladesh) and the University Innovation Hub Program to senior public-sector leadership.",
    image:
      "https://res.cloudinary.com/jvpygp4b/image/upload/v1783157043/news3_freort.jpg",
    date: "December 10",
    type: "upcoming",
    badge: "STARTING SOON",
  },
  {
    id: 3,
    title:
      "Dedicating to my Core Teammates & gamers ❤️. Tournament sign up going on at our website. Don't forget to sign up. Slice N Share at Airtel Buzz Presents Bangladesh Gaming & Esports Summit 2025 Online Community Feedback",
    image:
      "https://res.cloudinary.com/jvpygp4b/image/upload/v1783157047/news4_u9saum.jpg",
    date: "December 10",
    type: "upcoming",
    badge: "UPCOMING",
  },
  {
    id: 4,
    title:
      "YUNet Bangladesh Gaming & Esports Summit 2025 - Sign Up going on. Follow YUNet Esport Arena",
    image:
      "https://res.cloudinary.com/jvpygp4b/image/upload/v1783157148/summit_rsjhhe.jpg",
    date: "December 07",
    type: "past",
    badge: "COMPLETED",
  },
];

const tabs = ["All", "Upcoming Events", "Past Events"];

export default function UpcomingComEvents() {
  const [activeTab, setActiveTab] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    whatsapp: "",
    city: "",
    fb_page_link: "",
    youtube_link: "",
    website_url: "",
    message: "",
  });

  const filteredEvents =
    activeTab === "All"
      ? events
      : events.filter((event) =>
          activeTab === "Upcoming Events"
            ? event.type === "upcoming"
            : event.type === "past"
        );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.full_name ||
      !formData.email ||
      !formData.whatsapp ||
      !formData.city
    ) {
      Swal.fire({
        icon: "error",
        title: "Missing Fields",
        text: "Please fill in all required fields",
        background: "#1a1a2e",
        color: "#fff",
        confirmButtonColor: "#ec4899",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        "https://inception-games.an.r.appspot.com/api/v1/contact/joint-event/apply",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit application");
      }

      Swal.fire({
        icon: "success",
        title: "Application Submitted!",
        text: "Thank you for your partnership interest. We'll review your application soon.",
        background: "#1a1a2e",
        color: "#fff",
        confirmButtonColor: "#ec4899",
      });
      
      // Reset form and close modal
      setFormData({
        full_name: "",
        email: "",
        whatsapp: "",
        city: "",
        fb_page_link: "",
        youtube_link: "",
        website_url: "",
        message: "",
      });
      setIsModalOpen(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: error.message || "An error occurred while submitting your application.",
        background: "#1a1a2e",
        color: "#fff",
        confirmButtonColor: "#ec4899",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openEventModal = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  return (
    <section
      id="upcoming-events"
      className="relative overflow-hidden bg-zinc-950 py-20 px-4 sm:px-6"
    >
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
          className="mt-10 flex justify-center gap-8 mb-14 flex-wrap"
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
                <h3 className="text-xl font-semibold text-white line-clamp-3">
                  {event.title}
                </h3>

                <div className="mt-3 flex items-center gap-2 text-sm text-zinc-300">
                  <Calendar size={14} />
                  {event.date}
                </div>

                <button
                  onClick={() => openEventModal(event)}
                  className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-500 rounded-full text-white font-semibold text-xs uppercase tracking-wider transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50 cursor-pointer"
                >
                  Join Event
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Event Registration Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              // Only close if clicking the backdrop
              if (e.target === e.currentTarget) {
                setIsModalOpen(false);
              }
            }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-black border border-purple-500/30 rounded-3xl shadow-2xl shadow-purple-500/20 max-w-2xl w-full overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="relative bg-gradient-to-r from-purple-600/20 to-pink-600/20 px-6 sm:px-8 py-6 border-b border-purple-500/20 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
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
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4 overflow-y-auto flex-1">
                {/* Row 1: Full Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-zinc-300 mb-2">
                      Full Name <span className="text-pink-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      required
                      className="w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-zinc-300 mb-2">
                      Email Address <span className="text-pink-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter email address"
                      required
                      className="w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                    />
                  </div>
                </div>

                {/* Row 2: WhatsApp & City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-zinc-300 mb-2">
                      WhatsApp Number <span className="text-pink-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleInputChange}
                      placeholder="+1234567890"
                      required
                      className="w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-zinc-300 mb-2">
                      City <span className="text-pink-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Enter your city"
                      required
                      className="w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                    />
                  </div>
                </div>

                {/* Row 3: Facebook & YouTube */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-zinc-300 mb-2">
                      Facebook Page Link
                    </label>
                    <input
                      type="url"
                      name="fb_page_link"
                      value={formData.fb_page_link}
                      onChange={handleInputChange}
                      placeholder="https://facebook.com/your-page"
                      className="w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-zinc-300 mb-2">
                      YouTube Link
                    </label>
                    <input
                      type="url"
                      name="youtube_link"
                      value={formData.youtube_link}
                      onChange={handleInputChange}
                      placeholder="https://youtube.com/c/your-channel"
                      className="w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                    />
                  </div>
                </div>

                {/* Row 4: Website URL (Full Width) */}
                <div>
                  <label className="block text-sm font-semibold text-zinc-300 mb-2">
                    Website URL
                  </label>
                  <input
                    type="url"
                    name="website_url"
                    value={formData.website_url}
                    onChange={handleInputChange}
                    placeholder="https://example.com"
                    className="w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  />
                </div>

                {/* Row 5: Message (Full Width) */}
                <div>
                  <label className="block text-sm font-semibold text-zinc-300 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us why you're interested in this event..."
                    rows="4"
                    className="w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none"
                  />
                </div>

                {/* Buttons */}
                <div className="space-y-3 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className="w-full px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold uppercase tracking-wider rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Submitting..." : "Submit Application"}
                  </motion.button>

                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    disabled={isLoading}
                    className="w-full px-6 py-2.5 bg-zinc-800/50 border border-zinc-700 text-zinc-300 font-semibold rounded-lg hover:bg-zinc-800 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}