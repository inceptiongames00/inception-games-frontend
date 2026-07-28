"use client";

import React, { useState, useEffect, useRef, useContext } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import {
  Trophy,
  Calendar,
  Flag,
  Users,
  User,
  CheckCircle2,
  ArrowLeft,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  Loader2,
  Shield,
  ArrowRight,
  Monitor,
  Smartphone,
  Gamepad2,
} from "lucide-react";
import Image from "next/image";
import Footer from "@/app/components/Footer";
import EventShareCard from "@/app/components/EventShareCard";
import SharePreview from "@/app/components/SharePreview";
import AnimatedInput from "@/app/components/EventComponents/AnimatedInput";
import { AuthContext } from "@/app/context/AuthContext";
import { useEventRegistration } from "@/app/hooks/useEventRegistration.js";
import { getTokens } from "@/lib/api";
import { updateMetaTags } from "@/app/utils/metaTags";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useContext(AuthContext) || {};
  const [event, setEvent] = useState(null);
  const [actionSource, setActionSource] = useState("view"); // 'view', 'join', 'not-applicable'
  const [activeTab, setActiveTab] = useState("result");
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [otpStep, setOtpStep] = useState(null);
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState("");
  const otpInputRefs = useRef([]);

  const {
    isSubmitting,
    notification,
    showSuccessModal,
    setShowSuccessModal,
    showNotificationMessage,
    handleRegistrationSubmit,
  } = useEventRegistration(event);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    inGameName: "",
    inGameId: "",
    teamName: "",
    discordId: "",
    socialMedia: "",
    portfolio: "",
    teamMembers: "",
    brandDealType: "solo",
    selectedSlotId: "",
    slotDate: "",
    slotTime: "",
    players: [],
  });

  useEffect(() => {
    const storedEvents = localStorage.getItem("free-event");

    if (storedEvents) {
      const events = JSON.parse(storedEvents);

      const matchedEvent = events.find(
        (event) => event.id === parseInt(params.eventId),
      );

      if (matchedEvent) {
        setEvent(matchedEvent);
      }
    }
  }, [params.eventId]);

  // Get action from URL query parameters
  useEffect(() => {
    const action = searchParams?.get("action") || "view";
    setActionSource(action);
  }, [searchParams]);

  // Calculate eligibility
  const userPrimaryGame = user?.primaryGame || user?.primary_game;
  const eventGameName = event?.game_name || event?.game?.name || event?.game;
  const isEligible =
    userPrimaryGame &&
    eventGameName &&
    userPrimaryGame.toLowerCase().trim() === eventGameName.toLowerCase().trim();

  useEffect(() => {
    if ((showSignupForm || showRegistrationModal) && user) {
      // Calculate the number of team members based on game
      let teamMembersCount = 0;
      if (event?.game_mode !== "Solo") {
        const gameName = (
          event?.game?.name ||
          event?.game_name ||
          ""
        ).toLowerCase();

        // Define team sizes based on game
        let gameTeamSize = 1;
        if (gameName.includes("pubg")) {
          gameTeamSize = 5; // PUBG: 5 players
        } else if (
          gameName.includes("freefire") ||
          gameName.includes("free fire")
        ) {
          gameTeamSize = 4; // Free Fire: 4 players
        } else {
          // Use API team_size or default to 1
          gameTeamSize = event?.team_size || event?.teamSize || 1;
        }

        teamMembersCount = Math.max(0, gameTeamSize - 1);
      }

      // Initialize players array
      const players = Array.from({ length: teamMembersCount }, () => ({
        fullName: "",
        email: "",
        phone: "",
        uid: "",
        discordId: "",
      }));

      setFormData((prev) => ({
        ...prev,
        fullName: user.fullName || user.name || "",
        inGameName: user.fullName || user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        players: players,
      }));
    }
  }, [showSignupForm, showRegistrationModal, user, event]);

  useEffect(() => {
    const facebookAppId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
    if (
      facebookAppId &&
      facebookAppId !== "1234567890" &&
      facebookAppId.length > 10
    ) {
      window.fbAsyncInit = function () {
        FB.init({ appId: facebookAppId, xfbml: true, version: "v18.0" });
      };
      if (!window.FB) {
        const script = document.createElement("script");
        script.src =
          "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
      }
    }
  }, []);

  useEffect(() => {
    if (event) updateMetaTags(event);
  }, [event]);

  const isSoloMode =
    (event?.game_mode || event?.teamType || "").toLowerCase() === "solo";
  const additionalPlayersCount = isSoloMode
    ? 0
    : Math.max(0, (event?.team_size || event?.teamSize || 1) - 1);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlayerChange = (index, field, value) => {
    setFormData((prev) => {
      const players = [...prev.players];
      players[index] = { ...players[index], [field]: value };
      return { ...prev, players };
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await handleRegistrationSubmit(formData);
    if (isSubmitting === false) {
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        inGameName: "",
        inGameId: "",
        teamName: "",
        discordId: "",
        socialMedia: "",
        portfolio: "",
        teamMembers: "",
        brandDealType: "solo",
        selectedSlotId: "",
        players: [],
      });
    }
  };

  const handleOtpVerify = async () => {
    if (otpValue.length < 4) return;
    setOtpStep("verifying");
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setOtpStep("success");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    showNotificationMessage("success", "Registration successful!");
    setOtpStep(null);
    setShowSignupForm(false);
    setOtpValue("");
  };

  const handleResendOtp = () => {
    setOtpError("OTP resent successfully!");
    setTimeout(() => setOtpError(""), 3000);
  };

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#030305] to-black text-white">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader2 className="animate-spin mx-auto mb-4" size={48} />
            <p>Loading event details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const gameImage =
    event.banner_image ||
    event.game?.image ||
    event.gameImage ||
    "/images/default-game.jpg";
  const gameName = event.game?.name || event.gameName || "Unknown Game";

  // Helper function to calculate days between two dates
  const calculateDaysBetween = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = end - start;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return Math.max(0, diffDays);
    } catch {
      return 0;
    }
  };

  // Calculate registration window days
  const registrationDays = calculateDaysBetween(
    event?.registration_start,
    event?.registration_end,
  );

  const tabs = [
    { id: "rules", label: "Rules" },
    { id: "brackets", label: "Brackets" },
    { id: "schedule", label: "Schedule" },
    { id: "participants", label: "Participants" },
    { id: "result", label: "Result" },
    { id: "support", label: "Contact Support" },
  ];

  const progressionSteps = [
    {
      label: "Reg Starting",
      date: event?.reg_start_at ? new Date(event.reg_start_at) : new Date(),
      time: event?.reg_start_at
        ? new Date(event.reg_start_at).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })
        : "TBA",
    },
    {
      label: "Reg Ending",
      date: event?.reg_end_at ? new Date(event.reg_end_at) : new Date(),
      time: event?.reg_end_at
        ? new Date(event.reg_end_at).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })
        : "TBA",
    },
    {
      label: "Match Starts",
      date: event?.start_at ? new Date(event.start_at) : new Date(),
      time: event?.start_at
        ? new Date(event.start_at).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })
        : "TBA",
    },
    {
      label: "Match Ends",
      date: event?.end_at ? new Date(event.end_at) : new Date(),
      time: event?.end_at
        ? new Date(event.end_at).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })
        : "TBA",
    },
  ];

  return (
    <div className="min-h-screen bg-[#030305]">
      <EventShareCard event={event} forceRender={true} />

      <main className="pt-20">
        {/* Notification */}
        <AnimatePresence>
          {notification.show && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50"
            >
              <div
                className={`px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 ${
                  notification.type === "success"
                    ? "bg-gradient-to-r from-green-500 to-emerald-600"
                    : "bg-gradient-to-r from-red-500 to-pink-600"
                }`}
              >
                {notification.type === "success" ? (
                  <CheckCircle size={20} />
                ) : (
                  <AlertCircle size={20} />
                )}
                <p className="font-semibold text-sm text-white">
                  {notification.message}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Back Button */}
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft size={20} />
            <span>Back to Events</span>
          </button>
        </div>

        <div className="max-w-7xl mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Banner */}
              <div className="relative h-64 md:h-80 lg:h-[450px] rounded-2xl overflow-hidden mb-6">
                <Image
                  src={gameImage}
                  alt={gameName}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-black/50 to-transparent" />

                {/* Overlay Content - Title and Status */}
                <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6">
                  {/* Top Section - Status Badge */}
                  <div className="flex justify-end">
                    <div
                      className={`px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold backdrop-blur-sm ${
                        event.status === "Upcoming"
                          ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-300"
                          : event.status === "Ongoing"
                            ? "bg-blue-500/20 border border-blue-500/30 text-blue-300"
                            : "bg-gray-500/20 border border-gray-500/30 text-gray-300"
                      }`}
                    >
                      {event.status === "Upcoming"
                        ? "Registration Open"
                        : event.status === "Ongoing"
                          ? "In Progress"
                          : "Completed"}
                    </div>
                  </div>

                  {/* Bottom Section - Title and Badges */}
                  <div className="flex flex-col justify-end gap-3 sm:gap-4">
                    {/* Date and Status Line */}
                    <div className="flex items-center gap-2 text-sm sm:text-base text-gray-300">
                      <span
                        className={`font-semibold ${
                          event.status === "Upcoming"
                            ? "text-emerald-400"
                            : event.status === "Ongoing"
                              ? "text-blue-400"
                              : "text-gray-400"
                        }`}
                      >
                        {event.status === "Upcoming"
                          ? "Registration Open"
                          : event.status === "Ongoing"
                            ? "In Progress"
                            : "Completed"}
                      </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
                      {event.title}
                    </h1>

                    {/* Info Badges */}
                    <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                      {/* Location Badge */}
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
                        <Flag size={14} className="text-purple-400" />
                        <span className="text-xs sm:text-sm font-medium text-gray-200">
                          {event.location || "Global"}
                        </span>
                      </div>

                      {/* Platform Badge */}
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
                        {event.platform?.toLowerCase().includes("mobile") ? (
                          <Smartphone size={14} className="text-pink-400" />
                        ) : event.platform
                            ?.toLowerCase()
                            .includes("console") ? (
                          <Gamepad2 size={14} className="text-orange-400" />
                        ) : (
                          <Monitor size={14} className="text-blue-400" />
                        )}
                        <span className="text-xs sm:text-sm font-medium text-gray-200">
                          {event.platform || "All Platforms"}
                        </span>
                      </div>

                      {/* Team Type Badge */}
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
                        {(event.game_mode || "").toLowerCase() === "solo" ? (
                          <User size={14} className="text-yellow-400" />
                        ) : (
                          <Users size={14} className="text-cyan-400" />
                        )}
                        <span className="text-xs sm:text-sm font-medium text-gray-200">
                          {event.game_mode || "Team"}
                        </span>
                      </div>
                    </div>

                    {/* Game + Actions Row - Moved Inside Banner Overlay */}
                    <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4 mt-4 sm:mt-6">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-lg sm:rounded-xl overflow-hidden bg-gray-800 flex-shrink-0">
                          <Image
                            src={gameImage}
                            alt={gameName}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-white font-semibold text-sm sm:text-lg">
                          {event.game}
                        </span>
                        <Trophy size={16} />
                        <span>Hosted by {event.host}</span>
                        <span>·</span>
                        <span
                          className={`font-semibold ${
                            event.status === "Upcoming"
                              ? "text-emerald-400"
                              : event.status === "Ongoing"
                                ? "text-blue-400"
                                : "text-gray-400"
                          }`}
                        >
                          {event.status === "Upcoming"
                            ? "Upcoming"
                            : event.status === "Ongoing"
                              ? "Ongoing"
                              : "Completed"}
                        </span>
                      </div>
                      {/* <div className="flex items-center gap-2 text-sm text-gray-400 mb-6 mt-2">
                <Trophy size={16} />
                <span>Hosted by {event.host}</span>
                <span>·</span>
                <span className={`font-semibold ${
                  event.status === "Upcoming"
                    ? "text-emerald-400"
                    : event.status === "Ongoing"
                    ? "text-blue-400"
                    : "text-gray-400"
                }`}>
                  {event.status === "Upcoming"
                    ? "Upcoming"
                    : event.status === "Ongoing"
                    ? "Ongoing"
                    : "Completed"}
                </span>
              </div> */}

                      <div className="flex items-center gap-1 sm:gap-2">
                        {/* <SharePreview event={event} /> */}

                        {event.status !== "Completed" &&
                          !showSignupForm &&
                          isEligible &&
                          actionSource === "join" && (
                            <motion.button
                              onClick={() => setShowRegistrationModal(true)}
                              className="px-2 sm:px-4 py-2 sm:py-2.5 font-bold rounded-lg transition-all duration-300 flex items-center gap-1 sm:gap-2 shadow-lg text-xs sm:text-sm cursor-pointer bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-purple-500/20"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Users size={14} className="hidden sm:inline" />
                              <Users size={12} className="sm:hidden" />
                              <span>Join Event</span>
                            </motion.button>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tournament Progression */}
              {/* <div className="mb-6 sm:mb-8">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">
                  Tournament Progression
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
                  {progressionSteps.map((step, index) => {
                    const stepDate = new Date(step.date);
                    const isCompleted = new Date() > stepDate;
                    const isCurrent = index === 2 && event.status === "Ongoing";

                    return (
                      <div
                        key={index}
                        className={`p-2 sm:p-4 rounded-lg sm:rounded-xl border ${
                          isCurrent
                            ? "bg-purple-500/10 border-purple-500/30"
                            : isCompleted
                              ? "bg-gray-800/50 border-gray-700/50"
                              : "bg-gray-800/30 border-gray-700/30"
                        }`}
                      >
                        <div className="flex justify-center mb-2 sm:mb-3">
                          <CheckCircle2
                            size={20}
                            className={`sm:w-6 sm:h-6 ${
                              isCompleted ? "text-emerald-400" : "text-gray-600"
                            }`}
                          />
                        </div>
                        <p className="text-xs sm:text-sm font-semibold text-white text-center mb-1 sm:mb-2 leading-tight">
                          {step.label}
                        </p>
                        <div className="flex items-center justify-center gap-1 text-xs text-gray-300 font-medium">
                          <Calendar size={10} className="sm:w-3 sm:h-3" />
                          <span className="text-xs">
                            {new Date(step.date).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center justify-center gap-1 text-xs text-gray-400 mt-1">
                          <Clock size={10} className="sm:w-3 sm:h-3" />
                          <span className="text-xs">
                            {step.time || formatTime(step.date)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div> */}

              <div className="mb-6 sm:mb-8">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">
                  Tournament Progression
                </h3>

                {/* Notice Section */}
                <div className="mb-8 p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 mt-4">
                  <p className="text-sm text-blue-300 flex items-center gap-2">
                    <span className="text-lg">ℹ️</span>
                    <span>
                      <span className="font-semibold">Note:</span> You have to
                      create an account to join the event.
                    </span>
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
                  {progressionSteps.map((step, index) => {
                    return (
                      <div
                        key={index}
                        className="p-2 sm:p-4 rounded-lg sm:rounded-xl border bg-gray-800/30 border-gray-700/30"
                      >
                        <div className="flex justify-center mb-2 sm:mb-3">
                          <CheckCircle2
                            size={20}
                            className="sm:w-6 sm:h-6 text-gray-600"
                          />
                        </div>
                        <p className="text-xs sm:text-sm font-semibold text-white text-center mb-1 sm:mb-2 leading-tight">
                          {step.label}
                        </p>
                        <div className="flex items-center justify-center gap-1 text-xs text-gray-300 font-medium">
                          <Calendar size={10} className="sm:w-3 sm:h-3" />
                          <span className="text-xs">
                            {step.date
                              ? new Date(step.date).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                  },
                                )
                              : "TBA"}
                          </span>
                        </div>
                        <div className="flex items-center justify-center gap-1 text-xs text-gray-400 mt-1">
                          <Clock size={10} className="sm:w-3 sm:h-3" />
                          <span className="text-xs">{step.time || "TBA"}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Description and Sidebar Section - 2 columns + 1 column layout */}
              <div className="lg:col-span-3">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Description Section - 2 columns */}
                  <div className="lg:col-span-2">
                    <div className="bg-white/[0.02] rounded-xl border border-white/[0.06] p-6 sm:p-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                          <span className="text-purple-400 text-lg">📋</span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-white">
                          Description & Rules
                        </h3>
                      </div>

                      {/* Event Description */}
                      <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6">
                        {event.description ||
                          "Welcome to this event! This is an exciting opportunity to compete with other players and showcase your skills in a competitive environment."}
                      </p>

                      {/* Rules List with Checkmarks */}
                      <div className="space-y-3">
                        {(Array.isArray(event.rules)
                          ? event.rules
                          : [
                              "All participants must be registered before the deadline",
                              "Fair play policy strictly enforced",
                              "All match stats will be recorded",
                              "Prize money will be distributed 45 days after the final match. Please note that payment delays may occur due to processing factors (T&C)",
                            ]
                        ).map((rule, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center mt-0.5">
                              <CheckCircle
                                size={16}
                                className="text-emerald-400"
                              />
                            </div>
                            <p className="text-gray-300 text-sm sm:text-base">
                              {rule}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Important Note Box */}
                      <div className="mt-6 p-4 sm:p-5 rounded-lg border border-amber-500/30 bg-amber-500/5">
                        <div className="flex items-start gap-3">
                          <AlertCircle
                            size={20}
                            className="text-amber-400 flex-shrink-0 mt-0.5"
                          />
                          <div>
                            <p className="text-amber-200 font-semibold text-sm uppercase tracking-wide mb-1">
                              Important Note
                            </p>
                            <p className="text-amber-100/80 text-sm leading-relaxed">
                              All participants must join the official Discord
                              server for match reporting and dispute resolution.
                              Failure to check-in 15 minutes before the start
                              will result in disqualification.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Prize Pool Section */}
                    {/* {event.prizePool > 0 && ( */}
                    <div className="mt-8 p-6 sm:p-8 bg-white/[0.02] rounded-xl border border-white/[0.06]">
                      <div className="flex items-center gap-3 mb-6 sm:mb-8">
                        <Trophy size={28} className="text-yellow-400" />
                        <h3 className="text-lg sm:text-xl font-bold text-white">
                          Prize Pool
                        </h3>
                      </div>

                      {/* Prize Cards Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                        {/* 1st Place */}
                        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/40 rounded-xl p-4 sm:p-6 border border-white/[0.06] flex flex-col items-center justify-center text-center">
                          <div className="text-4xl sm:text-5xl mb-3">🏆</div>
                          <p className="text-yellow-400 font-bold text-sm sm:text-base uppercase tracking-wider mb-2">
                            1st Place
                          </p>
                          <p className="text-2xl sm:text-3xl font-bold text-white">
                            {/* {event.currency}{" "} */}
                            {/* {Math.round(event.prizePool * 0.5).toLocaleString()} */}
                            TBA
                          </p>
                        </div>

                        {/* 2nd Place */}
                        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/40 rounded-xl p-4 sm:p-6 border border-white/[0.06] flex flex-col items-center justify-center text-center">
                          <div className="text-4xl sm:text-5xl mb-3">🥈</div>
                          <p className="text-gray-300 font-bold text-sm sm:text-base uppercase tracking-wider mb-2">
                            2nd Place
                          </p>
                          <p className="text-2xl sm:text-3xl font-bold text-white">
                            {/* {event.currency}{" "} */}
                            {/* {Math.round(event.prizePool * 0.3).toLocaleString()} */}
                            TBA
                          </p>
                        </div>

                        {/* 3rd Place */}
                        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/40 rounded-xl p-4 sm:p-6 border border-white/[0.06] flex flex-col items-center justify-center text-center">
                          <div className="text-4xl sm:text-5xl mb-3">🥉</div>
                          <p className="text-orange-400 font-bold text-sm sm:text-base uppercase tracking-wider mb-2">
                            3rd Place
                          </p>
                          <p className="text-2xl sm:text-3xl font-bold text-white">
                            {/* {event.currency}{" "} */}
                            {/* {Math.round(event.prizePool * 0.2).toLocaleString()} */}
                            TBA
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* )} */}

                    {/* Game Tabs Section - Full 3 columns */}
                    <div className="lg:col-span-3 mt-8">
                      {/* Tabs Navigation */}
                      <div className="border-b border-gray-800 mb-4 sm:mb-6">
                        <div className="flex gap-1 overflow-x-auto pb-px">
                          {tabs.map((tab) => (
                            <button
                              key={tab.id}
                              onClick={() => setActiveTab(tab.id)}
                              className={`px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors relative cursor-pointer ${
                                activeTab === tab.id
                                  ? "text-purple-400"
                                  : "text-gray-400 hover:text-gray-300"
                              }`}
                            >
                              {tab.label}
                              {activeTab === tab.id && (
                                <motion.div
                                  layoutId="activeEventTab"
                                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500"
                                />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Tab Content */}
                      {activeTab === "support" ? (
                        <SupportTab />
                      ) : (
                        <ComingSoonTab activeTab={activeTab} />
                      )}
                    </div>
                  </div>

                  {/* Sidebar - Event Info - 1 column */}
                  <div className="lg:col-span-1">
                    <div className="sticky top-24 space-y-4">
                      {/* Event Info Card */}
                      <div className="bg-white/[0.02] rounded-xl border border-white/[0.06] p-6 sm:p-8">
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-8">
                          Event Info
                        </h3>

                        {/* Info Grid */}
                        <div className="space-y-6">
                          {/* Host */}
                          <div className="flex justify-between items-start">
                            <span className="text-gray-400 text-sm font-medium">
                              Host
                            </span>
                            <span className="text-white font-semibold text-right">
                              {event.host ||
                                event.organizer ||
                                "Inception Games"}
                            </span>
                          </div>

                          {/* Format */}
                          <div className="flex justify-between items-start">
                            <span className="text-gray-400 text-sm font-medium">
                              Format
                            </span>
                            <span className="text-white font-semibold text-right">
                              {event.format || event.game_mode || "Team"}
                            </span>
                          </div>

                          {/* Platform */}
                          <div className="flex justify-between items-start">
                            <span className="text-gray-400 text-sm font-medium">
                              Platform
                            </span>
                            <span className="text-white font-semibold text-right">
                              {event.platform || "All Platforms"}
                            </span>
                          </div>

                          {/* Region */}
                          <div className="flex justify-between items-start">
                            <span className="text-gray-400 text-sm font-medium">
                              Region
                            </span>
                            <span className="text-white font-semibold text-right">
                              {event.location || "Global (GMT)"}
                            </span>
                          </div>

                          {/* Status */}
                          <div className="flex justify-between items-start">
                            <span className="text-gray-400 text-sm font-medium">
                              Status
                            </span>
                            <span
                              className={`font-semibold text-right ${
                                event.status === "Upcoming"
                                  ? "text-emerald-400"
                                  : event.status === "Ongoing"
                                    ? "text-blue-400"
                                    : "text-gray-400"
                              }`}
                            >
                              {event.status === "Upcoming"
                                ? "Registration Open"
                                : event.status === "Ongoing"
                                  ? "In Progress"
                                  : "Completed"}
                            </span>
                          </div>
                        </div>

                        {/* Discord Button */}
                        <a
                          href="https://discord.com/invite/9AtUGVqKs3"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full mt-8 px-4 py-3 rounded-xl font-semibold text-white bg-[#5865F2] hover:bg-[#4752C4] transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.036.055a19.926 19.926 0 0 0 5.993 3.03.077.077 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                          </svg>
                          Join Discord
                        </a>

                        {/* Tournament Registration Button */}
                        {/* <button
                          onClick={() => setShowRegistrationModal(true)}
                          className="w-full mt-4 px-4 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Trophy size={18} />
                          Register for Tournament
                        </button> */}

                        {/* Registration Fill Section */}
                        <div className="mt-8 pt-8 border-t border-white/[0.06]">
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-xs font-bold text-gray-400 tracking-widest">
                              REGISTRATION FILL
                            </span>
                            <span className="text-sm font-bold text-white">
                              {Math.round(
                                ((event.filledSlots || 0) /
                                  (event.totalSlots || 1)) *
                                  100,
                              )}
                              % FILLED
                            </span>
                          </div>

                          {/* Progress Bar */}
                          <div className="w-full h-2 bg-gray-800/50 rounded-full overflow-hidden mb-3">
                            <div
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
                              style={{
                                width: `${Math.round(((event.filledSlots || 0) / (event.totalSlots || 1)) * 100)}%`,
                              }}
                            />
                          </div>

                          {/* Info Text */}
                          <p className="text-sm text-gray-400 text-center">
                            Closes in {registrationDays} day
                            {registrationDays !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Signup Form Modal */}
              <AnimatePresence>
                {showSignupForm && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setShowSignupForm(false)}
                  >
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      onClick={(e) => e.stopPropagation()}
                      className="bg-gradient-to-br from-[#0c0c14] to-[#14141f] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/20"
                    >
                      {/* Modal Header */}
                      <div className="flex items-center justify-between p-6 border-b border-white/10">
                        <h3 className="text-2xl font-bold text-white">
                          Tournament Registration
                        </h3>
                        <button
                          onClick={() => setShowSignupForm(false)}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          <X size={24} />
                        </button>
                      </div>

                      {/* Modal Content */}
                      <div className="p-6">
                        {otpStep ? (
                          <OtpVerificationSection
                            otpStep={otpStep}
                            otpValue={otpValue}
                            otpError={otpError}
                            otpInputRefs={otpInputRefs}
                            formData={formData}
                            onOtpChange={(val) => setOtpValue(val)}
                            onOtpVerify={handleOtpVerify}
                            onResendOtp={handleResendOtp}
                            onCancel={() => {
                              setOtpStep(null);
                              setShowSignupForm(false);
                            }}
                          />
                        ) : (
                          <RegistrationForm
                            event={event}
                            formData={formData}
                            isSubmitting={isSubmitting}
                            isSoloMode={isSoloMode}
                            additionalPlayersCount={additionalPlayersCount}
                            gameName={gameName}
                            onInputChange={handleInputChange}
                            onPlayerChange={handlePlayerChange}
                            onSubmit={handleFormSubmit}
                            onClose={() => setShowSignupForm(false)}
                          />
                        )}
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Success Modal */}
              <SuccessModal
                showSuccessModal={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
              />

              {/* Enhanced Registration Modal with Slot Fields */}
              <AnimatePresence>
                {showRegistrationModal && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setShowRegistrationModal(false)}
                  >
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      onClick={(e) => e.stopPropagation()}
                      className="bg-gradient-to-br from-[#0c0c14] to-[#14141f] rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar border border-purple-500/20"
                    >
                      {/* Modal Header */}
                      <div className="flex items-center justify-between p-6 border-b border-white/10">
                        <h3 className="text-2xl font-bold text-white">
                          {event?.eventType === "Scrims"
                            ? "Scrims Registration"
                            : "Tournament Registration"}
                        </h3>
                        <button
                          onClick={() => setShowRegistrationModal(false)}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          <X size={24} />
                        </button>
                      </div>

                      {/* Event Info */}
                      <div className="p-6 border-b border-white/10">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <Trophy className="text-white" size={24} />
                          </div>
                          <div>
                            <h4 className="text-xl font-semibold text-white">
                              {event.title}
                            </h4>
                            <p className="text-gray-400">
                              {event?.eventType === "Scrims"
                                ? "Scrims"
                                : "Tournament"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Registration Form */}
                      <div className="p-6">
                        <form
                          onSubmit={async (e) => {
                            e.preventDefault();

                            // Prepare registration data based on event type
                            const submitData = {
                              user_id: user?.id || "USR000123",
                              username: user?.username || "",
                              display_name:
                                user?.displayName || formData.fullName,
                              full_name: formData.fullName,
                              email: formData.email,
                              phone: formData.phone,
                              in_game_name: formData.inGameName,
                              in_game_id: formData.inGameId,
                              discord_id: formData.discordId || "",
                              team_name: formData.teamName,
                            };

                            // For scrims, add slot date/time
                            if (event?.eventType === "Scrims") {
                              submitData.slot_date = formData.slotDate;
                              submitData.slot_time = formData.slotTime;
                            }

                            // Add players for team registrations
                            if (
                              formData.players &&
                              formData.players.length > 0
                            ) {
                              submitData.players = formData.players.map(
                                (player) => ({
                                  full_name: player.fullName,
                                  email: player.email,
                                  phone: player.phone,
                                  in_game_name: player.inGameName,
                                  uid: player.uid,
                                  discord_id: player.discordId || "",
                                }),
                              );
                            }

                            try {
                              // Get auth token
                              const tokens = getTokens();

                              // Use production API directly
                              const API_BASE_URL =
                                "https://inception-games.an.r.appspot.com/api/v1";
                              const eventTypeEndpoint =
                                event?.eventType === "Scrims"
                                  ? "scrims"
                                  : "tournaments";
                              const apiUrl = `${API_BASE_URL}/events/${eventTypeEndpoint}/${params.eventId}/register`;

                              // Make API call
                              const headers = {
                                "Content-Type": "application/json",
                              };

                              // Add authorization header if token exists
                              if (tokens?.accessToken) {
                                headers["Authorization"] =
                                  `Bearer ${tokens.accessToken}`;
                              }

                              const response = await fetch(apiUrl, {
                                method: "POST",
                                headers,
                                body: JSON.stringify(submitData),
                              });

                              let result = {};
                              try {
                                result = await response.json();
                              } catch (parseError) {
                                result = {
                                  success: false,
                                  message: "Invalid response from server",
                                };
                              }

                              // Check if the response indicates success
                              const isSuccess =
                                result.success === true && response.ok;

                              if (isSuccess) {
                                // Show success message and close modal
                                Swal.fire({
                                  icon: "success",
                                  title: "Registration Successful!",
                                  text:
                                    result.message ||
                                    "Registration successful! Check your email for confirmation.",
                                  confirmButtonColor: "#a855f7",
                                });
                                setShowRegistrationModal(false);
                                router.push("/profile");

                                // Reset form data
                                setFormData({
                                  fullName: "",
                                  email: "",
                                  phone: "",
                                  inGameName: "",
                                  inGameId: "",
                                  teamName: "",
                                  discordId: "",
                                  socialMedia: "",
                                  portfolio: "",
                                  teamMembers: "",
                                  brandDealType: "solo",
                                  selectedSlotId: "",
                                  slotDate: "",
                                  slotTime: "",
                                  players: [],
                                });
                              } else if (
                                !response.ok ||
                                result.success === false
                              ) {
                                // Handle error responses including 409 conflicts
                                const errorMessage =
                                  result?.message ||
                                  result?.error ||
                                  "Registration failed. Please try again.";
                                Swal.fire({
                                  icon: "warning",
                                  title:
                                    response.status === 409
                                      ? "Already Registered"
                                      : "Registration Failed",
                                  text: errorMessage,
                                  confirmButtonColor: "#a855f7",
                                });
                              } else {
                                Swal.fire({
                                  icon: "error",
                                  title: "Registration Failed",
                                  text: "An unexpected error occurred. Please try again.",
                                  confirmButtonColor: "#a855f7",
                                });
                              }
                            } catch (error) {
                              Swal.fire({
                                icon: "error",
                                title: "Network Error",
                                text:
                                  error?.message ||
                                  "Please check your connection and try again.",
                                confirmButtonColor: "#a855f7",
                              });
                            }
                          }}
                          className="space-y-4"
                        >
                          {/* Slot Date & Time - Only for Scrims */}
                          {event?.eventType === "Scrims" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                  Slot Date *
                                </label>
                                <input
                                  type="date"
                                  required
                                  value={formData.slotDate}
                                  onChange={(e) =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      slotDate: e.target.value,
                                    }))
                                  }
                                  min={new Date().toISOString().split("T")[0]}
                                  className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-colors"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                  Slot Time *
                                </label>
                                <input
                                  type="time"
                                  required
                                  value={formData.slotTime}
                                  onChange={(e) =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      slotTime: e.target.value,
                                    }))
                                  }
                                  className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-colors"
                                />
                              </div>
                            </div>
                          )}

                          {/* Team Name */}
                          {event?.game_mode !== "Solo" && (
                            <div className="relative">
                              <input
                                type="text"
                                required
                                value={formData.teamName}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    teamName: e.target.value,
                                  }))
                                }
                                placeholder=" "
                                className="w-full p-4 pt-6 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all peer"
                              />
                              <label
                                className={`absolute left-4 transition-all pointer-events-none ${
                                  formData.teamName
                                    ? "top-2 text-xs text-purple-400"
                                    : "top-4 text-gray-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-purple-400"
                                }`}
                              >
                                Team Name *
                              </label>
                            </div>
                          )}

                          {/* Full Name */}
                          <div className="relative">
                            <input
                              type="text"
                              required
                              value={formData.inGameName}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  inGameName: e.target.value,
                                }))
                              }
                              placeholder=" "
                              className="w-full p-4 pt-6 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all peer"
                            />
                            <label
                              className={`absolute left-4 transition-all pointer-events-none ${
                                formData.inGameName
                                  ? "top-2 text-xs text-purple-400"
                                  : "top-4 text-gray-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-purple-400"
                              }`}
                            >
                              {event?.game_mode !== "Solo"
                                ? "IGL Name *"
                                : "Full Name *"}
                            </label>
                          </div>

                          {/* Basic Info */}
                          {/* <div className="relative">
                            <input
                              type="text"
                              required
                              value={formData.fullName}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  fullName: e.target.value,
                                }))
                              }
                              placeholder=" "
                              className="w-full p-4 pt-6 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all peer"
                            />
                            <label
                              className={`absolute left-4 transition-all pointer-events-none ${
                                formData.fullName
                                  ? "top-2 text-xs text-purple-400"
                                  : "top-4 text-gray-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-purple-400"
                              }`}
                            >
                              Full Name *
                            </label>
                          </div> */}

                          <div className="relative">
                            <input
                              type="email"
                              required
                              readOnly
                              value={formData.email}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  email: e.target.value,
                                }))
                              }
                              placeholder=" "
                              className="w-full p-4 pt-6 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all peer"
                            />
                            <label
                              className={`absolute left-4 transition-all pointer-events-none ${
                                formData.email
                                  ? "top-2 text-xs text-purple-400"
                                  : "top-4 text-gray-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-purple-400"
                              }`}
                            >
                              {event?.game_mode !== "Solo"
                                ? "IGL Email Address *"
                                : "Email Address *"}
                            </label>
                          </div>

                          <div className="relative">
                            <input
                              type="tel"
                              value={formData.phone}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  phone: e.target.value,
                                }))
                              }
                              placeholder=" "
                              className="w-full p-4 pt-6 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all peer"
                            />
                            <label
                              className={`absolute left-4 transition-all pointer-events-none ${
                                formData.phone
                                  ? "top-2 text-xs text-purple-400"
                                  : "top-4 text-gray-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-purple-400"
                              }`}
                            >
                              Phone Number
                            </label>
                          </div>

                          <div className="relative">
                            <input
                              type="text"
                              required
                              value={formData.inGameId}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  inGameId: e.target.value,
                                }))
                              }
                              placeholder=" "
                              className="w-full p-4 pt-6 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all peer"
                            />
                            <label
                              className={`absolute left-4 transition-all pointer-events-none ${
                                formData.inGameId
                                  ? "top-2 text-xs text-purple-400"
                                  : "top-4 text-gray-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-purple-400"
                              }`}
                            >
                              {event?.game_mode !== "Solo"
                                ? "IGL UID *"
                                : event.game === "EA FC 26"
                                  ? "EA ID / PSN ID *"
                                  : "UID *"}
                            </label>
                          </div>

                          <div className="relative">
                            <input
                              type="text"
                              value={formData.discordId}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  discordId: e.target.value,
                                }))
                              }
                              placeholder=" "
                              className="w-full p-4 pt-6 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all peer"
                            />
                            <label
                              className={`absolute left-4 transition-all pointer-events-none ${
                                formData.discordId
                                  ? "top-2 text-xs text-purple-400"
                                  : "top-4 text-gray-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-purple-400"
                              }`}
                            >
                              {event?.game_mode !== "Solo"
                                ? "IGL Discord ID (optional)"
                                : "Discord ID (optional)"}
                            </label>
                          </div>

                          {/* Team Members */}
                          {event?.game_mode !== "Solo" && (
                            <>
                              <div className="pt-4 border-t border-gray-700">
                                <h4 className="text-lg font-semibold text-white mb-4">
                                  Team Members
                                </h4>
                                <p className="text-sm text-gray-400 mb-4">
                                  {gameName === "Pubg Mobile"
                                    ? "Add 4 team members (5 players total including you as leader)"
                                    : gameName === "Free Fire"
                                      ? "Add 3 team members (4 players total including you as leader)"
                                      : `Add team members for your ${event?.team_size} team`}
                                </p>
                              </div>

                              {/* Player Input Fields */}
                              {formData.players.map((player, index) => (
                                <div
                                  key={index}
                                  className="p-4 rounded-lg border border-gray-700 bg-gray-800/30 space-y-3"
                                >
                                  <h5 className="text-sm font-semibold text-purple-400">
                                    Player {index + 2}
                                  </h5>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Full Name *
                                      </label>
                                      <input
                                        type="text"
                                        value={player.fullName || ""}
                                        onChange={(e) => {
                                          const newPlayers = [
                                            ...formData.players,
                                          ];
                                          newPlayers[index].fullName =
                                            e.target.value;
                                          setFormData((prev) => ({
                                            ...prev,
                                            players: newPlayers,
                                          }));
                                        }}
                                        className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-colors"
                                        placeholder="Full Name"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Email Address *
                                      </label>
                                      <input
                                        type="email"
                                        value={player.email || ""}
                                        onChange={(e) => {
                                          const newPlayers = [
                                            ...formData.players,
                                          ];
                                          newPlayers[index].email =
                                            e.target.value;
                                          setFormData((prev) => ({
                                            ...prev,
                                            players: newPlayers,
                                          }));
                                        }}
                                        className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-colors"
                                        placeholder="Email Address"
                                      />
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Phone Number
                                      </label>
                                      <input
                                        type="tel"
                                        value={player.phone || ""}
                                        onChange={(e) => {
                                          const newPlayers = [
                                            ...formData.players,
                                          ];
                                          newPlayers[index].phone =
                                            e.target.value;
                                          setFormData((prev) => ({
                                            ...prev,
                                            players: newPlayers,
                                          }));
                                        }}
                                        className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-colors"
                                        placeholder="Phone Number"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-300 mb-2">
                                        UID *
                                      </label>
                                      <input
                                        type="text"
                                        value={player.uid || ""}
                                        onChange={(e) => {
                                          const newPlayers = [
                                            ...formData.players,
                                          ];
                                          newPlayers[index].uid =
                                            e.target.value;
                                          setFormData((prev) => ({
                                            ...prev,
                                            players: newPlayers,
                                          }));
                                        }}
                                        className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-colors"
                                        placeholder="UID"
                                      />
                                    </div>

                                    {/* <div>
                                      <label className="block text-sm font-medium text-gray-300 mb-2">
                                        In-Game Name
                                      </label>
                                      <input
                                        type="text"
                                        value={player.inGameName || ""}
                                        onChange={(e) => {
                                          const newPlayers = [...formData.players];
                                          newPlayers[index].inGameName = e.target.value;
                                          setFormData((prev) => ({
                                            ...prev,
                                            players: newPlayers,
                                          }));
                                        }}
                                        className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-colors"
                                        placeholder="In-Game Name"
                                      />
                                    </div> */}
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Discord ID (optional)
                                      </label>
                                      <input
                                        type="text"
                                        value={player.discordId || ""}
                                        onChange={(e) => {
                                          const newPlayers = [
                                            ...formData.players,
                                          ];
                                          newPlayers[index].discordId =
                                            e.target.value;
                                          setFormData((prev) => ({
                                            ...prev,
                                            players: newPlayers,
                                          }));
                                        }}
                                        className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-colors"
                                        placeholder="Discord ID (optional)"
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </>
                          )}

                          {/* Action Buttons */}
                          <div className="pt-6 flex gap-3">
                            <button
                              type="button"
                              onClick={() => setShowRegistrationModal(false)}
                              className="flex-1 px-6 py-3 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800/50 transition-colors cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
                            >
                              Submit Registration
                              <ArrowRight size={16} />
                            </button>
                          </div>
                        </form>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function OtpVerificationSection({
  otpStep,
  otpValue,
  otpError,
  otpInputRefs,
  formData,
  onOtpChange,
  onOtpVerify,
  onResendOtp,
  onCancel,
}) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
        {otpStep === "success" ? (
          <CheckCircle size={32} className="text-white" />
        ) : (
          <Shield size={32} className="text-white" />
        )}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">
        {otpStep === "success"
          ? "Registration Complete!"
          : otpStep === "sending" || otpStep === "verifying"
            ? "Please Wait..."
            : "Verify Your Email"}
      </h3>
      <p className="text-gray-400 text-sm mb-4">
        {otpStep === "success"
          ? "You have been registered successfully"
          : otpStep === "sending"
            ? "Sending verification code..."
            : otpStep === "verifying"
              ? "Verifying your code..."
              : `We sent a code to ${formData.email}`}
      </p>

      {(otpStep === "sending" || otpStep === "verifying") && (
        <div className="py-8">
          <Loader2 className="animate-spin text-purple-400 mx-auto" size={40} />
        </div>
      )}

      {otpStep === "success" && (
        <div className="py-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle className="text-green-400" size={40} />
          </div>
        </div>
      )}

      {otpStep === "input" && (
        <div className="space-y-4">
          <div className="flex justify-center gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <input
                key={i}
                ref={(el) => {
                  otpInputRefs.current[i] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                className="w-10 h-12 rounded-lg bg-gray-800 border border-gray-700 text-center text-xl font-bold text-white focus:border-purple-500 outline-none transition-all"
                value={otpValue[i] || ""}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  const newOtp =
                    otpValue.slice(0, i) + val + otpValue.slice(i + 1);
                  onOtpChange(newOtp.slice(0, 6));
                  if (val && i < 5) otpInputRefs.current[i + 1]?.focus();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Backspace" && !otpValue[i] && i > 0) {
                    otpInputRefs.current[i - 1]?.focus();
                  }
                }}
              />
            ))}
          </div>

          {otpError && (
            <p
              className={`text-sm ${
                otpError.includes("resent") ? "text-green-400" : "text-red-400"
              }`}
            >
              {otpError}
            </p>
          )}

          <button
            onClick={onOtpVerify}
            disabled={otpValue.length < 4}
            className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            Verify & Complete <ArrowRight size={16} />
          </button>

          <div className="flex items-center justify-between text-sm">
            <button
              onClick={onResendOtp}
              className="text-purple-400 hover:text-purple-300 transition"
            >
              Resend OTP
            </button>
            <button
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function RegistrationForm({
  event,
  formData,
  isSubmitting,
  isSoloMode,
  additionalPlayersCount,
  gameName,
  onInputChange,
  onPlayerChange,
  onSubmit,
  onClose,
}) {
  return (
    <>
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-lg sm:text-xl font-bold text-white">
          {event.eventType} Registration
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X size={18} className="sm:w-5 sm:h-5" />
        </button>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 p-2 sm:p-3 bg-gray-800 rounded-lg">
        <Image
          src={
            event.gameImage ||
            "https://res.cloudinary.com/jvpygp4b/image/upload/v1783148367/pubg_ss1pcn.png"
          }
          alt={gameName}
          width={40}
          height={40}
          className="rounded-lg w-10 h-10 sm:w-12 sm:h-12"
        />
        <div className="min-w-0">
          <p className="text-white font-semibold text-sm sm:text-base truncate">
            {gameName}
          </p>
          <p className="text-gray-400 text-xs sm:text-sm truncate">
            {event.eventType}
          </p>
        </div>
      </div>

      {event.eventType === "Brand Deal" && (
        <div className="mb-3 sm:mb-4 grid grid-cols-2 gap-2 sm:gap-3">
          {["solo", "team"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => (formData.brandDealType = type)}
              className={`p-2 sm:p-3 rounded-lg border-2 transition-all ${
                formData.brandDealType === type
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-gray-700 hover:border-gray-600"
              }`}
            >
              <p className="text-white font-semibold text-sm sm:text-base capitalize">
                {type}
              </p>
              <p className="text-gray-400 text-xs">
                BDT {type === "solo" ? 499 : 999}
              </p>
            </button>
          ))}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-3">
        <AnimatedInput
          label="Full Name"
          name="fullName"
          value={formData.fullName}
          onChange={onInputChange}
          required
        />
        <AnimatedInput
          label={
            ["EA FC 26", "Efootball Mobile", "Street Fighter 6"].includes(
              gameName,
            )
              ? "Email Address"
              : "IGL Email Address"
          }
          type="email"
          name="email"
          value={formData.email}
          onChange={onInputChange}
          required
        />
        <AnimatedInput
          label="Phone Number"
          name="phone"
          value={formData.phone}
          onChange={onInputChange}
          required
        />

        {event.eventType === "Tournament" && (
          <>
            <AnimatedInput
              label="In-Game Name"
              name="inGameName"
              value={formData.inGameName}
              onChange={onInputChange}
              required
            />
            <AnimatedInput
              label="In-Game ID"
              name="inGameId"
              value={formData.inGameId}
              onChange={onInputChange}
              required
            />
            {event.game_mode !== "Solo" && (
              <AnimatedInput
                label="Team Name"
                name="teamName"
                value={formData.teamName}
                onChange={onInputChange}
                required
              />
            )}
            <AnimatedInput
              label="Discord ID (optional)"
              name="discordId"
              value={formData.discordId}
              onChange={onInputChange}
            />
          </>
        )}

        {event.eventType === "Scrims" && (
          <>
            {!isSoloMode && (
              <AnimatedInput
                label="Team Name"
                name="teamName"
                value={formData.teamName}
                onChange={onInputChange}
                required
              />
            )}

            <AnimatedInput
              label={isSoloMode ? "In-Game Name" : "IGL Name"}
              name="inGameName"
              value={formData.inGameName}
              onChange={onInputChange}
              required
            />
            <AnimatedInput
              label={
                gameName === "EA FC 26"
                  ? "Steam ID / PSN ID"
                  : gameName === "Efootball Mobile"
                    ? "Game ID"
                    : gameName === "Street Fighter 6"
                      ? "Capcom ID"
                      : isSoloMode
                        ? "In-Game UID"
                        : "IGL UID"
              }
              name="inGameId"
              value={formData.inGameId}
              onChange={onInputChange}
              required
            />
            <AnimatedInput
              label={
                isSoloMode
                  ? "Discord ID (optional)"
                  : "IGL Discord ID (optional)"
              }
              name="discordId"
              value={formData.discordId}
              onChange={onInputChange}
            />

            {!isSoloMode && additionalPlayersCount > 0 && (
              <div className="pt-1">
                <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2">
                  Team Members ({additionalPlayersCount})
                </p>
              </div>
            )}
            {!isSoloMode &&
              formData.players.map((player, index) => (
                <PlayerInputs
                  key={index}
                  index={index}
                  player={player}
                  onPlayerChange={onPlayerChange}
                />
              ))}
          </>
        )}

        {event.eventType === "Brand Deal" && (
          <>
            <AnimatedInput
              label="Social Media Links"
              name="socialMedia"
              value={formData.socialMedia}
              onChange={onInputChange}
              required
            />
            <AnimatedInput
              label="Portfolio/Content Links"
              name="portfolio"
              value={formData.portfolio}
              onChange={onInputChange}
            />
            {formData.brandDealType === "team" && (
              <AnimatedInput
                label="Team Members"
                type="textarea"
                name="teamMembers"
                value={formData.teamMembers}
                onChange={onInputChange}
              />
            )}
          </>
        )}

        <motion.button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" size={20} /> Processing...
            </>
          ) : (
            <>
              Submit Registration <ArrowRight size={16} />
            </>
          )}
        </motion.button>
      </form>
    </>
  );
}

