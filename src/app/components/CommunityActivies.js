"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Swal from "sweetalert2";

export default function CommunityActivies() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const scrollContainerRef = useRef(null);
  const autoScrollIntervalRef = useRef(null);
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

  const partners = [
    {
      title: "MIME GO: The Future of Entertainment",
      description:
        "Experience the next generation of streaming, calling, and savings. Everything you need for your digital lifestyle in one powerful app. Join the MIME community and revolutionize your internet experience.",
      badge: "EXCLUSIVE LAUNCH",
      buttons: ["CORPORATE PARTNERSHIP", "ESPORTS COMMUNITY PARTNERSHIP"],
      image:
        "https://res.cloudinary.com/jvpygp4b/image/upload/v1783147172/mime2_hhp4nf.jpg",
      bgGradient: "from-blue-600/20 via-purple-600/20 to-cyan-600/20",
    },
    {
      title: "MOAR: Next Level Gaming",
      description:
        "Join a revolutionary platform designed for gamers and esports enthusiasts. Compete, earn rewards, and connect with the global gaming community. Discover exclusive partnerships and opportunities.",
      badge: "FEATURED PARTNER",
      buttons: ["GAMING PARTNERSHIP", "TOURNAMENT OPPORTUNITIES"],
      image:
        "https://res.cloudinary.com/jvpygp4b/image/upload/v1783147168/MOAR_hkr10h.png",
      bgGradient: "from-pink-600/20 via-purple-600/20 to-blue-600/20",
    },
    {
      title: "iFarmer: Connecting Communities",
      description:
        "Building bridges between technology and agriculture. Experience innovative solutions that empower businesses and communities. Join us in creating sustainable growth through digital transformation.",
      badge: "INNOVATION PARTNER",
      buttons: ["COMMUNITY PARTNERSHIP", "DIGITAL SOLUTIONS"],
      image:
        "https://res.cloudinary.com/jvpygp4b/image/upload/v1783147170/ifarmer2_utju6u.jpg",
      bgGradient: "from-green-600/20 via-emerald-600/20 to-cyan-600/20",
    },
  ];

  const updates = [
    {
      title:
        "Inception Games at Startup Showcase Event - Connecting with aspiring entrepreneurs and gamers",
      description: "",
      category: "UPDATES",
      image:
        "https://res.cloudinary.com/jvpygp4b/image/upload/v1783157043/news3_freort.jpg",
    },
    {
      title:
        "Dedicating to my Core Teammates & gamers ❤️. Tournament sign up going on at our website. Don't forget to sign up. Slice N Share at Airtel Buzz Presents Bangladesh Gaming & Esports Summit 2025 ",
      description: "",
      category: "UPDATES",
      image:
        "https://res.cloudinary.com/jvpygp4b/image/upload/v1783157047/news4_u9saum.jpg",
    },
    {
      title:
        "Inception Games at Startup Showcase Event - Connecting with aspiring entrepreneurs and gamers",
      description: "",
      category: "UPDATES",
      image:
        "https://res.cloudinary.com/jvpygp4b/image/upload/v1783157035/showcase_eh4z5f.jpg",
    },
    {
      title:
        "YUNet Bangladesh Gaming & Esports Summit 2025 - Sign Up going on. Follow YUNet Esport Arena",
      description: "",
      category: "UPDATES",
      image:
        "https://res.cloudinary.com/jvpygp4b/image/upload/v1783157148/summit_rsjhhe.jpg",
    },
  ];

  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % partners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [autoPlay, partners.length]);

  // Auto-scroll functionality for updates carousel
  useEffect(() => {
    if (!isDragging && updates.length > 0 && scrollContainerRef.current) {
      autoScrollIntervalRef.current = setInterval(() => {
        setScrollPosition((prev) => {
          const newPosition = prev + 1.5;
          const maxScroll = scrollContainerRef.current?.scrollWidth / 2 || 0;
          return newPosition >= maxScroll ? 0 : newPosition;
        });
      }, 50);
    }

    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }
    };
  }, [isDragging, updates.length]);

  // Update scroll container position
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.transform = `translateX(-${scrollPosition}px)`;
    }
  }, [scrollPosition]);

  // Touch/Mouse handlers for dragging
  const handleDragStart = (e) => {
    setIsDragging(true);
    const clientX = e.type && e.type.startsWith("touch") ? e.touches?.[0]?.clientX : e.clientX;
    setDragStart(clientX || 0);
  };

  const handleDragMove = (e) => {
    if (!isDragging || !scrollContainerRef.current) return;

    const currentX = e.type && e.type.startsWith("touch") ? e.touches?.[0]?.clientX : e.clientX;
    const diff = dragStart - (currentX || 0);

    setScrollPosition((prev) => {
      const newPosition = prev + diff;
      const maxScroll = scrollContainerRef.current?.scrollWidth / 2 || 0;
      
      if (newPosition < 0) return 0;
      if (newPosition >= maxScroll) return maxScroll;
      
      return newPosition;
    });

    setDragStart(currentX || 0);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const goToSlide = (index) => {
    setActiveSlide(index);
    setAutoPlay(false);
  };

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % partners.length);
    setAutoPlay(false);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + partners.length) % partners.length);
    setAutoPlay(false);
  };

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
        "https://inception-games.an.r.appspot.com/api/v1/contact/community/apply",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit application");
      }

      Swal.fire({
        icon: "success",
        title: "Application Submitted!",
        text: "Thank you for your community interest. We'll review your application soon.",
        background: "#1a1a2e",
        color: "#fff",
        confirmButtonColor: "#ec4899",
      });

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
        text:
          error.message ||
          "An error occurred while submitting your application.",
        background: "#1a1a2e",
        color: "#fff",
        confirmButtonColor: "#ec4899",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      className="py-20 px-4 sm:px-6"
      style={{ backgroundColor: "#0a0a14" }}
    >
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
            COMMUNITY{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
              ACTIVITIES
            </span>
          </h2>
          {/* Underline accent */}
          <div className="flex justify-center gap-2 mt-4">
            <div className="w-50 h-1.5 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full" />
          </div>
        </motion.div>

        {/* Slider Container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative mb-15"
        >
          {/* Left Side Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            onClick={() => setIsModalOpen(true)}
            className="absolute left-0 -bottom-5 z-20 px-6 py-2.5 sm:px-8 sm:py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold uppercase text-xs sm:text-sm tracking-widest rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/50"
          >
            APPLY FOR COMMUNITY
          </motion.button>
          {/* Slides */}
          <div className="relative overflow-hidden">
            {partners.map((partner, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: activeSlide === idx ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className={`rounded-3xl overflow-hidden border border-zinc-700/50 ${
                  activeSlide === idx ? "block" : "hidden"
                }`}
              >
                {/* Background */}
                <div
                  className={`relative bg-gradient-to-r ${partner.bgGradient} backdrop-blur-xl h-[500px] sm:h-[600px]`}
                  style={{
                    backgroundImage: `url('${partner.image}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "right center",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  {/* Dark Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />

                  {/* Content - positioned at bottom left */}
                  <div className="absolute bottom-0 left-0 px-6 sm:px-12 py-16 sm:py-20 md:py-28 max-w-2xl">
                    {/* Badge */}
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="inline-block mb-6"
                    >
                      <span className="px-4 py-1.5 bg-purple-500/30 text-purple-300 border border-purple-500/50 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                        {partner.badge}
                      </span>
                    </motion.div>

                    {/* Title */}
                    <motion.h3
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 leading-tight"
                    >
                      {partner.title}
                    </motion.h3>

                    {/* Description */}
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-base sm:text-lg text-zinc-300 mb-8 leading-relaxed max-w-xl"
                    >
                      {partner.description}
                    </motion.p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center items-center gap-2 mt-8">
            {partners.map((_, idx) => (
              <motion.button
                key={idx}
                onClick={() => goToSlide(idx)}
                animate={{
                  width: activeSlide === idx ? 32 : 12,
                  backgroundColor:
                    activeSlide === idx
                      ? "rgb(236, 72, 153)"
                      : "rgb(255, 255, 255)",
                }}
                transition={{ duration: 0.3 }}
                className="h-2.5 rounded-full transition-all"
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </motion.div>

        {/* Updates Carousel Section */}
        <div>
          {/* Carousel Container */}
          <div className="relative overflow-hidden">
            {/* Gradient overlays for smooth fade effect */}
            <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#0a0a14] to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#0a0a14] to-transparent z-10"></div>

            {/* Auto-scrolling container */}
            <div
              ref={scrollContainerRef}
              className="flex gap-4 sm:gap-6 cursor-grab active:cursor-grabbing transition-transform select-none"
              style={{
                transition: isDragging ? "none" : "transform 0.3s ease-out",
                touchAction: "pan-y pinch-zoom",
              }}
              onMouseDown={handleDragStart}
              onMouseMove={handleDragMove}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
              onTouchStart={handleDragStart}
              onTouchMove={handleDragMove}
              onTouchEnd={handleDragEnd}
            >
              {/* First set of cards */}
              {updates.map((update, index) => (
                <div
                  key={`update-1-${index}`}
                  className="flex-shrink-0 w-56 sm:w-64 md:w-72 group cursor-pointer"
                >
                  {/* Card */}
                  <div className="rounded-xl sm:rounded-2xl overflow-hidden bg-zinc-900/50 border border-zinc-800/50 hover:border-zinc-700/50 transition-all duration-300 h-full flex flex-col backdrop-blur-sm hover:shadow-2xl hover:shadow-purple-500/10">
                    {/* Image Section */}
                    <div
                      className="relative h-40 sm:h-48 overflow-hidden bg-gradient-to-br from-slate-700 to-slate-900 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                      style={{
                        backgroundImage: `url('${update.image}')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

                      {/* Category Badge */}
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-pink-500/30 text-pink-300 border border-pink-500/50 backdrop-blur-sm">
                        {update.category}
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-4 sm:p-5 flex-grow flex flex-col justify-between">
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-white mb-2 leading-tight group-hover:text-purple-300 transition-colors duration-300 line-clamp-3">
                          {update.title}
                        </h3>
                        {/* <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed line-clamp-2">
                          {update.description}
                        </p> */}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Duplicate set for seamless loop */}
              {updates.map((update, index) => (
                <div
                  key={`update-2-${index}`}
                  className="flex-shrink-0 w-56 sm:w-64 md:w-72 group cursor-pointer"
                >
                  {/* Card */}
                  <div className="rounded-xl sm:rounded-2xl overflow-hidden bg-zinc-900/50 border border-zinc-800/50 hover:border-zinc-700/50 transition-all duration-300 h-full flex flex-col backdrop-blur-sm hover:shadow-2xl hover:shadow-purple-500/10">
                    {/* Image Section */}
                    <div
                      className="relative h-40 sm:h-48 overflow-hidden bg-gradient-to-br from-slate-700 to-slate-900 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                      style={{
                        backgroundImage: `url('${update.image}')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

                      {/* Category Badge */}
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-pink-500/30 text-pink-300 border border-pink-500/50 backdrop-blur-sm">
                        {update.category}
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-4 sm:p-5 flex-grow flex flex-col justify-between">
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-white mb-2 leading-tight group-hover:text-purple-300 transition-colors duration-300 line-clamp-2">
                          {update.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed line-clamp-2">
                          {update.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Partnership Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-black border border-purple-500/30 rounded-3xl shadow-2xl shadow-purple-500/20 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden"
              >
                {/* Header */}
                <div className="relative bg-gradient-to-r from-purple-600/20 to-pink-600/20 px-6 sm:px-8 py-6 border-b border-purple-500/20 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                      Community Application
                    </h2>

                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <X className="w-6 h-6 text-white" />
                    </button>
                  </div>
                </div>

                {/* Form */}
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col flex-1 min-h-0"
                >
                  {/* Scrollable Content */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-8 space-y-4">
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
                          WhatsApp Number{" "}
                          <span className="text-pink-500">*</span>
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

                    {/* Website URL */}
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

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-semibold text-zinc-300 mb-2">
                        Message
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Tell us about your partnership proposal or any additional details..."
                        rows={4}
                        className="w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none"
                      />
                    </div>
                  </div>

                  {/* Fixed Footer Buttons */}
                  <div className="flex-shrink-0 p-6 border-t border-purple-500/20 bg-zinc-900/95 backdrop-blur-sm">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isLoading}
                      className="w-full mb-3 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold uppercase tracking-wider rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/50 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                    >
                      {isLoading ? "Submitting..." : "Submit Application"}
                    </motion.button>

                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      disabled={isLoading}
                      className="w-full px-6 py-2.5 bg-zinc-800/50 border border-zinc-700 text-zinc-300 font-semibold rounded-lg hover:bg-zinc-800 transition-all disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
