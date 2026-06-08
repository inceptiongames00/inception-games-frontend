"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  Share2,
  Loader2,
  ArrowLeft,
  Trophy,
  Gamepad2,
  DollarSign,
  Target,
  CheckCircle,
  AlertCircle,
  Monitor,
  Smartphone,
  Flag,
} from "lucide-react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import CombinedSignupJoinForm from "../../components/AuthModals/CombinedSignupJoinForm";
import SharePreview from "../../components/SharePreview";
import { useAuth } from "@/hooks/useAuth";

// Games data
const games = [
  { id: "ea-fc-26", name: "EA FC 26", image: "/games/fifapc.png" },
  { id: "efootball", name: "eFootball", image: "/games/efootballpc.png" },
  { id: "valorant", name: "VALORANT", image: "/games/valorant.png" },
  { id: "cs2", name: "Counter-Strike 2", image: "/games/csgo.png" },
  { id: "dota2", name: "Dota 2", image: "/games/dota2.png" },
  { id: "lol", name: "League of Legends", image: "/games/lol.png" },
];

// Helper to get game image from name
function getGameImage(gameName) {
  const searchTerm = (gameName || "").toLowerCase();
  const matchedGame = games.find(
    (g) =>
      searchTerm.includes(g.name.toLowerCase()) ||
      g.name.toLowerCase().includes(searchTerm.split(" ")[0]),
  );
  return matchedGame?.image || "/games/pubg.png";
}

const getOrdinal = (n) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