function PlayerInputs({ index, player, onPlayerChange }) {
  return (
    <div className="space-y-3 p-3 rounded-xl border border-gray-700 bg-gray-800/40">
      <p className="text-sm font-semibold text-white">Player {index + 2}</p>
      <AnimatedInput
        label="Full Name"
        value={player.full_name}
        onChange={(e) => onPlayerChange(index, "full_name", e.target.value)}
        required
      />
      <AnimatedInput
        label="Email Address"
        type="email"
        value={player.email}
        onChange={(e) => onPlayerChange(index, "email", e.target.value)}
        required
      />
      <AnimatedInput
        label="Phone Number"
        value={player.phone}
        onChange={(e) => onPlayerChange(index, "phone", e.target.value)}
      />
      <AnimatedInput
        label="In-Game Name"
        value={player.in_game_name}
        onChange={(e) => onPlayerChange(index, "in_game_name", e.target.value)}
        required
      />
      <AnimatedInput
        label="In-Game ID"
        value={player.in_game_id}
        onChange={(e) => onPlayerChange(index, "in_game_id", e.target.value)}
        required
      />
      <AnimatedInput
        label="Discord ID (optional)"
        value={player.discord_id}
        onChange={(e) => onPlayerChange(index, "discord_id", e.target.value)}
      />
    </div>
  );
}

function ComingSoonTab({ activeTab }) {
  const messages = {
    result: "Tournament results will be posted here once the event concludes.",
    brackets: "Brackets will be revealed once the tournament begins.",
    schedule: "The full schedule will be published closer to the event date.",
    participants: "Participant list will be visible after registration closes.",
    rules: "Rules & guidelines will be available before the event starts.",
  };

  return (
    <div className="bg-white/[0.02] rounded-xl border border-white/[0.06] p-6">
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 mb-5 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20 flex items-center justify-center">
          <Clock size={28} className="text-purple-400" />
        </div>
        <h4 className="text-lg font-bold text-white mb-2">Coming Soon</h4>
        <p className="text-gray-500 text-sm max-w-xs">{messages[activeTab]}</p>
        <div className="mt-5 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20">
          <span className="text-purple-400 text-xs font-medium tracking-wide uppercase">
            Stay Tuned
          </span>
        </div>
      </div>
    </div>
  );
}

function SupportTab() {
  return (
    <div className="bg-white/[0.02] rounded-xl border border-white/[0.06] p-6">
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <h4 className="text-lg font-bold text-white mb-2">Contact Support</h4>
        <p className="text-gray-500 text-sm max-w-xs">
          For any kind of update, contact our Facebook page.
        </p>
        <a
          href="https://www.facebook.com/profile.php?id=61562495805179"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium hover:bg-purple-500/20 transition"
        >
          Visit Facebook Page
        </a>
      </div>
    </div>
  );
}

function SuccessModal({ showSuccessModal, onClose }) {
  return (
    <AnimatePresence>
      {showSuccessModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="bg-gray-900 border border-white/10 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-5">
              <CheckCircle size={32} className="text-emerald-400" />
            </div>

            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full mb-4">
              Phase 1 Complete
            </span>

            <h2 className="text-2xl font-bold text-white mb-2">
              Registration Successful!
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              You&apos;re locked in for Phase 1. Check your email for the
              verification message confirming that you have been added.
            </p>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all duration-300"
            >
              Got it!
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