const formatDate = (dateStr) => {
  if (!dateStr) return "TBD";
  const date = new Date(dateStr);
  const day = getOrdinal(date.getDate());
  const month = date.toLocaleDateString("en-GB", { month: "short" });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

function formatTime(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default function EventDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.eventId;
  
  const { isAuthenticated, user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [activeTab, setActiveTab] = useState("rules");
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  });

  useEffect(() => {
    fetchEventDetails();
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);

      // The updated scrims API returns { total, scrims: [...] }.
      // There is no single-scrim endpoint, so fetch the list and match by id.
      try {
        const response = await fetch(
          "https://inception-games.an.r.appspot.com/api/v1/scrims"
        );

        if (response.ok) {
          const data = await response.json();
          const allScrims = data.scrims || data.data || [];

          const matchedScrim = allScrims.find(
            (s) => s.id === eventId || s.id === parseInt(eventId)
          );

          if (matchedScrim) {
            setEvent(matchedScrim);
          }
        }
      } catch (e) {
        console.error("[v0] Failed to fetch scrims list:", e);
      }
    } catch (error) {
      console.error("Error fetching event details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030305] text-white pt-24 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={40} className="text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#030305] text-white pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
              <Trophy size={32} className="text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Event Not Found</h2>
            <p className="text-gray-400 mb-6">The event you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => router.push("/events")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg text-purple-300 font-semibold transition-all"
            >
              <ArrowLeft size={18} />
              Back to Events
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  const eventImage = event.banner_image || event.image || getGameImage(event.game_name || event.gameName || event.title);
  const gameName = event.game?.name || event.game_name || event.gameName || "Gaming Event";
  const gameImage = getGameImage(gameName);
  const status = event.status || "Upcoming";

  const tabs = [
    { id: "rules", label: "Rules" },
    { id: "brackets", label: "Brackets" },
    { id: "schedule", label: "Schedule" },
    { id: "participants", label: "Participants" },
  ];

  const progressionSteps = [
    { 
      label: "Reg Starting", 
      date: event.reg_start_at || event.registration_start_date || event.registrationStart,
      time: event.registration_start_time || "TBD"
    },
    { 
      label: "Reg Ending", 
      date: event.reg_end_at || event.registration_end_date || event.registrationEnd,
      time: event.registration_end_time || "TBD"
    },
    { 
      label: "Match Starts", 
      date: event.start_at || event.tournament_start_date || event.tournamentStart,
      time: event.tournament_start_time || "TBD"
    },
    { 
      label: "Match Ends", 
      date: event.end_at || event.tournament_end_date || event.tournamentEnd,
      time: event.tournament_end_time || "TBD"
    },
  ];

  return (
    <div className="min-h-screen bg-[#030305]">
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

      <main className="pt-20">
        {/* Back Button */}
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Events</span>
          </button>
        </div>

        <div className="max-w-6xl mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Banner */}
              <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-6">
                <Image
                  src={eventImage}
                  alt={event.title}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/games/pubg.png";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-black/50 to-transparent" />

                {/* Status Badge */}
                <div className="absolute top-4 right-4 px-4 py-2 rounded-full bg-purple-600/80 backdrop-blur-md border border-purple-400/50 font-semibold text-sm text-white">
                  {status}
                </div>

                {/* Bottom Overlay */}
                <div className="absolute bottom-0 left-0 right-0 px-4 py-3 flex items-end justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-300 text-sm font-medium">
                      {formatDate(event.date || event.start_date)}
                    </span>
                  </div>

                  {/* Circular badges */}
                  <div className="flex items-center gap-3">
                    {event.location && (
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center backdrop-blur-sm shadow-lg shadow-purple-500/30">
                          <Flag size={14} className="text-white" />
                        </div>
                        <span className="text-gray-400 text-xs text-center max-w-[40px] truncate">
                          {event.location}
                        </span>
                      </div>
                    )}

                    {event.platform && (
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center backdrop-blur-sm shadow-lg shadow-purple-500/30">
                          <Monitor size={14} className="text-white" />
                        </div>
                        <span className="text-gray-400 text-xs text-center max-w-[40px] truncate">
                          {event.platform}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                {event.title}
              </h1>

              {/* Game + Actions Row */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                    <Image
                      src={gameImage}
                      alt={gameName}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-white font-semibold text-lg">
                    {gameName}
                  </span>
                </div>

                <SharePreview event={event} />
              </div>

              {/* Tournament Progression */}
              {progressionSteps.some(s => s.date) && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-white mb-6">Tournament Progression</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {progressionSteps.map((step, idx) => (
                      <div
                        key={idx}
                        className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 rounded-xl border border-gray-700/50 hover:border-purple-500/50 transition-colors"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                            <CheckCircle size={14} className="text-white" />
                          </div>
                          <h3 className="text-white font-semibold text-sm">{step.label}</h3>
                        </div>
                        <div className="space-y-1">
                          <p className="text-gray-400 text-xs">
                            {step.date ? formatDate(step.date) : "TBD"}
                          </p>
                          <p className="text-gray-400 text-xs">
                            {step.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab Navigation */}
              <div className="flex gap-0 mb-8 border-b border-gray-700">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                      activeTab === tab.id
                        ? "border-purple-500 text-purple-400"
                        : "border-transparent text-gray-400 hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="mb-12">
                {activeTab === "rules" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h3 className="text-xl font-bold text-white mb-4">Rules & Requirements</h3>
                    <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700/50">
                      {event.rules ? (
                        <ul className="space-y-3 text-gray-300">
                          {typeof event.rules === "string"
                            ? event.rules.split("\n").map((rule, idx) =>
                                rule.trim() ? (
                                  <li key={idx} className="flex gap-3">
                                    <span className="text-purple-400">•</span>
                                    <span>{rule.trim()}</span>
                                  </li>
                                ) : null
                              )
                            : Array.isArray(event.rules)
                              ? event.rules.map((rule, idx) => (
                                  <li key={idx} className="flex gap-3">
                                    <span className="text-purple-400">•</span>
                                    <span>{rule}</span>
                                  </li>
                                ))
                              : (
                                  <li className="flex gap-3">
                                    <span className="text-purple-400">•</span>
                                    <span>{event.rules}</span>
                                  </li>
                                )}
                        </ul>
                      ) : (
                        <p className="text-gray-400">No rules specified yet.</p>
                      )}
                    </div>
                  </motion.div>
                )}

                {activeTab === "brackets" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-700/50 text-center">
                      <p className="text-gray-400">Bracket information coming soon...</p>
                    </div>
                  </motion.div>
                )}

                {activeTab === "schedule" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-700/50 text-center">
                      <p className="text-gray-400">Schedule details coming soon...</p>
                    </div>
                  </motion.div>
                )}

                {activeTab === "participants" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-700/50 text-center">
                      <p className="text-gray-400">Participant list coming soon...</p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Description */}
              {event.description && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-white mb-4">About This Event</h2>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {event.description}
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-28 space-y-6">
                {/* Join Button */}
                <button
                  onClick={() => setShowJoinForm(true)}
                  className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-lg transition-all hover:shadow-lg hover:shadow-purple-500/30"
                >
                  {isAuthenticated ? "Join Event" : "Sign Up & Join"}
                </button>

                {/* Event Info Card */}
                <div className="bg-gradient-to-b from-gray-900/80 to-gray-900/40 p-6 rounded-lg border border-gray-700/50 backdrop-blur-md">
                  <h3 className="text-lg font-bold text-white mb-4">Event Info</h3>

                  {event.location && (
                    <div className="mb-4 pb-4 border-b border-gray-700/50">
                      <p className="text-gray-400 text-sm mb-2 flex items-center gap-2">
                        <MapPin size={16} />
                        Location
                      </p>
                      <p className="text-white font-semibold">{event.location}</p>
                    </div>
                  )}

                  {event.start_time && (
                    <div className="mb-4 pb-4 border-b border-gray-700/50">
                      <p className="text-gray-400 text-sm mb-2 flex items-center gap-2">
                        <Clock size={16} />
                        Start Time
                      </p>
                      <p className="text-white font-semibold">{event.start_time}</p>
                    </div>
                  )}

                  {event.platform && (
                    <div>
                      <p className="text-gray-400 text-sm mb-2">Platform</p>
                      <p className="text-white font-semibold">{event.platform}</p>
                    </div>
                  )}
                </div>

                {/* Share Card */}
                <div className="w-full">
                  <SharePreview event={event} />
                </div>

                {/* Back Button */}
                <button
                  onClick={() => router.push("/events")}
                  className="w-full py-3 px-4 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 rounded-lg text-gray-300 font-semibold transition-all"
                >
                  ← Back to Events
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Join Event Form Modal */}
      <CombinedSignupJoinForm
        event={event}
        isOpen={showJoinForm}
        onClose={() => setShowJoinForm(false)}
        isAuthenticated={isAuthenticated}
      />
    </div>
  );
}
